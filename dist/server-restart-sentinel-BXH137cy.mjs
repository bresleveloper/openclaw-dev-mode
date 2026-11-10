import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./io-DIF-KW3P.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { P as sessionMatchesExpectedTranscriptTurn } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { c as normalizeDeliveryContext, o as mergeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { r as captureSessionEventTargetForHost, t as enqueueSessionEventForHost } from "./session-event-handoff-BLWR3ywE.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-CHYPkxYr.mjs";
import { _ as getRestartRecoveryTerminalDeliveryEvidence, b as hasRestartRecoveryTerminalRun } from "./store-maintenance-BqMt1Twc.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { b as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker, t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { C as summarizeRestartSentinel, h as readRestartSentinel, i as clearRestartSentinelIfRevision, l as formatRestartSentinelMessage } from "./restart-sentinel-BPoW-ukG.mjs";
import { a as getUpdateRunAsync } from "./update-run-reader-BOC3s3Sk.mjs";
import { l as updateRunReportInputFromSentinel } from "./update-run-report-rePuji8s.mjs";
import { o as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { a as recordUpdateRunPhaseAsync, r as finishUpdateRunAsync, s as recordUpdateRunVerificationAsync } from "./update-run-write.async-c2y7GgO-.mjs";
import { t as finalizeInboundContext } from "./inbound-context-DnPzLOsP.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { s as getMediaDir } from "./store-BOkrav0N.mjs";
import { n as dispatchGatewayLifecycleMethod } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcherCore } from "./provider-dispatcher-DfvoHTGk.mjs";
import { t as recordInboundSession } from "./session-bNhKQNY9.mjs";
import { a as SessionDeliveryDeferredError, i as SessionDeliveryDeadLetteredError, o as SessionDeliveryRetryChargedError, s as SessionDeliverySafeRetryError } from "./session-delivery-queue.records-mSSKRg96.mjs";
import { a as enqueueSessionDelivery, d as mergeSessionDeliveryPreparedMediaBlocks, l as markSessionDeliveryAttemptStarted, o as failSessionDelivery, r as deferSessionDelivery, t as advanceSessionDeliveryAgentRun, u as markSessionDeliverySettlement } from "./session-delivery-queue-storage-BfVLAorZ.mjs";
import { a as recoverPendingSessionDeliveries, i as drainPendingSessionDelivery } from "./session-delivery-queue-runtime-Di93zudM.mjs";
import { r as hasExplicitlyVisibleAgentPayload } from "./message-visibility-P0cXqUe6.mjs";
import { t as removeCronRunContinuationSessionIfIdle } from "./run-continuation-cleanup-CBulJ3CH.mjs";
import { a as formatGeneratedMediaDeliveryRetryForPrompt, n as buildGeneratedMediaDeliveryContext } from "./internal-events-Crl175ti.mjs";
import { a as resolveDurableCompletionDeliveryMode, n as resolveCorrelatedSubagentDelivery, r as settleCorrelatedSubagentDelivery } from "./subagent-completion-delivery-DtawTeAu.mjs";
import { a as getAgentCommandDeliveryFailure, d as hasCompleteAutomaticMediaDeliveryOutcomeEvidence, l as hasCommittedOutboundDeliveryEvidence, n as collectAutomaticDeliveredMediaUrls, r as collectDeliveredMediaUrls, s as getGatewayAgentResult, t as collectAmbiguousAutomaticMediaUrls } from "./delivery-evidence-Do1wex_l.mjs";
import "./get-reply-run-queue-0WiHyxVj.mjs";
import { n as dispatchAssembledChannelTurn } from "./lifecycle-BLAGrI_o.mjs";
import { t as runStartupTasks } from "./startup-tasks-CYKEp7XB.mjs";
import { n as renderUpdateRunSummary } from "./update-run-notice-vU_3JeGX.mjs";
import { t as assertNoRetiredRestartSentinelFiles } from "./state-migrations.restart-sentinel-B-ul81s9.mjs";
import { a as createManagedOutgoingMediaBlocks, n as attachManagedOutgoingMediaToMessage } from "./managed-image-attachments-BH_BBH6I.mjs";
import { r as recordLatestUpdateRestartSentinel } from "./server-update-sentinel-BtLSAKXH.mjs";
import { a as enqueueRestartSentinelNotice, i as deliverRestartSentinelNotice, n as recordUpdateRunNoticeSkipped, r as resolveUpdateRunNoticeTarget } from "./update-run-notice-target-Ci_QteV_.mjs";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
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
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	return collectDeliveredMediaUrls({ payloads: payloads.filter(hasExplicitlyVisibleAgentPayload) });
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
	const binding = entry.requesterBinding;
	const route = entry.route;
	if (!route || entry.inputProvenance?.kind !== "inter_session" || !entry.sourceReplyDeliveryMode) {
		if (binding) return deadLetterSessionDelivery(entry, "bound media completion has no delivery route", params.queueContext);
		return false;
	}
	params.queueContext.admission.assertCurrent();
	const assertRequesterAdmissionCurrent = () => {
		params.queueContext.admission.assertCurrent();
		if (!binding) return;
		const context = params.resolveGatewayContext?.();
		if (params.resolveGatewayContext && !context) throw new SessionDeliveryDeferredError("media completion Gateway owner is unavailable");
		const cfg = context?.getRuntimeConfig() ?? readRuntimeConfig();
		const configuredStorePath = resolveSessionStorePathCore(cfg.session?.store, {
			agentId: binding.agentId,
			env: params.queueContext.environment
		});
		if (entry.sessionKey !== binding.sessionKey || params.canonicalKey !== binding.sessionKey || params.agentId !== binding.agentId || path.resolve(params.storePath) !== path.resolve(binding.storePath) || path.resolve(configuredStorePath) !== path.resolve(binding.storePath)) throw new SessionDeliveryDeadLetteredError("media completion requester store changed");
	};
	const readRequester = async () => {
		if (!binding) return (await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: params.resolveGatewayContext?.()?.getRuntimeConfig() ?? readRuntimeConfig(),
			key: entry.sessionKey,
			env: params.queueContext.environment,
			assertActive: params.queueContext.admission.assertCurrent,
			excludeInternalEffects: true
		})).entry;
		try {
			return await withSessionEntryReadOnlyInWorker({
				...binding,
				env: params.queueContext.environment,
				hydrateSkillPromptRefs: false
			}, assertRequesterAdmissionCurrent, async (read) => {
				if (!read.ok) throw read.error;
				if (!sessionMatchesExpectedTranscriptTurn(read.value ? { entry: read.value } : void 0, {
					expectedSessionId: binding.sessionId,
					expectedLifecycleRevision: binding.lifecycleRevision
				})) throw new SessionDeliveryDeadLetteredError("media completion requester session changed");
				return read.value;
			});
		} catch (error) {
			if (error instanceof SessionDeliveryDeadLetteredError) return deadLetterSessionDelivery(entry, error.message, params.queueContext);
			throw error;
		}
	};
	const sessionEntry = binding ? await readRequester() : params.sessionEntry;
	const queuedRunId = resolveQueuedAgentRunId(entry);
	if (resolveDurableCompletionDeliveryMode(entry.sourceReplyDeliveryMode) === "host_owned" && route.channel === "webchat") return await deadLetterSessionDelivery(entry, "queued host-owned generated-media delivery requires an external route", params.queueContext);
	const persistInternalMedia = route.channel === "webchat" && (entry.expectedMediaUrls?.length ?? 0) > 0 ? async (mediaUrls, transcriptRunId) => {
		const sessionId = sessionEntry?.sessionId?.trim();
		if (!sessionId) throw new Error("queued internal generated-media delivery has no owning session");
		const stateDir = params.queueContext.environment.OPENCLAW_STATE_DIR;
		const attachMedia = async (messageId, blocks) => {
			if (!await attachManagedOutgoingMediaToMessage({
				messageId,
				blocks,
				stateDir
			})) throw new Error("queued internal generated-media artifact attachment failed");
		};
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
		const expectedLifecycleRevision = binding ? binding.lifecycleRevision : sessionEntry?.cronRunContinuation?.lifecycleRevision ?? sessionEntry?.lifecycleRevision ?? null;
		const { enrichAssistantTranscriptMediaForRun, publishAssistantTranscriptRewrite } = await import("./chat-transcript-persistence-9U5UB00S.mjs");
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
			updateMode: "inline",
			onMessageCommitted: (receipt, acceptCompletion) => {
				acceptCompletion(() => attachMedia(receipt.messageId, readAssistantDisplayContent(receipt.message)));
			}
		});
		if (!appended.ok) {
			if (appended.code === "session-rebound") await deadLetterSessionDelivery(entry, "queued internal generated-media delivery lost its owning session", params.queueContext);
			throw new Error(`queued internal generated-media transcript persistence failed: ${appended.reason}`);
		}
		params.queueContext.admission.assertCurrent();
		if (enriched) {
			await attachMedia(enriched.messageId, content);
			await publishAssistantTranscriptRewrite({
				scope,
				rewritten: [enriched]
			});
		}
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
	const terminalEvidence = getRestartRecoveryTerminalDeliveryEvidence(sessionEntry, queuedRunId);
	if (terminalEvidence) return await evaluateResult(terminalEvidence, terminalEvidence.transcriptRunId ?? null);
	if (hasRestartRecoveryTerminalRun(sessionEntry, queuedRunId)) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered without durable terminal evidence", params.queueContext);
	if (sessionEntry?.restartRecoveryDeliverySourceRunId === queuedRunId && Boolean(sessionEntry.restartRecoveryDeliveryRunId)) {
		await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, params.queueContext);
		throw new SessionDeliveryDeferredError("queued generated-media agent turn is still owned by agent recovery");
	}
	if (entry.deliveryStartedAt !== void 0) await deadLetterSessionDelivery(entry, "queued generated-media agent turn dead-lettered after an interrupted unproven attempt", params.queueContext);
	const assertRequesterIdle = () => {
		if (isSessionWorkAdmissionActive(params.storePath, [params.canonicalKey, sessionEntry?.sessionId])) throw new SessionDeliveryDeferredError("queued generated-media turn is waiting for its requester to finish");
	};
	try {
		assertRequesterIdle();
	} catch (error) {
		await deferSessionDelivery(entry.id, AGENT_DELIVERY_OWNERSHIP_RETRY_MS, params.queueContext);
		throw error;
	}
	const sourceReplyDeliveryMode = "automatic";
	const cronSessionId = sessionEntry?.cronRunContinuation?.lifecycleRevision?.trim() ? sessionEntry?.sessionId?.trim() : void 0;
	await markSessionDeliveryAttemptStarted(entry, {
		...params.queueContext,
		admission: {
			...params.queueContext.admission,
			assertCurrent: () => {
				params.queueContext.admission.assertCurrent();
				assertRequesterIdle();
			}
		}
	});
	let accepted = false;
	let response;
	try {
		params.queueContext.admission.assertCurrent();
		assertRequesterAdmissionCurrent();
		response = await dispatchGatewayLifecycleMethod("agent", {
			sessionKey: params.canonicalKey,
			...binding ? {
				agentId: binding.agentId,
				expectedExistingSessionId: binding.sessionId,
				expectedExistingSessionLifecycleRevision: binding.lifecycleRevision
			} : {},
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
			...binding ? { assertAdmissionCurrent: assertRequesterAdmissionCurrent } : {},
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
		if (error instanceof SessionDeliveryDeadLetteredError) return deadLetterSessionDelivery(entry, error.message, params.queueContext);
		if (!accepted) throw new SessionDeliverySafeRetryError("queued generated-media agent turn failed before gateway acceptance", { cause: error });
		throw error;
	}
	const result = getGatewayAgentResult(response);
	if (!result) {
		const responseStatus = response && typeof response === "object" ? response.status : void 0;
		const latestEntry = await readRequester();
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
const RESTART_CONTINUATION_BUSY_RETRY_ERROR = "restart continuation deferred because previous run is still shutting down";
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
function buildQueuedRestartContinuation(params) {
	const idempotencyKey = params.idempotencyKey ?? `restart-sentinel:${params.sessionKey}:${params.continuation.kind}:${params.revision}`;
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
//#region src/gateway/server-restart-sentinel-session-event.ts
async function deliverRestartSentinelEvent(entry, sessionKey, agentId, queueContext) {
	if (entry.deliveryStartedAt !== void 0) throw new SessionDeliveryDeadLetteredError("queued session event dead-lettered after an interrupted unproven attempt");
	const assertCurrent = () => queueContext.admission.assertCurrent();
	assertCurrent();
	const expectedTarget = await captureSessionEventTargetForHost(agentId, sessionKey, {
		env: queueContext.environment,
		assertCurrent
	});
	assertCurrent();
	const message = entry.kind === "systemEvent" ? entry.text : entry.message;
	const deliveryContext = entry.kind === "agentTurn" && entry.route ? {
		channel: entry.route.channel,
		to: entry.route.to,
		...entry.route.accountId ? { accountId: entry.route.accountId } : {},
		...entry.route.threadId ? { threadId: entry.route.threadId } : {}
	} : entry.deliveryContext;
	let adopted = false;
	let adoptionError;
	const outcome = await enqueueSessionEventForHost(message, {
		agentId,
		sessionKey,
		source: "restart",
		contextKey: `task:restart-sentinel:${entry.id}`,
		...deliveryContext ? { deliveryContext } : {},
		expectedTarget,
		assertCurrent,
		onAdopted: async () => {
			try {
				await markSessionDeliveryAttemptStarted(entry, queueContext);
			} catch (error) {
				adoptionError = error instanceof Error ? error : new Error("Restart session event adoption failed", { cause: error });
				throw adoptionError;
			}
			adopted = true;
			assertCurrent();
		}
	}).settled;
	assertCurrent();
	if (outcome.status !== "completed") {
		if (adoptionError) throw adoptionError;
		const errorMessage = outcome.error ?? `restart session event ${outcome.status}`;
		if (adopted || outcome.executionStarted || outcome.retryable === false) throw new SessionDeliveryDeadLetteredError(errorMessage);
		throw new SessionDeliverySafeRetryError(errorMessage);
	}
}
//#endregion
//#region src/gateway/server-restart-update-run.ts
/** The booting Gateway records only its own observations; the CLI owns pending handoffs. */
async function finalizeRestartUpdateRun(payload, pendingExpired = false, context = captureDeliveryQueueStateContext()) {
	const options = { env: context.workerContext.environment };
	const updateRunId = payload.stats?.runId;
	let updateRun = updateRunId ? await getUpdateRunAsync(updateRunId, options) : void 0;
	if (updateRun?.status === "running") {
		if (!updateRun.origin.sessionKey && payload.sessionKey) updateRun = await recordUpdateRunPhaseAsync(updateRun.runId, updateRun.phase, { origin: {
			sessionKey: payload.sessionKey,
			...payload.deliveryContext ? { deliveryContext: {
				...payload.deliveryContext,
				threadId: payload.threadId
			} } : {}
		} }, options);
		if (updateRun.status === "running" && (updateRun.phase === "restarting" || updateRun.phase === "verifying")) updateRun = await recordUpdateRunPhaseAsync(updateRun.runId, "verifying", {}, options);
		const runningVersion = resolveRuntimeServiceVersion();
		const runningBuildId = resolveRuntimeServiceBuildId();
		const recordedBuildId = typeof updateRun.verification.runningBuildId === "string" ? updateRun.verification.runningBuildId : void 0;
		const restoredVerification = updateRun.verification.versionMatch === true && !updateRun.after.version && typeof updateRun.verification.runningVersion === "string" && updateRun.verification.runningVersion === runningVersion && (recordedBuildId === void 0 || recordedBuildId === runningBuildId);
		const expectedVersion = restoredVerification ? runningVersion : updateRun.after.version ?? updateRun.target.version;
		const expectedBuildId = restoredVerification ? void 0 : updateRun.after.buildId;
		const pluginErrors = getActivePluginRegistry()?.diagnostics.filter((entry) => entry.level === "error").map((entry) => entry.message);
		updateRun = await recordUpdateRunVerificationAsync(updateRun.runId, {
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
		if (!(updateRun.status === "running" && (updateRun.trigger === "cli" || Boolean(payload.stats?.handoffId))) && (pendingExpired || !isPendingControlPlaneUpdateRestartSentinel(payload))) updateRun = await finishUpdateRunAsync(updateRun.runId, {
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
function matchesPendingUpdateSentinel(sentinel, pending) {
	const { payload } = sentinel;
	return pending.kind === "legacy" ? sentinel.revision === pending.revision && payload.kind === "update" && !payload.stats?.runId && payload.stats?.handoffId === pending.handoffId : payload.kind === "update" && payload.stats?.runId === pending.runId && payload.stats.handoffId === pending.handoffId;
}
async function readRestartSentinelStartupSnapshot(params) {
	if (params.shouldRun?.() === false) return null;
	const env = params.context.workerContext.environment;
	assertNoRetiredRestartSentinelFiles(env.OPENCLAW_STATE_DIR);
	let sentinel = await readRestartSentinel(env);
	if (params.shouldRun?.() === false) return null;
	if (params.pendingUpdate && (!sentinel || !matchesPendingUpdateSentinel(sentinel, params.pendingUpdate))) return null;
	if (!sentinel || params.shouldRun?.() === false) return null;
	const payload = sentinel.payload;
	const updateRun = payload.kind === "update" ? await finalizeRestartUpdateRun(payload, false, params.context) : void 0;
	if (params.shouldRun?.() === false) return null;
	const pendingUpdate = isPendingControlPlaneUpdateRestartSentinel(payload) ? payload.stats?.runId ? {
		kind: "run",
		runId: payload.stats.runId,
		handoffId: payload.stats.handoffId
	} : payload.stats?.handoffId ? {
		kind: "legacy",
		revision: sentinel.revision,
		handoffId: payload.stats.handoffId
	} : void 0 : void 0;
	let pendingSnapshotSuperseded = false;
	if (isPendingControlPlaneUpdateRestartSentinel(payload) && updateRun && updateRun.status !== "running") {
		const current = await readRestartSentinel(env);
		if (params.shouldRun?.() === false) return null;
		if (current && current.revision !== sentinel.revision && pendingUpdate && matchesPendingUpdateSentinel(current, pendingUpdate) && !isPendingControlPlaneUpdateRestartSentinel(current.payload)) sentinel = current;
		else if (current?.revision !== sentinel.revision && (!current || !pendingUpdate || !matchesPendingUpdateSentinel(current, pendingUpdate))) pendingSnapshotSuperseded = true;
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
const CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS = 2e3;
const CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS = 900;
/** Settles every queue entry through its durable producer before cron cleanup. */
const settleQueuedSessionDelivery = async (entry, outcome, queueContext) => {
	await settleCorrelatedSubagentDelivery(entry, outcome, queueContext);
	await removeCronRunContinuationSessionIfIdle(entry.sessionKey, entry.id, queueContext);
};
async function deliverQueuedSessionDelivery(params) {
	params.queueContext.admission.assertCurrent();
	const queuedEntry = resolveCorrelatedSubagentDelivery(params.entry);
	if (queuedEntry.kind === "agentTurn" && queuedEntry.requesterBinding) {
		await deliverQueuedGeneratedMediaAgentTurn({
			...params,
			...queuedEntry.requesterBinding,
			entry: queuedEntry,
			runtimeContextFragments: queuedEntry.runtimeContextFragments,
			canonicalKey: queuedEntry.requesterBinding.sessionKey
		});
		return;
	}
	const cfg = readRuntimeConfig();
	const { agentId, store, storeKeys, storePath, canonicalKey } = await resolveGatewaySessionStoreTargetInWorker({
		cfg,
		key: queuedEntry.sessionKey,
		env: params.queueContext.environment,
		assertActive: () => params.queueContext.admission.assertCurrent(),
		...queuedEntry.kind === "systemEvent" ? { agentId: queuedEntry.agentId } : {}
	});
	params.queueContext.admission.assertCurrent();
	const entry = findCanonicalStoreMatch(store, storeKeys)?.entry;
	if (queuedEntry.kind === "systemEvent") {
		await deliverRestartSentinelEvent(queuedEntry, canonicalKey, queuedEntry.agentId ?? agentId, params.queueContext);
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
		await deliverRestartSentinelEvent(queuedEntry, canonicalKey, agentId, params.queueContext);
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
		resolveGatewayContext: params.resolveGatewayContext
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
		await setTimeout(RESTART_CONTINUATION_BUSY_RETRY_DELAY_MS, void 0, { ref: false });
	}
}
async function recoverPendingRestartContinuationDeliveries(params) {
	await recoverPendingSessionDeliveries({
		queueContext: params.queueContext,
		deliver: (entry, { queueContext }) => deliverQueuedSessionDelivery({
			deps: params.deps,
			entry,
			queueContext,
			resolveGatewayContext: params.resolveGatewayContext
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
	let noticeMessage = payload.kind === "update" ? renderUpdateRunSummary(updateRun ?? updateRunReportInputFromSentinel(payload)) : message;
	const summary = summarizeRestartSentinel(payload);
	const wakeDeliveryContext = mergeDeliveryContext(payload.threadId != null ? {
		...payload.deliveryContext,
		threadId: payload.threadId
	} : payload.deliveryContext, void 0);
	const run = async () => {
		if (params.signal.aborted || params.shouldRun?.() === false) return {
			status: "skipped",
			reason: "gateway-stopped"
		};
		let routedSessionKey = sessionKey;
		let wakeAgentId;
		if (isPendingControlPlaneUpdateRestartSentinel(payload) && !pendingSnapshotSuperseded) {
			const attempt = params.attempt ?? 0;
			if (attempt < CONTROL_PLANE_UPDATE_PENDING_MAX_ATTEMPTS) {
				const cancel = () => retry.cancel();
				const retry = params.scheduler.schedule({
					id: "restart-sentinel:pending-update",
					delayMs: CONTROL_PLANE_UPDATE_PENDING_RETRY_DELAY_MS,
					run: () => {
						params.signal.removeEventListener("abort", cancel);
						if (params.signal.aborted || params.shouldRun?.() === false) return;
						const work = runWithGatewayIndependentRootWorkAdmission(() => scheduleRestartSentinelWake({
							...params,
							attempt: attempt + 1,
							...pendingUpdate ? { pendingUpdate } : {}
						}), "restart-sentinel:wake", params.signal).catch((err) => {
							if (!params.signal.aborted) log.warn(`restart sentinel pending update retry failed: ${formatErrorMessage(err)}`);
						});
						params.trackWork?.(work);
						return work;
					}
				});
				params.signal.addEventListener("abort", cancel, { once: true });
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
				if (updateRun) noticeMessage = renderUpdateRunSummary(updateRun);
			}
		}
		if (updateRun?.status === "running") return {
			status: "skipped",
			reason: "update-restart-pending"
		};
		if (!routedSessionKey) {
			if (updateRun?.trigger === "control-ui" && !updateRun.origin.sessionKey && !updateRun.origin.deliveryContext) {
				await recordUpdateRunNoticeSkipped(updateRun.runId, "no delivery target", env);
				await clearRestartSentinelIfRevision(sentinelRevision, env);
				return { status: "ran" };
			}
			const targetlessCliOutcome = payload.kind === "update" && updateRun?.trigger === "cli" && !updateRun.origin.sessionKey && !updateRun.origin.deliveryContext;
			if ((payload.kind === "config-patch" || payload.kind === "config-apply" || targetlessCliOutcome) && (typeof payload.message !== "string" || payload.message.trim().length === 0) && !payload.continuation && !payload.deliveryContext && payload.threadId == null) {
				if (!await clearRestartSentinelIfRevision(sentinelRevision, env)) log.info(`${summary}: newer restart sentinel preserved while consuming acknowledgement`);
				return { status: "ran" };
			}
			const systemTarget = resolveSystemMainSessionTarget(readRuntimeConfig());
			routedSessionKey = systemTarget.sessionKey;
			wakeAgentId = systemTarget.agentId;
		}
		const continuation = sessionKey ? payload.continuation : void 0;
		const cfg = readRuntimeConfig();
		const sessionTarget = await resolveGatewaySessionStoreTargetInWorker({
			cfg,
			key: routedSessionKey,
			agentId: wakeAgentId,
			env,
			assertActive: () => queueContext.admission.assertCurrent()
		});
		queueContext.admission.assertCurrent();
		const { canonicalKey } = sessionTarget;
		const match = findCanonicalStoreMatch(sessionTarget.store, sessionTarget.storeKeys);
		const entry = match?.entry;
		const session = {
			cfg,
			...sessionTarget,
			entry,
			legacyKey: match?.key !== canonicalKey ? match?.key : void 0
		};
		const target = await resolveUpdateRunNoticeTarget({
			cfg,
			sessionKey,
			session,
			env,
			explicitDeliveryContext: sessionKey ? payload.deliveryContext : void 0,
			threadId: sessionKey ? payload.threadId : void 0
		});
		queueContext.admission.assertCurrent();
		if (target.kind === "none") {
			await recordUpdateRunNoticeSkipped(updateRunId, target.reason, env);
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
			if (notice.ok && updateRunId) await recordUpdateRunVerificationAsync(updateRunId, { noticeDelivered: true }, { env });
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
		const consumed = await clearRestartSentinelIfRevision(sentinelRevision, env);
		if (params.signal.aborted || params.shouldRun?.() === false) return {
			status: "skipped",
			reason: "gateway-stopped"
		};
		if (!consumed) log.info(`${summary}: newer restart sentinel preserved while draining durable work`, { sessionKey: canonicalKey });
		const deliveries = await Promise.allSettled([wakeQueueId ? drainRestartContinuationQueue({
			deps: params.deps,
			entryId: wakeQueueId,
			log,
			queueContext
		}) : void 0, (async () => {
			if (route && noticeQueueId && noticeQueueCreated) {
				if (await deliverRestartSentinelNotice({
					deps: params.deps,
					cfg,
					sessionKey: canonicalKey,
					summary,
					message: noticeMessage,
					...route,
					queueId: noticeQueueId
				}, noticeContext) && updateRunId) await recordUpdateRunVerificationAsync(updateRunId, { noticeDelivered: true }, { env });
			} else if (noticeQueueId && !noticeQueueCreated) log.info(`${summary}: durable restart notice already owned`, { sessionKey: canonicalKey });
		})()]);
		for (const delivery of deliveries) if (delivery.status === "rejected") throw delivery.reason;
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
async function scheduleRestartSentinelWake(params) {
	if (params.signal.aborted || params.shouldRun?.() === false) return;
	const task = await loadRestartSentinelStartupTask({
		...params,
		context: params.context ?? captureDeliveryQueueStateContext()
	});
	if (!task) return;
	await runStartupTasks({
		tasks: [task],
		log
	});
}
//#endregion
export { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, scheduleRestartSentinelWake, settleQueuedSessionDelivery };
