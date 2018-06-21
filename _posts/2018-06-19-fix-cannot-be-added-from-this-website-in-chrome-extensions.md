---
layout: blog
title: 解决Chrome无法安装第三方扩展程序
tags: []
categories: [others]
summary: 国情下，很多chrome插件是无法使用的，这一回又直接禁了，怎么办呢

---

很早之前谷歌禁止用户直接安装第三方插件，但是开辟了一个额外的口子，那就是，用户要主动去扩展程序页（chrome://extensions），然后把刚才下好的第三方扩展文件拖到当前窗口，然后就可以安装了。

但是，2018年6月12日，谷歌在Chromium Blog(https://blog.chromium.org/)宣布，到今年年底，Chrome 浏览器将不再支持从网上商店外部安装扩展程序，即“内联式安装”（inline installations）功能，以保护用户免受浏览器后台扩展的侵害。

谷歌的浏览器扩展打击行动将分三个阶段进行：

1. 从 6 月 12 日开始，内联安装将不再适用于新发布的扩展。
1. 从 9 月 12 日开始，谷歌将禁用所有现有扩展程序的内嵌安装功能，并自动将用户重定向到Chrome网上应用店以完成安装。
1. 到 2018 年 12 月，谷歌还将在 Chrome 71 中完全删除内嵌安装 API ，谷歌还建议通过其站点分发扩展的扩展开发人员将用户重定向到 Chrome 网上应用。

### 影响

不过，用户现在仍然可以运行使用的扩展程序，无论是从第三方还是官方网络商店下载。

但是，如果重装系统或者重装Chrome那就悲剧了，直接通过上面说的那种方式安装不了第三方插件了。

另外，对于我们中国用户，一是很多国内的插件基本都没上传到chrome的web store上，二是要翻墙，对于一般用户来说是很麻烦的。

那怎么办呢？

### 解决

那就只剩下开发者模式，要知道再怎么禁，你总不可能把开发者也都给禁了吧？

所以，从这个点着手，我们可以这样：

1. 把我们下下来的xx.crx包重命名为xx.zip。
2. 解压到xx文件夹下，把_metadata文件夹重命名为metedata，也就是删掉名字前面的_。
3. 打开：chrome://extensions/，选中右上角的开发者模式（develper mode）。
4. 这个时候中间出现三个选项：加载已解压的扩展程序、打包扩展程序、更新。
5. 点击第一个 加载已解压的扩展程序 ，然后就成功的安装了对应的插件。

### 最后

事情来得好突然，中国用户好无奈，考虑换到国产双内核浏览器？？？