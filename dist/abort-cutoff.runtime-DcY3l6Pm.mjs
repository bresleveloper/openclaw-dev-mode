import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as hasAbortCutoff, t as applyAbortCutoffToSessionEntry } from "./abort-cutoff-D4dHXewY.mjs";
//#region src/auto-reply/reply/abort-cutoff.runtime.ts
/** Runtime persistence helper for clearing abort-cutoff state from sessions. */
/** Clears abort cutoff state in memory and persisted session storage. */
async function clearAbortCutoffInSessionRuntime(params) {
	const { sessionEntry, sessionStore, sessionKey, storePath } = params;
	if (!sessionEntry || !sessionStore || !sessionKey || !hasAbortCutoff(sessionEntry)) return false;
	applyAbortCutoffToSessionEntry(sessionEntry, void 0);
	const updatedAt = Date.now();
	sessionEntry.updatedAt = updatedAt;
	sessionStore[sessionKey] = sessionEntry;
	if (storePath) await patchSessionEntryCore({
		storePath,
		sessionKey
	}, () => ({
		abortCutoffMessageSid: void 0,
		abortCutoffTimestamp: void 0,
		updatedAt
	}), { fallbackEntry: sessionEntry });
	return true;
}
//#endregion
export { clearAbortCutoffInSessionRuntime };
