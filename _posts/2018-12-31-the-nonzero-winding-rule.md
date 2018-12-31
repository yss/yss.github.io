---
layout: blog
title: 非零环绕规则
tags: []
categories: []
summary: 做一个笔迹算法看到的一个判断点在多边形区域内的算法

---

最近在做老师H5笔迹算法相关的事情，遇到一个套索实现的问题。

就是如何判断线在圈定的范围内。

跟之前的iOS同学聊过之后才发现他们先分解成判断点是否在区域内去计算的。用的是自己写的非零环绕规则去计算。

那非零环绕规则是什么呢？

## 已有实现

其实在canvas API里有一个方法：`CanvasRenderingContext2D.isPointInPath()
`可以去判断一个点是否在一条路径上。<https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/isPointInPath>

这个方法有四个参数：`isPointInPath(path?, x, y, fillRule)`其中：

1. path不是必须的，如果不传，则为当前的路径。
2. x,y是点的坐标。
3. fillRule：默认是`nonzero`非零环绕规则，`evenodd`奇偶环绕规则。

## 具体实现原理

首先使多边形的边变为矢量。

将环绕数初始化为零。

再从任意位置p作一条射线。

当从p点沿射线方向移动时，对在每个方向上穿过射线的边计数，每当多边形的边从右到左穿过射线时，环绕数加1，从左到右时，环绕数减1。

处理完多边形的所有相关边之后，若环绕数为非零，则p为内部点，否则，p是外部点。

## 具体代码

```js
function isPointInPath (point, path) {
	let win = 0; // 初始环绕数
	const len = path.length
	const { x, y } = point;
	for (let i = 0, j = 0; i < len; ++i) {
		if (i === len - 1) { // 循环最后的一条线段是由终点和起点组成
			j = 0;
		} else {
			j = j + 1; // 当前点和下一个点的线段
		}
		
		if (path[i].y > y) {
			if (path[j].y <= y) {
				// 如果是向下的线段的右边，那就是逆时针方向
				if (isLeft(path[i], path[j], point) < 0) {
					wn--;
				}
			}
		} else {
			if (path[j].y > y) {
				// 如果是向上的线段的左边，那就是顺时针方向
				if (isLeft(path[i], path[j], point) > 0) {
					wn++;
				}
			}
		}
	}
	
	return wn !== 0;
}

// 判断点是线的左边还是右边，
// 小于零就是右边，大于零就是左边
function isLeft (p1, p2, p) {
	// 在p点画x轴方向的线，跟p1组成的矩形面积
	// 减去
	// 在p点画y轴方向的先，跟p2组成的矩形面积
	return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
}
```

上面代码可以这么理解：

1. 首先，遍历出所有的y轴方向包含p点的两个相邻点。
2. 然后，假定路径的方向是从左到右，也就是存在这个点在向下方向的右边就减1，向上方向的左边就加1。
3. 当然，实现的时候你也可以是向下方向的左边就加1，向下方向的右边就减1去做。
4. 最后，得出最终的值。不为0则在区域内，否则区域外。

## 最后

其实非零环绕不是很好理解。只有真实的去看代码的时候，然后多画一画才能比较清楚的去理解。

之后，再写一篇关于奇偶环绕规则的文章。