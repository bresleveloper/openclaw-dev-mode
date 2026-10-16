import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Oi as i,Tu as a,W as o,ji as s,ju as c,kc as l,z as u}from"./control-ui-core-bJHyI7AF.js";import{Ti as d,wi as f}from"./control-ui-core-DNh4McGE.js";import{$ as p,X as m,Y as h,ct as g,nt as _,ut as v}from"./lit-runtime-DyST807n.js";import{d as y,l as b}from"./gateway-runtime-FZ6mX2RY.js";import{Xr as x,Zr as S,ii as C}from"./ui-DeikvIdP.js";import{I as w,U as T,ot as E}from"./control-ui-boot-shared-C9uJ732w.js";import{i as D,r as O,t as k}from"./custodian-surface-Bc8p6mZG.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";function A(e){return p`
    <article class="custodian__change-card ${e.invalid?`is-invalid`:``}">
      <div class="custodian__change-meta">
        <span class="custodian__change-source">${c(M[e.source])}</span>
        <time datetime=${new Date(e.at).toISOString()}
          >${u(e.at)}</time
        >
      </div>
      <div class="custodian__change-summary">${e.summary}</div>
      ${e.invalid?p`<div class="custodian__change-warning">${c(`custodian.history.invalidEdit`)}</div>`:m}
      ${e.opaqueChange?p`<div class="custodian__change-note">${c(`custodian.history.opaqueChange`)}</div>`:m}
      ${e.changedPaths?.length?p`<details class="custodian__change-paths">
              <summary>
                ${c(`custodian.history.changedPaths`,{count:String(e.changedPaths.length)})}
              </summary>
              <ul>
                ${e.changedPaths.map(e=>p`<li><code>${e}</code></li>`)}
              </ul>
            </details>`:m}
    </article>
  `}function j(e){return p`
    <section class="custodian__history" aria-label=${c(`custodian.history.title`)}>
      <div class="custodian__history-heading">
        <strong>${c(`custodian.history.title`)}</strong>
        <span>${c(`custodian.history.description`)}</span>
      </div>
      ${e.error?p`<div class="custodian__history-error" role="alert">
              <span>${e.error}</span>
              <button class="btn btn--sm" type="button" @click=${()=>e.onLoad(!0)}>
                ${c(`common.retry`)}
              </button>
            </div>`:m}
      ${e.loading&&e.entries.length===0?T({label:c(`custodian.history.loading`)}):p`<div class="custodian__change-list">
              ${e.entries.map(A)}
              ${e.loading?p`<div
                      class="custodian__history-state"
                      role="status"
                      aria-label=${c(`custodian.history.loading`)}
                    >
                      <span class="custodian__history-spinner" aria-hidden="true"></span>
                    </div>`:e.loaded&&e.entries.length===0&&!e.error?p`<div class="custodian__history-state" role="status">
                        ${c(`custodian.history.empty`)}
                      </div>`:m}
            </div>`}
      ${e.nextCursor?p`<button
              class="btn btn--ghost custodian__history-more"
              type="button"
              ?disabled=${e.loadingMore}
              @click=${()=>e.onLoad(!1)}
            >
              ${e.loadingMore?c(`custodian.history.loadingMore`):c(`custodian.history.loadMore`)}
            </button>`:m}
    </section>
  `}var M;function N(){return(N=e((()=>{h(),w(),r(),o(),M={"system-agent":`custodian.history.sources.systemAgent`,doctor:`custodian.history.sources.doctor`,"config-rpc":`custodian.history.sources.settings`,external:`custodian.history.sources.manualEdit`,cli:`custodian.history.sources.cli`,"plugin-install":`custodian.history.sources.pluginInstall`,unknown:`custodian.history.sources.unknown`}})))()}var P,F;function I(){return(I=e((()=>{S(),h(),_(),d(),E(),r(),s(),b(),a(),t(),N(),D(),k(),P=50,F=class extends n{constructor(){super(),this.onboarding=!1,this.newAgentIntent=!1,this.store=O,this.historyAvailable=!1,this.historyOpen=!1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1,this.historyClient=null,this.historyRequestEpoch=0,this.channelsSource=null,new l(this).watch(()=>this.store,(e,t)=>{let n=e.subscribe(t);return e.refreshTranscriptIfIdle(),n}).effect(()=>this.context?.channels,e=>{this.channelsSource=e;let t=e.subscribe(()=>{this.ensureOnboardingChannelStatus(),this.requestUpdate()});return this.ensureOnboardingChannelStatus(),()=>{t(),this.channelsSource===e&&(this.channelsSource=null)}})}async getUpdateComplete(){let e=await super.getUpdateComplete();return await this.querySelector(`openclaw-custodian-surface`)?.updateComplete,e}willUpdate(){this.synchronizeHistoryClient(),this.ensureOnboardingChannelStatus()}ensureOnboardingChannelStatus(){let e=this.channelsSource;if(!this.onboarding||this.store.channelOnboardingNudgeClosed||!e)return;let t=e.state;!t.connected||t.channelsSnapshot||t.channelsLoading||t.channelsError||e.refresh(!1)}synchronizeHistoryClient(){let e=this.context.gateway.snapshot,t=e.phase===`connected`?e.client:null,n=t!==null&&y(e,`openclaw.changes.list`)===!0;(t!==this.historyClient||n!==this.historyAvailable)&&(this.historyClient=t,this.historyAvailable=n,this.historyOpen=!1,this.resetHistory())}resetHistory(){this.historyRequestEpoch+=1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1}toggleHistory(){this.historyOpen=!this.historyOpen,this.historyOpen&&!this.historyLoading&&!this.historyLoadingMore&&this.loadHistory(!0)}async loadHistory(e){let t=this.historyClient,n=e?void 0:this.historyNextCursor??void 0;if(!t||!this.historyAvailable||this.historyLoading||this.historyLoadingMore||!e&&!n)return;let r=++this.historyRequestEpoch;e?this.historyLoading=!0:this.historyLoadingMore=!0,this.historyError=null;let i=()=>this.isConnected&&this.historyClient===t&&this.historyRequestEpoch===r&&this.historyAvailable;try{let r=await t.request(`openclaw.changes.list`,{limit:P,...n?{beforeCursor:n}:{}});if(!i())return;this.historyEntries=e?r.entries:[...this.historyEntries,...r.entries],this.historyNextCursor=r.nextCursor??null,this.historyLoaded=!0}catch{i()&&(this.historyError=c(`custodian.history.requestFailed`),this.historyLoaded=!0)}finally{i()&&(this.historyLoading=!1,this.historyLoadingMore=!1)}}render(){let e=this.channelsSource?.state,t=e?.channelsSnapshot??null,n=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected?e?.channelsError??null:null,r=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected&&!e.channelsLoading&&n===null&&t!==null&&t.partial!==!0&&!i(t),a=this.historyOpen&&this.historyAvailable?j({entries:this.historyEntries,error:this.historyError,loaded:this.historyLoaded,loading:this.historyLoading,loadingMore:this.historyLoadingMore,nextCursor:this.historyNextCursor,onLoad:e=>void this.loadHistory(e)}):m;return p`
      <section
        class="custodian custodian--page ${this.store.setupRequired?`custodian--setup-required`:``}"
      >
        <header
          class="custodian__header custodian__column ${this.onboarding?`custodian__header--minimal`:``}"
        >
          ${this.onboarding?m:p`<div class="custodian__identity">
                  <div class="custodian__mark" aria-hidden="true">
                    <openclaw-mascot
                      .mood=${this.store.sending?`thinking`:`idle`}
                      .size=${38}
                    ></openclaw-mascot>
                  </div>
                  <div>
                    <h1>${c(`custodian.title`)}</h1>
                    <p>${c(`custodian.subtitleCaretaker`)}</p>
                  </div>
                </div>`}
          <div class="custodian__header-actions">
            ${this.onboarding?p`<openclaw-sidebar-attention></openclaw-sidebar-attention>`:m}
            ${this.historyAvailable?p`<button
                    class="btn btn--ghost custodian__history-toggle"
                    type="button"
                    aria-expanded=${this.historyOpen?`true`:`false`}
                    @click=${()=>this.toggleHistory()}
                  >
                    ${c(`custodian.history.button`)}
                  </button>`:m}
            ${this.onboarding?p`<button
                    class="btn btn--ghost"
                    type="button"
                    @click=${()=>this.store.exitSetup()}
                  >
                    ${c(`custodian.exitSetup`)}
                  </button>`:m}
          </div>
        </header>

        <openclaw-custodian-surface
          class="custodian__column"
          .store=${this.store}
          .onboarding=${this.onboarding}
          .newAgentIntent=${this.newAgentIntent}
          .showChannelOnboardingNudge=${r}
          .channelOnboardingError=${n}
          .channelOnboardingRetrying=${e?.channelsLoading??!1}
          .onRetryChannelOnboarding=${()=>void this.channelsSource?.refresh(!1)}
          .historyContent=${a}
        ></openclaw-custodian-surface>
      </section>
    `}},C([x({context:f,subscribe:!0})],F.prototype,`context`,void 0),C([v({attribute:!1})],F.prototype,`onboarding`,void 0),C([v({attribute:!1})],F.prototype,`newAgentIntent`,void 0),C([v({attribute:!1})],F.prototype,`store`,void 0),C([g()],F.prototype,`historyAvailable`,void 0),C([g()],F.prototype,`historyOpen`,void 0),C([g()],F.prototype,`historyEntries`,void 0),C([g()],F.prototype,`historyNextCursor`,void 0),C([g()],F.prototype,`historyLoading`,void 0),C([g()],F.prototype,`historyLoadingMore`,void 0),C([g()],F.prototype,`historyError`,void 0),customElements.get(`openclaw-custodian-page`)||customElements.define(`openclaw-custodian-page`,F)})))()}I();
//# sourceMappingURL=custodian-page-Bjse5h3K.js.map