---
layout: blog
title: 微前端在 Video 后台项目中的应用
tags: [project]
categories: [project]
summary: 

---

# 背景
Shopee Video 是一个新成立不久的部门，也是一个快速增长的部门。最初我们前端只有一个组，十来号人，但随着公司对 Shopee Video 的定位调整和业务扩张，Shopee Video 迎来了一个极快速的增长，团队的整体规模翻了不知道多少倍。

然后，在业务上划分成各个子业务线，每个子业务线都有自己独立的前端团队。

而我们的 B 端系统最初都在一块，不同团队共同开发和维护一份代码，无法避免的就会出现各种各样的团队协作问题。

![micro-fe-1](/static/img/micro-fe/1.png)

上面这类的问题，随着团队逐步变大，问题越来越严重。

为了要解决这些问题，我们已经有意识的在拆分我们的项目。

初期一个团队，一个新域名，一个新工程。

但这种完全隔离式的拆分，对于用户来说是非常不友好的。

基于用户的使用场景以及业界现有的一些优秀方案，我们对现有工程进行了微前端的实践与落地。

# 微前端的定义
微前端并不是一项新的技术，而是一种浏览器端的架构理念。

它是一种多个团队通过独立发布功能的方式来共同构建现代化 Web 应用的技术手段及方法策略。

这是网上的定义。

![micro-fe-2](/static/img/micro-fe/2.png)

通俗来讲，就是微前端提供了一种技术实现，可以将多个独立的 Web 应用聚合到一起，提供统一的访问入口。

在用户视角上看一个微前端应用就是一个完整的应用，但是在技术视角上看微前端应用就是由一个个独立的前端应用组合而成的。

# 微前端的技术实现
技术实现上，分主应用和子应用。

![micro-fe-3](/static/img/micro-fe/3.png)

主应用我们一般叫它基座应用，基座应用主要是负责调度各个子应用。

对应的，子应用是一个个负责具体的业务逻辑的应用。

正常情况下，为了保证整个框架的可用性，基座应用不应该包含任何的业务逻辑。

# 微前端实施的五种方式
## 路由分发微前端
路由分发式微前端，即通过路由将不同的业务分发到不同的、独立前端应用上。

其通常可以通过 HTTP 服务器的反向代理来实现，又或者是应用框架自带的路由来解决。

如图：

![micro-fe-4](/static/img/micro-fe/4.png)

这个一般是前期团队拆分最常见的一个种方式，简单明了。

我们之前的拆分做法跟这个方式有点类似，不过是彻底的拆分。

### 优点
快速实施和部署，没有历史包袱。
### 缺点
对于使用者来说，需要在各个系统跳来跳去，体验不是很好。
后期多套系统各自分散，不好协调。
### 适合的场景
团队的初期拆分。
系统需要做大的迁移，特别是需要在技术栈上做大的切换。
不想花费大量的时间在这个系统的改造上。
## iframe 式微前端
iframe 作为一个非常古老的，人人都觉得普通的技术，却一直很管用。

iframe 可以创建一个全新的、独立的宿主环境，这意味着我们的前端应用之间可以相互独立运行。

采用 iframe 有几个重要的前提：

网站不需要 SEO 支持
拥有相应的应用管理和通信机制。
如果我们做的是一个应用平台，会在我们的系统中集成第三方系统，显然这是一个不错的方案。

### 优点
提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。
### 缺点
应用间上下文无法被共享，随之带来各种开发体验、产品体验一系列问题。
### 适合场景
集成第三方系统。
在新系统中快速集成部分老旧系统功能。
## 微应用化
微应用化是指在开发时应用都是以单一、微小应用的形式存在的，而在运行时，则是通过构建系统合并这些应用，并组合成一个新的应用。

微应用化早期大都是以软件工程的方式来完成前端应用的聚合，而现在可以使用 Webpack 5 提供了 Module Federation 的方式来解决这类聚合的问题。

微应用化只能使用唯一的一种前端框架。

如图：

![micro-fe-5](/static/img/micro-fe/5.png)

