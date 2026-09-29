import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as i,Gl as a,Ll as o,Ls as s,Xl as c,nc as l,nu as u,ri as d,tc as f,tu as p,zl as m}from"./control-ui-core-DX6662ze.js";import{$ as h,X as g,Y as _,_ as v,b as y,ct as b,m as x,nt as S,ut as C,x as w}from"./lit-runtime-BOUQsi_O.js";import{Di as T,Ii as E,Oi as D,Pi as O,Qa as k,fo as A}from"./control-ui-core-QgEwr0pF.js";import{c as j,s as M,u as N}from"./gateway-runtime-DGdfj77o.js";import{aa as P,mo as F,oa as I,po as L}from"./control-ui-boot-shared-gJH8zZtq.js";var R,z;function B(){return(B=e((()=>{u(),R={portalsPage:{listLabel:`Active portals`,portLabel:`Port {port}`,openNewTab:`Open in new tab`,closePortal:`Close {title}`,previewTitle:`{title} portal preview`,loading:`Loading portals…`,emptyHint:`Ask the agent to start a portal:`,unavailable:`This portal is no longer available. Ask the agent to reopen the application.`,environmentStarting:`Starting your machine…`,waitingForApp:`Machine ready. Waiting for your application…`,environmentUnavailable:`The machine could not start. Ask the agent to check it or try again.`,promptShow:`Show me in a portal.`,promptStart:`Start the application in a portal.`,promptMakeAvailable:`Make the server available in a portal.`,unsupported:`This gateway does not support portals.`,loadFailed:`Could not load portals: {error}`,closeFailed:`Could not close the portal: {error}`,unreachableTitle:`Portal not reachable from this browser`,unreachableBody:`Check the portal URL's DNS, TLS, and network access. For private Tailscale Serve, allow its HTTPS port in your tailnet policy. For a reverse proxy, check the dedicated portal ingress route, then retry.`,newTabRequiredTitle:`Open this HTTP portal in a new tab`,newTabRequiredBody:`This portal uses HTTP with a different hostname or scheme from the Control UI. Open the link in a new tab so its authentication cookies work, or use an HTTPS portal for an embedded preview.`,ingressRequiredTitle:`Remote portal ingress required`,ingressRequiredBody:`This Gateway returned a loopback URL, which points to this browser's machine. Use a browser on the Gateway host, enable managed private Tailscale Serve, or configure gateway.portals.ingress with a separate private HTTPS wildcard proxy. Forwarding only the Gateway port is not enough.`,writeAccessRequiredTitle:`Write access required`,writeAccessRequiredBody:`This portal requires an operator with write access.`,retry:`Retry`}},z=Object.assign(()=>{p.portalsPage=R.portalsPage},{catalog:R})})))()}function V(e,t){try{return new URL(e.blockedURI).origin===t.origin}catch{return!1}}async function H(e){let t;try{t=new URL(e)}catch{return`unreachable`}let n=!1,r=e=>{V(e,t)&&(n=!0)},i=typeof document>`u`?void 0:document;i?.addEventListener(`securitypolicyviolation`,r);try{return await fetch(e,{mode:`no-cors`,signal:AbortSignal.timeout(U)}),`reachable`}catch{return await new Promise(e=>{setTimeout(e,0)}),n?`blocked`:`unreachable`}finally{i?.removeEventListener(`securitypolicyviolation`,r)}}var U;function W(){return(W=e((()=>{U=4e3})))()}function G(e,t){let n=new URL(e),r=new URL(t);return n.protocol===`http:`&&(r.protocol!==n.protocol||r.hostname!==n.hostname)}function K(e,t){return d(new URL(e).hostname)&&!d(new URL(t).hostname)}function q(){return(q=e((()=>{})))()}var J,Y;function X(){return(X=e((()=>{t(),_(),S(),y(),x(),k(),D(),E(),a(),B(),s(),j(),F(),m(),I(),l(),W(),q(),z(),J=`allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts`,Y=class extends o{constructor(...e){super(...e),this.embedded=!1,this.presented=!0,this.requestedPortalId=null,this.requestedEnvironmentId=null,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeState=null,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentRequestGeneration=0,this.environmentLoading=!1,this.environmentPoll=new P(this,2e3,()=>void this.loadPendingEnvironment(),!1),this.requestGeneration=0,this.portalSetRevision=0,this.portalProbeGeneration=0,this.portalProbeCache=new Map,this.gateway=new L(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetGatewayState(),ensureInitialData:()=>void this.loadPresentation()}),this.subscriptions=new f(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&t.event===`portal.changed`&&this.loadPresentation()}))}disconnectedCallback(){this.environmentRequestGeneration+=1,this.portalProbeGeneration+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(e){[`requestedPortalId`,`requestedEnvironmentId`].some(t=>e.has(t)&&e.get(t)!==void 0)?(this.requestGeneration+=1,this.environmentRequestGeneration+=1,this.environmentLoading=!1,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentPoll.stop(),this.loading=!1,this.portalProbeGeneration+=1,this.portalProbeState=null,this.applyPortalSet(this.portals),this.loadPresentation()):e.has(`presented`)&&e.get(`presented`)!==void 0&&this.presented?this.loadPresentation():e.has(`presented`)&&!this.presented&&(this.environmentPoll.stop(),this.environmentRequestGeneration+=1,this.environmentLoading=!1)}handleToggleRequest(e){let t=e instanceof CustomEvent?e.detail:null;if(t?.open!==!1){if(t?.portalId&&(t.portalId!==this.requestedPortalId||this.requestedEnvironmentId!==null)){this.requestedPortalId=t.portalId,this.requestedEnvironmentId=null;return}if(t?.environmentId&&(t.environmentId!==this.requestedEnvironmentId||this.requestedPortalId!==null)){this.requestedEnvironmentId=t.environmentId,this.requestedPortalId=null;return}this.loadPresentation()}}get pendingEnvironmentId(){return this.requestedPortalId?null:this.requestedEnvironmentId}async loadPresentation(){this.pendingEnvironmentId?await this.loadPendingEnvironment():await this.loadPortals()}async loadPendingEnvironment(){let e=this.pendingEnvironmentId,t=this.gateway.client,n=this.gateway.capture();if(!e||!t||!n||this.environmentLoading||this.embedded&&!this.presented)return;let r=++this.environmentRequestGeneration,a=()=>this.gateway.isCurrent(n)&&r===this.environmentRequestGeneration&&this.pendingEnvironmentId===e;this.environmentLoading=!0,this.environmentFailure=null;try{let n=await t.request(`environments.status`,{environmentId:e});if(!a())return;if(n.id!==e)throw Error(`Environment status returned a different target`);this.pendingEnvironment=n,n.status===`starting`?this.environmentPoll.start():this.environmentPoll.stop()}catch(t){a()&&(this.environmentFailure={environmentId:e,message:i(t)},this.environmentPoll.stop())}finally{a()&&(this.environmentLoading=!1)}}get portalListSupported(){return N(this.gateway.snapshot??{},`portal.list`)!==!1}get canClosePortal(){return M(this.gateway.snapshot,`portal.close`,`operator.write`)}resetGatewayState(){this.environmentRequestGeneration+=1,this.environmentLoading=!1,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentPoll.stop(),this.requestGeneration+=1,this.portalSetRevision+=1,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeGeneration+=1,this.portalProbeCache.clear(),this.portalProbeState=null}applyPortalSet(e){this.portalSetRevision+=1,this.portals=[...e];let t=this.selectedPortalId,n=this.pendingEnvironmentId?null:this.requestedPortalId??(e.some(e=>e.id===t)?this.selectedPortalId:e[0]?.id??null);this.selectedPortalId=n,this.loaded=!0,this.error=null;let r=e.find(e=>e.id===n);r?this.ensurePortalProbe(r,n!==t):(this.portalProbeGeneration+=1,this.portalProbeState=null)}ensurePortalProbe(e,t=!1){if(!e.tokenQuery||!e.url){this.portalProbeGeneration+=1,this.portalProbeState=null;return}let n=e.url,r=`${e.id}\u0000${n}`;if(!t&&this.portalProbeState?.key===r)return;if(K(n,this.context.gateway.connection.gatewayUrl)){this.portalProbeGeneration+=1,this.portalProbeState={key:r,status:`ingress-required`};return}if(G(n,location.href)){this.portalProbeGeneration+=1,this.portalProbeState={key:r,status:`new-tab-required`};return}let i=t?void 0:this.portalProbeCache.get(r);if(i!==void 0){this.portalProbeState={key:r,status:i};return}let a=++this.portalProbeGeneration;this.portalProbeState={key:r,status:`probing`},H(n).then(e=>{a===this.portalProbeGeneration&&this.portalProbeState?.key===r&&(this.portalProbeCache.set(r,e),this.portalProbeState={key:r,status:e})})}selectPortal(e){e.id!==this.selectedPortalId&&(this.selectedPortalId=e.id,this.ensurePortalProbe(e,!0))}async loadPortals(){if(this.pendingEnvironmentId||!this.gateway.connected||!this.portalListSupported||this.loading||this.embedded&&!this.presented)return;let e=this.gateway.client,t=this.gateway.capture();if(!e||!t)return;let n=++this.requestGeneration,r=this.portalSetRevision;this.loading=!0,this.error=null;try{let i=await e.request(`portal.list`,{});n===this.requestGeneration&&r===this.portalSetRevision&&this.gateway.isCurrent(t)&&this.applyPortalSet(i.portals)}catch(e){n===this.requestGeneration&&this.gateway.isCurrent(t)&&this.portalListSupported&&(this.error=c(`portalsPage.loadFailed`,{error:i(e)}),this.loaded=!0)}finally{n===this.requestGeneration&&this.gateway.isCurrent(t)&&(this.loading=!1)}}async closePortal(e){if(!this.canClosePortal||this.closingPortalId)return;let t=this.gateway.client,n=this.gateway.capture();if(t&&n){this.closingPortalId=e.id,this.error=null;try{await t.request(`portal.close`,{id:e.id}),this.gateway.isCurrent(n)&&this.loadPortals()}catch(e){this.gateway.isCurrent(n)&&(this.error=c(`portalsPage.closeFailed`,{error:i(e)}))}finally{this.gateway.isCurrent(n)&&this.closingPortalId===e.id&&(this.closingPortalId=null)}}}renderEmptyState(){let e=!this.portalListSupported;return h`
      <section class="portals-empty" role="status" aria-live="polite">
        ${this.loading&&!this.loaded?h`<div class="portals-empty__title">${c(`portalsPage.loading`)}</div>`:h`
                <div class="portals-empty__title">
                  ${c(this.requestedPortalId?`portalsPage.unavailable`:`portalsPage.emptyHint`)}
                </div>
                ${this.requestedPortalId?g:h`<div class="portals-empty__prompts">
                        <span>${c(`portalsPage.promptShow`)}</span>
                        <span>${c(`portalsPage.promptStart`)}</span>
                        <span>${c(`portalsPage.promptMakeAvailable`)}</span>
                      </div>`}
              `}
        ${e?h`<div class="portals-empty__note">${c(`portalsPage.unsupported`)}</div>`:g}
        ${this.error?h`<div class="callout danger">${this.error}</div>`:g}
      </section>
    `}renderPortal(e){if(!e.tokenQuery||!e.url)return h`
        <section class="portals-preview">
          <div class="portals-preview__notice" role="status">
            <div class="portals-preview__notice-title">
              ${c(`portalsPage.writeAccessRequiredTitle`)}
            </div>
            <p>${c(`portalsPage.writeAccessRequiredBody`)}</p>
          </div>
        </section>
      `;let t=e.url,n=new URL(t);n.search=``;let r=`${e.id}\u0000${t}`,i=this.portalProbeState?.key===r?this.portalProbeState.status:`probing`;return h`
      <section class="portals-preview">
        <header class="portals-preview__header">
          <a
            class="portals-preview__url"
            href=${t}
            target="_blank"
            rel="noopener noreferrer"
            title=${n.href}
          >
            <span>${n.href}</span>
            ${O(`externalLink`)}
            <span class="sr-only">${c(`portalsPage.openNewTab`)}</span>
          </a>
          <button
            class="btn btn--icon btn--ghost portals-preview__close"
            type="button"
            title=${c(`portalsPage.closePortal`,{title:e.title})}
            aria-label=${c(`portalsPage.closePortal`,{title:e.title})}
            ?disabled=${!this.canClosePortal||this.closingPortalId===e.id}
            @click=${()=>void this.closePortal(e)}
          >
            ${O(`x`)}
          </button>
        </header>
        ${this.error?h`<div class="callout danger portals-preview__error">${this.error}</div>`:g}
        ${i===`probing`?h`
                <div class="portals-empty portals-preview__state" role="status" aria-live="polite">
                  <div class="portals-empty__title">${c(`portalsPage.loading`)}</div>
                </div>
              `:i===`unreachable`||i===`ingress-required`||i===`new-tab-required`?h`
                  <div class="portals-preview__notice" role="status">
                    <div class="portals-preview__notice-title">
                      ${c(i===`new-tab-required`?`portalsPage.newTabRequiredTitle`:i===`ingress-required`?`portalsPage.ingressRequiredTitle`:`portalsPage.unreachableTitle`)}
                    </div>
                    <p>
                      ${c(i===`new-tab-required`?`portalsPage.newTabRequiredBody`:i===`ingress-required`?`portalsPage.ingressRequiredBody`:`portalsPage.unreachableBody`)}
                    </p>
                    <a
                      class="portals-preview__notice-url"
                      href=${t}
                      target="_blank"
                      rel="noopener noreferrer"
                      >${n.href}</a
                    >
                    <button
                      class="btn"
                      type="button"
                      @click=${()=>this.ensurePortalProbe(e,!0)}
                    >
                      ${c(`portalsPage.retry`)}
                    </button>
                  </div>
                `:w(r,h`<iframe
                    ${v(e=>{e instanceof HTMLIFrameElement&&!e.hasAttribute(`src`)&&e.setAttribute(`src`,t)})}
                    class="portals-preview__frame"
                    title=${c(`portalsPage.previewTitle`,{title:e.title})}
                    referrerpolicy="no-referrer"
                    sandbox=${J}
                  ></iframe>`)}
      </section>
    `}render(){if(this.pendingEnvironmentId){let e=this.pendingEnvironment?.id===this.pendingEnvironmentId?this.pendingEnvironment:null,t=this.environmentFailure?.environmentId===this.pendingEnvironmentId?this.environmentFailure.message:null,n=t||e&&e.status!==`starting`&&e.status!==`available`;return h`<section class="portals-empty" role="status" aria-live="polite">
        <div class="portals-empty__title">
          ${c(n?`portalsPage.environmentUnavailable`:e?.status===`available`?`portalsPage.waitingForApp`:`portalsPage.environmentStarting`)}
        </div>
        ${t||e?.worker?.error?h`<p>${t??e?.worker?.error}</p>`:g}
        ${n?h`<button class="btn" type="button" @click=${()=>void this.loadPendingEnvironment()}>${c(`portalsPage.retry`)}</button>`:g}
      </section>`}let e=this.portals.find(e=>e.id===(this.requestedPortalId??this.selectedPortalId));return this.embedded?h`<div class="portals-embedded">
        ${e?this.renderPortal(e):this.renderEmptyState()}
      </div>`:h`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${A(`portals`)}</div>
        </div>
      </section>
      ${e?h`
              <section class="portals-layout">
                <aside class="portals-rail" aria-label=${c(`portalsPage.listLabel`)}>
                  ${this.portals.map(t=>h`
                      <button
                        class="portals-rail__item ${t.id===e.id?`active`:``}"
                        type="button"
                        aria-current=${t.id===e.id?`true`:g}
                        @click=${()=>this.selectPortal(t)}
                      >
                        <span class="portals-rail__title">${t.title}</span>
                        <span class="portals-rail__port"
                          >${c(`portalsPage.portLabel`,{port:String(t.port)})}</span
                        >
                        ${t.description?h`<span class="portals-rail__description"
                                >${t.description}</span
                              >`:g}
                      </button>
                    `)}
                </aside>
                ${this.renderPortal(e)}
              </section>
            `:this.renderEmptyState()}
    `}},r([C({type:Boolean,reflect:!0})],Y.prototype,`embedded`,void 0),r([C({type:Boolean})],Y.prototype,`presented`,void 0),r([C({attribute:!1})],Y.prototype,`requestedPortalId`,void 0),r([C({attribute:!1})],Y.prototype,`requestedEnvironmentId`,void 0),r([n({context:T,subscribe:!0})],Y.prototype,`context`,void 0),r([b()],Y.prototype,`portals`,void 0),r([b()],Y.prototype,`selectedPortalId`,void 0),r([b()],Y.prototype,`loading`,void 0),r([b()],Y.prototype,`loaded`,void 0),r([b()],Y.prototype,`error`,void 0),r([b()],Y.prototype,`closingPortalId`,void 0),r([b()],Y.prototype,`portalProbeState`,void 0),r([b()],Y.prototype,`pendingEnvironment`,void 0),r([b()],Y.prototype,`environmentFailure`,void 0),customElements.get(`openclaw-portals-page`)||customElements.define(`openclaw-portals-page`,Y)})))()}X();
//# sourceMappingURL=portals-page-DgHA42y3.js.map