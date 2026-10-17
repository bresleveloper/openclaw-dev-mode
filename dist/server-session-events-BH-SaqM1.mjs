import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as resolveSessionEventAgentScope, o as resolveSessionSubscriptionKey, s as resolveSessionSubscriptionKeys, t as resolvePrivateSessionEventBroadcastScope } from "./session-request-agent-Bxi11ET4.mjs";
import { a as readSessionMessageCountAsync, i as readSessionMessageByIdAsync } from "./session-transcript-readers-Z-j3mApc.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-D34IlGk3.mjs";
import { l as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { a as projectChatDisplayMessage } from "./chat-display-projection.core-BSNrSH5r.mjs";
import { a as readTranscriptDisplayPosition } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import "./chat-display-projection-ZUh2mrnJ.mjs";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-CZFHDW4j.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-COH4h1JU.mjs";
import { i as withPreparedEventRow, n as readTranscriptUpdateLifecycleOwner } from "./session-event-prepared-row-DeXKD8oc.mjs";
import { t as prepareSessionEventProjection } from "./session-event-projection-BXId5ql0.mjs";
import { t as projectSessionMessagePayload } from "./session-transcript-message-DmVdjUi1.mjs";
import path from "node:path";
//#region src/gateway/server-session-events.ts
function hasCompleteTranscriptTarget(update) {
	return Boolean(normalizeOptionalString(update.target?.agentId) && normalizeOptionalString(update.target?.sessionId) && normalizeOptionalString(update.target?.sessionKey) && normalizeOptionalString(update.target?.storePath));
}
/** Creates a serialized transcript-update broadcaster for session websocket clients. */
function createTranscriptUpdateBroadcastHandler(params) {
	const broadcastQueues = /* @__PURE__ */ new Map();
	const unresolvedQueueKeys = /* @__PURE__ */ new Set();
	return (update) => {
		const projection = params.getSessionRowProjection?.();
		const suppliedRevision = normalizeOptionalString(update.lifecycleRevision);
		const lifecycleOwner = !suppliedRevision && update.message !== void 0 ? readTranscriptUpdateLifecycleOwner(update, projection) : void 0;
		const lifecycleRevision = suppliedRevision ?? (update.message !== void 0 ? lifecycleOwner?.lifecycleRevision : void 0);
		const queuedUpdate = lifecycleRevision ? {
			...update,
			lifecycleRevision
		} : update;
		const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
		const markerCaptured = legacyMarker && !hasCompleteTranscriptTarget(update) ? projection?.findBySessionId(legacyMarker)[0] : void 0;
		const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? markerCaptured?.key;
		const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? legacyMarker?.agentId;
		const agentScope = sessionKey ? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, agentId) : void 0;
		if (agentScope === null) return Promise.resolve();
		const markerObservation = projection && legacyMarker && !hasCompleteTranscriptTarget(update) && !markerCaptured ? projection.observeGeneration(legacyMarker) : void 0;
		const laneKey = sessionKey && agentScope?.[1] ? resolveSessionSubscriptionKey(sessionKey, agentScope[1]) : sessionKey ?? normalizeOptionalString(update.sessionFile) ?? "";
		const queueKey = `${sessionKey ? "key" : "file"}:${laneKey}`;
		const tail = broadcastQueues.get(queueKey);
		const queueAgentId = agentScope?.[1] ?? (legacyMarker ? normalizeAgentId(legacyMarker.agentId) : agentId ? normalizeAgentId(agentId) : void 0);
		const earlier = sessionKey ? [...tail ? [tail] : [], ...[...unresolvedQueueKeys].flatMap((key) => broadcastQueues.get(key) ?? [])] : broadcastQueues.values();
		const predecessors = [...new Set(earlier)].filter((queue) => {
			if (queue === tail) return true;
			if (queue.key !== void 0) return !sessionKey || queue.key === laneKey;
			const current = sessionKey && projection && queue.agentId && queue.storePath && !projection.needsMembershipPreparation() && (parseAgentSessionKey(laneKey) || laneKey === "global" || laneKey === "unknown") ? projection.sharingTarget({
				agentId: queue.agentId,
				key: sessionKey,
				storePath: queue.storePath
			}) : void 0;
			return (!queue.agentId || !queueAgentId || queue.agentId === queueAgentId) && (!current || !queue.sessionId || queue.sessionId === current.entry.sessionId);
		});
		const keyReady = createDeferredCore();
		let resolvedKey = sessionKey ? laneKey : void 0;
		if (resolvedKey !== void 0) keyReady.resolve(resolvedKey);
		const joinQueue = async (key) => {
			resolvedKey = key;
			keyReady.resolve(key);
			const canonicalQueueKey = `key:${key}`;
			const canonicalTail = broadcastQueues.get(canonicalQueueKey);
			if (!canonicalTail || predecessors.includes(canonicalTail)) broadcastQueues.set(canonicalQueueKey, reservation);
			if (broadcastQueues.get(queueKey) === reservation) unresolvedQueueKeys.delete(queueKey);
			await Promise.all(predecessors.splice(0).map(async (queue) => {
				if (queue === tail || (queue.key ?? await queue.keyReady) === key) await queue.settled;
			}));
		};
		const task = (tail?.settled ?? Promise.resolve()).then(async () => {
			try {
				if (sessionKey) await joinQueue(laneKey);
				await handleTranscriptUpdateBroadcast(params, queuedUpdate, agentScope, projection, markerCaptured, markerObservation, sessionKey ? void 0 : joinQueue);
			} finally {
				keyReady.resolve(void 0);
				markerObservation?.dispose();
			}
		});
		const settled = task.then(() => void 0, () => void 0);
		const reservation = {
			get key() {
				return resolvedKey;
			},
			agentId: queueAgentId,
			sessionId: legacyMarker?.sessionId,
			storePath: legacyMarker?.storePath,
			keyReady: keyReady.promise,
			settled
		};
		broadcastQueues.set(queueKey, reservation);
		if (!sessionKey) unresolvedQueueKeys.add(queueKey);
		settled.then(() => {
			for (const key of /* @__PURE__ */ new Set([queueKey, `key:${resolvedKey}`])) if (broadcastQueues.get(key) === reservation) {
				broadcastQueues.delete(key);
				unresolvedQueueKeys.delete(key);
			}
		});
		return task;
	};
}
async function handleTranscriptUpdateBroadcast(params, update, capturedAgentScope, projection, markerCaptured, markerObservation, joinQueue) {
	const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
	const targetAgentId = normalizeOptionalString(update.target?.agentId);
	const targetSessionId = normalizeOptionalString(update.target?.sessionId);
	const targetSessionKey = normalizeOptionalString(update.target?.sessionKey);
	const suppliedSessionKey = normalizeOptionalString(update.sessionKey);
	const candidateSessionKey = targetSessionKey ?? suppliedSessionKey;
	const targetKeyAgentId = parseAgentSessionKey(candidateSessionKey)?.agentId;
	const targetStorePath = normalizeOptionalString(update.target?.storePath);
	const completeTarget = hasCompleteTranscriptTarget(update);
	if (legacyMarker && !completeTarget && projection) {
		do
			await projection.prepareMembership();
		while (projection.needsMembershipPreparation());
		if (params.getSessionRowProjection?.() !== projection) return;
	}
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
	const publicationStorePath = targetStorePath ?? compatibleLegacyMarker?.storePath;
	const markerOwner = compatibleLegacyMarker ? projection?.capture({
		agentId: compatibleLegacyMarker.agentId,
		key: sessionKey,
		storePath: compatibleLegacyMarker.storePath
	}) : void 0;
	const markerIsCurrent = () => (!markerCaptured || projection?.isCurrent(markerCaptured)) && (!markerObservation || markerOwner && markerObservation.isCurrent(markerOwner));
	if (!markerIsCurrent()) return;
	const agentScope = capturedAgentScope ?? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, compatibleLegacyMarker?.agentId ?? targetAgentId ?? update.agentId);
	if (!agentScope) return;
	if (joinQueue) {
		await joinQueue(agentScope[1] ? resolveSessionSubscriptionKey(sessionKey, agentScope[1]) : sessionKey);
		if (params.getSessionRowProjection?.() !== projection || !markerIsCurrent()) return;
	}
	const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = agentScope;
	const privateBroadcastScope = resolvePrivateSessionEventBroadcastScope(sessionKey, agentScope);
	const connIds = /* @__PURE__ */ new Set();
	for (const connId of params.sessionEventSubscribers.getAll()) connIds.add(connId);
	const broadcastKeys = routingAgentId ? resolveSessionSubscriptionKeys(sessionKey, routingAgentId, compatibilityOwnerAgentId) : [sessionKey];
	for (const broadcastKey of broadcastKeys) for (const connId of params.sessionMessageSubscribers.get(broadcastKey)) connIds.add(connId);
	if (connIds.size === 0) {
		if (!hasSessionChangeReceivers(connIds) || update.message !== void 0 && projectChatDisplayMessage(update.message, { resolveCronJobName: () => void 0 })) return;
	}
	const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision) ?? (markerObservation ? normalizeOptionalString(markerOwner?.entry?.lifecycleRevision) : void 0);
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
		if (!isSessionTranscriptProjectionUnavailableError(error) && !(error instanceof WorkerTaskError && error.code === "overloaded")) throw error;
		message = void 0;
	}
	else if (message !== void 0 && messageSeq === void 0) {
		const updateStorePath = publicationStorePath;
		do
			await projection?.prepareMembership();
		while (projection?.needsMembershipPreparation());
		const fallbackTarget = projection?.selectEntries({
			agentId: routingAgentId,
			key: sessionKey,
			storePath: updateStorePath
		})[0];
		const entry = fallbackTarget?.entry;
		const messageSessionId = compatibleLegacyMarker?.sessionId ?? normalizeOptionalString(update.target?.sessionId) ?? entry?.sessionId;
		const storePath = updateStorePath ?? fallbackTarget?.storeTarget.storePath;
		try {
			messageSeq = messageSessionId ? asPositiveSafeInteger(await readSessionMessageCountAsync({
				agentId: update.target?.agentId ?? routingAgentId,
				sessionEntry: entry,
				sessionId: messageSessionId,
				sessionKey,
				storePath
			})) : void 0;
		} catch (error) {
			if (!(error instanceof WorkerTaskError && error.code === "overloaded")) throw error;
			message = void 0;
		}
	}
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(message === void 0 ? [] : [message]);
	await withPreparedEventRow(projection, routingAgentId ? {
		key: sessionKey,
		agentId: routingAgentId,
		storePath: publicationStorePath
	} : void 0, (read) => {
		if (params.getSessionRowProjection?.() !== projection) return;
		if (!markerIsCurrent()) return;
		if (lifecycleRevision) {
			const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update, projection);
			if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
		}
		const record = routingAgentId ? read?.describe({
			key: sessionKey,
			agentId: routingAgentId,
			storePath: publicationStorePath
		}) : void 0;
		const sessionRow = record && read?.present(record);
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
		const broadcastOptions = read && projection ? { prepareSessionProjection: prepareSessionEventProjection(projection, read) } : void 0;
		if (message === void 0) {
			params.broadcastToConnIds("sessions.changed", {
				sessionKey,
				...eventAgentId ? { agentId: eventAgentId } : {},
				phase: "message",
				ts: Date.now(),
				...sessionSnapshot
			}, connIds, broadcastOptions);
			return;
		}
		const projected = projectSessionMessagePayload({
			sessionKey,
			...eventAgentId ? { agentId: eventAgentId } : {},
			message,
			resolveCronJobName,
			transcriptPosition,
			...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
			...messageSeq !== void 0 ? { messageSeq } : {},
			...update.runId ? { runId: update.runId } : {},
			sessionSnapshot
		});
		if (projected.payload) {
			params.broadcastToConnIds("session.message", projected.payload, connIds, broadcastOptions);
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
		}, sessionEventConnIds, {
			dropIfSlow: true,
			...broadcastOptions
		});
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
		const observation = !captured ? projection?.observeGeneration(query) : void 0;
		try {
			await withPreparedEventRow(projection, query, (read) => {
				const current = captured ?? projection?.capture(query);
				if (params.getSessionRowProjection?.() !== projection || projection && (!current || !projection.isCurrent(current)) || observation && (!current || !observation.isCurrent(current))) return;
				const record = read?.describe(query);
				const sessionRow = record && read?.present(record);
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
				}, connIds, {
					dropIfSlow: true,
					...read && projection ? { prepareSessionProjection: prepareSessionEventProjection(projection, read) } : {}
				});
			});
		} finally {
			observation?.dispose();
		}
	};
}
//#endregion
export { createLifecycleEventBroadcastHandler, createTranscriptUpdateBroadcastHandler };
