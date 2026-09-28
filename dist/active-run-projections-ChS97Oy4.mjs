import { c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, i as ACTIVE_EMBEDDED_RUNS, s as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE } from "./run-state-CTlPY590.mjs";
import { _ as resolveActiveReplyRunSessionId, f as listActiveReplyRunSessionIds, p as listActiveReplyRunSessionKeys, s as getActiveReplyRunCount } from "./reply-run-registry.registry-DycIsDrE.mjs";
//#region src/agents/embedded-agent-runner/active-run-projections.ts
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
function getActiveEmbeddedRunCount() {
	let activeCount = ACTIVE_EMBEDDED_RUNS.size;
	for (const sessionId of listActiveReplyRunSessionIds()) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) activeCount += 1;
	return Math.max(activeCount, getActiveReplyRunCount());
}
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
function listActiveEmbeddedRunSessionKeys() {
	return [.../* @__PURE__ */ new Set([...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(), ...listActiveReplyRunSessionKeys()])].toSorted((a, b) => a.localeCompare(b));
}
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
function listActiveEmbeddedRunSessionIds() {
	return [.../* @__PURE__ */ new Set([
		...ACTIVE_EMBEDDED_RUNS.keys(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
		...listActiveReplyRunSessionIds()
	])].toSorted((a, b) => a.localeCompare(b));
}
/** Resolves the current session id for an active run after resets or compaction. */
function resolveActiveEmbeddedRunSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return resolveActiveReplyRunSessionId(normalizedSessionKey) ?? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
//#endregion
export { resolveActiveEmbeddedRunSessionId as i, listActiveEmbeddedRunSessionIds as n, listActiveEmbeddedRunSessionKeys as r, getActiveEmbeddedRunCount as t };
