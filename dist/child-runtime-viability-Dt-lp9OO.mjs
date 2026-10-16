import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { accessSync, constants } from "node:fs";
//#region src/infra/child-runtime-viability.ts
function accessExecutable(execPath) {
	accessSync(execPath, constants.X_OK);
}
/** Reports whether this process can still spawn children with its own Node binary. */
function readChildRuntimeViability(params) {
	const execPath = params?.execPath ?? process.execPath;
	const access = params?.access ?? accessExecutable;
	try {
		access(execPath);
		return {
			execPath,
			available: true
		};
	} catch (error) {
		if (error instanceof Error && (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR"))) return {
			execPath,
			available: false
		};
		return {
			execPath,
			available: true
		};
	}
}
/** Operator text for a Gateway whose retained Node binary is gone. */
function formatMissingChildRuntimeWarning(viability) {
	if (viability.available) return;
	return `Gateway runtime is stale after Node upgrade: child workers are using ${sanitizeTerminalText(viability.execPath)}, which no longer exists. Restart the Gateway.`;
}
//#endregion
export { readChildRuntimeViability as n, formatMissingChildRuntimeWarning as t };
