---
layout: blog
title: 剖析在HTTPS网页加载HTTP内容（也叫混合内容）
tags: []
categories: []
summary: 是否可以在https网页里加载http内容

---

常识里，我们知道HTTP网页肯定是可以加载HTTPS内容的，但是在HTTPS网页能否加载HTTP内容呢？

好像能又好像不能。这是我在写这篇文章之前的感受。为什么呢？

因为某些HTTP资源确实是可以在HTTPS内加载的，但有些又不可以。

那实际情况又是怎么样的呢？

# 定义

HTTPS网页加载HTTP内容，官方定义的名称叫混合内容（mixed content）。

混合内容分两种类型：混合被动内容（mixed passive content）和混合主动内容（mixed display content）

区别在于威胁程度的高低。

第一种混合被动内容可以认为威胁很低，最坏的情况也就是网页可能出现损坏或误导性的内容。

而在混合主动内容的情况下，威胁会导致网络钓鱼、敏感数据披露、重定向到恶意网站等等。

## 混合被动内容（mixed passive content）

主要是下面四个：

1. img （src属性）
2. audio （src属性）
3. video （src属性）
4. object 子资源

## 混合主动内容（mixed display content）

说的是可以访问全部或部分HTTPS页面文档对象模型的内容。

这种类型的混合内容可以改变HTTPS页面的行为并可能向用户窃取敏感数据。因此,除了上述混合显示内容所描述的风险,混合活动内容还很容易受到其他一些攻击向量的攻击。

主要有：

1. script （src属性）
2. link href属性
3. XMLHttpRequest object请求
4. iframe （src属性）
5. 所有在CSS使用url的值，比如@font-face, cursor, background-image等
6. object （data属性）

# 现实情况

有些低版本手机加载https内容，比如音频，会出现无法加载的情况。

建议在处理某些低版本手机，可以考虑加上`onerror="this.src='http://example.com/xxx'"`;
