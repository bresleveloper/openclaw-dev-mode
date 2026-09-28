import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { C as summarizeRestartSentinel, h as readRestartSentinel, i as clearRestartSentinelIfRevision, l as formatRestartSentinelMessage, s as finalizeUpdateRestartSentinelRunningVersion } from "./restart-sentinel-KM6PPxhT.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { a as mergeDeliveryContext, s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { a as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { t as finishUpdateRun } from "./update-run-write-cd5VZ7fL.mjs";
import { f as recordUpdateRunPhase, g as recordUpdateRunVerification } from "./update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-MlBhwaKa.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-De-bcoks.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { a as renderUpdateRunReport, c as updateRunReportInputFromSentinel } from "./update-run-report-Dh57tzMI.mjs";
import { a as hasRestartRecoveryTerminalRun, n as getRestartRecoveryTerminalDeliveryEvidence } from "./restart-recovery-state-CVOwSXMV.mjs";
import { d as resolveDurableCompletionDeliveryMode } from "./task-notification-routing-D8Ldlzcz.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DEj31pAK.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { s as getMediaDir } from "./store-BrX2xbJz.mjs";
import { n as dispatchGatewayLifecycleMethod } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcherCore } from "./provider-dispatcher-8xmnSjpI.mjs";
import { B as recoverPendingSessionDeliveries, z as drainPendingSessionDelivery } from "./subagent-completion-admission.store-C-FTAVQX.mjs";
import { a as SessionDeliveryDeferredError, i as SessionDeliveryDeadLetteredError, o as SessionDeliveryRetryChargedError, s as SessionDeliverySafeRetryError } from "./session-delivery-queue.records-rYJIeHGW.mjs";
import { a as enqueueSessionDelivery, d as mergeSessionDeliveryPreparedMediaBlocks, l as markSessionDeliveryAttemptStarted, o as failSessionDelivery, r as deferSessionDelivery, t as advanceSessionDeliveryAgentRun, u as markSessionDeliverySettlement } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
import { r as hasExplicitlyVisibleAgentPayload } from "./message-visibility-yTJ46I8l.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as recordInboundSession } from "./session-oascTmim.mjs";
import { a as formatGeneratedMediaDeliveryRetryForPrompt, n as buildGeneratedMediaDeliveryContext } from "./internal-events-CfvyIQfQ.mjs";
import { a as getAgentCommandDeliveryFailure, d as hasCompleteAutomaticMediaDeliveryOutcomeEvidence, l as hasCommittedOutboundDeliveryEvidence, n as collectAutomaticDeliveredMediaUrls, r as collectDeliveredMediaUrls, s as getGatewayAgentResult, t as collectAmbiguousAutomaticMediaUrls } from "./delivery-evidence-B9fCOuaI.mjs";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-BrCOTs7N.mjs";
import { a as settleCorrelatedSubagentDelivery, r as resolveCorrelatedSubagentDelivery } from "./subagent-completion-delivery-miBR4hhO.mjs";
import "./get-reply-run-queue-Bmv2zHLu.mjs";
import { n as dispatchAssembledChannelTurn } from "./lifecycle-D3df2FJy.mjs";
import { t as runStartupTasks } from "./startup-tasks-CW4c6ut8.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-DpVNPpqg.mjs";
import { i as attachManagedOutgoingMediaToMessage, s as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-Ij6S9piG.mjs";
import { a as enqueueRestartSentinelNotice, i as deliverRestartSentinelNotice, n as recordUpdateRunNoticeSkipped, r as resolveUpdateRunNoticeTarget } from "./update-run-notice-target-Dr-5Fp2x.mjs";
//#region src/gateway/server-restart-sentinel-agent-delivery.ts
const log$1 = createSubsystemLogger("gateway/restart-sentinel");
const AGENT_DELIVERY_OWNERSHIP_RETRY_MS = 1e3;
async function deadLetterSessionDelivery(entry, reason, queueContext) {
	await markSessionDeliverySettlement(entry, "moved-to-failed", queueContext);
	log$1.warn("queued session delivery requires durable dead-letter settlement", { queueId: entry.id });
	throw new SessionDeliveryDeadLetteredError(reason);
}
function hasQueuedVisibleAgentPayload(result) {
	return Array.isArray(result.payloads) && result.payloads.some(hasExplicitlyVisibleAgentPayload);
}
function hasUnexpectedRecoverySideEffects(result) {
	return result.restartUnsafeSideEffectsDetected === true || result.messagingToolAggregateEvidenceUnaccounted === true || result.messagingToolSentTargetsTruncated === true || result.didSendDeterministicApprovalPrompt === true || hasCommittedOutboundDeliveryEvidence(result);
}
function resolveQueuedAgentRunId(entry) {
	const base = entry.idempotencyKey ?? entry.messageId;
	return entry.agentRunAttempt ? `${base}:attempt:${entry.agentRunAttempt}` : base;
}
function collectVisiblePayloadMediaUrls(result) {
	const urls = /* @__PURE__ */ new Set();
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	for (const payload of payloads) {
		if (!hasExplicitlyVisibleAgentPayload(payload)) continue;
		for (const url of collectDeliveredMediaUrls({ payloads: [payload] })) urls.add(url);
	}
	return Array.from(urls);
}
function collectQueuedDeliveredMediaUrls(params) {
	if (params.route.channel === "webchat") return collectVisiblePayloadMediaUrls(params.result);
	return collectAutomaticDeliveredMediaUrls(params.result);
}
function hasAutomaticVisibleSendEvidence(result) {
	if (result.deliveryStatus?.status === "sent" || result.deliveryStatus?.status === "suppressed") return hasQueuedVisibleAgentPayload(result);
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	return (Array.isArray(result.deliveryStatus?.payloadOutcomes) ? result.deliveryStatus.payloadOutcomes : []).some((outcome) => {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) return false;
		const record = outcome;
		if (record.status !== "sent" && record.status !== "suppressed" && record.sentBeforeError !== true) return false;
		const index = typeof record.index === "number" && Number.isInteger(record.index) ? record.index : void 0;
		return index !== void 0 && hasExplicitlyVisibleAgentPayload(payloads[index]);
	});
}
function hasQueuedVisibleReplyEvidence(params) {
	if (params.route.channel === "webchat") return hasQueuedVisibleAgentPayload(params.result);
	return hasAutomaticVisibleSendEvidence(params.result);
}
async function evaluateQueuedGeneratedMediaAgentResult(params) {
	if (hasUnexpectedRecoverySideEffects(params.result)) {
		log$1.warn("queued generated-media recovery reported an unexpected committed side effect", { queueId: params.entry.id });
		await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after an unexpected committed side effect", params.queueContext);
	}
	const expectedMediaUrls = params.entry.expectedMediaUrls ?? [];
	const deliveredMediaUrls = new Set(collectQueuedDeliveredMediaUrls(params).map(normalizeMediaReferenceForComparison));
	const isDelivered = (url) => deliveredMediaUrls.has(normalizeMediaReferenceForComparison(url));
	const missingMediaUrls = expectedMediaUrls.filter((url) => !isDelivered(url));
	const provenExpectedMediaUrls = expectedMediaUrls.filter(isDelivered);
	const ambiguousMediaUrls = new Set(collectAmbiguousAutomaticMediaUrls(params.result).map(normalizeMediaReferenceForComparison));
	const deliveryFailure = getAgentCommandDeliveryFailure(params.result);
	const replySatisfied = expectedMediaUrls.length > 0 ? missingMediaUrls.length === 0 : hasQueuedVisibleReplyEvidence(params);
	if (params.result.payloadsTruncated === true && !replySatisfied) {
		log$1.warn("queued generated-media delivery has truncated delivery evidence", { queueId: params.entry.id });
		await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after truncated evidence", params.queueContext);
	}
	if (expectedMediaUrls.length > 0 && missingMediaUrls.length === 0) {
		await params.persistInternalMedia?.(provenExpectedMediaUrls);
		return;
	}
	const rearmAgentRun = async (reason, updates) => {
		const currentAgentRunAttempt = params.entry.agentRunAttempt ?? 0;
		if (!(params.entry.lastChargedAgentRunAttempt === currentAgentRunAttempt)) await failSessionDelivery(params.entry.id, reason, params.queueContext);
		try {
			await advanceSessionDeliveryAgentRun(params.entry.id, updates, params.queueContext);
			await deferSessionDelivery(params.entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, params.queueContext);
		} catch (error) {
			log$1.warn("queued generated-media terminal attempt state transition remains pending", {
				queueId: params.entry.id,
				error: String(error)
			});
			throw new SessionDeliveryRetryChargedError(`${reason}; queue state transition failed after retry charge`);
		}
		throw new SessionDeliveryDeferredError(reason);
	};
	if (deliveryFailure && expectedMediaUrls.length > 0) {
		if (params.result.deliveryStatus?.status === "partial_failed" && !hasCompleteAutomaticMediaDeliveryOutcomeEvidence(params.result, missingMediaUrls) || missingMediaUrls.some((url) => ambiguousMediaUrls.has(normalizeMediaReferenceForComparison(url)))) {
			log$1.warn("queued generated-media delivery has ambiguous attachment side effects", {
				queueId: params.entry.id,
				error: deliveryFailure
			});
			await deadLetterSessionDelivery(params.entry, "queued generated-media delivery dead-lettered after ambiguous side effects", params.queueContext);
		}
	} else if (deliveryFailure) {
		if (hasQueuedVisibleReplyEvidence(params)) {
			log$1.warn("queued generated-media notice may already be visible; refusing duplicate replay", {
				queueId: params.entry.id,
				error: deliveryFailure
			});
			await deadLetterSessionDelivery(params.entry, "queued generated-media notice dead-lettered after a visible partial delivery", params.queueContext);
		}
		await rearmAgentRun(deliveryFailure);
	}
	if (provenExpectedMediaUrls.length > 0) await params.persistInternalMedia?.(provenExpectedMediaUrls);
	if (missingMediaUrls.length > 0) {
		const retryMessage = formatGeneratedMediaDeliveryRetryForPrompt(missingMediaUrls);
		await rearmAgentRun(`queued generated-media agent turn ${missingMediaUrls.length < expectedMediaUrls.length ? "partially missed" : "missed"} expected media: ${missingMediaUrls.join(", ")}`, {
			expectedMediaUrls: missingMediaUrls,
			...missingMediaUrls.length < expectedMediaUrls.length || hasQueuedVisibleReplyEvidence(params) || params.result.deliveryStatus?.status === "partial_failed" ? { suppressTextDelivery: true } : {},
			...retryMessage ? { message: retryMessage } : {}
		});
	}
	if (expectedMediaUrls.length === 0 && !hasQueuedVisibleReplyEvidence(params)) await rearmAgentRun("queued generated-media agent turn completed without a visible reply");
}
/** Runs durable generated-media handoffs through the normal owning-session agent loop. */
async function deliverQueuedGeneratedMediaAgentTurn(params) {
	if (params.entry.kind !== "agentTurn") return false;
	const entry = params.entry;
	const route = entry.route;
	if (!route || entry.inputProvenance?.kind !== "inter_session" || !entry.sourceReplyDeliveryMode) return false;
	params.queueContext.admission.assertCurrent();
	const queuedRunId = resolveQueuedAgentRunId(entry);
	if (resolveDurableCompletionDeliveryMode(entry.sourceReplyDeliveryMode) === "host_owned" && route.channel === "webchat") return await deadLetterSessionDelivery(entry, "queued host-owned generated-media delivery requires an external route", params.queueContext);
	const persistInternalMedia = route.channel === "webchat" && (entry.expectedMediaUrls?.length ?? 0) > 0 ? async (mediaUrls, transcriptRunId) => {
		const sessionId = params.sessionEntry?.sessionId?.trim();
		if (!sessionId) throw new Error("queued internal generated-media delivery has no owning session");
		const stateDir = params.queueContext.environment.OPENCLAW_STATE_DIR;
		const preparedMediaBlocks = { ...entry.preparedMediaBlocks };
		const content = [];
		for (const mediaUrl of mediaUrls) {
			let blocks = preparedMediaBlocks[mediaUrl];
			if (!blocks) {
				const attachment = entry.expectedMediaAttachments?.[mediaUrl];
				blocks = await createManagedOutgoingMediaBlocks({
					sessionKey: params.canonicalKey,
					agentId: params.agentId,
					items: [{
						url: mediaUrl,
						...attachment?.name ? { filename: attachment.name } : {},
						...attachment?.mimeType ? { mimeType: attachment.mimeType } : {},
						trustedLocal: true,
						...attachment?.durationMs !== void 0 ? { durationMs: attachment.durationMs } : {},
						...attachment?.width !== void 0 ? { width: attachment.width } : {},
						...attachment?.height !== void 0 ? { height: attachment.height } : {}
					}],
					stateDir,
					localRoots: [getMediaDir()]
				});
				if (!blocks.some((block) => block.type === "image" || block.type === "audio" || block.type === "video" || block.type === "attachment")) throw new Error("queued internal generated media could not be prepared");
				blocks = await mergeSessionDeliveryPreparedMediaBlocks(entry.id, mediaUrl, blocks, params.queueContext);
				params.queueContext.admission.assertCurrent();
				preparedMediaBlocks[mediaUrl] = blocks;
			}
			content.push(...blocks);
		}
		const scope = {
			agentId: params.agentId,
			sessionKey: params.canonicalKey,
			sessionId,
			storePath: params.storePath
		};
		const expectedLifecycleRevision = params.sessionEntry?.cronRunContinuation?.lifecycleRevision ?? params.sessionEntry?.lifecycleRevision ?? null;
		const { enrichAssistantTranscriptMediaForRun, publishAssistantTranscriptRewrite } = await import("./chat-transcript-persistence-DVTQrRMB.mjs");
		params.queueContext.admission.assertCurrent();
		let enriched = null;
		if (transcriptRunId) try {
			enriched = await enrichAssistantTranscriptMediaForRun({
				scope,
				runId: transcriptRunId,
				expectedLifecycleRevision,
				content,
				mediaUrls
			});
		} catch (error) {
			if (error instanceof SessionTranscriptWriterClaimReboundError) await deadLetterSessionDelivery(entry, "queued internal generated-media delivery lost its owning session", params.queueContext);
			throw error;
		}
		params.queueContext.admission.assertCurrent();
		const appended = enriched ? {
			ok: true,
			messageId: enriched.messageId
		} : await appendAssistantMessageToSessionTranscript({
			agentId: params.agentId,
			sessionKey: params.canonicalKey,
			storePath: params.storePath,
			expectedSessionId: sessionId,
			expectedLifecycleRevision,
			content: [],
			displayContent: content,
			idempotencyKey: `${queuedRunId}:generated-media-transcript`,
			updateMode: "inline"
		});
		if (!appended.ok) {
			if (appended.code === "session-rebound") await deadLetterSessionDelivery(entry, "queued internal generated-media delivery lost its owning session", params.queueContext);
			throw new Error(`queued internal generated-media transcript persistence failed: ${appended.reason}`);
		}
		params.queueContext.admission.assertCurrent();
		if (!attachManagedOutgoingMediaToMessage({
			messageId: appended.messageId,
			blocks: content,
			stateDir
		})) throw new Error("queued internal generated-media artifact attachment failed");
		if (enriched) await publishAssistantTranscriptRewrite({
			scope,
			rewritten: [enriched]
		});
	} : void 0;
	const evaluateResult = async (result, transcriptRunId = queuedRunId) => {
		await evaluateQueuedGeneratedMediaAgentResult({
			entry,
			result,
			route,
			queueContext: params.queueContext,
			...persistInternalMedia ? { persistInternalMedia: (mediaUrls) => persistInternalMedia(mediaUrls, transcriptRunId) } : {}
		});
		return true;
	};
	const terminalEvidence = getRestartRecoveryTerminalDeliveryEvidence(params.sessionEntry, queuedRunId);
	if (terminalEvidence) return await evaluateResult(terminalEvidence, terminalEvidence.transcriptRunId ?? null);
	if (hasRestartRecoveryTerminalRun(params.sessionEntry, queuedRunId)) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered without durable terminal evidence", params.queueContext);
	if (params.sessionEntry?.restartRecoveryDeliverySourceRunId === queuedRunId && Boolean(params.sessionEntry.restartRecoveryDeliveryRunId)) {
		await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, params.queueContext);
		throw new SessionDeliveryDeferredError("queued generated-media agent turn is still owned by agent recovery");
	}
	if (entry.deliveryStartedAt !== void 0) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered after an interrupted unproven attempt", params.queueContext);
	const sourceReplyDeliveryMode = "automatic";
	const cronSessionId = params.sessionEntry?.cronRunContinuation?.lifecycleRevision?.trim() ? params.sessionEntry?.sessionId?.trim() : void 0;
	await markSessionDeliveryAttemptStarted(entry, params.queueContext);
	let accepted = false;
	let response;
	try {
		params.queueContext.admission.assertCurrent();
		response = await dispatchGatewayLifecycleMethod("agent", {
			sessionKey: params.canonicalKey,
			message: entry.message,
			deliver: route.channel !== INTERNAL_MESSAGE_CHANNEL,
			bestEffortDeliver: false,
			channel: route.channel,
			accountId: route.accountId,
			to: route.to,
			threadId: route.threadId,
			...cronSessionId ? { sessionId: cronSessionId } : {},
			inputProvenance: entry.inputProvenance,
			sourceReplyDeliveryMode,
			disableMessageTool: true,
			forceRestartSafeTools: true,
			idempotencyKey: queuedRunId
		}, {
			...cronSessionId ? { allowSyntheticCronRunContinuation: true } : {},
			expectFinal: true,
			forceSyntheticClient: true,
			runtimeContextFragments: (entry.expectedMediaUrls?.length ?? 0) > 0 ? [...(entry.agentRunAttempt ?? 0) > 0 ? [] : params.runtimeContextFragments ?? [], ...buildGeneratedMediaDeliveryContext(entry.expectedMediaUrls ?? [], (entry.agentRunAttempt ?? 0) > 0)] : params.runtimeContextFragments,
			internalDeliveryMediaUrls: entry.expectedMediaUrls ?? [],
			...entry.suppressTextDelivery === true ? { internalDeliverySuppressText: true } : {},
			...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {},
			onAccepted: () => {
				accepted = true;
			}
		});
	} catch (error) {
		if (!accepted) throw new SessionDeliverySafeRetryError("queued generated-media agent turn failed before gateway acceptance", { cause: error });
		throw error;
	}
	const result = getGatewayAgentResult(response);
	if (!result) {
		const responseStatus = response && typeof response === "object" ? response.status : void 0;
		const latestEntry = loadGatewaySessionEntry(entry.sessionKey).entry;
		if (responseStatus === "accepted") accepted = true;
		if (responseStatus === "accepted" || responseStatus === "in_flight" || latestEntry?.restartRecoveryDeliverySourceRunId === queuedRunId && latestEntry.restartRecoveryDeliveryRunId) {
			await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, params.queueContext);
			throw new SessionDeliveryDeferredError("queued generated-media agent turn is still owned by agent recovery");
		}
		if (hasRestartRecoveryTerminalRun(latestEntry, queuedRunId)) {
			const latestTerminalEvidence = getRestartRecoveryTerminalDeliveryEvidence(latestEntry, queuedRunId);
			if (latestTerminalEvidence) return await evaluateResult(latestTerminalEvidence, latestTerminalEvidence.transcriptRunId ?? null);
			log$1.warn("queued generated-media agent turn ended without durable delivery evidence; failing closed", {
				queueId: entry.id,
				runId: queuedRunId
			});
			await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered without durable terminal evidence", params.queueContext);
		}
		if (!accepted) throw new SessionDeliverySafeRetryError("queued generated-media agent turn returned no result before gateway acceptance");
		throw new Error("queued generated-media agent turn returned no delivery result");
	}
	return await evaluateResult(result);
}
const buildRestartContinuationMessageId = (params) => `restart-sentinel:${params.sessionKey}:${params.kind}:${params.revision}`;
function buildQueuedRestartContinuation(params) {
	const idempotencyKey = params.idempotencyKey ?? buildRestartContinuationMessageId({
		sessionKey: params.sessionKey,
		kind: params.continuation.kind,
		revision: params.revision
	});
	if (params.continuation.kind === "systemEvent") return {
		kind: "systemEvent",
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		text: params.continuation.text,
		...params.deliveryContext ? { deliveryContext: params.deliveryContext } : {},
		idempotencyKey,
		maxRetries: 20,
		completionRetention: "permanent"
	};
	return {
		kind: "agentTurn",
		sessionKey: params.sessionKey,
		message: params.continuation.message,
		messageId: idempotencyKey,
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		maxRetries: 20,
		completionRetention: "permanent",
		...params.route ? { route: params.route } : {},
		...params.deliveryContext ? { deliveryContext: params.deliveryContext } : {},
		idempotencyKey
	};
}
//#endregion
//#region src/gateway/server-restart-update-run.ts
/** The booting Gateway records only its own observations; the CLI owns pending handoffs. */
async function finalizeRestartUpdateRun(payload, pendingExpired = false, context = captureDeliveryQueueStateContext()) {
	const options = { env: context.workerContext.environment };
	const updateRunId = payload.stats?.runId;
	let updateRun = updateRunId ? getUpdateRun(updateRunId, options) : void 0;
	if (updateRun?.status === "running") {
		if (!updateRun.origin.sessionKey && payload.sessionKey) updateRun = recordUpdateRunPhase(updateRun.runId, updateRun.phase, { origin: {
			sessionKey: payload.sessionKey,
			...payload.deliveryContext ? { deliveryContext: {
				...payload.deliveryContext,
				threadId: payload.threadId
			} } : {}
		} }, options);
		if (updateRun.status === "running" && (updateRun.phase === "restarting" || updateRun.phase === "verifying")) updateRun = recordUpdateRunPhase(updateRun.runId, "verifying", {}, options);
		const runningVersion = resolveRuntimeServiceVersion();
		const runningBuildId = resolveRuntimeServiceBuildId();
		const recordedBuildId = typeof updateRun.verification.runningBuildId === "string" ? updateRun.verification.runningBuildId : void 0;
		const restoredVerification = updateRun.verification.versionMatch === true && !updateRun.after.version && typeof updateRun.verification.runningVersion === "string" && updateRun.verification.runningVersion === runningVersion && (recordedBuildId === void 0 || recordedBuildId === runningBuildId);
		const expectedVersion = restoredVerification ? runningVersion : updateRun.after.version ?? updateRun.target.version;
		const expectedBuildId = restoredVerification ? void 0 : updateRun.after.buildId;
		const pluginErrors = getActivePluginRegistry()?.diagnostics.filter((entry) => entry.level === "error").map((entry) => entry.message);
		updateRun = recordUpdateRunVerification(updateRun.runId, {
			booted: true,
			serviceRunning: true,
			pid: process.pid,
			runningVersion,
			...runningBuildId ? { runningBuildId } : {},
			...expectedVersion ? { versionMatch: expectedVersion === runningVersion && (!expectedBuildId || expectedBuildId === runningBuildId) } : {},
			...pluginErrors ? { pluginErrors } : {},
			...payload.doctorHint ? { doctorHint: payload.doctorHint } : {}
		}, {
			...options,
			onlyIfRunning: true
		});
		if (updateRun.phase === "verifying" && updateRun.status === "running") {
			const { createUpdateRunNotifier } = await import("./update-run-notice.runtime.js");
			await (await createUpdateRunNotifier(updateRun, void 0, void 0, void 0, context))(updateRun, "verifying");
		}
		if (!(updateRun.status === "running" && (updateRun.trigger === "cli" || Boolean(payload.stats?.handoffId))) && (pendingExpired || !isPendingControlPlaneUpdateRestartSentinel(payload))) updateRun = finishUpdateRun(updateRun.runId, {
			status: pendingExpired || payload.status === "error" || updateRun.verification.versionMatch === false ? "failed" : payload.status === "ok" ? "succeeded" : "skipped",
			reason: pendingExpired || updateRun.verification.versionMatch === false ? "restart-unhealthy" : payload.stats?.reason ?? void 0,
			after: {
				version: runningVersion,
				...runningBuildId ? { buildId: runningBuildId } : {}
			}
		}, options);
	}
	return updateRun;
}
//#endregion
//#region src/gateway/server-restart-sentinel-snapshot.ts
function matchesPendingUpdateSentinel(payload, pending) {
	return payload.kind === "update" && payload.stats?.runId === pending.runId && payload.stats.handoffId === pending.handoffId;
}
async function readRestartSentinelStartupSnapshot(params) {
	const env = params.context.workerContext.environment;
	let sentinel = await readRestartSentinel(env);
	if (!sentinel) return null;
	const payload = sentinel.payload;
	if (params.pendingUpdate && !matchesPendingUpdateSentinel(payload, params.pendingUpdate)) return null;
	const updateRun = payload.kind === "update" ? await finalizeRestartUpdateRun(payload, false, params.context) : void 0;
	const pendingUpdate = isPendingControlPlaneUpdateRestartSentinel(payload) && payload.stats?.runId ? {
		runId: payload.stats.runId,
		handoffId: payload.stats.handoffId
	} : void 0;
	let pendingSnapshotSuperseded = false;
	if (isPendingControlPlaneUpdateRestartSentinel(payload) && updateRun && updateRun.status !== "running") {
		const current = await readRestartSentinel(env);
		if (current && current.revision !== sentinel.revision && pendingUpdate && matchesPendingUpdateSentinel(current.payload, pendingUpdate) && !isPendingControlPlaneUpdateRestartSentinel(current.payload)) sentinel = current;
		else if (current?.revision !== sentinel.revision && (!current || !pendingUpdate || !matchesPendingUpdateSentinel(current.payload, pendingUpdate))) pendingSnapshotSuperseded = true;
	}
	return {
		sentinel,
		updateRun,
		pendingUpdate,
		pendingSnapshotSuperseded
	};
}
//#endregion
//#region src/gateway/server-restart-sentinel.ts
const log = createSubsystemLogger("gateway/restart-sentinel");
const RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS = process.env.VITEST ? 1 : 6e3;
const CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS = process.env.VITEST ? 1 : 2e3;
const CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS = 900;
const RESTART_CONTINUATION_BUSY_RETRY_ERROR = "restart continuation deferred because previous run is still shutting down";
let latestUpdateRestartSentinel = null;
/** Settles every queue entry through its durable producer before cron cleanup. */
const settleQueuedSessionDelivery = async (entry, outcome, queueContext) => {
	await settleCorrelatedSubagentDelivery(entry, outcome);
	await removeCronRunContinuationSessionIfIdle(entry.sessionKey, entry.id, queueContext);
};
function cloneRestartSentinelPayload(payload) {
	return payload ? structuredClone(payload) : null;
}
function enqueueRestartSentinelWake(message, sessionKey, agentId, deliveryContext) {
	const eventOptions = {
		sessionKey,
		...deliveryContext ? { deliveryContext } : {}
	};
	enqueueSystemEvent(message, withSystemEventOwner(eventOptions, agentId));
	requestSessionEventWake({
		source: "restart-sentinel",
		intent: "immediate",
		reason: "wake",
		agentId,
		sessionKey
	});
}
async function waitForRetry(delayMs) {
	await new Promise((resolve) => {
		setTimeout(resolve, delayMs).unref?.();
	});
}
function isRestartContinuationBusyPayload(payload) {
	return typeof payload.text === "string" && payload.text.trim() === "⚠️ Previous run is still shutting down. Please try again in a moment.";
}
function isRestartContinuationBusyRetry(entry) {
	return entry?.lastError === RESTART_CONTINUATION_BUSY_RETRY_ERROR;
}
function resolveQueuedRestartContinuationMessageId(entry) {
	if (isRestartContinuationBusyRetry(entry) && entry.retryCount > 0) return `${entry.messageId}:retry:${entry.retryCount}`;
	return entry.messageId;
}
function resolveQueuedSessionDeliveryContext(entry) {
	if (entry.kind === "agentTurn" && entry.route) return {
		channel: entry.route.channel,
		to: entry.route.to,
		...entry.route.accountId ? { accountId: entry.route.accountId } : {},
		...entry.route.threadId ? { threadId: entry.route.threadId } : {}
	};
	return entry.deliveryContext;
}
async function deliverQueuedSessionDelivery(params) {
	params.queueContext.admission.assertCurrent();
	const queuedEntry = resolveCorrelatedSubagentDelivery(params.entry);
	const { cfg, agentId, entry, storePath, canonicalKey } = loadGatewaySessionEntry(queuedEntry.sessionKey, {
		env: params.queueContext.environment,
		...queuedEntry.kind === "systemEvent" ? { agentId: queuedEntry.agentId } : {}
	});
	const deliveryContext = resolveQueuedSessionDeliveryContext(queuedEntry);
	if (queuedEntry.kind === "systemEvent") {
		const { agentId: systemEventAgentId = agentId, text } = queuedEntry;
		enqueueRestartSentinelWake(text, canonicalKey, systemEventAgentId, deliveryContext);
		return;
	}
	const sessionChanged = Boolean(queuedEntry.expectedSessionId) && entry?.sessionId !== queuedEntry.expectedSessionId;
	if (sessionChanged) log.warn("restart continuation skipped: session changed", {
		sessionKey: canonicalKey,
		queueId: queuedEntry.id,
		expectedSessionId: queuedEntry.expectedSessionId,
		actualSessionId: entry?.sessionId ?? null
	});
	if (sessionChanged || !queuedEntry.route) {
		enqueueRestartSentinelWake(queuedEntry.message, canonicalKey, agentId, deliveryContext);
		return;
	}
	if (await deliverQueuedGeneratedMediaAgentTurn({
		entry: queuedEntry,
		runtimeContextFragments: queuedEntry.runtimeContextFragments,
		canonicalKey,
		agentId,
		storePath,
		sessionEntry: entry,
		queueContext: params.queueContext,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
	})) return;
	if (queuedEntry.deliveryStartedAt !== void 0) {
		await markSessionDeliverySettlement(queuedEntry, "moved-to-failed", params.queueContext);
		throw new SessionDeliveryDeadLetteredError("queued agent turn dead-lettered after an interrupted unproven attempt");
	}
	const route = queuedEntry.route;
	const messageId = resolveQueuedRestartContinuationMessageId(queuedEntry);
	const userMessage = queuedEntry.message.trim();
	let dispatchError;
	const ctxPayload = finalizeInboundContext({
		Body: userMessage,
		BodyForAgent: userMessage,
		BodyForCommands: "",
		RawBody: userMessage,
		CommandBody: "",
		SessionKey: canonicalKey,
		AccountId: route.accountId,
		MessageSid: messageId,
		Timestamp: Date.now(),
		InputProvenance: {
			kind: "internal_system",
			sourceChannel: route.channel,
			sourceTool: "restart-sentinel"
		},
		Provider: INTERNAL_MESSAGE_CHANNEL,
		Surface: INTERNAL_MESSAGE_CHANNEL,
		ChatType: route.chatType,
		CommandAuthorized: true,
		GatewayClientScopes: ["operator.admin"],
		GatewayClientCaps: [],
		ReplyToId: route.replyToId,
		OriginatingChannel: route.channel,
		OriginatingTo: route.to,
		ExplicitDeliverRoute: false,
		MessageThreadId: route.threadId
	}, {
		forceBodyForCommands: true,
		forceChatType: true
	});
	await dispatchAssembledChannelTurn({
		cfg,
		channel: route.channel,
		accountId: route.accountId,
		agentId,
		routeSessionKey: canonicalKey,
		storePath,
		ctxPayload,
		recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: dispatchReplyWithBufferedBlockDispatcherCore,
		replyOptions: { sourceReplyDeliveryMode: "message_tool_only" },
		turnAdoptionLifecycle: {
			admission: "cancel-only",
			onAdopted: async () => {
				await markSessionDeliveryAttemptStarted(queuedEntry, params.queueContext);
				params.queueContext.admission.assertCurrent();
			}
		},
		delivery: {
			preparePayload: (payload) => {
				if (isRestartContinuationBusyPayload(payload)) throw new SessionDeliverySafeRetryError(RESTART_CONTINUATION_BUSY_RETRY_ERROR);
				return payload;
			},
			durable: false,
			deliver: async () => ({ visibleReplySent: false }),
			onError: (err, info) => {
				dispatchError ??= err;
				log.warn(`restart continuation dispatch failed during ${info.kind}: ${String(err)}`, { sessionKey: canonicalKey });
			}
		},
		record: { onRecordError: (err) => {
			log.warn(`restart continuation failed to record inbound session metadata: ${String(err)}`, { sessionKey: canonicalKey });
		} }
	});
	if (dispatchError) throw toErrorObject(dispatchError, "Non-Error thrown");
}
async function drainRestartContinuationQueue(params) {
	for (let attempt = 1; attempt <= 20; attempt += 1) {
		if (!isRestartContinuationBusyRetry(await drainPendingSessionDelivery({
			id: params.entryId,
			queueContext: params.queueContext,
			logLabel: "restart continuation",
			log: params.log,
			bypassBackoff: true,
			deliver: (entry, { queueContext }) => deliverQueuedSessionDelivery({
				deps: params.deps,
				entry,
				queueContext
			}),
			onSettled: settleQueuedSessionDelivery
		}))) return;
		if (attempt >= 20) return;
		params.log.info(`restart continuation: entry ${params.entryId} still waiting for the previous run to clear; retrying in ${RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS}ms`);
		await waitForRetry(RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS);
	}
}
async function recoverPendingRestartContinuationDeliveries(params) {
	await recoverPendingSessionDeliveries({
		queueContext: params.queueContext,
		deliver: (entry, { queueContext }) => deliverQueuedSessionDelivery({
			deps: params.deps,
			entry,
			queueContext,
			...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
		}),
		log: params.log ?? log,
		maxEnqueuedAt: params.maxEnqueuedAt,
		onSettled: settleQueuedSessionDelivery
	});
}
async function loadRestartSentinelStartupTask(params) {
	const noticeContext = params.context;
	const queueContext = noticeContext.workerContext;
	const env = queueContext.environment;
	const snapshot = await readRestartSentinelStartupSnapshot(params);
	if (!snapshot) return null;
	const { sentinel, pendingUpdate, pendingSnapshotSuperseded } = snapshot;
	let { updateRun } = snapshot;
	const payload = sentinel.payload;
	const sentinelRevision = sentinel.revision;
	if (payload.kind === "update") recordLatestUpdateRestartSentinel(payload);
	const sessionKey = payload.sessionKey?.trim();
	const message = formatRestartSentinelMessage(payload);
	const updateRunId = updateRun?.runId;
	let noticeMessage = payload.kind === "update" ? renderUpdateRunReport(updateRun ?? updateRunReportInputFromSentinel(payload), updateRun?.status === "failed" ? { currentHealth: await readUpdateRunReportHealth(updateRun.verification, { env: resolveDeliveryQueueStateEnv(void 0, noticeContext) }) } : {}).markdown : message;
	const summary = summarizeRestartSentinel(payload);
	const wakeDeliveryContext = mergeDeliveryContext(payload.threadId != null ? {
		...payload.deliveryContext,
		threadId: payload.threadId
	} : payload.deliveryContext, void 0);
	const run = async () => {
		if (params.shouldRun?.() === false) return {
			status: "skipped",
			reason: "gateway-stopped"
		};
		let routedSessionKey = sessionKey;
		let wakeAgentId;
		if (isPendingControlPlaneUpdateRestartSentinel(payload) && !pendingSnapshotSuperseded) {
			const attempt = params.attempt ?? 0;
			if (attempt < CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS) {
				setTimeout(() => {
					if (params.shouldRun?.() === false) return;
					runWithGatewayIndependentRootWorkAdmission(async () => {
						await scheduleRestartSentinelWakeAttempt({
							...params,
							attempt: attempt + 1,
							...pendingUpdate ? { pendingUpdate } : {}
						});
					}, "restart-sentinel:wake").catch((err) => {
						log.warn(`restart sentinel pending update retry failed: ${formatErrorMessage(err)}`);
					});
				}, CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS).unref?.();
				return {
					status: "skipped",
					reason: "update-restart-pending"
				};
			}
			log.warn(`${summary}: update restart sentinel remained pending after retry window`, {
				sessionKey,
				reason: payload.stats?.reason ?? null
			});
			if (updateRunId) {
				updateRun = await finalizeRestartUpdateRun(payload, true, noticeContext);
				if (updateRun) noticeMessage = renderUpdateRunReport(updateRun, updateRun.status === "failed" ? { currentHealth: await readUpdateRunReportHealth(updateRun.verification, { env: resolveDeliveryQueueStateEnv(void 0, noticeContext) }) } : {}).markdown;
			}
		}
		if (updateRun?.status === "running") return {
			status: "skipped",
			reason: "update-restart-pending"
		};
		if (!routedSessionKey) {
			if (updateRun?.trigger === "control-ui" && !updateRun.origin.sessionKey && !updateRun.origin.deliveryContext) {
				recordUpdateRunNoticeSkipped(updateRun.runId, "no delivery target", env);
				await clearRestartSentinelIfRevision(sentinelRevision, env);
				return { status: "ran" };
			}
			const targetlessCliOutcome = payload.kind === "update" && updateRun?.trigger === "cli" && !updateRun.origin.sessionKey && !updateRun.origin.deliveryContext;
			if ((payload.kind === "config-patch" || payload.kind === "config-apply" || targetlessCliOutcome) && (typeof payload.message !== "string" || payload.message.trim().length === 0) && !payload.continuation && !payload.deliveryContext && payload.threadId == null) {
				if (!await clearRestartSentinelIfRevision(sentinelRevision, env)) log.info(`${summary}: newer restart sentinel preserved while consuming acknowledgement`);
				return { status: "ran" };
			}
			const systemTarget = resolveSystemMainSessionTarget(getRuntimeConfig());
			routedSessionKey = systemTarget.sessionKey;
			wakeAgentId = systemTarget.agentId;
		}
		const continuation = sessionKey ? payload.continuation : void 0;
		const session = loadGatewaySessionEntry(routedSessionKey, { env });
		const { cfg, entry, canonicalKey } = session;
		const target = await resolveUpdateRunNoticeTarget({
			cfg,
			sessionKey,
			session,
			env,
			explicitDeliveryContext: sessionKey ? payload.deliveryContext : void 0,
			threadId: sessionKey ? payload.threadId : void 0
		});
		if (target.kind === "none") {
			recordUpdateRunNoticeSkipped(updateRunId, target.reason, env);
			await clearRestartSentinelIfRevision(sentinelRevision, env);
			return { status: "ran" };
		}
		const route = target.kind === "route" ? target.route : void 0;
		const deliveryContext = normalizeDeliveryContext(route) ?? (sessionKey ? wakeDeliveryContext : void 0);
		let continuationQueueId;
		let wakeQueueId;
		let noticeQueueId;
		let noticeQueueCreated = false;
		const continuationRoute = continuation ? route : void 0;
		let internalNoticeWritten = false;
		if (updateRun?.verification.noticeDelivered) internalNoticeWritten = true;
		else if (sessionKey && target.kind === "internal") {
			const { agentId, entry: internalEntry, storePath } = target.session;
			const notice = await appendAssistantMessageToSessionTranscript({
				agentId,
				sessionKey: canonicalKey,
				expectedSessionId: internalEntry.sessionId,
				expectedLifecycleRevision: internalEntry.lifecycleRevision ?? null,
				storePath,
				text: noticeMessage,
				idempotencyKey: updateRunId ? `update-run-finished:${updateRunId}` : `restart-sentinel-notice:${canonicalKey}:${sentinelRevision}`
			}).catch((error) => ({
				ok: false,
				reason: formatErrorMessage(error)
			}));
			internalNoticeWritten = notice.ok;
			if (notice.ok && updateRunId) recordUpdateRunVerification(updateRunId, { noticeDelivered: true }, { env });
			if (!notice.ok) log.warn(`${summary}: internal restart notice append failed; falling back to wake: ${notice.reason}`, { sessionKey: canonicalKey });
		}
		const routedAgentTurnContinuation = continuation?.kind === "agentTurn" && continuationRoute !== void 0;
		const updateComplete = (internalNoticeWritten || updateRunId && route) && payload.kind === "update" && !continuation;
		if (!routedAgentTurnContinuation && !updateComplete) wakeQueueId = await enqueueSessionDelivery(buildQueuedRestartContinuation({
			sessionKey: canonicalKey,
			agentId: wakeAgentId,
			continuation: {
				kind: "systemEvent",
				text: message
			},
			revision: sentinelRevision,
			deliveryContext,
			idempotencyKey: `restart-sentinel-wake:${canonicalKey}:${sentinelRevision}`
		}), queueContext);
		if (!sessionKey && payload.continuation) log.warn(`${summary}: continuation skipped: restart sentinel sessionKey unavailable`, {
			sessionKey: canonicalKey,
			continuationKind: payload.continuation.kind
		});
		if (continuation) continuationQueueId = await enqueueSessionDelivery(buildQueuedRestartContinuation({
			sessionKey: canonicalKey,
			continuation,
			revision: sentinelRevision,
			route: continuationRoute,
			expectedSessionId: entry?.sessionId,
			deliveryContext
		}), queueContext);
		if (route && !updateRun?.verification.noticeDelivered) {
			const queuedNotice = await enqueueRestartSentinelNotice({
				cfg,
				...route,
				message: noticeMessage,
				sessionKey: canonicalKey,
				revision: sentinelRevision,
				...updateRunId ? { deliveryIntentId: `update-run-finished:${updateRunId}` } : {}
			}, noticeContext);
			noticeQueueId = queuedNotice.id;
			noticeQueueCreated = queuedNotice.created;
		}
		if (!await clearRestartSentinelIfRevision(sentinelRevision, env)) log.info(`${summary}: newer restart sentinel preserved while draining durable work`, { sessionKey: canonicalKey });
		if (wakeQueueId) await drainRestartContinuationQueue({
			deps: params.deps,
			entryId: wakeQueueId,
			log,
			queueContext
		});
		if (route && noticeQueueId && noticeQueueCreated) {
			if (await deliverRestartSentinelNotice({
				deps: params.deps,
				cfg,
				sessionKey: canonicalKey,
				summary,
				message: noticeMessage,
				...route,
				queueId: noticeQueueId
			}, noticeContext) && updateRunId) recordUpdateRunVerification(updateRunId, { noticeDelivered: true }, { env });
		} else if (noticeQueueId && !noticeQueueCreated) log.info(`${summary}: durable restart notice already owned`, { sessionKey: canonicalKey });
		if (continuationQueueId) await drainRestartContinuationQueue({
			deps: params.deps,
			entryId: continuationQueueId,
			log,
			queueContext
		});
		return { status: "ran" };
	};
	return {
		source: "restart-sentinel",
		...sessionKey ? { sessionKey } : {},
		run
	};
}
async function scheduleRestartSentinelWakeAttempt(params) {
	if (params.shouldRun?.() === false) return;
	const task = await loadRestartSentinelStartupTask(params);
	if (!task) return;
	await runStartupTasks({
		tasks: [task],
		log
	});
}
async function scheduleRestartSentinelWake(params) {
	await scheduleRestartSentinelWakeAttempt({
		...params,
		context: params.context ?? captureDeliveryQueueStateContext(),
		attempt: 0
	});
}
async function refreshLatestUpdateRestartSentinel(env = captureDeliveryQueueStateContext().workerContext.environment) {
	const current = await readRestartSentinel(env);
	if (current?.payload.kind === "update" && isPendingControlPlaneUpdateRestartSentinel(current.payload)) {
		latestUpdateRestartSentinel = cloneRestartSentinelPayload(current.payload);
		return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
	}
	const sentinel = await finalizeUpdateRestartSentinelRunningVersion(void 0, env) ?? current;
	if (sentinel?.payload.kind === "update") latestUpdateRestartSentinel = cloneRestartSentinelPayload(sentinel.payload);
	return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
}
function getLatestUpdateRestartSentinel() {
	return cloneRestartSentinelPayload(latestUpdateRestartSentinel);
}
function recordLatestUpdateRestartSentinel(payload) {
	latestUpdateRestartSentinel = cloneRestartSentinelPayload(payload);
}
//#endregion
export { refreshLatestUpdateRestartSentinel as a, recoverPendingRestartContinuationDeliveries as i, getLatestUpdateRestartSentinel as n, scheduleRestartSentinelWake as o, recordLatestUpdateRestartSentinel as r, settleQueuedSessionDelivery as s, deliverQueuedSessionDelivery as t };
