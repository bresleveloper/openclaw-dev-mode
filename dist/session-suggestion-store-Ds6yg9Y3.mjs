import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as sessionMetadataExpectedEntryMatches } from "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { i as finalizeSessionSuggestionClaimInDatabase, n as addSessionSuggestionInDatabase, o as releaseSessionSuggestionDispatchInDatabase, r as claimSessionSuggestionDispatchInDatabase } from "./session-suggestion-store.kernel-BJlDtUvU.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-suggestion-store.ts
function resolveDatabaseOptions(scope) {
	return toDatabaseOptions(resolveSqliteScope(scope));
}
function assertSuggestionExpectedEntry(database, sessionKey, expectedEntry, options) {
	if (expectedEntry && !sessionMetadataExpectedEntryMatches(database, sessionKey, expectedEntry, options)) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
}
function addSessionSuggestion(scope, params) {
	const authorId = params.authorId.trim();
	const authorLabel = params.authorLabel?.trim() || void 0;
	const text = params.text;
	if (!authorId || !text.trim()) throw new Error("suggestion author and text are required");
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	const suggestion = {
		id: params.id ?? randomUUID(),
		authorId,
		...authorLabel ? { authorLabel } : {},
		text,
		createdAt: params.createdAt ?? Date.now(),
		state: "pending"
	};
	runOpenClawAgentWriteTransaction((database) => {
		assertSuggestionExpectedEntry(database, sessionKey, params.expectedEntry, options);
		return addSessionSuggestionInDatabase(database, sessionKey, {
			suggestion,
			expectedSessionId: params.expectedSessionId
		});
	}, options, { operationLabel: "session.suggestion.add" });
	return suggestion;
}
function claimSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => {
		assertSuggestionExpectedEntry(database, sessionKey, params.expectedEntry, options);
		return claimSessionSuggestionDispatchInDatabase(database, sessionKey, params);
	}, options, { operationLabel: "session.suggestion.claim" });
}
function releaseSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => releaseSessionSuggestionDispatchInDatabase(database, sessionKey, params), options, { operationLabel: "session.suggestion.release" });
}
function finalizeSessionSuggestionClaim(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => {
		assertSuggestionExpectedEntry(database, sessionKey, params.expectedEntry, options);
		return finalizeSessionSuggestionClaimInDatabase(database, sessionKey, params);
	}, options, { operationLabel: "session.suggestion.finalize" });
}
//#endregion
export { releaseSessionSuggestionDispatch as i, claimSessionSuggestionDispatch as n, finalizeSessionSuggestionClaim as r, addSessionSuggestion as t };
