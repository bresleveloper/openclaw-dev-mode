import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { m as resolveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CYadf-lt.mjs";
import "./shared-BVDjoVcf.mjs";
import { n as collectCanonicalSecretInputAssignment } from "./runtime-shared-DqMZ_k3n.mjs";
import { t as resolvePluginConfigContractsById } from "./config-contracts-DRulo8kM.mjs";
//#region src/secrets/runtime-config-collectors-plugins.ts
/**
* Walk manifest-declared plugin config SecretRef surfaces and collect
* assignments for runtime materialization. Plugin-owned metadata controls which
* config paths support SecretRefs and whether bundled plugins stay inactive on
* that surface until explicitly enabled.
*
* When `loadablePluginOrigins` is provided, entries whose ID is not in the map
* are treated as inactive (stale config entries for plugins that are no longer
* installed). This prevents resolution failures for SecretRefs belonging to
* non-loadable plugins from blocking startup or preflight validation.
*/
function collectPluginConfigAssignments(params) {
	const entries = params.config.plugins?.entries;
	if (!isRecord(entries) || Object.keys(entries).length === 0) return;
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const manifestRegistry = params.context.manifestRegistry ?? resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.context.env
	});
	const bundledLoadablePluginIds = params.context.manifestRegistry ? [] : [...params.loadablePluginOrigins?.entries() ?? []].filter(([, origin]) => origin === "bundled").map(([pluginId]) => pluginId);
	const pluginContracts = resolvePluginConfigContractsById({
		config: params.config,
		env: params.context.env,
		fallbackToBundledMetadata: true,
		fallbackToBundledMetadataForResolvedBundled: !params.context.manifestRegistry,
		fallbackBundledPluginIds: bundledLoadablePluginIds,
		pluginIds: Object.keys(entries),
		manifestRegistry
	});
	for (const [pluginId, entry] of Object.entries(entries)) {
		const metadata = pluginContracts.get(pluginId);
		if (!metadata?.configContracts.secretInputs?.paths.length) continue;
		const secretInputs = metadata.configContracts.secretInputs;
		if (!isRecord(entry)) continue;
		const pluginConfig = entry.config;
		if (!isRecord(pluginConfig)) continue;
		const pluginOrigin = params.loadablePluginOrigins?.get(pluginId);
		const resolvedOrigin = pluginOrigin ?? metadata.origin;
		const enableState = params.loadablePluginOrigins && !pluginOrigin ? {
			enabled: false,
			reason: "plugin is not loadable (stale config entry)."
		} : resolveEnableState(pluginId, resolvedOrigin, normalizedConfig, resolvedOrigin === "bundled" ? secretInputs.bundledDefaultEnabled : void 0);
		const inactiveReason = enableState.reason ?? "plugin is disabled.";
		const pluginConfigPath = formatConcreteConfigPath([
			"plugins",
			"entries",
			pluginId,
			"config"
		]);
		const seenPaths = /* @__PURE__ */ new Set();
		for (const secretPath of secretInputs.paths) for (const match of collectPluginConfigContractMatches({
			root: pluginConfig,
			pathPattern: secretPath.path
		})) {
			const fullPath = `${pluginConfigPath}${match.path.startsWith("[") ? match.path : `.${match.path}`}`;
			if (seenPaths.has(fullPath)) continue;
			seenPaths.add(fullPath);
			const ownerContract = secretPath.ownerKind === "route" ? pluginConfig : void 0;
			collectCanonicalSecretInputAssignment({
				value: match.value,
				path: fullPath,
				expected: secretPath.expected ?? "string",
				defaults: params.defaults,
				context: params.context,
				active: enableState.enabled,
				inactiveReason: `plugin "${pluginId}": ${inactiveReason}`,
				...secretPath.ownerKind ? { owner: {
					ownerKind: secretPath.ownerKind,
					ownerId: fullPath,
					requiredForGateway: false,
					disposition: "isolate",
					...ownerContract ? { contract: ownerContract } : {}
				} } : {},
				apply: (value) => {
					Reflect.set(match.parent, match.key, value);
				}
			});
		}
	}
}
//#endregion
export { collectPluginConfigAssignments as t };
