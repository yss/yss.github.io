---
layout: blog
title: 理解ECMA-262-5中的严格模式
tags: [ecma, ecma5, strict mode, 严格模式, 理解]
categories: [javascript]
summary: ECMA 5中的严格模式到底是怎么回事呢
---

严格模式是区分ECMA3和ECMA5的一个重要标识，也是对Javascript语法要求更严的一种表现。

### 其中的区别

#### 定义
ECMA5中只允许，有且只有一个定义，那就是：`"use strict";`。

#### 作用域
当你郑重的写下：`"use strict";`后，你之后的代码将采用严格模式。而我这里所说的之后是指的当前作用域（或者说当前函数内）你这条语句之后;

如果你超出当前作用域则不采用严格模式。如：
{% highlight js %}
`````` a.js
// 这块无效
no = 1;
// 从这里开始依次往下都有用：
"use strict";
var a = 1;
function c() {
    var c = 1;
}

`````` b.js
var a = 1;
function c() {
    // 仅仅作用于当前函数
    "use strict";
    var c = 1;
}
{% endhighlight %}
不建议把`"use strict";`写在中间位置，应该写在每个函数的最上方。
#### 限制
严格模式下，有一些变量是不允许被定义，有一些调用是不被允许的。

##### 关键字
未来可能使用到的关键字，如：implements, interface, let, package, private, protected, public, static, yield.

他们是不可以做变量被声明，且不能作为函数参数名。

##### 8进制数字
以0开头的数字且0后的每个数字不能超过7，如：007 => 7。

当然，这也是为什么要强调，在使用parseInt的时候，后面加载转换的进制类型，如：`parseInt('08aa', 10);`

##### 没有声明的变量
定义一个没有声明的变量（一般指代的是定义了一个全局变量），如： 
{% highlight js %}
"use strict";
a = 1; // ReferenceError
var x = y = 20; // also a ReferenceError
{% endhighlight %}

但有种情况很特殊：
{% highlight js %}
"use strict";
this.declared = 10; // OK

declared = 20; // OK，全局作用域下，this === window，换句话说，本质上这个也是局部变量
{% endhighlight %}

##### 定义一个read-only属性
{% highlight js %}
"use strict";
var foo = Object.defineProperty({}, {
    bar: {
        value: 10,
        writable: false
    },
    baz: {
        get: function() {
            return 'baz is read-only property.';
        }
    }
});

foo.bar = 20; // TypeError
foo.baz = 20; // TypeError
{% endhighlight %}
但是，如果属性是可配置的，那么就还是可以通过`Object.defineProperty`去修改的。如：
{% highlight js %}
"use strict";
var foo = Object.defineProperty({}, 'bar', {
    value: 10,
    writable: false,
    configurable: true
});

Object.defineProperty(foo, 'bar', {
    value: 20
});
{% endhighlight %}
另外一种情况也可以改变read-only属性。
{% highlight js %}
"use strict";
var foo = Object.defineProperty({}, 'bar', {
    value: 10,
    writable: false
});

// inherit from foo
var newFoo = Object.create(foo);

Object.defineProperty(newFoo, 'bar', {
    value: 20
});
{% endhighlight %}
##### 创建一个没有扩展的对象
{% highlight js %}
"use strict";
var foo = {
    bar: 10
};

Object.preventExtensions(foo);

foo.bar = 20; // TypeError
{% endhighlight %}

##### eval 和 arguments
当然，在严格模式下，eval和arguments也被当做关键字。

就像第一条讲的一样，她俩是不能作为变量声明的。当然，作为对象的属性是可以的，比如：`var foo = {}; foo.eval = 10;`
需要注意一点的是，arguments不能当做函数的属性被调用，比如：`function foo(){ console.log(foo.arguments); }`

**先来说说eval**
{% highlight js %}
var a = 0;
(function() {
    "use strict";
    var a = 1;
    eval('alert(a); var a = 2; alert(a);'); // undefined, 2
    alert(a); // 1
})();
alert(a); // 0

