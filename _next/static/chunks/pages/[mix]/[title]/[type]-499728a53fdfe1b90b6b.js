_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[9],{BsWD:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("a3WO");function o(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(e,t):void 0}}},"HaE+":function(e,t,n){"use strict";function r(e,t,n,r,o,a,c){try{var i=e[a](c),s=i.value}catch(u){return void n(u)}i.done?t(s):Promise.resolve(s).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,a){var c=e.apply(t,n);function i(e){r(c,o,a,i,s,"next",e)}function s(e){r(c,o,a,i,s,"throw",e)}i(void 0)}))}}n.d(t,"a",(function(){return o}))},JePm:function(e,t,n){"use strict";var r=n("q1tI"),o=n.n(r),a=n("dWXJ"),c=n("kelf"),i=function(e,t){if(a.b&&e&&t){var n=new AudioBufferSourceNode(a.b);return n.buffer=t,n.connect(e),n.start(),!0}return!1};t.a=function(e){var t=e.chart,n=e.offsetRef,r=e.timeRef,s=e.enableBeatTick,u=o.a.useRef(0),l=o.a.useCallback((function(){s&&u.current<n.current&&i(a.c.suppressed,a.a.beat)&&(u.current=n.current-n.current%.25+.25)}),[s,n,u]),f=o.a.useRef(0),h=o.a.useCallback((function(){if(t.arrowTimeline[f.current]&&t.arrowTimeline[f.current].time<=r.current){if(t.arrowTimeline[f.current].direction.match(/M/))i(a.c.suppressed,a.a.shock);else{var e=t.arrowTimeline[f.current].direction.match(/[12].*[12]/);i(a.c.normal,a.a.tick),e&&i(a.c.normal,a.a.tick)}for(;t.arrowTimeline[f.current]&&t.arrowTimeline[f.current].time<=r.current;)f.current++}}),[r,f,t]),m=o.a.useRef(t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm}))),d=o.a.useCallback((function(){if(t.bpmTimeline[m.current]&&t.bpmTimeline[m.current].offset<=n.current)for(i(a.c.suppressed,a.a.stop);t.bpmTimeline[m.current]&&(0!==t.bpmTimeline[m.current].bpm||t.bpmTimeline[m.current].offset<=n.current);)m.current++}),[n,m,t]),p=o.a.useRef(0),b=o.a.useCallback((function(){n.current<p.current&&(u.current=n.current-n.current%.25,f.current=t.arrowTimeline.findIndex((function(e){return n.current<e.offset})),m.current=t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm})),u.current=t.bpmTimeline.findIndex((function(e){return n.current<e.offset&&0===e.bpm}))),p.current=n.current}),[n,p,t]);return Object(c.a)((function(){b(),l(),h(),d()}),[b,l,h,d]),null}},KQm4:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n("a3WO");var o=n("BsWD");function a(e){return function(e){if(Array.isArray(e))return Object(r.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(o.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},"N+kb":function(e,t,n){"use strict";n.r(t),n.d(t,"__N_SSG",(function(){return W}));var r=n("q1tI"),o=n.n(r),a=n("o0o1"),c=n.n(a),i=n("HaE+"),s=n("ODXe");function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var l=n("KQm4"),f=n("kelf"),h=[{name:"OFF",shortName:"OFF"},{name:"LEFT",shortName:"\u2190"},{name:"RIGHT",shortName:"\u2192"},{name:"MIRROR",shortName:"\u21d4"},{name:"SHUFFLE1 (\u2192\u2191)",shortName:"?1"},{name:"SHUFFLE2 (\u2193\u2190)",shortName:"?2"},{name:"SHUFFLE3 (\u2191\u2190)",shortName:"?3"},{name:"SHUFFLE4 (\u2192\u2191)",shortName:"?4"},{name:"SHUFFLE5 (\u2191\u2193)",shortName:"?5"},{name:"SHUFFLE6 (\u2192\u2190)",shortName:"?6"},{name:"SHUFFLE1+LEFT",shortName:"?1 + \u2190"},{name:"SHUFFLE2+LEFT",shortName:"?2 + \u2190"},{name:"SHUFFLE3+LEFT",shortName:"?3 + \u2190"},{name:"SHUFFLE4+LEFT",shortName:"?4 + \u2190"},{name:"SHUFFLE5+LEFT",shortName:"?5 + \u2190"},{name:"SHUFFLE1+RIGHT",shortName:"?1 + \u2192"},{name:"SHUFFLE2+RIGHT",shortName:"?2 + \u2192"},{name:"SHUFFLE3+RIGHT",shortName:"?3 + \u2192"},{name:"SHUFFLE4+RIGHT",shortName:"?4 + \u2192"},{name:"SHUFFLE5+RIGHT",shortName:"?5 + \u2192"},{name:"SHUFFLE1+MIRROR",shortName:"?1 + \u21d4"},{name:"SHUFFLE2+MIRROR",shortName:"?2 + \u21d4"},{name:"SHUFFLE3+MIRROR",shortName:"?3 + \u21d4"},{name:"SHUFFLE4+MIRROR",shortName:"?4 + \u21d4"}],m={OFF:[0,1,2,3],LEFT:[2,0,3,1],RIGHT:[1,3,0,2],MIRROR:[3,2,1,0],"SHUFFLE1 (\u2192\u2191)":[0,1,3,2],"SHUFFLE2 (\u2193\u2190)":[1,0,2,3],"SHUFFLE3 (\u2191\u2190)":[2,1,0,3],"SHUFFLE4 (\u2192\u2191)":[0,3,2,1],"SHUFFLE5 (\u2191\u2193)":[0,2,1,3],"SHUFFLE6 (\u2192\u2190)":[3,1,2,0],"SHUFFLE1+LEFT":[3,0,2,1],"SHUFFLE2+LEFT":[2,1,3,0],"SHUFFLE3+LEFT":[0,2,3,1],"SHUFFLE4+LEFT":[2,0,1,3],"SHUFFLE5+LEFT":[1,0,3,2],"SHUFFLE1+RIGHT":[1,2,0,3],"SHUFFLE2+RIGHT":[0,3,1,2],"SHUFFLE3+RIGHT":[1,3,2,0],"SHUFFLE4+RIGHT":[3,1,0,2],"SHUFFLE5+RIGHT":[2,3,0,1],"SHUFFLE1+MIRROR":[2,3,1,0],"SHUFFLE2+MIRROR":[3,2,0,1],"SHUFFLE3+MIRROR":[3,0,1,2],"SHUFFLE4+MIRROR":[1,2,3,0]},d=o.a.createElement,p=13.5,b=16.875,v={4:"/stepcharts/arrow4.svg",6:"/stepcharts/arrow6.svg",8:"/stepcharts/arrow8.svg",12:"/stepcharts/arrow6.svg",16:"/stepcharts/arrow16.svg",24:"/stepcharts/arrow6.svg",32:"/stepcharts/arrow6.svg",64:"/stepcharts/arrow6.svg",other:"/stepcharts/arrow6.svg",shock:"/stepcharts/arrowShock.svg",freeze:"/stepcharts/arrowFreeze.svg"},g={4:"/stepcharts/arrow4.svg",6:"/stepcharts/arrow6.svg",8:"/stepcharts/arrow8.svg",12:"/stepcharts/arrow6.svg",16:"/stepcharts/arrow16.svg",24:"/stepcharts/arrow24.svg",32:"/stepcharts/arrow32.svg",64:"/stepcharts/arrow64.svg",other:"/stepcharts/arrowOther.svg",shock:"/stepcharts/arrowShock.svg",freeze:"/stepcharts/arrowFreeze.svg"},F={0:"-90deg",1:"180deg",2:"0",3:"90deg"},k=function(e,t){return 4*e*13.3*t+b},y=function(e){var t=e.offset,n=e.speed,r={position:"absolute",top:"".concat(k(t,n),"vh"),width:1,height:1};return d("div",{style:r})},w=function(e){var t=e.beat,n=e.direction,r=e.pos,o=e.highlight,a=void 0!==o&&o,c=e.verboseColors,i=void 0!==c&&c,s={position:"absolute",top:"".concat(r-6.75,"vh"),left:"".concat(n*p,"vh"),height:"".concat(p,"vh"),width:"".concat(p,"vh"),backgroundImage:"url(".concat(i?g[t]:v[t],")"),backgroundSize:"cover",backgroundColor:a?"#fff6":void 0,boxShadow:a?"0 0 ".concat(3.375,"vh #fff"):void 0,borderRadius:"".concat(6.75,"vh"),transform:"rotate(".concat(F[n],")")};return d("div",{style:s})},O=function(e){var t=e.direction,n=e.pos,r=e.endPos,a=e.diminished,c={position:"absolute",top:"".concat(n,"vh"),left:"".concat(t*p+.675,"vh"),height:"".concat(r-n,"vh"),width:"".concat(12.15,"vh"),backgroundColor:a?"#88ee4444":"#88ee44"},i={position:"absolute",top:"".concat(r,"vh"),left:"".concat(t*p+.675,"vh"),height:0,width:"".concat(12.15,"vh"),borderTop:"".concat(6.075,"vh solid ").concat(a?"#66cc2244":"#66cc22"),borderLeft:"".concat(6.075,"vh solid transparent"),borderRight:"".concat(6.075,"vh solid transparent")};return d(o.a.Fragment,null,d("div",{style:c}),d("div",{style:i}))},T=function(e){var t=e.pos,n=e.endPos,r=e.color,o=e.bgColor,a=e.value,c={position:"absolute",height:"".concat(n?n-t:0,"vh"),width:"".concat(54,"vh"),left:0,top:"".concat(t,"vh"),borderTop:r?"4px solid ".concat(r):void 0,backgroundColor:o};return d("div",{style:c},a&&d("div",{style:{position:"absolute",width:"100%",color:r,textAlign:"center",top:"4px"}},a))},S=function(){var e={position:"fixed",top:"".concat(10.125,"vh"),pointerEvents:"none"},t=function(e){return{display:"inline-block",height:"".concat(p,"vh"),width:"".concat(p,"vh"),backgroundImage:"url(/stepcharts/arrowJudge.svg)",backgroundSize:"cover",transform:"rotate(".concat(F[e],")")}};return d("div",{style:e},d("div",{style:t(0)}),d("div",{style:t(1)}),d("div",{style:t(2)}),d("div",{style:t(3)}))},E=function(e,t){return function(n){return k(t?n.time:n.offset,e)}},R=function(e){var t=e.chart,n=e.speed,r=void 0===n?1:n,a=e.showBeat,c=e.constantMode,i=e.soflanBg,s=e.soflanValue,u=E(r,c);return d(o.a.Fragment,null,a&&t.beatTimeline.map((function(e,t){return d(T,{key:"b".concat(t),pos:u(e),color:t%4===0?"#fffa":"#fff5"})})),t.bpmTimeline.map((function(e,n,r){var o,a=null!==(o=r[n+1])&&void 0!==o?o:t.beatTimeline[t.beatTimeline.length-1];return 0===n?t.meta.mainBpm!==e.bpm&&d(T,{key:"ts".concat(n),pos:0,endPos:u(a),color:s?t.meta.mainBpm<e.bpm?"#fc4":"#4cf":void 0,bgColor:i?t.meta.mainBpm<e.bpm?"#fc44":"#4cf4":void 0,value:s?e.bpm:void 0}):r[n-1].bpm<e.bpm?d(T,{key:"ts".concat(n),pos:u(e),endPos:t.meta.mainBpm!==e.bpm?u(a):void 0,color:s?"#fc4":void 0,bgColor:i?t.meta.mainBpm<e.bpm?"#fc44":"#4cf4":void 0,value:s?e.bpm:void 0}):e.bpm<r[n-1].bpm&&e.bpm>0?d(T,{key:"ts".concat(n),pos:u(e),endPos:t.meta.mainBpm!==e.bpm?u(a):void 0,color:s?"#4cf":void 0,bgColor:i?t.meta.mainBpm<e.bpm?"#fc44":"#4cf4":void 0,value:s?e.bpm:void 0}):null})),t.bpmTimeline.map((function(e,t,n){return 0===e.bpm?d(T,{key:"ts".concat(t),pos:u(e),endPos:u(n[t+1]),color:s?"#4f4":void 0,bgColor:i?"#4f44":void 0}):null})))},C=function(e){var t=e.chart,n=e.speed,r=void 0===n?1:n,a=e.turn,c=void 0===a?"OFF":a,i=e.constantMode,s=e.colorFreezes,u=e.diminishFreezes,f=e.highlightSoflan,h=e.verboseColors,p=t.arrowTimeline[t.arrowTimeline.length-1],b=Math.floor(p.offset),v=Object(l.a)(t.arrowTimeline).reverse(),g=Object(l.a)(t.freezeTimeline).reverse(),F=E(r,i);return d(o.a.Fragment,null,g.map((function(e,t){var n=m[c][e.direction];return d(O,{key:"f".concat(t),direction:n,pos:F(e.start),endPos:F(e.end),diminished:u})})),v.map((function(e,t){var n=e.direction.match(/2/)&&!s?"freeze":e.beat,r=F(e);return d(o.a.Fragment,null,e.direction.match(/^[12].../)&&d(w,{key:"a".concat(t,"l"),beat:n,direction:m[c][0],pos:r,highlight:f&&!!e.tags.soflanTrigger,verboseColors:h}),e.direction.match(/^.[12]../)&&d(w,{key:"a".concat(t,"d"),beat:n,direction:m[c][1],pos:r,highlight:f&&!!e.tags.soflanTrigger,verboseColors:h}),e.direction.match(/^..[12]./)&&d(w,{key:"a".concat(t,"u"),beat:n,direction:m[c][2],pos:r,highlight:f&&!!e.tags.soflanTrigger,verboseColors:h}),e.direction.match(/^...[12]/)&&d(w,{key:"a".concat(t,"r"),beat:n,direction:m[c][3],pos:r,highlight:f&&!!e.tags.soflanTrigger,verboseColors:h}),e.direction.match(/^M.../)&&d(w,{key:"a".concat(t,"l"),beat:"shock",direction:m[c][0],pos:r,highlight:f&&!!e.tags.soflanTrigger}),e.direction.match(/^.M../)&&d(w,{key:"a".concat(t,"d"),beat:"shock",direction:m[c][1],pos:r,highlight:f&&!!e.tags.soflanTrigger}),e.direction.match(/^..M./)&&d(w,{key:"a".concat(t,"u"),beat:"shock",direction:m[c][2],pos:r,highlight:f&&!!e.tags.soflanTrigger}),e.direction.match(/^...M/)&&d(w,{key:"a".concat(t,"r"),beat:"shock",direction:m[c][3],pos:r,highlight:f&&!!e.tags.soflanTrigger}))})),d(y,{offset:b+2,speed:r}))},H=o.a.memo(R),L=o.a.memo(C),U=function(e){var t=e.chart,n=e.speed,r=void 0===n?1:n,a=e.turn,c=void 0===a?"OFF":a,i=e.offsetRef,s=e.timeRef,u=e.playing,l=e.showBeat,h=e.constantMode,m=void 0!==h&&h,p=e.colorFreezes,v=void 0!==p&&p,g=e.diminishFreezes,F=void 0!==g&&g,y=e.soflanBg,w=void 0!==y&&y,O=e.soflanValue,T=void 0!==O&&O,E=e.highlightSoflan,R=void 0!==E&&E,C=e.verboseColors,U=void 0!==C&&C,I=e.children,j=o.a.useRef(null),x=o.a.useMemo((function(){if(j.current&&u){var e=j.current.getBoundingClientRect();return e.bottom-e.top}return 0}),[j,u]),B=o.a.useRef(),N=o.a.useRef();Object(f.a)((function(){j.current&&(i.current&&i.current!=B.current&&(B.current=i.current,m||(j.current.scrollTop=(k(i.current,r)-b)*x/100)),s.current&&s.current!=N.current&&m&&(j.current.scrollTop=(k(s.current,r)-b)*x/100))}),[j,i,s,B,N,r,x,m]);var M={position:"relative",width:"".concat(54,"vh"),margin:"auto"};return d("div",{style:{position:"relative",overflow:"scroll",backgroundColor:"black",height:"100vh",width:"100vw"},ref:j},d("div",{style:M},d(H,{chart:t,speed:r,showBeat:l,constantMode:m,soflanBg:w,soflanValue:T}),d(S,null),d(L,{chart:t,speed:r,turn:c,constantMode:m,colorFreezes:v,diminishFreezes:F,highlightSoflan:R,verboseColors:U}),I))},I=n("JePm"),j=n("Zd8l"),x=n("dWXJ"),B=o.a.createElement;function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function M(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var P=function(e){return Math.floor(620/e*4)/4},z=function(e){return e.arrowTimeline.reduce((function(e,t){return e+(4===t.beat?1:0)}),0)>=e.arrowTimeline.length/4},A=function(e){var t=e.options,n=e.onChange,r=e.style,a=e.minBpm,c=e.mainBpm,i=e.maxBpm,s=o.a.useCallback((function(e){return n(M(M({},t),{},{speed:Number(e.target.value)}))}),[t,n]),u=o.a.useCallback((function(e){return n(M(M({},t),{},{turn:e.target.value}))}),[t,n]),l=o.a.useCallback((function(e){return n(M(M({},t),{},{tick:e.target.checked}))}),[t,n]),f=o.a.useCallback((function(e){return n(M(M({},t),{},{constantMode:e.target.checked,speed:P(e.target.checked?240:c)}))}),[t,n]),m=o.a.useCallback((function(e){return n(M(M({},t),{},{colorFreezes:e.target.checked}))}),[t,n]),d=o.a.useCallback((function(e){return n(M(M({},t),{},{diminishFreezes:e.target.checked}))}),[t,n]),p=o.a.useCallback((function(e){return n(M(M({},t),{},{soflanBg:e.target.checked}))}),[t,n]),b=o.a.useCallback((function(e){return n(M(M({},t),{},{soflanValue:e.target.checked}))}),[t,n]),v=o.a.useCallback((function(e){return n(M(M({},t),{},{highlightSoflan:e.target.checked}))}),[t,n]),g=o.a.useCallback((function(e){return n(M(M({},t),{},{verboseColors:e.target.checked}))}),[t,n]);return B("div",{style:r},B("div",null,"Speed:"," ",B("input",{type:"range",min:"0.25",max:"8",step:"0.25",value:t.speed,onInput:s}),"x",t.speed,t.constantMode?"(".concat(240*t.speed,")"):B(o.a.Fragment,null," (",a!==c?"".concat(a*t.speed,"-"):"",c*t.speed,c!==i?"-".concat(i*t.speed):"",")")),B("div",null,B("label",null,"\u30b9\u30af\u30ed\u30fc\u30eb\u901f\u5ea6\u3092\u4e00\u5b9a\u306b"," ",B("input",{type:"checkbox",checked:t.constantMode,onChange:f}))),B("div",null,"TURN:"," ",B("select",{value:t.turn,onInput:u},h.map((function(e){return B("option",{key:e.name,value:e.name},"TURN: ",e.name)})))),B("div",null,B("label",null,"\u30d5\u30ea\u30fc\u30ba\u3082\u8272\u5206\u3051\u3059\u308b"," ",B("input",{type:"checkbox",checked:t.colorFreezes,onChange:m}))),B("div",null,B("label",null,"\u30d5\u30ea\u30fc\u30ba\u306e\u68d2\u90e8\u5206\u3092\u63a7\u3048\u3081\u306b\u8868\u793a"," ",B("input",{type:"checkbox",checked:t.diminishFreezes,onChange:d}))),B("div",null,B("label",null,"\u4f4e\u901f\u30fb\u9ad8\u901f\u5730\u5e2f\u3092\u8272\u5206\u3051"," ",B("input",{type:"checkbox",checked:t.soflanBg,onChange:p}))),B("div",null,B("label",null,"\u30bd\u30d5\u30e9\u30f3\u7b87\u6240\u306b\u76ee\u5370\u3092\u8868\u793a"," ",B("input",{type:"checkbox",checked:t.soflanValue,onChange:b}))),B("div",null,B("label",null,"\u30bd\u30d5\u30e9\u30f3\u76f4\u524d\u306e\u30ce\u30fc\u30c8\u3092\u30cf\u30a4\u30e9\u30a4\u30c8"," ",B("input",{type:"checkbox",checked:t.highlightSoflan,onChange:v}))),B("div",null,B("label",null,"24 \u5206\u4ee5\u4e0b\u306e\u30ce\u30fc\u30c8\u3082\u8272\u5206\u3051"," ",B("input",{type:"checkbox",checked:t.verboseColors,onChange:g}))),B("div",null,B("label",null,"\u5c0f\u7bc0\u7dda\u3092\u8868\u793a\uff06\u30e1\u30c8\u30ed\u30ce\u30fc\u30e0\u3092\u518d\u751f"," ",B("input",{type:"checkbox",checked:t.tick,onChange:l}))))},_=function(e){var t=e.onPlay,n=e.onPause,r=e.onOpenOptions,o=e.onCloseOptions,a=e.playing,c=e.opened,i={color:"white",fontWeight:"bold",backgroundColor:"#ea0",borderRadius:"0.75em",padding:"0.5em 0.75em",border:"none",marginRight:"1em"};return B("div",null,B("button",{onClick:a?n:t,style:i},a?"STOP":"PLAY"),B("button",{onClick:c?o:r,style:i},c?"x CLOSE":"OPTIONS"))},D=function(e){var t=e.chart,n=Object(j.a)(t),r=Object(s.a)(n,5),a=r[0],u=r[1],l=r[2],f=r[3],h=r[4],m=o.a.useState(!1),d=Object(s.a)(m,2),p=d[0],b=d[1],v=o.a.useState({speed:P(t.meta.mainBpm),turn:"OFF",tick:z(t),constantMode:!1,colorFreezes:!0,diminishFreezes:!0,soflanBg:!0,soflanValue:!0,highlightSoflan:!0,verboseColors:!0}),g=Object(s.a)(v,2),F=g[0],k=g[1],y=o.a.useCallback((function(){return b(!1)}),[b]),w=o.a.useCallback((function(){return b(!0)}),[b]),O=o.a.useCallback(Object(i.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(x.d)();case 2:f();case 3:case"end":return e.stop()}}),e)}))),[f]),T={position:"fixed",textAlign:"center",bottom:"1em",width:"".concat(54,"vh")},S=Math.round(t.meta.mainBpm),E=Math.round(t.meta.minBpm),R=Math.round(t.meta.maxBpm);return B(o.a.Fragment,null,B(U,{chart:t,speed:F.speed,offsetRef:a,timeRef:u,playing:l,turn:F.turn,showBeat:F.tick,constantMode:F.constantMode,colorFreezes:F.colorFreezes,diminishFreezes:F.diminishFreezes,soflanBg:F.soflanBg,soflanValue:F.soflanValue,highlightSoflan:F.highlightSoflan,verboseColors:F.verboseColors},B("div",{style:T},p&&B(A,{options:F,onChange:k,style:{textAlign:"left",padding:"1em",marginBottom:"1em",background:"#ffffffa0",lineHeight:"2"},minBpm:E,mainBpm:S,maxBpm:R}),B(_,{playing:l,opened:p,onPlay:O,onPause:h,onOpenOptions:w,onCloseOptions:y}))),B(I.a,{chart:t,offsetRef:a,timeRef:u,enableBeatTick:F.tick}))},G=o.a.createElement,W=!0;t.default=function(e){var t=e.chart;return G(D,{chart:t})}},ODXe:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("BsWD");function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(s){o=!0,a=s}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(e,t)||Object(r.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},Zd8l:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n("ODXe"),o=n("q1tI"),a=n.n(o),c=n("kelf"),i=function(e){var t=a.a.useRef(),n=a.a.useState(!1),o=Object(r.a)(n,2),i=o[0],s=o[1],u=a.a.useRef(0),l=a.a.useRef(0),f=a.a.useMemo((function(){return e?Math.floor(e.arrowTimeline[e.arrowTimeline.length-1].offset)+1:0}),[e]),h=a.a.useRef(0),m=a.a.useMemo((function(){if(!e)return null;var t=e.bpmTimeline;return function(e){var n;for(n=h.current;t[n+1]&&t[n+1].time<e;n++);return h.current=n,(e-t[n].time)*t[n].bpm/60/4+t[n].offset}}),[e,h]),d=a.a.useCallback((function(){e&&(t.current=(new Date).getTime(),h.current=0,u.current=0,l.current=0,s(!0))}),[e,t,h,u,l,s]),p=a.a.useCallback((function(){s(!1)}),[s]);return a.a.useEffect((function(){p()}),[e,p]),Object(c.a)((function(){i&&m&&t.current&&(u.current=((new Date).getTime()-t.current)/1e3,l.current=m(u.current),l.current>=f&&p())}),[i,m,t,u,l,p]),[l,u,i,d,p]}},a3WO:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,"a",(function(){return r}))},dWXJ:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return s})),n.d(t,"c",(function(){return u})),n.d(t,"d",(function(){return h}));var r=n("o0o1"),o=n.n(r),a=n("ODXe"),c=n("HaE+"),i=null,s={tick:null,stop:null,bpm:null,shock:null,beat:null},u={normal:null,suppressed:null},l=[["normal",1],["suppressed",.25]],f=[["tick","/stepcharts/cursor12.mp3"],["stop","/stepcharts/cursor4.mp3"],["bpm","/stepcharts/cancel1.mp3"],["shock","/stepcharts/cursor7.mp3"],["beat","/stepcharts/cursor6.mp3"]],h=function(){var e=Object(c.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i){e.next=6;break}return t=new AudioContext,i=t,l.forEach((function(e){var n=Object(a.a)(e,2),r=n[0],o=n[1],c=new GainNode(t);c.gain.value=o,c.connect(t.destination),u[r]=c})),e.next=6,Promise.all(f.map(function(){var e=Object(c.a)(o.a.mark((function e(n){var r,c,i,u,l;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(a.a)(n,2),c=r[0],i=r[1],e.next=3,fetch(i);case 3:return u=e.sent,e.next=6,u.arrayBuffer();case 6:return l=e.sent,e.next=9,t.decodeAudioData(l);case 9:s[c]=e.sent;case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 6:return e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},kelf:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n("q1tI"),o=n.n(r),a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1?arguments[1]:void 0,n=o.a.useRef(),r=o.a.useCallback(e,t);o.a.useEffect((function(){return n.current=requestAnimationFrame((function e(){n.current=requestAnimationFrame(e),r()})),function(){n.current&&cancelAnimationFrame(n.current)}}),[r])}},vnkr:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[mix]/[title]/[type]",function(){return n("N+kb")}])}},[["vnkr",0,2,1]]]);