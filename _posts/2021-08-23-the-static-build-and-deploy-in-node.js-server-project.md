---
layout: blog
title: 细谈 Node.js Server 下的静态资源打包和部署
tags: [node.js]
categories: [node.js]
summary: 大家认知里 Node.js Server 就只有服务层面的事情，确没有考虑使用静态资源的情况

---
### 前言

我们说到 Node.js Server 更多想说的是纯服务层面，但现实情况是我们的 Node.js 项目是一个前后端结合的项目。

需要同时运行纯服务层面的和纯前端层面的逻辑。

这个时候就需要捋顺如何组合。

### 请求处理流程
正常一个 Node.js Server 的请求流程都应该是这样子的：

![请求流程](/static/img/node-request-flow.png)

但涉及到不同的环境下，具体的处理又有很大的不同。

主要分三个环境：

1. 开发环境
2. 测试环境
3. 生成环境

### 开发环境
开发环境下，我们的整个流程其实是多了一步 build 环节：

![请求流程](/static/img/node-request-flow-dev.png)

前面的 Node.js Server 取 index.html 的逻辑没有什么大的变化。

重点是 Node.js Server 和后面的 Static Server 如何交互的问题。



那为什么需要这个 Static Server 呢？

主要还是因为如果没有 Static Server 意味着每次都要实时打包，也就意味着没有缓存，继而大大的打包的速度，继而影响整体的开发体验和效率。



那 Static Server 和 Node.js Server 怎么连接呢？

两种方式：直连 和 代理。

#### 直连
就是 Static Server 单独启动一个端口，index.html 在引入静态资源的时候，使用的完整路径。

比如：http://localhost:4000/s/main/main.js

#### 代理
正常情况下，其实直连其实是满足绝大部分场景的。

但有的时候，你需要做一些测试环境及外部的一些调试，特别是手机真机调试，这个时候因为你直接用的 localhost ，就会导致静态资源访问不了。

整体是推荐中间加一层代理来达到全场景的使用。

### 测试环境
测试环境就是我们把我们的代码部署到了测试。

要上到这一步就涉及到部署。

部署的过程就是把静态资源编译、加版本号、生成 manifest.json 的过程。

![请求流程](/static/img/node-request-flow-deploy.png)

生成的 manifest.json 是为了给 index.html 使用。

manifest.json 就是一个静态资源的路由和 CDN 地址的一个对应关系。


```json
{
  "main/main.js": "https://m.yuanfudao.biz/s/main-xxxx.js"
}
```

#### 说明一点：
这里的 index.html 不是说的纯静态的 html 文件，是代指的 Node.js Server 里的模板渲染。

#### 针对遍历所有需要打包的静态文件这个环节
这个环节其实是有非常大冗余的，因为正常情况下你没法区分谁应该打包，谁不应该打包。

有一种做法就是固定一个后缀名，比如 xxx.main.js，只要是以 .main.js 结尾的就认为要打包。

### 线上环境
线上环境整体和测试环境的整体差异不大。

会涉及到的一些点有：

1. Sourcemap 不能发到线上。
2. 可能需要同步到 Sentry。
3. ...
