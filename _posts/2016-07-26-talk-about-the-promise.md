---
layout: blog
title: 浅谈Promise
tags: [promise]
categories: [js]
summary: Promise在前端开发中被广泛的利用，特别是在Node.js中
---

# 前言

相信大家都一定用过Promise。

Promise在前端开发中被广泛的利用，特别是在Node.js的开发中。

# 细说Promise

Promise定义了五个方法，分别是：then, catch, resolve, reject, all。

## then

说到then，我们大部分时候只用到了第一个参数。即：`promise.then(function(data){ /* your code */ })`。

then其实是提供了两个参数，分别是onFulfilled, onRejected.

onFulfilled就是当结果正确返回时调用，也是我们最常用的。

onRejected就是当结果失败或者出现异常时调用。但是这个方式用得很少，因为我们都使用了下面的方法了。

## catch

catch方法其实等价于`.then(null, function(){ /* your code */ })`。

看到这里，我想大家就很清楚这个方法了吧。

## resolve

标准的实现中，它其实是一个静态方法，即：`Promise.resolve(data)`。这里面data可以是任意数据。

执行上面的那句话后，就相当于返回了一个fulFilled的Promise对象。

## reject

同理resolve，它相当于返回了一个rejected的Promise对象。

## all

all方法也是一个静态方法，即：`Promise.all([p1, p2])`。但它的参数是一个Promise对象的数组。

只有以下两个条件之一满足，则立即执行：

1. 任意的一个Promise对象返回了rejected的Promise对象。
2. 所有的Promise对象都执行完，且返回了fulFilled的Promise对象。

# 抽象一点

我们来个比较形象的比拟这个过程：

Promise的整个调用更像是一个单链表。而每个链表上的节点就是一个Promise对象。即：

P1 -> P2 -> P3 -> P4 -> P5 -> ...

任意一个节点，一定包含resolve或者reject方法中的一个。
