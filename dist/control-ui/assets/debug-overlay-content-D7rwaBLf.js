import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Nr as t,Xr as n,ai as r,fr as i}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as a,Ll as o,Xl as s,_n as c,fn as l,g as u,h as d,m as f,nc as p,tc as m,zl as h}from"./control-ui-core-DkXlmHxW.js";import{$ as g,X as _,Y as v,c as y,ct as b,nt as x,s as S,ut as C}from"./lit-runtime-DLvISeBM.js";import{aa as w,ca as T,la as E,mo as D,oa as O,po as k}from"./control-ui-boot-shared-XNIZlLuA.js";import{a as A,i as j,n as M,r as N,t as P}from"./gateway-vitals-CEicVBY2.js";import{i as F,n as I,t as L}from"./lane-table---5BQ_mQ.js";function R(e){return{...e,render:(t,n)=>e.render(t,n)}}function z(e){return s(`debug.overlay.pingMs`,{value:String(Math.round(e))})}function B(e,t){return g`<div class="debug-overlay__widget">
    ${N(e,t)}
    <openclaw-sparkline
      class="gateway-vital gateway-vital--ping"
      data-degraded=${e.pingMs>q?``:_}
      title=${s(`debug.overlay.pingDescription`)}
      .label=${s(`debug.overlay.ping`)}
      .samples=${P(t,e=>e.pingMs)}
      .format=${z}
      .floorMax=${20}
    ></openclaw-sparkline>
    ${j(e,t)}
  </div>`}function V(e){return g`
    <div class="debug-overlay__table-wrap">
      <table class="data-table command-lanes-table command-lanes-table--compact">
        <thead>
          <tr>
            <th>${s(`debug.lanes.lane`)}</th>
            <th>${s(`debug.lanes.active`)}</th>
            <th>${s(`debug.lanes.queued`)}</th>
            <th>${s(`debug.lanes.blocked`)}</th>
          </tr>
        </thead>
        <tbody>
          ${I(e,{compact:!0})}
        </tbody>
      </table>
    </div>
  `}function H(e){return s(`debug.overlay.freeShort`,{value:U(e)})}function U(e){return t(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>t===`byte`?null:+(e<10)})}function W(e,t){return g`
    ${A(e,t)}
    ${e.disks?.length?g`<div class="gateway-vitals debug-overlay__disks">
            ${y(e.disks??[],e=>e.path,e=>g`<openclaw-sparkline
                class="gateway-vital gateway-vital--disk"
                title=${e.path}
                .label=${`${s(`debug.overlay.disk`)} ${e.path}`}
                .sub=${s(`debug.overlay.totalShort`,{value:U(e.totalBytes)})}
                .samples=${P(t,t=>t.disks?.find(t=>t.path===e.path)?.availableBytes)}
                .format=${H}
                autorange
              ></openclaw-sparkline>`)}
          </div>`:_}
    ${typeof e.uptimeMs==`number`?g`<div class="debug-overlay__vitals-footer mono">
            ${s(`debug.overlay.uptime`)} ${T(e.uptimeMs)}
          </div>`:_}
  `}function G({sessions:e,totalCount:t,hasMore:r}){return g`
    <div class="debug-overlay__count">
      ${s(`debug.overlay.activeRunsCount`,{count:String(t??e.length)})}
    </div>
    ${r?g`<div class="debug-overlay__count">${s(`activityFeed.showing`,{shown:String(e.length),total:String(t??e.length)})}</div>`:_}
    ${e.length>0?g`<ul class="debug-overlay__list">
            ${e.map(e=>{let t=e.sessionId??e.key;return g`<li class="mono" title=${t}>${n(t,32)}</li>`})}
          </ul>`:g`<div class="debug-overlay__empty">${s(`debug.overlay.noActiveRuns`)}</div>`}
  `}function K(e){let t=e.eventLog.slice(0,8);return t.length>0?g`<ul class="debug-overlay__list debug-overlay__events">
        ${t.map(e=>g`<li>
            <span class="mono">${e.event}</span>
            <time>${l(e.ts)}</time>
          </li>`)}
      </ul>`:g`<div class="debug-overlay__empty">${s(`debug.noEvents`)}</div>`}var q,J;function Y(){return(Y=e((()=>{i(),v(),S(),M(),a(),E(),c(),d(),L(),q=250,J=[R({...f.lanes,load:(e,t)=>F(e.client,t),render:V}),R({...f.status,load:async(e,t)=>{let n=performance.now();return{...await e.client.request(`system.info`,{},{signal:t}),pingMs:performance.now()-n}},render:W}),R({...f[`active-runs`],load:(e,t)=>e.client.request(`sessions.list`,{activeOnly:!0,archived:`all`,includeGlobal:!0,includeUnknown:!0},{signal:t}),render:G}),R({...f.events,load:async e=>e.gateway,render:K})]})))()}var X,Z;function Q(){return(Q=e((()=>{v(),x(),a(),D(),h(),O(),p(),d(),Y(),X=2e3,Z=class extends o{constructor(...e){super(...e),this.minimized=!1,this.sections=new Map,this.requestControllers=new Map,this.requestGeneration=0,this.statusHistory=[],this.polling=new w(this,X,()=>void this.refreshSections(),!1),this.gateway=new k(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetSections(),ensureInitialData:()=>void this.refreshSections(),onPageActivation:()=>this.syncPolling()}),this.subscriptions=new m(this).watch(()=>!this.minimized&&document.visibilityState!==`hidden`?this.context?.gateway:void 0,(e,t)=>e.subscribeEventLog(t))}connectedCallback(){super.connectedCallback(),this.syncPolling()}disconnectedCallback(){this.polling.stop(),this.subscriptions.clear(),this.resetSections(),super.disconnectedCallback()}resetSections(){this.requestGeneration+=1;for(let e of this.requestControllers.values())e.abort();this.requestControllers.clear(),this.statusHistory=[],this.sections=new Map(J.map(e=>[e.id,{status:this.gateway.connected?`loading`:`unavailable`}]))}syncPolling(){document.visibilityState===`hidden`?this.polling.stop():this.polling.start()&&this.refreshSections(),this.requestUpdate()}async refreshSections(){let e=this.gateway.gateway,t=this.gateway.connected?this.gateway.client:null;if(!this.isConnected||document.visibilityState===`hidden`)return;if(!e||!t){this.sections=new Map(J.map(e=>[e.id,{status:`unavailable`}]));return}let n=this.requestGeneration,r=(this.minimized?J.filter(e=>e.id===`status`):J).map(async r=>{if(this.requestControllers.has(r.id))return;let i=new AbortController;this.requestControllers.set(r.id,i);try{let a=await r.load({client:t,gateway:e},i.signal);this.updateSection(n,r.id,{status:`ready`,value:a})}catch{this.updateSection(n,r.id,{status:`unavailable`})}finally{this.requestControllers.get(r.id)===i&&this.requestControllers.delete(r.id)}});await Promise.allSettled(r)}updateSection(e,t,n){if(!this.isConnected||e!==this.requestGeneration)return;if(t===`status`&&n.status===`ready`){let e=n.value;this.statusHistory=[...this.statusHistory.slice(-89),{at:Date.now(),status:e}]}let r=new Map(this.sections);r.set(t,n),this.sections=r}renderSection(e){let t=this.sections.get(e.id)??{status:`loading`};return g`
      <section class="debug-overlay__section" aria-busy=${t.status===`loading`}>
        <h3>${s(e.titleKey)}</h3>
        ${t.status===`loading`?u(e.id):t.status===`unavailable`?g`<div class="debug-overlay__empty">${s(`debug.overlay.unavailable`)}</div>`:e.render(t.value,this.statusHistory)}
      </section>
    `}render(){if(this.minimized){let e=this.sections.get(`status`)??{status:`loading`};if(e.status!==`ready`)return g`<div class="debug-overlay__compact-loading" role="status">
          ${s(e.status===`loading`?`common.loading`:`debug.overlay.unavailable`)}
        </div>`;let t=e.value;return B(t,this.statusHistory)}return g`${J.map(e=>this.renderSection(e))}`}},r([C({attribute:!1})],Z.prototype,`context`,void 0),r([C({type:Boolean})],Z.prototype,`minimized`,void 0),r([b()],Z.prototype,`sections`,void 0),customElements.get(`openclaw-debug-overlay-content`)||customElements.define(`openclaw-debug-overlay-content`,Z)})))()}Q();
//# sourceMappingURL=debug-overlay-content-D7rwaBLf.js.map