// ==UserScript==
// @name        oSafety
// @namespace   Oldsquaw
// @match       *://*.codemao.cn/*
// @match       *://codemao.cn/*
// @match       https://s.oldsquaw.cn/us/api/*
// @match       https://s.oldsquaw.cn/us/*
// @match       https://*.oldsquaw.cn/*
// @grant       none
// @version     alpha
// @author      UNBOUNDED - Oldsquaw
// @description 奥德思阔 oSafety，为您的安全保驾护航。
// ==/UserScript==

/*
    Copyright (C) 2024  Oldsquaw

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


(function() {
    'use strict';

    function unsafeRequestBlockNotice() {
        window.open('https://file.oldsquaw.cn/Main/oSafety_webPageFiles/unsafeRequestNotice.md', '_blank', 'width=800,height=600');
    }

    // 等待页面加载完成
    /*
    window.addEventListener('load', function() {
        if (window.location.href.includes('*.codemao.cn')) {
            // 检测是否存在特定标签
            const tagsToCheck = ['embed', 'iframe'];
            tagsToCheck.forEach(tag => {
                if (document.querySelector(tag)) {
                    unsafeRequestBlockNotice();
                } else {
                    console.log(`[oSafety] 未检测到危险 iFrame。`);
                }
            });
            tagsToCheck.forEach(tag => {
                const elements = document.querySelectorAll(tag);
                elements.forEach(element => {
                    element.remove();
                });
            });
        }
    });
    */

    // 重写 XMLHttpRequest
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            if (url.includes('top.codemao.cn')) {
                unsafeRequestBlockNotice();
                arguments[1] = 'https://file.oldsquaw.cn/Main/oSafety_webPageFiles/topSiteBlockedNotice.md';
            }
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // 重写 fetch API
    (function(fetch) {
        window.fetch = function() {
            unsafeRequestBlockNotice();
            arguments[0] = arguments[0].includes('top.codemao.cn') ? 'https://file.oldsquaw.cn/Main/oSafety_webPageFiles/topSiteBlockedNotice.md' : arguments[0];
            return fetch.apply(this, arguments);
        };
    })(window.fetch);

    // 拦截直接访问
    if (window.location.href.includes('top.codemao.cn')) {
        unsafeRequestBlockNotice();
        window.location.href = 'https://file.oldsquaw.cn/Main/oSafety_webPageFiles/topSiteBlockedNotice.md';
    }

    // 拦截改云相关 WebSocket

    // 保存原始的 WebSocket 构造函数
    const OriginalWebSocket = window.WebSocket;

    // 重写 WebSocket 构造函数
    window.WebSocket = function(url, protocols) {
        // 检查 URL 是否包含特定字符串
        if (url.includes('ws://socketcv.codemao.cn:9096')) {
            unsafeRequestBlockNotice()
            console.error('Blocked WebSocket connection to:', url);
            throw new Error('OSafety 拦截危险 WebSocket：改云。');
        }
        return new OriginalWebSocket(url, protocols);
    };

    // 复制 WebSocket 的属性和方法
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
})();
