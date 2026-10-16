import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import "./account-core-BE1fOhGS.mjs";
import { a as mergeTelegramAccountConfig, i as resolveDefaultTelegramAccountSelection } from "./account-selection-DV4XVSJR.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-BApaQcwN.mjs";
import { i as createResolvedDirectoryEntriesLister } from "./directory-config-helpers-DAXW1zIh.mjs";
//#region extensions/telegram/src/directory-config.ts
function resolveTelegramDirectoryAccount(cfg, accountId) {
	const resolvedAccountId = accountId?.trim() ? normalizeAccountId(accountId) : resolveDefaultTelegramAccountSelection(cfg).accountId;
	return { config: mergeTelegramAccountConfig(cfg, resolvedAccountId) };
}
const listTelegramDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: resolveTelegramDirectoryAccount,
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
	resolveAccount: resolveTelegramDirectoryAccount,
	resolveSources: (account) => [Object.keys(account.config.groups ?? {})],
	normalizeId: (entry) => entry.trim() || null
});
//#endregion
export { listTelegramDirectoryPeersFromConfig as n, listTelegramDirectoryGroupsFromConfig as t };
