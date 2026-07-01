import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { h as stringifyRouteThreadId } from "./channel-route-BhPKCG_0.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
//#region src/infra/outbound/best-effort-delivery.ts
/** Normalizes an optional best-effort destination into a deliver/no-deliver decision. */
function resolveExternalBestEffortDeliveryTarget(params) {
	const normalizedChannel = normalizeMessageChannel(params.channel);
	const channel = normalizedChannel && isDeliverableMessageChannel(normalizedChannel) ? normalizedChannel : void 0;
	const to = normalizeOptionalString(params.to);
	const deliver = Boolean(channel && to);
	return {
		deliver,
		channel: deliver ? channel : void 0,
		to: deliver ? to : void 0,
		accountId: deliver ? normalizeOptionalString(params.accountId) : void 0,
		threadId: deliver && params.threadId != null && params.threadId !== "" ? stringifyRouteThreadId(params.threadId) : void 0
	};
}
/** Detects best-effort sends that should stay session-only on the internal channel. */
function shouldDowngradeDeliveryToSessionOnly(params) {
	return params.wantsDelivery && params.bestEffortDeliver && params.resolvedChannel === "webchat";
}
//#endregion
export { shouldDowngradeDeliveryToSessionOnly as n, resolveExternalBestEffortDeliveryTarget as t };
