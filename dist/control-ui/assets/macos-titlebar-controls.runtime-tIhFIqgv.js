import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Ds as n,Es as r,Gl as i,Il as a,Xl as o,ks as s,zl as c}from"./control-ui-core-DX6662ze.js";import{$ as l,X as u,Y as d,nt as f,ut as p}from"./lit-runtime-BOUQsi_O.js";import{Fi as m,Ha as h,Ii as g,Ni as _,Wa as v}from"./control-ui-core-QgEwr0pF.js";var y;function b(){return(b=e((()=>{d(),f(),v(),i(),s(),c(),g(),_(),y=class extends a{constructor(...e){super(...e),this.navCollapsed=!1,this.historyOnly=!1,this.canGoBack=!1,this.canGoForward=!1}render(){let e=this.navCollapsed?o(`nav.expand`):o(`nav.collapse`);return l`
      <nav class="macos-titlebar-controls" @mousedown=${h}>
        ${this.historyOnly?u:this.renderButton({label:e,icon:this.navCollapsed?m.panelLeftOpen:m.panelLeftClose,ariaExpanded:!this.navCollapsed,onClick:this.onToggleSidebar,className:`macos-titlebar-controls__sidebar-toggle`})}
        ${this.renderButton({label:o(`nav.back`),icon:m.chevronLeft,disabled:!this.canGoBack,onClick:()=>globalThis.history.back(),className:`macos-titlebar-controls__back`})}
        ${this.renderButton({label:o(`nav.forward`),icon:m.chevronRight,disabled:!this.canGoForward,onClick:()=>globalThis.history.forward(),className:`macos-titlebar-controls__forward`})}
        ${this.historyOnly?u:l`
                ${this.renderButton({label:o(`chat.openCommandPalette`),tooltip:o(`chat.commandPaletteTitle`),icon:m.search,onClick:this.onOpenPalette,className:`macos-titlebar-controls__search`})}
                ${this.navCollapsed?this.renderButton({label:o(`chat.runControls.newSession`),tooltip:this.newSessionDisabledReason??`${o(`chat.runControls.newSession`)} (${n(r.newSession)})`,icon:m.plus,disabled:!!this.newSessionDisabledReason,onClick:this.onOpenNewSession,className:`macos-titlebar-controls__new-session`}):u}
              `}
      </nav>
    `}renderButton(e){return l`
      <openclaw-tooltip .content=${e.tooltip??e.label}>
        <button
          type="button"
          class="topbar-icon-btn macos-titlebar-controls__button ${e.className}"
          aria-label=${e.label}
          aria-expanded=${e.ariaExpanded===void 0?u:String(e.ariaExpanded)}
          ?disabled=${e.disabled||!e.onClick}
          @click=${e.onClick}
        >
          ${e.icon}
        </button>
      </openclaw-tooltip>
    `}},t([p({attribute:!1})],y.prototype,`navCollapsed`,void 0),t([p({attribute:!1})],y.prototype,`historyOnly`,void 0),t([p({attribute:!1})],y.prototype,`canGoBack`,void 0),t([p({attribute:!1})],y.prototype,`canGoForward`,void 0),t([p({attribute:!1})],y.prototype,`newSessionDisabledReason`,void 0),t([p({attribute:!1})],y.prototype,`onToggleSidebar`,void 0),t([p({attribute:!1})],y.prototype,`onOpenPalette`,void 0),t([p({attribute:!1})],y.prototype,`onOpenNewSession`,void 0),customElements.get(`openclaw-macos-titlebar-controls`)||customElements.define(`openclaw-macos-titlebar-controls`,y)})))()}b();
//# sourceMappingURL=macos-titlebar-controls.runtime-tIhFIqgv.js.map