import { g as isFutureDateTimestampMs, k as resolveExpiresAtMsFromDurationSeconds } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-BPNHa36e.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as isToolExecutionAllowed, t as TOOL_EXECUTION_GATED_MESSAGE } from "./tool-policy-shared-auQCQEhM.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.mjs";
import { s as NODE_FS_LIST_DIR_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { p as onAgentEventForRun } from "./agent-events-BOSJcayE.mjs";
import { d as captureAgentPluginRuntimeRefresh, r as getBeforeToolCallFailureDisposition } from "./agent-tools.before-tool-call-Ub1aezaD.mjs";
import { r as boundCodeModeError, s as toCodeModeJsonSafe } from "./code-mode-json-Cek5lI0P.mjs";
import { n as ToolInputError, r as isTrustedToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as CODE_MODE_WAIT_TOOL_NAME, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-fvyqQnLi.mjs";
import "./common-XfKigJno.mjs";
import { t as consumeMcpCodeModeGuestResult } from "./mcp-content-BHUhnILn.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-C7Yo0FcH.mjs";
import { o as toolSchemaDeclaration, s as createCodeModeResultsAccess, t as getToolContractFailureCode } from "./tool-contract-error-CR9KN-gT.mjs";
import { r as readToolOutputSchemaVariants } from "./tool-output-schema-DALtkl0-.mjs";
import { i as isCollectorSpawnTool } from "./swarm-collector-capability-BUvTLaKn.mjs";
import { n as decodeSkillXml } from "./skill-contract-BkCILPDQ.mjs";
import { t as resolveEligibleNodeFromList } from "./node-resolve-Cy3jnd18.mjs";
import { t as parseNodeList } from "./node-list-parse-uI7vQ62q.mjs";
import { t as raceWithAbortSignal } from "./agent-tools.abort-g8BtZl1O.mjs";
import { readFile } from "node:fs/promises";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { createHash, randomUUID } from "node:crypto";
import { tokTypes } from "acorn";
//#region src/agents/code-mode-skills.ts
const SKILL_NAME_PATTERN = /^[ ]{4}<name>(.*)<\/name>$/mu;
const SKILL_LOCATION_PATTERN = /^[ ]{4}<location>(.*)<\/location>$/mu;
function readSkillField(block, pattern) {
	const match = pattern.exec(block)?.[1];
	return match === void 0 ? void 0 : decodeSkillXml(match);
}
/** Select Code Mode skills from the exact catalog rendered into this run's prompt. */
function resolveCodeModeSkills(params) {
	const catalog = /<available_skills>\n([\s\S]*?)\n<\/available_skills>/u.exec(params.skillsPrompt)?.[1];
	if (!catalog) return [];
	const candidatesByName = new Map(params.candidates.map((skill) => [skill.name, skill]));
	const result = [];
	for (const match of catalog.matchAll(/^[ ]{2}<skill>\n([\s\S]*?)\n[ ]{2}<\/skill>$/gmu)) {
		const block = match[1] ?? "";
		const name = readSkillField(block, SKILL_NAME_PATTERN);
		const location = readSkillField(block, SKILL_LOCATION_PATTERN);
		const source = name ? candidatesByName.get(name) : void 0;
		if (!name || !location || !source) continue;
		result.push({
			name,
			description: [source.description, source.locationNote].filter(Boolean).join("\n"),
			location,
			source: {
				filePath: source.filePath,
				readContent: source.readContent
			},
			reader: params.reader
		});
	}
	return result;
}
async function readCodeModeSkill(skill, signal) {
	if (typeof skill.source.readContent === "string") return skill.source.readContent;
	if (skill.reader) return await skill.reader({
		location: skill.location,
		signal
	});
	return await readFile(skill.source.filePath, {
		encoding: "utf8",
		signal
	});
}
//#endregion
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
const RESERVED_GLOBAL_NAMES = new Set("ALL_TOOLS API MCP agents catalog clearTimeout globalThis json log namespaces nodes phase results setTimeout skills text tools yield_control AggregateError Array ArrayBuffer Atomics BigInt BigInt64Array BigUint64Array Boolean DataView Date Error EvalError FinalizationRegistry Float32Array Float64Array Function Infinity Int16Array Int32Array Int8Array Intl JSON Map Math NaN Number Object Promise Proxy RangeError ReferenceError Reflect RegExp Set SharedArrayBuffer String Symbol SyntaxError TextDecoder TextEncoder TypeError URIError Uint16Array Uint32Array Uint8Array Uint8ClampedArray WeakMap WeakRef WeakSet WebAssembly console decodeURI decodeURIComponent encodeURI encodeURIComponent escape eval isFinite isNaN parseFloat parseInt undefined unescape".split(" "));
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
//#region src/agents/code-mode-tool-api.ts
/** Generate only on API.read, from the same effective schemas as describe(). */
async function createCodeModeToolApiFile(callableName, entry) {
	const trusted = entry.source === "openclaw";
	const input = trusted ? toolSchemaDeclaration(entry.parameters) : "unknown";
	const variants = trusted ? readToolOutputSchemaVariants(entry.outputSchema) : void 0;
	let optional = false;
	if (trusted) {
		const { validateJsonSchemaValue } = await import("./schema-validator-CLuit6S4.mjs");
		try {
			optional = validateJsonSchemaValue({
				schema: entry.parameters ?? {},
				cacheKey: `code-mode-omitted-input:${JSON.stringify(entry.parameters)}`,
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
async function runBridgeRequest(params) {
	const catalogProjection = params.catalogProjection;
	try {
		params.signal?.throwIfAborted();
		const values = Array.isArray(params.request.args) ? params.request.args : [];
		let value;
		switch (params.request.method) {
			case "resultSave":
			case "resultLoad":
			case "resultDelete":
				if (params.request.method === "resultSave") value = params.results.save(values[0], params.runtime.hasNetworkContent());
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
				if (binding.source === "openclaw" && binding.name === "exec" && binding.input?.includes("yieldMs") === true && isRecord(input) && input.background !== true && input.yieldMs === void 0) input = {
					...input,
					yieldMs: Math.max(1, Math.min(1e3, Math.floor(params.remainingMs / 4)))
				};
				const called = await params.runtime.callExactId(binding.id, input, {
					recoverySurface: "catalog",
					parentToolCallId: params.parentToolCallId,
					signal: params.signal,
					onUpdate: params.onUpdate
				});
				value = isRecord(called.result) && "details" in called.result ? called.result.details : called.result;
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
						onUpdate: params.onUpdate
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
			case "skillsList":
				value = (params.ctx.codeModeSkills ?? []).map(({ name, description, location }) => ({
					name,
					description,
					location
				}));
				break;
			case "skillsRead": {
				const name = values[0];
				const available = params.ctx.codeModeSkills ?? [];
				const skill = typeof name === "string" ? available.find((entry) => entry.name === name) : null;
				if (!skill) {
					const names = available.map((entry) => entry.name).join(", ") || "(none)";
					throw new ToolInputError(`Unknown skill ${JSON.stringify(name)}. Available skills: ${names}`);
				}
				value = await readCodeModeSkill(skill, params.signal);
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
			code: getToolContractFailureCode(classified) ?? (isTrustedToolInputError(classified) ? "invalid_input" : "tool_error"),
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
function createCodeModeRunOwner(ctx, config) {
	const inbox = new CodeModeProgramDataInbox(config);
	const releaseRuntimeRefresh = captureAgentPluginRuntimeRefresh().hold();
	const runId = `cm_${randomUUID()}`;
	const closed = new AbortController();
	const approvalWait = observeAgentRunApprovalWait(ctx);
	const signal = ctx.abortSignal ? AbortSignal.any([closed.signal, ctx.abortSignal]) : closed.signal;
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
		runId,
		signal,
		inbox,
		results: createCodeModeResultsAccess(ctx, config),
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
function createCodeModeBridgeDispatchState() {
	return { started: false };
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
			const renewed = resolveCodeModeSnapshotExpiresAt(now, state.config.snapshotTtlSeconds);
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
function waitForPendingBridgeSettlement(pending, settlementMode) {
	const required = pendingBridgeStatesForSettlement(pending, settlementMode);
	const outstanding = required.filter((entry) => !entry.settled);
	if (outstanding.length === 0 || settlementMode.kind === "awaiting" && outstanding.length !== required.length) return Promise.resolve();
	return (settlementMode.kind === "draining" ? Promise.all(outstanding.map((entry) => entry.promise)) : Promise.race(outstanding.map((entry) => entry.promise))).then(() => void 0);
}
function resolveCodeModeSnapshotExpiresAt(now, ttlSeconds) {
	return resolveExpiresAtMsFromDurationSeconds(ttlSeconds, { nowMs: now });
}
function enforceActiveRunLimit() {
	removeExpiredRuns();
	if (activeRuns.size + activeRunReservations >= MAX_ACTIVE_CODE_MODE_RUNS) throw new ToolInputError("too many suspended code mode runs.");
}
function reserveActiveRunSlot(ownedRunId) {
	if (ownedRunId === void 0) enforceActiveRunLimit();
	else {
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
	if (request.method === "search" || request.method === "describe" || request.method === "yield" || request.method === "agentSpawn" || request.method === "agentWait" || request.method === "skillsList" || request.method === "skillsRead" || request.method === "sleep") return true;
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
			catalogProjection: params.catalogProjection,
			namespaceRuntime: params.namespaceRuntime,
			parentToolCallId: params.parentToolCallId,
			codeModeRunId: params.codeModeRunId,
			reply,
			remainingMs: Math.max(1, params.remainingMs),
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
			promise: completion.then(() => {
				params.signal.removeEventListener("abort", onAbort);
				state.settledSequence = ++nextPendingBridgeSettlementSequence;
				state.settled = true;
				state.args = [];
				if (state.method === "agentWait" && params.activeRunId) {
					const active = activeRuns.get(params.activeRunId);
					if (active?.pending.includes(state)) {
						const renewed = resolveCodeModeSnapshotExpiresAt(Date.now(), active.config.snapshotTtlSeconds);
						if (renewed !== void 0) {
							active.expiresAt = renewed;
							scheduleActiveRunExpiry();
						}
					}
				}
			}),
			cancel: () => {
				reply.cancel();
				if (!state.settled) abortController.abort(/* @__PURE__ */ new Error(BRIDGE_CLOSED_MESSAGE));
			}
		};
		return state;
	});
}
function storeSuspendedRun(params) {
	const runId = params.owner.runId;
	if (params.owner.signal.aborted) {
		cancelPendingBridgeStates(params.pending);
		return codeModeAbortedResult(params);
	}
	const now = Date.now();
	const expiresAt = resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds);
	if (expiresAt === void 0) throw new ToolInputError("code mode run expiry is unavailable.");
	const agentWaitRetainUntil = params.pending.some((entry) => entry.method === "agentWait" && !entry.settled) ? resolveCodeModeSnapshotExpiresAt(now, params.config.snapshotTtlSeconds * MAX_AGENT_WAIT_SNAPSHOT_TTL_WINDOWS) : void 0;
	const state = {
		runId,
		replayId: params.replayId,
		parentToolCallId: params.parentToolCallId,
		ctx: params.ctx,
		config: params.config,
		continuation: params.continuation,
		pending: params.pending,
		settlementMode: params.settlementMode,
		replaySafe: params.replaySafe,
		output: params.output,
		expiresAt,
		agentWaitRetainUntil,
		runtime: params.runtime,
		catalogProjection: params.catalogProjection,
		namespaceRuntime: params.namespaceRuntime,
		bridgeDispatch: params.bridgeDispatch,
		owner: params.owner
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
	return result;
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
export { observeAgentRunApprovalWait as C, createCodeModeCatalogProjection as S, waitForPendingBridgeSettlement as _, createCodeModeBridgeDispatchState as a, isCodeModeSwarmAvailable as b, disposeAllCodeModeRuns as c, removeExpiredRuns as d, reserveActiveRunSlot as f, telemetry as g, takeSettledBridgeRequests as h, codeModeAbortedResult as i, pendingBridgeRequestsReplaySafe as l, storeSuspendedRun as m, cancelPendingBridgeStates as n, createCodeModeRunOwner as o, resumingRunIds as p, cancelPendingBridgeStatesById as r, createPendingBridgeStates as s, activeRuns as t, pendingBridgeStatesForSettlement as u, CODE_MODE_NODES_TOOL_ID as v, resolveCodeModeSkills as w, createCodeModeCatalogBindings as x, codeModeReplayIdForToolCall as y };
