import { t as resolveWorkshopSkillsDir } from "./skills-root-D4CgBm6V.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-BJIyIMth.mjs";
import { a as listWorkshopSkills, i as listWorkshopArchive } from "./library-lvOOduU2.mjs";
import { n as readSkillUsage } from "./skill-usage-B2kFEY1T.mjs";
import path from "node:path";
//#region src/skills/workshop/workshop-list.ts
/** Workshop inventory shared by `skills.workshop.list` and the local CLI fallback. */
async function buildSkillsWorkshopListResult(params) {
	const { config, agentId } = params;
	const root = resolveWorkshopSkillsDir(config, agentId);
	const [skills, archived] = await Promise.all([listWorkshopSkills(config, agentId), listWorkshopArchive(config, agentId)]);
	const withFiles = skills.map((skill) => ({
		skill,
		skillFile: canonicalizePath(path.join(root, skill.name, "SKILL.md"))
	}));
	const usage = await readSkillUsage({}, withFiles.map(({ skillFile }) => skillFile));
	return {
		agentId,
		mode: resolveSkillWorkshopConfig(config).autonomous.mode,
		root,
		skills: withFiles.map(({ skill, skillFile }) => Object.assign(skill, usage.get(skillFile))),
		archived
	};
}
//#endregion
export { buildSkillsWorkshopListResult as t };
