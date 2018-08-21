---
layout: blog
title: Babel使用指南
tags: []
categories: []
summary: 不懂Babel的编译原理，但我们需要知道怎么去用Babel

---

### Babel是什么

套用官网的一句话：

	Babel is a JavaScript compiler. Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in old browsers or environments.

就是说，Babel是一个JavaScript编译器，是一个能把ES6及以上的代码编译成ES5代码的工具链。

提取两个关键字：编译器、工具链。

归结一点就是，Babel首先是一个编译器。然后，所有代码转换（ES6=>ES5）处理都是通过一个一个插件去做的。

对应起来，就是：`Babel = babel-core + babel-plugin-xx`

#### babel-core

babel-core就是babel的编译器。

核心的一个方法就是 `babel.transform(code: string, options?: Object)`。

就是把我们代码转换成一个对象，这个对象包含：生成的代码，Source Map，AST。

#### babel-plugin

babel-plugin非常多，为了方便使用，babel引入一个概念叫babel-preset。

##### babel-preset

babel-preset本质就是插件的集合，比如有：babel-preset-es2015, babel-preset-es2016, babel-preset-es2017。

还有一个`babel-preset-env`就是所有babel-preset的集合。

上面这些都是ECMA标准定义好的。

##### babel-stage

但是同时，又有一些很实用的草案，或者非常大几率会被ECMA采用的一些标准或者规范。

这么一来，就有了一个叫`babel-stage-x`，目前有：babel-stage-0, ..., babel-stage-3

然后，有意思的是，也是为了方便使用，在用的时候你只需要引入最近的最小版本，就默认引入了所有大于它的版本。

比如：直接使用`babel-stage-0`，就相当于使用了babel-stage-0, ..., babel-stage-3，也就相当于使用了所有的babel-stage。

##### 其他

之外，还有babel-preset-flow, babel-preset-react, babel-preset-minify。

这个重要是配合社区需要，针对某种特别的语法，做的转换处理。

### Babel-Polyfill

但是，Babel并不能转换所有的新特性，主要是原型链上的方法。比如：`"footbar".includes("foo")`，这个babel是无法转换的。

那为什么呢？主要有两个原因：

1. JavaScript是弱类型语言，变量的定义有：var, let, const。除了const之后，前两个都是随时可以更改变量类型的。
2. Babel本身还没有强大到知道你调用的这个方法一定是ES5+里新加的，万一你有自己的实现和定义呢？

Babel-Polyfill的本质就是实现在ES6,ES7规范里定义的原型链方法，静态方法，以及新的全局变量。

它会直接修改全局对象，定义全局变量。

这样一来，你就必须在入口引入babel-polyfill，或者在打包的地方加到里面。

最后，需要指出的是，Babel-Polyfill并不能实现所有的新特性和新方法。比如：`Reflect`。

### Babel-Runtime

通过上面的介绍，看着是所有的问题都已经解决了。

当然，事实上也是如此。

那为什么还需要说`babel-runtime`呢？

这就要从babel-plugin说起了，plugin的默认行为是直接把对应代码编译到输出的代码里，如果一个js里有到多地方用到了同一个东西，那么，每次引入的地方，就会重复生成同样的代码。这样就会造成不必要的冗余代码。比如：

```js
// a.js
import B from './b.js';
import C from './c.js';

// b.js
Promise.resolve().then(()=> {
  console.log('b');
});

// c.js
Promise.resolve().then(()=> {
  console.log('c');
});

// 编译后 a.js
// 包含两段一模一样的Promise代码，分别在编译后的b.js和c.js中。
(function(module, exports) {
  // b.js的Promise源码
})
(function(module, exports) {
  // c.js的Promise源码
})
(function(module, exports, __webpack_require__) {
  var A = __webpack_require__(1);
  var B = __webpack_require__(2);
})
```

这么一来，就有了`babel-runtime`，它的出现就是为了解决这个冗余的问题。

那么它是怎么解决的呢？

我们先来看看babel-runtime的配置：

#### helpers

通过模块引入的方式来替代之前的直接行内输出的帮助方法（inline Babel helpers），像编译class关键字的classCallCheck，关键字extends。

默认是true，即使用模块引入的方式。

#### polyfill

如果引入了babel-polyfill，新的静态方法和全局变量就不需要再做对应的编译了。

默认为true，即默认我们已经引入了babel-polyfill，不需要编译新的全局变量和静态方法。

#### regenerator

是否直接使用全局的生成器函数。也就是说，已经在全局里定义了生成器函数。

默认为ture，即不使用全局生成器函数。

#### moduleName

自定义这个runtime的名字，这样可以在代码里直接引用（主要是使用helpers），默认`babel-runtime`。

### 最佳实践

如果不是特别关心代码大小的话，最好的方式是直接用`babel-polyfill + babel-runtime`模式。即：

1. 在代码第一行或打包配置里引入`babel-polyfill`。
2. 配置.babelrc或package.json

```plain
//.babelrc
{
  "presets": [
    "env",
    "stage-0"
  ],
  "plugins": [
    "transform-runtime"
  ]
}
```
```json
{
  "babel": {
    ....babelrc
  }
}
```

#### 简单优化版

因为babel-polyfill确实非常的大，如果想做优化的话，考虑只引入自己需要的那部分。

比如，绝大部分情况下，我们只用到Array, Object, String。那么我们只引入对应的ES6, ES7代码，即：

```js
require('core-js/es6/array');
require('core-js/es6/string');
require('core-js/es6/object');
require('core-js/es7/array');
require('core-js/es7/string');
require('core-js/es7/object');
```

babel配置：

```json
{
  "presets": [
    "env",
    "stage-0"
  ],
  "plugins": [
    "transform-runtime"
  ]
}
```
##### 不足
会造成必要的冗余，主要体现在静态方法上。

比如：`Array.from`，其实我们已经引入了，但是在代码里依旧会编译。

#### 高级优化版

说到这一点，必须说一下，以前我们在IE8的ES5兼容里的做法。

那就是通过HACK的方式，也就是在HTML里加上IE8及一下专属的HACK模式：

```html
<!--[if lt IE 9]>
<script src="/s/es5-shim-50bbaee56e.js" crossorigin="anonymous"></script>
<script src="/s/es5-sham-250746e0b5.js" crossorigin="anonymous"></script>
<![endif]-->
```

同理，其实随着浏览器不断的更新，真正不支持的浏览器占比越来越小。我们只需要针对不支持的浏览器额外加载相应的polyfill代码即可。

一种是，代码里判断，即：使用Promise来判断是否支持ES6，不支持，则加载对应的js：

```js
if (!window.Promise) {
  //load es6 script synchronously
}
```

另一种是，通过User-Agent判断，一般情况下只要判断User-Agent有没有Chrome/并且不是iOS即可：

```pug
// xx.pug
- const userAgent = (Context.get('User-Agent') || '');
unless userAgent.includes('Chrome/') && !userAgent.includes('iOS')
	script(src="./path/to/es6.js")
```

### 参考

<https://babeljs.io/docs/en>