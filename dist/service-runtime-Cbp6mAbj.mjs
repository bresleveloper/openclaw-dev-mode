import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as isPidAlive } from "./pid-alive-CPS_shDt.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { a as assertServiceInspectionFallbackAllowed, r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
//#region src/daemon/service-runtime.ts
/** Shared daemon runtime status types and systemd cgroup hygiene helpers. */
/** Positive process observations protect serving files, but grant no service-control authority. */
function isGatewayServiceStateLive(state) {
	if (state.running || (state.runtime?.systemd?.tasksCurrent ?? 0) > 0) return true;
	const pid = state.runtime?.pid;
	if (typeof pid === "number" && Number.isSafeInteger(pid) && pid > 1 && isPidAlive(pid)) return true;
	const serviceState = state.runtime?.state?.toLowerCase() ?? "";
	const subState = state.runtime?.subState?.toLowerCase() ?? "";
	return serviceState === "deactivating" || subState === "stop-sigterm" || subState === "stop-sigkill" || subState === "final-sigterm";
}
const SERVICE_RUNTIME_INSPECTION_ERROR_MAX_CHARS = 500;
const SERVICE_RUNTIME_INSPECTION_FAILED_DETAIL = "service runtime inspection failed";
/** Keeps native probe failures bounded and diagnostic-only for status presentation owners. */
function createServiceRuntimeInspectionFailure(error, timeoutMs) {
	assertServiceInspectionFallbackAllowed(error);
	const rawDetail = error instanceof Error ? error.message : String(error);
	return {
		status: "unknown",
		...error instanceof ServiceInspectionError ? { inspectionReason: error.reason } : {},
		detail: SERVICE_RUNTIME_INSPECTION_FAILED_DETAIL,
		inspectionFailure: {
			code: "service-runtime-inspection-failed",
			detail: truncateUtf16Safe(sanitizeForLog(rawDetail), SERVICE_RUNTIME_INSPECTION_ERROR_MAX_CHARS) || "unknown error",
			...timeoutMs !== void 0 ? { timeoutMs } : {}
		}
	};
}
const SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD = 200;
const SYSTEMD_MEMORY_CURRENT_WARNING_BYTES = 2147483648;
const SYSTEMD_NO_RESTART_EXIT_STATUS = 78;
function getSystemdCgroupHygieneSummary(runtime) {
	const killMode = normalizeLowercaseStringOrEmpty(runtime?.killMode);
	if (!runtime || killMode !== "process" && killMode !== "none") return null;
	const details = [];
	if (runtime.tasksCurrent !== void 0 && Number.isSafeInteger(runtime.tasksCurrent) && runtime.tasksCurrent >= SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD) details.push(`tasks=${runtime.tasksCurrent}`);
	if (runtime.memoryCurrent !== void 0 && Number.isSafeInteger(runtime.memoryCurrent) && runtime.memoryCurrent >= SYSTEMD_MEMORY_CURRENT_WARNING_BYTES) {
		const gib = (runtime.memoryCurrent / 1024 ** 3).toFixed(1).replace(/\.0$/, "");
		details.push(`memory=${gib}GiB`);
	}
	if (details.length === 0) return null;
	return `cgroup hygiene: KillMode=${runtime.killMode}, ${details.join(", ")}`;
}
function isSystemdCgroupHygieneRisk(runtime) {
	return getSystemdCgroupHygieneSummary(runtime) !== null;
}
/** Start-limit latches need reset-failed + restart. systemd 249 retains Result=exit-code
* after real crashes, so detection also needs the restart counter; an explicit
* Result=start-limit-hit remains authoritative even after EX_CONFIG. */
function isSystemdStartLimitHit(runtime) {
	if (!runtime || normalizeLowercaseStringOrEmpty(runtime.state) !== "failed") return false;
	const systemd = runtime.systemd;
	if (!systemd) return false;
	if (normalizeLowercaseStringOrEmpty(systemd.result) === "start-limit-hit") return true;
	if (runtime.lastExitStatus === SYSTEMD_NO_RESTART_EXIT_STATUS) return false;
	return typeof systemd.startLimitBurst === "number" && systemd.startLimitBurst > 0 && typeof systemd.nRestarts === "number" && systemd.nRestarts >= systemd.startLimitBurst;
}
//#endregion
export { isSystemdStartLimitHit as a, isSystemdCgroupHygieneRisk as i, getSystemdCgroupHygieneSummary as n, isGatewayServiceStateLive as r, createServiceRuntimeInspectionFailure as t };
