import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as resolveProfileStateDir } from "./profile-utils-BsmgdpgZ.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as resolveNewStateDir, r as resolveStateDir, t as resolveLegacyStateDirs } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as resolveLegacyInstalledPluginIndexStorePath, t as legacyInstalledPluginIndexUnsupportedMessage } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { c as inspectPersistedInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { h as readCurrentConfigForResolution } from "./io.runtime-CPntde4x.mjs";
import { n as migrationFileExists } from "./state-migrations.fs-BsWaJ_dW.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths, t as assertNoRetiredOAuthSidecarsBeforeConfigRecovery } from "./doctor-auth-legacy-paths-CYXKyNhX.mjs";
import { t as listRetiredDeliveryQueueFiles } from "./state-migrations.retired-delivery-files-BgPaIG3K.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { probePathCaseInsensitiveSync, resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
import { isWithinDir, safeStatSync } from "@openclaw/fs-safe/path";
//#region src/infra/state-migrations.state-dir.ts
let autoMigrateStateDirChecked = false;
function resetAutoMigrateLegacyStateDirForTest() {
	autoMigrateStateDirChecked = false;
}
function lstatIfPresent(filePath) {
	try {
		return fs.lstatSync(filePath);
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
function resolveProfileWorkspaceIdentity(workspace) {
	try {
		const resolved = resolvePathPrefixSync(workspace);
		const canonicalPath = path.join(resolved.existingPath, ...resolved.unresolvedSegments);
		if (resolved.unresolvedSegments.length > 0 && probePathCaseInsensitiveSync(canonicalPath, { allowTemporaryProbe: false }) === true) return path.join(resolved.existingPath, ...resolved.unresolvedSegments.map((segment) => segment.replace(/[A-Z]/g, (character) => character.toLowerCase())));
		return canonicalPath;
	} catch {
		return resolveIdentityPathViaExistingAncestorSync(workspace);
	}
}
function resolveConfiguredProfileWorkspace(params) {
	const agents = params.config?.agents;
	const workspaces = [
		agents?.defaults?.workspace,
		...Object.values(agents?.entries ?? {}).map((entry) => entry.workspace),
		...(agents?.list ?? []).map((entry) => entry.workspace)
	].flatMap((workspace) => workspace?.trim() ? [resolveProfileWorkspaceIdentity(resolveUserPath(workspace, params.env, params.homedir))] : []);
	if (workspaces.length === 0) return;
	return [params.source, params.target].find((workspace) => workspaces.includes(resolveProfileWorkspaceIdentity(workspace)));
}
function resolveLegacyProfileWorkspaceMigrationPaths(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || normalizeLowercaseStringOrEmpty(profile) === "default") return;
	const paths = {
		source: path.join(resolveProfileStateDir("default", env, homedir), `workspace-${profile}`),
		target: path.join(resolveProfileStateDir(profile, env, homedir), "workspace")
	};
	return resolveConfiguredProfileWorkspace({
		...params,
		...paths
	}) ? void 0 : paths;
}
function resolvePendingLegacyProfileWorkspaceMigrationPaths(params) {
	const paths = resolveLegacyProfileWorkspaceMigrationPaths(params);
	return paths && lstatIfPresent(paths.source) ? paths : void 0;
}
function migrateLegacyProfileWorkspace(params) {
	const paths = resolveLegacyProfileWorkspaceMigrationPaths({
		env: params.env,
		homedir: params.homedir
	});
	if (!paths) return {
		changes: [],
		warnings: []
	};
	try {
		const legacyDir = paths.source;
		const targetDir = paths.target;
		const legacyStat = lstatIfPresent(legacyDir);
		if (!legacyStat) return {
			changes: [],
			warnings: []
		};
		const configured = resolveConfiguredProfileWorkspace({
			...params,
			...paths
		});
		if (configured) {
			const other = configured === legacyDir ? targetDir : legacyDir;
			return {
				changes: [],
				warnings: [],
				...lstatIfPresent(other) ? { notices: [`Profile workspace: keeping configured workspace at ${configured}; existing workspace at ${other} was left unchanged.`] } : {}
			};
		}
		if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) return {
			changes: [],
			warnings: [`Profile workspace migration skipped: legacy path is not a directory (${legacyDir}).`]
		};
		if (lstatIfPresent(targetDir)) return {
			changes: [],
			warnings: [`Profile workspace migration skipped: target already exists (${targetDir}). Kept legacy workspace at ${legacyDir}; merge manually.`]
		};
		fs.mkdirSync(path.dirname(targetDir), { recursive: true });
		fs.renameSync(legacyDir, targetDir);
		return {
			changes: [`Profile workspace: ${legacyDir} → ${targetDir}`],
			warnings: []
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Profile workspace migration failed: ${String(error)}`]
		};
	}
}
function resolveSymlinkTarget(linkPath) {
	try {
		const target = fs.readlinkSync(linkPath);
		return path.resolve(path.dirname(linkPath), target);
	} catch {
		return null;
	}
}
function formatStateDirMigration(legacyDir, targetDir) {
	return `State dir: ${legacyDir} → ${targetDir} (legacy path now symlinked)`;
}
function isEmptyDirPath(filePath) {
	try {
		return fs.readdirSync(filePath).length === 0;
	} catch {
		return false;
	}
}
function isLegacyTreeSymlinkMirror(currentDir, realTargetDir) {
	try {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true });
		if (entries.length === 0) return false;
		return entries.every((entry) => {
			const entryPath = path.join(currentDir, entry.name);
			const stat = fs.lstatSync(entryPath);
			if (stat.isSymbolicLink()) {
				const resolvedTarget = resolveSymlinkTarget(entryPath);
				return Boolean(resolvedTarget && isWithinDir(realTargetDir, fs.realpathSync(resolvedTarget)));
			}
			return stat.isDirectory() && isLegacyTreeSymlinkMirror(entryPath, realTargetDir);
		});
	} catch {
		return false;
	}
}
function isLegacyDirSymlinkMirror(legacyDir, targetDir) {
	try {
		return isLegacyTreeSymlinkMirror(legacyDir, fs.realpathSync(targetDir));
	} catch {
		return false;
	}
}
/** Default relocation names remain useful for locating retained pre-migration evidence. */
function resolveLegacyStateDirMigrationCandidates(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	if (env.OPENCLAW_STATE_DIR?.trim()) return [];
	const target = resolveNewStateDir(homedir);
	return resolveLegacyStateDirs(homedir).map((source) => ({
		source,
		target
	}));
}
function resolvePendingLegacyStateDirMigrationPaths(params) {
	const selected = resolveLegacyStateDirMigrationCandidates(params).find(({ source }) => fs.existsSync(source));
	if (!selected) return;
	const { source, target } = selected;
	const sourceTarget = resolveSymlinkTarget(source);
	if (sourceTarget && path.resolve(sourceTarget) === path.resolve(target) || safeStatSync(target)?.isDirectory() && isLegacyDirSymlinkMirror(source, target)) return;
	return {
		source,
		target
	};
}
/** Reserve the once-only migration while its caller transfers maintenance custody. */
function prepareLegacyStateDirMigration(params) {
	if (autoMigrateStateDirChecked) return;
	const result = migrateLegacyStateDirRoot(params);
	autoMigrateStateDirChecked = true;
	return {
		stateDir: resolveStateDir(params.env ?? process.env, params.homedir ?? os.homedir),
		result
	};
}
async function autoMigrateLegacyStateDir(params) {
	const prepared = prepareLegacyStateDirMigration(params);
	return prepared ? prepared.result : {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
}
function migrateLegacyStateDirRoot(params) {
	const homedir = params.homedir ?? os.homedir;
	const env = params.env ?? process.env;
	const warnings = [];
	const changes = [];
	const notices = [];
	const hasCustomStateDir = Boolean(env.OPENCLAW_STATE_DIR?.trim());
	const targetDir = hasCustomStateDir ? resolveStateDir(env, homedir) : resolveNewStateDir(homedir);
	assertNoRetiredStateFiles("JSON delivery queues", listRetiredDeliveryQueueFiles(targetDir));
	const configPath = resolveConfigPath(env, resolveStateDir(env, homedir), homedir);
	assertNoRetiredOAuthSidecarsBeforeConfigRecovery({
		env,
		configPath
	});
	const { config: inspectionConfig, env: inspectionEnv } = readCurrentConfigForResolution({
		env,
		configPath
	});
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(inspectionEnv, inspectionConfig, targetDir));
	const finishMigration = () => {
		const legacyIndexPath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: targetDir });
		if (migrationFileExists(legacyIndexPath)) warnings.push(legacyInstalledPluginIndexUnsupportedMessage(legacyIndexPath));
		return {
			migrated: changes.length > 0,
			skipped: hasCustomStateDir && changes.length === 0 && warnings.length === 0 && notices.length === 0,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	};
	if (hasCustomStateDir) return finishMigration();
	const legacyDirs = resolveLegacyStateDirs(homedir);
	let legacyDir = legacyDirs.find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	let legacyStat;
	try {
		legacyStat = legacyDir ? fs.lstatSync(legacyDir) : null;
	} catch {
		legacyStat = null;
	}
	if (!legacyStat || !legacyDir) return finishMigration();
	if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
		warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	let symlinkDepth = 0;
	while (legacyStat.isSymbolicLink()) {
		const legacyTarget = resolveSymlinkTarget(legacyDir);
		if (!legacyTarget) {
			warnings.push(`Legacy state dir is a symlink (${legacyDir}); could not resolve target.`);
			return {
				migrated: false,
				skipped: false,
				changes,
				warnings
			};
		}
		if (path.resolve(legacyTarget) === path.resolve(targetDir)) return finishMigration();
		if (legacyDirs.some((dir) => path.resolve(dir) === path.resolve(legacyTarget))) {
			legacyDir = legacyTarget;
			try {
				legacyStat = fs.lstatSync(legacyDir);
			} catch {
				legacyStat = null;
			}
			if (!legacyStat) {
				warnings.push(`Legacy state dir missing after symlink resolution: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
				warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			symlinkDepth += 1;
			if (symlinkDepth > 2) {
				warnings.push(`Legacy state dir symlink chain too deep: ${legacyDir}`);
				return {
					migrated: false,
					skipped: false,
					changes,
					warnings
				};
			}
			continue;
		}
		warnings.push(`Legacy state dir is a symlink (${legacyDir} → ${legacyTarget}); skipping auto-migration.`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	assertNoRetiredStateFiles("JSON delivery queues", listRetiredDeliveryQueueFiles(legacyDir));
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(inspectionEnv, inspectionConfig, legacyDir));
	if (safeStatSync(targetDir)?.isDirectory()) {
		if (isLegacyDirSymlinkMirror(legacyDir, targetDir)) return finishMigration();
		if (isEmptyDirPath(legacyDir)) try {
			fs.rmdirSync(legacyDir);
			fs.symlinkSync(targetDir, legacyDir, process.platform === "win32" ? "junction" : "dir");
			changes.push(formatStateDirMigration(legacyDir, targetDir));
		} catch (err) {
			warnings.push(`Failed to retire empty legacy state dir (${legacyDir}): ${String(err)}`);
		}
		else warnings.push(`State dir migration skipped: target already exists (${targetDir}). Remove or merge manually.`);
		return finishMigration();
	}
	const legacyIndexPath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: legacyDir });
	const pluginInstallWarning = migrationFileExists(legacyIndexPath) ? legacyInstalledPluginIndexUnsupportedMessage(legacyIndexPath) : withArtifactPreservingStateReads(() => inspectPersistedInstalledPluginIndexInstallRecordsSync({ stateDir: legacyDir }).status === "invalid" ? `State dir migration skipped because persisted plugin install records in ${legacyDir} are invalid` : null);
	if (pluginInstallWarning) {
		warnings.push(pluginInstallWarning);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		fs.renameSync(legacyDir, targetDir);
	} catch (err) {
		warnings.push(`Failed to move legacy state dir (${legacyDir} → ${targetDir}): ${String(err)}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		fs.symlinkSync(targetDir, legacyDir, "dir");
		changes.push(formatStateDirMigration(legacyDir, targetDir));
	} catch (err) {
		try {
			if (process.platform === "win32") {
				fs.symlinkSync(targetDir, legacyDir, "junction");
				changes.push(formatStateDirMigration(legacyDir, targetDir));
			} else throw err;
		} catch (fallbackErr) {
			try {
				fs.renameSync(targetDir, legacyDir);
				warnings.push(`State dir migration rolled back (failed to link legacy path): ${String(fallbackErr)}`);
				return {
					migrated: false,
					skipped: false,
					changes: [],
					warnings
				};
			} catch (rollbackErr) {
				warnings.push(`State dir moved but failed to link legacy path (${legacyDir} → ${targetDir}): ${String(fallbackErr)}`);
				warnings.push(`Rollback failed; set OPENCLAW_STATE_DIR=${targetDir} to avoid split state: ${String(rollbackErr)}`);
				changes.push(`State dir: ${legacyDir} → ${targetDir}`);
			}
		}
	}
	return finishMigration();
}
//#endregion
export { resolveLegacyProfileWorkspaceMigrationPaths as a, resolvePendingLegacyStateDirMigrationPaths as c, resetAutoMigrateLegacyStateDirForTest as i, migrateLegacyProfileWorkspace as n, resolveLegacyStateDirMigrationCandidates as o, prepareLegacyStateDirMigration as r, resolvePendingLegacyProfileWorkspaceMigrationPaths as s, autoMigrateLegacyStateDir as t };
