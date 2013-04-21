---
layout: blog
title: Markdown中使用表格
tags: [markdown, 表格]
categories: [markdown]
summary: 官方Markdown是不支持表格的哦，但是我们偶尔还是需要用到，那就看看我这篇文章吧
---
Markdown是不支持表格的，之所以说不支持，是因为它没有提到过表格。但是它可以支持直接使用HTML标签方式。

{% highlight html %}
<table>
    <tbody>
        <tr>
            <td>key</td>
            <td>key</td>
            <td>key</td>
            <td>key</td>
        </tr>
        <tr>
            <td>value</td>
            <td>value</td>
            <td>value</td>
            <td>value</td>
        </tr>
    </tbody>
</table>
{% endhighlight %}
然而，真实情况是：很多Markdown解析器是支持表格的Markdown写法。
### 实例
我拿我自己博客所使用的Markdown解析器：rdiscount作为例子。

下面我这段内容是摘自：[CSS vertical-align 属性](http://www.w3school.com.cn/css/pr_pos_vertical-align.asp)
{% highlight html %}
值|描述 
:---------------|:---------------
baseline|默认元素放置在父元素的基线上
sub|垂直对齐文本的下标
super|垂直对齐文本的上标
top|把元素的顶端与行中最高元素的顶端对齐
text-top|把元素的顶端与父元素字体的顶端对齐
middle|把此元素放置在父元素的中部
bottom|把元素的顶端与行中最低的元素的顶端对齐
text-bottom|把元素的底端与父元素字体的底端对齐
length|相对基准线的偏移
%|使用 "line-height" 属性的百分比值来排列此元素允许使用负值
inherit|规定应该从父元素继承 vertical-align 属性的值*（所有的IE都不支持？！）*
{% endhighlight %}
**效果如下：**

值|描述 
:---------------|:--------------
baseline|默认元素放置在父元素的基线上
sub|垂直对齐文本的下标
super|垂直对齐文本的上标
top|把元素的顶端与行中最高元素的顶端对齐
text-top|把元素的顶端与父元素字体的顶端对齐
middle|把此元素放置在父元素的中部
bottom|把元素的顶端与行中最低的元素的顶端对齐
text-bottom|把元素的底端与父元素字体的底端对齐
length|相对基准线的偏移
%|使用 "line-height" 属性的百分比值来排列此元素允许使用负值
inherit|规定应该从父元素继承 vertical-align 属性的值*（所有的IE都不支持？！）*

### 使用说明
通过上面的例子，我想大家都可以亲手尝试一下啦。
具体注意两点：

1. 符号“**|**”，指代的其实就是一个td分割。
2. 符号“**:----**”，指代的是左对齐
3. 符号“**----:**”，指代的是右对齐
4. 符号“**:----**”，指代的是居中对齐

### 注意点

1. 对齐符号有且只有一行，且在头部下方。
2. 必须要有头部。
3. 必须要有对齐符号。

满足这三点就认为是一个表格了。那赶快在你github博客上尝试吧~

