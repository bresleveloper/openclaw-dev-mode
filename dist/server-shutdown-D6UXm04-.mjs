import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as markGatewayRestartTrace, o as measureGatewayRestartTrace } from "./restart-trace-CoBpLImx.mjs";
//#region src/gateway/server-shutdown.ts
/** Create a timeout promise plus cleanup hook for shutdown races. */
function createGatewayShutdownTimeout(timeoutMs, onTimeout) {
	const { promise, resolve } = createDeferredCore();
	const timer = setTimeout(() => resolve(onTimeout()), timeoutMs);
	timer.unref?.();
	return {
		promise,
		clear: () => clearTimeout(timer)
	};
}
/** Record a shutdown warning once. */
function recordGatewayShutdownWarning(warnings, name) {
	if (!warnings.includes(name)) warnings.push(name);
}
/** Shutdown is published before ingress closes; absent restart metadata stays absent. */
function resolveGatewayShutdownNotice(options) {
	const restartExpectedMs = options?.restartExpectedMs;
	return {
		reason: normalizeOptionalString(options?.reason) || "gateway stopping",
		...typeof restartExpectedMs === "number" && Number.isFinite(restartExpectedMs) ? { restartExpectedMs: Math.max(0, Math.floor(restartExpectedMs)) } : {}
	};
}
/** Collect owner failures, but never release dependencies beyond a failed required join. */
async function runGatewayShutdownSteps(params) {
	const errors = [];
	for (const step of params.steps) try {
		const phase = `shutdown.${step.name.replace(/\s+/gu, "-")}`;
		markGatewayRestartTrace(`${phase}.begin`);
		await measureGatewayRestartTrace(phase, () => step.run());
	} catch (error) {
		const message = `shutdown step failed (${step.name}): ${formatErrorMessage(error)}`;
		params.onError(message);
		errors.push(new Error(message, { cause: error }));
		if (step.required) break;
	}
	if (errors.length > 0) throw new AggregateError(errors, "Gateway shutdown did not complete cleanly");
}
/** Startup failure and public close share the same ordered dependency joins. */
function runGatewayCloseSteps(params) {
	const { owner } = params;
	return runGatewayShutdownSteps({
		steps: [
			{
				name: "connection-dependent sidecars",
				run: owner.stopConnectionDependentSidecars,
				required: true
			},
			{
				name: "received connection work",
				run: () => owner.connectionWork.drain(),
				required: true
			},
			...params.disposeTerminalSessions ? [{
				name: "terminal sessions",
				run: params.disposeTerminalSessions
			}] : [],
			{
				name: "gateway lifetime sidecars",
				run: owner.stopRegisteredGatewayLifetimeSidecars
			},
			{
				name: "post-ready sidecars",
				run: owner.stopRegisteredPostReadySidecars
			},
			...params.runStopHooks ? [{
				name: "gateway_stop plugin hooks",
				run: params.runStopHooks
			}] : [],
			{
				name: "gateway close prelude",
				run: owner.runClosePrelude
			},
			{
				name: "late sidecar cleanup",
				run: owner.sealAndJoinRegisteredSidecarStops,
				required: true
			},
			{
				name: "gateway close",
				run: params.close
			}
		],
		onError: params.onError
	});
}
/** Failed acquisition retains its owner when native cleanup cannot finish. */
var GatewayStartupCleanupError = class extends AggregateError {
	constructor(startupError, cleanupError) {
		super([startupError, cleanupError], "Gateway startup failed and cleanup did not complete", { cause: startupError });
		this.name = "GatewayStartupCleanupError";
	}
};
async function rethrowGatewayStartupError(error, cleanup) {
	try {
		await cleanup();
	} catch (cleanupError) {
		throw new GatewayStartupCleanupError(error, cleanupError);
	}
	throw error;
}
//#endregion
export { rethrowGatewayStartupError as a, resolveGatewayShutdownNotice as i, createGatewayShutdownTimeout as n, runGatewayCloseSteps as o, recordGatewayShutdownWarning as r, GatewayStartupCleanupError as t };
