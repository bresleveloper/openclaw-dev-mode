import { o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as resolveAccountKey } from "./account-lookup-Dm5zJglt.mjs";
import { t as mergeAccountConfig } from "./channel-account-config-BTy7yQJw.mjs";
import { t as createAccountListHelpers } from "./account-helpers-Bj9HVUkM.mjs";
import "./secret-input-CHX7JVid.mjs";
import "./account-helpers-BE_40Efg.mjs";
import "./account-resolution-ROKoEhY7.mjs";
//#region extensions/x/src/cost-limits.ts
function resolveXCostLimits(config) {
	return {
		dailyUsd: config?.dailyUsd ?? 100,
		monthlyUsd: config?.monthlyUsd ?? 1e3,
		cycleStartDay: config?.cycleStartDay ?? 1
	};
}
//#endregion
//#region extensions/x/src/accounts.ts
const accounts = createAccountListHelpers("x", {
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: [
		"guests",
		"costLimits",
		"verifiedFromGitHub"
	],
	implicitDefaultAccount: { channelKeys: [
		"userId",
		"clientId",
		"refreshToken"
	] }
});
const listXAccountIds = accounts.listAccountIds;
const listXRuntimeAccountIds = (cfg) => [...new Set(listXAccountIds(cfg).map(normalizeAccountId))];
const resolveDefaultXAccountId = accounts.resolveDefaultAccountId;
/** Config keys keep their authored case; this finds the key `resolveXAccount` reads. */
function resolveXAccountKey(cfg, accountId) {
	const id = normalizeAccountId(accountId);
	return resolveAccountKey(cfg.channels?.x?.accounts, id, void 0, void 0, { channelId: "x" });
}
function resolveXAccount(cfg, requested) {
	const accountId = normalizeAccountId(requested ?? resolveDefaultXAccountId(cfg));
	const config = accounts.resolveAccountConfig(cfg, accountId);
	if (config.guests) config.guests = mergeAccountConfig({
		channelConfig: cfg.channels?.x?.guests,
		accountConfig: config.guests,
		nestedObjectKeys: ["tools"]
	});
	const enabled = cfg.channels?.x?.enabled !== false && config.enabled !== false;
	const configured = Boolean(config.userId && config.username && config.clientId && hasConfiguredSecretInput(config.clientSecret) && hasConfiguredSecretInput(config.refreshToken));
	return {
		accountId,
		config,
		costLimits: resolveXCostLimits(config.costLimits),
		enabled,
		configured,
		userId: config.userId ?? "",
		username: config.username ?? "",
		name: config.name
	};
}
//#endregion
export { resolveXAccountKey as a, resolveXAccount as i, listXRuntimeAccountIds as n, resolveDefaultXAccountId as r, listXAccountIds as t };
