import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
//#region src/cli/gateway-cli/health-route.ts
async function resolveRouteRpcOptions(args) {
	if (args.localPortOverride === void 0) return args.rpc;
	const { readNonObservingHealthConfig } = await import("./health-CEVl3-dw.mjs");
	const config = await readNonObservingHealthConfig();
	return {
		...args.rpc,
		localPortOverride: args.localPortOverride,
		config: {
			...config,
			gateway: {
				...config.gateway,
				mode: "local",
				port: args.localPortOverride
			}
		}
	};
}
/** Run the successful JSON path without loading text presentation modules. */
async function runGatewayHealthJsonRoute(args, runtime) {
	const rpc = await resolveRouteRpcOptions(args);
	try {
		const { callGatewayFromCliWithTransport } = await import("./gateway-rpc-DeRecJ9x.mjs");
		writeRuntimeJson(runtime, await callGatewayFromCliWithTransport("health", rpc, void 0, {
			defaultTimeoutMs: 1e4,
			sharedStateMode: "read-only"
		}));
	} catch (error) {
		const [{ emitReachableGatewayAuthDiagnostic, readNonObservingHealthConfig }, { formatGatewayAuthErrorJson, formatGatewayClientRequestErrorJson, formatGatewayTransportErrorJson }] = await Promise.all([import("./health-CEVl3-dw.mjs"), import("./call-BvbeEASg.mjs")]);
		if (await emitReachableGatewayAuthDiagnostic({
			error,
			config: rpc.config ?? await readNonObservingHealthConfig(),
			runtime,
			timeoutMs: Number(rpc.timeout ?? "10000"),
			token: rpc.token,
			password: rpc.password,
			localPortOverride: rpc.localPortOverride,
			json: true
		})) return;
		const payload = formatGatewayAuthErrorJson(error) ?? formatGatewayClientRequestErrorJson(error) ?? formatGatewayTransportErrorJson(error);
		if (payload) {
			writeRuntimeJson(runtime, payload);
			runtime.exit(1);
			return;
		}
		throw error;
	}
}
//#endregion
export { runGatewayHealthJsonRoute };
