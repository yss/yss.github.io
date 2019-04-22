---
layout: blog
title: 慎用X-Requested-With判断是否是Ajax请求
tags: []
categories: []
summary: 一般我们喜欢在服务端使用X-Requested-With头来判断是否是Ajax请求，但

---

一般我们喜欢在服务端使用X-Requested-With头来判断是否是Ajax请求，但现实情况是使用这种请求会有风险。

这种风险不在于逻辑有问题，而在于jQuery.ajax对这个X-Requested-With头的处理。

### 背景

查看服务日志，发现错误日志报了很多这样的错：`this request must be xhr request`。

细看一下，都是因为没有X-Requested-With这个头导致的。

但，这是为什么呢？

终于在各种尝试下，才发现是因为服务发生错误后，ajax进行了多域名重试的逻辑处理，然后发送请求的时候少了`X-Requested-With: XMLHttpRequest`这个头。

但是为什么会少了呢？

终于在jQuery.ajax源码里发现了这句：

```js
if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
	headers[ "X-Requested-With" ] = "XMLHttpRequest";
}
```

如果是跨域的话，默认就不会设置这个头。

### 处理

#### 前端层

针对所有请求都强制加上这个头，可以在$.ajaxPrefilter中处理

#### 服务端层

1. 后期摒弃在同一个请求里，针对Ajax请求做特殊处理的情况。
2. 不要通过X-Requested-With来判断是否是Ajax。
