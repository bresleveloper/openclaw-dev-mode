import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { a as normalizeAnyChannelId } from "./registry-B5Y8tTE-.js";
import { t as getLoadedChannelPluginForRead } from "./registry-loaded-read-kWBL-Dpo.js";
import { i as stripTargetTopicSuffix, n as stripTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-B-U8aKKo.js";
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
		const target = stripTargetTopicSuffix(stripTargetKindPrefix(stripTargetProviderPrefix(candidate, params.channelId), [
			"group",
			"channel",
			"conversation",
			"room",
			"thread"
		]), { allowNumericShorthand: params.channelId === "telegram" });
		if (target) return target;
	}
}
function extractLegacyParsedGroupTargetId(params) {
	const parsed = params.messaging?.parseExplicitTarget?.({ raw: params.raw });
	if (parsed?.chatType === "direct" || parsed?.chatType == null) return;
	return stripTargetTopicSuffix(stripTargetKindPrefix(stripTargetProviderPrefix(parsed.to, params.channelId), [
		"group",
		"channel",
		"conversation",
		"room",
		"thread"
	]), { allowNumericShorthand: params.channelId === "telegram" }) || void 0;
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
	}) ?? extractLegacyParsedGroupTargetId({
		raw: trimmed,
		channelId,
		messaging
	});
}
//#endregion
//#region src/auto-reply/reply/elevated-unavailable.ts
function formatElevatedUnavailableMessage(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	if (params.failures.length > 0) lines.push(`Failing gates: ${params.failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Failing gates: enabled (tools.elevated.enabled / agents.list[].tools.elevated.enabled), allowFrom (tools.elevated.allowFrom.<provider>).");
	lines.push("Fix-it keys:");
	lines.push("- tools.elevated.enabled");
	lines.push("- tools.elevated.allowFrom.<provider>");
	lines.push("- agents.list[].tools.elevated.enabled");
	lines.push("- agents.list[].tools.elevated.allowFrom.<provider>");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { extractExplicitGroupId as n, formatElevatedUnavailableMessage as t };
