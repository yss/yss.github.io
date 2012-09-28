---
layout: blog
title: 使用Jekyll需要注意的几点
tags: [jekyll]
categories: [jekyll]
summary: 总结自己在使用jekyll所碰到那的些个问题，并且分享给大家，希望对大家有帮助。
---
### jekyll --no-auto
运行：jekyll --no-auo相当于build整个目录，通过运行这个命令可以知道你博客是不是有错误发生。

正常情况下，我们使用jekyll --auto --server只是简单的运行本机服务器，然后--auto是检测当前目录下是否有文件变动，如果有就重新生成对应变动的文件。

### pagination in jekyll
pagination顾名思义就是分页，需要在_config.yml设置（如：paginate: 3），它的意思就是提供一个paginator对象，调用方式为：paginator.posts。来取到所有当前页的文章。

但是非常非常困惑和不解的是pagination只支持在index.html操作。。。

具体可以参考：<a href="https://github.com/mojombo/jekyll/wiki/Pagination" target="_blank">Pagination</a>

### highlight in jekyll
你需要这么设置：
{\% highlight language \%}
your code
{\% endhighlight \%}
并且，需要在_config.yml里加pygments:true。最后再在css文件里加上对应的css。可以参考本文所用的css。

但是，很纳闷的是不支持CSS？highlight css这样的写法，在运行jekyll --no-auto会报错：
../lib/jekyll/convertible.rb:81:in `do_layout': undefined method `name' for <Post: /2012/09/19/some-notes-in-less>:Jekyll::Post (NoMethodError)

*后期，突然某天发现可以正常使用css了。* ;)

### 希望此篇文章对新学jekyll的你有帮助
