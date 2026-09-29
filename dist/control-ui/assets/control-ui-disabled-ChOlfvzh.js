import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n,hi as r}from"./control-ui-core-DX6662ze.js";import{$ as i,Y as a}from"./lit-runtime-BOUQsi_O.js";import{Oa as o,ba as s}from"./control-ui-core-QgEwr0pF.js";function c(e,t,a){if(e?.plugins?.errors.some(e=>e.pluginId===t&&e.code===`custom-plugin-ui-disabled`))return i`<div class="card-title">${n(`pluginUi.customPluginsDisabled`)}</div>
    <p class="card-sub">${n(`pluginUi.customPluginsEnableHint`)}</p>
    <a
      class="btn btn--sm"
      href=${o(`labs`,e.basePath)}
      @click=${t=>{r(t)&&(t.preventDefault(),a?.(),e.navigate(`labs`))}}
      >${n(`pluginUi.openLabs`)}</a
    >`}function l(){return(l=e((()=>{a(),s(),t()})))()}export{c as n,l as t};
//# sourceMappingURL=control-ui-disabled-ChOlfvzh.js.map