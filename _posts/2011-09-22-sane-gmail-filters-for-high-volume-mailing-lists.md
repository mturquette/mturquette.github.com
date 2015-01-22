---
layout: post
title: sane Gmail filters for high-volume mailing lists
date: '2011-09-22T20:55:00-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/10542468006/sane-gmail-filters-for-high-volume-mailing-lists
published: true
---
I’m a Linux kernel dev and I subscribe to mailing lists that get a lot
of mail and I use Google Apps (Gmail) as my back-end mail service.

Unlike most UNIX wizards with their GNU beards and ancient, curmudgeonly
ways I actually like using the web interface of Gmail… but I did have
one very big problem using filters and labels for my many
[FLOSS](http://en.wikipedia.org/wiki/Free_and_open_source_software#FLOSS)
mailing lists.

I cannot possibly afford to have mail from various Linux kernel mailing
lists land in my primary “Inbox” label, lest my infrequent (and arguably
more important) non-mailing list mail become lost in the sea of email
that I’ll never get around to reading. I needed to separate out the
FLOSS mail into separate folders, or in Gmail parlance I would “archive”
all of my mailing list mail. Logically I labeled such mail with a name
matching the list the mail came from.

For example a patch might hit both the linux-omap list and the
linux-arm-kernel list. Two independent filters would operate on this
thread and label it “linux-omap” and “linux-arm-kernel” respectively.
Both filters would also archive the thread so that my inbox would not
become inundated with close to 1,000 new mails every day.

This worked great except for when someone sent the mail to me and Cc’d
the list, or if I was in Cc on a mail sent to a list. In this case I
want to get the mail in my inbox so that I know it requires my
attention. So how to do this with gmail’s rudimentary filters?

After some searching I sadly discovered that gmail has no real
conditional logic in its pattern matching support. What I needed was an
‘if’ statement to control whether or not to archive a mail, based on
whether I was explicitly in the To: or Cc: fields. Then after a few
minutes of ponderation it hit me: why not create two filters for each
mailing list?

Turns out that this method works like a charm. Just create a filter for
the mailing list and label it without archiving the mail. Then copy that
filter exactly but add a “to:-me” to the pattern matching bit, and make
this filter label it and archive it. The first filter makes sure that
mails to the list are labeled correctly, regardless of whether or not
they were also addressed to me. The second filter insures that mail to a
list which is not addressed to me is archived. Two filters for every
mailing list sounds lame, but setting it up is a one-time cost that made
me oh so happy.

Below is an xml file that contains my filters for some common Linux
kernel mailing lists. You can copy these to a file and import them into
your Gmail account by clicking Settings->Filters->Import filters (at the
bottom of the page).

Happy mailing!

```
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006">
	<title>Mail Filters</title>
	<id>tag:mail.google.com,2008:filters:1313004678084,1313004772616,1313004852285,1313004872468,1313007102064,1316738936946,1316738965298,1316738992251,1316739011736,1316739058305,1316739079342</id>
	<updated>2011-09-23T24:57:42Z</updated>
	<author>
		<name>Turquette, Mike</name>
		<email>mturquette@ti.com</email>
	</author>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1313004678084</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="to" value="-me"/>
		<apps:property name="hasTheWord" value="list:&quot;&lt;linux-kernel.vger.kernel.org&gt;&quot;"/>
		<apps:property name="label" value="linux-kernel"/>
		<apps:property name="shouldArchive" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1313004772616</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="hasTheWord" value="list:&quot;&lt;linux-kernel.vger.kernel.org&gt;&quot;"/>
		<apps:property name="label" value="linux-kernel"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1313004852285</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="to" value="-me"/>
		<apps:property name="hasTheWord" value="list:&quot;linux-pm.lists.linux-foundation.org&quot;"/>
		<apps:property name="label" value="linux-pm"/>
		<apps:property name="shouldArchive" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1313004872468</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="hasTheWord" value="list:&quot;linux-pm.lists.linux-foundation.org&quot;"/>
		<apps:property name="label" value="linux-pm"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1313007102064</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="subject" value="[PATCH]"/>
		<apps:property name="hasTheWord" value="&quot;Signed-off-by: Mike Turquette &lt;mturquette@ti.com&gt;&quot;"/>
		<apps:property name="label" value="patch"/>
		<apps:property name="shouldAlwaysMarkAsImportant" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316738936946</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="to" value="-me"/>
		<apps:property name="hasTheWord" value="list:&quot;linaro-dev.lists.linaro.org&quot;"/>
		<apps:property name="label" value="linaro-dev"/>
		<apps:property name="shouldArchive" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316738965298</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="hasTheWord" value="list:&quot;linaro-dev.lists.linaro.org&quot;"/>
		<apps:property name="label" value="linaro-dev"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316738992251</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="to" value="-me"/>
		<apps:property name="hasTheWord" value="(list:&quot;&lt;linux-omap.vger.kernel.org&gt;&quot; OR list:&quot;&lt;linux-omap-open-source@linux.omap.com&gt;&quot;)"/>
		<apps:property name="label" value="linux-omap"/>
		<apps:property name="shouldArchive" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316739011736</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="hasTheWord" value="(list:&quot;&lt;linux-omap.vger.kernel.org&gt;&quot; OR list:&quot;&lt;linux-omap-open-source@linux.omap.com&gt;&quot;)"/>
		<apps:property name="label" value="linux-omap"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316739058305</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="to" value="-me"/>
		<apps:property name="hasTheWord" value="list:&quot;&lt;linux-arm-kernel.lists.infradead.org&gt;&quot; OR list:&quot;&lt;linux-arm-kernel@lists.arm.linux.org.uk&gt;&quot;"/>
		<apps:property name="label" value="linux-arm-kernel"/>
		<apps:property name="shouldArchive" value="true"/>
	</entry>
	<entry>
		<category term="filter"/>
		<title>Mail Filter</title>
		<id>tag:mail.google.com,2008:filter:1316739079342</id>
		<updated>2011-09-23T24:57:42Z</updated>
		<content/>
		<apps:property name="hasTheWord" value="list:&quot;&lt;linux-arm-kernel.lists.infradead.org&gt;&quot; OR list:&quot;&lt;linux-arm-kernel@lists.arm.linux.org.uk&gt;&quot;"/>
		<apps:property name="label" value="linux-arm-kernel"/>
	</entry>
</feed>
```
