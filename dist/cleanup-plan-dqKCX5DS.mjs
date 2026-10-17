import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-L1jxHK43.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { T as resolveOAuthDir, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { c as readConfigFileSnapshot, g as readSourceConfigBestEffort } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as buildCleanupPlan } from "./cleanup-utils-Dw9SRNjJ.mjs";
//#region src/commands/cleanup-plan.ts
function buildCleanupPlanForConfig(cfg) {
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
/** Build a read-only cleanup preview without recording config health state. */
async function resolveCleanupPlanForDryRun() {
	return buildCleanupPlanForConfig(await readSourceConfigBestEffort());
}
/** Resolve destructive cleanup inputs without mutating the state being guarded. */
async function resolveCleanupPlanForRemoval(runtime) {
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		pluginValidation: "core-only"
	});
	const workspacePaths = /* @__PURE__ */ new Set(["agents.defaults.workspace", ...Object.keys(snapshot.runtimeConfig.agents?.entries ?? {}).map((agentId) => `${appendConfigPathSegment("agents.entries", agentId)}.workspace`)]);
	const workspaceWarnings = snapshot.warnings.filter((issue) => workspacePaths.has(issue.path));
	if (!snapshot.valid || workspaceWarnings.length > 0) {
		const issues = snapshot.valid ? workspaceWarnings : snapshot.issues;
		const issueSummary = formatConfigIssueSummary(issues) ?? "configuration read failed";
		runtime.error(`Cannot safely remove OpenClaw state because workspace configuration could not be resolved: ${issueSummary}. Fix the configuration and retry.`);
		return;
	}
	return buildCleanupPlanForConfig(snapshot.runtimeConfig);
}
//#endregion
export { resolveCleanupPlanForRemoval as n, resolveCleanupPlanForDryRun as t };
