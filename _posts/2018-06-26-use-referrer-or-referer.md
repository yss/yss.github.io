---
layout: blog
title: 是用referrer还是referer？
tags: []
categories: []
summary: 

---

最近发现node服务的access日志中referrer字段都没有打出来。然后本地模拟后，发现node使用的竟然是referer字段。这是为什么呢？

# HTTP中的Referer

一切的一切都必须向标准看齐。以下是在RFC2616(<https://tools.ietf.org/html/rfc2616#section-14.36>)中定义的：

```plain
The Referer[sic] request-header field allows the client to specify,
   for the server's benefit, the address (URI) of the resource from
   which the Request-URI was obtained (the "referrer", although the
   header field is misspelled.) The Referer request-header allows a
   server to generate lists of back-links to resources for interest,
   logging, optimized caching, etc. It also allows obsolete or mistyped
   links to be traced for maintenance. The Referer field MUST NOT be
   sent if the Request-URI was obtained from a source that does not have
   its own URI, such as input from the user keyboard.
```

那么，一切就很明了，在HTTP头中定义的就是Referer，而不是Referrer。

当然，这一切都是因为拼写错误导致的。

那么，我为什么想到的是Referrer呢？

这就要回归到浏览器了。

# Document中的Referrer

我们在浏览器中要去读取Referrer，就必须这么取：`document.referrer`。

发现么？这就是差异。

# 最后

node服务本质还是服务端。开发服务端和浏览器端本质上还是有很大差异的，特别是体现两者的思维上。服务端偏重的是稳定、性能、负载。