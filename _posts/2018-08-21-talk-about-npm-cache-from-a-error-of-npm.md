---
layout: blog
title: 从一个npm ERR谈到npm cache
tags: []
categories: []
summary: 每次升级应该留出更多的时间放到测试上去跑

---

突然有一天发现发布机编译的时候总是报一个错误：

```text
npm ERR! As of npm@5, the npm cache self-heals from corruption issues and data extracted from the cache is guaranteed to be valid. If you want to make sure everything is consistent, use 'npm cache verify' instead.
npm ERR! 
npm ERR! If you're sure you want to delete the entire cache, rerun this command with --force.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/maintain/.npm/_logs/2018-08-16T02_32_21_947Z-debug.log
```

当然，这个报错并没有导致整个编译挂掉，因为执行的时候加了+e（sh +xe xx.sh）。相当于忽略错误。

然后，看了一下报错日志，发现是因为执行`npm cache clean`导致的。

之后就上npm文档（<https://docs.npmjs.com/cli/cache>）找到了对应的说明。

这个其实是npm升级到@5版本之后的一个改进。

# npm cache

npm cache有三个方法

1. add，就是在本地缓存中增加具体的包，主要是供npm内部调用。
2. clean，就是清空整个缓存。
3. verfiy，验证缓存文件夹的内容，清除掉不需要的数据，验证缓存索引和所有的数据是否完整。

然后，为什么不能直接使用`npm cache clean`呢？

官方是这么说的：

> All data that passes through the cache is fully verified for integrity on both insertion and extraction. Cache corruption will either trigger an error, or signal to pacote that the data must be refetched, which it will do automatically. For this reason, it should never be necessary to clear the cache for any reason other than reclaiming disk space, thus why clean now requires --force to run.
	
翻译过来就是：

> 不管是增加还是移除，所有通过cache获取到的数据都会被验证它的完整性。缓存不一致都会导致抛出一个错误，并且发送一个信号告诉`pacote`数据需要自动的重新获取。因为有这么一个验证机制，除非恢复磁盘空间，否则没有必要清除缓存。如果真的要清楚，则必须加上 --force。

说白了，官方的说法就是，他们有一套非常健全的校验缓存完整性的机制，可以保证我们使用到的缓存不会被破坏。

最后，强烈推荐我们使用`npm cache verfiy`替代`npm cache clean`。

最终，我们改成了`npm cache verfiy`。

没有报错，真好~
