import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { n as waitForAbortSignal } from "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, v as registerAgentEventLifecycleRotationHandler } from "./agent-events-Bf3Js0D3.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, m as listAgentDatabaseAdmissionRefusals } from "./agent-database-admission-CeDA0ojh.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-CbQswcwc.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { M as buildRestartRecoveryExpectedState, rt as buildMainSessionRecoverySettlementPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as preparePhysicalSessionStorePath } from "./session-store-path-BQkYPc4_.mjs";
import { i as resolveSessionWorkStartBlock } from "./session-work-start-Sz_vqYld.mjs";
import { c as normalizeDeliveryContext, n as deliveryContextKey } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { r as MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL } from "./input-provenance-D1LHo5Qj.mjs";
import { b as hasRestartRecoveryTerminalRun, k as resolveRestartRecoveryChannelAuthority, v as hasMainSessionRecoveryClaim, x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as readSessionEntrySummariesInWorker, i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker, s as withSessionEntriesFromStoreInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as persistSessionTranscriptTurn } from "./session-accessor-Czw4l8kI.mjs";
import { l as updateSessionEntry, x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import "./lanes-D7a4ntDu.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
import { l as listSubagentRunsForRequester } from "./subagent-registry-read-DY0g8fGW.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { a as scheduleMainSessionRecoveryMutation, i as retryMainSessionRecoveryMutation, r as repairMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-DY4r6VdX.mjs";
import { s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { i as resolveExecDefaultsAsync } from "./exec-defaults-DrIV-0KT.mjs";
import { n as resolveSendPolicy } from "./send-policy-D88FrugM.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-BbiRPEt1.mjs";
import { a as isMainSessionRecoveryPending, i as isMainRestartRecoveryTerminalOnly, t as getMainSessionRecoveryRetryCount } from "./main-session-recovery-state-sCZeKFHp.mjs";
import { a as readInterruptedRunId, i as mainSessionRecoveryLog, n as discoverRestartRecoveryStoreTargets, o as resolveRestartRecoveryTerminalClientRunId } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { a as readAdmittedHarnessCompletionInputAsync, n as createHarnessCompletionSourceAssertion, r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-C73KNckX.mjs";
import { l as findDeliveryIntentOwners } from "./delivery-queue-storage-B0ORUZO-.mjs";
import { n as runWithMainSessionRecoveryAdmission } from "./main-session-recovery-admission-Chw1atkI.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CIfq4_tj.mjs";
import { n as resolveRestartRecoveryDispatchIdentity, r as resolveRestartRecoveryDispatchTarget } from "./main-session-restart-recovery-target-DZzCceAs.mjs";
import { n as commitMainSessionRecovery } from "./main-session-recovery-store-mxhMsBp9.mjs";
import "./user-turn-transcript-CtVHLnLR.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
import { g as readSessionTranscriptSummaryAsync, l as readSessionMessagesAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { t as GatewayOperatorRecoveryOwnershipError } from "./restart-recovery-errors-CxiWafBU.mjs";
import { l as isTerminalSilentAssistantMessage, n as getTranscriptMessageRole, u as readTerminalSourceReplyDeliveryMirror } from "./message-visibility-P0cXqUe6.mjs";
import { t as RESTART_RECOVERY_INTERRUPTION_NOTE } from "./restart-recovery-prompt-DapLmbKm.mjs";
import { t as TOOL_FAILURE_INSTRUCTION } from "./tool-outcome-instructions-D1-OxlK6.mjs";
import { n as isRestartAbortTailArtifact, r as resolveMainSessionResumePolicy, t as hasReplaySafeCodeModeCheckpointInCurrentTurn } from "./main-session-restart-recovery-resume-policy-CkJGCCZT.mjs";
import { i as createCurrentProcessOwnerLookup, n as markRestartAbortedMainSessions, r as markStartupOrphanedMainSessionsForRecovery } from "./main-session-restart-recovery-marking-DWi60FXw.mjs";
import { i as skippedMainSessionRecoveryDecision, r as restartRecoveryStoreTargetKey } from "./main-session-restart-recovery-diagnostics-CCDcnsT7.mjs";
import { n as canPrepareAgentSessionWorktree } from "./agent-handler-helpers-BDkV_7rl.mjs";
import { n as buildSubagentRestartRecoveryRoster, t as SUBAGENT_RESTART_RECOVERY_INSTRUCTION } from "./subagent-restart-recovery-prompt-CEingoLZ.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/main-session-recovery/main-session-restart-recovery-exact-target.ts
function matchesExpectedRecoveryTarget(entry, expected, hasClaim) {
	return entry?.sessionId === expected.sessionId && hasClaim && entry.abortedLastRun === true && (expected.claim ? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === expected.claim.runId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === expected.claim.sourceRunId : isMainRestartRecoveryCandidate(entry, expected.sessionKey));
}
/** Keep one recovery read current through admission using the owner's write receipts. */
async function prepareExpectedRestartRecoveryCurrent(params) {
	const expected = {
		...params.expected,
		claim: params.expected.claim && { ...params.expected.claim }
	};
	const target = {
		...expected,
		storePath: params.storePath,
		agentId: resolveRestartRecoveryDispatchIdentity({
			...expected,
			storePath: params.storePath
		}).agentId
	};
	const source = captureSessionEntryMetadataRead(target, () => {});
	if (source) return {
		isCurrent: () => {
			const current = source.readCurrent();
			return matchesExpectedRecoveryTarget(current, expected, hasMainSessionRecoveryClaim(current));
		},
		release() {}
	};
	let release = () => {};
	let databaseIdentity;
	try {
		return await withSessionEntriesFromStoreInWorker({
			...target,
			sessionKeys: [target.sessionKey],
			projection: "list"
		}, async (read) => {
			const entry = read.result.entries.find(({ sessionKey }) => sessionKey === target.sessionKey)?.entry;
			const matches = (current) => matchesExpectedRecoveryTarget(current, expected, hasMainSessionRecoveryClaim(current));
			if (!databaseIdentity || !matches(entry)) return {
				isCurrent: () => false,
				release() {}
			};
			const retained = retainPreparedSessionEntryPredicate({
				databaseIdentity,
				sessionKey: target.sessionKey,
				entry,
				matches: (_before, current) => matches(current)
			});
			release = retained.release;
			return {
				isCurrent: retained.isCurrent,
				release
			};
		}, false, (_database, identity) => {
			databaseIdentity = identity.key;
		});
	} catch (error) {
		release();
		throw error;
	}
}
async function loadExpectedRestartRecoveryTarget(params) {
	const target = {
		...params.expected,
		claim: params.expected.claim && { ...params.expected.claim },
		storePath: params.storePath,
		readConsistency: "latest"
	};
	const source = captureSessionEntryMetadataRead(target, () => {});
	const exact = source ? void 0 : await withSessionStoreReaderInWorker(target, ({ reader, database, continuation }) => reader.readExactEntries({
		sessionKeys: [target.sessionKey],
		env: database.env,
		continuation
	}));
	const entry = source ? source.readCurrent() : exact?.entries.find(({ sessionKey }) => sessionKey === target.sessionKey)?.entry;
	return matchesExpectedRecoveryTarget(entry, target, hasMainSessionRecoveryClaim(entry)) ? entry : void 0;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-delivery.ts
function hasRestartRecoveryMessageActionAuthority(entry) {
	const authority = resolveRestartRecoveryChannelAuthority(entry);
	return authority !== void 0 && isTrustedMessageActionTurnIngress(authority.deliveryContext.channel);
}
/** Internal continuations never inherit channel authority; every other message-tool recovery must. */
function requiresRestartRecoveryMessageActionAuthority(entry) {
	return entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" && entry.restartRecoverySourceIngress !== "internal";
}
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
/** Retain the owning recovery through its final transport effect. */
async function prepareRestartRecoveryDeliveryCurrent(input) {
	const params = {
		...input,
		deliveryContext: { ...input.deliveryContext }
	};
	const source = captureSessionEntryMetadataRead(params, () => {});
	let active = true;
	const releases = [];
	const dispose = () => {
		active = false;
		for (const release of releases.splice(0).toReversed()) release();
	};
	const matchesRecovery = (current, cfg) => current?.sessionId === params.sessionId && current.abortedLastRun !== true && current.restartRecoveryDeliveryRunId === params.recoveryRunId && current.restartRecoverySourceReplyDeliveryMode !== "message_tool_only" && deliveryContextKey(resolveRestartRecoveryDeliveryContext({
		cfg,
		entry: current,
		sessionKey: params.sessionKey
	})) === deliveryContextKey(params.deliveryContext);
	let readCurrent;
	if (source) readCurrent = () => source.readCurrent();
	else try {
		readCurrent = await withSessionEntryReadOnlyInWorker({
			...params,
			projection: "list"
		}, () => {}, async (read, owner) => {
			if (!read.ok) throw read.error;
			const entry = read.value;
			const captured = owner.source;
			if (!captured) return () => void 0;
			const retained = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${captured.databaseIdentity}`,
				sessionKey: resolveSqliteSessionKey(params.sessionKey, captured.agentId),
				entry,
				matches: (previous, current) => matchesRecovery(current) && previous?.lifecycleRevision === current?.lifecycleRevision && previous?.sendPolicy === current?.sendPolicy && previous?.chatType === current?.chatType
			});
			releases.push(retained.release);
			releases.push(registerOpenClawAgentDatabaseAsyncResource({
				agentId: captured.agentId,
				path: captured.path,
				revoke: dispose,
				close: async () => dispose()
			}));
			return () => {
				assertExistingDatabaseIdentity(captured.path, `file:${captured.databaseIdentity}`, captured.databaseBirthtime);
				return retained.isCurrent() ? entry : void 0;
			};
		});
	} catch (error) {
		dispose();
		throw error;
	}
	return {
		isCurrent: (cfg = params.cfg) => active && params.shouldContinue?.() !== false && getAgentEventLifecycleGeneration() === params.lifecycleGeneration && matchesRecovery(readCurrent(), cfg),
		release: dispose
	};
}
async function announceRestartRecoveryResumption(params) {
	let prepared;
	try {
		prepared = params.isCurrent ? void 0 : await prepareRestartRecoveryDeliveryCurrent(params);
		const isCurrent = params.isCurrent ?? prepared.isCurrent;
		if (!isCurrent()) return;
		await params.gatewayRuntime.sendRecoveryNotice({
			...params.deliveryContext,
			text: "I'm continuing your interrupted request now (the gateway has just restarted).  Don't be concerned with the lack of typing; I am working behind the scenes and I'll send a message when I'm done!",
			idempotencyKey: `main-session-restart-recovery:${params.recoveryRunId}:resumed-notice`,
			liveOnly: true,
			isCurrent
		});
	} catch (error) {
		mainSessionRecoveryLog.warn(`failed to announce restart recovery ${params.sessionKey}: ${String(error)}`);
	} finally {
		prepared?.release();
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-failure.ts
/** Whether recovery must re-prove delegated sender authority before resuming. */
function requiresDelegatedRecoverySource(entry, source) {
	if (entry.restartRecoveryDeliverySourceRunId && (entry.restartRecoveryOperatorSource || entry.restartRecoverySourceIngress === "control-ui" || entry.restartRecoverySourceIngress === "channel")) return false;
	return source === "inter_session" || entry.restartRecoverySourceIngress === "internal" && (source === void 0 || source === "internal_system" || source === "harness_completion");
}
/** Publish one local interruption notice and retire the exact input without replay or delivery. */
async function settleInterruptedRestartRecovery(params) {
	const { entry } = params;
	const endedAt = Date.now();
	const capturedReply = entry.pendingFinalDelivery?.kind === "replayable" ? stripInternalMetadataForDisplay(entry.pendingFinalDelivery.text).trim() : void 0;
	const result = await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		expectedSessionId: entry.sessionId,
		expectedLifecycleRevision: entry.lifecycleRevision ?? null,
		expectedSessionState: buildRestartRecoveryExpectedState(entry, params.observation),
		idempotencyKey: `main-session-restart-recovery:${entry.restartRecoveryDeliverySourceRunId ?? entry.restartRecoveryDeliveryRunId ?? entry.sessionId}:interrupted`,
		text: `This interrupted turn could not resume after the Gateway restarted: ${params.reason}. Your session and transcript are preserved. Send a new authenticated message to continue.` + (capturedReply ? `\n\nSaved reply (delivery unconfirmed):\n${capturedReply}` : ""),
		sessionLifecyclePatch: {
			...buildMainSessionRecoverySettlementPatch({
				entry,
				recordTerminalSource: true,
				terminalRunId: entry.restartRecoveryDeliveryRunId
			}),
			status: "interrupted",
			pendingFinalDelivery: void 0,
			lifecycleRunId: void 0,
			lastRunId: resolveRestartRecoveryTerminalClientRunId(entry) ?? entry.restartRecoveryDeliveryRunId ?? entry.restartRecoveryDeliverySourceRunId,
			lastRunError: params.reason,
			endedAt,
			runtimeMs: Math.max(0, endedAt - (entry.startedAt ?? endedAt)),
			updatedAt: endedAt
		}
	});
	if (result.ok) return "settled";
	if ("code" in result && result.code === "session-rebound") return "skipped";
	mainSessionRecoveryLog.warn(`failed to settle interrupted recovery ${params.sessionKey}: ${result.reason}`);
	return "notice_failed";
}
/** Sender loss retires one input only when no other execution or delivery custody remains. */
async function finishDelegatedRestartRecovery(params) {
	const { entry } = params;
	if (entry.pendingFinalDelivery || entry.restartRecoveryHarnessCompletion || (entry.restartRecoveryRuns ?? []).some((run) => run.runId !== entry.restartRecoveryDeliveryRunId && run.runId !== entry.restartRecoveryDeliverySourceRunId && !hasRestartRecoveryTerminalRun(entry, run.runId))) return await tombstoneMainRestartRecoveryWithNotice(params);
	return await settleInterruptedRestartRecovery(params);
}
function buildTombstonedSessionNotice(reason) {
	return `I couldn't continue this session after a gateway restart: ${reason}. Your transcript is safe. In WebChat, use Resume in new session to continue it; in other channels, use /new or /reset to start a replacement session.`;
}
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
			text: buildTombstonedSessionNotice(params.reason),
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
		text: buildTombstonedSessionNotice(params.reason),
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
			const current = await readSessionEntryReadOnlyInWorker({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			});
			const state = current?.mainRestartRecovery;
			if (!current || current.sessionId !== params.entry.sessionId || state?.cycleId !== params.observation.cycleId || state.tombstone || current.abortedLastRun !== true) return "skipped";
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
//#region src/agents/main-session-recovery/main-session-restart-dispatch-settlement.ts
/** A definitive pre-admission ownership loss settles locally without dropping other recovery custody. */
async function settleRejectedRestartRecovery(params) {
	const { error, rollback } = params;
	const entry = rollback?.entry;
	if (!(error instanceof GatewayOperatorRecoveryOwnershipError) || params.dispatchAccepted || rollback?.transition.kind !== "applied" || !entry?.mainRestartRecovery) return;
	if (params.shouldContinue?.() === false) return "skipped";
	const result = await finishDelegatedRestartRecovery({
		agentId: params.agentId,
		cfg: params.cfg,
		entry,
		gatewayRuntime: params.gatewayRuntime,
		observation: {
			sessionId: entry.sessionId,
			cycleId: entry.mainRestartRecovery.cycleId,
			revision: entry.mainRestartRecovery.revision
		},
		reason: error.message,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	return result === "settled" || result === "tombstoned" ? "settled" : result === "skipped" ? "skipped" : "failed";
}
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
				entry.status = params.terminalStatus === "ok" ? "done" : params.terminalStatus === "timeout" ? "timeout" : "failed";
				entry.endedAt = now;
				const startedAt = asFiniteNumber(entry.startedAt);
				if (startedAt !== void 0) entry.runtimeMs = Math.max(0, now - startedAt);
				Object.assign(entry, buildMainSessionRecoverySettlementPatch({
					entry,
					recordTerminalSource: true,
					terminalRunId: params.expectedRecoveryRunId,
					terminalSourceRunId: params.expectedRecoverySourceRunId
				}));
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
			restartRecoveryOperatorTarget: params.restartRecoveryOperatorTarget,
			assertAdmissionCurrent: params.assertAdmissionCurrent,
			prepareDispatchCurrent: params.prepareDispatchCurrent,
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
//#region src/agents/main-session-recovery/main-session-restart-dispatch.ts
const RESTART_RECOVERY_RESUME_MESSAGE = formatSystemTurnPrompt(`${RESTART_RECOVERY_INTERRUPTION_NOTE} The restart did not cancel the user's task. Continue from the existing transcript: check the current state, recover interrupted work, and finish the task without asking the user to repeat the request. ${SUBAGENT_RESTART_RECOVERY_INSTRUCTION} ${TOOL_FAILURE_INSTRUCTION}`);
const RESTART_SAFE_TOOLS_NOTICE = "For this turn only, the tool surface has been narrowed to replay-safe tools as a recovery precaution. Use the tools that are available to report status or continue read-only work; the full tool surface restores on the next user turn.";
function buildResumeMessage(pendingFinalDeliveryText, forceRestartSafeTools, childRecoveryRoster) {
	const sanitizedPendingText = sanitizePendingFinalDeliveryText(pendingFinalDeliveryText);
	const instructions = forceRestartSafeTools ? `${RESTART_RECOVERY_RESUME_MESSAGE}\n\n${RESTART_SAFE_TOOLS_NOTICE}` : RESTART_RECOVERY_RESUME_MESSAGE;
	const base = childRecoveryRoster ? `${instructions}\n\n${childRecoveryRoster}` : instructions;
	return sanitizedPendingText ? `${base}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"` : base;
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
	try {
		var _usingCtx$2 = _usingCtx();
		const source = captureSessionEntryMetadataRead(params, () => {});
		const matchesRequester = (current) => current?.sessionId === params.entry.sessionId && current.lifecycleRevision === params.entry.lifecycleRevision;
		let retained;
		_usingCtx$2.u({ [Symbol.dispose]: () => retained?.release() });
		if (!source) {
			let databaseIdentity;
			await withSessionEntriesFromStoreInWorker({
				...params,
				sessionKeys: [params.sessionKey],
				projection: "list"
			}, async (read) => {
				const entry = read.result.entries.find(({ sessionKey }) => sessionKey === params.sessionKey)?.entry;
				if (databaseIdentity && entry?.sessionId === params.entry.sessionId) retained = retainPreparedSessionEntryPredicate({
					databaseIdentity,
					sessionKey: params.sessionKey,
					entry,
					matches: (_before, current) => matchesRequester(current)
				});
			}, false, (_database, identity) => {
				databaseIdentity = identity.key;
			});
		}
		const isCurrent = () => {
			return source ? matchesRequester(source.readCurrent()) : retained?.isCurrent() === true;
		};
		return await runWithMainSessionRecoveryAdmission({
			...params,
			sessionId: params.entry.sessionId,
			admission: params.recoveryAdmission,
			isCurrent,
			run: (recoveryAdmission) => resumeMainSessionWithinAdmission({
				...params,
				recoveryAdmission,
				shouldContinue: recoveryAdmission.shouldContinue
			})
		}) ?? "skipped";
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
}
async function resumeMainSessionWithinAdmission(params) {
	if (params.shouldContinue?.() === false) return "skipped";
	const harnessCompletion = params.entry.restartRecoveryHarnessCompletion;
	const source = captureSessionEntryMetadataRead(params, () => {});
	const taskRemainsOwed = () => {
		params.completionSource?.();
		if (!harnessCompletion) return true;
		const entry = source ? source.readCurrent() : params.entry;
		return Boolean(entry && getOwedHarnessCompletionTask(harnessCompletion, entry));
	};
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
	let deliveryCurrent;
	let retainDeliveryCurrent = false;
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
				if (!entry || entry.sessionId !== params.entry.sessionId || harnessCompletion && (entry.lifecycleRevision !== harnessCompletion.lifecycleRevision || entry.restartRecoveryHarnessCompletion?.taskId !== harnessCompletion.taskId) || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== claimedRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== claimedSourceRunId || !claimedSourceRunId && readInterruptedRunId(entry) !== sourceRunId) return { result: false };
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
			return current?.sessionId === params.entry.sessionId && current.abortedLastRun === true && !current.mainRestartRecovery?.reservation && !current.mainRestartRecovery?.tombstone ? "failed" : "skipped";
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
			lane: "background",
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
		if (!params.recoveryAdmission.beginDispatch()) {
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		dispatchStarted = true;
		let dispatchSettled = false;
		let stopTyping;
		const dispatchOutcome = await dispatchRestartRecoveryUntilStarted({
			agentParams,
			gatewayRuntime: params.gatewayRuntime,
			...sourceRunId && params.entry.restartRecoveryOperatorSource ? { restartRecoveryOperatorTarget: {
				...target,
				sessionId: params.entry.sessionId,
				sourceRunId,
				recoveryRunId
			} } : {},
			assertAdmissionCurrent: () => {
				if (params.shouldContinue?.() === false || !taskRemainsOwed()) throw new Error("Restart recovery admission is no longer current.");
			},
			prepareDispatchCurrent: () => runWithAgentToolSourceExecutionScope(params.completionSource, async () => {
				params.completionSource?.();
			}),
			onSettled: () => {
				dispatchSettled = true;
				stopTyping?.();
				deliveryCurrent?.release();
				retainDeliveryCurrent = false;
			}
		});
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
			deliveryCurrent = await prepareRestartRecoveryDeliveryCurrent({
				...target,
				storePath: requesterStorePath,
				sessionKey: dispatchSessionKey,
				sessionId: params.entry.sessionId,
				recoveryRunId,
				lifecycleGeneration,
				deliveryContext,
				cfg: params.cfg,
				shouldContinue: params.shouldContinue
			}).catch((error) => {
				mainSessionRecoveryLog.warn(`failed to prepare restart recovery notice ${params.sessionKey}: ${String(error)}`);
			});
			if (deliveryCurrent) {
				const isDeliveryCurrent = deliveryCurrent.isCurrent;
				if (!dispatchSettled) {
					stopTyping = params.gatewayRuntime.startRecoveryTyping?.({
						...deliveryContext,
						agentId: params.agentId,
						runId: recoveryRunId,
						isCurrent: (cfg) => !dispatchSettled && taskRemainsOwed() && isDeliveryCurrent(cfg)
					});
					retainDeliveryCurrent = stopTyping !== void 0;
				}
				await announceRestartRecoveryResumption({
					...target,
					isCurrent: (cfg) => !dispatchSettled && taskRemainsOwed() && isDeliveryCurrent(cfg),
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
		let rollback;
		if (reservation) {
			const rollbackKind = dispatchStarted && !explicitlyRejected ? "abandon_reservation" : "cancel_reservation";
			rollback = await rollbackReservation(rollbackKind).catch((rollbackError) => {
				mainSessionRecoveryLog.warn(`failed to roll back interrupted main session recovery attempt ${params.sessionKey}: ${String(rollbackError)}`);
				scheduleRestartRecoveryReservationRollback({
					...target,
					kind: rollbackKind,
					reservation
				});
			});
		}
		if (params.shouldContinue?.() === false) return "skipped";
		const rejected = await settleRejectedRestartRecovery({
			...target,
			cfg: params.cfg,
			dispatchAccepted,
			error,
			gatewayRuntime: params.gatewayRuntime,
			rollback,
			shouldContinue: params.shouldContinue
		});
		if (rejected) return rejected;
		mainSessionRecoveryLog.warn(`failed to resume interrupted main session ${params.sessionKey}: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return "failed";
	} finally {
		if (!retainDeliveryCurrent) deliveryCurrent?.release();
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-checkpoint.ts
async function readMainSessionRecoveryCheckpoint(scope) {
	const { checkpoint } = await readSessionTranscriptSummaryAsync(scope, { kind: "recovery-checkpoint" });
	return checkpoint;
}
async function reconcileInvalidHarnessCompletion(params) {
	let didReconcile = false;
	const current = await updateSessionEntry(params, (entry) => {
		const claim = entry.restartRecoveryHarnessCompletion;
		if (entry.sessionId !== params.entry.sessionId || entry.abortedLastRun !== true || !claim || claim.taskId !== params.entry.restartRecoveryHarnessCompletion?.taskId || entry.restartRecoveryDeliveryRunId !== params.entry.restartRecoveryDeliveryRunId || entry.restartRecoveryDeliverySourceRunId !== params.entry.restartRecoveryDeliverySourceRunId || getOwedHarnessCompletionTask(claim, entry)) return null;
		didReconcile = true;
		const endedAt = Date.now();
		return {
			...buildMainSessionRecoverySettlementPatch({
				entry,
				recordTerminalSource: false
			}),
			status: "killed",
			lifecycleRunId: void 0,
			lastRunId: resolveRestartRecoveryTerminalClientRunId(entry),
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
function unsafeRecoveryTranscript(reason) {
	return {
		outcome: "unsafe-transcript",
		reason
	};
}
async function markSessionCompletedAfterRecoveryCheckpoint(params) {
	const expectedRecoveryRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const expectedRecoverySourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const settled = isTerminalSessionStatus(params.entry.status) && params.entry.status !== "interrupted";
	const endedAt = settled ? params.entry.endedAt ?? Date.now() : Date.now();
	const lifecyclePatch = {
		...buildMainSessionRecoverySettlementPatch({
			entry: params.entry,
			recordTerminalSource: expectedRecoverySourceRunId !== void 0,
			terminalSourceRunId: expectedRecoverySourceRunId
		}),
		lifecycleRunId: void 0,
		lastRunId: settled ? params.entry.lastRunId : resolveRestartRecoveryTerminalClientRunId(params.entry),
		endedAt,
		pendingFinalDelivery: void 0,
		runtimeMs: typeof params.entry.startedAt === "number" ? Math.max(0, endedAt - params.entry.startedAt) : void 0,
		status: settled ? params.entry.status : "done",
		updatedAt: endedAt
	};
	const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
	if (params.reason === "handled-silent" && !sourceTurnId) return unsafeRecoveryTranscript("handled silent checkpoint lacks its durable source turn");
	const sourceTurnRange = sourceTurnId ? findSourceTurnRange({
		continuationRunId: expectedRecoveryRunId,
		messages: params.messages,
		sourceTurnId
	}) : void 0;
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (sourceTurnId && sourceTurnRange === void 0) return unsafeRecoveryTranscript("recovery checkpoint cannot be matched to its durable source turn");
	if (sourceTurnRange && sourceTurnRange.endIndex !== params.messages.length) return unsafeRecoveryTranscript("recovery checkpoint belongs to an earlier transcript turn");
	if (toolCallId) {
		if (!sourceTurnId || !sourceTurnRange) return unsafeRecoveryTranscript("terminal delivery lacks its durable source turn");
		const messageToolCallIndex = params.messages.findLastIndex((message, index) => index > sourceTurnRange.startIndex && readAssistantToolCalls(message)?.some((block) => normalizeOptionalString(block.id) === toolCallId && normalizeOptionalString(block.name) === "message"));
		if (messageToolCallIndex === -1) return unsafeRecoveryTranscript("terminal delivery cannot be matched to its message tool call");
		if (readAssistantToolCalls(params.messages[messageToolCallIndex])?.length !== 1) return unsafeRecoveryTranscript("terminal message tool call has sibling tool work");
		const successfulToolResultIndex = params.messages.findIndex((message, index) => index > messageToolCallIndex && isSuccessfulMessageToolResult(message, toolCallId));
		if (!canReconcileTerminalDeliveryAtSourceTurnTail({
			messages: params.messages,
			sourceTurnId,
			toolCallId,
			toolCallIndex: messageToolCallIndex,
			successfulToolResultIndex
		})) return unsafeRecoveryTranscript(successfulToolResultIndex === -1 ? "terminal delivery would require an out-of-order transcript repair" : "terminal delivery result is followed by unfinished transcript work");
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
			})).sessionEntry?.status === lifecyclePatch.status;
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
			if (!entry || entry.sessionId !== params.entry.sessionId || params.pendingFinalDeliveryIntentId !== void 0 && entry.pendingFinalDelivery?.intentId !== params.pendingFinalDeliveryIntentId || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== expectedRecoveryRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== expectedRecoverySourceRunId) return { result: false };
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
	const completedOutcome = isTerminalSessionStatus(entry.status) && entry.status !== "interrupted";
	const endedAt = completedOutcome ? entry.endedAt ?? Date.now() : Date.now();
	let completed = false;
	await updateSessionEntry(target, (current) => {
		if (current.sessionId !== entry.sessionId || current.pendingFinalDelivery?.intentId !== entry.pendingFinalDelivery?.intentId) return null;
		const pending = current.pendingFinalDelivery;
		completed = true;
		return {
			...buildMainSessionRecoverySettlementPatch({
				entry: current,
				recordTerminalSource: true
			}),
			endedAt,
			lifecycleRunId: void 0,
			lastRunId: completedOutcome ? current.lastRunId : resolveRestartRecoveryTerminalClientRunId(current),
			pendingFinalDelivery: void 0,
			...pending?.context && pending.intentId && current.pendingDeliveryNotice?.intentId !== pending.intentId && (!current.pendingDeliveryNotice || current.pendingDeliveryNotice.createdAt <= pending.createdAt) ? { pendingDeliveryNotice: {
				createdAt: pending.createdAt,
				context: pending.context,
				intentId: pending.intentId,
				state: "owed"
			} } : {},
			runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
			status: completedOutcome ? current.status : "done",
			updatedAt: endedAt
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return completed;
}
async function recoverStore(params) {
	const result = {
		started: 0,
		settled: 0,
		failed: 0,
		skipped: 0
	};
	const passId = params.passId ?? randomUUID();
	const lifecycleGeneration = params.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	const hasCurrentProcessOwner = createCurrentProcessOwnerLookup(params);
	let entries;
	try {
		if (params.expectedTarget) {
			const entry = await loadExpectedRestartRecoveryTarget({
				expected: params.expectedTarget,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedTarget.sessionKey,
				entry
			}] : [];
		} else entries = await readSessionEntrySummariesInWorker({
			agentId: params.storeAgentId,
			storePath: params.storePath
		});
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
		result.failed++;
		return result;
	}
	for (const { sessionKey, entry: loadedEntry } of entries.toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey))) {
		let entry = loadedEntry;
		let completionSource;
		const isRecoveryCandidate = !loadedEntry.mainRestartRecovery?.tombstone && hasMainSessionRecoveryClaim(loadedEntry) && (loadedEntry.abortedLastRun === true || isMainRestartRecoveryTerminalOnly(loadedEntry) || isTerminalSessionStatus(loadedEntry.status) && loadedEntry.status !== "interrupted");
		let decision = {
			decision: "deferred",
			reason: "preparation_failed",
			nextOwner: "main-session-recovery"
		};
		const skip = (reason) => {
			result.skipped++;
			params.onSkipped?.(reason);
			decision = skippedMainSessionRecoveryDecision(reason);
		};
		const stopped = () => {
			if (params.shouldContinue?.() !== false) return false;
			skip("stopped");
			return true;
		};
		try {
			if (stopped()) return result;
			if (!isRecoveryCandidate) continue;
			if (!isMainRestartRecoveryCandidate(entry, sessionKey)) {
				skip("not_main_session");
				continue;
			}
			const dispatchTarget = await resolveRestartRecoveryDispatchTarget({
				agentId: params.expectedTarget?.agentId,
				storeAgentId: params.storeAgentId,
				cfg: params.cfg,
				sessionKey,
				storePath: params.storePath
			});
			if (!dispatchTarget) {
				skip("dispatch_target_unavailable");
				continue;
			}
			const agentId = dispatchTarget.agentId;
			const target = {
				agentId,
				sessionKey,
				storePath: params.storePath
			};
			const workStartBlock = resolveSessionWorkStartBlock(sessionKey, entry, canPrepareAgentSessionWorktree(sessionKey, entry) ? { allowPendingWorkspace: true } : void 0);
			if (workStartBlock) {
				skip(workStartBlock.reason === "archived" ? "archived" : workStartBlock.retryable ? "work_start_pending" : "work_start_blocked");
				decision.reason = workStartBlock.reason;
				if (workStartBlock.retryable) params.onPreparationPending?.({
					...target,
					sessionId: entry.sessionId
				});
				continue;
			}
			const dispatchSessionKey = params.expectedTarget?.canonicalSessionKey ?? dispatchTarget.sessionKey;
			if (hasCurrentProcessOwner(entry, sessionKey)) {
				skip("live_owner");
				continue;
			}
			const resumeDedupeKey = JSON.stringify([agentId, dispatchSessionKey]);
			if (params.handledSessionKeys.has(resumeDedupeKey)) {
				skip("already_handled");
				continue;
			}
			if (stopped()) return result;
			const observed = await commitMainSessionRecovery({
				command: {
					kind: "observe",
					cycleId: randomUUID(),
					lifecycleGeneration,
					sessionKey
				},
				requireWriteSuccess: true,
				shouldContinue: params.shouldContinue,
				target
			});
			if (!observed.entry || observed.transition.kind !== "observed") {
				skip("state_changed");
				continue;
			}
			if (stopped()) return result;
			entry = observed.entry;
			const recoveryView = observed.transition.view;
			if (recoveryView.status === "inactive" || recoveryView.status === "blocked" || recoveryView.status === "tombstoned") {
				skip(recoveryView.status);
				if (recoveryView.status === "inactive" && isMainRestartRecoveryTerminalOnly(loadedEntry)) decision = {
					decision: "settled",
					reason: "terminal-residue",
					nextOwner: "none"
				};
				continue;
			}
			if (recoveryView.status === "exhausted" || !params.observationOnly && requiresRestartRecoveryMessageActionAuthority(entry) && !hasRestartRecoveryMessageActionAuthority(entry)) {
				if (stopped()) return result;
				if (await tombstoneMainRestartRecoveryWithNotice({
					...target,
					cfg: params.cfg,
					entry,
					gatewayRuntime: params.gatewayRuntime,
					observation: recoveryView.observation,
					reason: recoveryView.status === "exhausted" ? recoveryView.reason : "message-tool-only recovery authority is unavailable"
				}) === "notice_failed") result.failed++;
				else skip(recoveryView.status === "exhausted" ? "exhausted" : "message_action_authority_unavailable");
				continue;
			}
			if (params.observationOnly) {
				skip("observation_only");
				continue;
			}
			const expectedRecoverySourceRunId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
			const pendingAction = entry.pendingFinalDelivery ? await pendingFinalRecoveryAction(entry.pendingFinalDelivery, params.stateDir) : void 0;
			if (stopped()) return result;
			if (pendingAction === "defer") {
				skip("pending_delivery");
				continue;
			}
			if (pendingAction === "complete") {
				if ((await markSessionCompletedAfterRecoveryCheckpoint({
					...target,
					entry,
					messages: [],
					pendingFinalDeliveryIntentId: entry.pendingFinalDelivery?.intentId,
					reason: "delivered-terminal-receipt"
				})).outcome === "completed") {
					decision = {
						decision: "settled",
						reason: "terminal-evidence",
						nextOwner: "none"
					};
					result.settled++;
					params.handledSessionKeys.add(resumeDedupeKey);
				} else skip("state_changed");
				continue;
			}
			if (pendingAction === "notice") {
				if (await completePendingFinalRecoveryWithNotice(entry, target)) {
					decision = {
						decision: "settled",
						reason: "pending_delivery_notice",
						nextOwner: "none"
					};
					result.settled++;
				} else skip("state_changed");
				continue;
			}
			const harnessCompletion = entry.restartRecoveryHarnessCompletion;
			let recoverableHarnessCompletion;
			try {
				const hasCurrentCompletionInput = async () => {
					if (!harnessCompletion) return false;
					completionSource = createHarnessCompletionSourceAssertion({
						claim: harnessCompletion,
						storePath: params.storePath,
						mode: "committed"
					});
					return readAdmittedHarnessCompletionInputAsync({
						claim: harnessCompletion,
						entry,
						storePath: params.storePath,
						operationalRunId: entry.restartRecoveryDeliveryRunId
					});
				};
				recoverableHarnessCompletion = Boolean(harnessCompletion && harnessCompletion.requesterSessionKey === sessionKey && harnessCompletion.requesterAgentId === agentId && harnessCompletion.sourceRunId === entry.restartRecoveryDeliverySourceRunId && Boolean(entry.restartRecoveryDeliveryRunId) && entry.restartRecoverySourceIngress === "internal" && Boolean(getOwedHarnessCompletionTask(harnessCompletion, entry)) && await hasCurrentCompletionInput());
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
					skip("invalid_harness_completion");
				} else if (reconciliation.entry && hasMainSessionRecoveryClaim(reconciliation.entry) && reconciliation.entry.abortedLastRun === true) result.failed++;
				else skip("state_changed");
				continue;
			}
			const execPolicy = await resolveExecDefaultsAsync({
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
			if (!harnessCompletion && entry.restartRecoverySourceIngress === "internal" && expectedRecoverySourceRunId?.startsWith("announce:requester-settle:")) try {
				const { prepareRequesterSettleWakeRecoverySource } = await import("./subagent-registry-BSZR34Tv.mjs");
				completionSource = await prepareRequesterSettleWakeRecoverySource({
					runId: expectedRecoverySourceRunId,
					requesterSessionKey: dispatchSessionKey,
					requesterAgentId: agentId,
					sessionId: entry.sessionId,
					lifecycleRevision: entry.lifecycleRevision,
					storePath: params.storePath,
					gatewayRuntime: params.gatewayRuntime
				});
				if (!completionSource || !entry.restartRecoveryOperatorSource) throw new Error("Requester settle recovery lacks its original cohort or operator authority");
				completionSource();
			} catch (error) {
				mainSessionRecoveryLog.warn(`requester settle recovery source unavailable for ${sessionKey}: ${String(error)}`);
				result.failed++;
				continue;
			}
			if (!recoverableHarnessCompletion && !completionSource && requiresDelegatedRecoverySource(entry, source)) {
				if (await finishDelegatedRestartRecovery({
					...target,
					cfg: params.cfg,
					entry,
					gatewayRuntime: params.gatewayRuntime,
					observation: recoveryView.observation,
					reason: "delegated recovery sender authority is unavailable"
				}) === "notice_failed") result.failed++;
				else skip("delegated_authority_unavailable");
				continue;
			}
			const pendingFinal = entry.pendingFinalDelivery;
			let resumeOptions;
			if (pendingAction === "fail" || pendingFinal?.kind === "replayable") resumeOptions = {
				...pendingFinal?.kind === "replayable" ? { pendingFinalDeliveryText: pendingFinal.text } : {},
				forceRestartSafeTools: pendingAction === "fail" || isTerminalSessionStatus(entry.status) && entry.status !== "interrupted" || entry.mainRestartRecovery?.safeToolsRequired === true || entry.restartRecoveryForceSafeTools === true || hasReplaySafeCodeModeCheckpointInCurrentTurn(messages)
			};
			else {
				const retainedSafeTools = replaySafeCheckpoint || entry.mainRestartRecovery?.safeToolsRequired === true || entry.restartRecoveryForceSafeTools === true && !fullAccess;
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
						decision = {
							decision: "settled",
							reason: "terminal-evidence",
							nextOwner: "none"
						};
						result.settled++;
						continue;
					}
					if (completion.outcome === "changed") {
						skip("state_changed");
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
				completionSource,
				recoveryAttempt: recoveryView.nextAttempt,
				recoveryAdmission: params.recoveryAdmission,
				signal: params.signal,
				gatewayRuntime: params.gatewayRuntime,
				...resumeOptions,
				lifecycleGeneration: params.lifecycleGeneration,
				shouldContinue: params.shouldContinue
			});
			decision = {
				decision: resumeResult === "failed" || resumeResult === "skipped" ? "deferred" : resumeResult,
				reason: `dispatch_${resumeResult}`,
				nextOwner: resumeResult === "started" ? "background-lane" : resumeResult === "settled" ? "none" : "main-session-recovery"
			};
			if (resumeResult === "skipped") skip("dispatch_skipped");
			else result[resumeResult]++;
			if (resumeResult === "started" || resumeResult === "settled") params.handledSessionKeys.add(resumeDedupeKey);
			else if (resumeResult === "failed") {
				const current = await loadExpectedRestartRecoveryTarget({
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
		} finally {
			if (isRecoveryCandidate && isMainRestartRecoveryCandidate(loadedEntry, sessionKey)) mainSessionRecoveryLog.info(`main-session restart recovery candidate ${JSON.stringify({
				boot: lifecycleGeneration,
				pass: passId,
				agentId: params.storeAgentId?.slice(0, 256),
				storePath: params.storePath.slice(0, 512),
				sessionKey: sessionKey.slice(0, 256),
				sessionId: loadedEntry.sessionId.slice(0, 256),
				sourceRunId: (loadedEntry.restartRecoveryDeliverySourceRunId ?? loadedEntry.lifecycleRunId)?.slice(0, 256),
				recoveryRunId: loadedEntry.restartRecoveryDeliveryRunId?.slice(0, 256),
				interruptedRunIds: loadedEntry.restartRecoveryRuns?.slice(0, 8).map(({ runId }) => runId.slice(0, 256)),
				...decision
			})}`);
		}
	}
	return result;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-runtime.ts
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
	const passId = randomUUID();
	const skipReasons = /* @__PURE__ */ new Map();
	const handledSessionKeys = params.handledSessionKeys ?? /* @__PURE__ */ new Set();
	for (const target of await discoverRestartRecoveryStoreTargets(params)) {
		if (params.shouldContinue?.() === false) break;
		if (params.excludedStoreTargets?.has(restartRecoveryStoreTargetKey(target))) continue;
		const storeResult = await recoverStore({
			...params,
			passId,
			storePath: target.storePath,
			storeAgentId: target.agentId,
			handledSessionKeys,
			onSkipped: (reason) => {
				skipReasons.set(reason, (skipReasons.get(reason) ?? 0) + 1);
			}
		});
		result.started += storeResult.started;
		result.settled += storeResult.settled;
		result.failed += storeResult.failed;
		result.skipped += storeResult.skipped;
	}
	if (result.started > 0 || result.settled > 0 || result.failed > 0 || result.skipped > 0) {
		const skipSummary = skipReasons.size > 0 ? ` skipReasons=${[...skipReasons].toSorted(([left], [right]) => left.localeCompare(right)).map(([reason, count]) => `${reason}:${count}`).join(",")}` : "";
		mainSessionRecoveryLog.info(`main-session restart recovery startup complete: started=${result.started} settled=${result.settled} failed=${result.failed} skipped=${result.skipped}${skipSummary} boot=${params.lifecycleGeneration ?? getAgentEventLifecycleGeneration()} pass=${passId}`);
	}
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
	try {
		var _usingCtx$1 = _usingCtx();
		const expected = {
			...params.expectedTarget,
			claim: params.expectedTarget.claim && { ...params.expectedTarget.claim }
		};
		const current = await prepareExpectedRestartRecoveryCurrent({
			expected,
			storePath: params.storePath
		});
		_usingCtx$1.u({ [Symbol.dispose]: current.release });
		const { isCurrent } = current;
		const preparation = prepareRestartRecovery(params.gatewayRuntime, params.signal);
		if (preparation && await preparation !== void 0) return {
			started: 0,
			settled: 0,
			failed: 0,
			skipped: 0
		};
		if (!isCurrent()) return {
			started: 0,
			settled: 0,
			failed: 0,
			skipped: 0
		};
		return await runWithMainSessionRecoveryAdmission({
			...params,
			canonicalSessionKey: expected.canonicalSessionKey,
			sessionId: expected.sessionId,
			isCurrent,
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
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
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
			const stillPending = await loadExpectedRestartRecoveryTarget({
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
	const startupCheckedStorePaths = params.startupCheckedStorePaths ?? /* @__PURE__ */ new Set();
	const pendingPreparation = /* @__PURE__ */ new Map();
	const retainPendingPreparation = (target) => {
		const stores = pendingPreparation.get(target.sessionKey) ?? /* @__PURE__ */ new Map();
		const pending = stores.get(target.storePath);
		if (pending) pending.target = target;
		else stores.set(target.storePath, {
			target,
			queued: false,
			changed: false
		});
		pendingPreparation.set(target.sessionKey, stores);
	};
	const runRecoveryAttempt = async (exhaustedTargets, agentIds) => {
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
				agentIds,
				stateDir: params.stateDir,
				startupCheckedStorePaths,
				updatedBeforeMs: startupRecoveryCutoffMs
			});
			const result = await recoverRestartAbortedMainSessions({
				cfg,
				agentIds,
				onExhaustedTarget: (target) => {
					exhaustedTargets.set(JSON.stringify([
						target.storePath,
						target.agentId,
						target.canonicalSessionKey ?? target.sessionKey
					]), target);
				},
				stateDir: params.stateDir,
				handledSessionKeys,
				onPreparationPending: retainPendingPreparation,
				excludedStoreTargets: new Set(marking.failedTargets?.map(restartRecoveryStoreTargetKey)),
				lifecycleGeneration,
				shouldContinue,
				signal: abortController.signal,
				gatewayRuntime: params.gatewayRuntime
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
	const runRecovery = async (agentIds) => {
		if (params.waitForStart) await Promise.race([params.waitForStart(), waitForAbortSignal(abortController.signal)]);
		await runRecoveryRetries({
			initialDelayMs: params.delayMs ?? 5e3,
			maxRetries: Math.max(1, params.maxRetries ?? 3),
			shouldContinue,
			signal: abortController.signal,
			attempt: async (finalAttempt) => {
				exhaustedTargets = /* @__PURE__ */ new Map();
				while (shouldContinue()) {
					const result = await runRecoveryAttempt(exhaustedTargets, agentIds);
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
	};
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir ?? resolveStateDir(process.env)
	};
	const pendingAgents = new Set(listAgentDatabaseAdmissionRefusals({ env }).filter((refusal) => refusal.code === "agent-database-inspection-pending").map((refusal) => refusal.agentId));
	const recoverPreparation = async (target) => {
		let exhausted = false;
		let pending = false;
		const recover = (observationOnly = false) => {
			pending = false;
			return runWithGatewayIndependentRootWorkAdmission(() => recoverExpectedRestartRecovery({
				...target,
				expectedTarget: target,
				cfg: params.getConfig(),
				stateDir: params.stateDir,
				gatewayRuntime: params.gatewayRuntime,
				lifecycleGeneration,
				shouldContinue,
				observationOnly,
				signal: abortController.signal,
				onPreparationPending: () => {
					pending = true;
				},
				onExhaustedTarget: () => {
					exhausted = true;
				}
			}), "main-session:preparation-recovery", abortController.signal);
		};
		await runRecoveryRetries({
			initialDelayMs: 0,
			maxRetries: Math.max(1, params.maxRetries ?? 3),
			shouldContinue,
			signal: abortController.signal,
			attempt: async (finalAttempt) => {
				exhausted = false;
				let result = await recover();
				if (finalAttempt && exhausted) result = await recover(true);
				if (finalAttempt && result.failed > 0) mainSessionRecoveryLog.warn(`main-session preparation recovery gave up for ${target.sessionKey}`);
				return result.failed === 0;
			},
			onError: (error, finalAttempt) => {
				if (finalAttempt) mainSessionRecoveryLog.warn(`main-session preparation recovery failed: ${String(error)}`);
			}
		});
		return pending;
	};
	const drainPreparation = async (pending) => {
		try {
			do {
				pending.changed = false;
				if (!await recoverPreparation(pending.target)) {
					const { sessionKey, storePath } = pending.target;
					const stores = pendingPreparation.get(sessionKey);
					stores?.delete(storePath);
					if (stores?.size === 0) pendingPreparation.delete(sessionKey);
					return;
				}
			} while (pending.changed);
		} finally {
			pending.queued = false;
		}
	};
	let run = Promise.resolve().then(async () => {
		await runRecovery();
		const pending = [];
		for (const stores of pendingPreparation.values()) for (const target of stores.values()) pending.push(target);
		for (const target of pending) if (!target.queued) {
			target.queued = true;
			await drainPreparation(target);
		}
	});
	const unsubscribe = sessionChanges.subscribe(AsyncLocalStorage.bind((change) => {
		if (!shouldContinue()) return;
		if ("sessionKey" in change) {
			const stores = pendingPreparation.get(change.sessionKey);
			if (!stores) return;
			for (const pending of stores.values()) {
				pending.changed = true;
				if (!pending.queued) {
					pending.queued = true;
					run = run.then(() => drainPreparation(pending));
				}
			}
			return;
		}
		if (!isSessionStoreTopologyChange(change)) return;
		const admitted = /* @__PURE__ */ new Set();
		for (const agentId of pendingAgents) {
			const refusal = readAgentDatabaseAdmissionRefusal(agentId, { env });
			if (refusal?.code === "agent-database-inspection-pending") continue;
			pendingAgents.delete(agentId);
			if (!refusal) admitted.add(agentId);
		}
		if (admitted.size > 0) run = run.then(() => runRecovery(admitted));
	}));
	return { stop: async () => {
		unsubscribe();
		pendingPreparation.clear();
		unregisterRotation();
		abortController.abort();
		await run;
	} };
}
//#endregion
export { markRestartAbortedMainSessions, markStartupOrphanedMainSessionsForRecovery, recoverRestartAbortedMainSessions, retryRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease };
