import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BSmCVVpP.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { s as createSessionWorkStartChangedError } from "./work-start-error-Dh9d0ImY.mjs";
import { n as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { t as everySessionTranscriptUserInputFrom } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import "./lifecycle-BH2MRg79.mjs";
import { n as sourceDeliveryTargetsMatch } from "./source-delivery-plan-DyVvloMw.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-harness-completion-scope.ts
const scopeRegistry = resolveGlobalSingleton(Symbol.for("openclaw.agentHarnessCompletionScope.registry"), () => ({ hostIssuedScopes: /* @__PURE__ */ new WeakSet() }));
/** Creates a host-issued requester scope for agent harness completion. */
function createAgentHarnessCompletionScope(params) {
	const requesterSessionKey = params.requesterSessionKey.trim();
	if (!requesterSessionKey) throw new Error("Harness completion scope requires requesterSessionKey");
	const requesterAgentId = params.requesterAgentId?.trim() || parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (!requesterAgentId) throw new Error("Harness completion scope requires an exact requester agent");
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const scope = {
		requesterSessionKey,
		requesterAgentId,
		...requesterOrigin ? { requesterOrigin } : {}
	};
	scopeRegistry.hostIssuedScopes.add(scope);
	bindGatewayContextResolver(scope, params.gatewayContextResolver);
	return scope;
}
function assertAgentHarnessCompletionScope(scope) {
	if (!scopeRegistry.hostIssuedScopes.has(scope)) throw new Error("Harness completion requires a host-issued scope");
	return scope;
}
const sourceAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.harnessCompletionSourceAdmission"), () => new AsyncLocalStorage());
/** The native source owner admits delivery; the requester receipt owns accepted recovery thereafter. */
async function withAgentHarnessCompletionAdmission(params, operation) {
	const scope = assertAgentHarnessCompletionScope(params.scope);
	let active = true;
	const assertCurrent = () => {
		if (!active || !params.isSourceCurrent()) throw new Error("Harness completion source owner retired");
	};
	assertCurrent();
	try {
		return await sourceAdmissions.run({
			...params,
			scope,
			assertCurrent
		}, operation);
	} finally {
		active = false;
	}
}
function assertHarnessCompletionSourceAdmission(params) {
	const admission = sourceAdmissions.getStore();
	if (!admission || admission.scope.requesterSessionKey !== params.requesterSessionKey || admission.scope.requesterAgentId !== params.requesterAgentId || admission.requesterSessionId !== params.requesterSessionId || admission.requesterLifecycleRevision !== params.requesterLifecycleRevision || admission.sourceSessionKey !== params.sourceSessionKey || admission.sourceRunId !== params.sourceRunId) throw new Error("Harness completion requires exact host-issued source admission");
	admission.assertCurrent();
	return admission.assertCurrent;
}
//#endregion
//#region src/agents/agent-harness-completion-recovery.ts
/** These receipts are stricter than legacy live-return classification: omission is not success. */
function hasHarnessCompletionFinalReceipt(receipt) {
	const target = receipt.deliveryContext;
	if (!target?.channel || !target.to || receipt.payloadsTruncated || receipt.messagingToolSentTargetsTruncated || receipt.messagingToolAggregateEvidenceUnaccounted) return false;
	const requiredProvider = normalizeOptionalString(target.channel)?.toLowerCase();
	if (!requiredProvider) return false;
	if (receipt.messagingToolSentTargets?.some((sent) => normalizeOptionalString(sent.provider)?.toLowerCase() === requiredProvider && normalizeOptionalString(sent.accountId) === normalizeOptionalString(target.accountId) && sent.sourceReplyFinal === true && sent.visible === true && sourceDeliveryTargetsMatch(sent, target))) return true;
	return receipt.deliveryStatus?.status === "sent" && (receipt.deliveryStatus.resultCount ?? 0) > 0 && receipt.payloads?.some((payload) => payload.visible === true) === true;
}
const admittedClaims = /* @__PURE__ */ new WeakMap();
function sameCompletionClaim(left, right) {
	return Boolean(left && left.taskId === right.taskId && left.taskRunId === right.taskRunId && left.sourceRunId === right.sourceRunId && left.requesterSessionKey === right.requesterSessionKey && left.requesterAgentId === right.requesterAgentId && left.sessionId === right.sessionId && left.lifecycleRevision === right.lifecycleRevision);
}
function captureHarnessCompletionRecovery(params) {
	const provenance = normalizeInputProvenance(params.inputProvenance);
	if (!params.runId.startsWith("announce:") || provenance?.kind !== "inter_session" || !["agent_harness_task", "agent_harness_completion"].includes(provenance.sourceTool ?? "") || provenance.sourceChannel !== "internal" || !provenance.sourceSessionKey) return;
	const assertSourceCurrent = assertHarnessCompletionSourceAdmission({
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		requesterSessionId: params.entry.sessionId,
		requesterLifecycleRevision: params.entry.lifecycleRevision,
		sourceSessionKey: provenance.sourceSessionKey,
		sourceRunId: params.runId
	});
	const claim = {
		taskId: provenance.sourceSessionKey,
		taskRunId: provenance.sourceSessionKey,
		taskStatus: "succeeded",
		sourceRunId: params.runId,
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		sessionId: params.entry.sessionId,
		...params.entry.lifecycleRevision ? { lifecycleRevision: params.entry.lifecycleRevision } : {}
	};
	admittedClaims.set(claim, assertSourceCurrent);
	return claim;
}
/** A current session incarnation and its exact admitted completion receipt own further effects. */
function getOwedHarnessCompletionTask(claim, entry) {
	if (entry.sessionId !== claim.sessionId || entry.lifecycleRevision !== claim.lifecycleRevision) return;
	if (entry.restartRecoveryTerminalDeliveryEvidence?.some((receipt) => sameCompletionClaim(receipt.harnessCompletion, claim) && hasHarnessCompletionFinalReceipt(receipt))) return;
	if (sameCompletionClaim(entry.restartRecoveryHarnessCompletion, claim) || entry.restartRecoveryTerminalDeliveryEvidence?.some((receipt) => sameCompletionClaim(receipt.harnessCompletion, claim))) return claim;
	const assertSourceCurrent = admittedClaims.get(claim);
	if (!assertSourceCurrent) return;
	try {
		assertSourceCurrent();
		return claim;
	} catch {
		return;
	}
}
/** Exact source lookup is independent of the display tail used to choose recovery policy. */
function readAdmittedHarnessCompletionInput(params) {
	const scope = {
		agentId: params.claim.requesterAgentId,
		sessionKey: params.claim.requesterSessionKey,
		sessionId: params.entry.sessionId,
		storePath: params.storePath
	};
	const priorRunIds = (params.entry.restartRecoveryRuns ?? []).filter((run) => Boolean(run.lifecycleGeneration)).map((run) => run.runId);
	const claim = params.claim;
	const allowedRunIds = new Set([params.operationalRunId, ...priorRunIds].filter(Boolean));
	let sourceChecked = false;
	return everySessionTranscriptUserInputFrom(scope, `${params.claim.sourceRunId}:user`, (message) => {
		const record = asOptionalRecord(message);
		const provenance = normalizeInputProvenance(record?.provenance);
		const annotatedRunId = asOptionalRecord(record?.["__openclaw"])?.runId;
		if (!sourceChecked) {
			sourceChecked = true;
			return record?.role === "user" && record.idempotencyKey === `${claim.sourceRunId}:user` && annotatedRunId === claim.sourceRunId && provenance?.kind === "inter_session" && provenance.sourceChannel === "internal" && ["agent_harness_task", "agent_harness_completion"].includes(provenance.sourceTool ?? "") && provenance.sourceSessionKey === claim.taskRunId;
		}
		if (record?.role !== "user") return true;
		const runId = typeof record.idempotencyKey === "string" ? [...allowedRunIds].find((id) => record.idempotencyKey === `${id}:user`) : annotatedRunId;
		return typeof runId === "string" && allowedRunIds.has(runId) && (annotatedRunId == null || annotatedRunId === runId) && provenance?.kind === "internal_system" && provenance.sourceTool === "main_session_restart_recovery" && provenance.sourceSessionKey === claim.requesterSessionKey;
	});
}
/** The existing admitted execution guard rechecks this before execution and delegated effects. */
function createHarnessCompletionSourceAssertion(params) {
	return () => {
		params.priorAssertion?.();
		const current = loadExactSessionEntry({
			agentId: params.claim.requesterAgentId,
			sessionKey: params.claim.requesterSessionKey,
			storePath: params.storePath,
			readConsistency: "latest"
		});
		if (!current || current.sessionKey !== params.claim.requesterSessionKey || !getOwedHarnessCompletionTask(params.claim, current.entry) || current.entry.restartRecoveryDeliveryRunId !== params.claim.sourceRunId && !readAdmittedHarnessCompletionInput({
			claim: params.claim,
			entry: current.entry,
			storePath: params.storePath,
			operationalRunId: current.entry.restartRecoveryDeliveryRunId
		})) throw createSessionWorkStartChangedError(params.claim.requesterSessionKey);
	};
}
//#endregion
export { readAdmittedHarnessCompletionInput as a, withAgentHarnessCompletionAdmission as c, hasHarnessCompletionFinalReceipt as i, createHarnessCompletionSourceAssertion as n, assertAgentHarnessCompletionScope as o, getOwedHarnessCompletionTask as r, createAgentHarnessCompletionScope as s, captureHarnessCompletionRecovery as t };
