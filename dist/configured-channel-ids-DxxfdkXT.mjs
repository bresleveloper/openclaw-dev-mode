import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { i as listPotentialConfiguredChannelPresenceSignals, n as listExplicitlyDisabledChannelIdsForConfig, t as hasMeaningfulChannelConfig } from "./config-presence-D97iwlYy.mjs";
//#region src/commands/doctor/shared/configured-channel-ids.ts
function includesConfigEntry(value, policy) {
	if (policy === "raw") return true;
	if (policy === "enabled") return !isRecord(value) || value.enabled !== false;
	const meaningful = hasMeaningfulChannelConfig(value);
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
		for (const [channelId, entry] of Object.entries(channels)) if (includesConfigEntry(entry, options.configEntryPolicy)) add(channelId);
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
