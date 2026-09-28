import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import { a as nodesCallOpts, t as buildNodeInvokeParams } from "./rpc-Dx3CvfPQ.mjs";
import { n as getNodesTheme, r as runNodesCommand } from "./cli-utils-PQix6ghS.mjs";
import "./node-cli-runtime-XmjZjEuE.mjs";
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
/** Creates the default Canvas CLI dependency bundle backed by the OpenClaw gateway CLI. */
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
/** Prints the complete invocation response for machines or the existing human acknowledgement. */
function writeCanvasInvokeResult(deps, opts, result, message) {
	if (opts.json) {
		deps.defaultRuntime.writeJson(result);
		return;
	}
	const { ok } = deps.getNodesTheme();
	deps.defaultRuntime.log(ok(message));
}
/** Registers Canvas subcommands under the nodes CLI command group. */
function registerNodesCanvasCommands(nodes, deps) {
	const canvas = nodes.command("canvas").description("Present widget documents on a paired macOS panel");
	deps.nodesCallOpts(canvas.command("present").description("Show the canvas (optionally with a target URL/path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--target <urlOrPath>", "Target URL/path (optional)").option("--x <px>", "Placement x coordinate").option("--y <px>", "Placement y coordinate").option("--width <px>", "Placement width").option("--height <px>", "Placement height").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (opts) => {
		await deps.runNodesCommand("canvas present", async () => {
			const placement = {
				x: parseCanvasFiniteNumberOption(opts.x, "--x"),
				y: parseCanvasFiniteNumberOption(opts.y, "--y"),
				width: parseCanvasFiniteNumberOption(opts.width, "--width"),
				height: parseCanvasFiniteNumberOption(opts.height, "--height")
			};
			const params = {};
			if (opts.target) params.url = opts.target;
			if (Number.isFinite(placement.x) || Number.isFinite(placement.y) || Number.isFinite(placement.width) || Number.isFinite(placement.height)) params.placement = placement;
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.present", params), "canvas present ok");
		});
	}));
	deps.nodesCallOpts(canvas.command("hide").description("Hide the canvas").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (opts) => {
		await deps.runNodesCommand("canvas hide", async () => {
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.hide", void 0), "canvas hide ok");
		});
	}));
	deps.nodesCallOpts(canvas.command("navigate").description("Navigate the canvas to a URL").argument("<url>", "Target URL/path").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--invoke-timeout <ms>", "Node invoke timeout in ms").action(async (url, opts) => {
		await deps.runNodesCommand("canvas navigate", async () => {
			writeCanvasInvokeResult(deps, opts, await invokeCanvas(deps, opts, "canvas.navigate", { url }), "canvas navigate ok");
		});
	}));
}
//#endregion
export { registerNodesCanvasCommands as n, createDefaultCanvasCliDependencies as t };
