import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as resolveTailscalePublishedHost, i as resolveTailnetHostWithRunner } from "./tailscale-status-D3CkNS90.mjs";
import { t as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./security-runtime-6domDoE8.mjs";
import { t as expandAllowFromWithAccessGroups } from "./access-groups-b3YFEUNd.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-CQ3hKgoh.mjs";
import "./core-BxoR6yel.mjs";
import { s as issueDeviceBootstrapToken } from "./device-bootstrap-FJ4oQdcl.mjs";
import "./device-bootstrap-BlN58LGR.mjs";
import { a as WEBHOOK_RATE_LIMIT_DEFAULTS, n as resolveRequestClientIp, s as createFixedWindowRateLimiter } from "./webhook-ingress-DFEVgBho.mjs";
import { s as readJsonWebhookBodyOrReject } from "./webhook-request-guards-BYZUECo_.mjs";
import { i as resolveTelegramAccount } from "./accounts-CHcpIFN8.mjs";
import { r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-base-path-C7vqrdPT.mjs";
import crypto from "node:crypto";
//#region extensions/telegram/src/miniapp/owner.ts
async function isTelegramMiniAppOwner(params) {
	const userId = params.userId.trim();
	if (!isNumericTelegramSenderUserId(userId)) return false;
	const allowFrom = [...mergeTelegramAccountConfig(params.cfg, params.accountId).allowFrom ?? [], ...params.cfg.commands?.ownerAllowFrom ?? []];
	return (await expandAllowFromWithAccessGroups({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId,
		allowFrom,
		senderId: userId,
		isSenderAllowed: (senderId, entries) => entries.some((entry) => normalizeTelegramAllowFromEntry(entry) === senderId)
	})).some((entry) => normalizeTelegramAllowFromEntry(entry) === userId);
}
//#endregion
//#region extensions/telegram/src/miniapp/url.ts
const TELEGRAM_MINIAPP_PATH_PREFIX = "/__openclaw_tg_miniapp/";
const TELEGRAM_MINIAPP_URL_ERROR = "Mini App needs an HTTPS gateway URL. Set `gateway.tailscale.mode: serve` or `funnel`, then retry /controlui.";
async function resolveTelegramMiniAppUrls(params) {
	const mode = params.cfg.gateway?.tailscale?.mode ?? "off";
	if (mode !== "serve" && mode !== "funnel") throw new Error(TELEGRAM_MINIAPP_URL_ERROR);
	const tailnetHost = await resolveTailnetHostWithRunner(params.runCommand ?? runCommandWithTimeout);
	const publishedHost = resolveTailscalePublishedHost({
		tailscaleMode: mode,
		tailnetHost
	});
	if (!publishedHost) throw new Error(TELEGRAM_MINIAPP_URL_ERROR);
	const basePath = params.cfg.gateway?.controlUi?.basePath;
	const controlUiPath = normalizeControlUiBasePath(typeof basePath === "string" ? basePath.trim() : "", "all");
	const controlUiUrl = `https://${publishedHost}${controlUiPath}`;
	return {
		pageUrl: `https://${publishedHost}${TELEGRAM_MINIAPP_PATH_PREFIX}`,
		controlUiUrl,
		gatewayUrl: `wss://${publishedHost}${controlUiPath}`
	};
}
//#endregion
//#region extensions/telegram/src/miniapp/command.ts
function registerTelegramMiniAppCommand(api, launchTickets) {
	api.registerCommand({
		name: "controlui",
		description: "Open the OpenClaw Control UI",
		channels: ["telegram"],
		requireAuth: true,
		exposeSenderIsOwner: true,
		handler: async (ctx) => {
			if (!isTelegramDirectCommand(ctx)) return { text: "open this in a DM with the bot" };
			const cfg = api.runtime.config?.current?.() ?? api.config;
			const accountId = normalizeAccountId(ctx.accountId ?? "default");
			const senderId = ctx.senderId?.trim() ?? "";
			const userId = /^\d+$/.test(senderId) ? senderId : /^telegram:(\d+)$/.exec(ctx.from?.trim() ?? "")?.[1] ?? "";
			if (!await isTelegramMiniAppOwner({
				cfg,
				accountId,
				userId
			})) return { text: `Restricted to the bot owner. Ask your OpenClaw administrator to add your numeric Telegram user ID${userId ? ` (${userId})` : ""} to this bot account's allowFrom or commands.ownerAllowFrom, then retry /controlui. Wildcards and usernames do not grant Control UI access.` };
			let pageUrl;
			try {
				pageUrl = new URL((await resolveTelegramMiniAppUrls({ cfg })).pageUrl);
			} catch {
				return { text: TELEGRAM_MINIAPP_URL_ERROR };
			}
			pageUrl.searchParams.set("accountId", accountId);
			pageUrl.hash = new URLSearchParams({ launchTicket: launchTickets.issue({
				accountId,
				userId
			}) }).toString();
			return {
				text: "Open OpenClaw Control UI.",
				presentation: { blocks: [{
					type: "buttons",
					buttons: [{
						label: "Open Control UI",
						webApp: { url: pageUrl.toString() }
					}]
				}] }
			};
		}
	});
}
function isTelegramDirectCommand(ctx) {
	const from = ctx.from?.trim() ?? "";
	const sessionKey = ctx.sessionKey?.trim() ?? "";
	if (from.startsWith("telegram:group:") || sessionKey.includes(":telegram:group:")) return false;
	return /^telegram:\d+$/.test(from) || sessionKey.includes(":telegram:direct:");
}
//#endregion
//#region extensions/telegram/src/miniapp/launch-ticket.ts
const LAUNCH_TICKET_TTL_MS = 3e5;
const LAUNCH_TICKET_LIMIT = 1e3;
function createTelegramMiniAppLaunchTickets() {
	const tickets = /* @__PURE__ */ new Map();
	return {
		issue({ accountId, userId }) {
			pruneExpiredMiniAppEntries(tickets, (launch) => launch.expiresAtMs);
			const ticket = crypto.randomBytes(32).toString("base64url");
			tickets.set(ticket, {
				accountId,
				userId,
				expiresAtMs: Date.now() + LAUNCH_TICKET_TTL_MS
			});
			pruneMapToMaxSize(tickets, LAUNCH_TICKET_LIMIT);
			return ticket;
		},
		consume({ ticket, accountId, userId }) {
			pruneExpiredMiniAppEntries(tickets, (launch) => launch.expiresAtMs);
			const launch = tickets.get(ticket);
			if (!launch || launch.accountId !== accountId || launch.userId !== userId) return false;
			tickets.delete(ticket);
			return true;
		}
	};
}
function pruneExpiredMiniAppEntries(entries, expiresAt) {
	const now = Date.now();
	for (const [key, value] of entries) if (expiresAt(value) <= now) entries.delete(key);
}
//#endregion
//#region extensions/telegram/src/miniapp/init-data.ts
const INIT_DATA_MAX_AGE_MS = 3e5;
function validateTelegramMiniAppInitData(params) {
	const initData = params.initData.trim();
	const botToken = params.botToken.trim();
	if (!initData || !botToken) return null;
	const parsed = new URLSearchParams(initData);
	const receivedHash = parsed.get("hash")?.trim() ?? "";
	const authDateRaw = parsed.get("auth_date")?.trim() ?? "";
	const userRaw = parsed.get("user")?.trim() ?? "";
	if (!receivedHash || !authDateRaw || !userRaw) return null;
	const authDateSeconds = Number(authDateRaw);
	if (!Number.isInteger(authDateSeconds) || authDateSeconds <= 0) return null;
	const authDateMs = authDateSeconds * 1e3;
	const ageMs = (params.nowMs ?? Date.now()) - authDateMs;
	if (ageMs < 0 || ageMs > INIT_DATA_MAX_AGE_MS) return null;
	const entries = [...parsed.entries()].filter(([key]) => key !== "hash").map(([key, value]) => `${key}=${value}`).toSorted();
	const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
	const computedHash = crypto.createHmac("sha256", secret).update(entries.join("\n")).digest("hex");
	if (!safeEqualSecret(computedHash, receivedHash)) return null;
	try {
		const user = JSON.parse(userRaw);
		const userId = typeof user.id === "number" && Number.isSafeInteger(user.id) && user.id > 0 ? String(user.id) : typeof user.id === "string" && /^\d+$/.test(user.id) ? user.id : null;
		return userId === null ? null : {
			hash: receivedHash,
			authDateMs,
			userId
		};
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/telegram/src/miniapp/page.ts
const TELEGRAM_MINIAPP_EXPIRED_MESSAGE = "This link expired. Run /controlui again in your bot chat.";
const TELEGRAM_MINIAPP_AUTH_TIMEOUT_MS = 15e3;
function renderTelegramMiniAppPage(params) {
	return `<!doctype html>
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
    <p id="status">Opening Control UI...</p>
  </main>
  <script nonce="${escapeHtml(params.scriptNonce)}">
    const accountId = ${JSON.stringify(params.accountId)};
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
</html>`;
}
//#endregion
//#region extensions/telegram/src/miniapp/routes.ts
const AUTH_PATH = `${TELEGRAM_MINIAPP_PATH_PREFIX}auth`;
const MAX_BODY_BYTES = 4096;
const REPLAY_CACHE_LIMIT = 1e3;
const RATE_LIMIT_WINDOW_MS = 6e4;
const RATE_LIMIT_MAX = 10;
const replayCache = /* @__PURE__ */ new Map();
const rateLimit = createFixedWindowRateLimiter({
	windowMs: RATE_LIMIT_WINDOW_MS,
	maxRequests: RATE_LIMIT_MAX,
	maxTrackedKeys: WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys
});
function registerTelegramMiniAppRoutes(api, launchTickets) {
	api.registerHttpRoute({
		path: TELEGRAM_MINIAPP_PATH_PREFIX,
		match: "prefix",
		auth: "plugin",
		handler: async (req, res) => {
			const url = new URL(req.url ?? "", "http://openclaw.local");
			if (url.pathname === "/__openclaw_tg_miniapp/") await handlePage(req, res, url);
			else if (url.pathname === AUTH_PATH) await handleAuth(api, launchTickets, req, res);
			else sendResponse(res, 404, "Not found");
			return true;
		}
	});
}
async function handlePage(req, res, url) {
	if (req.method !== "GET") return sendResponse(res, 405, "Method not allowed");
	const accountId = normalizeAccountId(url.searchParams.get("accountId") ?? "default");
	const nonce = crypto.randomBytes(16).toString("base64url");
	sendResponse(res, 200, renderTelegramMiniAppPage({
		accountId,
		scriptNonce: nonce
	}), "text/html", { "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}' https://telegram.org; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'` });
}
async function handleAuth(api, launchTickets, req, res) {
	if (req.method !== "POST") return sendResponse(res, 405, "Method not allowed");
	if ((req.headers["content-type"] ?? "").toLowerCase().split(";")[0]?.trim() !== "application/json") return sendResponse(res, 415, "Unsupported media type");
	const currentConfig = () => api.runtime.config?.current?.() ?? api.config;
	const requestConfig = currentConfig();
	const ip = resolveRequestClientIp(req, requestConfig.gateway?.trustedProxies, requestConfig.gateway?.allowRealIpFallback === true) ?? "unknown";
	if (rateLimit.isRateLimited(ip)) return sendResponse(res, 429, "Too many requests");
	const body = await readJsonWebhookBodyOrReject({
		req,
		res,
		maxBytes: MAX_BODY_BYTES,
		profile: "pre-auth",
		emptyObjectOnEmpty: false,
		invalidJsonMessage: TELEGRAM_MINIAPP_EXPIRED_MESSAGE,
		invalidJsonStatusCode: 401
	});
	if (!body.ok) return;
	const authBody = body.value;
	if (!isRecord(authBody) || typeof authBody.initData !== "string" || typeof authBody.launchTicket !== "string") return sendResponse(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
	const accountId = normalizeAccountId(typeof authBody.accountId === "string" ? authBody.accountId : DEFAULT_ACCOUNT_ID);
	const cfg = currentConfig();
	const account = resolveTelegramAccount({
		cfg,
		accountId
	});
	const validated = validateTelegramMiniAppInitData({
		initData: authBody.initData,
		botToken: account.token
	});
	if (!validated) return sendResponse(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
	if (!await isTelegramMiniAppOwner({
		cfg,
		accountId,
		userId: validated.userId
	})) return sendResponse(res, 403, "Restricted to the bot owner.");
	let urls;
	try {
		urls = await resolveTelegramMiniAppUrls({ cfg });
	} catch {
		return sendResponse(res, 503, TELEGRAM_MINIAPP_URL_ERROR);
	}
	if (!await isTelegramMiniAppOwner({
		cfg,
		accountId,
		userId: validated.userId
	})) return sendResponse(res, 403, "Restricted to the bot owner.");
	const authorityChanged = /* @__PURE__ */ new Error("Telegram Mini App owner configuration changed");
	const assertCurrent = () => {
		if (currentConfig() !== cfg) throw authorityChanged;
	};
	try {
		assertCurrent();
		if (!launchTickets.consume({
			ticket: authBody.launchTicket,
			accountId,
			userId: validated.userId
		})) return sendResponse(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		if (!rememberReplay(validated.hash, validated.authDateMs + 3e5)) return sendResponse(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		const issued = await issueDeviceBootstrapToken({
			assertCurrent,
			profile: {
				roles: ["operator"],
				scopes: BOOTSTRAP_HANDOFF_OPERATOR_SCOPES,
				purpose: "control-ui"
			}
		});
		assertCurrent();
		sendResponse(res, 200, JSON.stringify({
			bootstrapToken: issued.token,
			controlUiUrl: urls.controlUiUrl,
			gatewayUrl: urls.gatewayUrl
		}), "application/json");
	} catch (error) {
		if (error !== authorityChanged) throw error;
		sendResponse(res, 403, "Restricted to the bot owner.");
	}
}
function rememberReplay(hash, expiresAtMs) {
	pruneExpiredMiniAppEntries(replayCache, (expires) => expires);
	if (replayCache.has(hash)) return false;
	replayCache.set(hash, expiresAtMs);
	pruneMapToMaxSize(replayCache, REPLAY_CACHE_LIMIT);
	return true;
}
function sendResponse(res, status, body, contentType = "text/plain", headers) {
	res.writeHead(status, {
		"Cache-Control": "no-store",
		"Referrer-Policy": "no-referrer",
		"X-Robots-Tag": "noindex",
		"Content-Type": `${contentType}; charset=utf-8`,
		...headers
	});
	res.end(body);
}
//#endregion
//#region extensions/telegram/miniapp-api.ts
function registerTelegramMiniApp(api) {
	const launchTickets = createTelegramMiniAppLaunchTickets();
	registerTelegramMiniAppRoutes(api, launchTickets);
	registerTelegramMiniAppCommand(api, launchTickets);
}
//#endregion
export { registerTelegramMiniApp as t };
