import { f as listResolvedDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-config-helpers-BvNam8sN.js";
import { t as resolveMergedWhatsAppAccountConfig } from "./account-config-DKHSVT_Q.js";
import { c as normalizeWhatsAppTarget, t as isWhatsAppGroupJid } from "./normalize-target-D-WjuB2k.js";
import "./normalize-Du6_eP-O.js";
//#region extensions/whatsapp/src/directory-config.ts
function resolveWhatsAppDirectoryAccount(cfg, accountId) {
	return resolveMergedWhatsAppAccountConfig({
		cfg,
		accountId
	});
}
async function listWhatsAppDirectoryPeersFromConfig(params) {
	return listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: resolveWhatsAppDirectoryAccount,
		resolveAllowFrom: (account) => account.allowFrom,
		normalizeId: (entry) => {
			const normalized = normalizeWhatsAppTarget(entry);
			if (!normalized || isWhatsAppGroupJid(normalized)) return null;
			return normalized;
		}
	});
}
async function listWhatsAppDirectoryGroupsFromConfig(params) {
	return listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: resolveWhatsAppDirectoryAccount,
		resolveGroups: (account) => account.groups
	});
}
//#endregion
export { listWhatsAppDirectoryPeersFromConfig as n, listWhatsAppDirectoryGroupsFromConfig as t };
