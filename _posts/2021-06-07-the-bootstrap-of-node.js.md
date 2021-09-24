---
layout: blog
title: Node.js 教学
tags: [node.js]
categories: [node.js]
summary: 这是一篇 node.js 的教学类文章。

---
这是一篇 node.js 的教学类文章。

### 前言
Node.js 本身涉及到的东西非常的多，不仅仅是前端一些常规的知识，更重要的是操作系统和网络的知识。更是一种全新的开发思维。

我今天能讲的，只会是其中的一小部分，更多的部分就需要靠大家去做了。

### Node.js 的历程
#### Node.js 的诞生
话说有个叫Ryan Dahl的歪果仁，他的工作是用C/C++写高性能Web服务。对于高性能，异步IO、事件驱动是基本原则，但是用C/C++写就太痛苦了。于是这位仁兄开始设想用高级语言开发Web服务。他评估了很多种高级语言，发现很多语言虽然同时提供了同步IO和异步IO，但是开发人员一旦用了同步IO，他们就再也懒得写异步IO了，所以，最终，Ryan瞄向了JavaScript。 因为JavaScript是单线程执行，根本不能进行同步IO操作，所以，JavaScript的这一“缺陷”导致了它只能使用异步IO。 选定了开发语言，还要有运行时引擎。这位仁兄曾考虑过自己写一个，不过明智地放弃了，因为V8就是开源的JavaScript引擎。让Google投资去优化V8，咱只负责改造一下拿来用，还不用付钱，这个买卖很划算。 于是在2009年，Ryan正式推出了基于JavaScript语言和V8引擎的开源Web服务器项目，命名为Node.js。虽然名字很土，但是，Node第一次把JavaScript带入到后端服务器开发，加上世界上已经有无数的JavaScript开发人员，所以Node一下子就火了起来。

#### Node.js 上的分歧
但好景不长，一个是 Ryan 在 2012年离开了社区，一个是 Node.js 并没有如愿在服务端领域蓬勃发展，反而是不温不火的一个状态，另一个是 2015 年 Node.js 贡献者对 ES6 新特性集成问题的分歧，导致分裂出了 iojs。

并且由 iojs 发布了 1.0、2.0、3.0 版本。

这种分歧下弄得大家人心惶惶，大家都开始在质疑 Node.js 能走多久。

#### Node.js 的最终融合
以此同时，2015年Node.js基金会的宣告成立，并顺利发布了4.0版本。Node.js基金会的创始成员包括 Google、Joyent、IBM、Paypal、微软、Fidelity 和 Linux基金会，创始成员将共同掌管过去由 Joyent 一家企业掌控的 Node.js 开源项目。

算是终于打消了大家的疑虑。但是在这个背后，不得不说到一个事情，那就是

我们前端领域工具的汹涌勃发，Node.js 的社区，前端的各种各样基于Node.js工具层出不穷，达到一种井喷的状态。

![node.js module counts](/static/img/node-module-counts.png)

上面的图是 http://www.modulecounts.com/ 统计各个语言下的包的数量。时间是2020年。可以看到 Node.js 一骑绝尘，事实上其实6年前也就是2015年的时候，就已经变成了第一大包。

在我的理解里是我们这些一个个 发布 js 项目包的人在默默拯救了 Node.js 项目。



记得很多之前，很多前端构建相关的都是用的 shell 来写，不仅学习成本巨大，而且维护成本也巨大，不同平台还有非常大的差异。继而极大的限制了前端人员的主观能动性。

Node.js 的出现对我们开发人员，相当于久旱逢甘霖，平台再也不是限制我们的理由了。

### Node.js 的原理
说了这么多，是希望大家能有一个大的背景去理解 Node.js 的一个发展历程。

我们现在说说 Node.js 本身的一个原理，借助这个这个东西可以让大家更好的理解 Node.js 。

下面是一张 Node.js 早期的架构图，来自 Node.js 之父 Ryan Dahl 的演讲稿，在今天依然不过时，它简要的介绍了 Node.js 是基于 Chrome V8引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环只要等待执行结果就可以了。

![node.js 原理](/static/img/node_principle.png)

核心概念

1. Chrome V8 是 Google 发布的开源 JavaScript 引擎，采用 C/C++ 编写，在 Google 的 Chrome 浏览器中被使用。Chrome V8 引擎可以独立运行，也可以用来嵌入到 C/C++ 应用程序中执行。
2. Event Loop 事件循环
3. Thread Pool 线程池（由 libuv 提供）

梳理一下

1. Chrome V8 是 JavaScript 引擎
1. Node.js 内置 Chrome V8 引擎，所以它使用的 JavaScript 语法
1. JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事
1. 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务
1. 如果前一个任务耗时很长，后一个任务就不得不一直等着
1. 如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 I/O 很慢，不得不等着结果出来，再往下执行
1. CPU 完全可以不管 I/O 设备，挂起处于等待中的任务，先运行排在后面的任务
1. 将等待中的 I/O 任务放到 Event Loop 里
1. 由 Event Loop 将 I/O 任务放到线程池里
1. 只要有资源，就尽力执行

