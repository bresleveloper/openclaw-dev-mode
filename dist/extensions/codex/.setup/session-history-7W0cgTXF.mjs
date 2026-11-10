import { n as readCodexNativeHistory, t as consumeCodexHistory } from "./session-history-read-BI_2jRED.mjs";
import { resolveAgentHarnessHistoryLimits } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
import { SessionManager } from "openclaw/plugin-sdk/agent-sessions";
import { getSessionEntryAsync, parseSqliteSessionFileMarker } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveSessionTranscriptIdentity } from "openclaw/plugin-sdk/session-transcript-runtime";
//#region extensions/codex/src/app-server/session-history.ts
/** Reads bounded model context from the Codex transcript mirror. */
async function resolveCodexHistoryTarget(target, admission) {
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
		const sessionKey = await resolveSqliteMarkerSessionKey(target, sqliteMarker);
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
		const resolved = await resolveCodexHistoryTarget(target, admission);
		const read = (messages) => Array.from(messages);
		if (resolved.kind === "sqlite") {
			const loaded = await SessionManager.openModelContextAsync(resolved.target, {
				admission,
				signal,
				limits: resolveAgentHarnessHistoryLimits(contextTokenBudget)
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
async function resolveSqliteMarkerSessionKey(target, marker) {
	const explicitSessionKey = target.sessionKey?.trim();
	if (explicitSessionKey) {
		const explicitEntry = await getSessionEntryAsync({
			agentId: marker.agentId,
			sessionKey: explicitSessionKey,
			storePath: marker.storePath
		});
		if (explicitEntry) return explicitEntry.sessionId === marker.sessionId ? explicitSessionKey : void 0;
	}
	return (await resolveSessionTranscriptIdentity({
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		storePath: marker.storePath,
		sessionKey: ""
	})).sessionKey || void 0;
}
//#endregion
export { resolveCodexHistoryTarget as n, readCodexMirroredSessionHistoryMessages as t };
