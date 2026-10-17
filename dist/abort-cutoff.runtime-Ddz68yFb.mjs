import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { n as hasAbortCutoff, t as applyAbortCutoffToSessionEntry } from "./abort-cutoff-DNSrZhGE.mjs";
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
