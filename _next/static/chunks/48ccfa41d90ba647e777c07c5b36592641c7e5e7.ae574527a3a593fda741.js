(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[5],{"5F1B":function(t,e,n){t.exports={breadcrumbEntry:"p"}},"6sas":function(t,e,n){"use strict";n.d(e,"a",(function(){return W}));var r=n("KQm4"),a=n("o0o1"),u=n.n(a),o=n("HaE+"),c=n("ODXe"),i=n("q1tI"),s=n.n(i),f=n("YFqc"),l=n.n(f),p=n("P0ud");function m(t){var e,n,r="";if("string"===typeof t||"number"===typeof t)r+=t;else if("object"===typeof t)if(Array.isArray(t))for(e=0;e<t.length;e++)t[e]&&(n=m(t[e]))&&(r&&(r+=" "),r+=n);else for(e in t)t[e]&&(r&&(r+=" "),r+=e);return r}var b=function(){for(var t,e,n=0,r="";n<arguments.length;)(t=arguments[n++])&&(e=m(t))&&(r&&(r+=" "),r+=e);return r},d=n("5F1B"),v=n.n(d),h=s.a.createElement;function y(t,e){var n=e.indexOf(t),r=e.reduce((function(t,e,r){return r>n?t:t.concat(e.pathSegment)}),[]);return"".concat(r.join("/"))||"/"}var g={display:"Mixes",pathSegment:""};function j(t){var e=t.className,n=t.crumbs,r=[g].concat(n).map((function(t,e,n){return e===n.length-1?h("li",{key:t.pathSegment,className:v.a.breadcrumbEntry},t.display):h("li",{key:t.pathSegment,className:v.a.breadcrumbEntry},h(l.a,{href:y(t,n)},h("a",{className:"cursor-pointer border-b-2 border-transparent hover:border-focal"},t.display)))}),[]);return h("nav",null,h("ul",{className:b(e,"flex flex-row")},r))}var w=n("9/5/"),O=n.n(w),x=n("PSzL"),S=n.n(x),k=s.a.createElement,N=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],C=["arrows","stops","jumps","jacks","freezes","gallops","bpmShifts","shocks"],B=[{value:"title",label:"\u66f2\u540d"},{value:"artist",label:"\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8"},{value:"level",label:"\u96e3\u6613\u5ea6\u5024"},{value:"minBpm",label:"\u6700\u5c0fBPM"},{value:"maxBpm",label:"\u6700\u5927BPM"},{value:"arrows",label:"\u30b9\u30c6\u30c3\u30d7\u6570"},{value:"jumps",label:"\u30b8\u30e3\u30f3\u30d7"},{value:"jacks",label:"\u7e26\u9023"},{value:"freezes",label:"\u30d5\u30ea\u30fc\u30ba"},{value:"gallops",label:"\u30b9\u30ad\u30c3\u30d7"},{value:"stops",label:"\u505c\u6b62\u56de\u6570"},{value:"bpmShifts",label:"\u5909\u901f\u56de\u6570"},{value:"shocks",label:"\u30b7\u30e7\u30c3\u30af"}];var E=function(t){var e=t.filter,n=t.sortedBy,r=t.levelRange,a=t.hardestOnly,u=t.onChangeFilter,o=t.onChangeLevelRange,c=t.onChangeSortedBy,s=t.onChangeHardestOnly,f=Object(i.useState)(e),l=f[0],p=f[1],m=Object(i.useMemo)((function(){return O()(u,200)}),[u]),b=Object(i.useCallback)((function(t){p(t),m(t)}),[p,m]);return k("div",{className:S.a.filterContainer},k("div",null,"\u7d5e\u308a\u8fbc\u307f\uff1a",k("input",{type:"text",className:S.a.input,value:l,onChange:function(t){return b(t.target.value)}})),k("div",null,"\u4e26\u3079\u66ff\u3048\uff1a",k("select",{className:S.a.input,value:n,onChange:function(t){return c(t.target.value)}},B.map((function(t){return k("option",{key:t.value,value:t.value},t.label)})))),k("div",null,"\u30ec\u30d9\u30eb\uff1a",k("select",{className:S.a.input,value:r[0],onChange:function(t){return o([Number(t.target.value),r[1]])}},N.map((function(t){return t<=r[1]&&k("option",{key:t,value:t},t)})))," \u301c ",k("select",{className:S.a.input,value:r[1],onChange:function(t){return o([r[0],Number(t.target.value)])}},N.map((function(t){return r[0]<=t&&k("option",{key:t,value:t},t)})))),k("div",null,"\u6fc0\u9b3c\u306e\u307f\uff1a",k("input",{type:"checkbox",checked:a,onChange:function(t){return s(!!t.target.checked)}})))},A=n("Zd8l"),I=n("pEhc"),T=n("dWXJ"),M=n("NLPX"),D=n.n(M),F=s.a.createElement,L={beginner:"\u7fd2",basic:"\u697d",difficult:"\u8e0a",expert:"\u6fc0",challenge:"\u9b3c",edit:"\uff1f"},R=function(t){var e=t.titles,n=(t.totalTitleCount,t.getSortValueFunction),r=Object(i.useState)(),a=r[0],f=r[1],p=Object(i.useState)(),m=p[0],b=p[1],d=Object(A.a)(m),v=Object(c.a)(d,4),h=v[0],y=v[1],g=v[2],j=v[3],w=s.a.useCallback(function(){var t=Object(o.a)(u.a.mark((function t(e){var n,r,a,o,i;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(c.a)(e,3),r=n[0],a=n[1],o=n[2],t.next=3,fetch("/stepcharts/_data/".concat(r,"/").concat(a,"/").concat(o,".json"));case 3:return i=t.sent,t.next=6,Object(T.d)();case 6:return f([r,a,o]),t.t0=b,t.next=10,i.json();case 10:t.t1=t.sent,(0,t.t0)(t.t1);case 12:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[b]);return Object(i.useEffect)((function(){m&&g()}),[m]),F("div",null,F("table",{className:D.a.newTable},F("thead",null,F("tr",null,F("td",null,"\u8b5c\u9762"),F("td",null,"\u697d\u66f2"))),F("tbody",null,e.map((function(t){var e="/".concat(t.mixId,"/").concat(t.songId,"/").concat(t.difficulty),r=n(t),u=y&&a&&a[0]===t.mixId&&a[1]===t.songId&&a[2]===t.difficulty;return F("tr",{key:e,className:D.a.row},F("td",null,F(l.a,{href:e},F("a",{className:"".concat(D.a.difficulty," ").concat(D.a[t.difficulty])},L[t.difficulty],t.level))),F("td",null,u?F("button",{onClick:j},"\u23f9\ufe0f"):F("button",{onClick:function(){return w([t.mixId,t.songId,t.difficulty])}},"\u25b6\ufe0f")," ",F(l.a,{href:e},F("a",{className:D.a.title},t.title)),r&&F(l.a,{href:e},F("span",{className:D.a.sortValue},r))))})))),m&&F(I.a,{chart:m,offset:h}))};function W(t){var e=t.titles,n=t.crumbs,a=Object(i.useState)(B[0].value),u=a[0],o=a[1],c=Object(i.useState)(""),s=c[0],f=c[1],l=Object(i.useState)([N[0],N[N.length-1]]),m=l[0],b=l[1],d=Object(i.useState)(!0),v=d[0],h=d[1],y=Object(i.useMemo)((function(){var t=s.trim().toLowerCase().split(" "),n=e.filter((function(t){return m[0]<=t.level&&t.level<=m[1]}));return v&&(n=n.filter((function(t){return"expert"===t.difficulty||"challenge"===t.difficulty}))),s.trim()&&(n=n.filter((function(e){return t.every((function(t){return e.filterString.includes(t)}))}))),n}),[e,s,m,v]),g=Object(i.useMemo)((function(){return Object(r.a)(y).sort(function(t){switch(t){case"title":return function(t,e){return(t.titleTranslit||t.title).toLowerCase().localeCompare((e.titleTranslit||e.title).toLowerCase())};case"artist":return function(t,e){return t.artist.toLowerCase().localeCompare(e.artist)};case"minBpm":return function(t,e){return t.minBpm-e.minBpm};default:return function(e,n){var r=e[t];return n[t]-r}}}(u))}),[y,u]),w=Object(i.useMemo)((function(){return t=u,-1!==C.findIndex((function(e){return e===t}))?function(e){var n,r=e[t];return"".concat(r," ").concat((n=t,1===r?n.substring(0,n.length-1):n))}:"artist"===t?function(t){return t.artist}:"minBpm"===t||"maxBpm"===t?function(t){return(t.minBpm!==t.mainBpm?"(".concat(t.minBpm,")-"):"")+"".concat(t.mainBpm)+(t.maxBpm!==t.mainBpm?"-(".concat(t.maxBpm,")"):"")}:function(t){return null};var t}),[u]),O=F("div",{className:"my-6 ml-8"},e.length===g.length?F("span",null,"\u5168 ",e.length," \u8b5c\u9762"):F("span",null,F("span",{className:"font-bold"},g.length)," \u8b5c\u9762\u304c\u30de\u30c3\u30c1 ",F("span",{className:"text-focal-400"},"(",e.length," \u8b5c\u9762\u4e2d)")));return F(p.a,{title:"All Songs",subheading:n&&F(j,{crumbs:n}),metaDescription:"All ".concat(e.length," songs available at stepcharts.com")},F(E,{filter:s,sortedBy:u,levelRange:m,hardestOnly:v,onChangeFilter:f,onChangeLevelRange:b,onChangeSortedBy:o,onChangeHardestOnly:h}),O,F(R,{titles:g,totalTitleCount:e.length,getSortValueFunction:w}))}},"9/5/":function(t,e,n){(function(e){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,u=/^0o[0-7]+$/i,o=parseInt,c="object"==typeof e&&e&&e.Object===Object&&e,i="object"==typeof self&&self&&self.Object===Object&&self,s=c||i||Function("return this")(),f=Object.prototype.toString,l=Math.max,p=Math.min,m=function(){return s.Date.now()};function b(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function d(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==f.call(t)}(t))return NaN;if(b(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=b(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(n,"");var c=a.test(t);return c||u.test(t)?o(t.slice(2),c?2:8):r.test(t)?NaN:+t}t.exports=function(t,e,n){var r,a,u,o,c,i,s=0,f=!1,v=!1,h=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function y(e){var n=r,u=a;return r=a=void 0,s=e,o=t.apply(u,n)}function g(t){return s=t,c=setTimeout(w,e),f?y(t):o}function j(t){var n=t-i;return void 0===i||n>=e||n<0||v&&t-s>=u}function w(){var t=m();if(j(t))return O(t);c=setTimeout(w,function(t){var n=e-(t-i);return v?p(n,u-(t-s)):n}(t))}function O(t){return c=void 0,h&&r?y(t):(r=a=void 0,o)}function x(){var t=m(),n=j(t);if(r=arguments,a=this,i=t,n){if(void 0===c)return g(i);if(v)return c=setTimeout(w,e),y(i)}return void 0===c&&(c=setTimeout(w,e)),o}return e=d(e)||0,b(n)&&(f=!!n.leading,u=(v="maxWait"in n)?l(d(n.maxWait)||0,e):u,h="trailing"in n?!!n.trailing:h),x.cancel=function(){void 0!==c&&clearTimeout(c),s=0,r=i=a=c=void 0},x.flush=function(){return void 0===c?o:O(m())},x}}).call(this,n("yLpj"))},BsWD:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n("a3WO");function a(t,e){if(t){if("string"===typeof t)return Object(r.a)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(t,e):void 0}}},"HaE+":function(t,e,n){"use strict";function r(t,e,n,r,a,u,o){try{var c=t[u](o),i=c.value}catch(s){return void n(s)}c.done?e(i):Promise.resolve(i).then(r,a)}function a(t){return function(){var e=this,n=arguments;return new Promise((function(a,u){var o=t.apply(e,n);function c(t){r(o,a,u,c,i,"next",t)}function i(t){r(o,a,u,c,i,"throw",t)}c(void 0)}))}}n.d(e,"a",(function(){return a}))},KQm4:function(t,e,n){"use strict";n.d(e,"a",(function(){return u}));var r=n("a3WO");var a=n("BsWD");function u(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(a.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},NLPX:function(t,e,n){t.exports={newTable:"c",difficulty:"d",beginner:"e",basic:"f",difficult:"g",expert:"h",challenge:"i",edit:"j",sortValue:"k",title:"l"}},ODXe:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n("BsWD");function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,a=!1,u=void 0;try{for(var o,c=t[Symbol.iterator]();!(r=(o=c.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(i){a=!0,u=i}finally{try{r||null==c.return||c.return()}finally{if(a)throw u}}return n}}(t,e)||Object(r.a)(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},PSzL:function(t,e,n){t.exports={filterContainer:"q",input:"r"}},Zd8l:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n("ODXe"),a=n("q1tI"),u=n.n(a),o=n("KQm4"),c=function(t){var e=u.a.useRef(),n=u.a.useState(!1),a=Object(r.a)(n,2),c=a[0],i=a[1],s=u.a.useState(0),f=Object(r.a)(s,2),l=f[0],p=f[1],m=u.a.useRef(0),b=u.a.useMemo((function(){if(!t)return null;var e=function(t){var e=[].concat(Object(o.a)(t.bpm.map((function(t){return{offset:t.startOffset,bpm:t.bpm}}))),Object(o.a)(t.stops.map((function(t){return{offset:t.offset,stop:t.duration}})))).sort((function(t,e){return t.offset-e.offset})),n=[{time:0,offset:0,bpm:e.shift().bpm}];return e.forEach((function(t){var e=n[0].bpm,r=4*(t.offset-n[0].offset)/e*60,a=n[0].time+r;"bpm"in t?n.unshift({time:a,offset:t.offset,bpm:t.bpm}):(n.unshift({time:a,offset:t.offset,bpm:0}),n.unshift({time:a+t.stop,offset:t.offset,bpm:e}))})),n.reverse()}(t);return function(t){var n;for(n=m.current;e[n+1]&&e[n+1].time<t;n++);return m.current=n,(t-e[n].time)*e[n].bpm/60/4+e[n].offset}}),[t]),d=u.a.useCallback((function(){t&&(e.current=(new Date).getTime(),m.current=0,p(0),i(!0))}),[t,p,i]),v=u.a.useCallback((function(){i(!1)}),[p,i]);return u.a.useEffect((function(){v()}),[t,v]),function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},e=u.a.useRef();u.a.useEffect((function(){return e.current=requestAnimationFrame((function n(){e.current=requestAnimationFrame(n),t()})),function(){e.current&&cancelAnimationFrame(e.current)}}),[t])}(u.a.useCallback((function(){c&&b&&e.current&&p(b(((new Date).getTime()-e.current)/1e3))}),[b,c,p])),[l,c,d,v]}},a3WO:function(t,e,n){"use strict";function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n.d(e,"a",(function(){return r}))},dWXJ:function(t,e,n){"use strict";n.d(e,"b",(function(){return c})),n.d(e,"a",(function(){return i})),n.d(e,"c",(function(){return s})),n.d(e,"d",(function(){return p}));var r=n("o0o1"),a=n.n(r),u=n("ODXe"),o=n("HaE+"),c=null,i={tick:null,stop:null,bpm:null,shock:null,beat:null},s={normal:null,suppressed:null},f=[["normal",1],["suppressed",.25]],l=[["tick","/stepcharts/cursor12.mp3"],["stop","/stepcharts/cursor4.mp3"],["bpm","/stepcharts/cancel1.mp3"],["shock","/stepcharts/cursor7.mp3"],["beat","/stepcharts/cursor6.mp3"]],p=function(){var t=Object(o.a)(a.a.mark((function t(){var e;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(c){t.next=6;break}return e=new AudioContext,c=e,f.forEach((function(t){var n=Object(u.a)(t,2),r=n[0],a=n[1],o=new GainNode(e);o.gain.value=a,o.connect(e.destination),s[r]=o})),t.next=6,Promise.all(l.map(function(){var t=Object(o.a)(a.a.mark((function t(n){var r,o,c,s,f;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=Object(u.a)(n,2),o=r[0],c=r[1],t.next=3,fetch(c);case 3:return s=t.sent,t.next=6,s.arrayBuffer();case 6:return f=t.sent,t.next=9,e.decodeAudioData(f);case 9:i[o]=t.sent;case 10:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()));case 6:return t.abrupt("return",c);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()},o0o1:function(t,e,n){t.exports=n("ls82")},pEhc:function(t,e,n){"use strict";var r=n("q1tI"),a=n.n(r),u=n("dWXJ");e.a=function(t){var e=t.chart,n=t.offset,r=a.a.useRef(0),o=a.a.useRef(Math.floor(e.arrows[e.arrows.length-1].offset)+1);a.a.useEffect((function(){if(u.b&&u.a.beat&&u.c.suppressed&&o.current&&r.current<=n&&n<=o.current){var t=new AudioBufferSourceNode(u.b);t.buffer=u.a.beat,t.connect(u.c.suppressed),t.start(),r.current=n-n%.25+.25}}),[n]);var c=a.a.useRef(0);a.a.useEffect((function(){if(u.b&&u.a.tick&&u.a.shock&&u.c.normal&&u.c.suppressed&&e.arrows[c.current]&&e.arrows[c.current].offset<=n){var t,r=new AudioBufferSourceNode(u.b),a=e.arrows[c.current].direction.match(/M/),o=e.arrows[c.current].direction.match(/[12].*[12]/);if(r.buffer=a?u.a.shock:u.a.tick,r.connect(a?u.c.suppressed:u.c.normal),o){var i=new AudioBufferSourceNode(u.b);i.buffer=u.a.tick,i.connect(u.c.normal),i.start()}for(r.start(),t=c.current+1;e.arrows[t]&&e.arrows[t].offset<=n;t++);c.current=t}}),[n]);var i=a.a.useRef(0);a.a.useEffect((function(){if(u.b&&u.a.stop&&u.c.suppressed&&e.stops[i.current]&&e.stops[i.current].offset<=n){var t,r=new AudioBufferSourceNode(u.b);for(r.buffer=u.a.stop,r.connect(u.c.suppressed),r.start(),t=i.current+1;e.stops[t]&&e.stops[t].offset<=n;t++);i.current=t}}),[n]);var s=a.a.useRef(0);return a.a.useEffect((function(){n<s.current&&(r.current=n-n%.25,c.current=e.arrows.findIndex((function(t){return n<t.offset})),i.current=e.stops.findIndex((function(t){return n<t.offset}))),s.current=n}),[n,e]),null}},yLpj:function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(r){"object"===typeof window&&(n=window)}t.exports=n}}]);