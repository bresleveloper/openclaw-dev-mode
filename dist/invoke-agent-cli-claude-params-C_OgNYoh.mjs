import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import fs from "node:fs/promises";
//#region src/node-host/invoke-payload.ts
const MAX_INVOKE_INPUT_BYTES = 16384;
function decodeNodeInvokeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
function coerceNodeInvokePayload(payload) {
	const obj = asOptionalObjectRecord(payload);
	if (!obj) return null;
	const id = normalizeOptionalString(obj.id);
	const nodeId = normalizeOptionalString(obj.nodeId);
	const command = normalizeOptionalString(obj.command);
	if (!id || !nodeId || !command) return null;
	const paramsJSON = typeof obj.paramsJSON === "string" ? obj.paramsJSON : obj.params !== void 0 ? JSON.stringify(obj.params) : null;
	const timeoutMs = typeof obj.timeoutMs === "number" ? obj.timeoutMs : null;
	const idempotencyKey = typeof obj.idempotencyKey === "string" ? obj.idempotencyKey : null;
	const sessionKey = normalizeOptionalString(obj.sessionKey);
	return {
		id,
		nodeId,
		command,
		paramsJSON,
		timeoutMs,
		idempotencyKey,
		...sessionKey ? { sessionKey } : {}
	};
}
function coerceNodeInvokeCancelPayload(payload) {
	const value = asNullableRecord(payload);
	return value && typeof value.invokeId === "string" && typeof value.nodeId === "string" ? {
		invokeId: value.invokeId,
		nodeId: value.nodeId
	} : null;
}
function coerceNodeInvokeInputPayload(payload) {
	const value = asNullableRecord(payload);
	if (!value || typeof value.id !== "string" || typeof value.nodeId !== "string" || !Number.isInteger(value.seq) || value.seq < 0 || typeof value.payloadJSON !== "string" || Buffer.byteLength(value.payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES) return null;
	return {
		invokeId: value.id,
		nodeId: value.nodeId,
		seq: value.seq,
		payloadJSON: value.payloadJSON
	};
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude-params.ts
const MAX_ARG_COUNT = 128;
const MAX_ARG_BYTES = 1048576;
const MAX_REQUEST_BYTES = 2097152;
const MAX_TIMEOUT_MS = 864e5;
const MIN_IDLE_TIMEOUT_MS = 1e3;
const MAX_IDLE_TIMEOUT_MS = 18e5;
const BARE_ARGS = /* @__PURE__ */ new Set([
	"-p",
	"--print",
	"--include-partial-messages",
	"--verbose",
	"--fork-session",
	"--safe-mode",
	"--bare",
	"--no-chrome",
	"--disable-slash-commands",
	"--no-session-persistence",
	"--exclude-dynamic-system-prompt-sections",
	"--include-hook-events",
	"--replay-user-messages"
]);
const VALUE_ARGS = /* @__PURE__ */ new Set([
	"--output-format",
	"--input-format",
	"--setting-sources",
	"--permission-mode",
	"--resume",
	"-r",
	"--session-id",
	"--model",
	"--effort",
	"--max-turns",
	"--fallback-model",
	"--prompt-suggestions",
	"--max-budget-usd",
	"--tools",
	"--disallowedTools"
]);
const ENV_ALLOWLIST = /* @__PURE__ */ new Set([
	"ANTHROPIC_API_KEY",
	"CLAUDE_CODE_AUTO_COMPACT_WINDOW",
	"CLAUDE_CODE_DISABLE_1M_CONTEXT",
	"CLAUDE_CODE_OAUTH_TOKEN",
	"FORCE_COLOR",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"NO_COLOR",
	"TERM"
]);
const CLEAR_ENV_ALLOWLIST = /* @__PURE__ */ new Set([
	"ANTHROPIC_API_KEY",
	"ANTHROPIC_API_KEY_OLD",
	"ANTHROPIC_API_TOKEN",
	"ANTHROPIC_AUTH_TOKEN",
	"ANTHROPIC_BASE_URL",
	"ANTHROPIC_CUSTOM_HEADERS",
	"ANTHROPIC_OAUTH_TOKEN",
	"ANTHROPIC_UNIX_SOCKET",
	"CLAUDE_CONFIG_DIR",
	"CLAUDE_CODE_AUTO_COMPACT_WINDOW",
	"CLAUDE_CODE_DISABLE_1M_CONTEXT",
	"CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
	"CLAUDE_CODE_ENTRYPOINT",
	"CLAUDE_CODE_OAUTH_REFRESH_TOKEN",
	"CLAUDE_CODE_OAUTH_SCOPES",
	"CLAUDE_CODE_OAUTH_TOKEN",
	"CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
	"CLAUDE_CODE_PLUGIN_CACHE_DIR",
	"CLAUDE_CODE_PLUGIN_SEED_DIR",
	"CLAUDE_CODE_REMOTE",
	"CLAUDE_CODE_USE_COWORK_PLUGINS",
	"CLAUDE_CODE_USE_BEDROCK",
	"CLAUDE_CODE_USE_FOUNDRY",
	"CLAUDE_CODE_USE_VERTEX",
	"OTEL_EXPORTER_OTLP_ENDPOINT",
	"OTEL_EXPORTER_OTLP_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_LOGS_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_METRICS_HEADERS",
	"OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_PROTOCOL",
	"OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
	"OTEL_EXPORTER_OTLP_TRACES_HEADERS",
	"OTEL_EXPORTER_OTLP_TRACES_PROTOCOL",
	"OTEL_LOGS_EXPORTER",
	"OTEL_METRICS_EXPORTER",
	"OTEL_SDK_DISABLED",
	"OTEL_TRACES_EXPORTER"
]);
function requireBoundedString(value, label, maxBytes) {
	if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > maxBytes) throw new Error(`INVALID_REQUEST: ${label} must be a bounded string`);
	return value;
}
function optionalBoundedString(value, label, maxBytes) {
	return value === void 0 ? void 0 : requireBoundedString(value, label, maxBytes);
}
/** Claude CLI session ids are bounded, non-option argv values. */
function validateClaudeSessionId(value) {
	const sessionId = requireBoundedString(value, "threadId", MAX_ARG_BYTES).trim();
	if (!sessionId || sessionId.startsWith("-")) throw new Error("INVALID_REQUEST: threadId must be a Claude session id");
	return sessionId;
}
function validateArgs(value) {
	if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ARG_COUNT) throw new Error("INVALID_REQUEST: argv must be a bounded non-empty array");
	const args = value.map((entry, index) => requireBoundedString(entry, `argv[${index}]`, MAX_ARG_BYTES));
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index] ?? "";
		const equalsIndex = arg.indexOf("=");
		const name = equalsIndex > 0 ? arg.slice(0, equalsIndex) : arg;
		if (BARE_ARGS.has(arg)) continue;
		if (!VALUE_ARGS.has(name)) throw new Error(`INVALID_REQUEST: unsupported Claude CLI argument: ${arg || "<empty>"}`);
		if (equalsIndex < 0 && index + 1 >= args.length) throw new Error(`INVALID_REQUEST: Claude CLI argument requires a value: ${name}`);
		const argumentValue = equalsIndex > 0 ? arg.slice(equalsIndex + 1) : args[++index];
		if (equalsIndex > 0 && !argumentValue || argumentValue.startsWith("-")) throw new Error(`INVALID_REQUEST: Claude CLI argument requires a non-option value: ${name}`);
		if (name === "--permission-mode" && argumentValue === "bypassPermissions") throw new Error("INVALID_REQUEST: bypassPermissions is not allowed for node agent runs");
	}
	return args;
}
function validateTimeout(value, label, min, max) {
	if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) throw new Error(`INVALID_REQUEST: ${label} must be an integer from ${min} to ${max}`);
	return value;
}
/** Select framing before the command handler validates the complete narrow request. */
function requestsClaudeNodeSkillRuntime(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > MAX_REQUEST_BYTES) return false;
	try {
		return asNullableRecord(JSON.parse(raw))?.skillRuntime === true;
	} catch {
		return false;
	}
}
/** Resource bytes use the negotiated duplex, never argv or node filesystem paths. */
async function decodeClaudeCliNodeRunParams(raw) {
	if (Buffer.byteLength(raw ?? "", "utf8") > MAX_REQUEST_BYTES) throw new Error("INVALID_REQUEST: Claude CLI request is too large");
	const value = asNullableRecord(decodeNodeInvokeParams(raw));
	if (!value) throw new Error("INVALID_REQUEST: Claude CLI params must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"argv",
		"stdin",
		"cwd",
		"env",
		"clearEnv",
		"systemPrompt",
		"agentId",
		"sessionKey",
		"approvalDecision",
		"systemRunPlan",
		"idleTimeoutMs",
		"timeoutMs",
		"skillRuntime"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new Error(`INVALID_REQUEST: unknown Claude CLI parameter: ${unknown}`);
	const argv = validateArgs(value.argv);
	if (value.skillRuntime !== void 0 && value.skillRuntime !== true) throw new Error("INVALID_REQUEST: skillRuntime must be true when supplied");
	const stdin = optionalBoundedString(value.stdin, "stdin", MAX_REQUEST_BYTES);
	const systemPrompt = optionalBoundedString(value.systemPrompt, "systemPrompt", MAX_REQUEST_BYTES);
	const agentId = optionalBoundedString(value.agentId, "agentId", MAX_ARG_BYTES);
	const sessionKey = optionalBoundedString(value.sessionKey, "sessionKey", MAX_ARG_BYTES);
	const approvalDecision = value.approvalDecision === "allow-once" || value.approvalDecision === "allow-always" ? value.approvalDecision : void 0;
	if (value.approvalDecision !== void 0 && !approvalDecision) throw new Error("INVALID_REQUEST: approvalDecision is invalid");
	const systemRunPlan = value.systemRunPlan === void 0 ? void 0 : asNullableRecord(value.systemRunPlan);
	if (value.systemRunPlan !== void 0 && !systemRunPlan) throw new Error("INVALID_REQUEST: systemRunPlan must be an object");
	const cwd = optionalBoundedString(value.cwd, "cwd", MAX_ARG_BYTES);
	if (cwd) {
		if (!(await fs.stat(cwd).catch(() => void 0))?.isDirectory()) throw new Error("INVALID_REQUEST: cwd must be an existing directory on the node");
	}
	let env;
	if (value.env !== void 0) {
		const envValue = asNullableRecord(value.env);
		if (!envValue) throw new Error("INVALID_REQUEST: env must be an object");
		env = {};
		for (const [key, candidate] of Object.entries(envValue)) {
			if (!ENV_ALLOWLIST.has(key)) throw new Error(`INVALID_REQUEST: environment key is not allowed: ${key}`);
			env[key] = requireBoundedString(candidate, `env.${key}`, MAX_ARG_BYTES);
		}
		if (Object.hasOwn(env, "ANTHROPIC_API_KEY") && Object.hasOwn(env, "CLAUDE_CODE_OAUTH_TOKEN")) throw new Error("INVALID_REQUEST: exactly one Claude credential may be provided");
	}
	let clearEnv;
	if (value.clearEnv !== void 0) {
		if (!Array.isArray(value.clearEnv) || value.clearEnv.length > CLEAR_ENV_ALLOWLIST.size) throw new Error("INVALID_REQUEST: clearEnv must be a bounded array");
		clearEnv = [];
		for (const candidate of value.clearEnv) {
			const key = requireBoundedString(candidate, "clearEnv entry", MAX_ARG_BYTES);
			if (!CLEAR_ENV_ALLOWLIST.has(key)) throw new Error(`INVALID_REQUEST: clearEnv key is not allowed: ${key}`);
			if (!clearEnv.includes(key)) clearEnv.push(key);
		}
	}
	return {
		argv,
		...value.skillRuntime === true ? { skillRuntime: true } : {},
		...stdin !== void 0 ? { stdin } : {},
		...systemPrompt !== void 0 ? { systemPrompt } : {},
		...agentId ? { agentId } : {},
		...sessionKey ? { sessionKey } : {},
		...approvalDecision ? { approvalDecision } : {},
		...systemRunPlan ? { systemRunPlan } : {},
		...cwd ? { cwd } : {},
		...env ? { env } : {},
		...clearEnv ? { clearEnv } : {},
		idleTimeoutMs: validateTimeout(value.idleTimeoutMs, "idleTimeoutMs", MIN_IDLE_TIMEOUT_MS, MAX_IDLE_TIMEOUT_MS),
		timeoutMs: validateTimeout(value.timeoutMs, "timeoutMs", 1, MAX_TIMEOUT_MS)
	};
}
//#endregion
export { coerceNodeInvokeInputPayload as a, coerceNodeInvokeCancelPayload as i, requestsClaudeNodeSkillRuntime as n, coerceNodeInvokePayload as o, validateClaudeSessionId as r, decodeNodeInvokeParams as s, decodeClaudeCliNodeRunParams as t };
