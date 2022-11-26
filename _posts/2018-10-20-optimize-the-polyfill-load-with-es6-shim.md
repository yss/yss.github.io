---
layout: blog
title: 使用es6-shim优化polyfill加载
tags: []
categories: [js]
summary: 项目文件越来越大，有没有办法进一步优化呢

---

# 现状

我们知道babel-polyfill非常的大，在项目中如果直接引入的话，打包出来的文件大小瞬间增大，对于小项目来说，很有可能文件大小直接翻倍或者更大。

所以我们目前的做法就是没有引入babel-polyfill，或者说部分引入了ES6的一些新特性，主要就是这三个：

```js
require('core-js/es6/array');
require('core-js/es6/string');
require('core-js/es6/object');
```

然后，其他的新出现的一些新特性比如：Promise，Set之类的，全部靠babel去打包编译引入。

可以理解为按需引入。

看着感觉一切静好。

# 为什么要做这个事情？

那为什么要做这个事情呢？

因为我们分析发现我们现在支持的绝大部分系统都是支持ES6的。

然后，ES2016和ES2017增加的内容不多，主要是增加了async和await两个语法糖的支持。这个可以直接在Babel中编译编译。

这么看来，编译代码在大部分情况下其实是没有用的。

# 方案

我们可以按照以前在PC端的做法。

增加一个shim文件，就是如果它不支持ES6的新特性，就完整加载这个shim文件。

我们找到了es6-shim（https://github.com/paulmillr/es6-shim）

检测逻辑定为需要支持Promise和fetch

加载的话，通过分析发现，我们目前支持的手机浏览器对async这个属性都是支持的。

那么，最终实现代码如下：

```js
if (!window.Promise && !window.fetch) {
    (function (src) {
        var elem = doc.createElement('script');
        elem.src = 'PATH_TO_es6-shim';
        elem.async = false;
        document.getElementsByTagName('head')[0].appendChild(elem);
    })();
}

```

对应的babel配置为：

```json
{
	"babel": {
    "presets": [
      "env",
      "stage-0"
    ],
    "plugins": [
      [
        "transform-runtime",
        {
          "helpers": true,
          "polyfill": false,
          "regenerator": true,
          "moduleName": "babel-runtime"
        }
      ]
    ]
  }
}
```

# 实际

实践中发现：

1. async的支持是有问题的。即使你设置为false，也依旧是异步加载。
2. 部分浏览器是支持Promise，但是其他特性是不支持的。

最后，变成：

```js
// load es6 shim if not support
if (!win.Promise || !win.Set || !Array.from) {
    document.write('<script src="PATH_TO_es6-shim"><\/script>');
}
```
简单而且粗暴！

# 最后

看到Babel升级到7版本后，形势一片大好。找个机会再看看Babel@7下是不是有更好的解决方式。
