layout: post
title: Shrink /home partition to make space for RAID1
category: posts
published: false
---

root@conch:~# e2fsck -f /dev/sda6 
e2fsck 1.42.5 (29-Jul-2012)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/sda6: 867/60514304 files (0.0% non-contiguous), 3853791/242041600 blocks

---

root@conch:~# resize2fs -p /dev/sda6 100G
resize2fs 1.42.5 (29-Jul-2012)
Resizing the filesystem on /dev/sda6 to 26214400 (4k) blocks.
Begin pass 2 (max = 34409)
Relocating blocks             XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Begin pass 3 (max = 7387)
Scanning inode table          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Begin pass 4 (max = 143)
Updating inode references     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
The filesystem on /dev/sda6 is now 26214400 blocks long.

---

26214400 * 4096 = 107374182400
26214400 * 4k = +104857600K
107374182400

---

root@conch:~# fdisk /dev/sda

Command (m for help): p

Disk /dev/sda: 1000.2 GB, 1000204886016 bytes
255 heads, 63 sectors/track, 121601 cylinders, total 1953525168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x0002793a

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048      499711      248832   83  Linux
/dev/sda2          499712    14172159     6836224   83  Linux
/dev/sda3        14174206  1953523711   969674753    5  Extended
/dev/sda5        14174208    17188863     1507328   82  Linux swap / Solaris
/dev/sda6        17190912  1953523711   968166400   83  Linux

---

root@conch:~# fdisk /dev/sda

Command (m for help): p

Disk /dev/sda: 1000.2 GB, 1000204886016 bytes
255 heads, 63 sectors/track, 121601 cylinders, total 1953525168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x0002793a

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048      499711      248832   83  Linux
/dev/sda2          499712    14172159     6836224   83  Linux
/dev/sda3        14174206  1953523711   969674753    5  Extended
/dev/sda5        14174208    17188863     1507328   82  Linux swap / Solaris
/dev/sda6        17190912  1953523711   968166400   83  Linux

Command (m for help): d
Partition number (1-6): 6

Command (m for help): n
Partition type:
   p   primary (2 primary, 1 extended, 1 free)
   l   logical (numbered from 5)
Select (default p): l
Adding logical partition 6
First sector (17190912-1953523711, default 17190912): 17190912
Last sector, +sectors or +size{K,M,G} (17190912-1953523711, default 1953523711): +104857600K

Command (m for help): p

Disk /dev/sda: 1000.2 GB, 1000204886016 bytes
255 heads, 63 sectors/track, 121601 cylinders, total 1953525168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x0002793a

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048      499711      248832   83  Linux
/dev/sda2          499712    14172159     6836224   83  Linux
/dev/sda3        14174206  1953523711   969674753    5  Extended
/dev/sda5        14174208    17188863     1507328   82  Linux swap / Solaris
/dev/sda6        17190912   226906111   104857600   83  Linux

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.

WARNING: Re-reading the partition table failed with error 16: Device or resource busy.
The kernel still uses the old table. The new table will be used at
the next reboot or after you run partprobe(8) or kpartx(8)
Syncing disks.
root@conch:~# reboot

---

resizefs & e2fsck once more to make sure we're good!
