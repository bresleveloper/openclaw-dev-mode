import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { c as resolveDiscordAccount, l as resolveDiscordAccountAllowFrom } from "./accounts-HE9-mj1L.mjs";
import { c as allowFromContainsDiscordUserId, p as parseDiscordTarget } from "./send.receipt-DVOg2Oaw.mjs";
import { o as rememberDiscordDirectoryUser, r as listDiscordDirectoryPeersLive } from "./directory-live-Bipr0eUJ.mjs";
import { buildMessagingTarget } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/discord/src/target-resolver.ts
var target_resolver_exports = /* @__PURE__ */ __exportAll({
	parseAndResolveDiscordTarget: () => parseAndResolveDiscordTarget,
	resolveDiscordTarget: () => resolveDiscordTarget
});
/**
* Resolve a Discord username to user ID using the directory lookup.
* This enables sending DMs by username instead of requiring explicit user IDs.
*/
async function resolveDiscordTarget(raw, options, parseOptions = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const likelyUsername = !/^(user:|channel:|discord:|@|<@!?)|[\d]+$/.test(trimmed);
	const shouldLookup = isExplicitUserLookup(trimmed, parseOptions) || likelyUsername;
	if (/^\d+$/.test(trimmed) && parseOptions.defaultKind !== "user" && isConfiguredAllowedDiscordDmUser(trimmed, options)) return buildMessagingTarget("user", trimmed, trimmed);
	const directParse = safeParseDiscordTarget(trimmed, parseOptions);
	if (directParse && directParse.kind !== "channel" && !likelyUsername) return directParse;
	if (!shouldLookup) return directParse ?? parseDiscordTarget(trimmed, parseOptions);
	try {
		const match = (await listDiscordDirectoryPeersLive({
			...options,
			query: trimmed,
			limit: 1
		}))[0];
		if (match && match.kind === "user") {
			const userId = match.id.replace(/^user:/, "");
			const resolvedAccountId = resolveDiscordAccount({
				cfg: options.cfg,
				accountId: options.accountId
			}).accountId;
			rememberDiscordDirectoryUser({
				accountId: resolvedAccountId,
				userId,
				handles: [
					trimmed,
					match.name,
					match.handle
				]
			});
			return buildMessagingTarget("user", userId, trimmed);
		}
	} catch {}
	return parseDiscordTarget(trimmed, parseOptions);
}
async function parseAndResolveDiscordTarget(raw, options, parseOptions = {}) {
	const resolved = await resolveDiscordTarget(raw, options, parseOptions);
	if (!resolved) throw new Error("Recipient is required for Discord sends");
	return resolved;
}
function safeParseDiscordTarget(input, options) {
	try {
		return parseDiscordTarget(input, options);
	} catch {
		return;
	}
}
function isConfiguredAllowedDiscordDmUser(input, options) {
	const allowFrom = resolveDiscordAccountAllowFrom({
		cfg: options.cfg,
		accountId: options.accountId
	}) ?? [];
	return allowFromContainsDiscordUserId(allowFrom, input);
}
function isExplicitUserLookup(input, options) {
	return /^<@!?(\d+)>$/.test(input) || /^(user:|discord:)/.test(input) || input.startsWith("@") || /^\d+$/.test(input) && options.defaultKind === "user";
}
//#endregion
export { resolveDiscordTarget as n, target_resolver_exports as r, parseAndResolveDiscordTarget as t };
