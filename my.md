---
layout: default
title: 首页 
---
<script type="text/template" id="poem-template">
<div id="writing" class="{cls}">
    <hgroup class="ignore">
        <h2>{name}</h2>
        <p>-- {author} --</p>
    </hgroup>
    {verse}
</div>
</script>
<script src="/static/js/jquery.min.js"></script>
<script src="/static/js/writePoetry.min.js?t=20120926"></script>
<script>
var poem = {
    name: "假如，生活欺骗了你",
    author: "普希金",
    verse: [
        "假如/生活欺骗了你，",
        "不要/悲伤，不要/心急!",
        "忧郁的/日子里需要镇静：",
        "相信吧，快乐的/日子/将会/来临。",
        "心儿/永远/向往着/未来；",
        "现在/却常是/忧郁。",
        "一切/都是/瞬息，",
        "一切/都将会/过去；",
        "而那/过去了的，",
        "就会成为/亲切的/怀恋。"
    ],
    cls: 'a-letter'
};
var shi = {
    name: "春江花月夜",
    author: "张若虚",
    verse: [
        "春江潮水连海平 海上明月共潮生",
        "滟滟随波千万里 何处春江无月明",
        "江流宛转绕芳甸 月照花林皆似霰",
        "空里流霜不觉飞 汀上白沙看不见",
        "江天一色无纤尘 皎皎空中孤月轮",
        "江畔何人初见月 江月何年初照人",
        "人生代代无穷已 江月年年只相似",
        "不知江月待何人 但见长江送流水",
        "白云一片去悠悠 青枫浦上不胜愁",
        "谁家今夜扁舟子 何处相思明月楼",
        "可怜楼上月徘徊 应照离人妆镜台",
        "玉户帘中卷不去 捣衣砧上拂还来",
        "此时相望不相闻 愿逐月华流照君",
        "鸿雁长飞光不度 鱼龙潜跃水成文",
        "昨夜闲潭梦落花 可怜春半不还家",
        "江水流春去欲尽 江潭落月复西斜",
        "斜月沉沉藏海雾 碣石潇湘无限路",
        "不知乘月几人归 落月摇情满江树"
    ],
    cls: 'a-letter a-desire'
};

insertData(Math.random() > 0.5 ? poem : shi);
var wp = $.writePoetry('#writing', {ignoreClass: '.ignore'});

function insertData(words) {
    words.verse = '<p>' + words.verse.join('</p><p>') + '</p>';
    var content = $('#poem-template').html().replace(/\{(\w+)\}/g, function($0, $1) {
        return words[$1] || $1;
    });
    $('#bd').html(content);
}
</script>
