import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Kt as t,Qr as n,Zr as r,ai as i}from"./control-ui-foundation-Dh9Nir5C.js";import{Fs as a,Gl as o,Is as s,Ll as c,Ls as l,Xl as u,Yc as d,_n as ee,ln as te,nc as ne,ol as re,ru as f,tc as ie,zl as ae}from"./control-ui-core-BfjCgLp6.js";import{$ as p,A as oe,D as m,J as se,K as ce,N as h,O as le,P as ue,X as g,Y as _,Z as de,_ as fe,ct as v,et as pe,j as me,k as he,m as ge,nt as _e,q as ve,ut as y}from"./lit-runtime-L6OV30Vo.js";import{Cr as b,Di as ye,Fi as x,Fr as be,Ii as S,Oi as xe,Or as Se,Qa as Ce,do as we,fo as Te}from"./control-ui-core-qT0XjEdV.js";import{H as Ee,Sn as De,U as C,V as Oe,_n as w,dn as ke,gn as Ae,ln as je,vn as Me,xn as Ne,yn as Pe}from"./control-ui-boot-shared-Dhqg2SVA.js";import{c as Fe,u as T}from"./gateway-runtime-BQX_hMWC.js";import{$ as Ie,Mn as Le,Nn as Re,at as ze,et as Be,nt as Ve,tt as He}from"./control-ui-boot-shared-CYu509im.js";import{Da as E,Ea as D,Fa as Ue,Oa as O,Pa as We,Ta as k,ht as Ge,ka as Ke,pt as qe,wa as Je}from"./control-ui-boot-shared-Bm2ZxasE.js";import{G as Ye,U as Xe,W as Ze,Z as Qe}from"./control-ui-boot-shared-BtDOT-1l.js";import{n as $e,t as et}from"./settings-workspace-DjAwV7nI.js";import{n as tt,t as nt}from"./model-picker-DZT5u2X4.js";import{a as rt,c as it,d as at,f as A,g as ot,h as st,i as ct,l as lt,m as ut,o as dt,p as ft,s as pt,u as j}from"./wizard-login-controller-DeaGS-XK.js";import{c as M,i as mt,l as N,n as ht,o as gt,r as _t,s as vt}from"./view-status-fyTsoNa_.js";var P,yt;function bt(){return(bt=e((()=>{De(),P=class{oHash;iHash;blockLen;outputLen;canXOF=!1;finished=!1;destroyed=!1;constructor(e,t){if(Me(e),Ae(t,void 0,`key`),this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`expected Hash instance`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let n=this.blockLen,r=new Uint8Array(n);r.set(t.length>n?e.create().update(t).digest():t);for(let e=0;e<r.length;e++)r[e]^=54;this.iHash.update(r),this.oHash=e.create();for(let e=0;e<r.length;e++)r[e]^=106;this.oHash.update(r),Ne(r)}update(e){return w(this),this.iHash.update(e),this}digestInto(e){w(this),Pe(e,this),this.finished=!0;let t=e.subarray(0,this.outputLen);this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o,canXOF:s}=this;return e=e,e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.canXOF=s,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},yt=(()=>{let e=((e,t,n)=>new P(e,t).update(n).digest());return e.create=(e,t)=>new P(e,t),e})()})))()}function xt(e){let t=t=>{t.key===R&&t.newValue===null&&t.oldValue&&e(t.oldValue)};return z.add(e),window.addEventListener(`storage`,t),()=>{z.delete(e),window.removeEventListener(`storage`,t)}}function St(e,t,n){try{let r=JSON.parse(n.getItem(Et)??`null`);if(r?.version!==1||typeof r.privateKey!=`string`||!r.privateKey)return null;let i=e.gateway.connection,a=i.token||i.password||i.bootstrapToken,o=a?``:e.gateway.snapshot.hello?.auth?.deviceToken;if(!a&&!o)return null;let s=[t.gatewayUrl,t.agentId,t.modelRef??``,t.kind,String(t.deadlineMs),i.token,i.password,i.bootstrapToken,i.bootstrapProfile??``,o??``,...t.modelTarget?[t.modelTarget]:[]],c=new TextEncoder,l=s.map(e=>`${c.encode(e).length}:${e}`).join(`|`);return Array.from(yt(ke,c.encode(r.privateKey),c.encode(l))).map(e=>e.toString(16).padStart(2,`0`)).join(``)}catch{return null}}function F(e,t){try{let n=e.getItem(R);if((t===void 0||t&&n===JSON.stringify(t))&&(e.removeItem(R),n))for(let e of z)e(n)}catch{}}function I(e,n){let r=f();if(!r||e.gateway.snapshot.phase!==`connected`)return null;try{let i=r.getItem(R);if(!i||n&&i!==JSON.stringify(n))return null;let a=JSON.parse(i);if(a?.version!==1||typeof a.gatewayUrl!=`string`||typeof a.agentId!=`string`||a.modelRef!==null&&typeof a.modelRef!=`string`||a.modelTarget!==void 0&&a.modelTarget!==`utility`||typeof a.kind!=`string`||typeof a.deadlineMs!=`number`||!Number.isFinite(a.deadlineMs)||a.deadlineMs<=Date.now()||typeof a.owner!=`string`||a.gatewayUrl!==t(e.gateway.connection.gatewayUrl)||a.agentId!==(e.agentSelection.state.selectedId??``))return F(r),null;let{owner:o,...s}=a;return St(e,s,r)===o?a:(F(r),null)}catch{return F(r),null}}function Ct(e){return Date.now()+at(e)+Dt}function wt(e,n){let r=f();if(!r||e.gateway.snapshot.phase!==`connected`)return null;try{let i={version:1,gatewayUrl:t(e.gateway.connection.gatewayUrl),agentId:e.agentSelection.state.selectedId??``,modelRef:n.modelRef??null,...n.modelTarget?{modelTarget:n.modelTarget}:{},kind:n.kind,deadlineMs:n.deadlineMs??Ct(n.kind)},a=St(e,i,r);if(!a)return null;let o={...i,owner:a};return r.setItem(R,JSON.stringify(o)),o}catch{return null}}function L(e){let t=f();t&&F(t,e)}function Tt(e,t,n,r,i,a){let{context:o}=e,s=o.gateway.snapshot;!i()&&s.phase===`connected`&&s.client===t.client&&s.hello===t.hello&&o.gateway.connectionRevision===n&&(o.agentSelection.state.selectedId?.trim()||null)===r&&e.isStillDefaultLanding()&&I(o)!==null&&e.redirect(),a()}var R,Et,Dt,z;function B(){return(B=e((()=>{bt(),je(),A(),R=`openclaw.modelSetup.pendingActivation.v1`,Et=`openclaw-device-identity-v1`,Dt=5e3,z=new Set})))()}function V(e){return a(e,u(`modelSetup.errors.requestFailed`))}async function Ot(e,t){try{return{client:e,value:await t()}}catch(t){return{client:e,error:t}}}function H(){return(H=e((()=>{o(),l()})))()}function U(e,t){return t?e.agentSelection:e.settingsAgentSelection}function kt(e,t,n=null){let r=e.gateway.snapshot,i=U(e,t);return{client:r.client,hello:r.hello,agentId:i.state.selectedId,selectionIntentRevision:t?0:i.intentRevision,selectionPending:!t&&i.state.selectedId===null&&e.agents.state.agentsList===null,connected:r.phase===`connected`,firstRun:t,connectionRevision:e.gateway.connectionRevision,recoveryScope:r.phase===`connected`?r.hello?.auth?.recoveryScope??null:n}}function At(e,t){return e&&t.selectionPending&&t.selectionIntentRevision===e.selectionIntentRevision&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&(!t.connected||t.recoveryScope&&t.recoveryScope===e.recoveryScope&&b(t.hello?.auth??null))?{kind:e.selectionPending?`unchanged`:`pending`,connection:{...e,selectionPending:!0}}:{kind:e&&t.client===e.client&&t.hello===e.hello&&t.agentId===e.agentId&&t.connected===e.connected&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&t.recoveryScope===e.recoveryScope&&t.selectionIntentRevision===e.selectionIntentRevision&&t.selectionPending===e.selectionPending?`unchanged`:`changed`,connection:t}}var jt;function Mt(){return(Mt=e((()=>{Se(),o(),ee(),B(),H(),A(),jt=class{constructor(e){this.host=e,this.generation=0,this.started=!1,this.readyConnection=null,this.pending=null}subscribe(e){return xt(t=>{let n=this.pending;n?.receipt&&JSON.stringify(n.receipt)===t&&(this.pending=null,n.outcome===`verified`&&this.host.setActivationState({phase:`idle`}),this.host.setVerifyState({phase:`idle`}),e())})}setReadyConnection(e){this.readyConnection=e}routeChanged(){let e=this.pending?.receipt??null;this.reset(),this.readyConnection=null,this.pending=null,this.host.routeData()?.firstRun===!1&&L(e)}connectionChanged(e){if(this.reset(),this.readyConnection=null,this.pending&&(!this.pending.owner.recoveryScope||e.agentId!==this.pending.owner.connection.agentId||this.host.context().gateway.connectionRevision!==this.pending.owner.connectionRevision||this.host.context().gateway.snapshot.phase===`connected`&&(e.hello?.auth?.recoveryScope??null)!==this.pending.owner.recoveryScope)){let e=this.pending.receipt;this.pending=null,L(e)}}reconnectActivation(e){let t=this.pending;if(!t)return;let n=this.host.context();t.owner.recoveryScope&&t.owner.connectionRevision===n.gateway.connectionRevision&&t.owner.recoveryScope===(e.hello?.auth?.recoveryScope??null)&&t.owner.connection.agentId===e.agentId&&t.owner.firstRun===this.host.routeData()?.firstRun&&(t.owner=this.owner(t.owner.firstRun))}retryDetection(){if(this.host.actionsDisabled())return!1;if(this.pending&&Date.now()<this.pending.deadlineMs)return this.host.setRefreshWarning(u(`modelSetup.recovery.wait`,{time:te(this.pending.deadlineMs)})),!0;if(this.host.routeData()?.firstRun){let e=this.host.pageState(),t=this.pending&&e.phase===`ready`&&this.configuredActivationModel(e.result);this.pending=null,L(),this.host.setRefreshWarning(null),this.reset(),this.started=!!t}return!0}dispose(){this.reset(),this.readyConnection=null,this.pending=null}visiblePageState(e){let t=this.host.pageState();return this.host.routeData()?.firstRun&&t.phase===`ready`&&t.result.setupComplete&&t.result.configuredModel&&!e?{...t,result:{...t.result,setupComplete:!1}}:t}start(){let e=this.host.routeData(),t=this.host.context(),n=t.gateway.snapshot,r=this.host.pageState(),i=this.readyConnection;if(!e?.firstRun||this.started||r.phase!==`ready`||!i||i.client!==n.client||i.hello!==n.hello||i.agentId!==t.agentSelection.state.selectedId||this.host.actionsDisabled()||!this.host.canUseSetup(n.client))return;let a=I(t);this.pending?.receipt&&a?.owner!==this.pending.receipt.owner&&(this.pending=null);let o=a??this.pending;if(o&&(this.pending={owner:this.owner(e.firstRun),modelRef:o.modelRef,...o.modelTarget?{modelTarget:o.modelTarget}:{},kind:o.kind,deadlineMs:o.deadlineMs,receipt:a,outcome:`pending`}),!this.pending){this.started=!0;return}let s=this.configuredActivationModel(r.result);if(this.pending&&(!s||!this.pending.modelRef)){this.started=!0,this.showUnresolved();return}if(s&&!this.host.canVerify(n.client)){this.started=!0,this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${u(`modelSetup.access.gatewayTooOld`)}. ${u(`updates.confirm.action`)}. ${u(`desktop.reconnect`)}.`});return}this.started=!0,this.run(this.owner(e.firstRun),r.result)}beginActivation(e){let t=this.host.routeData();if(!t?.firstRun)return null;let n=this.owner(t.firstRun),r=wt(this.host.context(),e);return this.pending={owner:n,kind:e.kind,modelRef:e.modelRef??null,...e.modelTarget?{modelTarget:e.modelTarget}:{},receipt:r,outcome:`pending`,deadlineMs:r?.deadlineMs??Ct(e.kind)},this.started=!0,this.pending}recordActivation(e,t){if(!e)return;if(t.status===`cancelled`||t.status===`not-admitted`||t.status===`error`&&t.activationRejection?.disposition===`rejected-before-promotion`){this.ownsActivation(e)&&(e.outcome=`rejected`),L(e.receipt),this.pending===e&&(this.pending=null);return}let n=t.status===`done`?t.modelActivation?.modelRef:void 0;n&&this.pending===e&&this.ownsActivation(e)&&(e.modelRef=n,e.modelTarget=t.status===`done`?t.modelActivation?.modelTarget:void 0,e.outcome=`verified`,e.receipt=wt(this.host.context(),e))}finishActivation(e,t,n){this.pending&&this.ownsActivation()&&e.ok&&e.modelRef&&(e.gatewayRestartRequired?(this.host.setActivationState({phase:`testing`,targetId:t}),this.host.setRefreshWarning(n??u(`updates.dialog.restarting`))):n||this.completeNavigation())}get unresolved(){return this.pending!==null}get canUseCurrentModel(){let e=this.host.pageState();return this.pending!==null&&e.phase===`ready`&&!!this.configuredActivationModel(e.result)}async useCurrentModel(){let e=this.host.pageState(),t=this.pending;if(!t||e.phase!==`ready`||!this.configuredActivationModel(e.result)||this.host.actionsDisabled())return;let n=this.configuredActivationModel(e.result),r=this.owner(t.owner.firstRun),i=await this.verify();!this.owns(r)||this.pending!==t||!i||`error`in i||(i.value.ok&&i.value.modelRef===n&&i.value.modelTarget===t.modelTarget?this.completeNavigation():i.value.ok&&this.showUnresolved())}owner(e){let t=kt(this.host.context(),e);return{generation:this.generation,firstRun:e,connectionRevision:t.connectionRevision,recoveryScope:t.recoveryScope,connection:t}}clearPending(){this.pending=null,L()}ownsActivation(e=this.pending){return e?this.owns(e.owner)?e.outcome===`rejected`?this.pending===null:this.pending===e&&(!e.receipt||I(this.host.context(),e.receipt)!==null)&&Date.now()<e.deadlineMs:!1:!this.host.routeData()?.firstRun}async verify(){let e=this.host.routeData();if(!e)return;let t=this.owner(e.firstRun),n=this.pending,r=await this.host.verify(n?.modelTarget);if(this.owns(t)&&r){if(this.pending!==n||n&&!this.ownsActivation(n)){this.host.setVerifyState({phase:`idle`});return}return this.host.setVerifyState(`error`in r?{phase:`failed`,status:`unknown`,error:V(r.error)}:ut(r.value)),r}}continueSetup(e){if(this.pending)this.pending.outcome===`verified`&&this.ownsActivation()&&this.completeNavigation();else{let t=this.host.pageState(),n=this.host.activationState();e===`utility`||n.phase===`success`&&n.modelTarget===`utility`||t.phase===`ready`&&t.result.setupModel?this.host.context().navigate(`custodian`,t.phase===`ready`&&!t.result.configuredModel?{search:`?onboarding=1`}:{}):this.host.context().navigate(`chat`)}}completeNavigation(){this.clearPending(),this.host.setRefreshWarning(null),this.host.context().navigate(`custodian`,{search:`?onboarding=1`})}showUnresolved(){this.host.setRefreshWarning(null),this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${u(`modelSetup.errors.activationFailed`)} ${this.pending?.modelRef??``}`.trim()})}reset(){this.generation+=1,this.started=!1}owns(e){let t=this.host.context(),n=t.gateway.snapshot;return e.generation===this.generation&&e.connectionRevision===t.gateway.connectionRevision&&e.recoveryScope===(n.hello?.auth?.recoveryScope??null)&&e.firstRun===this.host.routeData()?.firstRun&&n.phase===`connected`&&n.client===e.connection.client&&n.hello===e.connection.hello&&U(t,e.firstRun).state.selectedId===e.connection.agentId}async run(e,t){let n=this.configuredActivationModel(t);if(n){if(this.pending&&n!==this.pending.modelRef){this.showUnresolved();return}let t=await this.verify();if(!this.owns(e)||!t||`error`in t)return;t.value.ok&&this.finishVerified(t.value.modelRef,t.value.modelTarget)}}configuredActivationModel(e){return this.pending?.modelTarget===`utility`?e.utilityModel??e.setupModel:e.setupComplete?e.configuredModel:void 0}finishVerified(e,t){this.pending?this.pending.modelRef===e&&this.pending.modelTarget===t?this.completeNavigation():this.showUnresolved():this.host.context().navigate(`chat`)}}})))()}function Nt(e){return e.brandId&&Je(e.brandId)?e.brandId:null}function W(e,t,n=``){let r=Nt(t);if(r)return O(r,{className:`model-setup__icon ${n}`.trim()});let i=t.icon?e.iconUrls[t.icon]:void 0;return!t.icon||!i?Ke(t.label,{className:`model-setup__icon ${n}`.trim()}):p`<img
    class=${`model-setup__icon ${n}`.trim()}
    src=${i}
    alt=${t.label}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t.icon)}
  />`}var Pt;function G(){return(G=e((()=>{_(),k(),Qe(),Ze(),Pt=class{constructor(e,t,n){this.getContext=e,this.getPageState=t,this.onChange=n,this.loader=new Xe({getFetchContext:()=>{let e=this.getContext();return{resourceBasePath:e.resourceBasePath,gatewayUrl:e.gateway.connection.gatewayUrl,auth:{hello:e.gateway.snapshot.hello,settings:{token:e.gateway.connection.token},password:e.gateway.connection.password}}},isConnected:e=>this.getContext().gateway.snapshot.phase===`connected`&&this.currentIconUrls().has(e),fetchIcon:(e,t,n)=>Ye({iconUrl:e,...t,signal:n}),timeoutError:()=>new DOMException(`catalog icon fetch timed out`,`TimeoutError`),onUrlsChange:e=>this.onChange(e)})}reconcile(){let e=this.currentIconUrls();this.loader.reconcileKeys(e);for(let t of e)this.loader.load(t)}invalidate(e){this.loader.handleError(e)}reset(){this.loader.reset()}currentIconUrls(){let e=this.getPageState();if(e.phase!==`ready`)return new Set;let t=e.result;return new Set([...t.candidates,...t.manualProviders,...t.authOptions??[],...t.prepareOptions??[],...t.recommendedInstalls??[]].flatMap(e=>e.icon&&!Nt(e)?[e.icon]:[]))}}})))()}function Ft(e){return p`
    <section class="settings-section" data-native-model-setup>
      <div class="settings-section__header"><h2>${u(`modelSetup.nativeModels.title`)}</h2></div>
      <p class="muted">${u(`modelSetup.nativeModels.body`)}</p>
      ${e}
    </section>
  `}function It(){return Ft(p`
    <div class="model-picker"><span class="picker-select__trigger skeleton"></span></div>
    <span class="btn skeleton">${`\xA0`}</span>
  `)}var Lt;function K(){return(K=e((()=>{_(),nt(),k(),o(),Re(),Ie(),d(),H(),Lt=class{constructor(e,t){this.host=e,this.options=t,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.generation=0,this.nativeModelsAbort=null,this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}get count(){return this.nativeModels.length}reset(){this.generation+=1,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.nativeModelsAbort?.abort(),this.nativeModelsAbort=null,this.nativeModelsUnsubscribe?.(),this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}async useNativeModel(){let e=this.options.getConnection(),t=this.generation,n=()=>this.generation===t&&this.options.getConnection()===e,r=this.options.getContext(),i=r.gateway.snapshot.client,a=e?.agentId??re(r.gateway.snapshot)?.defaultAgentId,o=this.nativeModels.find(e=>`${e.provider}/${e.id}`===this.nativeModel);if(!this.options.canUseSetup(i)||!a||o?.available!==!0||this.saving||this.options.blocked())return;this.saving=!0,this.host.requestUpdate(),this.nativeModelError=null;let s=`${o.provider}/${o.id}`;try{let e=await r.runtimeConfig.runExternalMutation(e=>e.request(`agents.update`,{agentId:a,model:s,agentRuntime:o.agentRuntime?.id}),{canDispatch:()=>n()&&this.options.canUseSetup(i)});if(!n())return;if(!e.ok){this.nativeModelError=e.error;return}if(!e.refresh.ok){this.nativeModelError=e.refresh.error;return}await r.agents.refreshList(),n()&&this.options.onSelected()}catch(e){n()&&(this.nativeModelError=V(e))}finally{n()&&(this.saving=!1,this.host.requestUpdate())}}applyNativeCatalog(e){this.nativeModels=e.models.filter(e=>e.agentRuntime&&e.agentRuntime.id!==`openclaw`),this.nativeModelsStatus=e.pendingProviders?.length?`loading`:`ready`,this.nativeCatalogError=He(e),this.nativeModels.some(e=>`${e.provider}/${e.id}`===this.nativeModel)||(this.nativeModel=``)}async loadNativeModels(e=!0){let t=this.options.getConnection(),n=this.options.getContext(),r=n.gateway.snapshot.client;if(!r||!this.options.canUseSetup(r))return;let i={view:`all`,agentId:t?.agentId??void 0},a=Ve(r,i,{allowStale:!0});a&&this.applyNativeCatalog(a),this.nativeModelsUnsubscribe??=ze(n.gateway,()=>void this.loadNativeModels(!1),i),this.nativeModelsAbort?.abort();let o=new AbortController;this.nativeModelsAbort=o,e&&(this.nativeCatalogError=null),this.nativeModelsStatus=`loading`,this.host.requestUpdate();try{let n=await Be(r,{...i,refresh:e,signal:o.signal});if(this.options.getConnection()!==t||o.signal.aborted)return;this.applyNativeCatalog(n)}catch(e){this.options.getConnection()===t&&!o.signal.aborted&&(this.nativeModelsStatus=`ready`,this.nativeCatalogError=V(e))}finally{this.nativeModelsAbort===o&&(this.nativeModelsAbort=null,this.host.requestUpdate())}}render(){let e=this.nativeModels,t=e.find(e=>`${e.provider}/${e.id}`===this.nativeModel);return Ft(p`
      ${this.nativeModelsStatus===`loading`?p`<p role="status">${u(`modelSetup.nativeModels.loading`)}</p>`:g}
      ${this.nativeModelsStatus===`ready`&&e.length===0&&!this.nativeCatalogError?p`<p role="status">${u(`modelSetup.nativeModels.empty`)}</p>`:g}
      ${tt({label:u(`modelSetup.nativeModels.choose`),value:this.nativeModel,options:e.map(e=>({value:`${e.provider}/${e.id}`,label:e.name,provider:e.provider,detail:e.available===!0?D(e.provider):Le(e.unavailableReason)??(this.nativeModelsStatus===`loading`&&e.available===void 0?u(`modelSetup.nativeModels.loading`):e.available===!1?u(`chat.modelControls.modelsUnavailable`):u(`modelSetup.nativeModels.unconfirmed`)),disabled:e.available!==!0})),disabled:this.options.blocked()||this.saving,onChange:e=>{this.nativeModel=e,this.host.requestUpdate()},onOpen:()=>{this.nativeModelsAbort||this.loadNativeModels(this.nativeModelsStatus===`idle`)}})}
      <button
        class="btn primary"
        ?disabled=${this.options.blocked()||this.saving||t?.available!==!0}
        @click=${()=>void this.useNativeModel()}
      >
        ${u(this.saving?`modelSetup.nativeModels.saving`:`modelSetup.nativeModels.use`)}
      </button>
      ${this.nativeModelError?p`<div class="callout danger" role="alert">${this.nativeModelError}</div>`:g}
      ${this.nativeCatalogError?p`
              <div class="callout danger" role="alert">
                ${this.nativeCatalogError}
                <button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${this.options.blocked()||this.saving||this.nativeModelsAbort!==null}
                  @click=${()=>void this.loadNativeModels(!0)}
                >
                  ${u(`common.retry`)}
                </button>
              </div>
            `:g}
    `)}}})))()}function q(e){return`provider-auto:${encodeURIComponent(e)}`}function Rt(e,t){return{kind:q(e.id),modelRef:t,...e.modelTarget?{modelTarget:e.modelTarget}:{}}}function zt(e){let t=[{id:`ollama`,brandId:`ollama`,label:u(`modelSetup.prepare.ollamaLabel`),hint:u(`modelSetup.prepare.ollamaHint`)},{id:`llama-cpp`,brandId:`llama-cpp`,label:u(`modelSetup.prepare.llamaCppLabel`)}];return(e.prepareOptions??t).filter(t=>!e.candidates.some(e=>e.credentials!==!1&&(e.kind===q(t.id)||e.modelRef.startsWith(`${t.brandId??t.id}/`))))}function Bt(e,t){return e.candidates.find(e=>e.kind===q(t)&&e.credentials!==!1)}function J(){return(J=e((()=>{o()})))()}function Vt(e,t,n){let r=e.find(e=>e.id===t),i=n.trim();return r&&i?{kind:`api-key`,authChoice:r.id,apiKey:i,...r.modelTarget?{modelTarget:r.modelTarget}:{}}:null}function Ht(e){let t=e.currentTarget;if(t.open){if(e.key===`Tab`){e.preventDefault(),e.stopPropagation();let n=e.shiftKey?t.querySelector(`[slot="trigger"]`):t.closest(`.model-setup__manual`)?.querySelector(`input[type="password"]`);t.addEventListener(`wa-after-hide`,()=>n?.focus({preventScroll:!0}),{once:!0}),t.open=!1;return}e.key===`Escape`&&(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>t.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}))}}function Ut(e,t,n){let r=e.detail.item,i=e.currentTarget,a=r.value??r.getAttribute(`value`);if(a){if(a!==t){i.addEventListener(`wa-after-hide`,()=>i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}),n(a);return}e.preventDefault(),r.checked=!0,i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),i.open=!1}}function Y(e){return e.groupLabel?.trim()||e.label}function Wt(e){let t=e.label.trim();return t===Y(e)?void 0:t}function Gt(e,t,n){let r=n?Wt(n):void 0,i=n?[Y(n),r].filter(Boolean).join(`, `):u(`modelSetup.manual.selectProvider`);return p`
    <wa-dropdown
      class="model-setup-provider-select"
      placement="bottom-start"
      aria-label=${u(`modelSetup.manual.provider`)}
      @wa-select=${t=>Ut(t,e.manualProviderId,e.onManualProviderChange)}
      @keydown=${Ht}
    >
      <button
        slot="trigger"
        type="button"
        class="model-setup-provider-select__trigger"
        aria-label=${`${u(`modelSetup.manual.provider`)}: ${i}`}
        ?disabled=${e.actionsDisabled||t.manualProviders.length===0}
      >
        ${n?W(e,n,`model-setup__icon--picker`):p`<span class="model-setup-provider-select__placeholder-icon" aria-hidden="true">
                ${x.key}
              </span>`}
        <span class="model-setup-provider-select__copy">
          <strong>
            ${n?Y(n):u(`modelSetup.manual.selectProvider`)}
          </strong>
          ${n?r?p`<span>${r}</span>`:g:p`<span>${u(`modelSetup.manual.selectProviderHint`)}</span>`}
        </span>
        <span class="model-setup-provider-select__chevron" aria-hidden="true">
          ${x.chevronDown}
        </span>
      </button>
      ${t.manualProviders.toSorted((e,t)=>Y(e).localeCompare(Y(t))).map(t=>{let n=t.id===e.manualProviderId,r=Wt(t),i=[Y(t),r,t.hint].filter(Boolean).join(`, `);return p`
            <wa-dropdown-item
              class="model-setup-provider-select__option"
              data-manual-provider=${t.id}
              ?data-selected=${n}
              aria-label=${i}
              .value=${t.id}
              type="checkbox"
              .checked=${n}
              ?disabled=${e.actionsDisabled}
              ?autofocus=${n&&!e.actionsDisabled}
              ${fe(e=>Ue(e,n))}
            >
              <span slot="icon">
                ${W(e,t,`model-setup__icon--picker`)}
              </span>
              <span class="model-setup-provider-select__copy">
                <strong>${Y(t)}</strong>
                ${r?p`<span>${r}</span>`:g}
                ${t.hint?p`<small>${t.hint}</small>`:g}
              </span>
            </wa-dropdown-item>
          `})}
    </wa-dropdown>
  `}function X(){return(X=e((()=>{_(),ge(),S(),We(),o(),G()})))()}function Kt(e,t){return new Ee(e,{autoRun:!1,args:()=>[null,null,null],task:async([e,n,r],{signal:i})=>{if(!e||!r)return C;let a=t.getHello();return{...await Ot(e,()=>qt(e,n??void 0,i)),agentId:n,hello:a,token:r}},onComplete:t.onComplete})}function qt(e,t,n){return e.request(`openclaw.setup.detect`,t?{agentId:t}:{},{timeoutMs:it,...n?{signal:n}:{}})}function Jt(e,t,n,r){return e.request(`openclaw.setup.verify`,{...t?{agentId:t}:{},...r?{modelTarget:r}:{}},{timeoutMs:lt,...n?{signal:n}:{}})}function Yt(e){return new Ee(e,{autoRun:!1,args:()=>[null,null,void 0],task:async([e,t,n],{signal:r})=>e?Ot(e,()=>Jt(e,t??void 0,r,n)):C})}function Xt(){return(Xt=e((()=>{Oe(),H(),A()})))()}var Z,Zt;function Qt(){return(Qt=e((()=>{pe(),se(),he(),Z=e=>le(e)?e._$litType$.h:e.strings,Zt=ce(class extends ve{constructor(e){super(e),this.et=new WeakMap}render(e){return[e]}update(e,[t]){let n=me(this.it)?Z(this.it):null,r=me(t)?Z(t):null;if(n!==null&&(r===null||n!==r)){let t=m(e).pop(),r=this.et.get(n);if(r===void 0){let e=document.createDocumentFragment();r=de(g,e),r.setConnected(!1),this.et.set(n,r)}h(r,[t]),ue(r,void 0,t)}if(r!==null){if(n===null||n!==r){let t=this.et.get(r);if(t!==void 0){let n=m(t).pop();oe(e),ue(e,void 0,n),h(e,[n])}}this.it=t}else this.it=void 0;return this.render(t)}})})))()}function $t(){return($t=e((()=>{Qt()})))()}function en(e){if(e.modelTarget===`utility`)return u(`modelSetup.utility.role`);let t=e.kind.startsWith(`saved-auth:`)?`detected`:e.recommended?`recommended`:e.credentials===void 0?`detected`:e.credentials?`credentialsReady`:`signInNeeded`;return u(`modelSetup.candidates.${t}`)}function tn(e,t){let n=t.candidates.filter(e=>!(e.modelTarget===`utility`&&!e.kind.startsWith(`saved-auth:`)&&e.modelRef===(t.utilityModel??t.setupModel))&&(!t.configuredModel||e.kind!==`existing-model`&&(e.kind.startsWith(`saved-auth:`)||e.modelRef!==t.configuredModel)));return n.length===0?g:p`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${n.toSorted((e,t)=>e.label.localeCompare(t.label)).map(n=>{let r=e.activation.phase===`testing`&&e.activation.targetId===j(n.kind,n.modelRef),i=e.activation.phase===`failure`&&e.activation.targetId===j(n.kind,n.modelRef)?e.activation:null;return p`
              <div class="model-setup__row" data-candidate-kind=${n.kind}>
                <div class="model-setup__row-main">
                  <div class="model-setup__row-title">
                    ${W(e,n)}
                    <strong>${n.label}</strong>
                    <span class="model-setup__chip">${en(n)}</span>
                  </div>
                  <div class="muted">
                    ${n.modelRef} · ${s(n.detail)}
                  </div>
                  ${n.modelTarget===`utility`?p`<div class="muted">${u(`modelSetup.utility.hint`)}</div>`:g}
                </div>
                <div class="model-setup__row-actions">
                  <button
                    type="button"
                    class=${`btn ${i?``:`primary`}`}
                    ?disabled=${e.actionsDisabled||e.detecting}
                    @click=${()=>e.onActivateCandidate(n)}
                  >
                    <span>
                      ${r?u(`modelSetup.candidates.testingButton`):i?u(`modelSetup.candidates.retry`):n.modelTarget===`utility`?u(t.configuredModel?`modelSetup.utility.useUtility`:`modelSetup.utility.useSetup`):u(e.embedded?`modelSetup.discovery.useForAgent`:`modelSetup.candidates.testAndUse`)}
                    </span>
                  </button>
                </div>
              </div>
            `})}
      </div>
    </section>
  `}function nn(){return(nn=e((()=>{_(),o(),M(),l(),G(),A(),N()})))()}function rn(e){let t=e.result.utilityModel??e.result.setupModel;if(!t)return g;let n=e.canRepair?e.result.candidates.find(e=>e.modelTarget===`utility`&&e.modelRef===t&&e.kind.startsWith(`provider-auto:`)):void 0,r=n&&e.activation.phase===`testing`&&e.activation.targetId===j(n.kind,n.modelRef);return p`<section class="settings-section model-setup__utility">
    <div class="settings-section__header"><h2>${u(`modelSetup.utility.configured`)}</h2></div>
    <div class="model-setup__row">
      <div class="model-setup__row-main">
        <strong>${t}</strong>
        <div class="muted">
          ${u(e.result.configuredModel?`modelSetup.utility.primaryReady`:`modelSetup.utility.choosePrimary`)}
        </div>
      </div>
      <div class="model-setup__row-actions">
        ${n?p`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onActivateCandidate(n)}
              >
                ${u(r?`modelSetup.candidates.testingButton`:`modelSetup.utility.repair`)}
              </button>`:g}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled}
          @click=${e.onOpenAssistant}
        >
          ${u(`modelSetup.utility.openAssistant`)}
        </button>
      </div>
    </div>
  </section>`}function an(e){let t={auth:u(`modelSetup.failure.auth`),rate_limit:u(`modelSetup.failure.rateLimit`),billing:u(`modelSetup.failure.billing`),timeout:u(`modelSetup.failure.timeout`),format:u(`modelSetup.failure.format`),unavailable:u(`modelSetup.failure.unavailable`),unknown:u(`modelSetup.failure.unknown`)};return t[e]??t.unknown}function on(e){let t={auth:u(`modelSetup.failureGuidance.auth`),rate_limit:u(`modelSetup.failureGuidance.rateLimit`),billing:u(`modelSetup.failureGuidance.billing`),timeout:u(`modelSetup.failureGuidance.timeout`),format:u(`modelSetup.failureGuidance.format`),unavailable:g,unknown:u(`modelSetup.failureGuidance.unknown`)};return t[e]??t.unknown}function sn(e,t){return p`
    <div class="model-setup__failure" role="alert">
      <span class="model-setup__failure-icon" aria-hidden="true">${x.alertTriangle}</span>
      <span><strong>${an(e)}.</strong> ${t} ${on(e)}</span>
    </div>
  `}function cn(e){let t=e.indexOf(`/`);return t<0?e:e.slice(t+1)}function ln(e,t){return e.candidates.find(e=>e.modelRef===t&&!e.kind.startsWith(`saved-auth:`))}function un(e,t){let n=cn(t),r=e?.detail.trim();return!r||e?.kind===`existing-model`?n:r.toLowerCase().includes(n.toLowerCase())?r:`${n} · ${r}`}function dn(e){switch(e.phase){case`checking`:return u(`modelSetup.verify.checkingButton`);case`failed`:return u(`modelSetup.verify.retry`);case`ok`:return u(`modelSetup.verify.checkAgain`);default:return u(`modelSetup.verify.button`)}}function fn(e){let t=e.result.configuredModel,n=e.verify.phase===`ok`?e.verify.modelRef:t,r=E(n),i=n===t?ln(e.result,t):void 0,a=r?D(r):n,o=un(i,n);return p`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${u(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__provider-copy">
          ${r?O(r,{className:`model-setup__icon`}):g}
          <div class="model-setup__current-copy">
            <strong>${a}</strong>
            <div class="muted">${o}</div>
            ${e.verify.phase===`checking`?p`<div class="model-setup__testing" role="status">
                    ${u(`modelSetup.verify.checking`,{modelRef:t})}
                  </div>`:e.verify.phase===`ok`?p`<div class="model-setup__verified" role="status">
                      ${e.verify.latencyMs===void 0?u(`modelSetup.verify.ready`):u(`modelSetup.verify.readyIn`,{latencyMs:String(e.verify.latencyMs)})}
                    </div>`:e.verify.phase===`failed`?sn(e.verify.status,e.verify.error):g}
          </div>
        </div>
        <div class="model-setup__row-actions">
          ${e.canVerify?p`<button
                  type="button"
                  class="btn"
                  ?disabled=${e.actionsDisabled}
                  @click=${e.onVerify}
                >
                  ${dn(e.verify)}
                </button>`:g}
          ${e.onContinue?p`<button type="button" class="btn primary" @click=${e.onContinue}>
                  ${x.messageSquare} ${u(`modelSetup.success.continueSetup`)}
                </button>`:g}
        </div>
      </div>
    </section>
  `}function pn(e){return e.phase===`testing`?p`<div class="model-setup__testing" role="status">${u(`modelSetup.testing`)}</div>`:e.phase===`failure`?sn(e.status,e.error):g}function mn(){return(mn=e((()=>{_(),S(),k(),o(),M(),A(),N()})))()}function Q(e){return p`
    <section class=${`settings-section ${e.className??``}`.trim()}>
      <div class="settings-section__header"><h2>${e.title}</h2></div>
      ${e.intro?p`<p class="muted model-setup__loading-intro">${e.intro}</p>`:g}
      <div class="model-setup__rows">
        ${Array.from({length:e.rows??1},(t,n)=>p`
            <div class="model-setup__row model-setup__loading-row">
              <span class="model-setup__loading-icon skeleton"></span>
              <span class="model-setup__loading-copy">
                ${n===0&&e.status?p`<span class="model-setup__loading-status">${e.status}</span>`:p`<span class="skeleton skeleton-line skeleton-line--medium"></span>`}
                <span class="skeleton skeleton-line skeleton-line--long"></span>
              </span>
              <span class="model-setup__loading-action skeleton"></span>
            </div>
          `)}
      </div>
    </section>
  `}function hn(e){return p`
    <div
      class="model-setup__loading"
      role="status"
      aria-busy="true"
      aria-label=${u(`modelSetup.loading`)}
    >
      <div class="model-setup__loading-sections" aria-hidden="true">
        ${e?Q({title:u(`modelSetup.verify.title`),className:`model-setup__loading-section--selected`,status:u(`modelSetup.loading`)}):g}
        ${It()}
        ${Q({title:u(`modelSetup.candidates.title`),className:`model-setup__loading-section--candidates`,status:e?void 0:u(`modelSetup.loading`)})}
        ${Q({title:u(`modelSetup.prepare.title`),intro:u(`modelSetup.prepare.intro`),rows:2})}
        ${Q({title:u(`modelSetup.signIn.title`),className:`model-setup__loading-section--sign-in`})}
        ${Q({title:u(`modelSetup.manual.title`)})}
      </div>
    </div>
  `}function gn(){return(gn=e((()=>{_(),o(),M(),K(),N()})))()}function _n(e,t,n,r,i=!1){let a=E(e.modelRef),o=a&&Je(a)?a:null,s=e.modelTarget===`utility`,c=u(s?`modelSetup.utility.ready`:`modelSetup.success.title`),l=e.warning??u(s?`modelSetup.utility.verified`:`modelSetup.success.body`,{modelRef:e.modelRef}),d=s?u(`modelSetup.utility.openAssistant`):i?u(`modelSetup.discovery.returnToModels`):r?u(`modelSetup.success.continueSetup`):e.warning?u(`tabs.chat`):u(`modelSetup.success.openChat`);return p`
    <openclaw-modal-dialog label=${c} description=${l} @modal-cancel=${n}>
      <section class="model-setup-success" role="status">
        <div
          class=${`model-setup-success__icon${o?` model-setup-success__icon--provider`:``}`}
          aria-hidden="true"
        >
          ${o?p`
                  ${O(o,{className:`model-setup-success__provider-icon`})}
                  <span class="model-setup-success__status-badge">${x.check}</span>
                `:x.shieldCheck}
        </div>
        <div class="model-setup-success__copy">
          <h2>${c}</h2>
          ${e.warning?g:p`<p>${l}</p>`}
        </div>
        ${e.warning?p`<div class="model-setup-success__warning">${e.warning}</div>`:g}
        <div class="model-setup-success__summary">
          <span>${u(s?`modelSetup.utility.model`:`modelSetup.success.activeModel`)}</span>
          <strong>${e.modelRef}</strong>
          ${e.latencyMs===void 0?g:p`<span>
                  ${u(`modelSetup.success.latency`,{latencyMs:String(e.latencyMs)})}
                </span>`}
        </div>
        <footer class="model-setup-success__actions">
          ${i&&!s?g:p`<button type="button" class="btn" @click=${n}>
                  ${u(`modelSetup.success.stayHere`)}
                </button>`}
          <button type="button" class="btn primary" autofocus @click=${t}>
            ${i&&!s?g:x.messageSquare} ${d}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}function vn(){return(vn=e((()=>{_(),S(),be(),k(),o(),M(),N()})))()}function yn(e,t){let n=t.recommendedInstalls??[];return e.nativeModels?.count||t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?g:p`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${u(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>p`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${W(e,t,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function bn(e,t){return p`
    <div class="model-setup__row" data-auth-choice=${t.id}>
      <div class="model-setup__provider-copy">
        ${W(e,t)}
        <div>
          <strong>${t.label}</strong>
          ${t.groupLabel?p`<div class="muted">${t.groupLabel}</div>`:g}
          ${t.hint?p`<div class="muted">${t.hint}</div>`:g}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled||e.detecting}
        @click=${()=>e.onStartAuth(t)}
      >
        ${t.kind===`install`?u(`modelSetup.signIn.install`):t.kind===`custom`?u(`modelSetup.signIn.custom`):u(`modelSetup.signIn.verify`)}
      </button>
    </div>
  `}function xn(e,t){let n=(t.authOptions??[]).filter(t=>!e.embedded||!e.credentialChoices?.includes(t.id)).toSorted((e,t)=>e.label.localeCompare(t.label));if(n.length===0)return g;let r=n.filter(e=>e.featured||e.kind===`install`||e.kind===`custom`),i=n.filter(e=>!r.includes(e));return p`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.signIn.title`)}</h2>
        <p>${u(`modelSetup.signIn.description`)}</p>
      </div>
      <div class="model-setup__rows">${r.map(t=>bn(e,t))}</div>
      ${i.length?p`<details
              class="model-setup__more"
              .open=${e.moreSignInOpen}
              @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
            >
              <summary>${u(`modelSetup.signIn.more`)}</summary>
              <div class="model-setup__rows">
                ${i.map(t=>bn(e,t))}
              </div>
            </details>`:g}
    </section>
  `}function Sn(e,t){if(!e.canPrepare)return g;let n=zt(t);return n.length===0?g:p`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.prepare.title`)}</h2>
      </div>
      <p class="muted">${u(`modelSetup.prepare.intro`)}</p>
      <div class="model-setup__rows">
        ${n.map(t=>p`
            <div class="model-setup__row" data-prepare-choice=${t.id}>
              <div class="model-setup__provider-copy">
                ${W(e,t)}
                <div>
                  <strong>${t.label}</strong>
                  ${t.hint?p`<div class="muted">${t.hint}</div>`:g}
                </div>
              </div>
              <button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled||e.detecting}
                @click=${()=>e.onStartPrepare(t)}
              >
                ${t.actionLabel??u(`modelSetup.prepare.ollamaButton`)}
              </button>
            </div>
          `)}
      </div>
    </section>
  `}function Cn(e,t){return e.embedded===!0&&e.credentialChoices?.includes(t.id)===!0}function wn(e,t){let n=e.embedded?{...t,manualProviders:t.manualProviders.filter(t=>!Cn(e,t))}:t;if(n.manualProviders.length===0&&e.embedded)return g;let r=n.manualProviders.find(t=>t.id===e.manualProviderId),i=`manual:${e.manualProviderId}`,a=e.activation.phase===`testing`&&e.activation.targetId===i;return p`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <div class="field">
          <span>${u(`modelSetup.manual.provider`)}</span>
          ${Gt(e,n,r)}
        </div>
        <label class="field">
          <span>
            ${r?u(`modelSetup.manual.accessValueFor`,{provider:Y(r)}):u(`modelSetup.manual.accessValue`)}
          </span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${u(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        <div class="model-setup__manual-help">
          ${x.shieldCheck}
          <span>${u(`modelSetup.manual.verifyHint`)}</span>
        </div>
        ${e.manualError?p`<div class="callout danger" role="alert">${e.manualError}</div>`:g}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||e.detecting||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${u(a?`modelSetup.candidates.testingButton`:e.embedded?`modelSetup.discovery.connectForAgent`:`modelSetup.manual.connectAndVerify`)}
        </button>
      </div>
    </section>
  `}function Tn(e){e.querySelector(`.model-setup > .model-setup__testing, .model-setup > .model-setup__failure`)?.scrollIntoView?.({block:`nearest`,behavior:`auto`})}function En(e,t){return t.nativeSessionCatalogPreferenceRequired!==!0||!t.nativeSessionCatalogs?.length?g:p`
    <section class="settings-section model-setup__native-discovery">
      <div class="settings-section__header"><h2>${u(`modelSetup.nativeDiscovery.title`)}</h2></div>
      <p class="muted">${u(`modelSetup.nativeDiscovery.body`)}</p>
      <p>${t.nativeSessionCatalogs.map(e=>e.label).join(`, `)}</p>
      <label>
        <input
          type="checkbox"
          .checked=${e.nativeSessionCatalogsEnabled===!0}
          ?disabled=${e.actionsDisabled}
          @change=${t=>{let n=t.currentTarget;e.onNativeSessionCatalogsChange?.(n.checked)}}
        />
        ${u(`modelSetup.nativeDiscovery.enable`)}
      </label>
      <p class="muted">${u(`modelSetup.nativeDiscovery.decline`)}</p>
    </section>
  `}function Dn(e,t){let n=e.firstRun&&t.setupComplete&&e.activation.phase!==`success`?e.onOpenChat:void 0,r=!e.embedded&&t.configuredModel?fn({result:t,verify:e.verify.phase===`ok`&&e.verify.modelTarget===`utility`?{phase:`idle`}:e.verify,canVerify:e.canVerify,actionsDisabled:e.actionsDisabled||e.detecting===!0,onVerify:e.onVerify,onContinue:n}):g,i=p`${r}${rn({result:t,activation:e.activation,canRepair:e.canAdmin&&!e.gatewayTooOld,actionsDisabled:e.actionsDisabled||e.detecting===!0||e.activationUnresolved===!0,onOpenAssistant:e.onOpenSetupAssistant??e.onOpenChat,onActivateCandidate:e.onActivateCandidate})}`;return e.canAdmin?e.gatewayTooOld?p`${i}
      <div class="callout warning" role="note">${u(`modelSetup.access.gatewayTooOld`)}</div>`:p`
    ${i} ${En(e,t)} ${yn(e,t)}
    ${e.nativeModels?.render()} ${tn(e,t)}
    ${Sn(e,t)} ${xn(e,t)} ${wn(e,t)}
  `:p`${i}
      <div class="callout warning" role="note">${u(`modelSetup.access.adminRequired`)}</div>`}function On(e){let t;e.page.phase===`ready`?t=Dn({...e,actionsDisabled:e.actionsDisabled||e.activationUnresolved===!0},e.page.result):e.canAdmin?e.gatewayTooOld?t=p`<div class="callout warning" role="note">
      ${u(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=e.embedded?p`<div class="model-setup__loading" role="status">${u(`modelSetup.loading`)}</div>`:hn(e.modelConfigured===!0):e.page.phase===`detect-error`&&(t=p`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" ?disabled=${e.detecting} @click=${e.onDetect}>
        ${u(`modelSetup.retry`)}
      </button>
    `):t=p`<div class="callout warning" role="note">
      ${u(`modelSetup.access.adminRequired`)}
    </div>`;let n=p`
    <div
      class="model-setup"
      aria-busy=${e.detecting||e.page.phase===`loading`?`true`:`false`}
    >
      <div class="model-setup__intro">
        <div>
          ${e.embedded?p`<h2>${u(`modelSetup.discovery.title`)}</h2>
                  <p>
                    ${u(`modelSetup.discovery.description`,{agent:e.agentLabel??``})}
                  </p>`:p`<h1>${u(`modelSetup.heading`)}</h1>
                  <p>${u(`modelSetup.intro`)}</p>`}
        </div>
        ${e.connection?_t(e.connection,!0):g}
        ${e.page.phase===`ready`&&(e.embedded||!e.page.result.configuredModel)&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?p`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled||e.detecting}
                @click=${e.onDetect}
              >
                ${e.detecting?u(`modelSetup.verify.checkingButton`):u(`modelSetup.checkAgain`)}
              </button>`:g}
      </div>
      ${e.canAdmin&&!e.gatewayTooOld?pn(e.activation):g}
      ${e.refreshWarning?p`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:g}
      ${e.activationUnresolved&&!e.actionsDisabled&&e.activation.phase!==`success`?p`<div class="model-setup__recovery">
              <p>${u(`modelSetup.recovery.unknown`)}</p>
              ${e.page.phase===`ready`&&(e.page.result.configuredModel||e.page.result.setupModel)&&e.canVerify&&e.onUseCurrentModel?p`<button
                      type="button"
                      class="btn primary"
                      @click=${e.onUseCurrentModel}
                    >
                      ${u(`modelSetup.recovery.useCurrent`)}
                    </button>`:g}
              <button type="button" class="btn" @click=${e.onDetect}>
                ${u(`modelSetup.checkAgain`)}
              </button>
            </div>`:g}
      ${mt(e.connection?.loginMessage)}
      ${e.detectionError?p`<div class="callout warning" role="alert">${e.detectionError}</div>`:g}
      ${e.detecting&&e.page.phase===`ready`?p`<div class="muted" role="status">${u(`modelSetup.loading`)}</div>`:g}
      ${t}
    </div>
  `,r=p`
    ${e.connection?.login}
    <div @modal-cancel=${e=>e.preventDefault()}>
      ${rt({mode:e.wizardMode,state:e.wizard,refreshWarning:e.refreshWarning,cancellationNotice:e.cancellationNotice,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
    </div>
    ${e.activation.phase===`success`?_n(e.activation,e.activation.modelTarget===`utility`?e.onOpenSetupAssistant??e.onOpenChat:e.onOpenChat,e.onSuccessClose,e.firstRun,e.embedded):g}
  `;if(e.embedded){let t=e.wizard.phase!==`idle`||e.activation.phase===`success`;return p`
      ${Zt(t?g:p`<openclaw-modal-dialog
              label=${u(`modelSetup.discovery.title`)}
              @modal-cancel=${()=>e.onClose?.()}
              @wa-after-show=${t=>t.target===t.currentTarget?e.onDiscoveryShown?.():void 0}
            >
              <div class="model-setup-wizard model-setup-discovery">
                <div class="model-setup-wizard__body">${n}</div>
                <div class="model-setup-wizard__footer">
                  <button class="btn" @click=${()=>e.onClose?.()}>
                    ${u(`common.close`)}
                  </button>
                </div>
              </div>
            </openclaw-modal-dialog>`)}
      ${r}
    `}return p`
    <section class="content-header">
      <div>
        <div class="page-title">${Te(`model-setup`)}</div>
        <div class="page-subtitle">
          ${we(`model-setup`)} ${Ge(kn)}
        </div>
      </div>
    </section>
    ${$e(n)} ${r}
  `}var kn;function An(){return(An=e((()=>{_(),$t(),Ce(),S(),qe(),et(),o(),M(),ht(),nn(),mn(),gn(),G(),J(),X(),vn(),ct(),N(),kn=`https://docs.openclaw.ai/concepts/model-providers`})))()}var $;function jn(){return(jn=e((()=>{n(),_e(),xe(),Se(),o(),Fe(),d(),ae(),ne(),vt(),Mt(),G(),H(),K(),J(),X(),Xt(),A(),An(),pt(),B(),$=class extends c{constructor(...e){super(...e),this.actionsDisabled=()=>this.login.busy||this.nativeModels.saving||this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardMutationActive||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`,this.embedded=!1,this.agentLabel=``,this.credentialChoices=[],this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.wizardMode=`auth`,this.wizardDraft={stepId:null,value:void 0},this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.nativeSessionCatalogsEnabled=!1,this.iconUrls={},this.setupRefreshWarning=null,this.detectionError=null,this.detectionRequest=null,this.cancellationNotice=null,this.observedConnection=null,this.pendingPrepareOption=null,this.wizardMutationGeneration=0,this.wizardMutationActive=!1,this.wizardReturnFocus=null,this.firstRun=new jt({context:()=>this.context,routeData:()=>this.routeData,pageState:()=>this.pageState,activationState:()=>this.activationState,actionsDisabled:()=>this.actionsDisabled()||this.detectionRequest!==null,canUseSetup:e=>this.canUseSetup(e),canVerify:e=>this.canVerify(e),verify:e=>this.verifyConnection(e).then(()=>this.verifyTask.value),setVerifyState:e=>this.verifyState=e,setActivationState:e=>this.activationState=e,setRefreshWarning:e=>this.setupRefreshWarning=e}),this.nativeModels=new Lt(this,{getContext:()=>this.context,getConnection:()=>this.observedConnection,canUseSetup:e=>this.canUseSetup(e),blocked:()=>this.actionsDisabled()||this.detectionRequest!==null||this.firstRun.unresolved,onSelected:()=>this.embedded?this.onClose?.():this.context.navigate(`chat`)}),this.iconLoader=new Pt(()=>this.context,()=>this.pageState,e=>this.iconUrls=e),this.login=new gt(this,{getScope:()=>({context:this.context,agentId:this.agentSelection.state.selectedId}),canStart:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved&&!this.actionsDisabled(),canContinue:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved,refresh:()=>this.detect()}),this.subscriptions=new ie(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e.snapshot)).watch(()=>this.context&&this.agentSelection,(e,t)=>e.subscribe(t),()=>this.synchronizeGateway(this.context.gateway.snapshot)).watch(()=>this.firstRun,(e,t)=>e.subscribe(t)),this.wizard=new dt({getClient:()=>this.context?.gateway.snapshot.client??null,getAgentId:()=>this.agentSelection.state.selectedId??null,onChange:e=>{e.phase!==`starting`&&e.phase!==`done`&&(this.activationState={phase:`idle`}),this.wizardState=e.phase===`step`&&this.wizardMutationActive?{...e,busy:!0}:e,this.wizardDraft=ot(this.wizardDraft,e),e.phase===`idle`&&(this.cancellationNotice=null)},onStart:(e,t)=>{if(e===`openclaw.setup.prepare.start`)return;let n=this.firstRun.beginActivation(t??{kind:`provider-auth`});return e=>(this.firstRun.recordActivation(n,e),this.requestUpdate(),()=>this.firstRun.ownsActivation(n))},onBackgroundCompletion:e=>this.runWizardMutation(()=>Promise.resolve(e),!0),requestFailedMessage:()=>u(`modelSetup.errors.requestFailed`),cancelledMessage:()=>u(`modelSetup.wizard.cancelled`),sessionExpiredMessage:()=>u(`modelSetup.wizard.sessionExpired`)}),this.detectTask=Kt(this,{getHello:()=>this.context.gateway.snapshot.hello,onComplete:e=>{if(this.detectionRequest===e.token&&this.context.gateway.snapshot.client===e.client&&this.context.gateway.snapshot.hello===e.hello&&this.agentSelection.state.selectedId===e.agentId){if(this.detectionRequest=null,`error`in e){let t=V(e.error);this.pageState.phase===`ready`?this.detectionError=t:(this.firstRun.setReadyConnection(null),this.pageState={phase:`detect-error`,message:t});return}this.detectionError=null,this.firstRun.setReadyConnection({client:e.client,hello:e.hello,agentId:e.agentId}),this.pageState={phase:`ready`,result:e.value},e.value.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=``)}}}),this.verifyTask=Yt(this)}get agentSelection(){return U(this.context,this.routeData?.firstRun===!0)}disconnectedCallback(){this.firstRun.dispose(),this.resetActivity(),this.observedConnection=null,this.nativeModels.reset(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(){this.synchronizeGateway(this.context.gateway.snapshot)}updated(e){this.isConnected&&(e.has(`activationState`)&&this.activationState.phase!==`idle`&&Tn(this.renderRoot),this.wizardState.phase!==`idle`&&this.querySelector(`openclaw-modal-dialog`)?.setReturnFocusTarget(this.wizardReturnFocus),this.iconLoader.reconcile(),this.firstRun.start())}synchronizeGateway(e){let t=this.routeData;if(!this.isConnected||!t)return;let n=this.observedConnection,r=At(n,kt(this.context,t.firstRun,n?.recoveryScope));if(r.kind===`unchanged`)return;let i=r.connection;if(this.observedConnection=i,this.nativeModels.reset(),r.kind===`pending`){this.wizard.hasAdmittedSession||(this.pageState={phase:`loading`}),this.wizard.suspend();return}let a=n&&(!i.recoveryScope||i.recoveryScope!==n.recoveryScope),o=n&&(i.agentId!==n.agentId||i.selectionIntentRevision!==n.selectionIntentRevision||i.firstRun!==n.firstRun||i.connectionRevision!==n.connectionRevision||a),s=i.connected&&!b(e.hello?.auth??null);if((a||s)&&this.wizard.close({retireOwner:!0}),o&&(this.nativeSessionCatalogsEnabled=!1,this.manualProviderId=``,this.manualApiKey=``,this.manualError=null),n&&i.recoveryScope&&!o&&this.wizard.hasAdmittedSession){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.wizard.suspend(),this.canUseSetup(i.client)&&(this.firstRun.reconnectActivation(i),this.runWizardMutation(()=>this.wizard.resume()));return}i.firstRun===n?.firstRun?this.firstRun.connectionChanged(i):this.firstRun.routeChanged(),this.resetActivity(),this.pageState={phase:`loading`},this.canUseSetup(i.client)&&this.detect()}resetActivity(){this.login.reset(),this.detectionRequest=null,this.detectionError=null,this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationState={phase:`idle`},this.resetVerify(),this.iconLoader.reset(),this.pendingPrepareOption=null,this.wizard.cancel()}canUseSetup(e){let t=this.context.gateway.snapshot;return!(!e||this.routeData?.firstRun!==!0&&this.agentSelection.state.selectedId===null||t.phase!==`connected`||!b(t.hello?.auth??null)||T(t,`openclaw.setup.detect`)!==!0)}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e)||this.detectionRequest)return null;this.resetVerify(),this.detectionError=null,this.pageState.phase!==`ready`&&(this.pageState={phase:`loading`});let t={};this.detectionRequest=t,await this.detectTask.run([e,this.agentSelection.state.selectedId,t]);let n=this.detectTask.value;return n?.token===t&&`value`in n?n.value:null}canVerify(e){let t=this.context.gateway.snapshot;return this.canUseSetup(e)&&T(t,`openclaw.setup.verify`)===!0}resetVerify(){this.verifyState={phase:`idle`},this.verifyTask.run([null,null,void 0])}async verifyConnection(e){let t=this.context.gateway.snapshot.client;!this.canVerify(t)||this.actionsDisabled()||this.detectionRequest||(this.verifyState={phase:`checking`},await this.verifyTask.run([t,this.agentSelection.state.selectedId,e]))}async activate(e,t){let n=this.context.gateway.snapshot.client;!this.canUseSetup(n)||this.actionsDisabled()||this.detectionRequest||this.firstRun.unresolved||(this.manualError=null,this.activationState={phase:`testing`,targetId:t},this.pendingPrepareOption=null,this.wizardMode=`activate`,await this.runWizardMutation(()=>this.wizard.activate({...e,...this.nativeSessionCatalogPreference()},t)))}nativeSessionCatalogPreference(){return this.pageState.phase===`ready`&&this.pageState.result.nativeSessionCatalogPreferenceRequired===!0?{nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled}:{}}connectManual(){let e=Vt(this.pageState.phase===`ready`?this.pageState.result.manualProviders:[],this.manualProviderId,this.manualApiKey);if(!e){this.manualError=u(`modelSetup.manual.required`);return}this.activate(e,`manual:${this.manualProviderId}`)}selectManualProvider(e){e!==this.manualProviderId&&(this.manualApiKey=``),this.manualProviderId=e,this.manualError=null}async handleWizardDone({startMethod:e,preparedModelRef:t,activationTargetId:n,modelActivation:r,isCurrent:i}){let a=e===`openclaw.setup.prepare.start`?this.pendingPrepareOption:null,o=this.nativeSessionCatalogPreference();if(this.pendingPrepareOption=null,a&&t){let e=Rt(a,t);this.wizard.close(),this.activate({...e,...o},j(e.kind,t));return}if(e!==`openclaw.setup.prepare.start`){if(i?.()===!1){this.wizard.close();return}if(!r){this.wizard.fail(u(e===`openclaw.setup.activate.start`?`modelSetup.errors.activationFailed`:`modelSetup.wizard.notComplete`));return}this.wizard.close();let t={ok:!0,...r},a=n??`provider-auth`;this.activationState=ft({result:t,targetId:a,fallbackError:u(`modelSetup.errors.activationFailed`),restartWarning:u(`labsPage.restartRequired`),refreshWarning:this.setupRefreshWarning}),this.activationState.phase===`success`&&(this.manualApiKey=``),this.firstRun.finishActivation(t,a,this.setupRefreshWarning);return}let s=await this.detect();if(!s){this.wizard.fail(u(`modelSetup.errors.requestFailed`));return}if(a){this.pageState=st(s,a.modelTarget);let e=Bt(s,a.id);if(!e){this.wizard.fail(u(`modelSetup.prepare.providerNotReady`,{provider:a.label}));return}this.wizard.close(),this.activate({kind:e.kind,modelRef:e.modelRef,...e.modelTarget?{modelTarget:e.modelTarget}:{},...o},j(e.kind,e.modelRef));return}this.wizard.close()}closeWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.close()}async runWizardMutation(e,t=!1){let n=this.context.gateway.snapshot.client;if((this.wizardMutationActive||this.detectionRequest!==null)&&!t||!this.canUseSetup(n)||this.wizard.state.phase===`idle`&&this.firstRun.unresolved)return;if(this.wizard.state.phase===`idle`){let e=this.ownerDocument.activeElement;this.wizardReturnFocus=e instanceof HTMLElement&&this.contains(e)?e:null}let r=++this.wizardMutationGeneration;this.wizardMutationActive=!0,this.requestUpdate();try{let t=await this.context.runtimeConfig.runExternalMutation(async t=>{if(t!==n)throw Error(`Connection changed before model setup continued.`);return await e()},{canDispatch:()=>r===this.wizardMutationGeneration&&this.context.gateway.snapshot.client===n&&this.canUseSetup(n),dispatchError:u(`modelSetup.errors.requestFailed`)});if(r!==this.wizardMutationGeneration){t.ok&&!t.refresh.ok&&this.isConnected&&(this.setupRefreshWarning=t.refresh.error),this.isConnected&&this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect();return}if(!t.ok){this.wizard.fail(t.error);return}this.setupRefreshWarning=t.refresh.ok?null:t.refresh.error;let i=t.value;i?(this.wizardMutationActive=!1,await this.handleWizardDone(i)):this.wizardState.phase===`step`&&this.wizardState.busy&&(this.wizardState={...this.wizardState,busy:!1})}catch(e){r===this.wizardMutationGeneration&&this.wizard.fail(V(e))}finally{r===this.wizardMutationGeneration&&(this.wizardMutationActive=!1,this.requestUpdate())}}async cancelWizard(){let e=this.wizardMutationGeneration;this.cancellationNotice=null;try{let t=await this.wizard.requestCancellation();if(e!==this.wizardMutationGeneration)return;if(t===`running`){this.cancellationNotice=u(`modelSetup.wizard.finishingStep`);return}if(t!==`cancelled`)return;this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.activationState={phase:`idle`}}catch(t){e===this.wizardMutationGeneration&&(this.wizardState.phase===`starting`||this.wizardState.phase===`step`)&&(this.cancellationNotice=u(`modelSetup.wizard.cancelFailed`,{error:V(t)}))}}render(){let e=this.context.gateway.snapshot,t=b(e.hello?.auth??null),n=e.phase===`connected`&&T(e,`openclaw.setup.detect`)!==!0;return On({detecting:this.detectionRequest!==null,detectionError:this.detectionError,embedded:this.embedded,agentLabel:this.agentLabel,credentialChoices:this.credentialChoices,onClose:this.onClose,onDiscoveryShown:()=>{this.wizardState.phase===`idle`&&(this.wizardReturnFocus?.focus({preventScroll:!0}),this.wizardReturnFocus=null)},onConnectChoice:this.onConnectChoice,page:this.firstRun.visiblePageState(this.verifyState.phase===`ok`&&this.verifyState.modelTarget!==`utility`),activation:this.activationState,verify:this.verifyState,connection:this.embedded?void 0:this.login.pageActions,wizard:this.wizardState,wizardMode:this.wizardMode,wizardValue:this.wizardDraft.value,canAdmin:t,canVerify:this.canVerify(e.client),canPrepare:this.canUseSetup(e.client)&&T(e,`openclaw.setup.prepare.start`)===!0,modelConfigured:re(e)?.modelConfigured===!0,gatewayTooOld:n,refreshWarning:this.setupRefreshWarning,cancellationNotice:this.cancellationNotice,activationUnresolved:this.firstRun.unresolved,onUseCurrentModel:this.firstRun.canUseCurrentModel?()=>void this.firstRun.useCurrentModel():void 0,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled,nativeModels:this.nativeModels,onNativeSessionCatalogsChange:e=>this.nativeSessionCatalogsEnabled=e,firstRun:this.routeData?.firstRun===!0,iconUrls:this.iconUrls,onDetect:()=>{!this.detectionRequest&&this.firstRun.retryDetection()&&this.detect()},onVerify:()=>void this.firstRun.verify(),onActivateCandidate:({kind:e,modelRef:t,modelTarget:n})=>void this.activate({kind:e,modelRef:t,...n?{modelTarget:n}:{}},j(e,t)),onStartAuth:e=>{this.wizard.prepareSignIn(e.kind,e.label),this.pendingPrepareOption=null,this.wizardMode=`auth`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.auth.start`,this.nativeSessionCatalogPreference(),e.modelTarget))},onStartPrepare:e=>{this.pendingPrepareOption=e,this.wizardMode=`prepare`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.prepare.start`))},onManualProviderChange:e=>this.selectManualProvider(e),onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.iconLoader.invalidate(e),onOpenChat:()=>this.embedded?this.onClose?.():this.firstRun.continueSetup(),onOpenSetupAssistant:()=>this.firstRun.continueSetup(`utility`),onSuccessClose:()=>{if(this.embedded){this.onClose?.();return}this.activationState={phase:`idle`},this.detect()},onWizardValueChange:e=>this.wizardDraft={...this.wizardDraft,value:e},onWizardAnswer:(e,t)=>void this.runWizardMutation(()=>this.wizard.answer(e,t)),onWizardCancel:()=>void this.cancelWizard(),onWizardClose:()=>this.closeWizard()})}},i([r({context:ye,subscribe:!0})],$.prototype,`context`,void 0),i([y({attribute:!1})],$.prototype,`routeData`,void 0),i([y({type:Boolean})],$.prototype,`embedded`,void 0),i([y()],$.prototype,`agentLabel`,void 0),i([y({attribute:!1})],$.prototype,`credentialChoices`,void 0),i([y({attribute:!1})],$.prototype,`onClose`,void 0),i([y({attribute:!1})],$.prototype,`onConnectChoice`,void 0),i([v()],$.prototype,`pageState`,void 0),i([v()],$.prototype,`activationState`,void 0),i([v()],$.prototype,`verifyState`,void 0),i([v()],$.prototype,`wizardState`,void 0),i([v()],$.prototype,`wizardMode`,void 0),i([v()],$.prototype,`wizardDraft`,void 0),i([v()],$.prototype,`manualProviderId`,void 0),i([v()],$.prototype,`manualApiKey`,void 0),i([v()],$.prototype,`manualError`,void 0),i([v()],$.prototype,`moreSignInOpen`,void 0),i([v()],$.prototype,`nativeSessionCatalogsEnabled`,void 0),i([v()],$.prototype,`iconUrls`,void 0),i([v()],$.prototype,`setupRefreshWarning`,void 0),i([v()],$.prototype,`detectionError`,void 0),i([v()],$.prototype,`detectionRequest`,void 0),i([v()],$.prototype,`cancellationNotice`,void 0),customElements.get(`openclaw-model-setup-page`)||customElements.define(`openclaw-model-setup-page`,$)})))()}jn();export{$ as ModelSetupPage,Tt as resumeFirstRunActivation};
//# sourceMappingURL=model-setup-page-BCkUNwOT.js.map