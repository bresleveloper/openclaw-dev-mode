import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,ju as i,ku as a}from"./control-ui-core-bJHyI7AF.js";import{Ba as o,Ha as s,Sr as c,Ti as l,Xn as u,Zn as d,wi as f,xr as p}from"./control-ui-core-DNh4McGE.js";import{$ as m,X as h,Y as g,ct as _,nt as v,ut as y}from"./lit-runtime-DyST807n.js";import{fn as b,hn as x,pn as S}from"./control-ui-boot-shared-CE7ueCxh.js";import{Xr as C,Zr as w,_a as T,ii as E}from"./ui-DeikvIdP.js";import{Bn as D,Vn as O}from"./control-ui-boot-shared-C9uJ732w.js";import"./approval-BhCMRUNv.js";function k(e,t){return t?m`<div class="approval-page__meta-row">
        <dt>${e}</dt>
        <dd title=${t}><bdi dir="ltr">${t}</bdi></dd>
      </div>`:h}function A(e){let t=e.kind!==`system-agent`&&e.scope?O(e.scope):null,n=t?m`<div class="approval-page__warning" role="note">${t}</div>`:h;return e.kind===`exec`?m`
      ${n}
      ${e.warningText?m`<div class="approval-page__warning" role="note">${e.warningText}</div>`:h}
      ${e.commandPreview?m`
              <div class="approval-page__preview-label">${i(`approvalPage.summaryLabel`)}</div>
              <div class="approval-page__summary mono" dir="ltr">
                ${e.commandPreview}
              </div>
            `:h}
      <div class="approval-page__preview-label">${i(`approvalPage.commandLabel`)}</div>
      <pre class="approval-page__preview mono" dir="ltr">${e.commandText}</pre>
      <dl class="approval-page__meta">
        ${k(i(`execApproval.labels.host`),e.host)}
        ${k(i(`approvalPage.nodeLabel`),e.nodeId)}
      </dl>
    `:m`
    ${n}
    <div class="approval-page__preview-label">${i(`approvalPage.requestLabel`)}</div>
    <div class=${`approval-page__preview approval-page__preview--prose`}>${e.description}</div>
    ${e.kind===`plugin`&&e.detail?m`<pre class="approval-page__preview mono" dir="ltr">${e.detail}</pre>`:h}
  `}function j(){return(j=e((()=>{g(),D(),n()})))()}function M(e){return e instanceof u?(T(e.details)?e.details.reason:void 0)===`APPROVAL_NOT_FOUND`||e.gatewayCode===`APPROVAL_NOT_FOUND`||e.gatewayCode===`INVALID_REQUEST`:!1}function N(e){return new Intl.DateTimeFormat(a.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function P(e){return i({"allow-once":`execApproval.allowOnce`,"allow-always":`execApproval.alwaysAllow`,deny:`execApproval.deny`}[e])}function F(e,t){return e.applied?t===`deny`?e.approval.status===`denied`:e.approval.status===`allowed`&&e.approval.decision===t:!0}function I(e,t){let n=t?.trim();return n?m`<span class="approval-page__chip mono" data-approval-chip=${e}>${n}</span>`:h}function L(e,t){return t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`)?i(`approvalPage.resolvedElsewhere`):t===`here`&&e.status===`allowed`?i(`approvalPage.approvedHere`):t===`here`&&e.status===`denied`?i(`approvalPage.deniedHere`):i({allowed:`approvalPage.approved`,denied:`approvalPage.denied`,expired:`approvalPage.expired`,cancelled:`approvalPage.cancelled`,pending:`approvalPage.pending`}[e.status])}function R(e,t){return t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`)?i(`approvalPage.resolvedElsewhereDescription`):e.status===`allowed`?i(e.decision===`allow-always`?`approvalPage.allowedAlwaysDescription`:`approvalPage.allowedOnceDescription`):i({denied:`approvalPage.deniedDescription`,expired:`approvalPage.expiredDescription`,cancelled:`approvalPage.cancelledDescription`,pending:`approvalPage.pendingDescription`}[e.status])}var z,B,V,H;function U(){return(U=e((()=>{w(),g(),v(),b(),d(),l(),p(),s(),n(),r(),j(),z=2e3,B=250,V=`operator.approvals`,H=class extends t{constructor(...e){super(...e),this.approvalId=``,this.approval=null,this.connected=!1,this.approvalsAccess=!0,this.approvalGrantAccess=!1,this.loading=!0,this.resolvingDecision=null,this.requestError=null,this.resolutionOrigin=`observed`,this.client=null,this.operationGeneration=0,this.handleVisibilityChange=()=>{if(document.visibilityState!==`visible`){this.clearPollTimer();return}this.approval?.status===`pending`&&this.hasGatewayConnection&&this.hasApprovalAccess&&this.resolvingDecision===null&&this.loadApproval({background:!0})}}connectedCallback(){this.replaceChildren(),super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.previousDocumentTitle=document.title,this.bindApprovalId(!0),this.stopGateway=this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.stopGateway?.(),this.stopGateway=void 0,this.invalidateOperations(),this.clearPollTimer(),this.client=null,this.connected=!1,this.previousDocumentTitle!==void 0&&(!this.activeDocumentTitle||document.title===this.activeDocumentTitle)&&(document.title=this.previousDocumentTitle),this.previousDocumentTitle=void 0,this.activeDocumentTitle=void 0,super.disconnectedCallback()}updated(e){e.has(`approvalId`)&&this.bindApprovalId(),this.updateDocumentTitle()}bindApprovalId(e=!1){(e||this.boundApprovalId!==this.approvalId)&&(this.boundApprovalId=this.approvalId,this.invalidateOperations(),this.clearPollTimer(),this.approval=null,this.loading=!!this.approvalId,this.resolvingDecision=null,this.requestError=this.approvalId?null:`unavailable`,this.resolutionOrigin=`observed`,this.approvalId&&this.connected&&this.client&&this.hasApprovalAccess&&this.loadApproval())}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=e.phase===`connected`&&!this.connected,i=c(e),a=i.canReviewApprovals,o=a!==this.approvalsAccess,s=i.canGrantApprovals!==this.approvalGrantAccess;if(this.client=e.client,this.connected=e.phase===`connected`,this.approvalsAccess=a,this.approvalGrantAccess=i.canGrantApprovals,(t||n||o||s)&&(this.invalidateOperations(),this.clearPollTimer(),this.resolvingDecision=null),this.approvalsAccess||(this.approval=null),e.phase!==`connected`||!e.client){this.approvalId&&(this.loading=!1,this.requestError=!this.approval||this.approval.status===`pending`?`connection`:null);return}if(!this.approvalsAccess){this.approval=null,this.loading=!1,this.requestError=null;return}if(!this.approvalId){this.loading=!1,this.requestError=`unavailable`;return}if(t||r||o||!this.approval){this.loadApproval();return}this.schedulePoll()}invalidateOperations(){this.operationGeneration+=1}isCurrentOperation(e){return this.hasGatewayConnection&&this.hasApprovalAccess&&this.client===e.client&&this.approvalId===e.id&&this.operationGeneration===e.generation}get hasGatewayConnection(){return this.connected&&!!this.client}get hasApprovalAccess(){return this.approvalsAccess&&c(this.context.gateway.snapshot).canReviewApprovals}get hasApprovalGrantAccess(){return this.approvalGrantAccess&&c(this.context.gateway.snapshot).canGrantApprovals}async loadApproval(e={}){let t=this.client,n=this.approvalId;if(!t||!this.connected||!n||!this.hasApprovalAccess)return;let r=++this.operationGeneration,i=this.approval?.status,a=!1;this.clearPollTimer(),e.background||(this.loading=!0);try{let e=await t.request(`approval.get`,{id:n});if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;if(!S(e)||e.approval.id!==n){this.approval=null,this.requestError=`unavailable`;return}this.requestError=null,this.approval=e.approval,e.approval.status===`pending`?this.resolutionOrigin=`observed`:i===`pending`&&this.resolutionOrigin===`observed`&&(this.resolutionOrigin=`elsewhere`,a=!0)}catch(e){if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;M(e)?(this.approval=null,this.requestError=`unavailable`):this.requestError=`connection`}finally{this.isCurrentOperation({client:t,generation:r,id:n})&&(this.loading=!1,this.schedulePoll())}a&&this.isCurrentOperation({client:t,generation:r,id:n})&&await this.focusTerminalState()}async resolveApproval(e){let t=this.approval,n=this.client,r=this.approvalId;if(!n||!this.connected||!this.hasApprovalGrantAccess||!r||t?.status!==`pending`||!Array.prototype.includes.call(t.presentation.allowedDecisions,e)||this.resolvingDecision!==null)return;let i=t.presentation.kind,a=++this.operationGeneration,o=()=>this.isCurrentOperation({client:n,generation:a,id:r})&&this.hasApprovalGrantAccess,s=!1,c=!1;this.clearPollTimer(),this.resolvingDecision=e,this.requestError=null;try{let t=await n.request(`approval.resolve`,{id:r,kind:i,decision:e});if(!o())return;!x(t)||t.approval.id!==r||t.approval.presentation.kind!==i||!F(t,e)?(this.requestError=`connection`,c=!0):(this.approval=t.approval,this.resolutionOrigin=t.applied?`here`:`elsewhere`,s=!0)}catch(e){if(!o())return;this.requestError=M(e)?`unavailable`:`connection`}finally{o()&&(this.resolvingDecision=null,this.schedulePoll())}if(c&&o()){await this.loadApproval({background:!0});return}s&&o()&&await this.focusTerminalState()}async focusTerminalState(){if(await this.updateComplete,this.approval?.status===`pending`)return;let e=this.querySelector(`#approval-page-title`);e?.focus({preventScroll:!0}),typeof e?.scrollIntoView==`function`&&e.scrollIntoView({behavior:`auto`,block:`center`,inline:`nearest`})}clearPollTimer(){this.pollTimer!==void 0&&(globalThis.clearTimeout(this.pollTimer),this.pollTimer=void 0)}schedulePoll(){this.clearPollTimer();let e=this.approval;if(!this.hasGatewayConnection||!this.hasApprovalAccess||this.resolvingDecision!==null||this.requestError===`unavailable`||e?.status!==`pending`||document.visibilityState!==`visible`)return;let t=e.expiresAtMs-Date.now(),n=Math.max(B,Math.min(z,t+B));this.pollTimer=globalThis.setTimeout(()=>{this.pollTimer=void 0,this.loadApproval({background:!0})},n)}renderHeader(){return m`
      <header class="approval-page__brand">
        <img
          class="approval-page__logo"
          src=${o(`apple-touch-icon.png`,this.context.resourceBasePath)}
          alt=""
        />
        <div>
          <div class="approval-page__eyebrow">${i(`approvalPage.eyebrow`)}</div>
          <div class="approval-page__brand-name">${i(`approvalPage.brandName`)}</div>
        </div>
      </header>
    `}renderState(e){let t={loading:`approvalPage.loadingTitle`,unavailable:`approvalPage.unavailableTitle`,"missing-scope":`common.disabled`,connection:`approvalPage.connectionErrorTitle`}[e];return m`
      <div
        class="approval-page__state approval-page__state--${e===`missing-scope`?`unavailable`:e}"
        role=${e===`loading`?`status`:`alert`}
      >
        ${e===`loading`?m`<div class="approval-page__spinner" aria-hidden="true"></div>`:m`<div class="approval-page__state-mark" aria-hidden="true">!</div>`}
        <h1 id="approval-page-title">${i(t)}</h1>
        <p>
          ${e===`missing-scope`?m`<code>${V}</code>`:i({loading:`approvalPage.loadingDescription`,unavailable:`approvalPage.unavailableDescription`,connection:`approvalPage.connectionErrorDescription`}[e])}
        </p>
        ${e===`connection`?m`<button
                type="button"
                class="btn"
                ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
                @click=${()=>void this.loadApproval()}
              >
                ${i(`approvalPage.retry`)}
              </button>`:h}
      </div>
    `}renderConnectionError(){return m`
      <div class="approval-page__callout" role="alert">
        <div>
          <strong>${i(`approvalPage.connectionErrorTitle`)}</strong>
          <span>${i(`approvalPage.connectionErrorDescription`)}</span>
        </div>
        <button
          type="button"
          class="btn btn--sm"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${i(`approvalPage.retry`)}
        </button>
      </div>
    `}renderApproval(e){let t=e.status===`pending`,n=e.presentation,r=this.hasApprovalGrantAccess,a=t?n.kind===`plugin`?n.title:i(`approvalPage.execTitle`):L(e,this.resolutionOrigin),o=t?i(r?`approvalPage.pendingDescription`:`execApproval.reviewOnly`):R(e,this.resolutionOrigin);return m`
      <div class="approval-page__status" aria-live="polite" aria-atomic="true">
        <span
          class="approval-page__status-dot approval-page__status-dot--${e.status}"
          aria-hidden="true"
        ></span>
        ${t?i(`approvalPage.pending`):L(e,this.resolutionOrigin)}
      </div>
      <div class="approval-page__heading">
        <h1 id="approval-page-title" tabindex=${t?h:-1}>${a}</h1>
        <div class="approval-page__chips">
          ${n.kind===`plugin`?m`${I(`plugin`,n.pluginId)}
                ${I(`tool`,n.toolName)}`:h}
          ${I(`agent`,n.agentId)}
        </div>
        <p>${o}</p>
      </div>
      ${A(n)}
      <div class="approval-page__timing">
        <span>${i(t?`approvalPage.expiresLabel`:`approvalPage.resolvedLabel`)}</span>
        <time
          datetime=${new Date(t?e.expiresAtMs:e.resolvedAtMs).toISOString()}
        >
          ${N(t?e.expiresAtMs:e.resolvedAtMs)}
        </time>
      </div>
      ${this.requestError===`connection`?this.renderConnectionError():h}
      ${t?m`
              <div
                class="approval-page__actions"
                role="group"
                aria-label=${i(`approvalPage.actionsLabel`)}
              >
                ${n.allowedDecisions.map(e=>m`
                    <button
                      type="button"
                      class="btn approval-page__action approval-page__action--${e}"
                      data-decision=${e}
                      ?disabled=${this.resolvingDecision!==null||!this.hasGatewayConnection||!r||this.requestError!==null}
                      @click=${()=>void this.resolveApproval(e)}
                    >
                      ${this.resolvingDecision===e?i(`approvalPage.resolvingDecision`,{decision:P(e)}):P(e)}
                    </button>
                  `)}
              </div>
            `:m`
              <div class="approval-page__terminal" role="status">
                ${i(`approvalPage.safeToClose`)}
              </div>
            `}
    `}render(){let e=this.connected&&!this.approvalsAccess,t=this.requestError===`unavailable`,n=this.requestError===`connection`&&!this.approval,r=e?`missing-scope`:t?`unavailable`:n?`connection-error`:this.approval?.status??`loading`,a=this.approval?.presentation,o=a?.kind===`plugin`?a.severity?.trim().toLowerCase():null,s=a?.kind===`exec`||o===`warning`||o===`warn`?`warning`:o===`danger`||o===`critical`||o===`error`?`danger`:`info`;return m`
      <main class="approval-page" data-state=${r}>
        <div class="approval-page__backdrop" aria-hidden="true"></div>
        <section
          class="approval-page__card approval-page__card--severity-${s}"
          aria-labelledby="approval-page-title"
          aria-busy=${this.loading||this.resolvingDecision!==null?`true`:`false`}
        >
          ${this.renderHeader()}
          <div class="approval-page__content">
            ${e?this.renderState(`missing-scope`):this.loading&&!this.approval?this.renderState(`loading`):n?this.renderState(`connection`):t||!this.approval?this.renderState(`unavailable`):this.renderApproval(this.approval)}
          </div>
        </section>
        <a class="approval-page__back-link" href=${`${this.context.basePath}/chat`}>
          ${i(`approvalPage.openControlUi`)}
        </a>
      </main>
    `}updateDocumentTitle(){let e=`${this.connected&&!this.approvalsAccess?i(`common.disabled`):this.requestError===`unavailable`?i(`approvalPage.unavailableTitle`):this.requestError===`connection`&&!this.approval?i(`approvalPage.connectionErrorTitle`):this.approval?this.approval.status===`pending`?this.approval.presentation.kind===`plugin`?this.approval.presentation.title:i(`approvalPage.execTitle`):L(this.approval,this.resolutionOrigin):i(`approvalPage.loadingTitle`)} — ${i(`approvalPage.brandName`)}`;document.title=e,this.activeDocumentTitle=e}},E([C({context:f,subscribe:!1})],H.prototype,`context`,void 0),E([y({attribute:`approval-id`})],H.prototype,`approvalId`,void 0),E([_()],H.prototype,`approval`,void 0),E([_()],H.prototype,`connected`,void 0),E([_()],H.prototype,`approvalsAccess`,void 0),E([_()],H.prototype,`approvalGrantAccess`,void 0),E([_()],H.prototype,`loading`,void 0),E([_()],H.prototype,`resolvingDecision`,void 0),E([_()],H.prototype,`requestError`,void 0),E([_()],H.prototype,`resolutionOrigin`,void 0)})))()}function W(){return(W=e((()=>{U(),customElements.get(`openclaw-approval-page`)||customElements.define(`openclaw-approval-page`,H)})))()}W();
//# sourceMappingURL=approval-page-registration-D-HA6ScS.js.map