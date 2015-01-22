---
layout: post
title: furthering refining find(1)
date: '2009-09-07T22:11:00-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/182506093/furthering-refining-find-1
published: true
---
Last month I wrote about [using cscope](http://deferred.io/posts/use-cscope-to-navigate-your-code-no-srsly-use/) for Linux kernel development.  The find(1) snippet that I gave was not very precise, assuming one is only interested in a specific machine such as OMAP3.

This was pointed out to me by a coworker so here is a more refined set of search queries without all of the -prune fuss, specifically targeting OMAP3:

```
find -L ./arch/arm/mach-omap2/ ./arch/arm/plat-omap/ \
./arch/arm/common/ ./arch/arm/include/ ./arch/arm/kernel/ \
./arch/arm/lib/ ./arch/arm/mm/ ./arch/arm/nwfpe/ \
./arch/arm/oprofile/ ./arch/arm/vfp/ ./include/ ./drivers/ \
./kernel/ -path "./include/asm-*" -prune -o \
-name "*.[chxsS]" -print
```

Mind the left and right quotes if you copy and paste that snippet.  I haven’t yet fixed my CSS to be more code-friendly.

This set of parameters avoids scraping board files and platform data for ARM SoCs other than OMAP2/3.  It explicitly includes the rest of the generic ARM code.  If you have any suggestions for making this list more efficient with some -prune’ing or some negation statements then do chime in!  Similarly I left out fs, net, init, mm, lib and ipc since I’m only doing architecture hacking or device driver work.  Adjust per your own needs.

