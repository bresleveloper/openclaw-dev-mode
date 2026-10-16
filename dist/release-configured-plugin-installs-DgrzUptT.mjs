import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { p as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-BClSJ17n.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { S as resolveOfficialExternalWebProviderContractPluginIdsForEnv, r as getOfficialExternalPluginCatalogEntry, y as resolveOfficialExternalProviderContractPluginIds } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { u as createDeferredConfiguredPluginRepairDoctorResult } from "./update-doctor-result-yVslo54h.mjs";
import "./registry-B3Y-vjit.mjs";
import { n as resolveWebSearchInstallCatalogEntriesForEnv, r as resolveWebSearchInstallCatalogEntry } from "./web-search-install-catalog-vFKiQH3N.mjs";
import { t as isChannelConfigured } from "./channel-configured-CfgGCCVe.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-CnGRVnDe.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-xpTG2Ioj.mjs";
import { r as detectPluginAutoEnableCandidates } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-Ce74V-mJ.mjs";
import { i as collectBlockedPluginIds, s as collectConfiguredProviderPluginIds } from "./missing-configured-plugin-install.candidates-D7iuBJnY.mjs";
import { n as repairMissingPluginInstallsForIds } from "./missing-configured-plugin-install-QCpRdNk7.mjs";
//#region src/commands/doctor/shared/release-configured-plugin-installs.ts
const CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION = "2026.5.2-beta.1";
const AGENT_HARNESS_RUNTIME_PLUGIN_IDS = { codex: "codex" };
function isDenied(cfg, pluginId) {
	const deny = cfg.plugins?.deny;
	return Array.isArray(deny) && deny.includes(pluginId);
}
function isPluginEntryDisabled(cfg, pluginId) {
	return cfg.plugins?.entries?.[pluginId]?.enabled === false;
}
function isChannelDisabled(cfg, channelId) {
	const channels = asNullableRecord(cfg.channels);
	return asNullableRecord(channels?.[channelId])?.enabled === false;
}
function isDisabled(cfg, pluginId) {
	if (isPluginEntryDisabled(cfg, pluginId)) return true;
	const channelId = normalizeChatChannelId(pluginId);
	return channelId ? isChannelDisabled(cfg, channelId) : false;
}
function hasMaterialPluginEntry(entry) {
	const record = asNullableRecord(entry);
	if (!record) return false;
	return record.enabled === true || asNullableRecord(record.config) !== null || asNullableRecord(record.hooks) !== null || asNullableRecord(record.subagent) !== null || record.apiKey !== void 0 || record.env !== void 0;
}
function collectMaterialPluginEntryIds(cfg) {
	const entries = asNullableRecord(cfg.plugins?.entries);
	if (!entries) return [];
	return Object.entries(entries).filter(([pluginId, entry]) => !isNativeSessionCatalogOptOutOnly(pluginId, entry) && hasMaterialPluginEntry(entry)).map(([pluginId]) => pluginId.trim()).filter((pluginId) => pluginId);
}
function collectSlotPluginIds(cfg) {
	const slots = asNullableRecord(cfg.plugins?.slots);
	return ["memory", "contextEngine"].map((key) => normalizeNullableString(slots?.[key])).filter((pluginId) => typeof pluginId === "string" && pluginId.toLowerCase() !== "none");
}
function collectConfiguredChannelIds(cfg, env) {
	return listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "enabled-or-meaningful",
		env,
		skipWhenPluginsDisabled: true,
		excludeExplicitlyDisabled: true,
		mapEnvironmentChannelId: (channelId) => normalizeChatChannelId(channelId) ?? channelId,
		environmentChannelIsConfigured: (channelId) => !isChannelDisabled(cfg, channelId) && isChannelConfigured(cfg, channelId, env),
		sort: "locale"
	});
}
function collectAgentHarnessRuntimePluginIds(cfg) {
	return collectConfiguredAgentHarnessRuntimes(cfg).map((runtime) => AGENT_HARNESS_RUNTIME_PLUGIN_IDS[runtime]).filter((pluginId) => Boolean(pluginId)).toSorted((left, right) => left.localeCompare(right));
}
function collectWebSearchPluginIds(cfg, env) {
	if (cfg.tools?.web?.search?.enabled === false) return [];
	const providerId = cfg.tools?.web?.search?.provider;
	const entry = typeof providerId === "string" ? resolveWebSearchInstallCatalogEntry({ providerId }) : void 0;
	return [...entry?.pluginId ? [entry.pluginId] : [], ...resolveWebSearchInstallCatalogEntriesForEnv(env).map((candidate) => candidate.pluginId)];
}
function collectWebFetchPluginIds(cfg, env) {
	const webFetch = cfg.tools?.web?.fetch;
	if (webFetch?.enabled === false) return [];
	const providerId = normalizeNullableString(webFetch?.provider)?.toLowerCase();
	return [...providerId ? resolveOfficialExternalProviderContractPluginIds({
		contract: "webFetchProviders",
		providerIds: /* @__PURE__ */ new Set([providerId])
	}) : [], ...resolveOfficialExternalWebProviderContractPluginIdsForEnv({
		contract: "webFetchProviders",
		env
	})];
}
function collectSpeechPluginIds(cfg) {
	return resolveOfficialExternalProviderContractPluginIds({
		contract: "speechProviders",
		providerIds: collectConfiguredSpeechProviderIds(cfg)
	});
}
function collectAcpRuntimePluginIds(cfg) {
	const acp = asNullableRecord(cfg.acp);
	if (!acp) return [];
	const backend = normalizeNullableString(acp.backend)?.toLowerCase() ?? "";
	if (!(acp.enabled === true || asNullableRecord(acp.dispatch)?.enabled === true || backend === "acpx") || backend && backend !== "acpx") return [];
	return ["acpx"];
}
function collectAllowOnlyOfficialPluginIds(cfg) {
	const allow = cfg.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0) return [];
	const materialEntryIds = new Set(collectMaterialPluginEntryIds(cfg).map((id) => id.toLowerCase()));
	const ids = [];
	for (const rawPluginId of allow) {
		const pluginId = normalizeNullableString(rawPluginId);
		if (!pluginId || materialEntryIds.has(pluginId.toLowerCase())) continue;
		if (getOfficialExternalPluginCatalogEntry(pluginId)) ids.push(pluginId);
	}
	return ids;
}
function addEligiblePluginId(cfg, pluginIds, pluginId) {
	const normalized = pluginId.trim();
	if (!normalized || isDenied(cfg, normalized) || isDisabled(cfg, normalized)) return;
	pluginIds.add(normalized);
}
/** Return true when this config has not yet crossed the configured-plugin install release gate. */
function shouldRunConfiguredPluginInstallReleaseStep(params) {
	const releaseVersion = params.releaseVersion ?? CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION;
	const currentComparedToRelease = compareOpenClawVersions(params.currentVersion ?? VERSION, releaseVersion);
	if (currentComparedToRelease === null || currentComparedToRelease < 0) return false;
	const touchedComparedToRelease = compareOpenClawVersions(params.touchedVersion, releaseVersion);
	return touchedComparedToRelease === null || touchedComparedToRelease < 0;
}
/** Collect plugin/channel ids implied by config for the release install backfill step. */
function collectReleaseConfiguredPluginIds(params) {
	const env = params.env ?? process.env;
	const pluginIds = /* @__PURE__ */ new Set();
	const channelIds = /* @__PURE__ */ new Set();
	if (params.cfg.plugins?.enabled === false) return {
		pluginIds: [],
		channelIds: []
	};
	for (const candidate of detectPluginAutoEnableCandidates({
		config: params.cfg,
		env
	})) addEligiblePluginId(params.cfg, pluginIds, candidate.pluginId);
	for (const pluginId of [
		...collectMaterialPluginEntryIds(params.cfg),
		...collectSlotPluginIds(params.cfg),
		...collectConfiguredProviderPluginIds({
			cfg: params.cfg,
			env
		}),
		...collectAgentHarnessRuntimePluginIds(params.cfg),
		...collectWebSearchPluginIds(params.cfg, env),
		...collectWebFetchPluginIds(params.cfg, env),
		...collectSpeechPluginIds(params.cfg),
		...collectAcpRuntimePluginIds(params.cfg),
		...collectAllowOnlyOfficialPluginIds(params.cfg)
	]) addEligiblePluginId(params.cfg, pluginIds, pluginId);
	for (const channelId of collectConfiguredChannelIds(params.cfg, env)) if (!isChannelDisabled(params.cfg, channelId) && !isDenied(params.cfg, channelId) && !isPluginEntryDisabled(params.cfg, channelId)) channelIds.add(channelId);
	return {
		pluginIds: [...pluginIds].toSorted((left, right) => left.localeCompare(right)),
		channelIds: [...channelIds].toSorted((left, right) => left.localeCompare(right))
	};
}
/** Run the configured-plugin install release backfill when the config still needs it. */
async function maybeRunConfiguredPluginInstallReleaseStep(params) {
	const env = params.env ?? process.env;
	const updateInProgress = shouldDeferConfiguredPluginInstallRepair(env);
	const configured = collectReleaseConfiguredPluginIds({
		cfg: params.cfg,
		env
	});
	const shouldRunReleaseStep = shouldRunConfiguredPluginInstallReleaseStep({
		currentVersion: params.currentVersion,
		touchedVersion: params.touchedVersion
	});
	if (configured.pluginIds.length === 0 && configured.channelIds.length === 0) return {
		changes: [],
		warnings: [],
		completed: shouldRunReleaseStep,
		touchedConfig: false
	};
	const repaired = await repairMissingPluginInstallsForIds({
		cfg: params.cfg,
		pluginIds: configured.pluginIds,
		channelIds: configured.channelIds,
		blockedPluginIds: [...collectBlockedPluginIds(params.cfg)].toSorted((left, right) => left.localeCompare(right)),
		env
	});
	const completed = repaired.warnings.length === 0 && (!shouldRunReleaseStep || !updateInProgress);
	const warnings = [...repaired.warnings, ...repaired.notices ?? []];
	const postInstallDoctorResult = updateInProgress && repaired.warnings.length === 0 && repaired.deferredRepairDetails?.length ? createDeferredConfiguredPluginRepairDoctorResult(repaired.deferredRepairDetails) : void 0;
	return {
		changes: repaired.changes,
		warnings,
		completed,
		touchedConfig: shouldRunReleaseStep && completed,
		...repaired.pluginInventoryChanged ? { pluginInventoryChanged: true } : {},
		...postInstallDoctorResult ? { postInstallDoctorResult } : {}
	};
}
//#endregion
export { maybeRunConfiguredPluginInstallReleaseStep };
