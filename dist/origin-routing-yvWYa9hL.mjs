import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
//#region src/auto-reply/reply/origin-routing.ts
/** Resolves the original message provider before reply redirection. */
function resolveOriginMessageProvider(params) {
	return normalizeMessageChannel(params.originatingChannel) ?? normalizeMessageChannel(params.provider);
}
//#endregion
export { resolveOriginMessageProvider as t };
