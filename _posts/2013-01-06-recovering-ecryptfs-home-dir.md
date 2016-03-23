---
layout: post
title: Recovering an eCryptfs home directory
category: posts
---

Recently I installed Ubuntu 12.10 to a new hard disk and wanted to copy
over some configuration bits from the Ubuntu 12.04 installation on an
older hard disk. After a bit of Googling I found many tutorials for
mounting an encrypted home directory from the Ubuntu LiveCD, but none
for mounting it from a secondary drive while running a full Ubuntu
installation on a primary drive.

The instructions below are brief, but my initial attempt to get this
working was met with failure. I will explain my naive approach along
with the (surprising) results at the bottom of the post.

Finally, some terminology:

-   primary disk - refers to the new disk currently running Ubuntu
    -   I want to transfer files from the secondary disk to this disk
    -   In my example this disk contains an Ubuntu 12.10 installation
-   secondary disk - refers to the old disk containing valueable files
    -   I want to transfer files from this disk to the primary disk
    -   In my example this disk contains an Ubuntu 12.04 installation

mount the secondary disk
========================

from the command line
---------------------

    $ udisks --mount /dev/sdd1
    Mounted /org/freedesktop/UDisks/devices/sdd1 at /media/296039d0-0064-4ca2-ad67-2966a62c13c8

from the GUI
------------

![weak.](/images/recovering-ecryptfs-home-dir/mount.png "weak.")

cd to home/.ecryptfs directory on the secondary disk
====================================================

Note that this is **not** the path to the old home directory (e.g.
/home/\$USER/.ecryptfs) but instead the parent directory. This is
important and will be explained at the end.

    $ cd /media/296039d0-0064-4ca2-ad67-2966a62c13c8/home/.ecryptfs/mturquette/
    $ ls -a
    .  ..  .ecryptfs  .Private

decrypt and mount the home directory
====================================

    $ sudo ecryptfs-recover-private .Private/
    INFO: Found [.Private/].
    Try to recover this directory? [Y/n]: y
    INFO: Found your wrapped-passphrase
    Do you know your LOGIN passphrase? [Y/n] y
    INFO: Enter your LOGIN passphrase...
    Passphrase: 
    Inserted auth tok with sig [514ea1aa67284baf] into the user session keyring
    INFO: Success!  Private data mounted read-only at [/tmp/ecryptfs.6Rw4fcoi].
    $ cd /tmp/ecryptfs.6Rw4fcoi/
    $ echo profit!
    profit!

Your old home directory is mounted as ready-only in /tmp. If you need
write access to that data then run ecryptfs-recover-private with the
--rw option.

When you are done copying the data from the secondary disk to the
primary disk be sure to unmount it and unlink the keys from the keyring.
The following bash snippet was stolen from the ecryptfs-umount-private
script and reworked a bit to handle this specific scenario:

    ECRYPTFS_MOUNT=/tmp/ecryptfs.6Rw4fcoi
    ECRYPTFS_SIGS=/media/296039d0-0064-4ca2-ad67-2966a62c13c8/home/.ecryptfs/mturquette/.ecryptfs/Private.sig
    if sudo umount.ecryptfs $ECRYPTFS_MOUNT 2>/dev/null; then
            for sig in `cat $ECRYPTFS_SIGS`; do
                    for key_id in `keyctl list @u | grep "$sig$" | awk -F: '{print $1}'`; do
                            keyctl unlink "$key_id" @u
                    done
            done
    fi
    sudo rmdir $ECRYPTFS_MOUNT

the naive approach
==================

Initially I tried to use ecryptfs-recover-private on the path to my old
home directory. This does not yield expected results.

    $ cd /media/296039d0-0064-4ca2-ad67-2966a62c13c8/home/mturquette/
    $ ecryptfs-recover-private .Private
    ERROR: This program must be run as root.
    $ sudo ecryptfs-recover-private .Private
    [sudo] password for mturquette: 
    INFO: Found [.Private].
    Try to recover this directory? [Y/n]: y
    INFO: Found your wrapped-passphrase
    Do you know your LOGIN passphrase? [Y/n] y
    INFO: Enter your LOGIN passphrase...
    Passphrase: 
    Inserted auth tok with sig [a9031310d6890419] into the user session
    keyring
    INFO: Success!  Private data mounted read-only at
    [/tmp/ecryptfs.9IMP178x].
    $ cd /tmp/ecryptfs.9IMP178x/
    $ echo do not profit.
    do not profit.

However this simply re-mounted the home directory of my *primary* disk.
This was definitely not what I expected. I did not care to dig into why
this happens and used a brute force approach: I used
ecryptfs-recover-private on any .Private directory I could find on the
secondary disk. Luckily my second attempt was the right one ;)

If you know why my naive approach was wrong please enlighten me in the
comments!

Shoutout to [Dustin Kirkland](http://blog.dustinkirkland.com/) for
authoring the ecryptfs scripts as well as the man pages and other
documentation that aided me in stumbling through this one.
