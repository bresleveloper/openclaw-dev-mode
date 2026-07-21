import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{r as s}from"./i18n-Cb2Gon67.js";import{Bt as c,Nr as l,Pr as u,Tr as d,Vt as f}from"./index-zot7ymVq.js";import{o as p}from"./presenter-C-y4fyhH.js";function m(e){let t=!e.hostsRevealed;return i`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${s(`instances.title`)}</div>
          <div class="card-sub">${s(`instances.subtitle`)}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <openclaw-tooltip
            .content=${s(t?`instances.showHosts`:`instances.hideHosts`)}
          >
            <button
              class="btn btn--icon ${t?``:`active`}"
              @click=${e.onToggleHosts}
              aria-label=${s(`instances.toggleHostVisibility`)}
              aria-pressed=${!t}
              style="width: 36px; height: 36px;"
            >
              ${t?d.eyeOff:d.eye}
            </button>
          </openclaw-tooltip>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?s(`common.loading`):s(`common.refresh`)}
          </button>
        </div>
      </div>
      ${e.lastError?i`<div class="callout danger" style="margin-top: 12px;">${e.lastError}</div>`:a}
      ${e.statusMessage?i`<div class="callout" style="margin-top: 12px;">${e.statusMessage}</div>`:a}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?i` <div class="muted">${s(`instances.noInstances`)}</div> `:e.entries.map(e=>h(e,t))}
      </div>
    </section>
  `}function h(e,t){let n=e.lastInputSeconds==null?s(`common.na`):s(`common.secondsAgo`,{count:String(e.lastInputSeconds)}),r=e.mode??`unknown`,o=e.host??`unknown host`,c=e.ip??null,l=Array.isArray(e.roles)?e.roles.filter(Boolean):[],u=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],d=u.length>0?u.length>3?`${u.length} scopes`:`scopes: ${u.join(`, `)}`:null;return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          <span class="${t?`redacted`:``}">${o}</span>
        </div>
        <div class="list-sub">
          ${c?i`<span class="${t?`redacted`:``}">${c}</span> `:a}${r}
          ${e.version??``}
        </div>
        <div class="chip-row">
          <span class="chip">${r}</span>
          ${l.map(e=>i`<span class="chip">${e}</span>`)}
          ${d?i`<span class="chip">${d}</span>`:a}
          ${e.platform?i`<span class="chip">${e.platform}</span>`:a}
          ${e.deviceFamily?i`<span class="chip">${e.deviceFamily}</span>`:a}
          ${e.modelIdentifier?i`<span class="chip">${e.modelIdentifier}</span>`:a}
          ${e.version?i`<span class="chip">${e.version}</span>`:a}
        </div>
      </div>
      <div class="list-meta">
        <div>${p(e)}</div>
        <div class="muted">${s(`instances.lastInput`,{time:n})}</div>
        <div class="muted">${s(`instances.reason`,{reason:e.reason??``})}</div>
      </div>
    </div>
  `}function g(e){let t=e&&typeof e==`object`?e.presence:null;return Array.isArray(t)?t:null}var _=class extends o{constructor(...e){super(...e),this.loading=!1,this.entries=[],this.error=null,this.status=null,this.hostsRevealed=!1,this.client=null,this.connected=!1,this.requestId=0,this.subscriptions=[]}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribeEvents(e=>{let t=e.event===`presence`?g(e.payload):null;t&&this.applyPresence(t)}),this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e))],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.invalidateRequest(),this.client=null,this.connected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.connected&&!this.connected;if(this.client=e.client,this.connected=e.connected,t&&(this.invalidateRequest(),this.entries=[],this.error=null,this.status=null),!e.connected||!e.client){this.invalidateRequest();return}if(!t&&!n)return;let r=g(e.hello?.snapshot);r&&this.applyPresence(r),this.loadPresence()}applyPresence(e){this.invalidateRequest(),this.entries=e,this.error=null,this.status=e.length===0?`No instances yet.`:null}invalidateRequest(){this.requestId+=1,this.loading=!1}isCurrentRequest(e,t){let n=this.context.gateway.snapshot;return this.isConnected&&e===this.requestId&&n.client===t}async loadPresence(){let e=this.context.gateway.snapshot,t=e.client;if(!e.connected||!t||this.loading)return;let n=++this.requestId;this.loading=!0,this.error=null,this.status=null;try{let e=await t.request(`system-presence`,{});if(!this.isCurrentRequest(n,t))return;Array.isArray(e)?(this.entries=e,this.status=e.length===0?`No instances yet.`:null):(this.entries=[],this.status=`No presence payload.`)}catch(e){if(!this.isCurrentRequest(n,t))return;f(e)?(this.entries=[],this.status=null,this.error=c(`instance presence`)):this.error=String(e)}finally{this.isCurrentRequest(n,t)&&(this.loading=!1)}}render(){return i`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${u(`instances`)}</div>
          <div class="page-sub">${l(`instances`)}</div>
        </div>
      </section>
      ${m({loading:this.loading,entries:this.entries,lastError:this.error,statusMessage:this.status,hostsRevealed:this.hostsRevealed,onRefresh:()=>void this.loadPresence(),onToggleHosts:()=>{this.hostsRevealed=!this.hostsRevealed}})}
    `}};n([t({context:e,subscribe:!1})],_.prototype,`context`,void 0),n([r()],_.prototype,`loading`,void 0),n([r()],_.prototype,`entries`,void 0),n([r()],_.prototype,`error`,void 0),n([r()],_.prototype,`status`,void 0),n([r()],_.prototype,`hostsRevealed`,void 0),customElements.define(`openclaw-instances-page`,_);
//# sourceMappingURL=instances-page-CUKESdSx.js.map