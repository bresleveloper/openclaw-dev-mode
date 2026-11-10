import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as resolveConcreteSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { i as resolveExplicitSessionStorePathForScope } from "./paths-YgcBNLgG.mjs";
import { l as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
//#region src/config/sessions/session-accessor.transcript-read-target.ts
function prepareSessionTranscriptReadTargetCore(scope, resolveDefaultStorePath) {
	const sessionKey = scope.sessionKey?.trim();
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${sessionKey}`);
	const boundScope = {
		...scope,
		agentId,
		sessionKey,
		storePath: resolveConcreteSessionStorePath(scope.storePath)
	};
	const storePath = resolveExplicitSessionStorePathForScope(boundScope) ?? resolveDefaultStorePath?.(boundScope);
	if (!storePath) throw new Error("Transcript reads require a concrete session store path");
	return {
		agentId,
		sessionKey,
		storePath,
		entryValidationScope: sessionKey && scope.sessionEntry?.sessionId !== scope.sessionId ? {
			agentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey,
			storePath
		} : void 0
	};
}
/** Resolve a prepared store directly; only unbound callers need runtime configuration. */
function resolveSessionTranscriptReadTargetCore(scope, resolveDefaultStorePath) {
	const { agentId, sessionKey, storePath, entryValidationScope } = prepareSessionTranscriptReadTargetCore(scope, resolveDefaultStorePath);
	const resolvedSessionKey = (entryValidationScope ? resolveSessionEntry(entryValidationScope, { readOnly: true }) : void 0)?.normalizedKey ?? sessionKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		storePath,
		...resolvedSessionKey ? { sessionKey: resolvedSessionKey } : {}
	};
}
//#endregion
export { resolveSessionTranscriptReadTargetCore as n, prepareSessionTranscriptReadTargetCore as t };
