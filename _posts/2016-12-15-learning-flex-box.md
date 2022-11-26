---
layout: blog
title: 认识弹性盒子(flex box)
tags: [flex]
categories: [css]
summary: 随着弹性布局的支持越来越广泛，使用的场景会越来越多
---
# 概念

认识盒子之前需要捋清几个概念：

1. 主轴（main axis）: 可以简单理解为盒子的水平方向，它是靠上的。
2. 侧轴（cross axis）: 可以简单理解为盒子的垂直方向，但是它是靠右的。

其他的具体看下图：

![弹性盒子](/static/img/flexbox.png)

# 盒子容器

## 主体定义

1. display: flex;  定义块状弹性盒子
2. display: inline-flex; 定义行内弹性盒子

## 盒子项的定义

1. flex-direction: row \| row-reverse \| column \| column-reverse;
  定义盒子内容项的对齐方式。默认row，也就是水平方向左对齐，column就是垂直方向上对齐。当内容挤满了，reverse与否都一样。
2. flex-wrap: nowrap \| wrap \| wrap-reverse; 
  定义盒子内容项是否可以换行。默认nowrap，强制在一行。需要注意的是wrap-reverse是如果direction是row则垂直方向反转，反之column就是水平方向反转。
3. flex-flow: flex-direction flex-wrap; 是两个属性的连写。
4. justify-content: flex-start \| flex-end \| center \| space-between \| space-around; 
  定义超出时盒子内容基于主轴（水平方向）的对齐方式。默认：flex-start 行首对齐；
  flex-end 行尾对齐；还有很多对齐方式，具体参考：<https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content>
5. align-items: flex-start \| flex-end \| center \| baseline \| stretch; 定义盒子内容项沿侧轴（垂直方向）的对齐方式，默认stretch。
6. align-content: flex-start \| flex-end \| center \| space-between \| space-around \| stretch;
  默认stretch。设置容器内“每行”沿侧轴的对齐方式。和justify-content类似，单行无效。主要是对可能的换行的补充。

## 盒子内容项的定义

1. order: number; 定义显示的顺序。number值越小越靠前。默认为0.
2. flex-grow: number; 增长因子，默认为0，也可以理解为内容多的时候可以额外在占据别人的空间
3. flex-shrink: number; 收缩因子，默认1，也可以理解为可以适当的别的flex-item，腾出一点空间
4. flex-basis: {any}; 默认auto，指的是我的基准空间，也就是上面两个元素的基准值。
5. flex: flex-grow flex-shrink flex-basis; 即缩写。
6. align-self: auto \| flex-start \| flex-end \| center \| baseline \| stretch; 
  默认 auto, 定义弹性元素在侧轴的对齐方式。默认会覆盖父级的align-items属性。


# 参考

1. <https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes>
