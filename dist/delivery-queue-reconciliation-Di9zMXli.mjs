import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { a as resolveReceiptSourceId } from "./receipt-CV_GHeLg.mjs";
import { u as summarizeOutboundPayloadForTransport } from "./payloads-Ce1fWBq6.mjs";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-6BYNCORY.mjs";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-C7X678hv.mjs";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-Do6h8EVN.mjs";
//#region src/infra/outbound/deliver-payload.ts
const log$1 = createSubsystemLogger("outbound/deliver");
function deliveryKindForPayload(payload, payloadSummary) {
	if (payloadSummary.mediaUrls.length > 0 || payload.mediaUrl || payload.mediaUrls?.length) return "media";
	if (payload.presentation || payload.interactive || payload.channelData || payload.audioAsVoice) return "other";
	return "text";
}
function normalizeEmptyPayloadForDelivery(payload) {
	const text = typeof payload.text === "string" ? payload.text : "";
	if (!text.trim()) {
		if (!hasReplyPayloadContent({
			...payload,
			text
		}, { extraContent: payload.location != null })) return null;
		if (text) return copyReplyPayloadMetadata(payload, {
			...payload,
			text: ""
		});
	}
	return payload;
}
function normalizePayloadsForChannelDelivery(plan, handler, copyPayloadMetadata) {
	const copyMetadata = copyPayloadMetadata ?? copyReplyPayloadMetadata;
	const normalizedPayloads = [];
	for (const entry of plan) {
		let sanitizedPayload = copyMetadata(entry.payload, stripInternalRuntimeScaffoldingFromPayload(entry.payload));
		if (!handler.preserveMarkdownDetails && sanitizedPayload.text) {
			const text = flattenMarkdownDetails(sanitizedPayload.text);
			if (text !== sanitizedPayload.text) sanitizedPayload = copyMetadata(sanitizedPayload, {
				...sanitizedPayload,
				text
			});
		}
		if (handler.sanitizeText && sanitizedPayload.text) {
			if (!handler.shouldSkipPlainTextSanitization?.(sanitizedPayload)) {
				const text = handler.sanitizeText(sanitizedPayload);
				if (text !== sanitizedPayload.text) sanitizedPayload = copyMetadata(sanitizedPayload, {
					...sanitizedPayload,
					text
				});
			}
		}
		const normalizedPayload = handler.normalizePayload ? handler.normalizePayload(sanitizedPayload) : sanitizedPayload;
		let normalized = normalizedPayload ? copyMetadata(sanitizedPayload, normalizedPayload) : null;
		if (normalized) {
			const stripped = copyMetadata(normalized, stripInternalRuntimeScaffoldingFromPayload(normalized));
			const nonEmpty = normalizeEmptyPayloadForDelivery(stripped);
			normalized = nonEmpty ? copyMetadata(stripped, nonEmpty) : null;
		}
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
	if (!changed) return value;
	const next = {};
	for (const [key, entry] of entries) next[key] = entry;
	return next;
}
/** Every media reference a payload set carries, in payload order. */
function collectPayloadMediaSources(payloads) {
	return payloads.flatMap((payload) => [...typeof payload.mediaUrl === "string" && payload.mediaUrl.trim() ? [payload.mediaUrl] : [], ...(payload.mediaUrls ?? []).filter((url) => typeof url === "string" && url.trim())]);
}
/**
* Resolves the media read capability for one send. Queue staging and the live
* send must resolve it identically: staging copies exactly the bytes the send is
* already allowed to read, so a narrower gate here would reject media the send
* would have delivered, and a wider one would widen read authority.
*/
function resolveOutboundMediaAccessForSend(params, channel, mediaSources) {
	if (mediaSources.length === 0) return params.mediaAccess ?? {};
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.session?.agentId ?? params.mirror?.agentId,
		mediaSources,
		mediaAccess: params.mediaAccess,
		sessionKey: params.session?.policyKey ?? params.session?.key,
		messageProvider: params.session?.key ? void 0 : channel,
		accountId: params.session?.requesterAccountId ?? params.accountId,
		requesterSenderId: params.session?.requesterSenderId,
		requesterSenderName: params.session?.requesterSenderName,
		requesterSenderUsername: params.session?.requesterSenderUsername,
		requesterSenderE164: params.session?.requesterSenderE164
	});
}
function stripInternalRuntimeScaffoldingFromPayload(payload) {
	const stripped = stripInternalRuntimeScaffoldingFromValue(payload);
	return stripped !== payload && stripped && typeof stripped === "object" && !Array.isArray(stripped) ? copyReplyPayloadMetadata(payload, stripped) : payload;
}
function buildPayloadSummary(payload) {
	return summarizeOutboundPayloadForTransport(payload);
}
function hasDeliveryResultIdentity(result) {
	return resolveReceiptSourceId(result) !== void 0;
}
function normalizeDeliveryPin(payload) {
	const pin = payload.delivery?.pin;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
	if (!pin.enabled) return;
	const normalized = { enabled: true };
	if (pin.notify === true) normalized.notify = true;
	if (pin.required === true) normalized.required = true;
	return normalized;
}
async function maybePinDeliveredMessage(params) {
	const pin = normalizeDeliveryPin(params.payload);
	if (!pin) return;
	if (!params.messageId) {
		if (pin.required) throw new Error("Delivery pin requested, but no delivered message id was returned.");
		log$1.warn("Delivery pin requested, but no delivered message id was returned.", {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	if (!params.handler.pinDeliveredMessage) {
		if (pin.required) throw new Error(`Delivery pin is not supported by channel: ${params.target.channel}`);
		log$1.warn("Delivery pin requested, but channel does not support pinning delivered messages.", {
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
		throw new OutboundHandoffRejectedError(error);
	}
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
	if (!hook) return result;
	const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
	hooks.push(hook);
	outboundDeliveryCommitHooks.set(result, hooks);
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
//#region src/infra/outbound/delivery-queue-reconciliation.ts
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
	if (adapter?.durableFinal?.capabilities?.reconcileUnknownSend !== true) return null;
	const reconcileUnknownSend = adapter.durableFinal.reconcileUnknownSend;
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
			retryable: true
		};
	}
}
//#endregion
export { resolveOutboundMediaAccessForSend as _, runOutboundDeliveryCommitHooks as a, findOutboundHandoffRejectedError as c, deliveryKindForPayload as d, hasDeliveryResultIdentity as f, normalizePayloadsForChannelDelivery as g, normalizeEmptyPayloadForDelivery as h, isOutboundDeliveryResultArray as i, buildPayloadSummary as l, maybePinDeliveredMessage as m, reconcileUnknownQueuedDelivery as n, OutboundHandoffRejectedError as o, maybeNotifyAfterDeliveredPayload as p, attachOutboundDeliveryCommitHook as r, assertOutboundHandoffCurrent as s, buildUnknownSendContext as t, collectPayloadMediaSources as u, stripInternalRuntimeScaffoldingFromPayload as v };
