import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as parseAgentSessionKeyParts, r as isIncognitoSessionKey, t as DEFAULT_MAIN_KEY } from "./session-key-CmZ4o9-l.mjs";
//#region packages/session-url-contract/src/grammar.ts
const SHORT_SESSION_REF_RE = /^(?:.*-)?([0-9a-f]{8,32})$/iu;
const FIXED_RESERVED_SESSION_RESTS = /* @__PURE__ */ new Set([
	"main",
	"global",
	"boot",
	"sessions"
]);
const SESSION_SLUG_MAX_LENGTH = 48;
function controlUiSessionSlug(displayName) {
	return ((displayName ?? "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "").match(/^.*[g-z][a-z0-9]*/u)?.[0] ?? "").slice(0, SESSION_SLUG_MAX_LENGTH).replace(/-+$/gu, "");
}
function normalizeControlUiBasePath(basePath) {
	const trimmed = basePath?.trim().replace(/^\/+|\/+$/gu, "") ?? "";
	return trimmed ? `/${trimmed}` : "";
}
function isReservedSessionRest(rest, mainKey) {
	const normalized = rest.toLowerCase();
	const configuredMainKey = normalizeNullableString(mainKey)?.toLowerCase() ?? "main";
	return FIXED_RESERVED_SESSION_RESTS.has(normalized) || normalized === configuredMainKey;
}
function parseShortSessionRef(sessionRef) {
	const shortId = sessionRef.match(SHORT_SESSION_REF_RE)?.[1]?.toLowerCase();
	if (!shortId) return null;
	const slugHint = sessionRef.slice(0, sessionRef.length - shortId.length).replace(/-+$/u, "");
	return slugHint ? {
		shortId,
		slugHint
	} : { shortId };
}
//#endregion
//#region packages/session-url-contract/src/share.ts
const CONTROL_UI_RESERVED_ROUTE_SEGMENTS = Object.freeze([
	"activity",
	"agents",
	"ai-agents",
	"appearance",
	"approve",
	"apps",
	"ask",
	"automation",
	"automations",
	"channels",
	"chat",
	"communications",
	"config",
	"cron",
	"custodian",
	"dashboard",
	"dashboards",
	"debug",
	"focus",
	"infrastructure",
	"lobsterdex",
	"logs",
	"mcp",
	"meetings",
	"memory-import",
	"model-providers",
	"model-setup",
	"new",
	"nodes",
	"plugin",
	"plugins",
	"portals",
	"profile",
	"sessions",
	"settings",
	"share",
	"skills",
	"systems",
	"terminal",
	"usage",
	"workboard",
	"worktrees"
]);
function isControlUiReservedRouteSegment(value) {
	return CONTROL_UI_RESERVED_ROUTE_SEGMENTS.includes(value.toLowerCase());
}
//#endregion
//#region packages/session-url-contract/src/index.ts
const SESSION_UUID_SUFFIX_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/iu;
const SHORT_SESSION_ID_RE = /^[0-9a-f]{8,32}$/iu;
function agentSessionKeyParts(sessionKey) {
	const parsed = parseAgentSessionKeyParts(sessionKey);
	if (!parsed || parsed.rest.split(":").some((segment) => !segment)) return null;
	return {
		agentId: normalizeAgentId(parsed.agentId),
		rest: parsed.rest
	};
}
function encodePathSegment(segment) {
	if (segment === ".") return "~dot";
	if (segment === "..") return "~dotdot";
	const encoded = encodeURIComponent(segment).replaceAll(".", "%2E");
	return encoded.startsWith("~") ? `~${encoded}` : encoded;
}
function buildControlUiSessionPath(params) {
	const rawKey = normalizeNullableString(params.sessionKey);
	const parsed = rawKey ? agentSessionKeyParts(rawKey) : null;
	const fallbackAgentId = normalizeNullableString(params.fallbackAgentId);
	const agentId = parsed?.agentId ?? (fallbackAgentId ? normalizeAgentId(fallbackAgentId) : null);
	if (!rawKey || !agentId || !parsed && rawKey.toLowerCase().startsWith("agent:")) return null;
	const namespace = `${normalizeControlUiBasePath(params.basePath)}/${params.namespace}`;
	const encodedAgentId = encodePathSegment(agentId);
	const rest = parsed?.rest ?? rawKey;
	const normalizedRest = rest.toLowerCase();
	if (normalizedRest === (normalizeNullableString(params.mainKey)?.toLowerCase() ?? "main") || !parsed && (normalizedRest === "main" || normalizedRest === "global")) return `${namespace}/${encodedAgentId}`;
	const segments = rest.split(":");
	if (segments.some((segment) => !segment)) return null;
	if (params.exactKey || isIncognitoSessionKey(rawKey) || normalizedRest === "global") {
		const segment = segments[0] ?? "";
		return segments.length === 1 && (isReservedSessionRest(segment, params.mainKey) || parseShortSessionRef(segment)) ? `${namespace}/${encodedAgentId}/~key/${encodePathSegment(segment)}` : `${namespace}/${encodedAgentId}/${segments.map(encodePathSegment).join("/")}`;
	}
	const uuid = (parsed?.rest.match(SESSION_UUID_SUFFIX_RE)?.[1])?.toLowerCase().replaceAll("-", "") ?? null;
	if (uuid) {
		const requestedLength = params.shortIdLength ?? 8;
		let length = Math.min(uuid.length, Math.max(8, Math.floor(requestedLength)));
		const slug = controlUiSessionSlug(params.displayName);
		let sessionRef = `${slug ? `${slug}-` : ""}${uuid.slice(0, length)}`;
		while (length < uuid.length && isReservedSessionRest(sessionRef, params.mainKey)) {
			length += 1;
			sessionRef = `${slug ? `${slug}-` : ""}${uuid.slice(0, length)}`;
		}
		return isReservedSessionRest(sessionRef, params.mainKey) ? null : `${namespace}/${encodedAgentId}/${sessionRef}`;
	}
	if (segments.length === 1) {
		const segment = segments[0] ?? "";
		if (!isReservedSessionRest(segment, params.mainKey) && parseShortSessionRef(segment)) return `${namespace}/${encodedAgentId}/~key/${encodePathSegment(segment)}`;
	}
	return `${namespace}/${encodedAgentId}/${segments.map(encodePathSegment).join("/")}`;
}
function buildControlUiCatalogSessionUrl(params) {
	const catalog = normalizeNullableString(params.catalog);
	const host = normalizeNullableString(params.host);
	const thread = normalizeNullableString(params.thread);
	const path = buildControlUiSessionPath({
		namespace: params.namespace,
		sessionKey: DEFAULT_MAIN_KEY,
		fallbackAgentId: params.agentId,
		basePath: params.basePath
	});
	if (!path || !catalog || !host || !thread) return null;
	return `${path}?${new URLSearchParams({
		catalog,
		host,
		thread
	}).toString()}`;
}
//#endregion
export { isControlUiReservedRouteSegment as a, normalizeControlUiBasePath as c, buildControlUiSessionPath as i, parseShortSessionRef as l, SHORT_SESSION_ID_RE as n, controlUiSessionSlug as o, buildControlUiCatalogSessionUrl as r, isReservedSessionRest as s, SESSION_UUID_SUFFIX_RE as t };
