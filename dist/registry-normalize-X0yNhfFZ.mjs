import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as findRegisteredChannelPluginEntry } from "./registry-lookup-CHpIYnmq.mjs";
//#region src/channels/registry-normalize.ts
/** Normalizes user/config channel identifiers so aliases resolve to canonical channel ids. */
function normalizeAnyChannelId(raw) {
	const key = normalizeOptionalLowercaseString(raw);
	if (!key) return null;
	return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
//#endregion
export { normalizeAnyChannelId as t };
