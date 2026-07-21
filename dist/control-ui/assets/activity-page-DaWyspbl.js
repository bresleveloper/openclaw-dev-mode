import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{t as s}from"./string-coerce-BuYUxt7q.js";import{r as c}from"./string-normalization-BzUT2-1w.js";import{r as l}from"./i18n-Cb2Gon67.js";import{y as u}from"./session-key-O2mAF18C.js";import{Er as d,Fr as f,Pr as p,Wn as m,hr as h,l as g,pr as _,yr as v}from"./index-DMlQdn8s.js";var y=2e3,b={running:`running`,done:`completed`,error:`failed`},x=[[/\b(Authorization|Cookie|Set-Cookie)\s*:\s*[^\n\r]+/gi,`$1: [redacted]`],[/\b(Bearer\s+)[A-Za-z0-9._~+/=-]{12,}/gi,`$1[redacted]`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)"(?:\\.|[^"\\\r\n])*"/gi,`$1$2$3"[redacted]"`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)'(?:\\.|[^'\\\r\n])*'/gi,`$1$2$3'[redacted]'`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(\s*[:=]\s*)["']?[^"',\s}]+/gi,`$1$2[redacted]`],[/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,`[redacted private key]`],[/(^|[\s"'`=])(?:\/Users\/|\/home\/|\/var\/folders\/|[A-Za-z]:\\)[^\s"'`,;]+/g,`$1[redacted path]`]];function S(e){return typeof e==`string`&&e.trim()||null}function C(e){return e&&typeof e==`object`?e:null}function w(e,t=Date.now()){let n=C(e),r=S(n?.runId),i=C(n?.data);if(!n||n.stream!==`tool`||!r||!i)return null;let a=S(n.sessionKey),o=S(n.agentId);return{runId:r,ts:typeof n.ts==`number`?n.ts:t,receivedAt:t,...a?{sessionKey:a}:{},...o?{agentId:o}:{},data:i}}function T(e){if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`)return String(e);let t=C(e);if(!t)return null;if(typeof t.text==`string`)return t.text;let n=t.content;if(!Array.isArray(n))return null;let r=n.map(e=>{let t=C(e);return t?.type===`text`&&typeof t.text==`string`?t.text:null}).filter(e=>!!e);return r.length>0?r.join(`
`):null}function E(e){let t=T(e);if(t!==null)return t;if(e==null)return null;try{return JSON.stringify(e,null,2)}catch{return h(e)}}function D(e){return x.reduce((e,[t,n])=>e.replace(t,n),e)}function O(e){let t=E(e);if(!t)return{truncated:!1};let n=v(D(t),y);return{text:n.text,truncated:n.truncated}}function k(e){if(e==null)return 0;if(Array.isArray(e))return e.length;let t=C(e);return t?Object.keys(t).length:1}function A(e){return e?.isError===!0||e?.is_error===!0}function j(e){if(S(e.phase)!==`result`)return`running`;let t=C(e.result);if(A(e)||A(t))return`error`;let n=S(e.status)??S(t?.status);if(n&&/error|fail|failed|failure/i.test(n))return`error`;let r=Number(t?.exitCode??e.exitCode);return Number.isFinite(r)&&r!==0?`error`:`done`}function M(e){return b[e]}function N(e,t,n){let r=`${n} argument${n===1?``:`s`} hidden`;return`${e} ${M(t)}; ${r}`}function P(e,t){let n=t.data??{},r=S(n.toolCallId);if(!r)return e;let i=S(n.name)??`tool`,a=`${t.runId}:${r}`,o=t.receivedAt,s=typeof t.ts==`number`?t.ts:o,c=j(n),l=O(n.phase===`update`?n.partialResult:n.phase===`result`?n.result:null),u=e.find(e=>e.id===a),d=n.args===void 0?u?.hiddenArgumentCount??0:k(n.args),f=l.text??u?.outputPreview,p={id:a,toolCallId:r,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:i,status:c,startedAt:u?.startedAt??s,updatedAt:o,durationMs:Math.max(0,o-(u?.startedAt??s)),outputTruncated:l.truncated||u?.outputTruncated===!0,summary:N(i,c,d),hiddenArgumentCount:d,...f?{outputPreview:f}:{}};return(u?e.map(e=>e.id===a?p:e):[...e,p]).slice(-100)}var F=[`running`,`done`,`error`];function I(e){return _(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function L(e){if(!Number.isFinite(e)||e<0)return l(`common.na`);if(e<1e3)return l(`activity.duration.ms`,{count:String(Math.round(e))});if(e<6e4)return l(`activity.duration.seconds`,{count:(e/1e3).toFixed(1)});let t=Math.round(e/1e3),n=Math.floor(t/60),r=t%60;return l(`activity.duration.minutes`,{minutes:String(n),seconds:String(r)})}function R(e){return l(`activity.status.${e}`)}function z(e){return e===1?l(`activity.argumentHiddenOne`):l(`activity.argumentsHidden`,{count:String(e)})}function B(e){return l(`activity.entrySummary`,{argumentSummary:z(e.hiddenArgumentCount),status:R(e.status),tool:e.toolName})}function V(e,t){return t?s([e.toolName,e.status,e.summary,B(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t):!0}function H(e){return c(e.map(e=>e.toolName))}function U(e){let t=s(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:V(n,t))}function W(e,t){return i`
    <label class="activity-status-filter activity-status-filter--${t}">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${n=>e.onStatusToggle(t,n.target.checked)}
      />
      <span>${R(t)}</span>
    </label>
  `}function G(e,t){let n=e.expandedIds.has(t.id);return i`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${n=>e.onEntryToggle(t.id,n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${d.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            <span class="activity-status activity-status--${t.status}">
              ${R(t.status)}
            </span>
            <span class="activity-entry__tool mono">${t.toolName}</span>
          </span>
          <span class="activity-entry__text">${B(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${I(t.updatedAt)}</span>
          <span>${L(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          <span>${z(t.hiddenArgumentCount)}</span>
          <span class="mono">${l(`activity.toolCallId`)}: ${t.toolCallId}</span>
          <span class="mono">${l(`activity.runId`)}: ${t.runId}</span>
          ${t.sessionKey?i`<span class="mono">${l(`activity.session`)}: ${t.sessionKey}</span>`:a}
        </div>
        ${t.outputPreview?i`
              <pre class="activity-entry__preview">${t.outputPreview}</pre>
              ${t.outputTruncated?i`<div class="activity-entry__note">${l(`activity.outputTruncated`)}</div>`:a}
            `:i`<div class="activity-entry__note">${l(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function K(e){let t=H(e.entries),n=U(e),r=e.filterText.trim()||e.toolFilter||F.some(t=>!e.statusFilters[t]);return i`
    <section class="activity-page" aria-label=${l(`activity.title`)}>
      <div class="activity-toolbar" aria-label=${l(`activity.filtersLabel`)}>
        <label class="activity-field activity-field--search">
          <span>${l(`activity.search`)}</span>
          <input
            type="search"
            .value=${e.filterText}
            placeholder=${l(`activity.searchPlaceholder`)}
            @input=${t=>e.onFilterTextChange(t.target.value)}
          />
        </label>
        <label class="activity-field">
          <span>${l(`activity.toolFilter`)}</span>
          <select
            .value=${e.toolFilter}
            @change=${t=>e.onToolFilterChange(t.target.value)}
          >
            <option value="">${l(`activity.allTools`)}</option>
            ${t.map(e=>i`<option value=${e}>${e}</option>`)}
          </select>
        </label>
        <div class="activity-status-filters" role="group" aria-label=${l(`activity.statusFilters`)}>
          ${F.map(t=>W(e,t))}
        </div>
        <label class="activity-autofollow">
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${t=>e.onToggleAutoFollow(t.target.checked)}
          />
          <span>${l(`activity.autoFollow`)}</span>
        </label>
        <div class="activity-actions">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length===0}
            @click=${e.onExpandAll}
          >
            ${l(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size===0}
            @click=${e.onCollapseAll}
          >
            ${l(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length===0}
            @click=${e.onClear}
          >
            ${l(`activity.clear`)}
          </button>
        </div>
        <div class="activity-toolbar__count" aria-live="polite">
          ${l(`activity.visibleCount`,{visible:String(n.length),total:String(e.entries.length)})}
        </div>
      </div>

      <div
        class="activity-stream"
        role="list"
        aria-label=${l(`activity.streamLabel`)}
        @scroll=${e.onScroll}
      >
        ${n.length===0?i`
              <div class="activity-empty">
                ${e.entries.length===0||!r?l(`activity.empty`):l(`activity.emptyFiltered`)}
              </div>
            `:n.map(t=>G(e,t))}
      </div>
    </section>
  `}var q,J=class extends o{constructor(...e){super(...e),this.entries=[],this.filterText=``,this.statusFilters={running:!0,done:!0,error:!0},this.toolFilter=``,this.expandedIds=new Set,this.autoFollow=!0,this.atBottom=!0,this.sessionKey=``,this.replayFrame=null,this.scrollFrame=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncSessionKey(),this.stopGatewayEvents=this.context.gateway.subscribeEvents(e=>{this.applyGatewayEvent(e,Date.now())}),this.stopGatewaySubscription=this.context.gateway.subscribe(()=>{let e=this.sessionKey;this.syncSessionKey(),this.sessionKey!==e&&this.rebuildEntries()})}firstUpdated(){this.replayFrame=requestAnimationFrame(()=>{this.replayFrame=null,this.isConnected&&this.rebuildEntries()})}updated(e){this.autoFollow&&this.atBottom&&(e.has(`entries`)||e.has(`autoFollow`))&&this.scheduleScroll(e.has(`autoFollow`))}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopGatewayEvents?.(),this.stopGatewayEvents=void 0,this.replayFrame!==null&&(cancelAnimationFrame(this.replayFrame),this.replayFrame=null),this.scrollFrame!==null&&(cancelAnimationFrame(this.scrollFrame),this.scrollFrame=null),super.disconnectedCallback()}syncSessionKey(){let e=this.context.gateway.snapshot;this.sessionKey=m(g().sessionKey,e.hello)}rebuildEntries(){let e=[],t=this.context.gateway.eventLog,n=q?t.indexOf(q):-1,r=n<0?t:t.slice(0,n);for(let t of r.toReversed())e=this.reduceGatewayEvent(e,t.event,t.payload,t.ts);(e.length>0||this.entries.length>0)&&(this.entries=e),this.expandedIds.size>0&&(this.expandedIds=new Set),this.atBottom=!0}applyGatewayEvent(e,t){let n=this.reduceGatewayEvent(this.entries,e.event,e.payload,t);n!==this.entries&&(this.entries=n)}reduceGatewayEvent(e,t,n,r){if(t!==`agent`&&t!==`session.tool`)return e;let i=w(n,r);if(!i)return e;let a=this.context.gateway.snapshot;return u({sessionKey:this.sessionKey,assistantAgentId:a.assistantAgentId,hello:a.hello},i.sessionKey,i.agentId)?P(e,i):e}scheduleScroll(e=!1){this.scrollFrame!==null&&cancelAnimationFrame(this.scrollFrame),this.updateComplete.then(()=>{this.isConnected&&(this.scrollFrame=requestAnimationFrame(()=>{this.scrollFrame=null;let t=this.querySelector(`.activity-stream`);if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;!e&&(!this.autoFollow||!this.atBottom&&n>=120)||(t.scrollTop=t.scrollHeight,this.atBottom=!0)}))})}handleScroll(e){let t=e.currentTarget;if(!t)return;let n=t.scrollHeight-t.scrollTop-t.clientHeight;this.atBottom=n<120}clearEntries(){q=this.context.gateway.eventLog[0],this.entries=[],this.expandedIds=new Set,this.atBottom=!0}render(){return i`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${f(`activity`)}</div>
          <div class="page-sub">${p(`activity`)}</div>
        </div>
      </section>
      ${K({entries:this.entries,filterText:this.filterText,statusFilters:this.statusFilters,toolFilter:this.toolFilter,expandedIds:this.expandedIds,autoFollow:this.autoFollow,onFilterTextChange:e=>this.filterText=e,onToolFilterChange:e=>this.toolFilter=e,onStatusToggle:(e,t)=>{this.statusFilters={...this.statusFilters,[e]:t}},onToggleAutoFollow:e=>{this.autoFollow=e,e&&this.scheduleScroll(!0)},onClear:()=>this.clearEntries(),onExpandAll:()=>{this.expandedIds=new Set(this.entries.map(e=>e.id))},onCollapseAll:()=>{this.expandedIds=new Set},onEntryToggle:(e,t)=>{let n=new Set(this.expandedIds);t?n.add(e):n.delete(e),this.expandedIds=n},onScroll:e=>this.handleScroll(e)})}
    `}};n([t({context:e,subscribe:!1})],J.prototype,`context`,void 0),n([r()],J.prototype,`entries`,void 0),n([r()],J.prototype,`filterText`,void 0),n([r()],J.prototype,`statusFilters`,void 0),n([r()],J.prototype,`toolFilter`,void 0),n([r()],J.prototype,`expandedIds`,void 0),n([r()],J.prototype,`autoFollow`,void 0),n([r()],J.prototype,`atBottom`,void 0),customElements.define(`openclaw-activity-page`,J);
//# sourceMappingURL=activity-page-DaWyspbl.js.map