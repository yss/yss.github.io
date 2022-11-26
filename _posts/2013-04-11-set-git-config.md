---
layout: blog
title: 配置你用的Git
tags: [git, 配置]
categories: [git]
summary: 常用Git，所以你需要更好的去配置你自己的Git，所谓工欲善其事，必先利其器
---

常见的配置有两个：

1. 一个是.gitignore文件，用来忽略的不需要加入到git仓库的文件或路径。
2. 另一个是.gitconfig文件，用来配置git的一些命令。

# .gitignore
.gitignore文件只应用于当前目录。文件内的所有路径都是相对路径，相对.gitignore文件的路径。

对应文件类的，前面加不加“/”都一样的。

1. 完整路径匹配。如：staitc/css/base.css
2. 前缀匹配。如：static/
3. 后缀匹配。如：*.css
4. 前后缀匹配。如：static/*.css # 这个只匹配文件，不匹配路径
4. 文件名。如：base.css
5. 否定匹配。如：!static/*.less

而.gitignore文件的存在就是在你运行git命令时，对忽略的文件不做任何显示和处理。

# .gitconfig
.gitconfig是git的配置文件。它可以放到用户根目录（~）下或者直接修改.git/config。

两者的不同就在于：~/.gitconfig文件作用到的是当前用户下的所有git仓库。而.git/config只作用于当前git仓库。

另外.git/config还包含当前仓库的信息。

这里简单说一下比较常用的配置：

{% highlight sh %}
# 定义用户信息
# 对应的命令：
# git config --global user.email yss.nelson@gmail.com
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

# 自动补全

## 单独配置
首先，找到git-completion.bash，一般是在这个位置：`/usr/local/git/contrib/completion/git-completion.bash`。不过最好你还是先`which git`，我自己的git文件安装目录是在：`/usr/local/git/bin/git`。

然后，在你~（$HOME）目录，找到你的.bashrc或者.bash_profile在里面加上一句：`source /usr/local/git/contrib/completion/git-completion.bash`。

## 全局配置
不过很多时候我们可能会放到全局的profile文件里：`/etc/profile`。这样大家就能用了。

当然，有时会要求方便管理，会把这些自动补全的命令都放在一个固定的目录下，比如：`/etc/bash_completion.d/`，然后在profile里配置：
{% highlight sh %}
for i in /etc/bash_completion.d/* ; do
    if [ -r "$i" ]; then
        . $i
    fi
done
{% endhighlight %}

# 显示git分支名
比如，我自己的`.bashrc`里的配置：
{% highlight bash %}
# 用于获取git分支名
function parse_git_branch () {
    git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
GREEN="\[\033[0;32m\]"
YELLOW="\[\033[0;33m\]"
LIGHT_GRAY="\[\033[0;37m\]"
NO_COLOR="\[\033[0m\]"
# 配置你的目录显示
PS1="$GREEN\w$NO_COLOR$YELLOW\$(parse_git_branch)$NO_COLOR\$ "
{% endhighlight %}

# Continue...

持续补充...
