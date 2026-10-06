const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./board-view-CZtccGh-.js","./control-ui-boot-shared-Cf6Z0dqU.js","./gateway-runtime-Czmp7OyE.js","./control-ui-boot-shared-BgyYtRDC.js","./control-ui-boot-shared-DNFxhrHk.js","./control-ui-boot-shared-Cxl95SqS.js","./control-ui-boot-shared-BBWH0GGQ.js","./markdown-runtime-B1-JWj3L.js","./control-ui-boot-shared-URxk9oWr.js","./control-ui-boot-shared-Bn8QFcO_.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-CoP6HpTl.js","./control-ui-boot-shared-C0J7wN-I.js","./control-ui-boot-shared-ClJo_QFT.js","./control-ui-boot-shared-CXXIUdsv.js","./sidebar-update-runtime-3yeAyHon.js","./board-view-BdP2e1Te.js","./control-ui-disabled-D1B_BNz4.js","./near-viewport-observer-BF_iROOc.js","./widget-sandbox-host-C8LIDhPh.js","./control-ui-core-2cJmD3kZ.css","./control-ui-boot-shared-CVUnDsao.css","./sidebar-update-runtime-ah7rgQE7.css","./board-view-DfK8qQZX.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t,no as n,to as r}from"./control-ui-foundation-CFtg1tJp.js";import{Gl as i,Ll as a,Xl as o,zl as s}from"./control-ui-core-57AfAcCO.js";import{$ as c,X as l,Y as u,ct as d,nt as f,ut as p}from"./lit-runtime-672ruXeP.js";import{Fi as m,Ii as h,fi as g,pi as _}from"./control-ui-core-Dt-FpjJ3.js";import{_r as v,hr as y,mr as b,pr as x}from"./control-ui-boot-shared-BQax9AK9.js";function S(){return g(`openclaw-board-view`,()=>r(()=>import(`./board-view-CZtccGh-.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]),import.meta.url))}var C;function w(){return(w=e((()=>{u(),f(),_(),h(),i(),v(),s(),n(),C=class extends a{constructor(...e){super(...e),this.session=null,this.client=null,this.connected=!1,this.canMutate=!1,this.canGrant=!1,this.presented=!0,this.provider=null,this.expanded=!1,this.activeTabId=``,this.viewError=null,this.viewLoad=null,this.lease=null,this.unsubscribeSnapshot=null,this.expansionInitialized=!1}connectedCallback(){super.connectedCallback(),this.requestUpdate()}updated(){this.viewLoad??=S().catch(e=>{this.viewError=e instanceof Error?e.message:String(e)}),this.synchronizeProvider()}disconnectedCallback(){this.releaseProvider(),super.disconnectedCallback()}synchronizeProvider(){let e=this.session,t=this.client;if(!this.isConnected||!e?.sessionKey.trim()||!t){this.releaseProvider();return}let n=y(e);if(this.lease?.client===t&&this.lease.cacheKey===n){(this.lease.session.sessionKey!==e.sessionKey||this.lease.session.agentId!==e.agentId)&&(this.lease.session={...e},this.requestUpdate()),this.lease.update(t,this.connected,{canPinWidgets:!1,canPinMcpApps:!1,canMutate:this.canMutate,canGrant:this.canGrant});return}this.releaseProvider(),this.expansionInitialized=!1,this.activeTabId=``;let r=x(e,t,this.connected,!1,!1,this.canMutate,this.canGrant);this.lease={...r,client:t,cacheKey:n,session:{...e}},this.provider=r.provider,this.unsubscribeSnapshot=r.provider.snapshot$.subscribe(()=>{this.reconcileSnapshot(r.provider),this.requestUpdate()}),this.reconcileSnapshot(r.provider),this.requestUpdate()}releaseProvider(){this.unsubscribeSnapshot?.(),this.unsubscribeSnapshot=null,this.lease?.release(),this.lease=null,this.provider=null}reconcileSnapshot(e){let t=e.snapshot$.value,n=t.tabs[0]?.tabId??``;t.tabs.some(e=>e.tabId===this.activeTabId)||(this.activeTabId=n),!this.expansionInitialized&&e.hasLoadedSnapshot&&(this.expansionInitialized=!0,this.expanded=b(t))}render(){let e=this.provider,t=e?.snapshot$.value,n=this.lease?.session,r=!!(t&&b(t)),i=e?{appViewGeneration:e.appViewGeneration,applyOps:t=>e.applyOps(t),grant:(t,n)=>e.grant(t,n),selectTab:e=>{this.activeTabId=e},frameLoadFailed:t=>e.refreshWidgetFrame(t),widgetAppView:(t,n)=>e.widgetAppView(t,n),refreshWidgetAppView:(t,n)=>e.refreshWidgetAppView(t,n)}:null;return c`
      <section class="plugin-session-dashboard">
        <button
          type="button"
          class="plugin-session-dashboard__toggle"
          aria-expanded=${this.expanded?`true`:`false`}
          @click=${()=>{this.expansionInitialized=!0,this.expanded=!this.expanded}}
        >
          <span class="plugin-session-dashboard__title">
            ${m.kanban}<span>${o(`pluginUi.dashboardTitle`)}</span>
          </span>
          <span class="plugin-session-dashboard__chevron" aria-hidden="true"
            >${m.arrowDown}</span
          >
        </button>
        <div class="plugin-session-dashboard__body" ?hidden=${!this.expanded}>
          ${this.viewError?c`<p role="alert">${this.viewError}</p>
                  <button
                    type="button"
                    @click=${()=>{this.viewLoad=null,this.viewError=null}}
                  >
                    ${o(`common.retry`)}
                  </button>`:r&&e&&t&&n&&i?c`
                    <openclaw-board-view
                      .active=${this.expanded&&this.presented}
                      .session=${n}
                      .snapshot=${t}
                      .activeTabId=${this.activeTabId}
                      .widgetFrameUrl=${(t,n)=>e.widgetFrameUrl(t,n)}
                      .callbacks=${i}
                      .sessions=${[]}
                      .canMutate=${this.canMutate}
                      .canGrant=${this.canGrant}
                    ></openclaw-board-view>
                  `:c`<p class="plugin-session-dashboard__empty">
                    ${o(`pluginUi.dashboardEmpty`)}
                  </p>`}
        </div>
        ${!this.expanded&&this.expansionInitialized&&!r?c`<p class="plugin-session-dashboard__collapsed-empty">
                ${o(`pluginUi.dashboardEmpty`)}
              </p>`:l}
      </section>
    `}},t([p({attribute:!1})],C.prototype,`session`,void 0),t([p({attribute:!1})],C.prototype,`client`,void 0),t([p({attribute:!1})],C.prototype,`connected`,void 0),t([p({attribute:!1})],C.prototype,`canMutate`,void 0),t([p({attribute:!1})],C.prototype,`canGrant`,void 0),t([p({attribute:!1})],C.prototype,`presented`,void 0),t([d()],C.prototype,`provider`,void 0),t([d()],C.prototype,`expanded`,void 0),t([d()],C.prototype,`activeTabId`,void 0),t([d()],C.prototype,`viewError`,void 0),customElements.get(`openclaw-plugin-session-dashboard`)||customElements.define(`openclaw-plugin-session-dashboard`,C)})))()}w();
//# sourceMappingURL=control-ui-dashboard-C3Pq8Vq1.js.map