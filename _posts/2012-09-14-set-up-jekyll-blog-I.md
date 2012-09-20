---
layout: blog
title: 基于jekyll的个人博客搭建（一）之_config.yml
categories: [jekyll]
tags: [jekyll, _config.yml]
summary: _config.yml是jekyll的配置文件。具体包括：(...此处省略很多..)。这里之所以没有一一列出来是因为，讲那么多完全没有必要，因为开始的你根本用不上这些个配置
---
### 前言
在读本文章之前，你需要懂那么一点git的知识。但是不是最重要的。

### 什么是_config.yml
_config.yml是jekyll的配置文件。具体包括：(...此处省略很多..)。这里之所以没有一一列出来是因为，讲那么多完全没有必要，因为开始的你根本用不上这些个配置。

我们所需要了解的就是以下三个：

1.  permalink：这个规定了你博客的URL地址 。默认是date

    一般像我是这样配置是：/:year/:month/:day/:title.html

    就代表着你博客显示的URL应该是类似这样子的：http://yansong.me/2012/09/15/test-blog.html

2.  auto：这个指代的是否有文件更新就需要更新站点。默认是false

    一般的话，特别是最开始都需要设置为：auto 因为我们更新得很频繁。

3.  markdown：指代的是你采用什么模板编写你的博客。默认是maruku

    像其他人一样，我使用的是rdiscount，为什么呢？我想是因为maruku不是很灵活，特别是在里面加入html标签，是有问题的。

#### 最后的代码
{% hightlight javascript %}
permalink: /:year/:month/:day/:title.html
# 当修改文件时重新生成站点
auto: true
markdown: rdiscount
{% endhightlight %}

### 后记
其实你不做任何配置也是没有关系的。;)

但是不管怎么样，auto还是很有必要做配置的。

这里作为第一步：创建_config.yml文件。
