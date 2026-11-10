import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-D9KEia-0.mjs";
//#region src/auto-reply/reply/group-id.ts
/** Extracts group/channel ids from explicit message targets. */
/** Extracts a group/channel target id from explicit channel target syntax. */
function extractExplicitGroupId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	const idStart = parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel") ? 2 : parts.length >= 2 && (parts[0] === "group" || parts[0] === "channel") ? 1 : void 0;
	const simple = idStart === void 0 ? void 0 : parts.slice(idStart).join(":").replace(/:topic:.*$/, "");
	if (simple) return simple;
	const firstPart = parts[0];
	const channelId = normalizeAnyChannelId(firstPart ?? "") ?? normalizeOptionalLowercaseString(firstPart);
	const messaging = channelId ? getLoadedChannelPluginForRead(channelId)?.messaging : void 0;
	if (!channelId) return;
	const normalized = messaging?.normalizeTarget?.(trimmed);
	const candidates = uniqueStrings([normalized, trimmed].filter((candidate) => Boolean(candidate)));
	for (const candidate of candidates) {
		const chatType = messaging?.inferTargetChatType?.({ to: candidate });
		if (chatType === "direct" || chatType == null) continue;
		const target = stripTargetTopicSuffix(stripOutboundTargetKindPrefix(stripTargetProviderPrefix(candidate, channelId), [
			"group",
			"channel",
			"conversation",
			"room",
			"thread"
		]), { allowNumericShorthand: messaging?.numericTopicShorthand === true });
		if (target) return target;
	}
}
//#endregion
export { extractExplicitGroupId as t };
