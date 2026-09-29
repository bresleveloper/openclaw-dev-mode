import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Na as t,Qr as n,Zr as r,ai as i}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as a,Ll as o,Xl as s,Yc as c,_c as l,bc as u,li as d,nc as f,tc as p,ui as m,vc as h,zl as g}from"./control-ui-core-DkXlmHxW.js";import{$ as _,X as v,Y as y,b,nt as x,ut as S,x as C}from"./lit-runtime-DLvISeBM.js";import{Ba as w,Di as T,Fi as E,Ia as D,Ii as O,Oi as k,ba as A,ma as j}from"./control-ui-core-BdNTI4B-.js";import{B as M,z as N}from"./control-ui-boot-shared-C5a8_33C.js";import{t as P}from"./terminal-panel-registration-DKY8o8EN.js";function F(e,t=``){let n=D(e,j),r=w(n.pathname,t);if(r)return{sessionId:r};let i=h(n.search);return i?{catalog:i}:null}function I(){return(I=e((()=>{A(),u()})))()}var L;function R(){return(R=e((()=>{n(),y(),x(),b(),k(),O(),N(),P(),a(),u(),c(),d(),g(),f(),I(),L=class extends o{constructor(){super(),this.location=null,new p(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t))}render(){let e=this.context,n=e.gateway.snapshot,r=m(n,e.config.current.terminalEnabled??!1),i=e.agentSelection.state.selectedId??n.assistantAgentId,a=this.location?F(this.location,e.basePath):null,o=a?`sessionId`in a?a.sessionId:l(a.catalog):``;return C(o,_`<openclaw-terminal-panel
          ?hidden=${!r}
          embedded
          fullscreen
          .page=${!0}
          .routeTarget=${a}
          .client=${n.phase===`connected`?n.client:null}
          .available=${r}
          .agentId=${i?t(i):null}
          .basePath=${e.basePath}
          .themeMode=${e.theme.resolvedMode}
        ></openclaw-terminal-panel>
        ${r?v:M({icon:E.terminal,heading:s(`terminal.title`),description:s(`terminal.unavailable`),action:_`<button class="btn" @click=${()=>e.navigate(`new-session`)}>
                  ${s(`newSession.title`)}
                </button>`})}`)}},i([r({context:T,subscribe:!0})],L.prototype,`context`,void 0),i([S({attribute:!1})],L.prototype,`location`,void 0),customElements.define(`openclaw-terminal-page`,L)})))()}R();
//# sourceMappingURL=terminal-page-iWIpSqyc.js.map