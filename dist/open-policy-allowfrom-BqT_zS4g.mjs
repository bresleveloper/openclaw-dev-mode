import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as ensureOpenDmPolicyAllowFromWildcard } from "./dm-access-BjWg2ea5.mjs";
import { t as getDoctorChannelCapabilities } from "./channel-capabilities-tKjkS4PW.mjs";
//#region src/commands/doctor/shared/open-policy-allowfrom.ts
/** Format doctor warnings for open DM policies missing allowFrom wildcards. */
function collectOpenPolicyAllowFromWarnings(params) {
	if (params.changes.length === 0) return [];
	return [...params.changes.map((line) => sanitizeForLog(line)), `- Run "${params.doctorFixCommand}" to add missing allowFrom wildcards.`];
}
/** Add allowFrom wildcards for open DM policies where channel metadata requires them. */
function maybeRepairOpenPolicyAllowFrom(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	const ensureWildcard = (account, prefix, mode) => {
		ensureOpenDmPolicyAllowFromWildcard({
			entry: account,
			mode,
			pathPrefix: prefix,
			changes
		});
	};
	const nextChannels = next.channels;
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (!channelConfig || typeof channelConfig !== "object") continue;
		const capabilities = getDoctorChannelCapabilities(channelName);
		if (capabilities.openDmRequiresAllowFromWildcard === false) continue;
		const allowFromMode = capabilities.dmAllowFromMode;
		ensureWildcard(channelConfig, `channels.${channelName}`, allowFromMode);
		const accounts = asNullableRecord(channelConfig.accounts);
		if (!accounts) continue;
		for (const [accountName, accountConfig] of Object.entries(accounts)) if (accountConfig && typeof accountConfig === "object") ensureWildcard(accountConfig, `channels.${channelName}.accounts.${accountName}`, allowFromMode);
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
//#endregion
export { maybeRepairOpenPolicyAllowFrom as n, collectOpenPolicyAllowFromWarnings as t };
