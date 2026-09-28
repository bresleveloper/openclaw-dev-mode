import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as runInteractiveOnboarding, t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-C71N_qOR.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { t as runSetupWizard } from "./setup-Bgw_SxU1.mjs";
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
	if (!hasInteractiveOnboardingTty()) {
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
export { runInteractiveSetup as n, runConversationalOnboarding as t };
