import { S as parseDiscordActivityCustomId, i as buildDiscordPresentationComponents } from "./components-yBEb75bB.mjs";
import { E as getDiscordEndpointRuntime } from "./channel-type-DKnjV1XW.mjs";
import { c as resolveDiscordAccount } from "./accounts-CwJQoLjM.mjs";
import { r as sendDiscordComponentMessage } from "./send.components-ChY21qr-.mjs";
import { b as resolveDiscordChannelId$1 } from "./retry-BEYkDy0P.mjs";
import { r as setDiscordActivitiesRuntime, t as DiscordActivitiesRuntime } from "./runtime-DisDbixd.mjs";
import fs from "node:fs/promises";
import { logError } from "openclaw/plugin-sdk/logging-core";
import { resolveRequestClientIp } from "openclaw/plugin-sdk/webhook-ingress";
import { WEBHOOK_BODY_READ_DEFAULTS, readJsonBodyWithLimit, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { WIDGET_CDN_ORIGINS } from "openclaw/plugin-sdk/widget-html";
import { randomBytes } from "node:crypto";
import { fetchWithSsrFGuard as fetchWithSsrFGuard$1 } from "openclaw/plugin-sdk/ssrf-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
//#region extensions/discord/src/activities/discord-api.ts
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/v10/users/@me";
const DISCORD_HOST = "discord.com";
const DISCORD_ACTIVITY_REQUEST_TIMEOUT_MS = 15e3;
const JSON_MAX_BYTES = 65536;
const INSTANCE_ID_MAX_LENGTH = 256;
function normalizeInstanceId(value) {
	const instanceId = value?.trim();
	let hasControlCharacter = false;
	for (let index = 0; index < (instanceId?.length ?? 0); index += 1) {
		const codePoint = instanceId?.charCodeAt(index) ?? 0;
		if (codePoint < 32 || codePoint === 127) {
			hasControlCharacter = true;
			break;
		}
	}
	if (!instanceId || instanceId.length > INSTANCE_ID_MAX_LENGTH || hasControlCharacter) return;
	return instanceId;
}
async function fetchDiscordJson(params) {
	const endpoint = Object.hasOwn(params, "endpointRuntime") ? params.endpointRuntime : getDiscordEndpointRuntime();
	const liveUrl = new URL(params.url);
	const endpointPath = liveUrl.pathname === "/api/oauth2/token" ? "/oauth2/token" : liveUrl.pathname.startsWith("/api/v10/") ? liveUrl.pathname.slice(8) : void 0;
	if (endpoint && !endpointPath) throw new Error("Discord Activity request is outside the configured endpoint routes");
	const { response, release } = endpoint ? {
		response: await endpoint.fetch(`${endpoint.descriptor.restApiBaseUrl}${endpointPath}${liveUrl.search}`, {
			...params.init,
			signal: params.init.signal ? AbortSignal.any([params.init.signal, AbortSignal.timeout(DISCORD_ACTIVITY_REQUEST_TIMEOUT_MS)]) : AbortSignal.timeout(DISCORD_ACTIVITY_REQUEST_TIMEOUT_MS)
		}),
		release: async () => {}
	} : await params.fetchGuard({
		url: params.url,
		fetchImpl: params.fetchImpl,
		init: params.init,
		policy: { allowedHostnames: [DISCORD_HOST] },
		auditContext: params.auditContext,
		timeoutMs: DISCORD_ACTIVITY_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			return {
				ok: false,
				status: response.status
			};
		}
		return {
			ok: true,
			status: response.status,
			body: await readProviderJsonResponse(response, "Discord Activity OAuth", { maxBytes: JSON_MAX_BYTES })
		};
	} finally {
		await release();
	}
}
async function resolveActivityInstanceChannel(params) {
	const endpointRuntime = getDiscordEndpointRuntime() ?? null;
	let result;
	try {
		result = await fetchDiscordJson({
			fetchGuard: params.fetchGuard,
			fetchImpl: params.proxyFetch,
			url: `https://discord.com/api/v10/applications/${encodeURIComponent(params.applicationId)}/activity-instances/${encodeURIComponent(params.instanceId)}`,
			init: { headers: { Authorization: `Bot ${params.botAuth}` } },
			auditContext: "discord.activities.instance",
			endpointRuntime
		});
	} catch {
		return;
	}
	if (!result.ok || !Array.isArray(result.body?.users) || !result.body.users.includes(params.discordUserId) || !result.body.location || typeof result.body.location !== "object") return;
	const channelId = result.body.location.channel_id;
	return typeof channelId === "string" && /^\d+$/.test(channelId) ? channelId : void 0;
}
//#endregion
//#region extensions/discord/src/activities/rate-limit.ts
const TOKEN_RATE_LIMIT = 10;
const TOKEN_GLOBAL_RATE_LIMIT = 60;
const TOKEN_RATE_WINDOW_MS = 6e4;
const TOKEN_RATE_MAX_KEYS = 1024;
var TokenRateLimiter = class {
	constructor(now) {
		this.now = now;
		this.attempts = /* @__PURE__ */ new Map();
		this.globalAttempts = [];
	}
	allowKey(key) {
		const now = this.now();
		const active = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > now - TOKEN_RATE_WINDOW_MS);
		if (active.length >= TOKEN_RATE_LIMIT) {
			this.attempts.delete(key);
			this.attempts.set(key, active);
			return false;
		}
		if (!this.attempts.has(key) && this.attempts.size >= TOKEN_RATE_MAX_KEYS) {
			const oldestKey = this.attempts.keys().next().value;
			if (typeof oldestKey === "string") this.attempts.delete(oldestKey);
		}
		active.push(now);
		this.attempts.delete(key);
		this.attempts.set(key, active);
		return true;
	}
	reserveGlobal() {
		const now = this.now();
		this.globalAttempts = this.globalAttempts.filter((reservation) => reservation.at > now - TOKEN_RATE_WINDOW_MS);
		if (this.globalAttempts.length >= TOKEN_GLOBAL_RATE_LIMIT) return null;
		const reservation = { at: now };
		this.globalAttempts.push(reservation);
		return reservation;
	}
	releaseGlobal(reservation) {
		const index = this.globalAttempts.indexOf(reservation);
		if (index >= 0) this.globalAttempts.splice(index, 1);
	}
};
//#endregion
//#region extensions/discord/src/activities/shell.ts
const DISCORD_ACTIVITY_ROUTE_PREFIX = "/discord/activity";
const DISCORD_ACTIVITY_TOKEN_REQUEST_TIMEOUT_MS = 35e3;
const DISCORD_ACTIVITY_WIDGET_REQUEST_TIMEOUT_MS = 2e4;
const DISCORD_ACTIVITY_SHELL_CSP = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; frame-src 'self'; img-src data:; base-uri 'none'; frame-ancestors *";
const DISCORD_ACTIVITY_SHELL_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OpenClaw widget</title><style>
:root{color-scheme:dark;font:14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#1e1f22;color:#dbdee1}
*{box-sizing:border-box}html,body,#app{height:100%;margin:0}#app{display:grid;place-items:center}main{max-width:560px;padding:32px;text-align:center}
h1{font-size:18px;margin:0 0 8px;color:#f2f3f5}p{margin:0;color:#b5bac1;line-height:1.5}.widget{display:grid;grid-template-rows:42px 1fr;width:100%;height:100%;background:#111214}
.bar{display:flex;align-items:center;padding:0 14px;border-bottom:1px solid #2b2d31;font-weight:600;color:#f2f3f5}.widget iframe{border:0;width:100%;height:100%;background:#111214}
</style></head><body><div id="app"><main><h1>Opening widget</h1><p>Connecting to Discord…</p></main></div>
<script type="module" src="./shell.js"><\/script></body></html>`;
const DISCORD_ACTIVITY_SHELL_JS = `import { DiscordSDK } from "./vendor/embedded-app-sdk.mjs";

const tokenRequestTimeoutMs = ${DISCORD_ACTIVITY_TOKEN_REQUEST_TIMEOUT_MS};
const widgetRequestTimeoutMs = ${DISCORD_ACTIVITY_WIDGET_REQUEST_TIMEOUT_MS};
const app = document.querySelector("#app");
function show(message, detail) {
  app.className = "";
  app.innerHTML = "";
  const main = document.createElement("main");
  const heading = document.createElement("h1");
  const paragraph = document.createElement("p");
  heading.textContent = message;
  paragraph.textContent = detail;
  main.append(heading, paragraph);
  app.append(main);
}
function proxiedDocUrl(value) {
  const url = new URL(value, window.location.origin);
  if (window.location.hostname.endsWith(".discordsays.com")) {
    // The ROOT mapping target already includes this prefix; strip it before proxying.
    const gatewayPrefix = "/discord/activity";
    const mappedPath = url.pathname.startsWith(gatewayPrefix + "/")
      ? url.pathname.slice(gatewayPrefix.length)
      : url.pathname;
    return "/.proxy" + mappedPath + url.search;
  }
  return url.pathname + url.search;
}
async function readJson(response) {
  let body;
  try {
    body = await response.json();
  } catch (error) {
    // Error responses may legitimately omit JSON details; successful responses must not
    // turn an aborted or malformed body into an apparently valid empty payload.
    if (response.ok) throw error;
    body = {};
  }
  if (!response.ok) {
    const error = new Error(typeof body.error === "string" ? body.error : "request failed");
    error.status = response.status;
    throw error;
  }
  return body;
}
async function fetchJsonWithDeadline(input, init, timeoutMs) {
  // Activities also run in mobile webviews; avoid requiring the newer
  // AbortSignal.timeout() static API just to enforce this request boundary.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await readJson(await fetch(input, { ...init, signal: controller.signal }));
  } finally {
    clearTimeout(timeout);
  }
}
async function run() {
  const match = window.location.hostname.match(/^(\\d+)\\.discordsays\\.com$/i);
  if (!match) {
    show("Open inside Discord", "This widget must be launched from its Discord button.");
    return;
  }
  const clientId = match[1];
  const sdk = new DiscordSDK(clientId);
  await sdk.ready();
  const { code } = await sdk.commands.authorize({
    client_id: clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });
  const auth = await fetchJsonWithDeadline(
    "./api/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    },
    tokenRequestTimeoutMs,
  );
  await sdk.commands.authenticate({ access_token: auth.access_token });
  const query = new URLSearchParams({
    custom_id: sdk.customId ?? "",
    instance_id: sdk.instanceId,
  });
  const widget = await fetchJsonWithDeadline(
    "./api/widget?" + query,
    { headers: { Authorization: "Bearer " + auth.session_token } },
    widgetRequestTimeoutMs,
  );
  app.className = "widget";
  app.innerHTML = "";
  const bar = document.createElement("div");
  const frame = document.createElement("iframe");
  bar.className = "bar";
  bar.textContent = widget.title;
  frame.title = widget.title;
  // Intentionally minimal: no top-navigation, popups, or same-origin access.
  frame.setAttribute("sandbox", "allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.src = proxiedDocUrl(widget.docUrl);
  app.append(bar, frame);
}
run().catch((error) => {
  if (error?.status === 404) {
    show("Widget unavailable", "No widget could be resolved for this channel.");
  } else {
    show("Gateway offline", "The OpenClaw gateway could not load this widget. Try again shortly.");
  }
});
`;
//#endregion
//#region extensions/discord/src/activities/http.ts
const BODY_MAX_BYTES = 8192;
const JSON_CONTENT_TYPE = "application/json; charset=utf-8";
const WIDGET_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const DOC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const DISCORD_ACTIVITY_WIDGET_CSP = `sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' ${WIDGET_CDN_ORIGINS.join(" ")}; style-src 'unsafe-inline' ${WIDGET_CDN_ORIGINS.join(" ")}; img-src data: blob:; font-src data: ${WIDGET_CDN_ORIGINS.join(" ")}; connect-src 'none'; frame-ancestors *`;
function setCommonHeaders(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
}
function respond(res, statusCode, body, contentType, headers) {
	res.statusCode = statusCode;
	setCommonHeaders(res);
	res.setHeader("Content-Type", contentType);
	for (const [key, value] of Object.entries(headers ?? {})) res.setHeader(key, value);
	res.end(body);
	return true;
}
function jsonBody(body) {
	return `${JSON.stringify(body)}\n`;
}
function respondJson(res, statusCode, body) {
	return respond(res, statusCode, jsonBody(body), JSON_CONTENT_TYPE);
}
function notFound(res, widgetDocument = false) {
	return respond(res, 404, "not found", "text/plain; charset=utf-8", widgetDocument ? { "Content-Security-Policy": DISCORD_ACTIVITY_WIDGET_CSP } : void 0);
}
function readHeader(req, name) {
	const value = req.headers[name];
	return Array.isArray(value) ? value[0] : value;
}
function extractApplicationId(req) {
	for (const header of [readHeader(req, "origin"), readHeader(req, "referer")]) {
		if (!header) continue;
		try {
			const match = new URL(header).hostname.match(/^(\d+)\.discordsays\.com$/i);
			if (match?.[1]) return match[1];
		} catch {}
	}
}
function bearerToken(req) {
	return ((readHeader(req, "authorization")?.trim())?.match(/^Bearer\s+([A-Za-z0-9_-]{43})$/i))?.[1];
}
function widgetIdFromCustomId(customId) {
	if (WIDGET_ID_PATTERN.test(customId)) return customId;
	return parseDiscordActivityCustomId(customId)?.widgetId;
}
function createDiscordActivityHttpHandler(deps) {
	const fetchGuard = deps.fetchGuard ?? fetchWithSsrFGuard$1;
	const limiter = new TokenRateLimiter(deps.now ?? Date.now);
	const readVendorAsset = deps.readVendorAsset ?? ((assetPath) => fs.readFile(assetPath));
	const reportError = deps.logError ?? logError;
	const bodyTimeoutMs = deps.bodyTimeoutMs ?? WEBHOOK_BODY_READ_DEFAULTS.preAuth.timeoutMs;
	let vendorAsset;
	let pendingLaunchFailureLogged = false;
	function logPendingLaunchFailure(error) {
		if (pendingLaunchFailureLogged) return;
		pendingLaunchFailureLogged = true;
		reportError(`discord activity: failed to consume pending launch: ${String(error)}`);
	}
	async function handleToken(req, res) {
		const cfg = deps.runtime.currentConfig();
		const sourceIp = resolveRequestClientIp(req, cfg.gateway?.trustedProxies, cfg.gateway?.allowRealIpFallback === true) ?? "unknown";
		if (!limiter.allowKey(sourceIp)) return respondJson(res, 429, { error: "too many token requests" });
		const applicationId = extractApplicationId(req);
		const account = deps.runtime.resolveHttpAccount(applicationId);
		if (!account) return respondJson(res, 503, { error: "Discord Activities is not fully configured" });
		const endpointRuntime = getDiscordEndpointRuntime() ?? null;
		const bodyResult = await readJsonBodyWithLimit(req, {
			maxBytes: BODY_MAX_BYTES,
			timeoutMs: bodyTimeoutMs,
			emptyObjectOnEmpty: true,
			destroyOnLimit: false
		});
		if (!bodyResult.ok && bodyResult.code === "REQUEST_BODY_TIMEOUT") {
			await sendHttpRequestRejection(req, res, 408, jsonBody({ error: "request body timeout" }), JSON_CONTENT_TYPE);
			return true;
		}
		if (!bodyResult.ok && bodyResult.code === "PAYLOAD_TOO_LARGE") {
			await sendHttpRequestRejection(req, res, 413, jsonBody({ error: "request body too large" }), JSON_CONTENT_TYPE);
			return true;
		}
		const body = bodyResult.ok && bodyResult.value && typeof bodyResult.value === "object" && !Array.isArray(bodyResult.value) ? bodyResult.value : null;
		const code = typeof body?.code === "string" ? body.code.trim() : "";
		if (!code) return respondJson(res, 401, { error: "invalid authorization code" });
		const reservation = limiter.reserveGlobal();
		if (reservation === null) return respondJson(res, 429, { error: "too many token requests" });
		let completed = false;
		try {
			let tokenResponse;
			try {
				tokenResponse = await fetchDiscordJson({
					fetchGuard,
					fetchImpl: account.proxyFetch,
					url: DISCORD_TOKEN_URL,
					init: {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							grant_type: "authorization_code",
							client_id: account.applicationId,
							client_secret: account.clientSecret,
							code
						})
					},
					auditContext: "discord.activities.oauth.token",
					endpointRuntime
				});
			} catch {
				return respondJson(res, 503, { error: "Discord token exchange unavailable" });
			}
			const granted = typeof tokenResponse.body?.access_token === "string" ? tokenResponse.body.access_token.trim() : "";
			if (!tokenResponse.ok || !granted) return respondJson(res, 401, { error: "invalid authorization code" });
			let userResponse;
			try {
				userResponse = await fetchDiscordJson({
					fetchGuard,
					fetchImpl: account.proxyFetch,
					url: DISCORD_USER_URL,
					init: { headers: { Authorization: `Bearer ${granted}` } },
					auditContext: "discord.activities.oauth.user",
					endpointRuntime
				});
			} catch {
				return respondJson(res, 503, { error: "Discord user lookup unavailable" });
			}
			const discordUserId = typeof userResponse.body?.id === "string" ? userResponse.body.id : void 0;
			if (!userResponse.ok || !discordUserId) return respondJson(res, 401, { error: "Discord user lookup failed" });
			const minted = await deps.runtime.store.createSession({
				discordUserId,
				accountId: account.accountId
			});
			completed = true;
			return respondJson(res, 200, {
				access_token: granted,
				session_token: minted
			});
		} finally {
			if (!completed) limiter.releaseGlobal(reservation);
		}
	}
	async function handleWidget(req, res, url) {
		const token = bearerToken(req);
		const session = token ? await deps.runtime.store.lookupSession(token) : void 0;
		if (!session) return respondJson(res, 401, { error: "invalid session" });
		const customId = url.searchParams.get("custom_id")?.trim() ?? "";
		const instanceId = normalizeInstanceId(url.searchParams.get("instance_id"));
		const account = deps.runtime.resolveAccount(session.accountId);
		const channelId = instanceId && account ? await resolveActivityInstanceChannel({
			fetchGuard,
			applicationId: account.applicationId,
			instanceId,
			discordUserId: session.discordUserId,
			botAuth: account.botAuth,
			proxyFetch: account.proxyFetch
		}) : void 0;
		if (!channelId) return respondJson(res, 404, { error: "widget not found" });
		let resolved = null;
		const requestedWidgetId = widgetIdFromCustomId(customId);
		if (requestedWidgetId) {
			const widget = await deps.runtime.store.lookupWidget(requestedWidgetId);
			if (widget?.accountId !== session.accountId || widget.channelId !== channelId) return respondJson(res, 404, { error: "widget not found" });
			resolved = {
				id: requestedWidgetId,
				widget
			};
			try {
				await deps.runtime.store.retirePendingLaunch(session.accountId, channelId, session.discordUserId, requestedWidgetId);
			} catch (error) {
				logPendingLaunchFailure(error);
			}
		} else {
			try {
				const pendingLaunch = await deps.runtime.store.consumePendingLaunch(session.accountId, channelId, session.discordUserId);
				if (pendingLaunch) {
					const widget = await deps.runtime.store.lookupWidget(pendingLaunch.widgetId);
					if (widget?.accountId === session.accountId && widget.channelId === channelId) resolved = {
						id: pendingLaunch.widgetId,
						widget
					};
				}
			} catch (error) {
				logPendingLaunchFailure(error);
			}
			resolved ??= await deps.runtime.store.latestPostedWidgetForChannel(session.accountId, channelId);
		}
		if (!resolved) return respondJson(res, 404, { error: "widget not found" });
		const docToken = await deps.runtime.store.createDocToken({
			widgetId: resolved.id,
			accountId: session.accountId
		});
		return respondJson(res, 200, {
			id: resolved.id,
			title: resolved.widget.title,
			docUrl: `${DISCORD_ACTIVITY_ROUTE_PREFIX}/api/widget/${encodeURIComponent(resolved.id)}/doc?wt=${encodeURIComponent(docToken)}`
		});
	}
	async function handleDocument(res, widgetId, token) {
		if (!WIDGET_ID_PATTERN.test(widgetId) || !DOC_TOKEN_PATTERN.test(token)) return notFound(res, true);
		const capability = await deps.runtime.store.consumeDocToken(token);
		if (!capability || capability.widgetId !== widgetId) return notFound(res, true);
		const widget = await deps.runtime.store.lookupWidget(widgetId);
		if (!widget || widget.accountId !== capability.accountId) return notFound(res, true);
		return respond(res, 200, widget.html, "text/html; charset=utf-8", { "Content-Security-Policy": DISCORD_ACTIVITY_WIDGET_CSP });
	}
	return { async handleHttpRequest(req, res) {
		const url = new URL(req.url ?? "/", "http://localhost");
		if (url.pathname !== "/discord/activity" && !url.pathname.startsWith(`/discord/activity/`)) return false;
		if (!deps.runtime.hasEnabledAccounts()) return false;
		const relative = url.pathname.slice(17) || "/";
		if (req.method === "GET" && (relative === "/" || relative === "/index.html")) return respond(res, 200, DISCORD_ACTIVITY_SHELL_HTML, "text/html; charset=utf-8", { "Content-Security-Policy": DISCORD_ACTIVITY_SHELL_CSP });
		if (req.method === "GET" && relative === "/shell.js") return respond(res, 200, DISCORD_ACTIVITY_SHELL_JS, "text/javascript; charset=utf-8");
		if (req.method === "GET" && relative === "/vendor/embedded-app-sdk.mjs") {
			const pendingAsset = vendorAsset ??= readVendorAsset(deps.vendorAssetPath);
			try {
				return respond(res, 200, await pendingAsset, "text/javascript; charset=utf-8");
			} catch {
				if (vendorAsset === pendingAsset) vendorAsset = void 0;
				return notFound(res);
			}
		}
		if (req.method === "POST" && relative === "/api/token") return await handleToken(req, res);
		if (req.method === "GET" && relative === "/api/widget") return await handleWidget(req, res, url);
		const documentMatch = relative.match(/^\/api\/widget\/([^/]+)\/doc$/);
		if (req.method === "GET" && documentMatch?.[1]) {
			let widgetId;
			try {
				widgetId = decodeURIComponent(documentMatch[1]);
			} catch {
				return notFound(res, true);
			}
			return await handleDocument(res, widgetId, url.searchParams.get("wt") ?? "");
		}
		return notFound(res);
	} };
}
//#endregion
//#region extensions/discord/src/activities/presenter.ts
const DISCORD_WIDGET_HTML_MAX_BYTES = 49152;
function resolveDiscordChannelId(context) {
	const raw = context.nativeChannelId?.trim() || context.currentMessagingTarget?.trim() || context.currentChannelId?.trim() || context.deliveryContext?.to?.trim();
	if (!raw) return;
	try {
		return resolveDiscordChannelId$1(raw);
	} catch {
		return;
	}
}
function resolveDiscordPresentationRoute(context, runtime) {
	if (context.messageChannel !== "discord") return;
	const cfg = runtime.currentConfig();
	const account = resolveDiscordAccount({
		cfg,
		accountId: context.accountId ?? context.deliveryContext?.accountId
	});
	const channelId = resolveDiscordChannelId(context);
	const activityAccount = runtime.resolveAccount(account.accountId, cfg);
	if (!channelId || !activityAccount) return;
	return {
		account: activityAccount,
		cfg,
		channelId
	};
}
/** Presents a canonical core widget document in the active Discord channel. */
function createDiscordWidgetPresenter(runtime, deps = {}) {
	return {
		target: "current_channel",
		description: "Post an Activity launch button in the current Discord channel",
		capabilities: {
			sourceKinds: ["html"],
			maxSourceBytes: DISCORD_WIDGET_HTML_MAX_BYTES
		},
		match: (context) => resolveDiscordPresentationRoute(context, runtime) !== void 0,
		async availability(context) {
			return resolveDiscordPresentationRoute(context, runtime) ? {
				ok: true,
				value: { available: true }
			} : {
				ok: false,
				error: {
					code: "unavailable",
					message: "Discord Activities are unavailable for the current channel and account."
				}
			};
		},
		async present({ context, document, title }) {
			const route = resolveDiscordPresentationRoute(context, runtime);
			if (!route) return {
				ok: false,
				error: {
					code: "unavailable",
					message: "Discord Activities are unavailable for the current channel and account."
				}
			};
			if (title.length > 80) return {
				ok: false,
				error: {
					code: "presentation_error",
					message: "title must be 80 characters or fewer"
				}
			};
			const widgetId = await runtime.store.createWidget({
				html: document.html,
				title,
				channelId: route.channelId,
				accountId: route.account.accountId,
				createdAt: (deps.now ?? Date.now)()
			});
			let result;
			let deliveredResult;
			let deliveryRecord;
			let deliveryRecordError;
			const recordDelivery = async (deliveryResult) => {
				deliveredResult = deliveryResult;
				deliveryRecord ??= runtime.store.markWidgetDelivered(widgetId, deliveryResult.messageId);
				try {
					await deliveryRecord;
				} catch (error) {
					deliveryRecordError ??= new Error("Discord widget was delivered, but its delivery state could not be saved", { cause: error });
					throw deliveryRecordError;
				}
			};
			try {
				const components = buildDiscordPresentationComponents({ blocks: [{
					type: "buttons",
					buttons: [{
						label: "Open widget",
						action: {
							type: "web-app",
							widgetId
						}
					}]
				}] });
				if (!components) throw new Error("Discord widget launch button could not be rendered");
				result = await (deps.sendComponentMessage ?? sendDiscordComponentMessage)(`channel:${route.channelId}`, {
					...components,
					text: title
				}, {
					cfg: route.cfg,
					accountId: route.account.accountId,
					allowedMentions: { parse: [] },
					onDeliveryResult: recordDelivery
				});
				await recordDelivery(result);
			} catch (error) {
				if (deliveryRecordError) throw deliveryRecordError;
				if (!deliveredResult) {
					await runtime.store.deleteWidget(widgetId);
					throw error;
				}
				result = deliveredResult;
			}
			return {
				ok: true,
				value: {
					kind: "message",
					receipt: result.receipt
				}
			};
		}
	};
}
//#endregion
//#region extensions/discord/src/activities/store.ts
const DAY_MS = 864e5;
const DISCORD_EPOCH_MS = 14200704e5;
const WIDGET_TTL_MS = 7 * DAY_MS;
const SESSION_TTL_MS = 9e5;
const DOC_TOKEN_TTL_MS = 6e4;
const PENDING_LAUNCH_TTL_MS = 12e4;
function requireAtomicComparison(store) {
	if (!store.observe || !store.compareAndApply) throw new Error("Discord Activities require atomic plugin state comparisons");
	return store;
}
function openDiscordActivityStores(openKeyedStore) {
	return {
		widgets: requireAtomicComparison(openKeyedStore({
			namespace: "activities-widgets",
			maxEntries: 64,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: WIDGET_TTL_MS
		})),
		sessions: openKeyedStore({
			namespace: "activities-sessions",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: SESSION_TTL_MS
		}),
		docTokens: openKeyedStore({
			namespace: "activities-doc-tokens",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: DOC_TOKEN_TTL_MS
		}),
		launches: requireAtomicComparison(openKeyedStore({
			namespace: "activities-launches",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: PENDING_LAUNCH_TTL_MS
		}))
	};
}
function pendingLaunchKey(accountId, channelId, discordUserId) {
	return `${accountId}:${channelId}:${discordUserId}`;
}
function deliveredWidgetIntent(widget, messageId) {
	return widget ? {
		operation: "update",
		action: "set",
		value: {
			...widget,
			deliveredMessageId: messageId
		}
	} : {
		operation: "update",
		action: "keep"
	};
}
function pendingLaunchForWidget(existing, widgetId, createdAt) {
	return existing && (existing.state === "ambiguous" || existing.widgetId !== widgetId) ? {
		state: "ambiguous",
		createdAt
	} : {
		state: "single",
		widgetId,
		createdAt
	};
}
function retirePendingLaunchIntent(existing, widgetId) {
	return {
		operation: "delete",
		action: existing?.state === "single" && existing.widgetId === widgetId ? "delete" : "keep"
	};
}
var DiscordActivityStore = class {
	constructor(stores) {
		this.stores = stores;
		this.lastWidgetCreatedAt = 0;
	}
	async createWidget(value) {
		const id = randomBytes(16).toString("base64url");
		const createdAt = Math.max(value.createdAt, this.lastWidgetCreatedAt + 1);
		this.lastWidgetCreatedAt = createdAt;
		await this.stores.widgets.register(id, {
			...value,
			createdAt,
			deliveredMessageId: null
		});
		return id;
	}
	async markWidgetDelivered(id, messageId) {
		if (!/^\d+$/u.test(messageId)) throw new Error("Discord Activity delivery returned an invalid message ID");
		const widgets = this.stores.widgets;
		let observed = await widgets.observe(id);
		while (true) {
			const result = await widgets.compareAndApply(id, observed.comparison, deliveredWidgetIntent(observed.value, messageId));
			if (result.status === "conflict") {
				observed = result.current;
				continue;
			}
			if (result.status === "unchanged") throw new Error("Discord Activity widget disappeared before delivery was recorded");
			return;
		}
	}
	async deleteWidget(id) {
		await this.stores.widgets.delete(id);
	}
	async lookupWidget(id) {
		return await this.stores.widgets.lookup(id);
	}
	async latestPostedWidgetForChannel(accountId, channelId) {
		const entries = await this.stores.widgets.entries();
		let match;
		for (const entry of entries) {
			if (entry.value.accountId !== accountId || entry.value.channelId !== channelId) continue;
			if (entry.value.deliveredMessageId === null) continue;
			const deliveryOrder = entry.value.deliveredMessageId ? BigInt(entry.value.deliveredMessageId) : BigInt(Math.max(0, Math.trunc(entry.value.createdAt - DISCORD_EPOCH_MS))) << 22n;
			if (!match || deliveryOrder > match.deliveryOrder) match = {
				entry,
				deliveryOrder
			};
		}
		return match ? {
			id: match.entry.key,
			widget: match.entry.value
		} : null;
	}
	async createSession(value) {
		const token = randomBytes(32).toString("base64url");
		await this.stores.sessions.register(token, value);
		return token;
	}
	async lookupSession(token) {
		return await this.stores.sessions.lookup(token);
	}
	async createDocToken(value) {
		const token = randomBytes(32).toString("base64url");
		await this.stores.docTokens.register(token, value);
		return token;
	}
	async consumeDocToken(token) {
		return await this.stores.docTokens.consume(token);
	}
	async recordPendingLaunch(params) {
		const key = pendingLaunchKey(params.accountId, params.channelId, params.discordUserId);
		const { widgetId, createdAt } = params;
		const launches = this.stores.launches;
		let observed = await launches.observe(key);
		while (true) {
			const result = await launches.compareAndApply(key, observed.comparison, {
				operation: "update",
				action: "set",
				value: pendingLaunchForWidget(observed.value, widgetId, createdAt)
			});
			if (result.status !== "conflict") return;
			observed = result.current;
		}
	}
	async retirePendingLaunch(accountId, channelId, discordUserId, widgetId) {
		const key = pendingLaunchKey(accountId, channelId, discordUserId);
		const launches = this.stores.launches;
		let observed = await launches.observe(key);
		while (true) {
			const result = await launches.compareAndApply(key, observed.comparison, retirePendingLaunchIntent(observed.value, widgetId));
			if (result.status !== "conflict") return;
			observed = result.current;
		}
	}
	async consumePendingLaunch(accountId, channelId, discordUserId) {
		const launch = await this.stores.launches.consume(pendingLaunchKey(accountId, channelId, discordUserId));
		return launch?.state === "single" ? launch : void 0;
	}
};
//#endregion
//#region extensions/discord/src/activities/register.ts
function registerDiscordActivities$1(api) {
	setDiscordActivitiesRuntime(void 0);
	const store = new DiscordActivityStore(openDiscordActivityStores((options) => api.runtime.state.openKeyedStore(options)));
	const runtime = new DiscordActivitiesRuntime(store, api.config, api.runtime.config?.current ? () => api.runtime.config.current() : void 0);
	setDiscordActivitiesRuntime(runtime);
	const http = createDiscordActivityHttpHandler({
		runtime,
		vendorAssetPath: api.resolvePath("assets/embedded-app-sdk.mjs")
	});
	api.registerHttpRoute({
		path: DISCORD_ACTIVITY_ROUTE_PREFIX,
		auth: "plugin",
		match: "prefix",
		handler: async (req, res) => await http.handleHttpRequest(req, res)
	});
	api.registerWidgetPresenter(createDiscordWidgetPresenter(runtime));
}
//#endregion
//#region extensions/discord/activities-api.ts
function registerDiscordActivities(api) {
	registerDiscordActivities$1(api);
}
//#endregion
export { registerDiscordActivities as t };
