import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/infra/session-cost-usage-events.ts
const publications = resolveGlobalSingleton(Symbol.for("openclaw.sessionCostUsagePublications"), () => ({
	updatedAt: 0,
	listeners: /* @__PURE__ */ new Set()
}), (state) => state.listeners.clear());
function getSessionCostUsageUpdatedAt() {
	return publications.updatedAt;
}
function onSessionCostUsageUpdated(listener) {
	return registerListener(publications.listeners, listener);
}
function publishSessionCostUsageUpdated(agentId, failed = false) {
	publications.updatedAt = Math.max(Date.now(), publications.updatedAt + 1);
	notifyListeners(publications.listeners, {
		agentId,
		usageUpdatedAt: publications.updatedAt,
		...failed ? { usageRefreshFailed: true } : {}
	});
}
//#endregion
export { onSessionCostUsageUpdated as n, publishSessionCostUsageUpdated as r, getSessionCostUsageUpdatedAt as t };