### 优点
适合大一统的团队，可以保持整个团队的技术栈和开发风格的统一，各个成员可以无缝切换到任意的系统。
技术层面可以得到持续的积累，持续的改进。
### 缺点
依赖升级比较麻烦，需要统一升级。
内部协调较为频繁而复杂。特别是一些不兼容的升级。
### 适合场景
要求快速及统一的大团队。
## 前端微服务化
前端微服务化，是微服务架构在前端的实施，每个前端应用都是完全独立（技术栈、开发、部署、构建独立）、自主运行的，最后通过模块化的方式组合出完整的应用。采用这种方式意味着，一个页面上可以同时存在两个以上的前端应用在运行。

如图：

![micro-fe-6](/static/img/micro-fe/6.png)

目前主流的框架有 qiankun，qiankun 是基于 single-spa 的封装。

### 优点
技术栈无关，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架
样式隔离，确保微应用之间样式互相不干扰
JS 沙箱，确保微应用之间 全局变量/事件 不冲突
### 缺点
主要是功能上还有一些欠缺，不能完美达到 iframe 基本的隔离，然后在 Angular 上的问题会比较多些。
### 适合场景
多个团队共同构建一个大型项目。
## Web Components
Web Components 是一套不同的技术，允许开发者创建可重用的定制元素（它们的功能封装在代码之外）并且在 Web 应用中使用它们。

在真正的项目上使用 Web Components技术，离现在还有一些距离，结合 Web Components 来构建前端应用，是一种面向未来演进的架构。

![micro-fe-7](/static/img/micro-fe/7.png)

### 优点
通过 web component 形式可以做到比较完美的隔离。
### 缺点
需要重写现有的前端应用。
上下游生态系统不完善。
系统架构复杂。当应用被拆分为一个又一个的组件时，组件间的通讯就成了一个特别大的麻烦。

# 微前端方案的对比

 |开发成本|维护成本|可行性|同一框架要求|实现难度|潜在风险及存在的问题
:----|:-----|:-----|:-----|:-----|:-----|:-----
路由式分发微前端	|低	|低	|高	|否	|★	|跟我们需要达成的目标不符合
iframe |式微前端	|低	|中	|中	|否	|★★★	|需要搭建统一的应用管理和通信机制
微应用化	|低	|高	|中	|是	|★★★★	|不同团队协作成本高
前端微服务化	|中	|中	|高	|否	|★★	|统一不同应用的构建规范
Web Components	|高	|低	|低	|否	|★★★★★	|现有项目下不太可行

基于我们现在的组织架构和分工协作方式。采用前端微服务化，会是一个更好的选择。

而前端微服务化，**首推 qiankun 的解决方案。**

# Single-SPA 简介
Single-SPA 是一个用于前端微服务化的 JavaScript 前端解决方案。

它本身就相当于大号的路由分发和调度程序。

而每个应用本身相当于一个大模块。对 Single-SPA 暴露三个方法：bootstrap, mount, unmount。

比如：Single-SPA 收到一个路由切换从 /app1  => /app2，那么它就会调用 App 1 的 unmount，然后再调用 App 2 的 bootstrap，等到执行完后，再调用 App 2 的 mount。

![micro-fe-8](/static/img/micro-fe/8.png)

但是，本身 Single-SPA 不提供 js 隔离和 css 隔离，需要引入其他包来做到。

做不到那种开箱即用。

# qiankun 简介
## 特性

1. 基于 single-spa 封装，提供了更加开箱即用的 API。
2. 技术栈无关，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
3. HTML Entry 接入方式，让你接入微应用像使用 iframe 一样简单。
1. 样式隔离，确保微应用之间样式互相不干扰。
1. JS 沙箱，确保微应用之间 全局变量/事件 不冲突。
1. 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
1. umi 插件，提供了 @umijs/plugin-qiankun 供 umi 应用一键切换成微前端架构系统。

## 样式隔离
### strictStyleIsolation: Shadow DOM
严格样式隔离，核心是 Shadow DOM。

实现形式为将整个子应用放到 Shadow DOM 内进行嵌入，完全隔离了主子应用。

目前从社区的反馈看，使用这种方式会存在一些问题，比如：子应用的 Dialog 之类的因找不到主应用的 body 会丢失，或跑到整个屏幕外。

### experimentalStyleIsolation：CSS Scope
qiankun 会自动为子应用所有的样式增加后缀标签，如：div[data-qiankun-microName]。

这样改后就会存在一些挂载在 body 的弹窗样式失效。



