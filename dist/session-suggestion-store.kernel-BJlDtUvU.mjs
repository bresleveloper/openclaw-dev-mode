import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-P-nzw0e8.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-suggestion-store.kernel.ts
const MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR = 20;
const MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION = 100;
const MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS = 200;
const SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS = 3e4;
function suggestionDb(database) {
	return getNodeSqliteKysely(database.db);
}
function toSuggestion(row) {
	return {
		id: row.id,
		authorId: row.author_id,
		...row.author_label ? { authorLabel: row.author_label } : {},
		text: row.text,
		createdAt: row.created_at,
		state: row.state
	};
}
function assertSessionInstance(database, sessionKey, expectedSessionId) {
	if (expectedSessionId === void 0) return;
	if (readSessionEntryInstanceId(database, sessionKey) !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
}
function pruneResolvedSessionSuggestions(database, sessionKey) {
	const db = suggestionDb(database);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("id", "in", db.selectFrom("session_suggestions").select("id").where("session_key", "=", sessionKey).where("state", "!=", "pending").orderBy("created_at", "desc").orderBy("id", "desc").limit((eb) => eb.lit(-1)).offset((eb) => eb.lit(MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS))));
}
function addSessionSuggestionInDatabase(database, sessionKey, params) {
	const suggestion = params.suggestion;
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	pruneResolvedSessionSuggestions(database, sessionKey);
	const pendingCounts = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select((eb) => ["author_id", eb.fn.countAll().as("count")]).where("session_key", "=", sessionKey).where("state", "=", "pending").groupBy("author_id")).rows.reduce((counts, row) => ({
		session: counts.session + row.count,
		author: counts.author + (row.author_id === suggestion.authorId ? row.count : 0)
	}), {
		session: 0,
		author: 0
	});
	if (pendingCounts.session >= MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION) throw new Error("session pending suggestion limit reached");
	if (pendingCounts.author >= MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR) throw new Error("author pending suggestion limit reached");
	executeSqliteQuerySync(database.db, db.insertInto("session_suggestions").values({
		id: suggestion.id,
		session_key: sessionKey,
		author_id: suggestion.authorId,
		author_label: suggestion.authorLabel ?? null,
		text: suggestion.text,
		created_at: suggestion.createdAt,
		state: suggestion.state,
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}));
	return suggestion;
}
function listSessionSuggestionsInDatabase(database, sessionKey, params = {}) {
	let query = suggestionDb(database).selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]).where("session_key", "=", sessionKey);
	if (params.authorId?.trim()) query = query.where("author_id", "=", params.authorId.trim());
	if (params.pendingOnly) query = query.where("state", "=", "pending");
	return executeSqliteQuerySync(database.db, query.orderBy("created_at", "asc").orderBy("id", "asc")).rows.map(toSuggestion);
}
function claimSessionSuggestionDispatchInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state",
		"dispatch_token",
		"dispatch_started_at",
		"dispatch_resolution"
	]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
	if (!row) return null;
	const now = params.now ?? Date.now();
	const claimTtlMs = params.claimTtlMs ?? 3e4;
	if (row.dispatch_token && row.dispatch_started_at !== null && now - row.dispatch_started_at < claimTtlMs) return { kind: "busy" };
	if (row.dispatch_resolution && row.dispatch_resolution !== params.resolution) return {
		kind: "mismatch",
		resolution: row.dispatch_resolution
	};
	const token = randomUUID();
	executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
		dispatch_token: token,
		dispatch_started_at: now,
		dispatch_resolution: params.resolution
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
	return {
		kind: "claimed",
		suggestion: toSuggestion(row),
		token
	};
}
function releaseSessionSuggestionDispatchInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	return (executeSqliteQuerySync(database.db, suggestionDb(database).updateTable("session_suggestions").set({
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) > 0n;
}
function finalizeSessionSuggestionClaimInDatabase(database, sessionKey, params) {
	assertSessionInstance(database, sessionKey, params.expectedSessionId);
	const db = suggestionDb(database);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token));
	if (!row) return null;
	if ((executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
		state: params.state,
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) === 0n) return null;
	pruneResolvedSessionSuggestions(database, sessionKey);
	return {
		...toSuggestion(row),
		state: params.state
	};
}
//#endregion
export { listSessionSuggestionsInDatabase as a, finalizeSessionSuggestionClaimInDatabase as i, addSessionSuggestionInDatabase as n, releaseSessionSuggestionDispatchInDatabase as o, claimSessionSuggestionDispatchInDatabase as r, SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS as t };
