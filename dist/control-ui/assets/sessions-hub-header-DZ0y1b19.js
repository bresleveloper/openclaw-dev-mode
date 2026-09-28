import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n}from"./control-ui-core-BfjCgLp6.js";import{$ as r,X as i,Y as a}from"./lit-runtime-L6OV30Vo.js";import{f as o,p as s}from"./control-ui-boot-shared-Bm2ZxasE.js";function c(){return[{value:`sessions`,label:n(`tabs.sessions`)},{value:`worktrees`,label:n(`tabs.worktrees`)}]}function l(e){return s({id:`sessions`,active:e.active,tabs:c(),ariaLabel:n(`sessionsPage.hubTablistLabel`),panelId:`sessions-hub-panel`,onSelect:e.onSelect})}function u(){return(u=e((()=>{t(),o()})))()}function d(e){return r`
    <section
      class="content-header content-header--settings content-header--page hub-page-header sessions-hub-header"
    >
      <div class="hub-page-header__title">
        <div class="page-title">${e.title}</div>
        ${e.subtitle?r`<div class="page-subtitle">${e.subtitle}</div>`:i}
      </div>
      <div class="hub-page-header__tabs">
        ${l({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">${e.actions??i}</div>
    </section>
  `}function f(){return(f=e((()=>{a(),u()})))()}export{d as n,f as t};
//# sourceMappingURL=sessions-hub-header-DZ0y1b19.js.map