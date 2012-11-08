---
layout: blog
title: 【分享】git讲解
tags: [git, 分享]
categories: [git, 分享]
summary: 本文着重于分享什么是git，git的一些个命令，以及如何使用git。
---
### 前言
git是什么，如果你了解svn的话，你可以把它看做是svn的进化版。

回归问题，git的定义就是：分布式的版本控制软件。

* 首先一点是：版本控制。
* 然后第二点是：分布式。

### windows下安装git
PS：我个人是不建议在windows下使用git的。

因为大部分用户还依旧是windows用户，所以很有必要讲讲windows下安装git。

以下均为个人在windows下安装的过程：

1. 下载[http://code.google.com/p/msysgit/downloads/list?q=full+installer+official+git](msysgit)
    这里我选择最新的版本：Git-1.7.11-preview20120710.exe
2. 下载好了git后，双击，一路next飘过。。。 ;O)
3. 创建一个文件夹，命名为git(the name you want named)
4. （如果是要clone远程分支，则忽略这行）进入文件夹，右键，选中git init here

#### 以下是用于ssh login without password
1. 然后右键，选中git bash
2. 输入：ssh-keygen -t rsa（创建rsa密钥），然后一直回车即可。
3. 输入：vim ~/.ssh/id_rsa.pub 把里面的内容复制到远程git服务器的.ssh/authorized_key里即可。

### git的一些个命令
1. git init ： 初始化代码仓库
2. git status ：当前代码的状态，会显示出你现在改动的文件信息，如,modify , delete, new file
3. git add : 增加你需要提交的代码到缓存区
4. git commit ：提交你的代码到仓库里
5. git log ：查看你提交代码的日志
6. git pull : 把远程代码仓库下载（拉）下来
7. git push: 把你本地提交的代码推送到远程代码仓库

### git的基本使用
1. 找到你代码的文件目录（cd ~/project/）
2. 输入git init（初始化，这个时候就相当于创建了一个.git文件夹）
3. 输入git status（查看文件状态，这个时候你会发现所有当前文件目录下的文件都为待提交状态）
4. 输入git add .（增加所有的文件到待提交区，这里的“.”指代的是所有文件，当然你也可以以目录或文件的形式提交，如：git add css/ js/, git add css/a.css css/b.css）
5. 输入git commit -m ‘your commit message’（提交代码到本地的git仓库，其实就是存放对应代码片段到.git文件目录里）

### 后记
Git是一个很强大的工具，特别适合多人协同开发。而且可以直接在本地使用和操作，非常便捷。
