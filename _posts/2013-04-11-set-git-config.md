---
layout: blog
title: 配置你用的Git
tags: [git]
categories: [git]
summary: 常用Git，所以你需要更好的去配置你自己的Git，所谓工欲善其事，必先利其器
---
常见的配置有两个：

1. 一个是.gitignore文件，用来忽略的不需要加入到git仓库的文件或路径。
2. 另一个是.gitconfig文件，用来配置git的一些命令。

### .gitignore
.gitignore文件只应用于当前目录。文件内的所有路径都是相对路径，相对.gitignore文件的路径。

对应文件类的，前面加不加“/”都一样的。

1. 完整路径匹配。如：staitc/css/base.css
2. 前缀匹配。如：static/
3. 后缀匹配。如：*.css
4. 前后缀匹配。如：static/*.css # 这个只匹配文件，不匹配路径
4. 文件名。如：base.css
5. 否定匹配。如：!static/*.less

而.gitignore文件的存在就是在你运行git命令时，对忽略的文件不做任何显示和处理。

### .gitconfig
.gitconfig是git的配置文件。它可以放到用户根目录（~）下或者直接修改.git/config。

两者的不同就在于：~/.gitconfig文件作用到的是当前用户下的所有git仓库。而.git/config只作用于当前git仓库。

另外.git/config还包含当前仓库的信息。

这里简单说一下比较常用的配置：

{% highlight shell %}
# 定义用户信息
[user]
	email = yss.nelson@gmail.com
	name = yss
# 缩写写法
[alias]
    st = status
    di = diff
    ci = commit
    co = checkout
    br = branch
{% endhighlight %}

### Continue...

持续补充...