import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as clearSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { n as resolveSkillReadPath } from "./workspace-skill-read-path-Ct1QXBcj.mjs";
import { i as resolveExplicitSkillSelectionFileHost } from "./skill-command-provenance-D3weQ69x.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-DaXIzKaL.mjs";
import path from "node:path";
import { isPathRelativeEscape } from "@openclaw/fs-safe/path";
//#region src/agents/embedded-agent-runner/sandbox-skills.ts
/**
* Sandbox skill runtime input selection.
*
* Sandboxed runs must build prompt-facing skill entries from readable in-sandbox
* copies instead of reusing host-path snapshots.
*/
const MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS = [".openclaw", "sandbox-skills"];
function containerJoin(root, ...parts) {
	const normalizedRoot = root.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
	const suffix = parts.map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
	return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function mapPathFromWorkspaceToContainer(params) {
	if (!params.filePath || !path.isAbsolute(params.filePath)) return params.filePath;
	const relativePath = path.relative(path.resolve(params.sourceWorkspaceDir), path.resolve(params.filePath));
	if (isPathRelativeEscape(relativePath)) return params.filePath;
	if (!relativePath) return params.targetWorkspaceDir.replace(/\\/g, "/");
	return containerJoin(params.targetWorkspaceDir, ...relativePath.split(path.sep).filter(Boolean));
}
function mapSandboxSkillEntriesForPrompt(params) {
	if (!params.entries || params.skillsWorkspaceDir === params.skillsPromptWorkspaceDir) return params.entries;
	const mapPath = (filePath) => mapPathFromWorkspaceToContainer({
		filePath,
		sourceWorkspaceDir: params.skillsWorkspaceDir,
		targetWorkspaceDir: params.skillsPromptWorkspaceDir
	});
	return params.entries.map((entry) => {
		const filePath = mapPath(entry.skill.filePath) ?? entry.skill.filePath;
		const baseDir = mapPath(entry.skill.baseDir) ?? entry.skill.baseDir;
		const sourceInfoPath = mapPath(entry.skill.sourceInfo.path) ?? entry.skill.sourceInfo.path;
		const sourceInfoBaseDir = mapPath(entry.skill.sourceInfo.baseDir);
		return {
			...entry,
			skill: {
				...entry.skill,
				filePath,
				baseDir,
				sourceInfo: {
					...entry.skill.sourceInfo,
					path: sourceInfoPath,
					...sourceInfoBaseDir === void 0 ? {} : { baseDir: sourceInfoBaseDir }
				}
			}
		};
	});
}
function resolveSandboxSkillRuntimeInputs(params) {
	if (params.sandbox?.enabled === true) {
		const skillsWorkspaceDir = params.sandbox.skillsWorkspaceDir ?? params.skillsAnchorWorkspace;
		const skillsPromptWorkspaceDir = params.sandbox.workspaceAccess === "rw" && params.sandbox.skillsWorkspaceDir && params.sandbox.containerWorkdir ? containerJoin(params.sandbox.containerWorkdir, ...MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS) : params.sandbox.containerWorkdir ?? skillsWorkspaceDir;
		const snapshot = params.skillsSnapshot;
		const sourceReadPathBySkillName = indexFirstByKey(snapshot?.resolvedSkills ?? [], (skill) => skill.name);
		const skillUsagePaths = params.sandbox.skillUsagePaths?.map((entry) => {
			const sourceSkill = sourceReadPathBySkillName.get(entry.skillName);
			const catalogSkill = snapshot?.skills.find((skill) => skill.name === entry.skillName);
			const sourceReadPath = sourceSkill ? resolveSkillReadPath(sourceSkill) : catalogSkill && catalogSkill.gatewayFilePath === void 0 ? resolveSkillReadPath({
				name: entry.skillName,
				filePath: entry.skillFile
			}, "workspace") : void 0;
			return {
				...entry,
				readPath: skillsWorkspaceDir === skillsPromptWorkspaceDir ? entry.readPath : mapPathFromWorkspaceToContainer({
					filePath: entry.readPath,
					sourceWorkspaceDir: skillsWorkspaceDir,
					targetWorkspaceDir: skillsPromptWorkspaceDir
				}) ?? entry.readPath,
				...sourceReadPath && sourceReadPath !== entry.skillFile ? { sourceReadPath } : {}
			};
		});
		let selectedSnapshot = params.skillsSnapshot && !params.skillsSnapshot.prompt.trim() && !params.skillsSnapshot.discoverySkills?.length ? params.skillsSnapshot : void 0;
		if (snapshot && (snapshot.librarySelections?.length || snapshot.discoverySkills && skillUsagePaths?.length)) {
			const usageBySkillName = indexFirstByKey(skillUsagePaths ?? [], (usage) => usage.skillName);
			const mapSkill = (skill) => {
				const materialized = usageBySkillName.get(skill.name);
				if (!materialized) throw new Error(`Selected skill ${skill.name} was not delivered to the sandbox.`);
				return clearSkillFileHost({
					...skill,
					filePath: materialized.readPath,
					baseDir: path.posix.dirname(materialized.readPath)
				});
			};
			const resolvedSkills = snapshot.resolvedSkills?.filter((skill) => snapshot.librarySelections?.length || usageBySkillName.has(skill.name)).map(mapSkill);
			const discoverySkills = snapshot.discoverySkills?.filter((skill) => usageBySkillName.has(skill.name)).map(mapSkill);
			if (!resolvedSkills) throw new Error("Selected skill snapshot must be hydrated before sandbox delivery.");
			selectedSnapshot = {
				...snapshot,
				resolvedSkills,
				discoverySkills,
				prompt: formatSkillsForPromptBounded({
					skills: resolvedSkills,
					preserveOrder: true
				})
			};
		}
		return {
			...params.sandbox.skillsEligibility ? { skillsEligibility: params.sandbox.skillsEligibility } : {},
			...skillUsagePaths ? { skillUsagePaths } : {},
			skillsPromptWorkspaceDir,
			skillsSnapshot: selectedSnapshot,
			skillsWorkspaceDir,
			workspaceOnly: true
		};
	}
	return {
		...params.sandbox?.skillUsagePaths ? { skillUsagePaths: params.sandbox.skillUsagePaths } : {},
		skillsPromptWorkspaceDir: params.skillsAnchorWorkspace,
		skillsSnapshot: params.skillsSnapshot,
		skillsWorkspaceDir: params.skillsAnchorWorkspace,
		workspaceOnly: false
	};
}
/** Rewrites host-generated explicit skill references to the prepared runtime's exact copies. */
function remapSkillReferencePaths(text, paths) {
	let result = text;
	const items = paths ?? [];
	for (const item of items) if (item.sourceReadPath) result = result.replaceAll(item.sourceReadPath.slice(0, -8), item.readPath.slice(0, -8));
	const visited = /* @__PURE__ */ new Set();
	for (const item of items) {
		if (visited.has(item.skillFile)) continue;
		visited.add(item.skillFile);
		const matches = items.filter((candidate) => candidate.skillFile === item.skillFile);
		const physicalTarget = matches.find((candidate) => candidate.sourceReadPath === void 0) ?? (matches.length === 1 ? matches[0] : void 0);
		if (physicalTarget) result = result.replaceAll(item.skillFile.slice(0, -8), physicalTarget.readPath.slice(0, -8));
	}
	return result;
}
function remapExplicitSkillSelectionPath(selection, paths) {
	const fileHost = resolveExplicitSkillSelectionFileHost(selection);
	return (paths?.find((item) => item.skillFile === selection.path && (fileHost === "workspace" ? item.sourceReadPath !== void 0 : fileHost === "gateway" ? item.sourceReadPath === void 0 : true)))?.readPath ?? selection.path;
}
//#endregion
export { resolveSandboxSkillRuntimeInputs as i, remapExplicitSkillSelectionPath as n, remapSkillReferencePaths as r, mapSandboxSkillEntriesForPrompt as t };
