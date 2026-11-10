import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { c as tryRealpath, t as loadSingleSkillDirectory } from "./local-loader-DuDhVnOL.mjs";
import { a as createSkillEntry, i as warnInvalidSkill, r as loadWorkspaceSkillSourceEntries, t as loadExecutionSkillEntries } from "./skill-root-loader-BM6lBNhg.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-FGRFW_77.mjs";
import { n as hasBinary } from "./config-eval-wcqg1YVW.mjs";
import { u as resolveSkillRequiredBins } from "./config-D7Jc5w1r.mjs";
import { t as readWorkspaceSkillStatusFacts } from "./status-files-BYKSZPrI.mjs";
import { n as mergeSkillRecords } from "./skill-precedence-aiuaCdaS.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir--MDSYPfU.mjs";
import path from "node:path";
//#region src/skills/loading/workspace-skill-source-reader.ts
/** Run on the workspace host using an admitted source plan and native discovery limits. */
function readWorkspaceSkillSources(request, batch) {
	const config = { skills: {
		limits: request.limits,
		load: { allowSymlinkTargets: request.sourcePlan.allowSymlinkTargets }
	} };
	const entries = request.bundledSkillName !== void 0 ? readBundledSkillEntries(request.bundledSkillName, {
		config,
		bundledSkillsDir: request.sourcePlan.bundledSkillsDir
	}) : loadWorkspaceSkillSourceEntries(request.sourcePlan, config, batch);
	const executionEntries = request.executionWorkspaceDir ? loadExecutionSkillEntries(request.executionWorkspaceDir, config, batch) : [];
	const bins = [.../* @__PURE__ */ new Set([
		"brew",
		"npm",
		"pnpm",
		"yarn",
		"bun",
		"uv",
		"go",
		...request.additionalBins,
		...entries.concat(executionEntries).flatMap(resolveSkillRequiredBins)
	])].filter(hasBinary).toSorted();
	return {
		entries,
		executionEntries,
		runtime: {
			platform: process.platform,
			bins
		},
		...request.status ? { status: readWorkspaceSkillStatusFacts({
			entries: mergeSkillRecords(entries, request.sourcePlan.workspaceDir),
			workspaceDir: request.sourcePlan.workspaceDir,
			managedSkillsDir: request.sourcePlan.managedSkillsDir,
			skillCardKey: request.status.skillCardKey
		}) } : {}
	};
}
/** Read a single bundle with the same boundary and file limits as local discovery. */
function readBundledSkillEntries(skillName, opts) {
	const normalizedName = skillName.trim().toLowerCase();
	if (!/^[a-z0-9][a-z0-9-]*$/u.test(normalizedName)) return [];
	const bundledSkillsDir = opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const rootRealPath = bundledSkillsDir ? tryRealpath(bundledSkillsDir) : void 0;
	if (!rootRealPath) return [];
	const limits = resolveSkillDiscoveryLimits(opts?.config);
	const loaded = loadSingleSkillDirectory({
		skillDir: path.join(rootRealPath, normalizedName),
		source: "openclaw-bundled",
		rootRealPath,
		maxBytes: limits.maxSkillFileBytes,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: "bundled",
			rootDir: rootRealPath
		}),
		onDiagnostic: (diagnostic) => warnInvalidSkill("openclaw-bundled", diagnostic)
	});
	if (!loaded || loaded.skill.name.trim().toLowerCase() !== normalizedName) return [];
	return [createSkillEntry(loaded)];
}
//#endregion
export { readWorkspaceSkillSources as t };
