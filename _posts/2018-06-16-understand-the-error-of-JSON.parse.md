---
layout: blog
title: 细数JSON.parse的哪些个错误
tags: [JSON]
categories: [js]
summary: JSON.parse除了可以解析JSON串，还可以解析其他原始类型

---

我们知道`JSON.parse`方法是用来解析JSON字符串的。但是很少有人关注说它也可以解析其他原始类型数据。

另外，很多时候我们总是会有一些莫名其妙的错误，那么它是怎么回事呢？

### 使用

先说使用，`JSON.parse`除了说解析JSON字符串，它其实还可以解析其他原始类型数据，比如：

```js
JSON.parse('1');               //  1 数字
JSON.parse('"foo"');           // "foo" 字符串
JSON.parse('true');            // true Boolean类型
JSON.parse('{}');              // {} 对象
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"] 数组
JSON.parse('null');            // null
```

但是，我们很多在js的写法，它其实是不支持的。

### 错误情况

一种是字符串本身有语法错误，比如：
```js
JSON.parse('[1, 2, 3, ]'); // Uncaught SyntaxError: Unexpected token ] in JSON at position 10
JSON.parse('{ "boo": 2, }'); // Uncaught SyntaxError: Unexpected token } in JSON at position 12
```

另一种是本身不是字符串，比如：

```js
JSON.parse({}); // Uncaught SyntaxError: Unexpected token o in JSON at position 1
JSON.parse([]); // Uncaught SyntaxError: Unexpected end of JSON input
JSON.parse(''); // Uncaught SyntaxError: Unexpected end of JSON input
JSON.parse(); // Uncaught SyntaxError: Unexpected token u in JSON at position 0
```

这种情况，你会发现，当处理非字符串数据时，它会先把当前传递过来的是数据执行`toString`操作，之后再去解析。

这么一来你就能清楚的明白为什么是这样子的报错。

比如：`Uncaught SyntaxError: Unexpected token o in JSON at position 1` 这个就是执行了 `{}.toString()` 后，解析 `[Object Object]` 导致的。

至此，你看到类似JSON.parse的报错，你就可以第一时间知道它报错从原因了，然后直接去解决。