import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,i as o,m as s}from"./lit-runtime-B2f-BITn.js";import{r as c}from"./i18n-Cb2Gon67.js";import{o as l}from"./app-route-paths-Ckh-KQjG.js";import{Jn as u,Nr as d,Pr as f,dr as p,r as m,yr as h}from"./index-zot7ymVq.js";function g(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function _(e){return typeof e==`string`&&e.trim()?e.trim():void 0}function v(e){switch(e){case`queued`:case`running`:case`completed`:case`failed`:case`cancelled`:case`timed_out`:return e;default:return null}}function y(e){switch(e){case`subagent`:case`cron`:case`acp`:case`cli`:return e;default:return}}function b(e){if(typeof e==`number`&&Number.isFinite(e)&&e>=0||typeof e==`string`&&Number.isFinite(Date.parse(e)))return e}function x(e){if(!g(e))return null;let t=_(e.id),n=_(e.taskId)??t,r=v(e.status);if(!t||!n||!r)return null;let i=y(e.runtime),a=_(e.kind),o=_(e.title),s=_(e.agentId),c=_(e.sessionKey),l=_(e.childSessionKey),u=b(e.createdAt),d=b(e.updatedAt),f=b(e.startedAt),p=b(e.endedAt),m=_(e.progressSummary),h=_(e.terminalSummary),x=_(e.error);return{id:t,taskId:n,status:r,...a?{kind:a}:{},...i?{runtime:i}:{},...o?{title:o}:{},...s?{agentId:s}:{},...c?{sessionKey:c}:{},...l?{childSessionKey:l}:{},...u===void 0?{}:{createdAt:u},...d===void 0?{}:{updatedAt:d},...f===void 0?{}:{startedAt:f},...p===void 0?{}:{endedAt:p},...m?{progressSummary:m}:{},...h?{terminalSummary:h}:{},...x?{error:x}:{}}}function S(e){if(typeof e==`number`)return e;if(typeof e==`string`){let t=Date.parse(e);return Number.isFinite(t)?t:0}return 0}function C(e){return e.toSorted((e,t)=>{let n=S(t.updatedAt)-S(e.updatedAt);return n===0?e.id<t.id?-1:+(e.id>t.id):n})}function w(e){let t=C(e);return{active:t.filter(e=>e.status===`queued`||e.status===`running`),recent:t.filter(e=>e.status!==`queued`&&e.status!==`running`).slice(0,50)}}function T(e){return!g(e)||!Array.isArray(e.tasks)?null:C(e.tasks.map(x).filter(e=>e!==null))}function E(...e){let t=new Map;for(let n of e)for(let e of n)t.set(e.id,e);return C([...t.values()])}function D(e){if(!g(e)||typeof e.cancelled!=`boolean`)return null;let t=_(e.reason),n=x(e.task);return{found:e.found===!0,cancelled:e.cancelled,...t?{reason:t}:{},...n?{task:n}:{}}}function O(e){if(!g(e))return null;if(e.action===`restored`)return{action:`restored`};if(e.action===`deleted`){let t=_(e.taskId);return t?{action:`deleted`,taskId:t}:null}if(e.action===`upserted`){let t=x(e.task);return t?{action:`upserted`,task:t}:null}return null}function k(e,t){let n=O(t);return!n||n.action===`restored`?{tasks:[...e],refetch:!0}:n.action===`deleted`?{tasks:C(e.filter(e=>e.id!==n.taskId)),refetch:!1}:{tasks:C([n.task,...e.filter(e=>e.id!==n.task.id)]),refetch:!1}}var A={queued:`tasksPage.status.queued`,running:`tasksPage.status.running`,completed:`tasksPage.status.completed`,failed:`tasksPage.status.failed`,cancelled:`tasksPage.status.cancelled`,timed_out:`tasksPage.status.timedOut`},j={queued:`chip-warn`,running:`chip-warn`,completed:`chip-ok`,failed:`chip-danger`,cancelled:``,timed_out:`chip-danger`};function M(e){return c(A[e])}function N(e){return j[e]}function P(e){switch(e.runtime){case`subagent`:return c(`tasksPage.runtime.subagent`);case`cron`:return c(`tasksPage.runtime.cron`);case`acp`:return c(`tasksPage.runtime.acp`);case`cli`:return c(`tasksPage.runtime.cli`);default:return c(`tasksPage.runtime.unknown`)}}function F(e){return e.title??e.kind??(e.runtime?P(e):c(`tasksPage.untitled`))}function I(e){return e.status===`queued`||e.status===`running`?e.progressSummary??null:e.status===`failed`||e.status===`timed_out`?e.error??e.terminalSummary??e.progressSummary??null:e.terminalSummary??e.error??e.progressSummary??null}function L(e,t){let n=e.childSessionKey??e.sessionKey;return n?i`<a
    class="session-link"
    href=${`${l(`chat`,t.basePath)}${u(n)}`}
    @click=${e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),t.onNavigateToChat(n))}}
    >${c(`tasksPage.openSession`)}</a
  >`:a}function R(e,t){let n=e.status===`queued`||e.status===`running`,r=S(e.updatedAt??e.createdAt),o=I(e),s=F(e),l=t.cancellingTaskIds.has(e.id);return i`
    <div class="list-item" data-task-id=${e.id}>
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="chip-row">
          <span class="chip ${N(e.status)}">${M(e.status)}</span>
          <span class="chip">${P(e)}</span>
          ${e.agentId?i`<span class="chip">${c(`tasksPage.agent`,{agent:e.agentId})}</span>`:a}
        </div>
        ${o?i`<div class="list-sub">${o}</div>`:a}
      </div>
      <div class="list-meta">
        ${r>0?i`<span title=${p(r)}>${h(r)}</span>`:i`<span>${c(`common.na`)}</span>`}
        ${L(e,t)}
        ${n&&t.canCancel?i`<button
              class="btn"
              type="button"
              aria-label=${c(`tasksPage.cancelTask`,{title:s})}
              ?disabled=${l||!t.connected}
              @click=${()=>t.onCancel(e.taskId)}
            >
              ${c(l?`tasksPage.cancelling`:`common.cancel`)}
            </button>`:a}
      </div>
    </div>
  `}function z(e,t,n,r,a){return i`
    <section class="card stack" data-task-section=${e}>
      <div>
        <div class="card-title">${t}</div>
        <div class="card-sub">
          ${n.length===1?c(`tasksPage.taskCountOne`):c(`tasksPage.taskCount`,{count:String(n.length)})}
        </div>
      </div>
      ${n.length===0?i`<div class="muted">${r}</div>`:i`<div class="list">
            ${o(n,e=>e.id,e=>R(e,a))}
          </div>`}
    </section>
  `}function B(e){let{active:t,recent:n}=w(e.tasks);return i`
    <div class="stack">
      ${e.connected?a:i`<div class="callout warn">${c(`tasksPage.disconnected`)}</div>`}
      ${e.error?i`<div class="callout danger">${e.error}</div>`:a}
      ${e.loading&&e.tasks.length===0?i`<div class="card muted">${c(`tasksPage.loading`)}</div>`:a}
      ${!e.loading&&e.tasks.length===0?i`<div class="card muted">${c(`tasksPage.empty`)}</div>`:a}
      ${z(`active`,c(`tasksPage.active`),t,c(`tasksPage.emptyActive`),e)}
      ${z(`recent`,c(`tasksPage.recent`),n,c(`tasksPage.emptyRecent`),e)}
    </div>
  `}function V(e,t){return e instanceof Error&&e.message.trim()?e.message.trim():typeof e==`string`&&e.trim()?e.trim():t}var H=class extends s{constructor(...e){super(...e),this.tasks=[],this.connected=!1,this.loading=!1,this.error=null,this.cancellingTaskIds=new Set,this.client=null,this.loadGeneration=0}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.stopGatewaySubscription=this.context.gateway.subscribe(()=>{let e=this.connected,t=this.client;this.syncGatewayState(),this.connected&&(this.client!==t||!e)&&this.refreshTasks()}),this.stopGatewayEvents=this.context.gateway.subscribeEvents(e=>{if(e.event!==`task`)return;let t=k(this.tasks,e.payload);if(t.refetch){this.refreshTasks();return}this.tasks=t.tasks}),this.connected&&this.refreshTasks()}disconnectedCallback(){this.loadGeneration+=1,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopGatewayEvents?.(),this.stopGatewayEvents=void 0,super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;this.client!==e.client&&(this.loadGeneration+=1,this.client=e.client,this.tasks=[],this.loading=!1,this.error=null,this.cancellingTaskIds=new Set),this.connected=e.connected}async refreshTasks(){let e=this.client;if(!this.connected||!e)return;let t=++this.loadGeneration;this.loading=!0,this.error=null;try{let[n,r]=await Promise.all([e.request(`tasks.list`,{status:[`queued`,`running`],limit:500}),e.request(`tasks.list`,{limit:200})]),i=T(n),a=T(r);if(!i||!a)throw Error(c(`tasksPage.invalidResponse`));let o=E(a,i);t===this.loadGeneration&&e===this.client&&(this.tasks=o)}catch(n){t===this.loadGeneration&&e===this.client&&(this.error=V(n,c(`tasksPage.loadFailed`)))}finally{t===this.loadGeneration&&e===this.client&&(this.loading=!1)}}async cancelTask(e){let t=this.client;if(!(!this.connected||!t||this.cancellingTaskIds.has(e))){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let n=D(await t.request(`tasks.cancel`,{taskId:e}));n?.task&&(this.tasks=k(this.tasks,{action:`upserted`,task:n.task}).tasks),n?.cancelled||(this.error=n?.reason?.trim()||c(`tasksPage.cancelFailed`))}catch(e){this.error=V(e,c(`tasksPage.cancelFailed`))}finally{let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}render(){return i`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${f(`tasks`)}</div>
          <div class="page-sub">${d(`tasks`)}</div>
        </div>
        <button
          class="btn"
          type="button"
          ?disabled=${!this.connected||this.loading}
          @click=${()=>void this.refreshTasks()}
        >
          ${this.loading?c(`common.refreshing`):c(`common.refresh`)}
        </button>
      </section>
      ${B({basePath:this.context.basePath,connected:this.connected,canCancel:m(this.context.gateway.snapshot.hello?.auth??null),loading:this.loading,error:this.error,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,onCancel:e=>void this.cancelTask(e),onNavigateToChat:e=>this.context.navigate(`chat`,{search:u(e)})})}
    `}};n([t({context:e,subscribe:!1})],H.prototype,`context`,void 0),n([r()],H.prototype,`tasks`,void 0),n([r()],H.prototype,`connected`,void 0),n([r()],H.prototype,`loading`,void 0),n([r()],H.prototype,`error`,void 0),n([r()],H.prototype,`cancellingTaskIds`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,H);
//# sourceMappingURL=tasks-page-ChN5LREV.js.map