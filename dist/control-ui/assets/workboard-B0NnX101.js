import{m as e,o as t,p as n}from"./lit-runtime-BImxIzGR.js";import{o as r}from"./string-coerce-BCNOsX82.js";import{A as i,B as a,C as o,D as s,E as c,F as l,H as u,I as d,L as f,M as p,N as m,O as h,P as g,R as _,S as v,T as y,U as b,V as x,X as S,Z as C,b as w,j as T,k as E,t as D,w as O,x as k,y as A,z as ee}from"./index-BUBFVPjt.js";var j=`workboard-card-modal-title`,M=`workboard-card-modal-description`,te=`workboard-card-modal`,N=`workboard-card-detail-drawer`,ne=`workboard-card-detail-title`,re=`workboard-card-detail-description`,ie=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),P=null,F=null,ae=[{id:`bugfix`,title:`Fix: `,notes:`Symptom:
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
Tests:`,labels:`plugin`,priority:`normal`}];function I(e){return r(`workboard.status.${e}`)}function L(e){return e.charAt(0).toUpperCase()+e.slice(1)}function oe(e){return e?S(e,{month:`short`,day:`numeric`},``):``}function se(e){return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function R(e){return e?C(e,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`},``):``}function ce(e){if(!e)return``;let t=Math.max(0,Date.now()-e),n=Math.floor(t/6e4);return n<1?r(`activity.duration.seconds`,{count:String(Math.floor(t/1e3))}):n<60?r(`activity.duration.minutes`,{minutes:String(n),seconds:`0`}):r(`workboard.ageHours`,{count:String(Math.floor(n/60))})}function le(e,t=64){let n=e.trim();return n.length<=t?n:`${n.slice(0,t-1)}…`}function z(e){return e.canWrite!==!1&&b(i(e.host))}function ue(e){return e.canWrite!==!1}function B(e){if(e instanceof Element){F=e;return}F||=document.activeElement}function de(){let e=F;F=null,P=null,!(!(e instanceof HTMLElement)||!e.isConnected)&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function V(e){try{e.focus({preventScroll:!0})}catch{e.focus()}}function fe(e){return!e.isConnected||e.tabIndex<0?!1:!e.closest(`[hidden], [inert]`)}function pe(e){return[...e.querySelectorAll(ie)].filter(fe)}function me(e,t){requestAnimationFrame(()=>{if(!e.isConnected||P!==e)return;let n=document.activeElement;if(n instanceof Element&&e.contains(n))return;let r=t?e.querySelector(t):null;V(r&&fe(r)?r:t?pe(e)[0]:e)})}function he(e,t){if(!(e instanceof HTMLElement)){let e=P;if(!e)return;if(!e.isConnected){de();return}queueMicrotask(()=>{P===e&&!e.isConnected&&de()});return}P!==e&&(B(null),P=e),me(e,t)}function ge(e,t){let n=pe(t);if(n.length===0){e.preventDefault(),V(t);return}let r=document.activeElement instanceof HTMLElement?document.activeElement:null,i=n[0],a=n[n.length-1],o=r?t.contains(r):!1;if(e.shiftKey&&(!o||r===i||r===t)){e.preventDefault(),V(a);return}!e.shiftKey&&(!o||r===a||r===t)&&(e.preventDefault(),V(i))}function _e(e,t,n){if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),n(),t.onRequestUpdate?.();return}e.key===`Tab`&&ge(e,e.currentTarget)}function ve(e){switch(e.kind){case`created`:return r(`workboard.eventCreated`);case`edited`:return r(`workboard.eventEdited`);case`moved`:return e.toStatus?r(`workboard.eventMovedTo`,{status:I(e.toStatus)}):r(`workboard.eventMoved`);case`linked`:return r(`workboard.eventLinked`);case`specified`:return r(`workboard.eventSpecified`);case`decomposed`:return r(`workboard.eventDecomposed`);case`claimed`:return r(`workboard.eventClaimed`);case`heartbeat`:return r(`workboard.eventHeartbeat`);case`execution_updated`:return r(`workboard.eventExecutionUpdated`);case`attempt_started`:return r(`workboard.eventAttemptStarted`);case`attempt_updated`:return r(`workboard.eventAttemptUpdated`);case`comment_added`:return r(`workboard.eventCommentAdded`);case`link_added`:return r(`workboard.eventLinkAdded`);case`proof_added`:return r(`workboard.eventProofAdded`);case`artifact_added`:return r(`workboard.eventArtifactAdded`);case`attachment_added`:return r(`workboard.eventAttachmentAdded`);case`diagnostic`:return r(`workboard.eventDiagnostic`);case`notification`:return r(`workboard.eventNotification`);case`dispatch`:return r(`workboard.eventDispatch`);case`orchestration`:return r(`workboard.eventOrchestration`);case`protocol_violation`:return r(`workboard.eventProtocolViolation`);case`archived`:return r(`workboard.eventArchived`);case`unarchived`:return r(`workboard.eventUnarchived`);case`stale`:return r(`workboard.eventStale`)}return``}function ye(t){let i=(t.events??[]).toReversed().slice(0,4);return i.length===0?n:e`
    <ol class="workboard-events" aria-label=${r(`workboard.eventsLabel`)}>
      ${i.map(t=>e`
          <li>
            <span>${ve(t)}</span>
            <time>${oe(t.at)}</time>
          </li>
        `)}
    </ol>
  `}function be(t,i){let a=t.metadata,o=[],s=a?.diagnostics?.toSorted((e,t)=>t.lastSeenAt-e.lastSeenAt)[0],c=t.status===`blocked`?a?.notifications?.at(-1)?.message??a?.workerProtocol?.detail??s?.detail:void 0;if(a?.templateId&&o.push(e`<span>${r(`workboard.template.${a.templateId}`)}</span>`),(i??t.taskId)&&o.push(e`<span>${r(`workboard.badgeTaskLinked`)}</span>`),a?.attempts?.length&&o.push(e`<span
        >${r(`workboard.badgeAttempts`,{count:String(a.attempts.length)})}</span
      >`),a?.failureCount&&o.push(e`
      <span class="workboard-card__badge--warning">
        ${A.alertTriangle}${r(`workboard.badgeFailures`,{count:String(a.failureCount)})}
      </span>
    `),a?.comments?.length&&o.push(e`<span
        >${r(`workboard.badgeComments`,{count:String(a.comments.length)})}</span
      >`),a?.proof?.length&&o.push(e`<span>${r(`workboard.badgeProof`,{count:String(a.proof.length)})}</span>`),a?.claim){o.push(e`<span>${r(`workboard.badgeClaimed`,{owner:a.claim.ownerId})}</span>`);let t=ce(a.claim.lastHeartbeatAt);t&&o.push(e`<span>${r(`workboard.badgeHeartbeat`,{age:t})}</span>`)}return s&&o.push(e`<span class="workboard-card__badge--warning" title=${s.detail}>
        ${A.alertTriangle}${le(s.title)}
      </span>`),c&&o.push(e`<span class="workboard-card__badge--warning" title=${c}>
        ${A.alertTriangle}${le(c)}
      </span>`),a?.stale&&o.push(e`<span class="workboard-card__badge--warning"
        >${A.alertTriangle}${r(`workboard.badgeStale`)}</span
      >`),o.length===0?n:e` <div class="workboard-card__badges">${o}</div> `}function xe(e,t){if(t.priority!==`all`&&e.priority!==t.priority)return!1;let n=t.query.trim().toLowerCase();return n?[e.title,e.notes,e.agentId,e.sessionKey,e.execution?.engine,e.execution?.mode,e.execution?.model,e.execution?.sessionKey,e.metadata?.templateId,e.metadata?.automation?.tenant,e.metadata?.automation?.idempotencyKey,e.metadata?.automation?.workspace?.kind,e.metadata?.automation?.workspace?.path,e.metadata?.automation?.workspace?.branch,...e.metadata?.automation?.skills??[],...e.metadata?.automation?.createdCardIds??[],...(e.metadata?.comments??[]).map(e=>e.body),...(e.metadata?.links??[]).flatMap(e=>[e.title,e.url,e.targetCardId]),...(e.metadata?.proof??[]).flatMap(e=>[e.label,e.command,e.url,e.note]),...(e.metadata?.artifacts??[]).flatMap(e=>[e.label,e.url,e.path,e.mimeType]),...(e.metadata?.attachments??[]).flatMap(e=>[e.fileName,e.mimeType,e.note]),...(e.metadata?.workerLogs??[]).map(e=>e.message),e.metadata?.workerProtocol?.state,e.metadata?.workerProtocol?.detail,e.metadata?.claim?.ownerId,...(e.metadata?.diagnostics??[]).flatMap(e=>[e.kind,e.severity,e.title,e.detail]),...(e.metadata?.notifications??[]).map(e=>e.message),...e.labels].filter(e=>typeof e==`string`).some(e=>e.toLowerCase().includes(n)):!0}function Se(e,t){let n=e.filter(e=>e.status===t).map(e=>e.position);return(n.length?Math.max(...n):0)+1e3}function Ce(e){if(e.archived||e.kind===`global`)return!1;let t=[e.key,e.label,e.displayName].filter(e=>typeof e==`string`).join(`:`).toLowerCase();return!/(^|:)heartbeat(:|$)/.test(t)}function we(e){return e.target instanceof Element?!!e.target.closest(`button, a, input, select, textarea`):!1}function Te(e,t){return e?.name??e?.identity?.name??e?.id??t}function Ee(e,t){return e.agentId?.trim()||t?.defaultId||``}function De(e,t){let n=Ee(e,t);return n?t?.agents.find(e=>e.id===n):void 0}function Oe(e,t){let n=e.agentId?.trim()||r(`workboard.defaultAgent`);return Te(De(e,t),n)}function ke(e,t,n){if(n===`all`)return!0;let r=e.agentId?.trim();return n==="default"?!r:r===n}function Ae(e){let t=new Set,n=H(e?.defaultId),r=[];for(let i of e?.agents??[]){let e=H(i.id);!e||t.has(e)||(t.add(e),r.push({id:e,label:Te(i,e),isDefault:!!(n&&e===n)}))}return r}function H(e){return typeof e==`string`?e.trim():``}function je(e){return e.find(e=>e.isDefault)?.label??r(`workboard.defaultAgent`)}function Me(e,t){let n=Ae(e),i=new Set(n.map(e=>e.id)),a=[...new Set(t.map(e=>H(e.agentId)).filter(e=>e&&!i.has(e)))].toSorted((e,t)=>e.localeCompare(t)),o=[{id:`all`,label:r(`workboard.allAgents`)},{id:`default`,label:r(`workboard.agentFilterUnassigned`,{agent:je(n)}),description:r(`workboard.agentFilterUnassignedHelp`)}];for(let e of n)o.push({id:e.id,label:e.isDefault?r(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label,...e.isDefault?{description:r(`workboard.agentFilterConfiguredDefaultHelp`)}:{}});for(let e of a)o.push({id:e,label:r(`workboard.agentCurrentUnconfigured`,{agent:e})});return o}function Ne(e,t){let n=Ae(e),i=H(t),a=i?n.some(e=>e.id===i):!0;return[{id:``,label:r(`workboard.agentFilterUnassigned`,{agent:je(n)})},...n.map(e=>({id:e.id,label:e.isDefault?r(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label})),...a?[]:[{id:i,label:r(`workboard.agentCurrentUnconfigured`,{agent:i})}]]}function Pe(e,t){return e.some(e=>e.id===t)?t:`all`}var U=!1,W=new WeakMap;function Fe(e=document){return!!e.querySelector(`.workboard-select[open]`)}function Ie(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select`)||q(document)}function G(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select__menu`)||q(document)}function Le(){if(typeof document>`u`)return;let e=Fe(document);if(e&&!U){document.addEventListener(`pointerdown`,Ie,!0),window.addEventListener(`scroll`,G,!0),window.addEventListener(`resize`,G),U=!0;return}!e&&U&&(document.removeEventListener(`pointerdown`,Ie,!0),window.removeEventListener(`scroll`,G,!0),window.removeEventListener(`resize`,G),U=!1)}function Re(e){e.open&&q(e.closest(`.workboard`)??e.getRootNode(),e)}function K(e,t=!1){let n=W.get(e);if(n&&(window.clearTimeout(n.resetTimer),W.delete(e)),e.open=!1,t){let t=e.querySelector(`.workboard-select__trigger`);t&&V(t)}}function q(e,t){for(let n of e.querySelectorAll(`.workboard-select[open]`))n!==t&&K(n,n.contains(document.activeElement));Le()}function ze(e){let t=e.target;t instanceof Element&&t.closest(`.workboard-select`)||q(e.currentTarget)}function Be(e){let t=e.querySelector(`.workboard-select__trigger`),n=e.querySelector(`.workboard-select__menu`);if(!t||!n)return;if(!e.open){n.style.removeProperty(`--workboard-select-menu-left`),n.style.removeProperty(`--workboard-select-menu-top`),n.style.removeProperty(`--workboard-select-menu-width`),n.style.removeProperty(`--workboard-select-menu-max-height`);return}let r=t.getBoundingClientRect(),i=window.innerWidth||document.documentElement.clientWidth,a=window.innerHeight||document.documentElement.clientHeight,o=Math.max(180,Math.min(r.width,i-24)),s=Math.min(Math.max(12,r.left),i-o-12),c=a-r.bottom-12-6,l=r.top-12-6,u=c<220&&l>c,d=Math.max(140,Math.min(320,u?l:c));n.style.setProperty(`--workboard-select-menu-left`,`${s}px`),n.style.setProperty(`--workboard-select-menu-width`,`${o}px`),n.style.setProperty(`--workboard-select-menu-max-height`,`${d}px`);let f=Math.min(d,n.getBoundingClientRect().height||n.scrollHeight||d),p=u?Math.max(12,r.top-6-f):Math.min(r.bottom+6,a-12-d);n.style.setProperty(`--workboard-select-menu-top`,`${p}px`)}function Ve(e){return[...e.querySelectorAll(`.workboard-select__option:not(:disabled)`)]}function He(e,t){e.open||(e.open=!0,Re(e),Be(e),Le()),V(t),t.scrollIntoView?.({block:`nearest`})}function Ue(e,t){let n=Ve(e);if(n.length===0)return;let r=n.indexOf(document.activeElement),i=n.findIndex(e=>e.getAttribute(`aria-selected`)===`true`),a=Math.max(i,0);t===`first`?a=0:t===`last`?a=n.length-1:r>=0&&(a=t===`next`?(r+1)%n.length:(r-1+n.length)%n.length),He(e,n[a]??n[0])}function We(e,t){let n=W.get(e);n&&window.clearTimeout(n.resetTimer);let r=t.toLocaleLowerCase(),i=`${n?.query??``}${r}`,a=i===r.repeat(i.length)?r:i,o=window.setTimeout(()=>W.delete(e),500);W.set(e,{query:a,resetTimer:o});let s=Ve(e),c=s.indexOf(document.activeElement),l=[...s.slice(c+1),...s.slice(0,c+1)].find(e=>e.querySelector(`.workboard-select__label`)?.textContent?.trim().toLocaleLowerCase().startsWith(a));l&&He(e,l)}function Ge(e){let t=e.currentTarget,n=e.target,r=t.querySelector(`.workboard-select__trigger`);if(e.key===`Escape`&&t.open){K(t,!0),e.preventDefault(),e.stopPropagation();return}if(n===r&&(e.key===`Enter`||e.key===` `)){e.preventDefault(),t.open?K(t,!0):Ue(t,`next`);return}if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault(),Ue(t,e.key===`ArrowDown`?`next`:`previous`);return}if(e.key===`Home`||e.key===`End`){e.preventDefault(),Ue(t,e.key===`Home`?`first`:`last`);return}n instanceof HTMLButtonElement&&e.key===` `||e.key.length===1&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.isComposing&&(e.preventDefault(),We(t,e.key))}function J(t){let r=t.options.find(e=>e.value===t.value)?.label??t.value,i=e`
    <details
      class="workboard-select ${t.className??``}"
      @toggle=${e=>{let t=e.currentTarget;Re(t),Be(t),Le()}}
      @keydown=${Ge}
      @focusout=${e=>{let t=e.currentTarget;(!(e.relatedTarget instanceof Node)||!t.contains(e.relatedTarget))&&K(t)}}
    >
      <summary
        class="input workboard-select__trigger"
        aria-label=${`${t.label}: ${r}`}
        aria-haspopup="listbox"
      >
        <span class="workboard-select__value">${r}</span>
        <span class="workboard-select__chevron" aria-hidden="true">${A.chevronDown}</span>
      </summary>
      <div class="workboard-select__menu" role="listbox" aria-label=${t.label}>
        ${t.options.map(r=>{let i=r.value===t.value;return e`
            <button
              class="workboard-select__option ${i?`is-selected`:``}"
              type="button"
              role="option"
              tabindex="-1"
              aria-selected=${i}
              aria-disabled=${r.disabled===!0}
              ?disabled=${r.disabled}
              @click=${e=>{if(r.disabled)return;t.onChange(r.value);let n=e.currentTarget.closest(`details`);n&&K(n,!0),t.requestUpdate?.()}}
            >
              <span class="workboard-select__check" aria-hidden="true">
                ${i?A.check:n}
              </span>
              <span class="workboard-select__copy">
                <span class="workboard-select__label">${r.label}</span>
                ${r.description?e`<span class="workboard-select__description">${r.description}</span>`:n}
              </span>
            </button>
          `})}
      </div>
    </details>
  `;return t.showLabel===!1?i:e`
    <div class="workboard-field">
      <span>${t.label}</span>
      ${i}
    </div>
  `}function Ke(e){return r(e===`codex`?`workboard.engineOpenAI`:`workboard.engineClaude`)}function qe(e,t,n){if(!n)return null;let i=De(t,e.agentsList),a=i?.agentRuntime?.id?.trim();if(!a)return null;let o=a.toLowerCase();return o===`openclaw`||o===`pi`?null:r(`workboard.engineDisabledRuntime`,{agent:Te(i,t.agentId??r(`workboard.defaultAgent`)),runtime:a})}function Je(t,n){let i=Oe(n,t.agentsList);return e`<span class="workboard-agent-chip" title=${n.agentId?r(`workboard.agentLinked`,{agent:i}):r(`workboard.agentDefaultLinked`,{agent:i})}>${i}</span>`}function Ye(t){return e`
    <span class="workboard-engine-mark workboard-engine-mark--${t}" aria-hidden="true">
      ${t===`codex`?`OpenAI`:`Claude`}
    </span>
  `}function Xe(e,t,n,r){n===t.status||r.busyCardIds.has(t.id)||r.dispatching||!e.connected||!e.client||p({host:e.host,client:e.client,cardId:t.id,status:n,position:Se(r.cards,n),requestUpdate:e.onRequestUpdate})}function Ze(t,a,o){let s=i(t.host),c=s.statuses.includes(a.status)?s.statuses:[a.status,...s.statuses];return c.length<2?n:e`
    <label class="workboard-card__move" title=${r(`workboard.fieldStatus`)}>
      <span class="workboard-card__move-icon" aria-hidden="true">${A.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${r(`workboard.fieldStatus`)}: ${a.title}`}
        .value=${a.status}
        ?disabled=${o||!t.connected||!t.client}
        @change=${e=>{let n=e.currentTarget;Xe(t,a,n.value,s)}}
        @keydown=${e=>{if(e.key!==`ArrowLeft`&&e.key!==`ArrowRight`)return;if(s.busyCardIds.has(a.id)||s.dispatching||!t.connected||!t.client){e.preventDefault();return}let n=c[c.indexOf(a.status)+(e.key===`ArrowRight`?1:-1)];n&&(e.preventDefault(),Xe(t,a,n,s))}}
      >
        ${c.map(t=>e`<option value=${t} ?selected=${t===a.status}>
              ${I(t)}
            </option>`)}
      </select>
    </label>
  `}function Y(t){return e`
    <span class="workboard-card__action-slot">
      ${t===n?e`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>`:t}
    </span>
  `}function Qe(e,t){D(),e.detailCardId=t.id,e.detailCommentBody=``}function $e(e){D(),e.detailCardId=null,e.detailCommentBody=``}function et(e){if(!e.detailCardId||e.draftOpen)return null;let t=e.cards.find(t=>t.id===e.detailCardId)??null;return!t||t.metadata?.archivedAt&&!e.showArchived?null:t}function X(e){let t=e.loaded&&e.mutationReadiness===`stale_edit_draft`;e.draftOpen=!1,e.editingCardId=null,e.draftTitle=``,e.draftNotes=``,e.draftStatus=`todo`,e.draftPriority=`normal`,e.draftLabels=``,e.draftAgentId=``,e.draftSessionKey=``,e.draftTemplateId=``,e.draftCommentBody=``,t&&(e.mutationReadiness=`ready`)}function tt(e){D(),X(e),e.draftOpen=!0}function nt(e,t){D(),e.draftOpen=!0,e.editingCardId=t.id,e.draftTitle=t.title,e.draftNotes=t.notes??``,e.draftStatus=t.status,e.draftPriority=t.priority,e.draftLabels=t.labels.join(`, `),e.draftAgentId=t.agentId??``,e.draftSessionKey=t.sessionKey??``,e.draftTemplateId=t.metadata?.templateId??``,e.draftCommentBody=``}function rt(e,t){let n=ae.find(e=>e.id===t);n&&(e.draftTemplateId=n.id,e.draftTitle=n.title,e.draftNotes=n.notes,e.draftLabels=n.labels,e.draftPriority=n.priority)}function it(a){let o=i(a.host),s=Ne(a.agentsList,o.draftAgentId),c=a.sessions.filter(Ce),l=o.statuses.map(e=>({value:e,label:I(e)})),u=w.map(e=>({value:e,label:L(e)})),d=s.map(e=>({value:e.id,label:e.label})),f=[{value:``,label:r(`workboard.noLinkedSession`)},...c.map(e=>({value:e.key,label:e.displayName??e.label??e.key}))];if(!o.draftOpen)return n;let p=!!o.editingCardId,m=(o.editingCardId?o.cards.find(e=>e.id===o.editingCardId)??null:null)?.metadata?.comments??[],h=p&&o.busyCardIds.has(o.editingCardId??``),_=!z(a)||o.loading||o.dispatching||h;return e`
    <div
      class="workboard-modal"
      role="presentation"
      @click=${e=>{e.target===e.currentTarget&&(X(o),a.onRequestUpdate?.())}}
    >
      <form
        id=${te}
        class="workboard-draft"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${j}
        aria-describedby=${M}
        tabindex="-1"
        ${t(e=>he(e,`[data-workboard-autofocus='true']`))}
        @keydown=${e=>_e(e,a,()=>X(o))}
        @submit=${e=>{e.preventDefault(),!_&&g({host:a.host,client:a.client,requestUpdate:a.onRequestUpdate})}}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${j}>
              ${r(p?`workboard.editCard`:`workboard.newCard`)}
            </h2>
            <p id=${M}>
              ${r(p?`workboard.editCardHelp`:`workboard.newCardHelp`)}
            </p>
          </div>
          <button
            class="btn btn--icon workboard-card__icon"
            type="button"
            title=${r(`common.cancel`)}
            aria-label=${r(`common.cancel`)}
            @click=${()=>{X(o),a.onRequestUpdate?.()}}
          >
            ${A.x}
          </button>
        </div>
        <div class="workboard-draft__body">
          ${p?n:e`
                <div class="workboard-template-strip" aria-label=${r(`workboard.templatesLabel`)}>
                  ${ae.map(t=>e`
                      <button
                        class="btn btn--xs ${o.draftTemplateId===t.id?`workboard-template-strip__button--active`:``}"
                        type="button"
                        @click=${()=>{rt(o,t.id),a.onRequestUpdate?.()}}
                      >
                        ${r(`workboard.template.${t.id}`)}
                      </button>
                    `)}
                </div>
              `}
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${r(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                data-workboard-autofocus="true"
                placeholder=${r(`workboard.titlePlaceholder`)}
                .value=${o.draftTitle}
                @input=${e=>{o.draftTitle=e.currentTarget.value,a.onRequestUpdate?.()}}
              />
            </label>
            <label class="workboard-field">
              <span>${r(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${r(`workboard.notesPlaceholder`)}
                .value=${o.draftNotes}
                @input=${e=>{o.draftNotes=e.currentTarget.value,a.onRequestUpdate?.()}}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${J({value:o.draftStatus,options:l,label:r(`workboard.fieldStatus`),onChange:e=>{o.draftStatus=e},requestUpdate:a.onRequestUpdate})}
            ${J({value:o.draftPriority,options:u,label:r(`workboard.fieldPriority`),onChange:e=>{o.draftPriority=e},requestUpdate:a.onRequestUpdate})}
            ${J({value:o.draftAgentId,options:d,label:r(`workboard.fieldAgent`),onChange:e=>{o.draftAgentId=e},requestUpdate:a.onRequestUpdate})}
            ${J({value:o.draftSessionKey,options:f,label:r(`workboard.fieldSession`),onChange:e=>{o.draftSessionKey=e},requestUpdate:a.onRequestUpdate})}
            <label class="workboard-field workboard-field--wide">
              <span>${r(`workboard.fieldLabels`)}</span>
              <input
                class="input"
                placeholder=${r(`workboard.labelsPlaceholder`)}
                .value=${o.draftLabels}
                @input=${e=>{o.draftLabels=e.currentTarget.value,a.onRequestUpdate?.()}}
              />
            </label>
          </div>
          ${p?e`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${r(`workboard.badgeComments`,{count:String(m.length)})}
                  </span>
                  ${m.length?e`
                        <ol>
                          ${m.map(t=>e`<li>${t.body}</li>`)}
                        </ol>
                      `:n}
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    .value=${o.draftCommentBody}
                    @input=${e=>{o.draftCommentBody=e.currentTarget.value,a.onRequestUpdate?.()}}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn"
                      type="button"
                      ?disabled=${_||!o.draftCommentBody.trim()}
                      @click=${()=>{k({host:a.host,client:a.client,requestUpdate:a.onRequestUpdate})}}
                    >
                      ${A.plus} ${r(`common.create`)}
                    </button>
                  </div>
                </section>
              `:n}
        </div>
        <div class="workboard-modal__actions">
          <button class="btn primary" ?disabled=${_||!o.draftTitle.trim()}>
            ${r(p?`common.save`:`common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            @click=${()=>{X(o),a.onRequestUpdate?.()}}
          >
            ${r(`common.cancel`)}
          </button>
        </div>
      </form>
    </div>
  `}function at(e){switch(e.state){case`running`:return{label:r(`workboard.lifecycleRunning`),detail:r(`workboard.lifecycleRunningDetail`),tone:`live`};case`succeeded`:return{label:r(`workboard.lifecycleDone`),detail:r(`workboard.lifecycleDoneDetail`),tone:`done`};case`failed`:return{label:r(`workboard.lifecycleNeedsReview`),detail:r(`workboard.lifecycleNeedsReviewDetail`),tone:`blocked`};case`stale`:return{label:r(`workboard.lifecycleStale`),detail:r(`workboard.lifecycleStaleDetail`),tone:`blocked`};case`idle`:return{label:r(`workboard.lifecycleLinked`),detail:r(`workboard.lifecycleIdleDetail`),tone:`idle`};case`missing`:return{label:r(`workboard.lifecycleMissing`),detail:r(`workboard.lifecycleMissingDetail`),tone:`blocked`};case`unlinked`:return{label:r(`workboard.lifecycleUnlinked`),detail:r(`workboard.lifecycleUnlinkedDetail`),tone:`idle`}}throw Error(`Unknown workboard lifecycle state.`)}function ot(e){return e.status===`queued`||e.status===`running`?e.progressSummary??e.title??e.taskId:e.terminalSummary??e.error??e.progressSummary??e.title??e.taskId}function st(e,t){switch(e.status){case`queued`:case`running`:return t.state===`running`;case`completed`:return t.state===`succeeded`;case`failed`:case`cancelled`:case`timed_out`:return t.state===`failed`}return!1}function ct(e){return e?.status===`queued`||e?.status===`running`}function lt(e,t,n){return!!(e.taskId&&!t&&!n.has(e.taskId))}function ut(e,t,n){return ct(t)||e.status===`running`&&lt(e,t,n)}function dt(e){let t=e.sessionKey??e.execution?.sessionKey,n=e.runId??e.execution?.runId;return e.status===`running`&&!!(t&&n)}function ft(e,t,n){let r=e.tasksByCardId.get(n.id),i=s(n,t),a=ct(r)||lt(n,r,e.missingTaskIds),o=n.sessionKey??n.execution?.sessionKey;return!a&&!dt(n)&&(!o||!i)}function pt(e){if(e.missing)return r(`workboard.dependencyMissing`,{parent:e.title});let t=e.status?I(e.status):r(`workboard.unknownStatus`);return`${e.title} (${t})`}function mt(e){return e.blockedParents.length===0?null:r(`workboard.dependenciesBlockedTitle`,{parents:e.blockedParents.map(pt).join(`, `)})}function ht(t){if(t.parents.length===0)return n;let i=t.blockedParents.length;return e`
    <div class="workboard-dependencies" title=${mt(t)??r(`workboard.dependenciesReadyTitle`,{count:String(t.parents.length)})}>
      ${i>0?e`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${A.alertTriangle}${r(`workboard.dependenciesBlocked`,{count:String(i)})}
            </span>
          `:e`
            <span class="workboard-dependency workboard-dependency--ready">
              ${r(`workboard.dependenciesReady`,{count:String(t.parents.length)})}
            </span>
          `}
    </div>
  `}function gt(t){return t.parents.length===0?n:e`
    <section class="workboard-detail__section">
      <h3>${r(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${t.parents.map(t=>e`
            <li class=${t.done?`is-done`:`is-blocked`}>
              ${t.done?e`<span class="workboard-detail__dependency-spacer"></span>`:A.alertTriangle}
              <span>${t.title}</span>
              <span>
                ${t.missing?r(`workboard.dependencyStatusMissing`):t.status?I(t.status):r(`workboard.unknownStatus`)}
              </span>
            </li>
          `)}
      </ul>
    </section>
  `}function _t(t,n,i){let a=E(t,n,i),o=at(a),s=a.session,c=t.execution,l=a.state===`stale`,u=i?st(i,a):!1,d=i&&u?r(`workboard.taskStatus.${i.status}`):null;return e`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${o.tone}">
        ${d??(l||!c?o.label:`${c.engine} ${c.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${i&&u?ot(i):l?o.detail:s?.displayName??s?.label??o.detail}
      </span>
    </div>
  `}function Z(t,a,o,s,c={}){let u=i(t.host),d=u.busyCardIds.has(a.id)||u.dispatching,f=qe(t,a,o),p=d||!t.connected||!!f||!!a.metadata?.archivedAt,m=f||(o?r(s===`autonomous`?`workboard.runEngine`:`workboard.openEngine`,{engine:Ke(o)}):r(`workboard.runDefaultAgent`));return e`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${s} ${c.iconOnly?`workboard-card__start--icon`:``} ${o?``:`workboard-card__start--default`}"
      type="button"
      title=${m}
      aria-label=${m}
      ?disabled=${p}
      @click=${async()=>{let e=await l({host:t.host,client:t.client,card:a,...o?{engine:o}:{},mode:s,requestUpdate:t.onRequestUpdate});e&&t.onOpenSession(e)}}
    >
      ${o?e`${Ye(o)}${c.iconOnly?n:e`<span
                >${r(s===`autonomous`?`workboard.run`:`workboard.open`)}</span
              >`}`:e`${s===`autonomous`?A.play:A.penLine}${c.iconOnly?n:e`<span>${r(`workboard.start`)}</span>`}`}
    </button>
  `}function vt(t,r){let i=t.canModelOverride!==!1;return e`
    <div class="workboard-card__execution-controls">
      ${Z(t,r,null,`autonomous`)}
      ${i?e`${Z(t,r,`codex`,`autonomous`)}
          ${Z(t,r,`claude`,`autonomous`)}`:n}
      ${Z(t,r,`codex`,`manual`)}
      ${Z(t,r,`claude`,`manual`)}
    </div>
  `}function Q(t,r){if(typeof r!=`string`&&typeof r!=`number`)return n;let i=String(r).trim();return i?e`
    <div class="workboard-detail__row">
      <span>${t}</span>
      <strong>${i}</strong>
    </div>
  `:n}function $(t,r,i=n){let a=r.map(e=>e.trim()).filter(Boolean).slice(-6);return a.length===0?i:e`
    <section class="workboard-detail__section">
      <h3>${t}</h3>
      <ol class="workboard-detail__list">
        ${a.map(t=>e`<li>${t}</li>`)}
      </ol>
    </section>
  `}function yt(a){let o=i(a.host),s=et(o);if(!s)return n;let c=o.tasksByCardId.get(s.id),l=E(s,a.sessions,c),u=at(l),d=c?st(c,l):!1,f=s.sessionKey??s.execution?.sessionKey,p=z(a),m=s.metadata?.comments??[],g=s.metadata?.attempts??[],_=s.metadata?.links??[],v=s.metadata?.proof??[],y=s.metadata?.artifacts??[],b=s.metadata?.attachments??[],x=s.metadata?.diagnostics??[],S=s.metadata?.workerLogs??[],C=s.metadata?.workerProtocol,w=s.metadata?.automation,T=(s.events??[]).slice(-6).toReversed(),D=o.busyCardIds.has(s.id)||o.dispatching,O=p&&ft(o,a.sessions,s),ee=h(s,o.cards);return e`
    <aside
      id=${N}
      class="workboard-detail-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby=${ne}
      aria-describedby=${re}
      tabindex="-1"
      ${t(e=>he(e))}
      @keydown=${e=>_e(e,a,()=>$e(o))}
    >
      <div class="workboard-detail">
        <header class="workboard-detail__header">
          <div>
            <span class="workboard-card__priority">${L(s.priority)}</span>
            <h2 id=${ne}>
              <span class="workboard-sr-only">${r(`workboard.detailTitle`)}: </span>${s.title}
            </h2>
          </div>
          <button
            class="btn btn--icon workboard-card__icon"
            type="button"
            title=${r(`common.cancel`)}
            aria-label=${r(`common.cancel`)}
            @click=${()=>{$e(o),a.onRequestUpdate?.()}}
          >
            ${A.x}
          </button>
        </header>

        <section class="workboard-detail__section">
          <div class="workboard-card__lifecycle">
            <span class="workboard-lifecycle workboard-lifecycle--${u.tone}">
              ${u.label}
            </span>
            <span id=${re} class="workboard-card__lifecycle-detail">
              ${c&&d?ot(c):l.session?.displayName??u.detail}
            </span>
          </div>
          <div class="workboard-detail__grid">
            ${Q(r(`workboard.fieldStatus`),I(s.status))}
            ${Q(r(`workboard.fieldAgent`),s.agentId??r(`workboard.defaultAgent`))}
            ${Q(r(`workboard.detailTask`),c?.taskId??s.taskId)}
            ${Q(r(`workboard.fieldSession`),f)}
            ${Q(r(`workboard.detailRun`),s.runId??s.execution?.runId)}
            ${Q(r(`workboard.detailUpdated`),R(s.updatedAt))}
          </div>
        </section>

        ${s.notes?e`
              <section class="workboard-detail__section">
                <h3>${r(`workboard.fieldNotes`)}</h3>
                <p>${s.notes}</p>
              </section>
            `:n}
        ${gt(ee)}
        ${$(r(`workboard.fieldLabels`),s.labels)}
        ${$(r(`workboard.badgeAttempts`,{count:String(g.length)}),g.map(e=>[e.status,e.model,e.sessionKey,e.error].filter(Boolean).join(` - `)))}
        ${$(r(`workboard.badgeLinks`,{count:String(_.length)}),_.map(e=>[e.type,e.title,e.targetCardId,e.url].filter(Boolean).join(` - `)))}
        ${$(r(`workboard.detailProof`),v.map(e=>[e.status,e.label,e.command,e.url,e.note].filter(Boolean).join(` - `)))}
        ${$(r(`workboard.badgeArtifacts`,{count:String(y.length)}),y.map(e=>[e.label,e.url,e.path,e.mimeType].filter(Boolean).join(` - `)))}
        ${$(r(`workboard.badgeAttachments`,{count:String(b.length)}),b.map(e=>[e.fileName,e.mimeType,e.note].filter(Boolean).join(` - `)))}
        ${$(r(`workboard.detailDiagnostics`),x.map(e=>`${e.severity}: ${e.title}`))}
        ${$(r(`workboard.detailWorkerLogs`),S.map(e=>`${e.level}: ${e.message}`))}
        ${C?$(r(`workboard.detailWorkerProtocol`),[C.state,C.detail??``,C.updatedAt?r(`workboard.detailUpdatedValue`,{time:R(C.updatedAt)}):``]):n}
        ${w?$(r(`workboard.detailAutomation`),[w.tenant?r(`workboard.detailAutomationTenant`,{tenant:w.tenant}):``,w.boardId?r(`workboard.detailAutomationBoard`,{board:w.boardId}):``,w.skills?.length?r(`workboard.detailAutomationSkills`,{skills:w.skills.join(`, `)}):``,w.workspace?r(`workboard.detailAutomationWorkspace`,{workspace:[w.workspace.kind,w.workspace.path,w.workspace.branch].filter(Boolean).join(` `)}):``,w.dispatchCount?r(`workboard.badgeDispatches`,{count:String(w.dispatchCount)}):``,w.lastDispatchAt?r(`workboard.detailUpdatedValue`,{time:R(w.lastDispatchAt)}):``,w.summary?r(`workboard.detailAutomationSummary`,{summary:w.summary}):``]):n}
        ${$(r(`workboard.eventsLabel`),T.map(e=>`${ve(e)} ${R(e.at)}`))}

        <section class="workboard-detail__section">
          <h3>${r(`workboard.detailOperatorNotes`)}</h3>
          ${m.length?e`
                <ol class="workboard-detail__list">
                  ${m.slice(-6).map(t=>e`<li>${t.body}</li>`)}
                </ol>
              `:e`<p>${r(`workboard.detailNoNotes`)}</p>`}
          ${p?e`
                <textarea
                  class="input workboard-detail__note"
                  maxlength="2000"
                  placeholder=${r(`workboard.detailNotePlaceholder`)}
                  .value=${o.detailCommentBody}
                  @input=${e=>{o.detailCommentBody=e.currentTarget.value,a.onRequestUpdate?.()}}
                ></textarea>
                <button
                  class="btn"
                  type="button"
                  ?disabled=${D||!o.detailCommentBody.trim()}
                  @click=${()=>k({host:a.host,client:a.client,cardId:s.id,body:o.detailCommentBody,requestUpdate:a.onRequestUpdate})}
                >
                  ${A.plus} ${r(`workboard.detailAddNote`)}
                </button>
              `:n}
        </section>

        <div class="workboard-detail__actions">
          ${f?e`
                <button
                  class="btn"
                  type="button"
                  @click=${()=>a.onOpenSession(f)}
                >
                  ${A.messageSquare} ${r(`workboard.openSession`)}
                </button>
              `:n}
          ${O?vt(a,s):n}
        </div>
      </div>
    </aside>
  `}function bt(t){let i=t.lastDispatchSummary;return i?e`
    <div class="callout">
      ${r(i.started+i.failures+i.promoted+i.blocked+i.reclaimed+i.orchestrated===0?`workboard.dispatchSummaryEmpty`:`workboard.dispatchSummary`,{started:String(i.started),failures:String(i.failures),promoted:String(i.promoted),blocked:String(i.blocked),reclaimed:String(i.reclaimed),orchestrated:String(i.orchestrated)})}
    </div>
  `:n}function xt(t,n,i){let a=[[`running`,r(`workboard.healthRunning`),n.running],[`blocked`,r(`workboard.healthBlocked`),n.blocked],[`stale`,r(`workboard.healthStale`),n.stale],[`readyUnassigned`,r(`workboard.healthReadyUnassigned`),n.readyUnassigned],[`missingProof`,r(`workboard.healthMissingProof`),n.missingProof],[`failedAttempts`,r(`workboard.healthFailedAttempts`),n.failedAttempts]];return e`
    <div class="workboard-health" aria-label=${r(`workboard.healthLabel`)}>
      ${a.map(([n,r,a])=>e`
          <button
            class="workboard-health__item workboard-health__item--${n} ${t.activeHealthHighlight===n?`workboard-health__item--active`:``} ${a===0?`workboard-health__item--empty`:``}"
            type="button"
            aria-pressed=${t.activeHealthHighlight===n}
            aria-label=${`${a} ${r}`}
            @click=${()=>{t.activeHealthHighlight=t.activeHealthHighlight===n?null:n,i?.()}}
          >
            <strong>${a}</strong>${r}
          </button>
        `)}
    </div>
  `}function St(t){return t.lastRefreshAt?e`<span
      class="workboard-refresh-status ${t.lastRefreshError?`workboard-refresh-status--error`:``}"
      title=${t.lastRefreshError?r(`workboard.refreshError`):``}
    >
      ${r(`workboard.lastRefreshed`,{time:se(t.lastRefreshAt)})}
    </span>`:t.lastRefreshError?e`<span class="workboard-refresh-status workboard-refresh-status--error">
      ${r(`workboard.refreshError`)}
    </span>`:n}function Ct(){return e`
    <div class="workboard-empty-state" role="status">
      <strong>${r(`workboard.emptyFilteredTitle`)}</strong>
      <span>${r(`workboard.emptyFilteredHint`)}</span>
    </div>
  `}var wt=[{value:0,labelKey:`workboard.autoRefreshOff`},{value:5e3,labelKey:`workboard.autoRefresh5s`},{value:15e3,labelKey:`workboard.autoRefresh15s`},{value:3e4,labelKey:`workboard.autoRefresh30s`},{value:6e4,labelKey:`workboard.autoRefresh60s`}],Tt=[{value:`all`,labelKey:`workboard.viewAll`},{value:`default_agent`,labelKey:`workboard.viewDefaultAgent`},{value:`ready`,labelKey:`workboard.viewReady`},{value:`running`,labelKey:`workboard.viewRunning`},{value:`blocked`,labelKey:`workboard.viewBlocked`},{value:`review`,labelKey:`workboard.viewReview`},{value:`stale`,labelKey:`workboard.viewStale`},{value:`missing_proof`,labelKey:`workboard.viewMissingProof`},{value:`recently_done`,labelKey:`workboard.viewRecentlyDone`}];function Et(t,a){let o=i(t.host),c=o.tasksByCardId.get(a.id),l=s(a,t.sessions),u=o.busyCardIds.has(a.id)||o.dispatching,f=o.syncingCardIds.has(a.id),p=ut(a,c,o.missingTaskIds),m=p||dt(a)||l?.hasActiveRun===!0||l?.hasActiveRun!==!1&&l?.status===`running`,g=a.sessionKey??a.execution?.sessionKey,_=z(t),y=_&&ft(o,t.sessions,a),b=!!a.metadata?.archivedAt,S=o.activeHealthHighlight?x(a,o.activeHealthHighlight,t.sessions,c):!1,C=h(a,o.cards),w=y?Z(t,a,null,`autonomous`,{iconOnly:!0}):n,T=_&&!b?e`
          <button
            class="btn btn--icon workboard-card__icon"
            type="button"
            title=${r(`workboard.editCard`)}
            aria-label=${r(`workboard.editCard`)}
            aria-haspopup="dialog"
            ?disabled=${o.dispatching}
            @click=${e=>{B(e.currentTarget),nt(o,a),t.onRequestUpdate?.()}}
          >
            ${A.edit}
          </button>
        `:n,E=_?e`
        <button
          class="btn btn--icon workboard-card__icon"
          type="button"
          title=${r(b?`workboard.unarchiveCard`:`workboard.archiveCard`)}
          aria-label=${r(b?`workboard.unarchiveCard`:`workboard.archiveCard`)}
          ?disabled=${u}
          @click=${()=>v({host:t.host,client:t.client,cardId:a.id,archived:!b,requestUpdate:t.onRequestUpdate})}
        >
          ${b?A.archiveRestore:A.archive}
        </button>
      `:n,D=e`
    <button
      class="btn btn--icon workboard-card__icon"
      title=${r(`workboard.viewDetails`)}
      aria-label=${r(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${o.detailCardId===a.id?`true`:`false`}
      aria-controls=${N}
      @click=${e=>{B(e.currentTarget),Qe(o,a),t.onRequestUpdate?.()}}
    >
      ${A.panelRightOpen}
    </button>
  `,k=g?e`
        <button
          class="btn btn--icon workboard-card__icon"
          title=${r(`workboard.openSession`)}
          aria-label=${r(`workboard.openSession`)}
          @click=${()=>t.onOpenSession(g)}
        >
          ${A.messageSquare}
        </button>
      `:n,ee=_&&(g?m:p)?e`
          <button
            class="btn btn--icon workboard-card__icon"
            title=${r(`workboard.stopSession`)}
            aria-label=${r(`workboard.stopSession`)}
            ?disabled=${u||!t.connected}
            @click=${()=>d({host:t.host,client:t.client,card:a,requestUpdate:t.onRequestUpdate})}
          >
            ${A.stop}
          </button>
        `:n,j=_?Ze(t,a,u):n,M=_?e`
        <button
          class="btn btn--icon workboard-card__icon workboard-card__delete"
          type="button"
          title=${r(`workboard.deleteCard`)}
          aria-label=${r(`workboard.deleteCard`)}
          ?disabled=${u}
          @click=${()=>O({host:t.host,client:t.client,cardId:a.id,requestUpdate:t.onRequestUpdate})}
        >
          ${A.trash}
        </button>
      `:n;return e`
    <article
      class="workboard-card priority-${a.priority} ${u?`workboard-card--busy`:``} ${b?`workboard-card--archived`:``} ${S?`workboard-card--health-highlight workboard-card--health-highlight-${o.activeHealthHighlight}`:``} workboard-card--openable"
      role="button"
      tabindex="0"
      title=${r(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${o.detailCardId===a.id?`true`:`false`}
      aria-controls=${N}
      draggable=${_&&!o.dispatching?`true`:`false`}
      @click=${e=>{we(e)||(B(e.currentTarget),Qe(o,a),t.onRequestUpdate?.())}}
      @keydown=${e=>{we(e)||e.key!==`Enter`&&e.key!==` `||(B(e.currentTarget),Qe(o,a),t.onRequestUpdate?.(),e.preventDefault())}}
      @dragstart=${e=>{if(!_||o.dispatching){e.preventDefault();return}o.draggedCardId=a.id,e.dataTransfer?.setData(`text/plain`,a.id),e.dataTransfer?.setDragImage(e.currentTarget,16,16),t.onRequestUpdate?.()}}
      @dragend=${()=>{o.draggedCardId=null,t.onRequestUpdate?.()}}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${r(`workboard.detailUpdatedValue`,{time:R(a.updatedAt)})}
          aria-label=${r(`workboard.detailUpdatedValue`,{time:R(a.updatedAt)})}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${A.clock}</span>
          <span>${R(a.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${Y(w)} ${Y(T)}
          ${Y(E)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${L(a.priority)}</span>
        ${Je(t,a)}
        ${b?e`<span class="workboard-card__archived">${r(`workboard.archived`)}</span>`:n}
        ${m?e`<span class="workboard-live">${r(`workboard.live`)}</span>`:n}
        ${f?e`<span class="workboard-live">${r(`common.saving`)}</span>`:n}
      </div>
      <h3>${a.title}</h3>
      ${a.notes?e`<p>${a.notes}</p>`:n}
      ${_t(a,t.sessions,c)} ${ht(C)}
      ${a.labels.length?e`<div class="workboard-labels">
            ${a.labels.map(t=>e`<span>${t}</span>`)}
          </div>`:n}
      ${be(a,c)}
      <div class="workboard-card__meta">
        <span>${g??r(`workboard.noLinkedSession`)}</span>
      </div>
      ${ye(a)}
      <div class="workboard-card__actions">
        ${Y(D)}
        <div class="workboard-card__actions-primary">
          ${Y(k)} ${Y(ee)}
          ${Y(j)}
        </div>
        ${Y(M)}
      </div>
    </article>
  `}function Dt(t,n,a){let o=i(t.host),s=z(t);return e`
    <section
      class="workboard-column workboard-column--${n} ${o.draggedCardId?`workboard-column--drop`:``}"
      @dragover=${e=>{s&&o.draggedCardId&&e.preventDefault()}}
      @drop=${e=>{if(e.preventDefault(),!s)return;let r=e.dataTransfer?.getData(`text/plain`)||o.draggedCardId;r&&p({host:t.host,client:t.client,cardId:r,status:n,position:Se(o.cards,n),requestUpdate:t.onRequestUpdate})}}
    >
      <div class="workboard-column__header">
        <h2>${I(n)}</h2>
        <span>${a.length}</span>
      </div>
      <div class="workboard-column__cards">
        ${a.length?a.map(e=>Et(t,e)):e`<div class="workboard-empty">${r(`workboard.emptyColumn`)}</div>`}
      </div>
    </section>
  `}function Ot(t){let s=i(t.host);if((!t.connected||t.pluginEnabled!==!0)&&(_(t.host),f(t.host)),o({host:t.host,client:t.client,enabled:t.connected&&t.pluginEnabled===!0&&s.autoRefreshIntervalMs>0,requestUpdate:t.onRequestUpdate}),t.connected&&t.pluginEnabled===!0&&(T({host:t.host,client:t.client,requestUpdate:t.onRequestUpdate,refreshDiagnostics:ue(t)}),!s.pollRefreshInProgress&&!s.dispatching&&a({host:t.host,client:t.client,sessions:t.sessions,canWrite:t.canWrite,requestUpdate:t.onRequestUpdate})),t.pluginEnabled===null)return t.pluginEnablementError?e`
        <section class="workboard">
          <div class="callout danger" role="alert">${t.pluginEnablementError}</div>
          ${t.onReloadConfig?e`<button class="btn" type="button" @click=${t.onReloadConfig}>
                ${r(`lazyView.retry`)}
              </button>`:n}
        </section>
      `:e`
      <section class="card lazy-view-state lazy-view-state--loading">
        <div class="card-title">${r(`lazyView.loadingTitle`)}</div>
        <div class="card-sub">${r(`common.loading`)}</div>
      </section>
    `;if(!t.pluginEnabled)return e`
      <section class="workboard">
        <div class="callout">
          ${r(`workboard.disabledHelpStart`)}
          <code>${r(`workboard.enableConfigKey`)}</code>${r(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;let l=Me(t.agentsList,s.cards);s.agentFilter=Pe(l,s.agentFilter);let d=e=>e.filter(e=>s.showArchived||!e.metadata?.archivedAt).filter(e=>ke(e,t.agentsList,s.agentFilter)).filter(e=>xe(e,{query:s.query,priority:s.priorityFilter})),p=e=>d(c({cards:s.cards,preset:e,tasksByCardId:s.tasksByCardId,sessions:t.sessions,defaultAgentId:t.agentsList?.defaultId})),h=p(s.viewPreset),g=ee({cards:h,tasksByCardId:s.tasksByCardId,sessions:t.sessions}),v=s.error??s.lifecycleTaskRefreshError,b=z(t),x=new Map;for(let e of s.statuses)x.set(e,[]);for(let e of h)x.get(e.status)?.push(e);let S=s.hideEmptyColumns||s.viewPreset!==`all`?s.statuses.filter(e=>(x.get(e)?.length??0)>0):s.statuses,C=!s.showArchived&&s.cards.some(e=>e.metadata?.archivedAt),E=s.viewPreset!==`all`||s.query.trim()!==``||s.priorityFilter!==`all`||s.agentFilter!==`all`||C,D=h.length===0&&E,O=s.autoRefreshIntervalMs>0,k=Tt.map(e=>{let t=p(e.value).length;return{value:e.value,label:r(e.labelKey),description:e.value===`all`?void 0:r(`workboard.viewPresetCount`,{count:String(t)}),disabled:e.value!==`all`&&t===0}}),j=[{value:`all`,label:r(`workboard.allPriorities`)},...w.map(e=>({value:e,label:L(e)}))],M=l.map(e=>{let t={value:e.id,label:e.label};return e.description&&(t.description=e.description),t}),N=s.draftOpen||!!et(s);return e`
    <section class="workboard" @pointerdown=${ze}>
      <div class="workboard-main" ?inert=${N} aria-hidden=${N?`true`:n}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${r(`workboard.searchPlaceholder`)}
              placeholder=${r(`workboard.searchPlaceholder`)}
              .value=${s.query}
              @input=${e=>{s.query=e.currentTarget.value,t.onRequestUpdate?.()}}
            />
            ${J({value:s.viewPreset,options:k,label:r(`workboard.viewPreset`),onChange:e=>{s.viewPreset=e},requestUpdate:t.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${J({value:s.priorityFilter,options:j,label:r(`workboard.allPriorities`),onChange:e=>{s.priorityFilter=e},requestUpdate:t.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${J({value:s.agentFilter,options:M,label:r(`workboard.agentFilter`),onChange:e=>{s.agentFilter=e},requestUpdate:t.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-agent`,showLabel:!1})}
            <button
              class="btn workboard-archive-toggle ${s.showArchived?`active`:``}"
              type="button"
              title=${s.showArchived?r(`workboard.hideArchived`):r(`workboard.showArchived`)}
              aria-pressed=${s.showArchived}
              @click=${()=>{s.showArchived=!s.showArchived,t.onRequestUpdate?.()}}
            >
              ${s.showArchived?A.eye:A.eyeOff}
              ${s.showArchived?r(`workboard.hideArchivedShort`):r(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${r(`workboard.layout`)}>
                <button
                  class="btn btn--icon ${s.layout===`compact`?`active`:``}"
                  type="button"
                  data-tooltip=${r(`workboard.layoutCompact`)}
                  aria-label=${r(`workboard.layoutCompact`)}
                  aria-pressed=${s.layout===`compact`}
                  @click=${()=>{s.layout=`compact`,t.onRequestUpdate?.()}}
                >
                  ${A.layoutCompact}
                </button>
                <button
                  class="btn btn--icon ${s.layout===`comfortable`?`active`:``}"
                  type="button"
                  data-tooltip=${r(`workboard.layoutComfortable`)}
                  aria-label=${r(`workboard.layoutComfortable`)}
                  aria-pressed=${s.layout===`comfortable`}
                  @click=${()=>{s.layout=`comfortable`,t.onRequestUpdate?.()}}
                >
                  ${A.layoutComfortable}
                </button>
              </div>
              ${St(s)}
            </div>
            <label class="workboard-toggle">
              <input
                type="checkbox"
                name="workboard-hide-empty-columns"
                .checked=${s.hideEmptyColumns}
                @change=${e=>{s.hideEmptyColumns=e.currentTarget.checked,t.onRequestUpdate?.()}}
              />
              <span>${r(`workboard.hideEmptyColumns`)}</span>
            </label>
          </div>
          <div class="workboard-toolbar__actions">
            ${O?n:e`
                  <button
                    class="btn"
                    type="button"
                    title=${r(`common.refresh`)}
                    ?disabled=${s.loading||s.dispatching||u(s)}
                    @click=${()=>m({host:t.host,client:t.client,requestUpdate:t.onRequestUpdate,source:`manual`,refreshDiagnostics:ue(t)})}
                  >
                    ${s.loading?r(`common.refreshing`):r(`common.refresh`)}
                  </button>
                `}
            <label class="workboard-auto-refresh">
              <span>${r(`workboard.autoRefresh`)}</span>
              <select
                class="input"
                title=${r(`workboard.autoRefresh`)}
                .value=${String(s.autoRefreshIntervalMs)}
                @change=${e=>{s.autoRefreshIntervalMs=Number(e.currentTarget.value),o({host:t.host,client:t.client,enabled:t.connected&&t.pluginEnabled===!0&&s.autoRefreshIntervalMs>0,requestUpdate:t.onRequestUpdate}),t.onRequestUpdate?.()}}
              >
                ${wt.map(t=>e`<option value=${String(t.value)}>${r(t.labelKey)}</option>`)}
              </select>
            </label>
            ${b?e`
                  <button
                    class="btn"
                    type="button"
                    title=${r(`workboard.dispatch`)}
                    ?disabled=${s.dispatching||u(s)}
                    @click=${()=>y({host:t.host,client:t.client,requestUpdate:t.onRequestUpdate})}
                  >
                    ${A.zap} ${r(`workboard.dispatch`)}
                  </button>
                `:n}
            ${b?e`
                  <button
                    class="btn primary"
                    type="button"
                    title=${r(`workboard.newCard`)}
                    aria-haspopup="dialog"
                    aria-expanded=${s.draftOpen?`true`:`false`}
                    aria-controls=${te}
                    ?disabled=${s.dispatching}
                    @click=${e=>{B(e.currentTarget),tt(s),t.onRequestUpdate?.()}}
                  >
                    ${A.plus} ${r(`workboard.newCard`)}
                  </button>
                `:n}
          </div>
        </div>
        ${xt(s,g,t.onRequestUpdate)}
        ${v?e`<div class="callout danger">${v}</div>`:n}
        ${bt(s)}
        ${D||S.length===0?Ct():e`
              <div
                class="workboard-board workboard-board--${s.layout} ${S.length===1?`workboard-board--single-column`:``}"
              >
                ${S.map(e=>Dt(t,e,x.get(e)??[]))}
              </div>
            `}
      </div>
      ${it(t)} ${yt(t)}
    </section>
  `}export{Ot as renderWorkboard};
//# sourceMappingURL=workboard-B0NnX101.js.map