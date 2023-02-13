---
layout: blog
title: 从 master squash 到 release 是否可行
tags: [git]
categories: [git]
summary: 对比使用 squash 方式的优劣

---
# 背景
现在所有合 master 的分支都要求用 squash 的方式，这样一方面可以减少很多的冲突，另外一个方面也可以极大的缩小 commit 记录。

减少冲突是因为，合并的时候关注已改动的文件和目标 master 文件的差异，而不关心中间曾经做过的一些无用或者调试类的修改跟其他人的提交产生版本冲突。

缩小 commit 记录，也是因为每个需求可能会有很多的无用提交。



对于小需求来说是非常好的，但是大需求的话，可能不是特别友好，毕竟中间过程完全没了，确实存在一些问题。这个要具体问题具体看。

但整体来说，这个模式是大大提高了我们的工作效率。



那这个方式能不能应用到 master 合并到 release 呢？

# 现状
然而，现在我们还有一个 release 分支，release 分支只接收两个类型的分支合并：hotfix 和 master。

hotfix 大部分时候都是一个小提交，通过 squash 或者直接合都问题不大，当然，最好是直接 squash。

但 master 的话，目前是直接合并，而不是 squash 的方式。



正常情况下一个 hotfix 流程是：

创建 hotfix 分支 → 开发 → 测试 → 合并到 release → 发布 → 合并到 master



master 和 release 是一个相互合并的过程。

# 对比
 |优势|缺点
:----|:-----
merge directly 方式	| 能保留各个需求的提交记录 |
merge with squash 方式 | | 发 hotfix 后 merge 回来可能会产生非常大的冲突。

主要是 release 是一个长期维护的分支通过 squash 来合代码，会导致它和其他正常开发分支产生严格的割裂。

# 结论
维持现状。

依旧采用 merge directly。