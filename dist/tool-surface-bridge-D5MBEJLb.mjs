import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as clampNumber } from "./utils-aKqR_F_U.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as sanitizeNodeIdFragment } from "./agent-bundle-mcp-names-38ksiKnf.mjs";
import { l as normalizeToolPolicyName, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { d as captureAgentPluginRuntimeRefresh } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { t as CODE_MODE_WORKER_WATCHDOG_GRACE_MS } from "./code-mode-worker-types-BrXHJGAa.mjs";
import { n as EMPTY_CODE_MODE_OUTPUT, s as toCodeModeJsonSafe, t as CodeModeOutputState } from "./code-mode-json-Cek5lI0P.mjs";
import { a as resolveToolResultBudget } from "./tool-result-limits-B-fhY8wF.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { i as createCodeModeExecDescriptionUpdater, l as markCodeModeControlTool, n as CODE_MODE_WAIT_TOOL_NAME, s as isCodeModeControlTool, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-fvyqQnLi.mjs";
import { t as asToolParamsRecord } from "./common-XfKigJno.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { y as finalizeAgentToolAvailability } from "./agent-tool-metadata-COcr-3AD.mjs";
import { r as executionTitleSchema } from "./typebox-DIBvVmm8.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { t as getActiveAgentRingZeroTools } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { T as TOOL_SEARCH_CONTROL_TOOL_NAMES, _ as compactToolSearchCatalogEntry, a as applyToolSearchCatalog, c as buildToolSchemaDirectoryPrompt, d as ToolSearchRuntime, f as formatToolSearchControlResult, h as clearToolSearchCatalog, m as applyToolCatalogCompaction, n as isLocalModelLeanEnabled, p as addClientToolsToToolCatalog, r as resolveLocalModelLeanPreserveToolNames, s as applyToolSchemaDirectoryCatalog, t as filterLocalModelLeanTools, u as resolveToolSearchConfig, v as createToolSearchCatalogRef, x as restrictToolSearchCatalog, y as isDirectVisibleCatalogTool } from "./local-model-lean-ComDsNwW.mjs";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { S as createCodeModeCatalogProjection, _ as waitForPendingBridgeSettlement, a as createCodeModeBridgeDispatchState, b as isCodeModeSwarmAvailable, d as removeExpiredRuns, f as reserveActiveRunSlot, g as telemetry, h as takeSettledBridgeRequests, i as codeModeAbortedResult, l as pendingBridgeRequestsReplaySafe, m as storeSuspendedRun, n as cancelPendingBridgeStates, o as createCodeModeRunOwner, p as resumingRunIds, r as cancelPendingBridgeStatesById, s as createPendingBridgeStates, t as activeRuns, u as pendingBridgeStatesForSettlement, x as createCodeModeCatalogBindings, y as codeModeReplayIdForToolCall } from "./code-mode-state-B2O_TqwQ.mjs";
import { t as getAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-XpBChpaV.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { t as resolveAgentRuntimeToolConfig } from "./tool-runtime-config-CbMISfeO.mjs";
import { a as normalizeCodeModeTimeoutResult, i as codeModeFailureMessage, n as CodeModeHeadlessTimeoutError, r as codeModeFailureCode, t as CodeModeHeadlessAbortError } from "./code-mode-errors-C6Ok9ljJ.mjs";
import { randomUUID } from "node:crypto";
import { tokTypes } from "acorn";
import { Type } from "typebox";
//#region src/agents/harness/prompt-tool-policy.ts
function isAgentTool(tool) {
	return "execute" in tool && typeof tool.execute === "function";
}
function filterTools(tools, toolsAllow, toolMeta = (tool) => isAgentTool(tool) ? getPluginToolMeta(tool) : void 0) {
	return toolsAllow === void 0 ? [...tools] : applyEmbeddedAttemptToolsAllow([...tools], toolsAllow, { toolMeta });
}
function createAgentHarnessPromptToolPolicy(params) {
	const baselineTools = [...params.tools];
	const currentCatalog = params.catalogRef?.current;
	const catalog = currentCatalog && params.catalogRef ? {
		ref: params.catalogRef,
		entries: [...params.catalogEntries ?? currentCatalog.entries],
		controlNames: params.codeModeControlsEnabled ? /* @__PURE__ */ new Set([CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME]) : TOOL_SEARCH_CONTROL_TOOL_NAMES
	} : void 0;
	return { apply: (input = {}) => {
		const toolsAllow = mergeForcedEmbeddedAttemptToolsAllow(input.toolsAllow, { forceToolNames: input.forceToolNames });
		const allowedTools = filterTools(baselineTools, toolsAllow);
		if (!catalog) {
			const executableTools = [];
			for (const tool of allowedTools) if (isAgentTool(tool)) executableTools.push(tool);
			finalizeAgentToolAvailability(executableTools);
			return {
				tools: allowedTools,
				toolSchemaDirectoryPrompt: void 0,
				callableToolNames: normalizeUniqueStringEntries(allowedTools.map((tool) => tool.name))
			};
		}
		const allowedEntries = filterTools(catalog.entries, toolsAllow, (entry) => isAgentTool(entry.tool) ? getPluginToolMeta(entry.tool) : void 0);
		const catalogCount = restrictToolSearchCatalog({
			catalogRef: catalog.ref,
			allowedToolNames: new Set(allowedEntries.map((entry) => entry.name)),
			baselineEntries: catalog.entries
		});
		const allowedNames = new Set(allowedTools.map((tool) => normalizeToolPolicyName(tool.name)));
		const tools = baselineTools.filter((tool) => {
			const name = normalizeToolPolicyName(tool.name);
			return allowedNames.has(name) || catalogCount > 0 && catalog.controlNames.has(name);
		});
		const catalogReachable = catalogCount > 0 && tools.some((tool) => catalog.controlNames.has(normalizeToolPolicyName(tool.name)));
		return {
			tools,
			toolSchemaDirectoryPrompt: catalogReachable && params.toolSearchPrompt ? buildToolSchemaDirectoryPrompt({
				config: params.toolSearchPrompt.config,
				catalogRef: catalog.ref
			}, { contextTokenBudget: params.toolSearchPrompt.contextTokenBudget }) : void 0,
			callableToolNames: normalizeUniqueStringEntries([...tools.map((tool) => tool.name), ...catalogReachable ? allowedEntries.map((entry) => entry.name) : []])
		};
	} };
}
//#endregion
//#region src/agents/code-mode-executor.ts
async function runCodeModeExecutor(input, options) {
	const startedAt = performance.now();
	const executionOptions = {
		timeoutMs: options.timeoutMs,
		signal: options.signal,
		inlineHost: options.inlineHost
	};
	try {
		options.signal?.throwIfAborted();
		if (input.kind === "resume") {
			const { continuation, ...resumeInput } = input;
			return normalizeCodeModeTimeoutResult(await continuation.resume(resumeInput, executionOptions));
		}
		const executor = options.executor === "node" ? (await import("./code-mode-node-9B9Olkrh.mjs")).nodeCodeModeExecutor : (await import("./code-mode-executor-BrAfoEv3.mjs")).resolvePluginCodeModeExecutor(options.executor, options.runtimeConfig);
		options.signal?.throwIfAborted();
		const preparationMs = performance.now() - startedAt;
		const timeoutMs = input.config.timeoutMs - preparationMs;
		if (timeoutMs <= 0 || executionOptions.timeoutMs <= preparationMs) throw new CodeModeHeadlessTimeoutError();
		return normalizeCodeModeTimeoutResult(await executor.execute({
			...input,
			config: {
				...input.config,
				timeoutMs
			}
		}, {
			...executionOptions,
			timeoutMs: executionOptions.timeoutMs - preparationMs
		}));
	} catch (error) {
		if (input.kind === "resume") await input.continuation.dispose();
		const reason = options.signal?.aborted ? options.signal.reason : error;
		const timeout = reason instanceof CodeModeHeadlessTimeoutError;
		const aborted = options.signal?.aborted || reason instanceof CodeModeHeadlessAbortError;
		return {
			status: "failed",
			code: timeout ? "timeout" : aborted ? "aborted" : "runtime_unavailable",
			error: timeout ? "code mode timeout exceeded" : aborted ? "code mode execution aborted" : formatErrorMessage(error),
			failurePhase: "host",
			bridgeDispatchStarted: false,
			output: EMPTY_CODE_MODE_OUTPUT
		};
	}
}
//#endregion
//#region src/agents/code-mode-mcp-api.ts
function readMcpSchemaProperties(schema) {
	const properties = isRecord(schema) ? schema.properties : void 0;
	return isRecord(properties) ? properties : {};
}
function readMcpRequiredKeys(schema) {
	const required = isRecord(schema) ? schema.required : void 0;
	return Array.isArray(required) ? required.filter((entry) => typeof entry === "string") : [];
}
function escapeDocComment(value) {
	return value.replace(/\*\//gu, "* /").trim();
}
function normalizeDocLines(value) {
	return value ? value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).slice(0, 12) : [];
}
function renderDocComment(summary, params) {
	const docLines = normalizeDocLines(summary);
	if (docLines.length === 0 && params.length === 0) return [];
	const lines = ["/**", ...docLines.map((line) => ` * ${escapeDocComment(line)}`)];
	if (docLines.length > 0 && params.length > 0) lines.push(" *");
	for (const param of params) {
		const suffix = param.defaultValue === void 0 ? "" : ` Default: ${JSON.stringify(param.defaultValue)}.`;
		const description = `${normalizeDocLines(param.description).join(" ")}${suffix}`.trim();
		if (description) lines.push(` * ${escapeDocComment(`@param ${param.name}${param.required ? "" : "?"} ${description}`)}`);
	}
	lines.push(" */");
	return lines;
}
function tsPropertyName(name) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name) ? name : JSON.stringify(name);
}
function renderInlineObjectType(schema, params, depth = 0) {
	const additional = isRecord(schema) ? schema.additionalProperties : void 0;
	const patterns = isRecord(schema) ? schema.patternProperties : void 0;
	const extraType = isRecord(patterns) && Object.keys(patterns).length > 0 ? "unknown" : additional === false ? "never" : schemaType(additional, depth + 1);
	if (params.length === 0) return `Record<string, ${extraType}>`;
	const fields = params.map((param) => `${tsPropertyName(param.name)}${param.required ? "" : "?"}: ${param.type};`);
	if (extraType !== "never") {
		const types = /* @__PURE__ */ new Set([extraType, ...params.map((param) => param.type)]);
		if (params.some((param) => !param.required)) types.add("undefined");
		fields.push(`[key: string]: ${types.has("unknown") || types.size > 8 ? "unknown" : [...types].join(" | ")};`);
	}
	return `{ ${fields.join(" ")} }`;
}
function schemaType(schema, depth = 0) {
	if (!isRecord(schema) || depth >= 8) return "unknown";
	const enumValues = Array.isArray(schema.enum) ? schema.enum : void 0;
	const types = new Set(Array.isArray(schema.type) ? schema.type : [schema.type]);
	const allowsNull = (types.has(void 0) || types.has("null") || schema.nullable === true) && (!enumValues || enumValues.includes(null));
	if (allowsNull && schema.nullable === true) types.add("null");
	if (!allowsNull) types.delete("null");
	if (enumValues && enumValues.length > 0 && enumValues.length <= 16) {
		const compatible = enumValues.filter((entry) => {
			const type = entry === null ? "null" : Array.isArray(entry) ? "array" : typeof entry;
			return types.has(void 0) || types.has(type) || type === "number" && types.has("integer") && Number.isInteger(entry);
		});
		if (compatible.every((entry) => entry === null || typeof entry === "string" || typeof entry === "boolean" || typeof entry === "number" && Number.isFinite(entry))) return compatible.map((entry) => JSON.stringify(entry)).join(" | ") || "never";
	}
	const union = Array.isArray(schema.oneOf) ? schema.oneOf : Array.isArray(schema.anyOf) ? schema.anyOf : void 0;
	if (union && union.length > 0 && union.length <= 8) return union.map((variant) => schemaType(variant, depth + 1)).join(" | ");
	return [...types].map((type) => {
		switch (type) {
			case "integer":
			case "number": return "number";
			case "array": return `Array<${schemaType(schema.items, depth + 1)}>`;
			case "string":
			case "boolean":
			case "null": return type;
			case "object": return renderInlineObjectType(schema, buildMcpParamDocs(schema, depth), depth);
			default: return "unknown";
		}
	}).join(" | ") || "never";
}
function buildMcpParamDocs(schema, depth = 0) {
	const properties = readMcpSchemaProperties(schema);
	const requiredKeys = readMcpRequiredKeys(schema);
	const required = new Set(requiredKeys);
	return [.../* @__PURE__ */ new Set([...requiredKeys, ...Object.keys(properties)])].map((key) => {
		const descriptor = properties[key];
		const doc = {
			name: key,
			required: required.has(key),
			type: schemaType(descriptor, depth + 1)
		};
		if (isRecord(descriptor)) {
			const description = typeof descriptor.description === "string" ? descriptor.description.trim() : "";
			if (description) doc.description = description;
			if (Object.hasOwn(descriptor, "default")) doc.defaultValue = descriptor.default;
		}
		return doc;
	});
}
function renderMcpToolSignature(tool, functionName = tool.path.at(-1) ?? tool.method) {
	const resultType = {
		tool: "McpToolResult",
		resources_list: "McpResourcesListResult",
		resources_read: "McpResourcesReadResult",
		prompts_list: "McpPromptsListResult",
		prompts_get: "McpPromptsGetResult"
	}[tool.operation];
	const inputParams = tool.params.map((param) => ({
		...param,
		required: param.required && param.defaultValue === void 0
	}));
	const optional = inputParams.some((param) => param.required) ? "" : "?";
	return [
		...renderDocComment(tool.description, inputParams),
		`function ${functionName}(`,
		`  input${optional}: ${renderInlineObjectType(tool.parameters, inputParams)}`,
		`): Promise<${resultType}>;`
	];
}
function renderMcpServerHeader(server, tools) {
	const lines = [
		"interface McpApiHeader { header: string; tools?: unknown[]; schemas?: Record<string, unknown> }",
		"",
		"interface McpToolResult {",
		"  content: unknown[];",
		"  structuredContent?: unknown;",
		"  isError?: boolean;",
		"}",
		"interface McpResourcesListResult { resources: unknown[]; nextCursor?: string }",
		"interface McpResourcesReadResult { contents: unknown[] }",
		"interface McpPromptsListResult { prompts: unknown[]; nextCursor?: string }",
		"interface McpPromptsGetResult { messages: unknown[]; description?: string }",
		"",
		`declare namespace MCP.${server.identifier} {`,
		"  /** Return this TypeScript-style API header. */",
		"  function $api(toolName?: string, options?: { schema?: boolean }): Promise<McpApiHeader>;"
	];
	const nestedGroups = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		if (tool.path.length === 1) {
			lines.push("", ...renderMcpToolSignature(tool).map((line) => `  ${line}`));
			continue;
		}
		const groupName = tool.path[0] ?? "tools";
		const group = nestedGroups.get(groupName);
		if (group) group.push(tool);
		else nestedGroups.set(groupName, [tool]);
	}
	for (const [groupName, groupTools] of [...nestedGroups].toSorted((a, b) => a[0].localeCompare(b[0]))) {
		lines.push("", `  namespace ${groupName} {`);
		for (const tool of groupTools) lines.push("", ...renderMcpToolSignature(tool).map((line) => `    ${line}`));
		lines.push("  }");
	}
	lines.push("}");
	return lines.join("\n");
}
function renderMcpRootHeader() {
	return [
		"interface McpRootApiHeader { header: string; servers?: unknown[] }",
		"",
		"declare namespace MCP {",
		"  /** List visible MCP servers and request server-specific headers. */",
		"  function $api(): Promise<McpRootApiHeader>;",
		"}"
	].join("\n");
}
function buildMcpApiResponse(params) {
	const [selector, options] = params.args;
	if (!params.server) return {
		kind: "mcp_api",
		scope: "root",
		header: renderMcpRootHeader(),
		servers: params.servers.map((server) => ({
			identifier: server.identifier,
			serverName: server.serverName,
			toolCount: server.tools.length
		})),
		note: "Call MCP.<server>.$api() for a TypeScript-style header, then call tools with one object argument matching the shown input type."
	};
	const selectedName = typeof selector === "string" ? selector.trim() : "";
	const exactMethod = params.server.tools.find((tool) => tool.method === selectedName);
	const selected = selectedName ? exactMethod ? [exactMethod] : params.server.tools.filter((tool) => tool.mcpTool === selectedName) : params.server.tools;
	return {
		kind: "mcp_api",
		scope: selected.length === 1 ? "tool" : "server",
		server: {
			identifier: params.server.identifier,
			serverName: params.server.serverName
		},
		header: renderMcpServerHeader(params.server, selected),
		tools: selected.map((tool) => ({
			method: tool.method,
			path: tool.path,
			mcpTool: tool.mcpTool,
			operation: tool.operation,
			description: tool.description
		})),
		...isRecord(options) && options.schema === true ? { schemas: Object.fromEntries(selected.map((tool) => [tool.method, tool.parameters])) } : {},
		note: "Call MCP tools with one object argument, for example MCP.server.tool({ requiredField: value })."
	};
}
function createMcpApiVirtualFiles(servers) {
	if (servers.length === 0) return [];
	const indexServer = servers.find((server) => server.identifier === "index");
	const separateServers = servers.filter((server) => server.identifier !== "index");
	const rootContent = [
		...separateServers.map((server) => `/// <reference path="./${server.identifier}.d.ts" />`),
		"",
		renderMcpRootHeader(),
		...indexServer ? ["", renderMcpServerHeader(indexServer, indexServer.tools)] : []
	].join("\n");
	return [{
		path: "mcp/index.d.ts",
		description: "Root MCP namespace declaration and server list.",
		content: rootContent,
		bytes: Buffer.byteLength(rootContent, "utf8")
	}, ...separateServers.map((server) => {
		const content = renderMcpServerHeader(server, server.tools);
		return {
			path: `mcp/${server.identifier}.d.ts`,
			description: `MCP server declaration for ${server.serverName}.`,
			content,
			bytes: Buffer.byteLength(content, "utf8")
		};
	})];
}
//#endregion
//#region src/agents/code-mode-namespaces.ts
/**
* Registry and runtime projection for code-mode namespaces. Plugins register
* namespaced tool scopes here; code mode receives descriptors, virtual API
* files, and a guarded invocation runtime.
*/
const FORBIDDEN_NAMESPACE_PATH_SEGMENTS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const NAMESPACE_PATH_KEY_SEPARATOR = "\0";
const CODE_MODE_NAMESPACE_TOOL_CALL = Symbol.for("openclaw.codeMode.namespaceToolCall");
const RESERVED_NAMESPACE_GLOBALS = /* @__PURE__ */ new Set([
	"ALL_TOOLS",
	"agents",
	"API",
	"Array",
	"Boolean",
	"catalog",
	"clearTimeout",
	"Date",
	"Error",
	"globalThis",
	"log",
	"json",
	"JSON",
	"Map",
	"Math",
	"MCP",
	"namespaces",
	"nodes",
	"Number",
	"Object",
	"Promise",
	"phase",
	"Set",
	"setTimeout",
	"skills",
	"String",
	"text",
	"tools",
	"yield_control"
]);
const RESERVED_NAMESPACE_FUNCTION_IDENTIFIERS = /* @__PURE__ */ new Set([...Object.values(tokTypes).flatMap((token) => token.keyword ? [token.keyword] : []), "enum"]);
function createCodeModeNamespaceCatalogTool(catalogId, toolName, input) {
	const normalizedCatalogId = catalogId.trim();
	const normalizedToolName = toolName.trim();
	if (!normalizedCatalogId) throw new Error("Code mode namespace catalogId must be non-empty.");
	if (!normalizedToolName) throw new Error("Code mode namespace toolName must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		catalogId: normalizedCatalogId,
		toolName: normalizedToolName,
		...input ? { input } : {}
	};
}
function createCodeModeNamespaceApi(input) {
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		toolName: "$api",
		local: true,
		input
	};
}
function isCodeModeNamespaceToolCall(value) {
	const record = isRecord(value) ? value : void 0;
	return record?.[CODE_MODE_NAMESPACE_TOOL_CALL] === true && typeof record.toolName === "string" && record.toolName.trim().length > 0;
}
function toIdentifier(value, fallback) {
	const words = value.trim().split(/[^A-Za-z0-9]+/u).map((word) => word.trim()).filter(Boolean);
	const safe = (words.length === 0 ? fallback : words.map((word, index) => index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)).join("")).replace(/^[^A-Za-z_$]+/u, "").replace(/[^A-Za-z0-9_$]/gu, "");
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(safe) ? safe : fallback;
}
function uniqueIdentifier(base, used) {
	let candidate = base;
	let index = 2;
	while (used.has(candidate) || RESERVED_NAMESPACE_GLOBALS.has(candidate) || RESERVED_NAMESPACE_FUNCTION_IDENTIFIERS.has(candidate) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(candidate)) {
		candidate = `${base}${index}`;
		index += 1;
	}
	used.add(candidate);
	return candidate;
}
function mapMcpNamespaceInput(schema, args) {
	if (args.length > 1) throw new Error("MCP namespace tools accept one object argument.");
	const firstArg = args[0];
	const input = firstArg === void 0 ? {} : isRecord(firstArg) ? { ...firstArg } : {};
	if (firstArg !== void 0 && !isRecord(firstArg)) throw new Error("MCP namespace tools accept one object argument.");
	for (const [key, descriptor] of Object.entries(readMcpSchemaProperties(schema))) {
		if (!isRecord(descriptor) || !Object.hasOwn(descriptor, "default") || Object.hasOwn(input, key) && input[key] !== void 0) continue;
		Object.defineProperty(input, key, {
			value: descriptor.default,
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	const missing = readMcpRequiredKeys(schema).filter((key) => !Object.hasOwn(input, key) || input[key] === void 0);
	if (missing.length > 0) throw new Error(`Missing required MCP namespace argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
	return input;
}
function scopeAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		const next = current[segment];
		if (!isRecord(next)) {
			const object = Object.create(null);
			current[segment] = object;
			current = object;
			continue;
		}
		current = next;
	}
	return current;
}
function toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier) {
	const existing = usedToolIdentifiers.get(serverIdentifier);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Set([
		"$api",
		"resources",
		"prompts"
	]);
	usedToolIdentifiers.set(serverIdentifier, created);
	return created;
}
function mcpNamespaceServerKey(mcp) {
	return mcp.node ? JSON.stringify([
		"node",
		mcp.node.id,
		mcp.serverName
	]) : JSON.stringify(["gateway", mcp.safeServerName]);
}
function assignMcpNamespaceServerNames(servers) {
	const baseCounts = /* @__PURE__ */ new Map();
	const used = /* @__PURE__ */ new Set();
	const assignments = /* @__PURE__ */ new Map();
	for (const server of servers) {
		const normalized = server.safeServerName.toLowerCase();
		baseCounts.set(normalized, (baseCounts.get(normalized) ?? 0) + 1);
		if (!server.node) {
			assignments.set(server.key, server.safeServerName);
			used.add(normalized);
		}
	}
	for (const server of servers) {
		if (!server.node || (baseCounts.get(server.safeServerName.toLowerCase()) ?? 0) > 1) continue;
		assignments.set(server.key, server.safeServerName);
		used.add(server.safeServerName.toLowerCase());
	}
	for (const server of servers) {
		if (!server.node || assignments.has(server.key)) continue;
		const base = `${sanitizeNodeIdFragment(server.node.id)}_${server.safeServerName}`;
		let candidate = base;
		let index = 2;
		while (used.has(candidate.toLowerCase())) {
			candidate = `${base}_${index}`;
			index += 1;
		}
		assignments.set(server.key, candidate);
		used.add(candidate.toLowerCase());
	}
	return assignments;
}
function mcpNodeLabel(node) {
	return truncateUtf16Safe((node.displayName?.trim() || node.id).replace(/\s+/gu, " "), 128);
}
function createMcpNamespacePlan(catalog) {
	const mcpEntries = catalog.filter((entry) => entry.source === "mcp" && entry.id && entry.mcp).toSorted((a, b) => (a.id ?? "").localeCompare(b.id ?? ""));
	if (mcpEntries.length === 0) return;
	const serversByKey = /* @__PURE__ */ new Map();
	for (const entry of mcpEntries) {
		const mcp = entry.mcp;
		if (!mcp) continue;
		const key = mcpNamespaceServerKey(mcp);
		if (!serversByKey.has(key)) serversByKey.set(key, {
			key,
			serverName: mcp.serverName,
			safeServerName: mcp.safeServerName,
			...mcp.node ? { node: mcp.node } : {}
		});
	}
	const servers = [...serversByKey.values()].toSorted((a, b) => a.key.localeCompare(b.key));
	const assignedServerNames = assignMcpNamespaceServerNames(servers);
	const namedServers = /* @__PURE__ */ new Map();
	const usedServerIdentifiers = /* @__PURE__ */ new Set();
	for (const server of servers) {
		const safeServerName = assignedServerNames.get(server.key) ?? server.safeServerName;
		namedServers.set(server.key, {
			...server,
			identifier: uniqueIdentifier(toIdentifier(safeServerName, "server"), usedServerIdentifiers)
		});
	}
	return {
		entries: mcpEntries,
		servers: namedServers,
		usedServerIdentifiers
	};
}
function createMcpNamespaceModel(catalog) {
	const plan = createMcpNamespacePlan(catalog);
	if (!plan) return;
	const usedToolIdentifiers = /* @__PURE__ */ new Map();
	const root = Object.create(null);
	const serverDocs = /* @__PURE__ */ new Map();
	const bindings = /* @__PURE__ */ new Map();
	for (const entry of plan.entries) {
		const mcp = entry.mcp;
		if (!mcp || !entry.id) continue;
		const serverKey = mcpNamespaceServerKey(mcp);
		const serverIdentifier = plan.servers.get(serverKey)?.identifier ?? uniqueIdentifier("server", plan.usedServerIdentifiers);
		const serverScope = scopeAtPath(root, [serverIdentifier]);
		serverScope.$serverName = mcp.serverName;
		let serverDoc = serverDocs.get(serverIdentifier);
		if (!serverDoc) {
			serverDoc = {
				identifier: serverIdentifier,
				serverName: mcp.serverName,
				...mcp.node ? { nodeLabel: mcpNodeLabel(mcp.node) } : {},
				tools: []
			};
			serverDocs.set(serverIdentifier, serverDoc);
		}
		const path = mcp.operation === "resources_list" ? ["resources", "list"] : mcp.operation === "resources_read" ? ["resources", "read"] : mcp.operation === "prompts_list" ? ["prompts", "list"] : mcp.operation === "prompts_get" ? ["prompts", "get"] : [uniqueIdentifier(toIdentifier(mcp.toolName, "tool"), toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier))];
		bindings.set(entry.id, {
			callableName: [
				"MCP",
				serverIdentifier,
				...path
			].join("."),
			namespaceId: "mcp",
			path: [serverIdentifier, ...path],
			apiPath: `mcp/${serverIdentifier}.d.ts`
		});
		const parent = scopeAtPath(serverScope, path.slice(0, -1));
		parent[path.at(-1) ?? "tool"] = createCodeModeNamespaceCatalogTool(entry.id, entry.name, (args) => mapMcpNamespaceInput(entry.parameters, args));
		serverDoc.tools.push({
			method: path.join("."),
			path,
			mcpTool: mcp.toolName,
			operation: mcp.operation,
			description: entry.description,
			parameters: entry.parameters,
			params: buildMcpParamDocs(entry.parameters)
		});
	}
	const docs = Array.from(serverDocs.values(), (server) => {
		server.tools = server.tools.toSorted((a, b) => a.method.localeCompare(b.method));
		return server;
	}).toSorted((a, b) => a.identifier.localeCompare(b.identifier));
	root.$api = createCodeModeNamespaceApi((args) => buildMcpApiResponse({
		servers: docs,
		args
	}));
	for (const server of docs) {
		const serverScope = scopeAtPath(root, [server.identifier]);
		serverScope.$api = createCodeModeNamespaceApi((args) => buildMcpApiResponse({
			servers: docs,
			server,
			args
		}));
	}
	return {
		root,
		docs,
		bindings
	};
}
const SWARM_AGENTS_API_CONTENT = `type AgentJsonSchema = Record<string, unknown>;

interface AgentRunOptions {
  label?: string;
  model?: string;
  thinking?: string;
  fastMode?: boolean | "auto";
  agentId?: string;
  schema?: AgentJsonSchema;
  phase?: string;
}

interface AgentsApi {
  /** Reserve agents.run fan-out for batches; a single child uses sessions_spawn directly (announcing run). Child failures have name "SwarmAgentError", runId, status, and message; SwarmAgentError is not a global constructor. */
  run(prompt: string, options?: AgentRunOptions & { schema?: undefined }): Promise<string>;
  run<T>(prompt: string, options: AgentRunOptions & { schema: AgentJsonSchema }): Promise<T>;
}

/** Spawn collector agents concurrently; requests queue when bridge slots are full. */
declare const agents: Readonly<AgentsApi>;
/** Publish a phase heading for this swarm. */
declare function phase(title: string): void;
/** Publish a progress note for this swarm. */
declare function log(message: string): void;

// Fan-out: const settled = await Promise.allSettled(prompts.map((prompt) => agents.run(prompt)));
// Drain every accepted child before synthesis: fulfilled entries hold values, rejected entries hold reasons.
// Keep successful results and report failed lanes. Do not respawn completed work after a partial failure.
// Gate: for (let pass = 0; !ready && pass < 4; pass++) ready = await agents.run("Check readiness") === "ready";
// Cycle: for (let pass = 0; pass < 3; pass++) draft = await agents.run("Improve: " + draft);
// Schema: const fact = await agents.run<{ answer: string }>("Research", { schema: { type: "object", properties: { answer: { type: "string" } }, required: ["answer"] } });
`;
function createMcpNamespaceEntry(model) {
	const { root: scope } = model;
	const callablePaths = /* @__PURE__ */ new Set();
	return {
		pluginId: "bundle-mcp",
		callablePaths,
		scope,
		descriptor: {
			id: "mcp",
			globalName: "MCP",
			description: "MCP server tools grouped by server.",
			scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
		}
	};
}
function describeMcpNamespaceForPrompt(catalog) {
	const plan = createMcpNamespacePlan(catalog);
	if (!plan) return [];
	const servers = [...plan.servers.values()].toSorted((a, b) => a.identifier.localeCompare(b.identifier)).map((server) => {
		const nodeLabel = server.node ? mcpNodeLabel(server.node) : void 0;
		return `${server.identifier}${nodeLabel ? ` (node: ${nodeLabel})` : ""}`;
	});
	if (servers.length === 0) return [];
	return [
		"- MCP: MCP server tools grouped by server.",
		`Read API files such as mcp/index.d.ts and mcp/<server>.d.ts for TypeScript-style MCP headers; visible servers: ${servers.join(", ")}. Node-backed name collisions use a sanitized node-id fragment prefix.`,
		"Search native and MCP tools by task with catalog.search(query). MCP handles expose callableName, apiPath, and describe() for the exact header and schema. Call the handle or MCP.<server>.<tool>({ ...input }) with one object argument matching the header."
	];
}
/** Builds system-prompt text describing visible code-mode namespace globals. */
function describeCodeModeNamespacesForPrompt(catalog) {
	if (!catalog) return "";
	const mcpPrompt = describeMcpNamespaceForPrompt(catalog);
	if (mcpPrompt.length === 0) return "";
	const lines = ["MCP namespace globals are available in code mode:"];
	lines.push(...mcpPrompt);
	return lines.join("\n");
}
function assertNamespacePathSegment(segment) {
	if (!segment || segment.includes(NAMESPACE_PATH_KEY_SEPARATOR) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(segment)) throw new Error(`Invalid code mode namespace path segment: ${segment || "(empty)"}`);
}
function namespacePathKey(path) {
	return path.join(NAMESPACE_PATH_KEY_SEPARATOR);
}
function serializeNamespaceScopeValue(value, path = [], stack = /* @__PURE__ */ new WeakSet(), callablePaths = /* @__PURE__ */ new Set()) {
	if (isCodeModeNamespaceToolCall(value)) {
		callablePaths.add(namespacePathKey(path));
		return {
			kind: "function",
			path
		};
	}
	if (typeof value === "function") throw new Error(`Code mode namespace function at ${path.join(".") || "(root)"} is not serializable.`);
	if (value === null || typeof value !== "object") return {
		kind: "value",
		value: toCodeModeJsonSafe(value)
	};
	if (stack.has(value)) throw new Error(`Circular code mode namespace scope at ${path.join(".") || "(root)"}.`);
	stack.add(value);
	try {
		if (Array.isArray(value)) return {
			kind: "array",
			items: value.map((item, index) => serializeNamespaceScopeValue(item, [...path, String(index)], stack, callablePaths))
		};
		const entries = [];
		for (const [key, child] of Object.entries(value)) {
			assertNamespacePathSegment(key);
			entries.push([key, serializeNamespaceScopeValue(child, [...path, key], stack, callablePaths)]);
		}
		return {
			kind: "object",
			entries
		};
	} finally {
		stack.delete(value);
	}
}
function resolveNamespacePath(scope, path) {
	let current = scope;
	for (const segment of path) {
		assertNamespacePathSegment(segment);
		if (!isRecord(current) && !Array.isArray(current)) return;
		current = current[segment];
	}
	return current;
}
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
function createCodeModeNamespaceRuntime(catalog = []) {
	const model = createMcpNamespaceModel(catalog);
	const entry = model ? createMcpNamespaceEntry(model) : void 0;
	const registeredId = entry?.descriptor.id;
	return {
		descriptors: entry ? [entry.descriptor] : [],
		mcpBindings: model?.bindings ?? /* @__PURE__ */ new Map(),
		apiFiles: [{
			path: "agents.d.ts",
			description: "Swarm collector globals and orchestration idioms.",
			content: SWARM_AGENTS_API_CONTENT,
			bytes: Buffer.byteLength(SWARM_AGENTS_API_CONTENT, "utf8")
		}, ...createMcpApiVirtualFiles(model?.docs ?? [])],
		async invoke(namespaceId, path, args, executeTool) {
			if (!entry || namespaceId !== registeredId) throw new Error(`Unknown code mode namespace: ${namespaceId}`);
			for (const segment of path) assertNamespacePathSegment(segment);
			if (!entry.callablePaths.has(namespacePathKey(path))) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const target = resolveNamespacePath(entry.scope, path);
			if (!isCodeModeNamespaceToolCall(target)) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const input = target.input ? await target.input(args) : args[0] ?? {};
			if (target.local) return toCodeModeJsonSafe(input);
			if (!target.catalogId) throw new Error(`Code mode namespace path has no catalog tool: ${path.join(".")}`);
			return toCodeModeJsonSafe(await executeTool({
				pluginId: entry.pluginId,
				toolName: target.toolName,
				catalogId: target.catalogId,
				input,
				namespaceId,
				path: [...path]
			}));
		}
	};
}
//#endregion
//#region src/agents/code-mode-results-api.ts
const content = `type CodeModeResultReference = {
  id: string;
  bytes: number;
  /** Array length, object key count, or 1 for a scalar. */
  count: number;
  /** Observed, bounded sample shapes and nested array counts; not a schema. */
  shape: string;
  /** Small values: JSON. Larger values: a sampled view with array paths/counts/items
   * and compact envelope fields. May be a JSON prefix; never substitute it for full data. */
  preview: string;
  previewTruncated: boolean;
};
/** Up to 64 references share min(memoryLimitBytes, maxSnapshotBytes) encoded JSON
 * bytes (10 MiB by default), separately from the cell inbox. Full stores reject
 * saves without evicting entries. References survive cells and wait, but expire
 * on agent-run end/abort, catalog replacement, permission changes, or restart.
 * Saved data is a snapshot, not current external state. Result operations are
 * unavailable in restartSafe cells because references are transient.
 * Oversized final objects/arrays are saved automatically in interactive exec/wait
 * when possible: value is {truncated:true, reference:CodeModeResultReference, guidance:string}.
 * Failed retention stays completed with a truncation marker explaining why it was not retained.
 * No automatic references in headless or restartSafe execution.
 * Array discovery visits at most 128 nodes, 5 levels, and 16 object keys per node;
 * arrays sample first/middle/last, with the 8 largest discovered arrays shown first.
 * Sample values visit 2 levels/6 fields, with bounded text. A descriptor is at most
 * 768 encoded JSON bytes, and display fitting can shorten shape/preview further.
 */
declare const results: {
  /** Save normalized JSON for later cells. Returns the descriptor above: emit it directly;
   * its preview, shape, and count are already prepared. The full JSON stays stored.
   * Example: return await results.save(await tool({}));
   */
  save(value: unknown): Promise<CodeModeResultReference>;
  /** Read a detached JSON copy. Inspect the saved preview before using unknown fields. */
  load(id: string): Promise<unknown>;
  /** Free capacity. Missing or expired references reject. */
  delete(id: string): Promise<boolean>;
};`;
const CODE_MODE_RESULTS_API_FILE = {
	path: "results.d.ts",
	description: "Temporary JSON results shared across cells in the current agent run.",
	bytes: Buffer.byteLength(content, "utf8"),
	content
};
//#endregion
//#region src/agents/code-mode-runtime.ts
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_MEMORY_LIMIT_BYTES = 67108864;
const DEFAULT_MAX_OUTPUT_BYTES = 65536;
const DEFAULT_MAX_SNAPSHOT_BYTES = 10485760;
const DEFAULT_MAX_PENDING_TOOL_CALLS = 16;
const DEFAULT_SNAPSHOT_TTL_SECONDS = 900;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 50;
const DEFAULT_HEADLESS_WALL_CLOCK_MS = 3e4;
const MAX_HEADLESS_WALL_CLOCK_MS = 9e5;
function normalizeCodeModeRawConfig(value) {
	const codeMode = value;
	if (codeMode === true) return { enabled: true };
	if (codeMode === false) return { enabled: false };
	if (codeMode === "auto") return { enabled: "auto" };
	return isRecord(codeMode) ? codeMode : void 0;
}
function readCodeModeRawConfig(config, agentId, model) {
	const globalRaw = normalizeCodeModeRawConfig((isRecord(config?.tools) ? config.tools : void 0)?.codeMode) ?? { enabled: "auto" };
	const agent = config && agentId ? resolveAgentConfig(config, agentId) : void 0;
	const agentRaw = normalizeCodeModeRawConfig(agent?.tools?.codeMode);
	const key = model ? normalizeAgentModelRefForConfig(modelKey(model.provider, model.modelId)) : void 0;
	return {
		...globalRaw,
		...agentRaw,
		enabled: (key ? agent?.models?.[key]?.codeMode : void 0) ?? agentRaw?.enabled ?? (key ? config?.agents?.defaults?.models?.[key]?.codeMode : void 0) ?? globalRaw.enabled
	};
}
function readEnabled(value) {
	return typeof value === "boolean" || value === "auto" ? value : false;
}
function readExecutor(value) {
	if (value === void 0) return "node";
	if (value === "node" || value === "quickjs") return value;
	throw new ToolInputError("Code Mode executor must be \"node\" or \"quickjs\".");
}
function readPositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
/** Resolves Code Mode runtime limits from config. */
function resolveCodeModeConfig(config, agentId, model) {
	const raw = readCodeModeRawConfig(config, agentId, model);
	const maxSearchLimit = clampNumber(readPositiveInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT), 1, DEFAULT_MAX_SEARCH_LIMIT);
	return {
		enabled: readEnabled(raw.enabled),
		executor: readExecutor(raw.executor),
		mode: "only",
		timeoutMs: clampNumber(readPositiveInteger(raw.timeoutMs, DEFAULT_TIMEOUT_MS), 100, 6e4),
		memoryLimitBytes: clampNumber(readPositiveInteger(raw.memoryLimitBytes, DEFAULT_MEMORY_LIMIT_BYTES), 1048576, 1073741824),
		maxOutputBytes: clampNumber(readPositiveInteger(raw.maxOutputBytes, DEFAULT_MAX_OUTPUT_BYTES), 1024, 10485760),
		maxSnapshotBytes: clampNumber(readPositiveInteger(raw.maxSnapshotBytes, DEFAULT_MAX_SNAPSHOT_BYTES), 1024, 268435456),
		maxPendingToolCalls: clampNumber(readPositiveInteger(raw.maxPendingToolCalls, DEFAULT_MAX_PENDING_TOOL_CALLS), 1, 128),
		snapshotTtlSeconds: clampNumber(readPositiveInteger(raw.snapshotTtlSeconds, DEFAULT_SNAPSHOT_TTL_SECONDS), 1, 86400),
		searchDefaultLimit: clampNumber(readPositiveInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT), 1, maxSearchLimit),
		maxSearchLimit
	};
}
/**
* Resolves the effective activation policy against one model's catalog flag.
* `true`/`false` are absolute; `"auto"` engages only for models whose catalog
* compat declares `codeMode: "preferred"`. This gates the model-facing tool
* surface only; runs that route to a provider-native harness (for example the
* default OpenAI Codex surface) never reach this embedded-runtime gate.
*/
function isCodeModeEngagedForModel(config, model) {
	if (config.enabled !== "auto") return config.enabled;
	return (model?.compat && typeof model.compat === "object" ? model.compat : void 0)?.codeMode === "preferred";
}
function toToolSearchConfig(config) {
	return {
		enabled: true,
		mode: "tools",
		codeTimeoutMs: config.timeoutMs,
		searchDefaultLimit: config.searchDefaultLimit,
		maxSearchLimit: config.maxSearchLimit
	};
}
function resolveCodeModeHeadlessConfig(ctx, overrides) {
	const base = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId);
	const definedOverrides = Object.fromEntries(Object.entries(overrides ?? {}).filter(([, value]) => value !== void 0));
	return resolveCodeModeConfig({ tools: { codeMode: {
		...base,
		...definedOverrides
	} } });
}
function readCode(args) {
	const params = asToolParamsRecord(args);
	const codeAlias = readNonBlankString(params.code);
	const commandAlias = readNonBlankString(params.command);
	if (codeAlias !== void 0 && commandAlias !== void 0 && codeAlias !== commandAlias) throw new ToolInputError("code and command must match when both are provided.");
	const code = commandAlias ?? codeAlias;
	if (code === void 0) throw new ToolInputError("code or command must be a non-empty string.");
	if (params.language !== void 0 || params.typecheck !== void 0) throw new ToolInputError("Code Mode accepts JavaScript only. Remove language and typecheck; use API.read(...) for tool types.");
	const restartSafe = params.restartSafe;
	if (restartSafe !== void 0 && typeof restartSafe !== "boolean") throw new ToolInputError("restartSafe must be a boolean.");
	return {
		code,
		restartSafe: restartSafe === true
	};
}
function readRunId(args) {
	const params = asToolParamsRecord(args);
	const runId = params.runId ?? params.run_id;
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("runId must be a non-empty string.");
	return runId.trim();
}
function createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled) {
	const { apiFiles: files } = namespaceRuntime;
	return [CODE_MODE_RESULTS_API_FILE, ...swarmEnabled ? files : files.filter((file) => file.path !== "agents.d.ts")];
}
//#endregion
//#region src/agents/code-mode-execution.ts
async function runCodeModeExec(params) {
	removeExpiredRuns();
	const { config } = params;
	const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config), {
		prepareInput: true,
		validateInput: true
	});
	params.onRuntime?.(runtime);
	const bridgeDispatch = createCodeModeBridgeDispatchState();
	const budget = { deadlineMs: performance.now() + config.timeoutMs };
	const namespaceCatalog = runtime.namespaceEntries();
	const swarmEnabled = isCodeModeSwarmAvailable(params.ctx, namespaceCatalog);
	const codeModeReplayId = codeModeReplayIdForToolCall(params.ctx, params.toolCallId, params.code, params.assistantTurnId);
	const namespaceRuntime = createCodeModeNamespaceRuntime(namespaceCatalog);
	const catalogProjection = createCodeModeCatalogProjection(runtime.all({ includeMcp: false }), {
		reservedNames: namespaceRuntime.descriptors.map((descriptor) => descriptor.globalName),
		mcpIds: namespaceRuntime.mcpBindings.keys()
	});
	const apiFiles = createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled);
	const owner = createCodeModeRunOwner(params.ctx, config);
	const { approvalWait } = owner;
	const signal = owner.bindCall(params.signal);
	const output = new CodeModeOutputState(config.maxOutputBytes, params.resultBudget);
	const pending = [];
	let releaseReservation;
	const context = {
		owner,
		output,
		replaySafe: params.restartSafe,
		budget,
		parentToolCallId: params.toolCallId,
		codeModeReplayId,
		ctx: params.ctx,
		config,
		runtime,
		catalogProjection,
		namespaceRuntime,
		bridgeDispatch,
		approvalWait,
		signal,
		onUpdate: params.onUpdate
	};
	const inlineHost = createInlineHost(context, pending, () => {
		releaseReservation ??= reserveActiveRunSlot();
	});
	try {
		const remainingMs = budget.deadlineMs - performance.now();
		if (remainingMs <= 0) throw new Error("interrupted");
		const result = await owner.runExecution(() => runCodeModeExecutor({
			kind: "exec",
			retainFinalValue: !params.restartSafe,
			source: params.code,
			config: {
				...config,
				timeoutMs: remainingMs
			},
			catalog: catalogProjection.guestBindings,
			apiFiles,
			namespaces: namespaceRuntime.descriptors,
			swarmEnabled
		}, {
			timeoutMs: remainingMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS,
			executor: config.executor,
			runtimeConfig: params.ctx.runtimeConfig ?? params.ctx.config,
			signal,
			inlineHost
		}));
		output.append(result.output);
		return await settleCodeModeResult({
			...context,
			pending,
			reservedActiveRunSlot: releaseReservation !== void 0,
			result
		});
	} catch (error) {
		const code = signal.aborted ? "aborted" : codeModeFailureCode(error);
		return output.takeResult({
			status: "failed",
			code,
			failurePhase: bridgeDispatch.started ? "bridge" : code === "invalid_input" ? "input" : "host",
			bridgeDispatchStarted: bridgeDispatch.started,
			replaySafe: params.restartSafe,
			telemetry: telemetry(runtime)
		}, { error: signal.aborted ? "code mode execution aborted" : codeModeFailureMessage(error) }, runtime.hasNetworkContent());
	} finally {
		releaseReservation?.();
		approvalWait.onChange = void 0;
		if (!activeRuns.has(owner.runId)) await owner.close();
	}
}
function usableResumeBudgetMs(deadlineMs, config) {
	const minimum = Math.min(250, Math.max(1, Math.floor(config.timeoutMs / 2)));
	const remaining = deadlineMs - performance.now();
	return remaining >= minimum ? remaining : void 0;
}
async function waitForPending(pending, settlementMode, budget, approvalWait, signal) {
	if (signal?.aborted) return false;
	const required = pendingBridgeStatesForSettlement(pending, settlementMode);
	if (required.length === 0 || settlementMode.kind === "awaiting" && required.some((entry) => entry.settled) || required.every((entry) => entry.settled)) return true;
	const pausedAtMs = approvalWait.pausedMs;
	const timeoutMs = Math.max(1, budget.deadlineMs - performance.now());
	let timer;
	let onAbort;
	try {
		const bridgeReady = waitForPendingBridgeSettlement(pending, settlementMode).then(() => true);
		return await Promise.race([
			bridgeReady,
			new Promise((resolve) => {
				let remainingMs = timeoutMs;
				let resumedAtMs = performance.now();
				const arm = () => {
					resumedAtMs = performance.now();
					timer = setTimeout(() => resolve(false), Math.max(1, remainingMs));
				};
				approvalWait.onChange = (approvalPending) => {
					if (approvalPending) {
						clearTimeout(timer);
						remainingMs = Math.max(1, remainingMs - (performance.now() - resumedAtMs));
					} else arm();
				};
				if (!approvalWait.pending) arm();
			}),
			...signal ? [new Promise((resolve) => {
				onAbort = () => resolve(false);
				signal.addEventListener("abort", onAbort, { once: true });
			})] : []
		]);
	} finally {
		budget.deadlineMs += Math.max(0, approvalWait.pausedMs - pausedAtMs);
		if (timer) clearTimeout(timer);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
		approvalWait.onChange = void 0;
	}
}
function dispatchCodeModeRequests(params, pending, requests) {
	const pendingIds = new Set(pending.map((entry) => entry.id));
	const newPendingRequests = requests.filter((request) => !pendingIds.has(request.id));
	if (newPendingRequests.length > 0 && params.budget.deadlineMs <= performance.now()) throw new Error("interrupted");
	pending.push(...createPendingBridgeStates(newPendingRequests, {
		config: params.config,
		inbox: params.owner.inbox,
		results: params.owner.results,
		runtime: params.runtime,
		catalogProjection: params.catalogProjection,
		namespaceRuntime: params.namespaceRuntime,
		parentToolCallId: params.parentToolCallId,
		codeModeRunId: params.codeModeReplayId,
		remainingMs: params.budget.deadlineMs - performance.now(),
		activeRunId: params.owner.runId,
		ctx: params.ctx,
		signal: params.signal,
		onUpdate: params.onUpdate,
		bridgeDispatch: params.bridgeDispatch
	}));
}
function createInlineHost(params, pending, reserve, onInputConsumed) {
	return {
		onInputConsumed,
		onNetworkContent: () => params.runtime.observeNetworkContent(params.parentToolCallId),
		onBoundary: async (boundary, context) => {
			params.output.append(boundary.output);
			cancelPendingBridgeStatesById(pending, boundary.canceledRequestIds);
			if (boundary.pendingRequests.some((request) => request.method === "yield") || params.replaySafe && !pendingBridgeRequestsReplaySafe(boundary.pendingRequests, params.runtime, params.catalogProjection)) return { kind: "checkpoint" };
			reserve();
			dispatchCodeModeRequests(params, pending, boundary.pendingRequests);
			const signal = AbortSignal.any([
				params.signal,
				context.signal,
				context.yieldSignal
			]);
			const ready = await waitForPending(pending, boundary.settlementMode, params.budget, params.approvalWait, signal);
			if (!ready && !signal.aborted) params.budget.deadlineMs = performance.now();
			const timeoutMs = params.budget.deadlineMs - performance.now();
			if (!ready || signal.aborted || timeoutMs <= 0) return { kind: "checkpoint" };
			const delivery = takeSettledBridgeRequests(pending);
			const unresolved = pending.filter((entry) => !entry.settled);
			pending.splice(0, pending.length, ...unresolved);
			return {
				kind: "continue",
				timeoutMs,
				settledRequests: delivery.requests,
				pendingRequests: pending.map(({ id, method, args }) => ({
					id,
					method,
					args
				})),
				onConsumed: delivery.release
			};
		}
	};
}
async function settleCodeModeResult(params) {
	let result = params.result;
	let pending = params.pending ?? [];
	if (result.status === "waiting") cancelPendingBridgeStatesById(pending, result.canceledRequestIds);
	const output = params.output;
	const abortedResult = () => codeModeAbortedResult(params);
	const parkSnapshot = (waiting, replaySafe) => storeSuspendedRun({
		owner: params.owner,
		replayId: params.codeModeReplayId,
		pending,
		replaySafe,
		settlementMode: waiting.settlementMode,
		continuation: waiting.continuation,
		parentToolCallId: params.parentToolCallId,
		ctx: params.ctx,
		config: params.config,
		runtime: params.runtime,
		catalogProjection: params.catalogProjection,
		namespaceRuntime: params.namespaceRuntime,
		output,
		bridgeDispatch: params.bridgeDispatch
	});
	while (result.status === "waiting" && result.pendingRequests.length > 0 && result.pendingRequests.every((request) => request.method !== "yield")) {
		if (params.replaySafe && !pendingBridgeRequestsReplaySafe(result.pendingRequests, params.runtime, params.catalogProjection)) break;
		if (params.budget.deadlineMs - performance.now() <= 0) break;
		if (params.signal?.aborted) {
			cancelPendingBridgeStates(pending);
			return abortedResult();
		}
		let releaseReservation;
		try {
			if (!params.reservedActiveRunSlot) releaseReservation = reserveActiveRunSlot();
			dispatchCodeModeRequests(params, pending, result.pendingRequests);
			const ready = await waitForPending(pending, result.settlementMode, params.budget, params.approvalWait, params.signal);
			const resumeBudgetMs = ready ? usableResumeBudgetMs(params.budget.deadlineMs, params.config) : void 0;
			if (!ready || resumeBudgetMs === void 0) {
				if (params.signal?.aborted) {
					cancelPendingBridgeStates(pending);
					return abortedResult();
				}
				return parkSnapshot(result, params.replaySafe);
			}
			const delivery = takeSettledBridgeRequests(pending);
			pending = pending.filter((entry) => !entry.settled);
			const continuation = result.continuation;
			try {
				result = await params.owner.runExecution(() => runCodeModeExecutor({
					kind: "resume",
					retainFinalValue: !params.replaySafe,
					continuation,
					config: {
						...params.config,
						timeoutMs: resumeBudgetMs
					},
					settledRequests: delivery.requests,
					pendingRequests: pending.map(({ id, method, args }) => ({
						id,
						method,
						args
					}))
				}, {
					timeoutMs: resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS,
					executor: params.config.executor,
					signal: params.signal,
					inlineHost: createInlineHost(params, pending, () => {}, delivery.release)
				}));
			} finally {
				delivery.release();
			}
			output.append(result.output);
			if (result.status === "waiting") cancelPendingBridgeStatesById(pending, result.canceledRequestIds);
		} catch (error) {
			cancelPendingBridgeStates(pending);
			throw error;
		} finally {
			releaseReservation?.();
		}
	}
	if (params.signal?.aborted) {
		cancelPendingBridgeStates(pending);
		return abortedResult();
	}
	if (result.status === "waiting") {
		const pendingReplaySafe = pendingBridgeRequestsReplaySafe(result.pendingRequests, params.runtime, params.catalogProjection);
		if (params.replaySafe && !pendingReplaySafe) {
			cancelPendingBridgeStates(pending);
			return output.takeResult({
				status: "failed",
				code: "invalid_input",
				failurePhase: params.bridgeDispatch.started ? "bridge" : "input",
				bridgeDispatchStarted: params.bridgeDispatch.started,
				replaySafe: true,
				telemetry: telemetry(params.runtime)
			}, { error: result.pendingRequests.every((request) => request.method === "namespace") ? "restart-safe code mode cannot call namespace tools." : "restart-safe code mode cannot call tool surfaces that are not proven replay-safe; use audited read, grep, or find tools." }, params.runtime.hasNetworkContent());
		}
		let releaseReservation;
		try {
			if (!params.reservedActiveRunSlot) releaseReservation = reserveActiveRunSlot();
			dispatchCodeModeRequests(params, pending, result.pendingRequests);
			return parkSnapshot(result, params.replaySafe && pendingReplaySafe);
		} catch (error) {
			cancelPendingBridgeStates(pending);
			throw error;
		} finally {
			releaseReservation?.();
		}
	}
	cancelPendingBridgeStates(pending);
	const channels = {
		...result.status === "completed" ? { value: result.value } : {},
		...result.status === "failed" ? { error: result.error } : {}
	};
	const metadata = {
		...result.status === "failed" ? {
			status: result.status,
			code: result.code,
			failurePhase: params.bridgeDispatch.started ? "bridge" : result.failurePhase,
			bridgeDispatchStarted: params.bridgeDispatch.started
		} : { status: result.status },
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	};
	const networkContent = params.runtime.hasNetworkContent();
	return output.takeResult(metadata, channels, networkContent, (source) => params.replaySafe ? { reason: "Not retained in restart-safe mode. Return less data." } : params.owner.results.retain(source, networkContent));
}
async function runWait(params) {
	removeExpiredRuns();
	if (resumingRunIds.has(params.runId)) throw new ToolInputError("code mode run is already being resumed.");
	const state = activeRuns.get(params.runId);
	if (!state) throw new ToolInputError("code mode run is unavailable or expired.");
	if (state.ctx.runId && state.ctx.runId !== params.ctx.runId) throw new ToolInputError("code mode run belongs to a different agent run.");
	if (state.ctx.sessionId && state.ctx.sessionId !== params.ctx.sessionId || state.ctx.sessionKey && state.ctx.sessionKey !== params.ctx.sessionKey || state.ctx.agentId && state.ctx.agentId !== params.ctx.agentId) throw new ToolInputError("code mode run belongs to a different session.");
	params.onRuntime?.(state.runtime);
	resumingRunIds.add(state.runId);
	const budget = { deadlineMs: performance.now() + state.config.timeoutMs };
	const { approvalWait } = state.owner;
	const signal = state.owner.bindCall(params.ctx.abortSignal && params.signal ? AbortSignal.any([params.ctx.abortSignal, params.signal]) : params.signal ?? params.ctx.abortSignal);
	let releaseActiveRunSlot;
	try {
		releaseActiveRunSlot = reserveActiveRunSlot(state.runId);
		const ready = await waitForPending(state.pending, state.settlementMode, budget, approvalWait, signal);
		const resumeBudgetMs = ready ? usableResumeBudgetMs(budget.deadlineMs, state.config) : void 0;
		if (!ready || resumeBudgetMs === void 0) {
			if (signal.aborted) return {
				...codeModeAbortedResult(state),
				failurePhase: "bridge"
			};
			return storeSuspendedRun(state);
		}
		const pending = state.pending.filter((entry) => !entry.settled);
		const delivery = takeSettledBridgeRequests(state.pending);
		let result;
		try {
			result = await state.owner.runExecution(() => runCodeModeExecutor({
				kind: "resume",
				retainFinalValue: !state.replaySafe,
				continuation: state.continuation,
				config: {
					...state.config,
					timeoutMs: resumeBudgetMs
				},
				settledRequests: delivery.requests,
				pendingRequests: pending.map(({ id, method, args }) => ({
					id,
					method,
					args
				}))
			}, {
				timeoutMs: resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS,
				executor: state.config.executor,
				signal,
				inlineHost: createInlineHost({
					owner: state.owner,
					output: state.output,
					replaySafe: state.replaySafe,
					budget,
					parentToolCallId: state.parentToolCallId,
					codeModeReplayId: state.replayId,
					ctx: state.ctx,
					config: state.config,
					runtime: state.runtime,
					catalogProjection: state.catalogProjection,
					namespaceRuntime: state.namespaceRuntime,
					bridgeDispatch: state.bridgeDispatch,
					approvalWait,
					signal,
					onUpdate: params.onUpdate
				}, pending, () => {}, delivery.release)
			}));
		} finally {
			delivery.release();
		}
		state.output.append(result.output);
		return await settleCodeModeResult({
			owner: state.owner,
			result,
			output: state.output,
			replaySafe: state.replaySafe,
			budget,
			parentToolCallId: state.parentToolCallId,
			codeModeReplayId: state.replayId,
			ctx: state.ctx,
			config: state.config,
			runtime: state.runtime,
			catalogProjection: state.catalogProjection,
			namespaceRuntime: state.namespaceRuntime,
			bridgeDispatch: state.bridgeDispatch,
			approvalWait,
			pending,
			reservedActiveRunSlot: true,
			signal,
			onUpdate: params.onUpdate
		});
	} catch (error) {
		const aborted = signal.aborted;
		await state.owner.close();
		cancelPendingBridgeStates(state.pending);
		return state.output.takeResult({
			status: "failed",
			code: aborted ? "aborted" : codeModeFailureCode(error),
			failurePhase: "bridge",
			bridgeDispatchStarted: state.bridgeDispatch.started,
			replaySafe: state.replaySafe,
			telemetry: telemetry(state.runtime)
		}, { error: aborted ? "code mode execution aborted" : codeModeFailureMessage(error) }, state.runtime.hasNetworkContent());
	} finally {
		approvalWait.onChange = void 0;
		releaseActiveRunSlot?.();
		resumingRunIds.delete(state.runId);
		if (!activeRuns.has(state.runId)) await state.owner.close();
	}
}
//#endregion
//#region src/agents/code-mode-deadline.ts
/** Race preparation and bridge work against the same guest-owned deadline. */
async function awaitCodeModeDeadline(params) {
	const { remainingMs } = params;
	if (remainingMs <= 0) throw params.createTimeoutError();
	if (params.signal?.aborted) throw params.createAbortError(params.signal);
	let timer;
	let onAbort;
	try {
		const deadline = new Promise((_resolve, reject) => {
			timer = setTimeout(() => reject(params.createTimeoutError()), remainingMs);
			const signal = params.signal;
			if (signal) {
				onAbort = () => reject(params.createAbortError(signal));
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		return await Promise.race([params.operation(), deadline]);
	} finally {
		if (timer) clearTimeout(timer);
		if (params.signal && onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/agents/code-mode-headless.ts
/** Each invocation owns a deadline, including callers that prepare tools before starting a guest. */
function createHeadlessDeadlineScope(signal, wallClockMs, label) {
	const controller = new AbortController();
	const onAbort = () => controller.abort(label ? new CodeModeHeadlessAbortError(`${label} aborted`) : signal?.reason);
	signal?.addEventListener("abort", onAbort, { once: true });
	if (signal?.aborted) onAbort();
	const timeoutError = () => new CodeModeHeadlessTimeoutError(label ? `${label} timed out` : void 0);
	const timer = setTimeout(() => controller.abort(timeoutError()), wallClockMs);
	const deadline = performance.now() + wallClockMs;
	return {
		deadline,
		signal: controller.signal,
		wait: (promise) => awaitCodeModeDeadline({
			operation: () => promise,
			remainingMs: Math.ceil(deadline - performance.now()),
			signal: controller.signal,
			createTimeoutError: timeoutError,
			createAbortError: headlessAbortError
		}),
		cleanup: () => {
			controller.abort(new CodeModeHeadlessAbortError());
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
		}
	};
}
function headlessAbortError(signal) {
	return signal.reason instanceof CodeModeHeadlessTimeoutError ? signal.reason : signal.reason instanceof CodeModeHeadlessAbortError ? signal.reason : new CodeModeHeadlessAbortError();
}
function headlessFailure(params) {
	return {
		status: "failed",
		code: params.code,
		toolCallCount: params.toolCallCount,
		...params.output.take({ error: params.error })
	};
}
function remainingHeadlessMs(deadline) {
	const remaining = Math.ceil(deadline - performance.now());
	if (remaining <= 0) throw new CodeModeHeadlessTimeoutError();
	return remaining;
}
async function runHeadlessWorkerLeg(params) {
	const remainingMs = remainingHeadlessMs(params.deadline);
	const executionTimeoutMs = Math.max(1, Math.min(params.config.timeoutMs, remainingMs));
	const timeoutMs = params.input.kind === "exec" ? remainingMs : executionTimeoutMs;
	const workerTimeoutMs = timeoutMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS;
	return await params.owner.runExecution(() => runCodeModeExecutor({
		...params.input.kind === "exec" ? {
			...params.input,
			executionTimeoutMs
		} : params.input,
		config: {
			...params.config,
			timeoutMs
		}
	}, {
		timeoutMs: workerTimeoutMs,
		executor: params.config.executor,
		runtimeConfig: params.runtimeConfig,
		signal: params.signal,
		inlineHost: params.inlineHost
	}));
}
function normalizeHeadlessNamespaceValue(descriptor) {
	if (descriptor.kind === "array") return {
		kind: "array",
		items: descriptor.items.map(normalizeHeadlessNamespaceValue)
	};
	if (descriptor.kind === "object") return {
		kind: "object",
		entries: descriptor.entries.map(([key, value]) => {
			if (!key) throw new ToolInputError("code mode namespace descriptor keys must not be empty");
			return [key, normalizeHeadlessNamespaceValue(value)];
		})
	};
	if (descriptor.kind !== "value") return descriptor;
	return {
		kind: "value",
		value: toCodeModeJsonSafe(descriptor.value)
	};
}
function normalizeHeadlessNamespace(descriptor) {
	return {
		...descriptor,
		scope: normalizeHeadlessNamespaceValue(descriptor.scope)
	};
}
function mergeHeadlessNamespaces(registered, extra) {
	const ids = new Set(registered.map((descriptor) => descriptor.id));
	const globalNames = new Set(registered.map((descriptor) => descriptor.globalName));
	const merged = [...registered];
	for (const descriptor of extra) {
		if (ids.has(descriptor.id) || globalNames.has(descriptor.globalName)) throw new ToolInputError(`code mode namespace collision for ${descriptor.id} (${descriptor.globalName})`);
		ids.add(descriptor.id);
		globalNames.add(descriptor.globalName);
		merged.push(normalizeHeadlessNamespace(descriptor));
	}
	return merged;
}
function headlessNamespaceFreezePrelude(descriptors) {
	return `;(() => {
    const seen = new WeakSet();
    const freeze = (value) => {
      if ((value === null || (typeof value !== "object" && typeof value !== "function")) || seen.has(value)) return value;
      seen.add(value);
      for (const key of Object.keys(value)) freeze(value[key]);
      return Object.freeze(value);
    };
    for (const name of ${JSON.stringify(descriptors.map((descriptor) => descriptor.globalName))}) freeze(globalThis[name]);
  })();\n`;
}
/** Run Code Mode to completion without publishing resumable snapshot state. */
async function runCodeModeScriptHeadless(params) {
	const config = resolveCodeModeHeadlessConfig(params.ctx, params.overrides);
	const wallClockMs = clampNumber(readPositiveInteger(params.wallClockMs, DEFAULT_HEADLESS_WALL_CLOCK_MS), 1, MAX_HEADLESS_WALL_CLOCK_MS);
	const maxToolCalls = clampNumber(readPositiveInteger(params.maxToolCalls, 5), 1, 200);
	const owner = createCodeModeRunOwner(params.ctx, config);
	const abortScope = createHeadlessDeadlineScope(owner.bindCall(params.signal), wallClockMs);
	const deadline = abortScope.deadline;
	const output = new CodeModeOutputState(config.maxOutputBytes);
	let pending = [];
	let toolCallCount = 0;
	let releaseReservation;
	try {
		const swarmEnabled = false;
		const codeModeRunId = `cm_headless_${randomUUID()}`;
		const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config), {
			prepareInput: true,
			validateInput: true
		});
		const bridgeDispatch = createCodeModeBridgeDispatchState();
		const namespaceRuntime = createCodeModeNamespaceRuntime(runtime.namespaceEntries());
		const namespaces = mergeHeadlessNamespaces(namespaceRuntime.descriptors, params.extraNamespaces ?? []);
		const catalogProjection = createCodeModeCatalogProjection(runtime.all({ includeMcp: false }), {
			reservedNames: namespaces.map((descriptor) => descriptor.globalName),
			mcpIds: namespaceRuntime.mcpBindings.keys()
		});
		const parentToolCallId = `headless:${randomUUID()}`;
		const dispatch = (boundary) => {
			cancelPendingBridgeStatesById(pending, boundary.canceledRequestIds);
			const pendingIds = new Set(pending.map((entry) => entry.id));
			const newRequests = boundary.pendingRequests.filter((request) => !pendingIds.has(request.id));
			const requestedToolCalls = newRequests.filter((request) => request.method === "callValue" || request.method === "nodes" || request.method === "namespace").length;
			toolCallCount += requestedToolCalls;
			if (toolCallCount > maxToolCalls) throw new HeadlessToolBudgetError(`code mode headless tool budget exceeded (${maxToolCalls})`);
			releaseReservation ??= reserveActiveRunSlot();
			pending.push(...createPendingBridgeStates(newRequests, {
				config,
				inbox: owner.inbox,
				results: owner.results,
				runtime,
				catalogProjection,
				namespaceRuntime,
				parentToolCallId,
				codeModeRunId,
				remainingMs: remainingHeadlessMs(deadline),
				ctx: params.ctx,
				signal: abortScope.signal,
				bridgeDispatch
			}));
		};
		let boundaryFailure;
		const inlineHost = {
			onNetworkContent: () => runtime.observeNetworkContent(parentToolCallId),
			onBoundary: async (boundary, context) => {
				output.append(boundary.output);
				cancelPendingBridgeStatesById(pending, boundary.canceledRequestIds);
				if (boundary.pendingRequests.some((request) => request.method === "yield")) return { kind: "checkpoint" };
				try {
					dispatch(boundary);
				} catch (error) {
					boundaryFailure = error instanceof Error ? error : new Error("headless bridge failed", { cause: error });
					throw boundaryFailure;
				}
				if (context.yieldSignal.aborted) return { kind: "checkpoint" };
				let onPressure;
				try {
					if (!await abortScope.wait(Promise.race([waitForPendingBridgeSettlement(pending, boundary.settlementMode).then(() => true), new Promise((resolve) => {
						onPressure = () => resolve(false);
						context.yieldSignal.addEventListener("abort", onPressure, { once: true });
					})])) || context.yieldSignal.aborted) return { kind: "checkpoint" };
					const timeoutMs = Math.min(context.maxTimeoutMs, config.timeoutMs, remainingHeadlessMs(deadline));
					const delivery = takeSettledBridgeRequests(pending);
					pending = pending.filter((entry) => !entry.settled);
					return {
						kind: "continue",
						timeoutMs,
						settledRequests: delivery.requests,
						pendingRequests: pending.map(({ id, method, args }) => ({
							id,
							method,
							args
						})),
						onConsumed: delivery.release
					};
				} finally {
					if (onPressure) context.yieldSignal.removeEventListener("abort", onPressure);
				}
			}
		};
		let result = await runHeadlessWorkerLeg({
			input: {
				kind: "exec",
				config,
				source: params.code,
				prelude: headlessNamespaceFreezePrelude(namespaces),
				catalog: catalogProjection.guestBindings,
				apiFiles: createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled),
				namespaces,
				swarmEnabled
			},
			config,
			owner,
			runtimeConfig: params.ctx.runtimeConfig ?? params.ctx.config,
			deadline,
			signal: abortScope.signal,
			inlineHost
		});
		while (true) {
			output.append(result.output);
			if (boundaryFailure) throw boundaryFailure;
			if (result.status === "completed") {
				const bounded = output.take({ value: result.value });
				return {
					status: "completed",
					value: bounded.value,
					output: bounded.output,
					toolCallCount
				};
			}
			if (result.status === "failed") return headlessFailure({
				code: result.code,
				error: result.error,
				output,
				toolCallCount
			});
			dispatch(result);
			const settlementMode = result.settlementMode;
			if (pendingBridgeStatesForSettlement(pending, settlementMode).length === 0) return headlessFailure({
				code: "internal_error",
				error: "code mode is waiting without pending bridge requests",
				output,
				toolCallCount
			});
			await abortScope.wait(waitForPendingBridgeSettlement(pending, settlementMode));
			const delivery = takeSettledBridgeRequests(pending);
			pending = pending.filter((entry) => !entry.settled);
			try {
				result = await runHeadlessWorkerLeg({
					input: {
						kind: "resume",
						config,
						continuation: result.continuation,
						settledRequests: delivery.requests,
						pendingRequests: pending.map(({ id, method, args }) => ({
							id,
							method,
							args
						}))
					},
					config,
					owner,
					runtimeConfig: params.ctx.runtimeConfig ?? params.ctx.config,
					deadline,
					signal: abortScope.signal,
					inlineHost: {
						...inlineHost,
						onInputConsumed: delivery.release
					}
				});
			} finally {
				delivery.release();
			}
		}
	} catch (error) {
		const failure = abortScope.signal.aborted ? headlessAbortError(abortScope.signal) : error;
		const timedOut = failure instanceof CodeModeHeadlessTimeoutError;
		const aborted = failure instanceof CodeModeHeadlessAbortError;
		return headlessFailure({
			code: failure instanceof HeadlessToolBudgetError ? "tool_budget_exceeded" : timedOut ? "timeout" : aborted ? "aborted" : codeModeFailureCode(failure),
			error: timedOut || aborted ? failure.message : codeModeFailureMessage(failure),
			output,
			toolCallCount
		});
	} finally {
		cancelPendingBridgeStates(pending);
		abortScope.cleanup();
		releaseReservation?.();
		await owner.close();
	}
}
var HeadlessToolBudgetError = class extends Error {};
//#endregion
//#region src/agents/code-mode-permission-change.ts
const permissionChangeReasons = /* @__PURE__ */ new WeakSet();
/** Mint the exact host-owned reason for an operator's permission transition. */
function createCodeModePermissionChangeReason() {
	const reason = /* @__PURE__ */ new Error("Permission change");
	permissionChangeReasons.add(reason);
	return reason;
}
/** Preserve the operator transition without claiming interrupted actions never started. */
function markCodeModePermissionChangeResult(details, signal) {
	const reason = signal?.reason;
	if (details.status === "failed" && details.code === "aborted" && signal?.aborted && reason instanceof Error && permissionChangeReasons.has(reason)) details.error = "Permission change interrupted this Code Mode program. Continue the current task using the updated permissions. Do not replay this program or repeat completed actions. Any in-flight action may have partially applied; inspect authoritative state before deciding what work remains.";
}
//#endregion
//#region src/agents/code-mode.ts
/**
* Host-side Code Mode controller for selectable JavaScript execution with bridged
* tool search/call/yield support.
*/
const MAX_CODE_MODE_CATALOG_INDEX_CHARS = 8e3;
const CODE_MODE_CATALOG_INDEX_HEADING = ["Enabled async tool globals (descriptions are intentionally deferred):", "Each line is `callableName input -> output`; `-> ?` means unknown output."].join("\n");
function codeModeCatalogIndexFooter(included, total) {
	const omitted = total - included;
	return omitted > 0 ? `${omitted} additional tools omitted from this prompt index. Use catalog.search(query); results are callable.` : "Call these globals directly; use catalog.search(query) when lookup is ambiguous.";
}
function renderCodeModeCatalogIndex(lines, total) {
	return [
		CODE_MODE_CATALOG_INDEX_HEADING,
		...lines,
		"",
		codeModeCatalogIndexFooter(lines.length, total)
	].join("\n");
}
function formatCodeModeCatalogIndex(bindings) {
	const lines = bindings.toSorted((a, b) => (a.output ? 0 : 1) - (b.output ? 0 : 1) || a.callableName.localeCompare(b.callableName)).map((entry) => `- ${entry.callableName} ${entry.input ?? "unknown"} -> ${entry.output ?? "?"}`);
	if (lines.length === 0) return "";
	const fullIndex = renderCodeModeCatalogIndex(lines, lines.length);
	if (fullIndex.length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) return fullIndex;
	const included = [];
	let includedLineLength = 0;
	for (const line of lines) {
		const candidateLineLength = includedLineLength + 1 + line.length;
		if (CODE_MODE_CATALOG_INDEX_HEADING.length + candidateLineLength + 2 + codeModeCatalogIndexFooter(included.length + 1, lines.length).length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) {
			included.push(line);
			includedLineLength = candidateLineLength;
		}
	}
	return renderCodeModeCatalogIndex(included, lines.length);
}
function createCodeModeExecDescription(ctx, catalog, config = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId)) {
	const namespacePrompt = describeCodeModeNamespacesForPrompt(catalog);
	const catalogKnown = catalog !== void 0;
	const hasMcp = catalog?.some((entry) => entry.source === "mcp") ?? false;
	const swarmEnabled = isCodeModeSwarmAvailable(ctx, catalog);
	const apiGuidance = !catalogKnown || (catalog?.length ?? 0) > 0 || swarmEnabled ? " Read types with `API.list(prefix?)` and `API.read(path)`; native tools: `tools/`. Types are documentation; write plain JavaScript." : "";
	const mcpGuidance = !catalogKnown || hasMcp ? " MCP tools use the `MCP` namespace or callable `catalog.search` handles." : "";
	const swarmGuidance = swarmEnabled ? " Swarm globals `agents.run`, `phase`, and `log` are available; read `agents.d.ts` for types and orchestration idioms." : "";
	const hasNodes = catalog?.some((entry) => entry.id === "openclaw:core:nodes") ?? false;
	const nodesGuidance = !catalogKnown || hasNodes ? "\n- nodes: paired Gateway nodes; nodes.list(), (await nodes.get(id)).invoke(command, params)\n" : "";
	const skillsGuidance = ctx.codeModeSkills?.length ? " Skills are available through the async `skills` global: use `await skills.list()` and `await skills.read(name)`." : "";
	const { maxOutputBytes, timeoutMs } = config;
	const bindings = catalog ? createCodeModeCatalogBindings(catalog.map((entry) => compactToolSearchCatalogEntry(entry))) : void 0;
	const catalogIndex = bindings ? formatCodeModeCatalogIndex(bindings) : "";
	const shellTool = bindings?.find((entry) => entry.id === "openclaw:core:exec");
	const shellGuidance = shellTool ? ` Use the shell tool \`${shellTool.callableName}\` for heavier computation.` : "";
	return `Run JavaScript in OpenClaw code mode. Guest work and inline tool waits share a ${timeoutMs} ms wall-clock budget per \`exec\`/\`wait\`; approvals pause it. Guest computation over this budget times out; pending tools may return \`waiting\` for \`wait\`.` + shellGuidance + ` Enabled tools are async global functions. Await dependent calls in order; independent calls may run with Promise.all. Declared output fields may feed later calls in the same program; avoid extra inspection calls. Emit output with \`text(value)\` or \`json(value)\`. Return the final value, otherwise \`null\`. Oversized final objects/arrays may return \`value.reference\`. \`-> ?\` means unknown output: do not feed it into guessed field-dependent logic in the same program. Return it raw or \`await results.save(value)\`; use a later \`exec\` for dependent composition. Save returns \`{id,bytes,count,shape,preview,previewTruncated}\`: emit that descriptor directly; full JSON stays stored. Load/delete this run via \`results.load(id)\`/\`results.delete(id)\`; contract: \`API.read("results.d.ts")\`. For omitted tools, use \`catalog.search(query)\`; results are callable: \`const [tool] = await catalog.search("..."); return await tool({...});\`. Use handle \`describe()\` for schemas. \`setTimeout\` and \`clearTimeout\` work. \`TextEncoder\`/\`TextDecoder\` convert local text and bytes. Console log/info/warn/error/debug emit bounded text. Nested calls enforce normal tool policy and approvals. Tool failures are catchable; inspect possible effects before retrying. Nested results are intact or throw resource errors. Cell reply inbox: ${Math.min(config.memoryLimitBytes, config.maxSnapshotBytes)} bytes; consume replies or paginate if full. Output/value/errors share ${maxOutputBytes} bytes across waits. Other truncation reports original JSON prefixes/omitted bytes; rerun with narrower args. Output is incremental; changed cumulative summaries replace earlier ones. Node.js modules and \`require\`/\`import\` are NOT available; use tools for external actions.` + apiGuidance + mcpGuidance + swarmGuidance + nodesGuidance + skillsGuidance + " `code` is JavaScript, never a shell command; do not retry failed shell source." + (namespacePrompt ? `\n\n${namespacePrompt}` : "") + (catalogIndex ? `\n\n${catalogIndex}` : "");
}
function createCodeModeTools(ctx) {
	const runtimeRefresh = captureAgentPluginRuntimeRefresh();
	const config = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId);
	const resultBudget = resolveToolResultBudget(ctx.modelContextWindowTokens);
	return [markCodeModeControlTool({
		name: CODE_MODE_EXEC_TOOL_NAME,
		label: "exec",
		description: createCodeModeExecDescription(ctx, void 0, config),
		parameters: Type.Object({
			title: executionTitleSchema(),
			code: Type.String({ description: "Required JavaScript; no TypeScript annotations, Python, shell, `require`, or `import`. Use `return value`; a trailing expression yields `null`." }),
			restartSafe: Type.Optional(Type.Boolean({ description: "Do not set on a new exec. Set true only when OpenClaw explicitly requests replay after a gateway restart; never for write, edit, exec, or any mutation. True rejects unmarked or namespace surfaces." }))
		}),
		execute: async (toolCallId, args, signal, onUpdate) => {
			runtimeRefresh.assertCurrent();
			ctx.abortSignal?.throwIfAborted();
			const input = readCode(args);
			const executionContext = getAgentToolExecutionContext();
			let runtime;
			const result = normalizeCodeModeTimeoutResult(await runCodeModeExec({
				toolCallId,
				ctx,
				config,
				resultBudget,
				code: input.code,
				assistantTurnId: executionContext?.assistantMessage.responseId?.trim() || executionContext?.assistantMessage.turnId?.trim(),
				restartSafe: ctx.forceRestartSafeTools === true || input.restartSafe,
				signal,
				onUpdate,
				onRuntime: (value) => {
					runtime = value;
				}
			}));
			markCodeModePermissionChangeResult(result, signal);
			return {
				...formatToolSearchControlResult(result, runtime, {
					terminalBatchStatus: result.status,
					compact: true
				}),
				...runtimeRefresh.isRequested() ? { terminate: runtimeRefresh.isPending() } : {}
			};
		}
	}), markCodeModeControlTool({
		name: CODE_MODE_WAIT_TOOL_NAME,
		label: "wait",
		hideFromChannelProgress: true,
		description: "Resume only when the outer exec result has status \"waiting\", using its top-level runId. A completed exec may return a still-running tool operation inside value; manage that operation through its enabled tool in a new exec. Never pass a nested sessionId or process ID to wait.",
		parameters: Type.Object({ runId: Type.String({ description: "Top-level runId from an exec result with status \"waiting\", never a nested tool sessionId." }) }),
		execute: async (toolCallId, args, signal, onUpdate) => {
			runtimeRefresh.assertActive();
			ctx.abortSignal?.throwIfAborted();
			let runtime;
			const result = normalizeCodeModeTimeoutResult(await runWait({
				toolCallId,
				ctx,
				runId: readRunId(args),
				signal,
				onUpdate,
				onRuntime: (value) => {
					runtime = value;
				}
			}));
			markCodeModePermissionChangeResult(result, signal);
			return {
				...formatToolSearchControlResult(result, runtime, {
					terminalBatchStatus: result.status,
					compact: true
				}),
				...runtimeRefresh.isRequested() ? { terminate: runtimeRefresh.isPending() } : {}
			};
		}
	})];
}
/** Compact normal tools behind Code Mode exec/wait controls. */
function applyCodeModeCatalog(params) {
	const tools = finalizeAgentToolAvailability(params.tools, { toolExecutionAllow: params.toolExecutionAllow }).filter((tool) => isCodeModeControlTool(tool) || tool.name !== "tool_search_code" && tool.name !== "tool_search" && tool.name !== "tool_describe" && tool.name !== "tool_call");
	const directToolNames = new Set(params.directToolNames);
	const compacted = applyToolCatalogCompaction({
		...params,
		tools,
		enabled: true,
		isVisibleControlTool: isCodeModeControlTool,
		isVisibleCatalogTool: (tool) => directToolNames.has(tool.name) && isDirectVisibleCatalogTool(tool, directToolNames),
		shouldCatalogTool: (tool) => !isCodeModeControlTool(tool)
	});
	const catalogRef = params.catalogRef;
	const execTool = compacted.tools.find((tool) => tool.name === CODE_MODE_EXEC_TOOL_NAME);
	if (catalogRef?.current && execTool) {
		catalogRef.disposeObserver?.();
		const descriptionUpdater = createCodeModeExecDescriptionUpdater(execTool);
		catalogRef.disposeObserver = descriptionUpdater.dispose;
		catalogRef.onChange = () => {
			descriptionUpdater.update(createCodeModeExecDescription({
				...params,
				runtimeConfig: params.config
			}, catalogRef.current?.entries));
		};
		catalogRef.onChange();
	}
	return compacted;
}
/** Move client-side tool definitions into the active Code Mode catalog. */
function addClientToolsToCodeModeCatalog(params) {
	return addClientToolsToToolCatalog({
		...params,
		enabled: true
	});
}
//#endregion
//#region src/agents/tool-search-runtime-config.ts
function resolveAgentToolSearchRuntimeConfig(params) {
	const runtimeConfig = resolveAgentRuntimeToolConfig(params.config);
	if (params.completionPrivateMessageOnly) return runtimeConfig;
	if (runtimeConfig?.tools?.toolSearch !== void 0 || params.model?.toolSearchMode !== "tools" && !isLocalModelLeanEnabled({
		...params,
		config: runtimeConfig
	})) return runtimeConfig;
	return {
		...runtimeConfig,
		tools: {
			...runtimeConfig?.tools,
			toolSearch: {
				enabled: true,
				mode: "tools",
				searchDefaultLimit: 5,
				maxSearchLimit: 10
			}
		}
	};
}
//#endregion
//#region src/agents/tool-surface-plan.ts
function resolveAgentToolSurfacePlan(params) {
	const restrictions = params.toolsAllow ? readToolAllowlistIntersection(params.toolsAllow) ?? [params.toolsAllow] : [];
	const completionPrivateMessageOnly = params.forceDirectMessageTool && restrictions.some((allow) => allow.length === 1 && normalizeToolPolicyName(allow[0] ?? "") === "message");
	const codeModeConfig = resolveCodeModeConfig(params.config, params.agentId, params.modelProvider && params.modelId ? {
		provider: params.modelProvider,
		modelId: params.modelId
	} : void 0);
	codeModeConfig.enabled = params.codeModeOverride ?? codeModeConfig.enabled;
	const selectedToolConfig = resolveAgentToolSearchRuntimeConfig({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		completionPrivateMessageOnly,
		model: params.model
	});
	const toolSearchRuntimeConfig = params.disableToolSearch ? {
		...selectedToolConfig,
		tools: {
			...selectedToolConfig?.tools,
			toolSearch: false
		}
	} : selectedToolConfig;
	const toolSearchConfig = resolveToolSearchConfig(toolSearchRuntimeConfig);
	const toolsAvailable = params.toolsEnabled && getActiveAgentRingZeroTools().length === 0 && params.disableTools !== true && !params.isRawModelRun && restrictions.every((allow) => allow.length > 0) && !completionPrivateMessageOnly;
	const codeModeControlsEnabled = toolsAvailable && (params.forceCodeModeControls === true || isCodeModeEngagedForModel(codeModeConfig, params.model));
	return {
		codeModeControlsEnabled,
		toolSearchControlsEnabled: toolsAvailable && !codeModeControlsEnabled && toolSearchConfig.enabled,
		toolSearchConfig,
		toolSearchRuntimeConfig
	};
}
function applyAgentToolSurfaceCatalog({ codeModeControlsEnabled, toolSearchConfig, toolSearchRuntimeConfig, forceDirectMessageTool, ...catalogParams }) {
	const directToolNames = forceDirectMessageTool ? ["message"] : [];
	if (codeModeControlsEnabled) return applyCodeModeCatalog({
		...catalogParams,
		config: catalogParams.config,
		directToolNames
	});
	return (toolSearchConfig.mode === "directory" ? applyToolSchemaDirectoryCatalog : applyToolSearchCatalog)({
		...catalogParams,
		config: toolSearchRuntimeConfig,
		directToolNames
	});
}
//#endregion
//#region src/agents/harness/tool-surface-bridge.ts
const CODE_MODE_CONTROL_ALLOWLIST_NAMES = [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME];
function createAgentHarnessToolSurfaceRuntimeCore(params) {
	const forceDirectMessageTool = messageToolOwnsVisibleReply(params);
	const plan = resolveAgentToolSurfacePlan({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		forceDirectMessageTool,
		model: params.model,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		codeModeOverride: params.codeModeOverride,
		disableToolSearch: params.disableToolSearch,
		toolsEnabled: params.modelToolsEnabled,
		disableTools: params.disableTools,
		isRawModelRun: params.isRawModelRun === true,
		toolsAllow: params.toolsAllow,
		forceCodeModeControls: params.forceCodeModeControls
	});
	if (params.supportsDeferredToolCalls === false && plan.toolSearchConfig.mode === "directory") {
		plan.toolSearchConfig = {
			...plan.toolSearchConfig,
			mode: "tools"
		};
		plan.toolSearchRuntimeConfig = {
			...plan.toolSearchRuntimeConfig,
			tools: {
				...plan.toolSearchRuntimeConfig?.tools,
				toolSearch: plan.toolSearchConfig
			}
		};
	}
	const { codeModeControlsEnabled, toolSearchControlsEnabled, toolSearchConfig, toolSearchRuntimeConfig } = plan;
	const toolSearchCatalogRef = toolSearchControlsEnabled || codeModeControlsEnabled ? createToolSearchCatalogRef() : void 0;
	const runtimeToolAllowlist = mergeForcedEmbeddedAttemptToolsAllow(params.runtimeToolAllowlist, { forceToolNames: [...toolSearchControlsEnabled ? TOOL_SEARCH_CONTROL_TOOL_NAMES : [], ...codeModeControlsEnabled ? CODE_MODE_CONTROL_ALLOWLIST_NAMES : []] });
	const toolSearchCatalogExecutor = toolSearchControlsEnabled || codeModeControlsEnabled ? params.executeTool : void 0;
	let runtimePreserveToolNames;
	const preserveRuntimeTools = () => runtimePreserveToolNames ??= resolveLocalModelLeanPreserveToolNames({
		toolNames: resolveConversationCapabilityProfile({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			modelProvider: params.modelProvider,
			modelId: params.modelId,
			runtimeToolAllowlist,
			scheduledToolPolicy: params.scheduledToolPolicy
		}).policy.explicitToolOverrideAllowlist,
		forceMessageTool: params.forceMessageTool,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
	});
	const compactTools = (tools, options = {}) => {
		const prepared = options.prepared;
		const preserveToolNames = prepared?.preserveToolNames ?? (options.localModelLeanApplied ? void 0 : preserveRuntimeTools());
		const projectedUncompactedTools = prepared || options.localModelLeanApplied ? tools : filterLocalModelLeanTools({
			tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preserveToolNames
		});
		let effectiveTools = prepared ? projectedUncompactedTools : filterRuntimeCompatibleTools(projectedUncompactedTools).tools;
		const compacted = applyAgentToolSurfaceCatalog({
			tools: [...codeModeControlsEnabled ? createCodeModeTools({
				config: params.config,
				runtimeConfig: params.config,
				modelContextWindowTokens: params.contextTokenBudget ?? params.model?.contextWindow,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				runId: params.runId,
				catalogRef: toolSearchCatalogRef,
				abortSignal: prepared?.abortSignal ?? params.abortSignal,
				executeTool: prepared?.executeTool ?? params.executeTool,
				forceRestartSafeTools: prepared?.forceRestartSafeTools,
				toolExecutionAllow: prepared?.toolExecutionAllow,
				codeModeSkills: prepared?.codeModeSkills
			}) : [], ...effectiveTools],
			config: params.config,
			toolSearchRuntimeConfig,
			codeModeControlsEnabled,
			toolSearchConfig,
			forceDirectMessageTool,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			toolHookContext: options.hookContext,
			toolExecutionAllow: prepared?.toolExecutionAllow,
			codeModeSkills: prepared?.codeModeSkills
		});
		const projectedCompactedTools = !prepared && options.localModelLeanApplied ? compacted.tools : filterLocalModelLeanTools({
			tools: compacted.tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: prepared ? void 0 : params.sessionKey,
			preserveToolNames
		});
		const schemaProjection = filterRuntimeCompatibleTools(projectedCompactedTools);
		effectiveTools = schemaProjection.tools;
		if (!compacted.catalogRegistered) finalizeAgentToolAvailability(effectiveTools, { toolExecutionAllow: prepared?.toolExecutionAllow });
		return {
			tools: effectiveTools,
			catalog: compacted,
			projectedTools: projectedCompactedTools,
			diagnostics: schemaProjection.diagnostics,
			promptToolPolicy: createAgentHarnessPromptToolPolicy({
				tools: effectiveTools,
				catalogRef: toolSearchCatalogRef,
				codeModeControlsEnabled,
				toolSearchPrompt: toolSearchControlsEnabled ? {
					config: toolSearchRuntimeConfig,
					contextTokenBudget: params.contextTokenBudget ?? params.model?.contextWindow
				} : void 0
			})
		};
	};
	return {
		plan,
		codeModeControlsEnabled,
		compactTools,
		config: toolSearchControlsEnabled ? toolSearchRuntimeConfig : params.config,
		includeToolSearchControls: toolSearchControlsEnabled,
		runtimeToolAllowlist,
		toolSearchCatalogRef,
		toolSearchControlsEnabled,
		cleanup: () => {
			clearToolSearchCatalog({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				runId: params.runId,
				catalogRef: toolSearchCatalogRef
			});
		},
		toolSearchCatalogExecutor
	};
}
//#endregion
export { runCodeModeScriptHeadless as a, createHeadlessDeadlineScope as i, addClientToolsToCodeModeCatalog as n, createAgentHarnessPromptToolPolicy as o, createCodeModePermissionChangeReason as r, createAgentHarnessToolSurfaceRuntimeCore as t };
