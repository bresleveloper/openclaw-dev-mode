import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Tu as n,wu as r}from"./control-ui-core-CTSdBcaH.js";import{$ as i,Y as a,ct as o,mt as s,nt as c,ut as l}from"./lit-runtime-TNZj1e-P.js";import{An as u,On as d}from"./control-ui-boot-shared-DSyxl38Y.js";import{ii as f}from"./ui-CnRtCcYL.js";import{Hr as p,Kr as m,Ur as h,Wr as g,qr as _}from"./control-ui-boot-shared-DeF_v3ER.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";var v,y;function b(){return(b=e((()=>{a(),c(),d(),n(),m(),h(),v=class extends t{constructor(...e){super(...e),this.mode=`grid`,this.customIcon=``}select(e,t){this.props.disabled||this.props.onChange({icon:e,color:t})}showGrid(){this.mode=`grid`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-choice--custom`)?.focus()})}render(){return g({inline:!0,clearable:this.props.clearable,mode:this.mode,currentIcon:this.props.icon,currentColor:this.props.color,disabled:this.props.disabled??!1,colorDisabled:this.props.disabled??!1,customIconValue:this.customIcon,onSelectColor:(e,t)=>this.select(this.props.icon,t),onSelect:(e,t)=>this.select(t,this.props.color),onReset:()=>this.select(null,null),onShowCustom:()=>{this.mode=`custom`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-custom-input`)?.focus()})},onBack:()=>this.showGrid(),onInput:e=>{e.currentTarget instanceof HTMLTextAreaElement&&(this.customIcon=e.currentTarget.value)},onApply:()=>{let e=u(this.customIcon);e&&!this.props.disabled&&(this.select(e,this.props.color),this.showGrid())},onGridKeydown:p})}},f([l({attribute:!1})],v.prototype,`props`,void 0),f([o()],v.prototype,`mode`,void 0),f([o()],v.prototype,`customIcon`,void 0),y=class extends r{static{this.styles=s`
    :host {
      color: var(--appearance-color, inherit);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
    }
    svg,
    img {
      width: 100%;
      height: 100%;
    }
    img {
      object-fit: contain;
    }
  `}render(){let e=this.props.icon?.trim();return i`${e?_(e)??e:this.props.fallback}`}},f([l({attribute:!1})],y.prototype,`props`,void 0),customElements.get(`openclaw-appearance-picker`)||customElements.define(`openclaw-appearance-picker`,v),customElements.get(`openclaw-appearance-glyph`)||customElements.define(`openclaw-appearance-glyph`,y)})))()}b();export{y as AppearanceGlyph,v as AppearancePicker};
//# sourceMappingURL=appearance-picker-CMeVNUeK.js.map