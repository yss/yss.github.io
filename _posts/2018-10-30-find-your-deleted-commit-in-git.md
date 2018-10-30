---
layout: blog
title: 在Git中找回你删除的提交
tags: []
categories: [git]
summary: 理解为什么git可以找回你删除的提交，以及具体是如何做的

---

Git是一个非常强大又好用的工具。基本是所有公司在用的代码管理工具。

今天我们主要来讲一讲具体当某一次提交，被我们一不小心弄丢后怎么找回来。

### 找回

先假定一个最简单的情况，我运行这段的代码`git reset --hard HEAD^3`。

这么一来，运行`git log`，你就会发现当前的前三个提交都没了。

这个时候怎么办呢？

Git提供了一个命令：`git reflog`。执行之后，你会发现它列出来了你最近的所有提交记录。

如果觉得还不够详细的话，那么就执行`git log -p`，查看你最近所有详细的提交记录。

这个时候，你只有找到对应你丢失的提交，然后执行`git checkout xxsha-1xx`。

你就会惊讶的发现你丢失的内容都回来了。

### 极端情况

因为reflog数据是保持在`.git/logs/`下的，如果你删除了这个目录。

那么，就可以执行`git  fsck --full`。用来显示所有未被其他对象引用的对象。

### 无解情况

那就是你把`.git/objects`目录删除了。

为什么删了这个就不行呢？

### 原理

说白了，所有的提交内容都保存在`.git/objects`目录下。

而`.git`下的其他目录，比如`branches`, `refs`都只是引用，引用的都是`objects`目录下对应的每次提交的commit id。

而我们使用的命令都不会主动去删除`objects`下的数据。