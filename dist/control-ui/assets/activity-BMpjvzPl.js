import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n,t as r}from"./string-coerce-BCNOsX82.js";import{At as i,et as a,y as o}from"./index-BU6y7qJm.js";var s=[`running`,`done`,`error`];function c(e){return a(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function l(e){if(!Number.isFinite(e)||e<0)return n(`common.na`);if(e<1e3)return n(`activity.duration.ms`,{count:String(Math.round(e))});if(e<6e4)return n(`activity.duration.seconds`,{count:(e/1e3).toFixed(1)});let t=Math.round(e/1e3),r=Math.floor(t/60),i=t%60;return n(`activity.duration.minutes`,{minutes:String(r),seconds:String(i)})}function u(e){return n(`activity.status.${e}`)}function d(e){return e===1?n(`activity.argumentHiddenOne`):n(`activity.argumentsHidden`,{count:String(e)})}function f(e){return n(`activity.entrySummary`,{argumentSummary:d(e.hiddenArgumentCount),status:u(e.status),tool:e.toolName})}function p(e,t){return t?r([e.toolName,e.status,e.summary,f(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t):!0}function m(e){return i(e.map(e=>e.toolName))}function h(e){let t=r(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:p(n,t))}function g(t,n){return e`
    <label class="activity-status-filter activity-status-filter--${n}">
      <input
        type="checkbox"
        .checked=${t.statusFilters[n]}
        @change=${e=>t.onStatusToggle(n,e.target.checked)}
      />
      <span>${u(n)}</span>
    </label>
  `}function _(r,i){let a=r.expandedIds.has(i.id);return e`
    <details
      class="activity-entry activity-entry--${i.status}"
      role="listitem"
      .open=${a}
      @toggle=${e=>r.onEntryToggle(i.id,e.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${o.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            <span class="activity-status activity-status--${i.status}">
              ${u(i.status)}
            </span>
            <span class="activity-entry__tool mono">${i.toolName}</span>
          </span>
          <span class="activity-entry__text">${f(i)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${c(i.updatedAt)}</span>
          <span>${l(i.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          <span>${d(i.hiddenArgumentCount)}</span>
          <span class="mono">${n(`activity.toolCallId`)}: ${i.toolCallId}</span>
          <span class="mono">${n(`activity.runId`)}: ${i.runId}</span>
          ${i.sessionKey?e`<span class="mono">${n(`activity.session`)}: ${i.sessionKey}</span>`:t}
        </div>
        ${i.outputPreview?e`
              <pre class="activity-entry__preview">${i.outputPreview}</pre>
              ${i.outputTruncated?e`<div class="activity-entry__note">${n(`activity.outputTruncated`)}</div>`:t}
            `:e`<div class="activity-entry__note">${n(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function v(t){let r=m(t.entries),i=h(t),a=t.filterText.trim()||t.toolFilter||s.some(e=>!t.statusFilters[e]);return e`
    <section class="activity-page" aria-label=${n(`activity.title`)}>
      <div class="activity-toolbar" aria-label=${n(`activity.filtersLabel`)}>
        <label class="activity-field activity-field--search">
          <span>${n(`activity.search`)}</span>
          <input
            type="search"
            .value=${t.filterText}
            placeholder=${n(`activity.searchPlaceholder`)}
            @input=${e=>t.onFilterTextChange(e.target.value)}
          />
        </label>
        <label class="activity-field">
          <span>${n(`activity.toolFilter`)}</span>
          <select
            .value=${t.toolFilter}
            @change=${e=>t.onToolFilterChange(e.target.value)}
          >
            <option value="">${n(`activity.allTools`)}</option>
            ${r.map(t=>e`<option value=${t}>${t}</option>`)}
          </select>
        </label>
        <div class="activity-status-filters" role="group" aria-label=${n(`activity.statusFilters`)}>
          ${s.map(e=>g(t,e))}
        </div>
        <label class="activity-autofollow">
          <input
            type="checkbox"
            .checked=${t.autoFollow}
            @change=${e=>t.onToggleAutoFollow(e.target.checked)}
          />
          <span>${n(`activity.autoFollow`)}</span>
        </label>
        <div class="activity-actions">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i.length===0}
            @click=${t.onExpandAll}
          >
            ${n(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${t.expandedIds.size===0}
            @click=${t.onCollapseAll}
          >
            ${n(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${t.entries.length===0}
            @click=${t.onClear}
          >
            ${n(`activity.clear`)}
          </button>
        </div>
        <div class="activity-toolbar__count" aria-live="polite">
          ${n(`activity.visibleCount`,{visible:String(i.length),total:String(t.entries.length)})}
        </div>
      </div>

      <div
        class="activity-stream"
        role="list"
        aria-label=${n(`activity.streamLabel`)}
        @scroll=${t.onScroll}
      >
        ${i.length===0?e`
              <div class="activity-empty">
                ${t.entries.length===0||!a?n(`activity.empty`):n(`activity.emptyFiltered`)}
              </div>
            `:i.map(e=>_(t,e))}
      </div>
    </section>
  `}export{v as renderActivity};
//# sourceMappingURL=activity-BMpjvzPl.js.map