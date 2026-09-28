//#region src/channels/turn/dispatch-result.ts
const hasFinalSignal = (signals) => signals.fallbackDelivered === true || signals.deliverySummaryDelivered === true;
const hasVisibleSignal = (result, signals) => result?.observedReplyDelivery === true || signals.observedReplyDelivery === true || hasFinalSignal(signals);
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
	tool: 0,
	block: 0,
	final: 0
};
/** Returns whether a turn produced any visible reply delivery signal. */
function hasVisibleChannelTurnDispatchFromReceipt(result, signals = {}) {
	return result?.settledReceipt?.anyVisibleDelivered === true || hasVisibleSignal(result, signals);
}
function resolveChannelTurnDispatchCounts(result) {
	const counts = result?.settledReceipt?.counts;
	return counts ? {
		tool: counts.tool?.delivered ?? 0,
		block: counts.block?.delivered ?? 0,
		final: counts.final?.delivered ?? 0
	} : {
		...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
		...result?.counts
	};
}
function hasVisibleChannelTurnDispatch(result, signals = {}) {
	if (result?.settledReceipt) return hasVisibleChannelTurnDispatchFromReceipt(result, signals);
	return hasVisibleSignal(result, signals) || result?.queuedFinal === true || Object.values(resolveChannelTurnDispatchCounts(result)).some((count) => count > 0);
}
function hasFinalChannelTurnDispatch(result, signals = {}) {
	const finalCounts = result?.settledReceipt?.counts.final;
	return hasFinalSignal(signals) || (result?.settledReceipt ? (finalCounts?.delivered ?? 0) > 0 || (finalCounts?.failedAfterSend ?? 0) > 0 : result?.queuedFinal === true || resolveChannelTurnDispatchCounts(result).final > 0);
}
//#endregion
export { resolveChannelTurnDispatchCounts as i, hasFinalChannelTurnDispatch as n, hasVisibleChannelTurnDispatch as r, EMPTY_CHANNEL_TURN_DISPATCH_COUNTS as t };
