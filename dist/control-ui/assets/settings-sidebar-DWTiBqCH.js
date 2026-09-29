import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Na as n,ai as r,co as i}from"./control-ui-foundation-Bju0LxrM.js";import{Dc as a,Gl as o,Oc as s,Xl as c,Yc as l,gr as u,hi as d,kc as f,ur as p}from"./control-ui-core-DX6662ze.js";import{$ as m,X as h,Y as g,ct as ee,nt as te,ut as ne}from"./lit-runtime-BOUQsi_O.js";import{Bi as re,Fi as _,Ii as v,Ja as ie,Oa as y,Qa as b,Ta as ae,Ua as oe,Ui as x,Wa as se,Xa as S,ao as C,ba as w,c as ce,co as le,do as ue,fo as T,l as E,lo as D,no as O,po as de,ro as k,so as A}from"./control-ui-core-QgEwr0pF.js";import{g as j}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as M,t as N}from"./en-settings-tomLhsTf.js";import{ht as P}from"./control-ui-boot-new-C15hsoXP.js";import{a as F,o as I}from"./settings-targets-DQFNTZMO.js";import{a as L,c as R,d as z,i as B,n as V,t as H,u as fe}from"./config-form.tiers-CRu12VYF.js";import{_ as pe,h as me,i as he,r as ge,s as _e,u as ve}from"./setup-schema-lpZryV4a.js";import"./settings-CQpQmrfe.js";function ye(e,t){let n=c(e.labelKey),r=t?Object.entries(e.nativeSearchKeys??{}).filter(([,e])=>e(t)).map(([e])=>e):[];return{routeId:e.routeId,...e.search===void 0?{}:{search:e.search},hash:e.hash,label:n,searchText:[n,...[...e.searchKeys,...r].map(e=>c(e)),e.aliases??``].join(` `)}}function be(e,t){let n=W[e],r=t.properties;if(!n||!r)return t;let i=new Set(n());return{...t,properties:Object.fromEntries(Object.entries(r).filter(([e])=>i.has(e)))}}function xe(e){if(!e.query.trim())return[];let t=R(e.query),n=t.tags.length===0&&t.text?U.filter(t=>(e.identityAvailable||!t.requiresIdentity)&&(e.nativeDeviceSettings||!t.requiresNativeDeviceSettings)&&O(t.routeId,e.canAdmin!==!1,e.nativeDeviceSettings)).map(t=>ye(t,e.nativeDeviceSettings?.snapshot??null)).filter(e=>D(e.searchText,t.text)):[],r=e.schema&&typeof e.schema==`object`&&!Array.isArray(e.schema)?e.schema:null;if(!r||u(r)!==`object`||!r.properties)return n;let i=G.get(r);(!i||i.hints!==e.uiHints)&&(i={hints:e.uiHints,sections:new Map},G.set(r,i));let a=e.value??{};for(let[t,o]of Object.entries(r.properties)){let r=me(t);if(!O(r,e.canAdmin!==!1,e.nativeDeviceSettings))continue;let s=i.sections.get(t);if(!s){let n=t===`wizard`?he(o):be(r,o);s={schema:n,tiers:V({schema:n,path:[t],hints:e.uiHints})},i.sections.set(t,s)}let{schema:c,tiers:l}=s,u=fe[t],d=n=>!!(n&&L({key:t,schema:n,value:a[t],hints:e.uiHints,query:e.query,label:u?.label,description:u?.description,textMatcher:D})),f=d(l.common),p=d(l.advanced);if(!f&&!p)continue;let m=encodeURIComponent(t),h={search:``,hash:`#config-section-${m}`};n.push(r===`memory`?{routeId:r,label:u?.label??c.title??t,pathname:ae(`settings`,e.basePath),hash:h.hash}:r===`plugin-settings`?{routeId:r,label:u?.label??c.title??t,search:`?tab=advanced`,hash:`#plugin-settings-advanced`}:{routeId:r,label:u?.label??c.title??t,search:`?section=${m}${p||t===`wizard`?`&advanced=1`:``}`,hash:h.hash})}return n}var U,W,G;function K(){return(K=e((()=>{b(),w(),z(),B(),H(),o(),N(),p(),pe(),_e(),I(),ge(),M(),U=Object.values(F),W={memory:ve,"plugin-settings":()=>[`enabled`,`allow`,`deny`,`load`,`slots`],updates:()=>[`channel`,`checkOnStart`,`auto`]},G=new WeakMap})))()}var q,J;function Y(){return(Y=e((()=>{g(),te(),o(),v(),re(),q=2e3,J=class extends t{constructor(...e){super(...e),this.savedVisible=!1}createRenderRoot(){return this}willUpdate(){let e=this.props?.status;this.previousStatus===`saving`&&e===`saved`?(this.clearSavedTimer(),this.savedVisible=!0,this.savedTimer=globalThis.setTimeout(()=>{this.savedTimer=void 0,this.savedVisible=!1},q)):e!==`saved`&&(this.clearSavedTimer(),this.savedVisible=!1),this.previousStatus=e}disconnectedCallback(){this.clearSavedTimer(),super.disconnectedCallback()}clearSavedTimer(){globalThis.clearTimeout(this.savedTimer),this.savedTimer=void 0}renderClaw(e){return m`<span class="settings-save-indicator__claw ${e}" aria-hidden="true"
      >${x().mascot===`none`?_.mark:_.claw}</span
    >`}render(){let e=this.props;if(!e)return h;let t,n=``,r=``,i=``;if(e.applying)t=m` <span class="settings-save-indicator__spinner" aria-hidden="true"
          >${_.loader}</span
        >
        <span>${c(`configView.applying`)}</span>`;else if(e.status===`saving`)t=m` ${this.renderClaw(`settings-save-indicator__claw--saving`)}
        <span>${c(`configView.autoSaveSaving`)}</span>`;else if(e.status===`recovery`)n=` settings-save-indicator--danger settings-save-indicator--recovery`,t=m`<span>${e.lastError}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onReload}
        >
          ${c(`configView.recoveryReload`)}
        </button>`;else if(e.status===`error`)i=e.lastError?.trim()??``,r=i?`${c(`configView.autoSaveFailed`)}: ${i}`:``,n=` settings-save-indicator--danger`,t=m` <span>${c(`configView.autoSaveFailed`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onRetry}
        >
          ${c(`configView.retry`)}
        </button>`;else if(e.status===`paused`)t=m` <span>${c(`configView.autoSavePaused`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onSave}
        >
          ${c(`configView.saveNow`)}
        </button>`;else if(e.status===`conflict`)n=` settings-save-indicator--danger`,t=m` <span>${c(`configView.autoSaveConflict`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onReload}
        >
          ${c(`common.reload`)}
        </button>`;else if(this.savedVisible)n=` settings-save-indicator--saved`,t=m` ${this.renderClaw(`settings-save-indicator__claw--saved`)}
        <span class="settings-save-indicator__check" aria-hidden="true">${_.check}</span>
        <span>${c(`configView.autoSaveSaved`)}</span>`;else if(e.needsApply)t=m` <button
        class="btn btn--xs settings-save-indicator__apply"
        type="button"
        ?disabled=${e.applyDisabled}
        @click=${e.onApply}
      >
        ${c(`configView.applyChanges`)}
      </button>`;else return h;return m`<div
      class="settings-save-indicator${n}"
      role="status"
      aria-live="polite"
      aria-label=${r||h}
      title=${i||h}
    >
      ${t}
    </div>`}},r([ne({attribute:!1})],J.prototype,`props`,void 0),r([ee()],J.prototype,`savedVisible`,void 0),customElements.get(`openclaw-settings-save-indicator`)||customElements.define(`openclaw-settings-save-indicator`,J)})))()}function Se(e,t){if(t.pathname)return!1;let n=i(t.label);return[A(e),T(e)].some(e=>i(e)===n)}function Ce(e,t,n,r){let a=de(n,r),o=t.filter(e=>O(e.routeId,n,r)),s=i(e);if(!s)return a.map(e=>({labelKey:e.labelKey,items:e.routes.map(e=>({routeId:e,blocks:[]}))}));let l=a.flatMap(e=>e.routes),u=[...new Set([...l,...ie.filter(e=>O(e,n,r)),...o.map(e=>e.routeId)])],d=u.filter(e=>[A(e),T(e),ue(e)].some(e=>D(e,s))),f=new Set(d),p=a.flatMap(e=>e.labelKey&&D(c(e.labelKey),s)?e.routes.filter(e=>!f.has(e)&&(f.add(e),!0)):[]),m=new Map,h=new Set;for(let e of o){let t=`${e.routeId}\u0000${e.pathname??``}\u0000${e.search??``}\u0000${e.hash}`;if(h.has(t))continue;h.add(t);let n=m.get(e.routeId)??[];n.push(e),m.set(e.routeId,n)}let g=[...d,...p];return[...g.length>0?[{labelKey:null,items:g.map(e=>({routeId:e,blocks:(m.get(e)??[]).filter(t=>!Se(e,t))}))}]:[],...u.filter(e=>!f.has(e)&&m.has(e)).map(e=>({labelKey:null,items:[{routeId:e,blocks:m.get(e)??[]}]}))]}function we(e,t,n){let r=le(e.activeRouteId)===t;return m`
    <a
      href=${y(t,e.basePath)}
      class="settings-sidebar__item ${r?`settings-sidebar__item--active`:``}"
      aria-current=${r?`page`:h}
      @focus=${n=>C(e.preloadTimers,t,n,e.onPreload,r)}
      @blur=${t=>S(e.preloadTimers,t)}
      @pointerenter=${n=>C(e.preloadTimers,t,n,e.onPreload,r)}
      @pointerleave=${t=>S(e.preloadTimers,t)}
      @touchstart=${{handleEvent:n=>C(e.preloadTimers,t,n,e.onPreload,r,!0),passive:!0}}
      @click=${n=>{d(n)&&(n.preventDefault(),e.onNavigate(t))}}
    >
      <span class="settings-sidebar__item-icon" aria-hidden="true"
        >${_[k(t)]}</span
      >
      <span class="settings-sidebar__item-label"
        >${n??A(t,e.nativeDeviceSettings?.snapshot)}</span
      >
      ${e.presentation===`embed-list`?m`<span class="settings-row__chevron" aria-hidden="true">${_.chevronRight}</span>`:h}
    </a>
  `}function Te(e,t){let n=(t.pathname??y(t.routeId,e.basePath))+(t.search??``)+t.hash,r=e.activeRouteId===t.routeId&&(t.pathname===void 0||e.activePathname===t.pathname)&&e.activeHash===t.hash&&(t.search===void 0||e.activeSearch===t.search);return m`
    <a
      href=${n}
      class="settings-sidebar__subitem ${r?`settings-sidebar__subitem--active`:``}"
      aria-current=${r?`location`:h}
      @click=${n=>{d(n)&&(n.preventDefault(),e.onNavigate(t.routeId,{...t.pathname?{pathname:t.pathname}:{},...t.search?{search:t.search}:{},hash:t.hash}))}}
    >
      <span class="settings-sidebar__subitem-label">${t.label}</span>
    </a>
  `}function Ee(e){e.closest(`.settings-sidebar`)?.querySelector(`.settings-sidebar__search`)?.classList.toggle(`settings-sidebar__search--scrolled`,e.scrollTop>0)}function X(e){let t=new Map(e.map(e=>[e.id,e])),n=new Map,r=[];for(let i of e){let e=i.creatorAgentId;if(e&&e!==i.id&&t.has(e)){let t=n.get(e)??[];t.push(i),n.set(e,t)}else r.push(i)}let i=[],a=new Set,o=(e,t)=>{if(!a.has(e.id)){a.add(e.id),i.push({agent:e,...t>0&&e.creatorAgentId?{creatorAgentId:e.creatorAgentId}:{}});for(let r of n.get(e.id)??[])o(r,t+1)}};return r.forEach(e=>o(e,0)),e.forEach(e=>o(e,0)),i}function Z(e){let t=s(e.agents).map(e=>Object.assign({},e,{id:n(e.id),creatorAgentId:e.creatorAgentId?n(e.creatorAgentId):e.creatorAgentId})),r=X(t).map(({agent:e,creatorAgentId:t})=>({value:e.id,label:f(e),agent:e,description:t?c(`agents.createdBy`,{id:t}):void 0}));return m`<div class="settings-sidebar__agent">
    <openclaw-agent-select
      .options=${r}
      .identityById=${Object.fromEntries(e.agentIdentity.entries().map(e=>[e.agentId,e]))}
      .value=${e.settingsAgentSelection.state.selectedId??``}
      .accessibleLabel=${c(`agentScope.label`)}
      .menuLabel=${c(`agentScope.label`)}
      .disabled=${r.length<=1}
      .onSelect=${t=>e.settingsAgentSelection.set(t)}
      @wa-show=${()=>void e.agentIdentity.ensure(t.map(e=>e.id))}
    ></openclaw-agent-select>
  </div>`}function Q(e){return m`<header class="native-embed-header">
    ${e.presentation===`embed-page`?m`<button
            class="native-embed-header__back btn btn--ghost"
            type="button"
            aria-label=${c(`common.back`)}
            @click=${e.onExit}
          >
            <span aria-hidden="true">${_.chevronLeft}</span>${c(`common.back`)}
          </button>`:h}
    <h1 class="page-title">
      ${e.presentation===`embed-list`?c(`nav.settings`):A(e.activeRouteId,e.nativeDeviceSettings?.snapshot)}
    </h1>
    ${e.connectionStatus===null?h:E({kind:e.connectionStatus,lastError:e.lastError,onRetry:e.onRetryConnect})}
    ${e.connectionStatus===null?m`<openclaw-settings-save-indicator
            .props=${e.saveIndicator}
          ></openclaw-settings-save-indicator>`:h}
  </header>`}function De(e){if(e.presentation===`embed-page`)return m`${Q(e)} ${Z(e)}`;let t=e.searchBlockMatches??(e.searchParams?xe(e.searchParams):[]),n=Ce(e.searchQuery,t,e.canAdmin!==!1,e.nativeDeviceSettings??null),r=m` <nav
    class="settings-sidebar__nav"
    aria-label=${c(`common.settingsSections`)}
    @scroll=${e=>Ee(e.currentTarget)}
  >
    ${n.length===0?m`<p class="settings-sidebar__empty" role="status">
            ${c(`nav.settingsSearchNoResults`)}
          </p>`:n.map(t=>m`
              <div class="settings-sidebar__group">
                ${t.labelKey?m`<div class="settings-sidebar__group-label">${c(t.labelKey)}</div>`:h}
                ${t.items.map(t=>m`
                    ${we(e,t.routeId)}
                    ${t.blocks.map(t=>Te(e,t))}
                  `)}
              </div>
            `)}
  </nav>`;return e.presentation===`embed-list`?m`<section class="settings-embed-list">
      ${Q(e)} ${Z(e)} ${r}
    </section>`:m`
    <aside class="settings-sidebar">
      <header class="settings-sidebar__header" @mousedown=${oe}>
        <button type="button" class="settings-sidebar__back" @click=${()=>e.onExit()}>
          <span class="settings-sidebar__back-icon" aria-hidden="true">${_.arrowLeft}</span>
          ${c(`nav.exitSettings`)}
          <kbd class="settings-sidebar__esc" aria-hidden="true">esc</kbd>
        </button>
        <h1 class="settings-sidebar__title">${c(`nav.settings`)}</h1>
      </header>
      ${Z(e)}
      <div class="settings-sidebar__search" role="search">
        <span class="settings-sidebar__search-icon" aria-hidden="true">${_.search}</span>
        <input
          class="settings-sidebar__search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          aria-label=${c(`nav.settingsSearchLabel`)}
          placeholder=${c(`nav.settingsSearchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchQueryChange(t.currentTarget.value)}
          @keydown=${t=>{if(t.key===`Escape`){if(t.preventDefault(),e.searchQuery){e.onSearchQueryChange(``);return}e.onExit()}}}
        />
        ${e.searchQuery?m`
                <button
                  type="button"
                  class="settings-sidebar__search-clear"
                  aria-label=${c(`nav.settingsSearchClear`)}
                  @click=${t=>{let n=t.currentTarget.parentElement?.querySelector(`input`);e.onSearchQueryChange(``),n?.focus()}}
                >
                  ${_.x}
                </button>
              `:h}
      </div>
      ${r}
      <footer class="settings-sidebar__footer">
        ${e.connectionStatus===null?h:E({kind:e.connectionStatus,lastError:e.lastError,onRetry:e.onRetryConnect})}
        ${e.connectionStatus===null?m`<openclaw-settings-save-indicator
                .props=${e.saveIndicator}
              ></openclaw-settings-save-indicator>`:h}
        <openclaw-sidebar-build-chip
          .basePath=${e.basePath}
          .gatewayVersion=${e.gatewayVersion||null}
          .variant=${`settings`}
          .onNavigate=${()=>e.onNavigate(`about`)}
        ></openclaw-sidebar-build-chip>
      </footer>
    </aside>
  `}function $(){return($=e((()=>{g(),b(),w(),se(),o(),a(),l(),K(),ce(),v(),P(),Y(),j()})))()}$();export{De as renderSettingsSidebar};
//# sourceMappingURL=settings-sidebar-DWTiBqCH.js.map