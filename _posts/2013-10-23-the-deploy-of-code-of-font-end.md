---
layout: blog
title: 前端代码发布详解
tags: [发布, 详解, 前端代码]
categories: [前端发布]
summary: 前端代码发布已从shell方式转向了node+grunt。这是一小步，却也是一个大步。让我们纵情向前吧~
---
关于代码发布的事情，一直是我们前端自己在做。

在移动这边，我们的发布脚本经历过最初使用shell脚本到现在的grunt变迁。

最初的shell脚本方式还可以在我们的代码仓库中看到哦~(wink)

### 细节说明
####核心
前端代码发布的核心，其实就是对我们的静态资源进行压缩，增加版本号。

之后所有的处理都是围绕这一点去做的。

#### 使用的压缩库
目前，

css的压缩使用的是cssmin；
js的压缩使用的是uglify2。
#### 版本号计算规则
版本号默认使用的是文件的md5值的前八位。

 比如：base.js --发布–> base.xxxxxxxx.js

这里面需要额外说明的一点是less文件的版本号计算规则是：

先对less文件进行编译，然后计算编译后的css文件的md5值。

#### 域名
目前静态资源的域名有：

ms0.meituan.net：这个是最常用的，也是目前一直再用的。比如：http://ms0.meituan.net/ga.js
ms1.meituan.net：这个用得很少，因为考虑到移动端DNS解析过慢的问题，基本上没有使用这个域名。比如：http://ms1.meituan.net/ga.js
mc.meituan.net：这个是前端combo地址。比如：http://mc.meituan.net/combo?f=ga.js;test.js
注意：针对移动性能优化，目前mc.meituan.net也支持直接的静态访问，比如：http://mc.meituan.net/ga.js
它们对应用的HTTPS地址为：

静态：https://ms0.meituan.com

combo链接：https://mc0.meituan.com

 

说到HTTPS，有人可能想知道为什么要用到。

原因很简单，就是因为我们有些页面是https访问的，比如：i版的登录页和注册页。所以，我们需要对应的HTTPS地址的静态资源。

#### 服务器
目前我们这边静态资源服务器是：mobile-static01 和 mobile-static02。

两台服务器都在用。我们的资源域名指向的都是这两台静态服务器。

每天服务器都跑两个服务：前端的combo服务和静态资源。

### 具体实现
#### 目前牵扯到的文件：
##### package.json
主要存放grunt依赖包的信息。

具体的包信息，请参看：Nodejs环境搭建及对应的包管理

##### Gruntfile.js
真正的发布处理地方，也是真正的发布代码核心实现。

##### static.ftl
所在的地方：.../view/xxx/lib/static.ftl

是存放静态资源对应关系的地方。

上线过程中需要替换的文件。

##### pre-deploy-static.sh
所在的地方：src/main/resources/pre-deploy-static.sh

上线时真正调用的脚本代码。

所做的事情是：

进入工程目录；
安装grunt所需的依赖包；
压缩静态资源，计算版本号；
写入最新构建好的static.ftl；
将静态资源发布到服务器上。
### 对应关系的代码片段
开发环境中的static.ftl
{% highlight js %}
<#assign                                                                     
    DOMAIN_HOST = GLOBAL.host                                                
    STATIC_PATH = "/static/"                                                
    SSL_STATIC_PATH = "/static/"                                            
    COMBO_PATH = "/static/"                                                 
    SSL_COMBO_PATH = "/static/"                                             
    CSS_FILE = {                                                             
        "base": "touch/css/base.css",                                        
        "normalize": "touch/css/normalize.css",                              
        "event": "touch/css/event.css",                                      
        "add2home": "touch/css/add2home.css",                                
        "maoyan-account" : "touch/css/thirdpart/maoyan/maoyan-account.css"  
    }                                                                        
    JS_FILE = {                                                              
        "zepto": "touch/js/zepto.debug.js",                                  
        "base": "touch/js/base.js",                                          
        "slide": "touch/js/slide.js",                                        
        "zepto.carousel": "touch/js/zepto.carousel.js",                      
        "iscroll.lite": "touch/js/iscroll.lite.js",                          
        "hammer": "touch/js/hammer.debug.js",                                
        "hideAddressbar": "touch/js/hideAddressbar.js",                      
        "validator": "touch/js/validator.js",                                
        "zepto.unveil": "touch/js/zepto.unveil.js",                          
        "add2home": "touch/js/add2home.js",                                  
        "list": "touch/js/deal/list.js"                                     
    }>                                                                       
                                                                              
