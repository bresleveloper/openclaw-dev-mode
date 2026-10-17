import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,ju as n}from"./control-ui-core-CTSdBcaH.js";import{La as r,Ra as i,ir as a,rr as o,wa as s}from"./control-ui-core-vFnxmx94.js";import{$ as c,X as l,Y as u}from"./lit-runtime-TNZj1e-P.js";import{I as d,R as f,m as p,p as m}from"./control-ui-boot-shared-DeF_v3ER.js";import{dr as h,fr as g}from"./control-ui-boot-chat-CHJjvSiu.js";function _(){return(_=e((()=>{})))()}function v(e){return p({id:`plugins`,active:e.active,tabs:[{value:`plugins`,label:n(`tabs.plugins`)},{value:`skills`,label:n(`tabs.skills`)},{value:`skill-workshop`,label:n(`tabs.skillWorkshop`)}],ariaLabel:n(`pluginsPage.hubTablistLabel`),panelId:y,className:`plugins-tabs`,onSelect:e.onSelect})}var y;function b(){return(b=e((()=>{m(),t(),h(),g(),y=`plugins-hub-panel`})))()}function x(e){return c`
    <section
      class="content-header content-header--stacked content-header--settings content-header--page hub-page-header plugins-hub-header"
      ${a({hubHeader:!0})}
    >
      <div class="hub-page-header__title">
        <h1 class="page-title">${i(e.active)}</h1>
        <div class="page-subtitle">
          ${r(e.active)} ${f(S[e.active])}
        </div>
      </div>
      <div class="hub-page-header__tabs">
        ${v({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">
        ${e.secondaryAction?c`<button
                type="button"
                class="btn btn--sm ${e.secondaryAction.icon?`btn--icon`:``} plugins-hub-header__secondary oc-action oc-action-secondary"
                aria-label=${e.secondaryAction.label}
                title=${e.secondaryAction.icon?e.secondaryAction.label:l}
                @click=${e.secondaryAction.onClick}
              >
                ${e.secondaryAction.icon??e.secondaryAction.label}
              </button>`:l}
      </div>
    </section>
  `}var S;function C(){return(C=e((()=>{u(),s(),o(),d(),b(),S={plugins:`https://docs.openclaw.ai/plugins/manage-plugins`,skills:`https://docs.openclaw.ai/tools/skills`,"skill-workshop":`https://docs.openclaw.ai/tools/skill-workshop`}})))()}export{_ as a,b as i,x as n,y as r,C as t};
//# sourceMappingURL=plugins-hub-header-BQcIUSVM.js.map