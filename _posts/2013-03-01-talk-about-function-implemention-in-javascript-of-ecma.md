---
layout: blog
title: ECMA中Javascript的函数执行
tags: [javascript, ecma]
categories: [javascript]
summary: 很有必要理解ECMA中的函数执行过程，这样你才能做得更好。当然你才会更懂Javascript。
---
在进行这个话题前，先给出这么一个例子：
{% highlight js %}
s = 0;                                                                                                                   
function t() {
    alert(s);

    var s = 3;
    alert(s);
}
t();
{% endhighlight %}
感觉很简单？肯定不会，不然就不会写这篇文章了。

想想，然后在控制台上运行一下，看看结果怎么样。或许你会惊讶，但为什么会是这样子的呢？

好了，我们就开始讲讲在Javascript中，函数执行前到底做了写什么。

### 作用域链(scope chain)
每个函数在创建之初都构造一个自己的作用域链。
{% highlight js %}
SC = {
    __self: {
        ...
    },
    __parent: {
        ...
    }
}
{% endhighlight %}

### 预解析
也有人叫预编译。
就是在函数执行前写解析前按顺序存储三种类型的变量。

* 一是，arguments里的变量。
* 二是，function变量。
* 三是，var定义的变量。

如果三者有重复的话，下面的覆盖前面的。

这样以来，上面的答案就出来了。

我讲的可能不够好。强烈推荐去阅读下面的一个参考文章。

### 参考
<http://dmitrysoshnikov.com/ecmascript/chapter-5-functions/>
