---
layout: blog
title: 关于前端代码发布对应的依赖关系说明
tags: [依赖关系, 前端发布]
categories: [前端发布]
summary: 前端发布说明
---
### 一些说明
目前项目中static.ftl使用的对应关系是：一个静态文件名对应一个key值，且key值为排除后缀后的文件名。例如：“key”: pathofkey/key.js

这样一来我们在引用的时候就可以直接通过文件名的方式去取。

但随着业务的不断扩展，js也变得越来越多，命名也变得越来越困难了。

这个时候我们就需要新的方案来替代现在的实现。

但是首先我们需要对js进行归类和划分。

### 业务层面的js划分
js文件增加，我们开始通过不同的业务层面去划分js文件。

比如：账号相关的页，创建一个单独的文件夹，并命名为：account。然后把所有跟账号相关处理的js都放入到account文件夹下。

以此类推，其他相关业务归类到一起。

然后把公用的部分js，以及相关组件js单独区分。

这样一来我们的目录结构将会是这样子的：

{% highlight js %}
js
├── account
│   └── a.js
├── common
│   └── a.js
└── widget
    └── a.js
{% endhighlight %}

### 依赖关系的key重命名
通过上面的目录结构，我们就必须重新规划可以值的命名。

而目前我所想到的，也去做的是：使用业务名 + 文件名 来定义key值。

即：

{% highlight js %}
{
    "account-a": "/js/account/a.js",
    "common-a": "/js/common/a.js",
    "widget-a": "/js/widget/a.js"
}
{% endhighlight %}

当然，需要说明的是：加入文件目录是"/js/account/other/a.js" 对应的key值也未："account-a"。
### 最后
最后说明的是，上面的对应实现都通过grunt任务机制实现了。

具体参考：<https://npmjs.org/package/grunt-tree>
