---
layout: blog
title: 关于nodejs开发的一个目录结构
tags: [nodejs, 目录结构]
categories: [nodejs]
summary: 寻思了很久未果，最后根据多方查阅，得出了这么一个结构
---

题目都如此，那么直接抛出这么一个目录结构吧：

{% highlight bash %}
app.js
config.js
package.json
--lib
----controllers
----db
----express
----utils
--static
--views
{% endhighlight %}

# app.js

这是入口，用于启动nodejs。

# config.js

虽然很多人不赞同使用全局变量，但是用过之后就感觉很爽。

这里我还是建议使用一个全局的变量，比如：$。

然后`$.config = config`;

最后记得使用`Object.seal(config)`哦~

**为什么呢？**

防止被修改。

# package.json

这个说白了就是依赖包，类似java的pom.xml

# static

毋庸置疑，这个就是存放静态资源文件的地方。

# views

同样，这个就是存放所有前端模板的地方。

# lib

最后要说说lib。

lib说白了，就是真正执行层。或者说就是MVC中得MC层。

## controllers

说是controller，更多指的是router机制。

所有的路由都需要放入到这个文件下面。

## db

数据库相关的操作代码都放到这个目录底下。

## express

所有的express中间件。调用在app.js中被调用。

## utils

一些必要的组件都放到这里。

# 最后

最后就没有最后了。

希望你能给我留言，提一提你的意见。
