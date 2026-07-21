import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{g as r,h as i,m as a,o}from"./lit-runtime-B2f-BITn.js";import{r as s}from"./i18n-Cb2Gon67.js";import{$ as c,B as l,Er as u,Fr as d,G as f,H as p,J as m,K as h,On as g,Pr as _,Q as v,V as y,W as b,X as x,Y as S,Yn as C,Z as w,at as T,ct as E,dn as D,et as O,it as k,lr as ee,lt as A,nt as j,ot as te,q as ne,r as re,rt as ie,st as ae,t as oe,tt as se,ur as ce,ut as le}from"./index-CSGke-Z7.js";var ue=`workboard-card-modal-title`,de=`workboard-card-modal-description`,fe=`workboard-card-modal`,pe=`workboard-card-detail-drawer`,me=`workboard-card-detail-title`,he=`workboard-card-detail-description`,ge=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),M=null,N=null,_e=[{id:`bugfix`,title:`Fix: `,notes:`Symptom:
Cause:
Acceptance:
Proof:`,labels:`fix, test`,priority:`high`},{id:`docs`,title:`Docs: `,notes:`Page:
Change:
Source proof:`,labels:`docs`,priority:`normal`},{id:`release`,title:`Release: `,notes:`Scope:
Verification:
Closeout:`,labels:`release`,priority:`urgent`},{id:`pr_review`,title:`Review PR `,notes:`Surface:
Risks:
Proof:`,labels:`review`,priority:`normal`},{id:`plugin`,title:`Plugin: `,notes:`Boundary:
Config/docs:
Tests:`,labels:`plugin`,priority:`normal`}];function P(e){return s(`workboard.status.${e}`)}function F(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ve(e){return e?ee(e,{month:`short`,day:`numeric`},``):``}function ye(e){return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function I(e){return e?ce(e,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`},``):``}function be(e){if(!e)return``;let t=Math.max(0,Date.now()-e),n=Math.floor(t/6e4);return n<1?s(`activity.duration.seconds`,{count:String(Math.floor(t/1e3))}):n<60?s(`activity.duration.minutes`,{minutes:String(n),seconds:`0`}):s(`workboard.ageHours`,{count:String(Math.floor(n/60))})}function xe(e,t=64){let n=e.trim();return n.length<=t?n:`${D(n,Math.max(0,t-1))}…`}function L(e){return e.canWrite!==!1&&le(w(e.host))}function Se(e){return e.canWrite!==!1}function R(e){if(e instanceof Element){N=e;return}N||=document.activeElement}function Ce(){let e=N;N=null,M=null,!(!(e instanceof HTMLElement)||!e.isConnected)&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function z(e){try{e.focus({preventScroll:!0})}catch{e.focus()}}function we(e){return!e.isConnected||e.tabIndex<0?!1:!e.closest(`[hidden], [inert]`)}function Te(e){return[...e.querySelectorAll(ge)].filter(we)}function Ee(e,t){requestAnimationFrame(()=>{if(!e.isConnected||M!==e)return;let n=document.activeElement;if(n instanceof Element&&e.contains(n))return;let r=t?e.querySelector(t):null;z(r&&we(r)?r:t?Te(e)[0]:e)})}function De(e,t){if(!(e instanceof HTMLElement)){let e=M;if(!e)return;if(!e.isConnected){Ce();return}queueMicrotask(()=>{M===e&&!e.isConnected&&Ce()});return}M!==e&&(R(null),M=e),Ee(e,t)}function Oe(e,t){let n=Te(t);if(n.length===0){e.preventDefault(),z(t);return}let r=document.activeElement instanceof HTMLElement?document.activeElement:null,i=n[0],a=n[n.length-1],o=r?t.contains(r):!1;if(e.shiftKey&&(!o||r===i||r===t)){e.preventDefault(),z(a);return}!e.shiftKey&&(!o||r===a||r===t)&&(e.preventDefault(),z(i))}function ke(e,t,n){if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),n(),t.onRequestUpdate?.();return}e.key===`Tab`&&Oe(e,e.currentTarget)}function Ae(e){switch(e.kind){case`created`:return s(`workboard.eventCreated`);case`edited`:return s(`workboard.eventEdited`);case`moved`:return e.toStatus?s(`workboard.eventMovedTo`,{status:P(e.toStatus)}):s(`workboard.eventMoved`);case`linked`:return s(`workboard.eventLinked`);case`specified`:return s(`workboard.eventSpecified`);case`decomposed`:return s(`workboard.eventDecomposed`);case`claimed`:return s(`workboard.eventClaimed`);case`heartbeat`:return s(`workboard.eventHeartbeat`);case`execution_updated`:return s(`workboard.eventExecutionUpdated`);case`attempt_started`:return s(`workboard.eventAttemptStarted`);case`attempt_updated`:return s(`workboard.eventAttemptUpdated`);case`comment_added`:return s(`workboard.eventCommentAdded`);case`link_added`:return s(`workboard.eventLinkAdded`);case`proof_added`:return s(`workboard.eventProofAdded`);case`artifact_added`:return s(`workboard.eventArtifactAdded`);case`attachment_added`:return s(`workboard.eventAttachmentAdded`);case`diagnostic`:return s(`workboard.eventDiagnostic`);case`notification`:return s(`workboard.eventNotification`);case`dispatch`:return s(`workboard.eventDispatch`);case`orchestration`:return s(`workboard.eventOrchestration`);case`protocol_violation`:return s(`workboard.eventProtocolViolation`);case`archived`:return s(`workboard.eventArchived`);case`unarchived`:return s(`workboard.eventUnarchived`);case`stale`:return s(`workboard.eventStale`)}return``}function je(e){let t=(e.events??[]).toReversed().slice(0,4);return t.length===0?i:r`
    <ol class="workboard-events" aria-label=${s(`workboard.eventsLabel`)}>
      ${t.map(e=>r`
          <li>
            <span>${Ae(e)}</span>
            <time>${ve(e.at)}</time>
          </li>
        `)}
    </ol>
  `}function Me(e,t){let n=e.metadata,a=[],o=n?.diagnostics?.toSorted((e,t)=>t.lastSeenAt-e.lastSeenAt)[0],c=e.status===`blocked`?n?.notifications?.at(-1)?.message??n?.workerProtocol?.detail??o?.detail:void 0;if(n?.templateId&&a.push(r`<span>${s(`workboard.template.${n.templateId}`)}</span>`),(t??e.taskId)&&a.push(r`<span>${s(`workboard.badgeTaskLinked`)}</span>`),n?.attempts?.length&&a.push(r`<span
        >${s(`workboard.badgeAttempts`,{count:String(n.attempts.length)})}</span
      >`),n?.failureCount&&a.push(r`
      <span class="workboard-card__badge--warning">
        ${u.alertTriangle}${s(`workboard.badgeFailures`,{count:String(n.failureCount)})}
      </span>
    `),n?.comments?.length&&a.push(r`<span
        >${s(`workboard.badgeComments`,{count:String(n.comments.length)})}</span
      >`),n?.proof?.length&&a.push(r`<span>${s(`workboard.badgeProof`,{count:String(n.proof.length)})}</span>`),n?.claim){a.push(r`<span>${s(`workboard.badgeClaimed`,{owner:n.claim.ownerId})}</span>`);let e=be(n.claim.lastHeartbeatAt);e&&a.push(r`<span>${s(`workboard.badgeHeartbeat`,{age:e})}</span>`)}return o&&a.push(r`<span class="workboard-card__badge--warning" title=${o.detail}>
        ${u.alertTriangle}${xe(o.title)}
      </span>`),c&&a.push(r`<span class="workboard-card__badge--warning" title=${c}>
        ${u.alertTriangle}${xe(c)}
      </span>`),n?.stale&&a.push(r`<span class="workboard-card__badge--warning"
        >${u.alertTriangle}${s(`workboard.badgeStale`)}</span
      >`),a.length===0?i:r` <div class="workboard-card__badges">${a}</div> `}function Ne(e,t){if(t.priority!==`all`&&e.priority!==t.priority)return!1;let n=t.query.trim().toLowerCase();return n?[e.title,e.notes,e.agentId,e.sessionKey,e.execution?.engine,e.execution?.mode,e.execution?.model,e.execution?.sessionKey,e.metadata?.templateId,e.metadata?.automation?.tenant,e.metadata?.automation?.idempotencyKey,e.metadata?.automation?.workspace?.kind,e.metadata?.automation?.workspace?.path,e.metadata?.automation?.workspace?.branch,...e.metadata?.automation?.skills??[],...e.metadata?.automation?.createdCardIds??[],...(e.metadata?.comments??[]).map(e=>e.body),...(e.metadata?.links??[]).flatMap(e=>[e.title,e.url,e.targetCardId]),...(e.metadata?.proof??[]).flatMap(e=>[e.label,e.command,e.url,e.note]),...(e.metadata?.artifacts??[]).flatMap(e=>[e.label,e.url,e.path,e.mimeType]),...(e.metadata?.attachments??[]).flatMap(e=>[e.fileName,e.mimeType,e.note]),...(e.metadata?.workerLogs??[]).map(e=>e.message),e.metadata?.workerProtocol?.state,e.metadata?.workerProtocol?.detail,e.metadata?.claim?.ownerId,...(e.metadata?.diagnostics??[]).flatMap(e=>[e.kind,e.severity,e.title,e.detail]),...(e.metadata?.notifications??[]).map(e=>e.message),...e.labels].filter(e=>typeof e==`string`).some(e=>e.toLowerCase().includes(n)):!0}function Pe(e,t){let n=e.filter(e=>e.status===t).map(e=>e.position);return(n.length?Math.max(...n):0)+1e3}function Fe(e){if(e.archived||e.kind===`global`)return!1;let t=[e.key,e.label,e.displayName].filter(e=>typeof e==`string`).join(`:`).toLowerCase();return!/(^|:)heartbeat(:|$)/.test(t)}function Ie(e){return e.target instanceof Element?!!e.target.closest(`button, a, input, select, textarea`):!1}function B(e,t){return e?.name??e?.identity?.name??e?.id??t}function Le(e,t){return e.agentId?.trim()||t?.defaultId||``}function Re(e,t){let n=Le(e,t);return n?t?.agents.find(e=>e.id===n):void 0}function ze(e,t){let n=e.agentId?.trim()||s(`workboard.defaultAgent`);return B(Re(e,t),n)}function Be(e,t,n){if(n===`all`)return!0;let r=e.agentId?.trim();return n==="default"?!r:r===n}function Ve(e){let t=new Set,n=V(e?.defaultId),r=[];for(let i of e?.agents??[]){let e=V(i.id);!e||t.has(e)||(t.add(e),r.push({id:e,label:B(i,e),isDefault:!!(n&&e===n)}))}return r}function V(e){return typeof e==`string`?e.trim():``}function He(e){return e.find(e=>e.isDefault)?.label??s(`workboard.defaultAgent`)}function Ue(e,t){let n=Ve(e),r=new Set(n.map(e=>e.id)),i=[...new Set(t.map(e=>V(e.agentId)).filter(e=>e&&!r.has(e)))].toSorted((e,t)=>e.localeCompare(t)),a=[{id:`all`,label:s(`workboard.allAgents`)},{id:`default`,label:s(`workboard.agentFilterUnassigned`,{agent:He(n)}),description:s(`workboard.agentFilterUnassignedHelp`)}];for(let e of n)a.push({id:e.id,label:e.isDefault?s(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label,...e.isDefault?{description:s(`workboard.agentFilterConfiguredDefaultHelp`)}:{}});for(let e of i)a.push({id:e,label:s(`workboard.agentCurrentUnconfigured`,{agent:e})});return a}function We(e,t){let n=Ve(e),r=V(t),i=r?n.some(e=>e.id===r):!0;return[{id:``,label:s(`workboard.agentFilterUnassigned`,{agent:He(n)})},...n.map(e=>({id:e.id,label:e.isDefault?s(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label})),...i?[]:[{id:r,label:s(`workboard.agentCurrentUnconfigured`,{agent:r})}]]}function Ge(e,t){return e.some(e=>e.id===t)?t:`all`}var H=!1,U=new WeakMap;function Ke(e=document){return!!e.querySelector(`.workboard-select[open]`)}function qe(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select`)||K(document)}function W(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select__menu`)||K(document)}function Je(){if(typeof document>`u`)return;let e=Ke(document);if(e&&!H){document.addEventListener(`pointerdown`,qe,!0),window.addEventListener(`scroll`,W,!0),window.addEventListener(`resize`,W),H=!0;return}!e&&H&&(document.removeEventListener(`pointerdown`,qe,!0),window.removeEventListener(`scroll`,W,!0),window.removeEventListener(`resize`,W),H=!1)}function Ye(e){e.open&&K(e.closest(`.workboard`)??e.getRootNode(),e)}function G(e,t=!1){let n=U.get(e);if(n&&(window.clearTimeout(n.resetTimer),U.delete(e)),e.open=!1,t){let t=e.querySelector(`.workboard-select__trigger`);t&&z(t)}}function K(e,t){for(let n of e.querySelectorAll(`.workboard-select[open]`))n!==t&&G(n,n.contains(document.activeElement));Je()}function Xe(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select`)||K(e.currentTarget)}function Ze(e){let t=e.querySelector(`.workboard-select__trigger`),n=e.querySelector(`.workboard-select__menu`);if(!t||!n)return;if(!e.open){n.style.removeProperty(`--workboard-select-menu-left`),n.style.removeProperty(`--workboard-select-menu-top`),n.style.removeProperty(`--workboard-select-menu-width`),n.style.removeProperty(`--workboard-select-menu-max-height`);return}let r=t.getBoundingClientRect(),i=window.innerWidth||document.documentElement.clientWidth,a=window.innerHeight||document.documentElement.clientHeight,o=Math.max(180,Math.min(r.width,i-24)),s=Math.min(Math.max(12,r.left),i-o-12),c=a-r.bottom-12-6,l=r.top-12-6,u=c<220&&l>c,d=Math.max(140,Math.min(320,u?l:c));n.style.setProperty(`--workboard-select-menu-left`,`${s}px`),n.style.setProperty(`--workboard-select-menu-width`,`${o}px`),n.style.setProperty(`--workboard-select-menu-max-height`,`${d}px`);let f=Math.min(d,n.getBoundingClientRect().height||n.scrollHeight||d),p=u?Math.max(12,r.top-6-f):Math.min(r.bottom+6,a-12-d);n.style.setProperty(`--workboard-select-menu-top`,`${p}px`)}function Qe(e){return[...e.querySelectorAll(`.workboard-select__option:not(:disabled)`)]}function $e(e,t){e.open||(e.open=!0,Ye(e),Ze(e),Je()),z(t),t.scrollIntoView?.({block:`nearest`})}function et(e,t){let n=Qe(e);if(n.length===0)return;let r=n.indexOf(document.activeElement),i=n.findIndex(e=>e.getAttribute(`aria-selected`)===`true`),a=Math.max(i,0);t===`first`?a=0:t===`last`?a=n.length-1:r>=0&&(a=t===`next`?(r+1)%n.length:(r-1+n.length)%n.length),$e(e,n[a]??n[0])}function tt(e,t){let n=U.get(e);n&&window.clearTimeout(n.resetTimer);let r=t.toLocaleLowerCase(),i=`${n?.query??``}${r}`,a=i===r.repeat(i.length)?r:i,o=window.setTimeout(()=>U.delete(e),500);U.set(e,{query:a,resetTimer:o});let s=Qe(e),c=s.indexOf(document.activeElement),l=[...s.slice(c+1),...s.slice(0,c+1)].find(e=>e.querySelector(`.workboard-select__label`)?.textContent?.trim().toLocaleLowerCase().startsWith(a));l&&$e(e,l)}function nt(e){let t=e.currentTarget,n=e.target,r=t.querySelector(`.workboard-select__trigger`);if(e.key===`Escape`&&t.open){G(t,!0),e.preventDefault(),e.stopPropagation();return}if(n===r&&(e.key===`Enter`||e.key===` `)){e.preventDefault(),t.open?G(t,!0):et(t,`next`);return}if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault(),et(t,e.key===`ArrowDown`?`next`:`previous`);return}if(e.key===`Home`||e.key===`End`){e.preventDefault(),et(t,e.key===`Home`?`first`:`last`);return}n instanceof HTMLButtonElement&&e.key===` `||e.key.length===1&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.isComposing&&(e.preventDefault(),tt(t,e.key))}function q(e){let t=e.options.find(t=>t.value===e.value)?.label??e.value,n=r`
    <details
      class="workboard-select ${e.className??``}"
      @toggle=${e=>{let t=e.currentTarget;Ye(t),Ze(t),Je()}}
      @keydown=${nt}
      @focusout=${e=>{let t=e.currentTarget;(!(e.relatedTarget instanceof Node)||!t.contains(e.relatedTarget))&&G(t)}}
    >
      <summary
        class="input workboard-select__trigger"
        aria-label=${`${e.label}: ${t}`}
        aria-haspopup="listbox"
      >
        <span class="workboard-select__value">${t}</span>
        <span class="workboard-select__chevron" aria-hidden="true">${u.chevronDown}</span>
      </summary>
      <div class="workboard-select__menu" role="listbox" aria-label=${e.label}>
        ${e.options.map(t=>{let n=t.value===e.value;return r`
            <button
              class="workboard-select__option ${n?`is-selected`:``}"
              type="button"
              role="option"
              tabindex="-1"
              aria-selected=${n}
              aria-disabled=${t.disabled===!0}
              ?disabled=${t.disabled}
              @click=${n=>{if(t.disabled)return;e.onChange(t.value);let r=n.currentTarget.closest(`details`);r&&G(r,!0),e.requestUpdate?.()}}
            >
              <span class="workboard-select__check" aria-hidden="true">
                ${n?u.check:i}
              </span>
              <span class="workboard-select__copy">
                <span class="workboard-select__label">${t.label}</span>
                ${t.description?r`<span class="workboard-select__description">${t.description}</span>`:i}
              </span>
            </button>
          `})}
      </div>
    </details>
  `;return e.showLabel===!1?n:r`
    <div class="workboard-field">
      <span>${e.label}</span>
      ${n}
    </div>
  `}function rt(e){return s(e===`codex`?`workboard.engineOpenAI`:`workboard.engineClaude`)}function it(e,t,n){if(!n)return null;let r=Re(t,e.agentsList),i=r?.agentRuntime?.id?.trim();if(!i)return null;let a=i.toLowerCase();return a===`openclaw`||a===`pi`?null:s(`workboard.engineDisabledRuntime`,{agent:B(r,t.agentId??s(`workboard.defaultAgent`)),runtime:i})}function at(e,t){let n=ze(t,e.agentsList);return r`<span class="workboard-agent-chip" title=${t.agentId?s(`workboard.agentLinked`,{agent:n}):s(`workboard.agentDefaultLinked`,{agent:n})}>${n}</span>`}function ot(e){return r`
    <span class="workboard-engine-mark workboard-engine-mark--${e}" aria-hidden="true">
      ${e===`codex`?`OpenAI`:`Claude`}
    </span>
  `}function st(e,t,n,r){n===t.status||r.busyCardIds.has(t.id)||r.dispatching||!e.connected||!e.client||c({host:e.host,client:e.client,cardId:t.id,status:n,position:Pe(r.cards,n),requestUpdate:e.onRequestUpdate})}function ct(e,t,n,a={}){let o=w(e.host),c=o.statuses.includes(t.status)?o.statuses:[t.status,...o.statuses];return c.length<2?i:r`
    <label
      class="workboard-card__move ${a.wide?`workboard-card__move--wide`:``}"
      title=${s(`workboard.fieldStatus`)}
    >
      <span class="workboard-card__move-icon" aria-hidden="true">${u.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${s(`workboard.fieldStatus`)}: ${t.title}`}
        .value=${t.status}
        ?disabled=${n||!e.connected||!e.client}
        @change=${n=>{let r=n.currentTarget;st(e,t,r.value,o)}}
        @keydown=${n=>{if(n.key!==`ArrowLeft`&&n.key!==`ArrowRight`)return;if(o.busyCardIds.has(t.id)||o.dispatching||!e.connected||!e.client){n.preventDefault();return}let r=c.indexOf(t.status),i=n.key===`ArrowRight`?1:-1,a=c[r+i];a&&(n.preventDefault(),st(e,t,a,o))}}
      >
        ${c.map(e=>r`<option value=${e} ?selected=${e===t.status}>
              ${P(e)}
            </option>`)}
      </select>
    </label>
  `}function J(e){return r`
    <span class="workboard-card__action-slot">
      ${e===i?r`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>`:e}
    </span>
  `}function lt(e,t){let n=w(e.host),r=n.tasksByCardId.get(t.id),i=m(t,e.sessions),a=n.busyCardIds.has(t.id)||n.dispatching,o=Dt(t,r,n.missingTaskIds),s=L(e);return{state:n,task:r,session:i,busy:a,activeTask:o,live:o||Ot(t)||i?.hasActiveRun===!0||i?.hasActiveRun!==!1&&i?.status===`running`,linkedSessionKey:t.sessionKey??t.execution?.sessionKey,writable:s,showStartControls:s&&kt(n,e.sessions,t),archived:!!t.metadata?.archivedAt}}function Y(e){let t=r`
    <button
      class=${e.iconOnly?`btn btn--icon workboard-card__icon ${e.className??``}`:`btn ${e.className??``}`}
      type="button"
      aria-label=${e.label}
      aria-haspopup=${e.ariaHaspopup??i}
      ?disabled=${e.disabled}
      @click=${e.onClick}
    >
      ${e.icon}${e.iconOnly?i:r`<span>${e.label}</span>`}
    </button>
  `;return e.iconOnly?r`<openclaw-tooltip .content=${e.label}>${t}</openclaw-tooltip>`:t}function ut(e,t,n={}){let r=w(e.host);return Y({label:s(`workboard.editCard`),icon:u.edit,iconOnly:n.iconOnly,ariaHaspopup:`dialog`,disabled:r.dispatching,onClick:n=>{R(n.currentTarget),yt(r,t),e.onRequestUpdate?.()}})}function dt(e,t,n,r,i={}){return Y({label:s(r?`workboard.unarchiveCard`:`workboard.archiveCard`),icon:r?u.archiveRestore:u.archive,iconOnly:i.iconOnly,disabled:n,onClick:()=>{p({host:e.host,client:e.client,cardId:t.id,archived:!r,requestUpdate:e.onRequestUpdate})}})}function ft(e,t,n={}){return t?Y({label:s(`workboard.openSession`),icon:u.messageSquare,iconOnly:n.iconOnly,onClick:()=>e.onOpenSession(t)}):i}function pt(e,t,n,r={}){return Y({label:s(`workboard.stopSession`),icon:u.stop,iconOnly:r.iconOnly,disabled:n||!e.connected,onClick:()=>{ie({host:e.host,client:e.client,card:t,requestUpdate:e.onRequestUpdate})}})}function mt(e,t,n,r={}){return Y({label:s(`workboard.deleteCard`),icon:u.trash,iconOnly:r.iconOnly,className:`workboard-card__delete`,disabled:n,onClick:()=>{f({host:e.host,client:e.client,cardId:t.id,requestUpdate:e.onRequestUpdate})}})}function ht(e,t){e.detailCardId=t.id,e.detailCommentBody=``}function gt(e){e.detailCardId=null,e.detailCommentBody=``}function _t(e){if(!e.detailCardId||e.draftOpen)return null;let t=e.cards.find(t=>t.id===e.detailCardId)??null;return!t||t.metadata?.archivedAt&&!e.showArchived?null:t}function X(e){let t=e.loaded&&e.mutationReadiness===`stale_edit_draft`;e.draftOpen=!1,e.editingCardId=null,e.draftTitle=``,e.draftNotes=``,e.draftStatus=`todo`,e.draftPriority=`normal`,e.draftLabels=``,e.draftAgentId=``,e.draftSessionKey=``,e.draftTemplateId=``,e.draftCommentBody=``,t&&(e.mutationReadiness=`ready`)}function vt(e){X(e),e.draftOpen=!0}function yt(e,t){e.draftOpen=!0,e.editingCardId=t.id,e.draftTitle=t.title,e.draftNotes=t.notes??``,e.draftStatus=t.status,e.draftPriority=t.priority,e.draftLabels=t.labels.join(`, `),e.draftAgentId=t.agentId??``,e.draftSessionKey=t.sessionKey??``,e.draftTemplateId=t.metadata?.templateId??``,e.draftCommentBody=``}function bt(e,t){let n=_e.find(e=>e.id===t);n&&(e.draftTemplateId=n.id,e.draftTitle=n.title,e.draftNotes=n.notes,e.draftLabels=n.labels,e.draftPriority=n.priority)}function xt(e){let t=w(e.host),n=We(e.agentsList,t.draftAgentId),a=e.sessions.filter(Fe),c=t.statuses.map(e=>({value:e,label:P(e)})),d=l.map(e=>({value:e,label:F(e)})),f=n.map(e=>({value:e.id,label:e.label})),p=[{value:``,label:s(`workboard.noLinkedSession`)},...a.map(e=>({value:e.key,label:e.displayName??e.label??e.key}))];if(!t.draftOpen)return i;let m=!!t.editingCardId,h=(t.editingCardId?t.cards.find(e=>e.id===t.editingCardId)??null:null)?.metadata?.comments??[],g=m&&t.busyCardIds.has(t.editingCardId??``),_=!L(e)||t.loading||t.dispatching||g;return r`
    <div
      class="workboard-modal"
      role="presentation"
      @click=${n=>{n.target===n.currentTarget&&(X(t),e.onRequestUpdate?.())}}
    >
      <form
        id=${fe}
        class="workboard-draft"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${ue}
        aria-describedby=${de}
        tabindex="-1"
        ${o(e=>De(e,`[data-workboard-autofocus='true']`))}
        @keydown=${n=>ke(n,e,()=>X(t))}
        @submit=${t=>{t.preventDefault(),!_&&se({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${ue}>
              ${s(m?`workboard.editCard`:`workboard.newCard`)}
            </h2>
            <p id=${de}>
              ${s(m?`workboard.editCardHelp`:`workboard.newCardHelp`)}
            </p>
          </div>
          <openclaw-tooltip .content=${s(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${s(`common.cancel`)}
              @click=${()=>{X(t),e.onRequestUpdate?.()}}
            >
              ${u.x}
            </button>
          </openclaw-tooltip>
        </div>
        <div class="workboard-draft__body">
          ${m?i:r`
                <div class="workboard-template-strip" aria-label=${s(`workboard.templatesLabel`)}>
                  ${_e.map(n=>r`
                      <button
                        class="btn btn--xs ${t.draftTemplateId===n.id?`workboard-template-strip__button--active`:``}"
                        type="button"
                        @click=${()=>{bt(t,n.id),e.onRequestUpdate?.()}}
                      >
                        ${s(`workboard.template.${n.id}`)}
                      </button>
                    `)}
                </div>
              `}
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${s(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                data-workboard-autofocus="true"
                placeholder=${s(`workboard.titlePlaceholder`)}
                .value=${t.draftTitle}
                @input=${n=>{t.draftTitle=n.currentTarget.value,e.onRequestUpdate?.()}}
              />
            </label>
            <label class="workboard-field">
              <span>${s(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${s(`workboard.notesPlaceholder`)}
                .value=${t.draftNotes}
                @input=${n=>{t.draftNotes=n.currentTarget.value,e.onRequestUpdate?.()}}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${q({value:t.draftStatus,options:c,label:s(`workboard.fieldStatus`),onChange:e=>{t.draftStatus=e},requestUpdate:e.onRequestUpdate})}
            ${q({value:t.draftPriority,options:d,label:s(`workboard.fieldPriority`),onChange:e=>{t.draftPriority=e},requestUpdate:e.onRequestUpdate})}
            ${q({value:t.draftAgentId,options:f,label:s(`workboard.fieldAgent`),onChange:e=>{t.draftAgentId=e},requestUpdate:e.onRequestUpdate})}
            ${q({value:t.draftSessionKey,options:p,label:s(`workboard.fieldSession`),onChange:e=>{t.draftSessionKey=e},requestUpdate:e.onRequestUpdate})}
            <label class="workboard-field workboard-field--wide">
              <span>${s(`workboard.fieldLabels`)}</span>
              <input
                class="input"
                placeholder=${s(`workboard.labelsPlaceholder`)}
                .value=${t.draftLabels}
                @input=${n=>{t.draftLabels=n.currentTarget.value,e.onRequestUpdate?.()}}
              />
            </label>
          </div>
          ${m?r`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${s(`workboard.badgeComments`,{count:String(h.length)})}
                  </span>
                  ${h.length?r`
                        <ol>
                          ${h.map(e=>r`<li>${e.body}</li>`)}
                        </ol>
                      `:i}
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    .value=${t.draftCommentBody}
                    @input=${n=>{t.draftCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn"
                      type="button"
                      ?disabled=${_||!t.draftCommentBody.trim()}
                      @click=${()=>{y({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
                    >
                      ${u.plus} ${s(`common.create`)}
                    </button>
                  </div>
                </section>
              `:i}
        </div>
        <div class="workboard-modal__actions">
          <button class="btn primary" ?disabled=${_||!t.draftTitle.trim()}>
            ${s(m?`common.save`:`common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            @click=${()=>{X(t),e.onRequestUpdate?.()}}
          >
            ${s(`common.cancel`)}
          </button>
        </div>
      </form>
    </div>
  `}function St(e){switch(e.state){case`running`:return{label:s(`workboard.lifecycleRunning`),detail:s(`workboard.lifecycleRunningDetail`),tone:`live`};case`succeeded`:return{label:s(`workboard.lifecycleDone`),detail:s(`workboard.lifecycleDoneDetail`),tone:`done`};case`failed`:return{label:s(`workboard.lifecycleNeedsReview`),detail:s(`workboard.lifecycleNeedsReviewDetail`),tone:`blocked`};case`stale`:return{label:s(`workboard.lifecycleStale`),detail:s(`workboard.lifecycleStaleDetail`),tone:`blocked`};case`idle`:return{label:s(`workboard.lifecycleLinked`),detail:s(`workboard.lifecycleIdleDetail`),tone:`idle`};case`missing`:return{label:s(`workboard.lifecycleMissing`),detail:s(`workboard.lifecycleMissingDetail`),tone:`blocked`};case`unlinked`:return{label:s(`workboard.lifecycleUnlinked`),detail:s(`workboard.lifecycleUnlinkedDetail`),tone:`idle`}}throw Error(`Unknown workboard lifecycle state.`)}function Ct(e){return e.status===`queued`||e.status===`running`?e.progressSummary??e.title??e.taskId:e.terminalSummary??e.error??e.progressSummary??e.title??e.taskId}function wt(e,t){switch(e.status){case`queued`:case`running`:return t.state===`running`;case`completed`:return t.state===`succeeded`;case`failed`:case`cancelled`:case`timed_out`:return t.state===`failed`}return!1}function Tt(e){return e?.status===`queued`||e?.status===`running`}function Et(e,t,n){return!!(e.taskId&&!t&&!n.has(e.taskId))}function Dt(e,t,n){return Tt(t)||e.status===`running`&&Et(e,t,n)}function Ot(e){let t=e.sessionKey??e.execution?.sessionKey,n=e.runId??e.execution?.runId;return e.status===`running`&&!!(t&&n)}function kt(e,t,n){let r=e.tasksByCardId.get(n.id),i=m(n,t),a=Tt(r)||Et(n,r,e.missingTaskIds),o=n.sessionKey??n.execution?.sessionKey;return!a&&!Ot(n)&&(!o||!i)}function At(e){if(e.missing)return s(`workboard.dependencyMissing`,{parent:e.title});let t=e.status?P(e.status):s(`workboard.unknownStatus`);return`${e.title} (${t})`}function jt(e){return e.blockedParents.length===0?null:s(`workboard.dependenciesBlockedTitle`,{parents:e.blockedParents.map(At).join(`, `)})}function Mt(e){if(e.parents.length===0)return i;let t=e.blockedParents.length;return r`
    <div class="workboard-dependencies" title=${jt(e)??s(`workboard.dependenciesReadyTitle`,{count:String(e.parents.length)})}>
      ${t>0?r`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${u.alertTriangle}${s(`workboard.dependenciesBlocked`,{count:String(t)})}
            </span>
          `:r`
            <span class="workboard-dependency workboard-dependency--ready">
              ${s(`workboard.dependenciesReady`,{count:String(e.parents.length)})}
            </span>
          `}
    </div>
  `}function Nt(e){return e.parents.length===0?i:r`
    <section class="workboard-detail__section">
      <h3>${s(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${e.parents.map(e=>r`
            <li class=${e.done?`is-done`:`is-blocked`}>
              ${e.done?r`<span class="workboard-detail__dependency-spacer"></span>`:u.alertTriangle}
              <span>${e.title}</span>
              <span>
                ${e.missing?s(`workboard.dependencyStatusMissing`):e.status?P(e.status):s(`workboard.unknownStatus`)}
              </span>
            </li>
          `)}
      </ul>
    </section>
  `}function Pt(e,t,n){let i=x(e,t,n),a=St(i),o=i.session,c=e.execution,l=i.state===`stale`,u=n?wt(n,i):!1,d=n&&u?s(`workboard.taskStatus.${n.status}`):null;return r`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${a.tone}">
        ${d??(l||!c?a.label:`${c.engine} ${c.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${n&&u?Ct(n):l?a.detail:o?.displayName??o?.label??a.detail}
      </span>
    </div>
  `}function Z(e,t,n,a,o={}){let c=w(e.host),l=c.busyCardIds.has(t.id)||c.dispatching,d=it(e,t,n),f=l||!e.connected||!!d||!!t.metadata?.archivedAt,p=d||(n?s(a===`autonomous`?`workboard.runEngine`:`workboard.openEngine`,{engine:rt(n)}):s(`workboard.runDefaultAgent`)),m=r`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${a} ${o.iconOnly?`workboard-card__start--icon`:``} ${n?``:`workboard-card__start--default`}"
      type="button"
      aria-label=${p}
      ?disabled=${f}
      @click=${async()=>{let r=await j({host:e.host,client:e.client,card:t,...n?{engine:n}:{},mode:a,requestUpdate:e.onRequestUpdate});r&&e.onOpenSession(r)}}
    >
      ${n?r`${ot(n)}${o.iconOnly?i:r`<span
                >${s(a===`autonomous`?`workboard.run`:`workboard.open`)}</span
              >`}`:r`${a===`autonomous`?u.play:u.penLine}${o.iconOnly?i:r`<span>${s(`workboard.start`)}</span>`}`}
    </button>
  `;return o.iconOnly?r`<openclaw-tooltip .content=${p}>${m}</openclaw-tooltip>`:m}function Ft(e,t){let n=e.canModelOverride!==!1;return r`
    <div class="workboard-card__execution-controls">
      ${Z(e,t,null,`autonomous`)}
      ${n?r`${Z(e,t,`codex`,`autonomous`)}
          ${Z(e,t,`claude`,`autonomous`)}`:i}
      ${Z(e,t,`codex`,`manual`)}
      ${Z(e,t,`claude`,`manual`)}
    </div>
  `}function Q(e,t){if(typeof t!=`string`&&typeof t!=`number`)return i;let n=String(t).trim();return n?r`
    <div class="workboard-detail__row">
      <span>${e}</span>
      <strong>${n}</strong>
    </div>
  `:i}function $(e,t,n=i){let a=t.map(e=>e.trim()).filter(Boolean).slice(-6);return a.length===0?n:r`
    <section class="workboard-detail__section">
      <h3>${e}</h3>
      <ol class="workboard-detail__list">
        ${a.map(e=>r`<li>${e}</li>`)}
      </ol>
    </section>
  `}function It(e){let t=w(e.host),n=_t(t);if(!n)return i;let{task:a,busy:c,activeTask:l,live:d,linkedSessionKey:f,writable:p,showStartControls:m,archived:h}=lt(e,n),g=x(n,e.sessions,a),_=St(g),v=a?wt(a,g):!1,b=n.metadata?.comments??[],C=n.metadata?.attempts??[],T=n.metadata?.links??[],E=n.metadata?.proof??[],D=n.metadata?.artifacts??[],O=n.metadata?.attachments??[],k=n.metadata?.diagnostics??[],ee=n.metadata?.workerLogs??[],A=n.metadata?.workerProtocol,j=n.metadata?.automation,te=(n.events??[]).slice(-6).toReversed(),ne=S(n,t.cards);return r`
    <aside
      id=${pe}
      class="workboard-detail-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby=${me}
      aria-describedby=${he}
      tabindex="-1"
      ${o(e=>De(e))}
      @keydown=${n=>ke(n,e,()=>gt(t))}
    >
      <div class="workboard-detail">
        <header class="workboard-detail__header">
          <div>
            <span class="workboard-card__priority">${F(n.priority)}</span>
            <h2 id=${me}>
              <span class="workboard-sr-only">${s(`workboard.detailTitle`)}: </span>${n.title}
            </h2>
          </div>
          <openclaw-tooltip .content=${s(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${s(`common.cancel`)}
              @click=${()=>{gt(t),e.onRequestUpdate?.()}}
            >
              ${u.x}
            </button>
          </openclaw-tooltip>
        </header>

        <section class="workboard-detail__section">
          <div class="workboard-card__lifecycle">
            <span class="workboard-lifecycle workboard-lifecycle--${_.tone}">
              ${_.label}
            </span>
            <span id=${he} class="workboard-card__lifecycle-detail">
              ${a&&v?Ct(a):g.session?.displayName??_.detail}
            </span>
          </div>
          <div class="workboard-detail__grid">
            ${Q(s(`workboard.fieldStatus`),P(n.status))}
            ${Q(s(`workboard.fieldAgent`),n.agentId??s(`workboard.defaultAgent`))}
            ${Q(s(`workboard.detailTask`),a?.taskId??n.taskId)}
            ${Q(s(`workboard.fieldSession`),f)}
            ${Q(s(`workboard.detailRun`),n.runId??n.execution?.runId)}
            ${Q(s(`workboard.detailUpdated`),I(n.updatedAt))}
          </div>
        </section>

        ${n.notes?r`
              <section class="workboard-detail__section">
                <h3>${s(`workboard.fieldNotes`)}</h3>
                <p>${n.notes}</p>
              </section>
            `:i}
        ${Nt(ne)}
        ${$(s(`workboard.fieldLabels`),n.labels)}
        ${$(s(`workboard.badgeAttempts`,{count:String(C.length)}),C.map(e=>[e.status,e.model,e.sessionKey,e.error].filter(Boolean).join(` - `)))}
        ${$(s(`workboard.badgeLinks`,{count:String(T.length)}),T.map(e=>[e.type,e.title,e.targetCardId,e.url].filter(Boolean).join(` - `)))}
        ${$(s(`workboard.detailProof`),E.map(e=>[e.status,e.label,e.command,e.url,e.note].filter(Boolean).join(` - `)))}
        ${$(s(`workboard.badgeArtifacts`,{count:String(D.length)}),D.map(e=>[e.label,e.url,e.path,e.mimeType].filter(Boolean).join(` - `)))}
        ${$(s(`workboard.badgeAttachments`,{count:String(O.length)}),O.map(e=>[e.fileName,e.mimeType,e.note].filter(Boolean).join(` - `)))}
        ${$(s(`workboard.detailDiagnostics`),k.map(e=>`${e.severity}: ${e.title}`))}
        ${$(s(`workboard.detailWorkerLogs`),ee.map(e=>`${e.level}: ${e.message}`))}
        ${A?$(s(`workboard.detailWorkerProtocol`),[A.state,A.detail??``,A.updatedAt?s(`workboard.detailUpdatedValue`,{time:I(A.updatedAt)}):``]):i}
        ${j?$(s(`workboard.detailAutomation`),[j.tenant?s(`workboard.detailAutomationTenant`,{tenant:j.tenant}):``,j.boardId?s(`workboard.detailAutomationBoard`,{board:j.boardId}):``,j.skills?.length?s(`workboard.detailAutomationSkills`,{skills:j.skills.join(`, `)}):``,j.workspace?s(`workboard.detailAutomationWorkspace`,{workspace:[j.workspace.kind,j.workspace.path,j.workspace.branch].filter(Boolean).join(` `)}):``,j.dispatchCount?s(`workboard.badgeDispatches`,{count:String(j.dispatchCount)}):``,j.lastDispatchAt?s(`workboard.detailUpdatedValue`,{time:I(j.lastDispatchAt)}):``,j.summary?s(`workboard.detailAutomationSummary`,{summary:j.summary}):``]):i}
        ${$(s(`workboard.eventsLabel`),te.map(e=>`${Ae(e)} ${I(e.at)}`))}

        <section class="workboard-detail__section">
          <h3>${s(`workboard.detailOperatorNotes`)}</h3>
          ${b.length?r`
                <ol class="workboard-detail__list">
                  ${b.slice(-6).map(e=>r`<li>${e.body}</li>`)}
                </ol>
              `:r`<p>${s(`workboard.detailNoNotes`)}</p>`}
          ${p?r`
                <textarea
                  class="input workboard-detail__note"
                  maxlength="2000"
                  placeholder=${s(`workboard.detailNotePlaceholder`)}
                  .value=${t.detailCommentBody}
                  @input=${n=>{t.detailCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                ></textarea>
                <button
                  class="btn"
                  type="button"
                  ?disabled=${c||!t.detailCommentBody.trim()}
                  @click=${()=>y({host:e.host,client:e.client,cardId:n.id,body:t.detailCommentBody,requestUpdate:e.onRequestUpdate})}
                >
                  ${u.plus} ${s(`workboard.detailAddNote`)}
                </button>
              `:i}
        </section>

        <div class="workboard-detail__actions">
          ${p&&!h?ut(e,n):i}
          ${p?dt(e,n,c,h):i}
          ${p?ct(e,n,c,{wide:!0}):i}
          ${p&&(f?d:l)?pt(e,n,c):i}
          ${ft(e,f)}
          ${p?mt(e,n,c):i}
          ${m?Ft(e,n):i}
        </div>
      </div>
    </aside>
  `}function Lt(e){let t=e.lastDispatchSummary;return t?r`
    <div class="callout">
      ${s(t.started+t.failures+t.promoted+t.blocked+t.reclaimed+t.orchestrated===0?`workboard.dispatchSummaryEmpty`:`workboard.dispatchSummary`,{started:String(t.started),failures:String(t.failures),promoted:String(t.promoted),blocked:String(t.blocked),reclaimed:String(t.reclaimed),orchestrated:String(t.orchestrated)})}
    </div>
  `:i}function Rt(e,t,n){let i=[[`running`,s(`workboard.healthRunning`),t.running],[`blocked`,s(`workboard.healthBlocked`),t.blocked],[`stale`,s(`workboard.healthStale`),t.stale],[`readyUnassigned`,s(`workboard.healthReadyUnassigned`),t.readyUnassigned],[`missingProof`,s(`workboard.healthMissingProof`),t.missingProof],[`failedAttempts`,s(`workboard.healthFailedAttempts`),t.failedAttempts]];return r`
    <div class="workboard-health" aria-label=${s(`workboard.healthLabel`)}>
      ${i.map(([t,i,a])=>r`
          <button
            class="workboard-health__item workboard-health__item--${t} ${e.activeHealthHighlight===t?`workboard-health__item--active`:``} ${a===0?`workboard-health__item--empty`:``}"
            type="button"
            aria-pressed=${e.activeHealthHighlight===t}
            aria-label=${`${a} ${i}`}
            @click=${()=>{e.activeHealthHighlight=e.activeHealthHighlight===t?null:t,n?.()}}
          >
            <strong>${a}</strong>${i}
          </button>
        `)}
    </div>
  `}function zt(e){return e.lastRefreshAt?r`<span
      class="workboard-refresh-status ${e.lastRefreshError?`workboard-refresh-status--error`:``}"
      title=${e.lastRefreshError?s(`workboard.refreshError`):``}
    >
      ${s(`workboard.lastRefreshed`,{time:ye(e.lastRefreshAt)})}
    </span>`:e.lastRefreshError?r`<span class="workboard-refresh-status workboard-refresh-status--error">
      ${s(`workboard.refreshError`)}
    </span>`:i}function Bt(){return r`
    <div class="workboard-empty-state" role="status">
      <strong>${s(`workboard.emptyFilteredTitle`)}</strong>
      <span>${s(`workboard.emptyFilteredHint`)}</span>
    </div>
  `}var Vt=[{value:0,labelKey:`workboard.autoRefreshOff`},{value:5e3,labelKey:`workboard.autoRefresh5s`},{value:15e3,labelKey:`workboard.autoRefresh15s`},{value:3e4,labelKey:`workboard.autoRefresh30s`},{value:6e4,labelKey:`workboard.autoRefresh60s`}],Ht=[{value:`all`,labelKey:`workboard.viewAll`},{value:`default_agent`,labelKey:`workboard.viewDefaultAgent`},{value:`ready`,labelKey:`workboard.viewReady`},{value:`running`,labelKey:`workboard.viewRunning`},{value:`blocked`,labelKey:`workboard.viewBlocked`},{value:`review`,labelKey:`workboard.viewReview`},{value:`stale`,labelKey:`workboard.viewStale`},{value:`missing_proof`,labelKey:`workboard.viewMissingProof`},{value:`recently_done`,labelKey:`workboard.viewRecentlyDone`}];function Ut(e,t){let{state:n,task:a,busy:o,activeTask:c,live:l,linkedSessionKey:d,writable:f,showStartControls:p,archived:m}=lt(e,t),h=n.syncingCardIds.has(t.id),g=n.activeHealthHighlight?E(t,n.activeHealthHighlight,e.sessions,a):!1,_=S(t,n.cards),v=p?Z(e,t,null,`autonomous`,{iconOnly:!0}):i,y=f&&!m?ut(e,t,{iconOnly:!0}):i,b=f?dt(e,t,o,m,{iconOnly:!0}):i,x=r`
    <openclaw-tooltip .content=${s(`workboard.viewDetails`)}>
      <button
        class="btn btn--icon workboard-card__icon"
        aria-label=${s(`workboard.viewDetails`)}
        aria-haspopup="dialog"
        aria-expanded=${n.detailCardId===t.id?`true`:`false`}
        aria-controls=${pe}
        @click=${r=>{R(r.currentTarget),ht(n,t),e.onRequestUpdate?.()}}
      >
        ${u.panelRightOpen}
      </button>
    </openclaw-tooltip>
  `,C=ft(e,d,{iconOnly:!0}),w=f&&(d?l:c)?pt(e,t,o,{iconOnly:!0}):i,T=f?ct(e,t,o):i,D=f?mt(e,t,o,{iconOnly:!0}):i;return r`
    <article
      class="workboard-card priority-${t.priority} ${o?`workboard-card--busy`:``} ${m?`workboard-card--archived`:``} ${g?`workboard-card--health-highlight workboard-card--health-highlight-${n.activeHealthHighlight}`:``} workboard-card--openable"
      role="button"
      tabindex="0"
      title=${s(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${n.detailCardId===t.id?`true`:`false`}
      aria-controls=${pe}
      draggable=${f&&!n.dispatching?`true`:`false`}
      @click=${r=>{Ie(r)||(R(r.currentTarget),ht(n,t),e.onRequestUpdate?.())}}
      @keydown=${r=>{Ie(r)||r.key!==`Enter`&&r.key!==` `||(R(r.currentTarget),ht(n,t),e.onRequestUpdate?.(),r.preventDefault())}}
      @dragstart=${r=>{if(!f||n.dispatching){r.preventDefault();return}n.draggedCardId=t.id,r.dataTransfer?.setData(`text/plain`,t.id),r.dataTransfer?.setDragImage(r.currentTarget,16,16),e.onRequestUpdate?.()}}
      @dragend=${()=>{n.draggedCardId=null,e.onRequestUpdate?.()}}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${s(`workboard.detailUpdatedValue`,{time:I(t.updatedAt)})}
          aria-label=${s(`workboard.detailUpdatedValue`,{time:I(t.updatedAt)})}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${u.clock}</span>
          <span>${I(t.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${J(v)} ${J(y)}
          ${J(b)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${F(t.priority)}</span>
        ${at(e,t)}
        ${m?r`<span class="workboard-card__archived">${s(`workboard.archived`)}</span>`:i}
        ${l?r`<span class="workboard-live">${s(`workboard.live`)}</span>`:i}
        ${h?r`<span class="workboard-live">${s(`common.saving`)}</span>`:i}
      </div>
      <h3>${t.title}</h3>
      ${t.notes?r`<p>${t.notes}</p>`:i}
      ${Pt(t,e.sessions,a)} ${Mt(_)}
      ${t.labels.length?r`<div class="workboard-labels">
            ${t.labels.map(e=>r`<span>${e}</span>`)}
          </div>`:i}
      ${Me(t,a)}
      <div class="workboard-card__meta">
        <span>${d??s(`workboard.noLinkedSession`)}</span>
      </div>
      ${je(t)}
      <div class="workboard-card__actions">
        ${J(x)}
        <div class="workboard-card__actions-primary">
          ${J(C)} ${J(w)}
          ${J(T)}
        </div>
        ${J(D)}
      </div>
    </article>
  `}function Wt(e,t,n){let i=w(e.host),a=L(e);return r`
    <section
      class="workboard-column workboard-column--${t} ${i.draggedCardId?`workboard-column--drop`:``}"
      @dragover=${e=>{a&&i.draggedCardId&&e.preventDefault()}}
      @drop=${n=>{if(n.preventDefault(),!a)return;let r=n.dataTransfer?.getData(`text/plain`)||i.draggedCardId;r&&c({host:e.host,client:e.client,cardId:r,status:t,position:Pe(i.cards,t),requestUpdate:e.onRequestUpdate})}}
    >
      <div class="workboard-column__header">
        <h2>${P(t)}</h2>
        <span>${n.length}</span>
      </div>
      <div class="workboard-column__cards">
        ${n.length?n.map(t=>Ut(e,t)):r`<div class="workboard-empty">${s(`workboard.emptyColumn`)}</div>`}
      </div>
    </section>
  `}function Gt(e){let t=w(e.host);if(e.pluginEnabled===null)return e.pluginEnablementError?r`
        <section class="workboard">
          <div class="callout danger" role="alert">${e.pluginEnablementError}</div>
          ${e.onReloadConfig?r`<button class="btn" type="button" @click=${e.onReloadConfig}>
                ${s(`lazyView.retry`)}
              </button>`:i}
        </section>
      `:r`
      <section class="card lazy-view-state lazy-view-state--loading">
        <div class="card-title">${s(`lazyView.loadingTitle`)}</div>
        <div class="card-sub">${s(`common.loading`)}</div>
      </section>
    `;if(!e.pluginEnabled)return r`
      <section class="workboard">
        <div class="callout">
          ${s(`workboard.disabledHelpStart`)}
          <code>${s(`workboard.enableConfigKey`)}</code>${s(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;let n=Ue(e.agentsList,t.cards);t.agentFilter=Ge(n,t.agentFilter);let a=n=>n.filter(e=>t.showArchived||!e.metadata?.archivedAt).filter(n=>Be(n,e.agentsList,t.agentFilter)).filter(e=>Ne(e,{query:t.query,priority:t.priorityFilter})),o=n=>a(ne({cards:t.cards,preset:n,tasksByCardId:t.tasksByCardId,sessions:e.sessions,defaultAgentId:e.agentsList?.defaultId})),c=o(t.viewPreset),d=te({cards:c,tasksByCardId:t.tasksByCardId,sessions:e.sessions}),f=t.error??t.lifecycleTaskRefreshError,p=L(e),m=new Map;for(let e of t.statuses)m.set(e,[]);for(let e of c)m.get(e.status)?.push(e);let g=t.hideEmptyColumns||t.viewPreset!==`all`?t.statuses.filter(e=>(m.get(e)?.length??0)>0):t.statuses,_=!t.showArchived&&t.cards.some(e=>e.metadata?.archivedAt),v=t.viewPreset!==`all`||t.query.trim()!==``||t.priorityFilter!==`all`||t.agentFilter!==`all`||_,y=c.length===0&&v,x=t.autoRefreshIntervalMs>0,S=Ht.map(e=>{let t=o(e.value).length;return{value:e.value,label:s(e.labelKey),description:e.value===`all`?void 0:s(`workboard.viewPresetCount`,{count:String(t)}),disabled:e.value!==`all`&&t===0}}),C=[{value:`all`,label:s(`workboard.allPriorities`)},...l.map(e=>({value:e,label:F(e)}))],T=n.map(e=>{let t={value:e.id,label:e.label};return e.description&&(t.description=e.description),t}),E=t.draftOpen||!!_t(t);return r`
    <section class="workboard" @pointerdown=${Xe}>
      <div class="workboard-main" ?inert=${E} aria-hidden=${E?`true`:i}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${s(`workboard.searchPlaceholder`)}
              placeholder=${s(`workboard.searchPlaceholder`)}
              .value=${t.query}
              @input=${n=>{t.query=n.currentTarget.value,e.onRequestUpdate?.()}}
            />
            ${q({value:t.viewPreset,options:S,label:s(`workboard.viewPreset`),onChange:e=>{t.viewPreset=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${q({value:t.priorityFilter,options:C,label:s(`workboard.allPriorities`),onChange:e=>{t.priorityFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${q({value:t.agentFilter,options:T,label:s(`workboard.agentFilter`),onChange:e=>{t.agentFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-agent`,showLabel:!1})}
            <button
              class="btn workboard-archive-toggle ${t.showArchived?`active`:``}"
              type="button"
              aria-pressed=${t.showArchived}
              @click=${()=>{t.showArchived=!t.showArchived,e.onRequestUpdate?.()}}
            >
              ${t.showArchived?u.eye:u.eyeOff}
              ${t.showArchived?s(`workboard.hideArchivedShort`):s(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${s(`workboard.layout`)}>
                <openclaw-tooltip .content=${s(`workboard.layoutCompact`)}>
                  <button
                    class="btn btn--icon ${t.layout===`compact`?`active`:``}"
                    type="button"
                    aria-label=${s(`workboard.layoutCompact`)}
                    aria-pressed=${t.layout===`compact`}
                    @click=${()=>{t.layout=`compact`,e.onRequestUpdate?.()}}
                  >
                    ${u.layoutCompact}
                  </button>
                </openclaw-tooltip>
                <openclaw-tooltip .content=${s(`workboard.layoutComfortable`)}>
                  <button
                    class="btn btn--icon ${t.layout===`comfortable`?`active`:``}"
                    type="button"
                    aria-label=${s(`workboard.layoutComfortable`)}
                    aria-pressed=${t.layout===`comfortable`}
                    @click=${()=>{t.layout=`comfortable`,e.onRequestUpdate?.()}}
                  >
                    ${u.layoutComfortable}
                  </button>
                </openclaw-tooltip>
              </div>
              ${zt(t)}
            </div>
            <label class="workboard-toggle">
              <input
                type="checkbox"
                name="workboard-hide-empty-columns"
                .checked=${t.hideEmptyColumns}
                @change=${n=>{t.hideEmptyColumns=n.currentTarget.checked,e.onRequestUpdate?.()}}
              />
              <span>${s(`workboard.hideEmptyColumns`)}</span>
            </label>
          </div>
          <div class="workboard-toolbar__actions">
            ${x?i:r`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.loading||t.dispatching||A(t)}
                    @click=${()=>O({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate,source:`manual`,refreshDiagnostics:Se(e)})}
                  >
                    ${t.loading?s(`common.refreshing`):s(`common.refresh`)}
                  </button>
                `}
            <label class="workboard-auto-refresh">
              <span>${s(`workboard.autoRefresh`)}</span>
              <select
                class="input"
                title=${s(`workboard.autoRefresh`)}
                .value=${String(t.autoRefreshIntervalMs)}
                @change=${n=>{t.autoRefreshIntervalMs=Number(n.currentTarget.value),b({host:e.host,client:e.client,enabled:e.connected&&e.pluginEnabled===!0&&t.autoRefreshIntervalMs>0,requestUpdate:e.onRequestUpdate}),e.onRequestUpdate?.()}}
              >
                ${Vt.map(e=>r`<option value=${String(e.value)}>${s(e.labelKey)}</option>`)}
              </select>
            </label>
            ${p?r`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.dispatching||A(t)}
                    @click=${()=>h({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}
                  >
                    ${u.zap} ${s(`workboard.dispatch`)}
                  </button>
                `:i}
            ${p?r`
                  <button
                    class="btn primary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded=${t.draftOpen?`true`:`false`}
                    aria-controls=${fe}
                    ?disabled=${t.dispatching}
                    @click=${n=>{R(n.currentTarget),vt(t),e.onRequestUpdate?.()}}
                  >
                    ${u.plus} ${s(`workboard.newCard`)}
                  </button>
                `:i}
          </div>
        </div>
        ${Rt(t,d,e.onRequestUpdate)}
        ${f?r`<div class="callout danger">${f}</div>`:i}
        ${Lt(t)}
        ${y||g.length===0?Bt():r`
              <div
                class="workboard-board workboard-board--${t.layout} ${g.length===1?`workboard-board--single-column`:``}"
              >
                ${g.map(t=>Wt(e,t,m.get(t)??[]))}
              </div>
            `}
      </div>
      ${xt(e)} ${It(e)}
    </section>
  `}var Kt=class extends a{constructor(...e){super(...e),this.requestPageUpdate=()=>this.context?.workboard.notify()}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.ensureSubscriptions(),this.ensureInitialData(),this.syncWorkboardRuntime()}updated(){this.ensureSubscriptions(),this.syncWorkboardRuntime()}disconnectedCallback(){this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopSessionsSubscription?.(),this.stopSessionsSubscription=void 0,this.stopWorkboardSubscription?.(),this.stopWorkboardSubscription=void 0;let e=this.context?.workboard;e&&(T(e),k(e)),super.disconnectedCallback()}ensureSubscriptions(){let e=this.context;!e||this.stopGatewaySubscription||(this.stopAgentsSubscription=e.agents.subscribe(()=>{this.requestUpdate()}),this.stopConfigSubscription=e.runtimeConfig.subscribe(()=>{this.requestUpdate(),this.ensureInitialData()}),this.stopSessionsSubscription=e.sessions.subscribe(()=>{this.requestUpdate()}),this.stopWorkboardSubscription=e.workboard.subscribe(()=>{this.requestUpdate()}),this.stopGatewaySubscription=e.gateway.subscribe(e=>{e.connected&&e.client&&this.ensureInitialData(),this.requestUpdate()}))}ensureInitialData(){let e=this.context,t=e?.gateway.snapshot;!e||!t?.connected||!t.client||(!e.runtimeConfig.state.configSnapshot&&!e.runtimeConfig.state.configLoading&&e.runtimeConfig.ensureLoaded(),!e.agents.state.agentsList&&!e.agents.state.agentsLoading&&e.agents.ensureList(),!e.sessions.state.result&&!e.sessions.state.loading&&e.sessions.refresh())}pluginEnabled(){let e=this.context?.runtimeConfig.state.configSnapshot;return e?g(e):null}syncWorkboardRuntime(){let e=this.context,t=e?.gateway.snapshot,n=this.pluginEnabled();if(!e||!t?.connected||!t.client||n!==!0){e&&(T(e.workboard),k(e.workboard));return}let r=e.workboard.state;b({host:e.workboard,client:t.client,enabled:r.autoRefreshIntervalMs>0,requestUpdate:this.requestPageUpdate}),v({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate,refreshDiagnostics:re(t.hello?.auth??null)}),!r.pollRefreshInProgress&&!r.dispatching&&ae({host:e.workboard,client:t.client,sessions:e.sessions.state.result?.sessions??[],canWrite:re(t.hello?.auth??null),requestUpdate:this.requestPageUpdate})}reloadConfig(){let e=this.context;e&&e.runtimeConfig.refresh({discardPendingChanges:!0})}render(){let e=this.context;if(!e)return i;let t=e.gateway.snapshot,n=e.runtimeConfig.state,a=t.hello?.auth??null,o=this.pluginEnabled();return r`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${d(`workboard`)}</div>
          <div class="page-sub">${_(`workboard`)}</div>
        </div>
      </section>
      ${Gt({host:e.workboard,client:t.client,connected:t.connected,canWrite:re(a),canModelOverride:oe(a),pluginEnabled:o,pluginEnablementError:!n.configSnapshot&&!n.configLoading?n.lastError:null,agentsList:e.agents.state.agentsList,sessions:e.sessions.state.result?.sessions??[],onOpenSession:t=>{e.navigate(`chat`,{search:C(t),hash:``})},onReloadConfig:()=>this.reloadConfig(),onRequestUpdate:this.requestPageUpdate})}
    `}};n([t({context:e,subscribe:!1})],Kt.prototype,`context`,void 0),customElements.get(`openclaw-workboard-page`)||customElements.define(`openclaw-workboard-page`,Kt);
//# sourceMappingURL=workboard-page-8k0Y7pZd.js.map