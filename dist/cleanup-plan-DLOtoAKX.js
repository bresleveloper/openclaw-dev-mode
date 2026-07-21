import { g as resolveOAuthDir, s as resolveConfigPath, v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { t as buildCleanupPlan } from "./cleanup-utils-CrwOtyV7.js";
//#region src/commands/cleanup-plan.ts
/** Build the cleanup plan for the current runtime config/state/credential paths on disk. */
function resolveCleanupPlanFromDisk() {
	const cfg = getRuntimeConfig();
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	return {
		cfg,
		stateDir,
		configPath,
		oauthDir,
		...buildCleanupPlan({
			cfg,
			stateDir,
			configPath,
			oauthDir
		})
	};
}
//#endregion
export { resolveCleanupPlanFromDisk as t };
