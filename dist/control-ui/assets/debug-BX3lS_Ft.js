import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n}from"./string-coerce-BCNOsX82.js";import{a as r,et as i}from"./index-D1fJtOtf.js";function a(a){let o=(a.status&&typeof a.status==`object`?a.status.securityAudit:null)?.summary??null,s=o?.critical??0,c=o?.warn??0,l=o?.info??0,u=s>0?`danger`:c>0?`warn`:`success`,d=s>0?n(`debug.security.critical`,{count:String(s)}):c>0?n(`debug.security.warnings`,{count:String(c)}):n(`debug.security.noCriticalIssues`);return e`
    <section class="grid">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${n(`debug.snapshotsTitle`)}</div>
            <div class="card-sub">${n(`debug.snapshotsSubtitle`)}</div>
          </div>
          <button class="btn" ?disabled=${a.loading} @click=${a.onRefresh}>
            ${a.loading?n(`common.refreshing`):n(`common.refresh`)}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">${n(`debug.status`)}</div>
            ${o?e`<div class="callout ${u}" style="margin-top: 8px;">
                  ${n(`debug.security.audit`)}:
                  ${d}${l>0?` · ${n(`debug.security.info`,{count:String(l)})}`:``}.
                  ${n(`debug.security.runPrefix`)}
                  <span class="mono">openclaw security audit --deep</span>
                  ${n(`debug.security.runSuffix`)}
                </div>`:t}
            <pre class="code-block">${JSON.stringify(a.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">${n(`debug.health`)}</div>
            <pre class="code-block">${JSON.stringify(a.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">${n(`debug.lastHeartbeat`)}</div>
            <pre class="code-block">${JSON.stringify(a.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${n(`debug.manualRpcTitle`)}</div>
        <div class="card-sub">${n(`debug.manualRpcSubtitle`)}</div>
        <div class="stack" style="margin-top: 16px;">
          <label class="field">
            <span>${n(`debug.method`)}</span>
            <select
              .value=${a.callMethod}
              @change=${e=>a.onCallMethodChange(e.target.value)}
            >
              ${a.callMethod?t:e` <option value="" disabled>${n(`debug.selectMethod`)}</option> `}
              ${a.methods.map(t=>e`<option value=${t}>${t}</option>`)}
            </select>
          </label>
          <label class="field">
            <span>${n(`debug.paramsJson`)}</span>
            <textarea
              .value=${a.callParams}
              @input=${e=>a.onCallParamsChange(e.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${a.onCall}>${n(`common.call`)}</button>
        </div>
        ${a.callError?e`<div class="callout danger" style="margin-top: 12px;">${a.callError}</div>`:t}
        ${a.callResult?e`<pre class="code-block" style="margin-top: 12px;">${a.callResult}</pre>`:t}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${n(`debug.modelsTitle`)}</div>
      <div class="card-sub">${n(`debug.modelsSubtitle`)}</div>
      <pre class="code-block" style="margin-top: 12px;">
${JSON.stringify(a.models??[],null,2)}</pre
      >
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${n(`debug.eventLogTitle`)}</div>
      <div class="card-sub">${n(`debug.eventLogSubtitle`)}</div>
      ${a.eventLog.length===0?e` <div class="muted" style="margin-top: 12px">${n(`debug.noEvents`)}</div> `:e`
            <div class="list debug-event-log" style="margin-top: 12px;">
              ${a.eventLog.map(t=>e`
                  <div class="list-item debug-event-log__item">
                    <div class="list-main">
                      <div class="list-title">${t.event}</div>
                      <div class="list-sub">${i(t.ts,void 0,``)}</div>
                    </div>
                    <div class="list-meta debug-event-log__meta">
                      <pre class="code-block debug-event-log__payload">
${r(t.payload)}</pre
                      >
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}export{a as renderDebug};
//# sourceMappingURL=debug-BX3lS_Ft.js.map