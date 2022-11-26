---
layout: blog
title: img vs background-image
tags: []
categories: []
summary: 是用img还是background-image呢

---

# 前言

本文主要是探讨何时使用img，以及何时使用background-image。

两者都是在页面中呈现一张图片。

如果单纯从实现效果上来说，通过两者都可以实现，只能说某些场景下更适合用某个。

# 场景

这里列举想到的一些场景：

## sprite图

sprite图出现的初衷是为了解决过多小图片的加载时间多长问题。本质是为了优化。

这种情况，必然是用background-image。虽然通过img也是可以做到同样的效果，但是非常麻烦。

## 图片展示

1. 固定区域不同尺寸等比展示，这个时候，background-image配合最新CSS3的属性`background-size: cover`就可以搞定，如果要用img的话，就需要js去配合。
2. 固定区域对齐。background-image搭配background-position这个属性，基本上可以适配你想要的各种场景。
3. 单个小图标展示。这个时候通过把小图标转base64去展示，background-image和img都差不多。但是由于很多时候我们是用less或者scss去写css，那么使用background-image无疑是更方面的。

# 图片延迟加载

这个情况，一般针对的较大的图片，且图片较多的情况的一种处理。毋庸置疑img是最好的选择。

# SEO

有很多网站大部分是图片，而且需要做图片SEO（图片搜索）。那么就必须使用img+alt的方式去做。

# 总结

正常来说，

background-image是因为搭配了background的其他属性，所以显得特别强大好用。一般适用于小图片。

img一般适用于大图片的展示。