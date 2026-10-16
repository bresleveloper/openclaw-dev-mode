import { S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./routing-CEr1aXk1.mjs";
import "./runtime-config-snapshot-DgZgcXUX.mjs";
import { i as resolveBrowserConfig } from "./config-DQZ6ubGi.mjs";
import { i as sweepTrackedBrowserTabs } from "./session-tab-registry-CuMK0Fte.mjs";
//#region extensions/browser/src/browser/session-tab-cleanup.ts
const MIN_SWEEP_INTERVAL_MS = 6e4;
function minutesToMs(minutes) {
	return Math.max(0, Math.floor(minutes * 6e4));
}
/** Returns true for user-facing sessions whose tabs should be tracked for cleanup. */
function isPrimaryTrackedBrowserSessionKey(sessionKey) {
	return !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey) && !isAcpSessionKey(sessionKey);
}
function resolveBrowserTabCleanupRuntimeConfig() {
	const cfg = getRuntimeConfig();
	return resolveBrowserConfig(cfg.browser, cfg).tabCleanup;
}
function startTrackedBrowserTabCleanupTimer(params) {
	let stopped = false;
	let timer = null;
	let running = null;
	const schedule = () => {
		if (stopped || params.isCurrent?.() === false) return;
		let sweepMinutes = 5;
		try {
			sweepMinutes = resolveBrowserTabCleanupRuntimeConfig().sweepMinutes;
		} catch (err) {
			params.onWarn(`failed to resolve browser tab cleanup config: ${String(err)}`);
		}
		timer = setTimeout(run, Math.max(MIN_SWEEP_INTERVAL_MS, minutesToMs(sweepMinutes)));
		timer.unref?.();
	};
	const run = () => {
		if (stopped || params.isCurrent?.() === false) return;
		running = (async () => {
			const cleanup = resolveBrowserTabCleanupRuntimeConfig();
			await sweepTrackedBrowserTabs({
				idleMs: cleanup.enabled ? minutesToMs(cleanup.idleMinutes) : void 0,
				maxTabsPerSession: cleanup.enabled ? cleanup.maxTabsPerSession : void 0,
				ordinaryCleanup: cleanup.enabled,
				sessionFilter: isPrimaryTrackedBrowserSessionKey,
				...params
			});
		})().catch((error) => {
			params.onWarn(`failed to sweep tracked browser tabs: ${String(error)}`);
		}).finally(() => {
			running = null;
			schedule();
		});
	};
	schedule();
	return async () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		await running?.catch(() => {});
	};
}
//#endregion
export { startTrackedBrowserTabCleanupTimer };
