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
    options._width = parseInt(elem.outerWidth()/2, 10);
    options._height = parseInt(elem.outerHeight()/2, 10);
    options.elems = elem.children();
    elem.css('position', 'relative');
    this.config = options;
    this.elem = elem;
    this.init();
}
$.extend(WritePoetry.prototype, {

    /**
     * 获取在-val 到 val范围内的随机值
     * @param {Number} val
     * @return {Number} range -val to val
     */
    _getDiff: function(val) {
        return Math.round((val + val) * Math.random()) - val;
    },
    /**
     * 获取元素的随机顶点坐标
     * @param {Object} size 元素尺寸{ width: xxx, height: xxx }
     * @return {Object} {left: xx, top: xxx}
     */
    _randomPos: function(size) {
        var config = this.config,
            width = config._width,
            height = config._height,
            scopeValue = config.scopeValue,
            diffWidth = this._getDiff(scopeValue + width),
            diffHeight = this._getDiff(scopeValue + height);
        if (diffWidth < 0) {
            diffWidth -= size.width;
        } else {
            diffHeight -= size.height;
        }
        return {
            left: diffWidth + width,
            top: diffHeight + height
        }
    },
    /**
     * 运行动画函数（依赖于config）
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
                t.animate($.extend(_this._randomPos(config._size[config.pos]), {opacity: 0}), config.duration, config.easing);
                config.pos++;
                _this.run();
            }, config.delay);
        });
    },
    /**
     * 处理数据，也可用于追加数据，对数据进行扩展
     * @param {jQuery} elems
     * @return
     */
    appendData: function(elems) {
        elems = $(elems);
        if (elems.length) {
            this.initData(elems);
            elems.appendTo(this.elem);
        }
    },
    /**
     * 初始化数据
     * @param {jQuery} elems
     * @return
     */
    initData: function(elems) {
        elems = elems || this.config.elems;
        // 设置所有的元素为隐藏模式
        elems.css({
            position: 'absolute',
            opacity: 0
        }).show();
        this._position(elems);
    },
    /**
     * 数据定位，用于第一次加入数据，随机排列数据
     * @param 
     * @return
     */
    _position: function(elems) {
        var _this = this,
            config = _this.config;

        $(elems).each(function() {
            var elem = $(this),
                width = elem.width(),
                height = elem.height(),
                o = {
                    width: width,
                    height: height
                };
            // 设置随机位置
            elem.css(_this._randomPos(o));
            config._size.push({
                width: width,
                height: height
            });
            config._centerPos.push({
                left: config._width - width / 2,
                top: config._height - height / 2,
                opacity: 1
            })
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
        this.initData();
        this.run();
    }
});

new WritePoetry('#rain-drops');

});
