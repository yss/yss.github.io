---
layout: blog
title: 聚合页面一站式解决方案
tags: []
categories: []
summary: 面对真实的运营用户，才能真正的认识到她们

---
### 背景
在参与运营关于详情页的一个问题反馈时，发现一个比较难以置信的事情，就是她们在人工的维护这一张非常大的数据表。

这个是初中的：https://shimo.zhenguanyu.com/sheets/N39unE49X5cjCK0Q/X9FVb，小学的比这个多多了：https://shimo.zhenguanyu.com/sheets/p6wwWrdRc3c8Q63Q/2TCWG。

我实际内心是比较震撼的，在我看来这个数据表密密麻麻的，管理起来将会是一个非常痛苦的事情，出错将会是一个不可避免的事实。

更大的悲痛在于，我们之前根本就没有了解到她们具体是怎么去使用的我们这个系统的。而天真的我们以为我们开发的聚合页面（https://site.zhenguanyu.com/tutor-web-market/combo.html）已经是非常好用的了。



但都破碎于真实看到的种种。

迫切而焦急的内心告诉我，我们需要做一些改进，去替代她们的这种纯手工的劳动。



但是怎么做呢？

### 她们是怎么去用的呢

在谈怎么去做，先要了解她们是怎么用的：

1. 她们先根据我们提供的模板，按里面的一个一个小模块逐步去生成各个学科，各个年级，各个班型所需要的内容，最后放到石墨的一张表格里。
2. 之后再会有一张大表，来存放：各个学科，各个年级，各个班型，还有各个老师分别对应的 聚合页面ID 及 聚合页面里面的一个个小模块 ID。
3. 最后就有了几张非常大的表。后面的所有修改，增加的操作都围绕着这几张表来处理。

起初在课程初期的时候，看着问题不大，但后来随着课程越来越多，维护的成本越来越高了。

我实在是看不下去，所以决定帮她们去做一些改变。

### 目标
在整体流程不变的情况下，把所有shimo 上管理的数据统一放到线上管理。

### 整体流程



第一种是第一次和运营沟通的结果，第二种是我这边最初的想法。

上面是两个方式，差异在于：

1. 第一种会有各种各样的模板，然后通过模板可以非常明显的区分开来各个业务。间距的会使得后面基于这个模板要生成的模块会非常小，也就非常好管理了。
2. 第二种就没有自定义模板一说，而是都放到模块层面来做。这样会使得单个模块可能会特别的多，运营人员需要通过手动筛选来找到自己想要的模块。


对于开发人员来说，第一种无疑是增加了更多的工作量（模板管理）。

最重要的是从运营人员的角度看，有没有模板的管理，对他们的影响并不是很大。

所以，我们选用第二种方案，重模块。

![combo structrue](/static/img/combo-structure.png)

PS：后期想到的另外一个就是其中的 聚合页面的管理页面，本身就已经承载了模板的功能了。

### 详细设计
#### 固定模板
这部分内容是有研发人员之间生成然后给到运营，主体上分：小学，初高中，暑期，秋季，寒期，春季，学季。

整体上，这块的模板不会太多。

以2021暑秋为例，每一期下来，会分下面几种：

1. 小学 2021 暑期系统班
2. 小学 2021 秋季系统班
3. 初高中 2021 暑期系统班
4. 初高中 2021 秋季系统班

#### 模块管理
模板是由各个模块组成的，而每个模板的各个模块顺序基本可以认为是固定不变的。

然后从某一个固定模块再创建出来的模块都属于同一个位置的同一个类型数据。



且我们在新建的时候，可以给这个模块加上它自己专属的 Tag：

1. 年级：
2. 科目：
3. 班型：

最后是，每个模块都会加上一个固定 Tag，用来标识它所处的位置。比如：pos_1 模板的第一个位置。



有了这些信息之后，我们就可以很方便的去维护和管理这些模块，特别是在运营编辑的时候可以很方便的去使用它们。

#### 聚合页面组装
因为每个模块都有自己的一个或多个 Tag，所以在聚合页面第一次生成的时候，会列出这些 Tag，其中年级和科目是必选的，运营确定后一并绑定。

#### 聚合页面管理
按照 年级、科目、班型 三个维度进行筛选，列出所有聚合页面。

#### 一键同步到 Amaze
每个聚合页面，可以根据当前自己的 tag，比如 一年级数学，然后查询所有对应的 一年级数学课程，做批量同步更新操作。

### 数据库改造
目前所有的基础数据都是有的，上面说的所有事情，核心的问题都在于给现有的数据 加 Tag。

怎么加，就是我们最需要关心的。

#### 针对模板数据
也就是聚合页面数据，通过研发特殊生成的模板。目前的数据核心就三个字段：id、ldap（创建者）、mkts（mktId 的数组）

明确需要的 Tag 是： 年级 和 科目

可以扩展一个额外的字段： tags，主要是因为不同年级的诉求不一致。

#### 针对模块数据
也就是基地数据，目前核心的就是 三个字段 id、ldap（创建者）、content（json）。

明确需要的信息是：位置信息、年级和科目，

可以扩展一个额外的字段： tags，主要是因为不同年级的诉求不一致。



这么一来，其实两者没什么大的差异，无外乎就是模块层面多了一个位置信息。

然后还需要一个大的区分，就是学季的概念。因为一年有多次。可以是这样的一个形式：22S1。



所以可以单独开辟一个关系表，总体维护这些数据。

### 数据库设计
表名：mkt_tag

字段名	字段值	字段描述
term	varchar(4)	学季，menu 类型，只能是我们已经给定的值
type	int(1)	数据类型，0是market数据，1是 combo数据
id	int(11)	marketId 或 comboId
gradeId	int(2)	年级，跟现有的 gradeId 值保持一致
subject	int(2)	科目，跟现有的 subjectId 值保持一致
extra	varchar(255)	额外的 tag 标识

索引设计

type_term_gradeId

type_term_gradeId_subjectId