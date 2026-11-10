import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as createBlockedPluginDiagnosticLookup } from "./discovery-availability-CEoTdFoo.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-CkzDe3D_.mjs";
import { r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import { g as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { r as isTrustedOfficialCatalogLookupDuplicate } from "./official-external-install-records-DU-ANq4S.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { s as resolveDeferredPluginMigrationConfigPaths } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-BspjHPkd.mjs";
import { n as isPayloadMissing } from "./payload-verification-B5DHkUNO.mjs";
import { a as collectConfiguredChannelIds, i as collectBlockedPluginIds, n as collectUpdateDeferredPluginIds, o as collectConfiguredPluginIds, r as resolveConfiguredPluginInstallContext } from "./missing-configured-plugin-install.candidates-DbdIQ2RX.mjs";
import { n as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-TrRMdwmt.mjs";
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
			const statelessPlugins = [];
			const unavailablePluginIds = [];
			const discoveryBlockedPluginIds = [];
			const normalizedConfig = normalizePluginsConfig(params.cfg.plugins);
			const pending = [...inspectedIds].toSorted().flatMap((pluginId) => {
				if (!passesManifestOwnerBasePolicy({
					plugin: { id: pluginId },
					normalizedConfig
				})) {
					unavailablePluginIds.push(pluginId);
					return [];
				}
				const plugin = metadata.plugins.find((candidate) => candidate.id === pluginId);
				const bundled = context.bundledPluginsById.has(pluginId);
				const blocked = plugin ? void 0 : findBlockedPluginDiagnostic(pluginId);
				if (blocked) discoveryBlockedPluginIds.push(pluginId);
				const unavailable = Boolean(blocked) || !context.knownIds.has(pluginId) || Object.hasOwn(context.records, pluginId) && isPayloadMissing(env, context.records[pluginId]?.installPath) || context.installedPluginIdsWithRepairablePackages.has(pluginId) || context.configuredPluginIdsWithStaleDescriptors.has(pluginId);
				if (unavailable || !plugin) unavailablePluginIds.push(pluginId);
				const available = bundled && !blocked || !unavailable && context.records[pluginId]?.source === "path" || plugin?.origin === "config" && rehearsalRoot !== void 0 && isPathInside(rehearsalRoot, plugin.rootDir) && !unavailable || !params.deferInstallation && !unavailable;
				if (available && plugin && statelessCandidates.has(pluginId)) statelessPlugins.push({
					id: pluginId,
					version: plugin.packageVersion ?? plugin.version
				});
				if (!selected.has(pluginId) || available) return [];
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
			const replacementPluginIds = {};
			for (const pluginId of unavailablePluginIds) {
				const entry = getOfficialExternalPluginCatalogEntry(pluginId);
				const replacementPluginId = entry && resolveOfficialExternalPluginId(entry);
				if (replacementPluginId && metadata.plugins.some((plugin) => plugin.id === replacementPluginId && plugin.trustedOfficialInstall === true) && isTrustedOfficialCatalogLookupDuplicate({
					pluginId,
					replacementPluginId,
					replacementRecord: context.records[replacementPluginId]
				})) replacementPluginIds[pluginId] = replacementPluginId;
			}
			const statelessIds = new Set(statelessPlugins.map((plugin) => plugin.id));
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
				statelessPlugins,
				runtimePluginAliases,
				discoveryBlockedPluginIds,
				...!params.deferInstallation ? {
					unavailablePluginIds,
					replacementPluginIds
				} : {}
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
