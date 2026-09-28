import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as callGatewayTool } from "./gateway-DVDJurQC.mjs";
import { n as resolveNodeFromNodeList, r as resolveNodeIdFromNodeList } from "./node-resolve-Cy3jnd18.mjs";
import { t as parseNodeList } from "./node-list-parse-uI7vQ62q.mjs";
//#region src/agents/tools/nodes-utils.ts
function isLocalMacNode(node) {
	return normalizeOptionalLowercaseString(node.platform)?.startsWith("mac") === true && typeof node.nodeId === "string" && node.nodeId.startsWith("mac-");
}
function compareNewestTimestamp(a, b) {
	const aValue = Number.isFinite(a) ? a ?? 0 : -1;
	return (Number.isFinite(b) ? b ?? 0 : -1) - aValue;
}
function compareDefaultNodeOrder(a, b, recencyField) {
	const recencyOrder = compareNewestTimestamp(a[recencyField], b[recencyField]);
	if (recencyOrder !== 0) return recencyOrder;
	return a.nodeId.localeCompare(b.nodeId);
}
/** Selects the implicit node target when a tool call omits an explicit node query. */
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
	return candidates.reduce((best, node) => best === null || compareDefaultNodeOrder(node, best, recencyField) < 0 ? node : best, null);
}
function pickDefaultNode(nodes) {
	return selectDefaultNodeFromList(nodes, {
		capability: "canvas",
		fallback: "first",
		preferLocalMac: true
	});
}
/** Lists the Gateway node inventory. */
async function listNodes(opts, signal) {
	const res = await callGatewayTool("node.list", opts, {}, { signal });
	return parseNodeList(res);
}
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
function resolveNodeIdFromList(nodes, query, allowDefault = false, options = {}) {
	return resolveNodeIdFromNodeList(nodes, query, {
		allowDefault,
		allowCompactDisplayName: options.allowCompactDisplayName,
		pickDefaultNode
	});
}
/** Loads nodes from the Gateway and resolves the requested or default node id. */
async function resolveAgentNodeId(opts, query, allowDefault = false) {
	return (await resolveAgentNode(opts, query, allowDefault)).nodeId;
}
/** Loads nodes from the Gateway and returns the requested or default node record. */
async function resolveAgentNode(opts, query, allowDefault = false) {
	const nodes = await listNodes(opts);
	return resolveNodeFromNodeList(nodes, query, {
		allowDefault,
		pickDefaultNode
	});
}
//#endregion
export { selectDefaultNodeFromList as a, resolveNodeIdFromList as i, resolveAgentNode as n, resolveAgentNodeId as r, listNodes as t };
