import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { accessSync, constants } from "node:fs";
//#region src/infra/child-runtime-viability.ts
function accessExecutable(execPath) {
	accessSync(execPath, constants.X_OK);
}
/** Reports whether this process can still spawn children with its own Node binary. */
function readChildRuntimeViability(params) {
	const execPath = params?.execPath ?? process.execPath;
	const access = params?.access ?? accessExecutable;
	let available = true;
	try {
		access(execPath);
	} catch (error) {
		available = !(error instanceof Error && (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")));
	}
	return {
		execPath,
		available
	};
}
/** Operator text for a Gateway whose retained Node binary is gone. */
function formatMissingChildRuntimeWarning(viability) {
	if (viability.available) return;
	return `Gateway runtime is stale after Node upgrade: child workers are using ${sanitizeTerminalText(viability.execPath)}, which no longer exists. Restart the Gateway.`;
}
/** Do not mislabel missing commands or working directories as a removed Node runtime. */
function formatChildRuntimeSpawnWarning(error) {
	if (error instanceof Error && hasErrnoCode(error, "ENOENT") && "path" in error && error.path === process.execPath) return formatMissingChildRuntimeWarning(readChildRuntimeViability());
}
//#endregion
export { formatMissingChildRuntimeWarning as n, readChildRuntimeViability as r, formatChildRuntimeSpawnWarning as t };
