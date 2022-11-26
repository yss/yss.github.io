---
layout: blog
title: 增加资源错误监控
tags: []
categories: [js]
summary: 关于错误监控网上有很多文章，今天我也来说，只是我说的跟他们都不一样。

---
关于错误监控网上有很多文章，今天我也来说，只是我说的跟他们都不一样。

因为他们说的都是`window.onerror=function errorHandler(message, source, lineno, colno, error)`;

具体可以转到：<https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror>

这里有详细说明这个error事件触发的方式：

1. 当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的error事件，并执行window.onerror()。
2. 当一项资源（如<img>和<script>加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror处理函数。但这些事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener捕获。

从这里可以看出，window.onerror是监控不到资源加载失败的。

那么，今天我们要讲的就是怎么去监控资源加载失败的。

# 监控资源加载失败

其实，如果细心的话，可以看到上面的第2条最后一句话：`不过（至少在Firefox中）能被单一的window.addEventListener捕获。`

那么，我们很容易得出结论，我们是可以通过监听window在捕获阶段的error事件。即：`window.on('error', fn , false);`

那更具体一点呢？我们可以从DOM Level 3定义中找到：<https://www.w3.org/TR/DOM-Level-3-Events/#event-type-error>

## error 说明
说明|描述
:----|:-----
类型|error
接口|如果是从用户界面产生的，则是UIEvent，否则Event。
同异步|异步
冒泡|否
目标|Window, Element
可撤销|否
默认动作|没有
上下文|Event.target: 目标即哪些发送错误的元素。

## error 描述

```plain
A user agent MUST dispatch this event when a resource failed to load, or has been loaded but cannot be interpreted according to its semantics, such as an invalid image, a script execution error, or non-well-formed XML.

翻译过来就是：
当一个资源加载失败，或者加载成功但是不能被正确解析，比如一个非法的图片，或者脚本执行出错，也或者一个不当格式的XML。这个时候，用户代理（浏览器）必须把这个错误事件分发出来。

```
# 实现

```js
window.addEventListener('error', function (e) {
	const target = e.target;
	if (target && (target.src || target.href)) {
		reportError('Load Error:' + target.nodeName + ' ' + (target.src || target.href));
	}
}, false);
```

这里有个坑，就在于错误上报。

要知道，如果整个上报代码都挂了，那么有监控也是白搭。

那么我们怎么解决这个问题呢？

首先，可以明确的是，当前HTML页面已经是加载了的。

那么，就说明，当前的服务是可用的，这也就意味着，可以直接给当前服务发送请求。

具体处理，要根据自己项目的实际需要做对应的处理。这里不再细谈。

当然，如果整个HTML都加载不了，当我没说。
