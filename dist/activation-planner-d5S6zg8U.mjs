import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { p as normalizePluginIdScope, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as passesManifestOwnerBasePolicy, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BDlJJbko.mjs";
//#region src/plugins/activation-planner.ts
/** Computes which manifest-owned plugins need activation for commands, routes, providers, or capabilities. */
/** Returns a deterministic activation plan without importing plugin runtime modules. */
function resolveManifestActivationPlan(params) {
	const entries = [];
	const { pluginIds, diagnostics } = collectManifestActivationMatches(params, entries);
	return {
		trigger: params.trigger,
		pluginIds,
		entries,
		diagnostics
	};
}
/** Selects plugin ids without materializing diagnostic reasons or plan entries. */
function resolveManifestActivationPluginIds(params) {
	return collectManifestActivationMatches(params).pluginIds;
}
function collectManifestActivationMatches(params, entries) {
	const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
	const registry = params.manifestRecords ? {
		plugins: params.manifestRecords,
		diagnostics: []
	} : loadPluginManifestRegistryForPluginRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: true
	});
	if (registry.plugins.length === 0 || onlyPluginIdSet?.size === 0) return {
		pluginIds: [],
		diagnostics: registry.diagnostics
	};
	const normalizedConfig = params.normalizedConfig ?? normalizePluginsConfig(params.config?.plugins);
	const expected = normalizeActivationTrigger(params.trigger);
	const matchedIds = [];
	for (const plugin of registry.plugins) {
		if (params.origin && plugin.origin !== params.origin) continue;
		if (onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id)) continue;
		if (!passesManifestOwnerBasePolicy({
			plugin,
			normalizedConfig,
			allowRestrictiveAllowlistBypass: params.allowRestrictiveAllowlistBypass
		})) continue;
		if (params.requireExplicitManifestOwnerTrust && !hasExplicitActivationPlannerManifestOwnerTrust({
			plugin,
			normalizedConfig
		})) continue;
		const reasons = entries ? [] : void 0;
		if (matchesActivation(plugin, params.trigger, expected, reasons)) matchedIds.push(plugin.id);
		if (reasons?.length) entries?.push({
			pluginId: plugin.id,
			origin: plugin.origin,
			reasons
		});
	}
	if (entries) entries.sort((left, right) => left.pluginId.localeCompare(right.pluginId));
	return {
		pluginIds: uniqueStrings(entries ? entries.map((entry) => entry.pluginId) : matchedIds.toSorted((left, right) => left.localeCompare(right))),
		diagnostics: registry.diagnostics
	};
}
function hasExplicitActivationPlannerManifestOwnerTrust(params) {
	return isBundledManifestOwner(params.plugin) || params.plugin.origin === "config" || hasExplicitManifestOwnerTrust({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig
	});
}
function matchesActivation(plugin, trigger, expected, reasons) {
	const record = (condition, reason) => {
		if (!condition) return false;
		if (!reasons) return true;
		reasons.push(reason);
		return false;
	};
	const { activation } = plugin;
	const capability = trigger.kind === "capability" ? trigger.capability : void 0;
	if (capability && record(activation?.onCapabilities?.includes(capability), "activation-capability-hint")) return true;
	const owns = (values, normalize) => capability ? values?.length : listHasNormalizedValue(values, expected, normalize);
	switch (trigger.kind === "capability" ? trigger.capability : trigger.kind) {
		case "command": return record(listHasNormalizedValue(activation?.onCommands, expected, normalizeLowercaseStringOrEmpty), "activation-command-hint") || record(plugin.cliCommands?.some((entry) => normalizeLowercaseStringOrEmpty(entry.name) === expected), "manifest-cli-command-owner") || record(plugin.commandAliases?.some((alias) => normalizeLowercaseStringOrEmpty(alias.cliCommand ?? alias.name) === expected), "manifest-command-alias");
		case "provider": return record(owns(activation?.onProviders, normalizeProviderId), "activation-provider-hint") || record(owns(plugin.providers, normalizeProviderId), "manifest-provider-owner") || record(capability ? plugin.setup?.providers?.length : plugin.setup?.providers?.some((entry) => normalizeProviderId(entry.id) === expected), "manifest-setup-provider-owner");
		case "agentHarness": return record(listHasNormalizedValue(activation?.onAgentHarnesses, expected, normalizeLowercaseStringOrEmpty), "activation-agent-harness-hint");
		case "channel": return record(owns(activation?.onChannels, normalizeLowercaseStringOrEmpty), "activation-channel-hint") || record(owns(plugin.channels, normalizeLowercaseStringOrEmpty), "manifest-channel-owner");
		case "route": return record(listHasNormalizedValue(activation?.onRoutes, expected, normalizeLowercaseStringOrEmpty), "activation-route-hint");
		case "tool": return record(plugin.contracts?.tools?.length, "manifest-tool-contract");
		case "hook": return record(plugin.hooks?.length, "manifest-hook-owner");
	}
	return false;
}
function normalizeActivationTrigger(trigger) {
	switch (trigger.kind) {
		case "command": return normalizeLowercaseStringOrEmpty(trigger.command);
		case "provider": return normalizeProviderId(trigger.provider);
		case "agentHarness": return normalizeLowercaseStringOrEmpty(trigger.runtime);
		case "channel": return normalizeLowercaseStringOrEmpty(trigger.channel);
		case "route": return normalizeLowercaseStringOrEmpty(trigger.route);
		case "capability": return trigger.capability;
	}
	return trigger;
}
function listHasNormalizedValue(values, expected, normalize) {
	return values?.some((value) => normalize(value) === expected) ?? false;
}
//#endregion
export { resolveManifestActivationPluginIds as n, resolveManifestActivationPlan as t };
