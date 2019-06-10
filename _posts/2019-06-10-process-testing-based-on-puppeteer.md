---
layout: blog
title: 基于Puppeteer的流程化测试
tags: []
categories: []
summary: puppeteer在目前看来是一个比较好的自动化测试工具

---

### Puppeteer是什么

Puppeteer 是一个提供高级别API来控制Chrome或者Chromium的Node库。默认使用的是headless模式。

通过它，我们可以很方便的执行测试任务，比如输入内容、点击按钮之类的测试。

另外，非常重要的一点就是，Puppeteer是Google Chrome官方维护的。这意味着可靠性是非常有保障的。

### 为什么选择Puppeteer

#### 前期做法

在选择Puppeteer之前，我们最初使用的是 selenium-standalone + webdriverIO 来做的。

每次跑测试都需要启动selenium-standalone，然后才能通过webdriverIO来执行测试任务。

一切在最初的时候跑得很顺畅。但是在运行一段时间后，暴露了各种问题：

1. selenium-standalone运行非常不问题，隔一段时间就可能会挂。从问题的表现上看，是outOfMemory了。
2. webdriverIO会出现莫名不执行的错误。
3. 宿主Chrome默认会更新，导致隔一段时间会出现chrome driver和宿主Chrome不兼容。

基于以上问题，我们一度中断了之前的自动化测试。

#### Puppeteer的优势

1. 首先Puppeteer是官方维护的，每版Chrome发布都会同步更新并升级Puppeteer。
2. Puppeteer执行的chromium是作为包的模式引入，没有之前版本号不一致的问题。
3. Puppeteer执行完后可以随启随用，不用担心引入后没有退出的问题。可以理解为以前测试进程和chrome进程是同级关系，现在变成了父子关系。

### 存在的问题

#### 下载问题

目前Puppeteer引入的最大问题就是要下载Google Chrome完成包。

在国外或许不是个问题，但国内因为地址被墙，正常情况下是无法下载使用的。

那既然知道问题，必然会有对应的对策。

官方给出了两种方案：

1. 安装时增加自定义的`PUPPETEER_DOWNLOAD_HOST`环境变量，可以在~/.npmrc文件里或者npm install之前加上。
2. 使用puppeteer-core，然后自己下载对应的chromium包。

因为我们的npm源使用的是淘宝的npm源，淘宝那边给的一个解决方案是：

1. 在~/.npmrc文件里或者npm install之前加上：`PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors/chromium-browser-snapshots/`

#### 环境限制

因为Puppeteer是基于devtools protocol的封装，只能用于Chrome，所以不能测试其他浏览器。

### 最后

Puppeteer提供的绝不仅仅只是自动化测试功能。

它还可以：

1. 生成屏幕截图以及PDF文件。
2. 抓取单页应用及生成预渲染内容。
3. 自动化的表单提交、UI测试、键盘输入等。
4. 创建一个最新的自动化测试环境。
5. 为你的网站捕获加载及运行时间线，用来分析性能问题。
6. 测试Chrome插件。

### 参考

<https://chromedevtools.github.io/devtools-protocol/>

<https://github.com/GoogleChrome/puppeteer>