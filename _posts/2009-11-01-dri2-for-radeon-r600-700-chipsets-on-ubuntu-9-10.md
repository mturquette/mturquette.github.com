---
layout: post
title: DRI2 for Radeon R600/700 chipsets on Ubuntu 9.10
date: '2009-11-01T21:30:04-08:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/230394871/dri2-for-radeon-r600-700-chipsets-on-ubuntu-9-10
published: false
---
Ubuntu 9.10 was released last week with many new features including an upgrade to a 2.6.31 kernel.  Sadly native support for KMS on Radeon R600 and R700 chipsets is missing.  Fedora wins again.  In this article I will show you how I got DRI2 support working for my Radeon HD 4350 on Karmic Koala.  DRI2 is loosely defined on the DRI wiki as,

…a framework for allowing direct access to graphics hardware under the X Window System in a safe and efficient manner. It includes changes to the X server, to several client libraries, and to the kernel (DRM, Direct Rendering Manager). The most important use for the DRI is to create fast OpenGL implementations providing hardware acceleration for Mesa.

In a nutshell DRI2 means having recent versions of the following components,
DDX, an XFree86/X.org 2D driver.  In my case this is xf86-video-ati
Mesa, the open source implementation of OpenGL
DRM, the direct rendering manager                           
In userspace this is libdrm.  In kernel space this is,
The generic module configured via CONFIG_DRM and,
The hardware-specific driver, in my case configured via CONFIG_DRM_RADEON

This article will show you the steps I took to get the above software working for me.  At the end of the article I’ll demonstrate how to verify you’ve got 3D working with glxinfo (boring) and OpenArena (totally not boring).  Future articles might cover the steps involved with getting a fully accelerated UI with recent Metacity and Compiz.  I’d like to eventually test out Wayland and write about steps involved but only time will tell if I have the bandwidth to do so.
Final notes before diving in:
This article squarely targets Ubuntu Karmic Koala.  If you use Fedora 12 you won’t need this as Radeon KMS was released already as an experimental package.  For other distros the same ideas I list here will make sense, but the steps should not be repeated verbatim.  If you have instructions for other distros please put them in the comments!
In this article I assume you can build a Linux kernel for your own box.  If you are new to this fret not!  It is easy and for Ubuntu/Debian types I recommend looking at this.  I also assume you are comfortable with git.
You can save yourself a lot of trouble by just using the existing Radeon PPAs on launchpad.net.  This article is for people that,                   
Do kernel development and don’t want to rely on a release binary
Want to understand the Linux graphics stack better; learn by doing!

This article is made possible by the fine documentation at the X.org and freedesktop.org wikis, specifically the RadeonBuildHowTo article.  Thanks!
kernelspace
KMS support for the R100 through R500 chipsets was upstreamed with 2.6.31, but people like me with R600/R700 chipsets will need to patch it in from the relevant development branches.
Its possible you might want to stick to your vendor’s kernel (in this case Ubuntu) but that is lame for kernel devs not tied to any particular distribution.  I’m building my kernel from the 2.6.31 stable tree.  Once you have it working then make a kms topic branch off of g-k-h’s latest stable tag.
git remote add stable-2.6.31 git://git.kernel.org/pub/scm/linux/kernel/git/stable/linux-2.6.31.y.git
git fetch stable-2.6.31
git checkout -b radeon-kms v2.6.31.5
Now add a remote pointing towards Dave Airlie’s drm-2.6 development tree so we can merge in the appropriate changes from Dave’s drm-next branch.  drm-next is slated for the 2.6.32 merge window and should merge cleanly on top of 2.6.31.
git remote add kms git://git.kernel.org/pub/scm/linux/kernel/git/airlied/drm-2.6.git
git fetch kms
Now that you have your baseline kernel that you’ve already built and booted (you did that, right?) it’s time to merge in the out-of-tree KMS branch.
git merge kms/drm-next
Ideally you should not get any merge failures here.  I found that with 2.6.31.1 through 2.6.31.4 I experienced no merge failures, but with 2.6.31.5 I got a simple double-entry in drivers/gpu/drm/i915/intel_sdvo.c; this is easily fixed by removing the offending lines.  If git merges are new to you then please consult the documentation.
The next step is to configure the kernel to include the relevant new bits we just added.  Open up the kconfig menu editor and enable the following:

