---
layout: blog
title: 使用data-uri
tags: [应用, data-uri, base64]
categories: [css]
summary: 任何东西的出现都有着它的原因
---
任何东西的出现都有着它的原因，针对data uri，它的出现是因为一次http连接的开销很大。

使用data uri的方式可以减少一次http的请求，但带来的是文件变大。

### 详解
#### 格式
Data URI的格式：`data:[<MIME-type>][;charset=<encoding>][;base64],<data>`

#### 使用场景

1. html中，img标签的src属性上：`<img src="data:image/png;base64, ..." />`
2. CSS中：`backaground-image: url(data:image/png;base64, ...);`

#### 支持情况

目前除了IE6，7不支持外，其他浏览器都是支持的。

具体可以参考：<http://caniuse.com/datauri>

#### 生成base 64

1. 在线生成：<http://www.base64-image.de/>
2. 命令行生成：`base64 my.png` 或者 `openssl base64 < my.png | tr -d '\n'`
3. less生成：`background-image: data-uri(i/xx.png)`

#### 解码base 64

先将生成好的base 64内容保存到一个文件F里，然后命令行下执行：`cat F | base64 -D -o output.png`
