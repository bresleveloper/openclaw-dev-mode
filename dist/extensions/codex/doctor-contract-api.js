//#region extensions/codex/doctor-contract-api.ts
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function hasRetiredDynamicToolsProfile(value) {
	return Object.hasOwn(asRecord(value) ?? {}, "codexDynamicToolsProfile");
}
function hasLegacyPluginDestructivePolicy(value) {
	const codexPlugins = asRecord(value);
	if (!codexPlugins) return false;
	if (codexPlugins.allow_destructive_actions === "on-request") return true;
	const plugins = asRecord(codexPlugins.plugins);
	return Object.values(plugins ?? {}).some((plugin) => asRecord(plugin)?.allow_destructive_actions === "on-request");
}
/** Legacy Codex config keys that doctor should report or repair. */
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"codex",
		"config"
	],
	message: "plugins.entries.codex.config.codexDynamicToolsProfile is retired; Codex app-server always keeps Codex-native workspace tools native. Run \"openclaw doctor --fix\".",
	match: hasRetiredDynamicToolsProfile
}, {
	path: [
		"plugins",
		"entries",
		"codex",
		"config",
		"codexPlugins"
	],
	message: "plugins.entries.codex.config.codexPlugins.allow_destructive_actions=\"on-request\" was renamed to \"auto\". Run \"openclaw doctor --fix\".",
	match: hasLegacyPluginDestructivePolicy
}];
/**
* Removes retired Codex plugin config keys while preserving unrelated config.
*/
function normalizeCompatibilityConfig({ cfg }) {
	const rawPluginConfig = asRecord(asRecord(cfg.plugins?.entries?.codex)?.config);
	const rawCodexPlugins = asRecord(rawPluginConfig?.codexPlugins);
	const shouldRemoveDynamicToolsProfile = rawPluginConfig !== null && hasRetiredDynamicToolsProfile(rawPluginConfig);
	const shouldRewriteDestructivePolicy = hasLegacyPluginDestructivePolicy(rawCodexPlugins);
	if (!rawPluginConfig || !shouldRemoveDynamicToolsProfile && !shouldRewriteDestructivePolicy) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextPluginConfig = asRecord(asRecord(asRecord(asRecord(nextConfig.plugins)?.entries)?.codex)?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	if (shouldRemoveDynamicToolsProfile) {
		delete nextPluginConfig.codexDynamicToolsProfile;
		changes.push("Removed retired plugins.entries.codex.config.codexDynamicToolsProfile; Codex app-server always keeps Codex-native workspace tools native.");
	}
	if (shouldRewriteDestructivePolicy) {
		const nextCodexPlugins = asRecord(nextPluginConfig.codexPlugins);
		if (nextCodexPlugins?.allow_destructive_actions === "on-request") nextCodexPlugins.allow_destructive_actions = "auto";
		const nextPluginPolicies = asRecord(nextCodexPlugins?.plugins);
		for (const plugin of Object.values(nextPluginPolicies ?? {})) {
			const nextPlugin = asRecord(plugin);
			if (nextPlugin?.allow_destructive_actions === "on-request") nextPlugin.allow_destructive_actions = "auto";
		}
		changes.push("Renamed plugins.entries.codex.config.codexPlugins allow_destructive_actions=\"on-request\" values to \"auto\".");
	}
	return {
		config: nextConfig,
		changes
	};
}
/** Session/auth ownership metadata used by doctor route-state checks. */
const sessionRouteStateOwners = [{
	id: "codex",
	label: "Codex",
	providerIds: [
		"codex",
		"codex-cli",
		"openai-codex"
	],
	runtimeIds: ["codex", "codex-cli"],
	cliSessionKeys: ["codex-cli"],
	authProfilePrefixes: [
		"codex:",
		"codex-cli:",
		"openai-codex:"
	]
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, sessionRouteStateOwners };
