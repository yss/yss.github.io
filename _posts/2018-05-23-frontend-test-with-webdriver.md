---
layout: blog
title: 前端测试之WebDriver
tags: [test]
categories: [test]
summary: 了解WebDriver，了解怎么做流程化测试

---

在国内，自动化测试一直走得很慢，待过一些公司，基本都没有专门考虑过自动化测试，基本都是人工测试。

究其原因，无外乎有这么几点：

1. 需求经常变动，持续迭代。
2. 时间成本，毕竟写自动化测试是很费时间的。

但，从我的角度上看，更多的人考虑更多的，或者第一时间想到的是单元测试，对于一个正常开发，并且持续迭代的项目来说，做单元测试是一个很得不偿失的方式。

其实，抛开现象看本质，不管我们业务需求怎么变化，一些核心流程它是不会变的。比如，电商系统的购买流程。你会发现多少年来它基本都没怎么动过。

今天我们谈谈做流程化测试。

### WebDriver

说到浏览器的测试，不得不说WebDriver。

再说WebDriver之前，必须先了解WebDriver的历史。

#### 历史

在测试领域鼎鼎大名的Selenium，大家肯定都听过说。WebDriver还有一个别名叫Selenium 2.x。

既然是2.x，那肯定有1.x，也就是Selenium RC。

我们先看看Selenium RC是怎么做到自动化测试的：

基本的做法就是，Selenium RC启动一个Server，将操作Web元素的API调用转化为一段段Javascript，在Selenium内核启动浏览器之后注入这段Javascript。

但是，前端经过这么多年的发展，业务越来越复杂，浏览器更新迭代速度越来越快，再加上通过js，很多功能是无法实现的。JS注入的方式越来越不跟不上这个时代了。

然后，这个时候就有了，Selenium 2.x。那它是什么呢？这里贴一张图：

![webdirver流程图](/static/img/webdriver.png)

从图我们可以看出，引入了两个东西，一个是浏览器厂商提供的WebDriver Server。二是Wire Protocol。

Wire Protocol本身很好理解，它就是一个协议，点对点的数据通信。归结起来就是，浏览器厂商实现一个WebDriver Server, 接受来自外部的请求调用，然后通过这个请求，来真实的去操作浏览器。

这样一来，其实就是把真实的调用和操作交给了浏览器厂商。这样一来，真实性，可靠性都有了保障。

### 流程化测试

既然有了WebDriver，我们就可以模拟用户走完整个电商的购买流程。

1. 用户进入列表页，检测是否有内容，然后随机点击一项。
2. 进入详情页后，检测内容是否完整，然后点击购买。
3. 跳转到登录，输入正常的用户名和密码后登录。
4. 成功后跳转到订单支付页。
5. 最后校验支付是否成功。

然后，走完上面流程，你会发现，无论业务如何变化，上面的这个核心流程基本不会有大的变化。

最后只要设定一下，保证每次上线完后都跑一遍自动化测试。感觉瞬间上线有保障了。

### 最后

这里主要是介绍一下WebDriver及流程化测试步骤。具体的WebDriver的API和使用没有做过多的阐述。

在我看来理解了WebDriver，你就能够很清晰的知道自己要做的事情，后面的事情就是去写测试用例啦~



