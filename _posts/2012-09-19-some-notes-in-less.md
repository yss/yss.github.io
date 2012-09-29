---
layout: blog
title: 用LESS需要注意的几点
tags: [less]
categories: [less] 
summary: 写LESS虽然和写CSS很相似，但是还是有很多地方需要注意，本文要阐述的就是这方面的内容
---
写LESS和写CSS基本上没有什么差别，对于前端开发者来说，很容易上手。下面讲讲less下的一些个坑。
### 第一点：filter && Expression
filter是IE特有的属性，写法很多，很复杂。这个时候就需要调用less内置的忽略方式：~"..."（有时候它就像万能充电器一样）。

同理expression也是一样的。
{% highlight css %}
filter: ~"progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#444444')";
/* opacity可以直接写 */
filter: Alpha(opacity=80);
behavior: ~"expression((this.hideFocus=true,this.behavior='none'))";
{% endhighlight %}
### 第二点：IE HACK
IE HACK主要是用于特殊情况的IE处理，正确情况下，应该是避免尽量少的使用。但是怎么去避免使用呢？这好像不是本文的话题。我之前写过一篇文章《论HTML的重要性》主要就是为了阐明这方面问题。;)

说多了...忘了说此时说的IE HACK指的其实是两种：\0 \9。比如：
{% highlight css %}
line-height:20px\0; /* only IE 8 */
line-height:19px\9; /* all of IE */
{% endhighlight %}

这个时候他们的解决办法和第一点的filter相同。

### 第三点：mixin
mixin在less里是混合的意思，就是把两种颜色叠加起来，相当于photoshop里的颜色融合。不是取两种颜色值之和的一个比例。

如果你要取两种颜色中间的值，比如两种颜色的中间值，那么直接：(x + y) / 2

### 第四点：注释的位置
假如一个样式表达式里只包含了注释，也会被解析出来。
{% highlight css %}
#id {
    /* this is comment */
    .class {
        height: 20px;
        ...
    }
}
    || 解析成
    \/
#id { /**/ }
#id .class { ... }
{% endhighlight %}
这样的话肯定不是我们想要看到的，所以尽量不要在{}里加注释。
要加的话尽量用 // 代替 /\*  \*/的注释，因为 // 注释不会输出。
