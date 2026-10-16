import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-DsER5ILV.mjs";
import { b as fetchChannelPermissionsDiscord } from "./send.shared-C4CN24D9.mjs";
import "./send-CJk3VP5q.mjs";
import { C as collectDiscordAuditChannelIdsForAccount, S as auditDiscordChannelPermissionsWithFetcher } from "./outbound-session-route-BvBH4LC6.mjs";
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
