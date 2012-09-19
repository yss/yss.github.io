---
layout: blog
title: 理解Jekyll
---
### Jekyll是什么
Jekyll是一种静态的站点生成程序。

<cite>Jekyll is a simple, blog aware, static site generator. --- mojombo/jekyll</cite>

静态的站点，这是对Jekyll最好的描述。
### 为什么是静态站点
我想很多人困惑在这点，当然我也不例外。想想写博客的时候用的时候markdown语法，而且在创建模板的时候，使用了很多程序语言所用的一些个写法，它怎么就是成静态站点了？

文章的第一句就是我自己对Jekyll的定义，拆分一下就是：Jekyll是一个生成程序，然后是生成静态的站点！换句话说就是，就是*生成静态站点的程序*。

### Jekyll是怎么做的
Jekyll它相当于一个中间生成程序，它需要做的就是把你写好的那些个文件生成html文件，并且存放在_site目录下。

如果你在本地运行Jekyll(jekyll --auto --server)的话，你就能看到在你_site目录下生成所有的静态文件，也是你自己站点所有能访问到的地址。

而Github最后做的就是把这些生成的静态文件，推送他们的nginx服务器上对应的目录下。

这样，你就能通过网络访问你的站点了。

加一句，由于\_site是jekyll自动生成的，所以需要在.gitignore文件里设置忽略\_site/目录下的所有文件了，避免不必要的重复数据上传和浪费。
### 总结
Jekyll就是根据你目录下的文件统一生成一堆静态文件，包括html, js, css, img等。

而我们所访问到的，都是事先就生成好的文件。
