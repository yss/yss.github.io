---
layout: blog
title: HTTP缓存
tags: [http]
categories: [http]
summary: 非常有必要深入了解并且掌握HTTP缓存

---

当我们谈优化的时候，我们可能会想到很多，图片，资源压缩，gzip等等。

其中，很重要的一点就是：HTTP缓存。也就是让浏览器帮你缓存。

那怎么知道一个网站有没有使用HTTP缓存呢？

我们打开chrome，输入一个网址，调出控制台，选中network的tab，刷新，然后，里面有一项叫着`Size`，如果看到`from disk cache`，那么说明这个网站用了HTTP缓存。

那HTTP缓存都有哪些呢？

### Last-Modified

顾名思义，就是上次的更新时间。具体的过程大概是这样子的：

1. 一个请求来到服务器，如果HTTP头没有`If-Modified-Since`，那么Server设置一个`Last-Modified`的头：Server ==Last-Modified==> Browser
2. 浏览器发现有`Last-Modified`的头，那么浏览器就会缓存当前资源。如果下一次再有同样的请求发出时，浏览器会拼接上`If-Modified-Since`的头给服务器：Brower ==If-Modified-Since==> Server
3. 如果Server判断当前资源未更新，即If-Modified-Since === Last-Modified时，返回304，内容为空。

这样，整个环流就出来了。

### ETag

被翻译成实体标签，说白了就是给你返回的内容打标签的意思。具体的过程跟上面的`Last-Modified`一致。

差别在于：

1. `ETag`是和`If-None-Match`对应。
2. `ETag`的一般做法是取内容的hash值，而`Last-Modified`对应的是最后修改时间。

两者之间各有好坏，需要根据自己的项目做对应的处理。

### Cache-Control

最后就是缓存控制，也叫缓存策略。就是去设置缓存的过期时间。

一般情况下是和上面的`Last-Modified`和`ETag`搭配使用。然后它自己有好几种类型的值。

#### no-cache和no-store

1. `no-cache`表示浏览器每次请求都要去和Server端核实一下是否有更新。
1. `no-store`表示浏览器每次都去请求最新的，不用在本地缓存，也就是不缓存。

从上面可以看出`no-cache`是不能单独使用的，必须配合上面的缓存是否过期判断来使用的。

#### public和private

1. `public`表示你的信息是公开的，哪怕访问你这个资源是需要HTTP身份验证的也是可以缓存的。
2. `private`表示只能浏览器本身缓存。这个看起来有歧义，如果是单个点对点的网络通信，这个确实没有任何意义，但很多时候我们会用代理或者CDN之类的时候，就相当于告诉这些中间端不要缓存这个响应。

#### max-age

定义缓存的时间，单位是s。

### 最佳实践

一般来说，我们都希望：
1. 静态资源只要一加载就永远缓存在本地。
2. 静态资源一旦有更新就要立刻更新。

这么一来，衍生出来的就是我们上线前都会对静态资源打包，压缩，加版本号。

对应的就是：

1. Document: Cache-Control: no-cache // html文档每次都请求校验是否更新
2. JS/CSS: 加版本号，然后Cache-Control: max-age=31536000 // js,css永久缓存，设置为一年的缓存期，也就代表不更新。
