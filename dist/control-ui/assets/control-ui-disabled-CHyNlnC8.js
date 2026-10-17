import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Fs as n,ju as r}from"./control-ui-core-CTSdBcaH.js";import{So as i,mo as a}from"./control-ui-core-vFnxmx94.js";import{$ as o,Y as s}from"./lit-runtime-TNZj1e-P.js";function c(e,t,a){if(e?.plugins?.errors.some(e=>e.pluginId===t&&e.code===`custom-plugin-ui-disabled`))return o`<div class="card-title">${r(`pluginUi.customPluginsDisabled`)}</div>
    <p class="card-sub">${r(`pluginUi.customPluginsEnableHint`)}</p>
    <a
      class="btn btn--sm"
      href=${i(`labs`,e.basePath)}
      @click=${t=>{n(t)&&(t.preventDefault(),a?.(),e.navigate(`labs`))}}
      >${r(`pluginUi.openLabs`)}</a
    >`}function l(){return(l=e((()=>{s(),a(),t()})))()}export{c as n,l as t};
//# sourceMappingURL=control-ui-disabled-CHyNlnC8.js.map