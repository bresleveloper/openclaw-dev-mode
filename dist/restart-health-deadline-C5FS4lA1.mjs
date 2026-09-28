import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-BXzjx6E8.mjs";
//#region src/cli/daemon-cli/restart-health-deadline.ts
var GatewayRestartDeadlineError = class extends Error {
	constructor(phase) {
		super(`Gateway restart observation timed out during ${phase}.`);
		this.phase = phase;
		this.name = "GatewayRestartDeadlineError";
	}
};
/** One monotonic deadline covers setup, health, and reconciliation reads. */
function createGatewayRestartDeadline(params) {
	const startedAtMs = performance.now();
	const deadlineMs = startedAtMs + params.timeoutMs;
	const controller = new AbortController();
	let activePhase;
	let lastPhase = "setup";
	let expiredPhase;
	let expiredElapsedMs;
	let cleanupStatus;
	let cleanup;
	const expired = new Promise((_resolve, reject) => {
		controller.signal.addEventListener("abort", () => reject(toErrorObject(controller.signal.reason, "Gateway restart observation canceled.")), { once: true });
	});
	expired.catch(() => void 0);
	const expire = () => {
		if (!controller.signal.aborted) {
			expiredPhase = activePhase ?? lastPhase;
			expiredElapsedMs = Math.round(Math.max(0, performance.now() - startedAtMs));
			controller.abort(new GatewayRestartDeadlineError(expiredPhase));
		}
	};
	const cancelTimer = scheduleAbsoluteDeadline(deadlineMs, expire, () => performance.now());
	const cancelFromCaller = () => controller.abort(params.signal?.reason);
	params.signal?.addEventListener("abort", cancelFromCaller, { once: true });
	if (params.signal?.aborted) cancelFromCaller();
	return {
		deadlineMs,
		signal: controller.signal,
		get phase() {
			return activePhase ?? lastPhase;
		},
		get expiredPhase() {
			return expiredPhase;
		},
		get timeout() {
			return expiredPhase === void 0 || expiredElapsedMs === void 0 ? void 0 : {
				phase: expiredPhase,
				elapsedMs: expiredElapsedMs
			};
		},
		get cleanupStatus() {
			return cleanupStatus;
		},
		get cleanup() {
			return cleanup;
		},
		elapsedMs: () => Math.max(0, performance.now() - startedAtMs),
		remainingMs: () => Math.max(0, deadlineMs - performance.now()),
		async run(operation) {
			return await this.read("settlement", () => {
				cleanupStatus = "pending";
				const work = withCommandProcessScope(operation, controller.signal);
				cleanup = work.then(() => cleanupStatus = "confirmed", (error) => cleanupStatus = hasCommandProcessCleanupError(error) ? "unknown" : "confirmed");
				return work;
			});
		},
		async read(readPhase, operation) {
			const previousPhase = activePhase;
			activePhase = readPhase;
			try {
				if (performance.now() >= deadlineMs) expire();
				controller.signal.throwIfAborted();
				const result = await Promise.race([expired, operation()]);
				if (performance.now() >= deadlineMs) expire();
				controller.signal.throwIfAborted();
				return result;
			} finally {
				activePhase = previousPhase;
				lastPhase = readPhase;
			}
		},
		dispose() {
			cancelTimer();
			params.signal?.removeEventListener("abort", cancelFromCaller);
			controller.abort(/* @__PURE__ */ new Error("Gateway restart observation finished."));
		}
	};
}
//#endregion
export { createGatewayRestartDeadline as n, GatewayRestartDeadlineError as t };
