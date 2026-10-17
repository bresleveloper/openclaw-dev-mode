import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Ei as r,Eu as i,Iu as a,Lu as o,Tu as s,du as c,ju as l,kc as u,pu as d}from"./control-ui-core-CTSdBcaH.js";import{Ra as f,Ti as p,ir as m,ra as h,rr as g,ta as _,wa as v,wi as y}from"./control-ui-core-vFnxmx94.js";import{$ as b,F as x,M as S,X as C,Y as w,ct as T,d as E,nt as D,u as O,ut as k}from"./lit-runtime-TNZj1e-P.js";import{c as A,d as j,l as M}from"./gateway-runtime-DiNPDWPd.js";import{Xr as N,Zr as P,ii as F}from"./ui-CnRtCcYL.js";import{Cc as I,Hc as L,Uc as R,wc as z}from"./control-ui-boot-shared-flpXqVdL.js";var B,V;function H(){return(H=e((()=>{o(),B={portalsPage:{listLabel:`Active portals`,portLabel:`Port {port}`,openNewTab:`Open in new tab`,closePortal:`Close {title}`,previewTitle:`{title} portal preview`,loading:`Loading portals…`,emptyHint:`Ask the agent to start a portal:`,unavailable:`This portal is no longer available. Ask the agent to reopen the application.`,environmentStarting:`Starting your machine…`,waitingForApp:`Machine ready. Waiting for your application…`,environmentUnavailable:`The machine could not start. Ask the agent to check it or try again.`,promptShow:`Show me in a portal.`,promptStart:`Start the application in a portal.`,promptMakeAvailable:`Make the server available in a portal.`,unsupported:`This gateway does not support portals.`,loadFailed:`Could not load portals: {error}`,closeFailed:`Could not close the portal: {error}`,unreachableTitle:`Portal not reachable from this browser`,unreachableBody:`Check the portal URL's DNS, TLS, and network access. For private Tailscale Serve, allow its HTTPS port in your tailnet policy. For a reverse proxy, check the dedicated portal ingress route, then retry.`,newTabRequiredTitle:`Open this HTTP portal in a new tab`,newTabRequiredBody:`This portal uses HTTP with a different hostname or scheme from the Control UI. Open the link in a new tab so its authentication cookies work, or use an HTTPS portal for an embedded preview.`,ingressRequiredTitle:`Remote portal ingress required`,ingressRequiredBody:`This Gateway returned a loopback URL, which points to this browser's machine. Use a browser on the Gateway host, enable managed private Tailscale Serve, or configure gateway.portals.ingress with a separate private HTTPS wildcard proxy. Forwarding only the Gateway port is not enough.`,writeAccessRequiredTitle:`Write access required`,writeAccessRequiredBody:`This portal requires an operator with write access.`,retry:`Retry`}},V=Object.assign(()=>{a.portalsPage=B.portalsPage},{catalog:B})})))()}function U(e,t){try{return new URL(e.blockedURI).origin===t.origin}catch{return!1}}async function W(e){let t;try{t=new URL(e)}catch{return`unreachable`}let n=!1,r=e=>{U(e,t)&&(n=!0)},i=typeof document>`u`?void 0:document;i?.addEventListener(`securitypolicyviolation`,r);try{return await fetch(e,{mode:`no-cors`,signal:AbortSignal.timeout(G)}),`reachable`}catch{return await new Promise(e=>{setTimeout(e,0)}),n?`blocked`:`unreachable`}finally{i?.removeEventListener(`securitypolicyviolation`,r)}}var G;function K(){return(K=e((()=>{G=4e3})))()}function q(e,t){let n=new URL(e),r=new URL(t);return n.protocol===`http:`&&(r.protocol!==n.protocol||r.hostname!==n.hostname)}function J(e,t){return r(new URL(e).hostname)&&!r(new URL(t).hostname)}function Y(){return(Y=e((()=>{})))()}var X,Z;function Q(){return(Q=e((()=>{P(),w(),D(),O(),S(),v(),p(),g(),h(),i(),H(),d(),M(),R(),s(),z(),t(),K(),Y(),V(),X=`allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts`,Z=class extends n{constructor(...e){super(...e),this.embedded=!1,this.presented=!0,this.requestedPortalId=null,this.requestedEnvironmentId=null,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeState=null,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentRequestGeneration=0,this.environmentLoading=!1,this.environmentPoll=new I(this,2e3,()=>void this.loadPendingEnvironment(),!1),this.requestGeneration=0,this.portalSetRevision=0,this.portalProbeGeneration=0,this.portalProbeCache=new Map,this.gateway=new L(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetGatewayState(),ensureInitialData:()=>void this.loadPresentation()}),this.subscriptions=new u(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&t.event===`portal.changed`&&this.loadPresentation()}))}disconnectedCallback(){this.environmentRequestGeneration+=1,this.portalProbeGeneration+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(e){[`requestedPortalId`,`requestedEnvironmentId`].some(t=>e.has(t)&&e.get(t)!==void 0)?(this.requestGeneration+=1,this.environmentRequestGeneration+=1,this.environmentLoading=!1,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentPoll.stop(),this.loading=!1,this.portalProbeGeneration+=1,this.portalProbeState=null,this.applyPortalSet(this.portals),this.loadPresentation()):e.has(`presented`)&&e.get(`presented`)!==void 0&&this.presented?this.loadPresentation():e.has(`presented`)&&!this.presented&&(this.environmentPoll.stop(),this.environmentRequestGeneration+=1,this.environmentLoading=!1)}handleToggleRequest(e){let t=e instanceof CustomEvent?e.detail:null;if(t?.open!==!1){if(t?.portalId&&(t.portalId!==this.requestedPortalId||this.requestedEnvironmentId!==null)){this.requestedPortalId=t.portalId,this.requestedEnvironmentId=null;return}if(t?.environmentId&&(t.environmentId!==this.requestedEnvironmentId||this.requestedPortalId!==null)){this.requestedEnvironmentId=t.environmentId,this.requestedPortalId=null;return}this.loadPresentation()}}get pendingEnvironmentId(){return this.requestedPortalId?null:this.requestedEnvironmentId}loadPresentation(){return this.pendingEnvironmentId?this.loadPendingEnvironment():this.loadPortals()}async loadPendingEnvironment(){let e=this.pendingEnvironmentId,t=this.gateway.capture();if(!e||!t||!this.canReadPortalState||this.environmentLoading||this.embedded&&!this.presented)return;let n=++this.environmentRequestGeneration,r=()=>this.gateway.isCurrent(t)&&n===this.environmentRequestGeneration&&this.pendingEnvironmentId===e;this.environmentLoading=!0,this.environmentFailure=null;try{let n=await t.client.request(`environments.status`,{environmentId:e});if(!r())return;if(n.id!==e)throw Error(`Environment status returned a different target`);this.pendingEnvironment=n,n.status===`starting`?this.environmentPoll.start():this.environmentPoll.stop()}catch(t){r()&&(this.environmentFailure={environmentId:e,message:c(t)},this.environmentPoll.stop())}finally{r()&&(this.environmentLoading=!1)}}get portalListSupported(){return j(this.gateway.snapshot??{},`portal.list`)!==!1}get canReadPortalState(){return A(this.gateway.snapshot,this.pendingEnvironmentId?`environments.status`:`portal.list`,`operator.read`,{requireAdvertisement:!1})}get canClosePortal(){return A(this.gateway.snapshot,`portal.close`,`operator.write`)}resetGatewayState(){this.environmentRequestGeneration+=1,this.environmentLoading=!1,this.pendingEnvironment=null,this.environmentFailure=null,this.environmentPoll.stop(),this.requestGeneration+=1,this.portalSetRevision+=1,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeGeneration+=1,this.portalProbeCache.clear(),this.portalProbeState=null}applyPortalSet(e){this.portalSetRevision+=1,this.portals=[...e];let t=this.selectedPortalId,n=this.pendingEnvironmentId?null:this.requestedPortalId??(e.some(e=>e.id===t)?this.selectedPortalId:e[0]?.id??null);this.selectedPortalId=n,this.loaded=!0,this.error=null;let r=e.find(e=>e.id===n);r?this.ensurePortalProbe(r,n!==t):(this.portalProbeGeneration+=1,this.portalProbeState=null)}ensurePortalProbe(e,t=!1){if(!e.tokenQuery||!e.url){this.portalProbeGeneration+=1,this.portalProbeState=null;return}let n=e.url,r=`${e.id}\u0000${n}`;if(!t&&this.portalProbeState?.key===r)return;if(J(n,this.context.gateway.connection.gatewayUrl)){this.portalProbeGeneration+=1,this.portalProbeState={key:r,status:`ingress-required`};return}if(q(n,location.href)){this.portalProbeGeneration+=1,this.portalProbeState={key:r,status:`new-tab-required`};return}let i=t?void 0:this.portalProbeCache.get(r);if(i!==void 0){this.portalProbeState={key:r,status:i};return}let a=++this.portalProbeGeneration;this.portalProbeState={key:r,status:`probing`},W(n).then(e=>{a===this.portalProbeGeneration&&this.portalProbeState?.key===r&&(this.portalProbeCache.set(r,e),this.portalProbeState={key:r,status:e})})}selectPortal(e){e.id!==this.selectedPortalId&&(this.selectedPortalId=e.id,this.ensurePortalProbe(e,!0))}async loadPortals(){if(this.pendingEnvironmentId||!this.canReadPortalState||!this.portalListSupported||this.loading||this.embedded&&!this.presented)return;let e=this.gateway.capture();if(!e)return;let t=++this.requestGeneration,n=this.portalSetRevision;this.loading=!0,this.error=null;try{let r=await e.client.request(`portal.list`,{});t===this.requestGeneration&&n===this.portalSetRevision&&this.gateway.isCurrent(e)&&this.applyPortalSet(r.portals)}catch(n){t===this.requestGeneration&&this.gateway.isCurrent(e)&&this.portalListSupported&&(this.error=l(`portalsPage.loadFailed`,{error:c(n)}),this.loaded=!0)}finally{t===this.requestGeneration&&this.gateway.isCurrent(e)&&(this.loading=!1)}}async closePortal(e){if(!this.canClosePortal||this.closingPortalId)return;let t=this.gateway.capture();if(t){this.closingPortalId=e.id,this.error=null;try{await t.client.request(`portal.close`,{id:e.id}),this.gateway.isCurrent(t)&&this.loadPortals()}catch(e){this.gateway.isCurrent(t)&&(this.error=l(`portalsPage.closeFailed`,{error:c(e)}))}finally{this.gateway.isCurrent(t)&&this.closingPortalId===e.id&&(this.closingPortalId=null)}}}renderEmptyState(){let e=!this.portalListSupported;return this.gateway.connected&&!this.canReadPortalState?b`<section class="portals-empty" role="status" aria-live="polite">
        <div class="portals-empty__note">
          ${l(`sessionsView.actionRequiresScope`,{scope:`operator.read`})}
        </div>
      </section>`:b`
      <section class="portals-empty" role="status" aria-live="polite">
        ${this.loading&&!this.loaded?b`<div class="portals-empty__title">${l(`portalsPage.loading`)}</div>`:b`
                <div class="portals-empty__title">
                  ${l(this.requestedPortalId?`portalsPage.unavailable`:`portalsPage.emptyHint`)}
                </div>
                ${this.requestedPortalId?C:b`<div class="portals-empty__prompts">
                        <span>${l(`portalsPage.promptShow`)}</span>
                        <span>${l(`portalsPage.promptStart`)}</span>
                        <span>${l(`portalsPage.promptMakeAvailable`)}</span>
                      </div>`}
              `}
        ${e?b`<div class="portals-empty__note">${l(`portalsPage.unsupported`)}</div>`:C}
        ${this.error?b`<div class="callout danger">${this.error}</div>`:C}
      </section>
    `}renderPortal(e){if(!e.tokenQuery||!e.url)return b`
        <section class="portals-preview">
          <div class="portals-preview__notice" role="status">
            <div class="portals-preview__notice-title">
              ${l(`portalsPage.writeAccessRequiredTitle`)}
            </div>
            <p>${l(`portalsPage.writeAccessRequiredBody`)}</p>
          </div>
        </section>
      `;let t=e.url,n=new URL(t);n.search=``;let r=`${e.id}\u0000${t}`,i=this.portalProbeState?.key===r?this.portalProbeState.status:`probing`,a=i===`new-tab-required`?`newTabRequired`:i===`ingress-required`?`ingressRequired`:`unreachable`;return b`
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
            ${_(`externalLink`)}
            <span class="sr-only">${l(`portalsPage.openNewTab`)}</span>
          </a>
          <button
            class="btn btn--icon btn--ghost portals-preview__close"
            type="button"
            title=${l(`portalsPage.closePortal`,{title:e.title})}
            aria-label=${l(`portalsPage.closePortal`,{title:e.title})}
            ?disabled=${!this.canClosePortal||this.closingPortalId===e.id}
            @click=${()=>void this.closePortal(e)}
          >
            ${_(`x`)}
          </button>
        </header>
        ${this.error?b`<div class="callout danger portals-preview__error" role="alert">
                ${this.error}
              </div>`:C}
        ${i===`probing`?b`
                <div class="portals-empty portals-preview__state" role="status" aria-live="polite">
                  <div class="portals-empty__title">${l(`portalsPage.loading`)}</div>
                </div>
              `:i===`unreachable`||i===`ingress-required`||i===`new-tab-required`?b`
                  <div class="portals-preview__notice" role="status">
                    <div class="portals-preview__notice-title">
                      ${l(`portalsPage.${a}Title`)}
                    </div>
                    <p>${l(`portalsPage.${a}Body`)}</p>
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
                      ${l(`portalsPage.retry`)}
                    </button>
                  </div>
                `:E(r,b`<iframe
                    ${x(e=>{e instanceof HTMLIFrameElement&&!e.hasAttribute(`src`)&&e.setAttribute(`src`,t)})}
                    class="portals-preview__frame"
                    title=${l(`portalsPage.previewTitle`,{title:e.title})}
                    referrerpolicy="no-referrer"
                    sandbox=${X}
                  ></iframe>`)}
      </section>
    `}render(){if(this.pendingEnvironmentId&&(!this.gateway.connected||this.canReadPortalState)){let e=this.pendingEnvironment?.id===this.pendingEnvironmentId?this.pendingEnvironment:null,t=this.environmentFailure?.environmentId===this.pendingEnvironmentId?this.environmentFailure.message:null,n=t||e&&e.status!==`starting`&&e.status!==`available`;return b`<section class="portals-empty" role="status" aria-live="polite">
        <div class="portals-empty__title">
          ${l(n?`portalsPage.environmentUnavailable`:e?.status===`available`?`portalsPage.waitingForApp`:`portalsPage.environmentStarting`)}
        </div>
        ${t||e?.worker?.error?b`<p>${t??e?.worker?.error}</p>`:C}
        ${n?b`<button class="btn" type="button" @click=${()=>void this.loadPendingEnvironment()}>${l(`portalsPage.retry`)}</button>`:C}
      </section>`}let e=this.portals.find(e=>e.id===(this.requestedPortalId??this.selectedPortalId));return this.embedded?b`<div class="portals-embedded">
        ${e?this.renderPortal(e):this.renderEmptyState()}
      </div>`:b`
      <section
        class="content-header content-header--page"
        ${m({toolbarHeader:!0})}
      >
        <div>
          <h1 class="page-title">${f(`portals`)}</h1>
        </div>
      </section>
      ${e?b`
              <section class="portals-layout">
                <aside class="portals-rail" aria-label=${l(`portalsPage.listLabel`)}>
                  ${this.portals.map(t=>b`
                      <button
                        class="portals-rail__item ${t.id===e.id?`active`:``}"
                        type="button"
                        aria-current=${t.id===e.id?`true`:C}
                        @click=${()=>this.selectPortal(t)}
                      >
                        <span class="portals-rail__title">${t.title}</span>
                        <span class="portals-rail__port"
                          >${l(`portalsPage.portLabel`,{port:String(t.port)})}</span
                        >
                        ${t.description?b`<span class="portals-rail__description"
                                >${t.description}</span
                              >`:C}
                      </button>
                    `)}
                </aside>
                ${this.renderPortal(e)}
              </section>
            `:this.renderEmptyState()}
    `}},F([k({type:Boolean,reflect:!0})],Z.prototype,`embedded`,void 0),F([k({type:Boolean})],Z.prototype,`presented`,void 0),F([k({attribute:!1})],Z.prototype,`requestedPortalId`,void 0),F([k({attribute:!1})],Z.prototype,`requestedEnvironmentId`,void 0),F([N({context:y,subscribe:!0})],Z.prototype,`context`,void 0),F([T()],Z.prototype,`portals`,void 0),F([T()],Z.prototype,`selectedPortalId`,void 0),F([T()],Z.prototype,`loading`,void 0),F([T()],Z.prototype,`loaded`,void 0),F([T()],Z.prototype,`error`,void 0),F([T()],Z.prototype,`closingPortalId`,void 0),F([T()],Z.prototype,`portalProbeState`,void 0),F([T()],Z.prototype,`pendingEnvironment`,void 0),F([T()],Z.prototype,`environmentFailure`,void 0),customElements.get(`openclaw-portals-page`)||customElements.define(`openclaw-portals-page`,Z)})))()}Q();
//# sourceMappingURL=portals-page-Dd1mFB0i.js.map