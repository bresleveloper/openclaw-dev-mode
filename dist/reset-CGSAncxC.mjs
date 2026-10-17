import { l as isNixMode, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import "./config-9720xhC5.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { a as removePath, i as removeAgentSessions, o as removeStateAndLinkedPaths, s as removeWorkspaceDirs } from "./cleanup-utils-Dw9SRNjJ.mjs";
import { t as selectStyled } from "./prompt-select-styled-DNEVEnJM.mjs";
import { n as resolveCleanupPlanForRemoval, t as resolveCleanupPlanForDryRun } from "./cleanup-plan-dqKCX5DS.mjs";
import { cancel, confirm, isCancel } from "@clack/prompts";
//#region src/commands/reset.ts
/**
* Reset command implementation.
*
* It removes selected config/state/workspace surfaces after confirmation and
* stops managed gateway services before deleting broader state.
*/
async function stopGatewayIfRunning(runtime) {
	if (isNixMode) return true;
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		runtime.error(`Gateway service check failed: ${String(err)}`);
		return false;
	}
	if (!loaded) return true;
	try {
		await service.stop({
			env: process.env,
			stdout: process.stdout
		});
		return true;
	} catch (err) {
		runtime.error(`Gateway stop failed: ${String(err)}`);
		return false;
	}
}
/** Runs the reset command for config, credential/session, or full state scopes. */
async function resetCommand(runtime, opts) {
	const interactive = !opts.nonInteractive;
	if (!interactive && !opts.yes) {
		runtime.error("Non-interactive mode requires --yes.");
		runtime.exit(1);
		return;
	}
	let scope = opts.scope;
	if (!scope) {
		if (!interactive) {
			runtime.error("Non-interactive mode requires --scope.");
			runtime.exit(1);
			return;
		}
		const selection = await selectStyled({
			message: "Reset scope",
			options: [
				{
					value: "config",
					label: "Config only",
					hint: "openclaw.json"
				},
				{
					value: "config+creds+sessions",
					label: "Config + credentials + sessions",
					hint: "keeps workspace + auth profiles"
				},
				{
					value: "full",
					label: "Full reset",
					hint: "state dir + workspace"
				}
			],
			initialValue: "config+creds+sessions"
		});
		if (typeof selection === "symbol") {
			cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
			runtime.exit(0);
			return;
		}
		scope = selection;
	}
	if (![
		"config",
		"config+creds+sessions",
		"full"
	].includes(scope)) {
		runtime.error("Invalid --scope. Expected \"config\", \"config+creds+sessions\", or \"full\".");
		runtime.exit(1);
		return;
	}
	if (interactive && !opts.yes) {
		const ok = await confirm({ message: stylePromptMessage(`Proceed with ${scope} reset?`) });
		if (isCancel(ok) || !ok) {
			cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
			runtime.exit(0);
			return;
		}
	}
	const dryRun = Boolean(opts.dryRun);
	if (scope === "config") {
		const configPath = resolveConfigPath();
		if (!(await removePath(configPath, runtime, {
			dryRun,
			label: configPath
		})).ok) {
			runtime.error("Reset incomplete. Resolve the removal error above, then retry reset.");
			runtime.exit(1);
		}
		return;
	}
	runtime.log(`Recommended first: ${formatCliCommand("openclaw backup create")}`);
	if (dryRun) runtime.log("[dry-run] stop gateway service");
	else if (!await stopGatewayIfRunning(runtime)) {
		runtime.exit(1);
		return;
	}
	const cleanupPlan = dryRun ? await resolveCleanupPlanForDryRun() : await resolveCleanupPlanForRemoval(runtime);
	if (!cleanupPlan) {
		runtime.exit(1);
		return;
	}
	const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } = cleanupPlan;
	let failed = false;
	if (scope === "config+creds+sessions") {
		try {
			await removeAgentSessions(cleanupPlan, runtime, { dryRun });
		} catch (error) {
			runtime.error(`Failed to reset session history: ${String(error)}`);
			failed = true;
		}
		const configRemoval = await removePath(configPath, runtime, {
			dryRun,
			label: configPath
		});
		const oauthRemoval = await removePath(oauthDir, runtime, {
			dryRun,
			label: oauthDir
		});
		failed ||= !configRemoval.ok || !oauthRemoval.ok;
	}
	if (scope === "full") {
		const stateRemoved = await removeStateAndLinkedPaths({
			stateDir,
			configPath,
			oauthDir,
			configInsideState,
			oauthInsideState
		}, runtime, { dryRun });
		const workspaceFailures = await removeWorkspaceDirs(workspaceDirs, runtime, {
			dryRun,
			removeStateRows: !stateRemoved
		});
		failed = !stateRemoved || workspaceFailures.length > 0;
	}
	if (failed) {
		runtime.error("Reset incomplete. Resolve the cleanup errors above, then retry reset.");
		runtime.exit(1);
		return;
	}
	runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
}
//#endregion
export { resetCommand };
