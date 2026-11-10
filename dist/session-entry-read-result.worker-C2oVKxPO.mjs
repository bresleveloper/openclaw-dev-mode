import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { i as encodeSessionTranscriptWorkerError } from "./session-history-worker-errors-D75quOgT.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { c as loadSessionEntryReadOnlyResultInScope } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { t as readExactSessionEntryFactsInDatabase } from "./session-accessor.sqlite-entry-facts.worker-D7R198Xs.mjs";
//#region src/config/sessions/session-entry-read-result.worker.ts
/** Native writer operations must finish their captured-database reads synchronously. */
function readSessionEntryResult(request, capturedDatabase) {
	let source;
	let facts;
	const read = loadSessionEntryReadOnlyResultInScope({
		...request.scope,
		env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
	}, request.continuation, (readSource) => {
		if (typeof readSource.databaseIdentity !== "string") throw new Error("Private session entry requires its process-held owner");
		source = {
			...readSource,
			databaseIdentity: readSource.databaseIdentity
		};
	}, (database, sessionKey, projection) => {
		const selected = readExactSessionEntryFactsInDatabase(database, collectSessionEntryLookupKeys(sessionKey), projection);
		const captured = captureSessionEntryReadSource(database, void 0);
		facts = {
			kind: "session-exact-entries",
			...selected,
			source: captured,
			databaseIdentity: {
				...readOpenClawAgentDatabaseIdentity(database),
				identity: captured.databaseIdentity
			},
			lifecycleTimestamps: {}
		};
		return selected.entries.find((row) => row.sessionKey === sessionKey.trim())?.entry;
	}, capturedDatabase);
	if (!read.ok) {
		const readError = encodeSessionTranscriptWorkerError(read.error);
		if (!readError || readError.kind === "fence") throw read.error;
		return {
			kind: "session-entry-read",
			entry: void 0,
			source,
			readError
		};
	}
	return {
		kind: "session-entry-read",
		entry: read.value,
		source,
		facts
	};
}
//#endregion
export { readSessionEntryResult };
