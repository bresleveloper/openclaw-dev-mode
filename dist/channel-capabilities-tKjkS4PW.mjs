import { t as findBundledChannelCatalogMetadata } from "./bundled-channel-catalog-read-RR5snA6Y.mjs";
import { n as getBundledChannelPlugin } from "./bundled-D8dZgG2d.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
//#region src/commands/doctor/channel-capabilities.ts
const DEFAULT_DOCTOR_CHANNEL_CAPABILITIES = {
	dmAllowFromMode: "topOnly",
	groupModel: "sender",
	groupAllowFromFallbackToAllowFrom: true,
	warnOnEmptyGroupSenderAllowlist: true
};
function mergeDoctorChannelCapabilities(capabilities) {
	return {
		dmAllowFromMode: capabilities?.dmAllowFromMode ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.dmAllowFromMode,
		...typeof capabilities?.openDmRequiresAllowFromWildcard === "boolean" ? { openDmRequiresAllowFromWildcard: capabilities.openDmRequiresAllowFromWildcard } : {},
		groupModel: capabilities?.groupModel ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.groupModel,
		groupAllowFromFallbackToAllowFrom: capabilities?.groupAllowFromFallbackToAllowFrom ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.groupAllowFromFallbackToAllowFrom,
		warnOnEmptyGroupSenderAllowlist: capabilities?.warnOnEmptyGroupSenderAllowlist ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.warnOnEmptyGroupSenderAllowlist
	};
}
function getCatalogDoctorCapabilities(channelId) {
	return findBundledChannelCatalogMetadata(channelId)?.doctorCapabilities;
}
/** Resolve doctor behavior capabilities from channel metadata, plugin runtime, or defaults. */
function getDoctorChannelCapabilities(channelName) {
	if (!channelName) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
	const catalogCapabilities = getCatalogDoctorCapabilities(channelName);
	if (catalogCapabilities) return mergeDoctorChannelCapabilities(catalogCapabilities);
	const channelId = normalizeAnyChannelId(channelName);
	if (!channelId) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
	const pluginDoctor = getChannelPlugin(channelId)?.doctor ?? getBundledChannelPlugin(channelId)?.doctor;
	if (pluginDoctor) return mergeDoctorChannelCapabilities(pluginDoctor);
	return mergeDoctorChannelCapabilities(getCatalogDoctorCapabilities(channelId));
}
function readResolvedAccountId(account) {
	if (!account || typeof account !== "object") return;
	const accountId = account.accountId;
	return typeof accountId === "string" && accountId ? accountId : void 0;
}
/** Resolve configured and runtime account ids through the channel plugin's own semantics. */
function resolveDoctorChannelAccountIds(channelName, cfg, configuredAccountIds) {
	const channelId = normalizeAnyChannelId(channelName);
	if (!channelId) return;
	try {
		const plugin = getChannelPlugin(channelId) ?? getBundledChannelPlugin(channelId);
		if (!plugin) return;
		const resolveAccountIds = (accountIds) => {
			const resolved = accountIds.map((accountId) => readResolvedAccountId(plugin.config.resolveAccount(cfg, accountId)));
			return resolved.every((accountId) => accountId !== void 0) ? resolved : void 0;
		};
		const configured = resolveAccountIds(configuredAccountIds);
		const runtime = resolveAccountIds(plugin.config.listAccountIds(cfg));
		return configured && runtime ? {
			configured,
			runtime
		} : void 0;
	} catch {
		return;
	}
}
//#endregion
export { resolveDoctorChannelAccountIds as n, getDoctorChannelCapabilities as t };
