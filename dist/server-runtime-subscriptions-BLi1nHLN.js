import { i as clearAgentRunContext, p as onAgentEvent } from "./agent-events-7y1r8HOP.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { n as onSessionLifecycleEvent } from "./session-lifecycle-events-Ch4Mykew.js";
import { r as onHeartbeatEvent } from "./heartbeat-events-DlT3VAUF.js";
//#region src/gateway/server-runtime-subscriptions.ts
/** Register gateway runtime event subscriptions and return unsubscribe handles. */
function startGatewayEventSubscriptions(params) {
	let agentEventHandlerPromise = null;
	const getAgentEventHandler = () => {
		agentEventHandlerPromise ??= Promise.all([import("./server-chat-CsLw_j85.js"), import("./server-session-key-C6SZPyly.js")]).then(([{ createAgentEventHandler }, { resolveSessionKeyForRun }]) => createAgentEventHandler({
			broadcast: params.broadcast,
			broadcastToConnIds: params.broadcastToConnIds,
			nodeSendToSession: params.nodeSendToSession,
			agentRunSeq: params.agentRunSeq,
			chatRunState: params.chatRunState,
			resolveSessionKeyForRun,
			clearAgentRunContext,
			toolEventRecipients: params.toolEventRecipients,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			clearTrackedActiveRun: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionActive = false;
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = false;
						queueMicrotask(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry && entry.registrationCleanupRequested === true && !entry.projectSessionTerminalPersistence) params.chatAbortControllers.delete(candidateRunId);
						});
					}
				}
			},
			markTrackedRunTerminalPersisted: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					params.restartRecoveryCandidates.delete(candidateRunId);
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = true;
						entry.projectSessionTerminalPersistence = void 0;
					}
				}
			},
			trackTrackedRunTerminalPersistence: ({ runId, clientRunId, sessionId: terminalSessionId, observedAt, persistence }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersistence = persistence;
						if (entry.registrationCleanupRequested === true) persistence.catch(() => void 0).then(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry) params.chatAbortControllers.delete(candidateRunId);
						});
						const lifecycleGeneration = entry.lifecycleGeneration?.trim();
						const sessionKey = entry.sessionKey.trim();
						const sessionId = terminalSessionId?.trim() || entry.sessionId.trim();
						if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId) persistence.catch(() => {
							params.restartRecoveryCandidates.set(candidateRunId, {
								runId: candidateRunId,
								lifecycleGeneration,
								sessionKey,
								sessionId,
								observedAt
							});
						});
					}
				}
			},
			isChatSendRunActive: (runId) => {
				const entry = params.chatAbortControllers.get(runId);
				return entry !== void 0 && entry.kind !== "agent";
			},
			resolveActiveLifecycleGenerationForRun: (runId) => params.chatAbortControllers.get(runId)?.lifecycleGeneration
		}));
		return agentEventHandlerPromise;
	};
	let sessionEventsModulePromise = null;
	const getSessionEventsModule = () => {
		sessionEventsModulePromise ??= import("./server-session-events-37BcnEbl.js");
		return sessionEventsModulePromise;
	};
	let transcriptUpdateHandlerPromise = null;
	const getTranscriptUpdateHandler = () => {
		transcriptUpdateHandlerPromise ??= getSessionEventsModule().then(({ createTranscriptUpdateBroadcastHandler }) => createTranscriptUpdateBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			chatAbortControllers: params.chatAbortControllers
		}));
		return transcriptUpdateHandlerPromise;
	};
	let lifecycleEventHandlerPromise = null;
	const getLifecycleEventHandler = () => {
		lifecycleEventHandlerPromise ??= getSessionEventsModule().then(({ createLifecycleEventBroadcastHandler }) => createLifecycleEventBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers
		}));
		return lifecycleEventHandlerPromise;
	};
	return {
		agentUnsub: onAgentEvent((evt) => {
			const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
			if (lifecyclePhase === "end" || lifecyclePhase === "error") {
				const clientRunId = params.chatRunState.registry.peek(evt.runId)?.clientRunId ?? evt.runId;
				const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
					if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
						entry.projectSessionTerminalPending = true;
						entry.projectSessionTerminalObservedAt = typeof evt.data.endedAt === "number" && Number.isFinite(evt.data.endedAt) ? evt.data.endedAt : evt.ts;
					}
				}
			} else if (lifecyclePhase === "start") {
				const clientRunId = params.chatRunState.registry.peek(evt.runId)?.clientRunId ?? evt.runId;
				const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
				const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalObservedAt = void 0;
					}
				}
			}
			getAgentEventHandler().then((handler) => handler(evt));
		}),
		heartbeatUnsub: onHeartbeatEvent((evt) => {
			params.broadcast("heartbeat", evt, { dropIfSlow: true });
		}),
		transcriptUnsub: onInternalSessionTranscriptUpdate((evt) => {
			getTranscriptUpdateHandler().then((handler) => handler(evt));
		}),
		lifecycleUnsub: onSessionLifecycleEvent((evt) => {
			getLifecycleEventHandler().then((handler) => handler(evt));
		})
	};
}
//#endregion
export { startGatewayEventSubscriptions };
