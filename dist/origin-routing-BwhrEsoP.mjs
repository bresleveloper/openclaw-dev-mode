import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
//#region src/auto-reply/reply/origin-routing.ts
/** Resolves the original message provider before reply redirection. */
function resolveOriginMessageProvider(params) {
	return normalizeMessageChannel(params.originatingChannel) ?? normalizeMessageChannel(params.provider);
}
//#endregion
export { resolveOriginMessageProvider as t };
