import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ga as t,Ha as n,Qr as r,Ra as i,Ua as a,Zr as o,ai as s,qa as c}from"./control-ui-foundation-CFtg1tJp.js";import{Ar as l,Bc as u,Dc as d,Fs as f,Gl as p,Is as m,Jl as ee,Ll as te,Ls as h,Oc as ne,Vc as re,Xl as g,_n as ie,dc as ae,dn as oe,fn as _,hi as se,in as v,lc as ce,nc as le,rn as ue,tc as de,zl as fe}from"./control-ui-core-57AfAcCO.js";import{$ as y,B as pe,H as b,X as x,Y as S,c as me,ct as C,nt as he,r as ge,s as _e,t as ve,ut as ye}from"./lit-runtime-672ruXeP.js";import{Di as be,Fi as xe,Ii as Se,Ni as Ce,Oa as we,Oi as Te,Or as Ee,Pi as w,Qa as De,ba as Oe,do as ke,fo as Ae,kr as je}from"./control-ui-core-Dt-FpjJ3.js";import{h as Me,m as Ne}from"./control-ui-boot-shared-BgyYtRDC.js";import{$ as Pe,Ba as Fe,Da as Ie,Ea as T,Ga as Le,Ha as Re,Ht as ze,Ja as Be,Jt as Ve,Ka as He,Kt as Ue,La as We,Oa as Ge,Qa as Ke,Ra as qe,Ua as Je,Va as Ye,Vl as Xe,Wa as Ze,Xa as Qe,Ya as $e,Yt as et,Za as tt,ao as E,co as D,da as nt,do as rt,et as it,fo as at,go as ot,ho as st,io as ct,ir as lt,la as ut,lo as dt,no as ft,on as pt,qa as mt,ro as O,to as ht,tt as gt,ua as _t,za as vt}from"./control-ui-boot-shared-BQax9AK9.js";import{At as yt,Cr as bt,Ct as xt,Da as St,Dt as Ct,Et as k,Pa as wt,Qn as Tt,St as Et,Ta as Dt,Tr as Ot,Ur as kt,Wr as At,co as jt,er as Mt,f as Nt,jt as Pt,p as Ft,pt as A,so as It,wt as Lt}from"./control-ui-boot-shared-Cf6Z0dqU.js";import{c as Rt,cn as zt,on as Bt,s as Vt,sn as Ht}from"./control-ui-boot-shared-CoP6HpTl.js";import"./control-ui-boot-shared-ClJo_QFT.js";import{mt as Ut}from"./control-ui-boot-new-CEVUyh0K.js";import{n as Wt,t as Gt}from"./channel-picker-D6PoS6h7.js";import{n as Kt,t as qt}from"./settings-workspace-ISH5tcNd.js";import{n as Jt,t as Yt}from"./agent-row-chip-BB9OSy5_.js";import{n as Xt,t as Zt}from"./model-picker-DhgYeFfn.js";import{i as j,n as Qt,r as M,t as $t}from"./cron-jobs-pagination-9B18lG2a.js";import{n as en,s as tn}from"./presenter-CCjmYH5E.js";import{n as nn,t as rn}from"./agent-scope-control-CT4MobdR.js";var an;function on(){return(on=e((()=>{an=class{constructor(e){this.host=e,this.footer=null,this.scroller=null,this.observer=null,this.previousPadding=``,e.addController(this)}hostUpdated(){let e=this.host.querySelector(`.cron-editor-actions`),t=this.host.closest(`.content`);if(e===this.footer&&t===this.scroller||(this.hostDisconnected(),!e||!t))return;this.footer=e,this.scroller=t,this.previousPadding=t.style.scrollPaddingBlockEnd;let n=()=>{let n=getComputedStyle(t).paddingBlockEnd;t.style.scrollPaddingBlockEnd=`calc(${e.getBoundingClientRect().height}px + ${n})`};n(),typeof ResizeObserver==`function`&&(this.observer=new ResizeObserver(n),this.observer.observe(e),this.observer.observe(t))}hostDisconnected(){this.observer?.disconnect(),this.observer=null,this.scroller&&(this.scroller.style.scrollPaddingBlockEnd=this.previousPadding),this.footer=null,this.scroller=null}}})))()}function sn(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return``}}function cn(){try{return Intl.supportedValuesOf?.(`timeZone`)??[]}catch{return[]}}function ln(e,r=sn(),i=cn()){let a=e.map(e=>e.schedule.kind===`cron`&&typeof e.schedule.tz==`string`?e.schedule.tz:``);return t([r,`UTC`,...a,...n(i)])}function un(){return(un=e((()=>{i()})))()}function dn(e){let t=u(e.runtimeConfig),r=e.cron.cronForm.deliveryChannel.trim()||`last`,i=new Set((e.agentsList?.agents??[]).filter(e=>e.kind===`system`).map(e=>e.id.trim())),a=n([...ne(e.agentsList?.agents??[]).map(e=>e.id.trim()),...e.cron.cronJobs.map(e=>typeof e.agentId==`string`&&!i.has(e.agentId.trim())?e.agentId.trim():``)]),o=n([...e.modelSuggestions,...He(t),...e.cron.cronJobs.map(e=>{let t=dt(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),s=n(e.cron.cronJobs.map(e=>e.delivery?.to)),c=(r===`last`?Object.values(e.channels.channelsSnapshot?.channelAccounts??{}).flat():e.channels.channelsSnapshot?.channelAccounts?.[r]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean);return{agentSuggestions:a,modelSuggestions:o,timezoneSuggestions:ln(e.cron.cronJobs),accountTargets:c,deliveryToSuggestions:e.cron.cronForm.deliveryMode===`webhook`?s.filter(e=>/^https?:\/\//i.test(e)):s}}var fn;function pn(){return(pn=e((()=>{i(),d(),re(),Ye(),un(),fn=[`off`,`minimal`,`low`,`medium`,`high`]})))()}function mn(e){let t=new URLSearchParams(e),n=t.get(`job`)?.trim()||null,r=t.get(`session`)?.trim(),i=t.get(`agent`)?.trim();return{jobId:n,runId:n&&t.get(`run`)?.trim()||null,...!n&&r&&i?{session:{sessionKey:r,sessionAgentId:i}}:{}}}function hn(e,t){if(t.runId===e)return!0;let n=gn.exec(e);return n!==null&&n[1]===t.jobId&&t.runAtMs===Number(n[2])}var gn;function N(){return(N=e((()=>{gn=/^cron:(.+):(\d+)$/u})))()}var _n;function vn(){return(vn=e((()=>{S(),p(),h(),ze(),Bt(),Vt(),_n=class{constructor(e,t){this.host=e,this.capture=t,this.attempt=0,this.entry=null,this.task=null,this.candidateId=null,this.error=null,this.transcript={client:null,connected:!1,requestUpdate:()=>this.host.requestUpdate()},e.addController(this)}hostDisconnected(){this.close()}close(){this.attempt++,zt(this.transcript),this.entry=null,this.task=null,this.candidateId=null,this.error=null,this.host.requestUpdate()}observe(e){let t=Ue(e);if(t){if(t.action===`deleted`&&(t.taskId===this.task?.id||t.taskId===this.candidateId)){this.close();return}Ht(this.transcript,t)}}async open(e){this.close();let t=this.capture();if(!t)return;this.entry=e;let n=this.attempt,r=()=>n===this.attempt&&this.host.isConnected&&t.isCurrent(),i=t=>t.runtime===`cron`&&t.sourceId===e.jobId&&t.childSessionKey===e.sessionKey&&t.startedAt===e.runAtMs;try{if(!e.jobId||!e.sessionKey?.trim()||typeof e.runAtMs!=`number`||!Number.isFinite(e.runAtMs))throw Error(g(`cron.runEntry.transcriptMissingMetadata`));let n=new Map,a=new Set,o;do{let s=et(await t.client.request(`tasks.list`,{sessionKey:e.sessionKey,limit:500,...o?{cursor:o}:{}}));if(!r())return;if(!s)throw Error(g(`tasksPage.invalidResponse`));for(let e of s.tasks)i(e)&&n.set(e.id,e);if(o=s.nextCursor,o){if(a.has(o))throw Error(g(`tasksPage.invalidResponse`));a.add(o)}}while(o);let[s]=n.values();if(n.size!==1||!s)throw Error(g(`cron.runEntry.transcriptUnavailable`));this.candidateId=s.id;let c=Ve(await t.client.request(`tasks.get`,{taskId:s.id}));if(!r())return;if(!c||c.id!==s.id||!i(c)||!c.hasTranscript)throw Error(g(`cron.runEntry.transcriptUnavailable`));this.task=c,Object.assign(this.transcript,{client:t.client,connected:!0,connectionEpoch:t.epoch})}catch(e){if(!r())return;this.error=f(e,g(`tasksPage.loadFailed`))}if(!r()||(this.host.requestUpdate(),await this.host.updateComplete,!r()))return;let a=this.host.querySelector(`[data-cron-run-transcript]`);a?.focus({preventScroll:!0}),a?.scrollIntoView({block:`start`,behavior:`instant`})}render(){return this.entry?y`<section
      class="card"
      role="region"
      tabindex="-1"
      aria-label=${g(`tasksPage.transcript`)}
      data-cron-run-transcript
    >
      <div class="row">
        <h2>${this.task?pt(this.task):g(`tasksPage.transcript`)}</h2>
        <button class="btn btn--sm" @click=${()=>this.close()}>${g(`common.close`)}</button>
      </div>
      ${this.error?y`<p role="alert">${this.error}</p>
              <button class="btn btn--sm" @click=${()=>this.entry&&void this.open(this.entry)}>
                ${g(`common.retry`)}
              </button>`:this.task?Rt({host:this.transcript,task:this.task}):y`<p role="status">${g(`tasksPage.loading`)}</p>`}
    </section>`:x}}})))()}function P(e){let t=e.tabs;return t?Ft({id:t.id,active:e.value,tabs:e.options.map(e=>({value:e.value,label:e.label,testId:e.testId})),ariaLabel:e.ariaLabel??``,panelId:t.panelId,className:`cron-tabs`,variant:t.variant,onSelect:e.onChange}):Ct({value:e.value,options:e.options,ariaLabel:e.ariaLabel,onChange:t=>e.onChange(t)})}function yn(){return(yn=e((()=>{Nt(),A()})))()}function F(e,t,n,r){return{id:e,emoji:t,nameKey:`cron.suggestions.ideas.${e}.name`,taglineKey:`cron.suggestions.ideas.${e}.tagline`,promptKey:`cron.suggestions.ideas.${e}.prompt`,scheduleKey:n,schedule:r}}function bn(e){return{name:g(e.nameKey),payloadText:g(e.promptKey),payloadKind:`agentTurn`,sessionTarget:`isolated`,wakeMode:`now`,deleteAfterRun:!1,enabled:!0,...e.schedule}}var I,L,xn,Sn,Cn;function wn(){return(wn=e((()=>{p(),I={scheduleKind:`cron`,cronExpr:`0 9 * * 1-5`},L={scheduleKind:`cron`,cronExpr:`0 8 * * *`},xn={scheduleKind:`cron`,cronExpr:`0 9 * * 1`},Sn={scheduleKind:`every`,everyAmount:`1`,everyUnit:`hours`},Cn=[F(`repoPulse`,`🐙`,`cron.suggestions.schedules.weekdayMornings`,I),F(`standupGhostwriter`,`👻`,`cron.suggestions.schedules.weekdayMornings`,I),F(`hackerNewsScout`,`🔭`,`cron.suggestions.schedules.everyMorning`,L),F(`dependencyRadar`,`🛰️`,`cron.suggestions.schedules.weekly`,xn),F(`watchdog`,`🦉`,`cron.suggestions.schedules.hourly`,Sn),F(`polyglotMinute`,`🗣️`,`cron.suggestions.schedules.everyMorning`,L)]})))()}function R(e,t){return y`
    <div class="cron-condition-activity__metric">
      <dt>${e}</dt>
      <dd>${t}</dd>
    </div>
  `}function Tn(e){let t=_(e.lastCheckedAtMs,{fallback:g(`cron.runs.notChecked`)}),n=_(e.lastFiredAtMs,{fallback:g(`cron.runs.neverFired`)});return y`
    <div class="cron-condition-activity" data-test-id="cron-condition-activity">
      <div class="cron-condition-activity__intro">
        <div class="settings-row__title">
          <span class="cron-condition-activity__icon" aria-hidden="true">${w(`gitBranch`)}</span>
          ${g(`cron.runs.conditionActivity`)}
        </div>
        <div class="settings-row__desc">${g(`cron.runs.conditionActivityHint`)}</div>
      </div>
      <dl class="cron-condition-activity__metrics">
        ${R(g(`cron.runs.checks`),String(e.checkCount))}
        ${R(g(`cron.runs.lastChecked`),t)}
        ${R(g(`cron.runs.lastFired`),n)}
      </dl>
    </div>
  `}function En(e){if(e.checkCount===0)return g(`cron.runs.emptyConditionUnchecked`);let t=e.checkCount===1?`cron.runs.emptyConditionHintOne`:`cron.runs.emptyConditionHint`;return g(t,{count:String(e.checkCount)})}function Dn(){return[{value:`ok`,label:g(`cron.runs.runStatusOk`)},{value:`error`,label:g(`cron.runs.runStatusError`)},{value:`skipped`,label:g(`cron.runs.runStatusSkipped`)}]}function On(){return[{value:`delivered`,label:g(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:g(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:g(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:g(`cron.runs.deliveryNotRequested`)}]}function kn(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function An(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function jn(e){let t=e.options.filter(t=>e.selected.includes(t.value)).map(e=>e.label),n=t.length>2?`${e.summary} (${new Intl.ListFormat(ee.getLocale(),{style:`long`,type:`conjunction`}).format(t)})`:e.summary;return y`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n===`${B}clear`){e.onClear();return}if(n?.startsWith(z)){t.preventDefault();let r=n.slice(7);e.onToggle(r,!e.selected.includes(r))}}}
      >
        <button
          slot="trigger"
          type="button"
          class="btn btn--sm cron-filter-dropdown__trigger ${e.selected.length>0?`active`:``}"
          title=${e.title}
          aria-label=${`${e.title} ${n}`}
        >
          <span>${e.summary}</span>
          ${w(`chevronDown`)}
        </button>
        ${e.options.map(t=>y`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${z}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `)}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${B}clear`}>
          ${g(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `}function Mn(e){let t=ue(),n=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),r=e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0,i=Dn(),a=On(),o=i.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),s=a.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),c=An(o,g(`cron.runs.allStatuses`)),l=An(s,g(`cron.runs.allDelivery`)),u=e.runsSortDir===`asc`?g(`cron.runs.oldestFirst`):g(`cron.runs.newestFirst`);return y`
    <div class="cron-runs" aria-busy=${String(e.runsState===`pending`)}>
      ${e.conditionActivity?Tn(e.conditionActivity):x}
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${w(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${g(`cron.runs.searchRuns`)}
            placeholder=${g(`cron.runs.searchPlaceholder`)}
            @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
          />
        </div>
        ${jn({id:`status`,title:g(`cron.runs.status`),summary:c,options:i,selected:e.runsStatuses,onToggle:(t,n)=>{let r=kn(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
        ${jn({id:`delivery`,title:g(`cron.runs.delivery`),summary:l,options:a,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=kn(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
        <div class="cron-filter-dropdown">
          <wa-dropdown
            class="cron-filter-dropdown__details"
            placement="bottom-start"
            @wa-select=${t=>{let n=t.detail.item.value;(n===`asc`||n===`desc`)&&e.onRunsFiltersChange({cronRunsSortDir:n})}}
          >
            <button
              slot="trigger"
              type="button"
              class="btn btn--sm cron-filter-dropdown__trigger cron-run-sort"
              aria-label=${`${g(`cron.jobs.sort`)} ${u}`}
            >
              <span>${u}</span>
              ${w(`chevronDown`)}
            </button>
            <wa-dropdown-item value="desc" aria-current=${String(e.runsSortDir===`desc`)}>
              ${g(`cron.runs.newestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`desc`?w(`check`):x}
              </span>
            </wa-dropdown-item>
            <wa-dropdown-item value="asc" aria-current=${String(e.runsSortDir===`asc`)}>
              ${g(`cron.runs.oldestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`asc`?w(`check`):x}
              </span>
            </wa-dropdown-item>
          </wa-dropdown>
        </div>
      </div>
      ${e.runsState===`failed`?y`<button class="btn btn--sm" @click=${e.onRefresh}>${g(`common.retry`)}</button>`:x}
      ${n.length===0?e.runsState===`pending`?y`<div
                class="cron-empty-state"
                role="status"
                aria-live="polite"
                data-test-id="cron-runs-loading"
              >
                ${g(`cron.list.loading`)}
              </div>`:e.runsState===`ready`?r?y`<div class="muted cron-runs__empty">${g(`cron.runs.noMatching`)}</div>`:y`
                    <div class="cron-empty-state">
                      <div class="cron-empty-state__title">
                        ${e.conditionActivity?g(`cron.runs.emptyConditionTitle`):g(`cron.runs.emptyTitle`)}
                      </div>
                      <div class="cron-empty-state__copy">
                        ${e.conditionActivity?En(e.conditionActivity):g(`cron.runs.emptyHint`)}
                      </div>
                    </div>
                  `:x:y`
              <div class="cron-runs__list">
                ${n.map(n=>In(n,t,e.highlightedRunId,e.onViewRunTranscript))}
              </div>
            `}
      ${e.runsHasMore?y`
              <button
                class="btn btn--sm cron-load-more"
                ?disabled=${e.runsLoadingMore}
                @click=${e.onLoadMoreRuns}
              >
                ${e.runsLoadingMore?g(`cron.list.loading`):g(`cron.runs.loadMore`)}
              </button>
            `:x}
    </div>
  `}function Nn(e,t=Date.now()){let n=_(e);return g(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function Pn(e,t){if(e===`ok`&&(t===`failed`||t===`unknown`)){let e=g(t===`failed`?`cron.runs.runStatusError`:`cron.runs.runStatusUnknown`);return`${g(`cron.runs.runStatusOk`)} · ${e}`}switch(e){case`ok`:return g(`cron.runs.runStatusOk`);case`error`:return g(`cron.runs.runStatusError`);case`skipped`:return g(`cron.runs.runStatusSkipped`);default:return g(`cron.runs.runStatusUnknown`)}}function Fn(e){switch(e){case`delivered`:return g(`cron.runs.deliveryDelivered`);case`not-delivered`:return g(`cron.runs.deliveryNotDelivered`);case`not-requested`:return g(`cron.runs.deliveryNotRequested`);default:return g(`cron.runs.deliveryUnknown`)}}function In(e,t,n,r){let i=Pn(e.status??`unknown`,e.completionStatus),a=Fn(e.deliveryStatus??`not-requested`),o=e.usage,s=o&&typeof o.total_tokens==`number`?`${v(o.total_tokens)} ${g(`usage.metrics.tokens`)}`:o&&typeof o.input_tokens==`number`&&typeof o.output_tokens==`number`?`${v(o.input_tokens)} in / ${v(o.output_tokens)} out`:null,c=e.summary||m(e.error)||g(`cron.runEntry.noSummary`),l=!!e.error&&!!e.summary,u=m(e.deliverySuppressionReason),d=[a,u?g(`cron.runEntry.deliverySuppression`,{reason:u}):null,e.model,e.provider,s].filter(Boolean),f=!!(n&&hn(n,e));return y`
    <div class="cron-run-entry ${f?`cron-run-entry--highlighted`:``}">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${i}</span>
          </div>
          <div class="cron-run-entry__facts muted">${d.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${t(e.ts)}</div>
          ${typeof e.runAtMs==`number`?y`<div class="muted">
                  ${g(`cron.runEntry.runAt`)} ${t(e.runAtMs)}
                </div>`:x}
          <div class="muted">
            ${typeof e.durationMs==`number`&&Number.isFinite(e.durationMs)?ut(e.durationMs)??_t(e.durationMs,g(`common.na`)):g(`common.na`)}
          </div>
          ${typeof e.nextRunAtMs==`number`?y`<div class="muted">${Nn(e.nextRunAtMs)}</div>`:x}
          ${e.sessionKey?y`<div>
                  <button class="btn btn--sm" @click=${()=>r?.(e)}>
                    ${g(`tasksPage.viewTranscript`)}
                  </button>
                </div>`:x}
          ${l?y`<div class="muted">${m(e.error)}</div>`:x}
          ${e.deliveryError?y`<div class="muted">${m(e.deliveryError)}</div>`:x}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${ge(Mt(c))}
      </div>
    </div>
  `}var z,B;function Ln(){return(Ln=e((()=>{S(),ve(),Se(),wt(),Tt(),p(),M(),nt(),h(),ie(),N(),j(),z=`option:`,B=`command:`})))()}function Rn(e){return[{value:`last`,label:`last`,kind:`neutral`},...c(e.channels.filter(Boolean)).map(t=>({value:t,label:e.channelMeta?.find(e=>e.id===t)?.label||e.channelLabels?.[t]||t}))]}function V(e,t){let n=c(a(t));return n.length===0?x:y`<datalist id=${e}>
        ${n.map(e=>y`<option value=${e}></option> `)}
      </datalist>`}function H(e){return`cron-error-${e}`}function U(e){return`cron-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function zn(e,t,n){return e===`payloadText`&&t.payloadKind===`systemEvent`?g(`cron.form.mainTimelineMessage`):g(e===`deliveryTo`&&n===`webhook`?`cron.form.webhookUrl`:yr[e])}function Bn(e,t,n){return Object.keys(yr).flatMap(r=>{let i=e[r];return i?[{key:r,label:zn(r,t,n),message:i,inputId:U(r)}]:[]})}function Vn(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:lt()}),t.focus())}function Hn(e,t){return e?y`<div id=${b(t)} class="cron-help cron-error">${g(e)}</div>`:x}function Un(e){return y`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${g(`cron.form.requiredSr`)}</span>
  `}function W(e){let t=e.wide?`cron-control cron-control--wide`:`cron-control`,n=y`<div class=${t}>
    ${e.control}${Hn(e.error,e.errorId)}
  </div>`;return y`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <label class="settings-row__text" for=${b(e.controlId||void 0)}>
        <span class="settings-row__title">
          ${e.required?Un(e.label):e.label}
        </span>
        ${e.help?y`<span class="settings-row__desc">${e.help}</span>`:x}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `}function G(e,t,n){let r=n.errorKey?e.fieldErrors[n.errorKey]:void 0,i=r&&n.errorKey&&n.describeError!==!1?H(n.errorKey):void 0;return y`
    <input
      id=${U(t)}
      class=${n.mono?`settings-input mono`:`settings-input`}
      type=${b(n.type)}
      aria-required=${b(n.required?`true`:void 0)}
      .value=${e.form[t]}
      list=${b(n.list)}
      ?disabled=${n.disabled??!1}
      aria-invalid=${b(n.errorKey?r?`true`:`false`:void 0)}
      aria-describedby=${b(i)}
      placeholder=${b(n.placeholder)}
      @input=${n=>e.onFormChange({[t]:n.currentTarget.value})}
    />
  `}function K(e,t,n){let r=n.errorKey;return W({label:n.label,controlId:U(t),required:n.required,help:n.help,error:r?e.fieldErrors[r]:void 0,errorId:r?H(r):void 0,control:G(e,t,n)})}function q(e,t,n){let r=n.value??e.form[t];return(n.channel?Wt:At)({id:n.standalone?void 0:U(t),label:n.label,value:n.channel?r||`last`:r,options:n.options,disabled:n.disabled,onChange:n=>e.onFormChange({[t]:n})})}function J(e,t,n){return W({label:n.label,controlId:U(t),help:n.help,control:q(e,t,n)})}function Y(e,t,n){return Pt({title:n.label,description:n.help,checked:e.form[t],onChange:n=>e.onFormChange({[t]:n})})}function Wn(e){let t=e.editingJob?`job`:e.createOpen?`create`:`overview`;return y`
    ${t===`overview`?Kn(e):ar(e,t)}
    ${V(`cron-agent-suggestions`,e.agentSuggestions)}
    ${V(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${V(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${V(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${V(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function Gn(e){return e.canManage?x:y`<div class="cron-admin-note" role="note">
        <span aria-hidden="true">${w(`lock`)}</span>
        <span>${g(`cron.adminRequired`)}</span>
      </div>`}function Kn(e){let t=e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsTriggerFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,n=t||e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`,r=!e.loading&&e.hasLoaded&&!e.listError&&!e.error&&e.jobsTotal===0&&!n&&e.canManage,i=[y`
      <div class="cron-overview-header">
        ${Gn(e)}
        ${e.status&&!e.status.enabled?y`
                <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
                  <strong>${g(`cron.list.schedulerOff`)}</strong>
                  ${g(`cron.runNotStarted.stopped`)}
                </div>
              `:x}
        ${e.listError?y`<div class="cron-error-banner" role="alert">${e.listError}</div>`:x}
        ${e.error?y`<div class="cron-error-banner" role="alert">${e.error}</div>`:x}
        ${Jn(e,t)}
      </div>
    `,y`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab===`activity`?`activity`:e.jobsEnabledFilter}`}
      >
        ${e.listTab===`activity`?k({},y`<div class="cron-activity">${Mn(e)}</div>`):[k({},Xn(e,n)),r?ir(e):x]}
      </div>
    `];return y`
    <section class="cron-page" data-panel-mode="overview">
      ${Et(i,{wide:!0})}
    </section>
  `}function qn(e){return P({value:e.listTab===`activity`?`activity`:e.jobsEnabledFilter,options:[...br.map(e=>({value:e.value,label:g(e.labelKey),testId:`cron-tab-${e.value}`})),{value:`activity`,label:g(`cron.list.activityTab`),testId:`cron-list-tab-activity`}],ariaLabel:g(`cron.list.viewLabel`),tabs:{id:`cron-list`,panelId:`cron-list-panel`},onChange:t=>{if(t===`activity`){e.onListTabChange(`activity`);return}e.onListTabChange(`tasks`),t!==e.jobsEnabledFilter&&e.onJobsFiltersChange({cronJobsEnabledFilter:t})}})}function Jn(e,t){return y`
    <div class="cron-toolbar">
      ${e.listTab===`tasks`?y`
              <div class="cron-toolbar__filters">
                <div class="cron-search-box">
                  <span class="cron-search-box__icon" aria-hidden="true">${w(`search`)}</span>
                  <input
                    type="search"
                    class="settings-input"
                    .value=${e.jobsQuery}
                    aria-label=${g(`cron.list.searchPlaceholder`)}
                    placeholder=${g(`cron.list.searchPlaceholder`)}
                    @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
                  />
                </div>
                ${Yn(e,t)}
              </div>
            `:x}
      <div class="cron-toolbar__primary">
        ${qn(e)}
        <div class="cron-toolbar__actions">
          <button
            type="button"
            class="btn btn--sm btn--ghost cron-refresh ${e.loading?`cron-refresh--loading`:``}"
            ?disabled=${e.loading}
            title=${e.loading?g(`cron.list.refreshing`):g(`cron.list.refresh`)}
            aria-label=${g(`cron.list.refresh`)}
            @click=${e.onRefresh}
          >
            ${w(`refresh`)}
          </button>
          ${e.canManage?y`
                  <button
                    type="button"
                    class="btn primary btn--sm cron-new-task"
                    data-test-id="cron-new-task"
                    @click=${()=>e.onOpenCreate()}
                  >
                    ${w(`plus`)} ${g(`cron.list.newTask`)}
                  </button>
                `:x}
        </div>
      </div>
    </div>
  `}function X(e,t,n){return y`
    <label class="field">
      <span>${n.label}</span>
      <select
        class="settings-select"
        data-test-id=${b(n.testId)}
        .value=${n.value}
        @change=${n=>e.onJobsFiltersChange({[t]:n.currentTarget.value})}
      >
        ${n.options.map(({value:e,label:t})=>y`<option value=${e} ?selected=${e===n.value}>${t}</option>`)}
      </select>
    </label>
  `}function Yn(e,t){return y`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t?`active`:``}"
      title=${g(`cron.list.filters`)}
      aria-label=${g(`cron.list.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${w(`listFilter`)}
    </button>
    <wa-popover
      class="cron-filter-popover"
      for="cron-jobs-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`true`)}}
      @wa-hide=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`false`)}}
    >
      <div class="cron-filter-popover__panel">
        ${X(e,`cronJobsScheduleKindFilter`,{label:g(`cron.jobs.schedule`),value:e.jobsScheduleKindFilter,testId:`cron-jobs-schedule-filter`,options:Object.entries(xr).map(([e,t])=>({value:e,label:g(t)}))})}
        ${X(e,`cronJobsLastStatusFilter`,{label:g(`cron.jobs.lastRun`),value:e.jobsLastStatusFilter,testId:`cron-jobs-last-status-filter`,options:[{value:`all`,label:g(`cron.jobs.all`)},{value:`ok`,label:g(`cron.runs.runStatusOk`)},{value:`error`,label:g(`cron.runs.runStatusError`)},{value:`skipped`,label:g(`cron.runs.runStatusSkipped`)},{value:`unknown`,label:g(`cron.runs.runStatusUnknown`)}]})}
        ${X(e,`cronJobsTriggerFilter`,{label:g(`cron.jobs.condition`),value:e.jobsTriggerFilter,testId:`cron-jobs-trigger-filter`,options:[{value:`all`,label:g(`cron.jobs.all`)},{value:`conditional`,label:g(`cron.jobs.conditional`)},{value:`unconditional`,label:g(`cron.jobs.unconditional`)}]})}
        ${X(e,`cronJobsSortBy`,{label:g(`cron.jobs.sort`),value:e.jobsSortBy,options:[{value:`nextRunAtMs`,label:g(`cron.jobs.nextRun`)},{value:`updatedAtMs`,label:g(`cron.jobs.recentlyUpdated`)},{value:`name`,label:g(`cron.jobs.name`)}]})}
        ${X(e,`cronJobsSortDir`,{label:g(`cron.jobs.direction`),value:e.jobsSortDir,options:[{value:`asc`,label:g(`cron.jobs.ascending`)},{value:`desc`,label:g(`cron.jobs.descending`)}]})}
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${g(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `}function Xn(e,t){let n=e.loading&&!e.hasLoaded,r=e.loading||e.jobsLoadingMore,i=e.jobs.toSorted((e,t)=>Number(T(t))-Number(T(e)));return y`
    <div
      class="cron-table ${e.canManage?``:`cron-table--read-only`}"
      aria-busy=${r?`true`:x}
    >
      <div class="cron-table__head">
        <span>${g(`cron.jobs.name`)}</span>
        <span>${g(`cron.jobs.schedule`)}</span>
        <span>${g(`cron.jobs.nextRun`)}</span>
        <span>${g(`cron.jobs.lastRun`)}</span>
        ${e.canManage?y`<span aria-hidden="true"></span>`:x}
      </div>
      ${i.length===0?n?y`
                <div
                  class="cron-empty-state"
                  role="status"
                  aria-live="polite"
                  data-test-id="cron-jobs-loading"
                >
                  <div class="cron-empty-state__title">${g(`cron.list.loading`)}</div>
                </div>
              `:e.hasLoaded?y`
                  <div class="cron-empty-state">
                    <div class="cron-empty-state__title">
                      ${g(t?`cron.list.noMatching`:`cron.list.emptyTitle`)}
                    </div>
                    ${t?x:y`<div class="cron-empty-state__copy">
                            ${g(`cron.list.emptyHint`)}
                          </div>`}
                  </div>
                `:x:me(i,e=>e.id,t=>Zn(t,e))}
      ${Qt({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMoreJobs})}
    </div>
  `}function Z(e){return Me(e?.declarationKey)}function Zn(e,t){let n=e.displayName??e.name,r=e.description?.trim(),i=Z(e),a=e.state?.nextRunAtMs,o=typeof a==`number`&&Number.isFinite(a),s=Ie(e)?y`<span class="cron-table__running">${g(`cron.runs.runStatusRunning`)}</span>`:o?_(a):g(`common.na`);return y`
    <div
      class="cron-table__row ${e.enabled?``:`cron-table__row--paused`}"
      data-test-id=${`cron-row-${e.id}`}
      @click=${()=>t.onSelectJob(e)}
    >
      <button type="button" class="cron-table__name">
        ${Qn(e)}
        <span class="cron-table__name-copy">
          <span class="cron-table__name-line">
            <span class="cron-table__name-text">${n}</span>
            ${e.trigger?$n():x}
          </span>
          ${i?x:Jt(e.agentId)}
          ${r||!e.enabled?y`
                  <span class="cron-table__name-meta">
                    ${r?y`
                            <span
                              class="cron-table__description"
                              data-test-id=${`cron-row-description-${e.id}`}
                              title=${`${g(`cron.form.description`)}: ${r}`}
                              >${r}</span
                            >
                          `:x}
                    ${r&&!e.enabled?y`<span class="cron-table__meta-separator" aria-hidden="true">·</span>`:x}
                    ${e.enabled?x:er(e)}
                  </span>
                `:x}
        </span>
      </button>
      ${Q(`cron-table__schedule`,g(`cron.jobs.schedule`),en(e))}
      ${Q(`cron-table__next`,g(`cron.jobs.nextRun`),s)}
      ${Q(`cron-table__last`,g(`cron.jobs.lastRun`),nr(e))}
      ${t.canManage?y`
              <span class="cron-table__actions" @click=${e=>e.stopPropagation()}>
                <button
                  type="button"
                  class="btn btn--sm btn--ghost cron-row-run"
                  data-test-id=${`cron-row-run-${e.id}`}
                  title=${g(`cron.actions.runNowJob`,{name:n})}
                  aria-label=${g(`cron.actions.runNowJob`,{name:n})}
                  ?disabled=${t.busy}
                  @click=${()=>t.onRun(e,`force`)}
                >
                  ${w(`play`)}
                </button>
                ${i?x:sr(t,e,{compact:!0,testId:`cron-row-toggle-${e.id}`})}
                ${rr(t,e)}
              </span>
            `:x}
    </div>
  `}function Q(e,t,n){return y`<span class="cron-table__cell ${e}">
    <span class="cron-table__cell-label">${t}</span>
    <span class="cron-table__cell-value">${n}</span>
  </span>`}function Qn(e){let t=e.state?.autoDisabled,n=Ie(e)?{className:`cron-table__state--running`,iconName:`loader`,label:g(`cron.runs.runStatusRunning`)}:t?{className:`cron-table__state--error`,iconName:`lock`,label:tr(e)}:T(e)?{className:`cron-table__state--error`,iconName:`alertTriangle`,label:g(`cron.runs.runStatusError`)}:e.enabled?{className:`cron-table__state--active`,iconName:null,label:g(`cron.detail.active`)}:{className:`cron-table__state--paused`,iconName:`pause`,label:g(`cron.list.paused`)};return y`<span
    class="cron-table__state ${n.className}"
    role="img"
    aria-label=${n.label}
    title=${n.label}
    >${n.iconName?w(n.iconName):y`<span class="cron-table__state-dot"></span>`}</span
  >`}function $n(){let e=g(`cron.form.triggerConfigured`);return y`<span class="cron-trigger-icon" role="img" aria-label=${e} title=${e}
    >${w(`gitBranch`)}</span
  >`}function er(e){if(!e.state?.autoDisabled)return y`<span class="muted cron-table__paused-note">${g(`cron.list.paused`)}</span>`;let t=tr(e),n=e.state?.lastError?.trim();return y`<span
    class="cron-table__paused-note cron-table__auto-disabled"
    data-test-id=${`cron-row-auto-disabled-${e.id}`}
    title=${n?m(n):t}
    >${t}</span
  >`}function tr(e){let t=e.state?.autoDisabled;return t?g(t.reason===`schedule-errors`?`cron.list.autoDisabledScheduleErrors`:`cron.list.autoDisabledRunFailures`,{count:String(t.consecutiveErrors)}):g(`cron.list.paused`)}function nr(e){let t=Ge(e),n=e.state?.lastRunAtMs,r=typeof n==`number`&&Number.isFinite(n)?_(n):null;if(t===`unknown`||!r)return y`<span class="muted">${g(`common.na`)}</span>`;let i=t===`ok`?y`<span class="cron-last-glyph cron-last-glyph--ok">${w(`check`)}</span>`:t===`error`?y`<span class="cron-last-glyph cron-last-glyph--error">${w(`x`)}</span>`:y`<span class="cron-last-glyph">${w(`cornerDownRight`)}</span>`,a=Pn(t);return y`
    <span class="cron-table__last-run" role="img" aria-label=${a} title=${a}>
      ${i}
      <span class="cron-table__last-time">${r}</span>
    </span>
  `}function rr(e,t){if(!e.canManage)return x;let n=Z(t),r=t.displayName??t.name;return y`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${r=>{if(e.canManage)switch(r.detail.item.value){case`run-if-due`:e.onRun(t,`due`);break;case`clone`:n||e.onClone(t);break;case`remove`:n||e.onRemove(t);break;case void 0:}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${g(`cron.actions.moreJob`,{name:r})}
        title=${g(`cron.actions.moreJob`,{name:r})}
      >
        ${w(`moreHorizontal`)}
      </button>
      ${ur(e,`run-if-due`,g(`cron.actions.runIfDue`))}
      ${n?x:ur(e,`clone`,g(`cron.actions.clone`))}
      ${n?x:ur(e,`remove`,g(`cron.actions.remove`),{danger:!0})}
    </wa-dropdown>
  `}function ir(e){return k({title:g(`cron.suggestions.title`)},Cn.map(t=>y`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${()=>e.onOpenCreate(bn(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${g(t.nameKey)}
            </span>
            <span class="settings-row__desc">${g(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${g(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${xe.chevronRight}</span>
          </div>
        </button>
      `))}function ar(e,t){let n=t===`job`?e.editingJob??void 0:void 0,r=t===`job`&&!!n,i=t===`job`&&e.detailTab===`history`,a=n?.trigger?{checkCount:n.state?.triggerEvalCount??0,lastCheckedAtMs:n.state?.lastTriggerEvalAtMs,lastFiredAtMs:n.state?.lastTriggerFireAtMs}:void 0,o=[y`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${w(`arrowLeft`)} ${g(`cron.detail.back`)}
        </button>
      </div>
    `,or(e,t,n),Gn(e),r?cr(e):x,e.error?y`<div class="cron-error-banner">${e.error}</div>`:x,y`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r?`tabpanel`:x}
        aria-labelledby=${r?`cron-detail-tab-${e.detailTab}`:x}
      >
        ${i?k({title:g(`cron.detail.historyTitle`)},y`<div class="cron-history">
                  ${Mn({...e,conditionActivity:a})}
                </div>`):lr(e,t)}
      </div>
    `];return y`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${Et(o,{wide:!0})}
    </section>
  `}function or(e,t,n){let r=t===`job`?n?.displayName??n?.name??e.form.name:g(`cron.detail.newTitle`),i=t===`job`?n?.description?.trim():void 0,a=Z(n),o=n?.state?.nextRunAtMs,s=typeof o==`number`&&Number.isFinite(o)?` · ${g(`cron.jobState.next`)} ${_(o)}`:``,c=t===`job`&&n?`${en(n)}${s}`:g(`cron.detail.newSubtitle`);return y`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${r}</div>
        ${i?y`<div class="cron-detail-description" data-test-id="cron-detail-description">
                <span class="cron-detail-description__label">${g(`cron.form.description`)}:</span>
                ${i}
              </div>`:x}
        <div class="cron-detail-meta">
          ${t===`job`&&n&&e.canManage&&!a?sr(e,n):x}
          <span class="cron-detail-sub">${c}</span>
          ${n?.trigger?$n():x}
        </div>
      </div>
      <div class="cron-detail-actions">
        ${t===`job`&&n&&e.canManage?y`
                <button
                  type="button"
                  class="btn btn--sm"
                  data-test-id="cron-run-now"
                  ?disabled=${e.busy}
                  @click=${()=>e.onRun(n,`force`)}
                >
                  ${w(`play`)} ${g(`cron.actions.runNow`)}
                </button>
                ${rr(e,n)}
              `:x}
      </div>
    </div>
  `}function sr(e,t,n){let r=t.enabled?g(`cron.detail.active`):g(`cron.detail.paused`),i=g(t.enabled?`cron.actions.pauseJob`:`cron.actions.resumeJob`,{name:t.displayName??t.name});return y`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId??`cron-toggle-enabled`}
      title=${n?.compact?i:x}
    >
      ${yt({checked:t.enabled,disabled:e.busy||!e.canManage,ariaLabel:n?.compact?i:r,onChange:n=>{e.canManage&&e.onToggle(t,n)}})}
      ${n?.compact?x:y`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `}function cr(e){return P({value:e.detailTab,options:[{value:`settings`,label:g(`cron.detail.settingsTab`),testId:`cron-detail-tab-settings`},{value:`history`,label:g(`cron.detail.historyTitle`),testId:`cron-detail-tab-history`}],ariaLabel:g(`cron.detail.tabsLabel`),tabs:{id:`cron-detail`,panelId:`cron-detail-panel`,variant:`sub`},onChange:e.onDetailTabChange})}function lr(e,t){let n=e.form.payloadLocked,r=t===`job`&&Z(e.editingJob),i=!n&&e.form.payloadKind===`agentTurn`,a=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),o=e.form.deliveryMode===`announce`&&!a?`none`:e.form.deliveryMode,s=Bn(e.fieldErrors,e.form,o),c=e.canManage&&!e.busy&&s.length>0,l=c&&!e.canSubmit?s.length===1?g(`cron.form.fixFields`,{count:String(s.length)}):g(`cron.form.fixFieldsPlural`,{count:String(s.length)}):``;return y`
    <fieldset
      class="cron-editor"
      ?disabled=${e.busy||!e.canManage||r}
      aria-busy=${String(e.busy)}
    >
      ${dr(e,{payloadLocked:n,isAgentTurn:i})} ${fr(e)}
      ${mr(e)}
      ${hr(e,{supportsAnnounce:a,selectedDeliveryMode:o})}
      ${gr(e,{mode:t,isAgentTurn:i,selectedDeliveryMode:o})}
      ${c?y`
              <div class="cron-form-status" role="status" aria-live="polite">
                <div class="cron-form-status__title">${g(`cron.form.cantAddYet`)}</div>
                <div class="cron-help">${g(`cron.form.fillRequired`)}</div>
                <ul class="cron-form-status__list">
                  ${s.map(e=>y`
                      <li>
                        <button
                          type="button"
                          class="cron-form-status__link"
                          @click=${()=>Vn(e.inputId)}
                        >
                          ${e.label}: ${g(e.message)}
                        </button>
                      </li>
                    `)}
                </ul>
              </div>
            `:x}
      ${e.canManage&&!r?y`
              <div class="cron-editor-actions">
                <button
                  class="btn primary"
                  data-test-id="cron-submit"
                  ?disabled=${e.busy||!e.canSubmit}
                  @click=${e.onSubmit}
                >
                  ${e.busy?g(`cron.form.saving`):g(t===`job`?`cron.form.saveChanges`:`cron.form.createTask`)}
                </button>
                ${t===`create`?y`
                        <button
                          class="btn"
                          data-test-id="cron-submit-run"
                          ?disabled=${e.busy||!e.canSubmit}
                          @click=${e.onSubmitRunNow}
                        >
                          ${g(`cron.form.createAndRun`)}
                        </button>
                      `:x}
                <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
                  ${g(`cron.form.cancel`)}
                </button>
                ${l?y`<div class="cron-submit-reason" aria-live="polite">
                        ${l}
                      </div>`:x}
              </div>
            `:x}
    </fieldset>
  `}function ur(e,t,n,r){return y`
    <wa-dropdown-item
      class=${r?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      value=${t}
      variant=${r?.danger?`danger`:`default`}
      ?disabled=${e.busy||!e.canManage}
    >
      ${n}
    </wa-dropdown-item>
  `}function dr(e,t){let n=e.form.payloadKind===`script`?g(`cron.form.script`):e.form.payloadKind===`heartbeat`?`Heartbeat monitor`:e.form.payloadKind===`agentTurn`?g(`cron.form.assistantTaskPrompt`):g(`cron.form.command`),r=t.payloadLocked?n:e.form.payloadKind===`systemEvent`?g(`cron.form.mainTimelineMessage`):g(`cron.form.assistantTaskPrompt`),i=t.payloadLocked?g(`cron.form.readOnlyPayloadHelp`):e.form.payloadKind===`systemEvent`?g(`cron.form.systemEventHelp`):g(`cron.form.agentTurnHelp`),a=t.payloadLocked?Sr[e.form.payloadKind]:``,o=e.form.payloadKind===`heartbeat`?e.heartbeatScratch:e.form.payloadText,s=W({label:r,controlId:a?``:`cron-payload-text`,required:!0,help:i,stacked:!0,wide:!0,error:e.fieldErrors.payloadText,errorId:H(`payloadText`),control:a?y`
          <pre
            id="cron-payload-text"
            class="code-block cron-payload-code"
            data-test-id="cron-payload-code"
            tabindex="0"
            aria-label=${r}
          ><code class="hljs">${ge(bt(o,a))}</code></pre>
        `:y`
          <textarea
            id="cron-payload-text"
            class="settings-input"
            rows="6"
            .value=${o}
            ?readonly=${t.payloadLocked}
            aria-required="true"
            placeholder=${g(`cron.form.promptPlaceholder`)}
            aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
            aria-describedby=${b(e.fieldErrors.payloadText?H(`payloadText`):void 0)}
            @input=${t=>e.onFormChange({payloadText:t.target.value})}
          ></textarea>
        `}),l=g(`cron.form.action`),u=t.payloadLocked?W({label:l,controlId:U(`payloadKind`),control:y`
          <input
            id=${U(`payloadKind`)}
            class="settings-input"
            .value=${n}
            readonly
          />
        `}):J(e,`payloadKind`,{label:l,options:[{value:`systemEvent`,label:g(`cron.form.systemEvent`)},{value:`agentTurn`,label:g(`cron.form.agentTurn`)}]}),d=g(`cron.form.model`),f=e.fieldErrors.payloadModel,p=c(e.modelSuggestions).map(e=>({value:e,label:e,provider:St(e)??void 0})),m=t.isAgentTurn?y`
        ${W({label:d,controlId:``,help:g(`cron.form.modelHelp`),error:f,errorId:H(`payloadModel`),control:Xt({id:`cron-payload-model-picker`,label:d,value:e.form.payloadModel,options:[{value:``,label:g(`quickSettings.model.default`)},...p],custom:{id:U(`payloadModel`),label:g(`cron.form.customModel`),placeholder:g(`cron.form.modelPlaceholder`),invalid:!!f,describedBy:f?H(`payloadModel`):void 0},onChange:t=>e.onFormChange({payloadModel:t})})})}
        ${K(e,`payloadThinking`,{label:g(`cron.form.thinking`),help:g(`cron.form.thinkingHelp`),errorKey:`payloadThinking`,describeError:!1,list:`cron-thinking-suggestions`,placeholder:g(`cron.form.thinkingPlaceholder`)})}
      `:x;return k({},y`${s}${u}${m}`)}function fr(e){let t=e.form.sessionTarget,n=t===`main`||t===`isolated`;return k({title:g(`cron.detail.generalSection`)},y`
      ${K(e,`name`,{label:g(`cron.form.fieldName`),required:!0,errorKey:`name`,placeholder:g(`cron.form.namePlaceholder`)})}
      ${K(e,`agentId`,{label:g(`cron.form.agentId`),help:g(`cron.form.agentHelp`),list:`cron-agent-suggestions`,disabled:e.form.clearAgent,placeholder:g(`cron.form.agentPlaceholder`)})}
      ${J(e,`sessionTarget`,{label:g(`cron.form.runsIn`),help:g(`cron.form.sessionHelp`),options:[{value:`main`,label:g(`cron.form.mainSession`)},{value:`isolated`,label:g(`cron.form.isolatedSession`)},...n?[]:[{value:t,label:t}]]})}
    `)}function pr(e){if(e.scheduleKind===`every`){let t=e.everyAmount.trim();if(at(t,e.everyUnit)===void 0)return null;if(Number(t)===1){let t=e.everyUnit===`seconds`?`cron.form.summaryEverySecondOne`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinuteOne`:e.everyUnit===`hours`?`cron.form.summaryEveryHourOne`:`cron.form.summaryEveryDayOne`;return g(t)}let n=e.everyUnit===`seconds`?`cron.form.summaryEverySeconds`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinutes`:e.everyUnit===`hours`?`cron.form.summaryEveryHours`:`cron.form.summaryEveryDays`;return g(n,{amount:t})}if(e.scheduleKind===`at`){let t=Date.parse(e.scheduleAt);return Number.isFinite(t)?g(`cron.form.summaryOnce`,{at:oe(t)}):null}if(e.scheduleKind===`cron`){let t=e.cronExpr.trim();if(!t)return null;let n=e.cronTz.trim();return n?g(`cron.form.summaryCronTz`,{expr:t,tz:n}):g(`cron.form.summaryCron`,{expr:t})}return e.scheduleKind===`on-exit`?g(`cron.form.repeatOnExit`):e.scheduleKind===`stream`?g(`cron.form.repeatStream`):null}function mr(e){let t=e.form,n=t.scheduleKind===`on-exit`,r=t.scheduleKind===`stream`,i=n?{value:`on-exit`,label:g(`cron.form.repeatOnExit`)}:r?{value:`stream`,label:g(`cron.form.repeatStream`)}:null,a=[...i?[{...i,testId:`cron-schedule-kind-${i.value}`}]:[],{value:`every`,label:g(`cron.form.repeatInterval`),testId:`cron-schedule-kind-every`},{value:`at`,label:g(`cron.form.repeatOnce`),testId:`cron-schedule-kind-at`},{value:`cron`,label:g(`cron.form.cronOption`),testId:`cron-schedule-kind-cron`}],o=pr(t);return k({title:g(`cron.detail.scheduleSection`)},y`
      ${Lt({title:g(`cron.form.repeat`),description:n?g(`cron.form.onExitHelp`):void 0,stacked:!0,control:P({value:t.scheduleKind,options:a,ariaLabel:g(`cron.form.repeat`),onChange:n=>e.onFormChange({scheduleKind:n,...n===`at`&&(t.scheduleKind===`every`||t.scheduleKind===`cron`)?{deleteAfterRun:!0}:n===`every`||n===`cron`?{deleteAfterRun:!1}:{}})})})}
      ${t.scheduleKind===`at`?K(e,`scheduleAt`,{label:g(`cron.form.runAt`),required:!0,errorKey:`scheduleAt`,type:`datetime-local`}):x}
      ${t.scheduleKind===`every`?W({label:g(`cron.form.every`),controlId:`cron-every-amount`,required:!0,error:e.fieldErrors.everyAmount,errorId:H(`everyAmount`),control:y`
                <div class="cron-inline-controls">
                  ${G(e,`everyAmount`,{label:g(`cron.form.every`),required:!0,errorKey:`everyAmount`,placeholder:g(`cron.form.everyAmountPlaceholder`)})}
                  ${q(e,`everyUnit`,{label:g(`cron.form.unit`),standalone:!0,options:[{value:`seconds`,label:g(`cron.form.seconds`)},{value:`minutes`,label:g(`cron.form.minutes`)},{value:`hours`,label:g(`cron.form.hours`)},{value:`days`,label:g(`cron.form.days`)}]})}
                </div>
              `}):x}
      ${t.scheduleKind===`cron`?y`
              ${K(e,`cronExpr`,{label:g(`cron.form.expression`),required:!0,errorKey:`cronExpr`,mono:!0,placeholder:g(`cron.form.expressionPlaceholder`)})}
              ${K(e,`cronTz`,{label:g(`cron.form.timezoneOptional`),help:g(`cron.form.timezoneHelp`),list:`cron-tz-suggestions`,placeholder:g(`cron.form.timezonePlaceholder`)})}
            `:x}
      ${o?y` <div class="cron-schedule-summary">${w(`clock`)}<span>${o}</span></div> `:x}
    `)}function hr(e,t){let n=Rn(e);return k({title:g(`cron.detail.deliverySection`)},y`
      ${J(e,`deliveryMode`,{label:g(`cron.form.deliveryModeLabel`),help:g(`cron.form.deliveryHelp`),value:t.selectedDeliveryMode,options:[...t.supportsAnnounce?[{value:`announce`,label:g(`cron.form.announceDefault`)}]:[],{value:`webhook`,label:g(`cron.form.webhookPost`)},{value:`none`,label:g(`cron.form.noneInternal`)}]})}
      ${t.selectedDeliveryMode===`announce`?y`
              ${J(e,`deliveryChannel`,{label:g(`cron.form.channel`),help:g(`cron.form.channelHelp`),value:e.form.deliveryChannel||`last`,options:n,channel:!0})}
              ${K(e,`deliveryTo`,{label:g(`cron.form.to`),help:g(`cron.form.toHelp`),list:`cron-delivery-to-suggestions`,placeholder:g(`cron.form.toPlaceholder`)})}
            `:x}
      ${t.selectedDeliveryMode===`webhook`?K(e,`deliveryTo`,{label:g(`cron.form.webhookUrl`),required:!0,help:g(`cron.form.webhookHelp`),errorKey:`deliveryTo`,list:`cron-delivery-to-suggestions`,placeholder:g(`cron.form.webhookPlaceholder`)}):x}
    `)}function gr(e,t){let n=e.form.scheduleKind===`cron`,r=Rn(e);return y`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${g(`cron.form.advanced`)}
          ${e.form.triggerEnabled?y`<span class="cron-trigger-summary">
                  ${w(`gitBranch`)} ${g(`cron.form.triggerConfigured`)}
                </span>`:x}
        </summary>
        <p class="settings-section__desc">${g(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${_r(e)}
          ${K(e,`description`,{label:g(`cron.form.description`),placeholder:g(`cron.form.descriptionPlaceholder`)})}
          ${t.mode===`create`?Y(e,`enabled`,{label:g(`cron.form.startEnabled`)}):x}
          ${J(e,`wakeMode`,{label:g(`cron.form.wakeMode`),help:g(`cron.form.wakeModeHelp`),options:[{value:`now`,label:g(`cron.form.now`)},{value:`next-heartbeat`,label:g(`cron.form.nextHeartbeat`)}]})}
          ${t.isAgentTurn?K(e,`timeoutSeconds`,{label:g(`cron.form.timeoutSeconds`),help:g(`cron.form.timeoutHelp`),errorKey:`timeoutSeconds`,placeholder:g(`cron.form.timeoutPlaceholder`)}):x}
          ${e.form.scheduleKind===`at`||e.form.scheduleKind===`on-exit`?Y(e,`deleteAfterRun`,{label:g(`cron.form.deleteAfterRun`),help:g(`cron.form.deleteAfterRunHelp`)}):x}
          ${Y(e,`clearAgent`,{label:g(`cron.form.clearAgentOverride`),help:g(`cron.form.clearAgentHelp`)})}
          ${W({label:g(`cron.form.sessionKey`),controlId:`cron-session-key`,help:g(`cron.form.sessionKeyHelp`),control:y`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${t=>e.onFormChange({sessionKey:t.target.value})}
              />
            `})}
          ${n?y`
                  ${Y(e,`scheduleExact`,{label:g(`cron.form.exactTiming`),help:g(`cron.form.exactTimingHelp`)})}
                  ${W({label:g(`cron.form.staggerWindow`),controlId:`cron-stagger-amount`,error:e.fieldErrors.staggerAmount,errorId:H(`staggerAmount`),control:y`
                      <div class="cron-inline-controls">
                        ${G(e,`staggerAmount`,{label:g(`cron.form.staggerWindow`),disabled:e.form.scheduleExact,errorKey:`staggerAmount`,placeholder:g(`cron.form.staggerPlaceholder`)})}
                        ${q(e,`staggerUnit`,{label:g(`cron.form.staggerUnit`),standalone:!0,disabled:e.form.scheduleExact,options:[{value:`seconds`,label:g(`cron.form.seconds`)},{value:`minutes`,label:g(`cron.form.minutes`)}]})}
                      </div>
                    `})}
                `:x}
          ${t.isAgentTurn?y`
                  ${W({label:g(`cron.form.accountId`),controlId:`cron-delivery-account-id`,help:g(`cron.form.accountIdHelp`),control:y`
                      <input
                        id="cron-delivery-account-id"
                        class="settings-input"
                        .value=${e.form.deliveryAccountId}
                        list="cron-delivery-account-suggestions"
                        ?disabled=${t.selectedDeliveryMode!==`announce`}
                        placeholder="default"
                        @input=${t=>e.onFormChange({deliveryAccountId:t.target.value})}
                      />
                    `})}
                  ${Y(e,`payloadLightContext`,{label:g(`cron.form.lightContext`),help:g(`cron.form.lightContextHelp`)})}
                  ${vr(e,r)}
                `:x}
          ${t.selectedDeliveryMode===`none`?x:Y(e,`deliveryBestEffort`,{label:g(`cron.form.bestEffortDelivery`),help:g(`cron.form.bestEffortHelp`)})}
        </div>
      </details>
    </section>
  `}function _r(e){let t=e.form.payloadKind===`script`;return!t&&e.status===null?x:e.status?.triggersEnabled!==!0||t?Lt({title:g(`cron.form.conditionTrigger`),description:t?g(`cron.errors.triggerScriptPayloadUnsupported`):e.form.triggerEnabled?g(`cron.form.triggerDisabledConfigured`):g(`cron.form.triggerDisabled`),control:e.form.triggerEnabled?y`<button
            type="button"
            class="btn btn--sm"
            @click=${()=>e.onFormChange({triggerEnabled:!1})}
          >
            ${g(`cron.form.clearTrigger`)}
          </button>`:x}):y`
    ${Y(e,`triggerEnabled`,{label:g(`cron.form.conditionTrigger`),help:g(`cron.form.conditionTriggerHelp`)})}
    ${e.form.triggerEnabled?y`
            ${W({label:g(`cron.form.triggerScript`),controlId:`cron-trigger-script`,required:!0,help:g(`cron.form.triggerScriptHelp`),error:e.fieldErrors.triggerScript,errorId:H(`triggerScript`),stacked:!0,wide:!0,control:y`<textarea
                id="cron-trigger-script"
                class="settings-input cron-trigger-script mono"
                rows="8"
                spellcheck="false"
                aria-invalid=${e.fieldErrors.triggerScript?`true`:`false`}
                aria-describedby=${b(e.fieldErrors.triggerScript?H(`triggerScript`):void 0)}
                .value=${e.form.triggerScript}
                @input=${t=>{let n=t.currentTarget;n instanceof HTMLTextAreaElement&&e.onFormChange({triggerScript:n.value})}}
              ></textarea>`})}
            ${Y(e,`triggerOnce`,{label:g(`cron.form.triggerOnce`),help:g(`cron.form.triggerOnceHelp`)})}
          `:x}
  `}function vr(e,t){return y`
    ${J(e,`failureAlertMode`,{label:g(`cron.form.failureAlerts`),help:g(`cron.form.failureAlertsHelp`),options:[{value:`inherit`,label:g(`cron.form.failureAlertInherit`)},{value:`disabled`,label:g(`cron.form.failureAlertDisabled`)},{value:`custom`,label:g(`cron.form.failureAlertCustom`)}]})}
    ${e.form.failureAlertMode===`custom`?y`
            ${K(e,`failureAlertAfter`,{label:g(`cron.form.failureAlertAfter`),help:g(`cron.form.failureAlertAfterHelp`),errorKey:`failureAlertAfter`,placeholder:g(`cron.form.failureAlertInherit`)})}
            ${K(e,`failureAlertCooldownSeconds`,{label:g(`cron.form.failureAlertCooldown`),help:g(`cron.form.failureAlertCooldownHelp`),errorKey:`failureAlertCooldownSeconds`,placeholder:g(`cron.form.failureAlertInherit`)})}
            ${J(e,`failureAlertChannel`,{label:g(`cron.form.failureAlertChannel`),value:e.form.failureAlertChannel||`last`,options:t,channel:!0})}
            ${K(e,`failureAlertTo`,{label:g(`cron.form.failureAlertTo`),help:g(`cron.form.failureAlertToHelp`),list:`cron-delivery-to-suggestions`,placeholder:g(`cron.form.failureAlertToPlaceholder`)})}
            ${J(e,`failureAlertDeliveryMode`,{label:g(`cron.form.failureAlertMode`),options:[{value:``,label:g(`cron.form.failureAlertInherit`)},{value:`announce`,label:g(`cron.form.failureAlertAnnounce`)},{value:`webhook`,label:g(`cron.form.failureAlertWebhook`)}]})}
            ${K(e,`failureAlertAccountId`,{label:g(`cron.form.failureAlertAccountId`),placeholder:g(`cron.form.failureAlertAccountPlaceholder`)})}
          `:x}
  `}var yr,br,xr,Sr;function Cr(){return(Cr=e((()=>{i(),S(),pe(),_e(),ve(),Ne(),Yt(),Gt(),$t(),Se(),Ot(),Zt(),Dt(),kt(),Ce(),wt(),Ut(),A(),p(),M(),rt(),h(),ie(),tn(),yn(),wn(),Ln(),j(),yr={name:`cron.form.fieldName`,scheduleAt:`cron.form.runAt`,everyAmount:`cron.form.every`,cronExpr:`cron.form.expression`,staggerAmount:`cron.form.staggerWindow`,triggerScript:`cron.form.triggerScript`,payloadText:`cron.form.assistantTaskPrompt`,payloadModel:`cron.form.model`,payloadThinking:`cron.form.thinking`,timeoutSeconds:`cron.form.timeoutSeconds`,deliveryTo:`cron.form.to`,failureAlertAfter:`cron.form.failureAlertAfter`,failureAlertCooldownSeconds:`cron.form.failureAlertCooldown`},br=[{value:`all`,labelKey:`cron.tabs.all`},{value:`enabled`,labelKey:`cron.tabs.active`},{value:`disabled`,labelKey:`cron.tabs.paused`}],xr={all:`cron.jobs.all`,at:`cron.form.at`,every:`cron.form.every`,cron:`cron.form.cronOption`,"on-exit":`cron.form.repeatOnExit`,stream:`cron.form.repeatStream`},Sr={script:`javascript`,command:`bash`,heartbeat:``,systemEvent:``,agentTurn:``}})))()}var $,wr;function Tr(){return(Tr=e((()=>{r(),S(),he(),De(),Oe(),Te(),Ee(),rn(),It(),A(),qt(),p(),M(),l(),Ye(),ft(),h(),Pe(),ce(),ot(),fe(),le(),on(),pn(),N(),vn(),Cr(),j(),$=class extends te{constructor(){super(),this.routeSearch=``,this.cron=vt(),this.agentsList=null,this.cronModelSuggestions=[],this.modelSuggestionsError=null,this.listTab=`tasks`,this.detailTab=`settings`,this.heartbeatScratch=``,this.runTranscript=new _n(this,()=>{let e=this.gateway.capture(),t=this.cron;return e?{client:e.client,epoch:this.gateway.epoch,isCurrent:()=>this.gateway.isCurrent(e)&&this.cron===t}:null}),this.pendingRouteData=null,this.routeJobRequested=!1,this.highlightedRunId=null,this.pendingRunScroll=!1,this.modelSuggestionsRequest=null,this.heartbeatScratchRequest=0,this.pageHidden=document.visibilityState===`hidden`,this.gateway=new st(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial?this.resetGatewayState(e.snapshot):je(e.snapshot).canAdmin||this.clearHeartbeatScratch()},ensureInitialData:()=>this.ensureInitialData(),onPageActivation:()=>{let e=document.visibilityState===`hidden`,t=this.pageHidden&&!e;this.pageHidden=e,t&&this.ensureInitialData(!0)}}),this.observeAgentScope=Xe(e=>{this.pendingRouteData=null,this.resetGatewayState(this.context.gateway.snapshot),this.cron.cronAgentId=e,this.listTab=`tasks`,this.detailTab=`settings`,this.ensureInitialData(),this.requestUpdate()}),this.subscriptions=new de(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncAgentsState()).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&this.gateway.client&&(t.event===`task`&&this.runTranscript.observe(t.payload),t.event===`cron`?this.refreshCron({tableFilters:!0,coalesce:!0}):(t.event===`config.changed`||t.event===`chat.metadata.changed`)&&this.loadModelSuggestions(this.cron))})),this.lastPanelKey=null,new an(this)}get canManageCron(){return je(this.context.gateway.snapshot).canAdmin}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(e){this.runTranscript.close(),this.clearHeartbeatScratch(),Re(this.cron);let t=e?.phase===`connected`,n=vt({client:e?.client??null,connected:t});n.canRefresh=()=>this.canRefreshCron(n),this.cron=n,n.cronSessionFilter=mn(this.routeSearch).session,this.routeJobRequested=!1,this.pageHidden=document.visibilityState===`hidden`,this.cron.cronAgentId=this.context.agentSelection.state.scopeId,this.agentsList=t?this.context.agents.state.agentsList:null,this.cronModelSuggestions=[],this.modelSuggestionsError=null,this.modelSuggestionsRequest=null}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}canRefreshCron(e=this.cron){return this.isConnected&&this.cron===e&&document.visibilityState!==`hidden`}ensureInitialData(e=!1){this.canRefreshCron()&&this.cron.connected&&this.cron.client&&(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),e||!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0,coalesce:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(),this.modelSuggestionsRequest?.state!==this.cron&&this.loadModelSuggestions(this.cron))}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}willUpdate(e){if(e.has(`routeSearch`)){this.runTranscript.close(),this.cron.cronError=null;let e=mn(this.routeSearch);JSON.stringify(this.cron.cronSessionFilter)!==JSON.stringify(e.session)&&(this.resetGatewayState(this.context.gateway.snapshot),this.ensureInitialData()),this.listTab=`tasks`,this.detailTab=`settings`,this.pendingRouteData=e.jobId||e.session?e:null,this.routeJobRequested=!1,this.highlightedRunId=null,this.pendingRunScroll=!1}}updated(){let e=this.cron.cronEditingJob?.id??null,t=`${e?`job`:this.cron.cronCreateOpen?`create`:`overview`}:${e??``}`;if(t!==this.lastPanelKey){this.lastPanelKey=t,this.detailTab=e&&this.highlightedRunId?`history`:`settings`;let n=this.closest(`.content`);n instanceof HTMLElement&&typeof n.scrollTo==`function`&&n.scrollTo({top:0})}let n=this.pendingRouteData,r=this.cron.client;if(n?.session&&this.cron.cronJobsSnapshotRevision&&!this.cron.cronLoading){this.pendingRouteData=null;let[e]=this.cron.cronJobs;this.cron.cronJobsTotal===1&&e&&this.selectJob(e)}if(n?.jobId&&r&&this.cron.connected&&!this.routeJobRequested&&(this.routeJobRequested=!0,this.runCronTask(async e=>{let t=()=>this.isConnected&&this.cron===e&&this.pendingRouteData===n;try{let e=await r.request(`cron.get`,{id:n.jobId});t()&&this.selectJob(e,n.runId)}catch(n){t()&&(this.pendingRouteData=null,e.cronError=f(n))}})),this.pendingRunScroll){let e=this.querySelector(`.cron-run-entry--highlighted`);e&&(e.scrollIntoView?.({block:`nearest`}),this.pendingRunScroll=!1)}}async refreshCron(e){let t=this.cron;this.canRefreshCron(t)&&t.connected&&t.client&&(this.loadRuns(e.coalesce),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(t=>Je(t,e)),this.runCronTask(t=>D(t,{tableFilters:e.tableFilters}))]))}loadRuns(e=!1){return this.runCronTask(t=>O(t,{coalesce:e}))}async loadModelSuggestions(e){let t=e.client,n=this.context.agentSelection.state.selectedId;if(!t||!e.connected||!n)return;let r={state:e,agentId:n};this.modelSuggestionsRequest=r;let i=()=>this.cron===e&&this.modelSuggestionsRequest===r&&this.context.agentSelection.state.selectedId===n;try{let e=await it(t,{agentId:n});i()&&(this.cronModelSuggestions=e.models.filter(e=>e.manualSelectionAllowed!==!1).map(e=>e.id),this.modelSuggestionsError=gt(e))}catch(e){i()&&(this.modelSuggestionsError=f(e))}}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}runCronAdminTask(e){this.canManageCron&&this.runCronTask(e)}patchForm(e){this.canManageCron&&(this.cron.cronForm=Ze({...this.cron.cronForm,...e},e),this.cron.cronFieldErrors=Ke(this.cron.cronForm),this.requestCronUpdate())}selectJob(e,t=null){this.clearHeartbeatScratch(),this.pendingRouteData=null,this.highlightedRunId=t,this.pendingRunScroll=!!t,t&&(this.detailTab=`history`),this.cron.cronCreateOpen=!1,$e(this.cron,e),this.requestCronUpdate(),e.payload?.kind===`heartbeat`&&this.loadHeartbeatScratch(this.cron,e.id,this.heartbeatScratchRequest),this.runCronTask(async t=>{E(t,{cronRunsScope:`job`}),t.cronRunsJobId=e.id,await O(t)})}clearHeartbeatScratch(){this.heartbeatScratchRequest+=1,this.heartbeatScratch=``}async loadHeartbeatScratch(e,t,n){let r=e.client;if(!this.canManageCron||!r||!e.connected)return;let i=this.gateway.capture();if(!i)return;let a=()=>this.cron===e&&this.heartbeatScratchRequest===n&&this.gateway.isCurrent(i)&&this.canManageCron&&e.cronEditingJob?.id===t&&e.cronForm.payloadKind===`heartbeat`;try{let e=await r.request(`cron.scratch.get`,{id:t});a()&&(this.heartbeatScratch=e.scratch?.content??``)}catch(t){a()&&(e.cronError=f(t),this.requestCronUpdate(e))}}openCreate(e){if(this.canManageCron){if(this.clearHeartbeatScratch(),this.pendingRouteData=null,qe(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!0,e){this.patchForm(e);return}this.requestCronUpdate()}}cloneJob(e){this.canManageCron&&(this.clearHeartbeatScratch(),this.pendingRouteData=null,Be(this.cron,e),this.cron.cronCreateOpen=!0,this.requestCronUpdate())}async removeJob(e){let t=this.context,n=this.cron,r=this.gateway.capture(),i=this.canManageCron,a=n.cronEditingJob?.id===e.id?n.cronEditingJob:n.cronJobs.find(t=>t.id===e.id&&t.updatedAtMs===e.updatedAtMs);if(!r||!i||!a)return;let o=a.id,s=a.updatedAtMs,c=a.name,l=await jt({title:g(`cron.actions.removeConfirmTitle`,{name:c}),message:g(`cron.actions.removeConfirmMessage`),confirmLabel:g(`cron.actions.remove`),danger:!0}),u=n.cronEditingJob?.id===o?n.cronEditingJob:n.cronJobs.find(e=>e.id===o);l&&this.context===t&&this.cron===n&&this.gateway.isCurrent(r)&&this.canManageCron&&u&&u.updatedAtMs===s&&await this.runCronTask(async e=>{await Le(e,u),e.cronRunsScope===`job`&&e.cronRunsJobId===null&&(E(e,{cronRunsScope:`all`}),await O(e))})}closePanel(){this.clearHeartbeatScratch(),this.pendingRouteData=null,qe(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!1,this.requestCronUpdate(),this.runCronTask(async e=>{E(e,{cronRunsScope:`all`}),e.cronRunsJobId=null,await O(e)})}submitForm(e={}){this.runCronAdminTask(async t=>{let n=!!t.cronEditingJob,r=await We(t);r.saved&&(n||t.cronEditingJob||(e.runNow&&r.jobId&&await mt(t,r.jobId,`force`),t.cronCreateOpen=!1,t.cronRunsScope===`job`&&(E(t,{cronRunsScope:`all`}),t.cronRunsJobId=null,await O(t))))})}render(){let e=this.context.channels.state,t=ae(this.context),n=dn({channels:e,runtimeConfig:this.context.runtimeConfig.state,cron:this.cron,agentsList:this.agentsList,modelSuggestions:this.cronModelSuggestions}),r=this.canManageCron;return y`
      ${xt({title:Ae(`cron`),subtitle:this.cron.cronSessionFilter?g(`cron.list.sessionFilter`):ke(`cron`),actions:this.cron.cronSessionFilter?y`<a
              class="btn"
              href=${we(`cron`,this.context.basePath)}
              @click=${e=>{se(e)&&(e.preventDefault(),this.context.navigate(`cron`,{search:``}))}}
              >${g(`cron.list.showAll`)}</a
            >`:nn({agents:this.agentsList?.agents??[],selection:this.context.agentSelection})})}
      ${this.runTranscript.render()}
      ${Kt(Wn({basePath:this.context.basePath,agentId:t,loading:this.cron.cronLoading,hasLoaded:this.cron.cronJobsSnapshotRevision!==null,listError:this.cron.cronJobsError,canManage:r,status:this.cron.cronStatus,jobs:this.cron.cronJobs,jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsTriggerFilter:this.cron.cronJobsTriggerFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJob:this.cron.cronEditingJob,createOpen:this.cron.cronCreateOpen,listTab:this.listTab,detailTab:this.detailTab,error:this.cron.cronError??this.cron.cronRunsError??this.modelSuggestionsError,busy:this.cron.cronBusy,form:this.cron.cronForm,heartbeatScratch:r?this.heartbeatScratch:``,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runs:this.cron.cronRuns,runsState:ht(this.cron),highlightedRunId:this.highlightedRunId,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!Fe(this.cron.cronFieldErrors),agentSuggestions:n.agentSuggestions,modelSuggestions:n.modelSuggestions,thinkingSuggestions:fn,timezoneSuggestions:n.timezoneSuggestions,deliveryToSuggestions:n.deliveryToSuggestions,accountSuggestions:n.accountTargets,onListTabChange:e=>{this.listTab=e},onDetailTabChange:e=>{this.detailTab=e},onFormChange:e=>this.patchForm(e),onRefresh:()=>void this.refreshCron({tableFilters:!0}),onSubmit:()=>this.submitForm(),onSubmitRunNow:()=>this.submitForm({runNow:!0}),onSelectJob:e=>this.selectJob(e),onOpenCreate:e=>this.openCreate(e),onClosePanel:()=>this.closePanel(),onClone:e=>this.cloneJob(e),onToggle:(e,t)=>this.runCronAdminTask(n=>Qe(n,e,t)),onRun:(e,t)=>this.runCronAdminTask(n=>mt(n,e.id,t??`force`)),onRemove:e=>void this.removeJob(e),onLoadMoreJobs:()=>void this.runCronTask(e=>D(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{tt(t,e),await D(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{tt(e,{cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsTriggerFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await D(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>ct(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{E(t,e),await O(t)}),onViewRunTranscript:e=>void this.runTranscript.open(e)}))}
    `}},s([o({context:be,subscribe:!0})],$.prototype,`context`,void 0),s([ye({attribute:!1})],$.prototype,`routeSearch`,void 0),s([C()],$.prototype,`cron`,void 0),s([C()],$.prototype,`agentsList`,void 0),s([C()],$.prototype,`cronModelSuggestions`,void 0),s([C()],$.prototype,`modelSuggestionsError`,void 0),s([C()],$.prototype,`listTab`,void 0),s([C()],$.prototype,`detailTab`,void 0),s([C()],$.prototype,`heartbeatScratch`,void 0),wr={header:!0,render:e=>y`<openclaw-cron-page
    .routeSearch=${typeof e==`string`?e:``}
  ></openclaw-cron-page>`},customElements.get(`openclaw-cron-page`)||customElements.define(`openclaw-cron-page`,$)})))()}Tr();export{wr as cronPageComponent};
//# sourceMappingURL=cron-page-T4PIJXgy.js.map