---
layout: blog
title: iframe攻防
tags: []
categories: [http]
summary: 既要防止被别人通过iframe引入，也要能绕过iframe的进行通信

---

一个东西有利也有弊，iframe就是这样，通过iframe可以快速让别人引入我们的页面，但同时iframe又存在的极大的风险。

最简单就是，在iframe上盖一层透明的蒙层，这样用户本想点击的iframe里的内容，却点击到了外层的网站，再之后...

这就是最明显的点击劫持。

### 防止被iframe内嵌

我们先说一下如何防止别人使用iframe内嵌。

#### js篇

说到js，那必须说到window上的两个个属性：self, top

这里直接贴代码会比较好理解：

```js
// 这个时候肯定是被内嵌了
if (window !== window.top) {
	// 一般的做法就是直接替换
	window.top.location = location.href;
}
```

#### HTTP篇

随着互联网的发展，安全问题得到了越来越多的重视。

单纯通过js的方式太过于局限。

然后大家的目光就朝向了HTTP，这个更底层更彻底的解决方式。

那，HTTP都有哪些解决方式呢？

那就是：`X-Frame-Options`响应头

X-Frame-Options 响应头是用来给浏览器指示允许一个页面可否在 <frame>, <iframe> 或者 <object> 中展现的标记。网站可以使用此功能，来确保自己网站的内容没有被嵌到别人的网站中去，也从而避免了点击劫持 (clickjacking) 的攻击。

```plain
X-Frame-Options: SAMEORIGIN # 只能在同样的origin下使用，origin的意思就是，协议、域名和端口三者必须一致。
X-Frame-Options: DENY # 禁止被内嵌
```

这个响应头在现存的绝大部分浏览器里都支持。

### 主动被内嵌

但有的时候，你又希望被别人引入，特别是跨团队，跨部分，乃至跨公司的沟通合作。

#### js篇

同样是上面的方式：

```js
// 这个时候肯定是被内嵌了
if (window !== window.top) {
	// 如果来源不是白名单里的，才跳转
	if (!REG_WHITE_LIST.test(document.referrer)) {
		window.top.location = location.href;
	}
}
```

但是这个有个很大的问题就是可以被绕过去。

1. 一种是对方引入的是你合作方的网站，但是你合作方的网站没有做过相关的处理。
2. 另外一种就是，它先生成一个空白的iframe，然后通过在里面执行js代码，可以让document.referrer为空。不过这种方式，对上面的机制无效。

#### HTTP篇

通用，制定HTTP协议的人肯定也考虑到这个问题，所以有：

```plain
X-Frame-Options: ALLOW-FROM URI # 可以指定你需要设置的白名单链接、域名和origin
```

但是，这个模式，在Chrome下是没有实现的。

但Chrome可以使用另外一个响应头：

```plain
Content-Security-Policy: frame-ancestors https://example.com # 允许某个域名可以内嵌
```

### 最后

查过资料才能清楚的知道HTTP内容好多好强大。

1. <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors>
2. <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options>
