import { N as resolveOptionalIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/run-cleanup-timeout.ts
/**
* Agent cleanup timeout guard.
*
* Bounds cleanup without certifying automatic ownership after timeout or failure.
*/
const oneShotCleanup = resolveGlobalSingleton(Symbol.for("openclaw.oneShotCleanupOutcome"), () => new AsyncLocalStorage());
function recordAgentCleanupFailure() {
	const receipt = oneShotCleanup.getStore();
	if (receipt) receipt.uncertain = true;
}
function createAgentCleanupScope() {
	const receipt = { uncertain: false };
	return {
		get outcome() {
			return receipt.uncertain ? "uncertain" : "closed";
		},
		async run(operation) {
			const parent = oneShotCleanup.getStore();
			try {
				return await oneShotCleanup.run(receipt, operation);
			} finally {
				if (receipt.uncertain && parent) parent.uncertain = true;
			}
		}
	};
}
const AGENT_CLEANUP_STEP_TIMEOUT_MS = 1e4;
const AGENT_CLEANUP_STEP_TIMEOUT_ENV = "OPENCLAW_AGENT_CLEANUP_TIMEOUT_MS";
const TRAJECTORY_FLUSH_TIMEOUT_ENV = "OPENCLAW_TRAJECTORY_FLUSH_TIMEOUT_MS";
const CLEANUP_TIMEOUT_DETAILS_MAX_CHARS = 512;
const CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX = "...[truncated]";
function resolveCleanupTimeoutDetails(getTimeoutDetails) {
	try {
		const timeoutDetails = getTimeoutDetails?.()?.trim();
		return timeoutDetails ? ` details=${truncateCleanupTimeoutDetails(timeoutDetails)}` : "";
	} catch (error) {
		return ` detailsError=${truncateCleanupTimeoutDetails(formatErrorMessage(error))}`;
	}
}
function truncateCleanupTimeoutDetails(value) {
	if (value.length <= CLEANUP_TIMEOUT_DETAILS_MAX_CHARS) return value;
	return `${truncateUtf16Safe(value, Math.max(0, 498))}${CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX}`;
}
function resolveAgentCleanupStepTimeoutMs(params) {
	const explicitTimeoutMs = resolveOptionalIntegerOption(params.timeoutMs, { min: 1 });
	if (explicitTimeoutMs !== void 0) return explicitTimeoutMs;
	const env = params.env ?? process.env;
	if (params.step === "openclaw-trajectory-flush") {
		const trajectoryTimeoutMs = parseStrictPositiveInteger(env[TRAJECTORY_FLUSH_TIMEOUT_ENV]);
		if (trajectoryTimeoutMs !== void 0) return trajectoryTimeoutMs;
	}
	return parseStrictPositiveInteger(env[AGENT_CLEANUP_STEP_TIMEOUT_ENV]) ?? AGENT_CLEANUP_STEP_TIMEOUT_MS;
}
/** Preserve the owner's errors while bounding automatic one-shot resource settlement. */
async function runOwnedAgentCleanup(params) {
	if (!params.oneShotCliRun) {
		try {
			await params.cleanup();
		} catch (error) {
			recordAgentCleanupFailure();
			throw error;
		}
		return;
	}
	const outcome = await settleAgentCleanupStep({
		runId: params.runId,
		sessionId: params.sessionId,
		step: params.step,
		log: params.log,
		cleanup: params.cleanup
	});
	if (typeof outcome === "object") throw outcome.error;
	if (outcome === "timeout" && params.settlement === "required") throw new Error(`Agent cleanup timed out before ${params.step} settled; resource replacement refused.`);
}
/** Run one cleanup step with timeout logging and late-rejection handling. */
async function runAgentCleanupStep(params) {
	await settleAgentCleanupStep(params);
}
async function settleAgentCleanupStep(params) {
	const timeoutMs = resolveAgentCleanupStepTimeoutMs({
		step: params.step,
		timeoutMs: params.timeoutMs,
		env: params.env
	});
	let timeoutHandle;
	let timedOut = false;
	const observedCleanupPromise = Promise.resolve().then(params.cleanup).then(() => "done").catch((error) => {
		recordAgentCleanupFailure();
		const phase = timedOut ? "rejected after timeout" : "failed";
		params.log.warn(`agent cleanup ${phase}: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`);
		return { error };
	});
	trackAsyncWork(() => observedCleanupPromise).catch(() => {});
	const timeoutPromise = new Promise((resolve) => {
		timeoutHandle = setTimeout(() => {
			timedOut = true;
			resolve("timeout");
		}, timeoutMs);
		timeoutHandle.unref?.();
	});
	const result = await Promise.race([observedCleanupPromise, timeoutPromise]);
	if (timeoutHandle) clearTimeout(timeoutHandle);
	if (result === "timeout") {
		recordAgentCleanupFailure();
		const details = resolveCleanupTimeoutDetails(params.getTimeoutDetails);
		params.log.warn(`agent cleanup timed out: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} timeoutMs=${timeoutMs}${details}`);
	}
	return result;
}
//#endregion
export { runOwnedAgentCleanup as i, recordAgentCleanupFailure as n, runAgentCleanupStep as r, createAgentCleanupScope as t };
