import { d as resolveHomeDir } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { l as isNixMode } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./config-DryArA1l.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { c as removeWorkspaceDirs, o as removePath, s as removeStateAndLinkedPaths } from "./cleanup-utils-MkYk5me2.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-Di2tA0mA.mjs";
import { n as resolveCleanupPlanForRemoval, t as resolveCleanupPlanForDryRun } from "./cleanup-plan-Df8udQMY.mjs";
import path from "node:path";
import { cancel, confirm, isCancel, multiselect } from "@clack/prompts";
//#region src/commands/uninstall.ts
const multiselectStyled = (params) => multiselect(styleSelectParams(params));
async function stopAndUninstallService(runtime) {
	if (isNixMode) {
		runtime.error(`Nix mode detected; service uninstall is disabled. Manage the service through your Nix profile instead, then run ${formatCliCommand("openclaw status")} to verify.`);
		return false;
	}
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		runtime.error(`Gateway service check failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for service diagnostics.`);
		return false;
	}
	if (!loaded) runtime.log(`Gateway service ${service.notLoadedText}.`);
	let stopped = true;
	if (loaded) try {
		await service.stop({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		stopped = false;
		runtime.error(`Gateway stop failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} before retrying uninstall.`);
	}
	try {
		await service.uninstall({
			env: process.env,
			stdout: process.stdout
		});
	} catch (err) {
		runtime.error(`Gateway uninstall failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for the service state.`);
		return false;
	}
	return stopped;
}
async function removeMacApp(runtime, dryRun) {
	if (process.platform !== "darwin") {
		runtime.log("macOS app cleanup is not applicable on this platform.");
		return true;
	}
	return (await removePath("/Applications/OpenClaw.app", runtime, {
		dryRun,
		label: "/Applications/OpenClaw.app"
	})).ok;
}
/** Runs the uninstall flow for selected service/state/workspace/app scopes. */
async function uninstallCommand(runtime, opts) {
	const scopes = new Set([
		"service",
		"state",
		"workspace",
		"app"
	].filter((scope) => opts.all || opts[scope]));
	const hadExplicit = scopes.size > 0;
	const interactive = !opts.nonInteractive;
	if (!interactive && !opts.yes) {
		runtime.error(`Non-interactive uninstall requires --yes. Preview first with ${formatCliCommand("openclaw uninstall --dry-run --all")}.`);
		runtime.exit(1);
		return;
	}
	if (!hadExplicit) {
		if (!interactive) {
			runtime.error(`Non-interactive uninstall requires explicit scopes. Use --all, or choose scopes such as --service --state.`);
			runtime.exit(1);
			return;
		}
		const selection = await multiselectStyled({
			message: "Uninstall which components?",
			options: [
				{
					value: "service",
					label: "Gateway service",
					hint: "launchd / systemd / schtasks"
				},
				{
					value: "state",
					label: "State + config",
					hint: "~/.openclaw"
				},
				{
					value: "workspace",
					label: "Workspace",
					hint: "agent files"
				},
				{
					value: "app",
					label: "macOS app",
					hint: "/Applications/OpenClaw.app"
				}
			],
			initialValues: ["service"]
		});
		if (typeof selection === "symbol") {
			cancel(stylePromptTitle("Uninstall cancelled.") ?? "Uninstall cancelled.");
			runtime.exit(0);
			return;
		}
		for (const value of selection) scopes.add(value);
	}
	if (scopes.size === 0) {
		runtime.log("Nothing selected.");
		return;
	}
	if (interactive && !opts.yes) {
		const ok = await confirm({ message: stylePromptMessage("Proceed with uninstall?") });
		if (isCancel(ok) || !ok) {
			cancel(stylePromptTitle("Uninstall cancelled.") ?? "Uninstall cancelled.");
			runtime.exit(0);
			return;
		}
	}
	const dryRun = Boolean(opts.dryRun);
	let stateRemoved = false;
	let workspaceBlocked = false;
	let failed = false;
	let serviceSafe = true;
	const attemptCleanup = async (failureMessage, action) => {
		try {
			return await action();
		} catch (error) {
			runtime.error(`${failureMessage}: ${formatErrorMessage(error)}`);
			failed = true;
			return;
		}
	};
	const removesLocalData = scopes.has("state") || scopes.has("workspace");
	if (removesLocalData) runtime.log(`Recommended first: ${formatCliCommand("openclaw backup create")}`);
	if (scopes.has("service")) {
		if (dryRun) runtime.log("[dry-run] remove gateway service");
		else if (!await stopAndUninstallService(runtime)) {
			serviceSafe = false;
			failed = true;
		}
	}
	let cleanupPlan;
	if (removesLocalData && serviceSafe) {
		cleanupPlan = await attemptCleanup("Failed to prepare local data cleanup", () => dryRun ? resolveCleanupPlanForDryRun() : resolveCleanupPlanForRemoval(runtime));
		if (!cleanupPlan) failed = true;
	} else if (removesLocalData) runtime.error("State and workspace cleanup blocked because gateway service teardown failed.");
	if (scopes.has("state") && cleanupPlan) {
		const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } = cleanupPlan;
		if (!scopes.has("workspace")) {
			const retiredWorkspace = await attemptCleanup("Retired workspace state cleanup failed", () => removeWorkspaceDirs(workspaceDirs, runtime, {
				dryRun,
				preserveWorkspace: true
			}));
			if (retiredWorkspace && retiredWorkspace.length > 0) {
				runtime.error(`Retired workspace state cleanup incomplete: ${retiredWorkspace.join(", ")}`);
				failed = true;
			}
		}
		const state = await attemptCleanup("State cleanup failed", () => removeStateAndLinkedPaths({
			stateDir,
			configPath,
			oauthDir,
			configInsideState,
			oauthInsideState
		}, runtime, {
			dryRun,
			preservePaths: scopes.has("workspace") ? [] : workspaceDirs
		}));
		stateRemoved = state ?? false;
		workspaceBlocked = state === void 0;
		failed ||= !stateRemoved;
	}
	if (scopes.has("workspace") && cleanupPlan && workspaceBlocked) runtime.error("Workspace cleanup blocked because state cleanup could not safely complete.");
	else if (scopes.has("workspace") && cleanupPlan) {
		const workspace = await attemptCleanup("Workspace cleanup failed", () => removeWorkspaceDirs(cleanupPlan.workspaceDirs, runtime, {
			dryRun,
			removeStateRows: !scopes.has("state") || !stateRemoved
		}));
		if (workspace && workspace.length > 0) {
			runtime.error(`Workspace cleanup incomplete: ${workspace.join(", ")}`);
			failed = true;
		}
	}
	if (scopes.has("app")) {
		const app = await attemptCleanup("App cleanup failed", () => removeMacApp(runtime, dryRun));
		failed ||= app !== true;
	}
	if (!failed) runtime.log("CLI removal instructions: https://docs.openclaw.ai/install/uninstall");
	if (scopes.has("state") && !scopes.has("workspace") && cleanupPlan) {
		const home = resolveHomeDir();
		if (home && cleanupPlan.workspaceDirs.some((dir) => dir.startsWith(path.resolve(home)))) runtime.log("Tip: workspaces were preserved. Re-run with --workspace to remove them.");
	}
	if (failed) runtime.exit(1);
}
//#endregion
export { uninstallCommand };
