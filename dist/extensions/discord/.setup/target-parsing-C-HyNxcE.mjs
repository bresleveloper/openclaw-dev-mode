import { buildMessagingTarget, parseMentionPrefixOrAtUserTarget, requireTargetKind } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/discord/src/target-parsing.ts
function parseDiscordTarget(raw, options = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const providerPrefix = /^discord:(channel|user):(.+)$/i.exec(trimmed);
	if (providerPrefix) {
		const kind = providerPrefix[1]?.toLowerCase();
		const id = providerPrefix[2]?.trim();
		if (kind && id) return buildMessagingTarget(kind, id, `${kind}:${id}`);
	}
	const userTarget = parseMentionPrefixOrAtUserTarget({
		raw: trimmed,
		mentionPattern: /^<@!?(\d+)>$/,
		prefixes: [
			{
				prefix: "user:",
				kind: "user"
			},
			{
				prefix: "channel:",
				kind: "channel"
			},
			{
				prefix: "discord:",
				kind: "user"
			}
		],
		atUserPattern: /^\d+$/,
		atUserErrorMessage: "Discord DMs require a user id (use user:<id> or a <@id> mention)"
	});
	if (userTarget) return userTarget;
	if (/^\d+$/.test(trimmed)) {
		if (options.defaultKind) return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
		throw new Error(options.ambiguousMessage ?? `Ambiguous Discord recipient "${trimmed}". For DMs use "user:${trimmed}" or "<@${trimmed}>"; for channels use "channel:${trimmed}".`);
	}
	return buildMessagingTarget("channel", trimmed, trimmed);
}
function resolveDiscordChannelId(raw) {
	const target = parseDiscordTarget(raw, { defaultKind: "channel" });
	return requireTargetKind({
		platform: "Discord",
		target,
		kind: "channel"
	});
}
//#endregion
export { resolveDiscordChannelId as n, parseDiscordTarget as t };
