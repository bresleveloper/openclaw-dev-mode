import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { p as normalizePluginIdScope, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { i as passesManifestOwnerBasePolicy, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
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
	const rules = params.trigger.kind === "capability" ? CAPABILITY_RULES[params.trigger.capability] : ACTIVATION_RULES[params.trigger.kind];
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
		for (const rule of rules) {
			if (!rule.matches(plugin, expected)) continue;
			if (!reasons) {
				matchedIds.push(plugin.id);
				break;
			}
			reasons.push(rule.reason);
		}
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
const ACTIVATION_RULES = {
	command: [
		{
			reason: "activation-command-hint",
			matches: (plugin, command) => listHasNormalizedValue(plugin.activation?.onCommands, command, normalizeCommandId)
		},
		{
			reason: "manifest-cli-command-owner",
			matches: (plugin, command) => plugin.cliCommands?.some((descriptor) => normalizeCommandId(descriptor.name) === command) ?? false
		},
		{
			reason: "manifest-command-alias",
			matches: (plugin, command) => plugin.commandAliases?.some((alias) => normalizeCommandId(alias.cliCommand ?? alias.name) === command) ?? false
		}
	],
	provider: [
		{
			reason: "activation-provider-hint",
			matches: (plugin, provider) => listHasNormalizedValue(plugin.activation?.onProviders, provider, normalizeProviderId)
		},
		{
			reason: "manifest-provider-owner",
			matches: (plugin, provider) => listHasNormalizedValue(plugin.providers, provider, normalizeProviderId)
		},
		{
			reason: "manifest-setup-provider-owner",
			matches: (plugin, provider) => plugin.setup?.providers?.some((entry) => normalizeProviderId(entry.id) === provider) ?? false
		}
	],
	agentHarness: [{
		reason: "activation-agent-harness-hint",
		matches: (plugin, runtime) => listHasNormalizedValue(plugin.activation?.onAgentHarnesses, runtime, normalizeCommandId)
	}],
	channel: [{
		reason: "activation-channel-hint",
		matches: (plugin, channel) => listHasNormalizedValue(plugin.activation?.onChannels, channel, normalizeCommandId)
	}, {
		reason: "manifest-channel-owner",
		matches: (plugin, channel) => listHasNormalizedValue(plugin.channels, channel, normalizeCommandId)
	}],
	route: [{
		reason: "activation-route-hint",
		matches: (plugin, route) => listHasNormalizedValue(plugin.activation?.onRoutes, route, normalizeCommandId)
	}]
};
const CAPABILITY_RULES = {
	provider: [
		{
			reason: "activation-capability-hint",
			matches: (plugin) => plugin.activation?.onCapabilities?.includes("provider") ?? false
		},
		{
			reason: "activation-provider-hint",
			matches: (plugin) => hasValues(plugin.activation?.onProviders)
		},
		{
			reason: "manifest-provider-owner",
			matches: (plugin) => hasValues(plugin.providers)
		},
		{
			reason: "manifest-setup-provider-owner",
			matches: (plugin) => hasValues(plugin.setup?.providers)
		}
	],
	channel: [
		{
			reason: "activation-capability-hint",
			matches: (plugin) => plugin.activation?.onCapabilities?.includes("channel") ?? false
		},
		{
			reason: "activation-channel-hint",
			matches: (plugin) => hasValues(plugin.activation?.onChannels)
		},
		{
			reason: "manifest-channel-owner",
			matches: (plugin) => hasValues(plugin.channels)
		}
	],
	tool: [{
		reason: "activation-capability-hint",
		matches: (plugin) => plugin.activation?.onCapabilities?.includes("tool") ?? false
	}, {
		reason: "manifest-tool-contract",
		matches: (plugin) => hasValues(plugin.contracts?.tools)
	}],
	hook: [{
		reason: "activation-capability-hint",
		matches: (plugin) => plugin.activation?.onCapabilities?.includes("hook") ?? false
	}, {
		reason: "manifest-hook-owner",
		matches: (plugin) => hasValues(plugin.hooks)
	}]
};
function normalizeActivationTrigger(trigger) {
	switch (trigger.kind) {
		case "command": return normalizeCommandId(trigger.command);
		case "provider": return normalizeProviderId(trigger.provider);
		case "agentHarness": return normalizeCommandId(trigger.runtime);
		case "channel": return normalizeCommandId(trigger.channel);
		case "route": return normalizeCommandId(trigger.route);
		case "capability": return trigger.capability;
	}
	return trigger;
}
function listHasNormalizedValue(values, expected, normalize) {
	return values?.some((value) => normalize(value) === expected) ?? false;
}
function hasValues(values) {
	return (values?.length ?? 0) > 0;
}
function normalizeCommandId(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
export { resolveManifestActivationPluginIds as n, resolveManifestActivationPlan as t };
