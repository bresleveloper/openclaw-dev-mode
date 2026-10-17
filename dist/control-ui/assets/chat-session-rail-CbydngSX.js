import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,V as a,W as o,ju as s,kc as c}from"./control-ui-core-CTSdBcaH.js";import{na as l,ra as u}from"./control-ui-core-vFnxmx94.js";import{$ as d,F as f,M as p,X as m,Y as h,nt as g,ut as _}from"./lit-runtime-TNZj1e-P.js";import{ii as v}from"./ui-CnRtCcYL.js";import{Kt as y,Ut as b}from"./control-ui-boot-shared-DeF_v3ER.js";import{$a as x,Eo as S,Ja as C,Oo as w,Qa as T,Xa as E,_r as D,gr as O,hr as k,io as A,mr as j,vr as M}from"./control-ui-boot-shared-flpXqVdL.js";import{I as N,It as P,L as F,Lt as I,R as L,ht as R,mt as z,z as B}from"./control-ui-boot-chat-CHJjvSiu.js";import{F as V}from"./control-ui-boot-chat-C7HFnbgz.js";import{n as H,t as U}from"./panel-empty-state-DDjp5PSi.js";function W(e){return e.draft.trim()||(e.attachments?.some(e=>e.mimeType.startsWith(`image/`))?s(`chat.rail.askImageQuestion`):``)}function G(e){let t=null,n=e=>{let n=e instanceof HTMLTextAreaElement?e:null;t&&t!==n&&E(t),t=n,n&&(x(n),A(n))};return{ref:n,dispose(){n()},syncDraft(e){t?.isConnected&&t.value!==e&&A(t)},handleKeydown:t=>{if(L(t))return;let n=e.sendShortcut()===`enter`||t.metaKey||t.ctrlKey;t.key===`Enter`&&!t.shiftKey&&n&&(t.preventDefault(),t.repeat||e.submit())},handleInput:t=>{let n=t.currentTarget;n instanceof HTMLTextAreaElement&&(C(n),e.onDraftChange(n.value))}}}function K(e){let{companion:t,connected:n,pending:r,sendShortcut:i,composer:a,attachmentProps:o,submit:c}=e,u=s(`chat.rail.askPlaceholder`);return d`
    <form
      class="agent-chat__input chat-session-rail__composer"
      @submit=${e=>{e.preventDefault(),c()}}
    >
      ${D(o)}
      ${M(o.attachmentReads?.pendingReads??0)}
      <div class="agent-chat__composer-input-row">
        <label class="agent-chat__composer-combobox chat-session-rail__prompt">
          <textarea
            class="chat-session-rail__input"
            rows="1"
            maxlength="400"
            autocomplete="off"
            aria-label=${s(`chat.rail.askLabel`)}
            aria-keyshortcuts=${i===`enter`?`Enter`:`Control+Enter Meta+Enter`}
            .value=${t.draft}
            placeholder=${u}
            ?disabled=${!n}
            @paste=${e=>{n&&(k(e,o,{imagesOnly:!0}),e.defaultPrevented&&e.stopPropagation())}}
            @keydown=${a.handleKeydown}
            @compositionend=${B}
            @keyup=${N}
            @blur=${N}
            @input=${a.handleInput}
            ${f(a.ref)}
          ></textarea>
          <span class="agent-chat__composer-placeholder" aria-hidden="true">${u}</span>
        </label>
      </div>
      <div class="agent-chat__composer-footer">
        <div class="agent-chat__composer-trail">
          <div class="agent-chat__composer-actions">
            <button
              class="chat-send-btn"
              type="submit"
              aria-label=${s(`chat.rail.askSubmit`)}
              ?disabled=${!n||r||!!o.attachmentReads?.pendingReads||!W(t)}
            >
              ${l.arrowUp}
            </button>
          </div>
        </div>
      </div>
    </form>
  `}function q(){return(q=e((()=>{h(),p(),u(),r(),F(),O(),T()})))()}function J(e){let t=e.checks;return t?t.state===`passing`?s(`chat.rail.checksPassing`,{count:String(t.passed)}):t.state===`failing`?s(`chat.rail.checksFailing`,{count:String(t.failed)}):s(`chat.rail.checksPending`,{count:String(t.running)}):null}var Y,X,Z;function Q(){return(Q=e((()=>{V(),h(),g(),p(),u(),P(),y(),U(),z(),r(),o(),i(),t(),O(),S(),q(),Y=[`changed`,`stopped`,`remaining`],X={busy:`chat.rail.askBusy`,"history-unavailable":`chat.rail.askHistoryUnavailable`,missing:`chat.rail.askMissing`,"model-unavailable":`chat.rail.askModelUnavailable`,"image-unsupported":`chat.rail.askImageUnsupported`,"rate-limited":`chat.rail.askRateLimited`,unavailable:`chat.rail.askUnavailable`},Z=class extends n{constructor(){super(),this.sessionKey=``,this.digest=null,this.running=!1,this.activeRunId=null,this.pullRequests=[],this.companion={turns:[],loading:!1,draft:``},this.connected=!1,this.sendShortcut=`enter`,this.presented=!1,this.composer=G({submit:()=>this.submit(),onDraftChange:e=>this.onDraftChange?.(e),sendShortcut:()=>this.sendShortcut}),new c(this).watchStore(()=>this.uploadConfig)}disconnectedCallback(){this.composer.dispose(),super.disconnectedCallback()}updated(e){let t=e.has(`focusRequest`)?this.focusRequest?.():void 0;this.presented&&t&&this.querySelector(`.chat-session-rail__input:not(:disabled)`)?.focus({preventScroll:!0})}submit(){let e=W(this.companion);e&&this.connected&&!this.companion.attachmentReads?.pendingReads&&!this.companion.turns.some(e=>e.status===`pending`)&&this.onSubmit?.(e)}renderPullRequests(){let e=this.pullRequests.slice(0,2);return e.length===0?m:d`
      <div class="chat-session-rail__prs" aria-label=${s(`chat.rail.pullRequests`)}>
        ${e.map(e=>{let t=J(e);return d`
            <a
              class="chat-session-rail__pr"
              href=${e.url}
              target="_blank"
              rel="noopener noreferrer"
              title=${e.title}
            >
              <span>#${e.number}</span>
              <span>${s(`chat.pullRequests.${e.state}`)}</span>
              ${t?d`<span class="chat-session-rail__pr-checks">${t}</span>`:m}
            </a>
          `})}
      </div>
    `}renderStarters(){return d`
      <div class="chat-session-rail__starters">
        ${Y.map(e=>{let t=s(`chat.rail.starters.${e}`);return d`
            <button
              class="chip chat-session-rail__starter"
              type="button"
              ?disabled=${!this.connected}
              @click=${()=>this.onSubmit?.(t)}
            >
              ${l.spark}<span>${t}</span>
            </button>
          `})}
      </div>
    `}renderThread(e){let{turns:t}=this.companion,n=JSON.stringify(t.map(e=>[e.question,e.status]));return d`
      <div
        class="chat-session-rail__thread"
        aria-live="polite"
        @click=${b}
        ${I()}
        ${f(e=>{e instanceof HTMLElement&&e.dataset.railScrollKey!==n&&(e.dataset.railScrollKey=n,e.scrollTop=e.scrollHeight)})}
      >
        ${this.companion.loading&&t.length===0?R(`chat`,s(`chat.thread.loading`)):m}
        ${!this.companion.loading&&t.length===0?H({icon:l.bot,heading:s(`chat.sidePanel.companion`),description:s(`chat.rail.empty`)}):m}
        ${t.map(t=>d`
            <article
              class="chat-session-rail__exchange ${t.status===`pending`?`chat-session-rail__exchange--pending`:t.status===`failed`?`chat-session-rail__exchange--error`:``}"
            >
              <div class="chat-group user chat-session-rail__message">
                <div class="chat-bubble chat-session-rail__question">
                  ${w(t.question,t.question,{role:`user`,isStreaming:!1},{codeBlockChrome:`none`,codeBlockInteraction:`static`})}
                </div>
              </div>
              ${t.status===`answered`?d`
                      <div class="chat-group assistant chat-session-rail__message">
                        <div class="chat-bubble chat-session-rail__answer">
                          ${w(t.answer,String(t.ts),{role:`assistant`,isStreaming:!1},{codeBlockInteraction:`interactive`})}
                        </div>
                      </div>
                      <time
                        class="chat-session-rail__timestamp"
                        datetime=${new Date(t.ts).toISOString()}
                      >
                        ${s(`chat.rail.asOf`,{time:a(t.ts,{hour:`numeric`,minute:`2-digit`},``)})}
                      </time>
                    `:d`
                      <div class="chat-session-rail__hint">
                        ${s(t.status===`pending`?`chat.rail.askPending`:X[t.hint])}
                      </div>
                      ${t.status===`failed`&&t.retryable&&this.connected&&this.onSubmit?d`<button
                              class="btn btn--secondary chat-session-rail__retry"
                              type="button"
                              ?disabled=${e}
                              @click=${()=>this.onSubmit?.(t)}
                            >
                              ${s(`chat.rail.askRetry`)}
                            </button>`:m}
                    `}
            </article>
          `)}
      </div>
    `}render(){this.composer.syncDraft(this.companion.draft);let e=this.companion,t=e.attachmentReads,n=t?.readSignal,r={uploadConfig:this.uploadConfig,attachments:e.attachments,getAttachments:()=>e.attachments??[],attachmentReads:t,readSignal:n,attachmentLimits:this.attachmentLimits,selectionContextOnly:!0,imagesOnly:!0,disabled:!this.connected,onAttachmentsChange:this.onAttachmentsChange,onPendingReadsChange:e=>{n&&t?.updatePending(n,e)}},i=j({...r,canCompose:this.connected}),a=this.companion.turns.some(e=>e.status===`pending`),o=this.digest&&(!this.running||this.activeRunId&&this.digest.runId===this.activeRunId);return d`
      <section
        class="chat-session-rail chat-session-rail--expanded chat-session-rail--embedded"
        role="region"
        aria-label=${s(`chat.rail.title`)}
        tabindex="-1"
        @dragenter=${i.onDragenter}
        @dragleave=${i.onDragleave}
        @dragover=${i.onDragover}
        @drop=${i.onDrop}
      >
        ${o?this.renderPullRequests():m} ${this.renderThread(a)}
        ${this.companion.turns.some(e=>e.status!==`failed`)?m:this.renderStarters()}
        <openclaw-chat-comment-controller
          .paneId=${`side-chat:${this.sessionKey}`}
          .props=${r}
          .disabled=${r.disabled}
          .sessionKey=${this.sessionKey}
          .presented=${this.presented}
        ></openclaw-chat-comment-controller>
        ${K({companion:e,connected:this.connected,pending:a,sendShortcut:this.sendShortcut,composer:this.composer,attachmentProps:r,submit:()=>this.submit()})}
      </section>
    `}},v([_({attribute:!1})],Z.prototype,`sessionKey`,void 0),v([_({attribute:!1})],Z.prototype,`digest`,void 0),v([_({attribute:!1})],Z.prototype,`running`,void 0),v([_({attribute:!1})],Z.prototype,`activeRunId`,void 0),v([_({attribute:!1})],Z.prototype,`pullRequests`,void 0),v([_({attribute:!1})],Z.prototype,`companion`,void 0),v([_({attribute:!1})],Z.prototype,`connected`,void 0),v([_({attribute:!1})],Z.prototype,`sendShortcut`,void 0),v([_({attribute:!1})],Z.prototype,`onSubmit`,void 0),v([_({attribute:!1})],Z.prototype,`onDraftChange`,void 0),v([_({attribute:!1})],Z.prototype,`onAttachmentsChange`,void 0),v([_({attribute:!1})],Z.prototype,`attachmentLimits`,void 0),v([_({attribute:!1})],Z.prototype,`uploadConfig`,void 0),v([_({type:Boolean})],Z.prototype,`presented`,void 0),v([_({attribute:!1})],Z.prototype,`focusRequest`,void 0),customElements.get(`openclaw-chat-session-rail`)||customElements.define(`openclaw-chat-session-rail`,Z)})))()}Q();export{Z as ChatSessionRailElement};
//# sourceMappingURL=chat-session-rail-CbydngSX.js.map