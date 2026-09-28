import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Dh9Nir5C.js";import{Gl as i,Ll as a,Xl as o,_n as s,fn as c,nc as l,tc as u,wr as d,xr as f,zl as p}from"./control-ui-core-BfjCgLp6.js";import{$ as m,X as h,Y as g,ct as _,nt as v,ut as y}from"./lit-runtime-L6OV30Vo.js";import{Di as b,Oi as x}from"./control-ui-core-qT0XjEdV.js";import{c as S,u as C}from"./gateway-runtime-BQX_hMWC.js";import{Zt as w,bt as T,pt as E}from"./control-ui-boot-shared-Bm2ZxasE.js";import{i as D,r as O,t as k}from"./custodian-surface-DadTFsyP.js";import"./settings-CQpQmrfe.js";function A(e){switch(e){case`system-agent`:return o(`custodian.history.sources.systemAgent`);case`doctor`:return o(`custodian.history.sources.doctor`);case`config-rpc`:return o(`custodian.history.sources.settings`);case`external`:return o(`custodian.history.sources.manualEdit`);case`cli`:return o(`custodian.history.sources.cli`);case`plugin-install`:return o(`custodian.history.sources.pluginInstall`);case`unknown`:return o(`custodian.history.sources.unknown`)}return e}function j(e){return m`
    <article class="custodian__change-card ${e.invalid?`is-invalid`:``}">
      <div class="custodian__change-meta">
        <span class="custodian__change-source">${A(e.source)}</span>
        <time datetime=${new Date(e.at).toISOString()}
          >${c(e.at)}</time
        >
      </div>
      <div class="custodian__change-summary">${e.summary}</div>
      ${e.invalid?m`<div class="custodian__change-warning">${o(`custodian.history.invalidEdit`)}</div>`:h}
      ${e.opaqueChange?m`<div class="custodian__change-note">${o(`custodian.history.opaqueChange`)}</div>`:h}
      ${e.changedPaths?.length?m`<details class="custodian__change-paths">
              <summary>
                ${o(`custodian.history.changedPaths`,{count:String(e.changedPaths.length)})}
              </summary>
              <ul>
                ${e.changedPaths.map(e=>m`<li><code>${e}</code></li>`)}
              </ul>
            </details>`:h}
    </article>
  `}function M(e){return m`
    <section class="custodian__history" aria-label=${o(`custodian.history.title`)}>
      <div class="custodian__history-heading">
        <strong>${o(`custodian.history.title`)}</strong>
        <span>${o(`custodian.history.description`)}</span>
      </div>
      ${e.error?m`<div class="custodian__history-error" role="alert">
              <span>${e.error}</span>
              <button class="btn btn--sm" type="button" @click=${()=>e.onLoad(!0)}>
                ${o(`common.retry`)}
              </button>
            </div>`:h}
      ${e.loading&&e.entries.length===0?T({label:o(`custodian.history.loading`)}):m`<div class="custodian__change-list">
              ${e.entries.map(j)}
              ${e.loading?m`<div
                      class="custodian__history-state"
                      role="status"
                      aria-label=${o(`custodian.history.loading`)}
                    >
                      <span class="custodian__history-spinner" aria-hidden="true"></span>
                    </div>`:e.loaded&&e.entries.length===0&&!e.error?m`<div class="custodian__history-state" role="status">
                        ${o(`custodian.history.empty`)}
                      </div>`:h}
            </div>`}
      ${e.nextCursor?m`<button
              class="btn btn--ghost custodian__history-more"
              type="button"
              ?disabled=${e.loadingMore}
              @click=${()=>e.onLoad(!1)}
            >
              ${e.loadingMore?o(`custodian.history.loadingMore`):o(`custodian.history.loadMore`)}
            </button>`:h}
    </section>
  `}function N(){return(N=e((()=>{g(),E(),i(),s()})))()}var P,F;function I(){return(I=e((()=>{t(),g(),v(),x(),w(),i(),d(),S(),p(),l(),N(),D(),k(),P=50,F=class extends a{constructor(){super(),this.onboarding=!1,this.newAgentIntent=!1,this.store=O,this.historyAvailable=!1,this.historyOpen=!1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1,this.historyClient=null,this.historyRequestEpoch=0,this.channelsSource=null,new u(this).watch(()=>this.store,(e,t)=>{let n=e.subscribe(t);return e.refreshTranscriptIfIdle(),n}).effect(()=>this.context?.channels,e=>{this.channelsSource=e;let t=e.subscribe(()=>{this.ensureOnboardingChannelStatus(),this.requestUpdate()});return this.ensureOnboardingChannelStatus(),()=>{t(),this.channelsSource===e&&(this.channelsSource=null)}})}async getUpdateComplete(){let e=await super.getUpdateComplete();return await this.querySelector(`openclaw-custodian-surface`)?.updateComplete,e}willUpdate(){this.synchronizeHistoryClient(),this.ensureOnboardingChannelStatus()}ensureOnboardingChannelStatus(){let e=this.channelsSource;if(!this.onboarding||this.store.channelOnboardingNudgeClosed||!e)return;let t=e.state;!t.connected||t.channelsSnapshot||t.channelsLoading||t.channelsError||e.refresh(!1)}synchronizeHistoryClient(){let e=this.context.gateway.snapshot,t=e.phase===`connected`?e.client:null,n=t!==null&&C(e,`openclaw.changes.list`)===!0;(t!==this.historyClient||n!==this.historyAvailable)&&(this.historyClient=t,this.historyAvailable=n,this.historyOpen=!1,this.resetHistory())}resetHistory(){this.historyRequestEpoch+=1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1}toggleHistory(){this.historyOpen=!this.historyOpen,this.historyOpen&&!this.historyLoading&&!this.historyLoadingMore&&this.loadHistory(!0)}async loadHistory(e){let t=this.historyClient,n=e?void 0:this.historyNextCursor??void 0;if(!t||!this.historyAvailable||this.historyLoading||this.historyLoadingMore||!e&&!n)return;let r=++this.historyRequestEpoch;e?this.historyLoading=!0:this.historyLoadingMore=!0,this.historyError=null;let i=()=>this.isConnected&&this.historyClient===t&&this.historyRequestEpoch===r&&this.historyAvailable;try{let r=await t.request(`openclaw.changes.list`,{limit:P,...n?{beforeCursor:n}:{}});if(!i())return;this.historyEntries=e?r.entries:[...this.historyEntries,...r.entries],this.historyNextCursor=r.nextCursor??null,this.historyLoaded=!0}catch{i()&&(this.historyError=o(`custodian.history.requestFailed`),this.historyLoaded=!0)}finally{i()&&(this.historyLoading=!1,this.historyLoadingMore=!1)}}render(){let e=this.channelsSource?.state,t=e?.channelsSnapshot??null,n=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected?e?.channelsError??null:null,r=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected&&!e.channelsLoading&&n===null&&t!==null&&t.partial!==!0&&!f(t),i=this.historyOpen&&this.historyAvailable?M({entries:this.historyEntries,error:this.historyError,loaded:this.historyLoaded,loading:this.historyLoading,loadingMore:this.historyLoadingMore,nextCursor:this.historyNextCursor,onLoad:e=>void this.loadHistory(e)}):h;return m`
      <section
        class="custodian custodian--page ${this.store.setupRequired?`custodian--setup-required`:``}"
      >
        <header
          class="custodian__header custodian__column ${this.onboarding?`custodian__header--minimal`:``}"
        >
          ${this.onboarding?h:m`<div class="custodian__identity">
                  <div class="custodian__mark" aria-hidden="true">
                    <openclaw-mascot
                      .mood=${this.store.sending?`thinking`:`idle`}
                      .size=${38}
                    ></openclaw-mascot>
                  </div>
                  <div>
                    <h1>${o(`custodian.title`)}</h1>
                    <p>${o(`custodian.subtitleCaretaker`)}</p>
                  </div>
                </div>`}
          <div class="custodian__header-actions">
            ${this.onboarding?m`<openclaw-sidebar-attention></openclaw-sidebar-attention>`:h}
            ${this.historyAvailable?m`<button
                    class="btn btn--ghost custodian__history-toggle"
                    type="button"
                    aria-expanded=${this.historyOpen?`true`:`false`}
                    @click=${()=>this.toggleHistory()}
                  >
                    ${o(`custodian.history.button`)}
                  </button>`:h}
            ${this.onboarding?m`<button
                    class="btn btn--ghost"
                    type="button"
                    @click=${()=>this.store.exitSetup()}
                  >
                    ${o(`custodian.exitSetup`)}
                  </button>`:h}
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
          .historyContent=${i}
        ></openclaw-custodian-surface>
      </section>
    `}},r([n({context:b,subscribe:!0})],F.prototype,`context`,void 0),r([y({attribute:!1})],F.prototype,`onboarding`,void 0),r([y({attribute:!1})],F.prototype,`newAgentIntent`,void 0),r([y({attribute:!1})],F.prototype,`store`,void 0),r([_()],F.prototype,`historyAvailable`,void 0),r([_()],F.prototype,`historyOpen`,void 0),r([_()],F.prototype,`historyEntries`,void 0),r([_()],F.prototype,`historyNextCursor`,void 0),r([_()],F.prototype,`historyLoading`,void 0),r([_()],F.prototype,`historyLoadingMore`,void 0),r([_()],F.prototype,`historyError`,void 0),customElements.get(`openclaw-custodian-page`)||customElements.define(`openclaw-custodian-page`,F)})))()}I();
//# sourceMappingURL=custodian-page-C-XuaWAr.js.map