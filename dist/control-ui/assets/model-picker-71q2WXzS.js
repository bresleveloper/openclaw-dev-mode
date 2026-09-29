import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,X as n,Y as r}from"./lit-runtime-DLvISeBM.js";import{Oa as i,Ta as a,Ur as o,Wr as s}from"./control-ui-boot-shared-C5a8_33C.js";function c(e){let r=`__openclaw_custom_model__`,a=new Set([e.value,...e.options.map(e=>e.value)]);for(;a.has(r);)r+=`_`;let o=e.options.some(t=>t.value===e.value),c=[...e.options.map(e=>({...e,description:e.detail})),...e.custom?[{value:r,label:e.custom.label}]:[]];return t`
    <div class="model-picker">
      ${s({id:e.id,label:e.label,value:e.value,options:c,disabled:e.disabled,title:e.title,placement:e.placement,searchable:!0,showOptionTooltips:!1,showSelectedDescription:e.showSelectedDetail,className:`model-picker__select ${e.className??``}`,onOpen:e.onOpen,renderLeading:e=>e.provider?i(e.provider,{className:`model-picker__provider-icon`}):n,onChange:e.onChange,onChangeTarget:(t,n)=>{let i=n.closest(`.model-picker`)?.querySelector(`.model-picker__custom`);if(t===r&&i){i.hidden=!1,queueMicrotask(()=>i.focus());return}i&&(i.hidden=!0),e.onChange(t)}})}
      ${e.custom?t`<input
              id=${e.custom.id??n}
              class="settings-input model-picker__custom"
              aria-label=${e.custom.label}
              aria-invalid=${e.custom.invalid?`true`:`false`}
              aria-describedby=${e.custom.describedBy??n}
              placeholder=${e.custom.placeholder??``}
              .value=${e.value}
              ?hidden=${o}
              ?disabled=${e.disabled}
              @input=${t=>{e.custom?.commit!==`change`&&e.onChange(t.currentTarget.value)}}
              @change=${t=>{e.custom?.commit===`change`&&e.onChange(t.currentTarget.value)}}
            />`:n}
    </div>
  `}function l(){return(l=e((()=>{r(),a(),o()})))()}export{c as n,l as t};
//# sourceMappingURL=model-picker-71q2WXzS.js.map