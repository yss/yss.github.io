---
layout: blog
title: 【分享】基本nodejs知识
tags: [分享,nodejs]
categories: [nodejs]
summary: nodejs本身是javascript语言，可以理解为是在以服务器为宿主环境，基于javascript进行的一次扩容
---
### 前言
#### 什么是nodejs？
在我看来，它就是javascript。不同的是它的宿主环境变了，从浏览器变成了服务器，以至于增加很多后端的功能。比如操作文件，处理网络相关服务。

其他看法？
### 那些个全局变量
#### global
{% highlight js %}
global xxx = 1;
xxx = 1;
{% endhighlight %}
需要说明的是在全局的作用域下，使用var xxx = 1;也不是全局变量。
更确切来说就是nodejs里没有一个真正意义上的最顶级变量。
#### process
进程的对象，存放着当前的运行环境参数。
其中需要说明的是三个。
* process.cwd() 指代的是当前运行这个js的绝对路径
* process.exit(code) code是一个number，一切非0值都不属于正常退出。也就意味着只有当为0时，才是正常退出。
  它的好处就在于可以中止程序的执行。
* process.nextTick(callback) 相当于setTimeout(callback, 0);更高效。
其他的用得不是很多，简单看看即可。
#### console
就是往命令行下输出一些个信息。
#### buffer
处理二进制文件的一些个方法，正常情况下是用不到的。
#### require
本质就是加载其他你需要的文件。很多时候你可以认为它就是一次include或者parse
##### require加载规则之相对或绝对路径
{% highlight js %}
var a = require('./a'); // 同理require('/a')
// a
// a.js
// a.json
// a.node
/**
 * 如果增加了extensions时会在这个位置去加载，比如
 * require.extensions['.sjs'] = require.extensions['.js'];
 * a.sjs
 */
// 这个时候如果a目录下有package.json时，
// 它会优先加载这个package.json，并取到里面的main所指向的地址
// 如："main": "./lib/b.js" => a/lib/b.js
// a/index.js
// a/index.json
// a/index.node

// 同理
var a = require('/a');
// /a
// /a.js
...
{% endhighlight %}
虽然看起来非常灵活，但是使用的时候尽量去使用去路径方式，尽量少的去使用这种写法，因为不利用维护和查阅。
##### require加载规则之文件名
{% highlight js %}
var a = require('a');
// ./node_modules/a
// ./node_modules/a.js
...
// ../node_modules/a
...
// ../../node_modules/a
...
// /node_modules/a
...
{% endhighlight %}
##### require加载规则之NODE_PATH
{% highlight bash %}
" 在 .bashrc | .bash_profile | /ect/profile 文件中增加下面这句
export NODE_PATH=/usr/local/lib/node_modules/
{% endhighlight %}
有了NODE_PATH后，找不到模块就寻找此目录下是否存在对应的模块
#### __filename
这个指代的是你使用node运行的js文件的绝对路径，亦是最顶级js文件。
{% highlight bash %}
" 在命令行下执行这个js，__filename === {path of app.js}/app.js
node app.js
" 如果app.js还有require('user.js'), __filename也为app.js的绝对路径
{% endhighlight %}
#### __dirname
跟__filename保持一致，只是它为路径，或者说是文件夹
#### module
你可以认为它是一个function，然后return exports;

说白了就是当前执行的js文档内容。nodejs里每个js都被看着是一个module，除了最顶层的，也就是运行的。
##### module.exports
相当于一个对象，用于最后返回给require它的module。
#### exports === module.exports
#### setTimeout & clearTimeout
一次性的定时操作
#### setInterval & clearInterval
重复性的定时操作
