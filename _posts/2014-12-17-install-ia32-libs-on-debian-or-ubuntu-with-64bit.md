---
layout: blog
title: 在64位的debian或ubuntu下安装ia32-libs（32位支持库）
tags: [debian, ubuntu, ia32-libs]
categories: [linux]
summary: 之前一直苦恼如何怎么在64位的系统下安装32位的支持库，折腾了很久，今天终于找到了，给大家分享一下
---
### 前言

由于历史原因，也将会是一个很久远的问题，就是怎么让软件既可以运作在64位的系统上，又可以运行在32位的系统上。

今天，我们要说的是在64位系统上安装可以支持只运行在32位系统上的软件。

### 正题

理论上来说我们应该一条命令搞定：`apt-get install ia32-libs`

但真实情况是，给出一个错误为：`Package not found.`

So, 直接看代码吧：

{% highlight sh %}
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install libncurses5:i386 libstdc++6:i386 zlib1g:i386
{% endhighlight %}

### 最后

希望对你有帮助。

附一个简洁明了安装jdk的命令：  `apt-get install sun-java6-jdk`

;)
