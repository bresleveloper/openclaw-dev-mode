import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { t as emitSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
//#region src/config/sessions/session-accessor.sqlite-identity.ts
function toSessionIdentityTarget(entry, sessionKeys) {
	const sessionId = normalizeOptionalString(entry?.sessionId);
	return {
		...sessionId ? { sessionId } : {},
		sessionKeys
	};
}
function prepareCommittedSessionEntryRemovals(agentId, removals) {
	const previousByKey = /* @__PURE__ */ new Map();
	for (const removal of removals) if (!previousByKey.has(removal.sessionKey)) previousByKey.set(removal.sessionKey, toSessionIdentityTarget(removal.expectedEntry, [removal.sessionKey]));
	return () => {
		for (const previous of previousByKey.values()) emitSessionIdentityMutation({
			agentId,
			kind: "delete",
			previous
		});
	};
}
function publishCommittedSessionIdentity(agentId, previous, current) {
	const currentKeysBySessionId = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of current) {
		const sessionId = normalizeOptionalString(entry.sessionId);
		if (sessionId) currentKeysBySessionId.set(sessionId, [...currentKeysBySessionId.get(sessionId) ?? [], sessionKey]);
	}
	const movedKeysByCurrentKey = /* @__PURE__ */ new Map();
	const handledPreviousKeys = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of previous) {
		if (current.has(sessionKey)) continue;
		const sessionId = normalizeOptionalString(entry.sessionId);
		const currentKeys = sessionId ? currentKeysBySessionId.get(sessionId) : void 0;
		if (currentKeys?.length !== 1) continue;
		const [currentKey] = currentKeys;
		if (!currentKey) continue;
		movedKeysByCurrentKey.set(currentKey, [...movedKeysByCurrentKey.get(currentKey) ?? [], sessionKey]);
		handledPreviousKeys.add(sessionKey);
	}
	for (const [currentKey, previousKeys] of movedKeysByCurrentKey) {
		const currentEntry = current.get(currentKey);
		if (currentEntry) emitSessionIdentityMutation({
			agentId,
			kind: "move",
			previous: toSessionIdentityTarget(currentEntry, previousKeys),
			current: toSessionIdentityTarget(currentEntry, [currentKey])
		});
	}
	for (const [sessionKey, previousEntry] of previous) {
		const currentEntry = current.get(sessionKey);
		const previousTarget = toSessionIdentityTarget(previousEntry, [sessionKey]);
		if (currentEntry) {
			const currentTarget = toSessionIdentityTarget(currentEntry, [sessionKey]);
			const kind = previousTarget.sessionId !== currentTarget.sessionId ? "replace" : previousEntry.lifecycleRevision !== currentEntry.lifecycleRevision ? "reset" : void 0;
			if (kind) emitSessionIdentityMutation({
				agentId,
				kind,
				previous: previousTarget,
				current: currentTarget
			});
		} else if (!handledPreviousKeys.has(sessionKey)) emitSessionIdentityMutation({
			agentId,
			kind: "delete",
			previous: previousTarget
		});
	}
	for (const [sessionKey, currentEntry] of current) {
		if (previous.has(sessionKey) || movedKeysByCurrentKey.has(sessionKey)) continue;
		emitSessionIdentityMutation({
			agentId,
			kind: "create",
			previous: { sessionKeys: [] },
			current: toSessionIdentityTarget(currentEntry, [sessionKey])
		});
	}
}
function prepareSessionIdentityPublication(database, agentId, previous, current) {
	const publish = () => publishCommittedSessionIdentity(agentId, previous, current);
	return () => {
		if (!deferSqlitePostCommitPublication(database.db, publish)) publish();
	};
}
function prepareLifecycleIdentityPublication(params) {
	const removedKeys = new Set(params.removedSessionKeys);
	const previous = new Map(params.projected.removals.filter((removal) => removedKeys.has(removal.sessionKey)).map((removal) => [removal.sessionKey, removal.expectedEntry]));
	const current = /* @__PURE__ */ new Map();
	for (const upsert of params.projected.upsertedEntries) {
		if (!current.has(upsert.sessionKey) && upsert.expectedEntry) previous.set(upsert.sessionKey, upsert.expectedEntry);
		current.set(upsert.sessionKey, upsert.entry);
	}
	return prepareSessionIdentityPublication(params.database, params.agentId, previous, current);
}
//#endregion
export { publishCommittedSessionIdentity as i, prepareLifecycleIdentityPublication as n, prepareSessionIdentityPublication as r, prepareCommittedSessionEntryRemovals as t };
