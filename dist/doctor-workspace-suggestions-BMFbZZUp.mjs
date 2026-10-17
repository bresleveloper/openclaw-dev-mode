//#region src/commands/doctor-workspace-suggestions.ts
async function* collectWorkspaceSuggestionNotes(workspaceDir) {
	const { collectWorkspaceBackupTip, MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await import("./doctor-workspace-CgNe_37g.mjs");
	const backupTip = collectWorkspaceBackupTip(workspaceDir);
	if (backupTip) yield backupTip;
	if (await shouldSuggestMemorySystem(workspaceDir)) yield MEMORY_SYSTEM_PROMPT;
}
//#endregion
export { collectWorkspaceSuggestionNotes };
