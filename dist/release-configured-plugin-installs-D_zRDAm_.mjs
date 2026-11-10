import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./registry-DqsL4UWB.mjs";
import { r as getOfficialExternalPluginCatalogEntry, y as resolveOfficialExternalProviderContractPluginIds } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { t as isChannelConfigured } from "./channel-configured-HzkjFZmD.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { d as createDeferredConfiguredPluginRepairDoctorResult } from "./update-doctor-result-oZ38327j.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-C-QBCzx4.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-GphgdX8d.mjs";
import { r as detectPluginAutoEnableCandidates } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { h as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-M5rvMZiC.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-C-CNDuxu.mjs";
import { c as collectConfiguredWebFetchPluginIds, i as collectBlockedPluginIds, l as collectConfiguredWebSearchPluginIds, s as collectConfiguredProviderPluginIds } from "./missing-configured-plugin-install.candidates-DbdIQ2RX.mjs";
import { t as acpxRuntimeIsConfigured } from "./configured-runtime-plugin-installs-TrRMdwmt.mjs";
import { n as repairMissingPluginInstallsForIds } from "./missing-configured-plugin-install-lupDczXs.mjs";
//#region src/commands/doctor/shared/release-configured-plugin-installs.ts
const CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION = "2026.5.2-beta.1";
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
	return Object.entries(asNullableRecord(cfg.plugins?.entries) ?? {}).filter(([pluginId, entry]) => !isNativeSessionCatalogOptOutOnly(pluginId, entry) && hasMaterialPluginEntry(entry)).map(([pluginId]) => pluginId.trim()).filter((pluginId) => pluginId);
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
	const currentComparedToRelease = compareOpenClawVersions(params.currentVersion ?? VERSION, CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION);
	if (currentComparedToRelease === null || currentComparedToRelease < 0) return false;
	const touchedComparedToRelease = compareOpenClawVersions(params.touchedVersion, CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION);
	return touchedComparedToRelease === null || touchedComparedToRelease < 0;
}
/** Collect plugin/channel ids implied by config for the release install backfill step. */
function collectReleaseConfiguredPluginIds(params) {
	const env = params.env ?? process.env;
	const pluginIds = /* @__PURE__ */ new Set();
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
		...collectConfiguredAgentHarnessRuntimes(params.cfg).filter((id) => id === "codex"),
		...collectConfiguredWebSearchPluginIds(params.cfg, env, "backfill"),
		...collectConfiguredWebFetchPluginIds(params.cfg, env),
		...resolveOfficialExternalProviderContractPluginIds({
			contract: "speechProviders",
			providerIds: collectConfiguredSpeechProviderIds(params.cfg)
		}),
		...acpxRuntimeIsConfigured(params.cfg) ? ["acpx"] : [],
		...collectAllowOnlyOfficialPluginIds(params.cfg)
	]) addEligiblePluginId(params.cfg, pluginIds, pluginId);
	const channelIds = collectConfiguredChannelIds(params.cfg, env).filter((channelId) => !isChannelDisabled(params.cfg, channelId) && !isDenied(params.cfg, channelId) && !isPluginEntryDisabled(params.cfg, channelId));
	return {
		pluginIds: [...pluginIds].toSorted((left, right) => left.localeCompare(right)),
		channelIds
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
