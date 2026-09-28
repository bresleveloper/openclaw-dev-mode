import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$n as t,Cr as n,Ka as r,Ki as i,Na as a,Qn as o,Qr as s,Ra as c,Wi as l,Xi as u,Zr as d,ai as f,br as p,co as m}from"./control-ui-foundation-Dh9Nir5C.js";import{$c as ee,Gl as h,H as te,Il as ne,Ll as re,Ti as ie,Tn as ae,U as oe,Ur as se,V as ce,Vr as le,W as ue,Xl as g,Yc as _,_l as de,_n as v,cl as fe,dc as pe,fc as me,fn as he,hi as ge,il as _e,lc as ve,ll as ye,mc as be,mn as xe,nc as y,nu as Se,pn as Ce,qi as we,tc as Te,tu as Ee,uc as De,ul as Oe,wn as ke,xi as Ae,zi as je,zl as b}from"./control-ui-core-BfjCgLp6.js";import{$ as x,F as Me,I as Ne,X as S,Y as C,c as Pe,ct as w,nt as T,s as Fe,ut as E,z as Ie}from"./lit-runtime-L6OV30Vo.js";import{$r as Le,Di as Re,Et as ze,Fi as D,Ii as O,It as Be,Oa as k,Oi as Ve,Qa as He,St as Ue,Xn as We,Yn as Ge,_a as Ke,ba as A,ei as qe,fo as Je,ga as Ye,oa as Xe,tr as Ze,wt as Qe,zt as $e}from"./control-ui-core-qT0XjEdV.js";import{C as et,S as tt}from"./control-ui-boot-shared-C0vUfSi6.js";import{c as nt,s as rt,u as it}from"./gateway-runtime-BQX_hMWC.js";import{Ii as at,Ko as ot,Qo as st,Ri as ct,Xo as j,la as lt,qo as ut,sa as dt}from"./control-ui-boot-shared-CYu509im.js";import{At as ft,Dt as pt,Ot as mt,Wi as ht,f as gt,p as _t,pt as vt}from"./control-ui-boot-shared-Bm2ZxasE.js";import{An as yt,Fr as bt,Lr as xt,Nn as St,Nr as Ct,_r as wt,vr as Tt}from"./control-ui-boot-shared-Ck3TDIrB.js";import{n as Et,t as Dt}from"./stream-auto-follow-controller-BZ0UzGsg.js";import{mt as Ot}from"./control-ui-boot-new-BDpfvqZB.js";import{n as kt,t as At}from"./settings-workspace-DjAwV7nI.js";import{n as jt,t as Mt}from"./agent-row-chip-D8JnzqeS.js";var Nt,M;function N(){return(N=e((()=>{Se(),Nt={activity:{images:{failed:`Image previews are unavailable. Open the session or retry.`,older:`Search older images`,incomplete:`Some images are too large to preview here. Open the session to see them.`},git:{pullRequest:`{repository} pull request #{number}: {title} ({state})`,branchDiff:`{branch}: changes against the default branch, including uncommitted work`,stale:`Git status may be out of date`,open:`Open`,draft:`Draft`,merged:`Merged`,closed:`Closed`},title:`Activity`,visibleCount:`{visible} of {total}`,search:`Search`,searchPlaceholder:`Filter by activity, summary, run, session`,filters:`Filters`,toolFilter:`Tool`,allTools:`All tools`,statusFilters:`Status filters`,autoFollow:`Auto-follow`,expandAll:`Expand all`,collapseAll:`Collapse all`,clear:`Clear`,empty:`No activity yet.`,emptyFiltered:`No activity matches these filters.`,argumentHiddenOne:`1 argument hidden`,argumentsHidden:`{count} arguments hidden`,streamLabel:`Agent activity entries`,toolCallId:`Tool call`,runId:`Run`,session:`Session`,outputTruncated:`Preview redacted and truncated.`,noOutputPreview:`No output preview.`,currentWork:{title:`Active sessions`,loading:`Loading active sessions…`,empty:`No active sessions.`,disconnected:`Connect to the Gateway to load active sessions.`,loadFailed:`Could not load active sessions.`,queued:`Queued`,limit:`Showing {count} of {total} active sessions.`},answerCandidate:{title:`Answer candidate`,itemId:`Item`,candidate:`Candidate answer`,superseded:`Superseded answer`,selected:`Selected answer`},status:{running:`Running`,done:`Done`,error:`Error`},runInspector:{activityView:`Activity view`,liveMode:`Live activity`,mode:`Run inspector`,intro:`Durable Gateway-backed identity evidence for one run. Reloading this page queries the Gateway again.`,bestEffortWarning:`Best-effort audit warning: this view is for operational diagnostics, not a lossless compliance record. Absence of evidence does not prove that an action or run did not occur.`,evidenceStateLabel:`Evidence state: {state}`,evidenceState:{present:`Present`,absent:`Absent`,unknown:`Unknown`,unsupported:`Unsupported`},coverageStatusLabel:`Inspection coverage: {state}`,coverage:{enforced:{label:`Enforced`,description:`A decision receipt proves identity-aware evaluation; it does not by itself mean the action was allowed.`},attributionOnly:{label:`Attribution only`,description:`Identity facts were recorded, but no identity-aware policy or grant evaluation is proven.`},unattributed:{label:`Unattributed`,description:`The supported path was observed without a usable invoker principal.`},unknown:{label:`Unknown`,description:`Expected evidence is missing, corrupt, expired unexpectedly, or unreadable.`},unsupported:{label:`Unsupported`,description:`This path has no Phase 0 identity evidence contract.`}},facts:{trustDomain:`Trust domain`,ingress:`Ingress`,invoker:`Invoker`,representedSubject:`Represented subject`,sponsor:`Sponsor`,agentPrincipal:`Agent principal`,agentDefinition:`Agent definition`,runtimeInstance:`Runtime instance`,applicableGrants:`Applicable grants`,applicableGrant:`Applicable grant {index}`,assuranceEvidence:`Assurance evidence`,assuranceEvidenceItem:`Assurance evidence {index}`,lineage:`Lineage`},values:{label:`Label`,kind:`Kind`,operation:`Operation`,principalReference:`Principal reference`,domainReference:`Domain reference`,owningBoundary:`Owning boundary`,sourceReference:`Source reference`,relationshipReference:`Relationship reference`,definitionReference:`Definition reference`,revisionReference:`Revision reference`,runtimeReference:`Runtime reference`,grantReference:`Grant reference`,strength:`Strength`,evidenceReference:`Evidence reference`,depth:`Depth`,parentRunReference:`Parent run reference`,parentExecutionReference:`Parent execution reference`,parentContextReference:`Parent context reference`,delegationReference:`Delegation reference`},reasons:{absent:`No {label} was recorded at the owning boundary.`,unknown:`The {label} was expected, but its evidence is unavailable or unreadable.`,unsupported:`This execution path does not provide {label} evidence.`,invokerAbsent:`The supported ingress boundary recorded no usable invoker principal.`,noGrants:`No applicable grants were recorded for this run.`,noAssurance:`No assurance evidence was recorded for this run.`,noLineage:`No parent or subagent lineage was recorded for this run.`},identityHeading:`Identity and authority`,missingEvidenceHeading:`Missing evidence`,noMissingEvidence:`No missing evidence was reported for this projection.`,nextStepsHeading:`Next steps`,decisions:{heading:`Decision receipts`,none:`No decision receipts were returned for this bounded page.`,returned:`Showing {count} retained decision receipts.`,listLabel:`Decision receipt list`,inspectLabel:`{summary}. Outcome: {outcome}. Evidence classification: {classification}.`,detailHeading:`Receipt detail`,requestedHeading:`What was requested`,outcomeHeading:`What happened`,outcomeLabel:`Outcome`,classificationLabel:`Evidence classification`,reasonLabel:`Recorded reason`,occurredAtLabel:`Recorded at`,ownerHeading:`Display provenance`,durableOwnerLabel:`Verified producer`,boundaryLabel:`Decision boundary`,ownerNote:`The Gateway exposes explanations only from a verified owning call path. Receipt-controlled explanations and next steps are hidden; the Control UI does not infer trust from receipt metadata.`,evidenceHeading:`Evidence limits`,contextFieldsLabel:`Context fields used`,noContextFields:`No context fields were recorded as used.`,policyCountLabel:`Policy references used`,grantCountLabel:`Grant references used`,notFoundTitle:`Receipt not found on this page`,notFoundDescription:`The selected receipt is not present in this retained page. Return to the first page or use a current receipt link.`,readOnly:`Decision receipts are read-only. This view cannot approve, edit, or repeat an action.`,more:`Additional decision receipts are available.`,loadMore:`Load more receipts`,loadingMore:`Loading receipts…`,loadMoreError:`More receipts could not be loaded. The receipts already shown remain unchanged.`,bounded:`Decision inspection is bounded to at most 50 records per request.`,outcomes:{allowed:`Allowed`,denied:`Denied`,notApplicable:`Not applicable`,unknown:`Unknown`}},diagnosticReason:`Diagnostic reason:`,diagnostic:{notFound:{title:`Run not found`,description:`No retained run or identity record matched this reference. Missing best-effort evidence does not prove that the run never occurred.`},expired:{title:`Identity evidence expired`,description:`The Gateway found the run, but its identity context is outside the 30-day retention window.`},corrupt:{title:`Identity evidence is corrupt`,description:`The Gateway found evidence for this run but could not validate the stored identity context.`},ambiguous:{title:`Multiple executions match this run`,description:`A run reference can correlate more than one execution. The inspector will not guess which execution you meant.`},unsupported:{title:`Identity evidence unsupported`,description:`The run is known, but this execution path did not retain a supported identity context.`},unknown:{title:`Identity evidence unknown`,description:`The path promises evidence, but the expected record is missing, unreadable, or otherwise unavailable.`}},candidates:{listLabel:`Matching executions`,recorded:`Recorded {date}`,executionReference:`Inspect execution`,more:`More matching executions exist beyond this bounded page.`,loadMore:`Load more executions`,loadingMore:`Loading executions…`,loadMoreError:`More executions could not be loaded. Try again.`},panels:{empty:{title:`No run selected`,description:`Open a link shaped like /activity?view=run&run=<run-id> to inspect durable identity evidence.`},waiting:{title:`Waiting for the Gateway`,description:`The durable projection will load when this browser reconnects.`},loading:{title:`Loading run inspection`,description:`Reading the Gateway's retained identity projection…`},disconnected:{title:`Gateway disconnected`,description:`Run identity is durable on the Gateway, but it cannot be read while this browser is disconnected.`},unauthorized:{title:`Operator read access required`,description:`This connection does not have operator.read, so retained run identity cannot be loaded.`},unsupported:{title:`Run inspection unsupported`,description:`This Gateway does not offer audit.run.inspect. Upgrade the Gateway, enable execution identity collection, and record a new run.`},error:{title:`Run inspection failed`,description:`The Gateway could not return this diagnostic projection. No identity facts were inferred from Live activity.`}},restart:`Restart inspection`,retry:`Retry inspection`}}},M=Object.assign(()=>{Ee.activity=Nt.activity},{catalog:Nt})})))()}function Pt(e){let t=ye({},e.key,e.agentId??void 0),n=e.agentId??t.agentId;return JSON.stringify([n?a(n):null,t.sessionKey,e.sessionId??null])}function Ft(e){let t=we(e);return!t?.sessionId||t.hasActiveRun===null&&t.activeRunIds===void 0&&t.status===null&&t.reason!==`delete`?null:{key:t.key,agentId:t.agentId,sessionId:t.sessionId,runId:t.runId,reason:t.reason,updatedAt:t.updatedAt,hasActiveRun:t.hasActiveRun,activeRunIds:t.activeRunIds,status:t.status}}function It(e,t){let n=new Map(e.sessions.map(e=>[Pt(e),{row:e,requiresRefresh:!1}])),r=new Set;for(let e of t){let t=Pt(e),i=n.get(t),a=e.status===`running`||e.status===`queued`?e.status:void 0,o=e.hasActiveRun===!0||e.hasActiveRun!==!1&&a!==void 0;if(!i){o?r.add(t):(e.hasActiveRun===!1||e.reason===`delete`)&&r.delete(t);continue}let{row:s}=i;if(e.updatedAt!==null&&(s.updatedAt??0)>e.updatedAt)continue;let c={...s,updatedAt:e.updatedAt??s.updatedAt};if(e.reason===`delete`)c.hasActiveRun=!1,c.activeRunIds=[];else if(o)c.hasActiveRun=!0,c.status=a??(s.status===`queued`?`queued`:`running`),e.activeRunIds===void 0?e.runId&&!s.activeRunIds?.includes(e.runId)&&(c.activeRunIds=void 0):c.activeRunIds=e.activeRunIds??void 0;else{let t=e.hasActiveRun===!1||e.status!==null;if(t&&s.hasActiveRun===!0&&e.runId&&!s.activeRunIds?.includes(e.runId)){i.requiresRefresh=!0;continue}if(e.hasActiveRun===!1&&(e.activeRunIds!==void 0||!e.runId)||e.activeRunIds?.length===0)c.hasActiveRun=!1,c.activeRunIds=[];else if(t){let t=e.activeRunIds??s.activeRunIds;if(!e.runId||!t?.includes(e.runId)){i.requiresRefresh=s.hasActiveRun===!0;continue}c.activeRunIds=t.filter(t=>t!==e.runId),c.hasActiveRun=c.activeRunIds.length>0}else e.activeRunIds!==void 0&&(c.activeRunIds=e.activeRunIds??void 0)}i.row=c,i.requiresRefresh=!1}let i=[...n.values()].filter(({row:e})=>e.hasActiveRun===!0),a=i.map(({row:e})=>e),o=!i.some(e=>e.requiresRefresh),s=!o||!e.hasMore&&r.size>0;return{result:{...e,count:a.length,sessions:a},requiresRefresh:s,canPublish:o}}function Lt(){return(Lt=e((()=>{je(),_()})))()}function Rt(e,t){let n=x`<span class="activity-current-work__copy">
      <span class="activity-current-work__title">${ie(t.key,t)}</span>
      <span class="activity-current-work__agent"
        >${t.agentId?g(`activityFeed.agentLabel`,{value:t.agentId}):t.key}</span
      >
    </span>
    ${mt({kind:`warn`,label:t.status===`queued`?g(`activity.currentWork.queued`):g(`activity.status.running`)})}`;if(!De(t.key,e.globalScope))return x`<div
      class="activity-current-work__row"
      data-session-key=${t.key}
      data-agent-id=${t.agentId??S}
    >
      ${n}
    </div>`;let r=me(t),i=be({face:r,sessionKey:t.key,basePath:e.basePath,fallbackAgentId:t.agentId??e.fallbackAgentId,mainKey:e.mainKey,row:t});return x`<a
    class="activity-current-work__row"
    data-session-key=${t.key}
    data-agent-id=${t.agentId??S}
    href=${i.href}
    @click=${t=>{ge(t)&&(t.preventDefault(),e.navigate(r,i.options))}}
  >
    ${n}
  </a>`}function zt(e){let t=e.connected&&!e.error?e.result?.sessions??[]:[],n=e.connected?e.error?g(`activity.currentWork.loadFailed`):!e.result||t.length===0&&e.incomplete?g(`activity.currentWork.loading`):t.length===0?g(`activity.currentWork.empty`):null:g(`activity.currentWork.disconnected`);return x`<section
    class="activity-current-work"
    aria-label=${g(`activity.currentWork.title`)}
    aria-busy=${e.loading}
  >
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${g(`activity.currentWork.title`)}</h2>
    </div>
    <div class="settings-group activity-current-work__rows">
      ${n?x`<div class="activity-current-work__feedback" role="status">
              <span>${n}</span>
              ${e.error?x`<button type="button" class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRetry}>${g(`common.retry`)}</button>`:S}
            </div>`:Pe(t,Pt,t=>Rt(e,t))}
      ${e.result?.hasMore&&!n?x`<div class="activity-current-work__feedback">${g(`activity.currentWork.limit`,{count:String(t.length),total:String(e.result.totalCount??t.length)})}</div>`:S}
    </div>
  </section>`}function Bt(){return(Bt=e((()=>{C(),Fe(),vt(),h(),N(),Ae(),ve(),Lt(),M()})))()}function P(e){let t=p(e.lastActivityAt),n=p(e.lastInteractionAt);return t!==void 0||n!==void 0?Math.max(t??0,n??0):p(e.updatedAt)??p(e.createdAt)??0}function Vt(){return(Vt=e((()=>{n()})))()}function Ht(e){return e===`24h`||e===`7d`||e===`30d`||e===`all`}function F(e){return e?.trim()||void 0}function Ut(e,t){let n=new URLSearchParams(e),r=n.get(`time`);return{personId:t??F(n.get(`person`))??null,query:n.get(`q`)?.trim()??``,time:Ht(r)?r:$t}}function Wt(e,t=``,n){let r=new URLSearchParams;e.time!==$t&&r.set(`time`,e.time),e.query&&r.set(`q`,e.query);let i=r.toString(),a=i?`?${i}`:``;return{pathname:e.personId?Ke(e.personId,t,n).pathname:k(`activity`,t),search:a}}function Gt(e,t,n,r){let i=new URLSearchParams(e.search),a=Ye(e.pathname,r),o=(a??i.get(`person`))?.replaceAll(`-`,``),s=o&&/^[0-9a-f]{8,32}$/.test(o)&&t.replaceAll(`-`,``).startsWith(o)?o.length:32,c=a&&!n?e.pathname:Ke(t,r,n,s).pathname;i.delete(Xe);let l=i.toString(),u=l?`?${l}`:``;return c===e.pathname&&u===e.search?null:{pathname:c,search:u,hash:e.hash}}function Kt(e,t){return P(t)-P(e)||(e.key<t.key?-1:+(e.key>t.key))}function qt(e){let t=e.owner?.actor??e.createdActor,n=F(e.agentId),{resourceBasePath:r}=oe();return{id:F(t?.id)??n??`system`,name:F(t?.label)??n,avatarUrl:t?F(t.avatarUrl):n?tt(`agentAvatar`,r,n):void 0,watchedSessions:[]}}function Jt(e){let t=new Date(e),n=String(t.getMonth()+1).padStart(2,`0`),r=String(t.getDate()).padStart(2,`0`);return`${t.getFullYear()}-${n}-${r}`}function Yt(e){let t=new Date(e);return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()}function Xt(e){let t=e?.sessions??[],n=(e?.people??[]).map(e=>({id:e.identity.id,name:e.label,avatarUrl:e.avatarUrl,watchedSessions:[],count:e.sessionCount})),r=new Map;for(let e of t){let t=P(e),n=t>0?Jt(t):`unknown`,i=r.get(n);i?i.push(e):r.set(n,[e])}return{days:[...r.entries()].map(([e,t])=>({key:e,timestamp:e===`unknown`?null:Yt(P(t[0])),sessions:t})),matchedCount:e?.totalCount??t.length,people:n,sessions:t,timeCount:e?.peopleSessionCount??t.length}}function Zt(e,t){let n=new Set(e.watchedSessions);return t.filter(e=>n.has(e.key)).toSorted(Kt)}var Qt,$t;function I(){return(I=e((()=>{et(),Vt(),A(),te(),Qt=[`24h`,`7d`,`30d`,`all`],$t=`7d`})))()}function en(e,t){let n=`?view=run&${e.kind}=${encodeURIComponent(e.id)}`;return t&&(n+=`&receipt=${encodeURIComponent(t.id)}`,t.decisionCursor&&(n+=`&decision=${encodeURIComponent(t.decisionCursor)}`)),n}function L(e,t,n){return`${k(`activity`,t)}${en(e,n)}`}function tn(e,t){return L({kind:`run`,id:e},t)}function nn(e,t){let n=new URLSearchParams(e);if(n.get(`view`)===`live`)return{mode:`live`,selector:null};if(n.get(`view`)!==`run`)return{mode:`sessions`,filters:Ut(e,t),selector:null};let r=n.get(`execution`),i=n.get(`receipt`)?.trim()||null,a=i&&n.get(`decision`)?.trim()||null;if(r?.trim())return{mode:`run`,selector:{kind:`execution`,id:r},selectorId:i,decisionCursor:a};let o=n.get(`run`);return{mode:`run`,selector:o?.trim()?{kind:`run`,id:o}:null,selectorId:i,decisionCursor:a}}function rn(e,t){return new Map(e.map(e=>[e.selectorId,t]))}function an(e,t){if(e.identity.state!==`present`||t.identity.state!==`present`||e.run.executionId!==t.run.executionId||e.identity.context.contextId!==t.identity.context.contextId)return null;let n=new Map(e.decisionDisplays.map(e=>[e.selectorId,e]));for(let e of t.decisionDisplays)n.set(e.selectorId,e);return{...t,decisionDisplays:[...n.values()]}}function on(e){let t=e.identity;return t.state===`present`?`present`:t.state===`ambiguous`?`ambiguous`:t.reasonCode===`run_not_found`||t.reasonCode===`execution_not_found`?`not-found`:t.reasonCode===`identity_context_corrupt`?`corrupt`:t.state===`unsupported`&&t.remediation.some(e=>e.code===`run_again_after_expiry`)?`expired`:t.state}function R(){return(R=e((()=>{A(),I()})))()}function sn(e){return e===`attribution-only`?`attributionOnly`:e}function z(e){return g(`activity.runInspector.coverage.${sn(e)}.label`)}function B(e,t=!1,n){let r=x`<bdi
    class=${t?`run-inspector__ref mono`:`run-inspector__ref`}
    dir="ltr"
    >${e}</bdi
  >`;return n?x`<a href=${n}>${r}</a>`:r}function cn(e,t,n){return n===6?x`<h6 id=${t}>${e}</h6>`:x`<h3 id=${t}>${e}</h3>`}function ln(e,t={}){let n=t.headingId??`run-inspector-missing-heading`;return x`
    <section class="run-inspector__section" aria-labelledby=${n}>
      ${cn(g(`activity.runInspector.missingEvidenceHeading`),n,t.headingLevel??3)}
      ${e.length===0?x`<p>${g(`activity.runInspector.noMissingEvidence`)}</p>`:x`<ul class="run-inspector__code-list">
              ${e.map(e=>x`<li>${B(e,!0)}</li>`)}
            </ul>`}
    </section>
  `}function un(e,t={}){if(e.length===0)return S;let n=t.headingId??`run-inspector-remediation-heading`;return x`
    <section class="run-inspector__section" aria-labelledby=${n}>
      ${cn(g(`activity.runInspector.nextStepsHeading`),n,t.headingLevel??3)}
      <ul class="run-inspector__remediation-list">
        ${e.map(e=>x`<li>
            <span>${e.text}</span> ${B(e.code,!0)}
          </li>`)}
      </ul>
    </section>
  `}function dn(e,t,n,r){return L(e,r,{id:t,decisionCursor:n})}function V(e){return g(`activity.runInspector.decisions.outcomes.${e===`not-applicable`?`notApplicable`:e}`)}function fn(e,t){return e.length===0?x`<p class="run-inspector__reason">${t}</p>`:x`<ul class="run-inspector__code-list">
        ${e.map(e=>x`<li>${B(e,!0)}</li>`)}
      </ul>`}function pn(e){let t=e.enforcement.coverageState;return x`
    <article class="run-inspector__receipt-detail" aria-labelledby="run-inspector-receipt-detail">
      <h4 id="run-inspector-receipt-detail">
        ${g(`activity.runInspector.decisions.detailHeading`)}
      </h4>
      <section aria-labelledby="run-inspector-receipt-requested">
        <h5 id="run-inspector-receipt-requested">
          ${g(`activity.runInspector.decisions.requestedHeading`)}
        </h5>
        ${e.action.summary?x`<p>${e.action.summary}</p>`:S}
        <dl class="run-inspector__values">
          <div>
            <dt>${g(`activity.runInspector.values.kind`)}</dt>
            <dd>${B(e.action.family)}</dd>
          </div>
          <div>
            <dt>${g(`activity.runInspector.values.operation`)}</dt>
            <dd>${B(e.action.operation)}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="run-inspector-receipt-outcome">
        <h5 id="run-inspector-receipt-outcome">
          ${g(`activity.runInspector.decisions.outcomeHeading`)}
        </h5>
        <div class="run-inspector__receipt-badges">
          <span
            class="run-inspector__receipt-badge run-inspector__receipt-badge--${e.decision.outcome}"
            aria-label=${`${g(`activity.runInspector.decisions.outcomeLabel`)}: ${V(e.decision.outcome)}`}
          >
            ${V(e.decision.outcome)}
          </span>
          <span
            class="run-inspector__receipt-badge run-inspector__receipt-badge--${t}"
            aria-label=${`${g(`activity.runInspector.decisions.classificationLabel`)}: ${z(t)}`}
          >
            ${z(t)}
          </span>
        </div>
        <p class="run-inspector__reason">
          ${g(`activity.runInspector.coverage.${sn(t)}.description`)}
        </p>
        <dl class="run-inspector__values">
          <div>
            <dt>${g(`activity.runInspector.decisions.reasonLabel`)}</dt>
            <dd>${B(e.decision.reasonCode,!0)}</dd>
          </div>
          <div>
            <dt>${g(`activity.runInspector.decisions.occurredAtLabel`)}</dt>
            <dd>${new Date(e.occurredAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="run-inspector-receipt-owner">
        <h5 id="run-inspector-receipt-owner">
          ${g(`activity.runInspector.decisions.ownerHeading`)}
        </h5>
        ${e.provenance.state===`verified`?x`<dl class="run-inspector__values">
                  <div>
                    <dt>${g(`activity.runInspector.decisions.durableOwnerLabel`)}</dt>
                    <dd>${B(e.provenance.producer)}</dd>
                  </div>
                </dl>
                <p class="run-inspector__reason">
                  ${g(`activity.runInspector.decisions.ownerNote`)}
                </p>`:x`<p class="run-inspector__reason">
                ${g(`activity.runInspector.decisions.ownerNote`)}
              </p>`}
      </section>
      <section aria-labelledby="run-inspector-receipt-evidence">
        <h5 id="run-inspector-receipt-evidence">
          ${g(`activity.runInspector.decisions.evidenceHeading`)}
        </h5>
        <dl class="run-inspector__values">
          <div>
            <dt>${g(`activity.runInspector.decisions.policyCountLabel`)}</dt>
            <dd>${e.enforcement.policyCount}</dd>
          </div>
          <div>
            <dt>${g(`activity.runInspector.decisions.grantCountLabel`)}</dt>
            <dd>${e.enforcement.grantCount}</dd>
          </div>
        </dl>
        <h6>${g(`activity.runInspector.decisions.contextFieldsLabel`)}</h6>
        ${fn(e.enforcement.contextFieldsUsed,g(`activity.runInspector.decisions.noContextFields`))}
        ${ln(e.missingEvidence,{headingId:`run-inspector-receipt-missing-heading`,headingLevel:6})}
      </section>
      ${un(e.remediation,{headingId:`run-inspector-receipt-remediation-heading`,headingLevel:6})}
    </article>
  `}function mn(e,t,n,r,i){let a=e.result,o=n?a.decisionDisplays.find(e=>e.selectorId===n):a.decisionDisplays[0];return x`
    <section class="run-inspector__section" aria-labelledby="run-inspector-decisions-heading">
      <h3 id="run-inspector-decisions-heading">${g(`activity.runInspector.decisions.heading`)}</h3>
      ${a.decisionDisplays.length===0?x`<p>${g(`activity.runInspector.decisions.none`)}</p>`:x`<p>
              ${g(`activity.runInspector.decisions.returned`,{count:String(a.decisionDisplays.length)})}
            </p>`}
      <div class="run-inspector__warning" role="note">
        ${g(`activity.runInspector.decisions.readOnly`)}
      </div>
      ${a.decisionDisplays.length>0&&t?x`<ol
              class="run-inspector__receipt-list"
              aria-label=${g(`activity.runInspector.decisions.listLabel`)}
            >
              ${a.decisionDisplays.map(n=>{let i=o?.selectorId===n.selectorId;return x`<li>
                  <a
                    href=${dn(t,n.selectorId,e.receiptPageCursors.get(n.selectorId),r)}
                    aria-current=${i?`true`:S}
                    aria-label=${g(`activity.runInspector.decisions.inspectLabel`,{summary:n.action.summary??`${n.action.family} · ${n.action.operation}`,outcome:V(n.decision.outcome),classification:z(n.enforcement.coverageState)})}
                  >
                    <span
                      >${n.action.summary??`${n.action.family} · ${n.action.operation}`}</span
                    >
                    <span class="run-inspector__receipt-badges" aria-hidden="true">
                      <span
                        class="run-inspector__receipt-badge run-inspector__receipt-badge--${n.decision.outcome}"
                        >${V(n.decision.outcome)}</span
                      >
                      <span
                        class="run-inspector__receipt-badge run-inspector__receipt-badge--${n.enforcement.coverageState}"
                        >${z(n.enforcement.coverageState)}</span
                      >
                    </span>
                  </a>
                </li>`})}
            </ol>`:S}
      ${a.nextDecisionCursor?x`<div class="run-inspector__pagination">
              <span>${g(`activity.runInspector.decisions.more`)}</span>
              <button
                type="button"
                class="btn"
                ?disabled=${e.decisionPageStatus===`loading`}
                @click=${i}
              >
                ${e.decisionPageStatus===`loading`?g(`activity.runInspector.decisions.loadingMore`):g(`activity.runInspector.decisions.loadMore`)}
              </button>
              ${e.decisionPageStatus===`error`?x`<span role="alert">
                      ${g(`activity.runInspector.decisions.loadMoreError`)}
                    </span>`:S}
            </div>`:x`<div class="run-inspector__pagination" role="note">
              ${g(`activity.runInspector.decisions.bounded`)}
            </div>`}
      ${n&&!o?x`<div class="run-inspector__result-state" role="status">
              <h4>${g(`activity.runInspector.decisions.notFoundTitle`)}</h4>
              <p>${g(`activity.runInspector.decisions.notFoundDescription`)}</p>
              ${t?x`<a href=${L(t,r)}>
                      ${g(`activity.runInspector.decisions.heading`)}
                    </a>`:S}
            </div>`:o?pn(o):S}
    </section>
  `}function hn(){return(hn=e((()=>{C(),h(),R()})))()}function gn(e){return g(`activity.runInspector.evidenceState.${e}`)}function _n(e,t){switch(t){case`absent`:return g(`activity.runInspector.reasons.absent`,{label:e.toLowerCase()});case`unknown`:return g(`activity.runInspector.reasons.unknown`,{label:e.toLowerCase()});case`unsupported`:return g(`activity.runInspector.reasons.unsupported`,{label:e.toLowerCase()});case`present`:return}return t}function H(e){return e?[...e.displayLabel?[{label:g(`activity.runInspector.values.label`),value:e.displayLabel}]:[],{label:g(`activity.runInspector.values.kind`),value:e.kind},{label:g(`activity.runInspector.values.principalReference`),value:e.principalRef,mono:!0},{label:g(`activity.runInspector.values.domainReference`),value:e.domainRef,mono:!0}]:[]}function vn(e){let t=e.values??[],n=e.reason??_n(e.label,e.state);return x`
    <div class="run-inspector__fact" data-state=${e.state}>
      <dt>
        <span>${e.label}</span>
        <span
          class="run-inspector__state run-inspector__state--${e.state}"
          aria-label=${g(`activity.runInspector.evidenceStateLabel`,{state:gn(e.state)})}
        >
          ${gn(e.state)}
        </span>
      </dt>
      <dd>
        ${t.length>0?x`<dl class="run-inspector__values">
                ${t.map(e=>x`
                    <div>
                      <dt>${e.label}</dt>
                      <dd>${B(e.value,e.mono,e.href)}</dd>
                    </div>
                  `)}
              </dl>`:S}
        ${n?x`<p class="run-inspector__reason">${n}</p>`:S}
      </dd>
    </div>
  `}function yn(e,t){let n=e.representedSubject,r=e.sponsor,i=e.lineage;return[{label:g(`activity.runInspector.facts.trustDomain`),state:e.trustDomain.state,values:[{label:g(`activity.runInspector.values.kind`),value:e.trustDomain.kind},{label:g(`activity.runInspector.values.domainReference`),value:e.trustDomain.domainRef,mono:!0}]},{label:g(`activity.runInspector.facts.ingress`),state:e.ingress.state,values:[{label:g(`activity.runInspector.values.kind`),value:e.ingress.kind},{label:g(`activity.runInspector.values.owningBoundary`),value:e.ingress.boundary,mono:!0},...e.ingress.sourceRef?[{label:g(`activity.runInspector.values.sourceReference`),value:e.ingress.sourceRef,mono:!0}]:[]]},{label:g(`activity.runInspector.facts.invoker`),state:e.invoker.state,values:H(e.invoker.principal),reason:e.invoker.state===`absent`?g(`activity.runInspector.reasons.invokerAbsent`):void 0},{label:g(`activity.runInspector.facts.representedSubject`),state:n?.state??`absent`,values:H(n?.principal)},{label:g(`activity.runInspector.facts.sponsor`),state:r?.state??`absent`,values:[...H(r?.principal),...r?.relationshipRef?[{label:g(`activity.runInspector.values.relationshipReference`),value:r.relationshipRef,mono:!0}]:[]]},{label:g(`activity.runInspector.facts.agentDefinition`),state:e.agentDefinition.state,values:[{label:g(`activity.runInspector.values.definitionReference`),value:e.agentDefinition.definitionRef,mono:!0},...e.agentDefinition.revisionRef?[{label:g(`activity.runInspector.values.revisionReference`),value:e.agentDefinition.revisionRef,mono:!0}]:[]]},{label:g(`activity.runInspector.facts.agentPrincipal`),state:`present`,values:H(e.agentPrincipal)},{label:g(`activity.runInspector.facts.runtimeInstance`),state:e.runtimeInstance.state,values:[{label:g(`activity.runInspector.values.kind`),value:e.runtimeInstance.kind},{label:g(`activity.runInspector.values.runtimeReference`),value:e.runtimeInstance.runtimeRef,mono:!0}]},...e.applicableGrants.length===0?[{label:g(`activity.runInspector.facts.applicableGrants`),state:`absent`,reason:g(`activity.runInspector.reasons.noGrants`)}]:e.applicableGrants.map((e,t)=>({label:g(`activity.runInspector.facts.applicableGrant`,{index:String(t+1)}),state:e.state,values:[{label:g(`activity.runInspector.values.grantReference`),value:e.grantRef,mono:!0}]})),...e.assurance.length===0?[{label:g(`activity.runInspector.facts.assuranceEvidence`),state:`absent`,reason:g(`activity.runInspector.reasons.noAssurance`)}]:e.assurance.map((e,t)=>({label:g(`activity.runInspector.facts.assuranceEvidenceItem`,{index:String(t+1)}),state:`present`,values:[{label:g(`activity.runInspector.values.kind`),value:e.kind},{label:g(`activity.runInspector.values.strength`),value:e.strength},{label:g(`activity.runInspector.values.evidenceReference`),value:e.evidenceRef,mono:!0}]})),{label:g(`activity.runInspector.facts.lineage`),state:i?`present`:`absent`,values:i?[{label:g(`activity.runInspector.values.depth`),value:i.depth},...i.parentRunId?[{label:g(`activity.runInspector.values.parentRunReference`),value:i.parentRunId,mono:!0,href:L({kind:`run`,id:i.parentRunId},t)}]:[],...i.parentExecutionId?[{label:g(`activity.runInspector.values.parentExecutionReference`),value:i.parentExecutionId,mono:!0}]:[],...i.parentContextId?[{label:g(`activity.runInspector.values.parentContextReference`),value:i.parentContextId,mono:!0}]:[],...i.delegationRef?[{label:g(`activity.runInspector.values.delegationReference`),value:i.delegationRef,mono:!0}]:[],...H(i.parentAgentPrincipal)]:[],reason:i?void 0:g(`activity.runInspector.reasons.noLineage`)}]}function bn(e){let t=on(e);switch(t){case`not-found`:return{title:g(`activity.runInspector.diagnostic.notFound.title`),description:g(`activity.runInspector.diagnostic.notFound.description`)};case`expired`:return{title:g(`activity.runInspector.diagnostic.expired.title`),description:g(`activity.runInspector.diagnostic.expired.description`)};case`corrupt`:return{title:g(`activity.runInspector.diagnostic.corrupt.title`),description:g(`activity.runInspector.diagnostic.corrupt.description`)};case`ambiguous`:return{title:g(`activity.runInspector.diagnostic.ambiguous.title`),description:g(`activity.runInspector.diagnostic.ambiguous.description`)};case`unsupported`:return{title:g(`activity.runInspector.diagnostic.unsupported.title`),description:g(`activity.runInspector.diagnostic.unsupported.description`)};case`unknown`:return{title:g(`activity.runInspector.diagnostic.unknown.title`),description:g(`activity.runInspector.diagnostic.unknown.description`)};case`present`:return null}return t}function xn(e,t,n,r){let i=bn(e);if(!i||e.identity.state===`present`)return S;let a=e.identity;return x`
    <div class="run-inspector__result-state" role="status" aria-label=${i.title}>
      <h3>${i.title}</h3>
      <p>${i.description}</p>
      <p>
        ${g(`activity.runInspector.diagnosticReason`)}
        ${B(a.reasonCode,!0)}
      </p>
    </div>
    ${a.state===`ambiguous`?x`
            <ol
              class="run-inspector__candidate-list"
              aria-label=${g(`activity.runInspector.candidates.listLabel`)}
            >
              ${a.candidates.map(e=>x`
                  <li>
                    <span
                      >${g(`activity.runInspector.candidates.recorded`,{date:new Date(e.createdAt).toLocaleString()})}</span
                    >
                    <a
                      href=${L({kind:`execution`,id:e.executionId},t)}
                    >
                      ${g(`activity.runInspector.candidates.executionReference`)}
                      ${B(e.executionId,!0)}
                    </a>
                  </li>
                `)}
            </ol>
            ${e.nextExecutionCursor?x`<div class="run-inspector__pagination">
                    <span>${g(`activity.runInspector.candidates.more`)}</span>
                    <button
                      type="button"
                      class="btn"
                      ?disabled=${n===`loading`}
                      @click=${r}
                    >
                      ${g(n===`loading`?`activity.runInspector.candidates.loadingMore`:`activity.runInspector.candidates.loadMore`)}
                    </button>
                    ${n===`error`?x`<span role="alert">
                            ${g(`activity.runInspector.candidates.loadMoreError`)}
                          </span>`:S}
                  </div>`:S}
          `:S}
    ${ln(a.missingEvidence)}
    ${un(a.remediation)}
  `}function Sn(e,t,n,r,i,a){let o=e.result,s=z(o.coverage.state);return x`
    <div
      class="run-inspector__coverage run-inspector__coverage--${o.coverage.state}"
      role="status"
      aria-label=${g(`activity.runInspector.coverageStatusLabel`,{state:s})}
    >
      <strong>${s}</strong>
      <span>
        ${g(`activity.runInspector.coverage.${sn(o.coverage.state)}.description`)}
      </span>
    </div>
    ${o.identity.state===`present`?x`
            <section
              class="run-inspector__section"
              aria-labelledby="run-inspector-identity-heading"
            >
              <h3 id="run-inspector-identity-heading">
                ${g(`activity.runInspector.identityHeading`)}
              </h3>
              <dl class="run-inspector__facts">
                ${yn(o.identity.context,t).map(vn)}
              </dl>
            </section>
            ${ln(o.coverage.missingEvidence)}
            ${mn(e,n,r,t,i)}
          `:xn(o,t,e.executionPageStatus,a)}
  `}function U(e,t,n={}){return x`
    <div class="run-inspector__panel" role=${n.role??`status`}>
      <h3>${e}</h3>
      <p>${t}</p>
      ${n.action?x`<button type="button" class="btn" @click=${n.action.onClick}>
              ${n.action.label}
            </button>`:S}
    </div>
  `}function Cn(e){let t=e.state,n;switch(t.status){case`empty`:n=U(g(`activity.runInspector.panels.empty.title`),g(`activity.runInspector.panels.empty.description`));break;case`loading`:n=U(t.waitingForGateway?g(`activity.runInspector.panels.waiting.title`):g(`activity.runInspector.panels.loading.title`),t.waitingForGateway?g(`activity.runInspector.panels.waiting.description`):g(`activity.runInspector.panels.loading.description`));break;case`disconnected`:n=U(g(`activity.runInspector.panels.disconnected.title`),g(`activity.runInspector.panels.disconnected.description`));break;case`unauthorized`:n=U(g(`activity.runInspector.panels.unauthorized.title`),g(`activity.runInspector.panels.unauthorized.description`),{role:`alert`});break;case`unsupported`:n=U(g(`activity.runInspector.panels.unsupported.title`),g(`activity.runInspector.panels.unsupported.description`));break;case`error`:n=U(g(`activity.runInspector.panels.error.title`),g(`activity.runInspector.panels.error.description`),{action:t.recovery===`restart`?{label:g(`activity.runInspector.restart`),onClick:e.onRestart}:{label:g(`activity.runInspector.retry`),onClick:e.onRetry},role:`alert`});break;case`ready`:n=Sn(t,e.basePath,e.selector,e.selectorId,e.onLoadMoreDecisions,e.onLoadMoreExecutions)}return x`
    <section
      id="activity-run-panel"
      class="run-inspector"
      aria-label=${g(`activity.runInspector.mode`)}
    >
      <div class="settings-section__header">
        <div>
          <h2 class="settings-section__heading">${g(`activity.runInspector.mode`)}</h2>
          <p class="run-inspector__intro">${g(`activity.runInspector.intro`)}</p>
        </div>
      </div>
      <div class="run-inspector__warning" role="note">
        ${g(`activity.runInspector.bestEffortWarning`)}
      </div>
      ${n}
    </section>
  `}function wn(){return(wn=e((()=>{C(),h(),N(),hn(),R(),M()})))()}function W(e){return JSON.stringify([e.agentId??_e(e.key)?.agentId,e.key])}function Tn(e){return JSON.stringify([e.sessionId,e.updatedAt,e.lastActivityAt,e.activitySummary?.updatedAt])}var En,Dn,On,kn;function An(){return(An=e((()=>{t(),A(),ae(),_(),Lt(),I(),En=1e3,Dn=`sessions.activitySummary.ensure`,On=20,kn=class{get loading(){return this.requestState!==`idle`||this.incomplete}get retrying(){return this.requestState===`retrying`}constructor(e){this.host=e,this.incomplete=!1,this.requestState=`idle`,this.client=null,this.summaryAttempts=new Map,this.summaryRetries=new Set,this.canEnsureSummaries=!1,this.filters=null,this.pendingChanges=[],this.changesOverflowed=!1,this.normalizedLocation=``,this.observesPageLifecycle=typeof document<`u`&&typeof globalThis.addEventListener==`function`,this.pageActive=!this.observesPageLifecycle||document.visibilityState!==`hidden`,this.eventRefresh=ke({active:this.pageActive,refresh:()=>this.load(this.client,this.filters,`refresh`)}),this.handlePageLifecycle=e=>{let t=e.type===`pagehide`,n=this.pending!==void 0||this.summaryPending!==void 0;this.pageActive=!t&&document.visibilityState!==`hidden`,this.pageActive||(this.summaryPending?.abort(),this.summaryPending=void 0,this.summaryAttempts.clear(),this.summaryRetries.clear()),this.eventRefresh.setActive(this.pageActive,t||n)},e.addController(this)}hostConnected(){this.updatePageLifecycleListeners(!0),this.observesPageLifecycle&&this.handlePageLifecycle(new Event(`pageshow`))}hostDisconnected(){this.updatePageLifecycleListeners(!1),this.resetQuery()}resetQuery(){this.eventRefresh.reset(),this.pending?.controller.abort(),this.pending=void 0,this.summaryPending?.abort(),this.summaryPending=void 0,this.summaryAttempts.clear(),this.summaryRetries.clear(),this.requestState=`idle`,this.incomplete=!1,this.error=void 0,this.client=null,this.queryKey=void 0,this.result=void 0,this.filters=null,this.pendingChanges.length=0,this.changesOverflowed=!1,this.normalizedLocation=``}retrySummary(e){this.canEnsureSummaries&&e.activitySummary?.canEnsure===!0&&this.result?.sessions.includes(e)&&(this.summaryAttempts.delete(W(e)),this.summaryRetries.add(W(e)),this.ensureSummaries())}needsSummary(e){let t=W(e);return e.activitySummary?.canEnsure===!0&&(this.summaryRetries.has(t)||e.activitySummary.state===`stale`)&&this.summaryAttempts.get(t)!==Tn(e)}async ensureSummaries(){let e=this.client,t=this.queryKey;if(!e||!this.result||!this.canEnsureSummaries||this.filters===`current`||this.summaryPending)return;if(!this.pageActive){this.eventRefresh.schedule();return}let n=new Set(this.result.sessions.filter(e=>e.activitySummary?.canEnsure===!0).map(W));for(let e of new Set([...this.summaryAttempts.keys(),...this.summaryRetries]))n.has(e)||(this.summaryAttempts.delete(e),this.summaryRetries.delete(e));let r=this.result.sessions.filter(e=>this.needsSummary(e));if(r.length===0)return;let i=new AbortController;this.summaryPending=i;let a=()=>this.summaryPending===i&&this.client===e&&this.queryKey===t&&this.canEnsureSummaries&&!i.signal.aborted;try{for(let t=0;t<r.length&&a();t+=On){let n=new Map(this.result.sessions.map(e=>[W(e),e])),o=r.slice(t,t+On).flatMap(e=>{let t=n.get(W(e));return t&&t.sessionId===e.sessionId&&this.needsSummary(t)?[t]:[]});if(o.length!==0){for(let e of o){let t=W(e);this.summaryAttempts.set(t,Tn(e)),this.summaryRetries.delete(t)}try{let t=await e.request(Dn,{sessions:o.map(e=>({key:e.key,...e.agentId?{agentId:e.agentId}:{}}))},{signal:i.signal});if(!a()||!this.result)return;let n=new Map(t.sessions.map(e=>[W(e),e.activitySummary]));this.result={...this.result,sessions:this.result.sessions.map(e=>o.includes(e)&&n.has(W(e))?{...e,activitySummary:n.get(W(e))}:e)}}catch{if(!a()||!this.result)return;this.result={...this.result,sessions:this.result.sessions.map(e=>o.includes(e)?{...e,activitySummary:{...e.activitySummary,state:`unavailable`}}:e)}}this.host.requestUpdate()}}}finally{this.summaryPending===i&&(this.summaryPending=void 0,this.host.requestUpdate(),this.ensureSummaries())}}personLabel(e,t){return this.result?.people?.find(t=>t.identity.id===e)?.label??t.find(t=>t.identity?.id===e)?.name}canonicalLocation(e,t,n){if(!this.filters||this.filters===`current`||!this.filters.personId||!this.result?.involvingProfileId||this.loading)return null;let r=this.result.involvingProfileId,i=Gt(e,r,this.personLabel(r,n),t);if(!i)return this.normalizedLocation=``,null;let a=`${e.pathname}${e.search}${e.hash}`;return this.normalizedLocation===a?null:(this.normalizedLocation=a,i)}locationForFilters(e,t,n,r){let i=Wt(e,n,e.personId?this.personLabel(e.personId,r):void 0),a=this.result?.involvingProfileId??(this.filters===`current`?void 0:this.filters?.personId);return e.personId&&e.personId===a&&(i.pathname=Ye(t.pathname,n)?t.pathname:Ke(e.personId,n,this.personLabel(e.personId,r),32).pathname),i}updatePageLifecycleListeners(e){if(!this.observesPageLifecycle)return;let t=e?`addEventListener`:`removeEventListener`;document[t](`visibilitychange`,this.handlePageLifecycle),globalThis[t](`pagehide`,this.handlePageLifecycle),globalThis[t](`pageshow`,this.handlePageLifecycle)}invalidate(e){if(this.client&&this.filters){if(this.filters===`current`){let t=Ft(e);if(t){if(this.result){let e=It(this.result,[t]);this.result=e.result,this.incomplete||=e.requiresRefresh,this.host.requestUpdate()}this.pending&&(this.pendingChanges.length<En?this.pendingChanges.push(t):this.changesOverflowed=!0)}}this.eventRefresh.schedule()}}load(e,t,n=`query`,r=this.canEnsureSummaries){if(this.canEnsureSummaries=r,r||(this.summaryPending?.abort(),this.summaryPending=void 0,this.summaryAttempts.clear(),this.summaryRetries.clear()),!e||!t)return this.resetQuery(),this.host.requestUpdate(),Promise.resolve();let i=t===`current`?{activeOnly:!0,archived:`all`,includeGlobal:!0,includeUnknown:!0,includeDerivedTitles:!0,limit:100}:{archived:`all`,includeGlobal:!0,includeUnknown:!0,includePeople:!0,excludeSubagents:!0,includeActivitySummary:!0,includeDerivedTitles:!0,sortBy:`activity`,limit:100,...t.personId?{involvingProfileId:t.personId}:{},...t.query?{search:t.query}:{},...t.time===`all`?{}:{activeMinutes:t.time===`24h`?1440:t.time===`7d`?10080:43200}},a=JSON.stringify(i),s=this.client===e&&this.queryKey===a;if(s&&this.pending&&n!==`retry`)return n===`refresh`&&this.eventRefresh.schedule(),this.pending.completion.promise;if(n===`query`&&s)return this.ensureSummaries(),Promise.resolve();this.pending?.controller.abort(),this.eventRefresh.absorb();let c={controller:new AbortController,completion:o()};return this.pending=c,this.client=e,this.queryKey=a,this.filters=t,this.pendingChanges.length=0,this.changesOverflowed=!1,this.requestState=n===`retry`?`retrying`:`loading`,this.error=void 0,s||(this.summaryPending?.abort(),this.summaryPending=void 0,this.summaryAttempts.clear(),this.summaryRetries.clear(),this.result=void 0,this.incomplete=!1),this.host.requestUpdate(),e.request(`sessions.list`,i,{signal:c.controller.signal}).then(e=>{if(this.pending===c){if(t===`current`){let t=It(e,this.pendingChanges);this.incomplete=this.changesOverflowed||t.requiresRefresh,this.incomplete&&this.eventRefresh.schedule(),!this.changesOverflowed&&t.canPublish&&(this.result=t.result)}else this.result=e,this.ensureSummaries()}}).catch(e=>{this.pending===c&&!c.controller.signal.aborted&&(t===`current`&&(this.result=void 0,this.incomplete=!1),this.error=e instanceof Error?e.message:String(e))}).finally(()=>{this.pending===c&&(this.pending=void 0,this.pendingChanges.length=0,this.requestState=`idle`,this.host.requestUpdate()),c.completion.resolve()}),c.completion.promise}}})))()}function jn(e){let t=i(e);if(t?.found!==!0)return{status:`absent`};let n=e=>e?.trim()?e:void 0,r=i(t.attribution),a=n(u(r,`text`)),o=n(u(r,`url`)),s=n(u(t,`city`)),c=n(u(t,`region`)),l=n(u(t,`country`)),d={...s?{city:s}:{},...c?{region:c}:{},...l?{country:l}:{},...a&&o?{attribution:{text:a,url:o}}:{}};return Object.keys(d).length>0?{status:`located`,location:d}:{status:`absent`}}async function Mn(e){let{origin:t}=oe();try{let n=await ce(`${t??``}/plugins/geolocation/lookup?ip=${encodeURIComponent(e)}`,Pn);return n.ok?jn(await n.json()):{status:`unavailable`}}catch{return{status:`unavailable`}}}function Nn(e){let t=G.get(e);if(t)return t;let n=Mn(e).then(t=>(t.status===`unavailable`&&G.get(e)===n&&G.delete(e),t));if(G.size>=Fn){let e=G.keys().next();e.done||G.delete(e.value)}return G.set(e,n),n}var Pn,Fn,G;function In(){return(In=e((()=>{te(),Pn=15e3,Fn=256,G=new Map,ue(()=>G.clear())})))()}var Ln,K;function Rn(){return(Rn=e((()=>{C(),T(),In(),b(),O(),Ln=[5e3,15e3,45e3],K=class extends ne{constructor(...e){super(...e),this.location=null,this.retryAttempt=0}disconnectedCallback(){super.disconnectedCallback(),this.clearRetry()}willUpdate(){let e=this.ip?.trim();e&&e!==this.requestedIp&&(this.clearRetry(),this.requestedIp=e,this.retryAttempt=0,this.location=null,this.resolve(e))}clearRetry(){this.retryTimer!==void 0&&(clearTimeout(this.retryTimer),this.retryTimer=void 0)}resolve(e){Nn(e).then(t=>{if(this.requestedIp!==e)return;if(t.status===`located`){this.location=t.location;return}if(t.status===`absent`)return;let n=Ln[this.retryAttempt];n!==void 0&&(this.retryAttempt+=1,this.retryTimer=setTimeout(()=>{this.retryTimer=void 0,this.requestedIp===e&&this.isConnected&&this.resolve(e)},n))})}render(){let e=[this.location?.city,this.location?.region??this.location?.country].filter(Boolean).join(`, `);if(!e)return S;let t=this.location?.attribution;return x`<span class="activity-feed__device-location"
      >${e}${t?x`<a
              class="activity-feed__device-attribution"
              href=${t.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label=${t.text}
              title=${t.text}
              >${D.info}</a
            >`:S}</span
    >`}},f([E({attribute:!1})],K.prototype,`ip`,void 0),f([w()],K.prototype,`location`,void 0),globalThis.customElements&&(customElements.get(`openclaw-ip-location`)||customElements.define(`openclaw-ip-location`,K))})))()}function zn(e){return x`${e.additions===void 0?S:x`<span class="activity-feed__additions">+${e.additions.toLocaleString()}</span>`}${e.deletions===void 0?S:x`<span class="activity-feed__deletions">−${e.deletions.toLocaleString()}</span>`}`}function Bn(e){return{url:e.url,title:e.title,subtitle:e.owner+`/`+e.repo+` #`+e.number,badge:{label:g(`activity.git.`+e.state),tone:e.state===`merged`?`accent`:e.state===`open`?`positive`:e.state===`closed`?`negative`:`neutral`},author:e.author?.login,authorUrl:e.author?.login?`https://github.com/`+encodeURIComponent(e.author.login):void 0,metadata:[...e.additions===void 0?[]:[{label:``,value:`+`+e.additions,tone:`positive`}],...e.deletions===void 0?[]:[{label:``,value:`−`+e.deletions,tone:`negative`}]]}}function Vn(e){let t={open:D.gitPullRequest,draft:D.gitPullRequestDraft,merged:D.gitMerge,closed:D.gitPullRequestClosed}[e.state];return x`<a
    class="activity-feed__pr"
    data-state=${e.state}
    href=${e.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${g(`activity.git.pullRequest`,{repository:`${e.owner}/${e.repo}`,number:String(e.number),title:e.title,state:g(`activity.git.${e.state}`)})}
  >
    <span class="activity-feed__git-icon" aria-hidden="true">${t}</span>
    <span class="activity-feed__git-label">${e.repo}#${e.number}</span>
    ${zn(e)}
  </a>`}var q;function Hn(){return(Hn=e((()=>{C(),T(),Ze(),Qe(),O(),h(),N(),at(),b(),y(),M(),q=class extends re{constructor(...e){super(...e),this.sessionKey=``,this.agentId=``,this.subscriptions=new Te(this).effect(()=>this.context?.gateway,e=>{let t=ct(e),n=t.subscribe(()=>this.requestUpdate()),r=e.subscribe(()=>this.requestUpdate());return()=>{t.unwatch(this),n(),r()}})}willUpdate(){this.isConnected&&ct(this.context.gateway).watch(this,[this.sessionKey],{foreground:!0})}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}render(){let e=this.context.gateway,t=ct(e).get(this.sessionKey);if(!t)return S;let n=t.pullRequests.some(e=>e.state===`open`||e.state===`draft`)?void 0:t.branch;if(!n&&t.pullRequests.length===0)return S;let r=t.status!==`ready`||e.snapshot.phase!==`connected`;return x`<openclaw-link-reader-hovercard-provider
      .client=${e.snapshot.phase===`connected`?e.snapshot.client:null}
      .readers=${Ue(e.snapshot)}
      .agentId=${this.agentId}
      .previewSeeds=${t.pullRequests.map(Bn)}
    >
      <div class="activity-feed__git">
        ${n?x`<span
                class="activity-feed__branch"
                title=${g(`activity.git.branchDiff`,{branch:n.branch})}
              >
                <span class="activity-feed__git-icon" aria-hidden="true">${D.gitBranch}</span>
                <span class="activity-feed__git-label">${n.branch}</span>
                ${zn(n)}
              </span>`:S}
        ${t.pullRequests.map(Vn)}
        ${r?x`<span
                class="activity-feed__git-stale"
                role="img"
                aria-label=${g(`activity.git.stale`)}
                title=${g(`activity.git.stale`)}
                >${D.alertTriangle}</span
              >`:S}
      </div>
    </openclaw-link-reader-hovercard-provider>`}},f([E({attribute:!1})],q.prototype,`context`,void 0),f([E()],q.prototype,`sessionKey`,void 0),f([E()],q.prototype,`agentId`,void 0),customElements.get(`openclaw-activity-session-git`)||customElements.define(`openclaw-activity-session-git`,q)})))()}function Un(e,t){let n=Gn.get(e);return(!n||n.hello!==t)&&(n={hello:t,epoch:++Kn,entries:new Map,running:0,queue:[]},Gn.set(e,n)),n}async function Wn(e,t,n){if(e.running>=2){let n=await new Promise(n=>{let r=e.queue.findIndex(e=>e.key===t),i=e.queue[r];i?(e.queue[r]={key:t,admit:n},i.admit(`superseded`)):e.queue.length<128?e.queue.push({key:t,admit:n}):n(`full`)});if(n!==`run`)return n}else e.running++;try{return await n(),`run`}finally{let t=e.queue.shift();t?t.admit(`run`):e.running--}}var Gn,Kn,J;function qn(){return(qn=e((()=>{C(),T(),Be(),h(),N(),b(),y(),yt(),wt(),bt(),M(),Gn=new WeakMap,Kn=0,J=class extends re{constructor(...e){super(...e),this.sessionKey=``,this.agentId=``,this.revision=0,this.visible=!1,this.displayedImages=[],this.key=``,this.boundImageIdentity=``,this.lightbox=null,this.imageRequest=0,this.refresh=()=>this.requestUpdate(),this.subscriptions=new Te(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)),this.closeImage=()=>{this.imageRequest++,this.lightbox?.release?.(),this.lightbox=null,this.requestUpdate()},this.load=()=>{let e=this.context.gateway,{client:t,hello:n}=e.snapshot,r=this.owner,i=this.entry,a=this.key,o=this.sessionKey,s=this.agentId;if(!t||!r||!i||i.pending)return;let c=()=>this.isConnected&&this.visible&&this.owner===r&&this.key===a&&e.snapshot.client===t&&e.snapshot.hello===n&&e.snapshot.phase===`connected`;i.error&&(i.cursor=void 0,i.images=[]),i.error=!1,i.pending=Wn(r,JSON.stringify([s,o]),async()=>{try{for(let e=0;e<3&&i.images.length<4&&c();e++){let e=await t.request(`artifacts.list`,{sessionKey:o,agentId:s,type:`image`,limit:4-i.images.length,...i.cursor?{cursor:i.cursor}:{}});if(!c())return;i.loaded=!0,i.cursor=e.nextCursor,i.omitted||=e.omittedOversized;for(let t of e.artifacts)t.image&&!i.images.some(e=>e.url===t.image?.url)&&i.images.push({url:t.image.url,artifactId:t.source===`session-transcript-preview`?void 0:t.id,alt:t.title});if(!i.cursor)break}}catch{c()&&(i.loaded=!0,i.error=!0)}}).then(e=>{e!==`run`&&c()&&(i.loaded=!0,i.error=e===`full`)}).finally(()=>{i.pending=void 0,this.requestUpdate()}),this.requestUpdate()}}connectedCallback(){super.connectedCallback(),!(typeof IntersectionObserver>`u`)&&(this.observer=new IntersectionObserver(e=>{this.visible=e.some(e=>e.isIntersecting),this.requestUpdate()},{rootMargin:`200px`}),this.observer.observe(this))}disconnectedCallback(){this.observer?.disconnect(),this.visible=!1,this.subscriptions.clear(),this.closeImage(),xt(this.refresh),super.disconnectedCallback()}get imageIdentity(){return JSON.stringify([this.agentId,this.sessionKey,this.session?.sessionId,Ct(this.session)])}willUpdate(){let{client:e,hello:t,phase:n}=this.context.gateway.snapshot,r=e&&n===`connected`?Un(e,t):void 0,i=JSON.stringify([this.agentId,this.sessionKey,this.session?.sessionId,this.revision]),a=this.imageIdentity;if((r!==this.owner||a!==this.boundImageIdentity)&&(this.displayedImages=[],this.closeImage(),xt(this.refresh),this.boundImageIdentity=a),(r!==this.owner||i!==this.key)&&(this.owner=r,this.key=i,this.entry=void 0,r&&(this.entry=r.entries.get(i),!this.entry&&(this.entry={images:[],loaded:!1},r.entries.set(i,this.entry),r.entries.size>128)))){let e=r.entries.keys().next().value;e&&r.entries.delete(e)}this.visible&&this.entry&&!this.entry.loaded&&!this.entry.pending&&this.load(),this.entry?.pending&&this.observedPending!==this.entry.pending&&(this.observedPending=this.entry.pending,this.observedPending.then(this.refresh)),this.entry?.loaded&&!this.entry.pending&&(!this.entry.error||this.displayedImages.length===0)&&(this.displayedImages=this.entry.images.slice(0,4))}render(){let e=this.entry,t=this.owner,n=this.context.gateway,{client:r,hello:i}=n.snapshot;if(!e||!t||!r)return S;let a=this.displayedImages.length>0||e.error||e.cursor||e.omitted,o=this.imageIdentity,s=this.agentId;return x`
      ${a?x`<div class="activity-feed__media">
              ${Tt(this.displayedImages,{sessionKey:this.sessionKey,agentId:this.agentId,connectionEpoch:t.epoch,policyKey:Ct(this.session),resourceBasePath:this.context.resourceBasePath,authToken:$e({hello:i,settings:{token:n.connection.token},password:n.connection.password}),onRequestUpdate:this.refresh,onRequestOpenImage:()=>++this.imageRequest,onOpenImage:(e,a)=>{if(!this.isConnected||this.owner!==t||this.imageIdentity!==o||n.snapshot.client!==r||n.snapshot.hello!==i||n.snapshot.phase!==`connected`||a!==this.imageRequest){e.release?.();return}this.lightbox?.release?.(),this.lightbox=e,this.requestUpdate()},resolveArtifactDownload:async e=>{let t=await r.request(`artifacts.download`,{...e,agentId:s});return n.snapshot.client===r&&n.snapshot.hello===i&&n.snapshot.phase===`connected`&&t.url?{url:t.url,expiresAt:t.expiresAt}:null}})}
              ${e.error?x`<span role="status">${g(`activity.images.failed`)}</span><button class="btn btn--sm" @click=${this.load}>${g(`common.retry`)}</button>`:S}
              ${e.cursor&&e.images.length<4&&!e.error?x`<button class="btn btn--sm" ?disabled=${!!e.pending} @click=${this.load}>${e.pending?g(`common.loading`):g(`activity.images.older`)}</button>`:S}
              ${e.omitted?x`<span class="activity-feed__media-note">${g(`activity.images.incomplete`)}</span>`:S}
            </div>`:S}
      ${St(this.lightbox,this.closeImage)}
    `}},f([E({attribute:!1})],J.prototype,`context`,void 0),f([E()],J.prototype,`sessionKey`,void 0),f([E()],J.prototype,`agentId`,void 0),f([E({type:Number})],J.prototype,`revision`,void 0),f([E({attribute:!1})],J.prototype,`session`,void 0),customElements.get(`openclaw-activity-session-media`)||customElements.define(`openclaw-activity-session-media`,J)})))()}function Jn(e,t){let n=e.activitySummary,r=n?.state===`current`&&!n.text?`missing`:n?.state??`missing`,i=r===`updating`,a=i?``:r===`stale`?g(n?.text?`activityFeed.recapStale`:`activityFeed.recapMissing`):r===`unavailable`?g(n?.text?`activityFeed.recapRefreshFailed`:`activityFeed.recapUnavailable`):r===`missing`?g(`activityFeed.recapMissing`):``;return x`<div
    class="activity-feed__recap"
    data-activity-recap=${e.key}
    data-state=${r}
    aria-busy=${String(i)}
    aria-label=${g(`activityFeed.recap`)}
    title=${n?.updatedAt?g(`activityFeed.recapUpdated`,{time:he(n.updatedAt,{fallback:``})}):S}
  >
    ${n?.text?x`<p class="activity-feed__recap-text">${n.text}</p>`:i?x`<div class="activity-feed__recap-skeleton" aria-hidden="true">
              <div class="skeleton skeleton-line skeleton-line--long"></div>
              <div class="skeleton skeleton-line skeleton-line--medium"></div>
            </div>`:S}
    ${i?x`<span class="sr-only" role="status">${g(`activityFeed.recapUpdating`)}</span>`:S}
    ${a?x`<div class="activity-feed__recap-feedback">
            <span>${a}</span>
            ${t&&n?.canEnsure===!0&&(r===`unavailable`||r===`stale`)?x`<button class="activity-feed__recap-retry" @click=${()=>t(e)}>
                    ${g(`activityFeed.recapRetry`)}
                  </button>`:S}
          </div>`:S}
  </div>`}function Yn(){return(Yn=e((()=>{C(),h(),v()})))()}function Y(e){return!e.name&&!e.email&&j(e)===e.id}function Xn(e){return Y(e)&&e.id.length>8?`${e.id.slice(0,8)}…`:j(e)}function Zn(e,t=!1){return Y(e)?x`<span
      class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
      aria-hidden="true"
      >${D.users}</span
    >`:x`<span class="activity-feed__person-avatar">
    <openclaw-viewer-avatar
      .identity=${{type:`profile`,id:e.id}}
      .user=${e}
      .markAsViewer=${!1}
      variant="footer"
    ></openclaw-viewer-avatar>
    ${t&&(e.entries?.length??0)>0?x`<span
            class="activity-feed__presence-dot"
            aria-label=${g(`activityFeed.online`)}
          ></span>`:S}
  </span>`}function Qn(e,t,n){e.currentTarget instanceof Element&&e.currentTarget.closest(`wa-popover`)?.removeAttribute(`open`),t.onFiltersChange({...t.filters,personId:n})}function $n(e,t){e.currentTarget instanceof Element&&e.currentTarget.parentElement?.querySelector(`.activity-feed__people-trigger`)?.setAttribute(`aria-expanded`,String(t))}function er(e,t){return x`<button
    type="button"
    class="session-menu__item activity-feed__people-row"
    data-activity-person=${e.id}
    aria-pressed=${String(t.filters.personId===e.id)}
    @click=${n=>Qn(n,t,e.id)}
  >
    ${Zn(e,!0)}
    <span class="activity-feed__people-copy">
      <span class="activity-feed__people-name">${Xn(e)}</span>
    </span>
    <span class="activity-feed__people-count">${e.count}</span>
  </button>`}function tr(e,t,n,r){let i=t.slice(0,3),a=t.length-i.length,o=t.filter(e=>!Y(e)),s=t.filter(Y);return x`<div class="activity-feed__people-control">
    <button
      id="activity-feed-people-trigger"
      type="button"
      class="btn btn--sm activity-feed__people-trigger"
      aria-label=${g(`activityFeed.peopleButtonLabel`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${n?x`${Zn(n)}<span class="activity-feed__selected-person"
                >${Xn(n)}</span
              >`:x`<span class="activity-feed__facepile" aria-hidden="true">
              ${i.length>0?i.map(e=>Zn(e)):x`<span
                      class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
                      >${D.users}</span
                    >`}
              ${a>0?x`<span class="viewer-avatar viewer-avatar--overflow">+${a}</span>`:S}
            </span>`}
    </button>
    ${n?x`<button
            type="button"
            class="btn btn--sm activity-feed__people-clear"
            aria-label=${g(`activityFeed.clearPersonFilter`)}
            @click=${()=>e.onFiltersChange({...e.filters,personId:null})}
          >
            ×
          </button>`:S}
    <wa-popover
      class="activity-feed__people-popover"
      for="activity-feed-people-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>$n(e,!0)}
      @wa-hide=${e=>$n(e,!1)}
    >
      <div class="activity-feed__people-panel" aria-label=${g(`activityFeed.peopleButtonLabel`)}>
        <button
          type="button"
          class="session-menu__item activity-feed__people-row"
          data-activity-person=""
          aria-pressed=${String(e.filters.personId===null)}
          @click=${t=>Qn(t,e,null)}
        >
          <span
            class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
            aria-hidden="true"
            >${D.users}</span
          >
          <span class="activity-feed__people-copy">
            <span class="activity-feed__people-name">${g(`activityFeed.everyone`)}</span>
          </span>
          <span class="activity-feed__people-count">${r}</span>
        </button>
        ${o.map(t=>er(t,e))}
        ${s.length>0?x`<div class="session-menu__separator" role="separator"></div>
                <div class="activity-feed__people-group-label">
                  ${g(`activityFeed.unresolvedIdentities`)}
                </div>
                <div data-activity-unresolved>
                  ${s.map(t=>er(t,e))}
                </div>`:S}
      </div>
    </wa-popover>
  </div>`}function nr(e,t=Date.now()){if(e===null)return g(`activityFeed.unknownDate`);let n=new Date(t),r=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),i=new Date(r);return i.setDate(i.getDate()-1),e===r?g(`activityFeed.today`):e===i.getTime()?g(`activityFeed.yesterday`):new Intl.DateTimeFormat(void 0,{day:`numeric`,month:`long`,year:`numeric`}).format(e)}function X(e,t,n){let r=_e(t.key)?.agentId??t.agentId??pe(e),i=me(t),a=De(t.key,ee({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}))?be({face:i,sessionKey:t.key,fallbackAgentId:t.key===`global`?r:pe(e),basePath:e.basePath,row:t,mainKey:fe({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello})}):null,o=a?Ne`a`:Ne`div`,s=qt(t),c=j(s),l=P(t),u=t.observerDigest?.runId,d=t.hasActiveRun===!0&&u&&t.activeRunIds?.includes(u)?u:void 0,f=d?t.observerDigest?.headline.trim():``,p=t.channel?g(`activityFeed.channelLabel`,{value:t.channel}):null,m=t.kind!==`global`||!!t.agentId,h=t.createdVia===`cron`?g(`activityFeed.automation`):null;return Ie`<div class="activity-feed__session-row">
    <${o}
      class="activity-feed__session"
      data-activity-session=${t.key}
      href=${a?.href??S}
      @click=${t=>{a&&ge(t)&&(t.preventDefault(),e.navigate(i,a.options))}}
    >
      <span class="activity-feed__session-avatar">
        ${t.hasActiveRun===!0?x`<span
                class="activity-feed__presence-dot activity-feed__run-dot"
                aria-hidden="true"
              ></span>`:S}
        <openclaw-viewer-avatar
          .identity=${t.owner?.actor.identity??t.createdActor?.identity}
          .user=${s}
          .markAsViewer=${!1}
          variant="footer"
        ></openclaw-viewer-avatar>
      </span>
      <span class="activity-feed__session-main">
        <span class="activity-feed__session-title">${ie(t.key,t)}</span>
        <span class="activity-feed__session-meta">
          ${f?x`<span
                  class="activity-feed__session-headline"
                  data-health=${t.observerDigest?.health??S}
                  >${f}</span
                >`:x`<span>${c}</span>`}${h?x`<span class="activity-feed__session-source" data-activity-created-via="cron"
                  >· ${h}${p||m?` ·`:``}</span
                >`:S}${m?x`<span class="activity-feed__session-scope"
                  >${jt(r)}</span
                >`:S}${p?x`<span class="activity-feed__session-scope">${p}</span>`:S}
        </span>
      </span>
      <span class="activity-feed__session-time">
        ${f?x`<span class="activity-feed__session-owner">${c}</span>`:S}
        ${l>0?x`<span>${he(l,{fallback:``})}</span>`:S}
      </span>
    </${o}>
    ${Jn(t,n)}
    <openclaw-activity-session-git
      .context=${e}
      .sessionKey=${de(t.key,r)}
      .agentId=${r}
    ></openclaw-activity-session-git>
    <openclaw-activity-session-media
      .context=${e}
      .sessionKey=${de(t.key,r)}
      .agentId=${r}
      .revision=${t.updatedAt??0}
      .session=${t}
    ></openclaw-activity-session-media>
    ${d?x`<a
            class="activity-feed__inspect-run"
            href=${tn(d,e.basePath)}
            >${g(`activityFeed.inspectRun`)}</a
          >`:S}
  </div>`}function rr(e,t){if(e.filters.query||e.filters.personId)return t.sessions.map(t=>X(e.context,t,e.onSummaryRetry));let n=t.sessions.filter(e=>e.hasAutomation===!0);if(n.length<2)return t.sessions.map(t=>X(e.context,t,e.onSummaryRetry));let r=e.expandedAutomationDays.has(t.key);return x`
    ${t.sessions.filter(e=>e.hasAutomation!==!0).map(t=>X(e.context,t,e.onSummaryRetry))}
    <button
      type="button"
      class="activity-feed__session activity-feed__automation-group"
      data-activity-automation-group=${t.key}
      aria-expanded=${String(r)}
      @click=${()=>e.onAutomationDayToggle(t.key)}
    >
      <span class="activity-feed__automation-group-icon" aria-hidden="true">${D.clock}</span>
      <span>${g(`activityFeed.automationGroup`,{count:String(n.length)})}</span>
      <span class="activity-feed__automation-group-chevron" aria-hidden="true"
        >${D.chevronRight}</span
      >
    </button>
    ${r?n.map(t=>X(e.context,t,e.onSummaryRetry)):S}
  `}function ir(e,t,n){let r=(t.entries?.length??0)>0,i=r&&ut(t),a=g(r?i?`activityFeed.idle`:`activityFeed.online`:`activityFeed.offline`),o=t.entries??[],s=Zt(t,n);return x`
    <section class="activity-feed__identity" data-activity-identity=${t.id}>
      <div class="activity-feed__identity-main">
        <openclaw-viewer-avatar
          .identity=${{type:`profile`,id:t.id}}
          .user=${t}
          .markAsViewer=${!1}
          variant="profile"
        ></openclaw-viewer-avatar>
        <div class="activity-feed__identity-copy">
          <h2>${j(t)}</h2>
          ${t.email?x`<p>${t.email}</p>`:S}
        </div>
        ${mt({kind:r?i?`warn`:`ok`:`muted`,label:a})}
      </div>
      ${o.length>0?x`<div class="activity-feed__devices">
              ${o.map(e=>{let t=[e.deviceFamily,e.platform,e.ip,e.timeZone].filter(Boolean).join(` · `);return x`<div class="activity-feed__device">
                  <span class="activity-feed__device-name"
                    >${e.host??g(`activityFeed.unknownDevice`)}</span
                  >
                  ${t?x`<span>${t}</span>`:S}
                  ${e.ip?x`<openclaw-ip-location .ip=${e.ip}></openclaw-ip-location>`:S}
                  ${e.lastInputSeconds===void 0?S:x`<span
                          >${g(`activityFeed.lastInput`,{time:Ce(e.lastInputSeconds*1e3,{suffix:!1})})}</span
                        >`}
                </div>`})}
            </div>`:S}
      <div class="activity-feed__viewing">
        <h3>${g(`activityFeed.viewingNow`)}</h3>
        ${s.length>0?x`<div class="activity-feed__viewing-list">
                ${s.map(t=>X(e,t))}
              </div>`:x`<p class="activity-feed__empty-note">${g(`activityFeed.notViewing`)}</p>`}
      </div>
    </section>
  `}function ar(){return x`<section class="activity-feed__loading" aria-busy="true">
    <span class="sr-only" role="status">${g(`common.loading`)}</span>
    <div class="activity-feed__sessions" aria-hidden="true">
      ${Array.from({length:4},()=>x`
          <div class="activity-feed__session-row">
            <div class="activity-feed__session">
              <span class="skeleton activity-feed__loading-avatar"></span>
              <div class="activity-feed__session-main">
                <div class="skeleton skeleton-line skeleton-line--medium"></div>
                <div class="skeleton skeleton-line activity-feed__loading-meta"></div>
              </div>
            </div>
            <div class="activity-feed__recap activity-feed__recap-skeleton">
              <div class="skeleton skeleton-line skeleton-line--long"></div>
              <div class="skeleton skeleton-line skeleton-line--medium"></div>
            </div>
          </div>
        `)}
    </div>
  </section>`}function or(e){let t=Xt(e.result),n=new Map(e.presenceViewers.flatMap(e=>e.identity?[[e.identity.id,e]]:[])),r=e.filters.personId?n.get(e.filters.personId)??t.people.find(t=>t.id===e.filters.personId)??null:null,i=t.people.map(e=>{let t=n.get(e.id);return t?{...e,...t,count:e.count}:e}),a=e.filters.personId?i.find(t=>t.id===e.filters.personId)??r:null;return x`
    <div class="activity-feed">
      <div class="activity-feed__toolbar">
        <label class="data-table-search activity-feed__search">
          ${D.search}
          <input
            type="search"
            .value=${e.filters.query}
            placeholder=${g(`activityFeed.searchPlaceholder`)}
            @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onFiltersChange({...e.filters,query:t.currentTarget.value})}}
          />
        </label>
        ${pt({mode:`buttons`,className:`activity-feed__time-filter`,value:e.filters.time,ariaLabel:g(`activityFeed.time`),options:Qt.map(e=>({value:e,label:g(Z[e]),ariaLabel:g(Z[e]),compactLabel:e===`all`?g(Z[e]):e})),onChange:t=>e.onFiltersChange({...e.filters,time:t}),onReselect:t=>e.onFiltersChange({...e.filters,time:t})})}
        ${tr(e,i,a,t.timeCount)}
      </div>
      <div class="activity-feed__feedback">
        <span role=${e.error?`alert`:`status`} title=${e.error??S}>
          ${e.error??(e.retrying?g(`common.refreshing`):S)}
        </span>
        ${e.error||e.retrying?x`<button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRetry}>
                ${g(`common.retry`)}
              </button>`:S}
      </div>
      <div class="activity-feed__main">
        ${e.loading&&!e.result?ar():S}
        ${e.result?.peopleIncomplete?x`<p role="status">${g(`activityFeed.partialHistory`)}</p>`:S}
        ${e.result&&e.filters.personId?r?ir(e.context,r,t.sessions):x`<section class="activity-feed__not-found" role="status">
                  <h2>${g(`activityFeed.notFoundTitle`)}</h2>
                  <p>${g(`activityFeed.notFoundDescription`)}</p>
                </section>`:S}
        ${e.result&&(!e.filters.personId||r)?x`
                <div class="activity-feed__summary">
                  <h2>${g(`activityFeed.sessions`)}</h2>
                  <span
                    >${g(`activityFeed.showing`,{shown:String(t.sessions.length),total:String(t.matchedCount)})}</span
                  >
                </div>
                ${t.days.length>0?t.days.map(t=>x`<section class="activity-feed__day">
                          <h3>${nr(t.timestamp)}</h3>
                          <div class="activity-feed__sessions">
                            ${rr(e,t)}
                          </div>
                        </section>`):x`<section class="activity-feed__empty" role="status">
                        ${g(`activityFeed.noSessions`)}
                      </section>`}
              `:S}
      </div>
    </div>
  `}var Z;function sr(){return(sr=e((()=>{C(),Me(),Mt(),O(),Rn(),ht(),Ot(),vt(),h(),v(),ot(),Ae(),ve(),_(),Hn(),qn(),R(),Yn(),I(),Z={"24h":`activityFeed.time24h`,"7d":`activityFeed.time7d`,"30d":`activityFeed.time30d`,all:`activityFeed.timeAll`}})))()}function cr(e){return xe(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function lr(e){return!Number.isFinite(e)||e<0?g(`common.na`):dt(e)??`0ms`}function ur(e){return g(`activity.status.${e}`)}function dr(e){return e===1?g(`activity.argumentHiddenOne`):g(`activity.argumentsHidden`,{count:String(e)})}function fr(e){return e.entryKind===`answer_candidate`?g(`activity.answerCandidate.${e.candidateStatus??`candidate`}`):dr(e.hiddenArgumentCount)}function pr(e){return e.entryKind===`answer_candidate`?g(`activity.answerCandidate.title`):e.toolName}function mr(e,t){return!t||m([e.toolName,pr(e),e.candidateStatus,e.status,e.summary,fr(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t)}function hr(e){return r(e.map(e=>e.toolName))}function gr(e){let t=m(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:mr(n,t))}function _r(e,t){return x`
    <label class="activity-status-filter">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${n=>e.onStatusToggle(t,n.target.checked)}
      />
      <span>${ur(t)}</span>
    </label>
  `}function vr(e,t){e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,String(t))}function yr(e,t){let n=!!e.toolFilter;return x`
    <button
      id="activity-live-filter-trigger"
      type="button"
      class="btn btn--sm activity-live-filter-trigger ${n?`active`:``}"
      title=${g(`activity.filters`)}
      aria-label=${g(`activity.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${D.listFilter}
    </button>
    <wa-popover
      class="activity-live-filter-popover"
      for="activity-live-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>vr(e,!0)}
      @wa-hide=${e=>vr(e,!1)}
    >
      <div class="activity-live-filter-popover__panel">
        <label class="field">
          <span>${g(`activity.toolFilter`)}</span>
          <select
            class="settings-select"
            aria-label=${g(`activity.toolFilter`)}
            .value=${e.toolFilter}
            @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.onToolFilterChange(t.currentTarget.value)}}
          >
            <option value="">${g(`activity.allTools`)}</option>
            ${t.map(e=>x`<option value=${e}>${e}</option>`)}
          </select>
        </label>
      </div>
    </wa-popover>
  `}function br(e,t){return x`
    <div class="activity-live-toolbar">
      <div class="activity-feed__search activity-live-search">
        <span aria-hidden="true">${D.search}</span>
        <input
          class="settings-input"
          type="search"
          aria-label=${g(`activity.search`)}
          .value=${e.filterText}
          placeholder=${g(`activity.searchPlaceholder`)}
          @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onFilterTextChange(t.currentTarget.value)}}
        />
      </div>
      <span role="group" aria-label=${g(`activity.statusFilters`)} class="activity-status-filters">
        ${wr.map(t=>_r(e,t))}
      </span>
      <span class="activity-live-autofollow">
        <span>${g(`activity.autoFollow`)}</span>
        ${ft({checked:e.autoFollow,ariaLabel:g(`activity.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})}
      </span>
      ${yr(e,t)}
    </div>
  `}function xr(e){return Tr[e]}function Sr(e,t){let n=e.expandedIds.has(t.id);return x`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${n=>e.onEntryToggle(t.id,n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${D.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            ${mt({kind:xr(t.status),label:ur(t.status)})}
            <span class="activity-entry__tool mono">${pr(t)}</span>
          </span>
          <span class="activity-entry__text">${fr(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${cr(t.updatedAt)}</span>
          <span>${lr(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          ${t.entryKind===`answer_candidate`?x`<span class="mono"
                  >${g(`activity.answerCandidate.itemId`)}: ${t.itemId}</span
                >`:x`
                  <span>${dr(t.hiddenArgumentCount)}</span>
                  <span class="mono">${g(`activity.toolCallId`)}: ${t.toolCallId}</span>
                `}
          <a
            class="activity-entry__run-link mono"
            href=${tn(t.runId,e.basePath)}
            >${g(`activity.runId`)}: ${t.runId}</a
          >
          ${t.sessionKey?x`<span class="mono">${g(`activity.session`)}: ${t.sessionKey}</span>`:S}
        </div>
        ${t.outputPreview?x`
                <pre class="activity-entry__preview">${t.outputPreview}</pre>
                ${t.outputTruncated?x`<div class="activity-entry__note">${g(`activity.outputTruncated`)}</div>`:S}
              `:x`<div class="activity-entry__note">${g(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function Cr(e){let t=hr(e.entries),n=gr(e),r=e.filterText.trim()||e.toolFilter||wr.some(t=>!e.statusFilters[t]);return x`
    <section class="activity-page" aria-label=${g(`activity.title`)}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${g(`activity.title`)}</h2>
        <div class="settings-section__actions">
          <span class="activity-count" aria-live="polite">
            ${g(`activity.visibleCount`,{visible:String(n.length),total:String(e.entries.length)})}
          </span>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length===0}
            @click=${e.onExpandAll}
          >
            ${g(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size===0}
            @click=${e.onCollapseAll}
          >
            ${g(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length===0}
            @click=${e.onClear}
          >
            ${g(`activity.clear`)}
          </button>
        </div>
      </div>
      <div class="settings-group activity-group">
        ${br(e,t)}
        <div
          class="activity-stream"
          role="list"
          aria-label=${g(`activity.streamLabel`)}
          @scroll=${e.onScroll}
        >
          ${n.length===0?x`
                  <div class="activity-empty">
                    ${e.entries.length===0||!r?g(`activity.empty`):g(`activity.emptyFiltered`)}
                  </div>
                `:n.map(t=>Sr(e,t))}
        </div>
      </div>
    </section>
  `}var wr,Tr;function Er(){return(Er=e((()=>{c(),C(),O(),vt(),h(),N(),lt(),v(),R(),M(),wr=[`running`,`done`,`error`],Tr={running:`warn`,done:`ok`,error:`danger`}})))()}function Dr(e){return e?`${e.kind}:${e.id}`:null}function Q(e){return e?.mode!==`run`||!e.selector?null:`${Dr(e.selector)}:${e.decisionCursor??``}`}function Or(e){let t=l(e);return(t?.gatewayCode===`INVALID_REQUEST`||t?.code===`INVALID_REQUEST`)&&t.retryable!==!0}var $,kr;function Ar(){return(Ar=e((()=>{s(),C(),T(),We(),He(),A(),Ve(),gt(),O(),Le(),At(),h(),le(),nt(),ot(),je(),_(),b(),Et(),y(),Bt(),R(),wn(),An(),sr(),Er(),$=class extends re{constructor(...e){super(...e),this.entries=[],this.filterText=``,this.statusFilters={running:!0,done:!0,error:!0},this.toolFilter=``,this.expandedIds=new Set,this.expandedAutomationDays=new Set,this.autoFollow=!0,this.runInspector={status:`empty`},this.liveActivitySource=null,this.liveActivityRevision=-1,this.sessionActivity=new kn(this),this.sessionActivityRevision=-1,this.inspectorAbort=null,this.inspectorClient=null,this.inspectorEpoch=0,this.inspectorSelectorKey=null,this.presenceClient=null,this.streamFollow=new Dt(this,{selector:`.activity-stream`,isEnabled:()=>this.autoFollow}),this.subscriptions=new Te(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.liveActivity,(e,t)=>e.subscribe(t),e=>{let t=e.snapshot,n=e!==this.liveActivitySource||t.revision!==this.liveActivityRevision;this.liveActivitySource=e,this.liveActivityRevision=t.revision,this.entries=t.entries,n&&(this.expandedIds=new Set,this.streamFollow.atBottom=!0)}).effect(()=>this.context?.gateway,e=>{this.applyGatewaySnapshot(e,e.snapshot,!0);let t=e.subscribeEvents(t=>{this.applyGatewayEvent(e,t)}),n=e.subscribe(t=>this.applyGatewaySnapshot(e,t,!1));return()=>{n(),t()}})}willUpdate(e){e.has(`routeLocation`)&&(this.routeData=this.routeLocation?nn(this.routeLocation.search,Ye(this.routeLocation.pathname,this.context?.basePath)):void 0,this.routeLocation&&this.routeData&&(this.presentedRoute={location:this.routeLocation,data:this.routeData}),this.syncSessionActivity())}updated(e){e.has(`routeLocation`)&&this.bindInspectorRoute();let t=this.routeLocation?this.sessionActivity.canonicalLocation(this.routeLocation,this.context.basePath,st(this.presencePayload).users):null;t&&this.context.replace(`activity`,t);let n=this.autoFollow&&e.has(`autoFollow`);(n||this.autoFollow&&this.streamFollow.atBottom&&e.has(`entries`))&&this.streamFollow.schedule(n)}disconnectedCallback(){this.subscriptions.clear(),this.cancelInspectorRequest(),this.presentedRoute=void 0,super.disconnectedCallback()}applyGatewaySnapshot(e,t,n){if((n||e.eventLogRevision!==this.sessionActivityRevision)&&(this.sessionActivityRevision=e.eventLogRevision,this.presentedRoute=void 0,this.sessionActivity.load(null,null)),n||t.client!==this.presenceClient){this.presenceClient=t.client;let e=t.phase===`connected`?ze(t.hello?.snapshot):void 0;this.presencePayload=e?{presence:e}:void 0}else t.phase!==`connected`&&this.presencePayload&&(this.presencePayload=void 0);this.syncRunInspector(e,t,n),this.syncSessionActivity()}syncSessionActivity(e=`query`){let t=this.context?.gateway.snapshot;this.sessionActivity.load(t?.phase===`connected`?t.client:null,this.routeData?.mode===`sessions`?this.routeData.filters:this.routeData?.mode===`live`?`current`:null,e,rt(t,Dn,`operator.write`,{requireAdvertisement:!1}))}bindInspectorRoute(){let e=this.routeData,t=e?.mode===`run`?e.selector:null,n=Q(e);(n!==this.inspectorSelectorKey||e?.mode!==`run`)&&(this.inspectorSelectorKey=n,this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector=t?{status:`loading`,waitingForGateway:!0}:{status:`empty`},e?.mode===`run`&&this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0))}cancelInspectorRequest(){this.inspectorEpoch+=1,this.inspectorAbort?.abort(),this.inspectorAbort=null}syncRunInspector(e,t,n=!1){let r=this.routeData;if(r?.mode!==`run`)return;let i=r.selector;if(!i){this.runInspector={status:`empty`};return}if(this.inspectorSelectorKey=Q(r),t.phase!==`connected`||!t.client){this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector={status:`disconnected`};return}if(it(t,`audit.run.inspect`)===!1){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unsupported`};return}if(!rt(t,`audit.run.inspect`,`operator.read`)){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unauthorized`};return}(n||this.inspectorClient!==t.client||this.runInspector.status!==`loading`&&this.runInspector.status!==`ready`)&&this.loadRunInspector(e,t.client,i)}isUnknownInspectMethod(e){return e instanceof Ge&&e.gatewayCode===`INVALID_REQUEST`&&(e.message===`unknown method: audit.run.inspect`||e.message===`missing scope: operator.admin`)}async loadRunInspector(e,t,n,r){this.cancelInspectorRequest();let i=this.inspectorEpoch,a=new AbortController;this.inspectorAbort=a,this.inspectorClient=t,this.runInspector=r?{...r,executionPageStatus:`loading`}:{status:`loading`,waitingForGateway:!1};let o=Q(this.routeData),s=()=>this.inspectorEpoch===i&&this.context.gateway===e&&e.snapshot.client===t&&e.snapshot.phase===`connected`&&this.routeData?.mode===`run`&&Q(this.routeData)===o,c=this.routeData?.mode===`run`?this.routeData.decisionCursor:null;try{let e=n.kind===`run`?{runId:n.id,decisionLimit:50,executionLimit:50,...c?{decisionCursor:c}:{},...r?.result.nextExecutionCursor?{executionCursor:r.result.nextExecutionCursor}:{}}:{executionId:n.id,decisionLimit:50,...c?{decisionCursor:c}:{}},i=await t.request(`audit.run.inspect`,e,{signal:a.signal});if(s()){if(r?.result.identity.state===`ambiguous`&&i.identity.state===`ambiguous`){let e=new Map(r.result.identity.candidates.map(e=>[e.executionId,e]));for(let t of i.identity.candidates)e.set(t.executionId,t);this.runInspector={status:`ready`,result:{...i,identity:{...i.identity,candidates:[...e.values()]}},receiptPageCursors:r.receiptPageCursors}}else this.runInspector={status:`ready`,result:i,receiptPageCursors:rn(i.decisionDisplays,c??void 0)}}}catch(e){if(!s()||a.signal.aborted)return;this.runInspector=se(e)?{status:`unauthorized`}:this.isUnknownInspectMethod(e)?{status:`unsupported`}:r?{...r,executionPageStatus:`error`}:{status:`error`,recovery:c&&Or(e)?`restart`:`retry`}}finally{this.inspectorAbort===a&&(this.inspectorAbort=null)}}loadMoreExecutions(){let e=this.routeData,t=this.context.gateway.snapshot,n=this.runInspector;e?.mode===`run`&&e.selector?.kind===`run`&&t.phase===`connected`&&t.client&&n.status===`ready`&&n.executionPageStatus!==`loading`&&n.result.identity.state===`ambiguous`&&n.result.nextExecutionCursor&&this.loadRunInspector(this.context.gateway,t.client,e.selector,n)}loadMoreDecisions(){let e=this.routeData,t=this.context.gateway,n=t.snapshot,r=this.runInspector;if(e?.mode!==`run`||!e.selector||n.phase!==`connected`||!n.client||r.status!==`ready`||r.decisionPageStatus===`loading`||r.result.identity.state!==`present`||!r.result.nextDecisionCursor)return;let i=r.result.nextDecisionCursor,a=e.selector,o=n.client,s=Q(e);this.cancelInspectorRequest();let c=this.inspectorEpoch,l=new AbortController;this.inspectorAbort=l,this.runInspector={...r,decisionPageStatus:`loading`};let u=()=>this.inspectorEpoch===c&&this.context.gateway===t&&t.snapshot.client===o&&t.snapshot.phase===`connected`&&Q(this.routeData)===s,d=a.kind===`run`?{runId:a.id,decisionCursor:i,decisionLimit:50,executionLimit:50}:{executionId:a.id,decisionCursor:i,decisionLimit:50};o.request(`audit.run.inspect`,d,{signal:l.signal}).then(e=>{if(!u())return;let t=an(r.result,e);if(!t){this.runInspector={...r,decisionPageStatus:`error`};return}let n=new Map(r.receiptPageCursors);for(let t of e.decisionDisplays)n.set(t.selectorId,i);this.runInspector={status:`ready`,result:t,receiptPageCursors:n}}).catch(e=>{u()&&!l.signal.aborted&&(this.runInspector=se(e)?{status:`unauthorized`}:this.isUnknownInspectMethod(e)?{status:`unsupported`}:{...r,decisionPageStatus:`error`})}).finally(()=>{this.inspectorAbort===l&&(this.inspectorAbort=null)})}restartRunInspector(){let e=this.routeData;e?.mode===`run`&&e.selector&&this.context.navigate(`activity`,{search:en(e.selector)})}selectMode(e){this.context.navigate(`activity`,{search:e===`live`?`?view=live`:``})}applyGatewayEvent(e,t){if(this.context.gateway!==e)return;let n=t.event===`session.message`?we(t.payload):null,r=n&&(n.hasActiveRun===!1||n.status!==null&&n.status!==`running`&&n.status!==`queued`);if((t.event===`sessions.changed`||this.routeData?.mode===`live`&&r)&&this.sessionActivity.invalidate(t.payload),t.event===`presence`){let e=ze(t.payload);this.presencePayload=e?{presence:e}:void 0}}clearEntries(){this.context.liveActivity.clear()}renderMode(e,t,n){if(n&&e.mode===`run`)return qe();if(e.mode===`sessions`){let r=st(this.presencePayload).users;return or({context:this.context,expandedAutomationDays:this.expandedAutomationDays,filters:{...e.filters,personId:this.sessionActivity.result?.involvingProfileId??e.filters.personId},presenceViewers:r,result:this.sessionActivity.result,loading:n||this.sessionActivity.loading,retrying:this.sessionActivity.retrying,error:this.sessionActivity.error,onRetry:()=>this.syncSessionActivity(`retry`),onSummaryRetry:rt(this.context.gateway.snapshot,`sessions.activitySummary.ensure`,`operator.write`,{requireAdvertisement:!1})?e=>this.sessionActivity.retrySummary(e):void 0,onAutomationDayToggle:e=>{let t=new Set(this.expandedAutomationDays);t.has(e)?t.delete(e):t.add(e),this.expandedAutomationDays=t},onFiltersChange:e=>this.context.navigate(`activity`,this.sessionActivity.locationForFilters(e,t,this.context.basePath,r))})}if(e.mode===`run`)return x`<a
          class="activity-run-inspector-back"
          href=${k(`activity`,this.context.basePath)}
          >${D.arrowLeft}${g(`activityFeed.backToSessions`)}</a
        >
        ${Cn({basePath:this.context.basePath,state:this.runInspector,onLoadMoreExecutions:()=>this.loadMoreExecutions(),onLoadMoreDecisions:()=>this.loadMoreDecisions(),selectorId:e.selectorId,selector:e.selector,onRestart:()=>this.restartRunInspector(),onRetry:()=>this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0)})}`;let r={agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello};return x`<div id="activity-live-panel">
      ${zt({basePath:this.context.basePath,fallbackAgentId:Oe(r),mainKey:fe(r),globalScope:ee(r),navigate:this.context.navigate,connected:this.context.gateway.snapshot.phase===`connected`,result:this.sessionActivity.result,loading:n||this.sessionActivity.loading,incomplete:this.sessionActivity.incomplete,error:this.sessionActivity.error,onRetry:()=>this.syncSessionActivity(`retry`)})}
      ${Cr({basePath:this.context.basePath,entries:this.entries,filterText:this.filterText,statusFilters:this.statusFilters,toolFilter:this.toolFilter,expandedIds:this.expandedIds,autoFollow:this.autoFollow,onFilterTextChange:e=>this.filterText=e,onToolFilterChange:e=>this.toolFilter=e,onStatusToggle:(e,t)=>{this.statusFilters={...this.statusFilters,[e]:t}},onToggleAutoFollow:e=>this.autoFollow=e,onClear:()=>this.clearEntries(),onExpandAll:()=>{this.expandedIds=new Set(this.entries.map(e=>e.id))},onCollapseAll:()=>{this.expandedIds=new Set},onEntryToggle:(e,t)=>{let n=new Set(this.expandedIds);t?n.add(e):n.delete(e),this.expandedIds=n},onScroll:e=>this.streamFollow.handleScroll(e)})}
    </div>`}render(){let e=!this.routeData||!this.routeLocation,t=this.routeData??this.presentedRoute?.data,n=this.routeLocation??this.presentedRoute?.location;if(!t||!n)return qe();let r=t.mode,i=x`
      ${r===`run`?S:_t({id:`activity-mode`,active:r,tabs:[{value:`sessions`,label:g(`activityFeed.sessionsMode`)},{value:`live`,label:g(`activity.runInspector.liveMode`)}],ariaLabel:g(`activity.runInspector.activityView`),panelId:`activity-mode-panel`,className:`activity-mode-tabs`,variant:`sub`,onSelect:e=>this.selectMode(e)})}
      <div
        id="activity-mode-panel"
        role=${r===`run`?S:`tabpanel`}
        aria-labelledby=${r===`run`?S:`activity-mode-tab-${r}`}
      >
        ${this.renderMode(t,n,e)}
      </div>
    `;return x`
      <section class="content-header">
        <div>
          <div class="page-title">${Je(`activity`)}</div>
          ${r===`live`?S:x`<div class="page-sub">${g(`subtitles.activity`)}</div>`}
        </div>
      </section>
      ${kt(i,{fillHeight:!0})}
    `}},f([d({context:Re,subscribe:!0})],$.prototype,`context`,void 0),f([E({attribute:!1})],$.prototype,`routeLocation`,void 0),f([w()],$.prototype,`entries`,void 0),f([w()],$.prototype,`filterText`,void 0),f([w()],$.prototype,`statusFilters`,void 0),f([w()],$.prototype,`toolFilter`,void 0),f([w()],$.prototype,`expandedIds`,void 0),f([w()],$.prototype,`expandedAutomationDays`,void 0),f([w()],$.prototype,`autoFollow`,void 0),f([w()],$.prototype,`runInspector`,void 0),f([w()],$.prototype,`presencePayload`,void 0),kr={header:!0,render:e=>x`<openclaw-activity-page .routeLocation=${e}></openclaw-activity-page>`},customElements.get(`openclaw-activity-page`)||customElements.define(`openclaw-activity-page`,$)})))()}Ar();export{kr as activityPageComponent};
//# sourceMappingURL=activity-page-C1e81uEn.js.map