import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { i as isPidAlive } from "./pid-alive-dd7OR8F6.mjs";
import { o as assertServiceInspectionFallbackAllowed, r as ServiceInspectionError } from "./service-inspection-error-ozNMOrIE.mjs";
//#region src/daemon/service-runtime.ts
/** Native start policy is diagnostic; it never establishes process or definition ownership. */
function resolveSystemdServiceStartRefusal(facts) {
	const command = facts.scope === "system" ? "sudo systemctl --system" : "systemctl --user";
	const unit = facts.unit;
	if (facts.loadState === "masked" || ["masked", "masked-runtime"].includes(facts.unitFileState ?? "")) return {
		reason: "masked",
		message: `Service ${unit} is masked. Run \`${command} unmask ${unit}\`, then retry.`
	};
	if (facts.refuseManualStart === true) return {
		reason: "refuse-manual-start",
		message: `Service ${unit} has RefuseManualStart=yes. Inspect \`${command} cat ${unit}\`, remove the maintenance restriction, run \`${command} daemon-reload\`, then retry.`
	};
	if (facts.unitFileState === "disabled" && facts.activeState === "inactive" && facts.canStart === false) return {
		reason: "disabled-no-start",
		message: `Service ${unit} is disabled and inactive with no start path (CanStart=no). Repair its definition using \`${command} cat ${unit}\`, run \`${command} daemon-reload\`, then retry.`
	};
}
/** Positive process observations protect serving files, but grant no service-control authority. */
function isGatewayServiceStateLive(state) {
	if (state.running || (state.runtime?.systemd?.tasksCurrent ?? 0) > 0) return true;
	const pid = state.runtime?.pid;
	if (typeof pid === "number" && Number.isSafeInteger(pid) && pid > 1 && isPidAlive(pid)) return true;
	const serviceState = state.runtime?.state?.toLowerCase() ?? "";
	const subState = state.runtime?.subState?.toLowerCase() ?? "";
	return serviceState === "deactivating" || subState === "stop-sigterm" || subState === "stop-sigkill" || subState === "final-sigterm";
}
const SERVICE_RUNTIME_INSPECTION_FAILED_DETAIL = "service runtime inspection failed";
function formatServiceInspectionDetail(error) {
	const rawDetail = error instanceof Error ? error.message : String(error);
	return truncateUtf16Safe(sanitizeForLog(rawDetail), 500);
}
/** Keeps native probe failures bounded and diagnostic-only for status presentation owners. */
function createServiceRuntimeInspectionFailure(error, timeoutMs) {
	assertServiceInspectionFallbackAllowed(error);
	return {
		status: "unknown",
		...error instanceof ServiceInspectionError ? { inspectionReason: error.reason } : {},
		detail: SERVICE_RUNTIME_INSPECTION_FAILED_DETAIL,
		inspectionFailure: {
			code: "service-runtime-inspection-failed",
			detail: formatServiceInspectionDetail(error) || "unknown error",
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
export { isSystemdCgroupHygieneRisk as a, isGatewayServiceStateLive as i, formatServiceInspectionDetail as n, isSystemdStartLimitHit as o, getSystemdCgroupHygieneSummary as r, resolveSystemdServiceStartRefusal as s, createServiceRuntimeInspectionFailure as t };
