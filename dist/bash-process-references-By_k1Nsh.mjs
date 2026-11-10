import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { A as deriveSessionName, a as compareProcessSessionStartOrder, m as listRunningSessions } from "./bash-process-registry-D3AARAgk.mjs";
//#region src/agents/bash-process-references.ts
/**
* Compact references for active background bash sessions.
* These references are surfaced in agent context so follow-up turns can
* reconnect to prior long-running work.
*/
const DEFAULT_ACTIVE_PROCESS_LIMIT = 8;
const MAX_COMMAND_LABEL_CHARS = 140;
/** List active background process sessions for one scope key, newest first. */
function listActiveProcessSessionReferences(params) {
	const scopeKey = params.scopeKey?.trim();
	if (!scopeKey) return [];
	const now = params.now ?? Date.now();
	const limit = typeof params.limit === "number" && Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : DEFAULT_ACTIVE_PROCESS_LIMIT;
	return listRunningSessions().filter((session) => session.scopeKey === scopeKey).toSorted(compareProcessSessionStartOrder).slice(0, limit).map((session) => ({
		sessionId: session.id,
		status: "running",
		pid: session.pid,
		startedAt: session.startedAt,
		runtimeMs: Math.max(0, now - session.startedAt),
		cwd: session.cwd,
		command: session.command,
		name: truncateWithMarker(deriveSessionName(session.command) || session.command, MAX_COMMAND_LABEL_CHARS, {
			marker: "...",
			reserve: 3,
			trimEnd: false
		}),
		tail: session.tail,
		truncated: session.truncated
	}));
}
//#endregion
export { listActiveProcessSessionReferences as t };
