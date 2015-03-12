---
layout: post
published: true
title: QNAP QDK QPKG and the GPL
---

> This is the first part of a two-part post on what it took to get Plex
> Media Server running on QNAP TS-219P2+ NAS device. Be sure to read the
> second part [here](/posts/2015-03-11-plex-on-debian-arm/).

I wanted to run [Plex Media Server](https://plex.tv) on my QNAP
TS-219P2+, which is running Debian Wheezy (as described in a previous
[blog post](/posts/qnap-ts219p-ii-debian-install/)). For my particular
hardware Plex provides a binary package using the QNAP qpkg format.

This led me on a merry adventure to understand the QDK (QNAP Development
Kit!) and the QPKG (QNAP package!) format. What I found was a possible
GPL violation. I have rectified that mistake to a degree by hosting the
code on [GitHub](https://github.com/mturquette/qdk). In addition I'll
outline my thought process during this work and the reverse engineering
methods I used below.

# Plex Media Server

I started by downloading the software that I wanted to run on my NAS at
the [Plex download page](https://plex.tv/downloads). For those following
along simply run:

```
wget https://downloads.plex.tv/plex-media-server/0.9.11.7.803-87d0708/PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg
```

OK, so we have this ... thing. What is it?

```
$ file PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg
PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg: data
```

Not terribly useful. Let's take a closer look at the first 160 bytes of
this file.

```
$ hexdump -C PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg | head
00000000  23 21 2f 62 69 6e 2f 73  68 0a 77 72 6f 6e 67 5f  |#!/bin/sh.wrong_|
00000010  61 72 63 68 28 29 7b 0a  20 6c 6f 63 61 6c 20 77  |arch(){. local w|
00000020  72 6f 6e 67 5f 61 72 63  68 5f 6d 73 67 3d 22 57  |rong_arch_msg="W|
00000030  72 6f 6e 67 20 61 72 63  68 69 74 65 63 74 75 72  |rong architectur|
00000040  65 3a 20 50 6c 65 78 4d  65 64 69 61 53 65 72 76  |e: PlexMediaServ|
00000050  65 72 20 30 2e 39 2e 31  31 2e 37 2e 38 20 69 73  |er 0.9.11.7.8 is|
00000060  20 62 75 69 6c 74 20 66  6f 72 20 61 72 6d 2d 78  | built for arm-x|
00000070  31 39 22 0a 20 65 63 68  6f 20 22 49 6e 73 74 61  |19". echo "Insta|
00000080  6c 6c 61 74 69 6f 6e 20  41 62 6f 72 74 2e 22 20  |llation Abort." |
00000090  26 26 20 65 63 68 6f 20  22 24 77 72 6f 6e 67 5f  |&& echo "$wrong_|
```

Now that _was_ useful. It looks like at least the beginning of the file
is a shell script. In that case the whole thing is a likely meant to be
executed. Before we try running this script on our system as root and
trash the hard drive, let's take an even closer look.

```
$ less PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg

#!/bin/sh
wrong_arch(){
 local wrong_arch_msg="Wrong architecture: PlexMediaServer 0.9.11.7.8 is built for arm-x19"
 echo "Installation Abort." && echo "$wrong_arch_msg"
 /sbin/log_tool -t2 -uSystem -p127.0.0.1 -mlocalhost -a "$wrong_arch_msg"
 echo -1 > /tmp/update_process && exit 1
}
arch_ok(){
 local cpu_arch=$(/bin/uname -m)
 [ $(/usr/bin/expr match "$cpu_arch" "armv5tel") -ne 0 ] || return 1
}
/bin/echo "Install QNAP package on TS-NAS..."
/bin/grep "/mnt/HDA_ROOT" /proc/mounts >/dev/null 2>&1 || exit 1
arch_ok || wrong_arch
_EXTRACT_DIR="/mnt/HDA_ROOT/update_pkg/tmp"
/bin/mkdir -p $_EXTRACT_DIR || exit 1
script_len=1048
/bin/dd if=${0} bs=$script_len skip=1 | /bin/tar -xO | /bin/tar -xzv -C $_EXTRACT_DIR || exit 1
offset=$(/usr/bin/expr $script_len + 20480)
/bin/dd if=${0} bs=$offset skip=1 | /bin/cat | /bin/dd bs=1024 count=96286 of=$_EXTRACT_DIR/data.tar.gz || exit 1
offset=$(/usr/bin/expr $offset + 98596375)
( cd $_EXTRACT_DIR && /bin/sh qinstall.sh || echo "Installation Abort." )
/bin/rm -fr $_EXTRACT_DIR && exit 10
exit 1
control.tar.gzLOTSOFBINARYDATA...
```

After `control.tar.gz` the file is packed with binary data. To be
precise the `control.tar.gz` text is also part of that binary data,
which I will explain later.

Inspecting the shell script clearly shows that the blob is meant to be
executed and it will install Plex Media Server to some hard-coded path.
That path makes sense if you run the QNAP factory software, but I run
Debian. Perhaps more intriguing is this qinstall.sh script. What does it
do and where can I find it?

## qpkg installer and the qdk

Some Google searching quickly taught me that qinstall.sh is part of the
QNAP Development Kit, aka QDK. OK, great an sdk. How nice of them.
Now where can I find it?

After searching Google, the [QNAP forums](http://forum.qnap.com) and the
[QNAP wiki](http://wiki.qnap.com/wiki/QPKG_Development_Guidelines) for
this elusive sdk I came to some conclusions:

1. The main place to get the QDK is as a zip file attached to this
[forum
post](http://forum.qnap.com/viewtopic.php?f=128&t=36132&p=157747&hilit=qdk+gpl#p157747)
1. It is [licensed under the
GPLv2](http://wiki.qnap.com/wiki/QPKG_Development_Guidelines#License)
and I quote, "making it completely open and available for anyone to
use"
1. The only way to get the QDK source code is to install the QDK. The
only way to install the QDK is to install it via your previously
existing installation of the QDK.

## Wait, what?

I am not a lawyer but I wonder if this constitutes a GPL violation? QNAP
distributes a binary version of GPL-licensed source code but not the
source in a reasonable format.

No problem! Just ask them for the source. I think that is what the FSF
would want me to do.

<a href="http://forum.qnap.com/viewtopic.php?f=128&t=99769"
target="_blank">
<img src="/images/qnap-qdk-qpkg-and-the-gpl/forum.png"
border="2" style="border:2px solid black;max-width:640px;" alt="No
replies :-(" />
</a>

Well that went nowhere. I think it would be faster to reverse engineer
it.

## h4king the Plex qpkg

The forum post I mentioned earlier has a link to a [pdf
document](http://forum.qnap.com/download/file.php?id=4851). Appendix A
on page 35 shows the qpkg format and page 36 has an example header
script that looks shockingly like the one prepended to the binary data
in our Plex qpkg!

Appendix A tells us that both the Control section and the Data sections
are gzipped tarballs wrapped in non-compresses tarballs. Genius. This
jives pretty well with the header script that we looked at earlier.
Maybe we can just use tar to get at this data! We'll need to remove the
header script from the binary package first. Examining the header script
we can see that this is something it does already. The interesting bits
are script_len and offset. Removing some QNAP-specific crap from the
header script embedded into the Plex qpkg yields:

```
#!/bin/sh
_EXTRACT_DIR="/mnt/HDA_ROOT/update_pkg/tmp"
/bin/mkdir -p $_EXTRACT_DIR || exit 1
script_len=1048
/bin/dd if=${0} bs=$script_len skip=1 | /bin/tar -xO | /bin/tar -xzv -C $_EXTRACT_DIR || exit 1
offset=$(/usr/bin/expr $script_len + 20480)
/bin/dd if=${0} bs=$offset skip=1 | /bin/cat | /bin/dd bs=1024 count=96286 of=$_EXTRACT_DIR/data.tar.gz || exit 1
offset=$(/usr/bin/expr $offset + 98596375)
( cd $_EXTRACT_DIR && /bin/sh qinstall.sh || echo "Installation Abort." )
/bin/rm -fr $_EXTRACT_DIR && exit 10
exit 1
```

So script_len gets us past the script where can untar some stuff, likely
the Control section of the package. Since we all have the [tar file
format](http://en.wikipedia.org/wiki/Tar_\(computing\)#Header) committed
to memory we can even postulate that the `control.tar.gz` seen at the
end of the script is really the filename of the first (and only) file
within the Control section tarball. It is not a plaintext portion of the
header script, but instead the first bytes of the Control section.

The next section of the header script adds script_len to a magic number
of bytes and we unpack an additional tarball, likely the Data section of
the package since we store this data on disk as data.tar.gz. Finally
qinstall.sh is run, which we don't have. Let's ignore qinstall.sh for
now. It probably sucks anyways. The following not-very-portable script
emerged from me stripping the config header, removing the QNAP-specific
bits and dumping the uncompressed files:

<script src="https://gist.github.com/mturquette/0d4de9b20343fafecf2b.js"></script>

This fun little script counts how many lines of text precede the string
`control.tar.gz`, removes aforementioned lines and saves the modified
image to a temporary file in directory 'out'. From this point it is a
simple matter of unpacking an uncompressed tarball which contains a
compressed tarball, control.tar.gz, then skipping 20KB from the
beginning of this temporary file and doing the same thing over again for
data.tar.gz.

There is some miscellaneous data at the end of the blob which will cause
tar to spit some warnings, but at the end you should have a nice
control.tar.gz and a data.tar.gz. Yay! Notice that the 20KB offset for
data.tar.gz is still hard-coded into my script. I think that these
offsets might be in multiples of 5KB or 10KB and I'll come back to that
later.

Inspecting data.tar.gz reveals all of the files needed for Plex. Mission
accomplished. Hurray!

I'll revisit actually making Plex work on Debian in my next post. For
now let's see if the script above is generic enough to unpack any qpkg.
A fun test might be trying to unpack the root cause of all of my
problems: the QNAP QDK QPKG!

## breaking the cycle

The short answer is it doesn't work straight off:

```
$ ./unpack_qpkg.sh QDK_2.2.2.qpkg
Files generated in directory 'out'
Removing 14 lines of header script before control.tar.gz
77+1 records in
77+1 records out
39709 bytes (40 kB) copied, 0.000428835 s, 92.6 MB/s
./
./qpkg.cfg
./md5sum
./package_routines
./qinstall.sh
0+1 records in
0+1 records out
18+1 records in
18+1 records out
19229 bytes (19 kB) copied, 0.00126722 s, 15.2 MB/s
19229 bytes (19 kB) copied, 0.00814744 s, 2.4 MB/s
$ ls out/*
out/control.tar.gz  out/newQDK_2.2.2.qpkg

out/control:
md5sum  package_routines  qinstall.sh  qpkg.cfg

out/data:
data.tar.gz
$ tar -tzf out/data/data.tar.gz

gzip: stdin: not in gzip format
tar: Child returned status 1
tar: Error is not recoverable: exiting now
```

Well control.tar.gz seems to decompress and unpack just fine. Why not
data.tar.gz? At a guess, maybe the offset is wrong? Inspecting the first
lines of QDK_2.2.2.qpkg shows us:

```
#!/bin/sh
/bin/echo "Install QNAP package on TS-NAS..."
/bin/grep "/mnt/HDA_ROOT" /proc/mounts >/dev/null 2>&1 || exit 1
_EXTRACT_DIR="/mnt/HDA_ROOT/update_pkg/tmp"
/bin/mkdir -p $_EXTRACT_DIR || exit 1
script_len=627
/bin/dd if=${0} bs=$script_len skip=1 | /bin/tar -xO | /bin/tar -xzv -C $_EXTRACT_DIR || exit 1
offset=$(/usr/bin/expr $script_len + 10240)
/bin/dd if=${0} bs=$offset skip=1 | /bin/cat | /bin/dd bs=1024 count=29 of=$_EXTRACT_DIR/data.tar.gz || exit 1
offset=$(/usr/bin/expr $offset + 29369)
( cd $_EXTRACT_DIR && /bin/sh qinstall.sh || echo "Installation Abort." )
/bin/rm -fr $_EXTRACT_DIR && exit 10
exit 1
```

The magic offset value is 10K bytes, half of what it was for the Plex package. Replacing 20480 with 10240 in unpack_qpkg.sh gets things working:

```
$ ./unpack_qpkg.sh QDK_2.2.2.qpkg
Files generated in directory 'out'
Removing 14 lines of header script before control.tar.gz
77+1 records in
77+1 records out
39709 bytes (40 kB) copied, 0.000439275 s, 90.4 MB/s
./
./qpkg.cfg
./md5sum
./package_routines
./qinstall.sh
28+1 records in
28+1 records out
29469 bytes (29 kB) copied2+1 records in
2+1 records out
, 0.00689956 s, 4.3 MB/s
29469 bytes (29 kB) copied, 0.00411324 s, 7.2 MB/s
$ tar -tzf out/data/data.tar.gz
./
./.qpkg_icon.gif
./template/
./template/arm-x09/
./template/qpkg.cfg
./template/config/
./template/shared/
./template/shared/init.sh
./template/icons/
./template/x86_64/
./template/x86/
./template/package_routines
./template/arm-x19/
./qdk
./bin/
./bin/qbuild
./.qpkg_icon_80.gif
./scripts/
./scripts/qinstall.sh
./.qpkg_icon_gray.gif

gzip: stdin: decompression OK, trailing garbage ignored
tar: Child returned status 2
tar: Error is not recoverable: exiting now
```

Again the warnings at the end are fine. The point is that we can now
access the source files to the QDK, including qinstall.sh. Do we need
that crap anymore? Probably not. We already unpacked the Plex qpkg
manually. However this whole GPL-code-wrapped-in-a-binary-package thing
has got me irked. It feels wrong. If only there was something I could
do... what about hosting the QDK sources on GitHub?
[Done](https://github.com/mturquette/qdk).

While I do not plan to use these scripts _ever_, I don't want someone
else to run into the same boostrapping problem that I did. Now anyone
that wants to use these scripts to build, modify or unpack qpkgs can do
so without having to first buy a QNAP device and install the QDK qpkg.

## conclusion

Honestly, the qpkg format is crap. That is no surprise as the QNAP
factory firmware is also crap. I like the device. I'd buy it again. But
there is no reason to reinvent something as fundamental as package
management for your embedded device.

Why not use ipkg/opkg? Or just go crazy and base your Linux distro on
something reasonable like Debian or Fedora? I mean we're talking about a
2.0GHz processor with 512MB of RAM. We're hardly embedded anymore. Stop
rolling your own shit and use something standardized!

The problems are a bit more endemic than all that however. Take for
example that the primary means of distribution for the QNAP QDK is
either through the web interface of QNAP's NAS management software, or
through a stickied post on a forum. A freakin' forum post! Where is the
version control? How does one submit a change request and try to improve
the scripts? All of that stuff is missing.

And finally comes the GPL compliance. I might be misinterpreting the
copyright license but it seems clear to me that in light of a request
for source code I should be able to get it. Better yet QNAP should just
host it somewhere.

Le sigh.

If you made it this far then I hope you found this post helpful or at
least interesting. For the next post I'll focus on the happier issue of
making Plex work on my NAS with my Chromecast and PS4.

Ciao!
