import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,X as n,Y as r}from"./lit-runtime-L6OV30Vo.js";import{Ur as i,Wr as a}from"./control-ui-boot-shared-Bm2ZxasE.js";import{ct as o,ot as s,st as c}from"./control-ui-boot-shared-BtDOT-1l.js";import{n as l,t as u}from"./image-with-fallback-Cgv1D5HR.js";function d(){return(d=e((()=>{})))()}function f(e,n,r,i={}){let a=r===`picker`?`tile`:r;return t`${u(i.pluginIconUrl,(s,l)=>{let[u,d]=s?[``,``]:c(e),f=`${r===`picker`?`--channels-art-size:24px;`:``}${s?``:`--channels-art-a:${u};--channels-art-b:${d}`}`,p=r===`cover`&&i.pluginIconUrl?` channels-cover--icon`:``;return t`<span
      class=${`channels-${a}${p}${s?``:` channels-${a}--fallback`}`}
      style=${f}
      aria-hidden="true"
    >
      ${s?t`<img src=${s} alt="" loading="lazy" decoding="async" @error=${l} />`:t`<span>${o(n)}</span>`}
    </span>`})}`}function p(){return(p=e((()=>{r(),s(),l()})))()}function m(e){return a({...e,className:`channel-picker`,renderLeading:e=>e.kind===`neutral`?n:f(e.value,e.label,`picker`)})}function h(){return(h=e((()=>{r(),p(),i()})))()}export{d as a,f as i,m as n,p as r,h as t};
//# sourceMappingURL=channel-picker-CRhWPJzN.js.map