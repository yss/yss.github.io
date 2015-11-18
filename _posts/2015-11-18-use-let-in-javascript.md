---
layout: blog
title: 在js中使用let
tags: [let]
categories: [js]
summary: 让我们一起来了解一下js中let的用法吧
---

### 前言

`let`一个新的变量定义，在`ECMAScript 6`中被增加。一个新东西的出现总是在解决某些东西，那我们看看它具体给我们带来了什么样的好处。

### 理解let

`let`跟`var`非常相似，而且正常情况下你可以认为他们是一致的，但是大多数情况下他俩其实是截然不同的两个东西，而且需要慎重使用`let`。

那他俩的根本区别是？

`let`只作用在当前的`{}`包裹的范围内，超出`{}`及内部其他作用域的范围外都是不能获取到的。

我们来看一下下面的例子就清楚了：

{% highlight js %}
function fn() {
    let a = 2;
    console.log(a); // 2
    if (a > 1) {
        let b = 1;
    }
    console.log(b); // Error! 'b' is undefined
}
{% endhighlight %}

从这个例子大家就能很清晰的理解了吧～当然，我觉得这个出处和C语言异常吻合。

那这有什么好处呢？大家看这个例子就知道了：

{% highlight js %}
for (var i = 0; i < 5; i++) {
    let j = i;
    setTimeout(function() {
        console.log(j); // 0,1,2,3,4
        // 之前我们要存储这么一个动态变量，需要额外的一个闭包才可以解决的，现在一个let搞定
    }, 99);
}
console.log(j); // 'j' is undefined
{% endhighlight %}

### 注意

1. `let`定义的变量只能定义一次。比如：

{% highlight js %}
let foo = 1;
let foo = 2; // TypeError thrown;
{% endhighlight %}

2. `let`定义的变量只在执行到它之后才生效。例子：

{% highlight js %}
console.log(foo); // Error 'foo' is undefined
let foo = 1;
{% endhighlight %}

3. `let`如果定义在条件表达式中，外层依旧不能读取。例子：

{% highlight js %}
var i = 0;

for (let a = i; a < 5; a++) {
    // do something
}
console.log(a); // 'a' is not defined
{% endhighlight %}

### 最后

如果不是需要额外存储，还是慎用`let`。

关于`let`支持情况可以看这里：<http://caniuse.com/#search=let>
