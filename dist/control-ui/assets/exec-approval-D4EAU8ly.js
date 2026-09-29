import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Es as n,Gl as r,Il as i,Xl as a,js as o,zl as s}from"./control-ui-core-DX6662ze.js";import{$ as c,X as l,Y as u,at as d,ct as f,nt as p,ut as m}from"./lit-runtime-BOUQsi_O.js";import{Fr as h}from"./control-ui-core-QgEwr0pF.js";import{On as g}from"./control-ui-boot-shared-gJH8zZtq.js";import{C as _,S as v,b as y,di as b,fi as x,w as S,x as C}from"./control-ui-boot-shared-SOjXo6bG.js";function w(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?l:c`
    <div class="exec-approval-list" aria-label=${a(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${a(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let n=b(t.request.command),r=t.request.agentId?.trim()||`—`;return c`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${a(`execApproval.reviewRequest`,{agent:r,command:n})}
            @click=${()=>e.onSelect(t.id)}
          >
            <span class="exec-approval-list__agent">${r}</span>
            <span class="exec-approval-list__command mono">${n}</span>
            <openclaw-approval-countdown
              class="exec-approval-list__expiry"
              aria-hidden="true"
              .expiresAtMs=${t.expiresAtMs}
              .compact=${!0}
            ></openclaw-approval-countdown>
          </button>
        `})}
    </div>
  `}function T(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function E(e){return T(e)?null:o(n.approveAlways,e)?`allow-always`:o(n.modifiedEnter,e)?`allow-once`:o(n.denyApproval,e)?`deny`:null}var D;function O(){return(O=e((()=>{u(),p(),x(),r(),g(),s(),v(),h(),D=class extends i{constructor(...e){super(...e),this.selectedApprovalId=null,this.explicitlyOpen=!1}show(){this.props?.queue.length&&(this.explicitlyOpen=!0,this.updateComplete.then(()=>this.dialog?.show()))}get dialogOpen(){return this.explicitlyOpen&&(this.props?.queue.length??0)>0}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy||!this.props?.canGrant)return;let n=E(e);n&&S(t).includes(n)&&(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.explicitlyOpen=!1,this.selectedApprovalId=null;return}let t=this.props?.queue??[];t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=e?.queue??[],n=t.find(e=>e.id===this.selectedApprovalId)??t.at(0);return!e||!this.explicitlyOpen||!n?l:c`
      <openclaw-modal-dialog
        label=${C(n)}
        description=${y(n.expiresAtMs,Date.now())}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${t=>{if(e.busy){t.preventDefault();return}this.explicitlyOpen=!1}}
      >
        <div class="exec-approval-modal-stack">
          ${_({approval:n,busy:e.busy,canGrant:e.canGrant,error:e.errors.get(n.id)??null,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${w({queue:t,activeId:n.id,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </openclaw-modal-dialog>
    `}},t([m({attribute:!1})],D.prototype,`props`,void 0),t([d(`openclaw-modal-dialog`)],D.prototype,`dialog`,void 0),t([f()],D.prototype,`selectedApprovalId`,void 0),t([f()],D.prototype,`explicitlyOpen`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,D)})))()}O();
//# sourceMappingURL=exec-approval-D4EAU8ly.js.map