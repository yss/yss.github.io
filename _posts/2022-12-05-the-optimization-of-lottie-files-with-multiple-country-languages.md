---
layout: blog
title: RN bundle 下的 lottie 多语言文件优化
tags: [rn, optimize]
categories: [rn]
summary: RN bundle 下多份类似的 lottie 文件是否有优化空间

---

# 背景
我们现在的 lottie 文件，针对多语言环境是打到一个包的。

相当于一个动画，两个 json 文件。

我们拿一个最典型的例子开始：

## 一个典型例子
比如下面这个图：

![lottie-file-optimization](/static/img/lottie-file-optimization.png)

同时有两个：rewardBoxClaimEn.json 和 rewardBoxClaimId.json 。

# Lottie 文件对 bundle size 的影响
在我们理解里，Lottie 文件应该主要是文字上的差异。如果在一起压缩，应该能压缩很大部分。

我们拿这两个文件，分别用两种方式压缩：


三个文件夹：

1. id：只包含 rewardBoxClaimId.json
1. en: 只包含 rewardBoxClaimEn.json
1. all：包含 rewardBoxClaimEn.json 和 rewardBoxClaimId.json

对应的压缩文件形式：

1. 一种是直接用 7zip 压缩文件夹
1. 二种是先用 zip 压缩，再用 7zip 压缩。

压缩命令及参数和 bundle 构建保持一致：7z a -mtm- -mx=3 xx.7z xx 。

原始目录及压缩后的文件  |  大小(KB)  |  说明
:---|:---|:-------
all/  |  3720  |  带 .zip 的都是先 zip 压缩后再 7zip 压缩。
all.7z  |  2912
all.zip.7z  |  2744
id/  |  1864
id.7z  |  1456
id.zip.7z  |  1372
en/  |  1864
en.7z | 1456
en.zip.7z  |  1372

### 从上面的数据可以看出：
先用 zip 压缩再用 7zip 压缩确实能够减少整个包的大小。

另外，用这种方式最终得到的压缩包体积和拆分之后在压缩的体积，近乎完全相等：1372 + 1372 = 2744

也就是说：这两个文件在一起，并没有多少相同的部分。



带着这个疑问，我重新看了具体的文件内容。

# 文件内容分析
先是简单的对比了文件内容，可以发现前面基本一样。等找到图片部分，发现绝大部分都不一样。

通过手段，剔除掉图片后，我们对一下大小：

使用正则：,"p":"[^"]+" 搜索出，总共有 9 个图片，删除后得到如下数据（au -sk xx.json）：

 | 大小（KB）
:---|:---
正常大小  |  2176
剔除图片后的大小  |  36

从这个数据可以明显看出，图片在这个 json 文件的占比是：98.3%。

然后图片内容来说：

相同的图片内容数是：8个

然后，再剔除一些细微的差异（En 文件多了一个 ,"l":2）和一个不相同的图片，我们发现：

 | 大小（KB）
:---|:---
正常大小  |  1897060
剔除不相同后的大小  |  1885786

也就是说大概接近 100% 相同。

那为什么压缩后几乎没有变化呢？

带着这个疑问开始了各种各样的搜索和尝试。

# 为什么压缩后几乎没有变化呢
## 第一个尝试：相同文件压缩
就是在目录下放两个一模一样的文件，只是名字不同。

然后对这个目录进行压缩：

原始目录及压缩后的文件 | 大小（KB）
:---|:---
same/  |  3712
same.7z |   2744
same.zip.7z  |  2744
single.7z  |  1372

这不符合我们的预期！

我们预期大小应该是 1372 ，但是得到的大小是 2744。

## 第一个疑问：算法问题？
这怎么也不可能呀！

单独一个文件是有压缩的。

## 第二个疑问：压缩命令的问题？
我用的 7z 命令是通过 brew install p7zip 安装的，难道是压缩命令的差异？

为了验证，我重新把 Independent Builder 库关于压缩命令那一环节看了又看。

最后，缩减成下面这个命令：

