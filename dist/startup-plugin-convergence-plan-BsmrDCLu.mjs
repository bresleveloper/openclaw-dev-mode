import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-COfUtw4c.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-CcgUkcEv.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-CXRk02Zm.mjs";
import { i as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-DW1vCQmx.mjs";
import { r as collectConfiguredProviderSelectionIds } from "./configured-provider-selection-ids-2ML-_-_L.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/bundled-plugin-startup-metadata.ts
const DOCTOR_CONTRACT_BASENAMES = ["doctor-contract-api", "contract-api"];
const MODULE_EXTENSIONS = [
	"js",
	"cjs",
	"mjs",
	"ts",
	"cts",
	"mts"
];
function hasDoctorContractArtifact(pluginRoot) {
	return [pluginRoot, path.join(pluginRoot, "dist")].some((root) => DOCTOR_CONTRACT_BASENAMES.some((basename) => MODULE_EXTENSIONS.some((extension) => fs.existsSync(path.join(root, `${basename}.${extension}`)))));
}
/** Inspects one manifest-owned plugin root without loading its runtime or doctor contract. */
function inspectPluginStartupMetadata(params) {
	const manifest = tryReadJsonSync(path.join(params.rootDir, "openclaw.plugin.json"));
	if (!isRecord(manifest) || manifest.id !== params.pluginId) return;
	return { hasDoctorContract: hasDoctorContractArtifact(params.rootDir) };
}
/** Resolves one exact bundled id without scanning or materializing the full plugin catalog. */
function inspectBundledPluginStartupMetadata(params) {
	const bundledPluginsDir = resolveBundledPluginsDir(params.env);
	if (!bundledPluginsDir) return;
	return inspectPluginStartupMetadata({
		pluginId: params.pluginId,
		rootDir: path.join(bundledPluginsDir, params.pluginId)
	});
}
//#endregion
//#region src/plugins/official-external-plugin-targets.ts
function normalizeIds(values) {
	return new Set([...values].map((value) => normalizeOptionalLowercaseString(value)).filter((value) => Boolean(value)));
}
function envHasAny(env, names) {
	return names?.some((name) => Boolean(env[name]?.trim())) ?? false;
}
function envHasChannelCandidate(env, channel) {
	const allOf = channel?.configuredState?.env?.allOf ?? [];
	const anyOf = channel?.configuredState?.env?.anyOf ?? [];
	return envHasAny(env, [
		...channel?.envVars ?? [],
		...allOf,
		...anyOf
	]);
}
function hasOfficialExternalProviderTarget(params) {
	const providerIds = normalizeIds(params.providerIds);
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.some((entry) => entry.openclaw?.providers?.some((provider) => envHasAny(params.env, provider.envVars) || [provider.id, ...provider.aliases ?? []].some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? providerIds.has(normalized) : false;
	})));
}
function hasOfficialExternalContractTarget(params) {
	const providerIds = normalizeIds(params.providerIds);
	if (providerIds.size === 0) return false;
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.some((entry) => entry.openclaw?.contracts?.[params.contract]?.some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? providerIds.has(normalized) : false;
	}));
}
function hasOfficialExternalWebContractEnvTarget(params) {
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.some((entry) => {
		const manifest = entry.openclaw;
		const contractIds = normalizeIds(manifest?.contracts?.[params.contract] ?? []);
		return manifest?.webSearchProviders?.some((provider) => {
			const providerId = normalizeOptionalLowercaseString(provider.id);
			return Boolean(providerId && contractIds.has(providerId) && envHasAny(params.env, provider.envVars));
		});
	});
}
function hasOfficialExternalChannelTarget(params) {
	const channels = isRecord(params.config.channels) ? params.config.channels : void 0;
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.some((entry) => {
		const channel = entry.openclaw?.channel;
		const channelId = normalizeOptionalLowercaseString(channel?.id);
		if (!channelId) return false;
		const channelConfig = channels?.[channelId];
		return isRecord(channelConfig) && channelConfig.enabled !== false || envHasChannelCandidate(params.env, channel);
	});
}
function hasOfficialExternalWebSearchTarget(params) {
	const configuredId = normalizeOptionalLowercaseString(params.providerId);
	return BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.some((entry) => entry.openclaw?.webSearchProviders?.some((provider) => {
		const providerId = normalizeOptionalLowercaseString(provider.id);
		return configuredId !== void 0 && providerId === configuredId || envHasAny(params.env, provider.envVars);
	}));
}
//#endregion
//#region src/commands/doctor/shared/startup-plugin-convergence-plan.ts
function hasPotentialPluginConfig(config, env) {
	if (config.plugins?.enabled === false) return false;
	const entries = config.plugins?.entries;
	if (!isRecord(entries)) return false;
	return Object.entries(entries).some(([pluginId, entry]) => {
		if (isRecord(entry) && entry.enabled === false || isNativeSessionCatalogOptOutOnly(pluginId, entry)) return false;
		return !inspectBundledPluginStartupMetadata({
			pluginId,
			env
		});
	});
}
function collectConfiguredMemoryEmbeddingProviderIds(config) {
	const providerIds = /* @__PURE__ */ new Set();
	const add = (value) => {
		const providerId = normalizeOptionalLowercaseString(value);
		if (!providerId || providerId === "none" || providerId === "auto") return;
		providerIds.add(providerId);
		const ownerId = resolveConfiguredGenericEmbeddingProviderId(providerId, config);
		if (ownerId) providerIds.add(ownerId);
	};
	const defaults = config.memory?.search;
	if (defaults?.enabled !== false) {
		add(defaults?.provider);
		add(defaults?.fallback);
	}
	for (const agent of listAgentEntries(config)) {
		const override = agent.memory?.search;
		if (override?.enabled === false) continue;
		add(override?.provider ?? defaults?.provider);
		add(override?.fallback ?? defaults?.fallback);
	}
	return providerIds;
}
function hasConfiguredCapabilityPlugin(config, env) {
	const memoryEmbeddingProviderIds = collectConfiguredMemoryEmbeddingProviderIds(config);
	if (memoryEmbeddingProviderIds.size > 0) {
		if (hasOfficialExternalContractTarget({
			contract: "embeddingProviders",
			providerIds: memoryEmbeddingProviderIds
		})) return true;
	}
	if (hasOfficialExternalContractTarget({
		contract: "speechProviders",
		providerIds: collectConfiguredSpeechProviderIds(config)
	})) return true;
	const webFetchProviderId = normalizeOptionalLowercaseString(config.tools?.web?.fetch?.provider);
	if (webFetchProviderId && hasOfficialExternalContractTarget({
		contract: "webFetchProviders",
		providerIds: /* @__PURE__ */ new Set([webFetchProviderId])
	})) return true;
	return hasOfficialExternalWebContractEnvTarget({
		contract: "webFetchProviders",
		env
	});
}
/** True when config or environment state can require a missing managed plugin repair. */
function configMayRequireStartupPluginConvergence(params) {
	if (params.config.plugins?.enabled === false) return false;
	if (hasPotentialPluginConfig(params.config, params.env)) return true;
	if (collectConfiguredRuntimeIds(params.config).length > 0) return true;
	if (hasOfficialExternalProviderTarget({
		providerIds: collectConfiguredProviderSelectionIds(params.config),
		env: params.env
	})) return true;
	if (hasOfficialExternalChannelTarget(params)) return true;
	const webSearchProvider = params.config.tools?.web?.search?.provider;
	if (params.config.tools?.web?.search?.enabled !== false && hasOfficialExternalWebSearchTarget({
		providerId: typeof webSearchProvider === "string" ? webSearchProvider : void 0,
		env: params.env
	})) return true;
	return hasConfiguredCapabilityPlugin(params.config, params.env);
}
/** Carries the canonical install-record snapshot into the expensive convergence pass. */
async function planStartupPluginConvergence(params) {
	const installRecords = await loadInstalledPluginIndexInstallRecords({ env: params.env });
	return {
		required: Object.keys(installRecords).length > 0 || configMayRequireStartupPluginConvergence(params),
		installRecords
	};
}
//#endregion
export { inspectPluginStartupMetadata as i, planStartupPluginConvergence as n, inspectBundledPluginStartupMetadata as r, configMayRequireStartupPluginConvergence as t };
