---
layout: blog
title: 用LESS需要注意的几点
tags: [less]
categories: [less] 
summary: 写LESS虽然和写CSS很相似，但是还是有很多地方需要注意，本文要阐述的就是这方面的内容
---
### 第一点：filter
filter是IE特有的属性，写法很多，很复杂。这个时候就需要调用less内置的忽略方式：~"..."。如：filter:~"Alpha(opacity=80)";

### 第二点：IE HACK
IE HACK主要是用于特殊情况的IE处理，正确情况下，应该是避免尽量少的使用。但是怎么去避免使用呢？这好像不是本文的话题。我之前写过一篇文章《论HTML的重要性》主要就是为了阐明这方面问题。;)

说多了...忘了说此时说的IE HACK指的其实是两种：\0 \9。比如：
{% highlight css }
line-height:20px\0; // only IE 8
line-height:19px\9; // all of IE
{ endhiglight %}
这个时候的解决办法和第一点的filter相同。

### 第三点：mixin
mixin在less里是混合的意思，就是把两种颜色叠加起来，但是却不同于取两种颜色值之和的1/2。

如果你要取两种颜色值之和的1/2，直接：(x + y) / 2
