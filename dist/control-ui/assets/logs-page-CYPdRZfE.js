import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{t as s}from"./string-coerce-BuYUxt7q.js";import{r as c}from"./i18n-Cb2Gon67.js";import{Fr as l,Ht as u,Pr as d,Vt as f}from"./index-DMlQdn8s.js";import{t as p}from"./settings-workspace-BdKXKfXa.js";var m=`\\x1b\\[[\\x20-\\x3f]*[\\x40-\\x7e]`,h=`\\x9b[\\x20-\\x3f]*[\\x40-\\x7e]`,g=`\\x9b[\\x20-\\x3f]+[\\x40-\\x7e]`,_=`(?:${m}|${h})`,v=`(?:\\x1b\\]|\\x9d)[^\\x07\\x1b\\x9c]*(?:\\x1b\\\\|\\x07|\\x9c)`,y=new RegExp(_,`g`),b=new RegExp(v,`g`);RegExp(`${v}|${_}`,`g`),RegExp(`${v}|${m}|${g}`,`g`),typeof Intl<`u`&&`Segmenter`in Intl&&new Intl.Segmenter(void 0,{granularity:`grapheme`});function x(e){return e.replace(b,``).replace(y,``)}var S={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},C=new Set([`trace`,`debug`,`info`,`warn`,`error`,`fatal`]);function w(e){if(typeof e!=`string`)return null;let t=e.trim();if(!t.startsWith(`{`)||!t.endsWith(`}`))return null;try{let e=JSON.parse(t);return e&&typeof e==`object`?e:null}catch{return null}}function T(e){if(typeof e!=`string`)return null;let t=s(e);return C.has(t)?t:null}function E(e){if(!e.trim())return{raw:e,message:e};try{let t=JSON.parse(e),n=t&&typeof t._meta==`object`&&t._meta!==null?t._meta:null,r=typeof t.time==`string`?t.time:typeof n?.date==`string`?n.date:null,i=T(n?.logLevelName??n?.level),a=typeof t[0]==`string`?t[0]:typeof n?.name==`string`?n.name:null,o=w(a),s=typeof o?.subsystem==`string`?o.subsystem:typeof o?.module==`string`?o.module:null;!s&&a&&a.length<120&&(s=a);let c=typeof t[1]==`string`?t[1]:typeof t[2]==`string`?t[2]:!o&&typeof t[0]==`string`?t[0]:typeof t.message==`string`?t.message:e;return{raw:e,time:r,level:i,subsystem:s&&x(s),message:x(c),meta:n??void 0}}catch{return{raw:e,message:x(e)}}}var D=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`];function O(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function k(e,t){return t?s([e.message,e.subsystem,e.raw].filter(Boolean).join(` `)).includes(t):!0}function A(e){let t=s(e.filterText),n=D.some(t=>!e.levelFilters[t]),r=e.entries.filter(n=>n.level&&!e.levelFilters[n.level]?!1:k(n,t)),o=t||n?`filtered`:`visible`,l=c(`logsView.exportLabels.${o}`);return i`
    <section class="card logs-card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${c(`logsView.title`)}</div>
          <div class="card-sub">${c(`logsView.subtitle`)}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?c(`common.loading`):c(`common.refresh`)}
          </button>
          <button
            class="btn"
            ?disabled=${r.length===0}
            @click=${()=>e.onExport(r.map(e=>e.raw),o)}
          >
            ${c(`logsView.exportButton`,{label:l})}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>${c(`logsView.filter`)}</span>
          <input
            .value=${e.filterText}
            @input=${t=>e.onFilterTextChange(t.target.value)}
            placeholder=${c(`logsView.searchPlaceholder`)}
          />
        </label>
        <label class="field checkbox">
          <span>${c(`logsView.autoFollow`)}</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${t=>e.onToggleAutoFollow(t.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${D.map(t=>i`
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

      ${e.file?i`
            <div class="muted" style="margin-top: 10px;">
              ${c(`logsView.file`,{file:e.file})}
            </div>
          `:a}
      ${e.truncated?i` <div class="callout" style="margin-top: 10px">${c(`logsView.truncated`)}</div> `:a}
      ${e.error?i`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:a}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${r.length===0?i` <div class="muted" style="padding: 12px">${c(`logsView.empty`)}</div> `:r.map(e=>i`
                <div class="log-row">
                  <div class="log-time mono">${O(e.time)}</div>
                  <div class="log-level ${e.level??``}">${e.level??``}</div>
                  <div class="log-subsystem mono">${e.subsystem??``}</div>
                  <div class="log-message mono">${e.message??e.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}var j=2e3,M=class extends o{constructor(...e){super(...e),this.client=null,this.connected=!1,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText=``,this.logsLevelFilters={...S},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsAtBottom=!0,this.logsCursor=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsPollInterval=null,this.logsScrollFrame=null,this.contentScrollFrame=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.stopGatewaySubscription=this.context.gateway.subscribe(e=>{let t=this.client;this.syncGatewayState(),t!==e.client&&this.resetServerState(),this.syncPolling(),this.ensureInitialLogs()}),this.logsAtBottom=!0,this.syncPolling(),this.ensureInitialLogs()}firstUpdated(){this.resetContentScroll(),this.contentScrollFrame=requestAnimationFrame(()=>{this.contentScrollFrame=null,this.resetContentScroll()})}updated(e){this.logsAutoFollow&&this.logsAtBottom&&(e.has(`logsEntries`)||e.has(`logsAutoFollow`))&&this.scheduleScroll(e.has(`logsAutoFollow`))}disconnectedCallback(){this.stopPolling(),this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.logsScrollFrame!==null&&(cancelAnimationFrame(this.logsScrollFrame),this.logsScrollFrame=null),this.contentScrollFrame!==null&&(cancelAnimationFrame(this.contentScrollFrame),this.contentScrollFrame=null),super.disconnectedCallback()}resetContentScroll(){let e=this.closest(`.content`);e&&(e.scrollTop=0,e.scrollLeft=0)}syncGatewayState(){let e=this.context.gateway.snapshot;this.client=e.client,this.connected=e.connected}resetServerState(){this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsTruncated=!1,this.logsCursor=null,this.logsAtBottom=!0}syncPolling(){if(!this.connected||!this.client){this.stopPolling();return}this.logsPollInterval===null&&(this.logsPollInterval=globalThis.setInterval(()=>{this.loadLogs({quiet:!0})},j))}stopPolling(){this.logsPollInterval!==null&&(globalThis.clearInterval(this.logsPollInterval),this.logsPollInterval=null)}ensureInitialLogs(){!this.connected||!this.client||this.logsEntries.length>0||this.logsLoading||this.loadLogs({reset:!0}).then(()=>this.scheduleScroll(!0))}async loadLogs(e){let t=this.client,n=e?.quiet===!0;if(!(!t||!this.connected||this.logsLoading&&!n)){n||(this.logsLoading=!0),this.logsError=null;try{let n=await t.request(`logs.tail`,{cursor:e?.reset?void 0:this.logsCursor??void 0,limit:this.logsLimit,maxBytes:this.logsMaxBytes});if(this.client!==t)return;let r=n,i=(Array.isArray(r.lines)?r.lines.filter(e=>typeof e==`string`):[]).map(E),a=e?.reset||r.reset||this.logsCursor==null;this.logsEntries=a?i:[...this.logsEntries,...i].slice(-2e3),this.logsCursor=typeof r.cursor==`number`?r.cursor:this.logsCursor,this.logsFile=typeof r.file==`string`?r.file:this.logsFile,this.logsTruncated=!!r.truncated}catch(e){if(this.client!==t)return;u(e)?(this.logsEntries=[],this.logsError=f(`logs`)):this.logsError=String(e)}finally{this.client===t&&!n&&(this.logsLoading=!1)}}}scheduleScroll(e=!1){this.logsScrollFrame!==null&&cancelAnimationFrame(this.logsScrollFrame),this.updateComplete.then(()=>{this.logsScrollFrame=requestAnimationFrame(()=>{this.logsScrollFrame=null;let t=this.querySelector(`.log-stream`);if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;(e||n<80)&&(t.scrollTop=t.scrollHeight)})})}handleScroll(e){let t=e.currentTarget;if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;this.logsAtBottom=n<80}exportLogs(e,t){if(e.length===0)return;let n=new Blob([`${e.join(`
`)}\n`],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`);i.href=r,i.download=`openclaw-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(r)}render(){let e=A({loading:this.logsLoading,error:this.logsError,file:this.logsFile,entries:this.logsEntries,filterText:this.logsFilterText,levelFilters:this.logsLevelFilters,autoFollow:this.logsAutoFollow,truncated:this.logsTruncated,onFilterTextChange:e=>this.logsFilterText=e,onLevelToggle:(e,t)=>{this.logsLevelFilters={...this.logsLevelFilters,[e]:t}},onToggleAutoFollow:e=>this.logsAutoFollow=e,onRefresh:()=>void this.loadLogs({reset:!0}).then(()=>this.scheduleScroll(!0)),onExport:(e,t)=>this.exportLogs(e,t),onScroll:e=>this.handleScroll(e)});return i`
      <section class="content-header">
        <div>
          <div class="page-title">${l(`logs`)}</div>
          <div class="page-sub">${d(`logs`)}</div>
        </div>
      </section>
      ${p(this.context.basePath,e,`logs`,e=>this.context.navigate(e),e=>this.context.preload(e),{fillHeight:!0})}
    `}};n([t({context:e,subscribe:!1})],M.prototype,`context`,void 0),n([r()],M.prototype,`client`,void 0),n([r()],M.prototype,`connected`,void 0),n([r()],M.prototype,`logsLoading`,void 0),n([r()],M.prototype,`logsError`,void 0),n([r()],M.prototype,`logsFile`,void 0),n([r()],M.prototype,`logsEntries`,void 0),n([r()],M.prototype,`logsFilterText`,void 0),n([r()],M.prototype,`logsLevelFilters`,void 0),n([r()],M.prototype,`logsAutoFollow`,void 0),n([r()],M.prototype,`logsTruncated`,void 0),n([r()],M.prototype,`logsAtBottom`,void 0),customElements.define(`openclaw-logs-page`,M);
//# sourceMappingURL=logs-page-CYPdRZfE.js.map