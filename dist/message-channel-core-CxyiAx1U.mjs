import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
//#region src/utils/message-channel-core.ts
/**
* Shared message-channel normalization for delivery, routing, config, and gateway headers.
*
* Built-in aliases normalize through channel ids, while plugin-owned channel ids
* stay accepted even when core has no bundled alias for them.
*/
/** Normalizes raw channel names, aliases, and internal webchat into canonical ids. */
function normalizeMessageChannel(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	if (normalized === "webchat") return INTERNAL_MESSAGE_CHANNEL;
	const builtIn = normalizeChatChannelId(normalized);
	if (builtIn) return builtIn;
	return normalizeAnyChannelId(normalized) ?? normalized;
}
/** Returns true for already-normalized channel ids except internal webchat. */
function isNormalizedMessageChannel(value) {
	const normalized = normalizeMessageChannel(value);
	return normalized !== void 0 && normalized !== "webchat" && normalized === value;
}
//#endregion
export { normalizeMessageChannel as n, isNormalizedMessageChannel as t };
