import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as n,Il as r,Xl as i,zl as a}from"./control-ui-core-DkXlmHxW.js";import{$ as o,X as s,Y as c,ct as l,nt as u,ut as d}from"./lit-runtime-DLvISeBM.js";import{Fi as f,Ii as p,Ni as m,_t as h,ct as g,dt as _,ft as v,i as y,lt as b,n as x,vt as S,yt as C}from"./control-ui-core-BdNTI4B-.js";import{aa as w,do as T,fo as E,oa as D}from"./control-ui-boot-shared-XNIZlLuA.js";import{Ni as O,Pi as k,do as A,fo as j,lo as M,uo as N}from"./control-ui-boot-shared-C5a8_33C.js";function P(){return(P=e((()=>{})))()}var F;function I(){return(I=e((()=>{c(),u(),C(),y(),M(),_(),n(),T(),a(),D(),p(),O(),m(),A(),E(),F=class extends r{constructor(...e){super(...e),this.compact=!1,this.updateAvailable=null,this.updateSchedule=null,this.heldUpdateCampaignId=null,this.updateBusy=!1,this.updateRun=null,this.updateRunAcknowledged=!1,this.connected=!0,this.onCheckStatus=void 0,this.onAcknowledge=void 0,this.statusBanner=null,this.watchUpdateProgress=void 0,this.canUpdate=!1,this.canHoldUpdate=!1,this.onUpdate=()=>void 0,this.refreshRequired=!1,this.onRefresh=async()=>!1,this.onHoldUpdate=async()=>!1,this.onReviewUpdate=()=>void 0,this.onDismiss=void 0,this.holdingCampaignId=null,this.nativeUpdateAvailable=S(),this.refreshInFlight=!1,this.refreshFailed=!1,this.refreshAttempt=0,this.countdownPolling=new w(this,1e3,()=>this.requestUpdate(),!1),this.handleNativeUpdateAvailabilityChanged=()=>{this.nativeUpdateAvailable=S()},this.openRun=()=>{this.updateRun&&x({existingRun:this.updateRun,updateAvailable:this.updateAvailable,updateSchedule:this.updateSchedule,viaNativeApp:S(),startGatewayUpdate:()=>this.onUpdate(),watchUpdateProgress:this.watchUpdateProgress,onCheckStatus:this.onCheckStatus,onReviewUpdate:this.onReviewUpdate,onAcknowledge:this.onAcknowledge})},this.startUpdate=()=>{let e=this.updateSchedule?.campaign;!this.updateBusy&&e?.state!==`applying`&&this.canUpdate&&x({startGatewayUpdate:()=>this.onUpdate(),onCheckStatus:this.onCheckStatus,onReviewUpdate:this.onReviewUpdate,onAcknowledge:this.onAcknowledge,...this.watchUpdateProgress?{watchUpdateProgress:this.watchUpdateProgress}:{},updateAvailable:this.updateAvailable,updateSchedule:this.updateSchedule,viaNativeApp:S()})},this.holdUpdate=async e=>{this.holdingCampaignId=e,await this.onHoldUpdate(),this.holdingCampaignId=null},this.refreshControlUi=async()=>{if(this.refreshInFlight)return;this.refreshInFlight=!0,this.refreshFailed=!1;let e=++this.refreshAttempt,t=!1;try{t=await this.onRefresh()}catch{}e===this.refreshAttempt&&this.refreshRequired&&(t||(this.refreshInFlight=!1,this.refreshFailed=!0))}}connectedCallback(){super.connectedCallback(),this.nativeUpdateAvailable=S(),window.addEventListener(h,this.handleNativeUpdateAvailabilityChanged)}disconnectedCallback(){window.removeEventListener(h,this.handleNativeUpdateAvailabilityChanged),super.disconnectedCallback()}willUpdate(e){super.willUpdate(e),e.has(`refreshRequired`)&&!this.refreshRequired&&(this.refreshAttempt+=1,this.refreshInFlight=!1,this.refreshFailed=!1)}updated(e){if(super.updated(e),e.has(`updateSchedule`)){let e=this.updateSchedule?.campaign?.state;e===`countdown`||e===`waiting-for-idle`?this.countdownPolling.start():this.countdownPolling.stop()}}renderStatus(){let e=this.updateRun?null:this.statusBanner;return e?o`<div
          class="sidebar-update-card__status sidebar-update-card__status--${e.tone}"
          role="alert"
        >
          ${e.text}
        </div>`:s}compactSummary(){if(this.refreshRequired)return{detail:i(`chat.sidebar.serverUpdatedRefresh`),icon:f.refresh,severity:`warning`,title:i(`chat.sidebar.serverUpdatedTitle`)};if(k(this.updateRun,this.updateRunAcknowledged)&&this.updateRun){let e=N(this.updateRun,this.connected);return{title:e.headline,detail:e.compactLabel,icon:this.updateRun.status===`running`?f.refresh:this.updateRun.status===`succeeded`?f.check:f.alertTriangle,severity:this.updateRun.status===`failed`?`error`:`warning`,critical:!1}}let e=this.updateSchedule?.campaign,t=this.updateBusy||e?.state===`applying`,n=this.updateRun?null:this.statusBanner;if(!n&&!v(this.updateAvailable,this.updateSchedule,t))return null;let r=b(this.updateSchedule,this.updateAvailable),a=g(this.updateSchedule),o=n&&n.tone!==`info`,s=n?.text.trim()||i(`updates.sidebar.blockedSummary`);return{detail:o?e?.state===`waiting-for-idle`&&r?i(`updates.sidebar.blockedWaiting`,{target:r}):r?`${r} · ${s}`:s:a&&r?i(`updates.sidebar.campaignTarget`,{status:a,target:r}):a??r??n?.text??i(`updates.sidebar.availableSummary`),icon:n?f.alertTriangle:t?f.refresh:f.download,critical:!!o,severity:n?.tone===`danger`?`error`:`warning`,title:i(o?`updates.sidebar.blockedTitle`:t?`updates.sidebar.updating`:`updates.sidebar.availableTitle`)}}renderCompact(){let e=this.compactSummary();return e?o`<details
      class="sidebar-issues-panel__details sidebar-issues-panel__details--${e.severity}"
    >
      <summary class="sidebar-issues-panel__summary" data-issue-row-focus>
        <span
          class="sidebar-issues-panel__icon ${e.critical?`sidebar-issues-panel__icon--critical`:``}"
          aria-hidden="true"
          >${e.icon}</span
        >
        <span class="sidebar-issues-panel__content">
          <span class="sidebar-issues-panel__entity" title=${e.title}>${e.title}</span>
          <span class="sidebar-issues-panel__state" title=${e.detail}>${e.detail}</span>
        </span>
        ${this.onDismiss?o`<button
                type="button"
                class="sidebar-issues-panel__dismiss"
                aria-label=${i(`attention.dismissItem`,{item:e.title})}
                title=${i(`attention.dismissItem`,{item:e.title})}
                @click=${e=>{e.preventDefault(),e.stopPropagation(),this.onDismiss?.()}}
              >
                ${f.x}
              </button>`:s}
        <span class="sidebar-issues-panel__chevron" aria-hidden="true">${f.chevronRight}</span>
      </summary>
      <div class="sidebar-issues-panel__body sidebar-update-issue__body">
        ${this.renderCompactDetails()}
      </div>
    </details>`:s}renderCompactDetails(){let e=this.updateRun?null:this.statusBanner;if(!e)return this.renderCard();let t=this.updateSchedule?.campaign,n=t?.holdUntilMs!==void 0&&t.holdUntilMs>Date.now(),r=!!(t&&t.state!==`applying`&&this.canUpdate&&this.canHoldUpdate&&!this.updateBusy&&!n&&this.heldUpdateCampaignId!==t.id);return o`<div class="sidebar-update-card sidebar-update-card--compact-details">
      <p class="sidebar-update-card__compact-reason" title=${e.text}>
        ${e.text}
      </p>
      <div class="sidebar-update-card__compact-actions">
        <button
          class="sidebar-update-card__review sidebar-update-card__review--primary"
          type="button"
          @click=${this.onReviewUpdate}
        >
          ${i(`updates.reviewUpdate`)}
        </button>
        ${r&&t?o`<button
                class="sidebar-update-card__hold"
                type="button"
                ?disabled=${this.holdingCampaignId===t.id}
                @click=${()=>this.holdUpdate(t.id)}
              >
                ${i(`updates.holdOneHour`)}
              </button>`:s}
      </div>
    </div>`}renderCard(){if(this.refreshRequired)return o`
        <div class="sidebar-update-card" role="status" aria-live="polite">
          ${this.renderStatus()}
          ${this.refreshFailed?o`<div
                  class="sidebar-update-card__status sidebar-update-card__status--warn"
                  role="alert"
                >
                  ${i(`connection.actionsUnavailable`)}
                </div>`:s}
          <button
            class="sidebar-update-card__action ${this.refreshInFlight?`sidebar-update-card__action--busy`:``}"
            type="button"
            ?disabled=${this.refreshInFlight}
            aria-busy=${this.refreshInFlight?`true`:`false`}
            @click=${this.refreshControlUi}
          >
            <span class="sidebar-update-card__icon" aria-hidden="true">${f.refresh}</span>
            <span class="sidebar-update-card__text sidebar-update-card__text--stacked">
              <span class="sidebar-update-card__title"
                >${i(`chat.sidebar.serverUpdatedTitle`)}</span
              >
              <span class="sidebar-update-card__subtitle"
                >${this.refreshInFlight?i(`lazyView.reloading`):this.refreshFailed?i(`connection.retryNow`):i(`chat.sidebar.serverUpdatedRefresh`)}</span
              >
            </span>
          </button>
        </div>
      `;if(k(this.updateRun,this.updateRunAcknowledged)&&this.updateRun){let e=N(this.updateRun,this.connected);return o`<div class="sidebar-update-card" role="status" aria-live="polite">
        <button class="sidebar-update-card__action" type="button" @click=${this.openRun}>
          <span class="sidebar-update-card__icon" aria-hidden="true"
            >${this.updateRun.status===`running`?f.refresh:this.updateRun.status===`succeeded`?f.check:f.alertTriangle}</span
          >
          <span class="sidebar-update-card__text sidebar-update-card__text--stacked">
            <span class="sidebar-update-card__title">${e.headline}</span>
            <span class="sidebar-update-card__subtitle">${e.compactLabel}</span>
          </span>
        </button>
      </div>`}let e=this.updateAvailable,t=this.updateSchedule?.campaign,n=this.updateBusy||t?.state===`applying`,r=this.updateRun?null:this.statusBanner,a=v(e,this.updateSchedule,n);if(!r&&!a)return s;let c=this.nativeUpdateAvailable?i(`chat.sidebar.updateMacAndGateway`):i(`chat.sidebar.updateGateway`),l=e?.channel===`beta`?` (beta)`:``,u=g(this.updateSchedule),d=b(this.updateSchedule,e),p=u?d?i(`updates.sidebar.campaignTarget`,{status:u,target:d}):u:n?i(`updates.sidebar.updating`):d?`${c} · ${d}${l}`:c,m=t?.state===`countdown`||t?.state===`waiting-for-idle`,h=t?.holdUntilMs!==void 0&&t.holdUntilMs>Date.now(),_=!!(t&&this.canUpdate&&this.canHoldUpdate&&!n&&!h&&this.heldUpdateCampaignId!==t.id),y=o`<button
      class="sidebar-update-card__action ${n?`sidebar-update-card__action--busy`:``}"
      type="button"
      aria-disabled=${this.canUpdate?s:`true`}
      ?disabled=${n}
      @click=${this.startUpdate}
    >
      <span class="sidebar-update-card__icon" aria-hidden="true"
        >${n?f.refresh:f.download}</span
      >
      <span
        class="sidebar-update-card__text"
        role=${m?`timer`:s}
        aria-live=${m?`off`:s}
        >${p}</span
      >
    </button>`;return o`
      <div
        class="sidebar-update-card"
        role=${t?s:`status`}
        aria-live=${t?s:`polite`}
      >
        ${this.renderStatus()}
        ${a?o`<div class="sidebar-update-card__actions">
                ${this.canUpdate?y:o`<openclaw-tooltip open-on-click .content=${i(`updates.adminRequired`)}>
                        ${y}
                      </openclaw-tooltip>`}
                ${_&&t?o`
                        <button
                          class="sidebar-update-card__hold"
                          type="button"
                          ?disabled=${this.holdingCampaignId===t.id}
                          @click=${()=>this.holdUpdate(t.id)}
                        >
                          ${i(`updates.holdOneHour`)}
                        </button>
                      `:s}
              </div>`:s}
        ${r?o`<button
                class="sidebar-update-card__review"
                type="button"
                @click=${this.onReviewUpdate}
              >
                ${i(`updates.reviewUpdate`)}
              </button>`:s}
        ${a&&!n?j(this.updateSchedule,this.updateAvailable):s}
      </div>
    `}render(){return this.compact?this.renderCompact():this.renderCard()}},t([d({attribute:!1})],F.prototype,`compact`,void 0),t([d({attribute:!1})],F.prototype,`updateAvailable`,void 0),t([d({attribute:!1})],F.prototype,`updateSchedule`,void 0),t([d({attribute:!1})],F.prototype,`heldUpdateCampaignId`,void 0),t([d({attribute:!1})],F.prototype,`updateBusy`,void 0),t([d({attribute:!1})],F.prototype,`updateRun`,void 0),t([d({attribute:!1})],F.prototype,`updateRunAcknowledged`,void 0),t([d({attribute:!1})],F.prototype,`connected`,void 0),t([d({attribute:!1})],F.prototype,`onCheckStatus`,void 0),t([d({attribute:!1})],F.prototype,`onAcknowledge`,void 0),t([d({attribute:!1})],F.prototype,`statusBanner`,void 0),t([d({attribute:!1})],F.prototype,`watchUpdateProgress`,void 0),t([d({attribute:!1})],F.prototype,`canUpdate`,void 0),t([d({attribute:!1})],F.prototype,`canHoldUpdate`,void 0),t([d({attribute:!1})],F.prototype,`onUpdate`,void 0),t([d({attribute:!1})],F.prototype,`refreshRequired`,void 0),t([d({attribute:!1})],F.prototype,`onRefresh`,void 0),t([d({attribute:!1})],F.prototype,`onHoldUpdate`,void 0),t([d({attribute:!1})],F.prototype,`onReviewUpdate`,void 0),t([d({attribute:!1})],F.prototype,`onDismiss`,void 0),t([l()],F.prototype,`holdingCampaignId`,void 0),t([l()],F.prototype,`nativeUpdateAvailable`,void 0),t([l()],F.prototype,`refreshInFlight`,void 0),t([l()],F.prototype,`refreshFailed`,void 0),customElements.get(`openclaw-sidebar-update-card`)||customElements.define(`openclaw-sidebar-update-card`,F)})))()}export{P as n,I as t};
//# sourceMappingURL=sidebar-update-runtime-BegfyzW1.js.map