---
layout: blog
title: Nodejs中两个非常重要并且实用的功能
tags: [nodejs, 功能]
categories: [nodejs]
summary: Nodejs最重要的一点是什么？异步！说来说去都逃不了这一点。所以
---
### 导言
异步是nodejs中最最重要的一个特点。

那什么是异步呢？

这么说吧，服务器端，一个请求过来，正常情况我们都是一个同步执行的过程就是：处理http请求，等待去数据库查询完，然后输出。
但Nodejs可以不在哪里等待数据库查询完再输出，而且直接又去处理另外一个http请求，知道数据库查询完，在执行输出。

这样一来就可以充分利用服务器端的资源了。

### 事件机制
在说正题之前必须谈到一点就是事件机制（EventEmitter）。

写JS的人都明白，JS的事件是非常有意思的一个事情，同理Node。
但是透过事物看本质，我们会发现，其实所谓的事件机制就是一个任务执行完后进行的一次回调（calback）而已。

#### 使用事件
Nodejs的官方文档里给出了这么一个例子，告诉我们如何使用事件机制，请看：

{% highlight js %}

var events = require("events"),
    util = require('util');
    
// 异步代理
var AsyncProxy = module.exports = function(){
    // 继承event
    events.EventEmitter.call(this);
};
                                        
// 采用nodejs里的官方例子写法
util.inherits(AsyncProxy, events.EventEmitter);
{% endhighlight %}
具体地址：<http://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor>

本质上就是一次prototype继承，然后：

一个是事件的触发：``this.emit(eventName, data)``

一个是事件的监听：``this.on(eventName, function(data) { ... }``

### 正题
今天我们要说的就是这个异步功能的两个非常实用的特性。

#### 并发执行
所谓的并发执行，跟异步是有着千丝万缕的关系。这里面我们给出一个实际案例：

{% highlight js%}
_db.QueryUser(sql, function(err, result) {
    _db.QueryFood(sql, function(err, result) {
        ...
    });
});
{% endhighlight %}
需要说明的是，上面这些数据库查询案例是没有任何的内在关联的。

想这样的操作，如果需要的数据越来多，嵌套的层次就会越深，这肯定不是我们希望看到的。

然后我们可以改进成这样子的：
{% highlight js%}
as.proxy('user', 'food', function(user, food) {
    // 所有的数据都已经拿到了，开始输出了
});

_db.QueryUser(sql, function(err, result) {
    as.emit('user', result);
});
_db.QueryFood(sql, function(err, result) {
    as.emit('food', result);
});
{% endhighlight %}
这样的话就不需要确定上一个数据拿到后再执行下一步操作了。

那这个as.proxy是怎么实现的呢？

本质上就是，计算出总的事件数，每有一次事件完成被触发总的事件数就减一，直到为0为止，之后就触发回调函数。

看代码是最直接的：
{% highlight js %}
/**
 * 异步代理函数，至少需要三个参数，分别是evt1, evt2, callback
 * 调用的之前需要每次new asyncProxy();保证asyncProxy是新的对象。
 * @param {String} evt1
 * @param {String} evt2
 * @param ...
 * @param {String} evtn
 * @param {Function} callback
*/
asyncProxy.prototype.proxy = function() {
    var _this = this,
        args = Array.prototype.slice.call(arguments),
        len = args.length;

    // 三个以上参数才符合我们的预期，也就是异步执行代码前提。
    if (len < 3) {
        console.error('至少需要三个参数，分别是：evt1, evt2, callback');
        return;
    }

    this.callback = args.pop();
    --len;

    this.args = new Array(len);
    this.len = len;

    // max size limit
    if (len > 10) {
        this.setMaxListeners(len);
    }

    args.forEach(function(item, i) {
        _this.on(item, function(data) {
            _this.args[i] = data;
            if (!--_this.len) {
                this.callback.apply(_this, _this.args);
            }
        });
    });
});
{% endhighlight %}

#### 抗压能力
当一个时间点有成百上千的用户访问你的网站，这个时候传统的做法就是缓存以及静态化。

但是Nodejs呢？又有什么神奇的地方呢？

那就又是异步了。就想前面说的那样，Node在处理到从数据库中获取数据的时候，不是继续等待而是接着去处理下一个http请求。这样以来思路就来了。

就是，我们等到数据库获取到数据后，统一触发一个回调，让每个http请求得到当前相同的数据结果。
{% highlight js %}
var ap = new asyncProxy(),
    isReady = true;

function QueryDate(sql, callback) {
    // 添加到等待队列
    ap.wait('complete', callback);
    if (isReady) {
        isReady = false;
        client.query(sql, function() {
            // 数据已获取，执行等待队列
            ap.emit('complete', arguments);
            isReady = true;
        });
    }
}
{% endhighlight %}

看到上面的实例后，我们看一下wait方法的代码：
{% highlight js %}
/**
 * 等待函数执行完后，统一调用只执行一次哦
 * @param {String} evtname 事件名
 * @param {Function} callback 回调函数
 * @return
 */
AsyncProxy.prototype.wait = function(evtname, callback) {
    var _this = this;
    // set waitStack
    if (!this.waitStack) {
        this.waitStack = {};
    }

    if (this.waitStack.hasOwnProperty(evtname)) {
        this.waitStack[evtname].push(callback);
    } else {
        this.waitStack[evtname] = [callback];
        this.once(evtname, function(data) {
            var callback,
                waitStack = _this.waitStack[evtname],
                isArguments = !!data.callee;

            if (isArguments) data = Array.prototype.slice.call(data);

            while(callback = waitStack.shift()) {
                isArguments ? callback.apply(_this, data) : callback(data);
            }
            delete _this.waitStack[evtname];
        });
    }
};
{% endhighlight %}

### 后记
这两个特性都集中在异步上面。

异步有好亦有坏。好处的话，上面已经非常能体现出来了。

上面的代码在使用上其实做得并不好，并没有一套完整的解决方案。

希望这篇文章对你有帮助。

### 参考
1. <http://www.infoq.com/cn/articles/tyq-nodejs-event>
2. <https://github.com/DoubleSpout/node.js---AsyncProxy>
