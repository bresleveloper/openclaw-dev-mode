import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-BydhPR1U.mjs";
//#region src/cli/gateway-rpc.ts
const gatewayRpcRuntimeLoader = createLazyImportLoader(() => import("./gateway-rpc.runtime.js"));
async function loadGatewayRpcRuntime() {
	return gatewayRpcRuntimeLoader.load();
}
function addGatewayClientOptions(cmd, defaults) {
	return cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--port <port>", "Local Gateway port").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 3e4)).option("--expect-final", "Wait for final response (agent)", false);
}
function resolveGatewayRpcOptions(opts, command) {
	return {
		...opts,
		token: opts.token ?? inheritOptionFromParent(command, "token"),
		password: opts.password ?? inheritOptionFromParent(command, "password")
	};
}
function resolveGatewayRpcOptionsWithLocalPort(opts, command) {
	const port = command?.getOptionValueSource("port") === "default" ? void 0 : opts.port;
	const rpcOpts = {
		...resolveGatewayRpcOptions(opts, command),
		port: port ?? inheritOptionFromParent(command, "port")
	};
	return {
		...rpcOpts,
		localPortOverride: resolveGatewayLocalPortOverride(rpcOpts)
	};
}
async function callGatewayFromCli(method, opts, params, extra) {
	return await callGatewayFromCliWithTransport(method, opts, params, extra);
}
/** Resolve whether CLI Gateway options select the implicit local Gateway. */
async function isImplicitLocalGatewayTargetFromCli(opts) {
	return await (await loadGatewayRpcRuntime()).isImplicitLocalGatewayTargetFromCliRuntime(opts);
}
/** Local fallback is safe only for unavailable or explicitly supported older local Gateways. */
async function canFallbackToImplicitLocalGateway(params) {
	const gateway = await import("./call-bfuNQIMk.mjs");
	const { isGatewayRpcUnavailableError } = await import("./transport-error-D_17OdOK.mjs");
	const { config, error, legacyMethod, legacyAgentId } = params;
	const isLegacyError = legacyMethod !== void 0 && gateway.isGatewayClientRequestError(error) && error.gatewayCode === "INVALID_REQUEST" && (error.message === `unknown method: ${legacyMethod}` || legacyAgentId === true && (error.message === `invalid ${legacyMethod} params: unexpected property agentId` || error.message === `invalid ${legacyMethod} params: at root: unexpected property 'agentId'`));
	return (gateway.isGatewayCredentialsRequiredError(error) || isGatewayRpcUnavailableError(error) || isLegacyError) && await gateway.isImplicitLocalGatewayTarget({ config });
}
/** Internal CLI facade for callers that need transport or auth policy overrides. */
async function callGatewayFromCliWithTransport(method, opts, params, extra) {
	return await (await loadGatewayRpcRuntime()).callGatewayFromCliRuntime(method, opts, params, extra);
}
//#endregion
export { isImplicitLocalGatewayTargetFromCli as a, canFallbackToImplicitLocalGateway as i, callGatewayFromCli as n, resolveGatewayRpcOptions as o, callGatewayFromCliWithTransport as r, resolveGatewayRpcOptionsWithLocalPort as s, addGatewayClientOptions as t };
