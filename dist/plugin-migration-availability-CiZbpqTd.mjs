import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot, r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { l as createBlockedPluginDiagnosticLookup } from "./discovery-Dma3bVNk.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-xZyiClKv.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { a as resolveDeferredPluginMigrationConfigPaths } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-DneslQx1.mjs";
import { n as isPayloadMissing } from "./payload-verification-DenWO8lB.mjs";
import { a as collectConfiguredChannelIds, i as collectBlockedPluginIds, n as collectUpdateDeferredPluginIds, o as collectConfiguredPluginIds, r as resolveConfiguredPluginInstallContext } from "./missing-configured-plugin-install.candidates-TNjAk2DP.mjs";
import { t as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-3FM01Txu.mjs";
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
			const findBlockedPluginDiagnostic = createBlockedPluginDiagnosticLookup({
				diagnostics: metadata.diagnostics,
				config: params.cfg,
				env
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
			const pending = [...inspectedIds].toSorted().flatMap((pluginId) => {
				if (!passesManifestOwnerBasePolicy({
					plugin: { id: pluginId },
					normalizedConfig
				})) return [];
				const plugin = metadata.plugins.find((candidate) => candidate.id === pluginId);
				const bundled = context.bundledPluginsById.has(pluginId);
				const blocked = plugin ? void 0 : findBlockedPluginDiagnostic(pluginId);
				const unavailable = Boolean(blocked) || !context.knownIds.has(pluginId) || Object.hasOwn(context.records, pluginId) && isPayloadMissing(env, context.records[pluginId]?.installPath) || context.installedPluginIdsWithRepairablePackages.has(pluginId) || context.configuredPluginIdsWithStaleDescriptors.has(pluginId);
				const availableWithoutPackageConvergence = bundled && !blocked || plugin?.origin === "config" && rehearsalRoot !== void 0 && isPathInside(rehearsalRoot, plugin.rootDir) && !unavailable;
				if ((availableWithoutPackageConvergence || !params.deferInstallation && !unavailable) && plugin && statelessCandidates.has(pluginId)) statelessPluginIds.push(pluginId);
				if (!selected.has(pluginId) || availableWithoutPackageConvergence || !params.deferInstallation && !unavailable) return [];
				return [{
					pluginId,
					...requiredIds.has(pluginId) ? { requiresStateMigration: true } : {},
					...inspectionRequiredIds.has(pluginId) ? { requiresDoctorInspection: true } : {},
					...resolveDeferredPluginMigrationConfigPaths({
						config: params.cfg,
						pluginId,
						compatibilityMigrationPaths: plugin?.configContracts?.compatibilityMigrationPaths
					}),
					reason: blocked ? "The configured plugin is present but blocked. Fix the blocked plugin path before retrying its data/settings upgrade." : params.deferInstallation ? "Package convergence must wait until the updating parent releases its install records." : "The configured plugin package is missing or has not converged.",
					command: blocked ? "openclaw doctor --fix" : "openclaw update repair"
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