Device drivers -> Graphics -> Direct Rendering Manager -> ATI Radeon

After doing that enable staging drivers and the experimental Radeon KMS:

Device drivers -> Staging -> Enable Radeon KMS by default

Here is a diff of my pre-KMS kernel config against the new config after following the steps above:
mturquette@quantum:~$ diff -u /boot/config-2.6.31.5 src/linux-2.6/.config
--- /boot/config-2.6.31.5	2009-11-01 13:06:24.000000000 -0600
+++ src/linux-2.6/.config	2009-11-01 13:33:11.207145930 -0600
@@ -1,7 +1,7 @@
 #
 # Automatically generated make config: don''t edit
 # Linux kernel version: 2.6.31.5
-# Sat Oct 31 23:54:43 2009
+# Sun Nov  1 13:33:11 2009
 #
 CONFIG_64BIT=y
 # CONFIG_X86_32 is not set
@@ -1652,9 +1652,11 @@
 # CONFIG_AGP_SIS is not set
 # CONFIG_AGP_VIA is not set
 CONFIG_DRM=y
+CONFIG_DRM_KMS_HELPER=y
+CONFIG_DRM_TTM=y
 # CONFIG_DRM_TDFX is not set
 # CONFIG_DRM_R128 is not set
-# CONFIG_DRM_RADEON is not set
+CONFIG_DRM_RADEON=y
 # CONFIG_DRM_I810 is not set
 # CONFIG_DRM_I830 is not set
 CONFIG_DRM_I915=y
@@ -2146,7 +2148,48 @@
 #
 # TI VLYNQ
 #
-# CONFIG_STAGING is not set
+CONFIG_STAGING=y
+# CONFIG_STAGING_EXCLUDE_BUILD is not set
+# CONFIG_ET131X is not set
+# CONFIG_SLICOSS is not set
+# CONFIG_ME4000 is not set
+# CONFIG_MEILHAUS is not set
+# CONFIG_VIDEO_GO7007 is not set
+# CONFIG_USB_IP_COMMON is not set
+# CONFIG_W35UND is not set
+# CONFIG_PRISM2_USB is not set
+# CONFIG_ECHO is not set
+# CONFIG_USB_ATMEL is not set
+# CONFIG_AGNX is not set
+# CONFIG_OTUS is not set
+# CONFIG_RT2860 is not set
+# CONFIG_RT2870 is not set
+# CONFIG_RT3070 is not set
+# CONFIG_COMEDI is not set
+# CONFIG_ASUS_OLED is not set
+# CONFIG_ALTERA_PCIE_CHDMA is not set
+# CONFIG_RTL8187SE is not set
+# CONFIG_RTL8192SU is not set
+# CONFIG_INPUT_MIMIO is not set
+# CONFIG_TRANZPORT is not set
+# CONFIG_EPL is not set
+
+#
+# Android
+#
+# CONFIG_ANDROID is not set
+# CONFIG_DST is not set
+# CONFIG_POHMELFS is not set
+# CONFIG_B3DFG is not set
+# CONFIG_IDE_PHISON is not set
+# CONFIG_PLAN9AUTH is not set
+# CONFIG_HECI is not set
+# CONFIG_LINE6_USB is not set
+CONFIG_DRM_RADEON_KMS=y
+# CONFIG_VT6655 is not set
+# CONFIG_USB_CPC is not set
+# CONFIG_RDC_17F3101X is not set
+# CONFIG_FB_UDL is not set
 CONFIG_X86_PLATFORM_DEVICES=y
 # CONFIG_ACER_WMI is not set
 # CONFIG_ASUS_LAPTOP is not set
Go ahead a build your kernel with the latest KMS code.  I prefer to just build the kernel with a simple ‘make’ and install the image/bootloader entries by hand.  However Debian-ish systems make it easy to cook up kernel builds as proper dpkgs with,
CONCURRENCY_LEVEL=16 fakeroot make-kpkg --append-to-version=-radeon-kms kernel_image kernel_headers
Install the kernel and reboot your system.  You’ll notice that the normal boot console is now graphical instead of text-based and the context switch to X running is faster and smoother than it was before.  Welcome to Kernel Mode Setting!  Just to clear any doubts make sure you have direct rendering by glxinfo.
mturquette@quantum:~$ glxinfo | head
name of display: :0.0
display: :0  screen: 0
direct rendering: Yes
server glx vendor string: SGI
server glx version string: 1.2
server glx extensions:
    GLX_ARB_multisample, GLX_EXT_visual_info, GLX_EXT_visual_rating, 
    GLX_EXT_import_context, GLX_EXT_texture_from_pixmap, GLX_OML_swap_method, 
    GLX_SGI_make_current_read, GLX_SGIS_multisample, GLX_SGIX_hyperpipe, 
    GLX_SGIX_swap_barrier, GLX_SGIX_fbconfig, GLX_MESA_copy_sub_buffer
