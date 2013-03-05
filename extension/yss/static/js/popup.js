// 弹出层是否第一次执行
var POP_STATUS = true;
function showPop(startMsg, endMsg) {
    if (POP_STATUS) {
        POP_STATUS = false;
        exec(function showMsg(msg) {
            var popId = 'ys-pop';
                pop = document.getElementById(popId);
            if (!pop) {
                pop = document.createElement('div');
                pop.id = popId;
                pop.setAttribute('style', 'opacity:0; position:fixed; top:0; left:50%; margin-left:-100px; padding:5px 0; width:200px; line-height:1.5; text-align:center; font-size:16px; font-weight:bold; color:white; background:#009499; border:3px solid #3E4040; border-top:none; border-radius:0 0 5px 5px; -webkit-transition:all 1s ease-in;');
                document.body.appendChild(pop);
            }
            pop.innerHTML = startMsg;
            pop.style.opacity = 1;
            setTimeout(function() {
                endMsg && pop.innerHTML = endMsg;
                pop.style.opacity = 0;
            }, 3000);
        });
    }
    exec('showMsg("' + ('' + msg) + '");');
    
}
/**
 * 在当前页面执行给定的字符串
 * @param {String|Function|Object|Array} value
 * @param {Boolean} isClose [false]
 */
function exec(value, isClose) {
    if (typeof value === 'function') {
        value = value.toString();
    } else if (typeof value === 'object') {
        value = JSON.stringify(value);
    }

    if (value && typeof value !== 'string') {
        alert('Error params before exec');
    }

    chrome.tabs.executeScript(null, {
        code: value
    });
    // isClose && window.close();
}

/**
 * 执行函数方法
 * @param {String} fnName 函数名
 * @param {Any} args 注明：如果要传数组，则需要这样使用[[1,2,3]]
 * @param {String} assignName 变量名，用于当前函数赋值名
 */
function execFn(fnName, args, assignName) {
    var str = '';
    if (assignName) {
        str = assignName + '=';
    }

    if (args) {
        str += fnName + '(';
        if ($.isArray(args)) {
            str += arrayToArgs(args);
        } else {
            str += stringify(args);
        }
        str += ');';
        exec(str);
    }
}

function arrayToArgs(arr) {
    var str = '';
    if ($.isArray(arr)) {
        arr = arr.map(function(item) {
            return stringify(item);
        });
        return arr.join(',');
    }
    return str;
}

function stringify(any) {
    if (typeof any === 'function') {
        return any.toString();
    } else {
        return JSON.stringify(any);
    }
}

$(function() {
    // 用于interval返回值
    var NAME = 'REFRESH';
    $(document.forms['refreshForm']).submit(function() {
        exec(function refresh(time, url) {
            time = time || 6;
            url = url || window.location.href;
            var doc = document.documentElement,
                height = doc.clientHeight,
                width = doc.clientWidth;
            function run() {
                var frameId = 'ys-refresh-iframe',
                    frame = document.getElementById(frameId);
                if (!frame) {
                    document.body.innerHTML = '<div id="' + frameId + '"></div>';
                    frame = document.getElementById(frameId);
                }
                frame.innerHTML = '<iframe src="' + url +'" height="' + height + '" width="' + width + '" frameborder="0" allowtransparent="true" scrolling="yes"></iframe>';
            }
            run();
            return setInterval(run, time * 1000);
        });
        // exec(NAME + '=refresh(' + (this.time.value.trim() || '') + ',' + this.url.value.trim() + ');');
        execFn('refresh', [this.time.value.trim(), this.url.value.trim()], NAME);
        showPop('正在自动刷新中...');
    });

    $('#stop-refresh').click(function() {
        exec('clearInterval(' + NAME + ');');
        showPop('正在停止自动刷新中...');
    });
});
