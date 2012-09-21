---
layout: blog
title: 离线检测之navigator.onLine
categories: [js]
tags: [离线检测, navigator.online]
summary: 支持离线Web应用开发是HTML5的另一个重点。所谓离线Web应用，就是在设备不能上网的情况下仍然可以运行的运用
---
### 关于离线检测

支持离线Web应用开发是HTML5的另一个重点。所谓离线Web应用，就是在设备不能上网的情况下仍然可以运行的运用。

### 关于navigator.onLine及不同浏览器表现

navigator.onLine是HTML5定义用来检测设备是在线还是离线。对应的值为false或true。

但是不同浏览器表现并不一致。

* IE 6+和Safari 5+能够正确的检测到网络已断开，并将navigator.onLine设为flase。
* Firefox 3+和Opera 10.6+也支持navigator.onLine。但需要手动讲浏览器设置为脱机模式才能让浏览器正常工作。
* Chrome 11及以上版本始终将navigator.onLine设为true。(不过作者的Chrome 21已经能正常使用了)

但是截止到今天写这篇文章，最新的浏览器都能正确使用这个属性。

### online&offLine事件
HTML5定义了online&offline事件用于监听网络状态变化。
{% highlight javascript %}
window.addEventListener('online', callback); // 离线到上线
window.addEventListener('offline', callback); // 上线到离线
{% endhighlight %}

目前除了IE（IE只支持navigator.onLine属性）外，其他最新浏览器都支持这个事件。

### 后记

虽然Web app的发展功能越来越好，但是Native app依旧很强大，加之最近的fackbook指明他们犯了一个严重的错误在把大部分精力放在web app上，让Web app之路，越来越迷茫。总之任重道远！

