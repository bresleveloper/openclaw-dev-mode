import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { T as resolveOAuthDir, l as isNixMode, m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-Cu1pIc3h.mjs";
import { m as readSourceConfigBestEffort, s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { t as buildCleanupPlan } from "./cleanup-utils-BtHoq0Ha.mjs";
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
//#region src/commands/cleanup-service.ts
/** Settle managed service teardown before reset or uninstall may remove user data. */
async function stopGatewayForCleanup(runtime, operation) {
	const uninstall = operation === "uninstall";
	if (isNixMode) {
		if (uninstall) runtime.error(`Nix mode detected; service uninstall is disabled. Manage the service through your Nix profile instead, then run ${formatCliCommand("openclaw status")} to verify.`);
		return !uninstall;
	}
	const reportFailure = (label, error, nextStep) => {
		runtime.error(uninstall ? `${label}: ${formatErrorMessage(error)}. Run ${formatCliCommand("openclaw gateway status --deep")} ${nextStep}.` : `${label}: ${String(error)}`);
	};
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		reportFailure("Gateway service check failed", err, "for service diagnostics");
		return false;
	}
	let stopped = true;
	if (loaded) try {
		await service.stop({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		stopped = false;
		reportFailure("Gateway stop failed", err, "before retrying uninstall");
	}
	else if (uninstall) runtime.log(`Gateway service ${service.notLoadedText}.`);
	if (uninstall) try {
		await service.uninstall({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		reportFailure("Gateway uninstall failed", err, "for the service state");
		return false;
	}
	return stopped;
}
//#endregion
export { resolveCleanupPlanForDryRun as n, resolveCleanupPlanForRemoval as r, stopGatewayForCleanup as t };
