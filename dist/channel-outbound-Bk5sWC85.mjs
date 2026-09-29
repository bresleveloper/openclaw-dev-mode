import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { n as preserveReplyPayloadMediaSelectionCore } from "./reply-media-entries-BifhlC95.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import "./ingress-retry-policy-B_OLaMKs.mjs";
import "./ingress-drain-Drc4V_K5.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { a as resolveReceiptSourceId, t as createMessageReceiptFromOutboundResults } from "./receipt-CV_GHeLg.mjs";
import "./payloads-Ce1fWBq6.mjs";
import "./reply-policy-B3zWXBNP.mjs";
import "./session-context-B-tubEEv.mjs";
import { i as livePreviewFinalizerCapabilities, n as channelMessageReceiveAckPolicies, r as durableFinalDeliveryCapabilities, t as channelMessageLiveCapabilities } from "./types-GcWljJIT.mjs";
import { c as resolveTextChunkLimit } from "./chunk-D0NagiTt.mjs";
import { T as resolveChannelStreamingPreviewChunk, v as resolveChannelProgressDraftConfig } from "./streaming-BRWehz40.mjs";
import "./live-CJusMVR5.mjs";
import "./outbound-echo-B-zvGTG0.mjs";
import "./progress-draft-compositor-BiyWLSal.mjs";
import "./reply-pipeline-i3g0Dbwp.mjs";
import "./logging-skHYNt5A.mjs";
import { r as classifyGatewayStaleInstall } from "./stale-install-BTpQ40eq.mjs";
import "./ingress-monitor-CbbL0sxM.mjs";
import "./draft-stream-controls-D6z2jkZk.mjs";
import "./identity-081bUT3P.mjs";
import "./sanitize-text-q5V8Zg_l.mjs";
//#region src/channels/message/ingress-drain-lifecycle.ts
/** Maps a drain lifecycle onto the reply-lane ownership surface. */
function bindIngressLifecycleToReplyOptions(lifecycle) {
	return { turnAdoptionLifecycle: {
		admission: "exclusive",
		onAdopted: lifecycle.onAdopted,
		onDeferred: lifecycle.onDeferred,
		onDeferredHeartbeat: lifecycle.onDeferredHeartbeat,
		deferredHeartbeatIntervalMs: lifecycle.deferredHeartbeatIntervalMs,
		onAbandoned: lifecycle.onAbandoned,
		abortSignal: lifecycle.abortSignal
	} };
}
//#endregion
//#region src/channels/message/ingress-errors.ts
function createChannelIngressError(name, options) {
	const IngressError = class extends Error {
		constructor(first, second, third) {
			const reasoned = options?.withReason === true;
			super(reasoned && typeof second === "string" ? second : first, reasoned ? third : typeof second === "string" ? void 0 : second);
			this.name = name;
			if (reasoned) this.reason = first;
		}
	};
	Object.defineProperty(IngressError, "name", {
		configurable: true,
		value: name
	});
	return IngressError;
}
//#endregion
//#region src/channels/draft-streaming-chunking.ts
const DEFAULT_DRAFT_STREAM_MIN = 200;
const DEFAULT_DRAFT_STREAM_MAX = 800;
function resolveChannelDraftStreamingChunking(cfg, channelId, accountId, opts) {
	const textLimit = resolveTextChunkLimit(cfg, channelId, accountId, { fallbackLimit: opts.fallbackLimit });
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelCfg = cfg?.channels?.[channelId];
	const accountCfg = resolveChannelAccountEntry(channelCfg?.accounts, normalizedAccountId, channelId);
	const draftCfg = resolveChannelStreamingPreviewChunk(accountCfg) ?? resolveChannelStreamingPreviewChunk(channelCfg);
	const maxRequested = Math.max(1, Math.floor(draftCfg?.maxChars ?? DEFAULT_DRAFT_STREAM_MAX));
	const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
	const minRequested = Math.max(1, Math.floor(draftCfg?.minChars ?? DEFAULT_DRAFT_STREAM_MIN));
	return {
		minChars: Math.min(minRequested, maxChars),
		maxChars,
		breakPreference: draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence" ? draftCfg.breakPreference : "paragraph"
	};
}
//#endregion
//#region src/channels/message/adapter.ts
const defaultManualReceiveAdapter$1 = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
function defineChannelMessageAdapter(adapter) {
	return {
		...adapter,
		receive: adapter.receive ?? defaultManualReceiveAdapter$1
	};
}
//#endregion
//#region src/channels/message/outbound-bridge.ts
/**
* Legacy outbound bridge adapter.
*
* Wraps old channel send functions in the newer channel message adapter contract.
*/
const defaultManualReceiveAdapter = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
function toMessageSendResult(result, params) {
	const receipt = result.receipt ? params.normalizeReceiptKind ? {
		...result.receipt,
		parts: result.receipt.parts.map((part) => ({
			...part,
			kind: params.kind
		}))
	} : result.receipt : createMessageReceiptFromOutboundResults({
		results: [result],
		kind: params.kind,
		threadId: params.threadId == null ? void 0 : String(params.threadId),
		replyToId: params.replyToId ?? void 0
	});
	const messageId = resolveReceiptSourceId({
		...result,
		receipt
	});
	return {
		...result.outcome !== void 0 ? { outcome: result.outcome } : {},
		...result.target !== void 0 ? { target: result.target } : {},
		...result.chatId !== void 0 ? { chatId: result.chatId } : {},
		...result.channelId !== void 0 ? { channelId: result.channelId } : {},
		...result.roomId !== void 0 ? { roomId: result.roomId } : {},
		...result.conversationId !== void 0 ? { conversationId: result.conversationId } : {},
		...result.toJid !== void 0 ? { toJid: result.toJid } : {},
		...result.pollId !== void 0 ? { pollId: result.pollId } : {},
		...result.timestamp !== void 0 ? { timestamp: result.timestamp } : {},
		...result.meta !== void 0 ? { meta: result.meta } : {},
		receipt,
		...messageId ? { messageId } : {}
	};
}
function adaptOutboundBridgeContext(ctx, resultParams) {
	const { onDeliveryResult, ...outboundCtx } = ctx;
	return {
		...outboundCtx,
		...onDeliveryResult ? { onDeliveryResult: async (result) => {
			await onDeliveryResult(toMessageSendResult(result, resultParams));
		} } : {}
	};
}
function hasRenderedPresentationBlocks(channelData) {
	return Object.values(channelData ?? {}).some((value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const blocks = value.presentationBlocks;
		return Array.isArray(blocks) && blocks.length > 0;
	});
}
function resolvePayloadReceiptKind(ctx) {
	if (ctx.payload.audioAsVoice && (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length)) return "voice";
	if (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length) return "media";
	if (Boolean(ctx.payload.presentation?.title || ctx.payload.presentation?.blocks?.length) || hasRenderedPresentationBlocks(ctx.payload.channelData)) return "card";
	if (ctx.payload.interactive) return "card";
	if (ctx.payload.location) return "card";
	if (ctx.payload.text?.trim() || ctx.text.trim()) return "text";
	return "unknown";
}
/** Converts legacy outbound send methods into a typed channel message adapter. */
function createChannelMessageAdapterFromOutbound(params) {
	const send = {};
	if (params.outbound.sendText) send.text = async (ctx) => {
		const resultParams = {
			kind: "text",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendText(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendMedia) send.media = async (ctx) => {
		const resultParams = {
			kind: ctx.audioAsVoice ? "voice" : "media",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendMedia(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPayload) send.payload = async (ctx) => {
		const resultParams = {
			kind: resolvePayloadReceiptKind(ctx),
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPayload(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPoll) send.poll = async (ctx) => {
		const resultParams = {
			kind: "poll",
			normalizeReceiptKind: true,
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPoll(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	return {
		...params.id ? { id: params.id } : {},
		durableFinal: { capabilities: params.capabilities ?? params.outbound.deliveryCapabilities?.durableFinal },
		send,
		...params.live ? { live: params.live } : {},
		receive: params.receive ?? defaultManualReceiveAdapter
	};
}
//#endregion
//#region src/channels/message/durable-receive.ts
function normalizeDurableInboundReceiveId(id) {
	const normalized = id.trim();
	if (!normalized) throw new Error("Durable inbound receive id cannot be empty");
	return normalized;
}
/** Adapts the shared channel ingress queue to the durable receive journal API. */
function createDurableInboundReceiveJournalFromQueue(options) {
	const prune = async (protectId) => {
		if (options.retention) await options.queue.prune({
			...options.retention,
			...protectId === void 0 ? {} : { protectIds: [protectId] }
		});
	};
	return {
		accept: async (id, payload, acceptOptions) => {
			await prune();
			const result = await options.queue.enqueue(normalizeDurableInboundReceiveId(id), payload, {
				...acceptOptions?.metadata === void 0 ? {} : { metadata: acceptOptions.metadata },
				...acceptOptions?.receivedAt === void 0 ? {} : { receivedAt: acceptOptions.receivedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			if (result.kind === "accepted") return {
				kind: "accepted",
				duplicate: false,
				record: result.record
			};
			if (result.kind === "completed") return {
				kind: "completed",
				duplicate: true,
				record: result.record
			};
			if (result.kind === "pending" || result.kind === "claimed") return {
				kind: "pending",
				duplicate: true,
				record: result.record
			};
			return {
				kind: "pending",
				duplicate: true,
				record: {
					id: result.record.id,
					payload,
					receivedAt: result.record.failedAt,
					updatedAt: result.record.failedAt,
					attempts: 0
				}
			};
		},
		pending: async () => {
			await prune();
			return await options.queue.listPending({ limit: "all" });
		},
		complete: async (id, completeOptions) => {
			await options.queue.complete(normalizeDurableInboundReceiveId(id), {
				...completeOptions?.metadata === void 0 ? {} : { metadata: completeOptions.metadata },
				...completeOptions?.completedAt === void 0 ? {} : { completedAt: completeOptions.completedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
		},
		release: async (id, releaseOptions) => {
			const released = await options.queue.release(normalizeDurableInboundReceiveId(id), {
				...releaseOptions?.lastError === void 0 ? {} : { lastError: releaseOptions.lastError },
				...releaseOptions?.releasedAt === void 0 ? {} : { releasedAt: releaseOptions.releasedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			return released;
		},
		deletePending: async (id) => {
			const deleted = await options.queue.delete(normalizeDurableInboundReceiveId(id));
			await prune();
			return deleted;
		}
	};
}
//#endregion
//#region src/channels/message/contracts.ts
async function verifyContractProofs(params) {
	const results = [];
	for (const key of params.keys) {
		if (!params.isDeclared(key)) {
			results.push(params.result(key, "not_declared"));
			continue;
		}
		const proof = params.proofs[key];
		if (!proof) throw new Error(params.missingProofError(key));
		await proof();
		results.push(params.result(key, "verified"));
	}
	return results;
}
/**
* Lists declared receive acknowledgement policies, including the default policy fallback.
*/
function listDeclaredReceiveAckPolicies(receive) {
	const declared = receive?.supportedAckPolicies?.length ? receive.supportedAckPolicies : receive?.defaultAckPolicy ? [receive.defaultAckPolicy] : [];
	return channelMessageReceiveAckPolicies.filter((policy) => declared.includes(policy));
}
/**
* Verifies proof callbacks for every declared durable-final delivery capability.
*/
async function verifyDurableFinalCapabilityProofs(params) {
	return await verifyContractProofs({
		keys: durableFinalDeliveryCapabilities,
		isDeclared: (capability) => params.capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${params.adapterName} declares durable final capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
/**
* Verifies proof callbacks for every declared live-preview finalizer capability.
*/
async function verifyLivePreviewFinalizerCapabilityProofs(params) {
	return await verifyContractProofs({
		keys: livePreviewFinalizerCapabilities,
		isDeclared: (capability) => params.capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${params.adapterName} declares live preview finalizer capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
/**
* Verifies proof callbacks for every declared live message capability.
*/
async function verifyChannelMessageLiveCapabilityProofs(params) {
	return await verifyContractProofs({
		keys: channelMessageLiveCapabilities,
		isDeclared: (capability) => params.capabilities?.[capability] === true,
		proofs: params.proofs,
		missingProofError: (capability) => `${params.adapterName} declares live capability "${capability}" without a contract proof`,
		result: (capability, status) => ({
			capability,
			status
		})
	});
}
/**
* Verifies proof callbacks for every declared receive acknowledgement policy.
*/
async function verifyChannelMessageReceiveAckPolicyProofs(params) {
	const declared = new Set(listDeclaredReceiveAckPolicies(params.receive));
	return await verifyContractProofs({
		keys: channelMessageReceiveAckPolicies,
		isDeclared: (policy) => declared.has(policy),
		proofs: params.proofs,
		missingProofError: (policy) => `${params.adapterName} declares receive ack policy "${policy}" without a contract proof`,
		result: (policy, status) => ({
			policy,
			status
		})
	});
}
/**
* Verifies durable-final proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageAdapterCapabilityProofs(params) {
	return await verifyDurableFinalCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.durableFinal?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies receive acknowledgement proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params) {
	return await verifyChannelMessageReceiveAckPolicyProofs({
		adapterName: params.adapterName,
		receive: params.adapter.receive,
		proofs: params.proofs
	});
}
/**
* Verifies live-preview finalizer proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveFinalizerProofs(params) {
	return await verifyLivePreviewFinalizerCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.finalizer?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies live message capability proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveCapabilityAdapterProofs(params) {
	return await verifyChannelMessageLiveCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.capabilities,
		proofs: params.proofs
	});
}
//#endregion
//#region src/channels/message/receive.ts
/**
* Channel message receive acknowledgement context.
*
* Models ack/nack policy and idempotent receive state transitions for inbound events.
*/
const neverAbortedSignal = new AbortController().signal;
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
function shouldAckMessageAfterStage(policy, stage) {
	switch (policy) {
		case "after_receive_record": return stage === "receive_record";
		case "after_agent_dispatch": return stage === "agent_dispatch";
		case "after_durable_send": return stage === "durable_send";
		case "manual": return false;
	}
	return false;
}
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
function createMessageReceiveContext(params) {
	let nackInFlight;
	const ctx = {
		id: params.id,
		channel: params.channel,
		...params.accountId ? { accountId: params.accountId } : {},
		message: params.message,
		ackPolicy: params.ackPolicy ?? "after_receive_record",
		ackState: "pending",
		receivedAt: params.receivedAt ?? Date.now(),
		signal: params.signal ?? neverAbortedSignal,
		shouldAckAfter: (stage) => shouldAckMessageAfterStage(ctx.ackPolicy, stage),
		ack: async () => {
			if (ctx.ackState === "acked") return;
			await params.onAck?.();
			ctx.ackState = "acked";
			ctx.ackedAt = Date.now();
			delete ctx.nackErrorMessage;
		},
		nack: async (error) => {
			if (ctx.ackState === "nacked") return;
			if (nackInFlight) {
				await nackInFlight;
				return;
			}
			nackInFlight = (async () => {
				await params.onNack?.(error);
				ctx.ackState = "nacked";
				ctx.nackErrorMessage = formatErrorMessage(error);
			})();
			try {
				await nackInFlight;
			} finally {
				nackInFlight = void 0;
			}
		}
	};
	return ctx;
}
//#endregion
//#region src/channels/streaming-final-text.ts
const MIN_TRUNCATED_FINAL_PREFIX_CHARS = 48;
const MIN_TRUNCATED_FINAL_CONTINUATION_CHARS = 24;
function stripTrailingEllipsis(text) {
	return text.replace(/(?<!\s)(?:\s*(?:\.{3}|\u2026))+$/u, "").trimEnd();
}
function isPotentialTruncatedFinal(finalText) {
	const trimmedFinal = finalText.trimEnd();
	const untruncatedFinal = stripTrailingEllipsis(trimmedFinal);
	return untruncatedFinal.length >= MIN_TRUNCATED_FINAL_PREFIX_CHARS && untruncatedFinal !== trimmedFinal;
}
function selectLongerFinalText(params) {
	const finalText = params.finalText.trimEnd();
	if (!isPotentialTruncatedFinal(finalText)) return;
	const untruncatedFinal = stripTrailingEllipsis(finalText);
	for (const candidate of params.candidateTexts) {
		const candidateText = candidate?.trimEnd();
		if (!candidateText || candidateText.length <= finalText.length || !candidateText.startsWith(untruncatedFinal)) continue;
		const continuation = candidateText.slice(untruncatedFinal.length).trimStart();
		if (continuation.length >= MIN_TRUNCATED_FINAL_CONTINUATION_CHARS && /^[\p{L}\p{N}]/u.test(continuation)) return candidateText;
	}
}
async function resolveTranscriptBackedChannelFinalText(params) {
	if (params.payload && getReplyPayloadMetadata(params.payload)?.precedingInputAnswer || !isPotentialTruncatedFinal(params.finalText)) return params.finalText;
	const candidateText = await params.resolveCandidateText();
	return selectLongerFinalText({
		finalText: params.finalText,
		candidateTexts: [candidateText]
	}) ?? params.finalText;
}
//#endregion
//#region src/plugin-sdk/channel-outbound.ts
const loadChannelMessageRuntimeModule = createLazyRuntimeModule(() => import("./runtime-D4NP4Fhn.mjs"));
/** Keep the current operation media selection when recovering other reply fields. */
function preserveReplyPayloadMediaSelection(source, recovered) {
	return preserveReplyPayloadMediaSelectionCore(source, recovered);
}
/**
* @deprecated Load-only bridge: the published Slack channel package
* (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
* it makes the installed plugin fail to load after a core upgrade. The config
* key it read is retired and doctor strips it, so this resolves the same
* "text"/"rich" answer pre-doctor configs produced and the default otherwise.
* Remove once managed releases have replaced the old npm latest/extended-stable
* packages and their upgrade window has closed.
*/
function resolveChannelProgressDraftRender(entry, defaultValue = "text") {
	const configured = resolveChannelProgressDraftConfig(entry).render;
	return configured === "rich" || configured === "text" ? configured : defaultValue;
}
async function loadChannelDurableDeliveryModule() {
	return await import("./durable-delivery-E9ov7TNE.mjs").catch((error) => {
		const staleInstall = classifyGatewayStaleInstall(error);
		throw new PlatformMessageNotDispatchedError(staleInstall?.error.message ?? "Reply delivery runtime could not load before dispatch", { cause: error });
	});
}
/** Lazily forwards inbound reply delivery through the channel turn durable-delivery module. */
const deliverInboundReplyWithMessageSendContext = async (...args) => {
	return await (await loadChannelDurableDeliveryModule()).deliverInboundReplyWithMessageSendContextCore(...args);
};
/** Delivers a producer's prepared plan without reparsing literal text. */
const deliverStructuredInboundReplyWithMessageSendContext = async (...args) => {
	return await (await loadChannelDurableDeliveryModule()).deliverStructuredInboundReplyWithMessageSendContextCore(...args);
};
/** Sends a durable message batch without eager-loading channel message runtime internals. */
async function sendDurableMessageBatch(params) {
	return await (await loadChannelMessageRuntimeModule()).sendDurableMessageBatchCore(params);
}
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
async function withDurableMessageSendContext(params, run) {
	return await (await loadChannelMessageRuntimeModule()).withDurableMessageSendContextCore(params, run);
}
//#endregion
export { createChannelMessageAdapterFromOutbound as _, sendDurableMessageBatch as a, createChannelIngressError as b, resolveTranscriptBackedChannelFinalText as c, verifyChannelMessageAdapterCapabilityProofs as d, verifyChannelMessageLiveCapabilityAdapterProofs as f, createDurableInboundReceiveJournalFromQueue as g, verifyDurableFinalCapabilityProofs as h, resolveChannelProgressDraftRender as i, selectLongerFinalText as l, verifyChannelMessageReceiveAckPolicyAdapterProofs as m, deliverStructuredInboundReplyWithMessageSendContext as n, withDurableMessageSendContext as o, verifyChannelMessageLiveFinalizerProofs as p, preserveReplyPayloadMediaSelection as r, isPotentialTruncatedFinal as s, deliverInboundReplyWithMessageSendContext as t, createMessageReceiveContext as u, defineChannelMessageAdapter as v, bindIngressLifecycleToReplyOptions as x, resolveChannelDraftStreamingChunking as y };
