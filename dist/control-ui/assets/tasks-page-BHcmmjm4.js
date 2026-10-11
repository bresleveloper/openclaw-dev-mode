import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-tVZcErG9.js";import{$n as i,Ar as a,Fs as o,Gl as s,Is as c,Ll as l,Ls as u,Xl as d,Yc as f,_n as p,cc as ee,cl as te,dc as ne,er as re,fc as ie,fn as m,hi as h,il as g,lc as _,mc as v,nc as ae,pc as oe,rn as se,tc as ce,zl as le}from"./control-ui-core-C1rTZu37.js";import{$ as y,X as b,Y as x,c as ue,ct as S,nt as de,s as fe}from"./lit-runtime-DAfjpehE.js";import{Di as pe,Dr as me,Er as he,Oi as C,Or as w,Qa as T,Xn as E,Yn as D,do as O,fo as k}from"./control-ui-core-CeTfuVjX.js";import{G as A,H as j,U as M,V as N}from"./control-ui-boot-shared-BsxbIh1y.js";import{Bt as P,Ht as F,Jt as I,Kt as L,Vl as R,Wt as z,Xt as ge,Yt as B,Zt as _e,an as ve,en as ye,go as be,ho as xe,in as Se,on as V,qt as Ce,rn as we}from"./control-ui-boot-shared-oNheXpJN.js";import{Ct as Te,Et as Ee,Ot as De,St as Oe,_t as H,pt as U}from"./control-ui-boot-shared-C7L8PVug.js";import{c as ke,cn as Ae,on as je,s as Me,sn as Ne}from"./control-ui-boot-shared-an5CDkE2.js";import"./control-ui-boot-shared-DCZD977I.js";import{n as Pe,t as Fe}from"./settings-workspace-By1zcCHh.js";import{n as Ie,t as Le}from"./agent-row-chip-krK2ZDus.js";import{n as Re,t as ze}from"./agent-scope-control-CTOsykqI.js";function Be(e,t){let n=e.childSessionKey??e.sessionKey;if(!n)return b;let r=t.sessionRow(n),i=v({face:ie(r),sessionKey:n,fallbackAgentId:t.agentId,basePath:t.basePath,mainKey:t.mainKey,row:r,preferenceDerivedFace:!0}).href;return y`<a
    class="session-link"
    href=${i}
    @click=${e=>{h(e)&&(e.preventDefault(),t.onNavigateToChat(n))}}
    >${d(`tasksPage.openSession`)}</a
  >`}function Ve(e,t,n){let r=e.status===`queued`||e.status===`running`,i=ve(e.updatedAt??e.createdAt),a=ye(e),o=V(e),s=t.cancellingTaskIds.has(e.id),c=e.terminalOutcome===`blocked`,l=c&&e.deliveryStatus===`failed`,u=c&&e.deliveryStatus===`dismissed`,f=r&&t.canCancel||c&&t.canCopy||l&&t.canCancel;return y`
    <div class="settings-row task-row" data-task-id=${e.id}>
      <div class="settings-row__text task-row__content">
        <div class="settings-row__title">${o}</div>
        <div class="task-row__facts">
          <span data-task-status
            >${De({kind:He(e.status),label:Se(e.status)})}</span
          >
          <span>${we(e)}</span>
          ${e.agentId?Ie(e.agentId):b}
        </div>
        ${a?y`<div class="settings-row__desc">${a}</div>`:b}
        ${c?y`<div class="task-row__warning">
                <span
                  >${d(u?`tasksPage.deliveryDismissed`:`tasksPage.deliveryBlocked`)}</span
                >
                ${l?y`<span class="muted">${d(`tasksPage.duplicateRisk`)}</span>`:b}
              </div>`:b}
      </div>
      <div class="settings-row__control task-row__control">
        <div class="task-row__links">
          ${i>0?y`<span title=${n(i)}
                  >${m(i)}</span
                >`:y`<span>${d(`common.na`)}</span>`}
          ${e.hasTranscript&&t.canCopy?y`<button class="btn btn--sm" type="button" ?disabled=${!t.connected} @click=${()=>t.onViewTranscript(e.id)}>${d(`tasksPage.viewTranscript`)}</button>`:b}
          ${Be(e,t)}
        </div>
        ${f?y`<div class="task-row__actions">
                ${r&&t.canCancel?y`<button
                        class="btn btn--sm"
                        type="button"
                        aria-label=${d(`tasksPage.cancelTask`,{title:o})}
                        ?disabled=${s||!t.connected}
                        @click=${()=>t.onCancel(e.taskId)}
                      >
                        ${d(s?`tasksPage.cancelling`:`common.cancel`)}
                      </button>`:b}
                ${c&&t.canCopy?y`<button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${s||!t.connected}
                        @click=${()=>t.onCopyResult(e.taskId)}
                      >
                        ${d(`tasksPage.copyResult`)}
                      </button>`:b}
                ${l&&t.canCancel?y`
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
                      `:b}
              </div>`:b}
      </div>
    </div>
  `}function He(e){switch(e){case`completed`:return`ok`;case`failed`:case`timed_out`:return`danger`;case`queued`:case`running`:return`warn`;case`cancelled`:return`muted`}return e}function W(e,...t){return e.filter(e=>t.includes(e.status)).length}function G(e,t){let n=e===`active`?[[W(t,`running`),d(`tasksPage.status.running`)],[W(t,`queued`),d(`tasksPage.status.queued`)]]:[[W(t,`completed`),d(`tasksPage.status.completed`)],[W(t,`failed`,`timed_out`),d(`tasksPage.status.failed`)]];return y`<span class="task-heading-facts">
    ${n.map(([e,t],n)=>y`
        ${n>0?y`<span aria-hidden="true">·</span>`:b}
        <span><strong>${e}</strong> ${t}</span>
      `)}
  </span>`}function K(e,t,n,r,i,a){let o=n.length===0?H(r):ue(n,e=>e.id,e=>Ve(e,i,a));return y`<div data-task-section=${e}>
    ${Ee({title:y`${t}${G(e,n)}`},o)}
  </div>`}function Ue(e){let t=se(),{active:n,recent:r}=_e(e.tasks);return Oe(y`<div class="tasks-page-list">
      ${e.connected?b:y`<div class="callout warn">${d(`tasksPage.disconnected`)}</div>`}
      ${e.error?y`<div class="callout danger" role="alert">${e.error}</div>`:b}
      ${e.copyResultError?y`<div class="callout danger" role="alert">${e.copyResultError}</div>`:b}
      ${e.loading&&e.tasks.length===0?H(d(`tasksPage.loading`)):b}
      ${!e.loading&&e.tasks.length===0?H(d(`tasksPage.empty`)):b}
      ${K(`active`,d(`tasksPage.active`),n,d(`tasksPage.emptyActive`),e,t)}
      ${K(`recent`,d(`tasksPage.recent`),r,d(`tasksPage.emptyRecent`),e,t)}
    </div>`,{wide:!0})}function q(){return(q=e((()=>{x(),fe(),Le(),U(),s(),p(),_(),F()})))()}function J(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>g(e)?.agentId===t):!0}function We(e){return e instanceof D&&e.gatewayCode===`INVALID_REQUEST`}async function Ge(e){let t=[],n,r=new Set;for(;;){let i;try{i=await e.client.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...e.agentId?{agentId:e.agentId}:{},...n===void 0?{}:{cursor:n}},{signal:e.signal})}catch(e){throw n!==void 0&&We(e)?new X(e):e}let a=B(i);if(!a)throw Error(d(`tasksPage.invalidResponse`));if(t=z(t,a.tasks),a.nextCursor===void 0)return t;if(!a.nextCursor||r.has(a.nextCursor))throw new X(Error(d(`tasksPage.invalidResponse`)));r.add(a.nextCursor),n=a.nextCursor}}async function Y(e){let[t,n]=await Promise.all([Ge(e),e.client.request(`tasks.list`,{status:Z,sortBy:`endedAt`,limit:200,...e.agentId?{agentId:e.agentId}:{}},{signal:e.signal})]),r=B(n);if(!r)throw Error(d(`tasksPage.invalidResponse`));return{active:t,recent:r.tasks}}async function Ke(e){try{return await Y(e)}catch(t){if(!(t instanceof X))throw t;return await Y(e)}}var X,Z,Q;function $(){return($=e((()=>{t(),N(),x(),de(),E(),T(),C(),w(),ze(),U(),Fe(),s(),a(),re(),u(),_(),f(),F(),be(),le(),ae(),je(),Me(),q(),X=class extends Error{constructor(e){super(`task list continuation failed`),this.reason=e}},Z=[`completed`,`failed`,`timed_out`,`cancelled`],Q=class extends l{constructor(...e){super(...e),this.tasks=[],this.error=null,this.copyResultError=null,this.cancellingTaskIds=new Set,this.transcriptTaskId=null,this.transcriptHost={client:null,connected:!1,requestUpdate:()=>this.requestUpdate()},this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!1,this.copyResultAttempt=0,this.gateway=new xe(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.tasks=[],this.taskSnapshotInvalidated=!1,this.error=null,this.copyResultError=null},invalidateRequests:()=>this.cancelGatewayWork(),onSnapshot:()=>{this.gateway.connected&&this.context.agents.ensureList()},ensureInitialData:()=>void this.refreshTasks()}),this.observeAgentScope=R(()=>{this.gateway.invalidate(),this.cancelGatewayWork(),this.invalidateTaskSnapshot(),this.gateway.connected&&this.refreshTasks(),this.requestUpdate()}),this.listTask=new j(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.scopeId??null],task:async([e,t,n],{signal:r})=>{if(!e||!t)return M;let i={gateway:e,client:t,scopeId:n,events:[]};return this.taskRefreshEvents=i,{...await Ke({client:t,agentId:n??void 0,signal:r}),buffer:i}},onComplete:({active:e,recent:t,buffer:n})=>{let r=z(e,t);for(let e of n.events)r=P(r,e).tasks;this.taskSnapshotInvalidated=!1,this.tasks=r,this.reconcileTranscriptSelection(),this.taskRefreshEvents===n&&(this.taskRefreshEvents=null)},onError:e=>{e instanceof X?this.invalidateTaskSnapshot():this.taskRefreshEvents=null,this.error=o(e instanceof X?e.reason:e,d(`tasksPage.loadFailed`))}}),this.subscriptions=new ce(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`task`)return;let n=this.context.agentSelection.state.scopeId,r=L(t.payload);if((r?.action===`deleted`||r?.action===`upserted`&&J(r.task,n))&&this.bufferTaskRefreshEvent(r),this.taskSnapshotInvalidated)return;let i=P(this.tasks,t.payload);if(i.refetch){this.refreshTasks();return}this.tasks=i.tasks.filter(e=>J(e,n)),this.reconcileTranscriptSelection(),r&&Ne(this.transcriptHost,r)})).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}bufferTaskRefreshEvent(e){let t=this.taskRefreshEvents;e&&e.action!==`restored`&&t&&t.gateway===this.gateway.gateway&&t.client===this.gateway.client&&t.scopeId===this.context.agentSelection.state.scopeId&&t.events.push(e)}invalidateTaskSnapshot(){this.closeTranscript(),this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!0,this.tasks=[]}disconnectedCallback(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.subscriptions.clear(),super.disconnectedCallback()}cancelGatewayWork(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.taskRefreshEvents=null,this.listTask.run([null,null,null]),this.cancellingTaskIds=new Set}refreshTasks(){let e=this.gateway.gateway,t=this.gateway.client;if(!e||this.context.gateway!==e||!this.gateway.connected||!t)return Promise.resolve();let n=this.context.agentSelection.state.scopeId;return this.error=null,this.copyResultError=null,this.listTask.run([e,t,n])}async cancelTask(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(t&&n&&this.context.gateway===n&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let n=await t.client.request(`tasks.cancel`,{taskId:e});if(!this.gateway.isCurrent(t))return;let r=Ce(n);if(r?.task){let e=L({action:`upserted`,task:r.task});this.bufferTaskRefreshEvent(e),this.tasks=P(this.tasks,{action:`upserted`,task:r.task}).tasks}r?.cancelled||(this.error=c(r?.reason,d(`tasksPage.cancelFailed`)))}catch(e){this.gateway.isCurrent(t)&&(this.error=o(e,d(`tasksPage.cancelFailed`)))}finally{if(this.gateway.isCurrent(t)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async recoverTask(e,t){let n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=t===`retry`?await n.client.request(`tasks.retry`,{taskIds:[e]}):await n.client.request(`tasks.dismiss`,{taskIds:[e]});if(!this.gateway.isCurrent(n))return;let i=ge(r)?.results[0];if(!i?.ok){this.error=c(i?.reason,d(`tasksPage.recoveryFailed`));return}if(i.task){let e=L({action:`upserted`,task:i.task});this.bufferTaskRefreshEvent(e),this.tasks=P(this.tasks,e).tasks}}catch(e){this.gateway.isCurrent(n)&&(this.error=o(e,d(`tasksPage.recoveryFailed`)))}finally{if(this.gateway.isCurrent(n)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async copyTaskResult(e){let t=++this.copyResultAttempt,n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r)try{let r=I(await n.client.request(`tasks.get`,{taskId:e}));if(!this.gateway.isCurrent(n)||t!==this.copyResultAttempt)return;let a=r?.result??r?.progressSummary;if(!a){this.copyResultError=d(`tasksPage.recoveryFailed`);return}let o=await i(a,()=>this.gateway.isCurrent(n)&&t===this.copyResultAttempt);this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=o?null:d(`common.copyFailed`))}catch(e){this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=o(e,d(`tasksPage.recoveryFailed`)))}}async viewTranscript(e){if(this.transcriptTaskId=e,await this.updateComplete,!this.isConnected||this.transcriptTaskId!==e)return;let t=this.querySelector(`.tasks-transcript`);t?.focus({preventScroll:!0}),t?.scrollIntoView({block:`start`,behavior:`instant`})}closeTranscript(){Ae(this.transcriptHost),this.transcriptTaskId=null}reconcileTranscriptSelection(){this.transcriptTaskId&&!this.tasks.some(e=>e.id===this.transcriptTaskId)&&this.closeTranscript()}renderTranscript(){let e=this.tasks.find(e=>e.id===this.transcriptTaskId);return e?(Object.assign(this.transcriptHost,{client:this.gateway.client,connected:this.gateway.connected,connectionEpoch:this.gateway.epoch}),y`<section
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
    </section>`):b}render(){let e=ne(this.context);return y`
      ${Te({title:k(`tasks`),subtitle:O(`tasks`),actions:y`
          ${Re({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.gateway.connected||this.listTask.status===A.PENDING}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.listTask.status===A.PENDING?d(`common.refreshing`):d(`common.refresh`)}
          </button>
        `})}
      ${Pe(y`${this.renderTranscript()}${Ue({basePath:this.context.basePath,agentId:e,mainKey:te({agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello}),connected:this.gateway.connected,canCopy:he(this.context.gateway.snapshot.hello?.auth??null),canCancel:me(this.context.gateway.snapshot.hello?.auth??null),loading:this.listTask.status===A.PENDING,error:this.error,copyResultError:this.copyResultError,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,sessionRow:e=>ee(this.context,e),onCancel:e=>void this.cancelTask(e),onRetry:e=>void this.recoverTask(e,`retry`),onDismiss:e=>void this.recoverTask(e,`dismiss`),onCopyResult:e=>void this.copyTaskResult(e),onViewTranscript:e=>void this.viewTranscript(e),onNavigateToChat:e=>{let t=oe(this.context,e);this.context.navigate(t,v({context:this.context,face:t,sessionKey:e,preferenceDerivedFace:!0}).options)}})}`)}
    `}},r([n({context:pe,subscribe:!0})],Q.prototype,`context`,void 0),r([S()],Q.prototype,`tasks`,void 0),r([S()],Q.prototype,`error`,void 0),r([S()],Q.prototype,`copyResultError`,void 0),r([S()],Q.prototype,`cancellingTaskIds`,void 0),r([S()],Q.prototype,`transcriptTaskId`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,Q)})))()}$();
//# sourceMappingURL=tasks-page-BHcmmjm4.js.map