import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { c as listOfficialExternalChannelEnvVars } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { t as resolveBundledChannelRootScope } from "./bundled-root-DV00Xhfz.mjs";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-DT_h3Okz.mjs";
import { i as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-lXYCPihJ.mjs";
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
* Bundled channel id listing helpers.
*
* Reads generated channel catalog entries for current package/cache scope.
*/
/**
* Lists bundled channel ids for a package root/cache scope.
*/
function listBundledChannelIdsForRoot(_packageRoot, env = process.env, discovery) {
	return listChannelCatalogEntries({
		origin: "bundled",
		env,
		discovery
	}).map((entry) => entry.channel.id).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
/**
* Lists bundled channel ids for the current runtime root scope.
*/
function listBundledChannelIds(env = process.env, discovery) {
	return listBundledChannelIdsForRoot(resolveBundledChannelRootScope(env).cacheKey, env, discovery);
}
//#endregion
//#region src/channels/config-presence.ts
/**
* Channel configuration presence detection.
*
* Finds channels made available by config, env, persisted auth, or plugin discovery signals.
*/
/** Returns true when a channel config entry contains settings beyond enabled/disabled state. */
function hasMeaningfulChannelConfig(value) {
	if (!isRecord(value)) return false;
	return Object.keys(value).some((key) => key !== "enabled");
}
/** Lists channels explicitly disabled in config so activation logic can suppress auto-detection. */
function listExplicitlyDisabledChannelIdsForConfig(cfg) {
	const channels = isRecord(cfg.channels) ? cfg.channels : null;
	if (!channels) return [];
	return Object.entries(channels).filter(([, value]) => isRecord(value) && value.enabled === false).map(([channelId]) => channelId.trim()).filter((channelId) => channelId && !isChannelConfigMetadataKey(channelId)).map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId));
}
function listChannelEnvPrefixes(channelIds) {
	return channelIds.map((channelId) => [`${channelId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}_`, channelId]);
}
function hasPersistedChannelState(env) {
	return fs.existsSync(resolveStateDir(env, os.homedir));
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
		if (hasMeaningfulChannelConfig(value)) addSignal(key, "config");
	}
	if (options.ambientEnvTriggers !== "suppress") for (const [key, value] of Object.entries(env)) {
		if (!hasNonEmptyString(value)) continue;
		for (const [prefix, channelId] of channelEnvPrefixes) if (key.startsWith(prefix)) addSignal(channelId, "env");
		for (const { channelId, envVars } of officialExternalChannelEnvVars) if (envVars.includes(key)) addSignal(channelId, "env");
	}
	if (options.includePersistedAuthState !== false && hasPersistedChannelState(env)) for (const channelId of listBundledChannelIdsWithPersistedAuthState(options.discovery)) {
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
export { listPotentialConfiguredChannelPresenceSignals as i, listExplicitlyDisabledChannelIdsForConfig as n, listPotentialConfiguredChannelIds as r, hasMeaningfulChannelConfig as t };
