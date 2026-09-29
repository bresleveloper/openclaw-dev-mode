import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,Y as n}from"./lit-runtime-DLvISeBM.js";import{pt as r,wt as i}from"./control-ui-boot-shared-C5a8_33C.js";function a(e){return i({title:e.title,description:e.description,control:t`
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
            <option value=${n.value} ?selected=${e.value===n.value}>
              ${n.label}
            </option>
          `)}
      </select>
    `})}function o(){return(o=e((()=>{n(),r()})))()}export{a as n,o as t};
//# sourceMappingURL=settings-select-row-DpouUl2-.js.map