import { t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
//#region src/commands/daemon-runtime.ts
const DEFAULT_GATEWAY_DAEMON_RUNTIME = "node";
const GATEWAY_DAEMON_RUNTIME_OPTIONS = [{
	value: "node",
	label: "Node",
	hint: "Primary and recommended runtime for managed services."
}, {
	value: "bun",
	label: "Bun 1.4+",
	hint: "Requires Bun 1.4 or newer with WAL-reset-safe node:sqlite."
}];
/** Narrow arbitrary input to a supported Gateway daemon runtime id. */
function isGatewayDaemonRuntime(value) {
	return value === "bun" || value === "node";
}
/** Detects the runtime selected by an installed daemon command. */
function resolveGatewayDaemonRuntime(programArguments) {
	return isBunRuntime(programArguments?.[0] ?? "") ? "bun" : DEFAULT_GATEWAY_DAEMON_RUNTIME;
}
//#endregion
export { resolveGatewayDaemonRuntime as i, GATEWAY_DAEMON_RUNTIME_OPTIONS as n, isGatewayDaemonRuntime as r, DEFAULT_GATEWAY_DAEMON_RUNTIME as t };
