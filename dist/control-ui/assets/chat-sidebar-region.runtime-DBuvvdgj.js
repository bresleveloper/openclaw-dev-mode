import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$n as t,Cu as n,Eu as r,Qn as i,Tu as a,Zn as o,er as s,ju as c,tr as l}from"./control-ui-core-bJHyI7AF.js";import{$r as u,Ai as d,Jr as f,Qi as ee,Xi as te,ai as p,ga as m,ma as h,n as g,na as _,r as ne,ra as v,ri as re}from"./control-ui-core-DNh4McGE.js";import{$ as y,F as b,M as x,X as S,Y as C,Z as w,a as T,i as E,nt as D,ut as O}from"./lit-runtime-DyST807n.js";import{ii as k}from"./ui-DeikvIdP.js";import{as as ie,is as ae}from"./control-ui-boot-shared-C1PHuQAX.js";import{c as oe,s as A}from"./control-ui-boot-chat-HWH89scD.js";import{ht as j,mt as M}from"./control-ui-boot-chat-DfNf0poH.js";import{D as N,O as P,Qt as F,Yt as I}from"./control-ui-boot-chat-BvOXILEY.js";import{a as L,i as R,o as z,r as B,t as V}from"./panel-tab-strip-C6eteeqt.js";import{n as H,t as U}from"./panel-empty-state-De_5Bizz.js";function W(){return G+=1,`chat-files-content-${G}`}var G,K;function q(){return(q=e((()=>{C(),D(),E(),v(),ne(),L(),M(),V(),r(),a(),ae(),G=0,K=class extends n{constructor(...e){super(...e),this.contentId=W(),this.appUnmount=new g(this),this.hostedTabsChangeKey=``,this.previews=[],this.activeId=null,this.tabsInHeader=!0,this.browser=S,this.renderDetail=null,this.onSelect=()=>{},this.onClose=()=>{}}get hostedTabs(){let e=this.previews.map(({id:e,label:t,content:n})=>({id:e,label:t,title:n.kind===`file`?n.path:t,icon:n.kind===`mcp-app`?_.puzzle:ie({filename:t,mode:`preview-with-favicon`}),className:n.kind===`loading`?`is-connecting`:void 0}));return this.activeId===null&&e.length?[{id:`browse`,label:c(`chat.sidePanel.files`),icon:_.folder},...e]:e}get activeHostedTabId(){return this.activeId??(this.previews.length?`browse`:null)}get hostedActions(){return y`<button
      class="rail-header__action"
      type="button"
      aria-label=${c(`chat.sidePanel.files`)}
      title=${c(`chat.sidePanel.files`)}
      @click=${()=>this.onSelect(null)}
    >
      ${_.folder}
    </button>`}selectHostedTab(e){this.onSelect(e===`browse`?null:e)}async closeHostedTab(e){e===`browse`?this.onSelect(this.previews.at(-1)?.id??null):this.onClose(e)}updated(){let e=JSON.stringify([this.activeHostedTabId,c(`chat.sidePanel.files`),this.hostedTabs.map(({id:e,label:t,title:n,className:r})=>[e,t,n,r])]);e!==this.hostedTabsChangeKey&&(this.hostedTabsChangeKey=e,this.dispatchEvent(new CustomEvent(R,{bubbles:!0})))}render(){let e=new Set(this.previews.filter(e=>e.content.kind===`mcp-app`).map(e=>e.id));return this.appUnmount.render(JSON.stringify([...e]),()=>y`
        ${this.tabsInHeader?S:y`<header class="rail-header side-panel__header">
                <div class="side-panel__header-tabs">
                  ${B({tabs:this.hostedTabs.map(e=>({...e,domId:`${this.contentId}-tab-${e.id}`,closeLabel:`${c(`browser.closeTab`)}: ${e.label}`})),activeId:this.activeHostedTabId,ariaControls:this.contentId,onSelect:e=>this.selectHostedTab(e),onClose:e=>this.closeHostedTab(e),onNew:()=>this.onSelect(null),newLabel:c(`chat.sidePanel.files`),newControl:this.hostedActions})}
                </div>
              </header>`}
        <div id=${this.contentId} class="chat-files-panel__content">
          <div class="chat-files-panel__page" ?hidden=${this.activeId!==null}>
            ${this.browser}
          </div>
          ${T(this.previews,e=>e.id,e=>y`
              <div
                class="chat-files-panel__page"
                data-app-tab-id=${e.content.kind===`mcp-app`?e.id:S}
                ?hidden=${this.activeId!==e.id}
              >
                ${e.content.kind===`loading`?j(`files`,c(`common.loading`)):e.content.kind===`unavailable`?y`<div class="callout danger" role="alert">
                          ${e.content.message}
                        </div>`:this.renderDetail?.(e.content)}
              </div>
            `)}
        </div>
      `,()=>[...this.querySelectorAll(`[data-app-tab-id]`)].filter(t=>!e.has(t.dataset.appTabId??``)))}},k([O({attribute:!1})],K.prototype,`previews`,void 0),k([O({attribute:!1})],K.prototype,`activeId`,void 0),k([O({type:Boolean})],K.prototype,`tabsInHeader`,void 0),k([O({attribute:!1})],K.prototype,`browser`,void 0),k([O({attribute:!1})],K.prototype,`renderDetail`,void 0),k([O({attribute:!1})],K.prototype,`onSelect`,void 0),k([O({attribute:!1})],K.prototype,`onClose`,void 0),customElements.get(`openclaw-chat-files-panel`)||customElements.define(`openclaw-chat-files-panel`,K)})))()}function se(e){return y`<resizable-divider
    ${b(e.onElement??(()=>{}))}
    class=${e.className??S}
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
  ></resizable-divider>`}function J(){return(J=e((()=>{C(),x()})))()}function Y(e,t){let n=e.find(e=>e.slot===t);if(!n)throw Error(`Missing sidebar panel definition for ${t}`);return n}function X(e,t=!1){return y`
    <span slot=${t?`icon`:S} class="side-panel-type-option__icon" aria-hidden="true"
      >${e.icon}</span
    >
    <span class="side-panel-type-option__label">${e.label}</span>
    ${e.shortcut?ee(e.shortcut,{slot:t?`details`:void 0,className:`side-panel-type-option__shortcut`}):S}
  `}var Z,Q;function $(){return($=e((()=>{q(),C(),D(),E(),m(),v(),te(),U(),L(),V(),p(),d(),r(),a(),A(),N(),F(),J(),Z=[[`browser`,f,{open:!0,newTab:!0}],[`link-reader`,u,{open:!0,newTab:!0}],[`terminal`,re,{open:!0,newSession:!0}]],Q=class extends n{constructor(...e){super(...e),this.panelIdPrefix=``,this.layout={columns:[]},this.panelDefinitions=oe(),this.panelTemplates={},this.panelActions={},this.availableSlots=[],this.callbacks=null,this.narrow=!1,this.availableWidth=0,this.previousGeometry=``,this.geometryFrame=null,this.contentMounted=!1,this.focusedSurface=null,this.refreshHostedTabs=()=>this.requestUpdate(),this.trackFocus=e=>{let t=e.composedPath().find(e=>e instanceof Element&&e.matches(`[data-region], [data-region-header]`));this.focusedSurface=t&&t.closest(`.sidebar-region`)===this.parentElement?t:null},this.closeFocusedPanel=e=>{if(e.defaultPrevented||!this.layout.open||this.layout.expanded&&!this.layout.expandedSide||!this.callbacks)return;let t=e instanceof CustomEvent?e.detail?.browserScope:void 0,n=typeof t==`string`?[...this.parentElement?.querySelectorAll(`[data-native-browser-scope]`)??[]].find(e=>e.dataset.nativeBrowserScope===t):void 0,r=document.activeElement instanceof HTMLIFrameElement?document.activeElement.closest(`[data-region]`):null,a=typeof t==`string`?n?.closest(`[data-region]`):r??this.focusedSurface,o=i(this.layout);if(!o||!a?.isConnected||a.closest(`.sidebar-region`)!==this.parentElement||!a.matches(`[data-region="side"], [data-region-header="side"]`)||a.closest(`[hidden], [inert], [aria-hidden="true"]`)||document.openClawModalLayers?.size||document.querySelector(`dialog[open], [aria-modal='true']`))return;e.preventDefault();let s=this.parentElement?.querySelector(`[data-region-header="side"]`)??null;this.focusedSurface=s;let c=()=>{this.layout.open&&this.focusedSurface===s&&s?.isConnected&&s.querySelector(`wa-tab[active]`)?.focus()},l=this.hostedTabsElement(o),u=l?.activeHostedTabId;if(l&&u&&l.hostedTabs.some(e=>e.id===u)){l.closeHostedTab(u).then(()=>this.updateComplete).then(c);return}this.callbacks.closeSlot(o.slot),this.requestUpdate(),this.updateComplete.then(c)}}connectedCallback(){super.connectedCallback(),this.nativeCloseListeners=new AbortController;let e={capture:!0,signal:this.nativeCloseListeners.signal};this.parentElement?.addEventListener(R,this.refreshHostedTabs,{signal:this.nativeCloseListeners.signal}),document.addEventListener(`pointerdown`,this.trackFocus,e),document.addEventListener(`focusin`,this.trackFocus,e),window.addEventListener(`openclaw:native-close-focused-panel`,this.closeFocusedPanel,e),this.requestUpdate()}disconnectedCallback(){this.nativeCloseListeners?.abort(),this.nativeCloseListeners=void 0,this.focusedSurface=null,this.geometryFrame!==null&&(cancelAnimationFrame(this.geometryFrame),this.geometryFrame=null),super.disconnectedCallback()}hostedTabsElement(e){return z(this.parentElement?.querySelector(`[data-panel-slot="${e.slot}"]`)?.firstElementChild)}deliverPanelEvent(e,t){let n=this.parentElement?.querySelector(`[data-panel-slot="${e}"]`)?.firstElementChild;return!(n instanceof HTMLElement)||typeof n.handleToggleRequest!=`function`?!1:(n.handleToggleRequest(t),!0)}panelTypes(){return this.availableSlots.map(e=>Y(this.panelDefinitions,e))}renderTypeMenu(){let e=new Set((this.layout.columns[0]?.panels??[]).map(e=>e.slot));return y`
      <wa-dropdown
        class="side-panel-type-menu"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n){this.callbacks?.openSlot(n);let t=Z.find(([e])=>e===n);t&&e.has(n)&&this.deliverPanelEvent(n,new CustomEvent(t[1],{detail:{...t[2]}}))}}}
      >
        <button
          slot="trigger"
          class="rail-header__action side-panel-type-menu__trigger"
          type="button"
          aria-label=${c(`chat.sidePanel.addTab`)}
          title=${c(`chat.sidePanel.addTab`)}
        >
          ${_.plus}
        </button>
        ${this.panelTypes().filter(t=>Z.some(([e])=>e===t.slot)||!e.has(t.slot)).map(e=>y`
              <wa-dropdown-item
                class="side-panel-type-menu__item session-menu__item"
                .value=${e.slot}
              >
                ${X(e,!0)}
              </wa-dropdown-item>
            `)}
      </wa-dropdown>
    `}renderHostedTabIcon(e){if(e.favicon)return y`<img class="tabstrip-tab__favicon" src=${e.favicon} alt="" />`;let t=``;try{t=e.url?new URL(e.url).hostname:``}catch{}let n=t&&this.fetchFavicon?P(t,this.fetchFavicon,this.refreshHostedTabs):null;return n?y`<img class="tabstrip-tab__favicon" src=${n} alt="" />`:e.icon}renderHeader(e){let t=l(this.layout),n=t.flatMap(e=>{let t=this.hostedTabsElement(e);return t?[{panel:e,element:t,tabs:t.hostedTabs}]:[]}),r=e=>{for(let t of n){let n=`hosted:${t.panel.id}:`;if(e.startsWith(n)){let r=e.slice(n.length);if(t.tabs.some(e=>e.id===r))return{...t,tabId:r}}}return null},a=t.flatMap(t=>{let r=`${this.panelIdPrefix}-${encodeURIComponent(t.slot)}`,i=n.find(e=>e.panel.id===t.id);if(i?.tabs.length)return i.tabs.map(e=>({id:`hosted:${t.id}:${e.id}`,domId:`${this.panelIdPrefix}-tab-${encodeURIComponent(JSON.stringify([t.id,e.id]))}`,contentId:r,label:e.label,labelTooltip:e.label,title:e.title,icon:this.renderHostedTabIcon(e),statusLabel:e.statusLabel,badge:e.badge,className:e.className,closeLabel:`${c(`browser.closeTab`)}: ${e.label}`,group:t.id,draggable:!1,reorderId:t.id}));let a=Y(this.panelDefinitions,t.slot),o=t.slot===`conversation`&&this.conversationTab?.label?this.conversationTab:a;return[{id:t.id,domId:`${this.panelIdPrefix}-tab-${encodeURIComponent(t.id)}`,contentId:r,label:o.label,labelTooltip:t.slot===`dashboard`?c(this.layout.expanded&&this.layout.expandedSide&&e.activePanelId===t.id?`chat.sidePanel.restore`:`chat.sidePanel.expandPanel`,{panel:a.label}):o.label,onActivate:t.slot===`dashboard`?()=>this.callbacks?.togglePanelExpanded(t.id):void 0,icon:o.icon,closeLabel:c(`chat.sidebarColumns.close`,{panel:a.label})}]}),o=i(this.layout),s=n.find(e=>e.panel.id===o?.id),u=s?.tabs.some(e=>e.id===s.element.activeHostedTabId)?`hosted:${s.panel.id}:${s.element.activeHostedTabId}`:o?.id??null,d=e.panels.find(e=>e.id===o?.id),f=(d?this.panelActions[d.slot]:null)??null;return y`
      <header
        class="rail-header side-panel__header"
        data-region-header="side"
        @mousedown=${h}
      >
        <div class="side-panel__header-tabs">
          ${B({tabs:a,activeId:u,ariaControls:e=>e.contentId,onSelect:t=>{let n=r(t);n?(e.activePanelId!==n.panel.id&&this.callbacks?.activatePanel(n.panel.id),n.element.selectHostedTab(n.tabId)):this.callbacks?.activatePanel(t)},onClose:async t=>{let n=r(t);if(n){await n.element.closeHostedTab(n.tabId);return}let i=e.panels.find(e=>e.id===t);i&&this.callbacks?.closeSlot(i.slot)},onNew:()=>void 0,newLabel:c(`chat.sidePanel.addTab`),newControl:S,separateTabs:!0,onReorder:(e,t,n)=>this.callbacks?.reorderPanel(e,t,n)})}
          ${this.renderTypeMenu()}
        </div>
        ${this.renderHeaderActions(f,s?.element.hostedActions??S)}
      </header>
    `}renderHeaderActions(e,t){let n=i(this.layout),r=this.layout.expanded===!0&&this.layout.expandedSide===!0,a=r?c(`chat.sidePanel.restore`):c(`chat.sidePanel.expandPanel`,{panel:n?Y(this.panelDefinitions,n.slot).label:``});return y`<div class="rail-header__actions side-panel__actions">
      ${e||t!==S?y`<span class="side-panel__action-group side-panel__action-group--content">
              ${t} ${e}
            </span>`:S}
      <span class="side-panel__action-group side-panel__action-group--close">
        ${n?y`<openclaw-tooltip .content=${a}>
                <button
                  class="rail-header__action side-panel__expand"
                  type="button"
                  aria-label=${a}
                  aria-pressed=${String(r)}
                  @click=${()=>this.callbacks?.togglePanelExpanded(n.id)}
                >
                  ${r?_.minimize:_.maximize}
                </button>
              </openclaw-tooltip>`:S}
        <openclaw-tooltip .content=${c(`common.close`)}>
          <button
            class="rail-header__action side-panel__minimize"
            type="button"
            aria-label=${c(`common.close`)}
            @click=${()=>this.callbacks?.setOpen(!1)}
          >
            ${_.x}
          </button>
        </openclaw-tooltip>
      </span>
    </div>`}renderEmpty(e){if(e){let t=Y(this.panelDefinitions,e.slot);return y`<div class="side-panel-empty side-panel-empty--type">
        ${H({icon:t.icon,heading:t.label,description:t.empty.description,action:t.empty.action})}
      </div>`}return y`<div class="side-panel-empty side-panel-empty--selector">
      <div class="side-panel-empty__types">
        ${this.panelTypes().map(e=>y`<button
            class="side-panel-empty__type"
            type="button"
            @click=${()=>this.callbacks?.openSlot(e.slot)}
          >
            ${X(e)}
          </button>`)}
      </div>
    </div>`}renderBody(e){return y`<div class="side-panel__body">
      ${T(this.panelDefinitions.flatMap(t=>(e?.panels??[]).filter(e=>e.slot===t.slot&&e.slot!==`conversation`)),e=>e.id,e=>y`<div
          id=${`${this.panelIdPrefix}-${encodeURIComponent(e.slot)}`}
          class="side-panel__panel"
          role="region"
          aria-label=${Y(this.panelDefinitions,e.slot).label}
          data-panel-slot=${e.slot}
          data-region=${e.id===this.layout.mainPanelId?`main`:`side`}
          ?hidden=${!o(this.layout,e.slot)}
        >
          ${this.panelTemplates[e.slot]??this.renderEmpty(e)}
        </div>`)}
      ${l(this.layout).length===0?y`<div class="side-panel__empty-body" data-region="side">${this.renderEmpty()}</div>`:S}
    </div>`}renderDivider(e){let n=t(this.layout),r=()=>{let t=this.parentElement,r=t?.querySelector(`[data-region="main"]`),i=t?.querySelector(`[data-region="side"]:not([hidden])`),a=n===`bottom`?r?.getBoundingClientRect().height??0:r?.getBoundingClientRect().width??0,o=n===`bottom`?i?.getBoundingClientRect().height??e.height:i?.getBoundingClientRect().width??e.width;return{primarySize:a,panelSize:o,panelBeforeMain:n!==`bottom`&&n===`left`!=(getComputedStyle(t??this).direction===`rtl`),total:a+o}};return se({className:`sidebar-column__divider`,label:c(`chat.sidePanel.resize`),orientation:n===`bottom`?`horizontal`:`vertical`,splitRatio:.5,minRatio:.05,maxRatio:.95,measureRatio:()=>{let{primarySize:e,panelSize:t,panelBeforeMain:n,total:i}=r();return i>0?(n?t:e)/i:.5},measureSize:()=>r().total,onResize:t=>{let i=this.parentElement?.getBoundingClientRect(),a=n===`bottom`?i?.height??0:this.availableWidth>0?this.availableWidth:i?.width??0,o=r(),s=(o.total||a)*(o.panelBeforeMain?t.detail.splitRatio:1-t.detail.splitRatio),c=n===`bottom`?220:260,l=Math.max(c,a*.6);this.callbacks?.resizePanel(e.id,Math.max(c,Math.min(s,l)))}})}renderPanel(){let e=this.layout.columns[0];return e?(this.contentMounted||=this.layout.open===!0&&(!this.layout.expanded||this.layout.expandedSide===!0)||(s(this.layout)?.slot??`conversation`)!==`conversation`,y`${!this.narrow&&this.layout.open&&!this.layout.expanded?this.renderDivider(e):S}
      <div class="side-panel">
        ${l(this.layout).length>0?this.renderHeader(e):S}
        ${this.contentMounted?this.renderBody(e):S}
      </div>`):(this.contentMounted=!1,S)}updated(){let e=this.parentElement?.querySelector(`.sidebar-region__right-runtime`);e&&(w(this.renderPanel(),e),this.scheduleGeometryCommit())}scheduleGeometryCommit(){this.geometryFrame===null&&(this.geometryFrame=requestAnimationFrame(()=>{this.geometryFrame=null;let e=this.parentElement;if(!this.isConnected||!e)return;let t=e.querySelector(`.sidebar-region__right-runtime > .side-panel`),n=Array.from(e.querySelectorAll(`.sidebar-region__primary, .side-panel__panel`),e=>`${e.dataset.panelSlot??`conversation`}:${e.getBoundingClientRect().width}`).join(`:`);t?.dispatchEvent(new CustomEvent(I,{bubbles:!0,detail:{widthChanged:n!==this.previousGeometry}})),this.previousGeometry=n}))}render(){return S}},k([O({attribute:!1})],Q.prototype,`panelIdPrefix`,void 0),k([O({attribute:!1})],Q.prototype,`conversationTab`,void 0),k([O({attribute:!1})],Q.prototype,`layout`,void 0),k([O({attribute:!1})],Q.prototype,`panelDefinitions`,void 0),k([O({attribute:!1})],Q.prototype,`panelTemplates`,void 0),k([O({attribute:!1})],Q.prototype,`panelActions`,void 0),k([O({attribute:!1})],Q.prototype,`availableSlots`,void 0),k([O({attribute:!1})],Q.prototype,`fetchFavicon`,void 0),k([O({attribute:!1})],Q.prototype,`callbacks`,void 0),k([O({type:Boolean})],Q.prototype,`narrow`,void 0),k([O({type:Number})],Q.prototype,`availableWidth`,void 0),customElements.get(`openclaw-chat-sidebar-region`)||customElements.define(`openclaw-chat-sidebar-region`,Q)})))()}$();
//# sourceMappingURL=chat-sidebar-region.runtime-DBuvvdgj.js.map