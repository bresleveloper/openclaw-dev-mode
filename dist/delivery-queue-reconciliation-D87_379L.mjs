import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import "./payloads-CZkv8Yff.mjs";
import { n as resolveAgentScopedOutboundMediaAccess } from "./read-capability-DeAXXMuF.mjs";
import { r as payloadMediaSources } from "./delivery-queue-media-paths-BG8SwZ0-.mjs";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-CpA4eDAX.mjs";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-JZ360Soo.mjs";
import { t as hasActiveDeliveryOwner } from "./delivery-queue-types-BfmmnS_o.mjs";
//#region src/infra/outbound/deliver-payload.ts
const log$1 = createSubsystemLogger("outbound/deliver");
function deliveryKindForPayload(payload, payloadSummary) {
	if (payloadSummary.mediaUrls.length > 0 || payload.mediaUrl || payload.mediaUrls?.length) return "media";
	if (payload.presentation || payload.interactive || payload.channelData || payload.audioAsVoice) return "other";
	return "text";
}
function normalizeEmptyPayloadForDelivery(payload) {
	const text = typeof payload.text === "string" ? payload.text : "";
	if (text.trim()) return payload;
	if (!hasReplyPayloadContent({
		...payload,
		text
	}, { extraContent: payload.location != null })) return null;
	return text ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: ""
	}) : payload;
}
function normalizeTransformedPayloadForDelivery(payload, handler, copyMetadata) {
	const normalizedPayload = handler.normalizePayload ? handler.normalizePayload(payload) : payload;
	if (!normalizedPayload) return null;
	return normalizeEmptyPayloadForDelivery(stripInternalRuntimeScaffoldingFromPayload(copyMetadata(payload, normalizedPayload)));
}
function normalizePayloadsForChannelDelivery(plan, handler, copyPayloadMetadata) {
	const copyMetadata = copyPayloadMetadata ?? copyReplyPayloadMetadata;
	const normalizedPayloads = [];
	for (const entry of plan) {
		let sanitizedPayload = stripInternalRuntimeScaffoldingFromPayload(entry.payload);
		const replaceText = (text) => {
			if (text !== sanitizedPayload.text) sanitizedPayload = copyMetadata(sanitizedPayload, {
				...sanitizedPayload,
				text
			});
		};
		if (!handler.preserveMarkdownDetails && sanitizedPayload.text) replaceText(flattenMarkdownDetails(sanitizedPayload.text));
		if (handler.sanitizeText && sanitizedPayload.text && !handler.shouldSkipPlainTextSanitization?.(sanitizedPayload)) replaceText(handler.sanitizeText(sanitizedPayload));
		const normalized = normalizeTransformedPayloadForDelivery(sanitizedPayload, handler, copyMetadata);
		if (normalized) normalizedPayloads.push({
			index: entry.sourceIndex,
			payload: normalized
		});
	}
	if (!handler.normalizePayloadBatch) return normalizedPayloads;
	const sources = copyPayloadMetadata ? new Map(normalizedPayloads.map((entry) => [entry.index, entry.payload])) : void 0;
	const batch = handler.normalizePayloadBatch(normalizedPayloads);
	if (!copyPayloadMetadata || !sources) return batch;
	return batch.map((entry) => {
		const source = sources.get(entry.index);
		return source ? {
			index: entry.index,
			payload: copyPayloadMetadata(source, entry.payload)
		} : entry;
	});
}
function stripInternalRuntimeScaffoldingFromValue(value) {
	if (typeof value === "string") return stripInternalRuntimeScaffolding(value);
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((entry) => {
			const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
			changed ||= stripped !== entry;
			return stripped;
		});
		return changed ? next : value;
	}
	if (!value || typeof value !== "object") return value;
	const proto = Object.getPrototypeOf(value);
	if (proto !== Object.prototype && proto !== null) return value;
	let changed = false;
	const entries = Object.entries(value);
	for (const entry of entries) {
		const stripped = stripInternalRuntimeScaffoldingFromValue(entry[1]);
		changed ||= stripped !== entry[1];
		entry[1] = stripped;
	}
	return changed ? Object.fromEntries(entries) : value;
}
/** Every media reference a payload set carries, in payload order. */
function collectPayloadMediaSources(payloads) {
	return payloads.flatMap(payloadMediaSources);
}
/**
* Resolves the media read capability for one send. Queue staging and the live
* send must resolve it identically: staging copies exactly the bytes the send is
* already allowed to read, so a narrower gate here would reject media the send
* would have delivered, and a wider one would widen read authority.
*/
function resolveOutboundMediaAccessForSend(params, mediaSources) {
	if (mediaSources.length === 0) return params.mediaAccess ?? {};
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.session?.agentId ?? params.mirror?.agentId,
		mediaSources,
		mediaAccess: params.mediaAccess,
		sessionKey: params.session?.policyKey ?? params.session?.key,
		messageProvider: params.session?.key ? void 0 : params.channel,
		accountId: params.session?.requesterAccountId ?? params.accountId,
		requesterSenderId: params.session?.requesterSenderId,
		requesterSenderName: params.session?.requesterSenderName,
		requesterSenderUsername: params.session?.requesterSenderUsername,
		requesterSenderE164: params.session?.requesterSenderE164
	});
}
function resolveChannelHandlerParams(params, reply, mediaSources) {
	return {
		cfg: params.cfg,
		agentId: params.session?.agentId,
		sessionKey: params.session?.key,
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
		mediaAccess: resolveOutboundMediaAccessForSend(params, mediaSources),
		gatewayClientScopes: params.gatewayClientScopes,
		conversationReadOrigin: params.conversationReadOrigin,
		preparedMessageId: params.preparedMessageId,
		requiredUnknownSendReconciliation: params.requiredUnknownSendReconciliation
	};
}
function stripInternalRuntimeScaffoldingFromPayload(payload) {
	const stripped = stripInternalRuntimeScaffoldingFromValue(payload);
	return stripped !== payload && stripped && typeof stripped === "object" && !Array.isArray(stripped) ? copyReplyPayloadMetadata(payload, stripped) : payload;
}
function normalizeDeliveryPin(payload) {
	const pin = payload.delivery?.pin;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin) || !pin.enabled) return;
	return {
		enabled: true,
		...pin.notify === true ? { notify: true } : {},
		...pin.required === true ? { required: true } : {}
	};
}
async function maybePinDeliveredMessage(params) {
	const pin = normalizeDeliveryPin(params.payload);
	if (!pin) return;
	if (!params.messageId || !params.handler.pinDeliveredMessage) {
		const missingMessageId = !params.messageId;
		const message = missingMessageId ? "Delivery pin requested, but no delivered message id was returned." : "Delivery pin requested, but channel does not support pinning delivered messages.";
		if (pin.required) throw new Error(missingMessageId ? message : `Delivery pin is not supported by channel: ${params.target.channel}`);
		log$1.warn(message, {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	try {
		params.assertDirectAdapterHandoff?.();
		await params.handler.pinDeliveredMessage({
			target: params.target,
			messageId: params.messageId,
			pin,
			gatewayClientScopes: params.gatewayClientScopes,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
	} catch (err) {
		if (pin.required) throw err;
		log$1.warn("Delivery pin requested, but channel failed to pin delivered message.", {
			channel: params.target.channel,
			to: params.target.to,
			messageId: params.messageId,
			error: formatErrorMessage(err)
		});
	}
}
async function maybeNotifyAfterDeliveredPayload(params) {
	if (!params.handler.afterDeliverPayload || params.results.length === 0) return;
	try {
		await params.handler.afterDeliverPayload({
			target: params.target,
			payload: params.payload,
			results: params.results
		});
	} catch (err) {
		log$1.warn("Plugin outbound adapter after-delivery hook failed.", {
			channel: params.target.channel,
			to: params.target.to,
			error: formatErrorMessage(err)
		});
	}
}
//#endregion
//#region src/infra/outbound/deliver-handoff.ts
var OutboundHandoffRejectedError = class extends PlatformMessageNotDispatchedError {
	constructor(cause) {
		super(formatErrorMessage(cause), {
			cause,
			retryable: false
		});
	}
};
/** Finds an exact rejected host handoff through delivery wrappers. */
function findOutboundHandoffRejectedError(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		if (current instanceof OutboundHandoffRejectedError) return current;
		seen.add(current);
		current = "cause" in current ? current.cause : void 0;
	}
}
/** Call only while the current preparation or handoff is proven not dispatched. */
function assertOutboundHandoffCurrent(assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		if (error instanceof PlatformMessageNotDispatchedError && error.retryable) throw error;
		throw new OutboundHandoffRejectedError(error);
	}
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
	if (hook) {
		const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
		hooks.push(hook);
		outboundDeliveryCommitHooks.set(result, hooks);
	}
	return result;
}
/** Runs after-commit hooks for delivered results while isolating hook failures. */
async function runOutboundDeliveryCommitHooks(results) {
	for (const result of results) for (const hook of outboundDeliveryCommitHooks.get(result) ?? []) try {
		await hook();
	} catch (err) {
		log.warn("Plugin message adapter after-commit hook failed.", {
			channel: result.channel,
			messageId: result.messageId,
			error: formatErrorMessage(err)
		});
	}
}
/** Type guard for batched outbound delivery results crossing loose boundaries. */
function isOutboundDeliveryResultArray(value) {
	return Array.isArray(value);
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery-policy.ts
const DEFAULT_MAX_RETRIES = 5;
const TEXT_FINAL_FIELDS = {
	text: true,
	replyToId: true,
	replyToTag: true,
	replyToCurrent: true
};
function isOrdinaryFinalText(payloads, isTextOnlyChannelData) {
	const payload = payloads[0];
	return payloads.length === 1 && payload !== void 0 && Boolean(payload.text?.trim()) && Object.entries(payload).every(([field, value]) => value === void 0 || Object.hasOwn(TEXT_FINAL_FIELDS, field) || field === "channelData" && payload.channelData !== void 0 && isTextOnlyChannelData?.(payload.channelData) === true);
}
function canReplayAmbiguousFinalText(entry) {
	return entry.retryAmbiguousFinalText === true && entry.ambiguousTransportError === true;
}
function shouldInspectQueuedDelivery(entry, now, selectEntry) {
	return Boolean(entry.settlement) || !hasActiveDeliveryOwner(entry, now) && (selectEntry === void 0 || selectEntry(entry, now).match);
}
const PERMANENT_ERROR_PATTERNS = [
	/no conversation reference found/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/chat_id is empty/i,
	/recipient is not a valid/i,
	/ambiguous .* recipient/i,
	/User .* not in room/i
];
function resolveMaxRetries(entry) {
	const configured = entry.maxRetries;
	return typeof configured === "number" && Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_MAX_RETRIES;
}
function isPermanentDeliveryError(error) {
	return PERMANENT_ERROR_PATTERNS.some((re) => re.test(error));
}
//#endregion
//#region src/infra/outbound/delivery-queue-reconciliation.ts
function buildReconciledSentResult(entry, reconciliation) {
	return {
		channel: entry.channel,
		messageId: reconciliation.messageId ?? reconciliation.receipt.primaryPlatformMessageId ?? reconciliation.receipt.platformMessageIds[0] ?? "",
		receipt: reconciliation.receipt
	};
}
function needsUnknownSendReconciliation(entry) {
	return entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send";
}
function buildUnknownSendContext(params) {
	const { entry } = params;
	return {
		cfg: params.cfg,
		queueId: entry.id,
		channel: entry.channel,
		to: entry.to,
		...entry.accountId !== void 0 ? { accountId: entry.accountId } : {},
		enqueuedAt: entry.enqueuedAt,
		retryCount: entry.retryCount,
		...entry.platformSendStartedAt !== void 0 ? { platformSendStartedAt: entry.platformSendStartedAt } : {},
		...entry.effectiveReplyToId !== void 0 ? { effectiveReplyToId: entry.effectiveReplyToId } : {},
		payloads: params.payloads,
		...entry.renderedBatchPlan ? { renderedBatchPlan: entry.renderedBatchPlan } : {},
		...entry.reply ? { replyToId: entry.reply.replyToId } : {},
		...entry.reply?.source === "implicit" ? { replyToMode: entry.reply.mode } : {},
		...entry.threadId !== void 0 ? { threadId: entry.threadId } : {},
		...entry.silent !== void 0 ? { silent: entry.silent } : {}
	};
}
/** Reconciles provider state without applying or rediscovering outbound policy. */
async function reconcileUnknownQueuedDelivery(params) {
	const adapter = await resolveOutboundChannelMessageAdapter({
		channel: params.entry.channel,
		cfg: params.cfg,
		agentId: params.entry.session?.agentId,
		allowBootstrap: true,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	const reconcileUnknownSend = adapter?.durableFinal?.capabilities?.reconcileUnknownSend === true ? adapter.durableFinal.reconcileUnknownSend : void 0;
	if (!reconcileUnknownSend) return null;
	const { entry } = params;
	try {
		return await reconcileUnknownSend(buildUnknownSendContext(params));
	} catch (error) {
		const message = formatErrorMessage(error);
		params.warn(`Delivery entry ${entry.id} unknown-send reconciliation failed: ${message}`);
		return {
			status: "unresolved",
			error: message,
			retryable: !isPermanentDeliveryError(message)
		};
	}
}
//#endregion
export { resolveChannelHandlerParams as C, normalizeTransformedPayloadForDelivery as S, stripInternalRuntimeScaffoldingFromPayload as T, deliveryKindForPayload as _, canReplayAmbiguousFinalText as a, normalizeEmptyPayloadForDelivery as b, resolveMaxRetries as c, isOutboundDeliveryResultArray as d, runOutboundDeliveryCommitHooks as f, collectPayloadMediaSources as g, findOutboundHandoffRejectedError as h, reconcileUnknownQueuedDelivery as i, shouldInspectQueuedDelivery as l, assertOutboundHandoffCurrent as m, buildUnknownSendContext as n, isOrdinaryFinalText as o, OutboundHandoffRejectedError as p, needsUnknownSendReconciliation as r, isPermanentDeliveryError as s, buildReconciledSentResult as t, attachOutboundDeliveryCommitHook as u, maybeNotifyAfterDeliveredPayload as v, resolveOutboundMediaAccessForSend as w, normalizePayloadsForChannelDelivery as x, maybePinDeliveredMessage as y };
