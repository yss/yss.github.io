---
layout: blog
title: 【分享】基础html讲解
tags: [html, 分享]
categories: [html, 分享]
summary: html是书写网页所必知比会的东西。html看似很少，但是它的组合变幻相当强劲有力。请听我分解
---
# 什么是html
html就是一种标记语言，用于浏览器去识别去解析的一种标记语言。

换句话说什么是标记语言呢？

给个例子，如下：
{% highlight html %}
<!-- 简单的展示作者信息的写法 -->
<author>
    <name>yss</name>
    <country>tianchao</country>
</author>
{% endhighlight %}
html也是类似这样。

## 经典的一个html结构
{% highlight html %}
<!DOCTYPE html>
<html>
    <head>
        <title>xxxooo</title>
    </head>
    <body>
        ...
    </body>
</html>
{% endhighlight %}

# head中的那几个标签
注明一点head里的标签大多都是用于描述这个网页的基本信息，一般是不会被展现出来的。

## title
title => 标题。指代的是整个网页的标题，会在浏览器的标签栏上显示出来。

## meta
meta => 元信息。你可以理解为，网页所包含的一小片段信息。参考一下下面的例子：
{% highlight html %}
<meta name="description" content="严松的个人博客之所看所想所感">
<meta name="keywords" content="yss, web前端，前端，技术，Jekyll，分享，经验，积累，个人博客">
<meta name="author" content="yansong">
{% endhighlight %}
这里面的meta信息中，有个非常值得注意的地方就是：
{% highlight html %}
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title></title>
    <meta ... />
</head>
{% endhighlight %}
它需要放在head的第一个位置，用来指明当前网页的类型和**编码方式**。

# body中的几个标签

## hn
hn => h1,h2,h3,h4,h5,h6 => 标题1，标题2，... ，标题6

## p
p => 段落。
一般情况下我们会这样写：
{% highlight html %}
<h2></h2>
<p>特别是在写博客获取其他文字描述信息类的事情时，会有很多的hn和p对应。</p>
{% endhighlight %}

## a
a => anchor => 锚，即我们通常说的一个链接的承载标签。用法如下：
{% highlight html %}
<a href="http://yansong.me/blog.html" target="_blank">博客</a>
{% endhighlight %}

## img
img => image => 图片。用法如下：
{% highlight html %}
<img src="http://yansong.me/static/img/raindrops.jpg" alt="雨滴蠢蠢欲动" />
{% endhighlight %}

## em, strong
em => 强调，一般是对某句话中的某些个词的着重说明。

strong => 加粗，一般是用于凸显对某句话中的某个词。
{% highlight html %}
<p>
这是一个非常特殊的<em>社会</em>!
特殊到，我们大部分人生活在<strong>谎言中</strong>！
</p>
{% endhighlight %}

## table
table => 表格。里面依托了很多的其他标签，换句话说就是其他标签的一个载体。看个例子：
{% highlight html %}
<table>
    <tr>
        <th>...</th>
        <th>...</th>
    </tr>
    <tr>
        <td>...</td>
        <td>...</td>
    </tr>
</table>
{% endhighlight %}

## ul, ol
ul => unorder list => 无序列表
ol => order list => 有序列表
{% highlight html %}
<ul>
    <li>...</li>
    <li>...</li>
</ul>
<ol>
    <li>...</li>
    <li>...</li>
</ol>
{% endhighlight %}

## form
form => 表单，
同理table很多标签依附于它的存在。
{% highlight html %}
<form action="/upload" method="get">
    <label for="user">用户名：</label>
    <input type="text" id="user" name="user" />
    <button type="submit">提交</button>
</form>
{% endhighlight %}

## 注释
{% highlight html %}
<!-- 这是一个注释，如果在html里，我就不会被展示出来 -->
{% endhighlight %}

## div, span
div, span是html4新加的（?），几乎有没有任何含义的标签，是所有标签的典型。

div => division => 分区，节，块状元素的典型，亦可以理解它是个地主，一出生就有一整块地。

span => 行内元素的典型，亦可以理解它是个雇农，在地主分给的一小块土地上耕耘。

# html元素的理解
html的结构就是一颗倒立的树，也可以认为它是一个族谱;)

![html结构](/static/img/html-struct.png)

而，html的每个元素都可以理解为一个长方形，占用一块地方。

![html元素](/static/img/html-element.png)

# 结语
html是一个看似很简单的东西，但是其中的奥妙非凡，需要慢慢体会。
能写出一个漂亮的html是我所求的。;_

可能现在很多公司的前端都不是很注重这块，但是我想，做为一个合格的前端工程师，你有必要深入的学习了解这些个东西。

所有的网站都是建立在html的基础之上的，同理javascript的Dom操作，css都是基于html的。
