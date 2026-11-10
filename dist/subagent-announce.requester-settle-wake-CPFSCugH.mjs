import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as getSharedGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { S as isCronSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as isSystemEventStoreCurrent, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-DAgHWXZ1.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { a as evaluateGatewayToolCallerReceiptAdmission } from "./gateway-caller-context-Be176_GV.mjs";
import "./config-B3oiWDlr.mjs";
import { k as isSameSubagentRunOwner, n as collectSubagentSessionReadKeys } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { n as hasSubagentRunEnded } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { I as matchesSubagentRequesterSession, L as selectConnectedSettledSubagentWave, b as withSubagentRunReadSnapshot, w as buildScopedSubagentRunReadIndexFromRuns } from "./subagent-registry-state-DBdy-FdI.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey, l as listSubagentRunsForRequester } from "./subagent-registry-read-DY0g8fGW.mjs";
import { l as getSubagentDepthFromSessionStoreInWorker } from "./subagent-capabilities-l3WVTf-e.mjs";
import { r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { i as hasRequesterCompletionCohort, t as buildRequesterSettleWakeIdentity, u as resolveCurrentRequesterSettleWakeBatch } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { r as isQuietSubagentRestartContinuation } from "./subagent-recovery-state-2yE_iEv1.mjs";
import { f as resolveSubagentRequesterAgentId, u as withRequesterCronAuthority } from "./requester-cron-authority-DgypcQxN.mjs";
import { a as readChildCompletionFindings, f as SubagentAnnouncePreparationConflictError, u as selectCurrentRequesterCompletionRows } from "./subagent-announce-output-K_UNDyxP.mjs";
import { _ as needsRequesterSettleFindings, b as retainedYieldIdentity, c as finalizeRequesterFinalAttachment, f as transferRequesterFinalAttachment, g as deferRequesterSettleWakePreparation, h as createRequesterSettleBatchDeferral, m as createRequesterSettleBatchClaim, n as getFollowupForCohort, p as captureRequesterRunOwner, s as withFollowupSuccessor, v as readSharedBatchState, x as startRequesterSettleWakeAttempt, y as resolveRequesterSettlePolicy } from "./session-followup-completion-Br4aSJSb.mjs";
import { c as withSubagentRequesterSource, i as loadRequesterSessionEntry, r as hasUsableSessionEntry, t as captureRequesterSessionEntryCurrent } from "./subagent-announce-delivery.runtime.js";
import { r as withSubagentProgressDraft } from "./subagent-progress-draft-uidxLZYr.mjs";
import { d as resolveAnnounceOrigin } from "./subagent-announce-completion-delivery-Bs9Ljx2e.mjs";
import { n as SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION, t as SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION } from "./subagent-completion-instructions-B70YK2BV.mjs";
import { i as isPermanentAnnounceDeliveryError } from "./subagent-announce-delivery-retry-Gxy4Sy-v.mjs";
import { t as deliverSubagentAnnouncement } from "./subagent-announce-delivery-C3AShlfK.mjs";
import { n as buildSubagentRestartRecoveryRoster, t as SUBAGENT_RESTART_RECOVERY_INSTRUCTION } from "./subagent-restart-recovery-prompt-CEingoLZ.mjs";
//#region src/agents/subagents/announce/subagent-announce.requester-settle-descendants.ts
function createRequesterDescendantReader(params) {
	const rearmGeneration = params.settledEntry.requesterSettleWake?.rearmGeneration;
	const isCurrent = () => {
		if (params.signal?.aborted || !params.isSourceCurrent()) return false;
		const current = listSubagentRunsForRequester(params.requesterSessionKey, {
			requesterAgentId: params.requesterAgentId,
			requesterStorePath: params.requesterStorePath
		}).find((entry) => isSameSubagentRunOwner(entry, params.settledEntry));
		return current?.requesterSettleWake !== void 0 && current.requesterSettleWake.rearmGeneration === rearmGeneration;
	};
	return async () => {
		if (!isCurrent()) return;
		const result = await withSubagentRunReadSnapshot(subagentRuns, (snapshot) => {
			if (!isCurrent()) return {
				runIds: [],
				sessionKeys: []
			};
			const sessionKeys = collectSubagentSessionReadKeys([params.requesterSessionKey], snapshot.values());
			return {
				runIds: [...snapshot.values()].filter((entry) => sessionKeys.has(entry.childSessionKey.trim())).map((entry) => entry.runId),
				sessionKeys: []
			};
		}, (_selection, runs) => {
			if (!isCurrent()) return;
			const index = buildScopedSubagentRunReadIndexFromRuns(new Map(runs), params.requesterSessionKey, params.requesterAgentId, params.requesterStorePath, params.rootRunIds);
			return {
				unsettled: index.hasDescendantRunAwaitingSettle(params.requesterSessionKey, params.settledEntry.runId, params.settledBefore),
				active: index.countActiveDescendantRuns(params.requesterSessionKey)
			};
		}, {
			sessionKeys: [params.requesterSessionKey],
			descendants: true
		});
		return isCurrent() ? result : void 0;
	};
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.requester-settle-message.ts
const REQUESTER_SETTLE_WAKE_ROUTE_NOTICE_MAX_CHARS = 1024;
const ROUTE_NOTICE_TRUNCATION = "\n[model-route changes truncated]";
function buildRequesterSettleWakeMessage(params) {
	const child = params.children.length === 1 ? params.children[0] : void 0;
	const pauseNotice = child?.pauseReason === "sessions_yield" ? child.requesterSettleWake?.pauseNotice : void 0;
	if (child && pauseNotice) return [
		"[Subagent Context] A child is paused awaiting a continuation; this is not a completion.",
		JSON.stringify({
			state: "paused",
			childSessionKey: child.childSessionKey,
			runId: child.runId,
			label: child.label ?? null
		}),
		`The child will resume only through sessions_send to ${child.childSessionKey}. Do not wait for its completion without sending the needed continuation.`,
		wrapPromptDataBlock({
			label: "Acknowledgment",
			text: pauseNotice.acknowledgment
		})
	].join("\n");
	const routeNotices = [...new Set(params.children.flatMap(({ completion }) => {
		const reply = completion?.terminalReply;
		return reply?.disposition === "visible" && reply.modelRouteChange ? [reply.modelRouteChange] : [];
	}))].toSorted().join("\n");
	const modelRouteChange = routeNotices.length > REQUESTER_SETTLE_WAKE_ROUTE_NOTICE_MAX_CHARS ? `${truncateUtf16Safe(routeNotices, 992)}${ROUTE_NOTICE_TRUNCATION}` : routeNotices;
	const recoveryRoster = buildSubagentRestartRecoveryRoster(params.recoveryChildren);
	return [
		params.descendantsUnsettled ? "[Subagent Context] Every subagent in this batch has ended, but a descendant result below it was still undelivered when waiting stopped; a child that later receives it may report again in a separate completion." : "[Subagent Context] Every subagent in this batch has now settled, including its descendants.",
		"[Subagent Context] Do not keep waiting or call sessions_yield again for this batch; no further completion events will arrive for it. Other batches may still be running.",
		...params.parentOnly ? [] : [`[Subagent Context] ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION}`],
		...recoveryRoster ? [`[Subagent Context] ${SUBAGENT_RESTART_RECOVERY_INSTRUCTION}`, recoveryRoster] : [],
		params.parentOnly ? `[Subagent Context] ${SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION}` : params.yieldedFinalDeliverable ? "[Subagent Context] Child results are internal input. Answer the original conversation under its normal reply rules: if replies there must go through the message tool, send your answer with it. Continue any unfinished work, and avoid repeating an update already delivered." : params.requireVisibleReply ? "[Subagent Context] Child completion delivery is internal; the original user request still requires your visible final answer only after the requested outcome is complete or genuinely blocked." : "[Subagent Context] Review the settled results and continue any unfinished work. Avoid repeating a consolidated final answer that was already delivered.",
		...modelRouteChange ? [modelRouteChange, params.preserveModelRouteNotice ? "[Subagent Context] Preserve this runtime-authored model-route change notice in your final answer." : "[Subagent Context] Keep this runtime-authored model-route change notice internal on this shared surface."] : [],
		"",
		params.findings ?? "(each child result was announced individually in earlier completion events)"
	].join("\n");
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.requester-settle-receipt.ts
/** Watch effects retain their original stores; the durable wake keeps its ordinary handoff rules. */
function createRequesterSettleReceiptAdmission(params) {
	const isEntryCurrent = (entry) => entry?.sessionId === params.identity.sessionId && entry.lifecycleRevision === params.identity.lifecycleRevision && params.isRecoveryCurrent();
	const admission = { async prepare() {
		const storeCurrent = captureSystemEventStoreCurrentCheck(params.storeSessionKey, params.storeAgentId);
		const [{ withSessionEntryReadOnlyInWorker }, { captureSessionEntryCurrentRead, captureNativeSessionEntryCurrentRead }] = await Promise.all([import("./session-entry-read-runtime-BS7SNC06.mjs"), import("./session-entry-current-runtime-Ctn0abZe.mjs")]);
		const scope = {
			sessionKey: params.requester.canonicalKey,
			agentId: params.requester.agentId,
			storePath: params.requester.storePath,
			projection: "list"
		};
		const bind = (current, entry) => {
			let currentEntry = entry;
			const isCurrent = () => {
				try {
					current.assertSourceCurrent();
					return params.storePaths().every(storeCurrent) && isEntryCurrent(current.kind === "file" ? currentEntry : current.readCurrent());
				} catch {
					return false;
				}
			};
			return {
				current: {
					sources: current.kind === "file" ? [current.source] : [],
					assertCurrent(entries) {
						if (current.kind === "file") currentEntry = entries[0];
						if (!isCurrent()) throw new Error("Requester settle authority changed during watch admission");
					}
				},
				isCurrent
			};
		};
		if (isIncognitoSessionKey(scope.sessionKey)) return bind(captureNativeSessionEntryCurrentRead(scope), void 0);
		return withSessionEntryReadOnlyInWorker(scope, () => {}, async (read, owner) => {
			if (!read.ok) throw read.error;
			return bind(captureSessionEntryCurrentRead(scope, owner), read.value);
		});
	} };
	return Object.assign(admission, {
		isRequesterCurrent: () => {
			try {
				return evaluateGatewayToolCallerReceiptAdmission(admission, () => isEntryCurrent(params.readCurrent()));
			} catch {
				return false;
			}
		},
		isStoreCurrent: () => evaluateGatewayToolCallerReceiptAdmission(admission, () => params.isStoreCurrent())
	});
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.requester-settle-wake.ts
/** Deliver drained requester waves; lifecycle owns their persisted outbox on retained run rows. */
const log = createSubsystemLogger("agents/subagent-announce");
const REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS = 3;
const REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS = 3;
const REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS = [3e4, 12e4];
/** Wake top-level or yielded requesters after their descendants settle; lifecycle owns transitions. */
async function maybeWakeRequesterAfterAllChildrenSettled(params) {
	return withSubagentRequesterSource(params.requesterSessionKey, params.settledEntry.requesterAgentId, async (isRequesterCurrent) => {
		return maybeWakeRequesterAfterAllChildrenSettledBound(isRequesterCurrent ? {
			...params,
			isSourceCurrent: () => isRequesterCurrent() && params.isSourceCurrent()
		} : params);
	});
}
async function maybeWakeRequesterAfterAllChildrenSettledBound(params) {
	if (params.signal?.aborted || !params.isSourceCurrent()) return false;
	const requesterSessionKey = params.requesterSessionKey.trim();
	const cfg = readRuntimeConfig();
	const requesterAgentId = resolveSubagentRequesterAgentId(cfg, params.settledEntry);
	const requesterStorePath = params.settledEntry.requesterStorePath ?? null;
	const initialState = params.settledEntry.requesterSettleWake;
	const pauseNotice = params.settledEntry.pauseReason === "sessions_yield" ? initialState?.pauseNotice : void 0;
	const pause = pauseNotice !== void 0;
	if (!requesterSessionKey || !initialState) return false;
	const readRequesterRuns = () => listSubagentRunsForRequester(requesterSessionKey, {
		requesterAgentId,
		requesterStorePath
	});
	let batchClaim = void 0;
	const completeBatch = async (batch, state, delivery, requesterSessionId) => {
		if (batchClaim?.claim() === false) return;
		await params.completeBatch(batch, state.rearmGeneration, delivery, () => finalizeRequesterFinalAttachment({
			requesterAgentId,
			requesterSessionKey,
			requesterSessionId,
			batchRunIds: batch.map((entry) => entry.runId).toSorted(),
			rearmGeneration: state.rearmGeneration,
			requesterYieldBatch: state.requesterYieldBatch,
			pause,
			delivered: delivery?.delivered,
			finalAssistantVisibleText: delivery?.finalAssistantVisibleText
		}));
	};
	const admittedRearmGeneration = initialState.rearmGeneration;
	if (isCronSessionKey(requesterSessionKey)) {
		await completeBatch([params.settledEntry], initialState);
		return false;
	}
	const requesterRuns = readRequesterRuns();
	const currentSettledEntry = requesterRuns.find((entry) => entry.runId === params.settledEntry.runId);
	const currentState = currentSettledEntry?.requesterSettleWake;
	if (!currentSettledEntry || !isSameSubagentRunOwner(currentSettledEntry, params.settledEntry) || !currentState || currentState.rearmGeneration !== admittedRearmGeneration) return false;
	const frozenBatchRunIds = currentState.batchRunIds;
	const frozen = Boolean(frozenBatchRunIds?.length);
	const currentRearmGeneration = currentState.rearmGeneration;
	const hasCurrentWake = (entry) => Boolean(entry?.requesterSettleWake) && entry?.requesterSettleWake?.rearmGeneration === currentRearmGeneration;
	const hasSettled = (entry) => entry.execution.status !== "running" && entry.pauseReason !== "sessions_yield" && hasSubagentRunEnded(entry);
	let settledBatch;
	if (pauseNotice) settledBatch = [currentSettledEntry];
	else if (frozenBatchRunIds && frozen) {
		const runsById = new Map(requesterRuns.map((entry) => [entry.runId, entry]));
		settledBatch = frozenBatchRunIds.map((runId) => runsById.get(runId)).filter(hasCurrentWake);
		if (!settledBatch.every(hasSettled)) return false;
	} else settledBatch = selectConnectedSettledSubagentWave(requesterRuns.filter((entry) => hasCurrentWake(entry) && hasSettled(entry)), currentSettledEntry);
	if (settledBatch.length === 0 || settledBatch.some((run) => run.expectsCompletionMessage === true && run.requesterTurnRunId)) return false;
	const transitionBatch = async (state) => {
		let published = false;
		await params.transitionBatch(settledBatch, state, (entries) => {
			settledBatch = [...entries];
			published = true;
		});
		if (!published) throw new Error("Requester wake transition was not published");
	};
	const resolveGatewayContext = getSharedGatewayContextResolver(settledBatch);
	const preparation = requesterAgentId ? resolveGatewayContext?.()?.agentDatabaseStartup?.waitForAgentPreparation(requesterAgentId, { signal: params.signal }) : void 0;
	if (preparation) {
		await preparation;
		if (params.signal?.aborted || !params.isSourceCurrent()) return false;
	}
	const batchRunIds = settledBatch.map((entry) => entry.runId).toSorted();
	const batchSessionKeys = [...new Set(settledBatch.map((run) => run.childSessionKey))].toSorted();
	const currentCompletionRows = (rows) => selectCurrentRequesterCompletionRows({
		rows,
		requesterSessionKey,
		requesterAgentId,
		frozenBatch: frozen,
		latestForSession: getLatestLiveSubagentRunByChildSessionKey
	});
	const readCurrentBatch = (requireUnchangedProgress = false) => resolveCurrentRequesterSettleWakeBatch({
		observed: settledBatch,
		currentRuns: currentCompletionRows(readRequesterRuns()),
		rearmGeneration: currentRearmGeneration,
		pause,
		requireUnchangedProgress
	});
	const isBatchCurrent = () => readCurrentBatch(true) !== void 0;
	const refreshBatch = () => {
		const current = readCurrentBatch();
		if (!current) return false;
		settledBatch = current;
		return true;
	};
	const selectedState = readSharedBatchState(settledBatch);
	const failBatch = (state, error) => completeBatch(settledBatch, state, {
		delivered: false,
		path: "none",
		error
	});
	const { batchKey: wakeKeyBase } = buildRequesterSettleWakeIdentity({
		requesterSessionKey,
		requesterAgentId,
		batchRunIds,
		rearmGeneration: selectedState.rearmGeneration,
		pause
	});
	const claim = createRequesterSettleBatchClaim(wakeKeyBase, resolveGatewayContext ? () => Boolean(resolveGatewayContext()) : void 0);
	if (!claim) return false;
	const { isGatewayClosed, claim: acquireBatch } = claim;
	batchClaim = claim;
	let requesterCurrent;
	try {
		const readRequesterDescendants = createRequesterDescendantReader({
			requesterSessionKey,
			requesterAgentId,
			requesterStorePath,
			settledEntry: currentSettledEntry,
			settledBefore: Math.min(...settledBatch.map((entry) => entry.createdAt)),
			rootRunIds: frozen ? new Set(frozenBatchRunIds) : void 0,
			signal: params.signal,
			isSourceCurrent: params.isSourceCurrent
		});
		const initialDescendants = await readRequesterDescendants();
		if (!initialDescendants) return false;
		const hasUnsettledDescendants = !pauseNotice && initialDescendants.unsettled;
		if (!frozen && hasUnsettledDescendants) return false;
		const retainedBatchRunIds = pauseNotice ? frozenBatchRunIds : batchRunIds;
		const isStoreCurrent = () => settledBatch.every((entry) => isSystemEventStoreCurrent(requesterSessionKey, entry.requesterStorePath, requesterAgentId));
		const retireReplacedStore = async () => {
			if (isStoreCurrent()) return false;
			await completeBatch(settledBatch, selectedState, {
				delivered: false,
				path: "none",
				error: "store replaced",
				storeReplaced: true,
				disposition: "intentional_non_delivery"
			});
			return true;
		};
		if (await retireReplacedStore()) return false;
		const followup = pauseNotice ? void 0 : getFollowupForCohort(settledBatch);
		const getRequesterRun = () => followup ? void 0 : getLatestLiveSubagentRunByChildSessionKey(requesterSessionKey, (entry) => entry.pauseReason === "sessions_yield", requesterAgentId) ?? getLatestLiveSubagentRunByChildSessionKey(requesterSessionKey, void 0, requesterAgentId);
		const requesterRun = getRequesterRun();
		const isRequesterRunCurrent = captureRequesterRunOwner(requesterRun);
		const isBatchDeliveryClosed = () => {
			const currentRequester = getRequesterRun();
			const currentRuns = readRequesterRuns();
			const currentBatch = settledBatch.map((entry) => currentRuns.find((current) => isSameSubagentRunOwner(current, entry)) ?? entry);
			return requesterRun?.killReconciliation?.suppressTaskDelivery === true || requesterRun?.suppressCompletionDelivery === true || currentRequester?.killReconciliation?.suppressTaskDelivery === true || currentRequester?.suppressCompletionDelivery === true || currentBatch.some((entry) => entry.killReconciliation?.suppressTaskDelivery === true) || currentBatch.every((entry) => entry.suppressCompletionDelivery === true);
		};
		if (isBatchDeliveryClosed()) {
			await completeBatch(settledBatch, selectedState);
			return false;
		}
		const deferBatch = createRequesterSettleBatchDeferral({
			readDescendants: readRequesterDescendants,
			claimCurrentBatch: () => acquireBatch() && params.isSourceCurrent() && refreshBatch(),
			readState: () => readSharedBatchState(settledBatch),
			transitionBatch,
			batchRunIds: retainedBatchRunIds,
			retryDelayMs: REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[0]
		});
		if (hasUnsettledDescendants && !await deferBatch()) return false;
		const interruptedContinuations = settledBatch.filter(isQuietSubagentRestartContinuation);
		const requiredSettled = settledBatch.filter((entry) => entry.expectsCompletionMessage === true || interruptedContinuations.includes(entry));
		const requesterYieldedAfterDelivery = selectedState.afterRequesterYield === true || selectedState.requesterYieldBatch === true && selectedState.rearmGeneration !== void 0;
		const requesterDepth = await getSubagentDepthFromSessionStoreInWorker(requesterSessionKey, {
			cfg,
			agentId: requesterAgentId
		});
		if (!pauseNotice && (requiredSettled.length === 0 || requiredSettled.length < 2 && !requiredSettled.some(needsRequesterSettleFindings) && !requesterYieldedAfterDelivery || !requesterYieldedAfterDelivery && interruptedContinuations.length === 0 && !hasRequesterCompletionCohort(currentSettledEntry) && requesterDepth >= 1)) {
			await completeBatch(settledBatch, selectedState);
			return false;
		}
		requesterCurrent = await captureRequesterSessionEntryCurrent(requesterSessionKey, requesterAgentId);
		const { readCurrent: readRequesterCurrent } = requesterCurrent;
		const requester = await loadRequesterSessionEntry(requesterSessionKey, requesterAgentId);
		const requesterEntry = requester.entry;
		if (!hasUsableSessionEntry(requesterEntry)) {
			await failBatch(selectedState, "requester session unavailable");
			return false;
		}
		const requesterIdentity = {
			sessionId: requesterEntry.sessionId,
			lifecycleRevision: requesterEntry.lifecycleRevision
		};
		const completionRows = currentCompletionRows(settledBatch);
		const recoveryRows = completionRows.filter((entry) => matchesSubagentRequesterSession(entry, requesterIdentity));
		const { privateRows, requireVisibleReply, parentOnly, requesterBinding, admissionMarker } = resolveRequesterSettlePolicy(completionRows, requesterYieldedAfterDelivery, selectedState, requesterIdentity, recoveryRows.length === completionRows.length);
		if (privateRows.some((entry) => !matchesSubagentRequesterSession(entry, requesterIdentity))) {
			await completeBatch(settledBatch, selectedState, {
				delivered: false,
				path: "none",
				reason: "completion_handoff_unavailable",
				error: "private completion requester session was replaced",
				terminal: true,
				disposition: "intentional_non_delivery"
			});
			return false;
		}
		const preparedFindings = pauseNotice ? {
			text: pauseNotice.acknowledgment,
			isCurrent: () => true
		} : await readChildCompletionFindings(completionRows.filter(needsRequesterSettleFindings));
		if (await retireReplacedStore()) return false;
		const requesterSessionOrigin = normalizeDeliveryContext(params.requesterOrigin);
		const directOrigin = resolveAnnounceOrigin(requesterEntry, requesterSessionOrigin);
		const completionChannel = normalizeMessageChannel(directOrigin?.channel);
		if (params.signal?.aborted || !acquireBatch() || !refreshBatch()) return false;
		let state = readSharedBatchState(settledBatch);
		if (!settledBatch.some((entry) => entry.requesterSettleWake)) return false;
		if ((state.nextAttemptAt ?? 0) > Date.now()) return false;
		const currentDescendants = await readRequesterDescendants();
		if (!currentDescendants || !params.isSourceCurrent() || !refreshBatch()) return false;
		state = readSharedBatchState(settledBatch);
		const descendantsUnsettled = !pauseNotice && currentDescendants.unsettled;
		if (descendantsUnsettled) {
			if (!await deferBatch()) return false;
			state = readSharedBatchState(settledBatch);
		}
		const wakeMessage = buildRequesterSettleWakeMessage({
			findings: preparedFindings.text,
			requireVisibleReply,
			parentOnly,
			yieldedFinalDeliverable: admissionMarker.yieldedFinalDeliverable,
			descendantsUnsettled,
			children: completionRows,
			recoveryChildren: recoveryRows,
			preserveModelRouteNotice: !completionChannel || !isDeliverableMessageChannel(completionChannel)
		});
		if (!preparedFindings.isCurrent()) throw new SubagentAnnouncePreparationConflictError("Child completion preparation changed.");
		const beforeDispatch = state;
		let attemptIndex;
		if (state.status === "dispatching") attemptIndex = Math.max(0, state.attemptCount - 1);
		else {
			if (state.attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS) {
				await failBatch(state, state.lastError ?? "requester settle wake attempts exhausted");
				return false;
			}
			attemptIndex = state.attemptCount;
			state = startRequesterSettleWakeAttempt(state, retainedBatchRunIds, admissionMarker);
			await transitionBatch(state);
		}
		if (!preparedFindings.isCurrent()) {
			await transitionBatch(deferRequesterSettleWakePreparation(beforeDispatch));
			return false;
		}
		const { runId: directIdempotencyKey } = buildRequesterSettleWakeIdentity({
			requesterSessionKey,
			requesterAgentId,
			batchRunIds,
			rearmGeneration: selectedState.rearmGeneration,
			attemptIndex,
			sharedAttemptKey: parentOnly,
			pause
		});
		const sourceReceiptAdmission = createRequesterSettleReceiptAdmission({
			requester,
			identity: requesterIdentity,
			storeSessionKey: requesterSessionKey,
			storeAgentId: requesterAgentId,
			storePaths: () => settledBatch.map((entry) => entry.requesterStorePath),
			isRecoveryCurrent: () => recoveryRows.every((entry) => matchesSubagentRequesterSession(entry, requesterIdentity)),
			readCurrent: readRequesterCurrent,
			isStoreCurrent
		});
		const isRequesterCurrent = () => {
			if (!sourceReceiptAdmission.isRequesterCurrent()) return false;
			if (followup) try {
				followup.assertCurrent();
				return true;
			} catch {
				return false;
			}
			return isRequesterRunCurrent(getRequesterRun(), directIdempotencyKey);
		};
		const isSourceSessionEffectsAllowed = () => !params.signal?.aborted && params.isSourceCurrent() && sourceReceiptAdmission.isStoreCurrent() && preparedFindings.isCurrent() && !isGatewayClosed() && isBatchCurrent() && isRequesterCurrent() && !isBatchDeliveryClosed();
		const settleRevokedBatch = async (knownUndelivered = false) => {
			if (isGatewayClosed() || !isBatchCurrent() || await retireReplacedStore()) return true;
			if (isBatchDeliveryClosed() || !isRequesterCurrent()) {
				if (pauseNotice && !isBatchDeliveryClosed() && sourceReceiptAdmission.isRequesterCurrent()) {
					await deferBatch(knownUndelivered ? { status: "pending" } : {}, false);
					return true;
				}
				await completeBatch(settledBatch, state);
				return true;
			}
			return false;
		};
		if (isSourceSessionEffectsAllowed() && !pauseNotice && requesterAgentId && state.requesterYieldBatch && state.rearmGeneration !== void 0) transferRequesterFinalAttachment({
			requesterAgentId,
			requesterSessionKey,
			requesterSessionId: requesterEntry.sessionId,
			batchRunIds,
			rearmGeneration: state.rearmGeneration,
			requesterTurnRunId: directIdempotencyKey
		});
		let delivery;
		try {
			const dispatch = () => subagentRuns.runWithCompletionBatchAuthority(settledBatch, () => withRequesterCronAuthority({
				requesterSessionKey,
				requesterSessionId: requesterIdentity.sessionId,
				requesterAgentId,
				batch: settledBatch,
				rearmGeneration: state.requesterYieldBatch ? state.rearmGeneration : void 0,
				runId: directIdempotencyKey,
				isCurrent: isSourceSessionEffectsAllowed
			}, () => deliverSubagentAnnouncement({
				requesterSessionKey,
				requesterAgentId,
				triggerMessage: wakeMessage,
				requesterSessionOrigin,
				directOrigin,
				sourceSessionKey: batchSessionKeys[0],
				settleWakeSourceSessionKeys: batchSessionKeys,
				sourceTool: "subagent_settle",
				targetRequesterSessionKey: requesterSessionKey,
				requesterIsSubagent: requesterDepth >= 1,
				expectsCompletionMessage: false,
				requireDirectDelivery: true,
				...requesterBinding,
				...!pauseNotice && requireVisibleReply ? { requireVisibleReply } : {},
				directIdempotencyKey,
				signal: params.signal,
				resolveGatewayContext,
				isSourceSessionEffectsAllowed,
				sourceReceiptAdmission
			})));
			delivery = await withSubagentProgressDraft(settledBatch, directIdempotencyKey, () => followup ? withFollowupSuccessor(followup.successor(settledBatch, directIdempotencyKey, () => {
				if (!isSourceSessionEffectsAllowed()) throw new Error("Followup completion cohort changed.");
			}), dispatch) : dispatch());
		} catch (error) {
			if (await settleRevokedBatch()) return false;
			const lastError = error instanceof Error ? error.message : String(error);
			if (isPermanentAnnounceDeliveryError(error)) {
				await completeBatch(settledBatch, state, {
					delivered: false,
					path: "none",
					disposition: "permanent_failure",
					error: lastError
				});
				return false;
			}
			const replayCount = (state.replayCount ?? 0) + 1;
			const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[replayCount - 1];
			if (replayCount >= REQUESTER_SETTLE_WAKE_MAX_AMBIGUOUS_REPLAYS || retryDelayMs === void 0) {
				await failBatch(state, lastError);
				return false;
			}
			state = {
				status: "dispatching",
				attemptCount: state.attemptCount,
				replayCount,
				nextAttemptAt: Date.now() + retryDelayMs,
				batchRunIds: retainedBatchRunIds,
				...retainedYieldIdentity(state),
				deferralCount: state.deferralCount,
				lastError
			};
			await transitionBatch(state);
			log.warn("requester settle wake transport replay scheduled", {
				err: error,
				requesterSessionKey,
				directIdempotencyKey,
				replayCount,
				retryDelayMs
			});
			return false;
		}
		if (delivery.delivered) {
			await completeBatch(settledBatch, state, delivery, requesterEntry.sessionId);
			return true;
		}
		if (await settleRevokedBatch(delivery.reason === "source_owner_changed")) return false;
		if (pauseNotice && delivery.reason === "source_owner_changed") {
			await deferBatch({ status: "pending" }, false);
			return false;
		}
		if (delivery.reason === "requester_turn_pending") {
			await deferBatch({ lastError: void 0 }, false);
			return false;
		}
		if (delivery.disposition === "ambiguous" || delivery.disposition === "permanent_failure" || delivery.disposition === "intentional_non_delivery" || delivery.reason === "requester_abandoned") {
			await completeBatch(settledBatch, state, delivery, requesterEntry.sessionId);
			return false;
		}
		const attemptCount = attemptIndex + 1;
		const retryDelayMs = REQUESTER_SETTLE_WAKE_RETRY_DELAYS_MS[attemptIndex];
		const lastError = delivery.error ?? delivery.reason ?? "undelivered";
		if (attemptCount >= REQUESTER_SETTLE_WAKE_MAX_ATTEMPTS || retryDelayMs === void 0) {
			await completeBatch(settledBatch, state, {
				...delivery,
				error: lastError
			}, requesterEntry.sessionId);
			return false;
		}
		await transitionBatch({
			status: "pending",
			attemptCount,
			nextAttemptAt: Date.now() + retryDelayMs,
			batchRunIds: retainedBatchRunIds,
			...retainedYieldIdentity(state),
			deferralCount: state.deferralCount,
			lastError
		});
		log.warn("requester settle wake attempt failed; retry scheduled", {
			error: lastError,
			requesterSessionKey,
			directIdempotencyKey,
			attemptCount,
			retryDelayMs,
			disposition: delivery.disposition,
			reason: delivery.reason
		});
		return false;
	} finally {
		requesterCurrent?.release();
		claim.release();
	}
}
//#endregion
export { maybeWakeRequesterAfterAllChildrenSettled };
