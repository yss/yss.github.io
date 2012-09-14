$(function() {

function WritePoetry(elem, options) {
    elem = $(elem);
    if (!elem.length) return;
    var children = elem.children(),
        defaultConfig = {
            isLoop: true, // 是否循环显示
            scopeValue: 64, // 范围长度
            pos: 0, // 第一个运行的元素
            duration: 2000, // 动画持续时间
            delay: 2000, // 动画延迟时间
            easing: 'swing' // 动画函数
        };
    
    options = $.extend(options, defaultConfig);
    options._width = elem.outerWidth();
    options._height = elem.outerHeight();
    options.elems = elem.children();
    elem.css('position', 'relative');
    this.config = options;
    this.init();
    elem = null;
}
$.extend(WritePoetry.prototype, {

    /**
     * 获取在val范围内的随机值
     * @param {Number} val
     * @return {Number} range -val to val
     */
    _getDiff: function(val) {
        return parseInt(Math.random() * val, 10) * (Math.random() > 0.5 ? -1 : 1);
    },
    /**
     * 获取元素的随机顶点坐标
     * @param {Object} size 元素尺寸{ width: xxx, height: xxx }
     // * @param {Number} width 范围宽
     // * @param {Number} height 范围高
     * @return {Object} {left: xx, top: xxx}
     */
    _randomPos: function(size) {
        var config = this.config,
            width = config._width,
            height = config._height,
            scopeValue = config.scopeValue,
            diffWidth = this._getDiff(scopeValue),
            diffHeight = this._getDiff(scopeValue),
            o = {};
        if (diffWidth > 0) {
            o.left = width + diffWidth;
            if (diffHeight > 0) {
                o.top = height + diffHeight;
            } else {
                o.top = diffHeight - size.height;
            }
        } else {
            o.left = diffWidth - size.width;
            if (diffHeight > 0) {
                o.top = height + diffHeight;
            } else {
                o.top = diffHeight - size.height;
            }
        }
        return o;
    },
    /**
     * 
     * @param 
     * @return
     */
    run: function() {
        var _this = this,
            config = this.config,
            elems = config.elems;
        if (elems.length == config.pos) {
            if (config.isLoop) {
                config.pos = 0;
            } else {
                return;
            }
        }
        elems.eq(config.pos).animate(config._centerPos[config.pos], config.duration, config.easing, function() {
            var t = $(this);
            window.setTimeout(function() {
                t.animate($.extend(_this._randomPos(config._size[config.pos]), {opacity: 1}), config.duration, config.easing);
                config.pos++;
                _this.run();
            }, config.delay);
        });
    },
    /**
     * 初始化函数
     * @return
     */
    init: function() {
        var _this = this,
            config = this.config;
        
        // 每个元素的尺寸 保护高宽
        config._size = [],
        // 每个元素对应的居中尺寸
        config._centerPos = [];
        // 设置所有的元素为隐藏模式
        this.config.elems.css({
            opacity: 0,
            position: 'absolute'
        }).show().each(function(i) {
            var elem = $(this),
                width = elem.width(),
                height = elem.height(),
                o = {
                    width: width,
                    height: height
                };
            console.log(o);
            // 设置随机位置
            elem.css(_this._randomPos(o));
            config._size.push({
                width: width,
                height: height
            });
            config._centerPos.push({
                left: (config._width - width) / 2,
                top: (config._height - height) / 2,
                opacity: 1
            })
        });
        console.log(config);
        this.run();
    },
    /**
     * 
     * @param 
     * @return
     */
    xxx: function() {

    }
});

new WritePoetry('#rain-drops');

});
