---
layout: blog
title: 我与rrestjs
tags: [rrestjs]
categories: [rrestjs]
summary: rrestjs是一款基于expressjs代码开发的高性能node.js开发框架，由于重新编写了框架组织架构，比expressjs整体性能提升大约10%，实用功能也更加丰富，API和代码风格相比expressjs更简单易懂。
---
### 开始
rrestjs是我无意中确是有意接触到的一款类似却又不似express的nodejs开发框架。

为什么这么说呢？

因为我在使用express的时候，特别不爽，主要是路由这块，一堆一堆的配置，而且这个配置还是不可控的，怎么说呢。比如：app.get('/get/:id', function(){});假如用户访问的地址是：/get/test也将会跑到这块来处理。虽然在express 3.0版本增加了一个next方式，让这块处理可以转移到别的路由去处理，但是感觉还是不是很爽。然后开始琢磨是不是有更好的基于nodejs的框架呢。google了一下，然后就发现了rrestjs。

之后就是看里面的例子，发现很不错，试用了一下也非常棒。里面的想法和实现，深深的震撼了我，因为那就是我要找的，而我找到了。

然后毫不留情的说服身边的人，把之前基于express构建的变成基于rrestjs构建的。

事情的开始就是这样子的了。

### rrestjs路由
然后，很有必要说说rrestjs的路由。

rrestjs的路由在包裹在try{...}catch(e){}里的一段代码。非常短小，如下：
{% highlight javascript %}
try{
    require('./controller/'+req.path[0])[req.path[1]](req, res);
}
catch(err){
    restlog.info(req.path.join('/')+'; '+err);
    res.r404();
}
{% endhighlight %}
rrestjs在接收http请求时，对url进行了一次分解。比如：http://yansong.me/u/upload => req.path = ['u', 'upload'];
然后去require('./controller/u')之后再去调用里面的upload方法。对应的u.js就应该是这样子的：
{% highlight javascript %}
// u.js
exports.upload = function(req, res) {
    // your code here
};
{% endhighlight %}
而如果不存在./controller/u.js或者不存在upload方法时，就会报错，然后自动转向了catch的处理模块。

如果你看过其他后端框架的处理模式，比如：PHP类的框架。你就很能明白这种思想理念所在了，以及它的便捷性了。
### 后记
说完rrestjs路由，我的主体思想大概就说完了。

非常感谢与rrestjs的作者本人[snoopyxdy](http://snoopyxdy.blog.163.com/)沟通，中间碰到了很多的一些问题，得以很快解决和理解。

之后打算写一个关于rrestjs路由的改进方案。。。
