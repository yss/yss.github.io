---
layout: blog
title: 团队并行开发问题及解决
tags: []
categories: [project]
summary: 并行开发的问题是每个团队变大后都必须考虑的

---

### 背景

目前绝大部分需求都是在同一个工程上做开发。

不可避免的出现，多个人同时开发一个项目。

而这个时候就会出现相互影响，甚至相互冲突，继而极大的影响整体开发效率。

主要有以下几种情况：

#### 情况一：多人同时部署

1. A代码已经提交还没有合并，然后提前部署
2. 过一会其他人B也修改了代码，然后也开始部署
3. 最终导致前一个人A的代码被后一个人B覆盖。

#### 情况二：一人独占

1. A代码需要这个sprint上线，特别是要求在周一上线的情况，需要霸占整个服务
2. 而B这个时候也在开发，但没法进入测试环境自测。

#### 情况三：微信下只有一个域名

### 解决

总而言之，核心的问题就在于怎么避免相互之间开发部署，乃至测试的时候不冲突。

也就是每个人都有自己单独的一个开发部署环境。

#### 方法一：项目拆分

最开始想的是项目拆分：活动页、购买流程、内嵌页等。

但发现相互之间有太多的公共部分，主要体现在公共组件，公共模块，公共的逻辑处理。

如果硬生生拆出去的话，意味着维护成本会非常高。
但如果把公共部分抽离出一个库，又发觉很单调，很杂很乱。

这么看，这个就不是一个很好的方案。

#### 方法二：路由拆分
申请多台服务，每个路由前缀指向其中一台服务。

看着感觉问题是基本解决了。

但是，实际却可能遇到各种其他问题：

1. 如果需求涉及到多个路由的改动就比较蛋疼。
2. 是每个路由都单独申请还是某几个放到一个单独的路由上，怎么配置，怎么权衡？
3. 开发部署也是一个问题。

虽然可以解决问题，但是由此却引来了其他各种问题。感觉得不偿失。

#### 方法三：域名拆分

现在测试环境指向这个工程的服务域名总共有四个。

有四个的原因是因为有域名重试，特别是接口。

这么一来，我们可以分别为每个域名指定不同的机器。大家开发的时候可以独占其中一个服务。

最后测试的时候，让测试根据对应开发，生成对应域名的链接进行测试。

但这个也是有问题的：

1. 需要开发前各自协商使用哪个服务。
2. 测试可能会搞混淆，特别是同时测多个需求的时候。

#### 方法四：最终方案之自定义域名

本质上跟域名拆分类似，但是每个域名都是自己名字 + 顶级域名，比如：yss.xxx.com

这样测试通过域名就能一目了然的知道自己测的是谁做的需求。开发也不用协商使用哪个服务。

最后测试没有问题后，合并到master。再进行回测，最后上线。

#### 微信唯一域名的问题

目前没有想到一个很好的做法，总体思想是使用方法二说的那种方式，根据自己当前的需求，按路由划分，反向代理到自己的服务上。

### 实施

最后就是具体的落实了。

1. 每个人都开辟一个自己的开发分支。
2. 每个人都申请一个自己独立的域名。
3. 每个人都申请一台对应的服务器。之后统一修改一下对应域名的nginx指向。
4. 修改本地发布脚本，增加一个独立的隐藏配置项。

### 最后

这个方案不一定适合所有场景，但确实是一个很好的解决方法。