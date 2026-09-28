import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { A as tryResolveDefaultAgentId, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import { n as defaultSlotIdForKey } from "./slots-D4OMSTbt.mjs";
import { a as isRetiredPluginId, i as isExplicitPluginDisableMarker, s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { u as hasIncompletePluginDiscovery } from "./discovery-D_5mAUI7.mjs";
import { l as listOfficialExternalPluginCatalogEntries, v as resolveOfficialExternalPluginLookupIds } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
//#region src/commands/doctor/shared/stale-plugin-repair-preservation.ts
function normalizeIds(ids) {
	return new Set([...ids ?? []].map((id) => normalizePluginId(id)).filter((id) => Boolean(id)));
}
function filterRepairableStalePluginHits(params) {
	const preserveIds = normalizeIds(params.preservePluginIds);
	const surfacePreserveIds = Object.fromEntries(Object.entries(params.surfacePreservePluginIds ?? {}).map(([surface, ids]) => [surface, normalizeIds(ids)]));
	return params.hits.filter((hit) => {
		const id = normalizePluginId(hit.pluginId);
		return !preserveIds.has(id) && !surfacePreserveIds[hit.surface]?.has(id);
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
	const officialLookupIds = new Set(listOfficialExternalPluginCatalogEntries().flatMap((entry) => resolveOfficialExternalPluginLookupIds(entry).map(normalizePluginId)).filter(Boolean));
	const installedIds = /* @__PURE__ */ new Set();
	for (const pluginId of Object.keys(cfg.plugins?.installs ?? {})) {
		const normalized = normalizePluginId(pluginId);
		if (normalized) installedIds.add(normalized);
	}
	try {
		for (const pluginId of Object.keys(loadInstalledPluginIndexInstallRecordsSync({ env: environment }))) {
			const normalized = normalizePluginId(pluginId);
			if (normalized) installedIds.add(normalized);
		}
	} catch {}
	const knownChannelIds = new Set(CHANNEL_IDS.map((channelId) => normalizePluginId(channelId)));
	for (const plugin of registry.plugins) for (const channelId of plugin.channels) {
		const normalized = normalizePluginId(channelId);
		if (normalized) knownChannelIds.add(normalized);
	}
	return {
		knownIds,
		officialLookupIds,
		knownChannelIds,
		missingInstalledIds: new Set([...installedIds].filter((pluginId) => !knownIds.has(pluginId))),
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
	return scanStalePluginConfigWithState(cfg, collectPluginRegistryState(cfg, env ?? process.env));
}
function scanStalePluginConfigWithState(cfg, registryState) {
	const plugins = asNullableRecord(cfg.plugins);
	const { knownIds, officialLookupIds } = registryState;
	const hits = [];
	const staleEvidenceIds = new Set(registryState.missingInstalledIds);
	for (const surface of ["allow", "deny"]) {
		const list = Array.isArray(plugins?.[surface]) ? plugins[surface] : [];
		for (const rawPluginId of list) {
			if (typeof rawPluginId !== "string") continue;
			const pluginId = normalizePluginId(rawPluginId);
			if (!pluginId || knownIds.has(pluginId) || officialLookupIds.has(pluginId) || registryState.knownChannelIds.has(pluginId)) continue;
			hits.push({
				pluginId: rawPluginId,
				pathLabel: `plugins.${surface}`,
				surface
			});
			staleEvidenceIds.add(pluginId);
		}
	}
	const entries = asNullableRecord(plugins?.entries);
	if (entries) for (const [rawPluginId, entry] of Object.entries(entries)) {
		const pluginId = normalizePluginId(rawPluginId);
		if (!pluginId || isExplicitPluginDisableMarker(entry) && !isRetiredPluginId(pluginId) || knownIds.has(pluginId) || officialLookupIds.has(pluginId) || registryState.knownChannelIds.has(pluginId)) continue;
		hits.push({
			pluginId: rawPluginId,
			pathLabel: `plugins.entries.${rawPluginId}`,
			surface: "entries"
		});
		staleEvidenceIds.add(pluginId);
	}
	const slots = asNullableRecord(plugins?.slots);
	if (slots) for (const slotKey of ["memory", "contextEngine"]) {
		const rawPluginId = slots[slotKey];
		if (typeof rawPluginId !== "string") continue;
		const pluginId = normalizePluginId(rawPluginId);
		const defaultSlotId = defaultSlotIdForKey(slotKey);
		if (!pluginId || rawPluginId.trim().toLowerCase() === "none" || pluginId === normalizePluginId(defaultSlotId) || knownIds.has(pluginId)) continue;
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
	for (const hit of collectDependentChannelConfigHits(cfg, staleChannelIds)) hits.push(hit);
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
	const defaultTarget = cfg.agents?.defaults?.heartbeat?.target;
	if (typeof defaultTarget === "string" && staleChannelIds.has(normalizePluginId(defaultTarget))) hits.push({
		pluginId: defaultTarget,
		pathLabel: "agents.defaults.heartbeat.target",
		surface: "heartbeat"
	});
	for (const { agent, path } of listMutableCodexRouteAgentEntries(cfg)) {
		const target = asNullableRecord(agent.heartbeat)?.target;
		if (typeof target !== "string" || !staleChannelIds.has(normalizePluginId(target))) continue;
		hits.push({
			pluginId: target,
			pathLabel: `${path}.heartbeat.target`,
			surface: "heartbeat"
		});
	}
	const modelByChannel = asNullableRecord(cfg.channels?.modelByChannel);
	if (modelByChannel) for (const [providerId, channelMap] of Object.entries(modelByChannel)) {
		const channels = asNullableRecord(channelMap);
		if (!channels) continue;
		for (const channelId of Object.keys(channels)) {
			if (!staleChannelIds.has(normalizePluginId(channelId))) continue;
			hits.push({
				pluginId: channelId,
				pathLabel: `channels.modelByChannel.${providerId}.${channelId}`,
				surface: "modelByChannel"
			});
		}
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
	const registryState = collectPluginRegistryState(cfg, env ?? process.env);
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
	const allowIds = hits.filter((hit) => hit.surface === "allow").map((hit) => hit.pluginId);
	if (allowIds.length > 0 && Array.isArray(nextPlugins?.allow)) {
		const staleAllowIds = new Set(allowIds.map((pluginId) => normalizePluginId(pluginId)));
		nextPlugins.allow = nextPlugins.allow.filter((pluginId) => typeof pluginId !== "string" || !staleAllowIds.has(normalizePluginId(pluginId)));
	}
	const denyIds = hits.filter((hit) => hit.surface === "deny").map((hit) => hit.pluginId);
	if (denyIds.length > 0 && Array.isArray(nextPlugins?.deny)) {
		const staleDenyIds = new Set(denyIds.map((pluginId) => normalizePluginId(pluginId)));
		nextPlugins.deny = nextPlugins.deny.filter((pluginId) => typeof pluginId !== "string" || !staleDenyIds.has(normalizePluginId(pluginId)));
	}
	const entryIds = hits.filter((hit) => hit.surface === "entries").map((hit) => hit.pluginId);
	if (entryIds.length > 0) {
		const entries = asNullableRecord(nextPlugins?.entries);
		if (entries) {
			const staleEntryIds = new Set(entryIds.map((pluginId) => normalizePluginId(pluginId)));
			for (const pluginId of Object.keys(entries)) if (staleEntryIds.has(normalizePluginId(pluginId))) delete entries[pluginId];
		}
	}
	const slotHits = hits.filter((hit) => hit.surface === "slot" && hit.slotKey !== void 0);
	if (slotHits.length > 0) {
		const slots = asNullableRecord(nextPlugins?.slots);
		if (slots) {
			for (const hit of slotHits) delete slots[hit.slotKey];
			if (Object.keys(slots).length === 0 && nextPlugins) delete nextPlugins.slots;
		}
	}
	const channelIds = hits.filter((hit) => hit.surface === "channel").map((hit) => hit.pluginId);
	if (channelIds.length > 0) removeDanglingChannelReferences(next, channelIds);
	const changes = [];
	if (allowIds.length > 0) changes.push(`- plugins.allow: removed ${allowIds.length} stale plugin id${allowIds.length === 1 ? "" : "s"} (${allowIds.join(", ")})`);
	if (denyIds.length > 0) changes.push(`- plugins.deny: removed ${denyIds.length} stale plugin id${denyIds.length === 1 ? "" : "s"} (${denyIds.join(", ")})`);
	if (entryIds.length > 0) changes.push(`- plugins.entries: removed ${entryIds.length} stale plugin entr${entryIds.length === 1 ? "y" : "ies"} (${entryIds.join(", ")})`);
	if (slotHits.length > 0) changes.push(`- plugins.slots: reset ${slotHits.length} stale plugin slot${slotHits.length === 1 ? "" : "s"} (${slotHits.map((hit) => `${hit.slotKey}: ${hit.pluginId} -> ${defaultSlotIdForKey(hit.slotKey)}`).join(", ")})`);
	if (channelIds.length > 0) {
		changes.push(`- channels: removed ${channelIds.length} stale channel config${channelIds.length === 1 ? "" : "s"} (${channelIds.join(", ")})`);
		const heartbeatCount = hits.filter((hit) => hit.surface === "heartbeat").length;
		const heartbeatIds = [...new Set(hits.filter((hit) => hit.surface === "heartbeat").map((hit) => hit.pluginId))];
		if (heartbeatCount > 0) changes.push(`- agents heartbeat: removed ${heartbeatCount} stale heartbeat target${heartbeatCount === 1 ? "" : "s"} (${heartbeatIds.join(", ")})`);
		const modelByChannelCount = hits.filter((hit) => hit.surface === "modelByChannel").length;
		const modelByChannelIds = [...new Set(hits.filter((hit) => hit.surface === "modelByChannel").map((hit) => hit.pluginId))];
		if (modelByChannelCount > 0) changes.push(`- channels.modelByChannel: removed ${modelByChannelCount} stale channel model override${modelByChannelCount === 1 ? "" : "s"} (${modelByChannelIds.join(", ")})`);
	}
	return {
		config: next,
		changes
	};
}
function removeDanglingChannelReferences(config, channelIds) {
	const staleChannelIds = new Set(channelIds.map((channelId) => normalizePluginId(channelId)));
	const channels = asNullableRecord(config.channels);
	if (channels) {
		for (const channelId of Object.keys(channels)) {
			if (CHANNEL_CONFIG_META_KEYS.has(channelId)) continue;
			if (staleChannelIds.has(normalizePluginId(channelId))) delete channels[channelId];
		}
		const modelByChannel = asNullableRecord(channels.modelByChannel);
		if (modelByChannel) {
			for (const [providerId, channelMap] of Object.entries(modelByChannel)) {
				const channelsForProvider = asNullableRecord(channelMap);
				if (!channelsForProvider) continue;
				for (const channelId of Object.keys(channelsForProvider)) if (staleChannelIds.has(normalizePluginId(channelId))) delete channelsForProvider[channelId];
				if (Object.keys(channelsForProvider).length === 0) delete modelByChannel[providerId];
			}
			if (Object.keys(modelByChannel).length === 0) delete channels.modelByChannel;
		}
	}
	const defaultsHeartbeat = config.agents?.defaults?.heartbeat;
	if (defaultsHeartbeat && typeof defaultsHeartbeat.target === "string" && staleChannelIds.has(normalizePluginId(defaultsHeartbeat.target))) delete defaultsHeartbeat.target;
	for (const { agent } of listMutableCodexRouteAgentEntries(config)) {
		const heartbeat = asNullableRecord(agent.heartbeat);
		if (heartbeat && typeof heartbeat.target === "string" && staleChannelIds.has(normalizePluginId(heartbeat.target))) delete heartbeat.target;
	}
}
//#endregion
export { scanStalePluginConfig as i, isStalePluginAutoRepairBlocked as n, maybeRepairStalePluginConfig as r, collectStalePluginConfigWarnings as t };
