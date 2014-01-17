---
layout: post
title: "Board Farm Pt 1: tftpboot"
category: posts
published: true
---

> Board farms are a [black
> art](http://www.catb.org/jargon/html/B/black-art.html). Every embedded
> developer has a custom setup pieced together over time. This series of posts
> on my own board farm hopes to document how I do things in a way that might be
> helpful to others.

In this post I explain my typical kernel development workflow and the
role my board farm plays in it. A recurring theme is to provide a way to
work with various boards in a consistent fashion. This increases
efficiency while working and also helps the number of platforms scale up
more easily. This post will probably be boring for seasoned embedded
developers, while follow-up posts will hopefully be more interesting.

# build, flash, boot, repeat

The basic workflow that I use for kernel development on embedded devices
is to cross compile the kernel on my **host** (e.g. my PC) and then copy
the new files over the network to my **target** (e.g. [Pandaboard
ES](http://pandaboard.org/content/pandaboard-es)). After copying the new
files I attempt to boot Linux and I use the serial console to observe my
progress and interact with the system. I reboot the **target** when I am
ready to do it all over again.

# flashing software to the target

There are many ways to flash software to modern embedded targets.  My
preferred way to do this is to put the [Das
U-boot](http://www.denx.de/wiki/U-Boot) bootloader on the target's SD
card or NAND/NOR flash and then copy the kernel uImage and relevant
[Device Tree](http://elinux.org/Device_Tree) blobs over the network
every time the device boots. I do this via a TFTP server running on my
host.

Some targets will have an Ethernet port on the board. For SoCs with
Ethernet controller this will require a driver for that Ethernet
hardware in U-boot. For SoCs that do not have Ethernet controllers there
is often a Ethernet-to-USB bridge (like on the Pandaboard ES). In this
case the USB controller needs to have a driver in U-boot.

Finally some targets will not have an Ethernet port on the board. If
your board has a USB port then you can purchase a cheap USB-to-Ethernet
adapter. If you board has none of these options then you will need to
investigate transferring data over the serial port or perhaps some
vendor-specific method for flashing images. You should also skip the
rest of this article, which assumes use of the network for tftpboot.

## set up the tftp server on your host

Install the needed packages:

```
sudo apt-get install tftpd-hpa tftp
sudo vim /etc/default/tftpd-hpa
sudo chown $USER /var/lib/tftpboot/
```

The config file should look something like:

```
# /etc/default/tftpd-hpa

TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/var/lib/tftpboot"
TFTP_ADDRESS="[::]:69"
TFTP_OPTIONS="--secure"
```

Test that you can fetch the images you need from your tftp server:

```
cd ~/my/kernel/directory/
cp arch/arm/boot/uImage arch/arm/boot/dts/omap4-panda-es.dtb /var/lib/tftpboot/

tftp
tftp> connect localhost
tftp> get uImage
Received 5783727 bytes in 0.8 seconds
tftp> get omap4-panda-es.dtb
Received 49971 bytes in 0.0 seconds
tftp> quit (or ctrl-d)
ls -l uImage omap4-panda-es.dtb
-rw-r--r-- 1 mturquette mturquette   49821 Jan 18 19:12 omap4-panda-es.dtb
-rw-r--r-- 1 mturquette mturquette 5746120 Jan 18 19:12 uImage
```

If you were able to fetch the files from your tftp server into your
working directory then you know the server works.

## set up U-boot for tftp

The contents of my Pandboard ES SD card:

* MLO (signed first-stage bootloader)
* u-boot.img (note that this is not u-boot.**bin**)
* uEnv.txt

Modern U-boot versions read uEnv.txt (if present) to load environment
variables, which is a nice change from the old days. Here is what my
uEnv.txt looks like on my Pandaboard ES:

```
fdt_high=0xffffffff
bootcmd=usb start; dhcp 0x80200000 192.168.1.181:uImage; dhcp 0x815f0000 192.168.1.181:omap4-panda-es.dtb; bootm 0x80200000 - 0x815f0000
bootargs=console=ttyO2,115200n8 earlyprintk
uenvcmd=boot
```

You can see from **bootcmd** that the Pandaboard ES uses a
USB-to-Ethernet bridge (which is on-board, no need to purchase a
seaparate dongle). Additionally I use the dhcp command to fetch the
uImage and DTB since I do not assign a static IP address to the
**target**.

Load up your SD card (or flash memory) with the bootloader images and
your own uEnv.txt and you should be rewarded with a downloaded Linux
kernel image and DTB that boots nicely.

### a note on Gigabit Ethernet

Even recent versions of U-boot have trouble with USB timeouts when
hooked up to a Gigabit switch. There is a
[patch](https://groups.google.com/d/msg/beagleboard/i-js0WZaSo8/AB9uLWEMMzgJ)
on the Beagleboard lists, and some other discussion on the Denx lists.
Recent versions of U-boot (2014.01) seems to solve this for me by
increasing the timeout.

# putting it all together

Now we can boot a kernel and DTB over the network. In practice I use an
alias to build my kernel and another alias to copy files over to the
tftp server directory:

```
alias m2='m 2> errors.err'
alias c='cp arch/arm/boot/uImage arch/arm/boot/dts/omap4-panda-es.dtb
/var/lib/tftpboot/ && sync'
```

So I build a kernel image, inspect any errors by running `less
errors.err` and then copy the images over to the tftp root directory.
Rebooting the **target** loads these new images and runs them.

I dump errors from STDERR into errors.err during compilation because
this is a standard file that vim can use to jump from issue to issue.
Simply running `vim -q` will load up **errors.err** as the errfile and
you can jump from each error with `:cn` and back with `:cprev`.

I hope you found this helpful. The next installment will focus on how I
control power cycling of my boards remotely, and how I take power
measurements in my board farm.
