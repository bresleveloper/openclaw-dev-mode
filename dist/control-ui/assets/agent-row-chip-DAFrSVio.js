import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Bju0LxrM.js";import{Dc as i,Ll as a,Pc as o,Yc as s,jl as c,kc as l,kl as u,nc as d,tc as f,ul as p,zl as m}from"./control-ui-core-DX6662ze.js";import{$ as h,Y as g,nt as _,ut as v}from"./lit-runtime-BOUQsi_O.js";import{Di as y,Oi as b}from"./control-ui-core-QgEwr0pF.js";import{ns as x,rs as S}from"./control-ui-boot-shared-gJH8zZtq.js";import{La as C,za as w}from"./control-ui-boot-shared-SOjXo6bG.js";function T(e){return h`<openclaw-agent-row-chip .agentId=${e}></openclaw-agent-row-chip>`}var E;function D(){return(D=e((()=>{t(),g(),_(),b(),i(),u(),S(),s(),m(),d(),C(),E=class extends a{constructor(){super(),this.avatars=new x(this),new f(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}render(){let e=this.context?.agents.state.agentsList,t=this.agentId?.trim()||p({agentsList:e,hello:this.context?.gateway.snapshot.hello}),n=e?.agents.find(e=>e.id===t)??{id:t},r=this.context?.agentIdentity.get(t),i=l(n,r),a=i===t?`agent:${t}`:`${i} (agent:${t})`,s=c(n,r);return this.avatars.withActiveRoutes(()=>{let e=s?this.avatars.resolve(s):null;return h`<span
        class="agent-row-chip"
        data-agent-id=${t}
        role="img"
        aria-label=${a}
        title=${a}
      >
        ${w({id:t,avatar:e,textAvatar:o(n,r)},`agent-row-chip__avatar`)}
        <span class="agent-row-chip__name">${i}</span>
      </span>`})}},r([n({context:y,subscribe:!0}),v({attribute:!1})],E.prototype,`context`,void 0),r([v({attribute:!1})],E.prototype,`agentId`,void 0),customElements.get(`openclaw-agent-row-chip`)||customElements.define(`openclaw-agent-row-chip`,E)})))()}export{T as n,D as t};
//# sourceMappingURL=agent-row-chip-DAFrSVio.js.map