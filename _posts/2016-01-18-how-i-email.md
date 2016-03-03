---
layout: post
title: How I email, 2016 edition
published: true
tags: env, sotdf
---

> Part of a series of articles describing the state of my dotfiles, UNIX
> environment and workflow in 2016. See the meta-article <a
> href="/2016/01/17/state-of-the-dotfiles.html">here</a>.

Much of my 2016 email workflow looks similar to my [2013 email
workflow](/posts/2013/01/13/email-workflow-for-champions.html), and that
article is still a useful resource for the basics. If you are starting
from scratch however I recommend that you try to install the
applications from your favorite package manager. That wasn't an option
back when the original article was written.

# Basic workflow

1. I use Gmail as my backing store and IMAP server
   * I make full use of Gmail filters and Labels
1. [OfflineIMAP](http://offlineimap.org/) syncs my mail locally using
maildir format
   * On my workstation I sync everything, including Gmail's `All Mail`
     folder, aka _archive_
   * On my Macbook I only sync `inbox`, which is filtered
     aggressively, and the `needs-review` Label/tag
1. Notmuch indexes all new mail
   * [Automagical tagging happens based on Gmail
     Labels](/2016/01/18/notmuch-tags-gmail-labels-bidirectional-sync.html)
   * Super fast full-text search!
1. I browse mail with [alot](https://github.com/pazz/alot) and compose
with vim
   * I can tag, untag and retag as I please from within alot
   * Any changes I make locally will sync back to Gmail as changes to
     Labels
1. msmtp sends mail
   * msmtp-queue handles automatically saves them if they could not be
     sent successfully. A single command flushes the queue once the
     network connection is reestablished

# A key point
The _only_ interface I use to my mail is through notmuch. Any changes to
IMAP flags happens by changing notmuch tags. Any changes to Gmail
Labels/IMAP folders happens by manipulating notmuch tags. Notmuch is the
one and only oracle facing the user

## Gmail filters
The most important filter for me is `needs-review`, which marks patches
from open source software mailing lists that require my attention.
Screenshot of my Gmail configuration:
<img src="/images/how-i-email/filters.png" />

## _inbox_ and _needs-review_
I'm a fan of the _archive_ behavior in Gmail, where you can remove the
`inbox` Label from an email to remove it from your sight, but you can
always search for it later thanks to the Gmail's `All mail` IMAP folder,
which we do not touch.

In keeping with Gmail's web client keybindings (which are not
reconfigurable), I have bound the `e` key in alot to removing the
`inbox` tag. I also kept the navigation bindings the same, `s` toggles
the IMAP flag/Gmail Star, etc:

<script src="https://gist.github.com/mturquette/3ffbfc56fb6f6eb57357.js"></script>

Most of the patches I receive have multiple tags applied to them. For
instance, a patch addressed to the linux-clk mailing list might also Cc
the linux-kernel mailing list. Thanks to the [maildir-notmuch-sync
script](/2016/01/18/notmuch-tags-gmail-labels-bidirectional-sync.html)
and the above Gmail filters, when we sync that email it will have at
least three tags: `linux-clk`, `linux-kernel` and `needs-review`.

I never want to remove the `linux-clk` or `linux-kernel` tags; this mail
was actually sent to those lists, so I consider these to be _permanent_
tags. But after I review the patch, I want to remove the `needs-review`
tag. In alot I've bound the `&` key for this, and its operation is
analogous to the `e` key for archiving mails in my `inbox`.

---

## Patch wrangling
Managing patches sent to a mailing list is a huge topic, including
automatic replies, automated patch application, automated testing. You
see the trend.

For starters, a quick solution to apply _individual_ patches is to alias
alot so that the working directory is in the root of your source tree of
interest, and then bind a key to pipe the contents of a single mail to
`git` or whatever you use to apply patches. For example:
<script src="https://gist.github.com/mturquette/c66fe144bee53c176faf.js"></script>

---

## nametrans, folderfilter and syncing only what you need
I've tried to keep the user experience between alot and the Gmail web
client familiar (e.g. Gmail key bindings in alot, identical _archive_
behavior). But the Gmail names for their directories are CaMelCaSe hell.
I _translate_ the _names_ of these IMAP folders using a feature in
OfflineIMAP cunningly called
_[nametrans](https://offlineimap.readthedocs.org/en/latest/nametrans.html)_.

The OfflineIMAP folderfilter allows you select which IMAP folders to
sync, which is especially helpful when you are trying to limit what you
download on a laptop. An example configuration:
<script src="https://gist.github.com/mturquette/60285865de706c5519fa.js"></script>

That configuration results in the following local notmuch tags:

```
$ notmuch search --output=tags "*"
attachment
drafts
encrypted
flagged
important
inbox
needs-review
replied
signed
unread
```

The astute reader will notice that I am translating names for folders
that I don't bother to sync, which is just because I want the example to
cover all of the Gmail built-in Label names.

Steve Losh's excellent [The Homely
Mutt](http://stevelosh.com/blog/2012/10/the-homely-mutt/) focuses mostly
on Mutt configuration, but also touches on OfflineIMAP and notmuch
configuration. I recommend a look through it if you get stuck.

---

## Saving mails as drafts
`msmtp-queue` and `msmtpq` are available through many package
distributions, often bundled with the `msmtp` utility itself.

Copy these into your path and edit configuration as needed. My changes
to `msmtpq` and `~/.config/alot/config`:
<script src="https://gist.github.com/mturquette/2ae76bbdb4b41b34257f.js"></script>

Now any outgoing messages that failed to send properly end up in the
`drafts` maildir. This will sync to Gmail next time you establish
network connectivity and are able to sync IMAP. You can either send it
through the web client by clicking on `Drafts` or from the commandline
with `msmtp-queue -r`.

---

## Inbox Zero™ on the road
When traveling I sync a reduced set of my mail. This is helpful for
saving disk space (_meh_), and conserving precious bandwidth (_yeah!_).
I will typically only sync `inbox` and `needs-review`. As mentioned
above I have the `e` and `&` keys bound to remove those notmuch tags
from alot, which in turn removes them from my disk, but only from their
respective maildir.

An interesting side effect of the above technique is that if you do not
sync any of the other Labels or IMAP folders containing references to
the same mail, then removing the notmuch tag will delete every reference
to that mail from your disk.

_This is pretty cool._

This means that achieving Inbox Zero™ using the reduced _on the road_
setup described above will mean that you could potentially have zero
mail taking up space on your disk. Or zero mail being read by the guy
who stole your laptop at the airport. Or whatever.

And your mail is still safe on your IMAP server where it was not fully
deleted, only the `inbox` or `needs-review` Gmail Labels were removed.

---

## Fetching mail in the background
I use a cron job to sync with my Gmail's IMAP server:
<script src="https://gist.github.com/mturquette/0237243502b3fe5d142f.js"></script>
