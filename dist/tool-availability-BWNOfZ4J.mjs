//#region src/skills/workshop/tool-availability.ts
/** Host-side Workshop access requires an unsandboxed run or a host-issued library capability. */
function resolveSkillWorkshopToolConstructionBlock(context) {
	if (context.sandboxed && !context.libraryAuthoring) return {
		detail: "\"skill_workshop\" is unavailable in a sandboxed run without library-authoring authority.",
		fix: "Use a non-sandboxed session for this agent, or a human turn with host-granted library-authoring authority. The openclaw skills workshop CLI is also available."
	};
}
//#endregion
export { resolveSkillWorkshopToolConstructionBlock as t };
