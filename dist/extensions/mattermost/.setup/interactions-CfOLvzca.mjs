import { n as __reExport, t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { r as resolveCallbackHost } from "./callback-host-CBsPjVAZ.mjs";
import { y as updateMattermostPost } from "./client-f2qstbX3.mjs";
import { D as sendHttpRequestRejection, T as resolveClientIp, g as isTrustedProxyAddress, h as isRequestBodyLimitError, x as readRequestBodyWithLimit } from "./monitor-auth-aZ0b1gqx.mjs";
import { createHmac } from "node:crypto";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { normalizeOptionalString, normalizeStringifiedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { safeParseJson } from "openclaw/plugin-sdk/text-utility-runtime";
//#region src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString$1(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString$1(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty$1(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region src/plugins/http-path-prefix.ts
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
//#endregion
//#region src/gateway/security-path.ts
const MAX_PATH_DECODE_PASSES = 32;
function normalizePathSeparators(pathname) {
	const collapsed = pathname.replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed;
	return collapsed.replace(/\/+$/, "");
}
function resolveDotSegments(pathname) {
	try {
		return new URL(pathname, "http://localhost").pathname;
	} catch {
		return pathname;
	}
}
function normalizePathForSecurity(pathname) {
	return normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(resolveDotSegments(pathname))) || "/";
}
function buildCanonicalPathCandidates(pathname, maxDecodePasses = MAX_PATH_DECODE_PASSES) {
	const candidates = /* @__PURE__ */ new Set([normalizePathForSecurity(pathname)]);
	let decoded = pathname;
	let malformedEncoding = false;
	let decodePasses = 0;
	for (let pass = 0; pass < maxDecodePasses; pass++) {
		let nextDecoded;
		try {
			nextDecoded = decodeURIComponent(decoded);
		} catch {
			malformedEncoding = true;
			break;
		}
		if (nextDecoded === decoded) break;
		decodePasses += 1;
		decoded = nextDecoded;
		candidates.add(normalizePathForSecurity(decoded));
	}
	let decodePassLimitReached = false;
	if (!malformedEncoding) try {
		decodePassLimitReached = decodeURIComponent(decoded) !== decoded;
	} catch {
		malformedEncoding = true;
	}
	return {
		candidates: [...candidates],
		decodePasses,
		decodePassLimitReached,
		malformedEncoding
	};
}
function canonicalizePathForSecurity(pathname) {
	const { candidates, decodePasses, decodePassLimitReached, malformedEncoding } = buildCanonicalPathCandidates(pathname);
	return {
		canonicalPath: candidates[candidates.length - 1] ?? "/",
		candidates,
		decodePasses,
		decodePassLimitReached,
		malformedEncoding,
		rawNormalizedPath: normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(pathname)) || "/"
	};
}
const PROTECTED_PLUGIN_ROUTE_PREFIXES = ["/api/channels"];
//#endregion
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty$1(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/gateway-config-runtime
var gateway_config_runtime_exports = /* @__PURE__ */ __exportAll({
	classifyGatewayProbePath: () => classifyGatewayProbePath,
	isProtectedPluginRoutePathFromContext: () => isProtectedPluginRoutePathFromContext,
	resolvePluginRoutePathContext: () => resolvePluginRoutePathContext
});
import * as import_openclaw_plugin_sdk_gateway_config_runtime from "openclaw/plugin-sdk/gateway-config-runtime";
__reExport(gateway_config_runtime_exports, import_openclaw_plugin_sdk_gateway_config_runtime);
//#endregion
//#region extensions/mattermost/src/mattermost/interactions.ts
const INTERACTION_MAX_BODY_BYTES = 65536;
const INTERACTION_BODY_TIMEOUT_MS = 1e4;
const SIGNED_CHANNEL_ID_CONTEXT_KEY = "__openclaw_channel_id";
const callbackUrls = /* @__PURE__ */ new Map();
function setInteractionCallbackUrl(accountId, url) {
	callbackUrls.set(accountId, url);
}
function resolveInteractionCallbackPath(accountId) {
	return `/mattermost/interactions/${accountId}`;
}
function headerValue(value) {
	if (Array.isArray(value)) return normalizeOptionalString(value[0]);
	return normalizeOptionalString(value);
}
function isAllowedInteractionSource(params) {
	const { allowedSourceIps } = params;
	if (!allowedSourceIps?.length) return true;
	const clientIp = resolveClientIp({
		remoteAddr: params.req.socket?.remoteAddress,
		forwardedFor: headerValue(params.req.headers["x-forwarded-for"]),
		realIp: headerValue(params.req.headers["x-real-ip"]),
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback
	});
	return isTrustedProxyAddress(clientIp, allowedSourceIps);
}
/**
* Resolve the interaction callback URL for an account.
* Falls back to computing it from interactions.callbackBaseUrl or gateway host config.
*/
function computeInteractionCallbackUrl(accountId, cfg) {
	const path = resolveInteractionCallbackPath(accountId);
	const callbackBaseUrl = normalizeOptionalString(cfg?.interactions?.callbackBaseUrl) ?? normalizeOptionalString(cfg?.channels?.mattermost?.interactions?.callbackBaseUrl);
	if (callbackBaseUrl) return `${callbackBaseUrl.replace(/\/+$/, "")}${path}`;
	const port = (0, gateway_config_runtime_exports.resolveGatewayPort)(cfg);
	return `http://${resolveCallbackHost(cfg?.gateway?.customBindHost, true)}:${port}${path}`;
}
/**
* Resolve the interaction callback URL for an account.
* Prefers the in-memory registered URL (set by the gateway monitor) so callers outside the
* monitor lifecycle can reuse the runtime-validated callback destination.
*/
function resolveInteractionCallbackUrl(accountId, cfg) {
	const cached = callbackUrls.get(accountId);
	if (cached) return cached;
	return computeInteractionCallbackUrl(accountId, cfg);
}
const interactionSecrets = /* @__PURE__ */ new Map();
function deriveInteractionSecret(botToken) {
	return createHmac("sha256", "openclaw-mattermost-interactions").update(botToken).digest("hex");
}
function setInteractionSecret(accountId, botToken) {
	interactionSecrets.set(accountId, deriveInteractionSecret(botToken));
}
function getInteractionSecret(accountId) {
	const scoped = accountId ? interactionSecrets.get(accountId) : void 0;
	if (scoped) return scoped;
	if (interactionSecrets.size === 1) {
		const first = interactionSecrets.values().next().value;
		if (typeof first === "string") return first;
	}
	throw new Error("Interaction secret not initialized — call setInteractionSecret(accountId, botToken) first");
}
function canonicalizeInteractionContext(value) {
	if (Array.isArray(value)) return value.map((item) => canonicalizeInteractionContext(item));
	if (value && typeof value === "object") {
		const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entryValue]) => [key, canonicalizeInteractionContext(entryValue)]);
		return Object.fromEntries(entries);
	}
	return value;
}
function generateInteractionToken(context, accountId) {
	const secret = getInteractionSecret(accountId);
	const payload = JSON.stringify(canonicalizeInteractionContext(context));
	return createHmac("sha256", secret).update(payload).digest("hex");
}
/**
* Sanitize a button ID so Mattermost's action router can match it.
* Mattermost uses the action ID in the URL path `/api/v4/posts/{id}/actions/{actionId}`
* and IDs containing hyphens or underscores break the server-side routing.
* See: https://github.com/mattermost/mattermost/issues/25747
*/
function sanitizeActionId(id) {
	return id.replace(/[-_]/g, "");
}
function buildButtonAttachments(params) {
	const actions = params.buttons.map((btn) => {
		const safeId = sanitizeActionId(btn.id);
		const context = {
			action_id: safeId,
			...btn.context
		};
		const token = generateInteractionToken(context, params.accountId);
		return {
			id: safeId,
			type: "button",
			name: btn.name,
			style: btn.style,
			integration: {
				url: params.callbackUrl,
				context: {
					...context,
					_token: token
				}
			}
		};
	});
	return [{
		text: params.text ?? "",
		actions
	}];
}
function buildButtonProps(params) {
	const buttons = params.buttons.flatMap((item) => Array.isArray(item) ? item : [item]).map((btn) => ({
		id: normalizeStringifiedOptionalString(btn.id ?? btn.callback_data) ?? "",
		name: normalizeStringifiedOptionalString(btn.text ?? btn.name ?? btn.label) ?? "",
		style: btn.style ?? "default",
		context: typeof btn.context === "object" && btn.context !== null ? {
			...btn.context,
			[SIGNED_CHANNEL_ID_CONTEXT_KEY]: params.channelId
		} : { [SIGNED_CHANNEL_ID_CONTEXT_KEY]: params.channelId }
	})).filter((btn) => btn.id && btn.name);
	if (buttons.length === 0) return;
	return { attachments: buildButtonAttachments({
		callbackUrl: params.callbackUrl,
		accountId: params.accountId,
		buttons,
		text: params.text
	}) };
}
function sendInteractionResponse(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(body));
}
function createMattermostInteractionHandler(params) {
	const { client, accountId, log } = params;
	const core = getMattermostRuntime();
	function parseInteractionPayload(raw) {
		const payload = safeParseJson(raw);
		if (payload === null) throw new Error("Mattermost interaction body was malformed JSON");
		return payload;
	}
	return async (req, res) => {
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "POST");
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ error: "Method Not Allowed" }));
			return;
		}
		if (!isAllowedInteractionSource({
			req,
			allowedSourceIps: params.allowedSourceIps,
			trustedProxies: params.trustedProxies,
			allowRealIpFallback: params.allowRealIpFallback
		})) {
			log?.(`mattermost interaction: rejected callback source remote=${req.socket?.remoteAddress ?? "?"}`);
			sendInteractionResponse(res, 403, { error: "Forbidden origin" });
			return;
		}
		let payload;
		try {
			payload = parseInteractionPayload(await readRequestBodyWithLimit(req, {
				maxBytes: INTERACTION_MAX_BODY_BYTES,
				timeoutMs: INTERACTION_BODY_TIMEOUT_MS,
				destroyOnLimit: false
			}));
		} catch (err) {
			log?.(`mattermost interaction: failed to parse body: ${String(err)}`);
			if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
				await sendHttpRequestRejection(req, res, 413, JSON.stringify({ error: "Payload too large" }), "application/json");
				return;
			}
			if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
				await sendHttpRequestRejection(req, res, 408, JSON.stringify({ error: "Request body timeout" }), "application/json");
				return;
			}
			sendInteractionResponse(res, 400, { error: "Invalid request body" });
			return;
		}
		const context = payload.context;
		if (!context) {
			sendInteractionResponse(res, 400, { error: "Missing context" });
			return;
		}
		const token = context["_token"];
		if (typeof token !== "string") {
			log?.("mattermost interaction: missing _token in context");
			sendInteractionResponse(res, 403, { error: "Missing token" });
			return;
		}
		const { _token, ...contextWithoutToken } = context;
		if (!safeEqualSecret(generateInteractionToken(contextWithoutToken, accountId), token)) {
			log?.("mattermost interaction: invalid _token");
			sendInteractionResponse(res, 403, { error: "Invalid token" });
			return;
		}
		const actionId = context.action_id;
		if (typeof actionId !== "string") {
			sendInteractionResponse(res, 400, { error: "Missing action_id in context" });
			return;
		}
		const signedChannelId = typeof contextWithoutToken[SIGNED_CHANNEL_ID_CONTEXT_KEY] === "string" ? contextWithoutToken[SIGNED_CHANNEL_ID_CONTEXT_KEY].trim() : "";
		if (signedChannelId && signedChannelId !== payload.channel_id) {
			log?.(`mattermost interaction: signed channel mismatch payload=${payload.channel_id} signed=${signedChannelId}`);
			sendInteractionResponse(res, 403, { error: "Channel mismatch" });
			return;
		}
		const userName = payload.user_name ?? payload.user_id;
		let originalMessage;
		let originalPost;
		let clickedButtonName = null;
		try {
			originalPost = await client.request(`/posts/${payload.post_id}`);
			const postChannelId = originalPost.channel_id?.trim();
			if (!postChannelId || postChannelId !== payload.channel_id) {
				log?.(`mattermost interaction: post channel mismatch payload=${payload.channel_id} post=${postChannelId ?? "<missing>"}`);
				sendInteractionResponse(res, 403, { error: "Post/channel mismatch" });
				return;
			}
			originalMessage = originalPost.message ?? "";
			const postAttachments = Array.isArray(originalPost?.props?.attachments) ? originalPost.props.attachments : [];
			for (const att of postAttachments) {
				const match = att.actions?.find((a) => a.id === actionId);
				if (match?.name) {
					clickedButtonName = match.name;
					break;
				}
			}
			if (clickedButtonName === null) {
				log?.(`mattermost interaction: action ${actionId} not found in post ${payload.post_id}`);
				sendInteractionResponse(res, 403, { error: "Unknown action" });
				return;
			}
		} catch (err) {
			log?.(`mattermost interaction: failed to validate post ${payload.post_id}: ${String(err)}`);
			sendInteractionResponse(res, 500, { error: "Failed to validate interaction" });
			return;
		}
		log?.(`mattermost interaction: action=${actionId} user=${payload.user_name ?? payload.user_id} post=${payload.post_id} channel=${payload.channel_id}`);
		if (params.authorizeButtonClick) try {
			const authorization = await params.authorizeButtonClick({
				payload,
				post: originalPost
			});
			if (!authorization.ok) {
				sendInteractionResponse(res, authorization.statusCode ?? 200, authorization.response ?? { ephemeral_text: "You are not allowed to use this action here." });
				return;
			}
		} catch (err) {
			log?.(`mattermost interaction: authorization failed: ${String(err)}`);
			sendInteractionResponse(res, 500, { error: "Interaction authorization failed" });
			return;
		}
		if (params.handleInteraction) try {
			const response = await params.handleInteraction({
				payload,
				userName,
				actionId,
				actionName: clickedButtonName,
				originalMessage,
				context: contextWithoutToken,
				post: originalPost
			});
			if (response !== null) {
				sendInteractionResponse(res, 200, response);
				return;
			}
		} catch (err) {
			log?.(`mattermost interaction: custom handler failed: ${String(err)}`);
			sendInteractionResponse(res, 500, { error: "Interaction handler failed" });
			return;
		}
		try {
			const eventLabel = `Mattermost button click: action="${actionId}" by ${payload.user_name ?? payload.user_id} in channel ${payload.channel_id}`;
			const sessionKey = params.resolveSessionKey ? await params.resolveSessionKey({
				channelId: payload.channel_id,
				userId: payload.user_id,
				post: originalPost
			}) : `agent:main:mattermost:${accountId}:${payload.channel_id}`;
			core.system.enqueueSystemEvent(eventLabel, {
				sessionKey,
				contextKey: `mattermost:interaction:${payload.post_id}:${actionId}`
			});
		} catch (err) {
			log?.(`mattermost interaction: system event dispatch failed: ${String(err)}`);
		}
		try {
			await updateMattermostPost(client, payload.post_id, {
				message: originalMessage,
				props: { attachments: [{ text: `✓ **${clickedButtonName}** selected by @${userName}` }] }
			});
		} catch (err) {
			log?.(`mattermost interaction: failed to update post ${payload.post_id}: ${String(err)}`);
		}
		sendInteractionResponse(res, 200, {});
		if (params.dispatchButtonClick) try {
			await params.dispatchButtonClick({
				channelId: payload.channel_id,
				userId: payload.user_id,
				userName,
				actionId,
				actionName: clickedButtonName,
				postId: payload.post_id,
				post: originalPost
			});
		} catch (err) {
			log?.(`mattermost interaction: dispatchButtonClick failed: ${String(err)}`);
		}
	};
}
//#endregion
export { resolveInteractionCallbackPath as a, setInteractionSecret as c, createMattermostInteractionHandler as i, gateway_config_runtime_exports as l, buildButtonProps as n, resolveInteractionCallbackUrl as o, computeInteractionCallbackUrl as r, setInteractionCallbackUrl as s, buildButtonAttachments as t };
