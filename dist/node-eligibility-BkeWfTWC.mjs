import { i as optionalFiniteNumberSchema, l as stringEnum, o as optionalPositiveIntegerSchema } from "./typebox-X-jU33BZ.mjs";
import { t as resolveEligibleNodeFromList } from "./node-resolve-CiEFPm1c.mjs";
import "./node-selection-runtime-D8bMg85c.mjs";
import "./channel-actions-DF1kQl0D.mjs";
import { Type } from "typebox";
const canvasToolDefinition = {
	label: "Canvas",
	name: "canvas",
	resultContentSource: "network",
	description: "Present, hide, or navigate the widget panel on a paired macOS node.",
	parameters: Type.Object({
		action: stringEnum([
			"present",
			"hide",
			"navigate"
		]),
		gatewayUrl: Type.Optional(Type.String()),
		gatewayToken: Type.Optional(Type.String()),
		timeoutMs: optionalPositiveIntegerSchema(),
		node: Type.Optional(Type.String()),
		target: Type.Optional(Type.String()),
		x: optionalFiniteNumberSchema(),
		y: optionalFiniteNumberSchema(),
		width: optionalFiniteNumberSchema(),
		height: optionalFiniteNumberSchema(),
		url: Type.Optional(Type.String())
	})
};
//#endregion
//#region extensions/canvas/src/node-eligibility.ts
const CANVAS_PRESENT_COMMAND = "canvas.present";
function isEligibleCanvasNode(node) {
	const commands = node.invocableCommands ?? node.commands ?? [];
	return /^macos(?:\s|$)/i.test(node.platform ?? "") && node.connected === true && commands.includes("canvas.present");
}
const CANVAS_NODE_MESSAGES = {
	ineligibleExact: (query, eligibleIds) => `node "${query}" is not an eligible Canvas panel (requires a connected macOS node advertising ${CANVAS_PRESENT_COMMAND}; eligible node ids: ${eligibleIds})`,
	nameResolveFailed: (reason, eligibleIds) => `${reason} (eligible Canvas panel node ids: ${eligibleIds})`,
	noneEligible: () => `no eligible Canvas panel (requires a connected macOS node advertising ${CANVAS_PRESENT_COMMAND})`,
	multipleEligible: (eligible) => `multiple eligible Canvas panels connected; pass node explicitly: ${eligible.map((node) => node.nodeId).join(", ")}`
};
function resolveCanvasNodeFromList(nodes, query) {
	return resolveEligibleNodeFromList(nodes, query, isEligibleCanvasNode, CANVAS_NODE_MESSAGES);
}
//#endregion
export { canvasToolDefinition as i, isEligibleCanvasNode as n, resolveCanvasNodeFromList as r, CANVAS_PRESENT_COMMAND as t };