```js
const glob = require('glob')
const sevenBin = require('7zip-bin').path7za
const execa = require('@shopee-rn/deployment-fns').execa
const Path = require('path')
 
const DIR = 'same'
  const contents = glob
    .sync('/Users/song.yan/tmp/7z/' + DIR + '/*')
    .map(p => Path.relative('/Users/song.yan/tmp/' + DIR, p));
 
    console.log('Contents', JSON.stringify(contents))
     
    compressFiles('/Users/song.yan/tmp/7z/build/' + DIR + '.7z', contents, undefined, {
      cwd: '/Users/song.yan/tmp/7z',
    });
async function compressFiles(
  dest,
  source,
  zipOpts,
  options
){
  // see: https://sourceforge.net/p/sevenzip/discussion/45797/thread/61905a4c/#5437
  // -mtm- will remove the timestamp effect when zipping
  const defaultZipOpts = ['-mtm-', '-mx=3'];
 
  return execa(
    sevenBin,
    [
      'a',
      ...(zipOpts ?? defaultZipOpts),
      dest,
      ...(Array.isArray(source) ? source : [source]),
    ],
    options
  );
}
```

通过上面这个 js 脚本压缩得到的压缩包大小和直接通过命令方式的压缩得到的压缩包大小是一致的。



所以，为什么呢？

## 从源头分析线上 plugin 包
回到我们通过抓包获取到的线上 plugin 包的解压缩来看。



我们解压 xxx.plugin.7z（10MB） 后得到了一个 xxx.plugin（19.2MB） 的文件。



我们之前做过一个尝试，就是在代码里面（lucky-video.plugin 文件）找到了对应的引入 rewardBoxClaimEn.json（1.8MB） 的那一行，并删掉。然后再压缩。



得到的结论是删掉那一行代码对整个最终的 plugin 大小几乎没有影响。

### 一个小的尝试
尝试直接删除 assets/fallback 下最大的 json 文件，也就是  rewardBoxClaimEn.json（1.8MB），然后再压缩。

发现整个 bundle 大小从 10MB 减小到了 8.3MB。

然后继续删除  rewardBoxClaimId.json，整个 bundle 大小从 8.3MB 减小到了 6.6MB。

### 第二个尝试
删除 lucky-video.plugin 文件中对应的引入  rewardBoxClaimEn.json（1.8MB）和 rewardBoxClaimId.json（1.8MB） 的那两行。然后再压缩。

整个 bundle 大小从 10MB 减小到 7MB。

然后尝试只删除一个  rewardBoxClaimEn.json（1.8MB）。

整个 bundle 大小从 10MB 减小到 8.5MB

尝试了很多次都是这个结论。

最后再验证，不做任何改动，然后再压缩。

得到的是整个 bundle 大小都是 10MB。

所以，初步认定应该是最开始的实验（006 - RN lucky-video bundle 大小分析）删除的那张图片不对，应该是删除了一张小图片，所以看着对整个 bundle 大小没有什么影响。

# 一个无心之举
尝试了不知道多少次，整个屏幕都写着满满的失望。直到。。。

在试的过程中，有一次无意中没有加参数，然后直接运行 7z a all.7z all/ ，发现出现了奇迹般的效果：

原始目录及压缩后的文件 | 大小（KB）
:---|:---
all/  |  3712
all.7z  |  1384
en.7z  |  1372
成功的达到预期了！！！



**所以出问题的是 7z 的参数！！！**



那是哪个参数的问题呢？

分别试了删除 -mtm- 和 -mx=3 ，最终发现是 -mx=3 这个参数导致的。



-mx=3 是设置压缩等价为 3，默认是 5。

## 现在 7z 是否还有压缩空间？
试了一下压缩线上的 7z 文件。

得到的结果出乎意料：

文件 | 大小（KB）| 说明
:---|:---|:-------
55a68962e6a9c28b78caaaeed1621935.plugin.7z  |  10MB  |  线上的 plugin 大小
55a68962e6a9c28b78caaaeed1621935.plugin  |  19.2MB  |  解压后的大小
55a68962e6a9c28b78caaaeed1621935.plugin.new.7z  |  3.5MB  |  把 -mx=5 后压缩 55a68962e6a9c28b78caaaeed1621935.plugin


