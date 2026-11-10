import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { t as resolveLoadedSessionThreadInfo } from "./session-thread-info-loaded-DkK6y09R.mjs";
//#region src/auto-reply/reply/routed-delivery-thread.ts
/** Routed delivery thread classification and id resolution helpers. */
function isSlackDirectRoutedThreadTurn(ctx) {
	if (normalizeChatType(ctx.ChatType) !== "direct") return false;
	if (ctx.MessageThreadId == null && ctx.TransportThreadId == null) return false;
	return [
		ctx.Provider,
		ctx.Surface,
		ctx.OriginatingChannel
	].some((value) => normalizeOptionalString(value)?.toLowerCase() === "slack");
}
/** Prefers current inbound thread ids, falling back to persisted session thread metadata. */
function resolveRoutedDeliveryThreadId(params) {
	return params.ctx.MessageThreadId ?? params.ctx.TransportThreadId ?? resolveLoadedSessionThreadInfo(params.sessionKey).threadId;
}
//#endregion
export { resolveRoutedDeliveryThreadId as n, isSlackDirectRoutedThreadTurn as t };
