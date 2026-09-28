import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds, o as resolveAgentEntry, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey, c as normalizeOptionalAgentId, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { _ as resolveSessionAgentId, y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { r as hasDeliveryTargetFields } from "./delivery-context.shared-CW8dxG7X.mjs";
import { p as onAgentEventForRun } from "./agent-events-BOSJcayE.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { p as requestSessionEventWake, s as areSessionEventWakesEnabled } from "./heartbeat-wake-bWS25cgK.mjs";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CHVGbaAW.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { n as formatThinkingLevels } from "./thinking-B1p5pEC8.mjs";
import { n as resolveConfiguredSubagentSpawnModelSelection } from "./model-selection-CFnUi6iD.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import "./heartbeat-vWflpIwS.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { a as normalizeAssistantPhase } from "./chat-message-content-D14VlZZc.mjs";
import { i as resolveAcpThreadSessionDetailLines, n as resolveAcpSessionCwd } from "./session-identifiers-dXNk5MtW.mjs";
import { b as upsertSessionEntryCore, l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CV-eEST-.mjs";
import { c as isAcpOwnerRepairRequired, t as getAcpSessionManager } from "./manager-BSwH2tZB.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { p as recordSubagentSpawned } from "./session-state-events-M0m1rzDq.mjs";
import { s as getSubagentRunByChildSessionKey } from "./subagent-registry-read-C2SIiLpb.mjs";
import { r as resolveInboundConversationResolution } from "./conversation-resolution-BQfeG7hv.mjs";
import { t as getSessionBindingService, y as isSessionBindingError } from "./session-binding-service-n2QTfkUE.mjs";
import { f as listTasksForOwnerKey } from "./task-registry-query-Bd-H3o4L.mjs";
import "./runtime-internal-BF8pXknh.mjs";
import { l as recordTaskRunProgressByRunId } from "./detached-task-runtime-Cl5iIO5L.mjs";
import { t as getAcpRuntimeBackend } from "./registry-4Q9QHmjA.mjs";
import { r as readAcpSessionMeta } from "./session-meta-DHUOlEoy.mjs";
import { d as formatAcpInheritedToolAllowError, f as formatAcpInheritedToolDenyError, l as findAcpUnsupportedInheritedToolAllow, m as inheritedToolDenyPatch, p as inheritedToolAllowPatch, s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession, u as findAcpUnsupportedInheritedToolDeny } from "./subagent-capabilities-D-LyBU4l.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { O as resolveChannelStreamingProgressCommentary } from "./streaming-BRWehz40.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { a as getInProcessGatewayToolContext, c as runWithGatewayToolCleanupContext, r as callInProcessGatewayTool } from "./in-process-gateway-BvSta947.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { c as readGatewayRunId, d as withSubagentGatewayExecutionIdentity, s as callSubagentGateway, u as buildSubagentExecutionSessionSpawnContext } from "./subagent-spawn-cleanup-D8KmXbTW.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { i as scopedHeartbeatWakeOptionsForPolicy, n as resolveEventSessionRoutingPolicy, t as resolveEventSessionKeyForPolicy } from "./event-session-routing-Dc7D6ZvV.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.mjs";
import { n as resolveAcpAgentPolicyError, t as isAcpEnabledByPolicy } from "./policy-DEGknwt4.mjs";
import { t as isHeartbeatEnabledForAgent } from "./heartbeat-summary-BwKUEkLt.mjs";
import { a as resolveSubagentThinkingOverride, c as prepareSpawnThreadBinding, d as resolveSpawnMode, f as resolveSpawnSandboxError, g as readParentExecutionIdentity, h as summarizeSpawnError, i as splitModelRef, l as resolveSpawnAdmission, m as runSpawnPipeline, n as resolveConfiguredSubagentRunTimeoutSeconds, o as resolveRequesterOriginForChild, p as reserveChildAdmissionSlot, s as mintSpawnSessionKey, t as resolveSubagentSpawnOwnership, u as resolveSpawnChannelAccountId } from "./subagent-spawn-ownership-C_WwqdIP.mjs";
import { n as formatConversationTarget, t as deliveryContextFromConversation } from "./route-projection-B6UquOhV.mjs";
import { t as recordSessionParticipantBestEffort } from "./session-participant-recording-B2ka2tzH.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, s as resolveThreadBindingMaxAgeMsForChannel } from "./thread-bindings-policy-BbWqcnDl.mjs";
import { t as recordSessionCreated } from "./session-created-lHTOLS92.mjs";
import { i as resolveSpawnedWorkspaceInheritance } from "./spawned-context-sV3cxQP9.mjs";
import { i as resolveThreadBindingThreadName, r as resolveThreadBindingIntroText } from "./thread-bindings-messages-Br2Pei4z.mjs";
import { n as resolveAcpProjectionSettings, t as isAcpTagVisible } from "./acp-stream-settings-CCpaXah7.mjs";
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
		if (!deletionStarted && params.closeRuntimeOnFailure) await runExclusiveSessionLifecycleMutation({
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
function isActiveTaskStatus(status) {
	return status === "queued" || status === "running";
}
function countUntrackedActiveAcpRunsForOwner(ownerKey, pendingChildSessionKeys) {
	const normalizedOwnerKey = normalizeOptionalString(ownerKey);
	if (!normalizedOwnerKey) return 0;
	const tasks = listTasksForOwnerKey(normalizedOwnerKey);
	const trackedChildSessionKeys = new Set(tasks.filter((task) => task.runtime === "subagent" && isActiveTaskStatus(task.status) && normalizeOptionalString(task.childSessionKey)).map((task) => normalizeOptionalString(task.childSessionKey)));
	return new Set(tasks.flatMap((task) => {
		const childSessionKey = normalizeOptionalString(task.childSessionKey);
		const trackedRun = childSessionKey ? getSubagentRunByChildSessionKey(childSessionKey) : null;
		const hasActiveRegistryRun = Boolean(trackedRun && typeof trackedRun.execution.endedAt !== "number");
		return task.runtime === "acp" && isActiveTaskStatus(task.status) && childSessionKey !== void 0 && !pendingChildSessionKeys?.has(childSessionKey) && !hasActiveRegistryRun && !trackedChildSessionKeys.has(childSessionKey) ? [childSessionKey] : [];
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
function getAcpParentStreamKysely(database) {
	return getNodeSqliteKysely(database);
}
/** Records one ordered batch in the same synchronous commit section as sequence allocation. */
function recordAcpParentStreamEvents(options) {
	if (options.events.length === 0) return;
	const prepared = options.events.flatMap((entry) => {
		try {
			const eventJson = JSON.stringify(entry.event);
			if (eventJson !== void 0) return [{
				eventJson,
				createdAt: entry.createdAt
			}];
		} catch {}
		return [];
	});
	if (prepared.length === 0) return;
	runOpenClawAgentWriteTransaction((database) => {
		const db = getAcpParentStreamKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("acp_parent_stream_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", options.sessionId).where("run_id", "=", options.runId));
		const firstSeq = row?.max_seq === null || row?.max_seq === void 0 ? 0 : coerceRequiredSqliteNumber(row.max_seq) + 1;
		executeSqliteQuerySync(database.db, db.insertInto("acp_parent_stream_events").values(prepared.map((entry, index) => ({
			session_id: options.sessionId,
			run_id: options.runId,
			seq: firstSeq + index,
			event_json: entry.eventJson,
			created_at: entry.createdAt
		}))));
	}, options);
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-parent-stream.ts
/** Relays child ACP session stream updates back into the requester parent session. */
const DEFAULT_STREAM_FLUSH_MS = 2500;
const DEFAULT_NO_OUTPUT_NOTICE_MS = 6e4;
const DEFAULT_NO_OUTPUT_POLL_MS = 15e3;
const DEFAULT_MAX_RELAY_LIFETIME_MS = 216e5;
const STREAM_BUFFER_MAX_CHARS = 4e3;
const STREAM_SNIPPET_MAX_CHARS = 220;
const STREAM_LOG_BATCH_SIZE = 100;
const STREAM_LOG_FLUSH_MS = 1e3;
const STREAM_LOG_MAX_PENDING_EVENTS = 256;
const STREAM_LOG_MAX_RETRY_MS = 3e4;
const log$1 = createSubsystemLogger("agents/acp-parent-stream");
function compactWhitespace(value) {
	return value.replace(/\s+/g, " ").trim();
}
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((item) => typeof item === "string" && item.length > 0);
}
function formatProxyEnvSummary(keys) {
	if (keys.length === 0) return "proxy env: none";
	return `proxy env: ${keys.join(", ")}`;
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
function mergeStreamingEntry(base, override) {
	if (!override) return base;
	return {
		...base,
		...override,
		streaming: mergeStreamingConfig(base.streaming, override.streaming)
	};
}
function resolveParentProgressStreamingEntry(params) {
	const channelId = normalizeOptionalString(params.deliveryContext?.channel);
	if (!params.cfg || !channelId) return;
	const channelCfg = params.cfg.channels?.[channelId];
	if (!channelCfg) return;
	return mergeStreamingEntry(channelCfg, resolveChannelAccountEntry(channelCfg.accounts, normalizeAccountId(params.deliveryContext?.accountId), channelId, normalizeAccountId));
}
function resolveParentProgressCommentary(params) {
	return resolveChannelStreamingProgressCommentary(resolveParentProgressStreamingEntry(params), true);
}
function shouldRelayAcpStatusProgress(params) {
	if (params.eventType !== "status" || !params.text) return false;
	return isAcpTagVisible(params.projectionSettings, params.tag);
}
/** Starts a bounded parent-session relay for child ACP output and progress notices. */
function startAcpSpawnParentStreamRelay(params) {
	const runId = normalizeOptionalString(params.runId) ?? "";
	const parentSessionKey = normalizeOptionalString(params.parentSessionKey) ?? "";
	if (!runId || !parentSessionKey) return {
		dispose: () => {},
		notifyStarted: () => {}
	};
	const streamFlushMs = typeof params.streamFlushMs === "number" && Number.isFinite(params.streamFlushMs) ? Math.max(0, Math.floor(params.streamFlushMs)) : DEFAULT_STREAM_FLUSH_MS;
	const noOutputNoticeMs = typeof params.noOutputNoticeMs === "number" && Number.isFinite(params.noOutputNoticeMs) ? Math.max(0, Math.floor(params.noOutputNoticeMs)) : DEFAULT_NO_OUTPUT_NOTICE_MS;
	const noOutputPollMs = typeof params.noOutputPollMs === "number" && Number.isFinite(params.noOutputPollMs) ? Math.max(250, Math.floor(params.noOutputPollMs)) : DEFAULT_NO_OUTPUT_POLL_MS;
	const maxRelayLifetimeMs = typeof params.maxRelayLifetimeMs === "number" && Number.isFinite(params.maxRelayLifetimeMs) ? Math.max(1e3, Math.floor(params.maxRelayLifetimeMs)) : DEFAULT_MAX_RELAY_LIFETIME_MS;
	const relayLabel = truncateUtf16WithEllipsis(compactWhitespace(params.agentId), 40) || "ACP child";
	const contextPrefix = `acp-spawn:${runId}`;
	const childSessionId = normalizeOptionalString(params.childSessionId);
	const stateEnv = { ...params.env ?? process.env };
	const pendingLogEvents = [];
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
			log$1.warn("Capped ACP parent stream diagnostic buffer", {
				runId,
				childSessionId,
				maxPendingEvents: STREAM_LOG_MAX_PENDING_EVENTS
			});
			logBufferWarned = true;
		}
	};
	const clearLogFlushTimer = () => {
		if (!logFlushTimer) return;
		clearTimeout(logFlushTimer);
		logFlushTimer = void 0;
	};
	function flushLogEvents(options = {}) {
		clearLogFlushTimer();
		if (!childSessionId || pendingLogEvents.length === 0) return;
		const events = pendingLogEvents.splice(0);
		try {
			recordAcpParentStreamEvents({
				agentId: params.agentId,
				env: stateEnv,
				sessionId: childSessionId,
				runId,
				events
			});
			logFailureWarned = false;
			logBufferWarned = false;
			consecutiveLogFailures = 0;
		} catch (error) {
			if (!options.terminal) {
				pendingLogEvents.unshift(...events);
				capPendingLogEvents();
				consecutiveLogFailures += 1;
				scheduleLogFlush(Math.min(STREAM_LOG_FLUSH_MS * 2 ** consecutiveLogFailures, STREAM_LOG_MAX_RETRY_MS));
			}
			if (!logFailureWarned || options.terminal) {
				log$1.warn("Failed to persist ACP parent stream diagnostics", {
					runId,
					childSessionId,
					retrying: !options.terminal,
					error: String(error)
				});
				logFailureWarned = true;
			}
		}
	}
	function scheduleLogFlush(delayMs = STREAM_LOG_FLUSH_MS) {
		if (disposed || logFlushTimer || pendingLogEvents.length === 0) return;
		logFlushTimer = setTimeout(() => flushLogEvents(), delayMs);
		logFlushTimer.unref?.();
	}
	const logEvent = (kind, fields) => {
		if (!childSessionId) return;
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
	const shouldSurfaceUpdates = params.surfaceUpdates !== false;
	const shouldRelayProgressCommentary = resolveParentProgressCommentary({
		cfg: params.cfg,
		deliveryContext: params.deliveryContext
	});
	const acpProjectionSettings = resolveAcpProjectionSettings(params.cfg ?? {});
	const eventRouting = params.eventRouting ?? {
		mainKey: params.mainKey,
		sessionScope: params.sessionScope
	};
	const wake = () => {
		if (!shouldSurfaceUpdates) return;
		requestSessionEventWake(scopedHeartbeatWakeOptionsForPolicy(parentSessionKey, {
			source: "acp-spawn",
			intent: "event",
			reason: "acp:spawn:stream"
		}, eventRouting));
	};
	const emit = (text, contextKey) => {
		const cleaned = text.trim();
		if (!cleaned) return;
		logEvent("system_event", {
			contextKey,
			text: cleaned
		});
		if (!shouldSurfaceUpdates) return;
		enqueueSystemEvent(cleaned, {
			sessionKey: resolveSystemEventQueueKey(resolveEventSessionKeyForPolicy(parentSessionKey, eventRouting), resolveAgentIdFromSessionKey(parentSessionKey, params.requesterAgentId)),
			contextKey,
			deliveryContext: params.deliveryContext
		});
		wake();
	};
	const emitStartNotice = () => {
		recordTaskRunProgressByRunId({
			runId,
			runtime: "acp",
			sessionKey: params.childSessionKey,
			lastEventAt: Date.now(),
			eventSummary: "Started."
		});
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
	let relayLifetimeTimer;
	const clearFlushTimer = () => {
		if (!flushTimer) return;
		clearTimeout(flushTimer);
		flushTimer = void 0;
	};
	const clearRelayLifetimeTimer = () => {
		if (!relayLifetimeTimer) return;
		clearTimeout(relayLifetimeTimer);
		relayLifetimeTimer = void 0;
	};
	const flushPending = () => {
		clearFlushTimer();
		if (!pendingText) return;
		const snippet = truncateUtf16WithEllipsis(compactWhitespace(pendingText), STREAM_SNIPPET_MAX_CHARS);
		pendingText = "";
		pendingProgressKind = void 0;
		if (!snippet) return;
		emit(`${relayLabel}: ${snippet}`, `${contextPrefix}:progress`);
	};
	const scheduleFlush = () => {
		if (disposed || flushTimer || streamFlushMs <= 0) return;
		flushTimer = setTimeout(() => {
			flushPending();
		}, streamFlushMs);
		flushTimer.unref?.();
	};
	const appendVisibleProgress = (delta, kind) => {
		if (stallNotified) {
			stallNotified = false;
			recordTaskRunProgressByRunId({
				runId,
				runtime: "acp",
				sessionKey: params.childSessionKey,
				lastEventAt: Date.now(),
				eventSummary: "Resumed output."
			});
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
		const seconds = Math.round(noOutputNoticeMs / 1e3);
		if (!promptSubmittedAt) return {
			summary: `No prompt submission observed for ${seconds}s after child start.`,
			text: `${relayLabel} session started but no prompt submission was observed for ${seconds}s.`
		};
		if (!firstRuntimeEventAt) {
			const proxySummary = formatProxyEnvSummary(proxyEnvKeysAtPrompt);
			return {
				summary: `Prompt submitted but no ACP runtime event for ${seconds}s (${proxySummary}).`,
				text: `${relayLabel} prompt was submitted but no ACP runtime event arrived for ${seconds}s (${proxySummary}). Check upstream connectivity, auth, or proxy/network access in the gateway child environment.`
			};
		}
		if (!firstVisibleOutputAt) {
			const lastEvent = lastRuntimeEventType ? ` Last ACP event: ${lastRuntimeEventType}.` : "";
			return {
				summary: `ACP runtime active but no visible assistant output for ${seconds}s.${lastEvent}`,
				text: `${relayLabel} has ACP runtime activity but no visible assistant output for ${seconds}s.${lastEvent} It may be working, blocked on a tool, or failing before visible output.`
			};
		}
		return {
			summary: `No visible output for ${seconds}s. It may be waiting for input.`,
			text: `${relayLabel} has produced no visible output for ${seconds}s. It may be waiting for interactive input.`
		};
	};
	const noOutputWatcherTimer = setInterval(() => {
		if (disposed || noOutputNoticeMs <= 0) return;
		if (stallNotified) return;
		if (Date.now() - lastProgressAt < noOutputNoticeMs) return;
		stallNotified = true;
		const notice = buildNoOutputNotice();
		recordTaskRunProgressByRunId({
			runId,
			runtime: "acp",
			sessionKey: params.childSessionKey,
			lastEventAt: Date.now(),
			eventSummary: notice.summary
		});
		emit(notice.text, `${contextPrefix}:stall`);
	}, noOutputPollMs);
	noOutputWatcherTimer.unref?.();
	relayLifetimeTimer = setTimeout(() => {
		if (disposed) return;
		emit(`${relayLabel} stream relay timed out after ${Math.max(1, Math.round(maxRelayLifetimeMs / 1e3))}s without completion.`, `${contextPrefix}:timeout`);
		dispose();
	}, maxRelayLifetimeMs);
	relayLifetimeTimer.unref?.();
	if (params.emitStartNotice !== false) emitStartNotice();
	const unsubscribe = onAgentEventForRun(runId, (event) => {
		if (disposed || event.runId !== runId) return;
		if (event.stream === "assistant") {
			const data = event.data;
			const assistantPhase = normalizeAssistantPhase(data?.phase);
			const textCandidate = data?.text;
			const deltaCandidate = data?.delta;
			const snapshot = typeof textCandidate === "string" ? textCandidate : typeof deltaCandidate === "string" ? deltaCandidate : void 0;
			if (data?.replaceable === true) {
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
				if (shouldRelayProgressCommentary && shouldRelayAcpStatusProgress({
					eventType,
					tag,
					text,
					projectionSettings: acpProjectionSettings
				})) {
					appendVisibleProgress(`${text}\n\n`, "acp:status");
					return;
				}
				lastProgressAt = Date.now();
				return;
			}
			return;
		}
		if (event.stream !== "lifecycle") return;
		const phase = normalizeOptionalString(event.data?.phase);
		logEvent("lifecycle", {
			phase: phase ?? "unknown",
			data: event.data
		});
		if (phase === "end") {
			flushReplaceableAssistantSnapshot();
			flushPending();
			const startedAt = asFiniteNumber(event.data?.startedAt);
			const endedAt = asFiniteNumber(event.data?.endedAt);
			const durationMs = startedAt != null && endedAt != null && endedAt >= startedAt ? endedAt - startedAt : void 0;
			if (durationMs != null) emit(`${relayLabel} run completed in ${Math.max(1, Math.round(durationMs / 1e3))}s.`, `${contextPrefix}:done`);
			else emit(`${relayLabel} run completed.`, `${contextPrefix}:done`);
			dispose();
			return;
		}
		if (phase === "error") {
			flushReplaceableAssistantSnapshot();
			flushPending();
			const errorText = normalizeOptionalString(event.data?.error);
			if (errorText) emit(`${relayLabel} run failed: ${errorText}`, `${contextPrefix}:error`);
			else emit(`${relayLabel} run failed.`, `${contextPrefix}:error`);
			dispose();
		}
	});
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		clearFlushTimer();
		flushLogEvents({ terminal: true });
		clearRelayLifetimeTimer();
		clearInterval(noOutputWatcherTimer);
		unsubscribe();
	};
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
	const heartbeatEvery = resolveAgentConfig(params.cfg, requesterAgentId)?.heartbeat?.every ?? params.cfg.agents?.defaults?.heartbeat?.every ?? "30m";
	const trimmedEvery = normalizeOptionalString(heartbeatEvery) ?? "";
	if (!trimmedEvery) return false;
	try {
		return parseDurationMs(trimmedEvery, { defaultUnit: "m" }) > 0;
	} catch {
		return false;
	}
}
function resolveHeartbeatConfigForAgent(params) {
	const defaults = params.cfg.agents?.defaults?.heartbeat;
	const overrides = resolveAgentConfig(params.cfg, params.agentId)?.heartbeat;
	if (!defaults && !overrides) return;
	return {
		...defaults,
		...overrides
	};
}
function hasSessionLocalHeartbeatRelayRoute(params) {
	if ((params.cfg.session?.scope ?? "per-sender") === "global") return false;
	const heartbeat = resolveHeartbeatConfigForAgent({
		cfg: params.cfg,
		agentId: params.requesterAgentId
	});
	if ((heartbeat?.target ?? "none") !== "last") return false;
	if (normalizeOptionalString(heartbeat?.to)) return false;
	if (normalizeOptionalString(heartbeat?.accountId)) return false;
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
const log = createSubsystemLogger("agents/acp-spawn");
function resolveRequesterInternalSessionKey(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	return requesterSessionKey ? resolveInternalSessionKey({
		key: requesterSessionKey,
		alias,
		mainKey
	}) : alias;
}
async function persistAcpSpawnSessionFileBestEffort(params) {
	try {
		const resolvedSessionFile = await resolveSessionTranscriptRuntimeTarget({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			agentId: params.agentId,
			threadId: params.threadId
		});
		return loadSessionEntryReadOnly({
			storePath: params.storePath,
			sessionKey: resolvedSessionFile.sessionKey,
			clone: false
		}) ?? params.sessionEntry;
	} catch (error) {
		log.warn(`ACP session-file persistence failed during ${params.stage} for ${params.sessionKey}: ${formatErrorMessage(error)}`);
		return params.sessionEntry;
	}
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
function sessionEntryMatchesAcpResumeSessionId(acp, resumeSessionId) {
	const identity = acp?.identity;
	return normalizeOptionalString(identity?.agentSessionId) === resumeSessionId || normalizeOptionalString(identity?.acpxSessionId) === resumeSessionId;
}
function sessionEntryIsOwnedByRequester(params) {
	return params.sessionKey === params.requesterSessionKey || normalizeOptionalString(params.entry?.spawnedBy) === params.requesterSessionKey || normalizeOptionalString(params.entry?.parentSessionKey) === params.requesterSessionKey;
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
		if (configuredBackend && normalizeOptionalLowercaseString(acp?.backend) !== configuredBackend || !sessionEntryMatchesAcpResumeSessionId(acp, resumeSessionId)) continue;
		if (sessionEntryIsOwnedByRequester({
			sessionKey,
			entry,
			requesterSessionKey
		})) return { ok: true };
		break;
	}
	return {
		ok: false,
		error: "sessions_spawn resumeSessionId is only allowed for ACP sessions previously recorded for this requester. Omit resumeSessionId to start a fresh ACP session."
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-result.ts
function createAcpSpawnFailure(params) {
	return {
		status: params.status,
		errorCode: params.errorCode,
		error: params.error,
		...params.childSessionKey ? { childSessionKey: params.childSessionKey } : {},
		...params.runId ? { runId: params.runId } : {}
	};
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-runtime.ts
const ACP_RUNTIME_TIMEOUT_MAX_SECONDS = 86400;
function resolveAcpSessionMode(mode) {
	return mode === "session" ? "persistent" : "oneshot";
}
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
function resolveAcpRuntimeTimeoutSeconds(runTimeoutSeconds) {
	if (!runTimeoutSeconds) return;
	return Math.min(runTimeoutSeconds, ACP_RUNTIME_TIMEOUT_MAX_SECONDS);
}
function resolveAcpSpawnRuntimeOptions(params) {
	const policyAgentId = params.configAgentId ?? params.targetAgentId;
	const modelExplicit = normalizeOptionalString(params.model) !== void 0;
	const thinkingExplicit = normalizeOptionalString(params.thinking) !== void 0;
	const rawModel = resolveConfiguredSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: policyAgentId,
		modelOverride: params.model
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
	const timeoutSeconds = resolveAcpRuntimeTimeoutSeconds(params.runTimeoutSeconds);
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
	let sessionEntry = loadSessionEntry({
		storePath,
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId,
		clone: false
	});
	const sessionId = sessionEntry?.sessionId;
	if (sessionId) sessionEntry = await persistAcpSpawnSessionFileBestEffort({
		sessionId,
		sessionKey: params.sessionKey,
		storePath,
		sessionEntry,
		agentId: params.targetAgentId,
		stage: "spawn"
	});
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
		sessionEntry,
		storePath
	};
}
async function bindPreparedAcpThread(params) {
	const binding = await getSessionBindingService().bind({
		targetSessionKey: params.sessionKey,
		targetKind: "session",
		conversation: {
			channel: params.preparedBinding.channel,
			accountId: params.preparedBinding.accountId,
			conversationId: params.preparedBinding.conversationId,
			...params.preparedBinding.parentConversationId ? { parentConversationId: params.preparedBinding.parentConversationId } : {}
		},
		placement: params.preparedBinding.placement,
		metadata: {
			threadName: resolveThreadBindingThreadName({
				agentId: params.targetAgentId,
				label: params.label || params.targetAgentId
			}),
			agentId: params.targetAgentId,
			label: params.label || void 0,
			boundBy: "system",
			introText: resolveThreadBindingIntroText({
				agentId: params.targetAgentId,
				label: params.label || void 0,
				idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel({
					cfg: params.cfg,
					channel: params.preparedBinding.channel,
					accountId: params.preparedBinding.accountId
				}),
				maxAgeMs: resolveThreadBindingMaxAgeMsForChannel({
					cfg: params.cfg,
					channel: params.preparedBinding.channel,
					accountId: params.preparedBinding.accountId
				}),
				sessionCwd: resolveAcpSessionCwd(params.initializedRuntime.initialized.meta),
				sessionDetails: resolveAcpThreadSessionDetailLines({
					sessionKey: params.sessionKey,
					meta: params.initializedRuntime.initialized.meta
				})
			})
		}
	});
	params.assertActive?.();
	if (!binding.conversation.conversationId) throw new Error(params.preparedBinding.placement === "child" ? `Failed to create and bind a ${params.preparedBinding.channel} thread for this ACP session.` : `Failed to bind the current ${params.preparedBinding.channel} conversation for this ACP session.`);
	let sessionEntry = params.initializedRuntime.sessionEntry;
	if (params.initializedRuntime.sessionId && params.preparedBinding.placement === "child") {
		const boundThreadId = normalizeOptionalString(binding.conversation.conversationId);
		if (boundThreadId) sessionEntry = await persistAcpSpawnSessionFileBestEffort({
			sessionId: params.initializedRuntime.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.initializedRuntime.storePath,
			sessionEntry,
			agentId: params.targetAgentId,
			threadId: boundThreadId,
			stage: "thread-bind"
		});
	}
	return {
		binding,
		sessionEntry
	};
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
/** Implements ACP subagent/session spawning, binding, limits, and parent-stream setup. */
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
	if (!isAcpEnabledByPolicy(cfg)) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "acp_disabled",
		error: "ACP is disabled by policy (`acp.enabled=false`)."
	});
	const streamToParentRequested = params.streamTo === "parent";
	const parentSessionKey = normalizeOptionalString(ctx.agentSessionKey);
	if (streamToParentRequested && !parentSessionKey) return createAcpSpawnFailure({
		status: "error",
		errorCode: "requester_session_required",
		error: "sessions_spawn streamTo=\"parent\" requires an active requester session context."
	});
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
	if (runtimePolicyError) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "runtime_policy",
		error: runtimePolicyError
	});
	const acpUnsupportedInheritedTool = findAcpUnsupportedInheritedToolDeny(ctx.inheritedToolDenylist);
	if (acpUnsupportedInheritedTool) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "runtime_policy",
		error: formatAcpInheritedToolDenyError(acpUnsupportedInheritedTool)
	});
	const acpUnsupportedInheritedAllow = findAcpUnsupportedInheritedToolAllow(ctx.inheritedToolAllowlist);
	if (acpUnsupportedInheritedAllow) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "runtime_policy",
		error: formatAcpInheritedToolAllowError(acpUnsupportedInheritedAllow)
	});
	const spawnMode = resolveSpawnMode({
		requestedMode: params.mode,
		threadRequested: requestThreadBinding
	});
	if (spawnMode === "session" && !requestThreadBinding) return createAcpSpawnFailure({
		status: "error",
		errorCode: "thread_required",
		error: "sessions_spawn(runtime=\"acp\", mode=\"session\") requires thread=true so the ACP session can stay bound to a channel thread. Retry with { mode: \"session\", thread: true } on a channel that exposes threads (e.g. Discord, Slack, Telegram topics), or use mode=\"run\" for one-shot work."
	});
	const targetAgentResult = resolveTargetAcpAgentId({
		requestedAgentId: params.agentId,
		cfg
	});
	if (!targetAgentResult.ok) return createAcpSpawnFailure({
		status: "error",
		errorCode: params.agentId && normalizeOptionalAgentId(params.agentId) ? "runtime_agent_mismatch" : "target_agent_required",
		error: targetAgentResult.error
	});
	const { agentId: targetAgentId, backendId } = targetAgentResult;
	const agentPolicyError = resolveAcpAgentPolicyError(cfg, targetAgentId);
	if (agentPolicyError) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "agent_forbidden",
		error: agentPolicyError.message
	});
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
	const requesterTarget = resolveGatewaySessionStoreTarget({
		cfg,
		key: ownership.completionRequesterSessionKey,
		agentId: ctx.requesterAgentIdOverride
	});
	const completionRequesterSessionId = loadSessionEntryReadOnly({
		storePath: requesterTarget.storePath,
		sessionKey: requesterTarget.canonicalKey,
		clone: false
	})?.sessionId;
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
	const rejectSubagentPolicy = (error) => createAcpSpawnFailure({
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
	if (!resumeAuthorization.ok) return createAcpSpawnFailure({
		status: "forbidden",
		errorCode: "resume_forbidden",
		error: resumeAuthorization.error
	});
	const runtimeOptionsResult = resolveAcpSpawnRuntimeOptions({
		cfg,
		targetAgentId,
		configAgentId: targetAgentResult.configAgentId,
		model: params.model,
		thinking: params.thinking,
		runTimeoutSeconds
	});
	if (!runtimeOptionsResult.ok) return createAcpSpawnFailure({
		status: "error",
		errorCode: "spawn_failed",
		error: runtimeOptionsResult.error
	});
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
	const runtimeMode = resolveAcpSessionMode(spawnMode);
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
		return createAcpSpawnFailure({
			status: "error",
			errorCode: "cwd_resolution_failed",
			error: formatErrorMessage(error)
		});
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
		if (!prepared.ok) return createAcpSpawnFailure({
			status: "error",
			errorCode: "thread_binding_invalid",
			error: prepared.error
		});
		preparedBinding = prepared.binding;
	}
	let childCreationEntry;
	let closeRuntimeOnFailure;
	const childIdem = crypto.randomUUID();
	const parentAgentId = parentSessionKey ? resolveAgentIdFromSessionKey(parentSessionKey, requesterAgentId) : void 0;
	const parentDeliveryCtx = effectiveStreamToParent && parentSessionKey ? deliveryContextFromSession(loadSessionEntryReadOnly({
		sessionKey: parentSessionKey,
		...parentAgentId ? { agentId: parentAgentId } : {},
		clone: false
	})) : void 0;
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
			const creationStamp = buildSessionCreationStamp({
				via: "spawn",
				actor: {
					type: "agent",
					id: requesterAgentId
				}
			});
			const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: targetAgentId });
			const childSessionPatch = admission.childSessionPatch ? {
				spawnDepth: admission.childSessionPatch.spawnDepth,
				...admission.childSessionPatch.subagentRole ? { subagentRole: admission.childSessionPatch.subagentRole } : {},
				subagentControlScope: admission.childSessionPatch.subagentControlScope
			} : {};
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
				...params.label ? { label: params.label } : {}
			}, { assertCommitAllowed: ctx.assertActive }) ?? void 0;
			const initializedSession = await initializeAcpSpawnRuntime({
				assertActive: ctx.assertActive,
				cfg,
				sessionKey,
				targetAgentId,
				runtimeMode,
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
				binding: preparedBinding ? (await bindPreparedAcpThread({
					assertActive: ctx.assertActive,
					cfg,
					sessionKey,
					targetAgentId,
					label: params.label,
					preparedBinding,
					initializedRuntime: initializedSession
				})).binding : null
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
			if (childCreationEntry) recordSessionCreated(cfg, {
				sessionKey,
				agentId: targetAgentId,
				entry: childCreationEntry
			});
			recordSubagentSpawned({
				childSessionKey: sessionKey,
				childRunId: childIdem,
				requesterSessionKey: requesterInternalKey,
				agentId: targetAgentId
			});
			const startParentRelay = (runId) => effectiveStreamToParent && parentSessionKey ? startAcpSpawnParentStreamRelay({
				runId,
				parentSessionKey,
				requesterAgentId,
				childSessionKey: sessionKey,
				childSessionId: state.initializedSession.sessionId,
				agentId: targetAgentId,
				env: parentRelayStateEnv,
				mainKey: cfg.session?.mainKey,
				sessionScope: cfg.session?.scope,
				eventRouting: parentEventRouting,
				deliveryContext: parentDeliveryCtx,
				emitStartNotice: false,
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
			state?.parentRelay?.dispose();
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
				requesterSessionKey: ownership.completionRequesterSessionKey,
				completionRequesterSessionId,
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
				spawnMode,
				taskRowOwnership: "gateway_best_effort"
			};
		}
	});
	if (!pipelineResult.ok) {
		if (pipelineResult.phase === "initialize") return createAcpSpawnFailure({
			status: "error",
			errorCode: isSessionBindingError(pipelineResult.error) ? "thread_binding_invalid" : "spawn_failed",
			error: isSessionBindingError(pipelineResult.error) ? pipelineResult.error.message : summarizeSpawnError(pipelineResult.error)
		});
		if (pipelineResult.phase === "dispatch") return createAcpSpawnFailure({
			status: "error",
			errorCode: "dispatch_failed",
			error: summarizeSpawnError(pipelineResult.error),
			childSessionKey: sessionKey
		});
		return createAcpSpawnFailure({
			status: "error",
			errorCode: "spawn_failed",
			error: `Failed to register ACP run: ${summarizeSpawnError(pipelineResult.error)}. Cleanup was attempted, but the already-started ACP run may still finish in the background.`,
			childSessionKey: sessionKey,
			runId: pipelineResult.runId
		});
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
