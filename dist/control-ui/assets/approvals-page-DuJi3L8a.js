import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,du as a,ju as o,kc as s,ku as c,pu as l}from"./control-ui-core-CTSdBcaH.js";import{Ra as u,Sr as d,Ti as f,vt as p,wa as m,wi as h,xr as g,yt as _}from"./control-ui-core-vFnxmx94.js";import{$ as v,X as y,Y as b,ct as x,nt as S}from"./lit-runtime-TNZj1e-P.js";import{fn as C,mn as w}from"./control-ui-boot-shared-DSyxl38Y.js";import{Xr as T,Zr as E,ii as D}from"./ui-CnRtCcYL.js";import{G as O,I as k,K as A,R as j,U as M,Y as N,l as P,u as F}from"./control-ui-boot-shared-DeF_v3ER.js";function I(e,t){if(e.revokedAtMs!==null)return o(`standingGrants.stateRevoked`);if(e.expiresAtMs!==null&&e.expiresAtMs<=t)return o(`standingGrants.stateExpired`);if(e.expiresAtMs!==null){let n=Math.max(1,Math.ceil((e.expiresAtMs-t)/864e5));return o(`standingGrants.stateExpiresIn`,{count:String(n)})}return o(`standingGrants.stateUntilRevoked`)}function L(e,t){return e.revokedAtMs===null&&(e.expiresAtMs===null||e.expiresAtMs>t)}function R(e){return new Intl.DateTimeFormat(c.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function z(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||o(`approvalHistory.unknown`)}function B(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):o(`approvalHistory.unknown`)}function V(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:o(`approvalHistory.unknown`)}var H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{E(),b(),S(),C(),m(),f(),p(),g(),k(),P(),r(),l(),i(),t(),H=50,U=`operator.approvals`,W=`https://docs.openclaw.ai/tools/exec-approvals`,G={exec:`approvalHistory.kinds.exec`,plugin:`approvalHistory.kinds.plugin`,"system-agent":`approvalHistory.kinds.systemAgent`},K={allowed:`approvalHistory.statuses.allowed`,denied:`approvalHistory.statuses.denied`,expired:`approvalHistory.statuses.expired`,cancelled:`approvalHistory.statuses.cancelled`},q={"allow-once":`approvalHistory.decisions.allowOnce`,"allow-always":`approvalHistory.decisions.allowAlways`,deny:`approvalHistory.decisions.deny`},J={user:`approvalHistory.reasons.user`,timeout:`approvalHistory.reasons.timeout`,"malformed-verdict":`approvalHistory.reasons.malformedVerdict`,"no-route":`approvalHistory.reasons.noRoute`,"run-aborted":`approvalHistory.reasons.runAborted`,"gateway-restart":`approvalHistory.reasons.gatewayRestart`,"storage-corrupt":`approvalHistory.reasons.storageCorrupt`},Y=class extends n{constructor(...e){super(...e),this.items=[],this.grants=[],this.grantsError=null,this.revokingGrantId=null,this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.approvalsAccess=!0,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.historyRefreshPending=!1,this.subscriptions=new s(this).effect(()=>this.context?.gateway,e=>{this.gatewaySource!==e&&this.resetHistory(!0),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot);let t=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)}),n=e.subscribeEvents(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.approvalsAccess&&d(e.snapshot).canReviewApprovals&&_(t.event,t.payload)&&(this.historyRefreshPending=!0,!this.loading&&!this.loadingMore&&this.loadPage(!0))});return()=>{t(),n()}})}disconnectedCallback(){this.subscriptions.clear(),this.resetHistory(!1),this.gatewaySource=null,super.disconnectedCallback()}resetHistory(e){this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.historyRefreshPending=!1,this.revokingGrantId=null,e&&(this.grants=[],this.grantsError=null,this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null)}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=d(e).canReviewApprovals,i=r!==this.approvalsAccess;this.connected=e.phase===`connected`,this.approvalsAccess=r,t||i?(this.client=e.client,this.resetHistory(!0)):n&&(this.resetHistory(!1),e.phase===`connected`&&(this.hasLoaded=!1)),e.phase===`connected`&&e.client&&this.approvalsAccess&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||!this.approvalsAccess||!d(n.snapshot).canReviewApprovals||this.loading||this.loadingMore)return;let r=this.requestGeneration,i=e?void 0:this.nextCursor??void 0;if(!e&&!i)return;e?(this.historyRefreshPending=!1,this.loading=!0):this.loadingMore=!0,this.error=null;let s=()=>this.isCurrentRequest(t,n,r);try{let n=await t.request(`approval.history`,{...i?{cursor:i}:{},limit:H});if(!w(n))throw Error(o(`approvalHistory.invalidResponse`));if(!s())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0,e&&this.loadGrants(t,s)}catch(e){s()&&(this.error=a(e),this.hasLoaded=!0)}finally{s()&&(this.loading=!1,this.loadingMore=!1,this.historyRefreshPending&&this.loadPage(!0))}}async loadGrants(e,t){try{let n=await e.request(`exec.approval.grants.list`,{});if(!t())return;this.grants=Array.isArray(n.grants)?n.grants:[],this.grantsError=null}catch(e){t()&&(this.grantsError=a(e))}}isCurrentRequest(e,t,n){return this.isConnected&&this.connected&&this.approvalsAccess&&this.gatewaySource===t&&this.context.gateway===t&&t.snapshot.phase===`connected`&&d(t.snapshot).canReviewApprovals&&this.client===e&&this.requestGeneration===n}async revokeGrant(e){let t=this.client,n=this.gatewaySource,r=this.requestGeneration;if(!t||!n||this.revokingGrantId!==null||!this.isCurrentRequest(t,n,r))return;let i=()=>this.isCurrentRequest(t,n,r);this.revokingGrantId=e;try{if(await t.request(`exec.approval.grants.revoke`,{grantId:e}),!i())return;let n=Date.now();this.grants=this.grants.map(t=>t.grantId===e?{...t,revokedAtMs:n}:t),this.grantsError=null}catch(e){i()&&(this.grantsError=a(e))}finally{i()&&(this.revokingGrantId=null)}}renderGrants(){let e=Date.now();return N({title:v`<span id="standing-grants-title">${o(`standingGrants.title`)}</span>`,description:o(`standingGrants.description`),notice:this.grantsError?v`<div class="callout danger" role="alert">${this.grantsError}</div>`:y},v`
        <div class="data-table-container">
          <table
            class="data-table standing-grants-table settings-table--stacked"
            role="table"
            aria-labelledby="standing-grants-title"
          >
            <thead>
              <tr>
                <th scope="col">${o(`standingGrants.columns.automation`)}</th>
                <th scope="col">${o(`standingGrants.columns.command`)}</th>
                <th scope="col">${o(`standingGrants.columns.uses`)}</th>
                <th scope="col">${o(`standingGrants.columns.state`)}</th>
                <th scope="col"><span class="sr-only">${o(`standingGrants.revoke`)}</span></th>
              </tr>
            </thead>
            <tbody>
              ${this.grants.length===0?v`
                      <tr>
                        <td colspan="5" class="data-table-empty-cell">
                          <div class="data-table-empty-state" role="status" aria-live="polite">
                            ${o(`standingGrants.empty`)}
                          </div>
                        </td>
                      </tr>
                    `:this.grants.map(t=>v`
                        <tr>
                          <td data-label=${o(`standingGrants.columns.automation`)}>
                            ${t.cronJobName??t.cronJobId}
                          </td>
                          <td class="mono" data-label=${o(`standingGrants.columns.command`)}>
                            ${t.command}
                          </td>
                          <td data-label=${o(`standingGrants.columns.uses`)}>${t.useCount}</td>
                          <td data-label=${o(`standingGrants.columns.state`)} aria-live="polite">
                            ${I(t,e)}
                          </td>
                          <td>
                            ${L(t,e)?v`
                                    <button
                                      class="btn btn--sm"
                                      aria-label=${`${this.revokingGrantId===t.grantId?o(`standingGrants.revoking`):o(`standingGrants.revoke`)}: ${t.cronJobName??t.cronJobId} — ${t.command}`}
                                      ?disabled=${this.revokingGrantId!==null}
                                      @click=${()=>void this.revokeGrant(t.grantId)}
                                    >
                                      ${this.revokingGrantId===t.grantId?o(`standingGrants.revoking`):o(`standingGrants.revoke`)}
                                    </button>
                                  `:y}
                          </td>
                        </tr>
                      `)}
            </tbody>
          </table>
        </div>
      `)}renderTable(){return this.loading&&this.items.length===0?M({label:o(`approvalHistory.loading`)}):v`
      <div class="data-table-container">
        <table
          class="data-table approval-history-table settings-table--stacked"
          role="table"
          aria-labelledby="approval-history-title"
          aria-busy=${this.loading||this.loadingMore?`true`:`false`}
        >
          <thead>
            <tr>
              <th scope="col">${o(`approvalHistory.columns.resolved`)}</th>
              <th scope="col">${o(`approvalHistory.columns.kind`)}</th>
              <th scope="col">${o(`approvalHistory.columns.request`)}</th>
              <th scope="col">${o(`approvalHistory.columns.decision`)}</th>
              <th scope="col">${o(`approvalHistory.columns.reason`)}</th>
              <th scope="col">${o(`approvalHistory.columns.source`)}</th>
              <th scope="col">${o(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?v`
                    <tr>
                      <td colspan="7" class="data-table-empty-cell">
                        <div class="data-table-empty-state" role="status" aria-live="polite">
                          ${this.error||!this.hasLoaded?o(`approvalHistory.unknown`):o(`approvalHistory.empty`)}
                        </div>
                      </td>
                    </tr>
                  `:this.items.map(e=>v`
                      <tr>
                        <td data-label=${o(`approvalHistory.columns.resolved`)}>
                          ${R(e.resolvedAtMs)}
                        </td>
                        <td data-label=${o(`approvalHistory.columns.kind`)}>
                          ${o(G[e.presentation.kind])}
                        </td>
                        <td class="mono" data-label=${o(`approvalHistory.columns.request`)}>
                          ${z(e)}
                        </td>
                        <td data-label=${o(`approvalHistory.columns.decision`)}>
                          ${o(K[e.status])} ·
                          ${o(`decision`in e&&e.decision?q[e.decision]:`approvalHistory.notApplicable`)}
                        </td>
                        <td data-label=${o(`approvalHistory.columns.reason`)}>
                          ${o(J[e.reason])}
                        </td>
                        <td class="mono" data-label=${o(`approvalHistory.columns.source`)}>
                          ${B(e)}
                        </td>
                        <td class="mono" data-label=${o(`approvalHistory.columns.resolver`)}>
                          ${V(e)}
                        </td>
                      </tr>
                    `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${o(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?v`
                  <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                    ${this.loadingMore?o(`approvalHistory.loadingMore`):o(`approvalHistory.loadMore`)}
                  </button>
                `:y}
        </div>
      </div>
    `}render(){let e=O(v`
        ${this.connected?y:v`<div class="callout warn" role="status">${o(`approvalHistory.offline`)}</div>`}
        ${this.connected&&!this.approvalsAccess?v`
                <div class="callout warn" role="status">
                  ${o(`common.disabled`)} · <code>${U}</code>
                </div>
              `:y}
        ${this.approvalsAccess&&this.error?v`
                <div class="callout danger" role="alert">
                  ${this.error}
                  <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                    ${o(`common.retry`)}
                  </button>
                </div>
              `:y}
        ${this.approvalsAccess?this.renderGrants():y}
        ${this.approvalsAccess?N({title:v`<span id="approval-history-title">
                    ${o(`standingGrants.historyTitle`)}
                  </span>`},this.renderTable()):y}
      `,{wide:!0});return v`
      ${A({title:u(`approvals`),subtitle:v`${o(`approvalHistory.description`)}
        ${j(W)}`})}
      ${F(e)}
    `}},D([T({context:h,subscribe:!0})],Y.prototype,`context`,void 0),D([x()],Y.prototype,`items`,void 0),D([x()],Y.prototype,`grants`,void 0),D([x()],Y.prototype,`grantsError`,void 0),D([x()],Y.prototype,`revokingGrantId`,void 0),D([x()],Y.prototype,`nextCursor`,void 0),D([x()],Y.prototype,`loading`,void 0),D([x()],Y.prototype,`loadingMore`,void 0),D([x()],Y.prototype,`error`,void 0),D([x()],Y.prototype,`connected`,void 0),D([x()],Y.prototype,`approvalsAccess`,void 0),customElements.get(`openclaw-approvals-page`)||customElements.define(`openclaw-approvals-page`,Y)})))()}X();
//# sourceMappingURL=approvals-page-DuJi3L8a.js.map