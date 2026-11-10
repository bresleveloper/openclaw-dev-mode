import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { n as bindPreparedSessionEntryPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { t as emitSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
//#region src/config/sessions/session-accessor.sqlite-identity.ts
function toSessionIdentityTarget(entry, sessionKeys) {
	const sessionId = normalizeOptionalString(entry?.sessionId);
	return {
		...sessionId ? { sessionId } : {},
		sessionKeys
	};
}
function publishCommittedSessionEntryRemoval(agentId, databaseIdentity, sessionId, sessionKeys) {
	emitSessionIdentityMutation({
		agentId,
		databaseIdentity,
		kind: "delete",
		previous: {
			...sessionId ? { sessionId } : {},
			sessionKeys
		}
	});
}
function prepareCommittedSessionEntryRemovals(agentId, databaseIdentity, removals) {
	const previousByKey = /* @__PURE__ */ new Map();
	for (const removal of removals) if (!previousByKey.has(removal.sessionKey)) previousByKey.set(removal.sessionKey, toSessionIdentityTarget(removal.expectedEntry, [removal.sessionKey]));
	return () => {
		for (const previous of previousByKey.values()) publishCommittedSessionEntryRemoval(agentId, databaseIdentity, previous.sessionId, previous.sessionKeys);
	};
}
function publishCommittedSessionIdentity(agentId, databaseIdentity, previous, current, prepared) {
	const emit = (mutation) => {
		if (prepared) bindPreparedSessionEntryPublication(mutation, {
			kind: "metadata",
			sharingChange: "changed",
			prepared
		});
		emitSessionIdentityMutation(mutation);
	};
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
		if (currentEntry) emit({
			agentId,
			databaseIdentity,
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
			if (kind) emit({
				agentId,
				databaseIdentity,
				kind,
				previous: previousTarget,
				current: currentTarget
			});
		} else if (!handledPreviousKeys.has(sessionKey)) emit({
			agentId,
			databaseIdentity,
			kind: "delete",
			previous: previousTarget
		});
	}
	for (const [sessionKey, currentEntry] of current) {
		if (previous.has(sessionKey) || movedKeysByCurrentKey.has(sessionKey)) continue;
		emit({
			agentId,
			databaseIdentity,
			kind: "create",
			previous: { sessionKeys: [] },
			current: toSessionIdentityTarget(currentEntry, [sessionKey])
		});
	}
}
function prepareSessionIdentityPublication(database, agentId, previous, current) {
	const { identity } = readOpenClawAgentDatabaseIdentity(database);
	const publish = () => publishCommittedSessionIdentity(agentId, identity, previous, current);
	return () => {
		if (!deferSqlitePostCommitPublication(sqlPublicationAnchor(database.db), publish)) publish();
	};
}
function prepareLifecycleIdentityPublication(params) {
	const { previous, current } = collectLifecycleIdentityChanges(params.projected, params.removedSessionKeys);
	return prepareSessionIdentityPublication(params.database, params.agentId, previous, current);
}
function collectLifecycleIdentityChanges(projected, removedSessionKeys) {
	const removedKeys = new Set(removedSessionKeys);
	const previous = new Map(projected.removals.filter((removal) => removedKeys.has(removal.sessionKey)).map((removal) => [removal.sessionKey, removal.expectedEntry]));
	const current = /* @__PURE__ */ new Map();
	for (const upsert of projected.upsertedEntries) {
		if (!current.has(upsert.sessionKey) && upsert.expectedEntry) previous.set(upsert.sessionKey, upsert.expectedEntry);
		current.set(upsert.sessionKey, upsert.entry);
	}
	return {
		previous,
		current
	};
}
//#endregion
export { publishCommittedSessionEntryRemoval as a, prepareSessionIdentityPublication as i, prepareCommittedSessionEntryRemovals as n, publishCommittedSessionIdentity as o, prepareLifecycleIdentityPublication as r, collectLifecycleIdentityChanges as t };
