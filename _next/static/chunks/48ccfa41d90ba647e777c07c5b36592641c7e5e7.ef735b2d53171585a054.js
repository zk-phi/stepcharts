(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[5],{"5F1B":function(e,t,n){e.exports={breadcrumb:"q",breadcrumbEntry:"r",breadcrumbEntryLink:"s"}},"6sas":function(e,t,n){"use strict";n.d(t,"a",(function(){return D}));var r=n("KQm4"),a=n("o0o1"),u=n.n(a),c=n("HaE+"),i=n("ODXe"),o=n("q1tI"),l=n.n(o),s=n("YFqc"),f=n.n(s),m=n("P0ud"),b=n("5F1B"),p=n.n(b),d=l.a.createElement;function v(e,t){var n=t.indexOf(e),r=t.reduce((function(e,t,r){return r>n?e:e.concat(t.pathSegment)}),[]);return"".concat(r.join("/"))||"/"}var h={display:"Top",pathSegment:""};function y(e){e.className;var t=e.crumbs,n=[h].concat(t).map((function(e,t,n){return t===n.length-1?d("li",{key:e.pathSegment,className:p.a.breadcrumbEntry},e.display):d("li",{key:e.pathSegment,className:p.a.breadcrumbEntry},d(f.a,{href:v(e,n)},d("a",{className:p.a.breadcrumbEntryLink},e.display)))}),[]);return d("nav",null,d("ul",{className:p.a.breadcrumb},n))}var g=n("9/5/"),j=n.n(g),w=n("CfLu"),O=n.n(w),k=l.a.createElement,x=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],C=["arrows","stops","jumps","jacks","freezes","gallops","bpmShifts","shocks","sixteenths","trips","complexity"],T=[{value:"title",label:"\u66f2\u540d"},{value:"artist",label:"\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8"},{value:"level",label:"\u96e3\u6613\u5ea6\u5024"},{value:"",label:"-- BPM\u95a2\u9023 --",disabled:!0},{value:"mainBpm",label:"\u30e1\u30a4\u30f3BPM"},{value:"minBpm",label:"\u6700\u5c0fBPM"},{value:"maxBpm",label:"\u6700\u5927BPM"},{value:"stops",label:"\u505c\u6b62\u56de\u6570"},{value:"bpmShifts",label:"\u5909\u901f\u56de\u6570"},{value:"",label:"-- \u8b5c\u9762\u306e\u7279\u5fb4 --",disabled:!0},{value:"arrows",label:"\u30b9\u30c6\u30c3\u30d7\u6570"},{value:"jumps",label:"\u30b8\u30e3\u30f3\u30d7"},{value:"jacks",label:"\u7e26\u9023"},{value:"freezes",label:"\u30d5\u30ea\u30fc\u30ba"},{value:"gallops",label:"\u30b9\u30ad\u30c3\u30d7"},{value:"shocks",label:"\u30b7\u30e7\u30c3\u30af"},{value:"sixteenths",label:"\u9ec4\u77e2\u5370%"},{value:"trips",label:"\u7dd1\u77e2\u5370%"},{value:"",label:"-- \u305d\u306e\u4ed6 --",disabled:!0},{value:"complexity",label:"\u30ea\u30ba\u30e0\u96e3\u6307\u6570(\u4eee)"}];var S=function(e){var t=e.filter,n=e.sortedBy,r=e.levelRange,a=e.hardestOnly,u=e.onChangeFilter,c=e.onChangeLevelRange,i=e.onChangeSortedBy,l=e.onChangeHardestOnly,s=Object(o.useState)(t),f=s[0],m=s[1],b=Object(o.useMemo)((function(){return j()(u,200)}),[u]),p=Object(o.useCallback)((function(e){m(e),b(e)}),[m,b]);return k("div",{className:O.a.filterContainer},k("div",null,"\u7d5e\u308a\u8fbc\u307f\uff1a",k("input",{type:"text",className:O.a.input,value:f,onChange:function(e){return p(e.target.value)}})),k("div",null,"\u4e26\u3079\u66ff\u3048\uff1a",k("select",{className:O.a.input,value:n,onChange:function(e){return i(e.target.value)}},T.map((function(e){return k("option",{key:e.value,value:e.value,disabled:e.disabled},e.label)})))),k("div",null,"\u30ec\u30d9\u30eb\uff1a",k("select",{className:O.a.input,value:r[0],onChange:function(e){return c([Number(e.target.value),r[1]])}},x.map((function(e){return e<=r[1]&&k("option",{key:e,value:e},e)})))," \u301c ",k("select",{className:O.a.input,value:r[1],onChange:function(e){return c([r[0],Number(e.target.value)])}},x.map((function(e){return r[0]<=e&&k("option",{key:e,value:e},e)})))),k("div",null,"\u6fc0\u9b3c\u306e\u307f\uff1a",k("input",{type:"checkbox",checked:a,onChange:function(e){return l(!!e.target.checked)}})))},B=n("Zd8l"),N=n("JePm"),E=n("dWXJ"),I=n("NLPX"),M=n.n(I),A=l.a.createElement,R={beginner:"\u7fd2",basic:"\u697d",difficult:"\u8e0a",expert:"\u6fc0",challenge:"\u9b3c",edit:"\uff1f"},L=function(e){var t=e.titles,n=(e.totalTitleCount,e.getSortValueFunction),r=Object(o.useState)(),a=r[0],s=r[1],m=Object(o.useState)(),b=m[0],p=m[1],d=Object(B.a)(b),v=Object(i.a)(d,5),h=v[0],y=v[1],g=v[2],j=v[3],w=v[4],O=l.a.useMemo((function(){return!!b&&b.arrowTimeline.reduce((function(e,t){return e+(4===t.beat?1:0)}),0)>=b.arrowTimeline.length/4}),[b]),k=l.a.useCallback(function(){var e=Object(c.a)(u.a.mark((function e(t){var n,r,a,c,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(i.a)(t,3),r=n[0],a=n[1],c=n[2],e.next=3,fetch("/stepcharts/_data/".concat(r,"/").concat(a,"/").concat(c,".json"));case 3:return o=e.sent,e.next=6,Object(E.d)();case 6:return s([r,a,c]),e.t0=p,e.next=10,o.json();case 10:e.t1=e.sent.chart,(0,e.t0)(e.t1);case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[p]);return Object(o.useEffect)((function(){b&&j()}),[b]),A("div",null,A("table",{className:M.a.newTable},A("thead",null,A("tr",null,A("td",null,"\u8b5c\u9762"),A("td",null,"\u697d\u66f2"))),A("tbody",null,t.map((function(e){var t="/".concat(e.mixId,"/").concat(e.songId,"/").concat(e.difficulty),r=n(e),u=g&&a&&a[0]===e.mixId&&a[1]===e.songId&&a[2]===e.difficulty;return A("tr",{key:t,className:M.a.row},A("td",null,A(f.a,{href:t},A("a",{className:"".concat(M.a.difficulty," ").concat(M.a[e.difficulty])},R[e.difficulty],e.level))),A("td",null,u?A("button",{onClick:w},"\u23f9\ufe0f"):A("button",{onClick:function(){return k([e.mixId,e.songId,e.difficulty])}},"\u25b6\ufe0f")," ",A(f.a,{href:t},A("a",{className:M.a.title},e.title)),r&&A(f.a,{href:t},A("span",{className:M.a.sortValue},r))))})))),b&&A(N.a,{chart:b,offsetRef:h,timeRef:y,enableBeatTick:O}))};function D(e){var t=e.titles,n=e.crumbs,a=Object(o.useState)(T[0].value),u=a[0],c=a[1],i=Object(o.useState)(""),l=i[0],s=i[1],f=Object(o.useState)([x[0],x[x.length-1]]),b=f[0],p=f[1],d=Object(o.useState)(!0),v=d[0],h=d[1],g=Object(o.useMemo)((function(){var e=l.trim().toLowerCase().split(" "),n=t.filter((function(e){return b[0]<=e.level&&e.level<=b[1]}));return v&&(n=n.filter((function(e){return"expert"===e.difficulty||"challenge"===e.difficulty}))),l.trim()&&(n=n.filter((function(t){return e.every((function(e){return t.filterString.includes(e)}))}))),n}),[t,l,b,v]),j=Object(o.useMemo)((function(){return Object(r.a)(g).sort(function(e){switch(e){case"title":return function(e,t){return(e.titleTranslit||e.title).toLowerCase().localeCompare((t.titleTranslit||t.title).toLowerCase())};case"artist":return function(e,t){var n;return(null!==(n=e.artist)&&void 0!==n?n:"").toLowerCase().localeCompare(t.artist)};case"minBpm":return function(e,t){return e.minBpm-t.minBpm};default:return function(t,n){var r=t[e];return n[e]-r}}}(u))}),[g,u]),w=Object(o.useMemo)((function(){return e=u,-1!==C.findIndex((function(t){return t===e}))?function(t){var n,r=t[e];return"".concat(r.toString().slice(0,5)," ").concat((n=e,1===r?n.substring(0,n.length-1):n))}:"artist"===e?function(e){return e.artist}:"mainBpm"===e||"minBpm"===e||"maxBpm"===e?function(e){var t=Math.round(e.mainBpm),n=Math.round(e.minBpm),r=Math.round(e.maxBpm);return(n!==t?"(".concat(n,")-"):"")+"".concat(t)+(r!==t?"-(".concat(r,")"):"")}:function(e){return null};var e}),[u]),O=A("div",{className:M.a.chartCount},t.length===j.length?A("span",null,"\u5168 ",t.length," \u8b5c\u9762"):A("span",null,A("b",null,j.length)," \u8b5c\u9762\u304c\u30de\u30c3\u30c1 ",A("small",null,"(",t.length," \u8b5c\u9762\u4e2d)")));return A(m.a,{title:"All Songs",subheading:n&&A(y,{crumbs:n}),metaDescription:"All ".concat(t.length," songs available at stepcharts.com")},A(S,{filter:l,sortedBy:u,levelRange:b,hardestOnly:v,onChangeFilter:s,onChangeLevelRange:p,onChangeSortedBy:c,onChangeHardestOnly:h}),O,A(L,{titles:j,totalTitleCount:t.length,getSortValueFunction:w}))}},"9/5/":function(e,t,n){(function(t){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,u=/^0o[0-7]+$/i,c=parseInt,i="object"==typeof t&&t&&t.Object===Object&&t,o="object"==typeof self&&self&&self.Object===Object&&self,l=i||o||Function("return this")(),s=Object.prototype.toString,f=Math.max,m=Math.min,b=function(){return l.Date.now()};function p(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function d(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==s.call(e)}(e))return NaN;if(p(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=p(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(n,"");var i=a.test(e);return i||u.test(e)?c(e.slice(2),i?2:8):r.test(e)?NaN:+e}e.exports=function(e,t,n){var r,a,u,c,i,o,l=0,s=!1,v=!1,h=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function y(t){var n=r,u=a;return r=a=void 0,l=t,c=e.apply(u,n)}function g(e){return l=e,i=setTimeout(w,t),s?y(e):c}function j(e){var n=e-o;return void 0===o||n>=t||n<0||v&&e-l>=u}function w(){var e=b();if(j(e))return O(e);i=setTimeout(w,function(e){var n=t-(e-o);return v?m(n,u-(e-l)):n}(e))}function O(e){return i=void 0,h&&r?y(e):(r=a=void 0,c)}function k(){var e=b(),n=j(e);if(r=arguments,a=this,o=e,n){if(void 0===i)return g(o);if(v)return i=setTimeout(w,t),y(o)}return void 0===i&&(i=setTimeout(w,t)),c}return t=d(t)||0,p(n)&&(s=!!n.leading,u=(v="maxWait"in n)?f(d(n.maxWait)||0,t):u,h="trailing"in n?!!n.trailing:h),k.cancel=function(){void 0!==i&&clearTimeout(i),l=0,r=o=a=i=void 0},k.flush=function(){return void 0===i?c:O(b())},k}}).call(this,n("yLpj"))},BsWD:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n("a3WO");function a(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(e,t):void 0}}},CfLu:function(e,t,n){e.exports={filterContainer:"t",input:"u"}},"HaE+":function(e,t,n){"use strict";function r(e,t,n,r,a,u,c){try{var i=e[u](c),o=i.value}catch(l){return void n(l)}i.done?t(o):Promise.resolve(o).then(r,a)}function a(e){return function(){var t=this,n=arguments;return new Promise((function(a,u){var c=e.apply(t,n);function i(e){r(c,a,u,i,o,"next",e)}function o(e){r(c,a,u,i,o,"throw",e)}i(void 0)}))}}n.d(t,"a",(function(){return a}))},JePm:function(e,t,n){"use strict";var r=n("q1tI"),a=n.n(r),u=n("dWXJ"),c=n("kelf"),i=function(e,t){if(u.b&&e&&t){var n=new AudioBufferSourceNode(u.b);return n.buffer=t,n.connect(e),n.start(),!0}return!1};t.a=function(e){var t=e.chart,n=e.offsetRef,r=e.timeRef,o=e.enableBeatTick,l=a.a.useRef(0),s=a.a.useCallback((function(){o&&l.current<n.current&&i(u.c.suppressed,u.a.beat)&&(l.current=n.current-n.current%.25+.25)}),[o,n,l]),f=a.a.useRef(0),m=a.a.useCallback((function(){if(t.arrowTimeline[f.current]&&t.arrowTimeline[f.current].time<=r.current){if(t.arrowTimeline[f.current].direction.match(/M/))i(u.c.suppressed,u.a.shock);else{var e=t.arrowTimeline[f.current].direction.match(/[12].*[12]/);i(u.c.normal,u.a.tick),e&&i(u.c.normal,u.a.tick)}for(;t.arrowTimeline[f.current]&&t.arrowTimeline[f.current].time<=r.current;)f.current++}}),[r,f,t]),b=a.a.useRef(t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm}))),p=a.a.useCallback((function(){if(t.bpmTimeline[b.current]&&t.bpmTimeline[b.current].offset<=n.current)for(i(u.c.suppressed,u.a.stop);t.bpmTimeline[b.current]&&(0!==t.bpmTimeline[b.current].bpm||t.bpmTimeline[b.current].offset<=n.current);)b.current++}),[n,b,t]),d=a.a.useRef(0),v=a.a.useCallback((function(){n.current<d.current&&(l.current=n.current-n.current%.25,f.current=t.arrowTimeline.findIndex((function(e){return n.current<e.offset})),b.current=t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm})),l.current=t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm}))),d.current=n.current}),[n,d,t]);return Object(c.a)((function(){v(),s(),m(),p()}),[v,s,m,p]),null}},KQm4:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n("a3WO");var a=n("BsWD");function u(e){return function(e){if(Array.isArray(e))return Object(r.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(a.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},NLPX:function(e,t,n){e.exports={newTable:"c",difficulty:"d",beginner:"e",basic:"f",difficult:"g",expert:"h",challenge:"i",edit:"j",sortValue:"k",title:"l",chartCount:"m"}},ODXe:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n("BsWD");function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,a=!1,u=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(o){a=!0,u=o}finally{try{r||null==i.return||i.return()}finally{if(a)throw u}}return n}}(e,t)||Object(r.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},Zd8l:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n("ODXe"),a=n("q1tI"),u=n.n(a),c=n("kelf"),i=function(e){var t=u.a.useRef(),n=u.a.useState(!1),a=Object(r.a)(n,2),i=a[0],o=a[1],l=u.a.useRef(0),s=u.a.useRef(0),f=u.a.useMemo((function(){return e?Math.floor(e.arrowTimeline[e.arrowTimeline.length-1].offset)+1:0}),[e]),m=u.a.useRef(0),b=u.a.useMemo((function(){if(!e)return null;var t=e.bpmTimeline;return function(e){var n;for(n=m.current;t[n+1]&&t[n+1].time<e;n++);return m.current=n,(e-t[n].time)*t[n].bpm/60/4+t[n].offset}}),[e,m]),p=u.a.useCallback((function(){e&&(t.current=(new Date).getTime(),m.current=0,l.current=0,s.current=0,o(!0))}),[e,t,m,l,s,o]),d=u.a.useCallback((function(){o(!1)}),[o]);return u.a.useEffect((function(){d()}),[e,d]),Object(c.a)((function(){i&&b&&t.current&&(l.current=((new Date).getTime()-t.current)/1e3,s.current=b(l.current),s.current>=f&&d())}),[i,b,t,l,s,d]),[s,l,i,p,d]}},a3WO:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,"a",(function(){return r}))},dWXJ:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return o})),n.d(t,"c",(function(){return l})),n.d(t,"d",(function(){return m}));var r=n("o0o1"),a=n.n(r),u=n("ODXe"),c=n("HaE+"),i=null,o={tick:null,stop:null,bpm:null,shock:null,beat:null},l={normal:null,suppressed:null},s=[["normal",1],["suppressed",.25]],f=[["tick","/stepcharts/cursor12.mp3"],["stop","/stepcharts/cursor4.mp3"],["bpm","/stepcharts/cancel1.mp3"],["shock","/stepcharts/cursor7.mp3"],["beat","/stepcharts/cursor6.mp3"]],m=function(){var e=Object(c.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i){e.next=6;break}return t=new AudioContext,i=t,s.forEach((function(e){var n=Object(u.a)(e,2),r=n[0],a=n[1],c=new GainNode(t);c.gain.value=a,c.connect(t.destination),l[r]=c})),e.next=6,Promise.all(f.map(function(){var e=Object(c.a)(a.a.mark((function e(n){var r,c,i,l,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(u.a)(n,2),c=r[0],i=r[1],e.next=3,fetch(i);case 3:return l=e.sent,e.next=6,l.arrayBuffer();case 6:return s=e.sent,e.next=9,t.decodeAudioData(s);case 9:o[c]=e.sent;case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 6:return e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},kelf:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n("q1tI"),a=n.n(r),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1?arguments[1]:void 0,n=a.a.useRef(),r=a.a.useCallback(e,t);a.a.useEffect((function(){return n.current=requestAnimationFrame((function e(){n.current=requestAnimationFrame(e),r()})),function(){n.current&&cancelAnimationFrame(n.current)}}),[r])}},yLpj:function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(r){"object"===typeof window&&(n=window)}e.exports=n}}]);