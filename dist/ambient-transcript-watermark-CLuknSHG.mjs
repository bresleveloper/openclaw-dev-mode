import "./session-accessor-l-4ZHvKn.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
//#region src/config/sessions/ambient-transcript-watermark.ts
function resolveAmbientTranscriptWatermarkKey(scope) {
	return JSON.stringify([
		scope.channel,
		scope.accountId ?? "",
		scope.conversationId,
		scope.threadId === void 0 ? "" : String(scope.threadId)
	]);
}
function numericMessageId(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isAmbientTranscriptWatermarkAfter(next, current) {
	if (!current) return true;
	if (next.timestampMs !== void 0 && current.timestampMs !== void 0) {
		if (next.timestampMs !== current.timestampMs) return next.timestampMs > current.timestampMs;
		const nextMessageId = numericMessageId(next.messageId);
		const currentMessageId = numericMessageId(current.messageId);
		return nextMessageId !== void 0 && currentMessageId !== void 0 && nextMessageId > currentMessageId;
	}
	const nextMessageId = numericMessageId(next.messageId);
	const currentMessageId = numericMessageId(current.messageId);
	if (nextMessageId !== void 0 && currentMessageId !== void 0) return nextMessageId > currentMessageId;
	return next.messageId !== current.messageId;
}
function readAmbientTranscriptWatermarkFromEntry(entry, key) {
	const watermark = entry?.ambientTranscriptWatermarks?.[key];
	return watermark?.sessionId === entry?.sessionId ? watermark : void 0;
}
async function updateAmbientTranscriptWatermark(params) {
	return await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => {
		if (!entry.sessionId) return null;
		if (params.expectedSessionId !== void 0 && entry.sessionId !== params.expectedSessionId) return null;
		const current = readAmbientTranscriptWatermarkFromEntry(entry, params.key);
		if (!isAmbientTranscriptWatermarkAfter({
			messageId: params.messageId,
			timestampMs: params.timestampMs
		}, current)) return null;
		return { ambientTranscriptWatermarks: {
			...entry.ambientTranscriptWatermarks,
			[params.key]: {
				sessionId: entry.sessionId,
				messageId: params.messageId,
				...params.timestampMs !== void 0 ? { timestampMs: params.timestampMs } : {},
				updatedAt: Date.now()
			}
		} };
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
export { resolveAmbientTranscriptWatermarkKey as n, updateAmbientTranscriptWatermark as r, readAmbientTranscriptWatermarkFromEntry as t };
