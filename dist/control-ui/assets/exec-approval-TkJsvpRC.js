import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Su as n,Tu as r,_u as i,bu as a,ju as o,xu as s}from"./control-ui-core-bJHyI7AF.js";import{Wr as c}from"./control-ui-core-DNh4McGE.js";import{$ as l,X as u,Y as d,at as f,ct as p,nt as m,ut as h}from"./lit-runtime-DyST807n.js";import{ii as g}from"./ui-DeikvIdP.js";import{Bn as _,C as v,S as y,b,x,y as S,zn as C}from"./control-ui-boot-shared-C9uJ732w.js";function w(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?u:l`
    <div class="exec-approval-list" aria-label=${o(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${o(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let n=C(t.request.command),r=t.request.agentId?.trim()||`—`;return l`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${o(`execApproval.reviewRequest`,{agent:r,command:n})}
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
  `}function T(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function E(e){return T(e)?null:s(i.approveAlways,e)?`allow-always`:s(i.modifiedEnter,e)?`allow-once`:s(i.denyApproval,e)?`deny`:null}var D;function O(){return(O=e((()=>{d(),m(),_(),t(),a(),r(),x(),c(),D=class extends n{constructor(...e){super(...e),this.selectedApprovalId=null,this.explicitlyOpen=!1}show(){this.props?.queue.length&&(this.explicitlyOpen=!0,this.updateComplete.then(()=>this.dialog?.show()))}get dialogOpen(){return this.explicitlyOpen&&(this.props?.queue.length??0)>0}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy||!this.props?.canGrant)return;let n=E(e);n&&v(t).includes(n)&&(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.explicitlyOpen=!1,this.selectedApprovalId=null;return}let t=this.props?.queue??[];t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=e?.queue??[],n=t.find(e=>e.id===this.selectedApprovalId)??t.at(0);return!e||!this.explicitlyOpen||!n?u:l`
      <openclaw-modal-dialog
        label=${b(n)}
        description=${S(n.expiresAtMs,Date.now())}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${t=>{if(e.busy){t.preventDefault();return}this.explicitlyOpen=!1}}
      >
        <div class="exec-approval-modal-stack">
          ${y({approval:n,busy:e.busy,canGrant:e.canGrant,error:e.errors.get(n.id)??null,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${w({queue:t,activeId:n.id,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </openclaw-modal-dialog>
    `}},g([h({attribute:!1})],D.prototype,`props`,void 0),g([f(`openclaw-modal-dialog`)],D.prototype,`dialog`,void 0),g([p()],D.prototype,`selectedApprovalId`,void 0),g([p()],D.prototype,`explicitlyOpen`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,D)})))()}O();
//# sourceMappingURL=exec-approval-TkJsvpRC.js.map