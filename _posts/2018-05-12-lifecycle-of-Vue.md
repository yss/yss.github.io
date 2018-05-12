---
layout: blog
title: 简析Vue的生命周期
tags: ['vue']
categories: ['js']
summary: 更详细的阐述vue的生命周期
---

## 前言

Vue的生命周期，官网有这么一张图示：

![vue生命周期图](https://cn.vuejs.org/images/lifecycle.png)

这张图非常清晰的阐述了一个Vue组件从创建到销毁的过程。

但是，如果有子组件呢？如果有多个子组件呢？

## 子组件

这里不贴测试代码，直接把结论说一下：

1. 首先，都是先初始化好父组件，直接父组件触发`beforeMount`时，才开始子组件的创建。
2. 直到子组件触发`mounted`事件后，父组件才触发`mounted`。
3. 有多个子组件时，根据位置，谁靠前谁先创建知道触发`beforeMount`为止。最后，等所有的子组件都触发`beforeMount`后，然后依顺序，依次触发`mounted`，最最后，父组件才触发`mounted`。

通过上面步骤，我们知道：

1. 子组件是优先父组件触发的。
2. 子组件是依顺序依次先触发`beforeMount`，之后再依次触发`mounted`。

### 说说Destroy

destory不太同于mount步骤，它是

1. 父组件触发 `beforeDestroy`
2. 子组件依顺序依次触发 `beforeDestroy` 和 `destroyed`。
3. 最后父组件触发 `destroyed`。

从上面可以看出，挂载是要大家一起好了，再顺序触发挂载，销毁是直接一次性销毁。

### 说说Update

update和mount的表现是一致。

其实核心点就是在beforeUpdate和updated之前有一层虚拟DOM操作，需要等待DOM操作完后才触发。

## nextTick

说到生命周期其实之前有个困惑就是`nextTick`和`mounted`到底是谁优先触发？

经过验证后，你会发现`nextTick`是在`mounted`之后触发。

这里也好理解，vue官方的文档给出的解释是：在下次 DOM 更新循环结束之后执行延迟回调。

也就是说，调用`nextTick`时，DOM必须是更新好，并且可用的。那么`mounted`必然是需要在`nextTick`之前触发的。