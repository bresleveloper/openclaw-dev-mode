import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as n,Vt as r,Wc as i,Xl as a,Yc as o,hi as s}from"./control-ui-core-DX6662ze.js";import{$ as c,X as l,Y as u,c as d,ct as f,nt as p,s as m,ut as h}from"./lit-runtime-BOUQsi_O.js";import{$t as g,Fi as _,Ii as v,Oa as y,Sa as b,a as x,ba as S,ln as C,o as w,tn as T}from"./control-ui-core-QgEwr0pF.js";import{Ci as E,La as D,_i as O,bi as k,vi as A,wi as j,xi as M,yi as N,za as P}from"./control-ui-boot-shared-SOjXo6bG.js";import{a as F,i as I,n as L,o as R,r as z,t as B}from"./roster-element-DXcUKjhr.js";function V(e,t){return c`<openclaw-sidebar-new-session-menu
    .host=${e}
    .active=${e.navigationVisible}
    .triggerClass=${t}
  ></openclaw-sidebar-new-session-menu>`}function H(e,t){return c`<openclaw-sidebar-agent-roster
    .host=${e}
    .active=${e.navigationVisible}
    .sections=${t}
    .involvingMe=${e.sessionInvolvingMeFilterActive}
  ></openclaw-sidebar-agent-roster>`}var U,W;function G(){return(G=e((()=>{u(),p(),m(),S(),g(),n(),F(),z(),L(),o(),O(),k(),v(),D(),x(),E(),R(),U=class extends B{constructor(...e){super(...e),this.sections=[],this.involvingMe=!1,this.collapsed=new Set,this.settingsScope=null,this.published=null}willUpdate(){let e=this.context.gateway.connection.gatewayUrl;this.settingsScope!==e&&(this.settingsScope=e,this.collapsed=new Set(T(e).sidebarCollapsedAgentIds??[]));let t=I(this.context);t.setInvolvingMe(this.involvingMe);let n=t.snapshot;(this.published?.snapshot!==n||this.published.collapsed!==this.collapsed)&&(this.published={snapshot:n,collapsed:this.collapsed},this.host.rosterSessionSource={result:n.result,agentIds:n.cards.map(e=>e.id),collapsedAgentIds:this.collapsed})}disconnectedCallback(){this.host.rosterSessionSource=null,I(this.context).setInvolvingMe(!1),super.disconnectedCallback()}toggleAgent(e){let t=new Set(this.collapsed);t.delete(e)||t.add(e),this.setCollapsedAgents(t)}setCollapsedAgents(e){C({gatewayUrl:this.context.gateway.connection.gatewayUrl,sidebarCollapsedAgentIds:[...e]},{selectGateway:!1}),this.collapsed=e}render(){return this.avatars.withActiveRoutes(()=>{let e=this.cards(),t=this.roster.error??this.roster.subscriptionError,n=this.host.readNewSessionAccess();return A(this.host,c`<div class="sidebar-agent-roster">
          ${t?c`<button class="sidebar-agent-roster__link" @click=${()=>void this.refresh()}>${a(`agentsHome.loadFailed`)}</button>`:l}
          ${this.roster.loading&&e.length===0?c`<span role="status" aria-label=${a(`common.loading`)} class="skeleton skeleton-line"></span>`:l}
          ${d(e,e=>e.id,t=>{let r=this.collapsed.has(t.id),o=this.sections.filter(e=>e.id.startsWith(`agent:${t.id}:`)),u=this.host.selectedAgentMainSessionKey(t.id),d=this.host.mainSessionRow(t.id),f=d?this.host.projectHomeSession(d,t.id):null,p=f?.childLoadParentKeys?.length?f.childLoadParentKeys:[d?.key??u],m=b(this.host.activeRouteId)&&i(this.host.getRouteSessionKey(),u),h=[...f?[f]:[],...r?o.flatMap(e=>e.rows):[]];return c`<section
                class="sidebar-agent-roster__group"
                data-agent-group=${t.id}
                aria-label=${t.name}
              >
                <div class="sidebar-agent-roster__header">
                  <button
                    type="button"
                    class="sidebar-agent-roster__action sidebar-agent-roster__chevron"
                    data-agent-collapse=${t.id}
                    aria-label=${a(r?`agentsHome.expandAgent`:`agentsHome.collapseAgent`,{agent:t.name})}
                    aria-expanded=${String(!r)}
                    @click=${()=>this.toggleAgent(t.id)}
                  >
                    <span class="sidebar-agent-roster__chevron" aria-hidden="true"
                      >${r?_.chevronRight:_.chevronDown}</span
                    >
                  </button>
                  <a
                    class="sidebar-agent-roster__row"
                    data-agent-id=${t.id}
                    href=${t.target.href}
                    aria-current=${m?`page`:l}
                    title=${a(`agentsHome.openChat`)}
                    @click=${e=>{s(e)&&(e.preventDefault(),this.host.openMainSession(t.id))}}
                  >
                    <span class="sidebar-agent-roster__avatar" aria-hidden="true">
                      ${P(t)}
                    </span>
                    <span class="sidebar-agent-roster__copy"><span>${t.name}</span></span>
                  </a>
                  <span class="sidebar-agent-roster__signals">
                    ${h.length>0?j(h,r,r?o.reduce((e,t)=>e+t.rows.length,0):0,h.reduce((e,t)=>e+(t.workspaceConflictCount??0),0)):l}
                  </span>
                  <span
                    class="sidebar-agent-roster__actions"
                    @keydown=${e=>{e.key===` `&&e.target instanceof HTMLAnchorElement&&(e.preventDefault(),e.target.click())}}
                  >
                    ${w({basePath:this.host.basePath,agentId:t.id,className:`sidebar-agent-roster__action sidebar-agent-roster__new`,label:`${a(`agentChip.newConversation`)}: ${t.name}`,disabledReason:n.allowed?void 0:n.reason,onOpen:(e,t)=>this.host.requestOpenNewSession(e,t)})}
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
                        ${_.moreHorizontal}
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
                ${r?l:c`${p.map(e=>M(this.host,e))}
                      ${o.map(e=>N({host:this.host,section:e,personHeaders:void 0}))}`}
              </section>`})}
        </div>`)})}},t([h({attribute:!1})],U.prototype,`host`,void 0),t([h({attribute:!1})],U.prototype,`sections`,void 0),t([h({attribute:!1})],U.prototype,`involvingMe`,void 0),t([f()],U.prototype,`collapsed`,void 0),customElements.define(`openclaw-sidebar-agent-roster`,U),W=class extends B{constructor(...e){super(...e),this.triggerClass=``}render(){return this.avatars.withActiveRoutes(()=>{let e=this.host.readNewSessionAccess(),t=this.cards();return c`<wa-dropdown
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
          ${_.plus}
        </button>
        ${t.map(e=>c`<wa-dropdown-item
            value=${e.id}
            @click=${e=>{s(e)?e.preventDefault():e.currentTarget instanceof HTMLElement&&(e.currentTarget.dataset.nativeNavigation=`true`)}}
            ><a
              class="sidebar-agent-roster__link"
              href=${`${y(`new-session`,this.host.basePath)}${r(e.id)}`}
              tabindex="-1"
              ><span class="sidebar-agent-roster__avatar" aria-hidden="true">
                ${P(e)} </span
              ><span>${e.name}</span></a
            >
          </wa-dropdown-item>`)}
      </wa-dropdown>`})}},t([h({attribute:!1})],W.prototype,`host`,void 0),t([h({attribute:!1})],W.prototype,`triggerClass`,void 0),customElements.define(`openclaw-sidebar-new-session-menu`,W)})))()}G();export{H as renderSidebarAgentRoster,V as renderSidebarNewSessionMenu};
//# sourceMappingURL=sidebar-agent-roster-DrTfLFtu.js.map