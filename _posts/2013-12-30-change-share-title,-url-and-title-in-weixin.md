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
    appid: 'APP_ID', // 分享给朋友时可以用到
    img_url: 'http://IMG_URL',
    img_width: 'IMG_WIDTH',
    img_height: 'IMG_HEIGHT',
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

### 参考
<http://mp.weixin.qq.com/qa/index.php?qa=3163&qa_1=%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB%E7%BD%91%E9%A1%B5%E7%9A%84%E7%BC%A9%E7%95%A5%E5%9B%BE-%E9%93%BE%E6%8E%A5-%E6%A0%87%E9%A2%98%E5%92%8C%E6%91%98%E8%A6%81>
