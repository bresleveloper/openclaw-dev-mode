//#region src/skills/runtime/resource-candidates.ts
/** Resource access includes eligible immutable pins, not just the prompt projection. */
function resolveSkillResourceCandidates(snapshot, libraryEntries) {
	if (!snapshot) return;
	const candidates = [...snapshot.resolvedSkills ?? []];
	for (const entry of libraryEntries) if (snapshot.skills.some((skill) => skill.name === entry.skill.name) && !candidates.some((skill) => skill.name === entry.skill.name)) candidates.push(entry.skill);
	return candidates;
}
//#endregion
export { resolveSkillResourceCandidates as t };
