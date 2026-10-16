import { c as normalizeOptionalLowercaseString, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { c as listOfficialExternalChannelEnvVars } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-BkxHAjR-.mjs";
import { i as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-DT9QRO40.mjs";
import { t as hasMeaningfulChannelConfig } from "./channel-config-activation-CjIoaWiA.mjs";
import fs from "node:fs";
import os from "node:os";
//#region src/channels/plugins/persisted-auth-state.ts
/**
* Lists bundled channels that declare persisted-auth state metadata.
*/
function listBundledChannelIdsWithPersistedAuthState(discovery) {
	return listBundledChannelIdsForPackageState("persistedAuthState", discovery);
}
/**
* Returns whether a bundled channel reports persisted auth state.
*/
function hasBundledChannelPersistedAuthState(params) {
	return hasBundledChannelPackageState({
		metadataKey: "persistedAuthState",
		channelId: params.channelId,
		cfg: params.cfg,
		env: params.env,
		discovery: params.discovery
	});
}
//#endregion
//#region src/channels/plugins/bundled-ids.ts
/**
* Lists bundled channel ids for the current runtime catalog.
*/
function listBundledChannelIds(env = process.env, discovery) {
	return listChannelCatalogEntries({
		origin: "bundled",
		env,
		discovery
	}).map((entry) => entry.channel.id).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/channels/config-presence.ts
/** Lists channels explicitly disabled in config so activation logic can suppress auto-detection. */
function listExplicitlyDisabledChannelIdsForConfig(cfg) {
	const channels = isRecord(cfg.channels) ? cfg.channels : null;
	if (!channels) return [];
	return Object.entries(channels).filter(([, value]) => isRecord(value) && value.enabled === false).map(([channelId]) => channelId.trim()).filter((channelId) => channelId && !isChannelConfigMetadataKey(channelId)).map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId));
}
function listChannelEnvPrefixes(channelIds) {
	return channelIds.map((channelId) => [`${channelId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}_`, channelId]);
}
/** Lists channel ids detected from config, env vars, or persisted auth state. */
function listPotentialConfiguredChannelIds(cfg, env = process.env, options = {}) {
	return uniqueStrings(listPotentialConfiguredChannelPresenceSignals(cfg, env, options).map((signal) => signal.channelId));
}
/** Lists deduplicated channel presence signals with their detection source. */
function listPotentialConfiguredChannelPresenceSignals(cfg, env = process.env, options = {}) {
	const signals = [];
	const seenSignals = /* @__PURE__ */ new Set();
	const addSignal = (rawChannelId, source) => {
		const channelId = rawChannelId.trim();
		if (!channelId || isChannelConfigMetadataKey(channelId)) return;
		const key = `${source}:${channelId}`;
		if (seenSignals.has(key)) return;
		seenSignals.add(key);
		signals.push({
			channelId,
			source
		});
	};
	const scopedChannelIds = options.channelIds ? new Set(options.channelIds.map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId))) : void 0;
	const channelEnvPrefixes = listChannelEnvPrefixes(options.channelIds ?? listBundledChannelIds(env, options.discovery));
	const officialExternalChannelEnvVars = listOfficialExternalChannelEnvVars().filter(({ channelId }) => !scopedChannelIds || scopedChannelIds.has(channelId));
	const channels = isRecord(cfg.channels) ? cfg.channels : null;
	if (channels) for (const [key, value] of Object.entries(channels)) {
		if (isChannelConfigMetadataKey(key)) continue;
		if (hasMeaningfulChannelConfig(value, key)) addSignal(key, "config");
	}
	if (options.ambientEnvTriggers !== "suppress") for (const [key, value] of Object.entries(env)) {
		if (!hasNonEmptyString(value)) continue;
		for (const [prefix, channelId] of channelEnvPrefixes) if (key.startsWith(prefix)) addSignal(channelId, "env");
		for (const { channelId, envVars } of officialExternalChannelEnvVars) if (envVars.includes(key)) addSignal(channelId, "env");
	}
	if (options.includePersistedAuthState !== false && fs.existsSync(resolveStateDir(env, os.homedir))) for (const channelId of listBundledChannelIdsWithPersistedAuthState(options.discovery)) {
		if (options.persistedAuthChannelIds && !options.persistedAuthChannelIds.has(normalizeOptionalLowercaseString(channelId) ?? "")) continue;
		if (hasBundledChannelPersistedAuthState({
			channelId,
			cfg,
			env,
			discovery: options.discovery
		})) addSignal(channelId, "persisted-auth");
	}
	return signals;
}
//#endregion
export { listPotentialConfiguredChannelIds as n, listPotentialConfiguredChannelPresenceSignals as r, listExplicitlyDisabledChannelIdsForConfig as t };
