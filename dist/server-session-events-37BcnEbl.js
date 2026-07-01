import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { l as asPositiveSafeInteger } from "./number-coercion-CJQ8TR--.js";
import "./agent-scope-CDZXADgT.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-C3ijpoNo.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { t as attachOpenClawTranscriptMeta } from "./session-utils.fs-CuEupzWa.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-OdNGpb-p.js";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-BJ1LyduE.js";
import { a as readSessionMessageCountAsync } from "./session-transcript-readers-B1Z-s_uS.js";
import { g as resolveGatewaySessionStoreTarget, l as loadGatewaySessionRow, u as loadSessionEntry } from "./session-utils-CWlrm3MP.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-BN2HNq2-.js";
import { a as projectChatDisplayMessage, t as resolveTranscriptPathForComparison } from "./session-transcript-path-CJD_TxuP.js";
import { n as hasTrackedActiveSessionRun, t as buildGatewaySessionEventFields } from "./session-event-payload-Bj2f4rz0.js";
//#region src/gateway/session-transcript-key.ts
const TRANSCRIPT_SESSION_KEY_CACHE = /* @__PURE__ */ new Map();
const TRANSCRIPT_SESSION_KEY_CACHE_MAX = 256;
function sessionKeyMatchesTranscriptPath(params) {
	const entry = params.store[params.key];
	if (!entry?.sessionId) return false;
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		store: params.store
	});
	const sessionAgentId = normalizeAgentId(target.agentId);
	return resolveSessionTranscriptCandidates(entry.sessionId, target.storePath, entry.sessionFile, sessionAgentId).some((candidate) => resolveTranscriptPathForComparison(candidate) === params.targetPath);
}
/** Resolve the most likely Gateway session key for a transcript file path. */
function resolveSessionKeyForTranscriptFile(sessionFile) {
	const targetPath = resolveTranscriptPathForComparison(sessionFile);
	if (!targetPath) return;
	const cfg = getRuntimeConfig();
	const { store } = loadCombinedSessionStoreForGateway(cfg);
	const cachedKey = TRANSCRIPT_SESSION_KEY_CACHE.get(targetPath);
	if (cachedKey && sessionKeyMatchesTranscriptPath({
		cfg,
		store,
		key: cachedKey,
		targetPath
	})) return cachedKey;
	const matchingEntries = [];
	for (const [key, entry] of Object.entries(store)) {
		if (!entry?.sessionId || key === cachedKey) continue;
		if (sessionKeyMatchesTranscriptPath({
			cfg,
			store,
			key,
			targetPath
		})) matchingEntries.push([key, entry]);
	}
	if (matchingEntries.length > 0) {
		const matchesBySessionId = /* @__PURE__ */ new Map();
		for (const entry of matchingEntries) {
			const sessionId = entry[1].sessionId;
			if (!sessionId) continue;
			const group = matchesBySessionId.get(sessionId);
			if (group) group.push(entry);
			else matchesBySessionId.set(sessionId, [entry]);
		}
		const resolvedMatches = Array.from(matchesBySessionId.entries()).map(([sessionId, matches]) => {
			const resolvedKey = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId) ?? matches[0]?.[0];
			const resolvedEntry = resolvedKey ? matches.find(([key]) => key === resolvedKey)?.[1] : void 0;
			return resolvedKey && resolvedEntry ? {
				key: resolvedKey,
				updatedAt: resolvedEntry.updatedAt ?? 0
			} : void 0;
		}).filter((match) => match !== void 0);
		const [freshestMatch, secondFreshestMatch] = [...resolvedMatches].toSorted((a, b) => b.updatedAt - a.updatedAt);
		const resolvedKey = resolvedMatches.length === 1 ? freshestMatch?.key : (freshestMatch?.updatedAt ?? 0) > (secondFreshestMatch?.updatedAt ?? 0) ? freshestMatch?.key : void 0;
		if (resolvedKey) {
			if (!TRANSCRIPT_SESSION_KEY_CACHE.has(targetPath) && TRANSCRIPT_SESSION_KEY_CACHE.size >= TRANSCRIPT_SESSION_KEY_CACHE_MAX) {
				const oldest = TRANSCRIPT_SESSION_KEY_CACHE.keys().next().value;
				if (oldest !== void 0) TRANSCRIPT_SESSION_KEY_CACHE.delete(oldest);
			}
			TRANSCRIPT_SESSION_KEY_CACHE.set(targetPath, resolvedKey);
			return resolvedKey;
		}
	}
	TRANSCRIPT_SESSION_KEY_CACHE.delete(targetPath);
}
//#endregion
//#region src/gateway/server-session-events.ts
function resolveSessionMessageBroadcastKeys(sessionKey, agentId) {
	const normalizedAgentId = normalizeOptionalString(agentId);
	if (sessionKey === "global") {
		const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(getRuntimeConfig()));
		if (normalizedAgentId) {
			const scopedKey = `agent:${normalizeAgentId(normalizedAgentId)}:global`;
			return normalizeAgentId(normalizedAgentId) === defaultAgentId ? [scopedKey, sessionKey] : [scopedKey];
		}
		return [`agent:${defaultAgentId}:global`, sessionKey];
	}
	return [sessionKey];
}
function buildGatewaySessionSnapshot(params) {
	const { sessionRow } = params;
	if (!sessionRow) return {};
	const session = params.includeSession ? { ...sessionRow } : void 0;
	if (session && sessionRow.key === "global" && !params.agentId) delete session.goal;
	if (session && params.hasActiveRun !== void 0) session.hasActiveRun = params.hasActiveRun;
	return {
		...session ? { session } : {},
		...buildGatewaySessionEventFields({
			sessionRow,
			agentId: params.agentId,
			label: params.label,
			displayName: params.displayName,
			parentSessionKey: params.parentSessionKey,
			hasActiveRun: params.hasActiveRun
		}),
		subagentRunState: sessionRow.subagentRunState,
		hasActiveSubagentRun: sessionRow.hasActiveSubagentRun
	};
}
/** Creates a serialized transcript-update broadcaster for session websocket clients. */
function createTranscriptUpdateBroadcastHandler(params) {
	let broadcastQueue = Promise.resolve();
	return (update) => {
		broadcastQueue = broadcastQueue.then(() => handleTranscriptUpdateBroadcast(params, update)).catch(() => void 0);
	};
}
async function handleTranscriptUpdateBroadcast(params, update) {
	const sessionKey = update.target?.sessionKey ?? update.sessionKey ?? (update.sessionFile ? resolveSessionKeyForTranscriptFile(update.sessionFile) : void 0);
	if (!sessionKey || update.message === void 0) return;
	const effectiveAgentId = update.target?.agentId ?? update.agentId;
	const defaultGlobalAgentId = sessionKey === "global" ? normalizeAgentId(resolveDefaultAgentId(getRuntimeConfig())) : void 0;
	const visibleAgentId = effectiveAgentId ?? (effectiveAgentId && effectiveAgentId !== defaultGlobalAgentId ? effectiveAgentId : void 0);
	const connIds = /* @__PURE__ */ new Set();
	for (const connId of params.sessionEventSubscribers.getAll()) connIds.add(connId);
	for (const broadcastKey of resolveSessionMessageBroadcastKeys(sessionKey, effectiveAgentId)) for (const connId of params.sessionMessageSubscribers.get(broadcastKey)) connIds.add(connId);
	if (connIds.size === 0) return;
	let messageSeq = asPositiveSafeInteger(update.messageSeq);
	if (messageSeq === void 0) {
		const { entry, storePath } = loadSessionEntry(sessionKey, { agentId: visibleAgentId });
		messageSeq = entry?.sessionId ? asPositiveSafeInteger(await readSessionMessageCountAsync({
			agentId: visibleAgentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey,
			storePath
		})) : void 0;
	}
	const sessionRow = loadGatewaySessionRow(sessionKey, {
		agentId: visibleAgentId,
		transcriptUsageMaxBytes: 64 * 1024
	});
	const sessionSnapshot = buildGatewaySessionSnapshot({
		sessionRow,
		agentId: visibleAgentId,
		includeSession: true,
		hasActiveRun: sessionRow ? hasTrackedActiveSessionRun({
			context: params,
			requestedKey: sessionKey,
			canonicalKey: sessionRow.key,
			...sessionRow.key === "global" && visibleAgentId ? { agentId: visibleAgentId } : {},
			defaultAgentId: normalizeAgentId(resolveDefaultAgentId(getRuntimeConfig()))
		}) : false
	});
	const message = projectChatDisplayMessage(attachOpenClawTranscriptMeta(update.message, {
		...typeof update.messageId === "string" ? { id: update.messageId } : {},
		...messageSeq !== void 0 ? { seq: messageSeq } : {}
	}));
	if (message) {
		params.broadcastToConnIds("session.message", {
			sessionKey,
			...visibleAgentId ? { agentId: visibleAgentId } : {},
			message,
			...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
			...messageSeq !== void 0 ? { messageSeq } : {},
			...sessionSnapshot
		}, connIds, { dropIfSlow: true });
		return;
	}
	const sessionEventConnIds = params.sessionEventSubscribers.getAll();
	if (sessionEventConnIds.size === 0) return;
	params.broadcastToConnIds("sessions.changed", {
		sessionKey,
		...visibleAgentId ? { agentId: visibleAgentId } : {},
		phase: "message",
		ts: Date.now(),
		...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
		...messageSeq !== void 0 ? { messageSeq } : {},
		...sessionSnapshot
	}, sessionEventConnIds, { dropIfSlow: true });
}
/** Creates a lifecycle-event broadcaster for session list refreshes. */
function createLifecycleEventBroadcastHandler(params) {
	return (event) => {
		const connIds = params.sessionEventSubscribers.getAll();
		if (connIds.size === 0) return;
		params.broadcastToConnIds("sessions.changed", {
			sessionKey: event.sessionKey,
			reason: event.reason,
			parentSessionKey: event.parentSessionKey,
			label: event.label,
			displayName: event.displayName,
			ts: Date.now(),
			...buildGatewaySessionSnapshot({
				sessionRow: loadGatewaySessionRow(event.sessionKey),
				label: event.label,
				displayName: event.displayName,
				parentSessionKey: event.parentSessionKey
			})
		}, connIds, { dropIfSlow: true });
	};
}
//#endregion
export { createLifecycleEventBroadcastHandler, createTranscriptUpdateBroadcastHandler };
