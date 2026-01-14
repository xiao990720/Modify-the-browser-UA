// ==UserScript==
// @name        xxx网站安卓User-Agent适配
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  仅替换访问xxx网站的User-Agent，避免请求拦截冲突
// @author       Your Name
// @match        https://xxx.com.cn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 选择更通用的安卓User-Agent（避免太新的设备型号被网站拦截）
    const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36';

    // 1. 替换前端页面读取的 User-Agent
    Object.defineProperty(navigator, 'userAgent', {
        value: ANDROID_UA,
        writable: false,
        configurable: true
    });

    // 2. 轻量拦截 XMLHttpRequest 请求头（仅设置 User-Agent，不修改其他逻辑）
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'user-agent') {
            originalSetRequestHeader.call(this, header, ANDROID_UA);
        } else {
            originalSetRequestHeader.call(this, header, value);
        }
    };

    // 3. 轻量拦截 fetch 请求头
    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
        if (!init.headers) {
            init.headers = {};
        }
        // 兼容 Headers 对象和普通对象
        if (init.headers instanceof Headers) {
            init.headers.set('User-Agent', ANDROID_UA);
        } else {
            init.headers['User-Agent'] = ANDROID_UA;
        }
        return originalFetch.call(this, input, init);
    };

    console.log('✅ 安卓User-Agent已替换，当前UA：', ANDROID_UA);
})();