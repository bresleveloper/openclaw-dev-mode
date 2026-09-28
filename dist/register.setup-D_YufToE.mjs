import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { r as listExplicitOptionFlagsExcept, t as hasExplicitOptions } from "./command-options-BDuSHeWG.mjs";
import { n as shouldStartLocalOnboarding } from "./fresh-install-config-Bi-9QLEM.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { a as registerOnboardRuntimeOptions, i as registerOnboardRemoteOptions, o as resolveOnboardCommandOptions, r as registerOnboardGatewayOptions, t as registerOnboardAuthOptions } from "./register.onboard-3x3qcfda.mjs";
//#region src/cli/program/register.setup.ts
const SYSTEM_AGENT_OPTION_NAMES = /* @__PURE__ */ new Set([
	"message",
	"yes",
	"json"
]);
const BASELINE_OPTION_NAMES = /* @__PURE__ */ new Set([
	"baseline",
	"workspace",
	"json"
]);
function resolveSetupCommandRoute(input) {
	if (input.hasOnboardingFlag) return "onboarding";
	if (input.hasSystemAgentRequest) return "system-agent";
	if (input.configured && (input.interactive || input.json)) return "system-agent";
	return "onboarding";
}
function hasExplicitOnboardingOption(command) {
	return command.options.some((option) => {
		const name = option.attributeName();
		return !SYSTEM_AGENT_OPTION_NAMES.has(name) && command.getOptionValueSource(name) === "cli";
	});
}
async function runSystemAgentEntry(options, runtime) {
	const { runSystemAgentWithInference } = await import("./system-agent-with-inference-LZ568eSs.mjs");
	await runSystemAgentWithInference({
		message: readStringValue(options.message),
		yes: Boolean(options.yes),
		json: Boolean(options.json)
	}, runtime);
}
async function runOnboardingEntry(options, commandRuntime, runtime) {
	if (options.baseline) {
		const unsupportedOptions = listExplicitOptionFlagsExcept(commandRuntime, BASELINE_OPTION_NAMES);
		if (unsupportedOptions.length > 0) {
			const { rejectOnboardingOption } = await import("./onboard-options-ByC5Mo7o.mjs");
			const message = `--baseline cannot be combined with: ${unsupportedOptions.join(", ")}.`;
			rejectOnboardingOption({ json: options.json === true }, runtime, message);
			return;
		}
		const { setupCommand } = await import("./setup-tRtSei_f.mjs");
		await setupCommand({
			workspace: readStringValue(options.workspace),
			json: Boolean(options.json)
		}, runtime);
		return;
	}
	const onboardingOptions = await resolveOnboardCommandOptions(options, commandRuntime, runtime);
	if (!onboardingOptions) return;
	const { setupWizardCommand } = await import("./onboard-CxMy3j1M.mjs");
	await setupWizardCommand(onboardingOptions, runtime);
}
function addSystemAgentOptions(command) {
	return command.option("-m, --message <text>", "Run one OpenClaw request").option("--yes", "Approve persistent config writes for one --message request", false).option("--json", "Output system overview or onboarding summary as JSON", false);
}
/** Register the canonical `setup` command and its hidden retired-name alias. */
function registerSetupCommand(program) {
	const command = program.command("setup").description("Chat with OpenClaw; onboard when setup is incomplete").addHelpText("after", () => `\n${theme.heading("Examples:")}\n  ${theme.command("openclaw setup")}\n    ${theme.muted("Chat with OpenClaw, or onboard when setup is incomplete.")}\n  ${theme.command("openclaw setup -m \"status\"")}\n    ${theme.muted("Run one system-agent request.")}\n  ${theme.command("openclaw setup --wizard")}\n    ${theme.muted("Run full onboarding.")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Workspace proposal for guided setup; persisted by baseline/classic/non-interactive setup").option("--agent-name <name>", "Name for the first agent (or team coordinator)").option("--team", "Create a coordinator with researcher, writer, and reviewer specialists").option("--wizard", "Run interactive onboarding", false).option("--baseline", "Create baseline config/workspace/session folders without onboarding", false).option("--reset", "Reset config + credentials + sessions before running onboarding (workspace only with --reset-scope full)").option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full").option("--non-interactive", "Run onboarding without prompts", false).option("--classic", "Use the classic multi-step setup wizard", false).option("--tui", "Use the terminal hatch instead of the browser handoff", false).option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false).option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import").option("--mode <mode>", "Onboard mode: local|remote");
	registerOnboardAuthOptions(command);
	registerOnboardGatewayOptions(command);
	registerOnboardRuntimeOptions(command, "setup");
	registerOnboardRemoteOptions(command);
	addSystemAgentOptions(command).action(async (rawOptions, commandRuntime) => {
		const { defaultRuntime } = await import("./runtime-pvh-jBbt.mjs");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const options = rawOptions;
			const hasOnboardingFlag = hasExplicitOnboardingOption(commandRuntime);
			const hasSystemAgentRequest = hasExplicitOptions(commandRuntime, ["message", "yes"]);
			let configured = false;
			if (!hasOnboardingFlag && !hasSystemAgentRequest) {
				const { readConfigFileSnapshot } = await import("./config/config.js");
				configured = !await shouldStartLocalOnboarding(await readConfigFileSnapshot());
			}
			if (resolveSetupCommandRoute({
				hasOnboardingFlag,
				hasSystemAgentRequest,
				configured,
				interactive: process.stdin.isTTY && process.stdout.isTTY,
				json: Boolean(options.json)
			}) === "system-agent") {
				await runSystemAgentEntry(options, defaultRuntime);
				return;
			}
			await runOnboardingEntry(options, commandRuntime, defaultRuntime);
		});
	});
	addSystemAgentOptions(program.command("crestodian", { hidden: true }).description("Deprecated: use openclaw setup")).action(async (options) => {
		const { defaultRuntime } = await import("./runtime-pvh-jBbt.mjs");
		await runCommandWithRuntime(defaultRuntime, async () => {
			await runSystemAgentEntry(options, defaultRuntime);
		});
	});
}
//#endregion
export { registerSetupCommand };
