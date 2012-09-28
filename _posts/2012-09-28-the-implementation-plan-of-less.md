---
layout: blog
title: 主站实施LESS的推行方案
tags: [less, 方案]
categories: [less]
summary: 
---
### LESS简介
less就是可编程化的CSS。简单给个例子：
{% highlight css %}
/* test.less */
#nav {
    position:relative;
    li {
        position: absolute;
    }
}
    || lessc test.less test.css
    \/
/* test.css */
#nav {
    position:relative;
}
#nav li {
    position:absolute;
}
{% endhighlight %}
### 基于nodejs的csstoless
#### 基本思路
css文件 --解析成--> JSON对象 --生成--> less文件
#### 使用
{% highlight sh %}
fes csstoless test.css # 在对应的test.css目录下生成test.less
fes csstoless test.css > base.less # 在对应的test.css目录下生成base.less
{% endhighlight %}
#### 问题
*多个注释会合并到顶级节点的位置，如：
{% highlight css %}
/* comment 1 */
#nav { ... }
/* comment 2 */
#nav a { ... }
    ||
    \/
/* comment 1 */
/* comment 2 */
#nav {
    ...
    a {
        ...
    }
}
{% endhighlight %}
这样做的目的就是为了避免生成空表达式的css。会在之后的less注意事项里详细讲解。
* 还有更多，等待发现。
### less的书写规范
依照之前的CSS规范来说，就应该是这样：
{% highlight css %}
#nav {
    width:960px; height:100px;
    a {
        display:inline-block; *zoom:1;
    }
}
{% endhighlight %}
意见？？？
### less的注意事项
直接转到：[用LESS需要注意的几点]({{ BASE_PATH }}/2012/09/19/some-notes-in-less.html)
### 商家后台推行LESS方案
#### 拆分
商家后台目前只引用一个base.css文件，现在分别拆分成4个文件：
{% highlight html %}
common/reset.less    =>  reset部分的CSS代码，也就是yui的reset.css
common/common.less   =>  所有通用的方法，比如通用表单样式，正确和错误提示样式
common/base.less     =>  @import上面两个样式，通用的头部尾部代码，首页代码，登录后页面基本样式
base.less            =>  @import "base.less"，所有代码。
{% endhighlight %}
他们对应的关系如下：
{% highlight html %}
common/reset.less
                    =@import=>  common/base.less  =@import=> base.less
common/common.less
{% endhighlight %}
最开始的想法是引用两个CSS文件，第一个是common/base.less，第二个是base.less

有没有更好的拆分建议？
