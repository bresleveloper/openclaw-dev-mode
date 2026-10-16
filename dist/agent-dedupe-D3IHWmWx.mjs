import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { i as setGatewayDedupeEntry } from "./agent-job-BgXCyRm3.mjs";
//#region src/gateway/agent-turn/agent-dedupe.ts
var AgentRequestReservationEndedError = class extends Error {
	constructor() {
		super("Agent request reservation is no longer active.");
	}
};
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
function resolveAgentWaitSource(context, runId) {
	const activeChatEntry = context.chatAbortControllers.get(runId);
	if (activeChatEntry) return activeChatEntry.kind === "agent" ? "agent" : "chat";
	return isAcceptedAgentDedupePayload(context.dedupe.get(`agent:${runId}`)?.payload) ? "agent" : void 0;
}
function isPreRegistrationAbortedAgentDedupePayload(payload) {
	const stopReason = payload?.stopReason;
	return typeof payload === "object" && payload !== null && payload.status === "timeout" && (stopReason === "rpc" || stopReason === "stop");
}
function isPreRegistrationAbortedAgentDedupeEntryForSession(params) {
	if (!params.entry?.ok || !isPreRegistrationAbortedAgentDedupePayload(params.entry.payload)) return false;
	const payload = params.entry.payload;
	const payloadRunId = normalizeOptionalString(payload.runId);
	if (payloadRunId && payloadRunId !== params.runId) return false;
	const payloadSessionKey = normalizeOptionalString(payload.sessionKey);
	const payloadAgentId = normalizeOptionalString(payload.agentId);
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
function buildAbortedAgentPayload(runId, stopReason, session) {
	return {
		runId,
		...session?.agentId ? { agentId: session.agentId } : {},
		...session?.sessionKey ? { sessionKey: session.sessionKey } : {},
		status: "timeout",
		summary: "aborted",
		stopReason,
		timeoutPhase: "queue",
		providerStarted: false
	};
}
function setAbortedAgentDedupeEntries(params) {
	setGatewayDedupeEntries({
		dedupe: params.dedupe,
		keys: params.keys,
		session: params.session,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: buildAbortedAgentPayload(params.runId, params.stopReason, params)
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
	], {
		cached: true,
		...cached.incognito && cached.error ? { errorMessage: "Incognito agent error." } : {}
	});
	return true;
}
//#endregion
export { readGatewayDedupeEntry as a, resolveAgentWaitSource as c, isPreRegistrationAbortedAgentDedupeEntryForSession as i, setAbortedAgentDedupeEntries as l, buildAbortedAgentPayload as n, replayAgentTurnIfCached as o, isAcceptedAgentDedupePayload as r, resolveAgentDedupeKeys as s, AgentRequestReservationEndedError as t, setGatewayDedupeEntries as u };
