$(function() {
    $(document.forms['refreshForm']).submit(function() {
        exec(function refresh(time, url) {
            time = time || 6;
            url = url || window.location.href;
            setInterval(run, time * 1000);
            run();
            var doc = document.documentElement,
                height = doc.clientHeight,
                width = doc.clientWidth;
            function run() {
                body.innerHTML = '<iframe src="' + url +'" height="' + height + '" width="' + width + '" frameborder="0" allowtransparent="true" scrolling="yes"></iframe>';
            }
        }, [this.time.value.trim(), this.url.value.trim()]);
        window.close();
    });
    // 放到页面执行脚本
    function exec(fn, args) {
        if (args) {
            if (Object.prototype.toString.call(args) !== '[object Array]') {
                console.log('Error arguments for exec function:', args);
                args = '';
            } else {
                args = JSON.stringify(args);
                args = args.substring(1, args.length-1);
            }
        }
        // console.log(args);
        // console.log(fn.toString() + ';' + fn.name + '('+ args +');')
        chrome.tabs.executeScript(null, {
            code: fn.toString() + ';' + fn.name + '('+ args +');'
        });
    }
});
