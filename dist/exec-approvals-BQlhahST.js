import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { o as resolveRequiredHomeDir, r as resolveHomeRelativePath, t as expandHomePrefix } from "./home-dir-BjcCg_IW.js";
import { n as assertNoSymlinkParentsSync } from "./symlink-parents-LGlX4F0x.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-pTKRJb0m.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { f as POSIX_INLINE_COMMAND_FLAGS, h as hasPosixLoginStartupBeforeInlineCommand, l as isShellWrapperInvocation, m as hasPosixInteractiveStartupBeforeInlineCommand, r as extractBindableShellWrapperInlineCommand } from "./shell-wrapper-resolution-CWcJ2fJQ.js";
import "./exec-wrapper-resolution-CHJqVUbw.js";
import "./exec-approvals-analysis-DNOGYrfb.js";
import { s as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-DUeWnjMH.js";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import crypto from "node:crypto";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/jsonl-socket.ts
/**
* Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
*/
function resolveJsonlSocketTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, 1);
}
async function requestJsonlSocket(params) {
	const { socketPath, requestLine, accept } = params;
	const timeoutMs = resolveJsonlSocketTimeoutMs(params.timeoutMs);
	return await new Promise((resolve) => {
		const client = new net.Socket();
		let settled = false;
		let buffer = "";
		const finish = (value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			try {
				client.destroy();
			} catch {}
			resolve(value);
		};
		const timer = setTimeout(() => finish(null), timeoutMs);
		client.on("error", () => finish(null));
		client.on("end", () => finish(null));
		client.on("close", () => finish(null));
		client.connect(socketPath, () => {
			client.end(`${requestLine}\n`);
		});
		client.on("data", (data) => {
			buffer += data.toString("utf8");
			let idx = buffer.indexOf("\n");
			while (idx !== -1) {
				const line = buffer.slice(0, idx).trim();
				buffer = buffer.slice(idx + 1);
				idx = buffer.indexOf("\n");
				if (!line) continue;
				try {
					const result = accept(JSON.parse(line));
					if (result === void 0) continue;
					finish(result);
					return;
				} catch {}
			}
		});
	});
}
//#endregion
//#region src/infra/exec-approvals.ts
const EXEC_TARGET_VALUES = [
	"auto",
	"sandbox",
	"gateway",
	"node"
];
function normalizeExecHost(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") return normalized;
	return null;
}
function normalizeExecTarget(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "auto") return normalized;
	return normalizeExecHost(normalized);
}
function requireValidExecTarget(value) {
	if (value == null) return null;
	if (typeof value !== "string") throw new Error(`Invalid exec host value type ${typeof value}. Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return null;
	const target = normalizeExecTarget(normalized);
	if (target) return target;
	throw new Error(`Invalid exec host "${value}". Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
}
/** Coerce a raw JSON field to string, returning undefined for non-string types. */
const toStringOrUndefined = readStringValue;
function normalizeExecSecurity(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "full") return normalized;
	return null;
}
function normalizeExecAsk(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "off" || normalized === "on-miss" || normalized === "always") return normalized;
	return null;
}
function normalizeExecMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "ask" || normalized === "auto" || normalized === "full") return normalized;
	return null;
}
function resolveExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function resolveExecPolicyForMode(mode) {
	switch (mode) {
		case "deny": return {
			security: "deny",
			ask: "off",
			autoReview: false
		};
		case "allowlist": return {
			security: "allowlist",
			ask: "off",
			autoReview: false
		};
		case "ask": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: false
		};
		case "auto": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: true
		};
		case "full": return {
			security: "full",
			ask: "off",
			autoReview: false
		};
	}
	throw new Error(`Unsupported exec mode: ${String(mode)}`);
}
function resolveExecModePolicy(params) {
	if (!params.mode) return {
		mode: resolveExecModeFromPolicy({
			security: params.security,
			ask: params.ask
		}),
		security: params.security,
		ask: params.ask,
		autoReview: false
	};
	return {
		mode: params.mode,
		...resolveExecPolicyForMode(params.mode)
	};
}
const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 18e5;
const DEFAULT_SECURITY = "full";
const DEFAULT_ASK = "off";
const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK = "deny";
const DEFAULT_AUTO_ALLOW_SKILLS = false;
const DEFAULT_EXEC_APPROVALS_STATE_DIR = "~/.openclaw";
const EXEC_APPROVALS_FILE = "exec-approvals.json";
const EXEC_APPROVALS_SOCKET = "exec-approvals.sock";
function hashExecApprovalsRaw(raw) {
	return crypto.createHash("sha256").update(raw ?? "").digest("hex");
}
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
function resolveExecApprovalsPath() {
	return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsSocketPath() {
	return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_SOCKET);
}
function resolveExecApprovalsDisplayPath() {
	const stateDir = resolveExecApprovalsStateDir().displayPath;
	return stateDir === DEFAULT_EXEC_APPROVALS_STATE_DIR ? `${stateDir}/${EXEC_APPROVALS_FILE}` : path.join(stateDir, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsTranscriptPath() {
	return process.env.OPENCLAW_STATE_DIR?.trim() ? `$OPENCLAW_STATE_DIR/${EXEC_APPROVALS_FILE}` : `${DEFAULT_EXEC_APPROVALS_STATE_DIR}/${EXEC_APPROVALS_FILE}`;
}
function resolveLegacyExecApprovalsPath() {
	return path.join(expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR), EXEC_APPROVALS_FILE);
}
function hasUnmigratedLegacyExecApprovals(filePath) {
	if (!process.env.OPENCLAW_STATE_DIR?.trim()) return false;
	const legacyPath = resolveLegacyExecApprovalsPath();
	return path.resolve(legacyPath) !== path.resolve(filePath) && !fs.existsSync(filePath) && fs.existsSync(legacyPath);
}
function createUnmigratedLegacyExecApprovalsFallback() {
	return normalizeExecApprovals({
		version: 1,
		defaults: {
			security: "deny",
			ask: "always",
			askFallback: "deny"
		},
		agents: {}
	});
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
		security: current.security ?? legacy.security,
		ask: current.ask ?? legacy.ask,
		askFallback: current.askFallback ?? legacy.askFallback,
		autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
		allowlist: allowlist.length > 0 ? allowlist : void 0
	};
}
function ensureDir(filePath) {
	const dir = path.dirname(filePath);
	assertNoExecApprovalsSymlinkParents(dir, resolveRequiredHomeDir());
	fs.mkdirSync(dir, { recursive: true });
	const dirStat = fs.lstatSync(dir);
	if (!dirStat.isDirectory() || dirStat.isSymbolicLink()) throw new Error(`Refusing to use unsafe exec approvals directory: ${dir}`);
	try {
		fs.chmodSync(dir, 448);
	} catch (err) {
		if (process.platform !== "win32") throw err;
	}
	return dir;
}
function assertNoExecApprovalsSymlinkParents(targetPath, trustedRoot) {
	assertNoSymlinkParentsSync({
		rootDir: trustedRoot,
		targetPath,
		allowOutsideRoot: true,
		messagePrefix: "Refusing to traverse symlink in exec approvals path"
	});
}
function assertSafeExecApprovalsDestination(filePath) {
	try {
		if (fs.lstatSync(filePath).isSymbolicLink()) throw new Error(`Refusing to write exec approvals via symlink: ${filePath}`);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
}
function assertSafeExecApprovalsOverwriteFallback(filePath) {
	assertSafeExecApprovalsDestination(filePath);
	try {
		if (fs.statSync(filePath).nlink > 1) throw new Error(`Refusing copy fallback for hard-linked exec approvals file: ${filePath}`);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
}
function sameFilesystemEntry(left, right) {
	return left.dev === right.dev && left.ino === right.ino;
}
function readExecApprovalsFallbackSnapshotFromFd(fd) {
	const chunks = [];
	const buffer = Buffer.alloc(64 * 1024);
	let position = 0;
	while (true) {
		const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, position);
		if (bytesRead === 0) break;
		chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
		position += bytesRead;
	}
	return Buffer.concat(chunks);
}
function validateExecApprovalsFallbackFd(filePath, fd) {
	if (fs.lstatSync(filePath).isSymbolicLink()) throw new Error(`Refusing to write exec approvals via symlink: ${filePath}`);
	const pathStat = fs.statSync(filePath);
	const fdStat = fs.fstatSync(fd);
	if (!fdStat.isFile()) throw new Error(`Refusing copy fallback for non-file exec approvals path: ${filePath}`);
	if (fdStat.nlink > 1) throw new Error(`Refusing copy fallback for hard-linked exec approvals file: ${filePath}`);
	if (!sameFilesystemEntry(pathStat, fdStat)) throw new Error(`Refusing copy fallback after exec approvals path changed: ${filePath}`);
	return fdStat;
}
function openExistingExecApprovalsFallbackDestination(filePath) {
	const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
	const fd = fs.openSync(filePath, fs.constants.O_RDWR | noFollowFlag, 384);
	try {
		validateExecApprovalsFallbackFd(filePath, fd);
		return {
			existed: true,
			fd,
			snapshot: readExecApprovalsFallbackSnapshotFromFd(fd)
		};
	} catch (err) {
		try {
			fs.closeSync(fd);
		} catch {}
		throw err;
	}
}
function createExecApprovalsFallbackDestination(filePath) {
	const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
	try {
		const fd = fs.openSync(filePath, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollowFlag, 384);
		try {
			validateExecApprovalsFallbackFd(filePath, fd);
			return {
				existed: false,
				fd,
				snapshot: null
			};
		} catch (err) {
			try {
				fs.closeSync(fd);
			} catch {}
			throw err;
		}
	} catch (err) {
		if (err.code === "EEXIST") return openExistingExecApprovalsFallbackDestination(filePath);
		throw err;
	}
}
function openExecApprovalsFallbackDestination(filePath) {
	try {
		return openExistingExecApprovalsFallbackDestination(filePath);
	} catch (err) {
		if (err.code === "ENOENT") return createExecApprovalsFallbackDestination(filePath);
		throw err;
	}
}
function writeExecApprovalsFallbackBuffer(fd, contents) {
	fs.ftruncateSync(fd, 0);
	let written = 0;
	while (written < contents.length) written += fs.writeSync(fd, contents, written, contents.length - written, written);
	fs.ftruncateSync(fd, contents.length);
	try {
		fs.fchmodSync(fd, 384);
	} catch {}
}
function restoreExecApprovalsFallbackDestination(filePath, destination) {
	if (!destination.existed) {
		try {
			if (sameFilesystemEntry(fs.statSync(filePath), fs.fstatSync(destination.fd))) fs.rmSync(filePath, { force: true });
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		return;
	}
	writeExecApprovalsFallbackBuffer(destination.fd, destination.snapshot ?? Buffer.alloc(0));
}
function copyExecApprovalsFallback(tempPath, filePath) {
	const contents = fs.readFileSync(tempPath);
	const destination = openExecApprovalsFallbackDestination(filePath);
	try {
		writeExecApprovalsFallbackBuffer(destination.fd, contents);
		validateExecApprovalsFallbackFd(filePath, destination.fd);
	} catch (copyErr) {
		try {
			restoreExecApprovalsFallbackDestination(filePath, destination);
		} catch (restoreErr) {
			throw new Error(`Failed to restore exec approvals after copy fallback failure for ${filePath}: ${String(copyErr)}`, { cause: restoreErr });
		}
		throw copyErr;
	} finally {
		fs.closeSync(destination.fd);
	}
}
function renameExecApprovalsWithFallback(tempPath, filePath) {
	try {
		fs.renameSync(tempPath, filePath);
	} catch (err) {
		const code = err.code;
		if (code !== "EPERM" && code !== "EEXIST") throw err;
		assertSafeExecApprovalsOverwriteFallback(filePath);
		copyExecApprovalsFallback(tempPath, filePath);
		fs.rmSync(tempPath, { force: true });
	}
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
function normalizeExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	const token = file.socket?.token?.trim();
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
	const token = params.normalized.socket?.token?.trim() ?? currentToken ?? "";
	return {
		...params.normalized,
		socket: {
			path: socketPath,
			token
		}
	};
}
function generateToken() {
	return crypto.randomBytes(24).toString("base64url");
}
function readExecApprovalsSnapshot() {
	const filePath = resolveExecApprovalsPath();
	if (hasUnmigratedLegacyExecApprovals(filePath)) return {
		path: filePath,
		exists: false,
		raw: null,
		file: createUnmigratedLegacyExecApprovalsFallback(),
		hash: hashExecApprovalsRaw(null)
	};
	if (!fs.existsSync(filePath)) return {
		path: filePath,
		exists: false,
		raw: null,
		file: normalizeExecApprovals({
			version: 1,
			agents: {}
		}),
		hash: hashExecApprovalsRaw(null)
	};
	const raw = fs.readFileSync(filePath, "utf8");
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		parsed = null;
	}
	return {
		path: filePath,
		exists: true,
		raw,
		file: parsed?.version === 1 ? normalizeExecApprovals(parsed) : normalizeExecApprovals({
			version: 1,
			agents: {}
		}),
		hash: hashExecApprovalsRaw(raw)
	};
}
function loadExecApprovals() {
	const filePath = resolveExecApprovalsPath();
	if (hasUnmigratedLegacyExecApprovals(filePath)) return createUnmigratedLegacyExecApprovalsFallback();
	try {
		if (!fs.existsSync(filePath)) return normalizeExecApprovals({
			version: 1,
			agents: {}
		});
		const raw = fs.readFileSync(filePath, "utf8");
		const parsed = JSON.parse(raw);
		if (parsed?.version !== 1) return normalizeExecApprovals({
			version: 1,
			agents: {}
		});
		return normalizeExecApprovals(parsed);
	} catch {
		return normalizeExecApprovals({
			version: 1,
			agents: {}
		});
	}
}
function saveExecApprovals(file) {
	writeExecApprovalsRaw(resolveExecApprovalsPath(), `${JSON.stringify(file, null, 2)}\n`);
}
function writeExecApprovalsRaw(filePath, raw) {
	const dir = ensureDir(filePath);
	assertSafeExecApprovalsDestination(filePath);
	const tempPath = path.join(dir, `.exec-approvals.${process.pid}.${crypto.randomUUID()}.tmp`);
	let tempWritten = false;
	try {
		fs.writeFileSync(tempPath, raw, {
			mode: 384,
			flag: "wx"
		});
		try {
			fs.chmodSync(tempPath, 384);
		} catch {}
		tempWritten = true;
		renameExecApprovalsWithFallback(tempPath, filePath);
	} finally {
		if (tempWritten && fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true });
	}
	try {
		fs.chmodSync(filePath, 384);
	} catch {}
}
function restoreExecApprovalsSnapshot(snapshot) {
	if (!snapshot.exists) {
		fs.rmSync(snapshot.path, { force: true });
		return;
	}
	if (snapshot.raw !== null) {
		writeExecApprovalsRaw(snapshot.path, snapshot.raw);
		return;
	}
	saveExecApprovals(snapshot.file);
}
function ensureExecApprovals() {
	if (hasUnmigratedLegacyExecApprovals(resolveExecApprovalsPath())) return createUnmigratedLegacyExecApprovalsFallback();
	const next = normalizeExecApprovals(loadExecApprovals());
	const socketPath = next.socket?.path?.trim();
	const token = next.socket?.token?.trim();
	const updated = {
		...next,
		socket: {
			path: socketPath && socketPath.length > 0 ? socketPath : resolveExecApprovalsSocketPath(),
			token: token && token.length > 0 ? token : generateToken()
		}
	};
	saveExecApprovals(updated);
	return updated;
}
function readExecApprovalsForNoPersistence(filePath) {
	if (hasUnmigratedLegacyExecApprovals(filePath)) return createUnmigratedLegacyExecApprovalsFallback();
	assertNoExecApprovalsSymlinkParents(path.dirname(filePath), resolveRequiredHomeDir());
	assertSafeExecApprovalsDestination(filePath);
	let raw;
	try {
		raw = fs.readFileSync(filePath, "utf8");
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
		return normalizeExecApprovals({
			version: 1,
			agents: {}
		});
	}
	try {
		const parsed = JSON.parse(raw);
		if (parsed?.version === 1) return normalizeExecApprovals(parsed);
	} catch {}
	return normalizeExecApprovals({
		version: 1,
		agents: {}
	});
}
function isExecSecurity(value) {
	return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
	return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
	return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
	return isExecAsk(value) ? value : fallback;
}
function resolveDefaultSecurityField(params) {
	const defaultValue = params.defaults[params.field];
	if (isExecSecurity(defaultValue)) return {
		value: defaultValue,
		source: `defaults.${params.field}`
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveDefaultAskField(params) {
	if (isExecAsk(params.defaults.ask)) return {
		value: params.defaults.ask,
		source: "defaults.ask"
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveAgentSecurityField(params) {
	const fallbackField = resolveDefaultSecurityField({
		field: params.field,
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent[params.field] != null) {
		if (isExecSecurity(params.agent[params.field])) return {
			value: params.agent[params.field],
			source: `agents.${params.agentKey}.${params.field}`
		};
		return fallbackField;
	}
	if (params.rawWildcard[params.field] != null) {
		if (isExecSecurity(params.wildcard[params.field])) return {
			value: params.wildcard[params.field],
			source: `agents.*.${params.field}`
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveAgentAskField(params) {
	const fallbackField = resolveDefaultAskField({
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent.ask != null) {
		if (isExecAsk(params.agent.ask)) return {
			value: params.agent.ask,
			source: `agents.${params.agentKey}.ask`
		};
		return fallbackField;
	}
	if (params.rawWildcard.ask != null) {
		if (isExecAsk(params.wildcard.ask)) return {
			value: params.wildcard.ask,
			source: "agents.*.ask"
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveExecApprovals(agentId, overrides) {
	const filePath = resolveExecApprovalsPath();
	if (hasUnmigratedLegacyExecApprovals(filePath)) return resolveExecApprovalsFromFile({
		file: createUnmigratedLegacyExecApprovalsFallback(),
		agentId,
		overrides,
		path: filePath,
		socketPath: resolveExecApprovalsSocketPath(),
		token: ""
	});
	if (!overrides?.requireSocket) {
		const file = readExecApprovalsForNoPersistence(filePath);
		const resolved = resolveExecApprovalsFromFile({
			file,
			agentId,
			overrides,
			path: filePath,
			socketPath: resolveExecApprovalsSocketPath(),
			token: ""
		});
		if (resolved.agent.security === "full" && resolved.agent.ask === "off" && !file.socket?.token?.trim()) return resolved;
	}
	const file = ensureExecApprovals();
	return resolveExecApprovalsFromFile({
		file,
		agentId,
		overrides,
		path: resolveExecApprovalsPath(),
		socketPath: expandHomePrefix(file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: file.socket?.token ?? ""
	});
}
function resolveExecApprovalsFromFile(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovals(params.file);
	const defaults = file.defaults ?? {};
	const agentKey = params.agentId ?? "main";
	const agent = file.agents?.[agentKey] ?? {};
	const wildcard = file.agents?.["*"] ?? {};
	const rawAgent = rawFile.agents?.[agentKey] ?? {};
	const rawWildcard = rawFile.agents?.["*"] ?? {};
	const fallbackSecurity = params.overrides?.security ?? DEFAULT_SECURITY;
	const fallbackAsk = params.overrides?.ask ?? DEFAULT_ASK;
	const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
	const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? DEFAULT_AUTO_ALLOW_SKILLS;
	const resolvedDefaults = {
		security: normalizeSecurity(defaults.security, fallbackSecurity),
		ask: normalizeAsk(defaults.ask, fallbackAsk),
		askFallback: normalizeSecurity(defaults.askFallback ?? fallbackAskFallback, fallbackAskFallback),
		autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
	};
	const resolvedAgentSecurity = resolveAgentSecurityField({
		field: "security",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.security
	});
	const resolvedAgentAsk = resolveAgentAskField({
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.ask
	});
	const resolvedAgentAskFallback = resolveAgentSecurityField({
		field: "askFallback",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.askFallback
	});
	const resolvedAgent = {
		security: resolvedAgentSecurity.value,
		ask: resolvedAgentAsk.value,
		askFallback: resolvedAgentAskFallback.value,
		autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
	};
	const allowlist = [...Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [], ...Array.isArray(agent.allowlist) ? agent.allowlist : []];
	return {
		path: params.path ?? resolveExecApprovalsPath(),
		socketPath: expandHomePrefix(params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: params.token ?? file.socket?.token ?? "",
		defaults: resolvedDefaults,
		agent: resolvedAgent,
		agentSources: {
			security: resolvedAgentSecurity.source,
			ask: resolvedAgentAsk.source,
			askFallback: resolvedAgentAskFallback.source
		},
		allowlist,
		file
	};
}
function requiresExecApproval(params) {
	if (params.ask === "always") return true;
	if (params.durableApprovalSatisfied === true) return false;
	return params.ask === "on-miss" && params.security === "allowlist" && (!params.analysisOk || !params.allowlistSatisfied);
}
function normalizeCommandName(value) {
	return (value ?? "").split(/[\\/]/).pop()?.toLowerCase() ?? "";
}
function textMentionsSecurityAuditSuppressions(value) {
	const normalized = value.toLowerCase();
	return normalized.includes("security.audit.suppressions") || /["']?security["']?[\s\S]{0,200}["']?audit["']?[\s\S]{0,200}["']?suppressions["']?/.test(normalized);
}
function isReadOnlySecurityAuditSuppressionInspection(argv) {
	let offset = normalizeCommandName(argv[0]) === "pnpm" && argv[1] === "openclaw" ? 1 : 0;
	if (normalizeCommandName(argv[offset]) !== "openclaw") return false;
	offset += 1;
	while (offset < argv.length) {
		const arg = argv[offset];
		if (["--dev", "--no-color"].includes(arg ?? "")) {
			offset += 1;
			continue;
		}
		if ([
			"--profile",
			"--container",
			"--log-level"
		].includes(arg ?? "")) {
			offset += 2;
			continue;
		}
		if (arg?.startsWith("--profile=") || arg?.startsWith("--container=") || arg?.startsWith("--log-level=")) {
			offset += 1;
			continue;
		}
		break;
	}
	return argv[offset] === "config" && [
		"get",
		"schema",
		"validate"
	].includes(argv[offset + 1] ?? "");
}
function removeParsedSegmentText(command, segments) {
	let remaining = command;
	for (const segment of segments) {
		const raw = (segment.raw ?? segment.argv?.join(" "))?.trim();
		if (!raw) continue;
		remaining = remaining.replace(raw, " ");
	}
	return remaining;
}
function commandRequiresSecurityAuditSuppressionApproval(params) {
	let sawSegmentMention = false;
	for (const segment of params.segments) {
		if (!textMentionsSecurityAuditSuppressions(`${segment.raw ?? ""} ${segment.argv.join(" ")}`)) continue;
		sawSegmentMention = true;
		if (!isReadOnlySecurityAuditSuppressionInspection(segment.argv)) return true;
	}
	if (sawSegmentMention) {
		if (textMentionsSecurityAuditSuppressions(removeParsedSegmentText(params.command, params.segments))) return true;
		return false;
	}
	return textMentionsSecurityAuditSuppressions(params.command);
}
function hasDurableExecApproval(params) {
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) || hasSegmentDurableExecApproval({
		analysisOk: params.analysisOk,
		segmentAllowlistEntries: params.segmentAllowlistEntries
	});
}
function buildDurableCommandApprovalPattern(commandText) {
	return `=command:${crypto.createHash("sha256").update(commandText).digest("hex").slice(0, 16)}`;
}
function buildNodeCommandApprovalPattern(commandText) {
	return `=node-command:${crypto.createHash("sha256").update(commandText).digest("hex").slice(0, 16)}`;
}
function hasNodeCommandAllowAlwaysMarker(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildNodeCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && entry.pattern === commandPattern);
}
function hasExactCommandDurableExecApproval(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildDurableCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && (entry.pattern === commandPattern || typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand));
}
function hasSegmentDurableExecApproval(params) {
	return params.analysisOk && params.segmentAllowlistEntries.length > 0 && params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always");
}
function recordAllowlistUse(approvals, agentId, entry, command, resolvedPath) {
	const target = agentId ?? "main";
	const agents = approvals.agents ?? {};
	const existing = agents[target] ?? {};
	const nextAllowlist = (Array.isArray(existing.allowlist) ? existing.allowlist : []).map((item) => item.pattern === entry.pattern && (item.argPattern ?? void 0) === (entry.argPattern ?? void 0) ? Object.assign({}, item, {
		id: item.id ?? crypto.randomUUID(),
		lastUsedAt: Date.now(),
		lastUsedCommand: command,
		lastResolvedPath: resolvedPath
	}) : item);
	agents[target] = {
		...existing,
		allowlist: nextAllowlist
	};
	approvals.agents = agents;
	saveExecApprovals(approvals);
}
function buildAllowlistEntryMatchKey(entry) {
	return `${entry.pattern}\x00${entry.argPattern?.trim() ?? ""}`;
}
function recordAllowlistMatchesUse(params) {
	if (params.matches.length === 0) return;
	const seen = /* @__PURE__ */ new Set();
	for (const match of params.matches) {
		if (!match.pattern) continue;
		const key = buildAllowlistEntryMatchKey(match);
		if (seen.has(key)) continue;
		seen.add(key);
		recordAllowlistUse(params.approvals, params.agentId, match, params.command, params.resolvedPath);
	}
}
function addAllowlistEntry(approvals, agentId, pattern, options) {
	const target = agentId ?? "main";
	const agents = approvals.agents ?? {};
	const existing = agents[target] ?? {};
	const allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
	const trimmed = pattern.trim();
	if (!trimmed) return;
	const trimmedArgPattern = normalizeOptionalString(options?.argPattern);
	const existingEntry = allowlist.find((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === trimmedArgPattern);
	if (existingEntry && (!options?.source || existingEntry.source === options.source)) return;
	const now = Date.now();
	const nextAllowlist = existingEntry ? allowlist.map((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === trimmedArgPattern ? {
		...entry,
		argPattern: trimmedArgPattern,
		source: options?.source ?? entry.source,
		lastUsedAt: now
	} : entry) : [...allowlist, {
		id: crypto.randomUUID(),
		pattern: trimmed,
		argPattern: trimmedArgPattern,
		source: options?.source,
		lastUsedAt: now
	}];
	agents[target] = {
		...existing,
		allowlist: nextAllowlist
	};
	approvals.agents = agents;
	saveExecApprovals(approvals);
}
function addDurableCommandApproval(approvals, agentId, commandText) {
	const normalized = commandText.trim();
	if (!normalized) return;
	addAllowlistEntry(approvals, agentId, buildDurableCommandApprovalPattern(normalized), { source: "allow-always" });
}
function resolveAllowAlwaysPatternCoverage(params) {
	const byKey = /* @__PURE__ */ new Map();
	let representedSegmentCount = 0;
	for (const segment of params.segments) {
		if (isShellWrapperInvocation(segment.argv)) {
			const segmentPatterns = resolveAllowAlwaysPatternEntries({
				segments: [segment],
				cwd: params.cwd,
				env: params.env,
				platform: params.platform,
				strictInlineEval: params.strictInlineEval
			});
			for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
			continue;
		}
		const segmentPatterns = resolveAllowAlwaysPatternEntries({
			segments: [segment],
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (segmentPatterns.length === 0) continue;
		representedSegmentCount += 1;
		for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
	}
	return {
		complete: params.segments.length > 0 && representedSegmentCount === params.segments.length,
		patterns: [...byKey.values()]
	};
}
function persistAllowAlwaysPatterns(params) {
	const coverage = resolveAllowAlwaysPatternCoverage({
		segments: params.segments,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform,
		strictInlineEval: params.strictInlineEval
	});
	const patterns = coverage.patterns;
	for (const pattern of patterns) {
		if (!pattern.pattern) continue;
		addAllowlistEntry(params.approvals, params.agentId, pattern.pattern, {
			argPattern: pattern.argPattern,
			source: "allow-always"
		});
	}
	const normalizedCommand = params.commandText?.trim();
	if (normalizedCommand && coverage.complete && patterns.length > 0) addAllowlistEntry(params.approvals, params.agentId, buildNodeCommandApprovalPattern(normalizedCommand), { source: "allow-always" });
	return patterns;
}
function hasRuntimeShellPayload(argv) {
	const inlineCommand = extractBindableShellWrapperInlineCommand([...argv]);
	return Boolean(inlineCommand && (/(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\()/u.test(inlineCommand) || hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function resolvePlanPersistenceState(plan) {
	if (!plan) return {
		reusablePatternsAllowed: true,
		reasons: []
	};
	if (!plan.ok) return {
		reusablePatternsAllowed: false,
		reasons: ["unplanned"]
	};
	const reasons = /* @__PURE__ */ new Set();
	let reusablePatternsAllowed = true;
	const candidates = plan.groups.flatMap((group) => group.candidates);
	for (const candidate of candidates) {
		if (candidate.trustMode === "prompt-only") reasons.add("prompt-only");
		if (candidate.trustMode === "exact-command") reasons.add("no-reusable-pattern");
		if (candidate.trustMode === "executable" && !candidate.allowAlways) reasons.add("no-reusable-pattern");
		reusablePatternsAllowed = reusablePatternsAllowed && candidate.allowAlways;
		if (hasRuntimeShellPayload(candidate.sourceSegment.argv)) reasons.add("runtime-payload");
		if (candidate.transport.kind === "shell-wrapper" && hasRuntimeShellPayload(candidate.transport.wrapperArgv)) reasons.add("runtime-payload");
	}
	return {
		reusablePatternsAllowed,
		reasons: [...reasons]
	};
}
function resolveAllowAlwaysPersistenceDecision(params) {
	const planPersistence = resolvePlanPersistenceState(params.authorizationPlan);
	const reasons = new Set(planPersistence.reasons);
	if (params.runtimePayload === true) reasons.add("runtime-payload");
	const commandText = params.commandText?.trim();
	const hardReasons = [...reasons].filter((reason) => reason !== "no-reusable-pattern");
	if (hardReasons.length > 0) return {
		kind: "one-shot",
		reasons: hardReasons
	};
	if (params.preparedCoverage?.complete === true && params.preparedCoverage.patterns.length > 0) return {
		kind: "patterns",
		patterns: params.preparedCoverage.patterns,
		...commandText ? { commandText } : {}
	};
	if (planPersistence.reusablePatternsAllowed) {
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: params.segments,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (coverage.patterns.length > 0) return {
			kind: "patterns",
			patterns: coverage.patterns,
			...commandText && coverage.complete ? { commandText } : {}
		};
	}
	reasons.add("no-reusable-pattern");
	return {
		kind: "one-shot",
		reasons: [...reasons]
	};
}
function persistAllowAlwaysDecision(params) {
	if (params.decision.kind === "one-shot") return;
	if (params.decision.kind === "exact-command") {
		addDurableCommandApproval(params.approvals, params.agentId, params.decision.commandText);
		return;
	}
	for (const pattern of params.decision.patterns) {
		if (!pattern.pattern) continue;
		addAllowlistEntry(params.approvals, params.agentId, pattern.pattern, {
			argPattern: pattern.argPattern,
			source: "allow-always"
		});
	}
	const normalizedCommand = params.decision.commandText?.trim();
	if (normalizedCommand) addAllowlistEntry(params.approvals, params.agentId, buildNodeCommandApprovalPattern(normalizedCommand), { source: "allow-always" });
}
function minSecurity(a, b) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
const OPTIONAL_EXEC_APPROVAL_DECISION_SET = new Set(OPTIONAL_EXEC_APPROVAL_DECISIONS);
function isOptionalExecApprovalDecision(decision) {
	return OPTIONAL_EXEC_APPROVAL_DECISION_SET.has(decision);
}
function collectExecApprovalUnavailableDecisionSet(decisions) {
	const unavailable = /* @__PURE__ */ new Set();
	if (!Array.isArray(decisions)) return unavailable;
	for (const decision of decisions) if (isOptionalExecApprovalDecision(decision)) unavailable.add(decision);
	return unavailable;
}
function normalizeExecApprovalUnavailableDecisions(decisions) {
	const unavailable = collectExecApprovalUnavailableDecisionSet(decisions);
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => unavailable.has(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
	if (normalizeExecAsk(params?.ask) === "always" || params?.allowAlwaysPersistence?.kind === "one-shot") return ["allow-once", "deny"];
	return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
	const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
	const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
	const unavailableDecisions = collectExecApprovalUnavailableDecisionSet(params?.unavailableDecisions);
	if (unavailableDecisions.size === 0) return policyDecisions;
	return policyDecisions.filter((decision) => !isOptionalExecApprovalDecision(decision) || !unavailableDecisions.has(decision));
}
function isExecApprovalDecisionAllowed(params) {
	return resolveExecApprovalAllowedDecisions({ ask: params.ask }).includes(params.decision);
}
async function requestExecApprovalViaSocket(params) {
	const { socketPath, token, request } = params;
	if (!socketPath || !token) return null;
	const timeoutMs = params.timeoutMs ?? 15e3;
	return await requestJsonlSocket({
		socketPath,
		requestLine: JSON.stringify({
			type: "request",
			token,
			id: crypto.randomUUID(),
			request
		}),
		timeoutMs,
		accept: (value) => {
			const msg = value;
			if (msg?.type === "decision" && msg.decision) return msg.decision;
		}
	});
}
//#endregion
export { requestExecApprovalViaSocket as A, resolveExecApprovalsFromFile as B, normalizeExecSecurity as C, readExecApprovalsSnapshot as D, persistAllowAlwaysPatterns as E, resolveExecApprovalAllowedDecisions as F, resolveExecModePolicy as G, resolveExecApprovalsSocketPath as H, resolveExecApprovalRequestAllowedDecisions as I, saveExecApprovals as J, resolveExecPolicyForMode as K, resolveExecApprovalUnavailableDecisions as L, requiresExecApproval as M, resolveAllowAlwaysPatternCoverage as N, recordAllowlistMatchesUse as O, resolveAllowAlwaysPersistenceDecision as P, resolveExecApprovals as R, normalizeExecMode as S, persistAllowAlwaysDecision as T, resolveExecApprovalsTranscriptPath as U, resolveExecApprovalsPath as V, resolveExecModeFromPolicy as W, requestJsonlSocket as Y, minSecurity as _, OPTIONAL_EXEC_APPROVAL_DECISIONS as a, normalizeExecAsk as b, commandRequiresSecurityAuditSuppressionApproval as c, hasExactCommandDurableExecApproval as d, hasNodeCommandAllowAlwaysMarker as f, mergeExecApprovalsSocketDefaults as g, maxAsk as h, EXEC_TARGET_VALUES as i, requireValidExecTarget as j, recordAllowlistUse as k, ensureExecApprovals as l, loadExecApprovals as m, DEFAULT_EXEC_APPROVAL_DECISIONS as n, addAllowlistEntry as o, isExecApprovalDecisionAllowed as p, restoreExecApprovalsSnapshot as q, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as r, addDurableCommandApproval as s, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as t, hasDurableExecApproval as u, normalizeExecApprovalUnavailableDecisions as v, normalizeExecTarget as w, normalizeExecHost as x, normalizeExecApprovals as y, resolveExecApprovalsDisplayPath as z };
