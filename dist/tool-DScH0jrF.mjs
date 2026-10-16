import { a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam, s as readFiniteNumberParam, u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import { t as callGatewayTool } from "./gateway-w2F8o2pH.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { n as listNodes } from "./nodes-utils-4cDvmWkE.mjs";
import "./agent-harness-runtime-BxShxpgh.mjs";
import "./channel-actions-DF1kQl0D.mjs";
import "./param-readers-B4Zo5Lzz.mjs";
import { i as canvasToolDefinition, r as resolveCanvasNodeFromList, t as CANVAS_PRESENT_COMMAND } from "./node-eligibility-BkeWfTWC.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/canvas/src/tool.ts
const DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS = 3e4;
const CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS = 1e4;
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readToolStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readToolStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
function createCanvasTool(options) {
	return {
		...canvasToolDefinition,
		execute: async (_toolCallId, args) => {
			const params = args;
			const action = readToolStringParam(params, "action", { required: true });
			const gatewayOpts = readGatewayCallOptions(params);
			const nodeQuery = readToolStringParam(params, "node", { trim: true });
			const invoke = async (command, invokeParams) => {
				const nodeId = resolveCanvasNodeFromList(await listNodes(gatewayOpts), nodeQuery).nodeId;
				const timeoutMs = clampPositiveTimerTimeoutMs(gatewayOpts.timeoutMs ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS) ?? DEFAULT_CANVAS_NODE_INVOKE_TIMEOUT_MS;
				const transportTimeoutMs = addTimerTimeoutGraceMs(timeoutMs, CANVAS_NODE_INVOKE_TRANSPORT_GRACE_MS) ?? timeoutMs;
				await callGatewayTool("node.invoke", {
					...gatewayOpts,
					timeoutMs: transportTimeoutMs
				}, {
					nodeId,
					command,
					params: invokeParams,
					timeoutMs,
					idempotencyKey: randomUUID(),
					...options?.agentSessionKey ? { sessionKey: options.agentSessionKey } : {}
				});
				return nodeId;
			};
			switch (action) {
				case "present": {
					const placement = {
						x: readFiniteNumberParam(params, "x"),
						y: readFiniteNumberParam(params, "y"),
						width: readFiniteNumberParam(params, "width"),
						height: readFiniteNumberParam(params, "height")
					};
					const invokeParams = {};
					const presentTarget = readToolStringParam(params, "target", { trim: true }) ?? readToolStringParam(params, "url", { trim: true });
					if (presentTarget) invokeParams.url = presentTarget;
					if (Object.values(placement).some(Number.isFinite)) invokeParams.placement = placement;
					const node = await invoke(CANVAS_PRESENT_COMMAND, invokeParams);
					return jsonResult({
						ok: true,
						node,
						...presentTarget ? { url: presentTarget } : {}
					});
				}
				case "hide": {
					const node = await invoke("canvas.hide");
					return jsonResult({
						ok: true,
						node
					});
				}
				case "navigate": {
					const url = readToolStringParam(params, "url", { trim: true }) ?? readToolStringParam(params, "target", {
						required: true,
						trim: true,
						label: "url"
					});
					const node = await invoke("canvas.navigate", { url });
					return jsonResult({
						ok: true,
						node,
						url
					});
				}
				default: throw new Error(`Unknown action: ${action}`);
			}
		}
	};
}
//#endregion
export { createCanvasTool };
