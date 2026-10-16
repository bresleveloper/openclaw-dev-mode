import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs, k as resolveExpiresAtMsFromDurationSeconds } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as clampNumber } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-Th9Axx4o.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as PluginRuntimeCloseRetainedError } from "./runtime-close-error-DPmgR5gM.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-C9K4a_6k.mjs";
import { s as isToolExecutionAllowed, t as TOOL_EXECUTION_GATED_MESSAGE } from "./tool-policy-shared-DWHChhWM.mjs";
import { p as onAgentEventForRun } from "./agent-events-GvNTkbe3.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { r as getBeforeToolCallFailureDisposition, u as captureAgentPluginRuntimeRefresh } from "./agent-tools.before-tool-call-C25aU-xP.mjs";
import { s as NODE_FS_LIST_DIR_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { r as boundCodeModeError, s as toCodeModeJsonSafe } from "./code-mode-json-DLneEPkt.mjs";
import { n as ToolInputError, r as isTrustedToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as CODE_MODE_WAIT_TOOL_NAME, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-CpOmDfxq.mjs";
import "./common-Dyxcwsy8.mjs";
import { c as recordCodeModeToolOutcome } from "./tool-loop-detection-fg_cpzJq.mjs";
import { t as consumeMcpCodeModeGuestResult } from "./mcp-content-DLgC9tph.mjs";
import { d as createCodeModeSessionStoreAccess, f as isCodeModeSessionStoreRequest, o as toolSchemaDeclaration, p as raceWithAbortSignal, s as createCodeModeResultsAccess, t as getToolContractFailureCode } from "./tool-contract-error-EveBd172.mjs";
import { r as readToolOutputSchemaVariants } from "./tool-output-schema-Bc4BKbzN.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-a1kURD5f.mjs";
import { i as isCollectorSpawnTool } from "./swarm-collector-capability-B06A3Pc6.mjs";
import { t as resolveEligibleNodeFromList } from "./node-resolve-CiEFPm1c.mjs";
import { t as parseNodeList } from "./node-list-parse-Ro4PZqnC.mjs";
import "./code-mode-errors-0N1EOS4P.mjs";
import { createHash, randomUUID } from "node:crypto";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { tokTypes } from "acorn";
//#region src/agents/agent-run-approval-wait.ts
function observeAgentRunApprovalWait(params) {
	const approvals = /* @__PURE__ */ new Set();
	let pausedAtMs = 0;
	let completedPausedMs = 0;
	let unsubscribe = () => {};
	const state = {
		pending: false,
		get pausedMs() {
			return completedPausedMs + (state.pending ? Math.max(0, performance.now() - pausedAtMs) : 0);
		},
		dispose: () => {
			unsubscribe();
			state.onChange = void 0;
		}
	};
	if (!params.runId) return state;
	unsubscribe = onAgentEventForRun(params.runId, (event) => {
		if (event.runId !== params.runId || event.stream !== "lifecycle" || params.sessionId && event.sessionId && event.sessionId !== params.sessionId) return;
		const approvalId = event.data.approvalId;
		if (typeof approvalId !== "string" || !approvalId) return;
		if (event.data.phase === "waiting-approval") approvals.add(approvalId);
		else if (event.data.phase === "approval-resolved") approvals.delete(approvalId);
		else return;
		const pending = approvals.size > 0;
		if (pending === state.pending) return;
		if (pending) pausedAtMs = performance.now();
		else completedPausedMs += Math.max(0, performance.now() - pausedAtMs);
		state.pending = pending;
		state.onChange?.(pending);
	});
	return state;
}
//#endregion
//#region src/agents/code-mode-catalog.ts
const RESERVED_GLOBAL_NAMES = new Set("ALL_TOOLS API MCP agents catalog clearTimeout globalThis json load log namespaces nodes phase results setTimeout skills store text tools yield_control AggregateError Array ArrayBuffer Atomics BigInt BigInt64Array BigUint64Array Boolean DataView Date Error EvalError FinalizationRegistry Float32Array Float64Array Function Infinity Int16Array Int32Array Int8Array Intl JSON Map Math NaN Number Object Promise Proxy RangeError ReferenceError Reflect RegExp Set SharedArrayBuffer String Symbol SyntaxError TextDecoder TextEncoder TypeError URIError Uint16Array Uint32Array Uint8Array Uint8ClampedArray WeakMap WeakRef WeakSet WebAssembly console decodeURI decodeURIComponent encodeURI encodeURIComponent escape eval isFinite isNaN parseFloat parseInt undefined unescape".split(" "));
const RESERVED_WORDS = /* @__PURE__ */ new Set([
	...Object.values(tokTypes).flatMap((token) => token.keyword ? [token.keyword] : []),
	"await",
	"enum",
	"implements",
	"interface",
	"package",
	"private",
	"protected",
	"public",
	"static",
	"yield"
]);
function normalizedCallableBase(name) {
	const normalized = name.replace(/[^A-Za-z0-9_$]/g, "_");
	return /^[A-Za-z_$]/.test(normalized) && !normalized.startsWith("__openclaw") ? normalized : `tool_${normalized}`;
}
function suffixedCallableName(base, id, used) {
	const digest = createHash("sha256").update(id).digest("hex");
	for (let length = 8; length <= digest.length; length += 2) {
		const candidate = `${base}_${digest.slice(0, length)}`;
		if (!used.has(candidate) && !RESERVED_WORDS.has(candidate)) return candidate;
	}
	throw new Error("could not allocate a unique code mode callable name");
}
function selectEffectiveEntries(entries) {
	const winners = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (entry.source === "mcp") continue;
		const current = winners.get(entry.name);
		if (!current || entry.source === "client" && current.source !== "client") winners.set(entry.name, entry);
	}
	return [...winners.values()];
}
/** Canonical callable names shared by the prompt, guest bindings, and bridge routing. */
function createCodeModeCatalogBindings(entries, options) {
	const used = /* @__PURE__ */ new Set([...RESERVED_GLOBAL_NAMES, ...options?.reservedNames ?? []]);
	const candidates = selectEffectiveEntries(entries).map((entry) => {
		const base = normalizedCallableBase(entry.name);
		return {
			entry,
			base,
			canKeepExactName: entry.name === base && !RESERVED_WORDS.has(entry.name) && !used.has(entry.name)
		};
	}).toSorted((left, right) => Number(right.canKeepExactName) - Number(left.canKeepExactName) || left.base.localeCompare(right.base) || left.entry.id.localeCompare(right.entry.id));
	const bindings = [];
	for (const candidate of candidates) {
		let callableName = candidate.base;
		if (RESERVED_WORDS.has(callableName) || used.has(callableName)) callableName = suffixedCallableName(candidate.base, candidate.entry.id, used);
		used.add(callableName);
		const { id, source, name, label, description, input, output } = candidate.entry;
		bindings.push({
			id,
			source,
			name,
			label,
			description,
			input,
			output,
			callableName
		});
	}
	bindings.sort((left, right) => left.callableName.localeCompare(right.callableName));
	return bindings;
}
/** Execution owns guest copies and routing maps; prompt construction needs only bindings. */
function createCodeModeCatalogProjection(entries, options) {
	const bindings = createCodeModeCatalogBindings(entries, options);
	return {
		bindings,
		guestBindings: bindings.map(({ id: _id, ...binding }) => binding),
		byCallableName: new Map(bindings.map((binding) => [binding.callableName, binding])),
		byId: new Map(bindings.map((binding) => [binding.id, binding])),
		searchableIds: /* @__PURE__ */ new Set([...bindings.map((binding) => binding.id), ...options?.mcpIds ?? []])
	};
}
function redactCodeModeCatalogIds(message, bindings) {
	let redacted = message;
	for (const binding of bindings.toSorted((left, right) => right.id.length - left.id.length)) redacted = redacted.replaceAll(binding.id, binding.callableName);
	return redacted;
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
 * when the current reply ends, or on abort, catalog replacement, permission
 * changes, or restart. Never reuse reference ids from earlier turns; use store
 * for small JSON values needed later.
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
  /** Save normalized JSON for later cells in this reply. Returns the descriptor above: emit it directly;
   * its preview, shape, and count are already prepared. The full JSON stays stored.
   * Example: return await results.save(await tool({}));
   */
  save(value: unknown): Promise<CodeModeResultReference>;
  /** Read a detached JSON copy. Inspect the saved preview before using unknown fields. */
  load(id: string): Promise<unknown>;
  /** Free capacity. Missing or expired references reject. */
  delete(id: string): Promise<boolean>;
};
/** Keep a small JSON value across cells and turns in this session, including restarts.
 * Keys must be non-empty strings of at most 256 characters (otherwise TypeError).
 * Values use normal bridge JSON normalization. undefined deletes the key.
 * Encoded JSON limits: 256 KiB per value, 1 MiB total; RangeError leaves the store unchanged.
 * Writes are visible within this cell, including wait, but persist only on completed.
 * Failed, timed-out, aborted, expired, or disposed cells discard their writes.
 * A persistence failure leaves the cell completed with a warning and the run projection unchanged;
 * verify the transcript before relying on the write, since its durable outcome may be uncertain.
 * Available only in interactive cells bound to a session, never headless or restartSafe cells.
 */
declare function store(key: string, value: unknown): Promise<void>;
/** Read a detached JSON copy, or undefined when missing, including this cell's pending writes.
 * Uses the same key and availability rules as store. Network-content provenance is preserved.
 */
declare function load(key: string): Promise<unknown>;`;
const CODE_MODE_RESULTS_API_FILE = {
	path: "results.d.ts",
	description: "Temporary results for this reply and small JSON values persisted in this session.",
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
	if (typeof value === "boolean" || value === "auto") return { enabled: value };
	return isRecord(value) ? value : void 0;
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
	const params = asNonArrayRecord(args);
	const codeAlias = readNonBlankString(params.code);
	const commandAlias = readNonBlankString(params.command);
	if (codeAlias !== void 0 && commandAlias !== void 0 && codeAlias !== commandAlias) throw new ToolInputError("code and command must match when both are provided.");
	const code = commandAlias ?? codeAlias;
	if (code === void 0) throw new ToolInputError("code or command must be a non-empty string.");
	if (params.language !== void 0 || params.typecheck !== void 0) throw new ToolInputError("Code Mode accepts JavaScript only. Remove language and typecheck; use API.read(...) for tool types.");
	const awaitResults = params.awaitResults;
	if (awaitResults !== void 0 && typeof awaitResults !== "boolean") throw new ToolInputError("awaitResults must be a boolean.");
	const restartSafe = params.restartSafe;
	if (restartSafe !== void 0 && typeof restartSafe !== "boolean") throw new ToolInputError("restartSafe must be a boolean.");
	return {
		code,
		restartSafe: restartSafe === true,
		awaitResults: awaitResults === true
	};
}
function readRunId(args) {
	const params = asNonArrayRecord(args);
	const runId = params.runId ?? params.run_id;
	if (typeof runId !== "string" || !runId.trim()) throw new ToolInputError("runId must be a non-empty string.");
	return runId.trim();
}
function createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled) {
	const { apiFiles: files } = namespaceRuntime;
	return [CODE_MODE_RESULTS_API_FILE, ...swarmEnabled ? files : files.filter((file) => file.path !== "agents.d.ts")];
}
//#endregion
//#region src/agents/code-mode-tool-api.ts
/** Generate only on API.read, from the same effective schemas as describe(). */
async function createCodeModeToolApiFile(callableName, entry) {
	const trusted = entry.source === "openclaw";
	const input = trusted ? toolSchemaDeclaration(entry.parameters) : "unknown";
	const variants = trusted ? readToolOutputSchemaVariants(entry.outputSchema) : void 0;
	let optional = false;
	if (trusted) {
		const { validateJsonSchemaValue } = await import("./schema-validator-CoqNvcQw.mjs");
		try {
			optional = validateJsonSchemaValue({
				schema: entry.parameters ?? {},
				value: {}
			}).ok;
		} catch {}
	}
	let declarations = variants?.canNarrow ? createVariantDeclarations({
		callableName,
		input,
		optional,
		outputSchema: entry.outputSchema,
		variants
	}) : void 0;
	if (!declarations) {
		const output = trusted ? toolSchemaDeclaration(entry.outputSchema) : "unknown";
		declarations = [...variants ? [variants.canNarrow ? "// Action declarations exceed the shared output allowance; using the complete union." : "// Reference-bearing or structurally complex schemas retain the complete output union."] : [], `declare function ${callableName}(input${optional ? "?" : ""}: ${input}): Promise<${output}>;`];
	}
	const content = [
		"// Generated from the effective tool contract. Unsupported shapes stay unknown.",
		"// JSON Schema validation owns constraints; describe() exposes the original schema.",
		"// Values enter the guest intact or reject when program-data admission is full.",
		...declarations
	].join("\n");
	return {
		path: "tools/" + callableName + ".d.ts",
		content,
		bytes: Buffer.byteLength(content, "utf8")
	};
}
function createVariantDeclarations(params) {
	const { callableName, input, optional, outputSchema, variants } = params;
	const declarations = [];
	let outputChars = 0;
	const append = (declaration, inputChars = 0) => {
		outputChars += declaration.length + 1 - inputChars;
		if (outputChars > 32768) return false;
		declarations.push(declaration);
		return true;
	};
	const prefix = `__OpenClaw_${callableName}_`;
	const inputName = `${prefix}Input`;
	if (!append(`type ${inputName} = ${input};`, input.length)) return;
	const names = [];
	for (const [index, schema] of variants.variants.entries()) {
		const name = `${prefix}Output${index}`;
		if (!append(`type ${name} = ${toolSchemaDeclaration({
			...outputSchema,
			anyOf: [schema]
		})};`)) return;
		names.push(name);
	}
	const mappingName = `${prefix}OutputByInput`;
	if (!append(`type ${mappingName} = {`)) return;
	for (const [value, index] of variants.mapping) if (!append(`${JSON.stringify(value)}: ${names[index]};`)) return;
	if (!append("};")) return;
	const fallback = names.join(" | ");
	if (!append(`declare function ${callableName}<const Input extends ${inputName}>(input: Input): Promise<Input extends { ${JSON.stringify(variants.inputProperty)}: infer Value } ? Value extends keyof ${mappingName} ? ${mappingName}[Value] : ${fallback} : ${fallback}>;`) || !append(`declare function ${callableName}(input${optional ? "?" : ""}: ${inputName}): Promise<${fallback}>;`)) return;
	return declarations;
}
//#endregion
//#region src/agents/code-mode-bridge.ts
const loadSwarmHandlers = createLazyRuntimeNamedExport(() => import("./code-mode-swarm.runtime.js"), "codeModeSwarmHandlers");
const CODE_MODE_NODES_TOOL_ID = "openclaw:core:nodes";
function projectCodeModeNode(node) {
	return {
		id: node.nodeId,
		name: node.displayName?.trim() || node.nodeId,
		...node.platform ? { platform: node.platform } : {},
		connected: node.connected === true,
		commands: Array.isArray(node.commands) ? node.commands.filter((command) => typeof command === "string") : []
	};
}
async function callNodesTool(params) {
	return await params.runtime.callValue(CODE_MODE_NODES_TOOL_ID, params.input, {
		includeMcp: false,
		parentToolCallId: params.parentToolCallId,
		signal: params.signal,
		onUpdate: params.onUpdate,
		recoverySurface: "catalog"
	});
}
async function listCodeModeNodes(params) {
	return parseNodeList(await callNodesTool({
		...params,
		input: { action: "status" }
	}));
}
async function runNodesBridge(params) {
	const values = params.request.args;
	const action = values[0];
	if (action === "list") return (await listCodeModeNodes(params)).filter((node) => node.paired === true).map(projectCodeModeNode);
	if (action === "get") {
		const query = values[1];
		if (typeof query !== "string" || !query.trim()) throw new ToolInputError("nodes.get id or name must be a non-empty string.");
		const projected = projectCodeModeNode(resolveEligibleNodeFromList(await listCodeModeNodes(params), query, (candidate) => candidate.paired === true, {
			ineligibleExact: (id, eligibleIds) => `node "${id}" is not paired (paired node ids: ${eligibleIds})`,
			nameResolveFailed: (reason, eligibleIds) => `${reason} (paired node ids: ${eligibleIds})`,
			noneEligible: () => "no paired nodes",
			multipleEligible: (eligible) => `multiple nodes paired: ${eligible.map((candidate) => candidate.nodeId).toSorted().join(", ")}`
		}));
		return {
			id: projected.id,
			name: projected.name,
			...projected.commands.includes("fs.listDir") ? { listDirCommand: NODE_FS_LIST_DIR_COMMAND } : {}
		};
	}
	if (action === "invoke") {
		const node = values[1];
		const command = values[2];
		if (typeof node !== "string" || !node.trim()) throw new ToolInputError("nodes.invoke node id must be a non-empty string.");
		if (typeof command !== "string" || !command.trim()) throw new ToolInputError("nodes.invoke command must be a non-empty string.");
		return await callNodesTool({
			...params,
			input: {
				action: "invoke",
				node,
				invokeCommand: command,
				invokeParamsJson: JSON.stringify(values[3] ?? {})
			}
		});
	}
	throw new ToolInputError("unsupported nodes bridge action.");
}
function codeModeReplayIdForToolCall(ctx, toolCallId, code, assistantTurnId) {
	const outerRunId = ctx.runId?.trim();
	if (!outerRunId) return `cm_replay_${randomUUID()}`;
	const identity = JSON.stringify([
		ctx.sessionKey ?? "",
		ctx.sessionId ?? "",
		outerRunId,
		assistantTurnId?.trim() ?? "",
		toolCallId,
		code
	]);
	return `cm_replay_${createHash("sha256").update(identity).digest("hex").slice(0, 24)}`;
}
function isCodeModeSwarmAvailable(ctx, catalog) {
	return resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled && (!ctx.toolExecutionAllow || isToolExecutionAllowed(ctx.toolExecutionAllow, "sessions_spawn")) && catalog?.some((entry) => entry.source === "openclaw" && entry.name === "sessions_spawn") === true && ctx.catalogRef?.current?.entries.some((entry) => entry.name === "sessions_spawn" && isCollectorSpawnTool(entry.tool)) === true && !ctx.catalogRef.current.entries.some((entry) => entry.source === "client" && entry.name === "sessions_spawn");
}
function requireCodeModeSwarmEnabled(ctx) {
	if (!resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled) throw new ToolInputError("code mode swarm globals are disabled.");
	if (ctx.toolExecutionAllow && !isToolExecutionAllowed(ctx.toolExecutionAllow, "sessions_spawn")) throw new ToolInputError(TOOL_EXECUTION_GATED_MESSAGE);
}
/** Recognize explicit required intent only on the authorized core tool bindings. */
function requiresCodeModeCompletion(requests, catalogProjection) {
	return requests.some((request) => {
		if (request.method !== "callValue" || !isRecord(request.args[1]) || request.args[1].awaitResults !== true) return false;
		const binding = typeof request.args[0] === "string" ? catalogProjection.byCallableName.get(request.args[0]) : void 0;
		return binding?.id === "openclaw:core:exec" || binding?.id === "openclaw:core:agents_wait";
	});
}
async function runBridgeRequest(params) {
	const catalogProjection = params.catalogProjection;
	const sessionStoreRequest = isCodeModeSessionStoreRequest(params.request);
	try {
		params.signal?.throwIfAborted();
		const values = Array.isArray(params.request.args) ? params.request.args : [];
		let value;
		switch (params.request.method) {
			case "resultSave":
			case "resultLoad":
			case "resultDelete":
				if (sessionStoreRequest) {
					if (!params.sessionStore) throw new ToolInputError("Code Mode store/load is unavailable in headless execution; use an interactive session-bound cell.");
					if (params.request.method === "resultSave") await params.sessionStore.save(values[2], values[0], params.runtime.hasNetworkContent());
					else if (params.request.method === "resultLoad") {
						const loaded = await params.sessionStore.load(values[0]);
						if (loaded.networkContent) params.runtime.observeNetworkContent(params.parentToolCallId);
						value = loaded.value === void 0 ? {} : { value: loaded.value };
					} else await params.sessionStore.delete(values[0]);
				} else if (params.request.method === "resultSave") value = params.results.save(values[0], params.runtime.hasNetworkContent());
				else if (params.request.method === "resultLoad") {
					const loaded = params.results.load(values[0]);
					if (loaded.networkContent) params.runtime.observeNetworkContent(params.parentToolCallId);
					value = loaded.value;
				} else value = params.results.delete(values[0]);
				break;
			case "search": {
				const query = values[0];
				if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
				const options = isRecord(values[1]) ? values[1] : void 0;
				const spelling = query.trim();
				const exact = spelling.toLowerCase();
				const mcpBindings = params.namespaceRuntime.mcpBindings;
				const mcpRoutes = [...mcpBindings];
				const exactMcpId = (mcpRoutes.find(([, binding]) => binding.callableName === spelling) ?? mcpRoutes.find(([, binding]) => binding.callableName.toLowerCase() === exact))?.[0];
				const exactBinding = exactMcpId ? void 0 : catalogProjection.byCallableName.get(spelling) ?? catalogProjection.bindings.find((binding) => binding.name === spelling) ?? catalogProjection.bindings.find((binding) => binding.name.toLowerCase() === exact || binding.callableName.toLowerCase() === exact);
				const matches = await params.runtime.search(exactBinding?.id ?? exactMcpId ?? query, {
					limit: typeof options?.limit === "number" ? options.limit : void 0,
					allowedIds: catalogProjection.searchableIds,
					parentToolCallId: params.parentToolCallId
				});
				value = exactBinding ? [exactBinding.callableName] : matches.map((entry) => {
					const binding = catalogProjection.byId.get(entry.id);
					if (binding) return binding.callableName;
					const mcp = mcpBindings.get(entry.id);
					if (!mcp) throw new ToolInputError("Search result has no callable namespace route.");
					return {
						callableName: mcp.callableName,
						namespaceId: mcp.namespaceId,
						path: mcp.path,
						apiPath: mcp.apiPath,
						name: entry.mcp?.toolName ?? entry.name,
						source: "mcp",
						description: truncateUtf16Safe(entry.description, 512)
					};
				});
				break;
			}
			case "describe": {
				const callableName = values[0];
				if (typeof callableName !== "string") throw new ToolInputError("describe callable name must be a string.");
				const binding = catalogProjection.byCallableName.get(callableName);
				if (!binding) throw new ToolInputError(`Unknown catalog function: ${callableName}.`);
				const { id: _id, sourceName: _sourceName, mcp: _mcp, ...guestDescription } = await params.runtime.describe(binding.id, {
					includeMcp: false,
					recoverySurface: "catalog",
					parentToolCallId: params.parentToolCallId
				});
				value = values[1] === "declaration" ? await createCodeModeToolApiFile(binding.callableName, guestDescription) : {
					...guestDescription,
					callableName: binding.callableName
				};
				break;
			}
			case "callValue": {
				const callableName = values[0];
				if (typeof callableName !== "string") throw new ToolInputError("catalog callable name must be a string.");
				const binding = catalogProjection.byCallableName.get(callableName);
				if (!binding) throw new ToolInputError(`Unknown catalog function: ${callableName}.`);
				let input = values[1] ?? {};
				if (binding.id === "openclaw:core:exec" && isRecord(input) && input.background !== true && params.completionRequired) input = {
					...input,
					awaitResults: true
				};
				else if (binding.source === "openclaw" && binding.name === "exec" && binding.input?.includes("yieldMs") === true && isRecord(input) && input.background !== true && input.yieldMs === void 0) input = {
					...input,
					yieldMs: Math.max(1, Math.floor(params.remainingMs) - 500)
				};
				if (binding.id === "openclaw:core:agents_wait" && params.completionRequired && isRecord(input) && input.timeoutSeconds === void 0) input = {
					...input,
					awaitResults: true
				};
				value = await params.runtime.callExactValue(binding.id, input, {
					recoverySurface: "catalog",
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate
				});
				break;
			}
			case "nodes":
				value = await runNodesBridge(params);
				break;
			case "yield":
				value = {
					status: "yielded",
					reason: values[0] ?? null
				};
				break;
			case "namespace": {
				const namespaceId = values[0];
				const pathLocal = values[1];
				const callArgs = values[2];
				if (typeof namespaceId !== "string") throw new ToolInputError("namespace id must be a string.");
				if (!Array.isArray(pathLocal) || !pathLocal.every((entry) => typeof entry === "string")) throw new ToolInputError("namespace path must be an array of strings.");
				value = await params.namespaceRuntime.invoke(namespaceId, pathLocal, Array.isArray(callArgs) ? callArgs : [], async (request) => {
					const called = await params.runtime.callExactId(request.catalogId, request.input, {
						recoverySurface: "catalog",
						parentToolCallId: params.parentToolCallId,
						signal: params.signal,
						onUpdate: params.onUpdate,
						mcpNamespaceGuest: true
					});
					const guestResult = consumeMcpCodeModeGuestResult(called.result);
					if (guestResult === void 0) throw new ToolInputError("MCP namespace tool result is missing its owned guest projection.");
					return guestResult;
				});
				if (namespaceId === "mcp" && pathLocal.at(-1) === "$api") params.runtime.observeNetworkContent(params.parentToolCallId);
				break;
			}
			case "agentSpawn":
			case "agentWait":
			case "swarmNote": {
				const { signal } = params;
				requireCodeModeSwarmEnabled(params.ctx);
				signal?.throwIfAborted();
				const handlers = await loadSwarmHandlers();
				signal?.throwIfAborted();
				requireCodeModeSwarmEnabled(params.ctx);
				value = await handlers[params.request.method](params);
				break;
			}
			case "skillsList": {
				if (!catalogProjection.bindings.some((entry) => entry.source === "openclaw" && entry.name === "skills_search")) throw new ToolInputError("skills_search is not available in this run.");
				if (params.ctx.toolExecutionAllow && !isToolExecutionAllowed(params.ctx.toolExecutionAllow, "skills_search")) throw new ToolInputError(TOOL_EXECUTION_GATED_MESSAGE);
				const offset = values[0] ?? 0;
				if (typeof offset !== "number" || !Number.isSafeInteger(offset) || offset < 0) throw new ToolInputError("skills.list offset must be a non-negative integer.");
				value = (params.ctx.codeModeSkills ?? []).slice(offset, offset + 20).map(({ name, description, location }) => ({
					name,
					description: description.slice(0, 512),
					location
				}));
				break;
			}
			case "skillsSearch":
			case "skillsRead": {
				const toolName = params.request.method === "skillsRead" ? "skills_read" : "skills_search";
				const binding = catalogProjection.bindings.find((entry) => entry.source === "openclaw" && entry.name === toolName);
				if (!binding) throw new ToolInputError(`${toolName} is not available in this run.`);
				const result = (await params.runtime.callExactId(binding.id, params.request.method === "skillsRead" ? { name: values[0] } : {
					query: values[0],
					...values[1] === void 0 ? {} : { limit: values[1] }
				}, {
					recoverySurface: "catalog",
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate
				})).result;
				if (!isRecord(result) || result.isError || !isRecord(result.details)) throw new ToolInputError("Installed skill request failed.");
				value = params.request.method === "skillsRead" ? result.details.content : result.details;
				break;
			}
			case "sleep": {
				const delay = values[0];
				if (typeof delay !== "number" || !Number.isFinite(delay) || delay < 0) throw new ToolInputError("setTimeout delay must be a non-negative finite number.");
				value = await setTimeout$1(resolveSafeTimeoutDelayMs(delay, { minMs: 0 }), null, { signal: params.signal });
				break;
			}
		}
		params.reply.settle(true, value);
	} catch (error) {
		const classified = getBeforeToolCallFailureDisposition(error) !== void 0 && error instanceof Error ? error.cause ?? error : error;
		params.reply.settle(false, {
			message: redactCodeModeCatalogIds(formatErrorMessage(error), catalogProjection.bindings),
			code: sessionStoreRequest && error instanceof RangeError ? "store_range" : sessionStoreRequest && error instanceof TypeError ? "store_type" : getToolContractFailureCode(classified) ?? (isTrustedToolInputError(classified) ? "invalid_input" : "tool_error"),
			effectStatus: "unknown"
		});
	}
}
//#endregion
//#region src/agents/code-mode-program-data.ts
const INBOX_FULL_JSON = JSON.stringify("Code Mode program-data budget exceeded. Paginate or narrow the tool request, or consume pending replies before requesting more data.");
const CANCELED_JSON = JSON.stringify("Code Mode tool canceled.");
/** Logical encoded-JSON allowance, not a bound on host RSS or guest memory. */
var CodeModeProgramDataInbox = class {
	constructor(config) {
		this.bytes = 0;
		this.closed = false;
		this.closers = /* @__PURE__ */ new Set();
		this.maxBytes = Math.min(config.memoryLimitBytes, config.maxSnapshotBytes);
		this.errorBytes = Math.min(config.maxOutputBytes, this.maxBytes);
	}
	createReply(id) {
		let state = "pending";
		let reply;
		let bytes = 0;
		const clearPayload = () => {
			if (reply) reply.json = "";
			reply = void 0;
			this.bytes -= bytes;
			bytes = 0;
		};
		const release = () => {
			if (state === "released") return;
			clearPayload();
			state = "released";
			this.closers.delete(close);
		};
		const close = () => {
			if (state !== "delivering") release();
		};
		const lease = {
			settle: (ok, value) => {
				if (this.closed || state !== "pending") return;
				const json = JSON.stringify(ok ? toCodeModeJsonSafe(value) : normalizeReplyError(value, this.errorBytes)) ?? "null";
				if (this.closed || state !== "pending") return;
				const required = Buffer.byteLength(json, "utf8");
				if (required > this.maxBytes - this.bytes) reply = {
					id,
					ok: false,
					json: INBOX_FULL_JSON
				};
				else {
					bytes = required;
					this.bytes += bytes;
					reply = {
						id,
						ok,
						json
					};
				}
				state = "ready";
			},
			take: () => {
				if (state !== "ready" && state !== "canceled" || !reply) throw new Error("Code Mode reply is unavailable.");
				state = "delivering";
				return reply;
			},
			release,
			cancel: () => {
				if (this.closed) {
					close();
					return;
				}
				if (state !== "pending" && state !== "ready") return;
				clearPayload();
				reply = {
					id,
					ok: false,
					json: CANCELED_JSON
				};
				state = "canceled";
			}
		};
		if (this.closed) release();
		else this.closers.add(close);
		return lease;
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		for (const close of this.closers) close();
	}
};
function normalizeReplyError(value, maxBytes) {
	if (value !== null && typeof value === "object" && "message" in value && "code" in value) return {
		message: boundCodeModeError(String(value.message), maxBytes),
		code: String(value.code),
		effectStatus: "unknown"
	};
	return boundCodeModeError(String(value), maxBytes);
}
//#endregion
//#region src/agents/code-mode-state.ts
const MAX_ACTIVE_CODE_MODE_RUNS = 64;
const MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS = 4;
const BRIDGE_CLOSED_MESSAGE = "Code Mode tool canceled, expired, or owner lost; start a new run.";
const log = createSubsystemLogger("agents/code-mode");
const activeRuns = /* @__PURE__ */ new Map();
const resumingRunIds = /* @__PURE__ */ new Set();
const liveRunOwners = /* @__PURE__ */ new Set();
let activeRunReservations = 0;
let nextPendingBridgeSettlementSequence = 0;
let activeRunExpiryTimer;
/** Catalog ownership spans worker legs and continuations; parking never closes the cell. */
function createCodeModeRunOwner(ctx, config, initialRequired = false, enableSessionStore = false) {
	let required = initialRequired;
	const inbox = new CodeModeProgramDataInbox(config);
	const releaseRuntimeRefresh = captureAgentPluginRuntimeRefresh().hold();
	const runId = `cm_${randomUUID()}`;
	const closed = new AbortController();
	const approvalWait = observeAgentRunApprovalWait(ctx);
	const signal = ctx.abortSignal ? AbortSignal.any([closed.signal, ctx.abortSignal]) : closed.signal;
	const sessionStore = enableSessionStore ? createCodeModeSessionStoreAccess(ctx, signal) : void 0;
	const disposers = ctx.catalogRef ? ctx.catalogRef.onDispose ??= /* @__PURE__ */ new Set() : void 0;
	let releaseCall = () => {};
	let continuation;
	let closing;
	const executions = /* @__PURE__ */ new Set();
	const disposals = /* @__PURE__ */ new Map();
	const cleanupFailures = /* @__PURE__ */ new Map();
	const disposeContinuation = (value) => {
		const current = disposals.get(value);
		if (current) return current;
		const disposal = Promise.resolve().then(() => value.dispose());
		disposals.set(value, disposal);
		disposal.then(() => {
			disposals.delete(value);
			cleanupFailures.delete(value);
		}, (error) => {
			cleanupFailures.set(value, error);
			disposals.delete(value);
		});
		return disposal;
	};
	const retainContinuation = async (next) => {
		const previous = continuation;
		continuation = signal.aborted ? void 0 : next;
		const retired = [];
		if (previous && previous !== continuation) retired.push(disposeContinuation(previous));
		if (signal.aborted && next && next !== previous) retired.push(disposeContinuation(next));
		const failures = (await Promise.allSettled(retired)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError(failures, "Code Mode continuation cleanup failed");
	};
	const close = (reason) => {
		if (closing) return closing;
		const completion = createDeferredCore();
		closing = completion.promise;
		closing.catch((error) => {
			log.error("Code Mode cleanup failed", {
				runId,
				error: formatErrorMessage(error),
				failures: [...cleanupFailures.values()].map(formatErrorMessage)
			});
		});
		if (!closed.signal.aborted) {
			releaseCall();
			approvalWait.dispose();
			signal.removeEventListener("abort", onLifetimeAbort);
			disposers?.delete(onCatalogDispose);
			closed.abort(reason);
			inbox.close();
			sessionStore?.close();
			const parked = activeRuns.get(runId);
			if (parked?.owner === owner) {
				activeRuns.delete(runId);
				cancelPendingBridgeStates(parked.pending);
			}
			scheduleActiveRunExpiry();
		}
		for (const failed of cleanupFailures.keys()) disposeContinuation(failed);
		const retained = continuation;
		continuation = void 0;
		if (retained) disposeContinuation(retained);
		Promise.resolve().then(async () => {
			await Promise.allSettled(executions);
			while (disposals.size) await Promise.allSettled(disposals.values());
			if (cleanupFailures.size) throw new PluginRuntimeCloseRetainedError(new AggregateError(cleanupFailures.values(), "Code Mode continuation cleanup failed"));
			releaseRuntimeRefresh();
			liveRunOwners.delete(owner);
		}).then(completion.resolve, (error) => {
			closing = void 0;
			completion.reject(error);
		});
		return closing;
	};
	const onLifetimeAbort = () => {
		close(signal.reason);
	};
	const onCatalogDispose = () => {
		close();
	};
	const owner = {
		get completionRequired() {
			return required;
		},
		requireCompletion() {
			signal.throwIfAborted();
			required = true;
		},
		runId,
		signal,
		inbox,
		results: createCodeModeResultsAccess(ctx, config),
		sessionStore,
		close,
		retainContinuation,
		runExecution(operation) {
			const execution = Promise.resolve().then(() => {
				signal.throwIfAborted();
				return operation();
			}).then(async (result) => {
				await retainContinuation(result.status === "waiting" ? result.continuation : void 0);
				return result;
			});
			executions.add(execution);
			execution.then(() => executions.delete(execution), () => executions.delete(execution));
			return execution;
		},
		approvalWait,
		bindCall(callSignal) {
			releaseCall();
			if (signal.aborted) return signal;
			const combined = callSignal ? AbortSignal.any([signal, callSignal]) : signal;
			const release = () => combined.removeEventListener("abort", onAbort);
			const onAbort = () => {
				if (releaseCall === release) close(combined.reason);
			};
			releaseCall = release;
			combined.addEventListener("abort", onAbort, { once: true });
			if (combined.aborted) onAbort();
			return signal;
		}
	};
	liveRunOwners.add(owner);
	disposers?.add(onCatalogDispose);
	signal.addEventListener("abort", onLifetimeAbort, { once: true });
	if (!ctx.catalogRef?.current || signal.aborted) close(signal.reason);
	return owner;
}
function scheduleActiveRunExpiry() {
	if (activeRunExpiryTimer) {
		clearTimeout(activeRunExpiryTimer);
		activeRunExpiryTimer = void 0;
	}
	let nextExpiresAt = Number.POSITIVE_INFINITY;
	for (const state of activeRuns.values()) nextExpiresAt = Math.min(nextExpiresAt, state.expiresAt);
	if (!Number.isFinite(nextExpiresAt)) return;
	activeRunExpiryTimer = setTimeout(() => {
		activeRunExpiryTimer = void 0;
		removeExpiredRuns();
		scheduleActiveRunExpiry();
	}, Math.max(1, nextExpiresAt - Date.now()));
	activeRunExpiryTimer.unref?.();
}
function removeExpiredRuns(now = Date.now()) {
	for (const [runId, state] of activeRuns) if (!isFutureDateTimestampMs(state.expiresAt, { nowMs: now })) {
		if (state.pending?.some((entry) => entry.method === "agentWait" && !entry.settled) && state.agentWaitRetainUntil !== void 0 && isFutureDateTimestampMs(state.agentWaitRetainUntil, { nowMs: now })) {
			const renewed = resolveExpiresAtMsFromDurationSeconds(state.config.snapshotTtlSeconds, { nowMs: now });
			if (renewed !== void 0) {
				state.expiresAt = Math.min(renewed, state.agentWaitRetainUntil);
				continue;
			}
		}
		disposeCodeModeRun(runId);
	}
}
function disposeCodeModeRun(runId) {
	const state = activeRuns.get(runId);
	activeRuns.delete(runId);
	state?.owner.close();
	cancelPendingBridgeStates(state?.pending ?? []);
	resumingRunIds.delete(runId);
	scheduleActiveRunExpiry();
}
/** Cancel every cell before its Gateway-owned runtimes disappear. */
async function disposeAllCodeModeRuns() {
	const closing = [...liveRunOwners].map((owner) => owner.close());
	activeRuns.clear();
	resumingRunIds.clear();
	scheduleActiveRunExpiry();
	const failures = (await Promise.allSettled(closing)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length) throw new AggregateError(failures, "Code Mode runs failed to close");
}
/** Abort each bridge call whose result has not already reached its guest. */
function cancelPendingBridgeStates(pending) {
	for (const entry of pending) if (entry.settled) entry.reply.release();
	else entry.cancel?.();
}
/** Apply restored-guest cancellation to the parent-owned host operations. */
function cancelPendingBridgeStatesById(pending, canceledRequestIds) {
	if (canceledRequestIds.length === 0) return;
	const canceled = new Set(canceledRequestIds);
	const discarded = pending.filter((entry) => canceled.has(entry.id));
	cancelPendingBridgeStates(discarded);
	for (const entry of discarded) entry.reply.release();
	pending.splice(0, pending.length, ...pending.filter((entry) => !canceled.has(entry.id)));
}
/** Deliver bridge responses in actual settlement order, not request order. */
function takeSettledBridgeRequests(pending) {
	const leases = pending.filter((entry) => entry.settled).toSorted((left, right) => (left.settledSequence ?? 0) - (right.settledSequence ?? 0)).map((entry) => entry.reply);
	const requests = [];
	const release = () => {
		for (const lease of leases) lease.release();
		leases.length = 0;
		requests.length = 0;
	};
	try {
		for (const lease of leases) requests.push(lease.take());
		return {
			requests,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Keep every dispatched bridge call required until its guest has received the result. */
function pendingBridgeStatesForSettlement(pending, settlementMode) {
	if (settlementMode.kind === "awaiting") return pending;
	const requiredRequestIds = new Set(settlementMode.requiredRequestIds);
	return pending.filter((entry) => requiredRequestIds.has(entry.id));
}
/** Await the shared guest frontier without guessing native Promise ownership. */
function waitForPendingBridgeSettlement(pending, settlementMode, signal) {
	const required = pendingBridgeStatesForSettlement(pending, settlementMode);
	const outstanding = required.filter((entry) => !entry.settled);
	if (signal?.aborted || outstanding.length === 0 || settlementMode.kind === "awaiting" && outstanding.length !== required.length) return Promise.resolve();
	return new Promise((resolve) => {
		const finish = () => {
			for (const entry of outstanding) entry.onSettlement = void 0;
			signal?.removeEventListener("abort", finish);
			resolve();
		};
		const onSettlement = () => {
			if (settlementMode.kind === "awaiting" || outstanding.every((entry) => entry.settled)) finish();
		};
		for (const entry of outstanding) entry.onSettlement = onSettlement;
		signal?.addEventListener("abort", finish, { once: true });
	});
}
function reserveActiveRunSlot(ownedRunId) {
	if (ownedRunId === void 0) {
		removeExpiredRuns();
		if (activeRuns.size + activeRunReservations >= MAX_ACTIVE_CODE_MODE_RUNS) throw new ToolInputError("too many suspended code mode runs.");
	} else {
		if (!activeRuns.get(ownedRunId)) throw new ToolInputError("code mode run is unavailable or expired.");
		activeRuns.delete(ownedRunId);
		scheduleActiveRunExpiry();
	}
	activeRunReservations += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		activeRunReservations = Math.max(0, activeRunReservations - 1);
	};
}
function pendingBridgeRequestsReplaySafe(pending, runtime, catalogProjection) {
	return pending.every((request) => isPendingBridgeRequestReplaySafe(request, runtime, catalogProjection));
}
function isPendingBridgeRequestReplaySafe(request, runtime, catalogProjection) {
	if (request.method === "search" || request.method === "describe" || request.method === "yield" || request.method === "agentSpawn" || request.method === "agentWait" || request.method === "skillsList" || request.method === "skillsSearch" || request.method === "skillsRead" || request.method === "sleep") return true;
	if (request.method === "nodes") return request.args[0] === "list" || request.args[0] === "get";
	if (request.method !== "callValue") return false;
	const callableName = Array.isArray(request.args) ? request.args[0] : void 0;
	if (typeof callableName !== "string") return false;
	const binding = catalogProjection.byCallableName.get(callableName);
	return binding ? runtime.isReplaySafeExactId(binding.id) : false;
}
function createPendingBridgeStates(pendingRequests, params) {
	return pendingRequests.map((request) => {
		const reply = params.inbox.createReply(request.id);
		const abortController = new AbortController();
		const signal = abortController.signal;
		const onAbort = () => {
			reply.cancel();
			abortController.abort(params.signal.reason);
		};
		params.signal.addEventListener("abort", onAbort, { once: true });
		if (params.signal.aborted) onAbort();
		if (request.method !== "sleep") params.bridgeDispatch.started = true;
		const bridgeCall = runBridgeRequest({
			runtime: params.runtime,
			results: params.results,
			sessionStore: params.sessionStore,
			catalogProjection: params.catalogProjection,
			namespaceRuntime: params.namespaceRuntime,
			parentToolCallId: params.parentToolCallId,
			codeModeRunId: params.codeModeRunId,
			reply,
			remainingMs: Math.max(1, params.remainingMs),
			completionRequired: params.completionRequired,
			ctx: params.ctx,
			request,
			signal,
			onUpdate: params.onUpdate
		});
		const completion = raceWithAbortSignal(bridgeCall, signal).catch(() => {
			reply.settle(false, BRIDGE_CLOSED_MESSAGE);
		});
		const state = {
			...request,
			reply,
			cancel: () => {
				reply.cancel();
				abortController.abort(/* @__PURE__ */ new Error(BRIDGE_CLOSED_MESSAGE));
			}
		};
		completion.then(() => {
			params.signal.removeEventListener("abort", onAbort);
			state.settledSequence = ++nextPendingBridgeSettlementSequence;
			state.settled = true;
			state.cancel = void 0;
			state.args = [];
			if (state.method === "agentWait" && params.activeRunId) {
				const active = activeRuns.get(params.activeRunId);
				if (active?.pending.includes(state)) {
					const renewed = resolveExpiresAtMsFromDurationSeconds(active.config.snapshotTtlSeconds, { nowMs: Date.now() });
					if (renewed !== void 0) {
						active.expiresAt = renewed;
						scheduleActiveRunExpiry();
					}
				}
			}
			state.onSettlement?.();
			state.onSettlement = void 0;
		});
		return state;
	});
}
function storeSuspendedRun(params) {
	const runId = params.owner.runId;
	if (params.owner.completionRequired) throw new ToolInputError("Required Code Mode work cannot publish an unfinished continuation.");
	if (params.owner.signal.aborted) {
		cancelPendingBridgeStates(params.pending);
		return codeModeAbortedResult(params);
	}
	const now = Date.now();
	const expiresAt = resolveExpiresAtMsFromDurationSeconds(params.config.snapshotTtlSeconds, { nowMs: now });
	if (expiresAt === void 0) throw new ToolInputError("code mode run expiry is unavailable.");
	const agentWaitRetainUntil = params.pending.some((entry) => entry.method === "agentWait" && !entry.settled) ? resolveExpiresAtMsFromDurationSeconds(params.config.snapshotTtlSeconds * MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS, { nowMs: now }) : void 0;
	const state = {
		...params,
		runId,
		expiresAt,
		agentWaitRetainUntil
	};
	const result = params.output.takeResult({
		status: "waiting",
		runId,
		reason: codeModeWaitingReason(params.pending),
		pendingToolCalls: pendingToolCalls(params.pending),
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	}, {}, params.runtime.hasNetworkContent());
	activeRuns.set(runId, state);
	scheduleActiveRunExpiry();
	return recordCodeModeToolOutcome(result, result, params.pending);
}
function codeModeAbortedResult(params) {
	return params.output.takeResult({
		status: "failed",
		code: "aborted",
		failurePhase: params.bridgeDispatch.started ? "bridge" : "host",
		bridgeDispatchStarted: params.bridgeDispatch.started,
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	}, { error: "code mode execution aborted" }, params.runtime.hasNetworkContent());
}
function codeModeWaitingReason(pending) {
	return pending.length > 0 && pending.every((entry) => entry.method === "yield") ? "yield" : "pending_tools";
}
function pendingToolCalls(pending) {
	return pending.filter((entry) => !entry.settled).map((entry) => ({
		id: entry.id,
		method: entry.method
	}));
}
function telemetry(runtime) {
	return {
		...runtime.telemetry(),
		visibleTools: [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME]
	};
}
//#endregion
export { toToolSearchConfig as A, createCodeModeApiFilesForRun as C, readRunId as D, readPositiveInteger as E, createCodeModeCatalogProjection as M, observeAgentRunApprovalWait as N, resolveCodeModeConfig as O, MAX_HEADLESS_WALL_CLOCK_MS as S, readCode as T, CODE_MODE_NODES_TOOL_ID as _, createCodeModeRunOwner as a, requiresCodeModeCompletion as b, pendingBridgeRequestsReplaySafe as c, reserveActiveRunSlot as d, resumingRunIds as f, waitForPendingBridgeSettlement as g, telemetry as h, codeModeAbortedResult as i, createCodeModeCatalogBindings as j, resolveCodeModeHeadlessConfig as k, pendingBridgeStatesForSettlement as l, takeSettledBridgeRequests as m, cancelPendingBridgeStates as n, createPendingBridgeStates as o, storeSuspendedRun as p, cancelPendingBridgeStatesById as r, disposeAllCodeModeRuns as s, activeRuns as t, removeExpiredRuns as u, codeModeReplayIdForToolCall as v, isCodeModeEngagedForModel as w, DEFAULT_HEADLESS_WALL_CLOCK_MS as x, isCodeModeSwarmAvailable as y };
