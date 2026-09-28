import fs from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/infra/ports-lsof.ts
const LSOF_CANDIDATES = process.platform === "darwin" ? ["/usr/sbin/lsof", "/usr/bin/lsof"] : ["/usr/bin/lsof", "/usr/sbin/lsof"];
async function canExecute(path) {
	try {
		await fs$1.access(path, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveLsofCommand(signal) {
	for (const candidate of LSOF_CANDIDATES) {
		signal?.throwIfAborted();
		const executable = await canExecute(candidate);
		signal?.throwIfAborted();
		if (executable) return candidate;
	}
	return "lsof";
}
function resolveLsofCommandSync() {
	for (const candidate of LSOF_CANDIDATES) try {
		fs.accessSync(candidate, fs.constants.X_OK);
		return candidate;
	} catch {}
	return "lsof";
}
//#endregion
export { resolveLsofCommandSync as n, resolveLsofCommand as t };
