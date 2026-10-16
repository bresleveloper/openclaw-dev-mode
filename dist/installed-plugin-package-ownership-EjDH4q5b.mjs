import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { a as safeRealpathSync } from "./path-safety-6KJ2Rbnw.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
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
	const matchesPluginRoot = createInstallRecordPathMatcher(env, realpathCache);
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
		const hasUnsafePackageEntry = unsafeOwners.get(installOwner) ?? index.plugins.some((entry) => matchesPluginRoot(installRecord, entry.rootDir) && resolveInstalledPluginIndexInstallOwner(entry) !== installOwner);
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
		if (index.plugins.some((entry) => entry.pluginId === pluginId || matchesPluginRoot(installRecord, entry.rootDir))) return ownership;
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
		if (target && !isInstalledPluginIndexInstallOwnerAmbiguous(target) && !resolveInstalledPluginIndexInstallOwner(target) && !Object.hasOwn(index.installRecords, pluginId) && !Object.values(index.installRecords).some((record) => matchesPluginRoot(record, target.rootDir))) return {
			ok: true,
			value: {
				kind: "discovered",
				pluginIds: [pluginId]
			}
		};
		return resolveLifecycle(pluginId);
	}
	function isSourceInUse(sourcePath, loadPaths) {
		return isPluginSourcePathInUse(sourcePath, [
			...loadPaths,
			...Object.values(index.installRecords).flatMap((record) => [record.installPath, record.sourcePath]),
			...index.plugins.flatMap((entry) => [
				entry.rootDir,
				entry.source,
				entry.manifestPath
			])
		], env);
	}
	return {
		resolvePackage,
		resolveLifecycle,
		resolveUpdate,
		resolveReload,
		isSourceInUse
	};
}
function isPluginSourcePathInUse(sourcePath, paths, env = process.env) {
	const realpathCache = /* @__PURE__ */ new Map();
	const target = safeRealpathSync(sourcePath, realpathCache) ?? path.resolve(sourcePath);
	return paths.some((candidate) => {
		if (!candidate?.trim()) return false;
		const resolved = path.resolve(resolveUserPath(candidate, env));
		const current = safeRealpathSync(resolved, realpathCache) ?? resolved;
		return isPathInside(target, current) || isPathInside(current, target);
	});
}
function createInstallRecordPathMatcher(env, realpathCache) {
	const roots = /* @__PURE__ */ new Map();
	const recordPaths = /* @__PURE__ */ new Map();
	return (record, rootDir) => {
		let resolvedRoot = roots.get(rootDir);
		if (resolvedRoot === void 0) {
			const absoluteRoot = path.resolve(rootDir);
			resolvedRoot = safeRealpathSync(absoluteRoot, realpathCache) ?? absoluteRoot;
			roots.set(rootDir, resolvedRoot);
		}
		let candidates = recordPaths.get(record);
		if (candidates === void 0) {
			candidates = [record.installPath, record.sourcePath].filter((candidate) => Boolean(candidate?.trim())).map((candidate) => {
				const absolutePath = path.resolve(resolveUserPath(candidate, env));
				return safeRealpathSync(absolutePath, realpathCache) ?? absolutePath;
			});
			recordPaths.set(record, candidates);
		}
		for (const candidate of candidates) {
			if (process.platform !== "win32" && !resolvedRoot.startsWith(candidate)) continue;
			if (isPathInside(candidate, resolvedRoot)) return true;
		}
		return false;
	};
}
function hasMissingInstalledPluginOwnerMetadata(index, env = process.env) {
	const realpathCache = /* @__PURE__ */ new Map();
	if (collectDuplicateInstallRecordOwners(index, env, realpathCache).size > 0) return true;
	const installRecords = Object.entries(index.installRecords);
	const matchesPluginRoot = createInstallRecordPathMatcher(env, realpathCache);
	return index.plugins.some((plugin) => isInstalledPluginIndexInstallOwnerAmbiguous(plugin) || !resolveInstalledPluginIndexInstallOwner(plugin) && installRecords.some(([, record]) => matchesPluginRoot(record, plugin.rootDir)));
}
//#endregion
export { hasMissingInstalledPluginOwnerMetadata as n, isPluginSourcePathInUse as r, createInstalledPluginOwnershipResolver as t };
