import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { j as normalizeBundledLookupPath } from "./discovery-D_5mAUI7.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { a as isExternallyDistributedPlugin } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync, n as listRecoveredManagedNpmInstallCandidates, o as clearLoadInstalledPluginIndexInstallRecordsCache, r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { i as markRetainedManagedNpmInstall, r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-dDTeoxiW.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { r as writeJsonTarget } from "./json-file-BY7NXKEu.mjs";
import { r as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { a as resolveBundledPluginSources } from "./bundled-sources-Bi9l5Ik4.mjs";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-BAVv9lNe.mjs";
import { n as maybeRepairPluginOpenClawHostLinks, r as resolveDoctorPluginNpmRoots, t as listPluginOpenClawHostLinkIssues } from "./doctor-plugin-host-links-D1ohMemY.mjs";
import { a as migratePluginRegistryForDoctor, i as migrateOfficialPluginInstallProvenance, o as preflightPluginRegistryDoctorMigration, t as InvalidPluginInstallRecordStateError } from "./plugin-registry-migration-_3JB5Vnw.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/stale-local-bundled-plugin-install-records.ts
function normalizePathForCompare(rawPath, env) {
	return path.resolve(normalizeBundledLookupPath(resolveUserPath(rawPath, env)));
}
function primaryInstallRecordPath(record) {
	if (typeof record.installPath === "string" && record.installPath.trim()) return {
		field: "installPath",
		path: record.installPath
	};
	if (typeof record.sourcePath === "string" && record.sourcePath.trim()) return {
		field: "sourcePath",
		path: record.sourcePath
	};
	return null;
}
function looksLikeCompiledBundledPluginPath(targetPath, pluginId) {
	const segments = normalizeBundledLookupPath(targetPath).split(/[\\/]+/u);
	return segments.some((segment, index) => {
		return (segment === "dist" || segment === "dist-runtime") && segments[index + 1] === "extensions" && segments[index + 2] === pluginId;
	});
}
function hasStaleBundledVersion(record, bundledSource) {
	const recordVersion = record.version?.trim();
	const bundledVersion = bundledSource.version?.trim();
	return Boolean(recordVersion && bundledVersion && recordVersion !== bundledVersion);
}
/** Lists path install records that still point at stale compiled bundled plugin output. */
function listStaleLocalBundledPluginInstallRecords(params) {
	const bundled = params.bundled ?? resolveBundledPluginSources({
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const stale = [];
	for (const [pluginId, record] of Object.entries(params.installRecords).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (record.source !== "path") continue;
		const bundledSource = bundled.get(pluginId);
		if (!bundledSource?.localPath) continue;
		if (!hasStaleBundledVersion(record, bundledSource)) continue;
		const recordPath = primaryInstallRecordPath(record);
		if (!recordPath) continue;
		const stalePath = normalizePathForCompare(recordPath.path, params.env);
		const bundledPath = normalizePathForCompare(bundledSource.localPath, params.env);
		if (stalePath === bundledPath) continue;
		if (!looksLikeCompiledBundledPluginPath(stalePath, pluginId)) continue;
		stale.push({
			pluginId,
			record,
			recordPathField: recordPath.field,
			stalePath,
			bundledPath
		});
	}
	return stale;
}
/** Removes stale compiled bundled plugin path records from an install record map. */
function pruneStaleLocalBundledPluginInstallRecords(params) {
	const stale = listStaleLocalBundledPluginInstallRecords(params);
	if (stale.length === 0) return {
		records: params.installRecords,
		stale
	};
	const staleIds = new Set(stale.map((record) => record.pluginId));
	return {
		records: Object.fromEntries(Object.entries(params.installRecords).filter(([pluginId]) => !staleIds.has(pluginId))),
		stale
	};
}
//#endregion
//#region src/commands/doctor-plugin-generations.ts
const PLUGIN_REGISTRY_CHECK_ID = "core/doctor/plugin-registry";
function normalizeManagedInstallPath(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
async function listStaleManagedNpmInstallGenerations(params) {
	const activeRecords = await loadInstalledPluginIndexInstallRecords(params);
	const candidates = listRecoveredManagedNpmInstallCandidates(params);
	const candidatesByPluginId = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const entries = candidatesByPluginId.get(candidate.pluginId) ?? [];
		entries.push(candidate);
		candidatesByPluginId.set(candidate.pluginId, entries);
	}
	const stale = [];
	for (const [pluginId, pluginCandidates] of candidatesByPluginId) {
		const activeRecord = activeRecords[pluginId];
		if (activeRecord?.source !== "npm" || !activeRecord.installPath) continue;
		const activePath = normalizeManagedInstallPath(activeRecord.installPath);
		if (!pluginCandidates.find((candidate) => candidate.installRecord.installPath && normalizeManagedInstallPath(candidate.installRecord.installPath) === activePath)) continue;
		for (const candidate of pluginCandidates) {
			const packageDir = candidate.installRecord.installPath;
			if (!packageDir || normalizeManagedInstallPath(packageDir) === activePath) continue;
			stale.push({
				kind: "stale-managed-npm-install-generation",
				pluginId,
				activePackageDir: activeRecord.installPath,
				packageDir,
				...candidate.installRecord.resolvedVersion ? { version: candidate.installRecord.resolvedVersion } : {}
			});
		}
	}
	return stale.toSorted((left, right) => left.packageDir.localeCompare(right.packageDir));
}
/** Marks non-authoritative managed npm trees for safe cleanup after gateway shutdown. */
async function maybeRepairStaleManagedNpmInstallGenerations(params) {
	const stale = await listStaleManagedNpmInstallGenerations(params);
	if (stale.length === 0) return false;
	if (!params.prompter.shouldRepair) {
		note([
			"Managed npm plugin installs have stale non-authoritative generations:",
			...stale.map((generation) => `- ${generation.pluginId}: ${shortenHomePath(generation.packageDir)}${generation.version ? ` (${generation.version})` : ""}`),
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to retire stale generations after the gateway restarts.`
		].join("\n"), "Plugin registry");
		return false;
	}
	const retired = [];
	for (const generation of stale) if (await markRetainedManagedNpmInstall({
		packageDir: generation.packageDir,
		pluginId: generation.pluginId,
		reason: "doctor-repaired-stale-managed-npm-generation"
	})) retired.push(generation);
	if (retired.length === 0) return false;
	clearLoadInstalledPluginIndexInstallRecordsCache();
	note(["Retired stale managed npm plugin generation(s); they will be pruned after the gateway restarts:", ...retired.map((generation) => `- ${generation.pluginId}: ${shortenHomePath(generation.packageDir)}${generation.version ? ` (${generation.version})` : ""}`)].join("\n"), "Plugin registry");
	return true;
}
function staleManagedNpmInstallGenerationToHealthFinding(issue) {
	return {
		checkId: PLUGIN_REGISTRY_CHECK_ID,
		severity: "warning",
		message: `Managed npm plugin ${issue.pluginId}${issue.version ? `@${issue.version}` : ""} is a stale non-authoritative generation.`,
		path: issue.packageDir,
		target: issue.pluginId,
		fixHint: "Run `openclaw doctor --fix` to retire the stale generation for pruning after the gateway restarts."
	};
}
function staleManagedNpmInstallGenerationToRepairEffect(issue) {
	return {
		kind: "package",
		action: "would-retire-stale-managed-npm-install-generation",
		target: issue.packageDir,
		dryRunSafe: false
	};
}
//#endregion
//#region src/commands/doctor-plugin-registry.ts
/** Doctor repairs for stale plugin registry entries, managed npm shadows, and peer links. */
function readJsonObject(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringMap(value) {
	if (!isRecord(value)) return {};
	const result = {};
	for (const [key, raw] of Object.entries(value)) if (typeof raw === "string" && raw.trim()) result[key] = raw.trim();
	return result;
}
function deleteObjectKey(record, key) {
	if (!Object.hasOwn(record, key)) return false;
	delete record[key];
	return true;
}
function readPackageVersion(packageDir) {
	const version = readJsonObject(path.join(packageDir, "package.json"))?.version;
	return typeof version === "string" && version.trim() ? version.trim() : void 0;
}
function readPluginManifestId(packageDir) {
	const id = readJsonObject(path.join(packageDir, "openclaw.plugin.json"))?.id;
	return typeof id === "string" && id.trim() ? id.trim() : void 0;
}
function listStaleManagedNpmBundledPlugins(params) {
	const currentBundled = loadInstalledPluginIndex({
		...params,
		installRecords: {}
	}).plugins.filter((plugin) => plugin.origin === "bundled" && !isExternallyDistributedPlugin(plugin));
	const bundledByPackage = new Map(currentBundled.map((plugin) => [plugin.packageName, plugin]));
	const stale = [];
	for (const npmRoot of resolveDoctorPluginNpmRoots(params)) {
		const dependencies = readStringMap(readJsonObject(path.join(npmRoot, "package.json"))?.dependencies);
		for (const packageName of Object.keys(dependencies).toSorted((left, right) => left.localeCompare(right))) {
			if (!packageName.startsWith("@openclaw/")) continue;
			const bundled = bundledByPackage.get(packageName);
			if (!bundled) continue;
			const packageDir = path.join(npmRoot, "node_modules", ...packageName.split("/"));
			if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
			const pluginId = readPluginManifestId(packageDir);
			if (!pluginId || pluginId !== bundled.pluginId) continue;
			stale.push({
				pluginId,
				packageName,
				packageDir,
				npmRoot,
				...readPackageVersion(packageDir) ? { version: readPackageVersion(packageDir) } : {}
			});
		}
	}
	return stale;
}
function loadCurrentBundledPluginSources(params) {
	const currentBundled = loadInstalledPluginIndex({
		...params,
		installRecords: {}
	}).plugins.filter((plugin) => plugin.origin === "bundled");
	return new Map(currentBundled.map((plugin) => [plugin.pluginId, {
		pluginId: plugin.pluginId,
		localPath: plugin.rootDir,
		...plugin.packageName ? { npmSpec: plugin.packageName } : {},
		...plugin.packageVersion ? { version: plugin.packageVersion } : {}
	}]));
}
async function listStaleLocalBundledPluginInstallRecordShadows(params) {
	return listStaleLocalBundledPluginInstallRecords({
		installRecords: await loadInstalledPluginIndexInstallRecords(params),
		workspaceDir: params.workspaceDir,
		env: params.env,
		bundled: loadCurrentBundledPluginSources(params)
	});
}
function removeManagedNpmDependency(params) {
	const npmPackageJsonPath = path.join(params.npmRoot, "package.json");
	const packageJson = readJsonObject(npmPackageJsonPath) ?? {};
	const dependencies = readStringMap(packageJson.dependencies);
	delete dependencies[params.packageName];
	const nextPackageJson = Object.keys(dependencies).length === 0 ? (() => {
		const { dependencies: _dependencies, ...rest } = packageJson;
		return rest;
	})() : {
		...packageJson,
		dependencies
	};
	writeJsonTarget(npmPackageJsonPath, nextPackageJson);
	removeManagedNpmPackageLockDependency(params);
	fs.rmSync(params.packageDir, {
		recursive: true,
		force: true
	});
	const scopeDir = path.dirname(params.packageDir);
	if (path.basename(path.dirname(scopeDir)) === "node_modules") try {
		fs.rmdirSync(scopeDir);
	} catch {}
}
function removeManagedNpmPackageLockDependency(params) {
	const packageLockPath = path.join(params.npmRoot, "package-lock.json");
	const packageLock = readJsonObject(packageLockPath);
	if (!packageLock) return;
	let changed = false;
	const packages = packageLock.packages;
	if (isRecord(packages)) {
		const rootPackage = packages[""];
		if (isRecord(rootPackage)) {
			const rootDependencies = readStringMap(rootPackage.dependencies);
			if (deleteObjectKey(rootDependencies, params.packageName)) {
				changed = true;
				if (Object.keys(rootDependencies).length === 0) delete rootPackage.dependencies;
				else rootPackage.dependencies = rootDependencies;
			}
		}
		changed = deleteObjectKey(packages, `node_modules/${params.packageName}`) || changed;
	}
	const dependencies = packageLock.dependencies;
	if (isRecord(dependencies)) changed = deleteObjectKey(dependencies, params.packageName) || changed;
	if (changed) writeJsonTarget(packageLockPath, packageLock);
}
/** Removes managed npm packages that shadow current bundled plugins when repair is enabled. */
function maybeRepairStaleManagedNpmBundledPlugins(params) {
	const stale = listStaleManagedNpmBundledPlugins(params);
	if (stale.length === 0) return null;
	if (!params.prompter.shouldRepair) {
		note([
			"Managed npm plugin packages shadow bundled plugins:",
			...stale.map((plugin) => `- ${plugin.pluginId}: ${plugin.packageName}${plugin.version ? `@${plugin.version}` : ""}`),
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale managed npm packages and rebuild the plugin registry.`
		].join("\n"), "Plugin registry");
		return null;
	}
	let installRecords = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync(params);
	const removedPluginIds = [...new Set(stale.map((plugin) => plugin.pluginId))].toSorted((left, right) => left.localeCompare(right));
	for (const pluginId of removedPluginIds) installRecords = removePluginInstallRecordFromRecords(installRecords, pluginId);
	for (const plugin of stale) removeManagedNpmDependency(plugin);
	note(["Removed stale managed npm plugin package(s) shadowing bundled plugins:", ...stale.map((plugin) => `- ${plugin.pluginId}: ${plugin.packageName}${plugin.version ? `@${plugin.version}` : ""}`)].join("\n"), "Plugin registry");
	return {
		installRecords,
		removedPluginIds
	};
}
/** Removes local install records that shadow current bundled plugin sources. */
async function maybeRepairStaleLocalBundledPluginInstallRecords(params) {
	const stale = await listStaleLocalBundledPluginInstallRecordShadows(params);
	if (stale.length === 0) return [];
	if (!params.prompter.shouldRepair) {
		note([
			"Local bundled plugin install records shadow bundled plugins:",
			...stale.map((record) => `- ${record.pluginId}: ${shortenHomePath(record.stalePath)}`),
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale local install records and rebuild the plugin registry.`
		].join("\n"), "Plugin registry");
		return [];
	}
	note(["Removed stale local bundled plugin install record(s) shadowing bundled plugins:", ...stale.map((record) => `- ${record.pluginId}: ${shortenHomePath(record.stalePath)}`)].join("\n"), "Plugin registry");
	return stale.map((record) => record.pluginId);
}
async function loadRepairedPluginInstallRecords(params, pluginIds, baselineRecords) {
	let records = baselineRecords ?? await loadInstalledPluginIndexInstallRecords(params);
	for (const pluginId of pluginIds) records = removePluginInstallRecordFromRecords(records, pluginId);
	return migrateOfficialPluginInstallProvenance(records);
}
async function detectPluginRegistryHealthIssues(params) {
	const preflight = preflightPluginRegistryDoctorMigration(params);
	const issues = [];
	if (preflight.action === "migrate") issues.push({
		kind: "registry-missing-or-stale",
		path: preflight.filePath
	});
	for (const plugin of listStaleManagedNpmBundledPlugins(params)) issues.push({
		kind: "stale-managed-npm-bundled-plugin",
		pluginId: plugin.pluginId,
		packageName: plugin.packageName,
		packageDir: plugin.packageDir,
		npmRoot: plugin.npmRoot,
		...plugin.version ? { version: plugin.version } : {}
	});
	for (const record of await listStaleLocalBundledPluginInstallRecordShadows(params)) issues.push({
		kind: "stale-local-bundled-plugin-install-record",
		pluginId: record.pluginId,
		stalePath: record.stalePath
	});
	issues.push(...await listStaleManagedNpmInstallGenerations(params));
	const hostLinkAudit = await listPluginOpenClawHostLinkIssues(params);
	for (const issue of hostLinkAudit.peerLinkIssues) issues.push({
		kind: "managed-npm-openclaw-peer-link",
		packageName: issue.packageName,
		packageDir: issue.packageDir,
		reason: issue.reason
	});
	for (const failure of hostLinkAudit.packageReadFailures) issues.push({
		kind: "managed-npm-package-unreadable",
		packageDir: failure.packageDir,
		reason: failure.reason
	});
	for (const issue of hostLinkAudit.registeredPeerLinkIssues) issues.push({
		kind: "registered-npm-openclaw-host-link",
		packageName: issue.packageName,
		packageDir: issue.packageDir,
		reason: issue.reason
	});
	for (const failure of hostLinkAudit.registeredPackageReadFailures) issues.push({
		kind: "registered-npm-package-unreadable",
		packageDir: failure.packageDir,
		reason: failure.reason
	});
	return issues;
}
function pluginRegistryIssueToHealthFinding(issue) {
	switch (issue.kind) {
		case "registry-missing-or-stale": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: "Persisted plugin registry is missing or stale.",
			path: issue.path,
			fixHint: "Run `openclaw doctor --fix` to rebuild the plugin registry from enabled plugins."
		};
		case "stale-managed-npm-bundled-plugin": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Managed npm package ${issue.packageName}${issue.version ? `@${issue.version}` : ""} shadows bundled plugin ${issue.pluginId}.`,
			path: issue.packageDir,
			target: issue.pluginId,
			fixHint: "Run `openclaw doctor --fix` to remove stale managed npm packages and rebuild the plugin registry."
		};
		case "stale-local-bundled-plugin-install-record": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Local install record for bundled plugin ${issue.pluginId} points at a stale path.`,
			path: issue.stalePath,
			target: issue.pluginId,
			fixHint: "Run `openclaw doctor --fix` to remove stale local install records and rebuild the plugin registry."
		};
		case "managed-npm-openclaw-peer-link": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Managed npm package ${issue.packageName} has a broken OpenClaw peer link: ${issue.reason}.`,
			path: issue.packageDir,
			target: issue.packageName,
			fixHint: "Run `openclaw doctor --fix` to relink managed npm plugin packages."
		};
		case "registered-npm-openclaw-host-link": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Registered plugin ${issue.packageName} has a broken OpenClaw host link: ${issue.reason}.`,
			path: issue.packageDir,
			target: issue.packageName,
			fixHint: "Run `openclaw doctor --fix` to relink the installed plugin package."
		};
		case "managed-npm-package-unreadable": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Managed npm package could not be inspected: ${issue.reason}.`,
			path: issue.packageDir,
			fixHint: "Restore access to the package files, then run `openclaw doctor` again."
		};
		case "registered-npm-package-unreadable": return {
			checkId: PLUGIN_REGISTRY_CHECK_ID,
			severity: "warning",
			message: `Registered plugin package could not be inspected: ${issue.reason}.`,
			path: issue.packageDir,
			fixHint: "Restore access to the package files, then run `openclaw doctor` again."
		};
		case "stale-managed-npm-install-generation": return staleManagedNpmInstallGenerationToHealthFinding(issue);
	}
	return assertNeverPluginRegistryIssue(issue);
}
function pluginRegistryIssueToRepairEffect(issue) {
	switch (issue.kind) {
		case "registry-missing-or-stale": return {
			kind: "state",
			action: "would-rebuild-plugin-registry",
			target: issue.path,
			dryRunSafe: false
		};
		case "stale-managed-npm-bundled-plugin": return {
			kind: "package",
			action: "would-remove-stale-managed-npm-bundled-plugin",
			target: issue.packageDir,
			dryRunSafe: false
		};
		case "stale-local-bundled-plugin-install-record": return {
			kind: "state",
			action: "would-remove-stale-local-bundled-plugin-install-record",
			target: issue.pluginId,
			dryRunSafe: false
		};
		case "managed-npm-openclaw-peer-link": return {
			kind: "package",
			action: "would-relink-managed-npm-openclaw-peer",
			target: issue.packageDir,
			dryRunSafe: false
		};
		case "registered-npm-openclaw-host-link": return {
			kind: "package",
			action: "would-relink-registered-npm-openclaw-host",
			target: issue.packageDir,
			dryRunSafe: false
		};
		case "managed-npm-package-unreadable": return {
			kind: "package",
			action: "requires-managed-npm-package-readability-repair",
			target: issue.packageDir,
			dryRunSafe: false
		};
		case "registered-npm-package-unreadable": return {
			kind: "package",
			action: "requires-registered-npm-package-readability-repair",
			target: issue.packageDir,
			dryRunSafe: false
		};
		case "stale-managed-npm-install-generation": return staleManagedNpmInstallGenerationToRepairEffect(issue);
	}
	return assertNeverPluginRegistryIssue(issue);
}
function assertNeverPluginRegistryIssue(issue) {
	throw new Error(`Unhandled plugin registry issue kind: ${String(issue.kind)}`);
}
/**
* Runs plugin registry doctor repairs and refreshes the persisted plugin index when needed.
*
* Stale bundled shadows are removed before registry migration so the rebuilt index resolves the
* current bundled source instead of an obsolete managed/local install record.
*/
async function maybeRepairPluginRegistryState(params) {
	let preflight;
	try {
		preflight = preflightPluginRegistryDoctorMigration(params);
	} catch (error) {
		if (!(error instanceof InvalidPluginInstallRecordStateError)) throw error;
		note(error.message, "Plugin registry");
		return { config: params.config };
	}
	clearLoadInstalledPluginIndexInstallRecordsCache();
	const migrationParams = {
		...params,
		config: params.config
	};
	const staleManagedNpmBundledPluginRepair = maybeRepairStaleManagedNpmBundledPlugins(params);
	const removedStaleLocalBundledPluginIds = await maybeRepairStaleLocalBundledPluginInstallRecords(params);
	await maybeRepairStaleManagedNpmInstallGenerations(params);
	const repairedPluginOpenClawHostLinks = await maybeRepairPluginOpenClawHostLinks(params);
	const stalePluginIdsToRemove = [.../* @__PURE__ */ new Set([...staleManagedNpmBundledPluginRepair?.removedPluginIds ?? [], ...removedStaleLocalBundledPluginIds])];
	if (!params.prompter.shouldRepair) {
		if (preflight.action === "migrate") note(["Persisted plugin registry is missing or stale.", `Repair with ${formatCliCommand("openclaw doctor --fix")} to rebuild ${shortenHomePath(preflight.filePath)} from enabled plugins.`].join("\n"), "Plugin registry");
		return { config: params.config };
	}
	const installRecords = await loadRepairedPluginInstallRecords(params, stalePluginIdsToRemove, staleManagedNpmBundledPluginRepair?.installRecords);
	if (preflight.action !== "skip-existing") {
		const result = await migratePluginRegistryForDoctor({
			...migrationParams,
			installRecords
		});
		if (result.migrated) {
			const total = result.current.plugins.length;
			const enabled = result.current.plugins.filter((plugin) => plugin.enabled).length;
			note(`Plugin registry rebuilt: ${enabled}/${total} enabled plugins indexed.`, "Plugin registry");
		}
		return {
			config: params.config,
			...result.migrated ? { pluginInventoryChanged: true } : {}
		};
	}
	const index = await refreshPluginRegistry({
		...migrationParams,
		reason: "migration",
		installRecords
	});
	const total = index.plugins.length;
	const enabled = index.plugins.filter((plugin) => plugin.enabled).length;
	note(`Plugin registry refreshed: ${enabled}/${total} enabled plugins indexed.`, "Plugin registry");
	const indexChanged = resolveInstalledManifestRegistryIndexFingerprint(preflight.current) !== resolveInstalledManifestRegistryIndexFingerprint(index);
	return {
		config: params.config,
		...indexChanged || repairedPluginOpenClawHostLinks ? { pluginInventoryChanged: true } : {}
	};
}
//#endregion
export { pluginRegistryIssueToRepairEffect as a, pluginRegistryIssueToHealthFinding as i, maybeRepairPluginRegistryState as n, pruneStaleLocalBundledPluginInstallRecords as o, maybeRepairStaleManagedNpmBundledPlugins as r, detectPluginRegistryHealthIssues as t };
