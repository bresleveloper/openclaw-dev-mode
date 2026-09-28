import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Na as t}from"./control-ui-foundation-Dh9Nir5C.js";import{Dc as n,Gl as r,Oc as i,Xl as a,Yc as o,kc as s}from"./control-ui-core-BfjCgLp6.js";import{$ as c,X as l,Y as u}from"./lit-runtime-L6OV30Vo.js";import{Fi as d,Ii as f}from"./control-ui-core-qT0XjEdV.js";import{ht as p}from"./control-ui-boot-new-BDpfvqZB.js";function m(e){let n=e.selectedId??e.selection.state.scopeId??``,r=n?t(n):``,o=e.allowAll!==!1,u=n=>e.agents.some(e=>e.kind===`system`&&t(e.id)===n),f=i(e.agents);if(f.length<=1)return l;let p=new Map(f.map(e=>{let n=t(e.id);return[n,n===e.id?e:{...e,id:n}]}));for(let n of e.additionalAgentIds??[]){if(!n.trim())continue;let e=t(n);!u(e)&&!p.has(e)&&p.set(e,{id:e})}r&&!u(r)&&!p.has(r)&&p.set(r,{id:r});let m=[...p.values()].toSorted((e,t)=>s(e).localeCompare(s(t))),h=u(r)?o?``:m[0]?.id??``:r,g=[...o?[{value:``,label:a(`agentScope.allAgents`),icon:d.users}]:[],...m.map(e=>({value:e.id,label:s(e),agent:e}))];return c`
    <div class="agent-scope-control">
      <openclaw-agent-select
        .options=${g}
        .value=${h}
        .accessibleLabel=${a(`agentScope.label`)}
        .menuLabel=${a(`agentScope.label`)}
        .onSelect=${t=>o?e.selection.setScope(t||null):e.selection.set(t||null)}
      ></openclaw-agent-select>
    </div>
  `}function h(){return(h=e((()=>{u(),r(),n(),o(),p(),f()})))()}export{m as n,h as t};
//# sourceMappingURL=agent-scope-control-BZy2uIPL.js.map