---
layout: post
title: Bidirectional synchronization of notmuch tags with IMAP folders and Gmail Labels
published: true
tags: env, sotdf
---

> Part of a series of articles describing the state of my dotfiles, UNIX
> environment and workflow in 2016. See the meta-article <a
> href="/2016/01/17/state-of-the-dotfiles.html">here</a>.

## TL;DR
[maildir-notmuch-sync](https://github.com/mturquette/ghar-email/blob/master/.local/bin/maildir-notmuch-sync)
synchronizes local notmuch tags with remote IMAP folders and Gmail
Labels.

I call the script from my pre- and post-sync OfflineIMAP hooks:

<script src="https://gist.github.com/mturquette/78d5e9a83dba43439738.js"></script>

#### Usage notes

For the initial use I recommend:

1. Back up your notmuch database with `notmuch dump`. _Duh._
1. Disable any periodic IMAP sync such as a cron job in case things go
sideways. _Duh._
1. After your local tags are in good shape, manually run

   `$ maildir-notmuch-sync post $HOME/mail/foo`

   Where `mail` is the root of all IMAP accounts and `foo` is the
   particular IMAP account that you are sync'ing.
1. If things look good then add the hooks to .offlineimaprc, re-enable
your IMAP cron job and enjoy

For Gmail users creating a new tag/Label combo:

1. Create your Gmail Label and filter first using the Gmail web
interface
1. Apply that label to at least one mail
1. Sync IMAP so that you pull down the newly labeled mail. Don't forget
   to edit `folderfilter` in `~/.offlineimaprc` so that you'll actually
   sync this new IMAP folder
1. After `maildir-notmuch-sync` runs the post-sync hook you should have
   the tag. Verify with:
   `notmuch search --output=tags "*" | grep my_new_tag`
1. Now use notmuch like you normally would. Mail that has the tag
applied to it will be copied to the new maildir. The next time you sync
IMAP those mails will show up with the same Label in the Gmail web
client

#### Disclaimer

This script will eat your hard disk, email embarrassing anecdotes to
everyone you love and generally destroy your life. Running it means that
you accept those consequences.

---

## The details
# Bidirectional notmuch tag <-> Gmail Label/IMAP folder sync

This change to my [2013 email
toolchain](/posts/2013/01/13/email-workflow-for-champions.html) is by
far my favorite. While this script will work with any type of IMAP
server, I personally use Gmail as my backing store (and so have my last
three employers), which means that this technique syncs notmuch tags
with Gmail labels, and vice versa.

Credit goes to [Ethan Schoonover](https://twitter.com/ethanschoonover)
of [Solarized fame](http://ethanschoonover.com/solarized) for creating
the initial version of the
[script](https://lists.fedoraproject.org/pipermail/mutt-kz/2013-February/000134.html)
that does the bidirectional sync. I've submitted my changes to his
dotfiles [on GitHub](https://github.com/altercation/es-bin/pull/2).

> Side note: early on I ran across this [pull
> request](https://github.com/teythoon/afew/pull/67) from Richard
> Lawrence. He was nice enough to share his scripts with me, which I did
> not ultimately use, but deserves credit for being a nice guy and
> answering my questions.

# How does it work?

When you sync to your Gmail account over IMAP, you will locally get an
IMAP folder for every Gmail Label. This is inefficient because you might
have the same email labeled many times, resulting in lots of duplicates
(one for each Label/folder).  But it does give you a way to reconstruct
Gmail Labels locally.

The method to sync these is pretty simple to understand. It has pre-IMAP
sync and post-IMAP sync stages, which in my environment are tied to
OfflineIMAP pre- and post-sync hooks. Described in prose:

# Before syncing local changes over IMAP
* The script will check to see if any emails have notmuch tags applied
  to them and if those same emails are not present in the local IMAP
  folders (maildir in my case) corresponding to the names of those
  notmuch tags. For example if I mark an email locally with the `spam`
  tag in notmuch, this script will detect that the email is not present
  in the `spam` folder on disk. The script copies the tagged mail
  physically on disk to the corresponding folder to keep them in sync.
* Likewise, if I remove a tag locally, such as the `inbox` tag to
  archive a mail (in Gmail parlance) then the script will see that the
  mail is in the folder but not tagged, and delete the mail from maildir
  on disk.

# After syncing IMAP and fetching new mail
* The script will look for new mail in maildir that does not have a
  matching tag. For instance all of the mail I receive from the
  linux-kernel mailing list is labeled `linux-kernel` by Gmail, and
  placed into the `linux-kernel` maildir locally on disk. The script sees
  this and tags the new mail with `linux-kernel` using notmuch.
* Similarly the script will notice if any mail on disk was deleted as a
  result of the IMAP sync and remove the corresponding notmuch tag
  locally. A good example here is if you log into the Gmail web client
  and *archive* some mail in your inbox that had previously been sync'd
  to your local maildir. It will have disappeared from your local
  directory due to the IMAP sync, and the script will remove the `inbox`
  tag from the mail.

This allows one to sync notmuch databases across different machines. All
changes to the local notmuch database are converted to IMAP folder
changes, and then pulled down by the other clients whenever they sync.
This is a very clean alternative compared to others methods, such as
storing the notmuch database on Dropbox, abusing `notmuch dump` and
`notmuch restore` to distribute changes across databases or anything
else super hideous like that.
