---
layout: blog
title: 自动生成_post下的博客文章的jekyllpost
tags: [自动化]
categories: [nodejs]
summary: 在基于Jekyll的博客下，每次写文章都需要想想今天是几年几月几日，很不爽，然后自己就写了这么一个自动化脚本，旨在快速的进行文章编辑
---
### 缘由
在基于Jekyll的博客下，每次写文章都需要想想今天是几年几月几日，因为jekyll下对博客的命名有严格的要求。这样的话，每次写标题都很不爽，然后自己就写了这么一个自动化脚本，旨在快速的进行文章编辑，避免写文章的激情让前期的一些步骤所干扰。

### 关于jekyllpost
jekyllpost是基于nodejs的一个执行文件，在使用前需要确保你的机子安装好了nodejs。没有的话，请移步到<a href="http://nodejs.org" target="_blank">nodejs官网</a>

### 使用jekyllpost
我写的这个[jekyllpost](https://github.com/yss/util/Nodejs/command/jekyllpost)，其实很简单，就是按照Jekyll要求的方式，帮你自动生成了对应的md文件。

你只需要把这个[jekyllpost](https://github.com/yss/util/Nodejs/command/jekyllpost)文件拷贝到你目录，然后运行：chmod +x jekyllpost(让jekyllpost变成可执行文件)即可。

然后使用的时候：./jekyllpost create jekyll post 这样就生成了2012-11-11-create-jekyll-post.md文件，其中2012-11-11为你当前机器的年月日组合。

但是生成的文件内容可能不完全跟你想要的不一致，你可以根据自己的需要进行修改。

