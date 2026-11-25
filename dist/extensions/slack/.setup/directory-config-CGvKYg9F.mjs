import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { a as mergeSlackAccountConfig, c as resolveSlackAccountAllowFrom, o as resolveDefaultSlackAccountId } from "./accounts-EaPP0fFY.mjs";
import { a as parseSlackTarget } from "./target-parsing-DwYAP3ts.mjs";
import "./targets-eeOxA_b_.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createResolvedDirectoryEntriesLister } from "openclaw/plugin-sdk/directory-config-runtime";
// extensions/slack/src/directory-config.ts
var directory_config_exports = /* @__PURE__ */ __exportAll({
	listSlackDirectoryGroupsFromConfig: () => listSlackDirectoryGroupsFromConfig,
	listSlackDirectoryPeersFromConfig: () => listSlackDirectoryPeersFromConfig
});
function resolveSlackDirectoryConfigAccount(cfg, accountId) {
	const resolvedAccountId = normalizeAccountId(accountId ?? resolveDefaultSlackAccountId(cfg));
	return {
		config: mergeSlackAccountConfig(cfg, resolvedAccountId),
		allowFrom: resolveSlackAccountAllowFrom({
			cfg,
			accountId: resolvedAccountId
		}) ?? []
	};
}
const listSlackDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: resolveSlackDirectoryConfigAccount,
	resolveSources: (account) => {
		const channelUsers = Object.values(account.config.channels ?? {}).flatMap((channel) => channel.users ?? []);
		return [
			account.allowFrom,
			Object.keys(account.config.dms ?? {}),
			channelUsers
		];
	},
	normalizeId: (raw) => {
		const normalizedUserId = (raw.match(/^<@([A-Z0-9]+)>$/i)?.[1] ?? raw).replace(/^(slack|user):/i, "").trim();
		if (!normalizedUserId) return null;
		const target = `user:${normalizedUserId}`;
		const normalized = parseSlackTarget(target, { defaultKind: "user" });
		return normalized?.kind === "user" ? `user:${normalizeLowercaseStringOrEmpty(normalized.id)}` : null;
	}
});
const listSlackDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: resolveSlackDirectoryConfigAccount,
	resolveSources: (account) => [Object.keys(account.config.channels ?? {})],
	normalizeId: (raw) => {
		const normalized = parseSlackTarget(raw, { defaultKind: "channel" });
		return normalized?.kind === "channel" ? `channel:${normalizeLowercaseStringOrEmpty(normalized.id)}` : null;
	}
});
export { listSlackDirectoryGroupsFromConfig as n, listSlackDirectoryPeersFromConfig as r, directory_config_exports as t };
