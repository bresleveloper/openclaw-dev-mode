import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { o as safeRealpathSync } from "./path-safety-0BfxAYBQ.mjs";
import "./path-safety-Cc0rrc_m.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import path from "node:path";
//#region src/plugins/installed-plugin-package-ownership.ts
function collectDuplicateInstallRecordOwners(index, env, realpathCache) {
	const ownersByPath = /* @__PURE__ */ new Map();
	const duplicateOwners = /* @__PURE__ */ new Set();
	for (const [installOwner, record] of Object.entries(index.installRecords)) {
		const rawPath = record.installPath?.trim() || record.sourcePath?.trim();
		if (!rawPath) continue;
		const resolved = path.resolve(resolveUserPath(rawPath, env));
		const pathKey = safeRealpathSync(resolved, realpathCache) ?? resolved;
		const existingOwner = ownersByPath.get(pathKey);
		if (existingOwner && existingOwner !== installOwner) {
			duplicateOwners.add(existingOwner);
			duplicateOwners.add(installOwner);
		}
		ownersByPath.set(pathKey, installOwner);
	}
	return duplicateOwners;
}
function ownershipError(pluginId, detail) {
	return {
		ok: false,
		error: `Plugin "${pluginId}" ${detail}. Package maintenance requires an unambiguous install record and its discovered package owner. Refresh the plugin registry and run openclaw plugins doctor to inspect the install record before retrying.`
	};
}
function createInstalledPluginOwnershipResolver(index, env = process.env) {
	const targets = /* @__PURE__ */ new Map();
	const childrenByOwner = /* @__PURE__ */ new Map();
	for (const entry of index.plugins) {
		if (!targets.has(entry.pluginId)) targets.set(entry.pluginId, entry);
		const installOwner = resolveInstalledPluginIndexInstallOwner(entry);
		if (installOwner) {
			const children = childrenByOwner.get(installOwner) ?? [];
			children.push(entry.pluginId);
			childrenByOwner.set(installOwner, children);
		}
	}
	for (const children of childrenByOwner.values()) children.sort();
	function resolveShadowedInstallOwner(target) {
		if (Object.hasOwn(index.installRecords, target.pluginId)) return target.pluginId;
		const childSeparator = target.pluginId.lastIndexOf("/");
		if (childSeparator <= 0) return;
		const parentId = target.pluginId.slice(0, childSeparator);
		const record = index.installRecords[parentId];
		const spec = record?.resolvedSpec ?? record?.spec;
		const packageName = record?.resolvedName ?? (spec ? parseRegistryNpmSpec(spec)?.name : void 0) ?? record?.clawhubPackage;
		return target.packageName && packageName === target.packageName ? parentId : void 0;
	}
	const updateTargets = new Map(targets);
	for (const target of targets.values()) if (target.origin === "config" && !resolveInstalledPluginIndexInstallOwner(target)) {
		const owner = resolveShadowedInstallOwner(target);
		if (owner && !updateTargets.has(owner)) updateTargets.set(owner, target);
	}
	const realpathCache = /* @__PURE__ */ new Map();
	let duplicateOwners;
	const duplicates = () => duplicateOwners ??= collectDuplicateInstallRecordOwners(index, env, realpathCache);
	const unsafeOwners = /* @__PURE__ */ new Map();
	function resolvePackage(pluginId) {
		const target = targets.get(pluginId);
		if (target && isInstalledPluginIndexInstallOwnerAmbiguous(target)) return ownershipError(pluginId, "has ambiguous package ownership");
		const ownerFromTarget = target ? resolveInstalledPluginIndexInstallOwner(target) : void 0;
		if (target && !ownerFromTarget) return ownershipError(pluginId, "has no authoritative package-owner metadata");
		const ownerFromRecord = Object.hasOwn(index.installRecords, pluginId) ? pluginId : void 0;
		const installOwner = ownerFromTarget ?? ownerFromRecord;
		if (!installOwner) return ownershipError(pluginId, "is not associated with a tracked package install");
		if (ownerFromTarget && ownerFromRecord && ownerFromTarget !== ownerFromRecord) return ownershipError(pluginId, "matches conflicting package owners");
		const installRecord = index.installRecords[installOwner];
		if (!installRecord) return ownershipError(pluginId, `references missing package owner "${installOwner}"`);
		if (duplicates().has(installOwner)) return ownershipError(pluginId, `shares package path ownership with "${installOwner}"`);
		const [firstPluginId, ...remainingPluginIds] = childrenByOwner.get(installOwner) ?? [];
		if (!firstPluginId) return ownershipError(pluginId, `package owner "${installOwner}" has no authoritative runtime child list`);
		const pluginIds = [firstPluginId, ...remainingPluginIds];
		const hasUnsafePackageEntry = unsafeOwners.get(installOwner) ?? index.plugins.some((entry) => installRecordPathMatchesPluginRoot(installRecord, entry.rootDir, env, realpathCache) && resolveInstalledPluginIndexInstallOwner(entry) !== installOwner);
		unsafeOwners.set(installOwner, hasUnsafePackageEntry);
		if (hasUnsafePackageEntry) return ownershipError(pluginId, `package owner "${installOwner}" has conflicting child rows`);
		return {
			ok: true,
			value: {
				installOwner,
				installRecord,
				pluginIds
			}
		};
	}
	function resolveLifecycle(pluginId) {
		const ownership = resolvePackage(pluginId);
		if (ownership.ok) return {
			ok: true,
			value: {
				kind: "package",
				...ownership.value
			}
		};
		const installRecord = index.installRecords[pluginId];
		if (!Object.hasOwn(index.installRecords, pluginId) || !installRecord || duplicates().has(pluginId)) return ownership;
		if (index.plugins.some((entry) => entry.pluginId === pluginId || installRecordPathMatchesPluginRoot(installRecord, entry.rootDir, env, realpathCache))) return ownership;
		return {
			ok: true,
			value: {
				kind: "orphan",
				installOwner: pluginId,
				installRecord,
				pluginIds: []
			}
		};
	}
	function resolveUpdate(pluginId) {
		const target = updateTargets.get(pluginId);
		const shadowedInstallOwner = target ? resolveShadowedInstallOwner(target) : void 0;
		if (target?.origin === "config" && !isInstalledPluginIndexInstallOwnerAmbiguous(target) && !resolveInstalledPluginIndexInstallOwner(target) && (!shadowedInstallOwner || !duplicates().has(shadowedInstallOwner))) {
			const record = shadowedInstallOwner ? index.installRecords[shadowedInstallOwner] : void 0;
			return {
				ok: true,
				value: {
					kind: "operator-managed",
					pluginIds: [target.pluginId],
					source: target.source,
					rootDir: target.rootDir,
					shadowedInstallOwner,
					...record ? { shadowedInstallRecord: {
						source: record.source,
						spec: record.spec,
						installPath: record.installPath,
						sourcePath: record.sourcePath
					} } : {}
				}
			};
		}
		return resolveLifecycle(pluginId);
	}
	function resolveReload(pluginId) {
		const target = targets.get(pluginId);
		if (target && !isInstalledPluginIndexInstallOwnerAmbiguous(target) && !resolveInstalledPluginIndexInstallOwner(target) && !Object.hasOwn(index.installRecords, pluginId) && !Object.values(index.installRecords).some((record) => installRecordPathMatchesPluginRoot(record, target.rootDir, env, realpathCache))) return {
			ok: true,
			value: {
				kind: "discovered",
				pluginIds: [pluginId]
			}
		};
		return resolveLifecycle(pluginId);
	}
	function isSourceInUse(sourcePath, loadPaths) {
		const target = safeRealpathSync(sourcePath, realpathCache) ?? path.resolve(sourcePath);
		return [
			...loadPaths,
			...Object.values(index.installRecords).flatMap((record) => [record.installPath, record.sourcePath]),
			...index.plugins.flatMap((entry) => [
				entry.rootDir,
				entry.source,
				entry.manifestPath
			])
		].some((candidate) => {
			if (!candidate?.trim()) return false;
			const resolved = path.resolve(resolveUserPath(candidate, env));
			const current = safeRealpathSync(resolved, realpathCache) ?? resolved;
			return isPathInside(target, current) || isPathInside(current, target);
		});
	}
	return {
		resolvePackage,
		resolveLifecycle,
		resolveUpdate,
		resolveReload,
		isSourceInUse
	};
}
function installRecordPathMatchesPluginRoot(record, rootDir, env, realpathCache) {
	const resolvedRoot = safeRealpathSync(path.resolve(rootDir), realpathCache) ?? path.resolve(rootDir);
	return [record.installPath, record.sourcePath].some((candidate) => {
		if (!candidate?.trim()) return false;
		const candidatePath = path.resolve(resolveUserPath(candidate, env));
		const resolvedCandidate = safeRealpathSync(candidatePath, realpathCache) ?? candidatePath;
		return isPathInside(resolvedCandidate, resolvedRoot);
	});
}
function hasMissingInstalledPluginOwnerMetadata(index, env = process.env) {
	const realpathCache = /* @__PURE__ */ new Map();
	if (collectDuplicateInstallRecordOwners(index, env, realpathCache).size > 0) return true;
	const installRecords = Object.entries(index.installRecords);
	return index.plugins.some((plugin) => isInstalledPluginIndexInstallOwnerAmbiguous(plugin) || !resolveInstalledPluginIndexInstallOwner(plugin) && installRecords.some(([, record]) => installRecordPathMatchesPluginRoot(record, plugin.rootDir, env, realpathCache)));
}
//#endregion
export { hasMissingInstalledPluginOwnerMetadata as n, createInstalledPluginOwnershipResolver as t };
