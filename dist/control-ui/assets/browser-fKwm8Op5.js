import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Wi as n,Zr as r,ai as i}from"./control-ui-foundation-Ds5QQwGa.js";import{Fs as a,Gl as o,Ll as s,Ls as c,Xl as l,nc as u,tc as d,zl as f}from"./control-ui-core-DkXlmHxW.js";import{$ as p,X as m,Y as h,ct as g,nt as _,ut as v}from"./lit-runtime-DLvISeBM.js";import{Di as y,It as b,Oi as x,it as S,rt as C,zt as w}from"./control-ui-core-BdNTI4B-.js";import{Fr as T,Pr as E}from"./control-ui-boot-shared-XNIZlLuA.js";import{M as D,Nn as O,k,xn as A}from"./control-ui-boot-shared-C5a8_33C.js";import{t as j}from"./browser-panel-9sUs2Jdz.js";var M;function N(){return(N=e((()=>{t(),h(),_(),x(),b(),C(),k(),A(),j(),o(),E(),f(),u(),c(),T(),M=class extends s{constructor(){super(),this.session={sessionKey:``},this.active=!0,this.pending=!1,this.generation=0,this.refreshNeeded=!1,new d(this).watch(()=>this.context?.gateway,(e,t)=>{let r=e.subscribe(t),i=e.subscribeEvents(e=>{let t=n(e.payload);e.event===`plugin.browser.dashboard_changed`&&t?.instanceId===this.widget?.instanceId&&t?.name===this.widget?.name&&(this.refreshNeeded=!0,this.active&&this.request(`inspect`))});return()=>{r(),i()}})}willUpdate(){let e=this.context?.gateway.snapshot.client??null,t=JSON.stringify([this.session,this.widget?.instanceId,this.widget?.name,this.widget?.props]);(this.scope?.key!==t||this.scope.client!==e)&&(this.scope={key:t,client:e},this.generation+=1,this.dashboard=void 0,this.error=void 0,this.pending=!1,this.refreshNeeded=!1),this.active&&this.available&&!this.pending&&!this.error&&(this.refreshNeeded?this.request(`inspect`):(!this.dashboard||!this.dashboard.paused&&!this.dashboard.browserTab)&&this.request(`open`))}disconnectedCallback(){this.generation+=1,this.scope=void 0,super.disconnectedCallback()}get available(){return!!(this.context&&S(this.context.gateway.snapshot))}async request(e){let t=this.context?.gateway.snapshot.client,n=this.widget?.instanceId;if(!t||!this.available||!this.widget||this.pending)return;if(!n){this.error=Error(l(`browser.dashboardMissingIdentity`));return}let r=++this.generation;e===`inspect`&&(this.refreshNeeded=!1),this.pending=!0,this.error=void 0;try{let i=await O(t,{...this.session,name:this.widget.name,instanceId:n},e);this.isConnected&&r===this.generation&&t===this.scope?.client&&(this.dashboard=i)}catch(e){this.isConnected&&r===this.generation&&(this.error=e)}finally{this.isConnected&&r===this.generation&&(this.pending=!1,this.refreshNeeded&&this.active&&this.request(`inspect`))}}render(){let e=this.context?.gateway,t=this.dashboard;return!this.active&&!t?m:!e||!this.available?p`<p class="board-browser__notice">${l(`browser.dashboardUnavailable`)}</p>`:p`<div class="board-browser" data-chat-autotype-exempt>
      <div class="board-browser__content">
        ${t?.browserTab&&!t.paused?p`<openclaw-browser-panel
                embedded
                .client=${e.snapshot.client}
                .available=${this.available}
                .remoteAvailable=${this.available}
                .presented=${this.active}
                .sessionKey=${t.sessionKey}
                .fixedTab=${t.browserTab}
                .dashboardTarget=${{...this.session,name:t.name,instanceId:t.instanceId}}
                .resourceBasePath=${this.context?.resourceBasePath??``}
                .authToken=${w({hello:e.snapshot.hello,password:e.connection.password,settings:{token:e.connection.token}})}
              ></openclaw-browser-panel>`:this.error?D(this.error,()=>void this.request(`open`)):p` <p class="board-browser__notice" role="status">
                  ${l(t?.stopping?`browser.dashboardStopping`:t?.paused?`browser.dashboardStopped`:`browser.loading`)}
                </p>`}
      </div>
      <div class="board-browser__footer">
        <span>${l(`browser.dashboardShared`)}</span>
        <div>
          <button
            type="button"
            class="btn btn--small"
            ?disabled=${this.pending}
            @click=${()=>void this.request(t?.stopping?`stop`:t?.paused?`resume`:`open`)}
          >
            ${l(t?.stopping?`browser.dashboardRetryStop`:t?.paused?`browser.dashboardResume`:`browser.dashboardReconnect`)}
          </button>
          ${t?.browserTab&&!t.paused?p`<button
                  type="button"
                  class="btn btn--small"
                  ?disabled=${this.pending}
                  @click=${()=>void this.request(`stop`)}
                >
                  ${l(`browser.dashboardStop`)}
                </button>`:m}
        </div>
      </div>
      ${this.error&&t?.browserTab?p`<p role="alert" class="board-browser__error">${a(this.error)}</p>`:m}
    </div>`}},i([r({context:y,subscribe:!0})],M.prototype,`context`,void 0),i([v({attribute:!1})],M.prototype,`widget`,void 0),i([v({attribute:!1})],M.prototype,`session`,void 0),i([v({type:Boolean})],M.prototype,`active`,void 0),i([g()],M.prototype,`dashboard`,void 0),i([g()],M.prototype,`error`,void 0),i([g()],M.prototype,`pending`,void 0),customElements.get(`openclaw-browser-dashboard-widget`)||customElements.define(`openclaw-browser-dashboard-widget`,M)})))()}N();
//# sourceMappingURL=browser-fKwm8Op5.js.map