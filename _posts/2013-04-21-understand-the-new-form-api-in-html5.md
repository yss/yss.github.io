---
layout: blog
title: HTML5中的Forms API
tags: [html, html5, forms api]
categories: [html]
summary: 越来越多的浏览器已经支持HTML5表单中的新API和元素了，特别是在移动端开发
---
HTML5发展越来越壮大，加之现在很多公司越来越重视移动端，继而越来越多的人转入到移动端开发。我也不例外。

# 新元素
也叫新类型，都有：email，url，search，number，date，datetime，range，color，tel，month，time，week等。

详细的说明可以去查询w3文档：<http://dev.w3.org/html5/markup/input.html#input>。

在手机上，针对不同的类型输入框，会显示不同的输入键盘。比如类型是number就会显示数字键盘，如果类型是email就会多出一个@。date类型就会有让你选择日期的控件。

另外，还增加了两个新表单标签，有：output, progress。他们跟input的取值方式保存一致，都是通过value去读取和设置。

# 新的一些个特性（property）
对于这些特性，如果不支持就会被浏览器忽略掉。这样的话，如果不是必须保持一致的话，我们就可以在我们的平时开始中逐渐使用，所谓的渐进增强就是这个道理。

## placeholder
它本意就是占位符的意思。在表单里加上一个placeholder可以做提示。在用户没有输入且没有值时就展示在输入框中。
`<input type="text" name="age" placeholder="请输入您的年龄" />`

对应的值为一个任意字符串。

## autocomplete
它是用来告诉浏览器是否要保持输入值，以备以后再次使用时能像下拉框那样使用。

对应的值为off，on，unspecified（默认设置）。
正常我们使用到的适合也就是把它设为off。
## autofocus
顾名思义，就是浏览器加载后，自动聚焦到这个元素上。正常情况下，不建议设置。

对应的值为任意字符，在使用时可直接加上这个名字即可。

## spellcheck
顾名思义就是拼写检查。大部分浏览器在textarea元素上是默认启用的。

对应的值为true或者false。

## list及对应的datalist组合
这个非常类似img上的map使用。说白了就是自动补全，具体使用就是在input标签上加一个list属性，属性值和datalist元素的id一致。
{% highlight html %}
<datalist id="contactList">
    <option value="xx@example.com" label="Example 1">
    <option value="my@example.com" label="Example 2">
</datalist>
<input type="email" name="email" list="contactList" />
{% endhighlight %}

对应的值为datalist元素的id值。

## min和max
就是输入框内能输入的最小值和最大值。目前只能在类型为range的输入框下使用。默认值分别为0和100。

注意：如果min值大于max值，则忽略max值。这种情况下，如果min值还大于100（浏览器默认值）的话，这个range框就无效啦。

对应的值为数字。

## step
顾名思义就是步骤，可以理解为每一步能走的距离。目前只能在类型为range的输入框中使用。默认值为1。

对应的值为数字。

## valueAsNumber方法
这是一个方法，它用来将文本转换成数字。相当于Number(value)。不过既可以设置也可以转换。比如在range上使用，不过一定要同时满足min，max，step要求，否则也会抛出异常。

`document.getElementById('xx').valueAsNumber(65);`

对应传入的值为数字。

## required
就是代表这个输入框是必填项。只要有字符即可。

这里不需要填值，也可以写上required。

## pattern
这个就是正则表达式，用来检测输入的值是否和当前的正则匹配，如果不匹配就不让提交，并提示错误。跟js中的正则保持一致。

对应的值为正则表达式，如：\d+

## title
这个是用来在出错的时候，展示提示信息的。但实际情况中，是追加到浏览器默认提示的后面。比如：`<input type="text" name="w" required title="单词不能为空" >`

我在chrome浏览器上看到的结果是：“请填写此字段\n单词不能为空”（\n指代的是换行了）。

对应值为任意字符串。
## formnovalidate
这个是需要放到type=submit的元素上，用来告诉浏览器，点这个提交是不需要验证的。一般使用的情景是为用户提供下次继续填写完所有信息的功能。

这里不需要填值。

## checkValidity方法
这是一个方法，用于提供在用户没有点提交按钮提交的一次检查。比如，你可以在每次input的blur事件触发时，执行这个方法，来校验是否用户填写正确。

`document.getElementById('xx').checkValidity();`

方法不需要传值。

# 验证

## setCustomValidity方法
这个是浏览器默认展示错误提示的方法。我们可以通过设置我们需要的错误提示文字，来达到我们要的效果。

`document.querySelector('input[type=number]').setCustomValidity('请输入数字。');`

当设置的值为空时，即不显示。

## invalid事件
表单元素发生错误，默认都会触发invalid事件。

通过invalid事件我们可以在html标签上写对应的处理。经典的例子是：

**required，pattern和oninvalid的结合：**

{% highlight html %}
<input type="text" name="code" required pattern="\d{4}" oninvalid="setCustomValidity('请输入正确的4位数验证码')" />
{% endhighlight %}
她们的结合好像很不爽的样子。我在chrome下尝试的结果是，如果我第一次不输入任何东西或者输入错误点提交后，下次我不管是输入还是没有输入值，它都一直提示我。 :-(

# 表单伪类样式

类型 | 含义
:------|:----------
valid | 所有通过的表单元素
invalid | 所有没有通过校验的表单元素
in-range | 正确的range元素
out-of-range | 不正确的range元素
required | 所有包含required的表单元素
optional | 没有标记required的表单元素

例如：
{% highlight css %}
/* 没有通过校验的表单元素，边框为红色 */
:invalid {
    border:1px solid red;
}
{% endhighlight %}

# 后记
以上所谈及的很多新属性和新方法在移动端也是用不了的。
移动端手机对HTML5 Form API的支持还有待继续增强。

所以，现在请慎用，虽然我们相信未来是光明的。
