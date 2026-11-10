import { Dn as validateGatewaySuspendResumeParams, Ng as errorShape, On as validateGatewaySuspendStatusParams, Tn as validateGatewaySuspendPrepareParams, wn as validateGatewaySuspendHandoffParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as getGatewaySuspendStatus, l as resumeGatewaySuspend, s as prepareGatewaySuspend, t as armGatewaySuspendHandoff } from "./gateway-suspend-coordinator-DPGYs58l.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-BrSB6v9i.mjs";
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
function respondSuspendStatus(result, context, respond, conflictMessage) {
	if (result.status === "conflict") respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, conflictMessage, {
		retryable: true,
		retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
		details: {
			reason: "gateway-suspension-conflict",
			expiresAtMs: result.expiresAtMs
		}
	}));
	else if (result.status === "recovering") respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
	else {
		if (result.status === "draining") context.logGateway.info(`DRAINING activeCount=${result.activeCount} blockers=${result.blockers.map(({ kind, count }) => `${kind}:${count}`).join(",")} holders=${JSON.stringify(result.blockers.map(({ message }) => message))} custody=${result.writeCustody?.some(({ count }) => count > 0) ? "held" : "clear"}`);
		respond(true, result);
	}
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
			owner,
			commit: params.commit
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
		respondSuspendStatus(prepareGatewaySuspend({
			requestId,
			terminalPolicy: params.terminalPolicy ?? "preserve",
			...params.drain === true ? { drain: true } : {},
			pauseScheduling: () => context.cron.pauseScheduling(),
			resumeScheduling: () => context.cron.resumeScheduling(),
			inspect: createGatewayServerActiveWorkInspectors(context),
			warn: (message) => context.logGateway.warn(message)
		}), context, respond, "another gateway suspension is already prepared");
	},
	"gateway.suspend.status": async ({ respond, params, context }) => {
		if (!validateGatewaySuspendStatusParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.status"));
			return;
		}
		const suspensionId = params.suspensionId.trim();
		respondSuspendStatus(getGatewaySuspendStatus(suspensionId, params.includeLifecycle === true), context, respond, "a different gateway suspension is prepared");
	},
	"gateway.suspend.resume": async ({ respond, params }) => {
		if (!validateGatewaySuspendResumeParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.resume"));
			return;
		}
		const suspensionId = params.suspensionId.trim();
		const result = resumeGatewaySuspend(suspensionId);
		if (!result.ok) {
			if (result.reason === "gateway-restarting") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "gateway shutdown is committed"));
				return;
			}
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
