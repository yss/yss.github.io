---
layout: blog
title: 并发控制
tags: []
categories: []
summary: 怎么去实现一个并发控制

---

通常意义上来说，我们认为JavaScript没有真正意义上的并发控制。

为什么呢？因为JavaScript是单线程。

但是，因为node.js出现，JavaScript可以写服务器。

所以，我们今天要讲的就是在服务端，多台服务或者启用了cluster的时候，如何处理并发问题。

### 实现

首先，为什么要做并发控制？

那是因为我们需要避免多个服务同时请求同一个接口导致结果不一致的处理。

就拿微信获取access_token的接口来说，微信的说法是每次请求这个接口，access_token就会变化一次，对应的上一个access_token就会过期。

那么，我们就必须保证：大家拿到的access_token是一致的。

问题是怎么才能保证拿到的access_token是一致的呢？

1. 首先必须要有人去拿access_token。
2. 这个人拿了，其他人就不能拿。

归纳起来就是有且只有一个人去拿。

那么思路就出来了：

1. 去数据库或缓存里取access_token，有且没有过期，则直接返回数据。
2. 当发现access_token过期了或者没有，那么我先去查一下有没有锁。
3. 有锁就等待一定时间执行，然后重新执行第一步，没有锁就先创建锁。
4. 之后，请求接口获取最新的access_token，并放入数据库或缓存里。
5. 最后，销毁锁。返回最新的access_token数据。

当然，锁的实现有很多种方式，一种是通过数据库的事务。