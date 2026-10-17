import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-oun7SC3h.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-DW81XCVx.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-xpTG2Ioj.mjs";
import { r as collectConfiguredProviderSelectionIds } from "./configured-provider-selection-ids-B-bg2QOn.mjs";
import { t as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-3FM01Txu.mjs";
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
/** Resolves one exact bundled id without scanning or materializing the full plugin catalog. */
function inspectBundledPluginStartupMetadata(params) {
	const bundledPluginsDir = resolveBundledPluginsDir(params.env);
	if (!bundledPluginsDir) return;
	const rootDir = path.join(bundledPluginsDir, params.pluginId);
	const manifest = tryReadJsonSync(path.join(rootDir, "openclaw.plugin.json"));
	if (!isRecord(manifest) || manifest.id !== params.pluginId) return;
	return { hasDoctorContract: hasDoctorContractArtifact(rootDir) };
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
	const webFetchProviderId = normalizeOptionalLowercaseString(config.tools?.web?.fetch?.provider);
	return hasOfficialExternalContractTarget({
		contract: "embeddingProviders",
		providerIds: collectConfiguredMemoryEmbeddingProviderIds(config)
	}) || hasOfficialExternalContractTarget({
		contract: "speechProviders",
		providerIds: collectConfiguredSpeechProviderIds(config)
	}) || Boolean(webFetchProviderId && hasOfficialExternalContractTarget({
		contract: "webFetchProviders",
		providerIds: /* @__PURE__ */ new Set([webFetchProviderId])
	})) || hasOfficialExternalWebContractEnvTarget({
		contract: "webFetchProviders",
		env
	});
}
/** True when config or environment state can require a missing managed plugin repair. */
function configMayRequireStartupPluginConvergence(params) {
	if (params.config.plugins?.enabled === false) return false;
	const webSearchProvider = params.config.tools?.web?.search?.provider;
	return hasPotentialPluginConfig(params.config, params.env) || collectConfiguredRuntimeIds(params.config).length > 0 || hasOfficialExternalProviderTarget({
		providerIds: collectConfiguredProviderSelectionIds(params.config),
		env: params.env
	}) || hasOfficialExternalChannelTarget(params) || params.config.tools?.web?.search?.enabled !== false && hasOfficialExternalWebSearchTarget({
		providerId: typeof webSearchProvider === "string" ? webSearchProvider : void 0,
		env: params.env
	}) || hasConfiguredCapabilityPlugin(params.config, params.env);
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
export { configMayRequireStartupPluginConvergence, planStartupPluginConvergence };
