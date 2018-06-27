---
layout: blog
title: 在WebView中调试
tags: []
categories: [env]
summary: 

---
### iOS篇

调试iOS需要同时具备两点：

1. Mac系统，意味着你需要有一台Mac电脑。
1. Safari浏览器
1. 需要把你的iPhone注册到开发者中，然后iOS应用打包时增加你的开发供给配置文件(development provisioning profile)

#### 打开Safari浏览器的调试功能

Safari的调试功能藏得很深，深到见底。具体的步骤为：

1. 打开偏好设置，一般是Command+,
1. 选中高级，勾选在菜单栏中显示“开发”菜单

#### 打开手机的调试功能

1. 在手机里找到 设置 -> Safari -> 高级 -> Web检查器

#### 最后的步骤

1. 用数据线把手机连上Mac
1. 打开手机上的Safari浏览器，访问一个网页
1. 在Mac上的Safari开发菜单里找到你的手机，二级菜单里找到这个网页。

### Android篇
#### Chrome调试
Chrome for android 32 以及之后的版本具有远程调试的功能，你需要做的是：

1. 开启 Android 的 USB 调试功能。
1. 用 USB 先连接到你的电脑（windows 用户需要安装 Android 驱动）。
1. 在 Chrome for android 上打开你要调试的网页。
1. 在电脑上打开 chrome （同样最低需要 32 版本），进入 菜单 -> 工具 -> 检查设备(chrome://inspect) 页面，确保 Discover USB devices 被勾选
1. 如果设置正确的话，现在就可以看到你手机上打开的页面了，点击 inspect 进入我们熟悉的 Chrome develper tools 。

由于 Android 手机各种各样，如果遇到麻烦，请仔细阅读官方文档

#### Android WebView调试

从Android 4.4开始，默认的WebView内核就是chromium了，这就给了WebView远程调试的能力。

但是，依旧需要在Android里针对WebView做以下设置：

```java
if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

然后在你的 App 里打开要调试的页面，其余步骤和使用 Chrome for Android 一样，进行远程调试。

### 最后

发现写了很多文档在公司的wiki，但是自己的博客却荒废了好久。