import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-8cCu6uPG.mjs";
import { b as fetchChannelPermissionsDiscord } from "./send.shared-CnlMgoqQ.mjs";
import "./send-da6ENJ9f.mjs";
import { E as collectDiscordAuditChannelIdsForAccount, T as auditDiscordChannelPermissionsWithFetcher } from "./outbound-session-route-BtUpGBTb.mjs";
//#region extensions/discord/src/audit.ts
var audit_exports = /* @__PURE__ */ __exportAll({
	auditDiscordChannelPermissions: () => auditDiscordChannelPermissions,
	collectDiscordAuditChannelIds: () => collectDiscordAuditChannelIds
});
function collectDiscordAuditChannelIds(params) {
	const account = inspectDiscordAccount(params);
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
