import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-DhiHLAN-.mjs";
import { u as resolveRecordedDaemonRuntime } from "./runtime-paths-D7k3lrcM.mjs";
import "./daemon-runtime-DLyccFUz.mjs";
import { a as resolveRunningBunFallback } from "./daemon-install-runtime-warning-D95FO_9s.mjs";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-C3yIkpN-.mjs";
//#region src/commands/gateway-service-setup.ts
async function prepareGatewayServiceInstall(params) {
	const { runtimePinUpdate, ...runtime } = params.selection;
	const plan = await buildGatewayInstallPlan({
		...runtime,
		port: params.port,
		existingCommand: params.existingCommand,
		config: params.config,
		warn: params.warn
	});
	return {
		runtime: plan.runtime,
		install: () => params.service.install({
			env: process.env,
			stdout: process.stdout,
			...plan,
			runtimePinUpdate
		})
	};
}
//#endregion
//#region src/commands/gateway-setup-runtime.ts
/** Resolve setup runtime intent without turning automatic choices into persistent pins. */
async function resolveGatewaySetupRuntime(params) {
	const expected = readDaemonRuntimePinForInstall({
		kind: "gateway",
		env: params.env
	}, params.existingCommand, params.runtime !== void 0);
	const pin = params.runtime === void 0 ? expected.pin : void 0;
	const existing = resolveManagedGatewayServiceCommand(params.existingCommand);
	const env = {
		...params.env,
		OPENCLAW_WRAPPER: params.env.OPENCLAW_WRAPPER ?? existing?.environment?.OPENCLAW_WRAPPER
	};
	const recordedRuntime = params.runtime === void 0 && !pin && !env.OPENCLAW_WRAPPER?.trim() ? await resolveRecordedDaemonRuntime(existing?.programArguments[0], env) : void 0;
	const retainedRuntime = recordedRuntime?.status === "supported" ? recordedRuntime : void 0;
	const bunFallbackPath = params.selectRuntime && params.runtime === void 0 && !pin && !retainedRuntime && !env.OPENCLAW_WRAPPER?.trim() ? await resolveRunningBunFallback({ env }) : void 0;
	const suggestedRuntime = retainedRuntime?.runtime ?? (bunFallbackPath ? "bun" : "node");
	const runtime = params.runtime ?? pin?.runtime ?? (params.selectRuntime ? await params.selectRuntime(suggestedRuntime) : suggestedRuntime);
	return {
		runtime,
		runtimeExplicit: params.runtime !== void 0 || pin !== void 0 || params.selectRuntime !== void 0,
		runtimePath: runtime === retainedRuntime?.runtime ? retainedRuntime.path : runtime === "bun" ? bunFallbackPath : void 0,
		pinnedRuntimePath: pin?.path,
		runtimePinUpdate: {
			expected,
			pin
		},
		env
	};
}
//#endregion
export { prepareGatewayServiceInstall as n, resolveGatewaySetupRuntime as t };
