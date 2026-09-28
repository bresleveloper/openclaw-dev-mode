import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as withConsoleSubsystemsSuppressed } from "./console-DwqfhE-H.mjs";
//#region src/commands/system-agent-with-inference.ts
function hasInteractiveTty(opts) {
	const input = opts.input ?? process.stdin;
	const output = opts.output ?? process.stdout;
	return input.isTTY === true && output.isTTY === true;
}
function isOneShotRequest(opts) {
	return Boolean(opts.json || opts.message?.trim() || opts.interactive === false);
}
function failOneShotExecution(opts, runtime, error) {
	const message = formatErrorMessage(error);
	if (opts.json) writeRuntimeJson(runtime, {
		ok: false,
		error: message
	});
	else runtime.error(message);
	if (!requestExitAfterOneShotOutput(runtime, 1)) runtime.exit(1);
}
/**
* Start OpenClaw only after the configured default model completes a real
* turn. Interactive failures return to inference onboarding; automation fails
* closed with a stable command operators can run to repair the prerequisite.
*/
async function runSystemAgentWithInference(opts = {}, runtime = defaultRuntime, onboardingOptions = {}, deps = {}) {
	if (opts.yes && !opts.message?.trim()) {
		failOneShotExecution(opts, runtime, /* @__PURE__ */ new Error("OpenClaw --yes requires --message so approval is limited to one request."));
		return;
	}
	const oneShot = isOneShotRequest(opts);
	if (!oneShot && !hasInteractiveTty(opts)) {
		runtime.error("OpenClaw needs an interactive TTY. Use --message for one command.");
		runtime.exit(1);
		return;
	}
	let inference;
	try {
		const verifyInference = deps.verifyInference ?? (await import("./system-agent/setup-inference.js")).verifySetupInference;
		inference = await withConsoleSubsystemsSuppressed(() => verifyInference({
			runtime,
			bindSession: true
		}));
	} catch (error) {
		if (!oneShot) throw error;
		failOneShotExecution(opts, runtime, error);
		return;
	}
	if (inference.ok) {
		const runSystemAgent = deps.runSystemAgent ?? (await import("./system-agent/system-agent.js")).runSystemAgent;
		try {
			await runSystemAgent({
				...opts,
				verifiedInference: inference.binding
			}, runtime);
		} catch (error) {
			if (!oneShot) throw error;
			failOneShotExecution(opts, runtime, error);
			return;
		}
		if (oneShot) requestExitAfterOneShotOutput(runtime);
		return;
	}
	if (oneShot) {
		const guidance = "Run `openclaw onboard` to connect and live-test AI first.";
		if (opts.json) writeRuntimeJson(runtime, {
			ok: false,
			status: inference.status,
			error: `OpenClaw requires working inference: ${inference.error}`,
			guidance
		});
		else runtime.error([`OpenClaw requires working inference: ${inference.error}`, guidance].join("\n"));
		if (!requestExitAfterOneShotOutput(runtime, 1)) runtime.exit(1);
		return;
	}
	runtime.log("OpenClaw requires working inference. Starting guided AI setup…");
	await (deps.runGuidedOnboarding ?? (await import("./commands/onboard-guided.js")).runGuidedOnboarding)(onboardingOptions, runtime, { handoffMode: "chat" });
}
//#endregion
export { runSystemAgentWithInference };
