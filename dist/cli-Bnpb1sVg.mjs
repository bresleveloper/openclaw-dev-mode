import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { a as nodesCallOpts, t as buildNodeInvokeParams } from "./rpc-BeESxF9C.mjs";
import { n as getNodesTheme, r as runNodesCommand } from "./cli-utils-xYWWHi8O.mjs";
import "./node-cli-runtime-CYYqAswo.mjs";
//#region extensions/canvas/src/cli.ts
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
function parseTimeoutMs(raw) {
	if (raw === void 0 || raw === null) return;
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error("--invoke-timeout must be a positive integer.");
	return parsed;
}
function parseCanvasFiniteNumberOption(raw, flag) {
	if (!raw) return;
	const parsed = parseStrictFiniteNumber(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a number.`);
	return parsed;
}
function parseNodeCandidates(raw) {
	const payload = raw && typeof raw === "object" ? raw : {};
	return (Array.isArray(payload.nodes) ? payload.nodes : Array.isArray(payload.paired) ? payload.paired : []).map((entry) => {
		if (!entry || typeof entry !== "object") return null;
		const node = entry;
		if (typeof node.nodeId !== "string") return null;
		const candidate = { nodeId: node.nodeId };
		if (typeof node.displayName === "string") candidate.displayName = node.displayName;
		if (typeof node.remoteIp === "string") candidate.remoteIp = node.remoteIp;
		if (typeof node.connected === "boolean") candidate.connected = node.connected;
		if (typeof node.clientId === "string") candidate.clientId = node.clientId;
		return candidate;
	}).filter((entry) => entry !== null);
}
function createDefaultCanvasCliDependencies() {
	const callGatewayCli = async (method, opts, params, callOpts) => {
		const { callGatewayFromCli } = await import("./plugin-sdk/gateway-runtime.js");
		const timeout = String(callOpts?.transportTimeoutMs ?? opts.timeout ?? 1e4);
		return await callGatewayFromCli(method, {
			...opts,
			timeout
		}, params, { progress: opts.json !== true });
	};
	return {
		defaultRuntime,
		nodesCallOpts,
		runNodesCommand,
		getNodesTheme,
		parseTimeoutMs,
		resolveNodeId: async (opts, query) => {
			const { isGatewayClientRequestError, resolveNodeFromNodeList } = await import("./plugin-sdk/gateway-runtime.js");
			let raw;
			try {
				raw = await callGatewayCli("node.list", opts, {});
			} catch (error) {
				if (!isGatewayClientRequestError(error) || error.gatewayCode !== "INVALID_REQUEST" || error.retryable || error.message !== "unknown method: node.list") throw error;
				raw = await callGatewayCli("node.pair.list", opts, {});
			}
			return resolveNodeFromNodeList(parseNodeCandidates(raw), query).nodeId;
		},
		buildNodeInvokeParams,
		callGatewayCli
	};
}
async function invokeCanvas(deps, opts, command, params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(deps.parseTimeoutMs(opts.invokeTimeout) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
	const nodeId = await deps.resolveNodeId(opts, normalizeOptionalString(opts.node) ?? "");
	const invokeParams = deps.buildNodeInvokeParams({
		nodeId,
		command,
		params,
		timeoutMs
	});
	const configuredGatewayTimeoutMs = parseStrictPositiveInteger(opts.timeout ?? 1e4);
	if (configuredGatewayTimeoutMs === void 0) return await deps.callGatewayCli("node.invoke", opts, invokeParams);
	const transportTimeoutMs = Math.max(clampPositiveTimerTimeoutMs(configuredGatewayTimeoutMs) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS, addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs);
	return await deps.callGatewayCli("node.invoke", opts, invokeParams, { transportTimeoutMs });
}
async function runCanvasCommand(deps, opts, action, params) {
	await deps.runNodesCommand(`canvas ${action}`, async () => {
		const result = await invokeCanvas(deps, opts, `canvas.${action}`, params?.());
		if (opts.json) deps.defaultRuntime.writeJson(result);
		else {
			const { ok } = deps.getNodesTheme();
			deps.defaultRuntime.log(ok(`canvas ${action} ok`));
		}
	});
}
function registerNodesCanvasCommands(nodes, deps) {
	const canvas = nodes.command("canvas").description("Present widget documents on a paired macOS panel");
	deps.nodesCallOpts(canvas.command("present").description("Show the canvas (optionally with a target URL/path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--target <urlOrPath>", "Target URL/path (optional)").option("--x <px>", "Placement x coordinate").option("--y <px>", "Placement y coordinate").option("--width <px>", "Placement width").option("--height <px>", "Placement height").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((opts) => runCanvasCommand(deps, opts, "present", () => {
		const placement = {
			x: parseCanvasFiniteNumberOption(opts.x, "--x"),
			y: parseCanvasFiniteNumberOption(opts.y, "--y"),
			width: parseCanvasFiniteNumberOption(opts.width, "--width"),
			height: parseCanvasFiniteNumberOption(opts.height, "--height")
		};
		const params = {};
		if (opts.target) params.url = opts.target;
		if (Object.values(placement).some(Number.isFinite)) params.placement = placement;
		return params;
	})));
	deps.nodesCallOpts(canvas.command("hide").description("Hide the canvas").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((opts) => runCanvasCommand(deps, opts, "hide")));
	deps.nodesCallOpts(canvas.command("navigate").description("Navigate the canvas to a URL").argument("<url>", "Target URL/path").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((url, opts) => runCanvasCommand(deps, opts, "navigate", () => ({ url }))));
}
//#endregion
export { registerNodesCanvasCommands as n, createDefaultCanvasCliDependencies as t };
