import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,du as a,ju as o,kc as s,pu as c}from"./control-ui-core-bJHyI7AF.js";import{$t as l,Ti as u,Xt as d,at as f,it as p,ot as m,wi as h}from"./control-ui-core-DNh4McGE.js";import{$ as g,X as _,Y as v,ct as y,nt as b,ut as x}from"./lit-runtime-DyST807n.js";import{Xr as S,Zr as C,fa as w,ii as T}from"./ui-DeikvIdP.js";import{$n as E,In as D,Jn as O,er as k,s as A,u as j}from"./control-ui-boot-chat-DfNf0poH.js";import{n as M}from"./browser-panel-hrCskS6g.js";var N;function P(){return(P=e((()=>{C(),v(),b(),u(),d(),p(),A(),D(),M(),r(),E(),i(),t(),c(),k(),N=class extends n{constructor(){super(),this.session={sessionKey:``},this.active=!0,this.pending=!1,this.generation=0,this.refreshNeeded=!1,new s(this).watch(()=>this.context?.gateway,(e,t)=>{let n=e.subscribe(t),r=e.subscribeEvents(e=>{let t=w(e.payload);e.event===`plugin.browser.dashboard_changed`&&t?.instanceId===this.widget?.instanceId&&t?.name===this.widget?.name&&(this.refreshNeeded=!0,this.active&&this.request(`inspect`))});return()=>{n(),r()}})}willUpdate(){let e=this.context?.gateway.snapshot.client??null,t=JSON.stringify([this.session,this.widget?.instanceId,this.widget?.name,this.widget?.props,this.context?.gateway.snapshot.hello?.auth]);(this.scope?.key!==t||this.scope.client!==e)&&(this.scope={key:t,client:e},this.generation+=1,this.dashboard=void 0,this.error=void 0,this.pending=!1,this.refreshNeeded=!1),this.active&&this.available&&!this.pending&&!this.error&&(this.refreshNeeded?this.request(`inspect`):(!this.dashboard||!this.dashboard.paused&&!this.dashboard.browserTab)&&this.request(`open`))}disconnectedCallback(){this.generation+=1,this.scope=void 0,super.disconnectedCallback()}get available(){return!!(this.context&&f(this.context.gateway.snapshot))}get sessionScoped(){return!(!this.context||m(this.context.gateway.snapshot))}async request(e){let t=this.context?.gateway.snapshot.client,n=this.widget?.instanceId;if(!t||!this.available||!this.widget||this.pending)return;if(!n){this.error=Error(o(`browser.dashboardMissingIdentity`));return}let r=++this.generation;e===`inspect`&&(this.refreshNeeded=!1),this.pending=!0,this.error=void 0;try{let i=await O(t,{...this.session,name:this.widget.name,instanceId:n,...this.sessionScoped?{sessionScoped:!0}:{}},e);this.isConnected&&r===this.generation&&t===this.scope?.client&&(this.dashboard=i)}catch(e){this.isConnected&&r===this.generation&&(this.error=e)}finally{this.isConnected&&r===this.generation&&(this.pending=!1,this.refreshNeeded&&this.active&&this.request(`inspect`))}}render(){let e=this.context?.gateway,t=this.dashboard;return!this.active&&!t?_:!e||!this.available?g`<p class="board-browser__notice">${o(`browser.dashboardUnavailable`)}</p>`:g`<div class="board-browser" data-chat-autotype-exempt>
      <div class="board-browser__content">
        ${t?.browserTab&&!t.paused?g`<openclaw-browser-panel
                embedded
                .client=${e.snapshot.client}
                .available=${this.available}
                .remoteAvailable=${this.available}
                .presented=${this.active}
                .sessionKey=${t.sessionKey}
                .fixedTab=${t.browserTab}
                .dashboardTarget=${{...this.session,name:t.name,instanceId:t.instanceId,...this.sessionScoped?{sessionScoped:!0}:{}}}
                .resourceBasePath=${this.context?.resourceBasePath??``}
                .authToken=${l({hello:e.snapshot.hello,password:e.connection.password,settings:{token:e.connection.token}})}
              ></openclaw-browser-panel>`:this.error?j(this.error,()=>void this.request(`open`)):g` <p class="board-browser__notice" role="status">
                  ${o(t?.stopping?`browser.dashboardStopping`:t?.paused?`browser.dashboardStopped`:`browser.loading`)}
                </p>`}
      </div>
      <div class="board-browser__footer">
        <span
          >${o(this.sessionScoped?`browser.dashboardSessionShared`:`browser.dashboardShared`)}</span
        >
        <div>
          <button
            type="button"
            class="btn btn--small"
            ?disabled=${this.pending}
            @click=${()=>void this.request(t?.stopping?`stop`:t?.paused?`resume`:`open`)}
          >
            ${o(t?.stopping?`browser.dashboardRetryStop`:t?.paused?`browser.dashboardResume`:`browser.dashboardReconnect`)}
          </button>
          ${t?.browserTab&&!t.paused?g`<button
                  type="button"
                  class="btn btn--small"
                  ?disabled=${this.pending}
                  @click=${()=>void this.request(`stop`)}
                >
                  ${o(`browser.dashboardStop`)}
                </button>`:_}
        </div>
      </div>
      ${this.error&&t?.browserTab?g`<p role="alert" class="board-browser__error">${a(this.error)}</p>`:_}
    </div>`}},T([S({context:h,subscribe:!0})],N.prototype,`context`,void 0),T([x({attribute:!1})],N.prototype,`widget`,void 0),T([x({attribute:!1})],N.prototype,`session`,void 0),T([x({type:Boolean})],N.prototype,`active`,void 0),T([y()],N.prototype,`dashboard`,void 0),T([y()],N.prototype,`error`,void 0),T([y()],N.prototype,`pending`,void 0),customElements.get(`openclaw-browser-dashboard-widget`)||customElements.define(`openclaw-browser-dashboard-widget`,N)})))()}P();
//# sourceMappingURL=browser-DNRyhpk_.js.map