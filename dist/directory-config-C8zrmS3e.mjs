import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import "./account-core-CZZ_BKA9.mjs";
import { a as mergeTelegramAccountConfig, i as resolveDefaultTelegramAccountSelection } from "./account-selection-DO7ZNLRi.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-FM3VqlCl.mjs";
import { i as createResolvedDirectoryEntriesLister } from "./directory-config-helpers-9zao9heL.mjs";
//#region extensions/telegram/src/directory-config.ts
function resolveTelegramDirectoryAccount(cfg, accountId) {
	const resolvedAccountId = accountId?.trim() ? normalizeAccountId(accountId) : resolveDefaultTelegramAccountSelection(cfg).accountId;
	return { config: mergeTelegramAccountConfig(cfg, resolvedAccountId) };
}
const listTelegramDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: (cfg, accountId) => resolveTelegramDirectoryAccount(cfg, accountId),
	resolveSources: (account) => [mapAllowFromEntries(account.config.allowFrom), Object.keys(account.config.dms ?? {})],
	normalizeId: (entry) => {
		const trimmed = entry.replace(/^(telegram|tg):/i, "").trim();
		if (!trimmed) return null;
		if (/^-?\d+$/.test(trimmed)) return trimmed;
		return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
	}
});
const listTelegramDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: (cfg, accountId) => resolveTelegramDirectoryAccount(cfg, accountId),
	resolveSources: (account) => [Object.keys(account.config.groups ?? {})],
	normalizeId: (entry) => entry.trim() || null
});
//#endregion
export { listTelegramDirectoryPeersFromConfig as n, listTelegramDirectoryGroupsFromConfig as t };
