import { S as parseStrictInteger } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
//#region src/agents/bash-tools.shared.ts
/**
* Shared helpers for bash exec/process tools.
* Owns output slicing, environment coercion, and compact session labels.
*/
const CHUNK_LIMIT = 8192;
/** Builds the environment passed into sandboxed exec calls. */
function buildSandboxEnv(params) {
	const env = {
		PATH: params.defaultPath,
		HOME: params.containerWorkdir
	};
	for (const [key, value] of Object.entries(params.sandboxEnv ?? {})) env[key] = value;
	for (const [key, value] of Object.entries(params.paramsEnv ?? {})) env[key] = value;
	return env;
}
/** Coerces process/env-like records to string-only environment variables. */
function coerceEnv(env) {
	const record = {};
	if (!env) return record;
	for (const [key, value] of Object.entries(env)) if (typeof value === "string") record[key] = value;
	return record;
}
/**
* Clamp a number within min/max bounds, using defaultValue if undefined or NaN.
*/
function clampWithDefault(value, defaultValue, min, max) {
	if (value === void 0 || Number.isNaN(value)) return defaultValue;
	return Math.min(Math.max(value, min), max);
}
/** Reads a strict integer from the preferred env var or one legacy alias. */
function readEnvInt(key, legacyKey) {
	const raw = process.env[key] || (legacyKey ? process.env[legacyKey] : void 0);
	return parseStrictInteger(raw);
}
/** Splits output into bounded chunks without splitting UTF-16 surrogate pairs. */
function chunkString(input, limit = CHUNK_LIMIT) {
	const chunks = [];
	const chunkLimit = Number.isNaN(limit) ? CHUNK_LIMIT : Math.max(1, Math.floor(limit));
	let i = 0;
	while (i < input.length) {
		const firstCodePointWidth = (input.codePointAt(i) ?? 0) > 65535 ? 2 : 1;
		const chunk = sliceUtf16Safe(input, i, i + Math.max(chunkLimit, firstCodePointWidth));
		chunks.push(chunk);
		i += chunk.length;
	}
	return chunks;
}
/** Truncates long labels in the middle while preserving UTF-16 boundaries. */
function truncateMiddle(str, max) {
	if (str.length <= max) return str;
	const half = Math.floor((max - 3) / 2);
	return `${sliceUtf16Safe(str, 0, half)}...${sliceUtf16Safe(str, -half)}`;
}
/** Returns a line-based log slice plus original line/character counts. */
function sliceLogLines(text, offset, limit) {
	if (!text) return {
		slice: "",
		totalLines: 0,
		totalChars: 0
	};
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
	const totalLines = lines.length;
	const totalChars = text.length;
	let start = typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
	if (limit !== void 0 && offset === void 0) start = Math.max(totalLines - Math.max(0, Math.floor(limit)), 0);
	const end = typeof limit === "number" && Number.isFinite(limit) ? start + Math.max(0, Math.floor(limit)) : void 0;
	return {
		slice: lines.slice(start, end).join("\n"),
		totalLines,
		totalChars
	};
}
/** Derives a compact human label from a shell command. */
function deriveSessionName(command) {
	const tokens = tokenizeCommand(command);
	if (tokens.length === 0) return;
	const verb = tokens[0];
	if (!verb) return "";
	let target = tokens.slice(1).find((t) => !t.startsWith("-"));
	if (!target) target = tokens[1];
	if (!target) return verb;
	const cleaned = truncateMiddle(stripQuotes(target), 48);
	return `${stripQuotes(verb)} ${cleaned}`;
}
function tokenizeCommand(command) {
	return (command.match(/(?:[^\s"']+|"(?:\\.|[^"\\])*"|'[^']*')+/g) ?? []).map((token) => stripQuotes(token)).filter(Boolean);
}
function stripQuotes(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
/** Right-pads a string for aligned plain-text process output. */
function padProcessStatus(str, width) {
	if (str.length >= width) return str;
	return str + " ".repeat(width - str.length);
}
//#endregion
//#region src/agents/bash-process-registry.ts
const DEFAULT_JOB_TTL_MS = 18e5;
const MIN_JOB_TTL_MS = 6e4;
const MAX_JOB_TTL_MS = 108e5;
const DEFAULT_PENDING_OUTPUT_CHARS = 3e4;
const MAX_FINISHED_SESSION_COUNT = 50;
const MAX_FINISHED_SESSION_OUTPUT_CHARS = 2e6;
function clampTtl(value) {
	if (value === void 0 || Number.isNaN(value)) return DEFAULT_JOB_TTL_MS;
	return Math.min(Math.max(value, MIN_JOB_TTL_MS), MAX_JOB_TTL_MS);
}
const defaultJobTtlMs = clampTtl(readEnvInt("OPENCLAW_BASH_JOB_TTL_MS", "PI_BASH_JOB_TTL_MS"));
/** Resolves the retention duration captured by one admitted exec process. */
function resolveProcessCleanupMs(value) {
	return value === void 0 ? defaultJobTtlMs : clampTtl(value);
}
const runningSessions = /* @__PURE__ */ new Map();
const finishedSessions = /* @__PURE__ */ new Map();
let processSessionStartOrders = /* @__PURE__ */ new WeakMap();
let nextProcessSessionStartOrder = 0;
const activeExecSessions = /* @__PURE__ */ new Map();
let finishedSessionOutputChars = 0;
let sweeper = null;
/** Return whether a process session id is live, retained, or reserved for notification. */
function isProcessSessionIdTaken(id) {
	return runningSessions.has(id) || finishedSessions.has(id) || activeExecSessions.has(id);
}
/** Adds a running session; retention starts only after background completion. */
function addSession(session) {
	processSessionStartOrders.set(session, nextProcessSessionStartOrder++);
	runningSessions.set(session.id, session);
	activeExecSessions.set(session.id, {
		session,
		promoted: session.backgrounded
	});
}
/** Sorts registered process records newest-first, including same-millisecond starts. */
function compareProcessSessionStartOrder(left, right) {
	return right.startedAt - left.startedAt || processSessionStartOrders.get(right) - processSessionStartOrders.get(left);
}
/** Returns a running session by id. */
function getSession(id) {
	return runningSessions.get(id);
}
/** Returns a retained finished background session by id. */
function getFinishedSession(id) {
	return finishedSessions.get(id);
}
function deleteFinishedSession(id) {
	const session = finishedSessions.get(id);
	if (!session) return false;
	finishedSessions.delete(id);
	finishedSessionOutputChars -= session.aggregated.length;
	return true;
}
/** Removes visible session records without changing live-process activity. */
function deleteSession(id) {
	runningSessions.delete(id);
	deleteFinishedSession(id);
	scheduleSweeper();
}
/** Removes completed process records belonging to retired session identities. */
function clearFinishedSessionsForScopes(scopeKeys) {
	const retiredScopes = /* @__PURE__ */ new Set();
	for (const scopeKey of scopeKeys) {
		const normalizedScope = scopeKey.trim();
		if (normalizedScope) retiredScopes.add(normalizedScope);
	}
	if (retiredScopes.size === 0) return;
	for (const [id, session] of finishedSessions) if (session.scopeKey && retiredScopes.has(session.scopeKey)) deleteFinishedSession(id);
	scheduleSweeper();
}
/** Appends process output while enforcing aggregate and pending-output caps. */
function appendOutput(session, stream, chunk) {
	if (typeof session.pendingOutput === "string") return;
	const streamChars = stream === "stdout" ? session.pendingStdoutChars : session.pendingStderrChars;
	const pendingCap = Math.min(session.pendingMaxOutputChars ?? DEFAULT_PENDING_OUTPUT_CHARS, session.maxOutputChars);
	session.pendingOutput.push({
		stream,
		text: chunk
	});
	let pendingChars = streamChars + chunk.length;
	if (pendingChars > pendingCap) {
		session.truncated = true;
		session.pendingOutputDropped = true;
		pendingChars = capPendingStream(session.pendingOutput, stream, pendingChars, pendingCap);
	}
	if (stream === "stdout") session.pendingStdoutChars = pendingChars;
	else session.pendingStderrChars = pendingChars;
	session.totalOutputChars += chunk.length;
	const aggregated = trimWithCap(session.aggregated + chunk, session.maxOutputChars);
	session.truncated = session.truncated || aggregated.length < session.aggregated.length + chunk.length;
	session.aggregated = aggregated;
	session.tail = tail(session.aggregated, 2e3);
}
/** Drains pending chunks in producer callback order for a process poll. */
function drainSession(session) {
	const pending = session.pendingOutput;
	const output = typeof pending === "string" ? pending : pending.map((chunk) => chunk.text).join("");
	const outputDropped = session.pendingOutputDropped;
	session.pendingOutput = typeof pending === "string" ? "" : [];
	session.pendingStdoutChars = 0;
	session.pendingStderrChars = 0;
	session.pendingOutputDropped = false;
	return {
		output,
		outputDropped
	};
}
/** Stages one poll result until the agent transcript acknowledges its attachment. */
function prepareSessionPoll(session, scope) {
	if (!scope) return {
		...drainSession(session),
		acknowledge() {}
	};
	const pending = session.pendingPollDelivery;
	if (pending) {
		if (pending.scope === scope) return {
			output: "",
			outputDropped: false,
			acknowledge() {}
		};
		pending.scope = scope;
		return {
			output: pending.output,
			outputDropped: pending.outputDropped,
			acknowledge() {
				if (session.pendingPollDelivery === pending) session.pendingPollDelivery = void 0;
			}
		};
	}
	const drained = drainSession(session);
	if (drained.output.length === 0 && !drained.outputDropped) return {
		...drained,
		acknowledge() {}
	};
	const delivery = {
		...drained,
		scope
	};
	session.pendingPollDelivery = delivery;
	return {
		...drained,
		acknowledge() {
			if (session.pendingPollDelivery === delivery) session.pendingPollDelivery = void 0;
		}
	};
}
/** Returns whether a prior poll has output ready for immediate replay. */
function hasPendingPollDelivery(session) {
	return session.pendingPollDelivery !== void 0;
}
/** Moves a session to finished state and records exit metadata. */
function markExited(session, exitCode, exitSignal, status, exitReason, noOutputTimedOut) {
	session.terminalStatus = status;
	session.exited = true;
	delete session.processActivity;
	session.exitCode = exitCode;
	session.exitSignal = exitSignal;
	session.exitReason = exitReason;
	session.noOutputTimedOut = noOutputTimedOut;
	session.tail = tail(session.aggregated, 2e3);
	const pending = drainSession(session);
	session.pendingOutput = pending.output;
	session.pendingOutputDropped = pending.outputDropped;
	moveToFinished(session);
	const active = activeExecSessions.get(session.id);
	if (active?.session === session) {
		activeExecSessions.delete(session.id);
		active.settled?.resolve();
	}
}
/** Marks a running session as reconnectable after the exec call returns. */
function markBackgrounded(session) {
	session.backgrounded = true;
	const active = activeExecSessions.get(session.id);
	if (active?.session === session) active.promoted = true;
}
/** Retains the precise completion-event removal handle on its process owner. */
function recordNotifyOnExitRemoval(session, remove) {
	if (session.terminalPollObserved) {
		remove();
		return;
	}
	session.notifyOnExitRemoval = remove;
}
/** Acknowledges one completion event without touching unrelated queue entries. */
function acknowledgeNotifyOnExit(record) {
	record.terminalPollObserved = true;
	const remove = record.notifyOnExitRemoval;
	if (!remove) return;
	remove();
	record.notifyOnExitRemoval = void 0;
}
/** Returns the promoted process owner even after its presentation record is removed. */
function getActiveBackgroundExecSession(sessionId) {
	const active = activeExecSessions.get(sessionId);
	return active?.promoted ? active.session : void 0;
}
/** Reports owner-tracked process liveness even after visibility is removed. */
function hasActiveBackgroundExecSession(sessionId) {
	return getActiveBackgroundExecSession(sessionId) !== void 0;
}
/** Returns the number of live background exec sessions without exposing process details. */
function getActiveBackgroundExecSessionCount() {
	let count = 0;
	for (const { promoted } of activeExecSessions.values()) if (promoted) count += 1;
	return count;
}
/** Joins registered exec cleanup, including foreground and hidden processes. */
async function waitForExecScope(scopeKey) {
	while (true) {
		const pending = Array.from(activeExecSessions.values()).filter(({ session }) => session.scopeKey === scopeKey).map((active) => (active.settled ??= createDeferredCore()).promise);
		if (pending.length === 0) return;
		await Promise.all(pending);
	}
}
function moveToFinished(session) {
	runningSessions.delete(session.id);
	const stdin = session.stdin;
	if (stdin) {
		if (typeof stdin.destroy === "function") stdin.destroy();
		else if (typeof stdin.end === "function") stdin.end();
		delete session.stdin;
	}
	if (!session.backgrounded) return;
	deleteFinishedSession(session.id);
	const endedAt = Date.now();
	finishedSessions.set(session.id, Object.assign(session, {
		endedAt,
		expiresAt: endedAt + session.cleanupMs
	}));
	finishedSessionOutputChars += session.aggregated.length;
	while (finishedSessions.size > MAX_FINISHED_SESSION_COUNT || finishedSessions.size > 1 && finishedSessionOutputChars > MAX_FINISHED_SESSION_OUTPUT_CHARS) {
		const oldestSessionId = finishedSessions.keys().next().value;
		if (oldestSessionId === void 0) break;
		deleteFinishedSession(oldestSessionId);
	}
	scheduleSweeper();
}
/** Returns the last `max` characters of text without adding ellipses. */
function tail(text, max = 2e3) {
	if (text.length <= max) return text;
	return sliceUtf16Safe(text, text.length - max);
}
function capPendingStream(output, stream, pendingCharsInput, cap) {
	let pendingChars = pendingCharsInput;
	let overflow = pendingChars - cap;
	let writeIndex = 0;
	let index = 0;
	for (; index < output.length && overflow > 0; index += 1) {
		const chunk = output[index];
		if (!chunk || chunk.stream !== stream) {
			if (writeIndex !== index) output.copyWithin(writeIndex, index, index + 1);
			writeIndex += 1;
			continue;
		}
		if (chunk.text.length <= overflow) {
			overflow -= chunk.text.length;
			pendingChars -= chunk.text.length;
			continue;
		}
		const trimmed = sliceUtf16Safe(chunk.text, overflow);
		const removedChars = chunk.text.length - trimmed.length;
		pendingChars -= removedChars;
		chunk.text = trimmed;
		break;
	}
	if (writeIndex !== index) output.splice(writeIndex, index - writeIndex);
	return pendingChars;
}
/** Keeps only the last `max` characters for bounded aggregate output storage. */
function trimWithCap(text, max) {
	return tail(text, max);
}
/** Lists backgrounded running sessions visible to reconnect/poll callers. */
function listRunningSessions() {
	return Array.from(runningSessions.values()).filter((s) => s.backgrounded);
}
/** Lists retained finished background sessions. */
function listFinishedSessions() {
	return Array.from(finishedSessions.values());
}
/** Test-only reset for in-memory registry state and retention timers. */
function resetProcessRegistryForTests() {
	runningSessions.clear();
	finishedSessions.clear();
	processSessionStartOrders = /* @__PURE__ */ new WeakMap();
	nextProcessSessionStartOrder = 0;
	finishedSessionOutputChars = 0;
	for (const active of activeExecSessions.values()) active.settled?.resolve();
	activeExecSessions.clear();
	stopSweeper();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.bashProcessRegistryTestApi")] = { resetProcessRegistryForTests };
function scheduleSweeper() {
	stopSweeper();
	const now = Date.now();
	let nextExpiration = Number.POSITIVE_INFINITY;
	for (const [id, session] of finishedSessions) if (session.expiresAt <= now) deleteFinishedSession(id);
	else nextExpiration = Math.min(nextExpiration, session.expiresAt);
	if (!Number.isFinite(nextExpiration)) return;
	sweeper = setTimeout(scheduleSweeper, nextExpiration - now);
	sweeper.unref?.();
}
function stopSweeper() {
	if (!sweeper) return;
	clearTimeout(sweeper);
	sweeper = null;
}
//#endregion
export { sliceLogLines as A, buildSandboxEnv as C, deriveSessionName as D, coerceEnv as E, padProcessStatus as O, waitForExecScope as S, clampWithDefault as T, markExited as _, compareProcessSessionStartOrder as a, resolveProcessCleanupMs as b, getActiveBackgroundExecSessionCount as c, hasActiveBackgroundExecSession as d, hasPendingPollDelivery as f, markBackgrounded as g, listRunningSessions as h, clearFinishedSessionsForScopes as i, truncateMiddle as j, readEnvInt as k, getFinishedSession as l, listFinishedSessions as m, addSession as n, deleteSession as o, isProcessSessionIdTaken as p, appendOutput as r, getActiveBackgroundExecSession as s, acknowledgeNotifyOnExit as t, getSession as u, prepareSessionPoll as v, chunkString as w, tail as x, recordNotifyOnExitRemoval as y };
