---
layout: blog
title: Javascript中的自定义事件
tags: [javascript, 事件]
categories: [javascript]
summary: 理解Javascript中的自定义事件
---

事件驱动是Javascript重要的功能点。

### 什么是自定义事件

自定义事件常伴左右，但是我们可能用得很少，我们可以看看jQuery的用法：
{% highlight bash %}
// 监听自定义事件
$node.on(CUSTOM_EVENT_NAME, callbackFn);
// 触发自定义事件
$node.trigger(CUSTOM_EVENT_NAME, params);
// 解除自定义事件
$node.off(CUSTOM_EVENT_NAME, fn);
{% endhighlight %}

看到这里，我们会发现，这个跟我们常用那些个浏览器事件用法几乎一样，只是多了个触发的方法。

那我们应该怎么去理解自定义事件呢？

### 实现

让我们来看看真实的自定义事件的实现，这样一来就很容易理解自定义事件了。

首先，有个事件对象，我们叫`Events = {};`。

#### 事件监听

每次事件监听（或者说注册），比如`$node.on(EVT_NAME, evtFn);`，对应的其实是对事件对象做了这么一个处理：`Events[EVT_NAME] = [evtFn]`;

相当于是给事件对象增加了一个key值和对应存放回调函数的数组对象。

#### 事件解除

而解除自定义事件，其实是做了跟事件监听相反的操作。你增我删。

#### 事件触发

最后是事件触发。

事件触发相当于，把存放的回调函数的数组对象按先后顺序执行了一遍。

#### 实现代码

这里给出一个真实实现的代码地址。

强烈推荐看一下seajs中事件机制的实现，非常巧妙而精悍：<https://github.com/seajs/seajs/blob/master/src/util-events.js>

### 总结

自定义事件非常重要，特别是对单页应用来说，能将复杂逻辑抽象出来，让模块解耦。

而其本质上是维护一个事件队列，当事件发生时，检索事件队列，并执行相应的方法。
