import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Su as n,Tu as r,_u as i,bu as a,ju as o,vu as s}from"./control-ui-core-CTSdBcaH.js";import{$i as c,Ai as l,Xi as u,Zi as d,ea as f,ga as p,ma as m,na as h,ra as g}from"./control-ui-core-vFnxmx94.js";import{$ as _,X as v,Y as y,nt as b,ut as x}from"./lit-runtime-TNZj1e-P.js";import{ii as S}from"./ui-CnRtCcYL.js";var C;function w(){return(w=e((()=>{y(),b(),p(),t(),a(),r(),g(),u(),l(),C=class extends n{constructor(...e){super(...e),this.navCollapsed=!1,this.historyOnly=!1,this.canGoBack=!1,this.canGoForward=!1}render(){let e=this.navCollapsed?o(`nav.expand`):o(`nav.collapse`);return _`
      <nav class="macos-titlebar-controls" @mousedown=${m}>
        ${this.historyOnly?v:this.renderButton({label:e,icon:this.navCollapsed?h.panelLeftOpen:h.panelLeftClose,ariaExpanded:!this.navCollapsed,onClick:this.onToggleSidebar,className:`macos-titlebar-controls__sidebar-toggle`})}
        ${this.renderButton({label:o(`nav.back`),icon:h.chevronLeft,disabled:!this.canGoBack,onClick:()=>globalThis.history.back(),className:`macos-titlebar-controls__back`})}
        ${this.renderButton({label:o(`nav.forward`),icon:h.chevronRight,disabled:!this.canGoForward,onClick:()=>globalThis.history.forward(),className:`macos-titlebar-controls__forward`})}
        ${this.historyOnly?v:_`
                ${this.renderButton({label:o(`chat.openCommandPalette`),tooltip:o(`chat.commandPaletteTitle`),tooltipTemplate:f(o(`chat.commandPaletteTitle`).replace(`⌘K`,`{shortcut}`),d([`⌘`,`K`],{inline:!0})),icon:h.search,onClick:this.onOpenPalette,className:`macos-titlebar-controls__search`})}
                ${this.navCollapsed?this.renderButton({label:o(`chat.runControls.newSession`),tooltip:this.newSessionDisabledReason??`${o(`chat.runControls.newSession`)} (${s(i.newSession)})`,tooltipTemplate:this.newSessionDisabledReason==null?c(o(`chat.runControls.newSession`),i.newSession):void 0,icon:h.plus,disabled:!!this.newSessionDisabledReason,onClick:this.onOpenNewSession,className:`macos-titlebar-controls__new-session`}):v}
              `}
      </nav>
    `}renderButton(e){return _`
      <openclaw-tooltip
        .content=${e.tooltip??e.label}
        .contentTemplate=${e.tooltipTemplate}
      >
        <button
          type="button"
          class="topbar-icon-btn macos-titlebar-controls__button ${e.className}"
          aria-label=${e.label}
          aria-expanded=${e.ariaExpanded===void 0?v:String(e.ariaExpanded)}
          ?disabled=${e.disabled||!e.onClick}
          @click=${e.onClick}
        >
          ${e.icon}
        </button>
      </openclaw-tooltip>
    `}},S([x({attribute:!1})],C.prototype,`navCollapsed`,void 0),S([x({attribute:!1})],C.prototype,`historyOnly`,void 0),S([x({attribute:!1})],C.prototype,`canGoBack`,void 0),S([x({attribute:!1})],C.prototype,`canGoForward`,void 0),S([x({attribute:!1})],C.prototype,`newSessionDisabledReason`,void 0),S([x({attribute:!1})],C.prototype,`onToggleSidebar`,void 0),S([x({attribute:!1})],C.prototype,`onOpenPalette`,void 0),S([x({attribute:!1})],C.prototype,`onOpenNewSession`,void 0),customElements.get(`openclaw-macos-titlebar-controls`)||customElements.define(`openclaw-macos-titlebar-controls`,C)})))()}w();
//# sourceMappingURL=macos-titlebar-controls.runtime-CPShB2yy.js.map