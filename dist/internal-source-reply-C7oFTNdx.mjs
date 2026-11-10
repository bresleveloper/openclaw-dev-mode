import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as parseSessionDeliveryRoute } from "./session-key-CSDERtm3.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-V5CfgPTP.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-JZ360Soo.mjs";
import { n as listConfiguredMessageChannels, t as isConfiguredChannel } from "./channel-selection-D2GvoKZ-.mjs";
//#region src/infra/outbound/internal-source-reply.ts
function hasExplicitRouteParam(params) {
	return readTrimmedStringAlias(params, [
		"channel",
		"target",
		"to",
		"channelId"
	]) !== void 0 || Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value));
}
function hasCurrentSourceReplyContext(input) {
	const provider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	if (!provider) return false;
	if (provider === "webchat") {
		const route = parseSessionDeliveryRoute(input.sessionKey);
		const channel = route ? normalizeMessageChannel(route.channel) : void 0;
		return !channel || channel === "webchat";
	}
	const currentMessageId = input.toolContext?.currentMessageId;
	return Boolean(normalizeOptionalString(input.toolContext?.currentChannelId) || normalizeOptionalString(input.toolContext?.currentMessagingTarget) || normalizeOptionalString(input.toolContext?.currentThreadTs) || typeof currentMessageId === "number" && Number.isFinite(currentMessageId) || normalizeOptionalString(currentMessageId));
}
/** Return whether this send resolves to the private current-run source-reply sink. */
async function shouldUseInternalSourceReplySink(input, params) {
	if (!(input.action === "send" && input.sourceReplyDeliveryMode === "message_tool_only" && hasCurrentSourceReplyContext(input) && Boolean(input.sessionKey?.trim()) && !hasExplicitRouteParam(params))) return false;
	if (!normalizeOptionalString(input.toolContext?.currentChannelId) && !normalizeOptionalString(input.toolContext?.currentMessagingTarget)) return true;
	const provider = normalizeMessageChannel(input.toolContext?.currentChannelProvider) ?? normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	if (!provider || provider === "webchat" || !isConfiguredChannel(input.cfg, provider) || !resolveOutboundChannelPlugin({
		channel: provider,
		cfg: input.cfg,
		allowBootstrap: true
	})) return true;
	return !(await listConfiguredMessageChannels(input.cfg)).some((channel) => channel === provider);
}
//#endregion
export { shouldUseInternalSourceReplySink as t };