(function() {
    var a = 1;
    eval('alert(a); var a = 2; alert(a);'); // 1, 2
    alert(a); // 2
})();
alert(a); // 0

(function() {
    var a = 1;
    eval('a = 2; alert(a);'); // 2
    alert(a); // 2
})();
alert(a); // 0
{% endhighlight %}
看到上面的例子，我们就清楚了知道了ECMA5中的eval不同点就在于，
ECMA5下eval其实是一个子函数环境（你可以理解为里面又嵌套了一个执行函数，不过，如果没写"use strict";那么它使用的是非严格模式）。非严格模式下，相当于你在当前函数内执行了一段代码，只是this不指向的当前函数而是全局变量。
{% highlight js %}
"use strict";
(function() {
    // Error, undefined.x 具体要看后面的this讲解
    // 但是在非严格模式下是undefined
    eval('alert(this.x);');
})();
{% endhighlight %}

**再说说arguments**
{% highlight js %}
(function a (x) {
    alert(arguments[0]); // 10
    arguments[0] = 20;
    alert(x); // 20
})(10);
(function a (x) {
    "use strict";
    alert(arguments[0]); // 10
    arguments[0] = 20;
    alert(x); // 10
})(10);
{% endhighlight %}
同样，看到上面的例子后，我们就知道，在ECMA5中arguments的不同点就在于，
arguments其实相当于一个静态拷贝，不再是以前的引用了。也就是说，修改arguments不会影响变量。

##### caller 和 callee
caller和callee是ES3中函数的标识。

1. arguments.caller指代的是调用当前执行函数的函数。
2. arguments.callee指代的是当前执行函数，经常被使用在匿名函数中。

那在ES5中严格模式下呢？

很不幸的消息是，arguments.callee和arguments.caller将在不能ES5中的严格模式下被使用。

**对于arguments.callee**

arguments.callee存在的意义也其实也不是很大，相反如果你直接用函数名，还可以减少几个bit的字节呢（无论压缩与否）？！

**对于arguments.caller**

arguments.caller在ES3中的定义并不规范。既不是函数的直接属性，也不是变量对象(arguments object)的属性。而且有可能被弃用，所有不推荐使用。

注意一下，另外一个需要提及的ES5变动，ES5中可以使用关键字作为属性名。但是在ES3中不能。比如：`foo = { super:fun.., function: fun.. }`就可以正常使用。

##### 重复
重复的对象属性名和函数参数是行不通的。如：
{% highlight js %}
var foo = { x: 10, x: 20 }; // SyntaxError
function bar(x, x) { ... } // SyntaxError
{% endhighlight %}
同理，下面几种情况也是行不通的：
{% highlight js %}
// SyntaxErrox, the same with "set" method
var foo = {
    get x() {},
    get x() {}
};
var foo = {
    x: 10,
    get x() {}
}
{% endhighlight %}
当然，非严格模式下，它们也是行不通的。
##### with
不准用with，;-)。pass...
##### this值
严格模式下，this值不强制转换为一个对象。当this的值为null或者undefined时，它不会转换成全局对象（global object）。当为原生值（primitive values）时，也不会强制转换为对象。

这样，通过Function.prototype.apply和Function.prototype.call调用的方式的this，可以为任意值。

这里需要注意的是，当函数不是通过new去创建时，在里面使用this.x将会报错。因为this为undefined。
{% highlight js %}
``````` a.js
function a() {
    this.x = 1;
}
a()
alert(x); // 1

``````` b.js
"use strict";
function a() {
    this.x = 2; // Error，because undefined.x = 2
}
a();
alert(x); // undefined，当然，这步是不会被执行的，因为上一步报错
{% endhighlight %}
所以，可以得到一个判断是否当前是严格模式的表达式
{% highlight js %}
"use strict";
function isStrictMode() {
    return !this;
}

if (isStrictMode()) {
    // ...
}
{% endhighlight %}
### 后记
以上是我个人的理解，仅供参考，不一定讲得很对，欢迎指出我其中的错误，本人不甚感激。

### 参考
<http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/>

