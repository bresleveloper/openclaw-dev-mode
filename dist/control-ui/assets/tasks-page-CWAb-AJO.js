import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Dh9Nir5C.js";import{$n as i,Ar as a,Fs as o,Gl as s,Is as c,Ll as l,Ls as u,Xl as d,Yc as f,_n as p,cc as m,cl as ee,dc as te,er as ne,fc as re,fn as h,hi as g,il as _,lc as v,mc as y,nc as ie,pc as ae,rn as oe,tc as se,zl as ce}from"./control-ui-core-BfjCgLp6.js";import{$ as b,X as x,Y as S,c as le,ct as C,nt as ue,s as de}from"./lit-runtime-L6OV30Vo.js";import{Di as fe,Dr as pe,Er as me,Oi as w,Or as T,Qa as E,Xn as D,Yn as O,do as k,fo as A}from"./control-ui-core-qT0XjEdV.js";import{G as j,H as M,U as N,V as P}from"./control-ui-boot-shared-Dhqg2SVA.js";import{Bt as F,Ht as I,Jt as L,Kt as R,Wt as z,Xt as he,Yt as B,Zt as ge,an as _e,en as ve,in as ye,mo as be,on as V,po as xe,qt as Se,rn as Ce,zl as we}from"./control-ui-boot-shared-CYu509im.js";import{Ct as Te,Et as Ee,Ot as De,St as Oe,_t as H,pt as U}from"./control-ui-boot-shared-Bm2ZxasE.js";import{c as ke,cn as Ae,on as je,s as Me,sn as Ne}from"./control-ui-boot-shared-Ck3TDIrB.js";import"./control-ui-boot-shared-BtDOT-1l.js";import{n as Pe,t as Fe}from"./settings-workspace-DjAwV7nI.js";import{n as Ie,t as Le}from"./agent-row-chip-D8JnzqeS.js";import{n as Re,t as ze}from"./agent-scope-control-BZy2uIPL.js";function Be(e,t){let n=e.childSessionKey??e.sessionKey;if(!n)return x;let r=t.sessionRow(n),i=y({face:re(r),sessionKey:n,fallbackAgentId:t.agentId,basePath:t.basePath,mainKey:t.mainKey,row:r,preferenceDerivedFace:!0}).href;return b`<a
    class="session-link"
    href=${i}
    @click=${e=>{g(e)&&(e.preventDefault(),t.onNavigateToChat(n))}}
    >${d(`tasksPage.openSession`)}</a
  >`}function Ve(e,t,n){let r=e.status===`queued`||e.status===`running`,i=_e(e.updatedAt??e.createdAt),a=ve(e),o=V(e),s=t.cancellingTaskIds.has(e.id),c=e.terminalOutcome===`blocked`,l=c&&e.deliveryStatus===`failed`,u=c&&e.deliveryStatus===`dismissed`,f=r&&t.canCancel||c&&t.canCopy||l&&t.canCancel;return b`
    <div class="settings-row task-row" data-task-id=${e.id}>
      <div class="settings-row__text task-row__content">
        <div class="settings-row__title">${o}</div>
        <div class="task-row__facts">
          <span data-task-status
            >${De({kind:He(e.status),label:ye(e.status)})}</span
          >
          <span>${Ce(e)}</span>
          ${e.agentId?Ie(e.agentId):x}
        </div>
        ${a?b`<div class="settings-row__desc">${a}</div>`:x}
        ${c?b`<div class="task-row__warning">
                <span
                  >${d(u?`tasksPage.deliveryDismissed`:`tasksPage.deliveryBlocked`)}</span
                >
                ${l?b`<span class="muted">${d(`tasksPage.duplicateRisk`)}</span>`:x}
              </div>`:x}
      </div>
      <div class="settings-row__control task-row__control">
        <div class="task-row__links">
          ${i>0?b`<span title=${n(i)}
                  >${h(i)}</span
                >`:b`<span>${d(`common.na`)}</span>`}
          ${e.hasTranscript&&t.canCopy?b`<button class="btn btn--sm" type="button" ?disabled=${!t.connected} @click=${()=>t.onViewTranscript(e.id)}>${d(`tasksPage.viewTranscript`)}</button>`:x}
          ${Be(e,t)}
        </div>
        ${f?b`<div class="task-row__actions">
                ${r&&t.canCancel?b`<button
                        class="btn btn--sm"
                        type="button"
                        aria-label=${d(`tasksPage.cancelTask`,{title:o})}
                        ?disabled=${s||!t.connected}
                        @click=${()=>t.onCancel(e.taskId)}
                      >
                        ${d(s?`tasksPage.cancelling`:`common.cancel`)}
                      </button>`:x}
                ${c&&t.canCopy?b`<button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${s||!t.connected}
                        @click=${()=>t.onCopyResult(e.taskId)}
                      >
                        ${d(`tasksPage.copyResult`)}
                      </button>`:x}
                ${l&&t.canCancel?b`
                        <button
                          class="btn btn--sm"
                          type="button"
                          ?disabled=${s||!t.connected}
                          @click=${()=>t.onRetry(e.taskId)}
                        >
                          ${d(`tasksPage.retryDelivery`)}
                        </button>
                        <button
                          class="btn btn--sm"
                          type="button"
                          ?disabled=${s||!t.connected}
                          @click=${()=>t.onDismiss(e.taskId)}
                        >
                          ${d(`tasksPage.dismissDelivery`)}
                        </button>
                      `:x}
              </div>`:x}
      </div>
    </div>
  `}function He(e){switch(e){case`completed`:return`ok`;case`failed`:case`timed_out`:return`danger`;case`queued`:case`running`:return`warn`;case`cancelled`:return`muted`}return e}function W(e,...t){return e.filter(e=>t.includes(e.status)).length}function G(e,t){let n=e===`active`?[[W(t,`running`),d(`tasksPage.status.running`)],[W(t,`queued`),d(`tasksPage.status.queued`)]]:[[W(t,`completed`),d(`tasksPage.status.completed`)],[W(t,`failed`,`timed_out`),d(`tasksPage.status.failed`)]];return b`<span class="task-heading-facts">
    ${n.map(([e,t],n)=>b`
        ${n>0?b`<span aria-hidden="true">·</span>`:x}
        <span><strong>${e}</strong> ${t}</span>
      `)}
  </span>`}function K(e,t,n,r,i,a){let o=n.length===0?H(r):le(n,e=>e.id,e=>Ve(e,i,a));return b`<div data-task-section=${e}>
    ${Ee({title:b`${t}${G(e,n)}`},o)}
  </div>`}function Ue(e){let t=oe(),{active:n,recent:r}=ge(e.tasks);return Oe(b`<div class="tasks-page-list">
      ${e.connected?x:b`<div class="callout warn">${d(`tasksPage.disconnected`)}</div>`}
      ${e.error?b`<div class="callout danger" role="alert">${e.error}</div>`:x}
      ${e.copyResultError?b`<div class="callout danger" role="alert">${e.copyResultError}</div>`:x}
      ${e.loading&&e.tasks.length===0?H(d(`tasksPage.loading`)):x}
      ${!e.loading&&e.tasks.length===0?H(d(`tasksPage.empty`)):x}
      ${K(`active`,d(`tasksPage.active`),n,d(`tasksPage.emptyActive`),e,t)}
      ${K(`recent`,d(`tasksPage.recent`),r,d(`tasksPage.emptyRecent`),e,t)}
    </div>`,{wide:!0})}function q(){return(q=e((()=>{S(),de(),Le(),U(),s(),p(),v(),I()})))()}function J(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>_(e)?.agentId===t):!0}function We(e){return e instanceof O&&e.gatewayCode===`INVALID_REQUEST`}async function Ge(e){let t=[],n,r=new Set;for(;;){let i;try{i=await e.client.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...e.agentId?{agentId:e.agentId}:{},...n===void 0?{}:{cursor:n}},{signal:e.signal})}catch(e){throw n!==void 0&&We(e)?new X(e):e}let a=B(i);if(!a)throw Error(d(`tasksPage.invalidResponse`));if(t=z(t,a.tasks),a.nextCursor===void 0)return t;if(!a.nextCursor||r.has(a.nextCursor))throw new X(Error(d(`tasksPage.invalidResponse`)));r.add(a.nextCursor),n=a.nextCursor}}async function Y(e){let[t,n]=await Promise.all([Ge(e),e.client.request(`tasks.list`,{status:Z,sortBy:`endedAt`,limit:200,...e.agentId?{agentId:e.agentId}:{}},{signal:e.signal})]),r=B(n);if(!r)throw Error(d(`tasksPage.invalidResponse`));return{active:t,recent:r.tasks}}async function Ke(e){try{return await Y(e)}catch(t){if(!(t instanceof X))throw t;return await Y(e)}}var X,Z,Q;function $(){return($=e((()=>{t(),P(),S(),ue(),D(),E(),w(),T(),ze(),U(),Fe(),s(),a(),ne(),u(),v(),f(),I(),be(),ce(),ie(),je(),Me(),q(),X=class extends Error{constructor(e){super(`task list continuation failed`),this.reason=e}},Z=[`completed`,`failed`,`timed_out`,`cancelled`],Q=class extends l{constructor(...e){super(...e),this.tasks=[],this.error=null,this.copyResultError=null,this.cancellingTaskIds=new Set,this.transcriptTaskId=null,this.transcriptHost={client:null,connected:!1,requestUpdate:()=>this.requestUpdate()},this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!1,this.copyResultAttempt=0,this.gateway=new xe(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.tasks=[],this.taskSnapshotInvalidated=!1,this.error=null,this.copyResultError=null},invalidateRequests:()=>this.cancelGatewayWork(),onSnapshot:()=>{this.gateway.connected&&this.context.agents.ensureList()},ensureInitialData:()=>void this.refreshTasks()}),this.observeAgentScope=we(()=>{this.gateway.invalidate(),this.cancelGatewayWork(),this.invalidateTaskSnapshot(),this.gateway.connected&&this.refreshTasks(),this.requestUpdate()}),this.listTask=new M(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.scopeId??null],task:async([e,t,n],{signal:r})=>{if(!e||!t)return N;let i={gateway:e,client:t,scopeId:n,events:[]};return this.taskRefreshEvents=i,{...await Ke({client:t,agentId:n??void 0,signal:r}),buffer:i}},onComplete:({active:e,recent:t,buffer:n})=>{let r=z(e,t);for(let e of n.events)r=F(r,e).tasks;this.taskSnapshotInvalidated=!1,this.tasks=r,this.reconcileTranscriptSelection(),this.taskRefreshEvents===n&&(this.taskRefreshEvents=null)},onError:e=>{e instanceof X?this.invalidateTaskSnapshot():this.taskRefreshEvents=null,this.error=o(e instanceof X?e.reason:e,d(`tasksPage.loadFailed`))}}),this.subscriptions=new se(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`task`)return;let n=this.context.agentSelection.state.scopeId,r=R(t.payload);if((r?.action===`deleted`||r?.action===`upserted`&&J(r.task,n))&&this.bufferTaskRefreshEvent(r),this.taskSnapshotInvalidated)return;let i=F(this.tasks,t.payload);if(i.refetch){this.refreshTasks();return}this.tasks=i.tasks.filter(e=>J(e,n)),this.reconcileTranscriptSelection(),r&&Ne(this.transcriptHost,r)})).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}bufferTaskRefreshEvent(e){let t=this.taskRefreshEvents;e&&e.action!==`restored`&&t&&t.gateway===this.gateway.gateway&&t.client===this.gateway.client&&t.scopeId===this.context.agentSelection.state.scopeId&&t.events.push(e)}invalidateTaskSnapshot(){this.closeTranscript(),this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!0,this.tasks=[]}disconnectedCallback(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.subscriptions.clear(),super.disconnectedCallback()}cancelGatewayWork(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.taskRefreshEvents=null,this.listTask.run([null,null,null]),this.cancellingTaskIds=new Set}refreshTasks(){let e=this.gateway.gateway,t=this.gateway.client;if(!e||this.context.gateway!==e||!this.gateway.connected||!t)return Promise.resolve();let n=this.context.agentSelection.state.scopeId;return this.error=null,this.copyResultError=null,this.listTask.run([e,t,n])}async cancelTask(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(t&&n&&this.context.gateway===n&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let n=await t.client.request(`tasks.cancel`,{taskId:e});if(!this.gateway.isCurrent(t))return;let r=Se(n);if(r?.task){let e=R({action:`upserted`,task:r.task});this.bufferTaskRefreshEvent(e),this.tasks=F(this.tasks,{action:`upserted`,task:r.task}).tasks}r?.cancelled||(this.error=c(r?.reason,d(`tasksPage.cancelFailed`)))}catch(e){this.gateway.isCurrent(t)&&(this.error=o(e,d(`tasksPage.cancelFailed`)))}finally{if(this.gateway.isCurrent(t)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async recoverTask(e,t){let n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=t===`retry`?await n.client.request(`tasks.retry`,{taskIds:[e]}):await n.client.request(`tasks.dismiss`,{taskIds:[e]});if(!this.gateway.isCurrent(n))return;let i=he(r)?.results[0];if(!i?.ok){this.error=c(i?.reason,d(`tasksPage.recoveryFailed`));return}if(i.task){let e=R({action:`upserted`,task:i.task});this.bufferTaskRefreshEvent(e),this.tasks=F(this.tasks,e).tasks}}catch(e){this.gateway.isCurrent(n)&&(this.error=o(e,d(`tasksPage.recoveryFailed`)))}finally{if(this.gateway.isCurrent(n)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async copyTaskResult(e){let t=++this.copyResultAttempt,n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r)try{let r=L(await n.client.request(`tasks.get`,{taskId:e}));if(!this.gateway.isCurrent(n)||t!==this.copyResultAttempt)return;let a=r?.result??r?.progressSummary;if(!a){this.copyResultError=d(`tasksPage.recoveryFailed`);return}let o=await i(a,()=>this.gateway.isCurrent(n)&&t===this.copyResultAttempt);this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=o?null:d(`common.copyFailed`))}catch(e){this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=o(e,d(`tasksPage.recoveryFailed`)))}}async viewTranscript(e){if(this.transcriptTaskId=e,await this.updateComplete,!this.isConnected||this.transcriptTaskId!==e)return;let t=this.querySelector(`.tasks-transcript`);t?.focus({preventScroll:!0}),t?.scrollIntoView({block:`start`,behavior:`instant`})}closeTranscript(){Ae(this.transcriptHost),this.transcriptTaskId=null}reconcileTranscriptSelection(){this.transcriptTaskId&&!this.tasks.some(e=>e.id===this.transcriptTaskId)&&this.closeTranscript()}renderTranscript(){let e=this.tasks.find(e=>e.id===this.transcriptTaskId);return e?(Object.assign(this.transcriptHost,{client:this.gateway.client,connected:this.gateway.connected,connectionEpoch:this.gateway.epoch}),b`<section
      class="tasks-transcript"
      tabindex="-1"
      aria-label=${d(`tasksPage.transcript`)}
    >
      <div class="tasks-transcript__header">
        <h2>${V(e)}</h2>
        <button class="btn btn--sm" type="button" @click=${()=>this.closeTranscript()}>
          ${d(`common.close`)}
        </button>
      </div>
      ${ke({host:this.transcriptHost,task:e})}
    </section>`):x}render(){let e=te(this.context);return b`
      ${Te({title:A(`tasks`),subtitle:k(`tasks`),actions:b`
          ${Re({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.gateway.connected||this.listTask.status===j.PENDING}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.listTask.status===j.PENDING?d(`common.refreshing`):d(`common.refresh`)}
          </button>
        `})}
      ${Pe(b`${this.renderTranscript()}${Ue({basePath:this.context.basePath,agentId:e,mainKey:ee({agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello}),connected:this.gateway.connected,canCopy:me(this.context.gateway.snapshot.hello?.auth??null),canCancel:pe(this.context.gateway.snapshot.hello?.auth??null),loading:this.listTask.status===j.PENDING,error:this.error,copyResultError:this.copyResultError,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,sessionRow:e=>m(this.context,e),onCancel:e=>void this.cancelTask(e),onRetry:e=>void this.recoverTask(e,`retry`),onDismiss:e=>void this.recoverTask(e,`dismiss`),onCopyResult:e=>void this.copyTaskResult(e),onViewTranscript:e=>void this.viewTranscript(e),onNavigateToChat:e=>{let t=ae(this.context,e);this.context.navigate(t,y({context:this.context,face:t,sessionKey:e,preferenceDerivedFace:!0}).options)}})}`)}
    `}},r([n({context:fe,subscribe:!0})],Q.prototype,`context`,void 0),r([C()],Q.prototype,`tasks`,void 0),r([C()],Q.prototype,`error`,void 0),r([C()],Q.prototype,`copyResultError`,void 0),r([C()],Q.prototype,`cancellingTaskIds`,void 0),r([C()],Q.prototype,`transcriptTaskId`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,Q)})))()}$();
//# sourceMappingURL=tasks-page-CWAb-AJO.js.map