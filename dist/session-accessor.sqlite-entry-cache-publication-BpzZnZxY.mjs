import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { f as invalidateOpenClawAgentWritableProjections } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { r as invalidateOpenClawAgentReadOnlyProjections } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { A as projectSessionSharingEntry, C as publishRetainedSessionGeneration, D as updateSessionSharingField, E as revokePreparedSessionEntryPredicate, O as assertSessionEntryCreationTarget, S as publishRetainedSessionEntryPredicate, T as recordAcquiringSessionMember, a as preparedSharingChanges, b as stageSessionSharingPublication, h as recordCommittedSessionMetadataPublication, j as readSessionEntryCreationIdentity, k as createSessionEntryCreationOperation, m as recordCommittedSessionEntryPublication, n as markSessionSharingAuthorityUnknown, s as publishRetainedSessionEntryChange, w as recordAcquiringSessionEntry, y as retainedSharingReads } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as publishTrackedCacheUpdate, o as sessionEntryCaches } from "./session-participant-identity-Btc25HNW.mjs";
import { i as sealSessionEntryPublicationSource } from "./session-entry-publication-source-BkCFKM-k.mjs";
//#region src/sessions/communication-policy.ts
/** Resolve preferences only; existing access and live authority remain separate ceilings. */
function resolveSessionCommunicationPolicy(params) {
	const defaults = params.config.session?.communication;
	return {
		send: params.entry?.communication?.send ?? defaults?.send ?? "always",
		receive: params.entry?.communication?.receive ?? defaults?.receive ?? "always"
	};
}
//#endregion
//#region src/sessions/communication-admission.ts
/** Policies constrain peers, not completion already owned by a host task lifecycle. */
function planSessionCommunication(params) {
	const source = params.source[0];
	const target = params.target[0];
	const sameSession = Boolean(source?.entry?.sessionId && target?.entry?.sessionId && source.agentId === target.agentId && source.sessionKey === target.sessionKey && source.storePath === target.storePath && source.entry.sessionId === target.entry.sessionId);
	if (params.ownedTask || sameSession) return {
		allowed: true,
		approvals: []
	};
	const approvals = [];
	for (const [direction, endpoints] of [["send", params.source], ["receive", params.target]]) for (const endpoint of endpoints) {
		const mode = resolveSessionCommunicationPolicy({
			config: params.config,
			entry: endpoint.entry
		})[direction];
		if (mode === "never") return {
			allowed: false,
			error: "Session communication " + direction + " is disabled for " + endpoint.sessionKey + "."
		};
		if (mode === "ask") approvals.push({
			direction,
			endpoint
		});
	}
	return {
		allowed: true,
		approvals
	};
}
/** Only communication-relevant facts bind an approval, not token/preview updates. */
function communicationEndpointBinding(endpoint) {
	return JSON.stringify([
		endpoint.agentId,
		endpoint.sessionKey,
		endpoint.storePath,
		communicationEntryBinding(endpoint.entry)
	]);
}
/** Stored-policy projection carried by the existing committed row publication owner. */
function communicationEntryBinding(entry) {
	return JSON.stringify([
		entry?.sessionId,
		entry?.lifecycleRevision,
		entry?.archivedAt,
		entry?.communication,
		entry?.sandbox,
		entry?.sandboxMode,
		entry?.visibility,
		entry?.parentSessionKey,
		entry?.parentSessionId,
		entry?.spawnedBy,
		entry?.owner,
		entry?.createdActor
	]);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-publication.ts
function bindPreparedSessionEntryPublication(change, record) {
	preparedSharingChanges.changes.set(change, record);
}
function bindSessionEntryPublicationSource(change, database) {
	const source = findOpenClawAgentDatabaseIdentity(database);
	if (source) bindPreparedSessionEntryPublication(change, {
		...preparedSharingChanges.changes.get(change) ?? { kind: "source" },
		databaseIdentity: source.identity,
		canonicalPath: source.canonicalPath
	});
	return change;
}
function emitPreparedSessionSharingChange(database, sessionKey, agentId = database.agentId, facts, record = {
	kind: "marker",
	sharingChange: "changed"
}) {
	const change = {
		agentId,
		storePath: database.path,
		sessionKey,
		...facts ? {
			facts,
			scope: "session-entry"
		} : { factsInvalidated: true }
	};
	bindPreparedSessionEntryPublication(change, record);
	bindSessionEntryPublicationSource(change, database);
	if (record.kind === "metadata") {
		const seal = () => sealSessionEntryPublicationSource(record.prepared.source);
		if (!stageSqliteTransactionState(sqlPublicationAnchor(database.db), {
			stage() {},
			commit: seal,
			rollback() {}
		})) seal();
	}
	sessionChanges.emit(change, database.db);
}
function invalidateSessionEntryCaches(databaseIdentity) {
	invalidateOpenClawAgentWritableProjections(databaseIdentity, (database) => sessionEntryCaches.delete(database));
	invalidateOpenClawAgentReadOnlyProjections(databaseIdentity, (database) => sessionEntryCaches.delete(database));
}
/** Retire all facts in a failed installation, including pending older worker receipts. */
function invalidateSessionEntryPublication(database, sessionKey, authorityChanged = true) {
	if (authorityChanged) markSessionSharingAuthorityUnknown(database, sessionKey);
	publishRetainedSessionEntryChange(database, sessionKey, void 0, void 0, false);
}
/** A committed metadata-only worker write invalidates caches without changing retained identity. */
function publishSessionEntryWorkerMetadataInvalidation(params) {
	invalidateSessionEntryCaches(params.databaseIdentity);
	for (const read of retainedSharingReads(params.databaseIdentity, params.sessionKey) ?? []) publishRetainedSessionEntryPredicate(read, params.entry, params.entry !== void 0, { preserveMatchingEntry: true });
	const change = {
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		scope: "session-entry",
		facts: { kind: "unchanged" }
	};
	bindPreparedSessionEntryPublication(change, {
		kind: "marker",
		sharingChange: "unchanged",
		databaseIdentity: params.databaseIdentity
	});
	sessionChanges.emit(change);
}
function creationMatchesDatabase(creation, database) {
	return creation.source.kind === "native" ? creation.source.database.db === database.db : creation.source.kind === "file" && creation.source.agentId === database.agentId && findOpenClawAgentDatabaseIdentity(database)?.identity === creation.source.databaseIdentity;
}
/** Canonical creation scopes provenance only; caller and target guards still authorize each write. */
async function withSessionEntryCreationPublication(params, run) {
	const { ensureReplicaSubscription } = await import("./session-actor-replica-MwFFnmnH.mjs");
	ensureReplicaSubscription();
	const operation = createSessionEntryCreationOperation();
	const creation = {
		agentId: params.agentId,
		source: params.database ? {
			kind: "native",
			database: params.database,
			agentId: params.database.agentId
		} : {
			kind: "file",
			...params.file
		},
		sessionKey: params.sessionKey,
		active: true
	};
	preparedSharingChanges.operations.set(operation, creation);
	try {
		params.bind?.(operation);
		return await runWithSessionEntryCreationPublication(operation, () => run(operation));
	} finally {
		creation.active = false;
		preparedSharingChanges.operations.delete(operation);
	}
}
/** Reenter only this operation's provenance after another owner restores its own context. */
function runWithSessionEntryCreationPublication(operation, run) {
	const creation = preparedSharingChanges.operations.get(operation);
	return preparedSharingChanges.current.run(creation, run);
}
function assertSessionEntryCreationPublication(operation, target) {
	assertSessionEntryCreationTarget(preparedSharingChanges.operations.get(operation), target);
}
/** Only the actual inserted-placeholder producer supplies these known row facts. */
function publishSessionEntryPlaceholderInsertion(database, params) {
	const { sessionKey, sessionId } = params;
	const placeholder = Object.freeze({ sessionId });
	const current = preparedSharingChanges.current.getStore();
	const creation = current?.active && creationMatchesDatabase(current, database) && current.sessionKey === sessionKey ? current : void 0;
	const receipt = {
		kind: "placeholder",
		creation,
		databaseIdentity: creation ? readSessionEntryCreationIdentity(creation) : database.db,
		sessionKey,
		placeholder,
		committed: false
	};
	let staged = false;
	staged = publishTrackedCacheUpdate(database, () => {
		recordCommittedSessionEntryPublication(database, sessionKey);
		const facts = staged ? {
			entry: void 0,
			placeholder,
			membership: /* @__PURE__ */ new Set()
		} : void 0;
		for (const read of retainedSharingReads(database, sessionKey) ?? []) {
			revokePreparedSessionEntryPredicate(read);
			if (read.acquisition) read.acquisition.invalidated = true;
			publishRetainedSessionGeneration(read, void 0, staged);
			read.facts = facts;
		}
		sessionEntryCaches.delete(database.db);
		receipt.committed = staged;
	}, () => stageSessionSharingPublication(database, sessionKey), () => invalidateSessionEntryPublication(database, sessionKey));
	emitPreparedSessionSharingChange(database, sessionKey, database.agentId, void 0, {
		kind: "placeholder",
		sharingChange: "changed",
		receipt
	});
}
/** Install a committed field from either a native transaction or a worker receipt. */
function commitSessionSharingFieldChange(database, sessionKey, change) {
	recordCommittedSessionMetadataPublication(database, sessionKey, change);
	for (const read of retainedSharingReads(database, sessionKey) ?? []) if (read.acquisition) {
		if (change.kind === "member") recordAcquiringSessionMember(read.acquisition, change);
		else recordAcquiringSessionEntry(read.acquisition, void 0, void 0);
	} else if (read.facts) read.facts = updateSessionSharingField(read.facts, change);
}
function publishSessionSharingFieldChange(database, sessionKey, change) {
	publishTrackedCacheUpdate(database, () => {
		commitSessionSharingFieldChange(database, sessionKey, change);
	}, () => stageSessionSharingPublication(database, sessionKey, change.kind === "category" ? void 0 : change), () => invalidateSessionEntryPublication(database, sessionKey, change.kind !== "category"));
}
function publishSessionSharingMemberChange(database, sessionKey, member, agentId = database.agentId) {
	publishSessionSharingFieldChange(database, sessionKey, member);
	emitPreparedSessionSharingChange(database, sessionKey, agentId, member);
}
/** Publish sharing state before the listing projection and its public change event. */
function publishSessionSharingEntryChange(database, update) {
	const facts = update.facts;
	if (facts?.kind === "owner" || facts?.kind === "category") {
		publishSessionSharingFieldChange(database, update.sessionKey, facts);
		return;
	}
	const sharingUnchanged = facts?.kind === "unchanged" || facts?.kind === "participants";
	const sharingEntry = update.entry ? projectSessionSharingEntry(update.entry) : void 0;
	if (sharingUnchanged) publishTrackedCacheUpdate(database, () => recordCommittedSessionMetadataPublication(database, update.sessionKey, facts, update.entry), void 0, () => invalidateSessionEntryPublication(database, update.sessionKey, false));
	const previousIdentity = update.previousEntry && {
		sessionId: update.previousEntry.sessionId,
		lifecycleRevision: update.previousEntry.lifecycleRevision
	};
	if (!sharingUnchanged) publishTrackedCacheUpdate(database, () => {
		publishRetainedSessionEntryChange(database, update.sessionKey, sharingEntry, previousIdentity, sharingEntry !== void 0 || facts?.kind === "removed", update.entry);
	}, () => stageSessionSharingPublication(database, update.sessionKey), () => invalidateSessionEntryPublication(database, update.sessionKey));
}
//#endregion
export { invalidateSessionEntryCaches as a, publishSessionSharingEntryChange as c, withSessionEntryCreationPublication as d, communicationEndpointBinding as f, resolveSessionCommunicationPolicy as h, emitPreparedSessionSharingChange as i, publishSessionSharingMemberChange as l, planSessionCommunication as m, bindPreparedSessionEntryPublication as n, publishSessionEntryPlaceholderInsertion as o, communicationEntryBinding as p, commitSessionSharingFieldChange as r, publishSessionEntryWorkerMetadataInvalidation as s, assertSessionEntryCreationPublication as t, runWithSessionEntryCreationPublication as u };
