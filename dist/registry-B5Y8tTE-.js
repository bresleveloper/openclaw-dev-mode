import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as normalizeChatChannelId } from "./ids-CkMlu8FB.js";
import { n as findRegisteredChannelPluginEntryById, r as listRegisteredChannelPluginEntries, t as findRegisteredChannelPluginEntry } from "./registry-lookup-BQxTB40L.js";
import "./chat-meta-CH2MWeRm.js";
//#region src/channels/registry.ts
/**
* Normalizes built-in chat channel ids without loading channel plugin implementations.
*/
function normalizeChannelId(raw) {
	return normalizeChatChannelId(raw);
}
/**
* Normalizes any registered channel plugin id or alias after registry initialization.
*/
function normalizeAnyChannelId(raw) {
	const key = normalizeOptionalLowercaseString(raw);
	if (!key) return null;
	return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
/**
* Lists registered channel plugin ids without importing their runtime implementations.
*/
function listRegisteredChannelPluginIds() {
	return listRegisteredChannelPluginEntries().flatMap((entry) => {
		const id = normalizeOptionalString(entry.plugin.id);
		return id ? [id] : [];
	});
}
/**
* Returns lightweight channel metadata used by message formatting and capability checks.
*/
function getRegisteredChannelPluginMeta(id) {
	return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}
/**
* Formats a concise channel primer line for setup/status flows.
*/
function formatChannelPrimerLine(meta) {
	return `${meta.label}: ${meta.blurb}`;
}
/**
* Formats a docs-aware channel selection line for interactive setup prompts.
*/
function formatChannelSelectionLine(meta, docsLink) {
	const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
	const docsLabel = meta.docsLabel ?? meta.id;
	const docs = meta.selectionDocsOmitLabel ? docsLink(meta.docsPath) : docsLink(meta.docsPath, docsLabel);
	const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
	return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
//#endregion
export { normalizeAnyChannelId as a, listRegisteredChannelPluginIds as i, formatChannelSelectionLine as n, normalizeChannelId as o, getRegisteredChannelPluginMeta as r, formatChannelPrimerLine as t };