所以，最终我们在实践过程中并没有使用样式隔离。

而是通过 qiankun 本身的 css 解析做到的隔离。也就是 qiankun 解析 css link，然后通过 style 的方式插入到子应用挂载的节点下。

跟子应用一起创建，一起销毁。

![micro-fe-9](/static/img/micro-fe/9.png)

## JS 沙箱实现
qiankun 中沙箱的实现有三种：SnapshotSandbox、LegacySandbox、ProxySandbox。

对于我们来说，需要简单理解 ProxySandbox。

### SnapshotSandbox
在页面初始化后，通过变量 window 对象，备份了一份当前的 window 对象快照。等子应用每次切换的时候再把 window 对象恢复到备份时的状态。

这个主要是在不支持 Proxy 的浏览器上使用。

### LegacySanbox
它的主要原理就是使用了 ES6 中的 Proxy，把原来的 window 代理到 fakeWindow 上，这样就不用遍历整个 window 去应用和恢复环境了。

然后，在沙箱内部设置了三个变量池：

1. addedPropsMapinSandbox 用于存放子应用运行期间新增的全局变量，用于在卸载子应用的时候删除；
2. modifiedPropsOriginalMapInSandbox 用于存放子应用运行期间修改的全局变量，用于卸载时进行恢复；
3. currentUpdatedPropsValueMap 用于存放子应用运行期间所有变化的变量，这样可以在加载子应用时恢复其上一次的环境。

但这个实现有个问题就是不支持同时存在多个子应用。

### ProxySanbox
这是 LegacySanbox 改进版本，而且实现更为简单。也是目前 qiankun 默认采用的方式。

每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，如果不存在，就从 rawWindow (原始的 window )里去找；当对沙箱内部的 window 对象赋值的时候，会直接操作 fakeWindow ，而不会影响到 rawWindow。

![micro-fe-10](/static/img/micro-fe/10.png)

# 工程实践概览
## 主应用注册
基于 qiankun 的微前端方式是比较简单的，对于基座应用来说就是简单的注册各个子应用的路由：

```js
registerMicroApp(
    {
      name: "Video Core Web",
      entry: "/video-core-web/index.html",
      container: "#micro-app",
      activeRule: "/video-core-web/",
    }
)
```

主要就两个值：entry 和 activeRule。

1. entry 是入口：用于 qiankun 子应用的入口文件。
`. activeRule 就是需要匹配的 url path 前缀。

## 子应用接入
子应用是一个完全独立的应用。在实现可以按照自己的团队需要做任意的处理。

但，因为要放到基座应用里去运行，所以还是需要加一些额外的处理。

### 一是打包配置修改
对应的是要修改 webpack.config.js 的 output 属性：

```js
webpack.config.js
const { name } = require('/package')
 
//...
output: {
    path: rsv('./dist'),
    library: `${name}-[name]`, // 项目名-[name]，防止 umd 层面模块名冲突
    libraryTarget: 'umd',
}
```

### 二是新增一个 public-path.ts 文件

```js
public-path.ts
declare let __webpack_public_path__: string | undefined
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

### 三是修改入口 app.tsx

```js
app.tsx
import './public-path'  // 需要在第一行
  
// 包裹之前的 render 处理
function render(props) {
    ReactDOM.render(<App />, document.getElementById('#app'))
}
 
if (!window.__POWERED_BY_QIANKUN__) {
    render({})
}
 
export async function bootstrap() {
    console.log('app bootstraped')
}
 
export async function mount(props) {
    render(props)
}
 
export async function unmount() {
    ReactDOM.unmountComponentAtNode(document.getElementById('#app'))
}
```

就这样三步就完成了一个子应用的改造。



qiankun 官网也给出了实践，具体可以看：https://qiankun.umijs.org/zh/guide/tutorial#react-%E5%BE%AE%E5%BA%94%E7%94%A8

## 运行流程

![micro-fe-11](/static/img/micro-fe/11.png)

# 最后

真实在实际应用上，微前端只是一个基础的技术方案。我们做得更多的是，技术上怎么让其他团队能够快速的接入，业务上如何让各个团队做更少的改动。

最后，所有微前端相关的文档都在这里：Micro-FE Docs 大家有兴趣可以去看。

