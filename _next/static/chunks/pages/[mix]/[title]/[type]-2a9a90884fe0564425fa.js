_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[9],{BsWD:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r("a3WO");function o(e,t){if(e){if("string"===typeof e)return Object(n.a)(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?Object(n.a)(e,t):void 0}}},"HaE+":function(e,t,r){"use strict";function n(e,t,r,n,o,c,a){try{var u=e[c](a),i=u.value}catch(f){return void r(f)}u.done?t(i):Promise.resolve(i).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(o,c){var a=e.apply(t,r);function u(e){n(a,o,c,u,i,"next",e)}function i(e){n(a,o,c,u,i,"throw",e)}u(void 0)}))}}r.d(t,"a",(function(){return o}))},KQm4:function(e,t,r){"use strict";r.d(t,"a",(function(){return c}));var n=r("a3WO");var o=r("BsWD");function c(e){return function(e){if(Array.isArray(e))return Object(n.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(o.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},"N+kb":function(e,t,r){"use strict";r.r(t),r.d(t,"__N_SSG",(function(){return M}));var n=r("q1tI"),o=r.n(n),c=r("o0o1"),a=r.n(c),u=r("HaE+"),i=r("ODXe"),f=r("KQm4"),s=r("kelf"),l=o.a.createElement,d=13.5,p=16.875,h={4:"/stepcharts/arrow4.svg",6:"/stepcharts/arrow6.svg",8:"/stepcharts/arrow8.svg",12:"/stepcharts/arrow6.svg",16:"/stepcharts/arrow16.svg",shock:"/stepcharts/arrowShock.svg",freeze:"/stepcharts/arrowFreeze.svg"},b={0:"-90deg",1:"180deg",2:"0",3:"90deg"},m={off:[0,1,2,3],mirror:[3,2,1,0],left:[1,3,0,2],right:[2,0,3,1]},v=function(e,t){return 4*e*13.3*t+p},k=function(e){var t=e.offset,r=e.speed,n={position:"absolute",top:"".concat(v(t,r),"vh"),width:1,height:1};return l("div",{style:n})},y=function(e){var t=e.beat,r=e.direction,n=e.offset,o=e.speed,c={position:"absolute",top:"".concat(v(n,o)-6.75,"vh"),left:"".concat(r*d,"vh"),height:"".concat(d,"vh"),width:"".concat(d,"vh"),background:"url(".concat(h[t],")"),backgroundSize:"cover",transform:"rotate(".concat(b[r],")")};return l("div",{style:c})},w=function(e){var t=e.direction,r=e.offset,n=e.endOffset,c=e.speed,a={position:"absolute",top:"".concat(v(r,c),"vh"),left:"".concat(t*d+.675,"vh"),height:"".concat(4*(n-r-.25)*c*13.3,"vh"),width:"".concat(12.15,"vh"),backgroundColor:"#5e5"},u={position:"absolute",top:"".concat(v(n-.25,c),"vh"),left:"".concat(t*d+.675,"vh"),height:"".concat(6.075,"vh"),width:"".concat(12.15,"vh"),backgroundColor:"#3b3"};return l(o.a.Fragment,null,l("div",{style:a}),l("div",{style:u}))},g=function(e){var t=e.offset,r=e.speed,n=e.color,o={position:"absolute",height:0,width:"".concat(54,"vh"),left:0,top:"".concat(v(t,r),"vh"),border:"2px solid ".concat(n)};return l("div",{style:o})},O=function(){var e={position:"absolute",height:0,width:"".concat(54,"vh"),left:0,top:"".concat(10.125,"vh"),border:"".concat(6.75,"vh solid #ffffff60")};return l("div",{style:e})},j=function(e){var t=e.chart,r=e.speed,n=void 0===r?1:r,c=e.turn,a=void 0===c?"off":c,u=Math.floor(t.arrows[t.arrows.length-1].offset),i=Object(f.a)(t.arrows).reverse(),s=Object(f.a)(t.freezes).reverse();return l(o.a.Fragment,null,Object(f.a)(Array(4*(u+1))).map((function(e,t){return l(g,{key:"b".concat(t),offset:t/4,speed:n,color:t%4===0?"#888":"#444"})})),t.bpmTimeline.map((function(e,t,r){return 0===t?null:0===e.bpm?l(g,{key:"ts".concat(t),offset:e.offset,speed:n,color:"#4f4"}):0===r[t-1].bpm?null:r[t-1].bpm<e.bpm?l(g,{key:"ts".concat(t),offset:e.offset,speed:n,color:"#fc4"}):l(g,{key:"ts".concat(t),offset:e.offset,speed:n,color:"#4cf"})})),s.map((function(e,t){return l(w,{key:"f".concat(t),direction:m[a][e.direction],offset:e.startOffset,endOffset:e.endOffset,speed:n})})),i.map((function(e,t){var r=e.direction.match(/2/)?"freeze":e.beat;return l(o.a.Fragment,null,e.direction.match(/^1.../)&&l(y,{key:"a".concat(t,"l"),beat:r,direction:m[a][0],offset:e.offset,speed:n}),e.direction.match(/^.1../)&&l(y,{key:"a".concat(t,"d"),beat:r,direction:m[a][1],offset:e.offset,speed:n}),e.direction.match(/^..1./)&&l(y,{key:"a".concat(t,"u"),beat:r,direction:m[a][2],offset:e.offset,speed:n}),e.direction.match(/^...1/)&&l(y,{key:"a".concat(t,"r"),beat:r,direction:m[a][3],offset:e.offset,speed:n}),e.direction.match(/^2.../)&&l(y,{key:"a".concat(t,"l"),beat:"freeze",direction:m[a][0],offset:e.offset,speed:n}),e.direction.match(/^.2../)&&l(y,{key:"a".concat(t,"d"),beat:"freeze",direction:m[a][1],offset:e.offset,speed:n}),e.direction.match(/^..2./)&&l(y,{key:"a".concat(t,"u"),beat:"freeze",direction:m[a][2],offset:e.offset,speed:n}),e.direction.match(/^...2/)&&l(y,{key:"a".concat(t,"r"),beat:"freeze",direction:m[a][3],offset:e.offset,speed:n}),e.direction.match(/^M.../)&&l(y,{key:"a".concat(t,"l"),beat:"shock",direction:m[a][0],offset:e.offset,speed:n}),e.direction.match(/^.M../)&&l(y,{key:"a".concat(t,"d"),beat:"shock",direction:m[a][1],offset:e.offset,speed:n}),e.direction.match(/^..M./)&&l(y,{key:"a".concat(t,"u"),beat:"shock",direction:m[a][2],offset:e.offset,speed:n}),e.direction.match(/^...M/)&&l(y,{key:"a".concat(t,"r"),beat:"shock",direction:m[a][3],offset:e.offset,speed:n}))})),l(k,{offset:u+2,speed:n}))},C=o.a.memo(j),x=function(e){var t=e.offsetRef,r=e.speed,n=void 0===r?1:r,c=e.playing,a=e.children,u=o.a.useRef(null),i={position:"relative",width:"".concat(54,"vh"),height:"100vh",backgroundColor:"black",overflow:"scroll"},f=o.a.useMemo((function(){if(u.current&&c){var e=u.current.getBoundingClientRect();return e.bottom-e.top}return 0}),[u,c]),d=o.a.useRef();return Object(s.a)((function(){u.current&&t.current&&t.current!=d.current&&(u.current.scrollTop=(v(t.current,n)-p)*f/100,d.current=t.current)}),[u,t,d,n,f]),l("div",{ref:u,style:i},a)},S=function(e){var t=e.chart,r=e.speed,n=void 0===r?1:r,o=e.turn,c=void 0===o?"off":o,a=e.offsetRef,u=e.playing;return l("div",{style:{position:"relative"}},l(x,{offsetRef:a,speed:n,playing:u},l(C,{chart:t,speed:n,turn:c})),l(O,null))},E=r("pEhc"),T=r("Zd8l"),A=r("dWXJ"),R=o.a.createElement,_=function(e){var t=e.chart,r=Object(T.a)(t),n=Object(i.a)(r,4),c=n[0],f=n[1],s=n[2],l=n[3],d=o.a.useState(2),p=Object(i.a)(d,2),h=p[0],b=p[1],m=o.a.useState("off"),v=Object(i.a)(m,2),k=v[0],y=v[1],w=o.a.useState(!1),g=Object(i.a)(w,2),O=g[0],j=g[1],C=o.a.useCallback((function(e){return b(Number(e.target.value))}),[b]),x=o.a.useCallback((function(e){return y(e.target.value)}),[y]),_=o.a.useCallback((function(){return j(!1)}),[j]),I=o.a.useCallback((function(){return j(!0)}),[j]),M=o.a.useCallback(Object(u.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(A.d)();case 2:s(),j(!1);case 4:case"end":return e.stop()}}),e)}))),[s]),N=o.a.useCallback((function(){l(),j(!1)}),[l]);return R("div",{style:{display:"flex"}},R(S,{chart:t,speed:h,offsetRef:c,playing:f,turn:k}),R(E.a,{chart:t,offsetRef:c}),O&&R("div",{style:{position:"absolute",padding:16,width:"100vw",height:"100vh",background:"#ffffff80"}},R("div",null,"Speed:"," ",R("input",{type:"range",min:"0.25",max:"8",step:"0.25",value:h,onInput:C}),"x",h," (",t.meta.minBpm*h," - ",t.meta.maxBpm*h,")"),R("div",null,"Turn:"," ",R("select",{value:k,onInput:x},R("option",{value:"off"},"off"),R("option",{value:"mirror"},"mirror"),R("option",{value:"left"},"left"),R("option",{value:"right"},"right"))),R("button",{onClick:_},"[Close]")," ",f?R("button",{onClick:N},"[STOP]"):R("button",{onClick:M},"[PLAY]")),R("button",{onClick:I},"\u2699\ufe0f"))},I=o.a.createElement,M=!0;t.default=function(e){var t=e.chart;return I(_,{chart:t})}},ODXe:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r("BsWD");function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,o=!1,c=void 0;try{for(var a,u=e[Symbol.iterator]();!(n=(a=u.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(i){o=!0,c=i}finally{try{n||null==u.return||u.return()}finally{if(o)throw c}}return r}}(e,t)||Object(n.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},Zd8l:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r("ODXe"),o=r("q1tI"),c=r.n(o),a=r("kelf"),u=function(e){var t=c.a.useRef(),r=c.a.useState(!1),o=Object(n.a)(r,2),u=o[0],i=o[1],f=c.a.useRef(0),s=c.a.useRef(0),l=c.a.useMemo((function(){if(!e)return null;var t=e.bpmTimeline;return function(e){var r;for(r=s.current;t[r+1]&&t[r+1].time<e;r++);return s.current=r,(e-t[r].time)*t[r].bpm/60/4+t[r].offset}}),[e,s]),d=c.a.useCallback((function(){e&&(t.current=(new Date).getTime(),s.current=0,f.current=0,i(!0))}),[e,t,s,f,i]),p=c.a.useCallback((function(){i(!1)}),[i]);return c.a.useEffect((function(){p()}),[e,p]),Object(a.a)((function(){u&&l&&t.current&&(f.current=l(((new Date).getTime()-t.current)/1e3))}),[u,l,t,f]),[f,u,d,p]}},a3WO:function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}r.d(t,"a",(function(){return n}))},dWXJ:function(e,t,r){"use strict";r.d(t,"b",(function(){return u})),r.d(t,"a",(function(){return i})),r.d(t,"c",(function(){return f})),r.d(t,"d",(function(){return d}));var n=r("o0o1"),o=r.n(n),c=r("ODXe"),a=r("HaE+"),u=null,i={tick:null,stop:null,bpm:null,shock:null,beat:null},f={normal:null,suppressed:null},s=[["normal",1],["suppressed",.25]],l=[["tick","/stepcharts/cursor12.mp3"],["stop","/stepcharts/cursor4.mp3"],["bpm","/stepcharts/cancel1.mp3"],["shock","/stepcharts/cursor7.mp3"],["beat","/stepcharts/cursor6.mp3"]],d=function(){var e=Object(a.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u){e.next=6;break}return t=new AudioContext,u=t,s.forEach((function(e){var r=Object(c.a)(e,2),n=r[0],o=r[1],a=new GainNode(t);a.gain.value=o,a.connect(t.destination),f[n]=a})),e.next=6,Promise.all(l.map(function(){var e=Object(a.a)(o.a.mark((function e(r){var n,a,u,f,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(c.a)(r,2),a=n[0],u=n[1],e.next=3,fetch(u);case 3:return f=e.sent,e.next=6,f.arrayBuffer();case 6:return s=e.sent,e.next=9,t.decodeAudioData(s);case 9:i[a]=e.sent;case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 6:return e.abrupt("return",u);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},kelf:function(e,t,r){"use strict";r.d(t,"a",(function(){return c}));var n=r("q1tI"),o=r.n(n),c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1?arguments[1]:void 0,r=o.a.useRef(),n=o.a.useCallback(e,t);o.a.useEffect((function(){return r.current=requestAnimationFrame((function e(){r.current=requestAnimationFrame(e),n()})),function(){r.current&&cancelAnimationFrame(r.current)}}),[n])}},pEhc:function(e,t,r){"use strict";var n=r("q1tI"),o=r.n(n),c=r("dWXJ"),a=r("kelf"),u=function(e,t){if(c.b&&e&&t){var r=new AudioBufferSourceNode(c.b);return r.buffer=t,r.connect(e),r.start(),!0}return!1};t.a=function(e){var t=e.chart,r=e.offsetRef,n=o.a.useMemo((function(){return Math.floor(t.arrows[t.arrows.length-1].offset)+1}),[t]),i=o.a.useRef(0),f=o.a.useCallback((function(){i.current<r.current&&r.current<=n&&u(c.c.suppressed,c.a.beat)&&(i.current=r.current-r.current%.25+.25)}),[r,n,i]),s=o.a.useRef(0),l=o.a.useCallback((function(){if(t.arrows[s.current]&&t.arrows[s.current].offset<=r.current){if(t.arrows[s.current].direction.match(/M/))u(c.c.suppressed,c.a.shock);else{var e=t.arrows[s.current].direction.match(/[12].*[12]/);u(c.c.normal,c.a.tick),e&&u(c.c.normal,c.a.tick)}for(;t.arrows[s.current]&&t.arrows[s.current].offset<=r.current;)s.current++}}),[r,s,t]),d=o.a.useRef(t.bpmTimeline.findIndex((function(e){return r.current<e.offset&&0===e.bpm}))),p=o.a.useCallback((function(){if(t.bpmTimeline[d.current]&&t.bpmTimeline[d.current].offset<=r.current)for(u(c.c.suppressed,c.a.stop);t.bpmTimeline[d.current]&&(0!==t.bpmTimeline[d.current].bpm||t.bpmTimeline[d.current].offset<=r.current);)d.current++}),[r,d]),h=o.a.useRef(0),b=o.a.useCallback((function(){r.current<h.current&&(i.current=r.current-r.current%.25,s.current=t.arrows.findIndex((function(e){return r.current<e.offset})),i.current=t.bpmTimeline.findIndex((function(e){return r.current<e.offset&&0===e.bpm}))),h.current=r.current}),[r,h,t]);return Object(a.a)((function(){b(),f(),l(),p()}),[b,f,l,p]),null}},vnkr:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[mix]/[title]/[type]",function(){return r("N+kb")}])}},[["vnkr",0,2,1]]]);