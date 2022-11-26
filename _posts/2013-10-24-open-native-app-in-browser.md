---
layout: blog
title: 在浏览器中打开客户端
tags: [客户端, 浏览器]
categories: [浏览器]
summary: 这个时候我们就需要尝试性的去打开客户端，如果打不开，我们就去下载或者去到下载页。
---
# 前言
之前我写过一篇文章关于如何在浏览器中检测是否安装了客户端，今天要说的是在浏览器中打开客户端。

这是为什么呢？

因为检测是否安装了客户端是不准的。比如：IOS6以下的系统，Android下猫眼后台进程被关闭了等。

这个时候我们就需要尝试性的去打开客户端，如果打不开，我们就去下载或者掉到对应下载页。

这也就是本文的核心。

# 实现
如果我们通过Google搜索相关的东西。

我们都不难找到这么一个事实就是尝试性的去打开，打开不了就去下载。

{% highlight js %}
(function() {
    var appUrl = 'app_url_scheme://app_index_url',
        downloadUrl = 'http://_go_to_download_',
        startTime = Date.now(),
        iframe = document.getElementById('someIframe');

    iframe.src = appUrl;

    setTimeout(function() {
        if (Date.now() - startTime < 500) {
            window.location.href = downloadUrl;
        }
    }, 400);
})();
{% endhighlight %}

这其中有一个非常巧妙的地方就是，通过判断触发的时间与执行settimeout的时间差值是否小于设置的定时时间加上一个浮动值（一般设为100）。

所以，就有了上面的例子。`Date.now() - startTime < 500`

# 其他说明
除了上面例子，我还做了其他两个方案。

1. 一个是创建一个script标签，src为appUrl。然后判断监听onload和onerror属性。     
 但发现不管客户端有没有安装都是error。即调用onerror方法。
2. 另一个是创建iframe标签，基本思路和上面一致。      
 但发现不管安没安装客户端，都不会触发onload和onerror事件。

# 给出一个实现

{% highlight js %}
var Banner = {
    link: 'meituanmovie://www.meituan.com/filmlist',
    COOKIE_NAME: 'cld',
    COOKIE_EXPIRED: 24 * 60 * 60 * 1000,
    NOT_INSTALLED: 1,
    INSTALLED: 2,
    UNUSED: 3,
    show: function() {
        if (!Banner.status) {
            setTimeout(Banner.show, 500);
        } else {
            Banner._show();
        }
    },
    isSafari: function() {
        var ua = navigator.userAgent;
        // IOS系统
        if (~ua.indexOf('OS ')) {
            // 不是Chrome
            if (!~ua.indexOf('CriOS')) {
                // 开头必须为Mozilla
                if (!ua.indexOf('Mozilla')) {
                    if (/Safari\/[\d\.]+$/.test(ua)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    _show: function() {
        var status = this.status,
            $bd = $('#bd'),
            link = $bd.data('link'),
            src,
            html;
        if (status === this.UNUSED) {
            return this.show = function(){};
        } else if (status === this.INSTALLED) {
            src = $bd.data('opensrc');
            html = '<a href="' + this.link + '" target="BannerFrame">';
        } else {
            src = $bd.data('dlsrc');
            html = '<a href="' + this.link + '" data-link="' + link + '" target="BannerFrame">';
        }                                                                                                           
        if (!this.$banner) {
            if (!src || !link) {
                return;
            }
            this.$banner = $('<div id="client-banner"/>');
            html += '<span class="close"></span>';
            html += '<img src="' + src + '" width="320" height="65" />';
            html += '</a>';
            html += '<iframe name="BannerFrame" style="display:none;"></iframe>';
            this.$banner.html(html)
                .insertBefore('#hd').find('.close').click(function() {
                    Banner.$banner.remove();
                    Banner.$banner = null;
                    $.Cookie.set(Banner.COOKIE_NAME, Banner.COOKIE_EXPIRED);
                    return false;
                });
            this.$banner.find('a').click(function() {
                    var link = this.getAttribute('data-link'),
                        startTime = Date.now();
                    if (!link) {
                        return;
                    }
                    setTimeout(function() {
                        if (Date.now() - startTime < 500) {
                            location.href = link;
                        }
                    }, 400);
                });
        }
        this.show = function(){
            this.$banner.show();
        };
    },
    // 隐藏banner
    hide: function() {
        if (this.$banner) {
            this.$banner.hide();
        }
    },
    // 检测是否安装客户端
    _detect: function() {
        var script = document.createElement('script');

        script.src = 'http://127.0.0.1:9517/sendintent?packagename=com.sankuai.movie&query=true';
        // 基本思路就是状态是否是200
        script.onload = function() {
            Banner.status = Banner.INSTALLED;
        };
        script.onerror = function() {
            Banner.status = Banner.NOT_INSTALLED;
        };
        document.body.appendChild(script);
    },
    init: function() {
        if ($.Cookie.get(this.COOKIE_NAME)) {
            this.status = this.UNUSED;
            return;
        }
        var os = $.os;

        if (os.ios) {
            if (os.version >= '6' && this.isSafari()) {
                this.status = this.UNUSED;
            } else {
                this.status = this.NOT_INSTALLED;
            }
        } else {
            if (os.android) {
                this._detect();
            } else {
                this.status = this.NOT_INSTALLED;
            }
        }
    }
};
Banner.init();
{% endhighlight %}
