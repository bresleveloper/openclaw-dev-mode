import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { i as sha256StableValue } from "./node-crypto-BG4u3UnX.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DrwZe41_.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { n as generateSecureHex } from "./secure-random-Dimnnrm0.mjs";
import { Q as finalizeToolTerminalPresentation, c as rewrapToolWithBeforeToolCallHook, f as runWithToolExecutionValidation, i as isPreExecutionBlockedToolResult, l as wrapToolWithBeforeToolCallHook, r as getBeforeToolCallFailureDisposition, u as captureAgentPluginRuntimeRefresh } from "./agent-tools.before-tool-call-CVkimGUL.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-v-6_jzoH.mjs";
import { c as renderToolSearchControlText, l as serializeToolSearchControlResult } from "./code-mode-json-DLneEPkt.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-GS14DlgJ.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { o as resolveAgentToolExecutionSchema, r as finalizeAgentToolAvailability } from "./agent-tool-availability-Bgm3tNkT.mjs";
import { _ as getBeforeToolCallDiagnosticOptions, p as getChannelAgentToolMeta, x as isToolWrappedWithBeforeToolCallHook } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { l as copyInternalToolResultState } from "./internal-hooks-Cr0v44EY.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import "./common-Dyxcwsy8.mjs";
import { c as resolveToolResultFailureKind, i as protectNetworkToolExecutionError, n as isToolResultError, r as isTrustedToolExecutionPreflightError } from "./tool-result-error-DGhCl3TG.mjs";
import { a as setMcpCodeModeGuestResultFromAgentResult, o as transferMcpCodeModeGuestResult, s as toToolSearchJsonSafe } from "./mcp-content-DLgC9tph.mjs";
import { a as compactToolOutputHint, c as disposeCodeModeResults, i as compactToolInputHint, n as markToolContractFailure } from "./tool-contract-error-BBuaWRXF.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { i as selectToolOutputSchema, r as readToolOutputSchemaVariants, t as captureToolOutputSelection } from "./tool-output-schema-Bc4BKbzN.mjs";
import { i as scoreLexical, o as tokenizeQuery, r as readParameterText, t as getTextLexicalIndex } from "./tool-search-index-Snv9EYBv.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { n as bindJoinedCollectorInvocation } from "./swarm-collector-capability-B06A3Pc6.mjs";
import { t as isCoreCodingSurfaceToolName } from "./core-tool-factory-descriptors-DYpD_U2M.mjs";
import { r as isAgentToolReplaySafe } from "./tool-replay-safety-QHsbda6j.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { Guard } from "typebox/guard";
import { Type } from "typebox";
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
const TOOL_SEARCH_RAW_TOOL_NAME = "tool_search";
const TOOL_DESCRIBE_RAW_TOOL_NAME = "tool_describe";
const TOOL_CALL_RAW_TOOL_NAME = "tool_call";
const MAX_TOOL_SEARCH_BATCH_RESPONSE_CHARS = 4e3;
const TOOL_SEARCH_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
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
	return entries.map((entry) => sha256StableValue([
		entry.id,
		entry.source,
		entry.sourceName ?? "",
		entry.mcp,
		entry.name,
		entry.label ?? "",
		entry.description,
		entry.directVisible === true,
		entry.source === "openclaw" ? entry.parameters : untrustedSchemaFingerprint(entry.parameters),
		entry.source === "openclaw" ? entry.outputSchema : untrustedSchemaFingerprint(entry.outputSchema)
	]).digest).toSorted().join("\n");
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
	return {
		source: "openclaw",
		sourceName: pluginId || "core"
	};
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
	const nativeTool = tool;
	const catalogTool = source !== "client" && hookContext && !isToolWrappedWithBeforeToolCallHook(nativeTool) ? wrapToolWithBeforeToolCallHook(nativeTool, hookContext) : tool;
	return {
		id: `${source}:${sourceName?.trim() || "core"}:${tool.name}`,
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
		entries: tools.filter(shouldCatalogTool).map((tool) => {
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
		counterScope: prior?.counterScope ?? generateSecureHex(12),
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
		delete params.catalogRef.directOnlyToolNames;
		delete params.catalogRef.baselineDirectOnlyToolNames;
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
	for (const tool of params.tools) {
		if (params.isVisibleControlTool(tool)) {
			visible.push(tool);
			continue;
		}
		if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) continue;
		if (shouldCatalogTool(tool) && (params.shouldCatalogTool?.(tool) ?? true)) {
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
	catalogRef.directOnlyToolNames = new Set(visible.filter((tool) => tool.catalogMode === "direct-only").map((tool) => tool.name));
	catalogRef.baselineDirectOnlyToolNames = catalogRef.directOnlyToolNames;
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
//#region src/agents/tool-search-config.ts
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 20;
function readToolSearchConfig(config) {
	const toolSearch = (isRecord(config?.tools) ? config.tools : void 0)?.toolSearch;
	if (toolSearch === void 0 || toolSearch === true) return { enabled: true };
	if (toolSearch === false) return { enabled: false };
	return isRecord(toolSearch) ? toolSearch : {};
}
function readInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function resolveToolSearchConfig(config) {
	const raw = readToolSearchConfig(config);
	const mode = raw.mode === "directory" ? "directory" : "tools";
	const configured = Object.keys(raw).some((key) => key !== "enabled");
	const maxSearchLimit = Math.min(50, readInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT));
	return {
		enabled: typeof raw.enabled === "boolean" ? raw.enabled : configured,
		mode,
		searchDefaultLimit: Math.min(maxSearchLimit, readInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT)),
		maxSearchLimit
	};
}
//#endregion
//#region src/agents/tool-search-directory.ts
const MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS = 18e3;
const TOOL_DIRECTORY_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/u;
const toolSchemaDirectoryPromptCache = /* @__PURE__ */ new WeakMap();
function applyToolSchemaDirectoryCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	if (!config.enabled || !params.tools.some((tool) => tool.name === "tool_search")) return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: () => false
	});
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
	const catalog = ctx.catalogRef?.current;
	const needle = typeof name === "string" ? name.trim() : "";
	if (!needle || !catalog) return;
	const matches = visibleCatalogEntries(catalog, options).filter((entry) => entry.name === needle);
	return matches.length === 1 ? matches[0]?.tool : void 0;
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
		guidance = omitted > 0 ? "Use tool_search to find a tool and its input signature; use tool_describe when a full schema is needed." : "Use tool_search for a compact input signature or tool_describe for a full schema.";
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
	const value = readToolSearchSelector(asNonArrayRecord(args));
	if (value === void 0) throw new ToolInputError("id must be a non-empty string.");
	return value.trim();
}
function readToolSearchCallArgs(args, catalog) {
	const params = asNonArrayRecord(args);
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
function readToolSearchArgs(params, config) {
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
	const params = asNonArrayRecord(args);
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
	const canReadSkills = entries.some((entry) => entry.source === "openclaw" && entry.sourceName === "core" && (entry.name === "read" || entry.name === "skills_read"));
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
	const recoveryText = options.recoverySurface === "catalog" ? "Use catalog.search to find a callable tool handle, then call the handle or use its describe method." : "Use tool_search to find a tool, tool_describe to inspect it, then tool_call with the exact id or name.";
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
function toolSearchEntryText(entry) {
	const parameters = entry.source === "openclaw" ? readParameterText(entry.parameters) : "";
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
let schemaValidatorModulePromise;
async function validateCatalogSchemaValue(entry, schemaName, value, outputSelection) {
	let schema = schemaName === "inputSchema" ? resolveAgentToolExecutionSchema(entry.tool, entry.parameters) : entry.outputSchema;
	if (entry.source !== "openclaw") return;
	try {
		if (schemaName === "outputSchema") {
			if (outputSelection && readToolOutputSchemaVariants(schema)?.inputProperty !== outputSelection.inputProperty) throw new Error("Tool output discriminator changed during execution.");
			schema = selectToolOutputSchema(schema, outputSelection ? { [outputSelection.inputProperty]: outputSelection.value } : void 0);
		}
		if (!schema) return;
		schemaValidatorModulePromise ??= import("./schema-validator-CoqNvcQw.mjs");
		const { validateJsonSchemaValue } = await schemaValidatorModulePromise;
		return validateJsonSchemaValue({
			schema,
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
			const index = getTextLexicalIndex(entries.map(toolSearchEntryText));
			const hits = scoreLexical(index, tokenizeQuery(query));
			const exactMatchSet = new Set(exactMatches);
			const exactEntries = exactMatches.filter((entry) => !hits.some((hit) => entries[hit.value] === entry));
			const remaining = limit - exactEntries.length;
			const ranked = remaining > 0 ? sortAndLimitBy(hits, remaining, (a, b) => Number(exactMatchSet.has(entries[b.value])) - Number(exactMatchSet.has(entries[a.value])) || Number(b.matchedLiteral) - Number(a.matchedLiteral) || b.score - a.score || entries[a.value].id.localeCompare(entries[b.value].id)).map((hit) => entries[hit.value]) : [];
			return [...exactEntries, ...ranked].slice(0, limit).map(compactEntry);
		};
		this.all = (options) => visibleCatalogEntries(resolveCatalog(this.ctx), options).map(compactToolSearchCatalogEntry);
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
		this.callValue = async (id, input, options) => projectToolResultValue((await this.call(id, input, options)).result);
		this.callExactValue = async (id, input, options) => projectToolResultValue((await this.callExactId(id, input, options)).result);
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
			const toolCallId = `tool_call:${sanitizeToolCallIdPart(options?.parentToolCallId ?? "direct")}:${entry.name}:${++this.callSequence}`;
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
					if (entry.source === "mcp") {
						if ((entry.mcp?.operation ?? "tool") === "tool") setMcpCodeModeGuestResultFromAgentResult(candidate);
						else if (options?.mcpNamespaceGuest) {
							const details = isRecord(candidate.details) ? candidate.details : void 0;
							const reason = typeof details?.reason === "string" && details.reason.trim() ? details.reason.trim() : "Tool call blocked by policy";
							throw new Error(`Tool "${entry.id}" was blocked before execution: ${reason}`);
						}
					}
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
/**
* Project a target result into the value Code Mode guests receive. Output
* contracts validate the raw details; only the guest value gains error text.
*/
function projectToolResultValue(result) {
	if (!isRecord(result) || !("details" in result)) return result;
	const { details } = result;
	if (result.isError !== true || hasErrorMessage(details)) return details;
	const message = collectTextContentBlocks(result.content).map((text) => text.trim()).filter(Boolean).join("\n");
	if (!message) return details;
	if (details === void 0 || details === null) return { message };
	return isRecord(details) ? {
		...details,
		message
	} : details;
}
function hasErrorMessage(details) {
	return isRecord(details) && [details.message, details.error].some((value) => typeof value === "string" && value.trim());
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
	return mode === "tools" && TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES.has(name);
}
/** Replace visible tools with Tool Search controls and register hidden catalog entries. */
function applyToolSearchCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	const directToolNames = new Set(normalizeStringEntries(Array.from(params.directToolNames ?? [])));
	return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: (tool) => shouldExposeControlTool(tool.name, config.mode),
		isVisibleCatalogTool: (tool) => isDirectVisibleCatalogTool(tool, directToolNames)
	});
}
/** Create Tool Search control tools for the current run/session context. */
function createToolSearchTools(ctx) {
	const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
	const runtime = new ToolSearchRuntime(ctx, config, { validateInput: true });
	return [
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
				const catalog = resolveCatalog(ctx);
				const call = readToolSearchCallArgs(args, catalog);
				try {
					if (ctx.catalogRef?.directOnlyToolNames?.has(call.id) && !catalog.entries.some((entry) => entry.id === call.id || entry.name === call.id)) throw new ToolInputError("This tool is already available directly, not through the tool catalog. Call it directly by its declared name with its declared parameters.");
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
//#endregion
export { filterLocalModelLeanTools as C, retainToolSearchImplementation as S, resolveLocalModelLeanPreserveToolNames as T, restrictToolSearchCatalog as _, applyToolSchemaDirectoryCatalog as a, TOOL_SEARCH_CONTROL_TOOL_NAMES as b, resolveToolSearchConfig as c, clearToolSearchCatalog as d, collectUniqueCatalogToolNames as f, registerHeadlessToolSearchCatalog as g, isDirectVisibleCatalogTool as h, formatToolSearchControlResult as i, addClientToolsToToolCatalog as l, createToolSearchCatalogRef as m, createToolSearchTools as n, buildToolSchemaDirectoryPrompt as o, compactToolSearchCatalogEntry as p, ToolSearchRuntime as r, resolveToolSearchCatalogTool as s, applyToolSearchCatalog as t, applyToolCatalogCompaction as u, TOOL_CALL_RAW_TOOL_NAME as v, isLocalModelLeanEnabled as w, TOOL_SEARCH_RAW_TOOL_NAME as x, TOOL_DESCRIBE_RAW_TOOL_NAME as y };
