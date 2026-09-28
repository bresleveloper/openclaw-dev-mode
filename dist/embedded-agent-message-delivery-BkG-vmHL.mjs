import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-CV_GHeLg.mjs";
//#region src/agents/embedded-agent-message-delivery.ts
const NON_DELIVERY_IDS = /* @__PURE__ */ new Set(["skipped", "suppressed"]);
const NON_DELIVERY_STATUSES = /* @__PURE__ */ new Set(["failed", ...NON_DELIVERY_IDS]);
const STATUSES = /* @__PURE__ */ new Set([
	"settled",
	"suppressed",
	"dryRun",
	"failed"
]);
const PLUGIN_ENVELOPE_KEYS = [
	"details",
	"payload",
	"result",
	"results",
	"sendResult",
	"toolResult"
];
const EMPTY_DELIVERY_FACT = {
	partialDelivery: false,
	createdThreadIds: []
};
function isDeliveryStatus(value) {
	return typeof value === "string" && STATUSES.has(value);
}
function deliveryId(value) {
	const id = typeof value === "string" ? value.trim() : "";
	return id && !NON_DELIVERY_IDS.has(id.toLowerCase()) ? id : void 0;
}
function projectReceiptIdentity(delivery) {
	const receipt = delivery?.receipt;
	const primaryPlatformMessageId = [
		receipt ? resolveMessageReceiptPrimaryId(receipt) : void 0,
		delivery?.messageId,
		delivery?.pollId,
		...receipt?.parts.map((part) => part.platformMessageId) ?? []
	].map(deliveryId).find(Boolean);
	const createdThreadIds = [receipt?.threadId, ...receipt?.parts.map((part) => part.threadId) ?? []].flatMap((id) => typeof id === "string" && id.trim() ? [id.trim()] : []);
	return {
		primaryPlatformMessageId,
		createdThreadIds: [...new Set(createdThreadIds)]
	};
}
function normalizeStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
function visitPluginEnvelope(value, predicate, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => visitPluginEnvelope(item, predicate, depth + 1));
	const record = asOptionalRecord(value);
	if (!record) return false;
	if (predicate(record, normalizeStatus(record.deliveryStatus) ?? normalizeStatus(record.status))) return true;
	if (typeof record.text === "string") {
		const parsed = safeParseJsonRecord(record.text);
		if (parsed && visitPluginEnvelope(parsed, predicate, depth + 1)) return true;
	}
	if (Array.isArray(record.content) && record.content.some((item) => visitPluginEnvelope(item, predicate, depth + 1))) return true;
	return PLUGIN_ENVELOPE_KEYS.some((key) => visitPluginEnvelope(record[key], predicate, depth + 1));
}
const PLUGIN_SIGNALS = {
	dryRun: (record, status) => record.dryRun === true || status === "dry_run" || normalizeStatus(record.status) === "dry_run",
	failure: (record) => record.ok === false || record.success === false || record.isError === true || record.delivered === false || record.complete === false || Boolean(record.error) || [record.status, record.deliveryStatus].some((value) => {
		const status = normalizeStatus(value);
		return status === "error" || status === "incomplete" || status === "partial_failed" || status === "dry_run" || status !== void 0 && NON_DELIVERY_STATUSES.has(status);
	}),
	partial: (record, status) => record.sentBeforeError === true || record.visibleReplySent === true || status === "partial_failed",
	conversation: (record) => [
		record.topicId,
		record.threadId,
		record.messageThreadId,
		asOptionalRecord(record.thread)?.id
	].some((id) => hasNonEmptyString(id) || typeof id === "number" && Number.isFinite(id)),
	nonDelivery: (record, status) => {
		const id = normalizeStatus(record.messageId);
		return id !== void 0 && NON_DELIVERY_IDS.has(id) || status !== void 0 && NON_DELIVERY_STATUSES.has(status);
	},
	noOp: (record, status) => {
		const removed = record.removed;
		return removed === null || removed === false || removed === 0 || Array.isArray(removed) && removed.length === 0 || record.applied === false || record.changed === false || record.created === false || record.deleted === false || record.sent === false || record.updated === false || status === "noop" || status === "no_op" || status === "not_found";
	},
	delivery: (record, status) => {
		const message = asOptionalRecord(record.message);
		return [
			record.messageId,
			record.pollId,
			message?.id
		].map(normalizeStatus).filter((id) => Boolean(id)).some((id) => !NON_DELIVERY_IDS.has(id)) || status === "sent" || normalizeStatus(record.text) === "sent";
	},
	deliveryId: (record) => [
		record.messageId,
		record.pollId,
		asOptionalRecord(record.message)?.id
	].map(normalizeStatus).some((id) => Boolean(id && !NON_DELIVERY_IDS.has(id))),
	ok: (record) => record.ok === true || normalizeStatus(record.text) === "ok"
};
function pluginEnvelopeHas(value, signal) {
	return visitPluginEnvelope(value, PLUGIN_SIGNALS[signal]);
}
function readPluginDeliveryId(value) {
	let found;
	visitPluginEnvelope(value, (record) => {
		found = [
			record.messageId,
			record.pollId,
			asOptionalRecord(record.message)?.id
		].map(deliveryId).find(Boolean);
		return found !== void 0;
	});
	return found;
}
function projectPluginMessageDeliveryFact(value) {
	if (pluginEnvelopeHas(value, "dryRun")) return {
		status: "dryRun",
		...EMPTY_DELIVERY_FACT
	};
	if (pluginEnvelopeHas(value, "partial")) return {
		status: "settled",
		partialDelivery: true,
		createdThreadIds: []
	};
	if (pluginEnvelopeHas(value, "nonDelivery")) return {
		status: "suppressed",
		...EMPTY_DELIVERY_FACT
	};
	if (pluginEnvelopeHas(value, "noOp") || pluginEnvelopeHas(value, "failure")) return {
		status: "failed",
		...EMPTY_DELIVERY_FACT
	};
	if (!pluginEnvelopeHas(value, "delivery") && !pluginEnvelopeHas(value, "ok")) return;
	const primaryPlatformMessageId = readPluginDeliveryId(value);
	return {
		status: "settled",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		...EMPTY_DELIVERY_FACT
	};
}
function pluginBroadcastHasDelivery(value) {
	return visitPluginEnvelope(value, (record) => Array.isArray(record.results) && record.results.some((item) => {
		const entry = asOptionalRecord(item);
		if (!entry || entry.ok !== true || pluginEnvelopeHas(entry, "nonDelivery")) return false;
		return [entry.payload, entry.toolResult].some((payload) => projectPluginMessageDeliveryFact(payload)?.status === "settled");
	}));
}
function projectSend(result) {
	const delivery = result.result;
	const { primaryPlatformMessageId, createdThreadIds } = projectReceiptIdentity(delivery);
	const partialDelivery = result.deliveryStatus === "partial_failed" || result.sentBeforeError === true;
	const nonDeliveryId = typeof delivery?.messageId === "string" && NON_DELIVERY_IDS.has(delivery.messageId.trim().toLowerCase());
	return {
		status: result.dryRun ? "dryRun" : partialDelivery ? "settled" : result.deliveryStatus === "suppressed" || nonDeliveryId ? "suppressed" : result.deliveryStatus === "sent" || primaryPlatformMessageId ? "settled" : "failed",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		partialDelivery,
		createdThreadIds
	};
}
function projectPoll(result) {
	const { primaryPlatformMessageId, createdThreadIds } = projectReceiptIdentity(result.result);
	return {
		status: result.dryRun ? "dryRun" : primaryPlatformMessageId ? "settled" : "failed",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		partialDelivery: false,
		createdThreadIds
	};
}
function projectEmbeddedMessageDeliveryFact(result, currentSourceReply = false) {
	const payloadDelivery = result.dryRun ? void 0 : projectPluginMessageDeliveryFact(result.payload);
	const partialDelivery = payloadDelivery?.partialDelivery ? payloadDelivery : void 0;
	if (currentSourceReply && result.handledBy === "plugin") return result.dryRun ? {
		status: "dryRun",
		...EMPTY_DELIVERY_FACT
	} : projectPluginMessageDeliveryFact(result.payload);
	if (result.kind === "send") return result.handledBy === "core" && result.sendResult ? projectSend(result.sendResult) : result.handledBy === "internal-source" ? {
		status: result.dryRun ? "dryRun" : "settled",
		partialDelivery: false,
		createdThreadIds: []
	} : partialDelivery;
	if (result.kind === "poll") return result.handledBy === "core" && result.pollResult ? projectPoll(result.pollResult) : partialDelivery;
	if (result.kind !== "broadcast") return partialDelivery;
	const entries = result.payload.results.map((entry) => ({
		entry,
		fact: entry.result ? projectSend(entry.result) : entry.sentBeforeError ? {
			status: "settled",
			partialDelivery: true,
			createdThreadIds: []
		} : entry.ok ? projectPluginMessageDeliveryFact(entry.payload) : void 0
	}));
	const facts = entries.flatMap(({ fact }) => fact ? [fact] : []);
	const settled = facts.find((fact) => fact.status === "settled");
	if (settled) return entries.some(({ entry }) => !entry.ok) && !settled.partialDelivery ? {
		...settled,
		partialDelivery: true
	} : settled;
	if (entries.some(({ entry, fact }) => entry.ok && !entry.result && !fact)) return;
	return facts.find((fact) => fact.status === "suppressed") ?? facts.find((fact) => fact.status === "dryRun") ?? {
		status: "failed",
		partialDelivery: false,
		createdThreadIds: []
	};
}
function hasAcceptedBroadcastDelivery(result) {
	return !result.dryRun && result.kind === "broadcast" && result.payload.results.some((entry) => entry.ok || entry.sentBeforeError);
}
function attachEmbeddedMessageDeliveryFact(result, fact) {
	const details = asOptionalRecord(result.details);
	if (!fact) {
		if (!details || !("messageDelivery" in details)) return result;
		const { messageDelivery: _reserved, ...rest } = details;
		return {
			...result,
			details: rest
		};
	}
	return {
		...result,
		details: {
			...details,
			messageDelivery: fact
		}
	};
}
function isDeliveredCoreCurrentChannelWidgetResult(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only" || params.toolName !== "show_widget" || params.isToolError || params.coreBuiltinToolNames?.has("show_widget") !== true) return false;
	const details = asOptionalRecord(params.result)?.details;
	const presentation = asOptionalRecord(asOptionalRecord(details)?.presentation);
	const receipt = asOptionalRecord(presentation?.receipt);
	if (asOptionalRecord(details)?.kind !== "widget" || presentation?.target !== "current_channel") return false;
	return [
		receipt?.primaryPlatformMessageId,
		...Array.isArray(receipt?.platformMessageIds) ? receipt.platformMessageIds : [],
		...Array.isArray(receipt?.parts) ? receipt.parts.map((part) => asOptionalRecord(part)?.platformMessageId) : []
	].some((id) => hasNonEmptyString(id));
}
function readEmbeddedMessageDeliveryFact(value) {
	const fact = asOptionalRecord(value);
	const createdThreadIds = Array.isArray(fact?.createdThreadIds) ? fact.createdThreadIds.filter((id) => typeof id === "string") : [];
	if (!fact || !isDeliveryStatus(fact.status) || typeof fact.partialDelivery !== "boolean" || !Array.isArray(fact.createdThreadIds) || createdThreadIds.length !== fact.createdThreadIds.length || fact.primaryPlatformMessageId !== void 0 && typeof fact.primaryPlatformMessageId !== "string") return;
	return {
		status: fact.status,
		...fact.status === "settled" && !fact.partialDelivery && fact.sourceReplyDelivered === true ? { sourceReplyDelivered: true } : {},
		...fact.primaryPlatformMessageId ? { primaryPlatformMessageId: fact.primaryPlatformMessageId } : {},
		partialDelivery: fact.partialDelivery,
		createdThreadIds
	};
}
//#endregion
export { pluginEnvelopeHas as a, readEmbeddedMessageDeliveryFact as c, pluginBroadcastHasDelivery as i, hasAcceptedBroadcastDelivery as n, projectEmbeddedMessageDeliveryFact as o, isDeliveredCoreCurrentChannelWidgetResult as r, projectPluginMessageDeliveryFact as s, attachEmbeddedMessageDeliveryFact as t };
