import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Ds5QQwGa.js";import{Dc as i,Fs as a,Gl as o,Is as s,Kr as ee,Ll as c,Ls as l,Oc as u,Xl as d,kc as te,nc as f,qr as p,tc as m,zl as h}from"./control-ui-core-DkXlmHxW.js";import{$ as g,X as _,Y as v,ct as y,nt as ne}from"./lit-runtime-DLvISeBM.js";import{Cr as b,Di as re,Fi as x,Fr as S,Ii as C,Oi as w,Or as ie,Qa as ae,do as oe,fo as se}from"./control-ui-core-BdNTI4B-.js";import{G as T,H as ce,U as le,V as ue}from"./control-ui-boot-shared-R7zgIWiU.js";import{c as de,u as fe}from"./gateway-runtime-a3mMsPfZ.js";import{Ct as E,Et as D,Mt as O,Oa as k,Ot as A,St as j,Ta as M,_t as N,ht as P,jt as F,pt as I,wt as L}from"./control-ui-boot-shared-C5a8_33C.js";import{ht as R}from"./control-ui-boot-new-DDdINxls.js";import{n as z,t as B}from"./settings-workspace-DkkrNauO.js";import{n as V,t as pe}from"./en-memory-import-B-vYjUbw.js";function me(e){return e.backfillRollbackPending?g`
    <openclaw-modal-dialog
      label=${d(`memoryImport.backfill.rollbackConfirmTitle`)}
      description=${d(`memoryImport.backfill.rollbackConfirmDescription`)}
      @modal-cancel=${e.onBackfillRollbackCancel}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">
              ${d(`memoryImport.backfill.rollbackConfirmTitle`)}
            </div>
            <div class="exec-approval-sub">
              ${d(`memoryImport.backfill.rollbackConfirmDescription`)}
            </div>
          </div>
        </div>
        <div class="callout warn">${d(`memoryImport.backfill.rollbackWarning`)}</div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            data-test-id="memory-backfill-rollback-confirm"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackConfirm}
          >
            ${d(`memoryImport.backfill.rollback`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackCancel}
          >
            ${d(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `:_}function H(){return(H=e((()=>{v(),S(),o()})))()}function U(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function he(e){let t=new Map;for(let n of e){let e=U(n,`collectionId`)??n.id,r=U(n,`collectionLabel`)??U(n,`sourceLabel`)??d(`memoryImport.unknownCollection`),i=t.get(e)??{id:e,label:r,items:[]};i.items.push(n),t.set(e,i)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function W(e){return e.providerId===`claude`?d(`memoryImport.claudeCode`):e.label}function ge(e){return e.providerId===`codex`?d(`memoryImport.codexDescription`):e.providerId===`claude`?d(`memoryImport.claudeDescription`):d(`memoryImport.providerFallback`)}function G(e){return d(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function _e(e){return d(e===1?`memoryImport.backfill.processedDayCountOne`:`memoryImport.backfill.processedDayCount`,{count:String(e)})}function K(e){let t=U(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function q(e,t,n,r,i){let a=t.items.filter(e=>e.status===`planned`).map(e=>e.id),o=a.length>0&&a.every(e=>n.has(e)),s=t.items.filter(e=>e.status===`conflict`).length;return g`
    <div class="settings-row settings-row--stacked memory-import__collection">
      <div class="memory-import__collection-header">
        <label class="memory-import__collection-choice">
          <input
            type="checkbox"
            .checked=${o}
            ?disabled=${a.length===0||i}
            @change=${t=>r(e.providerId,a,t.currentTarget.checked)}
          />
          <span>
            <strong>${t.label}</strong>
            <small>${G(t.items.length)}</small>
          </span>
        </label>
        ${s>0?A({kind:`warn`,label:d(`memoryImport.alreadyImported`,{count:String(s)})}):_}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${d(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>g`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${x.fileText}</span>
                <code title=${e.source??K(e)}>${K(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?d(`memoryImport.ready`):e.status===`conflict`?d(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function ve(e){if(!e)return _;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||U(e,`recoveryRecordPath`)!==void 0);return g`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?x.alertTriangle:x.check}</span>
      <div>
        <strong>
          ${d(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?d(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):d(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?g`<span class="memory-import__result-path">
                ${d(`memoryImport.reportSaved`)}:
                <code title=${e.reportDir}>${e.reportDir}</code>
              </span>`:_}
        ${n.length>0?g`<ul class="memory-import__result-issues">
                ${n.map(e=>{let t=[{label:d(`memoryImport.recoveryFile`),path:U(e,`recoveryPath`)},{label:d(`memoryImport.recoveryJournal`),path:U(e,`recoveryRecordPath`)},{label:d(`memoryImport.itemBackup`),path:U(e,`backupPath`)}].filter(e=>!!e.path);return g`<li>
                    <strong>${K(e)}</strong>
                    <span>${s(e.reason??e.message,e.status)}</span>
                    ${t.map(e=>g`<span class="memory-import__result-artifact">
                        <span>${e.label}</span>
                        <code title=${e.path}>${e.path}</code>
                      </span>`)}
                  </li>`})}
              </ul>`:_}
      </div>
    </div>
  `}function ye(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),r=he(t.items),i=e.applyingProviderId===t.providerId,a=e.backfillBusy===`apply`||e.backfillBusy===`rollback`||e.backfillRollbackPending,o=t.error?g`<div class="callout danger" role="alert">${s(t.error)}</div>`:t.found?g`
          ${t.source?L({title:d(`memoryImport.source`),control:O(t.source,{mono:!0})}):_}
          ${t.target?L({title:d(`memoryImport.destination`),control:O(`${t.target}/memory/imports/`,{mono:!0})}):_}
          ${r.map(r=>q(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null||a))}
          ${L({title:n.size>0?d(`memoryImport.selectedCount`,{count:String(n.size)}):d(`memoryImport.selectAtLeastOne`),control:g`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||a||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${d(i?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:N(t.message??d(`memoryImport.noMemoryFound`));return g`
    <div data-provider-id=${t.providerId}>
      ${D({title:g`<span class="memory-import__provider-title">
            ${k(t.providerId,{className:`memory-import__provider-icon`})}
            ${W(t)}
          </span>`,description:ge(t),actions:A({kind:t.found?`ok`:`muted`,label:t.found?G(t.items.length):d(`memoryImport.notFound`)})},g`${o}${ve(e.lastResults[t.providerId])}`)}
    </div>
  `}function be(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return _;let n=e.selectedByProvider[t.providerId]?.length??0,r=d(`memoryImport.confirmTitle`,{provider:W(t)}),i=d(`memoryImport.confirmDescription`,{count:String(n)});return g`
    <openclaw-modal-dialog
      label=${r}
      description=${i}
      @modal-cancel=${()=>{e.applyingProviderId===null&&e.onCancelImport()}}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${r}</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
        </div>
        <div class="callout ${e.replaceExisting?`warn`:``}">
          ${e.replaceExisting?d(`memoryImport.confirmReplace`):d(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${d(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${d(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function xe(e){let t=e.loading||e.applyingProviderId!==null||e.backfillBusy!==null;return D({title:d(`memoryImport.title`),description:d(`memoryImport.subtitle`),actions:g`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?d(`common.refreshing`):d(`common.refresh`)}
        </button>
      `},g`
      ${e.agents.length>1?L({title:d(`memoryImport.agent`),control:g`
                <openclaw-agent-select
                  class="agent-select--settings"
                  name="memory-import-agent"
                  .options=${e.agents.map(e=>({value:e.id,label:te(e),agent:e}))}
                  .value=${e.selectedAgentId??``}
                  .accessibleLabel=${d(`memoryImport.agent`)}
                  .disabled=${t}
                  .onSelect=${e.onSelectAgent}
                ></openclaw-agent-select>
              `}):_}
      ${F({title:d(`memoryImport.replaceExisting`),description:d(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function Se(e){let t=e.backfillBusy!==null||e.applyingProviderId!==null,n=e.backfillPreview;return g`
    <div data-test-id="memory-session-backfill">
      ${D({title:d(`memoryImport.backfill.title`),description:d(`memoryImport.backfill.subtitle`)},g`
          ${e.backfillAvailable?g`
                  ${L({title:d(`memoryImport.backfill.dateRange`),description:d(`memoryImport.backfill.dateRangeHint`),control:g`<div class="memory-import__backfill-dates">
                      <label>
                        <span>${d(`memoryImport.backfill.from`)}</span>
                        <input
                          class="input"
                          type="date"
                          .value=${e.backfillFrom}
                          ?disabled=${t}
                          @input=${t=>e.onBackfillFromChange(t.currentTarget.value)}
                        />
                      </label>
                      <label>
                        <span>${d(`memoryImport.backfill.to`)}</span>
                        <input
                          class="input"
                          type="date"
                          .value=${e.backfillTo}
                          ?disabled=${t}
                          @input=${t=>e.onBackfillToChange(t.currentTarget.value)}
                        />
                      </label>
                    </div>`})}
                  ${L({title:d(`memoryImport.backfill.actions`),control:g`<div class="memory-import__backfill-actions">
                      <button
                        class="btn"
                        data-test-id="memory-backfill-preview"
                        ?disabled=${t}
                        @click=${e.onBackfillPreview}
                      >
                        ${e.backfillBusy===`preview`?d(`memoryImport.backfill.previewing`):d(`memoryImport.backfill.preview`)}
                      </button>
                      <button
                        class="btn primary"
                        data-test-id="memory-backfill-apply"
                        ?disabled=${t}
                        @click=${e.onBackfillApply}
                      >
                        ${e.backfillBusy===`apply`?d(`memoryImport.backfill.applying`):d(`memoryImport.backfill.apply`)}
                      </button>
                      <button
                        class="btn danger"
                        data-test-id="memory-backfill-rollback"
                        ?disabled=${t}
                        @click=${e.onBackfillRollbackRequest}
                      >
                        ${d(`memoryImport.backfill.rollback`)}
                      </button>
                    </div>`})}
                  ${e.backfillError?g`<div class="callout danger" role="alert">${e.backfillError}</div>`:_}
                  ${n?g`<div
                          class="settings-row settings-row--stacked memory-import__backfill-preview"
                        >
                          <strong>
                            ${d(`memoryImport.backfill.previewSummary`,{candidates:String(n.candidates),days:String(n.days)})}
                          </strong>
                          ${n.perDay.length>0?g`<ul>
                                  ${n.perDay.map(e=>g`<li>
                                      <div>
                                        <strong>${e.day}</strong>
                                        <span>
                                          ${d(`memoryImport.backfill.candidateCount`,{count:String(e.candidateCount)})}
                                        </span>
                                      </div>
                                      ${e.sample.length>0?g`<ul>
                                              ${e.sample.map(e=>g`<li>${e}</li>`)}
                                            </ul>`:_}
                                    </li>`)}
                                </ul>`:g`<span>${d(`memoryImport.backfill.noCandidates`)}</span>`}
                          ${n.truncated?g`<div class="callout warn">
                                  ${d(`memoryImport.backfill.previewTruncated`)}
                                </div>`:_}
                        </div>`:_}
                  ${e.backfillProgress?g`<div
                          class="settings-row settings-row--stacked memory-import__backfill-progress"
                          role="status"
                        >
                          <strong>
                            ${e.backfillProgress.complete?d(`memoryImport.backfill.complete`,{count:String(e.backfillProgress.staged)}):d(`memoryImport.backfill.progress`,{days:String(e.backfillProgress.days),staged:String(e.backfillProgress.staged)})}
                          </strong>
                          <span>
                            ${d(`memoryImport.backfill.processedCandidates`,{count:String(e.backfillProgress.candidates)})}
                            · ${_e(e.backfillProgress.days)}
                          </span>
                        </div>`:_}
                  ${e.backfillRollbackResult?g`<div class="settings-row settings-row--stacked" role="status">
                          <strong>${d(`memoryImport.backfill.rollbackComplete`)}</strong>
                          <span>
                            ${d(`memoryImport.backfill.rollbackCounts`,{diary:String(e.backfillRollbackResult.removedDiaryEntries),staged:String(e.backfillRollbackResult.removedStagedEntries)})}
                          </span>
                        </div>`:_}
                `:N(d(`memoryImport.backfill.unavailable`))}
        `)}
      ${me(e)}
    </div>
  `}function Ce(e){return e.connected?e.canAdmin?g`
    <div class="memory-import" data-test-id="memory-import-page">
      ${j(g`
        ${xe(e)} ${Se(e)}
        ${e.error?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
        ${e.applyError?g`<div class="callout danger" role="alert">${e.applyError}</div>`:_}
        ${e.loading&&!e.plan?g`<div class="settings-group memory-import__loading" aria-busy="true">
                <div class="skeleton memory-import__skeleton"></div>
                <div class="skeleton memory-import__skeleton"></div>
              </div>`:(e.plan?.providers??[]).map(t=>ye(e,t))}
        ${be(e)}
      `)}
    </div>
  `:j(N(d(`memoryImport.adminRequired`))):j(N(d(`memoryImport.disconnected`)))}function J(){return(J=e((()=>{v(),R(),S(),C(),M(),I(),o(),pe(),i(),l(),H(),V()})))()}function Y(e){return a(e,`request failed`)}var X,Z,Q;function $(){return($=e((()=>{t(),ue(),v(),ne(),ae(),w(),ie(),I(),B(),i(),l(),de(),p(),h(),f(),J(),X=14,Z=`https://docs.openclaw.ai/install/migrating`,Q=class extends c{constructor(...e){super(...e),this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1,this.applyEpoch=0,this.backfillEpoch=0,this.lastPlanValue=null,this.subscriptions=new m(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t)),this.planTask=new ce(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.isConnected&&e?.phase===`connected`?e.client??null:null,e?b(e.hello?.auth??null):!1,this.currentAgentId(),this.replaceExisting]},task:async([e,t,n,r],{signal:i})=>!e||!t||!n?le:{client:e,agentId:n,overwrite:r,plan:await e.request(`migrations.memory.plan`,{agentId:n,overwrite:r},{signal:i})},onComplete:e=>{let t=this.lastPlanValue;t&&(t.client!==e.client||t.agentId!==e.agentId||t.overwrite!==e.overwrite)&&(this.resetMutationState({preserveAttemptedImport:t.client!==e.client}),(t.client!==e.client||t.agentId!==e.agentId)&&this.resetBackfillState()),this.lastPlanValue=e;let{plan:n}=e;this.selectedByProvider=Object.fromEntries(n.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}})}disconnectedCallback(){this.planTask.run([null,!1,null,this.replaceExisting]),this.applyEpoch+=1,this.backfillEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;this.pendingImport&&(e.phase!==`connected`||e.client!==(this.planTask.value??this.lastPlanValue)?.client||this.currentAgentId()!==this.pendingImport.agentId)&&this.resetMutationState({preserveAttemptedImport:!0}),e.phase!==`connected`&&(this.backfillBusy!==null||this.backfillRollbackPending)&&this.resetBackfillState()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=u(e.agents),n=this.context.agentSelection.state.selectedId;return n&&t.some(e=>e.id===n)?n:t.some(t=>t.id===e.defaultId)?e.defaultId:t[0]?.id??null}get plan(){let e=this.planTask.value??this.lastPlanValue,t=this.context.gateway.snapshot,n=this.currentAgentId();return e&&t.phase===`connected`&&e.client===t.client&&e.agentId===n&&e.overwrite===this.replaceExisting?e.plan:null}get loading(){return this.planTask.status===T.PENDING}get error(){return this.planTask.status===T.ERROR?Y(this.planTask.error):null}get canAdmin(){return b(this.context.gateway.snapshot.hello?.auth??null)}resetMutationState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.applyEpoch+=1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={}}refresh(){return this.currentAgentId()?this.planTask.run():this.context.agents.ensureList().then(()=>void 0)}selectAgent(e){this.context.agentSelection.set(e),this.resetMutationState(),this.resetBackfillState()}setReplaceExisting(e){this.replaceExisting=e,this.resetMutationState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){if(!this.canAdmin)return;let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];!this.loading&&this.error===null&&this.applyingProviderId===null&&this.backfillBusy!==`apply`&&this.backfillBusy!==`rollback`&&!this.backfillRollbackPending&&t&&this.plan?.agentId===t&&n&&r.length!==0&&(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:ee(),attempted:!1})}async confirmImport(){if(!this.canAdmin||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0},r=t.client;this.pendingImport=n;let i=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await r.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(i!==this.applyEpoch||this.context.gateway.snapshot.phase!==`connected`||this.context.gateway.snapshot.client!==r||this.currentAgentId()!==n.agentId)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,await this.refresh()}catch(e){i===this.applyEpoch&&(this.applyError=Y(e))}finally{i===this.applyEpoch&&(this.applyingProviderId=null)}}resetBackfillState(){this.backfillEpoch+=1,this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1}backfillRequest(e){return{agentId:e,...this.backfillFrom?{from:this.backfillFrom}:{},...this.backfillTo?{to:this.backfillTo}:{},limitDays:X}}isCurrentBackfillRequest(e,t,n){return e===this.backfillEpoch&&this.context.gateway.snapshot.phase===`connected`&&this.context.gateway.snapshot.client===t&&this.currentAgentId()===n}async previewBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`preview`,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null;try{let r=await e.request(`memory.sessionBackfill.preview`,this.backfillRequest(t));this.isCurrentBackfillRequest(n,e,t)&&(this.backfillPreview=r)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async applyBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`apply`,this.backfillError=null,this.backfillPreview=null,this.backfillRollbackResult=null,this.backfillProgress={days:0,candidates:0,staged:0,complete:!1};let r=this.backfillProgress,i=new Set;try{for(;;){let a=await e.request(`memory.sessionBackfill.apply`,this.backfillRequest(t));if(!this.isCurrentBackfillRequest(n,e,t))return;if(a.candidates>0&&a.cursor?.advanced!==!0)throw Error(`Session backfill stopped because the server cursor did not advance.`);if(a.candidates===0&&a.cursor?.exhausted!==!0)throw Error(`Session backfill stopped because the server cursor was not exhausted.`);for(let e of a.perDay)i.add(e.day);if(r={days:i.size,candidates:r.candidates+a.candidates,staged:r.staged+a.staged,complete:a.candidates===0},this.backfillProgress=r,a.candidates===0)break}}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async confirmBackfillRollback(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null||!this.backfillRollbackPending)return;let n=++this.backfillEpoch;this.backfillBusy=`rollback`,this.backfillError=null;try{let r=await e.request(`memory.sessionBackfill.rollback`,{agentId:t});this.isCurrentBackfillRequest(n,e,t)&&(this.backfillRollbackResult=r,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackPending=!1)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=Ce({connected:e.phase===`connected`,canAdmin:this.canAdmin,agents:u(t?.agents??[]),selectedAgentId:n,plan:this.plan,loading:this.loading||this.context.agents.state.agentsLoading,error:(n?null:this.context.agents.state.agentsError)??this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,backfillAvailable:fe(e,`memory.sessionBackfill.preview`)!==!1,backfillFrom:this.backfillFrom,backfillTo:this.backfillTo,backfillBusy:this.backfillBusy,backfillError:this.backfillError,backfillPreview:this.backfillPreview,backfillProgress:this.backfillProgress,backfillRollbackResult:this.backfillRollbackResult,backfillRollbackPending:this.backfillRollbackPending,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)},onBackfillFromChange:e=>{this.backfillFrom=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillToChange:e=>{this.backfillTo=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillPreview:()=>void this.previewBackfill(),onBackfillApply:()=>void this.applyBackfill(),onBackfillRollbackRequest:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!0,this.backfillError=null)},onBackfillRollbackConfirm:()=>void this.confirmBackfillRollback(),onBackfillRollbackCancel:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!1)}});return g`
      ${E({title:se(`memory-import`),subtitle:g`${oe(`memory-import`)}
        ${P(Z)}`})}
      ${z(r)}
    `}},r([n({context:re,subscribe:!0})],Q.prototype,`context`,void 0),r([y()],Q.prototype,`replaceExisting`,void 0),r([y()],Q.prototype,`selectedByProvider`,void 0),r([y()],Q.prototype,`applyingProviderId`,void 0),r([y()],Q.prototype,`pendingImport`,void 0),r([y()],Q.prototype,`applyError`,void 0),r([y()],Q.prototype,`lastResults`,void 0),r([y()],Q.prototype,`backfillFrom`,void 0),r([y()],Q.prototype,`backfillTo`,void 0),r([y()],Q.prototype,`backfillBusy`,void 0),r([y()],Q.prototype,`backfillError`,void 0),r([y()],Q.prototype,`backfillPreview`,void 0),r([y()],Q.prototype,`backfillProgress`,void 0),r([y()],Q.prototype,`backfillRollbackResult`,void 0),r([y()],Q.prototype,`backfillRollbackPending`,void 0),customElements.get(`openclaw-memory-import-page`)||customElements.define(`openclaw-memory-import-page`,Q)})))()}$();
//# sourceMappingURL=memory-import-page-CfejX9X8.js.map