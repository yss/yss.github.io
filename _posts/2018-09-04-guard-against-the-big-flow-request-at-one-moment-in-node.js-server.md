---
layout: blog
title: 防范node.js瞬间大流量
tags: []
categories: [node]
summary: 本身阐述的是如何尽可能的避免自己的服务被瞬间的大流量搞垮

---

### 起因

事情的源头从一次抢购活动开始，

某次，在开发不知情的情况下，运营对外推广，使用了抢购模式。

然后，当天晚上的运维群里报出了大量5xx的情况。而且都是我们的node.js服务。

### 排查

接着，就开始排查。

1. 首先，看日志，发现并没有大面积的5xx报错。
2. 接着，排查的是不是有出现服务重启的情况。

#### 说明

之所以排查重启，是因为很早之前也发生过大面积502的情况。

最后排查出结果是因为程序中有一个未捕获或者说未处理的错误，导致触发了node.js的uncaughtException事件。致使服务重启。一段时间内，整个服务不可用。

为此还专门做了服务重启优化策略。这里就不细讲。

#### 异常

但是，在排查过程中，发现今天的访问日志量，明显比其他时间都多。

之后，让运维值班再帮忙看一下具体的Nginx日志，发现是stream连接超时了。。。

再查了一下流量情况，发现那个时间点，流量瞬间高涨，达到了惊人的数值。

#### 结论

最后，和运维值班确定，初步确定是因为流量暴涨，导致请求阻塞，无法被正常处理。

### 解决

像这种情况，最简单的方式就是加机器。

或者，当有瓶颈限制时，也会直接使用限流的方式。

但是，加机器和限流，其实都不是一个很好的做法。

### 加机器

加机器的话，固然可以解决，这个应该加多少，上限在哪里。

这个时候就需要你评估最大峰值会是多少，然后需要打压现有环境下服务能承受的最大请求量，最后确定加多少。

大部分时候是很难预测峰值会是多少。然后，可能很多时候，机器基本处于空闲状态。

### 限流

然后是限流，这个其实更不好，比较我们是有能力承受更大的请求的，但是我们却没有去做。

那么，我们有没有其他方式可以解决呢？

### 另一种方式

主要是我自己有一个想法，就是动态扩容。

动态扩容这个概念虽然经常被提起，但是目前看依旧不是很成熟。

刚好想通过这次问题来验证。

*为什么会有这个想法呢？*

首先，我们知道node.js是单进程，单线程的服务。

然后，本身提供了一个叫cluster的东西，也就是集群的概念。

最后，我们也一直在使用。

### 现状

先来分析一下我们现在的情况。

1. 我们现在线上是有两台服务，每台服务内存是3G+2G(Docker预留)。
1. 每台服务是1 Master + 2 worker（默认情况下1worker最大占用1.5G）
1. Node本身是最善于处理高并发的请求。基于现在的情况，我认为远没有达到node的瓶颈。
1. 通过falcon，查看内存的使用情况，发现大部分时候内存使用率非常低，5G的服务内存，只用不到2G，这就意味着有大概3G是处于长期空闲状态。
1. 我们现在的服务，大部分情况只是做中转和路由之用。现有的Docker模式，默认是不限定使用CPU的个数（当然，实际情况是最多能用8个）。

那么，我们能不能做到，当遇到突发的瞬间大流量迅速进行扩容，也就是增加Worker呢？

答案是肯定的。

但是，怎么去做呢？

#### 第一种方案

通过 Master去做，就是在 Master上检测是否有请求堆积。

但是，发现整个文档<https://nodejs.org/dist/latest-v8.x/docs/api/cluster.html>都没有相关的描述。

然后去看源码，有处理，但是没有

#### 第二种方案

通过 Worker去做，在 Worker里检测到请求堆积，然后通知Master去派生新的 Worker。

目前从文档看，这个是可以做到的。

大致的过程就应该是：

1. Worker本身去记录当前有多少个请求堆积。
2. 当Worker发现请求堆积超过设定的最大阈值时，触发Master的扩容事件。

### 具体实现

方案确定了，那么就差实现。

