import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Fs as n,W as r,ju as i,z as a}from"./control-ui-core-bJHyI7AF.js";import{La as o,Ra as s,So as c,mo as l,wa as u}from"./control-ui-core-DNh4McGE.js";import{$ as d,X as f,Y as p,a as m,i as h}from"./lit-runtime-DyST807n.js";import{c as g,l as _}from"./gateway-runtime-FZ6mX2RY.js";import{Ci as v,I as y,K as b,Ti as x}from"./control-ui-boot-shared-C9uJ732w.js";import{a as S,n as C,o as w,t as T}from"./roster-element-CuA9TKIY.js";function E(e){let{context:t}=e,r=(e,r,i)=>{n(e)&&(e.preventDefault(),t.navigate(r,i))},l=d`<a
    class="btn"
    href=${c(`agents`,t.basePath)}
    @click=${e=>r(e,`agents`)}
    >${i(`agentsHome.manage`)}</a
  >`;return d` <div class="agents-home__header">
      ${b({title:s(`agents-home`),subtitle:o(`agents-home`),actions:d`${l}
          <a
            class="btn primary"
            href=${e.canCreate?`${c(`custodian`,t.basePath)}?intent=new-agent`:c(`agents`,t.basePath)}
            @click=${t=>r(t,e.canCreate?`custodian`:`agents`,e.canCreate?{search:`?intent=new-agent`}:void 0)}
            >${i(`agentsHome.create`)}</a
          >`})}
    </div>
    <section class="agents-home" aria-label=${s(`agents-home`)}>
      ${e.connected?f:d`<div class="callout warn" role="status">${i(`agentsHome.disconnected`)}</div>`}
      ${e.connected&&e.error?d`<div class="callout danger" role="alert">
              ${e.error}
              <button class="btn btn--sm" @click=${e.onRetry}>${i(`common.retry`)}</button>
            </div>`:f}
      ${e.connected&&e.loading&&e.cards.length===0?d` <div
              role="status"
              aria-label=${i(`agentsHome.loading`)}
              class="agents-home__grid"
            >
              ${[0,1,2,3].map(()=>d`<div class="agents-home__skeleton" aria-hidden="true"></div>`)}
            </div>`:f}
      ${e.connected&&!e.loading&&!e.error&&e.cards.length===0?d` <div class="agents-home__empty">
              <p>${i(`agentsHome.empty`)}</p>
              ${l}
            </div>`:f}
      <div class="agents-home__grid">
        ${m(e.cards,e=>e.id,e=>d` <a
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
                ${e.role?d`<p>${e.role}</p>`:f}
              </div>
            </div>
            ${e.model?d`<span class="agents-home__model" title=${e.model}>${e.model}</span>`:f}
            <div class="agents-home__activity">
              ${e.activeNow?d`<span class="agents-home__working">${i(`agentsHome.working`)}</span>`:e.lastActiveAt?i(`agentsHome.lastActive`,{time:a(e.lastActiveAt)}):i(`agentsHome.neverActive`)}
            </div>
            <p class="agents-home__preview" title=${e.preview??``}>
              ${e.preview||i(`agentsHome.noMessage`)}
            </p>
            <span class="btn primary agents-home__open">${i(`agentsHome.openChat`)}</span>
          </a>`)}
      </div>
    </section>`}function D(){return(D=e((()=>{p(),h(),u(),l(),v(),y(),t(),S(),r(),w()})))()}var O,k,A;function j(){return(j=e((()=>{p(),C(),_(),D(),O=class extends T{render(){return this.avatars.withActiveRoutes(()=>E({cards:this.cards().toSorted((e,t)=>Number(t.activeNow)-Number(e.activeNow)||t.lastActiveAt-e.lastActiveAt||Number(t.id===this.context.agents.state.agentsList?.defaultId)-Number(e.id===this.context.agents.state.agentsList?.defaultId)||e.id.localeCompare(t.id)),context:this.context,connected:this.connected,loading:this.roster.loading,error:this.roster.error??this.roster.subscriptionError,onRetry:()=>void this.refresh(),canCreate:g(this.context.gateway.snapshot,`openclaw.chat`,`operator.admin`)}))}},k=!0,A=()=>d`<openclaw-agents-home-page></openclaw-agents-home-page>`,customElements.get(`openclaw-agents-home-page`)||customElements.define(`openclaw-agents-home-page`,O)})))()}j();export{O as AgentsHomePage,k as header,A as render};
//# sourceMappingURL=agents-home-page-BDhR9np6.js.map