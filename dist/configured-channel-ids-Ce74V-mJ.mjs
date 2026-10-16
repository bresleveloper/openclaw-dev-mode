import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { r as listPotentialConfiguredChannelPresenceSignals, t as listExplicitlyDisabledChannelIdsForConfig } from "./config-presence-bjA_OXo5.mjs";
import { t as hasMeaningfulChannelConfig } from "./channel-config-activation-CjIoaWiA.mjs";
//#region src/commands/doctor/shared/configured-channel-ids.ts
function includesConfigEntry(value, policy, channelId) {
	if (policy === "raw") return true;
	if (policy === "enabled") return !isRecord(value) || value.enabled !== false;
	const meaningful = hasMeaningfulChannelConfig(value, channelId);
	return policy === "meaningful" ? meaningful : isRecord(value) && value.enabled === true || meaningful;
}
/** Lists configured channel ids while leaving caller-specific activation policy at the caller. */
function listDoctorConfiguredChannelIds(config, options) {
	const root = isRecord(config) ? config : {};
	const cfg = root;
	if (options.skipWhenPluginsDisabled && isRecord(root.plugins) && root.plugins.enabled === false) return [];
	const disabledIds = options.excludeExplicitlyDisabled ? new Set(listExplicitlyDisabledChannelIdsForConfig(cfg)) : null;
	const ids = /* @__PURE__ */ new Set();
	const add = (rawChannelId) => {
		const channelId = rawChannelId.trim();
		const normalized = normalizeOptionalLowercaseString(channelId);
		if (!channelId || isChannelConfigMetadataKey(channelId) || normalized && disabledIds?.has(normalized)) return;
		ids.add(channelId);
	};
	const channels = isRecord(root.channels) ? root.channels : null;
	if (channels) {
		for (const [channelId, entry] of Object.entries(channels)) if (includesConfigEntry(entry, options.configEntryPolicy, channelId)) add(channelId);
	}
	if (options.env) for (const signal of listPotentialConfiguredChannelPresenceSignals(cfg, options.env, {
		channelIds: options.candidateChannelIds,
		includePersistedAuthState: false
	})) {
		if (signal.source !== "env") continue;
		const channelId = options.mapEnvironmentChannelId?.(signal.channelId) ?? signal.channelId;
		if (options.environmentChannelIsConfigured?.(channelId) === false) continue;
		add(channelId);
	}
	const result = [...ids];
	if (options.sort === "locale") return result.toSorted((left, right) => left.localeCompare(right));
	return options.sort === "codepoint" ? result.toSorted() : result;
}
//#endregion
export { listDoctorConfiguredChannelIds as t };
