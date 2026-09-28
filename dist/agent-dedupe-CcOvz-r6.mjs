import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { b as consumeSessionWorkAdmissionHandoff } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { r as setGatewayDedupeEntry } from "./agent-job-VGCbW4db.mjs";
//#region src/gateway/server-methods/agent-expected-session.ts
var ExpectedExistingSessionChangedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ExpectedExistingSessionChangedError";
	}
};
function resolveExpectedExistingSessionConstraint(params) {
	const sessionId = normalizeOptionalString(params.expectedExistingSessionId);
	if (!sessionId) return { ok: true };
	if (!params.canUseInternalRuntimeHandoff) return {
		ok: false,
		error: "expectedExistingSessionId is reserved for backend callers."
	};
	const handoffId = normalizeOptionalString(params.internalRuntimeHandoffId);
	return {
		ok: true,
		constraint: {
			sessionId,
			...handoffId ? { handoffId } : {}
		}
	};
}
function validateExpectedExistingSessionTarget(params) {
	if (!params.constraint) return;
	if (!params.requestedSessionKey) return "expectedExistingSessionId requires an explicit session key.";
	if (params.requestedSessionId && params.requestedSessionId !== params.constraint.sessionId) return "conflicting session identity constraints.";
}
function assertExpectedExistingSession(params) {
	if (params.constraint && params.entry?.sessionId !== params.constraint.sessionId) throw new ExpectedExistingSessionChangedError(params.message);
}
function consumeExpectedSessionWorkAdmission(params) {
	const handoffId = params.constraint?.handoffId;
	if (!handoffId) return;
	const lease = consumeSessionWorkAdmissionHandoff({
		handoffId,
		scope: params.scope,
		identities: params.identities,
		onInterrupt: params.onInterrupt
	});
	if (!lease) throw new Error("session work admission handoff is unavailable");
	return lease;
}
//#endregion
//#region src/gateway/agent-turn/agent-dedupe.ts
function resolveAgentDedupeKeys(params) {
	const keys = [`agent:${params.idempotencyKey}`];
	const approvalId = params.execApprovalFollowupApprovalId?.trim();
	if (approvalId) keys.push(`agent:exec-approval-followup:${approvalId}`);
	return uniqueStrings(keys);
}
function readGatewayDedupeEntry(params) {
	for (const key of params.keys) {
		const entry = params.dedupe.get(key);
		if (entry) return entry;
	}
}
function isAcceptedAgentDedupePayload(payload) {
	return typeof payload === "object" && payload !== null && payload.status === "accepted";
}
function isPreRegistrationAbortedAgentDedupePayload(payload) {
	const stopReason = payload?.stopReason;
	return typeof payload === "object" && payload !== null && payload.status === "timeout" && (stopReason === "rpc" || stopReason === "stop");
}
function isPreRegistrationAbortedAgentDedupeEntryForSession(params) {
	if (!params.entry?.ok || !isPreRegistrationAbortedAgentDedupePayload(params.entry.payload)) return false;
	const payload = params.entry.payload;
	const payloadRunId = typeof payload.runId === "string" ? payload.runId.trim() : "";
	if (payloadRunId && payloadRunId !== params.runId) return false;
	const payloadSessionKey = typeof payload.sessionKey === "string" && payload.sessionKey.trim() ? payload.sessionKey.trim() : void 0;
	const payloadAgentId = typeof payload.agentId === "string" && payload.agentId.trim() ? payload.agentId.trim() : void 0;
	if (params.agentId && payloadAgentId !== params.agentId) return false;
	const expectedSessionKeys = new Set([params.sessionKey, ...params.alternateSessionKeys ?? []].filter((value) => Boolean(value?.trim())));
	return !payloadSessionKey || expectedSessionKeys.size === 0 || expectedSessionKeys.has(payloadSessionKey);
}
function setGatewayDedupeEntries(params) {
	for (const key of params.keys) setGatewayDedupeEntry({
		dedupe: params.dedupe,
		key,
		entry: params.entry,
		startNewAttempt: params.startNewAttempt,
		session: params.session
	});
}
function setAbortedAgentDedupeEntries(params) {
	setGatewayDedupeEntries({
		dedupe: params.dedupe,
		keys: params.keys,
		session: params.session,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: {
				runId: params.runId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				status: "timeout",
				summary: "aborted",
				stopReason: params.stopReason,
				timeoutPhase: "queue",
				providerStarted: false
			}
		}
	});
}
function replayAgentTurnIfCached(params) {
	const { agentDedupeKeys, runId } = params.preflight;
	const cached = readGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		keys: agentDedupeKeys
	});
	if (!cached) return false;
	if (params.acceptedOnly && !(cached.ok && isAcceptedAgentDedupePayload(cached.payload))) return false;
	if (params.acceptedOnly && isAcceptedAgentDedupePayload(cached.payload) && !cached.payload.reservationId && !params.context.chatAbortControllers.has(runId)) return false;
	if (cached.ok && isAcceptedAgentDedupePayload(cached.payload)) {
		const cachedRunId = normalizeOptionalString(cached.payload.runId) ?? runId;
		const cachedSessionKey = normalizeOptionalString(cached.payload.sessionKey);
		const cachedAgentId = normalizeOptionalString(cached.payload.agentId);
		const cachedRuntime = asOptionalRecord(cached.payload.runtime);
		const admissionPending = typeof cached.payload.reservationId === "string";
		params.io.emitAcceptance([
			true,
			{
				runId: cachedRunId,
				status: "in_flight",
				...cachedSessionKey ? { sessionKey: cachedSessionKey } : {},
				...cachedAgentId ? { agentId: cachedAgentId } : {},
				...cachedRuntime ? { runtime: cachedRuntime } : {},
				...admissionPending ? { admissionPending: true } : {}
			},
			void 0
		], {
			cached: true,
			runId: cachedRunId
		});
	} else params.io.emitAcceptance([
		cached.ok,
		cached.payload,
		cached.error
	], { cached: true });
	return true;
}
//#endregion
export { resolveAgentDedupeKeys as a, ExpectedExistingSessionChangedError as c, resolveExpectedExistingSessionConstraint as d, validateExpectedExistingSessionTarget as f, replayAgentTurnIfCached as i, assertExpectedExistingSession as l, isPreRegistrationAbortedAgentDedupeEntryForSession as n, setAbortedAgentDedupeEntries as o, readGatewayDedupeEntry as r, setGatewayDedupeEntries as s, isAcceptedAgentDedupePayload as t, consumeExpectedSessionWorkAdmission as u };
