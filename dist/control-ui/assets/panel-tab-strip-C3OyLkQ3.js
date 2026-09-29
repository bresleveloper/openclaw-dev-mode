import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,J as n,K as r,X as i,Y as a,_ as o,c as s,m as c,mt as l,p as u,s as d,v as f}from"./lit-runtime-BOUQsi_O.js";import{Fi as p,Ii as m,Ni as h}from"./control-ui-core-QgEwr0pF.js";import{dn as g}from"./control-ui-boot-shared-SOjXo6bG.js";function _(e){let t=e;return t&&Array.isArray(t.hostedTabs)&&typeof t.selectHostedTab==`function`&&typeof t.closeHostedTab==`function`?t:null}var v;function y(){return(y=e((()=>{v=`openclaw:panel-hosted-tabs-change`})))()}function b(e){e.closest(`wa-tab-group`)?.querySelectorAll(`.is-drop-before, .is-drop-after`).forEach(e=>e.classList.remove(`is-drop-before`,`is-drop-after`))}function x(e){return e.closest(`wa-tab-group`)?.dataset.draggedPanelTab??``}function S(e){b(e),e.closest(`wa-tab-group`)?.removeAttribute(`data-dragged-panel-tab`)}function C(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function w(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e.id:null}function T(e,t){let n=e.getRootNode();return t===document.body||t===document.documentElement||n instanceof ShadowRoot&&t===n.host}function E(e,t){let n=t.getBoundingClientRect();return e.clientX>n.left+n.width/2==(getComputedStyle(t).direction===`rtl`)?`before`:`after`}function D(e,t,n){if(!(e instanceof HTMLElement))return;let r=k.get(e)!==t;k.set(e,t),(r||n)&&queueMicrotask(()=>{e.isConnected&&(e.closest(`wa-tab-group`)?.updateComplete??Promise.resolve()).then(()=>{if(!e.isConnected)return;e.scrollIntoView?.({block:`nearest`,inline:`nearest`});let t=C(e);n&&T(e,t)&&e.focus({preventScroll:!0})})})}function O(e){let n=t=>typeof e.ariaControls==`string`?e.ariaControls:e.ariaControls(t),r=n=>e.newControl===i?i:e.newControl?t`<span slot=${n?`nav`:i} class="tabstrip-new-control"
            >${e.newControl}</span
          >`:t`
            <button
              slot=${n?`nav`:i}
              class="rail-header__action tabstrip-new"
              type="button"
              ?data-new-tab-action=${e.newTabAction}
              ?disabled=${e.newDisabled}
              title=${e.newLabel}
              aria-label=${e.newLabel}
              @click=${e.onNew}
            >
              ${p.plus}
            </button>
          `;if(e.tabs.length===0)return r(!1);let a=w(),c=e.tabs.some(e=>e.domId===a)?a:null,l=JSON.stringify([e.activeId,e.tabs.map(e=>e.id)]),u=JSON.stringify([l,e.tabs.map(e=>e.className)]);return t`
    <wa-tab-group
      class="tabstrip"
      ${N(u)}
      .active=${e.activeId??``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${t=>{t.detail.name!==e.activeId&&e.onSelect(t.detail.name)}}
    >
      ${s(e.tabs,e=>e.id,(r,a)=>{let s=r.id===e.activeId,u=r.reorderId??r.id,d=!!e.onReorder&&r.draggable!==!1,f=e.separateTabs===!0&&a<e.tabs.length-1&&(r.group===void 0||r.group!==e.tabs[a+1]?.group),m=t`
            ${r.icon==null||r.icon===i?i:t`<span class="tabstrip-tab__icon" aria-hidden="true">${r.icon}</span>`}
            <span class="tabstrip-tab__label">${r.label}</span>
            ${r.badge?t`<span class="tabstrip-tab__badge">${r.badge}</span>`:i}
            ${r.statusLabel?t`<span class="tabstrip-tab__status">${r.statusLabel}</span>`:i}
          `;return t`
            <wa-tab
              id=${r.domId}
              class=${`tabstrip-tab ${r.className??``}`}
              panel=${r.id}
              aria-controls=${n(r)}
              aria-selected=${s?`true`:`false`}
              title=${r.title||i}
              ?active=${s}
              draggable=${d?`true`:i}
              .tabIndex=${s?0:-1}
              ${s?o(e=>D(e,l,c===r.domId)):i}
              @click=${e=>{r.onActivate&&(e.stopPropagation(),r.onActivate())}}
              @keydown=${e=>{r.onActivate&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.stopPropagation(),e.repeat||r.onActivate())}}
              @auxclick=${t=>{t.button===1&&(t.preventDefault(),e.onClose(r.id))}}
              @dragstart=${e=>{if(d&&e.dataTransfer&&(e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(j,u),e.currentTarget instanceof Element)){let t=e.currentTarget.closest(`wa-tab-group`);t&&(t.dataset.draggedPanelTab=u)}}}
              @dragover=${t=>{if(!e.onReorder||!t.dataTransfer)return;let n=t.currentTarget instanceof Element?x(t.currentTarget):``;if(!n||n===u)return;t.preventDefault(),t.dataTransfer.dropEffect=`move`;let r=t.currentTarget;r instanceof Element&&(b(r),r.classList.add(`is-drop-${E(t,r)}`))}}
              @dragleave=${e=>{e.currentTarget instanceof Element&&!(e.relatedTarget instanceof Node&&e.currentTarget.contains(e.relatedTarget))&&e.currentTarget.classList.remove(`is-drop-before`,`is-drop-after`)}}
              @drop=${t=>{if(!e.onReorder||!t.dataTransfer)return;let n=t.currentTarget,r=n instanceof Element?x(n)||t.dataTransfer.getData(j):``;if(!r||r===u||!(n instanceof Element))return;t.preventDefault();let i=E(t,n);S(n),e.onReorder(r,u,i)}}
              @dragend=${e=>{e.currentTarget instanceof Element&&S(e.currentTarget)}}
            >
              ${r.labelTooltip?t`<openclaw-tooltip
                      class="tabstrip-tab__label-tooltip"
                      .content=${r.labelTooltip}
                    >
                      <span class="tabstrip-tab__tooltip-trigger">${m}</span>
                    </openclaw-tooltip>`:m}
            </wa-tab>
            <button
              slot="nav"
              class="rail-header__action tabstrip-tab__close"
              type="button"
              .tabIndex=${s?0:-1}
              aria-label=${r.closeLabel}
              @keydown=${e=>{(e.key===`Enter`||e.key===` `)&&e.currentTarget instanceof Element&&A.add(e.currentTarget)}}
              @click=${async t=>{let i=t.currentTarget,a=i instanceof Node?i.getRootNode():null,o=a instanceof ShadowRoot?a.host:null,s=i instanceof Element&&(A.delete(i)||C(i)===i);if(await e.onClose(r.id),!s)return;await o?.updateComplete;let c=[...a?.querySelectorAll(`wa-tab-group`)??[]].find(t=>[...t.querySelectorAll(`wa-tab`)].some(t=>e.tabs.some(e=>t.getAttribute(`aria-controls`)===n(e))));await c?.updateComplete;let l=[...c?.querySelectorAll(`wa-tab`)??[]].find(e=>e.getAttribute(`panel`)===r.id),u=c?.querySelector(`wa-tab[active]`),d=u?C(u):null;!l&&u&&T(u,d)&&u.focus({preventScroll:!0})}}
            >
              <span class="tabstrip-tab__close-box">${p.x}</span>
            </button>
            ${f?t`<span slot="nav" class="tabstrip-separator" aria-hidden="true"></span>`:i}
          `})}
      ${r(!0)}
    </wa-tab-group>
  `}var k,A,j,M,N,P;function F(){return(F=e((()=>{a(),u(),n(),c(),d(),m(),h(),g(),k=new WeakMap,A=new WeakSet,j=`application/x-openclaw-panel-tab`,M=class extends f{#e;#t;#n;#r;#i=new Set;#a;#o=0;#s;#c;render(e){return i}update(e,[t]){this.#e||(this.#e=e.element,this.#l());let n=this.#e.ownerDocument.documentElement.dir;return(this.#s!==t||this.#c!==n)&&(this.#s=t,this.#c=n,this.#u()),i}#l(){let e=this.#e;if(!e||!this.isConnected)return;let t=++this.#o;this.#r=new MutationObserver(this.#u),this.#r.observe(e,{childList:!0,characterData:!0,subtree:!0}),(async()=>{await e.updateComplete,t===this.#o&&this.isConnected&&e.isConnected&&(this.#t=e.shadowRoot?.querySelector(`[part~="tabs"]`)??void 0,this.#t?.addEventListener(`scroll`,this.#u,{passive:!0}),typeof ResizeObserver==`function`&&(this.#n=new ResizeObserver(this.#u),this.#t&&(this.#n.observe(this.#t),this.#i.add(this.#t))),this.#u())})()}#u=()=>{this.#a===void 0&&this.isConnected&&this.#t&&(this.#a=requestAnimationFrame(()=>{this.#a=void 0;let e=this.#e,t=this.#t;if(!this.isConnected||!e?.isConnected||!t)return;let n=[...e.children],r=[...e.querySelectorAll(`.tabstrip-tab__label`)],i=new Set([t,...n,...r]);for(let e of this.#i)i.has(e)||this.#n?.unobserve(e);for(let e of i)this.#i.has(e)||this.#n?.observe(e);this.#i=i;let a=r.map(e=>({label:e,overflowing:e.scrollWidth>e.clientWidth+1})),o=n.map(e=>e.getBoundingClientRect()),s=t.getBoundingClientRect(),c=o.some(e=>s.left-e.left>8),l=o.some(e=>e.right-s.right>8);a.forEach(({label:e,overflowing:t})=>{e.classList.toggle(`is-overflowing`,t),e.parentElement?.classList.toggle(`has-label-overflow`,t),e.toggleAttribute(`data-tooltip-overflow`,t)}),e.classList.toggle(`has-scroll-left`,c),e.classList.toggle(`has-scroll-right`,l)}))};disconnected(){this.#o+=1,this.#r?.disconnect(),this.#n?.disconnect(),this.#i.clear(),this.#t?.removeEventListener(`scroll`,this.#u),this.#t=void 0,this.#a!==void 0&&(cancelAnimationFrame(this.#a),this.#a=void 0)}reconnected(){this.#l()}},N=r(M),P=l`
  :where(.tp-header, .bp-header) {
    --rail-header-height: 46px;
    --rail-header-padding-start: 8px;
  }
  :where(.tp-actions, .bp-actions) {
    padding-left: 8px;
    border-left: 1px solid var(--border, #262b34);
  }
  .tabstrip {
    --track-width: 0;
    display: block;
    /* Allow the strip to shrink inside a flex header so wide tab rows scroll
       here instead of squeezing out sibling header controls. */
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabstrip::part(nav) {
    display: flex;
    align-items: center;
  }
  .tabstrip::part(body) {
    display: none;
  }
  .tabstrip::-webkit-scrollbar {
    display: none;
  }
  .tabstrip-tab::part(base) {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 30px;
    padding: 0 34px 0 10px;
    border: 0;
    border-radius: 7px;
    color: var(--muted, #8a919e);
    white-space: nowrap;
    font-size: 12.5px;
    transition:
      color 0.12s ease,
      background 0.12s ease,
      box-shadow 0.12s ease;
  }
  .tabstrip-tab:hover::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .tabstrip-tab[active]::part(base) {
    color: var(--text, #d7dae0);
    background: var(--bg-hover, #1f2330);
    box-shadow: inset 0 0 0 1px var(--border-strong, #2e3040);
  }
  .tabstrip-tab.is-exited:not([active])::part(base) {
    opacity: 0.55;
  }
  .tabstrip-tab.is-connecting .tabstrip-tab__icon {
    animation: tabstrip-pulse 1.2s ease-in-out infinite;
  }
  .tabstrip-tab__icon {
    display: inline-flex;
    color: var(--accent, #ff5c5c);
  }
  .tabstrip-tab__favicon {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    object-fit: contain;
  }
  .tabstrip-tab.is-exited .tabstrip-tab__icon {
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__label {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
  }
  .tabstrip-tab__tooltip-trigger {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: inherit;
    flex: 1 1 auto;
  }
  .tabstrip-tab__status {
    font-size: 11px;
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__badge {
    border: 1px solid color-mix(in srgb, var(--accent, #ff5c5c) 45%, transparent);
    border-radius: 999px;
    color: var(--accent, #ff5c5c);
    font-size: 9px;
    line-height: 14px;
    padding: 0 5px;
    text-transform: uppercase;
  }
  /* Keep the close action inside the tab surface without nesting it in wa-tab;
     wa-tab-group still owns the direct tab children for keyboard navigation. */
  .tabstrip-tab__close {
    flex: 0 0 auto;
    align-self: center;
    z-index: 1;
    margin-left: -32px;
    margin-right: 4px;
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .tabstrip-tab__close-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 5px;
  }
  :where(.tabstrip-tab:hover, .tabstrip-tab[active]) + .tabstrip-tab__close,
  .tabstrip-tab__close:hover,
  .tabstrip-tab__close:focus-visible {
    opacity: 1;
  }
  .tabstrip-new {
    flex: none;
    align-self: center;
    margin-left: 2px;
  }
  .tabstrip-new-control {
    display: inline-flex;
    flex: none;
    align-self: center;
  }
  .tabstrip-separator {
    flex: 0 0 auto;
    align-self: center;
  }
  @keyframes tabstrip-pulse {
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabstrip-tab.is-connecting .tabstrip-tab__icon {
      animation: none;
    }
  }
`})))()}export{y as a,v as i,P as n,_ as o,O as r,F as t};
//# sourceMappingURL=panel-tab-strip-C3OyLkQ3.js.map