_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[9],{BsWD:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var r=t("a3WO");function o(e,n){if(e){if("string"===typeof e)return Object(r.a)(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?Object(r.a)(e,n):void 0}}},"HaE+":function(e,n,t){"use strict";function r(e,n,t,r,o,a,c){try{var i=e[a](c),u=i.value}catch(s){return void t(s)}i.done?n(u):Promise.resolve(u).then(r,o)}function o(e){return function(){var n=this,t=arguments;return new Promise((function(o,a){var c=e.apply(n,t);function i(e){r(c,o,a,i,u,"next",e)}function u(e){r(c,o,a,i,u,"throw",e)}i(void 0)}))}}t.d(n,"a",(function(){return o}))},JePm:function(e,n,t){"use strict";var r=t("q1tI"),o=t.n(r),a=t("dWXJ"),c=t("kelf"),i=function(e,n){if(a.b&&e&&n){var t=new AudioBufferSourceNode(a.b);return t.buffer=n,t.connect(e),t.start(),!0}return!1};n.a=function(e){var n=e.chart,t=e.offsetRef,r=e.timeRef,u=e.enableBeatTick,s=o.a.useRef(0),l=o.a.useCallback((function(){u&&s.current<t.current&&i(a.c.suppressed,a.a.beat)&&(s.current=t.current-t.current%.25+.25)}),[u,t,s]),f=o.a.useRef(0),h=o.a.useCallback((function(){if(n.arrowTimeline[f.current]&&n.arrowTimeline[f.current].time<=r.current){if(n.arrowTimeline[f.current].direction.match(/M/))i(a.c.suppressed,a.a.shock);else{var e=n.arrowTimeline[f.current].direction.match(/[12].*[12]/);i(a.c.normal,a.a.tick),e&&i(a.c.normal,a.a.tick)}for(;n.arrowTimeline[f.current]&&n.arrowTimeline[f.current].time<=r.current;)f.current++}}),[r,f,n]),d=o.a.useRef(n.bpmTimeline.findIndex((function(e){return t.current<e.offset&&0===e.bpm}))),p=o.a.useCallback((function(){if(n.bpmTimeline[d.current]&&n.bpmTimeline[d.current].offset<=t.current)for(i(a.c.suppressed,a.a.stop);n.bpmTimeline[d.current]&&(0!==n.bpmTimeline[d.current].bpm||n.bpmTimeline[d.current].offset<=t.current);)d.current++}),[t,d,n]),m=o.a.useRef(0),v=o.a.useCallback((function(){t.current<m.current&&(s.current=t.current-t.current%.25,f.current=n.arrowTimeline.findIndex((function(e){return t.current<e.offset})),d.current=n.bpmTimeline.findIndex((function(e){return t.current<e.offset&&0===e.bpm})),s.current=n.bpmTimeline.findIndex((function(e){return t.current<e.offset&&0===e.bpm}))),m.current=t.current}),[t,m,n]);return Object(c.a)((function(){v(),l(),h(),p()}),[v,l,h,p]),null}},"N+kb":function(e,n,t){"use strict";t.r(n),t.d(n,"__N_SSG",(function(){return X}));var r=t("q1tI"),o=t.n(r),a=t("o0o1"),c=t.n(a),i=t("HaE+"),u=t("ODXe");function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(){return(l=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var f=t("kelf"),h=[{name:"OFF",shortName:"OFF"},{name:"LEFT",shortName:"\u2190"},{name:"RIGHT",shortName:"\u2192"},{name:"MIRROR",shortName:"\u21d4"},{name:"SHUFFLE1 (\u2192\u2191)",shortName:"?1"},{name:"SHUFFLE2 (\u2193\u2190)",shortName:"?2"},{name:"SHUFFLE3 (\u2191\u2190)",shortName:"?3"},{name:"SHUFFLE4 (\u2192\u2191)",shortName:"?4"},{name:"SHUFFLE5 (\u2191\u2193)",shortName:"?5"},{name:"SHUFFLE6 (\u2192\u2190)",shortName:"?6"},{name:"SHUFFLE1+LEFT",shortName:"?1 + \u2190"},{name:"SHUFFLE2+LEFT",shortName:"?2 + \u2190"},{name:"SHUFFLE3+LEFT",shortName:"?3 + \u2190"},{name:"SHUFFLE4+LEFT",shortName:"?4 + \u2190"},{name:"SHUFFLE5+LEFT",shortName:"?5 + \u2190"},{name:"SHUFFLE1+RIGHT",shortName:"?1 + \u2192"},{name:"SHUFFLE2+RIGHT",shortName:"?2 + \u2192"},{name:"SHUFFLE3+RIGHT",shortName:"?3 + \u2192"},{name:"SHUFFLE4+RIGHT",shortName:"?4 + \u2192"},{name:"SHUFFLE5+RIGHT",shortName:"?5 + \u2192"},{name:"SHUFFLE1+MIRROR",shortName:"?1 + \u21d4"},{name:"SHUFFLE2+MIRROR",shortName:"?2 + \u21d4"},{name:"SHUFFLE3+MIRROR",shortName:"?3 + \u21d4"},{name:"SHUFFLE4+MIRROR",shortName:"?4 + \u21d4"}],d={OFF:[0,1,2,3],LEFT:[2,0,3,1],RIGHT:[1,3,0,2],MIRROR:[3,2,1,0],"SHUFFLE1 (\u2192\u2191)":[0,1,3,2],"SHUFFLE2 (\u2193\u2190)":[1,0,2,3],"SHUFFLE3 (\u2191\u2190)":[2,1,0,3],"SHUFFLE4 (\u2192\u2191)":[0,3,2,1],"SHUFFLE5 (\u2191\u2193)":[0,2,1,3],"SHUFFLE6 (\u2192\u2190)":[3,1,2,0],"SHUFFLE1+LEFT":[3,0,2,1],"SHUFFLE2+LEFT":[2,1,3,0],"SHUFFLE3+LEFT":[0,2,3,1],"SHUFFLE4+LEFT":[2,0,1,3],"SHUFFLE5+LEFT":[1,0,3,2],"SHUFFLE1+RIGHT":[1,2,0,3],"SHUFFLE2+RIGHT":[0,3,1,2],"SHUFFLE3+RIGHT":[1,3,2,0],"SHUFFLE4+RIGHT":[3,1,0,2],"SHUFFLE5+RIGHT":[2,3,0,1],"SHUFFLE1+MIRROR":[2,3,1,0],"SHUFFLE2+MIRROR":[3,2,0,1],"SHUFFLE3+MIRROR":[3,0,1,2],"SHUFFLE4+MIRROR":[1,2,3,0]},p=o.a.createElement,m=13.5,v=16.875,b={4:"/stepcharts/arrow4.svg",6:"/stepcharts/arrow6.svg",8:"/stepcharts/arrow8.svg",12:"/stepcharts/arrow6.svg",16:"/stepcharts/arrow16.svg",24:"/stepcharts/arrow6.svg",32:"/stepcharts/arrow6.svg",64:"/stepcharts/arrow6.svg",other:"/stepcharts/arrow6.svg",shock:"/stepcharts/arrowShock.svg",freeze:"/stepcharts/arrowFreeze.svg"},g={4:"/stepcharts/arrow4.svg",6:"/stepcharts/arrow6.svg",8:"/stepcharts/arrow8.svg",12:"/stepcharts/arrow6.svg",16:"/stepcharts/arrow16.svg",24:"/stepcharts/arrow24.svg",32:"/stepcharts/arrow32.svg",64:"/stepcharts/arrow64.svg",other:"/stepcharts/arrowOther.svg",shock:"/stepcharts/arrowShock.svg",freeze:"/stepcharts/arrowFreeze.svg"},F={0:"-90deg",1:"180deg",2:"0",3:"90deg"},k=function(e,n){return 4*e*13.3*n+v},w=function(e){var n=e.offset,t=e.speed,r={position:"absolute",top:"".concat(k(n,t),"vh"),width:1,height:1};return p("div",{style:r})},y=function(e){var n=e.beat,t=e.direction,r=e.pos,o=e.highlight,a=void 0!==o&&o,c=e.verboseColors,i=void 0!==c&&c,u={position:"absolute",top:"".concat(r-6.75,"vh"),left:"".concat(t*m,"vh"),height:"".concat(m,"vh"),width:"".concat(m,"vh"),backgroundImage:"url(".concat(i?g[n]:b[n],")"),backgroundSize:"cover",backgroundColor:a?"#fff6":void 0,boxShadow:a?"0 0 ".concat(3.375,"vh #fff"):void 0,borderRadius:"".concat(6.75,"vh"),transform:"rotate(".concat(F[t],")")};return p("div",{style:u})},C=function(e){var n=e.direction,t=e.pos,r=e.endPos,a=e.diminished,c={position:"absolute",top:"".concat(t,"vh"),left:"".concat(n*m+.675,"vh"),height:"".concat(r-t,"vh"),width:"".concat(12.15,"vh"),backgroundColor:a?"#88ee4455":"#88ee44"},i={position:"absolute",top:"".concat(r,"vh"),left:"".concat(n*m+.675,"vh"),height:0,width:"".concat(12.15,"vh"),borderTop:"".concat(6.075,"vh solid ").concat(a?"#66cc2255":"#66cc22"),borderLeft:"".concat(6.075,"vh solid transparent"),borderRight:"".concat(6.075,"vh solid transparent")};return p(o.a.Fragment,null,p("div",{style:c}),p("div",{style:i}))},T=function(e){var n=e.pos,t=e.endPos,r=e.color,o=e.bgColor,a=e.value,c={position:"absolute",height:"".concat(t?t-n:0,"vh"),width:"".concat(54,"vh"),left:0,top:"".concat(n,"vh"),borderTop:r?"4px solid ".concat(r):void 0,backgroundColor:o};return p("div",{style:c},a&&p("div",{style:{position:"absolute",width:"100%",color:r,textAlign:"center",top:"4px"}},a))},O=function(){var e={position:"fixed",top:"".concat(10.125,"vh"),pointerEvents:"none"},n=function(e){return{display:"inline-block",height:"".concat(m,"vh"),width:"".concat(m,"vh"),backgroundImage:"url(/stepcharts/arrowJudge.svg)",backgroundSize:"cover",transform:"rotate(".concat(F[e],")")}};return p("div",{style:e},p("div",{style:n(0)}),p("div",{style:n(1)}),p("div",{style:n(2)}),p("div",{style:n(3)}))},E=function(e,n){return function(t){return k(n?t.time:t.offset,e)}},S=function(e){var n=e.chart,t=e.speed,r=void 0===t?1:t,a=e.showBeat,c=e.constantMode,i=e.soflanBg,u=e.soflanValue,s=E(r,c),l=n.mainBpm;return p(o.a.Fragment,null,a&&n.beatTimeline.map((function(e,n){return p(T,{key:"b".concat(n),pos:s(e),color:n%4===0?"#fffa":"#fff5"})})),n.bpmTimeline.map((function(e,t,r){var o,a=null!==(o=r[t+1])&&void 0!==o?o:n.beatTimeline[n.beatTimeline.length-1];return 0===t?l!==e.bpm&&p(T,{key:"ts".concat(t),pos:0,endPos:s(a),color:u?l<e.bpm?"#F6AA00":"#4DC4FF":void 0,bgColor:i?l<e.bpm?"#F6AA0044":"#4DC4FF44":void 0,value:u?e.bpm:void 0}):(r[t-1].bpm||r[t-2].bpm)<e.bpm?p(T,{key:"ts".concat(t),pos:s(e),endPos:l!==e.bpm?s(a):void 0,color:u?"#F6AA00":void 0,bgColor:i?l<e.bpm?"#F6AA0044":"#4DC4FF44":void 0,value:u?e.bpm:void 0}):e.bpm<(r[t-1].bpm||r[t-2].bpm)&&e.bpm>0?p(T,{key:"ts".concat(t),pos:s(e),endPos:l!==e.bpm?s(a):void 0,color:u?"#4DC4FF":void 0,bgColor:i?l<e.bpm?"#F6AA0044":"#4DC4FF44":void 0,value:u?e.bpm:void 0}):null})),n.bpmTimeline.map((function(e,n,t){return 0===e.bpm?p(T,{key:"ts".concat(n),pos:s(e),endPos:s(t[n+1]),color:u?"#FF8082":void 0,bgColor:i?"#FF808244":void 0}):null})))},R=function(e){var n=e.chart,t=e.canonicalChart,r=e.speed,a=void 0===r?1:r,c=e.turn,i=void 0===c?"OFF":c,u=e.constantMode,s=e.colorFreezes,f=e.diminishFreezes,h=e.highlightSoflan,m=e.verboseColors,v=e.canonicalColors,b=n.arrowTimeline[n.arrowTimeline.length-1],g=Math.floor(b.offset),F=E(a,u),k=function(e){return n.arrowTimeline[e].direction.match(/2/)&&!s?"freeze":v?t.arrowTimeline[e].beat:n.arrowTimeline[e].beat};return p(o.a.Fragment,null,n.freezeTimeline.map((function(e,n){return p(C,{key:"f".concat(n),direction:d[i][e.direction],pos:F(e.start),endPos:F(e.end),diminished:f})})).reverse(),n.arrowTimeline.map((function(e,n){var t={beat:"shock",highlight:h&&!!e.tags.soflanTrigger,pos:F(e)};return"MMMM"===e.direction&&p(o.a.Fragment,null,p(y,l({key:"s".concat(n,"l"),direction:d[i][0]},t)),p(y,l({key:"s".concat(n,"d"),direction:d[i][1]},t)),p(y,l({key:"s".concat(n,"u"),direction:d[i][2]},t)),p(y,l({key:"s".concat(n,"r"),direction:d[i][3]},t)))})).reverse(),n.arrowTimeline.map((function(e,n){return e.direction.match(/^..[12]./)&&p(y,{key:"a".concat(n,"u"),beat:k(n),direction:d[i][2],pos:F(e),highlight:h&&!!e.tags.soflanTrigger,verboseColors:m})})),n.arrowTimeline.map((function(e,n){var t={beat:k(n),pos:F(e),highlight:h&&!!e.tags.soflanTrigger,verboseColors:m};return p(o.a.Fragment,null,e.direction.match(/^[12].../)&&p(y,l({key:"a".concat(n,"l"),direction:d[i][0]},t)),e.direction.match(/^.[12]../)&&p(y,l({key:"a".concat(n,"d"),direction:d[i][1]},t)),e.direction.match(/^...[12]/)&&p(y,l({key:"a".concat(n,"r"),direction:d[i][3]},t)))})).reverse(),p(w,{offset:g+2,speed:a}))},H=o.a.memo(S),L=o.a.memo(R),U=function(e){var n=e.chart,t=e.canonicalChart,r=e.speed,a=void 0===r?1:r,c=e.turn,i=void 0===c?"OFF":c,u=e.offsetRef,s=e.timeRef,l=e.playing,h=e.showBeat,d=e.constantMode,m=void 0!==d&&d,b=e.colorFreezes,g=void 0!==b&&b,F=e.diminishFreezes,w=void 0!==F&&F,y=e.soflanBg,C=void 0!==y&&y,T=e.soflanValue,E=void 0!==T&&T,S=e.highlightSoflan,R=void 0!==S&&S,U=e.verboseColors,M=void 0!==U&&U,x=e.canonicalColors,I=void 0!==x&&x,N=e.children,j=o.a.useRef(null),P=o.a.useMemo((function(){if(j.current&&l){var e=j.current.getBoundingClientRect();return e.bottom-e.top}return 0}),[j,l]),B=o.a.useRef(),A=o.a.useRef();Object(f.a)((function(){j.current&&(u.current&&u.current!=B.current&&(B.current=u.current,m||(j.current.scrollTop=(k(u.current,a)-v)*P/100)),s.current&&s.current!=A.current&&m&&(j.current.scrollTop=(k(s.current,a)-v)*P/100))}),[j,u,s,B,A,a,P,m]);var z={position:"relative",width:"".concat(54,"vh"),margin:"auto"};return p("div",{style:{position:"relative",overflow:"scroll",backgroundColor:"black",height:"100vh",width:"100vw"},ref:j},p("div",{style:z},p(H,{chart:n,speed:a,showBeat:h,constantMode:m,soflanBg:C,soflanValue:E}),p(O,null),p(L,{chart:n,canonicalChart:t,speed:a,turn:i,constantMode:m,colorFreezes:g,diminishFreezes:w,highlightSoflan:R,verboseColors:M,canonicalColors:I}),N))},M=t("JePm"),x=t("Zd8l"),I=t("dWXJ"),N=o.a.createElement;function j(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function P(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?j(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):j(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var B=function(e){return Math.floor(620/e*4)/4},A=function(e){return e.arrowTimeline.reduce((function(e,n){return e+(4===n.beat?1:0)}),0)>=e.arrowTimeline.length/4},z=function(e){var n=e.chart,t=e.options,r=e.onChange,a=e.style,c=o.a.useCallback((function(e){return r(P(P({},t),{},{speed:Number(e.target.value)}))}),[t,r]),i=o.a.useCallback((function(e){return r(P(P({},t),{},{turn:e.target.value}))}),[t,r]),u=o.a.useCallback((function(e){return r(P(P({},t),{},{tick:e.target.checked}))}),[t,r]),s=o.a.useCallback((function(e){return r(P(P({},t),{},{constantMode:e.target.checked,speed:B(e.target.checked?240:t.canonicalMode?n.canonicalChart.mainBpm:n.chart.mainBpm)}))}),[t,r]),l=o.a.useCallback((function(e){return r(P(P({},t),{},{canonicalMode:e.target.checked,speed:B(t.constantMode?240:e.target.checked?n.canonicalChart.mainBpm:n.chart.mainBpm),tick:A(e.target.checked?n.canonicalChart:n.chart)}))}),[t,r]),f=o.a.useCallback((function(e){return r(P(P({},t),{},{colorFreezes:e.target.checked}))}),[t,r]),d=o.a.useCallback((function(e){return r(P(P({},t),{},{diminishFreezes:e.target.checked}))}),[t,r]),p=o.a.useCallback((function(e){return r(P(P({},t),{},{soflanBg:e.target.checked}))}),[t,r]),m=o.a.useCallback((function(e){return r(P(P({},t),{},{soflanValue:e.target.checked}))}),[t,r]),v=o.a.useCallback((function(e){return r(P(P({},t),{},{highlightSoflan:e.target.checked}))}),[t,r]),b=o.a.useCallback((function(e){return r(P(P({},t),{},{verboseColors:e.target.checked}))}),[t,r]),g=o.a.useCallback((function(e){return r(P(P({},t),{},{canonicalColors:e.target.checked}))}),[t,r]),F=t.canonicalMode?n.canonicalChart:n.chart,k=F.minBpm,w=F.mainBpm,y=F.maxBpm;return N("div",{style:a},N("div",null,"Speed:"," ",N("input",{type:"range",min:"0.25",max:"8",step:"0.25",value:t.speed,onInput:c}),"x",t.speed,t.constantMode?"(".concat(240*t.speed,")"):N(o.a.Fragment,null," (",k!==w?"".concat(k*t.speed,"-"):"",w*t.speed,w!==y?"-".concat(y*t.speed):"",")")),N("div",null,N("label",null,"\u30b9\u30af\u30ed\u30fc\u30eb\u901f\u5ea6\u3092\u4e00\u5b9a\u306b"," ",N("input",{type:"checkbox",checked:t.constantMode,onChange:s}))),N("div",null,"TURN:"," ",N("select",{value:t.turn,onInput:i},h.map((function(e){return N("option",{key:e.name,value:e.name},"TURN: ",e.name)})))),N("div",null,N("label",null,"\u30d5\u30ea\u30fc\u30ba\u3082\u8272\u5206\u3051\u3059\u308b"," ",N("input",{type:"checkbox",checked:t.colorFreezes,onChange:f}))),N("div",null,N("label",null,"\u30d5\u30ea\u30fc\u30ba\u306e\u68d2\u90e8\u5206\u3092\u63a7\u3048\u3081\u306b\u8868\u793a"," ",N("input",{type:"checkbox",checked:t.diminishFreezes,onChange:d}))),N("div",null,N("label",null,"\u4f4e\u901f\u30fb\u9ad8\u901f\u5730\u5e2f\u3092\u8272\u5206\u3051"," ",N("input",{type:"checkbox",checked:t.soflanBg,onChange:p}))),N("div",null,N("label",null,"\u30bd\u30d5\u30e9\u30f3\u7b87\u6240\u306b\u76ee\u5370\u3092\u8868\u793a"," ",N("input",{type:"checkbox",checked:t.soflanValue,onChange:m}))),N("div",null,N("label",null,"\u30bd\u30d5\u30e9\u30f3\u76f4\u524d\u306e\u30ce\u30fc\u30c8\u3092\u30cf\u30a4\u30e9\u30a4\u30c8"," ",N("input",{type:"checkbox",checked:t.highlightSoflan,onChange:v}))),N("div",null,N("label",null,"24 \u5206\u4ee5\u4e0b\u306e\u30ce\u30fc\u30c8\u3082\u8272\u5206\u3051"," ",N("input",{type:"checkbox",checked:t.verboseColors,onChange:b}))),N("div",null,N("label",null,"\u5c0f\u7bc0\u7dda\u3092\u8868\u793a\uff06\u30e1\u30c8\u30ed\u30ce\u30fc\u30e0\u3092\u518d\u751f"," ",N("input",{type:"checkbox",checked:t.tick,onChange:u}))),N("div",null,N("label",null,"\u8272\u5206\u3051\u3092\u30bd\u30d5\u30e9\u30f3\u306b\u8ffd\u5f93\uff08\u03b2\uff1a\u4e00\u90e8\u306e\u8b5c\u9762\u3067\u975e\u5bfe\u5fdc\uff09"," ",N("input",{type:"checkbox",checked:t.canonicalColors,onChange:g}))),N("div",null,N("label",null,"show canonical chart\uff08\u203b\u30c7\u30d0\u30c3\u30b0\u7528\uff09"," ",N("input",{type:"checkbox",checked:t.canonicalMode,onChange:l}))))},D=function(e){var n=e.onPlay,t=e.onPause,r=e.onOpenOptions,o=e.onCloseOptions,a=e.playing,c=e.opened,i={color:"white",fontWeight:"bold",backgroundColor:"#ea0",borderRadius:"0.75em",padding:"0.5em 0.75em",border:"none",marginRight:"1em"};return N("div",null,N("button",{onClick:a?t:n,style:i},a?"STOP":"PLAY"),N("button",{onClick:c?o:r,style:i},c?"x CLOSE":"OPTIONS"))},_=function(e){var n=e.chart,t=o.a.useState(!1),r=Object(u.a)(t,2),a=r[0],s=r[1],l=o.a.useState({speed:B(n.chart.mainBpm),turn:"OFF",tick:A(n.chart),constantMode:!1,colorFreezes:!0,diminishFreezes:!0,soflanBg:!0,soflanValue:!0,highlightSoflan:!0,verboseColors:!0,canonicalColors:!1,canonicalMode:!1}),f=Object(u.a)(l,2),h=f[0],d=f[1],p=Object(x.a)(h.canonicalMode?n.canonicalChart:n.chart),m=Object(u.a)(p,5),v=m[0],b=m[1],g=m[2],F=m[3],k=m[4],w=o.a.useCallback((function(){return s(!1)}),[s]),y=o.a.useCallback((function(){return s(!0)}),[s]),C=o.a.useCallback(Object(i.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(I.d)();case 2:F();case 3:case"end":return e.stop()}}),e)}))),[F]),T={position:"fixed",textAlign:"center",bottom:"1em",width:"".concat(54,"vh")};return N(o.a.Fragment,null,N(U,{chart:h.canonicalMode?n.canonicalChart:n.chart,canonicalChart:n.canonicalChart,speed:h.speed,offsetRef:v,timeRef:b,playing:g,turn:h.turn,showBeat:h.tick,constantMode:h.constantMode,colorFreezes:h.colorFreezes,diminishFreezes:h.diminishFreezes,soflanBg:h.soflanBg,soflanValue:h.soflanValue,highlightSoflan:h.highlightSoflan,verboseColors:h.verboseColors,canonicalColors:h.canonicalColors},N("div",{style:T},a&&N(z,{chart:n,options:h,onChange:d,style:{textAlign:"left",padding:"1em",marginBottom:"1em",background:"#ffffffa0",lineHeight:"2"}}),N(D,{playing:g,opened:a,onPlay:C,onPause:k,onOpenOptions:y,onCloseOptions:w}))),N(M.a,{chart:h.canonicalMode?n.canonicalChart:n.chart,offsetRef:v,timeRef:b,enableBeatTick:h.tick}))},G=o.a.createElement,X=!0;n.default=function(e){var n=e.chart;return G(_,{chart:n})}},ODXe:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var r=t("BsWD");function o(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(t.push(c.value),!n||t.length!==n);r=!0);}catch(u){o=!0,a=u}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return t}}(e,n)||Object(r.a)(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},Zd8l:function(e,n,t){"use strict";t.d(n,"a",(function(){return i}));var r=t("ODXe"),o=t("q1tI"),a=t.n(o),c=t("kelf"),i=function(e){var n=a.a.useRef(),t=a.a.useState(!1),o=Object(r.a)(t,2),i=o[0],u=o[1],s=a.a.useRef(0),l=a.a.useRef(0),f=a.a.useMemo((function(){return e?Math.floor(e.arrowTimeline[e.arrowTimeline.length-1].offset)+1:0}),[e]),h=a.a.useRef(0),d=a.a.useMemo((function(){if(!e)return null;var n=e.bpmTimeline;return function(e){var t;for(t=h.current;n[t+1]&&n[t+1].time<e;t++);return h.current=t,(e-n[t].time)*n[t].bpm/60/4+n[t].offset}}),[e,h]),p=a.a.useCallback((function(){e&&(n.current=(new Date).getTime(),h.current=0,s.current=0,l.current=0,u(!0))}),[e,n,h,s,l,u]),m=a.a.useCallback((function(){u(!1)}),[u]);return a.a.useEffect((function(){m()}),[e,m]),Object(c.a)((function(){i&&d&&n.current&&(s.current=((new Date).getTime()-n.current)/1e3,l.current=d(s.current),l.current>=f&&m())}),[i,d,n,s,l,m]),[l,s,i,p,m]}},a3WO:function(e,n,t){"use strict";function r(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}t.d(n,"a",(function(){return r}))},dWXJ:function(e,n,t){"use strict";t.d(n,"b",(function(){return i})),t.d(n,"a",(function(){return u})),t.d(n,"c",(function(){return s})),t.d(n,"d",(function(){return h}));var r=t("o0o1"),o=t.n(r),a=t("ODXe"),c=t("HaE+"),i=null,u={tick:null,stop:null,bpm:null,shock:null,beat:null},s={normal:null,suppressed:null},l=[["normal",1],["suppressed",.25]],f=[["tick","/stepcharts/cursor12.mp3"],["stop","/stepcharts/cursor4.mp3"],["bpm","/stepcharts/cancel1.mp3"],["shock","/stepcharts/cursor7.mp3"],["beat","/stepcharts/cursor6.mp3"]],h=function(){var e=Object(c.a)(o.a.mark((function e(){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i){e.next=6;break}return n=new AudioContext,i=n,l.forEach((function(e){var t=Object(a.a)(e,2),r=t[0],o=t[1],c=new GainNode(n);c.gain.value=o,c.connect(n.destination),s[r]=c})),e.next=6,Promise.all(f.map(function(){var e=Object(c.a)(o.a.mark((function e(t){var r,c,i,s,l;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(a.a)(t,2),c=r[0],i=r[1],e.next=3,fetch(i);case 3:return s=e.sent,e.next=6,s.arrayBuffer();case 6:return l=e.sent,e.next=9,n.decodeAudioData(l);case 9:u[c]=e.sent;case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()));case 6:return e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},kelf:function(e,n,t){"use strict";t.d(n,"a",(function(){return a}));var r=t("q1tI"),o=t.n(r),a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},n=arguments.length>1?arguments[1]:void 0,t=o.a.useRef(),r=o.a.useCallback(e,n);o.a.useEffect((function(){return t.current=requestAnimationFrame((function e(){t.current=requestAnimationFrame(e),r()})),function(){t.current&&cancelAnimationFrame(t.current)}}),[r])}},vnkr:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[mix]/[title]/[type]",function(){return t("N+kb")}])}},[["vnkr",0,2,1]]]);