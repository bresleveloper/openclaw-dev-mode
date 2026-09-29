import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Ll as n,Rl as r,zl as i}from"./control-ui-core-DX6662ze.js";import{$ as a,Y as o,ct as s,mt as c,nt as l,ut as u}from"./lit-runtime-BOUQsi_O.js";import{ct as d,ot as f}from"./control-ui-boot-shared-DIh44kBs.js";import{ea as p,ia as m,na as h,ra as g,ta as _}from"./control-ui-boot-shared-SOjXo6bG.js";import"./control-ui-boot-shared-Do172wng.js";var v,y;function b(){return(b=e((()=>{o(),l(),f(),i(),g(),_(),v=class extends n{constructor(...e){super(...e),this.mode=`grid`,this.customIcon=``}select(e,t){this.props.disabled||this.props.onChange({icon:e,color:t})}showGrid(){this.mode=`grid`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-choice--custom`)?.focus()})}render(){return h({inline:!0,clearable:this.props.clearable,mode:this.mode,currentIcon:this.props.icon,currentColor:this.props.color,disabled:this.props.disabled??!1,colorDisabled:this.props.disabled??!1,customIconValue:this.customIcon,onSelectColor:(e,t)=>this.select(this.props.icon,t),onSelect:(e,t)=>this.select(t,this.props.color),onReset:()=>this.select(null,null),onShowCustom:()=>{this.mode=`custom`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-custom-input`)?.focus()})},onBack:()=>this.showGrid(),onInput:e=>{e.currentTarget instanceof HTMLTextAreaElement&&(this.customIcon=e.currentTarget.value)},onApply:()=>{let e=d(this.customIcon);e&&!this.props.disabled&&(this.select(e,this.props.color),this.showGrid())},onGridKeydown:p})}},t([u({attribute:!1})],v.prototype,`props`,void 0),t([s()],v.prototype,`mode`,void 0),t([s()],v.prototype,`customIcon`,void 0),y=class extends r{static{this.styles=c`
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
  `}render(){let e=this.props.icon?.trim();return a`${e?m(e)??e:this.props.fallback}`}},t([u({attribute:!1})],y.prototype,`props`,void 0),customElements.get(`openclaw-appearance-picker`)||customElements.define(`openclaw-appearance-picker`,v),customElements.get(`openclaw-appearance-glyph`)||customElements.define(`openclaw-appearance-glyph`,y)})))()}b();export{y as AppearanceGlyph,v as AppearancePicker};
//# sourceMappingURL=appearance-picker--NowK3h5.js.map