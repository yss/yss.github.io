---
layout: blog
title: 理解macrotask和microtask
tags: []
categories: [js]
summary: 通过这篇文章你可以清晰的理解macrotask和microtask的区别

---

最初看到macrotask和microtask是在某一篇讲Vue.$nextTick背后的机制时注意到的。

随着疑问的加深，就很有必要探究一下这两个是什么，有什么区别。

# 规范文档

我们先看定义：https://html.spec.whatwg.org/multipage/webappapis.html#event-loops

这里说明一下macrotask其实就是里面说的task。

macrotask和microtask是在event loops下定义的。从上面定义可以得知：

1. 每个浏览器环境，至多有一个event loop。
2. 每一个event loop有一个或多个task queue。一个task queue是一个有序的task列表。
3. 每个event loop都有一个microtask queue。一个microtask是直接放到microtask queue里的，而不是放到task queue里。

也就是说一个event loop = task queues + microtask queue。

然后一个event loop执行任务的流程是：

1. 把最早的任务（task A）放入任务队列。
2. 如果 task A 为空，则直接跳转到第6步。
3. 将 currently running task 设置为 task A。
4. 执行 task A
5. 将 currently running task 设置为 null，并移除 task A。
6. 执行 microtask queue：
	- a. 在 micro queue 中选出最早的任务 task X。
	- b. 如果 task X 为空，直接跳转到 g
	- c. 将 currently running task 设置为 task X。
	- d. 执行 task X。
	- e. 将 currently running task 设置为 null，并移除 task X。
	- f. 跳转到 a。
	- g. 结束 microtask queue。
7. 跳转到第 1 步。

然后，从上面，我们可以得到这一点：

1. 每个 macrotask 执行完后都会执行一下 microtask queue。

# 两者的具体实现：

1. macrotask: setTimeout, setInterval, setImmediate, I/O, UI渲染，Event，Ajax。
2. microtask：Promise, process.nextTick, Object.observe, MutationObserver。

PS：记住 microtask 有哪些就好 ;)

# 一道题目

我们再来看一道题目：

```js
console.log(1);

setTimeout(function() {
  console.log(2);
}, 0);

new Promise(function (resolve) {
  console.log(3);
  var i = 0;
  while (i < 9999999) {
    i++;
  }
  resolve();
  console.log(4);
}).then(function() {
  console.log(5);
});

console.log(6);
```

结果是怎么样呢？

```plain
1
3
4
6
5
2
```

注意3，4这两个，这个是直接执行的。