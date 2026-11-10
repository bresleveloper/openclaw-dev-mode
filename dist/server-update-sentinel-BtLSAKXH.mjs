import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { _ as readRestartSentinelSnapshot, s as finalizeUpdateRestartSentinelRunningVersion } from "./restart-sentinel-BPoW-ukG.mjs";
import { o as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { n as currentUpdateCheckLifecycle } from "./update-check-lifecycle-Di8qaxGD.mjs";
//#region src/gateway/server-update-sentinel.ts
let latestUpdateRestartSentinel = null;
let refreshTail = Promise.resolve();
const preparations = /* @__PURE__ */ new WeakMap();
/** Startup and reconnects join one preparation; update producers publish later snapshots. */
async function prepareLatestUpdateRestartSentinel(env, lifecycle = currentUpdateCheckLifecycle()) {
	let preparation = preparations.get(lifecycle);
	if (!preparation) {
		preparation = lifecycle.run(async (signal) => {
			await refreshLatestUpdateRestartSentinel(env, () => lifecycle.isCurrent() && !signal.aborted);
		});
		preparations.set(lifecycle, preparation);
		preparation.catch(() => preparations.delete(lifecycle));
	}
	await preparation;
	return getLatestUpdateRestartSentinel();
}
function refreshLatestUpdateRestartSentinel(env = captureDeliveryQueueStateContext().workerContext.environment, isCurrent = () => true) {
	const refresh = refreshTail.then(async () => {
		if (!isCurrent()) return latestUpdateRestartSentinel;
		const previous = latestUpdateRestartSentinel;
		const { sentinel: current } = await readRestartSentinelSnapshot(env);
		if (!isCurrent()) return latestUpdateRestartSentinel;
		const sentinel = !current || isPendingControlPlaneUpdateRestartSentinel(current.payload) ? current : await finalizeUpdateRestartSentinelRunningVersion(void 0, env) ?? current;
		if (sentinel?.payload.kind === "update" && latestUpdateRestartSentinel === previous && isCurrent()) latestUpdateRestartSentinel = freezeJsonSnapshot(sentinel.payload);
		return latestUpdateRestartSentinel;
	});
	refreshTail = refresh.then(() => void 0, () => void 0);
	return refresh;
}
/** Readers share an immutable snapshot; publication preserves previously returned generations. */
function getLatestUpdateRestartSentinel() {
	return latestUpdateRestartSentinel;
}
function recordLatestUpdateRestartSentinel(payload) {
	latestUpdateRestartSentinel = freezeJsonSnapshot(structuredClone(payload));
}
//#endregion
export { refreshLatestUpdateRestartSentinel as i, prepareLatestUpdateRestartSentinel as n, recordLatestUpdateRestartSentinel as r, getLatestUpdateRestartSentinel as t };
