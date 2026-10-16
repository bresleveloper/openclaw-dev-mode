import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match-Dn8gpf-E.mjs";
import { h as resolveAdmittedRunActiveAssertion, s as createOperationalRunInstanceRef, u as prepareAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { a as captureCronJobMessageActionAuthority, o as captureCronJobMessageSourceAuthority } from "./active-jobs-BS2UT6i2.mjs";
import { n as mintMessageActionTurnCapability, s as revokeMessageActionTurnCapability } from "./message-action-turn-capability-BbHQ1t6i.mjs";
import { i as withPostAdmissionExecutionOwnerBinding } from "./execution-owner-binding-B_XQzuKd.mjs";
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
	return {
		preparedRunAdmission,
		messageActionTurnCapability,
		close: () => {
			revokeMessageActionTurnCapability(messageActionTurnCapability);
			preparedRunAdmission.close();
		}
	};
}
//#endregion
export { prepareCronRunAdmission as t };
