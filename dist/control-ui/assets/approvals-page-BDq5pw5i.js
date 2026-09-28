import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Dh9Nir5C.js";import{Fs as i,Gl as a,Jl as o,Ll as s,Ls as c,Xl as l,nc as u,tc as d,zl as f}from"./control-ui-core-BfjCgLp6.js";import{$ as p,X as m,Y as h,ct as g,nt as _}from"./lit-runtime-L6OV30Vo.js";import{Di as v,Oi as y,Or as b,Qa as x,fo as S,gt as C,ht as w,kr as T}from"./control-ui-core-qT0XjEdV.js";import{Y as E,q as D}from"./control-ui-boot-shared-C2_wL71J.js";import{Ct as O,St as k,bt as A,ht as j,pt as M,vt as N}from"./control-ui-boot-shared-Bm2ZxasE.js";import{n as P,t as F}from"./settings-workspace-DjAwV7nI.js";function I(e,t){if(e.revokedAtMs!==null)return l(`standingGrants.stateRevoked`);if(e.expiresAtMs!==null&&e.expiresAtMs<=t)return l(`standingGrants.stateExpired`);if(e.expiresAtMs!==null){let n=Math.max(1,Math.ceil((e.expiresAtMs-t)/864e5));return l(`standingGrants.stateExpiresIn`,{count:String(n)})}return l(`standingGrants.stateUntilRevoked`)}function L(e,t){return e.revokedAtMs===null&&(e.expiresAtMs===null||e.expiresAtMs>t)}function R(e){return new Intl.DateTimeFormat(o.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function z(e){switch(e){case`exec`:return l(`approvalHistory.kinds.exec`);case`plugin`:return l(`approvalHistory.kinds.plugin`);case`system-agent`:return l(`approvalHistory.kinds.systemAgent`)}return e}function B(e){switch(e){case`allowed`:return l(`approvalHistory.statuses.allowed`);case`denied`:return l(`approvalHistory.statuses.denied`);case`expired`:return l(`approvalHistory.statuses.expired`);case`cancelled`:return l(`approvalHistory.statuses.cancelled`)}return e}function V(e){switch(e){case`allow-once`:return l(`approvalHistory.decisions.allowOnce`);case`allow-always`:return l(`approvalHistory.decisions.allowAlways`);case`deny`:return l(`approvalHistory.decisions.deny`);case void 0:return l(`approvalHistory.notApplicable`)}return e}function H(e){switch(e){case`user`:return l(`approvalHistory.reasons.user`);case`timeout`:return l(`approvalHistory.reasons.timeout`);case`malformed-verdict`:return l(`approvalHistory.reasons.malformedVerdict`);case`no-route`:return l(`approvalHistory.reasons.noRoute`);case`run-aborted`:return l(`approvalHistory.reasons.runAborted`);case`gateway-restart`:return l(`approvalHistory.reasons.gatewayRestart`);case`storage-corrupt`:return l(`approvalHistory.reasons.storageCorrupt`)}return e}function U(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||l(`approvalHistory.unknown`)}function W(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):l(`approvalHistory.unknown`)}function G(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:l(`approvalHistory.unknown`)}var K,q,J,Y;function X(){return(X=e((()=>{t(),h(),_(),D(),x(),y(),w(),b(),M(),F(),a(),c(),f(),u(),K=50,q=`operator.approvals`,J=`https://docs.openclaw.ai/tools/exec-approvals`,Y=class extends s{constructor(...e){super(...e),this.items=[],this.grants=[],this.grantsError=null,this.revokingGrantId=null,this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.approvalsAccess=!0,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.historyRefreshPending=!1,this.subscriptions=new d(this).effect(()=>this.context?.gateway,e=>{this.gatewaySource!==e&&this.resetHistory(!0),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot);let t=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)}),n=e.subscribeEvents(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.approvalsAccess&&T(e.snapshot).canReviewApprovals&&C(t.event,t.payload)&&(this.historyRefreshPending=!0,!this.loading&&!this.loadingMore&&this.loadPage(!0))});return()=>{t(),n()}})}disconnectedCallback(){this.subscriptions.clear(),this.resetHistory(!1),this.gatewaySource=null,super.disconnectedCallback()}resetHistory(e){this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.historyRefreshPending=!1,e&&(this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null)}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=T(e).canReviewApprovals,i=r!==this.approvalsAccess;this.connected=e.phase===`connected`,this.approvalsAccess=r,t||i?(this.client=e.client,this.resetHistory(!0)):n&&(this.resetHistory(!1),e.phase===`connected`&&(this.hasLoaded=!1)),e.phase===`connected`&&e.client&&this.approvalsAccess&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||!this.approvalsAccess||!T(n.snapshot).canReviewApprovals||this.loading||this.loadingMore)return;let r=this.requestGeneration,a=e?void 0:this.nextCursor??void 0;if(!e&&!a)return;e?(this.historyRefreshPending=!1,this.loading=!0):this.loadingMore=!0,this.error=null;let o=()=>this.isConnected&&this.connected&&this.approvalsAccess&&this.gatewaySource===n&&this.context.gateway===n&&n.snapshot.phase===`connected`&&T(n.snapshot).canReviewApprovals&&this.client===t&&this.requestGeneration===r;try{let n=await t.request(`approval.history`,{...a?{cursor:a}:{},limit:K});if(!E(n))throw Error(l(`approvalHistory.invalidResponse`));if(!o())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0,e&&this.loadGrants(t,o)}catch(e){o()&&(this.error=i(e),this.hasLoaded=!0)}finally{o()&&(this.loading=!1,this.loadingMore=!1,this.historyRefreshPending&&this.loadPage(!0))}}async loadGrants(e,t){try{let n=await e.request(`exec.approval.grants.list`,{});if(!t())return;this.grants=Array.isArray(n.grants)?n.grants:[],this.grantsError=null}catch(e){t()&&(this.grantsError=i(e))}}async revokeGrant(e){let t=this.client;if(t&&this.revokingGrantId===null){this.revokingGrantId=e;try{await t.request(`exec.approval.grants.revoke`,{grantId:e});let n=Date.now();this.grants=this.grants.map(t=>t.grantId===e?{...t,revokedAtMs:n}:t),this.grantsError=null}catch(e){this.grantsError=i(e)}finally{this.revokingGrantId=null}}}renderGrants(){let e=Date.now();return p`
      <h2 class="settings-section-title">${l(`standingGrants.title`)}</h2>
      <p class="settings-section-subtitle">${l(`standingGrants.description`)}</p>
      ${this.grantsError?p`<div class="callout danger">${this.grantsError}</div>`:m}
      <div class="data-table-container">
        <table class="data-table standing-grants-table settings-table--stacked" role="table">
          <thead>
            <tr>
              <th scope="col">${l(`standingGrants.columns.automation`)}</th>
              <th scope="col">${l(`standingGrants.columns.command`)}</th>
              <th scope="col">${l(`standingGrants.columns.uses`)}</th>
              <th scope="col">${l(`standingGrants.columns.state`)}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            ${this.grants.length===0?p`
                    <tr>
                      <td colspan="5" class="data-table-empty-cell">
                        <div class="data-table-empty-state" role="status" aria-live="polite">
                          ${l(`standingGrants.empty`)}
                        </div>
                      </td>
                    </tr>
                  `:this.grants.map(t=>p`
                      <tr>
                        <td data-label=${l(`standingGrants.columns.automation`)}>
                          ${t.cronJobName??t.cronJobId}
                        </td>
                        <td class="mono" data-label=${l(`standingGrants.columns.command`)}>
                          ${t.command}
                        </td>
                        <td data-label=${l(`standingGrants.columns.uses`)}>${t.useCount}</td>
                        <td data-label=${l(`standingGrants.columns.state`)}>
                          ${I(t,e)}
                        </td>
                        <td>
                          ${L(t,e)?p`
                                  <button
                                    class="btn btn--sm"
                                    ?disabled=${this.revokingGrantId!==null}
                                    @click=${()=>void this.revokeGrant(t.grantId)}
                                  >
                                    ${this.revokingGrantId===t.grantId?l(`standingGrants.revoking`):l(`standingGrants.revoke`)}
                                  </button>
                                `:m}
                        </td>
                      </tr>
                    `)}
          </tbody>
        </table>
      </div>
    `}renderTable(){return this.loading&&this.items.length===0?N(A({label:l(`approvalHistory.loading`)})):p`
      <div class="data-table-container">
        <table class="data-table approval-history-table settings-table--stacked" role="table">
          <thead>
            <tr>
              <th scope="col">${l(`approvalHistory.columns.resolved`)}</th>
              <th scope="col">${l(`approvalHistory.columns.kind`)}</th>
              <th scope="col">${l(`approvalHistory.columns.request`)}</th>
              <th scope="col">${l(`approvalHistory.columns.decision`)}</th>
              <th scope="col">${l(`approvalHistory.columns.reason`)}</th>
              <th scope="col">${l(`approvalHistory.columns.source`)}</th>
              <th scope="col">${l(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?p`
                    <tr>
                      <td colspan="7" class="data-table-empty-cell">
                        <div class="data-table-empty-state" role="status" aria-live="polite">
                          ${this.error||!this.hasLoaded?l(`approvalHistory.unknown`):l(`approvalHistory.empty`)}
                        </div>
                      </td>
                    </tr>
                  `:this.items.map(e=>p`
                      <tr>
                        <td data-label=${l(`approvalHistory.columns.resolved`)}>
                          ${R(e.resolvedAtMs)}
                        </td>
                        <td data-label=${l(`approvalHistory.columns.kind`)}>
                          ${z(e.presentation.kind)}
                        </td>
                        <td class="mono" data-label=${l(`approvalHistory.columns.request`)}>
                          ${U(e)}
                        </td>
                        <td data-label=${l(`approvalHistory.columns.decision`)}>
                          ${B(e.status)} ·
                          ${V(`decision`in e?e.decision:void 0)}
                        </td>
                        <td data-label=${l(`approvalHistory.columns.reason`)}>
                          ${H(e.reason)}
                        </td>
                        <td class="mono" data-label=${l(`approvalHistory.columns.source`)}>
                          ${W(e)}
                        </td>
                        <td class="mono" data-label=${l(`approvalHistory.columns.resolver`)}>
                          ${G(e)}
                        </td>
                      </tr>
                    `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${l(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?p`
                  <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                    ${this.loadingMore?l(`approvalHistory.loadingMore`):l(`approvalHistory.loadMore`)}
                  </button>
                `:m}
        </div>
      </div>
    `}render(){let e=k(p`
        ${this.connected?m:p`<div class="callout warn">${l(`approvalHistory.offline`)}</div>`}
        ${this.connected&&!this.approvalsAccess?p`
                <div class="callout warn" role="status">
                  ${l(`common.disabled`)} · <code>${q}</code>
                </div>
              `:m}
        ${this.approvalsAccess&&this.error?p`
                <div class="callout danger">
                  ${this.error}
                  <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                    ${l(`common.retry`)}
                  </button>
                </div>
              `:m}
        ${this.approvalsAccess?this.renderGrants():m}
        ${this.approvalsAccess?p`<h2 class="settings-section-title">${l(`standingGrants.historyTitle`)}</h2>`:m}
        ${this.approvalsAccess?this.renderTable():m}
      `,{wide:!0});return p`
      ${O({title:S(`approvals`),subtitle:p`${l(`approvalHistory.description`)}
        ${j(J)}`})}
      ${P(e)}
    `}},r([n({context:v,subscribe:!0})],Y.prototype,`context`,void 0),r([g()],Y.prototype,`items`,void 0),r([g()],Y.prototype,`grants`,void 0),r([g()],Y.prototype,`grantsError`,void 0),r([g()],Y.prototype,`revokingGrantId`,void 0),r([g()],Y.prototype,`nextCursor`,void 0),r([g()],Y.prototype,`loading`,void 0),r([g()],Y.prototype,`loadingMore`,void 0),r([g()],Y.prototype,`error`,void 0),r([g()],Y.prototype,`connected`,void 0),r([g()],Y.prototype,`approvalsAccess`,void 0),customElements.get(`openclaw-approvals-page`)||customElements.define(`openclaw-approvals-page`,Y)})))()}X();
//# sourceMappingURL=approvals-page-BDq5pw5i.js.map