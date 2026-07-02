import { b as readStringParam, l as jsonResult } from "../../common-B2QjWqqG.js";
import { t as buildJsonPluginConfigSchema } from "../../config-schema-nMrjYIPk.js";
import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import "../../core-BbmhFA6e.js";
import * as path$1 from "node:path";
import * as os$1 from "node:os";
import { spawn } from "node:child_process";
import * as net$1 from "node:net";
import { randomUUID } from "node:crypto";
import WebSocket from "ws";
import { Type } from "typebox";
//#region extensions/codex-supervisor/src/config.ts
/**
* Config parsing for Codex Supervisor endpoints and safety gates.
*/
const ENDPOINTS_ENV = "OPENCLAW_CODEX_SUPERVISOR_ENDPOINTS";
const StdioEndpointSchema = Type.Object({
	id: Type.Optional(Type.String()),
	label: Type.Optional(Type.String()),
	transport: Type.Optional(Type.Literal("stdio-proxy")),
	command: Type.Optional(Type.String()),
	args: Type.Optional(Type.Array(Type.String())),
	cwd: Type.Optional(Type.String())
}, { additionalProperties: false });
const WebSocketEndpointSchema = Type.Object({
	id: Type.Optional(Type.String()),
	label: Type.Optional(Type.String()),
	transport: Type.Literal("websocket"),
	url: Type.String(),
	authTokenEnv: Type.Optional(Type.String())
}, { additionalProperties: false });
/**
* Plugin config schema accepted by the bundled plugin manifest.
*/
const CodexSupervisorPluginConfigSchema = Type.Object({
	endpoints: Type.Optional(Type.Array(Type.Union([StdioEndpointSchema, WebSocketEndpointSchema]))),
	allowRawTranscripts: Type.Optional(Type.Boolean({ default: false })),
	allowWriteControls: Type.Optional(Type.Boolean({ default: false }))
}, { additionalProperties: false });
function normalizeEndpointId(value, index) {
	const trimmed = value.trim();
	if (trimmed) return trimmed.replace(/[^a-zA-Z0-9_.:-]/g, "-");
	return `endpoint-${index + 1}`;
}
function isRecord$2(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function parseEndpointRecord(value, index) {
	if (!isRecord$2(value)) return;
	const transport = typeof value.transport === "string" ? value.transport : void 0;
	const id = typeof value.id === "string" ? normalizeEndpointId(value.id, index) : normalizeEndpointId(typeof value.label === "string" ? value.label : "", index);
	const label = typeof value.label === "string" ? value.label : void 0;
	if (transport === "websocket" && typeof value.url === "string") return {
		id,
		transport,
		url: value.url,
		...label ? { label } : {},
		...typeof value.authTokenEnv === "string" ? { authTokenEnv: value.authTokenEnv } : {}
	};
	if (transport === "stdio-proxy" || transport === void 0) {
		const args = Array.isArray(value.args) ? value.args.filter((entry) => typeof entry === "string") : void 0;
		return {
			id,
			transport: "stdio-proxy",
			...label ? { label } : {},
			...typeof value.command === "string" ? { command: value.command } : {},
			...args && args.length > 0 ? { args } : {},
			...typeof value.cwd === "string" ? { cwd: value.cwd } : {}
		};
	}
}
function requireUniqueEndpointIds(endpoints) {
	const seen = /* @__PURE__ */ new Set();
	for (const endpoint of endpoints) {
		if (seen.has(endpoint.id)) throw new Error(`duplicate Codex supervisor endpoint id: ${endpoint.id}`);
		seen.add(endpoint.id);
	}
	return endpoints;
}
function endpointFromToken(token, index) {
	const trimmed = token.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("ws://") || trimmed.startsWith("wss://") || trimmed.startsWith("unix://")) return {
		id: normalizeEndpointId("", index),
		transport: "websocket",
		url: trimmed
	};
	if (trimmed === "local" || trimmed === "proxy" || trimmed === "stdio") return {
		id: "local",
		label: "local Codex app-server daemon",
		transport: "websocket",
		url: "unix://"
	};
	const separatorIndex = trimmed.indexOf("=");
	const id = separatorIndex >= 0 ? trimmed.slice(0, separatorIndex) : trimmed;
	const url = separatorIndex >= 0 ? trimmed.slice(separatorIndex + 1) : void 0;
	if (url?.startsWith("ws://") || url?.startsWith("wss://") || url?.startsWith("unix://")) return {
		id: normalizeEndpointId(id ?? "", index),
		transport: "websocket",
		url
	};
}
/**
* Loads endpoint definitions from environment, defaulting to the local Codex
* app-server unix socket.
*/
function loadCodexSupervisorEndpoints(env = process.env) {
	const raw = env[ENDPOINTS_ENV]?.trim();
	if (!raw) return requireUniqueEndpointIds([{
		id: "local",
		label: "local Codex app-server daemon",
		transport: "websocket",
		url: "unix://"
	}]);
	if (raw.startsWith("[")) {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) throw new Error(`${ENDPOINTS_ENV} must be a JSON array`);
		return requireUniqueEndpointIds(parsed.map((entry, index) => parseEndpointRecord(entry, index)).filter((entry) => Boolean(entry)));
	}
	return requireUniqueEndpointIds(raw.split(",").map(endpointFromToken).filter((entry) => Boolean(entry)));
}
function normalizeConfiguredEndpoints(endpoints) {
	if (!endpoints || endpoints.length === 0) return;
	const normalized = endpoints.map((entry, index) => parseEndpointRecord(entry, index)).filter((entry) => Boolean(entry));
	return normalized.length > 0 ? requireUniqueEndpointIds(normalized) : void 0;
}
/**
* Resolves raw plugin config and env endpoints into validated runtime config.
*/
function resolveCodexSupervisorPluginConfig(rawConfig, env = process.env) {
	const config = rawConfig && typeof rawConfig === "object" && !Array.isArray(rawConfig) ? rawConfig : {};
	return {
		endpoints: normalizeConfiguredEndpoints(config.endpoints) ?? loadCodexSupervisorEndpoints(env),
		allowRawTranscripts: config.allowRawTranscripts === true,
		allowWriteControls: config.allowWriteControls === true
	};
}
//#endregion
//#region extensions/codex-supervisor/src/mcp-tools.ts
/** Env gate for exposing transcript-derived fields through standalone MCP. */
const RAW_TRANSCRIPTS_ENV = "OPENCLAW_CODEX_SUPERVISOR_ALLOW_RAW_TRANSCRIPTS";
function redactString(value) {
	return value.replace(/\b(?:sk|glpat|xox[baprs])-[-_a-zA-Z0-9]{12,}\b/g, "[redacted]").replace(/\b(?:ghp|gho|ghu|ghs)_[-_a-zA-Z0-9]{12,}\b/g, "[redacted]").replace(/\bBearer\s+[-._~+/a-zA-Z0-9]+=*/g, "Bearer [redacted]");
}
/**
* Redacts common secret-bearing fields and token-like substrings before tool
* results leave the supervisor.
*/
function redactCodexSupervisorValue(value, key = "") {
	if (typeof value === "string") {
		if (/authorization|password|secret|token|api[-_]?key/i.test(key)) return "[redacted]";
		return redactString(value);
	}
	if (Array.isArray(value)) return value.map((entry) => redactCodexSupervisorValue(entry));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, redactCodexSupervisorValue(entryValue, entryKey)]));
}
function redactEndpointUrl(value) {
	if (value.startsWith("unix://")) return "unix://";
	try {
		const url = new URL(value);
		url.username = "";
		url.password = "";
		if (url.search) url.search = "?[redacted]";
		return url.toString();
	} catch {
		return "[redacted]";
	}
}
/** Returns endpoint metadata safe for tool results. */
function redactCodexSupervisorEndpoint(endpoint) {
	return {
		id: endpoint.id,
		transport: endpoint.transport,
		...endpoint.label ? { label: endpoint.label } : {},
		...endpoint.transport === "websocket" ? { url: redactEndpointUrl(endpoint.url) } : {}
	};
}
function rawTranscriptReadsAllowed() {
	return process.env[RAW_TRANSCRIPTS_ENV] === "1";
}
function sanitizeSessionForMcp(session, includeTranscriptDerivedFields) {
	const sanitized = redactCodexSupervisorValue(session);
	if (!includeTranscriptDerivedFields) {
		delete sanitized.preview;
		delete sanitized.name;
	}
	return sanitized;
}
/**
* Sanitizes session-list output, optionally including transcript-derived
* preview/name fields only when the caller has opted in.
*/
function sanitizeCodexSupervisorSessionListResult(result, includeTranscriptDerivedFields = rawTranscriptReadsAllowed()) {
	return {
		sessions: result.sessions.map((session) => sanitizeSessionForMcp(session, includeTranscriptDerivedFields)),
		errors: includeTranscriptDerivedFields ? redactCodexSupervisorValue(result.errors) : result.errors.map(({ endpointId, ok }) => ({
			endpointId,
			ok
		}))
	};
}
//#endregion
//#region extensions/codex-supervisor/src/plugin-tools.ts
/**
* OpenClaw agent-tool definitions for Codex Supervisor endpoint and session
* controls.
*/
const EmptyParamsSchema = Type.Object({}, { additionalProperties: false });
const SessionsListParamsSchema = Type.Object({
	include_stored: Type.Optional(Type.Boolean()),
	max_stored_sessions: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e3
	}))
}, { additionalProperties: false });
const SessionReadParamsSchema = Type.Object({
	endpoint_id: Type.Optional(Type.String()),
	thread_id: Type.String(),
	include_turns: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
const SessionSendParamsSchema = Type.Object({
	endpoint_id: Type.Optional(Type.String()),
	thread_id: Type.String(),
	text: Type.String(),
	mode: Type.Optional(Type.Union([
		Type.Literal("auto"),
		Type.Literal("start"),
		Type.Literal("steer")
	]))
}, { additionalProperties: false });
const SessionInterruptParamsSchema = Type.Object({
	endpoint_id: Type.Optional(Type.String()),
	thread_id: Type.String(),
	turn_id: Type.Optional(Type.String())
}, { additionalProperties: false });
function asRecord(params) {
	return params && typeof params === "object" && !Array.isArray(params) ? params : {};
}
function readBooleanParam(params, key) {
	return params[key] === true;
}
function readIntegerParam(params, key) {
	const value = params[key];
	if (value === void 0) return;
	if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`${key} must be an integer`);
	if (value < 1 || value > 1e3) throw new Error(`${key} must be between 1 and 1000`);
	return value;
}
function readModeParam(params) {
	const mode = readStringParam(params, "mode");
	if (!mode) return;
	if (mode === "auto" || mode === "start" || mode === "steer") return mode;
	throw new Error("mode must be auto, start, or steer");
}
function requireRawTranscriptAccess(policy) {
	if (!policy.allowRawTranscripts) throw new Error("Codex session reads are disabled for this codex-supervisor plugin config.");
}
function requireWriteAccess(policy) {
	if (!policy.allowWriteControls) throw new Error("Codex write controls are disabled for this codex-supervisor plugin config.");
}
/**
* Creates the OpenClaw tools that expose Codex endpoint health and session
* controls.
*/
function createCodexSupervisorTools({ supervisor, policy }) {
	return [
		{
			name: "codex_endpoint_probe",
			label: "Codex Endpoint Probe",
			description: "Check configured Codex app-server endpoints.",
			parameters: EmptyParamsSchema,
			execute: async () => {
				const endpoints = supervisor.listEndpoints().map(redactCodexSupervisorEndpoint);
				const health = (await supervisor.probeEndpoints()).map(({ endpointId, ok }) => ({
					endpointId,
					ok
				}));
				return jsonResult({
					summary: `codex endpoints: ${health.filter((entry) => entry.ok).length}/${health.length} ok`,
					endpoints,
					health
				});
			}
		},
		{
			name: "codex_sessions_list",
			label: "Codex Sessions List",
			description: "List Codex sessions visible to the OpenClaw supervisor.",
			parameters: SessionsListParamsSchema,
			execute: async (_toolCallId, rawParams) => {
				const params = asRecord(rawParams);
				const result = await supervisor.listSessionSnapshot({
					includeStored: readBooleanParam(params, "include_stored"),
					maxStoredSessions: readIntegerParam(params, "max_stored_sessions")
				});
				return jsonResult({
					summary: `codex sessions: ${result.sessions.length}`,
					...sanitizeCodexSupervisorSessionListResult(result, policy.allowRawTranscripts)
				});
			}
		},
		{
			name: "codex_session_read",
			label: "Codex Session Read",
			description: "Read one Codex session transcript from app-server.",
			parameters: SessionReadParamsSchema,
			execute: async (_toolCallId, rawParams) => {
				requireRawTranscriptAccess(policy);
				const params = asRecord(rawParams);
				const threadId = readStringParam(params, "thread_id", { required: true });
				const response = await supervisor.readSession({
					endpointId: readStringParam(params, "endpoint_id"),
					threadId,
					includeTurns: readBooleanParam(params, "include_turns")
				});
				return jsonResult({
					summary: `codex session: ${threadId}`,
					response: redactCodexSupervisorValue(response)
				});
			}
		},
		{
			name: "codex_session_send",
			label: "Codex Session Send",
			description: "Send text to a Codex session. Idle sessions start a turn; active sessions are steered.",
			parameters: SessionSendParamsSchema,
			execute: async (_toolCallId, rawParams) => {
				requireWriteAccess(policy);
				const params = asRecord(rawParams);
				const result = await supervisor.sendToSession({
					endpointId: readStringParam(params, "endpoint_id"),
					threadId: readStringParam(params, "thread_id", { required: true }),
					text: readStringParam(params, "text", {
						required: true,
						allowEmpty: false
					}),
					mode: readModeParam(params)
				});
				return jsonResult({
					summary: `codex ${result.mode}: ${result.turnId ?? result.threadId}`,
					result
				});
			}
		},
		{
			name: "codex_session_interrupt",
			label: "Codex Session Interrupt",
			description: "Interrupt an active Codex turn.",
			parameters: SessionInterruptParamsSchema,
			execute: async (_toolCallId, rawParams) => {
				requireWriteAccess(policy);
				const params = asRecord(rawParams);
				const result = await supervisor.interruptSession({
					endpointId: readStringParam(params, "endpoint_id"),
					threadId: readStringParam(params, "thread_id", { required: true }),
					turnId: readStringParam(params, "turn_id")
				});
				return jsonResult({
					summary: `codex interrupted: ${result.turnId}`,
					result
				});
			}
		}
	];
}
//#endregion
//#region extensions/codex-supervisor/src/json-rpc-client.ts
/**
* JSON-RPC transports for Codex app-server connections over stdio proxies or
* websocket/unix-socket endpoints.
*/
function isRecord$1(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function formatJsonRpcError(message) {
	const error = isRecord$1(message.error) ? message.error : {};
	const detail = typeof error.message === "string" ? error.message : "Codex app-server request failed";
	return new Error(detail);
}
function formatMalformedMessageError(error) {
	const detail = error instanceof Error ? error.message : String(error);
	return /* @__PURE__ */ new Error(`Malformed Codex app-server message: ${detail}`);
}
/**
* Produces denial responses for app-server approval requests the supervisor
* deliberately cannot grant.
*/
function resolveSafeApprovalResult(method) {
	if (method === "item/tool/call") return {
		contentItems: [{
			type: "inputText",
			text: "OpenClaw Codex supervisor did not register a handler for this app-server tool call."
		}],
		success: false
	};
	if (method === "item/commandExecution/requestApproval") return { decision: "decline" };
	if (method === "item/fileChange/requestApproval") return { decision: "decline" };
	if (method === "item/permissions/requestApproval") return {
		permissions: {},
		scope: "turn"
	};
	if (method.endsWith("/requestApproval")) return {
		decision: "decline",
		reason: "OpenClaw Codex supervisor does not grant native approvals."
	};
	if (method === "item/tool/requestUserInput") return { answers: {} };
	if (method === "mcpServer/elicitation/request") return { action: "decline" };
}
var BaseCodexJsonRpcConnection = class {
	constructor() {
		this.pending = /* @__PURE__ */ new Map();
	}
	async initialize() {
		await this.request("initialize", {
			clientInfo: {
				name: "openclaw-codex-supervisor",
				title: "OpenClaw Codex Supervisor",
				version: "0.1.0"
			},
			capabilities: { experimentalApi: true }
		});
		this.notify("initialized");
	}
	request(method, params) {
		if (this.closedError) return Promise.reject(this.closedError);
		const id = randomUUID();
		const payload = {
			id,
			method,
			params: params ?? {}
		};
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.pending.delete(id);
				reject(/* @__PURE__ */ new Error(`Codex app-server request timed out: ${method}`));
			}, 6e4);
			this.pending.set(id, {
				resolve,
				reject,
				timeout
			});
			try {
				this.sendRaw(JSON.stringify(payload));
			} catch (error) {
				clearTimeout(timeout);
				this.pending.delete(id);
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
	notify(method, params) {
		const payload = {
			method,
			params: params ?? null
		};
		this.sendRaw(JSON.stringify(payload));
	}
	handleMessage(message) {
		if (!isRecord$1(message)) return;
		const id = typeof message.id === "string" || typeof message.id === "number" ? message.id : void 0;
		const method = typeof message.method === "string" ? message.method : void 0;
		if (id !== void 0 && method) {
			const result = resolveSafeApprovalResult(method);
			this.sendRaw(JSON.stringify(result === void 0 ? {
				id,
				error: {
					code: -32601,
					message: `OpenClaw Codex supervisor cannot handle app-server request: ${method}`
				}
			} : {
				id,
				result
			}));
			return;
		}
		if (id !== void 0) {
			const pending = this.pending.get(String(id));
			if (!pending) return;
			clearTimeout(pending.timeout);
			this.pending.delete(String(id));
			if ("error" in message) {
				pending.reject(formatJsonRpcError(message));
				return;
			}
			pending.resolve(message.result);
		}
	}
	rejectAll(error) {
		for (const [id, pending] of this.pending) {
			clearTimeout(pending.timeout);
			this.pending.delete(id);
			pending.reject(error);
		}
	}
	fail(error) {
		this.closedError ??= error;
		this.rejectAll(this.closedError);
	}
};
var StdioCodexJsonRpcConnection = class extends BaseCodexJsonRpcConnection {
	constructor(endpoint) {
		super();
		this.buffer = "";
		this.stderrTail = [];
		this.proc = spawn(endpoint.command ?? "codex", endpoint.args ?? [
			"app-server",
			"--listen",
			"stdio://"
		], {
			cwd: endpoint.cwd,
			stdio: "pipe"
		});
		this.proc.stdout.setEncoding("utf8");
		this.proc.stderr.setEncoding("utf8");
		this.proc.stdout.on("data", (chunk) => this.handleStdout(chunk));
		this.proc.stderr.on("data", (chunk) => {
			this.stderrTail.push(...chunk.split(/\r?\n/).filter(Boolean));
			this.stderrTail.splice(0, Math.max(0, this.stderrTail.length - 40));
		});
		this.proc.stdin.once("error", (error) => this.fail(error));
		this.proc.once("error", (error) => this.fail(error));
		this.proc.once("close", () => this.fail(/* @__PURE__ */ new Error(`Codex app-server stdio transport closed. stderr_tail=${this.stderrTail.join("\n").slice(0, 1200)}`)));
	}
	sendRaw(line) {
		this.proc.stdin.write(`${line}\n`, (error) => {
			if (error) this.fail(error);
		});
	}
	async close() {
		this.proc.stdin.end();
		this.proc.kill("SIGTERM");
	}
	handleStdout(chunk) {
		this.buffer += chunk;
		for (;;) {
			const index = this.buffer.indexOf("\n");
			if (index < 0) return;
			const line = this.buffer.slice(0, index).trim();
			this.buffer = this.buffer.slice(index + 1);
			if (!line) continue;
			try {
				this.handleMessage(JSON.parse(line));
			} catch (error) {
				this.fail(formatMalformedMessageError(error));
				this.close();
				return;
			}
		}
	}
};
function defaultCodexControlSocketPath() {
	const codexHome = process.env.CODEX_HOME?.trim() || path$1.join(os$1.homedir(), ".codex");
	return path$1.join(codexHome, "app-server-control", "app-server-control.sock");
}
function resolveUnixWebSocketPath(url) {
	return url.slice(7) || defaultCodexControlSocketPath();
}
function connectCodexSupervisorUnixSocket(url) {
	return net$1.createConnection(resolveUnixWebSocketPath(url));
}
function websocketMessageToString(data) {
	if (typeof data === "string") return data;
	if (Buffer.isBuffer(data)) return data.toString("utf8");
	if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
	return Buffer.from(data).toString("utf8");
}
var WebSocketCodexJsonRpcConnection = class extends BaseCodexJsonRpcConnection {
	constructor(endpoint) {
		super();
		this.closing = false;
		const headers = {};
		if (endpoint.authTokenEnv) {
			const token = process.env[endpoint.authTokenEnv];
			if (token) headers.authorization = `Bearer ${token}`;
		}
		this.ws = endpoint.url.startsWith("unix://") ? new WebSocket("ws://localhost/", {
			headers,
			createConnection: () => connectCodexSupervisorUnixSocket(endpoint.url)
		}) : new WebSocket(endpoint.url, { headers });
		this.openPromise = new Promise((resolve, reject) => {
			this.ws.once("open", resolve);
			this.ws.once("error", reject);
		});
		this.ws.on("message", (data) => {
			const text = websocketMessageToString(data);
			try {
				this.handleMessage(JSON.parse(text));
			} catch (error) {
				this.fail(formatMalformedMessageError(error));
				this.close();
			}
		});
		this.ws.once("error", (error) => this.fail(error));
		this.ws.once("close", () => {
			if (!this.closing) this.fail(/* @__PURE__ */ new Error("Codex app-server websocket closed"));
		});
	}
	async ready() {
		await this.openPromise;
	}
	sendRaw(line) {
		this.ws.send(line, (error) => {
			if (error) this.fail(error);
		});
	}
	async close() {
		this.closing = true;
		this.fail(/* @__PURE__ */ new Error("Codex app-server websocket closed"));
		if (this.ws.readyState === WebSocket.CLOSED) return;
		await new Promise((resolve) => {
			const timeout = setTimeout(() => {
				this.ws.terminate();
				resolve();
			}, 1e3);
			this.ws.once("close", () => {
				clearTimeout(timeout);
				resolve();
			});
			if (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) this.ws.close();
			else {
				clearTimeout(timeout);
				resolve();
			}
		});
	}
};
/**
* Opens, initializes, and returns a JSON-RPC connection for one supervisor
* endpoint.
*/
async function connectCodexAppServerEndpoint(endpoint) {
	const connection = endpoint.transport === "websocket" ? new WebSocketCodexJsonRpcConnection(endpoint) : new StdioCodexJsonRpcConnection(endpoint);
	try {
		if ("ready" in connection && typeof connection.ready === "function") await connection.ready();
		await connection.initialize();
		return connection;
	} catch (error) {
		await connection.close().catch(() => void 0);
		throw error;
	}
}
//#endregion
//#region extensions/codex-supervisor/src/supervisor.ts
/**
* Codex app-server supervisor that lists sessions, reads transcripts, and
* starts/steers/interrupts turns across configured endpoints.
*/
const ALL_CODEX_THREAD_SOURCE_KINDS = [
	"cli",
	"vscode",
	"exec",
	"appServer",
	"unknown"
];
const DEFAULT_MAX_STORED_SESSIONS = 200;
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function asRecordArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isRecord);
}
function extractThread(value) {
	if (!isRecord(value)) return;
	if (isRecord(value.thread)) return value.thread;
}
function extractThreadList(value) {
	if (!isRecord(value)) return [];
	if (Array.isArray(value.data)) return asRecordArray(value.data);
	if (Array.isArray(value.threads)) return asRecordArray(value.threads);
	if (Array.isArray(value.loadedThreads)) return asRecordArray(value.loadedThreads);
	return [];
}
function extractStringList(value) {
	if (!isRecord(value) || !Array.isArray(value.data)) return [];
	return value.data.filter((entry) => typeof entry === "string");
}
function getStatusType(thread) {
	const status = thread.status;
	if (isRecord(status) && typeof status.type === "string") return status.type;
	if (typeof status === "string") return status;
	return "unknown";
}
function toSession(endpointId, thread, humanAttached) {
	if (typeof thread.id !== "string") return;
	return {
		endpointId,
		threadId: thread.id,
		status: getStatusType(thread),
		...typeof thread.sessionId === "string" ? { sessionId: thread.sessionId } : {},
		...typeof thread.cwd === "string" ? { cwd: thread.cwd } : {},
		...typeof thread.preview === "string" ? { preview: thread.preview } : {},
		..."name" in thread && (typeof thread.name === "string" || thread.name === null) ? { name: thread.name } : {},
		...typeof thread.source === "string" ? { source: thread.source } : {},
		...typeof thread.updatedAt === "number" ? { updatedAt: thread.updatedAt } : {},
		...humanAttached !== void 0 ? { humanAttached } : {}
	};
}
function findInProgressTurnId(thread) {
	const turns = asRecordArray(thread.turns);
	for (const turn of turns.toReversed()) if (turn.status === "inProgress" && typeof turn.id === "string") return turn.id;
}
function isLoadedThreadReadMiss(error) {
	const message = error instanceof Error ? error.message : String(error);
	return message.includes("thread not found") || message.includes("thread not loaded");
}
/** High-level supervisor facade used by OpenClaw tools and MCP tools. */
var CodexSupervisor = class {
	constructor(endpoints, connector = connectCodexAppServerEndpoint) {
		this.endpoints = endpoints;
		this.connector = connector;
		this.connections = /* @__PURE__ */ new Map();
	}
	/** Returns configured endpoint definitions without opening connections. */
	listEndpoints() {
		return this.endpoints;
	}
	/** Closes all open app-server connections owned by this supervisor. */
	async close() {
		const settled = await Promise.allSettled(this.connections.values());
		this.connections.clear();
		await Promise.all(settled.map(async (entry) => {
			if (entry.status === "fulfilled") await entry.value.close();
		}));
	}
	/** Checks whether each endpoint can service a lightweight thread list call. */
	async probeEndpoints() {
		return await Promise.all(this.endpoints.map(async (endpoint) => {
			try {
				await (await this.connectionFor(endpoint.id)).request("thread/loaded/list", { limit: 1 });
				return {
					endpointId: endpoint.id,
					ok: true
				};
			} catch (error) {
				this.forgetEndpoint(endpoint.id);
				return {
					endpointId: endpoint.id,
					ok: false,
					detail: error instanceof Error ? error.message : String(error)
				};
			}
		}));
	}
	/** Lists sessions, returning only the session array for agent-tool callers. */
	async listSessions(params = {}) {
		return (await this.listSessionSnapshot(params)).sessions;
	}
	/** Lists sessions plus endpoint errors for structured tool output. */
	async listSessionSnapshot(params = {}) {
		const sessions = [];
		const errors = [];
		for (const endpoint of this.endpoints) try {
			sessions.push(...await this.listEndpointSessions(endpoint, params));
		} catch (error) {
			this.forgetEndpoint(endpoint.id);
			errors.push({
				endpointId: endpoint.id,
				ok: false,
				detail: error instanceof Error ? error.message : String(error)
			});
		}
		return {
			sessions,
			errors
		};
	}
	/** Reads a single Codex session transcript from the resolved endpoint. */
	async readSession(params) {
		const endpointId = await this.resolveEndpointId(params);
		const connection = await this.connectionFor(endpointId);
		try {
			const result = await this.readThread(connection, params.threadId, params.includeTurns === true);
			if (!isRecord(result)) throw new Error("Codex thread/read returned a non-object response");
			return result;
		} catch (error) {
			this.forgetEndpoint(endpointId);
			throw error;
		}
	}
	/** Starts a new turn or steers an active turn depending on requested mode. */
	async sendToSession(params) {
		const endpointId = await this.resolveEndpointId(params);
		const connection = await this.connectionFor(endpointId);
		try {
			const mode = params.mode ?? "auto";
			if (mode === "start") return await this.startTurn(connection, endpointId, params.threadId, params.text);
			const thread = extractThread(await this.readThread(connection, params.threadId, false));
			if (!thread) throw new Error(`Codex thread not found: ${params.threadId}`);
			const status = getStatusType(thread);
			if (mode === "steer" || status === "active") {
				const detailedThread = extractThread(await this.readThread(connection, params.threadId, true));
				const turnId = (detailedThread ? findInProgressTurnId(detailedThread) : void 0) ?? findInProgressTurnId(thread) ?? await this.readActiveTurnId(connection, params.threadId);
				if (!turnId) throw new Error(`Codex thread ${params.threadId} is active but no in-progress turn is readable`);
				await connection.request("turn/steer", {
					threadId: params.threadId,
					expectedTurnId: turnId,
					input: [{
						type: "text",
						text: params.text,
						text_elements: []
					}]
				});
				return {
					endpointId,
					threadId: params.threadId,
					mode: "steer",
					turnId,
					status
				};
			}
			return await this.startTurn(connection, endpointId, params.threadId, params.text);
		} catch (error) {
			this.forgetEndpoint(endpointId);
			throw error;
		}
	}
	/** Interrupts an active Codex turn, resolving the turn id when omitted. */
	async interruptSession(params) {
		const endpointId = await this.resolveEndpointId(params);
		const connection = await this.connectionFor(endpointId);
		try {
			let turnId = params.turnId;
			if (!turnId) {
				const thread = extractThread(await this.readThread(connection, params.threadId, true));
				turnId = (thread ? findInProgressTurnId(thread) : void 0) ?? await this.readActiveTurnId(connection, params.threadId);
			}
			if (!turnId) throw new Error(`Codex thread ${params.threadId} has no readable in-progress turn`);
			await connection.request("turn/interrupt", {
				threadId: params.threadId,
				turnId
			});
			return {
				endpointId,
				threadId: params.threadId,
				turnId
			};
		} catch (error) {
			this.forgetEndpoint(endpointId);
			throw error;
		}
	}
	async listEndpointSessions(endpoint, params) {
		if (params.includeStored === true) {
			const sessions = [...await this.listLoadedThreadSessions(endpoint)];
			for (const stored of await this.listStoredThreadSessions(endpoint, params.maxStoredSessions)) if (!sessions.some((session) => session.threadId === stored.threadId)) sessions.push(stored);
			return sessions;
		}
		return await this.listLoadedThreadSessions(endpoint);
	}
	async listLoadedThreadSessions(endpoint) {
		const sessions = [];
		const connection = await this.connectionFor(endpoint.id);
		let cursor;
		do {
			const listed = await connection.request("thread/loaded/list", {
				limit: 100,
				...cursor ? { cursor } : {}
			});
			for (const threadId of extractStringList(listed)) {
				if (sessions.some((entry) => entry.threadId === threadId)) continue;
				const thread = extractThread(await this.readOptionalLoadedThread(connection, threadId));
				const session = thread ? toSession(endpoint.id, thread, true) : void 0;
				if (session) sessions.push(session);
			}
			cursor = isRecord(listed) && typeof listed.nextCursor === "string" ? listed.nextCursor : void 0;
		} while (cursor);
		return sessions;
	}
	async listStoredThreadSessions(endpoint, maxStoredSessions = DEFAULT_MAX_STORED_SESSIONS) {
		const sessionLimit = Number.isFinite(maxStoredSessions) ? Math.min(1e3, Math.max(1, Math.floor(maxStoredSessions))) : DEFAULT_MAX_STORED_SESSIONS;
		const sessions = [];
		const connection = await this.connectionFor(endpoint.id);
		let cursor;
		do {
			const remaining = sessionLimit - sessions.length;
			if (remaining <= 0) break;
			const listed = await connection.request("thread/list", {
				limit: Math.min(100, remaining),
				sourceKinds: ALL_CODEX_THREAD_SOURCE_KINDS,
				useStateDbOnly: true,
				...cursor ? { cursor } : {}
			});
			for (const thread of extractThreadList(listed)) {
				if (typeof thread.id !== "string") continue;
				if (sessions.some((entry) => entry.endpointId === endpoint.id && entry.threadId === thread.id)) continue;
				const session = toSession(endpoint.id, thread);
				if (session) {
					sessions.push(session);
					if (sessions.length >= sessionLimit) break;
				}
			}
			cursor = isRecord(listed) && typeof listed.nextCursor === "string" ? listed.nextCursor : void 0;
		} while (cursor);
		return sessions;
	}
	async readOptionalLoadedThread(connection, threadId) {
		try {
			return await this.readLoadedThread(connection, threadId, false);
		} catch (error) {
			if (isLoadedThreadReadMiss(error)) return;
			throw error;
		}
	}
	async readLoadedThread(connection, threadId, includeTurns) {
		try {
			return await connection.request("thread/read", {
				threadId,
				includeTurns
			});
		} catch (error) {
			if (!includeTurns) throw error;
			if (!(error instanceof Error ? error.message : String(error)).includes("not materialized yet")) throw error;
			return await connection.request("thread/read", {
				threadId,
				includeTurns: false
			});
		}
	}
	async startTurn(connection, endpointId, threadId, text) {
		const result = await connection.request("turn/start", {
			threadId,
			input: [{
				type: "text",
				text,
				text_elements: []
			}]
		});
		const turn = isRecord(result) && isRecord(result.turn) ? result.turn : void 0;
		return {
			endpointId,
			threadId,
			mode: "start",
			...typeof turn?.id === "string" ? { turnId: turn.id } : {},
			...typeof turn?.status === "string" ? { status: turn.status } : {}
		};
	}
	async readThread(connection, threadId, includeTurns) {
		return await this.readLoadedThread(connection, threadId, includeTurns);
	}
	async readActiveTurnId(connection, threadId) {
		try {
			return extractThreadList(await connection.request("thread/turns/list", {
				threadId,
				limit: 10,
				sortDirection: "desc",
				itemsView: "summary"
			})).find((turn) => turn.status === "inProgress" && typeof turn.id === "string")?.id;
		} catch {
			return;
		}
	}
	async resolveEndpointId(params) {
		if (params.endpointId) return params.endpointId;
		const matches = (await this.listSessions()).filter((session) => session.threadId === params.threadId);
		if (matches.length === 1) return matches[0].endpointId;
		if (matches.length > 1) throw new Error(`Codex thread id is ambiguous across endpoints: ${params.threadId}`);
		const endpointIds = new Set(matches.map((match) => match.endpointId));
		for (const endpoint of this.endpoints) {
			if (endpointIds.has(endpoint.id)) continue;
			try {
				const connection = await this.connectionFor(endpoint.id);
				if (extractThread(await this.readThread(connection, params.threadId, false))?.id === params.threadId) endpointIds.add(endpoint.id);
			} catch (error) {
				if (isLoadedThreadReadMiss(error)) continue;
				this.forgetEndpoint(endpoint.id);
				continue;
			}
		}
		if (endpointIds.size === 1) for (const endpointId of endpointIds) return endpointId;
		if (endpointIds.size > 1) throw new Error(`Codex thread id is ambiguous across endpoints: ${params.threadId}`);
		throw new Error(`Codex thread not found: ${params.threadId}`);
	}
	async connectionFor(endpointId) {
		const endpoint = this.endpoints.find((entry) => entry.id === endpointId);
		if (!endpoint) throw new Error(`Unknown Codex supervisor endpoint: ${endpointId}`);
		const existing = this.connections.get(endpoint.id);
		if (existing) return await existing;
		const created = this.connector(endpoint);
		this.connections.set(endpoint.id, created);
		created.catch(() => {
			if (this.connections.get(endpoint.id) === created) this.connections.delete(endpoint.id);
		});
		return await created;
	}
	forgetEndpoint(endpointId) {
		const existing = this.connections.get(endpointId);
		if (!existing) return;
		this.connections.delete(endpointId);
		existing.then((connection) => connection.close()).catch(() => void 0);
	}
};
//#endregion
//#region extensions/codex-supervisor/index.ts
/**
* Bundled plugin entry that exposes Codex app-server supervisor tools to
* OpenClaw agents.
*/
var codex_supervisor_default = definePluginEntry({
	id: "codex-supervisor",
	name: "Codex Supervisor",
	description: "Supervise Codex app-server sessions from OpenClaw.",
	configSchema: buildJsonPluginConfigSchema(CodexSupervisorPluginConfigSchema),
	register(api) {
		const config = resolveCodexSupervisorPluginConfig(api.pluginConfig);
		const supervisor = new CodexSupervisor(config.endpoints);
		api.lifecycle.registerRuntimeLifecycle({
			id: "codex-supervisor",
			description: "Close Codex supervisor app-server connections.",
			cleanup: () => supervisor.close()
		});
		for (const tool of createCodexSupervisorTools({
			supervisor,
			policy: {
				allowRawTranscripts: config.allowRawTranscripts,
				allowWriteControls: config.allowWriteControls
			}
		})) api.registerTool(tool);
	}
});
//#endregion
export { codex_supervisor_default as default };
