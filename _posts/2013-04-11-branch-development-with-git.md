---
layout: blog
title: Git中的分支开发模式
tags: [git]
categories: [git]
summary: 在git中使用分支进行开发
---
分支的开发模式，在svn上就用得很多。

但git和svn在分支管理上还是有很大区别的。

具体说来，就是git下，它是所有的分支都下下来了，而svn只是下下来你要进行开发的那一个分支。

那今天要说的就是怎么在git下进行分支开发。

### 创建远程分支

{% highlight shell %}
git clone yansong@git:touch
git co -b test # master => test

# coding... or nothing

git push origin test:test
{% endhighlight %}

### 具体实现
这里我自己用代码展示了：
{% highlight shell %}
git clone yansong@git:touch # 把源服务器分支下下来
git co develop # 类似于git co origin/develop 但差别很大
git co -b myBranch # 切换到新分支

# coding...
# complete

git co develop # 切换到主分支
git pull # 更新主分支
git merge myBranch --squash # 使用不保留提交信息的方式，合并自己的分支
git ci -m 'some message' # 提交
git push origin develop:develop # 推送到远程服务器
{% endhighlight %}
