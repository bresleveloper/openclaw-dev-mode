const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./chat-html-preview-element-DxUO_1oV.js","./gateway-runtime-DiNPDWPd.js","./session-snapshot-database-I03lE5X1.js","./control-ui-boot-shared-DSyxl38Y.js","./control-ui-boot-shared-BEmZVSlQ.js","./control-ui-boot-shared-DLsWb7wf.js","./config-runtime-BecGLziM.js","./markdown-runtime-ORQpioyT.js","./sidebar-update-runtime-sgX81en4.js","./plugin-contracts-runtime-CKj0EbqY.js","./control-ui-boot-chat-Bwz7X55z.js","./control-ui-boot-chat-D67RfeWw.js","./control-ui-boot-chat-CNnFKzxu.js","./chat-transcript-styles-Dzr3t9kA.js","./control-ui-boot-chat-styles-BRrYkFSc.js","./widget-sandbox-host-BXErDP-E.js","./control-ui-core-yIvVj14Y.css","./control-ui-boot-shared-styles-DKyMAG_6.css","./control-ui-boot-shared-CXHNz0Bh.css","./sidebar-update-runtime-ah7rgQE7.css","./chat-transcript-styles-B_dd5Ueo.css","./control-ui-boot-chat-styles-C_Ls1c0m.css","./control-ui-boot-chat-mLz7NUiY.css","./mcp-app-view-registration-Lm3i4Isn.js","./mcp-app-routing-BenfSU5F.js","./mcp-app-confirm-C2ArMjUP.js","./file-editor-view-xypOnULa.js","./dist-DDaNsWmU.js","./code-language-wiu2A7nd.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Fs as i,Ru as a,Su as o,Tu as s,Xr as c,Yr as l,du as u,ju as d,kc as f,nl as ee,pu as p,tl as te}from"./control-ui-core-CTSdBcaH.js";import{Ai as ne,Hi as re,Ii as ie,Pi as ae,Ri as m,Ti as oe,Ui as se,Vi as h,cr as ce,n as le,na as g,oi as ue,r as de,ra as _,si as v,sr as y,wi as fe}from"./control-ui-core-vFnxmx94.js";import{$ as b,C as pe,T as x,X as S,Y as C,ct as w,d as T,h as E,j as me,k as he,nt as D,p as ge,r as _e,t as ve,u as O,ut as k}from"./lit-runtime-TNZj1e-P.js";import{Cr as ye,Dr as be,Er as A,Sr as xe,Tr as Se,ia as Ce,ji as we,ki as Te,mt as Ee,sa as j,wr as De}from"./control-ui-boot-shared-D4E0xCZu.js";import{Wi as Oe,Xr as ke,Zr as Ae,hi as je,ii as M,oa as N,sa as P}from"./ui-CnRtCcYL.js";import{M as Me,O as Ne,k as Pe}from"./control-ui-boot-shared-kUERtt7j.js";import{An as Fe,At as Ie,Bt as Le,Ht as Re,Jr as ze,Kt as Be,On as Ve,Ut as He,Vt as Ue,Yr as We,bi as Ge,bt as Ke,in as qe,jn as Je,jt as Ye,kt as Xe,ni as Ze,on as Qe,ri as $e,vt as et}from"./control-ui-boot-shared-DeF_v3ER.js";import{$o as F,Cs as I,D as tt,Es as nt,Go as rt,Ho as it,Jo as at,Ko as ot,Ks as st,Qo as ct,Ss as lt,T as ut,Ts as dt,Uo as ft,Xo as pt,Yo as mt,Zo as L,bs as R,es as z,qo as ht,qs as gt,vs as _t,ws as vt}from"./control-ui-boot-shared-flpXqVdL.js";import{p as yt}from"./control-ui-boot-shared-BIBfFukq.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{It as bt,Lt as xt,_t as B,ar as St,gt as V,ht as Ct,ir as wt,mt as Tt,nr as Et}from"./control-ui-boot-chat-CHJjvSiu.js";import{Cn as H,Sn as Dt,_n as Ot,bn as kt,dr as At,fr as jt,gn as Mt,hn as Nt,hr as Pt,mr as Ft,pr as It,vn as Lt,xn as Rt,yn as zt}from"./control-ui-boot-chat-C7HFnbgz.js";var Bt;function Vt(){return(Vt=e((()=>{r(),p(),Bt=class{constructor(e,t,n){this.host=e,this.content=t,this.runtime=n,this.error=null,this.request=null,this.onDownload=async()=>{let e=this.content();if(e?.kind!==`attachment`||!e.download||this.request)return;let t=new AbortController,{connectionEpoch:n,sessionKey:r,agentId:i}=this.runtime();this.request=t,this.error=null,this.host.requestUpdate();let a=()=>{let a=this.runtime();return this.host.isConnected&&this.content()===e&&this.request===t&&a.connectionEpoch===n&&a.sessionKey===r&&a.agentId===i&&!t.signal.aborted};try{let n=await e.download(t.signal);if(!a())return;if(!n)throw Error(d(`chat.attachments.unavailable`));Ee(e.title,n)}catch(e){a()&&(this.error=u(e))}finally{this.request===t&&(this.request=null,this.host.requestUpdate())}}}get pending(){return this.request!==null}cancel(){(this.request||this.error!==null)&&(this.request?.abort(),this.request=null,this.error=null,this.host.requestUpdate())}}})))()}var Ht;function Ut(){return(Ut=e((()=>{c(),Ht=class{constructor(e,t){this.host=e,this.content=t,this.feedback={},this.attempts=new Map,this.timers=new Map,this.copy=e=>{let t=this.content();if(t?.kind!==`file`)return;let n=(this.attempts.get(e)??0)+1;this.attempts.set(e,n);let r=()=>this.attempts.get(e)===n&&this.content()===t&&this.host.isConnected;l(e===`path`?t.path:t.content,r).then(t=>{r()&&(this.feedback={...this.feedback,[e]:t?`copied`:`failed`},this.host.requestUpdate(),globalThis.clearTimeout(this.timers.get(e)),this.timers.set(e,globalThis.setTimeout(()=>{this.timers.delete(e),this.feedback={...this.feedback,[e]:void 0},this.host.requestUpdate()},t?1500:2e3)))})},e.addController(this)}reset(){for(let e of this.timers.values())globalThis.clearTimeout(e);this.timers.clear();for(let[e,t]of this.attempts)this.attempts.set(e,t+1);this.feedback={},this.host.isConnected&&this.host.requestUpdate()}hostConnected(){this.reset()}hostDisconnected(){this.reset()}}})))()}function Wt(e,t){return e.split(`;`,1)[0]?.trim().toLowerCase()===`text/html`||/\.html?$/i.test(t)}function Gt(e,t,n,r,i,a){e.requestWhileActive(U,!0);let o=e.visibleState;return b`
    ${o?.status===`error`?v({error:o.error,stale:o.stale,onRetry:()=>e.retry()}):o?b`<div role="status">${d(`common.loading`)}</div>`:S}
    <openclaw-chat-html-preview
      .html=${t}
      .sourceIdentity=${n}
      .title=${r}
      .embedSandboxMode=${i}
      .sessionFileSource=${a}
    ></openclaw-chat-html-preview>
  `}var U,Kt;function W(){return(W=e((()=>{C(),ie(),m(),ue(),r(),V(),P(),B(),U={tagName:`openclaw-chat-html-preview`,get label(){return d(`chat.detailPanel.renderPreview`)},loadModule:()=>N(()=>import(`./chat-html-preview-element-DxUO_1oV.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]),import.meta.url)},Kt=class{constructor(e,t,n){this.host=e,this.content=t,this.text=n,this.source=!1,this.preview=null,this.loader=new ae(e),e.addController(this)}get file(){let e=this.content();return e?.kind===`file`&&Wt(e.mimeType??``,e.name)?e:null}get showing(){return this.file!==null&&!this.source}reset(e,t){this.source=t;let n=this.file;this.preview=n&&!t?e??n.content:null}showSource(){this.source||(this.source=!0,this.host.requestUpdate())}toggle(){this.source&&(this.preview=this.text()),this.source=!this.source,this.host.requestUpdate()}discard(e){this.preview!==null&&(this.preview=e,this.host.requestUpdate())}hostDisconnected(){this.loader.requestWhileActive(U,!1)}controls(e){let t=this.file;if(t)return{source:this.source,onToggle:e.onToggle,presentation:this.preview===null?S:Gt(this.loader,this.preview,t.draftKey??[e.runtime.sessionKey??``,e.runtime.agentId??``,t.root??``,t.path].join(`\0`),t.name,e.mode,t.sessionFileSource),sourceFallback:e.error?b`
            ${v({error:e.error,stale:h(e.error),onRetry:e.onRetry})}
            <pre class="sidebar-attachment-preview__text">${this.text()}</pre>
          `:void 0}}}})))()}function qt(e){let{settings:t,values:n}=e,r=()=>Object.entries(n).some(([e,n])=>t.values[e]!==n),i=r=>{let i=t.schema.properties[r];if(!i)return S;let a=t.schema.required?.includes(r)??!1,o=n[r];return b`<label class="mcp-app-settings__field"
      ><span>${i.title}</span
      >${i.description?b`<small class="muted">${i.description}</small>`:S}
      ${i.type===`boolean`?b`<input
              type="checkbox"
              .checked=${E(o===!0)}
              ?disabled=${e.busy}
              @change=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onChange(r,t.currentTarget.checked)}}
            />`:i.type===`string`&&i.enum?b`<select
                .value=${E(String(o??``))}
                ?required=${a}
                ?disabled=${e.busy}
                @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.onChange(r,t.currentTarget.value)}}
              >
                ${i.enum.map(e=>b`<option .value=${e} .selected=${e===o}>${e}</option>`)}
              </select>`:i.type===`string`?b`<input
                  type="text"
                  .value=${E(String(o??``))}
                  ?required=${a}
                  ?disabled=${e.busy}
                  minlength=${x(i.minLength)}
                  maxlength=${x(i.maxLength)}
                  pattern=${x(i.pattern)}
                  @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onChange(r,t.currentTarget.value)}}
                />`:b`<input
                  type="number"
                  .value=${E(String(o??``))}
                  ?required=${a}
                  ?disabled=${e.busy}
                  min=${x(i.minimum)}
                  max=${x(i.maximum)}
                  step=${i.multipleOf??(i.type===`integer`?1:`any`)}
                  @input=${t=>{let n=t.currentTarget;n instanceof HTMLInputElement&&Number.isFinite(n.valueAsNumber)&&e.onChange(r,n.valueAsNumber)}}
                />`}
    </label>`},a=new Set(t.layout?.flatMap(e=>e.items.flatMap(e=>e.kind===`property`?[e.property]:[])));return b`<form
    class="mcp-app-settings"
    @submit=${t=>{t.preventDefault(),r()&&t.currentTarget instanceof HTMLFormElement&&t.currentTarget.reportValidity()&&e.onSave()}}
  >
    <p class="muted">${d(`mcpApp.settingsDescription`)}</p>
    ${t.layout?.map(t=>b`<fieldset ?disabled=${e.busy}>
          <legend>${t.title}</legend>
          ${t.items.map(t=>t.kind===`property`?i(t.property):b`<div class="mcp-app-settings__field"><button type="button" class="btn" @click=${()=>e.onTool(t.tool)}>${t.title}</button>${t.description?b`<small>${t.description}</small>`:S}</div>`)}
        </fieldset>`)}
    ${Object.keys(t.schema.properties).filter(e=>!a.has(e)).map(i)}
    <button type="submit" class="btn primary" ?disabled=${e.busy||!r()}>
      ${d(`mcpApp.save`)}
    </button>
  </form>`}function Jt(){return(Jt=e((()=>{C(),pe(),ge(),r(),xe(),ye()})))()}var G;function Yt(){return(Yt=e((()=>{Ae(),C(),D(),O(),oe(),ce(),r(),xe(),p(),s(),t(),Jt(),de(),P(),ye(),G=class extends n{constructor(...e){super(...e),this.viewId=``,this.busy=!1,this.error=null,this.notice=``,this.settings=null,this.values={},this.generation=0,this.ownerScope=-1,this.launchIdentity=``,this.unmount=new le(this),this.subscriptions=new f(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}currentLaunchIdentity(){let e=this.launch;return JSON.stringify([e?.sessionKey,e?.agentId,e?.serverName,e?.entrypoint.toolName,e?.filePath,e?.settings,e?.quickAction])}willUpdate(e){let t=this.context?y(this.context.gateway).key:-1,n=this.currentLaunchIdentity();(e.has(`launch`)&&n!==this.launchIdentity||t!==this.ownerScope)&&(this.launchIdentity=n,this.ownerScope=t,this.generation++,this.viewId=``,this.settings=null,this.busy=!1,this.error=null,this.launch&&this.context&&this.launch.owner===this.context.gateway.snapshot.client&&this.open())}async operation(e,t){let n=this.context,r=this.launch,i=n?.gateway.snapshot.client;if(!n||!r||!i||i!==r.owner||n.gateway.snapshot.phase!==`connected`){this.error=d(`mcpApp.disconnected`);return}let a=++this.generation,o=this.currentLaunchIdentity(),s=y(n.gateway).key,c=()=>this.isConnected&&a===this.generation&&this.currentLaunchIdentity()===o&&n.gateway.snapshot.client===i&&y(n.gateway).key===s;this.busy=!0,this.error=null,this.notice=``;try{let n=await e(i,r);c()&&t(n)}catch(e){c()&&(this.error=u(e))}finally{c()&&(this.busy=!1)}}async open(){if(this.launch?.settings){await this.readSettings();return}await this.operation(async(e,t)=>{if((await N(()=>import(`./mcp-app-view-registration-Lm3i4Isn.js`),__vite__mapDeps([23,1,2,4,3,5,9,6,7,8,24,10,11,12,13,14,25,16,17,18,19,20,21,22]),import.meta.url)).registerMcpAppView(),this.launch?.sessionKey!==t.sessionKey||this.launch?.serverName!==t.serverName||this.launch?.entrypoint.toolName!==t.entrypoint.toolName||e!==this.context?.gateway.snapshot.client||!this.isConnected)throw Error(d(`mcpApp.disconnected`));return await e.request(`mcp.app.launch`,{sessionKey:t.sessionKey,agentId:t.agentId,serverName:t.serverName,toolName:t.entrypoint.toolName,entrypointType:t.entrypoint.entrypoint.type,...t.quickAction?{quickAction:!0}:{},...t.filePath?{filePath:t.filePath}:{},...t.deepLink?{deepLink:t.deepLink}:{}})},e=>{if(e.toolResult?.isError||!e.viewId&&!e.toolResult)throw Error(d(`mcpApp.errors.requestFailed`));e.viewId?this.viewId=e.viewId:this.notice=d(`mcpApp.actionComplete`)})}params(e){return{sessionKey:this.launch.sessionKey,agentId:this.launch.agentId,serverName:this.launch.serverName,action:e}}async readSettings(){await this.operation(e=>e.request(`mcp.app.settings`,this.params(`read`)),e=>{this.settings=e,this.values={...e.values}})}async saveSettings(){let e=Object.fromEntries(Object.entries(this.values).filter(([e,t])=>this.settings?.values[e]!==t));Object.keys(e).length&&await this.operation(async t=>{if((await t.request(`mcp.app.settings`,{...this.params(`update`),arguments:{set:e}})).toolResult?.isError)throw Error(d(`mcpApp.errors.requestFailed`));return await t.request(`mcp.app.settings`,this.params(`read`))},e=>{this.settings=e,this.values={...e.values},this.notice=d(`mcpApp.settingsSaved`)})}async runTool(e){await this.operation(async(t,n)=>{if((await N(()=>import(`./mcp-app-view-registration-Lm3i4Isn.js`),__vite__mapDeps([23,1,2,4,3,5,9,6,7,8,24,10,11,12,13,14,25,16,17,18,19,20,21,22]),import.meta.url)).registerMcpAppView(),this.launch!==n||this.context?.gateway.snapshot.client!==t||!this.isConnected)throw Error(d(`mcpApp.disconnected`));return t.request(`mcp.app.settings`,{...this.params(`tool`),toolName:e})},e=>{if(e.toolResult?.isError){this.error=d(`mcpApp.errors.requestFailed`);return}e.viewId?(this.settings=null,this.viewId=e.viewId):this.notice=d(`mcpApp.actionComplete`)})}disconnectedCallback(){this.generation++,this.subscriptions.clear(),super.disconnectedCallback()}render(){let e=this.launch;return e?b`<section class="mcp-app-panel">
      <div class="mcp-app-panel__toolbar">
        <strong>${e.entrypoint.title}</strong><span class="muted">${e.serverName}</span>
        ${e.settings&&!this.settings?b`<button
                class="btn btn--sm"
                ?disabled=${this.busy}
                @click=${()=>{this.viewId=``,this.readSettings()}}
              >
                ${d(`mcpApp.settings`)}
              </button>`:S}
      </div>
      ${this.busy?b`<p role="status">${d(`mcpApp.loading`)}</p>`:S}
      ${this.error?b`<p role="alert">${this.error}</p>
              <button class="btn" @click=${()=>void this.open()}>${d(`mcpApp.retry`)}</button>`:S}
      ${this.notice?b`<p role="status">${this.notice}</p>`:S}
      ${this.settings?qt({settings:this.settings,values:this.values,busy:this.busy,onChange:(e,t)=>{this.values={...this.values,[e]:t}},onSave:()=>void this.saveSettings(),onTool:e=>void this.runTool(e)}):S}
      ${this.unmount.render(this.viewId,()=>this.viewId?T(this.viewId,b`<mcp-app-view
                  .sessionKey=${e.sessionKey}
                  .agentId=${e.agentId??``}
                  .viewId=${this.viewId}
                  .title=${e.entrypoint.title}
                  .deepLink=${e.deepLink}
                  .onRelaunch=${()=>void this.open()}
                  .relaunching=${this.busy}
                ></mcp-app-view>`):S,()=>[this])}
    </section>`:S}},M([ke({context:fe,subscribe:!0})],G.prototype,`context`,void 0),M([k({attribute:!1})],G.prototype,`launch`,void 0),M([w()],G.prototype,`viewId`,void 0),M([w()],G.prototype,`busy`,void 0),M([w()],G.prototype,`error`,void 0),M([w()],G.prototype,`notice`,void 0),M([w()],G.prototype,`settings`,void 0),M([w()],G.prototype,`values`,void 0),customElements.get(`openclaw-mcp-app-panel`)||customElements.define(`openclaw-mcp-app-panel`,G)})))()}function Xt(e,t){let n=e.split(`;`,1)[0]?.trim().toLowerCase()??``;return n===`application/pdf`||(!n||n===`application/octet-stream`)&&/\.pdf$/i.test(t)}var K,Zt,q;function Qt(){return(Qt=e((()=>{C(),D(),r(),s(),L(),lt(),mt(),K=16777216,Zt=1e4,q=class extends o{constructor(...e){super(...e),this.src=``,this.sourceIdentity=``,this.label=``,this.mimeType=``,this.downloadHref=``,this.status=`loading`,this.previewUrl=null,this.loadVersion=0}connectedCallback(){super.connectedCallback(),this.requestUpdate(`src`)}disconnectedCallback(){this.cancelLoad(),this.revokePreviewUrl(),super.disconnectedCallback()}willUpdate(e){(e.has(`src`)||e.has(`sourceIdentity`)||e.has(`sizeBytes`))&&(this.cancelLoad(),(!this.src||!this.previewUrl||!this.sourceIdentity||e.has(`sourceIdentity`)||e.has(`sizeBytes`))&&(this.revokePreviewUrl(),this.status=`loading`),this.src&&this.loadPdf())}cancelLoad(){this.loadVersion+=1,this.abortController?.abort(),this.abortController=void 0}revokePreviewUrl(){this.previewUrl&&URL.revokeObjectURL(this.previewUrl),this.previewUrl=null,this.previewBytes=void 0}async loadPdf(){if(this.sizeBytes!==void 0&&this.sizeBytes>K){this.status=`error`;return}let e=this.loadVersion,t=new AbortController;this.abortController=t;let n=setTimeout(()=>t.abort(),Zt);try{let n=await fetch(this.src,{credentials:`same-origin`,redirect:`error`,signal:t.signal});if(!n.ok)throw await n.body?.cancel().catch(()=>void 0),Error(`PDF attachment unavailable`);let r=await pt(n,K);if(!r)throw Error(`PDF attachment exceeds preview limit`);if(e!==this.loadVersion||!this.isConnected)return;let i=new Uint8Array(r);if(this.previewBytes?.length===i.length&&this.previewBytes.every((e,t)=>e===i[t]))return;this.revokePreviewUrl(),this.previewBytes=i,this.previewUrl=URL.createObjectURL(new Blob([r],{type:`application/pdf`})),this.status=`ready`}catch{e===this.loadVersion&&this.isConnected&&(this.revokePreviewUrl(),this.status=`error`)}finally{clearTimeout(n),this.abortController===t&&(this.abortController=void 0)}}render(){let e=vt(this.downloadHref||this.src);return b`
      <div class="sidebar-pdf-preview" aria-label=${this.label}>
        <div class="sidebar-pdf-preview__surface">
          ${this.status===`loading`?F():this.status===`error`||!this.previewUrl?b`<div class="sidebar-attachment-preview__unavailable" role="alert">
                    ${d(`chat.attachments.previewUnavailable`)}
                    ${z({kind:`document`,label:this.label,mimeType:this.mimeType,sizeBytes:this.sizeBytes,downloadHref:e??void 0})}
                  </div>`:b`<iframe
                    class="sidebar-pdf-preview__frame"
                    title=${this.label}
                    src=${this.previewUrl}
                    referrerpolicy="no-referrer"
                  ></iframe>`}
        </div>
      </div>
    `}},M([k()],q.prototype,`src`,void 0),M([k()],q.prototype,`sourceIdentity`,void 0),M([k()],q.prototype,`label`,void 0),M([k()],q.prototype,`mimeType`,void 0),M([k({type:Number})],q.prototype,`sizeBytes`,void 0),M([k()],q.prototype,`downloadHref`,void 0),M([w()],q.prototype,`status`,void 0),M([w()],q.prototype,`previewUrl`,void 0),customElements.get(`openclaw-chat-pdf-preview`)||customElements.define(`openclaw-chat-pdf-preview`,q)})))()}function $t(e,t){let n=e.split(`;`,1)[0]?.trim().toLowerCase()??``;return n.startsWith(`text/`)||/^application\/(?:(?:[\w.-]+\+)?(?:json|xml)|javascript|x-javascript|yaml|x-yaml)$/.test(n)?!0:(!n||n===`application/octet-stream`)&&/\.(?:txt|md|markdown|html?|log|csv|tsv|json|jsonl|xml|yaml|yml)$/i.test(t)}var J;function en(){return(en=e((()=>{C(),D(),O(),ve(),ie(),qe(),_(),bt(),et(),r(),V(),ee(),gt(),s(),L(),it(),W(),B(),J=class extends o{constructor(...e){super(...e),this.compact=!1,this.plainText=!1,this.actions=S,this.embedSandboxMode=`scripts`,this.src=``,this.sourceIdentity=``,this.label=``,this.mimeType=``,this.text=null,this.failed=!1,this.source=!1,this.htmlPreviewLoader=new ae(this),this.loadVersion=0}connectedCallback(){super.connectedCallback(),this.requestUpdate(`src`)}disconnectedCallback(){this.cancelLoad(),this.htmlPreviewLoader.requestWhileActive(U,!1),super.disconnectedCallback()}get htmlDocument(){return!this.plainText&&Wt(this.mimeType,this.label)}willUpdate(e){e.has(`sourceIdentity`)&&(this.source=!1);let t=e.has(`plainText`)||e.has(`mimeType`)||e.has(`label`);(t||e.has(`src`)||e.has(`sourceIdentity`)||e.has(`sizeBytes`))&&(this.cancelLoad(),(t||!this.src||!this.sourceIdentity||e.has(`sourceIdentity`)||e.has(`sizeBytes`))&&(this.text=null),this.failed=!1,this.src&&this.loadText())}cancelLoad(){this.loadVersion+=1,this.abortController?.abort(),this.abortController=void 0}async loadText(){let e=this.loadVersion,t=new AbortController;this.abortController=t;try{let n=await ft(this.src,this.sizeBytes,t.signal,this.htmlDocument?`html`:`full`);e===this.loadVersion&&this.isConnected&&(this.text=n)}catch{e===this.loadVersion&&this.isConnected&&(this.text=null,this.failed=!0)}finally{this.abortController===t&&(this.abortController=void 0)}}retry(){this.cancelLoad(),this.text=null,this.failed=!1,this.loadText()}render(){let e=this.htmlDocument,t=this.mimeType.split(`;`,1)[0]?.trim().toLowerCase(),n=!this.plainText&&(t===`text/markdown`||t===`text/x-markdown`||/\.(?:md|markdown)$/i.test(this.label)),r=this.text===null?F():b`${T(this.sourceIdentity||this.loadVersion,b`${T(this.text,e?b`<div class="chat-html-preview" ?hidden=${this.source}>
                      ${Gt(this.htmlPreviewLoader,this.text,this.sourceIdentity||this.src,this.label,this.embedSandboxMode)}
                    </div>
                    <pre
                      class="sidebar-attachment-preview__text"
                      tabindex="0"
                      aria-label=${this.label}
                      ?hidden=${!this.source}
                    >
${this.text}</pre>`:n&&!this.source?b`<article
                      class="sidebar-attachment-preview__markdown sidebar-markdown-reader sidebar-markdown"
                      dir=${st(this.text)}
                      aria-label=${this.label}
                      ${xt()}
                    >
                      ${_e(Ke(this.text,{mode:`document`,remoteImages:!1,codeBlockInteraction:`interactive`}))}
                    </article>`:b`<pre
                      class="sidebar-attachment-preview__text"
                      tabindex="0"
                      aria-label=${this.label}
                    >
${this.text}</pre>`)}`)}`;return b`
      ${this.compact?b`<div class="sidebar-file-toolbar">
              <span class="sidebar-file-toolbar__type" title=${this.mimeType}
                >${this.mimeType||this.label.split(`.`).at(-1)}</span
              >
              ${this.sizeBytes===void 0?S:b`<span>${te(this.sizeBytes)}</span>`}
              <span class="sidebar-file-toolbar__actions">
                ${this.text!==null&&!this.failed?T(this.loadVersion,Qe(this.text,d(`common.copy`))):S}
                ${this.actions}
                ${this.failed?b`<button class="btn btn--sm" type="button" @click=${()=>this.retry()}>${d(`common.retry`)}</button>`:S}
                ${(n||e)&&this.text!==null?b`<button
                        class="btn btn--sm"
                        type="button"
                        aria-pressed=${String(this.source)}
                        @click=${()=>{this.source=!this.source}}
                      >
                        ${this.source?d(`chat.workspaceFiles.preview`):d(e?`chat.detailPanel.viewSource`:`chat.detailPanel.viewRawText`)}
                      </button>`:S}
                <a
                  class="rail-header__action"
                  href=${this.src||S}
                  download=${this.label}
                  target="_blank"
                  rel="noreferrer"
                  aria-label=${d(`chat.mediaPlayer.download`,{filename:this.label})}
                  >${g.download}</a
                >
              </span>
            </div>`:z({kind:`document`,label:this.label,mimeType:this.mimeType,sizeBytes:this.sizeBytes,downloadHref:this.src,downloadPending:!this.src})}
      ${this.failed?b`<p class="muted" role="status">
              ${d(e?`chat.attachments.htmlPreviewUnavailable`:`chat.attachments.textPreviewUnavailable`)}
            </p>`:r}
    `}},M([k({type:Boolean})],J.prototype,`compact`,void 0),M([k({type:Boolean})],J.prototype,`plainText`,void 0),M([k({attribute:!1})],J.prototype,`actions`,void 0),M([k()],J.prototype,`embedSandboxMode`,void 0),M([k()],J.prototype,`src`,void 0),M([k()],J.prototype,`sourceIdentity`,void 0),M([k()],J.prototype,`label`,void 0),M([k()],J.prototype,`mimeType`,void 0),M([k({type:Number})],J.prototype,`sizeBytes`,void 0),M([w()],J.prototype,`text`,void 0),M([w()],J.prototype,`failed`,void 0),M([w()],J.prototype,`source`,void 0),customElements.get(`openclaw-chat-text-attachment`)||customElements.define(`openclaw-chat-text-attachment`,J)})))()}function tn(e,t){return e.every(e=>e.kind!==`add`&&e.kind!==`ctx`||e.lineNo===void 0||t[e.lineNo-1]===e.text)}function nn(e,t,n){return Array.from({length:n},(n,r)=>({kind:`ctx`,lineNo:t+r,text:e[t+r-1]}))}function rn(e,t,n,r,i){let a=e.findIndex(e=>e.kind===`skip`&&e.gap===t),o=t.newStart+t.count-1;if(a<0||t.newStart<1||t.count<1||o>n.length||!tn(e,n))return null;let s=r===`all`||t.count<=on?t.count:Math.min(an,t.count),c=t.count-s,l=nn(n,r===`up`?t.newStart+c:t.newStart,s),u=[];return r===`up`&&c>0&&u.push({kind:`skip`,text:i(c),gap:{...t,count:c}}),u.push(...l),r!==`up`&&c>0&&u.push({kind:`skip`,text:i(c),gap:{oldStart:t.oldStart+s,newStart:t.newStart+s,count:c}}),[...e.slice(0,a),...u,...e.slice(a+1)]}var an,on;function sn(){return(sn=e((()=>{Te(),an=20,on=25})))()}function cn(e,t,n=ln){let r=[],i=!1,a=!1,o=0,s=0,c,l,u=e.replace(/\r\n/g,`
`).split(`
`);u.at(-1)===``&&u.pop();for(let e of u){let u=/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(e);if(u){let e=Number.parseInt(u[1]??``,10),n=Number.parseInt(u[2]??``,10),i=c===void 0?e-1:e-c;i>0&&r.push({kind:`skip`,text:t(i),gap:{oldStart:c??e-i,newStart:l??n-i,count:i}}),o=e,s=n,a=!0;continue}if(a&&!e.startsWith(`\\`)){if(r.length>=n){i=!0;break}e.startsWith(`+`)?(r.push({kind:`add`,lineNo:s,text:e.slice(1)}),s+=1):e.startsWith(`-`)?(r.push({kind:`del`,lineNo:o,text:e.slice(1)}),o+=1):(r.push({kind:`ctx`,lineNo:s,text:e.slice(1)}),o+=1,s+=1),c=o,l=s}}return{lines:r,truncated:i}}var ln;function un(){return(un=e((()=>{ln=600})))()}var Y;function dn(){return(dn=e((()=>{C(),D(),qe(),$e(),_(),ze(),Ge(),r(),A(),s(),Y=class extends n{constructor(...e){super(...e),this.menu=null,this.onAction=()=>{},this.onClose=()=>{},this.menuLifecycle=new Ze(this,{getTrigger:()=>this.menu?.trigger??null,onClose:()=>this.onClose()}),this.handleSelect=e=>{e.preventDefault();let t=e.detail.item.value;if(!t)return;let n={"collapse-all":{kind:`collapse-all`},"expand-all":{kind:`expand-all`},"toggle-split":{kind:`toggle-split`},"toggle-wrap":{kind:`toggle-wrap`},"scope:all":{kind:`scope`,value:{scope:`all`}},"scope:uncommitted":{kind:`scope`,value:{scope:`uncommitted`}}},r=this.menu?.kind===`file`?this.menu:null;if(r&&(t===`open-file`||t===`reveal-file`)){this.run({kind:t,path:r.path});return}let i=n[t];if(i){this.run(i);return}if(t.startsWith(`open-editor:`)){let e=t.slice(12);if(De.includes(e)){let t=this.menu?.kind===`file`?this.menu.absolutePath:void 0;t&&this.run({kind:`open-editor`,editor:e,path:t})}return}t.startsWith(`scope:commit:`)&&this.run({kind:`scope`,value:{scope:`commit`,commit:t.slice(13)}})},this.handleAfterHide=e=>{e.currentTarget instanceof Node&&e.currentTarget.isConnected&&this.onClose()}}connectedCallback(){super.connectedCallback(),We(this)}run(e){this.onClose(),this.onAction(e)}renderFileMenu(e){return b`
      ${this.renderCopyRow(e.path,d(`chat.sessionDiff.copyPath`))}
      <wa-dropdown-item class="session-menu__item" value="open-file" ?disabled=${!e.canOpenFile}>
        <span slot="icon" class="session-menu__icon" aria-hidden="true">${g.fileText}</span>
        <span class="session-menu__text">${d(`chat.sessionDiff.openFile`)}</span>
      </wa-dropdown-item>
      ${e.canReveal?b`<wa-dropdown-item class="session-menu__item" value="reveal-file">
              <span slot="icon" class="session-menu__icon" aria-hidden="true">${g.folder}</span>
              <span class="session-menu__text">${d(`chat.sessionDiff.revealInFileTree`)}</span>
            </wa-dropdown-item>`:S}
      ${e.absolutePath?b`<wa-dropdown-item class="session-menu__item">
              <span slot="icon" class="session-menu__icon" aria-hidden="true"
                >${g.externalLink}</span
              >
              <span class="session-menu__text">${d(`chat.sessionDiff.openInEditor`)}</span>
              ${De.map(e=>b`<wa-dropdown-item
                  slot="submenu"
                  class="session-menu__item"
                  value=${`open-editor:${e}`}
                >
                  <span class="session-menu__text">${Se[e]}</span>
                </wa-dropdown-item>`)}
            </wa-dropdown-item>`:S}
    `}renderViewMenu(e){let t=(e,t)=>b`<wa-dropdown-item class="session-menu__item" value=${e}>
        <span class="session-menu__text">${d(t)}</span>
      </wa-dropdown-item>`;return b`
      ${t(`collapse-all`,`chat.sessionDiff.collapseAll`)}
      ${t(`expand-all`,`chat.sessionDiff.expandAll`)}
      <div class="session-menu__separator" role="separator"></div>
      ${t(`toggle-wrap`,e.wrap?`chat.sessionDiff.disableWrapping`:`chat.sessionDiff.enableWrapping`)}
      ${t(`toggle-split`,e.split?`chat.sessionDiff.switchUnified`:`chat.sessionDiff.switchSplit`)}
    `}renderScopeMenu(e){let t=e.active.scope===`commit`?e.active.commit:null;return b`
      ${this.renderScopeItem(`scope:all`,d(`chat.sessionDiff.allChanges`),e.active.scope===`all`)}
      ${this.renderScopeItem(`scope:uncommitted`,d(`chat.sessionDiff.uncommitted`),e.active.scope===`uncommitted`)}
      ${e.result.commits?.length?b`<div class="session-menu__separator" role="separator"></div>
              ${e.result.commits.map((e,n)=>this.renderScopeItem(`scope:commit:${e.sha}`,b`<span class="session-diff-menu__sha">${e.sha}</span>
                    <span class="session-diff-menu__subject">${e.subject}</span>
                    ${n===0?b`<span class="session-diff-menu__head"
                            >${d(`chat.sessionDiff.head`)}</span
                          >`:S}`,t===e.sha))}`:S}
      ${e.result.mergeBase?b`<div class="session-menu__separator" role="separator"></div>
              <div class="session-diff-menu__merge-base">
                <span>${d(`chat.sessionDiff.mergeBase`)}</span>
                <span class="session-diff-menu__sha">${e.result.mergeBase.sha}</span>
                <span class="session-diff-menu__subject">${e.result.mergeBase.subject}</span>
              </div>`:S}
    `}renderScopeItem(e,t,n){return b`<wa-dropdown-item
      class="session-menu__item session-diff-menu__scope-item"
      value=${e}
      role="menuitemradio"
      aria-checked=${String(n)}
    >
      <span class="session-menu__text">${t}</span>
      ${n?b`<span slot="details" class="session-menu__check" aria-hidden="true"
              >${g.check}</span
            >`:S}
    </wa-dropdown-item>`}renderSyncMenu(e){return b`<div class="session-diff-menu__sync">
      <strong>${d(`chat.sessionDiff.syncLocally`)}</strong>
      <p>${d(`chat.sessionDiff.syncDescription`)}</p>
      ${this.renderCopyRow(e.command,d(`chat.sessionDiff.copyCommand`),!0)}
      ${this.renderCopyRow(e.root,d(`chat.sessionDiff.checkoutPath`))}
      ${this.renderCopyRow(e.branch,d(`chat.sessionDiff.branchName`))}
      <p class="session-diff-menu__note">${d(`chat.sessionDiff.uncommittedStay`)}</p>
    </div>`}renderCopyRow(e,t,n=!1){return b`<div class="session-diff-menu__copy-row ${n?`is-command`:``}">
      <span class="session-diff-menu__copy-label">${t}</span>
      <code title=${e}>${e}</code>
      ${Qe(e,t)}
    </div>`}render(){let e=this.menu;if(!e)return S;let t=e.kind===`scope`?e.placement??`top-start`:`bottom-end`,n=e.kind===`sync`?360:e.kind===`scope`?340:240,r=e.kind===`file`?d(`chat.sessionDiff.fileActions`,{path:e.path}):e.kind===`scope`?d(`chat.sessionDiff.scopeMenu`):e.kind===`sync`?d(`chat.sessionDiff.syncLocally`):d(`chat.sessionDiff.viewOptions`),i=Math.max(8,Math.min(e.anchor.x,window.innerWidth-8)),a=Math.max(8,Math.min(e.anchor.y,window.innerHeight-8));return b`<wa-dropdown
      class="session-menu session-diff-menu session-diff-menu--${e.kind}"
      style=${`--session-diff-menu-width:${n}px`}
      .open=${!0}
      placement=${t}
      .distance=${4}
      aria-label=${r}
      @wa-select=${this.handleSelect}
      @wa-after-hide=${this.handleAfterHide}
    >
      <button
        slot="trigger"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        style="position:fixed;left:${i}px;top:${a}px;width:1px;height:1px;opacity:0;pointer-events:none"
      ></button>
      ${e.kind===`file`?this.renderFileMenu(e):e.kind===`scope`?this.renderScopeMenu(e):e.kind===`sync`?this.renderSyncMenu(e):this.renderViewMenu(e)}
    </wa-dropdown>`}},M([k({attribute:!1})],Y.prototype,`menu`,void 0),M([k({attribute:!1})],Y.prototype,`onAction`,void 0),M([k({attribute:!1})],Y.prototype,`onClose`,void 0),customElements.get(`openclaw-session-diff-menu`)||customElements.define(`openclaw-session-diff-menu`,Y)})))()}function fn(e){let t=[];for(let n=0;n<e.length;){let r=e[n];if(!r)break;if(r.kind!==`add`&&r.kind!==`del`){t.push({kind:`span`,line:r}),n+=1;continue}let i=[],a=[];for(;n<e.length;){let t=e[n];if(t?.kind===`del`)i.push(t);else if(t?.kind===`add`)a.push(t);else break;n+=1}let o=Math.max(i.length,a.length);for(let e=0;e<o;e+=1)t.push({kind:`pair`,...i[e]?{left:i[e]}:{},...a[e]?{right:a[e]}:{}})}return t}function pn(e,t,n){let r=t===`left`?`-`:`+`;return b`<div
    class="session-diff-split__side session-diff-split__side--${t} ${e?`session-diff-split__side--filled`:``}"
  >
    <span class="session-diff-split__gutter">${e?.lineNo??``}</span>
    <span class="session-diff-split__sign">${e?r:``}</span>
    <span class="session-diff-split__text">${e?n(e):``}</span>
  </div>`}function mn(e,t,n={path:``}){let r=fn(e);return Pt(e,n,e=>b`<div
      class="session-diff-split code-highlight"
      role="figure"
      aria-label=${d(`chat.toolCards.fileChanges`)}
    >
      ${r.map(n=>n.kind===`pair`?b`<div class="session-diff-split__row session-diff-split__row--pair">
            ${pn(n.left,`left`,e)}
            ${pn(n.right,`right`,e)}
          </div>`:n.line.kind===`skip`?b`<div class="session-diff-split__row session-diff-split__row--skip">
            ${(t?.(n.line)??n.line.text)||`⋯`}
          </div>`:b`<div class="session-diff-split__row session-diff-split__row--context">
          <span class="session-diff-split__gutter">${n.line.lineNo??``}</span>
          <span class="session-diff-split__sign"></span>
          <span class="session-diff-split__text">${e(n.line)}</span>
        </div>`)}
    </div>`)}function hn(){return(hn=e((()=>{C(),r(),Ft()})))()}function gn(){try{let e=JSON.parse(a()?.getItem(X)??`null`);return{split:e?.split===!0,wrap:e?.wrap===!0}}catch{return{split:!1,wrap:!1}}}function _n(e){try{a()?.setItem(X,JSON.stringify(e))}catch{}}function vn(e){let t=Math.min(e.additions,e.deletions);return{added:e.additions-t,removed:e.deletions-t,modified:t}}function yn(e){return e.reduce((e,t)=>{let n=vn(t);return e.added+=n.added,e.removed+=n.removed,e.modified+=n.modified,e},{added:0,removed:0,modified:0})}function bn(e){let t=e.replaceAll(`\\`,`/`),n=t.lastIndexOf(`/`);return n<0?{directory:``,name:t}:{directory:t.slice(0,n),name:t.slice(n+1)}}function xn(e){return/^[A-Za-z0-9_./:@+-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}var X,Z,Q;function Sn(){return(Sn=e((()=>{Ne(),C(),D(),O(),Ve(),_(),Tt(),r(),ne(),sn(),un(),A(),p(),s(),At(),dn(),hn(),X=`openclaw.control.sessionDiff.v1`,Z={added:[`A`,`chat.sessionDiff.statusAdded`],deleted:[`D`,`chat.sessionDiff.statusDeleted`],renamed:[`R`,`chat.sessionDiff.statusRenamed`],modified:[`M`,`chat.sessionDiff.statusModified`]},Q=class extends n{constructor(){super(),this.owner=null,this.execNode=null,this.loader=null,this.loadFileText=null,this.openFile=null,this.revealFile=null,this.collapsedPaths=new Set,this.menu=null,this.scope={scope:`all`},this.split=gn().split,this.wrap=gn().wrap,this.fileTextCache=new WeakMap,this.unavailableFileText=new WeakSet,this.prefetchedDiffResult=null,this.diffTask=new Pe(this,{args:()=>[this.loader,this.owner,this.scope],task:async([e,t,n])=>{if(!e)return null;let r=this.prefetchedDiffResult??await e(n);return this.prefetchedDiffResult=null,{owner:t,scope:n,result:r,views:r.files.map(e=>({file:e,parsed:e.patch?cn(e.patch,e=>d(`chat.sessionDiff.unmodifiedLines`,{count:String(e)})):null}))}},onComplete:e=>{let t=new Set(e?.views.map(e=>e.file.path)??[]);this.collapsedPaths=new Set([...this.collapsedPaths].filter(e=>t.has(e)))}}),Je(this,()=>{this.menu=null})}get loading(){return this.loader!==null&&this.diffTask.status===Me.PENDING}toggleFile(e){let t=new Set(this.collapsedPaths);t.has(e)?t.delete(e):t.add(e),this.collapsedPaths=t}openAnchoredMenu(e,t,n=`bottom-end`){e.stopPropagation();let r=e.currentTarget;if(!(r instanceof HTMLElement))return;let i=r.getBoundingClientRect();this.menu={...t,...t.kind===`scope`&&n!==`bottom-end`?{placement:n}:{},anchor:{x:n.endsWith(`start`)?i.left:i.right,y:n.startsWith(`top`)?i.top:i.bottom},trigger:r}}handleMenuAction(e){switch(e.kind){case`collapse-all`:{let e=this.diffTask.value?.views??[];this.collapsedPaths=new Set(e.map(e=>e.file.path));return}case`expand-all`:this.collapsedPaths=new Set;return;case`toggle-wrap`:this.wrap=!this.wrap,_n({split:this.split,wrap:this.wrap});return;case`toggle-split`:this.split=!this.split,_n({split:this.split,wrap:this.wrap});return;case`scope`:JSON.stringify(e.value)!==JSON.stringify(this.scope)&&(this.scope=e.value);return;case`open-file`:this.openFile?.(e.path);return;case`reveal-file`:this.revealFile?.(e.path);return;case`open-editor`:be(e.editor,e.path)}}renderSummary(e){let t=e.baseRef&&e.branch&&e.baseRef!==e.branch?`${e.baseRef} → ${e.branch}`:e.branch??e.baseRef??``,n=e.root&&e.branch?`git fetch ${xn(e.root)} ${xn(e.branch)} && git checkout FETCH_HEAD`:null;return b`
      <div class="session-diff__summary">
        <span class="session-diff__branch" title=${e.root??``}>
          ${g.gitBranch}
          <span class="session-diff__branch-label">${t}</span>
        </span>
        ${e.unavailableReason===`workspace_stopped`?S:It(yn(e.files))}
        <span class="session-diff__summary-spacer"></span>
        ${n&&e.root&&e.branch?b`<button
                class="btn btn--ghost btn--sm session-diff__toolbar-button"
                type="button"
                @click=${t=>this.openAnchoredMenu(t,{kind:`sync`,command:n,root:e.root,branch:e.branch})}
              >
                ${d(`chat.sessionDiff.sync`)} ${g.chevronDown}
              </button>`:S}
        <openclaw-tooltip .content=${d(`chat.sessionDiff.viewOptions`)}>
          <button
            class="btn btn--ghost btn--icon session-diff__toolbar-icon"
            type="button"
            aria-label=${d(`chat.sessionDiff.viewOptions`)}
            @click=${e=>this.openAnchoredMenu(e,{kind:`view`,split:this.split,wrap:this.wrap})}
          >
            ${g.moreHorizontal}
          </button>
        </openclaw-tooltip>
        <openclaw-tooltip .content=${d(`chat.sessionDiff.refresh`)}>
          <button
            class="btn btn--ghost btn--icon session-diff__refresh"
            type="button"
            aria-label=${d(`chat.sessionDiff.refresh`)}
            ?disabled=${this.loading}
            @click=${()=>void this.diffTask.run()}
          >
            ${g.refresh}
          </button>
        </openclaw-tooltip>
      </div>
    `}canExpandGaps(e){return this.scope.scope!==`commit`&&!!this.loadFileText&&e.file.binary!==!0&&e.parsed!==null&&!e.parsed.truncated&&!this.unavailableFileText.has(e)}loadFileLines(e){let t=this.fileTextCache.get(e);if(t)return t;let n=this.loadFileText,r=n?n(e.file.path).then(e=>e===null?null:we(e)).catch(()=>null):Promise.resolve(null);return this.fileTextCache.set(e,r),r}async expandGap(e,t,n){let r=e.parsed,i=this.loader;if(!r||!t.gap||!i||!this.canExpandGaps(e))return;let a=this.scope,o;try{o=await i(a)}catch{return}if(this.loader!==i||this.scope!==a||!this.diffTask.value?.views.includes(e))return;let s=o.files.find(t=>t.path===e.file.path);if(!s||s.patch!==e.file.patch){this.fileTextCache.delete(e),this.prefetchedDiffResult=o,await this.diffTask.run();return}let c=await this.loadFileLines(e);if(!c||!this.diffTask.value?.views.includes(e)){this.unavailableFileText.add(e),this.requestUpdate();return}let l=rn(r.lines,t.gap,c,n,e=>d(`chat.sessionDiff.unmodifiedLines`,{count:String(e)}));if(!l){this.unavailableFileText.add(e),this.requestUpdate();return}r.lines=l,this.requestUpdate()}renderGap(e,t){let n=t.gap;if(!n||!this.canExpandGaps(e))return t.text;let r=n.count<=25?n.count:Math.min(20,n.count);return b`<span class="session-diff__gap-controls">
      <button
        type="button"
        aria-label=${d(`chat.sessionDiff.expandPreviousLines`,{count:String(r)})}
        @click=${()=>void this.expandGap(e,t,`up`)}
      >
        ${g.chevronUp}
      </button>
      <button
        class="session-diff__gap-count"
        type="button"
        aria-label=${d(`chat.sessionDiff.expandAllLines`,{count:String(n.count)})}
        @click=${()=>void this.expandGap(e,t,`all`)}
      >
        ${t.text}
      </button>
      <button
        type="button"
        aria-label=${d(`chat.sessionDiff.expandNextLines`,{count:String(r)})}
        @click=${()=>void this.expandGap(e,t,`down`)}
      >
        ${g.chevronDown}
      </button>
    </span>`}renderFileBody(e,t){let{file:n,parsed:r}=e;if(n.binary===!0)return b`<div class="session-diff__note">${d(`chat.sessionDiff.binaryFile`)}</div>`;if(!r)return b`<div class="session-diff__note">
        ${d(t.unavailableReason===`workspace_stopped`?`chat.sessionDiff.workspaceStoppedFile`:`chat.sessionDiff.previewUnavailable`)}
      </div>`;let i=t=>this.renderGap(e,t);return b`
      ${this.split?mn(r.lines,i,n):jt(r.lines,`succeeded`,i,n)}
      ${r.truncated?b`<div class="session-diff__note">${d(`chat.sessionDiff.truncatedFile`)}</div>`:S}
    `}renderFile(e,t){let{file:n}=e,r=this.collapsedPaths.has(n.path),{directory:i,name:a}=bn(n.path),o=t.root?Fe({root:t.root,path:n.path},this.execNode)??void 0:void 0,s=n.oldPath?`${n.oldPath} → ${n.path}`:n.path,[c,l]=Z[n.status]??Z.modified;return b`
      <section class="session-diff__file" data-status=${n.status}>
        <div class="session-diff__file-header">
          <button
            class="session-diff__file-toggle"
            type="button"
            aria-expanded=${String(!r)}
            title=${s}
            @click=${()=>this.toggleFile(n.path)}
          >
            <span class="session-diff__chevron ${r?``:`session-diff__chevron--open`}">
              ${g.chevronRight}
            </span>
            <span
              class="session-diff__status session-diff__status--${n.status}"
              title=${d(l)}
              >${c}</span
            >
            <span class="session-diff__path">
              ${n.oldPath?b`<span class="session-diff__old-path">${n.oldPath} →</span>`:S}
              <span class="session-diff__filename">${a}</span>
              ${i?b`<span class="session-diff__directory">${i}</span>`:S}
            </span>
            ${n.untracked===!0?b`<span class="session-diff__badge">${d(`chat.sessionDiff.untracked`)}</span>`:S}
            ${t.unavailableReason===`workspace_stopped`?S:It(vn(n))}
          </button>
          <button
            class="btn btn--ghost btn--icon session-diff__file-menu"
            type="button"
            aria-label=${d(`chat.sessionDiff.fileActions`,{path:n.path})}
            @click=${e=>this.openAnchoredMenu(e,{kind:`file`,path:n.path,...o?{absolutePath:o}:{},canOpenFile:!!this.openFile,canReveal:!!this.revealFile})}
          >
            ${g.moreHorizontal}
          </button>
        </div>
        ${r?S:b`<div
                class="session-diff__file-body"
                style=${`contain-intrinsic-size:auto ${Math.max(80,Math.min(12e3,(e.parsed?.lines.length??2)*19))}px`}
              >
                ${this.renderFileBody(e,t)}
              </div>`}
      </section>
    `}scopeTitle(e){let t=this.scope;if(t.scope===`uncommitted`)return d(`chat.sessionDiff.uncommitted`);if(t.scope===`commit`){let n=e.commits?.find(e=>e.sha===t.commit);return n?`${n.sha} ${n.subject}`:t.commit}return d(`chat.sessionDiff.allChanges`)}renderFooter(e){let t=e.branch??e.baseRef??d(`chat.sessionDiff.allChanges`),n=e.aheadCount&&e.baseRef?d(`chat.sessionDiff.commitsAhead`,{count:String(e.aheadCount),base:e.baseRef}):t;return b`<button
      class="session-diff__footer"
      type="button"
      aria-label=${d(`chat.sessionDiff.scopeMenu`)}
      @click=${t=>this.openAnchoredMenu(t,{kind:`scope`,active:this.scope,result:e},`top-start`)}
    >
      <span>${n}</span>${g.chevronUp}
    </button>`}renderBody(){if(this.diffTask.status===Me.ERROR){let e=this.diffTask.error;return b`<div class="callout danger">${u(e)}</div>`}let e=this.diffTask.value;if(this.loading&&(!e||e.owner!==this.owner||e.scope!==this.scope))return Ct(`review`,d(`chat.sessionDiff.loading`));if(!e)return S;let{result:t,views:n}=e;return t.unavailableReason===`not_git`?b`<div class="session-diff__note">${d(`chat.sessionDiff.notGit`)}</div>`:t.unavailableReason===`unknown_session`?b`<div class="session-diff__note">${d(`chat.sessionDiff.unknownSession`)}</div>`:b`
      ${this.renderSummary(t)}
      ${t.unavailableReason===`workspace_stopped`?b`<div class="session-diff__note">${d(`chat.sessionDiff.workspaceStopped`)}</div>`:S}
      <button
        class="session-diff__section-title"
        type="button"
        aria-label=${d(`chat.sessionDiff.scopeMenu`)}
        @click=${e=>this.openAnchoredMenu(e,{kind:`scope`,active:this.scope,result:t},`bottom-start`)}
      >
        <span>${this.scopeTitle(t)}</span>${g.chevronDown}
      </button>
      <div class="session-diff__files">
        ${t.unavailableReason===`unknown_commit`?b`<div class="session-diff__note">${d(`chat.sessionDiff.unknownCommit`)}</div>`:t.files.length===0?t.unavailableReason===`workspace_stopped`||t.truncated===!0?S:b`<div class="session-diff__note">${d(`chat.sessionDiff.empty`)}</div>`:n.map(e=>this.renderFile(e,t))}
        ${t.truncated===!0?b`<div class="session-diff__note">${d(`chat.sessionDiff.truncatedResult`)}</div>`:S}
      </div>
      ${this.renderFooter(t)}
    `}render(){return b`
      <div
        class="session-diff ${this.wrap?`session-diff--wrap`:``}"
        aria-busy=${String(this.loading)}
      >
        ${this.renderBody()}
        ${this.menu?T(this.menu,b`<openclaw-session-diff-menu
                  .menu=${this.menu}
                  .onAction=${e=>this.handleMenuAction(e)}
                  .onClose=${()=>{this.menu=null}}
                ></openclaw-session-diff-menu>`):S}
      </div>
    `}},M([k({attribute:!1})],Q.prototype,`owner`,void 0),M([k({attribute:!1})],Q.prototype,`execNode`,void 0),M([k({attribute:!1})],Q.prototype,`loader`,void 0),M([k({attribute:!1})],Q.prototype,`loadFileText`,void 0),M([k({attribute:!1})],Q.prototype,`openFile`,void 0),M([k({attribute:!1})],Q.prototype,`revealFile`,void 0),M([w()],Q.prototype,`collapsedPaths`,void 0),M([w()],Q.prototype,`menu`,void 0),M([w()],Q.prototype,`scope`,void 0),M([w()],Q.prototype,`split`,void 0),M([w()],Q.prototype,`wrap`,void 0),customElements.get(`openclaw-session-diff`)||customElements.define(`openclaw-session-diff`,Q)})))()}function Cn(e,t,n,r,i){if(e.download&&i)return b`${z({kind:`document`,label:e.title,mimeType:e.mimeType??void 0,sizeBytes:e.sizeBytes,onDownload:i.onDownload,downloadPending:i.pending})}${i.error?b`<div role="alert">${i.error}</div>`:S}`;let a=e.resolveSource?.(t,n),o=a?a.status===`ready`?a:null:e,s=e.mimeType?.split(`;`,1)[0]?.trim().toLowerCase()??``,c=e.attachmentKind===`video`||s.startsWith(`video/`)?`video`:e.attachmentKind===`audio`||s.startsWith(`audio/`)?`audio`:e.attachmentKind===`image`||s.startsWith(`image/`)?`image`:`document`,l=(e.plainText?nt:c===`audio`||c===`video`?dt:vt)(o?.src??``),u=o?.authToken??null,f=a?.status===`pending`,ee=(s===`image/svg+xml`||(!s||s===`application/octet-stream`)&&(j(e.sourceIdentity??``,void 0)||j(l??``,void 0)||j(e.title,void 0)))&&I(l??``),p=(l||f)&&!ee&&c===`image`;if((l||f)&&c===`document`&&Xt(s,e.title)&&!I(l??``))return b`<openclaw-chat-pdf-preview
      .src=${l??``}
      .sourceIdentity=${[n.connectionEpoch??``,n.agentId??``,n.sessionKey??``,e.sourceIdentity??l??``].join(`\0`)}
      .label=${e.title}
      .mimeType=${e.mimeType??``}
      .sizeBytes=${o?.sizeBytes??e.sizeBytes}
      .downloadHref=${l??``}
    ></openclaw-chat-pdf-preview>`;if((l||f)&&$t(s,e.title)&&!I(l??``))return b`<openclaw-chat-text-attachment
      .compact=${!0}
      .plainText=${e.plainText??!1}
      .actions=${e.renderActions?.()??S}
      .embedSandboxMode=${r}
      .src=${l??``}
      .sourceIdentity=${[n.connectionEpoch??``,n.agentId??``,n.sessionKey??``,e.sourceIdentity??l??``].join(`\0`)}
      .label=${e.title}
      .mimeType=${e.mimeType??``}
      .sizeBytes=${o?.sizeBytes??e.sizeBytes}
    ></openclaw-chat-text-attachment>`;if(c===`video`&&(l||f))return b`<openclaw-chat-video-player
      .src=${l??``}
      .preview=${!0}
      .sourceIdentity=${e.sourceIdentity??e.src??l??``}
      .label=${e.title}
      .mimeType=${e.mimeType??``}
      .playback=${o?.playback??e.playback??`native`}
      .authToken=${u}
      .sizeBytes=${o?.sizeBytes??e.sizeBytes}
      .mediaWidth=${o?.width??e.width}
      .mediaHeight=${o?.height??e.height}
    ></openclaw-chat-video-player>`;if(!l||p){let t=o?.width??e.width,n=o?.height??e.height;return b`
      <div
        class="chat-assistant-attachment-card chat-assistant-attachment-card--${c} sidebar-attachment-preview__state-card"
        aria-busy=${f?`true`:S}
      >
        ${ct({kind:c,label:e.title,mimeType:e.mimeType??void 0,sizeBytes:o?.sizeBytes??e.sizeBytes,downloadHref:l??void 0,downloadPending:f,visualMode:`preview-with-favicon`})}
        <div
          class="sidebar-attachment-preview__state"
          style=${me({"--preview-ratio":t&&n?`${t} / ${n}`:void 0})}
        >
          ${f||p?F():S}
          ${p&&l?T(l,b`<img
                    class="sidebar-attachment-preview__image"
                    src=${l}
                    alt=${e.title}
                    .onload=${function(){this.dataset.preview=`ready`}}
                    .onerror=${function(){this.dataset.preview=`error`}}
                  />`):S}
          ${f?S:b`<div class="sidebar-attachment-preview__unavailable">
                  ${d(`chat.attachments.previewUnavailable`)}
                  ${a?.status===`error`?b`<span>${a.reason}</span>`:S}
                  ${(a?.status===`error`||a?.status===`unavailable`)&&a.onRetry?b`<button class="btn btn--sm" type="button" @click=${a.onRetry}>
                          ${d(`common.retry`)}
                        </button>`:S}
                </div>`}
        </div>
      </div>
    `}return c===`audio`?b`<openclaw-chat-audio-player
      .src=${l}
      .sourceIdentity=${e.sourceIdentity??e.src??l}
      .label=${e.title}
      .mimeType=${e.mimeType??``}
      .playback=${o?.playback??e.playback??`native`}
      .authToken=${u}
      .sizeBytes=${o?.sizeBytes??e.sizeBytes}
      .serverDurationMs=${o?.durationMs??e.durationMs}
      .voiceNote=${e.voiceNote===!0}
    ></openclaw-chat-audio-player>`:z({kind:e.attachmentKind??`document`,label:e.title,mimeType:e.mimeType??void 0,sizeBytes:o?.sizeBytes??e.sizeBytes,downloadHref:l})}function wn(e){if(!e)return null;if(e.kind===`markdown`||e.kind===`file`){let t=e.rawText??e.content;return{kind:`markdown`,content:yt(t,e.kind===`file`?e.language:void 0),rawText:t,fileLinkSessionKey:e.kind===`file`?e.sessionFileSource?.sessionKey:e.fileLinkSessionKey}}return e.rawText?.trim()?{kind:`markdown`,content:yt(e.rawText,`json`),rawText:e.rawText}:null}function Tn(e){let t=e.content,n=(t=`btn`,n)=>b`<button
    @click=${e.onViewRawText}
    class=${t}
    type="button"
    style=${n??S}
  >
    ${d(`chat.detailPanel.viewRawText`)}
  </button>`,r=t?.kind===`markdown`&&t.content.trim()?Ke(t.content,{codeBlockInteraction:`interactive`,fileLinks:!0,githubRepo:e.githubRepo??null,githubRepositories:e.githubRepositories,interactiveImages:e.onOpenImage!==void 0,sessionLinks:!0}):``,i=t?.kind===`canvas`?St(e.embedSandboxMode??`scripts`,t.sandbox):``,a=t?.kind===`canvas`?wt(t.entryUrl,e.canvasPluginSurfaceUrl,e.allowExternalEmbedUrls??!1):null,o=t?.kind===`mcp-app`?t.title:t?.kind===`canvas`?t.title?.trim()||d(`chat.detailPanel.renderPreview`):t?.kind===`image`?t.title.trim()||d(`chat.detailPanel.imagePreview`):t?.kind===`attachment`?t.title.trim()||d(`chat.detailPanel.file`):t?.kind===`file`?t.name.trim()||d(`chat.detailPanel.file`):t?.kind===`session-diff`?d(`chat.sessionDiff.title`):t?.kind===`markdown`?d(e.showingRawText?`chat.detailPanel.viewSource`:`chat.detailPanel.markdownPreview`):d(`chat.detailPanel.toolDetails`);return b`
    <div
      class="sidebar-panel"
      data-file-session-key=${t?.kind===`markdown`?t.fileLinkSessionKey??S:t?.kind===`file`?t.sessionFileSource?.sessionKey??S:S}
    >
      ${e.embedded?S:b`<div class="sidebar-header">
              <div class="sidebar-title">${o}</div>
              <div class="sidebar-header__actions">
                <openclaw-tooltip .content=${d(`chat.detailPanel.close`)}>
                  <button
                    @click=${e.onClose}
                    class="btn"
                    type="button"
                    aria-label=${d(`chat.detailPanel.close`)}
                  >
                    ${g.x}
                  </button>
                </openclaw-tooltip>
              </div>
            </div> `}
      <div class="sidebar-content">
        ${e.error?b`
                ${v({error:e.error,stale:h(e.error),onRetry:e.onRetry})}
                ${t?.kind===`file`||t?.rawText?.trim()?n(`btn`,`margin-top: 12px;`):S}
              `:t?t.kind===`mcp-app`?b`<openclaw-mcp-app-panel .launch=${t.launch}></openclaw-mcp-app-panel>`:t.kind===`file`?Lt(t,e.onViewRawText,e.fileView,e.attachmentRuntime):t.kind===`session-diff`?b`<openclaw-session-diff
                        .owner=${t.owner}
                        .loader=${t.load}
                        .loadFileText=${t.loadFileText??null}
                        .execNode=${e.fileView?.execNode??null}
                        .openFile=${t.openFile??null}
                        .revealFile=${e.fileView?.onReveal??null}
                      ></openclaw-session-diff>`:t.kind===`canvas`||t.kind===`image`?T(t.kind,b`
                            <div class="chat-tool-card__preview" data-kind=${t.kind}>
                              <div class="chat-tool-card__preview-panel" data-side="front">
                                ${t.kind===`canvas`?T(`${i}\u0000${a??``}\u0000${t.preferredHeight??``}`,b`<iframe
                                          class="chat-tool-card__preview-frame"
                                          title=${o}
                                          sandbox=${i}
                                          src=${a??S}
                                          style=${t.preferredHeight?`height:${t.preferredHeight}px`:``}
                                        ></iframe>`):b`<button
                                        type="button"
                                        class="chat-tool-card__preview-image-button"
                                        aria-label=${d(`chat.imageLightbox.open`,{title:o})}
                                        @click=${()=>ot(e.onOpenImage,t.src,o)}
                                      >
                                        <img
                                          class="chat-tool-card__preview-image"
                                          src=${t.src}
                                          alt=${o}
                                          style="display:block;max-width:100%;height:auto;border-radius:8px;"
                                        />
                                      </button>`}
                              </div>
                              ${t.rawText?.trim()?b`
                                      <div style="margin-top: 12px;">${n()}</div>
                                    `:S}
                            </div>
                          `):t.kind===`attachment`?b`<div class="sidebar-attachment-preview">
                            ${Cn(t,e.onAttachmentUpdate,e.attachmentRuntime,e.embedSandboxMode??`scripts`,e.attachmentDownload)}
                          </div>`:b`
                            <section class="sidebar-markdown-shell">
                              <div class="sidebar-markdown-shell__toolbar">
                                <div class="sidebar-markdown-shell__intro">
                                  <div class="sidebar-markdown-shell__eyebrow">
                                    ${g.scrollText}
                                    <span
                                      >${d(e.showingRawText?`chat.detailPanel.viewSource`:`chat.detailPanel.renderedMarkdown`)}</span
                                    >
                                  </div>
                                  ${e.showingRawText?S:b`
                                          <div class="sidebar-markdown-shell__hint">
                                            ${d(`chat.detailPanel.renderedMarkdownHint`)}
                                          </div>
                                        `}
                                </div>
                                ${e.showingRawText?S:n(`btn btn--sm`)}
                              </div>
                              ${r?b`
                                      <article
                                        class="sidebar-markdown-reader sidebar-markdown"
                                        dir=${st(t.content)}
                                      >
                                        ${_e(r)}
                                      </article>
                                    `:b`
                                      <div class="sidebar-markdown-empty">
                                        ${d(`chat.detailPanel.noPreviewableMarkdown`)}
                                      </div>
                                    `}
                            </section>
                          `:b` <div class="muted">${d(`chat.detailPanel.noContent`)}</div> `}
      </div>
    </div>
  `}function En(e){let t=e.content?.kind===`file`||e.content?.kind===`markdown`||e.content?.kind===`attachment`||e.content?.kind===`session-diff`;return b`
    <div
      class=${t?`sidebar-panel-host--fill`:``}
      ${e.content?.kind===`attachment`?S:xt()}
      @click=${e.onClick}
      @keydown=${e.onKeydown}
    >
      ${Tn(e)}
    </div>
  `}function Dn(e,t){if(tt(e,t.onOpenImage??void 0))return;He(e);let n=Ue(e);if(n){t.onOpenWorkspaceFile?.(n);return}let r=Ie(e,t.basePath);r&&i(e)&&(e.preventDefault(),t.onOpenSessionLink?.(r))}function On(e,t){let n=Re(e);if(n){t.onOpenWorkspaceFile?.(n);return}let r=Ye(e,t.basePath);r&&t.onOpenSessionLink?.(r)}function kn(){return(kn=e((()=>{C(),O(),he(),ve(),m(),_(),ue(),bt(),Be(),Le(),Xe(),et(),ne(),r(),V(),Et(),Ce(),gt(),L(),lt(),ut(),at(),Yt(),ht(),rt(),Qt(),Mt(),en(),Sn(),B()})))()}var $;function An(){return(An=e((()=>{je(),D(),Ve(),m(),r(),V(),A(),p(),s(),Vt(),Ut(),Rt(),W(),_t(),kn(),Mt(),P(),B(),$=class extends n{constructor(){super(),this.content=null,this.fileNavigation=null,this.execNode=null,this.attachmentRuntime={},this.basePath=``,this.canvasPluginSurfaceUrl=null,this.embedSandboxMode=`scripts`,this.allowExternalEmbedUrls=!1,this.githubContext={},this.embedded=!1,this.onOpenWorkspaceFile=null,this.onOpenSessionLink=null,this.onRevealInWorkspace=null,this.onOpenImage=null,this.visibleContent=null,this.error=null,this.fileSearchOpen=!1,this.fileWrap=Ot(),this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.fileCopy=new Ht(this,()=>this.visibleContent),this.fileEditorLoading=!1,this.fileEditing=!1,this.fileDirty=!1,this.fileReloading=!1,this.fileSaving=!1,this.fileSaveNotice=null,this.htmlPreview=new Kt(this,()=>this.visibleContent,()=>this.currentFileText()),this.fileOperationVersion=0,this.showingRawText=!1,this.rawFileContent=null,this.fileEditor=null,this.fileEditorLoad=null,this.fileDraftContent=null,this.fileSavedContent=``,this.fileHash=``,this.requestAttachmentUpdate=()=>this.requestUpdate(),this.attachmentDownload=new Bt(this,()=>this.content===this.visibleContent?this.content:null,()=>this.attachmentRuntime),this.toggleHtmlSource=()=>{this.fileSearchOpen=!1,this.htmlPreview.toggle()},this.retryFileEditor=()=>{let e=this.error,t=this.fileOperationVersion;h(e)?re({canReload:()=>this.isConnected&&this.error===e&&t===this.fileOperationVersion}):this.error=null},this.handleDocumentPointerDown=e=>{if(!this.fileEditorMenuOpen)return;let t=this.querySelector(`.sidebar-file-view__editor`);(!t||!e.composedPath().includes(t))&&(this.fileEditorMenuOpen=!1)},this.toggleFileWrap=()=>{this.fileWrap=!this.fileWrap,zt(this.fileWrap)},this.toggleFileSearch=()=>{if(this.htmlPreview.showSource(),this.fileSearchOpen=!this.fileSearchOpen,this.fileEditorMenuOpen=!1,!this.fileSearchOpen){this.fileSearchQuery=``,this.fileSearchMatchIndex=0;return}this.updateComplete.then(()=>{this.querySelector(`.file-view__search input`)?.focus()})},this.updateFileSearch=e=>{this.fileSearchQuery=e,this.fileSearchMatchIndex=0,this.scrollToCurrentFileMatch()},this.handleFileSearchKeydown=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.toggleFileSearch(),this.querySelector(`.sidebar-file-view__search-toggle`)?.focus({preventScroll:!0});return}e.key===`Enter`&&e.target instanceof HTMLInputElement&&(e.preventDefault(),this.moveFileSearch(e.shiftKey?-1:1))},this.openInEditor=e=>{let t=this.visibleContent;if(t?.kind!==`file`)return;let n=Fe(t,this.execNode);n&&(this.fileEditorMenuOpen=!1,be(e,n,this.fileNavigation?.line??t.line))},this.editFile=async()=>{let e=this.visibleContent;if(e?.kind===`file`&&e.edit&&(this.htmlPreview.showSource(),await this.updateComplete,await this.ensureFileEditor(),this.visibleContent===e&&this.fileEditor)){if(this.fileEditing){this.fileEditor.focus();return}this.fileSavedContent=e.content,this.fileHash=e.edit.hash,this.fileDirty=!1,this.fileSaveNotice=null,this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.fileEditing=!0,this.fileEditor.setEditable(!0),this.updateComplete.then(()=>this.fileEditor?.focus())}},this.discardFileEdits=()=>{if(!this.fileEditing||this.fileSaving)return;this.fileEditor?.setContent(this.fileSavedContent),this.fileDraftContent=null,this.htmlPreview.discard(this.fileSavedContent);let e=this.visibleContent;e?.kind===`file`&&(H(e,null),this.fileHash=e.edit?.hash??``),this.fileDirty=!1,this.fileSaveNotice=null,this.fileEditing=!1,this.fileEditor?.setEditable(!1)},this.saveFile=()=>{let e=this.visibleContent;if(e?.kind!==`file`||!e.edit||!this.fileEditing||!this.fileDirty||this.fileSaving)return;let t=this.fileOperationVersion;this.fileSaving=!0,this.fileSaveNotice=null,this.trackFileOperation(this.saveFileContent(e,this.currentFileText(),this.fileHash,t),t)},this.reloadFile=()=>{let e=this.visibleContent;if(e?.kind!==`file`||!e.edit||this.fileSaving)return;let t=this.fileOperationVersion;this.fileSaving=!0,this.fileReloading=!0,this.fileEditor?.setEditable(!1),this.trackFileOperation(e.edit.fetchLatest().then(e=>{if(t===this.fileOperationVersion&&this.visibleContent?.kind===`file`){if(!e){this.fileSaveNotice={kind:`error`,message:d(`chat.detailPanel.reloadFailed`)};return}if(this.fileEditor?.setContent(e.content),this.fileDraftContent=this.fileEditor?null:e.content,this.htmlPreview.discard(e.content),this.updateSavedFile(this.visibleContent,e.content,e.hash),!e.editable&&this.visibleContent?.kind===`file`){H(this.visibleContent,null),this.fileEditing=!1,this.fileDirty=!1;let{edit:e,...t}=this.visibleContent;this.visibleContent=t}}}),t)},this.overwriteFile=()=>{let e=this.visibleContent;if(e?.kind!==`file`||!e.edit||this.fileSaving)return;let t=this.fileOperationVersion,n=this.currentFileText();this.fileSaving=!0,this.trackFileOperation(e.edit.fetchLatest().then(async r=>{if(t===this.fileOperationVersion){if(!r){this.fileSaveNotice={kind:`error`,message:d(`chat.detailPanel.overwriteLoadFailed`)};return}await this.saveFileContent(e,n,r.hash,t)}}),t)},this.close=()=>{this.dispatchEvent(new CustomEvent(`chat-detail-panel-close`,{bubbles:!0}))},this.showRawText=()=>{if(this.htmlPreview.file){this.htmlPreview.showSource();return}let e=wn(this.visibleContent);e&&(this.rawFileContent=this.visibleContent?.kind===`file`?this.visibleContent:null,this.showingRawText=!0,this.destroyFileEditor(),this.visibleContent=e,this.error=null)},this.handlePanelClick=e=>{Dn(e,this)},this.handlePanelKeyDown=e=>{On(e,this)},Je(this)}connectedCallback(){super.connectedCallback(),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown)}disconnectedCallback(){this.attachmentDownload.cancel(),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown),this.fileDirty&&(this.fileDraftContent=this.currentFileText()),this.destroyFileEditor(),R(this.requestAttachmentUpdate),super.disconnectedCallback()}willUpdate(e){let t=e.get(`attachmentRuntime`);if(t&&typeof t==`object`&&`connectionEpoch`in t&&t.connectionEpoch!==this.attachmentRuntime.connectionEpoch&&(R(this.requestAttachmentUpdate),this.attachmentDownload.cancel()),e.has(`fileNavigation`)&&this.fileNavigation&&this.content?.kind===`file`&&this.htmlPreview.showSource(),!e.has(`content`)){e.has(`fileNavigation`)&&this.fileNavigation&&this.content?.kind===`file`&&this.showingRawText&&(this.showingRawText=!1,this.visibleContent=this.rawFileContent??this.content,this.rawFileContent=null);return}R(this.requestAttachmentUpdate),this.attachmentDownload.cancel(),this.visibleContent=this.content,this.error=null,this.showingRawText=!1,this.rawFileContent=null,this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.fileCopy.reset(),this.fileOperationVersion+=1,this.fileEditing=!1,this.fileDirty=!1,this.fileReloading=!1,this.fileSaving=!1,this.fileSaveNotice=null;let n=this.content?.kind===`file`&&this.content.edit?Dt(this.content):void 0,r=this.content?.kind===`file`&&n?.content!==this.content.content?n:void 0;n&&!r&&this.content?.kind===`file`&&H(this.content,null),this.fileDraftContent=r?.content??null,this.fileSavedContent=this.content?.kind===`file`?this.content.content:``,this.fileHash=r?.expectedHash??(this.content?.kind===`file`?this.content.edit?.hash??``:``),this.fileEditing=!!r,this.fileDirty=!!r,this.htmlPreview.reset(this.fileDraftContent,!!(this.fileNavigation||this.content?.kind===`file`&&this.content.line!=null)),this.fileEditorLoading=this.content?.kind===`file`&&!this.htmlPreview.showing,this.destroyFileEditor()}updated(e){let t=this.visibleContent;t?.kind===`file`&&!this.showingRawText&&!this.htmlPreview.showing&&!this.error&&this.ensureFileEditor().then(()=>{this.syncFileEditor(),(e.has(`content`)||e.has(`fileNavigation`))&&(this.fileNavigation?.line??t.line)!=null&&this.scrollToFileLine(t)})}currentFileText(){return this.fileEditor?.getContent()??this.fileDraftContent??(this.visibleContent?.kind===`file`?this.visibleContent.content:``)}scrollToFileLine(e){let t=this.fileNavigation?.line??e.line;this.visibleContent===e&&!this.showingRawText&&t!=null&&this.fileEditor?.scrollToLine(t,!0)}destroyFileEditor(){this.fileOperationVersion+=1,this.fileEditor?.destroy(),this.fileEditor=null,this.fileEditorLoad=null}ensureFileEditor(){if(this.fileEditor)return Promise.resolve();if(this.fileEditorLoad)return this.fileEditorLoad;let e=this.visibleContent,t=this.querySelector(`.file-view__mount`);if(e?.kind!==`file`||!t||this.htmlPreview.showing)return Promise.resolve();let n=this.fileOperationVersion;return this.fileEditorLoading=!0,this.fileEditorLoad=N(async()=>{let{createFileEditorView:e}=await import(`./file-editor-view-xypOnULa.js`);return{createFileEditorView:e}},__vite__mapDeps([26,27,28,1,2,16]),import.meta.url).then(async({createFileEditorView:e})=>{let r=this.visibleContent;if(n!==this.fileOperationVersion||r?.kind!==`file`)return;let i=await e({parent:t,content:this.fileDraftContent??r.content,name:r.name,editable:this.fileEditing,wrap:this.fileWrap,onSave:this.saveFile});if(n!==this.fileOperationVersion||!this.isConnected||this.visibleContent?.kind!==`file`){i.destroy();return}i.setContent(this.currentFileText()),this.fileEditor=i,this.fileDraftContent=null,i.onDocChanged(e=>{let t=kt(r,{editing:this.fileEditing&&!this.fileReloading,content:e,dirty:!i.contentEquals(this.fileSavedContent),expectedHash:this.fileHash});t&&(this.fileDirty=t.dirty,this.fileHash=t.expectedHash,this.fileSaveNotice?.kind===`error`&&(this.fileSaveNotice=null))})}).catch(e=>{n===this.fileOperationVersion&&this.isConnected&&(this.error=Oe(e,d(`lazyView.errorTitle`)),h(this.error)&&se())}).finally(()=>{n===this.fileOperationVersion&&(this.fileEditorLoad=null,this.fileEditorLoading=!1)}),this.fileEditorLoad}syncFileEditor(){let e=this.visibleContent,t=this.fileEditor;if(e?.kind!==`file`||!t)return;this.fileEditing||t.setContent(e.content),t.setEditable(this.fileEditing&&!this.fileReloading),t.setLineWrapping(this.fileWrap);let n=this.fileSearchMatches();t.setDecorations({targetLine:this.fileNavigation?.line??e.line,matches:n,currentMatch:n[this.fileSearchMatchIndex]??null})}fileSearchMatches(){let e=this.visibleContent;return e?.kind===`file`?Nt(e.content,this.fileSearchQuery):[]}async scrollToCurrentFileMatch(){await this.updateComplete;let e=this.fileSearchMatches()[this.fileSearchMatchIndex];e!=null&&this.fileEditor?.scrollToLine(e,!0)}moveFileSearch(e){let t=this.fileSearchMatches();t.length!==0&&(this.fileSearchMatchIndex=(this.fileSearchMatchIndex+e+t.length)%t.length,this.scrollToCurrentFileMatch())}updateSavedFile(e,t,n){let r=this.currentFileText();this.fileSavedContent=t,this.fileHash=n,this.fileDirty=!(this.fileEditor?.contentEquals(t)??r===t),this.fileDraftContent=!this.fileEditor&&this.fileDirty?r:null,H(e,this.fileDirty?{content:r,expectedHash:n}:null),this.fileSaveNotice=null,e.content=t,e.rawText=t,e.edit&&(e.edit.hash=n)}async saveFileContent(e,t,n,r){if(!e.edit)return;let i=await e.edit.save({content:t,expectedHash:n});r===this.fileOperationVersion&&this.visibleContent?.kind===`file`&&(i.ok?this.updateSavedFile(this.visibleContent,t,i.hash):this.fileSaveNotice=i.code===`conflict`?{kind:`conflict`}:{kind:`error`,message:i.message})}trackFileOperation(e,t){e.catch(e=>{t===this.fileOperationVersion&&(this.fileSaveNotice={kind:`error`,message:u(e)})}).finally(()=>{t===this.fileOperationVersion&&(this.fileSaving=!1,this.fileReloading&&(this.fileReloading=!1,this.fileEditor?.setEditable(this.fileEditing)))})}render(){let e=this.htmlPreview.file,t=this.fileSearchMatches(),n=t.length?Math.min(this.fileSearchMatchIndex,t.length-1):0;return En({content:this.visibleContent,showingRawText:this.showingRawText,error:e?null:this.error,onRetry:this.retryFileEditor,fileView:{htmlPreview:this.htmlPreview.controls({error:this.error,onRetry:this.retryFileEditor,onToggle:this.toggleHtmlSource,runtime:this.attachmentRuntime,mode:this.embedSandboxMode}),copyFeedback:this.fileCopy.feedback,currentMatchIndex:n,dirty:this.fileDirty,execNode:this.execNode,editorMenuOpen:this.fileEditorMenuOpen,editing:this.fileEditing,loadingEditor:this.fileEditorLoading,mountKey:this.fileOperationVersion,matches:t,query:this.fileSearchQuery,saveNotice:this.fileSaveNotice,saving:this.fileSaving,searchOpen:this.fileSearchOpen,wrap:this.fileWrap,onCopy:this.fileCopy.copy,onDiscard:this.discardFileEdits,onEdit:()=>void this.editFile(),onNextMatch:()=>this.moveFileSearch(1),onOpenEditor:this.openInEditor,onOverwrite:this.overwriteFile,onPreviousMatch:()=>this.moveFileSearch(-1),onReload:this.reloadFile,onReveal:this.onRevealInWorkspace??void 0,onSave:this.saveFile,onSearchInput:this.updateFileSearch,onSearchKeydown:this.handleFileSearchKeydown,onEditorMenuOpenChange:e=>{this.fileEditorMenuOpen=e},onToggleSearch:this.toggleFileSearch,onToggleWrap:this.toggleFileWrap},canvasPluginSurfaceUrl:this.canvasPluginSurfaceUrl,embedSandboxMode:this.embedSandboxMode,allowExternalEmbedUrls:this.allowExternalEmbedUrls,...this.githubContext,embedded:this.embedded,onClose:this.close,onOpenImage:this.onOpenImage??void 0,onViewRawText:this.showRawText,onClick:this.handlePanelClick,onKeydown:this.handlePanelKeyDown,onAttachmentUpdate:this.requestAttachmentUpdate,attachmentRuntime:this.attachmentRuntime,attachmentDownload:this.attachmentDownload})}},M([k({attribute:!1})],$.prototype,`content`,void 0),M([k({attribute:!1})],$.prototype,`fileNavigation`,void 0),M([k({attribute:!1})],$.prototype,`execNode`,void 0),M([k({attribute:!1})],$.prototype,`attachmentRuntime`,void 0),M([k()],$.prototype,`basePath`,void 0),M([k()],$.prototype,`canvasPluginSurfaceUrl`,void 0),M([k()],$.prototype,`embedSandboxMode`,void 0),M([k({type:Boolean})],$.prototype,`allowExternalEmbedUrls`,void 0),M([k({attribute:!1})],$.prototype,`githubContext`,void 0),M([k({type:Boolean})],$.prototype,`embedded`,void 0),M([k({attribute:!1})],$.prototype,`onOpenWorkspaceFile`,void 0),M([k({attribute:!1})],$.prototype,`onOpenSessionLink`,void 0),M([k({attribute:!1})],$.prototype,`onRevealInWorkspace`,void 0),M([k({attribute:!1})],$.prototype,`onOpenImage`,void 0),M([w()],$.prototype,`visibleContent`,void 0),M([w()],$.prototype,`error`,void 0),M([w()],$.prototype,`fileSearchOpen`,void 0),M([w()],$.prototype,`fileWrap`,void 0),M([w()],$.prototype,`fileSearchQuery`,void 0),M([w()],$.prototype,`fileSearchMatchIndex`,void 0),M([w()],$.prototype,`fileEditorMenuOpen`,void 0),M([w()],$.prototype,`fileEditorLoading`,void 0),M([w()],$.prototype,`fileEditing`,void 0),M([w()],$.prototype,`fileDirty`,void 0),M([w()],$.prototype,`fileReloading`,void 0),M([w()],$.prototype,`fileSaving`,void 0),M([w()],$.prototype,`fileSaveNotice`,void 0),customElements.get(`openclaw-chat-detail-panel`)||customElements.define(`openclaw-chat-detail-panel`,$)})))()}An();
//# sourceMappingURL=chat-detail-panel-C5dAMgAY.js.map