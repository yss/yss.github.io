---
layout: blog
title: mac下创建crontab失败的问题
tags: [mac]
categories: [mac]
summary: 为什么mac下创建crontab总是失败呢

---

最近，想在自己mac电脑弄一个定时任务，按照惯例执行`crontab -e`，然后编辑一下就好了。

=== 问题 ===

但是，发现不行，报了一个莫名其妙的错误：

```plain
crontab: no crontab for yss - using an empty one
crontab: "/usr/bin/vi" exited with status 1
```

最初，感觉是不是自己的crontab命令写得有问题，然后尝试写一个最简单的，但是发现依旧不行。

=== 解决 ===

这个时候还是要仰仗大Google解决了。其实问题的原因上面的错误信息已经说明了，就是vi命令的问题。

最后，解决方式就是使用vim，即：`EDITOR=vim crontab -e`。

=== 最后 ===

想着以后不麻烦就直接改.bash_profile，增加一句:`export EDITOR=vim`。

=== 参考 ===

<https://superuser.com/questions/359580/error-adding-cronjobs-in-mac-os-x-lion>