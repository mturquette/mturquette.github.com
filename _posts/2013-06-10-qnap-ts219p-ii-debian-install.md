---
layout: post
title: Linux on the QNAP TS219P2+ - Part 2 - Debian Install
category: posts
published: true
---

# Bro, do you even Ubuntu?

Ubuntu drew a line in the sand a few years back and only supports ARMv7 amongst ARM's 32-bit processors. Lots of Rasperry Pi tinkerers got hit by this and were surprised. Marvell's Kirkwood series is ARMv5TE, so Ubuntu images just won't work for us.

Anyways Debian is the rock upon which Ubuntu is built and your own self-respect and self-image will improve by using it. Trust me, it's science.

# Installing Debian

[Part 1](http://deferred.io/posts/qnap-ts219p-ii-serial-console) gave us a serial console on the TS-219P2+. Having low-level UART access is not strictly necessary for installing Debian Stable (Wheezy), but if you intend to use this platform for Linux kernel hacking (which is how I intend to use it) then it will be helpful later on.

As I mentioned before Martin Michlmayr's [site](http://www.cyrius.com/debian/kirkwood/qnap/ts-219/install/) has done all of the heavy lifting already. I'll just dump the Exact Steps&trade; here for your benefit. Note that I made a backup of the flash memory first as well as downloaded the Debian prerequisites on the target device. These operations take up disk space, so I did this with a SATA hard disk installed which I used. If you do not have a disk installed fret not. You could use a USB flash drive, or you could fallback on /tmp and use system memory as storage. Long story short: the first command below may vary depending on your needs. Likewise I scp the data over the network to save my backup, and I use wget to download the Debian bits. You could just as easily have this stuff on an external disk (USB or SATA).

	cd /mnt/ext
	cat /dev/mtdblock0 /dev/mtdblock4 /dev/mtdblock5 /dev/mtdblock1 /dev/mtdblock2 /dev/mtdblock3 > F_TS-219P2+_factory
	cat /dev/mtdblock0 > mtd0
	cat /dev/mtdblock1 > mtd1
	cat /dev/mtdblock2 > mtd2
	cat /dev/mtdblock3 > mtd3
	cat /dev/mtdblock4 > mtd4
	cat /dev/mtdblock5 > mtd5
	scp mtd* F_TS-219P2+_factory mturquette@workstation:~/some/dir/path/
	wget http://http.us.debian.org/debian/dists/wheezy/main/installer-armel/current/images/kirkwood/network-console/qnap/ts-219p/flash-debian
	wget http://http.us.debian.org/debian/dists/wheezy/main/installer-armel/current/images/kirkwood/network-console/qnap/ts-219p/initrd.gz
	wget http://http.us.debian.org/debian/dists/wheezy/main/installer-armel/current/images/kirkwood/network-console/qnap/ts-219p/kernel
	wget http://http.us.debian.org/debian/dists/wheezy/main/installer-armel/current/images/kirkwood/network-console/qnap/ts-219p/model
	sh flash-debian

After this script finishes (takes a few minutes) print your IP address and take note:

	ifconfig

You'll use that IP address to SSH into the box after rebooting:

	reboot

It takes a few minutes to reboot. The status light on your NAS will blink. When it turns a solid green (accompanied by a beep) you'll know that the reboot is finished. Congrats! You have entered the Debian installer.

I will not cover the details of installing debian. Remember Luke, use [the Force](http://www.debian.org/releases/stable/armel/ch06.html.en). When ssh'ing into your machine you'll likely first need to remove the entry for your NAS from your known_hosts file since the installer changes it's key from what you had earlier. After that ssh with user == installer and pass == install. Secure!

	ssh-keygen -f "$HOME/.ssh/known_hosts" -R 192.168.xxx.yyy
	ssh installer@192.168.xxx.yyy

I had some strange behavior where the installer would hang at various points. After dozens of attempts of using the installer (including letting it run overnight) I finally powered the whole thing down and let it sit idly while I spent the day out with my wife. Upon returning home the installer went though perfectly on the first try. _Sigh._

After the installation completes and you reboot the device you will need to wipe the old SSH key from your known_hosts file again, since the install will have generated a new one that is different from the key used during the installation process. Don't forget to use the new user and pass you created during the install process.

	ssh-keygen -f "$HOME/.ssh/known_hosts" -R 192.168.xxx.yyy
	ssh your_user_name@192.168.xxx.yyy

So now you've got Debian running on your NAS. Congrats! You can stop here if this is all you want. But if you're like me you want to do some Linux kernel hacking on this device. Part 3, the last of this epic trilogy, will cover all of the details needed for you to boot the latest and greatest upstream kernel on your QNAP TS219-P2+.
