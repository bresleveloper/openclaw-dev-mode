import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as resolvePluginManifestInstallOwner } from "./manifest-registry-build-r3_ZeucU.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { f as withDeferredPluginConfigCompletion, l as readDeferredPluginMigrationsAsync } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { n as findLegacyConfigRuleIssues } from "./legacy-B7HUu-GS.mjs";
import { t as HISTORICAL_WEBHOOK_CHANNELS } from "./legacy-webhook-pins-BxQm5_PU.mjs";
import { h as withDeferredPluginDoctorMigrations, l as listPluginDoctorStateMigrationEntries, n as applyPluginDoctorCompatibilityMigrations, o as listPluginDoctorLegacyConfigRules, r as collectDoctorConfigRepairPluginIds } from "./doctor-contract-registry-CPMSf5LC.mjs";
import { i as restoreDoctorConfigEnvRefs, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-BrBOplUM.mjs";
import { t as inspectPluginMigrationAvailability } from "./plugin-migration-availability-CWXsc9uR.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/plugin-update-config-migration.ts
/** Complete selected config repairs within the package owner's publication and compensation. */
async function preparePluginUpdateConfigMigration(params) {
	params.assertCurrent();
	const pending = await readDeferredPluginMigrationsAsync();
	params.assertCurrent();
	const selectedOwners = new Set(params.installOwners);
	const cache = createPluginCache();
	const inspect = (config, run) => withPluginCache(cache, () => {
		const metadata = resolveConfigWidePluginMetadataSnapshot({
			config,
			installRecords: params.installRecords,
			allowCurrent: false
		});
		return withPluginMetadataSnapshotScope(metadata, () => run(metadata), { config });
	});
	try {
		const prepared = inspect(params.config, (metadata) => {
			const selectedIds = new Set(params.installOwners);
			for (const plugin of metadata.plugins) {
				const installOwner = resolvePluginManifestInstallOwner(plugin);
				if (installOwner && selectedOwners.has(installOwner)) selectedIds.add(plugin.id);
			}
			const selectedPending = pending.filter((entry) => selectedIds.has(entry.pluginId));
			const inspected = /* @__PURE__ */ new Map();
			const migrated = applyPluginDoctorCompatibilityMigrations(params.config, {
				historicalWebhookListeners: HISTORICAL_WEBHOOK_CHANNELS.some((id) => selectedIds.has(id)),
				config: params.config,
				pluginIds: [...selectedIds],
				manifestRegistry: metadata.manifestRegistry,
				onInspectedPlugin: (pluginId, hasConfigRepair) => inspected.set(pluginId, hasConfigRepair)
			});
			if (migrated.warnings?.length) throw new Error(migrated.warnings.join("\n"));
			const unavailable = metadata.plugins.filter((plugin) => selectedIds.has(plugin.id) && plugin.doctorContract?.configRepair === true && inspected.get(plugin.id) !== true);
			if (unavailable.length > 0) throw new Error(`Plugin config repair could not be inspected: ${unavailable.map((plugin) => plugin.id).join(", ")}. Repair the plugin's Doctor artifact, then retry the update.`);
			if (migrated.changes.length === 0 && selectedPending.length === 0) return {
				config: params.config,
				selectedIds,
				selectedPending,
				inspected
			};
			const unselected = collectDoctorConfigRepairPluginIds(params.config).filter((id) => !selectedIds.has(id));
			return {
				config: withDeferredPluginDoctorMigrations(unselected, () => restoreDoctorConfigEnvRefs(migrated.config, prepareDoctorConfigReferenceSource(params.snapshot), void 0, { pluginCompatibility: {
					pluginIds: [...selectedIds],
					manifestRegistry: metadata.manifestRegistry
				} })),
				selectedIds,
				selectedPending,
				inspected
			};
		});
		params.assertCurrent();
		const { config, selectedIds, selectedPending, inspected } = prepared;
		let activationWarning;
		return {
			config,
			deferredPluginMigrations: pending,
			changed: selectedPending.length > 0 || !isDeepStrictEqual(config, params.config),
			get activationWarning() {
				return activationWarning;
			},
			async [Symbol.asyncDispose]() {
				await cache[Symbol.asyncDispose]();
			},
			async publish(activationConfig, commit) {
				params.assertCurrent();
				const availability = selectedPending.length > 0 ? await inspectPluginMigrationAvailability({
					cfg: activationConfig,
					env: process.env,
					installRecords: params.installRecords,
					retainedPluginIds: [...selectedIds],
					deferInstallation: false
				}) : void 0;
				params.assertCurrent();
				const resolvedPluginIds = inspect(activationConfig, (metadata) => {
					const rules = listPluginDoctorLegacyConfigRules({
						config: activationConfig,
						pluginIds: [...selectedIds],
						manifestRegistry: metadata.manifestRegistry,
						activeOnly: true
					});
					const legacyIssues = findLegacyConfigRuleIssues(activationConfig, rules);
					if (legacyIssues.length > 0) throw new Error(`Plugin config repair is incomplete: ${legacyIssues.map((issue) => `${issue.path}: ${issue.message}`).join("\n")}`);
					if (selectedPending.length === 0) return [];
					const active = /* @__PURE__ */ new Set();
					const stateless = new Set(availability?.statelessPlugins.map(({ id }) => id).filter((id) => selectedIds.has(id)));
					listPluginDoctorStateMigrationEntries({
						config: activationConfig,
						pluginIds: [...selectedIds],
						manifestRegistry: metadata.manifestRegistry,
						onSelectedPlugin: (id) => active.add(id),
						onInspectedStatelessPlugin: (id) => stateless.add(id)
					});
					const known = new Map(metadata.plugins.map((plugin) => [plugin.id, plugin]));
					const uninspected = selectedPending.filter((entry) => active.has(entry.pluginId) && (entry.configPaths?.length || entry.validationExcludedPaths?.length || !known.get(entry.pluginId)?.doctorContract && entry.requiresDoctorInspection) && !inspected.has(entry.pluginId));
					if (uninspected.length > 0) throw new Error(`Plugin config repair could not be inspected: ${uninspected.map((entry) => entry.pluginId).join(", ")}. Repair the plugin's Doctor artifact, then retry the update.`);
					const unresolved = selectedPending.filter((entry) => !known.has(entry.pluginId) || active.has(entry.pluginId) && (entry.requiresStateMigration || !stateless.has(entry.pluginId)));
					if (unresolved.length > 0) activationWarning = `Plugin packages are saved; activation is deferred for ${unresolved.map((entry) => entry.pluginId).join(", ")}. Existing data and settings are kept. Run openclaw doctor --fix to complete their data migrations, then reload the plugins.`;
					const unresolvedIds = new Set(unresolved.map((entry) => entry.pluginId));
					return selectedPending.filter((entry) => active.has(entry.pluginId) && !unresolvedIds.has(entry.pluginId)).map((entry) => entry.pluginId);
				});
				params.assertCurrent();
				if (resolvedPluginIds.length === 0) return await commit();
				return await withDeferredPluginConfigCompletion({
					configPath: params.snapshot.path,
					expectedPending: pending,
					resolvedPluginIds,
					assertCurrent: params.assertCurrent
				}, commit);
			}
		};
	} catch (error) {
		try {
			await cache[Symbol.asyncDispose]();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Plugin config migration preparation and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
//#endregion
export { preparePluginUpdateConfigMigration };
