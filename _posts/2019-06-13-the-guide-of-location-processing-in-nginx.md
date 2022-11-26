---
layout: blog
title: 深入理解nginx中location的处理
tags: []
categories: [nginx]
summary: nginx下location是怎么处理的呢？这篇文章会给你一个准确的答案

---

# 前言

工作中一直在用nginx，但用得不多，主要是在测试环境增加或修改一下配置。

所以，大部分时候都是复制粘贴一下之前的配置，再修改一下就可以达到想要的效果。

但是随着配置文件越来越大，然后出现了各种各样的location写法，这个时候就特别困惑，特别想了解一下location背后是怎么处理的。所以有了这篇文章。

# 基础知识

在看这篇文章之前先大致了解一下location的基础知识：

1. location是在 server 块内配置的。
2. 不同的location使用自己的配置来处理不同的请求。
3. location是有顺序的。

# 语法规则及例子

```plain
location [ = | ~ | ~* | ^~ ] uri { ... }

location @name { ... }
```

## 修饰符含义
location后面跟的修饰符含义：

1. `=` 表示精准匹配，即请求路径完全相同。
2. `~` 表示使用区分大小写的正则表达式匹配，后面的uri是一个正则表达式。
3. `~*` 同第2条，差异在于不区分大小写。
4. `^~` 可以理解为不要进行后续的正则匹配。这个在后续的匹配过程再详细讲。
5. `@name` 别名的作用，方便内部其他location直接使用这个规则。

## 一些例子

```nginx
# 正常匹配，以 /test 开头的路径
location /test {}

# 精准匹配，请求路径只有 /
location = / {}

# 区分大小写的正则匹配
# 匹配以/api/ /iphone/ /android/开头的路径
location ~ ^/(api|iphone|android)/ {}

# 不区分大小写的正则匹配
# 匹配以 .jpg .jpeg .JPEG .JPG 结尾的路径
location ~* \.jpe?g$ {}

# 如果链接返回的状态是404，则转到 @err 上的规则处理
location /img/ {
	error_page 404 @err;
}
location @err {}
```

## 匹配过程

匹配的过程大致会分两种类型分别处理：非正则和正则。

大致的过程如下：

1. 先顺序匹配所有非正则的location。
2. 如果遇到 `=` 规则匹配到了，则停止继续匹配。
3. 如果遇到 `^~` 规则，并且当前 uri 是当前匹配到的最长的uri（uri长度最长的），则停止继续匹配。
4. 保存当前最长匹配项。
5. 接着开始顺序匹配所有正则的location。
6. 只要匹配到了，则停止继续匹配。直接使用当前正则匹配到的location处理。
7. 如果没有匹配到任意的正则的location，则使用第4项保存下来的最长匹配项。

总结一点就是正则匹配的优先级更高，除非遇到`^~`或`=`。 

# 参考

<https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#configuring-locations>