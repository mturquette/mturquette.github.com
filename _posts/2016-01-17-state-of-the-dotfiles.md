---
layout: post
title: State of the Dotfiles, 2016
published: true
tags: env, sotdf
---

> Part of an on-going series of articles describing the state of my
> dotfiles, UNIX environment and workflow in 2016. This meta-article
> serves as the Table of Contents and a short overview

## The articles
1. [Bidirectional synchronization of notmuch tags with IMAP folders and Gmail Labels](/2016/01/17/notmuch-tags-gmail-labels-bidirectional-sync.html)
1. Email is kind of a big deal. How I filter, label and work
1. Getting things done while traveling: selective IMAP folder sync &
   msmtp mail queue
1. Pass, Keychain, GitHub and the death of cleartext passwords
1. Ghar: consistent, rapid deployment of UNIX dotfiles
1. Fish, Oh-my-fish and POWERLINE ALL THE THINGS
1. Yubikey management for 2FA, SSH, GPG and disk encryption
1. Tricks & tips: happy cron jobs, reusing dotfiles across OS X & Linux

---

In 2013 I wrote an
[article](/posts/2013/01/13/email-workflow-for-champions.html)
on my email workflow. It covered installation, configuration and usage
of my email toolchain, which in 2013 was: Gmail, offlineimap, notmuch,
afew and alot. Since then a lot of people have asked me a lot questions
about it.

# So what's different since 2013?

Fast forward to 2016: much has changed and much has stayed the same. In
the intervening years I have tried different MUAs including
[mutt-kz](https://github.com/karelzak/mutt-kz),
[notmuch-ruby-vim](http://git.notmuchmail.org/git/notmuch/tree/HEAD:/vim),
the deprecated
[notmuch-vim](http://git.notmuchmail.org/git/notmuch/tree/HEAD:/contrib/notmuch-vim),vanilla
mutt with [notmuchfs](https://github.com/tsto/notmuchfs) and more. I
don't use emacs, but I almost switched just for
[notmuch.el](http://git.notmuchmail.org/git/notmuch/tree/HEAD:/emacs).

In the end I came back to using [alot](https://github.com/pazz/alot),
despite its flaws. I also fall back on vanilla mutt combined with
notmuchfs for certain tasks. If I ever take the time to finish
supporting [thread
reconstruction](https://github.com/tsto/notmuchfs/issues/5) then I might
find this option more useful.

I no longer use [afew](https://github.com/teythoon/afew) for initial
tagging.  [#112](https://github.com/teythoon/afew/issues/112) was a
show-stopper bug for me and it looks like the code is no longer actively
maintained.

My lifestyle and work life has become more mobile. This does not jive
with my 2013 toolchain that required me to SSH into a single machine to
have access to a rich database of full-text email search (I'm looking at
you, [sup](http://supmua.org/) users). Bidirectionally syncing these
tags with IMAP folders and Gmail Labels has allowed me to sync notmuch
tags across multiple machines through IMAP.

Also part of my mobile lifestyle change was the desire to not sync all
of my mail, but only the relevant bits to reduce on-disk size and the
amount of time spent syncing with IMAP after a long period of dormancy.
This has had a profound impact on my new toolchain.

I have also cleaned up and streamlined my dotfiles. I tried over a dozen
different dotfile management _frameworks_ (see [GitHub ❤
~/](http://dotfiles.github.io/)). The most UNIX-y approach of just about
any of them is [ghar](https://github.com/philips/ghar) by [Brandon
Philips](https://twitter.com/BrandonPhilips). I started using it in 2013
and never looked back.

While living in San Francisco I also became a software hipster, started
using a Macbook Pro and thus _had_ to try Z shell and
[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh). After a couple
of weeks failing to grow a moustache I reverted to Bash and the
shameless copycat framework
[bash-it](https://github.com/Bash-it/bash-it), which I used for a couple
of years. I finally settled on [fish](http://fishshell.com/) and
[oh-my-fish](https://github.com/oh-my-fish/oh-my-fish) which has left me
in a state of unending bliss.

Of course I have continued to
[Solarize](http://ethanschoonover.com/solarized) the heck out of
everything and that aesthetic compulsion expanded to
[Powerline](https://github.com/powerline/powerline) the heck out of
everything.

I got serious about using a hardware security token for 2FA with
[YubiKey](https://www.yubico.com/products/yubikey-hardware/yubikey4/).
That effort expanded to improve my SSH, GPG and disk encryption
practices.

And I finally started using a proper password manager to generate, store
and retrieve strong passwords for all of my services. Integrating
[pass](http://www.passwordstore.org/) into a non-interactive worflow
(e.g. IMAP authentication from a cron job) has resulted in me removing
cleartext passwords from all my dotfiles.

## I have done the hard work for you.

Follow along with the articles linked at the top of the page and enjoy
your UNIX experience even more in 2016.
