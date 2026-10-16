import { n as listBundledChannelCatalogEntries } from "../bundled-channel-catalog-read-RnVMS1bC.mjs";
//#region src/plugin-sdk/chat-channel-ids.ts
/**
* Canonical bundled chat-channel id list.
*
* Mirrors the channel catalog ids that can be passed to the inbound-envelope
* formatter (src/auto-reply/envelope.ts -> formatInboundEnvelope ->
* formatAgentEnvelope) for its leading `[<channel> ...]` header. Plugins that
* need to recognize an envelope-prefixed message (for example a memory plugin
* filtering envelope sludge out of long-term capture) should not hardcode their
* own channel-id table that can drift from the catalog.
*
* The list is derived from the same bundled/official channel catalog reader as
* runtime channel metadata so catalog-only channels stay covered even when they
* do not have a generated config metadata entry.
*/
const BUNDLED_CHAT_CHANNEL_ENTRIES = listBundledChannelCatalogEntries();
/** Bundled chat-channel ids from the official channel catalog. */
const BUNDLED_CHAT_CHANNEL_IDS = Object.freeze(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Channel ids, labels, and aliases that can appear as inbound-envelope prefixes.
* Consumers should use this for envelope cleanup instead of hardcoding channel names.
*/
const BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES = Object.freeze((() => {
	const prefixes = /* @__PURE__ */ new Map();
	for (const entry of BUNDLED_CHAT_CHANNEL_ENTRIES) for (const raw of [
		entry.id,
		entry.channel.label,
		...entry.aliases
	]) {
		const value = raw?.trim();
		const key = value?.toLocaleLowerCase("en-US");
		if (value && key && !prefixes.has(key)) prefixes.set(key, value);
	}
	return [...prefixes.values()];
})());
//#endregion
export { BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES, BUNDLED_CHAT_CHANNEL_IDS };
