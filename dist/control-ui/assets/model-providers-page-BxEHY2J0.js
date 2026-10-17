const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./model-setup-page-Ba37ZJ_1.js","./session-snapshot-database-I03lE5X1.js","./control-ui-boot-shared-BEmZVSlQ.js","./control-ui-boot-shared-DLsWb7wf.js","./plugin-contracts-runtime-CKj0EbqY.js","./config-runtime-BecGLziM.js","./markdown-runtime-ORQpioyT.js","./control-ui-boot-shared-styles-BaQ2sAfZ.js","./sidebar-update-runtime-sgX81en4.js","./control-ui-boot-chat-CNnFKzxu.js","./control-ui-boot-chat-CHJjvSiu.js","./control-ui-boot-chat-D67RfeWw.js","./chat-transcript-styles-Dzr3t9kA.js","./control-ui-boot-chat-styles-BRrYkFSc.js","./state-DLxHysTv.js","./wizard-login-controller-ug_4E8c9.js","./wizard-step-controls-DRsA5bAK.js","./first-run-activation-receipt-BYLFO__H.js","./control-ui-core-yIvVj14Y.css","./control-ui-boot-shared-styles-DKyMAG_6.css","./control-ui-boot-shared-CXHNz0Bh.css","./sidebar-update-runtime-ah7rgQE7.css","./chat-transcript-styles-B_dd5Ueo.css","./control-ui-boot-chat-styles-C_Ls1c0m.css","./control-ui-boot-chat-mLz7NUiY.css","./wizard-step-controls-D2NAzKG1.css","./wizard-login-controller-6KiX7cZx.css","./view-status-CPVPeI0Y.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,N as i,Sl as a,Tt as o,Tu as s,V as c,W as l,as as u,cs as d,du as f,fu as p,il as m,j as h,ju as g,kc as _,lt as v,ml as y,nl as ee,pl as te,pu as b,rl as ne,ut as re,wt as ie}from"./control-ui-core-CTSdBcaH.js";import{Ra as ae,Ti as oe,gr as se,na as x,ra as S,wa as ce,wi as le,xr as ue}from"./control-ui-core-vFnxmx94.js";import{$ as C,X as w,Y as T,ct as E,nt as de,ut as fe}from"./lit-runtime-TNZj1e-P.js";import{Dt as pe,Ot as me}from"./control-ui-boot-shared-DSyxl38Y.js";import{q as he}from"./control-ui-boot-chat-Bwz7X55z.js";import{c as ge,d as _e,l as ve}from"./gateway-runtime-DiNPDWPd.js";import{$ as ye,A as be,In as xe,J as Se,K as Ce,Nn as we,Pn as Te,Q as Ee,X as De,_ as Oe,g as ke,h as Ae,k as je,p as Me,q as Ne}from"./control-ui-boot-shared-D4E0xCZu.js";import{Br as Pe,Xr as Fe,Zr as Ie,fa as D,ii as O,oa as Le,ro as Re,sa as ze}from"./ui-CnRtCcYL.js";import{A as k,M as Be,O as A,k as j}from"./control-ui-boot-shared-kUERtt7j.js";import{B as M,Bi as Ve,G as He,I as N,K as Ue,R as We,U as Ge,V as P,X as Ke,Y as F,Z as I,a as qe,et as Je,l as Ye,li as Xe,o as L,pi as Ze,q as R,tt as Qe,u as $e,ui as et,zi as tt}from"./control-ui-boot-shared-DeF_v3ER.js";import{Hc as nt,Uc as rt}from"./control-ui-boot-shared-flpXqVdL.js";import{ct as it,lt as at}from"./control-ui-boot-shared-BIBfFukq.js";import{n as ot,t as st}from"./en-settings-CwgozeLb.js";import{n as ct,t as lt}from"./decision-model-picker-QlZnfN3Q.js";import{i as ut,n as z,r as dt,t as ft}from"./load-LDd-xuYL.js";import{n as pt,r as mt}from"./usage-B2dpYrkh.js";import{A as B,C as ht,D as gt,E as _t,F as vt,M as yt,N as bt,O as xt,P as St,S as Ct,T as V,_ as wt,a as H,b as U,c as Tt,d as Et,f as Dt,g as Ot,h as kt,i as At,j as W,k as G,m as jt,n as Mt,o as Nt,p as Pt,r as Ft,s as It,t as Lt,u as Rt,v as zt,w as Bt,x as Vt,y as Ht}from"./view-status-DAXij0a0.js";import{n as Ut,t as Wt}from"./provider-usage-CnWpp4ry.js";import{n as Gt,t as Kt}from"./provider-usage-request-DpRQVAgY.js";function qt(e){let t=null,n=null,r=0,i={get generation(){return r},get discovering(){return t!==null},get error(){return n},retry(){a()},reset(){let r=t;t=null,n=null,r?.abort(),e.requestUpdate()}};async function a(){let i=e.getAgentId();if(!i||t)return;let a=e.getGateway(),o=a.client;if(!a.connected||!o)return;let s=e.getAgentEpoch(),c=a.epoch,l=new AbortController,u=()=>t===l&&a.isCurrent({client:o,epoch:c})&&e.getAgentId()===i&&e.getAgentEpoch()===s;t=l,r+=1,n=null,e.requestUpdate();try{let t=await Ne(o,{agentId:i,refresh:!0,signal:l.signal});if(u()){n=Se(t,g(`modelProviders.defaults.discoverFailed`));let r=e.getData();r&&e.setData({...r,providerOutcomes:t.providerOutcomes??[],catalogError:null})}}catch(e){u()&&(n=f(e,`request failed`))}finally{t===l&&(t=null,e.requestUpdate(),e.onSettled())}}return i}function Jt(){return(Jt=e((()=>{r(),b(),Ce()})))()}var Yt;function Xt(){return(Xt=e((()=>{A(),ie(),z(),Yt=class{constructor(e,t){this.options=t,this.active=!1,this.publicationPending=!1,this.task=new j(e,{autoRun:!1,task:([e],{signal:t})=>e?ut(e.client,{agentId:e.agentId,...e.reason===`forced`?{refresh:!0}:{},signal:t}).then(t=>({...e,data:t})):k,onComplete:e=>{this.settle(),this.options.onComplete(e)},onError:()=>this.settle()})}get loading(){return this.active}refresh(e,t,n){return n===`publication`&&(this.active||this.options.isCatalogLoading())?(this.publicationPending=!0,Promise.resolve()):(n===`publication`&&(this.publicationPending&&o(e,{agentId:t}),this.publicationPending=!1),this.active=!0,this.options.onStart(n),this.task.run([{client:e,agentId:t,reason:n}]))}invalidate(){this.publicationPending=!1,this.active=!1,this.task.run([null])}settle(){this.active=!1,this.flushPublication()}flushPublication(){queueMicrotask(()=>{this.publicationPending&&!this.active&&!this.options.isCatalogLoading()&&this.options.refreshPublication()})}}})))()}function Zt(e){return e.state===`closed`?w:e.state===`loading`?C`<openclaw-modal-dialog
      label=${g(`modelSetup.discovery.title`)}
      @modal-cancel=${e.onCancel}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__body" role="status">${g(`common.loading`)}</div>
        <div class="model-setup-wizard__footer">
          <button class="btn" @click=${e.onCancel}>${g(`common.cancel`)}</button>
        </div>
      </div>
    </openclaw-modal-dialog>`:C`<openclaw-model-setup-page
    .routeData=${{firstRun:!1}}
    .embedded=${!0}
    .credentialChoices=${e.credentialChoices}
    .agentLabel=${e.agentLabel}
    .onClose=${e.onClose}
  ></openclaw-model-setup-page>`}var Qt;function $t(){return($t=e((()=>{T(),r(),kt(),ze(),Ot(),Qt=class{constructor(e,t){this.host=e,this.options=t,this.state=`closed`,this.generation=0,this.owner=null,e.addController(this)}get busy(){return this.state!==`closed`}reset(){this.generation+=1,this.state=`closed`,this.owner=null,this.host.requestUpdate()}hostUpdated(){let e=this.owner;if(!e)return;let t=this.options.getOwner();(this.state===`loading`&&!this.options.isCurrent(e)||t.selectionIntentRevision!==e.selectionIntentRevision||!t.selectionPending&&t.agentId!==e.agentId)&&this.reset()}cancelLoading(){this.state===`loading`&&this.reset()}hostDisconnected(){this.reset()}async open(){if(!this.options.canOpen()||this.busy)return;let e=this.options.getOwner();if(!e.client)return;let t=this.generation,n=()=>t===this.generation&&this.state===`loading`&&this.options.isCurrent(e);this.owner=e,this.state=`loading`,this.host.requestUpdate();try{await Le(()=>import(`./model-setup-page-Ba37ZJ_1.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url),n()&&(this.state=`ready`,this.host.requestUpdate())}catch(e){n()&&(this.reset(),this.options.onError(e))}}render(e){let t=this.generation;return Zt({...e,state:this.state,onCancel:()=>{t===this.generation&&this.reset()},onClose:()=>{t===this.generation&&(this.reset(),this.options.onClose())}})}}})))()}var K,en,tn;function nn(){return(nn=e((()=>{A(),T(),S(),et(),N(),r(),y(),ve(),V(),K=`acpx.agents.list`,en={installed:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.installed`},missing:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.missing`},unverified:{kind:`warn`,labelKey:`modelProviders.installedAgents.status.unverified`}},tn=class{constructor(e,t){this.host=e,this.options=t,this.agents=null,this.pending=new Map,this.messages=new Map,this.list=new j(e,{args:()=>[t.gateway.connected&&this.available()?t.gateway.client:null,t.gateway.epoch],task:async([e],{signal:t})=>e?(await e.request(K,{},{signal:t})).agents:k,onComplete:e=>{this.agents=e}})}get loading(){return this.list.status===Be.PENDING}get error(){return this.list.status===Be.ERROR?W(this.list.error):null}subscribe(e){return e.subscribeEvents(e=>{e.event===`config.changed`&&this.agents!==null&&this.pending.size===0&&this.list.run()})}reset(e={}){this.list.run([null,this.options.gateway.epoch]),this.pending.clear(),this.messages.clear(),e.preserveVisibleData||(this.agents=null)}filterProviders(e){return e.filter(e=>!this.agents?.some(t=>t.runtimeId===e.id))}available(){return ge(this.options.getContext().gateway.snapshot,K,`operator.read`)}blockedReason(){return B(this.options.getContext())}setEnabled(e,t){let n=this.options.gateway.capture();if(!n||this.blockedReason()||G(this.options.getContext())||this.pending.has(e.id))return!1;this.pending.set(e.id,t);let r=()=>this.options.gateway.isCurrent(n);return vt({runtimeConfig:this.options.getContext().runtimeConfig,isCurrentClient:r,isCurrentAgent:()=>!0,setBusy:t=>{t||this.pending.delete(e.id),this.host.requestUpdate()},setMessage:t=>{t?this.messages.set(e.id,t):this.messages.delete(e.id),this.host.requestUpdate()}},{key:`installed-agent:${e.id}`,raw:{plugins:{entries:{acpx:{config:{nativeAgents:{[e.id]:t}}}}}},note:g(`modelProviders.installedAgents.note`)}).then(()=>{r()&&this.list.run()}),!0}renderAgent(e,t,n,r){let i=this.pending.get(e.id),a=i??(typeof n==`boolean`?n:e.enabled),o=en[e.installation],s=``;e.installation===`missing`?s=g(`modelProviders.installedAgents.installHint`,{name:e.name}):e.installation===`unverified`?s=g(`modelProviders.installedAgents.unverifiedHint`):a?r?.catalogStatus===`auth-rejected`?(o={kind:`danger`,labelKey:`modelProviders.installedAgents.status.signIn`},s=g(`modelProviders.installedAgents.signInHint`,{name:e.name})):r?.catalogStatus===`unavailable`?(o={kind:`warn`,labelKey:`modelProviders.status.modelsUnavailable`},s=g(`modelProviders.installedAgents.discoveryHint`,{name:e.name})):r?.checkingModels?o={kind:`muted`,labelKey:`modelProviders.installedAgents.status.discovering`}:r&&r.availableModelCount>0?o={kind:`ok`,labelKey:`modelProviders.installedAgents.status.modelsAvailable`}:s=g(`modelProviders.installedAgents.signInHint`,{name:e.name}):s=g(`modelProviders.installedAgents.disabledHint`);let c=this.messages.get(e.id);return C`
      <div class="model-providers__installed-agent" data-installed-agent=${e.id}>
        ${Je({icon:Xe(e.id)?Ze(e.id,{className:`model-providers__icon`}):C`<span
                class="model-providers__icon model-providers__agent-icon"
                aria-hidden="true"
                >${x.terminal}</span
              >`,title:e.name,ariaLabel:g(`modelProviders.installedAgents.toggle`,{name:e.name}),description:i===void 0?C`${I({kind:o.kind,label:g(o.labelKey)})}${s?C`<br />${s}`:w}`:I({kind:`muted`,label:g(`modelProviders.saving`)}),checked:a,disabled:t||i!==void 0,onChange:t=>this.setEnabled(e,t)})}
        ${c?C`<div
                class="callout ${c.kind} model-providers__installed-agent-message"
                role=${c.kind===`error`?`alert`:`status`}
              >
                ${c.text}
              </div>`:w}
      </div>
    `}render(e,t){if(!this.available())return w;let n=this.blockedReason(),r=n!==null||G(this.options.getContext()),i=te(this.options.getContext().runtimeConfig.state),a=D(D(i?.plugins)?.entries),o=D(D(a?.acpx)?.config),s=D(o?.nativeAgents),c=this.error?C`<div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__desc provider-usage-error" role="alert">${this.error}</span>
          </div>
          <div class="settings-row__control">
            <button
              class="btn btn--sm"
              ?disabled=${this.loading}
              @click=${()=>void this.list.run()}
            >
              ${g(`common.retry`)}
            </button>
          </div>
        </div>`:w,l=this.agents===null?this.error?c:Ge({rows:4}):C`${c}${this.agents.length===0?M(g(`modelProviders.installedAgents.empty`)):this.agents.map(t=>this.renderAgent(t,r,s?.[t.id],e.find(e=>e.id===t.runtimeId)))}`,u=this.loading?g(`modelProviders.installedAgents.checking`):g(`modelProviders.installedAgents.check`);return C`
      <div class="model-providers__installed-agents">
        ${F({title:g(`modelProviders.installedAgents.title`),description:C`${g(`modelProviders.installedAgents.description`)}${n?C`<br />${n}`:w}`,actions:C`
              <openclaw-tooltip .content=${u}>
                <button
                  type="button"
                  class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
                  aria-label=${u}
                  ?disabled=${this.loading||this.pending.size>0}
                  @click=${()=>{this.list.run(),t()}}
                >
                  ${x.refresh}
                </button>
              </openclaw-tooltip>
            `},l)}
      </div>
    `}}})))()}function q(e,t,n){let r={...e};return n===null?delete r[t]:r[t]=n,r}var rn;function an(){return(an=e((()=>{v(),V(),rn=class{constructor(e){this.options=e,this.probeEpochs=new Map,this.pendingOrders=new Map,this.activeOrderProviders=new Set}resetProbes(){this.probeEpochs=new Map}clearProbe(e){this.probeEpochs.set(e,(this.probeEpochs.get(e)??0)+1),this.options.setBusy(`probe:`+e,!1),this.options.setProbeResult(e,null)}async probe(e,t){let n=this.options.getClient(),r=`probe:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r))return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=(this.probeEpochs.get(e)??0)+1;this.probeEpochs.set(e,s);let c=()=>this.isCurrentScope(n,i,o,a)&&this.probeEpochs.get(e)===s;this.options.setBusy(r,!0),this.options.clearMessage(e);try{let r=[];for(let e of t){if(!c())return;r.push(await n.request(`models.probe`,{provider:e,agentId:a}))}c()&&this.options.setProbeResult(e,_t(e,r))}catch(t){if(!c())return;this.options.setProbeError(e,W(t))}finally{c()&&this.options.setBusy(r,!1)}}resetOrders(){this.pendingOrders.clear(),this.options.setOrders({})}setOrder(e,t,n){let r=this.options.getData()?.authStatus?.providers.find(e=>e.provider===t),i=n??r?.profiles.map(e=>e.profileId)??[];this.options.setOrders({...this.options.getOrders(),[t]:i}),this.pendingOrders.set(t,{profileIds:n,optimisticOrder:i}),this.options.clearMessage(e),this.flushOrder(t)}flushPendingOrders(){if(this.options.canMutate())for(let e of this.pendingOrders.keys())this.flushOrder(e)}async logout(e,t){let n=this.options.getClient(),r=`logout:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r))return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=()=>this.isCurrentScope(n,i,o,a);this.clearProbe(e),this.options.setBusy(r,!0),this.options.clearMessage(e);try{let e=await this.options.getConfig().runExternalMutation(async e=>{let n=await e.request(`models.authLogout`,{...t,agentId:a});return re(e),n},{canDispatch:()=>s()&&this.options.canMutate()});if(!s())return;if(!e.ok){await this.options.refresh(),s()&&this.options.setError(e.error);return}let n=await yt(e,async()=>(await this.options.refresh(),this.options.getData()?.error));s()&&this.options.setLogoutSuccess(n||void 0)}catch(e){s()&&this.options.setError(e)}finally{s()&&this.options.setBusy(r,!1)}}async flushOrder(e){if(!this.activeOrderProviders.has(e)){this.activeOrderProviders.add(e);try{for(;;){let t=this.pendingOrders.get(e);if(!t)return;let n=this.options.getClient();if(!n||!this.options.canMutate())return;this.pendingOrders.delete(e);let r=this.options.getClientEpoch(),i=this.options.getAgentEpoch(),a=this.options.getAgentId();try{let o=await n.request(`models.authOrderSet`,{provider:e,...t.profileIds?{profileIds:t.profileIds}:{},agentId:a});if(re(n),!this.isCurrentScope(n,r,i,a))return;if(t.profileIds&&!o.warning)this.options.cancelRefresh(),this.applyOrder(e,t.profileIds),this.options.refresh();else if(await this.options.refresh(),!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&o.warning&&this.options.setError(o.warning)}catch(o){if(!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&this.options.setError(o)}}}finally{this.activeOrderProviders.delete(e),this.pendingOrders.has(e)&&this.options.canMutate()&&this.flushOrder(e)}}}isCurrentScope(e,t,n,r){return this.options.isCurrentClient(e,t)&&this.options.getAgentEpoch()===n&&this.options.getAgentId()===r}clearOptimisticOrder(e,t){let n=this.options.getOrders();return n[e]===t&&(this.options.setOrders(q(n,e,null)),!0)}applyOrder(e,t){let n=this.options.getData(),r=n?.authStatus;if(!n||!r)return;let i=[...r.providers];for(let[n,r]of i.entries())(r.authProvider??r.provider)===e&&(i[n]={...r,profileOrder:[...t],profileOrderStored:!0});this.options.setData({...n,authStatus:{...r,providers:i}})}}})))()}var on;function sn(){return(sn=e((()=>{A(),Kt(),z(),on=class{constructor(e,t){this.options=t,this.pending=new Set,this.usageTask=this.createTask(e,`usage`,(e,t)=>Gt(e,{signal:t}),e=>({providerUsage:e}),(e,t)=>this.options.refreshPolicy.markProviderUsage(e,Date.now(),t)),this.costTask=this.createTask(e,`cost`,dt,e=>({costByProvider:e}))}get loading(){return this.pending.size>0}get usageLoading(){return this.pending.has(`usage`)}adoptCoreData(e,t,n={}){let r=e===this.options.getDataClient()?this.options.getData():null;this.options.setData({...t,...n.preserveCatalogDiagnostics&&r?{providerOutcomes:r.providerOutcomes,catalogError:r.catalogError}:{},providerUsage:r?.providerUsage??t.providerUsage,costByProvider:r?.costByProvider??t.costByProvider}),this.options.setDataClient(e),t.providerUsage!==null&&this.options.refreshPolicy.markProviderUsage(t.providerUsage,t.updatedAt,this.options.getGateway().epoch),e&&!this.options.isCoreLoading()&&!this.loading&&t.providerUsage===null&&t.costByProvider===null&&this.load(e)}invalidate(){this.options.refreshPolicy.interrupt(),this.cancelGeneration()}beginCoreRefresh(e){this.cancelGeneration(),e&&this.options.refreshPolicy.resetPayload()}cancelGeneration(){this.pending.clear();let e=this.options.getGateway().epoch;this.usageTask.run([null,e]),this.costTask.run([null,e])}load(e){return this.loadRequests(e,!0)}loadUsage(){return this.loadRequests(void 0,!1)}async loadRequests(e,t){let n=this.options.getGateway(),r=e??n.client;if(!n.connected||!r){this.options.refreshPolicy.markLoadDeferred();return}this.options.refreshPolicy.beginLoad(),this.pending.add(`usage`);let i=this.usageTask.run([r,n.epoch]);if(!t){await i;return}this.pending.add(`cost`),await Promise.all([i,this.costTask.run([r,n.epoch])])}createTask(e,t,n,r,i){return new j(e,{autoRun:!1,task:([e,t],{signal:r})=>e?n(e,r).then(n=>({client:e,data:n,epoch:t})):k,onComplete:({client:e,data:n,epoch:a})=>{this.pending.delete(t);let o=this.options.getData();o&&e===this.options.getDataClient()&&this.options.getGateway().isCurrent({client:e,epoch:a})&&(this.options.setData({...o,...r(n)}),i?.(n,a)),this.options.refreshPolicy.flushPending()},onError:()=>{this.pending.delete(t),this.options.refreshPolicy.flushPending()}})}}})))()}function cn(e,t){let n=U(e),r=t.get(we(e.provider)),i=r?ke(r,{authProfileId:Pe(n).profile,projection:`available-credentials`}):void 0;return{value:n,label:e.name||n,...i?{detail:[i.label,i.detail].filter(Boolean).join(` · `)}:{},...e.available===!1?{disabled:!0}:{},...e.provider?{provider:e.provider}:{}}}function J(e){return C`
    <span class="model-providers__label-with-help">
      <span>${e.title}</span>
      <span class="settings-section__docs">
        <openclaw-tooltip open-on-click>
          <button
            id=${e.triggerId}
            type="button"
            class="settings-section__help-button model-providers__help-button"
            aria-label=${e.label}
            @keydown=${e=>{e.key===`Escape`&&e.stopPropagation()}}
          >
            ${x.info}
          </button>
          <div slot="content" class="settings-section__help-panel">${e.body}</div>
        </openclaw-tooltip>
      </span>
    </span>
  `}function ln(e){return e===`auto`||e===`ultrafast`?e:e===`on`}function un(e){return C`
    ${e.catalogDiscovering?C`
            <div class="model-providers__catalog-progress" role="status" aria-live="polite">
              <span class="btn__spinner" aria-hidden="true"></span>
              <span>${g(`modelProviders.defaults.discoveringMore`)}</span>
            </div>
          `:w}
    ${e.catalogDiscoveryError?C`
            <div class="model-providers__catalog-progress" role="alert" aria-live="polite">
              <span>${g(`modelProviders.defaults.discoverFailed`)}</span>
              <button class="btn btn--sm" type="button" @click=${e.onCatalogRetry}>
                ${g(`modelProviders.defaults.retryDiscover`)}
              </button>
            </div>
          `:w}
  `}function dn(e){let t=!e.canMutate||e.models.length===0,n=!e.canMutate,r=!!e.busy.defaults,i=e.mutationBlockedReason??``,a=e.thinkingLevel&&!Z.has(e.thinkingLevel)?[...X,e.thinkingLevel]:X,o=e.fastMode===void 0?``:it(e.fastMode),s=e.selection.fallbacks[0]??``,c=new Map(xe(e.authStatus?.providers??[]).map(e=>[e.provider,e])),l=he(e.models,U).map(e=>cn(e,c)),u=e.automaticUtilityModel,d=e.selection.utilityModel??Y,f=Me(e.utilityRuntime),p=(e,t)=>e===d&&f?[t,f.label].filter(Boolean).join(` · `):t,m=u?Pe(u).model:``,h=e.models.find(e=>U(e)===m),_=u?cn({...h??{id:m,name:m,provider:m.split(`/`,1)[0]??``},selectionRef:u},c):void 0,v=C`
    <div class="model-providers__defaults">
      ${!e.loading&&e.models.length===0?C`<div class="callout warning">${g(`modelProviders.defaults.noModels`)}</div>`:w}
      ${R({title:g(`modelProviders.defaults.primary`),control:L({label:g(`modelProviders.defaults.primary`),value:e.selection.primary,options:[{value:``,label:g(`modelProviders.defaults.selectModel`),disabled:!e.canMutate||!!e.selection.primary},...e.canMutate?l:l.map(e=>({...e,disabled:!0}))],disabled:e.models.length===0||r,title:i,showSelectedDetail:!0,onChange:e.onPrimaryChange})})}
      ${R({title:J({title:g(`modelProviders.defaults.utility`),label:g(`modelProviders.defaults.utilityHelpLabel`),triggerId:pn,body:C`
            <p>${g(`modelProviders.defaults.utilityHelpPurpose`)}</p>
            <p>${g(`modelProviders.defaults.utilityHelpAutomatic`)}</p>
          `}),control:L({id:fn,label:g(`modelProviders.defaults.utility`),value:d,options:[{value:Y,label:e.automaticUtilityModel?`${g(`quickSettings.model.fastModes.auto`)} · ${_?.label??e.automaticUtilityModel}`:g(`quickSettings.model.fastModes.auto`),provider:_?.provider,detail:u===null?g(`modelProviders.defaults.automaticUnavailable`):p(Y,_?.detail)},{value:``,label:g(`modelProviders.defaults.disabled`)},...l.map(e=>{let t=p(e.value,e.detail);return t===e.detail?e:{...e,detail:t}})],disabled:t||r,title:i||f?.detail||``,showSelectedDetail:!0,onChange:t=>e.onUtilityChange(t===Y?null:t)})})}
      ${R({title:g(`chat.modelControls.decisionLabel`),description:g(`chat.modelControls.decisionHelp`),control:ct({id:`model-providers-decision-model`,models:e.decisionModels,value:e.selection.decisionModel,disabled:!e.canMutate||r,title:i,onChange:e.onDecisionChange})})}
      ${R({title:g(`modelProviders.defaults.fallback`),control:L({label:g(`modelProviders.defaults.fallback`),value:s,options:[{value:``,label:g(`modelProviders.defaults.noFallback`)},...l.filter(t=>t.value!==e.selection.primary)],disabled:t||r||!e.selection.primary,title:i,showSelectedDetail:!0,onChange:t=>e.onFallbackChange(t||null)})})}
      ${R({title:J({title:g(`quickSettings.model.thinking`),label:g(`modelProviders.defaults.thinkingHelpLabel`),triggerId:mn,body:C`
            <p>${g(`modelProviders.defaults.thinkingHelp`)}</p>
            <p>${g(`modelProviders.defaults.thinkingDefaultHelp`)}</p>
          `}),control:C`
          ${Ke({value:e.thinkingLevel??``,ariaLabel:g(`quickSettings.model.thinking`),options:[{value:``,label:g(`quickSettings.model.default`)},...a.map(e=>({value:e,label:Z.has(e)?g(`quickSettings.model.thinkingLevels.${e}`):je(e)}))],disabled:r||n,onChange:(t,n)=>t===``?e.onThinkingReset():e.onThinkingChange(t,n),onReselect:t=>{t===``&&e.thinkingOverridden&&e.onThinkingReset()}})}
        `})}
      ${R({title:J({title:g(`quickSettings.model.fastMode`),label:g(`modelProviders.defaults.fastModeHelpLabel`),triggerId:hn,body:C`
            <p>${g(`modelProviders.defaults.fastModeHelp`)}</p>
            <p>${g(`modelProviders.defaults.fastModeDefaultHelp`)}</p>
          `}),control:C`
          ${Ke({value:o,ariaLabel:g(`quickSettings.model.fastMode`),options:[{value:``,label:g(`quickSettings.model.default`)},{value:`auto`,label:g(`quickSettings.model.fastModes.auto`)},{value:`on`,label:g(`quickSettings.model.fastModes.on`)},{value:`off`,label:g(`quickSettings.model.fastModes.off`)}],disabled:r||n,onChange:t=>{t===``?e.onFastModeReset():t!==o&&e.onFastModeChange(ln(t))},onReselect:t=>{t===``&&e.fastModeOverridden&&e.onFastModeReset()}})}
        `})}
      ${un(e)}
      ${e.canMutate?H(e.message):w}
    </div>
  `;return F({title:g(`modelProviders.defaults.title`),description:g(`modelProviders.defaults.subtitle`)},v)}var Y,fn,pn,mn,hn,X,Z;function gn(){return(gn=e((()=>{T(),me(),at(),lt(),S(),qe(),N(),r(),be(),Te(),Oe(),Ae(),Ht(),Ft(),Y=`__openclaw_automatic_utility__`,fn=`model-providers-utility-model`,pn=`model-providers-utility-help`,mn=`model-providers-thinking-help`,hn=`model-providers-fast-mode-help`,X=pe.filter(e=>e!==`minimal`),Z=new Set(X)})))()}function Q(e){return!e.canMutate||e.configBusy}function _n(e){return e.modelCount===0?null:e.availableModelCount<e.modelCount?g(`modelProviders.modelsAvailable`,{available:String(e.availableModelCount),count:String(e.modelCount)}):e.modelCount===1?g(`modelProviders.modelOne`):g(`modelProviders.models`,{count:String(e.modelCount)})}function vn(e,t){let n=e.localCost;return!n||n.totalTokens===0&&n.totalCost===0?w:C`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${g(`modelProviders.localCost`,{days:String(t)})}</span>
        <strong>${i(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${g(`modelProviders.localCostDetail`,{tokens:h(n.totalTokens),messages:String(n.messageCount)})}
      </div>
    </div>
  `}function yn(e,t){let n=e.profiles.filter(e=>e.type===`oauth`).length,r=e.profiles.filter(e=>e.type===`token`).length,i=e.profiles.filter(e=>e.type===`api_key`).length,a=[];n>0&&a.push(g(`modelProviders.credentials.oauth`,{count:String(n)})),r>0&&a.push(g(`modelProviders.credentials.tokenProfiles`,{count:String(r)}));let o=Rt(e);return o===void 0?i>0&&a.push(g(`modelProviders.credentials.profileKey`,{count:String(i)})):a.push(o),C`
    <div class="model-providers__credentials">
      <span>${g(`modelProviders.credentials.label`,{agent:t})}</span>
      <strong
        >${a.length>0?a.join(` · `):g(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `}function bn(e){if(!e)return w;let t=e.status===`ok`&&e.results.some(e=>e.status!==`ok`),n=t?`warning`:e.status===`ok`?`success`:`error`;return C`
    <div class="model-providers__probe model-providers__probe--${n}" role="status">
      <div class="model-providers__probe-summary">
        <strong
          >${g(t?`modelProviders.probe.status.partial`:`modelProviders.probe.status.${e.status}`)}</strong
        >
        ${e.latencyMs===void 0?w:C`<span
                >${g(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}</span
              >`}
      </div>
      ${e.error?C`<div>${p(e.error)}</div>`:w}
      ${e.results.map(e=>C`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${g(`modelProviders.probe.status.${e.status}`)}${e.latencyMs===void 0?``:` · ${g(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}`}
            </span>
            ${e.error?C`<small>${p(e.error)}</small>`:w}
          </div>
        `)}
    </div>
  `}function xn(e,t){if(t.keyEditorProvider!==e.id)return w;let n=!!t.busy[`key:${e.id}`],r=e.apiKeySupported===!1||!!(e.configAuthMode&&e.configAuthMode!==`api-key`),i=Q(t);return C`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${g(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source===`config`?g(`modelProviders.apiKey.replacePlaceholder`):g(`modelProviders.apiKey.placeholder`)}
          .value=${t.keyDraft}
          ?disabled=${n||i||r}
          @input=${e=>t.onKeyDraftChange(e.target.value)}
        />
      </label>
      <div class="model-providers__form-actions">
        <button
          class="btn primary btn--sm"
          ?disabled=${n||i||r||!t.keyDraft.trim()}
          @click=${()=>t.onSaveKey(e.id,e.configKey??e.id)}
        >
          ${g(n?`modelProviders.saving`:`common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${()=>t.onCloseKeyEditor()}>
          ${g(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function Sn(e,t){let n=e.credentialProviderIds.length?e.credentialProviderIds:[e.id],r=!!t.busy[`probe:${e.id}`],i=!!t.busy[`key:${e.id}`],a=t.mutationBlockedReason??``,o=!!(e.configAuthMode&&e.configAuthMode!==`api-key`),s=e.apiKeySupported===!1,c=Q(t),l=o?g(`modelProviders.apiKey.authModeBlocked`,{mode:e.configAuthMode??``}):a;return C`
    <div class="model-providers__card-actions">
      ${t.canConnect(e)&&e.profiles.length===0?C`<button
              class="btn btn--sm"
              data-models-connect-provider=${e.id}
              ?disabled=${c||t.loginBusy}
              @click=${()=>t.onConnect(e)}
            >
              ${g(`modelProviders.login.action`)}
            </button>`:w}
      ${Lt(e)?C`
              <button
                class="btn btn--sm"
                ?disabled=${r||!t.canMutate||!t.probeAvailable}
                title=${t.probeAvailable?a:g(`modelProviders.probe.unavailable`)}
                @click=${()=>t.onProbe(e.id,n)}
              >
                ${g(r?`modelProviders.probe.testing`:`modelProviders.probe.test`)}
              </button>
            `:w}
      ${s?w:C`
              <button
                class="btn btn--sm"
                ?disabled=${i||c||o}
                title=${l}
                @click=${()=>t.onOpenKeyEditor(e.id)}
              >
                ${g(`modelProviders.apiKey.set`)}
              </button>
            `}
      ${e.hasConfigApiKey||e.profiles.some(e=>e.type===`api_key`&&e.logoutSupported)?C`
              <button
                class="btn btn--sm danger"
                ?disabled=${i||c||o}
                title=${l}
                @click=${()=>t.onRemoveKey(e.id,e.configKey??e.id)}
              >
                ${g(`modelProviders.apiKey.remove`)}
              </button>
            `:w}
    </div>
  `}function Cn(e,t){let n=_n(e),r=t.messages[`key:${e.id}`]??t.messages[e.id];return C`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${Ze(e.id,{className:`model-providers__icon`})}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n?C` · ${n}`:w}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan?Qe(e.usage.plan):w}
          ${Nt(e)}
        </div>
      </div>
      ${e.profiles.length>0&&t.canViewProfiles?Dt(e,{...t,canMutate:t.canMutate&&!t.configBusy,onAddAccount:t.canConnect(e)?()=>t.onConnect(e):void 0,addAccountDisabled:t.loginBusy||Q(t)}):yn(e,t.credentialAgentLabel)}
      <div
        class="model-providers__global-metrics"
        aria-busy=${t.supplementalLoading?`true`:`false`}
      >
        <div class="model-providers__global-metrics-title">${g(`modelProviders.globalUsage`)}</div>
        ${e.usage?Ut(e.usage):C`<div class="model-providers__no-stats">
                ${g(t.supplementalLoading?`common.loading`:`modelProviders.noStats`)}
              </div>`}
        ${vn(e,t.costDays)}
      </div>
      ${Sn(e,t)} ${xn(e,t)}
      ${bn(t.probeResults[e.id])} ${H(r)}
    </div>
  `}function wn(e){if(!e.addProviderOpen)return w;let t=!!e.busy.add,n=Q(e)||t,r=e.unconfiguredProviders.find(t=>t.id===e.addProviderId);return C`
    <openclaw-modal-dialog
      label=${g(`modelProviders.add.title`)}
      @modal-cancel=${n=>{n.preventDefault(),t||e.onAddProviderToggle()}}
    >
      <div class="model-setup-wizard" data-models-key-dialog>
        <div class="model-setup-wizard__header">
          <h2>${r?.displayName??e.addProviderId}</h2>
        </div>
        <div class="model-setup-wizard__body">
          <p>${g(`modelProviders.credentials.label`,{agent:e.credentialAgentLabel})}</p>
          <label class="field">
            <span>${g(`modelProviders.apiKey.label`)}</span>
            <input
              type="password"
              autocomplete="off"
              placeholder=${g(`modelProviders.apiKey.placeholder`)}
              .value=${e.addProviderKey}
              ?disabled=${n}
              @input=${t=>e.onAddProviderKeyChange(t.target.value)}
            />
          </label>
          ${H(e.messages.add)}
        </div>
        <div class="model-setup-wizard__footer">
          <button class="btn" ?disabled=${t} @click=${e.onAddProviderToggle}>
            ${g(`common.cancel`)}
          </button>
          <button
            class="btn primary"
            ?disabled=${n||!e.addProviderId||!e.addProviderKey.trim()}
            @click=${e.onAddProvider}
          >
            ${g(t?`modelProviders.saving`:`modelProviders.add.save`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Tn(e){let t=e.cards.some(Mt);return C`
    <div class="model-providers__setup" data-model-readiness="model-required">
      ${F({title:g(`modelProviders.readiness.title`)},R({title:g(`modelProviders.readiness.heading`),description:g(t?`modelProviders.readiness.signedInNoModels`:`modelProviders.readiness.notConfigured`),control:C`
            ${I({kind:`warn`,label:g(t?`modelProviders.readiness.noModels`:`modelProviders.readiness.modelRequired`)})}
            <button
              class="btn primary"
              ?disabled=${Q(e)||e.loginBusy}
              title=${e.mutationBlockedReason??``}
              @click=${e.onConnectProvider}
            >
              ${g(`modelProviders.login.action`)}
            </button>
          `}))}
    </div>
  `}function En(e){return C`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc provider-usage-error">${e}</span>
      </div>
    </div>
  `}function Dn(e){if(!e.connected)return He(P(M(g(`modelProviders.disconnected`))));let t=(e.providerQuery??``).trim().toLocaleLowerCase(),n=e.cards.filter(e=>[e.id,e.displayName,...e.credentialProviderIds].some(e=>e.toLocaleLowerCase().includes(t))),r=C`
    <label class="field model-providers__search">
      <input
        type="search"
        aria-label=${g(`modelProviders.search`)}
        placeholder=${g(`modelProviders.search`)}
        .value=${e.providerQuery??``}
        @input=${t=>e.onProviderQueryChange?.(t.currentTarget.value)}
      />
    </label>
    <div class="model-providers__provider-list">
      ${e.error?P(En(e.error)):w}
      ${e.providerUsageFailed?P(En(g(`usage.providerUsage.unavailable`))):w}
      ${e.cards.length===0?P(M(C`<strong>${g(`modelProviders.emptyTitle`)}</strong><br />${g(`modelProviders.emptySubtitle`)}`)):n.map(t=>P(Cn(t,e)))}
      ${e.cards.length>0&&n.length===0?M(g(`modelProviders.noMatches`)):w}
    </div>
  `,i=!e.loading&&!e.configuredModels.some(e=>e.available!==!1);return C`${He(C`
    ${i?Tn(e):w}
    <div id=${u.behavior}>
      ${dn({...e,models:e.configuredModels,selection:e.defaultModels,canMutate:e.defaultsMutationBlockedReason===null&&!e.configBusy,mutationBlockedReason:e.defaultsMutationBlockedReason,message:e.messages.defaults})}
    </div>
    ${e.installedAgents}
    ${F({title:g(`modelProviders.accessTitle`),description:g(`modelProviders.accessDescription`),count:e.cards.length,actions:C`
          ${e.providerScope}
          ${e.updatedAt?C`<span class="model-providers__updated"
                  >${g(`modelProviders.updated`,{time:c(e.updatedAt,{hour:`numeric`,minute:`2-digit`})})}</span
                >`:w}
          <openclaw-tooltip
            .content=${e.refreshing?g(`modelProviders.refreshing`):g(`common.refresh`)}
          >
            <button
              type="button"
              class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
              aria-label=${e.refreshing?g(`modelProviders.refreshing`):g(`common.refresh`)}
              ?disabled=${e.refreshing}
              @click=${()=>e.onRefresh()}
            >
              ${x.refresh}
            </button>
          </openclaw-tooltip>
        `},C`${e.accountRecovery}${e.loading?P(Ge()):e.cards.length===0&&e.installedAgents!==w&&!e.error&&!e.providerUsageFailed?w:r}`)}
    ${e.providerUsageStalled?C`<div class="callout warning" role="status">${g(`usage.providerUsage.stalled`)}</div>`:w}
  `)}${wn(e)}`}function On(e){return C`
    <span class="muted" data-models-provider-agent
      >${g(`agentScope.label`)}: ${e.agentLabel}</span
    >
    ${At(e)}
  `}function kn(e){return C`
    ${Ue({title:ae(`model-providers`),subtitle:C`${g(`modelProviders.subtitle`)}
      ${We(`https://docs.openclaw.ai/concepts/model-providers`)}`})}
    ${$e(C`${H(e.loginMessage)}${e.body}`)}
    ${e.login}
  `}function An(){return(An=e((()=>{T(),ce(),S(),et(),Wt(),N(),Ye(),r(),st(),b(),l(),d(),gn(),Et(),Ft(),ot()})))()}var $;function jn(){return(jn=e((()=>{Ie(),T(),de(),oe(),ue(),tt(),r(),ee(),y(),ve(),Te(),Ce(),a(),rt(),s(),t(),mt(),Jt(),V(),Xt(),Ht(),$t(),nn(),z(),Tt(),an(),Et(),sn(),An(),$=class extends n{constructor(...e){super(...e),this.mutationBlockedReason=()=>B(this.context)??(this.selectedAgentId?null:g(`agents.noAgents`)),this.canMutate=()=>this.mutationBlockedReason()===null&&!G(this.context),this.loaderPending=!1,this.data=null,this.busy={},this.messages={},this.probeResults={},this.keyEditorProvider=null,this.keyDraft=``,this.logoutConfirmation=null,this.profileOrders={},this.providerQuery=``,this.pendingConnection=!1,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,this.selectedAgentId=``,this.dataClient=null,this.routeDataObserved=!1,this.agentEpoch=0,this.coreCatalogGeneration=0,this.core=new Yt(this,{onStart:e=>{e!==`publication`&&this.catalogDiscovery.reset(),this.coreCatalogGeneration=this.catalogDiscovery.generation,this.supplemental.beginCoreRefresh(e===`forced`),e===`forced`&&this.querySelectorAll(`openclaw-model-account-usage`).forEach(e=>e.refreshUsage())},onComplete:({client:e,data:t})=>{let n=this.data!==null&&this.catalogDiscovery.generation!==this.coreCatalogGeneration;n||this.catalogDiscovery.reset(),this.supplemental.adoptCoreData(e,t,{preserveCatalogDiagnostics:n})},isCatalogLoading:()=>this.catalogDiscovery.discovering,refreshPublication:()=>void this.refresh(`publication`)}),this.refreshPolicy=new pt({isLoading:()=>this.loaderPending||!this.routeDataObserved||this.core.loading||this.supplemental.usageLoading,reload:()=>this.supplemental.loadUsage(),onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.supplemental=new on(this,{isCoreLoading:()=>this.loaderPending,getGateway:()=>this.gateway,getData:()=>this.data,getDataClient:()=>this.dataClient,setData:e=>this.data=e,setDataClient:e=>this.dataClient=e,refreshPolicy:this.refreshPolicy}),this.catalogDiscovery=qt({getGateway:()=>this.gateway,getAgentId:()=>this.selectedAgentId,getAgentEpoch:()=>this.agentEpoch,getData:()=>this.data,setData:e=>this.data=e,requestUpdate:()=>this.requestUpdate(),onSettled:()=>this.core.flushPublication()}),this.gateway=new nt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetConnectionState(),invalidateRequests:()=>this.invalidateRequests(),ensureInitialData:()=>this.ensureInitialData(),onSnapshot:e=>{e.initial?this.resetConnectionState():e.connectionChanged&&!e.identityChanged&&this.resetConnectionState({preserveVisibleData:!0}),e.becameConnected&&!e.initial&&this.routeDataObserved&&!this.loaderPending&&this.refresh(`replacement`)},onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.installedAgents=new tn(this,{gateway:this.gateway,getContext:()=>this.context}),this.profileActions=new rn({getAgentEpoch:()=>this.agentEpoch,getAgentId:()=>this.selectedAgentId,getClient:()=>this.context.gateway.snapshot.client,getClientEpoch:()=>this.gateway.epoch,getData:()=>this.data,getOrders:()=>this.profileOrders,setData:e=>this.data=e,setError:Pt,setOrders:e=>this.profileOrders=e,clearMessage:e=>this.setMessage(e,null),canMutate:()=>this.canMutate(),cancelRefresh:()=>this.cancelCoreRefresh(),refresh:()=>this.refresh(`forced`),isCurrentClient:(e,t)=>this.gateway.isCurrent({client:e,epoch:t}),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setProbeResult:(e,t)=>this.probeResults=q(this.probeResults,e,t),setProbeError:(e,t)=>this.setMessage(e,{kind:`error`,text:t}),setLogoutSuccess:jt,getConfig:()=>this.context.runtimeConfig}),this.discovery=new Qt(this,{canOpen:()=>this.canMutate(),getOwner:()=>({client:this.gateway.client,epoch:this.gateway.epoch,agentEpoch:this.agentEpoch,agentId:this.context.settingsAgentSelection.state.selectedId,selectionIntentRevision:this.context.settingsAgentSelection.intentRevision,selectionPending:this.context.settingsAgentSelection.state.selectedId===null&&this.context.agents.state.agentsList===null}),isCurrent:e=>!!(this.isConnected&&e.client&&this.gateway.isCurrent({client:e.client,epoch:e.epoch})&&this.agentEpoch===e.agentEpoch),onClose:()=>void this.refresh(`replacement`),onError:e=>this.setMessage(`connection`,{kind:`error`,text:W(e)})}),this.login=new It(this,{getScope:()=>({context:this.context,agentId:this.selectedAgentId,authStatus:this.data?.authStatus??null}),canStart:()=>this.canMutate(),onDiscover:()=>{this.setMessage(`connection`,null),this.discovery.open()},onApiKey:e=>{this.addProviderId=e,this.addProviderKey=``,this.addProviderOpen=!0,this.setMessage(`add`,null)},canContinue:()=>this.mutationBlockedReason()===null,refresh:()=>this.refresh(`replacement`)}),this.subscriptions=new _(this).effect(()=>this.context?.gateway,e=>ye(e,()=>void this.refresh(`publication`))).effect(()=>this.context?.gateway,e=>this.installedAgents.subscribe(e)).watch(()=>this.context?.gateway.snapshot.client,Ee).watchStore(()=>this.context?.runtimeConfig,e=>{!e.state.configSnapshot&&!e.state.configLoading&&e.ensureLoaded().catch(()=>void 0),this.profileActions.flushPendingOrders()}).watchStore(()=>this.context?.overlays,()=>this.profileActions.flushPendingOrders()).watchStore(()=>this.context?.agents,()=>this.syncSelectedAgent()).effect(()=>this.context?.settingsAgentSelection,e=>e.subscribe(()=>this.syncSelectedAgent())),this.setBusy=(e,t)=>this.busy=q(this.busy,e,t?!0:null),this.setMessage=(e,t)=>this.messages=q(this.messages,e,t)}disconnectedCallback(){this.profileActions.resetOrders(),this.subscriptions.clear(),this.refreshPolicy.dispose(),super.disconnectedCallback()}willUpdate(e){let t=this.routeData,n=e.get(`routeData`);(e.has(`routeData`)||e.has(`loaderPending`))&&t&&(t.connect&&!n?.connect&&(this.pendingConnection=!0),e.has(`routeData`)&&t.provider!==n?.provider&&(this.providerQuery=we(t.provider??``)),this.cancelCoreRefresh(),this.routeDataObserved=!0,this.setSelectedAgent(this.resolveSelectedAgentId()),(t.agentId??``)===this.selectedAgentId&&t.selectionIntentRevision===this.context.settingsAgentSelection.intentRevision&&this.gateway.isRouteDataCurrent(t)?this.supplemental.adoptCoreData(t.client,t.data):(this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload()),this.ensureInitialData())}updated(){this.isConnected&&this.pendingConnection&&this.data&&this.canMutate()&&!this.core.loading&&(this.pendingConnection=!1,this.login.open())}ensureInitialData(){!this.context.agents.state.agentsList&&!this.context.agents.state.agentsLoading&&!this.context.agents.state.agentsError&&this.context.agents.ensureList();let e=this.gateway.client;this.routeDataObserved&&!this.loaderPending&&this.gateway.connected&&e&&this.selectedAgentId&&!this.core.loading&&(this.data===null||this.data.updatedAt===null||e!==this.dataClient)&&this.refresh(`replacement`)}cancelCoreRefresh(){this.catalogDiscovery.reset(),this.core.invalidate()}invalidateRequests(){this.logoutConfirmation?.abort(),this.cancelCoreRefresh(),this.supplemental.invalidate()}resetConnectionState(e={}){e.preserveVisibleData||(this.data=null,this.dataClient=null),this.refreshPolicy.resetPayload(),this.discovery.cancelLoading(),this.installedAgents.reset(e),this.resetAgentScopeState(),this.profileActions.resetProbes(),this.defaultsDraft=null}resetAgentScopeState(){this.login.reset(),this.busy={},this.messages={},this.probeResults={},this.closeKeyEditor(),this.logoutConfirmation?.abort(),this.profileActions.resetOrders(),this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``}resolveSelectedAgentId(){let e=this.context.settingsAgentSelection.state.selectedId;return e?Re(e):``}setSelectedAgent(e){return e!==this.selectedAgentId&&(this.selectedAgentId=e,this.agentEpoch+=1,this.resetAgentScopeState(),!0)}syncSelectedAgent(){this.setSelectedAgent(this.resolveSelectedAgentId())&&(this.invalidateRequests(),this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload(),this.requestUpdate(),this.ensureInitialData())}refresh(e){if(!this.selectedAgentId)return Promise.resolve();let t=this.gateway.client;return!this.gateway.connected||!t?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):this.core.refresh(t,this.selectedAgentId,e)}async patchConfig(e){let t=this.context.gateway.snapshot.client;if(!t||B(this.context)||G(this.context)||this.busy[e.key])return;let n=this.gateway.epoch,r=this.agentEpoch;return vt({runtimeConfig:this.context.runtimeConfig,isCurrentClient:()=>this.gateway.isCurrent({client:t,epoch:n}),isCurrentAgent:()=>this.agentEpoch===r,setBusy:t=>this.setBusy(e.key,t),setMessage:t=>this.setMessage(e.key,t)},e)}openKeyEditor(e){this.keyEditorProvider=e,this.keyDraft=``,this.setMessage(e,null)}closeKeyEditor(){this.keyEditorProvider=null,this.keyDraft=``}async mutateApiKey(e,t,n,r=`edit`){let i=this.gateway.client,a=r===`add`?`add`:`key:${e}`;if(!i||!this.canMutate()||this.busy[a]||n===``)return;let o=this.gateway.epoch,s=this.agentEpoch,c=()=>this.gateway.isCurrent({client:i,epoch:o})&&this.agentEpoch===s;this.profileActions.clearProbe(e);let l=await St({runtimeConfig:this.context.runtimeConfig,isCurrentClient:c,isCurrentAgent:c,canMutate:()=>this.canMutate(),refreshProviders:async()=>{let e=this.data;if(await this.refresh(`replacement`),c()&&this.data?.error){let t=this.data.error;return this.data=e,t}return this.data?.error??this.data?.catalogError??null},setBusy:e=>this.setBusy(a,e),setMessage:t=>{this.setMessage(e,t),r===`add`&&this.setMessage(`add`,t)}},{client:i,agentId:this.selectedAgentId,provider:t,apiKey:n,success:xt(r,n,e)});l.ok&&c()&&(r===`add`?this.addProviderId===e&&this.addProviderKey.trim()===n&&(this.addProviderOpen=!!l.warning,l.warning||(this.addProviderId=``),this.addProviderKey=``):this.keyEditorProvider===e&&this.keyDraft.trim()===n&&this.closeKeyEditor())}async requestLogout(e){if(this.logoutConfirmation||!this.canMutate()||this.busy[`logout:${e.cardId}`])return;let t=new AbortController;this.logoutConfirmation=t,await Ve({title:g(`modelProviders.logout.actionFor`,{account:e.label}),message:g(`modelProviders.logout.confirm`,{provider:e.label}),confirmLabel:g(`modelProviders.logout.action`),danger:!0,signal:t.signal}).finally(()=>{this.logoutConfirmation=null})&&!t.signal.aborted&&this.canMutate()&&await this.profileActions.logout(e.cardId,e.target)}async addProvider(){let e=this.addProviderId;e&&await this.mutateApiKey(e,e,this.addProviderKey.trim(),`add`)}async saveDefaults(e=this.defaultsDraft){e&&(await this.patchConfig({key:`defaults`,raw:Bt(e),note:g(`modelProviders.notes.defaultModel`),replacePaths:ht}),this.defaultsDraft===e&&(this.defaultsDraft=null))}render(){let e=this.context.gateway.snapshot,t=e.hello?.auth,n=this.context.agents.state,r=n.agentsList?.agents??[],i=n.agentsList!==null&&ne(r).length===0,a=n.agentsList?null:n.agentsError,o=r.find(e=>Re(e.id)===this.selectedAgentId),s=this.data??ft,c=te(this.context.runtimeConfig.state),l=Vt(c),u=De(e.client,this.selectedAgentId),d={...l.defaults,...bt(D(D(c?.agents)?.defaults))},{defaults:f,configuredModels:p}=Ct(u,d,this.defaultsDraft),h=e=>{this.defaultsDraft={...this.defaultsDraft??d,...e},this.setMessage(`defaults`,null),this.saveDefaults(this.defaultsDraft)},_=wt({...s,models:u?.models??null,providerOutcomes:u.hasSnapshot?u.providerOutcomes??[]:s.providerOutcomes,pendingProviders:u?.pendingProviders,providerUsage:s.providerUsage?.ok?s.providerUsage.value:null,configProviderIds:l.providerIds,configApiKeyProviderIds:l.apiKeyProviderIds,configProviderAuthModes:l.providerAuthModes}),v=new Set([...l.providerIds,...s.authStatus?.providers.filter(e=>!!e.apiKey||e.profiles.length>0).map(e=>e.provider)??[]]),y=_e(e,`models.probe`),ee=_e(e,`codex.accountUsage`),b=this.login.pageActions;return kn({body:Dn({accountRecovery:this.login.renderRecovery(),providerScope:On({agentLabel:o?m(o):this.selectedAgentId,...b,connectDisabled:b.connectDisabled||this.discovery.busy||this.addProviderOpen}),providerQuery:this.providerQuery,onProviderQueryChange:e=>this.providerQuery=e,onConnectProvider:()=>void this.login.open(),usageClient:!this.mutationBlockedReason()&&ee?e.client:null,usageAgentId:this.selectedAgentId,connected:e.phase===`connected`,loading:e.phase===`connected`&&this.data===null&&!a&&!i,refreshing:this.core.loading,error:a??(i?g(`agents.noAgents`):s.error),providerUsageFailed:s.providerUsage?.ok===!1,supplementalLoading:this.loaderPending||this.supplemental.loading,updatedAt:s.updatedAt,costDays:30,credentialAgentLabel:o?m(o):this.selectedAgentId,cards:i?[]:this.installedAgents.filterProviders(_),configuredModels:p,decisionModels:u?.decisionModels??[],defaultModels:f,authStatus:s.authStatus,automaticUtilityModel:u?.defaultModels?.automaticUtilityModel,utilityRuntime:u?.defaultModels?.utilityRuntime,thinkingLevel:f.thinkingLevel,thinkingOverridden:f.thinkingOverridden,fastMode:f.fastMode,fastModeOverridden:f.fastModeOverridden,catalogDiscovering:this.catalogDiscovery.discovering||!!u?.pendingProviders?.length,catalogDiscoveryError:this.catalogDiscovery.discovering?null:this.catalogDiscovery.error??s.catalogError,configBusy:G(this.context),unconfiguredProviders:zt(s.authStatus?.providerCapabilities,v),canViewProfiles:e.phase===`connected`&&t?.scopes!==void 0&&se(t),mutationBlockedReason:this.mutationBlockedReason(),defaultsMutationBlockedReason:B(this.context),providerUsageStalled:this.refreshPolicy.incompleteUsageExhausted,probeAvailable:y!==!1,busy:this.busy,messages:this.messages,probeResults:this.probeResults,keyEditorProvider:this.keyEditorProvider,keyDraft:this.keyDraft,profileOrders:this.profileOrders,addProviderOpen:this.addProviderOpen,addProviderId:this.addProviderId,addProviderKey:this.addProviderKey,installedAgents:this.installedAgents.render(_,()=>this.catalogDiscovery.retry()),onRefresh:()=>void(a?this.context.agents.refreshList():Promise.all([this.context.runtimeConfig.refresh({background:!0}),this.refresh(`forced`)])),onOpenKeyEditor:e=>this.openKeyEditor(e),onCloseKeyEditor:()=>this.closeKeyEditor(),onKeyDraftChange:e=>this.keyDraft=e,onSaveKey:(e,t)=>void this.mutateApiKey(e,t,this.keyDraft.trim()),onRemoveKey:(e,t)=>void this.mutateApiKey(e,t,null),onProbe:(e,t)=>void this.profileActions.probe(e,t),onRequestLogout:e=>void this.requestLogout(e),onProfileOrderChange:(e,t,n)=>this.profileActions.setOrder(e,t,n),onAddProviderToggle:()=>{this.addProviderOpen=!this.addProviderOpen,this.addProviderKey=``,this.setMessage(`add`,null)},onAddProviderKeyChange:e=>this.addProviderKey=e,onAddProvider:()=>void this.addProvider(),...gt(()=>this.defaultsDraft??d,h),onCatalogRetry:()=>this.catalogDiscovery.retry(),...this.login.providerActions}),loginMessage:this.messages.connection??b.loginMessage,login:C`${b.login}${this.discovery.render({agentLabel:o?m(o):this.selectedAgentId,credentialChoices:s.authStatus?.providerCapabilities?.flatMap(e=>e.loginOptions?.map(e=>e.id)??[])??[]})}`})}},O([Fe({context:le,subscribe:!0})],$.prototype,`context`,void 0),O([fe({attribute:!1})],$.prototype,`routeData`,void 0),O([fe({attribute:!1})],$.prototype,`loaderPending`,void 0),O([E()],$.prototype,`data`,void 0),O([E()],$.prototype,`busy`,void 0),O([E()],$.prototype,`messages`,void 0),O([E()],$.prototype,`probeResults`,void 0),O([E()],$.prototype,`keyEditorProvider`,void 0),O([E()],$.prototype,`keyDraft`,void 0),O([E()],$.prototype,`profileOrders`,void 0),O([E()],$.prototype,`providerQuery`,void 0),O([E()],$.prototype,`addProviderOpen`,void 0),O([E()],$.prototype,`addProviderId`,void 0),O([E()],$.prototype,`addProviderKey`,void 0),O([E()],$.prototype,`defaultsDraft`,void 0),O([E()],$.prototype,`selectedAgentId`,void 0),customElements.get(`openclaw-model-providers-page`)||customElements.define(`openclaw-model-providers-page`,$)})))()}jn();
//# sourceMappingURL=model-providers-page-BxEHY2J0.js.map