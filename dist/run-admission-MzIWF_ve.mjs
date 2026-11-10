import { f as bindGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match--5jlhAPZ.mjs";
import { l as revokeMessageActionTurnCapability, r as mintMessageActionTurnCapability } from "./message-action-turn-capability-CbQswcwc.mjs";
import { _ as resolveAdmittedRunActiveAssertion, c as createOperationalRunInstanceRef, f as prepareAgentRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import { a as captureCronJobMessageActionAuthority, c as captureCronJobStandingGrantAuthority, o as captureCronJobMessageSourceAuthority } from "./active-jobs-CqHAjCGh.mjs";
import { a as drainAgentRunTerminalWrites } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import { t as withPostAdmissionExecutionOwnerBinding } from "./execution-owner-binding-BvQBCWNm.mjs";
//#region src/cron/run-admission.ts
/** Owns one cron tool admission and its private message grant through settlement. */
function prepareCronRunAdmission(params) {
	const { runId, scheduledToolPolicy } = params;
	const operationalRunInstance = createOperationalRunInstanceRef(runId);
	const resolveGatewayContext = params.resolveGatewayContext ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	let assertAdmitted;
	const basePreparedRunAdmission = prepareAgentRunAdmission({
		operationalRunInstance,
		admissionSource: params.admissionSource,
		assertSourceCurrent: params.assertSourceCurrent,
		operatorAuthority: params.operatorAuthority,
		cfg: params.cfg,
		facts: {
			runId,
			agentId: params.agentId,
			ingress: params.executionIdentity?.ingress ?? {
				kind: "schedule",
				boundary: params.ingressBoundary ?? "cron.isolated-agent",
				state: "present"
			},
			...params.executionIdentity?.invoker ? { invoker: params.executionIdentity.invoker } : {}
		},
		onAdmitted: (admitted) => {
			bindGatewayContextResolver(admitted, resolveGatewayContext);
			assertAdmitted = resolveAdmittedRunActiveAssertion(admitted);
			params.onAdmitted?.(admitted);
		}
	});
	const preparedRunAdmission = params.executionIdentity?.onPostAdmission ? withPostAdmissionExecutionOwnerBinding(basePreparedRunAdmission, params.executionIdentity.onPostAdmission) : basePreparedRunAdmission;
	const scheduledMessageAuthority = scheduledToolPolicy && isRuntimeToolAllowed("message", params.toolsAllow) ? captureCronJobMessageActionAuthority({
		jobId: params.jobId,
		operationalRunInstance
	}) : void 0;
	const scheduledMessageSourceAuthority = scheduledMessageAuthority ? captureCronJobMessageSourceAuthority({
		jobId: params.jobId,
		operationalRunInstance
	}) : void 0;
	const deliveryAttemptFence = params.deliveryAttemptFence;
	if (scheduledMessageAuthority && !deliveryAttemptFence) {
		preparedRunAdmission.close();
		throw new Error("scheduled message authority requires its occurrence delivery fence");
	}
	const messageActionTurnCapability = deliveryAttemptFence ? mintMessageActionTurnCapability({
		agentId: params.agentId,
		runId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		requesterAccountId: scheduledMessageAuthority && scheduledToolPolicy?.mode === "account" ? scheduledToolPolicy.ownerAccountId : void 0,
		deliveryAttempt: {
			beforeAttempt: () => deliveryAttemptFence.beforeAttempt(),
			assertCurrent: () => {
				if (!assertAdmitted) throw new Error("cron message delivery requires its admitted run");
				assertAdmitted();
				deliveryAttemptFence.assertCurrent();
			}
		},
		...scheduledMessageAuthority && scheduledToolPolicy ? { scheduled: {
			policy: scheduledToolPolicy,
			assertCurrent: scheduledMessageAuthority,
			...scheduledMessageSourceAuthority ? { assertSourceCurrent: scheduledMessageSourceAuthority } : {},
			...params.channelRequester ? { channelRequester: params.channelRequester } : {}
		} } : {},
		expiresWithRun: true
	}) : void 0;
	const close = () => {
		revokeMessageActionTurnCapability(messageActionTurnCapability);
		preparedRunAdmission.close();
	};
	return {
		preparedRunAdmission,
		standingGrantAuthority: captureCronJobStandingGrantAuthority({
			jobId: params.jobId,
			operationalRunInstance
		}),
		messageActionTurnCapability,
		close,
		finish: async () => {
			await drainAgentRunTerminalWrites(preparedRunAdmission.operationalRunInstance).finally(close);
		}
	};
}
//#endregion
export { prepareCronRunAdmission as t };
