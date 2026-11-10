import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-CP-G92J1.mjs";
import { n as CHAT_CHANNEL_ORDER } from "./ids-DhLNdNuz.mjs";
import { n as findRegisteredChannelPluginEntryById, r as listRegisteredChannelPluginEntries } from "./registry-lookup-88y6FuGR.mjs";
import { t as buildManifestChannelMeta } from "./channel-meta-Z2puM9_M.mjs";
//#region src/channels/chat-meta-shared.ts
const CHAT_CHANNEL_ID_SET = new Set(CHAT_CHANNEL_ORDER);
function buildChatChannelMetaById() {
	const entries = /* @__PURE__ */ new Map();
	for (const entry of listBundledChannelCatalogEntries()) {
		const id = normalizeOptionalString(entry.id);
		if (!id || !CHAT_CHANNEL_ID_SET.has(id)) continue;
		const channel = entry.channel;
		const label = normalizeOptionalString(channel.label);
		if (!label) throw new Error(`Missing label for bundled chat channel "${id}"`);
		entries.set(id, buildManifestChannelMeta({
			id,
			channel,
			label,
			selectionLabel: normalizeOptionalString(channel.selectionLabel) || label,
			docsPath: normalizeOptionalString(channel.docsPath) || `/channels/${id}`,
			docsLabel: normalizeOptionalString(channel.docsLabel),
			blurb: normalizeOptionalString(channel.blurb) || "",
			detailLabel: normalizeOptionalString(channel.detailLabel),
			systemImage: normalizeOptionalString(channel.systemImage),
			arrayFieldMode: "non-empty"
		}));
	}
	return Object.freeze(Object.fromEntries(entries));
}
//#endregion
//#region src/channels/chat-meta.ts
let chatChannelMetaCache;
function getChatChannelMetaById() {
	const cacheKey = resolveBundledPluginsDir(process.env) ?? "";
	if (chatChannelMetaCache?.cacheKey !== cacheKey) chatChannelMetaCache = {
		cacheKey,
		metaById: buildChatChannelMetaById()
	};
	return chatChannelMetaCache.metaById;
}
function listChatChannels() {
	const metaById = getChatChannelMetaById();
	return CHAT_CHANNEL_ORDER.map((id) => metaById[id]).filter((meta) => Boolean(meta));
}
/** Drift-tolerant lookup: undefined when the id is missing from the bundled catalog. */
function findChatChannelMeta(id) {
	return getChatChannelMetaById()[id];
}
/**
* Returns metadata for one built-in chat channel id.
* Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
* violation; drift-tolerant core paths use findChatChannelMeta instead.
*/
function getChatChannelMeta(id) {
	return expectDefined(findChatChannelMeta(id), `chat channel meta for ${id}`);
}
//#endregion
//#region src/channels/registry.ts
/** Lists registered ids without importing their runtime implementations. */
function listRegisteredChannelPluginIds() {
	return listRegisteredChannelPluginEntries().flatMap((entry) => {
		const id = normalizeOptionalString(entry.plugin.id);
		return id ? [id] : [];
	});
}
function getRegisteredChannelPluginMeta(id) {
	return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}
function formatChannelPrimerLine(meta) {
	return `${meta.label}: ${meta.blurb}`;
}
function formatChannelSelectionLine(meta, docsLink) {
	const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
	const docsLabel = meta.docsLabel ?? meta.id;
	const docs = meta.selectionDocsOmitLabel ? docsLink(meta.docsPath) : docsLink(meta.docsPath, docsLabel);
	const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
	return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
//#endregion
export { findChatChannelMeta as a, listRegisteredChannelPluginIds as i, formatChannelSelectionLine as n, getChatChannelMeta as o, getRegisteredChannelPluginMeta as r, listChatChannels as s, formatChannelPrimerLine as t };
