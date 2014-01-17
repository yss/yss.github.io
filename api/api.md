---
layout: blog
title: 规范相关的内容
category: [API]
tags: [API, 规范]
---

### API接口规范

{% highlight js %}
{
    "status": 0, // {Number} 状态，必填！0=成功，1..998 其他，403=没有权限,999=没有登录
    "data": "Any", // [Any] 数据，选填。 可以为任何的数据类型，根据需求而定
    "msg": "...", // [String] 错误时的提示，错误时必填
    "expires": 600, // [expires] 过期时间，约定为选填，但最好是必填
    "ext": "Any" // [Any] 扩展数据，存放数据之外的一些信息，选填
}
{% endhighlight %}

#### 一些例子

{% highlight js %}
/**
 * 正确情况
 */
// example 1
{
    "status": 0,
    "data": [1,2,3,4]
}
// example 2
{
    "status": 0,
    "data": {
        "name": "yansong"
    },
    "expires": 3000 // int 过期时间，单位为秒，给本地的缓存使用
}
 
/**
 * 错误情况
 */
 
// example 1
{
    "status": 999,
    "data": {
        "loginUrl": "/account/login"
    },
    "message": "User not login." 
}
// example 2
{
    "status": 404,
    "message": "not found"
}
{% endhighlight %}

### Ajax的URL规范

Ajax的URL地址必须以**“.json”**结尾。除非特殊情况，比如：列表页要兼容SEO

### Controller中传的参数
ccontrller中传给模板的数据名字首字母必须大写。
