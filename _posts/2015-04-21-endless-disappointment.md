---
layout: post
published: true
title: Endless Mobile on Kickstarter
---

Have you seen [Endless Mobile](http://endlessm.com)'s campaign on
Kickstarter? If not you should [check it
out](https://www.kickstarter.com/projects/1381437927/endless-computers).

Endless is following in the footsteps of efforts such as [One Laptop Per
Child](http://one.laptop.org/) (they employ veterans of that project),
with the major exception that they are for-profit.  Their mission is to
get low cost, geographically- and socioeconomically-relevant computers
into the hands of the billions of people that do not have access to one
already. The software is focused on education, wellness, communication
and other applications that are meaningful to the developing world.

In mid-2014 I met Matt Dalio and Cosimo Cecchi at the Endless offices in
San Francisco because I had reviewed [some
patches](http://marc.info/?l=linux-arm-kernel&m=140257724517075) from
their team and I was curious to know more about what they were doing. I
saw passion and a real belief in the goal of making the world a better
place. I think that the Endless team is onto something big and that they
will succeed.

The patches I reviewed in 2014 were for an Exynos-based device. I was
thrilled at the thought of seeding emerging markets with a device that
was not only something other than Intel's x86 architecture, but also
something other than Windows. That may sound like zealotry (and it is)
but I also find that a market benefits from having its incumbent leaders
challenged. Variety in the marketplace is a vital component for
innovation.

---

Before going further I should tell you that product definition,
requirements and architecture are my favorite parts of the product
development process. I love to let my imagination run wild during this
stage of a project, and I equally love culling those wild ideas as I
start to zero in on the real, achievable product.

So you can imagine how much fun I had with the idea of creating a
low-cost, robust solution for emerging markets with unreliable power,
sparse or low-bandwidth connectivity and a set of users that have not
grown up with a keyboard and mouse in-hand. My imagination was dreaming
of mesh networks to bridge Internet connections to a stable backbone and
tiny Li-Ion or AAA batteries inside the computer with enough juice to
hibernate to disk in the event of a power outage.

What about device lifetime? Mobile processors are often *designed to
fail* around the two year mark<sup>[0](#footnote0)</sup>. This needs to
be a 10-year device. A conservative process node would be needed to get
there. Investors experiencing heartburn over a device with such a
lengthy upgrade cycle should be reminded that the market potential is in
the billions of units.

And the cost! The original OLPC XO was originally supposed to cost less
than $100 and it had a display, keyboard and trackpad in addition to
lots of mechanical bits for opening and closing the lid, placing it into
tablet/eReader mode and for adjusting the antennas.

How to build Endless for under $100? The requirements must be managed
with an iron fist. No feature creep allowed at all.

Designing this product would have been Endless fun for me.

---

Fast forward to 2015 where I have been watching the launch countdown at
endlessm.com with anticipation. Well the wait is over, the crowd-funding
campaign has begun and the product is revealed to be ...

Endless disappointment.

Intel Celeron. 30W power supply. Blue-fucking-tooth. It looks and smells
like an Intel
[reference](http://www.dell.com/us/business/p/wyse-3000-series/pd)
[design](http://www.gigabyte.com/products/product-page.aspx?pid=5038#ov).

Why am I disappointed? First is the cost. $170 USD may sound like a
cheap computer to those reading this blog, but it won't be for many in
emerging economies.

I don't know what the volume pricing is for the N2807 processor used in
the device but it costs $117 at retail. Ouch.  There are very capable
ARM and MIPS chips out there running at gigahertz speeds with full
Debian/Ubuntu/whatever support that cost $20 at volume. And it has a fan
on it.

The question of price was important enough to [merit a
response](https://www.kickstarter.com/projects/1381437927/endless-computers/posts/1204677)
from Endless, and I completely value what they have to say about the
emerging middle class and the desire for a good product. But a cheaper
processor could have shaved enough dollars off the BOM to keep the same
$170 price and add market-specific features.

Another point that grieves me is the 30-watt power supply. I can
understand that number for a laptop powering a display and a back light
while charging a battery and browsing the web over WiFi.  But 30W just
for a headless Linux box?

For the target market I feel like this is a loss. Power regulation is
pretty bad in some parts of the world. Even in the face of stable power,
the market potential for this product is so high that we can't dismiss
the carbon footprint of rolling out millions of these devices. Putting a
5-watt supply into the wall seems more reasonable to me. This would
require a lower power design.

Finally there is the lack of any hardware specifically targeting the
needs of these emerging markets. I don't see mention of a battery-backed
solution to intermittent power loss. Hell, use AAA batteries. But again
this would require a lower power design.

There is no camera, which is fine, but all of those Cisco ads on TV tell
me that smiling children in emerging countries like to teleconference
into the classroom. Endless's own video of Radolpho shows him Skyping
with his daughter.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/-z8qvnZsXvg?start=30" frameborder="0"
allowfullscreen></iframe>

</br>

And what about all the weird stuff I haven't thought of yet? An AM/FM
radio tuner built in. A big physical button in the front that launches a
"how to use your Endless" video every time you push it. LED [night
light](http://www.etoncorp.com/en/productdisplay/blackout-buddy-0) in
the top of the box that trips when the electrical grid goes down. An
emergency hand crank that generates power over the USB port to charge up
a phone.  A handle on the top so you can carry it around without
dropping it and a little shock-proofing with rubber around the edges.

And then there is this, from the top of the Kickstarter campaign:

> A few years ago, on a trip to India, we had an epiphany: If we ran a
> full desktop operating system on the inexpensive processors that power
> smartphones, and plugged them into the TVs people already own, we
> could make a computer that is affordable to more people.


Yes! Do that! Do just that! A GSM modem with a general purpose OS hooked
up to a TV. But where is the cellular connectivity in this product? For
that matter where is the mobile processor?

Hopefully they are coming in a future product. Maybe they are coming in
a future partnership where Endless licenses software out to a phone
manufacturer for "TV Computer Mode".

Motorola already tried *exactly that* that with their
[Webtop/Lapdock](http://www.engadget.com/2012/10/07/motorola-phases-out-webtop-points-to-a-lapdock-shy-world/)
products; an Android smartphone with an HDMI/USB docking station. Plug
the phone into the dock and it runs a custom flavor of Ubuntu in
parallel to Android for the full desktop experience with a keyboard and
mouse.

Motorola targeted it at the high end of their product portfolio --
people that already own a Macbook and don't need a janky Ubuntu desktop
-- and failed.  Emerging markets are a different ballgame altogether.
Convergence devices at low cost are key.

---

Alright, I'm done poking at the fine efforts of the people at Endless.
I even retract my use of the phrase "Endless disappointment", despite
the feeling of authorial superiority that it gives me.

The truth is that Endless is a software company, while any sense of
deflation I have over the Kickstarter campaign comes soley from the
hardware.

Their software story appears well thought out and targeted at its users.
Looking at their [About Us](https://endlessm.com/about-us/#row-1) page
it is clear that Endless is investing more of its human capital into
software engineering than into electrical engineering. Well-targeted,
easy to use and easy to deploy software is their big differentiator.

My hope is that they eventually grow into the kind of product company
that focuses equally on both sides of the coin. I also hope that they
target users at the lower end of the economic scale and in more rural
locales because those are such interesting problems to solve. And most
of all I hope that they succeed in their efforts to connect the rest of
the world.

Please [check it
out](https://www.kickstarter.com/projects/1381437927/endless-computers)
if you haven't already.  I hope that you like what you see and decide to
pick up one of their devices or at least contribute to their fund
raising goals. I know I have.

---

## Footnotes

<a name="footnote0">0</a>: The reason for short silicon lifetimes in the
mobile application processor space is complicated, and only partially a
scheme to steal your dollars. Reasons include operating a chip right at
the lowest voltage margin to save power and extend battery life, as well
as exposure to over-current and over-heating thermal events as well.
Also dropping your phone in the toilet doesn't help.
