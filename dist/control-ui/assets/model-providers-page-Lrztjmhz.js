const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./model-setup-page-DLYRkcHw.js","./control-ui-boot-shared-C8yid87L.js","./control-ui-boot-shared-DIh44kBs.js","./markdown-runtime-B1-JWj3L.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-DbQ0OGrz.js","./control-ui-boot-shared-CnT6GD3L.js","./control-ui-boot-shared-BwgRPMMK.js","./control-ui-boot-shared-Do172wng.js","./control-ui-boot-shared-Cw9VhLyx.js","./sidebar-update-runtime-DljiVzh4.js","./settings-CQpQmrfe.js","./wizard-login-controller-BoUsNEQH.js","./wizard-step-controls-B2-alQe6.js","./channel-picker-BCdOii3Y.js","./image-with-fallback-BBZ3mREB.js","./control-ui-core-2cJmD3kZ.css","./control-ui-boot-shared-CVUnDsao.css","./sidebar-update-runtime-ah7rgQE7.css","./settings-DKx3Mogj.css","./channel-picker-hvRTuarN.css","./wizard-step-controls-D2NAzKG1.css","./wizard-login-controller-CpdIpYqr.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Kr as t,Na as n,Qr as r,Wi as i,Zr as a,ai as o,dr as s,no as c,qr as l,to as u}from"./control-ui-foundation-Bju0LxrM.js";import{Ai as d,Bc as f,Dc as p,Fs as m,Gl as h,Gn as ee,Is as g,Ll as _,Ls as v,Oc as te,Qo as y,Vc as b,Xl as x,Yc as ne,_n as re,da as ie,fa as ae,in as oe,kc as se,ki as ce,mn as le,nc as ue,on as de,tc as fe,ts as pe,vi as me,yi as he,zl as ge}from"./control-ui-core-DX6662ze.js";import{$ as S,X as C,Y as w,c as _e,ct as T,nt as ve,s as ye,tt as be,ut as E}from"./lit-runtime-BOUQsi_O.js";import{Cr as xe,Di as Se,Fi as D,Ii as O,Li as Ce,Oi as we,Or as Te,Qa as Ee,Ri as De,fo as Oe}from"./control-ui-core-QgEwr0pF.js";import{G as ke,H as k,U as A,V as j}from"./control-ui-boot-shared-BTCVmdzL.js";import{gt as Ae,ht as je}from"./control-ui-boot-shared-Cz3Zwi4M.js";import{c as Me,s as Ne,u as Pe}from"./gateway-runtime-DGdfj77o.js";import{$ as Fe,Aa as Ie,Da as Le,I as Re,L as ze,Oa as Be,at as Ve,ca as He,et as Ue,it as We,ka as Ge,l as Ke,la as qe,mo as Je,nt as Ye,po as Xe,tt as Ze,u as Qe}from"./control-ui-boot-shared-gJH8zZtq.js";import{Ct as $e,Dt as et,Ea as M,Et as N,Mt as tt,Oa as nt,Ot as P,St as rt,Ta as it,_t as F,bt as at,co as ot,ht as st,jt as ct,pt as I,so as lt,vt as L,wa as ut,wt as R}from"./control-ui-boot-shared-SOjXo6bG.js";import{ht as dt,mt as ft}from"./control-ui-boot-shared-BaakSUsS.js";import{n as pt,t as mt}from"./en-settings-tomLhsTf.js";import{n as ht,t as gt}from"./settings-workspace-Du_3hPkz.js";import{n as _t,t as vt}from"./model-picker-Bh2yfx7U.js";import{n as yt,t as bt}from"./decision-model-picker-BBzbYId4.js";import{a as xt,i as St,n as z,r as Ct,t as wt}from"./load-CAKTSiIC.js";import{a as Tt,i as Et,n as Dt,r as Ot}from"./usage-CVnqU1zH.js";import{a as kt,c as At,i as B,l as jt,n as Mt,o as Nt,r as Pt,s as Ft,t as It}from"./view-status-S5LEFK1B.js";function Lt(e){let t=null,n=null,r=0,i={get generation(){return r},get discovering(){return t!==null},get error(){return n},retry(){a()},reset(){let r=t;t=null,n=null,r?.abort(),e.requestUpdate()}};async function a(){let i=e.getAgentId();if(!i||t)return;let a=e.getGateway(),o=a.client;if(!a.connected||!o)return;let s=e.getAgentEpoch(),c=a.epoch,l=new AbortController,u=()=>t===l&&a.isCurrent({client:o,epoch:c})&&e.getAgentId()===i&&e.getAgentEpoch()===s;t=l,r+=1,n=null,e.requestUpdate();try{let t=await Ue(o,{agentId:i,refresh:!0,signal:l.signal});if(u()){n=Ze(t,x(`modelProviders.defaults.discoverFailed`));let r=e.getData();r&&e.setData({...r,providerOutcomes:t.providerOutcomes??[],catalogError:null})}}catch(e){u()&&(n=m(e,`request failed`))}finally{t===l&&(t=null,e.requestUpdate(),e.onSettled())}}return i}function Rt(){return(Rt=e((()=>{h(),v(),Fe()})))()}function zt(e,t){return{onPrimaryChange:n=>{t({primary:n,fallbacks:e().fallbacks.filter(e=>e!==n)})},onFallbackChange:n=>{t({fallbacks:n?[n,...e().fallbacks.slice(1).filter(e=>e!==n)]:[]})},onUtilityChange:e=>t({utilityModel:e}),onDecisionChange:e=>t({decisionModel:e}),onThinkingChange:e=>t({thinkingLevel:e,thinkingOverridden:!0}),onThinkingReset:()=>t({thinkingLevel:void 0,thinkingOverridden:!1}),onFastModeChange:e=>t({fastMode:e,fastModeOverridden:!0}),onFastModeReset:()=>t({fastMode:void 0,fastModeOverridden:!1})}}function Bt(e){let t=e?.thinkingDefault,n=e?.fastModeDefault;return{thinkingLevel:typeof t==`string`?t:void 0,thinkingOverridden:e!==null&&Object.hasOwn(e,`thinkingDefault`),fastMode:n===`auto`||typeof n==`boolean`?n:void 0,fastModeOverridden:e!==null&&Object.hasOwn(e,`fastModeDefault`)}}function Vt(e){return{agents:{defaults:{...e.primary?{model:e.fallbacks.length>0?{primary:e.primary,fallbacks:[...e.fallbacks]}:e.primary}:{},utilityModel:e.utilityModel,...e.decisionModel===void 0?{}:{decisionModel:e.decisionModel},thinkingDefault:e.thinkingOverridden&&e.thinkingLevel?e.thinkingLevel:null,fastModeDefault:e.fastModeOverridden&&e.fastMode!==void 0?e.fastMode:null}}}}function Ht(e){return/method (?:not found|not supported)|unknown method/iu.test(U(e))}function Ut(e,t){if(t.length===1)return t[0];let n=t.some(e=>e.status===`ok`)?`ok`:Jt.find(e=>t.some(t=>t.status===e))??`unknown`,r=t.find(e=>e.status===n)?.error;return{provider:e,status:n,...r?{error:r}:{},results:t.flatMap(e=>e.results.map(t=>({...t,label:`${e.provider}: ${t.label}`})))}}function V(e){let t=e.runtimeConfig.state,n=e.overlays.snapshot;return t.configLoading||t.configSaving||t.configApplying||n.updateRunning||n.updateReconciliationPending}function H(e){let t=e.gateway.snapshot;if(t.phase!==`connected`)return x(`modelProviders.readOnly.disconnected`);if(e.runtimeConfig.canPatch!==!0)return x(`modelProviders.readOnly.adminRequired`);let n=e.runtimeConfig.state;return!t.client||n.client!==t.client||!f(n)?x(`modelProviders.configUnavailable`):null}function U(e){return m(e,x(`modelProviders.requestFailed`))}async function Wt(e,t){let{runtimeConfig:n}=e;e.setBusy(!0),e.setMessage(null);try{if(await n.ensureLoaded(),!e.isCurrentClient())return;let r=await n.patch({raw:t.raw,note:t.note,...t.replacePaths?{replacePaths:t.replacePaths}:{}});if(!e.isCurrentClient())return;r||e.isCurrentAgent()&&e.setMessage({kind:`error`,text:n.state.lastError??x(`modelProviders.configUnavailable`)})}catch(t){e.isCurrentClient()&&e.isCurrentAgent()&&e.setMessage({kind:`error`,text:U(t)})}finally{e.isCurrentClient()&&e.isCurrentAgent()&&e.setBusy(!1)}}async function Gt(e,t){let n=()=>e.isCurrentClient()&&e.isCurrentAgent();e.setBusy(!0),e.setMessage(null);try{let r=await e.runtimeConfig.runExternalMutation(async e=>{if(e!==t.client)throw Error(x(`modelProviders.requestFailed`));let n={provider:t.provider,agentId:t.agentId},r=await(t.apiKey===null?e.request(`models.authLogout`,{...n,credentialType:`api_key`}):e.request(`models.authSetApiKey`,{...n,apiKey:t.apiKey}));return d(e),r},{canDispatch:()=>n()&&e.canMutate()});if(!n())return{ok:!1};if(!r.ok)return e.setMessage({kind:`error`,text:r.error}),{ok:!1};let i=r.value.warning?[r.value.warning]:[];if(!r.refresh.ok)i.push(r.refresh.error);else try{let t=await e.refreshProviders();t&&i.push(t)}catch(e){i.push(U(e))}if(!n())return{ok:!1};let a=i.length>0?i.join(` `):null;return e.setMessage({kind:`success`,text:t.success,...a?{warning:a}:{}}),{ok:!0,warning:a}}finally{n()&&e.setBusy(!1)}}function Kt(e,t,n){return x(e===`add`?`modelProviders.add.saved`:t===null?`modelProviders.apiKey.removed`:`modelProviders.apiKey.saved`,{provider:n})}var qt,Jt;function W(){return(W=e((()=>{h(),b(),v(),ce(),qt=[`agents.defaults.model.fallbacks`],Jt=[`auth`,`billing`,`rate_limit`,`timeout`,`format`,`no_model`,`unknown`]})))()}var Yt;function Xt(){return(Xt=e((()=>{j(),ie(),z(),Yt=class{constructor(e,t){this.options=t,this.active=!1,this.publicationPending=!1,this.task=new k(e,{autoRun:!1,task:([e],{signal:t})=>e?xt(e.client,{agentId:e.agentId,...e.reason===`forced`?{refresh:!0}:{},signal:t}).then(t=>({...e,data:t})):A,onComplete:e=>{this.settle(),this.options.onComplete(e)},onError:()=>this.settle()})}get loading(){return this.active}refresh(e,t,n){return n===`publication`&&(this.active||this.options.isCatalogLoading())?(this.publicationPending=!0,Promise.resolve()):(n===`publication`&&(this.publicationPending&&ae(e,{agentId:t}),this.publicationPending=!1),this.active=!0,this.options.onStart(n),this.task.run([{client:e,agentId:t,reason:n}]))}invalidate(){this.publicationPending=!1,this.active=!1,this.task.run([null])}settle(){this.active=!1,this.flushPublication()}flushPublication(){queueMicrotask(()=>{this.publicationPending&&!this.active&&!this.options.isCatalogLoading()&&this.options.refreshPublication()})}}})))()}function G(e){return Le(e)}function Zt(e){switch(e.status){case`ok`:case`expiring`:case`expired`:case`missing`:return e.status;default:return`api-key`}}function K(e,t){return e.find(e=>t.some(t=>e.ids.has(t)))}function q(e,t,n){let r=K(e,[t]);if(r)return r;let i={ids:new Set([t]),card:{id:t,displayName:n,profiles:[],profileProviderIds:{},profileOrders:{},profileOrderExplicitProviders:[],profileOrderStoredProviders:[],profileOrderLocks:{},credentialProviderIds:[],logoutTargets:[],hasConfigApiKey:!1,modelCount:0,availableModelCount:0},hasModelAuth:!1};return e.push(i),i}function Qt(e,t){let n=l(t);n&&!e.some(e=>l(e)===n)&&e.push(t)}function $t(e,t,n){if(n.length===0)return;let r=l(t),i=e.find(e=>l(e.provider)===r);if(!i){e.push({provider:t,profileIds:[...new Set(n)]});return}i.profileIds=[...new Set([...i.profileIds,...n])]}function en(e){let t=[],n=new Map,r=new Map,i=new Set;for(let t of e.authStatus?.providerCapabilities??[]){let e=G(t.provider);e&&n.set(e,n.get(e)===!0||t.apiKeySupported)}for(let n of e.configProviderIds??[]){let e=G(n);e&&(q(t,e,M(e)).card.configKey??=n)}for(let n of e.configApiKeyProviderIds??[]){let e=G(n);if(e){let r=q(t,e,M(e)).card;r.configKey=n,r.hasConfigApiKey=!0,Qt(r.credentialProviderIds,n)}}for(let[n,r]of Object.entries(e.configProviderAuthModes??{})){let e=G(n);e&&(q(t,e,M(e)).card.configAuthMode=r)}for(let n of e.pendingProviders??[]){let e=G(n);e&&(q(t,e,M(e)).card.checkingModels=!0)}for(let n of e.providerOutcomes??[]){let e=G(n.provider);if(!e)continue;let r=q(t,e,M(e)),i=r.catalogOutcome,a=n.profileId===void 0,o=an[a?`provider`:`profile`];(!i||(a===(i.profileId===void 0)?o.indexOf(n.status)<o.indexOf(i.status):a))&&(r.catalogOutcome=n)}for(let n of e.models??[]){let e=G(n.provider);if(!e)continue;let r=q(t,e,M(e));r.card.modelCount+=1,n.available===!0&&(r.card.availableModelCount+=1)}for(let a of e.authStatus?.providers??[]){let e=G(a.provider);if(!e)continue;let o=a.usage?G(a.usage.providerId):e,s=[...new Set([e,o])],c=K(t,s)??q(t,o,M(o));for(let e of s)c.ids.add(e);if(c.card.displayName=a.displayName||c.card.displayName,c.card.profiles.push(...a.profiles),a.profiles.length>0){let e=a.authProvider||a.provider;for(let t of a.profiles)c.card.profileProviderIds[t.profileId]=e;a.profileOrder!==void 0&&i.add(e);let t=a.profileOrder??a.profiles.map(e=>e.profileId);r.set(e,[...new Set([...r.get(e)??[],...t])]),c.card.profileOrders[e]=t,a.profileOrderStored===!0&&!c.card.profileOrderStoredProviders.includes(e)&&c.card.profileOrderStoredProviders.push(e),a.profileOrderLocked!==void 0&&(c.card.profileOrderLocks[e]??=a.profileOrderLocked)}(a.apiKey||a.profiles.length>0)&&Qt(c.card.credentialProviderIds,a.provider),$t(c.card.logoutTargets,a.provider,a.profiles.filter(e=>e.logoutSupported===!0).map(e=>e.profileId)),c.card.apiKey??=a.apiKey,c.hasModelAuth||=Ge(a)||n.has(e);let l=a.usage;l&&!c.card.usage&&(c.card.usage={provider:l.providerId,displayName:a.displayName,windows:l.windows,...l.summary?{summary:l.summary}:{},...l.plan?{plan:l.plan}:{},...l.billing?.length?{billing:l.billing}:{}})}for(let e of t){e.card.profileOrderExplicitProviders=Object.keys(e.card.profileOrders).filter(e=>i.has(e));for(let t of Object.keys(e.card.profileOrders)){let n=r.get(t);n&&(e.card.profileOrders[t]=n)}}for(let n of Ie(e.authStatus?.providers??[])){let e=K(t,[G(n.provider)]);e&&(e.card.auth={kind:Zt(n),profileCount:n.profiles.length,...n.expiry?.label?{expiryLabel:n.expiry.label}:{}})}for(let n of e.providerUsage?.providers??[]){let e=G(n.provider);if(!e)continue;let r=K(t,[e])??q(t,e,n.displayName||M(e));r.ids.add(e),r.card.usage=n}for(let n of e.costByProvider??[]){let e=G(n.provider??``);if(!e)continue;let r=K(t,[e])??q(t,e,M(e)),i={totalCost:n.totals.totalCost,totalTokens:n.totals.totalTokens,messageCount:n.count},a=r.card.localCost;r.card.localCost=a?{totalCost:a.totalCost+i.totalCost,totalTokens:a.totalTokens+i.totalTokens,messageCount:a.messageCount+i.messageCount}:i}return t.filter(t=>t.hasModelAuth||(e.configProviderIds??[]).some(e=>G(e)===t.card.id)||!!t.card.usage||t.card.modelCount>0||!!t.catalogOutcome||t.card.checkingModels||(t.card.localCost?.totalTokens??0)>0).map(e=>{let t=n.get(e.card.id);return Object.assign({},e.card,e.catalogOutcome?{catalogStatus:e.catalogOutcome.status}:{},t===void 0?{}:{apiKeySupported:t})}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function J(e){return e.selectionRef===void 0?e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`:e.selectionRef}function tn(e,t){let n=new Set([t.primary,...t.fallbacks,t.utilityModel].filter(e=>typeof e==`string`&&e.length>0)),r=(e??[]).filter(e=>e.available!==!1||n.has(J(e))),i=new Set(r.map(J)),a=e===null?{}:{available:!1};for(let t of n){if(i.has(t))continue;let{model:n,profile:o}=s(t);if(o){let i=(e??[]).find(e=>J(e)===n);if(i){r.push({...i,selectionRef:t});continue}}let c=t.indexOf(`/`);if(c<=0||c===t.length-1){let n=t.trim().toLowerCase(),i=(e??[]).find(e=>e.alias?.trim().toLowerCase()===n||e.id.trim()===t.trim());r.push({...i??{provider:``,id:t,name:t,...a},selectionRef:t});continue}r.push({provider:t.slice(0,c),id:t.slice(c+1),name:t,...a})}return r}function nn(e){let t=i(e?.models),n=i(t?.providers),r=i(e?.agents),a=i(r?.defaults),o=a?.model,s=i(o),c=typeof o==`string`?o:typeof s?.primary==`string`?s.primary:``,l=Array.isArray(s?.fallbacks)?s.fallbacks.filter(e=>typeof e==`string`):[];return{providerIds:Object.keys(n??{}),apiKeyProviderIds:Object.entries(n??{}).filter(([,e])=>{let t=i(e);return t?Object.hasOwn(t,`apiKey`)&&t.apiKey!=null:!1}).map(([e])=>e),providerAuthModes:Object.fromEntries(Object.entries(n??{}).flatMap(([e,t])=>{let n=i(t)?.auth;return typeof n==`string`?[[e,n]]:[]})),defaults:{primary:c,fallbacks:l,utilityModel:typeof a?.utilityModel==`string`?a.utilityModel:null,...typeof a?.decisionModel==`string`?{decisionModel:a.decisionModel}:{}}}}function rn(e,t){let n=new Set(Array.from(t,G)),r=new Map;for(let t of e??[]){let e=G(t.provider);t.quickApiKeySetup&&e&&!n.has(e)&&!r.has(e)&&r.set(e,{id:e,displayName:M(e)})}return[...r.values()].toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}var an;function on(){return(on=e((()=>{t(),it(),Be(),an={provider:[`auth-rejected`,`unavailable`,`ready`],profile:[`ready`,`auth-rejected`,`unavailable`]}})))()}function sn(e){return e.state===`closed`?C:e.state===`loading`?S`<openclaw-modal-dialog
      label=${x(`modelSetup.discovery.title`)}
      @modal-cancel=${e.onCancel}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__body" role="status">${x(`common.loading`)}</div>
        <div class="model-setup-wizard__footer">
          <button class="btn" @click=${e.onCancel}>${x(`common.cancel`)}</button>
        </div>
      </div>
    </openclaw-modal-dialog>`:S`<openclaw-model-setup-page
    .routeData=${{firstRun:!1}}
    .embedded=${!0}
    .onConnectChoice=${e.onConnectChoice}
    .credentialChoices=${e.credentialChoices}
    .agentLabel=${e.agentLabel}
    .onClose=${e.onClose}
  ></openclaw-model-setup-page>`}var cn;function ln(){return(ln=e((()=>{w(),h(),At(),c(),jt(),cn=class{constructor(e,t){this.host=e,this.options=t,this.state=`closed`,this.generation=0,this.owner=null,e.addController(this)}get busy(){return this.state!==`closed`}reset(){this.generation+=1,this.state=`closed`,this.owner=null,this.host.requestUpdate()}hostUpdated(){let e=this.owner;if(!e)return;let t=this.options.getOwner();(this.state===`loading`&&!this.options.isCurrent(e)||t.selectionIntentRevision!==e.selectionIntentRevision||!t.selectionPending&&t.agentId!==e.agentId)&&this.reset()}cancelLoading(){this.state===`loading`&&this.reset()}hostDisconnected(){this.reset()}async open(){if(!this.options.canOpen()||this.busy)return;let e=this.options.getOwner();if(!e.client)return;let t=this.generation,n=()=>t===this.generation&&this.state===`loading`&&this.options.isCurrent(e);this.owner=e,this.state=`loading`,this.host.requestUpdate();try{await u(()=>import(`./model-setup-page-DLYRkcHw.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]),import.meta.url),n()&&(this.state=`ready`,this.host.requestUpdate())}catch(e){n()&&(this.reset(),this.options.onError(e))}}render(e){let t=this.generation;return sn({...e,state:this.state,onCancel:()=>{t===this.generation&&this.reset()},onClose:()=>{t===this.generation&&(this.reset(),this.options.onClose())},onConnectChoice:e=>{t===this.generation&&(this.reset(),this.options.onConnectChoice(e))}})}}})))()}var un,dn,fn;function pn(){return(pn=e((()=>{j(),w(),O(),it(),I(),h(),b(),Me(),W(),un=`acpx.agents.list`,dn={installed:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.installed`},missing:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.missing`},unverified:{kind:`warn`,labelKey:`modelProviders.installedAgents.status.unverified`}},fn=class{constructor(e,t){this.host=e,this.options=t,this.agents=null,this.pending=new Map,this.messages=new Map,this.list=new k(e,{args:()=>[t.gateway.connected&&this.available()?t.gateway.client:null,t.gateway.epoch],task:async([e],{signal:t})=>e?(await e.request(un,{},{signal:t})).agents:A,onComplete:e=>{this.agents=e}})}get loading(){return this.list.status===ke.PENDING}get error(){return this.list.status===ke.ERROR?U(this.list.error):null}subscribe(e){return e.subscribeEvents(e=>{e.event===`config.changed`&&this.agents!==null&&this.pending.size===0&&this.list.run()})}reset(e={}){this.list.run([null,this.options.gateway.epoch]),this.pending.clear(),this.messages.clear(),e.preserveVisibleData||(this.agents=null)}filterProviders(e){return e.filter(e=>!this.agents?.some(t=>t.runtimeId===e.id))}available(){return Ne(this.options.getContext().gateway.snapshot,un,`operator.read`)}blockedReason(){return H(this.options.getContext())}setEnabled(e,t){let n=this.options.gateway.capture();if(!n||this.blockedReason()||V(this.options.getContext())||this.pending.has(e.id))return!1;this.pending.set(e.id,t);let r=()=>this.options.gateway.isCurrent(n);return Wt({runtimeConfig:this.options.getContext().runtimeConfig,isCurrentClient:r,isCurrentAgent:()=>!0,setBusy:t=>{t||this.pending.delete(e.id),this.host.requestUpdate()},setMessage:t=>{t?this.messages.set(e.id,t):this.messages.delete(e.id),this.host.requestUpdate()}},{key:`installed-agent:${e.id}`,raw:{plugins:{entries:{acpx:{config:{nativeAgents:{[e.id]:t}}}}}},note:x(`modelProviders.installedAgents.note`)}).then(()=>{r()&&this.list.run()}),!0}renderAgent(e,t,n,r){let i=this.pending.get(e.id),a=i??(typeof n==`boolean`?n:e.enabled),o=dn[e.installation],s=``;e.installation===`missing`?s=x(`modelProviders.installedAgents.installHint`,{name:e.name}):e.installation===`unverified`?s=x(`modelProviders.installedAgents.unverifiedHint`):a?r?.catalogStatus===`auth-rejected`?(o={kind:`danger`,labelKey:`modelProviders.installedAgents.status.signIn`},s=x(`modelProviders.installedAgents.signInHint`,{name:e.name})):r?.catalogStatus===`unavailable`?(o={kind:`warn`,labelKey:`modelProviders.status.modelsUnavailable`},s=x(`modelProviders.installedAgents.discoveryHint`,{name:e.name})):r?.checkingModels?o={kind:`muted`,labelKey:`modelProviders.installedAgents.status.discovering`}:r&&r.availableModelCount>0?o={kind:`ok`,labelKey:`modelProviders.installedAgents.status.modelsAvailable`}:s=x(`modelProviders.installedAgents.signInHint`,{name:e.name}):s=x(`modelProviders.installedAgents.disabledHint`);let c=this.messages.get(e.id);return S`
      <div class="model-providers__installed-agent" data-installed-agent=${e.id}>
        ${ct({icon:ut(e.id)?nt(e.id,{className:`model-providers__icon`}):S`<span
                class="model-providers__icon model-providers__agent-icon"
                aria-hidden="true"
                >${D.terminal}</span
              >`,title:e.name,ariaLabel:x(`modelProviders.installedAgents.toggle`,{name:e.name}),description:i===void 0?S`${P({kind:o.kind,label:x(o.labelKey)})}${s?S`<br />${s}`:C}`:P({kind:`muted`,label:x(`modelProviders.saving`)}),checked:a,disabled:t||i!==void 0,onChange:t=>this.setEnabled(e,t)})}
        ${c?S`<div
                class="callout ${c.kind} model-providers__installed-agent-message"
                role=${c.kind===`error`?`alert`:`status`}
              >
                ${c.text}
              </div>`:C}
      </div>
    `}render(e,t){if(!this.available())return C;let n=this.blockedReason(),r=n!==null||V(this.options.getContext()),a=f(this.options.getContext().runtimeConfig.state),o=i(i(a?.plugins)?.entries),s=i(i(o?.acpx)?.config),c=i(s?.nativeAgents),l=this.error?S`<div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__desc provider-usage-error" role="alert">${this.error}</span>
          </div>
          <div class="settings-row__control">
            <button
              class="btn btn--sm"
              ?disabled=${this.loading}
              @click=${()=>void this.list.run()}
            >
              ${x(`common.retry`)}
            </button>
          </div>
        </div>`:C,u=this.agents===null?this.error?l:at({rows:4}):S`${l}${this.agents.length===0?F(x(`modelProviders.installedAgents.empty`)):this.agents.map(t=>this.renderAgent(t,r,c?.[t.id],e.find(e=>e.id===t.runtimeId)))}`,d=this.loading?x(`modelProviders.installedAgents.checking`):x(`modelProviders.installedAgents.check`);return S`
      <div class="model-providers__installed-agents">
        ${N({title:x(`modelProviders.installedAgents.title`),description:S`${x(`modelProviders.installedAgents.description`)}${n?S`<br />${n}`:C}`,actions:S`
              <openclaw-tooltip .content=${d}>
                <button
                  type="button"
                  class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
                  aria-label=${d}
                  ?disabled=${this.loading||this.pending.size>0}
                  @click=${()=>{this.list.run(),t()}}
                >
                  ${D.refresh}
                </button>
              </openclaw-tooltip>
            `},u)}
      </div>
    `}}})))()}var mn;function hn(){return(hn=e((()=>{h(),ce(),W(),mn=class{constructor(e){this.options=e,this.probeEpochs=new Map,this.probeUnsupported=!1,this.pendingOrders=new Map,this.activeOrderProviders=new Set}get probeAvailable(){return!this.probeUnsupported}resetProbes(){this.probeEpochs=new Map,this.probeUnsupported=!1}clearProbe(e){this.probeEpochs.set(e,(this.probeEpochs.get(e)??0)+1),this.options.setBusy(`probe:`+e,!1),this.options.setProbeResult(e,null)}async probe(e,t){let n=this.options.getClient(),r=`probe:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r)||this.probeUnsupported)return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=(this.probeEpochs.get(e)??0)+1;this.probeEpochs.set(e,s);let c=()=>this.options.isCurrentClient(n,i)&&this.options.getAgentEpoch()===o&&this.options.getAgentId()===a&&this.probeEpochs.get(e)===s;this.options.setBusy(r,!0),this.options.clearMessage(e);try{let r=[];for(let e of t){if(!c())return;r.push(await n.request(`models.probe`,{provider:e,agentId:a}))}c()&&this.options.setProbeResult(e,Ut(e,r))}catch(t){if(!c())return;Ht(t)?(this.probeUnsupported=!0,this.options.setProbeError(e,x(`modelProviders.probe.unavailable`))):this.options.setProbeError(e,U(t))}finally{c()&&this.options.setBusy(r,!1)}}resetOrders(){this.pendingOrders.clear(),this.options.setOrders({})}setOrder(e,t,n){let r=this.options.getData()?.authStatus?.providers.find(e=>e.provider===t),i=n??r?.profiles.map(e=>e.profileId)??[];this.options.setOrders({...this.options.getOrders(),[t]:i}),this.pendingOrders.set(t,{cardId:e,profileIds:n,optimisticOrder:i}),this.options.clearMessage(e),this.flushOrder(t)}flushPendingOrders(){if(this.options.canMutate())for(let e of this.pendingOrders.keys())this.flushOrder(e)}async logout(e,t){let n=this.options.getClient(),r=`logout:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r))return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=()=>this.isCurrentScope(n,i,o,a);this.clearProbe(e),this.options.setBusy(r,!0),this.options.clearMessage(e);try{let n=await this.options.getConfig().runExternalMutation(async e=>{let n=await e.request(`models.authLogout`,{...t,agentId:a});return d(e),n},{canDispatch:()=>s()&&this.options.canMutate()});if(!s())return;if(!n.ok){await this.options.refresh(),s()&&this.options.setError(e,n.error);return}let r=n.value.warning?[n.value.warning]:[];if(!n.refresh.ok)r.push(n.refresh.error);else try{await this.options.refresh();let e=this.options.getData()?.error;e&&r.push(e)}catch(e){r.push(U(e))}s()&&this.options.setLogoutSuccess(r.join(` `)||void 0)}catch(t){s()&&this.options.setError(e,t)}finally{s()&&this.options.setBusy(r,!1)}}async flushOrder(e){if(!this.activeOrderProviders.has(e)){this.activeOrderProviders.add(e);try{for(;;){let t=this.pendingOrders.get(e);if(!t)return;let n=this.options.getClient();if(!n||!this.options.canMutate())return;this.pendingOrders.delete(e);let r=this.options.getClientEpoch(),i=this.options.getAgentEpoch(),a=this.options.getAgentId();try{let o=await n.request(`models.authOrderSet`,{provider:e,...t.profileIds?{profileIds:t.profileIds}:{},agentId:a});if(d(n),!this.isCurrentScope(n,r,i,a))return;if(t.profileIds&&!o.warning)this.options.cancelRefresh(),this.applyOrder(e,t.profileIds),this.options.refresh();else if(await this.options.refresh(),!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&o.warning&&this.options.setError(t.cardId,o.warning)}catch(o){if(!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&this.options.setError(t.cardId,o)}}}finally{this.activeOrderProviders.delete(e),this.pendingOrders.has(e)&&this.options.canMutate()&&this.flushOrder(e)}}}isCurrentScope(e,t,n,r){return this.options.isCurrentClient(e,t)&&this.options.getAgentEpoch()===n&&this.options.getAgentId()===r}clearOptimisticOrder(e,t){let n=this.options.getOrders();if(n[e]!==t)return!1;let r={...n};return delete r[e],this.options.setOrders(r),!0}applyOrder(e,t){let n=this.options.getData(),r=n?.authStatus;if(!n||!r)return;let i=[...r.providers];for(let[n,r]of i.entries()){if((r.authProvider??r.provider)!==e)continue;let{profileOrder:a,profileOrderStored:o,...s}=r;i[n]={...s,profileOrder:[...t],profileOrderStored:!0}}this.options.setData({...n,authStatus:{...r,providers:i}})}}})))()}var Y;function gn(){return(gn=e((()=>{j(),w(),ve(),O(),Dt(),h(),v(),ge(),Y=class extends _{constructor(...e){super(...e),this.client=null,this.agentId=``,this.profileId=``,this.refresh=0,this.usage=new k(this,{args:()=>[this.client,this.agentId,this.profileId,this.refresh],task:([e,t,n],{signal:r})=>e&&t&&n?e.request(`codex.accountUsage`,{agentId:t,profileId:n},{signal:r,timeoutMs:3e4}):A})}refreshUsage(){this.refresh+=1}render(){return this.client?S`
      <div class="model-providers__account-usage">
        <button
          class="model-providers__account-refresh"
          type="button"
          aria-label=${x(`common.refresh`)}
          title=${x(`common.refresh`)}
          ?disabled=${this.usage.status===ke.PENDING}
          @click=${()=>this.refreshUsage()}
        >
          ${D.refresh}
        </button>
        ${this.usage.render({pending:()=>S`<span>${x(`common.loading`)}</span>`,complete:e=>e.providers.length===0?S`<span>${x(`modelProviders.noStats`)}</span>`:e.providers.map(e=>S`
                    ${e.plan?S`<strong>${e.plan}</strong>`:C}
                    <div>
                      ${e.windows.length||e.billing?.length?Ot(e,{groupWindows:!0}):x(`modelProviders.noStats`)}
                    </div>
                  `),error:e=>S`<span class="provider-usage-error">${m(e)}</span>`})}
      </div>
    `:C}},o([E({attribute:!1})],Y.prototype,`client`,void 0),o([E()],Y.prototype,`agentId`,void 0),o([E()],Y.prototype,`profileId`,void 0),o([T()],Y.prototype,`refresh`,void 0),customElements.get(`openclaw-model-account-usage`)||customElements.define(`openclaw-model-account-usage`,Y)})))()}function _n(e){he({placement:`bottom`,message:U(e),icon:D.alertTriangle,durationMs:12e3})}function vn(e){he({placement:`bottom`,message:[x(`modelProviders.logout.done`),e].filter(Boolean).join(` `),icon:D.check})}function yn(e){switch(e.source){case`config`:return x(`modelProviders.profiles.sourceConfig`);case`external`:return e.displayName||x(`modelProviders.profiles.sourceExternal`);case`inherited`:return x(`modelProviders.profiles.sourceInherited`);case`saved`:return x(`modelProviders.profiles.sourceSaved`);default:return}}function bn(e){if(e.apiKey?.source===`config`)return x(`modelProviders.credentials.configKey`);if(e.apiKey?.source===`env`)return e.apiKey.envVar?x(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):x(`modelProviders.credentials.envKey`)}function xn(e){return x(e===`auth-config`?`modelProviders.profiles.priorityManagedByAuth`:`modelProviders.profiles.priorityManagedByProvider`)}function Sn(e){let t=[],n=yn(e);return n&&e.source!==`saved`&&t.push(n),e.email&&e.displayName&&e.displayName!==n&&t.push(e.displayName),e.lastUsedAt&&t.push(x(`modelProviders.profiles.lastUsed`,{time:He(Date.now()-e.lastUsedAt)})),t.join(` · `)}function Cn(e){let t=(e.split(`@`)[0]??``).split(/[^a-z0-9]+/iu).filter(Boolean);return(t.length>1?`${t[0]?.[0]??``}${t.at(-1)?.[0]??``}`:t[0]?.slice(0,2)??``).toLocaleUpperCase()||`?`}function wn(e,t){switch(e.externallyManaged&&(e.status===`expired`||e.status===`expiring`)?`ok`:e.status){case`ok`:return P({kind:t?`muted`:`ok`,label:x(t?`modelProviders.status.configured`:`modelProviders.status.ok`)});case`static`:return P({kind:`ok`,label:x(`modelProviders.status.configured`)});case`expiring`:return P({kind:`warn`,label:x(`modelProviders.status.expiring`)});case`expired`:return P({kind:`danger`,label:x(`modelProviders.status.expired`)});default:return P({kind:`muted`,label:x(`modelProviders.status.missing`)})}}function Tn(e,t){return e.profiles.filter(n=>(e.profileProviderIds[n.profileId]??e.id)===t)}function En(e,t){return e.logoutTargets.find(e=>e.profileIds.includes(t))?.provider}function Dn(e,t){let n=new Set(e.map(e=>e.profileId));return[...t.filter(e=>n.delete(e)),...e.flatMap(e=>n.delete(e.profileId)?[e.profileId]:[])]}function On(e,t){if(e.length!==t.length)return!1;let n=new Set(e.map(e=>e.profileId));return n.size===e.length&&t.every(e=>n.delete(e))}function kn(e,t){return[...new Set(e.profiles.map(t=>e.profileProviderIds[t.profileId]??e.id))].map(n=>{let r=Tn(e,n),i=t[n]??e.profileOrders[n]??[],a=e.profileOrderLocks[n],o=On(r,i),s=e.profileOrderStoredProviders.includes(n),c=t[n]!==void 0||e.profileOrderExplicitProviders.includes(n),l=a?xn(a):o?void 0:x(s?`modelProviders.profiles.partialStoredOrder`:`modelProviders.profiles.partialOrder`),u=new Map(r.map(e=>[e.profileId,e]));return{provider:n,order:i,lock:a,complete:o,stored:s,explicit:c,explanation:l,profiles:Dn(r,i).flatMap(e=>{let t=u.get(e);return t?[t]:[]})}})}function An(e,t){return[...e.querySelectorAll(t)]}function jn(e){e.classList.remove(Fn);for(let t of An(e,`.model-providers__profile`))t.classList.remove(Pn),t.style.removeProperty(`translate`)}function Mn(e){if(!e.canMove||e.event.button!==0)return;let t=e.event.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`.model-providers__profile`),r=t.closest(`.model-providers__profiles`);if(!n||!r)return;let i=r.getBoundingClientRect().top,a=An(r,`.model-providers__profile`).filter(t=>t.dataset.profileProvider===e.provider).map(e=>({element:e,bounds:e.getBoundingClientRect()})),o=a.find(e=>e.element===n);if(!o)return;let s=a.filter(e=>e!==o),c,l=`before`;e.event.preventDefault(),r.classList.add(Fn),n.classList.add(Pn);try{t.setPointerCapture?.(e.event.pointerId)}catch{}let u=t=>{if(t.pointerId!==e.event.pointerId)return;let u=i-r.getBoundingClientRect().top,d=t.clientY-e.event.clientY+u;n.style.translate=`${t.clientX-e.event.clientX}px ${d}px`;let f=document.elementFromPoint(t.clientX,t.clientY),p=f?.closest(`.model-providers__profile`),m=t.clientY+u,h=f&&r.contains(f)&&(!p||p.dataset.profileProvider===e.provider)&&a.some(({bounds:e})=>t.clientX>=e.left&&t.clientX<=e.right&&m>=e.top&&m<=e.bottom),g=(d>0?o.bounds.bottom:o.bounds.top)+d;c=h?s.find(({bounds:e})=>g<e.top+e.height/2):void 0,l=c?`before`:`after`,h&&!c&&(c=s.at(-1));let _=c?ee(a,o,c,l):a;_.indexOf(o)===a.indexOf(o)&&(c=void 0);let v=a[0]?.bounds.top??0;for(let e of _)e!==o&&(e.element.style.translate=`0px ${v-e.bounds.top}px`),v+=e.bounds.height},d=(n,i)=>{if(n.pointerId!==e.event.pointerId)return;u(n);let a=c?.element.dataset.profileId;jn(r),t.removeEventListener(`pointermove`,f),t.removeEventListener(`pointerup`,p),t.removeEventListener(`pointercancel`,m),t.removeEventListener(`lostpointercapture`,m),document.removeEventListener(`keydown`,h,!0);try{t.releasePointerCapture?.(e.event.pointerId)}catch{}i&&a&&e.move(a,l)},f=e=>u(e),p=e=>d(e,!0),m=e=>d(e,!1),h=t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),d(e.event,!1))};t.addEventListener(`pointermove`,f),t.addEventListener(`pointerup`,p),t.addEventListener(`pointercancel`,m),t.addEventListener(`lostpointercapture`,m),document.addEventListener(`keydown`,h,!0)}function Nn(e,t){if(e.profiles.length===0)return C;let n=kn(e,t.profileOrders),r=new Map(e.profiles.map((e,t)=>[e.profileId,e.email||e.displayName||x(`modelProviders.profiles.account`,{number:String(t+1)})])),i=n.flatMap(e=>e.profiles.map(t=>({group:e,profile:t}))),a=n.some(e=>!e.lock&&e.complete&&e.order.length>1),o=[...new Set(n.flatMap(e=>e.explanation?[e.explanation]:[]))],s=bn(e);return S`
    <section class="model-providers__profiles" aria-label=${x(`modelProviders.profiles.title`)}>
      <div class="model-providers__profiles-heading">
        <div class="model-providers__profiles-heading-copy">
          <strong>${x(`modelProviders.profiles.title`)}</strong>
          <span
            >${x(i.length===1?`modelProviders.profiles.accountOne`:`modelProviders.profiles.accounts`,{count:String(i.length)})}${s?` · ${s}`:``}</span
          >
          ${a?S`<span>${x(`modelProviders.profiles.reorderHint`)}</span>`:C}
          ${o.map(e=>S`<span>${e}</span>`)}
        </div>
        <div class="model-providers__profiles-heading-actions">
          ${e.profileOrderStoredProviders.map(n=>S`<button
              type="button"
              class="btn btn--sm btn--ghost"
              ?disabled=${!t.canMutate}
              title=${t.canMutate?x(`modelProviders.profiles.resetOrderHint`):t.mutationBlockedReason??``}
              @click=${()=>t.onProfileOrderChange(e.id,n,null)}
            >
              ${x(`modelProviders.profiles.resetOrder`)}
            </button>`)}
          ${t.onAddAccount?S`<button
                  type="button"
                  class="btn btn--sm"
                  ?disabled=${t.addAccountDisabled}
                  @click=${t.onAddAccount}
                >
                  ${x(`modelProviders.profiles.addAccount`)}
                </button>`:C}
        </div>
      </div>
      <div class="model-providers__profile-list" role="list">
        ${_e(i,({profile:e})=>e.profileId,({profile:n,group:i})=>{let{provider:a,order:o,complete:s,lock:c,stored:l,explicit:u}=i,d=o.indexOf(n.profileId),f=t.canMutate&&!c&&s&&o.length>1&&d>=0,p=!c&&(s||l)&&o.length>1,m=r.get(n.profileId),h=Sn(n),g=En(e,n.profileId),_=x(`modelProviders.logout.actionFor`,{account:m}),v=t.canMutate?_:t.mutationBlockedReason??``,te=t.canMutate?i.explanation??``:t.mutationBlockedReason??``,y=(r,i)=>{f&&t.onProfileOrderChange(e.id,a,ee(o,n.profileId,r,i))},b=(e,t)=>{let n=o[d+t];if(!f||!n)return;let r=e.currentTarget,i=r instanceof HTMLButtonElement&&document.activeElement===r;y(n,t<0?`before`:`after`),i&&queueMicrotask(()=>{r.isConnected&&document.activeElement===document.body&&r.focus({preventScroll:!0})})};return S`
              <div
                class="model-providers__profile"
                role="listitem"
                data-profile-id=${n.profileId}
                data-profile-provider=${a}
              >
                <span class="model-providers__profile-order">
                  ${p?S`<button
                          type="button"
                          class="model-providers__profile-grip"
                          ?disabled=${!f}
                          aria-label=${x(`modelProviders.profiles.reorder`,{account:m,position:String(d+1)})}
                          aria-keyshortcuts=${f?`ArrowUp ArrowDown`:C}
                          title=${te||x(`modelProviders.profiles.reorderHint`)}
                          @pointerdown=${e=>Mn({event:e,canMove:f,provider:a,move:y})}
                          @keydown=${e=>{(e.key===`ArrowUp`||e.key===`ArrowDown`)&&(e.preventDefault(),b(e,e.key===`ArrowUp`?-1:1))}}
                        >
                          ${D.gripVertical}
                        </button>`:S`<span aria-hidden="true"></span>`}
                  ${u&&s&&d>=0?S`<span
                          class="model-providers__profile-position"
                          aria-label=${x(`modelProviders.profiles.priority`,{position:String(d+1)})}
                          title=${x(`modelProviders.profiles.priority`,{position:String(d+1)})}
                          >${d+1}</span
                        >`:C}
                </span>
                <span class="model-providers__profile-avatar" aria-hidden="true"
                  >${Cn(m)}</span
                >
                <div class="model-providers__profile-copy">
                  <strong>${m}</strong>
                  ${h?S`<span>${h}</span>`:C}
                  <details>
                    <summary>${x(`modelProviders.profiles.details`)}</summary>
                    <div>${n.profileId}</div>
                    ${n.expiry?S`<span>${x(`modelProviders.expiresIn`,{time:n.expiry.label})}</span>`:C}
                  </details>
                </div>
                ${a===`openai`&&n.type!==`api_key`?S`<openclaw-model-account-usage
                        .client=${t.usageClient??null}
                        .agentId=${t.usageAgentId??``}
                        .profileId=${n.profileId}
                      ></openclaw-model-account-usage>`:C}
                <span class="model-providers__profile-status"
                  >${wn(n,e.catalogStatus===`auth-rejected`)}</span
                >
                <span class="model-providers__profile-actions">
                  ${n.logoutSupported===!0&&g?S`<button
                          type="button"
                          class="model-providers__profile-logout"
                          aria-label=${_}
                          title=${v}
                          ?disabled=${!t.canMutate||t.busy[`logout:${e.id}`]}
                          @click=${()=>t.onRequestLogout({cardId:e.id,label:m,target:{provider:g,profileIds:[n.profileId]}})}
                        >
                          ${In}
                        </button>`:C}
                </span>
              </div>
            `})}
      </div>
    </section>
  `}var Pn,Fn,In;function Ln(){return(Ln=e((()=>{w(),gn(),ye(),Ce(),O(),I(),h(),mt(),qe(),me(),W(),pt(),Pn=`model-providers__profile--dragging`,Fn=`model-providers__profiles--sorting`,In=De(be` <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" x2="9" y1="12" y2="12" />`)})))()}function Rn(e,t,n){let r={...e};return n===null?delete r[t]:r[t]=n,r}var zn;function Bn(){return(Bn=e((()=>{j(),z(),zn=class{constructor(e,t){this.options=t,this.pending=new Set,this.usageTask=this.createTask(e,`usage`,St,e=>({providerUsage:e}),(e,t)=>this.options.refreshPolicy.markProviderUsage(e,Date.now(),t)),this.costTask=this.createTask(e,`cost`,Ct,e=>({costByProvider:e}))}get loading(){return this.pending.size>0}get usageLoading(){return this.pending.has(`usage`)}adoptCoreData(e,t,n={}){let r=e===this.options.getDataClient()?this.options.getData():null;this.options.setData({...t,...n.preserveCatalogDiagnostics&&r?{providerOutcomes:r.providerOutcomes,catalogError:r.catalogError}:{},providerUsage:r?.providerUsage??t.providerUsage,costByProvider:r?.costByProvider??t.costByProvider}),this.options.setDataClient(e),t.providerUsage!==null&&this.options.refreshPolicy.markProviderUsage(t.providerUsage,t.updatedAt,this.options.getGateway().epoch),e&&!this.options.isCoreLoading()&&!this.loading&&t.providerUsage===null&&t.costByProvider===null&&this.load(e)}invalidate(){this.options.refreshPolicy.interrupt(),this.cancelGeneration()}beginCoreRefresh(e){this.cancelGeneration(),e&&this.options.refreshPolicy.resetPayload()}cancelGeneration(){this.pending.clear();let e=this.options.getGateway().epoch;this.usageTask.run([null,e]),this.costTask.run([null,e])}load(e){return this.loadRequests(e,!0)}loadUsage(){return this.loadRequests(void 0,!1)}async loadRequests(e,t){let n=this.options.getGateway(),r=e??n.client;if(!n.connected||!r){this.options.refreshPolicy.markLoadDeferred();return}this.options.refreshPolicy.beginLoad(),this.pending.add(`usage`);let i=this.usageTask.run([r,n.epoch]);if(!t){await i;return}this.pending.add(`cost`),await Promise.all([i,this.costTask.run([r,n.epoch])])}createTask(e,t,n,r,i){return new k(e,{autoRun:!1,task:([e,t],{signal:r})=>e?n(e,r).then(n=>({client:e,data:n,epoch:t})):A,onComplete:({client:e,data:n,epoch:a})=>{this.pending.delete(t);let o=this.options.getData();o&&e===this.options.getDataClient()&&this.options.getGateway().isCurrent({client:e,epoch:a})&&(this.options.setData({...o,...r(n)}),i?.(n,a)),this.options.refreshPolicy.flushPending()},onError:()=>{this.pending.delete(t),this.options.refreshPolicy.flushPending()}})}}})))()}function Vn(e,t){let n=new Set,r=[];for(let i of e){let e=J(i);n.has(e)||(n.add(e),r.push(Hn(i,t)))}return r.toSorted((e,t)=>e.label.localeCompare(t.label))}function Hn(e,t){let n=J(e),r=t.get(Le(e.provider)),i=r?Ke(r,{authProfileId:s(n).profile,projection:`available-credentials`}):void 0;return{value:n,label:e.name||n,...i?{detail:[i.label,i.detail].filter(Boolean).join(` · `)}:{},...e.available===!1?{disabled:!0}:{},...e.provider?{provider:e.provider}:{}}}function Un(e){return S`
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
            ${D.info}
          </button>
          <div slot="content" class="settings-section__help-panel">${e.body}</div>
        </openclaw-tooltip>
      </span>
    </span>
  `}function Wn(e){return S`
    <span class="model-providers__segment-label">
      <span>${e.label}</span>
      <openclaw-tooltip open-on-click .content=${e.help}>
        <button
          type="button"
          class="model-providers__segment-info"
          aria-label=${e.help}
          @click=${e=>e.stopPropagation()}
          @keydown=${e=>{e.key===`Escape`&&e.stopPropagation()}}
        >
          ${D.info}
        </button>
      </openclaw-tooltip>
    </span>
  `}function Gn(e){return e===`auto`?`auto`:e===`on`}function Kn(e){return S`
    ${e.catalogDiscovering?S`
            <div class="model-providers__catalog-progress" role="status" aria-live="polite">
              <span class="btn__spinner" aria-hidden="true"></span>
              <span>${x(`modelProviders.defaults.discoveringMore`)}</span>
            </div>
          `:C}
    ${e.catalogDiscoveryError?S`
            <div class="model-providers__catalog-progress" role="alert" aria-live="polite">
              <span>${x(`modelProviders.defaults.discoverFailed`)}</span>
              <button class="btn btn--sm" type="button" @click=${e.onCatalogRetry}>
                ${x(`modelProviders.defaults.retryDiscover`)}
              </button>
            </div>
          `:C}
  `}function qn(e){let t=!e.canMutate||e.models.length===0,n=!e.canMutate,r=!!e.busy.defaults,i=e.mutationBlockedReason??``,a=e.thinkingLevel&&!Qn.has(e.thinkingLevel)?[...Z,e.thinkingLevel]:Z,o=e.fastMode===void 0?``:ft(e.fastMode),c=e.selection.fallbacks[0]??``,l=new Map(Ie(e.authStatus?.providers??[]).map(e=>[e.provider,e])),u=Vn(e.models,l),d=e.automaticUtilityModel,f=d?s(d).model:``,p=e.models.find(e=>J(e)===f),m=d?Hn({...p??{id:f,name:f,provider:f.split(`/`,1)[0]??``},selectionRef:d},l):void 0,h=S`
    <div class="model-providers__defaults">
      ${!e.loading&&e.models.length===0?S`<div class="callout warning">${x(`modelProviders.defaults.noModels`)}</div>`:C}
      ${R({title:x(`modelProviders.defaults.primary`),control:_t({label:x(`modelProviders.defaults.primary`),value:e.selection.primary,options:[{value:``,label:x(`modelProviders.defaults.selectModel`),disabled:!!e.selection.primary},...u],disabled:t||r,title:i,showSelectedDetail:!0,onChange:e.onPrimaryChange})})}
      ${R({title:Un({title:x(`modelProviders.defaults.utility`),label:x(`modelProviders.defaults.utilityHelpLabel`),triggerId:Yn,body:S`
            <p>${x(`modelProviders.defaults.utilityHelpPurpose`)}</p>
            <p>${x(`modelProviders.defaults.utilityHelpAutomatic`)}</p>
          `}),control:_t({id:Jn,label:x(`modelProviders.defaults.utility`),value:e.selection.utilityModel??X,options:[{value:X,label:e.automaticUtilityModel?`${x(`quickSettings.model.fastModes.auto`)} · ${m?.label??e.automaticUtilityModel}`:x(`quickSettings.model.fastModes.auto`),provider:m?.provider,detail:d===null?x(`modelProviders.defaults.automaticUnavailable`):m?.detail},{value:``,label:x(`modelProviders.defaults.disabled`)},...u],disabled:t||r,title:i,showSelectedDetail:!0,onChange:t=>e.onUtilityChange(t===X?null:t)})})}
      ${R({title:x(`chat.modelControls.decisionLabel`),description:x(`chat.modelControls.decisionHelp`),control:yt({id:`model-providers-decision-model`,models:e.decisionModels,value:e.selection.decisionModel,disabled:!e.canMutate||r,title:i,onChange:e.onDecisionChange})})}
      ${R({title:x(`modelProviders.defaults.fallback`),control:_t({label:x(`modelProviders.defaults.fallback`),value:c,options:[{value:``,label:x(`modelProviders.defaults.noFallback`)},...u.filter(t=>t.value!==e.selection.primary)],disabled:t||r||!e.selection.primary,title:i,showSelectedDetail:!0,onChange:t=>e.onFallbackChange(t||null)})})}
      ${R({title:Un({title:x(`quickSettings.model.thinking`),label:x(`modelProviders.defaults.thinkingHelpLabel`),triggerId:Xn,body:S`<p>${x(`modelProviders.defaults.thinkingHelp`)}</p>`}),control:S`
          ${et({value:e.thinkingLevel??``,options:[{value:``,label:Wn({label:x(`quickSettings.model.default`),help:x(`modelProviders.defaults.thinkingDefaultHelp`)})},...a.map(e=>({value:e,label:Qn.has(e)?x(`quickSettings.model.thinkingLevels.${e}`):Re(e)}))],disabled:r||n,onChange:(t,n)=>t===``?e.onThinkingReset():e.onThinkingChange(t,n),onReselect:t=>{t===``&&e.thinkingOverridden&&e.onThinkingReset()}})}
        `})}
      ${R({title:Un({title:x(`quickSettings.model.fastMode`),label:x(`modelProviders.defaults.fastModeHelpLabel`),triggerId:Zn,body:S`<p>${x(`modelProviders.defaults.fastModeHelp`)}</p>`}),control:S`
          ${et({value:o,options:[{value:``,label:Wn({label:x(`quickSettings.model.default`),help:x(`modelProviders.defaults.fastModeDefaultHelp`)})},{value:`auto`,label:x(`quickSettings.model.fastModes.auto`)},{value:`on`,label:x(`quickSettings.model.fastModes.on`)},{value:`off`,label:x(`quickSettings.model.fastModes.off`)}],disabled:r||n,onChange:t=>{t===``?e.onFastModeReset():t!==o&&e.onFastModeChange(Gn(t))},onReselect:t=>{t===``&&e.fastModeOverridden&&e.onFastModeReset()}})}
        `})}
      ${Kn(e)}
      ${e.canMutate&&e.message?S`<div
              class="callout ${e.message.kind}"
              role=${e.message.kind===`error`?`alert`:`status`}
            >
              ${e.message.text}
            </div>`:C}
      ${e.canMutate&&e.message?.warning?S`<div class="callout warning" role="status">${e.message.warning}</div>`:C}
    </div>
  `;return N({title:x(`modelProviders.defaults.title`),description:x(`modelProviders.defaults.subtitle`)},h)}var X,Jn,Yn,Xn,Zn,Z,Qn;function $n(){return($n=e((()=>{w(),Ae(),dt(),bt(),O(),vt(),I(),h(),ze(),Be(),Qe(),on(),X=`__openclaw_automatic_utility__`,Jn=`model-providers-utility-model`,Yn=`model-providers-utility-help`,Xn=`model-providers-thinking-help`,Zn=`model-providers-fast-mode-help`,Z=je.filter(e=>e!==`minimal`),Qn=new Set(Z)})))()}function Q(e){return!e.canMutate||e.configBusy}function er(e){return e.modelCount===0?null:e.availableModelCount<e.modelCount?x(`modelProviders.modelsAvailable`,{available:String(e.availableModelCount),count:String(e.modelCount)}):e.modelCount===1?x(`modelProviders.modelOne`):x(`modelProviders.models`,{count:String(e.modelCount)})}function tr(e,t){let n=e.localCost;return!n||n.totalTokens===0&&n.totalCost===0?C:S`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${x(`modelProviders.localCost`,{days:String(t)})}</span>
        <strong>${de(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${x(`modelProviders.localCostDetail`,{tokens:oe(n.totalTokens),messages:String(n.messageCount)})}
      </div>
    </div>
  `}function nr(e,t){let n=e.profiles.filter(e=>e.type===`oauth`).length,r=e.profiles.filter(e=>e.type===`token`).length,i=e.profiles.filter(e=>e.type===`api_key`).length,a=[];return n>0&&a.push(x(`modelProviders.credentials.oauth`,{count:String(n)})),r>0&&a.push(x(`modelProviders.credentials.tokenProfiles`,{count:String(r)})),e.apiKey?.source===`config`?a.push(x(`modelProviders.credentials.configKey`)):e.apiKey?.source===`env`?a.push(e.apiKey.envVar?x(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):x(`modelProviders.credentials.envKey`)):i>0&&a.push(x(`modelProviders.credentials.profileKey`,{count:String(i)})),S`
    <div class="model-providers__credentials">
      <span>${x(`modelProviders.credentials.label`,{agent:t})}</span>
      <strong
        >${a.length>0?a.join(` · `):x(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `}function rr(e){if(!e)return C;let t=e.status===`ok`&&e.results.some(e=>e.status!==`ok`),n=t?`warning`:e.status===`ok`?`success`:`error`;return S`
    <div class="model-providers__probe model-providers__probe--${n}" role="status">
      <div class="model-providers__probe-summary">
        <strong
          >${x(t?`modelProviders.probe.status.partial`:`modelProviders.probe.status.${e.status}`)}</strong
        >
        ${e.latencyMs===void 0?C:S`<span
                >${x(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}</span
              >`}
      </div>
      ${e.error?S`<div>${g(e.error)}</div>`:C}
      ${e.results.map(e=>S`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${x(`modelProviders.probe.status.${e.status}`)}${e.latencyMs===void 0?``:` · ${x(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}`}
            </span>
            ${e.error?S`<small>${g(e.error)}</small>`:C}
          </div>
        `)}
    </div>
  `}function ir(e,t){if(t.keyEditorProvider!==e.id)return C;let n=!!t.busy[`key:${e.id}`],r=e.apiKeySupported===!1||!!(e.configAuthMode&&e.configAuthMode!==`api-key`),i=Q(t);return S`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${x(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source===`config`?x(`modelProviders.apiKey.replacePlaceholder`):x(`modelProviders.apiKey.placeholder`)}
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
          ${x(n?`modelProviders.saving`:`common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${()=>t.onCloseKeyEditor()}>
          ${x(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function ar(e,t){let n=e.credentialProviderIds.length?e.credentialProviderIds:[e.id],r=e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0,i=!!t.busy[`probe:${e.id}`],a=!!t.busy[`key:${e.id}`],o=t.mutationBlockedReason??``,s=!!(e.configAuthMode&&e.configAuthMode!==`api-key`),c=e.apiKeySupported===!1,l=Q(t),u=s?x(`modelProviders.apiKey.authModeBlocked`,{mode:e.configAuthMode??``}):o;return S`
    <div class="model-providers__card-actions">
      ${t.canConnect(e)&&e.profiles.length===0?S`<button
              class="btn btn--sm"
              data-models-connect-provider=${e.id}
              ?disabled=${l||t.loginBusy}
              @click=${()=>t.onConnect(e)}
            >
              ${x(`modelProviders.login.action`)}
            </button>`:C}
      ${r?S`
              <button
                class="btn btn--sm"
                ?disabled=${i||!t.canMutate||!t.probeAvailable}
                title=${t.probeAvailable?o:x(`modelProviders.probe.unavailable`)}
                @click=${()=>t.onProbe(e.id,n)}
              >
                ${x(i?`modelProviders.probe.testing`:`modelProviders.probe.test`)}
              </button>
            `:C}
      ${c?C:S`
              <button
                class="btn btn--sm"
                ?disabled=${a||l||s}
                title=${u}
                @click=${()=>t.onOpenKeyEditor(e.id)}
              >
                ${x(`modelProviders.apiKey.set`)}
              </button>
            `}
      ${e.hasConfigApiKey||e.profiles.some(e=>e.type===`api_key`&&e.logoutSupported)?S`
              <button
                class="btn btn--sm danger"
                ?disabled=${a||l||s}
                title=${u}
                @click=${()=>t.onRemoveKey(e.id,e.configKey??e.id)}
              >
                ${x(`modelProviders.apiKey.remove`)}
              </button>
            `:C}
    </div>
  `}function or(e,t){let n=er(e),r=t.messages[`key:${e.id}`]??t.messages[e.id];return S`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${nt(e.id,{className:`model-providers__icon`})}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n?S` · ${n}`:C}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan?tt(e.usage.plan):C}
          ${kt(e)}
        </div>
      </div>
      ${e.profiles.length>0&&t.canViewProfiles?Nn(e,{usageClient:t.usageClient,usageAgentId:t.usageAgentId,busy:t.busy,canMutate:t.canMutate&&!t.configBusy,mutationBlockedReason:t.mutationBlockedReason,profileOrders:t.profileOrders,onAddAccount:t.canConnect(e)?()=>t.onConnect(e):void 0,addAccountDisabled:t.loginBusy||Q(t),onProfileOrderChange:t.onProfileOrderChange,onRequestLogout:t.onRequestLogout}):nr(e,t.credentialAgentLabel)}
      <div
        class="model-providers__global-metrics"
        aria-busy=${t.supplementalLoading?`true`:`false`}
      >
        <div class="model-providers__global-metrics-title">${x(`modelProviders.globalUsage`)}</div>
        ${e.usage?Ot(e.usage):S`<div class="model-providers__no-stats">
                ${x(t.supplementalLoading?`common.loading`:`modelProviders.noStats`)}
              </div>`}
        ${tr(e,t.costDays)}
      </div>
      ${ar(e,t)} ${ir(e,t)}
      ${rr(t.probeResults[e.id])} ${B(r)}
    </div>
  `}function sr(e){if(!e.addProviderOpen)return C;let t=!!e.busy.add,n=Q(e)||t,r=e.unconfiguredProviders.find(t=>t.id===e.addProviderId);return S`
    <openclaw-modal-dialog
      label=${x(`modelProviders.add.title`)}
      @modal-cancel=${n=>{n.preventDefault(),t||e.onAddProviderToggle()}}
    >
      <div class="model-setup-wizard" data-models-key-dialog>
        <div class="model-setup-wizard__header">
          <h2>${r?.displayName??e.addProviderId}</h2>
        </div>
        <div class="model-setup-wizard__body">
          <p>${x(`modelProviders.credentials.label`,{agent:e.credentialAgentLabel})}</p>
          <label class="field">
            <span>${x(`modelProviders.apiKey.label`)}</span>
            <input
              type="password"
              autocomplete="off"
              placeholder=${x(`modelProviders.apiKey.placeholder`)}
              .value=${e.addProviderKey}
              ?disabled=${n}
              @input=${t=>e.onAddProviderKeyChange(t.target.value)}
            />
          </label>
          ${B(e.messages.add)}
        </div>
        <div class="model-setup-wizard__footer">
          <button class="btn" ?disabled=${t} @click=${e.onAddProviderToggle}>
            ${x(`common.cancel`)}
          </button>
          <button
            class="btn primary"
            ?disabled=${n||!e.addProviderId||!e.addProviderKey.trim()}
            @click=${e.onAddProvider}
          >
            ${x(t?`modelProviders.saving`:`modelProviders.add.save`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function cr(e){let t=e.cards.some(It);return S`
    <div class="model-providers__setup" data-model-readiness="model-required">
      ${N({title:x(`modelProviders.readiness.title`)},R({title:x(`modelProviders.readiness.heading`),description:x(t?`modelProviders.readiness.signedInNoModels`:`modelProviders.readiness.notConfigured`),control:S`
            ${P({kind:`warn`,label:x(t?`modelProviders.readiness.noModels`:`modelProviders.readiness.modelRequired`)})}
            <button
              class="btn primary"
              ?disabled=${Q(e)||e.loginBusy}
              title=${e.mutationBlockedReason??``}
              @click=${e.onConnectProvider}
            >
              ${x(`modelProviders.login.action`)}
            </button>
          `}))}
    </div>
  `}function lr(e){return S`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc provider-usage-error">${e}</span>
      </div>
    </div>
  `}function ur(e){if(!e.connected)return rt(L(F(x(`modelProviders.disconnected`))));let t=(e.providerQuery??``).trim().toLocaleLowerCase(),n=e.cards.filter(e=>[e.id,e.displayName,...e.credentialProviderIds].some(e=>e.toLocaleLowerCase().includes(t))),r=S`
    <label class="field model-providers__search">
      <input
        type="search"
        aria-label=${x(`modelProviders.search`)}
        placeholder=${x(`modelProviders.search`)}
        .value=${e.providerQuery??``}
        @input=${t=>e.onProviderQueryChange?.(t.currentTarget.value)}
      />
    </label>
    <div class="model-providers__provider-list">
      ${e.error?L(lr(e.error)):C}
      ${e.providerUsageFailed?L(lr(x(`usage.providerUsage.unavailable`))):C}
      ${e.cards.length===0?L(F(S`<strong>${x(`modelProviders.emptyTitle`)}</strong><br />${x(`modelProviders.emptySubtitle`)}`)):n.map(t=>L(or(t,e)))}
      ${e.cards.length>0&&n.length===0?F(x(`modelProviders.noMatches`)):C}
    </div>
  `,i=!e.loading&&!e.configuredModels.some(e=>e.available!==!1);return S`${rt(S`
    ${i?cr(e):C}
    <div id=${y.behavior}>
      ${qn({models:e.configuredModels,decisionModels:e.decisionModels,selection:e.defaultModels,authStatus:e.authStatus,automaticUtilityModel:e.automaticUtilityModel,thinkingLevel:e.thinkingLevel,thinkingOverridden:e.thinkingOverridden,fastMode:e.fastMode,fastModeOverridden:e.fastModeOverridden,loading:e.loading,catalogDiscovering:e.catalogDiscovering,catalogDiscoveryError:e.catalogDiscoveryError,canMutate:e.defaultsMutationBlockedReason===null&&!e.configBusy,mutationBlockedReason:e.defaultsMutationBlockedReason,busy:e.busy,message:e.messages.defaults,onPrimaryChange:e.onPrimaryChange,onFallbackChange:e.onFallbackChange,onUtilityChange:e.onUtilityChange,onDecisionChange:e.onDecisionChange,onThinkingChange:e.onThinkingChange,onThinkingReset:e.onThinkingReset,onFastModeChange:e.onFastModeChange,onFastModeReset:e.onFastModeReset,onCatalogRetry:e.onCatalogRetry})}
    </div>
    ${e.installedAgents}
    ${N({title:x(`modelProviders.accessTitle`),description:x(`modelProviders.accessDescription`),count:e.cards.length,actions:S`
          ${e.providerScope}
          ${e.updatedAt?S`<span class="model-providers__updated"
                  >${x(`modelProviders.updated`,{time:le(e.updatedAt,{hour:`numeric`,minute:`2-digit`})})}</span
                >`:C}
          <openclaw-tooltip
            .content=${e.refreshing?x(`modelProviders.refreshing`):x(`common.refresh`)}
          >
            <button
              type="button"
              class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
              aria-label=${e.refreshing?x(`modelProviders.refreshing`):x(`common.refresh`)}
              ?disabled=${e.refreshing}
              @click=${()=>e.onRefresh()}
            >
              ${D.refresh}
            </button>
          </openclaw-tooltip>
        `},e.loading?L(at()):e.cards.length===0&&e.installedAgents!==C&&!e.error&&!e.providerUsageFailed?C:r)}
    ${e.providerUsageStalled?S`<div class="callout warning" role="status">${x(`usage.providerUsage.stalled`)}</div>`:C}
  `)}${sr(e)}`}function dr(e){return S`
    <span class="muted" data-models-provider-agent
      >${x(`agentScope.label`)}: ${e.agentLabel}</span
    >
    ${Pt(e)}
  `}function fr(e){return S`
    ${$e({title:Oe(`model-providers`),subtitle:S`${x(`modelProviders.subtitle`)}
      ${st(`https://docs.openclaw.ai/concepts/model-providers`)}`})}
    ${ht(S`${B(e.loginMessage)}${e.body}`)}
    ${e.login}
  `}function pr(){return(pr=e((()=>{w(),Ee(),O(),it(),Dt(),I(),gt(),h(),mt(),v(),re(),pe(),$n(),Ln(),Mt(),pt()})))()}var $;function mr(){return(mr=e((()=>{r(),w(),ve(),we(),Te(),lt(),h(),p(),b(),Me(),Fe(),ne(),Je(),ge(),ue(),Tt(),Rt(),W(),Xt(),on(),ln(),pn(),z(),Ft(),hn(),Ln(),Bn(),pr(),$=class extends _{constructor(...e){super(...e),this.mutationBlockedReason=()=>H(this.context)??(this.selectedAgentId?null:x(`agents.noAgents`)),this.canMutate=()=>this.mutationBlockedReason()===null&&!V(this.context),this.loaderPending=!1,this.data=null,this.busy={},this.messages={},this.probeResults={},this.keyEditorProvider=null,this.keyDraft=``,this.logoutConfirmation=null,this.profileOrders={},this.providerQuery=``,this.pendingConnection=!1,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,this.selectedAgentId=``,this.dataClient=null,this.routeDataObserved=!1,this.agentEpoch=0,this.coreCatalogGeneration=0,this.core=new Yt(this,{onStart:e=>{e!==`publication`&&this.catalogDiscovery.reset(),this.coreCatalogGeneration=this.catalogDiscovery.generation,this.supplemental.beginCoreRefresh(e===`forced`),e===`forced`&&this.querySelectorAll(`openclaw-model-account-usage`).forEach(e=>e.refreshUsage())},onComplete:({client:e,data:t})=>{let n=this.data!==null&&this.catalogDiscovery.generation!==this.coreCatalogGeneration;n||this.catalogDiscovery.reset(),this.supplemental.adoptCoreData(e,t,{preserveCatalogDiagnostics:n})},isCatalogLoading:()=>this.catalogDiscovery.discovering,refreshPublication:()=>void this.refresh(`publication`)}),this.refreshPolicy=new Et({isLoading:()=>this.loaderPending||!this.routeDataObserved||this.core.loading||this.supplemental.usageLoading,reload:()=>this.supplemental.loadUsage(),onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.supplemental=new zn(this,{isCoreLoading:()=>this.loaderPending,getGateway:()=>this.gateway,getData:()=>this.data,getDataClient:()=>this.dataClient,setData:e=>this.data=e,setDataClient:e=>this.dataClient=e,refreshPolicy:this.refreshPolicy}),this.catalogDiscovery=Lt({getGateway:()=>this.gateway,getAgentId:()=>this.selectedAgentId,getAgentEpoch:()=>this.agentEpoch,getData:()=>this.data,setData:e=>this.data=e,requestUpdate:()=>this.requestUpdate(),onSettled:()=>this.core.flushPublication()}),this.gateway=new Xe(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetConnectionState(),invalidateRequests:()=>this.invalidateRequests(),ensureInitialData:()=>this.ensureInitialData(),onSnapshot:e=>{e.initial?this.resetConnectionState():e.connectionChanged&&!e.identityChanged&&this.resetConnectionState({preserveVisibleData:!0}),e.becameConnected&&!e.initial&&this.routeDataObserved&&!this.loaderPending&&this.refresh(`replacement`)},onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.installedAgents=new fn(this,{gateway:this.gateway,getContext:()=>this.context}),this.profileActions=new mn({getAgentEpoch:()=>this.agentEpoch,getAgentId:()=>this.selectedAgentId,getClient:()=>this.context.gateway.snapshot.client,getClientEpoch:()=>this.gateway.epoch,getData:()=>this.data,getOrders:()=>this.profileOrders,setData:e=>this.data=e,setError:(e,t)=>_n(t),setOrders:e=>this.profileOrders=e,clearMessage:e=>this.setMessage(e,null),canMutate:()=>this.canMutate(),cancelRefresh:()=>this.cancelCoreRefresh(),refresh:()=>this.refresh(`forced`),isCurrentClient:(e,t)=>this.gateway.isCurrent({client:e,epoch:t}),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setProbeResult:(e,t)=>this.probeResults=Rn(this.probeResults,e,t),setProbeError:(e,t)=>this.setMessage(e,{kind:`error`,text:t}),setLogoutSuccess:vn,getConfig:()=>this.context.runtimeConfig}),this.discovery=new cn(this,{canOpen:()=>this.canMutate(),getOwner:()=>({client:this.gateway.client,epoch:this.gateway.epoch,agentEpoch:this.agentEpoch,agentId:this.context.settingsAgentSelection.state.selectedId,selectionIntentRevision:this.context.settingsAgentSelection.intentRevision,selectionPending:this.context.settingsAgentSelection.state.selectedId===null&&this.context.agents.state.agentsList===null}),isCurrent:e=>!!(this.isConnected&&e.client&&this.gateway.isCurrent({client:e.client,epoch:e.epoch})&&this.agentEpoch===e.agentEpoch),onClose:()=>void this.refresh(`replacement`),onConnectChoice:e=>void this.login.open(void 0,e),onError:e=>this.setMessage(`connection`,{kind:`error`,text:U(e)})}),this.login=new Nt(this,{getScope:()=>({context:this.context,agentId:this.selectedAgentId,authStatus:this.data?.authStatus??null}),canStart:()=>this.canMutate(),onDiscover:()=>{this.setMessage(`connection`,null),this.discovery.open()},onApiKey:e=>{this.addProviderId=e,this.addProviderKey=``,this.addProviderOpen=!0,this.setMessage(`add`,null)},canContinue:()=>this.mutationBlockedReason()===null,refresh:()=>this.refresh(`replacement`)}),this.subscriptions=new fe(this).effect(()=>this.context?.gateway,e=>Ve(e,()=>void this.refresh(`publication`))).effect(()=>this.context?.gateway,e=>this.installedAgents.subscribe(e)).watch(()=>this.context?.gateway.snapshot.client,We).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>{!e.state.configSnapshot&&!e.state.configLoading&&e.ensureLoaded().catch(()=>void 0),this.profileActions.flushPendingOrders()}).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t),()=>this.profileActions.flushPendingOrders()).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncSelectedAgent()).effect(()=>this.context?.settingsAgentSelection,e=>e.subscribe(()=>this.syncSelectedAgent())),this.setBusy=(e,t)=>this.busy=Rn(this.busy,e,t?!0:null),this.setMessage=(e,t)=>this.messages=Rn(this.messages,e,t)}disconnectedCallback(){this.profileActions.resetOrders(),this.subscriptions.clear(),this.refreshPolicy.dispose(),super.disconnectedCallback()}willUpdate(e){(e.has(`routeData`)||e.has(`loaderPending`))&&this.routeData!==void 0&&(this.routeData.connect&&!e.get(`routeData`)?.connect&&(this.pendingConnection=!0),this.cancelCoreRefresh(),this.routeDataObserved=!0,this.setSelectedAgent(this.resolveSelectedAgentId()),(this.routeData.agentId??``)===this.selectedAgentId&&this.routeData.selectionIntentRevision===this.context.settingsAgentSelection.intentRevision&&this.gateway.isRouteDataCurrent(this.routeData)?this.supplemental.adoptCoreData(this.routeData.client,this.routeData.data):(this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload()),this.ensureInitialData())}updated(){this.isConnected&&this.pendingConnection&&this.data&&this.canMutate()&&!this.core.loading&&(this.pendingConnection=!1,this.login.open())}ensureInitialData(){!this.context.agents.state.agentsList&&!this.context.agents.state.agentsLoading&&!this.context.agents.state.agentsError&&this.context.agents.ensureList();let e=this.gateway.client;this.routeDataObserved&&!this.loaderPending&&this.gateway.connected&&e&&this.selectedAgentId&&!this.core.loading&&(this.data===null||this.data.updatedAt===null||e!==this.dataClient)&&this.refresh(`replacement`)}cancelCoreRefresh(){this.catalogDiscovery.reset(),this.core.invalidate()}invalidateRequests(){this.logoutConfirmation?.abort(),this.cancelCoreRefresh(),this.supplemental.invalidate()}resetConnectionState(e={}){e.preserveVisibleData||(this.data=null,this.dataClient=null),this.refreshPolicy.resetPayload(),this.discovery.cancelLoading(),this.installedAgents.reset(e),this.resetAgentScopeState(),this.profileActions.resetProbes(),this.defaultsDraft=null}resetAgentScopeState(){this.login.reset(),this.busy={},this.messages={},this.probeResults={},this.closeKeyEditor(),this.logoutConfirmation?.abort(),this.profileActions.resetOrders(),this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``}resolveSelectedAgentId(){let e=this.context.settingsAgentSelection.state.selectedId;return e?n(e):``}setSelectedAgent(e){return e!==this.selectedAgentId&&(this.selectedAgentId=e,this.agentEpoch+=1,this.resetAgentScopeState(),!0)}syncSelectedAgent(){this.setSelectedAgent(this.resolveSelectedAgentId())&&(this.invalidateRequests(),this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload(),this.requestUpdate(),this.ensureInitialData())}refresh(e){if(!this.selectedAgentId)return Promise.resolve();let t=this.gateway.client;return!this.gateway.connected||!t?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):this.core.refresh(t,this.selectedAgentId,e)}async patchConfig(e){let t=this.context.gateway.snapshot.client;if(!t||H(this.context)||V(this.context)||this.busy[e.key])return;let n=this.gateway.epoch,r=this.agentEpoch;return Wt({runtimeConfig:this.context.runtimeConfig,isCurrentClient:()=>this.gateway.isCurrent({client:t,epoch:n}),isCurrentAgent:()=>this.agentEpoch===r,setBusy:t=>this.setBusy(e.key,t),setMessage:t=>this.setMessage(e.key,t)},e)}openKeyEditor(e){this.keyEditorProvider=e,this.keyDraft=``,this.setMessage(e,null)}closeKeyEditor(){this.keyEditorProvider=null,this.keyDraft=``}async mutateApiKey(e,t,n,r=`edit`){let i=this.gateway.client,a=r===`add`?`add`:`key:${e}`;if(!i||!this.canMutate()||this.busy[a]||n===``)return;let o=this.gateway.epoch,s=this.agentEpoch,c=()=>this.gateway.isCurrent({client:i,epoch:o})&&this.agentEpoch===s;this.profileActions.clearProbe(e);let l=await Gt({runtimeConfig:this.context.runtimeConfig,isCurrentClient:c,isCurrentAgent:c,canMutate:()=>this.canMutate(),refreshProviders:async()=>{let e=this.data;if(await this.refresh(`replacement`),c()&&this.data?.error){let t=this.data.error;return this.data=e,t}return this.data?.error??this.data?.catalogError??null},setBusy:e=>this.setBusy(a,e),setMessage:t=>{this.setMessage(e,t),r===`add`&&this.setMessage(`add`,t)}},{client:i,agentId:this.selectedAgentId,provider:t,apiKey:n,success:Kt(r,n,e)});l.ok&&c()&&(r===`add`?this.addProviderId===e&&this.addProviderKey.trim()===n&&(this.addProviderOpen=!!l.warning,l.warning||(this.addProviderId=``),this.addProviderKey=``):this.keyEditorProvider===e&&this.keyDraft.trim()===n&&this.closeKeyEditor())}async requestLogout(e){if(this.logoutConfirmation||!this.canMutate()||this.busy[`logout:${e.cardId}`])return;let t=new AbortController;this.logoutConfirmation=t,await ot({title:x(`modelProviders.logout.actionFor`,{account:e.label}),message:x(`modelProviders.logout.confirm`,{provider:e.label}),confirmLabel:x(`modelProviders.logout.action`),danger:!0,signal:t.signal}).finally(()=>{this.logoutConfirmation=null})&&!t.signal.aborted&&this.canMutate()&&await this.profileActions.logout(e.cardId,e.target)}async addProvider(){let e=this.addProviderId;e&&await this.mutateApiKey(e,e,this.addProviderKey.trim(),`add`)}async saveDefaults(e=this.defaultsDraft){e&&(await this.patchConfig({key:`defaults`,raw:Vt(e),note:x(`modelProviders.notes.defaultModel`),replacePaths:qt}),this.defaultsDraft===e&&(this.defaultsDraft=null))}render(){let e=this.context.gateway.snapshot,t=e.hello?.auth,r=this.context.agents.state,a=r.agentsList?.agents??[],o=r.agentsList!==null&&te(a).length===0,s=r.agentsList?null:r.agentsError,c=a.find(e=>n(e.id)===this.selectedAgentId),l=this.data??wt,u=f(this.context.runtimeConfig.state),d=nn(u),p=e.client&&this.selectedAgentId?Ye(e.client,{agentId:this.selectedAgentId},{allowStale:!0}):void 0,m={...d.defaults,...Bt(i(i(u?.agents)?.defaults))},h=this.defaultsDraft??m,ee=e=>{this.defaultsDraft={...this.defaultsDraft??m,...e},this.setMessage(`defaults`,null),this.saveDefaults(this.defaultsDraft)},g=en({...l,models:p?.models??null,providerOutcomes:p?p.providerOutcomes??[]:l.providerOutcomes,pendingProviders:p?.pendingProviders,providerUsage:l.providerUsage?.ok?l.providerUsage.value:null,configProviderIds:d.providerIds,configApiKeyProviderIds:d.apiKeyProviderIds,configProviderAuthModes:d.providerAuthModes}),_=new Set([...d.providerIds,...l.authStatus?.providers.filter(e=>!!e.apiKey||e.profiles.length>0).map(e=>e.provider)??[]]),v=Pe(e,`models.probe`),y=Pe(e,`codex.accountUsage`),b=this.login.pageActions;return fr({body:ur({providerScope:dr({agentLabel:c?se(c):this.selectedAgentId,...b,connectDisabled:b.connectDisabled||this.discovery.busy||this.addProviderOpen}),providerQuery:this.providerQuery,onProviderQueryChange:e=>this.providerQuery=e,onConnectProvider:()=>void this.login.open(),usageClient:!this.mutationBlockedReason()&&y?e.client:null,usageAgentId:this.selectedAgentId,connected:e.phase===`connected`,loading:e.phase===`connected`&&this.data===null&&!s&&!o,refreshing:this.core.loading,error:s??(o?x(`agents.noAgents`):l.error),providerUsageFailed:l.providerUsage?.ok===!1,supplementalLoading:this.loaderPending||this.supplemental.loading,updatedAt:l.updatedAt,costDays:30,credentialAgentLabel:c?se(c):this.selectedAgentId,cards:o?[]:this.installedAgents.filterProviders(g),configuredModels:tn(p?.models??null,h),decisionModels:p?.decisionModels??[],defaultModels:h,authStatus:l.authStatus,automaticUtilityModel:p?.defaultModels?.automaticUtilityModel,thinkingLevel:h.thinkingLevel,thinkingOverridden:h.thinkingOverridden,fastMode:h.fastMode,fastModeOverridden:h.fastModeOverridden,catalogDiscovering:this.catalogDiscovery.discovering||!!p?.pendingProviders?.length,catalogDiscoveryError:this.catalogDiscovery.discovering?null:this.catalogDiscovery.error??l.catalogError,configBusy:V(this.context),quickAddSupported:l.authStatus?.providerCapabilities!==void 0,unconfiguredProviders:rn(l.authStatus?.providerCapabilities,_),canViewProfiles:e.phase===`connected`&&t?.scopes!==void 0&&xe(t),mutationBlockedReason:this.mutationBlockedReason(),defaultsMutationBlockedReason:H(this.context),providerUsageStalled:this.refreshPolicy.incompleteUsageExhausted,probeAvailable:this.profileActions.probeAvailable&&v!==!1,busy:this.busy,messages:this.messages,probeResults:this.probeResults,keyEditorProvider:this.keyEditorProvider,keyDraft:this.keyDraft,profileOrders:this.profileOrders,addProviderOpen:this.addProviderOpen,addProviderId:this.addProviderId,addProviderKey:this.addProviderKey,installedAgents:this.installedAgents.render(g,()=>this.catalogDiscovery.retry()),onRefresh:()=>void(s?this.context.agents.refreshList():Promise.all([this.context.runtimeConfig.refresh({background:!0}),this.refresh(`forced`)])),onOpenKeyEditor:e=>this.openKeyEditor(e),onCloseKeyEditor:()=>this.closeKeyEditor(),onKeyDraftChange:e=>this.keyDraft=e,onSaveKey:(e,t)=>void this.mutateApiKey(e,t,this.keyDraft.trim()),onRemoveKey:(e,t)=>void this.mutateApiKey(e,t,null),onProbe:(e,t)=>void this.profileActions.probe(e,t),onRequestLogout:e=>void this.requestLogout(e),onProfileOrderChange:(e,t,n)=>this.profileActions.setOrder(e,t,n),onAddProviderToggle:()=>{this.addProviderOpen=!this.addProviderOpen,this.addProviderKey=``,this.setMessage(`add`,null)},onAddProviderIdChange:e=>this.addProviderId=e,onAddProviderKeyChange:e=>this.addProviderKey=e,onAddProvider:()=>void this.addProvider(),...zt(()=>this.defaultsDraft??m,ee),onCatalogRetry:()=>this.catalogDiscovery.retry(),...this.login.providerActions}),loginMessage:this.messages.connection??b.loginMessage,login:S`${b.login}${this.discovery.render({agentLabel:c?se(c):this.selectedAgentId,credentialChoices:l.authStatus?.providerCapabilities?.flatMap(e=>e.loginOptions?.map(e=>e.id)??[])??[]})}`})}},o([a({context:Se,subscribe:!0})],$.prototype,`context`,void 0),o([E({attribute:!1})],$.prototype,`routeData`,void 0),o([E({attribute:!1})],$.prototype,`loaderPending`,void 0),o([T()],$.prototype,`data`,void 0),o([T()],$.prototype,`busy`,void 0),o([T()],$.prototype,`messages`,void 0),o([T()],$.prototype,`probeResults`,void 0),o([T()],$.prototype,`keyEditorProvider`,void 0),o([T()],$.prototype,`keyDraft`,void 0),o([T()],$.prototype,`profileOrders`,void 0),o([T()],$.prototype,`providerQuery`,void 0),o([T()],$.prototype,`addProviderOpen`,void 0),o([T()],$.prototype,`addProviderId`,void 0),o([T()],$.prototype,`addProviderKey`,void 0),o([T()],$.prototype,`defaultsDraft`,void 0),o([T()],$.prototype,`selectedAgentId`,void 0),customElements.get(`openclaw-model-providers-page`)||customElements.define(`openclaw-model-providers-page`,$)})))()}mr();
//# sourceMappingURL=model-providers-page-Lrztjmhz.js.map