import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList, h as normalizeUniqueStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
//#region src/channels/message/receipt.ts
/** Reads reported recipients, including every physical part of an aggregate receipt. */
function listMessageReceiptSourceTargets(value) {
	const targets = /* @__PURE__ */ new Set();
	const seen = /* @__PURE__ */ new Set();
	const pending = [value];
	for (const entry of pending) {
		if (!entry || typeof entry !== "object" || seen.has(entry)) continue;
		seen.add(entry);
		if (Array.isArray(entry)) {
			pending.push(...entry);
			continue;
		}
		const record = asOptionalRecord(entry);
		if (!record || record.outcome === "not_sent") continue;
		const ids = [
			asOptionalRecord(record.target)?.id,
			record.chatId,
			record.channelId,
			record.roomId,
			record.conversationId,
			record.toJid
		];
		for (const id of ids) {
			const normalized = normalizeOptionalString(id);
			if (normalized) targets.add(normalized);
		}
		pending.push(record.receipt, record.raw, record.parts, record.sourceResults);
	}
	return [...targets];
}
function resolveReceiptSourceId(result) {
	if (result.outcome === "not_sent") return;
	return normalizeOptionalString(result.messageId) ?? (result.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : void 0) ?? normalizeOptionalString(result.pollId);
}
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
function createMessageReceiptFromOutboundResults(params) {
	const sentResults = params.results.filter((result) => result.outcome !== "not_sent");
	const requestedThreadId = normalizeOptionalString(params.threadId);
	const providerThreadIds = uniqueStrings(sentResults.flatMap(({ receipt }) => receipt?.parts.length ? receipt.parts.flatMap((part) => normalizeOptionalString(part.threadId) ?? normalizeOptionalString(receipt.threadId) ?? []) : normalizeOptionalString(receipt?.threadId) ?? []));
	const aggregateThreadId = providerThreadIds.length > 1 ? void 0 : providerThreadIds[0] ?? requestedThreadId;
	const parts = sentResults.flatMap((result, resultIndex) => {
		const receipt = result.receipt;
		const threadId = normalizeOptionalString(receipt?.threadId) ?? requestedThreadId;
		if (receipt?.parts.length) {
			const hasPartReplyMetadata = receipt.parts.some((part) => part.replyToId);
			return receipt.parts.map((part, partIndex) => ({
				...part,
				index: part.index ?? partIndex,
				...normalizeOptionalString(part.threadId) || !threadId ? {} : { threadId },
				...part.replyToId || !params.replyToId || hasPartReplyMetadata ? {} : { replyToId: params.replyToId }
			}));
		}
		const sourceId = receipt ? void 0 : resolveReceiptSourceId(result);
		return (receipt ? receipt.platformMessageIds : sourceId ? [sourceId] : []).map((platformMessageId, partIndex) => Object.assign({
			platformMessageId,
			kind: params.kind ?? "unknown",
			index: receipt ? partIndex : resultIndex
		}, threadId ? { threadId } : {}, params.replyToId ? { replyToId: params.replyToId } : {}, receipt ? {} : { raw: result }));
	});
	const platformMessageIds = normalizeUniqueTrimmedStringList(sentResults.flatMap((result) => result.receipt ? [
		result.receipt.primaryPlatformMessageId,
		...result.receipt.platformMessageIds,
		...result.receipt.parts.map((part) => part.platformMessageId)
	] : [resolveReceiptSourceId(result)]));
	const firstNestedReceipt = sentResults.find((result) => result.receipt)?.receipt;
	return {
		...platformMessageIds[0] ? { primaryPlatformMessageId: platformMessageIds[0] } : {},
		platformMessageIds,
		parts,
		...aggregateThreadId ? { threadId: aggregateThreadId } : {},
		...params.replyToId ?? firstNestedReceipt?.replyToId ? { replyToId: params.replyToId ?? firstNestedReceipt?.replyToId } : {},
		sentAt: params.sentAt ?? firstNestedReceipt?.sentAt ?? Date.now(),
		raw: params.results,
		sourceResults: Object.freeze(params.results.flatMap((result) => result.outcome !== "not_sent" && result.receipt?.sourceResults?.length ? result.receipt.sourceResults.map((source) => Object.freeze({
			...source.channel !== void 0 ? { channel: source.channel } : {},
			...source.outcome === "not_sent" ? { outcome: "not_sent" } : {},
			messageId: source.messageId ?? ""
		})) : [Object.freeze({
			...result.channel ? { channel: result.channel } : {},
			...result.outcome === "not_sent" ? { outcome: "not_sent" } : {},
			messageId: resolveReceiptSourceId(result) ?? ""
		})]))
	};
}
/** Lists unique platform message ids in receipt order. */
function listMessageReceiptPlatformIds(receipt) {
	return normalizeUniqueStringEntries(receipt.platformMessageIds);
}
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
function resolveMessageReceiptPrimaryId(receipt) {
	return normalizeOptionalString(receipt.primaryPlatformMessageId) ?? listMessageReceiptPlatformIds(receipt)[0] ?? receipt.parts.map((part) => normalizeOptionalString(part.platformMessageId)).find(Boolean);
}
/** Resolves provider-owned thread placement without collapsing conflicting receipt parts. */
function resolveMessageReceiptThreadId(receipt, requestedThreadId) {
	const partThreadIds = uniqueStrings(receipt.parts.flatMap((part) => normalizeOptionalString(part.threadId) ?? []));
	if (partThreadIds.length > 1) return;
	return partThreadIds[0] ?? normalizeOptionalString(receipt.threadId) ?? normalizeOptionalString(requestedThreadId);
}
//#endregion
export { resolveMessageReceiptThreadId as a, resolveMessageReceiptPrimaryId as i, listMessageReceiptPlatformIds as n, resolveReceiptSourceId as o, listMessageReceiptSourceTargets as r, createMessageReceiptFromOutboundResults as t };
