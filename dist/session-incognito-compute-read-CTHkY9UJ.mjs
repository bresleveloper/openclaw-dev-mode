import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { t as createCodexSessionContextReader } from "./codex-session-transcript-runtime-QilKmM9j.mjs";
import path from "node:path";
//#region src/config/sessions/session-incognito-compute-read.ts
async function readContextResult(result) {
	const settled = await result;
	if (!settled.ok) throw new SessionTranscriptReadFenceError(settled.message);
	return settled.value;
}
/** Inactive adapters retain one actor; P7 supplies them to the production owners. */
function bindIncognitoSessionComputeReader(params) {
	const { actor, authority, signal } = params;
	actor.assertCurrent();
	authority.assertCurrent();
	const target = structuredClone(params.target);
	const identity = {
		...target,
		agentId: actor.agentId,
		storePath: actor.path
	};
	const claim = actor.sessions.captureCurrent(target.sessionKey);
	const disclose = () => {
		signal?.throwIfAborted();
		claim.authorize(authority, "commit");
		actor.assertCurrent();
	};
	const assertScope = (scope) => {
		disclose();
		if (scope.sessionId !== void 0 && scope.sessionId !== target.sessionId || scope.sessionKey !== void 0 && scope.sessionKey !== target.sessionKey || scope.agentId !== void 0 && scope.agentId !== actor.agentId || scope.storePath !== void 0 && path.resolve(scope.storePath) !== actor.path) throw new Error("Incognito compute read belongs to another session or store");
	};
	const retain = (operation) => actor.sessions.withCompute(authority, target, operation, signal);
	return {
		memoryEntry(absPath, options = {}) {
			const captured = structuredClone(options);
			assertScope(captured);
			return retain(async () => {
				const snapshot = await actor.sessions.history(authority, {
					type: "session.history.memory-entry",
					input: target
				}, signal);
				const { buildSessionEntryFromSnapshot } = await import("./session-files-l7Kk1G0N.mjs");
				return buildSessionEntryFromSnapshot(absPath, {
					...captured,
					...identity
				}, snapshot, disclose);
			});
		},
		memoryResetRecall: () => retain(async () => {
			const cutoff = await actor.sessions.history(authority, {
				type: "session.history.memory-reset-recall",
				input: target
			}, signal);
			disclose();
			return cutoff;
		}),
		nativeContext: createCodexSessionContextReader({
			assertCurrent: assertScope,
			read: () => readContextResult(actor.sessions.history(authority, {
				type: "session.history.native-context",
				input: target
			}, signal)),
			validate: ({ version }) => readContextResult(actor.sessions.history(authority, {
				type: "session.history.native-context-current",
				input: {
					...target,
					version
				}
			}, signal)),
			retain
		})
	};
}
//#endregion
export { bindIncognitoSessionComputeReader };
