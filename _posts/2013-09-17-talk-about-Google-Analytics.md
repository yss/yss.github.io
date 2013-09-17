---
layout: blog
title: 谈谈Google Analytics
tags: [Google Analytics]
categories: [GA]
summary: 
---
### 简介
目前Google Analytics有两种类型的统计代码：analytics.js 和 ga.js

在基本功能点上两者都差不多，但analytics.js的配置性更强。

ga.js和analytics.js的很大差别在于ga.js很多东西都是放入到前端页面去做的，但是analytics.js则可以在Google Analytics中的管理去配置。

#### Google给的一个区别：
![analytics.js vs ga.js](/static/img/analytics-vs-ga.png)

### 那些个Cookie
ga.js重度依赖于cookie。这跟两者的实现是分不开的。

#### analytics.js中的cookie

Cookie名|过期时间|描述
:-------|:-------|:-----
_ga|2 years|用于区分用户

#### ga.js中的cookie
__utma|2 years|用于区分用户和会话（对应GA中的唯一身份）
__utmb|30mins|用于检测是否新的会话（对应GA中的访问次数）
__utmc|end of browser session|- Not used in ga.js
__utmz|6 months|存储来源和活动（对应GA中的来源）
__utmv|2 years|存储自定义变量的数据。（对应GA中的自定义变量）

*由于目前的业务统计需要，我们都将使用并可能长期使用ga.js。*

### ga.js配置
{% highlight js %}
var _gaq = _gaq || [];
// 设置账号，其中UA-43949337后的-1需要根据不同项目设置不一样的值
_gaq.push(['_setAccount', 'UA-43949337-1']);
 
// 设置自然搜索源。
// 为什么要设置呢？因为google提供的搜索源，不符合国情。
// 具体可以看：https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTraffic#searchEngine
_gaq.push(['_addOrganic', 'm.baidu', 'word']);
_gaq.push(['_addOrganic', 'wap.baidu', 'word']);
// 这里是设置前一个搜索词
_gaq.push(['_addOrganic', 'Baidu', 'bs']);
_gaq.push(['_addOrganic', 'www.soso', 'w']);
_gaq.push(['_addOrganic', 'wap.soso', 'key']);
_gaq.push(['_addOrganic', 'www.sogou', 'query']);
_gaq.push(['_addOrganic', 'wap.sogou', 'keyword']);
_gaq.push(['_addOrganic', 'so.com', 'q']);
// 这里是设置前一个搜索词
_gaq.push(['_addOrganic', 'so.com', 'pq']);
_gaq.push(['_addOrganic', 'youdao', 'q']);
 
// 如果我们有多个子域的话，建议加上这句。
// 在现在的情况下是必须加这句的
_gaq.push(['_setDomainName', 'meituan.com']);
 
// 发送浏览量，当然还有很多其他的东西。
// 在有些场景下，需要更换现在的URI，那只要这样：_gaq.push(['_trackPageview', '/xxx/xx']);
_gaq.push(['_trackPageview']);
{% endhighlight %}

### 加载位置
以前我们可能对应GA初始化的地方或者说何时去加载，会有很多疑惑。

这里我给出一个说明：

因为blog的需要，当然也为了防止GA数据统计的正确性，我们需要把ga.js放到第一位进行异步加载。
