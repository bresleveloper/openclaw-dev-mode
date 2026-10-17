import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { it as resolveAdmittedCronCompletionStatus } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { o as hasReplyPayloadContent } from "./payload-DfZ7JVGs.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { g as runExclusiveSessionLifecycleMutation, u as getSessionWorkAdmissionRelease } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { i as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER, r as OPENCLAW_TRANSCRIPT_ARTIFACT_API, t as CRON_DIRECT_DELIVERY_CONTEXT_KIND } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { _ as readTranscriptEventMessage, g as readTranscriptEventId } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { o as persistSessionTranscriptTurn } from "./session-accessor-CQ-g9yb2.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-BWyx9fu4.mjs";
import { r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { l as resolveOutboundPayloadMirrorText, s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-RF8yW6z7.mjs";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-D6JiS64U.mjs";
import { i as normalizeCronRunErrorText } from "./execution-errors-3rfzndmK.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-Dz9JPCN-.mjs";
import "./inbound.runtime-BJ_bigcm.mjs";
import { n as resolveMessageToolDeliveryFormatPrompt, t as buildDeliveryFormatPrompt } from "./delivery-format-prompt-B5J0HRh-.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-DKKxATZ3.mjs";
import { f as pickSummaryFromOutput, p as readAutomationFailedReport } from "./run-session-state-CXfMR1pf.mjs";
import { n as requiresExternalCronDelivery, r as resolveDeliveryTarget } from "./delivery-target-kx29Zebe.mjs";
import { n as attachManagedOutgoingMediaToMessage, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-DbHPJZAc.mjs";
import { a as hasAssistantDisplayMediaContent, o as hasManagedOutgoingAssistantContent, t as buildAssistantReplyContent } from "./chat-assistant-content-DIH8LIPH.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BBePQpRw.mjs";
import { C as resolveStaleCronDeliveryError, S as resolveDescendantSubagentFollowup, T as waitForCompletedDirectCronDelivery, _ as logCronDeliveryError, a as isSameSessionKey, b as maybeApplyTtsToCronPayloads, c as queueCronMessageToolDeliveryAwareness, d as resolveCronDeliveryRouteSessionKey, f as resolveDirectCronTranscriptMirrorText, g as isCompletedDirectCronDelivery, h as buildDirectCronDeliveryIdempotencyKey, i as formatTargetCronDeliveryFailureAwarenessText, l as resolveCronAwarenessMainSessionKey, m as DIRECT_CRON_DELIVERY_COMPLETION_RETENTION, n as buildDirectCronTranscriptMirrorPayloads, o as projectDeliveredDirectCronPayloadsForMirror, p as shouldQueueCronAwareness, r as commitDirectCronOutboundRoute, s as queueCronAwarenessSystemEvent, t as appendAdmittedDirectCronDeliveryTranscriptMirror, u as resolveCronAwarenessText, v as logCronDeliveryErrorDeferred, w as retryTransientDirectCronDelivery, x as normalizeSilentReplyText, y as logCronDeliveryWarn } from "./delivery-dispatch-awareness-aXwh-5pB.mjs";
//#region src/sessions/background-session-result.ts
const AUTOMATION_RESULT_MODEL = "automation-result";
/** Serializes a background assistant result behind active work on its target conversation. */
async function commitBackgroundResultToSession(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const text = normalizeOptionalString(params.text);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	if (!sessionKey || !text || !idempotencyKey) return {
		ok: false,
		reason: "background session result is missing required data"
	};
	const storePath = resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId });
	const expectedSessionId = normalizeOptionalString(params.expectedGeneration.sessionId);
	if (!expectedSessionId) return {
		ok: false,
		reason: "background session result has an invalid expected generation"
	};
	const expectedLifecycleRevision = normalizeOptionalString(params.expectedGeneration.lifecycleRevision);
	const identities = [sessionKey, expectedSessionId];
	params.assertCurrent?.();
	return await runExclusiveSessionLifecycleMutation("background-result", {
		scope: storePath,
		identities,
		signal: params.signal,
		prepare: async () => {
			const released = getSessionWorkAdmissionRelease({
				scope: storePath,
				identities
			});
			if (released) await racePromiseWithAbortSignal(released, params.signal);
		},
		run: async () => {
			params.assertCurrent?.();
			const current = loadSessionEntryReadOnly({
				agentId: params.agentId,
				sessionKey,
				storePath,
				readConsistency: "latest"
			});
			if (current?.sessionId !== expectedSessionId || normalizeOptionalString(current.lifecycleRevision) !== expectedLifecycleRevision) return {
				ok: false,
				reason: `session rebound for sessionKey: ${sessionKey}`
			};
			const unavailable = resolveSessionWorkStartError(sessionKey, current, {
				expectedSessionId,
				purpose: "accepted-result-settlement"
			});
			if (unavailable) return {
				ok: false,
				reason: unavailable
			};
			const scope = {
				agentId: params.agentId,
				sessionKey,
				sessionId: expectedSessionId,
				storePath
			};
			const prior = await findTranscriptEvent(scope, {
				kind: "idempotency",
				key: idempotencyKey
			});
			const priorMessage = prior && readTranscriptEventMessage(prior.event);
			const priorId = prior && readTranscriptEventId(prior.event);
			if (prior && (!priorMessage || !priorId)) return {
				ok: false,
				reason: "background result transcript identity is unavailable"
			};
			const displayContent = priorMessage ? void 0 : (await params.prepareDisplayContent?.())?.map((block) => Object.assign({}, block));
			const message = {
				role: "assistant",
				content: [{
					type: "text",
					text
				}],
				...displayContent ? { [ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent } : {},
				api: OPENCLAW_TRANSCRIPT_ARTIFACT_API,
				provider: OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER,
				model: AUTOMATION_RESULT_MODEL,
				usage: makeZeroUsageSnapshot(),
				stopReason: "stop",
				timestamp: Date.now(),
				idempotencyKey,
				openclawAutomation: params.provenance
			};
			params.assertCurrent?.();
			const committed = await persistSessionTranscriptTurn(scope, {
				cwd: current.spawnedCwd,
				expectedSessionId,
				expectedLifecycleRevision: expectedLifecycleRevision ?? null,
				assertCurrent: () => {
					params.assertCurrent?.();
					params.signal?.throwIfAborted();
				},
				messages: [{
					message: priorMessage ? {
						...priorMessage,
						content: message.content,
						openclawAutomation: params.provenance
					} : message,
					idempotencyLookup: "scan",
					...priorId ? {
						eventId: priorId,
						predicate: {
							kind: "active-entry",
							entryId: priorId,
							errorMessage: "background result no longer owns the active transcript"
						}
					} : {}
				}],
				touchSessionEntry: true,
				updateMode: "inline",
				publishWhen: params.prepareDisplayContent ? "always" : void 0,
				config: params.config,
				onMessageCommitted: params.onMessageCommitted
			});
			const appended = committed.messages[0];
			return appended ? {
				ok: true,
				messageId: appended.messageId
			} : {
				ok: false,
				reason: committed.rejectedReason ?? "background result was not committed"
			};
		}
	});
}
//#endregion
//#region src/cron/isolated-agent/current-session-completion.ts
async function commitCurrentSessionCronCompletion(params, text) {
	const sourceSessionKey = params.sourceSessionKey?.trim();
	if (!sourceSessionKey) return {
		ok: false,
		reason: "current cron delivery is missing its source session binding"
	};
	const sourceSessionGeneration = params.sourceSessionGeneration;
	if (!sourceSessionGeneration) return {
		ok: false,
		reason: "current cron delivery is missing its source session generation"
	};
	const transcriptPayloads = buildDirectCronTranscriptMirrorPayloads(params.deliveryPayloads);
	const mirror = projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan(transcriptPayloads));
	const completionText = resolveDirectCronTranscriptMirrorText(mirror) ?? normalizeOptionalString(text);
	if (!completionText) return {
		ok: false,
		reason: "current cron completion has no durable transcript projection"
	};
	const runId = createCronExecutionId(params.job.id, params.runStartedAt);
	let preparedContent;
	let appended = false;
	try {
		await params.deliveryAttemptFence?.beforeAttempt();
		const committed = await commitBackgroundResultToSession({
			agentId: params.agentId,
			sessionKey: sourceSessionKey,
			expectedGeneration: sourceSessionGeneration,
			text: completionText,
			prepareDisplayContent: async () => {
				const { assistantContent } = await buildAssistantReplyContent({
					sessionKey: sourceSessionKey,
					agentId: params.agentId,
					payloads: transcriptPayloads.map((payload) => copyReplyPayloadMetadata(payload, {
						...payload,
						text: resolveOutboundPayloadMirrorText(payload)
					})),
					managedMediaLocalRoots: getAgentScopedMediaLocalRootsForSources({
						cfg: params.cfgWithAgentDefaults,
						agentId: params.agentId,
						mediaSources: mirror.mediaUrls
					}),
					includeSensitiveMedia: false,
					onManagedMediaPrepareError: (message) => {
						logCronDeliveryWarn(`[cron:${params.job.id}] current-session completion media embedding skipped: ${message}`);
					}
				});
				preparedContent = assistantContent;
				return hasAssistantDisplayMediaContent(preparedContent) ? preparedContent : void 0;
			},
			idempotencyKey: `cron-current-completion:${runId}`,
			provenance: {
				kind: "cron",
				jobId: params.job.id,
				runId
			},
			config: params.cfgWithAgentDefaults,
			signal: params.abortSignal,
			assertCurrent: () => {
				params.abortSignal?.throwIfAborted();
				params.deliveryAttemptFence?.assertCurrent();
			},
			onMessageCommitted: (result, acceptCompletion) => {
				appended = result.appended;
				const blocks = readAssistantDisplayContent(result.message);
				if (hasManagedOutgoingAssistantContent(blocks)) acceptCompletion(async () => {
					if (!await attachManagedOutgoingMediaToMessage({
						messageId: result.messageId,
						blocks
					})) throw new Error("Current-session completion media ownership could not be persisted");
				});
			}
		});
		if (!committed.ok) return committed;
	} finally {
		if (!appended && preparedContent) await removeManagedOutgoingMediaBlocks({
			blocks: preparedContent,
			messageId: null
		});
	}
	if (params.sourceDeliveryOutcome.satisfiesSourceDelivery) return {
		ok: true,
		requiresExternalDelivery: false
	};
	if (params.resolvedDelivery.ok) return {
		ok: true,
		requiresExternalDelivery: true
	};
	if (requiresExternalCronDelivery(params.deliveryPlan, params.resolvedDelivery)) return {
		ok: true,
		requiresExternalDelivery: false,
		deliveryError: params.resolvedDelivery.error.message
	};
	return {
		ok: true,
		requiresExternalDelivery: false
	};
}
//#endregion
//#region src/cron/isolated-agent/delivery-payload-normalization.ts
function shouldAttachDirectCronFallbackText(payload) {
	return Boolean(payload.channelData) && !hasReplyPayloadContent(payload, {
		trimText: true,
		hasChannelData: false
	});
}
function normalizeDirectPayload(payload) {
	const normalized = payload.text ? normalizeSilentReplyText(payload.text) : void 0;
	return normalized ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: normalized.strippedTrailingSilentToken ? void 0 : normalized.text
	}) : payload;
}
function normalizeDirectCronDeliveryPayloads(params) {
	const fallback = normalizeSilentReplyText(normalizeOptionalString(params.outputText) ?? normalizeOptionalString(params.summary) ?? normalizeOptionalString(params.synthesizedText));
	const fallbackText = fallback.strippedTrailingSilentToken ? void 0 : fallback.text;
	const candidates = params.deliveryPayloads.map(normalizeDirectPayload).filter((payload) => hasReplyPayloadContent(payload, { trimText: true }));
	if (candidates.length === 0 && fallbackText) candidates.push({ text: fallbackText });
	const fallbackIndex = fallbackText ? candidates.findLastIndex((payload) => normalizeOptionalString(payload.text) === fallbackText) : -1;
	let fallbackSourceIndex = fallbackIndex >= 0 ? fallbackIndex : void 0;
	if (fallbackText && fallbackSourceIndex === void 0 && candidates.some(shouldAttachDirectCronFallbackText)) {
		candidates.unshift({ text: fallbackText });
		fallbackSourceIndex = 0;
	}
	const prepared = candidates.map((payload) => shouldAttachDirectCronFallbackText(payload) && fallbackText && fallbackSourceIndex !== void 0 ? copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: {
		text: fallbackText,
		replacesPayloadIndex: fallbackSourceIndex
	} })) : payload);
	const accepted = [];
	let channelSuppressed = false;
	for (const [index, candidate] of prepared.entries()) {
		const transformed = params.channelTransform ? params.channelTransform.apply(candidate) : candidate;
		if (transformed === null) channelSuppressed = true;
		else accepted.push({
			payload: transformed,
			sourceIndex: index
		});
	}
	if (accepted.length === 0) return {
		kind: "suppress",
		reason: channelSuppressed ? "channel_transform" : "empty"
	};
	const acceptedFallbackIndex = accepted.findIndex(({ sourceIndex }) => sourceIndex === fallbackSourceIndex);
	return {
		kind: "deliver",
		payload: accepted.map(({ payload }) => {
			const fallbackMeta = payload.fallbackText;
			if (!fallbackMeta || fallbackMeta.replacesPayloadIndex !== fallbackSourceIndex) return payload;
			return copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: acceptedFallbackIndex < 0 ? void 0 : {
				...fallbackMeta,
				replacesPayloadIndex: acceptedFallbackIndex
			} }));
		})
	};
}
/**
* Appends the Control UI run-inspection link to the last visible payload.
* Callers invoke this only after silent-reply suppression so a link cannot turn
* a silent or empty run into a visible announcement; the payload is replaced
* rather than mutated because payload objects can be aliased by the caller.
*/
function appendCronRunInspectionLink(payloads, inspectionUrl) {
	const index = payloads.findLastIndex((payload) => payload.text?.trim());
	if (!inspectionUrl || index < 0) return payloads;
	const payload = payloads[index];
	const linked = copyReplyPayloadMetadata(payload, {
		...payload,
		text: `${payload.text}\nInspect: ${inspectionUrl}`
	});
	return payloads.map((entry, at) => at === index ? linked : entry);
}
//#endregion
//#region src/cron/isolated-agent/delivery-dispatch.ts
const deliveryOutboundRuntimeLoader = createLazyImportLoader(() => import("./delivery-outbound.runtime.js"));
const subagentFollowupRuntimeLoader = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
async function dispatchCronDelivery(params) {
	const sourceDeliverySatisfied = params.sourceDeliveryOutcome.satisfiesSourceDelivery;
	const requiresCurrentSessionCompletion = params.job.sessionTarget === "current";
	const verifiedMessageToolDelivery = params.sourceDeliveryOutcome.verifiedMessageToolDelivery;
	let summary = params.summary;
	let outputText = params.outputText;
	let synthesizedText = params.synthesizedText;
	let deliveryPayloads = params.deliveryPayloads;
	let agentReportedFailure;
	const adoptSettledChildReply = (childReply) => {
		agentReportedFailure = readAutomationFailedReport(childReply);
		const reply = agentReportedFailure ?? childReply;
		outputText = reply;
		summary = pickSummaryFromOutput(reply) ?? summary;
		synthesizedText = reply;
		deliveryPayloads = [{ text: reply }];
	};
	const deliveryState = {
		status: params.deliveryRequested ? "not-delivered" : "not-requested",
		delivered: false,
		failureNotification: { status: "not-requested" }
	};
	const recordDelivery = (status, error, deliverySuppressionReason) => {
		deliveryState.status = status;
		deliveryState.delivered = status === "delivered" ? true : status === "not-delivered" ? false : void 0;
		deliveryState.error = error;
		deliveryState.deliverySuppressionReason = deliverySuppressionReason;
	};
	if (verifiedMessageToolDelivery) recordDelivery("delivered");
	let deliveryAttempted = verifiedMessageToolDelivery;
	let deferredDeletingSessionMirror;
	const buildDeliveryState = async (disposition) => {
		const executionFailed = disposition?.kind === "error" || agentReportedFailure !== void 0;
		const completion = resolveAdmittedCronCompletionStatus(params.job, executionFailed ? "error" : params.undeliveredRunStatus, deliveryState.status, deliveryState.deliverySuppressionReason);
		if (deliveryState.status === "delivered" || deliveryState.status === "not-requested" && !executionFailed || completion === "succeeded") await cleanupDirectCronSessionIfNeeded();
		await params.queueSourceSessionMessageToolAwareness?.();
		return {
			...disposition ? { disposition } : {},
			deliveryState,
			delivered: deliveryState.delivered,
			deliveryAttempted,
			deliveryError: deliveryState.error,
			deliverySuppressionReason: deliveryState.deliverySuppressionReason,
			summary,
			outputText,
			synthesizedText,
			deliveryPayloads,
			...agentReportedFailure ? { agentReportedFailure } : {}
		};
	};
	const formatDeliveryTargetError = (error) => params.sourceDeliveryOutcome.unverifiedMessageToolDelivery ? `${error}; the agent used the message tool, but OpenClaw could not verify that message matched the cron delivery target` : error;
	const failDeliveryTarget = (error) => ({
		kind: "error",
		error: formatDeliveryTargetError(error),
		errorKind: "delivery-target"
	});
	const cleanupDirectCronSessionIfNeeded = async () => {
		const cleanupOutcome = await cleanupCronRunSessionAfterRun({
			job: params.job,
			agentSessionKey: params.agentSessionKey,
			sessionId: params.sessionId,
			lifecycleRevision: params.lifecycleRevision,
			sessionUpdatedAt: params.sessionUpdatedAt,
			beforeDelete: params.beforeSessionDelete,
			reason: "cron-delete-after-run-fallback"
		});
		const survivingMirror = deferredDeletingSessionMirror;
		deferredDeletingSessionMirror = void 0;
		if (cleanupOutcome !== "not-requested" && cleanupOutcome !== "deleted" && survivingMirror) await appendAdmittedDirectCronDeliveryTranscriptMirror({
			job: params.job,
			mirror: survivingMirror,
			abortSignal: params.abortSignal
		});
	};
	const finishSilentReplyDelivery = (reason) => {
		deliveryAttempted = true;
		recordDelivery("not-delivered", void 0, reason);
		return { kind: "suppressed" };
	};
	const deliverViaDirect = async (delivery) => {
		const { buildOutboundSessionContext, createOutboundSendDeps, durableMessageBatchMayHaveReachedRecipient, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore } = await deliveryOutboundRuntimeLoader.load();
		const payloadNormalization = normalizeDirectCronDeliveryPayloads({
			deliveryPayloads,
			outputText,
			summary,
			synthesizedText,
			channelTransform: resolveCronChannelReplyTransform({
				channel: delivery.channel,
				cfg: params.cfgWithAgentDefaults,
				accountId: delivery.accountId
			})
		});
		if (payloadNormalization.kind === "suppress") return finishSilentReplyDelivery(payloadNormalization.reason);
		const normalizedPayloads = payloadNormalization.payload;
		const deliveryIdempotencyKey = buildDirectCronDeliveryIdempotencyKey({
			jobId: params.job.id,
			runStartedAt: params.runStartedAt,
			delivery
		});
		let completedDelivery = false;
		try {
			completedDelivery = isCompletedDirectCronDelivery(deliveryIdempotencyKey);
		} catch (err) {
			if (!params.deliveryBestEffort) throw err;
			await logCronDeliveryWarn(`[cron:${params.job.id}] durable delivery receipt unavailable; continuing best-effort delivery: ${formatErrorMessage(err)}`);
		}
		if (completedDelivery) {
			recordDelivery("delivered");
			deliveryAttempted = true;
			return null;
		}
		const identity = resolveAgentOutboundIdentity(params.cfgWithAgentDefaults, params.agentId);
		try {
			if (params.isAborted()) return {
				kind: "error",
				error: params.abortReason()
			};
			const deliveryError = params.deliveryRequested ? resolveStaleCronDeliveryError(params) : void 0;
			if (deliveryError) {
				deliveryAttempted = true;
				recordDelivery("not-delivered", deliveryError);
				await logCronDeliveryWarn(`[cron:${params.job.id}] ${deliveryError}`);
				return { kind: "suppressed" };
			}
			const payloadsForDelivery = (await maybeApplyTtsToCronPayloads({
				cfg: params.cfgWithAgentDefaults,
				payloads: normalizedPayloads,
				delivery,
				agentId: params.agentId,
				ttsAuto: params.ttsAuto
			})).filter((p) => hasReplyPayloadContent(p, { trimText: true }));
			if (payloadsForDelivery.length === 0) {
				recordDelivery("not-delivered", "cron delivery payload was empty after TTS");
				return null;
			}
			const linkedPayloadsForDelivery = appendCronRunInspectionLink(payloadsForDelivery, resolveControlUiSessionUrl(params.cfgWithAgentDefaults, {
				sessionKey: params.runSessionKey,
				fallbackAgentId: params.agentId,
				exactKey: true
			}));
			deliveryAttempted = true;
			const { sessionKey: deliverySessionKey, route: directCronOutboundRoute } = typeof params.job.sessionTarget === "string" && params.job.sessionTarget.startsWith("session:") ? {
				sessionKey: params.agentSessionKey,
				route: null
			} : await resolveCronDeliveryRouteSessionKey({
				cfg: params.cfgWithAgentDefaults,
				job: params.job,
				agentId: params.agentId,
				agentSessionKey: params.agentSessionKey,
				delivery,
				warningContext: "direct delivery mirror"
			});
			const deliverySession = buildOutboundSessionContext({
				cfg: params.cfgWithAgentDefaults,
				agentId: params.agentId,
				sessionKey: deliverySessionKey
			});
			const awarenessMainSessionKey = resolveCronAwarenessMainSessionKey({
				cfg: params.cfgWithAgentDefaults,
				agentId: params.agentId
			});
			const mirrorTargetsAwarenessMainSession = isSameSessionKey(deliverySessionKey, awarenessMainSessionKey);
			const mirrorTargetsDeletingRunSession = params.job.deleteAfterRun === true && isCronSessionKey(params.agentSessionKey) && isSameSessionKey(deliverySessionKey, params.agentSessionKey);
			let hadPartialFailure = false;
			let completedByConcurrentDelivery = false;
			let payloadMayHaveReachedRecipientBeforeFailure = false;
			let directCronRouteCommitted = false;
			const commitDirectCronRouteEarly = async () => {
				if (directCronRouteCommitted || !directCronOutboundRoute) return;
				directCronRouteCommitted = true;
				await commitDirectCronOutboundRoute({
					cfg: params.cfgWithAgentDefaults,
					runSessionKey: params.runSessionKey,
					delivery,
					route: directCronOutboundRoute
				});
			};
			const attemptedPayloadsForMirror = [];
			const onError = params.deliveryBestEffort ? (err, _payload) => {
				logCronDeliveryErrorDeferred(`[cron:${params.job.id}] delivery payload failed (bestEffort): ${formatErrorMessage(err)}`);
			} : void 0;
			const runDelivery = async () => {
				await params.deliveryAttemptFence?.beforeAttempt();
				params.abortSignal?.throwIfAborted();
				params.deliveryAttemptFence?.assertCurrent();
				attemptedPayloadsForMirror.length = 0;
				const send = await sendDurableMessageBatchCore({
					cfg: params.cfgWithAgentDefaults,
					channel: delivery.channel,
					to: delivery.to,
					accountId: delivery.accountId,
					threadId: delivery.threadId,
					payloads: linkedPayloadsForDelivery,
					session: deliverySession,
					identity,
					bestEffort: params.deliveryBestEffort,
					durability: params.deliveryBestEffort ? "best_effort" : "required",
					deliveryIntentId: deliveryIdempotencyKey,
					reusePendingDeliveryIntent: true,
					completionRetention: DIRECT_CRON_DELIVERY_COMPLETION_RETENTION,
					deps: createOutboundSendDeps(params.deps),
					signal: params.abortSignal,
					assertDirectAdapterHandoff: params.deliveryAttemptFence?.assertCurrent,
					onError,
					onPayload: (payload) => {
						attemptedPayloadsForMirror.push(payload);
					},
					onDeliveryResult: commitDirectCronRouteEarly
				});
				payloadMayHaveReachedRecipientBeforeFailure ||= durableMessageBatchMayHaveReachedRecipient(send);
				if (send.status === "failed" && await waitForCompletedDirectCronDelivery({
					id: deliveryIdempotencyKey,
					signal: params.abortSignal
				})) {
					completedByConcurrentDelivery = true;
					return [];
				}
				if (send.status === "failed") throw send.error;
				if (send.status === "partial_failed") {
					payloadMayHaveReachedRecipientBeforeFailure = true;
					if (!params.deliveryBestEffort) throw send.error;
					hadPartialFailure = true;
					deliveryState.error ??= formatErrorMessage(send.error);
				}
				if (send.status === "suppressed") {
					const uncertain = durableMessageBatchMayHaveReachedRecipient(send);
					const reason = uncertain ? "adapter_returned_no_identity" : send.reason;
					recordDelivery(uncertain ? "unknown" : "not-delivered", `cron delivery ${uncertain ? "outcome is unknown" : "was suppressed"}: ${reason}`);
				}
				return send.status === "sent" || send.status === "partial_failed" ? send.results : [];
			};
			let deliveryResults;
			try {
				deliveryResults = await retryTransientDirectCronDelivery({
					jobId: params.job.id,
					signal: params.abortSignal,
					run: runDelivery,
					shouldRetryError: () => !payloadMayHaveReachedRecipientBeforeFailure
				});
			} catch (err) {
				const failureAwarenessText = formatTargetCronDeliveryFailureAwarenessText({
					job: params.job,
					channel: delivery.channel,
					to: delivery.to,
					threadId: stringifyRouteThreadId(delivery.threadId),
					partialDelivered: payloadMayHaveReachedRecipientBeforeFailure
				});
				await queueCronAwarenessSystemEvent({
					cfg: params.cfgWithAgentDefaults,
					jobId: params.job.id,
					agentId: params.agentId,
					deliveryIdempotencyKey: `${deliveryIdempotencyKey}:failure`,
					queueMainSession: false,
					targetSessionKey: deliverySessionKey,
					text: failureAwarenessText,
					targetText: failureAwarenessText
				});
				if (payloadMayHaveReachedRecipientBeforeFailure) await commitDirectCronRouteEarly();
				throw err;
			}
			if (completedByConcurrentDelivery) {
				recordDelivery("delivered");
				await commitDirectCronRouteEarly();
				return null;
			}
			if (deliveryResults.length > 0) recordDelivery(hadPartialFailure ? "not-delivered" : "delivered", deliveryState.error);
			if (deliveryState.delivered || payloadMayHaveReachedRecipientBeforeFailure) await commitDirectCronRouteEarly();
			const deliveryAwarenessText = resolveCronAwarenessText({
				deliveryPayloads: linkedPayloadsForDelivery,
				outboundPayloads: attemptedPayloadsForMirror
			});
			const shouldQueueAwarenessForDelivery = shouldQueueCronAwareness({
				job: params.job,
				delivery,
				deliveryBestEffort: params.deliveryBestEffort
			});
			const targetSessionAwarenessText = !params.deliveryBestEffort && (shouldQueueAwarenessForDelivery || !isSameSessionKey(deliverySessionKey, awarenessMainSessionKey)) ? deliveryAwarenessText : void 0;
			const deliveryWillReachAwarenessMainSession = mirrorTargetsAwarenessMainSession && Boolean(targetSessionAwarenessText);
			const mirrorWouldBypassIsolatedAwarenessPolicy = mirrorTargetsAwarenessMainSession && params.job.sessionTarget === "isolated" && delivery.mode !== "explicit";
			if (deliveryState.delivered && !requiresCurrentSessionCompletion && !deliveryWillReachAwarenessMainSession && !mirrorWouldBypassIsolatedAwarenessPolicy) {
				const mirrorProjection = attemptedPayloadsForMirror.length > 0 ? projectDeliveredDirectCronPayloadsForMirror(attemptedPayloadsForMirror) : projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan(buildDirectCronTranscriptMirrorPayloads(linkedPayloadsForDelivery), {
					cfg: params.cfgWithAgentDefaults,
					sessionKey: deliverySessionKey,
					surface: delivery.channel
				}));
				const mirrorText = resolveDirectCronTranscriptMirrorText(mirrorProjection);
				const transcriptMirror = {
					sessionKey: deliverySessionKey,
					agentId: params.agentId,
					...mirrorTargetsDeletingRunSession ? {
						expectedSessionId: params.sessionId,
						expectedLifecycleRevision: params.lifecycleRevision
					} : {},
					text: mirrorText,
					mediaUrls: void 0,
					storePath: resolveSessionStorePathCore(params.cfgWithAgentDefaults.session?.store, { agentId: params.agentId }),
					idempotencyKey: deliveryIdempotencyKey,
					...targetSessionAwarenessText === void 0 ? { deliveryMirror: { kind: CRON_DIRECT_DELIVERY_CONTEXT_KIND } } : {},
					config: params.cfgWithAgentDefaults
				};
				if (mirrorTargetsDeletingRunSession) deferredDeletingSessionMirror = transcriptMirror;
				else await appendAdmittedDirectCronDeliveryTranscriptMirror({
					job: params.job,
					mirror: transcriptMirror,
					abortSignal: params.abortSignal
				});
			}
			if (deliveryState.delivered && targetSessionAwarenessText) await queueCronAwarenessSystemEvent({
				cfg: params.cfgWithAgentDefaults,
				jobId: params.job.id,
				agentId: params.agentId,
				deliveryIdempotencyKey,
				queueMainSession: shouldQueueAwarenessForDelivery,
				text: targetSessionAwarenessText,
				targetSessionKey: deliverySessionKey
			});
			return null;
		} catch (err) {
			await logCronDeliveryError(`[cron:${params.job.id}] delivery failed (${params.deliveryBestEffort ? "bestEffort" : "required"}): ${formatErrorMessage(err)}`);
			deliveryState.error = normalizeCronRunErrorText(err);
			return null;
		}
	};
	const finalizeTextDelivery = async (delivery) => {
		if (!synthesizedText && !params.spawnOnlyHandoff && !(requiresCurrentSessionCompletion && params.deliveryPayloadHasStructuredContent)) return null;
		const initialSynthesizedText = synthesizedText?.trim() ?? "";
		const spawnOnlyHandoff = params.spawnOnlyHandoff;
		const { finalReply, hasUnsettledDescendants, hadDescendants } = await resolveDescendantSubagentFollowup({
			sessionKey: params.runSessionKey,
			runStartedAt: params.runStartedAt,
			timeoutMs: params.timeoutMs,
			deliveryBestEffort: params.deliveryBestEffort,
			spawnOnlyHandoff,
			initialSynthesizedText,
			abortSignal: params.abortSignal
		});
		if (finalReply) adoptSettledChildReply(finalReply);
		if (spawnOnlyHandoff && !synthesizedText?.trim()) {
			const error = params.isAborted() ? params.abortReason() : hasUnsettledDescendants ? "cron child-session handoff timed out before producing a final assistant payload" : "cron child-session handoff completed without a final assistant payload";
			deliveryAttempted = true;
			return {
				kind: "error",
				error,
				delivered: false
			};
		}
		if (!params.deliveryBestEffort && hasUnsettledDescendants) {
			deliveryAttempted = true;
			recordDelivery("not-delivered", "cron descendants are still active without a final reply");
			return { kind: "pending" };
		}
		if (hadDescendants && synthesizedText?.trim() === initialSynthesizedText && isLikelyInterimCronMessage(initialSynthesizedText) && !isSilentReplyText(initialSynthesizedText, "NO_REPLY")) {
			deliveryAttempted = true;
			recordDelivery("not-delivered", "cron descendants completed without a final reply");
			return { kind: "pending" };
		}
		const normalizedSynthesizedText = normalizeSilentReplyText(synthesizedText);
		const hasStructuredCurrentSessionCompletion = requiresCurrentSessionCompletion && params.deliveryPayloadHasStructuredContent;
		if ((normalizedSynthesizedText.text === void 0 || normalizedSynthesizedText.strippedTrailingSilentToken) && !hasStructuredCurrentSessionCompletion) return finishSilentReplyDelivery("silent");
		if (requiresCurrentSessionCompletion) {
			const normalizedPayloads = normalizeDirectCronDeliveryPayloads({
				deliveryPayloads,
				outputText,
				summary,
				synthesizedText
			});
			if (normalizedPayloads.kind === "suppress") return finishSilentReplyDelivery(normalizedPayloads.reason);
			deliveryPayloads = normalizedPayloads.payload;
		}
		synthesizedText = normalizedSynthesizedText.strippedTrailingSilentToken ? void 0 : normalizedSynthesizedText.text;
		if (synthesizedText) outputText = synthesizedText;
		if (params.isAborted()) return {
			kind: "error",
			error: params.abortReason()
		};
		if (requiresCurrentSessionCompletion) {
			deliveryAttempted = true;
			const completion = await commitCurrentSessionCronCompletion({
				...params,
				deliveryPayloads
			}, synthesizedText);
			if (!completion.ok) {
				recordDelivery("not-delivered", completion.reason);
				return failDeliveryTarget(completion.reason);
			}
			params.queueSourceSessionMessageToolAwareness = void 0;
			if (!completion.requiresExternalDelivery) {
				recordDelivery(completion.deliveryError ? "not-delivered" : "delivered", completion.deliveryError);
				return null;
			}
			recordDelivery("not-delivered");
		}
		if (!delivery) return null;
		return await deliverViaDirect(delivery);
	};
	if (params.deliveryRequested && params.skipDelivery && !sourceDeliverySatisfied) return buildDeliveryState(finishSilentReplyDelivery(params.skipDelivery));
	if (params.deliveryRequested && !params.skipDelivery && (!sourceDeliverySatisfied || requiresCurrentSessionCompletion)) {
		if (!params.resolvedDelivery.ok) {
			if (requiresCurrentSessionCompletion) return buildDeliveryState(await finalizeTextDelivery() ?? void 0);
			if (!params.deliveryBestEffort) {
				const error = params.resolvedDelivery.error.message;
				recordDelivery("not-delivered", formatDeliveryTargetError(error));
				return buildDeliveryState(failDeliveryTarget(error));
			}
			recordDelivery("not-delivered", params.resolvedDelivery.error.message);
			await logCronDeliveryWarn(`[cron:${params.job.id}] ${params.resolvedDelivery.error.message}`);
			return buildDeliveryState({ kind: "suppressed" });
		}
		if (!requiresCurrentSessionCompletion && (params.deliveryPayloadHasStructuredContent || params.resolvedDelivery.threadId != null && !params.spawnOnlyHandoff)) {
			const directResult = await deliverViaDirect(params.resolvedDelivery);
			if (directResult) return buildDeliveryState(directResult);
		} else {
			const finalizedTextResult = await finalizeTextDelivery(params.resolvedDelivery);
			if (finalizedTextResult) return buildDeliveryState(finalizedTextResult);
		}
	} else if (params.deliveryPlan.mode === "none" && params.spawnOnlyHandoff && !requiresCurrentSessionCompletion) {
		const { waitForDescendantSubagentResult } = await subagentFollowupRuntimeLoader.load();
		const settled = await waitForDescendantSubagentResult({
			sessionKey: params.runSessionKey,
			runStartedAt: params.runStartedAt,
			timeoutMs: params.timeoutMs,
			abortSignal: params.abortSignal
		});
		if (!settled?.reply || params.isAborted()) return buildDeliveryState({
			kind: "error",
			error: params.isAborted() ? params.abortReason() : settled ? "cron child-session handoff completed without a final assistant payload" : "cron child-session handoff timed out before producing a final assistant payload",
			delivered: false
		});
		if (!isSilentReplyText(settled.reply, "NO_REPLY")) adoptSettledChildReply(settled.reply);
	}
	return buildDeliveryState();
}
//#endregion
export { buildDeliveryFormatPrompt, dispatchCronDelivery, queueCronMessageToolDeliveryAwareness, resolveDeliveryTarget, resolveMessageToolDeliveryFormatPrompt };
