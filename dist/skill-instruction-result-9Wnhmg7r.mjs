//#region src/agents/skill-instruction-result.ts
/** Keep model-facing context separate from the complete, unmodified instruction body. */
function formatSkillInstructions(result) {
	const context = [`Skill location: ${result.location}`, "Resolve relative resource paths from the directory containing this SKILL.md."];
	if (result.locationNote) context.push(result.locationNote);
	return `${context.join("\n")}\n\n${result.content}`;
}
//#endregion
export { formatSkillInstructions as t };
