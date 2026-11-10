import { _ as recordChannelHistoryEntryWithMedia, a as buildChannelPendingHistoryContext, f as clearChannelHistoryIfEnabled, g as recordChannelHistoryEntryIfEnabled, i as buildChannelInboundHistory } from "./history-C_lABG5e.mjs";
//#region src/channels/turn/history-window.ts
function createChannelHistoryWindow(params) {
	const { historyMap } = params;
	return {
		record: (recordParams) => recordChannelHistoryEntryIfEnabled({
			...recordParams,
			historyMap
		}),
		recordWithMedia: (recordParams) => recordChannelHistoryEntryWithMedia({
			...recordParams,
			historyMap
		}),
		buildPendingContext: (contextParams) => buildChannelPendingHistoryContext({
			...contextParams,
			historyMap,
			formatEntry: contextParams.formatEntry
		}),
		buildInboundHistory: (historyParams) => buildChannelInboundHistory({
			...historyParams,
			historyMap
		}),
		clear: (clearParams) => clearChannelHistoryIfEnabled({
			...clearParams,
			historyMap
		})
	};
}
//#endregion
export { createChannelHistoryWindow as t };
