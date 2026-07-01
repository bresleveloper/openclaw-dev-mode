import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n,r,t as i}from"./string-coerce-BCNOsX82.js";import{J as a,c as o,d as s,f as c,g as l,gt as u,h as d,nt as f,p,q as m,tt as h,wt as g,y as _}from"./index-D1fJtOtf.js";var v=[`off`,`minimal`,`low`,`medium`,`high`],y=[``,`off`,`on`,`full`],b=[``,`auto`,`on`,`off`],x=[``,`off`,`on`,`stream`],S=[10,25,50,100];function C(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function w(e,t){let n=m(e,t),r=s(e.thinkingDefault??(n?t?.thinkingDefault:void 0)),i=e.thinkingLevels?.length?e.thinkingLevels:n&&t?.thinkingLevels?.length?t.thinkingLevels:(e.thinkingOptions?.length?e.thinkingOptions:n&&t?.thinkingOptions?.length?t.thinkingOptions:v).map(e=>({id:p(e),label:e}));return[{value:``,label:r},...i.map(e=>({value:p(e.id),label:c(e.id,e.label)}))]}function ee(e,t){return!t||e.includes(t)?[...e]:[...e,t]}function T(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:c(t)}]}function te(){return y.map(e=>({value:e,label:n(e===``?`sessionsView.inherit`:e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function ne(){return b.map(e=>({value:e,label:n(e===``?`sessionsView.inherit`:`sessionsView.${e}`)}))}function E(e){switch(e){case`running`:return n(`sessionsView.statusRunning`);case`done`:return n(`sessionsView.statusDone`);case`failed`:return n(`sessionsView.statusFailed`);case`killed`:return n(`sessionsView.statusKilled`);case`timeout`:return n(`sessionsView.statusTimeout`);default:return n(`sessionsView.statusUnknown`)}}function D(e){if(a(e))return{label:n(`sessionsView.statusLive`),tone:`live`};if(e.status===`running`&&e.hasActiveRun===!1)return{label:n(`sessionsView.statusIdle`),tone:`idle`};if(e.status){let t=e.status===`done`?`done`:`failed`;return{label:E(e.status),tone:t}}return e.hasActiveRun===!1?{label:n(`sessionsView.statusIdle`),tone:`idle`}:{label:n(`sessionsView.statusUnknown`),tone:`muted`}}function O(t){let r=D(t),i=`${n(`sessionsView.status`)}: ${r.label}`;return e`
    <span
      class="session-status-badge session-status-badge--${r.tone}"
      title=${i}
      aria-label=${i}
    >
      <span class="session-status-badge__dot" aria-hidden="true"></span>
      <span class="session-status-badge__label">${r.label}</span>
    </span>
  `}function re(e){return e||null}function k(e,t,n){let r=i(t);return r?e.filter(e=>{let t=i(e.key),o=i(e.label),s=i(e.kind),c=i(e.displayName),d=i(u(e.agentRuntime)),f=i(e.status),p=e.goal?i(`${e.goal.objective} ${e.goal.status} ${l(e.goal)} ${e.goal.lastStatusNote??``}`):``,m=a(e)?`live running`:e.hasActiveRun===!1?`idle`:``;if(t.includes(r)||o.includes(r)||s.includes(r)||c.includes(r)||d.includes(r)||f.includes(r)||p.includes(r)||m.includes(r))return!0;let g=h(e.key);return(g?i(C(n,g.agentId)?.name):``).includes(r)}):e}function A(e,t,n){let r=n===`asc`?1:-1;return[...e].toSorted((e,n)=>{let i=0;switch(t){case`key`:i=(e.key??``).localeCompare(n.key??``);break;case`kind`:i=(e.kind??``).localeCompare(n.kind??``);break;case`updated`:i=(e.updatedAt??0)-(n.updatedAt??0);break;case`tokens`:i=(e.totalTokens??e.inputTokens??e.outputTokens??0)-(n.totalTokens??n.inputTokens??n.outputTokens??0);break}return i*r})}function j(e,t,n){let r=t*n;return e.slice(r,r+n)}function M(e){let t=Number(e.trim());return Number.isFinite(t)&&t>0}function N(e){return i(e.searchQuery).length>0||M(e.activeMinutes)||M(e.limit)||!e.includeGlobal||!e.includeUnknown||!e.showArchived}function ie(e){switch(e){case`manual`:return n(`sessionsView.manual`);case`auto-threshold`:return n(`sessionsView.autoThreshold`);case`overflow-retry`:return n(`sessionsView.overflowRetry`);case`timeout-retry`:return n(`sessionsView.timeoutRetry`);default:return e}}function P(e){return n(e===1?`sessionsView.checkpoint`:`sessionsView.checkpoints`,{count:String(e)})}function F(e){return typeof e.tokensBefore==`number`&&typeof e.tokensAfter==`number`&&Number.isFinite(e.tokensBefore)&&Number.isFinite(e.tokensAfter)?n(`sessionsView.tokenRange`,{before:e.tokensBefore.toLocaleString(),after:e.tokensAfter.toLocaleString()}):typeof e.tokensBefore==`number`&&Number.isFinite(e.tokensBefore)?n(`sessionsView.tokensBefore`,{count:e.tokensBefore.toLocaleString()}):n(`sessionsView.tokenDeltaUnavailable`)}function I(e){if(typeof e!=`number`||!Number.isFinite(e)||e<0)return null;let t=Math.round(e/1e3);if(t<60)return`${t}s`;let n=Math.floor(t/60),r=t%60;if(n<60)return r>0?`${n}m ${r}s`:`${n}m`;let i=Math.floor(n/60),a=n%60;return a>0?`${i}h ${a}m`:`${i}h`}function L(n){return n?e`
    <span
      class="session-goal-chip session-goal-chip--${n.status}"
      title=${d(n)}
      aria-label=${d(n)}
    >
      <span class="session-goal-chip__label">${l(n)}</span>
      <span class="session-goal-chip__objective">${n.objective}</span>
    </span>
  `:t}function R(e){let{row:t,updated:i,checkpointCount:a}=e,s=[{label:n(`sessionsView.key`),value:t.key},{label:n(`sessionsView.kind`),value:t.kind},{label:n(`sessionsView.updated`),value:i},{label:n(`sessionsView.tokens`),value:o(t)},{label:n(`sessionsView.compaction`),value:P(a)}],c=(e,t)=>{let n=r(t);n&&s.push({label:e,value:n})};return c(n(`sessionsView.status`),t.status),t.goal&&s.push({label:n(`sessionsView.goal`),value:d(t.goal)}),c(n(`sessionsView.goalNote`),t.goal?.lastStatusNote),c(n(`sessionsView.model`),t.model),c(n(`sessionsView.provider`),t.modelProvider),c(n(`sessionsView.runtime`),I(t.runtimeMs)),c(n(`sessionsView.surface`),t.surface),c(n(`sessionsView.subject`),t.subject),c(n(`sessionsView.room`),t.room),c(n(`sessionsView.space`),t.space),c(n(`sessionsView.sessionId`),t.sessionId),typeof t.hasActiveRun==`boolean`&&s.push({label:n(`sessionsView.activeRun`),value:t.hasActiveRun?n(`common.yes`):n(`common.no`)}),typeof t.archived==`boolean`&&s.push({label:n(`sessionsView.archived`),value:t.archived?n(`common.yes`):n(`common.no`)}),s}function z(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function B(t){return e`
    <label class=${[`session-filter-check`,`session-filter-toggle`,t.extraClass??``,t.checked?`session-filter-check--active`:``].filter(Boolean).join(` `)} data-tooltip=${t.title}>
      <input
        name=${t.name}
        class="session-filter-check__input"
        type="checkbox"
        .checked=${t.checked}
        @change=${e=>t.onChange(e.target.checked)}
      />
      <span class="session-filter-check__mark" aria-hidden="true">${_.check}</span>
      <span class="session-filter-check__label">${t.label}</span>
    </label>
  `}function V(r){let i=r.result?.sessions??[],a=k(i,r.searchQuery,r.agentIdentityById),o=A(a,r.sortColumn,r.sortDir),s=o.length,c=Math.max(1,Math.ceil(s/r.pageSize)),l=Math.min(r.page,c-1),u=j(o,l,r.pageSize),d=i.length===0?N(r):a.length===0,f=n(`sessionsView.activeTooltip`,{count:r.activeMinutes.trim()}),p=n(`sessionsView.limitTooltip`),m=n(`sessionsView.globalTooltip`),h=n(`sessionsView.unknownTooltip`),g=n(`sessionsView.showArchivedTooltip`),v=!r.filtersCollapsed,y=n(`sessionsView.filters`),b=n(v?`sessionsView.hideFilters`:`sessionsView.showFilters`),x=(t,n,i=``)=>{let a=r.sortColumn===t,o=a&&r.sortDir===`asc`?`desc`:`asc`;return e`
      <th
        class=${i}
        data-sortable
        data-sort-dir=${a?r.sortDir:``}
        @click=${()=>r.onSortChange(t,a?o:`desc`)}
      >
        ${n}
        <span class="data-table-sort-icon">${_.arrowUpDown}</span>
      </th>
    `};return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; margin-bottom: 12px;">
        <div>
          <div class="card-title">${n(`sessionsView.title`)}</div>
          <div class="card-sub">
            ${r.result?n(`sessionsView.store`,{path:r.result.path}):n(`sessionsView.subtitle`)}
          </div>
        </div>
        <button class="btn" ?disabled=${r.loading} @click=${r.onRefresh}>
          ${r.loading?n(`common.loading`):n(`common.refresh`)}
        </button>
      </div>

      <div class="sessions-filter-panel">
        <div class="sessions-filter-panel__header">
          <div class="sessions-filter-panel__title">${y}</div>
          <button
            class="sessions-filter-panel__toggle"
            type="button"
            aria-expanded=${String(v)}
            aria-controls="sessions-filter-bar"
            @click=${r.onToggleFiltersCollapsed}
          >
            ${v?_.chevronDown:_.chevronRight}
            <span>${b}</span>
          </button>
        </div>

        ${v?e`
              <div
                id="sessions-filter-bar"
                class="sessions-filter-bar"
                aria-label="Session filters"
              >
                <div class="session-filter-primary-row">
                  <label class="session-filter-field" data-tooltip=${f}>
                    <span class="session-filter-label">${n(`sessionsView.active`)}</span>
                    <input
                      class="session-filter-input session-filter-input--minutes"
                      placeholder=${n(`sessionsView.minutesPlaceholder`)}
                      .value=${r.activeMinutes}
                      ?disabled=${r.showArchived}
                      @input=${e=>r.onFiltersChange({activeMinutes:e.target.value,limit:r.limit,includeGlobal:r.includeGlobal,includeUnknown:r.includeUnknown,showArchived:r.showArchived})}
                    />
                  </label>
                  <label class="session-filter-field" data-tooltip=${p}>
                    <span class="session-filter-label">${n(`sessionsView.limit`)}</span>
                    <input
                      class="session-filter-input session-filter-input--limit"
                      .value=${r.limit}
                      @input=${e=>r.onFiltersChange({activeMinutes:r.activeMinutes,limit:e.target.value,includeGlobal:r.includeGlobal,includeUnknown:r.includeUnknown,showArchived:r.showArchived})}
                    />
                  </label>
                </div>
                <div
                  class="session-filter-toggle-group"
                  role="group"
                  aria-label=${n(`sessionsView.sourceFilters`)}
                >
                  ${B({name:`includeGlobal`,checked:r.includeGlobal,label:n(`sessionsView.global`),title:m,onChange:e=>r.onFiltersChange({activeMinutes:r.activeMinutes,limit:r.limit,includeGlobal:e,includeUnknown:r.includeUnknown,showArchived:r.showArchived})})}
                  ${B({name:`includeUnknown`,checked:r.includeUnknown,label:n(`sessionsView.unknown`),title:h,onChange:e=>r.onFiltersChange({activeMinutes:r.activeMinutes,limit:r.limit,includeGlobal:r.includeGlobal,includeUnknown:e,showArchived:r.showArchived})})}
                  ${B({name:`showArchived`,checked:r.showArchived,label:n(`sessionsView.showArchived`),title:g,extraClass:`session-archive-toggle`,onChange:e=>r.onFiltersChange({activeMinutes:r.activeMinutes,limit:r.limit,includeGlobal:r.includeGlobal,includeUnknown:r.includeUnknown,showArchived:e})})}
                </div>
              </div>
            `:t}
      </div>

      ${r.error?e`<div class="callout danger" style="margin-bottom: 12px;">${r.error}</div>`:t}

      <div class="data-table-wrapper">
        <div class="data-table-toolbar">
          <div class="data-table-search">
            <input
              type="text"
              placeholder=${n(`sessionsView.searchPlaceholder`)}
              .value=${r.searchQuery}
              @input=${e=>r.onSearchChange(e.target.value)}
            />
          </div>
        </div>

        ${r.selectedKeys.size>0?e`
              <div class="data-table-bulk-bar">
                <span
                  >${n(`sessionsView.selected`,{count:String(r.selectedKeys.size)})}</span
                >
                <button class="btn btn--sm" @click=${r.onDeselectAll}>
                  ${n(`common.unselect`)}
                </button>
                <button
                  class="btn btn--sm danger"
                  ?disabled=${r.loading}
                  @click=${r.onDeleteSelected}
                >
                  ${_.trash} ${n(`sessionsView.deleteSelected`)}
                </button>
              </div>
            `:t}

        <div class="data-table-container">
          <table class="data-table sessions-table">
            <thead>
              <tr>
                <th class="data-table-checkbox-col">
                  ${u.length>0?e`<input
                        type="checkbox"
                        .checked=${u.length>0&&u.every(e=>r.selectedKeys.has(e.key))}
                        .indeterminate=${u.some(e=>r.selectedKeys.has(e.key))&&!u.every(e=>r.selectedKeys.has(e.key))}
                        @change=${()=>{u.every(e=>r.selectedKeys.has(e.key))?r.onDeselectPage(u.map(e=>e.key)):r.onSelectPage(u.map(e=>e.key))}}
                        aria-label=${n(`sessionsView.selectAllOnPage`)}
                      />`:t}
                </th>
                ${x(`key`,n(`sessionsView.key`),`data-table-key-col`)}
                <th>${n(`sessionsView.label`)}</th>
                ${x(`kind`,n(`sessionsView.kind`))}
                <th class="session-status-col">${n(`sessionsView.status`)}</th>
                <th>${n(`agents.context.runtime`)}</th>
                ${x(`updated`,n(`sessionsView.updated`))}
                ${x(`tokens`,n(`sessionsView.tokens`))}
                <th class="session-compaction-col">${n(`sessionsView.compaction`)}</th>
                <th>${n(`sessionsView.thinking`)}</th>
                <th>${n(`sessionsView.fast`)}</th>
                <th>${n(`sessionsView.verbose`)}</th>
                <th>${n(`sessionsView.reasoning`)}</th>
                <th>${n(`sessionsView.actions`)}</th>
              </tr>
            </thead>
            <tbody>
              ${u.length===0?e`
                    <tr>
                      <td colspan="14" class="data-table-empty-cell">
                        ${d?e`
                              <div class="data-table-empty-state" role="status" aria-live="polite">
                                <div>${n(`sessionsView.noSessionsMatchFilters`)}</div>
                                <button class="btn btn--sm" @click=${r.onClearFilters}>
                                  ${n(`sessionsView.showAll`)}
                                </button>
                              </div>
                            `:n(`sessionsView.noSessions`)}
                      </td>
                    </tr>
                  `:u.flatMap(e=>H(e,r))}
            </tbody>
          </table>
        </div>

        ${s>0?e`
              <div class="data-table-pagination">
                <div class="data-table-pagination__info">
                  ${l*r.pageSize+1}-${Math.min((l+1)*r.pageSize,s)}
                  of ${s} row${s===1?``:`s`}
                </div>
                <div class="data-table-pagination__controls">
                  <select
                    style="height: 32px; padding: 0 8px; font-size: 13px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--card);"
                    .value=${String(r.pageSize)}
                    @change=${e=>r.onPageSizeChange(Number(e.target.value))}
                  >
                    ${S.map(t=>e`<option value=${t}>${t} per page</option>`)}
                  </select>
                  <button ?disabled=${l<=0} @click=${()=>r.onPageChange(l-1)}>
                    Previous
                  </button>
                  <button
                    ?disabled=${l>=c-1}
                    @click=${()=>r.onPageChange(l+1)}
                  >
                    ${n(`common.next`)}
                  </button>
                </div>
              </div>
            `:t}
      </div>
    </section>
  `}function H(i,a){let s=i.updatedAt?f(i.updatedAt):n(`common.na`),c=i.thinkingLevel??``,l=c?p(c):``,d=T(w(i,a.result?.defaults),l),m=i.fastMode===`auto`?`auto`:i.fastMode===!0?`on`:i.fastMode===!1?`off`:``,v=T(ne(),m),y=i.verboseLevel??``,b=T(te(),y),S=i.reasoningLevel??``,E=ee(x,S),D=i.latestCompactionCheckpoint,k=i.compactionCheckpointCount??0,A=Math.max(k,+!!D),j=k>0||!!D,M=a.expandedCheckpointKey===i.key,N=a.checkpointItemsByKey[i.key]??[],I=a.checkpointErrorByKey[i.key],B=`session-checkpoints-${encodeURIComponent(i.key)}`,V=P(A),H=R({row:i,updated:s,checkpointCount:A}),U=r(i.displayName)??null,ae=r(i.label)??``,W=!!(U&&U!==i.key&&U!==ae),G=h(i.key),K=G?C(a.agentIdentityById,G.agentId):null,q=r(K?.emoji)??``,J=r(K?.name)??``,Y=J&&G?`${q?`${q} `:``}${J} (${G.channel})`:null,oe=Y??i.key,X=i.kind!==`global`,Z=a.workboardSessionKeys?.has(i.key)===!0,se=a.workboardBusySessionKey===i.key,ce=X?`${g(`chat`,a.basePath)}?session=${encodeURIComponent(i.key)}`:null,Q=i.kind===`cron`?`data-table-badge--cron`:i.kind===`direct`?`data-table-badge--direct`:i.kind===`group`?`data-table-badge--group`:i.kind===`global`?`data-table-badge--global`:`data-table-badge--unknown`,le=[`session-data-row`,j?`session-data-row--expandable`:``,M?`session-data-row--expanded`:``].filter(Boolean).join(` `),$=()=>{j&&a.onToggleCheckpointDetails(i.key)};return[e`<tr
      class=${le}
      tabindex=${j?`0`:t}
      aria-expanded=${j?String(M):t}
      aria-controls=${j?B:t}
      @click=${e=>{!j||z(e.target)||$()}}
      @keydown=${e=>{!j||z(e.target)||(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),$())}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${a.selectedKeys.has(i.key)}
          @change=${()=>a.onToggleSelect(i.key)}
          aria-label=${n(`sessionsView.selectSession`)}
        />
      </td>
      <td class="data-table-key-col">
        <div
          class=${Y?`session-key-cell`:`mono session-key-cell`}
          title=${oe}
        >
          ${X?e`<a
                href=${ce}
                class="session-link"
                @click=${e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.onNavigateToChat&&(e.preventDefault(),a.onNavigateToChat(i.key))}}
                >${Y??i.key}</a
              >`:Y??i.key}
          ${W?e`<span class="muted session-key-display-name">${U}</span>`:t}
        </div>
      </td>
      <td>
        <input
          .value=${i.label??``}
          ?disabled=${a.loading}
          placeholder=${n(`sessionsView.optionalPlaceholder`)}
          style="width: 100%; max-width: 140px; padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm);"
          @change=${e=>{let t=r(e.target.value)??null;a.onPatch(i.key,{label:t})}}
        />
      </td>
      <td>
        <span class="data-table-badge ${Q}">${i.kind}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${O(i)} ${L(i.goal)}
        </div>
      </td>
      <td class="session-runtime-cell">
        <span class="mono">${u(i.agentRuntime)}</span>
      </td>
      <td>${s}</td>
      <td class="session-token-cell">${o(i)}</td>
      <td class="session-compaction-col">
        <div class="session-compaction-cell">
          ${j?e`
                <button
                  class="session-compaction-trigger"
                  type="button"
                  aria-expanded=${String(M)}
                  aria-controls=${B}
                  aria-label=${n(M?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:V})}
                  @click=${e=>{e.stopPropagation(),$()}}
                >
                  <span class="session-compaction-count">${V}</span>
                </button>
              `:e`<span class="muted session-compaction-count">${n(`common.none`)}</span>`}
        </div>
      </td>
      <td>
        <select
          ?disabled=${a.loading}
          style="padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm); min-width: 90px;"
          @change=${e=>{let t=e.target.value;a.onPatch(i.key,{thinkingLevel:re(t)})}}
        >
          ${d.map(t=>e`<option value=${t.value} ?selected=${l===t.value}>
                ${t.label}
              </option>`)}
        </select>
      </td>
      <td>
        <select
          ?disabled=${a.loading}
          style="padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm); min-width: 90px;"
          @change=${e=>{let t=e.target.value;a.onPatch(i.key,{fastMode:t===``?null:t===`auto`?`auto`:t===`on`})}}
        >
          ${v.map(t=>e`<option value=${t.value} ?selected=${m===t.value}>
                ${t.label}
              </option>`)}
        </select>
      </td>
      <td>
        <select
          ?disabled=${a.loading}
          style="padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm); min-width: 90px;"
          @change=${e=>{let t=e.target.value;a.onPatch(i.key,{verboseLevel:t||null})}}
        >
          ${b.map(t=>e`<option value=${t.value} ?selected=${y===t.value}>
                ${t.label}
              </option>`)}
        </select>
      </td>
      <td>
        <select
          ?disabled=${a.loading}
          style="padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm); min-width: 90px;"
          @change=${e=>{let t=e.target.value;a.onPatch(i.key,{reasoningLevel:t||null})}}
        >
          ${E.map(t=>e`<option value=${t} ?selected=${S===t}>
                ${t||n(`sessionsView.inherit`)}
              </option>`)}
        </select>
      </td>
      <td>
        ${a.onAddToWorkboard&&X?e`
              <button
                class="icon-btn"
                title=${n(Z?`sessionsView.openWorkboardCard`:`sessionsView.addToWorkboard`)}
                ?disabled=${a.loading||se}
                @click=${e=>{e.stopPropagation(),a.onAddToWorkboard?.(i)}}
              >
                ${Z?_.check:_.plus}
              </button>
            `:t}
      </td>
    </tr>`,...M&&j?[e`<tr id=${B} class="session-checkpoint-details-row">
            <td colspan="14">
              <div class="session-details-panel">
                <div class="session-details-panel__hero">
                  <div>
                    <div class="session-details-panel__eyebrow">
                      ${n(`sessionsView.sessionDetails`)}
                    </div>
                    <div class="session-details-panel__title">${Y??i.key}</div>
                    ${W?e`
                          <div class="muted session-details-panel__subtitle">${U}</div>
                        `:t}
                  </div>
                  <div class="session-details-panel__badges">
                    ${O(i)} ${L(i.goal)}
                    <span class="data-table-badge ${Q}">${i.kind}</span>
                  </div>
                </div>

                <div class="session-details-grid">
                  ${H.map(t=>e`
                      <div class="session-detail-stat">
                        <div class="session-detail-stat__label">${t.label}</div>
                        <div class="session-detail-stat__value" title=${t.value}>
                          ${t.value}
                        </div>
                      </div>
                    `)}
                </div>

                <div class="session-details-section">
                  <div class="session-details-section__header">
                    <div>
                      <div class="session-details-panel__eyebrow">
                        ${n(`sessionsView.compactionHistory`)}
                      </div>
                      <div class="session-details-section__title">${V}</div>
                    </div>
                  </div>
                  ${a.checkpointLoadingKey===i.key?e`<div class="muted session-details-empty">
                        ${n(`sessionsView.loadingCheckpoints`)}
                      </div>`:I?e`<div class="callout danger">${I}</div>`:N.length===0?e`<div class="muted session-details-empty">
                            ${n(`sessionsView.noCheckpoints`)}
                          </div>`:e`
                            <div class="session-checkpoint-list">
                              ${N.map(t=>e`
                                  <div class="session-checkpoint-card">
                                    <div class="session-checkpoint-card__header">
                                      <strong>
                                        ${ie(t.reason)} ·
                                        ${f(t.createdAt)}
                                      </strong>
                                      <span class="muted session-checkpoint-card__delta">
                                        ${F(t)}
                                      </span>
                                    </div>
                                    ${t.summary?e`<div class="session-checkpoint-card__summary">
                                          ${t.summary}
                                        </div>`:e`
                                          <div class="muted">${n(`sessionsView.noSummary`)}</div>
                                        `}
                                    <div class="session-checkpoint-card__actions">
                                      <button
                                        class="btn btn--sm"
                                        ?disabled=${a.checkpointBusyKey===t.checkpointId}
                                        @click=${()=>a.onBranchFromCheckpoint(i.key,t.checkpointId)}
                                      >
                                        ${n(`sessionsView.branchFromCheckpoint`)}
                                      </button>
                                      <button
                                        class="btn btn--sm"
                                        ?disabled=${a.checkpointBusyKey===t.checkpointId}
                                        @click=${()=>a.onRestoreCheckpoint(i.key,t.checkpointId)}
                                      >
                                        ${n(`sessionsView.restoreCheckpoint`)}
                                      </button>
                                    </div>
                                  </div>
                                `)}
                            </div>
                          `}
                </div>
              </div>
            </td>
          </tr>`]:[]]}export{V as renderSessions};
//# sourceMappingURL=sessions-uWE1bn_K.js.map