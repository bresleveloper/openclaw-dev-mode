import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{$t as n,Gl as r,Ll as i,Qt as a,Xl as o,Zt as s,_n as c,mn as l,pn as u,zl as d}from"./control-ui-core-DkXlmHxW.js";import{$ as f,X as p,Y as m,_ as h,ct as g,m as _,nt as v,ut as y}from"./lit-runtime-DLvISeBM.js";import{Fi as b,Ii as x,Ni as S}from"./control-ui-core-BdNTI4B-.js";import{la as C,sa as w}from"./control-ui-boot-shared-XNIZlLuA.js";import{$t as T,B as E,Pa as D,Qt as O,Sr as k,Tr as A,Xt as j,Yt as M,z as N}from"./control-ui-boot-shared-C5a8_33C.js";import{ar as P,er as F,gr as I,mr as L,nr as R,rr as z,tr as B}from"./control-ui-boot-shared-CqeNDLdT.js";function V(e){let t=null,n=e=>{let n=e instanceof HTMLTextAreaElement?e:null;t&&t!==n&&B(t),t=n,n&&(z(n),P(n))};return{ref:n,dispose(){n()},syncDraft(e){t?.isConnected&&t.value!==e&&P(t)},handleKeydown:t=>{if(t.isComposing||t.keyCode===229)return;let n=e.sendShortcut()===`enter`||t.metaKey||t.ctrlKey;t.key===`Enter`&&!t.shiftKey&&n&&(t.preventDefault(),t.repeat||e.submit())},handleInput:t=>{let n=t.currentTarget;n instanceof HTMLTextAreaElement&&(F(n),e.onDraftChange(n.value))}}}function H(){return(H=e((()=>{R()})))()}function U(e){return e.digest?e.running?e.activeRunId&&e.digest.runId===e.activeRunId?e.digest:null:e.digest:null}function W(e,t){return(e.health===`done`||e.health===`failed`)&&(t??0)<e.updatedAt}function G(e){return o(`chat.rail.health.${e}`)}function K(e){return o(`chat.pullRequests.${e===`draft`?`draft`:e}`)}function q(e){let t=e.checks;return t?t.state===`passing`?o(`chat.rail.checksPassing`,{count:String(t.passed)}):t.state===`failing`?o(`chat.rail.checksFailing`,{count:String(t.failed)}):o(`chat.rail.checksPending`,{count:String(t.running)}):null}var J,Y,X,Z;function Q(){return(Q=e((()=>{m(),v(),_(),x(),O(),A(),N(),M(),S(),D(),r(),C(),c(),d(),s(),L(),H(),J=class{constructor(e=a()){this.displayPreference=e,this.autoExpandedRunIds=new Set,this.autoExpandedRunId=null,this.transientExpanded=!1,this.manualOpen=!1}resetTransientState(){this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1}tryAutoOpen(){return this.displayPreference!==`off`&&(this.transientExpanded=!0,!0)}mode(e){let t=U(e),n=t!==null&&(e.running||W(t,e.lastReadAt))||e.hasCompanionActivity||this.manualOpen||this.transientExpanded;if(this.displayPreference===`off`||!n)return this.autoExpandedRunId=null,`hidden`;let r=e.activeRunId??t?.runId??null;return(t?.health===`stuck`||t?.health===`waiting-on-user`)&&r&&!this.autoExpandedRunIds.has(r)&&(this.autoExpandedRunIds.add(r),this.autoExpandedRunId=r),this.displayPreference===`card`||this.transientExpanded||r!==null&&this.autoExpandedRunId===r?`expanded`:`pill`}expand(){this.displayPreference=`card`,this.transientExpanded=!1,this.autoExpandedRunId=null,n(`card`)}collapse(){this.displayPreference=`pill`,this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1,n(`pill`)}hide(){this.displayPreference=`off`,this.resetTransientState(),n(`off`)}openExplicitly(){this.displayPreference=`pill`,this.transientExpanded=!0,this.autoExpandedRunId=null,this.manualOpen=!0,n(`pill`)}},Y=[`changed`,`stopped`,`remaining`],X={busy:`chat.rail.askBusy`,"history-unavailable":`chat.rail.askHistoryUnavailable`,missing:`chat.rail.askMissing`,"model-unavailable":`chat.rail.askModelUnavailable`,"rate-limited":`chat.rail.askRateLimited`,unavailable:`chat.rail.askUnavailable`},Z=class extends i{constructor(...e){super(...e),this.sessionKey=``,this.digest=null,this.running=!1,this.activeRunId=null,this.pullRequests=[],this.companion={turns:[],loading:!1,draft:``},this.connected=!1,this.sendShortcut=`enter`,this.command=null,this.consumedCommandGeneration=0,this.embedded=!1,this.presented=!1,this.now=Date.now(),this.railState=new J,this.clock=null,this.renderedMode=`hidden`,this.reportedMode=null,this.terminalAgeReference=Date.now(),this.composer=V({submit:()=>this.submit(),onDraftChange:e=>this.onDraftChange?.(e),sendShortcut:()=>this.sendShortcut})}disconnectedCallback(){this.stopClock(),this.composer.dispose(),super.disconnectedCallback()}willUpdate(e){e.has(`sessionKey`)&&(this.terminalAgeReference=Date.now(),this.railState.resetTransientState()),e.has(`digest`)&&this.digest&&(this.digest.health===`done`||this.digest.health===`failed`)&&(this.terminalAgeReference=Date.now()),e.has(`command`)&&this.applyPaneCommand()}applyPaneCommand(){let e=this.command;if(!(!e||e.generation<=this.consumedCommandGeneration)){if(this.onCommandConsumed?.(e.generation),e.intent===`open`){this.railState.tryAutoOpen()&&this.onVisibilityChange?.(!0);return}if(this.renderedMode===`expanded`){this.railState.collapse();return}this.railState.openExplicitly(),this.onVisibilityChange?.(!0)}}updated(e){let t=e.has(`focusRequest`)?this.focusRequest?.():void 0;this.presented&&t&&this.querySelector(`.chat-session-rail__input:not(:disabled)`)?.focus({preventScroll:!0}),this.running&&this.startedAt!=null&&U(this.input())?this.scheduleClock():this.stopClock(),this.reportedMode!==this.renderedMode&&(this.reportedMode=this.renderedMode,this.onModeChange?.(this.renderedMode))}input(){return{running:this.running,activeRunId:this.activeRunId,digest:this.digest,lastReadAt:this.lastReadAt,hasCompanionActivity:this.companion.turns.length>0||this.companion.draft.length>0}}scheduleClock(){this.clock===null&&(this.clock=globalThis.setTimeout(()=>{this.clock=null,this.now=Date.now()},1e3))}stopClock(){this.clock!==null&&(globalThis.clearTimeout(this.clock),this.clock=null)}collapse(){this.railState.collapse(),this.requestUpdate()}expand(){this.railState.expand(),this.requestUpdate()}hide(){this.railState.hide(),this.onVisibilityChange?.(!1),this.requestUpdate()}submit(){let e=this.companion.draft.trim();e&&this.connected&&!this.companion.turns.some(e=>e.status===`pending`)&&this.onSubmit?.(e)}renderStatus(e){let t=e.health===`done`||e.health===`failed`,n=e.health===`stuck`||e.health===`waiting-on-user`;return f`
      <span
        class="chat-session-rail__status ${n?`chat-session-rail__status--critical`:``}"
        data-health=${e.health}
      >
        ${t?f`<span class="chat-session-rail__status-icon" aria-hidden="true"
                >${e.health===`done`?b.check:b.x}</span
              >`:f`<span class="chat-session-rail__status-dot" aria-hidden="true"></span>`}
        <span>${G(e.health)}</span>
      </span>
    `}renderPullRequests(){let e=this.pullRequests.slice(0,2);return e.length===0?p:f`
      <div class="chat-session-rail__prs" aria-label=${o(`chat.rail.pullRequests`)}>
        ${e.map(e=>{let t=q(e);return f`
            <a
              class="chat-session-rail__pr"
              href=${e.url}
              target="_blank"
              rel="noopener noreferrer"
              title=${e.title}
            >
              <span>#${e.number}</span>
              <span>${K(e.state)}</span>
              ${t?f`<span class="chat-session-rail__pr-checks">${t}</span>`:p}
            </a>
          `})}
      </div>
    `}renderDigestDetails(e){return e?f`
      ${e.assessment?f`<p class="chat-session-rail__assessment">${e.assessment}</p>`:p}
      ${this.renderPullRequests()}
    `:p}renderStarters(){return f`
      <div class="chat-session-rail__starters">
        ${Y.map(e=>{let t=o(`chat.rail.starters.${e}`);return f`
            <button
              class="chip chat-session-rail__starter"
              type="button"
              ?disabled=${!this.connected}
              @click=${()=>this.onSubmit?.(t)}
            >
              ${b.spark}<span>${t}</span>
            </button>
          `})}
      </div>
    `}renderThread(e){let{turns:t}=this.companion,n=JSON.stringify(t.map(e=>[e.question,e.status]));return f`
      <div
        class="chat-session-rail__thread"
        aria-live="polite"
        @click=${k}
        ${T()}
        ${h(e=>{e instanceof HTMLElement&&e.dataset.railScrollKey!==n&&(e.dataset.railScrollKey=n,e.scrollTop=e.scrollHeight)})}
      >
        ${this.companion.loading&&t.length===0?j(`chat`,o(`chat.thread.loading`)):p}
        ${!this.companion.loading&&t.length===0?E({icon:b.bot,heading:o(`chat.sidePanel.companion`),description:o(`chat.rail.empty`)}):p}
        ${t.map(t=>f`
            <article
              class="chat-session-rail__exchange ${t.status===`pending`?`chat-session-rail__exchange--pending`:t.status===`failed`?`chat-session-rail__exchange--error`:``}"
            >
              <div class="chat-group user chat-session-rail__message">
                <div class="chat-bubble chat-session-rail__question">
                  ${I(t.question,t.question,{role:`user`,isStreaming:!1},{codeBlockChrome:`none`,codeBlockInteraction:`static`})}
                </div>
              </div>
              ${t.status===`answered`?f`
                      <div class="chat-group assistant chat-session-rail__message">
                        <div class="chat-bubble chat-session-rail__answer">
                          ${I(t.answer,String(t.ts),{role:`assistant`,isStreaming:!1},{codeBlockInteraction:`interactive`})}
                        </div>
                      </div>
                      <time
                        class="chat-session-rail__timestamp"
                        datetime=${new Date(t.ts).toISOString()}
                      >
                        ${o(`chat.rail.asOf`,{time:l(t.ts,{hour:`numeric`,minute:`2-digit`},``)})}
                      </time>
                    `:f`
                      <div class="chat-session-rail__hint">
                        ${o(t.status===`pending`?`chat.rail.askPending`:X[t.hint])}
                      </div>
                      ${t.status===`failed`&&t.retryable&&this.connected&&this.onSubmit?f`<button
                              class="btn btn--secondary chat-session-rail__retry"
                              type="button"
                              ?disabled=${e}
                              @click=${()=>this.onSubmit?.(t)}
                            >
                              ${o(`chat.rail.askRetry`)}
                            </button>`:p}
                    `}
            </article>
          `)}
      </div>
    `}render(){this.composer.syncDraft(this.companion.draft);let e=this.companion.turns.some(e=>e.status===`pending`),t=this.input(),n=this.embedded?`expanded`:this.railState.mode(t);if(this.renderedMode=n,n===`hidden`)return p;let r=U(t),i=o(`chat.rail.askPlaceholder`);if(n===`pill`)return f`
        <div class="chat-session-rail chat-session-rail--pill" aria-live="polite">
          ${r?this.renderStatus(r):p}
          <button
            class="chat-session-rail__expand"
            type="button"
            aria-label=${o(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            <span class="chat-session-rail__headline"
              >${r?.headline??o(`chat.rail.title`)}</span
            >
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__hide"
            type="button"
            aria-label=${o(`chat.rail.close`)}
            @click=${()=>this.hide()}
          >
            ${b.x}
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__toggle"
            type="button"
            aria-label=${o(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            ${b.chevronDown}
          </button>
        </div>
      `;let a=this.running&&this.startedAt!=null?w(Math.max(0,this.now-this.startedAt)):null,s=r&&(r.health===`done`||r.health===`failed`)?o(`chat.rail.finished`,{time:u(Math.max(0,this.terminalAgeReference-r.updatedAt))}):null;return f`
      <section
        class="chat-session-rail chat-session-rail--expanded ${this.embedded?`chat-session-rail--embedded`:``}"
        role="region"
        aria-label=${o(`chat.rail.title`)}
        tabindex="-1"
        @keydown=${e=>{!this.embedded&&e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),this.collapse())}}
      >
        ${this.embedded?p:f`<header class="rail-header chat-session-rail__header">
                <div class="rail-header__copy chat-session-rail__header-copy">
                  <div class="chat-session-rail__status-row">
                    ${r?this.renderStatus(r):f`<strong>${o(`chat.rail.title`)}</strong>`}
                    ${a?f`<span class="chat-session-rail__timing">${a}</span>`:s?f`<span class="chat-session-rail__timing">${s}</span>`:p}
                  </div>
                  ${r?f`<strong class="chat-session-rail__headline"
                          >${r.headline}</strong
                        >`:f`<span class="chat-session-rail__subtitle"
                          >${o(`chat.rail.subtitle`)}</span
                        >`}
                </div>
                <div class="rail-header__actions chat-session-rail__actions">
                  <button
                    class="rail-header__action chat-session-rail__hide"
                    type="button"
                    aria-label=${o(`chat.rail.close`)}
                    @click=${()=>this.hide()}
                  >
                    ${b.x}
                  </button>
                  <button
                    class="rail-header__action chat-session-rail__toggle"
                    type="button"
                    aria-label=${o(`chat.rail.collapse`)}
                    @click=${()=>this.collapse()}
                  >
                    ${b.chevronUp}
                  </button>
                </div>
              </header>`}
        ${r?f`<div class="chat-session-rail__digest">${this.renderDigestDetails(r)}</div>`:p}
        ${this.renderThread(e)}
        ${this.companion.turns.some(e=>e.status!==`failed`)?p:this.renderStarters()}
        <form
          class="agent-chat__input chat-session-rail__composer"
          @submit=${e=>{e.preventDefault(),this.submit()}}
        >
          <div class="agent-chat__composer-input-row">
            <label class="agent-chat__composer-combobox chat-session-rail__prompt">
              <textarea
                class="chat-session-rail__input"
                rows="1"
                maxlength="400"
                autocomplete="off"
                aria-label=${o(`chat.rail.askLabel`)}
                aria-keyshortcuts=${this.sendShortcut===`enter`?`Enter`:`Control+Enter Meta+Enter`}
                .value=${this.companion.draft}
                placeholder=${i}
                ?disabled=${!this.connected}
                @keydown=${this.composer.handleKeydown}
                @input=${this.composer.handleInput}
                ${h(this.composer.ref)}
              ></textarea>
              <span class="agent-chat__composer-placeholder" aria-hidden="true"
                >${i}</span
              >
            </label>
          </div>
          <div class="agent-chat__composer-footer">
            <div class="agent-chat__composer-trail">
              <div class="agent-chat__composer-actions">
                <button
                  class="chat-send-btn"
                  type="submit"
                  aria-label=${o(`chat.rail.askSubmit`)}
                  ?disabled=${!this.connected||e||!this.companion.draft.trim()}
                >
                  ${b.arrowUp}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    `}},t([y({attribute:!1})],Z.prototype,`sessionKey`,void 0),t([y({attribute:!1})],Z.prototype,`digest`,void 0),t([y({attribute:!1})],Z.prototype,`running`,void 0),t([y({attribute:!1})],Z.prototype,`activeRunId`,void 0),t([y({attribute:!1})],Z.prototype,`startedAt`,void 0),t([y({attribute:!1})],Z.prototype,`lastReadAt`,void 0),t([y({attribute:!1})],Z.prototype,`pullRequests`,void 0),t([y({attribute:!1})],Z.prototype,`companion`,void 0),t([y({attribute:!1})],Z.prototype,`connected`,void 0),t([y({attribute:!1})],Z.prototype,`sendShortcut`,void 0),t([y({attribute:!1})],Z.prototype,`command`,void 0),t([y({attribute:!1})],Z.prototype,`consumedCommandGeneration`,void 0),t([y({attribute:!1})],Z.prototype,`onCommandConsumed`,void 0),t([y({attribute:!1})],Z.prototype,`onSubmit`,void 0),t([y({attribute:!1})],Z.prototype,`onDraftChange`,void 0),t([y({attribute:!1})],Z.prototype,`onModeChange`,void 0),t([y({attribute:!1})],Z.prototype,`onVisibilityChange`,void 0),t([y({type:Boolean})],Z.prototype,`embedded`,void 0),t([y({type:Boolean})],Z.prototype,`presented`,void 0),t([y({attribute:!1})],Z.prototype,`focusRequest`,void 0),t([g()],Z.prototype,`now`,void 0),customElements.get(`openclaw-chat-session-rail`)||customElements.define(`openclaw-chat-session-rail`,Z)})))()}Q();export{Z as ChatSessionRailElement,J as ChatSessionRailState};
//# sourceMappingURL=chat-session-rail-BQGhbukP.js.map