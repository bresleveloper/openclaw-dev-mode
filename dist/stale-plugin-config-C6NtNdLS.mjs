import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as CHANNEL_IDS } from "./ids-DhLNdNuz.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { C as defaultSlotIdForKey, a as isExplicitPluginDisableMarker, c as normalizePluginId, o as isRetiredPluginId, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { r as hasIncompletePluginDiscovery, t as createBlockedPluginDiagnosticLookup } from "./discovery-availability-CEoTdFoo.mjs";
import { l as listOfficialExternalPluginCatalogEntries, v as resolveOfficialExternalPluginLookupIds } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-FIsucmo1.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
//#region src/commands/doctor/shared/stale-plugin-repair-preservation.ts
function normalizeIds(ids) {
	return new Set(Array.from(ids ?? [], normalizePluginId).filter(Boolean));
}
function filterRepairableStalePluginHits(params) {
	const preserveIds = normalizeIds(params.preservePluginIds);
	const surfacePreserveIds = new Map(Object.entries(params.surfacePreservePluginIds ?? {}).map(([surface, ids]) => [surface, normalizeIds(ids)]));
	return params.hits.filter((hit) => {
		const id = normalizePluginId(hit.pluginId);
		return !preserveIds.has(id) && !surfacePreserveIds.get(hit.surface)?.has(id);
	});
}
//#endregion
//#region src/commands/doctor/shared/stale-plugin-config.ts
const CHANNEL_CONFIG_META_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
function collectPluginRegistryState(cfg, env) {
	const environment = env ?? process.env;
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const workspaceDir = defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : void 0;
	const registry = loadManifestMetadataSnapshot({
		config: cfg,
		workspaceDir: workspaceDir ?? void 0,
		env: environment
	}).manifestRegistry;
	const knownIds = new Set(registry.plugins.map((plugin) => plugin.id));
	const findBlockedPluginDiagnostic = createBlockedPluginDiagnosticLookup({
		diagnostics: registry.diagnostics,
		config: cfg,
		env: environment
	});
	const officialLookupIds = new Set(listOfficialExternalPluginCatalogEntries().flatMap((entry) => resolveOfficialExternalPluginLookupIds(entry).map(normalizePluginId)).filter(Boolean));
	const installedIds = new Set(Object.keys(cfg.plugins?.installs ?? {}).map(normalizePluginId).filter(Boolean));
	try {
		for (const pluginId of Object.keys(loadInstalledPluginIndexInstallRecordsSync({ env: environment }))) {
			const normalized = normalizePluginId(pluginId);
			if (normalized) installedIds.add(normalized);
		}
	} catch {}
	const knownChannelIds = new Set([...CHANNEL_IDS, ...registry.plugins.flatMap((plugin) => plugin.channels)].map(normalizePluginId).filter(Boolean));
	return {
		plugins: registry.plugins,
		knownIds,
		officialLookupIds,
		knownChannelIds,
		missingInstalledIds: new Set([...installedIds].filter((pluginId) => !knownIds.has(pluginId) && !findBlockedPluginDiagnostic(pluginId))),
		findBlockedPluginDiagnostic,
		incompleteDiscovery: hasIncompletePluginDiscovery(registry.diagnostics)
	};
}
/** Incomplete discovery cannot prove that a configured plugin should be removed. */
function isStalePluginAutoRepairBlocked(cfg, env) {
	if (cfg.plugins?.enabled === false) return false;
	return collectPluginRegistryState(cfg, env).incompleteDiscovery;
}
/** Scan plugin/channel config surfaces for ids no longer present in manifests or installs. */
function scanStalePluginConfig(cfg, env) {
	if (cfg.plugins?.enabled === false) return [];
	return scanStalePluginConfigWithState(cfg, collectPluginRegistryState(cfg, env));
}
function scanStalePluginConfigWithState(cfg, registryState) {
	const plugins = asNullableRecord(cfg.plugins);
	const { knownIds, officialLookupIds, knownChannelIds } = registryState;
	const isMissingPolicyOwner = (pluginId) => pluginId && !knownIds.has(pluginId) && !registryState.findBlockedPluginDiagnostic(pluginId) && !officialLookupIds.has(pluginId) && !knownChannelIds.has(pluginId);
	const hits = [];
	const staleEvidenceIds = new Set(registryState.missingInstalledIds);
	for (const surface of ["allow", "deny"]) {
		const list = Array.isArray(plugins?.[surface]) ? plugins[surface] : [];
		for (const rawPluginId of list) {
			if (typeof rawPluginId !== "string") continue;
			const pluginId = normalizePluginId(rawPluginId);
			if (!isMissingPolicyOwner(pluginId)) continue;
			hits.push({
				pluginId: rawPluginId,
				pathLabel: `plugins.${surface}`,
				surface
			});
			staleEvidenceIds.add(pluginId);
		}
	}
	for (const [rawPluginId, entry] of Object.entries(asNullableRecord(plugins?.entries) ?? {})) {
		const pluginId = normalizePluginId(rawPluginId);
		if (!isMissingPolicyOwner(pluginId) || isExplicitPluginDisableMarker(entry) && !isRetiredPluginId(pluginId)) continue;
		hits.push({
			pluginId: rawPluginId,
			pathLabel: `plugins.entries.${rawPluginId}`,
			surface: "entries"
		});
		staleEvidenceIds.add(pluginId);
	}
	const slots = asNullableRecord(plugins?.slots);
	for (const slotKey of ["memory", "contextEngine"]) {
		const rawPluginId = slots?.[slotKey];
		if (typeof rawPluginId !== "string") continue;
		const pluginId = normalizePluginId(rawPluginId);
		const defaultSlotId = defaultSlotIdForKey(slotKey);
		if (!pluginId || rawPluginId.trim().toLowerCase() === "none" || pluginId === normalizePluginId(defaultSlotId) || knownIds.has(pluginId) || registryState.findBlockedPluginDiagnostic(pluginId)) continue;
		hits.push({
			pluginId: rawPluginId,
			pathLabel: `plugins.slots.${slotKey}`,
			surface: "slot",
			slotKey
		});
	}
	const staleChannelIds = collectDanglingChannelIds({
		cfg,
		registryState,
		staleEvidenceIds
	});
	for (const channelId of staleChannelIds) hits.push({
		pluginId: channelId,
		pathLabel: `channels.${channelId}`,
		surface: "channel"
	});
	hits.push(...collectDependentChannelConfigHits(cfg, staleChannelIds));
	return hits;
}
function collectDanglingChannelIds(params) {
	const channels = asNullableRecord(params.cfg.channels);
	if (!channels) return [];
	const ids = [];
	const seen = /* @__PURE__ */ new Set();
	for (const channelId of Object.keys(channels)) {
		if (CHANNEL_CONFIG_META_KEYS.has(channelId)) continue;
		const normalized = normalizePluginId(channelId);
		if (!normalized || params.registryState.knownChannelIds.has(normalized) || !params.staleEvidenceIds.has(normalized) || seen.has(normalized)) continue;
		seen.add(normalized);
		ids.push(channelId);
	}
	return ids;
}
function collectDependentChannelConfigHits(cfg, channelIds) {
	if (channelIds.length === 0) return [];
	const staleChannelIds = new Set(channelIds.map((channelId) => normalizePluginId(channelId)));
	const hits = [];
	for (const { agent, path } of [{
		agent: cfg.agents?.defaults,
		path: "agents.defaults"
	}, ...listMutableCodexRouteAgentEntries(cfg)]) {
		const target = asNullableRecord(agent?.heartbeat)?.target;
		if (typeof target !== "string" || !staleChannelIds.has(normalizePluginId(target))) continue;
		hits.push({
			pluginId: target,
			pathLabel: `${path}.heartbeat.target`,
			surface: "heartbeat"
		});
	}
	for (const [providerId, channelMap] of Object.entries(asNullableRecord(cfg.channels?.modelByChannel) ?? {})) for (const channelId of Object.keys(asNullableRecord(channelMap) ?? {})) {
		if (!staleChannelIds.has(normalizePluginId(channelId))) continue;
		hits.push({
			pluginId: channelId,
			pathLabel: `channels.modelByChannel.${providerId}.${channelId}`,
			surface: "modelByChannel"
		});
	}
	return hits;
}
const isPolicySurfaceHit = (hit) => hit.surface === "allow" || hit.surface === "deny" || hit.surface === "entries";
function formatStalePluginHitWarning(hit) {
	if (isPolicySurfaceHit(hit)) return null;
	if (hit.surface === "slot") return `- ${hit.pathLabel}: slot references missing plugin "${hit.pluginId}".`;
	if (hit.surface === "channel") return `- ${hit.pathLabel}: dangling channel config for missing plugin "${hit.pluginId}" was found.`;
	if (hit.surface === "heartbeat") return `- ${hit.pathLabel}: heartbeat target references missing channel plugin "${hit.pluginId}".`;
	return `- ${hit.pathLabel}: model override references missing channel plugin "${hit.pluginId}".`;
}
/** Format warnings for stale plugin config hits. */
function collectStalePluginConfigWarnings(params) {
	const hits = filterRepairableStalePluginHits(params);
	if (hits.length === 0) return [];
	const policyPluginIds = [...new Set(hits.filter(isPolicySurfaceHit).map((hit) => hit.pluginId))].toSorted((a, b) => a.localeCompare(b));
	const lines = hits.map((hit) => formatStalePluginHitWarning(hit)).filter((line) => line !== null);
	if (policyPluginIds.length > 0) lines.unshift(`- Stale plugin references (plugins.allow/deny/entries): ${policyPluginIds.join(", ")}.`);
	if (params.autoRepairBlocked) lines.push(`- Auto-removal is paused because plugin discovery is incomplete; uninspected configuration is preserved. Resolve the plugin discovery diagnostics, then rerun "${params.doctorFixCommand}".`);
	else lines.push(`- Run "${params.doctorFixCommand}" to remove stale plugin ids and dangling channel references.`);
	return lines.map((line) => sanitizeForLog(line));
}
/** Remove stale plugin ids and dangling channel references when discovery is healthy. */
function maybeRepairStalePluginConfig(cfg, env, params) {
	if (cfg.plugins?.enabled === false) return {
		config: cfg,
		changes: []
	};
	const registryState = collectPluginRegistryState(cfg, env);
	if (registryState.incompleteDiscovery) return {
		config: cfg,
		changes: []
	};
	const hits = filterRepairableStalePluginHits({
		hits: scanStalePluginConfigWithState(cfg, registryState),
		preservePluginIds: params?.preservePluginIds,
		surfacePreservePluginIds: params?.surfacePreservePluginIds
	});
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const nextPlugins = asNullableRecord(next.plugins);
	const idsForSurface = (surface) => hits.filter((hit) => hit.surface === surface).map((hit) => hit.pluginId);
	let retainedAllowedIds = [];
	const allowIds = idsForSurface("allow");
	const denyIds = idsForSurface("deny");
	for (const surface of ["allow", "deny"]) {
		const ids = surface === "allow" ? allowIds : denyIds;
		const list = nextPlugins?.[surface];
		if (!nextPlugins || ids.length === 0 || !Array.isArray(list)) continue;
		const staleIds = new Set(ids.map((pluginId) => normalizePluginId(pluginId)));
		nextPlugins[surface] = list.filter((pluginId) => typeof pluginId !== "string" || !staleIds.has(normalizePluginId(pluginId)));
		if (surface === "allow" && normalizePluginsConfig(next.plugins).allow.length === 0) {
			const config = normalizePluginsConfig(cfg.plugins);
			const activePlugins = registryState.plugins.filter((plugin) => isActivatedManifestOwner({
				plugin,
				normalizedConfig: config,
				rootConfig: cfg
			}));
			const activePolicyIds = new Set(activePlugins.map((plugin) => normalizePluginPolicyId(plugin.id)));
			const aliasedOwners = activePlugins.filter((plugin) => !activePolicyIds.has(normalizePluginId(plugin.id)));
			if (aliasedOwners.length > 0) return {
				config: cfg,
				changes: [],
				warnings: [`- Stale plugin cleanup paused: preserving the restrictive plugins.allow policy because active plugin ids alias to other owners (${aliasedOwners.map((plugin) => `${plugin.id} -> ${normalizePluginId(plugin.id)}`).join(", ")}). Choose noncolliding allowed plugin ids, then rerun openclaw doctor --fix.`]
			};
			retainedAllowedIds = activePlugins.map((plugin) => normalizePluginId(plugin.id));
			nextPlugins.allow = retainedAllowedIds;
			if (retainedAllowedIds.length === 0) nextPlugins.enabled = false;
		}
	}
	const entryIds = idsForSurface("entries");
	if (entryIds.length > 0) {
		const entries = asNullableRecord(nextPlugins?.entries);
		if (entries) removeStalePluginKeys(entries, new Set(entryIds.map((pluginId) => normalizePluginId(pluginId))));
	}
	const slotHits = hits.filter((hit) => hit.surface === "slot" && hit.slotKey !== void 0);
	const slots = asNullableRecord(nextPlugins?.slots);
	if (slotHits.length > 0 && slots) {
		for (const hit of slotHits) delete slots[hit.slotKey];
		if (Object.keys(slots).length === 0 && nextPlugins) delete nextPlugins.slots;
	}
	const channelIds = idsForSurface("channel");
	if (channelIds.length > 0) removeDanglingChannelReferences(next, channelIds);
	const changes = [];
	const recordRemoval = (ids, label, noun, plural = `${noun}s`) => {
		if (ids.length > 0) changes.push(`- ${label}: removed ${ids.length} stale ${ids.length === 1 ? noun : plural} (${ids.join(", ")})`);
	};
	recordRemoval(allowIds, "plugins.allow", "plugin id");
	if (retainedAllowedIds.length > 0) changes.push(`- plugins.allow: retained already enabled plugins as explicit allowlist entries (${retainedAllowedIds.join(", ")}); review this list when changing channels or plugin slots`);
	if (nextPlugins?.enabled === false) changes.push("- plugins.enabled: disabled plugins because no allowed plugins remain; review plugins.allow before enabling plugins");
	recordRemoval(denyIds, "plugins.deny", "plugin id");
	recordRemoval(entryIds, "plugins.entries", "plugin entry", "plugin entries");
	if (slotHits.length > 0) changes.push(`- plugins.slots: reset ${slotHits.length} stale plugin slot${slotHits.length === 1 ? "" : "s"} (${slotHits.map((hit) => `${hit.slotKey}: ${hit.pluginId} -> ${defaultSlotIdForKey(hit.slotKey)}`).join(", ")})`);
	if (channelIds.length > 0) {
		recordRemoval(channelIds, "channels", "channel config");
		for (const [surface, label, noun] of [[
			"heartbeat",
			"agents heartbeat",
			"heartbeat target"
		], [
			"modelByChannel",
			"channels.modelByChannel",
			"channel model override"
		]]) {
			const ids = idsForSurface(surface);
			if (ids.length > 0) changes.push(`- ${label}: removed ${ids.length} stale ${noun}${ids.length === 1 ? "" : "s"} (${[...new Set(ids)].join(", ")})`);
		}
	}
	return {
		config: next,
		changes
	};
}
function removeStalePluginKeys(record, staleIds, preservedKeys) {
	for (const key of Object.keys(record)) if (!preservedKeys?.has(key) && staleIds.has(normalizePluginId(key))) delete record[key];
}
function removeDanglingChannelReferences(config, channelIds) {
	const staleChannelIds = new Set(channelIds.map((channelId) => normalizePluginId(channelId)));
	const channels = asNullableRecord(config.channels);
	if (channels) {
		removeStalePluginKeys(channels, staleChannelIds, CHANNEL_CONFIG_META_KEYS);
		const modelByChannel = asNullableRecord(channels.modelByChannel);
		if (modelByChannel) {
			for (const [providerId, channelMap] of Object.entries(modelByChannel)) {
				const channelsForProvider = asNullableRecord(channelMap);
				if (!channelsForProvider) continue;
				removeStalePluginKeys(channelsForProvider, staleChannelIds);
				if (Object.keys(channelsForProvider).length === 0) delete modelByChannel[providerId];
			}
			if (Object.keys(modelByChannel).length === 0) delete channels.modelByChannel;
		}
	}
	for (const agent of [config.agents?.defaults, ...listMutableCodexRouteAgentEntries(config).map((entry) => entry.agent)]) {
		const heartbeat = asNullableRecord(agent?.heartbeat);
		if (heartbeat && typeof heartbeat.target === "string" && staleChannelIds.has(normalizePluginId(heartbeat.target))) delete heartbeat.target;
	}
}
//#endregion
export { scanStalePluginConfig as i, isStalePluginAutoRepairBlocked as n, maybeRepairStalePluginConfig as r, collectStalePluginConfigWarnings as t };
