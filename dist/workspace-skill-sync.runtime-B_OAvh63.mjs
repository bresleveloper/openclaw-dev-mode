import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import { d as resolveSandboxPath } from "./sandbox-paths-Br7HP2l8.mjs";
import { n as resolveSkillTelemetrySource } from "./source-DbWOnpPI.mjs";
import { t as canonicalizePath } from "./paths-DqLuHi-X.mjs";
import { r as resolveSkillKey } from "./frontmatter-CrckYGsg.mjs";
import { a as prepareSkillLibrarySelection, o as readSelectedSkillLibraryFiles } from "./selection-Cr4O9thc.mjs";
import { n as getSkillsResourceVersion, r as getSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { c as fingerprintSkillSnapshotConfig, i as prepareWorkspaceSkills } from "./workspace-skill-loader-CjoWF6nl.mjs";
import { a as shouldSyncSkillPath } from "./skill-paths-BxFt63--.mjs";
import { r as resolveSkillSnapshotExecutionFileHost } from "./skill-snapshot-provenance-B47tYPIJ.mjs";
import { t as ensureWritableSkillDirectories } from "./skill-directory-modes-DeO1nfYy.mjs";
import fs from "node:fs";
import path from "node:path";
import { root } from "@openclaw/fs-safe/root";
//#region src/skills/loading/workspace-skill-sync.runtime.ts
const fsp = fs.promises;
const skillsLogger = createSubsystemLogger("skills");
const skillsSyncQueue = new KeyedAsyncQueue();
const SYNCED_SKILLS_MANIFEST_NAME = ".openclaw-sync.json";
const syncedSkillsUsageCache = /* @__PURE__ */ new Map();
function resolveSyncedSkillIdentity(skillKey, skillName) {
	return JSON.stringify([skillKey, skillName]);
}
function parseSyncedSkillsManifest(value) {
	if (!isRecord(value) || typeof value.skillsVersion !== "number" || !Number.isFinite(value.skillsVersion) || typeof value.skillRootsFingerprint !== "string" || !Array.isArray(value.entryKeys) || !value.entryKeys.every((entry) => typeof entry === "string")) return null;
	return {
		entryKeys: value.entryKeys,
		skillRootsFingerprint: value.skillRootsFingerprint,
		skillsVersion: value.skillsVersion
	};
}
function resolveSyncedSkillsManifestKey(manifest) {
	return JSON.stringify([
		manifest.skillsVersion,
		manifest.skillRootsFingerprint,
		manifest.entryKeys
	]);
}
async function ensureSyncedSkillsDirectory(targetSkillsDir, assertCurrent) {
	try {
		const stat = await fsp.lstat(targetSkillsDir);
		assertCurrent?.();
		if (stat.isDirectory()) return;
		await removePathWithinRoot({
			rootDir: path.dirname(targetSkillsDir),
			relativePath: path.basename(targetSkillsDir),
			recursive: true,
			symlinks: "unlink",
			assertBeforeMutation: assertCurrent
		});
	} catch (error) {
		assertCurrent?.();
		if (error.code !== "ENOENT") throw error;
	}
	assertCurrent?.();
	await fsp.mkdir(targetSkillsDir, { recursive: true });
}
async function copySkillTree(source, destination, target, assertCurrent) {
	if (!shouldSyncSkillPath(source)) return;
	const stat = await fsp.lstat(source);
	assertCurrent?.();
	if (stat.isDirectory()) {
		await fsp.mkdir(destination, { mode: stat.mode | 448 });
		assertCurrent?.();
		await ensureWritableSkillDirectories(target.rootDir, path.relative(target.rootDir, destination), assertCurrent, stat.mode);
		const children = await fsp.readdir(source);
		assertCurrent?.();
		for (const name of children) await copySkillTree(path.join(source, name), path.join(destination, name), target, assertCurrent);
	} else if (stat.isSymbolicLink()) {
		const link = await fsp.readlink(source);
		assertCurrent?.();
		const targetStat = process.platform === "win32" ? await fsp.stat(source).catch(() => void 0) : void 0;
		assertCurrent?.();
		await fsp.symlink(path.resolve(path.dirname(source), link), destination, targetStat?.isDirectory() ? "dir" : "file");
	} else await target.copyIn(`.${path.sep}${path.relative(target.rootDir, destination)}`, source, {
		preserveSourceMode: true,
		sourceHardlinks: "allow",
		durable: false
	});
	assertCurrent?.();
}
async function syncWorkspaceSkills(params) {
	const assertCurrent = params.assertCurrent ? retainMutationAuthority(params.assertCurrent) : void 0;
	assertCurrent?.();
	const sourceDir = resolveUserPath(params.sourceWorkspaceDir);
	const targetDir = resolveUserPath(params.targetWorkspaceDir);
	if (sourceDir === targetDir) return [];
	const synced = await skillsSyncQueue.enqueue(`syncSkills:${targetDir}`, async () => {
		assertCurrent?.();
		const targetSkillsDir = path.join(targetDir, "skills");
		const manifestPath = path.join(targetSkillsDir, SYNCED_SKILLS_MANIFEST_NAME);
		const skillsSnapshot = params.skillsSnapshot;
		const skillRoots = skillsSnapshot?.skillRoots;
		const executionWorkspaceFileHost = resolveSkillSnapshotExecutionFileHost(skillsSnapshot);
		const sourceWorkspace = skillRoots?.agentWorkspaceDir ?? sourceDir;
		const sourceScope = {
			executionWorkspaceDir: skillRoots?.executionWorkspaceDir,
			executionWorkspaceFileHost,
			agentId: params.agentId
		};
		const skillRootsFingerprint = sha256Hex(JSON.stringify([
			sourceDir,
			params.agentId ? normalizeAgentId(params.agentId) : void 0,
			params.config ? fingerprintSkillSnapshotConfig(params.config) : void 0,
			params.managedSkillsDir,
			params.bundledSkillsDir,
			params.pluginSkillsDir,
			skillRoots?.agentWorkspaceDir,
			skillRoots?.executionWorkspaceDir,
			executionWorkspaceFileHost,
			skillsSnapshot?.librarySelections
		]));
		await ensureSyncedSkillsDirectory(targetSkillsDir, assertCurrent);
		assertCurrent?.();
		const target = await root(targetSkillsDir, { assertBeforeMutation: assertCurrent });
		assertCurrent?.();
		const manifest = parseSyncedSkillsManifest(await tryReadJson(manifestPath));
		assertCurrent?.();
		let sourceVersion = getSkillsResourceVersion(sourceWorkspace, sourceScope);
		let skillsVersion = getSkillsSnapshotVersion(skillRoots?.agentWorkspaceDir ?? sourceDir);
		const expectedManifestKey = skillsSnapshot?.version === skillsVersion ? resolveSyncedSkillsManifestKey({
			entryKeys: skillsSnapshot.skills.map((skill) => resolveSyncedSkillIdentity(skill.skillKey ?? skill.name, skill.name)).toSorted(),
			skillRootsFingerprint,
			skillsVersion
		}) : void 0;
		const cachedUsage = syncedSkillsUsageCache.get(targetSkillsDir);
		const manifestKey = manifest ? resolveSyncedSkillsManifestKey(manifest) : void 0;
		if (expectedManifestKey && manifestKey === expectedManifestKey && cachedUsage?.manifestKey === manifestKey && cachedUsage.sourceVersion === sourceVersion) return cachedUsage.skillUsagePaths.map((entry) => ({ ...entry }));
		const loadOptions = {
			config: params.config,
			skillFilter: params.skillFilter,
			agentId: params.agentId,
			eligibility: params.eligibility,
			managedSkillsDir: params.managedSkillsDir,
			bundledSkillsDir: params.bundledSkillsDir,
			pluginSkillsDir: params.pluginSkillsDir,
			...skillsSnapshot?.skillFilter ? { skillFilter: skillsSnapshot.skillFilter } : {},
			...skillsSnapshot?.skillOverrides ? { skillOverrides: skillsSnapshot.skillOverrides } : {}
		};
		let entries;
		for (;;) {
			sourceVersion = getSkillsResourceVersion(sourceWorkspace, sourceScope);
			skillsVersion = getSkillsSnapshotVersion(skillRoots?.agentWorkspaceDir ?? sourceDir);
			entries = await prepareWorkspaceSkills(skillRoots?.agentWorkspaceDir ?? sourceDir, {
				...loadOptions,
				executionWorkspaceDir: skillRoots?.executionWorkspaceDir,
				executionWorkspaceFileHost
			});
			assertCurrent?.();
			if (getSkillsSnapshotVersion(sourceWorkspace) === skillsVersion && getSkillsResourceVersion(sourceWorkspace, sourceScope) === sourceVersion) break;
		}
		if (skillsSnapshot?.librarySelections?.length) {
			const selectedNames = new Set(skillsSnapshot.skills.map((skill) => skill.name));
			const selectedEntries = await prepareSkillLibrarySelection(skillsSnapshot.librarySelections, {}, assertCurrent ?? (() => {}));
			assertCurrent?.();
			entries.push(...selectedEntries.filter((entry) => selectedNames.has(entry.skill.name)));
		}
		const usedDirNames = /* @__PURE__ */ new Set();
		const plans = [];
		for (const entry of entries) {
			const identity = resolveSyncedSkillIdentity(resolveSkillKey(entry.skill, entry), entry.skill.name);
			if (entry.skill.filePath.startsWith("node://")) {
				plans.push({
					entry,
					identity
				});
				continue;
			}
			let destinationPath;
			try {
				const base = (entry.syncDirName ?? path.basename(entry.skill.baseDir)).trim();
				if (!base || base === "." || base === "..") throw new Error("invalid source directory name");
				let name = base;
				for (let index = 2; usedDirNames.has(name); index += 1) name = `${base}-${index}`;
				usedDirNames.add(name);
				destinationPath = resolveSandboxPath({
					filePath: name,
					cwd: targetSkillsDir,
					root: targetSkillsDir
				}).resolved;
			} catch (error) {
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to resolve safe destination for ${entry.skill.name}: ${message}`);
				continue;
			}
			plans.push({
				destinationPath,
				entry,
				identity
			});
		}
		assertCurrent?.();
		await target.remove(SYNCED_SKILLS_MANIFEST_NAME, { force: true });
		assertCurrent?.();
		const previousUsage = cachedUsage && manifest?.skillsVersion === skillsVersion && manifest.skillRootsFingerprint === skillRootsFingerprint && cachedUsage.manifestKey === manifestKey && cachedUsage.sourceVersion === sourceVersion ? cachedUsage : void 0;
		syncedSkillsUsageCache.delete(targetSkillsDir);
		const preservedDestinations = new Set(plans.flatMap((plan) => {
			const destination = plan.destinationPath ? path.basename(plan.destinationPath) : null;
			return destination && previousUsage?.destinations.get(plan.identity) === destination ? [destination] : [];
		}));
		const children = await fsp.readdir(targetSkillsDir);
		assertCurrent?.();
		for (const child of children) if (!preservedDestinations.has(child)) {
			const stat = await fsp.lstat(path.join(targetSkillsDir, child));
			assertCurrent?.();
			if (stat.isDirectory()) await ensureWritableSkillDirectories(targetSkillsDir, child, assertCurrent);
			await removePathWithinRoot({
				rootDir: targetDir,
				relativePath: path.join("skills", child),
				recursive: true,
				symlinks: "unlink",
				assertBeforeMutation: assertCurrent
			});
			assertCurrent?.();
		}
		const skillUsagePaths = [];
		let copyFailed = false;
		for (const plan of plans) {
			const { destinationPath, entry } = plan;
			if (!destinationPath) continue;
			if (!preservedDestinations.has(path.basename(destinationPath))) try {
				const pin = skillsSnapshot?.librarySelections?.find((selection) => selection.name === entry.skill.name);
				if (pin) {
					const files = await readSelectedSkillLibraryFiles(pin);
					assertCurrent?.();
					for (const file of files) {
						const filePath = path.join(destinationPath, file.path);
						assertCurrent?.();
						await fsp.mkdir(path.dirname(filePath), {
							recursive: true,
							mode: 448
						});
						assertCurrent?.();
						await target.create(`.${path.sep}${path.relative(targetSkillsDir, filePath)}`, Buffer.from(file.content, file.encoding === "base64" ? "base64" : "utf8"), {
							mode: file.executable ? 320 : 256,
							durable: false
						});
					}
				} else await copySkillTree(entry.syncSourceDir ?? entry.skill.baseDir, destinationPath, target, assertCurrent);
			} catch (error) {
				assertCurrent?.();
				if (entry.skill.source === "openclaw-library") throw error;
				copyFailed = true;
				const message = error instanceof Error ? error.message : JSON.stringify(error);
				skillsLogger.warn(`Failed to copy ${entry.skill.name} to sandbox: ${message}`);
				continue;
			}
			assertCurrent?.();
			skillUsagePaths.push({
				readPath: path.join(destinationPath, path.relative(entry.skill.baseDir, entry.skill.filePath)),
				skillFile: canonicalizePath(entry.skill.filePath),
				skillName: entry.skill.name,
				skillSource: resolveSkillTelemetrySource(entry.skill)
			});
		}
		if (!copyFailed) {
			const nextManifest = {
				entryKeys: plans.map((plan) => plan.identity).toSorted(),
				skillRootsFingerprint,
				skillsVersion
			};
			assertCurrent?.();
			await target.writeJson(SYNCED_SKILLS_MANIFEST_NAME, nextManifest, { trailingNewline: true });
			assertCurrent?.();
			syncedSkillsUsageCache.set(targetSkillsDir, {
				destinations: new Map(plans.flatMap((plan) => plan.destinationPath ? [[plan.identity, path.basename(plan.destinationPath)]] : [])),
				manifestKey: resolveSyncedSkillsManifestKey(nextManifest),
				sourceVersion,
				skillUsagePaths
			});
			pruneMapToMaxSize(syncedSkillsUsageCache, 100);
		}
		return skillUsagePaths;
	});
	assertCurrent?.();
	return synced;
}
//#endregion
export { syncWorkspaceSkills };
