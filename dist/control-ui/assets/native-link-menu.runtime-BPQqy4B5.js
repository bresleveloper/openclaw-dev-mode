import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,Xr as i,Yr as a,ju as o}from"./control-ui-core-bJHyI7AF.js";import{na as s,ra as c}from"./control-ui-core-DNh4McGE.js";import{$ as l,X as u,Y as d,nt as f,ut as p}from"./lit-runtime-DyST807n.js";import{ii as m}from"./ui-DeikvIdP.js";import{Jr as h,Qr as g,Xr as _,Yr as v,Zr as y,bi as b,ni as x,ri as S}from"./control-ui-boot-shared-C9uJ732w.js";function C(e){let t=e.find(e=>e instanceof HTMLElement&&e.localName===`openclaw-modal-dialog`);if(t instanceof HTMLElement)return t;for(let t of e)if(t instanceof HTMLDialogElement&&t.open&&t.getRootNode()===document)return t;return document.body}function w(e){let t=C(e.path);if(!t.isConnected)return null;let n=document.createElement(`openclaw-native-link-menu`);return n.x=e.x,n.y=e.y,n.trigger=e.anchor,n.onClose=()=>e.close(n),n.onAction=t=>{t===`copy`?a(e.url.href):t===`inline`?e.openInline():e.openExternal()},t.append(n),v(n),n}var T;function E(){return(E=e((()=>{d(),f(),n(),i(),r(),S(),c(),y(),h(),b(),T=class extends t{constructor(...e){super(...e),this.x=0,this.y=0,this.trigger=null,this.onAction=()=>{},this.onClose=()=>{},this.menuLifecycle=new x(this,{getTrigger:()=>this.trigger,onClose:()=>this.onClose(),onKeydown:e=>_(this,e)})}runAction(e){this.onClose(),this.onAction(e)}render(){let e=Math.max(8,Math.min(this.x,window.innerWidth-264-8)),t=Math.max(8,Math.min(this.y,window.innerHeight-136-8));return l`
      <wa-dropdown
        class="session-menu native-link-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${o(`nativeLinkMenu.label`)}
        @wa-select=${e=>{e.preventDefault();let t=e.detail.item.value;t&&(this.trigger?.focus(),this.runAction(t))}}
        @wa-after-hide=${()=>{this.onClose()}}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${o(`nativeLinkMenu.label`)}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${[[`inline`,`s`,`openInline`,s.panelRightOpen],[`external`,`b`,`openExternal`,s.externalLink],[`copy`,`c`,`copy`,s.copy]].map(([e,t,n,r])=>l`
            ${e===`copy`?l`<div class="session-menu__separator" role="separator"></div>`:u}
            <wa-dropdown-item
              class="session-menu__item"
              value=${e}
              ?data-new-tab-action=${e===`external`}
              data-shortcut=${t}
              aria-keyshortcuts=${t.toUpperCase()}
            >
              <span slot="icon" class="session-menu__icon" aria-hidden="true">${r}</span>
              <span class="session-menu__text">${o(`nativeLinkMenu.${n}`)}</span>
              ${g(t)}
            </wa-dropdown-item>
          `)}
      </wa-dropdown>
    `}},m([p({attribute:!1})],T.prototype,`x`,void 0),m([p({attribute:!1})],T.prototype,`y`,void 0),m([p({attribute:!1})],T.prototype,`trigger`,void 0),m([p({attribute:!1})],T.prototype,`onAction`,void 0),m([p({attribute:!1})],T.prototype,`onClose`,void 0),customElements.get(`openclaw-native-link-menu`)||customElements.define(`openclaw-native-link-menu`,T)})))()}E();export{T as NativeLinkMenu,w as mountNativeLinkMenu};
//# sourceMappingURL=native-link-menu.runtime-BPQqy4B5.js.map