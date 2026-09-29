import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { in as validateGatewaySuspendPrepareParams, on as validateGatewaySuspendResumeParams, rn as validateGatewaySuspendHandoffParams, sn as validateGatewaySuspendStatusParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as prepareGatewaySuspend, i as getGatewaySuspendStatus, s as resumeGatewaySuspend, t as armGatewaySuspendHandoff } from "./gateway-suspend-coordinator-DU88ad_C.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-DAQgwUyh.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
//#region src/gateway/server-methods/suspend.ts
function invalidParams(method) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params`);
}
function schedulerRecoveryError(retryAfterMs) {
	return errorShape(ErrorCodes.UNAVAILABLE, "gateway scheduler recovery is pending", {
		retryable: true,
		retryAfterMs,
		details: { reason: "scheduler-resume-failed" }
	});
}
const suspendHandlers = {
	"gateway.suspend.handoff": ({ respond, params, context }) => {
		if (!validateGatewaySuspendHandoffParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.handoff"));
			return;
		}
		if (params.target.pid !== process.pid || params.target.processInstanceId !== getGatewayProcessInstanceId()) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "gateway process changed after preflight"));
			return;
		}
		const owner = context.hostLifecycle?.externalRestart;
		if (!owner) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "gateway host does not own process exit"));
			return;
		}
		const result = armGatewaySuspendHandoff({
			suspensionId: params.suspensionId.trim(),
			owner
		});
		if (!result.ok) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error));
			return;
		}
		respond(true, result.value);
	},
	"gateway.suspend.prepare": async ({ respond, params, context }) => {
		if (!validateGatewaySuspendPrepareParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.prepare"));
			return;
		}
		const requestId = params.requestId.trim();
		const result = prepareGatewaySuspend({
			requestId,
			terminalPolicy: params.terminalPolicy ?? "preserve",
			...params.drain === true ? { drain: true } : {},
			pauseScheduling: () => context.cron.pauseScheduling(),
			resumeScheduling: () => context.cron.resumeScheduling(),
			inspect: createGatewayServerActiveWorkInspectors(context),
			warn: (message) => context.logGateway.warn(message)
		});
		if (result.status === "conflict") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "another gateway suspension is already prepared", {
				retryable: true,
				retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
				details: {
					reason: "gateway-suspension-conflict",
					expiresAtMs: result.expiresAtMs
				}
			}));
			return;
		}
		if (result.status === "recovering") {
			respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
			return;
		}
		respond(true, result);
	},
	"gateway.suspend.status": async ({ respond, params }) => {
		if (!validateGatewaySuspendStatusParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.status"));
			return;
		}
		const suspensionId = params.suspensionId.trim();
		const result = getGatewaySuspendStatus(suspensionId);
		if (result.status === "conflict") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "a different gateway suspension is prepared", {
				retryable: true,
				retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
				details: {
					reason: "gateway-suspension-conflict",
					expiresAtMs: result.expiresAtMs
				}
			}));
			return;
		}
		if (result.status === "recovering") {
			respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
			return;
		}
		respond(true, result);
	},
	"gateway.suspend.resume": async ({ respond, params }) => {
		if (!validateGatewaySuspendResumeParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.resume"));
			return;
		}
		const suspensionId = params.suspensionId.trim();
		const result = resumeGatewaySuspend(suspensionId);
		if (!result.ok) {
			if (result.reason === "scheduler-resume-failed") {
				respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway suspension id does not match"));
			return;
		}
		respond(true, result);
	}
};
//#endregion
export { suspendHandlers };
