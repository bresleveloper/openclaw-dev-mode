import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { m as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as runQueuedStoreWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { i as sameSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-CqmhHNa_.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-MlBhwaKa.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
//#region src/agents/sessions/session-manager-write-admission.ts
const detachedWriterQueues = resolveGlobalSingleton(Symbol.for("openclaw.sessionManagerDetachedWriterQueues"), () => /* @__PURE__ */ new WeakMap());
/** Keep the manager operation, committed view adoption, and cleanup in one storage admission. */
async function withSessionManagerWrite(manager, write) {
	const target = manager.getSessionTarget();
	if (!target) {
		const sessionId = manager.getSessionId();
		const queues = detachedWriterQueues.get(manager) ?? /* @__PURE__ */ new Map();
		detachedWriterQueues.set(manager, queues);
		return await trackAsyncWork(() => runQueuedStoreWrite({
			queues,
			storePath: "session",
			label: "detached session write admission",
			reentrant: true,
			fn: async () => {
				if (manager.getSessionTarget() || manager.getSessionId() !== sessionId) throw new Error("Session manager identity changed before transcript write admission");
				return await write();
			}
		}));
	}
	const identity = { ...target };
	const assertCurrent = captureOwnedTranscriptWriteAssertion(identity);
	const options = toDatabaseOptions(resolveSqliteReadScope(identity));
	options.env = captureSessionTranscriptStorageEnvironment(options.env ?? process.env);
	options.path = resolveOpenClawAgentSqlitePath(options);
	return await trackAsyncWork(() => runOpenClawAgentWriteAdmission(options, () => withOpenClawAgentDatabaseAsync(options, (database) => {
		const current = manager.getSessionTarget();
		if (!sameSessionTranscriptTargetBinding(identity, current)) throw new Error("Session manager identity changed before transcript write admission");
		return write({
			database,
			options
		});
	}, assertCurrent), true));
}
//#endregion
export { withSessionManagerWrite as t };
