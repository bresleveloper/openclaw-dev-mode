import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { k as readSqliteDatabaseSiblingWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as publishSqliteCommittedState, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { d as readSqliteNativeMutationRevision, i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as SessionParticipantIdentitySchema } from "./session-participant-rDryrWG-.mjs";
import { Compile } from "typebox/schema";
//#region src/config/sessions/session-accessor.sqlite-entry-revision.ts
function readSessionNodesGeneration(database) {
	const revision = readSqliteNativeMutationRevision(database);
	if (revision === void 0) throw new Error("SQLite session entry caching requires a tracked writer");
	return revision;
}
function readSessionEntryCacheValidityToken(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	if (!schema) throw new Error("SQLite session entry caching requires admitted schema facts");
	return {
		siblingWriteRevision: readSqliteDatabaseSiblingWriteRevision(database),
		sessionNodesGeneration: readSessionNodesGeneration(database),
		schemaVersion: schema.schemaVersion
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.siblingWriteRevision !== void 0 && left.siblingWriteRevision === right.siblingWriteRevision && left.sessionNodesGeneration === right.sessionNodesGeneration && left.schemaVersion === right.schemaVersion;
}
var SessionEntryRevisionConflictError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
/** Reuse prepared facts until this connection observes a write, then compare only their predicate. */
function createSessionEntryRevisionGuard(database, assertSourceCurrent, matches) {
	let verified;
	return () => {
		assertSourceCurrent();
		const revision = readSessionEntryCacheValidityToken(database);
		if (verified && !database.isTransaction && cacheValidityTokensEqual(verified, revision)) {
			assertSourceCurrent();
			return;
		}
		verified = void 0;
		if (!matches()) throw new SessionEntryRevisionConflictError("Prepared session entry facts are no longer current");
		assertSourceCurrent();
		if (!database.isTransaction) verified = revision;
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-state.ts
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
function publishTrackedCacheUpdate(database, publish, stage, invalidateFacts) {
	let settle;
	const commit = () => {
		publish();
		settle?.();
	};
	const invalidate = () => {
		sessionEntryCaches.delete(database.db);
		invalidateFacts?.();
		settle?.();
	};
	if (stageSqliteTransactionState(isPostgresSqlConnection(database.db) ? database.db.anchor : database.db, {
		stage: () => {
			settle = stage?.();
		},
		rollback: () => settle?.(),
		commit,
		invalidate
	})) return true;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	publishSqliteCommittedState({
		installFacts: commit,
		invalidate,
		notify() {}
	});
	return false;
}
/** Participant display facts may be borrowed in a transaction only at its native revision. */
function readCurrentSessionEntryCacheParticipants(database, sessionKey) {
	const cached = sessionEntryCaches.get(database);
	const entry = cached?.entries.get(sessionKey);
	if (!cached || !entry || !getAdmittedSqliteSchemaFacts(database) || !cacheValidityTokensEqual(cached.validityToken, readSessionEntryCacheValidityToken(database))) return;
	return entry.participants ? {
		participants: entry.participants.map(({ identity }) => ({ identity: { ...identity } })),
		participantCount: entry.participantCount
	} : {};
}
//#endregion
//#region src/config/sessions/session-participant-identity.ts
let identityValidator;
function participantIdentityNamespace(identity) {
	if (identity.type === "profile" || identity.type === "agent") return JSON.stringify({ type: identity.type });
	if (identity.type === "remote") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		domain: identity.domain,
		idKind: identity.idKind
	});
	if (identity.type === "observation") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		accountId: identity.accountId,
		senderKind: identity.senderKind
	});
	return JSON.stringify({
		type: identity.type,
		actorType: identity.actorType,
		source: identity.source
	});
}
function readParticipantIdentity(namespace, id) {
	const parsed = JSON.parse(namespace);
	if (isRecord(parsed)) {
		const identity = {
			...parsed,
			id
		};
		if ((identityValidator ??= Compile(SessionParticipantIdentitySchema)).Check(identity)) return identity;
	}
	throw new Error("Session participant identity is invalid; run openclaw doctor --fix.");
}
/** Inputs/aliases sum; retried cross-store copies retain the largest recorded aggregate. */
function mergeParticipantAggregate(current, incoming, mode) {
	if (!current) return incoming;
	return {
		contribution_count: mode === "sum" ? current.contribution_count + incoming.contribution_count : Math.max(current.contribution_count, incoming.contribution_count),
		first_prompted_at: current.first_prompted_at === null || incoming.first_prompted_at === null ? null : Math.min(current.first_prompted_at, incoming.first_prompted_at),
		last_prompted_at: current.last_prompted_at === null ? incoming.last_prompted_at : incoming.last_prompted_at === null ? current.last_prompted_at : Math.max(current.last_prompted_at, incoming.last_prompted_at)
	};
}
//#endregion
export { readCurrentSessionEntryCacheParticipants as a, createSessionEntryRevisionGuard as c, publishTrackedCacheUpdate as i, readSessionEntryCacheValidityToken as l, participantIdentityNamespace as n, sessionEntryCaches as o, readParticipantIdentity as r, cacheValidityTokensEqual as s, mergeParticipantAggregate as t, readSessionNodesGeneration as u };