真正落实到实践就发现了很多问题：

1. 首先有扩容操作，就应该有缩容的操作。
1. 如何保证扩容操作稳定？
1. 扩容的阈值在哪里？

在解决这些问题之前，我们先要搞清楚，Cluster是如何运行的。

#### 运行模式

Cluster的运行模式，跟nginx是类似的。

Master负责对外，通过监听端口，一旦有请求过来会自动分发给底下的 Worker，最后 Worker处理完后直接响应（Response）。

内部调用机制，默认是用的RR（round-robin）模式，即轮询。

#### 第一个问题

首先有扩容操作，就应该有缩容的操作。

这个问题的解决就是，没触发一次扩容操作，就触发一个延迟的缩容操作。

具体一点就是，使用 debounce 的概念，每当一个扩容操作过来，然后就取消上一次的延迟缩容操作，开启新的延迟缩容操作。

我把这个时间定为1分钟。具体代码如下：

```js
// 缩容，避免资源浪费
const runShrink = function () {
    if (runShrink.timer) {
        clearTimeout(runShrink.timer);
    }

    // 如果一分钟之后，没有再发生扩容，就开始删除多余的节点
    runShrink.timer = setTimeout(function () {
        const workerIds = Object.keys(Cluster.workers);
        Cluster.workers[workerIds[0]].kill('SIGINT');
        Logger.error('[WWW] run shrink. Current workers count is ' + (workerIds.length - 1));
        // 小于4个不考虑，最低保证有2个
        if (workerIds.length < 4) {
            return;
        }
        runShrink();
    }, 60000);
};
```

#### 第二个问题

如何保证扩容操作稳定？

前面说了，node.js是单进程单线程的。

如果同一时处理很多扩容操作极易影响正常的请求转发和调用。

然后，就设定，某一段时间内只能调用一次，也就是throttle的概念。

并且限定最多能启用7个。

```js
// 扩容，预防突发的大量请求
const runScale = function () {
    if (runScale.isRunning) {
        return;
    }
    // 最多7个
    if (Object.keys(Cluster.workers).length > 6) {
        Logger.fatal('[Master] too many workers...');
        return;
    }
    runScale.isRunning = true;

    Cluster.fork().on('message', handleMessage);
    setTimeout(function () {
        runScale.isRunning = false;
    }, 64).unref();

    Logger.error('[WWW] run scale. Current workers count is ' + Object.keys(Cluster.workers).length);

    runShrink();
};
``` 

#### 第三个问题

扩容的阈值在哪里？

这是一个很棘手的问题。打压一般很难做到一个很精确的值。因为我们有很多页面，很多请求，不是单纯的一个或几个接口。

现实情况是很难知道当前状态下大概会有哪些个请求。

那么，我们是怎么去做的呢？

这是一个建立在用户无法访问的情况下一个个试出来的。

直接告诉大家，是76。

这个值跟我最初想象的差异实在是太大了，以至于在试验期间，悲惨的看着群里5XX的错误铺面而来。

具体代码，分享出来：

```js
/**
 * created by yss on 2018/07/09
 */
const Cluster = require('cluster');

const EVENT_FINISH = 'finish';
const EVENT_CLOSE = 'close';
const MAX_REQUEST = 72;
let requestCount = 0; // 积压的请求数

module.exports = async function scaleOut(ctx, next) {
    if (++requestCount > MAX_REQUEST && Cluster.isWorker) {
        Cluster.worker.send({
            act: 'scale'
        });
    }
    const res = ctx.res;

    const done = function () {
        --requestCount;
        res.removeListener(EVENT_FINISH, done);
        res.removeListener(EVENT_CLOSE, done);
    };

    res.once(EVENT_FINISH, done);
    res.once(EVENT_CLOSE, done);

    await next();
};
```
如果大家也想尝试的话，告诉大家一个应急方法就是，提供一个http入口，可以去动态改变这个阈值。

### 最后

一切脱离业务场景去谈应用都是耍流氓。

我这个方法只适用于当前我这边所使用的这种类型项目。

不代表其他项目一定可以用，主要还是提供一下思考和借鉴，希望对大家有用。