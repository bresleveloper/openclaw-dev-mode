import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Yi as n,Zr as r,ai as i}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as a,Jl as o,Ll as s,Xl as c,zl as l}from"./control-ui-core-DX6662ze.js";import{$ as u,X as d,Y as f,ct as p,nt as m,ut as h}from"./lit-runtime-BOUQsi_O.js";import{Di as g,Oi as _,Or as v,Xn as y,Yi as b,Yn as x,kr as S,qi as C}from"./control-ui-core-QgEwr0pF.js";import{J as w,X as T,q as E}from"./control-ui-boot-shared-DIh44kBs.js";import"./approval-BVg8O0fq.js";function D(e,t){return t?u`<div class="approval-page__meta-row">
        <dt>${e}</dt>
        <dd title=${t}><bdi dir="ltr">${t}</bdi></dd>
      </div>`:d}function O(e){return e.kind===`exec`?u`
      ${e.warningText?u`<div class="approval-page__warning" role="note">${e.warningText}</div>`:d}
      ${e.commandPreview?u`
              <div class="approval-page__preview-label">${c(`approvalPage.summaryLabel`)}</div>
              <div class="approval-page__summary mono" dir="ltr">
                ${e.commandPreview}
              </div>
            `:d}
      <div class="approval-page__preview-label">${c(`approvalPage.commandLabel`)}</div>
      <pre class="approval-page__preview mono" dir="ltr">${e.commandText}</pre>
      <dl class="approval-page__meta">
        ${D(c(`execApproval.labels.host`),e.host)}
        ${D(c(`approvalPage.nodeLabel`),e.nodeId)}
      </dl>
    `:u`
    <div class="approval-page__preview-label">${c(`approvalPage.requestLabel`)}</div>
    <div class=${`approval-page__preview approval-page__preview--prose`}>${e.description}</div>
    ${e.kind===`plugin`&&e.detail?u`<pre class="approval-page__preview mono" dir="ltr">${e.detail}</pre>`:d}
  `}function k(){return(k=e((()=>{f(),a()})))()}function A(e){return e instanceof x?(n(e.details)?e.details.reason:void 0)===`APPROVAL_NOT_FOUND`||e.gatewayCode===`APPROVAL_NOT_FOUND`||e.gatewayCode===`INVALID_REQUEST`:!1}function j(e){return new Intl.DateTimeFormat(o.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function M(e){switch(e){case`allow-once`:return c(`execApproval.allowOnce`);case`allow-always`:return c(`execApproval.alwaysAllow`);case`deny`:return c(`execApproval.deny`)}return e}function N(e,t){return e.applied?t===`deny`?e.approval.status===`denied`:e.approval.status===`allowed`&&e.approval.decision===t:!0}function P(e,t){let n=t?.trim();return n?u`<span class="approval-page__chip mono" data-approval-chip=${e}>${n}</span>`:d}function F(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return c(`approvalPage.resolvedElsewhere`);if(t===`here`&&e.status===`allowed`)return c(`approvalPage.approvedHere`);if(t===`here`&&e.status===`denied`)return c(`approvalPage.deniedHere`);let n=e.status;switch(n){case`allowed`:return c(`approvalPage.approved`);case`denied`:return c(`approvalPage.denied`);case`expired`:return c(`approvalPage.expired`);case`cancelled`:return c(`approvalPage.cancelled`);case`pending`:return c(`approvalPage.pending`)}return n}function I(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return c(`approvalPage.resolvedElsewhereDescription`);let n=e.status;switch(n){case`allowed`:return e.decision===`allow-always`?c(`approvalPage.allowedAlwaysDescription`):c(`approvalPage.allowedOnceDescription`);case`denied`:return c(`approvalPage.deniedDescription`);case`expired`:return c(`approvalPage.expiredDescription`);case`cancelled`:return c(`approvalPage.cancelledDescription`);case`pending`:return c(`approvalPage.pendingDescription`)}return n}var L,R,z,B;function V(){return(V=e((()=>{t(),f(),m(),E(),y(),_(),v(),b(),a(),l(),k(),L=2e3,R=250,z=`operator.approvals`,B=class extends s{constructor(...e){super(...e),this.approvalId=``,this.approval=null,this.connected=!1,this.approvalsAccess=!0,this.approvalGrantAccess=!1,this.loading=!0,this.resolving=!1,this.resolvingDecision=null,this.requestError=null,this.resolutionOrigin=`observed`,this.client=null,this.operationGeneration=0,this.handleVisibilityChange=()=>{if(document.visibilityState!==`visible`){this.clearPollTimer();return}this.approval?.status===`pending`&&this.hasGatewayConnection&&this.hasApprovalAccess&&!this.resolving&&this.loadApproval({background:!0})}}connectedCallback(){this.replaceChildren(),super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.previousDocumentTitle=document.title,this.bindApprovalId(!0),this.stopGateway=this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.stopGateway?.(),this.stopGateway=void 0,this.invalidateOperations(),this.clearPollTimer(),this.client=null,this.connected=!1,this.previousDocumentTitle!==void 0&&(!this.activeDocumentTitle||document.title===this.activeDocumentTitle)&&(document.title=this.previousDocumentTitle),this.previousDocumentTitle=void 0,this.activeDocumentTitle=void 0,super.disconnectedCallback()}updated(e){e.has(`approvalId`)&&this.bindApprovalId(),this.updateDocumentTitle()}bindApprovalId(e=!1){(e||this.boundApprovalId!==this.approvalId)&&(this.boundApprovalId=this.approvalId,this.invalidateOperations(),this.clearPollTimer(),this.approval=null,this.loading=!!this.approvalId,this.resolving=!1,this.resolvingDecision=null,this.requestError=this.approvalId?null:`unavailable`,this.resolutionOrigin=`observed`,this.approvalId&&this.connected&&this.client&&this.hasApprovalAccess&&this.loadApproval())}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=e.phase===`connected`&&!this.connected,i=S(e),a=i.canReviewApprovals,o=a!==this.approvalsAccess,s=i.canGrantApprovals!==this.approvalGrantAccess;if(this.client=e.client,this.connected=e.phase===`connected`,this.approvalsAccess=a,this.approvalGrantAccess=i.canGrantApprovals,(t||n||o||s)&&(this.invalidateOperations(),this.clearPollTimer(),this.resolving=!1,this.resolvingDecision=null),this.approvalsAccess||(this.approval=null),e.phase!==`connected`||!e.client){this.approvalId&&(this.loading=!1,this.requestError=!this.approval||this.approval.status===`pending`?`connection`:null);return}if(!this.approvalsAccess){this.approval=null,this.loading=!1,this.requestError=null;return}if(!this.approvalId){this.loading=!1,this.requestError=`unavailable`;return}if(t||r||o||!this.approval){this.loadApproval();return}this.schedulePoll()}invalidateOperations(){this.operationGeneration+=1}isCurrentOperation(e){return this.hasGatewayConnection&&this.hasApprovalAccess&&this.client===e.client&&this.approvalId===e.id&&this.operationGeneration===e.generation}get hasGatewayConnection(){return this.connected&&!!this.client}get hasApprovalAccess(){return this.approvalsAccess&&S(this.context.gateway.snapshot).canReviewApprovals}get hasApprovalGrantAccess(){return this.approvalGrantAccess&&S(this.context.gateway.snapshot).canGrantApprovals}async loadApproval(e={}){let t=this.client,n=this.approvalId;if(!t||!this.connected||!n||!this.hasApprovalAccess)return;let r=++this.operationGeneration,i=this.approval?.status,a=!1;this.clearPollTimer(),e.background||(this.loading=!0);try{let e=await t.request(`approval.get`,{id:n});if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;if(!w(e)||e.approval.id!==n){this.approval=null,this.requestError=`unavailable`;return}this.requestError=null,this.approval=e.approval,e.approval.status===`pending`?this.resolutionOrigin=`observed`:i===`pending`&&this.resolutionOrigin===`observed`&&(this.resolutionOrigin=`elsewhere`,a=!0)}catch(e){if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;A(e)?(this.approval=null,this.requestError=`unavailable`):this.requestError=`connection`}finally{this.isCurrentOperation({client:t,generation:r,id:n})&&(this.loading=!1,this.schedulePoll())}a&&this.isCurrentOperation({client:t,generation:r,id:n})&&await this.focusTerminalState()}async resolveApproval(e){let t=this.approval,n=this.client,r=this.approvalId;if(!n||!this.connected||!this.hasApprovalGrantAccess||!r||t?.status!==`pending`||!Array.prototype.includes.call(t.presentation.allowedDecisions,e)||this.resolving)return;let i=t.presentation.kind,a=++this.operationGeneration,o=()=>this.isCurrentOperation({client:n,generation:a,id:r})&&this.hasApprovalGrantAccess,s=!1,c=!1;this.clearPollTimer(),this.resolving=!0,this.resolvingDecision=e,this.requestError=null;try{let t=await n.request(`approval.resolve`,{id:r,kind:i,decision:e});if(!o())return;!T(t)||t.approval.id!==r||t.approval.presentation.kind!==i||!N(t,e)?(this.requestError=`connection`,c=!0):(this.approval=t.approval,this.resolutionOrigin=t.applied?`here`:`elsewhere`,s=!0)}catch(e){if(!o())return;this.requestError=A(e)?`unavailable`:`connection`}finally{o()&&(this.resolving=!1,this.resolvingDecision=null,this.schedulePoll())}if(c&&o()){await this.loadApproval({background:!0});return}s&&o()&&await this.focusTerminalState()}async focusTerminalState(){if(await this.updateComplete,this.approval?.status===`pending`)return;let e=this.querySelector(`#approval-page-title`);e?.focus({preventScroll:!0}),typeof e?.scrollIntoView==`function`&&e.scrollIntoView({behavior:`auto`,block:`center`,inline:`nearest`})}clearPollTimer(){this.pollTimer!==void 0&&(globalThis.clearTimeout(this.pollTimer),this.pollTimer=void 0)}schedulePoll(){this.clearPollTimer();let e=this.approval;if(!this.hasGatewayConnection||!this.hasApprovalAccess||this.resolving||this.requestError===`unavailable`||e?.status!==`pending`||document.visibilityState!==`visible`)return;let t=e.expiresAtMs-Date.now(),n=Math.max(R,Math.min(L,t+R));this.pollTimer=globalThis.setTimeout(()=>{this.pollTimer=void 0,this.loadApproval({background:!0})},n)}renderHeader(){return u`
      <header class="approval-page__brand">
        <img
          class="approval-page__logo"
          src=${C(`apple-touch-icon.png`,this.context.resourceBasePath)}
          alt=""
        />
        <div>
          <div class="approval-page__eyebrow">${c(`approvalPage.eyebrow`)}</div>
          <div class="approval-page__brand-name">${c(`approvalPage.brandName`)}</div>
        </div>
      </header>
    `}renderLoading(){return u`
      <div class="approval-page__state approval-page__state--loading" role="status">
        <div class="approval-page__spinner" aria-hidden="true"></div>
        <h1 id="approval-page-title">${c(`approvalPage.loadingTitle`)}</h1>
        <p>${c(`approvalPage.loadingDescription`)}</p>
      </div>
    `}renderUnavailable(){return u`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${c(`approvalPage.unavailableTitle`)}</h1>
        <p>${c(`approvalPage.unavailableDescription`)}</p>
      </div>
    `}renderMissingScope(){return u`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${c(`common.disabled`)}</h1>
        <p><code>${z}</code></p>
      </div>
    `}renderConnectionState(){return u`
      <div class="approval-page__state approval-page__state--connection" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${c(`approvalPage.connectionErrorTitle`)}</h1>
        <p>${c(`approvalPage.connectionErrorDescription`)}</p>
        <button
          type="button"
          class="btn"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${c(`approvalPage.retry`)}
        </button>
      </div>
    `}renderConnectionError(){return u`
      <div class="approval-page__callout" role="alert">
        <div>
          <strong>${c(`approvalPage.connectionErrorTitle`)}</strong>
          <span>${c(`approvalPage.connectionErrorDescription`)}</span>
        </div>
        <button
          type="button"
          class="btn btn--sm"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${c(`approvalPage.retry`)}
        </button>
      </div>
    `}renderApproval(e){let t=e.status===`pending`,n=e.presentation,r=this.hasApprovalGrantAccess,i=t?n.kind===`plugin`?n.title:c(`approvalPage.execTitle`):F(e,this.resolutionOrigin),a=t?c(r?`approvalPage.pendingDescription`:`execApproval.reviewOnly`):I(e,this.resolutionOrigin);return u`
      <div class="approval-page__status" aria-live="polite" aria-atomic="true">
        <span
          class="approval-page__status-dot approval-page__status-dot--${e.status}"
          aria-hidden="true"
        ></span>
        ${t?c(`approvalPage.pending`):F(e,this.resolutionOrigin)}
      </div>
      <div class="approval-page__heading">
        <h1 id="approval-page-title" tabindex=${t?d:-1}>${i}</h1>
        <div class="approval-page__chips">
          ${n.kind===`plugin`?u`${P(`plugin`,n.pluginId)}
                ${P(`tool`,n.toolName)}`:d}
          ${P(`agent`,n.agentId)}
        </div>
        <p>${a}</p>
      </div>
      ${O(n)}
      <div class="approval-page__timing">
        <span>${c(t?`approvalPage.expiresLabel`:`approvalPage.resolvedLabel`)}</span>
        <time
          datetime=${new Date(t?e.expiresAtMs:e.resolvedAtMs).toISOString()}
        >
          ${j(t?e.expiresAtMs:e.resolvedAtMs)}
        </time>
      </div>
      ${this.requestError===`connection`?this.renderConnectionError():d}
      ${t?u`
              <div
                class="approval-page__actions"
                role="group"
                aria-label=${c(`approvalPage.actionsLabel`)}
              >
                ${n.allowedDecisions.map(e=>u`
                    <button
                      type="button"
                      class="btn approval-page__action approval-page__action--${e}"
                      data-decision=${e}
                      ?disabled=${this.resolving||!this.hasGatewayConnection||!r||this.requestError!==null}
                      @click=${()=>void this.resolveApproval(e)}
                    >
                      ${this.resolvingDecision===e?c(`approvalPage.resolvingDecision`,{decision:M(e)}):M(e)}
                    </button>
                  `)}
              </div>
            `:u`
              <div class="approval-page__terminal" role="status">
                ${c(`approvalPage.safeToClose`)}
              </div>
            `}
    `}render(){let e=this.connected&&!this.approvalsAccess,t=this.requestError===`unavailable`,n=this.requestError===`connection`&&!this.approval,r=e?`missing-scope`:t?`unavailable`:n?`connection-error`:this.approval?.status??`loading`,i=this.approval?.presentation,a=i?.kind===`plugin`?i.severity?.trim().toLowerCase():null,o=i?.kind===`exec`||a===`warning`||a===`warn`?`warning`:a===`danger`||a===`critical`||a===`error`?`danger`:`info`;return u`
      <main class="approval-page" data-state=${r}>
        <div class="approval-page__backdrop" aria-hidden="true"></div>
        <section
          class="approval-page__card approval-page__card--severity-${o}"
          aria-labelledby="approval-page-title"
          aria-busy=${this.loading||this.resolving?`true`:`false`}
        >
          ${this.renderHeader()}
          <div class="approval-page__content">
            ${e?this.renderMissingScope():this.loading&&!this.approval?this.renderLoading():n?this.renderConnectionState():t||!this.approval?this.renderUnavailable():this.renderApproval(this.approval)}
          </div>
        </section>
        <a class="approval-page__back-link" href=${`${this.context.basePath}/chat`}>
          ${c(`approvalPage.openControlUi`)}
        </a>
      </main>
    `}updateDocumentTitle(){let e=`${this.connected&&!this.approvalsAccess?c(`common.disabled`):this.requestError===`unavailable`?c(`approvalPage.unavailableTitle`):this.requestError===`connection`&&!this.approval?c(`approvalPage.connectionErrorTitle`):this.approval?this.approval.status===`pending`?this.approval.presentation.kind===`plugin`?this.approval.presentation.title:c(`approvalPage.execTitle`):F(this.approval,this.resolutionOrigin):c(`approvalPage.loadingTitle`)} — ${c(`approvalPage.brandName`)}`;document.title=e,this.activeDocumentTitle=e}},i([r({context:g,subscribe:!1})],B.prototype,`context`,void 0),i([h({attribute:`approval-id`})],B.prototype,`approvalId`,void 0),i([p()],B.prototype,`approval`,void 0),i([p()],B.prototype,`connected`,void 0),i([p()],B.prototype,`approvalsAccess`,void 0),i([p()],B.prototype,`approvalGrantAccess`,void 0),i([p()],B.prototype,`loading`,void 0),i([p()],B.prototype,`resolving`,void 0),i([p()],B.prototype,`resolvingDecision`,void 0),i([p()],B.prototype,`requestError`,void 0),i([p()],B.prototype,`resolutionOrigin`,void 0)})))()}function H(){return(H=e((()=>{V(),customElements.get(`openclaw-approval-page`)||customElements.define(`openclaw-approval-page`,B)})))()}H();
//# sourceMappingURL=approval-page-registration-AmxqdUHZ.js.map