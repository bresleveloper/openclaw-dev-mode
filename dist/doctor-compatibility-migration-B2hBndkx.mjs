import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { n as createHistoricalWebhookPinMigration } from "./legacy-webhook-pins-BxQm5_PU.mjs";
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
/** Apply resolved declarations without coupling the compatibility owner to registry loading. */
function applyResolvedPluginDoctorCompatibilityMigrations(cfg, entries, params) {
	const applyHistoricalWebhookPins = params.historicalWebhookListeners ? createHistoricalWebhookPinMigration(params.env) : void 0;
	const initialized = applyHistoricalWebhookPins ? applyHistoricalWebhookPins({
		config: cfg,
		changes: []
	}, void 0, params) : {
		config: cfg,
		changes: []
	};
	const result = applyPluginDoctorCompatibilitySequence(initialized.config, entries.map((entry) => {
		if (!params.isDeferred(entry.pluginId)) params.onInspectedPlugin?.(entry.pluginId, entry.rules.length > 0 || Boolean(entry.normalizeCompatibilityConfig) || entry.providerRenames.length > 0);
		return {
			pluginId: entry.pluginId,
			normalizeCompatibilityConfig: entry.normalizeCompatibilityConfig,
			transform: applyHistoricalWebhookPins ? (mutation) => {
				if (entry.historicalWebhookNormalizer) mutation.historicalWebhookAccountIds = entry.historicalWebhookNormalizer({ cfg: cloneConfigWithResolutionFacts(mutation.config) }).historicalWebhookAccountIds;
				return applyHistoricalWebhookPins(mutation, entry.historicalWebhookListener, {
					...params,
					pluginId: entry.pluginId,
					origin: entry.origin
				});
			} : void 0
		};
	}));
	return {
		...result,
		changes: [...initialized.changes, ...result.changes]
	};
}
//#endregion
export { applyResolvedPluginDoctorCompatibilityMigrations as n, applyPluginDoctorCompatibilitySequence as t };
