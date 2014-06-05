---
layout: blog
title: 兼容node,amd,cmd的写法
tags: [node, amd, cmd]
categories: [javascript]
summary: 总结一下一套程序同时兼容node, amd, cmd规范
---

我们在写程序的时候，特别是给别人用的时候，需要额外考虑一下别人是怎么用的。

而现在比较流行的规范也就是三种：node，amd，cmd。

具体上面三种的区别和好处，这里不做讨论。兼容起来的写法如下：

{% highlight js %}
(function(global) {

    function XX() {
    }

    // for node environment
    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        module.exports = XX;
    } else if ( typeof define === "function" && (define.amd || define.cmd) ) {
        // for cmd, amd, commonjs
        define("xx", [], function() { return XX; } );
    } else {
        // for global environment. like window
        global.XX = XX;
    }

})(this);
{% endhighlight %}

这样一来就一目了然了。
