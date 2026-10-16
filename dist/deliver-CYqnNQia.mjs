import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as emitInternalDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DoGHpXtD.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { C as readAskUserQuestionId } from "./reply-payload-NzglYOOT.mjs";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { i as areOutboundPayloadsIntentionallySuppressed, n as OutboundDeliveryError, o as isOutboundDeliveryAdmissionClosedError, r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-CEhnMlD1.mjs";
import { c as isProvenDeliveryNotSentError, o as isDeliveryRecoveryOwnedRetry } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import { o as resolveReceiptSourceId } from "./receipt-Be_FOFUF.mjs";
import { i as markDurableDeliveryQueued, o as resolveConversationDeliveryScope, s as settleDurableDelivery } from "./delivery-completion-D_UNTyTR.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import "./delivery-queue-sqlite-CZH3GILC.mjs";
import { l as resolveOutboundPayloadMirrorText, u as summarizeOutboundPayloadForTransport } from "./payloads-RF8yW6z7.mjs";
import { a as createRenderedMessageBatchPlan, f as suppressedPayloadOutcome, n as prepareStructuredOutboundPayloadBatch, o as createChannelHandler, p as toOutboundDeliveryError, r as throwIfAborted, s as resolveOutboundDurableFinalDeliverySupport, t as prepareOutboundPayloadBatch } from "./deliver-prepare-Cs0EjsCO.mjs";
import { r as normalizeOutboundReplyFacts, t as createReplyToDeliveryPolicy } from "./reply-policy-D40tu-98.mjs";
import { _ as stripInternalRuntimeScaffoldingFromPayload, a as runOutboundDeliveryCommitHooks, d as maybeNotifyAfterDeliveredPayload, f as maybePinDeliveredMessage, g as resolveOutboundMediaAccessForSend, l as collectPayloadMediaSources, p as normalizeEmptyPayloadForDelivery, s as assertOutboundHandoffCurrent, u as deliveryKindForPayload } from "./delivery-queue-reconciliation-CMzHkur3.mjs";
import { t as diagnosticErrorCategory } from "./diagnostic-error-metadata-BSgZdc_o.mjs";
import { _ as rejectQueuedDelivery, a as emitOutboundAuditLifecycle, c as uniformOutboundAuditTerminals, d as prepareOutboundDeliveryGeneration, f as createQueuedDeliveryOwner, g as persistQueuedPreSendState, h as persistQueuedPostSendState, i as completedOutboundAuditTerminals, l as createMessageSentEmitter, m as isProvenBatchNotSent, o as emitOutboundAuditTerminals, p as findTerminalBatchRejection, r as withActiveDeliveryClaim, s as failedOutboundAuditTerminals, u as createOutboundMessageSentEmitter, v as OUTBOUND_DELIVERY_LOG_SCOPE, x as assertSessionWriterDeliveryAuthorized, y as prepareDeferredDeliveryAdmission } from "./delivery-queue-recovery-DaPZbmlq.mjs";
import { a as runWithQuestionChannelDeliveries } from "./question-channel-runtime-CQFEhZRu.mjs";
import { n as deriveDurableFinalDeliveryRequirementsForBatch, r as payloadRequiresDurablePayloadTransport } from "./capabilities-CZr1Vdri.mjs";
import { c as preparedOutboundSuppressionOutcomes, i as acceptedPreparedOutboundEntries, s as mapPreparedOutboundAcceptedPayloads } from "./delivery-queue-projection-ClfVauZ8.mjs";
import { i as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { r as createInitialDeliveryProducerClaim, t as PLATFORM_SEND_OWNER_LEASE_MS } from "./delivery-queue-sqlite-claim.kernel-DH_0k8u5.mjs";
import { t as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-DXj5mTxE.mjs";
import { n as releaseSpoolArtifacts, r as stageQueuePayloadMedia } from "./delivery-queue-media-spool-DlhI6JUi.mjs";
import { D as withStableDeliveryPreparation, E as StableDeliveryPreparationLostError, T as renewDeliveryPlatformSendLease, a as failDeliveryAfterPlatformSend, c as findDeliveryIntentOwner, d as loadPendingDelivery, i as failDelivery, n as enqueueDeliveryOnce, o as failDeliveryBeforePlatformSend, r as enqueuePreparedDeliveryOnce, t as enqueueDelivery, v as markDeliveryPlatformSendDispatched, w as claimReusableDeliveryPlatformSendAttempt } from "./delivery-queue-storage-CTPwC17-.mjs";
import { c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, n as chunkByParagraph, s as resolveChunkMode } from "./chunk-BenoswI3.mjs";
import { t as renderPresentationForDelivery } from "./presentation-delivery-CAWgRcv7.mjs";
//#region src/infra/outbound/deliver-queue-admission.ts
function restoreQueuedDeliveryCustody(params, entry) {
	const { id: _id, enqueuedAt: _enqueuedAt, retryCount: _retryCount, attemptCount: _attemptCount, requiresProducerClaim: _requiresProducerClaim, availableAt: _availableAt, producerClaimId: _producerClaimId, lastAttemptAt: _lastAttemptAt, lastError: _lastError, platformSendAttemptId: _platformSendAttemptId, platformSendStartedAt: _platformSendStartedAt, effectiveReplyToId: _effectiveReplyToId, recoveryState: _recoveryState, maxRetries: _maxRetries, legacyUnknownSendReconciliation: _legacyUnknownSendReconciliation, legacyPreparedContentUnavailable: _legacyPreparedContentUnavailable, ...custody } = entry;
	const target = params.conversationDeliveryTarget;
	const completion = custody.deliveryCompletion;
	if (target) {
		if (completion?.kind !== "conversation") throw new Error("Conversation delivery target does not match durable custody");
		resolveConversationDeliveryScope(completion, params.deliveryQueueStateDir, params.deliveryQueueStateContext, target);
	}
	const payloads = acceptedPreparedOutboundEntries(custody.preparedBatch).map((prepared) => prepared.payload);
	return {
		...params,
		...custody,
		payloads,
		sessionGeneration: entry.sessionGeneration
	};
}
/** Stages producer-owned media and atomically admits one durable outbound intent. */
async function stageAndEnqueueOutboundDelivery(params, preparedBatch, options) {
	const { channel, to } = params;
	const stateDir = params.deliveryQueueStateDir;
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const acceptedPayloads = acceptedPreparedOutboundEntries(preparedBatch).map((entry) => stripInternalRuntimeScaffoldingFromPayload(entry.payload));
	const renderedBatchPlan = params.renderedBatchPlan ?? createRenderedMessageBatchPlan(acceptedPayloads);
	if (params.deliveryIntentId && params.reusePendingDeliveryIntent) {
		const existing = await loadPendingDelivery(params.deliveryIntentId, stateDir, params.deliveryQueueStateContext);
		if (existing) return {
			id: existing.id,
			created: false
		};
	}
	const staged = await stageQueuePayloadMedia({
		stateDir,
		payloads: acceptedPayloads,
		...params.deliveryCompletion?.kind === "pending-final" && params.deliveryCompletion.commandOwnerReference !== void 0 ? { artifactFormat: "command-owner-v1" } : params.sessionGeneration ? { artifactFormat: "session-generation-v1" } : {},
		mediaAccess: resolveOutboundMediaAccessForSend(params, channel, collectPayloadMediaSources(acceptedPayloads)),
		maxBytes: resolveOutboundMediaMaxBytes({
			cfg: params.cfg,
			channel,
			accountId: params.accountId
		})
	}, params.deliveryQueueStateContext);
	if (staged.status !== "staged") {
		if (queuePolicy === "required") throw new Error(`Required durable message send is unsupported for ${channel}: ${staged.reason} cannot be persisted`);
		return null;
	}
	try {
		const initialProducerClaim = options?.claimForLiveDelivery ? createInitialDeliveryProducerClaim() : void 0;
		const queuedPreparedBatch = mapPreparedOutboundAcceptedPayloads(preparedBatch, staged.payloads);
		const delivery = {
			channel,
			to,
			accountId: params.accountId,
			queuePolicy,
			requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
			...params.reusePendingDeliveryIntent ? { requiresProducerClaim: true } : {},
			...initialProducerClaim ? { initialProducerClaim } : {},
			preparedBatch: queuedPreparedBatch,
			renderedBatchPlan,
			threadId: params.threadId,
			reply: normalizeOutboundReplyFacts(params),
			formatting: params.formatting,
			identity: params.identity,
			bestEffort: params.bestEffort,
			gifPlayback: params.gifPlayback,
			forceDocument: params.forceDocument,
			silent: params.silent,
			mirror: params.mirror,
			session: params.session,
			sessionGeneration: params.sessionGeneration,
			gatewayClientScopes: params.gatewayClientScopes,
			preparedMessageId: params.preparedMessageId,
			completionRetention: params.completionRetention,
			maxRetries: params.maxRetries,
			deliveryCompletion: params.deliveryCompletion
		};
		if (params.deliveryIntentId) {
			const preparation = await options?.getStablePreparation?.();
			const queued = preparation ? await enqueuePreparedDeliveryOnce(delivery, params.deliveryIntentId, preparation, stateDir, staged.mediaStageId, params.deliveryQueueStateContext) : await enqueueDeliveryOnce(delivery, params.deliveryIntentId, stateDir, staged.mediaStageId, params.deliveryQueueStateContext);
			if (!queued.created) {
				await cancelDeliveryQueueMediaRetention(staged.mediaStageId, stateDir, params.deliveryQueueStateContext);
				await releaseSpoolArtifacts(staged.artifacts, stateDir);
			}
			return {
				...queued,
				...queued.created && initialProducerClaim ? { producerClaimId: initialProducerClaim.producerClaimId } : {}
			};
		}
		return {
			id: await enqueueDelivery(delivery, stateDir, staged.mediaStageId, params.deliveryQueueStateContext),
			created: true,
			...initialProducerClaim ? { producerClaimId: initialProducerClaim.producerClaimId } : {}
		};
	} catch (err) {
		if (isDeliveryRecoveryOwnedRetry(err)) throw err;
		const errors = [err];
		try {
			await cancelDeliveryQueueMediaRetention(staged.mediaStageId, stateDir, params.deliveryQueueStateContext);
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		try {
			await releaseSpoolArtifacts(staged.artifacts, stateDir);
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		throwSqliteLifecycleErrors(errors, "Delivery queue admission and media cleanup failed");
		throw err;
	}
}
//#endregion
//#region src/infra/outbound/deliver-results.ts
function createDeliveryResultRecorder(params) {
	const results = params.results;
	const reportedResults = /* @__PURE__ */ new Map();
	let suppressionReason;
	const observeDeliveryResult = (delivery) => {
		if (resolveReceiptSourceId(delivery) !== void 0) return true;
		suppressionReason = delivery.outcome === "not_sent" ? suppressionReason ?? "adapter_returned_no_send" : "adapter_returned_no_identity";
		return false;
	};
	const resultIdentityKey = (delivery) => JSON.stringify([
		delivery.channel,
		delivery.messageId,
		delivery.target,
		delivery.timestamp,
		delivery.toJid,
		delivery.pollId
	]);
	const resultPlatformIds = (delivery, options) => {
		const ids = /* @__PURE__ */ new Set();
		const add = (value) => {
			const id = value?.trim();
			if (id && id !== "unknown" && id !== "suppressed") ids.add(id);
		};
		if (!options?.receiptOnly) add(delivery.messageId);
		add(delivery.receipt?.primaryPlatformMessageId);
		for (const id of delivery.receipt?.platformMessageIds ?? []) add(id);
		for (const part of delivery.receipt?.parts ?? []) add(part.platformMessageId);
		return ids;
	};
	const reportIdentifiedDeliveryResult = async (delivery) => {
		if (!observeDeliveryResult(delivery)) return;
		const resultIndex = results.length;
		results.push(delivery);
		reportedResults.set(resultIndex, resultIdentityKey(delivery));
		await params.onDeliveryResult?.(delivery);
	};
	const recordIdentifiedDeliveryResults = async (deliveries, options) => {
		if (deliveries.length === 0) suppressionReason = "adapter_returned_no_identity";
		try {
			const recorded = [];
			const availableReported = options?.finalResultIsLastReported ? new Map([...reportedResults].toReversed()) : reportedResults;
			const takeReported = (matches) => {
				for (const [resultIndex, identityKey] of availableReported) if (matches(resultIndex, identityKey)) {
					availableReported.delete(resultIndex);
					return resultIndex;
				}
			};
			const replacements = /* @__PURE__ */ new Map();
			const appendResults = [];
			for (const delivery of deliveries) {
				if (!observeDeliveryResult(delivery)) {
					recorded.push(false);
					continue;
				}
				const receiptPartIds = (delivery.receipt?.parts ?? []).map((part) => part.platformMessageId?.trim()).filter((id) => Boolean(id && id !== "unknown" && id !== "suppressed"));
				const receiptIds = receiptPartIds.length > 0 ? receiptPartIds : [...resultPlatformIds(delivery, { receiptOnly: true })];
				let reportedIndex;
				for (const receiptId of receiptIds) {
					const matchingIndex = takeReported((index) => {
						const result = results[index];
						return result?.channel === delivery.channel && resultPlatformIds(result).has(receiptId);
					});
					if (matchingIndex !== void 0) {
						replacements.set(matchingIndex, null);
						reportedIndex = Math.min(reportedIndex ?? matchingIndex, matchingIndex);
					}
				}
				if (reportedIndex === void 0) {
					const identityKey = resultIdentityKey(delivery);
					reportedIndex = takeReported((_index, reportedKey) => reportedKey === identityKey);
				}
				if (reportedIndex !== void 0) replacements.set(reportedIndex, delivery);
				else appendResults.push(delivery);
				recorded.push(true);
			}
			if (replacements.size > 0) {
				const reconciled = results.flatMap((result, index) => {
					const replacement = replacements.get(index);
					return replacement === null ? [] : [replacement ?? result];
				});
				results.splice(0, results.length, ...reconciled);
			}
			for (const delivery of appendResults) {
				results.push(delivery);
				await params.onDeliveryResult?.(delivery);
			}
			return recorded;
		} finally {
			reportedResults.clear();
		}
	};
	const recordIdentifiedDeliveryResult = async (delivery) => (await recordIdentifiedDeliveryResults([delivery], { finalResultIsLastReported: true }))[0] ?? false;
	return {
		recordIdentifiedDeliveryResult,
		recordIdentifiedDeliveryResults,
		reportIdentifiedDeliveryResult,
		getSuppressionReason: () => suppressionReason,
		resetPayloadResults: () => {
			reportedResults.clear();
			suppressionReason = void 0;
		}
	};
}
//#endregion
//#region src/infra/outbound/deliver-transcript.ts
const log$3 = createSubsystemLogger("outbound/deliver");
const loadTranscriptRuntime = createLazyRuntimeModule(() => import("./transcript.runtime.js"));
async function mirrorDeliveredPayloads(params) {
	const mirror = params.delivery.mirror;
	if (!mirror || params.payloads.length === 0) return;
	const deliveredMirror = {
		text: params.payloads.map((payload) => payload.hookContent ?? resolveOutboundPayloadMirrorText(payload)).filter((text) => text.trim()).join("\n"),
		mediaUrls: params.payloads.flatMap((payload) => payload.mediaUrls)
	};
	const mirrorText = resolveMirroredTranscriptText({
		text: deliveredMirror.text,
		mediaUrls: deliveredMirror.mediaUrls
	});
	if (!mirrorText) return;
	try {
		const { appendAssistantMessageToSessionTranscript } = await loadTranscriptRuntime();
		const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: mirror.sessionKey });
		const mirrorResult = await appendAssistantMessageToSessionTranscript({
			agentId: mirror.agentId,
			sessionKey: mirror.sessionKey,
			expectedSessionId: mirror.expectedSessionId,
			...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
			...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
			text: mirrorText,
			idempotencyKey: mirror.idempotencyKey,
			deliveryMirror: mirror.deliveryMirror,
			config: params.delivery.cfg
		});
		if (!mirrorResult.ok) log$3.warn(`failed to mirror outbound delivery into session transcript; channel send already succeeded: ${mirrorResult.reason}`, {
			channel: params.channel,
			to: params.to,
			sessionKey: mirror.sessionKey
		});
	} catch (err) {
		log$3.warn(`failed to mirror outbound delivery into session transcript; channel send already succeeded: ${formatErrorMessage(err)}`, {
			channel: params.channel,
			to: params.to,
			sessionKey: mirror.sessionKey
		});
	}
}
//#endregion
//#region src/infra/outbound/message-plan.ts
function assertStableMediaFanout(params, payloadIndex, originalMediaCount, effective) {
	if (!params.requiredUnknownSendReconciliation) return;
	if ((params.renderedBatchPlan?.items[payloadIndex]?.mediaUrls.length ?? originalMediaCount) !== effective.mediaUrls.length) throw new Error(`Required durable message send changed platform fan-out after outbound transforms for ${params.channel}`);
}
function withPlannedReplyTo(overrides, consumeReplyTo) {
	return consumeReplyTo ? consumeReplyTo({ ...overrides }) : { ...overrides };
}
/** Plans text sends, preserving reply-to policy across chunked delivery units. */
function planOutboundTextMessageUnits(params) {
	const planTextUnit = (text, deliveryPartIndex, chunkedTextFormatting) => {
		const overrides = {
			...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
			deliveryPartIndex
		};
		return {
			kind: "text",
			text,
			overrides: chunkedTextFormatting ? {
				...overrides,
				formatting: {
					...overrides.formatting,
					...chunkedTextFormatting
				}
			} : overrides
		};
	};
	const withDeliveryTopology = (units) => {
		const deliveryPartCount = units.length;
		for (const unit of units) unit.overrides.deliveryPartCount = deliveryPartCount;
		return units;
	};
	if (!params.chunker || params.textLimit === void 0) return withDeliveryTopology([planTextUnit(params.text, 0)]);
	const blockChunks = params.chunkMode !== "newline" ? [params.text] : (params.chunkerMode ?? "text") === "markdown" ? chunkMarkdownTextWithMode(params.text, params.textLimit, "newline") : chunkByParagraph(params.text, params.textLimit, { splitLongParagraphs: false });
	if (!blockChunks.length && params.text) blockChunks.push(params.text);
	const units = [];
	for (const blockChunk of blockChunks) {
		const chunks = params.formatting ? params.chunker(blockChunk, params.textLimit, { formatting: params.formatting }) : params.chunker(blockChunk, params.textLimit);
		for (const chunk of chunks.length === 0 && blockChunk ? [blockChunk] : chunks) units.push(planTextUnit(chunk, units.length, params.chunkedTextFormatting));
	}
	return withDeliveryTopology(units);
}
/** Plans media sends with a caption only on the leading media unit. */
function planOutboundMediaMessageUnits(params) {
	const deliveryPartCount = params.mediaUrls.length;
	return params.mediaUrls.map((mediaUrl, index) => ({
		kind: "media",
		mediaUrl,
		...index === 0 ? { caption: params.caption } : {},
		overrides: {
			...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
			deliveryPartIndex: index,
			deliveryPartCount
		}
	}));
}
//#endregion
//#region src/infra/outbound/deliver-core.ts
const log$2 = createSubsystemLogger("outbound/deliver");
async function deliverOutboundPayloadsCore(params) {
	const { cfg, channel, to } = params;
	const preparedBatch = params.preparedBatch;
	if (!preparedBatch) throw new Error("Outbound delivery requires a prepared payload batch");
	const accountId = params.accountId;
	const reply = params.reply;
	const deps = params.deps;
	const abortSignal = params.abortSignal;
	const results = [];
	const { recordIdentifiedDeliveryResult, recordIdentifiedDeliveryResults, reportIdentifiedDeliveryResult, getSuppressionReason, resetPayloadResults } = createDeliveryResultRecorder({
		results,
		onDeliveryResult: params.onDeliveryResult
	});
	let activeSourceIndex;
	let payloadSendStarted;
	const createHandler = (mediaSources) => createChannelHandler({
		cfg,
		agentId: params.session?.agentId,
		channel,
		to,
		deps,
		accountId,
		replyToId: reply?.replyToId,
		replyToMode: reply?.source === "implicit" ? reply.mode : void 0,
		formatting: params.formatting,
		threadId: params.threadId,
		identity: params.identity,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		abortSignal,
		mediaAccess: resolveOutboundMediaAccessForSend(params, channel, mediaSources),
		gatewayClientScopes: params.gatewayClientScopes,
		conversationReadOrigin: params.conversationReadOrigin,
		deliveryQueueId: params.deliveryQueueId,
		preparedMessageId: params.preparedMessageId,
		requiredUnknownSendReconciliation: params.requiredUnknownSendReconciliation,
		onPlatformSendStart: async (route) => {
			payloadSendStarted = true;
			await params.onPlatformSendStart?.(route, activeSourceIndex);
		},
		onDirectAdapterHandoff: params.onDirectAdapterHandoff,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		onDeliveryResult: reportIdentifiedDeliveryResult
	});
	const baseHandler = await createHandler([]);
	let preparedTarget = baseHandler.buildTargetRef({ threadId: params.threadId });
	const maybeAdoptTargetFromDelivery = (result) => {
		if (params.threadId != null || preparedTarget.threadId != null) return;
		const adoptedTarget = baseHandler.adoptTargetFromDelivery?.({
			target: preparedTarget,
			result
		});
		if (adoptedTarget?.threadId != null) preparedTarget = {
			...preparedTarget,
			threadId: adoptedTarget.threadId
		};
	};
	const withPreparedTarget = (overrides) => preparedTarget.threadId == null ? overrides : {
		...overrides,
		threadId: preparedTarget.threadId
	};
	const adoptSuccessfulResultsSince = (resultIndex) => {
		for (const result of results.slice(resultIndex)) maybeAdoptTargetFromDelivery(result);
	};
	const handlerByMediaSources = /* @__PURE__ */ new Map();
	const getDeliveryHandler = (mediaSources) => {
		if (mediaSources.length === 0) return Promise.resolve(baseHandler);
		const key = JSON.stringify(mediaSources);
		return getOrCreatePromise(handlerByMediaSources, key, () => createHandler(mediaSources));
	};
	const configuredTextLimit = baseHandler.chunker ? resolveTextChunkLimit(cfg, channel, accountId, { fallbackLimit: baseHandler.textChunkLimit }) : void 0;
	const textLimit = params.formatting?.textLimit ?? (baseHandler.resolveEffectiveTextChunkLimit ? baseHandler.resolveEffectiveTextChunkLimit({
		fallbackLimit: configuredTextLimit,
		formatting: params.formatting
	}) : configuredTextLimit);
	const chunkMode = baseHandler.chunker ? params.formatting?.chunkMode ?? resolveChunkMode(cfg, channel, accountId) : "length";
	const { resolveCurrentReplyTo, applyReplyToConsumption } = createReplyToDeliveryPolicy({ reply });
	const sendTextChunks = async (sendHandler, text, overrides = {}) => {
		const units = planOutboundTextMessageUnits({
			text,
			overrides,
			chunker: sendHandler.chunker,
			chunkerMode: sendHandler.chunkerMode,
			chunkedTextFormatting: sendHandler.chunkedTextFormatting,
			textLimit,
			chunkMode,
			formatting: params.formatting,
			consumeReplyTo: (value) => applyReplyToConsumption(value, { consumeImplicitReply: value.replyToIdSource === "implicit" })
		});
		for (const unit of units) {
			throwIfAborted(abortSignal);
			const resultIndex = results.length;
			await recordIdentifiedDeliveryResult(await sendHandler.sendText(unit.text, withPreparedTarget(unit.overrides)));
			adoptSuccessfulResultsSince(resultIndex);
		}
	};
	const acceptedEntries = acceptedPreparedOutboundEntries(preparedBatch);
	const payloadOutcomes = [...preparedOutboundSuppressionOutcomes(preparedBatch)];
	for (const outcome of payloadOutcomes) params.onPayloadDeliveryOutcome?.(outcome);
	const deliveredMirrorPayloads = [];
	const recordDeliveredPayload = (payloadSummary) => {
		try {
			params.onDeliveredPayload?.(payloadSummary);
		} catch (error) {
			log$2.warn("Outbound delivered-payload observer failed after platform send.", {
				channel,
				to,
				error: formatErrorMessage(error)
			});
		}
		if (params.mirror) deliveredMirrorPayloads.push(payloadSummary);
	};
	const diagnosticSessionKey = params.mirror?.sessionKey ?? params.session?.key ?? params.session?.policyKey;
	for (const [deliveryPayloadIndex, preparedEntry] of acceptedEntries.entries()) {
		resetPayloadResults();
		const payloadIndex = preparedEntry.sourceIndex;
		activeSourceIndex = payloadIndex;
		payloadSendStarted = false;
		const payload = preparedEntry.payload;
		const payloadResultStartIndex = results.length;
		let effectivePayload;
		let payloadSummary = summarizeOutboundPayloadForTransport(payload);
		const originalMediaCount = preparedEntry.preparedMediaCount;
		let effectiveDeliveryKind;
		const recordPayloadOutcome = (outcome) => {
			const recordedOutcome = effectiveDeliveryKind && outcome.status !== "suppressed" ? {
				...outcome,
				deliveryKind: effectiveDeliveryKind
			} : outcome;
			payloadOutcomes.push(recordedOutcome);
			params.onPayloadDeliveryOutcome?.(recordedOutcome);
		};
		let deliveryKind = "other";
		let deliveryStartedAt = 0;
		let deliveryPending = false;
		let messageSentEventRecorded = false;
		const recordMessageSentEvent = (event) => {
			if (messageSentEventRecorded) return;
			messageSentEventRecorded = true;
			params.onMessageSentEvent?.(event, payloadIndex);
		};
		const startDeliveryDiagnostics = (kind) => {
			deliveryKind = kind;
			deliveryStartedAt = Date.now();
			deliveryPending = true;
			emitInternalDiagnosticEvent({
				type: "message.delivery.started",
				channel,
				deliveryKind,
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		const completeDeliveryDiagnostics = (resultCount) => {
			if (!deliveryPending) return;
			deliveryPending = false;
			emitInternalDiagnosticEvent({
				type: "message.delivery.completed",
				channel,
				deliveryKind,
				durationMs: Date.now() - deliveryStartedAt,
				resultCount,
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		const errorDeliveryDiagnostics = (err) => {
			if (!deliveryPending) return;
			deliveryPending = false;
			emitInternalDiagnosticEvent({
				type: "message.delivery.error",
				channel,
				deliveryKind,
				durationMs: Date.now() - deliveryStartedAt,
				errorCategory: diagnosticErrorCategory(err),
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		try {
			throwIfAborted(abortSignal);
			const presentationHandler = await getDeliveryHandler(summarizeOutboundPayloadForTransport(payload).mediaUrls);
			const renderedPayload = stripInternalRuntimeScaffoldingFromPayload(await renderPresentationForDelivery(presentationHandler, payload));
			const renderedHandler = await getDeliveryHandler(summarizeOutboundPayloadForTransport(renderedPayload).mediaUrls);
			const normalizedEffectivePayload = (preparedBatch.channelNormalized !== true || renderedPayload !== payload) && renderedHandler.normalizePayload ? renderedHandler.normalizePayload(renderedPayload) : renderedPayload;
			effectivePayload = normalizedEffectivePayload ? normalizeEmptyPayloadForDelivery(stripInternalRuntimeScaffoldingFromPayload(normalizedEffectivePayload)) : null;
			if (!effectivePayload) {
				recordPayloadOutcome(suppressedPayloadOutcome({
					index: payloadIndex,
					reason: preparedEntry.messageHookChanged ? "empty_after_message_sending_hook" : preparedEntry.replyHookChanged ? "empty_after_reply_payload_sending_hook" : "no_visible_payload"
				}));
				continue;
			}
			const effectivePayloadSummary = summarizeOutboundPayloadForTransport(effectivePayload);
			assertStableMediaFanout(params, deliveryPayloadIndex, originalMediaCount, effectivePayloadSummary);
			payloadSummary = effectivePayloadSummary;
			const deliveryHandler = await getDeliveryHandler(payloadSummary.mediaUrls);
			effectiveDeliveryKind = deliveryKindForPayload(effectivePayload, payloadSummary);
			startDeliveryDiagnostics(effectiveDeliveryKind);
			params.onPayload?.(payloadSummary);
			const replyToResolution = resolveCurrentReplyTo(effectivePayload);
			const sendOverrides = {
				replyToId: replyToResolution.replyToId,
				replyToIdSource: replyToResolution.source,
				...preparedTarget.threadId != null ? { threadId: preparedTarget.threadId } : {},
				...effectivePayload.audioAsVoice === true ? { audioAsVoice: true } : {},
				...params.forceDocument !== void 0 ? { forceDocument: params.forceDocument } : {}
			};
			const applySendReplyToConsumption = (overrides) => applyReplyToConsumption(overrides, { consumeImplicitReply: replyToResolution.source === "implicit" });
			const deliveryTarget = () => deliveryHandler.buildTargetRef({ threadId: preparedTarget.threadId });
			const beforeCount = results.length;
			let mirroredPayload = payloadSummary;
			let mediaMessageIds;
			if (deliveryHandler.sendPayload && (deliveryHandler.supportsMediaPayload && payloadSummary.mediaUrls.length > 1 || payloadRequiresDurablePayloadTransport(effectivePayload, { sendTextOnlyErrorPayloads: deliveryHandler.sendTextOnlyErrorPayloads }))) {
				await recordIdentifiedDeliveryResult(await deliveryHandler.sendPayload(effectivePayload, withPreparedTarget(applySendReplyToConsumption(sendOverrides))));
				adoptSuccessfulResultsSince(beforeCount);
				if (results.slice(beforeCount).length === 0) {
					completeDeliveryDiagnostics(0);
					recordPayloadOutcome(suppressedPayloadOutcome({
						index: payloadIndex,
						reason: getSuppressionReason() ?? "adapter_returned_no_identity"
					}));
					continue;
				}
			} else if (payloadSummary.mediaUrls.length === 0) {
				if (deliveryHandler.sendFormattedText) {
					await recordIdentifiedDeliveryResults(await deliveryHandler.sendFormattedText(payloadSummary.text, withPreparedTarget(applySendReplyToConsumption(sendOverrides))));
					adoptSuccessfulResultsSince(beforeCount);
				} else await sendTextChunks(deliveryHandler, payloadSummary.text, sendOverrides);
			} else if (!deliveryHandler.supportsMedia) {
				log$2.warn("Plugin outbound adapter does not implement sendMedia or sendFormattedMedia; media URLs will be dropped and text fallback will be used", {
					channel,
					to,
					mediaCount: payloadSummary.mediaUrls.length
				});
				const fallbackText = payloadSummary.text.trim();
				if (!fallbackText) throw new Error("Plugin outbound adapter does not implement sendMedia or sendFormattedMedia and no text fallback is available for media payload");
				await sendTextChunks(deliveryHandler, fallbackText, sendOverrides);
				mirroredPayload = {
					...payloadSummary,
					text: fallbackText,
					mediaUrls: []
				};
			} else {
				mediaMessageIds = {};
				const mediaUnits = planOutboundMediaMessageUnits({
					mediaUrls: payloadSummary.mediaUrls,
					caption: payloadSummary.text,
					overrides: sendOverrides,
					consumeReplyTo: applySendReplyToConsumption
				});
				const sendMedia = deliveryHandler.sendFormattedMedia ?? deliveryHandler.sendMedia;
				for (const unit of mediaUnits) {
					throwIfAborted(abortSignal);
					const resultIndex = results.length;
					const delivery = await sendMedia(unit.caption ?? "", unit.mediaUrl, withPreparedTarget(unit.overrides));
					const recorded = await recordIdentifiedDeliveryResult(delivery);
					adoptSuccessfulResultsSince(resultIndex);
					if (recorded) {
						mediaMessageIds.first ??= delivery.messageId;
						mediaMessageIds.last = delivery.messageId;
					}
				}
			}
			const deliveredResults = results.slice(beforeCount);
			if (deliveredResults.length > 0) {
				recordPayloadOutcome({
					index: payloadIndex,
					status: "sent",
					results: deliveredResults
				});
				recordDeliveredPayload(mirroredPayload);
			} else {
				recordPayloadOutcome(suppressedPayloadOutcome({
					index: payloadIndex,
					reason: getSuppressionReason() ?? "adapter_returned_no_identity"
				}));
				if (getSuppressionReason() === "adapter_returned_no_send") {
					completeDeliveryDiagnostics(0);
					continue;
				}
			}
			const firstMessageId = mediaMessageIds ? mediaMessageIds.first : deliveredResults.find((entry) => entry.messageId)?.messageId;
			const lastMessageId = mediaMessageIds ? mediaMessageIds.last : deliveredResults.at(-1)?.messageId;
			recordMessageSentEvent({
				success: deliveredResults.length > 0,
				content: payloadSummary.hookContent ?? payloadSummary.text,
				messageId: lastMessageId
			});
			await maybePinDeliveredMessage({
				handler: deliveryHandler,
				payload: effectivePayload,
				target: deliveryTarget(),
				messageId: firstMessageId,
				gatewayClientScopes: params.gatewayClientScopes,
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
			});
			await maybeNotifyAfterDeliveredPayload({
				handler: deliveryHandler,
				payload: effectivePayload,
				target: deliveryTarget(),
				results: deliveredResults
			});
			completeDeliveryDiagnostics(deliveredResults.length);
		} catch (caughtError) {
			let err = caughtError;
			if (!payloadSendStarted) try {
				assertOutboundHandoffCurrent(params.assertDirectAdapterHandoff);
			} catch (rejection) {
				err = rejection;
			}
			const failedPayloadResults = results.slice(payloadResultStartIndex);
			adoptSuccessfulResultsSince(payloadResultStartIndex);
			if (effectivePayload && failedPayloadResults.length > 0) await maybeNotifyAfterDeliveredPayload({
				handler: await getDeliveryHandler(summarizeOutboundPayloadForTransport(effectivePayload).mediaUrls),
				payload: effectivePayload,
				target: baseHandler.buildTargetRef({ threadId: preparedTarget.threadId }),
				results: failedPayloadResults
			});
			recordPayloadOutcome({
				index: payloadIndex,
				status: "failed",
				error: err,
				sentBeforeError: failedPayloadResults.length > 0 || getSuppressionReason() === "adapter_returned_no_identity",
				stage: "platform_send",
				results: failedPayloadResults
			});
			errorDeliveryDiagnostics(err);
			recordMessageSentEvent({
				success: false,
				content: payloadSummary.hookContent ?? payloadSummary.text,
				error: formatErrorMessage(err),
				...failedPayloadResults.at(-1)?.messageId ? { messageId: failedPayloadResults.at(-1).messageId } : {}
			});
			if (!params.bestEffort) throw toOutboundDeliveryError({
				error: err,
				results,
				payloadOutcomes,
				stage: "platform_send"
			});
			params.onError?.(err, payloadSummary);
		}
	}
	await mirrorDeliveredPayloads({
		delivery: params,
		payloads: deliveredMirrorPayloads,
		channel,
		to
	});
	return results;
}
//#endregion
//#region src/infra/outbound/deliver-queue-execute.ts
const log$1 = createSubsystemLogger("outbound/deliver");
async function deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt, producerClaimId, producerLease) {
	const throwIfProducerLeaseLost = () => {
		if (producerLease?.signal.aborted) throw producerLease.signal.reason;
	};
	const payloadCount = params.preparedBatch?.sourcePayloadCount ?? params.payloads.length;
	const ownsAuditTerminal = params.deliveryQueueId === void 0;
	const payloadOutcomes = [];
	const reusableProducerClaimId = params.reusePendingDeliveryIntent ? producerClaimId : void 0;
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const platformQueueId = queueId ?? params.deliveryQueueId;
	const platformQueuePolicy = queueId ? queuePolicy : params.queuePolicy ?? "required";
	const platformQueueStateDir = params.deliveryQueueStateDir;
	const exactReconciliationRequired = params.requireUnknownSendReconciliation === true && platformQueueId !== void 0;
	let queuedPreSendState;
	let queuedPostSendState;
	let platformSendStarted = false;
	let platformSendRoute;
	let platformSendSourceIndex;
	const auditPlatformStartedPayloads = /* @__PURE__ */ new Set();
	const platformDispatchedPayloads = /* @__PURE__ */ new Set();
	let deliveredResults = [];
	let allPayloadsSuppressed = false;
	let commitHooksRun = false;
	const settleDeliveryCompletion = async (result) => {
		if (!params.deliveryCompletion) return;
		await settleDurableDelivery(params.deliveryCompletion, result ? { result } : { platformSendStarted: platformSendStarted && !allPayloadsSuppressed }, platformQueueStateDir, params.deliveryQueueStateContext, params.conversationDeliveryTarget);
	};
	const messageSentEvents = [];
	const { emitMessageSent, hasMessageSentHooks, sessionKeyForInternalHooks } = createOutboundMessageSentEmitter(params, OUTBOUND_DELIVERY_LOG_SCOPE);
	if (hasMessageSentHooks && params.session?.agentId && !sessionKeyForInternalHooks) log$1.warn(`${OUTBOUND_DELIVERY_LOG_SCOPE}: session.agentId present without session key; internal message:sent hook will be skipped`, {
		channel: params.channel,
		to: params.to,
		agentId: params.session.agentId
	});
	const flushMessageSentEvents = () => {
		if (params.deferCommitHooks) return;
		for (const event of messageSentEvents) emitMessageSent(event);
		messageSentEvents.length = 0;
	};
	const queueOwner = queueId ? params.deliveryQueueOwner : void 0;
	const persistPostSendState = (owner) => persistQueuedPostSendState({
		owner,
		queuePolicy,
		preserveBatch: Boolean(reusableProducerClaimId)
	}, params.deliveryQueueStateContext);
	const emitTerminals = (terminals) => {
		if (!ownsAuditTerminal) return;
		emitOutboundAuditTerminals({
			context: params,
			terminals,
			startedAt: auditStartedAt,
			...queueId ? { queueId } : {}
		});
	};
	const runCommitHooksAfterAck = async () => {
		if (queuedPostSendState !== "acked" || params.deferCommitHooks || commitHooksRun) return;
		commitHooksRun = true;
		flushMessageSentEvents();
		if (deliveredResults.length > 0) await runOutboundDeliveryCommitHooks(deliveredResults);
	};
	const failedTerminals = (failureStage) => failedOutboundAuditTerminals({
		payloadCount,
		results: deliveredResults,
		payloadOutcomes,
		failureStage
	});
	const emitFailedTerminals = (failureStage) => emitTerminals(() => failedTerminals(failureStage));
	const finishPermanentRejection = async (owner, rejection) => {
		const terminals = failedTerminals("platform_send");
		if (await rejectQueuedDelivery(owner, rejection, params, terminals)) {
			queuedPostSendState = "acked";
			await runCommitHooksAfterAck();
			emitTerminals(() => terminals);
		}
	};
	let releaseCancelledPreparation;
	let cancelledPreparationRetirement;
	const cancelBeforeSend = () => {
		if (!queueOwner || platformSendStarted || queuedPostSendState !== void 0 || cancelledPreparationRetirement) return;
		cancelledPreparationRetirement = (async () => {
			await producerLease?.stop();
			try {
				releaseCancelledPreparation = await queueOwner.retireUnsent();
				if (releaseCancelledPreparation) {
					queuedPostSendState = "acked";
					emitTerminals(() => uniformOutboundAuditTerminals(payloadCount, {
						outcome: "failed",
						failureStage: "queue"
					}));
				}
			} catch (error) {
				log$1.warn(`failed to retire cancelled delivery ${queueId}: ${formatErrorMessage(error)}`);
			}
		})();
		cancelledPreparationRetirement.catch((error) => {
			log$1.warn(`failed to stop cancelled delivery ${queueId}: ${formatErrorMessage(error)}`);
		});
	};
	let generation;
	const assertPlatformSendAuthorized = () => {
		throwIfAborted(params.abortSignal);
		assertSessionWriterDeliveryAuthorized(params.deliveryCompletion?.kind === "pending-final" ? params.deliveryCompletion.sessionWriterDeliveryAuthority : void 0);
	};
	const wrappedParams = {
		...params,
		...exactReconciliationRequired && params.payloads.length === 1 ? { deliveryQueueId: platformQueueId } : { deliveryQueueId: void 0 },
		requiredUnknownSendReconciliation: exactReconciliationRequired,
		onPlatformSendStart: async (route, sourceIndex) => {
			throwIfAborted(params.abortSignal);
			platformSendRoute = route;
			platformSendSourceIndex = sourceIndex;
			if (params.deliveryQueueOwner && !exactReconciliationRequired && queuedPreSendState === void 0) {
				queuedPreSendState = await persistQueuedPreSendState({
					owner: params.deliveryQueueOwner,
					queuePolicy: platformQueuePolicy,
					route,
					retainSpoolArtifacts: queueId === null && params.deliveryQueueId !== void 0
				}, params.deliveryQueueStateContext);
				if (queueId && queuedPreSendState === "acked") queuedPostSendState = "acked";
			}
			if (platformQueueId && sourceIndex !== void 0 && !auditPlatformStartedPayloads.has(sourceIndex)) {
				auditPlatformStartedPayloads.add(sourceIndex);
				emitOutboundAuditLifecycle({
					context: params,
					outcome: "platform_started",
					queueId: platformQueueId,
					startedAt: auditStartedAt,
					payloadIndexes: [sourceIndex]
				});
			}
			throwIfAborted(params.abortSignal);
			await params.onPlatformSendStart?.(route);
			throwIfAborted(params.abortSignal);
			platformSendStarted = true;
		},
		onDirectAdapterHandoff: async () => {
			assertPlatformSendAuthorized();
			await params.onPlatformSendDispatch?.();
			throwIfAborted(params.abortSignal);
			generation?.assertCurrent();
		},
		assertDirectAdapterHandoff: () => {
			generation?.assertCurrent();
			params.assertDirectAdapterHandoff?.();
			assertPlatformSendAuthorized();
		},
		onPlatformSendDispatch: async () => {
			throwIfAborted(params.abortSignal);
			if (platformQueueId && queuedPreSendState !== "acked" && queuedPostSendState === void 0) try {
				await markDeliveryPlatformSendDispatched(platformQueueId, platformQueueStateDir, platformSendRoute, producerClaimId || void 0, params.deliveryQueueStateContext);
				queuedPreSendState ??= "marked";
			} catch (dispatchMarkError) {
				if (exactReconciliationRequired || producerClaimId) throw dispatchMarkError;
				log$1.warn(`failed to refresh queued delivery ${platformQueueId} at platform dispatch; continuing best-effort send: ${formatErrorMessage(dispatchMarkError)}`);
			}
			assertPlatformSendAuthorized();
			await params.onPlatformSendDispatch?.();
			throwIfAborted(params.abortSignal);
			generation?.assertCurrent();
			if (platformSendSourceIndex !== void 0) platformDispatchedPayloads.add(platformSendSourceIndex);
		},
		onError: (err, payload) => {
			throwIfProducerLeaseLost();
			params.onError?.(err, payload);
		},
		onPayloadDeliveryOutcome: (outcome) => {
			if (outcome.status === "failed" && platformDispatchedPayloads.has(outcome.index) && !isProvenDeliveryNotSentError(outcome.error)) outcome.sentBeforeError = true;
			payloadOutcomes.push(outcome);
			params.onPayloadDeliveryOutcome?.(outcome);
		},
		onDeliveryResult: async (result) => {
			deliveredResults.push(result);
			if (queueOwner && queuedPostSendState === void 0) queuedPostSendState = await persistPostSendState(queueOwner);
			await params.onDeliveryResult?.(result);
		},
		onMessageSentEvent: (event, sourceIndex) => {
			messageSentEvents.push(event);
			params.onMessageSentEvent?.(event, sourceIndex);
		}
	};
	let platformResultsReturned = false;
	try {
		params.abortSignal?.addEventListener("abort", cancelBeforeSend, { once: true });
		if (params.abortSignal?.aborted) cancelBeforeSend();
		throwIfProducerLeaseLost();
		if (params.sessionGeneration !== void 0) {
			generation = await prepareOutboundDeliveryGeneration(params.sessionGeneration);
			throwIfProducerLeaseLost();
		}
		const conversationAttemptAuthority = params.deliveryCompletion?.kind === "conversation" ? params.deliveryCompletion : params.conversationDeliveryAttemptAuthority;
		if (conversationAttemptAuthority) {
			if (!conversationAttemptAuthority.routeFingerprint || !params.onDeliveryAttempt) throw new PlatformMessageNotDispatchedError("Conversation delivery is missing its current route authorization", {
				cause: void 0,
				retryable: false
			});
			await params.onDeliveryAttempt();
			throwIfProducerLeaseLost();
		}
		const results = await deliverOutboundPayloadsCore(wrappedParams);
		params.abortSignal?.removeEventListener("abort", cancelBeforeSend);
		await cancelledPreparationRetirement;
		if (releaseCancelledPreparation) throwIfAborted(params.abortSignal);
		deliveredResults = results;
		const failedOutcomes = payloadOutcomes.filter((outcome) => outcome.status === "failed");
		allPayloadsSuppressed = results.length === 0 && areOutboundPayloadsIntentionallySuppressed(payloadOutcomes);
		throwIfProducerLeaseLost();
		platformResultsReturned = true;
		if (queueOwner && reusableProducerClaimId && results.length > 0 && payloadOutcomes.some((outcome) => outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity")) {
			const error = "platform send returned no delivery identity for part of the delivery batch";
			await queueOwner.fail(failDeliveryAfterPlatformSend, error);
			queuedPostSendState = "failed";
			throw new OutboundDeliveryError(error, {
				cause: /* @__PURE__ */ new Error(error),
				results,
				payloadOutcomes,
				stage: "platform_send"
			});
		}
		if (!queueId) {
			await settleDeliveryCompletion(results.at(-1));
			if (!params.deferCommitHooks) {
				flushMessageSentEvents();
				await runOutboundDeliveryCommitHooks(results);
			}
			emitTerminals(() => failedOutcomes.length > 0 ? failedOutboundAuditTerminals({
				payloadCount,
				results,
				payloadOutcomes,
				failureStage: "platform_send"
			}) : completedOutboundAuditTerminals({
				payloadCount,
				results,
				payloadOutcomes
			}));
			return results;
		}
		if (queueOwner) {
			if (failedOutcomes.length > 0) {
				const partialFailuresAreProvenNotSent = failedOutcomes.every((outcome) => isProvenDeliveryNotSentError(outcome.error));
				const partialSendEvidence = results.length > 0 || payloadOutcomes.some((outcome) => outcome.status === "failed" ? outcome.sentBeforeError : outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity");
				const postSendState = queuedPostSendState ?? (partialSendEvidence ? await persistPostSendState(queueOwner) : void 0);
				const permanentRejection = !partialSendEvidence && postSendState === void 0 ? findTerminalBatchRejection(failedOutcomes.map((outcome) => outcome.error)) : void 0;
				if (permanentRejection) {
					await finishPermanentRejection(queueOwner, permanentRejection);
					return results;
				}
				const error = "partial delivery failure (bestEffort)";
				if (postSendState === void 0 || postSendState === "marked") {
					const recordFailure = !partialSendEvidence && partialFailuresAreProvenNotSent ? failDeliveryBeforePlatformSend : failDelivery;
					await queueOwner.fail(recordFailure, error).catch((err) => {
						log$1.warn(`failed to mark queued delivery ${queueId} as failed after partial failure; continuing best-effort delivery: ${formatErrorMessage(err)}`);
					});
				} else if (postSendState === "acked") {
					await runCommitHooksAfterAck();
					emitFailedTerminals("platform_send");
				}
			} else {
				const postSendState = queuedPostSendState ?? (results.length > 0 || queuedPreSendState === "marked" && !allPayloadsSuppressed ? await persistPostSendState(queueOwner) : queuedPreSendState === "acked" ? "acked" : void 0);
				await settleDeliveryCompletion(results.at(-1));
				if (results.length === 0 && postSendState === "marked") {
					await queueOwner.fail(failDeliveryAfterPlatformSend, "platform send returned no delivery identity");
					queuedPostSendState = "failed";
					return results;
				}
				if (postSendState === "acked" ? true : postSendState === "failed" ? false : await (results.length === 0 && typeof params.completionRetention === "object" ? queueOwner.ack({ suppressCompletionReceipt: true }) : queueOwner.ack()).then(() => true).catch(async (err) => {
					const hasSendEvidence = deliveredResults.length > 0 || queuedPreSendState !== void 0 && !allPayloadsSuppressed;
					try {
						if (hasSendEvidence) {
							await queueOwner.fail(failDeliveryAfterPlatformSend, `failed to ack sent delivery: ${formatErrorMessage(err)}`);
							queuedPostSendState = "failed";
						} else await queueOwner.fail(allPayloadsSuppressed ? failDeliveryBeforePlatformSend : failDelivery, `failed to ack unsent delivery: ${formatErrorMessage(err)}`);
					} catch (persistErr) {
						log$1.warn(`failed to preserve queued delivery ${queueId} after ack failure: ${formatErrorMessage(persistErr)}`);
					}
					if (queuePolicy === "required") throw err;
					log$1.warn(hasSendEvidence ? `failed to ack queued delivery ${queueId}; preserved unknown-after-send state: ${formatErrorMessage(err)}` : `failed to ack unsent queued delivery ${queueId}; retained it for retry: ${formatErrorMessage(err)}`);
					return false;
				})) {
					queuedPostSendState = "acked";
					await runCommitHooksAfterAck();
					emitTerminals(() => completedOutboundAuditTerminals({
						payloadCount,
						results,
						payloadOutcomes
					}));
				}
			}
		}
		return results;
	} catch (caughtError) {
		let err = caughtError;
		try {
			params.abortSignal?.removeEventListener("abort", cancelBeforeSend);
			await cancelledPreparationRetirement;
			throwIfProducerLeaseLost();
			if (releaseCancelledPreparation) {
				flushMessageSentEvents();
				throw err;
			}
			if (isOutboundDeliveryAdmissionClosedError(err)) throw err;
			if (!platformSendStarted && deliveredResults.length === 0 && queuedPostSendState === void 0 && !(err instanceof OutboundDeliveryError && err.sentBeforeError)) try {
				assertOutboundHandoffCurrent(wrappedParams.assertDirectAdapterHandoff);
			} catch (rejection) {
				err = rejection;
			}
			if (err instanceof OutboundDeliveryError && err.results.length > 0) deliveredResults = err.results;
			const failureIsProvenNotSent = isProvenBatchNotSent(err, payloadOutcomes);
			const hasPlatformSendEvidence = deliveredResults.length > 0 || !allPayloadsSuppressed && (queuedPreSendState === "marked" || queuedPostSendState === "marked") || err instanceof OutboundDeliveryError && err.sentBeforeError || reusableProducerClaimId !== void 0 && payloadOutcomes.some((outcome) => outcome.status === "sent");
			const platformSendFailureStage = err instanceof OutboundDeliveryError ? err.stage : "platform_send";
			if (queueOwner) {
				if (queueOwner.custody === "released") {
					await runCommitHooksAfterAck();
					emitFailedTerminals(platformSendFailureStage);
				} else if (params.abortSignal?.aborted) {
					if (failureIsProvenNotSent && deliveredResults.length === 0 && params.deliveryCompletion) {
						await queueOwner.fail(failDeliveryBeforePlatformSend, formatErrorMessage(err));
						queuedPostSendState = "failed";
					} else if (hasPlatformSendEvidence) {
						if (queuedPostSendState !== "failed") {
							await queueOwner.fail(failDeliveryAfterPlatformSend, `delivery aborted after platform send: ${formatErrorMessage(err)}`);
							queuedPostSendState = "failed";
						}
					} else if (await (producerClaimId ? queueOwner.ack({ suppressCompletionReceipt: true }) : queueOwner.ack()).then(() => true).catch(() => false)) {
						queuedPostSendState = "acked";
						await runCommitHooksAfterAck();
						emitFailedTerminals("queue");
					}
				} else if (!platformResultsReturned) {
					if (deliveredResults.length > 0 || !failureIsProvenNotSent && (platformDispatchedPayloads.size > 0 || err instanceof OutboundDeliveryError && err.sentBeforeError)) {
						try {
							queuedPostSendState ??= await persistPostSendState(queueOwner);
							if (queuedPostSendState === "marked") {
								await queueOwner.fail(failDeliveryAfterPlatformSend, formatErrorMessage(err));
								queuedPostSendState = "failed";
							}
						} catch (persistErr) {
							log$1.warn(`failed to preserve queued delivery ${queueId} post-send evidence: ${formatErrorMessage(persistErr)}`);
						}
						await runCommitHooksAfterAck();
						if (queuedPostSendState === "acked") emitFailedTerminals(platformSendFailureStage);
					} else {
						const permanentRejection = queuedPostSendState === void 0 && failureIsProvenNotSent ? findTerminalBatchRejection([err, ...payloadOutcomes.flatMap((outcome) => outcome.status === "failed" ? [outcome.error] : [])]) : void 0;
						if (permanentRejection) await finishPermanentRejection(queueOwner, permanentRejection);
						else if (failureIsProvenNotSent && params.deliveryRetryOwner === "caller" && !params.deliveryCompletion) try {
							throwIfProducerLeaseLost();
							await queueOwner.retire();
							emitFailedTerminals(platformSendFailureStage);
						} catch (failErr) {
							log$1.warn(`failed to dead-letter queued delivery ${queueId} after proven-not-sent failure: ${formatErrorMessage(failErr)}`);
						}
						else {
							const recordFailure = failureIsProvenNotSent ? failDeliveryBeforePlatformSend : failDelivery;
							try {
								await queueOwner.fail(recordFailure, formatErrorMessage(err));
							} catch (failErr) {
								log$1.warn(`failed to mark queued delivery ${queueId} as failed: ${formatErrorMessage(failErr)}`);
							}
						}
					}
				}
			} else {
				flushMessageSentEvents();
				emitFailedTerminals(platformSendFailureStage);
			}
			throw err;
		} catch (error) {
			throw params.deliveryQueueOwner ? params.deliveryQueueOwner.project(error, {
				results: deliveredResults,
				payloadOutcomes,
				stage: error instanceof OutboundDeliveryError ? error.stage : "queue"
			}) : error;
		}
	} finally {
		generation?.release();
		params.abortSignal?.removeEventListener("abort", cancelBeforeSend);
		if (!cancelledPreparationRetirement) await producerLease?.stop();
		for (const outcome of payloadOutcomes) if (outcome.status === "failed" && params.deliveryQueueOwner) outcome.error = params.deliveryQueueOwner.project(outcome.error);
		await releaseCancelledPreparation?.();
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-lease.ts
const PLATFORM_SEND_OWNER_HEARTBEAT_MS = Math.floor(PLATFORM_SEND_OWNER_LEASE_MS / 3);
var DeliveryProducerLeaseLostError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "DeliveryProducerLeaseLostError";
	}
};
function lostProducerLeaseError(id, cause) {
	return new DeliveryProducerLeaseLostError(`Delivery platform claim was lost: ${id}`, { cause });
}
/** Maintains one already-acquired producer claim during fallible preparation and send. */
async function startDeliveryProducerLease(params) {
	let confirmedExpiresAt;
	try {
		const initialExpiry = await params.renew();
		if (initialExpiry === void 0 || initialExpiry <= Date.now()) throw lostProducerLeaseError(params.id);
		confirmedExpiresAt = initialExpiry;
	} catch (error) {
		if (error instanceof DeliveryProducerLeaseLostError) throw error;
		throw lostProducerLeaseError(params.id, error);
	}
	const lost = new AbortController();
	let stopped = false;
	let stopResult;
	let pendingRenewal;
	let cancelExpiry;
	const abortLost = (cause) => {
		if (!stopped && !lost.signal.aborted) lost.abort(lostProducerLeaseError(params.id, cause));
	};
	const scheduleExpiry = () => {
		cancelExpiry?.();
		cancelExpiry = scheduleAbsoluteDeadline(confirmedExpiresAt, () => abortLost(), void 0, { unref: true });
	};
	const renew = async () => {
		if (stopped || lost.signal.aborted) return;
		try {
			const expiresAt = await params.renew();
			if (stopped) return;
			if (expiresAt === void 0) {
				abortLost();
				return;
			}
			confirmedExpiresAt = expiresAt;
			scheduleExpiry();
		} catch (error) {
			if (!stopped && Date.now() >= confirmedExpiresAt) abortLost(error);
		}
	};
	scheduleExpiry();
	const heartbeat = setInterval(() => {
		if (!pendingRenewal) pendingRenewal = renew().finally(() => {
			pendingRenewal = void 0;
		});
	}, PLATFORM_SEND_OWNER_HEARTBEAT_MS);
	heartbeat.unref?.();
	return {
		signal: lost.signal,
		stop: () => {
			if (!stopResult) {
				stopped = true;
				clearInterval(heartbeat);
				cancelExpiry?.();
				stopResult = pendingRenewal ?? Promise.resolve();
			}
			return stopResult;
		}
	};
}
//#endregion
//#region src/infra/outbound/deliver-queue.ts
const log = createSubsystemLogger("outbound/deliver");
function isReusablePreparedDeliveryOwner(owner) {
	return owner?.namespace === "prepared" && (owner.status === "pending" || owner.status === "completed");
}
async function runOutboundDelivery(params) {
	return await runOutboundDeliveryInternal({
		...params,
		conversationDeliveryTarget: void 0,
		sessionGeneration: void 0,
		deliveryQueueStateContext: void 0
	});
}
async function runOutboundDeliveryInternal(initialInput, stateContext) {
	return await runDelivery(initialInput, prepareOutboundPayloadBatch, stateContext);
}
async function runStructuredOutboundDeliveryInternal(input) {
	const { plan, ...params } = input;
	const batchPlan = plan.map((entry, sourceIndex) => Object.assign({}, entry, { sourceIndex }));
	return await runDelivery({
		...params,
		payloads: batchPlan.map((entry) => entry.payload)
	}, (delivery, options) => prepareStructuredOutboundPayloadBatch(delivery, batchPlan, options));
}
async function runDelivery(initialInput, prepare, stateContext) {
	const context = initialInput.conversationDeliveryTarget ?? stateContext ?? captureDeliveryQueueStateContext(initialInput.deliveryQueueId ? initialInput.deliveryQueueStateDir : void 0);
	const input = {
		...initialInput,
		deliveryQueueStateContext: context,
		deliveryQueueStateDir: context.stateDir
	};
	const owner = input.deliveryQueueOwner ?? (input.deliveryQueueId ? createQueuedDeliveryOwner({
		queueId: input.deliveryQueueId,
		stateDir: input.deliveryQueueStateDir,
		expectedPlatformSendAttemptId: input.deliveryProducerClaimId
	}, input.deliveryQueueStateContext) : void 0);
	try {
		return await runWithQuestionChannelDeliveries(input.payloads.map(readAskUserQuestionId), () => runOutboundDeliveryWithIntent({
			...input,
			deliveryQueueOwner: owner
		}, prepare));
	} catch (error) {
		throw owner ? owner.project(error) : error;
	}
}
async function runOutboundDeliveryWithIntent(input, prepare) {
	const { replyToId, replyToMode, ...currentParams } = input;
	const reply = normalizeOutboundReplyFacts({
		reply: input.reply,
		replyToId,
		replyToMode
	});
	const params = {
		...currentParams,
		...reply ? { reply } : {}
	};
	const stableIntentId = params.deliveryIntentId?.trim();
	if (stableIntentId) {
		const stableParams = stableIntentId === params.deliveryIntentId ? params : {
			...params,
			deliveryIntentId: stableIntentId
		};
		const claim = await withActiveDeliveryClaim(stableIntentId, async () => {
			const preparation = await withStableDeliveryPreparation({
				id: stableIntentId,
				stateDir: params.deliveryQueueStateDir,
				run: async (owner) => await runOutboundDeliveryWithQueue(stableParams, prepare, true, owner)
			}, params.deliveryQueueStateContext);
			return preparation.status === "claimed" ? preparation.value : await runOutboundDeliveryWithQueue(stableParams, prepare, true, void 0, false);
		});
		if (claim.status === "claimed") return claim.value;
		const owner = params.reusePendingDeliveryIntent ? await findDeliveryIntentOwner(stableIntentId, params.deliveryQueueStateDir, params.deliveryQueueStateContext) : null;
		throwIfAborted(params.abortSignal);
		params.deliveryQueueStateContext?.workerContext.admission.assertCurrent();
		if (isReusablePreparedDeliveryOwner(owner)) return [];
		throw new Error(`Stable delivery intent is already queued: ${stableIntentId}`);
	}
	return await runOutboundDeliveryWithQueue(params, prepare, false);
}
async function deliverWithProducerLease(params, queueId, auditStartedAt, producerClaimId, questionBinding) {
	return await runWithQuestionChannelDeliveries(params.payloads.map(readAskUserQuestionId), async () => {
		if (params.deliveryProducerLeaseRequired !== true) return await deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt, producerClaimId);
		const platformQueueId = queueId ?? params.deliveryQueueId;
		if (!platformQueueId || !producerClaimId) throw new Error("Delivery producer lease requires an exact queue owner");
		const stateDir = params.deliveryQueueStateDir;
		const lease = await startDeliveryProducerLease({
			id: platformQueueId,
			renew: async () => await renewDeliveryPlatformSendLease(platformQueueId, stateDir, producerClaimId, params.deliveryQueueStateContext)
		});
		if (params.deliveryQueueOwner) params.deliveryQueueOwner.signal = lease.signal;
		const abortSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, lease.signal]) : lease.signal;
		try {
			return await deliverOutboundPayloadsWithQueueCleanup({
				...params,
				abortSignal
			}, queueId, auditStartedAt, producerClaimId, lease);
		} finally {
			await lease.stop();
		}
	}, { unbound: questionBinding === "unbound" });
}
async function runOutboundDeliveryWithQueue(params, prepare, stableIntentClaimHeld, stablePreparationOwner, allowFreshPreparation = true) {
	const auditStartedAt = Date.now();
	const { channel, to, payloads } = params;
	const emitPreQueueFailure = () => {
		if (params.deliveryQueueId !== void 0) return;
		emitOutboundAuditTerminals({
			context: params,
			terminals: () => uniformOutboundAuditTerminals(params.payloads.length, {
				outcome: "failed",
				failureStage: "queue"
			}),
			startedAt: auditStartedAt
		});
	};
	const emitPreparationFailure = (error) => {
		emitPreQueueFailure();
		if (params.payloads.length > 0) {
			const { emitMessageSent } = createMessageSentEmitter({
				hookRunner: getGlobalHookRunner(),
				channel,
				to,
				accountId: params.accountId,
				sessionKeyForInternalHooks: params.mirror?.sessionKey ?? params.session?.key,
				isGroup: params.mirror?.isGroup,
				groupId: params.mirror?.groupId,
				runId: params.replyPayloadSendingHook?.runId,
				logPrefix: OUTBOUND_DELIVERY_LOG_SCOPE
			});
			for (const payload of params.payloads) {
				const summary = summarizeOutboundPayloadForTransport(payload);
				emitMessageSent({
					success: false,
					content: summary.hookContent ?? summary.text,
					error: formatErrorMessage(error)
				});
			}
		}
	};
	if (params.requireUnknownSendReconciliation === true && payloads.length !== 1) {
		emitPreQueueFailure();
		throw new Error(`Required durable message send is unsupported for ${channel}: unknown-send reconciliation requires exactly one payload`);
	}
	if (params.deferredDeliveryAdmissionPassed !== true) {
		let admission;
		try {
			admission = (await prepareDeferredDeliveryAdmission({
				cfg: params.cfg,
				channel,
				to,
				accountId: params.accountId,
				phase: "live"
			}, {
				agentId: params.session?.agentId,
				assertCurrent: () => {
					throwIfAborted(params.abortSignal);
					params.deliveryQueueOwner?.signal?.throwIfAborted();
					params.deliveryQueueStateContext?.workerContext.admission.assertCurrent();
				}
			}))();
		} catch (error) {
			emitPreparationFailure(error);
			throw error;
		}
		if (admission.status === "permanent_rejection") {
			emitPreQueueFailure();
			throw new Error(admission.reason);
		}
	}
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const existingStableDelivery = params.deliveryIntentId ? await loadPendingDelivery(params.deliveryIntentId, params.deliveryQueueStateDir, params.deliveryQueueStateContext) : null;
	if (params.deliveryIntentId && !existingStableDelivery && !stablePreparationOwner) {
		const owner = await findDeliveryIntentOwner(params.deliveryIntentId, params.deliveryQueueStateDir, params.deliveryQueueStateContext);
		throwIfAborted(params.abortSignal);
		params.deliveryQueueOwner?.signal?.throwIfAborted();
		params.deliveryQueueStateContext?.workerContext.admission.assertCurrent();
		if (owner) {
			if (params.reusePendingDeliveryIntent && isReusablePreparedDeliveryOwner(owner)) return [];
			throw new Error(owner.namespace === "legacy" ? `Stable delivery intent is awaiting queue migration: ${params.deliveryIntentId}` : `Stable delivery intent is already queued: ${params.deliveryIntentId}`);
		}
	}
	if (params.deliveryIntentId && !existingStableDelivery && !allowFreshPreparation) throw new Error(`Stable delivery intent is already queued: ${params.deliveryIntentId}`);
	if (existingStableDelivery && !params.reusePendingDeliveryIntent) throw new Error(`Stable delivery intent is already queued: ${params.deliveryIntentId}`);
	let preparedBatch;
	try {
		preparedBatch = existingStableDelivery?.preparedBatch ?? params.preparedBatch ?? await prepare(params, { onBeforeFirstModifier: stablePreparationOwner?.beforeFirstModifier });
		await stablePreparationOwner?.markPrepared();
	} catch (error) {
		emitPreparationFailure(error);
		throw error;
	}
	const preparedPayloads = acceptedPreparedOutboundEntries(preparedBatch).map((entry) => entry.payload);
	const preparedRenderedBatchPlan = existingStableDelivery?.renderedBatchPlan ?? (params.preparedBatch ? params.renderedBatchPlan : void 0) ?? createRenderedMessageBatchPlan(preparedPayloads);
	let unknownSendReconciliationEnabled = params.requireUnknownSendReconciliation === true;
	if (params.requireUnknownSendReconciliation !== false && preparedPayloads.length === 1) {
		const requirements = deriveDurableFinalDeliveryRequirementsForBatch({
			payloads: preparedPayloads,
			replyToId: params.reply?.replyToId,
			threadId: params.threadId,
			silent: params.silent,
			reconcileUnknownSend: true
		});
		delete requirements.messageSendingHooks;
		const support = await resolveOutboundDurableFinalDeliverySupport({
			cfg: params.cfg,
			agentId: params.session?.agentId,
			channel,
			requirements
		});
		if (params.requireUnknownSendReconciliation === true && !support.ok) {
			emitPreQueueFailure();
			throw new Error(`Required durable message send is unsupported for ${channel}: prepared payload capability mismatch${support.capability ? ` (${support.capability})` : ""}`);
		}
		unknownSendReconciliationEnabled = support.ok && (params.requireUnknownSendReconciliation === true || support.automaticUnknownSendReconciliation);
	}
	const deliveryParams = {
		...params,
		payloads: preparedPayloads,
		preparedBatch,
		renderedBatchPlan: preparedRenderedBatchPlan,
		...unknownSendReconciliationEnabled ? { requireUnknownSendReconciliation: true } : {}
	};
	const shouldPersistSuppressedIntent = Boolean(params.deliveryIntentId || params.deliveryCompletion || params.completionRetention);
	const queued = params.skipQueue || preparedPayloads.length === 0 && !shouldPersistSuppressedIntent ? null : await stageAndEnqueueOutboundDelivery(deliveryParams, preparedBatch, {
		claimForLiveDelivery: true,
		...stablePreparationOwner ? { getStablePreparation: stablePreparationOwner.current } : {}
	}).catch((err) => {
		if (isDeliveryRecoveryOwnedRetry(err)) throw err;
		if (queuePolicy === "required" || collectNestedErrorCandidates(err).some((candidate) => candidate instanceof StableDeliveryPreparationLostError)) {
			emitPreQueueFailure();
			throw err;
		}
		log.warn(`outbound queue write failed; continuing without durability (channel=${params.channel} to=${params.to}): ${formatErrorMessage(err)}`);
		return null;
	});
	const queueId = queued?.id ?? null;
	const queueOwner = queueId ? createQueuedDeliveryOwner({
		queueId,
		stateDir: params.deliveryQueueStateDir,
		expectedPlatformSendAttemptId: queued?.producerClaimId
	}, params.deliveryQueueStateContext) : params.deliveryQueueOwner;
	deliveryParams.deliveryQueueOwner = queueOwner;
	try {
		if (queued?.created && stablePreparationOwner) stablePreparationOwner.markPublished();
		if (queueId && queueOwner && params.deliveryCompletion) {
			if ((await markDurableDeliveryQueued(params.deliveryCompletion, queueId, queued?.created ? "prepared" : void 0, params.deliveryQueueStateDir, params.deliveryQueueStateContext, params.conversationDeliveryTarget)).state !== "queued") {
				await queueOwner.ack({ suppressCompletionReceipt: true });
				return [];
			}
		}
		if (queueId) emitOutboundAuditLifecycle({
			context: deliveryParams,
			outcome: "queued",
			queueId,
			startedAt: auditStartedAt
		});
		if (queueId) params.onDeliveryIntent?.({
			id: queueId,
			channel,
			to,
			...params.accountId ? { accountId: params.accountId } : {},
			queuePolicy
		});
		if (!queueId) return await deliverWithProducerLease(deliveryParams, null, auditStartedAt, params.deliveryProducerClaimId, existingStableDelivery || params.deliveryQueueId !== void 0 ? "unbound" : "captured");
		if (!queued?.created && !params.reusePendingDeliveryIntent) throw new Error(`Stable delivery intent is already queued: ${queueId}`);
		const deliverClaimedIntent = async () => {
			const producerClaimId = queued?.producerClaimId ?? (params.reusePendingDeliveryIntent ? await claimReusableDeliveryPlatformSendAttempt(queueId, params.deliveryQueueStateDir, params.deliveryQueueStateContext) : void 0);
			if (!producerClaimId) throw new Error(queued?.created ? `Delivery platform claim was lost: ${queueId}` : `Stable delivery intent is already queued: ${queueId}`);
			if (queueOwner) queueOwner.claimId = producerClaimId;
			let claimedDeliveryParams = {
				...deliveryParams,
				deliveryProducerLeaseRequired: true
			};
			if (queued?.created !== true) {
				const queuedEntry = await loadPendingDelivery(queueId, params.deliveryQueueStateDir, params.deliveryQueueStateContext);
				if (!queuedEntry || queuedEntry.producerClaimId !== producerClaimId) throw new Error(`Delivery platform claim was lost: ${queueId}`);
				claimedDeliveryParams = {
					...restoreQueuedDeliveryCustody(deliveryParams, queuedEntry),
					deliveryProducerLeaseRequired: true
				};
			}
			return deliverWithProducerLease(claimedDeliveryParams, queueId, auditStartedAt, producerClaimId, queued?.created === true ? "captured" : "unbound");
		};
		if (stableIntentClaimHeld) return await deliverClaimedIntent();
		const claimResult = await withActiveDeliveryClaim(queueId, deliverClaimedIntent);
		if (claimResult.status === "claimed") return claimResult.value;
		if (params.reusePendingDeliveryIntent) return [];
		throw new Error(`Delivery intent is already claimed: ${queueId}`);
	} catch (error) {
		throw queueOwner ? queueOwner.project(error) : error;
	}
}
//#endregion
export { stageAndEnqueueOutboundDelivery as i, runOutboundDeliveryInternal as n, runStructuredOutboundDeliveryInternal as r, runOutboundDelivery as t };
