---
layout: blog
title: 全新的方法Object.observe
tags: [Object.observe]
categories: [js]
summary: 每一个新方式的出现都是有其固在原因，那我们看看Object.observe吧
---

### 背景

有这么一个场景，就是监听一个对象的变动，然后做对应的改变。目前的方式有两种：

1. 定时器方式，隔一定时间，检测一下这个对象和所有属性是否改变。（例如：angularjs）
2. 封装对应的增删改方法。（例如：Backbone）

在这里不细说上面的一些个明显缺点了，直接切入正题。

### 使用

```js
Object.observe(obj, function(changes) {
    console.log(changes);
});
```
#### 回调函数参数说明

上面那段代码可以看出，回调函数只有一个参数，就是changes。

changes是一个Object。包含4个属性，分别是：

1. `name`属性名。
2. `object`改变后的对象。也就是当前监听的这个对象，最新值。
3. `type`当前改变是什么操作。有：add, update, delete共三种。
4. `oldValue`当前属性未改变时的值。

#### 基本原则

这里面有误区的就属`update`操作。

谨记两点：

1. 非引用类型值的改变都会导致触发回调。
2. 引用类型只要不改变引用就不会触发回调。

给几个例子，说明一下：

```js
var obj = {a:1};
Object.observer(obj, callback);

// 以下都是会触发回调的。
obj.a = 2;
obj.b = {a:1};
obj.c = [1,2,3];

// 承接上文，以下内容都是不会触发回调的
obj.b.c = 1;
obj.c.push(4);
```

### 解除监听

```js
Object.unobserver(obj, callback);
// 注意：
// callback为必填项，不等同于之前我们所接触到的不填callback就是解除当前对象的全部监听

```

### 同族兄弟

同理，还有一个数组的改变监听：`Array.observer`。基本就是一样的，区别就在于，改变的类型`type`有所不同。
