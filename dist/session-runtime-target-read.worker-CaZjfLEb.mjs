import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
//#region src/config/sessions/session-runtime-target-read.worker.ts
/** Resolve a private transcript target without loading broad entry hydration. */
async function readSessionRuntimeTargetWorkerRequest(request) {
	const { readSessionTranscriptRuntimeTarget } = await import("./session-accessor.transcript-target-CMhFR0WN.mjs");
	const read = withOpenClawAgentDatabaseReadOnly((database) => ({
		target: readSessionTranscriptRuntimeTarget(request.scope, {
			keyFormat: request.keyFormat,
			databaseAgentId: request.database.agentId,
			continuation: request.continuation
		}, database),
		source: captureSessionEntryReadSource(database, void 0, "Session runtime target requires its current durable owner")
	}), {
		...request.database,
		env: request.scope.env
	});
	return {
		kind: "session-runtime-target",
		...read.found ? read.value : { target: {
			agentId: request.scope.agentId,
			sessionId: request.scope.sessionId,
			sessionKey: resolveSqliteSessionKey(request.scope.sessionKey, request.scope.agentId),
			storePath: request.scope.storePath,
			...request.keyFormat ? {
				selectedSessionId: null,
				selectedLifecycleRevision: null
			} : {}
		} }
	};
}
//#endregion
export { readSessionRuntimeTargetWorkerRequest };
