import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Il as n,zl as r}from"./control-ui-core-DX6662ze.js";import{$ as i,X as a,Y as o,ct as s,nt as c,ut as l}from"./lit-runtime-BOUQsi_O.js";import{C as u,S as d}from"./control-ui-boot-shared-gJH8zZtq.js";var f;function p(){return(p=e((()=>{o(),c(),u(),r(),f=class extends n{constructor(...e){super(...e),this.routeUrl=null,this.authTokens=[],this.authReady=!1,this.fallback=a,this.undecodableRouteUrl=null,this.loader=new d(this,{cacheNotFound:!0})}render(){return this.loader.withActiveRoutes(()=>this.renderContent())}renderContent(){let e=this.routeUrl,t=e&&this.authReady&&this.undecodableRouteUrl!==e?this.loader.resolve(e,this.authTokens):null;return t?i`<img
      class="channel-avatar"
      src=${t}
      alt=""
      aria-hidden="true"
      decoding="async"
      @error=${()=>{this.undecodableRouteUrl=e}}
    />`:this.fallback}},t([l({attribute:!1})],f.prototype,`routeUrl`,void 0),t([l({attribute:!1})],f.prototype,`authTokens`,void 0),t([l({attribute:!1})],f.prototype,`authReady`,void 0),t([l({attribute:!1})],f.prototype,`fallback`,void 0),t([s()],f.prototype,`undecodableRouteUrl`,void 0),customElements.get(`openclaw-channel-avatar`)||customElements.define(`openclaw-channel-avatar`,f)})))()}p();
//# sourceMappingURL=channel-avatar-BqTUwVP_.js.map