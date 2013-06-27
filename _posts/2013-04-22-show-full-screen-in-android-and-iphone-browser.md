---
layout: blog
title: android和iphone下的全屏实现
tags: [全屏, fullscreen, android, iphone]
categories: [javascript]
summary: 总所周知，手机浏览器屏幕很小，如果能争取全屏显示那无疑是最好的
---
正常情况下，当你用手机浏览器打开网页时，导航就停留在上面，这样实际展示的屏幕就变小了。

那能不能加载后，屏幕就自动全屏呢？这就是本文要讨论的。

### Add to Home Screen
说到全屏不得不谈iPhone下的safari有一个特别且重要的功能就是“Add to Home Screen”。（就在Safari浏览器最下方，最中间的那个位置，点击选择即可）

这个功能类似于把网页地址作为一个超链接的方式放到手机桌面，并且可以直接访问。不过要注意的是每个链接都需要js进行一次特殊处理，那就是监听页面点击事件，如果是链接，则使用`window.location = this.href;`，这样页面就不会从当前的本地窗口跳到浏览器了。

那我们看看具体代码是怎么处理的。

其实只需要在HEAD代码里增加一些必要数据：
{% highlight html %}
<meta name="apple-mobile-web-app-capable" content="yes" /><!-- home screen app 全屏 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" /><!-- 状态栏 -->
<!-- 还需要额外设置不同尺寸的启动图，默认不设置的话会自动去寻找根目录下的apple-touch-icon-precomposed.png -->
<!-- home screen app iPhone icon -->
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="startup/apple-touch-icon-57x57-precomposed.png" />
<!-- home screen app iPad icon -->
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="startup/apple-touch-icon-72x72-precomposed.png" />
<!-- home screen app iPhone Retinas icon -->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="startup/apple-touch-icon-114x114-precomposed.png" />
<!-- home screen app iPad Retinas icon -->
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="startup/apple-touch-icon-144x144-precomposed.png" />
<!-- iPhone5启动图 -->
<link rel="apple-touch-startup-image" href="startup/startup5.png" media="(device-height:568px)">
<!-- iPhone4启动图 -->
<link rel="apple-touch-startup-image" size="640x920" href="startup/startup.png" media="(device-height:480px)">
{% endhighlight %}
还想了解具体的设置可以参考苹果的官网说明：[Configuring Web Applications](https://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

当然，对启动图，我推荐的做法是只使用一张114*114的图片即可。即：
{% highlight html %}
<link rel="apple-touch-icon-precomposed" href="startup/apple-touch-icon-114x114-precomposed.png" />
{% endhighlight %}

### 全屏
{% highlight js %}
window.addEventListener('DOMContentLoaded', function() {
    var page = document.getElementById('page'),
        nav = window.navigator,
        ua = nav.userAgent,
        isFullScreen = nav.standalone;

    if (ua.indexOf('Android') !== -1) {
        // 56对应的是Android Browser导航栏的高度
        page.style.height = window.innerHeight + 56 + 'px';
    } else if (/iPhone|iPod|iPad/.test(ua)) {
        // 60对应的是Safari导航栏的高度
        page.style.height = window.innerHeight + (isFullScreen ? 0 : 60) + 'px'
    }
    setTimeout(scrollTo, 0, 0, 1);
}, false);
{% endhighlight %}
这段代码本质上就是当前窗口的高度 + 导航栏的高度 获取到真实的屏幕高度。最后再调用scrollTo方法。

### 参考
1. [Configuring Web Applications](https://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
2. [Hide the address bar in a fullscreen iPhone or Android web app](https://gist.github.com/1172490)
