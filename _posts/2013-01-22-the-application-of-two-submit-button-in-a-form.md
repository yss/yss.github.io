---
layout: blog
title: 实例解析form中两个submit的应用
tags: [form, two submit, 提交]
categories: [html] 
summary: form中使用两个submit？很迷惑吧，那就进来看一下吧
---
# 前话
以前一直以为一个form表单不能存在两个及以上的submit按钮。一次QQ群里的讨论改变了我的看法。

引用W3C里的文档说明：
{% highlight html %}
If a form contains more than one submit button, only the activated submit button is successful.
{% endhighlight %}

这句话怎么理解呢？

最开始我看这句话的时候就误解了后面说的“only the activated submit button is successful.”，以为两个中只有一个是可用的，另外一个是不可用的。

然后是自己写页面测试，测试结果是所有的submit button都可以提交。

那我就在想W3C上的这句话是不是有错，而经讨论后发现其实说的是另外一回事。请听我分解。

# 实例
这里先说明一下，自己之前写的测试页面，对submit按钮都没有加name属性。
{% highlight html %}
<form action="/test" name="submitForm" method="get">
    <input type="text" name="w" value="1" />
    <button type="submit" name="s1">提交1</button>
    <button type="submit" name="s2">提交2</button>
</form>
{% endhighlight %}
这样一来，我们点不同的submit按钮就可以看到不同的效果了。

* 第一种情况，点“提交1”后页面的URL将是：/test?w=1&s1=
* 第二种情况，点“提交2”后页面的URL将是：/test?w=1&s2=

这样就可以，我们就很清楚明了的知道W3C所说的“only the activated submit button is successful.“。就是指的，在参数提交的过程使用的是当前点击的submit按钮值。

# 适用场景
说说适用场景。

## 第一种：表单中图片上传
有这么个需求，表单中所要上传的图片只要用户选择和改变图片就要立刻上传并及时显示缩略图在页面。

对于这种情况，很多时候的做法是写一个单独的form，里面只包含图片上传，然后漂浮到信息表单中。

这样的话对布局神马的就非常不好，最最关键点就是页面不好做兼容。

但是，如果换着使用双表单方式，只需要在后端做一下判断即可。

## 第二种：用户取消和提交操作
用户点取消时，要对之前的操作进行回撤，点提交时则继续。很适合多步操作的任务。

## 特别特别适用场景
需要说明有一种场景非常不错。

就是一个单子，可以同时运行用户修改，删除，增加操作的按钮。

这样一来只需要一个接口就可以搞定三个操作，大大的减少了接口数，而且本身单独开三个借口对应后端来说也不是很好，应该数据的增加和修改都需要对它进行检测，但是如果放到一个接口里的话，只写一处就可以了。可谓是双赢。

# 后记
谈到这个，又让我想起了我好久之间写的一个[HTML中的target属性之framename](http://blog.csdn.net/do_it__/article/details/7031948)，最典型的例子就是form表单中的target使用framename。可以改进用户自动登录机制。

不管怎样，希望本篇文章对你有帮助。

# 参考
<http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2>
