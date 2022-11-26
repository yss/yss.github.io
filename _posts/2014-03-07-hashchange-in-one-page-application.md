---
layout: blog
title: 单页应用之hashchange
tags: [hashchange]
categories: [单页应用, hashchange]
summary: 为什么我们在单页应用中使用hashchange？因为
---
# 前言

hashchange在正常的网页开发中可能应用得很少。但是单页应用下，却显得额外显眼。

在我看到的大部分单页应用，基本上都使用了hashchange，比如：Google Analytics。

# hashchange

什么是hashchange？

hashchange说的其实是一个事件。

这个事件会在页面URL中的片段标识符(第一个#号开始到末尾的所有字符,包括#号)发生改变时触发。

# 好处

那使用hashchange有什么好处呢？

它可以更改浏览器的历史记录。可以认为每次的hashchange都是类似一次页面跳转。

当然，说到了，不得不提的一个是`history.pushState`，这个可以认为是一个真正的一次页面跳转，因为它可以确确实实的改变浏览器的URI，而且比hashchange高级。

那为什么依旧用hashchange？

因为hashchange可以兼容目前所有浏览器，但history.pushState不能。

# 兼容性

这里我们谈谈兼容性。

支持的浏览器|最低版本
:-----------|:--------
Chrome|5.0
Firefox|3.6（Firefox 6 中加入对 oldURL/newURL 属性的支持）
Internet Explorer|8.0
Opera|10.6
Safari|5.0
Android|2.2
Firefox Mobile|1.0
IE Mobile|9.0
Opera Mobile|11.0
Safari Mobile|5.0

从上面的数据看好像也没有兼容所有的浏览器。

但是我们可以用JS模拟！

基本的原理就是：隔一段时间检测一下location.hash是否发生变化。

具体代码实现，请参考MDN：[hashchange事件](https://developer.mozilla.org/zh-CN/docs/Mozilla_event_reference/hashchange)

# 注意的一点

1. 浏览器可以带有hashchange事件，但事件中的event对象不一定带有oldURL/newURL。

这里我贴一下我自己的写的兼容性代码：

{% highlight js %}
/**
 * fix for some some browser has no newURL in hashchange event.
 * @param {Event||Object} e
 * @return {Event||Object}
 */
HashChange.prototype.getEvent = function(e) {
    // for ie
    e = e || window.event;
    if (!e || !e.newURL) {
        var url = location.href;
        e = {
            newURL: url,
            oldURL: this.oldURL || ''
        };
        this.oldURL = url;
    }
    return e;
};
{% endhighlight %}

# 参考

<https://developer.mozilla.org/zh-CN/docs/Mozilla_event_reference/hashchange>

