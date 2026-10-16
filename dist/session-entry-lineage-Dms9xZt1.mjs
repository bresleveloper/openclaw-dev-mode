import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
//#region src/config/sessions/session-entry-lineage.ts
/** True when this entry's transcript began as a copy of a parent (actual forkSource ancestry or the legacy/thread-settled marker). */
function sessionEntryForkedFromParent(entry) {
	return entry?.forkSource !== void 0 || entry?.forkedFromParent === true;
}
/**
* Builds a spawned child's authority receipt: the exact parent incarnation and the trusted
* owner bit of the spawning invocation. A rowless parent records no incarnation and never
* an owner grant. Explicit undefined values clear a reused child key's previous receipt.
*/
function buildSpawnAuthorityReceipt(parent, requesterSenderIsOwner) {
	return {
		spawnedBySessionId: parent?.sessionId,
		parentSessionLifecycleRevision: parent?.lifecycleRevision,
		spawnedBySenderIsOwner: Boolean(parent && requesterSenderIsOwner === true)
	};
}
/** Builds the stored parent link and spawn-time parent authority receipt for a new session. */
function buildSessionParentLink(params) {
	return {
		...params.parentSessionKey ? { parentSessionKey: params.parentSessionKey } : {},
		...params.parent?.sessionId ? {
			parentSessionId: params.parent.sessionId,
			...params.captureSpawnAuthority ? buildSpawnAuthorityReceipt(params.parent, params.requesterSenderIsOwner) : {}
		} : {}
	};
}
/** Selects parent and spawn lineage that survives an in-place session reset. */
function preserveSessionLineage(entry) {
	return {
		spawnedBy: entry?.spawnedBy,
		spawnedBySenderIsOwner: entry?.spawnedBySenderIsOwner,
		spawnedBySessionId: entry?.spawnedBySessionId,
		parentSessionKey: entry?.parentSessionKey,
		parentSessionId: entry?.parentSessionId,
		parentSessionLifecycleRevision: entry?.parentSessionLifecycleRevision,
		forkSource: entry?.forkSource,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope
	};
}
function preserveSqliteSameKeySessionRolloverLineage(params) {
	const previousSessionId = params.previous.sessionId.trim();
	const nextSessionId = params.next.sessionId.trim();
	if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) return params.next;
	return {
		...params.next,
		previousSessionId,
		usageFamilyKey: params.next.usageFamilyKey ?? params.previous.usageFamilyKey ?? params.sessionKey,
		usageFamilySessionIds: uniqueStrings([
			...params.previous.usageFamilySessionIds ?? [],
			previousSessionId,
			...params.next.usageFamilySessionIds ?? [],
			nextSessionId
		])
	};
}
//#endregion
export { sessionEntryForkedFromParent as a, preserveSqliteSameKeySessionRolloverLineage as i, buildSpawnAuthorityReceipt as n, preserveSessionLineage as r, buildSessionParentLink as t };
