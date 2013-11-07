---
layout: demo
title: love
categories: [demo]
tags: [jekyll, _config.yml]
summary: 
---
<style type="text/css">
#love {
    position:relative;
    margin: 30px auto;
    padding: 30px;
    width: 520px;
    height: 520px;
    -webkit-transition: all 20s linear;
    -moz-transition: all 20s linear;
    transition: all 20s linear;
    font: bold 54px/173px Arial;
    text-align: center;
    background-color: #ff0;
    -webkit-transform: rotateX(90deg);
    -moz-transform: rotateX(90deg);
    transform: rotateX(90deg);
}
#love.animate {
    -webkit-transform: rotateX(0);
    -moz-transform: rotateX(0);
    transform: rotateX(0);
}
</style>
<p id="love">I<br>LOVE<br>U</p>
<script>
setTimeout(function() {
    document.getElementById('love').className = 'animate';
})
</script>
