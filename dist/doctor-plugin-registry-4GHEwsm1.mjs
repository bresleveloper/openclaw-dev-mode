import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-CH7noY0Z.mjs";
import { u as tryReadJsonSync } from "./json-files-DYmSFHoN.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { p as normalizeBundledLookupPath } from "./discovery-B5pUUvVG.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { d as setPluginInstallRecordMapEntry, i as copyPluginInstallRecordMap } from "./installed-plugin-index-row-B-2QiBMA.mjs";
import { a as isExternallyDistributedPlugin } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions, r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import { r as inspectPersistedInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-state-Cr6YHbHB.mjs";
import { a as markRetainedManagedNpmInstall, i as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-DL_TwTTS.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync, n as listRecoveredManagedNpmInstallCandidates, o as clearLoadInstalledPluginIndexInstallRecordsCache, r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { a as resolveTrustedOfficialClawHubPackageName, i as isTrustedOfficialPluginInstallRecord, o as resolveTrustedSourceLinkedOfficialClawHubInstall } from "./official-external-install-records-DU-ANq4S.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-BZAiJgsR.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { s as writePersistedInstalledPluginIndex } from "./installed-plugin-index-store-write-DkjTb01T.mjs";
import { i as withoutPluginInstallRecords, n as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-DTzp62mN.mjs";
import { r as writeJsonTarget } from "./json-file-5C1aYJVp.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { a as resolveBundledPluginSources } from "./bundled-sources-CSOJ6Jwe.mjs";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-CsnvrffN.mjs";
import { n as maybeRepairPluginOpenClawHostLinks, r as resolveDoctorPluginNpmRoots, t as listPluginOpenClawHostLinkIssues } from "./doctor-plugin-host-links-DTIMikSS.mjs";
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
	const formatGeneration = (generation) => `- ${generation.pluginId}: ${shortenHomePath(generation.packageDir)}${generation.version ? ` (${generation.version})` : ""}`;
	if (!params.prompter.shouldRepair) {
		note([
			"Managed npm plugin installs have stale non-authoritative generations:",
			...stale.map(formatGeneration),
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
	note(["Retired stale managed npm plugin generation(s); they will be pruned after the gateway restarts:", ...retired.map(formatGeneration)].join("\n"), "Plugin registry");
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
//#region src/commands/doctor/shared/plugin-registry-migration.ts
/** Backfill shipped ClawHub authority only from a catalog-bound legacy install record. */
function migrateOfficialPluginInstallProvenance(records) {
	const migrated = copyPluginInstallRecordMap(records);
	for (const [pluginId, record] of Object.entries(records)) {
		if (record.source !== "clawhub" || record.clawhubUrl !== void 0 || record.clawhubChannel !== void 0 || record.sourcePath !== void 0 || !resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		})) continue;
		const normalized = {
			...record,
			clawhubUrl: "https://clawhub.ai",
			clawhubChannel: "official"
		};
		const packageName = resolveTrustedOfficialClawHubPackageName(normalized);
		if (isTrustedOfficialPluginInstallRecord({
			pluginId,
			packageName,
			record: normalized
		})) setPluginInstallRecordMapEntry(migrated, pluginId, normalized);
	}
	return migrated;
}
var InvalidPluginInstallRecordStateError = class extends Error {};
/** Decide whether Doctor should migrate the plugin registry in this environment. */
function preflightPluginRegistryDoctorMigration(params = {}) {
	const filePath = resolveInstalledPluginIndexStorePath(params);
	const persistedState = inspectPersistedInstalledPluginIndexInstallRecordsSync(params);
	if (persistedState.status === "invalid") throw new InvalidPluginInstallRecordStateError(`Persisted plugin install records are invalid at ${filePath}. Stop the Gateway, back up this database, delete only the config_machine_state row with state_key='plugins.installedIndex' using SQLite tooling, then rerun \`openclaw doctor --fix\` to rebuild it.`);
	if ((params.existsSync ?? fs.existsSync)(filePath)) {
		const currentRegistry = readPersistedInstalledPluginIndexSync(params);
		if (currentRegistry) return {
			action: "skip-existing",
			filePath,
			current: currentRegistry
		};
		if (persistedState.status !== "missing") return {
			action: "migrate",
			filePath
		};
	}
	return {
		action: "initialize",
		filePath
	};
}
async function readMigrationConfig(params) {
	if (params.config) return params.config;
	if (params.readConfig) return await params.readConfig();
	return await (await import("./config/config.js")).readBestEffortConfig();
}
/** Rebuild Doctor's plugin registry from canonical install records when needed. */
async function migratePluginRegistryForDoctor(params = {}) {
	const initialPreflight = preflightPluginRegistryDoctorMigration(params);
	if (params.dryRun) return {
		status: initialPreflight.action === "skip-existing" ? "skip-existing" : "dry-run",
		migrated: false,
		preflight: initialPreflight
	};
	return await withPluginLifecycleLease(resolveInstalledPluginIndexStateDatabaseOptions(params), async () => {
		const preflight = preflightPluginRegistryDoctorMigration(params);
		if (preflight.action === "skip-existing") return {
			status: "skip-existing",
			migrated: false,
			preflight
		};
		const rawConfig = await readMigrationConfig(params);
		const config = withoutPluginInstallRecords(rawConfig);
		const installRecords = migrateOfficialPluginInstallProvenance(params.installRecords ?? await loadInstalledPluginIndexInstallRecords(params));
		const current = {
			...loadInstalledPluginIndex({
				...params,
				config,
				installRecords
			}),
			refreshReason: "migration"
		};
		await writePersistedInstalledPluginIndex(current, params);
		return {
			status: "migrated",
			migrated: true,
			preflight,
			current
		};
	});
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
			const pluginId = normalizeOptionalString(readJsonObject(path.join(packageDir, "openclaw.plugin.json"))?.id);
			if (!pluginId || pluginId !== bundled.pluginId) continue;
			const version = normalizeOptionalString(readJsonObject(path.join(packageDir, "package.json"))?.version);
			stale.push({
				pluginId,
				packageName,
				packageDir,
				npmRoot,
				...version ? { version } : {}
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
	if (Object.keys(dependencies).length === 0) delete packageJson.dependencies;
	else packageJson.dependencies = dependencies;
	writeJsonTarget(npmPackageJsonPath, packageJson);
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
	const packageLines = stale.map((plugin) => `- ${plugin.pluginId}: ${plugin.packageName}${plugin.version ? `@${plugin.version}` : ""}`);
	if (!params.prompter.shouldRepair) {
		note([
			"Managed npm plugin packages shadow bundled plugins:",
			...packageLines,
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale managed npm packages and rebuild the plugin registry.`
		].join("\n"), "Plugin registry");
		return null;
	}
	let installRecords = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync(params);
	const removedPluginIds = [...new Set(stale.map((plugin) => plugin.pluginId))].toSorted((left, right) => left.localeCompare(right));
	for (const pluginId of removedPluginIds) installRecords = removePluginInstallRecordFromRecords(installRecords, pluginId);
	for (const plugin of stale) removeManagedNpmDependency(plugin);
	note(["Removed stale managed npm plugin package(s) shadowing bundled plugins:", ...packageLines].join("\n"), "Plugin registry");
	return {
		installRecords,
		removedPluginIds
	};
}
/** Removes local install records that shadow current bundled plugin sources. */
async function maybeRepairStaleLocalBundledPluginInstallRecords(params) {
	const stale = await listStaleLocalBundledPluginInstallRecordShadows(params);
	if (stale.length === 0) return [];
	const shouldRepair = params.prompter.shouldRepair;
	note([
		shouldRepair ? "Removed stale local bundled plugin install record(s) shadowing bundled plugins:" : "Local bundled plugin install records shadow bundled plugins:",
		...stale.map((record) => `- ${record.pluginId}: ${shortenHomePath(record.stalePath)}`),
		...!shouldRepair ? [`Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale local install records and rebuild the plugin registry.`] : []
	].join("\n"), "Plugin registry");
	return shouldRepair ? stale.map((record) => record.pluginId) : [];
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
		...plugin
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
		...issue
	});
	for (const failure of hostLinkAudit.packageReadFailures) issues.push({
		kind: "managed-npm-package-unreadable",
		...failure
	});
	for (const issue of hostLinkAudit.registeredPeerLinkIssues) issues.push({
		kind: "registered-npm-openclaw-host-link",
		...issue
	});
	for (const failure of hostLinkAudit.registeredPackageReadFailures) issues.push({
		kind: "registered-npm-package-unreadable",
		...failure
	});
	return issues;
}
function pluginRegistryIssueToHealthFinding(issue) {
	const finding = (message, findingPath, fixHint, target) => ({
		checkId: PLUGIN_REGISTRY_CHECK_ID,
		severity: "warning",
		message,
		path: findingPath,
		...target === void 0 ? {} : { target },
		fixHint
	});
	switch (issue.kind) {
		case "registry-missing-or-stale": return finding("Persisted plugin registry is missing or stale.", issue.path, "Run `openclaw doctor --fix` to rebuild the plugin registry from enabled plugins.");
		case "stale-managed-npm-bundled-plugin": return finding(`Managed npm package ${issue.packageName}${issue.version ? `@${issue.version}` : ""} shadows bundled plugin ${issue.pluginId}.`, issue.packageDir, "Run `openclaw doctor --fix` to remove stale managed npm packages and rebuild the plugin registry.", issue.pluginId);
		case "stale-local-bundled-plugin-install-record": return finding(`Local install record for bundled plugin ${issue.pluginId} points at a stale path.`, issue.stalePath, "Run `openclaw doctor --fix` to remove stale local install records and rebuild the plugin registry.", issue.pluginId);
		case "managed-npm-openclaw-peer-link": return finding(`Managed npm package ${issue.packageName} has a broken OpenClaw peer link: ${issue.reason}.`, issue.packageDir, "Run `openclaw doctor --fix` to relink managed npm plugin packages.", issue.packageName);
		case "registered-npm-openclaw-host-link": return finding(`Registered plugin ${issue.packageName} has a broken OpenClaw host link: ${issue.reason}.`, issue.packageDir, "Run `openclaw doctor --fix` to relink the installed plugin package.", issue.packageName);
		case "managed-npm-package-unreadable":
		case "registered-npm-package-unreadable": return finding(`${issue.kind === "managed-npm-package-unreadable" ? "Managed npm" : "Registered plugin"} package could not be inspected: ${issue.reason}.`, issue.packageDir, "Restore access to the package files, then run `openclaw doctor` again.");
		default: return staleManagedNpmInstallGenerationToHealthFinding(issue);
	}
}
function pluginRegistryIssueToRepairEffect(issue) {
	const effect = (kind, action, target) => ({
		kind,
		action,
		target,
		dryRunSafe: false
	});
	switch (issue.kind) {
		case "registry-missing-or-stale": return effect("state", "would-rebuild-plugin-registry", issue.path);
		case "stale-managed-npm-bundled-plugin": return effect("package", "would-remove-stale-managed-npm-bundled-plugin", issue.packageDir);
		case "stale-local-bundled-plugin-install-record": return effect("state", "would-remove-stale-local-bundled-plugin-install-record", issue.pluginId);
		case "managed-npm-openclaw-peer-link": return effect("package", "would-relink-managed-npm-openclaw-peer", issue.packageDir);
		case "registered-npm-openclaw-host-link": return effect("package", "would-relink-registered-npm-openclaw-host", issue.packageDir);
		case "managed-npm-package-unreadable": return effect("package", "requires-managed-npm-package-readability-repair", issue.packageDir);
		case "registered-npm-package-unreadable": return effect("package", "requires-registered-npm-package-readability-repair", issue.packageDir);
		default: return staleManagedNpmInstallGenerationToRepairEffect(issue);
	}
}
/**
* Runs plugin registry doctor repairs and refreshes the persisted plugin index when needed.
*
* Stale bundled shadows are removed before registry migration so the rebuilt index resolves the
* current bundled source instead of an obsolete managed/local install record.
*/
async function maybeRepairPluginRegistryState(params) {
	const readPreflight = () => {
		try {
			return preflightPluginRegistryDoctorMigration(params);
		} catch (error) {
			if (!(error instanceof InvalidPluginInstallRecordStateError)) throw error;
			note(error.message, "Plugin registry");
			return;
		}
	};
	const initial = readPreflight();
	if (!initial) return { config: params.config };
	if (!params.prompter.shouldRepair) return await inspectOrRepairPluginRegistryState(params, initial);
	return await withPluginLifecycleLease(resolveInstalledPluginIndexStateDatabaseOptions(params), async () => {
		const current = readPreflight();
		return current ? inspectOrRepairPluginRegistryState(params, current) : { config: params.config };
	});
}
async function inspectOrRepairPluginRegistryState(params, preflight) {
	clearLoadInstalledPluginIndexInstallRecordsCache();
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
	let index;
	const rebuilding = preflight.action !== "skip-existing";
	if (rebuilding) {
		const result = await migratePluginRegistryForDoctor({
			...params,
			installRecords
		});
		if (!result.migrated) return { config: params.config };
		index = result.current;
	} else index = await refreshPluginRegistry({
		...params,
		reason: "migration",
		installRecords
	});
	const total = index.plugins.length;
	const enabled = index.plugins.filter((plugin) => plugin.enabled).length;
	note(`Plugin registry ${rebuilding ? "rebuilt" : "refreshed"}: ${enabled}/${total} enabled plugins indexed.`, "Plugin registry");
	const inventoryChanged = preflight.action !== "skip-existing" || resolveInstalledManifestRegistryIndexFingerprint(preflight.current) !== resolveInstalledManifestRegistryIndexFingerprint(index) || repairedPluginOpenClawHostLinks;
	return {
		config: params.config,
		...inventoryChanged ? { pluginInventoryChanged: true } : {}
	};
}
//#endregion
export { pluginRegistryIssueToRepairEffect as a, pluginRegistryIssueToHealthFinding as i, maybeRepairPluginRegistryState as n, pruneStaleLocalBundledPluginInstallRecords as o, maybeRepairStaleManagedNpmBundledPlugins as r, detectPluginRegistryHealthIssues as t };
