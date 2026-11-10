import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
//#region src/channels/message/ingress-queue-client.ts
function resolveChannelIngressStateEnv(stateDir) {
	return stateDir ? mergeProcessEnv([process.env, { OPENCLAW_STATE_DIR: stateDir }]) : process.env;
}
//#endregion
//#region src/channels/message/ingress-queue-health-cache.ts
const caches = resolveGlobalMap(Symbol.for("openclaw.channelIngressHealth"), "close-and-restart");
registerOpenClawStateDatabaseAsyncResource({ async close() {
	caches.clear();
} });
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	for (const [key, cache] of caches) if (cache.path === (event.identity?.canonicalPath ?? event.path)) caches.delete(key);
});
function channelIngressHealthCache(context) {
	const { coordinationKey, identity } = context.admission;
	let cache = caches.get(coordinationKey);
	if (!cache) {
		cache = { path: identity.canonicalPath };
		caches.set(coordinationKey, cache);
	}
	return cache;
}
/** A settling queue mutation retires even a snapshot whose read is still in flight. */
function invalidateChannelIngressHealth(context) {
	caches.delete(context.admission.coordinationKey);
}
//#endregion
export { invalidateChannelIngressHealth as n, resolveChannelIngressStateEnv as r, channelIngressHealthCache as t };
