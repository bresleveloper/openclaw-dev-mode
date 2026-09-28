import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
//#region src/commands/doctor/shared/github-preview-upgrade.ts
/** Optional bundled diagnostics must not prevent Doctor from repairing minimal installs. */
function collectGitHubUpgradeWarnings(policy) {
	return loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: "github",
		artifactCandidates: ["upgrade-api.js"]
	})?.collectGitHubUpgradeWarnings(policy) ?? [];
}
//#endregion
export { collectGitHubUpgradeWarnings };