**也就是说，使用新的参数后，能够减少 6.5 MB，也就是能够减少 65% 的大小！！！**

# 深究 7z 压缩命令的含义
我们现在用的压缩命令是： `7z a -mtm- -mx=3` 



a 的含义是启动压缩。



-m<method_parameter> 是设置压缩方法。

tm 的意思是设置多线程模式（sets multithreading  mode），- 的意思是 off ，也就是关闭多线程模式。

默认只能在 LZMA、LZMA2 和 BZip2 压缩模式下才能使用。默认的值是 2，即开启 2 个线程。

然后，这里之所以要关闭，是因为开启多线程模式会清除时间戳（https://sourceforge.net/p/sevenzip/discussion/45797/thread/61905a4c/#5437）。



x 的意思是设置压缩等级，取值有：0，1，3，5，7，9。默认是 5。

Level | Method | Dictionary | FastBytes | MatchFinder | Filter | Description
:---|:---|:---|:---|:---|:---|:-------
0  |  Copy | | | | | No compression.
1  |  LZMA2  |  64 KB  |  32  |  HC4  |  BCJ  |  Fastest compressing
3  |  LZMA2  |  1 MB  |  32  |  HC4  |  BCJ  |  Fast compressing
5  |  LZMA2  |  16 MB  |  32  |  BT4  |  BCJ  |  Normal compressing
7  |  LZMA2  |  32 MB  |  64  |  BT4  |  BCJ  |  Maximum compressing
9  |  LZMA2  |  64 MB  |  64  |  BT4  |  BCJ2  |  Ultra compressing
这里面 3 和 5 的差异主要是两个点：Dictionary 和 MatchFinder。



Dictionary 一般说的是压缩算法使用的内存区域，用来查找和压缩重复数据模式。

HC4：具有 4 字节哈希的哈希链，加上具有 3 字节哈希的表（hash chains with 4 bytes hashing, plus a table with 3 bytes hashing）

BT4：具有 4 字节散列的二叉树，加上具有 3 字节散列的表（binary trees with 4 bytes hashing, plus a table with 3 bytes hashing）



那到底是哪个差异导致的呢？

带着这个疑问，我分别试了一个实验，使用两份一样的 862KB 大小的文件，然后分别使用 -mx=1、-mx=3、-mx=5 和 -mx=7 压缩。

 | 两个 862KB 原始文件 | -mx=1 | -mx=3 | -mx=5 | -mx=7
:---|:---|:---|:---|:---|:---
大小  |  862KB x 2 = 1724 KB  |  1.3MB  |  664KB  |  629KB  |  629KB

在找了一个文件相似率在 90% 以上的两个文件：

 | 两个相似率 90% 原始文件 | -mx=1 | -mx=3 | -mx=5 | -mx=7
:---|:---|:---|:---|:---|:---
大小  |  862KB x 2 = 1724 KB  |  1.3MB  |  670KB  |  634KB  |  634KB

从这里可以看出：

1. 文件大小如果是在 Dictionary 范围内的话，是能够做到相同文件被压缩的。
1. 在相似率比较大的情况下 BT4 的压缩率是比 HC4 好的。能减少大概 5.3%。 (664 - 629)/664 = 5.27%  (670-634)/670 = 5.37%

# 结论
不需要做任何的优化。

主要的两点：

1. 多语言文件内容相似比例接近 100%。压缩算法是可以达到接近 100% 的压缩率。可以不用处理。
2. 结合我们最新 lottie 文件大小优化的结果，我们现在所有的 Lottie 文件都已经小于 1MB 了。对应的压缩效果会有一个明显的提升。
  1. 测试环境的数据是从 8.8MB 降到了 4.1MB，相当于整个包的大小降低了 53.4%。



然后，是否可以使用 BT4 模式的 MatchFinder，这个需要问一下 SG 那边对应的人，是否可以做相关的参数调整。
