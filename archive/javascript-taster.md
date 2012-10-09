---
layout: list
title: Javascript小知识积累
tags: [js, 知识]
summary: 这是一块存储Javascript的田园
---
* 在现代浏览器下直接写的正则表达式的执行速度比使用编译后的正则表达式块。具体可以使用如下代码测试：
{% highlight javascript %}
        var reg = new RegExp(), reg2 = /aa/g, len = 10000;
        reg.compile(/aa/g);
        var str = 'padding-left:4x; padding-gooo:tt; paddding-rrr;dfsfsfadfsdsfasdf';
        console.time('aa'); 
        while(len--)reg.test(str);
        console.timeEnd('aa');
        len = 10000;
        console.time('bb');
        while(len--)reg2.test(str);
        console.timeEnd('bb');
* 一个很巧妙的变化量函数
        function getRandom(min, max) {
            return Math.round((max - min) * Math.random()) + min; // 即变化量 + 最小值
        }
{% endhighlight %}
* 关于-1的处理：~str.indexOf('a') ? true : false; // ~-1 === 0
* 最短小的代码判断是否是IE：var isIE = !-[1,]; && var isIE = !+"\v1";
* 在调用第三方库的时候，很可能做了这么一个操作：JSON.parse(JSON.parse(str))，然后可能报这么个错：SyntaxError: Unexpected token o
