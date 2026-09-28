import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { p as resolvePluginNpmProjectsDir, s as resolveDefaultPluginNpmDir } from "./install-paths-DnOgVB7K.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import { c as createPluginInstallRecordMap, l as getPluginInstallRecordMapEntry, m as setPluginInstallRecordMapEntry, s as copyPluginInstallRecordMap } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { a as resolveRetainedManagedNpmInstallMarkerPath, i as markRetainedManagedNpmInstall, n as clearRetainedManagedNpmInstallMarker, o as resolveRetainedManagedNpmInstallPackageInfo, s as restoreRetainedManagedNpmInstallMarkers } from "./managed-npm-retention-dDTeoxiW.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { C as resolveConfigWriteAfterWrite } from "./runtime-snapshot-DbgWcCyV.mjs";
import { S as copyRuntimeConfigWriteApplication, c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import { o as transformConfigFileWithRetry, r as replaceConfigFile } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { r as restorePersistedInstalledPluginIndexIfCurrent } from "./installed-plugin-index-store-write-9YyZuTlI.mjs";
import { a as withoutPluginInstallRecords, o as writePersistedInstalledPluginIndexInstallRecordsWithLease, t as PLUGIN_INSTALLS_CONFIG_PATH } from "./installed-plugin-index-records-Clh203og.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { o as recordPluginPackageUninstallPlan, r as planPluginUninstall } from "./uninstall-BZuX4B_D.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/plugins/install-record-commit.ts
function mergeUnsetPaths(left, right) {
	const merged = [...left ?? [], ...right ?? []];
	return merged.length > 0 ? merged : void 0;
}
/** Return whether config still contains legacy/transient plugin install records. */
function hasPendingPluginInstallRecords(config) {
	return Object.keys(config.plugins?.installs ?? {}).length > 0;
}
/** Find pending install records that match the base config and can be stripped as unchanged. */
function unchangedPendingPluginInstallRecordIds(config, baseConfig) {
	const pendingInstalls = config.plugins?.installs ?? {};
	return Object.entries(baseConfig.plugins?.installs ?? {}).filter(([pluginId, baseInstall]) => isDeepStrictEqual(getPluginInstallRecordMapEntry(pendingInstalls, pluginId), baseInstall)).map(([pluginId]) => pluginId);
}
/** Remove pending plugin install records from config, optionally only for selected ids. */
function stripPendingPluginInstallRecords(config, pluginIds) {
	if (!pluginIds) return withoutPluginInstallRecords(config);
	const removeIds = new Set(pluginIds);
	if (removeIds.size === 0 || !config.plugins?.installs) return config;
	const remainingInstalls = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(config.plugins.installs)) if (!removeIds.has(pluginId)) setPluginInstallRecordMapEntry(remainingInstalls, pluginId, record);
	if (Object.keys(remainingInstalls).length === 0) return withoutPluginInstallRecords(config);
	return {
		...config,
		plugins: {
			...config.plugins,
			installs: remainingInstalls
		}
	};
}
function mergeAfterWrite(writeOptions, afterWrite) {
	if (afterWrite === void 0) return writeOptions;
	return copyRuntimeConfigWriteApplication(writeOptions, {
		...writeOptions,
		afterWrite
	});
}
function isMissingInstallPathError(error) {
	const code = error.code;
	return code === "ENOENT" || code === "ENOTDIR";
}
function resolveExistingInstallPath(installPath) {
	const resolvedPath = path.resolve(installPath);
	try {
		return fs.realpathSync(resolvedPath);
	} catch (error) {
		if (isMissingInstallPathError(error)) return resolvedPath;
		throw error;
	}
}
function installPathsOverlap(left, right) {
	const resolvedLeft = resolveExistingInstallPath(left);
	const resolvedRight = resolveExistingInstallPath(right);
	return resolvedLeft === resolvedRight || isPathInside(resolvedLeft, resolvedRight) || isPathInside(resolvedRight, resolvedLeft);
}
function resolveRetainedManagedNpmInstallMarkerTarget(params) {
	if (params.previousRecord?.source !== "npm") return null;
	const previousInstallPath = params.previousRecord.installPath?.trim();
	const nextInstallPath = params.nextRecord?.installPath?.trim();
	if (!previousInstallPath) return null;
	if (params.nextRecord && (!nextInstallPath || installPathsOverlap(previousInstallPath, nextInstallPath))) return null;
	if (params.nextRecord?.source !== "npm") {
		const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(previousInstallPath);
		if (!packageInfo) return null;
		try {
			const configuredNpmRoot = path.resolve(resolveDefaultPluginNpmDir());
			const npmRoot = fs.realpathSync(configuredNpmRoot);
			const configuredProjectRoot = path.resolve(packageInfo.projectRoot);
			const projectRoot = fs.realpathSync(configuredProjectRoot);
			const packageDir = fs.realpathSync(previousInstallPath);
			if (path.relative(configuredNpmRoot, configuredProjectRoot) !== path.relative(npmRoot, projectRoot) || path.relative(configuredProjectRoot, path.resolve(previousInstallPath)) !== path.relative(projectRoot, packageDir)) return null;
			if (projectRoot === npmRoot) return previousInstallPath;
			const projectsRoot = fs.realpathSync(resolvePluginNpmProjectsDir(npmRoot));
			return path.dirname(projectRoot) === projectsRoot ? previousInstallPath : null;
		} catch (error) {
			if (isMissingInstallPathError(error)) return null;
			throw error;
		}
	}
	const installs = createPluginInstallRecordMap();
	setPluginInstallRecordMapEntry(installs, params.pluginId, params.previousRecord);
	const plan = planPluginUninstall(recordPluginPackageUninstallPlan({
		config: { plugins: { installs } },
		pluginId: params.pluginId,
		deleteFiles: true
	}, { runtimePluginIds: [] }));
	if (!plan.ok || !plan.directoryRemoval || plan.directoryRemoval.cleanup?.kind !== "npm") return null;
	if (nextInstallPath && installPathsOverlap(previousInstallPath, nextInstallPath)) return null;
	return previousInstallPath;
}
function resolveNpmInstallRecordPackageName(record) {
	if (record.source !== "npm" || !record.installPath?.trim()) return null;
	return resolveRetainedManagedNpmInstallPackageInfo(record.installPath)?.packageName ?? null;
}
function findReplacementNpmRecordForRemovedRecord(params) {
	const previousPackageName = resolveNpmInstallRecordPackageName(params.previousRecord);
	if (!previousPackageName) return null;
	for (const nextRecord of Object.values(params.nextInstallRecords)) if (resolveNpmInstallRecordPackageName(nextRecord) === previousPackageName) return nextRecord;
	return null;
}
async function markRetiredManagedNpmInstallRecords(params) {
	const markedPreviousPluginIds = /* @__PURE__ */ new Set();
	const activeInstallPaths = Object.values(params.nextInstallRecords).flatMap((record) => {
		const installPath = record.installPath?.trim();
		return installPath ? [installPath] : [];
	});
	const markRetiredInstall = async (pluginId, previousRecord, nextRecord) => {
		const previousInstallPath = previousRecord?.installPath?.trim();
		if (previousInstallPath && activeInstallPaths.some((installPath) => installPathsOverlap(previousInstallPath, installPath))) return;
		const packageDir = resolveRetainedManagedNpmInstallMarkerTarget({
			pluginId,
			previousRecord,
			nextRecord
		});
		if (!packageDir) return;
		const markerPath = resolveRetainedManagedNpmInstallMarkerPath(packageDir);
		const markerAlreadyExisted = fs.existsSync(markerPath);
		if (await markRetainedManagedNpmInstall({
			packageDir,
			pluginId,
			assertCurrent: params.assertCurrent,
			reason: nextRecord?.source === "npm" ? "replaced-by-managed-npm-generation-update" : nextRecord ? "replaced-by-plugin-source-change" : "removed-managed-npm-install-retained"
		}) && !markerAlreadyExisted) params.createdMarkerPaths.push(markerPath);
		markedPreviousPluginIds.add(pluginId);
	};
	for (const [pluginId, nextRecord] of Object.entries(params.nextInstallRecords)) await markRetiredInstall(pluginId, getPluginInstallRecordMapEntry(params.previousInstallRecords, pluginId), nextRecord);
	for (const [pluginId, previousRecord] of Object.entries(params.previousInstallRecords)) {
		if (markedPreviousPluginIds.has(pluginId) || getPluginInstallRecordMapEntry(params.nextInstallRecords, pluginId)) continue;
		await markRetiredInstall(pluginId, previousRecord, findReplacementNpmRecordForRemovedRecord({
			previousRecord,
			nextInstallRecords: params.nextInstallRecords
		}) ?? void 0);
	}
}
async function clearActiveRetainedManagedNpmInstallMarkers(nextInstallRecords, clearedMarkers, assertCurrent) {
	for (const record of Object.values(nextInstallRecords)) {
		if (record.source !== "npm" || !record.installPath?.trim()) continue;
		let markerPath;
		try {
			markerPath = resolveRetainedManagedNpmInstallMarkerPath(record.installPath);
		} catch {
			continue;
		}
		let contents;
		try {
			contents = await fs.promises.readFile(markerPath, "utf8");
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		clearedMarkers.push({
			markerPath,
			contents
		});
		await clearRetainedManagedNpmInstallMarker(record.installPath, assertCurrent);
	}
}
/** Recheck staged enablement at its config writer, after any intervening plugin update. */
async function assertPluginConfigActivationConsent(params) {
	const records = params.nextInstallRecords ?? await loadInstalledPluginIndexInstallRecords();
	if (Object.keys(records).length === 0) return;
	const { resolvePluginMetadataSnapshot } = await import("./plugin-metadata-snapshot-AIcOW-fO.mjs");
	const { resolvePluginCapabilityConsent } = await import("./capability-consent-lh_W5GUj.mjs");
	const { resolvePluginControlPlaneWorkspace } = await import("./control-plane-workspace-Bo6L_G79.mjs");
	const snapshot = await readConfigFileSnapshot();
	const metadataForConfig = (config) => resolvePluginMetadataSnapshot({
		config,
		allowCurrent: false,
		workspaceDir: resolvePluginControlPlaneWorkspace({ config }).workspaceDir
	});
	const previous = metadataForConfig(snapshot.config);
	const next = metadataForConfig(params.nextConfig);
	const previouslyEnabled = new Set(previous.index.plugins.filter((plugin) => snapshot.valid && plugin.enabled).map((plugin) => plugin.pluginId));
	for (const plugin of next.index.plugins) {
		if (!plugin.enabled || plugin.origin === "bundled") continue;
		const owner = resolveInstalledPluginIndexInstallOwner(plugin) ?? plugin.pluginId;
		const record = records[owner];
		const previousRecord = params.previousInstallRecords?.[owner];
		if (params.previousInstallRecords !== void 0 && (!previousRecord || record?.acceptedSurface !== void 0) && !isDeepStrictEqual(previousRecord, record) || !previouslyEnabled.has(plugin.pluginId)) await resolvePluginCapabilityConsent({
			config: params.nextConfig,
			pluginId: plugin.pluginId,
			metadata: next
		});
	}
}
async function commitPluginInstallRecordsWithWriter(params) {
	return await withPluginLifecycleLease({}, async (lease) => {
		const assertOwned = () => lease.assertOwned();
		const assertCurrent = () => {
			assertOwned();
			params.writeOptions?.assertConfigPathForWrite?.();
		};
		let tentativeWrite;
		const retainedMarkerPaths = [];
		const clearedMarkerSnapshots = [];
		try {
			const storeOptions = { filePath: lease.databasePath };
			const prepared = await params.prepareInstallRecords(storeOptions);
			await params.beforePersistentEffect?.();
			assertCurrent();
			tentativeWrite = await writePersistedInstalledPluginIndexInstallRecordsWithLease(prepared.nextInstallRecords, {
				...storeOptions,
				config: params.nextConfig,
				lease
			});
			if (params.recheckStagedActivation) {
				const nextIndex = await readPersistedInstalledPluginIndex(storeOptions);
				if (!nextIndex || nextIndex.plugins.some((plugin) => plugin.enabled && plugin.origin !== "bundled")) await assertPluginConfigActivationConsent({
					nextConfig: params.nextConfig,
					previousInstallRecords: prepared.previousInstallRecords,
					nextInstallRecords: prepared.nextInstallRecords
				});
			}
			await markRetiredManagedNpmInstallRecords({
				previousInstallRecords: prepared.previousInstallRecords,
				nextInstallRecords: prepared.nextInstallRecords,
				createdMarkerPaths: retainedMarkerPaths,
				assertCurrent
			});
			await clearActiveRetainedManagedNpmInstallMarkers(prepared.nextInstallRecords, clearedMarkerSnapshots, assertCurrent);
			const writeOptions = copyRuntimeConfigWriteApplication(params.writeOptions, {
				...params.writeOptions,
				...params.beforePersistentEffect ? { beforeCommit: async () => {
					await params.writeOptions?.beforeCommit?.();
					await params.beforePersistentEffect?.();
				} } : {},
				unsetPaths: mergeUnsetPaths(params.writeOptions?.unsetPaths, [Array.from(PLUGIN_INSTALLS_CONFIG_PATH)])
			});
			return {
				committed: await params.commit(params.nextConfig, writeOptions),
				nextInstallRecords: prepared.nextInstallRecords,
				indexWrite: tentativeWrite
			};
		} catch (error) {
			assertOwned();
			const failures = [error];
			const tentative = tentativeWrite;
			if (tentative) try {
				if (await restorePersistedInstalledPluginIndexIfCurrent(tentative.previous, tentative.revision, {
					filePath: lease.databasePath,
					lease
				})) await restoreRetainedManagedNpmInstallMarkers({
					clearedMarkerSnapshots,
					createdMarkerPaths: retainedMarkerPaths,
					assertCurrent: assertOwned
				});
			} catch (rollbackError) {
				assertOwned();
				failures.push(rollbackError);
			}
			if (failures.length > 1) throw new AggregateError(failures, `${String(error)}; Failed to commit plugin install records and could not roll back tentative plugin state`, { cause: error });
			throw error;
		}
	});
}
/** Persist plugin install records and commit the matching config update to disk. */
async function commitPluginInstallRecordsWithConfig(params) {
	const result = await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => ({
			previousInstallRecords: params.previousInstallRecords ?? await loadInstalledPluginIndexInstallRecords(storeOptions),
			nextInstallRecords: params.nextInstallRecords
		}),
		nextConfig: params.nextConfig,
		beforePersistentEffect: params.beforePersistentEffect,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: async (nextConfig, writeOptions) => {
			return await replaceConfigFile({
				nextConfig,
				...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {},
				...writeOptions ? { writeOptions } : {}
			});
		}
	});
	return {
		...result.indexWrite,
		configWrite: result.committed
	};
}
/** Persist plugin install records without rewriting the user-authored config file. */
async function commitPluginInstallRecordsOnly(params) {
	return (await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => ({
			previousInstallRecords: params.previousInstallRecords ?? await loadInstalledPluginIndexInstallRecords(storeOptions),
			nextInstallRecords: params.nextInstallRecords
		}),
		nextConfig: params.nextConfig,
		commit: async () => {
			await params.verifyConfigFresh?.();
		}
	})).indexWrite;
}
/** Commit config while migrating any pending install records into the install index. */
async function commitConfigWriteWithPendingPluginInstalls(params) {
	const sourceInstallRecords = params.sourceConfig?.plugins?.installs ?? {};
	const nextPendingConfig = params.sourceConfig ? stripPendingPluginInstallRecords(params.nextConfig, unchangedPendingPluginInstallRecordIds(params.nextConfig, { plugins: { installs: sourceInstallRecords } })) : params.nextConfig;
	if (Object.keys(sourceInstallRecords).length === 0 && !hasPendingPluginInstallRecords(nextPendingConfig)) return {
		...await withPluginLifecycleLease({}, async () => {
			await assertPluginConfigActivationConsent({ nextConfig: params.nextConfig });
			return params.writeOptions ? await params.commit(params.nextConfig, params.writeOptions) : await params.commit(params.nextConfig);
		}),
		installRecords: {},
		movedInstallRecords: false
	};
	const pendingInstallRecords = nextPendingConfig.plugins?.installs ?? {};
	const result = await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => {
			const previousInstallRecords = await loadInstalledPluginIndexInstallRecords(storeOptions);
			const nextInstallRecords = copyPluginInstallRecordMap(sourceInstallRecords);
			for (const records of [previousInstallRecords, pendingInstallRecords]) for (const [pluginId, record] of Object.entries(records)) setPluginInstallRecordMapEntry(nextInstallRecords, pluginId, record);
			return {
				previousInstallRecords,
				nextInstallRecords
			};
		},
		nextConfig: withoutPluginInstallRecords(params.nextConfig),
		recheckStagedActivation: true,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: params.commit
	});
	return {
		...result.committed,
		installRecords: result.nextInstallRecords,
		movedInstallRecords: true
	};
}
/** Replace the config file after moving pending plugin install records into the install index. */
async function commitConfigWithPendingPluginInstalls(params) {
	return await commitConfigWriteWithPendingPluginInstalls({
		nextConfig: params.sourceConfig ?? params.nextConfig,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: async (nextConfig, writeOptions) => {
			return await replaceConfigFile({
				...params.sourceConfig ? { sourceConfig: nextConfig } : { nextConfig },
				...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {},
				...writeOptions ? { writeOptions } : {}
			});
		}
	});
}
/** Transform config with retry support while preserving plugin install index consistency. */
async function transformConfigWithPendingPluginInstalls(params) {
	const commit = async ({ nextConfig, snapshot, baseHash, writeOptions }) => {
		const requestedAfterWrite = params.afterWrite ?? params.writeOptions?.afterWrite;
		const committed = await commitConfigWriteWithPendingPluginInstalls({
			nextConfig,
			sourceConfig: snapshot.sourceConfig,
			...writeOptions ? { writeOptions: mergeAfterWrite(writeOptions, params.afterWrite) } : {},
			commit: async (config, commitWriteOptions) => {
				return await replaceConfigFile({
					nextConfig: config,
					snapshot,
					writeOptions: commitWriteOptions ?? {},
					...baseHash !== void 0 ? { baseHash } : {}
				});
			}
		});
		const afterWrite = resolveConfigWriteAfterWrite(requestedAfterWrite);
		return {
			config: committed.nextConfig,
			persistedHash: committed.persistedHash,
			persistedSourceConfig: committed.persistedSourceConfig,
			afterWrite
		};
	};
	return await withPluginLifecycleLease({}, async () => {
		return await transformConfigFileWithRetry({
			...params,
			commit
		});
	});
}
//#endregion
export { hasPendingPluginInstallRecords as a, unchangedPendingPluginInstallRecordIds as c, commitPluginInstallRecordsWithConfig as i, commitConfigWriteWithPendingPluginInstalls as n, stripPendingPluginInstallRecords as o, commitPluginInstallRecordsOnly as r, transformConfigWithPendingPluginInstalls as s, commitConfigWithPendingPluginInstalls as t };
