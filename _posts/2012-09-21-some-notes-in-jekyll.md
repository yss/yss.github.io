---
layout: blog
title: 使用Jekyll需要注意的几点
tags: [jekyll]
categories: [jekyll]
summary: 总结自己在使用jekyll所碰到那的些个问题，并且分享给大家，希望对大家有帮助。
---
# jekyll --no-auto

* *新的jekyll变成了使用jekyll serve去启动你的程序*
* *jekyll build去编译你的blog*
* *如果jekyll build出错的话，加一个-t参数，追踪错误的堆栈信息*

运行：jekyll --no-auo相当于build整个目录，通过运行这个命令可以知道你博客是不是有错误发生。

正常情况下，我们使用jekyll --auto --server只是简单的运行本机服务器，然后--auto是检测当前目录下是否有文件变动，如果有就重新生成对应变动的文件。有问题的话，你也不会导致你不能访问你的网站。因为网站指向的是_site目录，错误的请求下，你依旧访问的是之前生成的文件。

# pagination in jekyll

pagination顾名思义就是分页，需要在_config.yml设置（如：paginate: 3），它的意思就是提供一个paginator对象，调用方式为：paginator.posts。来取到所有当前页的文章。

但是非常非常困惑和不解的是pagination只支持在index.html操作。。。

具体可以参考：<a href="https://github.com/mojombo/jekyll/wiki/Paginoation" target="_blank">Pagination</a>
最新的是：<http://jekyllrb.com/docs/pagination/>

# highlight in jekyll

你需要这么写：

> {&#37; highlight language %}

> your code

> {&#37; endhighlight %}

并且，需要在_config.yml里加pygments:true。最后再在css文件里加上对应的css。可以参考本文所用的css（.highlight那部分哦）。

# 后记

希望此篇文章对新学jekyll的你有帮助
