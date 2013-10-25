---
layout: blog
title: 在浏览器中打开客户端
tags: [客户端, 浏览器]
categories: [浏览器]
summary: 这个时候我们就需要尝试性的去打开客户端，如果打不开，我们就去下载或者去到下载页。
---
### 前言
之前我写过一篇文章关于如何在浏览器中检测是否安装了客户端，今天要说的是在浏览器中打开客户端。

这是为什么呢？

因为检测是否安装了客户端是不准的。比如：IOS6以下的系统，Android下猫眼后台进程被关闭了等。

这个时候我们就需要尝试性的去打开客户端，如果打不开，我们就去下载或者掉到对应下载页。

这也就是本文的核心。

### 实现
如果我们通过Google搜索相关的东西。

我们都不难找到这么一个事实就是尝试性的去打开，打开不了就去下载。

{% highlight js %}
(function() {
    var appUrl = 'app_url_scheme://app_index_url',
        downloadUrl = 'http://_go_to_download_';

    window.location.href = appUrl;

    setTimeout(function() {
        window.location.href = downloadUrl;
    }, 500);
})();
{% endhighlight %}

但是在尝试的过程中，我发现一个问题就是我去到了客户端，然后我又回到浏览器时，setTimeout里的内容依旧被执行（就是自动下载了）。

### 其他说明
除了上面例子，我还做了其他两个方案。

1. 一个是创建一个script标签，src为appUrl。然后判断监听onload和onerror属性。 
 但发现不管客户端有没有安装都是error。即调用onerror方法。
2. 另一个是创建iframe标签，基本思路和上面一致。 
 但发现不管安没安装客户端，都不会触发onload和onerror事件。
