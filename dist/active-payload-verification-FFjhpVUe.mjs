import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { a as createPluginInstallRecordMap, d as setPluginInstallRecordMapEntry } from "./installed-plugin-index-row-B-2QiBMA.mjs";
import { o as resolveTrustedSourceLinkedOfficialClawHubInstall, s as resolveTrustedSourceLinkedOfficialNpmInstall } from "./official-external-install-records-DU-ANq4S.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-R9aCxQcY.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-CSOJ6Jwe.mjs";
import { r as runPluginPayloadSmokeCheck } from "./payload-verification-B5DHkUNO.mjs";
//#region src/plugins/active-payload-verification.ts
/** Runs the static payload check without repair, installs, or network access. */
async function runActivePluginPayloadSmokeCheck(params) {
	return await runPluginPayloadSmokeCheck({
		records: filterRecordsToActive(params),
		env: params.env
	});
}
/** Selects the installed records covered by update/startup payload verification. */
function filterRecordsToActive(params) {
	const env = params.env ?? process.env;
	const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
	const ownership = params.cfg.plugins?.load?.paths?.length ? createInstalledPluginOwnershipResolver(loadInstalledPluginIndex({
		config: params.cfg,
		installRecords: params.records,
		env
	}), env) : void 0;
	const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
		config: params.cfg,
		installRecords: params.records,
		env
	});
	const filtered = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(params.records)) {
		if (!record || typeof record !== "object") continue;
		const update = ownership?.resolveUpdate(pluginId);
		if (sourceBundledIds.has(pluginId) || update?.ok && update.value.kind === "operator-managed") continue;
		if (resolveEffectiveEnableState({
			id: pluginId,
			origin: "global",
			config: normalizedPluginConfig,
			rootConfig: params.cfg
		}).enabled) {
			setPluginInstallRecordMapEntry(filtered, pluginId, record);
			continue;
		}
		const officialNpm = resolveTrustedSourceLinkedOfficialNpmInstall({
			pluginId,
			record
		})?.npmSpec;
		const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		})?.clawhubSpec;
		if (officialNpm || officialClawHub) setPluginInstallRecordMapEntry(filtered, pluginId, record);
	}
	return filtered;
}
//#endregion
export { runActivePluginPayloadSmokeCheck as n, filterRecordsToActive as t };
