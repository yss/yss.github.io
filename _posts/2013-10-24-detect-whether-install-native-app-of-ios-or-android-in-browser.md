---
layout: blog
title: Android和IOS上检测是否安装客户端
tags: [Android, IOS, 客户端, Smart App]
categories: [Android, IOS]
summary: 我们希望更多的用户用我们的产品，更希望能留住更多的用户。这个时候让用户使用客户端的意义就变得格外重要了。
---
### 前言
我们希望更多的用户用我们的产品，更希望能留住更多的用户。这个时候让用户使用客户端的意义就变得格外重要了。

毕竟客户端是实实在在的占据了用户的桌面，每天或多或少都会看到我们的产品。

然后，作为手机端的Web产品，用户通过手机浏览器访问到了我们的页面，我们就希望用户能直接使用或者下载我们的客户端产品了。

最后就有了下载Banner一说。

### 检测是否安装客户端

#### IOS
说到IOS，非常兴奋的是，自IOS6开始，我们只需要在html里加上meta标签就可以了。

具体的meta标签是：`<meta name="apple-itunes-app" content="app-id=504274740" />`

当然，更具体的描述，请参看苹果的开发者平台文档：[Promoting Apps with Smart App Banners](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html)

那IOS6以下呢？
我的回答是：直接展示一个下载banner吧。

#### Android

针对Android，如果我们细心的话就会发现，很多应用都会一直在后台跑着。关都关不掉。

这么一来就，我们就可以通过给这个后台进程发一个请求，然后通过判断这个请求是否正确响应，来判断是否安装了我们的App。

如果没有正确响应，我们就认为应该是没有安装我们的客户端应用。

基本思路就是这样，我们看代码实现：

{% highlight js %}
(function() {
    var isInstalled,
        url = '_url_', // 找android工程师要吧
        script = document.createElement('script');

    script.src = url;
    script.onload = function() {
        // alert('Is installed.');
        isInstalled = true;
    };
    script.onerror = function() {
        // alert('May be not installed.');
        isInstalled = false;
    }

    document.body.appendChild(script);
})();
{% endhighlight %}
