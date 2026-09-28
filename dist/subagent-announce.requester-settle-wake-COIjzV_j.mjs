import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as getSharedGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as SILENT_REPLY_TOKEN } from "./tokens-BTKQYTUd.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { n as isSystemEventStoreCurrent } from "./system-event-ownership-CHVGbaAW.mjs";
import { j as subagentRuns, n as hasSubagentRunEnded } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { S as selectConnectedSettledSubagentWave, a as getLatestLiveSubagentRunByChildSessionKey, c as hasDescendantRunAwaitingSettle, o as getLatestSubagentRunByChildSessionKey, p as listSubagentRunsForRequester, r as countActiveDescendantRuns } from "./subagent-registry-read-C2SIiLpb.mjs";
import { c as getSubagentDepthFromSessionStore } from "./subagent-capabilities-D-LyBU4l.mjs";
import { n as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-CrNX9EIS.mjs";
import { F as buildAnnounceIdempotencyKey } from "./subagent-completion-admission.store-C-FTAVQX.mjs";
import { a as transferRequesterFinalAttachment, f as withRequesterCronAuthority, i as revokeRequesterFinalAttachment, t as consumeRequesterFinalAttachment } from "./requester-final-attachment-BkyW5G5X.mjs";
import { a as filterCurrentDirectChildCompletionRows, i as dedupeLatestChildCompletionRows, o as readChildCompletionFindings } from "./subagent-announce-output-adyNLqeV.mjs";
import { r as withTaskProgressRequesterContinuation } from "./task-progress-requester-CuHWNVdQ.mjs";
import { o as SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION, s as SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION } from "./subagent-completion-delivery-miBR4hhO.mjs";
import { a as loadRequesterSessionEntry, r as resolveAnnounceOrigin, t as deliverSubagentAnnouncement } from "./subagent-announce-delivery-CSptNSex.mjs";
import { t as hasUsableSessionEntry } from "./subagent-announce-DXqIx33L.mjs";
//#region src/agents/subagents/announce/subagent-announce.requester-settle-message.ts
const REQUESTER_SETTLE_WAKE_ROUTE_NOTICE_MAX_CHARS = 1024;
const ROUTE_NOTICE_TRUNCATION = "\n[model-route changes truncated]";
function buildRequesterSettleWakeMessage(params) {
	const routeNotices = [...new Set(params.children.flatMap(({ completion }) => {
		const reply = completion?.terminalReply;
		return reply?.disposition === "visible" && reply.modelRouteChange ? [reply.modelRouteChange] : [];
	}))].toSorted().join("\n");
	const modelRouteChange = routeNotices.length > REQUESTER_SETTLE_WAKE_ROUTE_NOTICE_MAX_CHARS ? `${truncateUtf16Safe(routeNotices, 992)}${ROUTE_NOTICE_TRUNCATION}` : routeNotices;
	return [
		"[Subagent Context] Every subagent spawned from this session has now settled — none are still running or awaiting completion delivery.",
		"[Subagent Context] Do not keep waiting or call sessions_yield again for this batch; no further completion events will arrive.",
		...params.parentOnly ? [] : [`[Subagent Context] ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION}`],
		params.parentOnly ? `[Subagent Context] ${SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION}` : params.requireVisibleReply ? "[Subagent Context] Child completion delivery is internal; the original user request still requires your visible final answer only after the requested outcome is complete or genuinely blocked." : `[Subagent Context] Reply ONLY: ${SILENT_REPLY_TOKEN} only if you already delivered the consolidated final answer for this batch.`,
		...modelRouteChange ? [modelRouteChange, params.preserveModelRouteNotice ? "[Subagent Context] Preserve this runtime-authored model-route change notice in your final answer." : "[Subagent Context] Keep this runtime-authored model-route change notice internal on this shared surface."] : [],
		"",
		params.findings ?? "(each child result was announced individually in earlier completion events)"
	].join("\n");
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.requester-settle-wake.ts
/**
* Durable requester settle wake delivery.
*
* Lifecycle owns the persisted outbox state on retained subagent run rows;
* this module selects a drained wave and delivers its synthesized wake.
*/
const REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS = 3;
const REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS = 3;
const REQUESTER_SETTLE_WAKE_MAX_DEFERRALS = 10;
const REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS = [3e4, 12e4];
const activeRequesterSettleWakeBatches = /* @__PURE__ */ new Map();
function readSharedBatchState(batch) {
	const states = batch.map((entry) => entry.requesterSettleWake).filter((state) => Boolean(state));
	const source = states.find((state) => state.status === "dispatching") ?? states[0];
	return {
		status: source?.status ?? "pending",
		attemptCount: Math.max(0, ...states.map((state) => state.attemptCount)),
		...source?.replayCount !== void 0 ? { replayCount: source.replayCount } : {},
		...source?.nextAttemptAt !== void 0 ? { nextAttemptAt: source.nextAttemptAt } : {},
		...source?.batchRunIds ? { batchRunIds: [...source.batchRunIds] } : {},
		...states.some((state) => state.requesterYieldBatch === true) ? { requesterYieldBatch: true } : {},
		...states.some((state) => state.afterRequesterYield === true) ? { afterRequesterYield: true } : {},
		...source?.rearmGeneration !== void 0 ? { rearmGeneration: source.rearmGeneration } : {},
		...source?.lastError !== void 0 ? { lastError: source.lastError } : {},
		deferralCount: Math.max(0, ...states.map((state) => state.deferralCount ?? 0))
	};
}
/**
* Wakes a top-level or explicitly yielded nested requester once its last child
* reaches terminal settle. Durable state transitions happen synchronously
* through lifecycle-owned callbacks before and after every async delivery.
*/
async function maybeWakeRequesterAfterAllChildrenSettled(params) {
	if (params.signal?.aborted) return false;
	const requesterSessionKey = params.requesterSessionKey.trim();
	const cfg = getRuntimeConfig();
	const requesterAgentId = resolveSubagentRequesterAgentId(cfg, params.settledEntry);
	const requesterStorePath = params.settledEntry.requesterStorePath ?? null;
	const initialState = params.settledEntry.requesterSettleWake;
	if (!requesterSessionKey || !initialState) return false;
	const finalizeRequesterAttachment = (runIds, state, delivery, requesterSessionId) => {
		if (!requesterAgentId || state.requesterYieldBatch !== true || state.rearmGeneration === void 0) return;
		const finalText = delivery?.finalAssistantVisibleText?.trim();
		if (delivery?.delivered && requesterSessionId && finalText) {
			consumeRequesterFinalAttachment({
				requesterAgentId,
				requesterSessionKey,
				requesterSessionId,
				batchRunIds: runIds,
				rearmGeneration: state.rearmGeneration,
				text: finalText
			});
			return;
		}
		revokeRequesterFinalAttachment({
			requesterAgentId,
			requesterSessionKey,
			batchRunIds: runIds,
			rearmGeneration: state.rearmGeneration
		});
	};
	const completeBatch = (batch, state, delivery, requesterSessionId) => params.completeBatch(batch, state.rearmGeneration, delivery, () => finalizeRequesterAttachment(batch.map((entry) => entry.runId).toSorted(), state, delivery, requesterSessionId));
	const admittedRearmGeneration = initialState.rearmGeneration;
	if (isCronSessionKey(requesterSessionKey)) {
		completeBatch([params.settledEntry], initialState);
		return false;
	}
	const listedRuns = listSubagentRunsForRequester(requesterSessionKey, {
		requesterAgentId,
		requesterStorePath
	});
	const requesterRuns = Array.isArray(listedRuns) ? listedRuns : [];
	const currentSettledEntry = requesterRuns.find((entry) => entry.runId === params.settledEntry.runId);
	const currentState = currentSettledEntry?.requesterSettleWake;
	if (currentSettledEntry !== params.settledEntry || !currentState || currentState.rearmGeneration !== admittedRearmGeneration) return false;
	const frozenBatchRunIds = currentState.batchRunIds;
	const currentRearmGeneration = currentState.rearmGeneration;
	let settledBatch;
	if (frozenBatchRunIds && frozenBatchRunIds.length > 0) {
		const runsById = new Map(requesterRuns.map((entry) => [entry.runId, entry]));
		settledBatch = frozenBatchRunIds.map((runId) => runsById.get(runId)).filter((entry) => Boolean(entry?.requesterSettleWake) && entry?.requesterSettleWake?.rearmGeneration === currentRearmGeneration);
		if (settledBatch.some((entry) => entry.execution.status === "running" || !hasSubagentRunEnded(entry))) return false;
	} else settledBatch = selectConnectedSettledSubagentWave(requesterRuns.filter((entry) => entry.requesterSettleWake && entry.requesterSettleWake.rearmGeneration === currentRearmGeneration && entry.execution.status !== "running" && hasSubagentRunEnded(entry)), currentSettledEntry);
	if (settledBatch.length === 0) return false;
	const batchCreatedAt = Math.min(...settledBatch.map((entry) => entry.createdAt));
	const requesterHasUnsettledDescendants = () => hasDescendantRunAwaitingSettle(requesterSessionKey, currentSettledEntry.runId, requesterAgentId, requesterStorePath, batchCreatedAt);
	const hasUnsettledDescendants = requesterHasUnsettledDescendants();
	if ((!frozenBatchRunIds || frozenBatchRunIds.length === 0) && hasUnsettledDescendants) return false;
	const resolveGatewayContext = getSharedGatewayContextResolver(settledBatch);
	const hadGatewayContext = Boolean(resolveGatewayContext?.());
	if (resolveGatewayContext && !hadGatewayContext) return false;
	const batchRunIds = settledBatch.map((entry) => entry.runId).toSorted();
	const settleWakeSourceSessionKeys = [...new Set(settledBatch.map((entry) => entry.childSessionKey))].toSorted();
	const selectedState = readSharedBatchState(settledBatch);
	const isStoreCurrent = () => settledBatch.every((entry) => isSystemEventStoreCurrent(requesterSessionKey, entry.requesterStorePath, requesterAgentId));
	const retireReplacedStore = () => {
		if (isStoreCurrent()) return false;
		completeBatch(settledBatch, selectedState, {
			delivered: false,
			path: "none",
			error: "store replaced",
			storeReplaced: true,
			disposition: "intentional_non_delivery"
		});
		return true;
	};
	if (retireReplacedStore()) return false;
	const getRequesterRun = () => getLatestLiveSubagentRunByChildSessionKey(requesterSessionKey, (entry) => entry.pauseReason === "sessions_yield") ?? getLatestLiveSubagentRunByChildSessionKey(requesterSessionKey);
	const requesterRun = getRequesterRun();
	const requesterGeneration = requesterRun?.generation;
	const requesterCreatedAt = requesterRun?.createdAt;
	const requesterTaskRunId = requesterRun?.taskRunId ?? requesterRun?.runId;
	const isBatchDeliveryClosed = () => {
		const currentRequester = getRequesterRun();
		return requesterRun?.killReconciliation?.suppressTaskDelivery === true || requesterRun?.suppressCompletionDelivery === true || currentRequester?.killReconciliation?.suppressTaskDelivery === true || currentRequester?.suppressCompletionDelivery === true || settledBatch.some((entry) => entry.killReconciliation?.suppressTaskDelivery === true) || settledBatch.every((entry) => entry.suppressCompletionDelivery === true);
	};
	if (isBatchDeliveryClosed()) {
		completeBatch(settledBatch, selectedState);
		return false;
	}
	function deferBatch(state, countTowardsLimit = countActiveDescendantRuns(requesterSessionKey, requesterAgentId, requesterStorePath) === 0) {
		const now = Date.now();
		if ((state.nextAttemptAt ?? 0) > now) return;
		const deferralCount = countTowardsLimit ? (state.deferralCount ?? 0) + 1 : 0;
		if (countTowardsLimit && deferralCount >= REQUESTER_SETTLE_WAKE_MAX_DEFERRALS) {
			completeBatch(settledBatch, state, {
				delivered: false,
				path: "none",
				error: "requester settle wake deferred too many times"
			});
			return;
		}
		params.transitionBatch(settledBatch, {
			status: state.status,
			attemptCount: state.attemptCount,
			...state.replayCount !== void 0 ? { replayCount: state.replayCount } : {},
			nextAttemptAt: Math.max(state.nextAttemptAt ?? 0, now + REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[0]),
			batchRunIds: [...batchRunIds],
			...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
			...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
			...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {},
			...state.lastError !== void 0 ? { lastError: state.lastError } : {},
			deferralCount
		});
	}
	if (hasUnsettledDescendants) {
		if (frozenBatchRunIds && frozenBatchRunIds.length > 0) deferBatch(selectedState);
		return false;
	}
	const requiredSettled = settledBatch.filter((entry) => entry.expectsCompletionMessage === true);
	const hasUndeliveredRequiredCompletion = requiredSettled.some((entry) => entry.delivery?.status !== "delivered");
	const requesterYieldedAfterDelivery = selectedState.afterRequesterYield === true || selectedState.requesterYieldBatch === true && selectedState.rearmGeneration !== void 0;
	const requesterDepth = getSubagentDepthFromSessionStore(requesterSessionKey, {
		cfg,
		agentId: requesterAgentId
	});
	if (requiredSettled.length === 0 || requiredSettled.length < 2 && !hasUndeliveredRequiredCompletion && !requesterYieldedAfterDelivery || !requesterYieldedAfterDelivery && requesterDepth >= 1) {
		completeBatch(settledBatch, selectedState);
		return false;
	}
	const { entry: requesterEntry } = loadRequesterSessionEntry(requesterSessionKey, requesterAgentId);
	if (!hasUsableSessionEntry(requesterEntry)) {
		completeBatch(settledBatch, selectedState, {
			delivered: false,
			path: "none",
			error: "requester session unavailable"
		});
		return false;
	}
	const completionRows = dedupeLatestChildCompletionRows(filterCurrentDirectChildCompletionRows(settledBatch, {
		requesterSessionKey,
		requesterAgentId,
		getLatestSubagentRunByChildSessionKey
	}));
	const privateRows = completionRows.filter((entry) => entry.completionTarget === "parent");
	const parentOnly = privateRows.length > 0;
	if (privateRows.some((entry) => entry.completionRequesterSessionId !== requesterEntry.sessionId)) {
		completeBatch(settledBatch, selectedState, {
			delivered: false,
			path: "none",
			reason: "completion_handoff_unavailable",
			error: "private completion requester session was replaced",
			terminal: true,
			disposition: "intentional_non_delivery"
		});
		return false;
	}
	const preparedFindings = await readChildCompletionFindings(completionRows);
	if (retireReplacedStore()) return false;
	const requesterSessionOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const directOrigin = resolveAnnounceOrigin(requesterEntry, requesterSessionOrigin);
	const completionChannel = normalizeMessageChannel(directOrigin?.channel);
	const wakeMessage = buildRequesterSettleWakeMessage({
		findings: preparedFindings.text,
		requireVisibleReply: requesterYieldedAfterDelivery,
		parentOnly,
		children: completionRows,
		preserveModelRouteNotice: !completionChannel || !isDeliverableMessageChannel(completionChannel)
	});
	const wakeKeyBase = [`requester-settle:${requesterAgentId ?? "unknown"}:${requesterSessionKey}:${batchRunIds.join(",")}`, selectedState.rearmGeneration === void 0 ? void 0 : `yield-${selectedState.rearmGeneration}`].filter(Boolean).join(":");
	if (activeRequesterSettleWakeBatches.get(wakeKeyBase)?.() === false) return false;
	const isGatewayClosed = () => {
		try {
			return hadGatewayContext && !resolveGatewayContext?.();
		} catch {
			return hadGatewayContext;
		}
	};
	activeRequesterSettleWakeBatches.set(wakeKeyBase, isGatewayClosed);
	try {
		if (params.signal?.aborted) return false;
		let state = readSharedBatchState(settledBatch);
		if (!settledBatch.some((entry) => entry.requesterSettleWake)) return false;
		if ((state.nextAttemptAt ?? 0) > Date.now()) return false;
		if (requesterHasUnsettledDescendants()) {
			deferBatch(state);
			return false;
		}
		let attemptIndex;
		if (state.status === "dispatching") attemptIndex = Math.max(0, state.attemptCount - 1);
		else {
			if (state.attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS) {
				completeBatch(settledBatch, state, {
					delivered: false,
					path: "none",
					error: state.lastError ?? "requester settle wake attempts exhausted"
				});
				return false;
			}
			attemptIndex = state.attemptCount;
			state = {
				status: "dispatching",
				attemptCount: state.attemptCount + 1,
				batchRunIds,
				...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
				...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
				...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {}
			};
			params.transitionBatch(settledBatch, state);
		}
		const directIdempotencyKey = buildAnnounceIdempotencyKey(privateRows.length > 0 || attemptIndex === 0 ? wakeKeyBase : `${wakeKeyBase}:retry-${attemptIndex}`);
		const requesterSessionId = requesterEntry.sessionId;
		const requesterLifecycleRevision = requesterEntry.lifecycleRevision;
		const isRequesterCurrent = () => {
			const currentRequester = getRequesterRun();
			if ((currentRequester !== requesterRun || currentRequester?.generation !== requesterGeneration || currentRequester?.createdAt !== requesterCreatedAt) && (!requesterRun || !currentRequester || currentRequester.runId !== directIdempotencyKey || currentRequester.taskRunId !== requesterTaskRunId || currentRequester.requesterSessionKey !== requesterRun.requesterSessionKey || currentRequester.requesterAgentId !== requesterRun.requesterAgentId)) return false;
			const currentSession = loadRequesterSessionEntry(requesterSessionKey, requesterAgentId).entry;
			return currentSession?.sessionId === requesterSessionId && currentSession?.lifecycleRevision === requesterLifecycleRevision;
		};
		const isBatchCurrent = () => {
			const currentRuns = filterCurrentDirectChildCompletionRows(listSubagentRunsForRequester(requesterSessionKey, {
				requesterAgentId,
				requesterStorePath
			}), {
				requesterSessionKey,
				requesterAgentId,
				getLatestSubagentRunByChildSessionKey
			});
			return settledBatch.every((entry) => currentRuns.includes(entry) && entry.requesterSettleWake?.rearmGeneration === currentRearmGeneration);
		};
		const isSourceSessionEffectsAllowed = () => !params.signal?.aborted && isStoreCurrent() && preparedFindings.isCurrent() && !isGatewayClosed() && isBatchCurrent() && isRequesterCurrent() && !isBatchDeliveryClosed();
		const settleRevokedBatch = () => {
			if (isGatewayClosed() || !isBatchCurrent()) return true;
			if (retireReplacedStore()) return true;
			if (isBatchDeliveryClosed() || !isRequesterCurrent()) {
				completeBatch(settledBatch, state);
				return true;
			}
			return false;
		};
		if (requesterAgentId && state.requesterYieldBatch && state.rearmGeneration !== void 0) transferRequesterFinalAttachment({
			requesterAgentId,
			requesterSessionKey,
			requesterSessionId: requesterEntry.sessionId,
			batchRunIds,
			rearmGeneration: state.rearmGeneration,
			requesterTurnRunId: directIdempotencyKey
		});
		let delivery;
		try {
			delivery = await subagentRuns.runWithCompletionBatchAuthority(settledBatch, () => withTaskProgressRequesterContinuation({
				entries: settledBatch,
				runId: directIdempotencyKey,
				requesterSessionId: requesterEntry.sessionId,
				isCurrent: isSourceSessionEffectsAllowed
			}, () => withRequesterCronAuthority({
				requesterSessionKey,
				requesterSessionId,
				requesterAgentId,
				batch: settledBatch,
				rearmGeneration: state.requesterYieldBatch ? state.rearmGeneration : void 0,
				runId: directIdempotencyKey,
				isCurrent: isSourceSessionEffectsAllowed
			}, () => deliverSubagentAnnouncement({
				requesterSessionKey,
				requesterAgentId,
				requesterRunTimeoutSeconds: requesterDepth >= 1 && requesterRun ? requesterRun.runTimeoutSeconds ?? 0 : void 0,
				triggerMessage: wakeMessage,
				steerMessage: wakeMessage,
				requesterSessionOrigin,
				directOrigin,
				sourceSessionKey: settleWakeSourceSessionKeys[0],
				settleWakeSourceSessionKeys,
				sourceTool: "subagent_settle",
				targetRequesterSessionKey: requesterSessionKey,
				requesterIsSubagent: requesterDepth >= 1,
				expectsCompletionMessage: false,
				requireDirectDelivery: true,
				...parentOnly ? {
					completionTarget: "parent",
					completionRequesterSessionId: requesterEntry.sessionId
				} : {},
				...!parentOnly && requesterYieldedAfterDelivery ? { requireVisibleReply: true } : {},
				directIdempotencyKey,
				signal: params.signal,
				resolveGatewayContext,
				isSourceSessionEffectsAllowed
			}))));
		} catch (error) {
			if (settleRevokedBatch()) return false;
			const lastError = error instanceof Error ? error.message : String(error);
			const replayCount = (state.replayCount ?? 0) + 1;
			const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[replayCount - 1];
			if (replayCount >= REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS || retryDelayMs === void 0) {
				completeBatch(settledBatch, state, {
					delivered: false,
					path: "none",
					error: lastError
				});
				return false;
			}
			const nextAttemptAt = Date.now() + retryDelayMs;
			state = {
				status: "dispatching",
				attemptCount: state.attemptCount,
				replayCount,
				nextAttemptAt,
				batchRunIds,
				...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
				...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
				...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {},
				lastError
			};
			params.transitionBatch(settledBatch, state);
			logWarn(`requester settle wake transport replay ${replayCount} scheduled in ${Math.round(retryDelayMs / 1e3)}s: ${lastError}`);
			return false;
		}
		if (delivery.delivered) {
			completeBatch(settledBatch, state, delivery, requesterEntry.sessionId);
			return true;
		}
		if (settleRevokedBatch()) return false;
		if (delivery.reason === "requester_turn_pending") {
			deferBatch({
				...state,
				lastError: void 0
			}, false);
			return false;
		}
		if (delivery.disposition === "ambiguous" || delivery.disposition === "permanent_failure" || delivery.disposition === "intentional_non_delivery" || delivery.reason === "requester_abandoned") {
			completeBatch(settledBatch, state, delivery, requesterEntry.sessionId);
			return false;
		}
		const attemptCount = attemptIndex + 1;
		const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[attemptIndex];
		const lastError = delivery.error ?? delivery.reason ?? "undelivered";
		if (attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS || retryDelayMs === void 0) {
			completeBatch(settledBatch, state, {
				...delivery,
				error: lastError
			}, requesterEntry.sessionId);
			return false;
		}
		const nextAttemptAt = Date.now() + retryDelayMs;
		params.transitionBatch(settledBatch, {
			status: "pending",
			attemptCount,
			nextAttemptAt,
			batchRunIds,
			...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
			...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
			...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {},
			lastError
		});
		logWarn(`requester settle wake attempt ${attemptCount} failed; retrying in ${Math.round(retryDelayMs / 1e3)}s: ${lastError}`);
		return false;
	} finally {
		if (activeRequesterSettleWakeBatches.get(wakeKeyBase) === isGatewayClosed) activeRequesterSettleWakeBatches.delete(wakeKeyBase);
	}
}
//#endregion
export { maybeWakeRequesterAfterAllChildrenSettled };
