import { Ut as __exportAll } from "./discord-BXpHW-cu.mjs";
import { x as fetchChannelPermissionsDiscord } from "./send.shared-VNvWfX2T.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-BwQj24ht.mjs";
import "./send-CIBzvXjS.mjs";
import { C as collectDiscordAuditChannelIdsForAccount, S as auditDiscordChannelPermissionsWithFetcher } from "./outbound-session-route-VulUE0yV.mjs";
//#region extensions/discord/src/audit.ts
var audit_exports = /* @__PURE__ */ __exportAll({
	auditDiscordChannelPermissions: () => auditDiscordChannelPermissions,
	collectDiscordAuditChannelIds: () => collectDiscordAuditChannelIds
});
function collectDiscordAuditChannelIds(params) {
	const account = inspectDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return collectDiscordAuditChannelIdsForAccount(account.config);
}
async function auditDiscordChannelPermissions(params) {
	return await auditDiscordChannelPermissionsWithFetcher({
		...params,
		fetchChannelPermissions: fetchChannelPermissionsDiscord
	});
}
//#endregion
export { audit_exports as n, collectDiscordAuditChannelIds as r, auditDiscordChannelPermissions as t };
