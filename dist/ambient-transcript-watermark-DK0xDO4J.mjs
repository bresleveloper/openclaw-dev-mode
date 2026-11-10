import { t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
//#region src/config/sessions/ambient-transcript-watermark.ts
function resolveAmbientTranscriptWatermarkKey(scope) {
	return JSON.stringify([
		scope.channel,
		scope.accountId ?? "",
		scope.conversationId,
		scope.threadId === void 0 ? "" : String(scope.threadId)
	]);
}
async function updateAmbientTranscriptWatermark(params) {
	return await applySessionEntryOperation({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, {
		kind: "ambient-transcript-watermark",
		watermark: {
			...params,
			now: Date.now()
		}
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
export { updateAmbientTranscriptWatermark as n, resolveAmbientTranscriptWatermarkKey as t };
