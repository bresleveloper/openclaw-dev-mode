import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./ids-NACrHrny.mjs";
import "./chat-meta-CrZhPtTU.mjs";
import { n as findRegisteredChannelPluginEntryById, r as listRegisteredChannelPluginEntries } from "./registry-lookup-CHpIYnmq.mjs";
//#region src/channels/registry.ts
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
export { listRegisteredChannelPluginIds as i, formatChannelSelectionLine as n, getRegisteredChannelPluginMeta as r, formatChannelPrimerLine as t };
