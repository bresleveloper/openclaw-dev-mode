import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
import { n as runInteractiveOnboarding } from "./onboard-interactive-runner-COt3dPZT.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { t as runSetupWizard } from "./setup-Wtsw3u4v.mjs";
//#region src/commands/onboard-interactive.ts
/** Runs the interactive setup wizard and maps user cancellation to exit code 1. */
async function runInteractiveSetup(opts, runtime = defaultRuntime) {
	const prompter = createClackPrompter();
	await runInteractiveOnboarding(async () => await runSetupWizard(opts, runtime, prompter), runtime);
}
/**
* Opens the OpenClaw onboarding conversation used by the guided escape hatch.
* The first-run greeting proposes a setup plan and keeps subsequent setup and
* agent handoff in the same conversation.
*/
async function runConversationalOnboarding(opts, runtime = defaultRuntime) {
	if (!isTerminalInteractive()) {
		runtime.error("Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.");
		runtime.exit(1);
		return;
	}
	const { verifySetupInference } = await import("./system-agent/setup-inference.js");
	const inference = await verifySetupInference({
		runtime,
		bindSession: true
	});
	if (!inference.ok) {
		runtime.error(`OpenClaw requires working inference: ${inference.error}`);
		runtime.exit(1);
		return;
	}
	const { runSystemAgent } = await import("./system-agent/system-agent.js");
	await runSystemAgent({
		welcomeVariant: "onboarding",
		...opts.workspace ? { setupWorkspace: opts.workspace } : {},
		...opts.agentName ? { setupAgentName: opts.agentName } : {},
		verifiedInference: inference.binding
	}, runtime);
}
//#endregion
export { runConversationalOnboarding, runInteractiveSetup };
