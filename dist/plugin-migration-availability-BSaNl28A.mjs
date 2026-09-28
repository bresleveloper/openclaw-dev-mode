import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot, r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { r as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-6DlZADc0.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DPc05JSs.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { a as resolveDeferredPluginMigrationConfigPaths } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-Dl4k2vJA.mjs";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { i as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-DW1vCQmx.mjs";
import { n as isPayloadMissing } from "./payload-verification-DlThdi1u.mjs";
import { a as collectConfiguredChannelIds, i as collectBlockedPluginIds, n as collectUpdateDeferredPluginIds, o as collectConfiguredPluginIds, r as resolveConfiguredPluginInstallContext } from "./missing-configured-plugin-install.candidates-DwWDwOkB.mjs";
//#region src/commands/doctor/shared/plugin-migration-availability.ts
/** Inspect the selected package generation without importing its Doctor contract. */
async function inspectPluginMigrationAvailability(params) {
	const artifactPreserving = isArtifactPreservingStateRead();
	const env = artifactPreserving ? cloneEnvWithPlatformSemantics(params.env) : params.env;
	const rehearsalRoot = resolveUpdateRehearsalRoot(env);
	const inspect = () => withPluginCache(createPluginCache(), async () => {
		const metadata = params.installRecords !== void 0 ? resolveConfigWidePluginMetadataSnapshot({
			config: params.cfg,
			env,
			installRecords: params.installRecords,
			allowCurrent: false
		}) : loadManifestMetadataSnapshot({
			config: params.cfg,
			env
		});
		return withPluginMetadataSnapshotScope(metadata, async () => {
			const configuredPluginIds = collectConfiguredPluginIds(params.cfg, env);
			const configuredChannelIds = collectConfiguredChannelIds(params.cfg, env);
			const blockedPluginIds = collectBlockedPluginIds(params.cfg);
			const context = await resolveConfiguredPluginInstallContext({
				cfg: params.cfg,
				env,
				configuredPluginIds,
				configuredChannelIds,
				blockedPluginIds,
				baselineRecords: params.installRecords
			});
			const selected = collectUpdateDeferredPluginIds({
				cfg: params.cfg,
				env,
				configuredPluginIds,
				configuredChannelIds,
				configuredChannelOwnerPluginIds: context.configuredChannelOwnerPluginIds,
				blockedPluginIds
			});
			const inspectedIds = /* @__PURE__ */ new Set([...selected, ...params.retainedPluginIds ?? []]);
			const requiredPluginIds = [];
			const inspectionRequiredPluginIds = [];
			const statelessCandidates = /* @__PURE__ */ new Set();
			for (const plugin of metadata.plugins) {
				if (!inspectedIds.has(plugin.id)) continue;
				const declaration = plugin.doctorContract?.stateMigrations;
				const artifact = resolvePluginDoctorContractArtifact(plugin);
				const legacySetup = declaration !== true && !Array.isArray(declaration) && plugin.origin !== "bundled" && plugin.channels.length > 0 && plugin.setupSource;
				if (declaration === true || Array.isArray(declaration) && declaration.length > 0) requiredPluginIds.push(plugin.id);
				else if (legacySetup || artifact && (!plugin.doctorContract || Array.isArray(declaration))) inspectionRequiredPluginIds.push(plugin.id);
				else statelessCandidates.add(plugin.id);
			}
			const requiredIds = new Set(requiredPluginIds);
			const inspectionRequiredIds = new Set(inspectionRequiredPluginIds);
			const statelessPluginIds = [];
			const normalizedConfig = normalizePluginsConfig(params.cfg.plugins);
			const pending = [...selected].toSorted().flatMap((pluginId) => {
				if (!passesManifestOwnerBasePolicy({
					plugin: { id: pluginId },
					normalizedConfig
				})) return [];
				const plugin = metadata.plugins.find((candidate) => candidate.id === pluginId);
				const bundled = context.bundledPluginsById.has(pluginId);
				const unavailable = !context.knownIds.has(pluginId) || Object.hasOwn(context.records, pluginId) && isPayloadMissing(env, context.records[pluginId]?.installPath) || context.installedPluginIdsWithRepairablePackages.has(pluginId) || context.configuredPluginIdsWithStaleDescriptors.has(pluginId);
				const availableWithoutPackageConvergence = bundled || plugin?.origin === "config" && rehearsalRoot !== void 0 && isPathInside(rehearsalRoot, plugin.rootDir) && !unavailable;
				if ((availableWithoutPackageConvergence || !params.deferInstallation && !unavailable) && plugin && statelessCandidates.has(pluginId) && isActivatedManifestOwner({
					plugin,
					normalizedConfig,
					rootConfig: params.cfg
				})) statelessPluginIds.push(pluginId);
				if (availableWithoutPackageConvergence || !params.deferInstallation && !unavailable) return [];
				return [{
					pluginId,
					...requiredIds.has(pluginId) ? { requiresStateMigration: true } : {},
					...inspectionRequiredIds.has(pluginId) ? { requiresDoctorInspection: true } : {},
					...resolveDeferredPluginMigrationConfigPaths({
						config: params.cfg,
						pluginId,
						compatibilityMigrationPaths: plugin?.configContracts?.compatibilityMigrationPaths
					}),
					reason: params.deferInstallation ? "Package convergence must wait until the updating parent releases its install records." : "The configured plugin package is missing or has not converged.",
					command: "openclaw update repair"
				}];
			});
			const lookup = createInstalledPluginIndexScopeLookup(metadata.index);
			const statelessIds = new Set(statelessPluginIds);
			const runtimePluginAliases = collectConfiguredRuntimeIds(params.cfg).filter((runtime) => {
				if (selected.has(runtime) || lookup.hasInstalledPluginIds([runtime]) || Object.hasOwn(context.records, runtime) || Object.hasOwn(params.cfg.plugins?.entries ?? {}, runtime)) return false;
				const owners = /* @__PURE__ */ new Set();
				lookup.addAgentHarnessOwners(owners, [runtime]);
				return owners.size > 0 && [...owners].every((owner) => statelessIds.has(owner));
			});
			return {
				pending,
				requiredPluginIds: requiredPluginIds.toSorted(),
				inspectionRequiredPluginIds: inspectionRequiredPluginIds.toSorted(),
				statelessPluginIds,
				runtimePluginAliases
			};
		}, {
			config: params.cfg,
			env
		});
	});
	return artifactPreserving ? withOpenClawStateDatabaseReadSnapshot(inspect, resolveInstalledPluginIndexStateDatabaseOptions({ env })) : inspect();
}
//#endregion
export { inspectPluginMigrationAvailability as t };
