import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
//#region src/plugins/host-hook-cleanup-timeout.ts
/** Max time allowed for plugin host cleanup hooks before failing shutdown. */
const PLUGIN_HOST_CLEANUP_TIMEOUT_MS = 5e3;
var PluginHostCleanupTimeoutError = class extends Error {};
/** Runs plugin host cleanup with a bounded timeout and clears the timer afterward. */
async function withPluginHostCleanupTimeout(hookId, cleanup, timeoutMs = PLUGIN_HOST_CLEANUP_TIMEOUT_MS) {
	let timeout;
	try {
		return await Promise.race([trackAsyncWork(() => Promise.resolve().then(cleanup)), new Promise((_, reject) => {
			timeout = setTimeout(() => {
				reject(new PluginHostCleanupTimeoutError(`plugin host cleanup timed out: ${hookId}`));
			}, timeoutMs);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
//#endregion
export { withPluginHostCleanupTimeout as n, PluginHostCleanupTimeoutError as t };
