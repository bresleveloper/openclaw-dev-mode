import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { n as selectConversationRowsFromDatabase } from "./session-accessor.sqlite-conversation-read-C_ZuagCK.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
import { t as createSessionEntryReadScope } from "./session-entry-cohort.worker-JqxX8IrB.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-source-predicate.worker.ts
/** Currentness reads use the same admitted database and snapshot as entry reads. */
function readSessionSourceChecks(request, capturedDatabase) {
	const { readDatabase, snapshot } = createSessionEntryReadScope(capturedDatabase);
	const result = readDatabase((database) => snapshot(database, () => ({
		kind: "session-exact-entries",
		entries: [],
		lifecycleTimestamps: {},
		sourceValidation: readSessionSourceValidation(database, request.sourceChecks)
	})), {
		...request.database,
		env: request.env
	});
	if (result.found) return result.value;
	if (result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-exact-entries",
		entries: [],
		lifecycleTimestamps: {},
		sourceValidation: {
			conversationMatches: [],
			refusedSource: {
				index: 0,
				facts: { entry: void 0 }
			}
		}
	};
}
function readSessionSourceValidation(database, sources, identity = readOpenClawAgentDatabaseIdentity(database).identity, entries) {
	const validation = { conversationMatches: [] };
	for (const [index, source] of (sources ?? []).entries()) {
		if (identity !== source.source.databaseIdentity) return {
			...validation,
			refusedSource: {
				index,
				facts: { entry: void 0 }
			}
		};
		const entry = entries?.has(source.sessionKey) ? entries.get(source.sessionKey) : readExactSessionEntryRowValidated(database, source.sessionKey)?.entry;
		const members = source.members === void 0 ? void 0 : listSessionMembersInDatabase(database, source.sessionKey).map((member) => member.identityId);
		const alternatives = source.conversationAlternatives;
		let matching;
		if (alternatives) {
			const refs = [...new Set(alternatives.flatMap((alternative) => alternative.map(({ conversationRef }) => conversationRef)))];
			const rows = refs.length ? selectConversationRowsFromDatabase(database, {
				conversationRefs: refs,
				currentBindingOnly: true
			}) : [];
			const selected = new Map(rows.map((row) => [row.conversationRef, row.sessionKey && row.sessionId ? row.sessionKey : null]));
			matching = alternatives.flatMap((alternative, alternativeIndex) => alternative.every((predicate) => (selected.get(predicate.conversationRef) ?? null) === predicate.sessionKey) ? [alternativeIndex] : []);
		}
		if (Boolean(entry) !== Boolean(source.expected) || source.fields.some((field) => !isDeepStrictEqual(entry?.[field], source.expected?.[field])) || matching?.length === 0 || members !== void 0 && !isDeepStrictEqual(members, source.members) || source.transcript && !isDeepStrictEqual({ ...readTranscriptContextVersionInTransaction(database, source.transcript.sessionId) }, source.transcript.version)) return {
			...validation,
			refusedSource: {
				index,
				facts: {
					entry,
					members
				}
			}
		};
		if (matching) validation.conversationMatches.push({
			index,
			alternatives: matching
		});
	}
	return validation;
}
//#endregion
export { readSessionSourceValidation as n, readSessionSourceChecks as t };
