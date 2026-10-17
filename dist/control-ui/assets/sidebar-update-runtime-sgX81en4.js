import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Eu as n,Su as r,Tu as i,ju as a}from"./control-ui-core-CTSdBcaH.js";import{Ai as o,St as s,bt as c,d as l,dt as u,ht as d,l as f,mt as p,na as m,ra as h,ut as g,xt as _}from"./control-ui-core-vFnxmx94.js";import{$ as v,X as y,Y as b,ct as x,nt as S,ut as C}from"./lit-runtime-TNZj1e-P.js";import{vr as w,yr as T}from"./control-ui-boot-shared-D4E0xCZu.js";import{ii as E}from"./ui-CnRtCcYL.js";import{Gi as D,Hi as O,Vi as k,Wi as A,d as j,f as M,vr as N,yr as P}from"./control-ui-boot-shared-DeF_v3ER.js";import{Cc as F,wc as I}from"./control-ui-boot-shared-flpXqVdL.js";var L=t({}),R;function z(){return(z=e((()=>{b(),S(),s(),l(),k(),p(),n(),w(),i(),I(),h(),N(),j(),o(),A(),T(),R=class extends r{constructor(...e){super(...e),this.compact=!1,this.updateAvailable=null,this.updateSchedule=null,this.heldUpdateCampaignId=null,this.updateBusy=!1,this.updateRun=null,this.updateRunAcknowledged=!1,this.connected=!0,this.onCheckStatus=void 0,this.onAcknowledge=void 0,this.statusBanner=null,this.watchUpdateProgress=void 0,this.canUpdate=!1,this.canHoldUpdate=!1,this.onUpdate=()=>void 0,this.refreshRequired=!1,this.onRefresh=async()=>!1,this.onHoldUpdate=async()=>!1,this.onReviewUpdate=()=>void 0,this.onDismiss=void 0,this.holdingCampaignId=null,this.nativeUpdateAvailable=_(),this.refreshInFlight=!1,this.refreshFailed=!1,this.refreshAttempt=0,this.countdownPolling=new F(this,1e3,()=>this.requestUpdate(),!1),this.handleNativeUpdateAvailabilityChanged=()=>{this.nativeUpdateAvailable=_()},this.openRun=()=>{this.updateRun&&this.confirmUpdate(this.updateRun)},this.startUpdate=()=>{let e=this.updateSchedule?.campaign;!this.updateBusy&&e?.state!==`applying`&&this.canUpdate&&this.confirmUpdate()},this.holdUpdate=async e=>{this.holdingCampaignId=e,await this.onHoldUpdate(),this.holdingCampaignId=null},this.refreshControlUi=async()=>{if(this.refreshInFlight)return;this.refreshInFlight=!0,this.refreshFailed=!1;let e=++this.refreshAttempt,t=!1;try{t=await this.onRefresh()}catch{}e===this.refreshAttempt&&this.refreshRequired&&(t||(this.refreshInFlight=!1,this.refreshFailed=!0))}}connectedCallback(){super.connectedCallback(),this.nativeUpdateAvailable=_(),window.addEventListener(c,this.handleNativeUpdateAvailabilityChanged)}disconnectedCallback(){window.removeEventListener(c,this.handleNativeUpdateAvailabilityChanged),super.disconnectedCallback()}willUpdate(e){super.willUpdate(e),e.has(`refreshRequired`)&&!this.refreshRequired&&(this.refreshAttempt+=1,this.refreshInFlight=!1,this.refreshFailed=!1)}updated(e){if(super.updated(e),e.has(`updateSchedule`)){let e=this.updateSchedule?.campaign?.state;e===`countdown`||e===`waiting-for-idle`?this.countdownPolling.start():this.countdownPolling.stop()}}renderStatus(){let e=this.updateRun?null:this.statusBanner;return e?v`<div
          class="sidebar-update-card__status sidebar-update-card__status--${e.tone}"
          role="alert"
        >
          ${e.text}
        </div>`:y}confirmUpdate(e){f({existingRun:e,startGatewayUpdate:()=>this.onUpdate(),onCheckStatus:this.onCheckStatus,onReviewUpdate:this.onReviewUpdate,onAcknowledge:this.onAcknowledge,watchUpdateProgress:this.watchUpdateProgress,updateAvailable:this.updateAvailable,updateSchedule:this.updateSchedule,viaNativeApp:_()})}compactSummary(){if(this.refreshRequired)return{detail:a(`chat.sidebar.serverUpdatedRefresh`),icon:m.refresh,severity:`warning`,title:a(`chat.sidebar.serverUpdatedTitle`)};if(P(this.updateRun,this.updateRunAcknowledged)&&this.updateRun){let e=O(this.updateRun,this.connected);return{title:e.headline,detail:e.compactLabel,timestampMs:this.updateRun.status===`running`?this.updateRun.createdAtMs:this.updateRun.finishedAtMs,icon:this.updateRun.status===`running`?m.refresh:this.updateRun.status===`succeeded`?m.check:m.alertTriangle,severity:this.updateRun.status===`failed`?`error`:`warning`,critical:!1}}let e=this.updateSchedule?.campaign,t=this.updateBusy||e?.state===`applying`,n=this.updateRun?null:this.statusBanner;if(!n&&!d(this.updateAvailable,this.updateSchedule,t))return null;let r=u(this.updateSchedule,this.updateAvailable),i=g(this.updateSchedule),o=n&&n.tone!==`info`,s=n?.text.trim()||a(`updates.sidebar.blockedSummary`);return{timestampMs:e?.announcedAtMs,detail:o?e?.state===`waiting-for-idle`&&r?a(`updates.sidebar.blockedWaiting`,{target:r}):r?`${r} · ${s}`:s:i&&r?a(`updates.sidebar.campaignTarget`,{status:i,target:r}):i??r??n?.text??a(`updates.sidebar.availableSummary`),icon:n?m.alertTriangle:t?m.refresh:m.download,critical:!!o,severity:n?.tone===`danger`?`error`:`warning`,title:a(o?`updates.sidebar.blockedTitle`:t?`updates.sidebar.updating`:`updates.sidebar.availableTitle`)}}renderCompact(){let e=this.compactSummary();return e?M({...e,onDismiss:this.onDismiss,body:this.renderCompactDetails(),bodyClass:`sidebar-update-issue__body`}):y}renderCompactDetails(){let e=this.updateRun?null:this.statusBanner;return e?v`<div class="sidebar-update-card sidebar-update-card--compact-details">
      <p class="sidebar-update-card__compact-reason" title=${e.text}>
        ${e.text}
      </p>
      <div class="sidebar-update-card__compact-actions">
        <button
          class="sidebar-update-card__review sidebar-update-card__review--primary"
          type="button"
          @click=${this.onReviewUpdate}
        >
          ${a(`updates.reviewUpdate`)}
        </button>
        ${this.renderHoldUpdate()}
      </div>
    </div>`:this.renderCard()}renderHoldUpdate(){let e=this.updateSchedule?.campaign;return!e||e.state===`applying`||!this.canUpdate||!this.canHoldUpdate||this.updateBusy||e.holdUntilMs!==void 0&&e.holdUntilMs>Date.now()||this.heldUpdateCampaignId===e.id?y:v`<button
      class="sidebar-update-card__hold"
      type="button"
      ?disabled=${this.holdingCampaignId===e.id}
      @click=${()=>this.holdUpdate(e.id)}
    >
      ${a(`updates.holdOneHour`)}
    </button>`}renderCard(){if(this.refreshRequired)return v`
        <div class="sidebar-update-card" role="status" aria-live="polite">
          ${this.renderStatus()}
          ${this.refreshFailed?v`<div
                  class="sidebar-update-card__status sidebar-update-card__status--warn"
                  role="alert"
                >
                  ${a(`connection.actionsUnavailable`)}
                </div>`:y}
          <button
            class="sidebar-update-card__action ${this.refreshInFlight?`sidebar-update-card__action--busy`:``}"
            type="button"
            ?disabled=${this.refreshInFlight}
            aria-busy=${this.refreshInFlight?`true`:`false`}
            @click=${this.refreshControlUi}
          >
            <span class="sidebar-update-card__icon" aria-hidden="true">${m.refresh}</span>
            <span class="sidebar-update-card__text sidebar-update-card__text--stacked">
              <span class="sidebar-update-card__title"
                >${a(`chat.sidebar.serverUpdatedTitle`)}</span
              >
              <span class="sidebar-update-card__subtitle"
                >${this.refreshInFlight?a(`lazyView.reloading`):this.refreshFailed?a(`connection.retryNow`):a(`chat.sidebar.serverUpdatedRefresh`)}</span
              >
            </span>
          </button>
        </div>
      `;if(P(this.updateRun,this.updateRunAcknowledged)&&this.updateRun){let e=O(this.updateRun,this.connected);return v`<div class="sidebar-update-card" role="status" aria-live="polite">
        <button class="sidebar-update-card__action" type="button" @click=${this.openRun}>
          <span class="sidebar-update-card__icon" aria-hidden="true"
            >${this.updateRun.status===`running`?m.refresh:this.updateRun.status===`succeeded`?m.check:m.alertTriangle}</span
          >
          <span class="sidebar-update-card__text sidebar-update-card__text--stacked">
            <span class="sidebar-update-card__title">${e.headline}</span>
            ${e.compactLabel?v`<span class="sidebar-update-card__subtitle">${e.compactLabel}</span>`:y}
          </span>
        </button>
      </div>`}let e=this.updateAvailable,t=this.updateSchedule?.campaign,n=this.updateBusy||t?.state===`applying`,r=this.updateRun?null:this.statusBanner,i=d(e,this.updateSchedule,n);if(!r&&!i)return y;let o=this.nativeUpdateAvailable?a(`chat.sidebar.updateMacAndGateway`):a(`chat.sidebar.updateGateway`),s=e?.channel===`beta`?` (beta)`:``,c=g(this.updateSchedule),l=u(this.updateSchedule,e),f=c?l?a(`updates.sidebar.campaignTarget`,{status:c,target:l}):c:n?a(`updates.sidebar.updating`):l?`${o} · ${l}${s}`:o,p=t?.state===`countdown`||t?.state===`waiting-for-idle`,h=v`<button
      class="sidebar-update-card__action ${n?`sidebar-update-card__action--busy`:``}"
      type="button"
      aria-disabled=${this.canUpdate?y:`true`}
      ?disabled=${n}
      @click=${this.startUpdate}
    >
      <span class="sidebar-update-card__icon" aria-hidden="true"
        >${n?m.refresh:m.download}</span
      >
      <span
        class="sidebar-update-card__text"
        role=${p?`timer`:y}
        aria-live=${p?`off`:y}
        >${f}</span
      >
    </button>`;return v`
      <div
        class="sidebar-update-card"
        role=${t?y:`status`}
        aria-live=${t?y:`polite`}
      >
        ${this.renderStatus()}
        ${i?v`<div class="sidebar-update-card__actions">
                ${this.canUpdate?h:v`<openclaw-tooltip open-on-click .content=${a(`updates.adminRequired`)}>
                        ${h}
                      </openclaw-tooltip>`}
                ${this.renderHoldUpdate()}
              </div>`:y}
        ${r?v`<button
                class="sidebar-update-card__review"
                type="button"
                @click=${this.onReviewUpdate}
              >
                ${a(`updates.reviewUpdate`)}
              </button>`:y}
        ${i&&!n?D(this.updateSchedule,this.updateAvailable):y}
      </div>
    `}render(){return this.compact?this.renderCompact():this.renderCard()}},E([C({attribute:!1})],R.prototype,`compact`,void 0),E([C({attribute:!1})],R.prototype,`updateAvailable`,void 0),E([C({attribute:!1})],R.prototype,`updateSchedule`,void 0),E([C({attribute:!1})],R.prototype,`heldUpdateCampaignId`,void 0),E([C({attribute:!1})],R.prototype,`updateBusy`,void 0),E([C({attribute:!1})],R.prototype,`updateRun`,void 0),E([C({attribute:!1})],R.prototype,`updateRunAcknowledged`,void 0),E([C({attribute:!1})],R.prototype,`connected`,void 0),E([C({attribute:!1})],R.prototype,`onCheckStatus`,void 0),E([C({attribute:!1})],R.prototype,`onAcknowledge`,void 0),E([C({attribute:!1})],R.prototype,`statusBanner`,void 0),E([C({attribute:!1})],R.prototype,`watchUpdateProgress`,void 0),E([C({attribute:!1})],R.prototype,`canUpdate`,void 0),E([C({attribute:!1})],R.prototype,`canHoldUpdate`,void 0),E([C({attribute:!1})],R.prototype,`onUpdate`,void 0),E([C({attribute:!1})],R.prototype,`refreshRequired`,void 0),E([C({attribute:!1})],R.prototype,`onRefresh`,void 0),E([C({attribute:!1})],R.prototype,`onHoldUpdate`,void 0),E([C({attribute:!1})],R.prototype,`onReviewUpdate`,void 0),E([C({attribute:!1})],R.prototype,`onDismiss`,void 0),E([x()],R.prototype,`holdingCampaignId`,void 0),E([x()],R.prototype,`nativeUpdateAvailable`,void 0),E([x()],R.prototype,`refreshInFlight`,void 0),E([x()],R.prototype,`refreshFailed`,void 0),customElements.get(`openclaw-sidebar-update-card`)||customElements.define(`openclaw-sidebar-update-card`,R)})))()}export{L as n,z as t};
//# sourceMappingURL=sidebar-update-runtime-sgX81en4.js.map