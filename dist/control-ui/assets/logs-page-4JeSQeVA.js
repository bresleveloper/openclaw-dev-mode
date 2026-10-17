import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{A as t,Cu as n,Eu as r,Ji as i,Tu as a,W as o,Xi as s,ju as c,qi as l}from"./control-ui-core-CTSdBcaH.js";import{Ra as ee,Ti as u,ir as te,li as d,rr as f,ui as ne,wa as p,wi as re}from"./control-ui-core-vFnxmx94.js";import{$ as m,X as h,Y as g,ct as _,nt as ie}from"./lit-runtime-TNZj1e-P.js";import{d as v,f as y}from"./control-ui-boot-shared-DSyxl38Y.js";import{ht as ae}from"./control-ui-boot-shared-D4E0xCZu.js";import{Eo as oe,Xr as se,Zr as ce,_a as b,ii as x,wo as S}from"./ui-CnRtCcYL.js";import{A as C,M as w,O as T,k as E}from"./control-ui-boot-shared-kUERtt7j.js";import{$ as D,$n as O,B as k,I as A,Qn as j,Xn as M,Yn as N,Z as P,Zn as F,er as I,l as L,q as R,u as le}from"./control-ui-boot-shared-DeF_v3ER.js";import{Cc as z,Hc as B,Uc as V,wc as H}from"./control-ui-boot-shared-flpXqVdL.js";import{n as U,t as W}from"./stream-auto-follow-controller-BZ0UzGsg.js";function ue(e){let t=[];for(let n of Object.keys(e)){if(!/^\d+$/.test(n))continue;let r=e[n];typeof r==`string`?t.push(r):r!=null&&t.push(JSON.stringify(r))}return t.join(` `)}function G(e){if(typeof e!=`string`||!e.trimStart().startsWith(`{`))return{};try{let t=JSON.parse(e);return{subsystem:typeof t.subsystem==`string`?t.subsystem:void 0,module:typeof t.module==`string`?t.module:void 0,plugin:typeof t.plugin==`string`?t.plugin:void 0}}catch{return{}}}function de(e,t){let n=G(t?.name);if(t?.name===e[0])return n;let r=G(e[0]);return{subsystem:n.subsystem??r.subsystem,module:n.module??r.module,plugin:n.plugin??r.plugin}}function fe(e){try{let t=JSON.parse(e);if(!b(t))return null;let n=b(t._meta)?t._meta:void 0,r=de(t,n),i=typeof n?.logLevelName==`string`?n.logLevelName:t.level;return{time:typeof t.time==`string`?t.time:typeof n?.date==`string`?n.date:void 0,level:oe(i),subsystem:r.subsystem??(typeof t.subsystem==`string`?t.subsystem:void 0),module:r.module,plugin:r.plugin,message:typeof t.message==`string`?t.message:ue(t),raw:e}}catch{return null}}function K(){return(K=e((()=>{})))()}function pe(e){let t=fe(e);if(!t)return{raw:e,message:y(e)};let n=t.subsystem??t.module;return{raw:t.raw,time:t.time??null,level:q.find(e=>e===t.level)??null,subsystem:n?y(n):null,message:y(t.message)}}var q,J;function Y(){return(Y=e((()=>{v(),K(),q=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`],J={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0}})))()}function me(e,t){if(!e)return``;let n=new Date(e);return Number.isNaN(n.getTime())?e:t(n.getTime())}function he(e){let n=t({timeStyle:`short`}),r=S(e.filterText),i=q.some(t=>!e.levelFilters[t]),a=e.entries.filter(t=>t.level&&!e.levelFilters[t.level]?!1:!r||S([t.message,t.subsystem,t.raw].filter(Boolean).join(` `)).includes(r)),o=r||i?`filtered`:`visible`,s=c(`gatewayLogs.exportLabels.${o}`),l=e.status.hasLoaded?a.length===0?k(c(`gatewayLogs.empty`)):a.map(e=>m`
            <div class="log-row">
              <div class="log-time mono">${me(e.time,n)}</div>
              <div class="log-level ${e.level??``}">${e.level??``}</div>
              <div class="log-subsystem mono">${e.subsystem??``}</div>
              <div class="log-message mono">${e.message??e.raw}</div>
            </div>
          `):e.loading?ne():h;return m`
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${c(`gatewayLogs.title`)}</h2>
      <div class="settings-section__actions">
        <button class="btn" ?disabled=${e.refreshDisabled} @click=${e.onRefresh}>
          ${e.loading?c(`common.loading`):c(`common.refresh`)}
        </button>
        <button
          class="btn"
          ?disabled=${a.length===0}
          @click=${()=>e.onExport(a.map(e=>e.raw),o)}
        >
          ${c(`gatewayLogs.exportButton`,{label:s})}
        </button>
      </div>
    </div>
    <p class="settings-section__desc">${c(`gatewayLogs.subtitle`)}</p>
    ${I({status:e.status,className:`logs-refresh-status`})}
    <div class="settings-group logs-card">
      ${R({title:c(`gatewayLogs.filter`),description:e.file?c(`gatewayLogs.file`,{file:e.file}):void 0,control:m`
          <input
            class="settings-input"
            aria-label=${c(`gatewayLogs.filter`)}
            .value=${e.filterText}
            @input=${t=>e.onFilterTextChange(t.target.value)}
            placeholder=${c(`gatewayLogs.searchPlaceholder`)}
          />
        `})}
      <div class="settings-row">
        <div class="chip-row">
          ${q.map(t=>m`
              <label class="chip log-chip ${t}">
                <input
                  type="checkbox"
                  .checked=${e.levelFilters[t]}
                  @change=${n=>e.onLevelToggle(t,n.target.checked)}
                />
                <span>${t}</span>
              </label>
            `)}
        </div>
        <div class="settings-row__control">
          ${D({checked:e.autoFollow,ariaLabel:c(`gatewayLogs.autoFollow`),onChange:e.onToggleAutoFollow})}
          <span class="settings-row__value">${c(`gatewayLogs.autoFollow`)}</span>
        </div>
      </div>
      ${e.truncated?m`
              <div class="settings-row">
                ${P({kind:`warn`,label:c(`gatewayLogs.truncated`)})}
              </div>
            `:h}
      <div
        class="log-stream"
        role="region"
        aria-label=${c(`gatewayLogs.title`)}
        tabindex="0"
        @scroll=${e.onScroll}
      >
        ${l}
      </div>
    </div>
  `}function X(){return(X=e((()=>{g(),d(),O(),A(),r(),o(),Y()})))()}var Z,Q;function $(){return($=e((()=>{ce(),T(),g(),ie(),p(),u(),f(),O(),L(),i(),V(),a(),H(),U(),Y(),X(),Z=2e3,Q=class extends n{constructor(...e){super(...e),this.logsStatus=F(),this.logsFile=null,this.logsEntries=[],this.logsFilterText=``,this.logsLevelFilters={...J},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.polling=new z(this,Z,()=>{this.loadLogs({quiet:!0})},!1,`visible`),this.contentScrollFrame=null,this.logsTaskQuiet=!1,this.logsTask=new E(this,{autoRun:!1,args:()=>this.logsTaskArgs(),task:async([e,t,n,r,i],{signal:a})=>{if(!e||!t)return C;try{let e=e=>t.request(`logs.tail`,{cursor:e,limit:this.logsLimit,maxBytes:this.logsMaxBytes},{signal:a}),o=await e(i?void 0:n??void 0),s=!i&&r!==null&&o.file!==void 0&&o.file!==r;return s&&(o=await e()),{ok:!0,payload:o,cursor:n,reset:i||s}}catch(e){return{ok:!1,error:e}}},onComplete:e=>{if(!e.ok){s(e.error)?(this.logsEntries=[],this.logsStatus=j(F(),e.error,this.gateway.snapshot),this.logsStatus.error&&(this.logsStatus={...this.logsStatus,error:l(`logs`)})):this.logsStatus=j(this.logsStatus,e.error,this.gateway.snapshot);return}let t=(Array.isArray(e.payload.lines)?e.payload.lines.filter(e=>typeof e==`string`):[]).map(pe),n=e.reset||e.payload.reset||e.cursor==null;this.logsEntries=n?t:[...this.logsEntries,...t].slice(-2e3),this.logsCursor=typeof e.payload.cursor==`number`?e.payload.cursor:this.logsCursor,this.logsFile=typeof e.payload.file==`string`?e.payload.file:this.logsFile,this.logsTruncated=!!e.payload.truncated,this.logsStatus=M()}}),this.gateway=new B(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.logsStatus=F(),this.logsFile=null,this.logsEntries=[],this.logsTruncated=!1,this.logsCursor=null,this.streamFollow.atBottom=!0},invalidateRequests:()=>{this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,null,!1])},onSnapshot:()=>this.syncPolling(),ensureInitialData:()=>{let e=this.logsStatus.hasLoaded;this.loadLogs({reset:!0,quiet:e}).then(t=>{t&&!e&&this.streamFollow.schedule(!0)})}}),this.streamFollow=new W(this,{selector:`.log-stream`,isEnabled:()=>this.logsAutoFollow,captureCurrent:()=>{let e=this.gateway.gateway,t=this.gateway.epoch;return()=>this.isConnected&&this.gateway.connected&&e!==null&&this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.epoch===t}})}logsTaskArgs(e){return[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,e?.reset?null:this.logsCursor,this.logsFile,e?.reset===!0]}firstUpdated(){this.resetContentScroll(),this.contentScrollFrame=requestAnimationFrame(()=>{this.contentScrollFrame=null,this.resetContentScroll()})}updated(e){let t=this.logsAutoFollow&&e.has(`logsAutoFollow`);(t||this.logsAutoFollow&&this.streamFollow.atBottom&&e.has(`logsEntries`))&&this.streamFollow.schedule(t)}disconnectedCallback(){this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,null,!1]),this.contentScrollFrame!==null&&(cancelAnimationFrame(this.contentScrollFrame),this.contentScrollFrame=null),super.disconnectedCallback()}resetContentScroll(){let e=this.closest(`.content`);e&&(e.scrollTop=0,e.scrollLeft=0)}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}async loadLogs(e){let t=e?.quiet===!0,n=this.gateway.gateway;if(!n||!this.gateway.client||!this.gateway.connected||this.context.gateway!==n||this.logsTask.status===w.PENDING&&e?.reset!==!0)return!1;this.logsTaskQuiet=t,this.logsStatus=N(this.logsStatus,{clearError:!t});let r=this.gateway.epoch;return await this.logsTask.run(this.logsTaskArgs(e)),this.gateway.epoch===r&&this.logsTask.status===w.COMPLETE}render(){let e=he({loading:this.logsTask.status===w.PENDING&&!this.logsTaskQuiet,refreshDisabled:!this.gateway.connected||this.logsTask.status===w.PENDING,status:this.logsStatus,file:this.logsFile,entries:this.logsEntries,filterText:this.logsFilterText,levelFilters:this.logsLevelFilters,autoFollow:this.logsAutoFollow,truncated:this.logsTruncated,onFilterTextChange:e=>this.logsFilterText=e,onLevelToggle:(e,t)=>{this.logsLevelFilters={...this.logsLevelFilters,[e]:t}},onToggleAutoFollow:e=>this.logsAutoFollow=e,onRefresh:()=>void this.loadLogs({reset:!0}).then(e=>{e&&this.streamFollow.schedule(!0)}),onExport:(e,t)=>{let n=new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`);ae(`openclaw-logs-${t}-${n}.log`,`${e.join(`
`)}\n`)},onScroll:e=>this.streamFollow.handleScroll(e)});return m`
      <section class="content-header" ${te({toolbarHeader:!0})}>
        <div>
          <div class="page-title">${ee(`logs`)}</div>
        </div>
      </section>
      ${le(e,{fillHeight:!0})}
    `}},x([se({context:re,subscribe:!0})],Q.prototype,`context`,void 0),x([_()],Q.prototype,`logsStatus`,void 0),x([_()],Q.prototype,`logsFile`,void 0),x([_()],Q.prototype,`logsEntries`,void 0),x([_()],Q.prototype,`logsFilterText`,void 0),x([_()],Q.prototype,`logsLevelFilters`,void 0),x([_()],Q.prototype,`logsAutoFollow`,void 0),x([_()],Q.prototype,`logsTruncated`,void 0),customElements.get(`openclaw-logs-page`)||customElements.define(`openclaw-logs-page`,Q)})))()}$();
//# sourceMappingURL=logs-page-4JeSQeVA.js.map