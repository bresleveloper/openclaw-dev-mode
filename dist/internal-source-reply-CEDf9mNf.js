import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { c as parseAgentSessionKey, u as parseThreadSessionSuffix } from "./session-key-utils-C7uT9A4s.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-BDdeIq2O.js";
import { n as listConfiguredMessageChannels, t as isConfiguredChannel } from "./channel-selection-DAY9l73H.js";
//#region src/infra/outbound/internal-source-reply.ts
const SESSION_DELIVERY_PEER_KINDS = new Set([
	"channel",
	"direct",
	"dm",
	"group"
]);
function hasExternalSessionDeliveryRoute(sessionKey) {
	const parsed = parseAgentSessionKey(parseThreadSessionSuffix(sessionKey).baseSessionKey ?? sessionKey);
	if (!parsed) return false;
	const parts = parsed.rest.split(":").filter(Boolean);
	if (parts.length < 3) return false;
	const channel = normalizeMessageChannel(parts[0]);
	if (!channel || channel === "webchat") return false;
	if (parts.length >= 4 && (parts[2] === "direct" || parts[2] === "dm")) return Boolean(parts.slice(3).join(":").trim());
	return SESSION_DELIVERY_PEER_KINDS.has(parts[1] ?? "") && Boolean(parts.slice(2).join(":").trim());
}
function hasExplicitRouteParam(params) {
	for (const key of [
		"channel",
		"target",
		"to",
		"channelId"
	]) if (normalizeOptionalString(params[key])) return true;
	return Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value));
}
function hasCurrentSourceReplyContext(input) {
	const provider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	if (!provider) return false;
	if (provider === "webchat") return !hasExternalSessionDeliveryRoute(input.sessionKey);
	const currentMessageId = input.toolContext?.currentMessageId;
	return Boolean(normalizeOptionalString(input.toolContext?.currentChannelId) || normalizeOptionalString(input.toolContext?.currentMessagingTarget) || normalizeOptionalString(input.toolContext?.currentThreadTs) || typeof currentMessageId === "number" && Number.isFinite(currentMessageId) || normalizeOptionalString(currentMessageId));
}
async function hasConfiguredCurrentSourceChannel(input) {
	const provider = normalizeMessageChannel(input.toolContext?.currentChannelProvider) ?? normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	if (!provider || provider === "webchat") return false;
	if (!isConfiguredChannel(input.cfg, provider)) return false;
	if (!resolveOutboundChannelPlugin({
		channel: provider,
		cfg: input.cfg,
		allowBootstrap: true
	})) return false;
	return (await listConfiguredMessageChannels(input.cfg)).some((channel) => channel === provider);
}
/** Return whether this send resolves to the private current-run source-reply sink. */
async function shouldUseInternalSourceReplySink(input, params) {
	if (!(input.action === "send" && input.sourceReplyDeliveryMode === "message_tool_only" && hasCurrentSourceReplyContext(input) && Boolean(input.sessionKey?.trim()) && !hasExplicitRouteParam(params))) return false;
	if (!normalizeOptionalString(input.toolContext?.currentChannelId) && !normalizeOptionalString(input.toolContext?.currentMessagingTarget)) return true;
	return !await hasConfiguredCurrentSourceChannel(input);
}
//#endregion
export { shouldUseInternalSourceReplySink as t };
