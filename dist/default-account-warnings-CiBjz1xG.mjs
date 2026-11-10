import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { i as listRouteBindings } from "./bindings-Cw_QSeBA.mjs";
import { n as formatSetExplicitDefaultInstruction, r as formatSetExplicitDefaultToConfiguredInstruction, t as formatChannelAccountsDefaultPath } from "./default-account-warnings-CK3UKJwX.mjs";
//#region src/commands/doctor/shared/default-account-warnings.ts
function normalizeBindingChannelKey(raw) {
	return normalizeChatChannelId(raw) || normalizeLowercaseStringOrEmpty(raw);
}
function collectChannelsMissingDefaultAccount(cfg) {
	const contexts = [];
	for (const [channelKey, rawChannel] of Object.entries(asNullableRecord(cfg.channels) ?? {})) {
		const channel = asNullableRecord(rawChannel);
		const accounts = asNullableRecord(channel?.accounts);
		if (!channel || !accounts) continue;
		const normalizedAccountIds = Array.from(new Set(Object.keys(accounts).map(normalizeAccountId))).toSorted((a, b) => a.localeCompare(b));
		if (normalizedAccountIds.length === 0 || normalizedAccountIds.includes("default")) continue;
		contexts.push({
			channelKey,
			channel,
			normalizedAccountIds
		});
	}
	return contexts;
}
function collectMissingDefaultAccountBindingWarnings(cfg) {
	const bindings = listRouteBindings(cfg);
	return collectChannelsMissingDefaultAccount(cfg).flatMap(({ channelKey, normalizedAccountIds }) => {
		const accountIdSet = new Set(normalizedAccountIds);
		const channelPattern = normalizeBindingChannelKey(channelKey);
		const coveredAccountIds = /* @__PURE__ */ new Set();
		for (const binding of bindings) {
			const match = asNullableRecord(asNullableRecord(binding)?.match);
			if (!match) continue;
			const matchChannel = typeof match.channel === "string" ? normalizeBindingChannelKey(match.channel) : "";
			if (!matchChannel || matchChannel !== channelPattern) continue;
			const rawAccountId = normalizeOptionalString(match.accountId);
			if (!rawAccountId) continue;
			if (rawAccountId === "*") return [];
			const normalizedBindingAccountId = normalizeAccountId(rawAccountId);
			if (accountIdSet.has(normalizedBindingAccountId)) coveredAccountIds.add(normalizedBindingAccountId);
		}
		const uncoveredAccountIds = normalizedAccountIds.filter((accountId) => !coveredAccountIds.has(accountId));
		if (uncoveredAccountIds.length === 0) return [];
		return [coveredAccountIds.size > 0 ? `- channels.${channelKey}: accounts.default is missing and account bindings only cover a subset of configured accounts. Uncovered accounts: ${uncoveredAccountIds.join(", ")}. Add bindings[].match.accountId for uncovered accounts (or "*"), or add ${formatChannelAccountsDefaultPath(channelKey)}.` : `- channels.${channelKey}: accounts.default is missing and no valid account-scoped binding exists for configured accounts (${normalizedAccountIds.join(", ")}). Channel-only bindings (no accountId) match only default. Add bindings[].match.accountId for one of these accounts (or "*"), or add ${formatChannelAccountsDefaultPath(channelKey)}.`];
	});
}
function collectMissingExplicitDefaultAccountWarnings(cfg) {
	return collectChannelsMissingDefaultAccount(cfg).flatMap(({ channelKey, channel, normalizedAccountIds }) => {
		if (normalizedAccountIds.length < 2) return [];
		const preferredDefault = normalizeOptionalAccountId(typeof channel.defaultAccount === "string" ? channel.defaultAccount : void 0);
		if (preferredDefault && normalizedAccountIds.includes(preferredDefault)) return [];
		return [preferredDefault ? `- channels.${channelKey}: defaultAccount is set to "${preferredDefault}" but does not match configured accounts (${normalizedAccountIds.join(", ")}). ${formatSetExplicitDefaultToConfiguredInstruction({ channelKey })} to avoid fallback routing.` : `- channels.${channelKey}: multiple accounts are configured but no explicit default is set. ${formatSetExplicitDefaultInstruction(channelKey)} to avoid fallback routing.`];
	});
}
//#endregion
export { collectMissingDefaultAccountBindingWarnings, collectMissingExplicitDefaultAccountWarnings };
