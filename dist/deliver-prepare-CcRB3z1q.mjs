import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { i as getPluginRuntimeGatewayRequestScope, l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { S as getGroupThreadDispatchContext } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { n as OutboundDeliveryError, r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { n as deriveContextPromptTokens } from "./usage-XXLoqJQC.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-CeJbvk_b.mjs";
import { n as createStructuredOutboundPayloadPlan, t as createOutboundPayloadPlan, u as summarizeOutboundPayloadForTransport } from "./payloads-Ce1fWBq6.mjs";
import { v as markReplyDispatchBeforeDeliverDeadlineOwned } from "./reply-dispatcher-CLU3uA4U.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { l as toPluginMessageContext, n as deriveInboundMessageHookContext, r as resolveInboundReplyHookTarget } from "./message-hook-mappers-OANlfuGW.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { r as normalizeOutboundReplyFacts, t as createReplyToDeliveryPolicy } from "./reply-policy-B3zWXBNP.mjs";
import { _ as resolveOutboundMediaAccessForSend, g as normalizePayloadsForChannelDelivery, h as normalizeEmptyPayloadForDelivery, l as buildPayloadSummary, r as attachOutboundDeliveryCommitHook, s as assertOutboundHandoffCurrent, v as stripInternalRuntimeScaffoldingFromPayload } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { a as unknownSendReconciliationKinds } from "./types-GcWljJIT.mjs";
import { t as createChannelRegistryLoader } from "./registry-loader-mWCALKZm.mjs";
//#region src/auto-reply/reply/reply-payload-sending-hook.ts
/** Runs plugin hooks that may rewrite or cancel an outbound reply payload. */
async function runReplyPayloadSendingHook(params, hookRunner = getGlobalHookRunner()) {
	if (!hookRunner?.hasHooks("reply_payload_sending")) return params.payload;
	const result = await hookRunner.runReplyPayloadSending({
		payload: params.payload,
		kind: params.kind,
		channel: params.channel,
		sessionKey: params.sessionKey,
		runId: params.runId,
		usageState: params.usageState
	}, params.context);
	if (result?.cancel) return null;
	const payload = result?.payload ?? params.payload;
	return copyReplyPayloadMetadata(params.payload, payload);
}
//#endregion
//#region src/auto-reply/reply/reply-usage-state.ts
const TTL_MS = 3e5;
const MAX_REPLY_USAGE_STATE_ENTRIES = 1024;
const store = /* @__PURE__ */ new Map();
function buildReplyUsageState(params) {
	const resolvedProvider = params.fallbackExhausted ? void 0 : params.winnerProvider;
	const resolvedModel = params.fallbackExhausted ? void 0 : params.winnerModel;
	return {
		provider: params.provider,
		model: params.model,
		resolvedRef: resolvedProvider && resolvedModel ? `${resolvedProvider}/${resolvedModel}` : void 0,
		reasoningEffort: params.reasoningEffort,
		fastMode: params.fastMode,
		fallbackUsed: params.fallbackUsed,
		agentId: params.agentId,
		sessionId: params.sessionId,
		chatType: params.chatType,
		authMode: params.authMode,
		overrideSource: params.overrideSource,
		requested: params.requestedProvider && params.requestedModel ? `${params.requestedProvider}/${params.requestedModel}` : void 0,
		turnUsd: estimateAggregateUsageCost({
			usage: params.usage,
			provider: params.provider,
			model: params.model,
			config: params.config,
			agentDir: params.agentDir
		}),
		durationMs: params.durationMs,
		identity: resolveAgentIdentity(params.config, params.agentId),
		compactionCount: params.compactionCount,
		contextTokenBudget: typeof params.contextTokenBudget === "number" && Number.isFinite(params.contextTokenBudget) ? params.contextTokenBudget : void 0,
		contextUsedTokens: typeof params.contextUsedTokens === "number" && Number.isFinite(params.contextUsedTokens) ? params.contextUsedTokens : deriveContextPromptTokens({
			lastCallUsage: params.lastCallUsage,
			promptTokens: params.promptTokens,
			usage: params.usage
		}),
		usage: params.usage ? {
			input: params.usage.input,
			output: params.usage.output,
			cacheRead: params.usage.cacheRead,
			cacheWrite: params.usage.cacheWrite,
			total: params.usage.total
		} : void 0,
		lastUsage: params.lastCallUsage ? {
			input: params.lastCallUsage.input,
			output: params.lastCallUsage.output,
			cacheRead: params.lastCallUsage.cacheRead,
			cacheWrite: params.lastCallUsage.cacheWrite,
			total: params.lastCallUsage.total
		} : void 0
	};
}
function prune(now) {
	for (const [key, value] of store) if (value.expiresAt < now) store.delete(key);
	pruneMapToMaxSize(store, MAX_REPLY_USAGE_STATE_ENTRIES);
}
function recordReplyUsageState(runId, snapshot) {
	if (!runId) return;
	const now = Date.now();
	store.set(runId, {
		snapshot,
		expiresAt: now + TTL_MS
	});
	prune(now);
}
function consumeReplyUsageState(runId) {
	if (!runId) return;
	const value = store.get(runId);
	return value && value.expiresAt >= Date.now() ? value.snapshot : void 0;
}
//#endregion
//#region src/infra/outbound/deliver-hooks.ts
function buildInboundReplyPayloadSendingBeforeDeliver(ctx, runState, onSuppressed) {
	const finalized = finalizeInboundContext(ctx);
	const hookCtx = deriveInboundMessageHookContext(finalized);
	return markReplyDispatchBeforeDeliverDeadlineOwned(async (payload, info) => {
		const group = getGroupThreadDispatchContext();
		const deliveryContext = group?.ctx ?? finalized;
		const deliveryHookContext = group ? deriveInboundMessageHookContext(group.ctx) : hookCtx;
		const runId = group ? group.runState.runId : runState.runId;
		const hookedPayload = await runReplyPayloadSendingHook({
			payload,
			kind: info.kind,
			channel: deliveryContext.Surface ?? deliveryContext.Provider,
			sessionKey: deliveryContext.SessionKey,
			runId,
			usageState: consumeReplyUsageState(runId),
			context: {
				...toPluginMessageContext(deliveryHookContext),
				runId
			}
		});
		if (!hookedPayload) {
			await onSuppressed?.(payload, info, "cancelled_by_reply_payload_sending_hook");
			return null;
		}
		if (!hasOutboundReplyContent(hookedPayload)) {
			await onSuppressed?.(hookedPayload, info, "empty_after_reply_payload_sending_hook");
			return null;
		}
		return hookedPayload;
	});
}
/** Legacy dispatcher-owned `message_sending` stage retained for low-level SDK compatibility. */
function buildLegacyInboundMessageSendingBeforeDeliver(ctx) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("message_sending")) return;
	const finalized = finalizeInboundContext(ctx);
	const hookCtx = deriveInboundMessageHookContext(finalized);
	const replyTarget = resolveInboundReplyHookTarget(finalized, hookCtx);
	return markReplyDispatchBeforeDeliverDeadlineOwned(async (payload) => {
		if (!payload.text) return payload;
		const group = getGroupThreadDispatchContext();
		const result = await hookRunner.runMessageSending({
			content: payload.text,
			to: replyTarget
		}, {
			...toPluginMessageContext(hookCtx),
			...group ? {
				sessionKey: group.ctx.SessionKey,
				runId: group.runState.runId
			} : {}
		});
		if (result?.cancel) return null;
		return result?.content == null ? payload : copyReplyPayloadMetadata(payload, {
			...payload,
			text: result.content
		});
	});
}
/** Run media-aware message policy before a core owner can capture projected output. */
function buildProjectedInboundMessageSendingBeforeDeliver(ctx) {
	const finalized = finalizeInboundContext(ctx);
	const hookCtx = deriveInboundMessageHookContext(finalized);
	const replyTarget = resolveInboundReplyHookTarget(finalized, hookCtx);
	return markReplyDispatchBeforeDeliverDeadlineOwned(async (payload) => {
		const hookRunner = getGlobalHookRunner();
		const hookResult = await applyMessageSendingHook({
			hookRunner,
			enabled: hookRunner?.hasHooks("message_sending") ?? false,
			payload,
			payloadSummary: summarizeOutboundPayloadForTransport(payload),
			to: replyTarget,
			channel: hookCtx.channelId,
			accountId: hookCtx.accountId,
			replyToId: payload.replyToId ?? finalized.ReplyToIdFull ?? finalized.ReplyToId,
			threadId: finalized.MessageThreadId,
			sessionKey: finalized.SessionKey
		});
		if (hookResult.cancelled) return null;
		return normalizeEmptyPayloadForDelivery(hookResult.payload);
	});
}
async function applyMessageSendingHook(params) {
	if (!params.enabled) return {
		cancelled: false,
		contentRewritten: false,
		payload: params.payload,
		payloadSummary: params.payloadSummary
	};
	try {
		const group = getGroupThreadDispatchContext();
		const sendingResult = await params.hookRunner.runMessageSending({
			to: params.to,
			content: params.payloadSummary.hookContent ?? params.payloadSummary.text,
			replyToId: params.replyToId ?? void 0,
			threadId: params.threadId ?? void 0,
			metadata: {
				channel: params.channel,
				accountId: params.accountId,
				mediaUrls: params.payloadSummary.mediaUrls
			}
		}, {
			channelId: params.channel,
			accountId: params.accountId ?? void 0,
			conversationId: params.to,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...group ? {
				sessionKey: group.ctx.SessionKey,
				runId: group.runState.runId
			} : {}
		});
		if (sendingResult?.cancel) return {
			cancelled: true,
			...sendingResult.cancelReason ? { cancelReason: sendingResult.cancelReason } : {},
			...sendingResult.metadata ? { hookMetadata: sendingResult.metadata } : {},
			contentRewritten: false,
			payload: params.payload,
			payloadSummary: params.payloadSummary
		};
		if (sendingResult?.content == null) return {
			cancelled: false,
			contentRewritten: false,
			payload: params.payload,
			payloadSummary: params.payloadSummary
		};
		if (params.payloadSummary.hookContent && !params.payloadSummary.text) {
			const spokenText = sendingResult.content;
			return {
				cancelled: false,
				contentRewritten: true,
				payload: copyReplyPayloadMetadata(params.payload, {
					...params.payload,
					spokenText
				}),
				payloadSummary: {
					...params.payloadSummary,
					hookContent: spokenText
				}
			};
		}
		return {
			cancelled: false,
			contentRewritten: true,
			payload: copyReplyPayloadMetadata(params.payload, {
				...params.payload,
				text: sendingResult.content
			}),
			payloadSummary: {
				...params.payloadSummary,
				text: sendingResult.content
			}
		};
	} catch {
		return {
			cancelled: false,
			contentRewritten: false,
			payload: params.payload,
			payloadSummary: params.payloadSummary
		};
	}
}
async function applyReplyPayloadSendingHook(params, hookRunner = getGlobalHookRunner()) {
	if (!params.hook) return {
		cancelled: false,
		payload: params.payload,
		changed: false
	};
	const nextPayload = await runReplyPayloadSendingHook({
		payload: params.payload,
		kind: params.hook.kind,
		...params.hook.channel ? { channel: params.hook.channel } : {},
		...params.hook.sessionKey ? { sessionKey: params.hook.sessionKey } : {},
		...params.hook.runId ? { runId: params.hook.runId } : {},
		context: params.hook.context
	}, hookRunner);
	if (!nextPayload) return {
		cancelled: true,
		payload: params.payload,
		changed: false
	};
	return {
		cancelled: false,
		payload: nextPayload,
		changed: nextPayload !== params.payload
	};
}
function toOutboundDeliveryError(params) {
	if (params.error instanceof OutboundDeliveryError) return params.error;
	return new OutboundDeliveryError(formatErrorMessage(params.error), {
		cause: params.error,
		results: params.results,
		payloadOutcomes: params.payloadOutcomes,
		stage: params.stage
	});
}
function suppressedPayloadOutcome(params) {
	return {
		index: params.index,
		status: "suppressed",
		reason: params.reason,
		...params.hookEffect ? { hookEffect: params.hookEffect } : {}
	};
}
/** Adds directive-derived media to the queue copy before spool custody. */
//#endregion
//#region src/channels/message/rendered-batch.ts
/**
* Rendered channel message batch planner.
*
* Summarizes reply payloads so delivery can pick adapter paths and recovery metadata.
*/
function collectMediaUrls(payload) {
	const mediaUrls = normalizeTrimmedStringList(payload.mediaUrls);
	const mediaUrl = payload.mediaUrl?.trim();
	return mediaUrl && !mediaUrls.includes(mediaUrl) ? [mediaUrl, ...mediaUrls] : mediaUrls;
}
function createRenderedMessageBatchPlanItem(payload, index) {
	const text = payload.text?.trim();
	const mediaUrls = collectMediaUrls(payload);
	const presentationBlockCount = payload.presentation?.blocks?.length ?? 0;
	const kinds = [];
	if (text) kinds.push("text");
	if (mediaUrls.length > 0) kinds.push(payload.audioAsVoice ? "voice" : "media");
	if (presentationBlockCount > 0 || payload.presentation?.title?.trim()) kinds.push("presentation");
	if (payload.interactive) kinds.push("interactive");
	if (payload.channelData || payload.location) kinds.push("channelData");
	return {
		index,
		kinds: kinds.length > 0 ? kinds : ["empty"],
		...text ? { text } : {},
		mediaUrls,
		...payload.audioAsVoice && mediaUrls.length > 0 ? { audioAsVoice: true } : {},
		...presentationBlockCount > 0 ? { presentationBlockCount } : {},
		...payload.interactive ? { hasInteractive: true } : {},
		...payload.channelData || payload.location ? { hasChannelData: true } : {}
	};
}
/** Summarizes rendered reply payloads so delivery can choose adapter paths and recovery metadata. */
function createRenderedMessageBatchPlan(payloads) {
	const items = payloads.map(createRenderedMessageBatchPlanItem);
	return items.reduce((plan, item) => {
		plan.payloadCount += 1;
		plan.textCount += item.text ? 1 : 0;
		plan.mediaCount += item.mediaUrls.length;
		plan.voiceCount += item.audioAsVoice ? 1 : 0;
		plan.presentationCount += item.kinds.includes("presentation") ? 1 : 0;
		plan.interactiveCount += item.hasInteractive ? 1 : 0;
		plan.channelDataCount += item.hasChannelData ? 1 : 0;
		return plan;
	}, {
		payloadCount: 0,
		textCount: 0,
		mediaCount: 0,
		voiceCount: 0,
		presentationCount: 0,
		interactiveCount: 0,
		channelDataCount: 0,
		items
	});
}
/** Pairs reply payloads with their render plan for durable send and live-preview flows. */
function createRenderedMessageBatch(payloads) {
	return {
		payloads,
		plan: createRenderedMessageBatchPlan(payloads)
	};
}
//#endregion
//#region src/infra/outbound/abort.ts
/**
* Throws an AbortError if the given signal has been aborted.
* Use at async checkpoints to support cancellation.
*/
function throwIfAborted(abortSignal) {
	if (abortSignal?.aborted) throw createAbortError("Operation aborted");
}
//#endregion
//#region src/infra/outbound/deliver-channel.ts
const log = createSubsystemLogger("outbound/deliver");
const loadChannelBootstrapRuntime = createLazyRuntimeModule(() => import("./channel-bootstrap.runtime.js"));
const loadChannelPluginFromRegistry = createChannelRegistryLoader((entry) => entry.plugin);
async function createChannelHandler(params) {
	const { plugin, pluginRegistry } = await loadBootstrappedChannelPlugin(params);
	const handler = withPluginRuntimeRegistryScope(pluginRegistry, () => createPluginHandler({
		...params,
		outbound: plugin?.outbound,
		message: plugin?.message
	}));
	if (!handler) {
		const message = `Outbound not configured for channel: ${params.channel}`;
		throw new PlatformMessageNotDispatchedError(message, { cause: new Error(message) });
	}
	return scopeChannelHandler(handler, pluginRegistry);
}
async function loadBootstrappedChannelPlugin(params) {
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const plugin = await loadChannelPluginFromRegistry(params.channel);
	if (plugin?.outbound || plugin?.message?.send?.text) return {
		plugin,
		pluginRegistry: scopedRegistry
	};
	const { bootstrapOutboundChannelPluginAsync } = await loadChannelBootstrapRuntime();
	const pluginRegistry = await bootstrapOutboundChannelPluginAsync({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return {
		plugin: pluginRegistry?.channels.find((entry) => entry.plugin.id === params.channel)?.plugin,
		pluginRegistry
	};
}
function scopeChannelHandler(handler, registry) {
	if (!registry) return handler;
	return Object.fromEntries(Object.entries(handler).map(([key, value]) => {
		if (typeof value !== "function") return [key, value];
		const call = value;
		return [key, (...args) => withPluginRuntimeRegistryScope(registry, () => call(...args))];
	}));
}
async function resolveOutboundDurableFinalDeliverySupport(params) {
	const { plugin } = await loadBootstrappedChannelPlugin(params);
	const outbound = plugin?.outbound;
	const message = plugin?.message;
	if (!message?.send?.text && !outbound?.sendText) return {
		ok: false,
		reason: "missing_outbound_handler"
	};
	const messageDurableFinal = message?.durableFinal;
	const durableFinal = messageDurableFinal?.capabilities ?? outbound?.deliveryCapabilities?.durableFinal;
	for (const [capability, required] of Object.entries(params.requirements ?? {})) {
		if (required === true && durableFinal?.[capability] !== true) return {
			ok: false,
			reason: "capability_mismatch",
			capability
		};
		if (required === true && capability === "reconcileUnknownSend" && typeof messageDurableFinal?.reconcileUnknownSend !== "function") return {
			ok: false,
			reason: "capability_mismatch",
			capability
		};
	}
	if (params.requirements?.reconcileUnknownSend === true) {
		const supportedKinds = messageDurableFinal?.reconcileUnknownSendKinds;
		const requiredKinds = params.requirements.batch ? unknownSendReconciliationKinds.filter((kind) => params.requirements?.[kind] === true) : unknownSendReconciliationKinds.toReversed().filter((kind) => params.requirements?.[kind] === true).slice(0, 1);
		if (supportedKinds !== void 0 && requiredKinds.some((requiredKind) => supportedKinds[requiredKind] !== true)) return {
			ok: false,
			reason: "capability_mismatch",
			capability: "reconcileUnknownSend"
		};
	}
	return {
		ok: true,
		automaticUnknownSendReconciliation: messageDurableFinal?.automaticUnknownSendReconciliation === true
	};
}
function createPluginHandler(params) {
	const outbound = params.outbound;
	const messageText = params.message?.send?.text;
	const messageMedia = params.message?.send?.media;
	const messagePayload = params.message?.send?.payload;
	const messageLifecycle = params.message?.send?.lifecycle;
	const durableFinal = params.message?.durableFinal;
	const supportsUnknownSendKind = (kind) => !params.requiredUnknownSendReconciliation || durableFinal?.capabilities?.reconcileUnknownSend !== true || durableFinal.reconcileUnknownSendKinds === void 0 || durableFinal.reconcileUnknownSendKinds[kind] === true;
	const assertUnknownSendReconciliationKind = (kind) => {
		if (!supportsUnknownSendKind(kind)) throw new Error(`Required durable message send became unsupported after outbound transforms: ${kind} unknown-send reconciliation is unavailable for ${params.channel}`);
	};
	if (!messageText && !outbound?.sendText) return null;
	const baseCtx = createChannelOutboundContextBase(params);
	const sendText = outbound?.sendText;
	const sendMedia = outbound?.sendMedia;
	const dispatchToAdapter = async (route, send) => {
		try {
			await params.onPlatformSendStart?.(route);
			await params.onDirectAdapterHandoff?.();
		} catch (error) {
			assertOutboundHandoffCurrent(params.assertDirectAdapterHandoff);
			throw error;
		}
		assertOutboundHandoffCurrent(params.assertDirectAdapterHandoff);
		return await send();
	};
	const chunker = baseCtx.preparedMessageId ? null : outbound?.chunker ?? null;
	const chunkerMode = outbound?.chunkerMode;
	const onMessageDeliveryResult = params.onDeliveryResult ? async (result) => {
		await params.onDeliveryResult?.(normalizeChannelMessageSendResult(params.channel, result));
	} : void 0;
	const sendMessage = async (ctx, send) => {
		if (!messageLifecycle) return normalizeChannelMessageSendResult(params.channel, await dispatchToAdapter(ctx, () => send(ctx)));
		let attemptToken;
		let result;
		let afterCommit;
		try {
			try {
				attemptToken = await messageLifecycle.beforeSendAttempt?.(ctx);
			} catch (error) {
				assertOutboundHandoffCurrent(params.assertDirectAdapterHandoff);
				throw error;
			}
			result = await dispatchToAdapter(ctx, () => send(ctx));
			if (result.outcome !== "not_sent") {
				const successCtx = {
					...ctx,
					result,
					...attemptToken !== void 0 ? { attemptToken } : {}
				};
				try {
					await messageLifecycle.afterSendSuccess?.(successCtx);
				} catch (successHookError) {
					log.warn(`channel message send success hook failed after platform send; preserving send result: ${formatErrorMessage(successHookError)}`);
				}
				if (messageLifecycle.afterCommit) afterCommit = async () => {
					await messageLifecycle.afterCommit?.(successCtx);
				};
			}
		} catch (error) {
			try {
				await messageLifecycle.afterSendFailure?.({
					...ctx,
					error,
					...attemptToken !== void 0 ? { attemptToken } : {}
				});
			} catch (cleanupError) {
				log.warn(`channel message send failure cleanup failed; preserving original send error: ${formatErrorMessage(cleanupError)}`);
			}
			throw error;
		}
		return attachOutboundDeliveryCommitHook(normalizeChannelMessageSendResult(params.channel, result), afterCommit);
	};
	const resolveCtx = (overrides) => ({
		...baseCtx,
		replyToId: overrides && "replyToId" in overrides ? overrides.replyToId : baseCtx.replyToId,
		replyToIdSource: overrides && "replyToIdSource" in overrides ? overrides.replyToIdSource : baseCtx.replyToIdSource,
		threadId: overrides && "threadId" in overrides ? overrides.threadId : baseCtx.threadId,
		audioAsVoice: overrides?.audioAsVoice,
		deliveryPartIndex: overrides?.deliveryPartIndex,
		deliveryPartCount: overrides?.deliveryPartCount,
		preparedMessageId: overrides?.deliveryPartIndex === void 0 || overrides.deliveryPartIndex === 0 ? baseCtx.preparedMessageId : void 0,
		formatting: overrides && "formatting" in overrides ? {
			...baseCtx.formatting,
			...overrides.formatting
		} : baseCtx.formatting
	});
	const buildTargetRef = (overrides) => ({
		channel: params.channel,
		to: params.to,
		accountId: params.accountId ?? void 0,
		threadId: overrides?.threadId ?? baseCtx.threadId
	});
	return {
		chunker,
		chunkerMode,
		chunkedTextFormatting: outbound?.chunkedTextFormatting,
		textChunkLimit: outbound?.textChunkLimit,
		extractMarkdownImages: outbound?.extractMarkdownImages === true ? true : void 0,
		preserveMarkdownDetails: outbound?.preserveMarkdownDetails?.({
			cfg: params.cfg,
			accountId: params.accountId
		}) === true,
		supportsMedia: Boolean(messageMedia ?? sendMedia ?? outbound?.sendFormattedMedia),
		supportsMediaPayload: outbound?.sendPayloadGroupsMedia === true && (durableFinal?.capabilities ?? outbound?.deliveryCapabilities?.durableFinal)?.payload === true && supportsUnknownSendKind("payload"),
		sanitizeText: outbound?.sanitizeText ? (payload) => outbound.sanitizeText({
			text: payload.text ?? "",
			payload,
			cfg: params.cfg,
			accountId: params.accountId
		}) : void 0,
		normalizePayload: outbound?.normalizePayload ? (payload) => outbound.normalizePayload({
			payload,
			cfg: params.cfg,
			accountId: params.accountId
		}) : void 0,
		normalizePayloadBatch: outbound?.normalizePayloadBatch ? (payloads) => {
			const normalized = outbound.normalizePayloadBatch({
				payloads,
				cfg: params.cfg,
				accountId: params.accountId
			});
			return payloads.flatMap((entry, index) => {
				const payload = normalized[index];
				return payload ? [{
					...entry,
					payload
				}] : [];
			});
		} : void 0,
		sendTextOnlyErrorPayloads: outbound?.sendTextOnlyErrorPayloads === true,
		presentationCapabilities: outbound?.resolvePresentationCapabilities ? outbound.resolvePresentationCapabilities({
			cfg: params.cfg,
			accountId: params.accountId,
			formatting: params.formatting
		}) : outbound?.presentationCapabilities,
		renderPresentation: outbound?.renderPresentation ? async (payload, sourcePresentation) => {
			const presentation = payload.presentation;
			if (!presentation) return payload;
			const ctx = {
				...resolveCtx({
					replyToId: payload.replyToId ?? baseCtx.replyToId,
					threadId: baseCtx.threadId,
					audioAsVoice: payload.audioAsVoice
				}),
				text: payload.text ?? "",
				mediaUrl: payload.mediaUrl,
				payload
			};
			return await outbound.renderPresentation({
				payload,
				presentation,
				sourcePresentation,
				ctx
			});
		} : void 0,
		pinDeliveredMessage: outbound?.pinDeliveredMessage ? async ({ target, messageId, pin, gatewayClientScopes, assertDirectAdapterHandoff }) => outbound.pinDeliveredMessage({
			cfg: params.cfg,
			target,
			messageId,
			pin,
			gatewayClientScopes,
			assertDirectAdapterHandoff
		}) : void 0,
		afterDeliverPayload: outbound?.afterDeliverPayload ? async ({ target, payload, results }) => outbound.afterDeliverPayload({
			cfg: params.cfg,
			target,
			payload,
			results
		}) : void 0,
		adoptTargetFromDelivery: outbound?.adoptTargetFromDelivery ? ({ target, result }) => outbound.adoptTargetFromDelivery({
			cfg: params.cfg,
			target,
			result
		}) : void 0,
		shouldSkipPlainTextSanitization: outbound?.shouldSkipPlainTextSanitization ? (payload) => outbound.shouldSkipPlainTextSanitization({ payload }) : void 0,
		resolveEffectiveTextChunkLimit: outbound?.resolveEffectiveTextChunkLimit ? ({ fallbackLimit, formatting }) => outbound.resolveEffectiveTextChunkLimit({
			cfg: params.cfg,
			accountId: params.accountId ?? void 0,
			fallbackLimit,
			formatting
		}) : void 0,
		sendPayload: messagePayload || outbound?.sendPayload ? async (payload, overrides) => {
			const payloadCtx = {
				...resolveCtx(overrides),
				kind: "payload",
				text: payload.text ?? "",
				mediaUrl: payload.mediaUrl,
				payload
			};
			assertUnknownSendReconciliationKind("payload");
			if (messagePayload) return sendMessage({
				...payloadCtx,
				onDeliveryResult: onMessageDeliveryResult
			}, messagePayload);
			return dispatchToAdapter(payloadCtx, () => outbound.sendPayload(payloadCtx));
		} : void 0,
		sendFormattedText: outbound?.sendFormattedText ? async (text, overrides) => {
			const formattedCtx = {
				...resolveCtx(overrides),
				text
			};
			assertUnknownSendReconciliationKind("text");
			return await dispatchToAdapter(formattedCtx, () => outbound.sendFormattedText(formattedCtx));
		} : void 0,
		sendFormattedMedia: outbound?.sendFormattedMedia ? async (caption, mediaUrl, overrides) => {
			const formattedCtx = {
				...resolveCtx(overrides),
				text: caption,
				mediaUrl
			};
			assertUnknownSendReconciliationKind("media");
			return await dispatchToAdapter(formattedCtx, () => outbound.sendFormattedMedia(formattedCtx));
		} : void 0,
		sendText: async (text, overrides) => {
			const textCtx = {
				...resolveCtx(overrides),
				kind: "text",
				text
			};
			assertUnknownSendReconciliationKind("text");
			if (messageText) return sendMessage({
				...textCtx,
				onDeliveryResult: onMessageDeliveryResult
			}, messageText);
			return dispatchToAdapter(textCtx, () => sendText(textCtx));
		},
		buildTargetRef,
		sendMedia: async (caption, mediaUrl, overrides) => {
			const mediaCtx = {
				...resolveCtx(overrides),
				kind: "media",
				text: caption,
				mediaUrl
			};
			assertUnknownSendReconciliationKind("media");
			if (messageMedia) return sendMessage({
				...mediaCtx,
				onDeliveryResult: onMessageDeliveryResult
			}, messageMedia);
			if (sendMedia) return dispatchToAdapter(mediaCtx, () => sendMedia(mediaCtx));
			return dispatchToAdapter(mediaCtx, () => sendText(mediaCtx));
		}
	};
}
function normalizeChannelMessageSendResult(channel, result) {
	const source = result;
	return {
		...source,
		channel,
		messageId: source.messageId ?? source.receipt.primaryPlatformMessageId ?? source.receipt.platformMessageIds[0] ?? "",
		receipt: source.receipt
	};
}
const createChannelOutboundContextBase = (params) => ({
	cfg: params.cfg,
	to: params.to,
	accountId: params.accountId,
	replyToId: params.replyToId,
	replyToIdSource: void 0,
	replyToMode: params.replyToMode,
	formatting: params.formatting,
	threadId: params.threadId,
	identity: params.identity,
	gifPlayback: params.gifPlayback,
	forceDocument: params.forceDocument,
	deps: params.deps,
	silent: params.silent,
	signal: params.abortSignal,
	abortSignal: params.abortSignal,
	mediaAccess: params.mediaAccess,
	mediaLocalRoots: params.mediaAccess?.localRoots,
	mediaReadFile: params.mediaAccess?.readFile,
	gatewayClientScopes: params.gatewayClientScopes,
	conversationReadOrigin: params.conversationReadOrigin,
	deliveryQueueId: params.deliveryQueueId,
	preparedMessageId: params.preparedMessageId,
	assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
	onPlatformSendDispatch: params.onPlatformSendDispatch,
	onDeliveryResult: params.onDeliveryResult
});
//#endregion
//#region src/infra/outbound/deliver-prepare.ts
var OutboundPayloadPreparationError = class extends Error {
	constructor(error, sourceIndex, payload) {
		super(error instanceof Error ? error.message : String(error), { cause: error });
		this.name = "OutboundPayloadPreparationError";
		this.sourceIndex = sourceIndex;
		this.payload = payload;
	}
};
function throwIfPreparationAborted(signal, sourceIndex, payload) {
	try {
		throwIfAborted(signal);
	} catch (error) {
		throw new OutboundPayloadPreparationError(error, sourceIndex, payload);
	}
}
async function createPreparationHandler(params) {
	const reply = normalizeOutboundReplyFacts(params);
	return await createChannelHandler({
		cfg: params.cfg,
		agentId: params.session?.agentId,
		channel: params.channel,
		to: params.to,
		deps: params.deps,
		accountId: params.accountId,
		replyToId: reply?.replyToId,
		replyToMode: reply?.source === "implicit" ? reply.mode : void 0,
		formatting: params.formatting,
		threadId: params.threadId,
		identity: params.identity,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mediaAccess: resolveOutboundMediaAccessForSend(params, params.channel, []),
		gatewayClientScopes: params.gatewayClientScopes,
		conversationReadOrigin: params.conversationReadOrigin,
		preparedMessageId: params.preparedMessageId,
		requiredUnknownSendReconciliation: params.requiredUnknownSendReconciliation
	});
}
function suppressionReasonForEmpty(params) {
	return params.messageHookChanged ? "empty_after_message_sending_hook" : params.replyHookChanged ? "empty_after_reply_payload_sending_hook" : "no_visible_payload";
}
function compactPreparedPayload(payload) {
	const summary = buildPayloadSummary(payload);
	const { audioAsVoice, mediaUrl: _mediaUrl, mediaUrls: _mediaUrls, replyToCurrent, replyToId, replyToTag, text: _text, ...rest } = payload;
	return copyReplyPayloadMetadata(payload, Object.fromEntries(Object.entries({
		...rest,
		...typeof payload.text === "string" ? { text: summary.text } : {},
		...summary.mediaUrls.length === 1 ? { mediaUrl: summary.mediaUrls[0] } : summary.mediaUrls.length > 1 ? { mediaUrls: summary.mediaUrls } : {},
		...replyToId !== void 0 ? { replyToId } : {},
		...replyToTag === true ? { replyToTag: true } : {},
		...replyToCurrent === true ? { replyToCurrent: true } : {},
		...audioAsVoice === true ? { audioAsVoice: true } : {}
	}).filter(([, value]) => value !== void 0)));
}
function preserveTransformedPayloadMetadata(source, payload) {
	const transformedMetadata = getReplyPayloadMetadata(payload);
	copyReplyPayloadMetadata(source, payload);
	return transformedMetadata ? setReplyPayloadMetadata(payload, transformedMetadata) : payload;
}
function projectMarkdownImages(payload) {
	const images = splitMediaFromOutput(payload.text ?? "", {
		extractMediaDirectives: false,
		extractAudioDirectives: false,
		extractMarkdownImages: true,
		preserveTrailingWhitespace: true
	});
	if (!images.mediaUrls?.length) return payload;
	const [mediaPlan] = createStructuredOutboundPayloadPlan([{
		mediaUrl: payload.mediaUrl ?? images.mediaUrls[0],
		mediaUrls: [
			...payload.mediaUrls ?? [],
			...payload.mediaUrl ? [payload.mediaUrl] : [],
			...images.mediaUrls
		],
		attachments: payload.attachments
	}]);
	const media = expectDefined(mediaPlan, "Markdown images must produce a media payload").payload;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		text: images.text,
		mediaUrl: media.mediaUrl,
		mediaUrls: media.mediaUrls,
		...payload.attachments ? { attachments: media.attachments } : {}
	});
}
/**
* Runs each modifier exactly once and returns the sole payload representation
* eligible for durable persistence or provider delivery.
*/
async function prepareOutboundPayloadBatch(params, options) {
	const handler = await createPreparationHandler(params);
	return await prepareOutboundPlan(params, createOutboundPayloadPlan(params.payloads, {
		cfg: params.cfg,
		sessionKey: params.session?.policyKey ?? params.session?.key,
		surface: params.channel,
		conversationType: params.session?.conversationType,
		extractMarkdownImages: handler.extractMarkdownImages
	}), handler, options);
}
async function prepareStructuredOutboundPayloadBatch(params, plan, options) {
	const handler = await createPreparationHandler(params);
	return await prepareOutboundPlan(params, handler.extractMarkdownImages ? plan.flatMap((entry) => {
		const payload = projectMarkdownImages(entry.payload);
		if (payload === entry.payload) return [entry];
		const [projected] = createStructuredOutboundPayloadPlan([payload]);
		return projected ? [{
			...projected,
			sourceIndex: entry.sourceIndex
		}] : [];
	}) : plan, handler, options, preserveTransformedPayloadMetadata);
}
async function prepareOutboundPlan(params, plan, handler, options, preservePayloadMetadata) {
	const copyMetadata = preservePayloadMetadata ?? ((_source, payload) => payload);
	const normalized = normalizePayloadsForChannelDelivery(plan, handler, preservePayloadMetadata);
	const normalizedIndexes = new Set(normalized.map((entry) => entry.index));
	const entries = [];
	for (const [sourceIndex] of params.payloads.entries()) if (!normalizedIndexes.has(sourceIndex)) entries.push({
		sourceIndex,
		status: "suppressed",
		reason: "no_visible_payload"
	});
	const hookRunner = options?.hookRunner ?? getGlobalHookRunner();
	const hasReplyPayloadSendingHooks = params.replyPayloadSendingHook !== void 0 && (hookRunner?.hasHooks("reply_payload_sending") ?? false);
	const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
	const hasModifyingHooks = hasReplyPayloadSendingHooks || hasMessageSendingHooks;
	const { resolveCurrentReplyTo } = createReplyToDeliveryPolicy(params);
	const sessionKeyForHooks = params.mirror?.sessionKey ?? params.session?.key;
	let modifierBoundaryEntered = false;
	for (const { index: sourceIndex, payload } of normalized) {
		throwIfPreparationAborted(params.abortSignal, sourceIndex, payload);
		if (hasModifyingHooks && !modifierBoundaryEntered) {
			await options?.onBeforeFirstModifier?.();
			throwIfPreparationAborted(params.abortSignal, sourceIndex, payload);
			modifierBoundaryEntered = true;
		}
		let replyHookResult;
		try {
			replyHookResult = await applyReplyPayloadSendingHook({
				hook: params.replyPayloadSendingHook,
				payload
			}, hookRunner);
		} catch (error) {
			throw new OutboundPayloadPreparationError(error, sourceIndex, payload);
		}
		const replyHookPayload = copyMetadata(payload, replyHookResult.payload);
		throwIfPreparationAborted(params.abortSignal, sourceIndex, replyHookPayload);
		if (replyHookResult.cancelled) {
			entries.push({
				sourceIndex,
				status: "suppressed",
				reason: "cancelled_by_reply_payload_sending_hook"
			});
			continue;
		}
		let replyPayload = copyMetadata(replyHookPayload, stripInternalRuntimeScaffoldingFromPayload(replyHookPayload));
		if (handler.extractMarkdownImages && replyHookResult.changed) replyPayload = projectMarkdownImages(replyPayload);
		let messageHookResult;
		try {
			messageHookResult = await applyMessageSendingHook({
				hookRunner,
				enabled: hasMessageSendingHooks,
				payload: replyPayload,
				payloadSummary: buildPayloadSummary(replyPayload),
				to: params.to,
				channel: params.channel,
				accountId: params.accountId,
				replyToId: resolveCurrentReplyTo(replyPayload).replyToId,
				threadId: params.threadId,
				sessionKey: sessionKeyForHooks
			});
		} catch (error) {
			throw new OutboundPayloadPreparationError(error, sourceIndex, replyPayload);
		}
		const messageHookPayload = copyMetadata(replyPayload, messageHookResult.payload);
		throwIfPreparationAborted(params.abortSignal, sourceIndex, messageHookPayload);
		if (messageHookResult.cancelled) {
			const hookEffect = messageHookResult.cancelReason || messageHookResult.hookMetadata ? {
				...messageHookResult.cancelReason ? { cancelReason: messageHookResult.cancelReason } : {},
				...messageHookResult.hookMetadata ? { metadata: messageHookResult.hookMetadata } : {}
			} : void 0;
			entries.push({
				sourceIndex,
				status: "suppressed",
				reason: "cancelled_by_message_sending_hook",
				...hookEffect ? { hookEffect } : {}
			});
			continue;
		}
		let postHookPayload = copyMetadata(messageHookPayload, stripInternalRuntimeScaffoldingFromPayload(messageHookPayload));
		if (handler.extractMarkdownImages && messageHookResult.contentRewritten) postHookPayload = projectMarkdownImages(postHookPayload);
		const normalizedPostHookPayload = handler.normalizePayload ? handler.normalizePayload(postHookPayload) : postHookPayload;
		const normalizedPayload = normalizedPostHookPayload ? copyMetadata(postHookPayload, normalizedPostHookPayload) : null;
		const strippedPayload = normalizedPayload ? copyMetadata(normalizedPayload, stripInternalRuntimeScaffoldingFromPayload(normalizedPayload)) : null;
		const nonEmptyPayload = strippedPayload ? normalizeEmptyPayloadForDelivery(strippedPayload) : null;
		const preparedPayload = nonEmptyPayload && strippedPayload ? copyMetadata(strippedPayload, nonEmptyPayload) : null;
		if (!preparedPayload) {
			entries.push({
				sourceIndex,
				status: "suppressed",
				reason: suppressionReasonForEmpty({
					replyHookChanged: replyHookResult.changed,
					messageHookChanged: messageHookResult.contentRewritten
				})
			});
			continue;
		}
		const compactPayload = compactPreparedPayload(preparedPayload);
		entries.push({
			sourceIndex,
			status: "accepted",
			payload: compactPayload,
			replyHookChanged: replyHookResult.changed,
			messageHookChanged: messageHookResult.contentRewritten,
			preparedMediaCount: buildPayloadSummary(compactPayload).mediaUrls.length
		});
	}
	return {
		schemaVersion: 1,
		sourcePayloadCount: params.payloads.length,
		channelNormalized: true,
		...params.runId ?? params.replyPayloadSendingHook?.runId ? { runId: params.runId ?? params.replyPayloadSendingHook?.runId } : {},
		...params.executionIdentityToken ? { executionIdentityToken: params.executionIdentityToken } : {},
		entries
	};
}
//#endregion
export { throwIfAborted as a, applyMessageSendingHook as c, buildProjectedInboundMessageSendingBeforeDeliver as d, suppressedPayloadOutcome as f, recordReplyUsageState as h, resolveOutboundDurableFinalDeliverySupport as i, buildInboundReplyPayloadSendingBeforeDeliver as l, buildReplyUsageState as m, prepareStructuredOutboundPayloadBatch as n, createRenderedMessageBatch as o, toOutboundDeliveryError as p, createChannelHandler as r, createRenderedMessageBatchPlan as s, prepareOutboundPayloadBatch as t, buildLegacyInboundMessageSendingBeforeDeliver as u };
