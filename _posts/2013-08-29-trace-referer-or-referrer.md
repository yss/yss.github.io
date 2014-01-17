---
layout: blog
title: 追踪Referer
tags: [http, referer, 追踪, referrer, js]
categories: [http, js]
summary: 在跳转的情况下或者说中转页面的情况下，在跳到下个目标页面时不丢失referer，就是本文要探讨的。。。
---
### 背景
有这么个场景，你需要创建一个中转地址，让外来的链接通过这个这个中转地址跳转到你需要它到达的真正地方。

那么就会有好多种做法，比如：http 302，http 301，html javascript，html meta

#### HTTP 302跳转
这种跳转在http的协议里定义是请求的资源限制临时从不同的URI响应请求。

说白了就是，暂时跳转到另外一个链接。这也是大部分程序重定向的做法。

#### HTTP 301跳转
这种跳转在http的协议里定义的是请求的资源永久的移动到了新的位置。

说白了就是，这个链接其实是没有用的。

*题外话，浏览器处理的区分是不关心它是302还是301。301和302跳转主要是为搜索引擎做了。*

*对浏览器来说，301和302的区别就在于302可以使用`history.back()`但301不行。*

*搜索引擎如果发现是302还是会收录，但是如果是301的话就不会对它进行收录。*

#### HTML Javascript
简单的一句话就完成了：
{% highlight js %}
<script>
    window.location.href = 'http://xxxx';
    // 或者
    // window.location.replace('http://xxxx');
    // 两者的区别在于是否可回退
</script>
{% endhighlight %}
#### HTML meta
直接看代码：
`<meta http-equiv="refresh" content="5; url=http://xxxx">`

### 实验

#### 假设

* S：开始页面
* D：结束页面
* Tn：不同跳转类型的中转页面
* 测试浏览器：Chrome 29

#### 测试代码
{% highlight js %}
// app.js
// run: node app.js
var express = require('express'),
    app = express();

app.use(express.logger());
app.use(function(req, res, next) {
    var path = req.path;
    if (path === '/test') {
        res.sendfile('test.html');
        return;
    }
    else if (/^\/test(\d)$/.test(path)) {
        switch(parseInt(RegExp.$1)) {
            case 1:
                res.redirect(302, '/dest');
                break;
            case 2:
                res.redirect(301, '/dest');
                break;
            case 3:
                res.send('<!DOCTYPE html><html><head><title>test</title><meta charset="utf8"></head><body><p>sdfsdfds</p>' +
                '<script>document.querySelector("p").onclick = function(){window.location.href="/dest";}</script>' +
                '</body></html>');
                res.end();
                break;
            case 4:
                res.send('<!DOCTYPE html><html><head><title>test</title><meta charset="utf8"></head><body><p>sdfsdfds</p>' +
                '<script>window.location.replace("/dest");</script>' +
                '</body></html>');
                res.end();
                break;
            case 5:
                res.send('<!DOCTYPE html><html><head><title>test</title><meta charset="utf8">' +
                '<meta http-equiv="refresh" content="0; url=/dest">' +
                '</head><body></body></html>');
                res.end();
        }
    }
    else if (path === '/dest') {
        res.send('<h3>' + req.get('Referer')+ '</h3>');
        res.end();
        return;
    }
});
app.listen(3000);
{% endhighlight %}
*test.html里的内容就是5个链接：/testN*

#### 结果

中转类型|Referer|回退的地址是S
----|----|----
http 302|S|是
http 301|S|是
js href|T3|是
js replace|T4|是
html meta|T5|是

### 结论
从上面结果可以得到两个结果：

一是，要保持refer就需要在服务器上进行302或301跳转。而非其他方式。

二是，如果页面初始化直接就：location.href的话，回退的话也是回到它的上一个页面。
