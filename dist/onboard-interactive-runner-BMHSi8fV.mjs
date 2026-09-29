import { t as restoreTerminalState } from "./restore-CKYlAJHw.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import path from "node:path";
//#region src/commands/onboard-interactive-runner.ts
function hasInteractiveOnboardingTty() {
	return isTerminalInteractive();
}
async function runInteractiveOnboarding(action, runtime) {
	let exitCode = null;
	try {
		await action();
	} catch (error) {
		if (error instanceof WizardCancelledError) {
			exitCode = 1;
			return;
		}
		throw error;
	} finally {
		restoreTerminalState("setup finish", { resumeStdinIfPaused: false });
		if (exitCode !== null) runtime.exit(exitCode);
	}
}
async function launchHatchTui(workspace, local, agentId) {
	const [{ launchTuiCli }, { DEFAULT_BOOTSTRAP_FILENAME }, fs] = await Promise.all([
		import("./tui-launch-BWnQeO0z.mjs"),
		import("./workspace-BOloB4w1.mjs"),
		import("node:fs")
	]);
	const hasBootstrap = fs.existsSync(path.join(workspace, DEFAULT_BOOTSTRAP_FILENAME));
	restoreTerminalState("guided hatch tui", { resumeStdinIfPaused: false });
	try {
		await launchTuiCli({
			...local ? { local: true } : {},
			deliver: false,
			...agentId ? { session: `agent:${agentId}:main` } : {},
			...hasBootstrap ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {}
		});
	} finally {
		restoreTerminalState("post guided hatch tui", { resumeStdinIfPaused: false });
	}
}
async function runGuidedOnboardingHandoff(handoff, opts, runtime, deps) {
	if (!handoff) return;
	if (handoff.next === "foreground-gateway") {
		await (deps.runForegroundGateway ?? (await import("./onboard-quickstart-host-BjrNXVBU.mjs")).runQuickstartForegroundGateway)({
			runtime,
			...handoff.agentId ? { agentId: handoff.agentId } : {},
			...opts.suppressGatewayTokenOutput ? { suppressTokenOutput: true } : {}
		});
		return;
	}
	if (handoff.next === "hatch") {
		if (deps.launchHatchTui) await deps.launchHatchTui(handoff.workspace);
		else await launchHatchTui(handoff.workspace, handoff.local, handoff.agentId);
		return;
	}
	if (handoff.next === "browser") return;
	if (deps.runSystemAgentChat) await deps.runSystemAgentChat(handoff.workspace, runtime, true, handoff.agentName);
	else {
		const { runConversationalOnboarding } = await import("./onboard-interactive-CfFb1gdf.mjs");
		await runConversationalOnboarding({
			workspace: handoff.workspace,
			...handoff.agentName ? { agentName: handoff.agentName } : {},
			acceptRisk: true
		}, runtime);
	}
}
//#endregion
export { runGuidedOnboardingHandoff as n, runInteractiveOnboarding as r, hasInteractiveOnboardingTty as t };
