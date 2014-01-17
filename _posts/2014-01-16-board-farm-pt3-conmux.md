---
layout: post
title: "Board farm part 3: conmux"
category: posts
published: false
---

> Board farms are a [black
> art](http://www.catb.org/jargon/html/B/black-art.html). Every embedded
> developer has a custom setup pieced together over time. In the worst
> case the board farm is set up once and never fully documented or
> understood. This series of posts on my own board farm hopes to
> document how I do things in a way that might be helpful to others.

# a healthy board farm

The most important trait of a board farm is that it provides a
consistent interface for the user to test software across a variety of
hardware. It has to scale.

There is a lot to this concept. For instance, how to take power
measurements across multiple pieces of hardware in a consistent way? It
is a big topic for a future post, but having a well designed board farm
will make doing this a lot easier.

This initial post will cover what I consider the bare minimum for a
functioning board farm:

* power up the target
* load software onto the target
* provide a console to the target
* hard power cycle the target and do it all over again

# build, run, debug, repeat

Building the software you intend to test is outside the scope of this
article. With that said, some software is easier to deploy and test than
others. A userspace application or web app can just be copied to the
target while it is running and live updated. A good board farm should
support replacing the very lowest layers of software including the
bootloader and OS kernel.  To that end my examples below will focus on
replacing the Linux kernel image on a Pandaboard ES device.

## run

U-boot configuration
uEnv.txt
NEVER HOTPLUG THE MMC CARD
Instead use telnet, SD mux, serial (kermit), or USB peripheral boot
If Ethernet is missing then use USB-to-Ethernet dongles

---

This article is super long winded. How to pare it down? Here is what I
really want to focus on:

1. bare essentials of a board farm (BREVITY! Keep it to 140 characters)
2. super short overview of how my farm works (picture is worth a
thousand words)
3. how to install and configure every piece of software (no need to hold
peoples hands on this. the picture above can explain how it all fits
together)

Keep the whole thing down to 600 words.

---

> Board farms are a [black
> art](http://www.catb.org/jargon/html/B/black-art.html) and every
> embedded developer seems to invent their own approach to the problem.
> This series of posts focusing on board farms hopes to provide info on
> my own setup that others might find useful.

The most important trait of a board farm is that it provides a
consistent interface for the user to test software across a variety of
hardware. At a bare minimum the board farm should:

* power up the target
* load software onto the target
* provide a console to the target
* hard power cycle the target and do it all over again

Board farms can do much more than this, including automating power
measurements. A future post will tackle that subject in detail.

# my setup

This post will focus on my Pandaboard ES device, and how I have
configured my board farm to simplify a typical build-run-debug-repeat
cycle.
