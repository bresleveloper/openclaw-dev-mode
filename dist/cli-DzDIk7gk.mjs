import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { n as getNodesTheme, r as runNodesCommand } from "./cli-utils-Cbgn1wbg.mjs";
import { a as nodesCallOpts, t as buildNodeInvokeParams } from "./rpc-CM2D-Ain.mjs";
import "./node-cli-runtime-D3FyQDbI.mjs";
//#region extensions/canvas/src/cli.ts
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
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
async function callGatewayCli(method, opts, params, transportTimeoutMs) {
	const { callGatewayFromCli } = await import("./plugin-sdk/gateway-runtime.js");
	const timeout = String(transportTimeoutMs ?? opts.timeout ?? 1e4);
	return await callGatewayFromCli(method, {
		...opts,
		timeout
	}, params, { progress: opts.json !== true });
}
async function resolveNodeId(opts) {
	const { isGatewayClientRequestError, resolveNodeFromNodeList } = await import("./plugin-sdk/gateway-runtime.js");
	let raw;
	try {
		raw = await callGatewayCli("node.list", opts, {});
	} catch (error) {
		if (!isGatewayClientRequestError(error) || error.gatewayCode !== "INVALID_REQUEST" || error.retryable || error.message !== "unknown method: node.list") throw error;
		raw = await callGatewayCli("node.pair.list", opts, {});
	}
	return resolveNodeFromNodeList(parseNodeCandidates(raw), normalizeOptionalString(opts.node) ?? "").nodeId;
}
async function invokeCanvas(opts, command, params) {
	const invokeTimeoutMs = parseStrictPositiveInteger(opts.invokeTimeout);
	if (opts.invokeTimeout != null && invokeTimeoutMs === void 0) throw new Error("--invoke-timeout must be a positive integer.");
	const timeoutMs = clampPositiveTimerTimeoutMs(invokeTimeoutMs ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
	const nodeId = await resolveNodeId(opts);
	const invokeParams = buildNodeInvokeParams({
		nodeId,
		command,
		params,
		timeoutMs
	});
	const configuredGatewayTimeoutMs = parseStrictPositiveInteger(opts.timeout ?? 1e4);
	if (configuredGatewayTimeoutMs === void 0) return await callGatewayCli("node.invoke", opts, invokeParams);
	return await callGatewayCli("node.invoke", opts, invokeParams, Math.max(clampPositiveTimerTimeoutMs(configuredGatewayTimeoutMs) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS, addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs));
}
async function runCanvasCommand(opts, action, params) {
	await runNodesCommand(`canvas ${action}`, async () => {
		const result = await invokeCanvas(opts, `canvas.${action}`, params?.());
		if (opts.json) defaultRuntime.writeJson(result);
		else {
			const { ok } = getNodesTheme();
			defaultRuntime.log(ok(`canvas ${action} ok`));
		}
	});
}
function registerNodesCanvasCommands(nodes) {
	const canvas = nodes.command("canvas").description("Present widget documents on a paired macOS panel");
	nodesCallOpts(canvas.command("present").description("Show the canvas (optionally with a target URL/path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--target <urlOrPath>", "Target URL/path (optional)").option("--x <px>", "Placement x coordinate").option("--y <px>", "Placement y coordinate").option("--width <px>", "Placement width").option("--height <px>", "Placement height").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((opts) => runCanvasCommand(opts, "present", () => {
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
	nodesCallOpts(canvas.command("hide").description("Hide the canvas").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((opts) => runCanvasCommand(opts, "hide")));
	nodesCallOpts(canvas.command("navigate").description("Navigate the canvas to a URL").argument("<url>", "Target URL/path").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action((url, opts) => runCanvasCommand(opts, "navigate", () => ({ url }))));
}
//#endregion
export { registerNodesCanvasCommands as t };
