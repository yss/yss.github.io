---
layout: blog
title: CORS（跨域资源共享）详解
tags: []
categories: []
summary: 都知道又都不知道

---

在读这篇文章之前，默认大家对HTTP相关知识有一定了解。

### 背景

首先说，为什么会有CORS这个东西。

要知道，前端在很早之前一直面临一个问题，就是跨域请求，因为浏览器限制，当时真的时候无所不用其极，踊跃出各种各样的方式方法去解决这个问题。乃至现在，这个跨域问题，也经常是前端面试会问的一个考点。

当然，这也不能怪浏览器厂商，毕竟安全问题是不容忽视的。

那我们在做跨域到底是要解决什么问题呢？

1. 我们期望可以只针对具体的某一些域名才可以跨域。
2. 我们期望发送跨域请求的时候可以带上用户的信息（Cookie）。

以上就是我们的原始需求。那么CORS是什么呢？

### 定义

CORS本质是一种机制，允许Web应用服务器进行跨域访问控制，从而使跨域数据传输得以安全进行。

然后，为了实现这个机制，增加了一组HTTP首部字段，并定义了跨域请求的发起方式。

#### 跨域请求过程

1. Client == OPTIONS Request ==> Server，首先，客户端发送一个OPTIONS请求到服务端。
2. Server == Response ==> Client，然后，服务端校验发过来的请求头，告诉客户端是否可以访问，以及下一步如何请求。
3. 客户端接收到请求后，再根据Response内容发送相应的Request Header信息。
4. 最后完成整个跨域请求。

#### 特殊的GET

这里重点说一下，如果是GET请求，是没有上面的第一步，也就是没有OPTIONS请求。

浏览器会直接发送，并且加上对应的Origin首部字段。

### 详解

说了这么多，我们来看一下具体是怎么做的。

#### JavaScript 部分

首先，JavaScript依旧是使用`XMLHTTPRequest`这个类，只是增加了一个属性：`withCredentials`。

`withCredentials`是一个Boolean类型值，当为true时，用来指定跨域请求是否应该使用认证信息，比如Cookie和授权头（authorization headers），否则不使用。

#### Browser 部分

Browser的本质是去改造`XMLHTTPRequest`来实现CORS。那它是怎么去做的呢？

我们先看一下各个可能的请求头信息：

##### Origin

这个首部字段是用来标识请求来源的站点信息，其实就是协议+域名+端口号。比如：`Origin: https://example.com:3000`

##### Access-Control-Request-Method

这个首部字段是告诉服务器请求会使用的HTTP METHOD。

##### Access-Control-Request-Headers

这个首部字段是告诉服务器，接下来的正常请求将会带上这个首部字段信息过来。各个首部信息名称通过`, `分割。

#### Server 部分

Server本质是接收到上面的头部信息，并处理，以及给出设置其他需要的内容。具体看下面首部字段说明：

##### Access-Control-Allow-Origin

这个首部字段是和Browser的`Origin`相对应的。它的取值是Origin首部字段的值或者`*`。

如果是`*`，表示所有域名都可以访问。

如果是具体的URI，那么必须响应`Vary`首部字段，并且它的值必须包含`Origin`。

#### Access-Control-Allow-Headers

这个首部字段是和Browser的`Access-Control-Request-Headers`相对应的。根据`Access-Control-Request-Headers`传过来的值，检测一下是否需要Browser传过来。如果确定需要，就返回对应的值。

#### Access-Control-Allow-Methods

这个首部字段是和Browser的`Access-Control-Rquest-Method`相对应的。其实就是告诉客户端你支持哪些HTTP METHOD。

#### Access-Control-Allow-Credentials

这个首部字段是和Javascript代码里设置的`withCredentials`字段相对应的。

只有当这个首部字段的值为true时，JavaScript里设置的`withCredentials`才生效。

但是，这里需要注意的是，**因为GET请求是不会发OPTIONS请求的，所以只要在JavaScript里设置了`withCredentials`就一定会带上认证信息，但是如果Server端没有返回这个首部字段的话，Browser将会忽略这个请求。**

#### Access-Control-Expose-Headers

这个首部字段说的是允许在JavaScript访问的HTTP Response首部字段白名单。

#### Access-Control-Max-Age

这个首部字段指代的是当前这个OPTION请求的有效期。

### 需要注意的点

1. 如果在JavaScript里设置了`withCredentials`，那么服务器Response返回的Access-Control-Allow-Origin头的值不能设置为`*`，必须指定为Request的Origin头，否则无效。

### 最后

最后，本篇文章可以浓缩成一段中间件代码：

```js
// koa-cors.js
module.exports = async function cors (ctx, next) {
	 const origin = ctx.get('Origin');
    if (origin && REG_WHITE_LIST.test(origin)) {
        ctx.vary('Origin');
        ctx.set('Access-Control-Allow-Origin', origin); // 允许跨域
        ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许传入Cookie

        // 如果是 OPTIONS 请求，则直接返回
        if (ctx.method === 'OPTIONS') {
            ctx.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,HEAD,PUT,DELETE'); // 支持的方法
            ctx.set('Access-Control-Max-Age', 2592000); // 过期时间一个月
            // 如果有特殊的请求头，直接响应
	         if (ctx.get('Access-Control-Request-Headers')) {
	             ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
	         }
            ctx.status = 204;
            return;
        }
    }

    await next();
}
```

### 参考
<https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS>