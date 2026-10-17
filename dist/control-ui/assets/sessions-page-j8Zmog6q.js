const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-FA596G1g.js","./session-snapshot-database-I03lE5X1.js","./control-ui-core-yIvVj14Y.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Bc as n,Cu as r,Eu as i,Fl as a,Fs as o,Hc as s,Hr as c,Ko as l,Lc as u,Li as d,Lo as f,Ml as p,R as m,Ru as h,Sl as g,Tu as ee,Uc as _,Ur as v,Vc as te,W as y,Wl as b,Ys as x,Zs as S,_l as C,dn as w,du as T,fn as E,j as D,jl as O,ju as k,kc as ne,lu as re,pu as A,uu as ie,vl as ae,wl as oe,xo as se,xr as ce,yl as le,yo as ue,z as de}from"./control-ui-core-CTSdBcaH.js";import{Ai as fe,La as pe,Ra as me,Ti as he,bi as ge,na as j,ra as M,wa as _e,wi as ve,xi as ye}from"./control-ui-core-vFnxmx94.js";import{$ as N,F as be,M as xe,X as P,Y as F,ct as I,nt as Se,ut as Ce}from"./lit-runtime-TNZj1e-P.js";import{_ as L,b as we}from"./control-ui-boot-chat-Bwz7X55z.js";import{c as Te,d as Ee,l as R}from"./gateway-runtime-DiNPDWPd.js";import{A as De,Cn as Oe,Do as ke,Dr as Ae,En as je,Eo as Me,Er as Ne,Go as Pe,Kr as Fe,M as Ie,N as Le,Qr as Re,Vr as ze,Zr as Be,k as Ve,o as He,s as Ue}from"./control-ui-boot-shared-D4E0xCZu.js";import{Co as We,Do as z,Ei as Ge,Nr as Ke,Pr as qe,Xa as Je,Xr as Ye,Zr as Xe,_t as B,ii as V,ki as H,oa as Ze,sa as Qe,wo as $e}from"./ui-CnRtCcYL.js";import{A as et,O as tt,k as nt}from"./control-ui-boot-shared-kUERtt7j.js";import{Bi as U,Cr as rt,Dn as it,En as at,G as ot,Gn as st,I as W,R as ct,Wn as lt,X as ut,Y as dt,Z as G,at as ft,bi as pt,c as mt,ct as ht,it as gt,l as _t,lt as vt,n as yt,s as bt,t as xt,u as St,ut as Ct,zi as wt}from"./control-ui-boot-shared-DeF_v3ER.js";import{a as Tt,n as Et,o as Dt,r as Ot,t as kt}from"./session-workspace-recovery.runtime-CDI4nGKH.js";import{$i as At,Hc as jt,Ic as Mt,Li as Nt,Nc as K,Oc as Pt,Ri as Ft,Uc as It,Xc as Lt,Yc as q,Zi as Rt,ea as zt,hc as Bt,ic as Vt,jc as Ht,lc as Ut,mc as Wt,nc as Gt,on as Kt,pc as qt,uc as Jt,zi as Yt}from"./control-ui-boot-shared-flpXqVdL.js";import{ct as Xt,lt as Zt}from"./control-ui-boot-shared-BIBfFukq.js";import{H as Qt,V as $t}from"./control-ui-boot-chat-D67RfeWw.js";import{n as en,t as tn}from"./transcript-search-CP_bR1P0.js";import{n as nn,t as rn}from"./cloud-worker-stop.runtime-BJ9KzYIK.js";import{n as an,t as on}from"./capacity-meter-ClTjsl9k.js";import{n as sn,t as cn}from"./sessions-hub-header-C0wvomSj.js";function ln(e){return[...new Set((e?.sessions??[]).map(e=>O(e.key)?.agentId).filter(e=>!!e))]}function un(e,t){return Object.fromEntries(ln(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}function dn(e,t){if(!e||!t)return;let n=ln(t).filter(t=>!e.get(t));n.length!==0&&e.ensure(n)}function fn(){return(fn=e((()=>{g()})))()}function pn(e,{key:t,sessionId:n,pinned:r},i){let a=e.captureConnectionScope();return a?o=>{e.isConnectionScopeCurrent(a)&&o.entry.sessionId===n&&ie({message:k(`sessionsView.sessionArchived`),actionLabel:k(`common.undo`),onAction:()=>{e.isConnectionScopeCurrent(a)&&e.patch(t,{archived:!1,...r===!0?{pinned:!0}:{}},{agentId:i,expectedSessionId:n}).catch(t=>{e.isConnectionScopeCurrent(a)&&ie({message:T(t)})})}})}:null}function mn(){return(mn=e((()=>{i(),A(),re()})))()}function hn(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function gn(e){if(!e.sessions||e.knownCategories.includes(e.name))return`completed`;try{return await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])===`completed`&&e.isCurrent()?`completed`:`stale`}catch(t){return e.isCurrent()?(e.onError(T(t)),`failed`):`stale`}}function _n(){return(_n=e((()=>{A()})))()}function vn(e,t){let n=t.deepLinkSessionKey?.trim()||null,r=O(n)?.agentId??e.agentSelection.state.scopeId?.trim(),i=!n&&t.statusFilter===`active`?t.activeMinutes:void 0;return{limit:n?50:t.limit,...i?{activeMinutes:i}:{},...n||t.search?.trim()?{search:n??t.search.trim()}:{},includeGlobal:n?!0:t.includeGlobal,includeUnknown:n?!0:t.includeUnknown,includeDerivedTitles:!1,includeLastMessage:!1,archivedFilter:t.statusFilter,...r?{agentId:r}:{}}}function yn(){return(yn=e((()=>{ce(),g()})))()}var bn;function xn(){return(xn=e((()=>{A(),Qe(),bn=class{constructor(e){this.onError=e,this.lifecycle=null}abort(){this.lifecycle?.abort()}async open(e){let t=this.lifecycle,n=t??new AbortController;this.lifecycle=n;try{let t=await this.load();if(!t)return null;let r=e();return await t({...r,signal:r.signal?AbortSignal.any([n.signal,r.signal]):n.signal})??null}finally{!t&&this.lifecycle===n&&(this.lifecycle=null)}}async load(){try{return(await Ze(async()=>{let{showInputDialog:e}=await import(`./input-dialog-FA596G1g.js`).then(e=>(e.t(),e.n));return{showInputDialog:e}},__vite__mapDeps([0,1,2]),import.meta.url)).showInputDialog}catch(e){return this.onError(T(e)),null}}}})))()}function Sn(){return Mt(h()?.getItem(J))}function Cn(e){try{h()?.setItem(J,e)}catch{}}var J;function wn(){return(wn=e((()=>{K(),J=`openclaw:sessions:group-by`})))()}function Tn(e,t,n){let r=new Map(t.map(e=>[e.key,e])),i=new Map(e);for(let[e,t]of i){let a=r.get(e);(a?t.sessionId?.trim()&&a.sessionId===t.sessionId:n(t))||i.delete(e)}return i.size===e.size?e:i}function En(e,t,n,r){let i=new Map(e);for(let e of n)if(r===`deselect`||r===`toggle`&&i.has(e))i.delete(e);else{let n=t.find(t=>t.key===e);n&&i.set(e,{...n})}return i}function Dn(e){let{context:t,row:n}=e,r=t.gateway.snapshot,i=a({agentsList:t.agents.state.agentsList,hello:r.hello}),o=ae(n,i),s=le([n],i),c=st(n.placement),l=!(!c||c.blocksActiveRun&&n.hasActiveRun===!0||Ee(r,c.method)!==!0),u=oe(n);return N`
    <openclaw-session-menu
      .session=${{label:z(n.label)??n.key,sessionId:z(n.sessionId)??null,pinned:n.pinned===!0,pinnable:u,snoozedUntil:n.snoozedUntil??null,unread:n.unread===!0,hiddenFromInvolvingMe:n.hiddenFromInvolvingMe,archived:n.archived===!0,archiving:t.sessions.archiveVisibility(n.key)===`pending`,category:z(n.category)??null,icon:z(n.icon)??null,color:z(n.color)??null,categoryClearReturnsToGroups:!1}}
      .anchor=${e.menu}
      .trigger=${e.trigger}
      .disabled=${e.disabled}
      .navigationAllowed=${!0}
      .copyMarkdownAllowed=${Rt(r)}
      .splitAllowed=${!1}
      .actionDisabledReasons=${ft({snapshot:r,session:{...n,pinnable:u},cloudWorkerStopAction:c})}
      .forkDisabled=${n.modelSelectionLocked===!0}
      .forkFromLastCompleted=${n.hasActiveRun===!0}
      .archiveAllowed=${o}
      .deleteAllowed=${s}
      .cloudWorkerStopAllowed=${l}
      .groups=${e.groups}
      .currentOwner=${n.owner?.actor??null}
      .work=${e.work}
      .pluginActions=${Ft(t.plugins,n)}
      .onClose=${e.onClose}
      .onAction=${t=>{t.kind!==`snooze`&&t.kind!==`wake`&&e.onAction(t)}}
    ></openclaw-session-menu>
  `}function On(){return(On=e((()=>{F(),lt(),gt(),R(),g(),At(),Nt()})))()}function kn(e,t){let n=z(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),N`
    <td>
      <select
        ?disabled=${t.loading||!!t.groupWriteDisabledReason}
        title=${t.groupWriteDisabledReason??P}
        aria-label=${k(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{if(t.groupWriteDisabledReason)return;let i=r.currentTarget;if(i instanceof HTMLSelectElement){if(i.options[i.selectedIndex]?.dataset.action===`create`){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}}
      >
        <option value="" ?selected=${!n}>${k(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>N`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option data-action="create">${k(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function An(){return(An=e((()=>{F(),i()})))()}function jn(e){let t=B(e),n=e.hasActiveRun===!1&&(!e.status||e.status===`running`),r=e.status===`queued`?k(`sessionsView.statusQueued`):t?k(`sessionsView.statusLive`):n?k(`sessionsView.statusIdle`):e.status?k(Mn[e.status]??`sessionsView.statusUnknown`):k(`sessionsView.statusUnknown`),i=e.status===`queued`?`warn`:t||e.status===`done`?`ok`:n||!e.status||e.status===`interrupted`?`muted`:`danger`,a=`${k(`sessionsView.status`)}: ${r}`;return N`
    <openclaw-tooltip .content=${a}>
      ${G({kind:i,label:r})}
    </openclaw-tooltip>
  `}var Mn;function Nn(){return(Nn=e((()=>{F(),W(),i(),Mn={queued:`sessionsView.statusQueued`,running:`sessionsView.statusRunning`,done:`sessionsView.statusDone`,failed:`sessionsView.statusFailed`,interrupted:`sessionsView.statusInterrupted`,killed:`sessionsView.statusKilled`,timeout:`sessionsView.statusTimeout`}})))()}function Pn(e){let t=[[`activeMinutes`,`minutes`,k(`sessionsView.active`),k(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),k(`sessionsView.minutesPlaceholder`),e.statusFilter!==`active`],[`limit`,`limit`,k(`sessionsView.limit`),k(`sessionsView.limitTooltip`),P,!1]],n=[[`includeGlobal`,k(`sessionsView.global`),k(`sessionsView.globalTooltip`)],[`includeUnknown`,k(`sessionsView.unknown`),k(`sessionsView.unknownTooltip`)]],{activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o}=e,s=(t,n)=>e.onFiltersChange({activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o,[t]:n}),c=r.trim()!==``||i.trim()!==`50`||!a||o||e.groupBy!==`none`;return N`
    <button
      id="sessions-filter-popover-trigger"
      type="button"
      class="btn btn--sm sessions-filter-popover__trigger ${c?`active`:``}"
      title=${k(`sessionsView.filters`)}
      aria-label=${k(`sessionsView.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${j.listFilter}
    </button>
    <wa-popover
      ${be(Ct)}
      class="sessions-filter-popover"
      for="sessions-filter-popover-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${vt}
      @wa-hide=${vt}
    >
      <div class="sessions-filter-popover__panel">
        <div class="sessions-filter-popover__fields">
          ${t.map(([t,n,r,i,a,o])=>N`
              <openclaw-tooltip .content=${i}>
                <label class="session-filter-field">
                  <span class="session-filter-label">${r}</span>
                  <input
                    class="session-filter-input session-filter-input--${n}"
                    placeholder=${a}
                    .value=${e[t]}
                    ?disabled=${o}
                    @input=${e=>{e.currentTarget instanceof HTMLInputElement&&s(t,e.currentTarget.value)}}
                  />
                </label>
              </openclaw-tooltip>
            `)}
        </div>
        <div
          class="session-filter-toggle-group"
          role="group"
          aria-label=${k(`sessionsView.sourceFilters`)}
        >
          ${n.map(([t,n,r])=>N`
              <openclaw-tooltip .content=${r}>
                <label
                  class=${`session-filter-check session-filter-toggle${e[t]?` session-filter-check--active`:``}`}
                >
                  <input
                    name=${t}
                    class="session-filter-check__input"
                    type="checkbox"
                    .checked=${e[t]}
                    @change=${e=>{e.currentTarget instanceof HTMLInputElement&&s(t,e.currentTarget.checked)}}
                  />
                  <span class="session-filter-check__mark" aria-hidden="true">${j.check}</span>
                  <span class="session-filter-check__label">${n}</span>
                </label>
              </openclaw-tooltip>
            `)}
        </div>
        <label class="session-groupby">
          <span class="session-groupby__label">${k(`sessionsView.groupBy`)}</span>
          <select
            class="session-groupby__select"
            @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.onGroupByChange(Mt(t.currentTarget.value))}}
          >
            ${Pt.filter(t=>t!==`person`||e.personGroupingAvailable).map(t=>N`
                <option value=${t} ?selected=${e.groupBy===t}>
                  ${k(Fn[t])}
                </option>
              `)}
          </select>
        </label>
        ${e.groupBy===`category`?N`
                <button
                  class="btn btn--sm"
                  ?disabled=${!!e.groupWriteDisabledReason}
                  title=${e.groupWriteDisabledReason??P}
                  @click=${()=>e.onRequestNewCategory()}
                >
                  ${j.plus} ${k(`sessionsView.newGroup`)}
                </button>
              `:P}
      </div>
    </wa-popover>
  `}var Fn;function In(){return(In=e((()=>{F(),xe(),M(),fe(),ht(),i(),K(),ue(),Fn={none:`sessionsView.groupByNone`,category:`sessionsView.groupByCategory`,person:`sessionsView.groupByPerson`,channel:`sessionsView.groupByChannel`,kind:`sessionsView.groupByKind`,agent:`sessionsView.groupByAgent`,date:`sessionsView.groupByDate`}})))()}function Ln(e,t){let n=t.find(t=>t.key===e.sessionKey);return z(n?.label)??z(n?.displayName)??e.sessionKey}function Rn(e){let t=e.transcriptSearchQuery.trim().length>0,n=e.transcriptSearch,r=n.status===`results`?n.results:[],i=n.status===`results`?n.sessions:[],a=n.status===`loading`;return N`
    <section
      class="sessions-transcript-search"
      aria-label=${k(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${k(`sessionsView.transcriptSearchTitle`)}
        @submit=${n=>{n.preventDefault(),e.transcriptSearchAvailable&&t&&!a&&e.onTranscriptSearch()}}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${k(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${k(`sessionsView.transcriptSearchPlaceholder`)}
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
          ${k(a?`sessionsView.transcriptSearchSearching`:`sessionsView.transcriptSearchAction`)}
        </button>
        ${t?N`
                <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                  ${k(`sessionsView.transcriptSearchClear`)}
                </button>
              `:P}
      </form>
      ${e.transcriptSearchAvailable?P:N`
              <div class="muted" role="status">
                ${k(`sessionsView.transcriptSearchUnavailable`)}
              </div>
            `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${a?`true`:`false`}
      >
        ${a?N`<span class="muted">${k(`sessionsView.transcriptSearchSearching`)}</span>`:P}
        ${n.status===`error`?N`
                <div
                  class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
                >
                  <span>${k(`sessionsView.transcriptSearchError`)}: ${n.message}</span>
                  <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                    ${k(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:P}
        ${n.status===`results`&&n.indexing?N`
                <div class="sessions-transcript-search__notice">
                  <span>${k(`sessionsView.transcriptSearchIndexing`)}</span>
                  <button
                    class="btn btn--sm"
                    type="button"
                    ?disabled=${a}
                    @click=${e.onTranscriptSearch}
                  >
                    ${k(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:P}
        ${n.status===`results`&&n.archivedTranscriptsExcluded>0?N`<div class="sessions-transcript-search__notice">
                ${k(`sessionsView.transcriptSearchArchivedExcluded`,{count:String(n.archivedTranscriptsExcluded)})}
              </div>`:P}
        ${n.status===`results`&&r.length===0&&!n.indexing?N`
                <div class="sessions-transcript-search__empty" role="status">
                  ${k(`sessionsView.transcriptSearchEmpty`)}
                </div>
              `:P}
        ${r.length>0?N`
                <div class="sessions-transcript-search__results">
                  <div class="sessions-transcript-search__summary">
                    <strong
                      >${k(`sessionsView.transcriptSearchMatches`,{count:String(r.length)})}</strong
                    >
                    ${n.status===`results`&&n.truncated?N`<span class="muted"
                            >${k(`sessionsView.transcriptSearchTruncated`)}</span
                          >`:P}
                  </div>
                  <div class="sessions-transcript-search__list">
                    ${r.map(t=>{let n=t.timestamp>0?de(t.timestamp):k(`common.na`),r=t.timestamp>0?m(t.timestamp):n;return N`
                        <button
                          class="sessions-transcript-search__result"
                          type="button"
                          @click=${()=>e.onNavigateToChat?.(t.sessionKey)}
                        >
                          <span class="sessions-transcript-search__result-header">
                            <strong>${Ln(t,i)}</strong>
                            <span class="muted" title=${r}>
                              ${k(`sessionsView.${t.role}`)} · ${n}
                            </span>
                          </span>
                          <span class="sessions-transcript-search__snippet">${t.snippet}</span>
                          <span class="sessions-transcript-search__key">${t.sessionKey}</span>
                        </button>
                      `})}
                  </div>
                </div>
              `:P}
      </div>
    </section>
  `}function zn(){return(zn=e((()=>{F(),i(),Me(),y(),ke()})))()}function Bn(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function Y(e,t=!1){return e.map(e=>({value:e,label:k(e===``?`sessionsView.inherit`:t&&e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function Vn(e){let t=S(e);return N`
    <span class="session-avatar session-avatar--${t}" aria-hidden="true">
      ${ar[t]??j.circle}
      ${B(e)?N`<span class="session-avatar__status"></span>`:P}
    </span>
  `}function Hn(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return N`<span class="muted">${k(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${D(t)}`,i=Kt(e),a=i.tokens>0?i.tokens:null;if(!a)return N`<span class="session-tokens__value">${r}</span>`;let o=Math.min(100,Math.round(t/a*100)),s=n?o>=sr?`danger`:o>=or?`warn`:`ok`:`stale`,c=k(i.fromLastPrompt?n?`sessionsView.promptBudgetUsage`:`sessionsView.promptBudgetUsageApprox`:n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(o),used:t.toLocaleString(),context:a.toLocaleString()});return N`
    <openclaw-tooltip .content=${c}>
      <div class="session-tokens">
        <span class="session-tokens__value"
          >${r} / ${D(a)}</span
        >
        ${an({mode:`continuous`,percent:o,tone:s,label:c})}
      </div>
    </openclaw-tooltip>
  `}function Un(e,t,n){let r=e.filter(e=>e.unread===!0&&e.archived!==!0).length,i=e.filter(e=>e.archived===!0).length,a=[[String(t),k(`sessionsView.statusLive`),t>0],[String(r),k(`sessionsView.unread`),r>0]];return n!==`active`&&a.push([String(i),k(`sessionsView.archived`),!1]),N`
    <span class="sessions-heading-facts">
      ${a.map(([e,t,n],r)=>N`
          ${r>0?N`<span class="sessions-heading-fact__separator" aria-hidden="true">·</span>`:P}
          <span
            class=${n?`sessions-heading-fact sessions-heading-fact--active`:`sessions-heading-fact`}
          >
            <strong>${e}</strong> ${t}
          </span>
        `)}
    </span>
  `}function Wn(e){return Array.from({length:cr},(t,n)=>N`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?N`<td class="data-table-checkbox-col"></td>`:N`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function Gn(e){return $e(e.searchQuery).length>0||H(e.activeMinutes)!==void 0||!e.includeGlobal}function Kn(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:Oe(e)??`0ms`}function qn(e){if(!e)return P;let t=e.status===`active`||e.status===`complete`?`ok`:`warn`,n=L(e);return N`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${G({kind:t,label:we(e)})}
      </span>
    </openclaw-tooltip>
  `}function Jn(e,t){let n=[{label:k(`sessionsView.key`),value:e.key},{label:k(`sessionsView.kind`),value:S(e)},{label:k(`sessionsView.updated`),value:t},{label:k(`sessionsView.tokens`),value:He(e)}],r=(e,t)=>{let r=z(t);r&&n.push({label:e,value:r})};r(k(`sessionsView.group`),e.category),r(k(`sessionsView.status`),e.status),e.goal&&n.push({label:k(`sessionsView.goal`),value:L(e.goal)}),r(k(`sessionsView.goalNote`),e.goal?.lastStatusNote),r(k(`sessionsView.model`),e.model),r(k(`sessionsView.provider`),e.modelProvider),r(k(`sessionsView.runtime`),Ke(e.agentRuntime)),r(k(`sessionsView.runDuration`),Kn(e.runtimeMs)),r(k(`sessionsView.surface`),e.surface),r(k(`sessionsView.subject`),e.subject),r(k(`sessionsView.room`),e.room),r(k(`sessionsView.space`),e.space),r(k(`sessionsView.sessionId`),e.sessionId),e.archiveReason&&n.push({label:k(`sessionsView.archiveReason`),value:$t(e.archiveReason)});for(let[t,r]of[[k(`sessionsView.activeRun`),e.hasActiveRun],[k(`sessionsView.archived`),e.archived],[k(`sessionsView.pinned`),e.pinned]])typeof r==`boolean`&&n.push({label:t,value:k(r?`common.yes`:`common.no`)});return n}function X(e){return e.groupBy===`category`?8:7}function Yn(e,t){let{id:n}=e;if(t.groupBy===`date`)return k({today:`sessionsView.dateToday`,yesterday:`sessionsView.dateYesterday`,week:`sessionsView.dateThisWeek`,older:`sessionsView.dateOlder`}[n]??`sessionsView.dateNoActivity`);if(n===``)return k(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let e=Bn(t.agentIdentityById,n),r=z(e?.name);if(r){let t=z(e?.emoji);return t?`${t} ${r}`:r}}if(t.groupBy===`person`){let t=e.rows[0]?.owner?.actor;return t?.identity?.type===`profile`?Fe({id:t.identity.id,name:t.label?.trim()||n}):t?.label?.trim()||n}return n}function Z(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Xn(e,t){if(e.groupBy!==`category`||e.groupWriteDisabledReason)return{dragover:P,dragleave:P,drop:P};let n=e=>e.dataTransfer?.types.includes(q)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),Z(e,!0))},dragleave:e=>Z(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),Z(r,!1);let i=r.dataTransfer?.getData(q);i&&e.onAssignCategory(i,t)}}}function Zn(e,t){let n=Yn(e,t),r=e.rows.length===1?k(`sessionsView.groupRowCountOne`,{count:`1`}):k(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=Xn(t,e.id===``?null:e.id);return N`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${X(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${j.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function Qn(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function $n(e){let t=e.result?.sessions??[],n=t.filter(B).length,r=t.filter(e=>e.archived===!0).length,i=N`
    ${k(`sessionsView.title`)}
    ${e.result?N`
            <openclaw-tooltip .content=${k(`sessionsView.store`,{path:e.result.path})}>
              <span class="settings-count">${t.length}</span>
            </openclaw-tooltip>
          `:P}
    ${e.result?Un(t,n,e.statusFilter):P}
  `,a=N`
    ${e.statusFilter===`archived`?N`
            <button
              class="btn danger"
              ?disabled=${e.loading||r===0||!!e.deleteArchivedDisabledReason}
              title=${e.deleteArchivedDisabledReason??P}
              @click=${e.onDeleteAllArchived}
            >
              ${j.trash} ${k(`sessionsView.deleteAllArchived`)}
            </button>
          `:P}
    <button class="btn" ?disabled=${e.refreshing} @click=${e.onRefresh}>
      ${e.refreshing?k(`common.loading`):k(`common.refresh`)}
    </button>
  `,o=[e.error?N`<div class="sessions-error" role="alert">${e.error}</div>`:P,dt({title:k(`sessionsView.transcriptSearchTitle`)},Rn(e)),dt({title:i,actions:a},er(e))];return ot(o,{wide:!0})}function er(e){let t=e.result?.sessions??[],n=e.sortDir===`asc`?1:-1,r=t.toSorted((t,r)=>{let i=(r.pinnedAt??0)-(t.pinnedAt??0);return i===0?(e.sortColumn===`kind`?S(t).localeCompare(S(r)):e.sortColumn===`key`?t.key.localeCompare(r.key):e.sortColumn===`updated`?(t.updatedAt??0)-(r.updatedAt??0):(t.totalTokens??t.inputTokens??t.outputTokens??0)-(r.totalTokens??r.inputTokens??r.outputTokens??0))*n:i}),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),s=e.groupBy===`none`?null:Ht({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}),c=(s?s.flatMap(e=>e.rows):r).slice(o*e.pageSize,(o+1)*e.pageSize),l=t.length===0&&Gn(e),u=e.statusFilter===`archived`?k(`sessionsView.noArchivedSessions`):e.statusFilter===`active`?k(`sessionsView.noActiveSessions`):k(`sessionsView.noSessions`),d=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return N`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        aria-sort=${i?e.sortDir===`asc`?`ascending`:`descending`:P}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        <button class="data-table-sort-button" type="button">
          ${n}
          <span class="data-table-sort-icon" aria-hidden="true">${j.arrowUpDown}</span>
        </button>
      </th>
    `},f=l?k(`sessionsView.noSessionsMatchFilters`):u,p=s?new Set(c.map(e=>e.key)):null;return N`
    <div
      class="sessions-toolbar sessions-filter-bar"
      role="group"
      aria-label=${k(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${j.search}
        <input
          type="text"
          aria-label=${k(`sessionsView.searchPlaceholder`)}
          placeholder=${k(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchChange(t.target.value)}
        />
      </div>
      ${ut({value:e.statusFilter,ariaLabel:k(`sessionsView.sessionState`),className:`sessions-view-segment`,options:[{value:`active`,label:k(`common.active`)},{value:`archived`,label:k(`sessionsView.archived`),title:k(`sessionsView.archivedOnlyTooltip`)},{value:`all`,label:k(`sessionsView.all`)}],onChange:t=>e.onStatusFilterChange(t)})}
      ${Pn(e)}
    </div>

    ${e.selectedKeys.size>0?N`
            <div class="data-table-bulk-bar">
              <span>${k(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
              <button class="btn btn--sm" @click=${e.onDeselectAll}>
                ${k(`common.unselect`)}
              </button>
              <button
                class="btn btn--sm danger"
                ?disabled=${e.loading||!!e.deleteSelectedDisabledReason}
                title=${e.deleteSelectedDisabledReason??P}
                @click=${e.onDeleteSelected}
              >
                ${j.trash} ${k(`sessionsView.deleteSelected`)}
              </button>
            </div>
          `:P}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${c.length>0?N`<input
                      type="checkbox"
                      .checked=${c.length>0&&c.every(t=>e.selectedKeys.has(t.key))}
                      .indeterminate=${c.some(t=>e.selectedKeys.has(t.key))&&!c.every(t=>e.selectedKeys.has(t.key))}
                      @change=${()=>{c.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(c.map(e=>e.key)):e.onSelectPage(c.map(e=>e.key))}}
                      aria-label=${k(`sessionsView.selectAllOnPage`)}
                    />`:P}
            </th>
            ${d(`key`,k(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?N`<th>${k(`sessionsView.group`)}</th>`:P}
            ${d(`kind`,k(`sessionsView.kind`))}
            <th class="session-status-col">${k(`sessionsView.status`)}</th>
            ${d(`updated`,k(`sessionsView.updated`))}
            ${d(`tokens`,k(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sr-only">${k(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?Wn(X(e)):c.length===0&&(e.loading||e.error||!e.result)?P:c.length===0?N`
                      <tr>
                        <td
                          colspan=${X(e)}
                          class="data-table-empty-cell"
                        >
                          <div class="data-table-empty-state" role="status" aria-live="polite">
                            <div class="data-table-empty-state__message">
                              ${l?j.search:j.messageSquare}
                              <span>${f}</span>
                            </div>
                            ${l?N`
                                    <button class="btn btn--sm" @click=${e.onClearFilters}>
                                      ${k(`sessionsView.showAll`)}
                                    </button>
                                  `:P}
                          </div>
                        </td>
                      </tr>
                    `:s?s.flatMap(t=>{let n=t.rows.filter(e=>p?.has(e.key));if(n.length===0&&t.rows.length>0)return[];let r=n.flatMap(t=>tr(t,e));return r.unshift(Zn(t,e)),r}):c.flatMap(t=>tr(t,e))}
        </tbody>
      </table>
    </div>

    ${i>0?N`
            <div class="data-table-pagination">
              <div class="data-table-pagination__info">
                ${k(`sessionsView.pagination`,{start:String(o*e.pageSize+1),end:String(Math.min((o+1)*e.pageSize,i)),total:String(i)})}
              </div>
              <div class="data-table-pagination__controls">
                <select
                  class="data-table-pagination__size"
                  aria-label=${k(`sessionsView.pageSize`)}
                  .value=${String(e.pageSize)}
                  @change=${t=>e.onPageSizeChange(Number(t.target.value))}
                >
                  ${ir.map(t=>N`<option value=${t} ?selected=${t===e.pageSize}>
                        ${k(`sessionsView.rowsPerPage`,{count:String(t)})}
                      </option>`)}
                </select>
                ${e.result?.hasMore&&e.result.nextOffset!=null?N` <button ?disabled=${e.loading} @click=${e.onLoadMore}>
                        ${k(`chat.selectors.loadMoreRosterSessions`)}
                      </button>`:P}
                <button ?disabled=${o<=0} @click=${()=>e.onPageChange(o-1)}>
                  ${k(`common.previous`)}
                </button>
                <button
                  ?disabled=${o>=a-1}
                  @click=${()=>e.onPageChange(o+1)}
                >
                  ${k(`common.next`)}
                </button>
              </div>
            </div>
          `:P}
  `}function tr(e,t){let n=e.updatedAt?de(e.updatedAt):k(`common.na`),r=t.expandedSessionKey===e.key,i=`session-details-${encodeURIComponent(e.key)}`,a=z(e.displayName)??null,s=z(e.label)??``,c=!!(a&&a!==e.key&&a!==s),l=p(e.key),u=l?Bn(t.agentIdentityById,l.agentId):null,d=z(u?.emoji)??``,f=z(u?.name)??``,m=f&&l?`${d?`${d} `:``}${f} (${l.channel})`:null,h=m??e.key,g=e.kind!==`global`,ee=g?_({face:te(e),sessionKey:e.key,fallbackAgentId:t.agentId,basePath:t.basePath,row:e,mainKey:t.mainKey}).href:null,v=S(e),y=`session-kind session-kind--${v}`,b=[`session-data-row`,`session-data-row--expandable`,t.statusFilter===`all`&&e.archived===!0?`session-data-row--archived`:``,r?`session-data-row--expanded`:``,t.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),x=k(r?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:h}),C=t.groupBy===`category`,w=Xn(t,z(e.category)??null),T=n=>Be(n,n instanceof KeyboardEvent?n.currentTarget.querySelector(`button[aria-haspopup="menu"]`):null,(n,r,i)=>t.onOpenSessionMenu(e,{x:r,y:i},n));return[N`<tr
      class=${b}
      tabindex="0"
      aria-controls=${r?i:P}
      draggable=${C?`true`:P}
      aria-description=${C?k(`sessionsView.dragSessionHint`):P}
      @dragstart=${C?t=>{t.dataTransfer?.setData(q,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:P}
      @dragover=${w.dragover}
      @dragleave=${w.dragleave}
      @drop=${w.drop}
      @contextmenu=${T}
      @click=${n=>{Qn(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{T(n),!n.defaultPrevented&&(Qn(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key)))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${`${k(`sessionsView.selectSession`)}: ${e.key}`}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${h}>
          <div class=${m?`session-key-cell`:`mono session-key-cell`}>
            ${Vn(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?N`<span
                        class="session-unread-dot"
                        role="img"
                        aria-label=${k(`sessionsView.unread`)}
                      ></span>`:P}
                ${g?N`<a
                        href=${ee}
                        class="session-link"
                        @click=${n=>{o(n)&&t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                        >${m??e.key}</a
                      >`:N`<span>${m??e.key}</span>`}
                ${s?N`<span class="session-label-chip" title=${s}
                        >${s}</span
                      >`:P}
              </span>
              ${e.kind===`global`&&!e.agentId?P:mt(O(e.key)?.agentId??e.agentId)}
              ${c?N`<span class="muted session-key-display-name">${a}</span>`:P}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${C?kn(e,t):P}
      <td>
        <span class=${y}>${v}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${jn(e)} ${qn(e.goal)}
          ${t.statusFilter===`all`&&e.archived===!0?G({kind:`muted`,label:k(`sessionsView.archived`)}):P}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${Hn(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(r)}
            aria-controls=${r?i:P}
            aria-label=${x}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${j.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${k(`chat.sidebar.openSessionMenu`)}
            aria-label=${k(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key===e.key)}
            @click=${n=>{n.stopPropagation();let r=n.currentTarget,i=r.getBoundingClientRect();t.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${j.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...r?[E()]:[]];function E(){let r=t.labelDisabledReason?.(e),o=e.thinkingLevel??``,s=o?Ie(o):``,l=e.fastMode===void 0?``:Xt(e.fastMode),u=Le({catalog:[],session:e,defaults:t.result?.defaults,sessionKey:e.key,sessionsResult:null}),d=[{label:k(`sessionsView.thinking`),current:s,options:[{value:``,label:u.inherited.displayLabel},...u.options],onChange:n=>t.onPatch(e.key,{thinkingLevel:n||null})},{label:k(`sessionsView.fast`),current:l,options:Y(rr),onChange:n=>t.onPatch(e.key,{fastMode:We(n)??null})},{label:k(`sessionsView.verbose`),current:e.verboseLevel??``,options:Y(nr,!0),onChange:n=>t.onPatch(e.key,{verboseLevel:n||null})},{label:k(`sessionsView.reasoning`),current:e.reasoningLevel??``,options:Y(Q),onChange:n=>t.onPatch(e.key,{reasoningLevel:n||null})}];return N`<tr id=${i} class="session-details-row">
      <td colspan=${X(t)}>
        <div class="session-details-panel">
          <div class="session-details-panel__hero">
            <div>
              <div class="session-details-panel__eyebrow">${k(`sessionsView.sessionDetails`)}</div>
              <div class="session-details-panel__title">${m??e.key}</div>
              ${c?N`<div class="muted session-details-panel__subtitle">${a}</div>`:P}
            </div>
            <div class="session-details-panel__badges">
              ${jn(e)} ${qn(e.goal)}
              <span class=${y}>${S(e)}</span>
            </div>
          </div>

          <div class="session-details-section">
            <div class="session-details-panel__eyebrow">${k(`sessionsView.overrides`)}</div>
            <div class="session-overrides-grid">
              <label class="session-override-field">
                <span class="session-override-field__label">${k(`sessionsView.label`)}</span>
                <input
                  class="settings-input"
                  .value=${e.label??``}
                  ?disabled=${t.loading||!!r}
                  title=${r??P}
                  placeholder=${k(`sessionsView.optionalPlaceholder`)}
                  @change=${n=>{let r=z(n.target.value)??null;t.onPatch(e.key,{label:r},{sessionScope:!0})}}
                />
              </label>
              ${d.map(({label:e,current:n,options:r,onChange:i})=>{let a=!n||r.some(e=>e.value===n)?r:[...r,{value:n,label:Ve(n)}];return N`
                  <label class="session-override-field">
                    <span class="session-override-field__label">${e}</span>
                    <select
                      class="settings-select"
                      ?disabled=${t.loading||!!t.patchAdminDisabledReason}
                      title=${t.patchAdminDisabledReason??P}
                      @change=${e=>i(e.target.value)}
                    >
                      ${a.map(e=>N`
                          <option value=${e.value} ?selected=${n===e.value}>
                            ${e.label}
                          </option>
                        `)}
                    </select>
                  </label>
                `})}
            </div>
          </div>

          <div class="session-details-grid">
            ${Jn(e,n).map(e=>N`
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
    </tr>`}}var nr,rr,Q,ir,ar,or,sr,cr;function lr(){return(lr=e((()=>{Ge(),F(),qe(),Zt(),bt(),on(),M(),W(),i(),fe(),pt(),De(),je(),y(),Re(),ze(),Ue(),x(),Lt(),K(),u(),Qt(),g(),An(),Nn(),In(),zn(),nr=[``,`off`,`on`,`full`],rr=[``,`auto`,`on`,`off`],Q=[``,`off`,`on`,`stream`],ir=[10,25,50,100],ar={cron:j.clock,direct:j.messageSquare,group:j.users,global:j.globe,unknown:j.circle},or=65,sr=85,cr=4})))()}var ur,dr,$;function fr(){return(fr=e((()=>{Xe(),tt(),Ge(),F(),Se(),_e(),ge(),he(),xt(),rn(),lt(),wt(),it(),rt(),Et(),cn(),W(),_t(),i(),d(),Ne(),A(),R(),w(),c(),Gt(),qt(),ce(),Jt(),u(),g(),At(),ue(),tn(),Dt(),It(),ee(),t(),Nt(),fn(),mn(),_n(),yn(),xn(),wn(),On(),lr(),ur=`https://docs.openclaw.ai/concepts/session`,dr=200,$=class extends r{constructor(...e){super(...e),this.result=null,this.loading=!1,this.refreshing=!1,this.error=null,this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.statusFilter=`active`,this.searchQuery=``,this.transcriptSearchQuery=``,this.submittedTranscriptSearchQuery=``,this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=Sn(),this.page=0,this.pageSize=25,this.selectedSessions=new Map,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.pageEpoch=0,this.pluginActionLifetime=new AbortController,this.routeDataEnabled=!0,this.sessionMutationPending=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.inputDialog=new bn(e=>{this.error=e}),this.observeAgentScope=Pe(()=>{this.retirePageOperations(),this.resetTranscriptSearchState(this.transcriptSearchQuery),this.deepLinkSessionKey||(this.page=0,this.selectedSessions=new Map,this.routeDataEnabled=!1,this.clearSearchTimer(),this.bindSessionList()),this.requestUpdate()}),this.subscriptions=new ne(this).watchStore(()=>this.context?.agentIdentity).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watchStore(()=>this.context?.runtimeConfig).watchStore(()=>this.context?.plugins),this.gatewayLifecycle=new jt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{let e=this.listBinding?.sessions.listSnapshot(this.listBinding.query).result;this.resetProviderState(),this.appliedListResult=e},invalidateRequests:()=>this.invalidatePageWork()}),this.transcriptSearchTask=new nt(this,{args:()=>{let e=this.context,t=e?.gateway.snapshot;return[t?.phase===`connected`?t.client??null:null,this.submittedTranscriptSearchQuery,e??null,e?.agentSelection.state.scopeId??null]},task:async([e,t,n,r],{signal:i})=>{if(!e||!t||!n)return et;let{sessions:a,results:o,indexing:s=!1,truncated:c=!1,archivedTranscriptsExcluded:l=0}=await en({client:e,query:t,listOptions:this.sessionListOptions(n,``),isCurrent:()=>!i.aborted});return{sessions:a,results:o,indexing:s,truncated:c,archivedTranscriptsExcluded:l}}})}willUpdate(e){let t=this.context?.sessions;t&&this.listBinding&&this.listBinding.sessions!==t&&(this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.invalidatePageWork(),this.resetProviderState()),(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData(),this.bindSessionList()}disconnectedCallback(){this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.subscriptions.clear(),this.invalidatePageWork(),this.inputDialog.abort(),super.disconnectedCallback()}retirePageOperations(){this.pluginActionLifetime.abort(),this.pluginActionLifetime=new AbortController,this.pageEpoch+=1,this.sessionMutationPending=!1,this.closeSessionMenu()}invalidatePageWork(){this.retirePageOperations(),this.clearSearchTimer(),this.listRequest=void 0,this.resetTranscriptSearchState(this.transcriptSearchQuery),this.loading=!1,this.refreshing=!1}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.refreshing=!1,this.resetTranscriptSearchState(``),this.selectedSessions=new Map,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.appliedListResult=void 0}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=this.gatewayLifecycle.gateway===t?this.gatewayLifecycle.client:null;return!this.gatewayLifecycle.connected||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&n.snapshot.phase===`connected`&&n.snapshot.client===e.client}mutationDisabledReason(e){let t=v(this.context?.gateway.snapshot,e);return t.allowed?void 0:t.reason}requireMutationAccess(e,t){let n=v(e.gateway.snapshot,t);return n.allowed?!0:(this.error=n.reason,!1)}selectedDeleteDisabledReason(){for(let e of this.selectedSessions.values()){let t=this.mutationDisabledReason({method:`sessions.delete`,params:{key:e.key,...e.archived===!0?{archivedOnly:!0}:{}}});if(t)return t}}applyRouteData(){let e=this.routeData,t=this.context;e&&t&&(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataEnabled&&(this.statusFilter=e.statusFilter,this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!!e.expandedSessionKey,e.expandedSessionKey&&(this.searchQuery=``,this.page=0,this.selectedSessions=new Map),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey))}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=l({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionPathAgentId(e,t){return this.sessionAgentId(e,t)??n(t)}sessionListOptions(e,t=this.searchQuery){return vn(e,{activeMinutes:H(this.activeMinutes),limit:H(this.limit)??50,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,deepLinkSessionKey:this.deepLinkSessionKey,search:t})}bindSessionList(e=!0){let t=this.context;if(!t||!this.isConnected)return;let n=t.sessions,r=this.sessionListOptions(t),i=JSON.stringify(r),a=this.listBinding,o=JSON.stringify(this.sessionListOptions(t,``));(a?.sessions!==n||a.key!==i)&&(a?.sessions===n&&n.listSnapshot(a.query).loading&&this.loadSessionList(a),this.unsubscribeList?.(),this.unsubscribeList=void 0,(a?.sessions!==n||a.transcriptKey!==o)&&this.resetTranscriptSearchState(this.transcriptSearchQuery),this.result=null,this.error=null,this.selectedSessions=new Map,this.page=0,this.listBinding={sessions:n,query:r,key:i,transcriptKey:o},this.appliedListResult=void 0);let s=this.listBinding;if(this.unsubscribeList||(this.loading=t.gateway.snapshot.phase===`connected`,!this.captureRequestScope()||this.searchTimer!==void 0||this.listRequest))return s;let c=e=>{this.applyListSnapshot(s,e)};this.unsubscribeList=n.subscribeList(r,c);let l=n.listSnapshot(r);return c(l),e&&(!l.result||l.loading)&&this.loadSessionList(s),s}applyListSnapshot(e,t){if(this.listBinding!==e||this.context?.sessions!==e.sessions)return;this.loading=t.loading,this.error=t.error;let n=t.result;n&&(n!==this.appliedListResult&&(this.appliedListResult=n,this.result=f(n,{archivedFilter:this.statusFilter}),dn(this.context?.agentIdentity,this.result)),!t.loading&&!t.error&&this.result&&this.selectedSessions.size>0&&(this.selectedSessions=Tn(this.selectedSessions,this.result.sessions,t=>e.sessions.deletionState(t.key,this.sessionAgentId(t.key),t.sessionId)===`pending`||e.sessions.archiveVisibility(t.key)===`pending`)))}async refreshSessionList(e=this.captureRequestScope()){if(!e)return;this.routeDataEnabled=!1,this.clearSearchTimer();let t=this.bindSessionList(!1);t&&t.sessions===e.sessions&&this.isRequestScopeCurrent(e)&&(await this.loadSessionList(t,{force:!0}),this.isRequestScopeCurrent(e)&&this.listBinding===t&&this.applyListSnapshot(t,t.sessions.listSnapshot(t.query)))}loadSessionList(e,t={}){if(this.listRequest)return t.force&&this.unsubscribeList&&e.sessions.refreshList({...e.query,...t}),this.listRequest;if(!this.captureRequestScope())return Promise.resolve();let n,r=new Promise(e=>{n=e}).finally(()=>{this.listRequest===r&&(this.listRequest=void 0,this.refreshing=!1,this.bindSessionList())});return this.listRequest=r,this.refreshing=!0,n(e.sessions.refreshList({...e.query,...t})),r}clearSearchTimer(){clearTimeout(this.searchTimer),this.searchTimer=void 0}adoptCurrentListSnapshot(){let e=this.listBinding;e&&this.applyListSnapshot(e,e.sessions.listSnapshot(e.query))}resetTranscriptSearchState(e){this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=``,this.transcriptSearchTask.run()}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.resetTranscriptSearchState(``);return}this.captureRequestScope()&&(this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=e,await this.transcriptSearchTask.run())}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.page=0,this.selectedSessions=new Map,this.deepLinkSessionKey=null,this.refreshSessionList()}updateStatusFilter(e){let t=this.context;e!==this.statusFilter&&t&&(this.statusFilter=e,this.clearSearchTimer(),this.page=0,this.selectedSessions=new Map,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e===`active`?void 0:{search:`?status=${e}`}))}updateSelection(e,t){this.selectedSessions=En(this.selectedSessions,this.result?.sessions??[],e,t)}async deleteSelected(){let e=[...this.selectedSessions.values()];if(e.length===0||this.loading||this.sessionMutationPending)return;let t=this.captureRequestScope();if(!t)return;let n=k(e.length===1?`sessionsView.deleteSelectedConfirmOne`:`sessionsView.deleteSelectedConfirm`,{count:String(e.length)});await U({message:n,confirmLabel:k(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(t)&&await this.deleteSessions(e.filter(e=>this.selectedSessions.get(e.key)===e))}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let n=this.captureRequestScope();if(!n)return;let r=e.map(e=>({key:e.key,agentId:this.sessionAgentId(e.key,n.context),...t,...e.sessionId?{expectedSessionId:e.sessionId}:{},...e.archived===!0?{archivedOnly:!0}:{}}));for(let e of r)if(!this.requireMutationAccess(n,{method:`sessions.delete`,params:e}))return;await this.runSessionMutation(n,async()=>{let t=async()=>{let t=await n.sessions.deleteMany(r);if(e.length===1&&t.errors.length>0)throw t.errors[0].error;return t},i=e[0],o=e.length===1?await Ot({action:`delete`,session:{...i,label:i.label||i.displayName||i.key,agentId:r[0].agentId},scope:{...n,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(n),request:t}):await t();if(this.isRequestScopeCurrent(n)&&o){if(o.preservedWorktrees.length>0&&window.alert(Tt(o.preservedWorktrees)),o.deleted.length>0){let e=new Set(o.deleted),t=new Map(this.selectedSessions);for(let e of o.deleted)t.delete(e);this.selectedSessions=t,this.expandedSessionKey&&e.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&e.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let r=o.deleted.find(e=>C(e,n.gateway.snapshot.sessionKey));if(r){let e=O(r)?.agentId??n.context.agentSelection.state.selectedId??`main`;ye({selection:n.context.agentSelection,gateway:n.gateway,agentId:e,sessionKey:Je({agentId:e,mainKey:a({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})})})}}return await this.refreshSessionList(n),o.errors.length>0?o.errors.map(({error:e})=>kt(e)).join(`; `):void 0}})}async deleteAllArchived(){let e=this.captureRequestScope(),t=this.pluginActionLifetime.signal;if(!e||this.loading||this.sessionMutationPending)return;let n;try{let{search:t,agentId:r,...i}=this.sessionListOptions(e.context),a=e.context.agentSelection.state.scopeId?.trim(),o={...i,...a?{agentId:a}:{}},s=await Ut({list:t=>e.sessions.list({...o,limit:1e3,offset:t}),isCurrent:()=>this.isRequestScopeCurrent(e),missingResultError:e.sessions.state.error??`archived session enumeration returned no result`,stalledPaginationError:`archived session enumeration did not advance`,incompletePaginationError:`archived session enumeration was incomplete`});if(!s)return;n=s}catch(t){this.isRequestScopeCurrent(e)&&(this.error=T(t));return}let r=n.filter(e=>e.archived===!0);r.length!==0&&await U({message:k(`sessionsView.deleteAllArchivedConfirm`,{count:String(r.length)}),confirmLabel:k(`common.delete`),danger:!0,signal:t})&&this.isRequestScopeCurrent(e)&&await this.deleteSessions(r,{deleteTranscript:!0})}async deleteSessionFromMenu(e){let t=z(e.label)??e.key,n=this.captureRequestScope();n&&await U({message:k(`sessionsView.deleteSessionConfirm`,{session:t}),confirmLabel:k(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(n)&&await this.deleteSessions([e])}async stopCloudWorker(e){let t=z(e.label)??e.key,n=st(e.placement);if(!n||n.blocksActiveRun&&e.hasActiveRun===!0)return;let r=this.captureRequestScope();r&&await U({message:k(`sessionsView.stopCloudWorkerConfirm`,{session:t}),confirmLabel:k(`sessionsView.stopCloudWorkerConfirmAction`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(r)&&this.requireMutationAccess(r,n)&&await this.runSessionMutation(r,async()=>{let t=O(e.key)?.agentId;await nn(r.client,{key:e.key,...t?{agentId:t}:{}},r.context.placementStartup),this.isRequestScopeCurrent(r)&&await this.refreshSessionList(r)})}async runSessionMutation(e,t){this.sessionMutationPending=!0;let n;try{n=await t()}catch(t){this.isRequestScopeCurrent(e)&&(n=T(t))}finally{this.isRequestScopeCurrent(e)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),n&&(this.error=n))}}knownCategories(){return hn(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,this.page=0,Cn(e)}async rememberCustomGroup(e,t=this.captureRequestScope()){return t?this.requireMutationAccess(t,{method:`sessions.groups.put`,requiredScope:`operator.write`})?gn({name:e,knownCategories:this.knownCategories(),sessions:t.sessions,isCurrent:()=>this.isRequestScopeCurrent(t),onError:e=>{this.error=e}}):`failed`:`stale`}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}async requestNewCategory(e){let t=this.result?.sessions.find(t=>t.key===e);if(e&&!t?.sessionId){this.error=k(`common.refresh`);return}await this.inputDialog.open(()=>({title:k(`sessionsView.newGroupTitle`),label:k(`sessionsView.newGroupPrompt`),submitLabel:k(`sessionsView.newGroupCreate`),requireValue:!0,submit:e=>this.writeNewCategory(e,t)}))}async writeNewCategory(e,t){this.error=null;let n=this.captureRequestScope();if(!n)return k(`sessionsView.newGroupFailed`);let r=await this.rememberCustomGroup(e,n);if(r!==`completed`)return r===`failed`?this.error??k(`sessionsView.newGroupFailed`):k(`sessionsView.newGroupStale`);if(!t)return null;let i=await this.patchSession(t.key,{category:e},n,t.sessionId);return i===`failed`?this.error??k(`sessionsView.newGroupFailed`):i===`stale`?k(`sessionsView.newGroupStale`):null}async renameSession(e){let t=this.captureRequestScope();if(!t){this.error=k(`sessionsView.actionRequiresConnection`);return}let n=Bt(e),r=this.pluginActionLifetime.signal,i=await this.inputDialog.open(()=>({signal:r,title:k(`sessionsView.renameSessionPrompt`),defaultValue:n}));if(i===null||!this.isRequestScopeCurrent(t))return;let a=Wt(i,n,e.label);a&&await this.patchSession(e.key,a,t,e.sessionId,{sessionScope:!0})}async patchSession(e,t,n=this.captureRequestScope(),r,i={}){if(!n)return this.error=k(`sessionsView.actionRequiresConnection`),`failed`;if(typeof t.archived==`boolean`&&!r?.trim())return this.error=`Session lifecycle action requires a durable session identity.`,`failed`;let a=this.sessionAgentId(e,n.context),o=this.result?.sessions.find(t=>t.key===e);if(!this.requireMutationAccess(n,{method:`sessions.patch`,sessionScope:i.sessionScope,session:o,params:{key:e,...t,...a?{agentId:a}:{}}}))return`failed`;try{let s=()=>n.sessions.patch(e,t,{agentId:a,...r?{expectedSessionId:r}:{}}),c=t.archived===!0?await Ot({action:`archive`,session:{key:e,sessionId:r,label:o?.label||o?.displayName||e,agentId:a},scope:{...n,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(n),request:s}):await s();if(c&&i.onConfirmed?.(c),!this.isRequestScopeCurrent(n))return`stale`;if(!c)return this.error=n.sessions.state.error,`failed`;if(await this.refreshSessionList(n),!this.isRequestScopeCurrent(n))return`stale`;let l=new Map(this.selectedSessions);return l.delete(e),this.selectedSessions=l,`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=T(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t)return;let n=pn(t.sessions,e,this.sessionAgentId(e.key,t.context));if(!n)return;let r=t.sessions.beginArchive(e.key,e.sessionId);if(r)try{await this.patchSession(e.key,{archived:!0},t,e.sessionId,{onConfirmed:n,sessionScope:!0})}finally{r()}}async forkSession(e,t=!1){let n=this.captureRequestScope();if(!n)return;let r=this.sessionAgentId(e,n.context),i={parentSessionKey:e,fork:!0,...t?{forkFrom:`last-completed`}:{},...r?{agentId:r}:{}};if(this.requireMutationAccess(n,{method:`sessions.create`,params:i}))try{let e=await n.sessions.create(i);if(!this.isRequestScopeCurrent(n))return;e?n.context.navigate(`chat`,{..._({context:n.context,face:`chat`,sessionKey:e,agentId:r??this.sessionPathAgentId(e,n.context)}).options,hash:``}):n.sessions.state.error&&(this.error=n.sessions.state.error)}catch(e){this.isRequestScopeCurrent(n)&&(this.error=T(e))}}async toggleSessionDetails(e){if(!this.context)return;let t=this.deepLinkSessionKey!==null;if(this.deepLinkSessionKey=null,t&&this.refreshSessionList(),this.expandedSessionKey===e){this.expandedSessionKey=null;return}this.expandedSessionKey=e}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&this.sessionMenu.sessionId===e.sessionId&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,sessionId:e.sessionId,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.context&&Vt(this.context.gateway).unwatch(this),this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}let r=Vt(n.context.gateway),i=b(e.key,this.sessionAgentId(e.key,n.context));at({client:n.client,loadPullRequests:Te(n.context.gateway.snapshot,`controlUi.sessionPullRequests.subscribe`,`operator.read`)?()=>r.load(this,i):void 0,worktreeId:e.worktree.id,execNode:e.execNode}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,t=this.context,n=e?this.result?.sessions.find(t=>t.key===e.key&&t.sessionId===e.sessionId):null;return!e||!t||!n?P:Dn({context:t,row:n,menu:e,trigger:this.sessionMenuTrigger,disabled:this.loading,groups:this.knownCategories(),work:this.sessionMenuWork,onClose:()=>this.closeSessionMenu(),onAction:r=>{switch(r.kind){case`open-pr`:E(r.url);break;case`open-in`:Ae(r.editor,r.path);break;case`copy-session-id`:case`copy-session-link`:case`copy-session-preview-link`:case`copy-markdown`:case`open-new-tab`:case`open-new-window`:case`split-right`:case`split-below`:zt(r.kind,{context:t,session:n,agentId:n.agentId,isCurrent:()=>this.isConnected&&this.context===t});break;case`toggle-pin`:this.patchSession(n.key,{pinned:n.pinned!==!0},void 0,void 0,{sessionScope:!0});break;case`toggle-involving-me`:{let e=this.captureRequestScope();if(!e||!n.sessionId){this.error=k(`sessionsView.actionRequiresConnection`);break}se(e.client,{key:n.key,expectedSessionId:n.sessionId,agentId:n.agentId??this.sessionAgentId(n.key,e.context),hidden:!n.hiddenFromInvolvingMe}).then(async()=>{this.isRequestScopeCurrent(e)&&await this.refreshSessionList(e)}).catch(t=>{this.isRequestScopeCurrent(e)&&(this.error=T(t))});break}case`toggle-unread`:this.patchSession(n.key,{unread:n.unread!==!0});break;case`rename`:this.renameSession(n);break;case`set-color`:this.patchSession(n.key,{color:r.color});break;case`set-icon`:this.patchSession(n.key,{icon:r.icon});break;case`reset-appearance`:this.patchSession(n.key,{icon:null,color:null});break;case`fork`:this.forkSession(n.key,n.hasActiveRun===!0);break;case`plugin`:this.runPluginAction(r.id,e);break;case`move-to-group`:this.assignCategory(n.key,r.category);break;case`new-group`:this.requestNewCategory(n.key);break;case`toggle-archived`:n.archived===!0?this.patchSession(n.key,{archived:!1},void 0,n.sessionId,{sessionScope:!0}):this.archiveSessionWithUndo(n);break;case`assign-owner`:{let e=this.captureRequestScope();if(!e){this.error=k(`sessionsView.actionRequiresConnection`);break}if(!this.requireMutationAccess(e,{method:`sessions.assignOwner`,params:{key:n.key,owner:r.owner},requiredScope:`operator.write`}))break;this.runSessionMutation(e,async()=>await e.sessions.assignOwner(n.key,r.owner)||!this.isRequestScopeCurrent(e)?void 0:e.sessions.state.error??void 0);break}case`stop-cloud-worker`:this.stopCloudWorker(n);break;case`delete`:this.deleteSessionFromMenu(n)}}})}render(){let e=this.context,t=(this.result?.owners?.length??0)>1;return e?N`
      ${sn({active:`sessions`,title:me(`sessions`),subtitle:N`${pe(`sessions`)} ${ct(ur)}`,actions:yt({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection}),onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
      ${St($n({loading:this.loading,refreshing:this.refreshing,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,basePath:e.basePath,agentId:n(e),mainKey:a({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),searchQuery:this.searchQuery,transcriptSearchAvailable:e.gateway.snapshot.phase===`connected`,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearchTask.render({initial:()=>({status:`idle`}),pending:()=>({status:`loading`}),complete:e=>({status:`results`,...e}),error:e=>({status:`error`,message:T(e)})}),agentIdentityById:un(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:t||this.groupBy!==`person`?this.groupBy:`none`,personGroupingAvailable:t,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:new Set(this.selectedSessions.keys()),sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,labelDisabledReason:e=>this.mutationDisabledReason({method:`sessions.patch`,params:{key:e.key,label:null},sessionScope:!0,session:e}),patchAdminDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,thinkingLevel:null}}),groupWriteDisabledReason:this.mutationDisabledReason({method:`sessions.groups.put`,requiredScope:`operator.write`}),deleteArchivedDisabledReason:this.mutationDisabledReason({method:`sessions.delete`,params:{key:``,archivedOnly:!0,deleteTranscript:!0}}),deleteSelectedDisabledReason:this.selectedDeleteDisabledReason(),onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.searchQuery=``,this.page=0,this.selectedSessions=new Map,this.deepLinkSessionKey=null,this.refreshSessionList()},onSearchChange:e=>{this.routeDataEnabled=!1,this.deepLinkSessionKey=null,this.searchQuery=e,this.page=0,this.selectedSessions=new Map,this.clearSearchTimer(),this.captureRequestScope()&&(this.searchTimer=setTimeout(()=>{this.searchTimer=void 0,this.bindSessionList()},dr)),this.bindSessionList()},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.resetTranscriptSearchState(``),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>void this.requestNewCategory(e),onLoadMore:()=>{let e=this.listBinding,t=this.result?.nextOffset;e&&this.result?.hasMore&&t!=null&&!this.loading&&this.loadSessionList(e,{offset:t,append:!0})},onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.refreshSessionList(),onStatusFilterChange:e=>this.updateStatusFilter(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t,n)=>void this.patchSession(e,t,void 0,void 0,n),onToggleSelect:e=>this.updateSelection([e],`toggle`),onSelectPage:e=>this.updateSelection(e,`select`),onDeselectPage:e=>this.updateSelection(e,`deselect`),onDeselectAll:()=>{this.selectedSessions=new Map},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>{let n=s(e,t),r=_({context:e,face:n,sessionKey:t,agentId:this.sessionPathAgentId(t,e),preferenceDerivedFace:!0});e.navigate(n,r.options)},onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:N``}async runPluginAction(e,t){let n=this.captureRequestScope();if(n)try{await Yt({runtime:n.context.plugins,id:e,placement:`session`,sessionKey:t.key,session:this.result?.sessions.find(e=>e.key===t.key&&e.sessionId===t.sessionId),signal:this.pluginActionLifetime.signal})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=T(e))}}},V([Ye({context:ve,subscribe:!0})],$.prototype,`context`,void 0),V([Ce({attribute:!1})],$.prototype,`routeData`,void 0),V([I()],$.prototype,`result`,void 0),V([I()],$.prototype,`loading`,void 0),V([I()],$.prototype,`refreshing`,void 0),V([I()],$.prototype,`error`,void 0),V([I()],$.prototype,`activeMinutes`,void 0),V([I()],$.prototype,`limit`,void 0),V([I()],$.prototype,`includeGlobal`,void 0),V([I()],$.prototype,`includeUnknown`,void 0),V([I()],$.prototype,`statusFilter`,void 0),V([I()],$.prototype,`searchQuery`,void 0),V([I()],$.prototype,`transcriptSearchQuery`,void 0),V([I()],$.prototype,`submittedTranscriptSearchQuery`,void 0),V([I()],$.prototype,`sortColumn`,void 0),V([I()],$.prototype,`sortDir`,void 0),V([I()],$.prototype,`groupBy`,void 0),V([I()],$.prototype,`page`,void 0),V([I()],$.prototype,`pageSize`,void 0),V([I()],$.prototype,`selectedSessions`,void 0),V([I()],$.prototype,`sessionMenu`,void 0),V([I()],$.prototype,`sessionMenuWork`,void 0),V([I()],$.prototype,`expandedSessionKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$)})))()}fr();
//# sourceMappingURL=sessions-page-j8Zmog6q.js.map