import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as callGatewayTool } from "./gateway-BHJLRjIg.js";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-BSOtZszw.js";
import { n as resolveNodeIdFromNodeList, t as resolveNodeFromNodeList } from "./node-resolve-B7HUotba.js";
//#region src/agents/agent-tools.params.ts
const RETRY_GUIDANCE_SUFFIX = " Supply correct parameters before retrying.";
const XML_ARG_VALUE_SUFFIX_RE = /<\/arg_value>>+$/;
const FILE_TOOL_PATH_PARAM_KEYS = new Set(["path"]);
const HALLUCINATED_OFFICE_PATH_EXTENSION_RE = /\.(doc|ppt|xls)(?:odex|codex|xodex|xcodex)$/i;
const OFFICE_EXTENSION_BY_FAMILY = {
	doc: ".docx",
	ppt: ".pptx",
	xls: ".xlsx"
};
function parameterValidationError(message) {
	return /* @__PURE__ */ new Error(`${message}.${RETRY_GUIDANCE_SUFFIX}`);
}
function describeReceivedParamValue(value, allowEmpty = false) {
	if (value === void 0 || value === null) return;
	if (typeof value === "string") {
		if (allowEmpty || value.trim().length > 0) return;
		return "<empty-string>";
	}
	if (Array.isArray(value)) return "<array>";
	return `<${typeof value}>`;
}
function formatReceivedParamHint(record, groups) {
	const allowEmptyKeys = /* @__PURE__ */ new Set();
	for (const group of groups) if (group.allowEmpty) for (const key of group.keys) allowEmptyKeys.add(key);
	const received = [];
	for (const key of Object.keys(record)) {
		const detail = describeReceivedParamValue(record[key], allowEmptyKeys.has(key));
		if (record[key] === void 0 || record[key] === null) continue;
		received.push(detail ? `${key}=${detail}` : key);
	}
	return received.length > 0 ? ` (received: ${received.join(", ")})` : "";
}
function isValidEditReplacement(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.oldText === "string" && record.oldText.trim().length > 0 && typeof record.newText === "string";
}
function hasValidEditReplacements(record) {
	const edits = record.edits;
	return Array.isArray(edits) && edits.length > 0 && edits.every((entry) => isValidEditReplacement(entry));
}
/** Required parameter groups for file-style tools that need retry guidance. */
const REQUIRED_PARAM_GROUPS = {
	read: [{
		keys: ["path"],
		label: "path"
	}],
	write: [{
		keys: ["path"],
		label: "path"
	}, {
		keys: ["content"],
		label: "content"
	}],
	edit: [{
		keys: ["path"],
		label: "path"
	}, {
		keys: ["edits"],
		label: "edits",
		validator: hasValidEditReplacements
	}]
};
/** Return a record view of model-supplied tool params when possible. */
function getToolParamsRecord(params) {
	return params && typeof params === "object" ? params : void 0;
}
/** Strip extra closing markers sometimes produced in XML arg_value path params. */
function stripMalformedXmlArgValueSuffix(value) {
	return value.includes("</arg_value>") ? value.replace(XML_ARG_VALUE_SUFFIX_RE, "") : value;
}
/** Normalize known model-hallucinated Office/codex path extensions. */
function normalizeHallucinatedOfficePathExtension(value) {
	return value.replace(HALLUCINATED_OFFICE_PATH_EXTENSION_RE, (_match, family) => {
		return OFFICE_EXTENSION_BY_FAMILY[family.toLowerCase()] ?? _match;
	});
}
/** Normalize model-supplied file-tool path params without touching payload text. */
function normalizeFileToolPathParam(value) {
	return normalizeHallucinatedOfficePathExtension(stripMalformedXmlArgValueSuffix(value));
}
/** Strip malformed XML suffixes from selected string fields without mutating input. */
function stripMalformedXmlArgValueSuffixFromKeys(record, keys) {
	let normalized;
	for (const key of keys) {
		const value = record[key];
		if (typeof value !== "string") continue;
		const stripped = stripMalformedXmlArgValueSuffix(value);
		if (stripped !== value) {
			normalized ??= { ...record };
			normalized[key] = stripped;
		}
	}
	return normalized ?? record;
}
/** Normalize selected file-tool path fields without mutating input. */
function normalizeFileToolPathParamsFromKeys(record, keys) {
	let normalized;
	for (const key of keys) {
		const value = record[key];
		if (typeof value !== "string") continue;
		const normalizedValue = normalizeFileToolPathParam(value);
		if (normalizedValue !== value) {
			normalized ??= { ...record };
			normalized[key] = normalizedValue;
		}
	}
	return normalized ?? record;
}
function resolveFileToolPathParamKeys(groups) {
	const keys = /* @__PURE__ */ new Set();
	for (const group of groups ?? []) for (const key of group.keys) if (FILE_TOOL_PATH_PARAM_KEYS.has(key)) keys.add(key);
	return [...keys];
}
/** Throw actionable retry guidance when required tool params are missing. */
function assertRequiredParams(record, groups, toolName) {
	if (!record || typeof record !== "object") throw parameterValidationError(`Missing parameters for ${toolName}`);
	const missingLabels = [];
	for (const group of groups) if (!(group.validator?.(record) ?? group.keys.some((key) => {
		if (!(key in record)) return false;
		const value = record[key];
		if (typeof value !== "string") return false;
		if (group.allowEmpty) return true;
		return value.trim().length > 0;
	}))) {
		const label = group.label ?? group.keys.join(" or ");
		missingLabels.push(label);
	}
	if (missingLabels.length > 0) {
		const joined = missingLabels.join(", ");
		throw parameterValidationError(`Missing required ${missingLabels.length === 1 ? "parameter" : "parameters"}: ${joined}${formatReceivedParamHint(record, groups)}`);
	}
}
/** Wrap a tool execute function with required-parameter validation. */
function wrapToolParamValidation(tool, requiredParamGroups) {
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const record = getToolParamsRecord(params);
			const pathKeys = resolveFileToolPathParamKeys(requiredParamGroups);
			const normalizedParams = record && pathKeys.length > 0 ? normalizeFileToolPathParamsFromKeys(record, pathKeys) : params;
			if (requiredParamGroups?.length) assertRequiredParams(getToolParamsRecord(normalizedParams), requiredParamGroups, tool.name);
			return tool.execute(toolCallId, normalizedParams, signal, onUpdate);
		}
	};
}
//#endregion
//#region src/agents/tools/nodes-utils.ts
/**
* Nodes lookup helpers.
*
* Loads paired nodes from Gateway and resolves requested/default nodes with legacy pair-list fallback.
*/
function messageFromError(error) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
	if (typeof error === "object" && error !== null) try {
		return JSON.stringify(error);
	} catch {
		return "";
	}
	return "";
}
function shouldFallbackToPairList(error) {
	const message = normalizeOptionalLowercaseString(messageFromError(error)) ?? "";
	if (!message.includes("node.list")) return false;
	return message.includes("unknown method") || message.includes("method not found") || message.includes("not implemented") || message.includes("unsupported");
}
async function loadNodes(opts) {
	try {
		return parseNodeList(await callGatewayTool("node.list", opts, {}));
	} catch (error) {
		if (!shouldFallbackToPairList(error)) throw error;
		const { paired } = parsePairingList(await callGatewayTool("node.pair.list", opts, {}));
		return paired.map((n) => ({
			nodeId: n.nodeId,
			displayName: n.displayName,
			platform: n.platform,
			remoteIp: n.remoteIp
		}));
	}
}
function isLocalMacNode(node) {
	return normalizeOptionalLowercaseString(node.platform)?.startsWith("mac") === true && typeof node.nodeId === "string" && node.nodeId.startsWith("mac-");
}
function compareDefaultNodeOrder(a, b) {
	const aConnectedAt = Number.isFinite(a.connectedAtMs) ? a.connectedAtMs ?? 0 : -1;
	const bConnectedAt = Number.isFinite(b.connectedAtMs) ? b.connectedAtMs ?? 0 : -1;
	if (aConnectedAt !== bConnectedAt) return bConnectedAt - aConnectedAt;
	return a.nodeId.localeCompare(b.nodeId);
}
/** Selects the implicit node target when a tool call omits an explicit node query. */
function selectDefaultNodeFromList(nodes, options = {}) {
	const capability = options.capability?.trim();
	const withCapability = capability ? nodes.filter((n) => Array.isArray(n.caps) ? n.caps.includes(capability) : true) : nodes;
	if (withCapability.length === 0) return null;
	const connected = withCapability.filter((n) => n.connected);
	const candidates = connected.length > 0 ? connected : withCapability;
	if (candidates.length === 1) return candidates[0];
	if (options.preferLocalMac ?? true) {
		const local = candidates.filter(isLocalMacNode);
		if (local.length === 1) return local[0];
	}
	if ((options.fallback ?? "none") === "none") return null;
	return [...candidates].toSorted(compareDefaultNodeOrder)[0] ?? null;
}
function pickDefaultNode(nodes) {
	return selectDefaultNodeFromList(nodes, {
		capability: "canvas",
		fallback: "first",
		preferLocalMac: true
	});
}
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
async function listNodes(opts) {
	return loadNodes(opts);
}
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
function resolveNodeIdFromList(nodes, query, allowDefault = false) {
	return resolveNodeIdFromNodeList(nodes, query, {
		allowDefault,
		pickDefaultNode
	});
}
/** Loads nodes from the Gateway and resolves the requested or default node id. */
async function resolveNodeId(opts, query, allowDefault = false) {
	return (await resolveNode(opts, query, allowDefault)).nodeId;
}
/** Loads nodes from the Gateway and returns the requested or default node record. */
async function resolveNode(opts, query, allowDefault = false) {
	return resolveNodeFromNodeList(await loadNodes(opts), query, {
		allowDefault,
		pickDefaultNode
	});
}
//#endregion
export { selectDefaultNodeFromList as a, getToolParamsRecord as c, stripMalformedXmlArgValueSuffixFromKeys as d, wrapToolParamValidation as f, resolveNodeIdFromList as i, normalizeFileToolPathParam as l, resolveNode as n, REQUIRED_PARAM_GROUPS as o, resolveNodeId as r, assertRequiredParams as s, listNodes as t, normalizeFileToolPathParamsFromKeys as u };
