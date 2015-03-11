---
layout: posts
published: false
title: Hacking PLEX media server for Debian armel
---

Plex Media Server is a nice service for streaming video within your home
network. Plex clients exist for home video game consoles, Google's
Chromecast, various "smart" TVs and various set-top boxes like Roku. I
also like Plex because it has a nice Android app for controlling it
remotely.

I used to run the Plex daemon on my big, energy draining x86 box. This
required turning it on for a video or leaving it running all the time.
Neither were fun solutions and I felt like a bad ARM Linux Power Hacker.

Solution? Run it on my [QNAP TS-219P2+ running Debian Wheezy
7.7](http://deferred.io/posts/qnap-ts219p-ii-debian-install/). Plex
provides a QPKG for my device. Let's use that!

# qpkg

I'm just going to say it. qpkg is fucking weird. It is not compatible
with anything other than the crapware shipped by QNAP, so I had to
reverse engineer it. Why those guys could not use opkg/ipkg or something
similar is beyond me. But hey if I liked the factory software I'd be
running it, right?

Further confounding is the claim that the QNAP Development Kit (QDK!) is
open source and [GPL
licensed](http://wiki.qnap.com/wiki/QPKG_Development_Guidelines). Anyone
can download the QDK and develop their own qpkg's, except that the
sources are themselves [only available as a
qpkg](http://forum.qnap.com/viewtopic.php?f=128&t=36132&p=157747&hilit=qdk+gpl#p157747)!

What an awesome catch-22. I [inquired about this on the
forum](http://forum.qnap.com/viewtopic.php?f=128&t=99769), asking for a
link to git tree or some tarball that held the QDK sources.  No
response. So you need the QDK installed to unpack a qpkg containing the
QDK sources.

GPL license violation anyone?

To be honest, I didn't know what a qpkg was. What was the format? Was it
just a spin on a normal tarball? Did it have some magic data prepended
to it? What is the file format?

After lots and lots of searching and poking at it with some basic UNIX
tools I figured it out and was able to unpack it. I'll spare you the
gory details. Here is a general purpose script to unpack a qpkg:

```
Should I use a github gist instead?
```

# plex

Using the script above (or the qdk tools that we can now unpack) we can
start tinkering with Plex's QNAP ARM distribution.

```
wget https://downloads.plex.tv/plex-media-server/0.9.11.7.803-87d0708/PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg
./unpack_qpkg PlexMediaServer_0.9.11.7.803-87d0708_arm-x19.qpkg
```


