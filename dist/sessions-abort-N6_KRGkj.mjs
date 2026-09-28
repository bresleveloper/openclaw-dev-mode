import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { ri as validateSessionsAbortParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { c as resolveExistingAgentSessionStoreTargetsSync, d as isConfiguredSessionStoreAgentId } from "./targets-Dmb8-YXN.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore, i as resolveSessionStoreKey, n as resolveSessionStoreAgentId, o as resolveStoredSessionOwnerAgentId } from "./session-store-key-BoleEY7N.mjs";
import { T as resolveActiveEmbeddedRunOwnerByRunId, d as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun, w as resolveActiveEmbeddedRunOwner } from "./runs-ciDkXIOQ.mjs";
import "./sessions-Cesa3L0p.mjs";
import { g as waitForChatAbortTerminalPersistence } from "./chat-abort-D7PkkSq8.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-HbcABEVb.mjs";
import { i as readGatewayRequestMutationAuthority, n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { n as prepareSessionFollowupCleanup, t as clearSessionQueues } from "./cleanup-Oz9EeewQ.mjs";
import { t as captureYieldedMainSessionContinuation } from "./main-session-restart-recovery-target-_-9irRX7.mjs";
import { r as setGatewayDedupeEntry, t as captureAgentJobSession } from "./agent-job-VGCbW4db.mjs";
import { i as persistGatewaySessionLifecycleEvent } from "./session-event-payload-BTtvEIz2.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as resolveSessionKeyForRun } from "./server-session-key-D2rozMQY.mjs";
import { s as requireSessionKey } from "./sessions-shared-DPyHwOCR.mjs";
import { a as descendantAbortError, f as resolveChatAbortRequester, n as abortControlledSubagents, r as abortQueuedCollectorSession } from "./chat-abort-runtime-Cz3MuHdA.mjs";
import { n as handleChatAbortRequestWithLifecycle } from "./chat-abort-handler-Btg8h2pN.mjs";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.mjs";
import { t as resolveWorkerSessionTarget } from "./session-target-BTXy7wfu.mjs";
//#region src/gateway/server-methods/sessions-abort.ts
function resolveAbortSessionKey(params) {
	if (params.activeRunSessionKey) return params.activeRunSessionKey;
	const candidates = [
		params.canonicalKey,
		params.requestedKey,
		...params.aliasKeys ?? []
	];
	for (const active of params.context.chatAbortControllers.values()) {
		if (active.controlUiVisible === false) continue;
		for (const candidate of candidates) if (active.sessionKey === candidate) {
			const owner = resolveChatRunOwnerAgentId({
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				defaultAgentId: params.defaultAgentId
			});
			if (!params.agentId || owner === normalizeAgentId(params.agentId)) return candidate;
		}
	}
	return params.requestedKey;
}
function resolveSessionKeyAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	if (!parseAgentSessionKey(key) && key.toLowerCase().startsWith("agent:")) return;
	return parseAgentSessionKey(key)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
}
function sessionKeyBelongsToAgent(sessionKey, agentId, cfg) {
	return resolveSessionKeyAgentId(sessionKey, cfg) === normalizeAgentId(agentId);
}
function resolveScopedAbortKey(params) {
	const key = normalizeOptionalString(params.key);
	if (!key) return;
	const requestedAgentId = normalizeOptionalString(params.agentId);
	if (!requestedAgentId) return key;
	const scopedAgentId = normalizeAgentId(requestedAgentId);
	const ownerAgentId = resolveStoredSessionOwnerAgentId({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
	if (ownerAgentId && ownerAgentId !== scopedAgentId) return;
	return resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
}
const sessionAbortHandlers = { "sessions.abort": async (options) => {
	const { params, respond, context, client, sessionMutationAuthorization } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	const narrow = authority.sessionScope === "operator.sessions.write";
	if (!assertValidParams(params, validateSessionsAbortParams, "sessions.abort", respond)) return;
	const p = params;
	const cfg = context.getRuntimeConfig();
	const requestedRunId = readStringValue(p.runId);
	const requestedKey = normalizeOptionalString(p.key);
	const requestedParamAgentId = normalizeOptionalString(p.agentId);
	const clearQueued = p.clearQueued === true;
	const workerRunSessionId = requestedRunId ? asWorkerInferenceControl(context.workerEnvironmentService)?.resolveInferenceSessionForRunId(requestedRunId) : void 0;
	const workerRunTarget = workerRunSessionId ? resolveWorkerSessionTarget(cfg, workerRunSessionId) : void 0;
	const embeddedRun = requestedRunId ? resolveActiveEmbeddedRunOwnerByRunId(requestedRunId) : void 0;
	const embeddedRunSessionKey = embeddedRun?.sessionKey;
	const scopedRequestedKey = resolveScopedAbortKey({
		cfg,
		key: requestedKey,
		agentId: requestedParamAgentId
	});
	if (requestedKey && requestedParamAgentId && !scopedRequestedKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId"));
		return;
	}
	const requestedKeyAgentId = scopedRequestedKey ? resolveSessionKeyAgentId(scopedRequestedKey, cfg) : void 0;
	const activeRun = requestedRunId ? context.chatAbortControllers.get(requestedRunId) : void 0;
	const activeRunSessionKey = activeRun?.sessionKey;
	const activeRunAgentId = normalizeOptionalString(activeRun?.agentId);
	let inferredRunAgentId = requestedParamAgentId ?? activeRunAgentId ?? requestedKeyAgentId ?? workerRunTarget?.agentId ?? resolveSessionKeyAgentId(activeRunSessionKey, cfg) ?? resolveSessionKeyAgentId(embeddedRunSessionKey, cfg);
	if (requestedRunId && !inferredRunAgentId) {
		const runOwner = resolveRequestedSessionAgentId(cfg, scopedRequestedKey ?? activeRunSessionKey ?? workerRunTarget?.sessionKey ?? "main");
		if (!runOwner.ok) {
			respond(false, void 0, runOwner.error);
			return;
		}
		inferredRunAgentId = runOwner.agentId;
	}
	const requestedRunAgentId = requestedRunId ? inferredRunAgentId ? normalizeAgentId(inferredRunAgentId) : void 0 : void 0;
	const scopedActiveRunSessionKey = activeRunSessionKey ? requestedRunAgentId ? sessionKeyBelongsToAgent(activeRunSessionKey, requestedRunAgentId, cfg) ? activeRunSessionKey : void 0 : activeRunSessionKey : void 0;
	const keyCandidate = scopedRequestedKey ?? scopedActiveRunSessionKey ?? (requestedRunId ? resolveSessionKeyForRun(requestedRunId, requestedRunAgentId ? { agentId: requestedRunAgentId } : void 0) : void 0) ?? workerRunTarget?.sessionKey ?? embeddedRunSessionKey;
	if (!keyCandidate && requestedRunId) {
		respond(true, {
			ok: true,
			abortedRunId: null,
			status: "no-active-run"
		});
		return;
	}
	const key = requireSessionKey(keyCandidate, respond);
	if (!key) return;
	const requestedGlobalAgent = resolveRequestedSessionAgentId(cfg, key, requestedParamAgentId ?? requestedRunAgentId);
	if (!requestedGlobalAgent.ok) {
		respond(false, void 0, requestedGlobalAgent.error);
		return;
	}
	const requestedGlobalAgentId = requestedGlobalAgent.agentId;
	const targetAgentId = requestedGlobalAgentId ?? resolveSessionStoreAgentId(cfg, resolveSessionStoreKey({
		cfg,
		sessionKey: key
	}));
	const configuredTarget = isConfiguredSessionStoreAgentId(cfg, targetAgentId);
	const existingTargets = configuredTarget ? [] : resolveExistingAgentSessionStoreTargetsSync(cfg, targetAgentId);
	const stableTargetOwner = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	const hasExactActiveRun = requestedRunId ? scopedActiveRunSessionKey === key && resolveChatRunOwnerAgentId({
		agentId: activeRunAgentId,
		sessionKey: activeRunSessionKey,
		defaultAgentId: stableTargetOwner
	}) === normalizeAgentId(targetAgentId) || embeddedRun !== void 0 && resolveSessionKeyAgentId(embeddedRunSessionKey, cfg) === normalizeAgentId(targetAgentId) : [...context.chatAbortControllers.values()].some((entry) => entry.controlUiVisible !== false && entry.sessionKey === key && resolveChatRunOwnerAgentId({
		agentId: entry.agentId,
		sessionKey: entry.sessionKey,
		defaultAgentId: stableTargetOwner
	}) === normalizeAgentId(targetAgentId));
	if (!configuredTarget && existingTargets.length === 0 && !hasExactActiveRun) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${targetAgentId}" not found`));
		return;
	}
	const loadedSession = configuredTarget || existingTargets.length > 0 ? loadGatewaySessionEntry(key, { agentId: requestedGlobalAgentId }) : void 0;
	const canonicalKey = loadedSession?.canonicalKey ?? resolveSessionStoreKey({
		cfg,
		sessionKey: key,
		...requestedGlobalAgentId ? { storeAgentId: requestedGlobalAgentId } : {}
	});
	const sessionEntry = loadedSession?.entry;
	const admittedTarget = sessionMutationAuthorization?.admittedTarget;
	if (narrow && (!admittedTarget?.sessionId.trim() || admittedTarget.sessionKey !== canonicalKey || admittedTarget.agentId !== normalizeAgentId(targetAgentId) || sessionEntry?.sessionId !== admittedTarget.sessionId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session target is unavailable"));
		return;
	}
	const requiredSessionId = narrow ? admittedTarget?.sessionId : void 0;
	const embeddedRunMatchesSession = Boolean(embeddedRun && resolveSessionKeyAgentId(embeddedRun.sessionKey, cfg) === normalizeAgentId(targetAgentId) && (narrow ? embeddedRun.sessionId === requiredSessionId && (embeddedRun.sessionKey === key || embeddedRun.sessionKey === canonicalKey) : embeddedRun.sessionKey === key || embeddedRun.sessionKey === canonicalKey || sessionEntry?.sessionId === embeddedRun.sessionId));
	if (embeddedRun && !embeddedRunMatchesSession) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match session"));
		return;
	}
	const requestedKeyAliases = requestedKey && requestedKey !== key && (!requestedParamAgentId || sessionKeyBelongsToAgent(requestedKey, requestedParamAgentId, cfg)) ? [requestedKey] : void 0;
	const resolvedAbortSessionKey = resolveAbortSessionKey({
		context,
		requestedKey: key,
		canonicalKey,
		activeRunSessionKey: narrow ? void 0 : scopedActiveRunSessionKey,
		aliasKeys: requestedKeyAliases,
		agentId: requestedGlobalAgentId,
		defaultAgentId: stableTargetOwner
	});
	const abortSessionKey = canonicalKey === "global" && requestedGlobalAgentId ? "global" : resolvedAbortSessionKey;
	const abortAgentId = requestedGlobalAgentId ?? activeRunAgentId;
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const lifecycleRevision = sessionEntry?.lifecycleRevision;
	const assertAbortCurrent = () => {
		authority.assertCurrent();
		sessionMutationAuthorization?.assertCurrent();
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
	};
	const queueKeys = [
		key,
		...requestedKeyAliases ?? [],
		canonicalKey,
		sessionEntry?.sessionId
	];
	const clearCapturedFollowups = narrow && clearQueued && !requestedRunId && requiredSessionId ? prepareSessionFollowupCleanup({
		keys: queueKeys,
		agentId: targetAgentId,
		sessionKey: canonicalKey,
		sessionId: requiredSessionId,
		assertCurrent: assertAbortCurrent
	}) : void 0;
	const persistSessionAbort = (owner) => persistGatewaySessionLifecycleEvent({
		sessionKey: canonicalKey,
		agentId: targetAgentId,
		assertCommitAllowed: assertAbortCurrent,
		expectedWriter: {
			runId: owner.runId,
			sessionId: owner.sessionId,
			lifecycleRevision
		},
		event: {
			runId: owner.runId,
			sessionId: owner.sessionId,
			lifecycleGeneration,
			ts: Date.now(),
			data: {
				phase: "end",
				status: "cancelled",
				aborted: true,
				stopReason: "rpc",
				startedAt: owner.startedAtMs ?? sessionEntry?.startedAt,
				endedAt: Date.now()
			}
		}
	});
	if (embeddedRun && !activeRun) {
		let aborted = false;
		const descendants = await abortControlledSubagents({
			cfg,
			sessionKey: embeddedRun.sessionKey ?? canonicalKey,
			agentId: targetAgentId,
			requesterTurnRunId: embeddedRun.runId,
			assertCurrent: assertAbortCurrent,
			beforeKill: () => {
				assertAbortCurrent();
				return aborted = embeddedRun.abort();
			}
		});
		if (aborted) await persistSessionAbort(embeddedRun);
		const error = descendantAbortError(descendants, "Parent run");
		if (error) respond(false, void 0, error);
		else respond(true, {
			ok: true,
			abortedRunId: aborted ? embeddedRun.runId : null,
			status: aborted ? "aborted" : "no-active-run"
		});
		if (aborted) emitSessionsChanged(context, {
			sessionKey: canonicalKey,
			...abortAgentId ? { agentId: abortAgentId } : {},
			reason: "abort"
		});
		return;
	}
	const preAbortRuns = new Map(context.chatAbortControllers);
	const preAbortDedupe = new Map(context.dedupe);
	const preAbortSessions = new Map([...preAbortRuns].map(([runId, entry]) => [runId, captureAgentJobSession(entry)]));
	let abortedRunIds = [];
	let abortedRunId = null;
	let aborted = false;
	let chatAbortSucceeded = false;
	let failedResponse;
	let descendantsCancelled = false;
	let responseMeta;
	const persistedSessionId = sessionEntry?.sessionId;
	const capturedSessionEmbeddedRun = persistedSessionId ? resolveActiveEmbeddedRunOwner(persistedSessionId) : void 0;
	const sessionEmbeddedRun = !narrow || capturedSessionEmbeddedRun && capturedSessionEmbeddedRun.sessionId === requiredSessionId && (capturedSessionEmbeddedRun.sessionKey === key || capturedSessionEmbeddedRun.sessionKey === canonicalKey) ? capturedSessionEmbeddedRun : void 0;
	const embeddedController = sessionEmbeddedRun ? preAbortRuns.get(sessionEmbeddedRun.runId) : void 0;
	const yieldedRunId = normalizeOptionalString(sessionEntry?.lifecycleRunId);
	const yieldedParent = !requestedRunId && !sessionEmbeddedRun && yieldedRunId && !preAbortRuns.has(yieldedRunId) && loadedSession && sessionEntry && captureYieldedMainSessionContinuation({
		cfg,
		agentId: targetAgentId,
		sessionKey: canonicalKey,
		storePath: loadedSession.storePath,
		entry: sessionEntry
	}) ? {
		runId: yieldedRunId,
		sessionId: sessionEntry.sessionId,
		startedAtMs: sessionEntry.startedAt
	} : void 0;
	let embeddedAbortPersistence;
	let mcpRetirement;
	let pendingMcpController;
	const settleAbortPersistence = async (runIds) => {
		await embeddedAbortPersistence;
		await Promise.all(runIds.flatMap((runId) => {
			const entry = preAbortRuns.get(runId);
			return entry ? [waitForChatAbortTerminalPersistence(entry)] : [];
		}));
		if (persistedSessionId && pendingMcpController?.controller.signal.aborted) {
			assertAbortCurrent();
			mcpRetirement ??= retireSessionMcpRuntime({
				sessionId: persistedSessionId,
				reason: "session-stop"
			});
		}
		await mcpRetirement;
	};
	const onAuthorizedAfterQueuedAbort = !requestedRunId && (clearQueued || persistedSessionId) ? () => {
		assertAbortCurrent();
		let queueCleared = false;
		if (clearQueued && canonicalKey !== "global") {
			if (clearCapturedFollowups) queueCleared = clearCapturedFollowups() > 0;
			else {
				const cleared = clearSessionQueues(queueKeys);
				queueCleared = cleared.followupCleared > 0 || cleared.laneCleared > 0;
			}
		}
		const wasActive = persistedSessionId && isEmbeddedAgentRunActive(persistedSessionId);
		assertAbortCurrent();
		const embeddedAborted = persistedSessionId && canonicalKey !== "global" && !embeddedController ? sessionEmbeddedRun ? sessionEmbeddedRun.abort() : !narrow && abortEmbeddedAgentRun(persistedSessionId) : false;
		if (embeddedAborted && sessionEmbeddedRun) {
			embeddedAbortPersistence = persistSessionAbort(sessionEmbeddedRun);
			embeddedAbortPersistence.catch(() => {});
		}
		if (clearQueued && embeddedController) pendingMcpController = embeddedController;
		if ((clearQueued || canonicalKey === "global") && persistedSessionId && (canonicalKey === "global" || !wasActive || embeddedAborted)) {
			assertAbortCurrent();
			mcpRetirement ??= retireSessionMcpRuntime({
				sessionId: persistedSessionId,
				reason: "session-stop"
			});
		}
		return embeddedAborted || queueCleared;
	} : void 0;
	const queuedAbort = abortQueuedCollectorSession({
		context,
		sessionKey: canonicalKey,
		sessionKeyAliases: [key, ...requestedKeyAliases ?? []],
		agentId: targetAgentId,
		sessionId: persistedSessionId,
		requiredSessionId,
		session: loadedSession ? {
			ok: true,
			value: loadedSession
		} : void 0,
		defaultAgentId: stableTargetOwner,
		runId: requestedRunId,
		abortOrigin: "rpc",
		stopReason: "rpc",
		requester: resolveChatAbortRequester(client),
		assertCurrent: assertAbortCurrent,
		onAuthorizedAfterQueuedAbort
	});
	if (queuedAbort) {
		const result = await queuedAbort;
		await settleAbortPersistence(result.ok ? result.value.runIds : []);
		if (!result.ok) respond(false, void 0, result.error);
		else respond(true, {
			ok: true,
			abortedRunId: result.value.runIds[0] ?? null,
			status: result.value.aborted ? "aborted" : "no-active-run"
		}, void 0, void 0);
		return;
	}
	await handleChatAbortRequestWithLifecycle(bindGatewayRequestHandlerMutationAuthority(options, {
		...options,
		params: {
			sessionKey: abortSessionKey,
			runId: requestedRunId,
			...abortAgentId ? { agentId: abortAgentId } : {}
		},
		respond: (ok, payload, error, meta) => {
			if (!ok) {
				failedResponse = [
					ok,
					payload,
					error,
					meta
				];
				return;
			}
			chatAbortSucceeded = true;
			responseMeta = meta;
			const runIds = payload && typeof payload === "object" && Array.isArray(payload.runIds) ? payload.runIds.filter((value) => Boolean(normalizeOptionalString(value))) : [];
			const firstAbortedRunId = runIds[0] ?? null;
			abortedRunIds = runIds;
			abortedRunId = firstAbortedRunId;
			aborted = firstAbortedRunId !== null || payload !== null && typeof payload === "object" && payload.aborted === true;
			if (firstAbortedRunId && !Boolean(workerRunSessionId && !activeRun)) {
				const endedAt = Date.now();
				const dedupeKey = `${preAbortRuns.get(firstAbortedRunId)?.kind === "agent" ? "agent" : "chat"}:${firstAbortedRunId}`;
				if (context.dedupe.get(dedupeKey) !== preAbortDedupe.get(dedupeKey)) return;
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: dedupeKey,
					session: preAbortSessions.get(firstAbortedRunId),
					entry: {
						ts: endedAt,
						ok: true,
						payload: {
							status: "timeout",
							runId: firstAbortedRunId,
							...abortAgentId ? { agentId: abortAgentId } : {},
							stopReason: "rpc",
							endedAt
						}
					}
				});
			}
		}
	}, void 0), {
		...onAuthorizedAfterQueuedAbort ? { onAuthorizedAfterQueuedAbort } : {},
		...!requestedRunId ? { cascadeDescendants: true } : {},
		onDescendantsCancelled: () => {
			descendantsCancelled = true;
		}
	});
	await settleAbortPersistence(abortedRunIds);
	if (descendantsCancelled && yieldedParent) await persistSessionAbort(yieldedParent);
	if (!chatAbortSucceeded) {
		if (failedResponse) respond(...failedResponse);
		return;
	}
	respond(true, {
		ok: true,
		abortedRunId,
		status: aborted ? "aborted" : "no-active-run"
	}, void 0, responseMeta);
	if (aborted) emitSessionsChanged(context, {
		sessionKey: canonicalKey,
		...abortAgentId ? { agentId: abortAgentId } : {},
		reason: "abort"
	});
} };
//#endregion
export { sessionAbortHandlers };
