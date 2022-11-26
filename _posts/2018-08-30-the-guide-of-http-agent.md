---
layout: blog
title: 解读http.Agent
tags: []
categories: []
summary: 

---

起初是在node.js的http模块的文档里发现有一个`http.Agent`类，但是真正注意到它，并且使用到它的是在某一次的优化里。

`Agent`字面意思就是代理。文档给出的定义是：

> An Agent is responsible for managing connection persistence and reuse for HTTP clients.

翻译过来就是：

> 代理（Agent）是负责管理 HTTP 客户端连接，保证连接的可持久化，并且可复用。

这么一翻译，瞬间就明白它的作用。我们来看一个HTTP的请求过程。

# 请求过程

一个HTTP请求的完整过程大概是这样：

1. 通过域名去DNS服务查找域名所对应的ip。
2. 跟服务器建立TCP连接。
3. 给服务器发送HTTP连接请求，然后进行数据传输。

那么，Agent做的是哪个步骤呢？

我们查看源代码<https://github.com/nodejs/node/blob/master/lib/_http_agent.js>，可以看到最终调用的是`createConnection`，对应的定义如下：

```js
Agent.prototype.createConnection = net.createConnection;
```

这么一来，我们知道，Agent管理的是TCP连接。

# 定义

我们先看Agent的定义：

```js
new Agent({
	keepAlive: boolean, // 保持可用状态，即使目前没有请求。默认false,
	keepAliveMsecs: number, // keepAlive为true时有效，即保持可用状态的时间
	maxSockets: number, // 同一个域名最大的并发量，默认Infinity
	maxFreeScokets: number // keepAlive为true时有效，即最大的空闲TCP连接数。默认256
});
```

通过上面定义，我们可以发现，如果要使用Agent，那么keepAlive必须设置为true。

# 使用

那么，何时使用呢？

理论上来说，只要你调用了http或者https模块，在node端去请求接口时都应该去使用。

除非，你只请求一次，或者间断性的请求。

而，具体Agent里定义的值，需要你根据实际请求去设置。