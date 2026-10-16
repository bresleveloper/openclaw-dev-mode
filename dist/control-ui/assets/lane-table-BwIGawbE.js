import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,ju as n}from"./control-ui-core-bJHyI7AF.js";import{$ as r,Y as i}from"./lit-runtime-DyST807n.js";import{n as a,t as o}from"./en-debug-BQ4Ww_lv.js";function s(){return(s=e((()=>{})))()}async function c(e,t){return e.request(`diagnostics.lanes`,{},{signal:t})}async function l(e,t,n){let r=t?e.request(`models.list`,{agentId:t.trim(),view:`default`},{signal:n}):Promise.resolve({models:[]}),i=c(e,n),[a,o,s,l,u]=await Promise.all([e.request(`status`,{},{signal:n}),e.request(`health`,{},{signal:n}),r,e.request(`last-heartbeat`,{},{signal:n}),i]);return{status:a,health:o,models:s.models,heartbeat:l,...u}}function u(){return(u=e((()=>{})))()}function d(e,t={}){let i=e.lanes.map(e=>{let i=e.concurrencyScope===`session`,a=i?(e.saturatedLaneCount??0)>0:e.activeCount>=e.maxConcurrent,o=e.queuedCount>0,s=[`command-lane-row`,a?`command-lane-row--saturated`:``,o?`command-lane-row--queued`:``].filter(Boolean).join(` `),c=e.group?`${e.group} · ${e.groupActive??0}/${e.groupBudget??0}`:``;return r`
      <tr class=${s}>
        <td class="mono command-lane-row__name" data-label=${n(`debug.lanes.lane`)}>
          ${e.lane}
        </td>
        <td class="mono" data-label=${n(`debug.lanes.active`)}>
          ${i?n(`debug.lanes.activePerSession`,{active:String(e.activeCount),limit:String(e.maxConcurrent)}):`${e.activeCount}/${e.maxConcurrent}`}
        </td>
        <td class="mono" data-label=${n(`debug.lanes.queued`)}>${e.queuedCount}</td>
        ${t.compact?``:r`<td data-label=${n(`debug.lanes.group`)}>${c}</td>`}
        <td class="mono" data-label=${n(`debug.lanes.blocked`)}>${e.blockedBy??`—`}</td>
      </tr>
    `}),a=e.dynamic;if(a){let e=[`command-lane-row`,`command-lane-row--dynamic`,a.queuedCount>0?`command-lane-row--queued`:``].filter(Boolean).join(` `);i.push(r`
      <tr class=${e}>
        <td class="mono command-lane-row__name" data-label=${n(`debug.lanes.lane`)}>
          ${n(`debug.lanes.sessionLanes`,{count:String(a.laneCount)})}
        </td>
        <td class="mono" data-label=${n(`debug.lanes.active`)}>${a.activeCount}</td>
        <td class="mono" data-label=${n(`debug.lanes.queued`)}>${a.queuedCount}</td>
        ${t.compact?``:r`<td data-label=${n(`debug.lanes.group`)}></td>`}
        <td class="mono" data-label=${n(`debug.lanes.blocked`)}>—</td>
      </tr>
    `)}return i}function f(){return(f=e((()=>{i(),t(),o(),a()})))()}export{l as a,c as i,d as n,s as o,u as r,f as t};
//# sourceMappingURL=lane-table-BwIGawbE.js.map