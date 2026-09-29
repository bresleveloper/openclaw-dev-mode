import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n}from"./control-ui-core-DX6662ze.js";import{$ as r,X as i,Y as a}from"./lit-runtime-BOUQsi_O.js";import{Qa as o,do as s,fo as c}from"./control-ui-core-QgEwr0pF.js";import{Ti as l,wi as u}from"./control-ui-boot-shared-gJH8zZtq.js";import{f as d,ht as f,p,pt as m}from"./control-ui-boot-shared-SOjXo6bG.js";function h(){return(h=e((()=>{})))()}function g(){return[{value:`plugins`,label:n(`tabs.plugins`)},{value:`skills`,label:n(`tabs.skills`)},{value:`skill-workshop`,label:n(`tabs.skillWorkshop`)}]}function _(e){return p({id:`plugins`,active:e.active,tabs:g(),ariaLabel:n(`pluginsPage.hubTablistLabel`),panelId:v,className:`plugins-tabs`,onSelect:e.onSelect})}var v;function y(){return(y=e((()=>{d(),t(),u(),l(),v=`plugins-hub-panel`})))()}function b(e){let t=x[e.active];return r`
    <section
      class="content-header content-header--stacked content-header--settings content-header--page hub-page-header plugins-hub-header"
    >
      <div class="hub-page-header__title">
        <h1 class="page-title">${c(t.route)}</h1>
        <div class="page-subtitle">
          ${s(t.route)} ${f(t.docsUrl)}
        </div>
      </div>
      <div class="hub-page-header__tabs">
        ${_({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">
        ${e.secondaryAction?r`<button
                type="button"
                class="btn btn--sm ${e.secondaryAction.icon?`btn--icon`:``} plugins-hub-header__secondary oc-action oc-action-secondary"
                aria-label=${e.secondaryAction.label}
                title=${e.secondaryAction.icon?e.secondaryAction.label:i}
                @click=${e.secondaryAction.onClick}
              >
                ${e.secondaryAction.icon??e.secondaryAction.label}
              </button>`:i}
      </div>
    </section>
  `}var x;function S(){return(S=e((()=>{a(),o(),m(),y(),x={plugins:{route:`plugins`,docsUrl:`https://docs.openclaw.ai/plugins/manage-plugins`},skills:{route:`skills`,docsUrl:`https://docs.openclaw.ai/tools/skills`},"skill-workshop":{route:`skill-workshop`,docsUrl:`https://docs.openclaw.ai/tools/skill-workshop`}}})))()}export{h as a,y as i,b as n,v as r,S as t};
//# sourceMappingURL=plugins-hub-header-HrHlTkC7.js.map