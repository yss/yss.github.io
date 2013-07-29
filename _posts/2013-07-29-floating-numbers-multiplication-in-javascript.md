---
layout: blog
title: Javascript中的浮点数相乘
tags: [js, 浮点数, 相乘]
categories: [js]
summary: 当实际问题摆在面前的时候才知道要去重视这个问题
---
Javascript中的浮点数相乘是个很有意思的事情。

浮点数相乘有很多方式，下面是我给出的一个我自己认为不错的解决方案：

{% highlight js %}
function FxF(f1, f2) {
    f1 += '';
    f2 += '';
    var f1Len = f1.split('.')[1].length,
        f2Len = f2.split('.')[1].length;

    if (f1Len) {
        f1 = f1.replace('.', '');
    }
    if (f2Len) {
        f2 = f2.replace('.', '');
    }
    return f1 * f2 / factorial(10, f1Len + f2Len);
};

// 阶乘
function factorial(num, count) {
    if (count < 2) {
        return num;
    }
    return num * this.factorial(num, --count);
}
{% endhighlight js %}

### 基本思想
基本的思想就是把浮点数全部变成整数，然后除以等值的10的N阶次方。N为（两个浮点数的后面长度之和）。
