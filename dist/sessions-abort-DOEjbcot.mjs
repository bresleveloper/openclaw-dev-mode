import { g as readStringValue, l as normalizeOptionalString, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { x as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-D1jWDzK3.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { pi as validateSessionsAbortParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { l as resolveExistingAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as resolveSessionStoreKey, o as resolveStoredSessionKeyForAgentStore, s as resolveStoredSessionOwnerAgentId } from "./session-store-key-Ci099tm9.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-Ci8Mz1ow.mjs";
import { E as resolveActiveEmbeddedRunOwnerByRunId, T as resolveActiveEmbeddedRunOwner, d as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun } from "./runs-BErx7xDZ.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { l as waitForChatAbortTerminalPersistence } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { a as readGatewayRequestMutationAuthority, n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { i as prepareSessionFollowupCleanup, n as clearSessionLifecycleQueues } from "./cleanup-BrSuoAYi.mjs";
import "./session-utils-CwljFiKR.mjs";
import { i as setGatewayDedupeEntry, t as captureAgentJobSession } from "./agent-job-BgXCyRm3.mjs";
import { t as captureYieldedMainSessionContinuation } from "./main-session-restart-recovery-target-GQI_i4ky.mjs";
import { r as persistGatewaySessionLifecycleEvent } from "./session-event-payload-5oTT3uJ-.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-h8yXQYae.mjs";
import { n as abortedPartialPersistenceError } from "./chat-aborted-partial-Mg2KV-kb.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as formatStopRequest } from "./control-plane-audit-DhEbrRsy.mjs";
import { t as resolveSessionForRun } from "./server-session-key-BRlgc6_d.mjs";
import { o as requireSessionKey } from "./sessions-shared-CHxhVZeL.mjs";
import { n as handleChatAbortRequestWithLifecycle } from "./chat-abort-handler-B3evsSLn.mjs";
import { d as resolveChatAbortRequester, i as descendantAbortError, n as abortControlledSubagents, r as abortQueuedCollectorSession } from "./chat-abort-runtime-BIqmWoXF.mjs";
//#region src/gateway/server-methods/sessions-abort.ts
function resolveAbortSessionKey(params) {
	if (params.activeRunSessionKey) return params.activeRunSessionKey;
	const candidates = /* @__PURE__ */ new Set([
		params.canonicalKey,
		params.requestedKey,
		...params.aliasKeys ?? []
	]);
	for (const active of params.context.chatAbortControllers.values()) {
		if (active.controlUiVisible === false) continue;
		if (candidates.has(active.sessionKey)) {
			const owner = resolveChatRunOwnerAgentId({
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				defaultAgentId: params.defaultAgentId
			});
			if (!params.agentId || owner === normalizeAgentId(params.agentId)) return active.sessionKey;
		}
	}
	return params.requestedKey;
}
function resolveSessionKeyAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const parsed = parseAgentSessionKey(key);
	if (!parsed && key.toLowerCase().startsWith("agent:")) return;
	return parsed?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
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
	const requester = resolveChatAbortRequester(client, sessionMutationAuthorization);
	const narrow = authority.sessionScope === "operator.sessions.write" || requester.sessionAuthority !== void 0;
	if (!assertValidParams(params, validateSessionsAbortParams, "sessions.abort", respond)) return;
	context.logGateway.info(formatStopRequest("sessions.abort", client, params));
	const p = params;
	const cfg = context.getRuntimeConfig();
	const requestedRunId = readStringValue(p.runId);
	const requestedKey = normalizeOptionalString(p.key);
	const requestedParamAgentId = normalizeOptionalString(p.agentId);
	const clearQueued = p.clearQueued === true;
	const workerRunTarget = requestedRunId ? getWorkerInferenceSessionControl(context.workerEnvironmentService)?.resolveSessionTargetForRunId(requestedRunId) : void 0;
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
	const keyCandidate = scopedRequestedKey ?? scopedActiveRunSessionKey ?? (requestedRunId ? resolveSessionForRun(requestedRunId, {
		agentId: requestedRunAgentId,
		projection: getSessionRowProjection(context)
	})?.sessionKey : void 0) ?? workerRunTarget?.sessionKey ?? embeddedRunSessionKey;
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
	const targetAgentId = requestedGlobalAgent.agentId;
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
	const loadedSession = configuredTarget || existingTargets.length > 0 ? loadGatewaySessionEntry(key, { agentId: targetAgentId }) : void 0;
	const canonicalKey = loadedSession?.canonicalKey ?? resolveSessionStoreKey({
		cfg,
		sessionKey: key,
		storeAgentId: targetAgentId
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
		agentId: targetAgentId,
		defaultAgentId: stableTargetOwner
	});
	const abortSessionKey = canonicalKey === "global" ? "global" : resolvedAbortSessionKey;
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const lifecycleRevision = sessionEntry?.lifecycleRevision;
	const assertAbortCurrent = () => {
		authority.assertCurrent();
		sessionMutationAuthorization?.assertCurrent();
		requester.sessionAuthority?.assertCurrent();
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
			agentId: targetAgentId,
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
	let abortWarning;
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
		try {
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
			if (descendantsCancelled && yieldedParent) await persistSessionAbort(yieldedParent);
		} catch (error) {
			throw abortedPartialPersistenceError(error, abortWarning);
		}
	};
	const onAuthorizedAfterQueuedAbort = !requestedRunId && (clearQueued || persistedSessionId) ? () => {
		assertAbortCurrent();
		let queueCleared = false;
		if (clearQueued && canonicalKey !== "global") {
			if (clearCapturedFollowups) queueCleared = clearCapturedFollowups() > 0;
			else {
				const cleared = clearSessionLifecycleQueues({
					keys: queueKeys,
					agentId: targetAgentId,
					sessionKey: canonicalKey,
					assertCurrent: assertAbortCurrent
				});
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
		requester,
		assertCurrent: assertAbortCurrent,
		onAuthorizedAfterQueuedAbort
	});
	if (queuedAbort) {
		const result = await queuedAbort;
		if (result.ok) abortWarning = result.value.warning;
		await settleAbortPersistence(result.ok ? result.value.runIds : []);
		if (!result.ok) respond(false, void 0, result.error);
		else respond(true, {
			ok: true,
			abortedRunId: result.value.runIds[0] ?? null,
			status: result.value.aborted ? "aborted" : "no-active-run",
			...abortWarning ? { warning: abortWarning } : {}
		}, void 0, void 0);
		return;
	}
	await handleChatAbortRequestWithLifecycle(bindGatewayRequestHandlerMutationAuthority(options, {
		...options,
		params: {
			sessionKey: abortSessionKey,
			runId: requestedRunId,
			agentId: targetAgentId
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
			const result = asOptionalObjectRecord(payload);
			abortWarning = normalizeOptionalString(result?.warning);
			const runIds = Array.isArray(result?.runIds) ? result.runIds.filter(hasNonEmptyString) : [];
			const firstAbortedRunId = runIds[0] ?? null;
			abortedRunIds = runIds;
			abortedRunId = firstAbortedRunId;
			aborted = firstAbortedRunId !== null || result?.aborted === true;
			if (firstAbortedRunId && !Boolean(workerRunTarget && !activeRun)) {
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
							agentId: targetAgentId,
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
	if (!chatAbortSucceeded) {
		if (failedResponse) respond(...failedResponse);
		return;
	}
	respond(true, {
		ok: true,
		abortedRunId,
		status: aborted ? "aborted" : "no-active-run",
		...abortWarning ? { warning: abortWarning } : {}
	}, void 0, responseMeta);
	if (aborted) emitSessionsChanged(context, {
		sessionKey: canonicalKey,
		agentId: targetAgentId,
		reason: "abort"
	});
} };
//#endregion
export { sessionAbortHandlers };
