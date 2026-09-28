import { n as readCodexNativeHistory, t as consumeCodexHistory } from "./session-history-read-B3ZfSUbF.mjs";
import { SessionManager } from "openclaw/plugin-sdk/agent-sessions";
import { getSessionEntry, parseSqliteSessionFileMarker, resolveTranscriptSessionKeyBySessionId } from "openclaw/plugin-sdk/session-store-runtime";
//#region extensions/codex/src/app-server/session-history.ts
function resolveCodexHistoryTarget(target, admission) {
	if (target.sessionTarget) {
		const { agentId, sessionId, sessionKey, storePath } = target.sessionTarget;
		if (!agentId || !sessionId || !sessionKey || !storePath || sessionId !== target.sessionId || target.agentId !== void 0 && agentId !== target.agentId || target.sessionKey !== void 0 && sessionKey !== target.sessionKey) return { kind: "empty" };
		return {
			kind: "sqlite",
			target: {
				agentId,
				sessionId,
				sessionKey,
				storePath
			}
		};
	}
	const sqliteMarker = parseSqliteSessionFileMarker(target.sessionFile);
	if (sqliteMarker) {
		if (sqliteMarker.sessionId !== target.sessionId || target.agentId !== void 0 && sqliteMarker.agentId !== target.agentId) return { kind: "empty" };
		const sessionKey = resolveSqliteMarkerSessionKey(target, sqliteMarker);
		return sessionKey ? {
			kind: "sqlite",
			target: {
				agentId: sqliteMarker.agentId,
				sessionId: sqliteMarker.sessionId,
				sessionKey,
				storePath: sqliteMarker.storePath
			}
		} : { kind: "empty" };
	}
	if (admission) {
		if (admission.sessionId !== target.sessionId || target.agentId !== void 0 && admission.agentId !== target.agentId || target.sessionKey !== void 0 && admission.sessionKey !== target.sessionKey) return { kind: "empty" };
		return {
			kind: "sqlite",
			target: {
				agentId: admission.agentId,
				sessionId: admission.sessionId,
				sessionKey: admission.sessionKey,
				storePath: admission.storePath
			}
		};
	}
	return {
		kind: "file",
		sessionFile: target.sessionFile
	};
}
/** Returns sanitized session-context messages for consumers that need an owned array. */
async function readCodexMirroredSessionHistoryMessages(target, admission, signal, contextTokenBudget) {
	signal?.throwIfAborted();
	try {
		let result;
		const resolved = resolveCodexHistoryTarget(target, admission);
		const read = (messages) => Array.from(messages);
		if (resolved.kind === "sqlite") {
			const loaded = await SessionManager.openModelContextAsync(resolved.target, {
				admission,
				signal,
				limits: {
					maxBytes: Math.min(67108864, Math.max(1024, Math.floor((contextTokenBudget ?? 128e3) * 8))),
					maxEvents: 1e4,
					toolResultOverflow: "omit"
				}
			});
			result = consumeCodexHistory(loaded.buildSessionContext().messages, loaded.getHeader(), target.sessionId, read, "codex mirrored model context");
		} else {
			const history = await readCodexNativeHistory(resolved, target.sessionId, read, admission);
			result = history.status === "ok" ? history.value : void 0;
		}
		signal?.throwIfAborted();
		return result;
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	}
}
function resolveSqliteMarkerSessionKey(target, marker) {
	const explicitSessionKey = target.sessionKey?.trim();
	if (explicitSessionKey) {
		const explicitEntry = getSessionEntry({
			agentId: marker.agentId,
			sessionKey: explicitSessionKey,
			storePath: marker.storePath
		});
		if (explicitEntry) return explicitEntry.sessionId === marker.sessionId ? explicitSessionKey : void 0;
	}
	return resolveTranscriptSessionKeyBySessionId({
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		storePath: marker.storePath
	});
}
//#endregion
export { resolveCodexHistoryTarget as n, readCodexMirroredSessionHistoryMessages as t };
