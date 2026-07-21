import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o,p as s}from"./lit-runtime-B2f-BITn.js";import{r as c,t as l}from"./string-coerce-BuYUxt7q.js";import{o as u,r as d}from"./i18n-Cb2Gon67.js";import{o as f}from"./app-route-paths-Ckh-KQjG.js";import{d as p,i as m,p as h,r as g}from"./session-key-O2mAF18C.js";import{$n as _,Er as v,Fr as y,Jn as b,On as x,Pr as S,Qn as C,U as w,Un as T,Yn as E,Zn as D,ar as O,br as ee,er as k,gr as A,ir as te,r as ne,tr as j}from"./index-DMlQdn8s.js";import{f as M}from"./display-DUm1hEc9.js";import{s as N}from"./presenter-TTfHKEn1.js";import{f as P,g as F,i as I,l as L,s as R,t as z}from"./session-goal-DS5mxosR.js";var re=[`off`,`minimal`,`low`,`medium`,`high`],ie=[``,`off`,`on`,`full`],ae=[``,`auto`,`on`,`off`],oe=[``,`off`,`on`,`stream`],se=[10,25,50,100];function B(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function ce(e,t){let n=F(e,t),r=R(e.thinkingDefault??(n?t?.thinkingDefault:void 0)),i=e.thinkingLevels?.length?e.thinkingLevels:n&&t?.thinkingLevels?.length?t.thinkingLevels:(e.thinkingOptions?.length?e.thinkingOptions:n&&t?.thinkingOptions?.length?t.thinkingOptions:re).map(e=>({id:P(e),label:e}));return[{value:``,label:r},...i.map(e=>({value:P(e.id),label:L(e.id,e.label)}))]}function le(e,t){return!t||e.includes(t)?[...e]:[...e,t]}function V(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:L(t)}]}function ue(){return ie.map(e=>({value:e,label:d(e===``?`sessionsView.inherit`:e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function de(){return ae.map(e=>({value:e,label:d(e===``?`sessionsView.inherit`:`sessionsView.${e}`)}))}function fe(e){switch(e){case`running`:return d(`sessionsView.statusRunning`);case`done`:return d(`sessionsView.statusDone`);case`failed`:return d(`sessionsView.statusFailed`);case`killed`:return d(`sessionsView.statusKilled`);case`timeout`:return d(`sessionsView.statusTimeout`);default:return d(`sessionsView.statusUnknown`)}}function pe(e){if(D(e))return{label:d(`sessionsView.statusLive`),tone:`live`};if(e.status===`running`&&e.hasActiveRun===!1)return{label:d(`sessionsView.statusIdle`),tone:`idle`};if(e.status){let t=e.status===`done`?`done`:`failed`;return{label:fe(e.status),tone:t}}return e.hasActiveRun===!1?{label:d(`sessionsView.statusIdle`),tone:`idle`}:{label:d(`sessionsView.statusUnknown`),tone:`muted`}}function H(e){let t=pe(e),n=`${d(`sessionsView.status`)}: ${t.label}`;return i`
    <openclaw-tooltip .content=${n}>
      <span class="session-status-badge session-status-badge--${t.tone}" aria-label=${n}>
        <span class="session-status-badge__dot" aria-hidden="true"></span>
        <span class="session-status-badge__label">${t.label}</span>
      </span>
    </openclaw-tooltip>
  `}function me(e){return e||null}function he(e,t,n){let r=l(t);return r?e.filter(e=>{let t=l(e.key),i=l(e.label),a=l(e.category),o=l(e.kind),s=l(e.displayName),c=l(M(e.agentRuntime)),u=l(e.status),d=e.goal?l(`${e.goal.objective} ${e.goal.status} ${I(e.goal)} ${e.goal.lastStatusNote??``}`):``,f=D(e)?`live running`:e.hasActiveRun===!1?`idle`:``;if(t.includes(r)||i.includes(r)||a.includes(r)||o.includes(r)||s.includes(r)||c.includes(r)||u.includes(r)||d.includes(r)||f.includes(r))return!0;let p=A(e.key);return(p?l(B(n,p.agentId)?.name):``).includes(r)}):e}function ge(e,t,n){let r=n===`asc`?1:-1;return[...e].toSorted((e,n)=>{let i=(n.pinnedAt??0)-(e.pinnedAt??0);if(i!==0)return i;let a=0;switch(t){case`key`:a=(e.key??``).localeCompare(n.key??``);break;case`kind`:a=(e.kind??``).localeCompare(n.kind??``);break;case`updated`:a=(e.updatedAt??0)-(n.updatedAt??0);break;case`tokens`:a=(e.totalTokens??e.inputTokens??e.outputTokens??0)-(n.totalTokens??n.inputTokens??n.outputTokens??0);break}return a*r})}function _e(e,t,n){let r=t*n;return e.slice(r,r+n)}function U(e){let t=Number(e.trim());return Number.isFinite(t)&&t>0}function ve(e){return l(e.searchQuery).length>0||U(e.activeMinutes)||U(e.limit)||!e.includeGlobal||!e.includeUnknown||!e.showArchived}function ye(e){switch(e){case`manual`:return d(`sessionsView.manual`);case`auto-threshold`:return d(`sessionsView.autoThreshold`);case`overflow-retry`:return d(`sessionsView.overflowRetry`);case`timeout-retry`:return d(`sessionsView.timeoutRetry`);default:return e}}function W(e){return d(e===1?`sessionsView.checkpoint`:`sessionsView.checkpoints`,{count:String(e)})}function be(e){return typeof e.tokensBefore==`number`&&typeof e.tokensAfter==`number`&&Number.isFinite(e.tokensBefore)&&Number.isFinite(e.tokensAfter)?d(`sessionsView.tokenRange`,{before:e.tokensBefore.toLocaleString(),after:e.tokensAfter.toLocaleString()}):typeof e.tokensBefore==`number`&&Number.isFinite(e.tokensBefore)?d(`sessionsView.tokensBefore`,{count:e.tokensBefore.toLocaleString()}):d(`sessionsView.tokenDeltaUnavailable`)}function xe(e){if(typeof e!=`number`||!Number.isFinite(e)||e<0)return null;let t=Math.round(e/1e3);if(t<60)return`${t}s`;let n=Math.floor(t/60),r=t%60;if(n<60)return r>0?`${n}m ${r}s`:`${n}m`;let i=Math.floor(n/60),a=n%60;return a>0?`${i}h ${a}m`:`${i}h`}function G(e){if(!e)return a;let t=z(e);return i`
    <openclaw-tooltip .content=${t}>
      <span class="session-goal-chip session-goal-chip--${e.status}" aria-label=${t}>
        <span class="session-goal-chip__label">${I(e)}</span>
        <span class="session-goal-chip__objective">${e.objective}</span>
      </span>
    </openclaw-tooltip>
  `}function Se(e){let{row:t,updated:n,checkpointCount:r}=e,i=[{label:d(`sessionsView.key`),value:t.key},{label:d(`sessionsView.kind`),value:t.kind},{label:d(`sessionsView.updated`),value:n},{label:d(`sessionsView.tokens`),value:N(t)},{label:d(`sessionsView.compaction`),value:W(r)}],a=(e,t)=>{let n=c(t);n&&i.push({label:e,value:n})};return a(d(`sessionsView.group`),t.category),a(d(`sessionsView.status`),t.status),t.goal&&i.push({label:d(`sessionsView.goal`),value:z(t.goal)}),a(d(`sessionsView.goalNote`),t.goal?.lastStatusNote),a(d(`sessionsView.model`),t.model),a(d(`sessionsView.provider`),t.modelProvider),a(d(`sessionsView.runtime`),xe(t.runtimeMs)),a(d(`sessionsView.surface`),t.surface),a(d(`sessionsView.subject`),t.subject),a(d(`sessionsView.room`),t.room),a(d(`sessionsView.space`),t.space),a(d(`sessionsView.sessionId`),t.sessionId),typeof t.hasActiveRun==`boolean`&&i.push({label:d(`sessionsView.activeRun`),value:t.hasActiveRun?d(`common.yes`):d(`common.no`)}),typeof t.archived==`boolean`&&i.push({label:d(`sessionsView.archived`),value:t.archived?d(`common.yes`):d(`common.no`)}),typeof t.pinned==`boolean`&&i.push({label:d(`sessionsView.pinned`),value:t.pinned?d(`common.yes`):d(`common.no`)}),i}var K=`__new-group__`;function q(e){return e.groupBy===`category`?9:8}function Ce(e){switch(e){case`category`:return d(`sessionsView.groupByCategory`);case`channel`:return d(`sessionsView.groupByChannel`);case`kind`:return d(`sessionsView.groupByKind`);case`agent`:return d(`sessionsView.groupByAgent`);case`date`:return d(`sessionsView.groupByDate`);default:return d(`sessionsView.groupByNone`)}}function we(e,t){if(t.groupBy===`date`)switch(e){case`today`:return d(`sessionsView.dateToday`);case`yesterday`:return d(`sessionsView.dateYesterday`);case`week`:return d(`sessionsView.dateThisWeek`);case`older`:return d(`sessionsView.dateOlder`);default:return d(`sessionsView.dateNoActivity`)}if(e===``)return d(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let n=B(t.agentIdentityById,e),r=c(n?.name);if(r){let e=c(n?.emoji);return e?`${e} ${r}`:r}}return e}function J(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Y(e,t){if(e.groupBy!==`category`)return{dragover:a,dragleave:a,drop:a};let n=e=>e.dataTransfer?.types.includes(j)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),J(e,!0))},dragleave:e=>J(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),J(r,!1);let i=r.dataTransfer?.getData(j);i&&e.onAssignCategory(i,t)}}}function Te(e,t){let n=we(e.id,t),r=e.rows.length===1?d(`sessionsView.groupRowCountOne`,{count:`1`}):d(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),a=Y(t,e.id===``?null:e.id);return i`
    <tr
      class="session-group-row"
      @dragover=${a.dragover}
      @dragleave=${a.dragleave}
      @drop=${a.drop}
    >
      <td colspan=${q(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${v.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function Ee(e,t){let n=c(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),i`
    <td>
      <select
        ?disabled=${t.loading}
        aria-label=${d(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{let i=r.target;if(i.value===K){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!n}>${d(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>i`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option value=${K}>${d(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function X(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function Z(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return i`
    <openclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${t=>e.onChange(t.target.checked)}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${v.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </openclaw-tooltip>
  `}function Q(e){return i`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="session-override-field__control"
        ?disabled=${e.disabled}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>i`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function De(e){let t=e.result?.sessions??[],n=he(t,e.searchQuery,e.agentIdentityById),r=ge(n,e.sortColumn,e.sortDir),o=r.length,s=Math.max(1,Math.ceil(o/e.pageSize)),c=Math.min(e.page,s-1),l=e.groupBy!==`none`,u=l?_({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}):null,f=l?r:_e(r,c,e.pageSize),p=t.length===0?ve(e):n.length===0,m=t.filter(e=>D(e)).length,h=t.length===1?d(`sessionsView.groupRowCountOne`,{count:`1`}):d(`sessionsView.groupRowCount`,{count:String(t.length)}),g=d(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),y=d(`sessionsView.limitTooltip`),b=d(`sessionsView.globalTooltip`),x=d(`sessionsView.unknownTooltip`),S=d(`sessionsView.archivedOnlyTooltip`),w=(t,n,r=``)=>{let a=e.sortColumn===t,o=a&&e.sortDir===`asc`?`desc`:`asc`;return i`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${a?e.sortDir:``}
        @click=${()=>e.onSortChange(t,a?o:`desc`)}
      >
        ${n}
        <span class="data-table-sort-icon">${v.arrowUpDown}</span>
      </th>
    `};return i`
    <section class="card">
      <div class="sessions-header">
        <div>
          <div class="card-title sessions-header__title">
            ${d(`sessionsView.title`)}
            ${e.result?i`<span class="sessions-header__count">${t.length}</span>`:a}
          </div>
          ${e.result?i`
                <openclaw-tooltip .content=${d(`sessionsView.store`,{path:e.result.path})}>
                  <div class="card-sub sessions-header__meta">
                    <span>${h}</span>
                    ${m>0?i`
                          <span class="sessions-header__live">
                            <span class="sessions-header__live-dot" aria-hidden="true"></span>
                            ${d(`sessionsView.liveCount`,{count:String(m)})}
                          </span>
                        `:a}
                  </div>
                </openclaw-tooltip>
              `:i`<div class="card-sub">${d(`sessionsView.subtitle`)}</div>`}
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?d(`common.loading`):d(`common.refresh`)}
        </button>
      </div>

      ${e.error?i`<div class="callout danger" style="margin-bottom: 12px;">${e.error}</div>`:a}

      <div class="data-table-wrapper">
        <div class="sessions-toolbar sessions-filter-bar" aria-label="Session filters">
          <div class="data-table-search sessions-toolbar__search">
            ${v.search}
            <input
              type="text"
              placeholder=${d(`sessionsView.searchPlaceholder`)}
              .value=${e.searchQuery}
              @input=${t=>e.onSearchChange(t.target.value)}
            />
          </div>
          <div class="session-filter-primary-row">
            <openclaw-tooltip .content=${g}>
              <label class="session-filter-field">
                <span class="session-filter-label">${d(`sessionsView.active`)}</span>
                <input
                  class="session-filter-input session-filter-input--minutes"
                  placeholder=${d(`sessionsView.minutesPlaceholder`)}
                  .value=${e.activeMinutes}
                  ?disabled=${e.showArchived}
                  @input=${t=>e.onFiltersChange({activeMinutes:t.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown,showArchived:e.showArchived})}
                />
              </label>
            </openclaw-tooltip>
            <openclaw-tooltip .content=${y}>
              <label class="session-filter-field">
                <span class="session-filter-label">${d(`sessionsView.limit`)}</span>
                <input
                  class="session-filter-input session-filter-input--limit"
                  .value=${e.limit}
                  @input=${t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:t.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown,showArchived:e.showArchived})}
                />
              </label>
            </openclaw-tooltip>
          </div>
          <div
            class="session-filter-toggle-group"
            role="group"
            aria-label=${d(`sessionsView.sourceFilters`)}
          >
            ${Z({name:`includeGlobal`,checked:e.includeGlobal,label:d(`sessionsView.global`),title:b,onChange:t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:t,includeUnknown:e.includeUnknown,showArchived:e.showArchived})})}
            ${Z({name:`includeUnknown`,checked:e.includeUnknown,label:d(`sessionsView.unknown`),title:x,onChange:t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:t,showArchived:e.showArchived})})}
            ${Z({name:`showArchived`,checked:e.showArchived,label:d(`sessionsView.archivedOnly`),title:S,extraClass:`session-archive-toggle`,onChange:t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown,showArchived:t})})}
          </div>
          <span class="sessions-toolbar__divider" aria-hidden="true"></span>
          <label class="session-groupby">
            <span class="session-groupby__label">${d(`sessionsView.groupBy`)}</span>
            <select
              class="session-groupby__select"
              @change=${t=>e.onGroupByChange(t.target.value)}
            >
              ${C.map(t=>i`<option value=${t} ?selected=${e.groupBy===t}>
                    ${Ce(t)}
                  </option>`)}
            </select>
          </label>
          ${e.groupBy===`category`?i`
                <button class="btn btn--sm" @click=${()=>e.onRequestNewCategory()}>
                  ${v.plus} ${d(`sessionsView.newGroup`)}
                </button>
              `:a}
        </div>

        ${e.selectedKeys.size>0?i`
              <div class="data-table-bulk-bar">
                <span
                  >${d(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span
                >
                <button class="btn btn--sm" @click=${e.onDeselectAll}>
                  ${d(`common.unselect`)}
                </button>
                <button
                  class="btn btn--sm danger"
                  ?disabled=${e.loading}
                  @click=${e.onDeleteSelected}
                >
                  ${v.trash} ${d(`sessionsView.deleteSelected`)}
                </button>
              </div>
            `:a}

        <div class="data-table-container">
          <table class="data-table sessions-table">
            <thead>
              <tr>
                <th class="data-table-checkbox-col">
                  ${f.length>0?i`<input
                        type="checkbox"
                        .checked=${f.length>0&&f.every(t=>e.selectedKeys.has(t.key))}
                        .indeterminate=${f.some(t=>e.selectedKeys.has(t.key))&&!f.every(t=>e.selectedKeys.has(t.key))}
                        @change=${()=>{f.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(f.map(e=>e.key)):e.onSelectPage(f.map(e=>e.key))}}
                        aria-label=${d(`sessionsView.selectAllOnPage`)}
                      />`:a}
                </th>
                ${w(`key`,d(`sessionsView.key`),`data-table-key-col`)}
                ${e.groupBy===`category`?i`<th>${d(`sessionsView.group`)}</th>`:a}
                ${w(`kind`,d(`sessionsView.kind`))}
                <th class="session-status-col">${d(`sessionsView.status`)}</th>
                <th class="session-runtime-col">${d(`agents.context.runtime`)}</th>
                ${w(`updated`,d(`sessionsView.updated`))}
                ${w(`tokens`,d(`sessionsView.tokens`))}
                <th class="session-actions-col">${d(`sessionsView.actions`)}</th>
              </tr>
            </thead>
            <tbody>
              ${f.length===0?i`
                    <tr>
                      <td colspan=${q(e)} class="data-table-empty-cell">
                        ${p?i`
                              <div class="data-table-empty-state" role="status" aria-live="polite">
                                <div>${d(`sessionsView.noSessionsMatchFilters`)}</div>
                                <button class="btn btn--sm" @click=${e.onClearFilters}>
                                  ${d(`sessionsView.showAll`)}
                                </button>
                              </div>
                            `:d(`sessionsView.noSessions`)}
                      </td>
                    </tr>
                  `:u?u.flatMap(t=>{let n=t.rows.flatMap(t=>Oe(t,e));return n.unshift(Te(t,e)),n}):f.flatMap(t=>Oe(t,e))}
            </tbody>
          </table>
        </div>

        ${o>0&&!l?i`
              <div class="data-table-pagination">
                <div class="data-table-pagination__info">
                  ${c*e.pageSize+1}-${Math.min((c+1)*e.pageSize,o)}
                  of ${o} row${o===1?``:`s`}
                </div>
                <div class="data-table-pagination__controls">
                  <select
                    class="data-table-pagination__size"
                    .value=${String(e.pageSize)}
                    @change=${t=>e.onPageSizeChange(Number(t.target.value))}
                  >
                    ${se.map(e=>i`<option value=${e}>${e} per page</option>`)}
                  </select>
                  <button ?disabled=${c<=0} @click=${()=>e.onPageChange(c-1)}>
                    Previous
                  </button>
                  <button
                    ?disabled=${c>=s-1}
                    @click=${()=>e.onPageChange(c+1)}
                  >
                    ${d(`common.next`)}
                  </button>
                </div>
              </div>
            `:a}
      </div>
    </section>
  `}function Oe(e,t){let n=e.updatedAt?ee(e.updatedAt):d(`common.na`),r=e.latestCompactionCheckpoint,o=e.compactionCheckpointCount??0,s=Math.max(o,+!!r),u=o>0||!!r,m=t.expandedSessionKey===e.key,h=`session-details-${encodeURIComponent(e.key)}`,g=c(e.displayName)??null,_=c(e.label)??``,y=!!(g&&g!==e.key&&g!==_),b=A(e.key),x=b?B(t.agentIdentityById,b.agentId):null,S=c(x?.emoji)??``,C=c(x?.name)??``,w=C&&b?`${S?`${S} `:``}${C} (${b.channel})`:null,T=w??e.key,D=e.key===`main`||p(e.key)?.rest===l(t.mainKey),O=e.kind!==`global`,k=t.workboardSessionKeys?.has(e.key)===!0,te=t.workboardBusySessionKey===e.key,ne=O?`${f(`chat`,t.basePath)}${E(e.key)}`:null,P=e.kind===`cron`?`data-table-badge--cron`:e.kind===`direct`?`data-table-badge--direct`:e.kind===`group`?`data-table-badge--group`:e.kind===`global`?`data-table-badge--global`:`data-table-badge--unknown`,F=[`session-data-row`,`session-data-row--expandable`,m?`session-data-row--expanded`:``].filter(Boolean).join(` `),I=d(m?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:T}),L=t.groupBy===`category`,R=Y(t,c(e.category)??null);return[i`<tr
      class=${F}
      tabindex="0"
      aria-expanded=${String(m)}
      aria-controls=${h}
      draggable=${L?`true`:a}
      aria-description=${L?d(`sessionsView.dragSessionHint`):a}
      @dragstart=${L?t=>{t.dataTransfer?.setData(j,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:a}
      @dragover=${R.dragover}
      @dragleave=${R.dragleave}
      @drop=${R.drop}
      @click=${n=>{X(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{X(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${d(`sessionsView.selectSession`)}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${T}>
          <div class=${w?`session-key-cell`:`mono session-key-cell`}>
            <span class="session-key-cell__primary">
              ${e.unread===!0?i`<span
                    class="session-unread-dot"
                    role="img"
                    aria-label=${d(`sessionsView.unread`)}
                  ></span>`:a}
              ${O?i`<a
                    href=${ne}
                    class="session-link"
                    @click=${n=>{n.defaultPrevented||n.button!==0||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey||t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                    >${w??e.key}</a
                  >`:i`<span>${w??e.key}</span>`}
              ${_?i`<span class="session-label-chip" title=${_}
                    >${_}</span
                  >`:a}
            </span>
            ${y?i`<span class="muted session-key-display-name">${g}</span>`:a}
          </div>
        </openclaw-tooltip>
      </td>
      ${L?Ee(e,t):a}
      <td>
        <span class="data-table-badge ${P}">${e.kind}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${H(e)} ${G(e.goal)}
        </div>
      </td>
      <td class="session-runtime-cell">
        <span class="mono">${M(e.agentRuntime)}</span>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${N(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(m)}
            aria-controls=${h}
            aria-label=${I}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${s>0?i`<span class="session-compaction-count">${s}</span>`:a}
            ${v.chevronDown}
          </button>
          <button
            class="icon-btn"
            title=${e.unread?d(`sessionsView.markRead`):d(`sessionsView.markUnread`)}
            aria-label=${e.unread?d(`sessionsView.markRead`):d(`sessionsView.markUnread`)}
            ?disabled=${t.loading}
            @click=${n=>{n.stopPropagation(),t.onPatch(e.key,{unread:e.unread!==!0})}}
          >
            ${e.unread?v.eye:v.circle}
          </button>
          <button
            class="icon-btn"
            title=${d(`sessionsView.forkSession`)}
            aria-label=${d(`sessionsView.forkSession`)}
            ?disabled=${t.loading}
            @click=${n=>{n.stopPropagation(),t.onFork(e.key)}}
          >
            ${v.copy}
          </button>
          <button
            class="icon-btn"
            title=${e.pinned?d(`sessionsView.unpinSession`):d(`sessionsView.pinSession`)}
            aria-label=${e.pinned?d(`sessionsView.unpinSession`):d(`sessionsView.pinSession`)}
            ?disabled=${t.loading||e.archived===!0}
            @click=${n=>{n.stopPropagation(),t.onPatch(e.key,{pinned:e.pinned!==!0})}}
          >
            ${e.pinned?v.pinOff:v.pin}
          </button>
          <button
            class="icon-btn"
            title=${e.archived?d(`sessionsView.restoreSession`):d(`sessionsView.archiveSession`)}
            aria-label=${e.archived?d(`sessionsView.restoreSession`):d(`sessionsView.archiveSession`)}
            ?disabled=${t.loading||!e.archived&&(D||e.hasActiveRun===!0||e.kind===`global`||e.kind===`unknown`)}
            @click=${n=>{n.stopPropagation(),t.onPatch(e.key,{archived:e.archived!==!0})}}
          >
            ${e.archived?v.archiveRestore:v.archive}
          </button>
          ${t.onAddToWorkboard&&O?i`
                <openclaw-tooltip
                  .content=${d(k?`sessionsView.openWorkboardCard`:`sessionsView.addToWorkboard`)}
                >
                  <button
                    class="icon-btn"
                    aria-label=${d(k?`sessionsView.openWorkboardCard`:`sessionsView.addToWorkboard`)}
                    ?disabled=${t.loading||te}
                    @click=${n=>{n.stopPropagation(),t.onAddToWorkboard?.(e)}}
                  >
                    ${k?v.check:v.plus}
                  </button>
                </openclaw-tooltip>
              `:a}
        </div>
      </td>
    </tr>`,...m?[ke({row:e,props:t,detailsId:h,friendlyKeyLabel:w,keyCellTitle:T,displayName:g,showDisplayName:y,badgeClass:P,updated:n,visibleCheckpointCount:s,hasCheckpoints:u})]:[]]}function ke(e){let{row:t,props:n,detailsId:r,friendlyKeyLabel:o,displayName:s,showDisplayName:l,badgeClass:u,updated:f,visibleCheckpointCount:p,hasCheckpoints:m}=e,h=t.thinkingLevel??``,g=h?P(h):``,_=V(ce(t,n.result?.defaults),g),v=t.fastMode===`auto`?`auto`:t.fastMode===!0?`on`:t.fastMode===!1?`off`:``,y=V(de(),v),b=t.verboseLevel??``,x=V(ue(),b),S=t.reasoningLevel??``,C=le(oe,S),w=n.checkpointItemsByKey[t.key]??[],T=n.checkpointErrorByKey[t.key],E=W(p),D=Se({row:t,updated:f,checkpointCount:p});return i`<tr id=${r} class="session-details-row">
    <td colspan=${q(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${d(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${o??t.key}</div>
            ${l?i`<div class="muted session-details-panel__subtitle">${s}</div>`:a}
          </div>
          <div class="session-details-panel__badges">
            ${H(t)} ${G(t.goal)}
            <span class="data-table-badge ${u}">${t.kind}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${d(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${d(`sessionsView.label`)}</span>
              <input
                class="session-override-field__control"
                .value=${t.label??``}
                ?disabled=${n.loading}
                placeholder=${d(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let r=c(e.target.value)??null;n.onPatch(t.key,{label:r})}}
              />
            </label>
            ${Q({label:d(`sessionsView.thinking`),disabled:n.loading,options:_,current:g,onChange:e=>n.onPatch(t.key,{thinkingLevel:me(e)})})}
            ${Q({label:d(`sessionsView.fast`),disabled:n.loading,options:y,current:v,onChange:e=>n.onPatch(t.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${Q({label:d(`sessionsView.verbose`),disabled:n.loading,options:x,current:b,onChange:e=>n.onPatch(t.key,{verboseLevel:e||null})})}
            ${Q({label:d(`sessionsView.reasoning`),disabled:n.loading,options:C.map(e=>({value:e,label:e||d(`sessionsView.inherit`)})),current:S,onChange:e=>n.onPatch(t.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${D.map(e=>i`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <openclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </openclaw-tooltip>
              </div>
            `)}
        </div>

        <div class="session-details-section">
          <div class="session-details-section__header">
            <div>
              <div class="session-details-panel__eyebrow">
                ${d(`sessionsView.compactionHistory`)}
              </div>
              <div class="session-details-section__title">${E}</div>
            </div>
          </div>
          ${n.checkpointLoadingKey===t.key?i`<div class="muted session-details-empty">
                ${d(`sessionsView.loadingCheckpoints`)}
              </div>`:T?i`<div class="callout danger">${T}</div>`:!m||w.length===0?i`<div class="muted session-details-empty">
                    ${d(`sessionsView.noCheckpoints`)}
                  </div>`:i`
                    <div class="session-checkpoint-list">
                      ${w.map(e=>i`
                          <div class="session-checkpoint-card">
                            <div class="session-checkpoint-card__header">
                              <strong>
                                ${ye(e.reason)} ·
                                ${ee(e.createdAt)}
                              </strong>
                              <span class="muted session-checkpoint-card__delta">
                                ${be(e)}
                              </span>
                            </div>
                            ${e.summary?i`<div class="session-checkpoint-card__summary">
                                  ${e.summary}
                                </div>`:i`<div class="muted">${d(`sessionsView.noSummary`)}</div>`}
                            <div class="session-checkpoint-card__actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId}
                                @click=${()=>n.onBranchFromCheckpoint(t.key,e.checkpointId)}
                              >
                                ${d(`sessionsView.branchFromCheckpoint`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId}
                                @click=${()=>n.onRestoreCheckpoint(t.key,e.checkpointId)}
                              >
                                ${d(`sessionsView.restoreCheckpoint`)}
                              </button>
                            </div>
                          </div>
                        `)}
                    </div>
                  `}
        </div>
      </div>
    </td>
  </tr>`}var Ae=`openclaw:sessions:group-by`;function je(){return k(u()?.getItem(Ae))}function Me(e){let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:void 0}var $=class extends o{constructor(...e){super(...e),this.result=null,this.loading=!1,this.error=null,this.activeMinutes=`60`,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.showArchived=!1,this.searchQuery=``,this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=je(),this.customGroups=te(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointLoadingKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={},this.sessionRequestId=0,this.checkpointRequestId=0,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.ignorePendingSharedRefresh=!1,this.sessionMutationPending=!1,this.sessionReloadQueued=!1,this.sharedSessionsResult=null,this.sharedSessionsLoading=!1,this.gatewayClient=null,this.gatewayConnected=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.startSessionState(),this.startAgentIdentityState()}willUpdate(e){(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData()}updated(){this.startSessionState(),this.startAgentIdentityState(),this.startApplicationState()}disconnectedCallback(){this.stopSessionSubscription?.(),this.stopSessionSubscription=void 0,this.stopAgentIdentitySubscription?.(),this.stopAgentIdentitySubscription=void 0,this.stopAgentSelectionSubscription?.(),this.stopAgentSelectionSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopRuntimeConfigSubscription?.(),this.stopRuntimeConfigSubscription=void 0,this.stopWorkboardSubscription?.(),this.stopWorkboardSubscription=void 0,this.sessionRequestId+=1,this.checkpointRequestId+=1,this.sessionReloadQueued=!1,this.gatewayClient=null,this.gatewayConnected=!1,super.disconnectedCallback()}startSessionState(){let e=this.context;!e||this.stopSessionSubscription||(this.sharedSessionsResult=e.sessions.state.result,this.sharedSessionsLoading=e.sessions.state.loading,this.stopSessionSubscription=e.sessions.subscribe(e=>{let t=e.result!==this.sharedSessionsResult,n=this.sharedSessionsLoading&&!e.loading;if(this.sharedSessionsResult=e.result,this.sharedSessionsLoading=e.loading,!(e.loading||!this.routeDataInitialized||this.sessionMutationPending)){if(this.ignorePendingSharedRefresh&&n){this.ignorePendingSharedRefresh=!1;return}t&&this.scheduleSessionReload()}}))}startAgentIdentityState(){let e=this.context;!e||this.stopAgentIdentitySubscription||(this.stopAgentIdentitySubscription=e.agentIdentity.subscribe(()=>this.requestUpdate()))}startApplicationState(){let e=this.context;if(!e||this.stopGatewaySubscription)return;this.stopAgentSelectionSubscription=e.agentSelection.subscribe(()=>this.requestUpdate());let t=e.gateway.snapshot;this.gatewayClient=t.client,this.gatewayConnected=t.connected,this.stopGatewaySubscription=e.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.stopRuntimeConfigSubscription=e.runtimeConfig.subscribe(()=>this.requestUpdate()),this.stopWorkboardSubscription=e.workboard.subscribe(()=>this.requestUpdate())}applyGatewaySnapshot(e){let t=e.client!==this.gatewayClient,n=e.connected&&!this.gatewayConnected;if(this.gatewayClient=e.client,this.gatewayConnected=e.connected,t&&(this.ignorePendingSharedRefresh=!1,this.sessionRequestId+=1,this.checkpointRequestId+=1,this.result=null,this.error=null,this.loading=!1,this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointLoadingKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={}),!e.connected||!e.client){this.sessionRequestId+=1,this.loading=!1,this.requestUpdate();return}this.routeDataInitialized&&(t||n)&&(this.ignorePendingSharedRefresh=!0,this.loadSessions()),this.requestUpdate()}applyRouteData(){let e=this.routeData,t=this.context;if(!e||!t||(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataInitialized=!0,!this.routeDataEnabled))return;this.showArchived=e.showArchived,e.expandedSessionKey?(this.activeMinutes=``,this.limit=``,this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=`60`,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey;let n=t.gateway.snapshot;if(e.client!==n.client||e.connected!==n.connected){this.routeDataEnabled=!1,this.loadSessions(),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey);return}this.result=e.result?T(e.result,{showArchived:e.showArchived}):null,this.error=e.error,this.loading=!1;let r=t.sessions.state;this.ignorePendingSharedRefresh=r.loading,this.ensureAgentIdentities(this.result),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey)}scheduleSessionReload(){this.sessionReloadQueued||(this.sessionReloadQueued=!0,queueMicrotask(()=>{this.sessionReloadQueued=!1;let e=this.context,t=e?.gateway.snapshot;this.isConnected&&e&&t?.connected&&t.client&&!e.sessions.state.loading&&this.loadSessions()}))}sessionAgentId(e){let t=this.context;if(!t)return;let{agentId:n}=b({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionListOptions(){let e=this.deepLinkSessionKey;return{activeMinutes:e||this.showArchived?0:Me(this.activeMinutes),limit:e?50:Me(this.limit),search:e??void 0,includeGlobal:e?!0:this.includeGlobal,includeUnknown:e?!0:this.includeUnknown,showArchived:this.showArchived,...e?{agentId:this.sessionAgentId(e)}:{}}}async loadSessions(){let e=this.context;if(!e)return;let t=++this.sessionRequestId,n=this.result;this.routeDataEnabled=!1,this.loading=!0,this.error=null;try{let r=await e.sessions.list(this.sessionListOptions());if(t!==this.sessionRequestId)return;this.result=r?T(r,{showArchived:this.showArchived}):null,this.ensureAgentIdentities(this.result);let i=this.reconcileCheckpointCache(n,this.result);i&&this.loadCheckpoint(i)}catch(e){t===this.sessionRequestId&&(this.error=String(e))}finally{t===this.sessionRequestId&&(this.loading=!1)}}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=this.sessionAgentIds(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}sessionAgentIds(e){return[...new Set((e?.sessions??[]).map(e=>p(e.key)?.agentId).filter(e=>!!e))]}sessionAgentIdentityById(e){let t=this.context;return t?Object.fromEntries(this.sessionAgentIds(e).map(e=>[e,t.agentIdentity.get(e)]).filter(e=>!!e[1])):{}}reconcileCheckpointCache(e,t){let n=new Map((t?.sessions??[]).map(e=>[e.key,e])),r=new Map((e?.sessions??[]).map(e=>[e.key,e])),i={...this.checkpointItemsByKey},a={...this.checkpointErrorByKey},o=null;for(let e of Object.keys(i)){let t=n.get(e),s=r.get(e);(!t||!s||s.compactionCheckpointCount!==t.compactionCheckpointCount||s.latestCompactionCheckpoint?.checkpointId!==t.latestCompactionCheckpoint?.checkpointId)&&(delete i[e],delete a[e],this.expandedSessionKey===e&&(o=e))}return this.checkpointItemsByKey=i,this.checkpointErrorByKey=a,o}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.showArchived=e.showArchived,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()}async deleteSelected(){let e=this.context,t=[...this.selectedKeys];if(!e||t.length===0||this.loading||!window.confirm(`Delete ${t.length} ${t.length===1?`session`:`sessions`}?\n\nThis will delete the session entries and archive their transcripts.`))return;this.sessionMutationPending=!0;let n=await e.sessions.deleteMany(t.map(e=>({key:e,agentId:this.sessionAgentId(e)}))).finally(()=>{this.sessionMutationPending=!1});if(n.deleted.length>0){let e=new Set(n.deleted),t=new Set(this.selectedKeys);for(let e of n.deleted)t.delete(e);if(this.selectedKeys=t,this.result){let t=this.result.sessions.filter(t=>!e.has(t.key));this.result={...this.result,count:Math.max(0,this.result.count-(this.result.sessions.length-t.length)),sessions:t}}this.expandedSessionKey&&e.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&e.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null)}n.errors.length>0&&(this.error=n.errors.join(`; `))}knownCategories(){let e=(this.result?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...this.customGroups,...e.toSorted((e,t)=>e.localeCompare(t))])]}setGroupBy(e){this.groupBy=e;try{u()?.setItem(Ae,e)}catch{}}rememberCustomGroup(e){this.customGroups.includes(e)||(this.customGroups=[...this.customGroups,e],O(this.customGroups))}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}requestNewCategory(e){let t=window.prompt(d(`sessionsView.newGroupPrompt`))?.trim();t&&(this.rememberCustomGroup(t),e&&this.patchSession(e,{category:t}))}async patchSession(e,t){let n=this.context;if(n)try{if(!await n.sessions.patch(e,t,{agentId:this.sessionAgentId(e)})){this.error=n.sessions.state.error;return}let r=new Set(this.selectedKeys);r.delete(e),this.selectedKeys=r,t.archived===!0&&g(e,n.gateway.snapshot.sessionKey)&&n.gateway.setSessionKey(m({agentId:p(e)?.agentId??n.agentSelection.state.selectedId??`main`,mainKey:h({agentsList:n.agents.state.agentsList,hello:n.gateway.snapshot.hello})}))}catch(e){this.error=String(e)}}async forkSession(e){let t=this.context;if(!t)return;let n=this.sessionAgentId(e),r=await t.sessions.create({parentSessionKey:e,fork:!0,...n?{agentId:n}:{}});r?t.navigate(`chat`,{search:E(r),hash:``}):t.sessions.state.error&&(this.error=t.sessions.state.error)}async toggleSessionDetails(e){if(!this.context)return;if(this.deepLinkSessionKey=null,this.expandedSessionKey===e){this.checkpointRequestId+=1,this.expandedSessionKey=null;return}this.expandedSessionKey=e;let t=this.result?.sessions.find(t=>t.key===e);if(!((t?.compactionCheckpointCount??0)>0||t?.latestCompactionCheckpoint)){this.checkpointItemsByKey[e]||(this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:[]});return}this.checkpointItemsByKey[e]||await this.loadCheckpoint(e)}async loadCheckpoint(e){let t=this.context;if(!t)return;let n=++this.checkpointRequestId;this.checkpointLoadingKey=e,this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:``};try{let r=await t.sessions.listCheckpoints(e,{agentId:this.sessionAgentId(e)});if(n!==this.checkpointRequestId)return;this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:r}}catch(t){if(n!==this.checkpointRequestId)return;this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:String(t)}}finally{n===this.checkpointRequestId&&this.checkpointLoadingKey===e&&(this.checkpointLoadingKey=null)}}async branchCheckpoint(e,t){let n=this.context;if(n&&window.confirm(`Create a new child session from this compacted checkpoint?`)){this.checkpointBusyKey=t;try{let r=await n.sessions.branchCheckpoint(e,t,{agentId:this.sessionAgentId(e)});n.navigate(`chat`,{search:E(r.key),hash:``})}catch(e){this.error=String(e)}finally{this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}async restoreCheckpoint(e,t){let n=this.context;if(n&&window.confirm(`Restore this session to the selected compacted checkpoint?

This replaces the current active transcript for the session key.`)){this.checkpointBusyKey=t;try{await n.sessions.restoreCheckpoint(e,t,{agentId:this.sessionAgentId(e)})}catch(e){this.error=String(e)}finally{this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}render(){let e=this.context;if(!e)return i``;let t=e.gateway.snapshot,n=x(e.runtimeConfig.state.configSnapshot)&&ne(t.hello?.auth??null),r=e.workboard.state;return i`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${y(`sessions`)}</div>
          <div class="page-sub">${S(`sessions`)}</div>
        </div>
      </section>
      ${De({loading:this.loading,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,showArchived:this.showArchived,mainKey:h({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),basePath:e.basePath,searchQuery:this.searchQuery,agentIdentityById:this.sessionAgentIdentityById(this.result),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:this.groupBy,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,workboardSessionKeys:new Set(r.cards.flatMap(e=>[e.sessionKey,e.execution?.sessionKey]).filter(e=>typeof e==`string`&&e.length>0)),workboardBusySessionKey:[...r.capturingSessionKeys][0]??null,expandedSessionKey:this.expandedSessionKey,checkpointItemsByKey:this.checkpointItemsByKey,checkpointLoadingKey:this.checkpointLoadingKey,checkpointBusyKey:this.checkpointBusyKey,checkpointErrorByKey:this.checkpointErrorByKey,onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=``,this.includeGlobal=!0,this.includeUnknown=!0,this.showArchived=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()},onSearchChange:e=>{this.searchQuery=e,this.page=0},onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>this.requestNewCategory(e),onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.loadSessions(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>e.navigate(`chat`,{search:E(t),hash:``}),onFork:e=>this.forkSession(e),onAddToWorkboard:n?e=>this.addToWorkboard(e):void 0,onToggleDetails:e=>void this.toggleSessionDetails(e),onBranchFromCheckpoint:(e,t)=>void this.branchCheckpoint(e,t),onRestoreCheckpoint:(e,t)=>void this.restoreCheckpoint(e,t)})}
    `}async addToWorkboard(e){let t=this.context;t&&(await w({host:t.workboard,client:t.gateway.snapshot.client,session:e,requestUpdate:t.workboard.notify}),t.navigate(`workboard`))}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([s({attribute:!1})],$.prototype,`routeData`,void 0),n([r()],$.prototype,`result`,void 0),n([r()],$.prototype,`loading`,void 0),n([r()],$.prototype,`error`,void 0),n([r()],$.prototype,`activeMinutes`,void 0),n([r()],$.prototype,`limit`,void 0),n([r()],$.prototype,`includeGlobal`,void 0),n([r()],$.prototype,`includeUnknown`,void 0),n([r()],$.prototype,`showArchived`,void 0),n([r()],$.prototype,`searchQuery`,void 0),n([r()],$.prototype,`sortColumn`,void 0),n([r()],$.prototype,`sortDir`,void 0),n([r()],$.prototype,`groupBy`,void 0),n([r()],$.prototype,`customGroups`,void 0),n([r()],$.prototype,`page`,void 0),n([r()],$.prototype,`pageSize`,void 0),n([r()],$.prototype,`selectedKeys`,void 0),n([r()],$.prototype,`expandedSessionKey`,void 0),n([r()],$.prototype,`checkpointItemsByKey`,void 0),n([r()],$.prototype,`checkpointLoadingKey`,void 0),n([r()],$.prototype,`checkpointBusyKey`,void 0),n([r()],$.prototype,`checkpointErrorByKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$);
//# sourceMappingURL=sessions-page-BzMuoBTv.js.map