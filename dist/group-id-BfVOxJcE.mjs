import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-BJKXiLk4.mjs";
//#region src/auto-reply/reply/group-id-simple.ts
/** Extracts a simple group/channel id from stable group-like source ids. */
function extractSimpleExplicitGroupId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) return parts.slice(2).join(":").replace(/:topic:.*$/, "") || void 0;
	if (parts.length >= 2 && (parts[0] === "group" || parts[0] === "channel")) return parts.slice(1).join(":").replace(/:topic:.*$/, "") || void 0;
}
//#endregion
//#region src/auto-reply/reply/group-id.ts
/** Extracts group/channel ids from explicit message targets. */
function extractInferredGroupTargetId(params) {
	const normalized = params.messaging?.normalizeTarget?.(params.raw);
	const candidates = uniqueStrings([normalized, params.raw].filter((candidate) => Boolean(candidate)));
	for (const candidate of candidates) {
		const chatType = params.messaging?.inferTargetChatType?.({ to: candidate });
		if (chatType === "direct" || chatType == null) continue;
		const target = stripTargetTopicSuffix(stripOutboundTargetKindPrefix(stripTargetProviderPrefix(candidate, params.channelId), [
			"group",
			"channel",
			"conversation",
			"room",
			"thread"
		]), { allowNumericShorthand: params.messaging?.numericTopicShorthand === true });
		if (target) return target;
	}
}
/** Extracts a group/channel target id from explicit channel target syntax. */
function extractExplicitGroupId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	const simple = extractSimpleExplicitGroupId(trimmed);
	if (simple) return simple;
	const firstPart = trimmed.split(":").find(Boolean);
	const channelId = normalizeAnyChannelId(firstPart ?? "") ?? normalizeOptionalLowercaseString(firstPart);
	const messaging = channelId ? getLoadedChannelPluginForRead(channelId)?.messaging : void 0;
	if (!channelId) return;
	return extractInferredGroupTargetId({
		raw: trimmed,
		channelId,
		messaging
	});
}
//#endregion
export { extractExplicitGroupId as t };
