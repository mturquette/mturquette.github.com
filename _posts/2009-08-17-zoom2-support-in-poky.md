---
layout: post
title: Zoom2 support in Poky
date: '2009-08-17T16:51:21-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/165175262/zoom2-support-in-poky
published: false
---
I’m currently in the process of pushing Zoom2 support to upstream Poky.  I feel like there is a lot of unfocused energy that wants this to happen at TI, but no one is set on doing it.  Conveniently I enjoy such work so very slowly I have started to send merge requests to Richard Purdie''s tree.
The first of the commits can be found here and here.  No display is present since the kernel recipes so far don’t include the pending DSS2 changes.  Hopefully those will get merged soon or I’ll have to patch them in or make yet another kernel recipe.
Some interesting design issues are up for debate.  What is the most graceful way to build GLES libs from the publically available SDK?  Which kernels should be supported? IE, Google’s OMAP Android tree, Tony Lindgren’s upstream linux-omap, feature trees like Kevin Hilman’s linux-omap-pm or Tomi Valkeinen’s DSS2 tree.
I’ve also been in talks with Rob Clark about how best to write recipes that build DSP-side code.  I’m fond of a generic coprocessor.bbclass that any recipe can use as a template for specifying toolchain oddities, architecture type (so DSP recipes don’t get mixed with your primary board architecture) and other bits that might be useful to a wide array of different coprocessors.
I’d like any such changes to make to both Poky and OpenEmbedded, so if you have thoughts these subjects please chime in!
