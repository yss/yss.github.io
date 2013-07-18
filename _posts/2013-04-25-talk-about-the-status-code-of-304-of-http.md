---
layout: blog
title: 谈谈HTTP的304状态码
tags: [http, 304]
categories: [http]
summary: 我们都知道HTTP的304状态码代表的是Not Modified，但是它到底直接读的缓存，还是向服务发送了一次请求呢
---

作为前端算是经常跟HTTP协议打交道，说起304，更是不陌生了。静态资源缓存也是我们需要做的。

但是HTTP 304到底是怎么回事呢？

这里需要谈谈HTTP中的几个HEADER。

### Cache-Control
顾名思义就是缓存控制。有四个对应的值，分别为：

1. public 指代的是响应数据可以被任何客户端缓存。
2. private 指示响应数据可以被非共享缓存所缓存。这表明响应的数据可以被发送请求的浏览器缓存，而不能被中介所缓存
3. no-cache 指示响应数据不能被任何接受响应的客户端所缓存
4. max-age 数据经过max-age设置的秒数后就会失效，相当于HTTP/1.0中的Expires头。如果在一次响应中同时设置了max-age和 Expires，那么max-age将具有较高的优先级。

### 参考
<http://alicsd.iteye.com/blog/814276>
