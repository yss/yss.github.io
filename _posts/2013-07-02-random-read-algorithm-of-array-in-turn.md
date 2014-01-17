---
layout: blog
title: 依次随机读取数据的算法
tags: [算法]
categories: [算法]
summary: 让数据随机展示，而且不能重复，是个很有意思的事~~~
---
给到一个数组和一个之前输出的数组，随机的输出里面没有输出的数据。

### 第一个方案
1. clone一份新数据
2. 依次剔除之前输出的数据得到一个新数据
3. 最后随机取这新数据的内容
{% highlight js %}
function getRandomIndex(min, max) {
    return min + Math.ceil(Math.random() * (max -min));
}
function getRandomData(A, B) {
    var ALen = A && A.length,
        BLen = B && B.length;
    if (!BLen) {
        return A[getRandomIndex(0, ALen)];
    }

    for (var i = 0; i < BLen; ++i) {
        
    }
};
{% endhighlight %}

### 第二个方案
1. 对两个数组（A，B），分别进行排序。
2. 算出我要取的位置（大数组的长度-小数组的长度 的随机值int_R）
3. 依次遍历大数组，跟小数组的值，一一对比：如果相等就继续，否则随机值递减，如果最后值为0，则代表取到了要的随机值。 
    if (A[i] == B[j]) {
        ++j;
        continue;
    } else {
        if (!--int_R) {
            return A[i];
        }
    }

第二个方案，感觉复杂度比第一个高，但是，如果事先就已经对大数组A进行了排序那么第二个方案就更好了。

### 第三个方案
还没有想到更好的。
