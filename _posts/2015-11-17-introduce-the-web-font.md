---
layout: blog
title: 介绍一下Web Font
tags: [Web Font]
categories: [css]
summary: 很早就使用webfont了，所以更需要大力推广给身边的人
---

### 前言

作为前端，跟图片，特别是图标打交道是经常的事情，经历过最初的一个个小图方式到使用sprite图，接着就是data-uri，再到现在的web font方式了。

从这里看感觉技术变迁得好快呀～

但是不管怎么说归根结底，这些东西都是为了提升性能和效率的。本质就是优化的事情，如何尽量减小网络请求，如何最好最方便的管理自己的项目。毕竟维护一个东西才是重中之重。

### Web Font

在这，我们首先需要知道什么是Web Font。从字面上的意思来看，本质就是font，也就是字体文件。然后是Web，也就是供Web调用的。

然后就可以总结成一句话：在网页上使用的字体文件。

#### 浅谈制作过程

关于制作，这里面我躺过很多坑。最开始一直纠结在使用Photoshop把做好的图通过一个工具自动转为icon。但后来都失败了。

1. 尝试过png转svg，针对简单图形，都还可以，稍微复杂一点就不行了，画得都不对。而且生成的图标大小是无规律的。
2. Photoshop矢量图层转svg，又失败了，因为很多图标的制作都不是在一个图层上。（另外需要说明一下，Photoshop CC 2015支持图层转svg）

最后的最后，还是从头来，最终确定按照阿里的[Web Font制作规范](http://www.iconfont.cn/help/iconmake.html)执行。

总结成三步：

1. 制作对应的AI文件。
2. 通过AI文件生成svg文件。
3. 通过svg文件生成我们需要的字体文件。

这里简单说一下什么是svg。svg别名就是`Scalable Vector Graphics`（可伸缩的矢量图形）。

它不是图片，它是描绘一系列曲线或者直线的代码。本质上是继承XML的标记性语言。看个例子：

{% highlight xml %}
<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" 
    width="467" height="462">
  <!-- This is the red square: -->
  <rect x="80" y="60" width="250" height="250" rx="20" fill="red"
         stroke="black" stroke-width="2px" />
</svg>
{% endhighlight %}

#### 前端实现

当我们在平台上传svg文件后，再下载字体文件时，平台都已经帮我们生成好了对应的样式，如下：

{% highlight css %}
@font-face {
    font-family: 'icomoon';
    src:url('fonts/icomoon.eot?it5zbe');
    src:url('fonts/icomoon.eot?it5zbe#iefix') format('embedded-opentype'),
        url('fonts/icomoon.ttf?it5zbe') format('truetype'),
        url('fonts/icomoon.woff?it5zbe') format('woff'),
        url('fonts/icomoon.svg?it5zbe#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
}

[class^="icon-"], [class*=" icon-"] {
    font-family: 'icomoon';
    /* more code */
}

.icon-xx:before {
    content: "\e636";
}
{% endhighlight %}

引入上面的css，然后在html中，写上：`<i class="icon-xx"></i>`，打开一下，图标就出现了。

当然，为了兼容不支持属性选择器（如：`[class=^="icon-]`）和伪类（如：`:after`）的浏览器，我们需要额外处理一下对应的CSS和html，这个不在本文讨论访问内而且不支持的浏览器会越来越少。。

那使用Web Font有什么好处和坏处呢？

#### 好处

1. 占空间小，除了一些特别复杂的图标外，一般一个简单的图标大小应该在0.3KB以内。
2. 可大可小不失真，无论放大放小都不失真。
3. 网络请求少，只需要一次网络请求加载。
4. 维护成本低，只需要维护整个字体文件即可。
5. 减轻设计师切图时间，不再需要设计师切某几个固定尺寸的图片以及不同颜色的图（比如hover和active效果），不再为图可能切大或切小而苦恼。

#### 坏处

1. 只支持纯色。
2. 程序方面在用到图标时需要额外处理（当然，web前端这块，平台生成时已经帮忙统一处理掉了）。

#### 适用范围

当然，如果仅仅认为它只能在Web端使用话，那你就错了。它是全平台通用的。

不管曾经的你身处何方，只要有人机交互，需要界面的地方，都是它应用的地方。

只是Web环境比起其他平台来说它非常特别，它需要支持不同的平台，导致它需要生成不同平台的字体文件。

这里，IOS和Android端就轻松了，它只需要一个`ttf`字体文件即可。

#### IOS和Android端的应用

具体请参考：阿里的图标应用教程 <http://www.iconfont.cn/help/iconuse.html>

### 最后

希望在项目中更多的适用Web Font。更好的提升开发效率。
