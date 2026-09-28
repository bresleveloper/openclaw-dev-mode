import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/active-turn-thread-route.ts
const activeRoutes = /* @__PURE__ */ new Map();
function beginDiscordActiveTurnThreadRoute(sessionKey, route) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return () => {};
	const routes = activeRoutes.get(key) ?? /* @__PURE__ */ new Set();
	routes.add(route);
	activeRoutes.set(key, routes);
	return () => {
		routes.delete(route);
		if (routes.size === 0 && activeRoutes.get(key) === routes) activeRoutes.delete(key);
	};
}
async function notifyDiscordActiveTurnThreadCreated(params) {
	const key = normalizeOptionalString(params.sessionKey ?? void 0);
	const threadId = normalizeOptionalString(params.threadId);
	const sourceChannelId = normalizeOptionalString(params.sourceChannelId);
	const sourceMessageId = normalizeOptionalString(params.sourceMessageId);
	const route = key ? Array.from(activeRoutes.get(key) ?? []).find((candidate) => sourceChannelId === candidate.sourceChannelId && sourceMessageId === candidate.sourceMessageId && (!candidate.accountId || !params.accountId || candidate.accountId === params.accountId)) : void 0;
	if (!route || !threadId) return false;
	route.adoptedThreadId = threadId;
	try {
		await route.onThreadAdopted(threadId);
	} catch (error) {
		route.onThreadAdoptionError?.(error);
	}
	return true;
}
function notifyDiscordActiveTurnThreadReplyDelivered(params) {
	const route = findDiscordActiveTurnThreadReplyRoute(params);
	const threadId = normalizeOptionalString(params.threadId ?? void 0);
	if (!route || !threadId) return false;
	route.onThreadReplyDelivered?.(threadId);
	return true;
}
function findDiscordActiveTurnThreadReplyRoute(params) {
	const key = normalizeOptionalString(params.sessionKey ?? void 0);
	const threadId = normalizeOptionalString(params.threadId);
	if (!key || !threadId) return;
	return Array.from(activeRoutes.get(key) ?? []).find((route) => Boolean(route.adoptedThreadId) && route.adoptedThreadId === threadId && (!route.accountId || !params.accountId || route.accountId === params.accountId));
}
//#endregion
export { notifyDiscordActiveTurnThreadCreated as n, notifyDiscordActiveTurnThreadReplyDelivered as r, beginDiscordActiveTurnThreadRoute as t };
