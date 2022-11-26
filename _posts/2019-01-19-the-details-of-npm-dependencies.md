---
layout: blog
title: npm dependencies详解
tags: [npm]
categories: [tool]
summary: npm中dependencies到底有什么特别的内在逻辑

---

npm是前端最常用的一个工具，有了它你就有了整个前端的生态。

今天主要是谈谈其中的dependencies。

# 版本号

node或者说前端这边版本号一般都是基于：[Semantic Versioning Specification](https://semver.org/)

简而言之就是：版本号是由三位数字标识，然后通过英文的点分割。

当然有一些特殊情况，比如：x.y.z-alpha或者x.y.z-beta之类的。但只要记住后面一点，那就是：有-的都小于前面的真实版本。

其中每一位的标识分别是：

1. x也就是第一位：标识的是大版本号，也就是有重大更新，比如：实现上的更新，一般来说这个版本号更新，意味着是和其他版本不兼容。
2. y也就是第二位：标识的是有功能上的更新。可能是加了某个新功能、新特性。
3. z也就是第三位：标识的是有bugfix的。

另外就是规定：1.0.0是初始版本号，每一位的最大值是 9999。

## 单个版本比较：

```js
{
	"dependencies": {
		"foo": "1.0.0", // 单个版本比较同 "=1.0.0" 就是只用这个版本号的库
		"bar": ">=1.1.0", // 大于等于1.1.0
		"baz": ">1.1.0",
		//... 同理 < 及 <=
	}
}
```

需要注意的是，符号后面不能有空格。

## 单个版本的特殊标识

```js
{
	"dependencies": {
		"foo": "^1.0.0", // 这个代表的是 除了第一位不能变，后两位都可以变。
		"bar": "~1.1.0", // 这个代表的是 除了第三位可以变，其他位不可以变。
		"baz": "1.1.x", // 同 ~
		"boo": "1.x", // 同^
	}
}
```

正常情况下，包括官方都是推荐使用 ~

因为按照正常约定的话，最后一位代表的是bugfix，一旦有修复，非常有必要及时更新。

## 多个版本

```js
{
	"dependencies": {
		"foo": "1.0.0 - 2.0.0", // 指的是 >=1.0.0 && <=2.0.0
		"bar": ">=1.0.0 <=2.0.0", // 这么写就跟上一个表达的意思一致
		"baz": "<1.1.0 || >=1.2.0", // 主要是为了跳过某个有问题的版本
	}
}
```

## 非版本号

```js
{
	"dependencies": {
		"foo": "latest", // 直接用最新的
		"bar": "https://a.com/b/c.tar.gz", // 网络文件，但只tarball压缩文件
		// git仓库地址，规则：<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
		"baz": "git+ssh://git@github.com:npm/cli.git#v1.0.27",
		"qux": "git+https://isaacs@github.com/npm/cli.git",
		"boo": "expressjs/express", // github仓库
	}
}
```

## 最特别的本地路径

```js
{
	"dependencies": {
		"foo": "~/foo/bar", // 
		"bar": "../foo/bar", //
		"baz": "/foo/bar", //
	}
}
```

有了它后，如果有bug的话，就可以直接在本地项目里调试了，非常方便本地开发和测试工作。

## vs devDependencies

正常，在我们自己的项目中，通过`npm install`的话，两者都会安装在node_modules下。

但是，如果我们需要把自己的包发布给别人用时就需要特别注意。

特别是node环境，如果放dependencies下的话，使用者使用npm install后会自动下载每个包的dependencies。

如果是纯前端的项目，一般我们会打包到 dist/ 下，那么就更应该都放在devDependencies下了。

## peerDependencies

		In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a require of this host. This is usually referred to as a plugin. Notably, your module may be exposing a specific interface, expected and specified by the host documentation.
		大致意思就是：某些情况下，你想让自己依赖的这个库能和使用者的工具或库保持兼容，你就可以直接在peerDependencies上设置这个依赖。这通常是一个插件的做法。不过值得注意的是，你写的这个模块相当于暴露一个具体的接口，需要使用者去具体设置。

总体来说就是尽可能在插件中使用，并且要明确告知使用者自己主动去安装这个库。
