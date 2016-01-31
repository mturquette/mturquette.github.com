---
layout: post
title: Introspecting GitHub Pages version history
---

See that nice little blockquote right above this line? That's what this article is about.

deferred.io is powered by GitHub Pages and its source is version controlled publicly [on GitHub](https://github.com/mturquette/mturquette.github.com). For the uninitiated, [GitHub Pages](https://pages.github.com/) is a free web hosting service offered by GitHub for websites whose source is version controlled on GitHub. It's all very GitHub-y.

Since we have access to the source and the version history, it seems like a nice idea to make it easy for readers to see how an article has changed over time. I wish more news and journalism sites did this as a matter of transparency... No more ninja edits.

The implementation is super easy. I hard-coded the URL bits, but those could probably be generalised with some nice [Liquid Templates](http://jekyllrb.com/docs/templates/). I wanted this feature on every page, which means editing the `post.html` layout. One-liner solution for my blog below:

<script src="https://gist.github.com/mturquette/a53ff247e0fc4e75c15c.js"></script>

So meta! My inner Hofstadter is pleased.
