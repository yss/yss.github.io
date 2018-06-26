---
layout: blog
title: 逐步使用webpack替代传统项目的打包方式
tags: [webpack]
categories: [js]
summary: 改造传统项目都是一个很繁琐的任务，并且问题很多

---

我们知道传统项目因为历史原因，很多时候想做大的变动或改造是非常困难的。原因无外乎就是东西太多，改造成本太大，你不知道你做的这些改动是不是会影响其他功能。出了问题谁负责？谁负责得起？

当然，这个时候我们要真正去做改进，那么最好的方式就是拆，一个一个，逐步去把各个功能拆解出来。

这也是目前最常见并且可靠的做法。

那么，今天我们讲讲如何在项目中逐步使用webpack改造我们的项目打包。

### 传统项目打包流程

1. 计算资源版本号。
2. 编译压缩js和css。
3. 生成版本号资源文件。
4. 同步到静态服务器。


### webpack改造

随着webpack不断的更新迭代，功能变得越发强大，配置也变得越发简单。

其中最重要的一点就是webpack支持多入口打包方式。

然后，由于传统项目入口很多，每个入口都有自己独立的js。

那么，我们做一个约定：

1. 所有使用webpack打包的资源文件都放到 `/assets/` 文件夹下。
2. 所有需要打包的js文本都必须是这种路径格式：`/assets/xx/xxx.js`。

这么一来，我们就可以针对入口，写一个函数去遍历，然后生成对应的入口配置。生成后从形式应该是这样子的：

```json
{
	"a": "/assets/x/a.js",
	"b": "/assets/x/b.js",
	"c": "/assets/xx/c.js"
}
```

然而，大家有没有发现，这里就有一个问题，如果文件名相同了，那岂不是会被覆盖。那么我们怎么解决呢？

文件夹名~文件名。即：

```json
{
	"x~a": "/assets/x/a.js",
	"x~b": "/assets/x/b.js",
	"xx~c": "/assets/xx/c.js"
}
```

当然，要真追究下去，这个肯定不能100%解决名称重复问题。

所以，我们约定文件命名不能有~。这样就100%解决了。

解决这个问题后，其他的地方，需要保证的几点：

1. 生成manifest.json到指定目录，所有使用新的打包方式都统一引入这个文件加载对应的js文件。
2. 所有的css，image都必须在js中使用。

### 总结

约定是贯穿全文最重要的一点。逐步拆分是通用的做法。