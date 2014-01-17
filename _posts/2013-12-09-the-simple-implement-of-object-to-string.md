---
layout: blog
title: 简单的object to string方法
tags: [objecttostring]
categories: [js]
summary: 除了JSON.stringify，我们也可以自己简单的写一个
---

自己好早之前写过这个方法。但今天突然发现更简短一些。

然后就有了下面这段代码：

{% highlight js %}
function stringify(o) {
    var r, i, len;
    if(o === null) {
        return 'null';
    } else if (o === undefined) {
        return 'undefined';
    } else if(typeof o === 'string'){
        return '"' + o + '"';
    } else if(typeof o === 'object'){
        // no array
        if (!o.sort) {
            r = ['{'];
            for(i in o){
                r.push('"', i, '":', stringify(o[i]), ',');
            }
            r.pop();
            r.push('}');
        } else {
            r = ['['];
            for(i =0, len = o.length;i < len; ++i){
                r.push(stringify(o[i]), ',');
            }
            if (len) {
                r.pop();
            }
            r.push(']');
        }
        return r.join('');
    }
    return o.toString();
}
{% endhighlight %}
