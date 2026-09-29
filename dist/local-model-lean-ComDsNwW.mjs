import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as generateSecureHex } from "./secure-random-BJtJxP9Y.mjs";
import { Q as finalizeToolTerminalPresentation, a as isPreExecutionBlockedToolResult, d as captureAgentPluginRuntimeRefresh, l as rewrapToolWithBeforeToolCallHook, p as runWithToolExecutionValidation, r as getBeforeToolCallFailureDisposition, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { c as renderToolSearchControlText, l as serializeToolSearchControlResult } from "./code-mode-json-Cek5lI0P.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { t as asToolParamsRecord } from "./common-XfKigJno.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { S as resolveAgentToolExecutionSchema, c as getChannelAgentToolMeta, f as getBeforeToolCallDiagnosticOptions, h as isToolWrappedWithBeforeToolCallHook, y as finalizeAgentToolAvailability } from "./agent-tool-metadata-COcr-3AD.mjs";
import { l as copyInternalToolResultState } from "./internal-hooks-DUPhyX-W.mjs";
import { a as protectNetworkToolExecutionError, i as isTrustedToolExecutionPreflightError, r as isToolResultError, u as resolveToolResultFailureKind } from "./tool-result-error-CWadvCKd.mjs";
import { o as transferMcpCodeModeGuestResult, s as toToolSearchJsonSafe } from "./mcp-content-BHUhnILn.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { a as compactToolOutputHint, c as disposeCodeModeResults, i as compactToolInputHint, n as markToolContractFailure } from "./tool-contract-error-CR9KN-gT.mjs";
import { t as isCoreCodingSurfaceToolName } from "./core-tool-factory-descriptors-CGmz8OlS.mjs";
import { t as resolveNodeRuntimeExecutable } from "./node-runtime-executable-wWK_i2EJ.mjs";
import { n as appendBoundedTextTail, t as SESSION_TOOL_STDERR_TAIL_BYTES } from "./limits-NtpvYfbS.mjs";
import { i as selectToolOutputSchema, r as readToolOutputSchemaVariants, t as captureToolOutputSelection } from "./tool-output-schema-DALtkl0-.mjs";
import { n as bindJoinedCollectorInvocation } from "./swarm-collector-capability-BUvTLaKn.mjs";
import { r as isAgentToolReplaySafe } from "./tool-replay-safety-v7miLTIv.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-5ose6ySZ.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-XpBChpaV.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import os from "node:os";
import { Buffer } from "node:buffer";
import { Guard } from "typebox/guard";
import { Type } from "typebox";
//#region src/agents/tool-search-scheduling.ts
const schedules = /* @__PURE__ */ new WeakMap();
const executionScope = new AsyncLocalStorage();
/** Observer cancellation must not release a slot still owned by implementation work. */
function retainToolSearchImplementation(implementation) {
	const scope = executionScope.getStore();
	if (scope?.active) scope.settlement = Promise.allSettled([scope.settlement, implementation]).then(() => void 0);
	return implementation;
}
function createSchedule(owner) {
	const schedule = {
		queue: [],
		active: 0,
		exclusive: false,
		closed: new AbortController()
	};
	schedules.set(owner, schedule);
	return schedule;
}
/** Catalog teardown owns cancellation without retaining another run listener. */
function disposeToolSearchSchedule(owner) {
	const schedule = schedules.get(owner);
	if (!schedule) return;
	schedules.delete(owner);
	schedule.closed.abort(createAbortError("Tool Search catalog was closed."));
}
function drainSchedule(schedule) {
	while (!schedule.closed.signal.aborted && !schedule.exclusive) {
		const next = schedule.queue[0];
		if (!next || next.exclusive && schedule.active > 0) return;
		schedule.queue.shift();
		next.started = true;
		schedule.active += 1;
		schedule.exclusive = next.exclusive;
		next.ready.resolve();
	}
}
async function runScheduledToolSearchCall(params) {
	const owner = params.ctx.catalogRef;
	if (!owner?.current) throw new ToolInputError("Tool Search catalog is unavailable for this run.");
	const schedule = schedules.get(owner) ?? createSchedule(owner);
	const mode = params.entry.tool.executionMode;
	const exclusive = mode === "sequential";
	const parent = executionScope.getStore();
	let ancestor = parent;
	while (ancestor && (!ancestor.active || ancestor.schedule !== schedule)) ancestor = ancestor.parent;
	if (ancestor && (ancestor.exclusive || exclusive || schedule.queue.some((entry) => entry.exclusive))) throw new ToolInputError("Reentrant tool call would wait on its own catalog execution.");
	const admission = {
		ready: createDeferredCore(),
		exclusive,
		started: false
	};
	schedule.queue.push(admission);
	drainSchedule(schedule);
	const signals = [schedule.closed.signal];
	if (params.ctx.abortSignal) signals.push(params.ctx.abortSignal);
	if (params.signal) signals.push(params.signal);
	const signal = AbortSignal.any(signals);
	const scope = {
		schedule,
		exclusive,
		active: false,
		parent
	};
	try {
		await racePromiseWithAbortSignal(admission.ready.promise, signal);
		signal.throwIfAborted();
		const current = owner.current?.entries.find((entry) => entry.id === params.entry.id);
		if (!current || current.tool !== params.entry.tool || current.tool.executionMode !== mode) throw new ToolInputError("Queued tool changed or is no longer available in this run.");
		scope.active = true;
		return await executionScope.run(scope, () => params.execute(current, signal));
	} finally {
		const release = () => {
			scope.active = false;
			if (admission.started) {
				schedule.active -= 1;
				if (exclusive) schedule.exclusive = false;
			} else schedule.queue.splice(schedule.queue.indexOf(admission), 1);
			drainSchedule(schedule);
			if (schedule.active === 0 && schedule.queue.length === 0 && schedules.get(owner) === schedule) schedules.delete(owner);
		};
		if (scope.settlement) scope.settlement.then(release);
		else release();
	}
}
//#endregion
//#region src/agents/tool-search-types.ts
const TOOL_SEARCH_CODE_MODE_TOOL_NAME = "tool_search_code";
const TOOL_SEARCH_RAW_TOOL_NAME = "tool_search";
const TOOL_DESCRIBE_RAW_TOOL_NAME = "tool_describe";
const TOOL_CALL_RAW_TOOL_NAME = "tool_call";
const MAX_TOOL_SEARCH_BATCH_RESPONSE_CHARS = 4e3;
const TOOL_SEARCH_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
	TOOL_SEARCH_CODE_MODE_TOOL_NAME,
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
]);
const TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
]);
//#endregion
//#region src/agents/tool-search-catalog.ts
const catalogMetadata = /* @__PURE__ */ new WeakMap();
const untrustedSchemaIdentities = /* @__PURE__ */ new WeakMap();
let nextUntrustedSchemaIdentity = 1;
function catalogEntriesFingerprint(entries) {
	return entries.map((entry) => stableStringify([
		entry.id,
		entry.source,
		entry.sourceName ?? "",
		entry.mcp,
		entry.name,
		entry.label ?? "",
		entry.description,
		entry.directVisible === true,
		entry.source === "openclaw" ? stableStringify(entry.parameters) : untrustedSchemaFingerprint(entry.parameters),
		entry.source === "openclaw" ? stableStringify(entry.outputSchema) : untrustedSchemaFingerprint(entry.outputSchema)
	])).toSorted().join("\n");
}
function untrustedSchemaFingerprint(schema) {
	if (schema === null || typeof schema !== "object") return stableStringify(schema);
	const existing = untrustedSchemaIdentities.get(schema);
	if (existing !== void 0) return `object:${existing}`;
	const next = nextUntrustedSchemaIdentity++;
	untrustedSchemaIdentities.set(schema, next);
	return `object:${next}`;
}
function rebindCatalogExecutors(existingEntries, currentEntries) {
	const currentTools = new Map(currentEntries.map((entry) => [entry.id, entry.tool]));
	if (currentTools.size !== currentEntries.length || currentTools.size !== existingEntries.length) return;
	const rebound = existingEntries.every((entry) => entry.tool && currentTools.get(entry.id) === entry.tool) ? existingEntries : existingEntries.map((entry) => {
		const tool = currentTools.get(entry.id);
		return tool ? {
			...entry,
			tool
		} : void 0;
	});
	return rebound.every((entry) => entry !== void 0) ? rebound : void 0;
}
function generateCounterScope() {
	return generateSecureHex(12);
}
function classifyTool(tool) {
	const meta = getPluginToolMeta(tool);
	const pluginId = meta?.pluginId?.trim();
	const mcp = meta?.mcp;
	if (mcp) return {
		source: "mcp",
		sourceName: mcp.safeServerName || pluginId || "mcp",
		mcp
	};
	if (pluginId === "bundle-mcp") return {
		source: "mcp",
		sourceName: pluginId
	};
	if (pluginId) return {
		source: "openclaw",
		sourceName: pluginId
	};
	return {
		source: "openclaw",
		sourceName: "core"
	};
}
function makeCatalogId(tool, source, sourceName) {
	return `${source}:${sourceName?.trim() || "core"}:${tool.name}`;
}
function wrapCatalogTool(tool, hookContext) {
	if (!hookContext || isToolWrappedWithBeforeToolCallHook(tool)) return tool;
	return wrapToolWithBeforeToolCallHook(tool, hookContext);
}
function prepareToolSearchCatalogExecutionTool(entry, options) {
	const prepareInput = options.prepareInput && entry.source === "openclaw" && "prepareBeforeToolCallParams" in entry.tool && typeof entry.tool.prepareBeforeToolCallParams === "function";
	const validateInput = options.validateInput && entry.source === "openclaw";
	if (!prepareInput && !validateInput) return entry.tool;
	const tool = entry.tool;
	const wrapperOptions = options.prepareInput ? { protectNetworkErrors: false } : void 0;
	if (!isToolWrappedWithBeforeToolCallHook(tool)) return wrapToolWithBeforeToolCallHook(tool, void 0, wrapperOptions);
	if (!wrapperOptions || getBeforeToolCallDiagnosticOptions(tool)?.protectNetworkErrors === false) return entry.tool;
	return rewrapToolWithBeforeToolCallHook(tool, void 0, wrapperOptions);
}
function toCatalogEntry(tool, sourceOverride, hookContext) {
	const classified = classifyTool(tool);
	const source = sourceOverride ?? classified.source;
	const sourceName = sourceOverride === "client" ? "client" : classified.sourceName;
	const catalogTool = source === "client" ? tool : wrapCatalogTool(tool, hookContext);
	return {
		id: makeCatalogId(tool, source, sourceName),
		source,
		sourceName,
		...source === "mcp" && classified.mcp ? { mcp: classified.mcp } : {},
		name: tool.name,
		label: tool.label,
		description: tool.description ?? "",
		parameters: tool.parameters,
		...source === "openclaw" && tool.outputSchema ? { outputSchema: tool.outputSchema } : {},
		tool: catalogTool
	};
}
function shouldCatalogTool(tool) {
	return !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) && tool.catalogMode !== "direct-only";
}
/**
* Core file/shell primitives and caller-required names (e.g. message when it is
* the only reply path) stay visible while remaining searchable. Both must
* resolve to trusted OpenClaw tools: an MCP lookalike must never become a
* direct delivery or core-coding tool.
*/
function isDirectVisibleCatalogTool(tool, directToolNames) {
	const classified = classifyTool(tool);
	return classified.source === "openclaw" && (directToolNames.has(tool.name) || isCoreCodingSurfaceToolName(tool.name) && classified.sourceName === "core");
}
function registerHeadlessToolSearchCatalog(params) {
	const { catalogRef, tools, hookContext } = params;
	registerToolSearchCatalog({
		catalogRef,
		entries: tools.filter((tool) => shouldCatalogTool(tool)).map((tool) => {
			return toCatalogEntry(hookContext && isToolWrappedWithBeforeToolCallHook(tool) ? rewrapToolWithBeforeToolCallHook(tool, hookContext) : tool, void 0, hookContext);
		})
	});
}
function collectUniqueCatalogToolNames(tools) {
	const nameCounts = /* @__PURE__ */ new Map();
	for (const tool of tools) if (shouldCatalogTool(tool)) nameCounts.set(tool.name, (nameCounts.get(tool.name) ?? 0) + 1);
	return new Set(Array.from(nameCounts).filter(([, count]) => count === 1).map(([name]) => name));
}
function finalizeCatalogAvailability(entries, toolExecutionAllow) {
	const orderedEntries = entries.toSorted((a, b) => a.id.localeCompare(b.id));
	const tools = orderedEntries.toSorted((a, b) => Number(a.source === "client") - Number(b.source === "client")).map((entry) => entry.tool);
	finalizeAgentToolAvailability(tools, { toolExecutionAllow });
	orderedEntries.forEach((entry, index) => {
		if (entry.parameters !== entry.tool.parameters || entry.description !== entry.tool.description) orderedEntries[index] = {
			...entry,
			parameters: entry.tool.parameters,
			description: entry.tool.description ?? ""
		};
	});
	return orderedEntries;
}
function registerToolSearchCatalog(params) {
	const prior = params.append ? params.catalogRef.current : void 0;
	const toolExecutionAllow = prior ? catalogMetadata.get(prior)?.toolExecutionAllow : params.toolExecutionAllow;
	const byId = new Map((prior?.entries ?? []).map((entry) => [entry.id, entry]));
	for (const entry of params.entries) byId.set(entry.id, entry);
	const next = {
		entries: finalizeCatalogAvailability(Array.from(byId.values()), toolExecutionAllow),
		counterScope: prior?.counterScope ?? generateCounterScope(),
		searchCount: prior?.searchCount ?? 0,
		describeCount: prior?.describeCount ?? 0,
		callCount: prior?.callCount ?? 0
	};
	catalogMetadata.set(next, {
		fingerprint: catalogEntriesFingerprint(next.entries),
		toolExecutionAllow
	});
	params.catalogRef.current = next;
	if (!prior) disposeCodeModeResults(params.catalogRef);
	delete params.catalogRef.closedTelemetry;
	params.catalogRef.onChange?.();
}
function clearToolSearchCatalog(params) {
	if (params.catalogRef) {
		if (params.catalogRef.current) {
			params.catalogRef.closedTelemetry = getTelemetry(params.catalogRef.current);
			finalizeAgentToolAvailability(params.catalogRef.current.entries.map((entry) => entry.tool), { toolExecutionAllow: [] });
		}
		params.catalogRef.current = void 0;
		disposeCodeModeResults(params.catalogRef);
		disposeToolSearchSchedule(params.catalogRef);
		params.catalogRef.disposeObserver?.();
		params.catalogRef.onDispose?.forEach((dispose) => dispose());
		delete params.catalogRef.onChange;
		delete params.catalogRef.disposeObserver;
		delete params.catalogRef.onDispose;
	}
}
/** Restricts a run-scoped catalog to an already-resolved set of concrete tool names. */
function restrictToolSearchCatalog(params) {
	const owner = params.catalogRef;
	const current = owner?.current;
	if (!owner || !current) return 0;
	const metadata = catalogMetadata.get(current);
	const entries = finalizeCatalogAvailability((params.baselineEntries ?? current.entries).filter((entry) => params.allowedToolNames.has(entry.name)), metadata?.toolExecutionAllow);
	if (entries.length === current.entries.length && entries.every((entry, index) => entry === current.entries[index])) return entries.length;
	current.entries = entries;
	disposeCodeModeResults(owner);
	catalogMetadata.set(current, {
		...metadata,
		fingerprint: catalogEntriesFingerprint(current.entries)
	});
	params.catalogRef?.onChange?.();
	return entries.length;
}
function resolveCatalog(ctx) {
	const catalog = ctx.catalogRef?.current;
	if (!catalog) throw new ToolInputError("Tool Search catalog is unavailable for this run.");
	return catalog;
}
function getTelemetry(catalog) {
	const sources = {
		openclaw: 0,
		mcp: 0,
		client: 0
	};
	for (const entry of catalog.entries) sources[entry.source] += 1;
	return {
		catalogSize: catalog.entries.length,
		sources,
		counterScope: catalog.counterScope,
		searchCount: catalog.searchCount,
		describeCount: catalog.describeCount,
		callCount: catalog.callCount
	};
}
function readToolSearchCatalogTelemetry(ctx) {
	const closed = ctx.catalogRef?.closedTelemetry;
	if (!ctx.catalogRef?.current && closed) return {
		...closed,
		sources: { ...closed.sources }
	};
	return getTelemetry(resolveCatalog(ctx));
}
function visibleCatalogEntries(catalog, options) {
	const { includeMcp, allowedIds } = options ?? {};
	if (includeMcp !== false && !allowedIds) return catalog.entries;
	return catalog.entries.filter((entry) => (includeMcp !== false || entry.source !== "mcp") && (!allowedIds || allowedIds.has(entry.id)));
}
function compactToolSearchCatalogEntry(entry) {
	const output = entry.source === "openclaw" ? compactToolOutputHint(entry.outputSchema) : void 0;
	const mcp = entry.mcp ? {
		serverName: entry.mcp.serverName,
		safeServerName: entry.mcp.safeServerName,
		toolName: entry.mcp.toolName,
		operation: entry.mcp.operation
	} : void 0;
	return {
		id: entry.id,
		source: entry.source,
		sourceName: entry.sourceName,
		...mcp ? { mcp } : {},
		name: entry.name,
		label: entry.label,
		description: entry.description,
		input: entry.source === "openclaw" ? compactToolInputHint(entry.parameters) : "unknown",
		...output ? { output } : {}
	};
}
function createToolSearchCatalogRef() {
	return {};
}
function applyToolCatalogCompaction(params) {
	if (!params.enabled) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const hasControlTool = params.tools.some((tool) => params.isVisibleControlTool(tool));
	const catalogRef = params.catalogRef;
	if (!hasControlTool || !catalogRef) return {
		tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const visible = [];
	let catalog = [];
	const shouldCatalog = (tool) => shouldCatalogTool(tool) && (params.shouldCatalogTool?.(tool) ?? true);
	for (const tool of params.tools) {
		if (params.isVisibleControlTool(tool)) {
			visible.push(tool);
			continue;
		}
		if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) continue;
		if (shouldCatalog(tool)) {
			const directVisible = params.isVisibleCatalogTool?.(tool) === true;
			catalog.push({
				...toCatalogEntry(tool, void 0, params.toolHookContext),
				directVisible
			});
			if (!directVisible) continue;
		}
		visible.push(tool);
	}
	catalog = finalizeCatalogAvailability(catalog, params.toolExecutionAllow);
	const existingCatalog = catalogRef.current;
	const incomingFingerprint = existingCatalog ? catalogEntriesFingerprint(catalog) : void 0;
	const metadata = existingCatalog && catalogMetadata.get(existingCatalog);
	const reboundEntries = existingCatalog && metadata && metadata.fingerprint === incomingFingerprint && stableStringify(metadata.toolExecutionAllow) === stableStringify(params.toolExecutionAllow) ? rebindCatalogExecutors(existingCatalog.entries, catalog) : void 0;
	if (existingCatalog && reboundEntries) existingCatalog.entries = reboundEntries;
	else registerToolSearchCatalog({
		catalogRef,
		entries: catalog,
		toolExecutionAllow: params.toolExecutionAllow
	});
	return {
		tools: visible,
		compacted: catalog.length > 0,
		catalogToolCount: catalog.length,
		catalogRegistered: true,
		catalogReused: reboundEntries !== void 0
	};
}
function addClientToolsToToolCatalog(params) {
	const catalogRef = params.catalogRef;
	if (!params.enabled || !catalogRef?.current || params.tools.length === 0) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0
	};
	registerToolSearchCatalog({
		catalogRef,
		entries: params.tools.map((tool) => toCatalogEntry(tool, "client")),
		append: true
	});
	return {
		tools: [],
		compacted: params.tools.length > 0,
		catalogToolCount: params.tools.length
	};
}
//#endregion
//#region src/agents/tool-search-code-mode-child.ts
const TOOL_SEARCH_CODE_MODE_CHILD_SOURCE = String.raw`
import vm from "node:vm";

let activeController;

function send(message) {
  if (typeof process.send === "function" && process.connected) {
    process.send(message);
  }
}

function sendAndFlush(message) {
  return new Promise((resolve) => {
    if (typeof process.send !== "function" || !process.connected) {
      resolve();
      return;
    }
    try {
      process.send(message, () => resolve());
    } catch {
      resolve();
    }
  });
}

function toJsonSafe(value) {
  if (value === undefined) {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    if (value instanceof Error) {
      return value.message;
    }
    if (value === null) {
      return null;
    }
    switch (typeof value) {
      case "string":
        return value;
      case "number":
      case "boolean":
      case "bigint":
      case "symbol":
      case "function":
        return String(value);
      default:
        return Object.prototype.toString.call(value);
    }
  }
}

function formatLogItem(value) {
  if (typeof value === "string") {
    return value;
  }
  const safe = toJsonSafe(value);
  return typeof safe === "string" ? safe : JSON.stringify(safe);
}

function bridgeResultPayload(message) {
  if (!message.ok) {
    return typeof message.error === "string" ? message.error : "tool bridge failed";
  }
  // IPC already normalized the value; keep the string boundary into the guest.
  const json = JSON.stringify(message.value);
  return typeof json === "string" ? json : "null";
}

function settleBridge(message) {
  if (!activeController) {
    return;
  }
  const id = typeof message?.id === "string" ? message.id : "";
  try {
    activeController.settleBridge(id, Boolean(message.ok), bridgeResultPayload(message));
  } catch (error) {
    send({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function buildModelScriptSource(code) {
  return "(async (openclaw, console) => {\n" + code + "\n})(openclaw, console)";
}

function buildControllerSource() {
  // The controller returns promise-like bridge handles. The model code can await
  // them naturally, while the parent process serializes real tool calls.
  return (
    '"use strict";\n' +
    "(() => {\n" +
    "const pending = new Map();\n" +
    "const bridgeMessages = [];\n" +
    "const logs = [];\n" +
    "let idleWaiters = [];\n" +
    "let nextBridgeId = 1;\n" +
    toJsonSafe.toString() +
    "\n" +
    formatLogItem.toString() +
    "\n" +
    "function notifyBridgeIdle() {\n" +
    "  if (pending.size !== 0 || bridgeMessages.length !== 0) return;\n" +
    "  const waiters = idleWaiters;\n" +
    "  idleWaiters = [];\n" +
    "  for (const resolve of waiters) resolve();\n" +
    "}\n" +
    "function isBridgeIdle() {\n" +
    "  return pending.size === 0 && bridgeMessages.length === 0;\n" +
    "}\n" +
    "function waitForBridgeIdle() {\n" +
    "  if (isBridgeIdle()) return Promise.resolve();\n" +
    "  return new Promise((resolve) => idleWaiters.push(resolve));\n" +
    "}\n" +
    "function bridge(method, args) {\n" +
    "  let promise;\n" +
    "  const start = () => {\n" +
    "    if (!promise) {\n" +
    "      const id = String(nextBridgeId++);\n" +
    "      promise = new Promise((resolve, reject) => {\n" +
    "        pending.set(id, { resolve, reject });\n" +
    "        bridgeMessages.push({ id, method, args: toJsonSafe(args) });\n" +
    "      });\n" +
    "    }\n" +
    "    return promise;\n" +
    "  };\n" +
    "  return Object.freeze({\n" +
    "    then: (resolve, reject) => start().then(resolve, reject),\n" +
    "    catch: (reject) => start().catch(reject),\n" +
    "    finally: (onFinally) => start().finally(onFinally),\n" +
    "  });\n" +
    "}\n" +
    "const console = Object.freeze({\n" +
    "  log: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  warn: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  error: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "});\n" +
    "const openclaw = Object.freeze({\n" +
    "  tools: Object.freeze({\n" +
    "    search: (query, options) => bridge('search', [query, options]),\n" +
    "    describe: (id) => bridge('describe', [id]),\n" +
    "    call: (id, input) => bridge('call', [id, input]),\n" +
    "  }),\n" +
    "});\n" +
    "return Object.freeze({\n" +
    "  openclaw,\n" +
    "  console,\n" +
    "  isBridgeIdle,\n" +
    "  waitForBridgeIdle,\n" +
    "  takeLogs: () => logs.splice(0),\n" +
    "  takeBridgeMessages: () => bridgeMessages.splice(0),\n" +
    "  settleBridge: (id, ok, payload) => {\n" +
    "    const waiter = pending.get(String(id));\n" +
    "    if (!waiter) return;\n" +
    "    pending.delete(String(id));\n" +
    "    if (ok) {\n" +
    "      waiter.resolve(JSON.parse(String(payload)));\n" +
    "    } else {\n" +
    "      waiter.reject(new Error(String(payload)));\n" +
    "    }\n" +
    "    Promise.resolve().then(notifyBridgeIdle);\n" +
    "  },\n" +
    "});\n" +
    "})()"
  );
}

function pumpController(controller) {
  for (const items of controller.takeLogs()) {
    send({ type: "log", items });
  }
  for (const message of controller.takeBridgeMessages()) {
    send({ type: "bridge", id: message.id, method: message.method, args: message.args });
  }
}

async function runModelCode(code, timeoutMs) {
  const sandbox = Object.create(null);
  const context = vm.createContext(sandbox, {
    name: "tool_search_code",
    codeGeneration: { strings: false, wasm: false },
  });
  const controllerScript = new vm.Script(buildControllerSource(), {
    filename: "tool_search_code:controller.js",
  });
  const controller = controllerScript.runInContext(context, {
    timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
    breakOnSigint: false,
  });
  Object.defineProperties(sandbox, {
    console: { value: controller.console, enumerable: true },
    openclaw: { value: controller.openclaw, enumerable: true },
  });
  activeController = controller;
  const pumpTimer = setInterval(() => pumpController(controller), 1);
  try {
    const modelScript = new vm.Script(buildModelScriptSource(code), {
      filename: "tool_search_code:model.js",
    });
    const result = await Promise.resolve(
      modelScript.runInContext(context, {
        timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
        breakOnSigint: false,
      }),
    ).then(
      (value) => ({ ok: true, value: toJsonSafe(value) }),
      (error) => ({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
    do {
      pumpController(controller);
      await controller.waitForBridgeIdle();
      pumpController(controller);
    } while (!controller.isBridgeIdle());
    pumpController(controller);
    await sendAndFlush(
      result.ok
        ? { type: "result", ok: true, value: result.value }
        : { type: "result", ok: false, error: result.error },
    );
  } finally {
    clearInterval(pumpTimer);
    activeController = undefined;
  }
}

process.on("message", (message) => {
  if (message?.type === "bridge-result") {
    settleBridge(message);
    return;
  }
  if (message?.type !== "run") {
    return;
  }
  const code = typeof message.code === "string" ? message.code : "";
  runModelCode(code, message.timeoutMs).catch((error) => {
    return sendAndFlush({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }).finally(() => {
    setTimeout(() => process.exit(0), 100);
  });
});
`;
//#endregion
//#region src/agents/tool-search-ranking.ts
/** Collects property names and descriptions from a JSON-Schema-shaped value. */
function readParameterText(parameters, depth = 0) {
	const parts = [];
	collectParameterText(parameters, depth, parts);
	return parts.join(" ");
}
function collectParameterText(parameters, depth, parts) {
	if (depth > 4 || !isRecord(parameters)) return;
	const description = parameters.description;
	if (typeof description === "string" && description) parts.push(description);
	const properties = parameters.properties;
	if (isRecord(properties)) for (const [name, child] of Object.entries(properties)) {
		if (name) parts.push(name);
		collectParameterText(child, depth + 1, parts);
	}
	const items = parameters.items;
	if (items !== void 0) collectParameterText(items, depth + 1, parts);
}
/** BM25 term-frequency saturation. Standard Okapi default. */
const BM25_K1 = 1.2;
/** BM25 length normalization. Standard Okapi default. */
const BM25_B = .75;
/**
* Terms carrying no discriminating signal in a tool catalog. IDF already damps
* these; dropping them keeps a query like "read a file and post it" from
* scoring on "a"/"it" when a tool description happens to repeat them.
*
* Capability verbs stay out of this list even when they look like filler:
* "get" names real operations ("get_weather"), and discarding it would reduce
* "get issue" to "issue" and let a shorter delete/update entry outrank it.
*/
const STOPWORDS = /* @__PURE__ */ new Set([
	"a",
	"an",
	"and",
	"are",
	"as",
	"at",
	"be",
	"but",
	"by",
	"can",
	"do",
	"for",
	"from",
	"had",
	"has",
	"have",
	"here",
	"how",
	"i",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"me",
	"my",
	"no",
	"not",
	"of",
	"on",
	"or",
	"our",
	"so",
	"that",
	"the",
	"their",
	"them",
	"then",
	"there",
	"these",
	"they",
	"this",
	"to",
	"up",
	"us",
	"was",
	"we",
	"were",
	"what",
	"when",
	"where",
	"which",
	"who",
	"why",
	"will",
	"with",
	"you",
	"your"
]);
/**
* Query vocabulary mapped to the capability words tool descriptions actually
* use. This bridges intent to wording ("look up the price" -> "search"), which
* pure lexical overlap cannot do.
*
* Values must stay generic capability terms. Never put plugin, vendor, or
* product names here: those break silently when a plugin is renamed, and a
* catalog is not required to contain any particular provider.
*/
const QUERY_EXPANSIONS = [
	{
		terms: [
			"look",
			"lookup",
			"google",
			"research"
		],
		add: [
			"search",
			"web",
			"find"
		]
	},
	{
		terms: [
			"current",
			"today",
			"latest",
			"now",
			"recent",
			"news",
			"price",
			"weather"
		],
		add: ["search", "web"]
	},
	{
		terms: [
			"url",
			"link",
			"page",
			"article",
			"site",
			"website"
		],
		add: [
			"fetch",
			"web",
			"browse"
		]
	},
	{
		terms: [
			"remember",
			"recall",
			"memory",
			"earlier",
			"previously",
			"discussed",
			"decided"
		],
		add: [
			"memory",
			"recall",
			"history"
		]
	},
	{
		terms: [
			"remind",
			"reminder",
			"later",
			"tomorrow",
			"daily",
			"weekly",
			"recurring"
		],
		add: [
			"schedule",
			"automations",
			"cron",
			"reminder"
		]
	},
	{
		terms: [
			"say",
			"tell",
			"reply",
			"respond",
			"answer"
		],
		add: ["message", "send"]
	},
	{
		terms: [
			"picture",
			"photo",
			"meme",
			"screenshot"
		],
		add: ["image"]
	},
	{
		terms: [
			"speak",
			"say",
			"voice"
		],
		add: ["audio", "speech"]
	},
	{
		terms: [
			"run",
			"execute",
			"command",
			"shell",
			"terminal"
		],
		add: ["exec", "process"]
	},
	{
		terms: [
			"directory",
			"folder",
			"path"
		],
		add: ["file", "list"]
	}
];
/**
* Light English suffix stripper. Not a full Porter stemmer: it exists so that
* "scheduling" reaches a tool described as "Schedule a recurring task", which
* exact-token matching misses entirely. Applied repeatedly so plural verb forms
* ("reminders" -> "reminder" -> "remind") collapse to one root.
*/
function stem(token) {
	let current = token;
	for (let pass = 0; pass < 3; pass += 1) {
		const next = stripOneSuffix(current);
		if (next === current) return current;
		current = next;
	}
	return current;
}
/**
* Words ending in `s` that are not plurals. Stripping it changes the meaning and
* collides with an unrelated root: "news" would become "new" and then literal-
* match every "Create a new ..." tool, outranking the search tool the query
* meant. Several are ordinary tool vocabulary here ("status", "canvas", "alias").
*/
const NON_PLURAL_S_WORDS = /* @__PURE__ */ new Set([
	"news",
	"status",
	"alias",
	"canvas",
	"focus",
	"bonus",
	"virus",
	"atlas",
	"lens",
	"axis",
	"basis",
	"analysis",
	"gas",
	"bus",
	"plus"
]);
/** Suffixes whose stripping can expose a consonant doubled only by inflection. */
const UNDOUBLING_SUFFIXES = /* @__PURE__ */ new Set([
	"ing",
	"ed",
	"er"
]);
/** Doubles that belong to the root ("call", "process", "off", "buzz"). */
const KEPT_DOUBLE_CONSONANTS = /* @__PURE__ */ new Set([
	"l",
	"s",
	"f",
	"z"
]);
/**
* "running" strips to "runn", which would never meet "run". English doubles the
* final consonant before these suffixes, so undo that — otherwise the stemmer
* makes common pairs (run/running, stop/stopping, log/logging) unreachable, a
* regression the old substring scorer did not have.
*/
function undoubleFinalConsonant(token) {
	const last = token.at(-1);
	if (!last || last !== token.at(-2) || KEPT_DOUBLE_CONSONANTS.has(last) || "aeiou".includes(last) || token.length <= 3) return token;
	return token.slice(0, -1);
}
function stripOneSuffix(token) {
	if (token.length <= 3 || NON_PLURAL_S_WORDS.has(token)) return token;
	for (const suffix of [
		"ies",
		"ing",
		"ed",
		"ly",
		"es",
		"er",
		"s",
		"e"
	]) {
		if (!token.endsWith(suffix) || token.length - suffix.length < 3) continue;
		if (suffix === "s" && token.endsWith("ss")) continue;
		if (suffix === "ies") return `${token.slice(0, -3)}y`;
		const stripped = token.slice(0, -suffix.length);
		return UNDOUBLING_SUFFIXES.has(suffix) ? undoubleFinalConsonant(stripped) : stripped;
	}
	return token;
}
/**
* Word parts inside a compound identifier, matched rather than split so an
* acronym stays whole. Splitting on case transitions cuts "URLs" into "UR"/"Ls"
* and makes the obvious query unable to reach the tool; the first alternative
* keeps a run of capitals together, including a trailing plural `s`.
*/
const WORD_PARTS = /\p{Lu}+s?(?![\p{Ll}])|\p{Lu}?\p{Ll}+|\p{N}+/gu;
/**
* Splits on anything that is not a word character, which keeps `_`-joined tool
* names addressable as whole tokens while still emitting their parts, including
* camelCase components that MCP catalogs commonly use.
*
* Unicode letters survive rather than being rejected: a catalog is allowed to
* name or describe tools in another script, and dropping those would make them
* permanently unreachable. What makes non-English queries fruitless in practice
* is that catalogs are written in English, which is why `tool_search` asks the
* model to query in English rather than this function refusing the input.
*/
function splitWords(input) {
	const words = [];
	for (const raw of input.split(/[^\p{L}\p{N}_]+/u)) {
		if (!raw) continue;
		words.push(raw.toLowerCase());
		const parts = [];
		for (const underscorePart of raw.split("_")) for (const casePart of underscorePart.match(WORD_PARTS) ?? []) parts.push(casePart.toLowerCase());
		if (parts.length < 2) continue;
		for (const part of parts) words.push(part);
	}
	return words;
}
/**
* Stems for one word. `-ies` is ambiguous — "policies" is "policy" but "cookies"
* is "cookie" — so both readings are emitted and whichever the catalog actually
* uses will match. Every other word has a single stem.
*/
function stemVariants(word) {
	if (word.length > 4 && word.endsWith("ies")) {
		const base = word.slice(0, -3);
		return [`${base}y`, stem(`${base}ie`)];
	}
	const stemmed = stem(word);
	return stemmed ? [stemmed] : [];
}
/** Indexable terms for one document, with stopwords dropped and roots collapsed. */
function tokenizeDocument(input) {
	return splitWords(input).filter((word) => !STOPWORDS.has(word)).flatMap(stemVariants);
}
/**
* Triggers are matched on a singularized word rather than the document stemmer.
* Full stemming collapses unrelated vocabulary — "news" becomes "new", so "open
* a new issue" would silently acquire a web-search intent — and an expansion
* that fires on the wrong word is worse than one that does not fire.
*/
function normalizeTrigger(word) {
	if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
	return word.length > 4 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
}
const NORMALIZED_EXPANSIONS = QUERY_EXPANSIONS.map((group) => ({
	triggers: group.terms.map(normalizeTrigger),
	add: group.add.map(stem)
}));
/**
* Weight for a term the caller did not write. Expansions are a hint about what
* the catalog might call this capability, so they must not let a merely related
* tool outscore one that matches the words actually typed.
*/
const EXPANSION_WEIGHT = .35;
/** Query terms: literal words at full weight, expansions discounted. */
function tokenizeQuery(input) {
	const words = splitWords(input).filter((word) => !STOPWORDS.has(word));
	const weights = /* @__PURE__ */ new Map();
	for (const term of words.flatMap(stemVariants)) weights.set(term, 1);
	const triggers = new Set(words.map(normalizeTrigger));
	for (const group of NORMALIZED_EXPANSIONS) {
		if (!group.triggers.some((trigger) => triggers.has(trigger))) continue;
		for (const addition of group.add) weights.set(addition, Math.max(weights.get(addition) ?? 0, EXPANSION_WEIGHT));
	}
	return [...weights].map(([term, weight]) => ({
		term,
		weight
	}));
}
function buildLexicalIndex(documents) {
	const postings = /* @__PURE__ */ new Map();
	const documentCount = documents.length;
	let totalLength = 0;
	documents.forEach((document, position) => {
		const indexed = {
			value: document.value,
			length: document.terms.length,
			position
		};
		for (const term of document.terms) {
			let matches = postings.get(term);
			if (!matches) {
				matches = /* @__PURE__ */ new Map();
				postings.set(term, matches);
			}
			matches.set(indexed, (matches.get(indexed) ?? 0) + 1);
		}
		totalLength += indexed.length;
	});
	return {
		postings,
		documentCount,
		averageLength: documentCount > 0 ? totalLength / documentCount : 0
	};
}
/**
* Okapi BM25. Ranks by how well a document matches the query terms, damping
* terms that appear across most of the catalog and normalizing for description
* length so a verbose tool does not outrank a precise one.
*
* An empty query scores nothing on purpose: returning the whole catalog in
* arbitrary order would look like a ranked answer without being one.
*
* `matchedLiteral` reports whether a hit shares any word the caller actually
* typed. Callers rank on it first: discounting expansions is not sufficient on
* its own, because BM25 sums per term and a common literal term carries little
* IDF, so a short document collecting two rare expansions can still outscore it.
*/
function scoreLexical(index, queryTerms) {
	if (queryTerms.length === 0 || index.documentCount === 0) return [];
	const total = index.documentCount;
	const results = [];
	for (const { term, weight } of queryTerms) {
		const matches = index.postings.get(term);
		if (!matches) continue;
		const matching = matches.size;
		const idf = Math.log(1 + (total - matching + .5) / (matching + .5));
		for (const [document, frequency] of matches) {
			let result = results[document.position];
			if (!result) {
				result = {
					value: document.value,
					score: 0,
					matchedLiteral: false
				};
				results[document.position] = result;
			}
			if (weight >= 1) result.matchedLiteral = true;
			const normalized = index.averageLength > 0 ? document.length / index.averageLength : 1;
			result.score += weight * (idf * (frequency * 2.2)) / (frequency + BM25_K1 * (.25 + BM25_B * normalized));
		}
	}
	return results.filter((result) => result.score > 0);
}
//#endregion
//#region src/agents/tool-search-recovery.ts
function tokenizeLookupValue(input) {
	return new Set(normalizeStringEntries(input.toLowerCase().split(/[^a-z0-9]+/u)));
}
function scoreUnknownToolSuggestion(normalizedNeedle, needleTokens, entry) {
	const name = entry.name.toLowerCase();
	const id = entry.id.toLowerCase();
	const label = (entry.label ?? "").toLowerCase();
	const description = entry.description.toLowerCase();
	const entryTokens = tokenizeLookupValue(`${entry.name} ${entry.id} ${entry.label ?? ""} ${entry.description}`);
	let score = 0;
	if (name && normalizedNeedle.includes(name) || id.includes(normalizedNeedle)) score += 40;
	if (name && needleTokens.has(name)) score += 40;
	for (const token of needleTokens) if (entryTokens.has(token)) score += 12;
	if (label.includes(normalizedNeedle) || description.includes(normalizedNeedle)) score += 8;
	return score;
}
function formatUnknownToolIdError(needle, entries, options = {}) {
	const skill = options.codeModeSkills?.find((candidate) => candidate.name === needle);
	const canReadSkills = entries.some((entry) => entry.source === "openclaw" && entry.sourceName === "core" && entry.name === "read");
	if (skill && canReadSkills) {
		const quotedLocation = JSON.stringify(skill.location);
		return `This id names a skill, not a callable tool. Load its complete instructions from ${quotedLocation.length <= 1024 ? quotedLocation : "its listed location"} using the skill-loading guidance in your system prompt.`;
	}
	const nameCounts = /* @__PURE__ */ new Map();
	for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
	const normalizedNeedle = needle.toLowerCase();
	const needleTokens = tokenizeLookupValue(needle);
	const suggestions = uniqueStrings(entries.map((entry) => ({
		value: options.exactIdOnly || (nameCounts.get(entry.name) ?? 0) > 1 ? entry.id : entry.name,
		score: scoreUnknownToolSuggestion(normalizedNeedle, needleTokens, entry)
	})).filter((candidate) => candidate.score > 0).toSorted((a, b) => b.score - a.score || a.value.localeCompare(b.value)).map((candidate) => candidate.value)).slice(0, 3);
	const recoveryText = options.recoverySurface === "code-mode" ? "Use openclaw.tools.search to find a tool, openclaw.tools.describe to inspect it, then openclaw.tools.call with the exact id or name." : options.recoverySurface === "catalog" ? "Use catalog.search to find a callable tool handle, then call the handle or use its describe method." : "Use tool_search to find a tool, tool_describe to inspect it, then tool_call with the exact id or name.";
	if (suggestions.length === 0) return `Unknown tool id: ${needle}. ${recoveryText}`;
	return `Unknown tool id: ${needle}. Did you mean: ${suggestions.join(", ")}? ${recoveryText}`;
}
function formatCatalogInputError(entry, errors, value) {
	const executionSchema = resolveAgentToolExecutionSchema(entry.tool, entry.parameters);
	const schema = isRecord(executionSchema) ? executionSchema : void 0;
	const propertyNames = isRecord(schema?.properties) ? Object.keys(schema.properties) : [];
	const knownProperties = new Set(propertyNames);
	const unexpectedProperties = schema?.additionalProperties === false && isRecord(value) ? Object.keys(value).filter((name) => !knownProperties.has(name)) : errors.flatMap((error) => error.additionalProperty ? [error.additionalProperty] : []);
	const suggestions = uniqueStrings(unexpectedProperties.flatMap((unexpected) => {
		const nearest = propertyNames.map((name) => ({
			name,
			distance: levenshteinDistance(unexpected, name)
		})).filter(({ distance }) => distance <= Math.min(3, Math.max(1, Math.ceil(unexpected.length / 3)))).toSorted((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))[0];
		return nearest ? [nearest.name] : [];
	})).slice(0, 3);
	const details = errors.map((error) => error.text).join("; ");
	const hint = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";
	const input = compactToolInputHint(schema);
	const signature = input === "unknown" ? "" : ` Expected input: ${input}.`;
	return `Invalid arguments for tool "${entry.id}": ${details}.${hint}${signature}`;
}
function formatCatalogOutputError(entry, errors) {
	const details = errors.slice(0, 5).map(({ text }) => {
		const prefix = truncateUtf8Prefix(text, 256);
		return prefix === text ? text : `${prefix} [truncated]`;
	});
	if (errors.length > details.length) details.push(`${errors.length - details.length} additional validation issues omitted`);
	return `Tool "${entry.id}" returned details that do not match its declared outputSchema. Check current state before retrying; the tool returned and side effects may already have occurred. Validation: ${details.join("; ")}.`;
}
//#endregion
//#region src/agents/tool-search-request.ts
const TOOL_SEARCH_SELECTOR_KEYS = [
	"id",
	"toolId",
	"name"
];
function readToolSearchSelector(params) {
	const value = params.id ?? params.toolId ?? params.name;
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readToolSearchId(args) {
	const value = readToolSearchSelector(asToolParamsRecord(args));
	if (value === void 0) throw new ToolInputError("id must be a non-empty string.");
	return value.trim();
}
function readToolSearchCallArgs(args, catalog) {
	const params = asToolParamsRecord(args);
	const dottedInput = Object.fromEntries(Object.entries(params).filter(([key]) => key.startsWith("args.") && key.length > 5).map(([key, value]) => [key.slice(5), value]));
	const nestedInput = params.args ?? params.input;
	const nestedInputIsEmpty = isRecord(nestedInput) && Object.keys(nestedInput).length === 0;
	if (nestedInput != null && !nestedInputIsEmpty) return {
		id: readToolSearchId(params),
		input: isRecord(nestedInput) ? {
			...dottedInput,
			...nestedInput
		} : nestedInput
	};
	const matchingSelectors = catalog ? TOOL_SEARCH_SELECTOR_KEYS.flatMap((key) => {
		const value = params[key];
		if (typeof value !== "string") return [];
		const matches = catalog.entries.filter((entry) => entry.id === value || entry.name === value);
		return matches.length > 0 ? [{
			key,
			matches
		}] : [];
	}) : [];
	if (new Set(matchingSelectors.flatMap(({ matches }) => matches.map((entry) => entry.id))).size > 1) throw new ToolInputError("Ambiguous tool selectors: pass the target tool id and nest target arguments under args.");
	const matchingSelector = matchingSelectors[0]?.key;
	const selector = matchingSelector ?? TOOL_SEARCH_SELECTOR_KEYS.find((key) => params[key] != null);
	const id = readToolSearchId(selector ? { [selector]: params[selector] } : params);
	const wrapperKeys = /* @__PURE__ */ new Set([
		"args",
		"input",
		...matchingSelectors.map(({ key }) => key),
		...matchingSelector ? [] : [selector ?? "id"]
	]);
	const targetInputEntries = Object.entries(params).filter(([key]) => !wrapperKeys.has(key));
	const flattenedInput = Object.fromEntries(targetInputEntries.filter(([key]) => !(key.startsWith("args.") && key.length > 5)));
	return {
		id,
		input: {
			...dottedInput,
			...flattenedInput
		}
	};
}
function prepareToolSearchDispatcherArguments(args) {
	if (!isRecord(args) || TOOL_SEARCH_SELECTOR_KEYS.some((key) => Object.hasOwn(args, key))) return args;
	const nestedInput = args.args ?? args.input;
	if (!isRecord(nestedInput)) return args;
	const selectorValue = readToolSearchSelector(nestedInput);
	if (selectorValue === void 0) return args;
	const { args: _wrappedArgs, input: _wrappedInput, ...outerRest } = args;
	return {
		...outerRest,
		...nestedInput,
		id: selectorValue
	};
}
function readToolSearchLimit(value, config) {
	if (value === void 0) return config.searchDefaultLimit;
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1) throw new ToolInputError("limit must be a positive integer.");
	return Math.min(value, config.maxSearchLimit);
}
function readBatchToolSearchQuery(value, field, maxGraphemes) {
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`${field} must be a non-empty string.`);
	const query = value.trim();
	if (maxGraphemes !== void 0 && !Guard.IsMaxLength(query, maxGraphemes)) throw new ToolInputError(`${field} must not exceed ${maxGraphemes} characters.`);
	return query;
}
function readToolSearchArgs(args, config) {
	const params = asToolParamsRecord(args);
	const query = params.query;
	if (typeof query !== "string") throw new ToolInputError("query must be a string.");
	const options = isRecord(params.options) ? params.options : void 0;
	return {
		query,
		limit: readToolSearchLimit(params.limit ?? options?.limit, config)
	};
}
function readBatchToolSearchEntry(value, index, config) {
	if (!isRecord(value)) throw new ToolInputError(`queries[${index}] must be an object.`);
	const query = readBatchToolSearchQuery(value.query, `queries[${index}].query`, 512);
	try {
		return {
			query,
			limit: readToolSearchLimit(value.limit, config)
		};
	} catch (error) {
		if (error instanceof ToolInputError) throw new ToolInputError(`queries[${index}].${error.message}`);
		throw error;
	}
}
function readBatchToolSearchRequest(searches, config) {
	if (searches.length > 16) throw new ToolInputError(`queries may contain at most 16 entries.`);
	const requestedResults = searches.reduce((total, search) => total + search.limit, 0);
	if (requestedResults > 50) throw new ToolInputError(`batch queries resolve to ${requestedResults} results, but may request at most 50 in total. An omitted limit counts as ${config.searchDefaultLimit}; set smaller per-query limits and retry.`);
	const serializedQueries = JSON.stringify(searches.map((search) => search.query));
	if (new TextEncoder().encode(serializedQueries).byteLength > 512) throw new ToolInputError(`serialized batch query text may use at most 512 UTF-8 bytes.`);
	return {
		kind: "batch",
		searches
	};
}
/** Normalize scalar and batch shapes without dropping independent searches. */
function readToolSearchRequest(args, config) {
	const params = asToolParamsRecord(args);
	const query = params.query ?? void 0;
	const queries = params.queries ?? void 0;
	const hasQuery = query !== void 0;
	const hasQueries = queries !== void 0;
	if (!hasQuery && !hasQueries) throw new ToolInputError("provide query or queries.");
	if (hasQueries && !Array.isArray(queries)) throw new ToolInputError("queries must be a non-empty array.");
	const batchEntries = Array.isArray(queries) ? queries : [];
	if (hasQuery && typeof query !== "string") throw new ToolInputError("query must be a string.");
	const singleQuery = typeof query === "string" && query.trim() ? query : void 0;
	if (batchEntries.length === 0) {
		if (singleQuery === void 0 && hasQueries) throw new ToolInputError("queries must be a non-empty array.");
		return {
			kind: "single",
			search: readToolSearchArgs(params, config)
		};
	}
	if (singleQuery === void 0 && (params.limit != null || params.options !== void 0)) throw new ToolInputError("set limit on each batch query, not on the batch request.");
	const searches = batchEntries.map((value, index) => readBatchToolSearchEntry(value, index, config));
	if (singleQuery !== void 0) {
		const single = readToolSearchArgs(params, config);
		searches.unshift({
			query: single.query.trim(),
			limit: single.limit
		});
	}
	return readBatchToolSearchRequest(searches, config);
}
//#endregion
//#region src/agents/tool-search-transcript.ts
function freezeJsonSnapshot(value) {
	if (value === null || typeof value !== "object") return value;
	for (const nested of Object.values(value)) freezeJsonSnapshot(nested);
	return Object.freeze(value);
}
/** Capture a stable JSON-safe result before delayed transcript settlement. */
function snapshotToolSearchTargetTranscriptResult(result) {
	const hasDetails = "details" in result;
	const snapshot = toToolSearchJsonSafe(result);
	if (!isRecord(snapshot)) throw new Error("Tool Search target result could not be captured for transcript projection.");
	if (hasDetails && !("details" in snapshot)) snapshot.details = result.details === void 0 ? void 0 : toToolSearchJsonSafe(result.details);
	const target = freezeJsonSnapshot(snapshot);
	return transferMcpCodeModeGuestResult(result, copyInternalToolResultState(result, target));
}
//#endregion
//#region src/agents/tool-search-runtime.ts
function describeEntry(entry) {
	return {
		...compactToolSearchCatalogEntry(entry),
		parameters: entry.parameters ?? {},
		...entry.outputSchema ? { outputSchema: entry.outputSchema } : {}
	};
}
/**
* Text indexed for one catalog entry. Parameter names and their descriptions are
* included because they often carry the only words a task shares with a tool:
* "post a message to a channel" reaches a tool whose description says only
* "Send a message" through its `channel` parameter. Codex and the Claude API
* tool-search tools index argument metadata for the same reason.
*/
function toolSearchEntryText(entry, parameterText) {
	const parameters = parameterText ?? (entry.source === "openclaw" ? readParameterText(entry.parameters) : "");
	return [
		entry.name,
		entry.id,
		entry.label ?? "",
		entry.description,
		parameters
	].filter(Boolean).join(" ");
}
function findEntry(catalog, id, options) {
	const needle = id.trim();
	const entries = visibleCatalogEntries(catalog, options);
	const exactIdEntry = entries.find((candidate) => candidate.id === needle);
	if (exactIdEntry) return exactIdEntry;
	const namedEntries = entries.filter((candidate) => candidate.name === needle);
	if (namedEntries.length > 1) throw new ToolInputError(`Ambiguous tool name: ${needle}; use an exact tool id.`);
	const namedEntry = namedEntries[0];
	if (!namedEntry) throw new ToolInputError(formatUnknownToolIdError(needle, entries, options));
	return namedEntry;
}
function findEntryByExactId(catalog, id, errorOptions = {}) {
	const needle = id.trim();
	const entry = catalog.entries.find((candidate) => candidate.id === needle);
	if (!entry) throw new ToolInputError(formatUnknownToolIdError(needle, catalog.entries, {
		...errorOptions,
		exactIdOnly: true
	}));
	return entry;
}
function matchesCachedToolSearchIndex(cached, entries) {
	return cached.entries.length === entries.length && entries.every((entry, index) => {
		const snapshot = cached.entries[index];
		return snapshot?.entry === entry && snapshot.id === entry.id && snapshot.source === entry.source && snapshot.name === entry.name && snapshot.label === entry.label && snapshot.description === entry.description && snapshot.parameters === entry.parameters && snapshot.parameterText === (entry.source === "openclaw" ? readParameterText(entry.parameters) : "");
	});
}
let schemaValidatorModulePromise;
function getCatalogSchemaCacheKey(entry, schemaName, schema) {
	return `${`tool-${schemaName === "inputSchema" ? "input" : "output"}:${entry.id}`}:${JSON.stringify(schema)}`;
}
async function validateCatalogSchemaValue(entry, schemaName, value, outputSelection) {
	let schema = schemaName === "inputSchema" ? resolveAgentToolExecutionSchema(entry.tool, entry.parameters) : entry.outputSchema;
	if (entry.source !== "openclaw") return;
	try {
		if (schemaName === "outputSchema") {
			if (outputSelection && readToolOutputSchemaVariants(schema)?.inputProperty !== outputSelection.inputProperty) throw new Error("Tool output discriminator changed during execution.");
			schema = selectToolOutputSchema(schema, outputSelection ? { [outputSelection.inputProperty]: outputSelection.value } : void 0);
		}
		if (!schema) return;
		schemaValidatorModulePromise ??= import("./schema-validator-CLuit6S4.mjs");
		const { validateJsonSchemaValue } = await schemaValidatorModulePromise;
		return validateJsonSchemaValue({
			schema,
			cacheKey: getCatalogSchemaCacheKey(entry, schemaName, schema),
			value
		});
	} catch (error) {
		throw markToolContractFailure(new Error(`Tool "${entry.id}" has an invalid ${schemaName}.`, { cause: error }), "invalid_contract");
	}
}
async function assertCatalogInputMatchesSchema(entry, value) {
	const validation = await validateCatalogSchemaValue(entry, "inputSchema", value);
	if (validation && !validation.ok) throw markToolContractFailure(new ToolInputError(formatCatalogInputError(entry, validation.errors, value)), "input_contract");
}
async function assertCatalogOutputSchemaIsValid(entry) {
	await validateCatalogSchemaValue(entry, "outputSchema", void 0);
}
async function assertCatalogOutputMatchesSchema(entry, result, outputSelection) {
	if (!entry.outputSchema && !outputSelection) return;
	if (isPreExecutionBlockedToolResult(result)) {
		const details = unwrapToolResultValue(result);
		const reason = isRecord(details) && typeof details.reason === "string" && details.reason.trim() ? details.reason : "Tool call blocked by policy";
		throw new Error(`Tool "${entry.id}" was blocked before execution: ${reason}`);
	}
	const validation = await validateCatalogSchemaValue(entry, "outputSchema", unwrapToolResultValue(result), outputSelection);
	if (!validation || validation.ok) return;
	throw markToolContractFailure(new Error(formatCatalogOutputError(entry, validation.errors)), "output_contract");
}
function sanitizeToolCallIdPart(value) {
	return value.trim().replace(/[^A-Za-z0-9_.:-]+/g, "_").slice(0, 120) || "call";
}
var ToolSearchRuntime = class {
	constructor(ctx, config, options = {}) {
		this.ctx = ctx;
		this.config = config;
		this.options = options;
		this.pluginRuntimeRefresh = captureAgentPluginRuntimeRefresh();
		this.callSequence = 0;
		this.terminalTargetBatchByParent = /* @__PURE__ */ new Map();
		this.networkInvocations = /* @__PURE__ */ new Map();
		this.searchIndexes = /* @__PURE__ */ new WeakMap();
		this.search = async (query, options) => {
			const catalog = resolveCatalog(this.ctx);
			catalog.searchCount += 1;
			const limit = readToolSearchLimit(options?.limit, this.config);
			const entries = visibleCatalogEntries(catalog, options);
			const compactEntry = (entry) => {
				if (entry.source !== "openclaw" && options?.parentToolCallId) this.observeNetworkContent(options.parentToolCallId);
				return compactToolSearchCatalogEntry(entry);
			};
			const spelling = query.trim();
			const exact = spelling.toLowerCase();
			const exactIdEntry = entries.find((entry) => entry.id === spelling);
			const exactMatches = exactIdEntry ? [exactIdEntry] : entries.filter((entry) => entry.name.toLowerCase() === exact || entry.id.toLowerCase() === exact);
			if (limit === 1 && exactMatches.length === 1) return exactMatches.slice(0, limit).map(compactEntry);
			const indexKey = options?.allowedIds ?? options?.includeMcp !== false;
			let catalogIndexes = this.searchIndexes.get(catalog);
			if (!catalogIndexes) {
				catalogIndexes = /* @__PURE__ */ new Map();
				this.searchIndexes.set(catalog, catalogIndexes);
			}
			let cachedIndex = catalogIndexes.get(indexKey);
			if (!cachedIndex || !matchesCachedToolSearchIndex(cachedIndex, entries)) {
				const indexedEntries = entries.map((entry) => ({
					entry,
					id: entry.id,
					source: entry.source,
					name: entry.name,
					label: entry.label,
					description: entry.description,
					parameters: entry.parameters,
					parameterText: entry.source === "openclaw" ? readParameterText(entry.parameters) : ""
				}));
				cachedIndex = {
					entries: indexedEntries,
					index: buildLexicalIndex(indexedEntries.map(({ entry, parameterText }) => ({
						value: entry,
						terms: tokenizeDocument(toolSearchEntryText(entry, parameterText))
					})))
				};
				catalogIndexes.set(indexKey, cachedIndex);
			}
			const hits = scoreLexical(cachedIndex.index, tokenizeQuery(query));
			const exactMatchSet = new Set(exactMatches);
			const exactEntries = exactMatches.filter((entry) => !hits.some((hit) => hit.value === entry));
			const remaining = limit - exactEntries.length;
			const ranked = remaining > 0 ? sortAndLimitBy(hits, remaining, (a, b) => Number(exactMatchSet.has(b.value)) - Number(exactMatchSet.has(a.value)) || Number(b.matchedLiteral) - Number(a.matchedLiteral) || b.score - a.score || a.value.id.localeCompare(b.value.id)).map((hit) => hit.value) : [];
			return [...exactEntries, ...ranked].slice(0, limit).map(compactEntry);
		};
		this.all = (options) => visibleCatalogEntries(resolveCatalog(this.ctx), options).map((entry) => compactToolSearchCatalogEntry(entry));
		this.namespaceEntries = () => resolveCatalog(this.ctx).entries.map(({ tool: _tool, outputSchema: _outputSchema, ...entry }) => {
			entry.parameters ??= {};
			return entry;
		});
		this.describe = async (id, options) => {
			const catalog = resolveCatalog(this.ctx);
			catalog.describeCount += 1;
			const entry = findEntry(catalog, id, {
				...options,
				codeModeSkills: this.ctx.codeModeSkills
			});
			if (entry.source !== "openclaw" && options?.parentToolCallId) this.observeNetworkContent(options.parentToolCallId);
			return describeEntry(entry);
		};
		this.call = async (id, input, options) => {
			const catalog = resolveCatalog(this.ctx);
			return await this.callEntry(findEntry(catalog, id, {
				...options,
				codeModeSkills: this.ctx.codeModeSkills
			}), input, options);
		};
		this.callExactId = async (id, input, options) => {
			const catalog = resolveCatalog(this.ctx);
			return await this.callEntry(findEntryByExactId(catalog, id, {
				...options,
				codeModeSkills: this.ctx.codeModeSkills
			}), input, options);
		};
		this.callValue = async (id, input, options) => unwrapToolResultValue((await this.call(id, input, options)).result);
		this.isReplaySafeExactId = (id) => {
			let entry;
			try {
				entry = findEntryByExactId(resolveCatalog(this.ctx), id);
			} catch {
				return false;
			}
			if (entry.source !== "openclaw") return false;
			const pluginMeta = getPluginToolMeta(entry.tool);
			if (pluginMeta) return pluginMeta.mcp ? false : pluginMeta.replaySafe === true && pluginMeta.sideEffecting !== true;
			if (getChannelAgentToolMeta(entry.tool)) return false;
			return isAgentToolReplaySafe(entry.tool);
		};
		this.callEntry = (entry, input, options) => runScheduledToolSearchCall({
			ctx: this.ctx,
			entry,
			signal: options?.signal,
			execute: (currentEntry, signal) => this.executeEntry(resolveCatalog(this.ctx), currentEntry, input, {
				...options,
				signal
			})
		});
		this.executeEntry = async (catalog, entry, input, options) => {
			this.pluginRuntimeRefresh.assertCurrent();
			catalog.callCount += 1;
			const normalizedInput = input ?? {};
			const toolCallId = `tool_search_code:${sanitizeToolCallIdPart(options?.parentToolCallId ?? "direct")}:${entry.name}:${++this.callSequence}`;
			bindJoinedCollectorInvocation(entry.tool, toolCallId);
			await assertCatalogOutputSchemaIsValid(entry);
			const outputVariants = entry.source === "openclaw" ? readToolOutputSchemaVariants(entry.outputSchema) : void 0;
			const callerOutputSelection = outputVariants ? captureToolOutputSelection(outputVariants.inputProperty, normalizedInput) : void 0;
			let executedOutputSelection;
			const executeTool = this.ctx.executeTool ?? (async (params) => {
				const result = await params.tool.execute(params.toolCallId, params.input, params.signal, params.onUpdate, void 0);
				return await params.acceptResultBeforeProjection(result);
			});
			let preExecutionBlocked = false;
			let acceptedSnapshot;
			const acceptResultBeforeProjection = async (candidate) => {
				if (isPreExecutionBlockedToolResult(candidate)) {
					preExecutionBlocked = true;
					await assertCatalogOutputMatchesSchema(entry, candidate);
				}
				const snapshot = candidate === acceptedSnapshot ? candidate : snapshotToolSearchTargetTranscriptResult(candidate);
				await assertCatalogOutputMatchesSchema(entry, snapshot, executedOutputSelection);
				if (callerOutputSelection && callerOutputSelection.value !== executedOutputSelection?.value) await assertCatalogOutputMatchesSchema(entry, snapshot, callerOutputSelection);
				acceptedSnapshot = snapshot;
				return snapshot;
			};
			const validateInput = this.options.validateInput && entry.source === "openclaw";
			const validateExecution = validateInput || outputVariants !== void 0;
			const executionTool = prepareToolSearchCatalogExecutionTool(entry, {
				...this.options,
				validateInput: validateExecution
			});
			const runExecution = async () => {
				this.pluginRuntimeRefresh.assertCurrent();
				const parentToolCallId = options?.parentToolCallId ?? toolCallId;
				const signal = options?.signal ?? this.ctx.abortSignal;
				const networkInvocation = entry.tool.resultContentSource === "network" ? this.networkInvocations.get(parentToolCallId) ?? {
					active: 0,
					observed: false
				} : void 0;
				if (networkInvocation) {
					networkInvocation.active += 1;
					this.networkInvocations.set(parentToolCallId, networkInvocation);
				}
				try {
					const result = await executeTool({
						tool: executionTool,
						toolName: entry.name,
						source: entry.source,
						sourceName: entry.sourceName,
						toolCallId,
						parentToolCallId: options?.parentToolCallId,
						replaySafe: this.isReplaySafeExactId(entry.id),
						input: normalizedInput,
						signal,
						onUpdate: options?.onUpdate,
						acceptResultBeforeProjection
					});
					if (networkInvocation && !preExecutionBlocked) networkInvocation.observed = true;
					return result;
				} catch (error) {
					if (networkInvocation && !preExecutionBlocked && getBeforeToolCallFailureDisposition(error) === void 0 && !isTrustedToolExecutionPreflightError(error) && !(signal?.aborted && error === signal.reason)) networkInvocation.observed = true;
					throw error;
				} finally {
					if (networkInvocation && --networkInvocation.active === 0 && !networkInvocation.observed) this.networkInvocations.delete(parentToolCallId);
				}
			};
			let acceptedResult;
			try {
				acceptedResult = await acceptResultBeforeProjection(validateExecution ? await runWithToolExecutionValidation(toolCallId, async (finalInput) => {
					if (validateInput) await assertCatalogInputMatchesSchema(entry, finalInput);
					if (outputVariants) executedOutputSelection = captureToolOutputSelection(outputVariants.inputProperty, finalInput);
				}, runExecution) : await runExecution());
				if (options?.parentToolCallId) this.terminalTargetBatchByParent.set(options.parentToolCallId, this.terminalTargetBatchByParent.get(options.parentToolCallId) !== false && acceptedResult.terminate === true);
				return {
					tool: compactToolSearchCatalogEntry(entry),
					result: acceptedResult
				};
			} finally {
				finalizeToolTerminalPresentation({
					toolCallId,
					runId: this.ctx.runId,
					result: acceptedResult ?? {
						content: [],
						details: void 0
					},
					isError: acceptedResult === void 0 || isToolResultError(acceptedResult)
				});
			}
		};
	}
	observeNetworkContent(parentToolCallId) {
		const state = this.networkInvocations.get(parentToolCallId) ?? {
			active: 0,
			observed: false
		};
		state.observed = true;
		this.networkInvocations.set(parentToolCallId, state);
	}
	hasNetworkContent(parentToolCallId) {
		return parentToolCallId ? this.networkInvocations.has(parentToolCallId) : this.networkInvocations.size > 0;
	}
	takeTerminalTargetBatch(parentToolCallId) {
		const parent = parentToolCallId ?? (this.terminalTargetBatchByParent.size === 1 ? this.terminalTargetBatchByParent.keys().next().value ?? "" : "");
		const terminal = this.terminalTargetBatchByParent.get(parent) === true;
		return this.terminalTargetBatchByParent.delete(parent) && terminal;
	}
	telemetry() {
		return readToolSearchCatalogTelemetry(this.ctx);
	}
};
/** Preserve programmatic values while protecting the model-facing control output. */
function formatToolSearchControlResult(payload, runtime, options = {}) {
	const serialized = serializeToolSearchControlResult(payload, options.compact);
	const { text } = renderToolSearchControlText(serialized, runtime?.hasNetworkContent(options.parentToolCallId) ?? false);
	const result = textResult(text, payload);
	return options.terminalBatchStatus !== "waiting" && runtime?.takeTerminalTargetBatch(options.parentToolCallId) === true ? {
		...result,
		terminate: true
	} : result;
}
/** Keep dynamic failures rejected without exposing network-controlled error text. */
function formatToolSearchControlError(error, runtime, parentToolCallId, signal) {
	if (!runtime?.hasNetworkContent(parentToolCallId) || getBeforeToolCallFailureDisposition(error) !== void 0 || isTrustedToolExecutionPreflightError(error) || signal?.aborted && error === signal.reason) return error;
	return protectNetworkToolExecutionError(error, "Tool Search call failed.", signal);
}
function unwrapToolResultValue(result) {
	return isRecord(result) && "details" in result ? result.details : result;
}
//#endregion
//#region src/agents/tool-search-code-mode.ts
async function runCodeMode(params) {
	const runtime = new ToolSearchRuntime(params.ctx, params.config, { validateInput: true });
	params.onRuntime?.(runtime);
	const logs = [];
	return {
		ok: true,
		value: await runCodeModeChild({
			code: params.code,
			config: params.config,
			logs,
			parentToolCallId: params.toolCallId,
			runtime,
			signal: params.signal,
			onUpdate: params.onUpdate
		}) ?? null,
		logs,
		telemetry: runtime.telemetry()
	};
}
function resolveCodeModeChildCommand() {
	const executable = resolveNodeRuntimeExecutable({ requiredFlag: "--permission" });
	if (!executable) throw new ToolInputError("tool_search_code requires an installed Node runtime with --permission support.");
	return {
		executable,
		args: [
			"--permission",
			"--input-type=module",
			"--eval",
			TOOL_SEARCH_CODE_MODE_CHILD_SOURCE
		]
	};
}
function isCodeModeBridgeMethod(value) {
	return value === "search" || value === "describe" || value === "call";
}
async function runCodeModeBridgeRequest(runtime, method, args, options) {
	const values = Array.isArray(args) ? args : [];
	switch (method) {
		case "search": {
			const query = values[0];
			if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
			const optionsLocal = isRecord(values[1]) ? values[1] : void 0;
			return await runtime.search(query, {
				parentToolCallId: options?.parentToolCallId,
				limit: typeof optionsLocal?.limit === "number" ? optionsLocal.limit : void 0
			});
		}
		case "describe": {
			const id = values[0];
			if (typeof id !== "string") throw new ToolInputError("describe id must be a string.");
			return await runtime.describe(id, {
				recoverySurface: "code-mode",
				parentToolCallId: options?.parentToolCallId
			});
		}
		case "call": {
			const id = values[0];
			if (typeof id !== "string") throw new ToolInputError("call id must be a string.");
			return await runtime.call(id, values[1] ?? {}, {
				...options,
				recoverySurface: "code-mode"
			});
		}
	}
	throw new ToolInputError("Unsupported tool_search_code bridge method.");
}
function runCodeModeChild(params) {
	return new Promise((resolve, reject) => {
		const command = resolveCodeModeChildCommand();
		const child = spawn(command.executable, command.args, {
			cwd: os.tmpdir(),
			env: {},
			stdio: [
				"ignore",
				"ignore",
				"pipe",
				"ipc"
			]
		});
		let stderrTail = "";
		let stderrDroppedBytes = 0;
		let settled = false;
		let exitRejectionTimer;
		const bridgeAbortController = new AbortController();
		const settle = (callback, abortReason) => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			if (exitRejectionTimer) clearTimeout(exitRejectionTimer);
			params.signal?.removeEventListener("abort", abortFromParent);
			bridgeAbortController.abort(abortReason);
			child.kill();
			callback();
		};
		const abortFromParent = () => {
			child.kill("SIGKILL");
			settle(() => reject(/* @__PURE__ */ new Error("tool_search_code aborted")), params.signal?.reason);
		};
		const timer = setTimeout(() => {
			const error = /* @__PURE__ */ new Error("tool_search_code timed out");
			child.kill("SIGKILL");
			settle(() => reject(error), error);
		}, params.config.codeTimeoutMs);
		params.signal?.addEventListener("abort", abortFromParent, { once: true });
		if (params.signal?.aborted) {
			abortFromParent();
			return;
		}
		child.stderr?.setEncoding("utf8");
		child.stderr?.on("data", (chunk) => {
			const appended = appendBoundedTextTail(stderrTail, chunk);
			stderrTail = appended.tail;
			stderrDroppedBytes += appended.droppedBytes;
		});
		child.stderr?.on("error", (error) => {
			settle(() => reject(error));
		});
		child.on("error", (error) => {
			settle(() => reject(error));
		});
		const rejectOnExit = (code, signal) => {
			const suffix = stderrTail.trim();
			const preview = sliceUtf16Safe(suffix, -500);
			const previewDroppedBytes = Buffer.byteLength(suffix) - Buffer.byteLength(preview);
			const notices = [stderrDroppedBytes > 0 ? `${stderrDroppedBytes} UTF-8 bytes of earlier stderr discarded at the ${SESSION_TOOL_STDERR_TAIL_BYTES}-byte retention cap` : "", previewDroppedBytes > 0 ? `${previewDroppedBytes} UTF-8 bytes omitted from the trimmed stderr preview` : ""].filter(Boolean);
			const detail = preview || notices.length > 0 ? `: ${preview}${notices.length > 0 ? ` [${notices.join("; ")}]` : ""}` : "";
			settle(() => reject(/* @__PURE__ */ new Error(`tool_search_code child exited with ${signal ?? code}${detail}`)));
		};
		child.on("exit", (code, signal) => {
			if (!settled && code === 0 && signal === null) exitRejectionTimer = setTimeout(() => rejectOnExit(code, signal), 250);
		});
		child.on("close", (code, signal) => {
			if (!settled && (code !== 0 || signal !== null)) rejectOnExit(code, signal);
		});
		child.on("message", (message) => {
			if (settled || !isRecord(message) || typeof message.type !== "string") return;
			if (message.type === "log") {
				const items = Array.isArray(message.items) ? message.items : [];
				params.logs.push(items.map((item) => String(item)).join(" "));
				return;
			}
			if (message.type === "result") {
				if (message.ok) settle(() => resolve(message.value));
				else settle(() => reject(new Error(typeof message.error === "string" ? message.error : "code failed")));
				return;
			}
			if (message.type !== "bridge") return;
			const id = typeof message.id === "string" ? message.id : "";
			const method = isCodeModeBridgeMethod(message.method) ? message.method : void 0;
			if (!id || !method) return;
			runCodeModeBridgeRequest(params.runtime, method, message.args, {
				parentToolCallId: params.parentToolCallId,
				signal: bridgeAbortController.signal,
				onUpdate: params.onUpdate
			}).then((value) => {
				if (settled || !child.connected) return;
				const response = {
					type: "bridge-result",
					id,
					ok: true,
					value: toToolSearchJsonSafe(value)
				};
				child.send(response, () => void 0);
			}).catch((error) => {
				if (settled || !child.connected) return;
				const response = {
					type: "bridge-result",
					id,
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				};
				child.send(response, () => void 0);
			});
		});
		child.send({
			type: "run",
			code: params.code,
			timeoutMs: params.config.codeTimeoutMs
		});
	});
}
function readToolSearchCode(args) {
	const code = asToolParamsRecord(args).code;
	if (typeof code !== "string" || !code.trim()) throw new ToolInputError("code must be a non-empty string.");
	return code;
}
//#endregion
//#region src/agents/tool-search-config.ts
const DEFAULT_CODE_TIMEOUT_MS = 1e4;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 20;
function readToolSearchConfig(config) {
	const toolSearch = (isRecord(config?.tools) ? config.tools : void 0)?.toolSearch;
	if (toolSearch === void 0) return {
		enabled: true,
		mode: "tools"
	};
	if (toolSearch === true) return { enabled: true };
	if (toolSearch === false) return { enabled: false };
	return isRecord(toolSearch) ? toolSearch : {};
}
function resolveBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function readInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
let toolSearchCodeModeSupportedForTest;
let toolSearchMinCodeTimeoutMsForTest;
function isToolSearchCodeModeSupported() {
	if (toolSearchCodeModeSupportedForTest !== void 0) return toolSearchCodeModeSupportedForTest;
	return typeof process.versions.electron !== "string" && resolveNodeRuntimeExecutable({ requiredFlag: "--permission" }) !== void 0;
}
function resolveMinCodeTimeoutMs() {
	return toolSearchMinCodeTimeoutMsForTest ?? 1e3;
}
function resolveToolSearchConfig(config) {
	const raw = readToolSearchConfig(config);
	const rawMode = typeof raw.mode === "string" ? raw.mode : "code";
	const requestedMode = rawMode === "tools" || rawMode === "directory" || rawMode === "code" ? rawMode : "code";
	const mode = requestedMode === "code" && !isToolSearchCodeModeSupported() ? "tools" : requestedMode;
	const configured = Object.keys(raw).some((key) => key !== "enabled");
	const maxSearchLimit = Math.max(1, Math.min(50, readInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT)));
	return {
		enabled: resolveBoolean(raw.enabled, configured),
		mode,
		codeTimeoutMs: Math.max(resolveMinCodeTimeoutMs(), Math.min(6e4, readInteger(raw.codeTimeoutMs, DEFAULT_CODE_TIMEOUT_MS))),
		searchDefaultLimit: Math.max(1, Math.min(maxSearchLimit, readInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT))),
		maxSearchLimit
	};
}
function setToolSearchCodeModeSupportedForTest(value) {
	toolSearchCodeModeSupportedForTest = value;
}
function setToolSearchMinCodeTimeoutMsForTest(value) {
	toolSearchMinCodeTimeoutMsForTest = typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
//#endregion
//#region src/agents/tool-search-directory.ts
const MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS = 18e3;
const TOOL_DIRECTORY_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/u;
const toolSchemaDirectoryPromptCache = /* @__PURE__ */ new WeakMap();
function applyToolSchemaDirectoryCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	if (!config.enabled) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	if (!params.tools.some((tool) => tool.name === "tool_search")) return {
		tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const directToolNames = new Set(normalizeStringEntries(Array.from(params.directToolNames ?? [])));
	const uniqueCatalogToolNames = collectUniqueCatalogToolNames(params.tools);
	return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: (tool) => TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES.has(tool.name),
		isVisibleCatalogTool: (tool) => uniqueCatalogToolNames.has(tool.name) && isDirectVisibleCatalogTool(tool, directToolNames)
	});
}
function buildToolSchemaDirectoryPrompt(ctx, options) {
	const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
	const catalog = resolveCatalog(ctx);
	const contextTokens = options?.contextTokenBudget;
	const maxChars = contextTokens && Number.isFinite(contextTokens) && contextTokens > 0 ? Math.min(MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS, Math.max(768, Math.floor(contextTokens / 10))) : MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS;
	const cacheKey = `${config.mode}:${options?.includeMcp === false ? "without-mcp" : "all"}:${maxChars}`;
	let cachedPrompts = toolSchemaDirectoryPromptCache.get(catalog.entries);
	const cachedPrompt = options?.allowedIds ? void 0 : cachedPrompts?.get(cacheKey);
	if (cachedPrompt !== void 0) return cachedPrompt;
	const prompt = formatToolSearchCatalogDirectory(visibleCatalogEntries(catalog, options), config.mode, maxChars);
	if (options?.allowedIds) return prompt;
	if (!cachedPrompts) {
		cachedPrompts = /* @__PURE__ */ new Map();
		toolSchemaDirectoryPromptCache.set(catalog.entries, cachedPrompts);
	}
	cachedPrompts.set(cacheKey, prompt);
	pruneMapToMaxSize(cachedPrompts, 12);
	return prompt;
}
function resolveToolSearchCatalogTool(ctx, name, options) {
	if (typeof name !== "string") return;
	const needle = name.trim();
	if (!needle) return;
	try {
		const matches = visibleCatalogEntries(resolveCatalog(ctx), options).filter((entry) => entry.name === needle);
		return matches.length === 1 ? matches[0]?.tool : void 0;
	} catch (error) {
		if (error instanceof ToolInputError) return;
		throw error;
	}
}
function compactDirectoryDescription(description, maxChars) {
	const normalized = description.replace(/\s+/g, " ").trim();
	if (normalized.length <= maxChars) return normalized;
	return `${truncateUtf16Safe(normalized, maxChars - 3).trimEnd()}...`;
}
function formatToolDirectoryIdentifier(value) {
	const trimmed = value?.trim();
	return trimmed && TOOL_DIRECTORY_IDENTIFIER_RE.test(trimmed) ? trimmed : void 0;
}
function formatToolDirectoryEntry(entry, descriptionMaxChars) {
	if (entry.source !== "openclaw") return;
	const name = formatToolDirectoryIdentifier(entry.name);
	if (!name) return;
	const ownerName = formatToolDirectoryIdentifier(entry.sourceName);
	const owner = ownerName ? ` (${ownerName})` : "";
	if (descriptionMaxChars === 0) return `- ${name}${owner}`;
	return `- ${name}${owner}: ${compactDirectoryDescription(entry.description, descriptionMaxChars) || "No description."}`;
}
function formatToolSearchCatalogDirectory(entries, mode, maxChars) {
	const deferredEntries = entries.filter((entry) => !entry.directVisible);
	if (deferredEntries.length === 0) return "Available deferred-schema tools: none.";
	const nameCounts = /* @__PURE__ */ new Map();
	for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
	const listedEntries = deferredEntries.filter((entry) => nameCounts.get(entry.name) === 1).toSorted((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0) || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
	let descriptionMaxChars = 180;
	const renderRows = () => listedEntries.map((entry) => formatToolDirectoryEntry(entry, descriptionMaxChars)).filter((line) => Boolean(line));
	let lines = renderRows();
	const heading = "Available deferred-schema tools:";
	const notice = "Policy-approved MCP and client tools may also be discoverable through search.";
	const omittedLabel = " additional tools omitted. ";
	let lineChars = lines.reduce((chars, line) => chars + line.length + 1, 0);
	let omitted = deferredEntries.length - lines.length;
	let guidance;
	for (;;) {
		guidance = mode === "code" ? "Use tool_search_code with openclaw.tools.search(query), openclaw.tools.describe(id), and openclaw.tools.call(id, args)." : omitted > 0 ? "Use tool_search to find a tool and its input signature; use tool_describe when a full schema is needed." : "Use tool_search for a compact input signature or tool_describe for a full schema.";
		if (mode === "tools") guidance += " Deferred names are not directly callable. Call tool_call with the result id or name in id and all tool parameters in args. Use this wrapper even when other guidance names a deferred tool directly.";
		else if (mode === "directory") guidance += " Call a unique deferred tool name directly, or use tool_call with its id and args.";
		const footerChars = guidance.length + (omitted > 0 ? String(omitted).length + 27 : 0);
		if (32 + lineChars + 77 + footerChars + 3 <= maxChars || lines.length === 0) break;
		if (descriptionMaxChars > 0) {
			descriptionMaxChars = descriptionMaxChars === 180 ? 64 : 0;
			lines = renderRows();
			lineChars = lines.reduce((chars, line) => chars + line.length + 1, 0);
			continue;
		}
		lineChars -= lines.pop().length + 1;
		omitted += 1;
	}
	const footer = omitted > 0 ? `${omitted}${omittedLabel}${guidance}` : guidance;
	return [
		heading,
		...lines,
		"",
		notice,
		footer
	].join("\n");
}
//#endregion
//#region src/agents/tool-search.ts
/** Tool Search catalog compaction for large OpenClaw, MCP, and client tool inventories. */
const MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS = 180;
const MAX_BATCH_CANDIDATE_DESCRIPTION_SCAN_CHARS = 720;
const MAX_BATCH_CANDIDATE_METADATA_CHARS = 2e3;
function compactBatchCandidateDescription(candidate) {
	const prefix = truncateUtf16Safe(candidate.description, MAX_BATCH_CANDIDATE_DESCRIPTION_SCAN_CHARS);
	const normalized = prefix.replace(/\s+/g, " ").trim();
	if (prefix.length === candidate.description.length && normalized.length <= MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS) return {
		...candidate,
		description: normalized
	};
	const compacted = truncateUtf16Safe(normalized, 177).trimEnd();
	return {
		...candidate,
		description: `${compacted}...`
	};
}
function compactBatchCandidate(candidate) {
	const mandatoryChars = candidate.id.length + candidate.source.length + candidate.name.length + candidate.input.length;
	if (mandatoryChars > MAX_BATCH_CANDIDATE_METADATA_CHARS) return;
	let remaining = MAX_BATCH_CANDIDATE_METADATA_CHARS - mandatoryChars;
	const retain = (value) => {
		if (value === void 0 || value.length > remaining) return;
		remaining -= value.length;
		return value;
	};
	const sourceName = retain(candidate.sourceName);
	const label = retain(candidate.label);
	const mcpChars = candidate.mcp ? candidate.mcp.serverName.length + candidate.mcp.safeServerName.length + candidate.mcp.toolName.length + candidate.mcp.operation.length : 0;
	const mcp = candidate.mcp && mcpChars <= remaining ? candidate.mcp : void 0;
	if (mcp) remaining -= mcpChars;
	const output = retain(candidate.output);
	return {
		...compactBatchCandidateDescription(candidate),
		sourceName,
		label,
		mcp,
		output
	};
}
function formatToolSearchBatchResponse(results, networkContent) {
	const bounded = results.map((result) => {
		const candidates = result.candidates.map(compactBatchCandidate).filter((candidate) => candidate !== void 0);
		const groupTruncated = candidates.length < result.candidates.length;
		return {
			...result,
			candidates,
			...groupTruncated ? { truncated: true } : {}
		};
	});
	let truncated = bounded.some((result) => result.truncated);
	const render = () => ({
		results: bounded,
		...truncated ? { truncated: true } : {}
	});
	let payload = render();
	let { text } = renderToolSearchControlText(JSON.stringify(payload, null, 2), networkContent);
	while (text.length > MAX_TOOL_SEARCH_BATCH_RESPONSE_CHARS) {
		let removable;
		for (const group of bounded) {
			if (group.candidates.length === 0) continue;
			if (!removable || group.candidates.length > removable.candidates.length || group.candidates.length === removable.candidates.length && JSON.stringify(group.candidates.at(-1)).length > JSON.stringify(removable.candidates.at(-1)).length) removable = group;
		}
		if (!removable) break;
		removable.candidates.pop();
		removable.truncated = true;
		truncated = true;
		payload = render();
		({text} = renderToolSearchControlText(JSON.stringify(payload, null, 2), networkContent));
	}
	return textResult(text, payload);
}
function shouldExposeControlTool(name, mode) {
	if (name === "tool_search_code") return mode === "code";
	if (name === "tool_search" || name === "tool_describe" || name === "tool_call") return mode === "tools";
	return false;
}
/** Replace visible tools with Tool Search controls and register hidden catalog entries. */
function applyToolSearchCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	const directToolNames = new Set(normalizeStringEntries(Array.from(params.directToolNames ?? [])));
	return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: (tool) => TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) && shouldExposeControlTool(tool.name, config.mode),
		isVisibleCatalogTool: (tool) => isDirectVisibleCatalogTool(tool, directToolNames)
	});
}
/** Move client-provided tools into an existing Tool Search catalog. */
function addClientToolsToToolSearchCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	if (config.mode === "directory") return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0
	};
	return addClientToolsToToolCatalog({
		...params,
		enabled: config.enabled
	});
}
/** Create Tool Search control tools for the current run/session context. */
function createToolSearchTools(ctx) {
	const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
	const runtime = new ToolSearchRuntime(ctx, config, { validateInput: true });
	return [
		{
			name: TOOL_SEARCH_CODE_MODE_TOOL_NAME,
			label: "Tool Search Code",
			description: "Run JavaScript in an isolated Node subprocess over a large tool catalog. APIs: `openclaw.tools.search(query: string, options?)`, `openclaw.tools.describe(id: string)`, and `openclaw.tools.call(id: string, args?)`. Search takes a positional query string, which must be in English: matching is lexical against tool names and descriptions, which are written in English. Call returns `{ tool, result }`; JSON values normally live in `result.details`.",
			parameters: Type.Object({ code: Type.String({ description: "JavaScript body for an async function. Use return to return the final value. The openclaw.tools bridge is available." }) }),
			execute: async (toolCallId, args, signal, onUpdate) => {
				let executionRuntime;
				try {
					return formatToolSearchControlResult(await runCodeMode({
						toolCallId,
						ctx,
						code: readToolSearchCode(args),
						config,
						signal,
						onUpdate,
						onRuntime: (value) => {
							executionRuntime = value;
						}
					}), executionRuntime);
				} catch (error) {
					throw formatToolSearchControlError(error, executionRuntime, toolCallId, signal ?? ctx.abortSignal);
				}
			}
		},
		{
			name: TOOL_SEARCH_RAW_TOOL_NAME,
			label: "Tool Search",
			description: "Search the effective Tool Search catalog. Pass query for one search or queries for several independent searches in one call; a non-empty query joins a non-empty batch first, with its own limit. Batch results stay grouped in request order. Queries must be in English: matching is lexical against tool names and descriptions, which are written in English, so another language will usually match nothing. Pass an exact result id or name to tool_call; use tool_describe only when you need its input schema.",
			parameters: Type.Object({
				query: Type.Optional(Type.Union([Type.String(), Type.Null()], { description: "Single search query, in English. A non-empty query joins a non-empty batch first. Null or blank is ignored beside a non-empty batch." })),
				limit: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()], { description: "Maximum number of single-search results. Omitted or null uses the default. With only batch queries, omit this or set it to null; set limits on each batch entry." })),
				queries: Type.Optional(Type.Union([Type.Array(Type.Object({
					query: Type.String({
						minLength: 1,
						maxLength: 512,
						description: "Search query, in English. Describe the capability you need."
					}),
					limit: Type.Optional(Type.Integer({
						minimum: 1,
						description: `Maximum results for this query. Defaults to ${config.searchDefaultLimit} when omitted.`
					}))
				}), { maxItems: 16 }), Type.Null()], { description: `Independent searches. Prefer this alone for several searches; a non-empty query beside it runs as the first entry. Their effective limits may total at most 50; an omitted item limit counts as ${config.searchDefaultLimit}. The serialized query strings may use at most 512 UTF-8 bytes in total.` }))
			}),
			execute: async (toolCallId, args) => {
				const request = readToolSearchRequest(args, config);
				if (request.kind === "single") return formatToolSearchControlResult(await runtime.search(request.search.query, {
					limit: request.search.limit,
					parentToolCallId: toolCallId
				}), runtime, { parentToolCallId: toolCallId });
				return formatToolSearchBatchResponse(await Promise.all(request.searches.map(async (search) => ({
					query: search.query,
					candidates: await runtime.search(search.query, {
						limit: search.limit,
						parentToolCallId: toolCallId
					})
				}))), runtime.hasNetworkContent(toolCallId));
			}
		},
		{
			name: TOOL_DESCRIBE_RAW_TOOL_NAME,
			label: "Tool Describe",
			description: "Load the full schema and metadata for one search result when its input is not already clear.",
			parameters: Type.Object({ id: Type.String({ description: "Tool search result id or tool name." }) }),
			prepareArguments: prepareToolSearchDispatcherArguments,
			execute: async (toolCallId, args) => formatToolSearchControlResult(await runtime.describe(readToolSearchId(args), { parentToolCallId: toolCallId }), runtime, { parentToolCallId: toolCallId })
		},
		{
			name: TOOL_CALL_RAW_TOOL_NAME,
			label: "Tool Call",
			description: "Call an exact Tool Search result id or name through OpenClaw.",
			parameters: Type.Object({
				id: Type.String({ description: "Tool search result id or tool name." }),
				args: Type.Optional(Type.Record(Type.String(), Type.Unknown(), { description: "Tool input." }))
			}),
			prepareArguments: prepareToolSearchDispatcherArguments,
			execute: async (toolCallId, args, signal, onUpdate) => {
				const call = readToolSearchCallArgs(args, resolveCatalog(ctx));
				try {
					const callResult = await runtime.call(call.id, call.input, {
						parentToolCallId: toolCallId,
						signal,
						onUpdate
					});
					const { id, name, source } = callResult.tool;
					const wrappedResult = {
						...formatToolSearchControlResult({
							tool: {
								id,
								name,
								source
							},
							result: callResult.result
						}, runtime, { parentToolCallId: toolCallId }),
						details: callResult
					};
					const failureKind = resolveToolResultFailureKind(callResult.result);
					if (!failureKind) return wrappedResult;
					return {
						...wrappedResult,
						details: {
							...callResult,
							status: failureKind
						}
					};
				} catch (error) {
					throw formatToolSearchControlError(error, runtime, toolCallId, signal ?? ctx.abortSignal);
				}
			}
		}
	];
}
const testing = {
	maxToolSchemaDirectoryPromptChars: MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS,
	resolveToolSearchConfig,
	isToolSearchCodeModeSupported,
	setToolSearchCodeModeSupportedForTest,
	setToolSearchMinCodeTimeoutMsForTest,
	applyToolSearchCatalog,
	addClientToolsToToolSearchCatalog,
	runCodeModeChild
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.toolSearchTestApi")] = testing;
//#endregion
//#region src/agents/local-model-lean.ts
/**
* Local-model lean tool filtering.
* Removes high-latency or channel-dependent tools for local models while
* preserving explicitly required delivery tools.
*/
const LOCAL_MODEL_LEAN_DENY_TOOL_NAMES = /* @__PURE__ */ new Set([
	"browser",
	AUTOMATIONS_TOOL_NAME,
	"image_generate",
	"message",
	"music_generate",
	"pdf",
	"tts",
	"video_generate"
]);
function resolvePreservedLocalModelLeanToolNames(names) {
	if (!names) return [];
	return compileGlobPatterns({
		raw: expandToolGroups([...names]).filter((name) => normalizeToolPolicyName(name) !== "*"),
		normalize: normalizeToolPolicyName
	});
}
/** Resolves tool names that must survive local-model lean filtering. */
function resolveLocalModelLeanPreserveToolNames(params) {
	const names = [...params?.toolNames ?? []];
	if (params && messageToolOwnsVisibleReply(params)) names.push("message");
	return [...new Set(names)];
}
function resolveLocalModelLeanAgentId(params) {
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	if (params.config) return resolveSessionAgentIds({
		config: params.config,
		agentId: explicitAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId;
	const parsedSessionAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	return explicitAgentId ?? (parsedSessionAgentId ? normalizeAgentId(parsedSessionAgentId) : void 0);
}
/** Returns true when local-model lean mode is enabled for the selected agent. */
function isLocalModelLeanEnabled(params) {
	const normalizedAgentId = resolveLocalModelLeanAgentId(params);
	return (params.config && normalizedAgentId ? resolveAgentConfig(params.config, normalizedAgentId)?.experimental ?? params.config.agents?.defaults?.experimental : params.config?.agents?.defaults?.experimental)?.localModelLean ?? false;
}
/** Filters tools for local-model lean mode while preserving required delivery tools. */
function filterLocalModelLeanTools(params) {
	if (!isLocalModelLeanEnabled(params)) return params.tools;
	const preservedToolNames = resolvePreservedLocalModelLeanToolNames(params.preserveToolNames);
	return params.tools.filter((tool) => {
		const normalizedName = normalizeToolPolicyName(tool.name);
		return matchesAnyGlobPattern(normalizedName, preservedToolNames) || !LOCAL_MODEL_LEAN_DENY_TOOL_NAMES.has(normalizedName);
	});
}
//#endregion
export { TOOL_DESCRIBE_RAW_TOOL_NAME as C, retainToolSearchImplementation as D, TOOL_SEARCH_RAW_TOOL_NAME as E, TOOL_CALL_RAW_TOOL_NAME as S, TOOL_SEARCH_CONTROL_TOOL_NAMES as T, compactToolSearchCatalogEntry as _, applyToolSearchCatalog as a, registerHeadlessToolSearchCatalog as b, buildToolSchemaDirectoryPrompt as c, ToolSearchRuntime as d, formatToolSearchControlResult as f, collectUniqueCatalogToolNames as g, clearToolSearchCatalog as h, addClientToolsToToolSearchCatalog as i, resolveToolSearchCatalogTool as l, applyToolCatalogCompaction as m, isLocalModelLeanEnabled as n, createToolSearchTools as o, addClientToolsToToolCatalog as p, resolveLocalModelLeanPreserveToolNames as r, applyToolSchemaDirectoryCatalog as s, filterLocalModelLeanTools as t, resolveToolSearchConfig as u, createToolSearchCatalogRef as v, TOOL_SEARCH_CODE_MODE_TOOL_NAME as w, restrictToolSearchCatalog as x, isDirectVisibleCatalogTool as y };
