---
layout: blog
title: 异步 JS 加载报错的解决
tags: [js]
categories: [js]
summary: 异步加载 js 出错后的重试

---
# 问题

目前我们在做一个事情，就是全公司内推广使用我们的资源重试方案：@yuanfudao/resource-retry

我们目前已经解决了的是，CSS、图片、视频的重试。但是 JS 重试依旧不够好。

目前我们能做的处理就是，在入口 JS 上出错的时候，重新创建一个新的 Script 标签，然后再加载源 JS。

但我们没有能处理的是在代码里异步的逻辑。

# 困难

首先，异步 js 都是和代码紧密相连的。

再则，异步的处理方式千差万别，但好在的一点是绝大部分团队都是使用 webpack 的异步。

那么我们针对异步加载的 js 失败情况，能否做到无侵入式的重试呢？

# 尝试

我们知道，不管哪种异步方式加载 js 代码，最终它都需要试用 `document.createElement`。

那我们是不是可以拦截这个方法，加上代理，然后出错的时候优先执行我们的重试逻辑呢？

但不幸的是，理想很丰满，现实很骨感。

原因是 DOM API 对参数有严格的校验，无论你使用的是原型链继承，还是 Proxy
 扩展 HTMLElement 都是无法正常使用的。

 ### 查找

 通过搜索找到了一个库：https://github.com/Nikaple/assets-retry

 然后，发现它也是用的这思路。

 但是，它的解决方式就很粗暴了，直接把所有的 DOM API 覆盖掉，然后重写 document.createElement('script')，返回的是一个 PlainObject。

 接着把原生的 HTMLScriptElement 挂载到 innerProxyProp 这个属性值上。

 最后，再覆盖掉所有的 Node.prototype 和 Element.prototype 上的方法。

 ```js
/**
 * create a hooked function which hooks every method of target.
 * if a method is hooked and its arguments contains the inner script tag
 * it will be replaced with the value of inner script tag
 *
 * @param {any} target hook target
 */
const hookPrototype = function(target: any) {
/*
> Object.keys(Node.prototype)
(47) ["nodeType", "nodeName", "baseURI", "isConnected", "ownerDocument", "parentNode", "parentElement", "childNodes", "firstChild", "lastChild", "previousSibling", "nextSibling", "nodeValue", "textContent", "ELEMENT_NODE", "ATTRIBUTE_NODE", "TEXT_NODE", "CDATA_SECTION_NODE", "ENTITY_REFERENCE_NODE", "ENTITY_NODE", "PROCESSING_INSTRUCTION_NODE", "COMMENT_NODE", "DOCUMENT_NODE", "DOCUMENT_TYPE_NODE", "DOCUMENT_FRAGMENT_NODE", "NOTATION_NODE", "DOCUMENT_POSITION_DISCONNECTED", "DOCUMENT_POSITION_PRECEDING", "DOCUMENT_POSITION_FOLLOWING", "DOCUMENT_POSITION_CONTAINS", "DOCUMENT_POSITION_CONTAINED_BY", "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", "appendChild", "cloneNode", "compareDocumentPosition", "contains", "getRootNode", "hasChildNodes", "insertBefore", "isDefaultNamespace", "isEqualNode", "isSameNode", "lookupNamespaceURI", "lookupPrefix", "normalize", "removeChild", "replaceChild"]
> Object.keys(Element.prototype)
(129) ["namespaceURI", "prefix", "localName", "tagName", "id", "className", "classList", "slot", "attributes", "shadowRoot", "part", "assignedSlot", "innerHTML", "outerHTML", "scrollTop", "scrollLeft", "scrollWidth", "scrollHeight", "clientTop", "clientLeft", "clientWidth", "clientHeight", "attributeStyleMap", "onbeforecopy", "onbeforecut", "onbeforepaste", "onsearch", "elementTiming", "onfullscreenchange", "onfullscreenerror", "onwebkitfullscreenchange", "onwebkitfullscreenerror", "children", "firstElementChild", "lastElementChild", "childElementCount", "previousElementSibling", "nextElementSibling", "after", "animate", "append", "attachShadow", "before", "closest", "computedStyleMap", "getAttribute", "getAttributeNS", "getAttributeNames", "getAttributeNode", "getAttributeNodeNS", "getBoundingClientRect", "getClientRects", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS", "hasAttribute", "hasAttributeNS", "hasAttributes", "hasPointerCapture", "insertAdjacentElement", "insertAdjacentHTML", "insertAdjacentText", "matches", "prepend", "querySelector", "querySelectorAll", "releasePointerCapture", "remove", "removeAttribute", "removeAttributeNS", "removeAttributeNode", "replaceChildren", "replaceWith", "requestFullscreen", "requestPointerLock", "scroll", "scrollBy", "scrollIntoView", "scrollIntoViewIfNeeded", "scrollTo", "setAttribute", "setAttributeNS", "setAttributeNode", "setAttributeNodeNS", "setPointerCapture", "toggleAttribute", "webkitMatchesSelector", "webkitRequestFullScreen", "webkitRequestFullscreen", "ariaAtomic", "ariaAutoComplete", "ariaBusy", "ariaChecked", "ariaColCount", "ariaColIndex", "ariaColSpan", "ariaCurrent", "ariaDescription", "ariaDisabled", "ariaExpanded", …]
*/
    const functionKeys = Object.keys(target).filter(key => isFunctionProperty(target, key))
    functionKeys.forEach(key => {
        const originalFunc = target[key]
        target[key] = function(): any {
            const args = [].slice.call(arguments).map((item: any) => {
                if (!item) return item
                return hasOwn.call(item, innerProxyProp) ? item[innerProxyProp] : item
            })
            return originalFunc.apply(this, args)
        }
    })
}
/**
 * init asynchronous retrying of script tags
 * @param {InnerAssetsRetryOptions} opts
 * @returns
 */
export default function initAsync(opts: InnerAssetsRetryOptions) {
    hookCreateElement(opts)
    // eslint-disable-next-line
    if (typeof Node !== 'undefined') {
        hookPrototype(Node.prototype)
    }
    // eslint-disable-next-line
    if (typeof Element !== 'undefined') {
        hookPrototype(Element.prototype)
    }
    return retryCollector
}
 ```

