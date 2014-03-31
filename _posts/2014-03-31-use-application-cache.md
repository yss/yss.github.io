---
layout: blog
title: 使用Application Cache
tags: [Application Cache]
categories: [js]
summary: 新的缓存机制带来了全新的开始。
---

什么是Application Cache？

Application Cache是浏览器级的缓存机制，用来缓存资源文件。

### 如何使用？

1. 在页面的html标签上加manifest="xxx.appache"属性，xxx.appache为缓存列表的路径，可以是相对的也可以是绝对的。但路径不能跨域。比如：`<html manifest="/maoyan.appcache">`
2. xxx.appache的HTTP头中的Content-Type必须为：text/cache-manifest。

当然，.appache后缀不是必须的，名字可以任意命名。

### manifest文件格式

manifest文件格式包含四部分：

1. 声明，第一行需要且必须为：`CACHE MANIFEST`。
2. 缓存记录，写入你需要缓存的文件列表。
3. 网络记录，写入所有需要网络请求的文件列表，一般情况下都建议使用`*`。
4. 后备记录，也就是指明如果访问某个文件失败后，访问的其他地址。

整体格式非常简单：

{% highlight html %}
CACHE MANIFEST

CACHE:
http://xxx/x/x

NETWORK:
*

FALLBACK:
http:://xxx/x http://xxx/xx

{% endhighlight %}

#### 关于网络记录

如果当前状态是离线状态，那么之前访问过的页面依旧可以访问。

### 两个问题

看似华丽的外表却又隐藏一个又一个的坑。

1. 加入manifest属性的页面，默认也加入到缓存中，如果缓存文件没有更新，页面也不会更新。
2. manifest文件更新不会立即生效，需要下次载入页面后生效。

那我们如何使用才能达到我们需要的一个完美效果呢？

### 解决方案

1. 在页面中iframe嵌入引入manifest页面，并且这个页面只有manifest。   
    *这样一来我们就可以保证manifest的更新与否不会影响正常的页面*。
2. 每个资源文件是带版本号的，比如我们这边静态上线会去计算文件的版本号，然后生成对应的文件：`a.js -> a.xxxxxx.js`。     
    *这样一来每次有资源文件更新，在页面引入的时候相当于一个新的文件，这样也就不影响正常访问*。

### 参考

<https://developer.mozilla.org/zh-CN/docs/HTML/Using_the_application_cache>
