---
layout: blog
title: 使用mocha写测试用例
tags: [mocha, 测试]
categories: [js]
summary: 让我们来看看mocha的力量吧
---
### mocha是什么

    A feature-rich JavaScript test framework.

mocha是一个javascript的测试框架。可以同时在nodejs和浏览器环境使用。

不过反过来说，基本nodejs相关的应用都能在服务器环境和浏览器环境跑。

### 写法

我们谈谈mocha的三个写法：

#### BDD

{% highlight js %}
describe(“Array”, function() {
    describe(“#indexOf()”, function() {
        it(“Should return -1”, function () {
            assert.equal(-1, [1,2,3].indexOf(0));
        }
    });
});
{% endhighlight %}

#### TDD

{% highlight js %}
suite(“Array”, function() {
    suite(“#indexOf()”, function() {
        test(“Should return -1”, function () {
            assert.equal(-1, [1,2,3].indexOf(0));
        }
    });
});
{% endhighlight %}

#### exports

{% highlight js %}
module.exports = {
    “Array”: {
        “#indexOf()”: {
            “Should return -1”: function () {
                assert.equal(-1, [1,2,3].indexOf(0));
            }
        }
    }
};
{% endhighlight %}

### 核心

其实说来说去，所有的测试框架核心都是一点：`Catch Exceptions`。

记住了这一点就行了。

### Assertion

主要是下面三个：

1. should.js
2. chai.js
3. expect.js

具体可以根据自己的需要去用。但本质就是写法上的区别。个人推荐使用should.js。

### Best Practices

现在我要说一个，最佳实践。用也把它用好来，不是吗？

{% highlight bash %}
-- test/
  -- mocha.opts
  -- xxx.js
{% endhighlight %}

### Browser support

{% highlight bash %}
# 目录结构，依次忘下：
mocha.css
mocha.js
should.js
mocha.setup(‘bdd’)
yourtest.js
mocha.run()
{% endhighlight %}

### Two Examples

{% highlight js %}

#### timeout

describe(“Array”, function() {
    describe(“#indexOf()”, function() {
        it(“Should return -1”, function (done) {
            setTimeout(function() {
                assert.equal(-1, [1,2,3].indexOf(0));
                done();
            }, 1000);
        }
    });
});
{% endhighlight %}

这里需要说明的一点是，mocha最大给定的timeout时间是2000ms。

so，如果你运行的程序超过2s请，加一句：`this.timeout(maxTime)`;

#### async

the same as `timeout`
