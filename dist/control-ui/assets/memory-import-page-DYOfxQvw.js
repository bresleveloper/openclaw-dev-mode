import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,du as a,fu as o,il as s,ju as c,kc as l,nl as u,pu as d,rl as f}from"./control-ui-core-bJHyI7AF.js";import{La as ee,Ra as te,Ti as ne,Wr as p,gr as m,na as h,ra as g,wa as re,wi as ie,xr as ae}from"./control-ui-core-DNh4McGE.js";import{$ as _,X as v,Y as y,ct as b,nt as x}from"./lit-runtime-DyST807n.js";import{d as S,l as C}from"./gateway-runtime-FZ6mX2RY.js";import{Ft as w,Pt as oe,Xr as se,Zr as ce,ii as T}from"./ui-DeikvIdP.js";import{A as le,M as E,O as ue,k as de}from"./control-ui-boot-shared-ChxHeQUn.js";import{B as D,G as O,I as k,K as A,R as j,Y as M,Z as N,_i as P,et as F,l as I,pi as L,q as R,tt as z,u as B,ui as V}from"./control-ui-boot-shared-C9uJ732w.js";import{n as H,t as fe}from"./en-memory-import-BPCTd1c4.js";function pe(e){return e.backfillRollbackPending?_`
    <openclaw-modal-dialog
      label=${c(`memoryImport.backfill.rollbackConfirmTitle`)}
      description=${c(`memoryImport.backfill.rollbackConfirmDescription`)}
      @modal-cancel=${e.onBackfillRollbackCancel}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">
              ${c(`memoryImport.backfill.rollbackConfirmTitle`)}
            </div>
            <div class="exec-approval-sub">
              ${c(`memoryImport.backfill.rollbackConfirmDescription`)}
            </div>
          </div>
        </div>
        <div class="callout warn">${c(`memoryImport.backfill.rollbackWarning`)}</div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            data-test-id="memory-backfill-rollback-confirm"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackConfirm}
          >
            ${c(`memoryImport.backfill.rollback`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackCancel}
          >
            ${c(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `:v}function U(){return(U=e((()=>{y(),p(),r()})))()}function W(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function me(e){let t=new Map;for(let n of e){let e=W(n,`collectionId`)??n.id,r=W(n,`collectionLabel`)??W(n,`sourceLabel`)??c(`memoryImport.unknownCollection`),i=t.get(e)??{id:e,label:r,items:[]};i.items.push(n),t.set(e,i)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function G(e){return e.providerId===`claude`?c(`memoryImport.claudeCode`):e.label}function he(e){return e.providerId===`codex`?c(`memoryImport.codexDescription`):e.providerId===`claude`?c(`memoryImport.claudeDescription`):c(`memoryImport.providerFallback`)}function K(e){return c(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function ge(e){return c(e===1?`memoryImport.backfill.processedDayCountOne`:`memoryImport.backfill.processedDayCount`,{count:String(e)})}function q(e){let t=W(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function J(e,t,n,r,i){let a=t.items.filter(e=>e.status===`planned`).map(e=>e.id),o=a.length>0&&a.every(e=>n.has(e)),s=t.items.filter(e=>e.status===`conflict`).length;return _`
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
            <small>${K(t.items.length)}</small>
          </span>
        </label>
        ${s>0?N({kind:`warn`,label:c(`memoryImport.alreadyImported`,{count:String(s)})}):v}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${c(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>_`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${h.fileText}</span>
                <code title=${e.source??q(e)}>${q(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?c(`memoryImport.ready`):e.status===`conflict`?c(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function _e(e){if(!e)return v;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||W(e,`recoveryRecordPath`)!==void 0);return _`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?h.alertTriangle:h.check}</span>
      <div>
        <strong>
          ${c(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?c(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):c(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?_`<span class="memory-import__result-path">
                ${c(`memoryImport.reportSaved`)}:
                <code title=${e.reportDir}>${e.reportDir}</code>
              </span>`:v}
        ${n.length>0?_`<ul class="memory-import__result-issues">
                ${n.map(e=>{let t=[{label:c(`memoryImport.recoveryFile`),path:W(e,`recoveryPath`)},{label:c(`memoryImport.recoveryJournal`),path:W(e,`recoveryRecordPath`)},{label:c(`memoryImport.itemBackup`),path:W(e,`backupPath`)}].filter(e=>!!e.path);return _`<li>
                    <strong>${q(e)}</strong>
                    <span>${o(e.reason??e.message,e.status)}</span>
                    ${t.map(e=>_`<span class="memory-import__result-artifact">
                        <span>${e.label}</span>
                        <code title=${e.path}>${e.path}</code>
                      </span>`)}
                  </li>`})}
              </ul>`:v}
      </div>
    </div>
  `}function ve(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),r=me(t.items),i=e.applyingProviderId===t.providerId,a=e.backfillBusy===`apply`||e.backfillBusy===`rollback`||e.backfillRollbackPending,s=t.error?_`<div class="callout danger" role="alert">${o(t.error)}</div>`:t.found?_`
          ${t.source?R({title:c(`memoryImport.source`),control:z(t.source,{mono:!0})}):v}
          ${t.target?R({title:c(`memoryImport.destination`),control:z(`${t.target}/memory/imports/`,{mono:!0})}):v}
          ${r.map(r=>J(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null||a))}
          ${R({title:n.size>0?c(`memoryImport.selectedCount`,{count:String(n.size)}):c(`memoryImport.selectAtLeastOne`),control:_`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||a||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${c(i?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:D(t.message??c(`memoryImport.noMemoryFound`));return _`
    <div data-provider-id=${t.providerId}>
      ${M({title:_`<span class="memory-import__provider-title">
            ${L(t.providerId,{className:`memory-import__provider-icon`})}
            ${G(t)}
          </span>`,description:he(t),actions:N({kind:t.found?`ok`:`muted`,label:t.found?K(t.items.length):c(`memoryImport.notFound`)})},_`${s}${_e(e.lastResults[t.providerId])}`)}
    </div>
  `}function ye(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return v;let n=e.selectedByProvider[t.providerId]?.length??0,r=c(`memoryImport.confirmTitle`,{provider:G(t)}),i=c(`memoryImport.confirmDescription`,{count:String(n)});return _`
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
          ${e.replaceExisting?c(`memoryImport.confirmReplace`):c(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${c(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${c(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function be(e){let t=e.loading||e.applyingProviderId!==null||e.backfillBusy!==null;return M({title:c(`memoryImport.title`),description:c(`memoryImport.subtitle`),actions:_`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?c(`common.refreshing`):c(`common.refresh`)}
        </button>
      `},_`
      ${e.agents.length>1?R({title:c(`memoryImport.agent`),control:_`
                <openclaw-agent-select
                  class="agent-select--settings"
                  name="memory-import-agent"
                  .options=${e.agents.map(e=>({value:e.id,label:s(e),agent:e}))}
                  .value=${e.selectedAgentId??``}
                  .accessibleLabel=${c(`memoryImport.agent`)}
                  .disabled=${t}
                  .onSelect=${e.onSelectAgent}
                ></openclaw-agent-select>
              `}):v}
      ${F({title:c(`memoryImport.replaceExisting`),description:c(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function xe(e){let t=e.backfillBusy!==null||e.applyingProviderId!==null,n=e.backfillPreview,r=(e,n,r)=>_`<label>
    <span>${e}</span>
    <input
      class="input"
      type="date"
      .value=${n}
      ?disabled=${t}
      @input=${e=>r(e.currentTarget.value)}
    />
  </label>`,i=(e,n,r,i)=>_`<button
    class=${n}
    data-test-id=${`memory-backfill-${e}`}
    ?disabled=${t}
    @click=${i}
  >
    ${r}
  </button>`;return _`
    <div data-test-id="memory-session-backfill">
      ${M({title:c(`memoryImport.backfill.title`),description:c(`memoryImport.backfill.subtitle`)},_`
          ${e.backfillAvailable?_`
                  ${R({title:c(`memoryImport.backfill.dateRange`),description:c(`memoryImport.backfill.dateRangeHint`),control:_`<div class="memory-import__backfill-dates">
                      ${r(c(`memoryImport.backfill.from`),e.backfillFrom,e.onBackfillFromChange)}
                      ${r(c(`memoryImport.backfill.to`),e.backfillTo,e.onBackfillToChange)}
                    </div>`})}
                  ${R({title:c(`memoryImport.backfill.actions`),control:_`<div class="memory-import__backfill-actions">
                      ${i(`preview`,`btn`,c(e.backfillBusy===`preview`?`memoryImport.backfill.previewing`:`memoryImport.backfill.preview`),e.onBackfillPreview)}
                      ${i(`apply`,`btn primary`,c(e.backfillBusy===`apply`?`memoryImport.backfill.applying`:`memoryImport.backfill.apply`),e.onBackfillApply)}
                      ${i(`rollback`,`btn danger`,c(`memoryImport.backfill.rollback`),e.onBackfillRollbackRequest)}
                    </div>`})}
                  ${e.backfillError?_`<div class="callout danger" role="alert">${e.backfillError}</div>`:v}
                  ${n?_`<div
                          class="settings-row settings-row--stacked memory-import__backfill-preview"
                        >
                          <strong role="status">
                            ${c(`memoryImport.backfill.previewSummary`,{candidates:String(n.candidates),days:String(n.days)})}
                          </strong>
                          ${n.perDay.length>0?_`<ul>
                                  ${n.perDay.map(e=>_`<li>
                                      <div>
                                        <strong>${e.day}</strong>
                                        <span>
                                          ${c(`memoryImport.backfill.candidateCount`,{count:String(e.candidateCount)})}
                                        </span>
                                      </div>
                                      ${e.sample.length>0?_`<ul>
                                              ${e.sample.map(e=>_`<li>${e}</li>`)}
                                            </ul>`:v}
                                    </li>`)}
                                </ul>`:_`<span>${c(`memoryImport.backfill.noCandidates`)}</span>`}
                          ${n.truncated?_`<div class="callout warn">
                                  ${c(`memoryImport.backfill.previewTruncated`)}
                                </div>`:v}
                        </div>`:v}
                  ${e.backfillProgress?_`<div
                          class="settings-row settings-row--stacked memory-import__backfill-progress"
                          role="status"
                        >
                          <strong>
                            ${e.backfillProgress.complete?c(`memoryImport.backfill.complete`,{count:String(e.backfillProgress.staged)}):c(`memoryImport.backfill.progress`,{days:String(e.backfillProgress.days),staged:String(e.backfillProgress.staged)})}
                          </strong>
                          <span>
                            ${c(`memoryImport.backfill.processedCandidates`,{count:String(e.backfillProgress.candidates)})}
                            · ${ge(e.backfillProgress.days)}
                          </span>
                        </div>`:v}
                  ${e.backfillRollbackResult?_`<div class="settings-row settings-row--stacked" role="status">
                          <strong>${c(`memoryImport.backfill.rollbackComplete`)}</strong>
                          <span>
                            ${c(`memoryImport.backfill.rollbackCounts`,{diary:String(e.backfillRollbackResult.removedDiaryEntries),staged:String(e.backfillRollbackResult.removedStagedEntries)})}
                          </span>
                        </div>`:v}
                `:D(c(`memoryImport.backfill.unavailable`))}
        `)}
      ${pe(e)}
    </div>
  `}function Se(e){return e.connected?e.canAdmin?_`
    <div class="memory-import" data-test-id="memory-import-page">
      ${O(_`
        ${be(e)} ${xe(e)}
        ${[e.error,e.applyError].map(e=>e?_`<div class="callout danger" role="alert">${e}</div>`:v)}
        ${e.loading&&!e.plan?_`<div class="settings-group memory-import__loading" aria-busy="true">
                <div class="skeleton memory-import__skeleton"></div>
                <div class="skeleton memory-import__skeleton"></div>
              </div>`:(e.plan?.providers??[]).map(t=>ve(e,t))}
        ${ye(e)}
      `)}
    </div>
  `:O(D(c(`memoryImport.adminRequired`))):O(D(c(`memoryImport.disconnected`)))}function Y(){return(Y=e((()=>{y(),P(),p(),g(),V(),k(),r(),fe(),u(),d(),U(),H()})))()}var X,Z,Q;function $(){return($=e((()=>{ce(),ue(),y(),x(),re(),ne(),ae(),k(),I(),u(),d(),C(),w(),i(),t(),Y(),X=14,Z=`https://docs.openclaw.ai/install/migrating`,Q=class extends n{constructor(...e){super(...e),this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1,this.applyEpoch=0,this.backfillEpoch=0,this.lastPlanValue=null,this.subscriptions=new l(this).watchStore(()=>this.context?.gateway).watchStore(()=>this.context?.agents).watchStore(()=>this.context?.agentSelection),this.planTask=new de(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.isConnected&&e?.phase===`connected`?e.client??null:null,e?m(e.hello?.auth??null):!1,this.currentAgentId(),this.replaceExisting]},task:async([e,t,n,r],{signal:i})=>!e||!t||!n?le:{client:e,agentId:n,overwrite:r,plan:await e.request(`migrations.memory.plan`,{agentId:n,overwrite:r},{signal:i})},onComplete:e=>{let t=this.lastPlanValue;t&&(t.client!==e.client||t.agentId!==e.agentId||t.overwrite!==e.overwrite)&&(this.resetMutationState({preserveAttemptedImport:t.client!==e.client}),(t.client!==e.client||t.agentId!==e.agentId)&&this.resetBackfillState()),this.lastPlanValue=e;let{plan:n}=e;this.selectedByProvider=Object.fromEntries(n.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}})}disconnectedCallback(){this.planTask.run([null,!1,null,this.replaceExisting]),this.applyEpoch+=1,this.backfillEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;this.pendingImport&&(e.phase!==`connected`||e.client!==(this.planTask.value??this.lastPlanValue)?.client||this.currentAgentId()!==this.pendingImport.agentId)&&this.resetMutationState({preserveAttemptedImport:!0}),e.phase!==`connected`&&(this.backfillBusy!==null||this.backfillRollbackPending)&&this.resetBackfillState()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=f(e.agents),n=this.context.agentSelection.state.selectedId;return n&&t.some(e=>e.id===n)?n:t.some(t=>t.id===e.defaultId)?e.defaultId:t[0]?.id??null}get plan(){let e=this.planTask.value??this.lastPlanValue,t=this.context.gateway.snapshot,n=this.currentAgentId();return e&&t.phase===`connected`&&e.client===t.client&&e.agentId===n&&e.overwrite===this.replaceExisting?e.plan:null}get loading(){return this.planTask.status===E.PENDING}get error(){return this.planTask.status===E.ERROR?a(this.planTask.error,`request failed`):null}get canAdmin(){return m(this.context.gateway.snapshot.hello?.auth??null)}resetMutationState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.applyEpoch+=1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={}}refresh(){return this.currentAgentId()?this.planTask.run():this.context.agents.ensureList().then(()=>void 0)}selectAgent(e){this.context.agentSelection.set(e),this.resetMutationState(),this.resetBackfillState()}setReplaceExisting(e){this.replaceExisting=e,this.resetMutationState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){if(!this.canAdmin)return;let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];!this.loading&&this.error===null&&this.applyingProviderId===null&&this.backfillBusy!==`apply`&&this.backfillBusy!==`rollback`&&!this.backfillRollbackPending&&t&&this.plan?.agentId===t&&n&&r.length!==0&&(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:oe(),attempted:!1})}async confirmImport(){if(!this.canAdmin||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0},r=t.client;this.pendingImport=n;let i=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await r.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(i!==this.applyEpoch||this.context.gateway.snapshot.phase!==`connected`||this.context.gateway.snapshot.client!==r||this.currentAgentId()!==n.agentId)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,await this.refresh()}catch(e){i===this.applyEpoch&&(this.applyError=a(e,`request failed`))}finally{i===this.applyEpoch&&(this.applyingProviderId=null)}}resetBackfillState(){this.backfillEpoch+=1,this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1}backfillRequest(e){return{agentId:e,...this.backfillFrom?{from:this.backfillFrom}:{},...this.backfillTo?{to:this.backfillTo}:{},limitDays:X}}isCurrentBackfillRequest(e,t,n){return e===this.backfillEpoch&&this.context.gateway.snapshot.phase===`connected`&&this.context.gateway.snapshot.client===t&&this.currentAgentId()===n}async runBackfill(e){let t=this.context.gateway.snapshot.client,n=this.currentAgentId();if(!this.canAdmin||!t||!n||this.backfillBusy!==null||this.applyingProviderId!==null||e===`rollback`&&!this.backfillRollbackPending)return;let r=++this.backfillEpoch,i=()=>this.isCurrentBackfillRequest(r,t,n);this.backfillBusy=e,this.backfillError=null,e!==`rollback`&&(this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null);try{if(e===`rollback`){let e=await t.request(`memory.sessionBackfill.rollback`,{agentId:n});i()&&(this.backfillRollbackResult=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackPending=!1)}else if(e===`preview`){let e=await t.request(`memory.sessionBackfill.preview`,this.backfillRequest(n));i()&&(this.backfillPreview=e)}else{let e={days:0,candidates:0,staged:0,complete:!1};this.backfillProgress=e;let r=new Set;for(;;){let a=await t.request(`memory.sessionBackfill.apply`,this.backfillRequest(n));if(!i())return;if(a.candidates>0&&a.cursor?.advanced!==!0)throw Error(`Session backfill stopped because the server cursor did not advance.`);if(a.candidates===0&&a.cursor?.exhausted!==!0)throw Error(`Session backfill stopped because the server cursor was not exhausted.`);for(let e of a.perDay)r.add(e.day);if(e={days:r.size,candidates:e.candidates+a.candidates,staged:e.staged+a.staged,complete:a.candidates===0},this.backfillProgress=e,a.candidates===0)break}}}catch(e){i()&&(this.backfillError=a(e,`request failed`))}finally{i()&&(this.backfillBusy=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=Se({connected:e.phase===`connected`,canAdmin:this.canAdmin,agents:f(t?.agents??[]),selectedAgentId:n,plan:this.plan,loading:this.loading||this.context.agents.state.agentsLoading,error:(n?null:this.context.agents.state.agentsError)??this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,backfillAvailable:S(e,`memory.sessionBackfill.preview`)!==!1,backfillFrom:this.backfillFrom,backfillTo:this.backfillTo,backfillBusy:this.backfillBusy,backfillError:this.backfillError,backfillPreview:this.backfillPreview,backfillProgress:this.backfillProgress,backfillRollbackResult:this.backfillRollbackResult,backfillRollbackPending:this.backfillRollbackPending,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)},onBackfillFromChange:e=>{this.backfillFrom=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillToChange:e=>{this.backfillTo=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillPreview:()=>void this.runBackfill(`preview`),onBackfillApply:()=>void this.runBackfill(`apply`),onBackfillRollbackRequest:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!0,this.backfillError=null)},onBackfillRollbackConfirm:()=>void this.runBackfill(`rollback`),onBackfillRollbackCancel:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!1)}});return _`
      ${A({title:te(`memory-import`),subtitle:_`${ee(`memory-import`)}
        ${j(Z)}`})}
      ${B(r)}
    `}},T([se({context:ie,subscribe:!0})],Q.prototype,`context`,void 0),T([b()],Q.prototype,`replaceExisting`,void 0),T([b()],Q.prototype,`selectedByProvider`,void 0),T([b()],Q.prototype,`applyingProviderId`,void 0),T([b()],Q.prototype,`pendingImport`,void 0),T([b()],Q.prototype,`applyError`,void 0),T([b()],Q.prototype,`lastResults`,void 0),T([b()],Q.prototype,`backfillFrom`,void 0),T([b()],Q.prototype,`backfillTo`,void 0),T([b()],Q.prototype,`backfillBusy`,void 0),T([b()],Q.prototype,`backfillError`,void 0),T([b()],Q.prototype,`backfillPreview`,void 0),T([b()],Q.prototype,`backfillProgress`,void 0),T([b()],Q.prototype,`backfillRollbackResult`,void 0),T([b()],Q.prototype,`backfillRollbackPending`,void 0),customElements.get(`openclaw-memory-import-page`)||customElements.define(`openclaw-memory-import-page`,Q)})))()}$();
//# sourceMappingURL=memory-import-page-DYOfxQvw.js.map