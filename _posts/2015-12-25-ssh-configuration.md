---
layout: blog
title: SSH配置
tags: [ssh, ssh-keygen]
categories: [linux]
summary: 本文主要是说明如何在同一台电脑里使用不同的ssh-key
---

# 背景

我们希望在不同的工程下使用不同的ssh-key。比如，在公司环境下使用专门针对公司的ssh-key，然后自己同步github代码时使用专门针对github的ssh-key。

那么我们如何才能做到呢？

# ssh-key生成

首先，我们需要先生成两个不同ssh-key：`ssh-keygen -t rsa -f 'id_rsa_yss' -C 'yss.nelson@gmail.com'`

通过上面这个命令，我们就可以生成一个密钥和对应的公钥（`id_rsa_yss, id_rsa_yss.pub`）。

上面这个命令中的`-f`参数可以不加，会在执行的过程中输入。`-C`参数，指的是描述，加入后，会在生成的公钥最后一段加上，可以用于区分不同的ssh-key。

# .ssh/config

现在就到了正式的配置环节。配置对应的文件路径为：`.ssh/config`。

这里还是直接上代码：

{% highlight sh %}
Host xxx_alias
    HostName git.yssbox.com
    Port 22
    User yansong
    IdentityFile ~/.ssh/id_rsa

Host github.com
    HostName github.com # 这一行可以不写，默认使用Host值
    Port 22 # 这一行可以不写，默认是22
    User git
    IdentityFile ~/.ssh/id_rsa_yss
{% endhighlight %}

看完了上面的代码，想必你已准备自己动手了。

那么就从现在开始吧~
