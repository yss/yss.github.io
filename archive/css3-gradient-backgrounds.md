---
layout: blog
title: CSS3 Gradient Backgrounds
tags: 
summary: 
---
### Linear Gradient (Top → Bottom)
<div style="height:100px;background: -webkit-linear-gradient(top, #2F2727, #1a82f7);background: -moz-linear-gradient(top, #2F2727, #1a82f7);background: -ms-linear-gradient(top, #2F2727, #1a82f7);background: -o-linear-gradient(top, #2F2727, #1a82f7);"></div>
{% highlight css %}
#linearBg2 {
    /* fallback */
    background-color: #1a82f7;
    background: url(images/linear_bg_2.png);
    background-repeat: repeat-x;

    /* Safari 4-5, Chrome 1-9 */
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#1a82f7), to(#2F2727));

    /* Safari 5.1, Chrome 10+ */
    background: -webkit-linear-gradient(top, #2F2727, #1a82f7);

    /* Firefox 3.6+ */
    background: -moz-linear-gradient(top, #2F2727, #1a82f7);

    /* IE 10 */
    background: -ms-linear-gradient(top, #2F2727, #1a82f7);

    /* Opera 11.10+ */
    background: -o-linear-gradient(top, #2F2727, #1a82f7);
}
{% endhighlight %}
### Linear Gradient (Left → Right)
<div style="height:100px;background: -webkit-linear-gradient(left, #2F2727, #1a82f7);background: -moz-linear-gradient(left, #2F2727, #1a82f7);background: -ms-linear-gradient(left, #2F2727, #1a82f7);background: -o-linear-gradient(left, #2F2727, #1a82f7);"></div>
{% highlight css %}
#linearBg1 {
    /* fallback */
    background-color: #1a82f7;
    background-image: url(images/linear_bg_1.png);
    background-repeat: repeat-y;

    /* Safari 4-5, Chrome 1-9 */
    background: -webkit-gradient(linear, left top, right top, from(#1a82f7), to(#2F2727));

    /* Safari 5.1, Chrome 10+ */
    background: -webkit-linear-gradient(left, #2F2727, #1a82f7);

    /* Firefox 3.6+ */
    background: -moz-linear-gradient(left, #2F2727, #1a82f7);

    /* IE 10 */
    background: -ms-linear-gradient(left, #2F2727, #1a82f7);

    /* Opera 11.10+ */
    background: -o-linear-gradient(left, #2F2727, #1a82f7);
}
{% endhighlight %}
### Linear Gradient (with Even Stops)
<div style="height:100px;background: -webkit-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);background: -moz-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);background: -ms-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);background: -o-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);"></div>
{% highlight css %}
#even-stops {
    /* fallback DIY*/

    /* Safari 4-5, Chrome 1-9 */
    background: -webkit-gradient(linear, left top, right top, from(#2F2727), color-stop(0.25, #1a82f7), color-stop(0.5, #2F2727), color-stop(0.75, #1a82f7), to(#2F2727));

    /* Safari 5.1+, Chrome 10+ */
    background: -webkit-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);

    /* Firefox 3.6+ */
    background: -moz-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);

    /* IE 10 */
    background: -ms-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);

    /* Opera 11.10+ */
    background: -o-linear-gradient(left, #2F2727, #1a82f7, #2F2727, #1a82f7, #2F2727);
}
{% endhighlight %}
### Linear Gradient (with Specified Arbitrary Stops)
<div style="height:100px;background: -webkit-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);background: -moz-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);background: -ms-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);background: -o-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);"></div>
{% highlight css %}
#arbitrary-stops {
    /* fallback DIY*/

    /* Safari 4-5, Chrome 1-9 */
    background: -webkit-gradient(linear, left top, right top, from(#2F2727), color-stop(0.05, #1a82f7), color-stop(0.5, #2F2727), color-stop(0.95, #1a82f7), to(#2F2727));

    /* Safari 5.1+, Chrome 10+ */
    background: -webkit-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);

    /* Firefox 3.6+ */
    background: -moz-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);

    /* IE 10 */
    background: -ms-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);

    /* Opera 11.10+ */
    background: -o-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
}
{% endhighlight %}
### Radial Gradient (Centered, Full Size)
<div style="height:100px;background: -webkit-radial-gradient(circle, #1a82f7, #2F2727);background: -moz-radial-gradient(circle, #1a82f7, #2F2727);background: -ms-radial-gradient(circle, #1a82f7, #2F2727);"></div>
{% highlight css %}
#radial-center {
    /* fallback */
    background-color: #2F2727;
    background-image: url(images/radial_bg.png);
    background-position: center center;
    background-repeat: no-repeat;

    /* Safari 4-5, Chrome 1-9 */
    /* Can't specify a percentage size? Laaaaaame. */
    background: -webkit-gradient(radial, center center, 0, center center, 460, from(#1a82f7), to(#2F2727));

    /* Safari 5.1+, Chrome 10+ */
    background: -webkit-radial-gradient(circle, #1a82f7, #2F2727);

    /* Firefox 3.6+ */ 
    background: -moz-radial-gradient(circle, #1a82f7, #2F2727);

    /* IE 10 */ 
    background: -ms-radial-gradient(circle, #1a82f7, #2F2727);

    /* Opera cannot do radial gradients yet */
}
{% endhighlight %}
### Radial Gradient (Positioned, Sized)
<div style="height:100px;background: -webkit-gradient(radial, 80% 20%, 0, 80% 40%, 100, from(#1a82f7), to(#2F2727));background: -webkit-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);background: -moz-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);background: -ms-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);"></div>
{% highlight css %}
#radial-position {
    /* fallback */
    background-color: #2F2727;
    background-image: url(images/radial_fancy.png);
    background-position: 80% 20%;
    background-repeat: no-repeat;

    /* Safari 4-5, Chrome 1-9 */
    background: -webkit-gradient(radial, 80% 20%, 0, 80% 40%, 100, from(#1a82f7), to(#2F2727));

    /* Safari 5.1+, Chrome 10+ */
    background: -webkit-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);

    /* Firefox 3.6+ */ 
    background: -moz-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);

    /* IE 10 */
    background: -ms-radial-gradient(80% 20%, closest-corner, #1a82f7, #2F2727);

    /* Opera cannot do radial gradients yet */
}
{% endhighlight %}
