---
layout: blog
title: 安装nodejs
tags: [node]
categories: [nodejs]
summary: 简单介绍一下如何正确安装nodejs
---

# 前言

我记得在ubuntu下，某个版本的node，安装还比较麻烦，需要自己下载整个node包，然后自己在本机编译。

现在一切都变了，变得很简单。

# 正常篇

上nodejs下载页：https://nodejs.org/download/下载对应最新版本的nodejs。

linux安装比较简单，就是把.tar.gz的包下载下来，然后通过 tar -xzvf xxx.tar.gz解压到你常用的软件目录。

最后配置一下对应PATH路径，指向nodejs解压目录。

# 推荐篇

安装nvm，然后再使用nvm安装任意版本的nodejs。

具体参考：https://github.com/creationix/nvm

{% highlight sh %}
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
nvm install 0.12
# 这一步很重要，不然每次新开tab都将不能直接使用node
nvm alias default stable
{% endhighlight %}
