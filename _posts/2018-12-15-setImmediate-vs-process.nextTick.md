---
layout: blog
title: 对比setImmediate和process.nextTick
tags: []
categories: [node]
summary: setImmediate和process.nextTick差异在哪里呢

---

`setImmediate`和`process.nextTick`都是node.js层面的概念。

要理解两个的差异，首先要谈的node.js的事件循环。

### node.js事件循环

通过官方博客<https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/>，我们可以得知，node的事件循环是这么一个过程：

1. timers阶段：执行setTimeout和setInterval回调函数。这个比较好理解，就是执行所有到点的定时器回调。
2. pending callbacks阶段：执行哪些需要延迟到下一个循环迭代的I/O回调。文档上说主要是系统层面的错误，比如TCP错误。
3. idle, prepare阶段：内部使用。
4. poll阶段：轮询，主要是I/O回调和网络请求相关的回调，比如接收请求、读完文件等。
5. check阶段：setImmediate回调。
6. close阶段：主要是socket关闭事情。

### 很好理解的setImmediate

通过上面列举的6个阶段，清晰明了的指出了setImmediate的状态就是，单独作为一个阶段去执行。也相当于是整个node.js事件循环最后阶段去执行。

那么，nextTick呢？

### 无处不在的nextTick

官方文档给的说明是：

每个阶段最后都会有一个`nextTickQueue`，这意味着，每个阶段执行完后，都会去执行nextTick里定义的内容。

所以，他们的适用场景是不一样的。

### 使用场景

官方推荐是尽可能去使用setImmediate去做的。

而使用nextTick主要是出于两方面考虑：

1. Allow users to handle errors, cleanup any then unneeded resources, or perhaps try the request again before the event loop continues.
2. At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues.

翻译过来就是：

1. 允许用户去处理当前的错误，清理不需要的资源，或者请求出错尝试重试。
2. 这条不是特别好理解，我的理解就是某些写法上把监听后置，需要等到监听注册完成后在执行。