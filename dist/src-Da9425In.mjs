import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { a as parseAgentSessionKeyParts, r as isIncognitoSessionKey, t as DEFAULT_MAIN_KEY } from "./session-key-CUi_tcgF.mjs";
import { i as parseShortSessionRef, n as isReservedSessionRest, r as normalizeControlUiBasePath, t as controlUiSessionSlug } from "./grammar-Dp605oVy.mjs";
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
	"tasks",
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
export { isControlUiReservedRouteSegment as a, buildControlUiSessionPath as i, SHORT_SESSION_ID_RE as n, buildControlUiCatalogSessionUrl as r, SESSION_UUID_SUFFIX_RE as t };
