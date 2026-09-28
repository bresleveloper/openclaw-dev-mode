import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as resolveSessionEventAgentScope, o as resolveSessionSubscriptionKey, s as resolveSessionSubscriptionKeys, t as resolvePrivateSessionEventBroadcastScope } from "./session-request-agent-DN7PUqhR.mjs";
import { n as withReadySessionRows } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-COSfbADi.mjs";
import { n as readSessionMessageByIdAsync, r as readSessionMessageCountAsync } from "./session-transcript-readers-nuptsJ6Q.mjs";
import { i as projectChatDisplayMessage } from "./chat-display-projection.core-DpiCCyQ3.mjs";
import { a as readTranscriptDisplayPosition } from "./transcript-image-artifacts-BJipDW7F.mjs";
import "./chat-display-projection-ON0OJ8aM.mjs";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-D02Dxvte.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-BTtvEIz2.mjs";
import { t as projectSessionMessagePayload } from "./session-transcript-message-C5G8VRkZ.mjs";
import path from "node:path";
//#region src/gateway/server-session-events.ts
async function withPreparedEventRow(projection, query, publish) {
	if (!projection || !query) {
		publish();
		return;
	}
	await withReadySessionRows(projection, () => [query], publish, { includeAncestors: true });
}
function readTranscriptUpdateLifecycleOwner(update, projection) {
	const marker = parseSqliteSessionFileMarker(update.sessionFile);
	const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? (marker ? projection?.findBySessionId(marker)[0]?.key : void 0);
	if (!sessionKey) return;
	const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? marker?.agentId;
	const sessionId = normalizeOptionalString(update.target?.sessionId) ?? normalizeOptionalString(update.sessionId) ?? marker?.sessionId;
	const storePath = normalizeOptionalString(update.target?.storePath) ?? marker?.storePath;
	const ownerAgentId = agentId ?? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey)?.[1];
	const entry = ownerAgentId ? projection?.capture({
		agentId: ownerAgentId,
		key: sessionKey,
		storePath
	})?.entry : void 0;
	if (!entry || sessionId && entry.sessionId !== sessionId) return;
	const lifecycleRevision = normalizeOptionalString(entry.lifecycleRevision);
	return lifecycleRevision ? { lifecycleRevision } : {};
}
/** Creates a serialized transcript-update broadcaster for session websocket clients. */
function createTranscriptUpdateBroadcastHandler(params) {
	const broadcastQueues = /* @__PURE__ */ new Map();
	return (update) => {
		const projection = params.getSessionRowProjection?.();
		const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision) ?? (update.message !== void 0 ? readTranscriptUpdateLifecycleOwner(update, projection)?.lifecycleRevision : void 0);
		const queuedUpdate = lifecycleRevision ? {
			...update,
			lifecycleRevision
		} : update;
		const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
		const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? (legacyMarker ? projection?.findBySessionId(legacyMarker)[0]?.key : void 0);
		const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? legacyMarker?.agentId;
		const agentScope = sessionKey ? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, agentId) : void 0;
		if (agentScope === null) return Promise.resolve();
		const laneKey = sessionKey && agentScope?.[1] ? resolveSessionSubscriptionKey(sessionKey, agentScope[1]) : sessionKey ?? normalizeOptionalString(update.sessionFile) ?? "";
		const task = (broadcastQueues.get(laneKey) ?? Promise.resolve()).then(async () => {
			return handleTranscriptUpdateBroadcast(params, queuedUpdate, agentScope, projection);
		});
		const settled = task.then(() => void 0, () => void 0);
		broadcastQueues.set(laneKey, settled);
		settled.then(() => {
			if (broadcastQueues.get(laneKey) === settled) broadcastQueues.delete(laneKey);
		});
		return task;
	};
}
async function handleTranscriptUpdateBroadcast(params, update, capturedAgentScope, projection) {
	const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
	const targetAgentId = normalizeOptionalString(update.target?.agentId);
	const targetSessionId = normalizeOptionalString(update.target?.sessionId);
	const targetSessionKey = normalizeOptionalString(update.target?.sessionKey);
	const suppliedSessionKey = normalizeOptionalString(update.sessionKey);
	const candidateSessionKey = targetSessionKey ?? suppliedSessionKey;
	const targetKeyAgentId = parseAgentSessionKey(candidateSessionKey)?.agentId;
	const targetStorePath = normalizeOptionalString(update.target?.storePath);
	const completeTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const markerMatches = legacyMarker && !completeTarget ? projection?.findBySessionId(legacyMarker) ?? [] : [];
	const candidateKeyEntry = candidateSessionKey && legacyMarker && !completeTarget ? projection?.capture({
		agentId: legacyMarker.agentId,
		key: candidateSessionKey,
		storePath: legacyMarker.storePath
	})?.entry : void 0;
	if (targetKeyAgentId && targetAgentId && targetKeyAgentId !== targetAgentId) return;
	if (legacyMarker && !completeTarget && (targetAgentId && targetAgentId !== legacyMarker.agentId || targetSessionId && targetSessionId !== legacyMarker.sessionId && candidateKeyEntry?.sessionId !== legacyMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== legacyMarker.agentId || candidateSessionKey && (candidateKeyEntry && candidateKeyEntry.sessionId !== legacyMarker.sessionId || !candidateKeyEntry && markerMatches.length > 0) || targetStorePath && path.resolve(targetStorePath) !== path.resolve(legacyMarker.storePath))) return;
	const compatibleLegacyMarker = completeTarget ? void 0 : legacyMarker;
	const sessionKey = compatibleLegacyMarker ? candidateKeyEntry?.sessionId === compatibleLegacyMarker.sessionId || !candidateKeyEntry && markerMatches.length === 0 ? candidateSessionKey : markerMatches[0]?.key : candidateSessionKey;
	if (!sessionKey) return;
	const agentScope = capturedAgentScope ?? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, compatibleLegacyMarker?.agentId ?? targetAgentId ?? update.agentId);
	if (!agentScope) return;
	const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = agentScope;
	const privateBroadcastScope = resolvePrivateSessionEventBroadcastScope(sessionKey, agentScope);
	const connIds = /* @__PURE__ */ new Set();
	for (const connId of params.sessionEventSubscribers.getAll()) connIds.add(connId);
	const broadcastKeys = routingAgentId ? resolveSessionSubscriptionKeys(sessionKey, routingAgentId, compatibilityOwnerAgentId) : [sessionKey];
	for (const broadcastKey of broadcastKeys) for (const connId of params.sessionMessageSubscribers.get(broadcastKey)) connIds.add(connId);
	if (connIds.size === 0) {
		if (!hasSessionChangeReceivers(connIds) || update.message !== void 0 && projectChatDisplayMessage(update.message)) return;
	}
	const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
	if (!eventAgentId && !compatibilityOwnerAgentId && !parseAgentSessionKey(sessionKey)) {
		if (lifecycleRevision) {
			const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update, projection);
			if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
		}
		params.broadcastToConnIds("sessions.changed", {
			sessionKey,
			phase: "message",
			ts: Date.now()
		}, connIds, {
			...privateBroadcastScope,
			dropIfSlow: true
		});
		return;
	}
	let message = update.message;
	let messageSeq = asPositiveSafeInteger(update.messageSeq);
	let transcriptPosition;
	if (message !== void 0 && update.messageId && completeTarget && targetSessionId) try {
		const stored = await readSessionMessageByIdAsync({
			agentId: targetAgentId,
			sessionId: targetSessionId,
			sessionKey,
			storePath: targetStorePath
		}, update.messageId);
		message = stored.message;
		messageSeq = stored.seq;
		transcriptPosition = readTranscriptDisplayPosition(asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.transcriptPosition);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		message = void 0;
	}
	else if (message !== void 0 && messageSeq === void 0) {
		const updateStorePath = targetStorePath ?? compatibleLegacyMarker?.storePath;
		const fallbackTarget = projection?.selectEntries({
			agentId: routingAgentId,
			key: sessionKey,
			storePath: updateStorePath
		})[0];
		const entry = fallbackTarget?.entry;
		const messageSessionId = compatibleLegacyMarker?.sessionId ?? normalizeOptionalString(update.target?.sessionId) ?? entry?.sessionId;
		const storePath = updateStorePath ?? fallbackTarget?.storeTarget.storePath;
		messageSeq = messageSessionId ? asPositiveSafeInteger(await readSessionMessageCountAsync({
			agentId: update.target?.agentId ?? routingAgentId,
			sessionEntry: entry,
			sessionId: messageSessionId,
			sessionKey,
			storePath
		})) : void 0;
	}
	await withPreparedEventRow(projection, routingAgentId ? {
		key: sessionKey,
		agentId: routingAgentId,
		storePath: targetStorePath
	} : void 0, () => {
		if (lifecycleRevision) {
			const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update, projection);
			if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
		}
		const sessionRow = routingAgentId ? projection?.snapshot({
			key: sessionKey,
			agentId: routingAgentId,
			storePath: targetStorePath
		}).row : null;
		const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId !== void 0 || compatibilityOwnerAgentId) ? resolveVisibleActiveSessionRunState({
			context: params,
			requestedKey: sessionKey,
			canonicalKey: sessionRow.key,
			sessionId: sessionRow.sessionId,
			...routingAgentId ? { agentId: routingAgentId } : {},
			defaultAgentId: compatibilityOwnerAgentId,
			projectedAgentRunIndex: projection?.state.rowContext.projectedAgentRuns
		}) : null;
		const sessionSnapshot = buildGatewaySessionSnapshot({
			sessionRow,
			agentId: eventAgentId,
			includeSession: true,
			activeRunState
		});
		if (message === void 0) {
			params.broadcastToConnIds("sessions.changed", {
				sessionKey,
				...eventAgentId ? { agentId: eventAgentId } : {},
				phase: "message",
				ts: Date.now(),
				...sessionSnapshot
			}, connIds);
			return;
		}
		const projected = projectSessionMessagePayload({
			sessionKey,
			...eventAgentId ? { agentId: eventAgentId } : {},
			message,
			transcriptPosition,
			...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
			...messageSeq !== void 0 ? { messageSeq } : {},
			...update.runId ? { runId: update.runId } : {},
			sessionSnapshot
		});
		if (projected.payload) {
			params.broadcastToConnIds("session.message", projected.payload, connIds);
			return;
		}
		const sessionEventConnIds = params.sessionEventSubscribers.getAll();
		if (!hasSessionChangeReceivers(sessionEventConnIds)) return;
		params.broadcastToConnIds("sessions.changed", {
			sessionKey,
			...eventAgentId ? { agentId: eventAgentId } : {},
			phase: "message",
			ts: Date.now(),
			...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
			...messageSeq !== void 0 ? { messageSeq } : {},
			...sessionSnapshot
		}, sessionEventConnIds, { dropIfSlow: true });
	});
}
/** Creates a lifecycle-event broadcaster for session list refreshes. */
function createLifecycleEventBroadcastHandler(params) {
	return async (event) => {
		const connIds = params.sessionEventSubscribers.getAll();
		if (!hasSessionChangeReceivers(connIds)) return;
		const agentScope = resolveSessionEventAgentScope(getRuntimeConfig(), event.sessionKey, normalizeOptionalString(event.agentId), true);
		if (!agentScope) return;
		const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = agentScope;
		const broadcastOptions = {
			...resolvePrivateSessionEventBroadcastScope(event.sessionKey, agentScope),
			dropIfSlow: true
		};
		if (event.reason === "delete" || !routingAgentId || !eventAgentId && !compatibilityOwnerAgentId) {
			params.broadcastToConnIds("sessions.changed", {
				sessionKey: event.sessionKey,
				...eventAgentId ? { agentId: eventAgentId } : {},
				reason: event.reason,
				...event.catalogChanged ? { catalogChanged: true } : {},
				ts: Date.now()
			}, connIds, broadcastOptions);
			return;
		}
		const projection = params.getSessionRowProjection?.();
		const query = {
			key: event.sessionKey,
			agentId: routingAgentId
		};
		const captured = projection?.capture(query);
		const readActiveState = (session) => resolveVisibleActiveSessionRunState({
			context: params,
			requestedKey: event.sessionKey,
			canonicalKey: session.key,
			sessionId: session.sessionId,
			agentId: routingAgentId,
			defaultAgentId: compatibilityOwnerAgentId,
			projectedAgentRunIndex: event.reason === "run-capacity" ? void 0 : projection?.state.rowContext.projectedAgentRuns
		});
		const capacityState = event.reason === "run-capacity" ? readActiveState({
			key: captured?.key ?? event.sessionKey,
			sessionId: captured?.entry?.sessionId
		}) : void 0;
		await withPreparedEventRow(projection, query, () => {
			if (projection && (!captured || !projection.isCurrent(captured))) return;
			const sessionRow = projection?.snapshot(query).row;
			const activeRunState = capacityState ?? (sessionRow ? readActiveState(sessionRow) : null);
			params.broadcastToConnIds("sessions.changed", {
				sessionKey: event.sessionKey,
				...eventAgentId ? { agentId: eventAgentId } : {},
				reason: event.reason,
				...event.catalogChanged ? { catalogChanged: true } : {},
				parentSessionKey: event.parentSessionKey,
				label: event.label,
				displayName: event.displayName,
				ts: Date.now(),
				...buildGatewaySessionSnapshot({
					sessionRow,
					includeSession: true,
					agentId: eventAgentId,
					label: event.label,
					displayName: event.displayName,
					parentSessionKey: event.parentSessionKey,
					activeRunState
				}),
				...event.swarmGroupId ? {
					swarmGroupId: event.swarmGroupId,
					kind: event.kind,
					text: event.text
				} : {}
			}, connIds, { dropIfSlow: true });
		});
	};
}
//#endregion
export { createLifecycleEventBroadcastHandler, createTranscriptUpdateBroadcastHandler };
