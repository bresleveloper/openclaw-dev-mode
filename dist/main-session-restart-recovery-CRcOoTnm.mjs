import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { n as waitForAbortSignal } from "./abort-signal-QqAmLWTl.mjs";
import "./backoff-BrzXG7iD.mjs";
import { p as hasLiveAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as deliveryContextKey, s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { p as preparePhysicalSessionStorePath } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { n as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { a as loadSessionEntry, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { r as MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL } from "./input-provenance-D1LHo5Qj.mjs";
import { l as listSessionEntriesByStatus } from "./session-accessor.entry-Di4jQk7u.mjs";
import { o as persistSessionTranscriptTurn } from "./session-accessor-cUVSaeKy.mjs";
import { C as applySessionEntryExactReplacements, c as updateSessionEntry } from "./session-accessor.reset-DWr6djSD.mjs";
import { a as hasRestartRecoveryTerminalRun, t as buildRestartRecoveryClaimCleanupPatch, u as resolveRestartRecoveryChannelAuthority } from "./restart-recovery-state-IiHiWzPq.mjs";
import { i as buildRestartRecoveryExpectedState } from "./session-turn.kernel-BgyMSLiQ.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-BczELu-B.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-CEhnMlD1.mjs";
import { n as resolveSendPolicy } from "./send-policy-dVeTk31X.mjs";
import "./lanes-D7a4ntDu.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-BH2MRg79.mjs";
import { a as readAdmittedHarnessCompletionInput, r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-gh1bO9o-.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-Cmhed7ry.mjs";
import { a as isMainSessionRecoveryPending, i as isMainRestartRecoveryCandidate, r as isMainRestartRecoveryAggregateTerminalOnly, t as getMainSessionRecoveryRetryCount } from "./main-session-recovery-state-YrhflDrO.mjs";
import { i as resolveRestartRecoveryTerminalClientRunId, n as discoverRestartRecoveryStoreTargets, r as mainSessionRecoveryLog } from "./main-session-restart-recovery-shared-C1qwMzcR.mjs";
import { t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-BbHQ1t6i.mjs";
import { l as findDeliveryIntentOwners } from "./delivery-queue-storage-CTPwC17-.mjs";
import { n as runWithMainSessionRecoveryAdmission } from "./main-session-recovery-admission-CE3KTRAe.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-9eDgqwFV.mjs";
import { a as scheduleMainSessionRecoveryMutation, i as retryMainSessionRecoveryMutation, r as repairMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-Bj9fhVK-.mjs";
import { n as commitMainSessionRecovery } from "./main-session-recovery-store-C6743x2T.mjs";
import "./user-turn-transcript-DeadOwaM.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
import { m as readSessionTranscriptSummaryAsync, s as readSessionMessagesAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-B7HapOub.mjs";
import { l as listSubagentRunsForRequester } from "./subagent-registry-read-BE_xWkJl.mjs";
import { l as isTerminalSilentAssistantMessage, n as getTranscriptMessageRole, u as readTerminalSourceReplyDeliveryMirror } from "./message-visibility-D9way_Lv.mjs";
import { t as TOOL_FAILURE_INSTRUCTION } from "./tool-outcome-instructions-D1-OxlK6.mjs";
import { n as isRestartAbortTailArtifact, r as resolveMainSessionResumePolicy, t as hasReplaySafeCodeModeCheckpointInCurrentTurn } from "./main-session-restart-recovery-resume-policy-iIN7m6NS.mjs";
import { i as createCurrentProcessOwnerLookup, n as markRestartAbortedMainSessions, r as markStartupOrphanedMainSessionsForRecovery } from "./main-session-restart-recovery-marking-CuUQFfm2.mjs";
import { r as restartRecoveryStoreTargetKey } from "./main-session-restart-recovery-diagnostics-B63x0hcM.mjs";
import { n as resolveRestartRecoveryDispatchTarget } from "./main-session-restart-recovery-target-GQI_i4ky.mjs";
import { n as buildSubagentRestartRecoveryRoster, t as SUBAGENT_RESTART_RECOVERY_INSTRUCTION } from "./subagent-restart-recovery-prompt-CKn0Vqa1.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-recovery-capacity.ts
function createMainSessionRecoveryCapacity(options) {
	let active = 0;
	return { async acquire(shouldContinue) {
		while (active >= options.limit && shouldContinue()) await sleepWithAbort(50, void 0, { ref: false });
		if (!shouldContinue()) return;
		active += 1;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			active -= 1;
		};
	} };
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-dispatch-start.ts
const RESTART_RECOVERY_START_OBSERVATION_MS = 1e4;
async function dispatchRestartRecoveryUntilStarted(params) {
	let dispatchAccepted = false;
	let executionStarted = false;
	let executionStartTimedOut = false;
	let preStartAbortAttempted = false;
	let preStartAbortConfirmed = false;
	let startOwner;
	const observe = () => ({
		dispatchAccepted,
		executionStarted,
		preStartAbortAttempted,
		preStartAbortConfirmed
	});
	const executionStart = createDeferredCore();
	const executionStartAbort = new AbortController();
	const abortBeforeStart = () => {
		if (!startOwner || executionStarted || preStartAbortAttempted) return;
		preStartAbortAttempted = true;
		preStartAbortConfirmed = startOwner.abort();
	};
	const executionStartTimeout = createDeferredCore();
	let executionStartTimer;
	const clearExecutionStartTimer = () => {
		if (executionStartTimer) {
			clearTimeout(executionStartTimer);
			executionStartTimer = void 0;
		}
	};
	const onExecutionStarted = () => {
		if (executionStartTimedOut || startOwner?.observe()?.executionStarted !== true) return;
		executionStarted = true;
		clearExecutionStartTimer();
		executionStart.resolve();
	};
	const observeExecutionStart = () => {
		const ownerState = startOwner?.observe();
		if (ownerState?.executionStarted) {
			onExecutionStarted();
			return;
		}
		if (ownerState && ownerState.expiresAtMs > Date.now()) {
			scheduleObservation(Math.min(RESTART_RECOVERY_START_OBSERVATION_MS, ownerState.expiresAtMs - Date.now()));
			return;
		}
		executionStartTimedOut = true;
		const error = /* @__PURE__ */ new Error("restart recovery execution start timeout");
		abortBeforeStart();
		executionStartAbort.abort(error);
		executionStartTimeout.resolve({
			kind: "failed",
			error,
			observation: observe()
		});
	};
	const scheduleObservation = (delayMs) => {
		executionStartTimer = setTimeout(observeExecutionStart, delayMs);
		executionStartTimer.unref?.();
	};
	scheduleObservation(RESTART_RECOVERY_START_OBSERVATION_MS);
	let dispatchPromise;
	try {
		dispatchPromise = params.gatewayRuntime.dispatchAgent(params.agentParams, void 0, {
			expectFinal: true,
			onAccepted: () => {
				dispatchAccepted = true;
			},
			onStartOwner: (owner) => {
				startOwner ??= owner;
				if (executionStartTimedOut) abortBeforeStart();
			},
			onExecutionStarted,
			onSignalAbort: abortBeforeStart,
			signal: executionStartAbort.signal
		});
	} catch (error) {
		clearExecutionStartTimer();
		return {
			kind: "failed",
			error,
			observation: observe()
		};
	}
	const terminalDispatchOutcome = dispatchPromise.then((result) => {
		if (result.status === "in_flight") {
			dispatchAccepted = true;
			return executionStartTimeout.promise;
		}
		clearExecutionStartTimer();
		params.onSettled?.();
		return {
			kind: "terminal",
			observation: observe(),
			result
		};
	}, (error) => {
		clearExecutionStartTimer();
		params.onSettled?.();
		return {
			kind: "failed",
			error,
			observation: observe()
		};
	});
	return await Promise.race([
		terminalDispatchOutcome,
		executionStartTimeout.promise,
		executionStart.promise.then(() => ({
			kind: "started",
			observation: observe()
		}))
	]);
}
function normalizeRestartRecoveryTerminalStatus(value) {
	return value === "error" || value === "ok" || value === "timeout" ? value : void 0;
}
async function probeRestartRecoveryTerminalStatus(runId, gatewayRuntime) {
	try {
		const result = await gatewayRuntime.waitForAgent({
			runId,
			timeoutMs: 0
		}, 2e3);
		const status = normalizeRestartRecoveryTerminalStatus(result.status);
		return status === "timeout" && typeof result.endedAt !== "number" ? void 0 : status;
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-dispatch-capacity.ts
async function dispatchRestartRecoveryWithinCapacity(params) {
	const terminalRunId = params.agentParams.idempotencyKey;
	if (!terminalRunId) throw new Error("Restart recovery capacity requires an idempotency key");
	const release = await params.capacity?.acquire(params.shouldContinue);
	if (params.capacity && !release) return;
	if (!params.beginDispatch()) {
		release?.();
		return;
	}
	let settled = false;
	const onSettled = () => {
		release?.();
		if (!settled) {
			settled = true;
			params.onSettled?.();
		}
	};
	try {
		const outcome = await dispatchRestartRecoveryUntilStarted({
			agentParams: params.agentParams,
			gatewayRuntime: params.gatewayRuntime,
			onSettled
		});
		if (outcome.kind !== "started") onSettled();
		else if (release) releaseCapacityAtTerminal({
			gatewayRuntime: params.gatewayRuntime,
			onSettled,
			runId: terminalRunId,
			shouldContinue: params.shouldContinue
		});
		return outcome;
	} catch (error) {
		onSettled();
		throw error;
	}
}
async function releaseCapacityAtTerminal(params) {
	try {
		while (params.shouldContinue()) try {
			const result = await params.gatewayRuntime.waitForAgent({
				runId: params.runId,
				timeoutMs: 3e4
			}, 35e3);
			if (result.status !== "timeout" || typeof result.endedAt === "number") return;
			if (!hasLiveAgentRunContext(params.runId)) return;
		} catch {
			if (!hasLiveAgentRunContext(params.runId)) return;
			await sleepWithAbort(1e3, void 0, { ref: false });
		}
	} finally {
		params.onSettled();
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-dispatch-settlement.ts
async function settleRestartRecoveryDispatch(params) {
	await applySessionEntryExactReplacements({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		update: (entries) => {
			if (params.shouldContinue?.() === false) return { result: void 0 };
			const current = entries.filter(({ entry }) => entry.sessionId === params.expectedSessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.expectedRecoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === params.expectedRecoverySourceRunId).toSorted((a, b) => (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0))[0];
			if (!current) return { result: void 0 };
			const entry = current.entry;
			const now = Date.now();
			if (params.terminalStatus) {
				entry.abortedLastRun = params.terminalStatus !== "ok";
				entry.status = params.terminalStatus === "ok" ? "done" : params.terminalStatus === "timeout" ? "timeout" : "failed";
				entry.endedAt = now;
				const startedAt = asFiniteNumber(entry.startedAt);
				if (startedAt !== void 0) entry.runtimeMs = Math.max(0, now - startedAt);
				entry.restartRecoveryForceSafeTools = void 0;
				Object.assign(entry, buildRestartRecoveryClaimCleanupPatch({
					entry,
					recordTerminalSource: true,
					terminalRunId: params.expectedRecoveryRunId,
					terminalSourceRunId: params.expectedRecoverySourceRunId
				}), buildMainSessionRecoveryClearPatch(entry));
			} else entry.abortedLastRun = false;
			entry.updatedAt = now;
			return {
				result: void 0,
				replacements: [{
					sessionKey: current.sessionKey,
					entry
				}]
			};
		}
	});
}
function isExactRestartRecoveryDispatchAdmission(params) {
	const entry = params.admission.entry;
	return entry?.sessionId === params.sessionId && (entry.abortedLastRun === false && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.recoveryRunId && entry.restartRecoveryRuns?.some((run) => run.runId === params.recoveryRunId && run.lifecycleGeneration === params.lifecycleGeneration) === true || hasRestartRecoveryTerminalRun(entry, params.recoveryRunId) && (params.terminalStatus === "ok" && entry.status === "done" || params.terminalStatus === "error" && entry.status === "failed" || params.terminalStatus === "timeout" && entry.status === "timeout"));
}
async function settleAcceptedRestartRecovery(params) {
	const admission = await commitMainSessionRecovery({
		command: {
			kind: "admit_recovery",
			lifecycleGeneration: params.lifecycleGeneration,
			now: Date.now(),
			runId: params.expectedRecoveryRunId,
			sessionId: params.expectedSessionId
		},
		shouldContinue: params.shouldContinue,
		target: params
	});
	if (admission.transition.kind !== "admitted_recovery" && !isExactRestartRecoveryDispatchAdmission({
		admission,
		lifecycleGeneration: params.lifecycleGeneration,
		recoveryRunId: params.expectedRecoveryRunId,
		sessionId: params.expectedSessionId,
		terminalStatus: params.terminalStatus
	})) return false;
	if (params.shouldContinue?.() === false) return true;
	if (params.reservation) await commitMainSessionRecovery({
		command: {
			kind: "abandon_reservation",
			reservation: params.reservation
		},
		target: params
	});
	if (params.shouldContinue?.() !== false) await settleRestartRecoveryDispatch(params);
	return true;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-delivery.ts
function resolveRestartRecoveryDeliveryContext(params) {
	const activeRunDeliveryContext = normalizeDeliveryContext(params.entry.restartRecoveryDeliveryContext);
	const hasActiveRunDeliveryClaim = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId) !== void 0;
	const deliveryContext = normalizeDeliveryContext(params.entry.pendingFinalDelivery?.context) ?? activeRunDeliveryContext ?? (params.includeSessionDeliveryFallback && !hasActiveRunDeliveryClaim ? deliveryContextFromSession(params.entry) : void 0);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
	if (params.cfg && resolveSendPolicy({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey,
		channel,
		chatType: params.entry.chatType
	}) === "deny") return;
	return {
		...deliveryContext,
		channel,
		to
	};
}
/** Recheck the owning recovery, not a remembered route, at each delivery boundary. */
function isRestartRecoveryDeliveryCurrent(params) {
	if (params.shouldContinue?.() === false || getAgentEventLifecycleGeneration() !== params.lifecycleGeneration) return false;
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.sessionId && current.status === "running" && current.abortedLastRun !== true && current.restartRecoveryDeliveryRunId === params.recoveryRunId && current.restartRecoverySourceReplyDeliveryMode !== "message_tool_only" && deliveryContextKey(resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: current,
		sessionKey: params.sessionKey
	})) === deliveryContextKey(params.deliveryContext);
}
async function announceRestartRecoveryResumption(params) {
	const isCurrent = (cfg) => isRestartRecoveryDeliveryCurrent({
		...params,
		cfg
	});
	try {
		if (!isRestartRecoveryDeliveryCurrent(params)) return;
		await params.gatewayRuntime.sendRecoveryNotice({
			...params.deliveryContext,
			text: "I'm continuing your interrupted request now (the gateway has just restarted).  Don't be concerned with the lack of typing; I am working behind the scenes and I'll send a message when I'm done!",
			idempotencyKey: `main-session-restart-recovery:${params.recoveryRunId}:resumed-notice`,
			liveOnly: true,
			isCurrent
		});
	} catch (error) {
		mainSessionRecoveryLog.warn(`failed to announce restart recovery ${params.sessionKey}: ${String(error)}`);
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-dispatch.ts
const RESTART_RECOVERY_RESUME_MESSAGE = formatSystemTurnPrompt(`Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. The restart did not cancel the user's task. Continue from the existing transcript: check the current state, recover interrupted work, and finish the task without asking the user to repeat the request. ${SUBAGENT_RESTART_RECOVERY_INSTRUCTION} Treat a tool result marked interrupted or missing as having an unknown outcome; verify what happened before repeating an action. ${TOOL_FAILURE_INSTRUCTION}`);
const RESTART_SAFE_TOOLS_NOTICE = "For this turn only, the tool surface has been narrowed to replay-safe tools as a recovery precaution. Use the tools that are available to report status or continue read-only work; the full tool surface restores on the next user turn.";
function hasRestartRecoveryMessageActionAuthority(entry) {
	const authority = resolveRestartRecoveryChannelAuthority(entry);
	return authority !== void 0 && isTrustedMessageActionTurnIngress(authority.deliveryContext.channel);
}
/** Internal continuations never inherit channel authority; every other message-tool recovery must. */
function requiresRestartRecoveryMessageActionAuthority(entry) {
	return entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" && entry.restartRecoverySourceIngress !== "internal";
}
function buildResumeMessage(pendingFinalDeliveryText, forceRestartSafeTools, childRecoveryRoster) {
	const sanitizedPendingText = sanitizePendingFinalDeliveryText(pendingFinalDeliveryText);
	const instructions = forceRestartSafeTools ? `${RESTART_RECOVERY_RESUME_MESSAGE}\n\n${RESTART_SAFE_TOOLS_NOTICE}` : RESTART_RECOVERY_RESUME_MESSAGE;
	const base = childRecoveryRoster ? `${instructions}\n\n${childRecoveryRoster}` : instructions;
	return sanitizedPendingText ? `${base}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"` : base;
}
function readInterruptedRunId(entry) {
	const runs = entry.restartRecoveryRuns;
	return runs?.length === 1 ? runs[0]?.runId : !runs?.length ? normalizeOptionalString(entry.lifecycleRunId) : void 0;
}
async function rollbackRestartRecoveryReservation(params) {
	return await retryMainSessionRecoveryMutation(async () => commitMainSessionRecovery({
		command: {
			kind: params.kind,
			reservation: params.reservation
		},
		requireWriteSuccess: true,
		target: params
	}));
}
function scheduleRestartRecoveryReservationRollback(params) {
	scheduleMainSessionRecoveryMutation({
		mutation: () => rollbackRestartRecoveryReservation(params),
		onError: (error) => {
			mainSessionRecoveryLog.warn(`failed delayed restart recovery reservation rollback ${params.sessionKey}: ${String(error)}`);
		},
		onSuccess: ({ entry, sessionKey }) => {
			if (entry?.sessionId === params.reservation.sessionId && sessionKey && isMainSessionRecoveryPending(entry, sessionKey)) scheduleMainSessionRecoveryPendingTarget({
				agentId: params.agentId,
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			});
		}
	});
}
async function resumeMainSession(params) {
	return await runWithMainSessionRecoveryAdmission({
		...params,
		sessionId: params.entry.sessionId,
		admission: params.recoveryAdmission,
		isCurrent: () => loadExactSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			readConsistency: "latest"
		})?.entry.sessionId === params.entry.sessionId,
		run: (recoveryAdmission) => resumeMainSessionWithinAdmission({
			...params,
			recoveryAdmission,
			shouldContinue: recoveryAdmission.shouldContinue
		})
	}) ?? "skipped";
}
async function resumeMainSessionWithinAdmission(params) {
	if (params.shouldContinue?.() === false) return "skipped";
	const harnessCompletion = params.entry.restartRecoveryHarnessCompletion;
	const taskRemainsOwed = () => !harnessCompletion || Boolean(getOwedHarnessCompletionTask(harnessCompletion, params.entry));
	if (!taskRemainsOwed()) return "skipped";
	const lifecycleGeneration = params.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	const sanitizedPendingText = typeof params.pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(params.pendingFinalDeliveryText) : "";
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	const claimedRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const claimedSourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const sourceRunId = claimedSourceRunId ?? readInterruptedRunId(params.entry);
	if (requiresRestartRecoveryMessageActionAuthority(params.entry) && !hasRestartRecoveryMessageActionAuthority(params.entry)) {
		mainSessionRecoveryLog.warn(`refusing message-tool-only recovery without channel authority: ${params.sessionKey}`);
		return "failed";
	}
	const claimedRunWasAdmittedBeforeRestart = claimedRunId !== void 0 && params.entry.restartRecoveryRuns?.some((run) => run.runId === claimedRunId && run.lifecycleGeneration !== lifecycleGeneration) === true;
	const recoveryRunId = claimedRunId && claimedRunId !== sourceRunId && !claimedRunWasAdmittedBeforeRestart ? claimedRunId : randomUUID();
	const reusingRecoveryRunId = recoveryRunId === claimedRunId;
	const dispatchSessionKey = params.canonicalSessionKey ?? params.sessionKey;
	const target = {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	};
	const settlementTarget = {
		...target,
		expectedRecoveryRunId: recoveryRunId,
		expectedRecoverySourceRunId: sourceRunId,
		expectedSessionId: params.entry.sessionId,
		lifecycleGeneration,
		sessionKeys: Array.from(/* @__PURE__ */ new Set([dispatchSessionKey, params.sessionKey])),
		shouldContinue: params.shouldContinue
	};
	let reservation;
	let dispatchStarted = false;
	let dispatchAccepted = false;
	let executionStarted = false;
	let preStartAbortAttempted = false;
	let preStartAbortConfirmed = false;
	const rollbackReservation = async (kind) => {
		if (!reservation) return;
		const result = await rollbackRestartRecoveryReservation({
			...target,
			kind,
			reservation
		});
		reservation = void 0;
		return result;
	};
	const restoreAcceptedRecovery = async () => {
		if (params.shouldContinue?.() === false) return;
		const restored = await commitMainSessionRecovery({
			command: {
				kind: "mark_admitted_recovery_interrupted",
				cycleId: params.observation.cycleId,
				attempt: params.recoveryAttempt,
				lifecycleGeneration,
				now: Date.now(),
				runId: recoveryRunId,
				sessionId: params.entry.sessionId
			},
			requireWriteSuccess: true,
			shouldContinue: params.shouldContinue,
			target
		});
		return params.shouldContinue?.() !== false && (restored.transition.kind === "applied" || restored.transition.kind === "no_change") && restored.entry && restored.sessionKey ? {
			...target,
			sessionId: restored.entry.sessionId,
			sessionKey: restored.sessionKey
		} : void 0;
	};
	const repairAcceptedRecovery = async () => {
		const restored = await repairMainSessionRecoveryMutation({
			mutation: restoreAcceptedRecovery,
			onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
			onError: (restoreError) => {
				if (params.shouldContinue?.() !== false) mainSessionRecoveryLog.warn(`failed to restore ambiguous restart recovery ${params.sessionKey}: ${String(restoreError)}`);
			}
		});
		if (params.shouldContinue?.() !== false) scheduleMainSessionRecoveryPendingTarget(restored);
	};
	try {
		const reserved = await commitMainSessionRecovery({
			command: {
				kind: "prepare_attempt",
				attempt: params.recoveryAttempt,
				lifecycleGeneration,
				now: Date.now(),
				observation: params.observation,
				runId: recoveryRunId,
				executionIdentity: isExecutionIdentityCollectionEnabled(params.cfg) ? { state: "enabled" } : { state: "disabled" }
			},
			requireWriteSuccess: true,
			shouldContinue: params.shouldContinue,
			target
		});
		if (reserved.transition.kind !== "reserved") return "skipped";
		reservation = reserved.transition.reservation;
		if (params.shouldContinue?.() === false || !taskRemainsOwed()) {
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		if (!await applySessionEntryExactReplacements({
			agentId: target.agentId,
			sessionKeys: [params.sessionKey],
			storePath: params.storePath,
			update: (entries) => {
				if (params.shouldContinue?.() === false || !taskRemainsOwed()) return { result: false };
				const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
				if (!entry || entry.sessionId !== params.entry.sessionId || harnessCompletion && (entry.lifecycleRevision !== harnessCompletion.lifecycleRevision || entry.restartRecoveryHarnessCompletion?.taskId !== harnessCompletion.taskId) || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== claimedRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== claimedSourceRunId || !claimedSourceRunId && readInterruptedRunId(entry) !== sourceRunId) return { result: false };
				if (!claimedRunId && deliveryContext) entry.restartRecoveryDeliveryContext = deliveryContext;
				entry.restartRecoveryDeliveryRunId = recoveryRunId;
				entry.restartRecoveryDeliverySourceRunId = sourceRunId;
				entry.restartRecoveryForceSafeTools = params.forceRestartSafeTools ? true : void 0;
				entry.updatedAt = Date.now();
				return {
					result: true,
					replacements: [{
						sessionKey: params.sessionKey,
						entry
					}]
				};
			}
		})) {
			const rollback = await rollbackReservation("cancel_reservation");
			if (params.shouldContinue?.() === false) return "skipped";
			const current = rollback?.entry;
			return current?.sessionId === params.entry.sessionId && current.status === "running" && current.abortedLastRun === true && !current.mainRestartRecovery?.reservation && !current.mainRestartRecovery?.tombstone ? "failed" : "skipped";
		}
		const requesterStorePath = await preparePhysicalSessionStorePath({
			agentId: params.agentId,
			sessionKey: dispatchSessionKey,
			storePath: params.storePath
		});
		const agentParams = {
			agentId: params.agentId,
			message: buildResumeMessage(sanitizedPendingText, params.forceRestartSafeTools, buildSubagentRestartRecoveryRoster(listSubagentRunsForRequester(dispatchSessionKey, {
				requesterAgentId: params.agentId,
				requesterSessionId: params.entry.sessionId,
				requesterLifecycleRevision: params.entry.lifecycleRevision,
				requesterStorePath
			}))),
			sessionKey: dispatchSessionKey,
			expectedExistingSessionId: params.entry.sessionId,
			internalRuntimeHandoffId: params.recoveryAdmission.handoffId,
			...isExecutionIdentityCollectionEnabled(params.cfg) ? { internalExecutionIdentityRetry: params.recoveryAttempt > 1 } : {},
			internalExecutionIdentityRecoveryAttempt: params.recoveryAttempt,
			idempotencyKey: recoveryRunId,
			deliver: Boolean(deliveryContext) && params.entry.restartRecoverySourceReplyDeliveryMode !== "message_tool_only",
			lane: "main",
			...params.entry.restartRecoverySourceReplyDeliveryMode ? { sourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode } : {},
			...params.forceRestartSafeTools ? { forceRestartSafeTools: true } : {},
			...params.forceCodeModeTools ? { forceCodeModeTools: true } : {},
			inputProvenance: {
				kind: "internal_system",
				sourceSessionKey: dispatchSessionKey,
				sourceTool: MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL
			}
		};
		if (deliveryContext) {
			agentParams.channel = deliveryContext.channel;
			agentParams.to = deliveryContext.to;
			agentParams.bestEffortDeliver = true;
			if (deliveryContext.accountId) agentParams.accountId = deliveryContext.accountId;
			if (deliveryContext.threadId != null) agentParams.threadId = String(deliveryContext.threadId);
		}
		if (params.shouldContinue?.() === false || !taskRemainsOwed()) {
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		if (params.forceRestartSafeTools) mainSessionRecoveryLog.info(`dispatching restart-safe recovery for ${params.sessionKey}`);
		dispatchStarted = true;
		let dispatchSettled = false;
		let stopTyping;
		const dispatchOutcome = await dispatchRestartRecoveryWithinCapacity({
			agentParams,
			capacity: params.recoveryCapacity,
			beginDispatch: params.recoveryAdmission.beginDispatch,
			gatewayRuntime: params.gatewayRuntime,
			onSettled: () => {
				dispatchSettled = true;
				stopTyping?.();
			},
			shouldContinue: () => params.shouldContinue?.() !== false
		});
		if (!dispatchOutcome) {
			dispatchStarted = false;
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		({dispatchAccepted, executionStarted, preStartAbortAttempted, preStartAbortConfirmed} = dispatchOutcome.observation);
		if (dispatchOutcome.kind === "failed") throw dispatchOutcome.error;
		const dispatchResult = dispatchOutcome.kind === "terminal" ? dispatchOutcome.result : {
			runId: recoveryRunId,
			status: "accepted"
		};
		if (params.shouldContinue?.() === false) return "skipped";
		let terminalStatus = normalizeRestartRecoveryTerminalStatus(dispatchResult.status);
		if (!executionStarted && !terminalStatus && reusingRecoveryRunId && dispatchResult.status === "accepted") terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
		if (!executionStarted && !terminalStatus) throw new Error(`restart recovery dispatch ended before execution started: ${params.sessionKey}`);
		if (params.shouldContinue?.() === false) return "skipped";
		if (!await settleAcceptedRestartRecovery({
			...settlementTarget,
			terminalStatus
		})) throw new Error(`restart recovery admission changed before settlement: ${params.sessionKey}`);
		if (params.shouldContinue?.() === false) return "skipped";
		const resumeResult = terminalStatus ? "settled" : "started";
		if (resumeResult === "started" && agentParams.deliver && deliveryContext && taskRemainsOwed()) {
			if (!dispatchSettled) stopTyping = params.gatewayRuntime.startRecoveryTyping?.({
				...deliveryContext,
				agentId: params.agentId,
				runId: recoveryRunId,
				isCurrent: (cfg) => !dispatchSettled && taskRemainsOwed() && isRestartRecoveryDeliveryCurrent({
					...target,
					sessionKey: dispatchSessionKey,
					sessionId: params.entry.sessionId,
					recoveryRunId,
					lifecycleGeneration,
					deliveryContext,
					cfg,
					shouldContinue: params.shouldContinue
				})
			});
			await announceRestartRecoveryResumption({
				...target,
				sessionKey: dispatchSessionKey,
				sessionId: params.entry.sessionId,
				recoveryRunId,
				lifecycleGeneration,
				deliveryContext,
				cfg: params.cfg,
				shouldContinue: () => !dispatchSettled && taskRemainsOwed() && params.shouldContinue?.() !== false,
				gatewayRuntime: params.gatewayRuntime
			});
		}
		mainSessionRecoveryLog.info(`${resumeResult} interrupted main session: ${params.sessionKey}${sanitizedPendingText ? " (with pending payload)" : ""}`);
		return resumeResult;
	} catch (error) {
		const explicitlyRejected = error instanceof GatewayClientRequestError && !dispatchAccepted;
		if (dispatchAccepted && !executionStarted && (!preStartAbortAttempted || preStartAbortConfirmed) && params.shouldContinue?.() !== false) await repairAcceptedRecovery();
		else if (dispatchAccepted && !executionStarted && preStartAbortAttempted && !preStartAbortConfirmed && params.shouldContinue?.() !== false) mainSessionRecoveryLog.warn(`restart recovery execution start timed out without confirmed cancellation: ${params.sessionKey}`);
		try {
			if (dispatchStarted && !explicitlyRejected && params.shouldContinue?.() !== false) {
				const terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
				if (terminalStatus && params.shouldContinue?.() !== false) {
					if (!await settleAcceptedRestartRecovery({
						...settlementTarget,
						reservation,
						terminalStatus
					})) mainSessionRecoveryLog.warn(`restart recovery admission changed before settlement: ${params.sessionKey}`);
					else if (params.shouldContinue?.() !== false) {
						mainSessionRecoveryLog.info(`observed terminal restart recovery for ${params.sessionKey}`);
						return "settled";
					}
				}
			}
		} catch (settlementError) {
			if (params.shouldContinue?.() !== false) {
				mainSessionRecoveryLog.warn(`failed to settle ambiguous restart recovery ${params.sessionKey}: ${String(settlementError)}`);
				await repairAcceptedRecovery();
			}
		}
		if (reservation) {
			const rollbackKind = dispatchStarted && !explicitlyRejected ? "abandon_reservation" : "cancel_reservation";
			await rollbackReservation(rollbackKind).catch((rollbackError) => {
				mainSessionRecoveryLog.warn(`failed to roll back interrupted main session recovery attempt ${params.sessionKey}: ${String(rollbackError)}`);
				scheduleRestartRecoveryReservationRollback({
					...target,
					kind: rollbackKind,
					reservation
				});
			});
		}
		if (params.shouldContinue?.() === false) return "skipped";
		mainSessionRecoveryLog.warn(`failed to resume interrupted main session ${params.sessionKey}: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return "failed";
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-checkpoint.ts
async function reconcileInvalidHarnessCompletion(params) {
	let didReconcile = false;
	const current = await updateSessionEntry(params, (entry) => {
		const claim = entry.restartRecoveryHarnessCompletion;
		if (entry.sessionId !== params.entry.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || !claim || claim.taskId !== params.entry.restartRecoveryHarnessCompletion?.taskId || entry.restartRecoveryDeliveryRunId !== params.entry.restartRecoveryDeliveryRunId || entry.restartRecoveryDeliverySourceRunId !== params.entry.restartRecoveryDeliverySourceRunId || getOwedHarnessCompletionTask(claim, entry)) return null;
		didReconcile = true;
		const endedAt = Date.now();
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry,
				recordTerminalSource: false
			}),
			...buildMainSessionRecoveryClearPatch(entry),
			status: "killed",
			lifecycleRunId: void 0,
			lastRunId: resolveRestartRecoveryTerminalClientRunId(entry),
			abortedLastRun: false,
			endedAt,
			lastRunError: void 0,
			runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, endedAt - entry.startedAt) : void 0,
			updatedAt: endedAt
		};
	}, { requireWriteSuccess: true });
	if (didReconcile) {
		mainSessionRecoveryLog.info(`retired invalid harness completion recovery: ${params.sessionKey}`);
		return { outcome: "reconciled" };
	}
	return {
		outcome: "changed",
		entry: current
	};
}
function findSourceTurnRange(params) {
	const sourceUserTurnId = buildRunUserTurnIdempotencyKey(params.sourceTurnId);
	const sourceTurnIds = /* @__PURE__ */ new Set([params.sourceTurnId, sourceUserTurnId]);
	const continuationTurnId = params.continuationRunId ? buildRunUserTurnIdempotencyKey(params.continuationRunId) : void 0;
	const startIndex = params.messages.findLastIndex((message) => getTranscriptMessageRole(message) === "user" && Boolean(message) && typeof message === "object" && sourceTurnIds.has(normalizeOptionalString(message.idempotencyKey) ?? ""));
	if (startIndex === -1) return;
	const endIndex = params.messages.findIndex((message, index) => {
		if (index <= startIndex || getTranscriptMessageRole(message) !== "user") return false;
		const idempotencyKey = message && typeof message === "object" ? normalizeOptionalString(message.idempotencyKey) : void 0;
		return !(idempotencyKey === `${params.sourceTurnId}:late-media` || idempotencyKey === continuationTurnId || continuationTurnId !== void 0 && idempotencyKey === `${continuationTurnId}:late-media`);
	});
	return {
		startIndex,
		endIndex: endIndex === -1 ? params.messages.length : endIndex
	};
}
function readToolCallId(message) {
	return [
		message.toolCallId,
		message.toolUseId,
		message.tool_call_id,
		message.tool_use_id,
		message.callId,
		message.call_id
	].map(normalizeOptionalString).find(Boolean);
}
function readAssistantToolCalls(message) {
	const content = asOptionalObjectRecord(message)?.content;
	if (getTranscriptMessageRole(message) !== "assistant" || !Array.isArray(content)) return;
	return content.flatMap((block) => {
		const record = asOptionalObjectRecord(block);
		const type = normalizeOptionalString(record?.type);
		return record && (type === "toolCall" || type === "toolUse" || type === "tool_use") ? [record] : [];
	});
}
function isSuccessfulMessageToolResult(message, toolCallId) {
	const role = getTranscriptMessageRole(message);
	if (!message || typeof message !== "object" || role !== "tool" && role !== "toolResult") return false;
	const record = message;
	return readToolCallId(record) === toolCallId && normalizeOptionalString(record.toolName) === "message" && record.isError !== true;
}
function canReconcileTerminalDeliveryAtSourceTurnTail(params) {
	for (let messageIndex = params.toolCallIndex + 1; messageIndex < params.messages.length; messageIndex += 1) {
		if (messageIndex === params.successfulToolResultIndex) continue;
		const message = params.messages[messageIndex];
		if (params.successfulToolResultIndex !== -1 && messageIndex > params.successfulToolResultIndex && messageIndex === params.messages.length - 1 && isTerminalSilentAssistantMessage(message)) continue;
		const mirror = readTerminalSourceReplyDeliveryMirror(message);
		if (mirror?.sourceTurnId === params.sourceTurnId && mirror.toolCallId === params.toolCallId) continue;
		if (isRestartAbortTailArtifact(message)) continue;
		return false;
	}
	return true;
}
async function markSessionCompletedAfterRecoveryCheckpoint(params) {
	const expectedRecoveryRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const expectedRecoverySourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const endedAt = Date.now();
	const lifecyclePatch = {
		...buildRestartRecoveryClaimCleanupPatch({
			entry: params.entry,
			recordTerminalSource: expectedRecoverySourceRunId !== void 0,
			terminalSourceRunId: expectedRecoverySourceRunId
		}),
		abortedLastRun: false,
		lifecycleRunId: void 0,
		lastRunId: resolveRestartRecoveryTerminalClientRunId(params.entry),
		endedAt,
		pendingFinalDelivery: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryRuns: void 0,
		...buildMainSessionRecoveryClearPatch(params.entry),
		runtimeMs: typeof params.entry.startedAt === "number" ? Math.max(0, endedAt - params.entry.startedAt) : void 0,
		status: "done",
		updatedAt: endedAt
	};
	const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
	if (params.reason === "handled-silent" && !sourceTurnId) return {
		outcome: "unsafe-transcript",
		reason: "handled silent checkpoint lacks its durable source turn"
	};
	const sourceTurnRange = sourceTurnId ? findSourceTurnRange({
		continuationRunId: expectedRecoveryRunId,
		messages: params.messages,
		sourceTurnId
	}) : void 0;
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (sourceTurnId && sourceTurnRange === void 0) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint cannot be matched to its durable source turn"
	};
	if (sourceTurnRange && sourceTurnRange.endIndex !== params.messages.length) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint belongs to an earlier transcript turn"
	};
	if (toolCallId) {
		if (!sourceTurnId || !sourceTurnRange) return {
			outcome: "unsafe-transcript",
			reason: "terminal delivery lacks its durable source turn"
		};
		const messageToolCallIndex = params.messages.findLastIndex((message, index) => index > sourceTurnRange.startIndex && readAssistantToolCalls(message)?.some((block) => normalizeOptionalString(block.id) === toolCallId && normalizeOptionalString(block.name) === "message"));
		if (messageToolCallIndex === -1) return {
			outcome: "unsafe-transcript",
			reason: "terminal delivery cannot be matched to its message tool call"
		};
		if (readAssistantToolCalls(params.messages[messageToolCallIndex])?.length !== 1) return {
			outcome: "unsafe-transcript",
			reason: "terminal message tool call has sibling tool work"
		};
		const successfulToolResultIndex = params.messages.findIndex((message, index) => index > messageToolCallIndex && isSuccessfulMessageToolResult(message, toolCallId));
		if (!canReconcileTerminalDeliveryAtSourceTurnTail({
			messages: params.messages,
			sourceTurnId,
			toolCallId,
			toolCallIndex: messageToolCallIndex,
			successfulToolResultIndex
		})) return {
			outcome: "unsafe-transcript",
			reason: successfulToolResultIndex === -1 ? "terminal delivery would require an out-of-order transcript repair" : "terminal delivery result is followed by unfinished transcript work"
		};
		if (successfulToolResultIndex === -1) {
			const completed = (await persistSessionTranscriptTurn({
				agentId: params.agentId,
				sessionId: params.entry.sessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, {
				expectedSessionId: params.entry.sessionId,
				expectedSessionState: buildRestartRecoveryExpectedState(params.entry),
				messages: [{
					idempotencyLookup: "scan",
					message: {
						role: "toolResult",
						toolCallId,
						toolName: "message",
						content: [{
							type: "text",
							text: "Message delivered before gateway restart."
						}],
						idempotencyKey: `restart-recovery:message-tool-result:${sourceTurnId}:${toolCallId}`,
						isError: false,
						timestamp: endedAt
					}
				}],
				sessionLifecyclePatch: lifecyclePatch,
				updateMode: "none"
			})).sessionEntry?.status === "done";
			if (completed) mainSessionRecoveryLog.info(`reconciled delivered terminal reply after restart: ${params.sessionKey}`);
			return { outcome: completed ? "completed" : "changed" };
		}
	}
	const marked = await applySessionEntryExactReplacements({
		agentId: params.agentId,
		sessionKeys: [params.sessionKey],
		storePath: params.storePath,
		update: (entries) => {
			const entry = entries.find((candidate) => candidate.sessionKey === params.sessionKey)?.entry;
			if (!entry || entry.sessionId !== params.entry.sessionId || params.pendingFinalDeliveryIntentId !== void 0 && entry.pendingFinalDelivery?.intentId !== params.pendingFinalDeliveryIntentId || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== expectedRecoveryRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== expectedRecoverySourceRunId) return { result: false };
			Object.assign(entry, lifecyclePatch);
			return {
				result: true,
				replacements: [{
					sessionKey: params.sessionKey,
					entry
				}]
			};
		}
	});
	if (marked) mainSessionRecoveryLog.info(params.reason === "delivered-terminal" || params.reason === "delivered-terminal-receipt" ? `reconciled delivered terminal reply after restart: ${params.sessionKey}` : `reconciled handled silent reply after restart: ${params.sessionKey}`);
	return { outcome: marked ? "completed" : "changed" };
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-failure.ts
const TOMBSTONED_SESSION_NOTICE = "I couldn't continue this session after a gateway restart. Your transcript is safe. In WebChat, use Resume in new session to continue it; in other channels, use /new or /reset to start a replacement session.";
function buildRestartRecoveryTombstoneNoticeKey(entry) {
	return `main-session-restart-recovery:${normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ?? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) ?? entry.sessionId}:failed-notice`;
}
async function sendRestartRecoveryTombstoneNotice(params) {
	try {
		await params.gatewayRuntime.sendRecoveryNotice({
			channel: params.deliveryContext.channel,
			to: params.deliveryContext.to,
			accountId: params.deliveryContext.accountId,
			threadId: params.deliveryContext.threadId,
			text: TOMBSTONED_SESSION_NOTICE,
			idempotencyKey: buildRestartRecoveryTombstoneNoticeKey(params.entry)
		});
		mainSessionRecoveryLog.info(`sent restart recovery tombstone notice: ${params.sessionKey} (${params.reason})`);
	} catch (error) {
		mainSessionRecoveryLog.warn(`failed to send restart recovery tombstone notice ${params.sessionKey}: ${String(error)}`);
	}
}
async function writeRestartRecoveryTombstoneNotice(params) {
	const result = await appendAssistantMessageToSessionTranscript({
		...params,
		expectedSessionId: params.entry.sessionId,
		text: TOMBSTONED_SESSION_NOTICE,
		idempotencyKey: buildRestartRecoveryTombstoneNoticeKey(params.entry)
	}).catch((error) => ({
		ok: false,
		reason: String(error)
	}));
	if (!result.ok) mainSessionRecoveryLog.warn(`failed to write restart recovery tombstone notice ${params.sessionKey}: ${result.reason}`);
	return result.ok ? "written" : "code" in result && result.code === "session-rebound" ? "stale" : "failed";
}
async function tombstoneMainRestartRecoveryWithNotice(params) {
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	if (!deliveryContext) {
		let entry = params.entry;
		let observation = params.observation;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const recoveryState = entry.mainRestartRecovery;
			if (!recoveryState || recoveryState.cycleId !== observation.cycleId || recoveryState.revision !== observation.revision) return "skipped";
			const now = Date.now();
			const notice = await writeRestartRecoveryTombstoneNotice({
				...params,
				entry,
				expectedSessionState: buildRestartRecoveryExpectedState(entry, observation),
				sessionLifecyclePatch: {
					abortedLastRun: false,
					endedAt: now,
					lifecycleRunId: void 0,
					lastRunId: resolveRestartRecoveryTerminalClientRunId(entry),
					mainRestartRecovery: {
						...recoveryState,
						revision: recoveryState.revision + 1,
						tombstone: { reason: params.reason }
					},
					runtimeMs: Math.max(0, now - (entry.startedAt ?? now)),
					status: "failed",
					updatedAt: now
				}
			});
			if (notice === "written") return "tombstoned";
			if (notice === "failed") return "notice_failed";
			const current = loadSessionEntry({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			});
			const state = current?.mainRestartRecovery;
			if (!current || current.sessionId !== params.entry.sessionId || state?.cycleId !== params.observation.cycleId || state.tombstone || current.status !== "running" || current.abortedLastRun !== true) return "skipped";
			entry = current;
			observation = {
				sessionId: current.sessionId,
				cycleId: state.cycleId,
				revision: state.revision
			};
		}
		return "notice_failed";
	}
	const claim = await commitMainSessionRecovery({
		command: {
			kind: "tombstone",
			now: Date.now(),
			observation: params.observation,
			reason: params.reason
		},
		requireWriteSuccess: true,
		target: params
	});
	if (claim.transition.kind !== "tombstoned" || !claim.entry) return "skipped";
	mainSessionRecoveryLog.warn(`tombstoned main-session restart recovery: ${params.sessionKey} (${params.reason})`);
	await sendRestartRecoveryTombstoneNotice({
		...params,
		deliveryContext,
		entry: claim.entry
	});
	return "tombstoned";
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-replay-safety.ts
async function readMainSessionRecoveryCheckpoint(scope) {
	const { checkpoint } = await readSessionTranscriptSummaryAsync(scope, { kind: "recovery-checkpoint" });
	return checkpoint;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-store.ts
async function pendingFinalRecoveryAction(pending, stateDir) {
	const deliveries = pending.deliveries;
	if (!deliveries?.length) return "fail";
	if (deliveries.every(({ state }) => state === "delivered" || state === "suppressed")) return "complete";
	const owners = await findDeliveryIntentOwners(deliveries.map(({ id }) => id), stateDir);
	if (owners.some((owner) => owner?.status === "pending" || owner?.settlementPending)) return "defer";
	if (pending.kind === "replayable" && deliveries.every(({ state }) => state === "prepared") && owners.every((owner) => owner === null)) return "retry";
	return pending.context && pending.intentId ? "notice" : "fail";
}
async function completePendingFinalRecoveryWithNotice(entry, target) {
	const endedAt = Date.now();
	let completed = false;
	await updateSessionEntry(target, (current) => {
		if (current.sessionId !== entry.sessionId || current.pendingFinalDelivery?.intentId !== entry.pendingFinalDelivery?.intentId) return null;
		const pending = current.pendingFinalDelivery;
		completed = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true
			}),
			abortedLastRun: false,
			endedAt,
			lifecycleRunId: void 0,
			lastRunId: resolveRestartRecoveryTerminalClientRunId(current),
			pendingFinalDelivery: void 0,
			...pending?.context && pending.intentId && current.pendingDeliveryNotice?.intentId !== pending.intentId && (!current.pendingDeliveryNotice || current.pendingDeliveryNotice.createdAt <= pending.createdAt) ? { pendingDeliveryNotice: {
				createdAt: pending.createdAt,
				context: pending.context,
				intentId: pending.intentId,
				state: "owed"
			} } : {},
			restartRecoveryRuns: void 0,
			runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
			status: "done",
			updatedAt: endedAt
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return completed;
}
function loadExpectedRestartRecoveryTarget(params) {
	const exact = loadExactSessionEntry({
		...params.expected,
		storePath: params.storePath,
		readConsistency: "latest"
	});
	const entry = exact?.sessionKey === params.expected.sessionKey ? exact.entry : void 0;
	return entry?.sessionId === params.expected.sessionId && entry.status === "running" && entry.abortedLastRun === true && (params.expected.claim ? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.expected.claim.runId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === params.expected.claim.sourceRunId : isMainRestartRecoveryCandidate(entry, params.expected.sessionKey)) ? entry : void 0;
}
async function recoverStore(params) {
	const result = {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 0
	};
	const shouldContinue = () => params.shouldContinue?.() !== false;
	const stopped = () => {
		if (shouldContinue()) return false;
		result.skipped++;
		return true;
	};
	const hasCurrentProcessOwner = createCurrentProcessOwnerLookup(params);
	let entries;
	try {
		if (params.expectedTarget) {
			const entry = loadExpectedRestartRecoveryTarget({
				expected: params.expectedTarget,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedTarget.sessionKey,
				entry
			}] : [];
		} else entries = await listSessionEntriesByStatus({
			agentId: params.storeAgentId,
			storePath: params.storePath
		}, ["running"]);
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
		result.failed++;
		return result;
	}
	for (const { sessionKey, entry: loadedEntry } of entries.toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey))) {
		if (stopped()) return result;
		let entry = loadedEntry;
		if (entry.status !== "running" || entry.abortedLastRun !== true && !isMainRestartRecoveryAggregateTerminalOnly(entry)) continue;
		if (!isMainRestartRecoveryCandidate(entry, sessionKey)) {
			result.skipped++;
			continue;
		}
		if (resolveSessionWorkStartError(sessionKey, entry)) {
			result.skipped++;
			continue;
		}
		const dispatchTarget = resolveRestartRecoveryDispatchTarget({
			agentId: params.expectedTarget?.agentId,
			storeAgentId: params.storeAgentId,
			cfg: params.cfg,
			sessionKey,
			storePath: params.storePath
		});
		if (!dispatchTarget) {
			result.skipped++;
			continue;
		}
		const agentId = dispatchTarget.agentId;
		const target = {
			agentId,
			sessionKey,
			storePath: params.storePath
		};
		const dispatchSessionKey = params.expectedTarget?.canonicalSessionKey ?? dispatchTarget.sessionKey;
		if (hasCurrentProcessOwner(entry, sessionKey)) {
			result.skipped++;
			continue;
		}
		const resumeDedupeKey = JSON.stringify([agentId, dispatchSessionKey]);
		if (params.handledSessionKeys.has(resumeDedupeKey)) {
			result.skipped++;
			continue;
		}
		if (stopped()) return result;
		const observed = await commitMainSessionRecovery({
			command: {
				kind: "observe",
				cycleId: randomUUID(),
				lifecycleGeneration: params.lifecycleGeneration ?? getAgentEventLifecycleGeneration(),
				sessionKey
			},
			requireWriteSuccess: true,
			shouldContinue: params.shouldContinue,
			target
		});
		if (!observed.entry || observed.transition.kind !== "observed") {
			result.skipped++;
			continue;
		}
		if (stopped()) return result;
		entry = observed.entry;
		const recoveryView = observed.transition.view;
		if (recoveryView.status === "inactive" || recoveryView.status === "blocked" || recoveryView.status === "tombstoned") {
			result.skipped++;
			continue;
		}
		if (recoveryView.status === "exhausted" || !params.observationOnly && requiresRestartRecoveryMessageActionAuthority(entry) && !hasRestartRecoveryMessageActionAuthority(entry)) {
			if (stopped()) return result;
			const tombstone = await tombstoneMainRestartRecoveryWithNotice({
				...target,
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: recoveryView.status === "exhausted" ? recoveryView.reason : "message-tool-only recovery authority is unavailable"
			});
			result[tombstone === "notice_failed" ? "failed" : "skipped"]++;
			continue;
		}
		if (params.observationOnly) {
			result.skipped++;
			continue;
		}
		const expectedRecoverySourceRunId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
		const pendingAction = entry.pendingFinalDelivery ? await pendingFinalRecoveryAction(entry.pendingFinalDelivery, params.stateDir) : void 0;
		if (stopped()) return result;
		if (pendingAction === "defer") {
			result.skipped++;
			continue;
		}
		if (pendingAction === "complete") {
			const completion = await markSessionCompletedAfterRecoveryCheckpoint({
				...target,
				entry,
				messages: [],
				pendingFinalDeliveryIntentId: entry.pendingFinalDelivery?.intentId,
				reason: "delivered-terminal-receipt"
			});
			result[completion.outcome === "completed" ? "settled" : "skipped"]++;
			if (completion.outcome === "completed") params.handledSessionKeys.add(resumeDedupeKey);
			continue;
		}
		if (pendingAction === "notice") {
			const completed = await completePendingFinalRecoveryWithNotice(entry, target);
			result[completed ? "settled" : "skipped"]++;
			continue;
		}
		const harnessCompletion = entry.restartRecoveryHarnessCompletion;
		let recoverableHarnessCompletion;
		try {
			recoverableHarnessCompletion = Boolean(harnessCompletion && harnessCompletion.requesterSessionKey === sessionKey && harnessCompletion.requesterAgentId === agentId && harnessCompletion.sourceRunId === entry.restartRecoveryDeliverySourceRunId && Boolean(entry.restartRecoveryDeliveryRunId) && entry.restartRecoverySourceIngress === "internal" && Boolean(getOwedHarnessCompletionTask(harnessCompletion, entry)) && readAdmittedHarnessCompletionInput({
				claim: harnessCompletion,
				entry,
				storePath: params.storePath,
				operationalRunId: entry.restartRecoveryDeliveryRunId
			}));
		} catch (error) {
			mainSessionRecoveryLog.warn(`harness completion input unavailable for ${sessionKey}: ${String(error)}`);
			result.failed++;
			continue;
		}
		if (harnessCompletion && getOwedHarnessCompletionTask(harnessCompletion, entry) && !recoverableHarnessCompletion) {
			mainSessionRecoveryLog.warn(`harness completion input unresolved for ${sessionKey}; retaining its claim`);
			result.failed++;
			continue;
		}
		if (harnessCompletion && !recoverableHarnessCompletion) {
			if (stopped()) return result;
			const reconciliation = await reconcileInvalidHarnessCompletion({
				...target,
				entry
			});
			if (reconciliation.outcome === "reconciled") {
				params.handledSessionKeys.add(resumeDedupeKey);
				result.skipped++;
			} else if (reconciliation.entry?.status === "running" && reconciliation.entry.abortedLastRun === true) result.failed++;
			else result.skipped++;
			continue;
		}
		const execPolicy = resolveExecDefaults({
			cfg: params.cfg,
			agentId,
			sessionKey: dispatchSessionKey,
			sessionEntry: entry
		});
		const fullAccess = execPolicy.mode === "full" && execPolicy.security === "full" && execPolicy.ask === "off" && entry.restartRecoveryDeliveryMediaUrls === void 0 && entry.restartRecoveryDisableMessageTool !== true && entry.restartRecoverySuppressTextDelivery !== true;
		let replaySafeCheckpoint;
		let source;
		let messages;
		try {
			const transcriptScope = {
				...target,
				sessionEntry: entry,
				sessionId: entry.sessionId
			};
			messages = await readSessionMessagesAsync(transcriptScope, {
				mode: "recent",
				maxMessages: 20,
				maxBytes: 262144
			});
			const checkpoint = await readMainSessionRecoveryCheckpoint(transcriptScope);
			source = checkpoint.source;
			replaySafeCheckpoint = fullAccess && !entry.pendingFinalDelivery && checkpoint.replaySafe;
		} catch (err) {
			if (stopped()) return result;
			mainSessionRecoveryLog.warn(`failed to read transcript for ${sessionKey}: ${String(err)}`);
			result.failed++;
			continue;
		}
		if (stopped()) return result;
		const hasRetainedHumanSource = expectedRecoverySourceRunId !== void 0 && (entry.restartRecoverySourceIngress === "control-ui" || entry.restartRecoverySourceIngress === "channel");
		if (!recoverableHarnessCompletion && (source === "inter_session" && !hasRetainedHumanSource || (source === void 0 || source === "internal_system" || source === "harness_completion") && entry.restartRecoverySourceIngress === "internal")) {
			const tombstone = await tombstoneMainRestartRecoveryWithNotice({
				...target,
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: "delegated recovery sender authority is unavailable"
			});
			result[tombstone === "notice_failed" ? "failed" : "skipped"]++;
			continue;
		}
		const pendingFinal = entry.pendingFinalDelivery;
		let resumeOptions;
		if (pendingAction === "fail" || pendingFinal?.kind === "replayable") resumeOptions = {
			...pendingFinal?.kind === "replayable" ? { pendingFinalDeliveryText: pendingFinal.text } : {},
			forceRestartSafeTools: pendingAction === "fail" || entry.restartRecoveryForceSafeTools === true || hasReplaySafeCodeModeCheckpointInCurrentTurn(messages)
		};
		else {
			const retainedSafeTools = replaySafeCheckpoint || entry.restartRecoveryForceSafeTools === true && !fullAccess;
			const resumePolicy = resolveMainSessionResumePolicy(messages, retainedSafeTools, expectedRecoverySourceRunId, entry.restartRecoveryBeforeAgentReplyState, entry.restartRecoveryDeliveryReceiptState, entry.restartRecoveryDeliveryToolCallId, fullAccess && !retainedSafeTools);
			if (resumePolicy.action === "complete") {
				if (stopped()) return result;
				const completion = await markSessionCompletedAfterRecoveryCheckpoint({
					...target,
					entry,
					messages,
					reason: resumePolicy.reason,
					sourceTurnId: expectedRecoverySourceRunId,
					...resumePolicy.reason === "handled-silent" ? {} : { toolCallId: resumePolicy.toolCallId }
				});
				if (completion.outcome === "completed") {
					params.handledSessionKeys.add(resumeDedupeKey);
					result.settled++;
					continue;
				}
				if (completion.outcome === "changed") {
					result.skipped++;
					continue;
				}
				resumeOptions = { forceRestartSafeTools: true };
			} else resumeOptions = {
				forceRestartSafeTools: retainedSafeTools || resumePolicy.forceRestartSafeTools,
				forceCodeModeTools: resumePolicy.forceCodeModeTools === true
			};
		}
		if (stopped()) return result;
		const resumeResult = await resumeMainSession({
			...target,
			canonicalSessionKey: dispatchSessionKey,
			cfg: params.cfg,
			entry,
			observation: recoveryView.observation,
			recoveryAttempt: recoveryView.nextAttempt,
			recoveryAdmission: params.recoveryAdmission,
			gatewayRuntime: params.gatewayRuntime,
			...resumeOptions,
			lifecycleGeneration: params.lifecycleGeneration,
			recoveryCapacity: params.recoveryCapacity,
			shouldContinue: params.shouldContinue
		});
		result[resumeResult]++;
		if (resumeResult === "started" || resumeResult === "settled") params.handledSessionKeys.add(resumeDedupeKey);
		else if (resumeResult === "failed") {
			const current = loadExpectedRestartRecoveryTarget({
				expected: {
					agentId,
					sessionId: entry.sessionId,
					sessionKey
				},
				storePath: params.storePath
			});
			if (getMainSessionRecoveryRetryCount(current?.mainRestartRecovery) === 3 && !current?.mainRestartRecovery?.reservation) params.onExhaustedTarget?.({
				...target,
				canonicalSessionKey: dispatchSessionKey,
				sessionId: entry.sessionId
			});
		}
	}
	return result;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-runtime.ts
const STARTUP_RECOVERY_MAX_ACTIVE_RUNS = 1;
function prepareRestartRecovery(gatewayRuntime, signal) {
	return gatewayRuntime.prepareRestartRecovery(signal)?.then((pausedUntilMs) => {
		if (pausedUntilMs !== void 0) mainSessionRecoveryLog.info(`restart-loop breaker tripped; automatic main-session restart recovery paused until ${new Date(pausedUntilMs).toISOString()}`);
		return pausedUntilMs;
	});
}
async function runRecoveryRetries(params) {
	let delayMs = params.initialDelayMs;
	for (let attempt = 1; attempt <= params.maxRetries && params.shouldContinue(); attempt += 1) {
		const finalAttempt = attempt === params.maxRetries;
		try {
			if (delayMs > 0) await sleepWithAbort(delayMs, params.signal, { ref: false });
			if (!params.shouldContinue() || await params.attempt(finalAttempt)) return;
		} catch (error) {
			if (!params.shouldContinue()) return;
			await params.onError(error, finalAttempt);
			if (finalAttempt) return;
		}
		delayMs = delayMs > 0 ? delayMs * 2 : params.retryDelayMs ?? 5e3;
	}
}
/** The startup owner admits this store sweep before marking or dispatching sessions. */
async function recoverRestartAbortedMainSessions(params) {
	const result = {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 0
	};
	if (params.shouldContinue?.() === false) return result;
	const handledSessionKeys = params.handledSessionKeys ?? /* @__PURE__ */ new Set();
	for (const target of await discoverRestartRecoveryStoreTargets({
		...params,
		statuses: ["running"]
	})) {
		if (params.shouldContinue?.() === false) return result;
		if (params.excludedStoreTargets?.has(restartRecoveryStoreTargetKey(target))) continue;
		const storeResult = await recoverStore({
			...params,
			storePath: target.storePath,
			storeAgentId: target.agentId,
			handledSessionKeys,
			recoveryCapacity: params.recoveryCapacity
		});
		result.started += storeResult.started;
		result.settled += storeResult.settled;
		result.failed += storeResult.failed;
		result.skipped += storeResult.skipped;
	}
	if (result.started > 0 || result.settled > 0 || result.failed > 0) mainSessionRecoveryLog.info(`main-session restart recovery startup complete: started=${result.started} settled=${result.settled} failed=${result.failed} skipped=${result.skipped}`);
	return result;
}
/** Retries one exact durable Control UI row from its owning per-agent SQLite store. */
async function retryRestartAbortedMainSessionRecovery(params) {
	return await recoverExpectedRestartRecovery({
		...params,
		expectedTarget: {
			agentId: params.agentId,
			canonicalSessionKey: params.canonicalSessionKey,
			sessionId: params.expectedSessionId,
			sessionKey: params.sessionKey,
			claim: params.expectedRecoveryRunId && params.expectedRecoverySourceRunId ? {
				runId: params.expectedRecoveryRunId,
				sourceRunId: params.expectedRecoverySourceRunId
			} : void 0
		}
	});
}
async function recoverExpectedRestartRecovery(params) {
	const preparation = prepareRestartRecovery(params.gatewayRuntime, params.signal);
	if (preparation && await preparation !== void 0) return {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 0
	};
	const expected = params.expectedTarget;
	const loadExpected = () => loadExpectedRestartRecoveryTarget({
		expected,
		storePath: params.storePath
	});
	if (!loadExpected()) return {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 0
	};
	return await runWithMainSessionRecoveryAdmission({
		...params,
		canonicalSessionKey: expected.canonicalSessionKey,
		sessionId: expected.sessionId,
		isCurrent: () => Boolean(loadExpected()),
		run: (recoveryAdmission) => recoverStore({
			...params,
			shouldContinue: recoveryAdmission.shouldContinue,
			handledSessionKeys: /* @__PURE__ */ new Set(),
			recoveryAdmission
		})
	}) ?? {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 1
	};
}
function scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease(params) {
	const recover = () => runWithGatewayIndependentRootWorkAdmission(async () => {
		const gatewayRuntime = params.getGatewayRuntime();
		if (!gatewayRuntime) throw new Error("Gateway recovery runtime is unavailable");
		return await retryRestartAbortedMainSessionRecovery({
			...params,
			cfg: params.getConfig(),
			gatewayRuntime
		});
	}, "main-session:restart-recovery");
	runRecoveryRetries({
		initialDelayMs: 0,
		maxRetries: params.maxRetries ?? 3,
		retryDelayMs: params.delayMs ?? 5e3,
		shouldContinue: () => true,
		attempt: async (finalAttempt) => {
			const result = await recover();
			const stillPending = loadExpectedRestartRecoveryTarget({
				expected: {
					agentId: params.agentId,
					sessionId: params.expectedSessionId,
					sessionKey: params.sessionKey
				},
				storePath: params.storePath
			});
			if (result.failed === 0 && (result.started > 0 || result.settled > 0 || !stillPending)) return true;
			if (finalAttempt && getMainSessionRecoveryRetryCount(stillPending?.mainRestartRecovery) === 3 && !stillPending?.mainRestartRecovery?.reservation) await recover();
			return false;
		},
		onError: (error, finalAttempt) => {
			if (finalAttempt) mainSessionRecoveryLog.warn(`main-session owner-release recovery failed: ${String(error)}`);
		}
	});
}
function scheduleRestartAbortedMainSessionRecovery(params) {
	const handledSessionKeys = /* @__PURE__ */ new Set();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const abortController = new AbortController();
	const unregisterRotation = registerAgentEventLifecycleRotationHandler(`main-session-restart-recovery:${randomUUID()}`, () => abortController.abort());
	const shouldContinue = () => !abortController.signal.aborted && params.shouldContinue?.() !== false && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration);
	const startupRecoveryCutoffMs = Date.now();
	const recoveryCapacity = createMainSessionRecoveryCapacity({ limit: STARTUP_RECOVERY_MAX_ACTIVE_RUNS });
	const startupCheckedStorePaths = params.startupCheckedStorePaths ?? /* @__PURE__ */ new Set();
	const runRecoveryAttempt = async (exhaustedTargets) => {
		return await runWithGatewayIndependentRootWorkAdmission(async () => {
			const preparation = prepareRestartRecovery(params.gatewayRuntime, abortController.signal);
			const pausedUntilMs = preparation ? await preparation : void 0;
			if (pausedUntilMs !== void 0) return pausedUntilMs;
			if (!shouldContinue()) return {
				started: 0,
				settled: 0,
				failed: 0,
				skipped: 0
			};
			const cfg = params.getConfig();
			const marking = await markStartupOrphanedMainSessionsForRecovery({
				cfg,
				stateDir: params.stateDir,
				startupCheckedStorePaths,
				updatedBeforeMs: startupRecoveryCutoffMs
			});
			const result = await recoverRestartAbortedMainSessions({
				cfg,
				onExhaustedTarget: (target) => {
					exhaustedTargets.set(JSON.stringify([
						target.storePath,
						target.agentId,
						target.canonicalSessionKey ?? target.sessionKey
					]), target);
				},
				stateDir: params.stateDir,
				handledSessionKeys,
				excludedStoreTargets: new Set(marking.failedTargets?.map(restartRecoveryStoreTargetKey)),
				lifecycleGeneration,
				shouldContinue,
				gatewayRuntime: params.gatewayRuntime,
				recoveryCapacity
			});
			result.failed += marking.failedTargets?.length ?? 0;
			return result;
		}, "main-session:startup-recovery", abortController.signal);
	};
	const reconcileExhaustedTargets = async (targets) => {
		const outcomes = await Promise.allSettled([...targets].map((target) => runWithGatewayIndependentRootWorkAdmission(async () => recoverExpectedRestartRecovery({
			...target,
			cfg: params.getConfig(),
			expectedTarget: target,
			lifecycleGeneration,
			observationOnly: true,
			shouldContinue,
			signal: abortController.signal,
			stateDir: params.stateDir,
			gatewayRuntime: params.gatewayRuntime
		}), "main-session:target-recovery", abortController.signal)));
		for (const outcome of outcomes) if (outcome.status === "rejected" && !(abortController.signal.aborted && (outcome.reason === abortController.signal.reason || outcome.reason instanceof Error && outcome.reason.cause === abortController.signal.reason))) mainSessionRecoveryLog.warn(`main-session exhaustion reconciliation failed: ${String(outcome.reason)}`);
	};
	let exhaustedTargets = /* @__PURE__ */ new Map();
	const run = Promise.resolve().then(async () => {
		if (params.waitForStart) await Promise.race([params.waitForStart(), waitForAbortSignal(abortController.signal)]);
		await runRecoveryRetries({
			initialDelayMs: params.delayMs ?? 5e3,
			maxRetries: Math.max(1, params.maxRetries ?? 3),
			shouldContinue,
			signal: abortController.signal,
			attempt: async (finalAttempt) => {
				exhaustedTargets = /* @__PURE__ */ new Map();
				while (shouldContinue()) {
					const result = await runRecoveryAttempt(exhaustedTargets);
					if (typeof result === "number") {
						await sleepWithAbort(Math.max(1, result - Date.now()), abortController.signal, { ref: false });
						continue;
					}
					if (result.failed === 0) return true;
					if (finalAttempt && exhaustedTargets.size > 0) await reconcileExhaustedTargets(exhaustedTargets.values());
					return false;
				}
				return true;
			},
			onError: async (err, finalAttempt) => {
				if (finalAttempt) {
					mainSessionRecoveryLog.warn(`main-session restart recovery gave up: ${String(err)}`);
					await reconcileExhaustedTargets(exhaustedTargets.values());
				} else mainSessionRecoveryLog.warn(`main-session restart recovery failed: ${String(err)}`);
			}
		});
	});
	return { stop: async () => {
		unregisterRotation();
		abortController.abort();
		await run;
	} };
}
//#endregion
export { markRestartAbortedMainSessions, markStartupOrphanedMainSessionsForRecovery, recoverRestartAbortedMainSessions, retryRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease };
