---
layout: blog
title: 谈谈jQuery.data
tags: [jQuery]
categories: [js]
summary: 当然，不仅仅是jQuery，其他类库也是一样的，比如Zepto
---

### 写在前面

依稀记得最开始使用jquery.data的时候，那时`$.data('key') === $.attr('data-key')`。但是突然某个版本开始，===变成了不一定。

因为，jQuery还做了一层额外的数据解析操作。当然，它希望它能把我们传入的值解析成对应js类型。

但是由于工作中不是经常跟jQuery打交到，可以说用得不是太多，也就没有针对性的对jQuery.data做深入了解。

但是最近在弄后台的时候，时不时又碰到了jQuery.data的问题，到底我给的一个值它是怎么做解析的呢？

现在我们就开说吧。

### 正题

依旧是我的风格，直接粘出那部分核心的代码：

{% highlight js %}
data = data === "true" ? true :
        data === "false" ? false :
        data === "null" ? null :
        // Only convert to a number if it doesn't change the string
        +data + "" === data ? +data :
        rbrace.test( data ) ? jQuery.parseJSON( data ) :
        data;
{% endhighlight %}

代码我就不一一讲解了，这里面我们重点看一下这个语句：`+data + "" === data ? +data:`。

这行代码的作用就是判断当前给定的值能否被解析成数字。主要哦，它没有直接用parseFloat，而是用'+'这个符号。

这个写法非常巧妙的避免的了js浮点数精度问题（比如大数，浮点数）。

比如在解析："20151010221055343"，这个时候就会出行精度问题，它返回的是一个字符串。但如果解析的是："20151010221055344"，那么它返回的结果就是一个它对应的数字。

所以，

### 写在最后

我们在使用jQuery.data的时候，一定要注意，当我们操作的值是浮点数或大数时，请务必注意它的返回值有可能是数字，也可能是字符串。
