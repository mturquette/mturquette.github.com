---
layout: post
title: use cscope to navigate your code.  no srsly, use it.
date: '2009-08-19T00:12:00-07:00'
tags: []
tumblr_url: http://turqee.tumblr.com/post/166276509/use-cscope-to-navigate-your-code-no-srsly-use
published: false
---
I went off the deep end earlier this year and decided I must have a full GUI IDE for writing code.  No one can explain this phenomena, seeing how througout all of 2007 and 2008 I used ratpoison exclusively as my window manager.
With an increased need to develop and test GNOME components I did eventually switch to a full GNOME desktop environment on my work PC and with that came a sort of freakish hunger to use Anjuta or Eclipse or whatever to reach some kinda of mouse-clicky C-navigating nirvana.
Big mistake.  I won’t go into the reasons why Eclipse’s CDT code indexer just breaks all over itself on epic codebases such as Linux (which use lots of macro defs and GCC extensions) or why Anjuta insists on littering my git repository with things I simply don’t want.  The point is that I came back to my senses and once again started using vim with cscope.
The following is a quick set of steps to get cscope up and running quickly for the specific case of Linux kernel development.  I won’t be setting up some central location for storing cscope files such as ~/cscope/ nor will I by using $CSCOPE_DB.  Instead I’m just going to create the index files in the root of my kernel git tree where they will safely be ignored by the .gitignore file there.
The working directory will need to always be the root of my kernel tree this way.  IE, if I cd to $LINUX/drivers/video/omap/ and then open a file there, cscope will not work for me.  Instead cd simply to $LINUX and then ‘vim drivers/video/omap/whatever.c’.  Got it?  Good.
Install cscope if you haven’t already.  For Debian derivatives:
sudo apt-get install cscope
For convenience install the vim keymap plugin for cscope from here.  The rest of this tutorial will take place in the top level of the kernel source:
cd ~/linux-omap-2.6/
Use the following command to create a list of files to index.  More notes on this method below the code block:
find . -path "./arch/*" ! -path "./arch/arm*" -prune -o -path "./include/asm-*" ! -path "./include/asm-arm*" -prune -o -path "./tmp*" -prune -o -path "./Documentation*" -prune -o -path "./scripts*" -prune -o -name "*.[chxsS]" -print >  cscope.files
The above find command populates cscope.files with a list files for indexing.  This includes drivers and arch/arm since I care about OMAP and ARM.  However I don’t care about indexing code from other architectures, nor do I care about indexing the docs, scripts and other stuff.  I could also fine tune this to only care about OMAP-specific arch stuff, but I’ve left it as generic for all ARM machines for readability.
Experiment with that command to construct a list of files that is perfect for your needs.  Now lets use cscope.files to generate the data needed by cscope proper:
cscope -b -q -k
This command will create cscope.out and some other files.  Now I’m ready to start using the index.  First I’ll skip straight to the definition of some symbol:
vim -t spi_device
The above will probably pull up a text menu giving me options with the line from each relevant source file containing that symbol.  In my kernel sources I get four options, the fourth of which is the actual struct definition in include/linux/spi/spi.h.  I just need to press ‘4’ and ‘enter’ and boom I’m whisked away to that file.  Neat huh?
Now inside of spi.h I will put cursor anywhere over the file path in:
#include <linux/device.h>
and quickly tap Ctrl-\ + f.  That is to say “hold control and backslash at the same time and then quickly tap f”.  The “f” in this combo means “take me to the file under my cursor” and of course is only relevant to file paths.  This becomes handy quickly.
Say I open drivers/video/omap2/displays/panel-zoom2.c and put my cursor over the path in:
#include <mach/mux.h>
Hitting Ctrl-\ + f results in the following menu popping up:
Cscope tag: mach/mux.h #   line  filename / context / line 1      1  arch/arm/mach-davinci/include/mach/mux.h <<<unknown>>> 2      1  arch/arm/plat-omap/include/mach/mux.h <<<unknown>>>Type number and <Enter> (empty cancels):
For anyone that has had to keep track of multiple architectures or get used to a new kernel version that has a different layout of code this is clearly helpful.
Probably the feature I use the most is the cursor symbol search.  This works identical to the cursor file search above, but instead of placing the cursor on a file path you just place it over a symbol.  For example in the same panel-zoom2.c I can put my mouse over the function name in:
static void zoom2_panel_disable(struct omap_dss_device *dssdev){ if (dssdev->platform_disable) dssdev->platform_disable(dssdev); mdelay(4);}
and press Ctrl-\ + s.  This present a menu showing all of the uses of ‘zoom2_panel_disable’ in the code.  In this case they are all local to panel-zoom2.c but they could be all over the place.  Likewise if I just want the global defininition of a symbol instead of a list of every place it exists I can use Ctrl-\ + g.
I don’t have have my cursor over a symbol to search for it either (though this will often by the case).  In vim’s command mode I can run:
:cscope find s omap3_enable_io_chain
And I will be greeted with the familiar window you get when using cursor symbol search.  To see more options for command mode search just run:
:cscope
Finally I can use Ctrl-t to pop these search results off of the stack and effectively go backwards through my search.  This is helpful for digging into code I am not familiar with in a source file, finding out all of the details through cscope searches, and then backing out to my original files to write slightly more enlightened code.
