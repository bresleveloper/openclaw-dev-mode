import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n,t as r}from"./string-coerce-BCNOsX82.js";var i=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`];function a(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function o(e,t){return t?r([e.message,e.subsystem,e.raw].filter(Boolean).join(` `)).includes(t):!0}function s(s){let c=r(s.filterText),l=i.some(e=>!s.levelFilters[e]),u=s.entries.filter(e=>e.level&&!s.levelFilters[e.level]?!1:o(e,c)),d=c||l?`filtered`:`visible`,f=n(`logsView.exportLabels.${d}`);return e`
    <section class="card card--fill-height">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${n(`logsView.title`)}</div>
          <div class="card-sub">${n(`logsView.subtitle`)}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${s.loading} @click=${s.onRefresh}>
            ${s.loading?n(`common.loading`):n(`common.refresh`)}
          </button>
          <button
            class="btn"
            ?disabled=${u.length===0}
            @click=${()=>s.onExport(u.map(e=>e.raw),d)}
          >
            ${n(`logsView.exportButton`,{label:f})}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>${n(`logsView.filter`)}</span>
          <input
            .value=${s.filterText}
            @input=${e=>s.onFilterTextChange(e.target.value)}
            placeholder=${n(`logsView.searchPlaceholder`)}
          />
        </label>
        <label class="field checkbox">
          <span>${n(`logsView.autoFollow`)}</span>
          <input
            type="checkbox"
            .checked=${s.autoFollow}
            @change=${e=>s.onToggleAutoFollow(e.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${i.map(t=>e`
            <label class="chip log-chip ${t}">
              <input
                type="checkbox"
                .checked=${s.levelFilters[t]}
                @change=${e=>s.onLevelToggle(t,e.target.checked)}
              />
              <span>${t}</span>
            </label>
          `)}
      </div>

      ${s.file?e`
            <div class="muted" style="margin-top: 10px;">
              ${n(`logsView.file`,{file:s.file})}
            </div>
          `:t}
      ${s.truncated?e` <div class="callout" style="margin-top: 10px">${n(`logsView.truncated`)}</div> `:t}
      ${s.error?e`<div class="callout danger" style="margin-top: 10px;">${s.error}</div>`:t}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${s.onScroll}>
        ${u.length===0?e` <div class="muted" style="padding: 12px">${n(`logsView.empty`)}</div> `:u.map(t=>e`
                <div class="log-row">
                  <div class="log-time mono">${a(t.time)}</div>
                  <div class="log-level ${t.level??``}">${t.level??``}</div>
                  <div class="log-subsystem mono">${t.subsystem??``}</div>
                  <div class="log-message mono">${t.message??t.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}export{s as renderLogs};
//# sourceMappingURL=logs-CnpeUOtx.js.map