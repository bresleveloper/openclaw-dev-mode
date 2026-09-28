import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
//#region src/channels/message/receipt.ts
/**
* Channel message receipt normalization.
*
* Builds stable receipts from platform send results and nested adapter receipt data.
*/
const normalizeIdentity = (value) => value?.trim() || void 0;
function resolveReceiptSourceId(result) {
	if (result.outcome === "not_sent") return;
	return normalizeIdentity(result.messageId) ?? (result.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : void 0) ?? normalizeIdentity(result.pollId);
}
function appendUnique(values, value) {
	const normalized = value?.trim();
	if (normalized && !values.includes(normalized)) values.push(normalized);
}
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
function createMessageReceiptFromOutboundResults(params) {
	const sentResults = params.results.filter((result) => result.outcome !== "not_sent");
	const requestedThreadId = normalizeIdentity(params.threadId);
	const providerThreadIds = normalizeUniqueStringEntries(sentResults.flatMap(({ receipt }) => receipt?.parts.length ? receipt.parts.flatMap((part) => normalizeIdentity(part.threadId) ?? normalizeIdentity(receipt.threadId) ?? []) : normalizeIdentity(receipt?.threadId) ?? []));
	const aggregateThreadId = providerThreadIds.length > 1 ? void 0 : providerThreadIds[0] ?? requestedThreadId;
	const parts = sentResults.flatMap((result, resultIndex) => {
		if (result.receipt) {
			const receiptThreadId = normalizeIdentity(result.receipt.threadId) ?? requestedThreadId;
			if (result.receipt.parts.length === 0) return result.receipt.platformMessageIds.map((platformMessageId, partIndex) => ({
				platformMessageId,
				kind: params.kind ?? "unknown",
				index: partIndex,
				...receiptThreadId ? { threadId: receiptThreadId } : {},
				...params.replyToId ? { replyToId: params.replyToId } : {}
			}));
			const hasPartReplyMetadata = result.receipt.parts.some((part) => part.replyToId);
			return result.receipt.parts.map((part, partIndex) => ({
				...part,
				index: part.index ?? partIndex,
				...normalizeIdentity(part.threadId) || !receiptThreadId ? {} : { threadId: receiptThreadId },
				...part.replyToId || !params.replyToId || hasPartReplyMetadata ? {} : { replyToId: params.replyToId }
			}));
		}
		const platformMessageId = resolveReceiptSourceId(result);
		if (!platformMessageId) return [];
		return [{
			platformMessageId,
			kind: params.kind ?? "unknown",
			index: resultIndex,
			...requestedThreadId ? { threadId: requestedThreadId } : {},
			...params.replyToId ? { replyToId: params.replyToId } : {},
			raw: result
		}];
	});
	const platformMessageIds = [];
	for (const result of sentResults) {
		if (result.receipt) {
			appendUnique(platformMessageIds, result.receipt.primaryPlatformMessageId);
			for (const platformMessageId of result.receipt.platformMessageIds) appendUnique(platformMessageIds, platformMessageId);
			for (const part of result.receipt.parts) appendUnique(platformMessageIds, part.platformMessageId);
			continue;
		}
		appendUnique(platformMessageIds, resolveReceiptSourceId(result));
	}
	const firstNestedReceipt = sentResults.find((result) => result.receipt)?.receipt;
	return {
		...platformMessageIds[0] ? { primaryPlatformMessageId: platformMessageIds[0] } : {},
		platformMessageIds,
		parts,
		...aggregateThreadId ? { threadId: aggregateThreadId } : {},
		...params.replyToId ?? firstNestedReceipt?.replyToId ? { replyToId: params.replyToId ?? firstNestedReceipt?.replyToId } : {},
		sentAt: params.sentAt ?? firstNestedReceipt?.sentAt ?? Date.now(),
		raw: params.results
	};
}
/** Lists unique platform message ids in receipt order. */
function listMessageReceiptPlatformIds(receipt) {
	return normalizeUniqueStringEntries(receipt.platformMessageIds);
}
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
function resolveMessageReceiptPrimaryId(receipt) {
	const primary = normalizeIdentity(receipt.primaryPlatformMessageId);
	if (primary) return primary;
	return listMessageReceiptPlatformIds(receipt)[0] ?? receipt.parts.map((part) => normalizeIdentity(part.platformMessageId)).find(Boolean);
}
/** Resolves provider-owned thread placement without collapsing conflicting receipt parts. */
function resolveMessageReceiptThreadId(receipt, requestedThreadId) {
	const partThreadIds = normalizeUniqueStringEntries(receipt.parts.flatMap((part) => normalizeIdentity(part.threadId) ?? []));
	if (partThreadIds.length > 1) return;
	return partThreadIds[0] ?? normalizeIdentity(receipt.threadId) ?? normalizeIdentity(requestedThreadId);
}
//#endregion
export { resolveReceiptSourceId as a, resolveMessageReceiptThreadId as i, listMessageReceiptPlatformIds as n, resolveMessageReceiptPrimaryId as r, createMessageReceiptFromOutboundResults as t };
