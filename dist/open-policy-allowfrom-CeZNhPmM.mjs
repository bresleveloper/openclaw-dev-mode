import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as ensureOpenDmPolicyAllowFromWildcard } from "./dm-access-Hz7HYgpa.mjs";
import { n as iterateDoctorChannelAccounts, r as getDoctorChannelCapabilities } from "./allowlist-CX9NeGVw.mjs";
//#region src/commands/doctor/shared/open-policy-allowfrom.ts
function collectOpenPolicyAllowFromWarnings(params) {
	if (params.changes.length === 0) return [];
	return [...params.changes.map((line) => sanitizeForLog(line)), `- Run "${params.doctorFixCommand}" to add missing allowFrom wildcards.`];
}
function maybeRepairOpenPolicyAllowFrom(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	const nextChannels = next.channels;
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (!channelConfig || typeof channelConfig !== "object") continue;
		const capabilities = getDoctorChannelCapabilities(channelName);
		if (capabilities.openDmRequiresAllowFromWildcard === false) continue;
		for (const { account, prefix } of iterateDoctorChannelAccounts(channelConfig, `channels.${channelName}`)) ensureOpenDmPolicyAllowFromWildcard({
			entry: account,
			mode: capabilities.dmAllowFromMode,
			pathPrefix: prefix,
			changes
		});
	}
	return {
		config: changes.length > 0 ? next : cfg,
		changes
	};
}
//#endregion
export { maybeRepairOpenPolicyAllowFrom as n, collectOpenPolicyAllowFromWarnings as t };