一顿操作下来不得不佩服作者这个脑洞，实在是太大了。

但是改动影响太大了，内心是惶恐的，这要是出个问题就是大问题啊。

# 侵入的方式

实在是没法接受上面的那一顿魔改方式，所以还是拾起来代码侵入的方式。

我们现在绝大部分项目都是使用的 webpack 打包，webpack 下都是使用的 `import('xxx').then(fn)` 的方式动态加载 js。

那么我们可以多加一层 `import('xxx').catch(retry).then(fn)`

我们只需要在 catch 这一层来处理重试。

但又遇到一个问题，我们没法拿到最终这个 xxx chunk 的 url，不过好在 webpack 提供了 `__webpack_public_path__` 值来修改 CDN 域名。

这样一来就有了下面这段重试代码：

```js
/**
 * retry(()=>import())
 * @param {*} importFn () => import()
 */
export default function retry(
  importFn,
  { originalPublicPath, lastPublicPath, retryTimes } = {}
) {
  return importFn().catch((e) => {
    const publicPath = lastPublicPath || __webpack_public_path__;
    originalPublicPath = originalPublicPath || publicPath;
 
    let url;
    try {
      url = new URL(publicPath);
    } catch {
      url = new URL(location.origin + publicPath);
    }
    const domain = url.host;
 
    let index = domains.indexOf(domain);
    if (index !== -1 && index !== domains.length - 1) {
      const nextDomain = domains[index + 1];
      url.host = nextDomain;
      const nextPublicPath = url.href;
      __webpack_public_path__ = nextPublicPath;
      const retryPromise = retry(importFn, {
        originalPublicPath,
        lastPublicPath: nextPublicPath,
        retryTimes: (retryTimes || 0) + 1,
      });
      __webpack_public_path__ = originalPublicPath;
      return retryPromise;
    }
 
    throw e;
  });
}
```
# 总结

要想完全无侵入式的方式引入就要付出很大的代价，就看这个代价能不能接受。

但在实际情况下，不同的应用场景，特别是重大的生成环境，我们通常会选择一个更折中的方案。
