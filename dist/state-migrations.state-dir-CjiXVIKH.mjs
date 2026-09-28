import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveProfileStateDir } from "./profile-utils-D5FwriYc.mjs";
import { a as probePathCaseInsensitiveSync, l as resolvePathPrefixSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { a as isWithinDir } from "./path-safety-0BfxAYBQ.mjs";
import { E as resolveStateDir, T as resolveNewStateDir, w as resolveLegacyStateDirs } from "./paths-DehQwyE0.mjs";
import { i as logStateMigrationResult } from "./state-migrations.messages-B6_AgnV2.mjs";
import { f as migrateLegacyTaskStateSidecars } from "./state-migrations.storage-DpFCNszC.mjs";
import { r as preflightLegacyInstalledPluginIndexMigration, t as migrateLegacyInstalledPluginIndex } from "./state-migrations.plugin-state-Cv7GW2Cy.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/infra/state-migrations.state-dir.ts
let autoMigrateStateDirChecked = false;
let autoMigrateTaskStateSidecarsChecked = false;
function resetAutoMigrateLegacyStateDirForTest() {
	autoMigrateStateDirChecked = false;
}
function resetAutoMigrateLegacyTaskStateSidecarsForTest() {
	autoMigrateTaskStateSidecarsChecked = false;
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
function isDirPath(filePath) {
	try {
		return fs.statSync(filePath).isDirectory();
	} catch {
		return false;
	}
}
function isEmptyDirPath(filePath) {
	try {
		return fs.readdirSync(filePath).length === 0;
	} catch {
		return false;
	}
}
function isLegacyTreeSymlinkMirror(currentDir, realTargetDir) {
	let entries;
	try {
		entries = fs.readdirSync(currentDir, { withFileTypes: true });
	} catch {
		return false;
	}
	if (entries.length === 0) return false;
	for (const entry of entries) {
		const entryPath = path.join(currentDir, entry.name);
		let stat;
		try {
			stat = fs.lstatSync(entryPath);
		} catch {
			return false;
		}
		if (stat.isSymbolicLink()) {
			const resolvedTarget = resolveSymlinkTarget(entryPath);
			if (!resolvedTarget) return false;
			let resolvedRealTarget;
			try {
				resolvedRealTarget = fs.realpathSync(resolvedTarget);
			} catch {
				return false;
			}
			if (!isWithinDir(realTargetDir, resolvedRealTarget)) return false;
			continue;
		}
		if (stat.isDirectory()) {
			if (!isLegacyTreeSymlinkMirror(entryPath, realTargetDir)) return false;
			continue;
		}
		return false;
	}
	return true;
}
function isLegacyDirSymlinkMirror(legacyDir, targetDir) {
	let realTargetDir;
	try {
		realTargetDir = fs.realpathSync(targetDir);
	} catch {
		return false;
	}
	return isLegacyTreeSymlinkMirror(legacyDir, realTargetDir);
}
function resolvePendingLegacyStateDirMigrationPaths(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	if (env.OPENCLAW_STATE_DIR?.trim()) return;
	const target = resolveNewStateDir(homedir);
	const source = resolveLegacyStateDirs(homedir).find((dir) => fs.existsSync(dir));
	if (!source) return;
	const sourceTarget = resolveSymlinkTarget(source);
	if (sourceTarget && path.resolve(sourceTarget) === path.resolve(target) || isDirPath(target) && isLegacyDirSymlinkMirror(source, target)) return;
	return {
		source,
		target
	};
}
async function autoMigrateLegacyStateDir(params) {
	if (autoMigrateStateDirChecked) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateStateDirChecked = true;
	const homedir = params.homedir ?? os.homedir;
	const env = params.env ?? process.env;
	const warnings = [];
	const changes = [];
	const notices = [];
	const hasCustomStateDir = Boolean(env.OPENCLAW_STATE_DIR?.trim());
	const targetDir = hasCustomStateDir ? resolveStateDir(env, homedir) : resolveNewStateDir(homedir);
	const migratePluginInstallIndex = async () => {
		const result = await migrateLegacyInstalledPluginIndex({ stateDir: targetDir });
		changes.push(...result.changes);
		warnings.push(...result.warnings);
		notices.push(...result.notices ?? []);
	};
	if (hasCustomStateDir) {
		await migratePluginInstallIndex();
		return {
			migrated: changes.length > 0,
			skipped: changes.length === 0 && warnings.length === 0 && notices.length === 0,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
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
	if (!legacyStat) {
		await migratePluginInstallIndex();
		return {
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
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
	let symlinkDepth = 0;
	while (legacyStat.isSymbolicLink()) {
		const legacyTarget = legacyDir ? resolveSymlinkTarget(legacyDir) : null;
		if (!legacyTarget) {
			warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"}); could not resolve target.`);
			return {
				migrated: false,
				skipped: false,
				changes,
				warnings
			};
		}
		if (path.resolve(legacyTarget) === path.resolve(targetDir)) {
			await migratePluginInstallIndex();
			return {
				migrated: changes.length > 0,
				skipped: false,
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
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
		warnings.push(`Legacy state dir is a symlink (${legacyDir ?? "unknown"} → ${legacyTarget}); skipping auto-migration.`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	if (isDirPath(targetDir)) {
		if (legacyDir && isLegacyDirSymlinkMirror(legacyDir, targetDir)) {
			await migratePluginInstallIndex();
			return {
				migrated: changes.length > 0,
				skipped: false,
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
		if (legacyDir && isEmptyDirPath(legacyDir)) try {
			fs.rmdirSync(legacyDir);
			fs.symlinkSync(targetDir, legacyDir, process.platform === "win32" ? "junction" : "dir");
			changes.push(formatStateDirMigration(legacyDir, targetDir));
		} catch (err) {
			warnings.push(`Failed to retire empty legacy state dir (${legacyDir}): ${String(err)}`);
		}
		else warnings.push(`State dir migration skipped: target already exists (${targetDir}). Remove or merge manually.`);
		await migratePluginInstallIndex();
		return {
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
	if (legacyDir) {
		const pluginInstallWarning = preflightLegacyInstalledPluginIndexMigration({ stateDir: legacyDir });
		if (pluginInstallWarning) {
			warnings.push(pluginInstallWarning);
			return {
				migrated: false,
				skipped: false,
				changes,
				warnings
			};
		}
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.renameSync(legacyDir, targetDir);
	} catch (err) {
		warnings.push(`Failed to move legacy state dir (${legacyDir ?? "unknown"} → ${targetDir}): ${String(err)}`);
		return {
			migrated: false,
			skipped: false,
			changes,
			warnings
		};
	}
	try {
		if (!legacyDir) throw new Error("Legacy state dir not found");
		fs.symlinkSync(targetDir, legacyDir, "dir");
		changes.push(formatStateDirMigration(legacyDir, targetDir));
	} catch (err) {
		try {
			if (process.platform === "win32") {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: err });
				fs.symlinkSync(targetDir, legacyDir, "junction");
				changes.push(formatStateDirMigration(legacyDir, targetDir));
			} else throw err;
		} catch (fallbackErr) {
			try {
				if (!legacyDir) throw new Error("Legacy state dir not found", { cause: fallbackErr });
				fs.renameSync(targetDir, legacyDir);
				warnings.push(`State dir migration rolled back (failed to link legacy path): ${String(fallbackErr)}`);
				return {
					migrated: false,
					skipped: false,
					changes: [],
					warnings
				};
			} catch (rollbackErr) {
				warnings.push(`State dir moved but failed to link legacy path (${legacyDir ?? "unknown"} → ${targetDir}): ${String(fallbackErr)}`);
				warnings.push(`Rollback failed; set OPENCLAW_STATE_DIR=${targetDir} to avoid split state: ${String(rollbackErr)}`);
				changes.push(`State dir: ${legacyDir ?? "unknown"} → ${targetDir}`);
			}
		}
	}
	await migratePluginInstallIndex();
	return {
		migrated: changes.length > 0,
		skipped: false,
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {}
	};
}
async function autoMigrateLegacyTaskStateSidecars(params) {
	if (autoMigrateTaskStateSidecarsChecked) return {
		migrated: false,
		skipped: true,
		changes: [],
		warnings: []
	};
	autoMigrateTaskStateSidecarsChecked = true;
	const stateDir = resolveStateDir(params.env ?? process.env, params.homedir);
	const result = await migrateLegacyTaskStateSidecars({ stateDir });
	logStateMigrationResult(result, params.log);
	return {
		migrated: result.changes.length > 0,
		skipped: false,
		changes: result.changes,
		warnings: result.warnings
	};
}
//#endregion
export { resetAutoMigrateLegacyTaskStateSidecarsForTest as a, resolvePendingLegacyStateDirMigrationPaths as c, resetAutoMigrateLegacyStateDirForTest as i, autoMigrateLegacyTaskStateSidecars as n, resolveLegacyProfileWorkspaceMigrationPaths as o, migrateLegacyProfileWorkspace as r, resolvePendingLegacyProfileWorkspaceMigrationPaths as s, autoMigrateLegacyStateDir as t };
