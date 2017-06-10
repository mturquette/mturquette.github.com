---
layout: post
title: GPG, SSH & U2F via Yubikey 4c on macOS, Linux & Android
published: true
---

> Start with how to create an AUTH subkey (separate article?)
>
> Explain that private keys are transferred to card, but pubkeys stay on
> host computer
>
> ssh-agent and gpg-agent forwarding from macOS to Debian

# Table of Contents:

1. [How I use my Yubikey & GnuPG](#how-i-use-my-yubikey-gnupg)
1. [A note on GnuPG versions](#a-note-on-gnupg-versions)
1. [A note on Yubikey models](#a-note-yubikey-models)
1. [Make a backup](#make-a-backup)
1. [Reset factory pins](#reset-factory-pins)
1. [Edit your new key](#edit-your-new-key)
1. [Transfer existing GPG keys](#transfer-existing-gpg-keys)
1. [Generate new SSH AUTH key](#generate-new-ssh-auth-key)
1. [Using AUTH subkey for SSH](#using-auth-subkey-for-ssh)
1. [Yubikey 4c & Password Store on Android](#android)
1. [Set up FIDO U2F for GitHub](#set-up-fido-u2f-for-github)
1. [Miscellaneous bits](#mis)

# <a href="how-i-use-my-yubikey-gnupg"></a> How I use my Yubikey & GnuPG

I use the Yubikey 4c daily to improve my personal and professional security
online. The two use cases for me are:

1. GnuPG private key store
1. FIDO U2F authentication

I use GnuPG daily to do the following:

1. signing git tags
1. using the AUTH key for secure shell authentication
1. securely store passwords with [pass](https://www.passwordstore.org/) on
   macOS and using [Password
   Store](https://github.com/zeapo/Android-Password-Store) on Android

I store three 4096-bit *subkeys* on my Yubikey:

1. Signing subkey
1. Encryption subkey
1. SSH AUTH subkey

My master signing key is stored securely on paper, in a vault. I rarely use it
except to create new subkeys, generate revocation certs, etc. Keeping your
[master signing key
offline](https://incenp.org/notes/2015/using-an-offline-gnupg-master-key.html)
is the smart choice.

I rarely encrypt or decrypt messages using GnuPG. My use cases are about
authentication and verification. Pass/Password Store both use encryption
extensively, but it's all hidden from the user behind a few simple wrapper
commands.

I use the Yubikey model that supports USB Type-C. This is the essential piece
that allowed me to use the same 4096-bit subkeys on both my laptop and my
smartphone. Prior to this I was forced to use 2048-bit keys on the, now defuct,
[Sigilance card](https://www.sigilance.com/). This was a big pain because the
card and card reader are clunky, and it also forced me to use dedicated
2048-bit keys just for for Pass/Password Store. I still used the 4096-bit keys
for Linux kernel maintenance. Now I use only the 4096-bit keys for *everything*
and have revoked the 2048-bit keys.

I use FIDO U2F for the websites, apps and services that support the standard.
Sadly, many still do not.

# <a href="a-note-on-gnupg-versions"></a> A note on GnuPG versions

I use GnuPG v2.1 (aka Modern) on macOS and Debian. Migrating to this version
will make backwards-incompatible changes to your keyring. It also comes with
some pleasant changes to the otherwise unpleasant experience of using GnuPG,
which is worth it in my opinion. Please do not take the decision to upgrade
lightly.

It can be difficult to remove versions 1.x and 2.0 from your system. Dependency
creep from other packages installed on your computer may bring them back in.
Certain applications may only know how to talk to the older libraries and
agents. For instance I had to [remove all GnuPG-related
features](https://github.com/mturquette/alot/commit/3635055f9527e1bf0140dabac77f2a161d4f89b8)
from my favorite mail editor in order to keep it working after upgrading to
GnuPG v2.1 Modern. I never use GPG for email and I don't miss the features.

Mac users that have installed [GPGTools](https://gpgtools.org/) will be greeted
by a native UI when plugging in their Yubikey. Other UNIX users might just do
it all in the terminal via the gpg or gpg2 commands (this is what I use in my
examples below). Linux desktop users may edit their cards with a GTK- or
KDE-specific interface.

Many of these GUI software suites built on top of GnuPG are incompatible with
v2.1 Modern. Buyer beware.

# <a href="a-note-yubikey-models"></> A note on Yubikey models

There are a variety of different Yubico products, differences in firmware and
hardware revisions, and lots of different procedures floating around the web.

This guide focuses purely on the new Yubikey 4, which involves a simpler
process compared to some of the arcane steps required with the older Yubikey
Neo. CCID mode is not set by default on the Neo, so make sure you [do that
first](https://www.yubico.com/support/knowledge-base/categories/articles/use-yubikey-openpgp/)
if you have that model.

Additionally this guide focuses on transferring existing keys to the Yubikey 4.
I will create a shiny new AUTH key however, just to illustrate how that works.
I'm using the Yubikey 4c, which works on both my Macbook Pro and my Google
Pixel smarthphone.

If you have a Neo, or if you want to generate new keys on the card I
recommend first reading [Richard North's
blog](https://rnorth.org/8/gpg-and-ssh-with-yubikey-for-mac). I also
recommend [Trammell Hudson's blog](https://trmm.net/Yubikey), which generates
the keys off the card, and then transfers them.

Many of the things in this blog post are more succintly explained in this
[Linode](https://www.linode.com/docs/security/gpg-key-for-ssh-authentication)
article, which I recommend reading as well.

I will interchangeable refer to the *Yubikey*, the *4c*, the *card* and the
*key card*. They are different names for the same thing: the Yubikey dongle
plugged into your USB port.

# <a href="make-a-backup"></> Make a backup

`gpg --export-secret-key --armor YOURKEY > YOURKEY.gpg.armor`

Leaving the armor file on-disk is dangerous. It contains your private key,
which anyone could use to impersonate you. There are lots of great resources on
how to make proper backups of your keys via QR codes, USB drives or CDs.

I'm a fan of printing my secret key paper and storing it in a safe or vault.
Don't forget to generate a [revocation
certificate](https://wiki.debian.org/Keysigning#Step_2:_Generate_a_revocation_certificate).
Store this in your safe alongside your private key.

# <a href="reset-the-factory-pins"></> Reset the Factory Pins

The *admin* and *user* pins on your Yubikey are set at the factory. They are
the same for all consumer-grade Yubico devices. We'll start by changing them to
something secret. While we're at it we will personalize the key card.

Things can go wrong while editing the card sometimes. Below I describe the
process of editing the card fully. Read this first before you start typing
commands. The log at the bottom of this section contains the actual commands
and expected output. Simply follow along with that log and you should be fine.

In case things do go wrong I have also included steps on how to recover if you
accidentally lock yourself out of your own key card. This can be caused by too
many attempts to unlock the key card with the wrong pin. Resetting the card can
also fix some other weird, anomolous behavior.

The factory *admin* pin is `12345678`. The new *admin* pin you supply must be
at least 8 characters long. After changing the *admin* pin you should see `PIN
changed`. If not, try again and make sure your new pin is at least 8 characters
long.

If you see an error like `Error changing the PIN: Conditions of use not
satisfied` it typically means that your pin was too short and was *not* saved.
Try it again with an appropriate length pin.

The factory *user* pin is `123456`. The new *user* pin you supply must be at
least 6 characters long. After you see `PIN changed` you can move on to
personzliation.

It is possible to lock your key card out from any further changes by trying to
enter an incorrect pin too many times. You must reset the card to factory
settings and try again. Save the following to a file named `reset-card-script`:

```
/hex
scd serialno
scd apdu 00 20 00 81 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 81 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 81 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 81 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 83 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 83 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 83 08 40 40 40 40 40 40 40 40
scd apdu 00 20 00 83 08 40 40 40 40 40 40 40 40
scd apdu 00 e6 00 00
scd apdu 00 44 00 00
/echo Card has been successfully reset.
```

And then run `gpg-connect-agent -r reset-card-script`. You'll have done a
factory reset on the card and can start over from the top of the log.

Personalization is an optional step. The log below details the most common
parameters that users might wish to change.

Now plug in your shiny new Yubikey and follow the output of my session below:

# <a href="edit-your-new-key"></a> Edit your new key

```
$ gpg2 --card-edit

Reader ...........: Yubico Yubikey 4 OTP U2F CCID
Application ID ...: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: XXXXXXXX
Name of cardholder: [not set]
Language prefs ...: [not set]
Sex ..............: unspecified
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]

gpg/card> admin
Admin commands are allowed

gpg/card> passwd
gpg: OpenPGP card no. XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX detected

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 3
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 1
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? q

gpg/card> name
Cardholder's surname: Turquette
Cardholder's given name: Michael

gpg/card> lang
Language preferences: en

gpg/card> sex
Sex ((M)ale, (F)emale or space): M

gpg/card> url
URL to retrieve public key: http://deferred.io/3a8f3b2f5a7c9849.txt

gpg/card> login
Login data (account name): mturquette

gpg/card> quit
```

# <a href="transfer-existing-gnupg-keys"></> Transfer existing GnuPG keys

I will populate all three key slots on the Yubikey 4c with *subkeys*, not the
primary signing key. I keep my primary key offline, on paper, in a vault.

For illustration purposes, this is what it looks like to push a primary key to
the Yubikey 4c/card (I don't do this myself):

```
$ gpg --edit-key
...
gpg> toggle
...
gpg> keytocard
Really move the primary key? (y/N) y
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]

Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1
```

The *key* command select subkeys. Use this to push subkeys to the Yubikey 4c.
Personally, I have created a separate signing subkey, and this is what I use to
populate the signing slot on my card. In the example below I move the
encryption subkey off of my hard disk and onto the key card:

```
gpg> key 2

pub  rsa4096/3A8F3B2F5A7C9849
     created: 2012-02-18  expires: never       usage: SC
     trust: ultimate      validity: ultimate
sub  rsa2048/04022B7507176F5D
     created: 2016-06-20  expired: 2017-06-20  usage: S
sub* rsa2048/B92E93D2387E0EF4
     created: 2016-06-20  expired: 2017-06-20  usage: E
gpg> keytocard
Signature key ....: BE4B AF4E CAB0 C33F 9235  20C4 3A8F 3B2F 5A7C 9849
Encryption key....: [none]
Authentication key: [none]

Please select where to store the key:
   (2) Encryption key
Your selection? 2
...
gpg> key 2
...
```

Note the final `key 2` command. This deselects this particular subkey. You can
repeat this process using different subkey indices for the signing subkey (if
you have one) and your AUTH subkey (again, if you have one).

# <a href="generate-new-ssh-auth-key"></a> Generate a new SSH AUTH key

If you do not have an AUTH subkey and want to use it for SSH key
authentication, then follow the steps on [this Yubico
page](https://www.yubico.com/support/knowledge-base/categories/articles/use-yubikey-openpgp/).

A few notes:

1. Create the AUTH key on-disk, instead of on-card
1. Then move it using the same steps used in the above section
1. Disable unwanted subkey capabilities before saving the subkey to disk

The Yubico instructions mention to select the 'A' capability for AUTH, but they
neglect to point out that some GnuPG versions will also select S (Sign) and E
(Encrypt) by default. You might want to toggle those off if you already have
subkeys for these functions

# <a href="using-auth-subkey-for-ssh"></a> Using AUTH subkey for SSH

Now that you have the AUTH subkey on-card, let's setup SSH to use it.

First, add the following line to some sort of script that is run before SSH can
be invoked. In my case I put this in `~/.config/omf/init.fish`, as I use [Oh My
Fish](https://github.com/oh-my-fish/oh-my-fish) to manage stuff for
[fish](https://fishshell.com/), my preferred shell.

```
## GPG and SSH agent configuration

gpg-connect-agent /bye
export SSH_AUTH_SOCK=(gpgconf --list-dirs agent-ssh-socket)
```

gpg-agent needs SSH support to be explicitly enabled. Add the following to
`~/.gnupg/gpg-agent.conf`:

```
enable-ssh-support
```

Kill all ssh-agent and gpg-agent instances. Typically opening a new shell
instance will kick off the machinery above and you should see your new shiny
AUTH key by running:

```
ssh-add -l
4096 SHA256:osIdSEalN4U4ib8wTqpdu1OWKvNTPzIDSZNi58s6AAs cardno:000605762380 (RSA)
```

You'll still need to distribute the public key to your remote machines.
Generate it with:

```
ssh-add -L >> ~/.ssh/authorized_keys
```

It will be the last RSA key in the file. Distribute that to all of the remote
`authorized_keys` files and you'll be in business.

If you have not already unlocked your key in gpg-agent then you might see the
following:

```
ssh 192.168.0.13
sign_and_send_pubkey: signing failed: agent refused operation
mturquette@192.168.0.13's password:
```

Doing some sort of gpg operation (encrypt a file, etc) will prompt you for your
passphrase, unlock the key, and then you should be able to SSH without issue.
Folks not using GnuPG v2.1 (Modern) might find
[Keychain](http://www.funtoo.org/Keychain) useful for solving this issue. For
v2.1 I'm still trying to figure out the best way...

# <a href="android"></a> Yubikey 4c & Password Store on Android

Recent Android smartphones support USB Type-C ports that are compatible with
the Yubikey 4c. This means that both [Password
Store](https://github.com/zeapo/Android-Password-Store) and
[OpenKeychain](https://github.com/open-keychain/open-keychain) can use the
Yubikey 4c as a key card.

Pass relies on OpenKeychain for GnuPG support. For users without a hardware key
card OpenKeychain expects them to import their GPG secret key onto the phone.
In my opinion this is *unsafe and terrible advice*. Especically for all the
cool kids running around with rooted phones and custom ROMs that they simply
trust to not do nefarious things with their personal info...

Note that both projects can be a bit slow about pushing the latest versions of
their code to the Google Play Store. I recommend building both from source.
That's out of scope for this post, but both build quite easily using the
Android SDK and can be pushed over to your phone with a simple `adb install
pass.apk`.

Once both are installed open the OpenKeychain application and plug in your
Yubikey 4c. You'll need to create an identity and  bind the key to it. Success
looks like this:

<img src="/images/yubikey4-gpg-ssh-u2f/openkeychain.png" />

Now you're ready to use Password Store to share encrypted passwords between
your smartphone and all of your computers. I host my pass git on a private
Github repository. I suggest you do keep access to the git repo private,
because even if others cannot decrypt your passwords they will be able to
deduce the websites, services, applications, usernames and any other cleartext
information that makes up the structure of your `~/.password_store` directory.

My config:

<img src="/images/yubikey4-gpg-ssh-u2f/pass.png" />

Note that I do not use `ssh://` for the protocol, but `https://`. Why? Because
SSH requires you to store you SSH private key on the phone. My goal is to never
store private key data on the phone.

The only downside to this approach is that in order to pull the latest
passwords from Github, I must first remember to decrypt my Github password,
then select `Pull from remote` and finally paste my password into the field. No
big deal and worth the peace of mind.

If you've followed along to this point you should have GPG subkeys stored on
your Yubikey 4c and you should also be able to share encrypted passwords
between your workstations using `pass` and your Android smartphone using a
combination of `Password Store` and `OpenKeychain`. Congratulations!

# <a href="set-up-fido-u2f-for-github"></a> Set up FIDO U2F for GitHub

[Github Help](https://help.github.com/articles/configuring-two-factor-authentication-via-fido-u2f/) covers this pretty well already.

I have had success interchangeably using FIDO U2F and GPG on the same key. No
need to kill `gpg-agent` or `ssh-agent` or hotplug the device (so far).

This only works in Chromium so far, but hopefully mobile apps will start to
adopt it in the future.

# <a href="misc"></a> Miscellaneous bits

If you use a signing *subkey* like me, and you prefer to use it for most common
signing operations, you might want it to be the default key. Unfortunately
GnuPG documentation is simply garbage and you might be surprised to find out
that setting `default-key mysubkey` in `gpg.conf` doesn't work! Subkeys require
a bang at the end, to denote that they are subkeys. My `~/.gnupg/gpg.conf`
file:

`default-key A23A9C9BC325A4D4!`

Similarly for git I prefer to use my signing subkey. My `~/.gitconfig` file:

~/.gitconfig

```
[user]
	email = mturquette@deferred.io
	name = Michael Turquette
	signingkey = A23A9C9BC325A4D4!

```

The same syntax can be used from the commandline. In this example we sign the
`f1` file with my signing *subkey*:

```
gpg2 -u A23A9C9BC325A4D4! -s f1
```
