import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as preserveAtPrefixedRelativePath } from "./path-policy-BUkUD6xH.mjs";
import { a as getAgentToolActionDescriptor } from "./agent-tool-metadata-COcr-3AD.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { i as recordExecutionDecisionWork } from "./execution-decision-work-2rlltydX.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
//#region src/agents/agent-tools.params.ts
/**
* Shared validation for model-supplied tool parameters.
* Converts malformed file-tool arguments into retryable errors and fixes the
* specific XML suffix and Office-extension corruption seen in path arguments.
*/
const RETRY_GUIDANCE_SUFFIX = " Supply correct parameters before retrying.";
const XML_ARG_VALUE_SUFFIX_RE = /<\/arg_value>>+$/;
const FILE_TOOL_PATH_PARAM_KEYS = /* @__PURE__ */ new Set(["path"]);
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
		label: "content",
		allowEmpty: true
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
function normalizeFileToolPathParam(value, cwd, bridge) {
	const repaired = normalizeHallucinatedOfficePathExtension(stripMalformedXmlArgValueSuffix(value));
	return cwd ? Promise.resolve(preserveAtPrefixedRelativePath(repaired, cwd, bridge)) : repaired;
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
async function normalizeFileToolPathParamsFromKeys(record, keys, cwd, bridge) {
	let normalized;
	for (const key of keys) {
		const value = record[key];
		if (typeof value !== "string") continue;
		const normalizedValue = cwd ? await normalizeFileToolPathParam(value, cwd, bridge) : normalizeFileToolPathParam(value);
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
function wrapToolParamValidation(tool, requiredParamGroups, cwd, bridge) {
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const record = asOptionalObjectRecord(params);
			const pathKeys = resolveFileToolPathParamKeys(requiredParamGroups);
			const normalizedParams = record && pathKeys.length > 0 ? await normalizeFileToolPathParamsFromKeys(record, pathKeys, cwd, bridge) : params;
			if (requiredParamGroups?.length) assertRequiredParams(asOptionalObjectRecord(normalizedParams), requiredParamGroups, tool.name);
			return tool.execute(toolCallId, normalizedParams, signal, onUpdate);
		}
	};
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.decision.ts
const genericDecisions = {
	allowed: [
		"allowed",
		"attribution-only",
		"generic_action_attributed"
	],
	denied: [
		"denied",
		"enforced",
		"generic_action_policy_denied"
	],
	suppressed: [
		"not-applicable",
		"attribution-only",
		"generic_action_suppressed"
	]
};
const toolDecisionOwner = new AsyncLocalStorage();
/** Marks the current tool call after its owner-native decision record is registered. */
function markToolDecisionRecorded() {
	const state = toolDecisionOwner.getStore();
	if (state) state.recorded = true;
}
/** Records generic attribution only when execution creates no owner-native record. */
async function runWithGenericToolActionDecision(tool, toolCallId, run) {
	const state = { recorded: false };
	try {
		return await toolDecisionOwner.run(state, run);
	} finally {
		if (!state.recorded) recordGenericToolActionDecision(tool, toolCallId, "allowed");
	}
}
function recordGenericToolActionDecision(tool, toolCallId, kind) {
	const descriptor = getAgentToolActionDescriptor(tool);
	const identity = getGatewayToolCallerIdentity();
	const token = identity?.executionIdentityToken;
	const authority = identity?.receiptAuthority;
	if (!descriptor || !toolCallId?.trim() || !token || !authority) return false;
	const [outcome, coverageState, reasonCode] = genericDecisions[kind];
	const receiptId = `tool-action:${createHash("sha256").update(JSON.stringify([
		token.contextId,
		token.executionId,
		toolCallId,
		descriptor,
		reasonCode
	])).digest("base64url").slice(0, 32)}`;
	try {
		const occurredAt = Date.now();
		if (authority() === false) return false;
		return recordExecutionDecisionWork({
			workVersion: 1,
			token,
			receipt: {
				schemaVersion: 1,
				receiptId,
				occurredAt,
				action: descriptor,
				decision: {
					outcome,
					reasonCode
				},
				enforcement: {
					coverageState,
					policyRefs: kind === "denied" ? ["tool-action-policy"] : [],
					grantRefs: [],
					contextFieldsUsed: [
						"contextId",
						"executionId",
						"runId"
					]
				},
				source: {
					owner: "tool-action",
					recordRef: receiptId,
					decisionBoundary: "agent-tool.before-execute"
				},
				missingEvidence: [],
				remediation: []
			}
		});
	} catch {
		return false;
	}
}
//#endregion
export { assertRequiredParams as a, stripMalformedXmlArgValueSuffixFromKeys as c, REQUIRED_PARAM_GROUPS as i, wrapToolParamValidation as l, recordGenericToolActionDecision as n, normalizeFileToolPathParam as o, runWithGenericToolActionDecision as r, normalizeFileToolPathParamsFromKeys as s, markToolDecisionRecorded as t };
