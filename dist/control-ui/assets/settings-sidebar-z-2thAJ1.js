import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Fs as n,Sl as r,ai as i,fi as a,il as o,ju as s,nl as c,rl as l}from"./control-ui-core-bJHyI7AF.js";import{Fa as u,La as d,Na as f,Oa as p,Pa as m,Ra as h,Sa as g,So as _,Xi as v,Zi as y,ba as ee,c as b,ga as te,ha as ne,ja as x,ka as re,mo as S,na as C,ra as w,s as ie,sa as ae,ua as oe,wa as T,yo as se,za as ce}from"./control-ui-core-DNh4McGE.js";import{$ as E,X as D,Y as O,ct as le,nt as ue,ut as de}from"./lit-runtime-DyST807n.js";import{_a as fe,ia as pe,ii as k,ro as A,wo as j}from"./ui-DeikvIdP.js";import{_i as M,h as N}from"./control-ui-boot-shared-C9uJ732w.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{n as P,t as F}from"./en-settings-C6f4UN4T.js";import{a as I,o as L}from"./settings-targets-BbtwiQ79.js";import{i as R,n as z,r as B,t as me}from"./config-form.tiers-DxSTPAoy.js";import{n as he,o as ge,r as _e}from"./config-form.search-CNmb4arn.js";import{c as V,g as ve,i as ye,m as be,o as xe,r as Se}from"./setup-schema-X0WUp0sz.js";function Ce(e,t){let n=s(e.labelKey),r=t?Object.entries(e.nativeSearchKeys??{}).filter(([,e])=>e(t)).map(([e])=>e):[];return{routeId:e.routeId,...e.search===void 0?{}:{search:e.search},hash:e.hash,label:n,searchText:[n,...[...e.searchKeys,...r].map(e=>s(e)),e.aliases??``].join(` `)}}function we(e,t){let n=U[e],r=t.properties;if(!n||!r)return t;let i=new Set(n);return{...t,properties:Object.fromEntries(Object.entries(r).filter(([e])=>i.has(e)))}}function Te(e){if(!e.query.trim())return[];let t=ge(e.query),n=t.tags.length===0&&t.text?H.filter(t=>(e.identityAvailable||!t.requiresIdentity)&&(e.multipleProfiles||!t.requiresMultipleProfiles)&&(e.nativeDeviceSettings||!t.requiresNativeDeviceSettings)&&p(t.routeId,e.canAdmin!==!1,e.nativeDeviceSettings)).map(t=>Ce(t,e.nativeDeviceSettings?.snapshot??null)).filter(e=>u(e.searchText,t.text)):[],r=fe(e.schema)?e.schema:null;if(!r||a(r)!==`object`||!r.properties)return n;let i=W.get(r);(!i||i.hints!==e.uiHints)&&(i={hints:e.uiHints,sections:new Map},W.set(r,i));let o=e.value??{};for(let[t,a]of Object.entries(r.properties)){let r=be(t);if(!p(r,e.canAdmin!==!1,e.nativeDeviceSettings))continue;let s=i.sections.get(t);if(!s){let n=t===`wizard`?ye(a):we(r,a);s={schema:n,tiers:z({schema:n,path:[t],hints:e.uiHints})},i.sections.set(t,s)}let{schema:c,tiers:l}=s,d=B[t],f=n=>!!(n&&_e({key:t,schema:n,value:o[t],hints:e.uiHints,query:e.query,label:d?.label,description:d?.description,textMatcher:u})),m=f(l.common),h=f(l.advanced);if(!m&&!h)continue;let g=encodeURIComponent(t),_=`#config-section-${g}`;n.push({routeId:r,label:d?.label??c.title??t,...r===`memory`?{pathname:se(`settings`,e.basePath),hash:_}:r===`plugin-settings`?{search:`?tab=advanced`,hash:`#plugin-settings-advanced`}:{search:`?section=${g}${h||t===`wizard`?`&advanced=1`:``}`,hash:_}})}return n}var H,U,W;function G(){return(G=e((()=>{T(),S(),R(),he(),me(),t(),F(),i(),ve(),V(),L(),Se(),P(),H=Object.values(I),U={memory:xe,"plugin-settings":[`enabled`,`allow`,`deny`,`load`,`slots`],updates:[`channel`,`checkOnStart`,`auto`]},W=new WeakMap})))()}function K(e,t){return E`<button
    class="btn btn--xs settings-save-indicator__action"
    type="button"
    @click=${t}
  >
    ${e}
  </button>`}var q,J;function Y(){return(Y=e((()=>{O(),ue(),t(),w(),ae(),q=2e3,J=class extends pe{constructor(...e){super(...e),this.savedVisible=!1}createRenderRoot(){return this}willUpdate(){let e=this.props?.status;this.previousStatus===`saving`&&e===`saved`?(this.clearSavedTimer(),this.savedVisible=!0,this.savedTimer=globalThis.setTimeout(()=>{this.savedTimer=void 0,this.savedVisible=!1},q)):e!==`saved`&&(this.clearSavedTimer(),this.savedVisible=!1),this.previousStatus=e}disconnectedCallback(){this.clearSavedTimer(),super.disconnectedCallback()}clearSavedTimer(){globalThis.clearTimeout(this.savedTimer),this.savedTimer=void 0}renderClaw(e){return E`<span class="settings-save-indicator__claw ${e}" aria-hidden="true"
      >${oe().mascot===`none`?C.mark:C.claw}</span
    >`}render(){let e=this.props;if(!e)return D;let t,n=``,r=``,i=``;if(e.applying)t=E` <span class="settings-save-indicator__spinner" aria-hidden="true"
          >${C.loader}</span
        >
        <span>${s(`configView.applying`)}</span>`;else if(e.status===`saving`)t=E` ${this.renderClaw(`settings-save-indicator__claw--saving`)}
        <span>${s(`configView.autoSaveSaving`)}</span>`;else if(e.status===`recovery`)n=` settings-save-indicator--danger settings-save-indicator--recovery`,t=E`<span>${e.lastError}</span>
        ${K(s(`configView.recoveryReload`),e.onReload)}`;else if(e.status===`rejected`)n=` settings-save-indicator--rejected`,t=E`<span>${s(`configView.autoSaveRejected`)}</span>
        <span>${s(`configView.autoSaveRejectedHint`)}</span>
        ${e.lastError?E`<details>
                <summary>${s(`configView.rejectionDetails`)}</summary>
                <span>${e.lastError}</span>
              </details>`:D}
        ${K(s(`configView.retry`),e.onRetry)}
        ${K(s(`configView.recoveryReload`),e.onReload)}`;else if(e.status===`error`)i=e.lastError?.trim()??``,r=i?`${s(`configView.autoSaveFailed`)}: ${i}`:``,n=` settings-save-indicator--danger`,t=E` <span>${s(`configView.autoSaveFailed`)}</span>
        ${K(s(`configView.retry`),e.onRetry)}`;else if(e.status===`paused`)t=E` <span>${s(`configView.autoSavePaused`)}</span>
        ${K(s(`configView.saveNow`),e.onSave)}`;else if(e.status===`conflict`)n=` settings-save-indicator--danger`,t=E` <span>${s(`configView.autoSaveConflict`)}</span>
        ${K(s(`common.reload`),e.onReload)}`;else if(this.savedVisible)n=` settings-save-indicator--saved`,t=E` ${this.renderClaw(`settings-save-indicator__claw--saved`)}
        <span class="settings-save-indicator__check" aria-hidden="true">${C.check}</span>
        <span>${s(`configView.autoSaveSaved`)}</span>`;else if(e.needsApply)t=E` <button
        class="btn btn--xs settings-save-indicator__apply"
        type="button"
        ?disabled=${e.applyDisabled}
        @click=${e.onApply}
      >
        ${s(`configView.applyChanges`)}
      </button>`;else return D;return E`<div
      class="settings-save-indicator${n}"
      role="status"
      aria-live="polite"
      aria-label=${r||D}
      title=${i||D}
    >
      ${t}
    </div>`}},k([de({attribute:!1})],J.prototype,`props`,void 0),k([le()],J.prototype,`savedVisible`,void 0),customElements.get(`openclaw-settings-save-indicator`)||customElements.define(`openclaw-settings-save-indicator`,J)})))()}function Ee(e,t){if(t.pathname)return!1;let n=j(t.label);return[f(e),h(e)].some(e=>j(e)===n)}function De(e,t,n,r){let i=ce(n,r),a=t.filter(e=>p(e.routeId,n,r)),o=j(e);if(!o)return i.map(e=>({labelKey:e.labelKey,items:e.routes.map(e=>({routeId:e,blocks:[]}))}));let c=i.flatMap(e=>e.routes),l=[...new Set([...c,...ee.filter(e=>p(e,n,r)),...a.map(e=>e.routeId)])],m=l.filter(e=>[f(e),h(e),d(e)].some(e=>u(e,o))),g=new Set(m),_=i.flatMap(e=>e.labelKey&&u(s(e.labelKey),o)?e.routes.filter(e=>!g.has(e)&&(g.add(e),!0)):[]),v=new Map,y=new Set;for(let e of a){let t=`${e.routeId}\u0000${e.pathname??``}\u0000${e.search??``}\u0000${e.hash}`;if(y.has(t))continue;y.add(t);let n=v.get(e.routeId)??[];n.push(e),v.set(e.routeId,n)}let b=[...m,..._];return[...b.length>0?[{labelKey:null,items:b.map(e=>({routeId:e,blocks:(v.get(e)??[]).filter(t=>!Ee(e,t))}))}]:[],...l.filter(e=>!g.has(e)&&v.has(e)).map(e=>({labelKey:null,items:[{routeId:e,blocks:v.get(e)??[]}]}))]}function Oe(e,t){let r=m(e.activeRouteId)===t;return E`
    <a
      href=${_(t,e.basePath)}
      class="settings-sidebar__item ${r?`settings-sidebar__item--active`:``}"
      aria-current=${r?`page`:D}
      @focus=${n=>x(e.preloadTimers,t,n,e.onPreload,r)}
      @blur=${t=>g(e.preloadTimers,t)}
      @pointerenter=${n=>x(e.preloadTimers,t,n,e.onPreload,r)}
      @pointerleave=${t=>g(e.preloadTimers,t)}
      @touchstart=${{handleEvent:n=>x(e.preloadTimers,t,n,e.onPreload,r,!0),passive:!0}}
      @click=${r=>{n(r)&&(r.preventDefault(),e.onNavigate(t))}}
    >
      <span class="settings-sidebar__item-icon" aria-hidden="true"
        >${C[re(t)]}</span
      >
      <span class="settings-sidebar__item-label"
        >${f(t,e.nativeDeviceSettings?.snapshot)}</span
      >
      ${e.presentation===`embed-list`?E`<span class="settings-row__chevron" aria-hidden="true">${C.chevronRight}</span>`:D}
    </a>
  `}function ke(e,t){let r=(t.pathname??_(t.routeId,e.basePath))+(t.search??``)+t.hash,i=e.activeRouteId===t.routeId&&(t.pathname===void 0||e.activePathname===t.pathname)&&e.activeHash===t.hash&&(t.search===void 0||e.activeSearch===t.search);return E`
    <a
      href=${r}
      class="settings-sidebar__subitem ${i?`settings-sidebar__subitem--active`:``}"
      aria-current=${i?`location`:D}
      @click=${r=>{n(r)&&(r.preventDefault(),e.onNavigate(t.routeId,{...t.pathname?{pathname:t.pathname}:{},...t.search?{search:t.search}:{},hash:t.hash}))}}
    >
      <span class="settings-sidebar__subitem-label">${t.label}</span>
    </a>
  `}function Ae(e){e.closest(`.settings-sidebar`)?.querySelector(`.settings-sidebar__search`)?.classList.toggle(`settings-sidebar__search--scrolled`,e.scrollTop>0)}function je(e){let t=new Map(e.map(e=>[e.id,e])),n=new Map,r=[];for(let i of e){let e=i.creatorAgentId;if(e&&e!==i.id&&t.has(e)){let t=n.get(e)??[];t.push(i),n.set(e,t)}else r.push(i)}let i=[],a=new Set,o=(e,t)=>{if(!a.has(e.id)){a.add(e.id),i.push({agent:e,...t>0&&e.creatorAgentId?{creatorAgentId:e.creatorAgentId}:{}});for(let r of n.get(e.id)??[])o(r,t+1)}};return r.forEach(e=>o(e,0)),e.forEach(e=>o(e,0)),i}function X(e){let t=l(e.agents).map(e=>Object.assign({},e,{id:A(e.id),creatorAgentId:e.creatorAgentId?A(e.creatorAgentId):e.creatorAgentId})),n=je(t).map(({agent:e,creatorAgentId:t})=>({value:e.id,label:o(e),agent:e,description:t?s(`agents.createdBy`,{id:t}):void 0}));return E`<div class="settings-sidebar__agent">
    <openclaw-agent-select
      .options=${n}
      .identityById=${Object.fromEntries(e.agentIdentity.entries().map(e=>[e.agentId,e]))}
      .value=${e.settingsAgentSelection.state.selectedId??``}
      .accessibleLabel=${s(`agentScope.label`)}
      .menuLabel=${s(`agentScope.label`)}
      .disabled=${n.length<=1}
      .onSelect=${t=>e.settingsAgentSelection.set(t)}
      @wa-show=${()=>void e.agentIdentity.ensure(t.map(e=>e.id))}
    ></openclaw-agent-select>
  </div>`}function Z(e){return e.connectionStatus===null?E`<openclaw-settings-save-indicator
        .props=${e.saveIndicator}
      ></openclaw-settings-save-indicator>`:b({kind:e.connectionStatus,lastError:e.lastError,onRetry:e.onRetryConnect})}function Q(e){return E`<header class="native-embed-header">
    ${e.presentation===`embed-page`?E`<button
            class="native-embed-header__back btn btn--ghost"
            type="button"
            aria-label=${s(`common.back`)}
            @click=${e.onExit}
          >
            <span aria-hidden="true">${C.chevronLeft}</span>${s(`common.back`)}
          </button>`:D}
    <h1 class="page-title">
      ${e.presentation===`embed-list`?s(`nav.settings`):f(e.activeRouteId,e.nativeDeviceSettings?.snapshot)}
    </h1>
    ${Z(e)}
  </header>`}function Me(e){if(e.presentation===`embed-page`)return E`${Q(e)} ${X(e)}`;let t=e.searchBlockMatches??(e.searchParams?Te(e.searchParams):[]),n=De(e.searchQuery,t,e.canAdmin!==!1,e.nativeDeviceSettings??null),r=E` <nav
    class="settings-sidebar__nav"
    aria-label=${s(`common.settingsSections`)}
    @scroll=${e=>Ae(e.currentTarget)}
  >
    ${n.length===0?E`<p class="settings-sidebar__empty" role="status">
            ${s(`nav.settingsSearchNoResults`)}
          </p>`:n.map(t=>E`
              <div class="settings-sidebar__group">
                ${t.labelKey?E`<div class="settings-sidebar__group-label">${s(t.labelKey)}</div>`:D}
                ${t.items.map(t=>E`
                    ${Oe(e,t.routeId)}
                    ${t.blocks.map(t=>ke(e,t))}
                  `)}
              </div>
            `)}
  </nav>`;return e.presentation===`embed-list`?E`<section class="settings-embed-list">
      ${Q(e)} ${X(e)} ${r}
    </section>`:E`
    <aside class="settings-sidebar">
      <header class="settings-sidebar__header" @mousedown=${ne}>
        <button type="button" class="settings-sidebar__back" @click=${()=>e.onExit()}>
          <span class="settings-sidebar__back-icon" aria-hidden="true">${C.arrowLeft}</span>
          ${s(`nav.exitSettings`)}
          ${y(`esc`,{className:`settings-sidebar__esc`,ariaHidden:!0})}
        </button>
        <h1 class="settings-sidebar__title">${s(`nav.settings`)}</h1>
      </header>
      ${X(e)}
      <div class="settings-sidebar__search" role="search">
        <span class="settings-sidebar__search-icon" aria-hidden="true">${C.search}</span>
        <input
          class="settings-sidebar__search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          aria-label=${s(`nav.settingsSearchLabel`)}
          placeholder=${s(`nav.settingsSearchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchQueryChange(t.currentTarget.value)}
          @keydown=${t=>{if(t.key===`Escape`){if(t.preventDefault(),e.searchQuery){e.onSearchQueryChange(``);return}e.onExit()}}}
        />
        ${e.searchQuery?E`
                <button
                  type="button"
                  class="settings-sidebar__search-clear"
                  aria-label=${s(`nav.settingsSearchClear`)}
                  @click=${t=>{let n=t.currentTarget.parentElement?.querySelector(`input`);e.onSearchQueryChange(``),n?.focus()}}
                >
                  ${C.x}
                </button>
              `:D}
      </div>
      ${r}
      <footer class="settings-sidebar__footer">
        ${Z(e)}
        <openclaw-sidebar-build-chip
          .basePath=${e.basePath}
          .gatewayVersion=${e.gatewayVersion||null}
          .variant=${`settings`}
          .onNavigate=${()=>e.onNavigate(`about`)}
        ></openclaw-sidebar-build-chip>
      </footer>
    </aside>
  `}function $(){return($=e((()=>{O(),T(),S(),te(),t(),c(),r(),G(),ie(),w(),v(),M(),Y(),N()})))()}$();export{Me as renderSettingsSidebar};
//# sourceMappingURL=settings-sidebar-z-2thAJ1.js.map