---
layout: blog
title: 修复一个在JSON数据中特殊字符问题
tags: []
categories: [js]
summary: 莫名其妙的报错

---

### 背景

有一天接到一个报障，说有个网页无法截图。然后截图服务的报错是`undefined is not a function`。

然后，看了一下那块报错的代码，发现那个数据是从页面传递过来的（window.xxx={JSON}）。

但是，问题是同类型的其他页面是没有问题的，唯独这一个页面会报错。

还有一个更奇怪的是，在Chrome是可以正常显示的。

然后，因为截图服务是用photomjs实现的，这个问题一时还不好排查。

直到...

### 初步定位

又一个同学，说它做的页面在手机上无法访问。

然后，一排查，发现和上面碰到的是一个问题。赶紧用手机访问发生上面问题的链接，真真是也不能访问。

再用Chrome手机调试，打开控制台，发现在报`undefined is not a function`之前，还有一个报错`invalid or unexpected token`。

初步怀疑是出现ASCII码中前面的小于32（空格）的字符。

但是执行了`document.body.innerHTML.split('').filter(a => a.charCodeAt(0) < 32)`发现是个空数组。

也就是，不是这个问题。

那会是什么问题呢？

### 最终定位

那么就开始用排除法，一点一点的删除代码。

终于，皇天不负苦心人啊，发现了报错的那段代码。

然后，复制这段代码到 Visual Code 里，逐字逐字看，终于发现那个打着问号的菱形字符（就是无法识别的字符）。

复制到控制台，执行`' '.charCodeAt(0)` 的结果是 8232。

这是什么鬼？👻

然后，网上一搜索，这个是行分割符（line separator）。

### 解决

直接过滤这个特殊的字符。

```js
const REG_LINE_SEPARATOR = new RegExp(String.fromCharCode(8232), 'g');

html = html.replace(REG_LINE_SEPARATOR, '');
```

但是，真的不知道还会不会有其他字符会有这个问题。

另外，就是依旧困惑这个字符是怎么产生的，因为做这个页面的实习生离职了。


