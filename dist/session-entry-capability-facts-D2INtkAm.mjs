//#region src/config/sessions/session-entry-capability-facts.ts
/** Both native publication and worker reads carry the same content-free capability facts. */
function projectSessionEntryCapabilityFacts(entry) {
	return {
		sessionId: entry.sessionId,
		spawnedBy: entry.spawnedBy,
		spawnDepth: entry.spawnDepth,
		completionOwnerSessionKey: entry.completionOwnerSessionKey,
		subagentRole: entry.subagentRole,
		subagentControlScope: entry.subagentControlScope,
		inheritedToolPolicyVersion: entry.inheritedToolPolicyVersion,
		inheritedToolAllow: Array.isArray(entry.inheritedToolAllow) ? [...entry.inheritedToolAllow] : entry.inheritedToolAllow,
		inheritedToolDeny: Array.isArray(entry.inheritedToolDeny) ? [...entry.inheritedToolDeny] : entry.inheritedToolDeny
	};
}
//#endregion
export { projectSessionEntryCapabilityFacts as t };
