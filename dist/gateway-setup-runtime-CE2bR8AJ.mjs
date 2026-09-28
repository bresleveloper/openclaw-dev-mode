import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import "./daemon-runtime-D15REPfs.mjs";
import { o as readDaemonRuntimePinForInstall } from "./runtime-pin-state-Bz2yXWLQ.mjs";
//#region src/commands/gateway-setup-runtime.ts
/** Resolve setup runtime intent without turning automatic choices into persistent pins. */
async function resolveGatewaySetupRuntime(params) {
	const expected = readDaemonRuntimePinForInstall({
		kind: "gateway",
		env: params.env
	}, params.existingCommand, params.runtime !== void 0);
	const pin = params.runtime === void 0 ? expected.pin : void 0;
	const runtime = params.runtime ?? pin?.runtime ?? await params.selectRuntime?.() ?? "node";
	const existing = resolveManagedGatewayServiceCommand(params.existingCommand);
	return {
		runtime,
		pinnedRuntimePath: pin?.path,
		runtimePinUpdate: {
			expected,
			pin
		},
		env: {
			...params.env,
			OPENCLAW_WRAPPER: params.env.OPENCLAW_WRAPPER ?? existing?.environment?.OPENCLAW_WRAPPER
		}
	};
}
//#endregion
export { resolveGatewaySetupRuntime as t };
