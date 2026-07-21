import{g as e,h as t}from"./lit-runtime-B2f-BITn.js";import{r as n}from"./i18n-Cb2Gon67.js";import{o as r,r as i}from"./app-route-paths-Ckh-KQjG.js";import{Ar as a,Mr as o,Or as s,Pr as c,Tr as l,jr as u,kr as d}from"./index-zot7ymVq.js";var f=new Map;function p(p,m,h,g){if(!a(m))return t;let _=s.filter(i);return e`
    <nav class="settings-section-nav" aria-label=${n(`common.settingsSections`)}>
      ${_.map(t=>{let n=m===t;return e`
          <a
            href=${r(t,p)}
            class="settings-section-nav__item ${n?`settings-section-nav__item--active`:``}"
            @focus=${e=>o(f,t,e,g,n)}
            @blur=${e=>d(f,e)}
            @pointerenter=${e=>o(f,t,e,g,n)}
            @pointerleave=${e=>d(f,e)}
            @touchstart=${e=>o(f,t,e,g,n,!0)}
            @click=${e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),h(t))}}
          >
            <span class="settings-section-nav__icon" aria-hidden="true"
              >${l[u(t)]}</span
            >
            <span class="settings-section-nav__label">${c(t)}</span>
          </a>
        `})}
    </nav>
  `}function m(t,n,r,i,a,o={}){return e`
    <section class=${o.fillHeight?`settings-workspace settings-workspace--fill-height`:`settings-workspace`}>
      ${p(t,r,i,a)}
      <div class="settings-workspace__body">${n}</div>
    </section>
  `}export{m as t};
//# sourceMappingURL=settings-workspace-jCRJwEX0.js.map