我们再换一个更直观的方式看一下

![node.js 原理](/static/img/node_principle_new.png)

1. 主进程负责执行任务
2. 线程池负责处理异步逻辑
3. event loop 相当于负责整体的调度和管理，它按照一个约定的规则，负责把异步逻辑交给主进程去执行。
4. 上层的 Node Bindings 是针对当前系统的类库封装。

#### noNode.js下的Event Loop
下面的图表展示了事件循环操作顺序的简化概览

![node.js event loop](/static/img/node-event-loop.png)

每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段，等等。

1. 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
2. 待定回调：执行延迟到下一个循环迭代的 I/O 回调。 idle, prepare：仅系统内部使用。
3. 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
4. 检测：setImmediate() 回调函数在这里执行。
5. 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。 在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。

具体可以参考：https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

### Node.js 的安装和使用
#### Node.js 的安装
简单的安装方式就是上 Node.js 官网（https://nodejs.org）下载对应平台的安装程序。

高级的方式就是先按照 Node.js 包管理工具再按照对应版本的 Node.js 包，常用的是两个：

##### nvm
```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
 
$ export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
 
$ nvm install 12.13.0
```
##### n
由于 n 本身是用 Node.js 写的，所以推荐先上官网下载 Node.js 安装包。之后再执行 `npm install -g n`

详细安装可以看它的文档：https://www.npmjs.com/package/n#installation

#### Npm 的使用
目前我们看到的 Node.js 安装，默认就安装了 Npm。

Npm 源的话，默认是 Node.js 官方的源：https://registry.npmjs.com

推荐改成公司内部源：
```sh
$ npm set registry http://npm.zhenguanyu.com/
 
# 也可以直接编辑  ~/.npmrc
# 加上下面这一行
registry=http://npm.zhenguanyu.com/
```
##### 一些基本命令

1. npm init	生成 package.json
2. npm install	它会根据 package.json 里的依赖信息在 node_modules 文件夹下安装当前项目所需要的所有东西
3. npm install <package-name>	
一般后面都会跟一个 --save 或者 --save-dev

--save 安装并添加条目到 package.json 文件的 dependencies。

--save-dev 安装并添加条目到 package.json 文件的 devDependencies。

如果是新安装的包，默认是 --save

两者的区别主要是，devDependencies 通常是开发的工具（例如测试的库），而 dependencies 则是与生产环境中的应用程序相关。

4. npm run <task-name>	
主要是执行 package.json 里的 scripts，比如下面的 npm run start

```json
{
  "scripts": {
    "start": "node bin/www"
  }
}
```

package.json
```json
{
 "name": "test-project",
 "version": "1.0.0",
 "description": "A Vue.js project",
 "main": "src/main.js",
 "private": true,
 "scripts": {
   "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
   "start": "npm run dev", "unit": "jest --config test/unit/jest.conf.js --coverage",
   "test": "npm run unit"
 },
 "dependencies": {
   "vue": "^2.5.2"
 },
 "devDependencies": {
   "autoprefixer": "^7.1.2",
   "babel-core": "^6.22.1",
   "babel-eslint": "^8.2.1",
   "babel-helper-vue-jsx-merge-props": "^2.0.3"
 
 },
 "engines": {
   "node": ">= 6.0.0",
   "npm": ">= 3.0.0"
 },
 "browserslist": [
   "> 1%",
   "last 2 versions",
   "not ie <= 8"
 ]
}
```
1. version 表明了当前的版本。
1. name 设置了应用程序/软件包的名称。
1. description 是应用程序/软件包的简短描述。
1. main 设置了应用程序的入口点。
1. private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm。
1. scripts 定义了一组可以运行的 node 脚本。
1. dependencies 设置了作为依赖安装的 npm 软件包的列表。
1. devDependencies 设置了作为开发依赖安装的 npm 软件包的列表。
1. engines 设置了此软件包/应用程序在哪个版本的 Node.js 上运行。
1. browserslist 用于告知要支持哪些浏览器（及其版本）。

#### IDE和编辑器
本来想拿其他编辑器来对比一下，但发现没有任何的意义，毋庸置疑就是 Visual Studio Code。

Visual Studio Code 本身就是用 Node.js 写的一个应用程序。

本身它是免费的，然后一直在迭代开发，插件也非常的丰富，是前端开发人员的标配。

