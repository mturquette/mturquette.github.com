---
layout: post
title: codesourcery and ia32-libs
date: '2010-10-04T19:54:07-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/1245897953/codesourcery-and-ia32-libs
published: true
---
Today I spent about 10 minutes trying to figure out which shared libraries I
needed to get CodeSourcery’s ARM toolchain running after setting up a new
development machine with a fresh install of Ubuntu.

Usually I am missing some shared libs when I see the following error at
application execution-time,

```
mturquette@quantum:~$ arm-none-linux-gnueabi-gcc
-bash: /usr/local/bin/arm-none-linux-gnueabi-gcc: No such file or directory
```

I blindly installed a few packages (that I needed anyways) hoping it might
solve the issue, but after exhausting my list of need-to-install Debian
packages I finally broke down and googled it.  Ubuntu forums to the rescue: I
needed the ia32-libs package.  This should have been obvious to me since the
[CSL download
page](http://www.codesourcery.com/sgpp/lite/arm/portal/release1293) clearly
marked their release tarball as IA32 GNU/Linux.

```
Problem solved with a quick,
mturquette@quantum:~$ sudo apt-get install ia32-libs
```
