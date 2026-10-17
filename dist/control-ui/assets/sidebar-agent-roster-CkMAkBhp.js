import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Fs as n,Sl as r,_l as i,ju as a,sr as o}from"./control-ui-core-CTSdBcaH.js";import{Cn as s,So as c,a as l,gn as u,go as d,i as f,mn as p,mo as m,na as h,ra as g}from"./control-ui-core-vFnxmx94.js";import{$ as _,X as v,Y as y,a as b,ct as x,i as S,nt as C,ut as w}from"./lit-runtime-TNZj1e-P.js";import{ii as T}from"./ui-CnRtCcYL.js";import{Ci as E,Jn as D,Kn as O,Ti as k,ar as A,hr as j,mr as M,nr as N,or as P,qn as F,rr as I,tr as L}from"./control-ui-boot-shared-DeF_v3ER.js";import{a as R,i as z,n as B,o as V,r as H,t as U}from"./roster-element-BjtAU5Pn.js";function W(e,t){return _`<openclaw-sidebar-new-session-menu
    .host=${e}
    .active=${e.navigationVisible}
    .triggerClass=${t}
  ></openclaw-sidebar-new-session-menu>`}function G(e,t){let n=e.sessionNavigationAgentId(t),r=e.sessionDataContext?z(e.sessionDataContext).snapshot.cards.find(e=>e.id===n):void 0;return I({host:e,session:t,listItem:!1,icon:k(r??{id:n})})}function K(e,t,n){return _`<openclaw-sidebar-agent-roster
    .host=${e}
    .active=${e.navigationVisible}
    .sections=${t}
    .empty=${n}
    .involvingMe=${e.sessionInvolvingMeFilterActive}
  ></openclaw-sidebar-agent-roster>`}var q,J;function Y(){return(Y=e((()=>{y(),C(),S(),m(),p(),t(),R(),H(),B(),r(),M(),O(),L(),g(),E(),f(),A(),V(),q=class extends U{constructor(...e){super(...e),this.sections=[],this.involvingMe=!1,this.empty=!1,this.collapsed=new Set,this.settingsScope=null,this.published=null}willUpdate(){let e=this.context.gateway.connection.gatewayUrl;this.settingsScope!==e&&(this.settingsScope=e,this.collapsed=new Set(u(e).sidebarCollapsedAgentIds??[]));let t=z(this.context);t.setInvolvingMe(this.involvingMe);let n=t.snapshot;(this.published?.snapshot!==n||this.published.collapsed!==this.collapsed)&&(this.published={snapshot:n,collapsed:this.collapsed},this.host.rosterSessionSource={result:n.result,agentIds:n.cards.map(e=>e.id),collapsedAgentIds:this.collapsed})}disconnectedCallback(){this.host.rosterSessionSource=null,z(this.context).setInvolvingMe(!1),super.disconnectedCallback()}toggleAgent(e){let t=new Set(this.collapsed);t.delete(e)||t.add(e),this.setCollapsedAgents(t)}setCollapsedAgents(e){s({gatewayUrl:this.context.gateway.connection.gatewayUrl,sidebarCollapsedAgentIds:[...e]},{selectGateway:!1}),this.collapsed=e}render(){return this.avatars.withActiveRoutes(()=>{let e=this.cards(),t=this.roster.error??this.roster.subscriptionError,r=this.host.readNewSessionAccess();return F(this.host,_`<div class="sidebar-agent-roster">
          ${t?_`<button class="sidebar-agent-roster__link" @click=${()=>void this.refresh()}>${a(`agentsHome.loadFailed`)}</button>`:v}
          ${this.roster.loading&&e.length===0?_`<span role="status" aria-label=${a(`common.loading`)} class="skeleton skeleton-line"></span>`:v}
          ${b(e,e=>e.id,t=>{let o=this.collapsed.has(t.id),s=this.sections.filter(e=>e.id.startsWith(`agent:${t.id}:`)),c=this.host.selectedAgentMainSessionKey(t.id),u=this.host.mainSessionRow(t.id),f=u?this.host.projectHomeSession(u,t.id):null,p=f?.childLoadParentKeys?.length?f.childLoadParentKeys:[u?.key??c],m=d(this.host.activeRouteId)&&i(this.host.getRouteSessionKey(),c),g=[...f?[f]:[],...o?s.flatMap(e=>e.rows):[]];return _`<section
                class="sidebar-agent-roster__group"
                data-agent-group=${t.id}
                aria-label=${t.name}
              >
                <div class="sidebar-agent-roster__header">
                  <button
                    type="button"
                    class="sidebar-agent-roster__action sidebar-agent-roster__chevron"
                    data-agent-collapse=${t.id}
                    aria-label=${a(o?`agentsHome.expandAgent`:`agentsHome.collapseAgent`,{agent:t.name})}
                    aria-expanded=${String(!o)}
                    @click=${()=>this.toggleAgent(t.id)}
                  >
                    <span class="sidebar-agent-roster__chevron" aria-hidden="true"
                      >${o?h.chevronRight:h.chevronDown}</span
                    >
                  </button>
                  <a
                    class="sidebar-agent-roster__row"
                    data-agent-id=${t.id}
                    href=${t.target.href}
                    aria-current=${m?`page`:v}
                    title=${a(`agentsHome.openChat`)}
                    @click=${e=>{n(e)&&(e.preventDefault(),this.host.openMainSession(t.id))}}
                  >
                    <span class="sidebar-agent-roster__avatar" aria-hidden="true">
                      ${k(t)}
                    </span>
                    <span class="sidebar-agent-roster__copy"><span>${t.name}</span></span>
                  </a>
                  <span class="sidebar-agent-roster__signals">
                    ${g.length>0?P(g,o,o?s.reduce((e,t)=>e+t.rows.length,0):0,g.reduce((e,t)=>e+(t.workspaceConflictCount??0),0)):v}
                  </span>
                  <span
                    class="sidebar-agent-roster__actions"
                    @keydown=${e=>{e.key===` `&&e.target instanceof HTMLAnchorElement&&(e.preventDefault(),e.target.click())}}
                  >
                    ${l({basePath:this.host.basePath,agentId:t.id,className:`sidebar-agent-roster__action sidebar-agent-roster__new`,label:`${a(`agentChip.newConversation`)}: ${t.name}`,disabledReason:r.allowed?void 0:r.reason,onOpen:(e,t)=>this.host.requestOpenNewSession(e,t)})}
                    <wa-dropdown
                      placement="bottom-end"
                      @wa-show=${()=>this.host.dismissTransientMenus()}
                      @wa-select=${n=>{switch(n.detail.item.value){case`main`:this.host.openMainSession(t.id);break;case`sessions`:this.context.agentSelection.setScope(t.id),this.host.onNavigate?.(`sessions`);break;case`collapse-others`:this.setCollapsedAgents(new Set(e.filter(e=>e.id!==t.id).map(e=>e.id)))}}}
                    >
                      <button
                        slot="trigger"
                        type="button"
                        class="sidebar-agent-roster__action"
                        aria-label=${a(`agentsHome.agentOptions`,{agent:t.name})}
                      >
                        ${h.moreHorizontal}
                      </button>
                      <wa-dropdown-item value="main"
                        >${a(`agentsHome.openMainChat`)}</wa-dropdown-item
                      >
                      <wa-dropdown-item value="sessions"
                        >${a(`agentsHome.allSessions`)}</wa-dropdown-item
                      >
                      <wa-dropdown-item value="collapse-others"
                        >${a(`agentsHome.collapseOthers`)}</wa-dropdown-item
                      >
                    </wa-dropdown>
                  </span>
                </div>
                ${o?v:_`${p.map(e=>N(this.host,e))}
                      ${s.map(e=>D({host:this.host,section:e,personHeaders:void 0}))}`}
              </section>`})}
          ${j(this.host,this.empty,this.connected&&this.roster.result!==null&&!this.roster.loading&&!t&&!this.roster.result.hasMore&&!this.host.sessionData.sessionMutationError)}
        </div>`)})}},T([w({attribute:!1,hasChanged:()=>!0})],q.prototype,`host`,void 0),T([w({attribute:!1})],q.prototype,`sections`,void 0),T([w({attribute:!1})],q.prototype,`involvingMe`,void 0),T([w({attribute:!1})],q.prototype,`empty`,void 0),T([x()],q.prototype,`collapsed`,void 0),customElements.define(`openclaw-sidebar-agent-roster`,q),J=class extends U{constructor(...e){super(...e),this.triggerClass=``}render(){return this.avatars.withActiveRoutes(()=>{let e=this.host.readNewSessionAccess(),t=this.cards();return _`<wa-dropdown
        class="sidebar-new-session-menu"
        placement="bottom-end"
        aria-label=${a(`agentChip.agents`)}
        @wa-show=${()=>this.host.dismissTransientMenus()}
        @wa-select=${n=>{let r=n.detail.item;if(n.preventDefault(),r.dataset.nativeNavigation){delete r.dataset.nativeNavigation;return}let i=r.value;if(e.allowed&&i&&t.some(e=>e.id===i)){let e=this.querySelector(`wa-dropdown`);e&&(e.open=!1),this.host.requestOpenNewSession(i)}}}
      >
        <button
          slot="trigger"
          type="button"
          class=${this.triggerClass}
          aria-label=${a(`agentChip.newConversation`)}
          title=${e.allowed?a(`agentChip.newConversation`):e.reason}
          ?disabled=${!e.allowed||t.length===0}
        >
          ${h.plus}
        </button>
        ${t.map(e=>_`<wa-dropdown-item
            value=${e.id}
            @click=${e=>{n(e)?e.preventDefault():e.currentTarget instanceof HTMLElement&&(e.currentTarget.dataset.nativeNavigation=`true`)}}
            ><a
              class="sidebar-agent-roster__link"
              href=${`${c(`new-session`,this.host.basePath)}${o(e.id)}`}
              tabindex="-1"
              ><span class="sidebar-agent-roster__avatar" aria-hidden="true">
                ${k(e)} </span
              ><span>${e.name}</span></a
            >
          </wa-dropdown-item>`)}
      </wa-dropdown>`})}},T([w({attribute:!1})],J.prototype,`host`,void 0),T([w({attribute:!1})],J.prototype,`triggerClass`,void 0),customElements.define(`openclaw-sidebar-new-session-menu`,J)})))()}Y();export{K as renderSidebarAgentRoster,W as renderSidebarNewSessionMenu,G as renderSidebarPinnedSession};
//# sourceMappingURL=sidebar-agent-roster-CkMAkBhp.js.map