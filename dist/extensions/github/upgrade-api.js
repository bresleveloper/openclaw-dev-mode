//#region extensions/github/src/upgrade.ts
/** Explain the core-preview cutover without changing an operator's trust policy. */
function collectGitHubUpgradeWarnings(policy) {
	if (!policy.enabled || policy.deny.includes("github") || policy.entries.github?.enabled === false || policy.allow.length === 0 || policy.allow.includes("github")) return [];
	return ["- GitHub link previews and the reader are now provided by the bundled \"github\" plugin. Your plugins.allow list excludes \"github\", so these features remain unavailable. To restore them, append \"github\" to the existing allowlist and enable it in Plugins. To keep them disabled without this notice, set plugins.entries.github.enabled=false. Doctor does not change either choice."];
}
//#endregion
export { collectGitHubUpgradeWarnings };
