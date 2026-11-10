import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as resolveNodeFromNodeList, r as resolveNodeIdFromNodeList } from "./node-resolve-BgOPs6pS.mjs";
import { t as SYSTEM_RUN_EXECUTION_CONTEXT_CAPABILITY } from "./system-run-execution-context-CZiH0vuO.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { t as getAgentToolAssistantTurnId } from "./tool-execution-context-BwYF5HLu.mjs";
import { t as parseNodeList } from "./node-list-parse-Ro4PZqnC.mjs";
import crypto from "node:crypto";
//#region src/agents/tools/nodes-utils.ts
function nodeToolIdempotencyKey(params) {
	const stableScope = params.scope?.trim();
	const stableCallId = params.toolCallId.trim();
	if (!stableScope || !stableCallId) return crypto.randomUUID();
	const parts = [
		stableScope,
		getAgentToolAssistantTurnId() ?? "",
		stableCallId,
		params.command
	];
	if (params.purpose) parts.push(params.purpose);
	return `${params.purpose ? "computer.observation" : params.command}:v2:${sha256Hex(JSON.stringify(parts))}`;
}
function isLocalMacNode(node) {
	return normalizeOptionalLowercaseString(node.platform)?.startsWith("mac") === true && typeof node.nodeId === "string" && node.nodeId.startsWith("mac-");
}
function compareNewestTimestamp(a, b) {
	const aValue = Number.isFinite(a) ? a ?? 0 : -1;
	return (Number.isFinite(b) ? b ?? 0 : -1) - aValue;
}
function selectDefaultNodeFromList(nodes, options = {}) {
	const capability = options.capability?.trim();
	const withCapability = capability ? nodes.filter((n) => Array.isArray(n.caps) ? n.caps.includes(capability) : true) : nodes;
	if (withCapability.length === 0) return null;
	const connected = withCapability.filter((n) => n.connected);
	const candidates = connected.length > 0 ? connected : withCapability;
	if (candidates.length === 1) return candidates.at(0) ?? null;
	if (options.preferLocalMac ?? true) {
		const local = candidates.filter(isLocalMacNode);
		if (local.length === 1) return local.at(0) ?? null;
	}
	if ((options.fallback ?? "none") === "none") return null;
	const recencyField = connected.length > 0 ? "connectedAtMs" : "lastSeenAtMs";
	return candidates.reduce((best, node) => {
		return (best ? compareNewestTimestamp(node[recencyField], best[recencyField]) || node.nodeId.localeCompare(best.nodeId) : -1) < 0 ? node : best;
	}, null);
}
function pickDefaultNode(nodes) {
	return selectDefaultNodeFromList(nodes, {
		capability: "canvas",
		fallback: "first",
		preferLocalMac: true
	});
}
async function listNodes(opts, signal) {
	let supportsContext = true;
	const res = await callGatewayTool("node.list", opts, {}, {
		signal,
		onHelloOk: (hello) => {
			supportsContext = hello.features.capabilities?.includes(SYSTEM_RUN_EXECUTION_CONTEXT_CAPABILITY) === true;
		}
	});
	const nodes = parseNodeList(res);
	if (!supportsContext) for (const node of nodes) node.caps = node.caps?.filter((cap) => cap !== SYSTEM_RUN_EXECUTION_CONTEXT_CAPABILITY);
	return nodes;
}
function resolveNodeIdFromList(nodes, query, allowDefault = false, options = {}) {
	return resolveNodeIdFromNodeList(nodes, query, {
		allowDefault,
		allowCompactDisplayName: options.allowCompactDisplayName,
		pickDefaultNode
	});
}
async function resolveAgentNodeId(opts, query) {
	return (await resolveAgentNode(opts, query)).nodeId;
}
async function resolveAgentNode(opts, query) {
	return resolveNodeFromNodeList(await listNodes(opts), query);
}
async function invokeAgentNodeCommand(params) {
	const raw = await callGatewayTool("node.invoke", params.gatewayOpts, {
		nodeId: params.nodeId,
		command: params.command,
		params: params.commandParams,
		timeoutMs: params.timeoutMs,
		idempotencyKey: params.idempotencyKey ?? crypto.randomUUID()
	}, { signal: params.signal });
	return raw && typeof raw === "object" && Object.hasOwn(raw, "payload") ? raw.payload : raw;
}
//#endregion
export { resolveAgentNodeId as a, resolveAgentNode as i, listNodes as n, resolveNodeIdFromList as o, nodeToolIdempotencyKey as r, selectDefaultNodeFromList as s, invokeAgentNodeCommand as t };
