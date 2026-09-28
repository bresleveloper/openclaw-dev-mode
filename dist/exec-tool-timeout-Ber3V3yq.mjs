import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeExecTarget } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { r as addSafeTimeoutDelayGraceMs } from "./timeouts-D2XMKe-X.mjs";
//#region src/agents/exec-tool-timeout.ts
function resolveExecDefaultTimeoutSec(timeoutSec) {
	return timeoutSec && timeoutSec > 0 ? timeoutSec : 1800;
}
function resolveNodeExecTimeouts(timeoutSec, defaultTimeoutSec) {
	const runTimeoutSec = typeof timeoutSec === "number" && Number.isFinite(timeoutSec) ? timeoutSec : defaultTimeoutSec;
	const baseTimeoutSec = Number.isFinite(runTimeoutSec) && runTimeoutSec > 0 ? runTimeoutSec : defaultTimeoutSec;
	const invokeDeadlineMs = !Number.isFinite(baseTimeoutSec) || baseTimeoutSec <= 0 ? 1e4 : Math.max(1e4, addSafeTimeoutDelayGraceMs(baseTimeoutSec * 1e3, 5e3));
	return {
		runTimeoutMs: Number.isFinite(runTimeoutSec) && runTimeoutSec > 0 ? addSafeTimeoutDelayGraceMs(runTimeoutSec * 1e3, 0, { minMs: 0 }) : 0,
		invokeDeadlineMs,
		invokeWaitMs: addSafeTimeoutDelayGraceMs(invokeDeadlineMs, 5e3)
	};
}
function createExecToolExecutionTimeoutResolver(defaults) {
	const defaultTimeoutSec = resolveExecDefaultTimeoutSec(defaults?.timeoutSec);
	const defaultHost = defaults?.host;
	return (args) => {
		const params = asNonArrayRecord(args);
		const requestedHost = normalizeExecTarget(typeof params.host === "string" ? params.host : void 0);
		if ((requestedHost && requestedHost !== "auto" ? requestedHost : defaultHost) !== "node") return;
		return resolveNodeExecTimeouts(typeof params.timeoutSeconds === "number" ? params.timeoutSeconds : void 0, defaultTimeoutSec).invokeWaitMs;
	};
}
//#endregion
export { resolveExecDefaultTimeoutSec as n, resolveNodeExecTimeouts as r, createExecToolExecutionTimeoutResolver as t };
