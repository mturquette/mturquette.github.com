---
layout: post
published: true
title: Suunto DM5 and MovesLink2 data transfer bug
---

I tried to upload my dives from a recent trip diving for abalone using the Suunto DM5 software on my MacBook Pro. It failed to transfer data from my Suunto D6i. I tried lots of fixes that I found through Google:

* move ~/.config/Suunto to some place safe, restart DM5 to build fresh
  database
* completely uninstall DM5
* hold the USB connector firmly against the D6i body to ensure solid
  connection
* close DM5 and try to connect the device through MovesLink2 (I swear
  someone said this worked for him on a forum somewhere...)

I inspected the logs and the failures varied greatly. The most common type of error was a failure to read the device memory:

```
[2015-Jun-01 11:20:00 -0700] [ERROR] loadExerciseLogs: failed with exception: failed to read device memory
[2015-Jun-01 11:20:33 -0700] [ERROR] loadExerciseLogs: failed with exception: failed to read device memory
[2015-Jun-01 11:20:59 -0700] [ERROR] loadExerciseLogs: failed with exception: failed to read device memory
[2015-Jun-01 11:22:22 -0700] [ERROR] loadExerciseLogs: failed with exception: failed to read device memory
[2015-Jun-01 11:22:46 -0700] [ERROR] loadExerciseLogs: failed with exception: failed to read device memory
```

But I also got other weird stuff such as not being able to classify my device correctly:

```
[2015-Jun-01 13:26:53 -0700] [ERROR] SerialPort::configure failed: serial_port::stop_bits = 0
[2015-Jun-01 13:26:53 -0700] [ERROR] Failed to configure port for device Suunto HelO2
[2015-Jun-01 13:26:53 -0700] [ERROR] Serial Port unavailable
[2015-Jun-01 13:26:53 -0700] [ERROR] SerialPort::configure failed: serial_port::stop_bits = 0
[2015-Jun-01 13:26:53 -0700] [ERROR] Failed to configure port for device Suunto Cobra 3
[2015-Jun-01 13:26:53 -0700] [ERROR] Serial Port unavailable
[2015-Jun-01 13:26:53 -0700] [ERROR] SerialPort::configure failed: serial_port::stop_bits = 0
[2015-Jun-01 13:26:53 -0700] [ERROR] Failed to configure port for device Suunto ACWDevice
[2015-Jun-01 13:26:53 -0700] [ERROR] Serial Port unavailable
```

That last line in the error log, "Serial Port unavailable" made me start to wonder if there was contention for the serial port. As a last ditch effort I closed MovesLink2 (which I use for my Suunto Ambit) and DM5 immediately completed the data transfer. The logs looked good too:

```
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] validateDateTime
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T16_22_28-0.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T16_30_32-1.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T16_50_46-2.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T16_51_38-3.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T16_58_39-4.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_01_50-5.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_06_33-6.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_11_05-7.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_22_56-8.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_33_07-9.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_35_35-10.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-06-29T17_39_59-11.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_11_15-12.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_12_40-13.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_14_23-14.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_18_58-15.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_22_08-16.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_24_35-17.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_26_48-18.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T11_30_02-19.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T14_55_48-20.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T14_59_59-21.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T15_04_58-22.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T15_24_16-23.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_09_21-24.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_13_46-25.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_17_47-26.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_22_18-27.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_25_58-28.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-08T17_30_23-29.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T07_55_13-30.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_00_55-31.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_06_15-32.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_11_02-33.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_16_36-34.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_23_31-35.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_25_49-36.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_31_54-37.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T08_36_55-38.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T14_18_10-39.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T14_23_23-40.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T14_28_34-41.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T14_33_55-42.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T15_01_29-43.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T15_06_57-44.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T16_29_56-45.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T16_32_48-46.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T17_13_50-47.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-09T17_16_32-48.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_12_55-49.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_17_51-50.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_22_20-51.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_25_12-52.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_28_28-53.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_32_04-54.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_37_25-55.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_41_20-56.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_45_59-57.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_48_35-58.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_56_21-59.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T10_58_00-60.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_04_24-61.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_07_47-62.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_09_38-63.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_24_44-64.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_26_39-65.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_29_57-66.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_41_20-67.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_44_08-68.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_51_08-69.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_53_16-70.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_55_02-71.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2014-08-10T11_59_32-72.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_18_28-73.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_20_35-74.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_22_44-75.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_31_22-76.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_33_00-77.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_39_30-78.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_43_35-79.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_45_13-80.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_47_08-81.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_50_08-82.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_52_00-83.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-30T12_53_19-84.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T10_51_35-85.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T10_53_27-86.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T10_55_36-87.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T11_05_31-88.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T11_08_10-89.xml.
[2015-Jun-01 13:32:17 -0700] [INFO] LogLibrary: Reading of log /Users/mturquette/.config/Suunto/Suunto DM5/1.2.42.5696/log-30501283-2015-05-31T11_15_40-90.xml.
```

I hope this helps the many users that have trouble with Suunto software. I do not feel that they have good quality control on their desktop software, and certainly there seems to be little collaboration between the teams working on dive computer software and sports watch software, which is a shame.
