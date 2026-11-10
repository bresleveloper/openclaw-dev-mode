import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{I as t,J as n,L as r,M as i,V as a,Z as o,k as s,q as c,z as l}from"./lit-runtime-DICwFbCm.js";import{Ri as u,zi as d}from"./control-ui-boot-shared-BxV-1cRX.js";import{Tr as f}from"./control-ui-boot-chat-Dq3Hgrse.js";import"./control-ui-boot-chat-styles-lxp0URNv.js";import{en as p,tn as m}from"./control-ui-boot-chat-DNAozmsG.js";import{n as h,r as g,t as _}from"./hub-tabs-focus-CvxBdjKg.js";import{n as v,t as y}from"./hub-tabs--qQkaeEf.js";function b(e){let t=e.variant??`primary`,r=e.requestedActive??e.active,a=`oc-tabs hub-tabs hub-tabs--${t} ${e.id}-hub-tabs${e.carapace?` oc-segmented`:``}${e.className?` ${e.className}`:``}`,s=e.active===null?e.tabs.find(e=>!e.disabled)?.value:null;return o`
    <div
      role="tablist"
      class=${a}
      aria-label=${e.ariaLabel}
      ${S({active:e.active,activation:`manual`,onActivate:(t,n,i)=>{let a=e.tabs.find(e=>e.value===t);return!a||a.value===r?!1:(i instanceof KeyboardEvent&&g(e.id,a.value,n),e.onSelect(a.value),e.onActivate?.(n),!1)}},[y])}
    >
      ${e.tabs.map(t=>{let r=e.active===t.value;return o`
          <button
            type="button"
            role="tab"
            id=${`${e.id}-tab-${t.value}`}
            data-tab-value=${t.value}
            aria-controls=${e.panelId}
            class="oc-tab hub-tab ${e.carapace?`oc-segmented-item`:``}"
            ?active=${r}
            ?disabled=${t.disabled}
            .tabIndex=${r||t.value===s?0:-1}
            aria-selected=${r?`true`:`false`}
            data-test-id=${t.testId??n}
            ${r?i(n=>h(e.id,t.value,n)):n}
          >
            ${t.label}${t.count==null?n:o`<span class="hub-tab__badge hub-tab__badge--count">${t.count}</span>`}${t.badge==null?n:o`<span class="hub-tab__badge">${t.badge}</span>`}
          </button>
        `})}
    </div>
  `}var x,S;function C(){return(C=e((()=>{c(),t(),a(),s(),_(),d(),v(),p(),x=class extends r{#e;#t={};#n;#r=0;#i=[m];#a;render(e,t){return n}update(e,[t,r=[]]){this.#e=e.element,this.#t=t;let i=[m,...r];return(i.length!==this.#i.length||i.some((e,t)=>e!==this.#i[t]))&&(this.#a?.dispose(),this.#a=void 0,this.#i=i),this.#o(),n}#o(){if(!this.isConnected||!this.#e)return;this.#n??=f(this.#e,()=>this.#t);let e=++this.#r;queueMicrotask(()=>{e===this.#r&&this.isConnected&&(this.#e&&(this.#a??=u(this.#e,this.#i),this.#a.sync()),this.#n?.sync())})}disconnected(){this.#r+=1,this.#n?.dispose(),this.#n=void 0,this.#a?.dispose(),this.#a=void 0}reconnected(){this.#o()}},S=l(x)})))()}export{b as n,C as t};
//# sourceMappingURL=hub-tabs-Bod6lJ4K.js.map