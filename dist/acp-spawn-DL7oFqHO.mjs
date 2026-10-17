import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { u as isSqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { o as resolveAgentEntry, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, c as normalizeOptionalAgentId, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { g as resolveSessionAgentId, v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { p as onAgentEventForRun } from "./agent-events-GvNTkbe3.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { r as hasDeliveryTargetFields } from "./delivery-context.shared-PF5njaoI.mjs";
import { p as requestSessionEventWake, s as areSessionEventWakesEnabled } from "./heartbeat-wake-ba6LAy2M.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as formatThinkingLevels } from "./thinking-NbdrO8vA.mjs";
import { n as resolveConfiguredSubagentSpawnModelSelection } from "./model-selection-D3_rVb38.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as inheritSessionGitContributorProfileIds, n as buildSessionCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { a as loadSessionEntry, g as upsertSessionEntryCore, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { a as normalizeAssistantPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { m as recordSubagentSpawned } from "./session-state-events-DQKK_I00.mjs";
import { i as resolveAcpThreadSessionDetailLines, n as resolveAcpSessionCwd } from "./session-identifiers-Bm1zQpah.mjs";
import { c as isAcpOwnerRepairRequired, n as getAcpSessionManager } from "./manager-daMVnzH0.mjs";
import { n as listActiveAcpSessionsForOwner } from "./active-turns-uPxFhqSZ.mjs";
import { t as getAcpRuntimeBackend } from "./registry-CQAJvYwl.mjs";
import { n as readAcpSessionMeta } from "./session-meta-DUw-8Na0.mjs";
import { d as formatAcpInheritedToolAllowError, f as formatAcpInheritedToolDenyError, l as findAcpUnsupportedInheritedToolAllow, m as inheritedToolDenyPatch, p as inheritedToolAllowPatch, s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession, u as findAcpUnsupportedInheritedToolDeny } from "./subagent-capabilities-wl-IV_LE.mjs";
import { E as resolveInboundConversationResolution, S as isSessionBindingError, t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { D as resolveChannelStreamingProgressCommentary } from "./streaming-CHnBADiw.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { i as scopedHeartbeatWakeOptionsForPolicy, n as resolveEventSessionRoutingPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-yXV1vWY_.mjs";
import { a as getInProcessGatewayToolContext, c as runWithGatewayToolCleanupContext, r as callInProcessGatewayTool } from "./in-process-gateway-5-3wumVL.mjs";
import { c as callSubagentGateway, f as buildSubagentExecutionSessionSpawnContext, p as withSubagentGatewayExecutionIdentity, u as readGatewayRunId } from "./subagent-spawn-cleanup-t0t2OBAm.mjs";
import { o as getSubagentRunByChildSessionKey } from "./subagent-registry-read-BE_xWkJl.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-tRryl7lz.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-BJoXx6GG.mjs";
import { _ as summarizeSpawnError, c as resolveRequesterOriginForChild, d as resolveSpawnAdmission, f as resolveSpawnChannelAccountId, g as runSpawnPipeline, h as reserveChildAdmissionSlot, i as resolveConfiguredSubagentRunTimeoutSeconds, l as mintSpawnSessionKey, m as resolveSpawnSandboxError, n as captureSpawnParentLineage, o as splitModelRef, p as resolveSpawnMode, r as resolveSubagentSpawnOwnership, s as resolveSubagentThinkingOverride, t as buildSpawnThreadBinding, u as prepareSpawnThreadBinding, v as readParentExecutionIdentity } from "./spawn-thread-binding-ZEk8n14w.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-xzpaoE7C.mjs";
import "./sessions-helpers-CULwdUYq.mjs";
import { n as formatConversationTarget, t as deliveryContextFromConversation } from "./route-projection-uEI9fHmI.mjs";
import { n as waitForSessionParticipantRecording, t as recordSessionParticipantBestEffort } from "./session-participant-recording-Cbdqxwp1.mjs";
import { n as resolveAcpAgentPolicyError, t as isAcpEnabledByPolicy } from "./policy-DlIDudm0.mjs";
import { t as recordSessionCreated } from "./session-created-DzYS37GH.mjs";
import { i as resolveSpawnedWorkspaceInheritance } from "./spawned-context-BjFFoRwI.mjs";
import { i as resolveHeartbeatConfig, o as resolveHeartbeatIntervalMs } from "./heartbeat-config--CDRLwW6.mjs";
import { t as isHeartbeatEnabledForAgent } from "./heartbeat-summary-DGkbnKda.mjs";
import { n as resolveAcpProjectionSettings, t as isAcpTagVisible } from "./acp-stream-settings-CnAFDtJR.mjs";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/acp/control-plane/spawn.ts
/** Cleanup helpers for failed ACP spawn flows. */
/** Roll back only the provisional session owned by this failed spawn. */
async function cleanupFailedAcpSpawn(params) {
	if (!params.sessionEntry) return;
	const { sessionId, lifecycleRevision } = params.sessionEntry;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const assertCurrent = () => {
		const current = loadSessionEntry({
			storePath,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			clone: false
		});
		if (current?.sessionId !== sessionId || current?.lifecycleRevision !== lifecycleRevision) throw new Error(`ACP provisional session ${params.sessionKey} changed before cleanup.`);
	};
	let deletionStarted = false;
	let deletionExecution;
	const cancellation = new AbortController();
	try {
		await runWithGatewayToolCleanupContext(async () => {
			assertCurrent();
			const context = getInProcessGatewayToolContext();
			if (!context) throw new Error("ACP provisional cleanup Gateway is unavailable.");
			await callInProcessGatewayTool("sessions.delete", {
				key: params.sessionKey,
				agentId: params.agentId,
				expectedSessionId: sessionId,
				...lifecycleRevision ? { expectedLifecycleRevision: lifecycleRevision } : {},
				deleteTranscript: params.deleteTranscript,
				emitLifecycleHooks: false
			}, {
				onExecution: (execution) => {
					deletionExecution = execution;
				},
				sessionMutationCommitGuard: () => {
					cancellation.signal.throwIfAborted();
					context.requestEntryLifetime?.signal.throwIfAborted();
					assertCurrent();
					deletionStarted = true;
				},
				signal: cancellation.signal,
				timeoutMs: 1e4
			});
		});
	} catch (error) {
		if (!deletionStarted) cancellation.abort(error);
		if (!deletionStarted && params.closeRuntimeOnFailure) await runExclusiveSessionLifecycleMutation("acp-spawn-cleanup", {
			scope: storePath,
			identities: [params.sessionKey, sessionId],
			run: async () => {
				assertCurrent();
				await params.closeRuntimeOnFailure();
			}
		}).catch((releaseError) => {
			if (isAcpOwnerRepairRequired(releaseError)) throw releaseError;
			logVerbose(`acp-spawn: provisional runtime cleanup failed: ${String(releaseError)}`);
		});
		logVerbose(`acp-spawn: provisional session cleanup failed: ${String(error)}`);
	} finally {
		if (deletionStarted) await deletionExecution;
	}
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-admission.ts
function countUntrackedActiveAcpRunsForOwner(ownerKey, pendingChildSessionKeys) {
	if (!ownerKey?.trim()) return 0;
	return new Set(listActiveAcpSessionsForOwner(ownerKey.trim()).filter((sessionKey) => {
		const run = getSubagentRunByChildSessionKey(sessionKey);
		return !pendingChildSessionKeys?.has(sessionKey) && !(run && typeof run.execution.endedAt !== "number");
	})).size;
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-bootstrap-delivery.ts
function toGatewayImageAttachments(attachments) {
	if (!attachments || attachments.length === 0) return;
	return attachments.map((attachment) => ({
		type: "image",
		source: {
			type: "base64",
			media_type: attachment.mediaType,
			data: attachment.data
		}
	}));
}
function resolveAcpSpawnBootstrapDeliveryPlan(params) {
	const boundThreadIdRaw = params.binding?.conversation.conversationId;
	const boundThreadId = boundThreadIdRaw ? normalizeOptionalString(boundThreadIdRaw) : void 0;
	const fallbackThreadIdRaw = params.requester.origin?.threadId;
	const fallbackThreadId = fallbackThreadIdRaw != null ? normalizeOptionalString(String(fallbackThreadIdRaw)) : void 0;
	const deliveryThreadId = boundThreadId ?? fallbackThreadId;
	const requesterConversationRef = resolveInboundConversationResolution({
		cfg: params.cfg,
		channel: params.requester.origin?.channel,
		accountId: params.requester.origin?.accountId,
		threadId: fallbackThreadId,
		to: params.requester.origin?.to
	});
	const requesterAccountId = resolveSpawnChannelAccountId({
		cfg: params.cfg,
		channel: params.requester.origin?.channel,
		accountId: params.requester.origin?.accountId
	});
	const bindingMatchesRequesterConversation = Boolean(params.requester.origin?.channel && params.binding?.conversation.channel === params.requester.origin.channel && params.binding?.conversation.accountId === requesterAccountId && requesterConversationRef?.conversationId && params.binding?.conversation.conversationId === requesterConversationRef.conversationId && (params.binding?.conversation.parentConversationId ?? void 0) === (requesterConversationRef.parentConversationId ?? void 0));
	const boundDeliveryTarget = deliveryContextFromConversation(params.binding?.conversation);
	const inferredDeliveryTo = (bindingMatchesRequesterConversation ? normalizeOptionalString(params.requester.origin?.to) : void 0) ?? boundDeliveryTarget?.to ?? normalizeOptionalString(params.requester.origin?.to) ?? formatConversationTarget({
		channel: params.requester.origin?.channel,
		conversationId: deliveryThreadId
	});
	const resolvedDeliveryThreadId = bindingMatchesRequesterConversation ? fallbackThreadId : boundDeliveryTarget?.threadId ?? deliveryThreadId;
	const useInlineDelivery = Boolean(params.requester.origin?.channel && inferredDeliveryTo) && !params.effectiveStreamToParent && params.spawnMode === "session";
	return {
		useInlineDelivery,
		channel: useInlineDelivery ? params.requester.origin?.channel : void 0,
		accountId: useInlineDelivery ? requesterAccountId : void 0,
		to: useInlineDelivery ? inferredDeliveryTo : void 0,
		threadId: useInlineDelivery && resolvedDeliveryThreadId != null ? normalizeOptionalString(String(resolvedDeliveryThreadId)) : void 0
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-gateway.ts
async function launchAcpChildThroughGateway(params) {
	const promptedAt = Date.now();
	const response = await callSubagentGateway(withSubagentGatewayExecutionIdentity({
		method: "agent",
		assertDispatchCurrent: params.assertDispatchCurrent,
		params: {
			message: params.task,
			sessionKey: params.sessionKey,
			channel: params.deliveryPlan.channel,
			to: params.deliveryPlan.to,
			accountId: params.deliveryPlan.accountId,
			threadId: params.deliveryPlan.threadId,
			idempotencyKey: params.childIdem,
			deliver: params.deliveryPlan.useInlineDelivery,
			lane: AGENT_LANE_SUBAGENT,
			acpTurnSource: "manual_spawn",
			timeout: params.runTimeoutSeconds,
			label: params.label || void 0,
			...params.attachments ? { attachments: params.attachments } : {}
		},
		timeoutMs: 1e4
	}, {
		sessionSpawnContext: buildSubagentExecutionSessionSpawnContext(params.lineage),
		parentExecutionIdentityToken: params.parentExecutionIdentityToken
	}));
	recordSessionParticipantBestEffort({
		promptedAt,
		identity: {
			type: "agent",
			id: params.lineage.parentAgentId
		},
		agentId: params.lineage.targetAgentId,
		sessionKey: params.sessionKey,
		storePath: params.participantStorePath
	});
	return response;
}
//#endregion
//#region src/agents/subagents/spawn/acp-parent-stream-store.sqlite.ts
/** Captures the child and physical store before delayed relay flushes can yield. */
function createAcpParentStreamRecorder(input) {
	const options = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env)
	};
	const identity = readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(options));
	if (!identity.key.startsWith("file:")) throw new Error("ACP parent-stream diagnostics require the existing child database");
	const execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		nativeLocation: identity.canonicalPath,
		birthtime: identity.birthtime
	} });
	options.path = execution.path;
	const worker = openOpenClawAgentSqliteWorkerStore(options, { execution }, {
		moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.acpParentStreamStore),
		input: void 0
	});
	worker.catch(() => {});
	return {
		async record(events) {
			const prepared = events.flatMap((entry) => {
				try {
					const eventJson = JSON.stringify(entry.event);
					if (eventJson !== void 0) return [{
						eventJson,
						createdAt: entry.createdAt
					}];
				} catch {}
				return [];
			});
			if (prepared.length === 0) return {
				ok: true,
				value: void 0
			};
			const result = await runOpenClawAgentWriteAdmission(options, async () => (await worker).execute({
				type: "record",
				input: {
					sessionId: options.sessionId,
					runId: options.runId,
					events: prepared
				}
			}, () => execution.assertCurrent()), true);
			if (result.ok) return result;
			const error = /* @__PURE__ */ new Error("ACP parent-stream transaction rolled back");
			retainOpenClawStateWorkerErrorPayload(error, result.error);
			return {
				ok: false,
				error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true })
			};
		},
		async close() {
			const failures = [];
			for (const close of [async () => (await worker).close(), () => execution.release()]) try {
				await close();
			} catch (error) {
				failures.push(error);
			}
			throwSqliteLifecycleErrors(failures, "ACP parent-stream recorder cleanup failed");
		}
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-parent-stream.ts
const STREAM_FLUSH_MS = 2500;
const NO_OUTPUT_NOTICE_MS = 6e4;
const NO_OUTPUT_POLL_MS = 15e3;
const MAX_RELAY_LIFETIME_MS = 216e5;
const STREAM_BUFFER_MAX_CHARS = 4e3;
const STREAM_SNIPPET_MAX_CHARS = 220;
const STREAM_LOG_BATCH_SIZE = 100;
const STREAM_LOG_FLUSH_MS = 1e3;
const STREAM_LOG_MAX_PENDING_EVENTS = 256;
const STREAM_LOG_MAX_RETRY_MS = 3e4;
const log = createSubsystemLogger("agents/acp-parent-stream");
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string" && item.length > 0);
}
function mergeStreamingConfig(base, override) {
	const baseRecord = asOptionalRecord(base);
	const overrideRecord = asOptionalRecord(override);
	if (!baseRecord || !overrideRecord) return override ?? base;
	const merged = {
		...baseRecord,
		...overrideRecord
	};
	const baseProgress = asOptionalRecord(baseRecord.progress);
	const overrideProgress = asOptionalRecord(overrideRecord.progress);
	if (baseProgress && overrideProgress) merged.progress = {
		...baseProgress,
		...overrideProgress
	};
	else if (overrideProgress ?? baseProgress) merged.progress = overrideProgress ?? baseProgress;
	else delete merged.progress;
	return merged;
}
function resolveParentProgressStreamingEntry(params) {
	const channelId = normalizeOptionalString(params.deliveryContext?.channel);
	if (!params.cfg || !channelId) return;
	const channelCfg = params.cfg.channels?.[channelId];
	if (!channelCfg) return;
	const accountCfg = resolveChannelAccountEntry(channelCfg.accounts, normalizeAccountId(params.deliveryContext?.accountId), channelId, normalizeAccountId);
	return accountCfg ? {
		...channelCfg,
		...accountCfg,
		streaming: mergeStreamingConfig(channelCfg.streaming, accountCfg.streaming)
	} : channelCfg;
}
function startAcpSpawnParentStreamRelay(params) {
	const { runId, parentSessionKey, eventRouting } = params;
	const relayLabel = truncateUtf16WithEllipsis(params.agentId.replace(/\s+/g, " ").trim(), 40) || "ACP child";
	const contextPrefix = `acp-spawn:${runId}`;
	const childSessionId = normalizeOptionalString(params.childSessionId);
	const stateEnv = { ...params.env ?? process.env };
	const host = getBoundLegacyPluginSdkResourceHost();
	const closingSignal = host?.scheduler.signal;
	const acceptedWork = new AsyncWorkScope();
	let recorder;
	try {
		if (childSessionId) recorder = createAcpParentStreamRecorder({
			agentId: params.agentId,
			env: stateEnv,
			sessionId: childSessionId,
			runId
		});
	} catch (error) {
		log.warn("Failed to capture ACP parent stream diagnostic store", {
			runId,
			error: String(error)
		});
	}
	const pendingLogEvents = [];
	let logFlush;
	let disposal;
	let logFlushTimer;
	let logFailureWarned = false;
	let logBufferWarned = false;
	let consecutiveLogFailures = 0;
	let disposed = false;
	const capPendingLogEvents = () => {
		const overflow = pendingLogEvents.length - STREAM_LOG_MAX_PENDING_EVENTS;
		if (overflow <= 0) return;
		pendingLogEvents.splice(0, overflow);
		if (!logBufferWarned) {
			log.warn("Capped ACP parent stream diagnostic buffer", {
				runId,
				childSessionId,
				maxPendingEvents: STREAM_LOG_MAX_PENDING_EVENTS
			});
			logBufferWarned = true;
		}
	};
	const clearLogFlushTimer = () => {
		clearTimeout(logFlushTimer);
		logFlushTimer = void 0;
	};
	function flushLogEvents() {
		clearLogFlushTimer();
		if (logFlush || !recorder || pendingLogEvents.length === 0) return logFlush;
		const events = pendingLogEvents.splice(0);
		const writer = recorder;
		logFlush = acceptedWork.track(async () => {
			let retryable = false;
			try {
				const result = await writer.record(events);
				if (!result.ok) {
					retryable = true;
					throw result.error;
				}
				logFailureWarned = false;
				logBufferWarned = false;
				consecutiveLogFailures = 0;
			} catch (error) {
				retryable ||= isSqliteWorkerError(error, "overloaded") || isSqliteWorkerError(error, "unavailable");
				const retrying = retryable && !disposed;
				if (retrying) {
					pendingLogEvents.unshift(...events);
					capPendingLogEvents();
					consecutiveLogFailures += 1;
					clearLogFlushTimer();
					scheduleLogFlush(Math.min(STREAM_LOG_FLUSH_MS * 2 ** consecutiveLogFailures, STREAM_LOG_MAX_RETRY_MS));
				}
				if (!logFailureWarned || disposed) {
					log.warn("Failed to persist ACP parent stream diagnostics", {
						runId,
						childSessionId,
						retrying,
						error: String(error)
					});
					logFailureWarned = true;
				}
			}
		}).finally(() => {
			logFlush = void 0;
			scheduleLogFlush();
		});
		return logFlush;
	}
	function scheduleLogFlush(delayMs = STREAM_LOG_FLUSH_MS) {
		if (disposed || logFlushTimer || pendingLogEvents.length === 0) return;
		logFlushTimer = setTimeout(() => {
			flushLogEvents();
		}, delayMs);
		logFlushTimer.unref?.();
	}
	const logEvent = (kind, fields) => {
		if (disposed || !recorder) return;
		const createdAt = Date.now();
		pendingLogEvents.push({
			createdAt,
			event: {
				ts: new Date(createdAt).toISOString(),
				epochMs: createdAt,
				runId,
				parentSessionKey,
				childSessionKey: params.childSessionKey,
				agentId: params.agentId,
				kind,
				...fields
			}
		});
		capPendingLogEvents();
		if (consecutiveLogFailures === 0 && pendingLogEvents.length >= STREAM_LOG_BATCH_SIZE) {
			flushLogEvents();
			return;
		}
		scheduleLogFlush();
	};
	const shouldRelayProgressCommentary = resolveChannelStreamingProgressCommentary(resolveParentProgressStreamingEntry({
		cfg: params.cfg,
		deliveryContext: params.deliveryContext
	}), true);
	const acpProjectionSettings = resolveAcpProjectionSettings(params.cfg ?? {});
	const wake = () => {
		requestSessionEventWake(scopedHeartbeatWakeOptionsForPolicy(parentSessionKey, {
			source: "acp-spawn",
			intent: "event",
			reason: "acp:spawn:stream"
		}, eventRouting));
	};
	const emit = (text, contextKey) => {
		const cleaned = text.trim();
		if (disposed || !cleaned) return;
		logEvent("system_event", {
			contextKey,
			text: cleaned
		});
		enqueueSystemEvent(cleaned, {
			sessionKey: resolveSystemEventQueueKey(resolveEventSessionKeyForPolicy(parentSessionKey, eventRouting), resolveAgentIdFromSessionKey(parentSessionKey, params.requesterAgentId)),
			contextKey,
			deliveryContext: params.deliveryContext
		});
		wake();
	};
	const emitStartNotice = () => {
		emit(`Started ${relayLabel} session ${params.childSessionKey}. Streaming progress updates to parent session.`, `${contextPrefix}:start`);
	};
	let pendingText = "";
	let pendingProgressKind;
	let replaceableAssistantSnapshot;
	const itemProgressTextById = /* @__PURE__ */ new Map();
	let lastProgressAt = Date.now();
	let stallNotified = false;
	let promptSubmittedAt;
	let firstRuntimeEventAt;
	let firstVisibleOutputAt;
	let lastRuntimeEventType;
	let proxyEnvKeysAtPrompt = [];
	let flushTimer;
	const clearFlushTimer = () => {
		clearTimeout(flushTimer);
		flushTimer = void 0;
	};
	const flushPending = () => {
		clearFlushTimer();
		if (!pendingText) return;
		const snippet = truncateUtf16WithEllipsis(pendingText.replace(/\s+/g, " ").trim(), STREAM_SNIPPET_MAX_CHARS);
		pendingText = "";
		pendingProgressKind = void 0;
		if (!snippet) return;
		emit(`${relayLabel}: ${snippet}`, `${contextPrefix}:progress`);
	};
	const scheduleFlush = () => {
		if (disposed || flushTimer) return;
		flushTimer = setTimeout(flushPending, STREAM_FLUSH_MS);
		flushTimer.unref?.();
	};
	const appendVisibleProgress = (delta, kind) => {
		if (stallNotified) {
			stallNotified = false;
			emit(`${relayLabel} resumed output.`, `${contextPrefix}:resumed`);
		}
		lastProgressAt = Date.now();
		firstVisibleOutputAt ??= lastProgressAt;
		if (pendingText && pendingProgressKind && pendingProgressKind !== kind) flushPending();
		pendingProgressKind = kind;
		pendingText += delta;
		if (pendingText.length > STREAM_BUFFER_MAX_CHARS) pendingText = sliceUtf16Safe(pendingText, -4e3);
		if (pendingText.length >= STREAM_SNIPPET_MAX_CHARS || delta.includes("\n\n")) {
			flushPending();
			return;
		}
		scheduleFlush();
	};
	const flushReplaceableAssistantSnapshot = () => {
		const snapshot = replaceableAssistantSnapshot;
		replaceableAssistantSnapshot = void 0;
		if (!snapshot?.trim()) return;
		appendVisibleProgress(snapshot, "assistant:replaceable");
	};
	const appendItemProgressSnapshot = (snapshot) => {
		const previous = itemProgressTextById.get(snapshot.itemId) ?? "";
		if (snapshot.text === previous) return;
		const kind = `item:${snapshot.itemId}`;
		const isPrefixUpdate = Boolean(previous && snapshot.text.startsWith(previous));
		if (previous && !isPrefixUpdate && pendingProgressKind === kind && Boolean(pendingText)) pendingText = "";
		itemProgressTextById.set(snapshot.itemId, snapshot.text);
		const delta = isPrefixUpdate ? snapshot.text.slice(previous.length) : snapshot.text;
		appendVisibleProgress(delta, kind);
	};
	const buildNoOutputNotice = () => {
		const seconds = Math.round(NO_OUTPUT_NOTICE_MS / 1e3);
		if (!promptSubmittedAt) return `${relayLabel} session started but no prompt submission was observed for ${seconds}s.`;
		if (!firstRuntimeEventAt) {
			const proxySummary = `proxy env: ${proxyEnvKeysAtPrompt.join(", ") || "none"}`;
			return `${relayLabel} prompt was submitted but no ACP runtime event arrived for ${seconds}s (${proxySummary}). Check upstream connectivity, auth, or proxy/network access in the gateway child environment.`;
		}
		if (!firstVisibleOutputAt) {
			const lastEvent = lastRuntimeEventType ? ` Last ACP event: ${lastRuntimeEventType}.` : "";
			return `${relayLabel} has ACP runtime activity but no visible assistant output for ${seconds}s.${lastEvent} It may be working, blocked on a tool, or failing before visible output.`;
		}
		return `${relayLabel} has produced no visible output for ${seconds}s. It may be waiting for interactive input.`;
	};
	const noOutputWatcherTimer = setInterval(() => {
		if (disposed) return;
		if (stallNotified) return;
		if (Date.now() - lastProgressAt < NO_OUTPUT_NOTICE_MS) return;
		stallNotified = true;
		emit(buildNoOutputNotice(), `${contextPrefix}:stall`);
	}, NO_OUTPUT_POLL_MS);
	noOutputWatcherTimer.unref?.();
	const relayLifetimeTimer = setTimeout(() => {
		if (disposed) return;
		emit(`${relayLabel} stream relay timed out after ${Math.round(MAX_RELAY_LIFETIME_MS / 1e3)}s without completion.`, `${contextPrefix}:timeout`);
		dispose();
	}, MAX_RELAY_LIFETIME_MS);
	relayLifetimeTimer.unref?.();
	const unsubscribe = onAgentEventForRun(runId, (event) => {
		if (disposed || event.runId !== runId) return;
		if (event.stream === "assistant") {
			const data = event.data;
			const assistantPhase = normalizeAssistantPhase(data.phase);
			const textCandidate = data.text;
			const deltaCandidate = data.delta;
			const snapshot = typeof textCandidate === "string" ? textCandidate : typeof deltaCandidate === "string" ? deltaCandidate : void 0;
			if (data.replaceable === true) {
				if (snapshot?.trim()) {
					replaceableAssistantSnapshot = snapshot;
					lastProgressAt = Date.now();
					logEvent("assistant_replaceable_snapshot", {
						text: snapshot,
						...assistantPhase ? { phase: assistantPhase } : {}
					});
				}
				return;
			}
			const delta = typeof deltaCandidate === "string" ? deltaCandidate : snapshot;
			if (!delta || !delta.trim()) return;
			logEvent("assistant_delta", {
				delta,
				...assistantPhase ? { phase: assistantPhase } : {}
			});
			if (assistantPhase === "commentary" && !shouldRelayProgressCommentary) {
				lastProgressAt = Date.now();
				return;
			}
			replaceableAssistantSnapshot = void 0;
			appendVisibleProgress(delta, `assistant:${assistantPhase ?? "unknown"}`);
			return;
		}
		if (event.stream === "item") {
			const data = event.data;
			const itemId = normalizeOptionalString(data?.itemId);
			const kind = normalizeOptionalString(data?.kind);
			const progressText = normalizeOptionalString(data?.progressText);
			if (kind === "preamble" && progressText) {
				lastProgressAt = Date.now();
				if (shouldRelayProgressCommentary && itemId) appendItemProgressSnapshot({
					itemId,
					text: progressText
				});
			}
			return;
		}
		if (event.stream === "acp") {
			const data = event.data;
			const phase = normalizeOptionalString(data?.phase);
			logEvent("acp", {
				phase: phase ?? "unknown",
				data: event.data
			});
			if (phase === "prompt_submitted") {
				const at = asFiniteNumber(data?.at) ?? Date.now();
				promptSubmittedAt ??= at;
				proxyEnvKeysAtPrompt = normalizeStringArray(data?.proxyEnvKeys);
				lastProgressAt = Date.now();
				return;
			}
			if (phase === "runtime_event") {
				const eventType = normalizeOptionalString(data?.eventType);
				const text = normalizeOptionalString(data?.text);
				const tag = normalizeOptionalString(data?.tag);
				firstRuntimeEventAt ??= Date.now();
				lastRuntimeEventType = eventType;
				if (shouldRelayProgressCommentary && eventType === "status" && text && isAcpTagVisible(acpProjectionSettings, tag)) {
					appendVisibleProgress(`${text}\n\n`, "acp:status");
					return;
				}
				lastProgressAt = Date.now();
				return;
			}
			return;
		}
		if (event.stream !== "lifecycle") return;
		const phase = normalizeOptionalString(event.data.phase);
		logEvent("lifecycle", {
			phase: phase ?? "unknown",
			data: event.data
		});
		if (phase !== "end" && phase !== "error") return;
		flushReplaceableAssistantSnapshot();
		flushPending();
		if (phase === "end") {
			const startedAt = asFiniteNumber(event.data.startedAt);
			const endedAt = asFiniteNumber(event.data.endedAt);
			const durationMs = startedAt != null && endedAt != null && endedAt >= startedAt ? endedAt - startedAt : void 0;
			emit(durationMs != null ? `${relayLabel} run completed in ${Math.max(1, Math.round(durationMs / 1e3))}s.` : `${relayLabel} run completed.`, `${contextPrefix}:done`);
		} else {
			const errorText = normalizeOptionalString(event.data.error);
			emit(errorText ? `${relayLabel} run failed: ${errorText}` : `${relayLabel} run failed.`, `${contextPrefix}:error`);
		}
		dispose();
	});
	const dispose = () => {
		if (disposal) return disposal;
		disposed = true;
		clearFlushTimer();
		clearLogFlushTimer();
		clearTimeout(relayLifetimeTimer);
		clearInterval(noOutputWatcherTimer);
		unsubscribe();
		closingSignal?.removeEventListener("abort", onClose);
		disposal = (async () => {
			await logFlush;
			await flushLogEvents();
			await acceptedWork.drain();
			await recorder?.close();
		})().catch((error) => {
			log.warn("Failed to close ACP parent stream diagnostics", {
				runId,
				error: String(error)
			});
		});
		const completion = disposal;
		host?.releaseClaim({ release: () => completion });
		return disposal;
	};
	const onClose = () => {
		dispose();
	};
	closingSignal?.addEventListener("abort", onClose, { once: true });
	return {
		dispose,
		notifyStarted: emitStartNotice
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-heartbeat.ts
function isHeartbeatEnabledForSessionAgent(params) {
	if (!areSessionEventWakesEnabled()) return false;
	if (!params.sessionKey?.trim()) return true;
	const requesterAgentId = resolveSessionAgentIds({
		config: params.cfg,
		agentId: params.requesterAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId;
	if (!isHeartbeatEnabledForAgent(params.cfg, requesterAgentId)) return false;
	return resolveHeartbeatIntervalMs(params.cfg, void 0, resolveHeartbeatConfig(params.cfg, requesterAgentId)) !== null;
}
function hasSessionLocalHeartbeatRelayRoute(params) {
	if ((params.cfg.session?.scope ?? "per-sender") === "global") return false;
	const heartbeat = resolveHeartbeatConfig(params.cfg, params.requesterAgentId);
	if (heartbeat?.target !== "last") return false;
	if (normalizeOptionalString(heartbeat.to) || normalizeOptionalString(heartbeat.accountId)) return false;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.requesterAgentId });
	const parentEntry = loadSessionEntryReadOnly({
		storePath,
		sessionKey: params.parentSessionKey,
		clone: false
	});
	const parentDeliveryContext = deliveryContextFromSession(parentEntry);
	return hasDeliveryTargetFields(parentDeliveryContext);
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-requester.ts
async function readAcpSpawnParentDeliveryContext(params) {
	return await withSessionEntryReadOnlyInWorker({
		sessionKey: params.parentSessionKey,
		agentId: resolveAgentIdFromSessionKey(params.parentSessionKey, params.requesterAgentId),
		clone: false
	}, () => params.assertActive?.(), async (read) => {
		if (!read.ok) throw read.error;
		return deliveryContextFromSession(read.value);
	});
}
function resolveRequesterInternalSessionKey(params) {
	const { alias } = resolveMainSessionAlias(params.cfg);
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	return requesterSessionKey ? resolveInternalSessionKey({
		key: requesterSessionKey,
		alias
	}) : alias;
}
function resolveAcpSpawnRequesterState(params) {
	const bindingService = getSessionBindingService();
	const requesterParsedSession = parseAgentSessionKey(params.parentSessionKey);
	const isSubagentSession = Boolean(requesterParsedSession) && isSubagentSessionKey(params.parentSessionKey);
	return {
		isSubagentSession,
		hasActiveSubagentBinding: isSubagentSession && params.parentSessionKey ? bindingService.listBySession(params.parentSessionKey).some((record) => record.targetKind === "subagent" && record.status !== "ended") : false,
		hasThreadContext: typeof params.ctx.agentThreadId === "string" ? Boolean(normalizeOptionalString(params.ctx.agentThreadId)) : params.ctx.agentThreadId != null,
		heartbeatEnabled: isHeartbeatEnabledForSessionAgent({
			cfg: params.cfg,
			requesterAgentId: params.requesterAgentId,
			sessionKey: params.parentSessionKey
		}),
		heartbeatRelayRouteUsable: params.parentSessionKey && params.requesterAgentId ? hasSessionLocalHeartbeatRelayRoute({
			cfg: params.cfg,
			parentSessionKey: params.parentSessionKey,
			requesterAgentId: params.requesterAgentId
		}) : false,
		origin: resolveRequesterOriginForChild({
			cfg: params.cfg,
			targetAgentId: params.targetAgentId,
			requesterAgentId: params.requesterAgentId,
			requesterChannel: params.ctx.agentChannel,
			requesterAccountId: params.ctx.agentAccountId,
			requesterTo: params.ctx.agentTo,
			requesterThreadId: params.ctx.agentThreadId,
			requesterGroupSpace: params.ctx.agentGroupSpace,
			requesterMemberRoleIds: params.ctx.agentMemberRoleIds
		})
	};
}
function shouldStreamAcpSpawnToParent(params) {
	const implicitStreamToParent = params.spawnMode === "run" && !params.requestThreadBinding && params.requester.isSubagentSession && !params.requester.hasActiveSubagentBinding && !params.requester.hasThreadContext && params.requester.heartbeatEnabled && params.requester.heartbeatRelayRouteUsable;
	return params.streamToParentRequested || implicitStreamToParent;
}
function validateAcpResumeSessionOwnership(params) {
	const resumeSessionId = normalizeOptionalString(params.resumeSessionId);
	if (!resumeSessionId) return { ok: true };
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	if (!requesterSessionKey) return {
		ok: false,
		error: "sessions_spawn resumeSessionId requires an active requester session context."
	};
	const configuredBackend = normalizeOptionalLowercaseString(params.backendId);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.targetAgentId });
	for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		storePath,
		clone: false
	})) {
		const acp = readAcpSessionMeta({
			sessionKey,
			cfg: params.cfg
		});
		if (configuredBackend && normalizeOptionalLowercaseString(acp?.backend) !== configuredBackend || normalizeOptionalString(acp?.identity?.agentSessionId) !== resumeSessionId && normalizeOptionalString(acp?.identity?.acpxSessionId) !== resumeSessionId) continue;
		if (sessionKey === requesterSessionKey || normalizeOptionalString(entry?.spawnedBy) === requesterSessionKey || normalizeOptionalString(entry?.parentSessionKey) === requesterSessionKey) return { ok: true };
		break;
	}
	return {
		ok: false,
		error: "sessions_spawn resumeSessionId is only allowed for ACP sessions previously recorded for this requester. Omit resumeSessionId to start a fresh ACP session."
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-runtime.ts
const ACP_RUNTIME_TIMEOUT_MAX_SECONDS = 86400;
async function resolveRuntimeCwdForAcpSpawn(params) {
	if (!params.resolvedCwd) return;
	if (normalizeOptionalString(params.explicitCwd)) return params.resolvedCwd;
	try {
		await fs.access(params.resolvedCwd);
		return params.resolvedCwd;
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
function resolveAcpSpawnRuntimeOptions(params) {
	const policyAgentId = params.configAgentId ?? params.targetAgentId;
	const modelExplicit = normalizeOptionalString(params.model) !== void 0;
	const thinkingExplicit = normalizeOptionalString(params.thinking) !== void 0;
	const rawModel = resolveConfiguredSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: policyAgentId,
		modelOverride: params.model,
		modelRuntime: "acp"
	});
	const modelSelection = splitTrailingAuthProfile(rawModel ?? "");
	if (modelExplicit && modelSelection.profile) return {
		ok: false,
		error: "ACP model overrides cannot select OpenClaw auth profiles; configure credentials in the ACP runtime instead."
	};
	const model = modelSelection.model || void 0;
	const targetAgentConfig = resolveAgentConfig(params.cfg, policyAgentId);
	const thinkingPlan = resolveSubagentThinkingOverride({
		cfg: params.cfg,
		targetAgentConfig,
		thinkingOverrideRaw: params.thinking
	});
	if (thinkingPlan.status === "error") {
		const { provider, model: modelId } = splitModelRef(model);
		return {
			ok: false,
			error: `Invalid thinking level "${thinkingPlan.thinkingCandidateRaw}". Use one of: ${formatThinkingLevels(provider, modelId)}.`
		};
	}
	let thinking = thinkingPlan.thinkingOverride;
	if (!thinking) {
		const { provider, model: modelId } = splitModelRef(model);
		thinking = provider && modelId ? resolveThinkingDefaultCore({
			cfg: params.cfg,
			agentId: policyAgentId,
			provider,
			model: modelId
		}) : targetAgentConfig?.thinkingDefault;
	}
	const timeoutSeconds = params.runTimeoutSeconds ? Math.min(params.runTimeoutSeconds, ACP_RUNTIME_TIMEOUT_MAX_SECONDS) : void 0;
	return {
		ok: true,
		runtimeOptions: model || thinking || timeoutSeconds ? {
			...model ? { model } : {},
			...thinking ? { thinking } : {},
			...timeoutSeconds ? { timeoutSeconds } : {}
		} : void 0,
		modelExplicit,
		thinkingExplicit
	};
}
async function initializeAcpSpawnRuntime(params) {
	params.assertActive?.();
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.targetAgentId });
	const sessionEntry = loadSessionEntry({
		storePath,
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId,
		clone: false
	});
	const sessionId = sessionEntry?.sessionId;
	return {
		initialized: await getAcpSessionManager().initializeSession({
			assertActive: params.assertActive,
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.targetAgentId,
			agent: params.targetAgentId,
			mode: params.runtimeMode,
			resumeSessionId: params.resumeSessionId,
			runtimeOptions: params.runtimeOptions,
			modelExplicit: params.modelExplicit,
			thinkingExplicit: params.thinkingExplicit,
			cwd: params.cwd,
			backendId: params.backendId
		}),
		sessionId,
		sessionEntry
	};
}
async function bindPreparedAcpThread(params) {
	const binding = await getSessionBindingService().bind(buildSpawnThreadBinding({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		targetKind: "session",
		agentId: params.targetAgentId,
		label: params.label,
		binding: params.preparedBinding,
		sessionCwd: resolveAcpSessionCwd(params.initializedRuntime.initialized.meta),
		sessionDetails: resolveAcpThreadSessionDetailLines({
			sessionKey: params.sessionKey,
			meta: params.initializedRuntime.initialized.meta
		})
	}));
	params.assertActive?.();
	if (!binding.conversation.conversationId) throw new Error(params.preparedBinding.placement === "child" ? `Failed to create and bind a ${params.preparedBinding.channel} thread for this ACP session.` : `Failed to bind the current ${params.preparedBinding.channel} conversation for this ACP session.`);
	return binding;
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-target.ts
function resolveAcpAgentTarget(params) {
	const backendId = normalizeOptionalString(params.agentBackend) ?? normalizeOptionalString(params.cfg.acp?.backend) ?? getAcpRuntimeBackend()?.id;
	return {
		ok: true,
		agentId: params.agentId,
		...params.configAgentId ? { configAgentId: params.configAgentId } : {},
		...backendId ? { backendId } : {}
	};
}
function resolveTargetAcpAgentId(params) {
	const normalizedRequest = params.requestedAgentId === void 0 ? null : normalizeAgentIdStrict(params.requestedAgentId);
	if (normalizedRequest && !normalizedRequest.ok) return {
		ok: false,
		error: `agentId "${params.requestedAgentId}" was not found`
	};
	const requested = normalizedRequest?.value;
	if (requested) {
		const configuredAgent = resolveAgentEntry(params.cfg, requested);
		if (configuredAgent?.runtime?.type === "acp") return resolveAcpAgentTarget({
			cfg: params.cfg,
			agentId: normalizeOptionalAgentId(configuredAgent.runtime.acp?.agent) ?? requested,
			configAgentId: requested,
			agentBackend: configuredAgent.runtime.acp?.backend
		});
		if (configuredAgent && !isExplicitlyAllowedAcpAgent(params.cfg, requested)) return {
			ok: false,
			error: `agentId "${requested}" is an OpenClaw config agent, not an ACP harness. Use runtime="subagent" or omit runtime for OpenClaw config agents. Use runtime="acp" only with external ACP harness ids such as codex, claude, droid, gemini, or opencode, or configure agents.entries.*.runtime.type="acp" with runtime.acp.agent.`
		};
		return resolveAcpAgentTarget({
			cfg: params.cfg,
			agentId: requested,
			...configuredAgent ? { configAgentId: requested } : {}
		});
	}
	const configuredDefault = normalizeOptionalAgentId(params.cfg.acp?.defaultAgent);
	if (configuredDefault) {
		const configuredAgent = resolveAgentEntry(params.cfg, configuredDefault);
		return resolveAcpAgentTarget({
			cfg: params.cfg,
			agentId: configuredDefault,
			agentBackend: configuredAgent?.runtime?.type === "acp" ? configuredAgent.runtime.acp?.backend : void 0
		});
	}
	return {
		ok: false,
		error: "ACP target agent is not configured. Pass `agentId` in `sessions_spawn` or set `acp.defaultAgent` in config."
	};
}
function isExplicitlyAllowedAcpAgent(cfg, agentId) {
	return (cfg.acp?.allowedAgents ?? []).some((entry) => {
		if (entry.trim() === "*") return true;
		return normalizeOptionalAgentId(entry) === agentId;
	});
}
function resolveConfiguredAcpSubagentTargetIds(cfg) {
	const ids = new Set(listAgentIds(cfg));
	for (const agent of listAgentEntries(cfg)) {
		if (agent.runtime?.type !== "acp") continue;
		const acpAgent = normalizeOptionalAgentId(agent.runtime.acp?.agent);
		if (acpAgent) ids.add(acpAgent);
	}
	const defaultAgent = normalizeOptionalAgentId(cfg.acp?.defaultAgent);
	if (defaultAgent) ids.add(defaultAgent);
	for (const entry of cfg.acp?.allowedAgents ?? []) {
		if (entry.trim() === "*") continue;
		const id = normalizeOptionalAgentId(entry);
		if (id) ids.add(id);
	}
	return Array.from(ids);
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn.ts
const ACP_SPAWN_ACCEPTED_NOTE = "initial ACP task queued in isolated session; follow-ups continue in the bound thread.";
const ACP_SPAWN_SESSION_ACCEPTED_NOTE = "thread-bound ACP session stays active after this task; continue in-thread for follow-ups.";
function resolveAcpSpawnRuntimePolicyError(params) {
	const requesterRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.requesterSessionKey,
		agentId: params.requesterAgentId
	});
	return resolveSpawnSandboxError({
		backend: "acp",
		requesterSandboxed: params.requesterSandboxed === true || requesterRuntime.sandboxed,
		sandbox: params.sandbox === "require" ? "require" : "inherit"
	});
}
async function spawnAcpDirect(params, ctx) {
	const cfg = getRuntimeConfig();
	const runTimeoutSeconds = resolveConfiguredSubagentRunTimeoutSeconds({
		cfg,
		runTimeoutSeconds: params.runTimeoutSeconds
	});
	const requesterInternalKey = resolveRequesterInternalSessionKey({
		cfg,
		requesterSessionKey: ctx.agentSessionKey
	});
	if (!isAcpEnabledByPolicy(cfg)) return {
		status: "forbidden",
		errorCode: "acp_disabled",
		error: "ACP is disabled by policy (`acp.enabled=false`)."
	};
	const streamToParentRequested = params.streamTo === "parent";
	const parentSessionKey = normalizeOptionalString(ctx.agentSessionKey);
	if (streamToParentRequested && !parentSessionKey) return {
		status: "error",
		errorCode: "requester_session_required",
		error: "sessions_spawn streamTo=\"parent\" requires an active requester session context."
	};
	const requestThreadBinding = params.thread === true;
	const requesterAgentId = resolveSessionAgentId({
		config: cfg,
		sessionKey: requesterInternalKey,
		agentId: ctx.requesterAgentIdOverride
	});
	const runtimePolicyError = resolveAcpSpawnRuntimePolicyError({
		cfg,
		requesterAgentId,
		requesterSessionKey: ctx.agentSessionKey,
		requesterSandboxed: ctx.sandboxed,
		sandbox: params.sandbox
	});
	if (runtimePolicyError) return {
		status: "forbidden",
		errorCode: "runtime_policy",
		error: runtimePolicyError
	};
	const acpUnsupportedInheritedTool = findAcpUnsupportedInheritedToolDeny(ctx.inheritedToolDenylist);
	if (acpUnsupportedInheritedTool) return {
		status: "forbidden",
		errorCode: "runtime_policy",
		error: formatAcpInheritedToolDenyError(acpUnsupportedInheritedTool)
	};
	const acpUnsupportedInheritedAllow = findAcpUnsupportedInheritedToolAllow(ctx.inheritedToolAllowlist);
	if (acpUnsupportedInheritedAllow) return {
		status: "forbidden",
		errorCode: "runtime_policy",
		error: formatAcpInheritedToolAllowError(acpUnsupportedInheritedAllow)
	};
	const spawnMode = resolveSpawnMode({
		requestedMode: params.mode,
		threadRequested: requestThreadBinding
	});
	if (spawnMode === "session" && !requestThreadBinding) return {
		status: "error",
		errorCode: "thread_required",
		error: "sessions_spawn(runtime=\"acp\", mode=\"session\") requires thread=true so the ACP session can stay bound to a channel thread. Retry with { mode: \"session\", thread: true } on a channel that exposes threads (e.g. Discord, Slack, Telegram topics), or use mode=\"run\" for one-shot work."
	};
	const targetAgentResult = resolveTargetAcpAgentId({
		requestedAgentId: params.agentId,
		cfg
	});
	if (!targetAgentResult.ok) return {
		status: "error",
		errorCode: params.agentId && normalizeOptionalAgentId(params.agentId) ? "runtime_agent_mismatch" : "target_agent_required",
		error: targetAgentResult.error
	};
	const { agentId: targetAgentId, backendId } = targetAgentResult;
	const agentPolicyError = resolveAcpAgentPolicyError(cfg, targetAgentId);
	if (agentPolicyError) return {
		status: "forbidden",
		errorCode: "agent_forbidden",
		error: agentPolicyError.message
	};
	const subagentStore = resolveSubagentCapabilityStore(parentSessionKey, { cfg });
	const requesterState = resolveAcpSpawnRequesterState({
		cfg,
		parentSessionKey,
		requesterAgentId,
		targetAgentId,
		ctx
	});
	const ownership = resolveSubagentSpawnOwnership({
		cfg,
		agentSessionKey: ctx.agentSessionKey,
		completionOwnerKey: ctx.completionOwnerKey
	});
	const requesterTarget = await resolveGatewaySessionStoreTargetInWorker({
		cfg,
		key: ownership.completionRequesterSessionKey,
		agentId: ctx.requesterAgentIdOverride,
		assertActive: ctx.assertActive
	});
	ctx.assertActive?.();
	const requesterEntry = requesterTarget.store[requesterTarget.canonicalKey];
	const completionRequesterSessionId = requesterEntry?.sessionId;
	const completionRequesterLifecycleRevision = requesterEntry?.lifecycleRevision;
	const hasSubagentEnvelope = isSubagentEnvelopeSession(requesterInternalKey, {
		cfg,
		store: subagentStore
	});
	const resolveAdmission = (pendingChildren = 0, pendingChildSessionKeys) => resolveSpawnAdmission({
		cfg,
		enabled: hasSubagentEnvelope,
		requesterSessionKey: requesterInternalKey,
		requesterAgentId,
		targetAgentId,
		requestedAgentId: params.agentId,
		configuredAgentIds: resolveConfiguredAcpSubagentTargetIds(cfg),
		additionalActiveChildren: hasSubagentEnvelope ? countUntrackedActiveAcpRunsForOwner(requesterInternalKey, pendingChildSessionKeys) + pendingChildren : 0
	});
	const rejectSubagentPolicy = (error) => ({
		status: "forbidden",
		errorCode: "subagent_policy",
		error
	});
	const admission = resolveAdmission();
	if (!admission.ok) return rejectSubagentPolicy(admission.error);
	const resumeAuthorization = validateAcpResumeSessionOwnership({
		cfg,
		targetAgentId,
		backendId,
		requesterSessionKey: requesterInternalKey,
		resumeSessionId: params.resumeSessionId
	});
	if (!resumeAuthorization.ok) return {
		status: "forbidden",
		errorCode: "resume_forbidden",
		error: resumeAuthorization.error
	};
	const runtimeOptionsResult = resolveAcpSpawnRuntimeOptions({
		cfg,
		targetAgentId,
		configAgentId: targetAgentResult.configAgentId,
		model: params.model,
		thinking: params.thinking,
		runTimeoutSeconds
	});
	if (!runtimeOptionsResult.ok) return {
		status: "error",
		errorCode: "spawn_failed",
		error: runtimeOptionsResult.error
	};
	const effectiveStreamToParent = shouldStreamAcpSpawnToParent({
		spawnMode,
		requestThreadBinding,
		streamToParentRequested,
		requester: requesterState
	});
	const sessionKey = mintSpawnSessionKey({
		targetAgentId,
		backend: "acp"
	});
	const resolvedCwd = resolveSpawnedWorkspaceInheritance({
		config: cfg,
		targetAgentId,
		requesterSessionKey: ctx.agentSessionKey,
		explicitWorkspaceDir: params.cwd
	});
	let runtimeCwd;
	try {
		runtimeCwd = await resolveRuntimeCwdForAcpSpawn({
			resolvedCwd,
			explicitCwd: params.cwd
		});
	} catch (error) {
		return {
			status: "error",
			errorCode: "cwd_resolution_failed",
			error: formatErrorMessage(error)
		};
	}
	let preparedBinding = null;
	if (requestThreadBinding) {
		const prepared = prepareSpawnThreadBinding({
			cfg,
			kind: "acp",
			mode: spawnMode,
			bindingService: getSessionBindingService(),
			channel: requesterState.origin?.channel,
			accountId: requesterState.origin?.accountId,
			to: requesterState.origin?.to,
			threadId: requesterState.origin?.threadId,
			groupId: ctx.agentGroupId
		});
		if (!prepared.ok) return {
			status: "error",
			errorCode: "thread_binding_invalid",
			error: prepared.error
		};
		preparedBinding = prepared.binding;
	}
	let childCreationEntry;
	let closeRuntimeOnFailure;
	const childIdem = crypto.randomUUID();
	const parentDeliveryCtx = effectiveStreamToParent && parentSessionKey ? await readAcpSpawnParentDeliveryContext({
		parentSessionKey,
		requesterAgentId,
		assertActive: ctx.assertActive
	}) : void 0;
	ctx.assertActive?.();
	const parentRelayStateEnv = { ...process.env };
	const parentEventRouting = parentSessionKey ? resolveEventSessionRoutingPolicy({
		cfg,
		sessionKey: parentSessionKey
	}) : void 0;
	const gatewayAttachments = toGatewayImageAttachments(params.attachments);
	const requesterOrigin = requesterState.origin;
	const progressOrigin = {
		channel: requesterOrigin?.channel,
		accountId: requesterOrigin?.accountId,
		to: ctx.currentMessagingTarget ?? ctx.currentChannelId ?? requesterOrigin?.to,
		threadId: requesterOrigin?.threadId,
		channelId: ctx.currentChannelId,
		messageId: ctx.currentMessageId
	};
	const adapter = {
		async initialize() {
			const parentTarget = await resolveGatewaySessionStoreTargetInWorker({
				cfg,
				key: requesterInternalKey,
				agentId: requesterAgentId,
				assertActive: ctx.assertActive
			});
			const parentStorePath = parentTarget.readSource?.path ?? parentTarget.storePath;
			await waitForSessionParticipantRecording({
				agentId: requesterAgentId,
				sessionKey: parentTarget.canonicalKey,
				storePath: parentStorePath
			});
			ctx.assertActive?.();
			const readParentEntry = () => withSessionEntryReadOnlyInWorker({
				agentId: requesterAgentId,
				sessionKey: parentTarget.canonicalKey,
				storePath: parentStorePath
			}, () => ctx.assertActive?.(), async (read) => {
				if (!read.ok) throw read.error;
				return read.value;
			});
			const parentEntry = isIncognitoSessionKey(requesterInternalKey) ? void 0 : await readParentEntry();
			const parentLineage = captureSpawnParentLineage({
				parentEntry,
				expectedParentSessionId: ctx.expectedParentSessionId,
				senderIsOwner: ctx.senderIsOwner,
				readParentEntry
			});
			const creationStamp = buildSessionCreationStamp({
				via: "spawn",
				actor: {
					type: "agent",
					id: requesterAgentId
				},
				inheritedGitContributorProfileIds: inheritSessionGitContributorProfileIds(parentEntry),
				conversationLink: parentEntry?.conversationLink
			});
			const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: targetAgentId });
			const childSessionPatch = admission.childSessionPatch ? {
				spawnDepth: admission.childSessionPatch.spawnDepth,
				...admission.childSessionPatch.subagentRole ? { subagentRole: admission.childSessionPatch.subagentRole } : {},
				subagentControlScope: admission.childSessionPatch.subagentControlScope
			} : {};
			await parentLineage.assertParentUnchanged();
			ctx.assertActive?.();
			childCreationEntry = await upsertSessionEntryCore({
				storePath,
				sessionKey,
				agentId: targetAgentId
			}, {
				...creationStamp,
				spawnedBy: requesterInternalKey,
				completionOwnerSessionKey: ownership.completionRequesterSessionKey,
				parentSessionKey: requesterInternalKey,
				...childSessionPatch,
				inheritedToolPolicyVersion: 1,
				...inheritedToolAllowPatch(ctx.inheritedToolAllowlist),
				...inheritedToolDenyPatch(ctx.inheritedToolDenylist),
				...params.label ? { label: params.label } : {},
				...parentLineage.receipt
			}, { assertCommitAllowed: ctx.assertActive }) ?? void 0;
			const initializedSession = await initializeAcpSpawnRuntime({
				assertActive: ctx.assertActive,
				cfg,
				sessionKey,
				targetAgentId,
				runtimeMode: spawnMode === "session" ? "persistent" : "oneshot",
				backendId,
				resumeSessionId: params.resumeSessionId,
				runtimeOptions: runtimeOptionsResult.runtimeOptions,
				modelExplicit: runtimeOptionsResult.modelExplicit,
				thinkingExplicit: runtimeOptionsResult.thinkingExplicit,
				cwd: runtimeCwd
			});
			closeRuntimeOnFailure = initializedSession.initialized.closeRuntimeOnFailure;
			ctx.assertActive?.();
			return {
				initializedSession,
				binding: preparedBinding ? await bindPreparedAcpThread({
					assertActive: ctx.assertActive,
					cfg,
					sessionKey,
					targetAgentId,
					label: params.label,
					preparedBinding,
					initializedRuntime: initializedSession
				}) : null
			};
		},
		async dispatchTurn(state) {
			state.deliveryPlan = resolveAcpSpawnBootstrapDeliveryPlan({
				cfg,
				spawnMode,
				effectiveStreamToParent,
				requester: requesterState,
				binding: state.binding
			});
			if (childCreationEntry) await recordSessionCreated(cfg, {
				sessionKey,
				agentId: targetAgentId,
				entry: childCreationEntry
			});
			await recordSubagentSpawned({
				childSessionKey: sessionKey,
				childRunId: childIdem,
				requesterSessionKey: requesterInternalKey,
				agentId: targetAgentId
			});
			const startParentRelay = (runId) => effectiveStreamToParent && parentSessionKey && parentEventRouting ? startAcpSpawnParentStreamRelay({
				runId,
				parentSessionKey,
				requesterAgentId,
				childSessionKey: sessionKey,
				childSessionId: state.initializedSession.sessionId,
				agentId: targetAgentId,
				env: parentRelayStateEnv,
				eventRouting: parentEventRouting,
				deliveryContext: parentDeliveryCtx,
				cfg
			}) : void 0;
			state.parentRelay = startParentRelay(childIdem);
			const response = await launchAcpChildThroughGateway({
				assertDispatchCurrent: ctx.assertActive,
				task: params.task,
				sessionKey,
				deliveryPlan: state.deliveryPlan,
				childIdem,
				runTimeoutSeconds,
				label: params.label,
				attachments: gatewayAttachments,
				lineage: {
					enabled: isExecutionIdentityCollectionEnabled(cfg),
					backend: "acp",
					parentAgentId: requesterAgentId,
					requesterRef: requesterInternalKey,
					controllerRef: ownership.controllerSessionKey,
					depth: admission.childSessionPatch?.spawnDepth ?? 1,
					maxDepth: admission.maxSpawnDepth,
					targetAgentId,
					sandbox: params.sandbox === "require" ? "require" : "inherit",
					inheritedToolAllowlist: ctx.inheritedToolAllowlist,
					inheritedToolDenylist: ctx.inheritedToolDenylist
				},
				parentExecutionIdentityToken: readParentExecutionIdentity(ctx),
				participantStorePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: targetAgentId })
			});
			const runId = readGatewayRunId(response) ?? childIdem;
			if (state.parentRelay && runId !== childIdem) {
				state.parentRelay.dispose();
				state.parentRelay = startParentRelay(runId);
			}
			state.parentRelay?.notifyStarted();
			return { runId };
		},
		async cleanupOnFailure({ state }) {
			await state?.parentRelay?.dispose();
			await cleanupFailedAcpSpawn({
				cfg,
				sessionKey,
				agentId: targetAgentId,
				sessionEntry: childCreationEntry,
				deleteTranscript: true,
				closeRuntimeOnFailure
			});
		}
	};
	const { controllerSessionKey } = ownership;
	ctx.assertActive?.();
	const admissionReservation = hasSubagentEnvelope ? reserveChildAdmissionSlot({
		controllerSessionKey,
		childSessionKey: sessionKey,
		resolveAdmission
	}) : void 0;
	if (admissionReservation && !admissionReservation.ok) return rejectSubagentPolicy(admissionReservation.error);
	ctx.onSpawnEffectsStart?.();
	let expectsCompletionMessage = false;
	const pipelineResult = await runSpawnPipeline({
		adapter,
		assertActive: ctx.assertActive,
		admissionReservation,
		hookRunner: getGlobalHookRunner(),
		progressOrigin,
		progressSessionKey: ownership.completionRequesterSessionKey,
		buildRegistration: (state, runId) => {
			expectsCompletionMessage = !(state.deliveryPlan?.useInlineDelivery === true) && params.expectsCompletionMessage !== false;
			return {
				runId,
				requesterTurnRunId: ctx.requesterTurnRunId,
				childSessionKey: sessionKey,
				controllerSessionKey,
				sessionEntry: state.initializedSession.sessionEntry,
				requesterSessionKey: ownership.completionRequesterSessionKey,
				completionRequesterSessionId,
				completionRequesterLifecycleRevision,
				requesterOrigin,
				progressOrigin,
				requesterDisplayKey: ownership.completionRequesterDisplayKey,
				task: params.task,
				taskName: params.taskName,
				agentId: targetAgentId,
				requesterAgentId,
				cleanup: spawnMode === "session" ? "keep" : params.cleanup === "delete" ? "delete" : "keep",
				label: params.label,
				runTimeoutSeconds,
				expectsCompletionMessage,
				spawnMode
			};
		}
	});
	if (!pipelineResult.ok) {
		const { phase, error, runId } = pipelineResult;
		const bindingError = phase === "initialize" && isSessionBindingError(error);
		return {
			status: "error",
			errorCode: bindingError ? "thread_binding_invalid" : phase === "dispatch" ? "dispatch_failed" : "spawn_failed",
			error: bindingError ? error.message : phase === "register" ? `Failed to register ACP run: ${summarizeSpawnError(error)}. Cleanup was attempted, but the already-started ACP run may still finish in the background.` : summarizeSpawnError(error),
			...phase !== "initialize" ? { childSessionKey: sessionKey } : {},
			...phase === "register" && runId ? { runId } : {}
		};
	}
	return {
		status: "accepted",
		childSessionKey: sessionKey,
		runId: pipelineResult.runId,
		mode: spawnMode,
		runTimeoutSeconds,
		expectsCompletionMessage,
		...pipelineResult.state.deliveryPlan?.useInlineDelivery ? { inlineDelivery: true } : {},
		note: spawnMode === "session" ? ACP_SPAWN_SESSION_ACCEPTED_NOTE : ACP_SPAWN_ACCEPTED_NOTE
	};
}
//#endregion
export { cleanupFailedAcpSpawn as i, spawnAcpDirect as n, resolveRuntimeCwdForAcpSpawn as r, resolveAcpSpawnRuntimePolicyError as t };
