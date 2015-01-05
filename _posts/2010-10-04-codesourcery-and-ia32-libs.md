---
layout: post
title: codesourcery and ia32-libs
date: '2010-10-04T19:54:07-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/1245897953/codesourcery-and-ia32-libs
published: false
---
Today I spent about 10 minutes trying to figure out which shared libraries I needed to get CodeSourcery’s ARM toolchain running after setting up a new development machine with a fresh install of Ubuntu.

Usually you are missing some shared libs if you see the following error after executing some application,
mturquette@quantum:~$ arm-none-linux-gnueabi-gcc
-bash: /usr/local/bin/arm-none-linux-gnueabi-gcc: No such file or directory

I blindly installed a few packages (that I needed anyways) hoping it might solve the issue, but after exhausting my list of need-to-install Debian packages I finally broke down and googled it.  Ubuntu forums to the rescue: I needed the ia32-libs package.  This should have been obvious to me since the CSL download page clearly marked their release tarball as IA32 GNU/Linux.

Problem solved with a quick,
mturquette@quantum:~$ sudo apt-get install ia32-libs

Is this worthy of a post on my blog?  Yes for two reasons: firstly I will no doubt forget this again and can reference the answer on my blog.  Secondly my last post was about the Ronald Reagan-Big Tex connection, so standards simply aren’t that high around here.
