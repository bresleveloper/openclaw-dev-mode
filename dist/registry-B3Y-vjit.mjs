import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-RnVMS1bC.mjs";
import { n as CHAT_CHANNEL_ORDER } from "./ids-BFfFS5ep.mjs";
import { n as findRegisteredChannelPluginEntryById, r as listRegisteredChannelPluginEntries } from "./registry-lookup-CszP7Fcb.mjs";
import { t as buildManifestChannelMeta } from "./channel-meta-BgTks57p.mjs";
//#region src/channels/chat-meta-shared.ts
const CHAT_CHANNEL_ID_SET = new Set(CHAT_CHANNEL_ORDER);
function toChatChannelMeta(params) {
	const label = normalizeOptionalString(params.channel.label);
	if (!label) throw new Error(`Missing label for bundled chat channel "${params.id}"`);
	return buildManifestChannelMeta({
		id: params.id,
		channel: params.channel,
		label,
		selectionLabel: normalizeOptionalString(params.channel.selectionLabel) || label,
		docsPath: normalizeOptionalString(params.channel.docsPath) || `/channels/${params.id}`,
		docsLabel: normalizeOptionalString(params.channel.docsLabel),
		blurb: normalizeOptionalString(params.channel.blurb) || "",
		detailLabel: normalizeOptionalString(params.channel.detailLabel),
		systemImage: normalizeOptionalString(params.channel.systemImage),
		arrayFieldMode: "non-empty"
	});
}
function buildChatChannelMetaById() {
	const entries = /* @__PURE__ */ new Map();
	for (const entry of listBundledChannelCatalogEntries()) {
		const id = normalizeOptionalString(entry.id);
		if (!id || !CHAT_CHANNEL_ID_SET.has(id)) continue;
		entries.set(id, toChatChannelMeta({
			id,
			channel: entry.channel
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
