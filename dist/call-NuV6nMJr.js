import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-CcqJJIan.js";
import { c as callGateway } from "./call-5Sj7eTyY.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
//#region src/cli/gateway-cli/call.ts
const DEFAULT_GATEWAY_RPC_TIMEOUT_MS = 1e4;
const callGatewayCli = async (method, opts, params) => {
	const timeoutMs = opts.timeout === null ? null : parseTimeoutMsWithFallback(opts.timeout, DEFAULT_GATEWAY_RPC_TIMEOUT_MS, { invalidType: "error" });
	return await withProgress({
		label: `Gateway ${method}`,
		indeterminate: true,
		enabled: opts.json !== true
	}, async () => await callGateway({
		config: opts.config,
		url: opts.url,
		token: opts.token,
		password: opts.password,
		method,
		params,
		expectFinal: Boolean(opts.expectFinal),
		timeoutMs,
		localPortOverride: opts.localPortOverride,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI
	}));
};
//#endregion
export { callGatewayCli as t };
