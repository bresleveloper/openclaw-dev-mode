import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/session-entry-current-admission.ts
function decodeSessionEntryCurrentFacts(value, capability) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.sessionId !== "string") throw new Error("Session currency facts have an invalid entry identity");
	if (capability) return {
		sessionId: value.sessionId,
		spawnedBy: value.spawnedBy,
		spawnDepth: value.spawnDepth,
		completionOwnerSessionKey: value.completionOwnerSessionKey,
		subagentRole: value.subagentRole,
		subagentControlScope: value.subagentControlScope,
		inheritedToolPolicyVersion: value.inheritedToolPolicyVersion,
		inheritedToolAllow: value.inheritedToolAllow,
		inheritedToolDeny: value.inheritedToolDeny
	};
	const recovery = value.subagentRecovery;
	if (recovery !== void 0 && !isRecord(recovery)) throw new Error("Session currency facts have an invalid recovery projection");
	return {
		sessionId: value.sessionId,
		previousSessionId: value.previousSessionId,
		...value.archivedAt === void 0 ? {} : { archivedAt: value.archivedAt },
		...value.repositoryWorkspaceId === void 0 ? {} : { repositoryWorkspaceId: value.repositoryWorkspaceId },
		lifecycleRevision: value.lifecycleRevision,
		lifecycleRunId: value.lifecycleRunId,
		activeWriterRunId: value.activeWriterRunId,
		...recovery ? { subagentRecovery: {
			lastRunId: recovery.lastRunId,
			sessionLifecycleRunId: recovery.sessionLifecycleRunId
		} } : {}
	};
}
/** Evaluate the caller's policy against the native request's facts before its ordinary grant. */
function assertSessionEntryCurrentAdmission(request, check) {
	if (!check) {
		if (isRecord(request.facts) && request.facts.kind === "session-entry-current") throw new Error("Session currency facts have no captured caller");
		return request;
	}
	const facts = request.facts;
	if (!isRecord(facts) || facts.kind !== "session-entry-current" || !isRecord(facts.source) || facts.source.agentId !== check.source.agentId || facts.source.path !== check.source.path || facts.source.databaseIdentity !== check.source.databaseIdentity || facts.source.databaseBirthtime !== check.source.databaseBirthtime || facts.source.sessionKey !== check.source.sessionKey || facts.source.sessionIdLookup !== check.source.sessionIdLookup || facts.source.projection !== check.source.projection) throw new Error("Session currency facts differ from the captured source");
	check.assertCurrent(decodeSessionEntryCurrentFacts(facts.entry, check.source.projection === "capability"));
	return {
		...request,
		facts: facts.domainFacts
	};
}
/** Unwrap the worker's nested reads before evaluating a predicate over the complete cohort. */
function assertSessionEntriesCurrentAdmission(request, check) {
	const entries = [];
	let currentRequest = request;
	for (let index = (check?.sources.length ?? 0) - 1; index >= 0; index -= 1) currentRequest = assertSessionEntryCurrentAdmission(currentRequest, {
		source: check.sources[index],
		assertCurrent: (entry) => {
			entries[index] = entry;
		}
	});
	currentRequest = assertSessionEntryCurrentAdmission(currentRequest, void 0);
	check?.assertCurrent(entries);
	return currentRequest;
}
//#endregion
export { assertSessionEntryCurrentAdmission as n, assertSessionEntriesCurrentAdmission as t };
