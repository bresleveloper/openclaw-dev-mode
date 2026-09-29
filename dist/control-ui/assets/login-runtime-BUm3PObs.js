import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t,co as n,en as r,in as i,sa as a}from"./control-ui-foundation-Ds5QQwGa.js";import{Gl as o,Il as s,J as c,K as l,X as u,Xl as d,Y as f,Z as p,_i as m,gi as h,nu as g,tu as _,vi as v,zl as y}from"./control-ui-core-DkXlmHxW.js";import{$ as b,X as x,Y as S,ct as C,nt as w,ut as T}from"./lit-runtime-DLvISeBM.js";import{Fi as E,Ii as D,Si as O,Yi as k,ba as ee,hi as te,qi as ne,xi as re,yi as A}from"./control-ui-core-BdNTI4B-.js";import{Mi as j,Ni as M,Pi as N}from"./control-ui-boot-shared-XNIZlLuA.js";import{E as P,T as F}from"./control-ui-boot-shared-C5a8_33C.js";var I,L;function R(){return(R=e((()=>{g(),I={login:{heading:`Connect to OpenClaw`,lede:`Enter the Gateway URL and secret, or open the one-time link that openclaw dashboard prints on the Gateway host.`,gatewayUrl:`Gateway URL`,gatewaySettings:`Gateway settings`,secret:`Gateway secret`,setupCodeHint:`This is a device setup code for the OpenClaw mobile app, not the Gateway secret. Paste it in the app's Gateway settings instead; the Gateway secret comes from openclaw gateway auth-token --show on the Gateway host.`,secretPlaceholder:`Paste the token or type the password`,runOnHost:`Run on the Gateway host`,connection:{target:`Connecting to {host}`,secretEntered:`secret entered`,noSecret:`no secret`,change:`Change`},showSecret:`Show Gateway secret`,hideSecret:`Hide Gateway secret`,toggleSecretVisibility:`Toggle Gateway secret visibility`,failure:{rawError:`Raw error`,profileUnavailable:{title:`Profile verification unavailable`,stepRetry:`Retry shortly.`,stepAdmin:`If this continues, ask a Gateway administrator to check the identity provider and GitHub API credential.`},verifiedUserRequired:{title:`Verified identity required`,summary:`This Gateway has named roles enabled. Device and setup tokens cannot identify a person.`,stepIdentity:`Reconnect through the trusted proxy or Tailscale so the Gateway can verify your identity.`,stepSharedSecret:`For trusted local operator access, use the shared Gateway token or password.`},authRequired:{title:`This Gateway expects its token`,passwordTitle:`This Gateway expects its password`,summary:`The Gateway at {host} is reachable, but it needs a matching token or password before this browser can connect.`,stepPaste:`Paste the token from openclaw gateway auth-token --show into Gateway secret.`,stepPassword:`Type the configured Gateway password into Gateway secret.`,stepGenerate:`If no token is configured, run openclaw doctor --generate-gateway-token on the gateway host.`,stepConnect:`Click Connect again after updating the Gateway secret.`},authFailed:{title:`Gateway secret rejected`,summary:`{host} rejected the supplied Gateway secret. Check that it belongs to this Gateway and try again.`,stepDashboard:`Run openclaw dashboard --no-open for a fresh URL, or openclaw gateway auth-token --show to recover the token.`,stepReplace:`Replace the Gateway secret with the token for this Gateway URL.`},trustedProxy:{title:`Proxy authentication required`,summary:`The Gateway is reachable, but it rejected the proxy identity or forwarding information.`,stepSignIn:`Open the configured authenticated proxy or SSO dashboard URL and sign in there, rather than visiting the Gateway directly.`,stepHeaders:`Ask the Gateway administrator to check for missing identity headers and required-header forwarding on WebSocket upgrade requests, and confirm your account is permitted.`,stepNoToken:`A Gateway token cannot replace proxy authentication.`},rateLimited:{title:`Too many failed attempts`,summary:`The Gateway is temporarily limiting authentication attempts for this client.`,stepStop:`Stop retrying from this tab for a moment.`,stepWait:`Wait for the auth limiter to cool down, then reconnect with the corrected credential.`,stepCheckClients:`If this is a shared host, check other clients for repeated bad retries.`},pairing:{title:`Approve this browser`,scopeTitle:`Approve the new access level`,roleTitle:`Approve the new role`,metadataTitle:`Re-approve this browser`,summary:`This browser passed Gateway auth at {host}, but the Gateway has not seen it before. A one-time approval on the Gateway host finishes pairing.`,upgradeSummary:`This browser is already paired with {host}, but it asked for access it was not approved for. Approve the new request on the Gateway host.`,stepDashboard:`Prefer a link? Run openclaw dashboard on the Gateway host and open the one-time URL it prints in this browser.`,stepLatest:`That command prints the exact approve command for the newest pending request; run that one as well.`,stepReconnect:`Once approved, click Connect.`,waiting:`Waiting for approval… this page connects on its own once the request is approved.`,checkNow:`Check now`},insecure:{title:`Secure browser context required`,summary:`This page is running over plain HTTP, so the browser cannot create the device identity the Gateway expects.`,stepHttps:`Use HTTPS/Tailscale Serve, or open http://127.0.0.1:18789 on the Gateway host.`,stepAvoidDisable:`Do not use a remote plain-HTTP URL; a token or password cannot replace browser device identity.`},origin:{title:`Browser origin not allowed`,summary:`The Gateway rejected this page origin before accepting the Control UI connection.`,stepAllowedOrigins:`Add this browser origin to gateway.controlUi.allowedOrigins.`,stepFullOrigin:`Use full origins such as http://localhost:5173, not wildcard patterns.`,stepRestart:`Restart or reload the Gateway after changing allowed origins.`},protocol:{title:`Protocol mismatch`,summary:`The served Control UI and the running Gateway do not agree on the supported connection protocol.`,refresh:`Refresh page`,stepDashboard:`Reopen the served dashboard with openclaw dashboard so the UI and Gateway come from the same install.`,stepDevUi:`If using pnpm ui:dev, rebuild or restart the dev UI against the current checkout.`,stepRestart:`Restart the Gateway after updating OpenClaw so it serves the current protocol.`},network:{title:`Gateway unreachable`,summary:`The browser could not reach {host}. Check the address and transport before retrying credentials.`,stepGateway:`Confirm the Gateway is running with openclaw status or openclaw gateway run.`,stepUrl:`Check the Gateway URL and use wss:// when the Gateway is behind HTTPS/Tailscale Serve.`,stepDashboard:`Reopen the dashboard with openclaw dashboard --no-open to recopy the current URL and auth details.`}}}},L=Object.assign(()=>{Object.assign(_.login,I.login)},{catalog:I})})))()}function z(e){let t=e.trim(),n=t.toLowerCase().startsWith(`oc-pair://`)?t.slice(10):t;if(!/^[A-Za-z0-9_-]+$/u.test(n))return`unknown`;try{let e=Uint8Array.from(atob(n.replace(/-/g,`+`).replace(/_/g,`/`)),e=>e.charCodeAt(0)),t=JSON.parse(new TextDecoder().decode(e));return typeof t==`object`&&t&&`url`in t&&typeof t.url==`string`&&t.url.trim()!==``&&`bootstrapToken`in t&&typeof t.bootstrapToken==`string`&&t.bootstrapToken.trim()!==``?`setup-code`:`unknown`}catch{return`unknown`}}function B(){return(B=e((()=>{})))()}function V(e){return e===r.AUTH_PASSWORD_MISSING||e===r.AUTH_PASSWORD_MISMATCH||e===r.AUTH_PASSWORD_NOT_CONFIGURED}function H(e){let t=e.docsHref??`https://docs.openclaw.ai/web/dashboard`,n=c(e.rawError);return{kind:e.kind,placement:e.placement??`status`,tone:e.tone??`danger`,field:e.field,title:d(e.titleKey,e.stepParams),summary:e.summaryKey?d(e.summaryKey,e.stepParams):n,primaryCommand:e.primaryCommand,refreshAction:e.refreshAction,steps:e.stepKeys.map(t=>typeof t==`string`?{text:d(t,e.stepParams),commands:[]}:{text:d(t.key,e.stepParams),commands:t.commands}),docsHref:t,rawError:n}}function U(e){if(e.connected||!e.lastError)return null;let t=e.lastError,i=e.lastErrorCode??null,a=n(t),o=h(e.gatewayUrl);if(i===r.AUTHENTICATED_PROFILE_UNAVAILABLE)return H({kind:`profile-unavailable`,tone:`pending`,rawError:t,titleKey:`login.failure.profileUnavailable.title`,stepKeys:[`login.failure.profileUnavailable.stepRetry`,`login.failure.profileUnavailable.stepAdmin`],docsHref:`https://docs.openclaw.ai/concepts/user-model#gateway-profile-and-github-credit`});if(i===r.AUTH_VERIFIED_USER_REQUIRED)return H({kind:`verified-user-required`,rawError:t,titleKey:`login.failure.verifiedUserRequired.title`,summaryKey:`login.failure.verifiedUserRequired.summary`,stepKeys:[`login.failure.verifiedUserRequired.stepIdentity`,`login.failure.verifiedUserRequired.stepSharedSecret`],docsHref:`https://docs.openclaw.ai/gateway/operator-scopes`});if(i===r.CONTROL_UI_BUILD_MISMATCH)return H({kind:`build-mismatch`,tone:`pending`,rawError:t,titleKey:`chat.sidebar.serverUpdatedTitle`,summaryKey:`chat.sidebar.serverUpdatedRefresh`,refreshAction:{label:d(`login.failure.protocol.refresh`)},stepKeys:[],docsHref:`https://docs.openclaw.ai/web/control-ui`});let s=u(!1,t,i);if(s)return H({kind:`pairing-required`,tone:`pending`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection`,titleKey:s.kind===`scope-upgrade-pending`?`login.failure.pairing.scopeTitle`:s.kind===`role-upgrade-pending`?`login.failure.pairing.roleTitle`:s.kind===`metadata-upgrade-pending`?`login.failure.pairing.metadataTitle`:`login.failure.pairing.title`,summaryKey:s.kind===`pairing-required`?`login.failure.pairing.summary`:`login.failure.pairing.upgradeSummary`,primaryCommand:s.requestId?`openclaw devices approve ${s.requestId}`:`openclaw devices approve --latest`,stepKeys:[...s.requestId?[]:[`login.failure.pairing.stepLatest`],{key:`login.failure.pairing.stepDashboard`,commands:[`openclaw dashboard`]},...e.reconnectPending?[]:[`login.failure.pairing.stepReconnect`]],stepParams:{host:o}});if(i===r.AUTH_RATE_LIMITED||a.includes(`too many failed authentication attempts`)||a.includes(`rate limit`))return H({kind:`auth-rate-limited`,tone:`warn`,rawError:t,titleKey:`login.failure.rateLimited.title`,summaryKey:`login.failure.rateLimited.summary`,stepKeys:[`login.failure.rateLimited.stepStop`,`login.failure.rateLimited.stepWait`,`login.failure.rateLimited.stepCheckClients`]});if(p(!1,t,i))return H({kind:`insecure-context`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#insecure-http`,titleKey:`login.failure.insecure.title`,summaryKey:`login.failure.insecure.summary`,stepKeys:[`login.failure.insecure.stepHttps`,`login.failure.insecure.stepAvoidDisable`]});if(i===r.CONTROL_UI_ORIGIN_NOT_ALLOWED||a.includes(`origin not allowed`))return H({kind:`origin-not-allowed`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.origin.title`,summaryKey:`login.failure.origin.summary`,stepKeys:[`login.failure.origin.stepAllowedOrigins`,`login.failure.origin.stepFullOrigin`,`login.failure.origin.stepRestart`]});if(a.includes(`protocol mismatch`))return H({kind:`protocol-mismatch`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.protocol.title`,summaryKey:`login.failure.protocol.summary`,refreshAction:{label:d(`login.failure.protocol.refresh`)},stepKeys:[{key:`login.failure.protocol.stepDashboard`,commands:[`openclaw dashboard`]},{key:`login.failure.protocol.stepDevUi`,commands:[`pnpm ui:dev`]},`login.failure.protocol.stepRestart`]});let c=f(e),l=V(i);return H(c===`trusted-proxy`?{kind:`trusted-proxy`,rawError:t,titleKey:`login.failure.trustedProxy.title`,summaryKey:`login.failure.trustedProxy.summary`,stepKeys:[`login.failure.trustedProxy.stepSignIn`,`login.failure.trustedProxy.stepHeaders`,`login.failure.trustedProxy.stepNoToken`],docsHref:`https://docs.openclaw.ai/gateway/trusted-proxy-auth`}:c===`required`?{kind:`auth-required`,placement:`form`,tone:`warn`,field:`credential`,rawError:t,titleKey:l?`login.failure.authRequired.passwordTitle`:`login.failure.authRequired.title`,summaryKey:`login.failure.authRequired.summary`,stepKeys:l?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authRequired.stepPaste`,commands:[`openclaw gateway auth-token --show`]},{key:`login.failure.authRequired.stepGenerate`,commands:[`openclaw doctor --generate-gateway-token`]},`login.failure.authRequired.stepConnect`],stepParams:{host:o}}:c===`failed`?{kind:`auth-failed`,placement:`form`,field:`credential`,rawError:t,titleKey:l?`login.failure.authRequired.passwordTitle`:i===r.AUTH_TOKEN_MISMATCH?`login.failure.authRequired.title`:`login.failure.authFailed.title`,summaryKey:(i===r.AUTH_TOKEN_MISMATCH||i===r.AUTH_PASSWORD_MISMATCH)&&z(e.secret??``)===`setup-code`?`login.setupCodeHint`:`login.failure.authFailed.summary`,stepKeys:l?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authFailed.stepDashboard`,commands:[`openclaw dashboard --no-open`,`openclaw gateway auth-token --show`]},`login.failure.authFailed.stepReplace`],stepParams:{host:o}}:{kind:`network`,placement:`form`,tone:`warn`,field:`url`,rawError:t,titleKey:`login.failure.network.title`,summaryKey:`login.failure.network.summary`,stepKeys:[{key:`login.failure.network.stepGateway`,commands:[`openclaw status`,`openclaw gateway run`]},`login.failure.network.stepUrl`,{key:`login.failure.network.stepDashboard`,commands:[`openclaw dashboard --no-open`]}],stepParams:{host:o}})}function W(){return(W=e((()=>{i(),o(),l(),m()})))()}function G({text:e,commands:t}){let n=new Set(t),r=[...n].map(t=>[t,e.indexOf(t)]).toSorted(([e,t],[n,r])=>t-r||n.length-e.length),i=[],a=0;for(let[t,o]of r)o<a||(i.push(e.slice(a,o),P(t)),n.delete(t),a=o+t.length);i.push(e.slice(a));for(let e of n)i.push(` `,P(e));return i}function K(e){return e.steps.length===0?x:b`
    <ol class="login-gate__failure-steps">
      ${e.steps.map(e=>b`<li>${G(e)}</li>`)}
    </ol>
  `}function q(e){return b`
    <footer class="login-gate__foot">
      <details class="login-gate__failure-detail">
        <summary>${d(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${j}
        rel=${M()}
        >${d(`common.learnMore`)}</a
      >
    </footer>
  `}function J(e,t){return e.refreshAction?b`
    <button
      type="button"
      class="btn primary login-gate__failure-refresh"
      ?disabled=${t.state===`pending`}
      @click=${t.onRefresh}
    >
      ${t.state===`pending`?d(`common.refreshing`):t.state===`failed`?d(`common.retry`):e.refreshAction.label}
    </button>
  `:x}function Y(e,t,n){let[r,i,a]=t;return b`
    <openclaw-tooltip .content=${e?i:r}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${a}
        aria-pressed=${e}
        @click=${n}
      >
        ${e?E.eye:E.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function X(e){let{props:t,feedback:n}=e,r=z(t.secret)===`setup-code`,i=n?.placement===`form`?n.field:void 0,a=e=>{e.key===`Enter`&&t.onConnect()};return b`
    <div class="login-gate__form">
      <div class="field">
        <label for="login-gate-url">${d(`login.gatewayUrl`)}</label>
        <input
          id="login-gate-url"
          inputmode="url"
          autocapitalize="none"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="go"
          aria-invalid=${i===`url`?`true`:x}
          .value=${t.gatewayUrl}
          @input=${e=>{t.onGatewayUrlChange(e.target.value)}}
          @keydown=${a}
          placeholder="wss://gateway.example:443"
        />
      </div>
      <div class="field">
        <label for="login-gate-credential">${d(`login.secret`)}</label>
        <span class="settings-secret">
          <input
            id="login-gate-credential"
            type=${t.showGatewaySecret?`text`:`password`}
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="go"
            aria-invalid=${i===`credential`?`true`:x}
            aria-describedby=${r?`login-gate-secret-hint`:x}
            .value=${t.secret}
            @input=${e=>{t.onSecretChange(e.target.value)}}
            @keydown=${a}
            placeholder=${d(`login.secretPlaceholder`)}
          />
          ${Y(t.showGatewaySecret,[d(`login.showSecret`),d(`login.hideSecret`),d(`login.toggleSecretVisibility`)],t.onToggleGatewaySecret)}
        </span>
        ${r?b`<p id="login-gate-secret-hint" class="muted" role="status">${d(`login.setupCodeHint`)}</p>`:x}
      </div>
      ${e.withSubmit?b`
              <button class="btn primary login-gate__connect" @click=${t.onConnect}>
                ${d(`common.connect`)}
              </button>
            `:x}
    </div>
  `}function ie(e){let t=h(e.gatewayUrl),n=e.secret.trim()?d(`login.connection.secretEntered`):d(`login.connection.noSecret`);return b`
    <summary>
      <span class="login-gate__connection-target">
        ${E.server}
        <span>${d(`login.connection.target`,{host:t})}</span>
      </span>
      <span class="login-gate__connection-cred">· ${n}</span>
      <span class="login-gate__connection-change">${d(`login.connection.change`)}</span>
    </summary>
  `}function ae(e){let{props:t,feedback:n}=e,r=n.kind===`pairing-required`&&t.reconnectPending;return b`
    <section
      class="login-gate__body login-gate__failure"
      role="status"
      aria-live="polite"
      data-kind=${n.kind}
      data-tone=${n.tone}
    >
      <div class="login-gate__status-head">
        <span class="login-gate__status-icon" aria-hidden="true">${Z[n.tone]}</span>
        <div class="login-gate__status-text">
          <h1 class="login-gate__failure-title">${n.title}</h1>
          <p class="login-gate__failure-summary">${n.summary}</p>
        </div>
      </div>
      ${n.primaryCommand?b`
              <div class="login-gate__hero">
                <span class="login-gate__hero-label">${d(`login.runOnHost`)}</span>
                ${P(n.primaryCommand,`hero`)}
              </div>
            `:x}
      ${K(n)}
      ${r?b`<p class="login-gate__failure-summary">
              <span class="session-run-spinner" aria-hidden="true"></span>
              ${d(`login.failure.pairing.waiting`)}
            </p>`:x}
      <div class="login-gate__actions">
        ${J(n,e.refreshAction)}
        <button class="btn login-gate__connect" @click=${t.onConnect}>
          ${d(r?`login.failure.pairing.checkNow`:`common.connect`)}
        </button>
      </div>
      <details class="login-gate__connection">
        ${ie(t)} ${X({...e,withSubmit:!1})}
      </details>
      ${q(n)}
    </section>
  `}function oe(e){let{feedback:t}=e;return b`
    <section
      class=${t?`login-gate__body login-gate__failure`:`login-gate__body`}
      role=${t?`status`:x}
      aria-live=${t?`polite`:x}
      data-kind=${t?.kind??x}
      data-tone=${t?.tone??x}
    >
      <div class="login-gate__status-text">
        <h1 class=${t?`login-gate__failure-title`:`login-gate__heading`}>
          ${t?.title??d(`login.heading`)}
        </h1>
        <p class=${t?`login-gate__failure-summary`:`login-gate__lede`}>
          ${t?.summary??d(`login.lede`)}
        </p>
      </div>
      ${X({...e,withSubmit:!0})}
      ${t?b`${K(t)} ${q(t)}`:b`
              <details class="login-gate__help">
                <summary class="login-gate__help-title">${d(`connection.help.title`)}</summary>
                <ol class="login-gate__steps">
                  <li>
                    ${d(`connection.help.step1`)}${P(`openclaw gateway run`)}
                  </li>
                  <li>
                    ${d(`connection.help.step2`)} ${P(`openclaw dashboard`)}
                  </li>
                  <li>${d(`connection.help.step3`)}</li>
                </ol>
                <div class="login-gate__docs">
                  <a
                    class="session-link"
                    href="https://docs.openclaw.ai/web/dashboard"
                    target=${j}
                    rel=${M()}
                    >${d(`connection.help.docsLink`)}</a
                  >
                </div>
              </details>
            `}
    </section>
  `}function se(e,t){let n=a(e.resourceBasePath),r=ne(`favicon.svg`,n),i=U(e),o=i?.placement===`status`?ae({props:e,feedback:i,refreshAction:t}):oe({props:e,feedback:i});return b`
    <div class="login-gate">
      <openclaw-toast-host></openclaw-toast-host>
      <div class="login-gate__card" data-mode=${i?.placement??`form`}>
        <header class="login-gate__brand">
          ${e.mascot===`none`?b`<span class="login-gate__logo login-gate__logo--neutral" aria-hidden="true"
                  >${E.mark}</span
                >`:b`<img class="login-gate__logo" src=${r} alt="" />`}
          <span class="login-gate__brand-name">OpenClaw</span>
        </header>
        ${o}
        ${e.onOpenGatewaySettings?b`<button class="btn" @click=${e.onOpenGatewaySettings}>
                ${d(`login.gatewaySettings`)}
              </button>`:x}
      </div>
    </div>
  `}var Z,Q;function $(){return($=e((()=>{S(),w(),ee(),O(),k(),te(),o(),v(),R(),N(),m(),y(),F(),D(),W(),L(),Z={pending:E.shieldEllipsis,warn:E.clock,danger:E.shieldAlert},Q=class extends s{constructor(...e){super(...e),this.refreshState=`idle`}ownsRefresh(e){let t=this.props;return this.refreshAttempt===e&&this.isConnected&&t!==void 0&&!t.connected&&!t.reconnectPending&&[`lastError`,`lastErrorCode`,`lastErrorAuthReason`,`gatewayUrl`,`resourceBasePath`,`secret`].every(n=>t[n]===e.props[n])}cancelRefresh(){this.refreshAttempt=void 0,this.refreshState=`idle`}willUpdate(){this.refreshAttempt&&!this.ownsRefresh(this.refreshAttempt)&&this.cancelRefresh()}disconnectedCallback(){this.cancelRefresh(),super.disconnectedCallback()}async refreshPage(){let e=this.props;if(!e||this.refreshAttempt||this.refreshState===`pending`||!this.isConnected||e.connected||e.reconnectPending||!U(e)?.refreshAction||!re(!0))return;let t={props:e};this.refreshAttempt=t,this.refreshState=`pending`;try{let e=await A({canReload:()=>this.ownsRefresh(t)});this.ownsRefresh(t)&&!e&&(this.refreshState=`failed`)}catch{this.ownsRefresh(t)&&(this.refreshState=`failed`)}finally{this.refreshAttempt===t&&(this.ownsRefresh(t)?this.refreshAttempt=void 0:this.cancelRefresh())}}render(){let e=this.props;return e?se({...e,onConnect:()=>{this.cancelRefresh(),e.onConnect()},onGatewayUrlChange:t=>{this.cancelRefresh(),e.onGatewayUrlChange(t)},onSecretChange:t=>{this.cancelRefresh(),e.onSecretChange(t)}},{state:this.refreshState,onRefresh:()=>void this.refreshPage()}):x}},t([T({attribute:!1})],Q.prototype,`props`,void 0),t([C()],Q.prototype,`refreshState`,void 0),customElements.get(`openclaw-login-gate`)||customElements.define(`openclaw-login-gate`,Q)})))()}export{L as a,R as i,z as n,B as r,$ as t};
//# sourceMappingURL=login-runtime-BUm3PObs.js.map