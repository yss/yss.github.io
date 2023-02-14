---
layout: blog
title: RN 计算 JS 线程下的各个组件执行耗时和次数方案
tags: [rn]
categories: [rn]
summary: 通过组件级粒度执行耗时和次数来看指导后续优化

---
# 前言

我们现在是有冷启动的各个性能埋点的，但各个点的粒度都太粗了，它可以反应出整个性能的走势，是性能参考的核心指标。

在切切实实去做性能优化的时候，只能提供一个方向上的指导。就是其中哪一部分数组偏大应该去优化。

但完全给不了具体的优化建议。

而我们在做性能优化分析的时候，就需要找到更细粒度，更具体的数据，要能够深入到各个组件的执行耗时和次数。

这样，我们就能通过分析这些数据去发现我们代码逻辑、流程、乃至整个架构上的问题，之后再针对性的去做实际的优化。

# 目的
计算 JS 线程下的各个组件执行耗时和次数。

# 调研
## 现有工具
第一步想看看市面上是否有这样功能的工具，可以拿到所有函数渲染时间，然后我们做一层过滤，拿到我们自己业务所有组件的渲染时间。

最开始各种都看，但渐渐的发现通过 Native 相关的工具是拿不到的。因为所有的 RN 组件都是在额外的 js 线程执行的。

所以还是要回归到去找 js 及 react 相关的工具。

### react-devtools
react-devtools 是一款专门为非浏览器环境下的 React 应用做调试和分析的工具。

通过在测试环境运行，确实是能通过可视化的树状图看到各个 commit 中都有哪些是渲染的：

![rn-profiler](/static/img/rn-profiler.png)

但是，我们的项目非常的庞大，像上面这张图，我们只能看到是谁渲染时间比较长，但因为组件太多，而且一个流程下来会触发非常多的 commit 。

这样一来没法直观的去看到数据。

那有没有一种方式能拿到这些原始数据呢？

但在网上搜了很久，也看过它本身的 githu吧，但都没有找到过。

### React Profiler
回归到 React，React 本身是提供了一个 Profiler 的组件，它可以测量一个 React 组件多久渲染一次以及渲染一次的耗时。

我们可以通过在我们需要测量的组件外层包裹一个 Profiler 就可以做到。

```js
<Profiler id="Navigation" onRender={callback}>
 <Navigation {...props} />
</Profiler>
```

Profiler 总共有两个参数： id 和 onRender

参数 | 详细说明
:----|:-----
id  |  唯一标识，值为 string    
onRender  |  
    onRenderCallback(

    id, // 对应上面的 “id”

    phase, // "mount" （组件第一次加载） 或者 "update" （重新渲染）

    actualDuration, // 本次更新 committed 花费的渲染时间

    baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间

    startTime, // 本次更新中 React 开始渲染的时间

    commitTime, // 本次更新中 React committed 的时间

    interactions // 属于本次更新的 interactions 的集合

    )


这里面就涉及到一个很重要的概念，那就是 React 的两个主要阶段：render 阶段和 commit 阶段。

React16 引入 Fiber 架构后，将整个调度分为了两个阶段 render & commit，在 render 阶段，React 会计算 DOM 的更新，并将所有需要更新的 fiber 整理成一个 effect list，在 commit  阶段中， React 会遍历  effect list  执行所有的副作用，期间会执行更新相关的生命周期、挂载 DOM 等等。

直观上来说，render 阶段就是组件调用 render 方法。commit 阶段就是把更新的内容渲染到界面。

通过 Profiler 是可以拿到 commit 的数据。

那我们是不是可以有一种方式，可以在需要的时候做到自动的把 Profiler 包裹到我们需要包裹的组件上呢？

# 实现

这里也是看了很久，终于是在 why did you render 这个库上找到一个有用的信息。

就是拦截 React.createElement 和 React.cloneElement。

因为我们所有的组件 render 最终都是调用的这个最顶级方法做到的。比如：

```js
<Main ...props />
=>
React.createElement(Main, propObject)
```

通过拦截 React.createElement ，然后一个包裹 Profiler 的组件。即

```js
<Main ...props />
=>
React.createElement(Profiler, {...}, React.createElement(Main, propObject))
```

## 拦截 React.createElement
### 编译环节
最开始想的是在编译环节引入，可以在 preset-react 的时候通过 importSource 来改变引入的 React。

这个还有待验证。。。

### 入口环节
在第一个入口文件直接替换 React.createElement 。

目前通过实践，发现这个方法是可行的。主要原因是因为 React 的打包模式用的是 commonjs 规范。

这样只要有改动就全局生效。

## 黑名单机制
除了拦截，我们还需要过滤掉非业务组件。目前主要包括两大类：React Native 自带的组件 和 react-native-sdk 里的组件。

通过黑名单的机制，我们列出上述所有的组件名。

然后，在拦截的时候判断是在黑名单里忽略，直接返回。反之，就包裹一层 Profiler。

获取组件名的实现：

```js
function getDisplayName (component) {
  return (
    component.displayName ||
    component.name ||
    (component.type && getDisplayName(component.type)) ||
    (component.render && getDisplayName(component.render)) ||
    (typeof component === 'string' ? component : 'Unknown')
  )
}
```

## 计算值
主要是围绕 Profiler 的 onRender 函数的参数做处理。

目前需要拿到的三个值：

1. id：组件名
1. render 时间：commitTime - startTime - actualDuration  **这个是有问题的**
1. commit 时间：actualDuration

# 问题
Q: 某个组件被多次引入如何区分

目前还没有一个好的自动化方式做区分，只能手动设置 displayName 属性来区分。
