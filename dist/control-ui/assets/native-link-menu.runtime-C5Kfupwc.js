import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Dh9Nir5C.js";import{$n as n,Gl as r,Ll as i,Xl as a,er as o,zl as s}from"./control-ui-core-BfjCgLp6.js";import{$ as c,Y as l,nt as u,ut as d}from"./lit-runtime-L6OV30Vo.js";import{Fi as f,Ii as p}from"./control-ui-core-qT0XjEdV.js";import{Pa as m,aa as h,ca as g,la as _,ma as v,oa as y,pa as b,sa as x}from"./control-ui-boot-shared-Bm2ZxasE.js";function S(e){let t=e.find(e=>e instanceof HTMLElement&&e.localName===`openclaw-modal-dialog`);if(t instanceof HTMLElement)return t;for(let t of e)if(t instanceof HTMLDialogElement&&t.open&&t.getRootNode()===document)return t;return document.body}function C(e){let t=S(e.path);if(!t.isConnected)return null;let r=document.createElement(`openclaw-native-link-menu`);return r.x=e.x,r.y=e.y,r.trigger=e.anchor,r.onClose=()=>e.close(r),r.onAction=t=>{t===`copy`?n(e.url.href):t===`inline`?e.openInline():e.openExternal()},t.append(r),y(r),r}var w;function T(){return(T=e((()=>{l(),u(),r(),o(),s(),v(),p(),g(),h(),m(),w=class extends i{constructor(...e){super(...e),this.x=0,this.y=0,this.trigger=null,this.onAction=()=>{},this.onClose=()=>{},this.menuLifecycle=new b(this,{getTrigger:()=>this.trigger,onClose:()=>this.onClose(),onKeydown:e=>x(this,e)})}runAction(e){this.onClose(),this.onAction(e)}render(){let e=Math.max(8,Math.min(this.x,window.innerWidth-264-8)),t=Math.max(8,Math.min(this.y,window.innerHeight-136-8));return c`
      <wa-dropdown
        class="session-menu native-link-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${a(`nativeLinkMenu.label`)}
        @wa-select=${e=>{e.preventDefault();let t=e.detail.item.value;t&&(this.trigger?.focus(),this.runAction(t))}}
        @wa-after-hide=${()=>{this.onClose()}}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${a(`nativeLinkMenu.label`)}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <wa-dropdown-item
          class="session-menu__item"
          value="inline"
          data-shortcut="s"
          aria-keyshortcuts="S"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${f.panelRightOpen}</span
          >
          <span class="session-menu__text">${a(`nativeLinkMenu.openInline`)}</span>
          ${_(`s`)}
        </wa-dropdown-item>
        <wa-dropdown-item
          class="session-menu__item"
          value="external"
          data-new-tab-action
          data-shortcut="b"
          aria-keyshortcuts="B"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${f.externalLink}</span
          >
          <span class="session-menu__text">${a(`nativeLinkMenu.openExternal`)}</span>
          ${_(`b`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item
          class="session-menu__item"
          value="copy"
          data-shortcut="c"
          aria-keyshortcuts="C"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${f.copy}</span>
          <span class="session-menu__text">${a(`nativeLinkMenu.copy`)}</span>
          ${_(`c`)}
        </wa-dropdown-item>
      </wa-dropdown>
    `}},t([d({attribute:!1})],w.prototype,`x`,void 0),t([d({attribute:!1})],w.prototype,`y`,void 0),t([d({attribute:!1})],w.prototype,`trigger`,void 0),t([d({attribute:!1})],w.prototype,`onAction`,void 0),t([d({attribute:!1})],w.prototype,`onClose`,void 0),customElements.get(`openclaw-native-link-menu`)||customElements.define(`openclaw-native-link-menu`,w)})))()}T();export{w as NativeLinkMenu,C as mountNativeLinkMenu};
//# sourceMappingURL=native-link-menu.runtime-C5Kfupwc.js.map