import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { f as resolveEnableState, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-BX-jIwaa.mjs";
import "./shared-BUXrUFz5.mjs";
import { n as collectRuntimeSecretInputAssignment } from "./runtime-shared-Bpp2PLaL.mjs";
import { t as resolvePluginConfigContractsById } from "./config-contracts-qz7Zs8kR.mjs";
//#region src/secrets/runtime-config-collectors-plugins.ts
/** Collects plugin config secret refs from runtime plugin metadata. */
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
/** Collects SecretRef assignments from plugin-owned config contract paths. */
function collectPluginConfigAssignments(params) {
	const entries = params.config.plugins?.entries;
	if (!isRecord(entries)) return;
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const manifestRegistry = params.context.manifestRegistry ?? resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.context.env
	});
	const bundledLoadablePluginIds = params.context.manifestRegistry ? [] : [...params.loadablePluginOrigins?.entries() ?? []].filter(([, origin]) => origin === "bundled").map(([pluginId]) => pluginId);
	const pluginSecretInputs = new Map([...resolvePluginConfigContractsById({
		config: params.config,
		env: params.context.env,
		fallbackToBundledMetadata: true,
		fallbackToBundledMetadataForResolvedBundled: !params.context.manifestRegistry,
		fallbackBundledPluginIds: bundledLoadablePluginIds,
		pluginIds: Object.keys(entries),
		manifestRegistry
	}).entries()].flatMap(([pluginId, metadata]) => {
		const secretInputs = metadata.configContracts.secretInputs;
		if (!secretInputs?.paths.length) return [];
		return [[pluginId, {
			origin: metadata.origin,
			bundledDefaultEnabled: secretInputs.bundledDefaultEnabled,
			paths: secretInputs.paths
		}]];
	}));
	for (const [pluginId, entry] of Object.entries(entries)) {
		const secretInputs = pluginSecretInputs.get(pluginId);
		if (!secretInputs) continue;
		if (!isRecord(entry)) continue;
		const pluginConfig = entry.config;
		if (!isRecord(pluginConfig)) continue;
		const pluginOrigin = params.loadablePluginOrigins?.get(pluginId);
		if (params.loadablePluginOrigins && !pluginOrigin) {
			collectConfiguredPluginSecretAssignments({
				pluginId,
				pluginConfig,
				secretPaths: secretInputs.paths,
				active: false,
				inactiveReason: "plugin is not loadable (stale config entry).",
				defaults: params.defaults,
				context: params.context
			});
			continue;
		}
		const resolvedOrigin = pluginOrigin ?? secretInputs.origin;
		const enableState = resolveEnableState(pluginId, resolvedOrigin, normalizedConfig, resolvedOrigin === "bundled" ? secretInputs.bundledDefaultEnabled : void 0);
		collectConfiguredPluginSecretAssignments({
			pluginId,
			pluginConfig,
			secretPaths: secretInputs.paths,
			active: enableState.enabled,
			inactiveReason: enableState.reason ?? "plugin is disabled.",
			defaults: params.defaults,
			context: params.context
		});
	}
}
function collectConfiguredPluginSecretAssignments(params) {
	const pluginConfigPath = formatConcreteConfigPath([
		"plugins",
		"entries",
		params.pluginId,
		"config"
	]);
	const seenPaths = /* @__PURE__ */ new Set();
	for (const secretPath of params.secretPaths) for (const match of collectPluginConfigContractMatches({
		root: params.pluginConfig,
		pathPattern: secretPath.path
	})) {
		const fullPath = `${pluginConfigPath}${match.path.startsWith("[") ? match.path : `.${match.path}`}`;
		if (seenPaths.has(fullPath)) continue;
		seenPaths.add(fullPath);
		const ownerContract = secretPath.ownerKind === "route" ? params.pluginConfig : void 0;
		collectRuntimeSecretInputAssignment({
			value: match.value,
			path: fullPath,
			expected: secretPath.expected ?? "string",
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: `plugin "${params.pluginId}": ${params.inactiveReason}`,
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
//#endregion
export { collectPluginConfigAssignments as t };
