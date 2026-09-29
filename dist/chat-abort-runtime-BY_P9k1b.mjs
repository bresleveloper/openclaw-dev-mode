import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import "./task-registry.store.kernel-BuNI8UuR.mjs";
import { o as isSubagentRunQueued } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { a as getLatestLiveSubagentRunByChildSessionKey, f as listSubagentRunsForController } from "./subagent-registry-read-C2SIiLpb.mjs";
import { i as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-D7PkkSq8.mjs";
import { r as resolveChatRunOwnerAgentId, t as chatRunBelongsToAgent } from "./chat-run-owner-HbcABEVb.mjs";
import { n as createChatAbortMarker } from "./server-chat-state-DfVYc1CX.mjs";
import { i as listQueuedChatTurnsForSession, t as abortQueuedChatTurnById } from "./chat-queued-turns-D5_b93Ci.mjs";
import { i as ensureSubagentControllerOwnsRun, u as resolveSubagentController } from "./subagent-control-scope-BhAfxMhw.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import "./session-utils-CJ7A982R.mjs";
import { r as killSubagentRunAdmin, t as killAllControlledSubagentRuns } from "./subagent-control-kill-BNSJbxki.mjs";
import "./subagent-control-D4IAop4l.mjs";
import { r as setGatewayDedupeEntry } from "./agent-job-VGCbW4db.mjs";
import { t as errorShapeFromError } from "./error-shape-2QnntKjo.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { t as createChatAbortOps } from "./chat-abort-ops-lFr576Vk.mjs";
import { t as captureAbortedPartial } from "./chat-aborted-partial-BC2AaxuD.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
import { n as normalizeUnknownChatText, t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.mjs";
import { r as captureWorkerInferenceCancellation } from "./inference-control-internal-Dk-ZtYoJ.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-D3pOEA4v.mjs";
//#region src/gateway/server-methods/chat-abort-authorization.ts
function buildAbortedChatSendPayload(params) {
	return {
		runId: params.runId,
		status: "timeout",
		summary: "aborted",
		...params.stopReason ? { stopReason: params.stopReason } : {},
		endedAt: params.endedAt
	};
}
function resolveChatAbortRequester(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	return {
		connId: normalizeOptionalChatText(client?.connId),
		deviceId: normalizeOptionalChatText(client?.connect?.device?.id),
		isAdmin: scopes.includes(ADMIN_SCOPE)
	};
}
function canRequesterAbortChatRun(entry, requester, options = {}) {
	if (requester.isAdmin) return true;
	const ownerDeviceId = normalizeOptionalChatText(entry.ownerDeviceId);
	const ownerConnId = normalizeOptionalChatText(entry.ownerConnId);
	return Boolean(!options.requireOwnerMatch && !ownerDeviceId && !ownerConnId || ownerDeviceId && requester.deviceId && ownerDeviceId === requester.deviceId || ownerConnId && requester.connId && ownerConnId === requester.connId);
}
function readPreRegisteredAgentDedupePayloadForSession(params) {
	if (!params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const payloadRunId = normalizeUnknownChatText(payload.runId);
	if (payloadRunId && payloadRunId !== params.runId) return;
	const payloadSessionKeys = /* @__PURE__ */ new Set([normalizeUnknownChatText(payload.sessionKey), ...Array.isArray(payload.sessionKeyAliases) ? payload.sessionKeyAliases.map(normalizeUnknownChatText) : []]);
	const hasPayloadSessionKey = [...payloadSessionKeys].some(Boolean);
	if (params.requiredSessionId !== void 0 && (!payloadSessionKeys.has(params.sessionKey) || normalizeUnknownChatText(payload.sessionId) !== params.requiredSessionId)) return;
	if (hasPayloadSessionKey && !payloadSessionKeys.has(params.sessionKey) || !hasPayloadSessionKey && payloadRunId !== params.runId) return;
	const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
	if (agentId) {
		if (resolveChatRunOwnerAgentId({
			agentId: normalizeUnknownChatText(payload.agentId),
			sessionKey: params.sessionKey,
			defaultAgentId: params.defaultAgentId
		}) !== agentId) return;
	}
	return payload;
}
function readPreRegisteredRun(params) {
	if (!params.key.startsWith(params.keyPrefix) || !params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const runId = normalizeUnknownChatText(payload.runId) ?? normalizeOptionalChatText(params.key.slice(params.keyPrefix.length));
	const sessionKey = normalizeUnknownChatText(payload.sessionKey);
	if (!runId || !sessionKey) return;
	return {
		runId,
		sessionKey,
		payload
	};
}
function canRequesterAbortPreRegisteredRun(payload, requester) {
	return canRequesterAbortChatRun({
		ownerConnId: normalizeUnknownChatText(payload.ownerConnId),
		ownerDeviceId: normalizeUnknownChatText(payload.ownerDeviceId)
	}, requester);
}
function resolvePreRegisteredAgentDedupeKeys(payload, runId) {
	const keys = [`agent:${runId}`];
	const payloadKeys = Array.isArray(payload.dedupeKeys) ? payload.dedupeKeys : [];
	for (const key of payloadKeys) {
		const normalized = normalizeUnknownChatText(key);
		if (normalized?.startsWith("agent:")) keys.push(normalized);
	}
	return uniqueStrings(keys);
}
function writePreRegisteredAgentAbort(params) {
	if (params.expectedPayload && params.context.dedupe.get(`agent:${params.runId}`)?.payload !== params.expectedPayload) return false;
	const endedAt = params.endedAt ?? Date.now();
	const payloadAgentId = normalizeUnknownChatText(params.payload.agentId);
	for (const key of resolvePreRegisteredAgentDedupeKeys(params.payload, params.runId)) {
		if (params.expectedPayload && params.context.dedupe.get(key)?.payload !== params.expectedPayload) continue;
		setGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			key,
			entry: {
				ts: endedAt,
				ok: true,
				payload: {
					runId: params.runId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					...payloadAgentId ? { agentId: payloadAgentId } : {},
					...params.payload.controlUiVisible === false ? { controlUiVisible: false } : {},
					status: "timeout",
					summary: "aborted",
					stopReason: params.stopReason,
					endedAt
				}
			}
		});
	}
	return true;
}
function writePreRegisteredChatAbort(params) {
	if (params.expectedPayload && params.context.dedupe.get(pendingChatSendDedupeKey(params.runId))?.payload !== params.expectedPayload) return false;
	const endedAt = params.endedAt ?? Date.now();
	const payload = buildAbortedChatSendPayload({
		runId: params.runId,
		stopReason: params.stopReason,
		endedAt
	});
	params.context.chatRunState.getOrCreate(params.runId).abortMarker = createChatAbortMarker(endedAt);
	const pendingKey = pendingChatSendDedupeKey(params.runId);
	const pendingEntry = params.context.dedupe.get(pendingKey);
	const pendingAttemptId = normalizeUnknownChatText((pendingEntry?.payload)?.attemptId);
	const ownsPendingAttempt = !params.attemptId || pendingAttemptId === params.attemptId;
	if (ownsPendingAttempt) params.context.dedupe.delete(pendingKey);
	setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key: `chat:${params.runId}`,
		entry: {
			ts: endedAt,
			ok: true,
			payload,
			...ownsPendingAttempt && pendingEntry?.requestIdentity ? { requestIdentity: pendingEntry.requestIdentity } : {}
		}
	});
	return true;
}
function resolveAuthorizedPreRegisteredRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalChatText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const authorizedByRunId = /* @__PURE__ */ new Map();
	const matchedRunIds = /* @__PURE__ */ new Set();
	let hasUnauthorizedRuns = false;
	let hasUnauthorizedProtectedRuns = false;
	let hasProtectedRuns = false;
	for (const [key, entry] of params.context.dedupe) {
		const run = readPreRegisteredRun({
			key,
			entry,
			keyPrefix: params.keyPrefix,
			includeHidden: true
		});
		if (!run) continue;
		if (params.requiredSessionId !== void 0 && normalizeUnknownChatText(run.payload.sessionId) !== params.requiredSessionId) continue;
		if (params.excludeRunIds?.has(run.runId)) continue;
		if (![run.sessionKey, ...Array.isArray(run.payload.sessionKeyAliases) ? run.payload.sessionKeyAliases.map(normalizeUnknownChatText) : []].some((sessionKey) => Boolean(sessionKey && sessionKeys.has(sessionKey)))) continue;
		if (params.context.chatAbortControllers.has(run.runId)) continue;
		const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
		if (agentId && !chatRunBelongsToAgent({
			agentId: normalizeUnknownChatText(run.payload.agentId),
			sessionKey: run.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		matchedRunIds.add(run.runId);
		const requesterCanAbort = canRequesterAbortPreRegisteredRun(run.payload, params.requester);
		if (params.includeProtectedRuns !== true && (run.payload.controlUiVisible === false || params.preserveSideRuns && normalizeUnknownChatText(run.payload.turnKind) === "btw")) {
			hasProtectedRuns = true;
			if (!requesterCanAbort) hasUnauthorizedProtectedRuns = true;
			continue;
		}
		if (requesterCanAbort) authorizedByRunId.set(run.runId, run);
		else hasUnauthorizedRuns = true;
	}
	return {
		authorizedRuns: [...authorizedByRunId.values()],
		matchedRunIds: [...matchedRunIds],
		hasUnauthorizedRuns,
		hasUnauthorizedProtectedRuns,
		hasProtectedRuns
	};
}
function resolveAuthorizedRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalChatText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const sessionIds = new Set(Array.from(params.sessionIds ?? [], (sessionId) => normalizeOptionalChatText(sessionId)).filter((sessionId) => Boolean(sessionId)));
	const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
	const authorizedRuns = [];
	const matchedRunIds = [];
	let hasUnauthorizedRuns = false;
	let hasUnauthorizedProtectedRuns = false;
	let hasProtectedRuns = false;
	for (const [runId, active] of params.chatAbortControllers) {
		if (params.excludeRunIds?.has(runId)) continue;
		if (!sessionKeys.has(active.sessionKey) && !sessionIds.has(active.sessionId)) continue;
		if (params.requiredSessionId !== void 0 && (!sessionKeys.has(active.sessionKey) || active.sessionId !== params.requiredSessionId)) continue;
		if (agentId && !chatRunBelongsToAgent({
			agentId: active.agentId,
			sessionKey: active.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		matchedRunIds.push(runId);
		const requesterCanAbort = canRequesterAbortChatRun(active, params.requester);
		if (params.includeProtectedRuns !== true && (active.controlUiVisible === false || params.preserveSideRuns && active.turnKind === "btw")) {
			hasProtectedRuns = true;
			if (!requesterCanAbort) hasUnauthorizedProtectedRuns = true;
			continue;
		}
		if (requesterCanAbort) authorizedRuns.push({
			runId,
			sessionKey: active.sessionKey,
			sessionId: active.sessionId,
			agentId: active.agentId,
			entry: active
		});
		else hasUnauthorizedRuns = true;
	}
	return {
		authorizedRuns,
		matchedRunIds,
		hasUnauthorizedRuns,
		hasUnauthorizedProtectedRuns,
		hasProtectedRuns
	};
}
const SESSION_LIFECYCLE_ABORT_REQUESTER = { isAdmin: true };
function resolveAuthorizedQueuedTurnsForSession(params) {
	const matches = listQueuedChatTurnsForSession({
		chatQueuedTurns: params.context.chatQueuedTurns,
		sessionKeys: params.sessionKeys,
		sessionIds: [params.sessionId],
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}).filter((match) => !params.excludeRunIds?.has(match.runId));
	const authorized = matches.filter((match) => canRequesterAbortChatRun(match.entry, params.requester)).map((match) => ({
		runId: match.runId,
		entry: match.entry,
		sessionKey: match.entry.sessionKey,
		sessionId: match.entry.sessionId,
		agentId: match.entry.agentId
	}));
	return {
		authorized,
		matchedRunIds: matches.map((match) => match.runId),
		hasUnauthorizedRuns: authorized.length < matches.length
	};
}
/** Authoritative active, pending, or queued Gateway owner for an exact session. */
function hasGatewaySessionAbortOwner(params) {
	const ownerScope = {
		sessionKeys: params.sessionKeys,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: SESSION_LIFECYCLE_ABORT_REQUESTER
	};
	return resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionIds: [params.sessionId],
		...ownerScope,
		includeProtectedRuns: true
	}).authorizedRuns.length > 0 || resolveAuthorizedQueuedTurnsForSession({
		context: params.context,
		sessionId: params.sessionId,
		...ownerScope
	}).authorized.length > 0 || ["agent:", "pending-chat:"].some((keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		context: params.context,
		...ownerScope,
		keyPrefix,
		includeProtectedRuns: true
	}).authorizedRuns.length > 0);
}
//#endregion
//#region src/gateway/server-methods/chat-abort-runtime.ts
async function abortControlledSubagents(params) {
	const controller = resolveSubagentController({
		cfg: params.cfg,
		agentSessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const runs = listSubagentRunsForController(controller.controllerSessionKey, controller.controllerAgentId).filter((entry) => params.requesterTurnRunId === void 0 || entry.requesterTurnRunId === params.requesterTurnRunId);
	if (runs.length === 0) {
		await params.beforeKill?.();
		return;
	}
	return killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller,
		runs,
		suppressTaskDelivery: true,
		assertCurrent: params.assertCurrent,
		beforeKill: params.beforeKill
	});
}
function descendantAbortError(result, subject) {
	return result && result.status !== "ok" ? errorShape(ErrorCodes.UNAVAILABLE, `${subject} stopped, but descendant cancellation was incomplete: ${result.error}`) : void 0;
}
/** Queued collectors retain scheduler ownership while Gateway admission is still pending. */
function abortQueuedCollectorSession(params) {
	const entry = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey);
	if (!entry || !isSubagentRunQueued(entry) || params.excludeRunIds?.has(entry.runId) || params.runId && entry.runId !== params.runId) return;
	const workerCancellation = captureWorkerInferenceForSession({
		context: params.context,
		sessionId: params.sessionId
	});
	const cfg = params.session?.ok ? params.session.value.cfg : params.context.getRuntimeConfig();
	const parentRunId = entry.requesterTurnRunId;
	const parentRun = parentRunId ? params.context.chatAbortControllers.get(parentRunId) : void 0;
	const parentKey = entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
	const controller = {
		controllerSessionKey: parentKey,
		controllerAgentId: resolveChatRunOwnerAgentId({
			sessionKey: parentKey,
			defaultAgentId: entry.requesterAgentId
		})
	};
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (entry.execution.status === "queued" && !isSubagentRunQueued(entry)) throw new Error("Queued collector reservation changed; retry Stop.");
		const ownershipError = ensureSubagentControllerOwnsRun({
			cfg,
			controller,
			entry
		});
		if (ownershipError) throw new Error(ownershipError);
		if (params.requester.isAdmin) return;
		if (!parentRunId || !parentRun || params.context.chatAbortControllers.get(parentRunId) !== parentRun || !isChatAbortControllerEntryAbortable(parentRun) || !parentRun.lifecycleGeneration || !isAgentEventLifecycleGenerationCurrent(parentRun.lifecycleGeneration) || parentRun.projectSessionActive === false || resolveSessionStoreKey({
			cfg,
			sessionKey: parentRun.sessionKey,
			storeAgentId: controller.controllerAgentId
		}) !== parentKey || resolveChatRunOwnerAgentId({
			agentId: parentRun.agentId,
			sessionKey: parentRun.sessionKey
		}) !== controller.controllerAgentId || !canRequesterAbortChatRun(parentRun, params.requester, { requireOwnerMatch: true })) throw new Error("Unauthorized queued collector Stop; use its active parent requester connection or an administrator.");
	};
	return (async () => {
		let sessionAbort;
		let outcome = {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, "Queued collector cancellation was not published; retry Stop.")
		};
		try {
			assertCurrent();
			const projection = getSessionRowProjection(params.context);
			if (projection) do
				await projection.ensureMaterialized();
			while (projection.needsMaterialization);
			assertCurrent();
			const agentId = resolveChatRunOwnerAgentId({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				defaultAgentId: params.defaultAgentId
			});
			const captured = agentId ? projection?.capture({
				agentId,
				key: params.sessionKey
			}) : void 0;
			await killSubagentRunAdmin({
				cfg,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedRunId: entry.runId,
				expectedGeneration: entry.generation,
				expectedOwnerKey: entry.requesterSessionKey,
				onResult: (result) => {
					if (sessionAbort && !sessionAbort.ok) {
						outcome = sessionAbort;
						return;
					}
					const selected = sessionAbort?.value;
					if (selected?.result.unauthorized) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized")
						};
						return;
					}
					if (result.found && result.error) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, result.error)
						};
						return;
					}
					if (selected && !selected.plan.canCascade) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, "Queued collector was not stopped; other session work was preserved. Wait for it to finish or cancel it through its owner, then retry.")
						};
						return;
					}
					const aborted = result.found && result.killed && result.targetState?.state === "terminal" && result.targetState.task.status === "cancelled" && result.targetState.task.error === "Subagent run killed.";
					if (aborted) emitSessionsChanged(params.context, {
						sessionKey: params.sessionKey,
						agentId: params.agentId,
						sessionId: params.sessionId,
						reason: "abort"
					}, { preparedPublication: true });
					outcome = {
						ok: true,
						value: {
							aborted: aborted || selected?.result.aborted === true,
							runIds: [.../* @__PURE__ */ new Set([...aborted ? [result.runId] : [], ...selected?.result.runIds ?? []])]
						}
					};
				}
			}, {
				assertCurrent,
				preparePublication: {
					needsPreparation: () => projection?.needsMaterialization === true,
					prepare: async () => {
						await projection?.ensureMaterialized();
						if (captured && !projection?.isCurrent(captured)) throw new Error("Queued collector session changed before cancellation publication; retry Stop.");
					}
				},
				beforeSessionKill: () => {
					const plan = prepareChatSessionAbort({
						...params,
						ops: createChatAbortOps(params.context),
						cascadeDescendants: true,
						includeProtectedRuns: params.runId ? true : params.includeProtectedRuns
					}, workerCancellation, entry.runId);
					if (params.runId && plan.hasOtherWork) {
						sessionAbort = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, "Other work is active in this child session; use a full-session Stop without runId.")
						};
						return false;
					}
					sessionAbort = {
						ok: true,
						value: {
							plan,
							result: plan.result
						}
					};
					plan.abort();
					return plan.canCascade;
				}
			});
		} catch (error) {
			outcome = {
				ok: false,
				error: errorShapeFromError(ErrorCodes.INVALID_REQUEST, error)
			};
		} finally {
			if (sessionAbort?.ok) try {
				await sessionAbort.value.plan.finish(sessionAbort.value.result);
			} catch (error) {
				if (outcome.ok) outcome = {
					ok: false,
					error: errorShapeFromError(ErrorCodes.INVALID_REQUEST, error)
				};
				else params.context.logGateway.warn("chat.abort could not persist captured output after cancellation was rejected");
			}
		}
		return outcome;
	})();
}
function captureWorkerInferenceForSession(params) {
	const sessionId = normalizeOptionalChatText(params.sessionId);
	if (!sessionId) return;
	return captureWorkerInferenceCancellation(params.context.workerEnvironmentService, sessionId, params.runId);
}
/** Resolve once at the cancellation boundary; persist captured partials only after Stop. */
function prepareChatSessionAbort(params, workerCancellation, selectedRunId) {
	const sessionKeys = [params.sessionKey, ...params.sessionKeyAliases ?? []];
	const queuedPlan = resolveAuthorizedQueuedTurnsForSession({
		context: params.context,
		sessionKeys,
		sessionId: params.sessionId,
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester,
		excludeRunIds: params.excludeRunIds
	});
	const { authorizedRuns, matchedRunIds: matchedActiveRunIds, hasUnauthorizedRuns: hasUnauthorizedActiveRuns, hasUnauthorizedProtectedRuns: hasUnauthorizedProtectedActiveRuns, hasProtectedRuns: hasProtectedActiveRuns } = resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionKeys,
		sessionIds: [params.sessionId],
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester,
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns,
		excludeRunIds: params.excludeRunIds
	});
	const resolvePendingRuns = (keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		context: params.context,
		sessionKeys,
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester,
		keyPrefix,
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns,
		excludeRunIds: params.excludeRunIds
	});
	const pendingAgent = resolvePendingRuns("agent:");
	const pendingChat = resolvePendingRuns(PENDING_CHAT_SEND_DEDUPE_PREFIX);
	const pendingPlans = [pendingAgent, pendingChat];
	const hasAuthorizedGatewayRuns = authorizedRuns.length > 0 || queuedPlan.authorized.length > 0 || pendingPlans.some((plan) => plan.authorizedRuns.length > 0);
	const isLifecycleAbort = Boolean(params.cascadeDescendants || params.onAuthorizedAfterQueuedAbort);
	const hasWorkerRun = Boolean((!hasAuthorizedGatewayRuns || isLifecycleAbort) && workerCancellation?.runIds.length);
	const hasControllerRepresentedWorkerRun = hasWorkerRun && matchedActiveRunIds.some((runId) => workerCancellation?.runIds.includes(runId));
	const hasUnauthorizedOwner = hasUnauthorizedActiveRuns || queuedPlan.hasUnauthorizedRuns || pendingPlans.some((plan) => plan.hasUnauthorizedRuns) || hasWorkerRun && !hasControllerRepresentedWorkerRun && !params.requester.isAdmin;
	const hasProtectedLifecycleRuns = hasProtectedActiveRuns || pendingPlans.some((plan) => plan.hasProtectedRuns);
	const hasUnauthorizedProtectedOwner = hasUnauthorizedProtectedActiveRuns || pendingPlans.some((plan) => plan.hasUnauthorizedProtectedRuns);
	const hasUnauthorizedLifecycleOwner = isLifecycleAbort && hasUnauthorizedProtectedOwner;
	const canRunLifecycleCleanup = !hasUnauthorizedOwner && !hasProtectedLifecycleRuns;
	const canCancelWorkerSession = !isLifecycleAbort || !hasProtectedLifecycleRuns;
	let snapshots = [];
	const result = {
		aborted: false,
		runIds: [],
		unauthorized: false
	};
	const recordRun = (runId) => {
		result.aborted = true;
		if (!result.runIds.includes(runId)) result.runIds.push(runId);
	};
	const abortAdditional = () => {
		if (canRunLifecycleCleanup && params.onAuthorizedAfterQueuedAbort) {
			params.assertCurrent?.();
			result.aborted = params.onAuthorizedAfterQueuedAbort() || result.aborted;
		}
	};
	const abortAuthorizedRuns = () => {
		params.assertCurrent?.();
		params.onControllerTargets?.(authorizedRuns);
		if (!hasAuthorizedGatewayRuns) {
			if (hasUnauthorizedOwner || hasUnauthorizedLifecycleOwner) {
				result.unauthorized = true;
				return result;
			}
			abortAdditional();
			if (!hasWorkerRun || !params.requester.isAdmin || !canCancelWorkerSession) return result;
			params.assertCurrent?.();
			workerCancellation?.cancel({
				assertCurrent: params.assertCurrent,
				onCancelled: recordRun
			});
			return result;
		}
		snapshots = authorizedRuns.flatMap(({ runId, entry }) => {
			const text = params.context.chatRunState.resolveBuffer(runId, { final: true }).text;
			return text?.trim() ? [captureAbortedPartial({
				runId,
				sessionKey: params.sessionKey,
				sessionId: entry.sessionId,
				agentId: entry.agentId ?? params.agentId,
				text,
				abortOrigin: params.abortOrigin,
				session: params.session
			})] : [];
		});
		for (const { runId, sessionKey, sessionId, agentId, entry } of queuedPlan.authorized) {
			params.assertCurrent?.();
			if (params.context.chatQueuedTurns.get(runId) !== entry || entry.sessionKey !== sessionKey || entry.sessionId !== sessionId || entry.agentId !== agentId) continue;
			if (abortQueuedChatTurnById(params.context.chatQueuedTurns, {
				runId,
				sessionKey,
				stopReason: params.stopReason
			}).aborted) recordRun(runId);
		}
		abortAdditional();
		for (const { runId, sessionKey, sessionId, agentId, entry } of authorizedRuns) {
			params.assertCurrent?.();
			if (params.context.chatAbortControllers.get(runId) !== entry || entry.sessionKey !== sessionKey || entry.sessionId !== sessionId || entry.agentId !== agentId) continue;
			if (abortChatRunById(params.ops, {
				runId,
				sessionKey,
				stopReason: params.stopReason
			}).aborted) recordRun(runId);
		}
		const endedAt = Date.now();
		const stopReason = params.stopReason ?? "rpc";
		for (const { runId, sessionKey, payload } of pendingAgent.authorizedRuns) {
			params.assertCurrent?.();
			if (writePreRegisteredAgentAbort({
				context: params.context,
				runId,
				sessionKey,
				payload,
				expectedPayload: payload,
				stopReason,
				endedAt
			})) recordRun(runId);
		}
		for (const { runId, payload } of pendingChat.authorizedRuns) {
			params.assertCurrent?.();
			if (writePreRegisteredChatAbort({
				context: params.context,
				runId,
				stopReason,
				endedAt,
				attemptId: normalizeUnknownChatText(payload.attemptId),
				expectedPayload: payload
			})) recordRun(runId);
		}
		if (params.requester.isAdmin && canCancelWorkerSession) {
			params.assertCurrent?.();
			workerCancellation?.cancel({
				assertCurrent: params.assertCurrent,
				onCancelled: recordRun
			});
		}
		return result;
	};
	const hasOtherWork = matchedActiveRunIds.some((runId) => runId !== selectedRunId) || queuedPlan.matchedRunIds.some((runId) => runId !== selectedRunId) || pendingPlans.some((plan) => plan.matchedRunIds.some((runId) => runId !== selectedRunId)) || hasWorkerRun && (!selectedRunId || !workerCancellation?.runIds.includes(selectedRunId));
	return {
		canCascade: canRunLifecycleCleanup && !hasUnauthorizedLifecycleOwner,
		hasOtherWork,
		result,
		abort: abortAuthorizedRuns,
		async finish(outcome) {
			if (outcome.aborted && snapshots.length > 0) {
				const abortedRunIds = new Set(outcome.runIds);
				await persistAbortedPartials({
					context: params.context,
					snapshots: snapshots.filter((snapshot) => abortedRunIds.has(snapshot.runId))
				});
			}
			if (params.session && !params.session.ok) throw params.session.error;
		}
	};
}
async function abortChatRunsForSessionKeyWithPartials(params) {
	if (params.cascadeDescendants) {
		const queuedAbort = abortQueuedCollectorSession(params);
		if (queuedAbort) {
			const result = await queuedAbort;
			return result.ok ? {
				...result.value,
				unauthorized: false
			} : {
				aborted: false,
				runIds: [],
				unauthorized: false,
				error: result.error
			};
		}
	}
	const plan = prepareChatSessionAbort(params, captureWorkerInferenceForSession(params));
	let result = plan.result;
	let descendants;
	let failure;
	try {
		if (params.cascadeDescendants && plan.canCascade) descendants = await abortControlledSubagents({
			cfg: params.session?.ok ? params.session.value.cfg : params.context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			assertCurrent: params.assertCurrent,
			beforeKill: () => {
				result = plan.abort();
				return true;
			}
		});
		else result = plan.abort();
		if (!result.unauthorized && !result.error) {
			params.assertCurrent?.();
			params.onCancellationStarted?.();
		}
	} catch (error) {
		failure = { error };
	}
	try {
		await plan.finish(result);
	} catch (error) {
		if (!failure) throw error;
		params.context.logGateway.warn("chat.abort could not persist captured output after cancellation was rejected");
	}
	if (failure) throw failure.error;
	return {
		...result,
		aborted: result.aborted || Boolean(descendants?.killed),
		descendants
	};
}
//#endregion
export { descendantAbortError as a, canRequesterAbortPreRegisteredRun as c, readPreRegisteredRun as d, resolveChatAbortRequester as f, captureWorkerInferenceForSession as i, hasGatewaySessionAbortOwner as l, writePreRegisteredChatAbort as m, abortControlledSubagents as n, buildAbortedChatSendPayload as o, writePreRegisteredAgentAbort as p, abortQueuedCollectorSession as r, canRequesterAbortChatRun as s, abortChatRunsForSessionKeyWithPartials as t, readPreRegisteredAgentDedupePayloadForSession as u };
