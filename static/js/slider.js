/**
 * slider for blog
 * found h2, h3 ..., h3 ..., h3 ..
 */
(function($, win) {
    function Slider(elem, options) {
        elem = $(elem);
        if (!elem.length) return;
        if (!(this instanceof Slider)) return new Slider(elem, options);
        var defaultOptions = {
            title: 'h2',
            subTitle: 'h3',
            packageClass: 'item',
            /*
            headHtml: '',
            footHtml: '',
            */
            elem: elem,
            currPos: 0
        };
        elem.css('position', 'relative');
        $.extend(defaultOptions, options);
        if (!defaultOptions.width) {
            defaultOptions.width = elem.width();
        }
        this.config = defaultOptions;
        this.init();
        return this;
    }

    $.extend(Slider.prototype, {
        /*
        setBody: function() {
            var config = this.config;
            if (config.headHtml) {
                $(headHtml).insertBefore(config.elem);
            }
            if (config.footHtml) {
                $(footHtml).insertAfter(config.elem);
            }
        },
        */

        package: function() {
            var config = this.config,
                title = config.title + ',' + config.subTitle,
                itemClass = config.packageClass,
                elem = config.elem,
                elems = elem.children(),
                len = elems.length,
                cell = [],
                collector, i = j = 0;
            
            for (; i < len; i++) {
                if (!cell[j]) {
                    cell[j] = [];
                }
                cell[j].push(i);
                if (elems.eq(i).is(title)) {
                    j++;
                }
            }
            len = cell.length;
            i = 0;
            while(len--) {
                $('<div/>').addClass(itemClass).css({
                    position: 'absolute',
                    background: '#fff',
                    zoom: 1,
                    left: 0,
                    zIndex: ++i,
                    width: '100%',
                    height: '100%'
                }).append(elems.slice(cell[len][0], cell[len][cell[len].length - 1] + 1)).prependTo(elem);
            }

            config.items = elem.children();
        },

        run: function() {
            var _this = this,
                config = this.config,
                items = config.elem.children();
            $(win).bind('mousewheel', function(e) {
                var delta = e.originalEvent.wheelDelta;
                if (delta > 119) {
                    _this.showPrev();
                } else if (delta < -119) {
                    _this.showNext();
                }
            }).keyup(function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 37 || keyCode === 38) {
                    _this.showPrev();
                } else if (keyCode === 39 || keyCode === 40) {
                    _this.showNext();
                }
                return false;
            });
        },
        
        showPrev: function() {
            var config = this.config;
            if (config.currPos > 0) {
                config.currPos--;
            }
            this.show(-1);
        },

        showNext: function() {
            var config = this.config,
                max = config.items.length;
            if (config.currPos >= 0) {
                if (config.currPos < max - 1) {
                    config.currPos++;
                } else {
                    config.currPos = max;
                }
            }
            this.show(1);
        },

        show: function(diff) {
            var config = this.config,
                currPos = config.currPos,
                items = config.items,
                len = items.length;
            if (diff && currPos > 0 && currPos < len) {
                items.eq(currPos + diff).css({
                    left: config.width * diff,
                    zIndex: len+1
                }).animate({ left: 0}, 2000, function() {
                    $(this).css('zIndex', len)[diff > 0 ? 'next' : 'prev']().css('zIndex', 1);
                });
            }
        },

        init: function() {
            this.package();
            this.run();
        }
    });

$.slider = Slider;

})(jQuery, window);
