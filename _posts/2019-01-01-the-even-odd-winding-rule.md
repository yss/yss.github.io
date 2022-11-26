---
layout: blog
title: 奇偶环绕规则
tags: []
categories: []
summary: 也是一种计算点是否在多边形内的一种算法

---

# 具体定义

平面内的任何一点P，引出一条射线，注意不要经过多边形的顶点，如果射线与多边形的交点的个数为奇数，则点P在多边形的内部，否则在多边形的外部。

# 代码实现

```js
function isPointInPath (point, path) {
	const { x, y } = point;
	const len = path.length;
	let result = false;
	for (let i = 0, j = len - 1; i < len; ++i) {
		if (((path[i].y > y) !== (path[j].y > y)) && // point的y坐标在当前线段y坐标区间之内
				(x < path[i].x + (path[j].x - path[i].x) * (y - path[i].y) / (path[j].y - path[i].y))) {
			result = !result;
		}
		j = i;
	}
	
	return result;
}
```

这段代码其实跟非零环绕规则非常相似。

1. 先判断y点在线段的y轴之内。
2. 如果当前点是在向下线段的左边，或者向上线段的右边时，就加1，反之减1。
3. 不过上面代码直接使用true和false去做，模式是不相交（false），有一次相交就变成了（true）。

