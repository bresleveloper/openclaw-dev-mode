import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,As as n,Cu as r,Eu as i,Kc as a,Sl as o,Tu as s,Yc as c,ju as l,kc as u,ks as d,qc as f}from"./control-ui-core-bJHyI7AF.js";import{Ao as p,Po as m,Ti as h,co as g,mo as _,na as v,ra as y,wi as b}from"./control-ui-core-DNh4McGE.js";import{$ as x,X as S,Y as C,d as w,nt as T,u as E,ut as D}from"./lit-runtime-DyST807n.js";import{Xr as O,Zr as k,ii as A,ro as j}from"./ui-DeikvIdP.js";import{n as M,t as N}from"./panel-empty-state-De_5Bizz.js";import{t as P}from"./terminal-panel-registration-BKnPLjVl.js";function F(e,t=``){let n=p(e,g),r=m(n.pathname,t);if(r)return{sessionId:r};let i=f(n.search);return i?{catalog:i}:null}function I(){return(I=e((()=>{_(),c()})))()}var L;function R(){return(R=e((()=>{k(),C(),T(),E(),h(),y(),N(),P(),i(),c(),o(),d(),s(),t(),I(),L=class extends r{constructor(){super(),this.location=null,new u(this).watchStore(()=>this.context?.gateway).watchStore(()=>this.context?.config).watchStore(()=>this.context?.theme).watchStore(()=>this.context?.agentSelection)}render(){let e=this.context,t=e.gateway.snapshot,r=n(t,e.config.current.terminalEnabled??!1),i=e.agentSelection.state.selectedId??t.assistantAgentId,o=this.location?F(this.location,e.basePath):null,s=o?`sessionId`in o?o.sessionId:a(o.catalog):``;return w(s,x`<openclaw-terminal-panel
          ?hidden=${!r}
          embedded
          fullscreen
          .page=${!0}
          .routeTarget=${o}
          .client=${t.phase===`connected`?t.client:null}
          .available=${r}
          .agentId=${i?j(i):null}
          .basePath=${e.basePath}
          .themeMode=${e.theme.resolvedMode}
        ></openclaw-terminal-panel>
        ${r?S:M({icon:v.terminal,heading:l(`terminal.title`),description:l(`terminal.unavailable`),action:x`<button class="btn" @click=${()=>e.navigate(`new-session`)}>
                  ${l(`newSession.title`)}
                </button>`})}`)}},A([O({context:b,subscribe:!0})],L.prototype,`context`,void 0),A([D({attribute:!1})],L.prototype,`location`,void 0),customElements.define(`openclaw-terminal-page`,L)})))()}R();
//# sourceMappingURL=terminal-page-l3S-9Rmy.js.map