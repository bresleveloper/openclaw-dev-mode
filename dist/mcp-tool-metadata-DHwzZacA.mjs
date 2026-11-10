import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import "./errors-DPfGDWk1.mjs";
import { a as normalizeJsonSchemaForTypeBox } from "./json-schema-BLReYZIW.mjs";
import { n as findJsonSchemaShapeError } from "./json-schema-defaults-BwwzX4JH.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { Compile } from "typebox/compile";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
//#region src/agents/mcp-metadata.ts
const MCP_METADATA_TEXT_LIMIT = 1200;
const MCP_APPS_CLIENT_EXTENSION = "io.modelcontextprotocol/ui";
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? {
		elicitation: {
			form: {},
			url: {}
		},
		extensions: {
			"openai/elicitation": { form: {} },
			[MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] }
		}
	} : {};
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
/** Scrubs untrusted MCP metadata before exposing it to a model. */
function sanitizeMcpMetadataText(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const scrubbed = normalized.replace(/(?:ignore|disregard)\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/system\s+prompt/gi, "system prompt");
	return scrubbed.length > MCP_METADATA_TEXT_LIMIT ? `${truncateUtf16Safe(scrubbed, MCP_METADATA_TEXT_LIMIT)}...` : scrubbed;
}
//#endregion
//#region src/agents/mcp-pagination.ts
/** Shared bounded pagination for MCP list operations. */
function positiveInteger(value, label) {
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${label} must be a positive safe integer`);
	return value;
}
function abortError(signal, label) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error(`${label} aborted`);
}
/** Collects one complete MCP list under a single bounded lifecycle. */
async function collectMcpPaginatedItems(params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs);
	if (timeoutMs === void 0) throw new Error(`${params.label} requires a positive timeout`);
	const maxPages = positiveInteger(params.maxPages, `${params.label} maxPages`);
	const maxItems = positiveInteger(params.maxItems, `${params.label} maxItems`);
	const maxBytes = positiveInteger(params.maxBytes, `${params.label} maxBytes`);
	const deadlineController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, deadlineController.signal]) : deadlineController.signal;
	if (signal.aborted) throw abortError(signal, params.label);
	const deadlineAtMs = performance.now() + timeoutMs;
	const timeoutError = /* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`);
	const deadlineTimer = setTimeout(() => deadlineController.abort(timeoutError), timeoutMs);
	deadlineTimer.unref?.();
	const assertActive = () => {
		if (signal.aborted) throw abortError(signal, params.label);
		if (performance.now() >= deadlineAtMs) {
			deadlineController.abort(timeoutError);
			throw timeoutError;
		}
	};
	const items = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let collectedBytes = 0;
	let cursor;
	try {
		for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
			assertActive();
			const page = await racePromiseWithAbortSignal(params.loadPage({
				cursor,
				requestTimeoutMs: timeoutMs,
				signal
			}), signal, () => abortError(signal, params.label));
			assertActive();
			const measured = boundedJsonUtf8Bytes(page.serializedValue ?? {
				items: page.items,
				nextCursor: page.nextCursor
			}, maxBytes - collectedBytes);
			if (!measured.complete || collectedBytes + measured.bytes > maxBytes) throw new Error(`${params.label} exceeded ${maxBytes} bytes`);
			collectedBytes += measured.bytes;
			for (const item of page.items) {
				if (item === void 0) continue;
				if (items.length >= maxItems) throw new Error(`${params.label} exceeded ${maxItems} ${params.itemLabel}`);
				items.push(item);
			}
			const nextCursor = page.nextCursor;
			assertActive();
			if (nextCursor === void 0) return items;
			if (seenCursors.has(nextCursor)) throw new Error(`${params.label} returned a repeated pagination cursor`);
			seenCursors.add(nextCursor);
			cursor = nextCursor;
		}
		throw new Error(`${params.label} exceeded ${maxPages} pages`);
	} finally {
		clearTimeout(deadlineTimer);
	}
}
//#endregion
//#region src/agents/mcp-json-schema-validator.ts
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
function isDraft202012Schema(schema) {
	return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join(", ") || "schema validation failed";
}
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
function createMcpJsonSchemaValidator() {
	const defaultValidator = new AjvJsonSchemaValidator();
	return { getValidator(schema) {
		if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
		let validator;
		try {
			const schemaError = findJsonSchemaShapeError(schema);
			if (schemaError) throw new Error(schemaError);
			validator = Compile(normalizeJsonSchemaForTypeBox(schema, { format: "annotation" }));
		} catch (error) {
			const setupError = toErrorObject(error, "schema setup failed");
			throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${setupError.message}`, { cause: error });
		}
		return (input) => {
			if (validator.Check(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			return {
				valid: false,
				data: void 0,
				errorMessage: formatTypeBoxErrors([...validator.Errors(input)])
			};
		};
	} };
}
//#endregion
//#region src/agents/mcp-tool-metadata.ts
/** Canonicalizes one server catalog before policy, publication, and call metadata diverge. */
function normalizeMcpToolCatalog(tools, schemaValidator, classify = () => "include") {
	const canonicalNames = tools.map((tool) => tool.name.trim());
	const nameCounts = /* @__PURE__ */ new Map();
	for (const toolName of canonicalNames) if (toolName) nameCounts.set(toolName, (nameCounts.get(toolName) ?? 0) + 1);
	const included = [];
	const deniedTools = [];
	const excludedTools = [];
	const resultValidators = /* @__PURE__ */ new Map();
	for (const [index, sourceTool] of tools.entries()) {
		const toolName = canonicalNames[index] ?? "";
		if (!toolName) continue;
		const tool = {
			...sourceTool,
			name: toolName
		};
		if (nameCounts.get(toolName) !== 1 || sourceTool.execution?.taskSupport === "required") {
			excludedTools.push(tool);
			continue;
		}
		const disposition = classify(toolName);
		if (disposition === "exclude") {
			excludedTools.push(tool);
			continue;
		}
		if (disposition === "include") {
			included.push(tool);
			if (tool.outputSchema) {
				const validator = schemaValidator.getValidator(tool.outputSchema);
				resultValidators.set(toolName, (result) => {
					if (result.structuredContent === void 0 && result.isError !== true) throw new McpError(ErrorCode.InvalidRequest, `Tool ${toolName} has an output schema but did not return structured content`);
					if (result.structuredContent === void 0) return;
					const validation = validator(result.structuredContent);
					if (!validation.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validation.errorMessage}`);
				});
			}
		} else deniedTools.push(tool);
	}
	return {
		tools: included,
		excludedTools,
		metadata: { validatorForCall(toolName) {
			return resultValidators.get(toolName);
		} },
		deniedTools
	};
}
//#endregion
export { normalizeToolUiVisibility as a, buildMcpClientCapabilities as i, createMcpJsonSchemaValidator as n, sanitizeMcpMetadataText as o, collectMcpPaginatedItems as r, summarizeServerCapabilities as s, normalizeMcpToolCatalog as t };
