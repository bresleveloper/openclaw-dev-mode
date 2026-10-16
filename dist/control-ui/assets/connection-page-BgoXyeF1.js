import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Is as r,Ji as i,Ls as a,Tu as o,Xi as s,ju as c,nl as l,tl as u}from"./control-ui-core-bJHyI7AF.js";import{La as d,Ra as f,Ti as p,gn as m,ir as ee,mn as h,rr as g,wa as _,wi as te,wn as ne}from"./control-ui-core-DNh4McGE.js";import{$ as v,X as y,Y as b,ct as x,nt as S}from"./lit-runtime-DyST807n.js";import{En as re,wn as ie}from"./control-ui-boot-shared-DsSYH3B6.js";import{Xr as ae,Zr as oe,ii as C,sn as w}from"./ui-DeikvIdP.js";import{Bi as se,G as ce,I as T,J as le,R as ue,Y as E,Z as D,l as O,q as k,u as A,zi as j}from"./control-ui-boot-shared-C9uJ732w.js";import{Cc as M,Gi as N,Hc as P,Hi as F,Uc as I,Ui as L,Wi as R,wc as z}from"./control-ui-boot-shared-C1PHuQAX.js";import{n as B,t as V}from"./en-settings-C6f4UN4T.js";import{n as H,o as U}from"./settings-targets-BbtwiQ79.js";import{r as de}from"./login-runtime-BviVFlcX.js";import{n as fe,t as pe}from"./system-info-DQovy5gq.js";import{a as me,n as he}from"./gateway-vitals-C34Sd5E6.js";function ge(e){if(e.length===0)return null;let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.ceil(t.length*e)-1];return{count:e.length,averageMs:e.reduce((e,t)=>e+t,0)/e.length,p50Ms:n(.5),p95Ms:n(.95),p99Ms:n(.99)}}function W(){return(W=e((()=>{})))()}function _e(e,t){let n=Math.min(Math.max(t,0),1),r=Math.round(n*100),i=n>=.92?`critical`:n>=.75?`warn`:`ok`;return v`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${c(`quickSettings.system.usage`,{label:e})}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${i}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `}function ve(e){let t=e.path?`${e.label} ${e.path}`:e.label;return v`
    <div class="config-host__stat" title=${e.title??y}>
      <div class="config-host__stat-label">
        ${e.label}${e.path?v` <span class="config-host__stat-path">${e.path}</span>`:y}
      </div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit?v` <span class="config-host__stat-unit">${e.unit}</span>`:y}
      </div>
      ${e.usedFraction==null?y:_e(t,e.usedFraction)}
      ${e.detail?v`<div class="config-host__stat-detail">${e.detail}</div>`:y}
    </div>
  `}function G(e,t){if(!(e==null||t==null||e<=0))return(e-t)/e}function K(e){return`${Math.round(Math.min(Math.max(e,0),1)*100)}%`}function ye(e){let t=e.loadAverage?.[0],n=e.loadAverage?c(`quickSettings.system.loadAverage`,{values:e.loadAverage.map(e=>e.toFixed(1)).join(` · `)}):void 0,r=[e.cpuModel,n].filter(Boolean).join(` · `)||void 0,i=c(e.cpuCount===1?`quickSettings.system.core`:`quickSettings.system.cores`,{count:String(e.cpuCount)}),a=t==null?{label:c(`quickSettings.system.cpu`),value:i,detail:e.cpuModel}:{label:c(`quickSettings.system.cpu`),value:t.toFixed(1),unit:c(`quickSettings.system.load`),detail:i,usedFraction:e.cpuCount>0?t/e.cpuCount:void 0,title:r},o=G(e.memoryTotalBytes,e.memoryFreeBytes),s=[a,{label:c(`quickSettings.system.memory`),value:o==null?`—`:K(o),unit:o==null?void 0:c(`quickSettings.system.used`),detail:c(`quickSettings.system.freeOf`,{free:u(e.memoryFreeBytes),total:u(e.memoryTotalBytes)}),usedFraction:o}];for(let t of e.disks??[]){let e=G(t.totalBytes,t.availableBytes);e!=null&&s.push({label:c(`quickSettings.system.disk`),value:K(e),unit:c(`quickSettings.system.used`),detail:c(`quickSettings.system.freeOf`,{free:u(t.availableBytes),total:u(t.totalBytes)}),usedFraction:e,path:t.path})}return s}function be(e){return[{label:c(`quickSettings.system.cpu`),value:e},{label:c(`quickSettings.system.memory`),value:e},{label:c(`quickSettings.system.disk`),value:e}]}function xe(e){if(e.systemInfoUnavailable)return y;let t=e.systemInfo,n=e.systemInfoLoading?v`<span class="skeleton config-host__placeholder" aria-hidden="true"></span>`:`—`,r=t&&t.hostname!==t.machineName?t.hostname:void 0,i=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:void 0,a=t?ye(t):be(n),o={title:c(`quickSettings.system.gatewayHost`),actions:t?D({kind:`ok`,label:c(`quickSettings.system.up`,{duration:ie(t.uptimeMs)})}):void 0};return v`
    <div id=${H.host} aria-busy=${!!e.systemInfoLoading}>
      ${E(o,v`
          <div class="config-host">
            <div class="config-host__identity">
              <div class="config-host__name" title=${r??``}>
                ${t?.machineName??n}
              </div>
              <div class="config-host__meta">
                ${t?`${t.osLabel} · ${t.arch}`:n}
              </div>
              <div class="config-host__meta">
                ${t?c(`quickSettings.system.runtime`,{version:t.nodeVersion,pid:String(t.pid)}):n}
              </div>
              ${i?v`<code class="config-host__address">${i}</code>`:y}
            </div>
            <div class="config-host__stats">${a.map(ve)}</div>
          </div>
        `)}
    </div>
  `}function q(){return(q=e((()=>{b(),T(),n(),l(),re(),U()})))()}function Se(e){return e?`${(e/1e3).toFixed(e%1e3==0?0:1)}s`:null}function Ce(e,t){let n=t===`password`?`connection.access.passwordHint`:t===`token`?`connection.access.tokenHint`:`connection.access.secretHint`;return k({title:c(`connection.access.secret`),description:c(n),control:v`<div class="settings-input-with-hint">
      ${le({ariaLabel:c(`connection.access.secret`),value:e.secret,placeholder:c(`connection.access.secretPlaceholder`),visible:e.showGatewaySecret,showLabel:c(`connection.access.showSecret`),hideLabel:c(`connection.access.hideSecret`),toggleLabel:c(`connection.access.toggleSecretVisibility`),onInput:e.onSecretChange,onToggle:e.onToggleGatewaySecretVisibility})}
      ${de(e.secret)===`setup-code`?v`<p class="settings-row__desc" role="status">
              ${c(`connection.access.setupCodeHint`)}
            </p>`:y}
    </div>`,stackedOnNarrow:!0})}function we(e){return`${e.toFixed(1)} ${c(`connection.ping.unit`)}`}function Te(e){let t=[{key:`average`,value:e.ping?.averageMs},{key:`p50`,value:e.ping?.p50Ms},{key:`p95`,value:e.ping?.p95Ms},{key:`p99`,value:e.ping?.p99Ms}];return v`<div class="settings-row connection-ping">
    <dl class="connection-ping__stats" aria-label=${c(`connection.ping.title`)}>
      ${t.map(({key:e,value:t})=>v`<div title=${c(`connection.ping.${e}Hint`)}>
          <dt>${c(`connection.ping.${e}`)}</dt>
          <dd>
            ${t===void 0?`—`:v`${t.toFixed(1)} <span>${c(`connection.ping.unit`)}</span>`}
          </dd>
        </div>`)}
    </dl>
    <openclaw-sparkline
      class="gateway-vital connection-ping__trend"
      .label=${c(`connection.ping.latest`)}
      .samples=${e.pingSamples}
      .format=${we}
      .floorMax=${100}
    ></openclaw-sparkline>
    <p class="settings-row__desc">
      ${e.ping?c(`connection.ping.samples`,{count:String(e.ping.count)}):e.pingFailed?y:c(`connection.ping.measuring`)}
      ${e.pingFailed?v`<span class="connection-ping__error" role="status">
              ${c(`connection.ping.failed`)}
            </span>`:y}
    </p>
  </div>`}function J(e){let t=e.hello?.snapshot,n=e.phase===`connected`,i=[`connecting`,`starting`,`reconnecting`].includes(e.phase),a=i&&!e.dirty,o=e.phase===`reload-required`,s=t?.authMode,l=w(e.settings.gatewayUrl)===w(e.liveGatewayUrl)?s:void 0,u=l===`trusted-proxy`,d=n?`connected`:e.phase===`stopped`?`offline`:e.phase,f=c(a?e.phase===`reconnecting`?`connection.access.status.reconnecting`:`connection.access.status.connecting`:n||i?`connection.access.applyReconnect`:e.lastError?`connection.access.retry`:`common.connect`),p=Se(e.hello?.policy?.tickIntervalMs),m=v`
    ${n?Te(e):y}
    ${k({title:c(`connection.access.gatewayUrl`),description:c(`connection.access.gatewayUrlHint`),control:v`
        <input
          class="settings-input"
          aria-label=${c(`connection.access.gatewayUrl`)}
          inputmode="url"
          autocapitalize="none"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          .value=${e.settings.gatewayUrl}
          @input=${t=>{e.onConnectionChange({gatewayUrl:t.target.value})}}
          placeholder="wss://gateway.example:443"
        />
      `})}
    ${u?k({title:c(`connection.access.secret`),description:c(`connection.access.trustedProxy`),control:D({kind:`ok`,label:c(`connection.access.trustedProxyStatus`)})}):Ce(e,l)}
    ${!n&&e.lastError?k({title:D({kind:`danger`,label:c(`connection.access.lastError`)}),description:e.lastError}):y}
    ${(!n||e.dirty)&&!o?v`<div class="settings-row connection-actions">
            <div class="settings-row__text">
              <span class="settings-row__desc" role="status">
                ${e.dirty?c(`connection.access.unsavedHint`):y}
              </span>
            </div>
            <div class="settings-row__control connection-actions__buttons">
              ${e.dirty?v`<button class="btn" @click=${e.onDiscardConnection}>
                      ${c(`connection.access.discard`)}
                    </button>`:y}
              <button class="btn primary" ?disabled=${a} @click=${e.onConnect}>
                ${a?v`<span class="btn__spinner" aria-hidden="true"></span>`:y}
                ${f}
              </button>
            </div>
          </div>`:y}
    <details class="connection-details">
      <summary>${c(`connection.access.details`)}</summary>
      <div class="connection-details__body">
        ${n&&(s||p)?v`<p class="settings-row__desc">
                ${[s?c(Y[s]):null,p?c(`connection.access.tick`,{tick:p}):null].filter(Boolean).join(` · `)}
              </p>`:y}
        <p class="settings-row__desc">${c(`connection.access.reconnectHint`)}</p>
        <button class="btn" ?disabled=${!n||e.dirty} @click=${e.onReconnect}>
          ${c(`connection.access.reconnect`)}
        </button>
      </div>
    </details>
  `;return ce([E({title:c(`connection.access.title`),description:n?c(`connection.access.connectedTo`,{host:r(e.liveGatewayUrl)}):c(i||o?`connection.access.status.${d}`:`connection.access.descriptionOffline`),actions:D({kind:n?`ok`:`warn`,label:c(`connection.access.status.${d}`)})},m),E({title:c(`connection.activity.title`),description:c(`connection.activity.description`)},v`<div class="settings-row connection-activity">
        ${me(e.statusHistory.at(-1)?.status??{},e.statusHistory)}
        ${e.statusFailed?v`<p class="settings-row__desc" role="status">
                ${c(`connection.activity.failed`)}
              </p>`:n?e.statusHistory.length===0?v`<p class="settings-row__desc" role="status">${c(`common.loading`)}</p>`:y:v`<p class="settings-row__desc">${c(`connection.activity.offline`)}</p>`}
      </div>`),E({title:c(`connection.access.sessionTitle`),description:c(`connection.access.sessionDescription`,{host:r(e.liveGatewayUrl)})},v`
        ${k({title:c(`connection.access.sessionKey`),description:c(`connection.access.sessionKeyHint`),control:v`
            <input
              class="settings-input"
              aria-label=${c(`connection.access.sessionKey`)}
              .value=${e.settings.sessionKey}
              @input=${t=>e.onSessionKeyChange(t.target.value)}
            />
          `})}
        ${e.sessionDirty?v`<div class="settings-row">
                <div class="settings-row__text"></div>
                <div class="settings-row__control connection-actions__buttons">
                  <button class="btn" @click=${e.onDiscardSession}>
                    ${c(`connection.access.discard`)}
                  </button>
                  <button
                    class="btn primary"
                    ?disabled=${!e.settings.sessionKey.trim()}
                    @click=${e.onSaveSession}
                  >
                    ${c(`common.save`)}
                  </button>
                </div>
              </div>`:e.sessionSaved?v`<div class="settings-row" role="status">${c(`connection.access.saved`)}</div>`:y}
      `),xe(e),e.canForgetDevice?E({title:c(`connection.browser.title`)},k({title:c(`connection.browser.savedSignIn`),control:v`<button class="btn" @click=${e.onForgetDevice}>
              ${c(`connection.browser.forgetDevice`)}
            </button>`})):y])}var Y;function X(){return(X=e((()=>{b(),he(),T(),n(),V(),a(),q(),B(),Y={none:`connection.access.auth.none`,token:`connection.access.auth.token`,password:`connection.access.auth.password`,"trusted-proxy":`connection.access.auth.trustedProxy`}})))()}var Z,Q;function $(){return($=e((()=>{oe(),b(),S(),_(),p(),h(),g(),j(),T(),O(),n(),i(),a(),R(),I(),o(),z(),W(),pe(),X(),Z=`https://docs.openclaw.ai/gateway/remote`,Q=class extends t{constructor(...e){super(...e),this.settings=m(),this.password=``,this.gatewaySecretVisible=!1,this.systemInfo=null,this.systemInfoUnavailable=!1,this.systemInfoLoading=!1,this.ping=null,this.pingFailed=!1,this.pingSamples=[],this.pingRequest=null,this.statusHistory=[],this.statusFailed=!1,this.systemInfoRequest=null,this.sessionKeyBaseline=``,this.sessionGatewayUrl=``,this.sessionSaved=!1,this.diagnosticsPolling=new M(this,F,()=>this.refreshDiagnostics(),!1),this.gateway=new P(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetDiagnostics(),onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.syncDiagnosticsPolling()})}disconnectedCallback(){this.resetDiagnostics(),this.gatewaySecretVisible=!1,super.disconnectedCallback()}handleGatewaySnapshot({snapshot:e,initial:t,sourceChanged:n,clientChanged:r}){let i=this.systemInfoUnavailable;t||n||r?(this.resetDiagnostics(),this.resetConnectionDraft(),(t||n||this.sessionGatewayUrl!==this.context.gateway.connection.gatewayUrl)&&this.resetSessionDraft(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.phase!==`connected`&&(this.gatewaySecretVisible=!1,this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!L(e),this.systemInfoUnavailable&&(this.gateway.invalidate(),this.systemInfoRequest?.abort(),this.systemInfoRequest=null,this.systemInfoLoading=!1,this.systemInfo=null,this.statusFailed=!0)),this.settings.sessionKey===this.sessionKeyBaseline&&(this.settings={...this.settings,sessionKey:e.sessionKey}),this.sessionKeyBaseline=e.sessionKey,this.syncDiagnosticsPolling(),i&&!this.systemInfoUnavailable&&this.loadSystemInfo()}stopDiagnosticsPolling(){this.diagnosticsPolling.stop(),this.pingRequest?.abort(),this.pingRequest=null,this.systemInfoRequest?.abort(),this.systemInfoRequest=null,this.systemInfoLoading=!1}resetDiagnostics(){this.stopDiagnosticsPolling(),this.pingSamples=[],this.ping=null,this.pingFailed=!1,this.statusHistory=[],this.statusFailed=!1}syncDiagnosticsPolling(){let e=this.context.gateway.snapshot;if(!this.isConnected||document.visibilityState===`hidden`||e.phase!==`connected`||!e.client){this.stopDiagnosticsPolling();return}this.diagnosticsPolling.start()&&this.refreshDiagnostics()}refreshDiagnostics(){this.measurePing(),this.loadSystemInfo()}async measurePing(){let e=this.gateway.gateway,t=this.gateway.capture();if(!e||e!==this.context.gateway||!t||this.pingRequest||document.visibilityState===`hidden`)return;let n=new AbortController;this.pingRequest=n;let r=()=>this.pingRequest===n&&this.isConnected&&document.visibilityState!==`hidden`&&this.context.gateway===e&&this.gateway.isCurrent(t),i=performance.now();try{if(await t.client.request(`last-heartbeat`,{},{timeoutMs:F,signal:n.signal}),!r())return;this.pingSamples=[...this.pingSamples.slice(-99),{at:Date.now(),value:performance.now()-i}],this.ping=ge(this.pingSamples.map(e=>e.value)),this.pingFailed=!1}catch{r()&&(this.pingFailed=!0)}finally{this.pingRequest===n&&(this.pingRequest=null)}}async loadSystemInfo(){let e=this.gateway.gateway,t=this.gateway.capture();if(!e||e!==this.context.gateway||!t||this.systemInfoUnavailable||this.systemInfoRequest||document.visibilityState===`hidden`)return;let n=new AbortController;this.systemInfoRequest=n,this.systemInfoLoading=!0;let r=()=>this.systemInfoRequest===n&&this.isConnected&&document.visibilityState!==`hidden`&&this.context.gateway===e&&this.gateway.isCurrent(t);try{let t=await N(e,n.signal);if(!r())return;this.systemInfo=t.value,this.diagnosticsPolling.stop(),this.diagnosticsPolling.start(),this.statusHistory.at(-1)?.at!==t.at&&(this.statusHistory=[...this.statusHistory.slice(-99),{at:t.at,status:{eventLoop:t.value.eventLoop,processMemory:t.value.processMemory}}]),this.statusFailed=!1}catch(e){if(!r())return;this.statusFailed=!0,(s(e)||fe(e))&&(this.systemInfo=null,this.systemInfoUnavailable=!0)}finally{this.systemInfoRequest===n&&(this.systemInfoRequest=null,this.systemInfoLoading=!1)}}resetConnectionDraft(){let{gatewayUrl:e,token:t,password:n}=this.context.gateway.connection;this.settings={...this.settings,gatewayUrl:e,token:t},this.password=n,this.gatewaySecretVisible=!1}resetSessionDraft(){this.sessionGatewayUrl=this.context.gateway.connection.gatewayUrl,this.sessionKeyBaseline=this.context.gateway.snapshot.sessionKey,this.settings={...this.settings,sessionKey:this.sessionKeyBaseline},this.sessionSaved=!1}saveSession(){this.context.gateway.setSessionKey(this.settings.sessionKey),this.resetSessionDraft(),this.sessionSaved=!0}async forgetDevice(){let e=this.context.gateway,t=e.connection.gatewayUrl;await se({title:c(`connection.browser.confirmTitle`),message:c(`connection.browser.confirmMessage`,{gateway:r(t)}),confirmLabel:c(`connection.browser.confirmLabel`),danger:!0})&&this.isConnected&&this.context.gateway===e&&e.connection.gatewayUrl===t&&(e.forgetDeviceToken?.(),this.requestUpdate())}updateConnection(e){if(e.gatewayUrl!==void 0){let t=ne(this.settings.gatewayUrl,e.gatewayUrl,{token:this.settings.token,password:this.password});this.password=t.password,this.settings={...this.settings,...e,token:t.token};return}this.settings={...this.settings,...e}}render(){let e=this.context.gateway.snapshot,t=this.context.gateway.connection,n=this.settings.gatewayUrl!==t.gatewayUrl||this.settings.token!==t.token||this.password!==t.password,r=J({phase:e.phase,hello:e.hello,settings:this.settings,liveGatewayUrl:t.gatewayUrl,secret:this.settings.token||this.password,lastError:e.lastError,systemInfo:this.systemInfo,systemInfoLoading:this.systemInfoLoading,systemInfoUnavailable:this.systemInfoUnavailable,ping:this.ping,pingFailed:this.pingFailed,pingSamples:this.pingSamples,statusHistory:this.statusHistory,statusFailed:this.statusFailed,dirty:n,sessionDirty:this.settings.sessionKey.trim()!==e.sessionKey,sessionSaved:this.sessionSaved,showGatewaySecret:this.gatewaySecretVisible,canForgetDevice:this.context.gateway.hasStoredDeviceToken?.()??!1,onForgetDevice:()=>void this.forgetDevice(),onConnectionChange:e=>this.updateConnection(e),onSecretChange:e=>{this.password=``,this.updateConnection({token:e})},onSessionKeyChange:e=>{this.sessionSaved=!1,this.settings={...this.settings,sessionKey:e}},onToggleGatewaySecretVisibility:()=>{this.gatewaySecretVisible=!this.gatewaySecretVisible},onConnect:()=>this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password}),onDiscardConnection:()=>this.resetConnectionDraft(),onReconnect:()=>this.context.gateway.connect(),onSaveSession:()=>this.saveSession(),onDiscardSession:()=>this.resetSessionDraft()});return v`
      <section class="content-header" ${ee({toolbarHeader:!0})}>
        <div>
          <h1 class="page-title">${f(`connection`)}</h1>
          <div class="page-subtitle">
            ${d(`connection`)} ${ue(Z)}
          </div>
        </div>
      </section>
      ${A(r)}
    `}},C([ae({context:te,subscribe:!0})],Q.prototype,`context`,void 0),C([x()],Q.prototype,`settings`,void 0),C([x()],Q.prototype,`password`,void 0),C([x()],Q.prototype,`gatewaySecretVisible`,void 0),C([x()],Q.prototype,`systemInfo`,void 0),C([x()],Q.prototype,`systemInfoUnavailable`,void 0),C([x()],Q.prototype,`systemInfoLoading`,void 0),C([x()],Q.prototype,`ping`,void 0),C([x()],Q.prototype,`pingFailed`,void 0),C([x()],Q.prototype,`statusHistory`,void 0),C([x()],Q.prototype,`statusFailed`,void 0),C([x()],Q.prototype,`sessionSaved`,void 0),customElements.get(`openclaw-connection-page`)||customElements.define(`openclaw-connection-page`,Q)})))()}$();
//# sourceMappingURL=connection-page-BgoXyeF1.js.map