The key here is, “direct rendering: Yes”.  Hurray!  Now run,
mturquette@quantum:~/src/xf86-video-ati$ glxinfo | grep OpenGL
OpenGL vendor string: Mesa Project
OpenGL renderer string: Software Rasterizer
OpenGL version string: 2.1 Mesa 7.6
OpenGL shading language version string: 1.20
OpenGL extensions:
The key here is, “Software Rasterizer”.  No hurray.  Its clear I need to update the rest of my graphics stack to meet the capabilities of the new kernel.  That leads us to…
userspace
If you’re a kernel hacker and uninterested in building the userspace aspects of DRI2 then you can opt to use the PPA mentioned above.  However if you’re an X hacker, Mesa hacker, or like me and want to learn more then follow along and see how to build the bits missing in the default Ubuntu 9.10 release.
Firstly I need a 2D acceleration driver, DDX.  Ubuntu 9.10 comes with xf86-video-ati with a strangely recent version 6.12.99 (unstable).  This is the Radeon driver I need!  Secondly I need a 3D acceleration driver, Mesa.  I need at least version 7.5, and happily Ubuntu comes with 7.6.  Sadly the version Ubuntu ships with does not have certain compilation flags enabled, namely support for R600 and R700 chipsets; looks like I’ll need to build it.
Start by installing all of the build dependencies,
mturquette@quantum:~/src$ sudo apt-get build-dep mesa
And then clone the upstream mesa git tree,
mturquette@quantum:~/src$ git clone git://anongit.freedesktop.org/git/mesa/mesa
Since I’m already using Mesa 7.6 I will just take the branch for that version release and rebuild from it,
mturquette@quantum:~/src/mesa$ git checkout -b mesa-7.6 origin/mesa_7_6_branch
Now to configure, build and install for R600 & R700 chipsets,
mturquette@quantum:~/src/mesa$ ./autogen.sh 
mturquette@quantum:~/src/mesa$ ./configure --prefix=/opt/xorg --with-dri-drivers=radeon,r600 --disable-gallium
mturquette@quantum:~/src/mesa$ make -j16
mturquette@quantum:~/src/mesa$ sudo make install
Finally I need to make my system load the newly built libraries from /opt/xorg.  First make sure that the new custom Mesa libraries are loaded before the default Ubuntu ones.  Edit /etc/ld.so.conf and add the following to the top,
/opt/xorg/lib
Secondly I need to tell libgl where to find the DRI drivers.  Edit /etc/environment and add,
LIBGL_DRIVERS_PATH=/opt/xorg/lib/dri/
Now reboot and after restarting the system I can test for accelerated OpenGL with,
mturquette@quantum:~$ glxinfo | grep OpenGL
do_wait: drmWaitVBlank returned -1, IRQs don''t seem to be working correctly.
Try adjusting the vblank_mode configuration parameter.
OpenGL vendor string: Advanced Micro Devices, Inc.
OpenGL renderer string: Mesa DRI R600 (RV710 954F) 20090101  TCL DRI2
OpenGL version string: 1.4 Mesa 7.6.1-devel
OpenGL extensions:
The key here is, “OpenGL renderer string: Mesa DRI R600 (RV710 954F) 20090101  TCL DRI2”.  Hurray!  No more software rendering!  Now fire up OpenArena and marvel at the wonders of having accelerated 3D graphics using nothing but Open Source software.  Better yet, I didn’t have to wait for a vendor to package it all up for me.  A little bit of leg work is all it took get this system up to speed.
I hope other Radeon R600 and R700 owners out there benefit from this.  Of course PPA’s might be an easier way to accomplish this task, but its always fun to dig into the how’s and why’s of your distribution sometime.  Questions?  Hit up the comments below.
