import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { g as resolveOfficialExternalPluginLegacyIds, i as getOfficialExternalPluginCatalogEntryForPackage, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { s as resolvePluginManifestInstallOwner } from "./manifest-registry-build-BbQTPsvD.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DPc05JSs.mjs";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { o as migratePluginConfigId } from "./update-config-WKWUUa1W.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/installed-plugin-id-recovery.ts
async function resolveInstalledPluginIdOwners(config, env) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		return withPluginCache(cache, () => {
			const records = loadInstalledPluginIndexInstallRecordsSync({ env });
			const snapshot = resolveConfigWidePluginMetadataSnapshot({
				config,
				env,
				allowCurrent: false,
				installRecords: records
			});
			const claimants = /* @__PURE__ */ new Map();
			for (const plugin of snapshot.plugins) for (const legacyId of new Set(plugin.legacyPluginIds ?? [])) {
				const owners = claimants.get(legacyId);
				if (owners) owners.push(plugin);
				else claimants.set(legacyId, [plugin]);
			}
			const eligibleOwners = /* @__PURE__ */ new Map();
			for (const [legacyId, owners] of claimants) {
				const plugin = owners[0];
				if (owners.length !== 1 || !plugin || snapshot.byPluginId.has(legacyId) || Object.hasOwn(records, legacyId) || snapshot.diagnostics.some((diagnostic) => diagnostic.level === "error" || diagnostic.pluginId === legacyId || diagnostic.pluginId === plugin.id)) continue;
				const record = records[plugin.id];
				const installed = snapshot.index.plugins.find((entry) => entry.pluginId === plugin.id && entry.manifestPath === plugin.manifestPath);
				const official = plugin.packageName ? getOfficialExternalPluginCatalogEntryForPackage(plugin.packageName) : void 0;
				if (!record || !installed || plugin.trustedOfficialInstall !== true || resolvePluginManifestInstallOwner(plugin) !== plugin.id || !official || resolveOfficialExternalPluginId(official) !== plugin.id || !resolveOfficialExternalPluginLegacyIds(official).includes(legacyId)) continue;
				eligibleOwners.set(legacyId, {
					pluginId: plugin.id,
					rootDir: installed.rootDir,
					manifestHash: installed.manifestHash,
					packageHash: installed.packageJson?.hash,
					record: structuredClone(record)
				});
			}
			const candidateOwners = /* @__PURE__ */ new Map();
			for (const [legacyId, owners] of claimants) {
				const owner = owners[0];
				if (owner) candidateOwners.set(legacyId, owner.id);
			}
			for (const pluginId of Object.keys(records)) {
				const official = getOfficialExternalPluginCatalogEntry(pluginId);
				if (official && resolveOfficialExternalPluginId(official) === pluginId) {
					for (const legacyId of resolveOfficialExternalPluginLegacyIds(official)) if (!candidateOwners.has(legacyId)) candidateOwners.set(legacyId, pluginId);
				}
			}
			return {
				eligibleOwners,
				candidateOwners
			};
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Recover after install publication even when a previous config write lost its transient receipt. */
async function recoverInstalledPluginConfigIds(config, env, repair) {
	const { eligibleOwners, candidateOwners } = await resolveInstalledPluginIdOwners(config, env);
	const recovery = new Map(repair?.previousRecovery);
	for (const [legacyId, previous] of recovery) {
		const current = eligibleOwners.get(legacyId);
		if (current && repair?.repairedPluginIds.includes(previous.pluginId) && current.pluginId === previous.pluginId && current.rootDir === previous.rootDir && isDeepStrictEqual(current.record, repair.records[current.pluginId])) recovery.set(legacyId, current);
	}
	const changes = [];
	let nextConfig = config;
	for (const [legacyId, owner] of eligibleOwners) {
		const migrated = migratePluginConfigId(nextConfig, legacyId, owner.pluginId);
		if (migrated !== nextConfig) {
			recovery.set(legacyId, owner);
			changes.push(`Moved installed plugin config "${legacyId}" to "${owner.pluginId}".`);
			setDeferredPluginMigrationConfigFacts(migrated, getDeferredPluginMigrationConfigFacts(nextConfig));
			nextConfig = migrated;
		}
	}
	return {
		config: nextConfig,
		changes,
		notices: [...candidateOwners].flatMap(([legacyId, pluginId]) => !eligibleOwners.has(legacyId) && migratePluginConfigId(config, legacyId, pluginId) !== config ? [`Kept plugin config "${legacyId}": the installed replacement owner is not unambiguous. Resolve plugin discovery or install-record conflicts, then rerun Doctor.`] : []),
		recovery,
		preservePluginIds: [...candidateOwners.keys()]
	};
}
/** Called under the existing plugin lifecycle lease before the config writer publishes. */
async function assertInstalledPluginIdRecoveryCurrent(config, recovery, env) {
	if (!recovery?.size) return;
	const current = await resolveInstalledPluginIdOwners(config, env);
	for (const [legacyId, owner] of recovery) if (!isDeepStrictEqual(current.eligibleOwners.get(legacyId), owner)) throw new ConfigMutationConflictError(`Plugin ownership changed after Doctor prepared "${legacyId}" config recovery; rerun Doctor.`, { retryable: false });
}
//#endregion
export { recoverInstalledPluginConfigIds as n, assertInstalledPluginIdRecoveryCurrent as t };
