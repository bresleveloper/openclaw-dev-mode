import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,Y as n,h as r,p as i}from"./lit-runtime-TNZj1e-P.js";import{I as a,q as o}from"./control-ui-boot-shared-DeF_v3ER.js";function s(e){return o({title:e.title,description:e.description,control:t`
      <select
        class="settings-select"
        ?data-settings-send-shortcut=${e.setting===`send-shortcut`}
        ?data-settings-follow-up-mode=${e.setting===`follow-up-mode`}
        ?data-settings-catalog-open-target=${e.setting===`catalog-open-target`}
        aria-label=${e.title}
        ?disabled=${e.disabled??!1}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(n=>t`
            <option value=${n.value} .selected=${r(e.value===n.value)}>
              ${n.label}
            </option>
          `)}
      </select>
    `})}function c(){return(c=e((()=>{n(),i(),a()})))()}export{s as n,c as t};
//# sourceMappingURL=settings-select-row-hUnRzyGv.js.map