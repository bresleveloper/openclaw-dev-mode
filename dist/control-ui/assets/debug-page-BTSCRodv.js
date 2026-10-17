import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,V as a,W as o,_u as s,bu as c,du as l,ju as u,kc as ee,pu as te}from"./control-ui-core-CTSdBcaH.js";import{Ga as d,Ka as f,Qi as p,Ra as m,Ti as h,Xi as ne,ea as g,ir as re,rr as ie,wa as _,wi as v}from"./control-ui-core-vFnxmx94.js";import{$ as y,X as b,Y as x,a as S,c as C,ct as w,i as ae,nt as T,r as E,s as D,t as O}from"./lit-runtime-TNZj1e-P.js";import{i as k,s as A}from"./control-ui-boot-shared-D4E0xCZu.js";import{Xr as j,Zr as M,ii as N}from"./ui-CnRtCcYL.js";import{A as P,M as F,O as I,k as L}from"./control-ui-boot-shared-kUERtt7j.js";import{B as R,G as z,Gt as B,I as V,Kt as H,Y as U,Z as W,l as G,q as K,u as q}from"./control-ui-boot-shared-DeF_v3ER.js";import{Cc as J,Hc as oe,Uc as se,l as ce,u as le,wc as ue}from"./control-ui-boot-shared-flpXqVdL.js";import{a as de,i as fe,n as pe,t as me}from"./lane-table-BCYjqou1.js";function Y(e,t){return K({title:e,stacked:!0,control:y`<pre class="code-block" role="group" aria-label=${e} tabindex="0">
${C([t],()=>E(B(JSON.stringify(t??{},null,2))))}</pre>`})}function he(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return b;let n=t.critical??0,r=t.warn??0,i=t.info??0,a=n>0?`danger`:r>0?`warn`:`ok`,o=n>0?u(`debug.security.critical`,{count:String(n)}):r>0?u(`debug.security.warnings`,{count:String(r)}):u(`debug.security.noCriticalIssues`),s=i>0?` · ${u(`debug.security.info`,{count:String(i)})}`:``;return K({title:u(`debug.security.audit`),description:y`
      ${u(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${u(`debug.security.runSuffix`)}
    `,control:W({kind:a,label:`${o}${s}`})})}function ge(e){return e?y`
    <div class="settings-row" role="alert">
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${W({kind:`danger`,label:u(`common.failed`)})}
        </span>
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `:b}function _e(e){return e.connected||!e.offlineStable?b:K({title:W({kind:`muted`,label:u(`common.offline`)}),description:u(`debug.offlineSnapshots`)})}function ve(e){return K({title:e.event,description:a(e.ts,void 0,``),stacked:!0,control:y`<pre class="code-block" role="group" aria-label=${e.event} tabindex="0">
${C([e.payload],()=>E(B(k(e.payload))))}</pre>`})}function ye(e){let t=e.connected&&e.loading,n=U({title:u(`debug.snapshotsTitle`),description:u(`debug.snapshotsSubtitle`),actions:y`
        <button
          class="btn"
          ?disabled=${!e.connected||e.loading}
          @click=${e.onRefresh}
        >
          ${u(t?`common.refreshing`:`common.refresh`)}
        </button>
      `},y`
      ${_e(e)} ${ge(e.diagnosticsError)}
      ${he(e)} ${Y(u(`debug.status`),e.status)}
      ${Y(u(`debug.health`),e.health)}
      ${Y(u(`debug.lastHeartbeat`),e.heartbeat)}
    `),r=U({title:u(`debug.lanes.title`),description:u(`debug.lanes.subtitle`),actions:y`
        <button class="btn" @click=${e.onOpenOverlay}>
          ${f()?u(`debug.overlay.open`):g(u(`debug.overlay.openWithShortcut`,{shortcut:`{shortcut}`}),p(s.debugOverlay,{inline:!0}))}
        </button>
      `},y`
      <div class="data-table-container command-lanes-table-wrap">
        <table class="data-table command-lanes-table settings-table--stacked" role="table">
          <thead>
            <tr>
              <th scope="col">${u(`debug.lanes.lane`)}</th>
              <th scope="col">${u(`debug.lanes.active`)}</th>
              <th scope="col">${u(`debug.lanes.queued`)}</th>
              <th scope="col">${u(`debug.lanes.group`)}</th>
              <th scope="col">${u(`debug.lanes.blocked`)}</th>
            </tr>
          </thead>
          <tbody>
            ${pe({lanes:e.lanes,dynamic:e.dynamic})}
          </tbody>
        </table>
      </div>
    `),i=U({title:u(`debug.manualRpcTitle`),description:u(`debug.manualRpcSubtitle`)},y`
      ${K({title:u(`debug.method`),control:y`
          <select
            class="settings-select"
            aria-label=${u(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?b:y` <option value="" disabled>${u(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>y`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${K({title:u(`debug.paramsJson`),stacked:!0,control:y`
          <textarea
            class="settings-input"
            aria-label=${u(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${K({title:u(`common.call`),control:y`
          <button class="btn primary" @click=${e.onCall}>${u(`common.call`)}</button>
        `})}
      ${e.callError?y`
              <div class="settings-row settings-row--stacked" role="alert">
                ${W({kind:`danger`,label:u(`debug.callFailed`)})}
                <pre
                  class="code-block"
                  role="group"
                  aria-label=${u(`debug.callFailed`)}
                  tabindex="0"
                >
${e.callError}</pre>
              </div>
            `:b}
      ${e.callResult?y`
              <div class="settings-row settings-row--stacked">
                ${W({kind:`ok`,label:u(`common.ok`)})}
                <pre
                  class="code-block"
                  role="group"
                  aria-label=${`${e.callMethod}: ${u(`common.ok`)}`}
                  tabindex="0"
                >
${C([e.callResult],()=>E(B(e.callResult)))}</pre>
              </div>
            `:b}
    `),a=U({title:u(`debug.modelsTitle`),description:u(`debug.modelsSubtitle`)},y`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block" role="group" aria-label=${u(`debug.modelsTitle`)} tabindex="0">
${C([e.models],()=>E(B(JSON.stringify(e.models??[],null,2))))}</pre>
      </div>
    `),o=U({title:u(`debug.eventLogTitle`),description:u(`debug.eventLogSubtitle`)},e.eventLog.length===0?R(u(`debug.noEvents`)):S(e.eventLog,e=>e,ve));return z(y`${n} ${r} ${i} ${a} ${o}`,{wide:!0})}function X(){return(X=e((()=>{x(),D(),ae(),O(),d(),ne(),H(),V(),r(),o(),c(),A(),me()})))()}var Z,Q;function $(){return($=e((()=>{M(),I(),x(),T(),_(),h(),ie(),G(),te(),se(),i(),ue(),t(),ce(),X(),Z=3e3,Q=class extends n{constructor(...e){super(...e),this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.eventLog=[],this.polling=new J(this,Z,()=>{this.loadLiveDiagnostics()},!1,`visible`),this.callEpoch=0,this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsNeedsRefresh=!0,this.diagnosticsTask=new L(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.settingsAgentSelection.state.selectedId??null],task:([e,t],{signal:n})=>e?de(e,t,n):P,onComplete:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.debugStatus=e.status,this.debugHealth=e.health,this.debugModels=e.models,this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic},onError:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=l(e)}}),this.liveTask=new L(this,{autoRun:!1,task:async([e],{signal:t})=>{if(!e)return P;let[n,r]=await Promise.all([e.request(`last-heartbeat`,{},{signal:t}),fe(e,t)]);return{heartbeat:n,...r}},onComplete:e=>{this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic,this.debugLiveError=null},onError:e=>{this.debugLiveError=l(e)}}),this.gateway=new oe(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null},invalidateRequests:()=>{this.invalidateDiagnostics(),this.liveTask.run([null]),this.callEpoch+=1},onSnapshot:()=>{this.syncPolling(),this.diagnosticsNeedsRefresh&&this.loadDiagnostics()}}),this.subscriptions=new ee(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog}).watchStore(()=>this.context?.settingsAgentSelection,e=>{let t=e.state.selectedId;t!==this.diagnosticsAgentId&&(this.diagnosticsAgentId=t,this.debugModels=[],this.invalidateDiagnostics(),this.loadDiagnostics())})}disconnectedCallback(){this.subscriptions.clear(),this.invalidateDiagnostics(),this.liveTask.run([null]),this.diagnosticsAgentId=null,this.callEpoch+=1,super.disconnectedCallback()}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}invalidateDiagnostics(){this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsNeedsRefresh=!0}loadDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient?Promise.resolve():(this.liveTask.run([null]),this.diagnosticsTaskActiveClient=e,this.diagnosticsNeedsRefresh=!1,this.diagnosticsAgentId=this.context.settingsAgentSelection.state.selectedId,this.diagnosticsTask.run([e,this.context.settingsAgentSelection.state.selectedId]))}loadLiveDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient||this.liveTask.status===F.PENDING?Promise.resolve():this.liveTask.run([e])}async callDebugMethod(){let e=this.gateway.connected?this.gateway.client:null;if(!e)return;this.debugCallError=null,this.debugCallResult=null;let t=this.gateway.gateway,n=++this.callEpoch,r=()=>this.gateway.connected&&this.gateway.client===e&&this.gateway.gateway===t&&this.context.gateway===t&&this.callEpoch===n;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);r()&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(e){r()&&(this.debugCallError=l(e))}}render(){let e=ye({connected:this.gateway.connected,offlineStable:this.gateway.snapshot?.offlineStable??!1,loading:this.diagnosticsTask.status===F.PENDING,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,lanes:this.debugLanes,dynamic:this.debugDynamic,diagnosticsError:this.debugDiagnosticsError??this.debugLiveError,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onOpenOverlay:le,onCall:()=>void this.callDebugMethod()});return y`
      <section class="content-header" ${re({toolbarHeader:!0})}>
        <div>
          <div class="page-title">${m(`debug`)}</div>
        </div>
      </section>
      ${q(e)}
    `}},N([j({context:v,subscribe:!0})],Q.prototype,`context`,void 0),N([w()],Q.prototype,`debugStatus`,void 0),N([w()],Q.prototype,`debugHealth`,void 0),N([w()],Q.prototype,`debugModels`,void 0),N([w()],Q.prototype,`debugHeartbeat`,void 0),N([w()],Q.prototype,`debugLanes`,void 0),N([w()],Q.prototype,`debugDynamic`,void 0),N([w()],Q.prototype,`debugCallMethod`,void 0),N([w()],Q.prototype,`debugCallParams`,void 0),N([w()],Q.prototype,`debugCallResult`,void 0),N([w()],Q.prototype,`debugCallError`,void 0),N([w()],Q.prototype,`debugDiagnosticsError`,void 0),N([w()],Q.prototype,`debugLiveError`,void 0),N([w()],Q.prototype,`eventLog`,void 0),customElements.get(`openclaw-debug-page`)||customElements.define(`openclaw-debug-page`,Q)})))()}$();
//# sourceMappingURL=debug-page-BTSCRodv.js.map