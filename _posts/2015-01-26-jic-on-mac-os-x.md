---
layout: post
published: true
title: jic on Mac OS X
---

jic is a nice tool for interacting with JIRA from a terminal emulator.
Authored by Serge Broslavsky it can be found on
[GitHub](https://github.com/ototo/jic).

I installed it on Mac OS X and captured the Exact Steps(tm) here. I
assume the reader favors Homebrew for package management on Mac OS X.

First, install the prerequisites:

```
$ brew update
$ sudo easy_install pip
$ brew install homebrew/completions/pip-completion
$ sudo -H pip install tlslite
$ sudo -H pip install oauth2
$ sudo -H pip install jira-python
$ sudo -H pip install keyring
$ sudo -H pip install python-magic
```

> Note: I have `sudo -H pip` aliased to `pip` to make life easier

I don't use the oauth2 bits above but jic v15.01.1 chokes if it is not
installed. I've filed a [bug](https://github.com/ototo/jic/issues/18) on
GitHub.

Now that the prerequisites are installed clone the latest from jic and install it:

```
$ git clone https://github.com/ototo/jic.git
$ cd jic
$ mkdir ~/.jic
$ cp config ~/.jic/
$ ln -sf $(pwd)/jic ~/.local/bin/
```

> Note: The last line should put `jic` in your PATH. I like to keep my executables in ~/.local/bin

Before actually using jic you need to edit your `~/.jic/config` file.
Below is the diff from the default config and the one I use:

```
--- config      2015-01-26 08:14:29.000000000 -0800
+++ /Users/mturquette/.jic/config       2015-01-26 08:52:49.000000000 -0800
@@ -2,8 +2,8 @@
 #
 # Put this file into ~/.jic/ directory

-o.browser = 'sensible-browser'
-o.editor = 'sensible-editor'
+o.browser = 'chrome'
+o.editor = 'vim -c "set textwidth=72" -c "set wrap" -c "set spell" -c "set nocp"'

 # default caching mode: 'cached', 'offline', 'online'
 o.cache.mode = 'online'
@@ -25,10 +25,10 @@
 o.server = 'default'

 # set to your server
-o.servers.default.url = 'https://some.host.org'
+o.servers.default.url = 'https://cards.linaro.org'

 # set to your user name
-o.servers.default.user = 'user.name@some.host.org'
+o.servers.default.user = 'mike.turquette@linaro.org'

 # set to your password or keep commented out to get a prompt
 #o.servers.default.password = ''
@@ -46,7 +46,7 @@
 o.servers.default.cache.ttl = 7200

 # point this to a writable directory in path
-o.symlink.location = '~/bin/'
+o.symlink.location = '~/.local/bin/'
 o.symlink.mode = 0777

 # porcelain mode command definitions are below
```

Now run `jic commands symlink` and you will see several new commands
added. Mine are at ~/.local/bin/ per the config fragment above.

Finally run `jls` and you should see any open issues on your Jira
server, assuming that you configured things correctly in ~/.jira/config
and that the new executables are in your PATH.

I was also greeted with the following warning:

```
/Library/Python/2.7/site-packages/requests/packages/urllib3/connectionpool.py:734: InsecureRequestWarning: Unverified HTTPS request is being made. Adding certificate verification is strongly advised. See: https://urllib3.readthedocs.org/en/latest/security.html
  InsecureRequestWarning)
```

I've filed another [bug](https://github.com/ototo/jic/issues/17) and
hope that bit gets resolved soon.
