---
layout: blog
title: 禁止eslint的各种写法
tags: []
categories: [tool]
summary: 需要时去查，当频率高了，你就需要记下来

---

# 前言

经常会有很多情况需要去使用eslint的disable功能。

绝大部分时候只是为了disable某个小规则，但发现每次总是需要去查，效率太低了。

那这个时候，很有必要总结一下。

# 各种写法

## 禁止一段代码

```js
/* eslint-disable */
// ... your code
/* eslint-enable */
```

上面就是完全禁止一段代码的写法，

但是这种做法很可能误杀了其他的规则，最佳的做法是只禁止一项或几项规则。

```js
/* eslint-disable no-alert, no-console */
alert(1);
console.log(2);
/* eslint-enable */
```

当然如果不写最后的`eslint-enable`相当于禁止从`eslint-disable`开始到文件接收。

## 禁止一行代码

有四种模式是完全禁止，如下：

```js
alert(1); // eslint-disable-line
alert(2); /* eslint-disable-line */
// eslint-disable-next-line
alert(3);
/* eslint-disable-next-line */
alert(4);
```

当然，最佳的做法是只禁止你不需要的那一项或多项规则

```js
alert(1); // eslint-disable-line no-alert
alert(2); /* eslint-disable-line no-alert */
// eslint-disable-next-line no-alert, no-console
alert(3); console.log(3);
/* eslint-disable-next-line no-alert */
alert(4);
```

# 最后

总结写完了，感觉就这么一点东西。那为什么每次都要去查呢？

后续细细想想，主要还是后面的那个规则写法导致的。

比如说，alert，总是潜意识的写成：`alert(1); // eslint-disable-line alert: 0`

那后续需要做得就是好好读一读这个规则了。