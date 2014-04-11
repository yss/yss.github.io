---
layout: blog
title: 谈谈express router
tags: [express, router]
categories: [nodejs]
summary: 一个好的路由机制能极大的减少开发和维护成本
---

最近express又有了一次大的升级，从3.x到4.x。

其中最突出的一点是路由的改进，增加了一个Router对象。

在3.x中只有最基础的app[VERB](path, [callback...], callback);

仅仅只是提供一个接口供调用。

而4.x的Router改动，更为灵活，可以将路由地址拆分为多段处理。比如，你可以把router相关的文件放入到一个文件夹下。然后直接引用：

{% highlight js %}
var router = express.Router();

// 这个就是把/user开始的路径统一转发给./routes/user.js处理
router.use('/user', require('./routes/user'));
{% endhighlight %}

### 言归正传

说了这些，我想引入一个我写的express router插件：[express-route-tree](https://github.com/yss/express-route-tree)

这个我是2013年完成的，最后一次提交记录是六个月之前的事了，但是发现如果不去做些推广的都没人看...

如果你很恶心推广的话，请止步。

### 核心思想

以文件目录的形式去看待url的路径。

将路径按'/'划分，划分后相当于一个目录结构。

比如：/user/detail 对应的是： ./routes/user.js中的exports.detail方法。

当然，也可以是：./routes/user/detail.js中的exports.index方法。

更可以是：./routes/user/detail/index.js中的exports.index方法。

再之后你可以是无限的index，`./routes/user/detail/index/../index/../index.js`。

说到这里就需要谈及到一个路径查询的机制。

### 路径查询机制

express-route-tree是这么做的：

1. 先完整的遍历给定的文件目录。
2. 生成一个树状结构，如果遇到是js文件则把这个js文件require进来，require后的值本质也是一个对象。
3. 但这个对象跟其他元素的区别在于，它的value是一个函数对象。
4. 而express-route-tree判断的原则就是查询到的路径是否是一个函数对象，不是且在没有查到的情况下则自动补上`index`。
5. 直到找到函数对象为止，没有找到则终止，然后执行回调函数。
6. 找到了的话，就这一层目录之后的路径就作为参数形式传递给执行函数。

我们来看看这个例子：

{% highlight js %}
// File: app.js

var express = require('express'),
    app = express(),
    route = require('express-route-tree');

app.use(express.logger());
app.use(route(__dirname + '/controller'));
/*
var fileRouter = ['robots.txt'],
    shortAddress = ['mon', 'tus'],
    regionRoute = { china: { id: '1', name: '中国' } };
app.use(route(__dirname + '/controller', function(req, res, next, controller) {
    var pathname = req.path.substring(1);
    if (~fileRouter.indexOf(pathname)) {
        return res.sendFile(pathname, { maxAge: 3600 * 24 * 1000 });
    } else if (~shortAddress.indexOf(pathname))) {
        // some short address
        return controller.index.season(req, res, next, shortAddress[pathname] + 1);
    } else if (regionRoute[pathname]) {
        return controller.index.region(req, res, next, regionRoute[pathname].id, regionRoute[pathname].name);
    } else {
        return next('No such route.');
    }
});
*/

// try it:
// console.log(route.controller);

{% endhighlight %}
{% highlight js %}
// File: controller/app/list.js

/**
 * Normal Get Request, Support urls:
 * 1. /app/list => page: undefined | second: undefind
 * 2. /app/list/0 => page: 0 | second: undefined
 * 3. /app/list/1.html => page: 1 | second: undefined
 * 4. /app/list/1/a => page: 1 | second: a
 */
exports.index = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
};

/**
 * @Caution:
 *  if you want to use index with other(not get) request method.
 *  you must use full path: /app/list/index/1/a
 *  otherwise, request will be transfered to index function.
 *  Also, if there is not matched function, such as '/app/test'(no `exports.test = function(){}` in app.js),
 *  Then, router will send this request to `app.index` function,
 *  And put the `test` as the four argument, like `function(req, res, next, test)`
 */

/**
 * For POST Request. Support urls:
 * 1. /app/list/set => page: undefined | second: undefind
 * 2. /app/list/set/0 => page: 0 | second: undefined
 * 3. /app/list/set/1 => page: 1 | second: undefined
 * 4. /app/list/set/1/a => page: 1 | second: a
 */
exports.postSet = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
}

/**
 * For PUT Request. Support urls:
 * 1. /app/list/setapp => page: undefined | second: undefind
 * 2. /app/list/setapp/0 => page: 0 | second: undefined
 * 3. /app/list/setapp/1 => page: 1 | second: undefined
 * 4. /app/list/setapp/1/a => page: 1 | second: a
 */
exports.putSetapp = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
}

// And also support any method from request header.
// like: exports.deleteApp = function(req, res, next, ...) { ... }

{% endhighlight %}

看到上面你会发现，其实还有一个[VERB]的处理。

### VERB处理

这里要区分get方式，非get方式。

get方式不做任何处理。

非get方式会将路径的第一个字母变大写，然后加上这个非get方式去查找。

比如：POST /user/detail => postDetail

### 最后

设计这个路由的初衷：

1. express路由直接用起来代码一大坨，不好维护。
2. js的灵活性给了我极大的思考空间。

我要说的就是这么多了。
