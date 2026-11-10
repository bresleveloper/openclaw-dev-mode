import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BT22ajgI.mjs";
//#region src/gateway/session-transcript-read-target.ts
async function resolveTranscriptReadTarget(scope) {
	const target = captureSessionActorTranscriptRead(scope)?.target ?? (() => {
		const prepared = prepareSessionTranscriptReadTargetCore(scope, resolveSessionStorePathForScope);
		return {
			agentId: prepared.agentId,
			sessionId: scope.sessionId,
			sessionKey: prepared.entryValidationScope ? resolveSqliteSessionKey(prepared.entryValidationScope.sessionKey, prepared.agentId) : prepared.sessionKey,
			storePath: prepared.storePath
		};
	})();
	return {
		agentId: target.agentId,
		sessionFile: target.sessionKey ?? target.sessionId,
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		storePath: target.storePath
	};
}
function toTranscriptReadScope(target) {
	return {
		...target.agentId ? { agentId: target.agentId } : {},
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		...target.storePath ? { storePath: target.storePath } : {}
	};
}
//#endregion
export { toTranscriptReadScope as n, resolveTranscriptReadTarget as t };
