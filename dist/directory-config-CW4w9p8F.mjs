import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./account-core-DB3MSA02.mjs";
import { a as mergeTelegramAccountConfig, i as resolveDefaultTelegramAccountSelection } from "./account-selection-CQ3hKgoh.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-iQxjPtMU.mjs";
import { i as createResolvedDirectoryEntriesLister } from "./directory-config-helpers-DbcIDmdI.mjs";
//#region extensions/telegram/src/directory-config.ts
function resolveTelegramDirectoryConfig(cfg, accountId) {
	const resolvedAccountId = accountId?.trim() ? normalizeAccountId(accountId) : resolveDefaultTelegramAccountSelection(cfg).accountId;
	return mergeTelegramAccountConfig(cfg, resolvedAccountId);
}
const listTelegramDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: resolveTelegramDirectoryConfig,
	resolveSources: (config) => [mapAllowFromEntries(config.allowFrom), Object.keys(config.dms ?? {})],
	normalizeId: (entry) => {
		const trimmed = entry.replace(/^(telegram|tg):/i, "").trim();
		if (!trimmed) return null;
		return /^-?\d+$/.test(trimmed) || trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
	}
});
const listTelegramDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: resolveTelegramDirectoryConfig,
	resolveSources: (config) => [Object.keys(config.groups ?? {})],
	normalizeId: (entry) => entry.trim() || null
});
//#endregion
export { listTelegramDirectoryPeersFromConfig as n, listTelegramDirectoryGroupsFromConfig as t };
