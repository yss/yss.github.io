---
layout: blog
title: 在微信客户端中更改分享标题，链接和图片
tags: [微信]
categories: [微信]
summary: 从客户端分享到微信后，进入到页面再次分享时，图片就没了。
---

### 背景

正确情况下，分享一个链接到微信后，进入到页面后再次分享时，微信的抓取策略一般是这样子的：

我们拿分享到朋友圈为例：

标题取的是`document.title`，图片取的是页面的第一种图片，但是图片大小好像是至少需要400x400。

但是微信抓取策略是不透明的，意味着如果我们要自定义固定的分享的话，就做不到了。

### 内部方法

网上找了很久，终于在微信的论坛上找到了答案。

相当于是这样子的，在微信的webview会增加一个全局变量WeixinJSBridge，通过它可以进行改变又上角的分享链接。

也就相当于跟使用客户端调用的API一致。;)

具体，请看：

{% highlight js %}
var config = {
    // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
    appid: 'APP_ID', // 公共账号ID？
    img_url: 'http://IMG_URL',
    img_width: 'IMG_WIDTH', // 可不设
    img_height: 'IMG_HEIGHT', // 可不设
    link: location.href,
    desc: 'DESCRIPTION',
    title: 'TITLE'
};

// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function() {
    var WJ = WeixinJSBridge;
    // 发送给好友
    WJ.on('menu:share:appmessage', function() {
        WJ.invoke('sendAppMessage', config, function(res) {
            // _report('sendAppMessage', res.err_msg);
        });
    });
    // 发送到朋友圈
    WJ.on('menu:share:timeline', function() {
        WJ.invoke('shareTimeline', config, function(res) {
            // _report('shareTimeline', res.err_msg);
        });
    });

    // 发送到微博
    WJ.on('menu:share:weibo', function() {
        WJ.invoke('shareWeibo', config, function(res) {
            // _report('shareWeibo', res.err_msg);
        });
    });
});
{% endhighlight %}

这样一来就达到了自定义分享了。

### 其他接口

#### 隐藏微信中网页右上角按钮

某些时候，在有需要时（如不需要用户分享某个页面），可在网页中通过JavaScript代码隐藏网页右上角按钮。

{% highlight js %}
document.addEventListener('WeixinJSBridgeReady', function() {
    // 隐藏按钮，对应的展示参数是：showOptionMenu
    WeixinJSBridge.call('hideOptionMenu');
});
{% endhighlight %}

#### 隐藏微信中网页底部导航栏

某些时候，在有需要时（如认为用户在该页面不会用到浏览器前进后退功能），可在网页中通过JavaScript代码隐藏网页底部导航栏。

{% highlight js %}
document.addEventListener('WeixinJSBridgeReady', function() {
    // 隐藏导航栏，对应的展示参数是：showToolbar
    WeixinJSBridge.call('hideToolbar');
});
{% endhighlight %}

#### 网页获取用户网络状态

这个接口可以让我们在网页中使用JavaScript代码调用来获取网络状态，可以方便我们根据用户的网络状态来提供不同质量的服务。

{% highlight js %}
document.addEventListener('WeixinJSBridgeReady', function() {
    var connection = WeixinJSBridge.invoke('getNetworkType',{}, function(e){
        WeixinJSBridge.log(e.err_msg);
    });
});
// connection.network_type:wifi wifi网络
// connection.network_type:edge 非wifi,包含3G/2G
// connection.network_type:fail 网络断开连接
// connection.network_type:wwan（2g或者3g）

{% endhighlight %}

### 参考

1. <http://mp.weixin.qq.com/qa/index.php?qa=3163&qa_1=%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB%E7%BD%91%E9%A1%B5%E7%9A%84%E7%BC%A9%E7%95%A5%E5%9B%BE-%E9%93%BE%E6%8E%A5-%E6%A0%87%E9%A2%98%E5%92%8C%E6%91%98%E8%A6%81>
2. <http://mp.weixin.qq.com/wiki/index.php>
