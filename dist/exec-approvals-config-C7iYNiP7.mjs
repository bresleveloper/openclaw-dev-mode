import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as resolveHomeRelativePath, t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, Sn as looseObject, Un as record, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as DEFAULT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import path from "node:path";
import { randomBytes } from "node:crypto";
//#region src/infra/exec-approvals-config.ts
const toStringOrUndefined = readStringValue;
const execSecuritySchema = _enum([
	"allowlist",
	"full",
	"deny"
]);
const execAskSchema = _enum([
	"always",
	"off",
	"on-miss"
]);
const persistedExecApprovalPolicySchema = looseObject({
	security: execSecuritySchema.optional(),
	ask: execAskSchema.optional(),
	askFallback: execSecuritySchema.optional(),
	autoAllowSkills: boolean().optional()
});
function normalizePersistedAllowlistSource(value) {
	return value === "allow-always" ? value : void 0;
}
const persistedExecAllowlistEntrySchema = union([string().trim().min(1), looseObject({
	pattern: string().refine((value) => value.trim().length > 0),
	id: string().optional(),
	source: string().transform(normalizePersistedAllowlistSource).optional(),
	commandText: string().optional(),
	argPattern: string().optional(),
	lastUsedAt: number().finite().optional(),
	lastUsedCommand: string().optional(),
	lastResolvedPath: string().optional()
})]).transform((value) => typeof value === "string" ? { pattern: value } : value);
const persistedExecApprovalsAgentSchema = persistedExecApprovalPolicySchema.extend({
	allowlist: array(persistedExecAllowlistEntrySchema).optional(),
	mcpTools: array(looseObject({
		server: string().refine((value) => value.trim().length > 0),
		tool: string().refine((value) => value.trim().length > 0),
		source: literal("allow-always"),
		addedAt: number().finite().nonnegative(),
		lastUsedAt: number().finite().nonnegative().optional()
	})).optional()
});
const persistedExecApprovalsAgentsSchema = unknown().refine((value) => !isRecord(value) || !Object.hasOwn(value, "__proto__")).pipe(record(string(), persistedExecApprovalsAgentSchema));
const persistedExecApprovalsSchema = looseObject({
	version: literal(1),
	socket: looseObject({
		path: string().optional(),
		token: string().optional()
	}).optional(),
	defaults: persistedExecApprovalPolicySchema.optional(),
	agents: persistedExecApprovalsAgentsSchema.optional()
});
const DEFAULT_SECURITY = "full";
const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK = "deny";
const DEFAULT_EXEC_APPROVALS_STATE_DIR = "~/.openclaw";
const EXEC_APPROVALS_FILE = "exec-approvals.json";
const EXEC_APPROVALS_SOCKET = "exec-approvals.sock";
function resolveExecApprovalsStateDir(env = process.env) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) {
		const resolved = resolveHomeRelativePath(override, { env });
		return {
			path: resolved,
			displayPath: resolved
		};
	}
	return {
		path: expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR, { env }),
		displayPath: DEFAULT_EXEC_APPROVALS_STATE_DIR
	};
}
function resolveExecApprovalsPath(env = process.env) {
	return path.join(resolveExecApprovalsStateDir(env).path, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsSocketPath() {
	return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_SOCKET);
}
function resolveExecApprovalsDisplayPath(env = process.env) {
	const stateDir = resolveExecApprovalsStateDir(env).displayPath;
	const locator = path.join("state", "openclaw.sqlite#exec_approvals_config");
	return stateDir === DEFAULT_EXEC_APPROVALS_STATE_DIR ? `${stateDir}/${locator}` : path.join(stateDir, locator);
}
function resolveExecApprovalsTranscriptPath() {
	return process.env.OPENCLAW_STATE_DIR?.trim() ? "$OPENCLAW_STATE_DIR/state/openclaw.sqlite#exec_approvals_config" : `${DEFAULT_EXEC_APPROVALS_STATE_DIR}/state/openclaw.sqlite#exec_approvals_config`;
}
function createFailClosedExecApprovalsFallback() {
	return normalizeExecApprovalsInternal({
		version: 1,
		defaults: {
			security: "deny",
			ask: "off",
			askFallback: "deny",
			autoAllowSkills: false
		},
		agents: {}
	});
}
const diagnosticFields = /* @__PURE__ */ new Set([
	"version",
	"socket",
	"path",
	"token",
	"defaults",
	"agents",
	"security",
	"ask",
	"askFallback",
	"autoAllowSkills",
	"allowlist",
	"mcpTools",
	"server",
	"tool",
	"addedAt",
	"pattern",
	"id",
	"source",
	"commandText",
	"argPattern",
	"lastUsedAt",
	"lastUsedCommand",
	"lastResolvedPath"
]);
function formatPersistedExecApprovalsIssue(issue, parsed) {
	const fieldIssue = issue.code === "invalid_union" ? issue.errors[1]?.find((child) => child.path.length === 1) : void 0;
	const detail = fieldIssue ?? issue;
	const issuePath = fieldIssue ? [...issue.path, ...fieldIssue.path] : issue.path;
	let location = "";
	for (const [index, segment] of issuePath.slice(0, 5).entries()) if (index === 1 && issuePath[0] === "agents") {
		const agents = isRecord(parsed) && isRecord(parsed.agents) ? parsed.agents : {};
		const ordinal = typeof segment === "string" ? Object.keys(agents).indexOf(segment) + 1 : 0;
		if (!ordinal) break;
		location += ` entry #${ordinal}`;
	} else if (index === 3 && (issuePath[2] === "allowlist" || issuePath[2] === "mcpTools") && typeof segment === "number" && Number.isSafeInteger(segment) && segment >= 0) location += `[${segment}]`;
	else if (typeof segment === "string" && diagnosticFields.has(segment)) location += `${location ? "." : ""}${segment}`;
	else break;
	let reason = "invalid value";
	switch (detail.code) {
		case "invalid_type":
			switch (detail.expected) {
				case "string":
					reason = "expected a string";
					break;
				case "number":
					reason = "expected a finite number";
					break;
				case "boolean":
					reason = "expected a boolean";
					break;
				case "array":
					reason = "expected an array";
					break;
				case "object": reason = "expected an object";
			}
			break;
		case "invalid_value":
			reason = "expected a supported value";
			break;
		case "invalid_union":
			reason = "expected a non-empty string or an object with a non-empty pattern";
			break;
		case "too_small":
			reason = "expected a non-empty string";
			break;
		case "custom": if (issuePath.at(-1) === "pattern") reason = "expected a non-empty string";
	}
	return `${location || "document"}: ${reason}`;
}
/** Validate canonical policy and expose only a bounded, value-free failure diagnostic. */
function parsePersistedExecApprovals(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return err("invalid JSON syntax");
	}
	try {
		const result = persistedExecApprovalsSchema.safeParse(parsed);
		if (result.success) return ok(normalizeExecApprovalsInternal(result.data));
		const issue = result.error.issues[0];
		return err(issue ? formatPersistedExecApprovalsIssue(issue, parsed) : "invalid approvals structure");
	} catch {
		return err("invalid approvals structure");
	}
}
/** Parse only structurally valid persisted approvals without inventing fallback policy. */
function tryParsePersistedExecApprovals(raw) {
	const result = parsePersistedExecApprovals(raw);
	return result.ok ? result.value : null;
}
function normalizeAllowlistPattern(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	return trimmed ? normalizeLowercaseStringOrEmpty(trimmed) : null;
}
function mergeLegacyAgent(current, legacy) {
	const allowlist = [];
	const seen = /* @__PURE__ */ new Set();
	const pushEntry = (entry) => {
		const patternKey = normalizeAllowlistPattern(entry.pattern);
		if (!patternKey) return;
		const key = `${patternKey}\x00${entry.argPattern?.trim() ?? ""}`;
		if (seen.has(key)) return;
		seen.add(key);
		allowlist.push(entry);
	};
	for (const entry of current.allowlist ?? []) pushEntry(entry);
	for (const entry of legacy.allowlist ?? []) pushEntry(entry);
	return {
		...legacy,
		...current,
		security: current.security ?? legacy.security,
		ask: current.ask ?? legacy.ask,
		askFallback: current.askFallback ?? legacy.askFallback,
		autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
		allowlist: allowlist.length > 0 ? allowlist : void 0,
		mcpTools: current.mcpTools || legacy.mcpTools ? [...current.mcpTools ?? [], ...(legacy.mcpTools ?? []).filter((grant) => !current.mcpTools?.some((entry) => entry.server === grant.server && entry.tool === grant.tool))] : void 0
	};
}
function coerceAllowlistEntries(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return Array.isArray(allowlist) ? allowlist : void 0;
	let changed = false;
	const result = [];
	for (const item of allowlist) if (typeof item === "string") {
		const trimmed = item.trim();
		if (trimmed) {
			result.push({ pattern: trimmed });
			changed = true;
		} else changed = true;
	} else if (item && typeof item === "object" && !Array.isArray(item)) {
		const pattern = item.pattern;
		if (typeof pattern === "string" && pattern.trim().length > 0) result.push(item);
		else changed = true;
	} else changed = true;
	return changed ? result.length > 0 ? result : void 0 : allowlist;
}
function ensureAllowlistIds(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
	let changed = false;
	const next = allowlist.map((entry) => {
		if (entry.id) return entry;
		changed = true;
		return {
			...entry,
			id: crypto.randomUUID()
		};
	});
	return changed ? next : allowlist;
}
function stripAllowlistCommandText(allowlist) {
	if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
	let changed = false;
	const next = allowlist.map((entry) => {
		if (typeof entry.commandText !== "string") return entry;
		changed = true;
		const { commandText: _commandText, ...rest } = entry;
		return rest;
	});
	return changed ? next : allowlist;
}
function sanitizeExecApprovalPolicy(policy) {
	const security = toStringOrUndefined(policy?.security)?.trim();
	const ask = toStringOrUndefined(policy?.ask)?.trim();
	const askFallback = toStringOrUndefined(policy?.askFallback)?.trim();
	return {
		security: security === "deny" || security === "allowlist" || security === "full" ? security : void 0,
		ask: ask === "off" || ask === "on-miss" || ask === "always" ? ask : void 0,
		askFallback: askFallback === "deny" || askFallback === "allowlist" || askFallback === "full" ? askFallback : void 0,
		autoAllowSkills: policy?.autoAllowSkills
	};
}
function normalizeExecApprovalsInternal(file) {
	const { path: rawSocketPath, token: rawValue } = file.socket ?? {};
	const socketPath = rawSocketPath?.trim();
	const token = rawValue?.trim();
	const agents = { ...file.agents };
	const legacyDefault = agents.default;
	if (legacyDefault) {
		const main = agents[DEFAULT_AGENT_ID];
		agents[DEFAULT_AGENT_ID] = main ? mergeLegacyAgent(main, legacyDefault) : legacyDefault;
		delete agents.default;
	}
	for (const [key, agent] of Object.entries(agents)) {
		const allowlist = stripAllowlistCommandText(ensureAllowlistIds(coerceAllowlistEntries(agent.allowlist)));
		const sanitizedPolicy = sanitizeExecApprovalPolicy(agent);
		if (allowlist !== agent.allowlist || sanitizedPolicy.security !== agent.security || sanitizedPolicy.ask !== agent.ask || sanitizedPolicy.askFallback !== agent.askFallback) agents[key] = {
			...agent,
			allowlist,
			security: sanitizedPolicy.security,
			ask: sanitizedPolicy.ask,
			askFallback: sanitizedPolicy.askFallback
		};
	}
	const sanitizedDefaults = sanitizeExecApprovalPolicy(file.defaults);
	return {
		version: 1,
		socket: {
			path: socketPath && socketPath.length > 0 ? socketPath : void 0,
			token: token && token.length > 0 ? token : void 0
		},
		defaults: { ...sanitizedDefaults },
		agents
	};
}
function mergeExecApprovalsSocketDefaults(params) {
	const currentSocketPath = params.current?.socket?.path?.trim();
	const currentToken = params.current?.socket?.token?.trim();
	const socketPath = params.normalized.socket?.path?.trim() ?? currentSocketPath ?? resolveExecApprovalsSocketPath();
	const token = params.normalized.socket?.token?.trim() ?? currentToken ?? generateToken();
	return {
		...params.normalized,
		socket: {
			path: socketPath,
			token
		}
	};
}
function generateToken() {
	return randomBytes(24).toString("base64url");
}
//#endregion
export { mergeExecApprovalsSocketDefaults as a, resolveExecApprovalsDisplayPath as c, resolveExecApprovalsTranscriptPath as d, tryParsePersistedExecApprovals as f, generateToken as i, resolveExecApprovalsPath as l, DEFAULT_SECURITY as n, normalizeExecApprovalsInternal as o, createFailClosedExecApprovalsFallback as r, parsePersistedExecApprovals as s, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as t, resolveExecApprovalsSocketPath as u };
