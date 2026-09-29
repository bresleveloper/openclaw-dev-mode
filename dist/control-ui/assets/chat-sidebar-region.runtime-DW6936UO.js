import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as n,Ll as r,Xl as i,zl as a}from"./control-ui-core-DX6662ze.js";import{$ as o,X as s,Y as c,Z as l,_ as u,c as d,m as f,nt as p,s as m,ut as h}from"./lit-runtime-BOUQsi_O.js";import{Fi as g,Ha as _,Ii as v,Jr as y,Kr as b,Ni as x,Rr as S,Ur as C,Wa as w}from"./control-ui-core-QgEwr0pF.js";import{B as T,Xt as E,Yt as D,z as O}from"./control-ui-boot-shared-SOjXo6bG.js";import{A as k,j as ee}from"./control-ui-boot-shared-CnT6GD3L.js";import{Cr as te,wr as ne}from"./control-ui-boot-shared-DbQ0OGrz.js";import{n as A,t as j}from"./control-ui-boot-shared-BwgRPMMK.js";import{Ct as M,Et as N,St as P,Tt as F,rt as I,st as L,wt as R}from"./control-ui-boot-shared-Cw9VhLyx.js";import{a as z,i as B,o as V,r as H,t as U}from"./panel-tab-strip-C3OyLkQ3.js";function W(){return G+=1,`chat-files-content-${G}`}var G,K;function q(){return(q=e((()=>{c(),p(),m(),v(),z(),D(),U(),n(),a(),te(),G=0,K=class extends r{constructor(...e){super(...e),this.contentId=W(),this.hostedTabsChangeKey=``,this.previews=[],this.activeId=null,this.tabsInHeader=!0,this.browser=s,this.renderDetail=null,this.onSelect=()=>{},this.onClose=()=>{}}get hostedTabs(){let e=this.previews.map(({id:e,label:t,content:n})=>({id:e,label:t,title:n.kind===`file`?n.path:t,icon:ne({filename:t,mode:`preview-with-favicon`}),className:n.kind===`loading`?`is-connecting`:void 0}));return this.activeId===null&&e.length?[{id:`browse`,label:i(`chat.sidePanel.files`),icon:g.folder},...e]:e}get activeHostedTabId(){return this.activeId??(this.previews.length?`browse`:null)}get hostedActions(){return o`<button
      class="rail-header__action"
      type="button"
      aria-label=${i(`chat.sidePanel.files`)}
      title=${i(`chat.sidePanel.files`)}
      @click=${()=>this.onSelect(null)}
    >
      ${g.folder}
    </button>`}selectHostedTab(e){this.onSelect(e===`browse`?null:e)}async closeHostedTab(e){e===`browse`?this.onSelect(this.previews.at(-1)?.id??null):this.onClose(e)}updated(){let e=JSON.stringify([this.activeHostedTabId,i(`chat.sidePanel.files`),this.hostedTabs.map(({id:e,label:t,title:n,className:r})=>[e,t,n,r])]);e!==this.hostedTabsChangeKey&&(this.hostedTabsChangeKey=e,this.dispatchEvent(new CustomEvent(B,{bubbles:!0})))}render(){return o`
      ${this.tabsInHeader?s:o`<header class="rail-header side-panel__header">
              <div class="side-panel__header-tabs">
                ${H({tabs:this.hostedTabs.map(e=>({...e,domId:`${this.contentId}-tab-${e.id}`,closeLabel:`${i(`browser.closeTab`)}: ${e.label}`})),activeId:this.activeHostedTabId,ariaControls:this.contentId,onSelect:e=>this.selectHostedTab(e),onClose:e=>this.closeHostedTab(e),onNew:()=>this.onSelect(null),newLabel:i(`chat.sidePanel.files`),newControl:this.hostedActions})}
              </div>
            </header>`}
      <div id=${this.contentId} class="chat-files-panel__content">
        <div class="chat-files-panel__page" ?hidden=${this.activeId!==null}>${this.browser}</div>
        ${d(this.previews,e=>e.id,e=>o`
            <div class="chat-files-panel__page" ?hidden=${this.activeId!==e.id}>
              ${e.content.kind===`loading`?E(`files`,i(`common.loading`)):e.content.kind===`unavailable`?o`<div class="callout danger" role="alert">
                        ${e.content.message}
                      </div>`:this.renderDetail?.(e.content)}
            </div>
          `)}
      </div>
    `}},t([h({attribute:!1})],K.prototype,`previews`,void 0),t([h({attribute:!1})],K.prototype,`activeId`,void 0),t([h({type:Boolean})],K.prototype,`tabsInHeader`,void 0),t([h({attribute:!1})],K.prototype,`browser`,void 0),t([h({attribute:!1})],K.prototype,`renderDetail`,void 0),t([h({attribute:!1})],K.prototype,`onSelect`,void 0),t([h({attribute:!1})],K.prototype,`onClose`,void 0),customElements.get(`openclaw-chat-files-panel`)||customElements.define(`openclaw-chat-files-panel`,K)})))()}function J(e){return o`<resizable-divider
    ${u(e.onElement??(()=>{}))}
    class=${e.className??s}
    .splitRatio=${e.splitRatio}
    .minRatio=${e.minRatio??.4}
    .maxRatio=${e.maxRatio??.7}
    .measureRatio=${e.measureRatio}
    .measureSize=${e.measureSize}
    .label=${e.label}
    .orientation=${e.orientation}
    @dragover=${e.onDragover??(()=>{})}
    @drop=${e.onDrop??(()=>{})}
    @resize=${e.onResize}
  ></resizable-divider>`}function Y(){return(Y=e((()=>{c(),f()})))()}function X(e,t){let n=e.find(e=>e.slot===t);if(!n)throw Error(`Missing sidebar panel definition for ${t}`);return n}function Z(e,t=!1){return o`
    <span slot=${t?`icon`:s} class="side-panel-type-option__icon" aria-hidden="true"
      >${e.icon}</span
    >
    <span class="side-panel-type-option__label">${e.label}</span>
    ${e.shortcut?o`<kbd slot=${t?`details`:s} class="side-panel-type-option__shortcut"
            >${e.shortcut}</kbd
          >`:s}
  `}function re(e){return e.columns[0]?.panels??[]}var Q;function $(){return($=e((()=>{q(),c(),p(),m(),w(),v(),O(),z(),U(),y(),x(),n(),a(),k(),j(),L(),Y(),Q=class extends r{constructor(...e){super(...e),this.panelIdPrefix=``,this.layout={columns:[]},this.panelDefinitions=ee(),this.panelTemplates={},this.panelActions={},this.availableSlots=[],this.callbacks=null,this.narrow=!1,this.availableWidth=0,this.previousGeometry=``,this.geometryFrame=null,this.contentMounted=!1,this.focusedSurface=null,this.refreshHostedTabs=()=>this.requestUpdate(),this.trackFocus=e=>{let t=e.composedPath().find(e=>e instanceof Element&&e.matches(`[data-region], [data-region-header]`));this.focusedSurface=t&&t.closest(`.sidebar-region`)===this.parentElement?t:null},this.closeFocusedPanel=e=>{if(e.defaultPrevented||!this.layout.open||this.layout.expanded&&!this.layout.expandedSide||!this.callbacks)return;let t=e instanceof CustomEvent?e.detail?.browserScope:void 0,n=typeof t==`string`?[...this.parentElement?.querySelectorAll(`[data-native-browser-scope]`)??[]].find(e=>e.dataset.nativeBrowserScope===t):void 0,r=document.activeElement instanceof HTMLIFrameElement?document.activeElement.closest(`[data-region]`):null,i=typeof t==`string`?n?.closest(`[data-region]`):r??this.focusedSurface,a=M(this.layout);if(!a||!i?.isConnected||i.closest(`.sidebar-region`)!==this.parentElement||!i.matches(`[data-region="side"], [data-region-header="side"]`)||i.closest(`[hidden], [inert], [aria-hidden="true"]`)||document.openClawModalLayers?.size||document.querySelector(`dialog[open], [aria-modal='true']`))return;e.preventDefault();let o=this.parentElement?.querySelector(`[data-region-header="side"]`)??null;this.focusedSurface=o;let s=()=>{this.layout.open&&this.focusedSurface===o&&o?.isConnected&&o.querySelector(`wa-tab[active]`)?.focus()},c=this.hostedTabsElement(a),l=c?.activeHostedTabId;if(c&&l&&c.hostedTabs.some(e=>e.id===l)){c.closeHostedTab(l).then(()=>this.updateComplete).then(s);return}this.callbacks.closeSlot(a.slot),this.requestUpdate(),this.updateComplete.then(s)}}connectedCallback(){super.connectedCallback(),this.nativeCloseListeners=new AbortController;let e={capture:!0,signal:this.nativeCloseListeners.signal};this.parentElement?.addEventListener(B,this.refreshHostedTabs,{signal:this.nativeCloseListeners.signal}),document.addEventListener(`pointerdown`,this.trackFocus,e),document.addEventListener(`focusin`,this.trackFocus,e),window.addEventListener(`openclaw:native-close-focused-panel`,this.closeFocusedPanel,e),this.requestUpdate()}disconnectedCallback(){this.nativeCloseListeners?.abort(),this.nativeCloseListeners=void 0,this.focusedSurface=null,this.geometryFrame!==null&&(cancelAnimationFrame(this.geometryFrame),this.geometryFrame=null),super.disconnectedCallback()}hostedTabsElement(e){return V(this.parentElement?.querySelector(`[data-panel-slot="${e.slot}"]`)?.firstElementChild)}deliverPanelEvent(e,t){let n=this.parentElement?.querySelector(`[data-panel-slot="${e}"]`)?.firstElementChild;return!(n instanceof HTMLElement)||typeof n.handleToggleRequest!=`function`?!1:(n.handleToggleRequest(t),!0)}panelTypes(){return this.availableSlots.map(e=>X(this.panelDefinitions,e))}renderTypeMenu(){let e=new Set(re(this.layout).map(e=>e.slot));return o`
      <wa-dropdown
        class="side-panel-type-menu"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;n&&(this.callbacks?.openSlot(n),n===`browser`&&e.has(n)&&this.deliverPanelEvent(n,new CustomEvent(S,{detail:{open:!0,newTab:!0}})),n===`link-reader`&&e.has(n)&&this.deliverPanelEvent(n,new CustomEvent(C,{detail:{open:!0,newTab:!0}})),n===`terminal`&&e.has(n)&&this.deliverPanelEvent(n,new CustomEvent(b,{detail:{open:!0,newSession:!0}})))}}
      >
        <button
          slot="trigger"
          class="rail-header__action side-panel-type-menu__trigger"
          type="button"
          aria-label=${i(`chat.sidePanel.addTab`)}
          title=${i(`chat.sidePanel.addTab`)}
        >
          ${g.plus}
        </button>
        ${this.panelTypes().filter(t=>t.slot===`browser`||t.slot===`terminal`||t.slot===`link-reader`||!e.has(t.slot)).map(e=>o`
              <wa-dropdown-item
                class="side-panel-type-menu__item session-menu__item"
                .value=${e.slot}
              >
                ${Z(e,!0)}
              </wa-dropdown-item>
            `)}
      </wa-dropdown>
    `}renderHostedTabIcon(e){if(e.favicon)return o`<img class="tabstrip-tab__favicon" src=${e.favicon} alt="" />`;let t=``;try{t=e.url?new URL(e.url).hostname:``}catch{}let n=t&&this.fetchFavicon?A(t,this.fetchFavicon,this.refreshHostedTabs):null;return n?o`<img class="tabstrip-tab__favicon" src=${n} alt="" />`:e.icon}renderHeader(e){let t=N(this.layout),n=t.flatMap(e=>{let t=this.hostedTabsElement(e);return t?[{panel:e,element:t,tabs:t.hostedTabs}]:[]}),r=e=>{for(let t of n){let n=`hosted:${t.panel.id}:`;if(e.startsWith(n)){let r=e.slice(n.length);if(t.tabs.some(e=>e.id===r))return{...t,tabId:r}}}return null},a=t.flatMap(t=>{let r=`${this.panelIdPrefix}-${encodeURIComponent(t.slot)}`,a=n.find(e=>e.panel.id===t.id);if(a?.tabs.length)return a.tabs.map(e=>({id:`hosted:${t.id}:${e.id}`,domId:`${this.panelIdPrefix}-tab-${encodeURIComponent(JSON.stringify([t.id,e.id]))}`,contentId:r,label:e.label,labelTooltip:e.label,title:e.title,icon:this.renderHostedTabIcon(e),statusLabel:e.statusLabel,badge:e.badge,className:e.className,closeLabel:`${i(`browser.closeTab`)}: ${e.label}`,group:t.id,draggable:!1,reorderId:t.id}));let o=X(this.panelDefinitions,t.slot);return[{id:t.id,domId:`${this.panelIdPrefix}-tab-${encodeURIComponent(t.id)}`,contentId:r,label:o.label,labelTooltip:t.slot===`dashboard`?i(this.layout.expanded&&this.layout.expandedSide&&e.activePanelId===t.id?`chat.sidePanel.restore`:`chat.sidePanel.expandPanel`,{panel:o.label}):o.label,onActivate:t.slot===`dashboard`?()=>this.callbacks?.togglePanelExpanded(t.id):void 0,icon:o.icon,closeLabel:i(`chat.sidebarColumns.close`,{panel:o.label})}]}),c=M(this.layout),l=n.find(e=>e.panel.id===c?.id),u=l?.tabs.some(e=>e.id===l.element.activeHostedTabId)?`hosted:${l.panel.id}:${l.element.activeHostedTabId}`:c?.id??null,d=e.panels.find(e=>e.id===c?.id),f=(d?this.panelActions[d.slot]:null)??null;return o`
      <header
        class="rail-header side-panel__header"
        data-region-header="side"
        @mousedown=${_}
      >
        <div class="side-panel__header-tabs">
          ${H({tabs:a,activeId:u,ariaControls:e=>e.contentId,onSelect:t=>{let n=r(t);n?(e.activePanelId!==n.panel.id&&this.callbacks?.activatePanel(n.panel.id),n.element.selectHostedTab(n.tabId)):this.callbacks?.activatePanel(t)},onClose:async t=>{let n=r(t);if(n){await n.element.closeHostedTab(n.tabId);return}let i=e.panels.find(e=>e.id===t);i&&this.callbacks?.closeSlot(i.slot)},onNew:()=>void 0,newLabel:i(`chat.sidePanel.addTab`),newControl:s,separateTabs:!0,onReorder:(e,t,n)=>this.callbacks?.reorderPanel(e,t,n)})}
          ${this.renderTypeMenu()}
        </div>
        ${this.renderHeaderActions(f,l?.element.hostedActions??s)}
      </header>
    `}renderHeaderActions(e,t){let n=M(this.layout),r=this.layout.expanded===!0&&this.layout.expandedSide===!0,a=r?i(`chat.sidePanel.restore`):i(`chat.sidePanel.expandPanel`,{panel:n?X(this.panelDefinitions,n.slot).label:``});return o`<div class="rail-header__actions side-panel__actions">
      ${e||t!==s?o`<span class="side-panel__action-group side-panel__action-group--content">
              ${t} ${e}
            </span>`:s}
      <span class="side-panel__action-group side-panel__action-group--close">
        ${n?o`<openclaw-tooltip .content=${a}>
                <button
                  class="rail-header__action side-panel__expand"
                  type="button"
                  aria-label=${a}
                  aria-pressed=${String(r)}
                  @click=${()=>this.callbacks?.togglePanelExpanded(n.id)}
                >
                  ${r?g.minimize:g.maximize}
                </button>
              </openclaw-tooltip>`:s}
        <openclaw-tooltip .content=${i(`common.close`)}>
          <button
            class="rail-header__action side-panel__minimize"
            type="button"
            aria-label=${i(`common.close`)}
            @click=${()=>this.callbacks?.setOpen(!1)}
          >
            ${g.x}
          </button>
        </openclaw-tooltip>
      </span>
    </div>`}renderEmpty(e){if(e){let t=X(this.panelDefinitions,e.slot);return o`<div class="side-panel-empty side-panel-empty--type">
        ${T({icon:t.icon,heading:t.label,description:t.empty.description,action:t.empty.action})}
      </div>`}return o`<div class="side-panel-empty side-panel-empty--selector">
      <div class="side-panel-empty__types" role="list">
        ${this.panelTypes().map(e=>o`<button
            class="side-panel-empty__type"
            type="button"
            role="listitem"
            @click=${()=>this.callbacks?.openSlot(e.slot)}
          >
            ${Z(e)}
          </button>`)}
      </div>
    </div>`}renderBody(e){return o`<div class="side-panel__body">
      ${d(this.panelDefinitions.flatMap(t=>(e?.panels??[]).filter(e=>e.slot===t.slot&&e.slot!==`conversation`)),e=>e.id,e=>o`<div
          id=${`${this.panelIdPrefix}-${encodeURIComponent(e.slot)}`}
          class="side-panel__panel"
          role="region"
          aria-label=${X(this.panelDefinitions,e.slot).label}
          data-panel-slot=${e.slot}
          data-region=${e.id===this.layout.mainPanelId?`main`:`side`}
          ?hidden=${!P(this.layout,e.slot)}
        >
          ${this.panelTemplates[e.slot]??this.renderEmpty(e)}
        </div>`)}
      ${N(this.layout).length===0?o`<div class="side-panel__empty-body" data-region="side">${this.renderEmpty()}</div>`:s}
    </div>`}renderDivider(e){let t=R(this.layout),n=()=>{let n=this.parentElement,r=n?.querySelector(`[data-region="main"]`),i=n?.querySelector(`[data-region="side"]:not([hidden])`),a=t===`bottom`?r?.getBoundingClientRect().height??0:r?.getBoundingClientRect().width??0,o=t===`bottom`?i?.getBoundingClientRect().height??e.height:i?.getBoundingClientRect().width??e.width;return{primarySize:a,panelSize:o,panelBeforeMain:t!==`bottom`&&t===`left`!=(getComputedStyle(n??this).direction===`rtl`),total:a+o}};return J({className:`sidebar-column__divider`,label:i(`chat.sidePanel.resize`),orientation:t===`bottom`?`horizontal`:`vertical`,splitRatio:.5,minRatio:.05,maxRatio:.95,measureRatio:()=>{let{primarySize:e,panelSize:t,panelBeforeMain:r,total:i}=n();return i>0?(r?t:e)/i:.5},measureSize:()=>n().total,onResize:r=>{let i=this.parentElement?.getBoundingClientRect(),a=t===`bottom`?i?.height??0:this.availableWidth>0?this.availableWidth:i?.width??0,o=n(),s=(o.total||a)*(o.panelBeforeMain?r.detail.splitRatio:1-r.detail.splitRatio),c=t===`bottom`?220:260,l=Math.max(c,a*.6);this.callbacks?.resizePanel(e.id,Math.max(c,Math.min(s,l)))}})}renderPanel(){let e=this.layout.columns[0];return e?(this.contentMounted||=this.layout.open===!0&&(!this.layout.expanded||this.layout.expandedSide===!0)||(F(this.layout)?.slot??`conversation`)!==`conversation`,o`${!this.narrow&&this.layout.open&&!this.layout.expanded&&e?this.renderDivider(e):s}
      <div class="side-panel">
        ${e&&N(this.layout).length>0?this.renderHeader(e):s}
        ${this.contentMounted?this.renderBody(e):s}
      </div>`):(this.contentMounted=!1,s)}updated(){let e=this.parentElement?.querySelector(`.sidebar-region__right-runtime`);e&&(l(this.renderPanel(),e),this.scheduleGeometryCommit())}scheduleGeometryCommit(){this.geometryFrame===null&&(this.geometryFrame=requestAnimationFrame(()=>{this.geometryFrame=null;let e=this.parentElement;if(!this.isConnected||!e)return;let t=e.querySelector(`.sidebar-region__right-runtime > .side-panel`),n=Array.from(e.querySelectorAll(`.sidebar-region__primary, .side-panel__panel`),e=>`${e.dataset.panelSlot??`conversation`}:${e.getBoundingClientRect().width}`).join(`:`);t?.dispatchEvent(new CustomEvent(I,{bubbles:!0,detail:{widthChanged:n!==this.previousGeometry}})),this.previousGeometry=n}))}render(){return s}},t([h({attribute:!1})],Q.prototype,`panelIdPrefix`,void 0),t([h({attribute:!1})],Q.prototype,`layout`,void 0),t([h({attribute:!1})],Q.prototype,`panelDefinitions`,void 0),t([h({attribute:!1})],Q.prototype,`panelTemplates`,void 0),t([h({attribute:!1})],Q.prototype,`panelActions`,void 0),t([h({attribute:!1})],Q.prototype,`availableSlots`,void 0),t([h({attribute:!1})],Q.prototype,`fetchFavicon`,void 0),t([h({attribute:!1})],Q.prototype,`callbacks`,void 0),t([h({type:Boolean})],Q.prototype,`narrow`,void 0),t([h({type:Number})],Q.prototype,`availableWidth`,void 0),customElements.get(`openclaw-chat-sidebar-region`)||customElements.define(`openclaw-chat-sidebar-region`,Q)})))()}$();
//# sourceMappingURL=chat-sidebar-region.runtime-DW6936UO.js.map