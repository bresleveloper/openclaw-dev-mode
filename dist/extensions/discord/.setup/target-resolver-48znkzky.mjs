import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { l as resolveDiscordAccount, u as resolveDiscordAccountAllowFrom } from "./accounts-DtjvhJUj.mjs";
import { a as allowFromContainsDiscordUserId, f as rememberDiscordDirectoryUser } from "./send.receipt-CZ7ks6g7.mjs";
import { r as listDiscordDirectoryPeersLive } from "./directory-live-B9UoQG9g.mjs";
import { t as parseDiscordTarget } from "./target-parsing-BiuhcK9Q.mjs";
import { buildMessagingTarget } from "openclaw/plugin-sdk/channel-targets";
// extensions/discord/src/target-resolver.ts
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
	const shouldLookup = /^<@!?(\d+)>$/.test(trimmed) || /^(user:|discord:)/.test(trimmed) || trimmed.startsWith("@") || /^\d+$/.test(trimmed) && parseOptions.defaultKind === "user" || likelyUsername;
	if (/^\d+$/.test(trimmed) && parseOptions.defaultKind !== "user" && allowFromContainsDiscordUserId(resolveDiscordAccountAllowFrom(options) ?? [], trimmed)) return buildMessagingTarget("user", trimmed, trimmed);
	let directParse;
	try {
		directParse = parseDiscordTarget(trimmed, parseOptions);
	} catch {}
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
			const resolvedAccountId = resolveDiscordAccount(options).accountId;
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
export { resolveDiscordTarget as n, target_resolver_exports as r, parseAndResolveDiscordTarget as t };
