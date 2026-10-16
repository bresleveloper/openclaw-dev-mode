import { n as decodeSkillXml } from "./skill-contract-BNrmgBMG.mjs";
//#region src/skills/loading/skill-prompt-catalog.ts
const SKILL_NAME_PATTERN = /^[ ]{4}<name>(.*)<\/name>$/mu;
const SKILL_LOCATION_PATTERN = /^[ ]{4}<location>(.*)<\/location>$/mu;
function readSkillField(block, pattern) {
	const match = pattern.exec(block)?.[1];
	return match === void 0 ? void 0 : decodeSkillXml(match);
}
/** Read identities from the canonical rendered catalog, excluding informational notes. */
function parseSkillsPromptCatalog(prompt) {
	const catalog = /<available_skills>\n([\s\S]*?)\n<\/available_skills>/u.exec(prompt)?.[1];
	if (!catalog) return [];
	const result = [];
	for (const match of catalog.matchAll(/^[ ]{2}<skill>\n([\s\S]*?)\n[ ]{2}<\/skill>$/gmu)) {
		const block = match[1] ?? "";
		const name = readSkillField(block, SKILL_NAME_PATTERN);
		const location = readSkillField(block, SKILL_LOCATION_PATTERN);
		if (name && location) result.push({
			name,
			location
		});
	}
	return result;
}
//#endregion
export { parseSkillsPromptCatalog as t };
