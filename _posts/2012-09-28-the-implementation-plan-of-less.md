---
layout: blog
title: 主站实施LESS的推行方案
tags: [less, 方案]
categories: [less]
summary: 让可编程化的CSS在我们的指尖飞舞吧~~~
---
### LESS简介
less就是可编程化的CSS。简单给个例子：
{% highlight css %}
/* 原始的test.less */
#nav {
    position:relative;
    li {
        position: absolute;
    }
}
    || lessc test.less test.css
    \/
/* 生成的test.css */
#nav {
    position:relative;
}
#nav li {
    position:absolute;
}
{% endhighlight %}
详细请参考：[http://www.lesscss.net/](http://www.lesscss.net/)
### 基于nodejs的csstoless
最开始打算使用github上一个用rb写的css2less。但是输出的结果完全乱套了，所以还是决定自己重写。
#### 基本思路
css文件 --解析成--> JSON对象 --生成--> less文件
JSON对象大概是这样子的：
{% highlight javascript %}
{
    "#nav" : {
        "comment" : "/* it is a comment */",
        "text" : "color:red; font-size:14px;",
        "a" : {
            "text": "color:white; font-size:12px;"
        }
    },

    "#hd" : {
        "text" : "height:134px;"
    }
}
{% endhighlight %}
#### 使用
{% highlight sh %}
fes csstoless test.css # 在对应的test.css目录下生成test.less
fes csstoless test.css > base.less # 在对应的test.css目录下生成base.less
{% endhighlight %}
#### 问题
* 多个注释会合并到顶级节点的位置，如：
{% highlight css %}
/* comment 1 */
#nav { ... }
/* comment 2 */
#nav a { ... }
    ||
    \/
/* comment 1 */
/* comment 2 */
#nav {
    ...
    a {
        ...
    }
}
{% endhighlight %}
这样做的目的就是为了避免生成空表达式的css。会在之后的less注意事项里详细讲解。

* 或许还有更多，等待发现。
### less的书写规范
依照之前的CSS规范来说，就应该是这样：
{% highlight css %}
#nav {
    width:960px;
    height:100px;
    a {
        display:inline-block;
        *zoom:1;
    }
}
{% endhighlight %}
意见？？？ => 采用LESS官方写法，也就是上面的那种写法。
### less的注意事项
直接转到：[用LESS需要注意的几点]({{ BASE_PATH }}/2012/09/19/some-notes-in-less.html)
### 开发环境中针对LESS解析成CSS的方案
#### 方案一：更改对应的virtualHost配置*（临时方案）*
找到对应的配置文件，在下面加上下面这句话：
{% highlight html %}
Alias /static404.php /home/yansong/mt/webroot/static404.php
RewriteEngine on
# 这句可加可不加，用于记录rewrite日志
RewriteLog /home/yansong/mt/rewrite.log
RewriteLogLevel 1
# 重写规则是所以的css文件转向默认的php文件处理
RewriteRule ^/(.*\.css)$ /static404.php
ErrorDocument 404 /static404.php
{% endhighlight %}
具体可以参考我的virtualHost配置（/etc/httpd/vm/00ysmt）以及我的重定向文件处理（/home/yansong/mt/webroot/static404.php）。

最后，如果配置virtualHost，需要找SA帮忙重启apache服务器。因为我们没有权限。;)

#### 方案二：配置.vimrc文件*（放弃）*
我们现在都是基于vim开发，所以提供一个非常方便vim的解决办法，避免去配置virtualHost文件以及写对应的中转文件。

只需要在~/.vimrc最后面加上下面这句话：
{% highlight vim %}
" 1、快捷键方案 即按esc键后，再按, m这两个键
nnoremap ,m :w <BAR> !lessc % > %:p:r.css<CR><space>
" 2、保存后方案 即你按esc键后，再按:w这两个键
" 即保存是检测到为less文件就进行解析
autocmd BufWritePost,FileWritePost *.less !lessc % <afile>:r.css
{% endhighlight %}

* 方案是好，但是漏洞太大*，比如，我修改了common/base.less但是我需要更新的是base.less

#### 方案三：理解解决方案，改动大
1. 首先针对之前开发环境下的服务器做好相关配置，默认请求的CSS都转向一个处理文件，每次请求都进行一次LESS解析（当然，如果有必要的话可以加缓存，但是毕竟是开发环境，使用的人不多，压力不大）。

2. 我们使用的是git管理我们的代码，这样的话，我们通过在.gitignore文件加入：*.css => 即忽略掉所有的css文件。这样做的目的避免用户操作处理CSS文件。

3. 在我们的发布脚本里加上LESS解析处理所有有改动的less文件（最好的做法就是根据一定规则编译所有不是通用的LESS文件），这样做的目的就是让线上的服务器是直接请求对应的css文件。
    当然这块也想过不去解析LESS文件，但是毕竟你要用CDN嘛。；）

### 商家后台推行LESS方案
#### 拆分
商家后台目前只引用一个base.css文件，现在分别拆分成4个文件：
{% highlight html %}
common/reset.less    =>  reset部分的CSS代码，也就是yui的reset.css
common/common.less   =>  所有通用的方法，比如通用表单样式，正确和错误提示样式
common/base.less     =>  @import上面两个样式，通用的头部尾部代码，首页代码，登录后页面基本样式
base.less            =>  @import "base.less"，所有代码。
{% endhighlight %}
他们对应的关系如下：
{% highlight html %}
common/reset.less
                    =@import=>  common/base.less  =@import=> base.less
common/common.less
{% endhighlight %}
最开始的想法是引用两个CSS文件，第一个是common/base.less，第二个是base.less

有没有更好的拆分建议？ => 暂定这种拆分方式。
