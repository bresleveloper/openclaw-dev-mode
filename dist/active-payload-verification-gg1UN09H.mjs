import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { c as createPluginInstallRecordMap, m as setPluginInstallRecordMapEntry } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { l as resolveTrustedSourceLinkedOfficialNpmSpec, s as resolveTrustedSourceLinkedOfficialClawHubSpec } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-Bi9l5Ik4.mjs";
import { r as runPluginPayloadSmokeCheck } from "./payload-verification-DlThdi1u.mjs";
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
		const officialNpm = resolveTrustedSourceLinkedOfficialNpmSpec({
			pluginId,
			record
		});
		const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubSpec({
			pluginId,
			record
		});
		if (officialNpm || officialClawHub) setPluginInstallRecordMapEntry(filtered, pluginId, record);
	}
	return filtered;
}
//#endregion
export { runActivePluginPayloadSmokeCheck as n, filterRecordsToActive as t };
