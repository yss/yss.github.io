---
layout: blog
title: iOS下检测当前浏览器是否是Mobile Safari
tags: [浏览器, User-Agent, 检测, IOS]
categories: [浏览器, IOS]
summary: 本文要阐述的是如何在iPhone下如何检查当前浏览器是否是Mobile Safari。
---
# 前言
本文要阐述的是如何在iPhone下如何检查当前浏览器是否是Mobile Safari。

为什么要这样做能？因为有个meta表情属性只能在Mobile Safari下使用，具体可以看我的这篇文章：[Android和IOS上检测是否安装客户端](http://yansong.me/2013/10/24/detect-whether-install-native-app-of-ios-or-android-in-browser.html)

先看看可能的User-Agent。

# User-Agent列表
先列举一下iPhone(IOS版本v7.0.3)下所有我发现的浏览器的User-Agent:

## Mobile Safari

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B511 Safari/9537.53
{% endhighlight %}

## 跟原生极其相似的
这叫我如何区分你们？

### Home screen app (通过Mobile Safari的添加到主屏幕功能)

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11B511
{% endhighlight %}

当然，全屏模式下，我们可以通过`window.navigator.standalone`这个属性去判断

另外这种情况下，其实也可以认为它是末尾一派，因为后面跟Mobile Safari是不一样的。

### 海豚浏览器

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25
{% endhighlight %}

### 猎豹浏览器

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11B511 Safari/7534.48.3
{% endhighlight %}

## 这是自成一派的
很容易就区别出来。

### UC

{% highlight html %}
UCWEB/2.0 (iOS; U; iPh OS 7_0_3; zh-CN; iPh5,2) U2/1.0.0 UCBrowser/9.0.1.284 U2/1.0.0 Mobile
{% endhighlight %}

### QQBrowser

{% highlight html %}
MQQBrowser/44 Mozilla/5.0 (iPhone 5; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11B511 Safari/7534.48.3
{% endhighlight %}

## 末尾一派
把自己的身份放到最后。

### Chrome

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.16 Mobile/11B511 Safari/8536.25 (FB0F73E1-7600-4729-B2C0-E6579B69B7FA)
{% endhighlight %}

题外话：Chrome的做法其实就是Google Analytics提倡的。Google Analytics会认为这种User-Agent是Safari(in-app)

不过Chrome最好还是要通过CriOS这个标识去判断。

### 浏览器

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 HaoWangZhiDaQuan 3.4
{% endhighlight %}

### 搜狗浏览器

{% highlight html %}
Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11B511 SogouMobileBrowser/2.1.0
{% endhighlight %}

# 归纳
通过上面的User-Agent，我们大概可以总结在浏览器的User-Agent变动情况：

1. 开头变动。
2. 结尾变动。
3. 几乎不变。

当然，根据常识我们可以判断几乎不变的这种浏览器市场的占用率是很低的。

所以这种情况下，我们需要忽略这一种情况，当然Home screen app不能忽略，因为这种模式是可以通过js区分开的。

所以，最后我们只需要做两个区分，开头变动和结尾变动。

这样一来，我们的代码实现就清晰了。

# 代码实现
{% highlight js %}
// 是否是原生Safari
function isMobileSafari() {
    var ua = navigator.userAgent;

    // IOS系统
    if (/ OS \d/.test(ua)) {
        // 不是Chrome
        if (!~ua.indexOf('CriOS')) {
            // 开头必须为Mozilla
            if (!ua.indexOf('Mozilla')) {
                // 结尾需为：Safari/xxx.xx
                if (/Safari\/[\d\.]+$/.test(ua)) {
                    return true;
                }
            }
        }
    }
    return false;
}
{% endhighlight %}

# 其他方式

不管怎么样，我对上面的实现方式依旧不满意。

但是，目前没有找到更好的。

我还想到的是，是不是可以通过Mobile Safari专有属性来判定呢？

但是我没有找到。。。

如果你知道，也请你告诉我。
