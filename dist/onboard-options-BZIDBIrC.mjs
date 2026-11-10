import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { r as formatInvalidPortOption } from "./error-format-Cd0oOG4L.mjs";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-BIJk2T-m.mjs";
//#region src/commands/onboard-types.ts
const NODE_MANAGER_CHOICES = [
	"npm",
	"pnpm",
	"bun"
];
const ONBOARD_FLOWS = [
	"quickstart",
	"advanced",
	"manual",
	"import"
];
function isNodeManagerChoice(value) {
	return NODE_MANAGER_CHOICES.some((choice) => choice === value);
}
function isOnboardFlow(value) {
	return ONBOARD_FLOWS.some((flow) => flow === value);
}
//#endregion
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
		...formatCliJsonFailure(message),
		phase: "options",
		message
	});
	runtime.error(message);
	runtime.exit(1);
	return false;
}
function validateOnboardingChoiceOptions(opts, runtime) {
	const reject = (message) => rejectOnboardingOption(opts, runtime, message);
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
	for (const [flag, value, allowed] of choiceValidations) if (value !== void 0 && !allowed.includes(value)) return reject(`Invalid ${flag} ${JSON.stringify(value)}. Use ${allowed.map((choice) => JSON.stringify(choice)).join(", ")}.`);
	if (opts.flow !== void 0 && !isOnboardFlow(opts.flow)) return reject("Invalid --flow. Use \"quickstart\", \"advanced\", \"manual\", or \"import\".");
	if (opts.daemonRuntime !== void 0 && !isGatewayDaemonRuntime(opts.daemonRuntime)) return reject("Invalid --daemon-runtime. Use \"node\" or \"bun\".");
	if (opts.nodeManager !== void 0 && !isNodeManagerChoice(opts.nodeManager)) return reject("Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
	if (opts.gatewayPort !== void 0 && (!Number.isFinite(opts.gatewayPort) || opts.gatewayPort <= 0 || opts.gatewayPort > 65535)) return reject(formatInvalidPortOption("--gateway-port"));
	return true;
}
//#endregion
export { validateOnboardingChoiceOptions as n, rejectOnboardingOption as t };
