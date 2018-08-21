---
layout: blog
title: 在项目中构建代码检查工作流
tags: []
categories: [project]
summary: 描述代码检查在项目中应用的那些个事

---

代码检查现已成为了项目的标配。代码检查主要的好处在于：

一是，保证团队代码风格一致。

二是，能够检查一般性的代码错误。

### 第一阶段

起初，我们也在项目中使用eslint，但我们只是在打包编译环节才会去使用。

然后，实际使用中，就会发现，当你准备发布上测试或线上环境的时候，发现没有找到最新的代码镜像。一查就发现是编译环节的代码检查报错了。

遇到这种情况非常糟心，因为你又要花额外的时间去解决这个问题。特别是在准备上线的时候，这个时候再去改代码，那意味着之前的测试流程可能就需要再走一遍了。

痛定思过，就要求每次提交后就进行一次完整的代码检查。之后，我们要求团队每个成员配置git的pre-commit hook。

```bash
echo './node_modules/.bin/eslint .' > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit
```

### 第二阶段

好，看着是解决了这个问题。但是接踵而来的是另外一个问题，这就得从pre-commit说起。

pre-commit是说在git commit提交之前执行一些命令，我们是执行了eslint检查，但是在开发的时候，经常会突然来一个新的需求，这么一来，就需要中断了当前的开发。

传统的做法可能是用git stash。但git stash多了会导致你根本不知道上一个stash是干嘛的。没有直接使用commit来的快捷、简单。

那么，我们就把pre-commit换成了pre-push。就是在用户push之前再去检查。好处就在于这一步肯定是必须要处理错误的。

### 第三阶段

就这么又用了一段时间，然后随着代码越来越多，就发现每次执行eslint检查都太慢了，不行，这得解决。

然后，就想怎么解决呢？

首先，大家其实要检查的只是自己这一次push所包含的改动内容。

那么，我们的思路就是去计算出这一次都改动了哪些内容。这么就需要借助git命令了。

经过最终的权衡，也就是我们目前是以origin/master分支为主分支。然后，我们只要比较当前分支和主分支（origin/master）的差异，找到所有变动的文件，然后对这些变动的文件执行eslint检查。

当然，这里也有一些问题， 比如删除的文件，重命名的文件，就不需要再额外检查。

最后，我们确定了这个命令：`git diff origin/master --name-only --diff-filter ACM`

### 第四阶段

随着项目越来越多，每次去新的项目都要自己手动执行那段命令。那我们是不是可以自动化的去做到呢？

最初，我们想到借助npm提供的一个hook：

```json
{
  "script": {
    "preinstall": "echo 'git diff origin/master --name-only --diff-filter ACM | egrep -i '\\.(js|vue)$' | xargs ./node_modules/.bin/eslint' > .git/hooks/pre-push && chmod +x .git/hooks/pre-push"
  }
}
```

这样一来，每次只要你执行了`npm install`，那么自动就帮你弄好pre-push这个命令。

### 最后

其实，在做的过程中发现，其实我们遇到的问题，其他人也遇到并且解决了。

具体可以看两个库：

1. 这个是解决设置pre-push的问题：<https://github.com/typicode/husky>
1. 这个是解决只处理变动的问题：<https://github.com/okonet/lint-staged>

目前我们这边只是处理eslint检查，如果还有其他处理的话，用上面这两个库去做最好不过了。

