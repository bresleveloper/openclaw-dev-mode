import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as pathExists, w as root } from "./fs-safe-BAPek8At.mjs";
import { i as isPathStrictlyInside, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./errors-DnjwnOju.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as resolveWorkspaceStateIdentity, o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-CmGr5k4K.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { c as assertWorkspaceStateMigrationReady } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { i as resolveSkillManifestMetadata } from "./frontmatter-2H_F0IFB.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { n as readSkillFrontmatterSafe } from "./local-loader-DP-Jr6_I.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-DZF8sfp6.mjs";
import { E as readSkillProposalTargetTreeSha256, L as stripProposalFrontmatterForSkill, a as readSkillProposal, d as resolveSkillProposalTarget, w as hashSkillProposalContent } from "./store-LdKLy4Ms.mjs";
import { u as readWorkspaceSkillFile } from "./workspace-skill-write-BPRCkWOF.mjs";
import { f as validateSkillProposalRecord, r as parseSkillProposalRow } from "./store-sqlite-record-B7LlWdpb.mjs";
import { i as openSkillWorkshopStore } from "./store-sqlite-schema-DWgDn_pU.mjs";
import { t as resolveSkillCollectionBackupRoot } from "./collection-paths-CO63M5VW.mjs";
import { n as readSkillCollectionBackupDrops } from "./collection-review-state-Co_eCFXB.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-skill-workshop-collection-backups.ts
const LEGACY_COLLECTION_BACKUP_SCHEMA = "openclaw.skill-collection-backup.v1";
const MAX_BACKUP_MANIFEST_BYTES = 1048576;
async function listLegacyCollectionBackupRoots(env) {
	const backupRoot = path.join(resolveStateDir(env), "skill-workshop", "collection-backups");
	if (!await pathExists(backupRoot)) return [];
	return (await fs.readdir(backupRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory() && /^[a-f0-9]{16}$/u.test(entry.name)).map((entry) => path.join(backupRoot, entry.name));
}
async function listLegacyCollectionBackupWorkspaceDirs(env) {
	const workspaces = /* @__PURE__ */ new Set();
	for (const legacyRoot of await listLegacyCollectionBackupRoots(env)) try {
		for (const backup of await readLegacyCollectionBackups(legacyRoot)) workspaces.add(backup.workspaceDir);
	} catch {}
	return [...workspaces];
}
async function listPendingLegacyCollectionBackupRoots(config, env) {
	const roots = [];
	for (const legacyRoot of await listLegacyCollectionBackupRoots(env)) {
		if (isUpdateRehearsalReadOnlyPath(legacyRoot, env)) continue;
		try {
			const backups = await readLegacyCollectionBackups(legacyRoot);
			if (backups.length === 0 || backups.some((backup) => isReadOnlyRehearsalBackup(backup, env))) continue;
			const workspaceDirs = new Set(backups.map((backup) => backup.workspaceDir));
			const workspaceDir = [...workspaceDirs][0];
			const candidateAgentIds = [...new Set([...workspaceDirs].flatMap((directory) => listWorkspaceOwnerAgentIds(config, env, directory)))].toSorted();
			let ownerAgentId = workspaceDirs.size === 1 && workspaceDir && candidateAgentIds.length === 1 ? candidateAgentIds[0] : void 0;
			if (workspaceDirs.size === 1 && candidateAgentIds.length === 0) {
				const verifiedAgents = await verifyLegacyCollectionBackupOwners(backups, config, env);
				const candidates = verifiedAgents.filter((agent) => agent.verified);
				if (candidates.length === 1) ownerAgentId = candidates[0]?.agentId;
				else {
					roots.push({
						legacyRoot,
						warning: `Preserved legacy collection backup root ${legacyRoot}: ${candidates.length === 0 ? "no verified owner" : "multiple verified owners"} after workspace move (candidate agents: ${candidates.map((agent) => agent.agentId).join(", ") || "none"}). ${verifiedAgents.map((agent) => agent.detail).join("; ")}. Pause Workshop writes and compare copies of the retained backup and current skills using https://docs.openclaw.ai/tools/skill-workshop/collection-review#when-an-older-backup-cannot-be-restored-automatically; keep the original manifest unchanged. Retry Doctor after resolving the ownership evidence.`,
						recoverable: true
					});
					continue;
				}
			}
			if (!ownerAgentId) {
				roots.push({
					legacyRoot,
					warning: `Preserved legacy collection backup root ${legacyRoot} for manual review: workspace ${[...workspaceDirs].join(", ")} does not map to exactly one configured agent (candidate agents: ${candidateAgentIds.join(", ") || "none"}). Review the workspace ownership and retained backup manifests before retrying Doctor.`,
					recoverable: true
				});
				continue;
			}
			assertWorkspaceStateMigrationReady({
				workspaceDirs: [...workspaceDirs],
				env,
				operation: "doctor"
			});
			const destinationRoot = resolveSkillCollectionBackupRoot(config, ownerAgentId, env);
			if (isUpdateRehearsalReadOnlyPath(destinationRoot, env)) continue;
			const alreadyArchived = await Promise.all(backups.map((backup) => isHistoryOnlyBackup(path.join(destinationRoot, backup.manifest.id))));
			const pendingBackups = backups.filter((_, index) => !alreadyArchived[index]);
			if (pendingBackups.length > 0) roots.push({
				legacyRoot,
				backups: pendingBackups,
				ownerAgentId,
				destinationRoot
			});
		} catch (error) {
			roots.push({
				legacyRoot,
				warning: `Preserved legacy collection backup root ${legacyRoot}: ${String(error)}`
			});
		}
	}
	return roots;
}
function isReadOnlyRehearsalBackup(backup, env) {
	return [
		backup.backupDir,
		backup.workspaceDir,
		...[...backup.sourceDirs.values()].flatMap((relativeDir) => [path.join(backup.workspaceDir, relativeDir), path.join(backup.backupDir, "workspace", relativeDir)])
	].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env));
}
function inferWorkspaceOwnerAgentId(config, env, workspaceDir) {
	const workspaceMatches = listWorkspaceOwnerAgentIds(config, env, workspaceDir);
	return workspaceMatches.length === 1 ? workspaceMatches[0] : void 0;
}
function listWorkspaceOwnerAgentIds(config, env, workspaceDir) {
	return listAgentIds(config).filter((agentId) => resolveCanonicalWorkspacePath(resolveAgentWorkspaceDir(config, agentId, env)) === resolveCanonicalWorkspacePath(workspaceDir));
}
function legacyCollectionSkillPath(workspaceDir, relativeDir) {
	if (!relativeDir || path.isAbsolute(relativeDir) || relativeDir !== path.normalize(relativeDir)) throw new Error(`invalid skill path ${relativeDir}`);
	const absoluteDir = path.resolve(workspaceDir, relativeDir);
	const writableRoot = [path.resolve(workspaceDir, "skills"), path.resolve(workspaceDir, ".agents", "skills")].find((rootDir) => isPathStrictlyInside(rootDir, absoluteDir));
	if (!writableRoot) throw new Error(`skill path is outside the workspace skill roots: ${relativeDir}`);
	return path.relative(writableRoot, absoluteDir);
}
function readLegacyCollectionBackupManifest(value, backupDir) {
	const backupId = path.basename(backupDir);
	const record = asNullableRecord(value);
	const skillDirs = record?.skillDirs;
	const resultSkillDirs = record?.resultSkillDirs;
	if (record?.schema !== LEGACY_COLLECTION_BACKUP_SCHEMA || record.id !== backupId || typeof record.createdAt !== "string" || typeof record.workspaceDir !== "string" || !Array.isArray(skillDirs) || !skillDirs.every((entry) => typeof entry === "string") || !Array.isArray(resultSkillDirs) || !resultSkillDirs.every((entry) => typeof entry === "string")) throw new Error(`invalid legacy collection backup manifest: ${backupId}`);
	const workspaceDir = path.resolve(record.workspaceDir);
	const convertedDirs = new Map([.../* @__PURE__ */ new Set([...skillDirs, ...resultSkillDirs])].map((relativeDir) => [relativeDir, legacyCollectionSkillPath(workspaceDir, relativeDir)]));
	const sourceDirs = new Map([...convertedDirs].map(([source, destination]) => [destination, source]));
	if (sourceDirs.size !== convertedDirs.size) throw new Error(`legacy collection backup paths collide: ${backupId}`);
	const resultSkillHashes = asNullableRecord(record.resultSkillHashes);
	if (!resultSkillHashes) throw new Error(`invalid legacy collection backup hashes: ${backupId}`);
	const parsedResultSkillHashes = {};
	for (const relativeDir of resultSkillDirs) {
		const hash = resultSkillHashes[relativeDir];
		if (typeof hash !== "string") throw new Error(`invalid legacy collection backup hashes: ${backupId}`);
		parsedResultSkillHashes[convertedDirs.get(relativeDir)] = hash;
	}
	if (Object.keys(resultSkillHashes).some((key) => !resultSkillDirs.includes(key))) throw new Error(`invalid legacy collection backup hashes: ${backupId}`);
	return {
		backupDir,
		workspaceDir,
		sourceDirs,
		manifest: {
			schema: "openclaw.skill-collection-backup.v2",
			id: backupId,
			createdAt: record.createdAt,
			skillDirs: [...new Set(skillDirs)].map((relativeDir) => convertedDirs.get(relativeDir)),
			resultSkillDirs: [...new Set(resultSkillDirs)].map((relativeDir) => convertedDirs.get(relativeDir)),
			resultSkillHashes: parsedResultSkillHashes
		}
	};
}
async function readLegacyCollectionBackups(backupRoot) {
	const entries = await fs.readdir(backupRoot, { withFileTypes: true });
	const backups = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith(".pending-")) continue;
		const manifestText = await fs.readFile(path.join(backupRoot, entry.name, "manifest.json"), "utf8");
		if (Buffer.byteLength(manifestText, "utf8") > MAX_BACKUP_MANIFEST_BYTES) throw new Error(`legacy collection backup manifest is too large: ${entry.name}`);
		backups.push(readLegacyCollectionBackupManifest(JSON.parse(manifestText), path.join(backupRoot, entry.name)));
	}
	return backups;
}
async function hasNewerUnrelatedCollectionBackup(backupRoot, backups) {
	const pending = new Map(backups.map((backup) => [backup.manifest.id, backup]));
	const newestLegacy = backups.map((backup) => backup.manifest.createdAt).toSorted().at(-1);
	const entries = await fs.readdir(backupRoot, { withFileTypes: true }).catch(() => []);
	return (await Promise.all(entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".pending-")).map(async (entry) => {
		const backup = pending.get(entry.name);
		if (backup) {
			await verifyLegacyCollectionBackupCopy(backup, path.join(backupRoot, entry.name));
			return false;
		}
		const record = asNullableRecord(JSON.parse(await fs.readFile(path.join(backupRoot, entry.name, "manifest.json"), "utf8")));
		return record?.schema === "openclaw.skill-collection-backup.v2" && typeof record.restoreUnavailableReason !== "string" && typeof record.createdAt === "string" && record.createdAt.localeCompare(newestLegacy) >= 0;
	}))).some(Boolean);
}
async function isHistoryOnlyBackup(backupDir) {
	try {
		const record = asNullableRecord(JSON.parse(await fs.readFile(path.join(backupDir, "manifest.json"), "utf8")));
		return record?.schema === "openclaw.skill-collection-backup.v2" && record.id === path.basename(backupDir) && typeof record.restoreUnavailableReason === "string";
	} catch {
		return false;
	}
}
async function readLegacyBackupSkillKey(backup, relativeDir, fallbackKey, maxSkillFileBytes) {
	const skillDir = path.join(backup.backupDir, "workspace", backup.sourceDirs.get(relativeDir));
	const frontmatter = readSkillFrontmatterSafe({
		rootDir: skillDir,
		filePath: path.join(skillDir, "SKILL.md"),
		maxBytes: maxSkillFileBytes
	});
	if (!frontmatter) return await pathExists(skillDir) ? void 0 : fallbackKey;
	return (resolveSkillManifestMetadata(frontmatter)?.skillKey ?? frontmatter.name)?.trim();
}
async function verifyLegacyCollectionBackupOwners(backups, config, env) {
	const maxSkillFileBytes = resolveSkillDiscoveryLimits(config).maxSkillFileBytes;
	const results = await Promise.all(backups.flatMap((backup) => backup.manifest.resultSkillDirs.map(async (relativeDir) => ({
		label: `${backup.manifest.id}/${relativeDir}`,
		hash: backup.manifest.resultSkillHashes[relativeDir],
		skillKey: await readLegacyBackupSkillKey(backup, relativeDir, backup.manifest.skillDirs.includes(relativeDir) ? void 0 : path.basename(relativeDir), maxSkillFileBytes)
	}))));
	const emptyBackups = backups.filter((backup) => backup.manifest.resultSkillDirs.length === 0);
	return Promise.all(listAgentIds(config).toSorted().map(async (agentId) => {
		let matches = 0;
		const failures = emptyBackups.map((backup) => `${backup.manifest.id}: no recorded result hashes`);
		for (const result of results) try {
			if (!result.skillKey) throw new Error("saved skill identity unavailable");
			const target = resolveSkillProposalTarget({
				skillName: result.skillKey,
				config,
				agentId,
				env
			});
			if (isUpdateRehearsalReadOnlyPath(target.skillDir, env)) throw new Error("Workshop target is outside the update rehearsal");
			if (!await pathExists(target.skillDir)) throw new Error("Workshop skill missing");
			if (await readSkillProposalTargetTreeSha256(target.skillDir) !== result.hash) throw new Error("result hash differs");
			matches += 1;
		} catch (error) {
			failures.push(`${result.label}: ${String(error)}`);
		}
		return {
			agentId,
			verified: results.length > 0 && failures.length === 0,
			detail: `agent ${agentId}: ${matches}/${results.length} skills match${failures.length > 0 ? ` (${failures.join(", ")})` : ""}`
		};
	}));
}
async function findUnownedLegacyCollectionBackupDirs(backup, config, env, ownerAgentId) {
	const unownedDirs = new Set(backup.sourceDirs.values());
	const backedUpDirs = new Set(backup.manifest.skillDirs);
	const resultDirs = new Set(backup.manifest.resultSkillDirs);
	const droppedNames = readSkillCollectionBackupDrops(ownerAgentId, backup.manifest.id, { env });
	const { database, kysely } = openSkillWorkshopStore({ env });
	const appliedCreates = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("owner_agent_id", "=", ownerAgentId).where("kind", "=", "create")).rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record?.appliedAt !== void 0 ? [record] : [];
	});
	const maxSkillFileBytes = resolveSkillDiscoveryLimits(config).maxSkillFileBytes;
	for (const [relativeDir, sourceDir] of backup.sourceDirs) {
		const legacyPath = path.resolve(backup.workspaceDir, sourceDir);
		if (await pathExists(legacyPath)) continue;
		const skillKey = await readLegacyBackupSkillKey(backup, relativeDir, backedUpDirs.has(relativeDir) ? void 0 : path.basename(relativeDir), maxSkillFileBytes);
		if (!skillKey) continue;
		const target = resolveSkillProposalTarget({
			skillName: skillKey,
			config,
			agentId: ownerAgentId,
			env
		});
		const targetExists = await pathExists(target.skillDir);
		if (!resultDirs.has(relativeDir)) {
			if (!targetExists && droppedNames.has(skillKey) && appliedCreates.some((record) => path.resolve(record.target.skillDir) === legacyPath && path.resolve(record.target.skillFile) === path.join(legacyPath, "SKILL.md") && record.target.skillKey === skillKey)) unownedDirs.delete(sourceDir);
			continue;
		}
		if (!targetExists) continue;
		if (await readSkillProposalTargetTreeSha256(target.skillDir) === backup.manifest.resultSkillHashes[relativeDir]) unownedDirs.delete(sourceDir);
	}
	return [...unownedDirs];
}
async function verifyLegacyCollectionBackupCopy(backup, destination) {
	const published = JSON.parse(await fs.readFile(path.join(destination, "manifest.json"), "utf8"));
	if (!isDeepStrictEqual(published, backup.manifest)) throw new Error(`destination backup manifest differs: ${destination}`);
	for (const relativeDir of backup.manifest.skillDirs) {
		const source = path.join(backup.backupDir, "workspace", backup.sourceDirs.get(relativeDir));
		const copied = path.join(destination, "skills", relativeDir);
		await Promise.all([fs.access(source), fs.access(copied)]);
		const [sourceHash, copiedHash] = await Promise.all([source, copied].map((skillDir) => readSkillProposalTargetTreeSha256(skillDir, { includeRootMetadata: true })));
		if (sourceHash !== copiedHash) throw new Error(`destination backup contents differ: ${destination}`);
	}
}
async function publishLegacyCollectionBackup(backup, destinationRoot, config, env, ownerAgentId, newerBackupExists) {
	const destination = path.join(destinationRoot, backup.manifest.id);
	if (await pathExists(destination)) return true;
	if (newerBackupExists) throw new Error(`newer agent backup already exists at ${destinationRoot}`);
	const unownedDirs = await findUnownedLegacyCollectionBackupDirs(backup, config, env, ownerAgentId);
	const restorable = unownedDirs.length === 0;
	const manifest = restorable ? backup.manifest : {
		...backup.manifest,
		skillDirs: [],
		resultSkillDirs: [],
		resultSkillHashes: {},
		restoreUnavailableReason: `Legacy collection paths are not proven Workshop-owned: ${unownedDirs.join(", ")}`
	};
	const copies = restorable ? backup.manifest.skillDirs.map((relativeDir) => ({
		source: path.join(backup.backupDir, "workspace", backup.sourceDirs.get(relativeDir)),
		relativeDir: path.join("skills", relativeDir)
	})) : [{
		source: path.join(backup.backupDir, "workspace"),
		relativeDir: path.join("history", "workspace")
	}];
	const staging = path.join(destinationRoot, `.pending-legacy-${backup.manifest.id}-${randomUUID()}`);
	try {
		await fs.mkdir(path.join(staging, restorable ? "skills" : "history"), { recursive: true });
		for (const copy of copies) {
			const copied = path.join(staging, copy.relativeDir);
			await fs.mkdir(path.dirname(copied), { recursive: true });
			await fs.cp(copy.source, copied, {
				recursive: true,
				errorOnExist: true,
				force: false,
				preserveTimestamps: true
			});
		}
		await fs.writeFile(path.join(staging, "manifest.json"), JSON.stringify(manifest, null, 2));
		await fs.rename(staging, destination);
	} catch (error) {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
		throw error;
	}
	return restorable;
}
async function migrateLegacyCollectionBackups(config, env, roots) {
	let migrated = 0;
	let recoverableWarningCount = 0;
	const warnings = [];
	for (const root of roots) {
		if ("warning" in root) {
			warnings.push(root.warning);
			if (root.recoverable) recoverableWarningCount += 1;
			continue;
		}
		const { legacyRoot, backups, ownerAgentId, destinationRoot } = root;
		if ([legacyRoot, destinationRoot].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env)) || backups.some((backup) => isReadOnlyRehearsalBackup(backup, env))) continue;
		try {
			const newerBackupExists = await hasNewerUnrelatedCollectionBackup(destinationRoot, backups);
			const restorable = [];
			for (const backup of backups) if (await publishLegacyCollectionBackup(backup, destinationRoot, config, env, ownerAgentId, newerBackupExists)) restorable.push(backup);
			for (const backup of restorable) await verifyLegacyCollectionBackupCopy(backup, path.join(destinationRoot, backup.manifest.id));
			for (const backup of restorable) {
				if (isReadOnlyRehearsalBackup(backup, env)) continue;
				await fs.rm(backup.backupDir, {
					recursive: true,
					force: false
				});
			}
			if ((await fs.readdir(legacyRoot)).length === 0) await fs.rmdir(legacyRoot);
			migrated += 1;
		} catch (error) {
			warnings.push(`Preserved legacy collection backup root ${legacyRoot}: ${String(error)}`);
		}
	}
	return {
		migrated,
		warnings,
		recoverableWarningCount
	};
}
//#endregion
//#region src/commands/doctor-skill-workshop-relocation.ts
const INVALID_LEGACY_SKILL_REASON = "Skill Workshop could not load the applied legacy skill; the path stays in place and the proposal is stale.";
function isReadOnlyRehearsalProposal(record, env) {
	return [
		record.target.skillDir,
		record.target.skillFile,
		...(record.supportFiles ?? []).map((file) => path.join(record.target.skillDir, file.path))
	].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env));
}
function resolveLegacyWorkshopWorkspaceDir(skillDir, config, env) {
	const source = path.resolve(skillDir);
	const configured = listAgentIds(config).flatMap((agentId) => {
		const workspaceDir = path.resolve(resolveAgentWorkspaceDir(config, agentId, env));
		return [workspaceDir, resolveCanonicalWorkspacePath(workspaceDir)];
	}).toSorted((left, right) => right.length - left.length).find((workspaceDir) => [path.join(workspaceDir, "skills"), path.join(workspaceDir, ".agents", "skills")].some((skillsRoot) => isPathInside(skillsRoot, source)));
	if (configured) return configured;
	for (let directory = path.dirname(source); directory !== path.dirname(directory);) {
		if (path.basename(directory) === "skills") {
			const parent = path.dirname(directory);
			return path.basename(parent) === ".agents" ? path.dirname(parent) : parent;
		}
		directory = path.dirname(directory);
	}
}
function inferOwnerAgentId(params) {
	let ownerAgentId;
	if (params.rowOwnerAgentId) ownerAgentId = normalizeAgentId(params.rowOwnerAgentId);
	else if (params.record.origin?.agentId) ownerAgentId = normalizeAgentId(params.record.origin.agentId);
	else if (params.record.origin?.sessionKey) {
		const sessionAgentId = parseAgentSessionKey(params.record.origin.sessionKey)?.agentId;
		if (sessionAgentId) ownerAgentId = normalizeAgentId(sessionAgentId);
	}
	if (!ownerAgentId && params.workspaceDir) ownerAgentId = inferWorkspaceOwnerAgentId(params.config, params.env, params.workspaceDir);
	if (!ownerAgentId) return {};
	return listAgentIds(params.config).includes(ownerAgentId) ? { ownerAgentId } : { unconfiguredOwnerAgentId: ownerAgentId };
}
async function verifyRelocationDestination(params) {
	const content = await readWorkspaceSkillFile(params.destinationSkillFile);
	const frontmatter = readSkillFrontmatterSafe({
		rootDir: params.destinationSkillDir,
		filePath: params.destinationSkillFile,
		maxBytes: resolveSkillDiscoveryLimits(params.config).maxSkillFileBytes
	});
	const name = frontmatter?.name?.trim();
	const skillKey = frontmatter ? (resolveSkillManifestMetadata(frontmatter)?.skillKey ?? name)?.trim() : void 0;
	if (content === null || skillKey !== params.skillKey) return false;
	const contentHash = hashSkillProposalContent(content);
	for (const record of params.records) {
		if (record.status === "pending") {
			if (record.kind === "update" && record.target.currentContentHash === contentHash) return true;
			continue;
		}
		let appliedContentHash = record.kind === "create" ? record.draftHash : void 0;
		try {
			const proposal = await readSkillProposal(record.id, {
				config: params.config,
				env: params.env
			}, {}, {
				config: params.config,
				reconcile: false
			});
			if (proposal) appliedContentHash = hashSkillProposalContent(stripProposalFrontmatterForSkill(proposal.content));
		} catch {}
		if (contentHash === appliedContentHash) return true;
	}
	return false;
}
function retargetWorkshopProposal(record, target) {
	return {
		...record,
		target: {
			...record.target,
			skillDir: target.skillDir,
			skillFile: target.skillFile,
			source: "openclaw-workshop"
		}
	};
}
function staleWorkshopProposal(record, reason) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		...record,
		status: "stale",
		updatedAt: now,
		staleAt: now,
		statusReason: reason
	};
}
async function readLegacyWorkshopSourceStat(workspaceDir, source) {
	let sourceStat;
	try {
		let directory = workspaceDir;
		for (const segment of path.relative(workspaceDir, source).split(path.sep)) {
			directory = path.join(directory, segment);
			sourceStat = await fs.lstat(directory);
			if (sourceStat.isSymbolicLink()) break;
		}
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		return;
	}
	return sourceStat;
}
function classifyWorkshopRelocation(records, config, env, deferredSources = /* @__PURE__ */ new Set()) {
	const candidates = records.flatMap((entry) => {
		if (entry.record.status !== "pending" && entry.record.status !== "applied") return [];
		const source = path.resolve(entry.record.target.skillDir);
		const workspaceDir = resolveLegacyWorkshopWorkspaceDir(source, config, env);
		const owner = inferOwnerAgentId({
			config,
			env,
			record: entry.record,
			workspaceDir,
			rowOwnerAgentId: entry.ownerAgentId
		});
		if (owner.ownerAgentId && entry.ownerAgentId && isPathInside(path.resolve(resolveWorkshopSkillsDir(config, owner.ownerAgentId, env)), source)) return [];
		return [{
			record: entry.record,
			source,
			workspaceDir,
			deferred: deferredSources.size > 0 && deferredSources.has(resolveCanonicalWorkspacePath(source)),
			...owner
		}];
	});
	return {
		candidates,
		external: candidates.filter(({ record }) => record.status === "pending" || record.kind === "create")
	};
}
async function planWorkshopRelocation(records, config, env, deferredSources = /* @__PURE__ */ new Set(), unavailableWorkspaceDirs = /* @__PURE__ */ new Map(), recoverableDeferredSources = /* @__PURE__ */ new Set()) {
	const { candidates, external } = classifyWorkshopRelocation(records.filter(({ record }) => !isReadOnlyRehearsalProposal(record, env)), config, env, deferredSources);
	const warnings = [];
	let recoverableWarningCount = 0;
	const deferredWorkspaces = /* @__PURE__ */ new Set();
	for (const workspaceDir of new Set(external.map((plan) => plan.workspaceDir))) {
		if (!workspaceDir || unavailableWorkspaceDirs.has(resolveWorkspaceStateIdentity(workspaceDir).workspacePath)) continue;
		try {
			assertWorkspaceStateMigrationReady({
				workspaceDirs: [workspaceDir],
				env,
				operation: "doctor"
			});
		} catch (error) {
			deferredWorkspaces.add(workspaceDir);
			warnings.push(String(error));
		}
	}
	const relocations = /* @__PURE__ */ new Map();
	for (const plan of external) {
		plan.unavailableReason = plan.workspaceDir ? unavailableWorkspaceDirs.get(resolveWorkspaceStateIdentity(plan.workspaceDir).workspacePath) : void 0;
		plan.deferred ||= Boolean(plan.workspaceDir && deferredWorkspaces.has(plan.workspaceDir));
		if (!plan.ownerAgentId || plan.record.status === "applied" && !plan.workspaceDir) continue;
		const target = resolveSkillProposalTarget({
			skillName: plan.record.target.skillKey,
			config,
			agentId: plan.ownerAgentId,
			env
		});
		if ([target.skillDir, target.skillFile].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env))) {
			plan.deferred = true;
			continue;
		}
		const key = [
			plan.ownerAgentId,
			plan.source,
			path.resolve(plan.record.target.skillFile),
			plan.record.target.skillKey,
			target.skillDir
		].join("\0");
		plan.relocation = relocations.get(key) ?? {
			target,
			plans: []
		};
		plan.relocation.plans.push(plan);
		relocations.set(key, plan.relocation);
	}
	const moves = [];
	for (const relocation of relocations.values()) {
		if (relocation.plans.some((plan) => plan.deferred)) continue;
		const unavailableReason = relocation.plans.find((plan) => plan.unavailableReason)?.unavailableReason;
		if (unavailableReason) {
			relocation.rejection = unavailableReason;
			continue;
		}
		const plan = relocation.plans.find(({ record }) => record.kind === "create" && record.status === "applied");
		if (!plan?.workspaceDir) continue;
		const { record } = plan;
		const { target } = relocation;
		let operation = "move";
		const sourceStat = await readLegacyWorkshopSourceStat(plan.workspaceDir, plan.source);
		if (sourceStat?.isSymbolicLink()) {
			relocation.rejection = `Skill Workshop no longer writes through symlinked skills; ${plan.source} stays a workspace skill.`;
			continue;
		}
		if (!sourceStat) {
			if (!await pathExists(target.skillFile)) {
				relocation.rejection = "Skill Workshop could not find the applied legacy skill; the proposal is stale.";
				continue;
			}
			if (!await verifyRelocationDestination({
				records: candidates.filter(({ record: candidate, source, ownerAgentId }) => ownerAgentId === plan.ownerAgentId && source === plan.source && candidate.target.skillKey === record.target.skillKey && path.resolve(candidate.target.skillFile) === path.resolve(record.target.skillFile)).map((candidate) => candidate.record),
				skillKey: target.skillKey,
				destinationSkillDir: target.skillDir,
				destinationSkillFile: target.skillFile,
				config,
				env
			})) {
				relocation.rejection = "Skill Workshop could not adopt the relocated skill: destination identity mismatch (content hash or frontmatter name/key); the proposal is stale.";
				continue;
			}
			operation = "adopt";
		} else {
			if (!readSkillFrontmatterSafe({
				rootDir: plan.source,
				filePath: path.join(plan.source, "SKILL.md"),
				maxBytes: resolveSkillDiscoveryLimits(config).maxSkillFileBytes
			})?.description?.trim()) {
				relocation.rejection = INVALID_LEGACY_SKILL_REASON;
				continue;
			}
			if (await pathExists(target.skillDir)) {
				const destinationStat = await fs.lstat(target.skillDir);
				let copied = false;
				if (destinationStat.isDirectory()) {
					const [sourceHash, destinationHash] = await Promise.all([plan.source, target.skillDir].map((skillDir) => readSkillProposalTargetTreeSha256(skillDir, { includeRootMetadata: true })));
					copied = sourceHash === destinationHash;
				}
				if (!copied) {
					relocation.rejection = `Skill Workshop relocation conflict: destination already exists at ${target.skillDir}.`;
					continue;
				}
				operation = "remove-source";
			}
		}
		relocation.move = {
			source: plan.source,
			workspaceDir: plan.workspaceDir,
			destination: target.skillDir,
			operation,
			updates: []
		};
		moves.push(relocation.move);
	}
	const conflictsBySource = /* @__PURE__ */ new Map();
	const sources = moves.map((move) => ({
		move,
		source: resolveCanonicalWorkspacePath(move.source)
	}));
	const deferredReservations = external.filter((plan) => plan.deferred).map((plan) => ({
		source: resolveCanonicalWorkspacePath(plan.source),
		destination: plan.relocation?.target.skillDir,
		recoverable: recoverableDeferredSources.has(resolveCanonicalWorkspacePath(plan.source))
	}));
	const deferredMoves = /* @__PURE__ */ new Set();
	for (const reservation of deferredReservations) for (const { move, source } of sources) if (!deferredMoves.has(move) && (reservation.destination === move.destination || isPathInside(reservation.source, source) || isPathInside(source, reservation.source))) {
		deferredMoves.add(move);
		deferredReservations.push({
			source,
			destination: move.destination,
			recoverable: reservation.recoverable
		});
		if (reservation.recoverable) recoverableWarningCount += 1;
		warnings.push(`Skill Workshop left ${move.source} in place because a connected skill still needs migration or recovery.`);
	}
	const deferredMoveSources = new Set([...deferredMoves].map((move) => move.source));
	const workspaces = listAgentIds(config).map((agentId) => resolveCanonicalWorkspacePath(resolveAgentWorkspaceDir(config, agentId, env)));
	for (const { move, source } of sources) {
		const sharedDestination = moves.filter((other) => other.destination === move.destination);
		const overlap = sources.find(({ move: other, source: otherSource }) => other !== move && (isPathInside(source, otherSource) || isPathInside(otherSource, source)));
		const workspace = workspaces.find((directory) => isPathInside(source, directory));
		const reason = sharedDestination.length > 1 ? `Skill Workshop relocation conflict: sources ${sharedDestination.map((other) => other.source).toSorted().join(", ")} map to the same destination ${move.destination}.` : overlap ? `Skill Workshop relocation conflict: source ${move.source} overlaps source ${overlap.move.source} targeting ${overlap.move.destination}.` : workspace ? `Skill Workshop relocation conflict: source ${move.source} contains configured workspace ${workspace}.` : void 0;
		if (reason) conflictsBySource.set(move.source, reason);
	}
	const updates = [];
	for (const plan of external) {
		if (plan.deferred || deferredMoveSources.has(plan.source)) continue;
		const { record, relocation, ownerAgentId } = plan;
		const conflictReason = conflictsBySource.get(plan.source);
		if (!relocation) {
			updates.push({
				record: staleWorkshopProposal(record, plan.unavailableReason ?? conflictReason ?? (ownerAgentId ? "Skill Workshop could not identify the legacy workspace; the path stays in place and the proposal is stale." : plan.unconfiguredOwnerAgentId ? `Skill Workshop could not use unconfigured owning agent "${plan.unconfiguredOwnerAgentId}"; the legacy path stays in place and the proposal is stale.` : "Skill Workshop could not identify one owning agent; the legacy path stays in place and the proposal is stale.")),
				...ownerAgentId ? { ownerAgentId } : {}
			});
			continue;
		}
		const { target, move } = relocation;
		const staleReason = conflictReason ?? relocation.rejection ?? (!move && record.kind === "update" ? "Skill Workshop no longer edits skills outside its own directory." : void 0);
		const update = {
			record: staleReason ? staleWorkshopProposal(record, staleReason) : retargetWorkshopProposal(record, target),
			...ownerAgentId ? { ownerAgentId } : {}
		};
		(move && !staleReason ? move.updates : updates).push(update);
	}
	return {
		moves: moves.filter((move) => !conflictsBySource.has(move.source) && !deferredMoveSources.has(move.source)),
		updates,
		warnings,
		recoverableWarningCount
	};
}
//#endregion
//#region src/commands/doctor-skill-workshop-sources.ts
const LEGACY_WORKSHOP_PROPOSALS_DIR = "skill-workshop/proposals";
const LEGACY_WORKSHOP_MAX_RECORD_BYTES = 1048576;
const LEGACY_WORKSHOP_PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
async function readLegacyWorkshopJson(rootDir, relativePath, maxBytes) {
	const read = await rootDir.read(relativePath, {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	});
	return JSON.parse(read.buffer.toString("utf8"));
}
async function readWorkshopMigrationRecords(env, includeEvents = false) {
	const context = captureOpenClawStateWorkerContext({ env });
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	context.admission.assertCurrent();
	return await runOpenClawStateWorkerOperation(context, async (scope) => {
		const records = await scope.execute({
			type: "doctor.workshopMigrationRecords.read",
			input: { includeEvents }
		});
		context.admission.assertCurrent();
		return records;
	}, { existingOnly: true }) ?? {
		records: [],
		appliedEvents: []
	};
}
async function listLegacySkillWorkshopWorkspaceDirs(config, env) {
	const { records } = await readWorkshopMigrationRecords(env);
	const stateDir = resolveStateDir(env);
	if (await pathExists(path.join(stateDir, "skill-workshop/proposals"))) {
		const stateRoot = await root(stateDir);
		for (const entry of await stateRoot.list(LEGACY_WORKSHOP_PROPOSALS_DIR, { withFileTypes: true })) {
			if (!entry.isDirectory || !LEGACY_WORKSHOP_PROPOSAL_ID_PATTERN.test(entry.name)) continue;
			try {
				const parsed = validateSkillProposalRecord(await readLegacyWorkshopJson(stateRoot, `${LEGACY_WORKSHOP_PROPOSALS_DIR}/${entry.name}/proposal.json`, LEGACY_WORKSHOP_MAX_RECORD_BYTES));
				if (parsed.ok && parsed.value.id === entry.name) records.push({
					record: parsed.value,
					ownerAgentId: null
				});
			} catch {}
		}
	}
	const { external } = classifyWorkshopRelocation(records, config, env);
	return [.../* @__PURE__ */ new Set([...external.flatMap(({ workspaceDir }) => workspaceDir ? [workspaceDir] : []), ...await listLegacyCollectionBackupWorkspaceDirs(env)])];
}
//#endregion
export { readLegacyWorkshopJson as a, inferOwnerAgentId as c, readLegacyWorkshopSourceStat as d, resolveLegacyWorkshopWorkspaceDir as f, migrateLegacyCollectionBackups as h, listLegacySkillWorkshopWorkspaceDirs as i, isReadOnlyRehearsalProposal as l, listWorkspaceOwnerAgentIds as m, LEGACY_WORKSHOP_PROPOSALS_DIR as n, readWorkshopMigrationRecords as o, listPendingLegacyCollectionBackupRoots as p, LEGACY_WORKSHOP_PROPOSAL_ID_PATTERN as r, classifyWorkshopRelocation as s, LEGACY_WORKSHOP_MAX_RECORD_BYTES as t, planWorkshopRelocation as u };
