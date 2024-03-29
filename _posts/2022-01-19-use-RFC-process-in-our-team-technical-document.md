---
layout: blog
title: RFC 流程在团队技术文档中的应用
tags: [rfc]
categories: [application]
summary: 解读 RFC，理解 RFC，应用 RFC

---
# RFC 是什么
作为一名技术人员，看到 RFC 的第一印象就是它是一个庞大的文档库，里面包含了计算机领域方方面面的规范。

RFC 的全称是 Request For Comments，即请求意见稿。初衷是为了方便大家一起讨论和交流，后来慢慢变成了互联网协议草案及标准。

# RFC 的发布过程

![rfc-1](/static/img/rfc-1.png)

通常 RFC 的发布过程是：

1. 当某家机构或团体开发出了一套标准或提出对某种标准的设想，想要征询外界的意见时，就会在Internet上发放一份 RFC；
2. 然后，对这一问题感兴趣的人可以阅读该 RFC 并提出自己的意见；
3. 之后，经过大量的论证和修改过程；
4. 最后，由主要的标准化组织进行发布。

IETF互联网工程任务小组，英文全称 Internet Engineering Task Force，就是这样的一个标准化组织，它负责互联网标准的开发和推动。

但是，我们今天说的 RFC 流程并不是 RFC 本身发布流程，而是借鉴了它的文档发布流程思想。

# 开源项目中 RFC 流程应用

现在已经有非常多的开源项目在采用了 RFC 流程来帮助和指导项目的设计，比如：React RFC 流程（https://github.com/reactjs/rfcs/blob/master/README.md）、Vue RFC 流程（https://github.com/vuejs/rfcs/blob/master/README.md）、Rust RFC 流程（https://github.com/rust-lang/rfcs/blob/master/README.md）等。

这里我们拿 Vue RFC 流程来着重说明。

# Vue RFC 流程

最初接触到 RFC 流程是通过尤大发布的 Vue 3.0 计划里提到的通过 RFC 征集公众反馈。

里面说到对 RFC 流程的说明：

    what is an RFC

    The "RFC" (request for comments) process is intended to provide a consistent and controlled path for new features to enter the framework.

    Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow.

    Some changes though are "substantial", and we ask that these be put through a bit of a design process and produce a consensus among the Vue core team and the community.

翻译过来就是：

    RFC 是什么

    "RFC"(request for comments) 流程的目的是为了提供一种让新功能进入框架的可持续且可控的路径。

    很多提交，包括 bug 修复和文档改进都可以通过在日常的 GitHub Pull Request 工作流中得以实施和评审。

    但是对于一些重大的提交，我们期望这些提交能够经历一个大的设计流程，并且在 Vue 核心团队及社区中达成共识。

对于像我们这样 Vue 的主要使用者来说，之前很多的新功能，新特性，我们只有在官方文档发布之后，才能得知。

现在有了 RFC 流程后，我们不仅可以事先就能知道这个事情，还可以了解作者的设计理念、设计思路，既而更好的理解作者引入新特性、废弃旧特性的原因。

甚至我们还可以在上面提出自己的问题，帮助 Vue 向更好的方向发展。

**每个人都不再是旁观者，而是决策的参与者。**

# Vue RFC 流程生命周期
当然，Vue RFC 本身的灵感是来源于 React RFC Process 、Rust RFC Process 和 Ember RFC Process。

并且它明确了一个生命周期的概念：Pending、Active、Landed、Rejected。

一个 Vue 的 RFC 会经历以下几个阶段：

1. Pending：这个 RFC 被作为一个 PR(pull request) 被提交。
2. Active：这个 RFC 被合并并且正在实施。
3. Landed：这个 RFC 提出的更改在实际版本中被发布。
4. Rejected：这个 RFC 的 PR 被否决。

整个流程图就可以表示成这样：

![rfc-2](/static/img/rfc-2.png)

这样一来，整个 RFC 流程就清晰明了。

# 团队技术文档下的 RFC 流程

同样的，换到我们正常的文档里，我们拿到一个文档是不是也会有各种疑问：

1. 这个文档当前是怎么一个状态，是大家已经一致认同通过了，还是已经废弃了。
2. 这个文档之前都有谁 Review 过。
3. 这个文档的结论到底是什么。

在不确定的情况下，我们就会去找之前写这份文档的人，问问他，当前文档是什么一个状况。更深一点会问当时为什么要这么去做。

那我们有没有一种机制，能够更好的解决这类问题呢？

那就是在我们的文档里引入 RFC 流程。

## 概述
对于需要讨论的重要内容，我们应当创建一份 RFC 文档，描述问题的背景和解决方案并征求大家的意见。对于 RFC 文档的可以通过 comment 或者会议的方式来充分讨论后再确定最终方案。

## RFC 的状态
RFC 的流转状态是生命周期的基础，按照历史经验，我们可以状态来定义 RFC 的生命周期。

1. WIP: 当一份 RFC 处于构思阶段，内容尚不完整时，可以标记状态为 WIP。标记为 WIP 状态的 RFC，不会邀请大家进行 Review。
2. PENDING: PENDING 状态的 RFC 表示这个文档需要多个人的评论，内容需要经过评审后才可以进入执行阶段。
3. COMMITTED: 已提交的 RFC 意味着进入了执行阶段。如果是这个技术方案设计的 RFC，它会指导后续的技术开发工作。如果是团队流程的 RFC，那么需要团队里的同学遵守相关的流程。
4. DEPRECATED：这个 RFC 不再有效。

![rfc-3](/static/img/rfc-3.png)

这其中 WIP 状态已经有很多团队在用了，本意是 work in process。

## RFC 的顺序
除了状态还需要标识各个 RFC 文档的创建顺序，我们可以在标题上加上，比如：RFC [WIP-0001] xxxx

## RFC 的 Reviewer
我们的 RFC 更重要的事是指明需要哪些人来 review 我们写的。

所以，需要一栏表述这个 RFC 都需要哪些人来 Review，并且还需要加上一些说明，比如：打勾就代表已经认同当前方案并充分表达。名单人员可能不齐，可自行添加。

因为你的 RFC 可以给任意感兴趣的人 Review 的。

## 其他需求
同时，一个技术团队，除了正常的需求和技术文档，也需要更多的其他想法和建议。

特别像一些流程、团队协作之类的。都可以放到 RFC 中去讨论。

让每个人都有一个渠道去表达自己的一些看法和想法，或者是针对某个具体问题的疑问及解决。

## 最后一点
讨论即文档。

一个 RFC 文档，不仅仅只是文档，更多的还有讨论。讨论的过程，就是大家相关沟通经验和想法的过程，所谓千人千面，不同的人对不同事情有不一样的看法和想法，本身也是一个相互学习的过程。

而且对于后来的人来说，在熟悉这个项目的时候可以清楚的知道之前都发生了什么。这个项目都经过了哪些讨论。

至此，这些 RFC 也是非常有价值的学习资料。
