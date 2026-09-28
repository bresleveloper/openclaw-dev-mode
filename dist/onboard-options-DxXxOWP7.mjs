import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { n as isOnboardFlow, t as isNodeManagerChoice } from "./onboard-types-Du2Y9b-2.mjs";
//#region src/commands/onboard-options.ts
/**
* Shared choice validation and rejection for `openclaw onboard` options.
*
* Lives above the local/remote split because both the outer command and the
* non-interactive handlers reject options, and every one of them must honor --json.
*/
/** Reports an invalid option and exits; returns false so validators can `return` it directly. */
function rejectOnboardingOption(opts, runtime, message) {
	if (opts.json) writeRuntimeJson(runtime, {
		ok: false,
		phase: "options",
		message
	});
	runtime.error(message);
	runtime.exit(1);
	return false;
}
function validateOnboardingChoiceOptions(opts, runtime) {
	const choiceValidations = [
		[
			"--gateway-bind",
			opts.gatewayBind,
			[
				"loopback",
				"tailnet",
				"lan",
				"auto",
				"custom"
			]
		],
		[
			"--gateway-auth",
			opts.gatewayAuth,
			["token", "password"]
		],
		[
			"--tailscale",
			opts.tailscale,
			[
				"off",
				"serve",
				"funnel"
			]
		],
		[
			"--custom-compatibility",
			opts.customCompatibility,
			[
				"openai",
				"openai-responses",
				"anthropic"
			]
		]
	];
	for (const [flag, value, allowed] of choiceValidations) if (value !== void 0 && !allowed.includes(value)) return rejectOnboardingOption(opts, runtime, `Invalid ${flag} ${JSON.stringify(value)}. Use ${allowed.map((choice) => JSON.stringify(choice)).join(", ")}.`);
	if (opts.flow !== void 0 && !isOnboardFlow(opts.flow)) return rejectOnboardingOption(opts, runtime, "Invalid --flow. Use \"quickstart\", \"advanced\", \"manual\", or \"import\".");
	if (opts.daemonRuntime !== void 0 && !isGatewayDaemonRuntime(opts.daemonRuntime)) return rejectOnboardingOption(opts, runtime, "Invalid --daemon-runtime. Use \"node\" or \"bun\".");
	if (opts.nodeManager !== void 0 && !isNodeManagerChoice(opts.nodeManager)) return rejectOnboardingOption(opts, runtime, "Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
	if (opts.gatewayPort !== void 0 && (!Number.isFinite(opts.gatewayPort) || opts.gatewayPort <= 0 || opts.gatewayPort > 65535)) return rejectOnboardingOption(opts, runtime, formatInvalidPortOption("--gateway-port"));
	return true;
}
//#endregion
export { validateOnboardingChoiceOptions as n, rejectOnboardingOption as t };
