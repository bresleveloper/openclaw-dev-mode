import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{a as r,f as i,g as a,h as o,m as s}from"./lit-runtime-B2f-BITn.js";import{a as c,i as l,n as u,r as d,t as f}from"./i18n-Cb2Gon67.js";import{r as p}from"./app-route-paths-Ckh-KQjG.js";import{t as m}from"./number-coercion-FQ9q6Y4E.js";import{n as h}from"./session-display-SOXKSy_a.js";import{Cr as g,Jt as _,Nr as v,Pr as y,Rn as b,Sr as x,Tr as S,fr as C,l as w,m as T,n as E,p as D,pr as O,s as k,sr as ee,xr as te,yr as A}from"./index-zot7ymVq.js";import{a as j,c as M,i as N}from"./presenter-C-y4fyhH.js";import{c as P,d as F,i as I}from"./cron-2ubIpFlU.js";import{a as L,i as R,r as z,t as B}from"./provider-quota-summary--OGcm96u.js";function V(e){return e===`error`?`danger`:e===`warning`?`warn`:``}function H(e){return e in S?S[e]:S.radio}function U(e){return e.items.length===0?o:a`
    <section class="card ov-attention">
      <div class="card-title">${d(`overview.attention.title`)}</div>
      <div class="ov-attention-list">
        ${e.items.map(e=>a`
            <div class="ov-attention-item ${V(e.severity)}">
              <span class="ov-attention-icon">${H(e.icon)}</span>
              <div class="ov-attention-body">
                <div class="ov-attention-title">${e.title}</div>
                <div class="muted">${e.description}</div>
              </div>
              ${e.href?a`<a
                    class="ov-attention-link"
                    href=${e.href}
                    target=${e.external?x:o}
                    rel=${e.external?g():o}
                    >${d(`common.docs`)}</a
                  >`:o}
            </div>
          `)}
      </div>
    </section>
  `}var W=/\d{3,}/g;function G(e){return a`${r(e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(W,e=>`<span class="blur-digits">${e}</span>`))}`}function K(e,t){let n=a`
    <span class="ov-card__label">${e.label}</span>
    <span class="ov-card__value">${e.value}</span>
    <span class="ov-card__hint">${e.hint}</span>
  `;return t.canNavigate(e.routeId)?a`<button
        class="ov-card"
        data-kind=${e.kind}
        @click=${()=>t.onNavigate(e.routeId)}
      >
        ${n}
      </button>`:a`<div class="ov-card" data-kind=${e.kind} style="cursor:default">${n}</div>`}function q(e){let t=e[0];if(!t)return null;let n=z(t.resetAt),r=[t.displayName,t.label,n?`reset ${n}`:null].filter(Boolean),i=e.find(e=>e.displayName!==t.displayName||e.label!==t.label),o=i?`${[i.displayName,i.label].filter(Boolean).join(` · `)} ${d(`overview.cards.modelAuthUsageLeft`,{pct:String(i.remaining)})}`:null,s=t.remaining<=10?`danger`:t.remaining<=25?`warn`:``;return{kind:`quota`,routeId:`usage`,label:d(`tabs.usage`),value:a`<span class=${s}
      >${d(`overview.cards.modelAuthUsageLeft`,{pct:String(t.remaining)})}</span
    >`,hint:[r.join(` · `),o].filter(Boolean).join(` · `)}}function J(){return a`
    <section class="ov-cards">
      ${[0,1,2,3].map(e=>a`
          <div class="ov-card" style="cursor:default;animation-delay:${e*50}ms">
            <span class="skeleton skeleton-line" style="width:60px;height:10px"></span>
            <span class="skeleton skeleton-stat"></span>
            <span class="skeleton skeleton-line skeleton-line--medium" style="height:12px"></span>
          </div>
        `)}
    </section>
  `}function Y(e){if(!(e.usageResult!=null||e.sessionsResult!=null||e.skillsReport!=null))return J();let t=e.usageResult?.totals,n=ee(t?.totalCost),r=O(t?.totalTokens),i=t?String(e.usageResult?.aggregates?.messages?.total??0):`0`,s=e.sessionsResult?.count??null,c=e.skillsReport?.skills??[],l=c.filter(e=>!e.disabled).length,u=c.filter(e=>e.blockedByAllowlist).length,f=c.length,p=e.cronStatus?.enabled??null,g=e.cronStatus?.nextWakeAtMs??null,_=e.cronJobs.length,v=e.cronJobs.filter(M).length,y=e.modelAuthStatus===null,b=(e.modelAuthStatus?.providers??[]).filter(R),x=q(B(b)),S=p==null?d(`common.na`):p?`${_} jobs`:d(`common.disabled`),C=v>0?a`<span class="danger">${v} failed</span>`:g?d(`overview.stats.cronNext`,{time:j(g)}):``,w=[{kind:`cost`,routeId:`usage`,label:d(`overview.cards.cost`),value:n,hint:`${r} tokens · ${i} msgs`},{kind:`sessions`,routeId:`sessions`,label:d(`overview.stats.sessions`),value:String(s??d(`common.na`)),hint:d(`overview.stats.sessionsHint`)},{kind:`skills`,routeId:`skills`,label:d(`overview.cards.skills`),value:`${l}/${f}`,hint:u>0?`${u} blocked`:`${l} active`},{kind:`cron`,routeId:`cron`,label:d(`overview.stats.cron`),value:S,hint:C}];if(x&&w.splice(1,0,x),y)w.push({kind:`auth`,routeId:`overview`,label:d(`overview.cards.modelAuth`),value:d(`common.na`),hint:``});else if(b.length>0){let e=b.filter(e=>e.status===`expired`||e.status===`missing`).length,t=b.filter(e=>e.status===`expiring`).length,n=e>0?a`<span class="danger"
            >${d(`overview.cards.modelAuthExpired`,{count:String(e)})}</span
          >`:t>0?a`<span class="warn"
              >${d(`overview.cards.modelAuthExpiring`,{count:String(t)})}</span
            >`:d(`overview.cards.modelAuthOk`,{count:String(b.length)}),r=(e,t)=>{let n=m(e);if(n===void 0||t>=25)return null;let r=new Date(n);return n-Date.now()<1440*60*1e3?r.toLocaleTimeString(void 0,{hour:`numeric`,minute:`2-digit`}):r.toLocaleDateString(void 0,{month:`short`,day:`numeric`})},i=b.map(e=>{let t=[];for(let n of e.usage?.windows??[]){let e=Math.max(0,Math.min(100,Math.round(100-n.usedPercent))),i=(n.label||``).trim(),a=i?`${i} `:``,o=d(`overview.cards.modelAuthUsageLeft`,{pct:String(e)}),s=r(n.resetAt,e);t.push(s?`${a}${o} (${s})`:`${a}${o}`)}return e.expiry&&Number.isFinite(e.expiry.at)&&e.status!==`static`&&e.expiry.label&&e.expiry.label!==`unknown`&&t.push(d(`overview.cards.modelAuthExpiresIn`,{when:e.expiry.label})),t.length>0?`${e.displayName}: ${t.join(`, `)}`:null}).filter(e=>e!==null).slice(0,2).join(` · `)||d(`overview.cards.modelAuthProviders`,{count:String(b.length)});w.push({kind:`auth`,routeId:`overview`,label:d(`overview.cards.modelAuth`),value:n,hint:i})}let T=e.sessionsResult?.sessions.slice(0,5)??[];return a`
    <section class="ov-cards">${w.map(t=>K(t,e))}</section>

    ${T.length>0?a`
          <section class="ov-recent">
            <h3 class="ov-recent__title">${d(`overview.cards.recentSessions`)}</h3>
            <ul class="ov-recent__list">
              ${T.map(e=>a`
                  <li class="ov-recent__row">
                    <span class="ov-recent__key"
                      >${G(h(e.key,e))}</span
                    >
                    <span class="ov-recent__model">${e.model??``}</span>
                    <span class="ov-recent__time"
                      >${e.updatedAt?A(e.updatedAt):``}</span
                    >
                  </li>
                `)}
            </ul>
          </section>
        `:o}
  `}function X(e){if(e.events.length===0)return o;let t=e.events.slice(0,20);return a`
    <details class="card ov-event-log" open>
      <summary class="ov-expandable-toggle">
        <span class="nav-item__icon">${S.radio}</span>
        ${d(`overview.eventLog.title`)}
        <span class="ov-count-badge">${e.events.length}</span>
      </summary>
      <div class="ov-event-log-list">
        ${t.map(e=>a`
            <div class="ov-event-log-entry">
              <span class="ov-event-log-ts">${C(e.ts,void 0,``)}</span>
              <span class="ov-event-log-name">${e.event}</span>
              ${e.payload?a`<span class="ov-event-log-payload muted"
                    >${N(e.payload).slice(0,120)}</span
                  >`:o}
            </div>
          `)}
      </div>
    </details>
  `}var Z=`\x1B`,ne=RegExp(`${Z}\\]8;;.*?${Z}\\\\|${Z}\\]8;;${Z}\\\\`,`g`),re=RegExp(`${Z}\\[[0-9;]*m`,`g`);function ie(e){return e.replace(ne,``).replace(re,``)}function ae(e){if(e.lines.length===0)return o;let t=e.lines.slice(-50).map(e=>ie(e)).join(`
`);return a`
    <details class="card ov-log-tail" open>
      <summary class="ov-expandable-toggle">
        <span class="nav-item__icon">${S.scrollText}</span>
        ${d(`overview.logTail.title`)}
        <span class="ov-count-badge">${e.lines.length}</span>
        <span
          class="ov-log-refresh"
          @click=${t=>{t.preventDefault(),t.stopPropagation(),e.onRefreshLogs()}}
          >${S.loader}</span
        >
      </summary>
      <pre class="ov-log-tail-content">${t}</pre>
    </details>
  `}function oe(e){let t=e.hello?.snapshot,n=t?.uptimeMs?te(t.uptimeMs):d(`common.na`),r=e.hello?.policy?.tickIntervalMs,i=r?`${(r/1e3).toFixed(r%1e3==0?0:1)}s`:d(`common.na`),o=t?.authMode===`trusted-proxy`,s=c(e.settings.locale)?e.settings.locale:u.getLocale();return a`
    <section class="grid">
      <div class="card">
        <div class="card-title">${d(`overview.access.title`)}</div>
        <div class="card-sub">${d(`overview.access.subtitle`)}</div>
        <div class="ov-access-grid" style="margin-top: 16px;">
          <label class="field ov-access-grid__full">
            <span>${d(`overview.access.wsUrl`)}</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${t=>{let n=t.target.value;e.onConnectionChange({gatewayUrl:n,token:T(e.settings.gatewayUrl,n,e.settings.token)})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          ${o?``:a`
                <label class="field">
                  <span>${d(`overview.access.token`)}</span>
                  <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <input
                      type=${e.showGatewayToken?`text`:`password`}
                      autocomplete="off"
                      style="flex: 1 1 0%; min-width: 0; box-sizing: border-box;"
                      .value=${e.settings.token}
                      @input=${t=>{let n=t.target.value;e.onConnectionChange({token:n})}}
                      placeholder="OPENCLAW_GATEWAY_TOKEN"
                    />
                    <openclaw-tooltip
                      .content=${e.showGatewayToken?d(`overview.access.hideToken`):d(`overview.access.showToken`)}
                    >
                      <button
                        type="button"
                        class="btn btn--icon ${e.showGatewayToken?`active`:``}"
                        style="flex-shrink: 0; width: 36px; height: 36px; box-sizing: border-box;"
                        aria-label=${d(`overview.access.toggleTokenVisibility`)}
                        aria-pressed=${e.showGatewayToken}
                        @click=${e.onToggleGatewayTokenVisibility}
                      >
                        ${e.showGatewayToken?S.eye:S.eyeOff}
                      </button>
                    </openclaw-tooltip>
                  </div>
                </label>
                <label class="field">
                  <span>${d(`overview.access.password`)}</span>
                  <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <input
                      type=${e.showGatewayPassword?`text`:`password`}
                      autocomplete="off"
                      style="flex: 1 1 0%; min-width: 0; width: 100%; box-sizing: border-box;"
                      .value=${e.password}
                      @input=${t=>{let n=t.target.value;e.onPasswordChange(n)}}
                      placeholder=${d(`overview.access.passwordPlaceholder`)}
                    />
                    <openclaw-tooltip
                      .content=${e.showGatewayPassword?d(`overview.access.hidePassword`):d(`overview.access.showPassword`)}
                    >
                      <button
                        type="button"
                        class="btn btn--icon ${e.showGatewayPassword?`active`:``}"
                        style="flex-shrink: 0; width: 36px; height: 36px; box-sizing: border-box;"
                        aria-label=${d(`overview.access.togglePasswordVisibility`)}
                        aria-pressed=${e.showGatewayPassword}
                        @click=${e.onToggleGatewayPasswordVisibility}
                      >
                        ${e.showGatewayPassword?S.eye:S.eyeOff}
                      </button>
                    </openclaw-tooltip>
                  </div>
                </label>
              `}
          <label class="field">
            <span>${d(`overview.access.sessionKey`)}</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${t=>{let n=t.target.value;e.onSessionKeyChange(n)}}
            />
          </label>
          <label class="field">
            <span>${d(`overview.access.language`)}</span>
            <select
              .value=${s}
              @change=${t=>{let n=t.target.value;u.setLocale(n),e.onLocaleChange(n)}}
            >
              ${l.map(e=>{let t=e.replace(/-([a-zA-Z])/g,(e,t)=>t.toUpperCase());return a`<option value=${e} ?selected=${s===e}>
                  ${d(`languages.${t}`)}
                </option>`})}
            </select>
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>${d(`common.connect`)}</button>
          <button class="btn" @click=${()=>e.onRefresh()}>${d(`common.refresh`)}</button>
          <span class="muted"
            >${d(o?`overview.access.trustedProxy`:`overview.access.connectHint`)}</span
          >
        </div>
      </div>

      <div class="card">
        <div class="card-title">${d(`overview.snapshot.title`)}</div>
        <div class="card-sub">${d(`overview.snapshot.subtitle`)}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${d(`overview.snapshot.status`)}</div>
            <div class="stat-value ${e.connected?`ok`:`warn`}">
              ${e.connected?d(`common.ok`):d(`common.offline`)}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${d(`overview.snapshot.uptime`)}</div>
            <div class="stat-value">${n}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${d(`overview.snapshot.tickInterval`)}</div>
            <div class="stat-value">${i}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${d(`overview.snapshot.lastChannelsRefresh`)}</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?A(e.lastChannelsRefresh):d(`common.na`)}
            </div>
          </div>
        </div>
        ${e.lastError?a`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
            </div>`:a`
              <div class="callout" style="margin-top: 14px">
                ${d(`overview.snapshot.channelsHint`)}
              </div>
            `}
      </div>
    </section>

    <div class="ov-section-divider"></div>

    ${Y({usageResult:e.usageResult,sessionsResult:e.sessionsResult,skillsReport:e.skillsReport,cronJobs:e.cronJobs,cronStatus:e.cronStatus,modelAuthStatus:e.modelAuthStatus,onNavigate:e.onNavigate,canNavigate:e.canNavigate})}
    ${U({items:e.attentionItems})}

    <div class="ov-section-divider"></div>

    <div class="ov-bottom-grid">
      ${X({events:e.eventLog})}
      ${ae({lines:e.overviewLogLines,onRefreshLogs:e.onRefreshLogs})}
    </div>
  `}function se(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function ce(e){return!!(e&&Object.values(e).some(e=>Array.isArray(e)&&e.length>0))}function Q(e,t,n,r,i){t.length>0&&e.push({severity:n,icon:r,title:i,description:t.map(e=>e.name).join(`, `)})}var $=class extends s{constructor(...e){super(...e),this.i18nController=new f(this),this.settings=w(),this.password=``,this.showGatewayToken=!1,this.showGatewayPassword=!1,this.cron=I(),this.usageResult=null,this.skillsReport=null,this.modelAuthStatus=null,this.overviewLogLines=[],this.overviewLogCursor=null,this.refreshPromise=null,this.subscriptions=[],this.sessionKeyDirty=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.resetServerState(),this.subscriptions=[this.context.gateway.subscribe(e=>{this.cron.client!==e.client&&this.resetServerState(),this.requestUpdate(),this.ensureInitialData()}),this.context.channels.subscribe(()=>this.requestUpdate()),this.context.sessions.subscribe(()=>this.requestUpdate()),this.context.gateway.subscribeEventLog(()=>this.requestUpdate())],this.ensureInitialData()}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.refreshPromise=null,super.disconnectedCallback()}resetServerState(){let e=this.context.gateway,t=e.snapshot.sessionKey;this.settings={...w(),gatewayUrl:e.connection.gatewayUrl,token:e.connection.token,sessionKey:t,lastActiveSessionKey:t},this.password=e.connection.password,this.cron=I(e.snapshot),this.usageResult=null,this.skillsReport=null,this.modelAuthStatus=null,this.overviewLogLines=[],this.overviewLogCursor=null,this.refreshPromise=null,this.sessionKeyDirty=!1}ensureInitialData(){let e=this.context.gateway.snapshot;!e.connected||!e.client||this.refreshPromise||this.refreshOverview(!1)}isCurrentClient(e){let t=this.context.gateway.snapshot;return t.connected&&t.client===e&&this.isConnected}async applyRequest(e,t,n){let r=await t;this.isCurrentClient(e)&&n(r)}async refreshOverview(e){let t=this.context,n=t.gateway.snapshot.client;if(!n||!t.gateway.snapshot.connected||this.refreshPromise)return;let r=e||!t.channels.state.channelsSnapshot?t.channels.refresh(!1):Promise.resolve(),i=se(),a=I({client:n,connected:!0}),o=Promise.allSettled([r,t.sessions.refresh(e?{force:!0}:void 0),Promise.all([F(a),P(a)]).then(()=>{this.isCurrentClient(n)&&(this.cron=a)}),this.applyRequest(n,b(n,{startDate:i,endDate:i,scope:`family`,timeZone:`local`}),e=>this.usageResult=e),this.applyRequest(n,_(n,null),e=>{this.skillsReport=e??null}),this.applyRequest(n,L(n,{refresh:e}).catch(()=>({ts:0,providers:[]})),e=>this.modelAuthStatus=e),this.loadLogs(n)]).then(()=>void 0);this.refreshPromise=o;try{await o}finally{this.refreshPromise===o&&(this.refreshPromise=null)}}async loadLogs(e){try{let t=await e.request(`logs.tail`,{cursor:this.overviewLogCursor??void 0,limit:100,maxBytes:5e4});if(!this.isCurrentClient(e))return;let n=Array.isArray(t.lines)?t.lines.filter(e=>typeof e==`string`):[];this.overviewLogLines=(t.reset?n:[...this.overviewLogLines,...n]).slice(-500),typeof t.cursor==`number`&&(this.overviewLogCursor=t.cursor)}catch{}}updateConnectionDraft(e){this.settings={...this.settings,...e}}updateLocale(e){let t=this.context.gateway,n=this.context.navigation.snapshot,r={...this.settings,themeMode:this.context.theme.mode,navCollapsed:n.navCollapsed,sidebarPinnedRoutes:[...n.sidebarPinnedRoutes],sidebarMoreExpanded:n.sidebarMoreExpanded,locale:e};this.settings=r,D({gatewayUrl:t.connection.gatewayUrl,token:t.connection.token,sessionKey:t.snapshot.sessionKey,lastActiveSessionKey:t.snapshot.sessionKey,locale:e})}connect(){let e=this.sessionKeyDirty?{sessionKey:this.settings.sessionKey,lastActiveSessionKey:this.settings.sessionKey}:k(this.settings.gatewayUrl);this.settings={...this.settings,...e},this.sessionKeyDirty=!1,this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password,sessionKey:e.sessionKey})}buildAttentionItems(){let e=this.context.gateway.snapshot,t=[];e.lastError&&t.push({severity:`error`,icon:`x`,title:`Gateway Error`,description:e.lastError});let n=e.hello?.auth??null;n?.scopes&&!E(n)&&t.push({severity:`warning`,icon:`key`,title:`Missing operator.read scope`,description:`This connection does not have the operator.read scope. Some features may be unavailable.`,href:`https://docs.openclaw.ai/web/dashboard`,external:!0});let r=this.skillsReport?.skills??[],i=r.filter(e=>!e.disabled&&ce(e.missing));if(i.length>0){let e=i.slice(0,3).map(e=>e.name),n=i.length>3?` +${i.length-3} more`:``;t.push({severity:`warning`,icon:`zap`,title:`Skills with missing dependencies`,description:`${e.join(`, `)}${n}`})}let a=r.filter(e=>e.blockedByAllowlist);Q(t,a,`warning`,`shield`,`${a.length} skill${a.length===1?``:`s`} blocked`);let o=this.cron.cronJobs.filter(M);Q(t,o,`error`,`clock`,`${o.length} cron job${o.length===1?``:`s`} failed`);let s=Date.now(),c=this.cron.cronJobs.filter(e=>e.enabled&&e.state?.nextRunAtMs!=null&&s-e.state.nextRunAtMs>3e5);Q(t,c,`warning`,`clock`,`${c.length} overdue job${c.length===1?``:`s`}`);let l=(this.modelAuthStatus?.providers??[]).filter(R),u=l.filter(e=>e.status===`expired`||e.status===`missing`);u.length>0&&t.push({severity:`error`,icon:`key`,title:d(`overview.cards.modelAuthAttentionExpiredTitle`),description:d(`overview.cards.modelAuthAttentionExpiredDesc`,{providers:u.map(e=>e.displayName).join(`, `)})});let f=l.filter(e=>e.status===`expiring`);return f.length>0&&t.push({severity:`warning`,icon:`key`,title:d(`overview.cards.modelAuthAttentionExpiringTitle`),description:f.map(e=>d(`overview.cards.modelAuthAttentionExpiringEntry`,{provider:e.displayName,when:e.expiry?.label??`soon`})).join(`, `)}),t}render(){let e=this.context.gateway.snapshot,t=this.context.channels.state,n=this.context.sessions.state;return a`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${y(`overview`)}</div>
          <div class="page-sub">${v(`overview`)}</div>
        </div>
      </section>
      ${oe({connected:e.connected,hello:e.hello,settings:this.settings,password:this.password,lastError:e.lastError,lastChannelsRefresh:t.channelsLastSuccess,modelAuthStatus:this.modelAuthStatus,usageResult:this.usageResult,sessionsResult:n.result,skillsReport:this.skillsReport,cronJobs:this.cron.cronJobs,cronStatus:this.cron.cronStatus,attentionItems:this.buildAttentionItems(),eventLog:this.context.gateway.eventLog,overviewLogLines:this.overviewLogLines,showGatewayToken:this.showGatewayToken,showGatewayPassword:this.showGatewayPassword,onConnectionChange:e=>this.updateConnectionDraft(e),onLocaleChange:e=>this.updateLocale(e),onPasswordChange:e=>this.password=e,onSessionKeyChange:e=>{this.sessionKeyDirty=!0,this.settings={...this.settings,sessionKey:e,lastActiveSessionKey:e}},onToggleGatewayTokenVisibility:()=>{this.showGatewayToken=!this.showGatewayToken},onToggleGatewayPasswordVisibility:()=>{this.showGatewayPassword=!this.showGatewayPassword},onConnect:()=>this.connect(),onRefresh:()=>void this.refreshOverview(!0),onNavigate:e=>{p(e)&&this.context.navigate(e)},canNavigate:p,onRefreshLogs:()=>void this.refreshOverview(!0)})}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([i()],$.prototype,`settings`,void 0),n([i()],$.prototype,`password`,void 0),n([i()],$.prototype,`showGatewayToken`,void 0),n([i()],$.prototype,`showGatewayPassword`,void 0),n([i()],$.prototype,`cron`,void 0),n([i()],$.prototype,`usageResult`,void 0),n([i()],$.prototype,`skillsReport`,void 0),n([i()],$.prototype,`modelAuthStatus`,void 0),n([i()],$.prototype,`overviewLogLines`,void 0),customElements.get(`openclaw-overview-page`)||customElements.define(`openclaw-overview-page`,$);
//# sourceMappingURL=overview-page-DYDxPAFg.js.map