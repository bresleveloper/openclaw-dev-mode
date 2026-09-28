import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-CiwNdke1.mjs";
//#region src/infra/outbound/channel-target-prefix.ts
const TARGET_KIND_PREFIXES = /* @__PURE__ */ new Set([
	"channel",
	"conversation",
	"dm",
	"group",
	"room",
	"thread",
	"user"
]);
const DEFAULT_TARGET_KINDS = [...TARGET_KIND_PREFIXES];
const TARGET_KIND_PATTERN = new RegExp(`^(${DEFAULT_TARGET_KINDS.join("|")}):`, "i");
/** Removes a selected channel/provider prefix from an outbound target string. */
function stripTargetProviderPrefix(raw, ...providers) {
	const trimmed = raw.trim();
	const lower = normalizeOptionalLowercaseString(trimmed) ?? "";
	for (const provider of providers) {
		const normalizedProvider = normalizeOptionalLowercaseString(provider);
		if (normalizedProvider && lower.startsWith(`${normalizedProvider}:`)) return trimmed.slice(normalizedProvider.length + 1).trim();
	}
	return trimmed;
}
/** Removes generic target-kind prefixes such as room:, thread:, or user:. */
function stripOutboundTargetKindPrefix(raw, kinds = DEFAULT_TARGET_KINDS) {
	if (kinds === DEFAULT_TARGET_KINDS) return raw.replace(TARGET_KIND_PATTERN, "").trim();
	const kindPattern = kinds.map((kind) => normalizeOptionalLowercaseString(kind)).filter((kind) => Boolean(kind)).join("|");
	return kindPattern ? raw.replace(new RegExp(`^(${kindPattern}):`, "i"), "").trim() : raw.trim();
}
/** Strips plugin topic suffixes while preserving ordinary colon-containing targets. */
function stripTargetTopicSuffix(raw, options = {}) {
	const trimmed = raw.trim();
	const numericTopicMatch = options.allowNumericShorthand ? /^(-?\d+):(\d+)$/.exec(trimmed) : null;
	if (numericTopicMatch?.[1]) return numericTopicMatch[1];
	return trimmed.replace(/:topic:.*$/i, "").trim();
}
function resolvePluginTargetPrefix(prefix) {
	const normalizedPrefix = normalizeOptionalLowercaseString(prefix);
	if (!normalizedPrefix) return;
	for (const plugin of listRuntimeVisibleChannelPlugins()) {
		const channelId = normalizeOptionalLowercaseString(plugin.id);
		const candidates = plugin.messaging?.targetPrefixes ?? [];
		if (channelId && candidates.some((candidate) => normalizeOptionalLowercaseString(candidate) === normalizedPrefix)) return channelId;
	}
}
function resolveChannelTargetProviderPrefix(raw) {
	const match = /^\s*([a-z][a-z0-9_-]*):/i.exec(raw ?? "");
	const prefix = normalizeOptionalLowercaseString(match?.[1]);
	if (!prefix || TARGET_KIND_PREFIXES.has(prefix)) return;
	const channel = resolvePluginTargetPrefix(prefix);
	return channel ? {
		prefix,
		channel
	} : void 0;
}
/** Resolves the channel implied by a plugin-owned target prefix, if any. */
function resolveTargetPrefixedChannel(raw) {
	return resolveChannelTargetProviderPrefix(raw)?.channel;
}
/** Rejects targets whose plugin-owned prefix belongs to a different selected channel. */
function validateTargetProviderPrefix(params) {
	const selectedChannel = normalizeMessageChannel(params.channel) ?? normalizeOptionalLowercaseString(params.channel);
	if (!selectedChannel || selectedChannel === "last") return;
	const prefixed = resolveChannelTargetProviderPrefix(params.to);
	if (!prefixed || prefixed.channel === selectedChannel) return;
	return /* @__PURE__ */ new Error(`Target prefix "${prefixed.prefix}:" belongs to ${prefixed.channel}, not ${selectedChannel}.`);
}
//#endregion
export { validateTargetProviderPrefix as a, stripTargetTopicSuffix as i, stripOutboundTargetKindPrefix as n, stripTargetProviderPrefix as r, resolveTargetPrefixedChannel as t };
