import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{t as pruneMapToMaxSize}from"./map-size-DLQqorvK.mjs";import{n as normalizeAccountId,t as DEFAULT_ACCOUNT_ID}from"./account-id-3yqrEsRn.mjs";import{n as runCommandWithTimeout}from"./exec-runner-DpcWIHOp.mjs";import{t as safeEqualSecret}from"./secret-equal-BtEZdDeQ.mjs";import{t as escapeHtml}from"./html-escape-wAM7yA-h.mjs";import{t as resolveGatewayPublicOrigin}from"./gateway-public-origin-BbL1ndHu.mjs";import{t as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES}from"./device-bootstrap-profile-BUP1gDw9.mjs";import{i as resolveTailnetHostWithRunner}from"./tailscale-status-XuUK2SG6.mjs";import"./string-coerce-runtime-BYDH9Quw.mjs";import"./security-runtime-CCLeFIRb.mjs";import{t as expandAllowFromWithAccessGroups}from"./access-groups-xlLrXqiU.mjs";import"./text-utility-runtime-Cwo66kPm.mjs";import"./process-runtime-DW4VP5wa.mjs";import{a as WEBHOOK_RATE_LIMIT_DEFAULTS,n as resolveRequestClientIp,s as createFixedWindowRateLimiter}from"./webhook-ingress-CHBATXCD.mjs";import{s as readJsonWebhookBodyOrReject}from"./webhook-request-guards-CzZ4lygE.mjs";import{a as mergeTelegramAccountConfig}from"./account-selection-Bgq5BzuK.mjs";import"./core-CgiZ5jFz.mjs";import{s as issueDeviceBootstrapToken}from"./device-bootstrap-Byj5feiQ.mjs";import"./device-bootstrap-D68Xg7fD.mjs";import{i as resolveTelegramAccount}from"./accounts-BRay_rFt.mjs";import{r as normalizeTelegramAllowFromEntry,t as isNumericTelegramSenderUserId}from"./allow-from-Cl7XrCrw.mjs";import{t as normalizeControlUiBasePath}from"./control-ui-base-path-Ut47ifN5.mjs";import crypto from"node:crypto";
//!extensions/telegram/src/miniapp/owner.ts
async function isTelegramMiniAppOwner(e){const t=e.userId.trim();if(!isNumericTelegramSenderUserId(t))return false;const n=[...mergeTelegramAccountConfig(e.cfg,e.accountId).allowFrom??[],...e.cfg.commands?.ownerAllowFrom??[]];return(await expandAllowFromWithAccessGroups({cfg:e.cfg,channel:`telegram`,accountId:e.accountId,allowFrom:n,senderId:t,isSenderAllowed:(e,t)=>t.some(t=>normalizeTelegramAllowFromEntry(t)===e)})).some(e=>normalizeTelegramAllowFromEntry(e)===t)}
//!extensions/telegram/src/miniapp/url.ts
const TELEGRAM_MINIAPP_PATH_PREFIX=`/__openclaw_tg_miniapp/`;const TELEGRAM_MINIAPP_URL_ERROR="Mini App needs an HTTPS gateway URL. Configure an allowed HTTPS `gateway.publicOrigin` or Tailscale Serve/Funnel, then retry /controlui.";async function resolveTelegramMiniAppUrls(e){const t=resolveGatewayPublicOrigin(e.cfg);const n=e.cfg.gateway?.controlUi?.allowedOrigins;let r=t?.startsWith(`https://`)&&(n===void 0||n.some(e=>[`*`,t.toLowerCase()].includes(e.trim().toLowerCase())))?t:void 0;if(!r){const t=e.cfg.gateway?.tailscale?.mode;const n=(t===`serve`||t===`funnel`)&&await resolveTailnetHostWithRunner(e.runCommand??runCommandWithTimeout);if(!n)throw new Error(TELEGRAM_MINIAPP_URL_ERROR);r=`https://${n}`}const i=normalizeControlUiBasePath(e.cfg.gateway?.controlUi?.basePath?.trim()??``,`all`);return{pageUrl:`${r}${TELEGRAM_MINIAPP_PATH_PREFIX}`,controlUiUrl:`${r}${i}`,gatewayUrl:`${r.replace(/^https:/,`wss:`)}${i}`}}
//!extensions/telegram/src/miniapp/command.ts
function registerTelegramMiniAppCommand(e,t){e.registerCommand({name:`controlui`,description:`Open OpenClaw`,channels:[`telegram`],requireAuth:true,exposeSenderIsOwner:true,handler:async n=>{if(!isTelegramDirectCommand(n))return{text:`open this in a DM with the bot`};const r=e.runtime.config.current();const i=normalizeAccountId(n.accountId??`default`);const a=n.senderId?.trim()??``;const o=/^\d+$/.test(a)?a:/^telegram:(\d+)$/.exec(n.from?.trim()??``)?.[1]??``;if(!await isTelegramMiniAppOwner({cfg:r,accountId:i,userId:o}))return{text:`Restricted to the bot owner. Ask your OpenClaw administrator to add your numeric Telegram user ID${o?` (${o})`:``} to this bot account's allowFrom or commands.ownerAllowFrom, then retry /controlui. Wildcards and usernames do not grant access to OpenClaw.`};let s;try{s=new URL((await resolveTelegramMiniAppUrls({cfg:r})).pageUrl)}catch{return{text:TELEGRAM_MINIAPP_URL_ERROR}}s.searchParams.set(`accountId`,i);s.hash=new URLSearchParams({launchTicket:t.issue({accountId:i,userId:o})}).toString();return{text:`Open OpenClaw.`,presentation:{blocks:[{type:`buttons`,buttons:[{label:`Open OpenClaw`,webApp:{url:s.toString()}}]}]}}}})}function isTelegramDirectCommand(e){const t=e.from?.trim()??``;const n=e.sessionKey?.trim()??``;if(t.startsWith(`telegram:group:`)||n.includes(`:telegram:group:`))return false;return/^telegram:\d+$/.test(t)||n.includes(`:telegram:direct:`)}
//!extensions/telegram/src/miniapp/launch-ticket.ts
const LAUNCH_TICKET_TTL_MS=3e5;const LAUNCH_TICKET_LIMIT=1e3;function createTelegramMiniAppLaunchTickets(){const e=/* @__PURE__ */ new Map;return{issue({accountId:t,userId:n}){pruneExpiredMiniAppEntries(e,e=>e.expiresAtMs);const r=crypto.randomBytes(32).toString(`base64url`);e.set(r,{accountId:t,userId:n,expiresAtMs:Date.now()+LAUNCH_TICKET_TTL_MS});pruneMapToMaxSize(e,LAUNCH_TICKET_LIMIT);return r},consume({ticket:t,accountId:n,userId:r}){pruneExpiredMiniAppEntries(e,e=>e.expiresAtMs);const i=e.get(t);if(!i||i.accountId!==n||i.userId!==r)return false;e.delete(t);return true}}}function pruneExpiredMiniAppEntries(e,t){const n=Date.now();for(const[r,i]of e)if(t(i)<=n)e.delete(r)}
//!extensions/telegram/src/miniapp/init-data.ts
const INIT_DATA_MAX_AGE_MS=3e5;function validateTelegramMiniAppInitData(e){const t=e.initData.trim();const n=e.botToken.trim();if(!t||!n)return null;const r=new URLSearchParams(t);const i=r.get(`hash`)?.trim()??``;const a=r.get(`auth_date`)?.trim()??``;const o=r.get(`user`)?.trim()??``;if(!i||!a||!o)return null;const s=Number(a);if(!Number.isInteger(s)||s<=0)return null;const c=s*1e3;const l=Date.now()-c;if(l<0||l>INIT_DATA_MAX_AGE_MS)return null;const u=[...r.entries()].filter(([e])=>e!==`hash`).map(([e,t])=>`${e}=${t}`).toSorted();const d=crypto.createHmac(`sha256`,`WebAppData`).update(n).digest();const f=crypto.createHmac(`sha256`,d).update(u.join(`
`)).digest(`hex`);if(!safeEqualSecret(f,i))return null;try{const e=JSON.parse(o);const t=typeof e.id===`number`&&Number.isSafeInteger(e.id)&&e.id>0?String(e.id):typeof e.id===`string`&&/^\d+$/.test(e.id)?e.id:null;return t===null?null:{hash:i,authDateMs:c,userId:t}}catch{return null}}
//!extensions/telegram/src/miniapp/page.ts
const TELEGRAM_MINIAPP_EXPIRED_MESSAGE=`This link expired. Run /controlui again in your bot chat.`;const TELEGRAM_MINIAPP_AUTH_TIMEOUT_MS=15e3;function renderTelegramMiniAppPage(e){return`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>OpenClaw</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: Canvas; color: CanvasText; }
    main { width: min(28rem, calc(100vw - 2rem)); }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    p { margin: 0; line-height: 1.5; }
  </style>
  <script src="https://telegram.org/js/telegram-web-app.js"><\/script>
</head>
<body>
  <main>
    <h1>OpenClaw</h1>
    <p id="status">Opening OpenClaw...</p>
  </main>
  <script nonce="${escapeHtml(e.scriptNonce)}">
    const accountId = ${JSON.stringify(e.accountId)};
    const launchTicket = new URLSearchParams(location.hash.slice(1)).get("launchTicket") || "";
    const status = document.getElementById("status");
    const showExpired = () => {
      status.textContent = ${JSON.stringify(TELEGRAM_MINIAPP_EXPIRED_MESSAGE)};
    };
    const webApp = window.Telegram && window.Telegram.WebApp;
    const initData = webApp && typeof webApp.initData === "string" ? webApp.initData : "";
    if (!initData || !launchTicket) {
      showExpired();
    } else {
      webApp.ready();
      // AbortController works in WebViews that predate AbortSignal.timeout.
      // Clear the timer after either outcome so a successful handoff is not aborted later.
      const authController = new AbortController();
      const authTimeout = setTimeout(function () {
        authController.abort();
      }, ${TELEGRAM_MINIAPP_AUTH_TIMEOUT_MS});
      fetch("auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData, accountId, launchTicket }),
        credentials: "same-origin",
        signal: authController.signal
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("auth failed");
        }
        return await response.json();
      }).then((payload) => {
        const next = new URL(payload.controlUiUrl);
        next.hash = "gatewayUrl=" + encodeURIComponent(payload.gatewayUrl) +
          "&bootstrapToken=" + encodeURIComponent(payload.bootstrapToken);
        location.replace(next.toString());
      }).catch(showExpired).then(function () {
        clearTimeout(authTimeout);
      });
    }
  <\/script>
</body>
</html>`}
//!extensions/telegram/src/miniapp/routes.ts
const AUTH_PATH=`${TELEGRAM_MINIAPP_PATH_PREFIX}auth`;const MAX_BODY_BYTES=4096;const REPLAY_CACHE_LIMIT=1e3;const RATE_LIMIT_WINDOW_MS=6e4;const RATE_LIMIT_MAX=10;const replayCache=/* @__PURE__ */ new Map;const rateLimit=createFixedWindowRateLimiter({windowMs:RATE_LIMIT_WINDOW_MS,maxRequests:RATE_LIMIT_MAX,maxTrackedKeys:WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys});function registerTelegramMiniAppRoutes(e,t){e.registerHttpRoute({path:TELEGRAM_MINIAPP_PATH_PREFIX,match:`prefix`,auth:`plugin`,handler:async(n,r)=>{const i=new URL(n.url??``,`http://openclaw.local`);if(i.pathname===`/__openclaw_tg_miniapp/`)await handlePage(n,r,i);else if(i.pathname===AUTH_PATH)await handleAuth(e,t,n,r);else sendResponse(r,404,`Not found`);return true}})}async function handlePage(e,t,n){if(e.method!==`GET`)return sendResponse(t,405,`Method not allowed`);const r=normalizeAccountId(n.searchParams.get(`accountId`)??`default`);const i=crypto.randomBytes(16).toString(`base64url`);sendResponse(t,200,renderTelegramMiniAppPage({accountId:r,scriptNonce:i}),`text/html`,{"Content-Security-Policy":`default-src 'none'; script-src 'nonce-${i}' https://telegram.org; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'`})}async function handleAuth(e,t,n,r){if(n.method!==`POST`)return sendResponse(r,405,`Method not allowed`);if((n.headers[`content-type`]??``).toLowerCase().split(`;`)[0]?.trim()!==`application/json`)return sendResponse(r,415,`Unsupported media type`);const currentConfig=()=>e.runtime.config.current();const i=currentConfig();const a=resolveRequestClientIp(n,i.gateway?.trustedProxies,i.gateway?.allowRealIpFallback===true)??`unknown`;if(rateLimit.isRateLimited(a))return sendResponse(r,429,`Too many requests`);const o=await readJsonWebhookBodyOrReject({req:n,res:r,maxBytes:MAX_BODY_BYTES,profile:`pre-auth`,emptyObjectOnEmpty:false,invalidJsonMessage:TELEGRAM_MINIAPP_EXPIRED_MESSAGE,invalidJsonStatusCode:401});if(!o.ok)return;const s=o.value;if(!isRecord(s)||typeof s.initData!==`string`||typeof s.launchTicket!==`string`)return sendResponse(r,401,TELEGRAM_MINIAPP_EXPIRED_MESSAGE);const c=normalizeAccountId(typeof s.accountId===`string`?s.accountId:DEFAULT_ACCOUNT_ID);const l=currentConfig();const u=resolveTelegramAccount({cfg:l,accountId:c});const d=validateTelegramMiniAppInitData({initData:s.initData,botToken:u.token});if(!d)return sendResponse(r,401,TELEGRAM_MINIAPP_EXPIRED_MESSAGE);if(!await isTelegramMiniAppOwner({cfg:l,accountId:c,userId:d.userId}))return sendResponse(r,403,`Restricted to the bot owner.`);let f;try{f=await resolveTelegramMiniAppUrls({cfg:l})}catch{return sendResponse(r,503,TELEGRAM_MINIAPP_URL_ERROR)}if(!await isTelegramMiniAppOwner({cfg:l,accountId:c,userId:d.userId}))return sendResponse(r,403,`Restricted to the bot owner.`);const p=/* @__PURE__ */ new Error(`Telegram Mini App owner configuration changed`);const assertCurrent=()=>{if(currentConfig()!==l)throw p};try{assertCurrent();if(!t.consume({ticket:s.launchTicket,accountId:c,userId:d.userId}))return sendResponse(r,401,TELEGRAM_MINIAPP_EXPIRED_MESSAGE);if(!rememberReplay(d.hash,d.authDateMs+3e5))return sendResponse(r,401,TELEGRAM_MINIAPP_EXPIRED_MESSAGE);const e=await issueDeviceBootstrapToken({assertCurrent,profile:{roles:[`operator`],scopes:BOOTSTRAP_HANDOFF_OPERATOR_SCOPES,purpose:`control-ui`}});assertCurrent();sendResponse(r,200,JSON.stringify({bootstrapToken:e.token,controlUiUrl:f.controlUiUrl,gatewayUrl:f.gatewayUrl}),`application/json`)}catch(e){if(e!==p)throw e;sendResponse(r,403,`Restricted to the bot owner.`)}}function rememberReplay(e,t){pruneExpiredMiniAppEntries(replayCache,e=>e);if(replayCache.has(e))return false;replayCache.set(e,t);pruneMapToMaxSize(replayCache,REPLAY_CACHE_LIMIT);return true}function sendResponse(e,t,n,r=`text/plain`,i){e.writeHead(t,{"Cache-Control":`no-store`,"Referrer-Policy":`no-referrer`,"X-Robots-Tag":`noindex`,"Content-Type":`${r}; charset=utf-8`,...i});e.end(n)}
//!extensions/telegram/miniapp-api.ts
function registerTelegramMiniApp(e){const t=createTelegramMiniAppLaunchTickets();registerTelegramMiniAppRoutes(e,t);registerTelegramMiniAppCommand(e,t)}export{registerTelegramMiniApp as t};