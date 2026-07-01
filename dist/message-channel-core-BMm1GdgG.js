import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as normalizeChatChannelId } from "./ids-CkMlu8FB.js";
import { t as findRegisteredChannelPluginEntry } from "./registry-lookup-BQxTB40L.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Z0pS5ykd.js";
//#region src/channels/registry-normalize.ts
/** Normalizes user/config channel identifiers so aliases resolve to canonical channel ids. */
function normalizeAnyChannelId(raw) {
	const key = normalizeOptionalLowercaseString(raw);
	if (!key) return null;
	return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
//#endregion
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
/** Returns true only when a value is already a normalized, non-internal delivery channel id. */
function isDeliverableMessageChannel(value) {
	const normalized = normalizeMessageChannel(value);
	return normalized !== void 0 && normalized !== "webchat" && normalized === value;
}
//#endregion
export { normalizeMessageChannel as n, normalizeAnyChannelId as r, isDeliverableMessageChannel as t };
