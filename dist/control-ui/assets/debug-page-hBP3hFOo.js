import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Dh9Nir5C.js";import{Fs as i,Gl as a,Ll as o,Ls as s,Xl as c,_n as l,mn as ee,nc as te,tc as u,zl as d}from"./control-ui-core-BfjCgLp6.js";import{$ as f,X as p,Y as m,c as h,ct as g,d as _,nt as v,r as y,s as b,t as x,u as S}from"./lit-runtime-L6OV30Vo.js";import{$i as ne,Di as C,Oi as re,Qa as ie,Qi as ae,fo as w}from"./control-ui-core-qT0XjEdV.js";import{G as T,H as E,U as D,V as O}from"./control-ui-boot-shared-Dhqg2SVA.js";import{aa as k,mo as A,oa as j,po as M}from"./control-ui-boot-shared-CYu509im.js";import{Et as N,Ot as P,St as F,Tr as I,_t as L,pt as R,wr as z,wt as B}from"./control-ui-boot-shared-Bm2ZxasE.js";import{n as V,r as H,t as U}from"./control-ui-boot-shared-CjQgnhgU.js";import{n as W,t as G}from"./settings-workspace-DjAwV7nI.js";import{i as K,s as q}from"./presenter-NgrvGtip.js";import{a as J,i as oe,n as se,t as ce}from"./lane-table-CUgu2bCn.js";function Y(e,t){return B({title:e,stacked:!0,control:f`<pre class="code-block">
${_([t],()=>y(z(JSON.stringify(t??{},null,2))))}</pre>`})}function le(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return p;let n=t.critical??0,r=t.warn??0,i=t.info??0,a=n>0?`danger`:r>0?`warn`:`ok`,o=n>0?c(`debug.security.critical`,{count:String(n)}):r>0?c(`debug.security.warnings`,{count:String(r)}):c(`debug.security.noCriticalIssues`),s=i>0?` · ${c(`debug.security.info`,{count:String(i)})}`:``;return B({title:c(`debug.security.audit`),description:f`
      ${c(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${c(`debug.security.runSuffix`)}
    `,control:P({kind:a,label:`${o}${s}`})})}function ue(e){return e?f`
    <div class="settings-row" role="alert">
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${P({kind:`danger`,label:c(`common.failed`)})}
        </span>
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `:p}function de(e){return e.connected||!e.offlineStable?p:B({title:P({kind:`muted`,label:c(`common.offline`)}),description:c(`debug.offlineSnapshots`)})}function fe(e){return B({title:e.event,description:ee(e.ts,void 0,``),stacked:!0,control:f`<pre class="code-block">
${_([e.payload],()=>y(z(K(e.payload))))}</pre>`})}function pe(e){let t=e.connected&&e.loading,n=N({title:c(`debug.snapshotsTitle`),description:c(`debug.snapshotsSubtitle`),actions:f`
        <button
          class="btn"
          ?disabled=${!e.connected||e.loading}
          @click=${e.onRefresh}
        >
          ${c(t?`common.refreshing`:`common.refresh`)}
        </button>
      `},f`
      ${de(e)} ${ue(e.diagnosticsError)}
      ${le(e)} ${Y(c(`debug.status`),e.status)}
      ${Y(c(`debug.health`),e.health)}
      ${Y(c(`debug.lastHeartbeat`),e.heartbeat)}
    `),r=N({title:c(`debug.lanes.title`),description:c(`debug.lanes.subtitle`),actions:f`
        <button class="btn" @click=${e.onOpenOverlay}>
          ${ne()?c(`debug.overlay.open`):c(`debug.overlay.openWithShortcut`,{shortcut:U})}
        </button>
      `},f`
      <div class="data-table-container command-lanes-table-wrap">
        <table class="data-table command-lanes-table settings-table--stacked" role="table">
          <thead>
            <tr>
              <th scope="col">${c(`debug.lanes.lane`)}</th>
              <th scope="col">${c(`debug.lanes.active`)}</th>
              <th scope="col">${c(`debug.lanes.queued`)}</th>
              <th scope="col">${c(`debug.lanes.group`)}</th>
              <th scope="col">${c(`debug.lanes.blocked`)}</th>
            </tr>
          </thead>
          <tbody>
            ${se({lanes:e.lanes,dynamic:e.dynamic})}
          </tbody>
        </table>
      </div>
    `),i=N({title:c(`debug.manualRpcTitle`),description:c(`debug.manualRpcSubtitle`)},f`
      ${B({title:c(`debug.method`),control:f`
          <select
            class="settings-select"
            aria-label=${c(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?p:f` <option value="" disabled>${c(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>f`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${B({title:c(`debug.paramsJson`),stacked:!0,control:f`
          <textarea
            class="settings-input"
            aria-label=${c(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${B({title:c(`common.call`),control:f`
          <button class="btn primary" @click=${e.onCall}>${c(`common.call`)}</button>
        `})}
      ${e.callError?f`
              <div class="settings-row settings-row--stacked">
                ${P({kind:`danger`,label:c(`debug.callFailed`)})}
                <pre class="code-block">${e.callError}</pre>
              </div>
            `:p}
      ${e.callResult?f`
              <div class="settings-row settings-row--stacked">
                ${P({kind:`ok`,label:c(`common.ok`)})}
                <pre class="code-block">
${_([e.callResult],()=>y(z(e.callResult)))}</pre>
              </div>
            `:p}
    `),a=N({title:c(`debug.modelsTitle`),description:c(`debug.modelsSubtitle`)},f`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block">
${_([e.models],()=>y(z(JSON.stringify(e.models??[],null,2))))}</pre>
      </div>
    `),o=N({title:c(`debug.eventLogTitle`),description:c(`debug.eventLogSubtitle`)},e.eventLog.length===0?L(c(`debug.noEvents`)):h(e.eventLog,e=>e,fe));return F(f`${n} ${r} ${i} ${a} ${o}`,{wide:!0})}function X(){return(X=e((()=>{m(),S(),b(),x(),ae(),I(),R(),a(),l(),q(),V(),ce()})))()}var Z,Q;function $(){return($=e((()=>{t(),O(),m(),v(),ie(),re(),G(),s(),A(),d(),j(),te(),V(),X(),Z=3e3,Q=class extends o{constructor(...e){super(...e),this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.eventLog=[],this.polling=new k(this,Z,()=>{this.loadLiveDiagnostics()},!1,`visible`),this.callEpoch=0,this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsNeedsRefresh=!0,this.diagnosticsTask=new E(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.settingsAgentSelection.state.selectedId??null],task:([e,t],{signal:n})=>e?J(e,t,n):D,onComplete:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.debugStatus=e.status,this.debugHealth=e.health,this.debugModels=e.models,this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic},onError:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=i(e)}}),this.liveTask=new E(this,{autoRun:!1,task:async([e],{signal:t})=>{if(!e)return D;let[n,r]=await Promise.all([e.request(`last-heartbeat`,{},{signal:t}),oe(e,t)]);return{heartbeat:n,...r}},onComplete:e=>{this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic,this.debugLiveError=null},onError:e=>{this.debugLiveError=i(e)}}),this.gateway=new M(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null},invalidateRequests:()=>{this.diagnosticsTask.run([null,null]),this.liveTask.run([null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsNeedsRefresh=!0,this.callEpoch+=1},onSnapshot:()=>{this.syncPolling(),this.ensureInitialDebug()}}),this.subscriptions=new u(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog}).watch(()=>this.context?.settingsAgentSelection,(e,t)=>e.subscribe(t),e=>{let t=e.state.selectedId;t!==this.diagnosticsAgentId&&(this.diagnosticsAgentId=t,this.debugModels=[],this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsNeedsRefresh=!0,this.loadDiagnostics())})}disconnectedCallback(){this.subscriptions.clear(),this.diagnosticsTask.run([null,null]),this.liveTask.run([null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsNeedsRefresh=!0,this.callEpoch+=1,super.disconnectedCallback()}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialDebug(){this.gateway.connected&&this.gateway.client&&this.diagnosticsNeedsRefresh&&!this.diagnosticsTaskActiveClient&&this.loadDiagnostics()}loadDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient?Promise.resolve():(this.liveTask.run([null]),this.diagnosticsTaskActiveClient=e,this.diagnosticsNeedsRefresh=!1,this.diagnosticsAgentId=this.context.settingsAgentSelection.state.selectedId,this.diagnosticsTask.run([e,this.context.settingsAgentSelection.state.selectedId]))}loadLiveDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient||this.liveTask.status===T.PENDING?Promise.resolve():this.liveTask.run([e])}async callDebugMethod(){let e=this.gateway.connected?this.gateway.client:null;if(!e)return;this.debugCallError=null,this.debugCallResult=null;let t=this.gateway.gateway,n=++this.callEpoch,r=()=>this.gateway.connected&&this.gateway.client===e&&this.gateway.gateway===t&&this.context.gateway===t&&this.callEpoch===n;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);r()&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(e){r()&&(this.debugCallError=i(e))}}render(){let e=pe({connected:this.gateway.connected,offlineStable:this.gateway.snapshot?.offlineStable??!1,loading:this.diagnosticsTask.status===T.PENDING,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,lanes:this.debugLanes,dynamic:this.debugDynamic,diagnosticsError:this.debugDiagnosticsError??this.debugLiveError,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onOpenOverlay:H,onCall:()=>void this.callDebugMethod()});return f`
      <section class="content-header">
        <div>
          <div class="page-title">${w(`debug`)}</div>
        </div>
      </section>
      ${W(e)}
    `}},r([n({context:C,subscribe:!0})],Q.prototype,`context`,void 0),r([g()],Q.prototype,`debugStatus`,void 0),r([g()],Q.prototype,`debugHealth`,void 0),r([g()],Q.prototype,`debugModels`,void 0),r([g()],Q.prototype,`debugHeartbeat`,void 0),r([g()],Q.prototype,`debugLanes`,void 0),r([g()],Q.prototype,`debugDynamic`,void 0),r([g()],Q.prototype,`debugCallMethod`,void 0),r([g()],Q.prototype,`debugCallParams`,void 0),r([g()],Q.prototype,`debugCallResult`,void 0),r([g()],Q.prototype,`debugCallError`,void 0),r([g()],Q.prototype,`debugDiagnosticsError`,void 0),r([g()],Q.prototype,`debugLiveError`,void 0),r([g()],Q.prototype,`eventLog`,void 0),customElements.get(`openclaw-debug-page`)||customElements.define(`openclaw-debug-page`,Q)})))()}$();
//# sourceMappingURL=debug-page-hBP3hFOo.js.map