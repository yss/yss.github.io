---
layout: blog
title: 在Grunt任务中处理多文件方式
tags: [grunt, gruntjs]
categories: [grunt]
summary: 有一天你发现，你不能在Grunt的任务里使用\*\*/，\*\*/\*，/\* 这样的通配符，你可能会认为Grunt不支持，或者当前任务不支持，但是事实真是这样子的吗？
---

有一天你发现，你不能在Grunt的任务里使用\*\*/，\*\*/*，/\* 这样的通配符，你可能会认为Grunt不支持，或者当前任务不支持，但是事实真是这样子的吗？

答案是：肯定不是。

### 理解Grunt里的通配符
Grunt中只有两个通配符：\*\* 和 \*。

1. \*\*代表的是文件夹匹配
2. \* 代表的是文件匹配

### 构建动态的文件对象（Building the files object dynamically）
在Grunt的官方文档里有这么一小标题，将的就是我今天要说的内容。

当然，你可以不用看我下面说的，直接移步到：<http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically>

而这里面起关键作用的一个字段：`expand`，需要被设置为`true`，才能生效。

{% highlight js %}
grunt.initConfig({
    oneTaskName: {
        files: [{
            expand: true, // 启用动态扩展
            cwd: 'lib/', // 为src字段提供相对地址，说白了，其实是为了在src里少写路径前缀
            src: ['**/xxx/*.js'], // 匹配所有的这样格式的lib/{directory}/xxx/{filename}.js文件
            dest: 'build/', // 目的地地址前缀
            ext: '.min.js' // 用于扩展的，如果不加，出来的文件就没有.js后缀啦~
            // flatten: {Boolean} // 设置为true的话，这里生成的文件就是：build/xxx.js build/xx.js，也就是
            // rename: function(dest, filepath, currOption) { return dest + 'xxx/' + filepath; }
            // 如果flatten设置为true，则filepath为filename
        }]
    }
});
{% endhighlight %}

### LESS例子
这里给一个真实的，关于less的例子：
{% highlight js %}
var STATIC_PATH = 'static/';
grunt.initConfig({
    less: {
        build: {
            options: {
                paths: [STATIC_PATH + 'www/css/', STATIC_PATH + 'mobile/css/'],
                yuicompress: true
            },
            files: [
                {
                    expand: true,
                    cwd: STATIC_PATH,
                    src: ['**/css/*.less'],
                    dest: STATIC_PATH,
                    ext: '.css'
                }
            ]
        }
    }
});
{% endhighlight %}
上面的例子就是把static目录下所有的less编译成对应的css文件。

### 最后
如果您有任何疑问，可以留言跟我交流。
