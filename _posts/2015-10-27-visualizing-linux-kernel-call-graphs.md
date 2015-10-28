---
layout: post
title: Visualizing Linux kernel call graphs
published: true
---

Visualing call graphs is a great way to familiarize oneself with a piece of code. I recently did some work to rewrite the locking in the cpufreq subsystem in the Linux kernel; understanding how all of those functions relate was not trivial using only cscope/ctags and by inspection.

What I wanted was a visualization of the call graph, either as a PDF or an image format. Egypt combined with GraphViz and an SVG viewer does this nicely.

# Generating the call graph

Unlike approaches using cscope output or patched versions of gcc, [Egpyt](http://www.gson.org/egypt/) is a very lightweight approach that only requires one to build the software with the `-fdump-rtl-expand` GCC option set.

We don't want to generate a call graph for the entire kernel (well, maybe you do...) but since I only want to see the cpufreq call graph I made the following change to drivers/cpufreq/Makefile:

<script src="https://gist.github.com/mturquette/c0e40e3427b39e97d39a.js"></script>

Now build the kernel with `make` (obviously make sure that `CONFIG_CPU_FREQ` is set). You should see some new `.expand` files such as:

```
$ ls -1 drivers/cpufreq/*.expand
drivers/cpufreq/cpufreq.c.170r.expand
drivers/cpufreq/cpufreq-dt.c.170r.expand
drivers/cpufreq/cpufreq_governor.c.170r.expand
drivers/cpufreq/cpufreq_ondemand.c.170r.expand
drivers/cpufreq/cpufreq_opp.c.170r.expand
drivers/cpufreq/cpufreq_performance.c.170r.expand
drivers/cpufreq/cpufreq_stats.c.170r.expand
drivers/cpufreq/cpufreq_userspace.c.170r.expand
drivers/cpufreq/dbx500-cpufreq.c.170r.expand
drivers/cpufreq/exynos5440-cpufreq.c.170r.expand
drivers/cpufreq/freq_table.c.170r.expand
drivers/cpufreq/omap-cpufreq.c.170r.expand
drivers/cpufreq/spear-cpufreq.c.170r.expand
drivers/cpufreq/tegra124-cpufreq.c.170r.expand
drivers/cpufreq/tegra20-cpufreq.c.170r.expand
```

Now we need to visualize this data.

# Build and install Egypt

```
wget http://www.gson.org/egypt/download/egypt-1.10.tar.gz
tar -xzf http://www.gson.org/egypt/download/egypt-1.10.tar.gz
cd egypt-1.10
perl Makefile.PL
make
sudo make install
```

Verify that we can generate call graph info from our `.expand` files:

```
$ egypt /home/mturquette/src/linux/drivers/cpufreq/cpufreq.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq-dt.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_governor.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_ondemand.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_opp.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_performance.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_stats.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_userspace.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/freq_table.c.170r.expand
```

Great! We have the call graph data, and a tool to parse it into a meaningful format. Now to visualize our data.

# Generate the SVG

If you do not have the veritable [Graphviz](http://graphviz.org/) suite installed already:

```
sudo apt-get install graphviz
```

This gives us the `dot` application for generating simple images from well-formated data. To create an SVG of all of the core files for the cpufreq subsystem we must feed the data into do. Using the same command as above, we'll pipe the data into dot:

```
$ egypt /home/mturquette/src/linux/drivers/cpufreq/cpufreq.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq-dt.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_governor.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_ondemand.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_opp.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_performance.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_stats.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/cpufreq_userspace.c.170r.expand \
/home/mturquette/src/linux/drivers/cpufreq/freq_table.c.170r.expand | dot -Grankdir=LR -Tsvg -o callgraph.svg
```

# Viewing it

For large call graphs I recommend [Inkscape](https://inkscape.org/). You can print to PDF from here, or to a dead tree. Really the sky is the limit.

Enjoy visualizing your new call graphs!

> Thanks to this Stack Overflow [answer](http://stackoverflow.com/a/517797) and Airead Fan's [blog](http://www.aireadfun.com/blog/2012/12/04/use-egypt-to-create-call-graphs/) for making me aware of Egypt
