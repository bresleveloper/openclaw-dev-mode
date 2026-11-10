import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { _ as validateCanonicalSessionRowEntry, a as canonicalSessionValidationQuery } from "./session-canonical-key-B7chVWi3.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as sameTranscriptEntryAnchor } from "./transcript-entry-anchor-CzuOcGtx.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { u as selectSessionTranscriptIndexStatus } from "./session-transcript-index-BTr4by8J.mjs";
//#region src/config/sessions/session-transcript-append-postimage.ts
const postimages = /* @__PURE__ */ new WeakMap();
function retainTranscriptAppendPostimage(result, postimage) {
	if (postimage) postimages.set(result, postimage);
	return result;
}
function readTranscriptAppendPostimage(result) {
	return result !== null && typeof result === "object" ? postimages.get(result) : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-anchor.ts
/** Read one active identity using the caller's existing admitted snapshot. */
function readActiveTranscriptEntryIdentityInSnapshot(projection, entryId) {
	const db = getSessionKysely(projection.database.db);
	return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["identity.seq", "identity.parent_id as parentId"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", entryId).limit(1));
}
function readActivePathEntryRelationFromProjection(projection, entryId) {
	if (projection.state.leafEventId === entryId || entryId === null) return projection.state.leafEventId === entryId ? "exact" : "off-path";
	return readActiveTranscriptEntryIdentityInSnapshot(projection, entryId) ? "ancestor" : "off-path";
}
/** The caller owns admission; anchor and source authority share the current statement snapshot. */
function assertSessionTranscriptContextAnchorInDatabase(database, resolved, through, expectedAuthority) {
	if (resolved.agentId !== through.agentId || resolved.sessionId !== through.sessionId || resolved.sessionKey !== through.sessionKey || database.path !== through.storePath) throw new SessionTranscriptReadFenceError("Completed-turn anchor belongs to another transcript");
	const params = {
		database,
		resolved: {
			...resolved,
			sessionKey: through.sessionKey
		},
		entryId: through.entryId
	};
	let current;
	if (expectedAuthority) {
		const row = executeSqliteQueryTakeFirstSync(database.db, selectActiveTranscriptEntryAnchor(params).innerJoin(canonicalSessionValidationQuery(database, { metadata: true }).where("session_nodes.session_key", "=", through.sessionKey).as("authority"), "authority.current_session_id", "identity.session_id").selectAll("authority"));
		const entry = row && validateCanonicalSessionRowEntry(row, parseSessionEntryJson(row, "list"), "read");
		if (!entry || entry.permissionMode !== expectedAuthority.permissionMode || (entry.lifecycleRevision ?? null) !== (expectedAuthority.lifecycleRevision ?? null)) throw new SessionTranscriptReadFenceError("Session transcript source was deleted, replaced, or changed lifecycle or permissions.");
		current = createTranscriptEntryAnchor({
			...params,
			row: row && {
				...row,
				generation: row.generation ?? null
			}
		});
	} else current = readActiveTranscriptEntryAnchorInTransaction(params);
	if (!sameTranscriptEntryAnchor(through, current)) throw new SessionTranscriptReadFenceError("Completed-turn transcript anchor changed");
}
/** Borrow readiness only while the projection owner's synchronous snapshot remains open. */
function readActiveTranscriptEntryAnchorFromProjection(projection, entryId, message) {
	assertTransactionUsable(projection.database.db);
	const sessionKey = projection.resolved.sessionKey;
	if (!projection.database.db.isTransaction || !sessionKey) throw new Error("Transcript anchor projection requires its selected session snapshot");
	const params = {
		database: projection.database,
		resolved: {
			...projection.resolved,
			sessionKey
		},
		entryId,
		message
	};
	return createTranscriptEntryAnchor({
		...params,
		row: readActiveTranscriptEntryFacts(params, projection)
	});
}
function readActiveTranscriptEntryFacts(params, projection, includeVersion = false) {
	const actor = readSessionActorTransactionState(params.database, params.resolved);
	if (actor) {
		const state = actor.transcript.projection;
		if (!state || state.needsRebuild || state.hasUnclassifiedEvents || state.indexedSeq !== actor.hot.transcript.version.rawSeq) return;
		const identity = actor.transcript.identities.get(params.entryId);
		const active = identity && actor.transcript.active.get(identity.seq);
		if (identity && active) return {
			seq: identity.seq,
			parent_id: identity.parent_id,
			message_idempotency_key: identity.message_idempotency_key,
			message_position: active.message_position,
			generation: actor.hot.transcript.version.generation,
			latestSeq: actor.hot.transcript.version.rawSeq,
			transcriptUpdatedAt: actor.hot.transcript.version.updatedAt
		};
		if (actor.transcript.complete) return;
	}
	const row = executeSqliteQueryTakeFirstSync(params.database.db, selectActiveTranscriptEntryAnchor(params, projection, includeVersion));
	return row ? {
		...row,
		generation: (projection ? projection.generation : row.generation) ?? null,
		latestSeq: projection ? projection.state.indexedSeq : row.latestSeq
	} : void 0;
}
/** Compose final authority predicates into the anchor's single-statement snapshot. */
function selectActiveTranscriptEntryAnchor(params, projection, includeVersion = false) {
	return getSessionKysely(params.database.db).selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select([
		"identity.seq",
		"identity.parent_id",
		"identity.message_idempotency_key",
		"active.message_position"
	]).where("identity.session_id", "=", params.resolved.sessionId).where("identity.event_id", "=", params.entryId).limit(1).$if(!projection, (selected) => selected.innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).leftJoin(selectSessionTranscriptIndexStatus(params.database.db, params.resolved.sessionId).as("status"), (join) => join.onTrue()).select(["rewrite.generation", "status.latestSeq"]).$if(includeVersion, (withVersion) => withVersion.select((eb) => eb.selectFrom("session_windows").select("transcript_updated_at").whereRef("session_windows.session_id", "=", "identity.session_id").as("transcriptUpdatedAt"))).where("status.needs_reconcile", "is not", 1));
}
/** Reads one active message identity from the caller's current SQLite transaction. */
function readActiveTranscriptEntryAnchorInTransaction(params) {
	return createTranscriptEntryAnchor({
		...params,
		row: readActiveTranscriptEntryFacts(params)
	});
}
/** The append receipt shares its anchor read with the subsequent visible-tail consumer. */
function readTranscriptMessageAppendMetadataInTransaction(params) {
	const revision = getSqliteReadScopeRevision(params.database.db);
	const row = readActiveTranscriptEntryFacts(params, void 0, true);
	const anchor = createTranscriptEntryAnchor({
		...params,
		row
	});
	const postimage = revision && anchor && typeof row?.latestSeq === "number" ? {
		revision,
		anchor,
		version: {
			generation: anchor.generation,
			rawSeq: row.latestSeq,
			updatedAt: row.transcriptUpdatedAt ?? null
		}
	} : void 0;
	return retainTranscriptAppendPostimage({
		anchor,
		visibleTailEntryId: anchor && row?.seq === row?.latestSeq ? params.entryId : void 0
	}, postimage);
}
/** Projects anchor fields after the caller verifies readiness in the same snapshot. */
function createTranscriptEntryAnchor(params) {
	const { row } = params;
	if (row?.message_position === null || row?.message_position === void 0 || row.generation === null) return;
	const idempotencyKey = row.message_idempotency_key ?? readMessageIdempotencyKey(params.message);
	return Object.freeze({
		agentId: params.resolved.agentId,
		sessionId: params.resolved.sessionId,
		sessionKey: params.resolved.sessionKey,
		storePath: params.database.path,
		generation: row.generation,
		entryId: params.entryId,
		rawSeq: row.seq,
		effectiveParentId: row.parent_id,
		activeMessagePosition: row.message_position,
		...idempotencyKey ? { idempotencyKey } : {}
	});
}
/** Reads one active message identity from the authoritative SQLite projection. */
function readActiveTranscriptEntryAnchor(params) {
	const resolved = resolveSqliteTranscriptScope(params);
	return readActiveTranscriptEntryAnchorInTransaction({
		database: openOpenClawAgentDatabase(toDatabaseOptions(resolved)),
		resolved,
		entryId: params.entryId
	});
}
//#endregion
export { readActiveTranscriptEntryAnchorFromProjection as a, readTranscriptMessageAppendMetadataInTransaction as c, readActiveTranscriptEntryAnchor as i, readTranscriptAppendPostimage as l, createTranscriptEntryAnchor as n, readActiveTranscriptEntryAnchorInTransaction as o, readActivePathEntryRelationFromProjection as r, readActiveTranscriptEntryIdentityInSnapshot as s, assertSessionTranscriptContextAnchorInDatabase as t, retainTranscriptAppendPostimage as u };
