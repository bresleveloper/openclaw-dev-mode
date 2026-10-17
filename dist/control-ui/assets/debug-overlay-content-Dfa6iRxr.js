import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,E as r,Eu as i,T as a,Tu as o,W as s,ju as c,kc as l,w as u,z as d}from"./control-ui-core-CTSdBcaH.js";import{$ as f,X as p,Y as m,a as h,ct as g,i as _,nt as v,ut as y}from"./lit-runtime-TNZj1e-P.js";import{En as b,wn as x}from"./control-ui-boot-shared-D4E0xCZu.js";import{Li as ee,hi as te,ii as S,qi as C}from"./ui-CnRtCcYL.js";import{Cc as w,Gi as T,Hc as E,Hi as D,Uc as O,Ui as k,Wi as A,wc as j}from"./control-ui-boot-shared-flpXqVdL.js";import{a as M,i as N,n as P,r as F,t as I}from"./gateway-vitals-g0_suFnG.js";import{i as L,n as R,t as z}from"./lane-table-BCYjqou1.js";function B(e){return{...e,render:(t,n)=>e.render(t,n)}}function V(e){return c(`debug.overlay.pingMs`,{value:String(Math.round(e))})}function H(e,t){return f`<div class="debug-overlay__widget">
    ${F(e,t)}
    <openclaw-sparkline
      class="gateway-vital gateway-vital--ping"
      data-degraded=${e.pingMs>Y?``:p}
      title=${c(`debug.overlay.pingDescription`)}
      .label=${c(`debug.overlay.ping`)}
      .samples=${I(t,e=>e.pingMs)}
      .format=${V}
      .floorMax=${20}
    ></openclaw-sparkline>
    ${N(e,t)}
  </div>`}function U(e){return f`
    <div class="debug-overlay__table-wrap">
      <table class="data-table command-lanes-table command-lanes-table--compact">
        <thead>
          <tr>
            <th>${c(`debug.lanes.lane`)}</th>
            <th>${c(`debug.lanes.active`)}</th>
            <th>${c(`debug.lanes.queued`)}</th>
            <th>${c(`debug.lanes.blocked`)}</th>
          </tr>
        </thead>
        <tbody>
          ${R(e,{compact:!0})}
        </tbody>
      </table>
    </div>
  `}function W(e){return c(`debug.overlay.freeShort`,{value:G(e)})}function G(e){return ee(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>t===`byte`?null:+(e<10)})}function K(e,t){return f`
    ${M(e,t)}
    ${e.disks?.length?f`<div class="gateway-vitals debug-overlay__disks">
            ${h(e.disks??[],e=>e.path,e=>f`<openclaw-sparkline
                class="gateway-vital gateway-vital--disk"
                title=${e.path}
                .label=${`${c(`debug.overlay.disk`)} ${e.path}`}
                .sub=${c(`debug.overlay.totalShort`,{value:G(e.totalBytes)})}
                .samples=${I(t,t=>t.disks?.find(t=>t.path===e.path)?.availableBytes)}
                .format=${W}
                autorange
              ></openclaw-sparkline>`)}
          </div>`:p}
    ${typeof e.uptimeMs==`number`?f`<div class="debug-overlay__vitals-footer mono">
            ${c(`debug.overlay.uptime`)} ${x(e.uptimeMs)}
          </div>`:p}
  `}function q({sessions:e,totalCount:t,hasMore:n}){return f`
    <div class="debug-overlay__count">
      ${c(`debug.overlay.activeRunsCount`,{count:String(t??e.length)})}
    </div>
    ${n?f`<div class="debug-overlay__count">${c(`activityFeed.showing`,{shown:String(e.length),total:String(t??e.length)})}</div>`:p}
    ${e.length>0?f`<ul class="debug-overlay__list">
            ${e.map(e=>{let t=e.sessionId??e.key;return f`<li class="mono" title=${t}>${C(t,32)}</li>`})}
          </ul>`:f`<div class="debug-overlay__empty">${c(`debug.overlay.noActiveRuns`)}</div>`}
  `}function J(e){let t=e.eventLog.slice(0,8);return t.length>0?f`<ul class="debug-overlay__list debug-overlay__events">
        ${t.map(e=>f`<li>
            <span class="mono">${e.event}</span>
            <time>${d(e.ts)}</time>
          </li>`)}
      </ul>`:f`<div class="debug-overlay__empty">${c(`debug.noEvents`)}</div>`}var Y,X;function Z(){return(Z=e((()=>{te(),m(),_(),P(),i(),b(),s(),A(),a(),z(),Y=250,X=[B({...u.lanes,load:(e,t)=>L(e.client,t),render:U}),B({...u.status,load:async(e,t)=>{let n=await T(e.gateway,t);return{...n.value,pingMs:n.roundTripMs,sampledAt:n.at}},render:K}),B({...u[`active-runs`],load:(e,t)=>e.client.request(`sessions.list`,{activeOnly:!0,archived:`all`,includeGlobal:!0,includeUnknown:!0},{signal:t}),render:q}),B({...u.events,load:async e=>e.gateway,render:J})]})))()}var Q;function $(){return($=e((()=>{m(),v(),i(),A(),O(),o(),j(),t(),a(),Z(),Q=class extends n{constructor(...e){super(...e),this.minimized=!1,this.sections=new Map,this.requestControllers=new Map,this.requestGeneration=0,this.statusHistory=[],this.polling=new w(this,D,()=>void this.refreshSections(),!1,`visible`),this.gateway=new E(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetSections(),ensureInitialData:()=>void this.refreshSections(),onSnapshot:()=>this.syncPolling(),onPageActivation:()=>this.syncPolling()}),this.subscriptions=new l(this).watch(()=>!this.minimized&&document.visibilityState!==`hidden`?this.context?.gateway:void 0,(e,t)=>e.subscribeEventLog(t))}connectedCallback(){super.connectedCallback(),this.syncPolling()}disconnectedCallback(){this.polling.stop(),this.subscriptions.clear(),this.resetSections(),super.disconnectedCallback()}updated(e){e.has(`minimized`)&&this.syncPolling()}resetSections(){this.requestGeneration+=1;for(let e of this.requestControllers.values())e.abort();this.requestControllers.clear(),this.statusHistory=[],this.sections=new Map(X.map(e=>[e.id,{status:this.gateway.connected?`loading`:`unavailable`}]))}syncPolling(){let e=k(this.gateway.snapshot);e||(this.requestControllers.get(`status`)?.abort(),this.statusHistory=[],this.updateSection(this.requestGeneration,`status`,{status:`unavailable`})),document.visibilityState===`hidden`||this.minimized&&!e?this.polling.stop():this.polling.start()&&this.refreshSections(),this.requestUpdate()}async refreshSections(){let e=this.gateway.gateway,t=this.gateway.connected?this.gateway.client:null;if(!this.isConnected||document.visibilityState===`hidden`)return;if(!e||!t){this.sections=new Map(X.map(e=>[e.id,{status:`unavailable`}]));return}let n=this.requestGeneration,r=(this.minimized?X.filter(e=>e.id===`status`):X).map(async r=>{if(this.requestControllers.has(r.id)||r.id===`status`&&!k(e.snapshot))return;let i=new AbortController;this.requestControllers.set(r.id,i);try{let a=await r.load({client:t,gateway:e},i.signal);this.updateSection(n,r.id,{status:`ready`,value:a})}catch{this.updateSection(n,r.id,{status:`unavailable`})}finally{this.requestControllers.get(r.id)===i&&this.requestControllers.delete(r.id)}});await Promise.allSettled(r)}updateSection(e,t,n){if(!this.isConnected||e!==this.requestGeneration)return;if(t===`status`&&n.status===`ready`){this.polling.stop(),this.polling.start();let e=n.value;this.statusHistory.at(-1)?.at!==e.sampledAt&&(this.statusHistory=[...this.statusHistory.slice(-89),{at:e.sampledAt,status:e}])}let r=new Map(this.sections);r.set(t,n),this.sections=r}renderSection(e){let t=this.sections.get(e.id)??{status:`loading`};return f`
      <section class="debug-overlay__section" aria-busy=${t.status===`loading`}>
        <h3>${c(e.titleKey)}</h3>
        ${t.status===`loading`?r(e.id):t.status===`unavailable`?f`<div class="debug-overlay__empty">${c(`debug.overlay.unavailable`)}</div>`:e.render(t.value,this.statusHistory)}
      </section>
    `}render(){if(this.minimized){let e=this.sections.get(`status`)??{status:`loading`};if(e.status!==`ready`)return f`<div class="debug-overlay__compact-loading" role="status">
          ${c(e.status===`loading`?`common.loading`:`debug.overlay.unavailable`)}
        </div>`;let t=e.value;return H(t,this.statusHistory)}return f`${X.map(e=>this.renderSection(e))}`}},S([y({attribute:!1})],Q.prototype,`context`,void 0),S([y({type:Boolean})],Q.prototype,`minimized`,void 0),S([g()],Q.prototype,`sections`,void 0),customElements.get(`openclaw-debug-overlay-content`)||customElements.define(`openclaw-debug-overlay-content`,Q)})))()}$();
//# sourceMappingURL=debug-overlay-content-Dfa6iRxr.js.map