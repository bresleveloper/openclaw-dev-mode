import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveSkillManifestMetadata } from "./frontmatter-2H_F0IFB.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { c as loadSkillRootRecords, l as warnInvalidSkill } from "./plugin-skills-CnAdRDnb.mjs";
import { r as assertInsideSkillsRoot, u as readWorkspaceSkillFile } from "./workspace-skill-write-BPRCkWOF.mjs";
import { a as resolveSkillStatusEntry } from "./status-C5lk8raw.mjs";
import path from "node:path";
//#region src/skills/workshop/workspace-skill-read.ts
function assertWritableSkillTarget(skill, options) {
	const skillsRoot = workshopSkillsDir(options);
	assertInsideSkillsRoot(skillsRoot, skill.filePath, "skill file");
	assertInsideSkillsRoot(skillsRoot, skill.baseDir, "skill directory");
	if (path.basename(skill.filePath) !== "SKILL.md") throw new Error("Skill Workshop can only update SKILL.md targets.");
}
function workshopSkillsDir(options) {
	if (!options.agentId) throw new Error("Skill Workshop requires the active agent id.");
	return resolveWorkshopSkillsDir(options.config, options.agentId, options.env);
}
function listWritableWorkshopSkillSummaries(options) {
	return loadSkillRootRecords({
		dir: workshopSkillsDir(options),
		source: "openclaw-workshop",
		config: options.config,
		onDiagnostic: (diagnostic) => {
			warnInvalidSkill("openclaw-workshop", diagnostic);
			if (diagnostic.kind === "read") throw new Error("Workshop skills could not be read. Check access to the skill files, then retry.");
		}
	}).map(({ skill, frontmatter }) => ({
		name: skill.name,
		skillKey: resolveSkillManifestMetadata(frontmatter)?.skillKey ?? skill.name,
		description: skill.description,
		baseDir: skill.baseDir,
		filePath: skill.filePath
	})).toSorted((left, right) => left.name.localeCompare(right.name));
}
function resolveWritableWorkshopSkillSummary(skillName, options) {
	return resolveSkillStatusEntry(listWritableWorkshopSkillSummaries(options), skillName) ?? void 0;
}
async function readWritableWorkshopSkill(skillName, options) {
	const name = normalizeOptionalString(skillName);
	if (!name) throw new Error("Skill name is required.");
	const targetSkill = resolveWritableWorkshopSkillSummary(name, options);
	if (!targetSkill) throw new Error(`Skill Workshop can only update skills it generated. No Workshop-generated skill matched: ${name}. Create it as a new skill, or edit the file directly.`);
	assertWritableSkillTarget(targetSkill, options);
	const content = await readWorkspaceSkillFile(targetSkill.filePath);
	if (content === null) throw new Error(`Skill file is missing: ${targetSkill.filePath}`);
	return {
		skillName: targetSkill.name,
		skillKey: targetSkill.skillKey,
		skillFile: targetSkill.filePath,
		content,
		baseDir: targetSkill.baseDir,
		description: targetSkill.description
	};
}
//#endregion
export { readWritableWorkshopSkill as n, listWritableWorkshopSkillSummaries as t };
