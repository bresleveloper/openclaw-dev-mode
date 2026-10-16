import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
//#region src/plugins/doctor-compatibility-migration.ts
/** Selection and order belong to callers; every hook transforms a private candidate. */
function applyPluginDoctorCompatibilitySequence(config, entries) {
	let next = config;
	const changes = [];
	const warnings = [];
	for (const { pluginId, normalizeCompatibilityConfig, transform } of entries) {
		if (!normalizeCompatibilityConfig) continue;
		const candidate = cloneConfigWithResolutionFacts(next);
		try {
			const normalized = normalizeCompatibilityConfig({ cfg: candidate });
			const reported = {
				...normalized,
				config: normalized?.changes.length ? normalized.config : next,
				changes: normalized?.changes ?? []
			};
			const mutation = transform ? transform(reported) : reported;
			if (mutation?.changes.length) {
				next = mutation.config;
				changes.push(...mutation.changes);
			}
			warnings.push(...mutation?.warnings ?? []);
		} catch (error) {
			warnings.push(`Plugin "${pluginId}" config repair failed: ${formatErrorMessage(error)}. Its config was preserved; run \`openclaw doctor --fix\` after repairing the plugin.`);
		}
	}
	return {
		config: next,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
export { applyPluginDoctorCompatibilitySequence as t };
