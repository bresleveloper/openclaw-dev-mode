import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./agent-scope-B2Pk_xhT.js";
import { r as resolveAgentConfig } from "./agent-scope-config-BxAUeF6t.js";
import { p as readSessionUpdatedAt } from "./store-Cvp82S16.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { r as isControlCommandMessage } from "./command-detection-ytcEDGX4.js";
import "./sessions-BIAJdhW6.js";
import "./mentions-BJW-vfhG.js";
import { a as resolveEnvelopeFormatOptions } from "./envelope-CXHEh-mU.js";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-B16kSCvW.js";
import { x as filterChannelInboundSupplementalContext, y as buildChannelInboundEventContext } from "./kernel-Ct5PdN3j.js";
import "./inbound-reply-dispatch-DXX53jEK.js";
import "./direct-dm-C53s6Gci.js";
//#region src/channels/inbound-debounce-policy.ts
/**
* Channel inbound debounce policy.
*
* Decides when text events can be delayed/merged before agent dispatch.
*/
/** Returns true when an inbound text event is safe to debounce before dispatch. */
function shouldDebounceTextInbound(params) {
	if (params.allowDebounce === false) return false;
	if (params.hasMedia) return false;
	const text = normalizeOptionalString(params.text) ?? "";
	if (!text) return false;
	return !isControlCommandMessage(text, params.cfg, params.commandOptions);
}
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
function createChannelInboundDebouncer(params) {
	const debounceMs = resolveInboundDebounceMs({
		cfg: params.cfg,
		channel: params.channel,
		overrideMs: params.debounceMsOverride
	});
	const { cfg: _cfg, channel: _channel, debounceMsOverride: _override, ...rest } = params;
	return {
		debounceMs,
		debouncer: createInboundDebouncer({
			debounceMs,
			...rest
		})
	};
}
//#endregion
//#region src/channels/location.ts
function resolveLocation(location) {
	const source = location.source ?? (location.isLive ? "live" : location.name || location.address ? "place" : "pin");
	const isLive = location.isLive ?? source === "live";
	return {
		...location,
		source,
		isLive
	};
}
function formatAccuracy(accuracy) {
	if (!Number.isFinite(accuracy)) return "";
	return ` ±${Math.round(accuracy ?? 0)}m`;
}
function formatCoords(latitude, longitude) {
	return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
/**
* Formats the safe inline location body shown to the model.
*
* Channel-provided labels, addresses, and captions are intentionally excluded
* here; `toLocationContext` carries them into the untrusted metadata block.
*/
function formatLocationText(location) {
	const resolved = resolveLocation(location);
	const coords = formatCoords(resolved.latitude, resolved.longitude);
	const accuracy = formatAccuracy(resolved.accuracy);
	if (resolved.source === "live" || resolved.isLive) return `🛰 Live location: ${coords}${accuracy}`;
	return `📍 ${coords}${accuracy}`;
}
/** Converts a normalized location into template context fields for prompt metadata. */
function toLocationContext(location) {
	const resolved = resolveLocation(location);
	return {
		LocationLat: resolved.latitude,
		LocationLon: resolved.longitude,
		LocationAccuracy: resolved.accuracy,
		LocationName: resolved.name,
		LocationAddress: resolved.address,
		LocationSource: resolved.source,
		LocationIsLive: resolved.isLive,
		LocationCaption: resolved.caption
	};
}
//#endregion
//#region src/channels/session-envelope.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
function resolveInboundSessionEnvelopeContext(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	return {
		storePath,
		envelopeOptions: resolveEnvelopeFormatOptions(params.cfg),
		previousTimestamp: readSessionUpdatedAt({
			storePath,
			sessionKey: params.sessionKey
		})
	};
}
//#endregion
//#region src/channels/inbound-event/classification.ts
/**
* Channel inbound event classifier.
*
* Decides whether group/channel activity should wake the agent or remain a passive room event.
*/
/**
* Classifies an inbound channel event as an actionable request or passive room event.
*/
function classifyChannelInboundEvent(params) {
	if (params.unmentionedGroupPolicy !== "room_event") return "user_request";
	if (params.conversation.kind !== "group" && params.conversation.kind !== "channel") return "user_request";
	if (params.wasMentioned === true || params.hasControlCommand === true || params.hasAbortRequest === true || params.commandSource === "native") return "user_request";
	return "room_event";
}
/**
* Resolves the configured policy for unmentioned group/channel inbound events.
*/
function resolveUnmentionedGroupInboundPolicy(params) {
	const agentGroupChat = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.groupChat : void 0;
	if (agentGroupChat && Object.hasOwn(agentGroupChat, "unmentionedInbound")) return agentGroupChat.unmentionedInbound ?? "user_request";
	return params.cfg.messages?.groupChat?.unmentionedInbound ?? "user_request";
}
//#endregion
//#region src/plugin-sdk/channel-inbound.ts
/**
* Builds inbound-event context for callers still passing `inboundTurnKind`.
*
* @deprecated Use `buildChannelInboundEventContext`.
*/
function buildChannelTurnContext(params) {
	const inboundEventKind = params.message.inboundEventKind ?? params.message.inboundTurnKind;
	const ctx = buildChannelInboundEventContext({
		...params,
		message: {
			...params.message,
			...inboundEventKind ? { inboundEventKind } : {}
		}
	});
	return {
		...ctx,
		InboundTurnKind: ctx.InboundEventKind
	};
}
/**
* Deprecated supplemental-context filter alias retained for channel SDK compatibility.
*
* @deprecated Use `filterChannelInboundSupplementalContext`.
*/
const filterChannelTurnSupplementalContext = filterChannelInboundSupplementalContext;
//#endregion
export { resolveInboundSessionEnvelopeContext as a, createChannelInboundDebouncer as c, resolveUnmentionedGroupInboundPolicy as i, shouldDebounceTextInbound as l, filterChannelTurnSupplementalContext as n, formatLocationText as o, classifyChannelInboundEvent as r, toLocationContext as s, buildChannelTurnContext as t };
