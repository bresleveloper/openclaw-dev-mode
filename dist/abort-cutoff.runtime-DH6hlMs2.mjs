import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { n as hasAbortCutoff, t as applyAbortCutoffToSessionEntry } from "./abort-cutoff-Cy_3zrWp.mjs";
//#region src/auto-reply/reply/abort-cutoff.runtime.ts
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
