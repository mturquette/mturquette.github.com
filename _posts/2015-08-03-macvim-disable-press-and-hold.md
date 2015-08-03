---
layout: post
title: Disabling Press-and-Hold for MacVim
---

Mac OS X has a nice Press and Hold feature that allows users to select
accents and less commonly used characters by simply holding down a key
on the keyboard for a short time. A small pop-up like the following will
give users the option for that particular character,

<img src="/images/macvim-disable-press-and-hold/accent.png" border="2"
style="border:2px solid black;max-width:640px;" alt="îêôûâˆ" />

Unfortunately these feature gets in the way for some applications like
MacVim, where I want to hold `j` or `k` for scrolling through text. Some
quick Google searching showed me that many users of Sublime Text 3 had
managed so to solve the problem with,

<script src="https://gist.github.com/kconragan/2510186.js"></script>

I use MacVim and needed to apply the same setting to that application,
as I did not want to disable the feature globally. So I went with the
brute force method. Looking at the above Gist I ran `defaults` until I
got some useful info,

```
$ defaults find vim | grep key
Found 1 keys in domain 'com.apple.preferences.extensions.ShareMenu': {
Found 1 keys in domain 'com.apple.Preview': {
Found 1 keys in domain 'com.apple.preferences.extensions.ServicesWithUI': {
Found 1 keys in domain 'Apple Global Domain': {
Found 1 keys in domain 'com.apple.dock': {
Found 1 keys in domain 'com.apple.recentitems': {
Found 8 keys in domain 'org.vim.MacVim': {
Found 1 keys in domain 'com.apple.ServicesMenu.Services': {
Found 1 keys in domain 'org.vim.MacVim.LSSharedFileList': {
$ defaults write org.vim.MacVim ApplePressAndHoldEnabled -bool false
```

The first command finds the string for editing properties/defaults for
MacVim. The second command then adapts the first command in the GitHub
Gist above for the org.vim.MacVim namespace.

After restarting MacVim, everything works beautifully! Note that if you
use vim within a terminal emulator on Mac OS X then you likely do not
see this issue, as your terminal emulator probably disabled
press-and-hold as a sane default. The above is only needed if you use
the GUI MacVim interface.