如果想在 Visual Studio Code 中运行和调试代码可以在工程目录下加上：.vscode/launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/bin/www"
        }
    ]
}
```

#### API 介绍
主要对照着 Node.js 的 API 文档，讲讲为什么需要它们，然后它们做了哪些事情。

Cluster Mode
![cluster mode](/static/img/cluster_flow.png)

### Node.js 的应用
#### Node.js 应用场景

![node.js 应用场景](/static/img/node_application.png)

Node.js 使用场景主要分为4大类

1. 跨平台：覆盖你能想到的面向用户的所有平台，传统的PC Web端，以及PC客户端 nw.js/electron 、移动端HTML5、react-native 等
2. Web应用开发：网站、Api、RPC服务等
3. 前端：三大框架 React \ Vue \ Angular 辅助开发，以及工程化演进过程（使用Gulp /Webpack 构建 Web 开发工具）
4. 工具：npm上各种工具模块，包括各种前端预编译、构建工具Vite / Webpack / Gulp、脚手架，命令行工具，各种奇技淫巧等
#### 如何写一个工具

##### 简单方式
```sh
#!/usr/bin/env node
 
// 获取执行参数
const argv = process.argv;
 
// 这里写执行代码
```
一般是只针对自己的需要写一些快捷的命令。

当然你也可以用 commander.js 来处理各种参数：

```sh
const { Command } = require('commander');
const program = new Command();
 
program
  .option('-d, --debug', 'output extra debugging');
 
program.parse();
 
if (options.debug) console.log(program.opts());
```
##### 常规方式
配合 npm 在 package.json 里定义一个 bin 字段。

```json
{
 "bin": {
   "mocha": "bin/mocha.js"
 }
}
```


然后就可以直接通过 `npm install -g xxx` 达到全局安装。

也可以作为包的方式，然后 `npx xxx` 来执行。

#### 服务层面的应用
延伸到 服务层面，node.js 的服务层面其实一直都没有中断，相反一直在缓慢发展，最初主要是以 express 为代表的，后来随着 ES2015 标准的出现，出现了 koa 1.0， 以及 async await 语法糖的出现，有了现在的 koa 2.0。

```js
const Express = require('express');
const App = Express();
 
App.use('/test', function (req, res) {
    doReadFile1(function () {
        doReadFile2(function (data) {
            res.send(data);
        });
    });
});
 
App.listen(3000);
```

```js
const Koa = require('koa');
const App = Koa();
 
App.use('/test', function *() {
    yield doReadFile1();
    var data = yield doReadFile2();
    this.body = data;
});
 
App.listen(3000);
```

```js
const Koa = require('koa');
const App = Koa();
 
App.use('/test', async function () {
    await doReadFile1();
    var data = await doReadFile2();
    this.body = data;
});
 
App.listen(3000);
```
#### 中间件
Koa 选择了洋葱圈模型。 中间件洋葱图：

![koa](/static/img/node_koa.png)

#### API 相关
讲一下 API 相关的知识。

### 高并发在我们系统里的应用
当我们在说高并发的时候，我们在说什么，我们需要关注的是什么？这是我们首先要搞明白的一个事情。



首先说我们在说什么，高并发，其实就两个点：一个是大流量，一个是性能瓶颈。

大流量都好理解，那性能瓶颈呢？通俗意义上讲就是卡脖子的点。

比如拿常规的一个网络请求的处理来说，一个网络请求打到服务器会经过各种处理，然后写入数据库数据后再返回。但数据库大概率就会有一个写入的瓶颈，比如现在最多只能同时有 1000 个连接。这个时候不管你前面怎么怎么优化，但只要这个点不解决不了，你都无法解决这个问题。



然后是我们需要关注的是什么？

其实就4个点：内存、CPU、IO、网络带宽。

高并发场景下，落实到最终的一个直观问题都是因为资源不够用。



最后，讲讲在 Node.js 服务下的处理。

Node.js 在服务层面绝大部分情况下都是采用 1 个 Cluster + N 个 Workers 组成。每个 Worker 对应的是一个进程。每个请求最终都会落到一个 Worker 上去处理。

而具体到 Worker 上，每个请求它可能会依赖数据库数据查询 或者 额外的其他服务调用。

如果每一个请求都去调用一次，那不管是对数据库还是其他服务压力都是非常大的。



所以，我们需要有一些必要的优化处理，怎么处理呢？我们可以借助 Promise

```js
let dataPromise = null;
function getDate (ctx) {
    if (!dataPromise) {
        dataPromise = new Promise((resolve, reject) => {
            doSomethingAsync(ctx, resolve, reject);
            dataPromise = null;
        });
    }
    return dataPromise;
}
// 真实使用
App.get('/', async function (ctx, next) {
    const data = await getData(ctx);
    this.body = normalize(data);
});
```

当然，这只是其中的一个小点，就是我们常说的 N 个请求对应一个查询。但却是最常用的一种方式。

当然，具体问题要具体分析，实际的场景会遇到各种各样的问题。

### 作业
写一个使用 Cluster 模式下的并发控制服务，随机生成一个固定格式的 json 数据，最后生成 HTML。
写一个并发控制的自动爬取服务数据的脚本，读取 HTML 并转换成 json。

附 PPT： ![the guide of node](/static/fs/the-guide-of-node.key)