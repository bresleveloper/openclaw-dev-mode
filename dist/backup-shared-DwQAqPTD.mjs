import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { l as pathExists, p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as isPathInside$1, t as hasNodeErrorCode$1 } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { T as resolveOAuthDir, m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-CulPgmRu.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import "./config-B3oiWDlr.mjs";
import { c as tryRealpath, t as loadSingleSkillDirectory } from "./local-loader-DuDhVnOL.mjs";
import { a as resolveSkillDiscoveryLimits, i as isSymlinkPath, r as discoverSkillCandidates } from "./skill-root-discovery-FGRFW_77.mjs";
import { r as resolveBackupConfigCapture } from "./backup-config-capture-gOLZYQL1.mjs";
import { n as isUpdateCapturePath, t as assertNotUpdateCapturePath } from "./update-capture-paths-KB4ru3JI.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { t as buildCleanupPlan } from "./cleanup-utils-BtHoq0Ha.mjs";
import { s as normalizeWindowsNamespaceAlias, t as createBackupResourcePlan } from "./backup-resource-inventory-Cw2aamVQ.mjs";
import { i as recordBackupRunOutcome } from "./backup-run-records-BzdFV-zG.mjs";
import { i as resolveLegacyConfigSnapshotForBackup } from "./automatic-config-repair-BmDzqlSM.mjs";
import fs, { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { isPathInside } from "@openclaw/fs-safe/path";
//#region src/plugins/manifest-backup-resources.ts
function listPluginInstallRoots(env) {
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	try {
		return fs.readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(extensionsDir, entry.name));
	} catch (error) {
		if (hasNodeErrorCode$1(error, "ENOENT")) return [];
		throw error;
	}
}
/** Resolves effective plugin-owned backup policy without importing or activating plugin runtime. */
function resolveActivatedPluginBackupInventory(params) {
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const workspaceScopes = params.workspaceDirs?.length ? [...new Set(params.workspaceDirs)] : [void 0];
	const backupRoots = [params.stateDir, ...params.workspaceDirs ?? []].filter((root) => Boolean(root)).map((root) => path.resolve(root));
	const pluginRoots = /* @__PURE__ */ new Set();
	const addPluginRoot = (pluginRoot) => {
		const resolvedRoot = path.resolve(pluginRoot);
		if (backupRoots.some((backupRoot) => resolvedRoot === backupRoot || isPathInside$1(backupRoot, resolvedRoot))) pluginRoots.add(resolvedRoot);
	};
	for (const pluginRoot of listPluginInstallRoots(params.env)) addPluginRoot(pluginRoot);
	const resources = /* @__PURE__ */ new Map();
	for (const workspaceDir of workspaceScopes) {
		const snapshot = resolvePluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.stateDir ? { stateDir: params.stateDir } : {},
			...workspaceDir ? { workspaceDir } : {}
		});
		for (const candidate of snapshot.discovery?.candidates ?? []) addPluginRoot(candidate.rootDir);
		const invalidDeclaration = normalizedConfig.enabled ? snapshot.diagnostics.find((diagnostic) => {
			if (diagnostic.code !== "backup-resource-declaration-invalid") return false;
			if (!diagnostic.pluginId) return true;
			const indexedOwner = snapshot.index.plugins.find((owner) => owner.pluginId === diagnostic.pluginId);
			const discoveredOwner = snapshot.discovery?.candidates.find((owner) => (owner.diagnosticIdHint ?? owner.idHint) === diagnostic.pluginId);
			const owner = indexedOwner ?? discoveredOwner;
			if (!owner) return true;
			const plugin = {
				id: diagnostic.pluginId,
				origin: owner.origin,
				enabledByDefault: indexedOwner?.enabledByDefault,
				enabledByDefaultOnPlatforms: indexedOwner?.enabledByDefaultOnPlatforms?.slice()
			};
			return isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) && (!indexedOwner || isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			}));
		}) : void 0;
		if (invalidDeclaration) throw new Error(invalidDeclaration.message);
		for (const plugin of snapshot.plugins) {
			if (!normalizedConfig.enabled || !plugin.backupResources?.length || !isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) || !isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			})) continue;
			for (const resource of plugin.backupResources) {
				const key = `${plugin.id}\0${resource.scope}\0${resource.relativePath}\0${resource.disposition}`;
				if (!resources.has(key)) resources.set(key, {
					pluginId: plugin.id,
					...resource
				});
			}
		}
	}
	return {
		pluginRoots: [...pluginRoots].toSorted(),
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
//#endregion
//#region src/commands/backup-outcome.ts
/** Route only the ledger write; archive creation keeps its existing backup owner. */
async function recordBackupRunOutcomeWithOwner(params) {
	const databasePath = resolveOpenClawStateSqlitePath();
	if (!existsSync(databasePath)) return;
	const outcome = {
		...params,
		createdAt: params.createdAt ?? Date.now(),
		pushFailed: params.pushFailed === true ? true : void 0
	};
	await runWithLocalStateOwner({
		method: "backup.recordOutcome",
		params: { outcome },
		target: "backup outcome ledger",
		recoveryCommand: "openclaw gateway call backup.status",
		assertTargetCurrent: () => {
			if (!existsSync(databasePath)) throw new Error("The state database disappeared; the backup outcome was not recorded.");
		},
		runLocal: ({ env, assertCurrent, signal }) => recordBackupRunOutcome({
			...outcome,
			env
		}, {
			assertCurrent,
			signal
		})
	});
}
//#endregion
//#region src/commands/backup-shared.ts
const BACKUP_MAX_DECOMPRESSION_RATIO = 1100;
async function recordBackupOutcomeBestEffort(runtime, params) {
	try {
		assertNotUpdateCapturePath(resolveOpenClawStateSqlitePath(), resolveStateDir());
		await recordBackupRunOutcomeWithOwner(params);
	} catch (error) {
		const label = params.kind === "git" ? "Git backup" : "backup";
		runtime.error(`Warning: the ${label} outcome could not be recorded: ${formatErrorMessage(error)}`);
	}
}
function resolveRequiredBackupPath(value, label) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error(`Missing required ${label} value.`);
	return resolveUserPath(trimmed);
}
const BACKUP_ASSET_PRIORITY = {
	state: 0,
	config: 1,
	credentials: 2,
	workspace: 3,
	agent: 4,
	"managed skill": 5
};
/** Format a filesystem-safe local timestamp with explicit UTC offset for backup names. */
function buildBackupArchiveRoot(nowMs = Date.now()) {
	const offsetMinutes = -new Date(nowMs).getTimezoneOffset();
	const shifted = nowMs + offsetMinutes * 6e4;
	const local = new Date(shifted);
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const absOffsetMinutes = Math.abs(offsetMinutes);
	const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, "0");
	const offsetMins = String(absOffsetMinutes % 60).padStart(2, "0");
	return `${String(local.getUTCFullYear()).padStart(4, "0")}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}T${String(local.getUTCHours()).padStart(2, "0")}-${String(local.getUTCMinutes()).padStart(2, "0")}-${String(local.getUTCSeconds()).padStart(2, "0")}.${String(local.getUTCMilliseconds()).padStart(3, "0")}${sign}${offsetHours}-${offsetMins}-openclaw-backup`;
}
function buildBackupArchiveBasename(nowMs = Date.now()) {
	return `${buildBackupArchiveRoot(nowMs)}.tar.gz`;
}
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
function encodeAbsolutePathForBackupArchive(sourcePath) {
	const normalized = normalizeWindowsNamespaceAlias(sourcePath).replaceAll("\\", "/");
	const windowsMatch = normalized.match(/^([A-Za-z]):\/(.*)$/);
	if (windowsMatch) {
		const drive = windowsMatch[1]?.toUpperCase() ?? "UNKNOWN";
		const rest = windowsMatch[2] ?? "";
		return path.posix.join("windows", drive, rest);
	}
	if (normalized.startsWith("/")) return path.posix.join("posix", normalized.slice(1));
	return path.posix.join("relative", normalized);
}
function buildBackupArchivePath(archiveRoot, sourcePath) {
	return path.posix.join(archiveRoot, "payload", encodeAbsolutePathForBackupArchive(sourcePath));
}
/** Resolve a backup plan from explicit paths, deduplicating assets already covered by parents. */
async function resolveBackupPlanFromPaths(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = params.stateDir;
	const configPath = params.configPath;
	for (const sourcePath of [configPath, ...(params.configCapture?.files ?? []).map((file) => file.canonicalPath)]) assertNotUpdateCapturePath(sourcePath, stateDir);
	const oauthDir = params.oauthDir;
	const archiveRoot = buildBackupArchiveRoot(params.nowMs);
	const requestedWorkspaceDirs = params.workspaceDirs ?? [];
	const workspaceDirs = includeWorkspace ? requestedWorkspaceDirs : [];
	const excludedWorkspaceDirs = includeWorkspace ? [] : requestedWorkspaceDirs;
	const agentRoots = onlyConfig ? [] : params.agentRoots ?? [];
	const canonicalStateDir = await canonicalizePathForContainment(stateDir);
	const configSourcePath = await canonicalizePathForContainment(configPath);
	const oauthSourcePath = await canonicalizePathForContainment(oauthDir);
	const resources = await createBackupResourcePlan({
		stateDir: canonicalStateDir,
		configPaths: [
			configPath,
			configSourcePath,
			...(params.configCapture?.files ?? []).map((file) => file.canonicalPath)
		],
		oauthDirs: [oauthDir, oauthSourcePath],
		workspaceDirs: await Promise.all(workspaceDirs.map((workspaceDir) => canonicalizePathForContainment(workspaceDir))),
		excludedWorkspaceDirs: (await Promise.all(excludedWorkspaceDirs.map(async (workspaceDir) => [path.resolve(workspaceDir), await canonicalizePathForContainment(workspaceDir)].filter((dir) => dir !== canonicalStateDir && !isPathInside(dir, canonicalStateDir))))).flat(),
		agentRoots,
		pluginResources: params.pluginInventory?.resources ?? [],
		pluginRoots: params.pluginInventory?.pluginRoots ?? [],
		onlyConfig
	});
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		const exists = await pathExists(resolvedConfigPath);
		const sourcePath = exists ? await canonicalizeExistingPath(resolvedConfigPath) : resolvedConfigPath;
		const asset = {
			kind: "config",
			sourcePath,
			displayPath: shortenHomePath(sourcePath)
		};
		return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			resources,
			included: exists ? [{
				...asset,
				archivePath: buildBackupArchivePath(archiveRoot, sourcePath)
			}] : [],
			skipped: exists ? [] : [{
				...asset,
				reason: "missing"
			}]
		};
	}
	const isOwnedPathCoveredBy = (sourcePath, sourceRoot) => {
		let ancestor = sourcePath;
		while (isPathInside(sourceRoot, ancestor)) {
			if (resources.isVolatile(ancestor)) return false;
			if (ancestor === sourceRoot) return true;
			ancestor = path.dirname(ancestor);
		}
		return false;
	};
	const rawCandidates = [
		{
			kind: "state",
			sourcePath: path.resolve(stateDir)
		},
		...isOwnedPathCoveredBy(configSourcePath, canonicalStateDir) ? [] : [{
			kind: "config",
			sourcePath: path.resolve(configPath)
		}],
		...isOwnedPathCoveredBy(oauthSourcePath, canonicalStateDir) ? [] : [{
			kind: "credentials",
			sourcePath: path.resolve(oauthDir)
		}],
		...(params.configCapture?.files ?? []).filter((file) => file.canonicalPath !== configSourcePath).map((file) => ({
			kind: "config",
			sourcePath: file.canonicalPath
		})),
		...workspaceDirs.map((workspaceDir) => ({
			kind: "workspace",
			sourcePath: path.resolve(workspaceDir)
		})),
		...agentRoots.map((root) => ({
			kind: "agent",
			sourcePath: root.sourcePath
		}))
	];
	const candidates = await Promise.all(rawCandidates.map(async (candidate) => {
		const exists = await pathExists(candidate.sourcePath);
		return Object.assign({}, candidate, {
			exists,
			canonicalPath: exists ? await canonicalizeExistingPath(candidate.sourcePath) : path.resolve(candidate.sourcePath)
		});
	}));
	for (const configuredPath of [{
		kind: "config",
		sourcePath: path.resolve(configPath)
	}, {
		kind: "credentials",
		sourcePath: path.resolve(oauthDir)
	}]) if (isSymlinkPath(configuredPath.sourcePath)) candidates.push({
		...configuredPath,
		canonicalPath: configuredPath.sourcePath,
		exists: true
	});
	for (const sourcePath of resolveManagedSkillSymlinkTargetCandidates({
		stateDir,
		ownerRoots: candidates.map((candidate) => candidate.canonicalPath),
		limits: params.skillDiscoveryLimits ?? resolveSkillDiscoveryLimits()
	})) candidates.push({
		kind: "managed skill",
		sourcePath,
		canonicalPath: sourcePath,
		exists: true
	});
	const uniqueCandidates = [];
	const skipped = [];
	const seenCanonicalPaths = /* @__PURE__ */ new Set();
	for (const candidate of candidates.toSorted(compareCandidates)) {
		const privateSelection = isUpdateCapturePath(candidate.sourcePath, stateDir);
		const privateTarget = candidate.canonicalPath !== candidate.sourcePath && isUpdateCapturePath(candidate.canonicalPath, stateDir);
		if (privateSelection || privateTarget) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "private"
			});
			continue;
		}
		if (seenCanonicalPaths.has(candidate.canonicalPath)) continue;
		seenCanonicalPaths.add(candidate.canonicalPath);
		uniqueCandidates.push(candidate);
	}
	const included = [];
	for (const candidate of uniqueCandidates) {
		if (!candidate.exists) {
			if (candidate.kind === "agent" && agentRoots.some((root) => root.sourcePath === candidate.canonicalPath && root.sourcePath === path.join(canonicalStateDir, "agents", root.agentId, "agent"))) continue;
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "missing"
			});
			continue;
		}
		const coveredBy = included.find((asset) => candidate.kind === "config" || candidate.kind === "credentials" ? isOwnedPathCoveredBy(candidate.canonicalPath, asset.sourcePath) : isPathInside(asset.sourcePath, candidate.canonicalPath));
		if (coveredBy) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.canonicalPath,
				displayPath: shortenHomePath(candidate.canonicalPath),
				reason: "covered",
				coveredBy: coveredBy.displayPath
			});
			continue;
		}
		included.push({
			kind: candidate.kind,
			sourcePath: candidate.canonicalPath,
			displayPath: shortenHomePath(candidate.canonicalPath),
			archivePath: buildBackupArchivePath(archiveRoot, candidate.canonicalPath)
		});
	}
	const regenerableRoots = resources.regenerableRoots.filter((resource) => !resources.isIncluded(resource.sourcePath) && included.some((asset) => isPathInside(asset.sourcePath, resource.sourcePath)));
	const regenerableResourceExists = await Promise.all(regenerableRoots.map((resource) => pathExists(resource.sourcePath)));
	for (const [index, resource] of regenerableRoots.entries()) {
		if (!regenerableResourceExists[index]) continue;
		skipped.push({
			kind: resource.kind,
			sourcePath: resource.sourcePath,
			displayPath: shortenHomePath(resource.sourcePath),
			reason: "regenerable"
		});
	}
	return {
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: workspaceDirs.map((entry) => path.resolve(entry)),
		configCapture: params.configCapture,
		resources,
		included,
		skipped
	};
}
function compareCandidates(left, right) {
	return left.canonicalPath.length - right.canonicalPath.length || BACKUP_ASSET_PRIORITY[left.kind] - BACKUP_ASSET_PRIORITY[right.kind] || left.canonicalPath.localeCompare(right.canonicalPath);
}
function resolveManagedSkillSymlinkTargetCandidates(params) {
	const managedSkillsDir = path.join(params.stateDir, "skills");
	const targets = /* @__PURE__ */ new Set();
	const discovered = discoverSkillCandidates({
		dir: managedSkillsDir,
		source: "openclaw-managed",
		limits: params.limits,
		allowedSymlinkTargetRealPaths: []
	});
	for (const candidate of discovered.candidates) {
		if (isUpdateCapturePath(candidate.skillDir, params.stateDir)) continue;
		if (!loadSingleSkillDirectory({
			skillDir: candidate.skillDir,
			source: "openclaw-managed",
			rootRealPath: candidate.skillDirRealPath,
			maxBytes: params.limits.maxSkillFileBytes
		})) continue;
		const relativeSkillDir = path.relative(managedSkillsDir, candidate.skillDir);
		if (path.isAbsolute(relativeSkillDir) || relativeSkillDir === ".." || relativeSkillDir.startsWith(`..${path.sep}`)) continue;
		const components = [managedSkillsDir];
		for (const segment of relativeSkillDir.split(path.sep).filter(Boolean)) components.push(path.join(components.at(-1) ?? managedSkillsDir, segment));
		for (const component of components) {
			if (!isSymlinkPath(component)) continue;
			const targetPath = tryRealpath(component);
			if (!targetPath || params.ownerRoots.some((ownerRoot) => isPathInside(ownerRoot, targetPath) || isPathInside(targetPath, ownerRoot))) continue;
			targets.add(targetPath);
		}
	}
	return [...targets];
}
async function canonicalizeExistingPath(targetPath) {
	try {
		return await fs$1.realpath(targetPath);
	} catch {
		return path.resolve(targetPath);
	}
}
/** Resolve symlinks in the existing prefix while retaining a not-yet-created suffix. */
async function canonicalizePathForContainment(targetPath) {
	const resolved = path.resolve(targetPath);
	const suffix = [];
	let probe = resolved;
	while (true) try {
		const realProbe = await fs$1.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
async function resolveBackupAgentRoot(config, agentId) {
	const selectedPath = resolveAgentDir(config, agentId);
	assertNotUpdateCapturePath(selectedPath, resolveStateDir());
	const sourcePath = await canonicalizePathForContainment(selectedPath);
	return {
		agentId,
		sourcePath,
		databasePath: path.join(sourcePath, "openclaw-agent.sqlite")
	};
}
async function resolveBackupAgentRoots(config) {
	return await Promise.all(listAgentIds(config).map((agentId) => resolveBackupAgentRoot(config, agentId)));
}
async function resolveBackupPlanFromDisk(params = {}) {
	if (params.onlyConfig) return await resolveBackupPlanFromState(params);
	assertNotUpdateCapturePath(resolveOpenClawStateSqlitePath(), resolveStateDir());
	return await withOpenClawStateDatabaseReadSnapshot(() => resolveBackupPlanFromState(params));
}
async function resolveBackupPlanFromState(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	if (onlyConfig) return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		includeWorkspace: false,
		onlyConfig: true,
		nowMs: params.nowMs
	});
	const configRead = await createConfigIO({ observe: false }).readConfigFileSnapshotForWrite();
	const configSnapshot = configRead.snapshot;
	const discoverySnapshot = await resolveLegacyConfigSnapshotForBackup(configSnapshot) ?? configSnapshot;
	const configCapture = await resolveBackupConfigCapture(configRead);
	if (discoverySnapshot.exists && !discoverySnapshot.valid) throw new Error(`Backup discovery failed at ${shortenHomePath(discoverySnapshot.path)}: ${discoverySnapshot.issues.map((issue) => issue.message).join("; ")}. Agent and plugin ownership could not be resolved. Resolve the reported error and retry backup, or use --only-config to save the config alone.`);
	const discoveredWorkspaceDirs = buildCleanupPlan({
		cfg: discoverySnapshot.config,
		stateDir,
		configPath,
		oauthDir
	}).workspaceDirs;
	const agentRoots = await resolveBackupAgentRoots(discoverySnapshot.config);
	const pluginInventory = resolveActivatedPluginBackupInventory({
		config: discoverySnapshot.config,
		env: process.env,
		stateDir,
		workspaceDirs: discoveredWorkspaceDirs
	});
	if (!includeWorkspace && discoverySnapshot.valid) {
		const sharedWorkspaceBase = discoverySnapshot.config.agents?.defaults?.workspace?.trim();
		if (sharedWorkspaceBase) discoveredWorkspaceDirs.push(resolveUserPath(sharedWorkspaceBase));
	}
	return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: discoveredWorkspaceDirs,
		agentRoots,
		pluginInventory,
		configCapture,
		includeWorkspace,
		onlyConfig,
		skillDiscoveryLimits: resolveSkillDiscoveryLimits(discoverySnapshot.config),
		nowMs: params.nowMs
	});
}
//#endregion
export { canonicalizePathForContainment as a, resolveBackupAgentRoots as c, buildBackupArchiveRoot as i, resolveBackupPlanFromDisk as l, buildBackupArchiveBasename as n, recordBackupOutcomeBestEffort as o, buildBackupArchivePath as r, resolveBackupAgentRoot as s, BACKUP_MAX_DECOMPRESSION_RATIO as t, resolveRequiredBackupPath as u };
