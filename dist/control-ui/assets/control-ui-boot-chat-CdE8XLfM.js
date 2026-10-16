import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ci as t,Eu as n,ju as r,m as i,p as a}from"./control-ui-core-bJHyI7AF.js";import{Wr as o,na as s,ra as c}from"./control-ui-core-DNh4McGE.js";import{$ as l,X as u,Y as d}from"./lit-runtime-DyST807n.js";import{dn as f}from"./control-ui-boot-shared-CE7ueCxh.js";import{et as p,tt as m}from"./control-ui-boot-shared-DsSYH3B6.js";import{fs as h,ls as g,os as _}from"./control-ui-boot-shared-C1PHuQAX.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{dr as v,fr as y}from"./control-ui-boot-chat-DfNf0poH.js";import"./chat-transcript-styles-Dzr3t9kA.js";import"./control-ui-boot-chat-styles-BRrYkFSc.js";var b;function x(){return(x=e((()=>{b=`wa-dropdown.session-menu::part(menu){padding:var(--menu-padding);border:1px solid var(--overlay-border);border-radius:var(--menu-radius);background:var(--bg-elevated);box-shadow:var(--overlay-shadow)}:is(.session-menu wa-dropdown-item,.session-menu__item,.sidebar-session-sort-menu__item){font:inherit;font-size:calc(13px * var(--control-ui-text-scale))}.session-menu__item,.sidebar-session-sort-menu__item{box-sizing:border-box;width:100%;min-height:var(--menu-item-height);border-radius:var(--menu-item-radius);color:var(--text);text-align:left;background:0 0;border:none;align-items:center;gap:8px;padding:0 8px;display:flex}.row.session-menu__label{gap:8px}.session-menu__status{max-width:min(300px,100vw - 48px);color:var(--text);font-size:calc(13px * var(--control-ui-text-scale));align-items:baseline;gap:8px;padding:8px;display:flex}.session-menu__status .session-menu__text{white-space:normal}wa-dropdown-item.session-menu__item{--wa-color-neutral-fill-normal:var(--bg-hover);gap:0}wa-dropdown-item.session-menu__item::part(icon){align-items:center;display:flex}wa-dropdown-item.session-menu__item::part(submenu-icon){color:var(--muted);font-size:10px;inset-inline-end:8px}.session-menu__item[aria-expanded=true],.session-menu__item:focus-visible,.sidebar-session-sort-menu__item:focus-visible{background:var(--bg-hover)}@media (hover:hover){.session-menu__item:hover:not(:disabled):not([aria-disabled=true]),.sidebar-session-sort-menu__item:hover{background:var(--bg-hover)}}.session-menu__item:disabled,.session-menu__item[aria-disabled=true]{opacity:.42;cursor:not-allowed}.session-menu__item--destructive,.session-menu__item--destructive .session-menu__icon{color:var(--danger)}.sidebar-session-sort-menu__item::part(checkmark){display:none}.session-menu__icon,.session-menu__avatar,.session-menu__check{flex:none;justify-content:center;align-items:center;width:14px;height:14px;display:inline-flex}.session-menu__check{color:var(--accent)}.session-menu__icon{color:var(--muted)}.session-menu__avatar,.session-menu__avatar .viewer-avatar{width:24px;height:24px;font-size:10px}.session-menu__icon svg,.session-menu__check svg{stroke:currentColor;fill:none;stroke-width:1.7px;stroke-linecap:round;stroke-linejoin:round;width:14px;height:14px}wa-dropdown-item.session-menu__item:not([disabled]):not([aria-disabled=true]){cursor:var(--cursor-action)}wa-dropdown-item.session-menu__item[data-new-tab-action]:not([disabled],[aria-disabled=true]){cursor:pointer}@supports (corner-shape:superellipse(1.5)){wa-dropdown.session-menu{--menu-radius:calc(10px * var(--openclaw-corner-radius-scale));--menu-item-radius:calc(var(--menu-radius) - var(--menu-padding))}wa-dropdown.session-menu::part(menu){corner-shape:superellipse(1.5)}}.people-menu__search{z-index:1;background:var(--bg-elevated);padding:6px 8px;position:sticky;top:0}.people-menu__search input{box-sizing:border-box;border:1px solid var(--border);border-radius:var(--menu-item-radius);background:var(--bg);width:100%;min-width:0;color:var(--text);font:inherit;padding:6px 8px}.people-menu__status{color:var(--muted);padding:6px 8px;font-size:11px}wa-dropdown-item.people-menu__submenu::part(submenu){overscroll-behavior:contain;width:min(320px,100vw - 24px);max-height:min(420px,60vh);overflow-y:auto}`})))()}function S(){return(S=e((()=>{})))()}function C(e,t){let[n,i]=D[e],a=r(n);return l`<span
    class="${t} settings-status settings-status--${i}"
    data-plugin-state=${e}
    role="img"
    aria-label=${a}
    title=${a}
  >
    <span class="settings-status__dot" aria-hidden="true"></span>
  </span>`}function w(){return l`<span
    class="plugin-official-badge"
    role="img"
    aria-label=${r(`pluginsPage.official`)}
    title=${r(`pluginsPage.official`)}
    >${s.badgeCheck}</span
  >`}function T(e,t={}){if(!e)return u;let n=e.replace(/^@+/,``),r=`@${n}`;return t.linked?l`<a
        class="plugin-card-author plugin-card-author--linked"
        href=${`https://clawhub.ai/${encodeURIComponent(n)}`}
        target="_blank"
        rel="noopener noreferrer"
        >${r}</a
      >`:l`<span class="plugin-card-author">${r}</span>`}function E(e){return l`<p class="installed-plugins-card__summary">${e}</p>`}var D;function O(){return(O=e((()=>{d(),c(),n(),v(),y(),D={enabled:[`pluginsPage.enabled`,`ok`],disabled:[`pluginsPage.disabled`,`muted`],"needs-setup":[`pluginsPage.setupRequiredNotice`,`warn`],error:[`pluginsPage.needsAttention`,`danger`]}})))()}function k(e){return{resourceBasePath:e.resourceBasePath,gatewayUrl:e.gateway.connection.gatewayUrl,auth:{hello:e.gateway.snapshot.hello,settings:{token:e.gateway.connection.token},password:e.gateway.connection.password}}}var A;function j(){return(j=e((()=>{h(),A=class{constructor(e){this.host=e,this.misses=new Set,this.requests=new Map,this.urls={},this.isLoading=e=>this.requests.has(e)}syncCatalog(e,t=[],n){let r=new Set([...e.flatMap(e=>e.catalog.imageUrl?[e.catalog.imageUrl]:[]),...t]);this.reconcileKeys(r);for(let t of e)t.catalog.imageUrl&&(!n||n.has(t.id)||t.local.pluginId&&n.has(t.local.pluginId))&&this.load(t.catalog.imageUrl);for(let e of t)this.load(e)}reconcile(e){let t=new Set((e?.plugins??[]).filter(e=>e.hasIcon).map(e=>e.id));this.reconcileKeys(t)}reconcileKeys(e){let t={...this.urls},n=!1;for(let[r,i]of Object.entries(t))e.has(r)||(URL.revokeObjectURL(i),delete t[r],n=!0);n&&this.host.kind!==`catalog`&&this.publish(t);for(let[t,n]of this.requests)e.has(t)||(clearTimeout(n.timeout),n.controller.abort(),this.requests.delete(t),this.host.onLoadingChange?.());if(this.host.kind===`catalog`){n&&this.publish(t);return}for(let t of this.misses)e.has(t)||this.misses.delete(t)}reset(){for(let e of this.requests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.urls))URL.revokeObjectURL(e);this.requests.clear(),this.host.onLoadingChange?.(),this.misses.clear(),(this.host.kind!==`catalog`||Object.keys(this.urls).length>0)&&this.publish({})}sync(e,t){for(let n of e?.plugins??[])n.hasIcon&&t.has(n.id)&&this.load(n.id)}load(e){!this.urls[e]&&!this.misses.has(e)&&!this.requests.has(e)&&this.fetch(e)}handleError(e){this.invalidate(e),this.misses.add(e)}invalidate(e){let t=this.requests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.requests.delete(e),this.host.onLoadingChange?.());let n=this.urls[e];n&&URL.revokeObjectURL(n);let r={...this.urls};delete r[e],this.publish(r),this.misses.delete(e)}publish(e){this.urls=e,this.host.onUrlsChange(e)}fetch(e){let t=new AbortController,n=this.host.kind===`catalog`?void 0:setTimeout(()=>t.abort(this.host.timeoutError?.()??new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.requests.set(e,r),this.host.onLoadingChange?.();let i=this.host.getFetchContext();(this.host.fetchIcon?this.host.fetchIcon(e,i,t.signal):this.host.kind===`catalog`?_({iconUrl:e,...i,signal:t.signal}):g({pluginId:e,...i,signal:t.signal})).then(t=>{if(this.requests.get(e)!==r||!this.host.isConnected(e)){t&&URL.revokeObjectURL(t);return}t?this.publish({...this.urls,[e]:t}):this.misses.add(e)}).catch(()=>{this.requests.get(e)===r&&(this.host.kind!==`catalog`||!t.signal.aborted)&&this.misses.add(e)}).finally(()=>{clearTimeout(n),this.requests.get(e)===r&&(this.requests.delete(e),this.host.onLoadingChange?.())})}}})))()}function M(){return(M=e((()=>{})))()}function N(){return(N=e((()=>{})))()}function P(){return(P=e((()=>{})))()}function F(e,t){if(!(e.currentTarget instanceof t))throw TypeError(`Skill library listener requires ${t.name}.`);return e.currentTarget}function I(){return(I=e((()=>{})))()}function L(e){if(e.encoding!==`base64`)return e.content;try{let t=Uint8Array.from(atob(e.content),e=>e.charCodeAt(0)),n=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}).decode(t);return n.includes(`\0`)?null:n}catch{return null}}async function R(e,n){if(a(n),e.length>256||e.some(e=>e.size>1048576)||e.reduce((e,t)=>e+t.size,0)>8388608)throw Error(r(`skillLibrary.bundleLimit`));let i,o=[];for(let r of e){a(n);let e=r.webkitRelativePath?r.webkitRelativePath.split(`/`).slice(1).join(`/`):r.name,s=new Uint8Array(await r.arrayBuffer());a(n),e===`SKILL.md`?i=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}).decode(s):o.push({path:e,content:t(s),encoding:`base64`})}if(i===void 0)throw Error(r(`skillLibrary.missingSkill`));return{content:i,files:o}}async function z(e,n,i,o,s){if(a(s),n.size<1||n.size>8388608)throw Error(r(`skillLibrary.bundleLimit`));let c=new Uint8Array(await n.arrayBuffer());a(s);let l=Array.from(new Uint8Array(await crypto.subtle.digest(`SHA-256`,c)),e=>e.toString(16).padStart(2,`0`)).join(``),u=t=>{if(a(s),!o())throw Error(r(`skillLibrary.connectionChanged`));return e.request(`skills.library.upload`,t)},d=await u({action:`begin`,slug:i,sizeBytes:c.length,sha256:l});if(!(`uploadId`in d))throw Error(r(`skillLibrary.uploadFailed`));let f=d.offset;for(;f<c.length;){let e=Math.min(f+d.maxChunkBytes,c.length),n=await u({action:`chunk`,uploadId:d.uploadId,offset:f,data:t(c.subarray(f,e))});if(!(`offset`in n)||n.offset!==e)throw Error(r(`skillLibrary.uploadFailed`));f=n.offset}let p=await u({action:`commit`,uploadId:d.uploadId});if(!(`state`in p))throw Error(r(`skillLibrary.uploadFailed`));return p}function B(){return(B=e((()=>{f(),n(),p(),i(),m()})))()}function V(e){return l`<details class="muted" style="overflow-wrap: anywhere; min-width: 0;">
    <summary>${r(`skillLibrary.technicalDetails`)}</summary>
    <dl>
      <dt>${r(`skillLibrary.skillId`)}</dt>
      <dd>${e.skillId}</dd>
      <dt>${r(`skillLibrary.revision`)}</dt>
      <dd>${e.revision}</dd>
      <dt>${r(`skillLibrary.command`)}</dt>
      <dd>${e.name}</dd>
    </dl>
  </details>`}function H(e,t,n=!1){return l`<div class="exec-approval-header">
    <strong class="exec-approval-title">${e}</strong
    ><button
      type="button"
      class="btn btn--icon btn--ghost"
      aria-label=${r(`common.close`)}
      ?disabled=${n}
      @click=${t}
    >
      ${s.x}
    </button>
  </div>`}function U(e){let{read:t}=e,n=t.files.find(t=>t.path===e.file),i=e.file===`SKILL.md`?t.content:n?L(n):null;return l`<openclaw-modal-dialog
    label=${t.entry.slug}
    style="--openclaw-modal-width: 960px;"
    @modal-cancel=${e.onClose}
  >
    <div class="exec-approval-card skill-reader-dialog">
      ${H(t.entry.slug,e.onClose)}
      <div
        class="skill-reader-dialog__body"
        style="display: grid; gap: var(--space-4); min-width: 0;"
      >
        <p>
          ${r(`skillLibrary.ownerRevision`,{owner:t.entry.ownerLabel,revision:t.entry.revision.slice(0,8)})}
        </p>
        <p class="muted">${r(`skillLibrary.session.readOnly`)}</p>
        <label class="field"
          ><span>${r(`skillLibrary.file`)}</span
          ><select
            class="settings-select"
            .value=${e.file}
            @change=${t=>e.onFile(F(t,HTMLSelectElement).value)}
          >
            <option value="SKILL.md" ?selected=${e.file===`SKILL.md`}>SKILL.md</option>
            ${t.files.map(t=>l`<option value=${t.path} ?selected=${e.file===t.path}>
                  ${t.path}
                </option>`)}
          </select></label
        >
        ${i===null?l`<p class="muted">${r(`skillLibrary.binaryRead`)}</p>`:l`<label class="field"
                ><span>${e.file}</span
                ><textarea
                  class="settings-input"
                  readonly
                  spellcheck="false"
                  rows="16"
                  style="font-family: var(--mono); min-width: 0; max-width: 100%; box-sizing: border-box; resize: vertical;"
                  .value=${i}
                ></textarea>
              </label>`}
        ${V(t.entry)}
      </div>
    </div>
  </openclaw-modal-dialog>`}function W(){return(W=e((()=>{d(),c(),n(),B(),o()})))()}function G(){return(G=e((()=>{})))()}function K(){return(K=e((()=>{})))()}export{C,b as E,w as S,x as T,j as _,V as a,T as b,L as c,I as d,F as f,A as g,M as h,H as i,R as l,N as m,G as n,U as o,P as p,W as r,B as s,K as t,z as u,k as v,S as w,E as x,O as y};
//# sourceMappingURL=control-ui-boot-chat-CdE8XLfM.js.map