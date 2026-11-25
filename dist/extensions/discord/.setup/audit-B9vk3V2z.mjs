import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-CSz5Qodj.mjs";
import { i as fetchChannelPermissionsDiscord } from "./send.permissions-BvH_Dr8p.mjs";
import "./send-DKzwsZkm.mjs";
import { T as collectDiscordAuditChannelIdsForAccount, w as auditDiscordChannelPermissionsWithFetcher } from "./outbound-session-route-G_fK5RAh.mjs";
// extensions/discord/src/audit.ts
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
export { audit_exports as n, collectDiscordAuditChannelIds as r, auditDiscordChannelPermissions as t };
