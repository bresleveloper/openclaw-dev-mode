import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n,_n as r,fn as i,hi as a}from"./control-ui-core-BfjCgLp6.js";import{$ as o,X as s,Y as c,c as l,s as u}from"./lit-runtime-L6OV30Vo.js";import{Oa as d,Qa as f,ba as p,do as m,fo as h}from"./control-ui-core-qT0XjEdV.js";import{c as g,s as _}from"./gateway-runtime-BQX_hMWC.js";import{Ct as v,La as y,pt as b,za as x}from"./control-ui-boot-shared-Bm2ZxasE.js";import{a as S,n as C,o as w,t as T}from"./roster-element-Cp14u1zu.js";function E(e){let{context:t}=e,r=(e,n,r)=>{a(e)&&(e.preventDefault(),t.navigate(n,r))},c=o`<a
    class="btn"
    href=${d(`agents`,t.basePath)}
    @click=${e=>r(e,`agents`)}
    >${n(`agentsHome.manage`)}</a
  >`;return o` <div class="agents-home__header">
      ${v({title:h(`agents-home`),subtitle:m(`agents-home`),actions:o`${c}
          <a
            class="btn primary"
            href=${e.canCreate?`${d(`custodian`,t.basePath)}?intent=new-agent`:d(`agents`,t.basePath)}
            @click=${t=>r(t,e.canCreate?`custodian`:`agents`,e.canCreate?{search:`?intent=new-agent`}:void 0)}
            >${n(`agentsHome.create`)}</a
          >`})}
    </div>
    <section class="agents-home" aria-label=${h(`agents-home`)}>
      ${e.connected?s:o`<div class="callout warn" role="status">${n(`agentsHome.disconnected`)}</div>`}
      ${e.connected&&e.error?o`<div class="callout danger" role="alert">
              ${e.error}
              <button class="btn btn--sm" @click=${e.onRetry}>${n(`common.retry`)}</button>
            </div>`:s}
      ${e.connected&&e.loading&&e.cards.length===0?o` <div
              role="status"
              aria-label=${n(`agentsHome.loading`)}
              class="agents-home__grid"
            >
              ${[0,1,2,3].map(()=>o`<div class="agents-home__skeleton" aria-hidden="true"></div>`)}
            </div>`:s}
      ${e.connected&&!e.loading&&!e.error&&e.cards.length===0?o` <div class="agents-home__empty">
              <p>${n(`agentsHome.empty`)}</p>
              ${c}
            </div>`:s}
      <div class="agents-home__grid">
        ${l(e.cards,e=>e.id,e=>o` <a
            class="agents-home__card"
            data-agent-id=${e.id}
            href=${e.target.href}
            @click=${t=>r(t,`chat`,e.target.options)}
          >
            <div class="agents-home__identity">
              <div class="agents-home__avatar" aria-hidden="true">
                ${x(e)}
              </div>
              <div class="agents-home__name">
                <h2>${e.name}</h2>
                ${e.role?o`<p>${e.role}</p>`:s}
              </div>
            </div>
            ${e.model?o`<span class="agents-home__model" title=${e.model}>${e.model}</span>`:s}
            <div class="agents-home__activity">
              ${e.activeNow?o`<span class="agents-home__working">${n(`agentsHome.working`)}</span>`:e.lastActiveAt?n(`agentsHome.lastActive`,{time:i(e.lastActiveAt)}):n(`agentsHome.neverActive`)}
            </div>
            <p class="agents-home__preview" title=${e.preview??``}>
              ${e.preview||n(`agentsHome.noMessage`)}
            </p>
            <span class="btn primary agents-home__open">${n(`agentsHome.openChat`)}</span>
          </a>`)}
      </div>
    </section>`}function D(){return(D=e((()=>{c(),u(),f(),p(),y(),b(),t(),S(),r(),w()})))()}var O,k,A;function j(){return(j=e((()=>{c(),C(),g(),D(),O=class extends T{render(){return this.avatars.withActiveRoutes(()=>E({cards:this.cards().toSorted((e,t)=>Number(t.activeNow)-Number(e.activeNow)||t.lastActiveAt-e.lastActiveAt||Number(t.id===this.context.agents.state.agentsList?.defaultId)-Number(e.id===this.context.agents.state.agentsList?.defaultId)||e.id.localeCompare(t.id)),context:this.context,connected:this.connected,loading:this.roster.loading,error:this.roster.error??this.roster.subscriptionError,onRetry:()=>void this.refresh(),canCreate:_(this.context.gateway.snapshot,`openclaw.chat`,`operator.admin`)}))}},k=!0,A=()=>o`<openclaw-agents-home-page></openclaw-agents-home-page>`,customElements.get(`openclaw-agents-home-page`)||customElements.define(`openclaw-agents-home-page`,O)})))()}j();export{O as AgentsHomePage,k as header,A as render};
//# sourceMappingURL=agents-home-page-DBA5zPXj.js.map