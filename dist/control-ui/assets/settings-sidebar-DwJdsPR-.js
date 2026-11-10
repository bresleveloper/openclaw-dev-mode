import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ba as t,Ko as n,Na as r,Pa as i,Ra as a,Vo as o,Yo as s,ci as c,cn as l,ea as u,ei as d,gi as f,hi as p,ii as m,ln as h,mi as g,sn as _,ta as v,ui as ee}from"./control-ui-core-BATTP0p-.js";import{Bs as te,Gr as ne,Hl as re,Ml as ie,Ol as ae,Pl as oe,Rr as se,Rs as ce,bl as y,bs as le,du as ue,gs as de,jc as fe,jl as b,ql as x,su as pe,uu as me,zs as he}from"./control-ui-core-BKhTeqAN.js";import{J as S,Z as C,q as ge}from"./lit-runtime-DICwFbCm.js";import{Bo as _e,Co as w,Go as T,Ho as E,Jo as ve,La as D,Mo as O,Oo as k,Ro as A,So as ye,Wo as be,Zo as xe,ho as Se,ri as j,to as Ce,vo as we,wo as M,xo as N,yo as Te,zo as P}from"./ui-CFzBFVbW.js";import{Ia as Ee,La as De,Na as Oe,Oa as F,Pa as ke,Si as Ae,ka as I}from"./control-ui-boot-shared-BxV-1cRX.js";import{H as je,V as Me,rn as L,tn as R}from"./control-ui-boot-shared-Bd7-olFI.js";import"./control-ui-boot-shared-styles-Dp5wBUkV.js";import{n as Ne,t as Pe}from"./en-settings-2ZS6kPch.js";import{i as z,n as B,r as Fe,t as V}from"./settings-navigation-kTRkLIN3.js";import{a as Ie,o as Le}from"./settings-targets-CWJ7m3wg.js";import{i as Re,n as ze,r as Be,t as Ve}from"./config-form.tiers-CtzPIX9S.js";import{n as He,o as Ue,r as We}from"./config-form.search-CSdDgPcw.js";import{c as Ge,i as Ke,o as qe,r as Je}from"./setup-schema-sLfXWVPq.js";import{n as Ye}from"./sidebar-build-chip-D_v8CqNY.js";function Xe(e,t){let n=x(e.labelKey),r=t?Object.entries(e.nativeSearchKeys??{}).filter(([,e])=>e(t)).map(([e])=>e):[];return{routeId:e.routeId,...e.search===void 0?{}:{search:e.search},hash:e.hash,label:n,searchText:[n,...[...e.searchKeys,...r].filter(e=>_().lobsterdex||e!==`configView.appearance.tabIcon.lobsterdex`).map(e=>x(e)),e.aliases??``].join(` `)}}function Ze(e,t){let n=U[e],r=t.properties;if(!n||!r)return t;let i=new Set(n);return{...t,properties:Object.fromEntries(Object.entries(r).filter(([e])=>i.has(e)))}}function Qe(e){if(!e.query.trim())return[];let t=Ue(e.query),r=t.tags.length===0&&t.text?H.filter(t=>(e.identityAvailable||!t.requiresIdentity)&&(e.multipleProfiles||!t.requiresMultipleProfiles)&&(e.nativeDeviceSettings||!t.requiresNativeDeviceSettings)&&c(t.routeId,e.canAdmin!==!1,e.nativeDeviceSettings)).map(t=>Xe(t,e.nativeDeviceSettings?.snapshot??null)).filter(e=>z(e.searchText,t.text)):[],i=Ce(e.schema)?e.schema:null;if(!i||ne(i)!==`object`||!i.properties)return r;let a=W.get(i);(!a||a.hints!==e.uiHints)&&(a={hints:e.uiHints,sections:new Map},W.set(i,a));let o=e.value??{};for(let[t,s]of Object.entries(i.properties)){let i=de(t);if(!c(i,e.canAdmin!==!1,e.nativeDeviceSettings))continue;let l=a.sections.get(t);if(!l){let n=t===`wizard`?Ke(s):Ze(i,s);l={schema:n,tiers:ze({schema:n,path:[t],hints:e.uiHints})},a.sections.set(t,l)}let{schema:u,tiers:d}=l,f=Be[t],p=n=>!!(n&&We({key:t,schema:n,value:o[t],hints:e.uiHints,query:e.query,label:f?.label,description:f?.description,textMatcher:z})),m=p(d.common),h=p(d.advanced);if(!m&&!h)continue;let g=encodeURIComponent(t),_=`#config-section-${g}`;r.push({routeId:i,label:f?.label??u.title??t,...i===`memory`?{pathname:n(`settings`,e.basePath),...h?{search:`?advanced=1`}:{},hash:_}:i===`plugin-settings`?{search:`?tab=advanced`,hash:`#plugin-settings-advanced`}:{search:`?section=${g}${h||t===`wizard`?`&advanced=1`:``}`,hash:_}})}return r}var H,U,W;function G(){return(G=e((()=>{m(),o(),l(),Re(),He(),Ve(),re(),Pe(),se(),V(),le(),Ge(),Le(),Je(),Ne(),H=Object.values(Ie),U={memory:qe,"plugin-settings":[`enabled`,`allow`,`deny`,`load`,`slots`],updates:[`channel`,`checkOnStart`,`auto`]},W=new WeakMap})))()}function K(e,t){var n=J();return Se(n,`click`,t,!0),w(n,e),n}function q(e){let t=oe(null,{read:_,subscribe:(e,t)=>h(t),equality:Object.is});var n=Y();return w(n,E(pe,{render:()=>I(u.claw,t.read())})),N(()=>[`settings-save-indicator__claw`,`settings-save-indicator__claw--${e.saved?`saved`:`saving`}`],(e,t)=>{we(n,e,t)}),n}function $e(e){let[t,n]=ve(!1,{ownedWrite:!0});be(T(()=>e.props?.status),(e,t)=>{if(t===`saving`&&e===`saved`){n(!0);let e=globalThis.setTimeout(()=>n(!1),it);return()=>globalThis.clearTimeout(e)}e!==`saved`&&n(!1)});let r=T(()=>{let n=e.props;if(n)return n.applying?`applying`:[`saving`,`recovery`,`rejected`,`error`,`paused`,`conflict`].includes(n.status)?n.status:t()?`saved`:n.needsApply?`apply`:void 0}),i=()=>r()===`error`&&e.props?.lastError?.trim()||void 0;return E(P,{get when(){return M(()=>!!e.props)()?r():e.props},get children(){var t=Z();return w(t,E(_e,{get children(){return[E(A,{get when(){return r()===`applying`},get children(){return[(()=>{var e=et();return w(e,E(a,{name:`loader`})),e})(),(()=>{var e=X();return w(e,()=>b(`configView.applying`)),e})()]}}),E(A,{get when(){return r()===`saving`},get children(){return[E(q,{}),(()=>{var e=X();return w(e,()=>b(`configView.autoSaveSaving`)),e})()]}}),E(A,{get when(){return r()===`recovery`},get children(){return[(()=>{var t=X();return w(t,()=>e.props.lastError),t})(),M(()=>K(b(`configView.recoveryReload`),()=>e.props.onReload()))]}}),E(A,{get when(){return r()===`rejected`},get children(){return[(()=>{var e=X();return w(e,()=>b(`configView.autoSaveRejected`)),e})(),(()=>{var e=X();return w(e,()=>b(`configView.autoSaveRejectedHint`)),e})(),E(P,{get when(){return e.props.lastError},get children(){var t=tt(),n=t.firstChild,r=n.nextSibling;return w(n,()=>b(`configView.rejectionDetails`)),w(r,()=>e.props.lastError),t}}),M(()=>K(b(`configView.retry`),()=>e.props.onRetry())),M(()=>K(b(`configView.recoveryReload`),()=>e.props.onReload()))]}}),E(A,{get when(){return r()===`error`},get children(){return[(()=>{var e=X();return w(e,()=>b(`configView.autoSaveFailed`)),e})(),M(()=>K(b(`configView.retry`),()=>e.props.onRetry()))]}}),E(A,{get when(){return r()===`paused`},get children(){return[(()=>{var e=X();return w(e,()=>b(`configView.autoSavePaused`)),e})(),M(()=>K(b(`configView.saveNow`),()=>e.props.onSave()))]}}),E(A,{get when(){return r()===`conflict`},get children(){return[(()=>{var e=X();return w(e,()=>b(`configView.autoSaveConflict`)),e})(),M(()=>K(b(`common.reload`),()=>e.props.onReload()))]}}),E(A,{get when(){return r()===`saved`},get children(){return[E(q,{saved:!0}),(()=>{var e=nt();return w(e,E(a,{name:`check`})),e})(),(()=>{var e=X();return w(e,()=>b(`configView.autoSaveSaved`)),e})()]}}),E(A,{get when(){return r()===`apply`},get children(){var t=rt();return t._$$click=()=>e.props.onApply(),w(t,()=>b(`configView.applyChanges`)),N(()=>e.props.applyDisabled,e=>{k(t,`disabled`,e)}),t}})]}})),N(()=>({e:!![`recovery`,`error`,`conflict`].includes(r()??``),t:r()===`recovery`,a:r()===`rejected`,o:r()===`saved`,i:i(),n:i()?`${b(`configView.autoSaveFailed`)}: ${i()}`:void 0}),({e,t:n,a:r,o:i,i:a,n:o},s)=>{e!==s?.e&&t.classList.toggle(`settings-save-indicator--danger`,e),n!==s?.t&&t.classList.toggle(`settings-save-indicator--recovery`,n),r!==s?.a&&t.classList.toggle(`settings-save-indicator--rejected`,r),i!==s?.o&&t.classList.toggle(`settings-save-indicator--saved`,i),a!==s?.i&&k(t,`title`,a),o!==s?.n&&k(t,`aria-label`,o)}),t}})}var J,Y,et,X,tt,nt,rt,Z,it;function at(){return(at=e((()=>{ye(),xe(),l(),ae(),ie(),ue(),v(),t(),F(),J=O(`<button class="btn btn--xs settings-save-indicator__action"type=button>`),Y=O(`<span aria-hidden=true>`),et=O(`<span class=settings-save-indicator__spinner aria-hidden=true>`),X=O(`<span>`),tt=O(`<details><summary></summary><span>`),nt=O(`<span class=settings-save-indicator__check aria-hidden=true>`),rt=O(`<button class="btn btn--xs settings-save-indicator__apply"type=button>`),Z=O(`<div class=settings-save-indicator role=status aria-live=polite>`),it=2e3,me(`openclaw-settings-save-indicator`,e=>E($e,{get props(){return e.props}}),{properties:{props:{default:void 0,attribute:!1}}}),Te([`click`])})))()}function ot(e,t){if(t.pathname)return!1;let n=D(t.label);return[B(e),p(e)].some(e=>D(e)===n)}function st(e,t,n,r){let i=f(n,r),a=t.filter(e=>c(e.routeId,n,r)),o=D(e);if(!o)return i.map(e=>({labelKey:e.labelKey,items:e.routes.map(e=>({routeId:e,blocks:[]}))}));let s=i.flatMap(e=>e.routes),l=[...new Set([...s,...d.filter(e=>c(e,n,r)),...a.map(e=>e.routeId)])],u=l.filter(e=>[B(e),p(e),g(e)].some(e=>z(e,o))),m=new Set(u),h=i.flatMap(e=>e.labelKey&&z(x(e.labelKey),o)?e.routes.filter(e=>!m.has(e)&&(m.add(e),!0)):[]),_=new Map,v=new Set;for(let e of a){let t=`${e.routeId}\u0000${e.pathname??``}\u0000${e.search??``}\u0000${e.hash}`;if(v.has(t))continue;v.add(t);let n=_.get(e.routeId)??[];n.push(e),_.set(e.routeId,n)}return[{labelKey:null,items:[...u,...h].map(e=>({routeId:e,blocks:(_.get(e)??[]).filter(t=>!ot(e,t))}))},...l.filter(e=>!m.has(e)&&_.has(e)).map(e=>({labelKey:null,items:[{routeId:e,blocks:_.get(e)??[]}]}))].filter(e=>e.items.length>0)}function ct(e,t){let n=Fe(e.activeRouteId)===t;return C`
    <a
      href=${s(t,e.basePath)}
      class="settings-sidebar__item ${n?`settings-sidebar__item--active`:``}"
      aria-current=${n?`page`:S}
      @focus=${r=>L(e.preloadTimers,t,r,e.onPreload,n)}
      @blur=${t=>R(e.preloadTimers,t)}
      @pointerenter=${r=>L(e.preloadTimers,t,r,e.onPreload,n)}
      @pointerleave=${t=>R(e.preloadTimers,t)}
      @touchstart=${{handleEvent:r=>L(e.preloadTimers,t,r,e.onPreload,n,!0),passive:!0}}
      @click=${n=>{y(n)&&(n.preventDefault(),e.onNavigate(t))}}
    >
      <span class="settings-sidebar__item-icon" aria-hidden="true"
        >${t===`custodian`?I():u[ee(t)]}</span
      >
      <span class="settings-sidebar__item-label"
        >${B(t,e.nativeDeviceSettings?.snapshot)}</span
      >
      ${e.presentation===`embed-list`?C`<span class="settings-row__chevron" aria-hidden="true">${u.chevronRight}</span>`:S}
    </a>
  `}function lt(e,t){let n=(t.pathname??s(t.routeId,e.basePath))+(t.search??``)+t.hash,r=e.activeRouteId===t.routeId&&(t.pathname===void 0||e.activePathname===t.pathname)&&e.activeHash===t.hash&&(t.search===void 0||e.activeSearch===t.search);return C`
    <a
      href=${n}
      class="settings-sidebar__subitem ${r?`settings-sidebar__subitem--active`:``}"
      aria-current=${r?`location`:S}
      @click=${n=>{y(n)&&(n.preventDefault(),e.onNavigate(t.routeId,{...t.pathname?{pathname:t.pathname}:{},...t.search?{search:t.search}:{},hash:t.hash}))}}
    >
      <span class="settings-sidebar__subitem-label">${t.label}</span>
    </a>
  `}function ut(e){e.closest(`.settings-sidebar`)?.querySelector(`.settings-sidebar__search`)?.classList.toggle(`settings-sidebar__search--scrolled`,e.scrollTop>0)}function dt(e){let t=new Map(e.map(e=>[e.id,e])),n=new Map,r=[];for(let i of e){let e=i.creatorAgentId;if(e&&e!==i.id&&t.has(e)){let t=n.get(e)??[];t.push(i),n.set(e,t)}else r.push(i)}let i=[],a=new Set,o=(e,t)=>{if(!a.has(e.id)){a.add(e.id),i.push({agent:e,...t>0&&e.creatorAgentId?{creatorAgentId:e.creatorAgentId}:{}});for(let r of n.get(e.id)??[])o(r,t+1)}};return r.forEach(e=>o(e,0)),e.forEach(e=>o(e,0)),i}function Q(e){let t=he(e.agents).map(e=>Object.assign({},e,{id:j(e.id),creatorAgentId:e.creatorAgentId?j(e.creatorAgentId):e.creatorAgentId})),n=dt(t).map(({agent:e,creatorAgentId:t})=>({value:e.id,label:te(e),agent:e,description:t?x(`agents.createdBy`,{id:t}):void 0}));return C`<div class="settings-sidebar__agent">
    <openclaw-agent-select
      .options=${n}
      .identityById=${Object.fromEntries(e.agentIdentity.entries().map(e=>[e.agentId,e]))}
      .value=${e.settingsAgentSelection.state.selectedId??``}
      .accessibleLabel=${x(`agentScope.label`)}
      .menuLabel=${x(`agentScope.label`)}
      .disabled=${n.length<=1}
      .onSelect=${t=>e.settingsAgentSelection.set(t)}
      @wa-show=${()=>void e.agentIdentity.ensure(t.map(e=>e.id))}
    ></openclaw-agent-select>
  </div>`}function ft(e){return e.connectionStatus===null?C`<openclaw-settings-save-indicator
        .props=${e.saveIndicator}
      ></openclaw-settings-save-indicator>`:De({kind:e.connectionStatus,lastError:e.lastError,onRetry:e.onRetryConnect})}function pt(e){return C`<header class="native-embed-header">
    ${e.presentation===`embed-page`?C`<button
            class="native-embed-header__back btn btn--ghost"
            type="button"
            aria-label=${x(`common.back`)}
            @click=${e.onExit}
          >
            <span aria-hidden="true">${u.chevronLeft}</span>${x(`common.back`)}
          </button>`:S}
    <h1 class="page-title">
      ${e.presentation===`embed-list`?x(`nav.settings`):B(e.activeRouteId,e.nativeDeviceSettings?.snapshot)}
    </h1>
    ${ft(e)}
  </header>`}function mt(e){if(e.presentation===`embed-page`)return C`${pt(e)} ${Q(e)}`;let t=e.searchBlockMatches??(e.searchParams?Qe(e.searchParams):[]),n=st(e.searchQuery,t,e.canAdmin!==!1,e.nativeDeviceSettings??null),i=C` <nav
    class="settings-sidebar__nav"
    aria-label=${x(`common.settingsSections`)}
    @scroll=${e=>ut(e.currentTarget)}
  >
    ${n.length===0?C`<p class="settings-sidebar__empty" role="status">
            ${x(`nav.settingsSearchNoResults`)}
          </p>`:n.map(t=>C`
              <div class="settings-sidebar__group">
                ${t.labelKey?C`<div class="settings-sidebar__group-label">${x(t.labelKey)}</div>`:S}
                ${t.items.map(t=>C`
                    ${ct(e,t.routeId)}
                    ${t.blocks.map(t=>lt(e,t))}
                  `)}
              </div>
            `)}
  </nav>`;return e.presentation===`embed-list`?C`<section class="settings-embed-list">
      ${pt(e)} ${Q(e)} ${i}
    </section>`:C`
    <aside class="settings-sidebar">
      <header class="settings-sidebar__header" @mousedown=${r}>
        <button type="button" class="settings-sidebar__back" @click=${()=>e.onExit()}>
          <span class="settings-sidebar__back-icon" aria-hidden="true">${u.arrowLeft}</span>
          ${x(`nav.exitSettings`)}
          ${ke(`esc`,{className:`settings-sidebar__esc`,ariaHidden:!0})}
        </button>
        <h1 class="settings-sidebar__title">${x(`nav.settings`)}</h1>
      </header>
      ${Q(e)}
      <div class="settings-sidebar__search" role="search">
        <span class="settings-sidebar__search-icon" aria-hidden="true">${u.search}</span>
        <input
          class="settings-sidebar__search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          aria-label=${x(`nav.settingsSearchLabel`)}
          placeholder=${x(`nav.settingsSearchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchQueryChange(t.currentTarget.value)}
          @keydown=${t=>{if(!(t.key!==`Escape`||je(t))){if(t.preventDefault(),e.searchQuery){e.onSearchQueryChange(``);return}e.onExit()}}}
        />
        ${e.searchQuery?C`
                <button
                  type="button"
                  class="settings-sidebar__search-clear"
                  aria-label=${x(`nav.settingsSearchClear`)}
                  @click=${t=>{let n=t.currentTarget.parentElement?.querySelector(`input`);e.onSearchQueryChange(``),n?.focus()}}
                >
                  ${u.x}
                </button>
              `:S}
      </div>
      ${i}
      <footer class="settings-sidebar__footer">
        ${ft(e)}
        <openclaw-sidebar-build-chip
          .basePath=${e.basePath}
          .gatewayVersion=${e.gatewayVersion||null}
          .variant=${`settings`}
          .onNavigate=${()=>e.onNavigate(`about`)}
        ></openclaw-sidebar-build-chip>
      </footer>
    </aside>
  `}function $(){return($=e((()=>{ge(),m(),o(),i(),re(),ce(),Me(),fe(),V(),G(),Ee(),v(),Oe(),F(),Ae(),at(),Ye()})))()}$();export{mt as renderSettingsSidebar};
//# sourceMappingURL=settings-sidebar-DwJdsPR-.js.map