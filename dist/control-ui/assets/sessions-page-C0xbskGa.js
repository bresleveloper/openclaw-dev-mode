const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-LKfga6r-.js","./input-dialog-K5fOtlzz.js","./control-ui-core-2cJmD3kZ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cr as t,Ea as n,Er as r,Qr as i,Zr as a,ai as o,co as s,do as c,ir as l,mn as u,no as d,to as f}from"./control-ui-foundation-Bju0LxrM.js";import{Ar as p,Dc as m,Fs as h,Gc as g,Gl as _,Kc as v,Kn as y,Ll as ee,Ls as b,Ms as te,Ns as x,Vo as S,Wc as ne,Xl as C,Yc as w,Yi as re,Zc as ie,_l as ae,_n as T,al as oe,cl as E,dc as se,dn as ce,fc as le,fn as ue,hi as de,ia as fe,il as D,in as pe,lc as me,lt as he,mc as O,nc as ge,pc as _e,qn as ve,ru as k,tc as ye,ut as be,vi as xe,wi as A,xi as Se,xn as j,yi as M,zl as Ce,zo as N}from"./control-ui-core-DX6662ze.js";import{$ as P,X as F,Y as I,ct as L,nt as we,ut as Te}from"./lit-runtime-BOUQsi_O.js";import{Di as Ee,Fi as R,Ii as De,Mn as Oe,Ni as ke,Oi as Ae,Qa as je,do as Me,fo as Ne,jn as Pe}from"./control-ui-core-QgEwr0pF.js";import{H as Fe,U as Ie,V as Le}from"./control-ui-boot-shared-BTCVmdzL.js";import{c as z,u as B}from"./gateway-runtime-DGdfj77o.js";import{Ao as Re,B as ze,Gi as Be,I as Ve,Ii as He,Ki as Ue,Ko as We,L as Ge,P as Ke,Ri as qe,Xi as Je,Xo as Ye,Yi as Xe,Zi as Ze,_l as Qe,_o as $e,di as et,fi as tt,ga as nt,gl as rt,ko as V,la as it,ln as at,mo as ot,pa as st,po as ct,sa as lt,sn as ut,un as dt,va as ft,vo as pt,xa as mt,z as ht,zl as gt}from"./control-ui-boot-shared-gJH8zZtq.js";import{Dt as _t,Et as vt,Ii as yt,Ot as H,Pa as bt,St as xt,Ut as St,Wt as Ct,Xr as wt,Yr as Tt,co as U,gi as Et,hi as Dt,ht as Ot,pt as kt,so as At}from"./control-ui-boot-shared-SOjXo6bG.js";import{a as jt,n as Mt,o as Nt,r as Pt,t as Ft}from"./session-workspace-recovery.runtime-Cp8Qm_S5.js";import{f as It,l as Lt}from"./control-ui-boot-shared-BaakSUsS.js";import{n as Rt,r as zt,t as Bt}from"./control-ui-boot-shared-Do172wng.js";import{mt as Vt}from"./control-ui-boot-new-C15hsoXP.js";import{n as Ht,t as Ut}from"./transcript-search-DIGEYHPw.js";import{n as Wt,t as Gt}from"./cloud-worker-stop.runtime-C6BWebjU.js";import{n as Kt,t as qt}from"./settings-workspace-Du_3hPkz.js";import{n as Jt,t as Yt}from"./agent-row-chip-DAFrSVio.js";import{o as Xt,s as Zt}from"./presenter-DIWRPZu-.js";import{n as Qt,t as $t}from"./agent-scope-control-Bwg6igzH.js";import{n as en,t as tn}from"./capacity-meter-Pp_j9xeZ.js";import{n as nn,t as rn}from"./sessions-hub-header-BzTIP3_F.js";function an(e){return[...new Set((e?.sessions??[]).map(e=>D(e.key)?.agentId).filter(e=>!!e))]}function on(e,t){return Object.fromEntries(an(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}function sn(){return(sn=e((()=>{w()})))()}function cn(e,{key:t,sessionId:n,pinned:r},i){let a=e.captureConnectionScope();return a?o=>{e.isConnectionScopeCurrent(a)&&o.entry.sessionId===n&&M({message:C(`sessionsView.sessionArchived`),actionLabel:C(`common.undo`),onAction:()=>{e.isConnectionScopeCurrent(a)&&e.patch(t,{archived:!1,...r===!0?{pinned:!0}:{}},{agentId:i,expectedSessionId:n}).catch(t=>{e.isConnectionScopeCurrent(a)&&M({message:h(t)})})}})}:null}function ln(){return(ln=e((()=>{_(),b(),xe()})))()}function un(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function dn(e){if(!e.sessions||e.knownCategories.includes(e.name))return`completed`;try{return await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])===`completed`&&e.isCurrent()?`completed`:`stale`}catch(t){return e.isCurrent()?(e.onError(h(t)),`failed`):`stale`}}function fn(){return(fn=e((()=>{b()})))()}function pn(e,t){let n=t.deepLinkSessionKey?.trim()||null,r=D(n)?.agentId??e.agentSelection.state.scopeId?.trim(),i=!n&&t.statusFilter===`active`?t.activeMinutes:void 0;return{limit:n?50:t.limit,...i?{activeMinutes:i}:{},...n||t.search?.trim()?{search:n??t.search.trim()}:{},includeGlobal:n?!0:t.includeGlobal,includeUnknown:n?!0:t.includeUnknown,includeDerivedTitles:!1,includeLastMessage:!1,archivedFilter:t.statusFilter,...r?{agentId:r}:{}}}function mn(){return(mn=e((()=>{j(),w()})))()}function hn(){return mt(k()?.getItem(W))}function gn(e){try{k()?.setItem(W,e)}catch{}}var W;function _n(){return(_n=e((()=>{ft(),W=`openclaw:sessions:group-by`})))()}function vn(e){let{context:t,row:n}=e,r=t.gateway.snapshot,i=E({agentsList:t.agents.state.agentsList,hello:r.hello}),a=g(n,i),o=v([n],i),s=Et(n.placement),l=!(!s||s.blocksActiveRun&&n.hasActiveRun===!0||B(r,s.method)!==!0),u=ie(n);return P`
    <openclaw-session-menu
      .session=${{label:c(n.label)??n.key,sessionId:c(n.sessionId)??null,pinned:n.pinned===!0,pinnable:u,unread:n.unread===!0,hiddenFromInvolvingMe:n.hiddenFromInvolvingMe,archived:n.archived===!0,archiving:t.sessions.archiveVisibility(n.key)===`pending`,category:c(n.category)??null,icon:c(n.icon)??null,color:c(n.color)??null,categoryClearReturnsToGroups:!1}}
      .anchor=${e.menu}
      .trigger=${e.trigger}
      .disabled=${e.disabled}
      .navigationAllowed=${!0}
      .copyMarkdownAllowed=${ut(r)}
      .splitAllowed=${!1}
      .actionDisabledReasons=${Ct({snapshot:r,session:{...n,pinnable:u},cloudWorkerStopAction:s})}
      .forkDisabled=${n.modelSelectionLocked===!0}
      .forkFromLastCompleted=${n.hasActiveRun===!0}
      .archiveAllowed=${a}
      .deleteAllowed=${o}
      .cloudWorkerStopAllowed=${l}
      .groups=${e.groups}
      .work=${e.work}
      .pluginActions=${Rt(t.plugins,n)}
      .onClose=${e.onClose}
      .onAction=${e.onAction}
    ></openclaw-session-menu>
  `}function yn(){return(yn=e((()=>{I(),Dt(),St(),z(),w(),at(),Bt()})))()}function bn(e,t){let n=t.find(t=>t.key===e.sessionKey);return c(n?.label)??c(n?.displayName)??e.sessionKey}function xn(e){let t=e.transcriptSearchQuery.trim().length>0,n=e.transcriptSearch,r=n.status===`results`?n.results:[],i=n.status===`results`?n.sessions:[],a=n.status===`loading`;return P`
    <section
      class="sessions-transcript-search"
      aria-label=${C(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${C(`sessionsView.transcriptSearchTitle`)}
        @submit=${n=>{n.preventDefault(),e.transcriptSearchAvailable&&t&&!a&&e.onTranscriptSearch()}}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${C(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${C(`sessionsView.transcriptSearchPlaceholder`)}
            .value=${e.transcriptSearchQuery}
            ?disabled=${!e.transcriptSearchAvailable}
            @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onTranscriptSearchChange(t.currentTarget.value)}}
          />
        </div>
        <button
          class="btn primary"
          type="submit"
          ?disabled=${!e.transcriptSearchAvailable||!t||a}
        >
          ${C(a?`sessionsView.transcriptSearchSearching`:`sessionsView.transcriptSearchAction`)}
        </button>
        ${t?P`
                <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                  ${C(`sessionsView.transcriptSearchClear`)}
                </button>
              `:F}
      </form>
      ${e.transcriptSearchAvailable?F:P`
              <div class="muted" role="status">
                ${C(`sessionsView.transcriptSearchUnavailable`)}
              </div>
            `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${a?`true`:`false`}
      >
        ${a?P`<span class="muted">${C(`sessionsView.transcriptSearchSearching`)}</span>`:F}
        ${n.status===`error`?P`
                <div
                  class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
                >
                  <span>${C(`sessionsView.transcriptSearchError`)}: ${n.message}</span>
                  <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                    ${C(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:F}
        ${n.status===`results`&&n.indexing?P`
                <div class="sessions-transcript-search__notice">
                  <span>${C(`sessionsView.transcriptSearchIndexing`)}</span>
                  <button
                    class="btn btn--sm"
                    type="button"
                    ?disabled=${a}
                    @click=${e.onTranscriptSearch}
                  >
                    ${C(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:F}
        ${n.status===`results`&&n.archivedTranscriptsExcluded>0?P`<div class="sessions-transcript-search__notice">
                ${C(`sessionsView.transcriptSearchArchivedExcluded`,{count:String(n.archivedTranscriptsExcluded)})}
              </div>`:F}
        ${n.status===`results`&&r.length===0&&!n.indexing?P`
                <div class="sessions-transcript-search__empty" role="status">
                  ${C(`sessionsView.transcriptSearchEmpty`)}
                </div>
              `:F}
        ${r.length>0?P`
                <div class="sessions-transcript-search__results">
                  <div class="sessions-transcript-search__summary">
                    <strong
                      >${C(`sessionsView.transcriptSearchMatches`,{count:String(r.length)})}</strong
                    >
                    ${n.status===`results`&&n.truncated?P`<span class="muted"
                            >${C(`sessionsView.transcriptSearchTruncated`)}</span
                          >`:F}
                  </div>
                  <div class="sessions-transcript-search__list">
                    ${r.map(t=>{let n=t.timestamp>0?ue(t.timestamp):C(`common.na`),r=t.timestamp>0?ce(t.timestamp):n;return P`
                        <button
                          class="sessions-transcript-search__result"
                          type="button"
                          @click=${()=>e.onNavigateToChat?.(t.sessionKey)}
                        >
                          <span class="sessions-transcript-search__result-header">
                            <strong>${bn(t,i)}</strong>
                            <span class="muted" title=${r}>
                              ${C(`sessionsView.${t.role}`)} · ${n}
                            </span>
                          </span>
                          <span class="sessions-transcript-search__snippet">${t.snippet}</span>
                          <span class="sessions-transcript-search__key">${t.sessionKey}</span>
                        </button>
                      `})}
                  </div>
                </div>
              `:F}
      </div>
    </section>
  `}function Sn(){return(Sn=e((()=>{I(),_(),rt(),T(),Qe()})))()}function Cn(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function wn(e,t){let n=ze({catalog:[],session:e,defaults:t,sessionKey:e.key,sessionsResult:null});return[{value:``,label:n.inherited.displayLabel},...n.options]}function G(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:Ve(t)}]}function K(e,t=!1){return e.map(e=>({value:e,label:C(e===``?`sessionsView.inherit`:t&&e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function Tn(e){return C(Qn[e]??`sessionsView.statusUnknown`)}function En(e){let t=u(e),n=e.hasActiveRun===!1&&(!e.status||e.status===`running`),r=e.status===`queued`?C(`sessionsView.statusQueued`):t?C(`sessionsView.statusLive`):n?C(`sessionsView.statusIdle`):e.status?Tn(e.status):C(`sessionsView.statusUnknown`),i=e.status===`queued`?`warn`:t||e.status===`done`?`ok`:n||!e.status?`muted`:`danger`,a=`${C(`sessionsView.status`)}: ${r}`;return P`
    <openclaw-tooltip .content=${a}>
      ${H({kind:i,label:r})}
    </openclaw-tooltip>
  `}function Dn(e){let t=A(e);return P`
    <span class="session-avatar session-avatar--${t}" aria-hidden="true">
      ${$n[t]??R.circle}
      ${u(e)?P`<span class="session-avatar__status"></span>`:F}
    </span>
  `}function On(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return P`<span class="muted">${C(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${pe(t)}`,i=Ke(e),a=i.tokens>0?i.tokens:null;if(!a)return P`<span class="session-tokens__value">${r}</span>`;let o=Math.min(100,Math.round(t/a*100)),s=n?o>=tr?`danger`:o>=er?`warn`:`ok`:`stale`,c=C(i.fromLastPrompt?n?`sessionsView.promptBudgetUsage`:`sessionsView.promptBudgetUsageApprox`:n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(o),used:t.toLocaleString(),context:a.toLocaleString()});return P`
    <openclaw-tooltip .content=${c}>
      <div class="session-tokens">
        <span class="session-tokens__value"
          >${r} / ${pe(a)}</span
        >
        ${en({mode:`continuous`,percent:o,tone:s,label:c})}
      </div>
    </openclaw-tooltip>
  `}function kn(e,t,n){let r=e.filter(e=>e.unread===!0&&e.archived!==!0).length,i=e.filter(e=>e.archived===!0).length,a=[[String(t),C(`sessionsView.statusLive`),t>0],[String(r),C(`sessionsView.unread`),r>0]];return n!==`active`&&a.push([String(i),C(`sessionsView.archived`),!1]),P`
    <span class="sessions-heading-facts">
      ${a.map(([e,t,n],r)=>P`
          ${r>0?P`<span class="sessions-heading-fact__separator" aria-hidden="true">·</span>`:F}
          <span
            class=${n?`sessions-heading-fact sessions-heading-fact--active`:`sessions-heading-fact`}
          >
            <strong>${e}</strong> ${t}
          </span>
        `)}
    </span>
  `}function An(e){return Array.from({length:nr},(t,n)=>P`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?P`<td class="data-table-checkbox-col"></td>`:P`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function jn(e,t,n){let r=t*n;return e.slice(r,r+n)}function Mn(e){return s(e.searchQuery).length>0||r(e.activeMinutes)!==void 0||!e.includeGlobal}function Nn(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:lt(e)??`0ms`}function Pn(e){if(!e)return F;let t=e.status===`active`||e.status===`complete`?`ok`:`warn`,n=Lt(e);return P`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${H({kind:t,label:It(e)})}
      </span>
    </openclaw-tooltip>
  `}function Fn(e){let{row:t,updated:n}=e,r=[{label:C(`sessionsView.key`),value:t.key},{label:C(`sessionsView.kind`),value:A(t)},{label:C(`sessionsView.updated`),value:n},{label:C(`sessionsView.tokens`),value:Xt(t)}],i=(e,t)=>{let n=c(t);n&&r.push({label:e,value:n})};i(C(`sessionsView.group`),t.category),i(C(`sessionsView.status`),t.status),t.goal&&r.push({label:C(`sessionsView.goal`),value:Lt(t.goal)}),i(C(`sessionsView.goalNote`),t.goal?.lastStatusNote),i(C(`sessionsView.model`),t.model),i(C(`sessionsView.provider`),t.modelProvider),i(C(`sessionsView.runtime`),l(t.agentRuntime)),i(C(`sessionsView.runDuration`),Nn(t.runtimeMs)),i(C(`sessionsView.surface`),t.surface),i(C(`sessionsView.subject`),t.subject),i(C(`sessionsView.room`),t.room),i(C(`sessionsView.space`),t.space),i(C(`sessionsView.sessionId`),t.sessionId),t.archiveReason&&r.push({label:C(`sessionsView.archiveReason`),value:et(t.archiveReason)});for(let[e,n]of[[C(`sessionsView.activeRun`),t.hasActiveRun],[C(`sessionsView.archived`),t.archived],[C(`sessionsView.pinned`),t.pinned]])typeof n==`boolean`&&r.push({label:e,value:C(n?`common.yes`:`common.no`)});return r}function q(e){return e.groupBy===`category`?8:7}function In(e){return C(Q[e]??Q.none)}function Ln(e,t){let{id:n}=e;if(t.groupBy===`date`)return C({today:`sessionsView.dateToday`,yesterday:`sessionsView.dateYesterday`,week:`sessionsView.dateThisWeek`,older:`sessionsView.dateOlder`}[n]??`sessionsView.dateNoActivity`);if(n===``)return C(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let e=Cn(t.agentIdentityById,n),r=c(e?.name);if(r){let t=c(e?.emoji);return t?`${t} ${r}`:r}}if(t.groupBy===`person`){let t=e.rows[0]?.owner?.actor;return t?.identity?.type===`profile`?Ye({id:t.identity.id,name:t.label?.trim()||n}):t?.label?.trim()||n}return n}function J(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Rn(e,t){if(e.groupBy!==`category`||e.groupWriteDisabledReason)return{dragover:F,dragleave:F,drop:F};let n=e=>e.dataTransfer?.types.includes(V)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),J(e,!0))},dragleave:e=>J(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),J(r,!1);let i=r.dataTransfer?.getData(V);i&&e.onAssignCategory(i,t)}}}function zn(e,t){let n=Ln(e,t),r=e.rows.length===1?C(`sessionsView.groupRowCountOne`,{count:`1`}):C(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=Rn(t,e.id===``?null:e.id);return P`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${q(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${R.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function Bn(e,t){let n=c(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),P`
    <td>
      <select
        ?disabled=${t.loading||!!t.groupWriteDisabledReason}
        title=${t.groupWriteDisabledReason??F}
        aria-label=${C(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{if(t.groupWriteDisabledReason)return;let i=r.target;if(i.value===Z){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!n}>${C(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>P`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option value=${Z}>${C(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function Vn(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function Hn(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return P`
    <openclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${t=>e.onChange(t.target.checked)}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${R.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </openclaw-tooltip>
  `}function Y(e){return P`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        title=${e.disabledReason??F}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>P`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function Un(e){let t=e.result?.sessions??[],n=e.sortDir===`asc`?1:-1,r=t.toSorted((t,r)=>{let i=(r.pinnedAt??0)-(t.pinnedAt??0);return i===0?(e.sortColumn===`kind`?A(t).localeCompare(A(r)):e.sortColumn===`key`?t.key.localeCompare(r.key):e.sortColumn===`updated`?(t.updatedAt??0)-(r.updatedAt??0):(t.totalTokens??t.inputTokens??t.outputTokens??0)-(r.totalTokens??r.inputTokens??r.outputTokens??0))*n:i}),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),s=e.groupBy===`none`?null:nt({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}),c=jn(s?s.flatMap(e=>e.rows):r,o,e.pageSize),l=t.length===0&&Mn(e),d=t.filter(e=>u(e)).length,f=t.filter(e=>e.archived===!0).length,p=e.statusFilter===`archived`?C(`sessionsView.noArchivedSessions`):e.statusFilter===`active`?C(`sessionsView.noActiveSessions`):C(`sessionsView.noSessions`),m=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return P`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        aria-sort=${i?e.sortDir===`asc`?`ascending`:`descending`:F}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        <button class="data-table-sort-button" type="button">
          ${n}
          <span class="data-table-sort-icon" aria-hidden="true">${R.arrowUpDown}</span>
        </button>
      </th>
    `},h=P`
    ${C(`sessionsView.title`)}
    ${e.result?P`
            <openclaw-tooltip .content=${C(`sessionsView.store`,{path:e.result.path})}>
              <span class="settings-count">${t.length}</span>
            </openclaw-tooltip>
          `:F}
    ${e.result?kn(t,d,e.statusFilter):F}
  `,g=P`
    ${e.statusFilter===`archived`?P`
            <button
              class="btn danger"
              ?disabled=${e.loading||f===0||!!e.deleteArchivedDisabledReason}
              title=${e.deleteArchivedDisabledReason??F}
              @click=${e.onDeleteAllArchived}
            >
              ${R.trash} ${C(`sessionsView.deleteAllArchived`)}
            </button>
          `:F}
    <button class="btn" ?disabled=${e.refreshing} @click=${e.onRefresh}>
      ${e.refreshing?C(`common.loading`):C(`common.refresh`)}
    </button>
  `,_=[e.error?P`<div class="sessions-error" role="alert">${e.error}</div>`:F,vt({title:C(`sessionsView.transcriptSearchTitle`)},xn(e)),vt({title:h,actions:g},Gn(e,{paginated:c,groups:s,emptyBecauseFiltered:l,emptyMessage:p,totalRows:i,totalPages:a,page:o,sortHeader:m}))];return xt(_,{wide:!0})}function X(e,t){e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,String(t))}function Wn(e){let t=[[`activeMinutes`,`minutes`,C(`sessionsView.active`),C(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),C(`sessionsView.minutesPlaceholder`),e.statusFilter!==`active`],[`limit`,`limit`,C(`sessionsView.limit`),C(`sessionsView.limitTooltip`),F,!1]],n=[[`includeGlobal`,C(`sessionsView.global`),C(`sessionsView.globalTooltip`)],[`includeUnknown`,C(`sessionsView.unknown`),C(`sessionsView.unknownTooltip`)]],{activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o}=e,s=(t,n)=>e.onFiltersChange({activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o,[t]:n}),c=r.trim()!==``||i.trim()!==`50`||!a||o||e.groupBy!==`none`;return P`
    <button
      id="sessions-filter-popover-trigger"
      type="button"
      class="btn btn--sm sessions-filter-popover__trigger ${c?`active`:``}"
      title=${C(`sessionsView.filters`)}
      aria-label=${C(`sessionsView.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${R.listFilter}
    </button>
    <wa-popover
      class="sessions-filter-popover"
      for="sessions-filter-popover-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>X(e,!0)}
      @wa-hide=${e=>X(e,!1)}
    >
      <div class="sessions-filter-popover__panel">
        <div class="sessions-filter-popover__fields">
          ${t.map(([t,n,r,i,a,o])=>P`
              <openclaw-tooltip .content=${i}>
                <label class="session-filter-field">
                  <span class="session-filter-label">${r}</span>
                  <input
                    class="session-filter-input session-filter-input--${n}"
                    placeholder=${a}
                    .value=${e[t]}
                    ?disabled=${o}
                    @input=${e=>s(t,e.target.value)}
                  />
                </label>
              </openclaw-tooltip>
            `)}
        </div>
        <div
          class="session-filter-toggle-group"
          role="group"
          aria-label=${C(`sessionsView.sourceFilters`)}
        >
          ${n.map(([t,n,r])=>Hn({name:t,checked:e[t],label:n,title:r,onChange:e=>s(t,e)}))}
        </div>
        <label class="session-groupby">
          <span class="session-groupby__label">${C(`sessionsView.groupBy`)}</span>
          <select
            class="session-groupby__select"
            @change=${t=>e.onGroupByChange(t.target.value)}
          >
            ${st.filter(t=>t!==`person`||e.personGroupingAvailable).map(t=>P`
                <option value=${t} ?selected=${e.groupBy===t}>
                  ${In(t)}
                </option>
              `)}
          </select>
        </label>
        ${e.groupBy===`category`?P`
                <button
                  class="btn btn--sm"
                  ?disabled=${!!e.groupWriteDisabledReason}
                  title=${e.groupWriteDisabledReason??F}
                  @click=${()=>e.onRequestNewCategory()}
                >
                  ${R.plus} ${C(`sessionsView.newGroup`)}
                </button>
              `:F}
      </div>
    </wa-popover>
  `}function Gn(e,t){let{paginated:n,groups:r,emptyBecauseFiltered:i,emptyMessage:a,totalRows:o,totalPages:s,page:c}=t,l=t.sortHeader,u=i?C(`sessionsView.noSessionsMatchFilters`):a,d=r?new Set(n.map(e=>e.key)):null;return P`
    <div
      class="sessions-toolbar sessions-filter-bar"
      aria-label=${C(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${R.search}
        <input
          type="text"
          placeholder=${C(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchChange(t.target.value)}
        />
      </div>
      ${_t({value:e.statusFilter,ariaLabel:C(`sessionsView.sessionState`),className:`sessions-view-segment`,options:[{value:`active`,label:C(`common.active`)},{value:`archived`,label:C(`sessionsView.archived`),title:C(`sessionsView.archivedOnlyTooltip`)},{value:`all`,label:C(`sessionsView.all`)}],onChange:t=>e.onStatusFilterChange(t)})}
      ${Wn(e)}
    </div>

    ${e.selectedKeys.size>0?P`
            <div class="data-table-bulk-bar">
              <span>${C(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
              <button class="btn btn--sm" @click=${e.onDeselectAll}>
                ${C(`common.unselect`)}
              </button>
              <button
                class="btn btn--sm danger"
                ?disabled=${e.loading||!!e.deleteSelectedDisabledReason}
                title=${e.deleteSelectedDisabledReason??F}
                @click=${e.onDeleteSelected}
              >
                ${R.trash} ${C(`sessionsView.deleteSelected`)}
              </button>
            </div>
          `:F}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${n.length>0?P`<input
                      type="checkbox"
                      .checked=${n.length>0&&n.every(t=>e.selectedKeys.has(t.key))}
                      .indeterminate=${n.some(t=>e.selectedKeys.has(t.key))&&!n.every(t=>e.selectedKeys.has(t.key))}
                      @change=${()=>{n.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(n.map(e=>e.key)):e.onSelectPage(n.map(e=>e.key))}}
                      aria-label=${C(`sessionsView.selectAllOnPage`)}
                    />`:F}
            </th>
            ${l(`key`,C(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?P`<th>${C(`sessionsView.group`)}</th>`:F}
            ${l(`kind`,C(`sessionsView.kind`))}
            <th class="session-status-col">${C(`sessionsView.status`)}</th>
            ${l(`updated`,C(`sessionsView.updated`))}
            ${l(`tokens`,C(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sr-only">${C(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?An(q(e)):n.length===0&&(e.loading||e.error||!e.result)?F:n.length===0?P`
                      <tr>
                        <td
                          colspan=${q(e)}
                          class="data-table-empty-cell"
                        >
                          <div class="data-table-empty-state" role="status" aria-live="polite">
                            <div class="data-table-empty-state__message">
                              ${i?R.search:R.messageSquare}
                              <span>${u}</span>
                            </div>
                            ${i?P`
                                    <button class="btn btn--sm" @click=${e.onClearFilters}>
                                      ${C(`sessionsView.showAll`)}
                                    </button>
                                  `:F}
                          </div>
                        </td>
                      </tr>
                    `:r?r.flatMap(t=>{let n=t.rows.filter(e=>d?.has(e.key));if(n.length===0&&t.rows.length>0)return[];let r=n.flatMap(t=>Kn(t,e));return r.unshift(zn(t,e)),r}):n.flatMap(t=>Kn(t,e))}
        </tbody>
      </table>
    </div>

    ${o>0?P`
            <div class="data-table-pagination">
              <div class="data-table-pagination__info">
                ${C(`sessionsView.pagination`,{start:String(c*e.pageSize+1),end:String(Math.min((c+1)*e.pageSize,o)),total:String(o)})}
              </div>
              <div class="data-table-pagination__controls">
                <select
                  class="data-table-pagination__size"
                  aria-label=${C(`sessionsView.pageSize`)}
                  .value=${String(e.pageSize)}
                  @change=${t=>e.onPageSizeChange(Number(t.target.value))}
                >
                  ${Zn.map(t=>P`<option value=${t} ?selected=${t===e.pageSize}>
                        ${C(`sessionsView.rowsPerPage`,{count:String(t)})}
                      </option>`)}
                </select>
                ${e.result?.hasMore&&e.result.nextOffset!=null?P` <button ?disabled=${e.loading} @click=${e.onLoadMore}>
                        ${C(`chat.selectors.loadMoreRosterSessions`)}
                      </button>`:F}
                <button ?disabled=${c<=0} @click=${()=>e.onPageChange(c-1)}>
                  ${C(`common.previous`)}
                </button>
                <button
                  ?disabled=${c>=s-1}
                  @click=${()=>e.onPageChange(c+1)}
                >
                  ${C(`common.next`)}
                </button>
              </div>
            </div>
          `:F}
  `}function Kn(e,t){let n=e.updatedAt?ue(e.updatedAt):C(`common.na`),r=t.expandedSessionKey===e.key,i=`session-details-${encodeURIComponent(e.key)}`,a=c(e.displayName)??null,o=c(e.label)??``,s=!!(a&&a!==e.key&&a!==o),l=oe(e.key),u=l?Cn(t.agentIdentityById,l.agentId):null,d=c(u?.emoji)??``,f=c(u?.name)??``,p=f&&l?`${d?`${d} `:``}${f} (${l.channel})`:null,m=p??e.key,h=e.kind!==`global`,g=h?O({face:le(e),sessionKey:e.key,fallbackAgentId:t.agentId,basePath:t.basePath,row:e,mainKey:t.mainKey}).href:null,_=A(e),v=`session-kind session-kind--${_}`,y=[`session-data-row`,`session-data-row--expandable`,t.statusFilter===`all`&&e.archived===!0?`session-data-row--archived`:``,r?`session-data-row--expanded`:``,t.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),ee=C(r?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:m}),b=t.groupBy===`category`,x=Rn(t,c(e.category)??null),S=n=>te(n,n instanceof KeyboardEvent?n.currentTarget.querySelector(`button[aria-haspopup="menu"]`):null,(n,r,i)=>t.onOpenSessionMenu(e,{x:r,y:i},n));return[P`<tr
      class=${y}
      tabindex="0"
      aria-expanded=${String(r)}
      aria-controls=${i}
      draggable=${b?`true`:F}
      aria-description=${b?C(`sessionsView.dragSessionHint`):F}
      @dragstart=${b?t=>{t.dataTransfer?.setData(V,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:F}
      @dragover=${x.dragover}
      @dragleave=${x.dragleave}
      @drop=${x.drop}
      @contextmenu=${S}
      @click=${n=>{Vn(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{S(n),!n.defaultPrevented&&(Vn(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key)))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${`${C(`sessionsView.selectSession`)}: ${e.key}`}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${m}>
          <div class=${p?`session-key-cell`:`mono session-key-cell`}>
            ${Dn(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?P`<span
                        class="session-unread-dot"
                        role="img"
                        aria-label=${C(`sessionsView.unread`)}
                      ></span>`:F}
                ${h?P`<a
                        href=${g}
                        class="session-link"
                        @click=${n=>{de(n)&&t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                        >${p??e.key}</a
                      >`:P`<span>${p??e.key}</span>`}
                ${o?P`<span class="session-label-chip" title=${o}
                        >${o}</span
                      >`:F}
              </span>
              ${e.kind===`global`&&!e.agentId?F:Jt(D(e.key)?.agentId??e.agentId)}
              ${s?P`<span class="muted session-key-display-name">${a}</span>`:F}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${b?Bn(e,t):F}
      <td>
        <span class=${v}>${_}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${En(e)} ${Pn(e.goal)}
          ${t.statusFilter===`all`&&e.archived===!0?H({kind:`muted`,label:C(`sessionsView.archived`)}):F}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${On(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(r)}
            aria-controls=${i}
            aria-label=${ee}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${R.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${C(`chat.sidebar.openSessionMenu`)}
            aria-label=${C(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key===e.key)}
            @click=${n=>{n.stopPropagation();let r=n.currentTarget,i=r.getBoundingClientRect();t.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${R.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...r?[qn({row:e,props:t,detailsId:i,friendlyKeyLabel:p,displayName:a,showDisplayName:s,kindClass:v,updated:n})]:[]]}function qn(e){let{row:t,props:n,detailsId:r,friendlyKeyLabel:i,displayName:a,showDisplayName:o,kindClass:s,updated:l}=e,u=t.thinkingLevel??``,d=u?ht(u):``,f=G(wn(t,n.result?.defaults),d),p=t.fastMode===`auto`?`auto`:t.fastMode===!0?`on`:t.fastMode===!1?`off`:``,m=G(K(Yn),p),h=t.verboseLevel??``,g=G(K(Jn,!0),h),_=t.reasoningLevel??``,v=G(K(Xn),_),y=Fn({row:t,updated:l});return P`<tr id=${r} class="session-details-row">
    <td colspan=${q(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${C(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${i??t.key}</div>
            ${o?P`<div class="muted session-details-panel__subtitle">${a}</div>`:F}
          </div>
          <div class="session-details-panel__badges">
            ${En(t)} ${Pn(t.goal)}
            <span class=${s}>${A(t)}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${C(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${C(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${t.label??``}
                ?disabled=${n.loading||!!n.patchWriteDisabledReason}
                title=${n.patchWriteDisabledReason??F}
                placeholder=${C(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let r=c(e.target.value)??null;n.onPatch(t.key,{label:r})}}
              />
            </label>
            ${Y({label:C(`sessionsView.thinking`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:f,current:d,onChange:e=>n.onPatch(t.key,{thinkingLevel:e||null})})}
            ${Y({label:C(`sessionsView.fast`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:m,current:p,onChange:e=>n.onPatch(t.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${Y({label:C(`sessionsView.verbose`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:g,current:h,onChange:e=>n.onPatch(t.key,{verboseLevel:e||null})})}
            ${Y({label:C(`sessionsView.reasoning`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:v,current:_,onChange:e=>n.onPatch(t.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${y.map(e=>P`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <openclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </openclaw-tooltip>
              </div>
            `)}
        </div>
      </div>
    </td>
  </tr>`}var Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,Z,Q;function rr(){return(rr=e((()=>{t(),I(),Yt(),tn(),De(),kt(),_(),m(),ke(),bt(),Vt(),Ge(),it(),T(),x(),We(),Zt(),Se(),Re(),ft(),me(),tt(),w(),N(),Sn(),Jn=[``,`off`,`on`,`full`],Yn=[``,`auto`,`on`,`off`],Xn=[``,`off`,`on`,`stream`],Zn=[10,25,50,100],Qn={queued:`sessionsView.statusQueued`,running:`sessionsView.statusRunning`,done:`sessionsView.statusDone`,failed:`sessionsView.statusFailed`,killed:`sessionsView.statusKilled`,timeout:`sessionsView.statusTimeout`},$n={cron:R.clock,direct:R.messageSquare,group:R.users,global:R.globe,unknown:R.circle},er=65,tr=85,nr=4,Z=`__new-group__`,Q={none:`sessionsView.groupByNone`,category:`sessionsView.groupByCategory`,person:`sessionsView.groupByPerson`,channel:`sessionsView.groupByChannel`,kind:`sessionsView.groupByKind`,agent:`sessionsView.groupByAgent`,date:`sessionsView.groupByDate`}})))()}var ir,ar,$;function or(){return(or=e((()=>{i(),Le(),t(),I(),we(),je(),Pe(),Ae(),$t(),Gt(),Dt(),At(),wt(),yt(),Mt(),rn(),kt(),qt(),_(),p(),$e(),b(),z(),he(),y(),He(),Xe(),j(),Ue(),me(),w(),at(),N(),Ut(),Nt(),ot(),Ce(),ge(),Bt(),sn(),ln(),fn(),mn(),_n(),yn(),rr(),d(),ir=`https://docs.openclaw.ai/concepts/session`,ar=200,$=class extends ee{constructor(...e){super(...e),this.result=null,this.loading=!1,this.refreshing=!1,this.error=null,this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.statusFilter=`active`,this.searchQuery=``,this.transcriptSearchQuery=``,this.submittedTranscriptSearchQuery=``,this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=hn(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.pageEpoch=0,this.pluginActionLifetime=new AbortController,this.routeDataEnabled=!0,this.sessionMutationPending=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.observeAgentScope=gt(()=>{this.retirePageOperations(),this.resetTranscriptSearchState(this.transcriptSearchQuery),this.deepLinkSessionKey||(this.page=0,this.selectedKeys=new Set,this.routeDataEnabled=!1,this.clearSearchTimer(),this.bindSessionList()),this.requestUpdate()}),this.subscriptions=new ye(this).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.plugins,(e,t)=>e.subscribe(t)),this.gatewayLifecycle=new ct(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{let e=this.listBinding?.sessions.listSnapshot(this.listBinding.query).result;this.resetProviderState(),this.appliedListResult=e},invalidateRequests:()=>this.invalidatePageWork()}),this.transcriptSearchTask=new Fe(this,{args:()=>{let e=this.context,t=e?.gateway.snapshot;return[t?.phase===`connected`?t.client??null:null,this.submittedTranscriptSearchQuery,e??null,e?.agentSelection.state.scopeId??null]},task:async([e,t,n,r],{signal:i})=>{if(!e||!t||!n)return Ie;let{sessions:a,results:o,indexing:s=!1,truncated:c=!1,archivedTranscriptsExcluded:l=0}=await Ht({client:e,query:t,listOptions:this.sessionListOptions(n,``),isCurrent:()=>!i.aborted});return{sessions:a,results:o,indexing:s,truncated:c,archivedTranscriptsExcluded:l}}}),this.dialogLifecycle=null}willUpdate(e){let t=this.context?.sessions;t&&this.listBinding&&this.listBinding.sessions!==t&&(this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.invalidatePageWork(),this.resetProviderState()),(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData(),this.bindSessionList()}disconnectedCallback(){this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.subscriptions.clear(),this.invalidatePageWork(),this.dialogLifecycle?.abort(),super.disconnectedCallback()}retirePageOperations(){this.pluginActionLifetime.abort(),this.pluginActionLifetime=new AbortController,this.pageEpoch+=1,this.sessionMutationPending=!1,this.closeSessionMenu()}invalidatePageWork(){this.retirePageOperations(),this.clearSearchTimer(),this.listRequest=void 0,this.resetTranscriptSearchState(this.transcriptSearchQuery),this.loading=!1,this.refreshing=!1}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.refreshing=!1,this.resetTranscriptSearchState(``),this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.appliedListResult=void 0}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=this.gatewayLifecycle.gateway===t?this.gatewayLifecycle.client:null;return!this.gatewayLifecycle.connected||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&n.snapshot.phase===`connected`&&n.snapshot.client===e.client}mutationDisabledReason(e){let t=ve(this.context?.gateway.snapshot,e);return t.allowed?void 0:t.reason}requireMutationAccess(e,t){let n=ve(e.gateway.snapshot,t);return n.allowed?!0:(this.error=n.reason,!1)}selectedDeleteDisabledReason(){let e=new Map(this.result?.sessions.map(e=>[e.key,e])??[]);for(let t of this.selectedKeys){let n=e.get(t),r=this.mutationDisabledReason({method:`sessions.delete`,params:{key:t,...n?.archived===!0?{archivedOnly:!0}:{}}});if(r)return r}}applyRouteData(){let e=this.routeData,t=this.context;e&&t&&(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataEnabled&&(this.statusFilter=e.statusFilter,e.expandedSessionKey?(this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey))}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=fe({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionPathAgentId(e,t){return this.sessionAgentId(e,t)??se(t)}sessionListOptions(e,t=this.searchQuery){return pn(e,{activeMinutes:r(this.activeMinutes),limit:r(this.limit)??50,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,deepLinkSessionKey:this.deepLinkSessionKey,search:t})}bindSessionList(e=!0){let t=this.context;if(!t||!this.isConnected)return;let n=t.sessions,r=this.sessionListOptions(t),i=JSON.stringify(r),a=this.listBinding,o=JSON.stringify(this.sessionListOptions(t,``));(a?.sessions!==n||a.key!==i)&&(a?.sessions===n&&n.listSnapshot(a.query).loading&&this.loadSessionList(a),this.unsubscribeList?.(),this.unsubscribeList=void 0,(a?.sessions!==n||a.transcriptKey!==o)&&this.resetTranscriptSearchState(this.transcriptSearchQuery),this.result=null,this.error=null,this.selectedKeys=new Set,this.page=0,this.listBinding={sessions:n,query:r,key:i,transcriptKey:o},this.appliedListResult=void 0);let s=this.listBinding;if(this.unsubscribeList||(this.loading=t.gateway.snapshot.phase===`connected`,!this.captureRequestScope()||this.searchTimer!==void 0||this.listRequest))return s;let c=e=>{this.applyListSnapshot(s,e)};this.unsubscribeList=n.subscribeList(r,c);let l=n.listSnapshot(r);return c(l),e&&(!l.result||l.loading)&&this.loadSessionList(s),s}applyListSnapshot(e,t){if(this.listBinding!==e||this.context?.sessions!==e.sessions)return;this.loading=t.loading,this.error=t.error;let n=t.result;n&&n!==this.appliedListResult&&(this.appliedListResult=n,this.result=re(n,{archivedFilter:this.statusFilter}),this.ensureAgentIdentities(this.result))}async refreshSessionList(e=this.captureRequestScope()){if(!e)return;this.routeDataEnabled=!1,this.clearSearchTimer();let t=this.bindSessionList(!1);t&&t.sessions===e.sessions&&this.isRequestScopeCurrent(e)&&(await this.loadSessionList(t,{force:!0}),this.isRequestScopeCurrent(e)&&this.listBinding===t&&this.applyListSnapshot(t,t.sessions.listSnapshot(t.query)))}loadSessionList(e,t={}){if(this.listRequest)return t.force&&this.unsubscribeList&&e.sessions.refreshList({...e.query,...t}),this.listRequest;if(!this.captureRequestScope())return Promise.resolve();let n,r=new Promise(e=>{n=e}).finally(()=>{this.listRequest===r&&(this.listRequest=void 0,this.refreshing=!1,this.bindSessionList())});return this.listRequest=r,this.refreshing=!0,n(e.sessions.refreshList({...e.query,...t})),r}clearSearchTimer(){clearTimeout(this.searchTimer),this.searchTimer=void 0}adoptCurrentListSnapshot(){let e=this.listBinding;e&&this.applyListSnapshot(e,e.sessions.listSnapshot(e.query))}resetTranscriptSearchState(e){this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=``,this.transcriptSearchTask.run()}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.resetTranscriptSearchState(``);return}this.captureRequestScope()&&(this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=e,await this.transcriptSearchTask.run())}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=an(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()}updateStatusFilter(e){let t=this.context;e!==this.statusFilter&&t&&(this.statusFilter=e,this.clearSearchTimer(),this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e===`active`?void 0:{search:`?status=${e}`}))}async deleteSelected(){let e=[...this.selectedKeys];if(e.length===0||this.loading||this.sessionMutationPending)return;let t=this.captureRequestScope();if(!t)return;let n=new Map(this.result?.sessions.map(e=>[e.key,e])??[]),r=e.map(e=>n.get(e)??{key:e}),i=C(e.length===1?`sessionsView.deleteSelectedConfirmOne`:`sessionsView.deleteSelectedConfirm`,{count:String(e.length)});await U({message:i,confirmLabel:C(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(t)&&await this.deleteSessions(r)}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let r=this.captureRequestScope();if(!r)return;let i=e.map(e=>({key:e.key,agentId:this.sessionAgentId(e.key,r.context),...t,...e.sessionId?{expectedSessionId:e.sessionId}:{},...e.archived===!0?{archivedOnly:!0}:{}}));for(let e of i)if(!this.requireMutationAccess(r,{method:`sessions.delete`,params:e}))return;this.sessionMutationPending=!0;let a=null;try{let t=async()=>{let t=await r.sessions.deleteMany(i);if(e.length===1&&t.errors.length>0)throw t.errors[0].error;return t},o=e[0],s=e.length===1?await Pt({action:`delete`,session:{...o,label:o.label||o.displayName||o.key,agentId:i[0].agentId},scope:{...r,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(r),request:t}):await t();if(!this.isRequestScopeCurrent(r)||!s)return;if(s.preservedWorktrees.length>0&&window.alert(jt(s.preservedWorktrees)),s.deleted.length>0){let e=new Set(s.deleted),t=new Set(this.selectedKeys);for(let e of s.deleted)t.delete(e);this.selectedKeys=t,this.expandedSessionKey&&e.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&e.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let i=s.deleted.find(e=>ne(e,r.gateway.snapshot.sessionKey));if(i){let e=D(i)?.agentId??r.context.agentSelection.state.selectedId??`main`;Oe({selection:r.context.agentSelection,gateway:r.gateway,agentId:e,sessionKey:n({agentId:e,mainKey:E({agentsList:r.context.agents.state.agentsList,hello:r.gateway.snapshot.hello})})})}}await this.refreshSessionList(r),s.errors.length>0&&(a=s.errors.map(({error:e})=>Ft(e)).join(`; `))}catch(e){this.isRequestScopeCurrent(r)&&(a=h(e))}finally{this.isRequestScopeCurrent(r)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),a&&(this.error=a))}}async deleteAllArchived(){let e=this.captureRequestScope(),t=this.pluginActionLifetime.signal;if(!e||this.loading||this.sessionMutationPending)return;let n;try{let{search:t,agentId:r,...i}=this.sessionListOptions(e.context),a=e.context.agentSelection.state.scopeId?.trim(),o={...i,...a?{agentId:a}:{}},s=await Be({list:t=>e.sessions.list({...o,limit:1e3,offset:t}),isCurrent:()=>this.isRequestScopeCurrent(e),missingResultError:e.sessions.state.error??`archived session enumeration returned no result`,stalledPaginationError:`archived session enumeration did not advance`,incompletePaginationError:`archived session enumeration was incomplete`});if(!s)return;n=s}catch(t){this.isRequestScopeCurrent(e)&&(this.error=h(t));return}let r=n.filter(e=>e.archived===!0);r.length!==0&&await U({message:C(`sessionsView.deleteAllArchivedConfirm`,{count:String(r.length)}),confirmLabel:C(`common.delete`),danger:!0,signal:t})&&this.isRequestScopeCurrent(e)&&await this.deleteSessions(r,{deleteTranscript:!0})}async deleteSessionFromMenu(e){let t=c(e.label)??e.key,n=this.captureRequestScope();n&&await U({message:C(`sessionsView.deleteSessionConfirm`,{session:t}),confirmLabel:C(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(n)&&await this.deleteSessions([e])}async stopCloudWorker(e){let t=c(e.label)??e.key,n=Et(e.placement);if(!n||n.blocksActiveRun&&e.hasActiveRun===!0)return;let r=this.captureRequestScope();if(!r||!await U({message:C(`sessionsView.stopCloudWorkerConfirm`,{session:t}),confirmLabel:C(`sessionsView.stopCloudWorkerConfirmAction`),danger:!0,signal:this.pluginActionLifetime.signal})||!this.isRequestScopeCurrent(r)||!this.requireMutationAccess(r,n))return;this.sessionMutationPending=!0;let i=null;try{let t=D(e.key)?.agentId;await Wt(r.client,{key:e.key,...t?{agentId:t}:{}},r.context.placementStartup),this.isRequestScopeCurrent(r)&&await this.refreshSessionList(r)}catch(e){this.isRequestScopeCurrent(r)&&(i=h(e))}finally{this.isRequestScopeCurrent(r)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),i&&(this.error=i))}}knownCategories(){return un(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,this.page=0,gn(e)}async rememberCustomGroup(e,t=this.captureRequestScope()){return t?this.requireMutationAccess(t,{method:`sessions.groups.put`,requiredScope:`operator.write`})?dn({name:e,knownCategories:this.knownCategories(),sessions:t.sessions,isCurrent:()=>this.isRequestScopeCurrent(t),onError:e=>{this.error=e}}):`failed`:`stale`}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}async withDialogLifecycle(e){let t=this.dialogLifecycle;if(t)return e(t.signal);let n=new AbortController;this.dialogLifecycle=n;try{return await e(n.signal)}finally{this.dialogLifecycle===n&&(this.dialogLifecycle=null)}}async loadInputDialog(){try{return(await f(async()=>{let{showInputDialog:e}=await import(`./input-dialog-LKfga6r-.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2]),import.meta.url)).showInputDialog}catch(e){return this.error=h(e),null}}async requestNewCategory(e){let t=this.result?.sessions.find(t=>t.key===e);if(e&&!t?.sessionId){this.error=C(`common.refresh`);return}await this.withDialogLifecycle(async e=>{await(await this.loadInputDialog())?.({signal:e,title:C(`sessionsView.newGroupTitle`),label:C(`sessionsView.newGroupPrompt`),submitLabel:C(`sessionsView.newGroupCreate`),requireValue:!0,submit:e=>this.writeNewCategory(e,t)})})}async writeNewCategory(e,t){this.error=null;let n=this.captureRequestScope();if(!n)return C(`sessionsView.newGroupFailed`);let r=await this.rememberCustomGroup(e,n);if(r!==`completed`)return r===`failed`?this.error??C(`sessionsView.newGroupFailed`):C(`sessionsView.newGroupStale`);if(!t)return null;let i=await this.patchSession(t.key,{category:e},n,t.sessionId);return i===`failed`?this.error??C(`sessionsView.newGroupFailed`):i===`stale`?C(`sessionsView.newGroupStale`):null}async renameSession(e){let t=this.captureRequestScope();if(!t){this.error=C(`sessionsView.actionRequiresConnection`);return}let n=Ze(e),r=this.pluginActionLifetime.signal,i=await this.withDialogLifecycle(async e=>await(await this.loadInputDialog())?.({signal:AbortSignal.any([e,r]),title:C(`sessionsView.renameSessionPrompt`),defaultValue:n})??null);if(i===null||!this.isRequestScopeCurrent(t))return;let a=Je(i,n,e.label);a&&await this.patchSession(e.key,a,t,e.sessionId)}async patchSession(e,t,n=this.captureRequestScope(),r,i){if(!n)return this.error=C(`sessionsView.actionRequiresConnection`),`failed`;if(typeof t.archived==`boolean`&&!r?.trim())return this.error=`Session lifecycle action requires a durable session identity.`,`failed`;let a=this.sessionAgentId(e,n.context);if(!this.requireMutationAccess(n,{method:`sessions.patch`,params:{key:e,...t,...a?{agentId:a}:{}}}))return`failed`;try{let o=()=>n.sessions.patch(e,t,{agentId:a,...r?{expectedSessionId:r}:{}}),s=this.result?.sessions.find(t=>t.key===e),c=t.archived===!0?await Pt({action:`archive`,session:{key:e,sessionId:r,label:s?.label||s?.displayName||e,agentId:a},scope:{...n,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(n),request:o}):await o();if(c&&i?.(c),!this.isRequestScopeCurrent(n))return`stale`;if(!c)return this.error=n.sessions.state.error,`failed`;if(await this.refreshSessionList(n),!this.isRequestScopeCurrent(n))return`stale`;let l=new Set(this.selectedKeys);return l.delete(e),this.selectedKeys=l,`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=h(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t)return;let n=cn(t.sessions,e,this.sessionAgentId(e.key,t.context));if(!n)return;let r=t.sessions.beginArchive(e.key,e.sessionId);if(r)try{await this.patchSession(e.key,{archived:!0},t,e.sessionId,n)}finally{r()}}async forkSession(e,t=!1){let n=this.captureRequestScope();if(!n)return;let r=this.sessionAgentId(e,n.context),i={parentSessionKey:e,fork:!0,...t?{forkFrom:`last-completed`}:{},...r?{agentId:r}:{}};if(this.requireMutationAccess(n,{method:`sessions.create`,params:i}))try{let e=await n.sessions.create(i);if(!this.isRequestScopeCurrent(n))return;e?n.context.navigate(`chat`,{...O({context:n.context,face:`chat`,sessionKey:e,agentId:r??this.sessionPathAgentId(e,n.context)}).options,hash:``}):n.sessions.state.error&&(this.error=n.sessions.state.error)}catch(e){this.isRequestScopeCurrent(n)&&(this.error=h(e))}}async toggleSessionDetails(e){if(!this.context)return;let t=this.deepLinkSessionKey!==null;if(this.deepLinkSessionKey=null,t&&this.refreshSessionList(),this.expandedSessionKey===e){this.expandedSessionKey=null;return}this.expandedSessionKey=e}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&this.sessionMenu.sessionId===e.sessionId&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,sessionId:e.sessionId,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.context&&qe(this.context.gateway).unwatch(this),this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}let r=qe(n.context.gateway),i=ae(e.key,this.sessionAgentId(e.key,n.context));Tt({client:n.client,loadPullRequests:B(n.context.gateway.snapshot,`controlUi.sessionPullRequests.subscribe`)===!0?()=>r.load(this,i):void 0,worktreeId:e.worktree.id,execNode:e.execNode}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,t=this.context,n=e?this.result?.sessions.find(t=>t.key===e.key&&t.sessionId===e.sessionId):null;return!e||!t||!n?F:vn({context:t,row:n,menu:e,trigger:this.sessionMenuTrigger,disabled:this.loading,groups:this.knownCategories(),work:this.sessionMenuWork,onClose:()=>this.closeSessionMenu(),onAction:r=>{switch(r.kind){case`open-pr`:be(r.url);break;case`open-in`:pt(r.editor,r.path);break;case`copy-session-id`:case`copy-session-link`:case`copy-session-preview-link`:case`copy-markdown`:case`open-new-tab`:case`open-new-window`:case`split-right`:case`split-below`:dt(r.kind,{context:t,session:n,agentId:n.agentId,isCurrent:()=>this.isConnected&&this.context===t});break;case`toggle-pin`:this.patchSession(n.key,{pinned:n.pinned!==!0});break;case`toggle-involving-me`:{let e=this.captureRequestScope();if(!e||!n.sessionId){this.error=C(`sessionsView.actionRequiresConnection`);break}S(e.client,{key:n.key,expectedSessionId:n.sessionId,agentId:n.agentId??this.sessionAgentId(n.key,e.context),hidden:!n.hiddenFromInvolvingMe}).then(async()=>{this.isRequestScopeCurrent(e)&&await this.refreshSessionList(e)}).catch(t=>{this.isRequestScopeCurrent(e)&&(this.error=h(t))});break}case`toggle-unread`:this.patchSession(n.key,{unread:n.unread!==!0});break;case`rename`:this.renameSession(n);break;case`set-color`:this.patchSession(n.key,{color:r.color});break;case`set-icon`:this.patchSession(n.key,{icon:r.icon});break;case`reset-appearance`:this.patchSession(n.key,{icon:null,color:null});break;case`fork`:this.forkSession(n.key,n.hasActiveRun===!0);break;case`plugin`:this.runPluginAction(r.id,e);break;case`move-to-group`:this.assignCategory(n.key,r.category);break;case`new-group`:this.requestNewCategory(n.key);break;case`toggle-archived`:n.archived===!0?this.patchSession(n.key,{archived:!1},void 0,n.sessionId):this.archiveSessionWithUndo(n);break;case`assign-owner`:this.context?.sessions.assignOwner(n.key,r.owner);break;case`stop-cloud-worker`:this.stopCloudWorker(n);break;case`delete`:this.deleteSessionFromMenu(n)}}})}render(){let e=this.context,t=(this.result?.owners?.length??0)>1;return e?P`
      ${nn({active:`sessions`,title:Ne(`sessions`),subtitle:P`${Me(`sessions`)} ${Ot(ir)}`,actions:Qt({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection}),onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
      ${Kt(Un({loading:this.loading,refreshing:this.refreshing,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,basePath:e.basePath,agentId:se(e),mainKey:E({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),searchQuery:this.searchQuery,transcriptSearchAvailable:e.gateway.snapshot.phase===`connected`,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearchTask.render({initial:()=>({status:`idle`}),pending:()=>({status:`loading`}),complete:e=>({status:`results`,...e}),error:e=>({status:`error`,message:h(e)})}),agentIdentityById:on(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:t||this.groupBy!==`person`?this.groupBy:`none`,personGroupingAvailable:t,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,patchWriteDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,label:null}}),patchAdminDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,thinkingLevel:null}}),groupWriteDisabledReason:this.mutationDisabledReason({method:`sessions.groups.put`,requiredScope:`operator.write`}),deleteArchivedDisabledReason:this.mutationDisabledReason({method:`sessions.delete`,params:{key:``,archivedOnly:!0,deleteTranscript:!0}}),deleteSelectedDisabledReason:this.selectedDeleteDisabledReason(),onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()},onSearchChange:e=>{this.routeDataEnabled=!1,this.deepLinkSessionKey=null,this.searchQuery=e,this.page=0,this.selectedKeys=new Set,this.clearSearchTimer(),this.captureRequestScope()&&(this.searchTimer=setTimeout(()=>{this.searchTimer=void 0,this.bindSessionList()},ar)),this.bindSessionList()},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.resetTranscriptSearchState(``),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>void this.requestNewCategory(e),onLoadMore:()=>{let e=this.listBinding,t=this.result?.nextOffset;e&&this.result?.hasMore&&t!=null&&!this.loading&&this.loadSessionList(e,{offset:t,append:!0})},onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.refreshSessionList(),onStatusFilterChange:e=>this.updateStatusFilter(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>{let n=_e(e,t),r=O({context:e,face:n,sessionKey:t,agentId:this.sessionPathAgentId(t,e),preferenceDerivedFace:!0});e.navigate(n,r.options)},onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:P``}async runPluginAction(e,t){let n=this.captureRequestScope();if(n)try{await zt({runtime:n.context.plugins,id:e,placement:`session`,sessionKey:t.key,session:this.result?.sessions.find(e=>e.key===t.key&&e.sessionId===t.sessionId),signal:this.pluginActionLifetime.signal})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=h(e))}}},o([a({context:Ee,subscribe:!0})],$.prototype,`context`,void 0),o([Te({attribute:!1})],$.prototype,`routeData`,void 0),o([L()],$.prototype,`result`,void 0),o([L()],$.prototype,`loading`,void 0),o([L()],$.prototype,`refreshing`,void 0),o([L()],$.prototype,`error`,void 0),o([L()],$.prototype,`activeMinutes`,void 0),o([L()],$.prototype,`limit`,void 0),o([L()],$.prototype,`includeGlobal`,void 0),o([L()],$.prototype,`includeUnknown`,void 0),o([L()],$.prototype,`statusFilter`,void 0),o([L()],$.prototype,`searchQuery`,void 0),o([L()],$.prototype,`transcriptSearchQuery`,void 0),o([L()],$.prototype,`submittedTranscriptSearchQuery`,void 0),o([L()],$.prototype,`sortColumn`,void 0),o([L()],$.prototype,`sortDir`,void 0),o([L()],$.prototype,`groupBy`,void 0),o([L()],$.prototype,`page`,void 0),o([L()],$.prototype,`pageSize`,void 0),o([L()],$.prototype,`selectedKeys`,void 0),o([L()],$.prototype,`sessionMenu`,void 0),o([L()],$.prototype,`sessionMenuWork`,void 0),o([L()],$.prototype,`expandedSessionKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$)})))()}or();
//# sourceMappingURL=sessions-page-C0xbskGa.js.map