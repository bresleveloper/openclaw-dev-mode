import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { c as getAgentRunContext, d as getAgentRunLifecycleGeneration, f as hasAgentRunContextExecutionOwner } from "./agent-run-registry-DO6Dg2r0.mjs";
import { t as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { et as readSessionSubmittedInput } from "./session-accessor-l-4ZHvKn.mjs";
import { a as hasRestartRecoveryTerminalRun, n as getRestartRecoveryTerminalDeliveryEvidence } from "./restart-recovery-state-CVOwSXMV.mjs";
import { i as resolveTaskSessionAgentId } from "./task-registry-read-BpKCOEEj.mjs";
import { s as listTaskRecords } from "./task-registry-query-Cb1HIUfX.mjs";
import { o as getTaskByIdForOwner } from "./task-owner-access-D68rf-Wa.mjs";
import { a as settleHarnessCompletionTask, i as readAdmittedHarnessCompletionInput, r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-Dh-XCinc.mjs";
import { r as sourceDeliveryTargetsMatch } from "./source-delivery-plan-BH7sj5FF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-harness-completion-delivery.ts
const log = createSubsystemLogger("agents/harness-completion-recovery");
/** These receipts are stricter than legacy live-return classification: omission is not success. */
function hasHarnessCompletionFinalReceipt(receipt) {
	const target = receipt.deliveryContext;
	if (!target?.channel || !target.to || receipt.payloadsTruncated || receipt.messagingToolSentTargetsTruncated || receipt.messagingToolAggregateEvidenceUnaccounted) return false;
	const requiredProvider = normalizeOptionalString(target.channel)?.toLowerCase();
	if (!requiredProvider) return false;
	if (receipt.messagingToolSentTargets?.some((sent) => normalizeOptionalString(sent.provider)?.toLowerCase() === requiredProvider && normalizeOptionalString(sent.accountId) === normalizeOptionalString(target.accountId) && sent.sourceReplyFinal === true && sent.visible === true && sourceDeliveryTargetsMatch(sent, target))) return true;
	return receipt.deliveryStatus?.status === "sent" && (receipt.deliveryStatus.resultCount ?? 0) > 0 && receipt.payloads?.some((payload) => payload.visible === true) === true;
}
function sameRequester(claim, entry) {
	return claim.sessionId === entry.sessionId && claim.lifecycleRevision === entry.lifecycleRevision;
}
function readCurrent(target) {
	const loaded = loadExactSessionEntry({
		...target,
		readConsistency: "latest"
	});
	return loaded?.sessionKey === target.sessionKey ? loaded.entry : void 0;
}
/** Only current process owners can hold admission before its input is committed. */
function hasLiveCompletionOwner(claim, runId) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const admission = (scope?.resolveGatewayContext ? scope.resolveGatewayContext() : scope?.context)?.chatAbortControllers.get(runId);
	if (admission && admission.sessionKey === claim.requesterSessionKey && admission.sessionId === claim.sessionId && admission.agentId === claim.requesterAgentId && admission.lifecycleGeneration === getAgentRunLifecycleGeneration() && admission.projectSessionActive === true && !admission.registrationCleanupRequested && !admission.controller.signal.aborted && isFutureDateTimestampMs(admission.expiresAtMs)) return true;
	const context = getAgentRunContext(runId);
	return hasAgentRunContextExecutionOwner(runId) && context?.sessionKey === claim.requesterSessionKey && context.sessionId === claim.sessionId && context.agentId === claim.requesterAgentId;
}
/** Reconcile before any steer/direct path, including when a restored native parent has no live owner. */
function reconcileHarnessCompletionDelivery(params) {
	const entry = readCurrent(params);
	if (!entry) return "unowned";
	const receipt = getRestartRecoveryTerminalDeliveryEvidence(entry, params.sourceRunId);
	const claim = entry.restartRecoveryHarnessCompletion?.sourceRunId === params.sourceRunId ? entry.restartRecoveryHarnessCompletion : receipt?.harnessCompletion;
	if (!claim) return entry.restartRecoveryDeliverySourceRunId === params.sourceRunId || hasRestartRecoveryTerminalRun(entry, params.sourceRunId) || readSessionSubmittedInput({
		...params,
		sessionId: entry.sessionId
	}, `${params.sourceRunId}:user`) ? "blocked" : "unowned";
	if (claim.sourceRunId !== params.sourceRunId || claim.taskRunId !== params.taskRunId || claim.requesterAgentId !== params.agentId || claim.requesterSessionKey !== params.sessionKey || !sameRequester(claim, entry)) return "blocked";
	const task = getTaskByIdForOwner({
		taskId: claim.taskId,
		callerOwnerKey: claim.requesterSessionKey,
		callerAgentId: claim.requesterAgentId
	});
	if (!task || task.runId !== claim.taskRunId || task.requesterSessionKey !== claim.requesterSessionKey) return "blocked";
	if (task.deliveryStatus === "delivered") return "delivered";
	if (!getOwedHarnessCompletionTask(claim, entry)) return "blocked";
	if (isDeepStrictEqual(receipt?.harnessCompletion, claim) && receipt !== void 0 && hasHarnessCompletionFinalReceipt(receipt)) return settleHarnessCompletionTask({
		claim,
		readCurrentSession: () => readCurrent(params),
		hasQualifyingReceipt(current) {
			const actual = getRestartRecoveryTerminalDeliveryEvidence(current, claim.sourceRunId);
			return isDeepStrictEqual(actual?.harnessCompletion, claim) && actual !== void 0 && hasHarnessCompletionFinalReceipt(actual);
		}
	}) ? "delivered" : "blocked";
	if (entry.status !== "running" || entry.mainRestartRecovery?.tombstone || entry.restartRecoveryDeliverySourceRunId !== claim.sourceRunId || entry.restartRecoveryHarnessCompletion?.taskId !== claim.taskId) return "blocked";
	const operationalRunId = entry.restartRecoveryDeliveryRunId;
	try {
		if (operationalRunId && hasLiveCompletionOwner(claim, operationalRunId)) return "pending";
		return readAdmittedHarnessCompletionInput({
			claim,
			entry,
			storePath: params.storePath,
			operationalRunId
		}) ? "pending" : "blocked";
	} catch (error) {
		log.warn(`Could not inspect harness completion custody for ${params.sessionKey}: ${String(error)}`);
		return "blocked";
	}
}
/** Startup and command cleanup settle retained receipts even if no native monitor survives. No model/send. */
function reconcileRetainedHarnessCompletionDeliveries() {
	const cfg = getRuntimeConfig();
	const scopes = /* @__PURE__ */ new Map();
	for (const task of listTaskRecords()) {
		if (task.runtime !== "subagent" || !task.taskKind || task.deliveryStatus !== "pending") continue;
		const agentId = resolveTaskSessionAgentId(task.requesterSessionKey, task.requesterAgentId, cfg);
		if (!agentId) continue;
		const target = {
			agentId,
			sessionKey: task.requesterSessionKey,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
		};
		scopes.set(`${agentId}\n${target.sessionKey}`, target);
	}
	for (const target of scopes.values()) try {
		reconcileSessionHarnessCompletionDeliveries(target);
	} catch (error) {
		log.warn(`Could not reconcile harness completion for ${target.sessionKey}: ${String(error)}`);
	}
}
function reconcileSessionHarnessCompletionDeliveries(target) {
	const entry = readCurrent(target);
	for (const receipt of entry?.restartRecoveryTerminalDeliveryEvidence ?? []) if (receipt.harnessCompletion) reconcileHarnessCompletionDelivery({
		...target,
		sourceRunId: receipt.runId,
		taskRunId: receipt.harnessCompletion.taskRunId
	});
}
//#endregion
export { reconcileRetainedHarnessCompletionDeliveries as n, reconcileSessionHarnessCompletionDeliveries as r, reconcileHarnessCompletionDelivery as t };
