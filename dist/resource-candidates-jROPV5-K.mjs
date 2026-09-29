import { i as loadSkillLibrarySelection } from "./selection-Y3a9jWK1.mjs";
//#region src/skills/runtime/resource-candidates.ts
/** Resource access includes eligible immutable pins, not just the prompt projection. */
function resolveSkillResourceCandidates(snapshot, libraryEntries) {
	if (!snapshot) return;
	const candidates = [...snapshot.resolvedSkills ?? []];
	for (const entry of libraryEntries ?? loadSkillLibrarySelection(snapshot.librarySelections ?? [])) if (snapshot.skills.some((skill) => skill.name === entry.skill.name) && !candidates.some((skill) => skill.name === entry.skill.name)) candidates.push(entry.skill);
	return candidates;
}
//#endregion
export { resolveSkillResourceCandidates as t };
