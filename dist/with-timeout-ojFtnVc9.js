import os from "node:os";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
//#region src/infra/machine-name.ts
const execFileAsync = promisify(execFile);
let cachedPromise = null;
async function tryScutil(key) {
	try {
		const { stdout } = await execFileAsync("/usr/sbin/scutil", ["--get", key], {
			timeout: 1e3,
			windowsHide: true
		});
		const value = String(stdout ?? "").trim();
		return value.length > 0 ? value : null;
	} catch {
		return null;
	}
}
function fallbackHostName() {
	return os.hostname().replace(/\.local$/i, "").trim() || "openclaw";
}
async function getMachineDisplayName() {
	if (cachedPromise) return cachedPromise;
	cachedPromise = (async () => {
		if (process.env.VITEST || false) return fallbackHostName();
		if (process.platform === "darwin") {
			const computerName = await tryScutil("ComputerName");
			if (computerName) return computerName;
			const localHostName = await tryScutil("LocalHostName");
			if (localHostName) return localHostName;
		}
		return fallbackHostName();
	})();
	return cachedPromise;
}
//#endregion
//#region src/node-host/with-timeout.ts
async function withTimeout(work, timeoutMs, label) {
	const resolved = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(1, Math.floor(timeoutMs)) : void 0;
	if (!resolved) return await work(void 0);
	const abortCtrl = new AbortController();
	const timeoutError = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => abortCtrl.abort(timeoutError), resolved);
	timer.unref?.();
	let abortListener;
	const abortPromise = abortCtrl.signal.aborted ? Promise.reject(abortCtrl.signal.reason ?? timeoutError) : new Promise((_, reject) => {
		abortListener = () => reject(abortCtrl.signal.reason ?? timeoutError);
		abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
	});
	try {
		return await Promise.race([work(abortCtrl.signal), abortPromise]);
	} finally {
		clearTimeout(timer);
		if (abortListener) abortCtrl.signal.removeEventListener("abort", abortListener);
	}
}
//#endregion
export { getMachineDisplayName as n, withTimeout as t };
