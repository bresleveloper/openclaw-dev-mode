import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-De4L8VNW.mjs";
import { t as listSessionParticipantsReadOnly } from "./session-accessor.sqlite-participant-read-08BSu6BD.mjs";
//#region src/config/sessions/session-memory-targets.ts
function projectSessionMetadata(instance, participants = []) {
	return {
		agentId: instance.agentId,
		sessionId: instance.sessionId,
		sessionKey: instance.sessionKey,
		resolution: "live",
		...instance.sourceMetadata,
		participants
	};
}
/** Resolve explicit memory-forget selectors against authoritative session owners. */
function readMemorySessionTargets(params, continuation) {
	const sessionIds = [...new Set(params.sessionIds ?? [])];
	const hookSources = [...new Set(params.hookSources ?? [])];
	const participants = [...new Set(params.participants ?? [])];
	if (sessionIds.length === 0 && hookSources.length === 0 && participants.length === 0) return [];
	const since = typeof params.since === "string" ? Date.parse(params.since) : params.since;
	if (since !== void 0 && !Number.isFinite(since)) throw new Error(`Invalid memory session date: ${params.since}`);
	const resolvedSelectors = /* @__PURE__ */ new Set();
	const participantRecords = listSessionParticipantsReadOnly(params);
	const targets = /* @__PURE__ */ new Map();
	const instances = listSessionTranscriptInstances(params, { includeAllWindows: true }, continuation).filter((instance) => instance.agentId === normalizeAgentId(params.agentId)).toSorted((left, right) => left.sourceMetadata.createdAt - right.sourceMetadata.createdAt || left.sessionId.localeCompare(right.sessionId));
	for (const instance of instances) {
		const identities = (participantRecords.get(instance.sessionKey) ?? []).map(({ identity }) => identity);
		const source = instance.sourceMetadata.hookExternalContentSource;
		if (!sessionIds.includes(instance.sessionId) && !sessionIds.includes(instance.sessionKey) && !(source && hookSources.includes(source)) && !identities.some((identity) => participants.includes(identity.id))) continue;
		resolvedSelectors.add(instance.sessionId);
		resolvedSelectors.add(instance.sessionKey);
		if (since === void 0 || instance.sourceMetadata.createdAt >= since) targets.set(instance.sessionId, projectSessionMetadata(instance, identities));
	}
	for (const archive of listSessionTranscriptArchivesReadOnly({
		...params,
		sessionIds
	})) {
		resolvedSelectors.add(archive.sessionId);
		resolvedSelectors.add(archive.sessionKey);
		if (targets.has(archive.sessionId) || since !== void 0 && archive.createdAt < since) continue;
		targets.set(archive.sessionId, {
			agentId: params.agentId,
			sessionId: archive.sessionId,
			sessionKey: archive.sessionKey,
			resolution: "archived",
			hookExternalContentSource: null,
			channel: null,
			accountId: null,
			chatType: null,
			createdAt: archive.createdAt,
			participants: []
		});
	}
	for (const sessionId of sessionIds) if (!resolvedSelectors.has(sessionId)) targets.set(sessionId, {
		agentId: params.agentId,
		sessionId,
		resolution: "unresolved",
		hookExternalContentSource: null,
		channel: null,
		accountId: null,
		chatType: null,
		participants: []
	});
	return [...targets.values()];
}
//#endregion
export { readMemorySessionTargets as n, projectSessionMetadata as t };
