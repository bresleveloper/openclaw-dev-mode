import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import "./session-suggestion-policy-D8gImch7.mjs";
import { a as SessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { r as sessionMetadataExpectedEntryMatches } from "./session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-DNiqiZkm.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-suggestion-store.kernel.ts
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
function assertSessionTarget(database, sessionKey, params) {
	if (params.expectedEntry) {
		if (params.expectedSessionId !== void 0 && params.expectedSessionId !== params.expectedEntry.sessionId || !sessionMetadataExpectedEntryMatches(database, sessionKey, params.expectedEntry)) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
		return;
	}
	if (params.expectedSessionId !== void 0 && readSessionEntryInstanceId(database, sessionKey) !== params.expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
}
function pruneResolvedSessionSuggestions(database, sessionKey) {
	const db = suggestionDb(database);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("id", "in", db.selectFrom("session_suggestions").select("id").where("session_key", "=", sessionKey).where("state", "!=", "pending").orderBy("created_at", "desc").orderBy("id", "desc").limit((eb) => eb.lit(-1)).offset((eb) => eb.lit(200))));
}
function addSessionSuggestionInDatabase(database, sessionKey, params) {
	const authorId = params.authorId.trim();
	const authorLabel = params.authorLabel?.trim() || void 0;
	const text = params.text;
	if (!authorId || !text.trim()) throw new Error("suggestion author and text are required");
	const suggestion = {
		id: params.id ?? randomUUID(),
		authorId,
		...authorLabel ? { authorLabel } : {},
		text,
		createdAt: params.createdAt ?? Date.now(),
		state: "pending"
	};
	assertSessionTarget(database, sessionKey, params);
	const db = suggestionDb(database);
	pruneResolvedSessionSuggestions(database, sessionKey);
	const pendingCounts = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select((eb) => ["author_id", eb.fn.countAll().as("count")]).where("session_key", "=", sessionKey).where("state", "=", "pending").groupBy("author_id")).rows.reduce((counts, row) => ({
		session: counts.session + row.count,
		author: counts.author + (row.author_id === suggestion.authorId ? row.count : 0)
	}), {
		session: 0,
		author: 0
	});
	if (pendingCounts.session >= 100) throw new Error("session pending suggestion limit reached");
	if (pendingCounts.author >= 20) throw new Error("author pending suggestion limit reached");
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
	assertSessionTarget(database, sessionKey, params);
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
	if (row.dispatch_token && row.dispatch_started_at !== null && now - row.dispatch_started_at < 3e4) return { kind: "busy" };
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
	assertSessionTarget(database, sessionKey, params);
	return (executeSqliteQuerySync(database.db, suggestionDb(database).updateTable("session_suggestions").set({
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) > 0n;
}
function finalizeSessionSuggestionClaimInDatabase(database, sessionKey, params) {
	assertSessionTarget(database, sessionKey, params);
	const db = suggestionDb(database);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.updateTable("session_suggestions").set({
		state: params.state,
		dispatch_token: null,
		dispatch_started_at: null,
		dispatch_resolution: null
	}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token).returning([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]));
	if (!row) return null;
	pruneResolvedSessionSuggestions(database, sessionKey);
	return toSuggestion(row);
}
//#endregion
export { releaseSessionSuggestionDispatchInDatabase as a, listSessionSuggestionsInDatabase as i, claimSessionSuggestionDispatchInDatabase as n, finalizeSessionSuggestionClaimInDatabase as r, addSessionSuggestionInDatabase as t };
