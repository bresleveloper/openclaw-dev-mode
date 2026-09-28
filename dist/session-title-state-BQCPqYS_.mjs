import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/gateway/session-title-state.ts
const requestKey = (target) => `${target.storePath}\0${target.sessionKey}\0${target.sessionId}`;
const pending = /* @__PURE__ */ new Map();
const sessionTitleRequests = {
	get(target) {
		return pending.get(requestKey(target));
	},
	run(target, create) {
		return getOrCreatePromise(pending, requestKey(target), create, { evictOnSettled: true });
	}
};
function resolveExplicitSessionName(entry) {
	const label = entry?.label?.trim();
	if (label) return label;
	return [
		entry?.displayName,
		entry?.subject,
		entry?.groupChannel,
		entry?.space
	].map((value) => value?.trim()).find(Boolean);
}
function hasExplicitSessionName(entry) {
	return Boolean(resolveExplicitSessionName(entry));
}
//#endregion
export { resolveExplicitSessionName as n, sessionTitleRequests as r, hasExplicitSessionName as t };
