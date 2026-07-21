import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{r as s}from"./i18n-Cb2Gon67.js";import{Fr as c,Pr as l,pr as u}from"./index-CSGke-Z7.js";import{t as d}from"./settings-workspace-DV2kj5Je.js";import{i as f}from"./presenter-BWI_aDWC.js";async function p(e){let[t,n,r,i]=await Promise.all([e.request(`status`,{}),e.request(`health`,{}),e.request(`models.list`,{}),e.request(`last-heartbeat`,{})]),a=r;return{status:t,health:n,models:Array.isArray(a?.models)?a.models:[],heartbeat:i}}function m(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null,n=t?.critical??0,r=t?.warn??0,o=t?.info??0,c=n>0?`danger`:r>0?`warn`:`success`,l=n>0?s(`debug.security.critical`,{count:String(n)}):r>0?s(`debug.security.warnings`,{count:String(r)}):s(`debug.security.noCriticalIssues`);return i`
    <section class="grid">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${s(`debug.snapshotsTitle`)}</div>
            <div class="card-sub">${s(`debug.snapshotsSubtitle`)}</div>
          </div>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?s(`common.refreshing`):s(`common.refresh`)}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">${s(`debug.status`)}</div>
            ${t?i`<div class="callout ${c}" style="margin-top: 8px;">
                  ${s(`debug.security.audit`)}:
                  ${l}${o>0?` · ${s(`debug.security.info`,{count:String(o)})}`:``}.
                  ${s(`debug.security.runPrefix`)}
                  <span class="mono">openclaw security audit --deep</span>
                  ${s(`debug.security.runSuffix`)}
                </div>`:a}
            <pre class="code-block">${JSON.stringify(e.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">${s(`debug.health`)}</div>
            <pre class="code-block">${JSON.stringify(e.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">${s(`debug.lastHeartbeat`)}</div>
            <pre class="code-block">${JSON.stringify(e.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${s(`debug.manualRpcTitle`)}</div>
        <div class="card-sub">${s(`debug.manualRpcSubtitle`)}</div>
        <div class="stack" style="margin-top: 16px;">
          <label class="field">
            <span>${s(`debug.method`)}</span>
            <select
              .value=${e.callMethod}
              @change=${t=>e.onCallMethodChange(t.target.value)}
            >
              ${e.callMethod?a:i` <option value="" disabled>${s(`debug.selectMethod`)}</option> `}
              ${e.methods.map(e=>i`<option value=${e}>${e}</option>`)}
            </select>
          </label>
          <label class="field">
            <span>${s(`debug.paramsJson`)}</span>
            <textarea
              .value=${e.callParams}
              @input=${t=>e.onCallParamsChange(t.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>${s(`common.call`)}</button>
        </div>
        ${e.callError?i`<div class="callout danger" style="margin-top: 12px;">${e.callError}</div>`:a}
        ${e.callResult?i`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:a}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${s(`debug.modelsTitle`)}</div>
      <div class="card-sub">${s(`debug.modelsSubtitle`)}</div>
      <pre class="code-block" style="margin-top: 12px;">
${JSON.stringify(e.models??[],null,2)}</pre
      >
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${s(`debug.eventLogTitle`)}</div>
      <div class="card-sub">${s(`debug.eventLogSubtitle`)}</div>
      ${e.eventLog.length===0?i` <div class="muted" style="margin-top: 12px">${s(`debug.noEvents`)}</div> `:i`
            <div class="list debug-event-log" style="margin-top: 12px;">
              ${e.eventLog.map(e=>i`
                  <div class="list-item debug-event-log__item">
                    <div class="list-main">
                      <div class="list-title">${e.event}</div>
                      <div class="list-sub">${u(e.ts,void 0,``)}</div>
                    </div>
                    <div class="list-meta debug-event-log__meta">
                      <pre class="code-block debug-event-log__payload">
${f(e.payload)}</pre
                      >
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}var h=3e3,g=class extends o{constructor(...e){super(...e),this.client=null,this.connected=!1,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.eventLog=[],this.debugPollInterval=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.eventLog=this.context.gateway.eventLog,this.syncGatewayState(),this.stopGatewaySubscription=this.context.gateway.subscribe(e=>{let t=this.client;this.syncGatewayState(),t!==e.client&&this.resetServerState(),this.syncPolling(),this.ensureInitialDebug()}),this.stopEventLogSubscription=this.context.gateway.subscribeEventLog(e=>{this.eventLog=e}),this.syncPolling(),this.ensureInitialDebug()}disconnectedCallback(){this.stopPolling(),this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopEventLogSubscription?.(),this.stopEventLogSubscription=void 0,super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;this.client=e.client,this.connected=e.connected}resetServerState(){this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallResult=null,this.debugCallError=null}syncPolling(){if(!this.connected||!this.client){this.stopPolling();return}this.debugPollInterval===null&&(this.debugPollInterval=globalThis.setInterval(()=>{this.loadDiagnostics()},h))}stopPolling(){this.debugPollInterval!==null&&(globalThis.clearInterval(this.debugPollInterval),this.debugPollInterval=null)}ensureInitialDebug(){!this.connected||!this.client||this.debugStatus||this.debugLoading||this.loadDiagnostics()}async loadDiagnostics(){let e=this.client;if(!(!e||!this.connected||this.debugLoading)){this.debugLoading=!0;try{let t=await p(e);if(this.client!==e||!this.connected)return;this.debugStatus=t.status,this.debugHealth=t.health,this.debugModels=t.models,this.debugHeartbeat=t.heartbeat}catch(t){this.client===e&&this.connected&&(this.debugCallError=String(t))}finally{this.client===e&&(this.debugLoading=!1)}}}async callDebugMethod(){let e=this.client;if(!(!e||!this.connected)){this.debugCallError=null,this.debugCallResult=null;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);this.client===e&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(t){this.client===e&&(this.debugCallError=String(t))}}}render(){let e=m({loading:this.debugLoading,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onCall:()=>void this.callDebugMethod()});return i`
      <section class="content-header">
        <div>
          <div class="page-title">${c(`debug`)}</div>
          <div class="page-sub">${l(`debug`)}</div>
        </div>
      </section>
      ${d(this.context.basePath,e,`debug`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],g.prototype,`context`,void 0),n([r()],g.prototype,`client`,void 0),n([r()],g.prototype,`connected`,void 0),n([r()],g.prototype,`debugLoading`,void 0),n([r()],g.prototype,`debugStatus`,void 0),n([r()],g.prototype,`debugHealth`,void 0),n([r()],g.prototype,`debugModels`,void 0),n([r()],g.prototype,`debugHeartbeat`,void 0),n([r()],g.prototype,`debugCallMethod`,void 0),n([r()],g.prototype,`debugCallParams`,void 0),n([r()],g.prototype,`debugCallResult`,void 0),n([r()],g.prototype,`debugCallError`,void 0),n([r()],g.prototype,`eventLog`,void 0),customElements.define(`openclaw-debug-page`,g);
//# sourceMappingURL=debug-page-D6_IPhui.js.map