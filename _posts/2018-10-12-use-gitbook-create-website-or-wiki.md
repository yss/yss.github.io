---
layout: blog
title: 使用gitbook在github上创建网站或wiki
tags: []
categories: [git]
summary: 介绍如何在github中使用gitbook创建一个网站或wiki

---

本文主要是谈及在github中使用gitbook。

# 前言
我们知道gitbook初衷是希望帮助他人快速创建文档，特别是技术类文档。

当然，确实很多开源软件都使用gitbook写文档。但还有很多人在上面写书，写博客等等。

本质上，它就是工具，提供了一个很方便快捷的方式，让人们搭建一个文档系统。

# 用法

对于前端来说，安装起来也非常的简单。就是一个命令：`npm install gitbook-cli -g`

然后，通过`gitbook init`初始化项目。

通过`gitbook serve`启一个本地的服务，动态更新你的修改。

最后，只需要修改`SUMMARY.md`文件，按照它的格式要求，具体可以参考：<https://toolchain.gitbook.com/pages.html>

# 在github中使用

我们知道github提供一个方式，就是通过创建一个分支`gh-pages`，然后就可以把你这个分支（gh-pages）发到一个专门的静态服务上。

结合这个功能，我们就可以通过gitbook这个工具，帮我们在github上生成自己的网站或wiki了。

1. 首先，在github上新建一个仓库，比如：`gitbook-example`。
2. 然后，本地通过git clone下下来。
3. 接着，在这个仓库的目录下执行`gitbook init`。
4. 之后，就执行`gitbook serve`，按你的需要去完成wiki。
5. 最后提交后，然后，创建`gh-pages`分支，通过执行`gitbook build`，删除除了_book外的所有文件，最后执行`mv _book/* .`，把_book文件夹下的所有文件都挪到根目录。最后提交即可。

这个时候，你就可以直接在网上看到你的网站了：http://yourname.github.io/gitbook-example

# 最后

gitbook在使用上和github提供的jekins很像。但差别就在于，jekins需要你自己去找模板然后自己配置。

而gitbook直接就有默认的模板，只要按照它的方式去做就好。

当然，你也可以简单的理解为，gitbook本身包含了一个jekins工具和一个对应的wiki模板系统。

当你只需要自己写文档，写一些文章的时候，我是强烈推荐直接使用gitbook来生成你的网站。

# 参考

<https://toolchain.gitbook.com/>

<https://www.gitbook.com>