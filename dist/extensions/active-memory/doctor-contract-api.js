import { r as asNullableRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../runtime-doctor-migrations-4UZBewWQ.mjs";
/** Retired Active Memory QMD override detected before strict manifest validation. */
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"active-memory",
		"config",
		"qmd"
	],
	message: "plugins.entries.active-memory.config.qmd is retired because the QMD memory backend was removed. Run \"openclaw doctor --fix\"."
}];
/** Removes the retired plugin-owned QMD override. */
function normalizeCompatibilityConfig({ cfg }) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["active-memory"]);
	const pluginConfig = asNullableRecord(entry?.config);
	if (!pluginConfig || !Object.hasOwn(pluginConfig, "qmd")) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextEntry = asNullableRecord(nextConfig.plugins?.entries?.["active-memory"]);
	const nextPluginConfig = asNullableRecord(nextEntry?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	delete nextPluginConfig.qmd;
	return {
		config: nextConfig,
		changes: ["Removed retired Active Memory QMD search-mode configuration."]
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
