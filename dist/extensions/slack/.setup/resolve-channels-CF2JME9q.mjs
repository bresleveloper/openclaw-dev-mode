import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { s as resolveWorkspaceQualifiedSlackTarget } from "./target-parsing-DwYAP3ts.mjs";
import { n as fetchSlackChannelListPage, r as createSlackLookupClient, t as collectSlackCursorPages } from "./cursor-pages-jVn3Vkfi.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/slack/src/resolve-channels.ts
var resolve_channels_exports = /* @__PURE__ */ __exportAll({ resolveSlackChannelAllowlist: () => resolveSlackChannelAllowlist });
function parseSlackChannelMention(raw) {
	const trimmed = raw.trim();
	const mention = trimmed.match(/^<#([A-Z0-9]+)(?:\|([^>]+))?>$/i);
	if (mention) return {
		id: mention[1]?.toUpperCase(),
		name: mention[2]?.trim()
	};
	const prefixed = trimmed.replace(/^(slack:|channel:)/i, "");
	if (/^[CG][A-Z0-9]{8,}$/i.test(prefixed)) return { id: prefixed.toUpperCase() };
	const name = normalizeLowercaseStringOrEmpty(prefixed.replace(/^#/, ""));
	return name ? { name } : {};
}
async function listSlackChannels(client) {
	return collectSlackCursorPages({
		fetchPage: (cursor) => fetchSlackChannelListPage(client, cursor),
		collectPageItems: (res) => (res.channels ?? []).map((channel) => {
			const id = channel.id?.trim();
			const name = channel.name?.trim();
			if (!id || !name) return null;
			return {
				id,
				name,
				archived: Boolean(channel.is_archived),
				isPrivate: Boolean(channel.is_private)
			};
		}).filter((channel) => channel !== null)
	});
}
function resolveByName(name, channels) {
	const matches = channels.filter((channel) => normalizeLowercaseStringOrEmpty(channel.name) === name);
	return matches.find((channel) => !channel.archived) ?? matches[0];
}
async function resolveSlackChannelAllowlist(params) {
	const entries = params.entries.map((input) => ({
		input,
		workspace: resolveWorkspaceQualifiedSlackTarget(input, "channel"),
		parsed: parseSlackChannelMention(input)
	}));
	if (entries.every(({ workspace, parsed }) => workspace || parsed.id)) return entries.map(({ input, workspace, parsed }) => workspace ?? {
		input,
		resolved: true,
		id: parsed.id,
		name: parsed.name
	});
	const channels = await listSlackChannels(params.client ?? createSlackLookupClient(params.token));
	return entries.map(({ input, workspace, parsed }) => {
		if (workspace) return workspace;
		const match = parsed.id ? channels.find((channel) => channel.id === parsed.id) : parsed.name ? resolveByName(parsed.name, channels) : void 0;
		return parsed.id || match ? {
			input,
			resolved: true,
			id: parsed.id ?? match?.id,
			name: match?.name ?? parsed.name,
			archived: match?.archived
		} : {
			input,
			resolved: false
		};
	});
}
export { resolve_channels_exports as n, resolveSlackChannelAllowlist as t };
