import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import os from "node:os";
//#region src/infra/machine-name.ts
let cachedPromise = null;
async function tryScutil(key) {
	try {
		const { stdout } = await runExec("/usr/sbin/scutil", ["--get", key], {
			logOutput: false,
			timeoutMs: 1e3
		});
		return normalizeNullableString(stdout);
	} catch {
		return null;
	}
}
function fallbackHostName() {
	return (normalizeNullableString(os.hostname()) ?? "").replace(/\.local$/i, "") || "openclaw";
}
/** Resolve a user-facing name for the current machine. */
async function getMachineDisplayName() {
	if (cachedPromise) return cachedPromise;
	cachedPromise = (async () => {
		if (process.env.VITEST || false) return fallbackHostName();
		if (process.platform === "darwin") return await tryScutil("ComputerName") ?? await tryScutil("LocalHostName") ?? fallbackHostName();
		return fallbackHostName();
	})();
	return cachedPromise;
}
//#endregion
export { getMachineDisplayName as t };
