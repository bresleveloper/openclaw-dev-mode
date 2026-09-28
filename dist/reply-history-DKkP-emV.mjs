import { _ as recordChannelHistoryEntryWithMedia, a as buildChannelPendingHistoryContext, f as clearChannelHistoryIfEnabled, g as recordChannelHistoryEntryIfEnabled, i as buildChannelInboundHistory } from "./history-BQl9FdG2.mjs";
//#region src/channels/turn/history-window.ts
/** Creates a bounded channel history window over a caller-owned history map. */
function createChannelHistoryWindow(params) {
	const { historyMap } = params;
	return {
		record: (recordParams) => recordChannelHistoryEntryIfEnabled({
			historyMap,
			historyKey: recordParams.historyKey,
			limit: recordParams.limit,
			entry: recordParams.entry
		}),
		recordWithMedia: (recordParams) => recordChannelHistoryEntryWithMedia({
			historyMap,
			historyKey: recordParams.historyKey,
			limit: recordParams.limit,
			entry: recordParams.entry,
			media: recordParams.media,
			mediaLimit: recordParams.mediaLimit,
			messageId: recordParams.messageId,
			shouldRecord: recordParams.shouldRecord
		}),
		buildPendingContext: (contextParams) => buildChannelPendingHistoryContext({
			historyMap,
			historyKey: contextParams.historyKey,
			limit: contextParams.limit,
			currentMessage: contextParams.currentMessage,
			formatEntry: contextParams.formatEntry,
			lineBreak: contextParams.lineBreak
		}),
		buildInboundHistory: (historyParams) => buildChannelInboundHistory({
			historyMap,
			historyKey: historyParams.historyKey,
			limit: historyParams.limit
		}),
		clear: (clearParams) => clearChannelHistoryIfEnabled({
			historyMap,
			historyKey: clearParams.historyKey,
			limit: clearParams.limit
		})
	};
}
//#endregion
export { createChannelHistoryWindow as t };
