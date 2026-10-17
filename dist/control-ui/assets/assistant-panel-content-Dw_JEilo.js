import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,ju as a,kc as o}from"./control-ui-core-CTSdBcaH.js";import{X as s,Z as c}from"./control-ui-boot-shared-BEmZVSlQ.js";import{Ti as l,na as u,ra as d,wi as f}from"./control-ui-core-vFnxmx94.js";import{$ as p,X as m,Y as h,ct as g,d as _,nt as v,u as y,ut as b}from"./lit-runtime-TNZj1e-P.js";import{Xr as x,Zr as S,ii as C,qi as w}from"./ui-CnRtCcYL.js";import{i as T,r as E,t as D}from"./custodian-surface-zwWEH61C.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{H as O,U as k,V as A,n as j}from"./control-ui-boot-chat-BGAO2QaN.js";import{n as M}from"./control-ui-boot-chat-CNnFKzxu.js";var N;function P(){return(P=e((()=>{S(),h(),v(),y(),c(),l(),r(),i(),j(),M(),d(),N=class extends n{constructor(...e){super(...e),this.sessionKey=``,this.agentId=``,this.workContext={page:`chat`},this.includeContext=!0,this.selection=``,this.selectionAvailable=!1,this.selectionScope=``,this.updateSelectionAvailability=()=>{let e=window.getSelection();this.selectionAvailable=!(!e||e.isCollapsed||!e.anchorNode||this.contains(e.anchorNode))},this.attachSelection=e=>{e.preventDefault();let t=window.getSelection();!t||t.isCollapsed||t.anchorNode&&this.contains(t.anchorNode)||(this.selection=w(t.toString(),640),this.includeContext=!0)}}connectedCallback(){super.connectedCallback(),document.addEventListener(`selectionchange`,this.updateSelectionAvailability),this.updateSelectionAvailability()}disconnectedCallback(){document.removeEventListener(`selectionchange`,this.updateSelectionAvailability),super.disconnectedCallback()}willUpdate(){let e=this.workContext,t=JSON.stringify([this.context.gateway.connection.gatewayUrl,this.sessionKey,this.agentId,e.page,e.detail,e.sessionKey,e.sessionId,e.agentId,e.file]);this.selectionScope&&this.selectionScope!==t&&(this.selection=``),this.selectionScope=t}render(){let e={...this.workContext,selection:this.selection||void 0},t=s(e),n=JSON.stringify([this.context.gateway.connection.gatewayUrl,this.agentId,this.sessionKey]);return p`
      <div class="assistant-panel-context">
        ${this.includeContext?p`
                <details>
                  <summary>
                    ${a(`assistantPanel.context`,{context:e.title||e.page})}
                  </summary>
                  <pre>${t}</pre>
                </details>
                <button
                  type="button"
                  class="rail-header__action"
                  aria-label=${a(`assistantPanel.removeContext`)}
                  @click=${()=>{this.includeContext=!1}}
                >
                  ${u.x}
                </button>
              `:p`<button
                type="button"
                class="btn btn--sm"
                @click=${()=>{this.includeContext=!0}}
              >
                ${a(`assistantPanel.includeContext`)}
              </button>`}
        <button
          type="button"
          class="rail-header__action"
          aria-label=${a(`assistantPanel.attachSelection`)}
          ?disabled=${!this.selectionAvailable}
          title=${a(`assistantPanel.attachSelection`)}
          @mousedown=${this.attachSelection}
          @click=${e=>{e.detail===0&&this.attachSelection(e)}}
        >
          ${u.messageSquare}
        </button>
        ${this.selection?p`<button
                type="button"
                class="btn btn--sm"
                aria-label=${a(`assistantPanel.removeSelection`)}
                @click=${()=>{this.selection=``}}
              >
                ${a(`assistantPanel.selection`)} ${u.x}
              </button>`:m}
      </div>
      ${_(n,p`<openclaw-chat-pane
          .paneId=${`home-dock:${n}`}
          .presentationId=${`home-dock:${n}`}
          .sessionKey=${this.sessionKey}
          .agentId=${this.agentId}
          .inputRegion=${`dock`}
          .active=${!0}
          .compact=${!0}
          .narrow=${!0}
          .workContext=${this.includeContext?e:void 0}
        ></openclaw-chat-pane>`)}
    `}},C([x({context:f,subscribe:!0})],N.prototype,`context`,void 0),C([b({attribute:!1})],N.prototype,`sessionKey`,void 0),C([b({attribute:!1})],N.prototype,`agentId`,void 0),C([b({attribute:!1})],N.prototype,`workContext`,void 0),C([g()],N.prototype,`includeContext`,void 0),C([g()],N.prototype,`selection`,void 0),C([g()],N.prototype,`selectionAvailable`,void 0),customElements.define(`openclaw-home-session`,N)})))()}var F;function I(){return(I=e((()=>{h(),v(),i(),t(),O(),T(),D(),P(),F=class extends n{constructor(){super(),this.active=!1,this.destination=`custodian`,this.sessionKey=``,this.agentId=``,this.pageRouteId=`chat`,this.pageSessionKey=``,this.pageAgentId=``,this.custodianVisible=!1,new o(this).watchStore(()=>this.store??E).watch(()=>this.context,(e,t)=>k(e,t)).watchStore(()=>this.context?.sessions).watchStore(()=>this.context?.agents).watchStore(()=>this.context?.gateway)}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new CustomEvent(`assistant-custodian-store`,{detail:this.store??E,bubbles:!0}))}willUpdate(){let e=this.active&&this.destination===`custodian`;e&&!this.custodianVisible&&(this.store??E).refreshTranscriptIfIdle(),this.custodianVisible=e}render(){if(!this.active)return m;let e=this.store??E;return this.destination===`custodian`?p`<openclaw-custodian-surface
          .store=${e}
          .onboarding=${e.activeVariant===`onboarding`}
          .newAgentIntent=${e.activeVariant===`new-agent`}
          compact
        ></openclaw-custodian-surface>`:p`<openclaw-home-session
          .sessionKey=${this.sessionKey}
          .agentId=${this.agentId}
          .workContext=${this.sessionContext??(this.context?A(this.context,this.pageRouteId,this.pageSessionKey,this.pageAgentId):void 0)}
        ></openclaw-home-session>`}},C([b({type:Boolean})],F.prototype,`active`,void 0),C([b()],F.prototype,`destination`,void 0),C([b()],F.prototype,`sessionKey`,void 0),C([b()],F.prototype,`agentId`,void 0),C([b({attribute:!1})],F.prototype,`sessionContext`,void 0),C([b({attribute:!1})],F.prototype,`context`,void 0),C([b()],F.prototype,`pageRouteId`,void 0),C([b()],F.prototype,`pageSessionKey`,void 0),C([b()],F.prototype,`pageAgentId`,void 0),C([b({attribute:!1})],F.prototype,`store`,void 0),customElements.define(`openclaw-assistant-panel-content`,F)})))()}I();export{F as OpenClawAssistantPanelContent};
//# sourceMappingURL=assistant-panel-content-Dw_JEilo.js.map