import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Eu as n,Gt as r,Ht as i,Is as a,Iu as o,Kt as s,Ls as c,Lu as l,Su as u,Tu as ee,Wt as d,ju as f,lu as p,qt as m}from"./control-ui-core-bJHyI7AF.js";import{Ba as h,Gi as g,Ha as _,Hi as v,Ri as y,Wi as te,ga as ne,ma as b,mo as x,na as S,ra as re}from"./control-ui-core-DNh4McGE.js";import{$ as C,X as w,Y as T,ct as E,nt as ie,ut as ae}from"./lit-runtime-DyST807n.js";import{_n as D,gn as O,vn as k}from"./control-ui-boot-shared-DsSYH3B6.js";import{hn as A,ii as j,ja as M,wo as N,yn as P}from"./ui-DeikvIdP.js";import{T as F,w as I}from"./control-ui-boot-shared-C9uJ732w.js";import{Cc as L,wc as R}from"./control-ui-boot-shared-C1PHuQAX.js";var z,B;function V(){return(V=e((()=>{l(),z={login:{heading:`Connect to OpenClaw`,lede:`Enter the Gateway URL and secret, or open the one-time link that openclaw dashboard prints on the Gateway host.`,gatewayUrl:`Gateway URL`,gatewaySettings:`Gateway settings`,secret:`Gateway secret`,setupCodeHint:`This is a device setup code for the OpenClaw mobile app, not the Gateway secret. Paste it in the app's Gateway settings instead; the Gateway secret comes from openclaw gateway auth-token --show on the Gateway host.`,secretPlaceholder:`Paste the token or type the password`,runOnHost:`Run on the Gateway host`,connection:{target:`Connecting to {host}`,secretEntered:`secret entered`,noSecret:`no secret`,change:`Change`},showSecret:`Show Gateway secret`,hideSecret:`Hide Gateway secret`,toggleSecretVisibility:`Toggle Gateway secret visibility`,failure:{rawError:`Raw error`,busy:{title:`Gateway busy, retrying…`,summary:`The Gateway is reachable, but the connection could not be opened. This page will retry automatically.`,countdown:`Retrying in {seconds}s…`,retrying:`Retrying now…`},profileUnavailable:{title:`Couldn't verify your account`,summary:`OpenClaw couldn't check your account right now. Please try again shortly.`,stepRetry:`Retry shortly.`,stepAdmin:`If this continues, ask the person who manages OpenClaw to check account access.`},verifiedUserRequired:{title:`Verified identity required`,summary:`This Gateway has named roles enabled. Device and setup tokens cannot identify a person.`,stepIdentity:`Reconnect through the trusted proxy or Tailscale so the Gateway can verify your identity.`,stepSharedSecret:`For trusted local operator access, use the shared Gateway token or password.`},accessDenied:{title:`No access to this Gateway`,summary:`You're signed in, but this Gateway hasn't granted your account access, or that access has ended.`,stepAdmin:`Ask a Gateway administrator to assign your profile a role, or to grant or restore your access.`,stepFindProfile:`Administrators can find your profile with openclaw users list --json, then assign a role with users.setRole.`,stepReconnect:`This page reconnects on its own once access is granted.`},authRequired:{title:`This Gateway expects its token`,passwordTitle:`This Gateway expects its password`,summary:`The Gateway at {host} is reachable, but it needs a matching token or password before this browser can connect.`,stepPaste:`Paste the token from openclaw gateway auth-token --show into Gateway secret.`,stepPassword:`Type the configured Gateway password into Gateway secret.`,stepGenerate:`If no token is configured, run openclaw doctor --generate-gateway-token on the gateway host.`,stepConnect:`Click Connect again after updating the Gateway secret.`},authFailed:{title:`Gateway secret rejected`,summary:`{host} rejected the supplied Gateway secret. Check that it belongs to this Gateway and try again.`,stepDashboard:`Run openclaw dashboard --no-open for a fresh URL, or openclaw gateway auth-token --show to recover the token.`,stepReplace:`Replace the Gateway secret with the token for this Gateway URL.`},bootstrapInvalid:{title:`Pairing link is no longer valid`,summary:`This one-time dashboard link may have expired or already been used. Request a fresh link instead of changing the Gateway secret.`,stepOpen:`Open the fresh link that the command opens or copies in this browser. Pairing links can be used only once and expire after ten minutes.`,stepJson:`If the browser or clipboard is unavailable, run openclaw dashboard --json on the Gateway host and open its browserUrl in this browser.`},trustedProxy:{title:`Proxy authentication required`,summary:`The Gateway is reachable, but it rejected the proxy identity or forwarding information.`,stepSignIn:`Open the configured authenticated proxy or SSO dashboard URL and sign in there, rather than visiting the Gateway directly.`,stepHeaders:`Ask the Gateway administrator to check for missing identity headers and required-header forwarding on WebSocket upgrade requests, and confirm your account is permitted.`,stepNoToken:`A Gateway token cannot replace proxy authentication.`},rateLimited:{title:`Too many failed attempts`,summary:`The Gateway is temporarily limiting authentication attempts for this client.`,stepStop:`Stop retrying from this tab for a moment.`,stepWait:`Wait for the auth limiter to cool down, then reconnect with the corrected credential.`,stepCheckClients:`If this is a shared host, check other clients for repeated bad retries.`},pairing:{title:`Approve this browser`,scopeTitle:`Approve the new access level`,roleTitle:`Approve the new role`,metadataTitle:`Re-approve this browser`,summary:`This browser passed Gateway auth at {host}, but the Gateway has not seen it before. A one-time approval on the Gateway host finishes pairing.`,upgradeSummary:`This browser is already paired with {host}, but it asked for access it was not approved for. Approve the new request on the Gateway host.`,stepDashboard:`Prefer a link? Run openclaw dashboard on the Gateway host and open the one-time URL it prints in this browser.`,stepLatest:`That command prints the exact approve command for the newest pending request; run that one as well.`,stepReconnect:`Once approved, click Connect.`,waiting:`Waiting for approval… this page connects on its own once the request is approved.`,checkNow:`Check now`},insecure:{title:`Secure browser context required`,summary:`This page is running over plain HTTP, so the browser cannot create the device identity the Gateway expects.`,stepHttps:`Use HTTPS/Tailscale Serve, or open http://127.0.0.1:18789 on the Gateway host.`,stepAvoidDisable:`Do not use a remote plain-HTTP URL; a token or password cannot replace browser device identity.`},origin:{title:`Browser origin not allowed`,summary:`The Gateway rejected this page origin before accepting the Control UI connection.`,stepAllowedOrigins:`Add this browser origin to gateway.controlUi.allowedOrigins.`,stepFullOrigin:`Use full origins such as http://localhost:5173, not wildcard patterns.`,stepRestart:`Restart or reload the Gateway after changing allowed origins.`},protocol:{title:`Protocol mismatch`,summary:`The served Control UI and the running Gateway do not agree on the supported connection protocol.`,refresh:`Refresh page`,stepDashboard:`Reopen the served dashboard with openclaw dashboard so the UI and Gateway come from the same install.`,stepDevUi:`If using pnpm ui:dev, rebuild or restart the dev UI against the current checkout.`,stepRestart:`Restart the Gateway after updating OpenClaw so it serves the current protocol.`},network:{title:`Gateway unreachable`,summary:`The browser could not reach {host}. Check the address and transport before retrying credentials.`,stepGateway:`Confirm the Gateway is running with openclaw status or openclaw gateway run.`,stepUrl:`Check the Gateway URL and use wss:// when the Gateway is behind HTTPS/Tailscale Serve.`,stepDashboard:`Reopen the dashboard with openclaw dashboard --no-open to recopy the current URL and auth details.`}}}},B=Object.assign(()=>{Object.assign(o.login,z.login)},{catalog:z})})))()}function H(e){let t=e.trim(),n=t.toLowerCase().startsWith(`oc-pair://`)?t.slice(10):t;if(!/^[A-Za-z0-9_-]+$/u.test(n))return`unknown`;try{let e=Uint8Array.from(atob(n.replace(/-/g,`+`).replace(/_/g,`/`)),e=>e.charCodeAt(0)),t=JSON.parse(new TextDecoder().decode(e));return typeof t==`object`&&t&&`url`in t&&typeof t.url==`string`&&t.url.trim()!==``&&`bootstrapToken`in t&&typeof t.bootstrapToken==`string`&&t.bootstrapToken.trim()!==``?`setup-code`:`unknown`}catch{return`unknown`}}function U(){return(U=e((()=>{})))()}function oe(e){return e===A.AUTH_PASSWORD_MISSING||e===A.AUTH_PASSWORD_MISMATCH||e===A.AUTH_PASSWORD_NOT_CONFIGURED}function W(e,t){let n=t.docsHref??`https://docs.openclaw.ai/web/dashboard`,r=d(e);return{kind:t.kind,placement:t.placement??`status`,tone:t.tone??`danger`,field:t.field,title:f(t.titleKey,t.stepParams),summary:t.summaryKey?f(t.summaryKey,t.stepParams):r,primaryCommand:t.primaryCommand,refreshAction:t.refreshAction,steps:t.stepKeys.map(e=>typeof e==`string`?{text:f(e,t.stepParams),commands:[]}:{text:f(e.key,t.stepParams),commands:e.commands}),docsHref:n,rawError:r}}function G(e){if(e.connected||!e.lastError)return null;let t=e.lastError,n=e.lastErrorCode??null,i=N(t),o=a(e.gatewayUrl);if(n===`GATEWAY_BUSY`&&e.reconnectPending)return W(t,{kind:`busy`,tone:`pending`,titleKey:`login.failure.busy.title`,summaryKey:`login.failure.busy.summary`,stepKeys:[]});if(n===A.AUTH_BOOTSTRAP_TOKEN_INVALID)return W(t,{kind:`bootstrap-invalid`,tone:`warn`,titleKey:`login.failure.bootstrapInvalid.title`,summaryKey:`login.failure.bootstrapInvalid.summary`,primaryCommand:`openclaw dashboard`,stepKeys:[`login.failure.bootstrapInvalid.stepOpen`,{key:`login.failure.bootstrapInvalid.stepJson`,commands:[`openclaw dashboard --json`]}],docsHref:`https://docs.openclaw.ai/cli/dashboard`});if(n===A.AUTHENTICATED_PROFILE_UNAVAILABLE)return W(t,{kind:`profile-unavailable`,tone:`pending`,titleKey:`login.failure.profileUnavailable.title`,summaryKey:`login.failure.profileUnavailable.summary`,stepKeys:[`login.failure.profileUnavailable.stepRetry`,`login.failure.profileUnavailable.stepAdmin`],docsHref:`https://docs.openclaw.ai/concepts/user-model#gateway-profile-and-github-credit`});if(n===A.AUTH_VERIFIED_USER_REQUIRED)return W(t,{kind:`verified-user-required`,titleKey:`login.failure.verifiedUserRequired.title`,summaryKey:`login.failure.verifiedUserRequired.summary`,stepKeys:[`login.failure.verifiedUserRequired.stepIdentity`,`login.failure.verifiedUserRequired.stepSharedSecret`],docsHref:`https://docs.openclaw.ai/gateway/operator-scopes`});if(n===A.OPERATOR_ACCESS_DENIED)return W(t,{kind:`access-denied`,tone:`warn`,titleKey:`login.failure.accessDenied.title`,summaryKey:`login.failure.accessDenied.summary`,stepKeys:[`login.failure.accessDenied.stepAdmin`,{key:`login.failure.accessDenied.stepFindProfile`,commands:[`openclaw users list --json`]},`login.failure.accessDenied.stepReconnect`],docsHref:`https://docs.openclaw.ai/gateway/operator-scopes#named-operator-roles`});if(n===A.CONTROL_UI_BUILD_MISMATCH)return W(t,{kind:`build-mismatch`,tone:`pending`,titleKey:`chat.sidebar.serverUpdatedTitle`,summaryKey:`chat.sidebar.serverUpdatedRefresh`,refreshAction:{label:f(`login.failure.protocol.refresh`)},stepKeys:[],docsHref:`https://docs.openclaw.ai/web/control-ui`});let c=s(!1,t,n);if(c)return W(t,{kind:`pairing-required`,tone:`pending`,docsHref:`https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection`,titleKey:c.kind===`scope-upgrade-pending`?`login.failure.pairing.scopeTitle`:c.kind===`role-upgrade-pending`?`login.failure.pairing.roleTitle`:c.kind===`metadata-upgrade-pending`?`login.failure.pairing.metadataTitle`:`login.failure.pairing.title`,summaryKey:c.kind===`pairing-required`?`login.failure.pairing.summary`:`login.failure.pairing.upgradeSummary`,primaryCommand:c.requestId?`openclaw devices approve ${c.requestId}`:`openclaw devices approve --latest`,stepKeys:[...c.requestId?[]:[`login.failure.pairing.stepLatest`],{key:`login.failure.pairing.stepDashboard`,commands:[`openclaw dashboard`]},...e.reconnectPending?[]:[`login.failure.pairing.stepReconnect`]],stepParams:{host:o}});if(n===A.AUTH_RATE_LIMITED||i.includes(`too many failed authentication attempts`)||i.includes(`rate limit`))return W(t,{kind:`auth-rate-limited`,tone:`warn`,titleKey:`login.failure.rateLimited.title`,summaryKey:`login.failure.rateLimited.summary`,stepKeys:[`login.failure.rateLimited.stepStop`,`login.failure.rateLimited.stepWait`,`login.failure.rateLimited.stepCheckClients`]});if(m(!1,t,n))return W(t,{kind:`insecure-context`,docsHref:`https://docs.openclaw.ai/web/control-ui#insecure-http`,titleKey:`login.failure.insecure.title`,summaryKey:`login.failure.insecure.summary`,stepKeys:[`login.failure.insecure.stepHttps`,`login.failure.insecure.stepAvoidDisable`]});if(n===A.CONTROL_UI_ORIGIN_NOT_ALLOWED||i.includes(`origin not allowed`))return W(t,{kind:`origin-not-allowed`,docsHref:`https://docs.openclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.origin.title`,summaryKey:`login.failure.origin.summary`,stepKeys:[`login.failure.origin.stepAllowedOrigins`,`login.failure.origin.stepFullOrigin`,`login.failure.origin.stepRestart`]});if(i.includes(`protocol mismatch`))return W(t,{kind:`protocol-mismatch`,docsHref:`https://docs.openclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.protocol.title`,summaryKey:`login.failure.protocol.summary`,refreshAction:{label:f(`login.failure.protocol.refresh`)},stepKeys:[{key:`login.failure.protocol.stepDashboard`,commands:[`openclaw dashboard`]},{key:`login.failure.protocol.stepDevUi`,commands:[`pnpm ui:dev`]},`login.failure.protocol.stepRestart`]});let l=r(e),u=oe(n);return l===`trusted-proxy`?W(t,{kind:`trusted-proxy`,titleKey:`login.failure.trustedProxy.title`,summaryKey:`login.failure.trustedProxy.summary`,stepKeys:[`login.failure.trustedProxy.stepSignIn`,`login.failure.trustedProxy.stepHeaders`,`login.failure.trustedProxy.stepNoToken`],docsHref:`https://docs.openclaw.ai/gateway/trusted-proxy-auth`}):l===`required`?W(t,{kind:`auth-required`,placement:`form`,tone:`warn`,field:`credential`,titleKey:u?`login.failure.authRequired.passwordTitle`:`login.failure.authRequired.title`,summaryKey:`login.failure.authRequired.summary`,stepKeys:u?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authRequired.stepPaste`,commands:[`openclaw gateway auth-token --show`]},{key:`login.failure.authRequired.stepGenerate`,commands:[`openclaw doctor --generate-gateway-token`]},`login.failure.authRequired.stepConnect`],stepParams:{host:o}}):l===`failed`?W(t,{kind:`auth-failed`,placement:`form`,field:`credential`,titleKey:u?`login.failure.authRequired.passwordTitle`:n===A.AUTH_TOKEN_MISMATCH?`login.failure.authRequired.title`:`login.failure.authFailed.title`,summaryKey:(n===A.AUTH_TOKEN_MISMATCH||n===A.AUTH_PASSWORD_MISMATCH)&&H(e.secret??``)===`setup-code`?`login.setupCodeHint`:`login.failure.authFailed.summary`,stepKeys:u?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authFailed.stepDashboard`,commands:[`openclaw dashboard --no-open`,`openclaw gateway auth-token --show`]},`login.failure.authFailed.stepReplace`],stepParams:{host:o}}):W(t,{kind:`network`,placement:`form`,tone:`warn`,field:`url`,titleKey:`login.failure.network.title`,summaryKey:`login.failure.network.summary`,stepKeys:[{key:`login.failure.network.stepGateway`,commands:[`openclaw status`,`openclaw gateway run`]},`login.failure.network.stepUrl`,{key:`login.failure.network.stepDashboard`,commands:[`openclaw dashboard --no-open`]}],stepParams:{host:o}})}function K(){return(K=e((()=>{P(),n(),i(),c()})))()}var q=t({});function se({text:e,commands:t}){let n=new Set(t),r=[...n].map(t=>[t,e.indexOf(t)]).toSorted(([e,t],[n,r])=>t-r||n.length-e.length),i=[],a=0;for(let[t,o]of r)o<a||(i.push(e.slice(a,o),F(t)),n.delete(t),a=o+t.length);i.push(e.slice(a));for(let e of n)i.push(` `,F(e));return i}function J(e){return e.steps.length===0?w:C`
    <ol class="login-gate__failure-steps">
      ${e.steps.map(e=>C`<li>${se(e)}</li>`)}
    </ol>
  `}function Y(e){return C`
    <footer class="login-gate__foot">
      <details class="login-gate__failure-detail">
        <summary>${f(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${O}
        rel=${D()}
        >${f(`common.learnMore`)}</a
      >
    </footer>
  `}function ce(e,t){return e.refreshAction?C`
    <button
      type="button"
      class="btn primary login-gate__failure-refresh"
      ?disabled=${t.state===`pending`}
      @click=${t.onRefresh}
    >
      ${t.state===`pending`?f(`common.refreshing`):t.state===`failed`?f(`common.retry`):e.refreshAction.label}
    </button>
  `:w}function le(e,t,n){let[r,i,a]=t;return C`
    <openclaw-tooltip .content=${e?i:r}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${a}
        aria-pressed=${e}
        @click=${n}
      >
        ${e?S.eye:S.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function X(e){let{props:t,feedback:n}=e,r=H(t.secret)===`setup-code`,i=n?.placement===`form`?n.field:void 0,a=e=>{e.key===`Enter`&&t.onConnect()};return C`
    <div class="login-gate__form">
      <div class="field">
        <label for="login-gate-url">${f(`login.gatewayUrl`)}</label>
        <input
          id="login-gate-url"
          inputmode="url"
          autocapitalize="none"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="go"
          aria-invalid=${i===`url`?`true`:w}
          .value=${t.gatewayUrl}
          @input=${e=>{t.onGatewayUrlChange(e.target.value)}}
          @keydown=${a}
          placeholder="wss://gateway.example:443"
        />
      </div>
      <div class="field">
        <label for="login-gate-credential">${f(`login.secret`)}</label>
        <span class="settings-secret">
          <input
            id="login-gate-credential"
            type=${t.showGatewaySecret?`text`:`password`}
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="go"
            aria-invalid=${i===`credential`?`true`:w}
            aria-describedby=${r?`login-gate-secret-hint`:w}
            .value=${t.secret}
            @input=${e=>{t.onSecretChange(e.target.value)}}
            @keydown=${a}
            placeholder=${f(`login.secretPlaceholder`)}
          />
          ${le(t.showGatewaySecret,[f(`login.showSecret`),f(`login.hideSecret`),f(`login.toggleSecretVisibility`)],t.onToggleGatewaySecret)}
        </span>
        ${r?C`<p id="login-gate-secret-hint" class="muted" role="status">${f(`login.setupCodeHint`)}</p>`:w}
      </div>
      ${e.withSubmit?C`
              <button class="btn primary login-gate__connect" @click=${t.onConnect}>
                ${f(`common.connect`)}
              </button>
            `:w}
    </div>
  `}function ue(e){let t=a(e.gatewayUrl),n=e.secret.trim()?f(`login.connection.secretEntered`):f(`login.connection.noSecret`);return C`
    <summary>
      <span class="login-gate__connection-target">
        ${S.server}
        <span>${f(`login.connection.target`,{host:t})}</span>
      </span>
      <span class="login-gate__connection-cred">· ${n}</span>
      <span class="login-gate__connection-change">${f(`login.connection.change`)}</span>
    </summary>
  `}function de(e){let{props:t,feedback:n}=e,r=n.kind===`pairing-required`&&t.reconnectPending,i=Math.max(0,Math.ceil(((t.reconnectAt??0)-Date.now())/1e3));return C`
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
      ${n.primaryCommand?C`
              <div class="login-gate__hero">
                <span class="login-gate__hero-label">${f(`login.runOnHost`)}</span>
                ${F(n.primaryCommand,`hero`)}
              </div>
            `:w}
      ${J(n)}
      ${n.kind===`busy`?C`
              <p class="login-gate__retry" aria-live="off">
                ${i>0?f(`login.failure.busy.countdown`,{seconds:String(i)}):f(`login.failure.busy.retrying`)}
              </p>
            `:w}
      ${r?C`<p class="login-gate__failure-summary">
              <span class="session-run-spinner" aria-hidden="true"></span>
              ${f(`login.failure.pairing.waiting`)}
            </p>`:w}
      <div class="login-gate__actions">
        ${ce(n,e.refreshAction)}
        <button class="btn login-gate__connect" @click=${t.onConnect}>
          ${f(r?`login.failure.pairing.checkNow`:`common.connect`)}
        </button>
      </div>
      <details class="login-gate__connection">
        ${ue(t)} ${X({...e,withSubmit:!1})}
      </details>
      ${Y(n)}
    </section>
  `}function fe(e){let{feedback:t}=e;return C`
    <section
      class=${t?`login-gate__body login-gate__failure`:`login-gate__body`}
      role=${t?`status`:w}
      aria-live=${t?`polite`:w}
      data-kind=${t?.kind??w}
      data-tone=${t?.tone??w}
    >
      <div class="login-gate__status-text">
        <h1 class=${t?`login-gate__failure-title`:`login-gate__heading`}>
          ${t?.title??f(`login.heading`)}
        </h1>
        <p class=${t?`login-gate__failure-summary`:`login-gate__lede`}>
          ${t?.summary??f(`login.lede`)}
        </p>
      </div>
      ${X({...e,withSubmit:!0})}
      ${t?C`${J(t)} ${Y(t)}`:C`
              <details class="login-gate__help">
                <summary class="login-gate__help-title">${f(`connection.help.title`)}</summary>
                <ol class="login-gate__steps">
                  <li>
                    ${f(`connection.help.step1`)}${F(`openclaw gateway run`)}
                  </li>
                  <li>
                    ${f(`connection.help.step2`)} ${F(`openclaw dashboard`)}
                  </li>
                  <li>${f(`connection.help.step3`)}</li>
                </ol>
                <div class="login-gate__docs">
                  <a
                    class="session-link"
                    href="https://docs.openclaw.ai/web/dashboard"
                    target=${O}
                    rel=${D()}
                    >${f(`connection.help.docsLink`)}</a
                  >
                </div>
              </details>
            `}
    </section>
  `}function pe(e,t){let n=M(e.resourceBasePath),r=h(`favicon.svg`,n),i=G(e),a=i?.placement===`status`?de({props:e,feedback:i,refreshAction:t}):fe({props:e,feedback:i});return C`
    <div
      class="login-gate"
      @mousedown=${e=>{e.target===e.currentTarget&&b(e)}}
    >
      <openclaw-toast-host></openclaw-toast-host>
      <div class="login-gate__card" data-mode=${i?.placement??`form`}>
        <header class="login-gate__brand">
          ${e.mascot===`none`?C`<span class="login-gate__logo login-gate__logo--neutral" aria-hidden="true"
                  >${S.mark}</span
                >`:C`<img class="login-gate__logo" src=${r} alt="" />`}
          <span class="login-gate__brand-name">OpenClaw</span>
        </header>
        ${a}
        ${e.onOpenGatewaySettings?C`<footer class="login-gate__recovery">
                <button type="button" class="btn btn--ghost" @click=${e.onOpenGatewaySettings}>
                  ${f(`login.gatewaySettings`)}
                </button>
              </footer>`:w}
      </div>
    </div>
  `}var Z,Q;function $(){return($=e((()=>{T(),ie(),x(),g(),ne(),_(),y(),n(),p(),V(),k(),c(),ee(),R(),I(),re(),K(),B(),Z={pending:S.shieldEllipsis,warn:S.clock,danger:S.shieldAlert},Q=class extends u{constructor(...e){super(...e),this.refreshState=`idle`,this.retryCountdown=new L(this,1e3,()=>this.requestUpdate(),!1,`visible`)}ownsRefresh(e){let t=this.props;return this.refreshAttempt===e&&this.isConnected&&t!==void 0&&!t.connected&&!t.reconnectPending&&[`lastError`,`lastErrorCode`,`lastErrorAuthReason`,`gatewayUrl`,`resourceBasePath`,`secret`].every(n=>t[n]===e.props[n])}cancelRefresh(){this.refreshAttempt=void 0,this.refreshState=`idle`}willUpdate(){this.props?.reconnectPending&&this.props.lastErrorCode===`GATEWAY_BUSY`&&(this.props.reconnectAt??0)>Date.now()?this.retryCountdown.start():this.retryCountdown.stop(),this.refreshAttempt&&!this.ownsRefresh(this.refreshAttempt)&&this.cancelRefresh()}disconnectedCallback(){this.cancelRefresh(),super.disconnectedCallback()}async refreshPage(){let e=this.props;if(!e||this.refreshAttempt||this.refreshState===`pending`||!this.isConnected||e.connected||e.reconnectPending||!G(e)?.refreshAction||!te(!0))return;let t={props:e};this.refreshAttempt=t,this.refreshState=`pending`;try{let e=await v({canReload:()=>this.ownsRefresh(t)});this.ownsRefresh(t)&&!e&&(this.refreshState=`failed`)}catch{this.ownsRefresh(t)&&(this.refreshState=`failed`)}finally{this.refreshAttempt===t&&(this.ownsRefresh(t)?this.refreshAttempt=void 0:this.cancelRefresh())}}render(){let e=this.props;return e?pe({...e,onConnect:()=>{this.cancelRefresh(),e.onConnect()},onGatewayUrlChange:t=>{this.cancelRefresh(),e.onGatewayUrlChange(t)},onSecretChange:t=>{this.cancelRefresh(),e.onSecretChange(t)}},{state:this.refreshState,onRefresh:()=>void this.refreshPage()}):w}},j([ae({attribute:!1})],Q.prototype,`props`,void 0),j([E()],Q.prototype,`refreshState`,void 0),customElements.get(`openclaw-login-gate`)||customElements.define(`openclaw-login-gate`,Q)})))()}export{V as a,U as i,q as n,B as o,H as r,$ as t};
//# sourceMappingURL=login-runtime-BviVFlcX.js.map