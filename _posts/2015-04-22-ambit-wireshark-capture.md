---
layout: posts
published: false
title: Suunto Ambit USB capture with Wireshark on Mac OS X
---

```
brew install wireshark --devel --with-headers --with-libpcap --with-qt5
curl https://bugs.wireshark.org/bugzilla/attachment.cgi?id=3373 -o ChmodBPF.tar.gz
tar zxvf ChmodBPF.tar.gz
open ChmodBPF/Install\ ChmodBPF.app
rm -fr ChmodBPF ChmodBPF.tar.gz
open /usr/local/bin/wireshark
```

See [bug #3760](https://bugs.wireshark.org/bugzilla/show_bug.cgi?id=3760).

Above install working wireshark on mac os x. Seems I cannot capture USB on mac os x though :-(


