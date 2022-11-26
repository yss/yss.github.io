---
layout: blog
title: 在JAVA开发环境下使用LESS
tags: [java, less]
categories: [less]
summary: 使用LESS是为了更好更方便的进行我们的前端开发
---
一不经意就发现可以在平时开发中使用LESS。

想详细了解JAVA下的LESS插件请看：<http://www.asual.com/lesscss/>
# 在JAVA中的配置
## 一、首先在开发根目录下的pom.xml中加入如下代码：
{% highlight xml %}
<dependency>
    <groupId>com.asual.lesscss</groupId>
    <artifactId>lesscss-servlet</artifactId>
    <version>1.3.3</version>
</dependency>
{% endhighlight %}

## 二、然后在web.xml(src/main/webapp/WEB-INF/web.xml)中加入如下代码：
{% highlight xml %}
<servlet>
    <servlet-name>less</servlet-name>
    <servlet-class>com.asual.lesscss.LessServlet</servlet-class>
    <init-param>
        <param-name>compress</param-name>
        <param-value>false</param-value>
    </init-param>
    <init-param>
        <param-name>cache</param-name>
        <param-value>false</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>less</servlet-name>
    <url-pattern>/static/touch/css/*</url-pattern>
</servlet-mapping>
{% endhighlight %}
如果你要压缩的话，在<param-name>compress</param-name>下的param-value设置为true。

当然，你也可以直接删掉compress。因为不设置compress的值时，默认为true。

另外，开发环境下，一定要记得将cache值设为false。

## 最后，重启你的idea吧。

# 注意一点：
url-pattern只支持三种格式：

1. 绝对路径名：/static/touch/css/base.less
2. 前缀匹配：/static/touch/css/*
3. 后缀匹配： *.less

优先级关系是：绝对路径名 》 前缀匹配 》 后缀匹配，如果是同级关系则根据摆放的先后顺序来判断。

所以，如果你发现没有正常输出对应的css代码，请检查一下url-pattern是否被处理了。

# 最后
如果真要在项目用LESS，还是必须在打包上线的时候有对应的编译成css的处理，并把静态资源发布到CDN上。

当然，小的项目或者说不在乎性能之类的直接用就可以。而且LESS插件也做了缓存处理。
