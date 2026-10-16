import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,I as i,Nl as a,Sl as o,Tu as s,W as c,du as l,fu as ee,ju as u,kc as te,pu as ne}from"./control-ui-core-bJHyI7AF.js";import{La as re,Ra as ie,Ti as ae,Wr as oe,gr as d,ir as se,na as f,ra as p,rr as ce,wa as le,wi as ue,xr as de}from"./control-ui-core-DNh4McGE.js";import{$ as m,B as fe,F as pe,G as h,H as me,J as he,M as ge,R as _e,U as ve,V as g,W as ye,X as _,Y as v,Z as be,ct as y,et as xe,nt as Se,q as b,ut as x,z as Ce}from"./lit-runtime-DyST807n.js";import{d as S,l as we}from"./gateway-runtime-FZ6mX2RY.js";import{$ as Te,J as Ee,K as De,Y as Oe,_t as ke,q as Ae,yt as je}from"./control-ui-boot-shared-DsSYH3B6.js";import{Xr as Me,Zr as Ne,ii as C}from"./ui-DeikvIdP.js";import{A as w,O as Pe,k as T}from"./control-ui-boot-shared-ChxHeQUn.js";import{I as Fe,R as Ie,a as Le,bi as Re,di as E,fi as ze,l as Be,li as Ve,mi as He,o as Ue,pi as D,u as We,ui as O,xi as Ge}from"./control-ui-boot-shared-C9uJ732w.js";import{fs as Ke,os as qe}from"./control-ui-boot-shared-C1PHuQAX.js";import{_ as Je,g as Ye,v as Xe}from"./control-ui-boot-chat-CdE8XLfM.js";import{c as Ze,d as Qe,i as k,l as $e,n as et,o as A,r as tt,u as nt}from"./state-DyPB7Ff7.js";import{a as rt,i as it,o as at,s as ot}from"./wizard-login-controller-BzGhKgO8.js";import{a as st,c as ct,g as j,h as M,i as lt,r as ut,s as dt}from"./view-status-C5NU-OON.js";import{a as ft,i as pt,n as mt,o as ht,s as gt,t as N}from"./first-run-activation-receipt-BBTK8SvW.js";function P(e){return l(e,u(`modelSetup.errors.requestFailed`))}async function F(e,t){try{return{client:e,value:await t()}}catch(t){return{client:e,error:t}}}function I(){return(I=e((()=>{r(),ne()})))()}function L(e,t){return t?e.agentSelection:e.settingsAgentSelection}function R(e,t,n=null){let r=e.gateway.snapshot,i=L(e,t);return{client:r.client,hello:r.hello,agentId:i.state.selectedId,selectionIntentRevision:t?0:i.intentRevision,selectionPending:!t&&i.state.selectedId===null&&e.agents.state.agentsList===null,connected:r.phase===`connected`,firstRun:t,connectionRevision:e.gateway.connectionRevision,recoveryScope:r.phase===`connected`?r.hello?.auth?.recoveryScope??null:n}}function _t(e,t){let n=e&&(!t.recoveryScope||t.recoveryScope!==e.recoveryScope);return{authenticatedOwnerLost:n,ownerChanged:e&&(t.agentId!==e.agentId||t.selectionIntentRevision!==e.selectionIntentRevision||t.firstRun!==e.firstRun||t.connectionRevision!==e.connectionRevision||n)}}function vt(e,t){return e&&t.selectionPending&&t.selectionIntentRevision===e.selectionIntentRevision&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&(!t.connected||t.recoveryScope&&t.recoveryScope===e.recoveryScope&&d(t.hello?.auth??null))?{kind:e.selectionPending?`unchanged`:`pending`,connection:{...e,selectionPending:!0}}:{kind:e&&t.client===e.client&&t.hello===e.hello&&t.agentId===e.agentId&&t.connected===e.connected&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&t.recoveryScope===e.recoveryScope&&t.selectionIntentRevision===e.selectionIntentRevision&&t.selectionPending===e.selectionPending?`unchanged`:`changed`,connection:t}}var z;function B(){return(B=e((()=>{de(),r(),c(),pt(),I(),A(),z=class{constructor(e){this.host=e,this.generation=0,this.started=!1,this.readyConnection=null,this.pending=null}subscribe(e){return gt(t=>{let n=this.pending;n?.receipt&&JSON.stringify(n.receipt)===t&&(this.pending=null,n.outcome===`pending`&&this.host.closeWizard(),n.outcome===`verified`&&this.host.setActivationState({phase:`idle`}),this.host.setVerifyState({phase:`idle`}),e())})}setReadyConnection(e){this.readyConnection=e}routeChanged(){let e=this.pending?.receipt??null;this.reset(),this.readyConnection=null,this.pending=null,this.host.routeData()?.firstRun===!1&&N(e)}connectionChanged(e){if(this.reset(),this.readyConnection=null,this.pending&&(!this.pending.owner.recoveryScope||e.agentId!==this.pending.owner.connection.agentId||this.host.context().gateway.connectionRevision!==this.pending.owner.connectionRevision||this.host.context().gateway.snapshot.phase===`connected`&&(e.hello?.auth?.recoveryScope??null)!==this.pending.owner.recoveryScope)){let e=this.pending.receipt;this.pending=null,N(e)}}reconnectActivation(e){let t=this.pending;if(!t)return;let n=this.host.context();t.owner.recoveryScope&&t.owner.connectionRevision===n.gateway.connectionRevision&&t.owner.recoveryScope===(e.hello?.auth?.recoveryScope??null)&&t.owner.connection.agentId===e.agentId&&t.owner.firstRun===this.host.routeData()?.firstRun&&(t.owner=this.owner(t.owner.firstRun))}retryDetection(){if(this.host.actionsDisabled())return!1;if(this.pending?.outcome===`missing`)return!0;if(this.pending&&Date.now()<this.pending.deadlineMs)return this.host.setRefreshWarning(u(`modelSetup.recovery.wait`,{time:i(this.pending.deadlineMs)})),!0;if(this.host.routeData()?.firstRun){let e=this.host.pageState(),t=this.pending&&e.phase===`ready`&&this.configuredActivationModel(e.result);this.pending=null,N(),this.host.setRefreshWarning(null),this.reset(),this.started=!!t}return!0}wizardMissing(){this.pending&&this.ownsActivation()&&(this.pending.outcome=`missing`)}reconcileMissingWizard(e){let t=this.pending;t?.outcome===`missing`&&this.ownsActivation(t)&&(this.host.setRefreshWarning(null),this.configuredActivationModel(e)||(this.pending=null,N(t.receipt)))}dispose(){this.reset(),this.readyConnection=null,this.pending=null}visiblePageState(e){let t=this.host.pageState();return this.host.routeData()?.firstRun&&t.phase===`ready`&&t.result.setupComplete&&t.result.configuredModel&&!e?{...t,result:{...t.result,setupComplete:!1}}:t}start(){let e=this.host.routeData(),t=this.host.context(),n=t.gateway.snapshot,r=this.host.pageState(),i=this.readyConnection;if(!e?.firstRun||this.started||r.phase!==`ready`||!i||i.client!==n.client||i.hello!==n.hello||i.agentId!==t.agentSelection.state.selectedId||this.host.actionsDisabled()||!this.host.canUseSetup(n.client))return;let a=ht(t);this.pending?.receipt&&a?.owner!==this.pending.receipt.owner&&(this.pending=null);let o=a??this.pending;if(o&&(this.pending={owner:this.owner(e.firstRun),modelRef:o.modelRef,...o.modelTarget?{modelTarget:o.modelTarget}:{},kind:o.kind,deadlineMs:o.deadlineMs,receipt:a,outcome:`pending`}),!this.pending){this.started=!0;return}let s=this.configuredActivationModel(r.result);if(!this.pending.modelRef&&a?.wizard){this.started=!0,this.host.resumeWizard(a.wizard,this.observeActivation(this.pending));return}if(this.pending&&(!s||!this.pending.modelRef)){this.started=!0,this.showUnresolved();return}if(s&&!this.host.canVerify(n.client)){this.started=!0,this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${u(`modelSetup.access.gatewayTooOld`)}. ${u(`updates.confirm.action`)}. ${u(`desktop.reconnect`)}.`});return}this.started=!0,this.run(this.owner(e.firstRun),r.result)}beginActivation(e){let t=this.host.routeData();if(!t?.firstRun)return null;let n=this.owner(t.firstRun),r=ft(this.host.context(),e);return this.pending={owner:n,kind:e.kind,modelRef:e.modelRef??null,...e.modelTarget?{modelTarget:e.modelTarget}:{},receipt:r,outcome:`pending`,deadlineMs:r?.deadlineMs??mt(e.kind)},this.started=!0,this.pending}recordActivation(e,t){if(!e)return;if(t.status===`cancelled`||t.status===`not-admitted`||t.status===`error`&&t.activationRejection?.disposition===`rejected-before-promotion`){this.ownsActivation(e)&&(e.outcome=`rejected`),N(e.receipt),this.pending===e&&(this.pending=null);return}let n=t.status===`done`?t.modelActivation?.modelRef:void 0;n&&this.pending===e&&this.ownsActivation(e)&&(e.modelRef=n,e.modelTarget=t.status===`done`?t.modelActivation?.modelTarget:void 0,e.outcome=`verified`,e.receipt=ft(this.host.context(),e))}observeActivation(e){return t=>(this.recordActivation(e,t),this.host.notify(),()=>this.ownsActivation(e))}finishActivation(e,t,n){this.pending&&this.ownsActivation()&&e.ok&&e.modelRef&&(e.gatewayRestartRequired?(this.host.setActivationState({phase:`testing`,targetId:t}),this.host.setRefreshWarning(n??u(`updates.dialog.restarting`))):n||this.completeNavigation())}get unresolved(){return this.pending!==null}get canUseCurrentModel(){let e=this.host.pageState();return this.pending!==null&&e.phase===`ready`&&!!this.configuredActivationModel(e.result)}async useCurrentModel(){let e=this.host.pageState(),t=this.pending;if(!t||e.phase!==`ready`||!this.configuredActivationModel(e.result)||this.host.actionsDisabled())return;let n=this.configuredActivationModel(e.result),r=this.owner(t.owner.firstRun),i=await this.verify();!this.owns(r)||this.pending!==t||!i||`error`in i||(i.value.ok&&i.value.modelRef===n&&i.value.modelTarget===t.modelTarget?this.completeNavigation():i.value.ok&&this.showUnresolved())}owner(e){let t=R(this.host.context(),e);return{generation:this.generation,firstRun:e,connectionRevision:t.connectionRevision,recoveryScope:t.recoveryScope,connection:t}}clearPending(){this.pending=null,N()}ownsActivation(e=this.pending){return e?this.owns(e.owner)?e.outcome===`rejected`?this.pending===null:this.pending===e&&(!e.receipt||ht(this.host.context(),e.receipt)!==null)&&Date.now()<e.deadlineMs:!1:!this.host.routeData()?.firstRun}async verify(){let e=this.host.routeData();if(!e)return;let t=this.owner(e.firstRun),n=this.pending,r=await this.host.verify(n?.modelTarget);if(this.owns(t)&&r){if(this.pending!==n||n&&!this.ownsActivation(n)){this.host.setVerifyState({phase:`idle`});return}return this.host.setVerifyState(`error`in r?{phase:`failed`,status:`unknown`,error:P(r.error)}:$e(r.value)),r}}continueSetup(e){if(this.pending)this.pending.outcome===`verified`&&this.ownsActivation()&&this.completeNavigation();else{let t=this.host.pageState(),n=this.host.activationState();e===`utility`||n.phase===`success`&&n.modelTarget===`utility`||t.phase===`ready`&&t.result.setupModel?this.host.context().navigate(`custodian`,t.phase===`ready`&&!t.result.configuredModel?{search:`?onboarding=1`}:{}):this.host.context().navigate(`chat`)}}completeNavigation(){this.clearPending(),this.host.setRefreshWarning(null),this.host.context().navigate(`custodian`,{search:`?onboarding=1`})}showUnresolved(){this.host.setRefreshWarning(null),this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${u(`modelSetup.errors.activationFailed`)} ${this.pending?.modelRef??``}`.trim()})}reset(){this.generation+=1,this.started=!1}owns(e){let t=this.host.context(),n=t.gateway.snapshot;return e.generation===this.generation&&e.connectionRevision===t.gateway.connectionRevision&&e.recoveryScope===(n.hello?.auth?.recoveryScope??null)&&e.firstRun===this.host.routeData()?.firstRun&&n.phase===`connected`&&n.client===e.connection.client&&n.hello===e.connection.hello&&L(t,e.firstRun).state.selectedId===e.connection.agentId}async run(e,t){let n=this.configuredActivationModel(t);if(n){if(this.pending&&n!==this.pending.modelRef){this.showUnresolved();return}let t=await this.verify();if(!this.owns(e)||!t||`error`in t)return;t.value.ok&&this.finishVerified(t.value.modelRef,t.value.modelTarget)}}configuredActivationModel(e){return this.pending?.modelTarget===`utility`?e.utilityModel??e.setupModel:e.setupComplete?e.configuredModel:void 0}finishVerified(e,t){this.pending?this.pending.modelRef===e&&this.pending.modelTarget===t?this.completeNavigation():this.showUnresolved():this.host.context().navigate(`chat`)}}})))()}function V(e){return e.brandId&&Ve(e.brandId)?e.brandId:null}function H(e,t,n=``){let r=V(t);if(r)return D(r,{className:`model-setup__icon ${n}`.trim()});let i=t.icon?e.iconUrls[t.icon]:void 0;return!t.icon||!i?He(t.label,{className:`model-setup__icon ${n}`.trim()}):m`<img
    class=${`model-setup__icon ${n}`.trim()}
    src=${i}
    alt=${t.label}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t.icon)}
  />`}var U;function W(){return(W=e((()=>{v(),O(),Ke(),Je(),U=class{constructor(e,t,n){this.getPageState=t,this.loader=new Ye({getFetchContext:()=>Xe(e()),isConnected:t=>e().gateway.snapshot.phase===`connected`&&this.currentIconUrls().has(t),fetchIcon:(e,t,n)=>qe({iconUrl:e,...t,signal:n}),timeoutError:()=>new DOMException(`catalog icon fetch timed out`,`TimeoutError`),onUrlsChange:n})}reconcile(){let e=this.currentIconUrls();this.loader.reconcileKeys(e);for(let t of e)this.loader.load(t)}invalidate(e){this.loader.handleError(e)}reset(){this.loader.reset()}currentIconUrls(){let e=this.getPageState();if(e.phase!==`ready`)return new Set;let t=e.result;return new Set([...t.candidates,...t.manualProviders,...t.authOptions??[],...t.prepareOptions??[],...t.recommendedInstalls??[]].flatMap(e=>e.icon&&!V(e)?[e.icon]:[]))}}})))()}function G(e){return m`
    <section class="settings-section" data-native-model-setup>
      <div class="settings-section__header"><h2>${u(`modelSetup.nativeModels.title`)}</h2></div>
      <p class="muted">${u(`modelSetup.nativeModels.body`)}</p>
      ${e}
    </section>
  `}function yt(){return G(m`
    <div class="model-picker"><span class="picker-select__trigger skeleton"></span></div>
    <span class="btn skeleton">${`\xA0`}</span>
  `)}var K;function q(){return(q=e((()=>{v(),Le(),O(),r(),je(),De(),o(),I(),K=class{constructor(e,t){this.host=e,this.options=t,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.generation=0,this.nativeModelsAbort=null,this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}get count(){return this.nativeModels.length}reset(){this.generation+=1,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.nativeModelsAbort?.abort(),this.nativeModelsAbort=null,this.nativeModelsUnsubscribe?.(),this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}async useNativeModel(){let e=this.options.getConnection(),t=this.generation,n=()=>this.generation===t&&this.options.getConnection()===e,r=this.options.getContext(),i=r.gateway.snapshot.client,o=e?.agentId??a(r.gateway.snapshot)?.defaultAgentId,s=this.nativeModels.find(e=>`${e.provider}/${e.id}`===this.nativeModel);if(!this.options.canUseSetup(i)||!o||s?.available!==!0||this.saving||this.options.blocked())return;this.saving=!0,this.host.requestUpdate(),this.nativeModelError=null;let c=`${s.provider}/${s.id}`;try{let e=await r.runtimeConfig.runExternalMutation(e=>e.request(`agents.update`,{agentId:o,model:c,agentRuntime:s.agentRuntime?.id}),{canDispatch:()=>n()&&this.options.canUseSetup(i)});if(!n())return;if(!e.ok){this.nativeModelError=e.error;return}if(!e.refresh.ok){this.nativeModelError=e.refresh.error;return}await r.agents.refreshList(),n()&&this.options.onSelected()}catch(e){n()&&(this.nativeModelError=P(e))}finally{n()&&(this.saving=!1,this.host.requestUpdate())}}applyNativeCatalog(e){this.nativeModels=e.models.filter(e=>e.agentRuntime&&e.agentRuntime.id!==`openclaw`),this.nativeModelsStatus=e.pendingProviders?.length?`loading`:`ready`,this.nativeCatalogError=Ee(e),this.nativeModels.some(e=>`${e.provider}/${e.id}`===this.nativeModel)||(this.nativeModel=``)}async loadNativeModels(e=!0){let t=this.options.getConnection(),n=this.options.getContext(),r=n.gateway.snapshot.client;if(!r||!this.options.canUseSetup(r))return;let i={view:`all`,agentId:t?.agentId??void 0},a=Oe(r,i,{allowStale:!0});a&&this.applyNativeCatalog(a),this.nativeModelsUnsubscribe??=Te(n.gateway,()=>void this.loadNativeModels(!1),i),this.nativeModelsAbort?.abort();let o=new AbortController;this.nativeModelsAbort=o,e&&(this.nativeCatalogError=null),this.nativeModelsStatus=`loading`,this.host.requestUpdate();try{let n=await Ae(r,{...i,refresh:e,signal:o.signal});if(this.options.getConnection()!==t||o.signal.aborted)return;this.applyNativeCatalog(n)}catch(e){this.options.getConnection()===t&&!o.signal.aborted&&(this.nativeModelsStatus=`ready`,this.nativeCatalogError=P(e))}finally{this.nativeModelsAbort===o&&(this.nativeModelsAbort=null,this.host.requestUpdate())}}render(){let e=this.nativeModels,t=e.find(e=>`${e.provider}/${e.id}`===this.nativeModel);return G(m`
      ${this.nativeModelsStatus===`loading`?m`<p role="status">${u(`modelSetup.nativeModels.loading`)}</p>`:_}
      ${this.nativeModelsStatus===`ready`&&e.length===0&&!this.nativeCatalogError?m`<p role="status">${u(`modelSetup.nativeModels.empty`)}</p>`:_}
      ${Ue({label:u(`modelSetup.nativeModels.choose`),value:this.nativeModel,options:e.map(e=>({value:`${e.provider}/${e.id}`,label:e.name,provider:e.provider,detail:e.available===!0?E(e.provider):ke(e.unavailableReason)??(this.nativeModelsStatus===`loading`&&e.available===void 0?u(`modelSetup.nativeModels.loading`):e.available===!1?u(`chat.modelControls.modelsUnavailable`):u(`modelSetup.nativeModels.unconfirmed`)),disabled:e.available!==!0})),disabled:this.options.blocked()||this.saving,onChange:e=>{this.nativeModel=e,this.host.requestUpdate()},onOpen:()=>{this.nativeModelsAbort||this.loadNativeModels(this.nativeModelsStatus===`idle`)}})}
      <button
        class="btn primary"
        ?disabled=${this.options.blocked()||this.saving||t?.available!==!0}
        @click=${()=>void this.useNativeModel()}
      >
        ${u(this.saving?`modelSetup.nativeModels.saving`:`modelSetup.nativeModels.use`)}
      </button>
      ${this.nativeModelError?m`<div class="callout danger" role="alert">${this.nativeModelError}</div>`:_}
      ${this.nativeCatalogError?m`
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
            `:_}
    `)}}})))()}function bt({kind:e,modelRef:t,modelTarget:n}){return{kind:e,modelRef:t,...n?{modelTarget:n}:{}}}function J(e){return`provider-auto:${encodeURIComponent(e)}`}function xt(e,t){return{kind:J(e.id),modelRef:t,...e.modelTarget?{modelTarget:e.modelTarget}:{}}}function St(e){return(e.prepareOptions??[]).filter(t=>!e.candidates.some(e=>e.credentials!==!1&&(e.kind===J(t.id)||e.modelRef.startsWith(`${t.brandId??t.id}/`))))}function Ct(e,t){return e.candidates.find(e=>e.kind===J(t)&&e.credentials!==!1)}function wt(e,t,n){let r=e.find(e=>e.id===t),i=n.trim();return r&&i?{kind:`api-key`,authChoice:r.id,apiKey:i,...r.modelTarget?{modelTarget:r.modelTarget}:{}}:null}function Tt(e){let t=e.querySelector(`.model-setup__manual input[type="password"]`);e.querySelector(`openclaw-modal-dialog`)?.setReturnFocusTarget(t),t?.scrollIntoView?.({block:`nearest`,behavior:`auto`})}function Et(e){let t=e.currentTarget;if(t.open){if(e.key===`Tab`){e.preventDefault(),e.stopPropagation();let n=e.shiftKey?t.querySelector(`[slot="trigger"]`):t.closest(`.model-setup__manual`)?.querySelector(`input[type="password"]`);t.addEventListener(`wa-after-hide`,()=>n?.focus({preventScroll:!0}),{once:!0}),t.open=!1;return}e.key===`Escape`&&(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>t.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}))}}function Dt(e,t,n){let r=e.detail.item,i=e.currentTarget,a=r.value??r.getAttribute(`value`);if(a){if(a!==t){i.addEventListener(`wa-after-hide`,()=>i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}),n(a);return}e.preventDefault(),r.checked=!0,i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),i.open=!1}}function Y(e){return e.groupLabel?.trim()||e.label}function Ot(e){let t=e.label.trim();return t===Y(e)?void 0:t}function kt(e,t,n){let r=n?Ot(n):void 0,i=n?[Y(n),r].filter(Boolean).join(`, `):u(`modelSetup.manual.selectProvider`);return m`
    <wa-dropdown
      class="model-setup-provider-select"
      placement="bottom-start"
      aria-label=${u(`modelSetup.manual.provider`)}
      @wa-select=${t=>Dt(t,e.manualProviderId,e.onManualProviderChange)}
      @keydown=${Et}
    >
      <button
        slot="trigger"
        type="button"
        class="model-setup-provider-select__trigger"
        aria-label=${`${u(`modelSetup.manual.provider`)}: ${i}`}
        ?disabled=${e.actionsDisabled||t.manualProviders.length===0}
      >
        ${n?H(e,n,`model-setup__icon--picker`):m`<span class="model-setup-provider-select__placeholder-icon" aria-hidden="true">
                ${f.key}
              </span>`}
        <span class="model-setup-provider-select__copy">
          <strong>
            ${n?Y(n):u(`modelSetup.manual.selectProvider`)}
          </strong>
          ${n?r?m`<span>${r}</span>`:_:m`<span>${u(`modelSetup.manual.selectProviderHint`)}</span>`}
        </span>
        <span class="model-setup-provider-select__chevron" aria-hidden="true">
          ${f.chevronDown}
        </span>
      </button>
      ${t.manualProviders.toSorted((e,t)=>Y(e).localeCompare(Y(t))).map(t=>{let n=t.id===e.manualProviderId,r=Ot(t),i=[Y(t),r,t.hint].filter(Boolean).join(`, `);return m`
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
              ${pe(e=>Ge(e,n))}
            >
              <span slot="icon">
                ${H(e,t,`model-setup__icon--picker`)}
              </span>
              <span class="model-setup-provider-select__copy">
                <strong>${Y(t)}</strong>
                ${r?m`<span>${r}</span>`:_}
                ${t.hint?m`<small>${t.hint}</small>`:_}
              </span>
            </wa-dropdown-item>
          `})}
    </wa-dropdown>
  `}function X(){return(X=e((()=>{v(),ge(),p(),Re(),r(),W()})))()}function At(e,t){return new T(e,{autoRun:!1,args:()=>[null,null,null],task:async([e,n,r],{signal:i})=>{if(!e||!r)return w;let a=t.getHello();return{...await F(e,()=>e.request(`openclaw.setup.detect`,n?{agentId:n}:{},{timeoutMs:et,signal:i})),agentId:n,hello:a,token:r}},onComplete:t.onComplete})}function jt(e){return new T(e,{autoRun:!1,args:()=>[null,null,void 0],task:async([e,t,n],{signal:r})=>e?F(e,()=>e.request(`openclaw.setup.verify`,{...t?{agentId:t}:{},...n?{modelTarget:n}:{}},{timeoutMs:tt,signal:r})):w})}function Mt(){return(Mt=e((()=>{Pe(),I(),A()})))()}var Z,Nt;function Pt(){return(Pt=e((()=>{xe(),fe(),ve(),Z=e=>me(e)?e._$litType$.h:e.strings,Nt=_e(class extends Ce{constructor(e){super(e),this.et=new WeakMap}render(e){return[e]}update(e,[t]){let n=h(this.it)?Z(this.it):null,r=h(t)?Z(t):null;if(n!==null&&(r===null||n!==r)){let t=g(e).pop(),r=this.et.get(n);if(r===void 0){let e=document.createDocumentFragment();r=be(_,e),r.setConnected(!1),this.et.set(n,r)}b(r,[t]),he(r,void 0,t)}if(r!==null){if(n===null||n!==r){let t=this.et.get(r);if(t!==void 0){let n=g(t).pop();ye(e),he(e,void 0,n),b(e,[n])}}this.it=t}else this.it=void 0;return this.render(t)}})})))()}function Ft(){return(Ft=e((()=>{Pt()})))()}function It(e){if(e.modelTarget===`utility`)return u(`modelSetup.utility.role`);let t=e.kind.startsWith(`saved-auth:`)?`detected`:e.recommended?`recommended`:e.credentials===void 0?`detected`:e.credentials?`credentialsReady`:`signInNeeded`;return u(`modelSetup.candidates.${t}`)}function Lt(e,t){let n=t.candidates.filter(e=>!(e.modelTarget===`utility`&&!e.kind.startsWith(`saved-auth:`)&&e.modelRef===(t.utilityModel??t.setupModel))&&(!t.configuredModel||e.kind!==`existing-model`&&(e.kind.startsWith(`saved-auth:`)||e.modelRef!==t.configuredModel)));return n.length===0?_:m`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${n.toSorted((e,t)=>e.label.localeCompare(t.label)).map(n=>{let r=e.activation.phase===`testing`&&e.activation.targetId===k(n.kind,n.modelRef),i=e.activation.phase===`failure`&&e.activation.targetId===k(n.kind,n.modelRef)?e.activation:null;return m`
              <div class="model-setup__row" data-candidate-kind=${n.kind}>
                <div class="model-setup__row-main">
                  <div class="model-setup__row-title">
                    ${H(e,n)}
                    <strong>${n.label}</strong>
                    <span class="model-setup__chip">${It(n)}</span>
                  </div>
                  <div class="muted">
                    ${n.modelRef} · ${ee(n.detail)}
                  </div>
                  ${n.modelTarget===`utility`?m`<div class="muted">${u(`modelSetup.utility.hint`)}</div>`:_}
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
  `}function Rt(){return(Rt=e((()=>{v(),r(),M(),ne(),W(),A(),j()})))()}function zt(e){let t=e.result.utilityModel??e.result.setupModel;if(!t)return _;let n=e.canRepair?e.result.candidates.find(e=>e.modelTarget===`utility`&&e.modelRef===t&&e.kind.startsWith(`provider-auto:`)):void 0,r=n&&e.activation.phase===`testing`&&e.activation.targetId===k(n.kind,n.modelRef);return m`<section class="settings-section model-setup__utility">
    <div class="settings-section__header"><h2>${u(`modelSetup.utility.configured`)}</h2></div>
    <div class="model-setup__row">
      <div class="model-setup__row-main">
        <strong>${t}</strong>
        <div class="muted">
          ${u(e.result.configuredModel?`modelSetup.utility.primaryReady`:`modelSetup.utility.choosePrimary`)}
        </div>
      </div>
      <div class="model-setup__row-actions">
        ${n?m`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onActivateCandidate(n)}
              >
                ${u(r?`modelSetup.candidates.testingButton`:`modelSetup.utility.repair`)}
              </button>`:_}
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
  </section>`}function Bt(e,t){let n=Kt[e]??`unknown`;return m`
    <div class="model-setup__failure" role="alert">
      <span class="model-setup__failure-icon" aria-hidden="true">${f.alertTriangle}</span>
      <span
        ><strong>${u(`modelSetup.failure.${n}`)}.</strong> ${t}
        ${n===`unavailable`?_:u(`modelSetup.failureGuidance.${n}`)}</span
      >
    </div>
  `}function Vt(e){let t=e.indexOf(`/`);return t<0?e:e.slice(t+1)}function Ht(e,t){let n=Vt(t),r=e?.detail.trim();return!r||e?.kind===`existing-model`?n:r.toLowerCase().includes(n.toLowerCase())?r:`${n} · ${r}`}function Ut(e){switch(e.phase){case`checking`:return u(`modelSetup.verify.checkingButton`);case`failed`:return u(`modelSetup.verify.retry`);case`ok`:return u(`modelSetup.verify.checkAgain`);default:return u(`modelSetup.verify.button`)}}function Wt(e){let t=e.result.configuredModel,n=e.verify.phase===`ok`?e.verify.modelRef:t,r=ze(n),i=n===t?e.result.candidates.find(e=>e.modelRef===t&&!e.kind.startsWith(`saved-auth:`)):void 0,a=r?E(r):n,o=Ht(i,n);return m`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${u(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__provider-copy">
          ${r?D(r,{className:`model-setup__icon`}):_}
          <div class="model-setup__current-copy">
            <strong>${a}</strong>
            <div class="muted">${o}</div>
            ${e.verify.phase===`checking`?m`<div class="model-setup__testing" role="status">
                    ${u(`modelSetup.verify.checking`,{modelRef:t})}
                  </div>`:e.verify.phase===`ok`?m`<div class="model-setup__verified" role="status">
                      ${e.verify.latencyMs===void 0?u(`modelSetup.verify.ready`):u(`modelSetup.verify.readyIn`,{latencyMs:String(e.verify.latencyMs)})}
                    </div>`:e.verify.phase===`failed`?Bt(e.verify.status,e.verify.error):_}
          </div>
        </div>
        <div class="model-setup__row-actions">
          ${e.canVerify?m`<button
                  type="button"
                  class="btn"
                  ?disabled=${e.actionsDisabled}
                  @click=${e.onVerify}
                >
                  ${Ut(e.verify)}
                </button>`:_}
          ${e.onContinue?m`<button type="button" class="btn primary" @click=${e.onContinue}>
                  ${f.messageSquare} ${u(`modelSetup.success.continueSetup`)}
                </button>`:_}
        </div>
      </div>
    </section>
  `}function Gt(e){return e.phase===`testing`?m`<div class="model-setup__testing" role="status">${u(`modelSetup.testing`)}</div>`:e.phase===`failure`?Bt(e.status,e.error):_}var Kt;function qt(){return(qt=e((()=>{v(),p(),O(),r(),M(),A(),j(),Kt={auth:`auth`,rate_limit:`rateLimit`,billing:`billing`,timeout:`timeout`,format:`format`,unavailable:`unavailable`,unknown:`unknown`}})))()}function Q(e){return m`
    <section class=${`settings-section ${e.className??``}`.trim()}>
      <div class="settings-section__header"><h2>${e.title}</h2></div>
      ${e.intro?m`<p class="muted model-setup__loading-intro">${e.intro}</p>`:_}
      <div class="model-setup__rows">
        ${Array.from({length:e.rows??1},(t,n)=>m`
            <div class="model-setup__row model-setup__loading-row">
              <span class="model-setup__loading-icon skeleton"></span>
              <span class="model-setup__loading-copy">
                ${n===0&&e.status?m`<span class="model-setup__loading-status">${e.status}</span>`:m`<span class="skeleton skeleton-line skeleton-line--medium"></span>`}
                <span class="skeleton skeleton-line skeleton-line--long"></span>
              </span>
              <span class="model-setup__loading-action skeleton"></span>
            </div>
          `)}
      </div>
    </section>
  `}function Jt(e){return m`
    <div
      class="model-setup__loading"
      role="status"
      aria-busy="true"
      aria-label=${u(`modelSetup.loading`)}
    >
      <div class="model-setup__loading-sections" aria-hidden="true">
        ${e?Q({title:u(`modelSetup.verify.title`),className:`model-setup__loading-section--selected`,status:u(`modelSetup.loading`)}):_}
        ${yt()}
        ${Q({title:u(`modelSetup.candidates.title`),className:`model-setup__loading-section--candidates`,status:e?void 0:u(`modelSetup.loading`)})}
        ${Q({title:u(`modelSetup.prepare.title`),intro:u(`modelSetup.prepare.intro`),rows:2})}
        ${Q({title:u(`modelSetup.signIn.title`),className:`model-setup__loading-section--sign-in`})}
        ${Q({title:u(`modelSetup.manual.title`)})}
      </div>
    </div>
  `}function Yt(){return(Yt=e((()=>{v(),r(),M(),q(),j()})))()}function Xt(e,t,n,r,i=!1){let a=ze(e.modelRef),o=a&&Ve(a)?a:null,s=e.modelTarget===`utility`,c=u(s?`modelSetup.utility.ready`:`modelSetup.success.title`),l=e.warning??u(s?`modelSetup.utility.verified`:`modelSetup.success.body`,{modelRef:e.modelRef}),ee=s?u(`modelSetup.utility.openAssistant`):i?u(`modelSetup.discovery.returnToModels`):r?u(`modelSetup.success.continueSetup`):e.warning?u(`tabs.chat`):u(`modelSetup.success.openChat`);return m`
    <openclaw-modal-dialog label=${c} description=${l} @modal-cancel=${n}>
      <section class="model-setup-success" role="status">
        <div
          class=${`model-setup-success__icon${o?` model-setup-success__icon--provider`:``}`}
          aria-hidden="true"
        >
          ${o?m`
                  ${D(o,{className:`model-setup-success__provider-icon`})}
                  <span class="model-setup-success__status-badge">${f.check}</span>
                `:f.shieldCheck}
        </div>
        <div class="model-setup-success__copy">
          <h2>${c}</h2>
          ${e.warning?_:m`<p>${l}</p>`}
        </div>
        ${e.warning?m`<div class="model-setup-success__warning">${e.warning}</div>`:_}
        <div class="model-setup-success__summary">
          <span>${u(s?`modelSetup.utility.model`:`modelSetup.success.activeModel`)}</span>
          <strong>${e.modelRef}</strong>
          ${e.latencyMs===void 0?_:m`<span>
                  ${u(`modelSetup.success.latency`,{latencyMs:String(e.latencyMs)})}
                </span>`}
        </div>
        <footer class="model-setup-success__actions">
          ${i&&!s?_:m`<button type="button" class="btn" @click=${n}>
                  ${u(`modelSetup.success.stayHere`)}
                </button>`}
          <button type="button" class="btn primary" autofocus @click=${t}>
            ${i&&!s?_:f.messageSquare} ${ee}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}function Zt(){return(Zt=e((()=>{v(),p(),oe(),O(),r(),M(),j()})))()}function Qt(e,t){let n=t.recommendedInstalls??[];return e.nativeModels?.count||t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?_:m`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${u(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>m`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${H(e,t,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function $t(e,t){let n=`kind`in t,r=n?t.groupLabel:void 0;return m`
    <div
      class="model-setup__row"
      data-auth-choice=${n?t.id:_}
      data-prepare-choice=${n?_:t.id}
    >
      <div class="model-setup__provider-copy">
        ${H(e,t)}
        <div>
          <strong>${t.label}</strong>
          ${r?m`<div class="muted">${r}</div>`:_}
          ${t.hint?m`<div class="muted">${t.hint}</div>`:_}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled||e.detecting}
        @click=${()=>n?e.onStartAuth(t):e.onStartPrepare(t)}
      >
        ${n?u(t.kind===`install`?`modelSetup.signIn.install`:t.kind===`custom`?`modelSetup.signIn.custom`:`modelSetup.signIn.verify`):t.actionLabel??u(`modelSetup.prepare.ollamaButton`)}
      </button>
    </div>
  `}function en(e,t){let n=(t.authOptions??[]).filter(t=>!e.embedded||!e.credentialChoices?.includes(t.id)).toSorted((e,t)=>e.label.localeCompare(t.label));if(n.length===0)return _;let r=n.filter(e=>e.featured||e.kind===`install`||e.kind===`custom`),i=n.filter(e=>!r.includes(e)),a=t=>$t(e,t);return m`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.signIn.title`)}</h2>
        <p>${u(`modelSetup.signIn.description`)}</p>
      </div>
      <div class="model-setup__rows">${r.map(a)}</div>
      ${i.length?m`<details
              class="model-setup__more"
              .open=${e.moreSignInOpen}
              @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
            >
              <summary>${u(`modelSetup.signIn.more`)}</summary>
              <div class="model-setup__rows">${i.map(a)}</div>
            </details>`:_}
    </section>
  `}function tn(e,t){if(!e.canPrepare)return _;let n=St(t);return n.length===0?_:m`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.prepare.title`)}</h2>
      </div>
      <p class="muted">${u(`modelSetup.prepare.intro`)}</p>
      <div class="model-setup__rows">
        ${n.map(t=>$t(e,t))}
      </div>
    </section>
  `}function nn(e,t){let n=e.embedded?{...t,manualProviders:t.manualProviders.filter(t=>!e.credentialChoices?.includes(t.id))}:t;if(n.manualProviders.length===0&&e.embedded)return _;let r=n.manualProviders.find(t=>t.id===e.manualProviderId),i=`manual:${e.manualProviderId}`,a=e.embedded?`model-discovery-manual`:`model-setup-manual`,o=e.activation.phase===`testing`&&e.activation.targetId===i;return m`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${u(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <div class="field">
          <span>${u(`modelSetup.manual.provider`)}</span>
          ${kt(e,n,r)}
        </div>
        <label class="field">
          <span>
            ${r?u(`modelSetup.manual.accessValueFor`,{provider:Y(r)}):u(`modelSetup.manual.accessValue`)}
          </span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            required
            aria-invalid=${e.manualError?`true`:_}
            aria-describedby=${`${a}-help${e.manualError?` ${a}-error`:``}`}
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${u(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        <div id=${`${a}-help`} class="model-setup__manual-help">
          ${f.shieldCheck}
          <span>${u(`modelSetup.manual.verifyHint`)}</span>
        </div>
        ${e.manualError?m`<div id=${`${a}-error`} class="callout danger" role="alert">
                ${e.manualError}
              </div>`:_}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||e.detecting||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${u(o?`modelSetup.candidates.testingButton`:e.embedded?`modelSetup.discovery.connectForAgent`:`modelSetup.manual.connectAndVerify`)}
        </button>
      </div>
    </section>
  `}function rn(e){e.querySelector(`.model-setup > .model-setup__testing, .model-setup > .model-setup__failure`)?.scrollIntoView?.({block:`nearest`,behavior:`auto`})}function an(e,t){return t.nativeSessionCatalogPreferenceRequired!==!0||!t.nativeSessionCatalogs?.length?_:m`
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
  `}function on(e,t){let n=e.firstRun&&t.setupComplete&&e.activation.phase!==`success`?e.onOpenChat:void 0,r=!e.embedded&&t.configuredModel?Wt({result:t,verify:e.verify.phase===`ok`&&e.verify.modelTarget===`utility`?{phase:`idle`}:e.verify,canVerify:e.canVerify,actionsDisabled:e.actionsDisabled||e.detecting===!0,onVerify:e.onVerify,onContinue:n}):_,i=m`${r}${zt({result:t,activation:e.activation,canRepair:e.canAdmin&&!e.gatewayTooOld,actionsDisabled:e.actionsDisabled||e.detecting===!0||e.activationUnresolved===!0,onOpenAssistant:e.onOpenSetupAssistant??e.onOpenChat,onActivateCandidate:e.onActivateCandidate})}`;return e.canAdmin?e.gatewayTooOld?m`${i}
      <div class="callout warning" role="note">${u(`modelSetup.access.gatewayTooOld`)}</div>`:m`
    ${i} ${an(e,t)} ${Qt(e,t)}
    ${e.nativeModels?.render()} ${Lt(e,t)}
    ${tn(e,t)} ${en(e,t)} ${nn(e,t)}
  `:m`${i}
      <div class="callout warning" role="note">${u(`modelSetup.access.adminRequired`)}</div>`}function sn(e){let t;e.page.phase===`ready`?t=on({...e,actionsDisabled:e.actionsDisabled||e.activationUnresolved===!0},e.page.result):e.canAdmin?e.gatewayTooOld?t=m`<div class="callout warning" role="note">
      ${u(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=e.embedded?m`<div class="model-setup__loading" role="status">${u(`modelSetup.loading`)}</div>`:Jt(e.modelConfigured===!0):e.page.phase===`detect-error`&&(t=m`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" ?disabled=${e.detecting} @click=${e.onDetect}>
        ${u(`modelSetup.retry`)}
      </button>
    `):t=m`<div class="callout warning" role="note">
      ${u(`modelSetup.access.adminRequired`)}
    </div>`;let n=m`
    <div
      class="model-setup"
      aria-busy=${e.detecting||e.page.phase===`loading`?`true`:`false`}
    >
      <div class="model-setup__intro">
        <div>
          ${e.embedded?m`<h2>${u(`modelSetup.discovery.title`)}</h2>
                  <p>
                    ${u(`modelSetup.discovery.description`,{agent:e.agentLabel??``})}
                  </p>`:m`<h1>${u(`modelSetup.heading`)}</h1>
                  <p>${u(`modelSetup.intro`)}</p>`}
        </div>
        ${e.connection?lt(e.connection,!0):_}
        ${e.page.phase===`ready`&&(e.embedded||!e.page.result.configuredModel)&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?m`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled||e.detecting}
                @click=${e.onDetect}
              >
                ${e.detecting?u(`modelSetup.verify.checkingButton`):u(`modelSetup.checkAgain`)}
              </button>`:_}
      </div>
      ${e.canAdmin&&!e.gatewayTooOld?Gt(e.activation):_}
      ${e.refreshWarning?m`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:_}
      ${e.activationUnresolved&&!e.actionsDisabled&&e.activation.phase!==`success`?m`<div class="model-setup__recovery">
              <p>${u(`modelSetup.recovery.unknown`)}</p>
              ${e.page.phase===`ready`&&(e.page.result.configuredModel||e.page.result.setupModel)&&e.canVerify&&e.onUseCurrentModel?m`<button
                      type="button"
                      class="btn primary"
                      @click=${e.onUseCurrentModel}
                    >
                      ${u(`modelSetup.recovery.useCurrent`)}
                    </button>`:_}
              <button type="button" class="btn" @click=${e.onDetect}>
                ${u(`modelSetup.checkAgain`)}
              </button>
            </div>`:_}
      ${st(e.connection?.loginMessage)}
      ${e.detectionError?m`<div class="callout warning" role="alert">${e.detectionError}</div>`:_}
      ${e.detecting&&e.page.phase===`ready`?m`<div class="muted" role="status">${u(`modelSetup.loading`)}</div>`:_}
      ${t}
    </div>
  `,r=m`
    ${e.connection?.login}
    <div @modal-cancel=${e=>e.preventDefault()}>
      ${rt({mode:e.wizardMode,state:e.wizard,refreshWarning:e.refreshWarning,cancellationNotice:e.cancellationNotice,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
    </div>
    ${e.activation.phase===`success`?Xt(e.activation,e.activation.modelTarget===`utility`?e.onOpenSetupAssistant??e.onOpenChat:e.onOpenChat,e.onSuccessClose,e.firstRun,e.embedded):_}
  `;if(e.embedded){let t=e.wizard.phase!==`idle`||e.activation.phase===`success`;return m`
      ${Nt(t?_:m`<openclaw-modal-dialog
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
    `}return m`
    <section class="content-header" ${se({toolbarHeader:!0})}>
      <div>
        <div class="page-title">${ie(`model-setup`)}</div>
        <div class="page-subtitle">
          ${re(`model-setup`)} ${Ie(cn)}
        </div>
      </div>
    </section>
    ${We(n)} ${r}
  `}var cn;function ln(){return(ln=e((()=>{v(),Ft(),le(),ce(),p(),Fe(),Be(),r(),M(),ut(),Rt(),qt(),Yt(),W(),X(),Zt(),it(),j(),cn=`https://docs.openclaw.ai/concepts/model-providers`})))()}var $;function un(){return(un=e((()=>{Ne(),Se(),ae(),de(),r(),we(),o(),s(),t(),ct(),B(),W(),I(),q(),X(),Mt(),A(),ln(),ot(),$=class extends n{constructor(...e){super(...e),this.actionsDisabled=()=>this.login.busy||this.nativeModels.saving||this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardMutationActive||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`,this.embedded=!1,this.agentLabel=``,this.credentialChoices=[],this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.wizardMode=`auth`,this.wizardDraft={stepId:null,value:void 0},this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.nativeSessionCatalogsEnabled=!1,this.iconUrls={},this.setupRefreshWarning=null,this.detectionError=null,this.detectionRequest=null,this.cancellationNotice=null,this.observedConnection=null,this.pendingPrepareOption=null,this.wizardMutationGeneration=0,this.wizardMutationActive=!1,this.wizardReturnFocus=null,this.firstRun=new z({context:()=>this.context,routeData:()=>this.routeData,pageState:()=>this.pageState,activationState:()=>this.activationState,actionsDisabled:()=>this.actionsDisabled()||this.detectionRequest!==null,canUseSetup:e=>this.canUseSetup(e),canVerify:e=>this.canVerify(e),verify:e=>this.verifyConnection(e).then(()=>this.verifyTask.value),setVerifyState:e=>this.verifyState=e,setActivationState:e=>this.activationState=e,setRefreshWarning:e=>this.setupRefreshWarning=e,resumeWizard:(e,t)=>{this.wizard.restore(e,t),this.runWizardMutation(()=>this.wizard.resume())},closeWizard:()=>this.closeWizard(),notify:()=>this.requestUpdate()}),this.nativeModels=new K(this,{getContext:()=>this.context,getConnection:()=>this.observedConnection,canUseSetup:e=>this.canUseSetup(e),blocked:()=>this.actionsDisabled()||this.detectionRequest!==null||this.firstRun.unresolved,onSelected:()=>this.embedded?this.onClose?.():this.context.navigate(`chat`)}),this.iconLoader=new U(()=>this.context,()=>this.pageState,e=>this.iconUrls=e),this.login=new dt(this,{getScope:()=>({context:this.context,agentId:this.agentSelection.state.selectedId}),getManualProviders:()=>this.pageState.phase===`ready`?this.pageState.result.manualProviders:[],onManualProvider:e=>{this.selectManualProvider(e),Tt(this.renderRoot)},canStart:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved&&!this.actionsDisabled(),canContinue:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved,refresh:()=>this.detect()}),this.subscriptions=new te(this).watchStore(()=>this.context?.gateway,e=>this.synchronizeGateway(e.snapshot)).watchStore(()=>this.context&&this.agentSelection,()=>this.synchronizeGateway(this.context.gateway.snapshot)).watchStore(()=>this.firstRun),this.wizard=new at({getClient:()=>this.context?.gateway.snapshot.client??null,getAgentId:()=>this.agentSelection.state.selectedId??null,onChange:e=>{e.phase!==`starting`&&e.phase!==`done`&&(this.activationState={phase:`idle`}),this.wizardState=e.phase===`step`&&this.wizardMutationActive?{...e,busy:!0}:e,this.wizardDraft=Qe(this.wizardDraft,e),e.phase===`idle`&&(this.cancellationNotice=null)},onStart:(e,t)=>e===`openclaw.setup.prepare.start`?void 0:this.firstRun.observeActivation(this.firstRun.beginActivation(t??{kind:`provider-auth`})),onBackgroundCompletion:e=>this.runWizardMutation(()=>Promise.resolve(e),!0),onSessionMissing:()=>{this.firstRun.wizardMissing(),this.detect()},requestFailedMessage:()=>u(`modelSetup.errors.requestFailed`),cancelledMessage:()=>u(`modelSetup.wizard.cancelled`),sessionExpiredMessage:()=>u(`modelSetup.wizard.sessionExpired`),gatewayNotRespondingMessage:()=>u(`modelSetup.wizard.gatewayNotResponding`)}),this.detectTask=At(this,{getHello:()=>this.context.gateway.snapshot.hello,onComplete:e=>{if(this.detectionRequest===e.token&&this.context.gateway.snapshot.client===e.client&&this.context.gateway.snapshot.hello===e.hello&&this.agentSelection.state.selectedId===e.agentId){if(this.detectionRequest=null,`error`in e){let t=P(e.error);this.pageState.phase===`ready`?this.detectionError=t:(this.firstRun.setReadyConnection(null),this.pageState={phase:`detect-error`,message:t});return}this.detectionError=null,this.firstRun.setReadyConnection({client:e.client,hello:e.hello,agentId:e.agentId}),this.pageState={phase:`ready`,result:e.value},this.firstRun.reconcileMissingWizard(e.value),e.value.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=``)}}}),this.verifyTask=jt(this)}get agentSelection(){return L(this.context,this.routeData?.firstRun===!0)}disconnectedCallback(){this.firstRun.dispose(),this.resetActivity(),this.observedConnection=null,this.nativeModels.reset(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(){this.synchronizeGateway(this.context.gateway.snapshot)}updated(e){this.isConnected&&(e.has(`activationState`)&&this.activationState.phase!==`idle`&&rn(this.renderRoot),this.wizardState.phase!==`idle`&&this.querySelector(`openclaw-modal-dialog`)?.setReturnFocusTarget(this.wizardReturnFocus),this.iconLoader.reconcile(),this.firstRun.start())}synchronizeGateway(e){let t=this.routeData;if(!this.isConnected||!t)return;let n=this.observedConnection,r=vt(n,R(this.context,t.firstRun,n?.recoveryScope));if(r.kind===`unchanged`)return;let i=r.connection;this.observedConnection=i,this.nativeModels.reset();let a=e.phase!==`connected`&&this.wizardMode===`auth`?u(`modelSetup.wizard.gatewayReconnecting`):void 0;if(r.kind===`pending`){this.wizard.hasAdmittedSession||(this.pageState={phase:`loading`}),this.wizard.suspend(a);return}let{authenticatedOwnerLost:o,ownerChanged:s}=_t(n,i),c=i.connected&&!d(e.hello?.auth??null);if((o||c)&&this.wizard.close({retireOwner:!0}),s&&(this.nativeSessionCatalogsEnabled=!1,this.manualProviderId=``,this.manualApiKey=``,this.manualError=null),n&&i.recoveryScope&&!s&&this.wizard.hasAdmittedSession){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.wizard.suspend(a),this.canUseSetup(i.client)&&(this.firstRun.reconnectActivation(i),this.runWizardMutation(()=>this.wizard.resume()));return}i.firstRun===n?.firstRun?this.firstRun.connectionChanged(i):this.firstRun.routeChanged(),this.resetActivity(),this.pageState={phase:`loading`},this.canUseSetup(i.client)&&this.detect()}resetActivity(){this.login.reset(),this.detectionRequest=null,this.detectionError=null,this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationState={phase:`idle`},this.resetVerify(),this.iconLoader.reset(),this.pendingPrepareOption=null,this.wizard.cancel()}canUseSetup(e){let t=this.context.gateway.snapshot;return!(!e||this.routeData?.firstRun!==!0&&this.agentSelection.state.selectedId===null||t.phase!==`connected`||!d(t.hello?.auth??null)||S(t,`openclaw.setup.detect`)!==!0)}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e)||this.detectionRequest)return null;this.resetVerify(),this.detectionError=null,this.pageState.phase!==`ready`&&(this.pageState={phase:`loading`});let t={};this.detectionRequest=t,await this.detectTask.run([e,this.agentSelection.state.selectedId,t]);let n=this.detectTask.value;return n?.token===t&&`value`in n?n.value:null}canVerify(e){return this.canUseSetup(e)&&S(this.context.gateway.snapshot,`openclaw.setup.verify`)===!0}resetVerify(){this.verifyState={phase:`idle`},this.verifyTask.run([null,null,void 0])}async verifyConnection(e){let t=this.context.gateway.snapshot.client;!this.canVerify(t)||this.actionsDisabled()||this.detectionRequest||(this.verifyState={phase:`checking`},await this.verifyTask.run([t,this.agentSelection.state.selectedId,e]))}async activate(e,t){let n=this.context.gateway.snapshot.client;!this.canUseSetup(n)||this.actionsDisabled()||this.detectionRequest||this.firstRun.unresolved||(this.manualError=null,this.activationState={phase:`testing`,targetId:t},this.pendingPrepareOption=null,this.wizardMode=`activate`,await this.runWizardMutation(()=>this.wizard.activate({...e,...this.nativeSessionCatalogPreference()},t)))}nativeSessionCatalogPreference(){return this.pageState.phase===`ready`&&this.pageState.result.nativeSessionCatalogPreferenceRequired===!0?{nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled}:{}}connectManual(){let e=wt(this.pageState.phase===`ready`?this.pageState.result.manualProviders:[],this.manualProviderId,this.manualApiKey);if(!e){this.manualError=u(`modelSetup.manual.required`);return}this.activate(e,`manual:${this.manualProviderId}`)}selectManualProvider(e){e!==this.manualProviderId&&(this.manualApiKey=``),this.manualProviderId=e,this.manualError=null}async handleWizardDone({startMethod:e,preparedModelRef:t,activationTargetId:n,modelActivation:r,isCurrent:i}){let a=e===`openclaw.setup.prepare.start`?this.pendingPrepareOption:null,o=this.nativeSessionCatalogPreference();if(this.pendingPrepareOption=null,a&&t){let e=xt(a,t);this.wizard.close(),this.activate({...e,...o},k(e.kind,t));return}if(e!==`openclaw.setup.prepare.start`){if(i?.()===!1){this.wizard.close();return}if(!r){this.wizard.fail(u(e===`openclaw.setup.activate.start`?`modelSetup.errors.activationFailed`:`modelSetup.wizard.notComplete`));return}this.wizard.close();let t={ok:!0,...r},a=n??`provider-auth`;this.activationState=Ze({result:t,targetId:a,fallbackError:u(`modelSetup.errors.activationFailed`),restartWarning:u(`labsPage.restartRequired`),refreshWarning:this.setupRefreshWarning}),this.activationState.phase===`success`&&(this.manualApiKey=``),this.firstRun.finishActivation(t,a,this.setupRefreshWarning);return}let s=await this.detect();if(!s){this.wizard.fail(u(`modelSetup.errors.requestFailed`));return}if(a){this.pageState=nt(s,a.modelTarget);let e=Ct(s,a.id);if(!e){this.wizard.fail(u(`modelSetup.prepare.providerNotReady`,{provider:a.label}));return}this.wizard.close(),this.activate({...bt(e),...o},k(e.kind,e.modelRef));return}this.wizard.close()}closeWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.close()}async runWizardMutation(e,t=!1){let n=this.context.gateway.snapshot.client;if((this.wizardMutationActive||this.detectionRequest!==null)&&!t||!this.canUseSetup(n)||this.wizard.state.phase===`idle`&&this.firstRun.unresolved)return;if(this.wizard.state.phase===`idle`){let e=this.ownerDocument.activeElement;this.wizardReturnFocus=e instanceof HTMLElement&&this.contains(e)?e:null}let r=++this.wizardMutationGeneration;this.wizardMutationActive=!0,this.requestUpdate();try{let t=await this.context.runtimeConfig.runExternalMutation(async t=>{if(t!==n)throw Error(`Connection changed before model setup continued.`);return await e()},{canDispatch:()=>r===this.wizardMutationGeneration&&this.context.gateway.snapshot.client===n&&this.canUseSetup(n),dispatchError:u(`modelSetup.errors.requestFailed`)});if(r!==this.wizardMutationGeneration){t.ok&&!t.refresh.ok&&this.isConnected&&(this.setupRefreshWarning=t.refresh.error),this.isConnected&&this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect();return}if(!t.ok){this.wizard.fail(t.error);return}this.setupRefreshWarning=t.refresh.ok?null:t.refresh.error;let i=t.value;i?(this.wizardMutationActive=!1,await this.handleWizardDone(i)):this.wizardState.phase===`step`&&this.wizardState.busy&&(this.wizardState={...this.wizardState,busy:!1})}catch(e){r===this.wizardMutationGeneration&&this.wizard.fail(P(e))}finally{r===this.wizardMutationGeneration&&(this.wizardMutationActive=!1,this.requestUpdate())}}async cancelWizard(){let e=this.wizardMutationGeneration;this.cancellationNotice=null;try{let t=await this.wizard.requestCancellation();if(e!==this.wizardMutationGeneration)return;if(t===`running`){this.cancellationNotice=u(`modelSetup.wizard.finishingStep`);return}if(t!==`cancelled`)return;this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.activationState={phase:`idle`}}catch(t){e===this.wizardMutationGeneration&&(this.wizardState.phase===`starting`||this.wizardState.phase===`step`)&&(this.cancellationNotice=u(`modelSetup.wizard.cancelFailed`,{error:P(t)}))}}render(){let e=this.context.gateway.snapshot,t=d(e.hello?.auth??null),n=e.phase===`connected`&&S(e,`openclaw.setup.detect`)!==!0;return sn({detecting:this.detectionRequest!==null,detectionError:this.detectionError,embedded:this.embedded,agentLabel:this.agentLabel,credentialChoices:this.credentialChoices,onClose:this.onClose,onDiscoveryShown:()=>{this.wizardState.phase===`idle`&&(this.wizardReturnFocus?.focus({preventScroll:!0}),this.wizardReturnFocus=null)},page:this.firstRun.visiblePageState(this.verifyState.phase===`ok`&&this.verifyState.modelTarget!==`utility`),activation:this.activationState,verify:this.verifyState,connection:this.embedded?void 0:this.login.pageActions,wizard:this.wizardState,wizardMode:this.wizardMode,wizardValue:this.wizardDraft.value,canAdmin:t,canVerify:this.canVerify(e.client),canPrepare:this.canUseSetup(e.client)&&S(e,`openclaw.setup.prepare.start`)===!0,modelConfigured:a(e)?.modelConfigured===!0,gatewayTooOld:n,refreshWarning:this.setupRefreshWarning,cancellationNotice:this.cancellationNotice,activationUnresolved:this.firstRun.unresolved,onUseCurrentModel:this.firstRun.canUseCurrentModel?()=>void this.firstRun.useCurrentModel():void 0,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled,nativeModels:this.nativeModels,onNativeSessionCatalogsChange:e=>this.nativeSessionCatalogsEnabled=e,firstRun:this.routeData?.firstRun===!0,iconUrls:this.iconUrls,onDetect:()=>{!this.detectionRequest&&this.firstRun.retryDetection()&&this.detect()},onVerify:()=>void this.firstRun.verify(),onActivateCandidate:e=>void this.activate(bt(e),k(e.kind,e.modelRef)),onStartAuth:e=>{this.wizard.prepareSignIn(e.kind,e.label),this.pendingPrepareOption=null,this.wizardMode=`auth`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.auth.start`,this.nativeSessionCatalogPreference(),e.modelTarget))},onStartPrepare:e=>{this.pendingPrepareOption=e,this.wizardMode=`prepare`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.prepare.start`))},onManualProviderChange:e=>this.selectManualProvider(e),onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.iconLoader.invalidate(e),onOpenChat:()=>this.embedded?this.onClose?.():this.firstRun.continueSetup(),onOpenSetupAssistant:()=>this.firstRun.continueSetup(`utility`),onSuccessClose:()=>{if(this.embedded){this.onClose?.();return}this.activationState={phase:`idle`},this.detect()},onWizardValueChange:e=>this.wizardDraft={...this.wizardDraft,value:e},onWizardAnswer:(e,t)=>void this.runWizardMutation(()=>this.wizard.answer(e,t)),onWizardCancel:()=>void this.cancelWizard(),onWizardClose:()=>this.closeWizard()})}},C([Me({context:ue,subscribe:!0})],$.prototype,`context`,void 0),C([x({attribute:!1})],$.prototype,`routeData`,void 0),C([x({type:Boolean})],$.prototype,`embedded`,void 0),C([x()],$.prototype,`agentLabel`,void 0),C([x({attribute:!1})],$.prototype,`credentialChoices`,void 0),C([x({attribute:!1})],$.prototype,`onClose`,void 0),C([y()],$.prototype,`pageState`,void 0),C([y()],$.prototype,`activationState`,void 0),C([y()],$.prototype,`verifyState`,void 0),C([y()],$.prototype,`wizardState`,void 0),C([y()],$.prototype,`wizardMode`,void 0),C([y()],$.prototype,`wizardDraft`,void 0),C([y()],$.prototype,`manualProviderId`,void 0),C([y()],$.prototype,`manualApiKey`,void 0),C([y()],$.prototype,`manualError`,void 0),C([y()],$.prototype,`moreSignInOpen`,void 0),C([y()],$.prototype,`nativeSessionCatalogsEnabled`,void 0),C([y()],$.prototype,`iconUrls`,void 0),C([y()],$.prototype,`setupRefreshWarning`,void 0),C([y()],$.prototype,`detectionError`,void 0),C([y()],$.prototype,`detectionRequest`,void 0),C([y()],$.prototype,`cancellationNotice`,void 0),customElements.get(`openclaw-model-setup-page`)||customElements.define(`openclaw-model-setup-page`,$)})))()}un();export{$ as ModelSetupPage};
//# sourceMappingURL=model-setup-page-XPJVXHBg.js.map