<#--                                                                         
    开发环境下combo的js处理                                                          
-->                                                                          
<#macro comboScript paths...>                                                
    <#local url = COMBO_PATH>                                                
    <#list paths as path>                                                    
        <script src="${url + JS_FILE[path]}"></script>                       
    </#list>                                                                 
</#macro>                                                                    
<#--                                                                         
    开发环境下combo的css处理                                                         
-->                                                                          
<#macro comboLink paths...>                                                  
    <#local url = COMBO_PATH>                                                
    <#list paths as path>                                                    
        <link rel="stylesheet" href="${url + CSS_FILE[path]}" />             
    </#list>                                                                 
</#macro> 
{% endhighlight %}                                                                   
发布后的static.ftl
{% highlight js %}
<#assign
    DOMAIN_HOST="i.meituan.com"
    STATIC_PATH="http://ms0.meituan.net/"
    SSL_STATIC_PATH="https://ms0.meituan.com/"
    COMBO_PATH="http://mc.meituan.net/combo/?f="
    SSL_COMBO_PATH="https://mc0.meituan.com/combo/?f="
    JS_FILE={
        "iscroll.lite":"touch/js/iscroll.lite.2c75de01.js",
        "base":"touch/js/base.7a9e5de3.js",
        "hideAddressbar":"touch/js/hideAddressbar.8ef31f98.js",
        "zepto.debug":"touch/js/zepto.debug.58b43ffd.js",
        "slide":"touch/js/slide.0b759f57.js",
        "add2home":"touch/js/add2home.0d612f57.js",
        "zepto":"touch/js/zepto.9d48b747.js",
        "hammer.debug":"touch/js/hammer.debug.ad568037.js",
        "list":"touch/js/deal/list.e6fa640c.js",
        "zepto.carousel":"touch/js/zepto.carousel.7e469653.js",
        "validator":"touch/js/validator.626aa57d.js",
        "almond":"touch/js/almond.0d220529.js",
        "zepto.unveil":"touch/js/zepto.unveil.76c10661.js"
    }
    CSS_FILE={
        "win8pad":"touch/css/win8pad.62beaddd.css",
        "maoyan-account":"touch/css/thirdpart/maoyan/maoyan-account.8a2094dd.css",
        "base":"touch/css/base.ed5a806f.css",
        "normalize":"touch/css/normalize.7ec56565.css",
        "event":"touch/css/event.d45a3aea.css",
        "add2home":"touch/css/add2home.4e6a3488.css",
        "forapp":"touch/css/forapp.cdf0c89a.css"
    }>
 
<#macro comboScript paths...>
    <#local url=COMBO_PATH>
    <#list paths as path>
        <#local url=url+JS_FILE[path]+";">
    </#list>
    <script src="${url}"></script>
</#macro>
<#macro comboLink paths...>
    <#local url=COMBO_PATH>
    <#list paths as path>
        <#local url=url+CSS_FILE[path]+";">
    </#list>
    <link rel="stylesheet" href="${url}" />
</#macro>
{% endhighlight %}                                                                   
#### 这里需要说明的是：
在开发环境下更改static.ftl，在上线后是不会有任何效果。

因为static.ftl在上线过程中，是直接被替换掉。

要改的话，需要一并更改Gruntfile.js。

#### 具体调用
在正式开发中，我们都有对应的方法调用：

例如，我们要取Css文件，则：${ScriptHelper.getCssUrl('base')}

script.ftl片段
{% highlight js %}
<#--
    获取CSS文件地址
-->
<#function getCssUrl name>
    <#return STATIC_PATH + CSS_FILE[name]>
</#function>
<#--
    获取JS文件地址
-->
<#function getJsUrl name>
    <#return STATIC_PATH + JS_FILE[name]>
</#function>
<#--
    获取image文件的地址
-->
<#function getImageUrl name>
    <#return STATIC_PATH + 'touch/img/' + name>
</#function>
<#--
    是否是测试环境
-->
<#function isOnline>
    <#return IS_ONLINE!'' />
</#function>
{% endhighlight %}
