---
layout: blog
title: 理解history.pushState&history.replaceState
tags: [history, 分享, 理解]
categories: [javascript]
summary: history.pushState和history.replaceState的存在解决了什么问题呢
---
### 一、说明
history.pushState和history.replaceState的存在都是为了改变浏览器的会话历史。

* history.pushState是增加浏览器的会话历史。
* history.replaceState是替换浏览器的当前会话历史。

直接对应的影响是：
{% highlight js %}
// 回退
window.history.back();
window.history.go(-1);
// 向前
window.history.forward();
window.history.go(1);
{% endhighlight %}
#### 参数说明
history.pushState和history.replaceState使用的是相同的参数。

history.pushState(data, title[, url]);

* data {Any} 任何一种可系列化的数据，也可以理解为javascript数据。像DOM对象就不能
* title {String} 
* url {String} 

### 二、目的
简单概括history.pushState的目的有：

* SEO优化
* 更少的数据请求
* 更好的用户体验

history.pushState更有点是为了单页面浏览网页而孕育而生的。

### 三、响应事件
每次改变会话历史都会触发一次onpopstate事件。上面的data参数就会作为event对象的一个参数信息。
{% highlight js %}
window.addEventListener('popstate', function(e) {
    if (e.state) {
        // do something
    }
    // 当然也可以直接使用history.state来获取当前对应的state数据。
});
{% endhighlight %}

### 四、应用场景
非常适合应用在完全是数据请求和解析的页面。另外配合localStorage可以有更好的效果。如：

* 页面分页数据展示
* 简单的条件结果筛选
* ...

像Github这样的网站的目录和内容展示就应用了这个技术。

### 五、不适合场景
当应用场景需要额外的js处理情况，还有其他很多。

### 六、浏览器兼容情况
Chrome | FireFox | Internet Explorer | Opera | Safari
----|-----|----|------|-----
5 | 4.0 | 10 | 11.5 | 5.0
### 七、参考
[http://www.welefen.com/use-ajax-and-pushstate.html](使用ajax和history.pushState无刷新改变页面URL)

[https://developer.mozilla.org/en-US/docs/DOM/window.history](window.history)
