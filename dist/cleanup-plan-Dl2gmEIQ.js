import { _ as resolveOAuthDir, c as resolveConfigPath, y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./config-A41fTHlt.js";
import { t as buildCleanupPlan } from "./cleanup-utils-g8o2lnII.js";
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
