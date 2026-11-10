import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as resolveWorkspaceSkillDirectories } from "./workspace-skill-roots-CL28VeX5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as readRootJsonObjectSync } from "./json-files-DYmSFHoN.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy } from "./frontmatter-siV6LZij.mjs";
import { c as tryRealpath, r as compactSkillPath, s as resolveAllowedSkillSymlinkTargetRealPaths, t as loadSingleSkillDirectory } from "./local-loader-DuDhVnOL.mjs";
import { a as resolveSkillDiscoveryLimits, n as discoverPluginSkills, r as discoverSkillCandidates, t as canonicalSkillDirForSource } from "./skill-root-discovery-FGRFW_77.mjs";
import { r as resolveSkillTelemetrySourceValue } from "./source-DbWOnpPI.mjs";
import path from "node:path";
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = `.openclaw/source-origin.json`;
//#endregion
//#region src/skills/loading/skill-entry-metadata.ts
const MAX_SKILL_SOURCE_ORIGIN_BYTES = 16384;
function readSourceInstallSkillKey(skillDir) {
	try {
		const sourceOriginPath = path.join(skillDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH);
		const parentRealPath = tryRealpath(path.dirname(sourceOriginPath));
		if (!parentRealPath) return;
		const skillDirRealPath = tryRealpath(skillDir);
		if (!skillDirRealPath) return;
		const result = readRootJsonObjectSync({
			rootDir: skillDirRealPath,
			rootRealPath: skillDirRealPath,
			relativePath: path.relative(skillDirRealPath, path.join(parentRealPath, path.basename(sourceOriginPath))),
			boundaryLabel: "skill directory",
			rejectHardlinks: false,
			maxBytes: MAX_SKILL_SOURCE_ORIGIN_BYTES
		});
		return result.ok ? normalizeOptionalString(result.value.slug) : void 0;
	} catch {
		return;
	}
}
function createSkillEntry(record) {
	const { skill, frontmatter } = record;
	const invocation = resolveSkillInvocationPolicy(frontmatter);
	let metadata = resolveSkillManifestMetadata(frontmatter);
	if (!metadata?.skillKey) {
		const skillKey = readSourceInstallSkillKey(skill.baseDir);
		if (skillKey) metadata = {
			...metadata,
			skillKey
		};
	}
	return {
		...record.sourceOrder !== void 0 ? { sourceOrder: record.sourceOrder } : {},
		skill,
		frontmatter,
		metadata,
		invocation,
		exposure: {
			includeInRuntimeRegistry: true,
			includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
			userInvocable: invocation.userInvocable ?? true
		},
		...record.syncSourceDir !== void 0 ? { syncSourceDir: record.syncSourceDir } : {},
		...record.syncDirName !== void 0 ? { syncDirName: record.syncDirName } : {}
	};
}
//#endregion
//#region src/skills/loading/skill-root-loader.ts
const skillsLogger = createSubsystemLogger("skills");
function readSourceEntries(batch, input, read) {
	if (!batch) return read();
	const key = JSON.stringify(input);
	let entries = batch.get(key);
	if (!entries) {
		entries = read();
		batch.set(key, entries);
	}
	return entries;
}
function warnInvalidSkill(source, diagnostic) {
	skillsLogger.warn("Skipping invalid skill.", {
		source,
		filePath: diagnostic.path,
		error: diagnostic.message,
		consoleMessage: `Skipping invalid skill: file=${compactSkillPath(diagnostic.path)} error=${diagnostic.message}`
	});
}
function loadContainedSkillRecord(params) {
	const loaded = loadSingleSkillDirectory({
		...params,
		onDiagnostic: params.onDiagnostic ?? ((diagnostic) => warnInvalidSkill(params.source, diagnostic))
	});
	if (!loaded) return null;
	const record = {
		skill: loaded.skill,
		frontmatter: loaded.frontmatter
	};
	if (!params.canonicalSkillDir) return record;
	const originalBaseDir = path.resolve(record.skill.baseDir);
	const canonicalBaseDir = path.resolve(params.canonicalSkillDir);
	if (originalBaseDir === canonicalBaseDir) return record;
	const filePath = path.join(canonicalBaseDir, path.relative(originalBaseDir, record.skill.filePath));
	return {
		...record,
		syncSourceDir: canonicalBaseDir,
		syncDirName: path.basename(originalBaseDir),
		skill: {
			...record.skill,
			filePath,
			baseDir: canonicalBaseDir,
			sourceInfo: record.skill.sourceInfo ? {
				...record.skill.sourceInfo,
				path: filePath,
				baseDir: canonicalBaseDir
			} : record.skill.sourceInfo
		}
	};
}
/** Loads one skill root under the configured discovery limits and symlink/hardlink policy. */
function loadSkillRootRecords(params) {
	const discoveryRoot = {
		path: path.resolve(params.dir),
		worktree: params.worktree ?? isPathInside(params.config?.worktreeRoot ?? path.join(resolveStateDir(), "worktrees"), params.dir)
	};
	const limits = resolveSkillDiscoveryLimits(params.config);
	if (params.mode === "audit") {
		const defaults = resolveSkillDiscoveryLimits();
		limits.maxCandidatesPerRoot = Math.max(limits.maxCandidatesPerRoot, defaults.maxCandidatesPerRoot);
		limits.maxSkillsLoadedPerSource = Math.max(limits.maxSkillsLoadedPerSource, defaults.maxSkillsLoadedPerSource);
		limits.maxSkillFileBytes = defaults.maxSkillFileBytes;
	}
	const rejectHardlinks = params.rejectHardlinks ?? shouldRejectHardlinkedPluginFiles({
		origin: resolveSkillTelemetrySourceValue(params.source) === "bundled" ? "bundled" : "workspace",
		rootDir: params.dir
	});
	const allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths(params.config);
	const discovered = discoverSkillCandidates({
		dir: params.dir,
		source: params.source,
		limits,
		allowedSymlinkTargetRealPaths,
		onDiagnostic: params.onDiagnostic
	});
	const maxSkillsLoadedPerSource = Math.max(0, limits.maxSkillsLoadedPerSource);
	const loadCandidate = (candidate) => {
		const record = loadContainedSkillRecord({
			skillDir: candidate.skillDir,
			rootRealPath: candidate.skillDirRealPath,
			source: params.source,
			maxBytes: limits.maxSkillFileBytes,
			canonicalSkillDir: params.mode === "audit" ? candidate.skillDirRealPath : canonicalSkillDirForSource(params.source, candidate.skillDirRealPath),
			rejectHardlinks,
			onDiagnostic: params.onDiagnostic
		});
		if (record) record.skill.discoveryRoot = discoveryRoot;
		return record;
	};
	if (discovered.configuredRootCandidate) {
		const rootRecord = loadCandidate(discovered.configuredRootCandidate);
		if (rootRecord) return [rootRecord];
	}
	const loadedSkills = [];
	for (const candidate of discovered.candidates) {
		if (params.mode !== "audit" && !discovered.rootIsSkill && loadedSkills.length >= maxSkillsLoadedPerSource) break;
		const record = loadCandidate(candidate);
		if (record) loadedSkills.push(record);
	}
	return loadedSkills;
}
function loadGeneratedPluginSkillRecords(params) {
	const candidates = discoverPluginSkills(params);
	const maxSkillsLoadedPerSource = Math.max(0, params.limits.maxSkillsLoadedPerSource);
	const loadedSkills = [];
	for (const candidate of candidates) {
		const record = loadContainedSkillRecord({
			skillDir: candidate.skillDir,
			rootRealPath: candidate.skillDirRealPath,
			source: params.source,
			maxBytes: params.limits.maxSkillFileBytes,
			rejectHardlinks: candidate.rejectHardlinks
		});
		if (record) {
			record.skill.discoveryRoot = {
				path: path.resolve(params.pluginSkillsDir),
				worktree: false
			};
			loadedSkills.push({
				...record,
				syncSourceDir: candidate.skillDirRealPath,
				syncDirName: path.basename(record.skill.baseDir)
			});
		}
		if (loadedSkills.length >= maxSkillsLoadedPerSource) break;
	}
	return loadedSkills;
}
/** Scan selected roots on their owning host, retaining native precedence and file rules. */
function loadWorkspaceSkillSourceEntries(plan, config, batch) {
	const grouped = /* @__PURE__ */ new Map();
	for (const root of plan.roots) {
		const { tier, order, ...policy } = root;
		const input = {
			...policy,
			config
		};
		const records = grouped.get(tier) ?? [];
		for (const entry of readSourceEntries(batch, ["root", input], () => loadSkillRootRecords(input).map(createSkillEntry))) records.push(order === void 0 ? entry : {
			...entry,
			sourceOrder: order
		});
		grouped.set(tier, records);
	}
	const extra = grouped.get("extra") ?? [];
	if (plan.pluginSkillsDir) {
		const input = {
			pluginSkillsDir: plan.pluginSkillsDir,
			pluginSkillRoots: plan.pluginSkillRoots,
			source: "openclaw-extra",
			limits: resolveSkillDiscoveryLimits(config)
		};
		for (const record of readSourceEntries(batch, ["generated", input], () => loadGeneratedPluginSkillRecords(input).map(createSkillEntry))) extra.push({
			...record,
			sourceOrder: (plan.roots.find((root) => root.tier !== "extra")?.order ?? Math.max(-1, ...plan.roots.map((root) => root.order ?? -1)) + 1) - .5
		});
	}
	grouped.set("extra", extra);
	grouped.get("bundled")?.sort((left, right) => left.skill.name.localeCompare(right.skill.name, "en") || left.skill.source.localeCompare(right.skill.source, "en"));
	return [
		"extra",
		"bundled",
		"workshop",
		"managed",
		"personal",
		"workspace"
	].flatMap((tier) => grouped.get(tier) ?? []);
}
function loadExecutionSkillEntries(executionWorkspaceDir, config, batch) {
	return resolveWorkspaceSkillDirectories(executionWorkspaceDir).flatMap((root) => {
		const input = {
			...root,
			config
		};
		return readSourceEntries(batch, ["root", input], () => loadSkillRootRecords(input).map(createSkillEntry));
	});
}
//#endregion
export { createSkillEntry as a, warnInvalidSkill as i, loadSkillRootRecords as n, loadWorkspaceSkillSourceEntries as r, loadExecutionSkillEntries as t };
