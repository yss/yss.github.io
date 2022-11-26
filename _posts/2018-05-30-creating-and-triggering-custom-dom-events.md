---
layout: blog
title: 解析DOM自定义事件
tags: [dom]
categorieies: [js]
summary: 有没有想过有一天，我们也可以自己去自定义DOM事情，也可以冒泡，也可以被Cancel

---

说到DOM事件，那真是太多太多，各种监听事件。

下面就说一说，自定义DOM事件。

# 创建自定义DOM事件

浏览器帮我们定义好了一个叫Event的类，它其实是所有我们现在使用的DOM事件的基类。

我们来看看这个Event类：

```js
/**
 * @param {string} typeArg, 不知道为什么叫这个名字，其实就是事件名字
 * @param {Object} [eventInit] 就是一个配置对象，具体看下面
 * @param {Boolean} [bubbles] 就是是否支持冒泡，默认是false，也就是不支持冒泡 
 * @param {Boolean} [cancelable] 是否可以被终止，默认是false
 * @param {Boolean} [composed] 事件是否可以穿过Shadow DOM继续冒泡，默认是false，这里就牵扯到自定DOM了，这里不做细讲
 */
class Event(typeArg, eventInit)
```
那么，我们开始使用创建并分发一个：

```js
const event = new Event('test');

element.addEventListener('test', function () {
	console.log('i am the event');
});
// 触发event
element.dispatchEvent(event);
```

那如果我们希望自定义的事件能带来数据传递呢？

# 增加自定义数据

那这个时候，Event类就不满足我们现在的需求了。

这个时候有一个叫`CustomEvent`的类就出现在了我们的面前。

`CustomEvent`本质上就是继承`Event`，然后在`eventInit`里增加了`detail`属性。

```js
const event = new CustomEvent('test', {
	detail: element.dataset.time // 这里的detail可以是任意的数据
});

element.addEventListener('test', function (e) {
	console.log('data is ' + e.detail);
});
```
# 触发原生事件

我们拿click事件来做例子：

```js
const elem = document.getElementById('tt');

elem.addEventListener('click', console.log);

elem.dispatchEvent(new Event('click'));

```

当然，如果你要跟真实的`click`事件保持一致，那么你就需要用`MouseEvent`。

```js
const nativeClick = new MouseEvent('click', {
	view: window,
	bubbles: true,
	cancelable: true
});
```

# 最后

有了自定义DOM事件后，你就可以做很多以前意想不到的事情。

更直接一点，你还可以让以前不能冒泡的事情变成可以冒泡，比如：input事件。