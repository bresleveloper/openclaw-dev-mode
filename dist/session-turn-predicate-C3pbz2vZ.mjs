import { o as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { c as resolveTerminalAssistantTranscriptRunId, o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { r as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { _ as readTranscriptEventMessage, n as findAssistantTranscriptEventInDatabase } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
//#region src/config/sessions/session-turn-predicate.ts
let resolveSessionWorkStartError;
let readGatewaySessionStore;
let prepareRoutingLookup;
async function prepareSessionTurnPredicates() {
	resolveSessionWorkStartError = (await import("./lifecycle-Ber9v_tc.mjs")).resolveSessionWorkStartError;
	const { prepareGatewaySessionStoreTargetLookup } = await import("./session-utils-store-lookup-BgLchmyY.mjs");
	prepareRoutingLookup = prepareGatewaySessionStoreTargetLookup;
	({readGatewaySessionStore} = await import("./session-utils-store-read-BbF31dfi.mjs"));
}
function prepareSessionTurnRouting(predicate, env) {
	if (!predicate) return;
	if (!prepareRoutingLookup) throw new Error("Session turn predicates were not prepared");
	let current;
	const lookup = prepareRoutingLookup({
		cfg: predicate.config,
		env,
		key: predicate.key,
		agentId: predicate.agentId,
		exactRead: true,
		readOnly: true,
		projection: "list",
		readStore(read) {
			if (!current) throw new Error("Session routing requires its transaction database");
			if (!isSameOpenClawAgentDatabasePath(paths.get(read), current.path)) return readGatewaySessionStore(read);
			const keys = read.options.exactKeys ?? [];
			const row = prepareExactSessionEntryRowReads(current, keys, "list");
			return Object.fromEntries(keys.flatMap((key) => {
				const entry = row(key)?.entry;
				return entry ? [[key, entry]] : [];
			}));
		}
	});
	const paths = new Map(lookup.reads.map((read) => [read, resolveSqliteTargetFromSessionStorePath(read.storePath, {
		agentId: read.agentId,
		env
	}).path]));
	return (database) => {
		current = database;
		const target = lookup.resolve();
		if (target.storePath !== predicate.storePath || target.canonicalKey !== predicate.canonicalKey) throw new Error("Session routing changed before Goal admission; refresh and retry.");
	};
}
function sessionTurnPredicateMatches(database, resolved, predicate) {
	if (!predicate) return true;
	if (predicate.kind === "active-entry") {
		if (!readActiveTranscriptEntryAnchorInTransaction({
			database,
			resolved,
			entryId: predicate.entryId
		})) throw new Error(predicate.errorMessage);
		return true;
	}
	const latest = findAssistantTranscriptEventInDatabase(database, resolved.sessionId);
	const message = latest ? readTranscriptEventMessage(latest.event) : void 0;
	return resolveTerminalAssistantTranscriptRunId(message, readSessionTranscriptRunId(message)) !== predicate.runId || extractAssistantPhaseText(message)?.trim() !== predicate.text;
}
function assertSessionTurnAcceptedResult(sessionKey, entry, options) {
	const guard = options.acceptedResultGuard;
	if (!guard) return;
	if (entry.activeWriterRunId !== (guard.expectedWriterRunId ?? void 0)) throw new Error(guard.errorMessage);
	if (!resolveSessionWorkStartError) throw new Error("Session turn predicates were not prepared");
	const error = resolveSessionWorkStartError(sessionKey, entry, {
		expectedSessionId: options.expectedSessionId,
		purpose: "accepted-result-settlement"
	});
	if (error) throw new Error(error);
}
//#endregion
export { sessionTurnPredicateMatches as i, prepareSessionTurnPredicates as n, prepareSessionTurnRouting as r, assertSessionTurnAcceptedResult as t };
