import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as findBundledChannelCatalogMetadata } from "./bundled-channel-catalog-read-CP-G92J1.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { n as getBundledChannelPlugin } from "./bundled-CEh6W_x7.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
//#region src/commands/doctor/channel-capabilities.ts
const DEFAULT_DOCTOR_CHANNEL_CAPABILITIES = {
	dmAllowFromMode: "topOnly",
	groupModel: "sender",
	groupAllowFromFallbackToAllowFrom: true,
	warnOnEmptyGroupSenderAllowlist: true
};
function mergeDoctorChannelCapabilities(capabilities) {
	const valueFor = (key) => capabilities?.[key] ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES[key];
	return {
		dmAllowFromMode: valueFor("dmAllowFromMode"),
		...typeof capabilities?.openDmRequiresAllowFromWildcard === "boolean" ? { openDmRequiresAllowFromWildcard: capabilities.openDmRequiresAllowFromWildcard } : {},
		groupModel: valueFor("groupModel"),
		groupAllowFromFallbackToAllowFrom: valueFor("groupAllowFromFallbackToAllowFrom"),
		warnOnEmptyGroupSenderAllowlist: valueFor("warnOnEmptyGroupSenderAllowlist")
	};
}
function getDoctorChannelCapabilities(channelName) {
	if (!channelName) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
	const catalogCapabilities = findBundledChannelCatalogMetadata(channelName)?.doctorCapabilities;
	if (catalogCapabilities) return mergeDoctorChannelCapabilities(catalogCapabilities);
	const channelId = normalizeAnyChannelId(channelName);
	if (!channelId) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
	return mergeDoctorChannelCapabilities((getChannelPlugin(channelId)?.doctor ?? getBundledChannelPlugin(channelId)?.doctor) || findBundledChannelCatalogMetadata(channelId)?.doctorCapabilities);
}
/** Resolve configured and runtime account ids through the channel plugin's own semantics. */
async function resolveDoctorChannelAccountIds(channelName, cfg, configuredAccountIds) {
	const channelId = normalizeAnyChannelId(channelName);
	if (!channelId) return;
	try {
		const plugin = getChannelPlugin(channelId) ?? getBundledChannelPlugin(channelId);
		if (!plugin) return;
		const resolveAccountIds = async (accountIds) => {
			const resolved = await Promise.all(accountIds.map(async (accountId) => {
				const account = await resolveChannelAccount({
					plugin,
					cfg,
					accountId
				});
				const resolvedId = asOptionalObjectRecord(account)?.accountId;
				return typeof resolvedId === "string" && resolvedId ? resolvedId : void 0;
			}));
			return resolved.every((accountId) => accountId !== void 0) ? resolved : void 0;
		};
		const configured = await resolveAccountIds(configuredAccountIds);
		const runtime = await resolveAccountIds(plugin.config.listAccountIds(cfg));
		return configured && runtime ? {
			configured,
			runtime
		} : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/commands/doctor/shared/allowlist.ts
/** Return true when an allowFrom-like list has at least one normalized sender entry. */
function hasAllowFromEntries(list) {
	return Array.isArray(list) && normalizeStringEntries(list).length > 0;
}
/** Visit the channel before reading accounts so repairs retain parent-first semantics. */
function* iterateDoctorChannelAccounts(channel, prefix, skipDisabled = false) {
	yield {
		account: channel,
		prefix
	};
	for (const [accountId, value] of Object.entries(asNullableRecord(channel.accounts) ?? {})) {
		const account = asOptionalObjectRecord(value);
		if (account && (!skipDisabled || account.enabled !== false)) yield {
			account,
			parent: channel,
			accountId,
			prefix: `${prefix}.accounts.${accountId}`
		};
	}
}
//#endregion
export { resolveDoctorChannelAccountIds as i, iterateDoctorChannelAccounts as n, getDoctorChannelCapabilities as r, hasAllowFromEntries as t };
