import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { a as closeCodexAppServerTransport, o as closeCodexAppServerTransportAndWait, s as hasCodexAppServerNaturalExit, t as createStdioTransport } from "./transport-stdio-CRWvp1Xm.mjs";
import { d as CodexAppServerRpcError, f as CodexAppServerScopedRequestRejectedError, h as isCodexAppServerOverloadError, l as CODEX_APP_SERVER_OVERLOADED_ERROR_CODE, p as CodexCatalogResponseTooLargeError, u as CodexAppServerLocalRequestCancellationError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { a as closeCodexCatalogClientSource, f as createCodexRequestAttempt, n as projectCodexCatalogNativeThread, o as codexCatalogSourceForClient, p as remainingCodexRequestTime, r as reuseCodexCatalogPreview, t as projectCodexCatalogNativeResponse, u as recordCodexCatalogResponseSource } from "./session-catalog-native-projection-BLwj5FZe.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { codexCatalogPageWorkerEntrypoint } from "../catalog-page-worker-entrypoint.js";
import { i as isUnsupportedCodexAppServerVersionError, n as buildCodexAppServerInitializeParams, r as buildCodexAppServerRuntimeIdentity, t as assertSupportedCodexAppServerVersion } from "./client-initialize-BDr9Km1X.mjs";
import { t as createWebSocketTransport } from "./transport-websocket-ChqCf46P.mjs";
import { t as __exportAll } from "./session-binding-sidecars-DPQAWL9D.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isRecord, normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { coerceErrorMessage, materializeErrorStack, toErrorObject, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { MAX_TIMER_TIMEOUT_MS, addSafeTimeoutDelayGraceMs, addTimerTimeoutGraceMs, asFiniteNumberInRange, floorPositiveFiniteNumber, parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { truncateWithMarker } from "openclaw/plugin-sdk/string-normalization-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { embeddedAgentLog as embeddedAgentLog$1, formatToolExecutionErrorMessage, normalizeQuestionTimeoutSeconds, resolveToolExecutionErrorKind } from "openclaw/plugin-sdk/agent-harness-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/terminal-safe-text";
import { AsyncWorkScope } from "openclaw/plugin-sdk/concurrency-runtime";
import { copyInternalToolResultState, runWithAsyncWorkResources } from "openclaw/plugin-sdk/agent-harness-tool-runtime";
import { Errors } from "typebox/schema";
// extensions/codex/src/app-server/protocol-json.ts
function isRpcResponse(message) {
	return message !== null && typeof message === "object" && "id" in message && (typeof message.id === "number" || typeof message.id === "string") && !("method" in message);
}
// extensions/codex/src/app-server/client-catalog-route.ts
function codexCatalogResponseRoute(id) {
	return typeof id === "number" && Number.isSafeInteger(id) && id >= 2 ** 52 ? {
		id,
		kind: id % 2 === 1 ? "list" : "thread"
	} : void 0;
}
/** Read bounded envelope keys and IDs; skip native payload strings as bytes. */
function readCodexCatalogDecodeRoute(line) {
	let depth = 0;
	let route;
	let response = false;
	for (let index = 0; index < line.length; index++) {
		const byte = line[index];
		if (byte === 123 || byte === 91) depth++;
		else if (byte === 125 || byte === 93) depth--;
		else if (byte === 34) {
			const start = index;
			for (;;) {
				index = line.indexOf(34, index + 1);
				if (index < 0) return "unresolved";
				let slash = index - 1;
				while (line[slash] === 92) slash--;
				if ((index - slash) % 2 === 1) break;
			}
			if (depth !== 1 || index - start > 64) continue;
			let colon = index + 1;
			while (line[colon] === 32 || line[colon] === 9 || line[colon] === 13) colon++;
			if (line[colon] !== 58) continue;
			const token = line.toString("utf8", start, index + 1);
			let key = token.slice(1, -1);
			if (token.includes("\\")) try {
				key = JSON.parse(token);
			} catch {
				return "unresolved";
			}
			if (key === "method") return;
			if (key === "result" || key === "error") {
				response = true;
				if (route) return route;
			}
			if (key !== "id") continue;
			const match = /^\s*:\s*(\d+)(?=\s*[,}])/u.exec(line.toString("utf8", index + 1, Math.min(index + 100, line.length)));
			if (!match) continue;
			route = codexCatalogResponseRoute(Number(match[1]));
			if (!route || response) return route;
		}
	}
	return response || route ? "unresolved" : void 0;
}
// extensions/codex/src/app-server/client-message-decoder.ts
/** Parses the single JSON value in an app-server LF-delimited frame. */
function parseCodexAppServerMessage(line, reportError) {
	const frame = line.trim();
	if (!frame) return;
	try {
		return JSON.parse(frame);
	} catch {
		reportError({
			byteCount: Buffer.byteLength(frame),
			charCount: frame.length,
			fragmentCount: 1
		});
		return;
	}
}
// extensions/codex/src/app-server/client-catalog-response.ts
function projectCodexCatalogMessage(parsed, input, cachedPreview) {
	const result = { failures: [] };
	if (!isJsonObject(parsed)) return result;
	result.message = parsed;
	if (!isRpcResponse(parsed)) return result;
	const message = parsed;
	const route = codexCatalogResponseRoute(message.id);
	if (message.error || !route) return result;
	const remainingRows = input.route === "unresolved" ? 0 : input.remainingRows;
	try {
		if (!isJsonObject(message.result)) throw new Error("Codex catalog response contains an invalid result");
		if (route.kind === "list") {
			const raw = message.result;
			const page = projectCodexCatalogNativeResponse(raw, sanitizeTerminalText, cachedPreview, remainingRows);
			message.result = page;
			if (!cachedPreview) {
				const rows = raw.data;
				const states = Array.isArray(rows) ? page.data.map((_, index) => {
					const row = rows[index];
					return isJsonObject(row) && typeof row.preview === "string" ? Boolean(row.preview) : void 0;
				}) : [];
				result.preview = {
					rows: page.data,
					states
				};
			}
		} else {
			const thread = message.result.thread;
			message.result = { thread: {
				...projectCodexCatalogNativeThread(thread, sanitizeTerminalText),
				...isJsonObject(thread) && typeof thread.cwd === "string" ? { cwd: thread.cwd } : {},
				...isJsonObject(thread) && (thread.historyMode === "paginated" || thread.historyMode === "legacy") ? { historyMode: thread.historyMode } : {}
			} };
		}
	} catch (error) {
		delete result.message;
		result.projectionError = {
			id: route.id,
			error: error instanceof Error ? error : new Error("Codex catalog projection failed", { cause: error })
		};
	}
	return result;
}
// extensions/codex/src/app-server/client-catalog-worker.ts
const INLINE_CATALOG_MAX_BYTES = 65536;
const CATALOG_MAX_BYTES = 8388608;
const CATALOG_SINGLETON_MAX_BYTES = 67108864;
const loadProcessRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/process-runtime"));
/** Late responses retain their decode route after cancellation removes the waiter. */
function codexCatalogRequestId(method, params, sequence, catalogPreview) {
	if (!catalogPreview) return sequence;
	const thread = method === "thread/read" && isJsonObject(params) && params.includeTurns !== true;
	return method === "thread/list" || thread ? Number.MAX_SAFE_INTEGER - 2 * sequence - (thread ? 1 : 0) : sequence;
}
/** Each physical client owns one catalog projection worker. */
var CodexCatalogWorker = class {
	constructor() {
		this.closed = false;
	}
	async decode(line, route, attempts) {
		if (this.closed) return;
		const oversizedSingleton = line.byteLength > CATALOG_MAX_BYTES && route !== "unresolved" && route.kind === "list" && attempts.get(route.id)?.catalogProjection?.singleThread === true;
		if (line.byteLength > (oversizedSingleton ? CATALOG_SINGLETON_MAX_BYTES : CATALOG_MAX_BYTES)) {
			const error = new CodexCatalogResponseTooLargeError();
			return route === "unresolved" ? { failures: [{
				byteCount: line.byteLength,
				fragmentCount: 1
			}] } : {
				failures: [],
				projectionError: {
					id: route.id,
					error
				}
			};
		}
		if (route !== "unresolved" && line.byteLength <= INLINE_CATALOG_MAX_BYTES) {
			let parsed;
			try {
				parsed = JSON.parse(line.toString("utf8"));
			} catch {}
			if (parsed !== void 0) {
				const attempt = attempts.get(route.id);
				const projection = attempt?.catalogProjection;
				return projectCodexCatalogMessage(parsed, {
					route,
					remainingRows: attempt ? projection?.remainingRows : 0
				}, projection?.preview);
			}
		}
		if (!this.pool) {
			const { resolveRuntimeWorkerUrl, WorkerTaskPool } = await loadProcessRuntime();
			if (this.closed) return;
			this.pool = new WorkerTaskPool({
				workerUrl: resolveRuntimeWorkerUrl(codexCatalogPageWorkerEntrypoint),
				workerClass: "singleton",
				maxPendingTasks: 1,
				maxPendingBytes: CATALOG_SINGLETON_MAX_BYTES,
				restartOnError: false,
				onRetirementFailure: (error) => {
					this.pool?.close(toErrorObject(error, "Catalog worker retirement failed")).catch(() => void 0);
				}
			});
		}
		const attempt = route === "unresolved" ? void 0 : attempts.get(route.id);
		const remainingRows = attempt ? attempt.catalogProjection?.remainingRows : 0;
		const bytes = line.byteLength === line.buffer.byteLength && line.buffer instanceof ArrayBuffer ? new Uint8Array(line.buffer) : Uint8Array.from(line);
		const decoded = await this.pool.run({
			bytes,
			route,
			remainingRows,
			oversizedSingleton
		}, {
			inputBytes: bytes.byteLength,
			transferList: (input) => [input.bytes.buffer]
		});
		if (this.closed) return;
		if (oversizedSingleton && !decoded.message) return {
			failures: decoded.failures,
			projectionError: {
				id: route.id,
				error: new CodexCatalogResponseTooLargeError()
			}
		};
		return decoded;
	}
	async close(error) {
		this.closed = true;
		await this.pool?.close(error).catch(() => this.pool?.close(error));
	}
};
// extensions/codex/src/app-server/client-line-preview.ts
const CODEX_APP_SERVER_PARSE_LOG_MAX = 500;
function redactCodexAppServerLinePreview(value) {
	const redacted = value.replace(/\s+/g, " ").trim().replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+/gi, "$1<redacted>").replace(/("(?:api_?key|authorization|token|access_token|refresh_token)"\s*:\s*")([^"]+)(")/gi, "$1<redacted>$3").replace(/\b([a-z0-9_]*(?:api_?key|authorization|access_token|refresh_token|token))(\s*=\s*)(["']?)[^\s"']+(\3)/gi, "$1$2$3<redacted>$4");
	return redacted.length > CODEX_APP_SERVER_PARSE_LOG_MAX ? `...${sliceUtf16Safe(redacted, -500)}` : redacted;
}
// extensions/codex/src/app-server/client-diagnostics.ts
function observeCodexAppServerStderr(stderr, consume) {
	stderr.setEncoding("utf8");
	stderr.on("data", consume);
	stderr.on("error", () => embeddedAgentLog$1.warn("codex app-server stderr stream failed"));
}
function appendBoundedTail(current, next, maxLength) {
	const combined = `${current}${next}`;
	return combined.length > maxLength ? sliceUtf16Safe(combined, -maxLength) : combined;
}
function buildCodexAppServerExitError(code, signal, stderrTail) {
	const stderrPreview = redactCodexAppServerLinePreview(stderrTail);
	const suffix = stderrPreview ? ` stderr=${JSON.stringify(stderrPreview)}` : "";
	return /* @__PURE__ */ new Error(`codex app-server exited: code=${formatExitValue(code)} signal=${formatExitValue(signal)}${suffix}`);
}
function logCodexAppServerParseFailure(failure) {
	embeddedAgentLog$1.warn("failed to parse codex app-server message", failure);
}
function isCodexAppServerBrokenPipeError(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		if ("code" in current && current.code === "EPIPE") return true;
		current = "cause" in current ? current.cause : void 0;
	}
	return false;
}
function formatExitValue(value) {
	if (value === null || value === void 0) return "null";
	if (typeof value === "string" || typeof value === "number") return String(value);
	return "unknown";
}
// extensions/codex/src/app-server/client-message-frames.ts
function createCodexAppServerMessageWriter(options) {
	return (message, onError, beforeWrite) => {
		if (options.isClosed()) return;
		const child = options.getTransport();
		const id = "id" in message ? message.id : void 0;
		const method = "method" in message ? message.method : void 0;
		const frame = JSON.stringify(message, (_key, value) => typeof value === "string" ? value.replace(UNPAIRED_SURROGATE_RE, "") : value) ?? "null";
		if (child.maxFrameBytes && Buffer.byteLength(frame) > child.maxFrameBytes) throw new Error("Codex request exceeds the transport frame limit; reduce attached images or context.");
		beforeWrite?.();
		if (method === "command/exec") options.onNativeExecution();
		child.stdin.write(`${frame}\n`, (error) => {
			if (error) {
				embeddedAgentLog.warn("codex app-server write failed", {
					error,
					id,
					method
				});
				onError?.(error);
			}
		});
	};
}
const UNPAIRED_SURROGATE_RE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
/** One byte reader owns framing and stops at an asynchronous page decode. */
function listenCodexAppServerLines(input, onLine, onError) {
	const fragments = [];
	let length = 0;
	let remainder;
	let waiting = false;
	let ended = false;
	let closed = false;
	const close = () => {
		closed = true;
		fragments.length = 0;
		remainder = void 0;
		input.off("data", onData);
		input.off("end", onEnd);
		input.pause();
	};
	const deliver = (tail) => {
		let line = tail;
		if (fragments.length) {
			fragments.push(tail);
			line = Buffer.concat(fragments, length + tail.length);
		}
		fragments.length = 0;
		length = 0;
		const completion = onLine(line);
		if (!completion) return true;
		waiting = true;
		input.pause();
		completion.then(() => {
			waiting = false;
			if (!closed) {
				drain();
				if (!waiting && !ended && !closed) input.resume();
			}
		}).catch((error) => {
			close();
			onError(error);
		});
		return false;
	};
	const drain = () => {
		try {
			const chunk = remainder;
			remainder = void 0;
			if (chunk) {
				let start = 0;
				let end;
				while ((end = chunk.indexOf(10, start)) !== -1) {
					if (closed) return;
					if (!deliver(chunk.subarray(start, end))) {
						remainder = closed ? void 0 : chunk.subarray(end + 1);
						return;
					}
					start = end + 1;
				}
				if (!closed && start < chunk.length) {
					fragments.push(chunk.subarray(start));
					length += chunk.length - start;
				}
			}
			if (ended && !closed) {
				if (length && !deliver(Buffer.alloc(0))) return;
				close();
			}
		} catch (error) {
			close();
			onError(error);
		}
	};
	const onData = (chunk) => {
		remainder = chunk;
		drain();
	};
	const onEnd = () => {
		ended = true;
		if (!waiting) drain();
	};
	input.on("data", onData);
	input.once("end", onEnd);
	return close;
}
// extensions/codex/src/app-server/client-notifications.ts
const CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX = 32;
const LOG_ONLY_CODEX_WARNING_PATTERNS = [/^Configured service tier `[^`\r\n]+` is not advertised as supported for model `[^`\r\n]+` and will be omitted from requests\.$/, /^Code Mode is enabled in configuration, but model `[^`\r\n]+` does not advertise Code Mode support\. This may degrade model performance\. Disable `features\.code_mode` and `features\.code_mode_only`, or select a model whose metadata enables Code Mode\.$/];
const CODEX_LOG_WRITE_WARNINGS = /* @__PURE__ */ new Set(["Codex couldn't save diagnostic logs to its local database. Use /feedback with logs included before closing Codex, or run `codex doctor` for diagnostics.", "Codex couldn't save diagnostic logs to its local database. Run `codex doctor` for diagnostics."]);
function readCodexAppServerWarningMessage(params) {
	return [readStringField(params, "summary") ?? readStringField(params, "message"), readStringField(params, "details")].filter(Boolean).join("\n");
}
function logCodexAppServerManagedWarning(notification) {
	if (notification.method !== "warning" && notification.method !== "configWarning" || !isJsonObject(notification.params)) return false;
	const message = readCodexAppServerWarningMessage(notification.params);
	if (!(notification.method === "warning" && notification.params.threadId === null && CODEX_LOG_WRITE_WARNINGS.has(message)) && !LOG_ONLY_CODEX_WARNING_PATTERNS.some((pattern) => pattern.test(message))) return false;
	try {
		embeddedAgentLog$1.warn(message);
	} catch {}
	return true;
}
var CodexAppServerNotifications = class {
	constructor() {
		this.handlers = /* @__PURE__ */ new Set();
		this.pendingStartupWarnings = [];
	}
	addHandler(handler) {
		this.handlers.add(handler);
		for (const notification of this.pendingStartupWarnings.splice(0)) this.dispatch(notification);
		return () => this.handlers.delete(handler);
	}
	dispatch(notification) {
		if (logCodexAppServerManagedWarning(notification)) return;
		if (this.handlers.size === 0 && notification.method === "configWarning") {
			if (this.pendingStartupWarnings.length === CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX) this.pendingStartupWarnings.shift();
			this.pendingStartupWarnings.push(notification);
			return;
		}
		for (const handler of this.handlers) try {
			Promise.resolve(handler(notification)).catch((error) => {
				embeddedAgentLog$1.warn("codex app-server notification handler failed", { error });
			});
		} catch (error) {
			embeddedAgentLog$1.warn("codex app-server notification handler failed", { error });
		}
	}
};
// extensions/codex/src/app-server/client-response.ts
/** Settles one wire attempt and reports newly observed native execution. */
function dispatchCodexAppServerResponse(response, attempts, source, preview) {
	const pending = attempts.get(response.id);
	if (!pending) return false;
	attempts.delete(response.id);
	if (response.error) {
		const error = new CodexAppServerRpcError(response.error, pending.method);
		pending.reject(error, error.code === CODEX_APP_SERVER_OVERLOADED_ERROR_CODE);
		return false;
	}
	const nativeExecution = pending.method === "thread/backgroundTerminals/list" && isJsonObject(response.result) && Array.isArray(response.result.data) && response.result.data.length > 0;
	const cache = pending.catalogProjection?.preview;
	if (cache && preview) try {
		for (const [index, row] of preview.rows.entries()) if (row.ephemeral !== true) {
			const cached = reuseCodexCatalogPreview(row, preview.states[index], cache);
			if (cached !== void 0) row.preview = cached;
		}
	} catch (error) {
		pending.reject(error instanceof Error ? error : new Error("Codex catalog projection failed", { cause: error }), false);
		return false;
	}
	recordCodexCatalogResponseSource(pending.method, response.result, source);
	pending.resolve(response.result);
	return nativeExecution;
}
// extensions/codex/src/app-server/request-admission.ts
/** Consume authority once at the physical writer; waiter expiry never permits a late write. */
function dispatchCodexRequestAttempt(attempt, options, assertTransportCurrent, writeMessage) {
	let consumed = false;
	const write = () => {
		if (consumed) return;
		consumed = true;
		if (!attempt.pending) return;
		assertTransportCurrent();
		try {
			options.assertCurrent?.();
		} catch (cause) {
			throw cause instanceof CodexAppServerScopedRequestRejectedError ? cause : new CodexAppServerScopedRequestRejectedError(coerceErrorMessage(cause), { cause });
		}
		writeMessage();
	};
	const rejectAdmission = (cause) => {
		attempt.failLocal(!consumed && !(cause instanceof CodexAppServerScopedRequestRejectedError) ? new CodexAppServerScopedRequestRejectedError(coerceErrorMessage(cause), { cause }) : toStringifiedError(cause));
	};
	try {
		if (options.withCurrent) options.withCurrent(write).then(() => {
			if (!consumed) throw new Error("Codex request authority did not admit the wire write");
		}).catch(rejectAdmission);
		else write();
	} catch (error) {
		rejectAdmission(error);
	}
}
// extensions/codex/src/app-server/dynamic-tool-response-state.ts
function createFailedDynamicToolResponse(message, options) {
	return {
		contentItems: [{
			type: "inputText",
			text: message
		}],
		success: false,
		diagnosticTerminalReason: options?.terminalReason ?? "failed",
		diagnosticTerminalType: "error",
		executionStarted: options?.unknownTool ? false : options?.executionStarted,
		executedArguments: options?.executedArguments,
		...options?.unknownTool ? { unknownTool: true } : {},
		sideEffectEvidence: options?.sideEffectEvidence === true || void 0
	};
}
function failedToolResult(message, status = "failed") {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status,
			error: message
		}
	};
}
// extensions/codex/src/app-server/tool-abort-terminal-reason.ts
const CODEX_ABORT_TERMINAL_REASONS = /* @__PURE__ */ new Map([
	["codex_startup_timeout", "timed_out"],
	["turn_completion_idle_timeout", "timed_out"],
	["turn_progress_idle_timeout", "timed_out"],
	["turn_terminal_idle_timeout", "timed_out"],
	["client_closed", "failed"]
]);
/** Preserves timeout provenance when an enclosing run aborts an active tool. */
function resolveCodexToolAbortTerminalReason(signal) {
	const reason = signal.reason;
	if (typeof reason === "string") return CODEX_ABORT_TERMINAL_REASONS.get(reason) ?? "cancelled";
	if (reason && typeof reason === "object") {
		const record = reason;
		if (record.name === "TimeoutError" || record.reason === "timeout") return "timed_out";
	}
	return "cancelled";
}
// extensions/codex/src/app-server/dynamic-tool-execution.ts
const CODEX_DYNAMIC_TOOL_TIMEOUT_MS = 9e4;
const CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS = 6e5;
const CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS = 3e4;
const CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS = 12e4;
const CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS = 3e4;
const CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS = 3e4;
const CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS = 6e4;
const CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS = 6e5;
/** Outer default for collector waits: full swarm budget plus completion grace. */
const CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS = 63e4;
const LOG_FIELD_MAX_LENGTH = 160;
function normalizeLogField(value) {
	if (typeof value !== "string") return;
	const normalized = value.replaceAll(String.fromCharCode(27), " ").replaceAll("\r", " ").replaceAll("\n", " ").replaceAll("	", " ").trim();
	if (!normalized) return;
	return truncateWithMarker(normalized, LOG_FIELD_MAX_LENGTH, {
		marker: "...",
		reserve: 3,
		trimEnd: false
	});
}
function readNumericTimeoutMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
	if (typeof value === "string") {
		const parsed = parseStrictNonNegativeInteger(value);
		return parsed === void 0 ? void 0 : Math.max(0, parsed);
	}
}
function formatDynamicToolTimeoutDetails(params) {
	const tool = normalizeLogField(params.call.tool) ?? "unknown";
	const baseMeta = {
		tool: params.call.tool,
		toolCallId: params.call.callId,
		threadId: params.call.threadId,
		turnId: params.call.turnId,
		timeoutMs: params.timeoutMs,
		timeoutKind: "codex_dynamic_tool_rpc"
	};
	if (tool !== "process" || !isJsonObject(params.call.arguments)) return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms while running tool ${tool}.`,
		consoleMessage: `codex dynamic tool timeout: tool=${tool} toolTimeoutMs=${params.timeoutMs}; per-tool-call watchdog, not session idle`,
		meta: baseMeta
	};
	const action = normalizeLogField(params.call.arguments.action);
	const sessionId = normalizeLogField(params.call.arguments.sessionId);
	const requestedTimeoutMs = readNumericTimeoutMs(params.call.arguments.timeout);
	const actionPart = action ? ` action=${action}` : "";
	const sessionPart = sessionId ? ` sessionId=${sessionId}` : "";
	const requestedPart = requestedTimeoutMs === void 0 ? "" : ` requestedWaitMs=${requestedTimeoutMs}`;
	const retryHint = action === "poll" ? "; repeated lines usually mean process-poll retry churn, not model progress" : "";
	const responseTarget = action || sessionId ? ` while waiting for process${actionPart}${sessionPart}` : " while waiting for the process tool";
	return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms${responseTarget}. This is a tool RPC timeout, not a session idle timeout.`,
		consoleMessage: `codex process tool timeout:${actionPart}${sessionPart} toolTimeoutMs=${params.timeoutMs}${requestedPart}; per-tool-call watchdog, not session idle${retryHint}`,
		meta: {
			...baseMeta,
			processAction: action,
			processSessionId: sessionId,
			processRequestedTimeoutMs: requestedTimeoutMs
		}
	};
}
async function handleDynamicToolCallWithTimeout(params) {
	return await runWithAsyncWorkResources(async (onAcquired) => {
		let didNotifyAgentToolResult = false;
		const conservativeRaceResponses = /* @__PURE__ */ new WeakSet();
		const finalizeTerminal = (response) => {
			const executionSnapshot = params.toolBridge.consumeToolExecutionSnapshot?.(params.call.callId);
			const ownerKey = params.toolBridge.sideEffectOwnerKeyForTool?.(params.call.tool);
			const observedExecutionStarted = executionSnapshot?.executionStarted ?? (conservativeRaceResponses.has(response) ? void 0 : response.executionStarted);
			const terminalResolution = params.observeToolTerminal?.({
				toolCallId: params.call.callId,
				toolName: params.call.tool,
				result: copyInternalToolResultState(response, {
					...response,
					details: response.transcriptDetails
				}),
				arguments: response.executedArguments ?? executionSnapshot?.executedArguments ?? params.call.arguments,
				...params.toolMeta ? { meta: params.toolMeta } : {},
				...ownerKey ? { ownerMutation: { ownerKey } } : {},
				replaySafe: ownerKey ? false : response.replaySafe,
				...observedExecutionStarted !== void 0 ? { executionStarted: observedExecutionStarted } : {},
				outcome: response.success ? "success" : "failure",
				...!response.success ? { failure: {
					error: readDynamicToolResponseText(response),
					...response.unknownTool ? { unknownTool: true } : {}
				} } : {}
			});
			if (terminalResolution) {
				response.terminalResolution = terminalResolution;
				response.executionStarted = terminalResolution.executionStarted;
				response.executedArguments = terminalResolution.executedArguments ?? response.executedArguments;
				response.sideEffectEvidence = terminalResolution.sideEffectEvidence || void 0;
			}
			return response;
		};
		const createFailedAfterPossibleDispatch = (message, terminalReason) => {
			const response = createFailedDynamicToolResponse(message, {
				executionStarted: true,
				sideEffectEvidence: true,
				terminalReason
			});
			conservativeRaceResponses.add(response);
			return response;
		};
		const notifyAgentToolResult = (event) => {
			if (didNotifyAgentToolResult) return;
			didNotifyAgentToolResult = true;
			try {
				params.onAgentToolResult?.(event);
			} catch (error) {
				const message = formatToolExecutionErrorMessage(error, "Unknown error");
				embeddedAgentLog$1.warn(`onAgentToolResult handler failed: tool=${params.call.tool} error=${message}`);
			}
		};
		const notifyFailedToolResult = (message, terminalReason = "failed") => {
			notifyAgentToolResult({
				toolName: params.call.tool,
				result: failedToolResult(message, terminalReason),
				isError: true
			});
		};
		if (params.signal.aborted) {
			const message = "OpenClaw dynamic tool call aborted before execution.";
			const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
			params.onFallbackSelected?.();
			notifyFailedToolResult(message, terminalReason);
			return finalizeTerminal(createFailedDynamicToolResponse(message, {
				executionStarted: false,
				terminalReason
			}));
		}
		const controller = new AbortController();
		let timeout;
		let timedOut = false;
		let toolCallSettled = false;
		let completedSuccessfully = false;
		let operationReleased = false;
		const cancellation = createDeferred();
		const abortFromRun = () => {
			const message = "OpenClaw dynamic tool call aborted.";
			const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
			controller.abort(params.signal.reason ?? /* @__PURE__ */ new Error(message));
			if (toolCallSettled) return;
			params.onFallbackSelected?.();
			notifyFailedToolResult(message, terminalReason);
			cancellation.resolve(createFailedAfterPossibleDispatch(message, terminalReason));
		};
		const releaseOperation = () => {
			if (operationReleased) return;
			operationReleased = true;
			params.signal.removeEventListener("abort", abortFromRun);
			if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("OpenClaw dynamic tool call finished."));
		};
		onAcquired({
			release: releaseOperation,
			releaseBeforeResultWhenIdle: true
		});
		const { timeoutMs } = params;
		if (timeoutMs !== null) {
			timeout = setTimeout(() => {
				timedOut = true;
				const timeoutDetails = formatDynamicToolTimeoutDetails({
					call: params.call,
					timeoutMs
				});
				params.onFallbackSelected?.();
				controller.abort(new Error(timeoutDetails.responseMessage));
				params.onTimeout?.();
				embeddedAgentLog$1.warn("codex dynamic tool call timed out", {
					...timeoutDetails.meta,
					consoleMessage: timeoutDetails.consoleMessage
				});
				notifyFailedToolResult(timeoutDetails.responseMessage, "timed_out");
				cancellation.resolve(createFailedAfterPossibleDispatch(timeoutDetails.responseMessage, "timed_out"));
			}, timeoutMs);
			timeout.unref?.();
		}
		try {
			params.signal.addEventListener("abort", abortFromRun, { once: true });
			if (params.signal.aborted) abortFromRun();
			const response = await Promise.race([params.toolBridge.handleToolCall(params.call, {
				signal: controller.signal,
				onAgentToolResult: notifyAgentToolResult,
				toolCallOrdinal: params.toolCallOrdinal,
				retainExecutionSnapshot: true
			}), cancellation.promise]);
			if (!response.success && !didNotifyAgentToolResult) notifyFailedToolResult(readDynamicToolResponseText(response), response.diagnosticTerminalReason ?? "failed");
			const terminal = finalizeTerminal(response);
			completedSuccessfully = terminal.success;
			return terminal;
		} catch (error) {
			const terminalReason = params.signal.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : resolveToolExecutionErrorKind(error);
			const message = formatToolExecutionErrorMessage(error, "OpenClaw dynamic tool call failed.");
			notifyFailedToolResult(message, terminalReason);
			return finalizeTerminal(createFailedAfterPossibleDispatch(message, terminalReason));
		} finally {
			clearTimeout(timeout);
			toolCallSettled = true;
			if (!completedSuccessfully || timedOut || controller.signal.aborted) releaseOperation();
		}
	});
}
function readDynamicToolResponseText(response) {
	return response.contentItems.flatMap((item) => item.type === "inputText" && typeof item.text === "string" ? [item.text] : []).join("\n").trim() || "OpenClaw dynamic tool call failed.";
}
/** Strips OpenClaw-only metadata before sending a dynamic tool response to Codex. */
function toCodexDynamicToolProtocolResponse(response) {
	return {
		contentItems: response.contentItems,
		success: response.success
	};
}
function toCodexDynamicToolProgressResponse(response, protocolResponse) {
	const transcriptDetails = isJsonObject(response.transcriptDetails) ? response.transcriptDetails : void 0;
	const mcpAppPreview = isJsonObject(transcriptDetails?.mcpAppPreview) ? transcriptDetails.mcpAppPreview : void 0;
	if (response.asyncStarted !== true && !mcpAppPreview) return protocolResponse;
	return {
		...protocolResponse,
		details: response.asyncStarted === true ? {
			...mcpAppPreview ? { mcpAppPreview } : {},
			async: true,
			status: "started"
		} : { mcpAppPreview }
	};
}
function resolveDynamicToolCallTimeoutMs(params) {
	if (params.call.tool === "autoreview" && params.parentTimeoutMs !== void 0) return params.parentTimeoutMs >= MAX_TIMER_TIMEOUT_MS ? null : addSafeTimeoutDelayGraceMs(params.parentTimeoutMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
	const args = isJsonObject(params.call.arguments) ? params.call.arguments : void 0;
	if (params.call.tool === "node_exec") {
		const executionTimeoutMs = params.toolBridge?.availableTools.find((tool) => tool.name === params.call.tool)?.getExecutionTimeoutMs?.(params.call.arguments);
		if (executionTimeoutMs !== void 0) return addSafeTimeoutDelayGraceMs(executionTimeoutMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
	}
	if (params.call.tool === "openclaw" || params.call.tool === "ask_user" || params.call.tool === "secrets" && args?.action === "request") try {
		const timeoutSeconds = params.call.tool === "openclaw" ? void 0 : args?.timeoutSeconds;
		return normalizeQuestionTimeoutSeconds(timeoutSeconds) * 1e3 + CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS;
	} catch {
		return CODEX_DYNAMIC_TOOL_TIMEOUT_MS;
	}
	if (params.call.tool === "computer") return clampDynamicToolTimeoutMs(readComputerToolTimeoutMs(params.call.arguments));
	if (params.call.tool === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
	const isCollectorWait = params.call.tool === "agents_wait";
	return clampDynamicToolTimeoutMs(readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? (isCollectorWait ? CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS : CODEX_DYNAMIC_TOOL_TIMEOUT_MS), isCollectorWait ? CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS : CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS);
}
/** Transport guard stays outside the handler's bounded tool wait and completion grace. */
function resolveDynamicToolServerRequestTimeoutMs(call) {
	return Math.max(63e4, call ? resolveDynamicToolCallTimeoutMs({
		call,
		config: void 0
	}) ?? 0 : 0) + CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS;
}
function readComputerToolTimeoutMs(value) {
	const args = isJsonObject(value) ? value : void 0;
	const action = typeof args?.action === "string" ? args.action : void 0;
	const gatewayTimeoutMs = floorPositiveFiniteNumber(args?.timeoutMs) ?? CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS;
	const gatewayCallCount = action === "screenshot" || action === "wait" ? 3 : 4;
	return (action === "wait" || action === "hold_key" ? Math.max(0, Number(args?.duration) || 0) * 1e3 : 0) + gatewayCallCount * gatewayTimeoutMs + CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS;
}
function readDynamicToolCallTimeoutMs(value) {
	if (!isJsonObject(value)) return;
	const timeoutMs = floorPositiveFiniteNumber(value.timeoutMs);
	if (timeoutMs !== void 0) return timeoutMs;
	const timeoutSecondsMs = readDynamicToolTimeoutSecondsAsMs(value.timeoutSeconds);
	return timeoutSecondsMs === void 0 ? void 0 : addTimerTimeoutGraceMs(timeoutSecondsMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
}
function readConfiguredDynamicToolTimeoutMs(toolName, config) {
	if (toolName === "image_generate") {
		const imageModel = config?.agents?.defaults?.mediaModels?.image;
		if (!imageModel || typeof imageModel !== "object") return CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
		return floorPositiveFiniteNumber(imageModel.timeoutMs) ?? CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
	}
	if (toolName === "view_image") {
		const candidates = (config?.tools?.media?.models ?? []).filter((entry) => !entry.capabilities || entry.capabilities.includes("image"));
		const capabilityTimeoutMs = readTimeoutSecondsAsMs(config?.tools?.media?.image?.timeoutSeconds);
		return Math.max(capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS, ...candidates.map((entry) => readTimeoutSecondsAsMs(entry.timeoutSeconds) ?? capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS));
	}
}
function readTimeoutSecondsAsMs(value) {
	const seconds = floorPositiveFiniteNumber(value);
	return seconds === void 0 ? void 0 : seconds * 1e3;
}
function readDynamicToolTimeoutSecondsAsMs(value) {
	const seconds = asFiniteNumberInRange(value, { min: 1 });
	return seconds !== void 0 && Number.isInteger(seconds) ? seconds * 1e3 : void 0;
}
function clampDynamicToolTimeoutMs(timeoutMs, maximum = CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS) {
	return Math.max(1, Math.min(maximum, Math.floor(timeoutMs)));
}
// extensions/codex/src/app-server/elicitation-response.ts
function createCodexElicitationResponse(action, content = null, meta = null) {
	return {
		action,
		content,
		_meta: meta
	};
}
// extensions/codex/src/app-server/notification-correlation.ts
function isCodexNotificationForTurn(value, threadId, turnId) {
	return isJsonObject(value) && readCodexNotificationThreadId(value) === threadId && readCodexNotificationTurnId(value) === turnId;
}
/**
* Reads a thread id from canonical top-level or nested thread payloads.
* The generated v2 schemas require top-level `threadId` on turn/item-scoped
* notifications and define `Turn` without one, so `turn.threadId` is not a
* wire shape and is deliberately not read here.
*/
function readCodexNotificationThreadId(record) {
	const thread = isJsonObject(record.thread) ? record.thread : void 0;
	return normalizeOptionalString(record.threadId) ?? (thread && normalizeOptionalString(thread.id));
}
function readCodexNotificationTurnId(record) {
	return (isJsonObject(record.turn) ? normalizeOptionalString(record.turn.id) : void 0) ?? normalizeOptionalString(record.turnId);
}
function readCodexNotificationScope(value) {
	if (!isJsonObject(value)) return {};
	const threadId = readCodexNotificationThreadId(value);
	const turnId = readCodexNotificationTurnId(value);
	return {
		...threadId ? { threadId } : {},
		...turnId ? { turnId } : {}
	};
}
// extensions/codex/src/app-server/protocol-validators.generated.js
/*!
TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function CodePointCount(value) {
	let result = 0, index = 0, prev = 0;
	for (; index < value.length;) {
		let next = value.charCodeAt(index++) >> 10;
		result += +((prev << 8 | next) !== 13879), prev = next;
	}
	return result;
}
var isCodexDynamicToolCallParams = (() => {
	let check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "callId" in value && "threadId" in value && "tool" in value && "turnId" in value && typeof value.callId == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && typeof value.threadId == "string" && typeof value.tool == "string" && typeof value.turnId == "string";
	return (value) => check_0(value);
})();
var isCodexErrorNotification = (() => {
	let check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "error" in value && "threadId" in value && "turnId" in value && "willRetry" in value && check_1(value.error) && typeof value.threadId == "string" && typeof value.turnId == "string" && typeof value.willRetry == "boolean", check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && (value.additionalDetails === void 0 || !("additionalDetails" in value) || typeof value.additionalDetails == "string" || value.additionalDetails === null) && (value.codexErrorInfo === void 0 || !("codexErrorInfo" in value) || check_2(value.codexErrorInfo) || value.codexErrorInfo === null) && typeof value.message == "string" && (value.misalignment === void 0 || !("misalignment" in value) || check_4(value.misalignment) || value.misalignment === null), check_2 = (value) => (!(typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_3(value.activeTurnNotSteerable.turnKind)) && (typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_3(value.activeTurnNotSteerable.turnKind) || typeof value == "string" && (value === "contextWindowExceeded" || value === "sessionBudgetExceeded" || value === "usageLimitExceeded" || value === "apiKeySpendLimitExceeded" || value === "projectSpendLimitExceeded" || value === "organizationSpendLimitExceeded" || value === "rateLimitExceeded" || value === "flexUnavailable" || value === "serverOverloaded" || value === "modelNotFound" || value === "policyCapacityUnavailable" || value === "cyberPolicy" || value === "bioPolicy" || value === "misalignmentPolicyViolation" || value === "tooManyDenials" || value === "internalServerError" || value === "unauthorized" || value === "badRequest" || value === "threadRollbackFailed" || value === "sandboxError" || value === "other") || typeof value == "string" && value === "inferenceHookDenied" || typeof value == "string" || typeof value == "object" && value !== null && !Array.isArray(value)), check_3 = (value) => typeof value == "string" && (value === "review" || value === "compact"), check_4 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.detailedExplanation === void 0 || !("detailedExplanation" in value) || typeof value.detailedExplanation == "string" || value.detailedExplanation === null) && (value.errorType === void 0 || !("errorType" in value) || typeof value.errorType == "string" || value.errorType === null) && (value.reviewTarget === void 0 || !("reviewTarget" in value) || typeof value.reviewTarget == "string" || value.reviewTarget === null) && (value.steer === void 0 || !("steer" in value) || check_5(value.steer) || value.steer === null), check_5 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string";
	return (value) => check_0(value);
})();
var isCodexModelListResponse = (() => {
	let check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "data" in value && Array.isArray(value.data) && value.data.every((unique_0, index) => check_1(unique_0)) && (value.nextCursor === void 0 || !("nextCursor" in value) || typeof value.nextCursor == "string" || value.nextCursor === null), check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "defaultReasoningEffort" in value && "description" in value && "displayName" in value && "hidden" in value && "id" in value && "isDefault" in value && "model" in value && "supportedReasoningEfforts" in value && (value.additionalSpeedTiers === void 0 || !("additionalSpeedTiers" in value) || Array.isArray(value.additionalSpeedTiers) && value.additionalSpeedTiers.every((unique_1, index) => typeof unique_1 == "string")) && (value.availabilityNux === void 0 || !("availabilityNux" in value) || check_2(value.availabilityNux) || value.availabilityNux === null) && (value.availableAccessPrograms === void 0 || !("availableAccessPrograms" in value) || check_3(value.availableAccessPrograms) || value.availableAccessPrograms === null) && check_6(value.defaultReasoningEffort) && (value.defaultServiceTier === void 0 || !("defaultServiceTier" in value) || typeof value.defaultServiceTier == "string" || value.defaultServiceTier === null) && typeof value.description == "string" && typeof value.displayName == "string" && typeof value.hidden == "boolean" && typeof value.id == "string" && (value.inputModalities === void 0 || !("inputModalities" in value) || Array.isArray(value.inputModalities) && value.inputModalities.every((unique_3, index) => check_7(unique_3))) && typeof value.isDefault == "boolean" && typeof value.model == "string" && (value.modelSpecialty === void 0 || !("modelSpecialty" in value) || typeof value.modelSpecialty == "string" || value.modelSpecialty === null) && (value.multiAgentVersion === void 0 || !("multiAgentVersion" in value) || check_8(value.multiAgentVersion) || value.multiAgentVersion === null) && (value.serviceTiers === void 0 || !("serviceTiers" in value) || Array.isArray(value.serviceTiers) && value.serviceTiers.every((unique_5, index) => check_9(unique_5))) && Array.isArray(value.supportedReasoningEfforts) && value.supportedReasoningEfforts.every((unique_6, index) => check_10(unique_6)) && (value.supportsPersonality === void 0 || !("supportsPersonality" in value) || typeof value.supportsPersonality == "boolean") && (value.upgrade === void 0 || !("upgrade" in value) || typeof value.upgrade == "string" || value.upgrade === null) && (value.upgradeInfo === void 0 || !("upgradeInfo" in value) || check_11(value.upgradeInfo) || value.upgradeInfo === null), check_2 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_3 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "cyber" in value && Array.isArray(value.cyber) && value.cyber.every((unique_2, index) => check_4(unique_2)) && (value.daybreakAvailability === void 0 || !("daybreakAvailability" in value) || check_5(value.daybreakAvailability)), check_4 = (value) => typeof value == "string" && (value === "standard" || value === "daybreakBlue" || value === "daybreakRed"), check_5 = (value) => typeof value == "string" && (value === "available" || value === "enrollmentRequired" || value === "unavailableForModel" || value === "default"), check_6 = (value) => typeof value == "string" && (value.length >= 2 || value.length >= 1 && CodePointCount(value) >= 1), check_7 = (value) => [
		typeof value == "string" && value === "text",
		typeof value == "string" && value === "image",
		typeof value == "string" && value === "audio"
	].reduce((result, unique_4, _) => unique_4 === !0 ? result + 1 : result, 0) === 1, check_8 = (value) => typeof value == "string" && (value === "disabled" || value === "v1" || value === "v2"), check_9 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "description" in value && "id" in value && "name" in value && typeof value.description == "string" && typeof value.id == "string" && typeof value.name == "string", check_10 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "description" in value && "reasoningEffort" in value && typeof value.description == "string" && check_6(value.reasoningEffort), check_11 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "model" in value && (value.migrationMarkdown === void 0 || !("migrationMarkdown" in value) || typeof value.migrationMarkdown == "string" || value.migrationMarkdown === null) && typeof value.model == "string" && (value.modelLink === void 0 || !("modelLink" in value) || typeof value.modelLink == "string" || value.modelLink === null) && (value.retirementAt === void 0 || !("retirementAt" in value) || Number.isInteger(value.retirementAt) && (typeof value.retirementAt != "string" || !0) || value.retirementAt === null && (typeof value.retirementAt != "string" || !0)) && (value.upgradeCopy === void 0 || !("upgradeCopy" in value) || typeof value.upgradeCopy == "string" || value.upgradeCopy === null);
	return (value) => check_0(value);
})();
var isCodexThreadResumeResponse = (() => {
	let External = [
		/(^options$|^title$)/u,
		/(.*)/u,
		/.*/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "approvalPolicy" in value && "approvalsReviewer" in value && "cwd" in value && "model" in value && "modelProvider" in value && "sandbox" in value && "thread" in value && (value.activePermissionProfile === void 0 || !("activePermissionProfile" in value) || check_1(value.activePermissionProfile) || value.activePermissionProfile === null) && check_2(value.approvalPolicy) && check_3(value.approvalsReviewer) && (value.collaborationMode === void 0 || !("collaborationMode" in value) || check_4(value.collaborationMode) || value.collaborationMode === null) && check_8(value.cwd) && (value.disabledPluginIds === void 0 || !("disabledPluginIds" in value) || Array.isArray(value.disabledPluginIds) && value.disabledPluginIds.every((unique_1, index) => typeof unique_1 == "string")) && (value.initialTurnsPage === void 0 || !("initialTurnsPage" in value) || check_9(value.initialTurnsPage) || value.initialTurnsPage === null) && (value.instructionSources === void 0 || !("instructionSources" in value) || Array.isArray(value.instructionSources) && value.instructionSources.every((unique_47, index) => check_37(unique_47))) && (value.itemsBackwardsCursor === void 0 || !("itemsBackwardsCursor" in value) || typeof value.itemsBackwardsCursor == "string" || value.itemsBackwardsCursor === null) && typeof value.model == "string" && typeof value.modelProvider == "string" && (value.multiAgentMode === void 0 || !("multiAgentMode" in value) || check_61(value.multiAgentMode)) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && (value.runtimeWorkspaceRoots === void 0 || !("runtimeWorkspaceRoots" in value) || Array.isArray(value.runtimeWorkspaceRoots) && value.runtimeWorkspaceRoots.every((unique_49, index) => check_8(unique_49))) && check_62(value.sandbox) && (value.serviceTier === void 0 || !("serviceTier" in value) || typeof value.serviceTier == "string" || value.serviceTier === null) && check_64(value.thread) && (value.turnsBackwardsCursor === void 0 || !("turnsBackwardsCursor" in value) || typeof value.turnsBackwardsCursor == "string" || value.turnsBackwardsCursor === null), check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && (value.extends === void 0 || !("extends" in value) || typeof value.extends == "string" || value.extends === null) && typeof value.id == "string", check_2 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "granular" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.granular == "object" && value.granular !== null && !Array.isArray(value.granular) && "mcp_elicitations" in value.granular && "rules" in value.granular && "sandbox_approval" in value.granular && typeof value.granular.mcp_elicitations == "boolean" && (value.granular.request_permissions === void 0 || !("request_permissions" in value.granular) || typeof value.granular.request_permissions == "boolean") && typeof value.granular.rules == "boolean" && typeof value.granular.sandbox_approval == "boolean" && (value.granular.skill_approval === void 0 || !("skill_approval" in value.granular) || typeof value.granular.skill_approval == "boolean"), typeof value == "string" && (value === "untrusted" || value === "on-request" || value === "never")].reduce((result, unique_0, _) => unique_0 === !0 ? result + 1 : result, 0) === 1, check_3 = (value) => typeof value == "string" && (value === "user" || value === "auto_review" || value === "guardian_subagent"), check_4 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "settings" in value && check_5(value.mode) && check_6(value.settings), check_5 = (value) => typeof value == "string" && (value === "plan" || value === "default"), check_6 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "model" in value && (value.developer_instructions === void 0 || !("developer_instructions" in value) || typeof value.developer_instructions == "string" || value.developer_instructions === null) && typeof value.model == "string" && (value.reasoning_effort === void 0 || !("reasoning_effort" in value) || check_7(value.reasoning_effort) || value.reasoning_effort === null), check_7 = (value) => typeof value == "string" && (value.length >= 2 || value.length >= 1 && CodePointCount(value) >= 1), check_8 = (value) => typeof value == "string", check_9 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "data" in value && (value.backwardsCursor === void 0 || !("backwardsCursor" in value) || typeof value.backwardsCursor == "string" || value.backwardsCursor === null) && Array.isArray(value.data) && value.data.every((unique_2, index) => check_10(unique_2)) && (value.nextCursor === void 0 || !("nextCursor" in value) || typeof value.nextCursor == "string" || value.nextCursor === null), check_10 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "items" in value && "status" in value && (value.completedAt === void 0 || !("completedAt" in value) || Number.isInteger(value.completedAt) && (typeof value.completedAt != "string" || !0) || value.completedAt === null && (typeof value.completedAt != "string" || !0)) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.error === void 0 || !("error" in value) || check_11(value.error) || value.error === null) && typeof value.id == "string" && Array.isArray(value.items) && value.items.every((unique_3, index) => check_16(unique_3)) && (value.itemsView === void 0 || !("itemsView" in value) || check_59(value.itemsView)) && (value.rootTurnId === void 0 || !("rootTurnId" in value) || typeof value.rootTurnId == "string" || value.rootTurnId === null) && (value.startedAt === void 0 || !("startedAt" in value) || Number.isInteger(value.startedAt) && (typeof value.startedAt != "string" || !0) || value.startedAt === null && (typeof value.startedAt != "string" || !0)) && check_60(value.status), check_11 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && (value.additionalDetails === void 0 || !("additionalDetails" in value) || typeof value.additionalDetails == "string" || value.additionalDetails === null) && (value.codexErrorInfo === void 0 || !("codexErrorInfo" in value) || check_12(value.codexErrorInfo) || value.codexErrorInfo === null) && typeof value.message == "string" && (value.misalignment === void 0 || !("misalignment" in value) || check_14(value.misalignment) || value.misalignment === null), check_12 = (value) => (!(typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_13(value.activeTurnNotSteerable.turnKind)) && (typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_13(value.activeTurnNotSteerable.turnKind) || typeof value == "string" && (value === "contextWindowExceeded" || value === "sessionBudgetExceeded" || value === "usageLimitExceeded" || value === "apiKeySpendLimitExceeded" || value === "projectSpendLimitExceeded" || value === "organizationSpendLimitExceeded" || value === "rateLimitExceeded" || value === "flexUnavailable" || value === "serverOverloaded" || value === "modelNotFound" || value === "policyCapacityUnavailable" || value === "cyberPolicy" || value === "bioPolicy" || value === "misalignmentPolicyViolation" || value === "tooManyDenials" || value === "internalServerError" || value === "unauthorized" || value === "badRequest" || value === "threadRollbackFailed" || value === "sandboxError" || value === "other") || typeof value == "string" && value === "inferenceHookDenied" || typeof value == "string" || typeof value == "object" && value !== null && !Array.isArray(value)), check_13 = (value) => typeof value == "string" && (value === "review" || value === "compact"), check_14 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.detailedExplanation === void 0 || !("detailedExplanation" in value) || typeof value.detailedExplanation == "string" || value.detailedExplanation === null) && (value.errorType === void 0 || !("errorType" in value) || typeof value.errorType == "string" || value.errorType === null) && (value.reviewTarget === void 0 || !("reviewTarget" in value) || typeof value.reviewTarget == "string" || value.reviewTarget === null) && (value.steer === void 0 || !("steer" in value) || check_15(value.steer) || value.steer === null), check_15 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_16 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.completedAtMs === void 0 || !("completedAtMs" in value) || Number.isInteger(value.completedAtMs) && (typeof value.completedAtMs != "string" || !0) || value.completedAtMs === null && (typeof value.completedAtMs != "string" || !0)) && (value.startedAtMs === void 0 || !("startedAtMs" in value) || Number.isInteger(value.startedAtMs) && (typeof value.startedAtMs != "string" || !0) || value.startedAtMs === null && (typeof value.startedAtMs != "string" || !0)) && [
		typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && "id" in value && "type" in value && (value.clientId === void 0 || !("clientId" in value) || typeof value.clientId == "string" || value.clientId === null) && Array.isArray(value.content) && value.content.every((unique_5, index) => check_17(unique_5)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "userMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "fragments" in value && "id" in value && "type" in value && Array.isArray(value.fragments) && value.fragments.every((unique_8, index) => check_21(unique_8)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "hookPrompt",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && (value.delivery === void 0 || !("delivery" in value) || check_22(value.delivery) || value.delivery === null) && typeof value.id == "string" && (value.memoryCitation === void 0 || !("memoryCitation" in value) || check_23(value.memoryCitation) || value.memoryCitation === null) && (value.moderation === void 0 || !("moderation" in value) || check_25(value.moderation) || value.moderation === null) && (value.phase === void 0 || !("phase" in value) || check_32(value.phase) || value.phase === null) && (value.questions === void 0 || !("questions" in value) || Array.isArray(value.questions) && value.questions.every((unique_16, index) => check_33(unique_16)) || value.questions === null && (!Array.isArray(value.questions) || value.questions.every((unique_21, index) => check_33(unique_21)))) && typeof value.text == "string" && typeof value.type == "string" && value.type === "agentMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && "output" in value && "type" in value && typeof value.id == "string" && typeof value.name == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_34(value.output) && typeof value.type == "string" && value.type === "functionCallOutput",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && typeof value.id == "string" && typeof value.text == "string" && typeof value.type == "string" && value.type === "plan",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && (value.content === void 0 || !("content" in value) || Array.isArray(value.content) && value.content.every((unique_24, index) => typeof unique_24 == "string")) && typeof value.id == "string" && (value.summary === void 0 || !("summary" in value) || Array.isArray(value.summary) && value.summary.every((unique_25, index) => typeof unique_25 == "string")) && typeof value.type == "string" && value.type === "reasoning",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "commandActions" in value && "cwd" in value && "id" in value && "status" in value && "type" in value && (value.aggregatedOutput === void 0 || !("aggregatedOutput" in value) || typeof value.aggregatedOutput == "string" || value.aggregatedOutput === null) && typeof value.command == "string" && Array.isArray(value.commandActions) && value.commandActions.every((unique_26, index) => check_36(unique_26)) && check_37(value.cwd) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.exitCode === void 0 || !("exitCode" in value) || Number.isInteger(value.exitCode) && (typeof value.exitCode != "string" || !0) || value.exitCode === null && (typeof value.exitCode != "string" || !0)) && typeof value.id == "string" && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.processId === void 0 || !("processId" in value) || typeof value.processId == "string" || value.processId === null) && (value.scriptPath === void 0 || !("scriptPath" in value) || typeof value.scriptPath == "string" || value.scriptPath === null) && (value.source === void 0 || !("source" in value) || check_38(value.source)) && check_39(value.status) && typeof value.type == "string" && value.type === "commandExecution",
		typeof value == "object" && value !== null && !Array.isArray(value) && "changes" in value && "id" in value && "status" in value && "type" in value && Array.isArray(value.changes) && value.changes.every((unique_28, index) => check_40(unique_28)) && typeof value.id == "string" && check_42(value.status) && typeof value.type == "string" && value.type === "fileChange",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "server" in value && "status" in value && "tool" in value && "type" in value && (value.appContext === void 0 || !("appContext" in value) || check_43(value.appContext) || value.appContext === null) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.environmentId === void 0 || !("environmentId" in value) || typeof value.environmentId == "string" || value.environmentId === null) && (value.error === void 0 || !("error" in value) || check_44(value.error) || value.error === null) && typeof value.id == "string" && (value.mcpAppResourceUri === void 0 || !("mcpAppResourceUri" in value) || typeof value.mcpAppResourceUri == "string" || value.mcpAppResourceUri === null) && (value.mcpAppUi === void 0 || !("mcpAppUi" in value) || check_45(value.mcpAppUi) || value.mcpAppUi === null) && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.readOnlyHint === void 0 || !("readOnlyHint" in value) || typeof value.readOnlyHint == "boolean" || value.readOnlyHint === null) && (value.result === void 0 || !("result" in value) || check_47(value.result) || value.result === null) && typeof value.server == "string" && check_48(value.status) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "mcpToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "status" in value && "tool" in value && "type" in value && (value.contentItems === void 0 || !("contentItems" in value) || Array.isArray(value.contentItems) && value.contentItems.every((unique_31, index) => check_49(unique_31)) || value.contentItems === null && (!Array.isArray(value.contentItems) || value.contentItems.every((unique_33, index) => check_49(unique_33)))) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && typeof value.id == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_50(value.status) && (value.success === void 0 || !("success" in value) || typeof value.success == "boolean" || value.success === null) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "dynamicToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentsStates" in value && "id" in value && "receiverThreadIds" in value && "senderThreadId" in value && "status" in value && "tool" in value && "type" in value && typeof value.agentsStates == "object" && value.agentsStates !== null && !Array.isArray(value.agentsStates) && Object.getOwnPropertyNames(value.agentsStates).every((unique_34, unique_35) => External[1].test(unique_34) || !1) && Object.entries(value.agentsStates).every(([unique_36, unique_37], _) => !External[2].test(unique_36) || check_51(unique_37)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.prompt === void 0 || !("prompt" in value) || typeof value.prompt == "string" || value.prompt === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && Array.isArray(value.receiverThreadIds) && value.receiverThreadIds.every((unique_38, index) => typeof unique_38 == "string") && typeof value.senderThreadId == "string" && check_53(value.status) && check_54(value.tool) && typeof value.type == "string" && value.type === "collabAgentToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentPath" in value && "agentThreadId" in value && "id" in value && "kind" in value && "type" in value && typeof value.agentPath == "string" && typeof value.agentThreadId == "string" && typeof value.id == "string" && check_55(value.kind) && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && typeof value.type == "string" && value.type === "subAgentActivity",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "query" in value && "type" in value && (value.action === void 0 || !("action" in value) || check_56(value.action) || value.action === null) && typeof value.id == "string" && typeof value.query == "string" && (value.results === void 0 || !("results" in value) || Array.isArray(value.results) && value.results.every((unique_42, index) => !0) || value.results === null && (!Array.isArray(value.results) || value.results.every((unique_43, index) => !0))) && typeof value.type == "string" && value.type === "webSearch",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "path" in value && "type" in value && typeof value.id == "string" && check_37(value.path) && typeof value.type == "string" && value.type === "imageView",
		typeof value == "object" && value !== null && !Array.isArray(value) && "durationMs" in value && "id" in value && "type" in value && Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) && (!(Number.isFinite(value.durationMs) || typeof value.durationMs == "bigint") || value.durationMs >= 0) && typeof value.id == "string" && typeof value.type == "string" && value.type === "sleep",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "status" in value && "type" in value && (value.failure === void 0 || !("failure" in value) || check_57(value.failure) || value.failure === null) && (value.generationId === void 0 || !("generationId" in value) || typeof value.generationId == "string" || value.generationId === null) && typeof value.id == "string" && (value.inputImages === void 0 || !("inputImages" in value) || Array.isArray(value.inputImages) && value.inputImages.every((unique_45, index) => check_58(unique_45))) && (value.revisedPrompt === void 0 || !("revisedPrompt" in value) || typeof value.revisedPrompt == "string" || value.revisedPrompt === null) && (value.savedPath === void 0 || !("savedPath" in value) || check_8(value.savedPath) || value.savedPath === null) && typeof value.status == "string" && (value.transparentBackground === void 0 || !("transparentBackground" in value) || typeof value.transparentBackground == "boolean" || value.transparentBackground === null) && typeof value.type == "string" && value.type === "imageGeneration" && (typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "result" in value && typeof value.result == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "enteredReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "exitedReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && typeof value.id == "string" && typeof value.type == "string" && value.type === "contextCompaction"
	].reduce((result, unique_4, _) => unique_4 === !0 ? result + 1 : result, 0) === 1, check_17 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && (value.text_elements === void 0 || !("text_elements" in value) || Array.isArray(value.text_elements) && value.text_elements.every((unique_7, index) => check_18(unique_7))) && typeof value.type == "string" && value.type === "text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_20(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && (value.detail === void 0 || !("detail" in value) || check_20(value.detail) || value.detail === null) && typeof value.path == "string" && typeof value.type == "string" && value.type === "localImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && typeof value.path == "string" && typeof value.type == "string" && value.type === "localAudio",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "skill",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "mention"
	].reduce((result, unique_6, _) => unique_6 === !0 ? result + 1 : result, 0) === 1, check_18 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "byteRange" in value && check_19(value.byteRange) && (value.placeholder === void 0 || !("placeholder" in value) || typeof value.placeholder == "string" || value.placeholder === null), check_19 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "end" in value && "start" in value && Number.isInteger(value.end) && (typeof value.end != "string" || !0) && (!(Number.isFinite(value.end) || typeof value.end == "bigint") || value.end >= 0) && Number.isInteger(value.start) && (typeof value.start != "string" || !0) && (!(Number.isFinite(value.start) || typeof value.start == "bigint") || value.start >= 0), check_20 = (value) => typeof value == "string" && (value === "auto" || value === "low" || value === "high" || value === "original"), check_21 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "hookRunId" in value && "text" in value && typeof value.hookRunId == "string" && typeof value.text == "string", check_22 = (value) => typeof value == "string" && value === "async", check_23 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "entries" in value && "threadIds" in value && Array.isArray(value.entries) && value.entries.every((unique_9, index) => check_24(unique_9)) && Array.isArray(value.threadIds) && value.threadIds.every((unique_10, index) => typeof unique_10 == "string"), check_24 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "lineEnd" in value && "lineStart" in value && "note" in value && "path" in value && Number.isInteger(value.lineEnd) && (typeof value.lineEnd != "string" || !0) && (!(Number.isFinite(value.lineEnd) || typeof value.lineEnd == "bigint") || value.lineEnd >= 0) && Number.isInteger(value.lineStart) && (typeof value.lineStart != "string" || !0) && (!(Number.isFinite(value.lineStart) || typeof value.lineStart == "bigint") || value.lineStart >= 0) && typeof value.note == "string" && typeof value.path == "string", check_25 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "moderated" in value && (value.display === void 0 || !("display" in value) || check_26(value.display) || value.display === null) && typeof value.moderated == "boolean", check_26 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "trustedContacts" in value && "version" in value && (value.annotation === void 0 || !("annotation" in value) || check_27(value.annotation) || value.annotation === null) && typeof value.mode == "string" && value.mode === "show" && check_29(value.trustedContacts) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "replacement" in value && "version" in value && typeof value.mode == "string" && value.mode === "hide" && check_30(value.replacement) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "reason" in value && "version" in value && typeof value.mode == "string" && value.mode === "block" && check_31(value.reason) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1
	].reduce((result, unique_11, _) => unique_11 === !0 ? result + 1 : result, 0) === 1, check_27 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "subject" in value && typeof value.kind == "string" && value.kind === "wellbeingHelpline" && check_28(value.subject)].reduce((result, unique_12, _) => unique_12 === !0 ? result + 1 : result, 0) === 1, check_28 = (value) => typeof value == "string" && (value === "answer" || value === "prompt"), check_29 = (value) => typeof value == "string" && (value === "check" || value === "skip"), check_30 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "wellbeingPromptHelpline"].reduce((result, unique_13, _) => unique_13 === !0 ? result + 1 : result, 0) === 1, check_31 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "protectionType" in value && typeof value.kind == "string" && value.kind === "protection" && typeof value.protectionType == "string", typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "cyber" && (value.trustedAccess === void 0 || !("trustedAccess" in value) || typeof value.trustedAccess == "boolean" || value.trustedAccess === null)].reduce((result, unique_14, _) => unique_14 === !0 ? result + 1 : result, 0) === 1, check_32 = (value) => [
		typeof value == "string" && value === "commentary",
		typeof value == "string" && value === "partial_answer",
		typeof value == "string" && value === "final_answer"
	].reduce((result, unique_15, _) => unique_15 === !0 ? result + 1 : result, 0) === 1, check_33 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "title" in value && Object.getOwnPropertyNames(value).every((unique_17, unique_18) => External[0].test(unique_17) || !1) && (value.options === void 0 || !("options" in value) || Array.isArray(value.options) && value.options.every((unique_19, index) => typeof unique_19 == "string") || value.options === null && (!Array.isArray(value.options) || value.options.every((unique_20, index) => typeof unique_20 == "string"))) && typeof value.title == "string", check_34 = (value) => Array.isArray(value) && value.every((unique_22, index) => check_35(unique_22)) || typeof value == "string", check_35 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "input_text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_20(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "input_image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "image_url" in value && typeof value.image_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "input_audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "audio_url" in value && typeof value.audio_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "encrypted_content" in value && "type" in value && typeof value.encrypted_content == "string" && typeof value.type == "string" && value.type === "encrypted_content"
	].reduce((result, unique_23, _) => unique_23 === !0 ? result + 1 : result, 0) === 1, check_36 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "name" in value && "path" in value && "type" in value && typeof value.command == "string" && typeof value.name == "string" && check_37(value.path) && typeof value.type == "string" && value.type === "read",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.type == "string" && value.type === "listFiles",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && typeof value.type == "string" && value.type === "unknown"
	].reduce((result, unique_27, _) => unique_27 === !0 ? result + 1 : result, 0) === 1, check_37 = (value) => typeof value == "string", check_38 = (value) => typeof value == "string" && (value === "agent" || value === "userShell" || value === "unifiedExecStartup" || value === "unifiedExecInteraction"), check_39 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_40 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "diff" in value && "kind" in value && "path" in value && typeof value.diff == "string" && check_41(value.kind) && typeof value.path == "string", check_41 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "add",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "delete",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.move_path === void 0 || !("move_path" in value) || typeof value.move_path == "string" || value.move_path === null) && typeof value.type == "string" && value.type === "update"
	].reduce((result, unique_29, _) => unique_29 === !0 ? result + 1 : result, 0) === 1, check_42 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_43 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "connectorId" in value && (value.actionName === void 0 || !("actionName" in value) || typeof value.actionName == "string" || value.actionName === null) && (value.appName === void 0 || !("appName" in value) || typeof value.appName == "string" || value.appName === null) && typeof value.connectorId == "string" && (value.linkId === void 0 || !("linkId" in value) || typeof value.linkId == "string" || value.linkId === null) && (value.resourceUri === void 0 || !("resourceUri" in value) || typeof value.resourceUri == "string" || value.resourceUri === null), check_44 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_45 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "preferredModelDisplayMode" in value && "resourceUri" in value && check_46(value.preferredModelDisplayMode) && typeof value.resourceUri == "string", check_46 = (value) => typeof value == "string" && (value === "inline" || value === "fullscreen"), check_47 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && (value._meta === void 0 || !("_meta" in value) || !0) && Array.isArray(value.content) && value.content.every((unique_30, index) => !0) && (value.structuredContent === void 0 || !("structuredContent" in value) || !0), check_48 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_49 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "inputText",
		typeof value == "object" && value !== null && !Array.isArray(value) && "imageUrl" in value && "type" in value && typeof value.imageUrl == "string" && typeof value.type == "string" && value.type === "inputImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "audioUrl" in value && "type" in value && typeof value.audioUrl == "string" && typeof value.type == "string" && value.type === "inputAudio"
	].reduce((result, unique_32, _) => unique_32 === !0 ? result + 1 : result, 0) === 1, check_50 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_51 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "status" in value && (value.message === void 0 || !("message" in value) || typeof value.message == "string" || value.message === null) && check_52(value.status), check_52 = (value) => typeof value == "string" && (value === "pendingInit" || value === "running" || value === "interrupted" || value === "completed" || value === "errored" || value === "shutdown" || value === "notFound"), check_53 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "interrupted"), check_54 = (value) => typeof value == "string" && (value === "spawnAgent" || value === "sendInput" || value === "resumeAgent" || value === "wait" || value === "closeAgent" || value === "sendMessage" || value === "followupTask" || value === "interruptAgent" || value === "listAgents"), check_55 = (value) => typeof value == "string" && (value === "started" || value === "interacted" || value === "interrupted" || value === "completed"), check_56 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.queries === void 0 || !("queries" in value) || Array.isArray(value.queries) && value.queries.every((unique_40, index) => typeof unique_40 == "string") || value.queries === null && (!Array.isArray(value.queries) || value.queries.every((unique_41, index) => typeof unique_41 == "string"))) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "openPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.pattern === void 0 || !("pattern" in value) || typeof value.pattern == "string" || value.pattern === null) && typeof value.type == "string" && value.type === "findInPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "other"
	].reduce((result, unique_39, _) => unique_39 === !0 ? result + 1 : result, 0) === 1, check_57 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "limitId" in value && "type" in value && typeof value.limitId == "string" && (value.resetsAt === void 0 || !("resetsAt" in value) || Number.isInteger(value.resetsAt) && (typeof value.resetsAt != "string" || !0) || value.resetsAt === null && (typeof value.resetsAt != "string" || !0)) && typeof value.type == "string" && value.type === "usageLimitExceeded"].reduce((result, unique_44, _) => unique_44 === !0 ? result + 1 : result, 0) === 1, check_58 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "sha256" in value && check_8(value.path) && typeof value.sha256 == "string", check_59 = (value) => [
		typeof value == "string" && value === "notLoaded",
		typeof value == "string" && value === "summary",
		typeof value == "string" && value === "full"
	].reduce((result, unique_46, _) => unique_46 === !0 ? result + 1 : result, 0) === 1, check_60 = (value) => typeof value == "string" && (value === "completed" || value === "interrupted" || value === "failed" || value === "inProgress"), check_61 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "custom" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.custom == "string", typeof value == "string" && (value === "explicitRequestOnly" || value === "proactive")].reduce((result, unique_48, _) => unique_48 === !0 ? result + 1 : result, 0) === 1, check_62 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "dangerFullAccess",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.networkAccess === void 0 || !("networkAccess" in value) || typeof value.networkAccess == "boolean") && typeof value.type == "string" && value.type === "readOnly",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.networkAccess === void 0 || !("networkAccess" in value) || check_63(value.networkAccess)) && typeof value.type == "string" && value.type === "externalSandbox",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.excludeSlashTmp === void 0 || !("excludeSlashTmp" in value) || typeof value.excludeSlashTmp == "boolean") && (value.excludeTmpdirEnvVar === void 0 || !("excludeTmpdirEnvVar" in value) || typeof value.excludeTmpdirEnvVar == "boolean") && (value.networkAccess === void 0 || !("networkAccess" in value) || typeof value.networkAccess == "boolean") && typeof value.type == "string" && value.type === "workspaceWrite" && (value.writableRoots === void 0 || !("writableRoots" in value) || Array.isArray(value.writableRoots) && value.writableRoots.every((unique_51, index) => check_8(unique_51)))
	].reduce((result, unique_50, _) => unique_50 === !0 ? result + 1 : result, 0) === 1, check_63 = (value) => typeof value == "string" && (value === "restricted" || value === "enabled"), check_64 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "cliVersion" in value && "createdAt" in value && "cwd" in value && "ephemeral" in value && "id" in value && "modelProvider" in value && "preview" in value && "projectId" in value && "sessionId" in value && "source" in value && "status" in value && "turns" in value && "updatedAt" in value && (value.agentNickname === void 0 || !("agentNickname" in value) || typeof value.agentNickname == "string" || value.agentNickname === null) && (value.agentRole === void 0 || !("agentRole" in value) || typeof value.agentRole == "string" || value.agentRole === null) && (value.attachedToThreadId === void 0 || !("attachedToThreadId" in value) || typeof value.attachedToThreadId == "string" || value.attachedToThreadId === null) && (value.canAcceptDirectInput === void 0 || !("canAcceptDirectInput" in value) || typeof value.canAcceptDirectInput == "boolean" || value.canAcceptDirectInput === null) && typeof value.cliVersion == "string" && Number.isInteger(value.createdAt) && (typeof value.createdAt != "string" || !0) && check_8(value.cwd) && (value.daybreakEnabled === void 0 || !("daybreakEnabled" in value) || typeof value.daybreakEnabled == "boolean" || value.daybreakEnabled === null) && (value.daybreakProgramPropagationEnrolled === void 0 || !("daybreakProgramPropagationEnrolled" in value) || typeof value.daybreakProgramPropagationEnrolled == "boolean" || value.daybreakProgramPropagationEnrolled === null) && (value.environments === void 0 || !("environments" in value) || Array.isArray(value.environments) && value.environments.every((unique_52, index) => check_65(unique_52)) || value.environments === null && (!Array.isArray(value.environments) || value.environments.every((unique_54, index) => check_65(unique_54)))) && typeof value.ephemeral == "boolean" && (value.extra === void 0 || !("extra" in value) || check_66(value.extra) || value.extra === null) && (value.forkedFromId === void 0 || !("forkedFromId" in value) || typeof value.forkedFromId == "string" || value.forkedFromId === null) && (value.gitInfo === void 0 || !("gitInfo" in value) || check_67(value.gitInfo) || value.gitInfo === null) && (value.historyMode === void 0 || !("historyMode" in value) || check_68(value.historyMode)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && typeof value.modelProvider == "string" && (value.name === void 0 || !("name" in value) || typeof value.name == "string" || value.name === null) && (value.originator === void 0 || !("originator" in value) || typeof value.originator == "string" || value.originator === null) && (value.parentThreadId === void 0 || !("parentThreadId" in value) || typeof value.parentThreadId == "string" || value.parentThreadId === null) && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.preview == "string" && (typeof value.projectId == "string" || value.projectId === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && (value.recencyAt === void 0 || !("recencyAt" in value) || Number.isInteger(value.recencyAt) && (typeof value.recencyAt != "string" || !0) || value.recencyAt === null && (typeof value.recencyAt != "string" || !0)) && (value.section === void 0 || !("section" in value) || check_69(value.section) || value.section === null) && (value.sectionEnteredAt === void 0 || !("sectionEnteredAt" in value) || Number.isInteger(value.sectionEnteredAt) && (typeof value.sectionEnteredAt != "string" || !0) || value.sectionEnteredAt === null && (typeof value.sectionEnteredAt != "string" || !0)) && typeof value.sessionId == "string" && check_71(value.source) && check_75(value.status) && (value.threadSource === void 0 || !("threadSource" in value) || check_77(value.threadSource) || value.threadSource === null) && Array.isArray(value.turns) && value.turns.every((unique_59, index) => check_10(unique_59)) && Number.isInteger(value.updatedAt) && (typeof value.updatedAt != "string" || !0), check_65 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "cwd" in value && "environmentId" in value && "runtimeWorkspaceRoots" in value && check_37(value.cwd) && typeof value.environmentId == "string" && Array.isArray(value.runtimeWorkspaceRoots) && value.runtimeWorkspaceRoots.every((unique_53, index) => check_37(unique_53)), check_66 = (value) => typeof value == "object" && value !== null && !Array.isArray(value), check_67 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.branch === void 0 || !("branch" in value) || typeof value.branch == "string" || value.branch === null) && (value.originUrl === void 0 || !("originUrl" in value) || typeof value.originUrl == "string" || value.originUrl === null) && (value.sha === void 0 || !("sha" in value) || typeof value.sha == "string" || value.sha === null), check_68 = (value) => typeof value == "string" && (value === "legacy" || value === "paginated"), check_69 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && (value.appearance === void 0 || !("appearance" in value) || check_70(value.appearance) || value.appearance === null) && typeof value.id == "string" && typeof value.name == "string", check_70 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.color === void 0 || !("color" in value) || typeof value.color == "string" || value.color === null) && (value.icon === void 0 || !("icon" in value) || typeof value.icon == "string" || value.icon === null), check_71 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "custom" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.custom == "string",
		typeof value == "object" && value !== null && !Array.isArray(value) && "subAgent" in value && Object.getOwnPropertyNames(value).length === 1 && check_72(value.subAgent),
		typeof value == "string" && (value === "cli" || value === "vscode" || value === "exec" || value === "appServer" || value === "unknown")
	].reduce((result, unique_55, _) => unique_55 === !0 ? result + 1 : result, 0) === 1, check_72 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "thread_spawn" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.thread_spawn == "object" && value.thread_spawn !== null && !Array.isArray(value.thread_spawn) && "depth" in value.thread_spawn && "parent_thread_id" in value.thread_spawn && (value.thread_spawn.agent_nickname === void 0 || !("agent_nickname" in value.thread_spawn) || typeof value.thread_spawn.agent_nickname == "string" || value.thread_spawn.agent_nickname === null) && (value.thread_spawn.agent_path === void 0 || !("agent_path" in value.thread_spawn) || check_73(value.thread_spawn.agent_path) || value.thread_spawn.agent_path === null) && (value.thread_spawn.agent_role === void 0 || !("agent_role" in value.thread_spawn) || typeof value.thread_spawn.agent_role == "string" || value.thread_spawn.agent_role === null) && Number.isInteger(value.thread_spawn.depth) && (typeof value.thread_spawn.depth != "string" || !0) && check_74(value.thread_spawn.parent_thread_id),
		typeof value == "object" && value !== null && !Array.isArray(value) && "other" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.other == "string",
		typeof value == "string" && (value === "review" || value === "compact" || value === "memory_consolidation")
	].reduce((result, unique_56, _) => unique_56 === !0 ? result + 1 : result, 0) === 1, check_73 = (value) => typeof value == "string", check_74 = (value) => typeof value == "string", check_75 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "notLoaded",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "idle",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "systemError",
		typeof value == "object" && value !== null && !Array.isArray(value) && "activeFlags" in value && "type" in value && Array.isArray(value.activeFlags) && value.activeFlags.every((unique_58, index) => check_76(unique_58)) && typeof value.type == "string" && value.type === "active"
	].reduce((result, unique_57, _) => unique_57 === !0 ? result + 1 : result, 0) === 1, check_76 = (value) => typeof value == "string" && (value === "waitingOnApproval" || value === "waitingOnUserInput"), check_77 = (value) => typeof value == "string";
	return (value) => check_0(value);
})();
var isCodexThreadStartResponse = (() => {
	let External = [
		/(^options$|^title$)/u,
		/(.*)/u,
		/.*/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "approvalPolicy" in value && "approvalsReviewer" in value && "cwd" in value && "model" in value && "modelProvider" in value && "sandbox" in value && "thread" in value && (value.activePermissionProfile === void 0 || !("activePermissionProfile" in value) || check_1(value.activePermissionProfile) || value.activePermissionProfile === null) && check_2(value.approvalPolicy) && check_3(value.approvalsReviewer) && check_4(value.cwd) && (value.disabledPluginIds === void 0 || !("disabledPluginIds" in value) || Array.isArray(value.disabledPluginIds) && value.disabledPluginIds.every((unique_1, index) => typeof unique_1 == "string")) && (value.instructionSources === void 0 || !("instructionSources" in value) || Array.isArray(value.instructionSources) && value.instructionSources.every((unique_2, index) => check_5(unique_2))) && typeof value.model == "string" && typeof value.modelProvider == "string" && (value.multiAgentMode === void 0 || !("multiAgentMode" in value) || check_6(value.multiAgentMode)) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && (value.runtimeWorkspaceRoots === void 0 || !("runtimeWorkspaceRoots" in value) || Array.isArray(value.runtimeWorkspaceRoots) && value.runtimeWorkspaceRoots.every((unique_4, index) => check_4(unique_4))) && check_8(value.sandbox) && (value.serviceTier === void 0 || !("serviceTier" in value) || typeof value.serviceTier == "string" || value.serviceTier === null) && check_10(value.thread), check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && (value.extends === void 0 || !("extends" in value) || typeof value.extends == "string" || value.extends === null) && typeof value.id == "string", check_2 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "granular" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.granular == "object" && value.granular !== null && !Array.isArray(value.granular) && "mcp_elicitations" in value.granular && "rules" in value.granular && "sandbox_approval" in value.granular && typeof value.granular.mcp_elicitations == "boolean" && (value.granular.request_permissions === void 0 || !("request_permissions" in value.granular) || typeof value.granular.request_permissions == "boolean") && typeof value.granular.rules == "boolean" && typeof value.granular.sandbox_approval == "boolean" && (value.granular.skill_approval === void 0 || !("skill_approval" in value.granular) || typeof value.granular.skill_approval == "boolean"), typeof value == "string" && (value === "untrusted" || value === "on-request" || value === "never")].reduce((result, unique_0, _) => unique_0 === !0 ? result + 1 : result, 0) === 1, check_3 = (value) => typeof value == "string" && (value === "user" || value === "auto_review" || value === "guardian_subagent"), check_4 = (value) => typeof value == "string", check_5 = (value) => typeof value == "string", check_6 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "custom" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.custom == "string", typeof value == "string" && (value === "explicitRequestOnly" || value === "proactive")].reduce((result, unique_3, _) => unique_3 === !0 ? result + 1 : result, 0) === 1, check_7 = (value) => typeof value == "string" && (value.length >= 2 || value.length >= 1 && CodePointCount(value) >= 1), check_8 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "dangerFullAccess",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.networkAccess === void 0 || !("networkAccess" in value) || typeof value.networkAccess == "boolean") && typeof value.type == "string" && value.type === "readOnly",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.networkAccess === void 0 || !("networkAccess" in value) || check_9(value.networkAccess)) && typeof value.type == "string" && value.type === "externalSandbox",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.excludeSlashTmp === void 0 || !("excludeSlashTmp" in value) || typeof value.excludeSlashTmp == "boolean") && (value.excludeTmpdirEnvVar === void 0 || !("excludeTmpdirEnvVar" in value) || typeof value.excludeTmpdirEnvVar == "boolean") && (value.networkAccess === void 0 || !("networkAccess" in value) || typeof value.networkAccess == "boolean") && typeof value.type == "string" && value.type === "workspaceWrite" && (value.writableRoots === void 0 || !("writableRoots" in value) || Array.isArray(value.writableRoots) && value.writableRoots.every((unique_6, index) => check_4(unique_6)))
	].reduce((result, unique_5, _) => unique_5 === !0 ? result + 1 : result, 0) === 1, check_9 = (value) => typeof value == "string" && (value === "restricted" || value === "enabled"), check_10 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "cliVersion" in value && "createdAt" in value && "cwd" in value && "ephemeral" in value && "id" in value && "modelProvider" in value && "preview" in value && "projectId" in value && "sessionId" in value && "source" in value && "status" in value && "turns" in value && "updatedAt" in value && (value.agentNickname === void 0 || !("agentNickname" in value) || typeof value.agentNickname == "string" || value.agentNickname === null) && (value.agentRole === void 0 || !("agentRole" in value) || typeof value.agentRole == "string" || value.agentRole === null) && (value.attachedToThreadId === void 0 || !("attachedToThreadId" in value) || typeof value.attachedToThreadId == "string" || value.attachedToThreadId === null) && (value.canAcceptDirectInput === void 0 || !("canAcceptDirectInput" in value) || typeof value.canAcceptDirectInput == "boolean" || value.canAcceptDirectInput === null) && typeof value.cliVersion == "string" && Number.isInteger(value.createdAt) && (typeof value.createdAt != "string" || !0) && check_4(value.cwd) && (value.daybreakEnabled === void 0 || !("daybreakEnabled" in value) || typeof value.daybreakEnabled == "boolean" || value.daybreakEnabled === null) && (value.daybreakProgramPropagationEnrolled === void 0 || !("daybreakProgramPropagationEnrolled" in value) || typeof value.daybreakProgramPropagationEnrolled == "boolean" || value.daybreakProgramPropagationEnrolled === null) && (value.environments === void 0 || !("environments" in value) || Array.isArray(value.environments) && value.environments.every((unique_7, index) => check_11(unique_7)) || value.environments === null && (!Array.isArray(value.environments) || value.environments.every((unique_9, index) => check_11(unique_9)))) && typeof value.ephemeral == "boolean" && (value.extra === void 0 || !("extra" in value) || check_12(value.extra) || value.extra === null) && (value.forkedFromId === void 0 || !("forkedFromId" in value) || typeof value.forkedFromId == "string" || value.forkedFromId === null) && (value.gitInfo === void 0 || !("gitInfo" in value) || check_13(value.gitInfo) || value.gitInfo === null) && (value.historyMode === void 0 || !("historyMode" in value) || check_14(value.historyMode)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && typeof value.modelProvider == "string" && (value.name === void 0 || !("name" in value) || typeof value.name == "string" || value.name === null) && (value.originator === void 0 || !("originator" in value) || typeof value.originator == "string" || value.originator === null) && (value.parentThreadId === void 0 || !("parentThreadId" in value) || typeof value.parentThreadId == "string" || value.parentThreadId === null) && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.preview == "string" && (typeof value.projectId == "string" || value.projectId === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && (value.recencyAt === void 0 || !("recencyAt" in value) || Number.isInteger(value.recencyAt) && (typeof value.recencyAt != "string" || !0) || value.recencyAt === null && (typeof value.recencyAt != "string" || !0)) && (value.section === void 0 || !("section" in value) || check_15(value.section) || value.section === null) && (value.sectionEnteredAt === void 0 || !("sectionEnteredAt" in value) || Number.isInteger(value.sectionEnteredAt) && (typeof value.sectionEnteredAt != "string" || !0) || value.sectionEnteredAt === null && (typeof value.sectionEnteredAt != "string" || !0)) && typeof value.sessionId == "string" && check_17(value.source) && check_21(value.status) && (value.threadSource === void 0 || !("threadSource" in value) || check_23(value.threadSource) || value.threadSource === null) && Array.isArray(value.turns) && value.turns.every((unique_14, index) => check_24(unique_14)) && Number.isInteger(value.updatedAt) && (typeof value.updatedAt != "string" || !0), check_11 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "cwd" in value && "environmentId" in value && "runtimeWorkspaceRoots" in value && check_5(value.cwd) && typeof value.environmentId == "string" && Array.isArray(value.runtimeWorkspaceRoots) && value.runtimeWorkspaceRoots.every((unique_8, index) => check_5(unique_8)), check_12 = (value) => typeof value == "object" && value !== null && !Array.isArray(value), check_13 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.branch === void 0 || !("branch" in value) || typeof value.branch == "string" || value.branch === null) && (value.originUrl === void 0 || !("originUrl" in value) || typeof value.originUrl == "string" || value.originUrl === null) && (value.sha === void 0 || !("sha" in value) || typeof value.sha == "string" || value.sha === null), check_14 = (value) => typeof value == "string" && (value === "legacy" || value === "paginated"), check_15 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && (value.appearance === void 0 || !("appearance" in value) || check_16(value.appearance) || value.appearance === null) && typeof value.id == "string" && typeof value.name == "string", check_16 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.color === void 0 || !("color" in value) || typeof value.color == "string" || value.color === null) && (value.icon === void 0 || !("icon" in value) || typeof value.icon == "string" || value.icon === null), check_17 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "custom" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.custom == "string",
		typeof value == "object" && value !== null && !Array.isArray(value) && "subAgent" in value && Object.getOwnPropertyNames(value).length === 1 && check_18(value.subAgent),
		typeof value == "string" && (value === "cli" || value === "vscode" || value === "exec" || value === "appServer" || value === "unknown")
	].reduce((result, unique_10, _) => unique_10 === !0 ? result + 1 : result, 0) === 1, check_18 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "thread_spawn" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.thread_spawn == "object" && value.thread_spawn !== null && !Array.isArray(value.thread_spawn) && "depth" in value.thread_spawn && "parent_thread_id" in value.thread_spawn && (value.thread_spawn.agent_nickname === void 0 || !("agent_nickname" in value.thread_spawn) || typeof value.thread_spawn.agent_nickname == "string" || value.thread_spawn.agent_nickname === null) && (value.thread_spawn.agent_path === void 0 || !("agent_path" in value.thread_spawn) || check_19(value.thread_spawn.agent_path) || value.thread_spawn.agent_path === null) && (value.thread_spawn.agent_role === void 0 || !("agent_role" in value.thread_spawn) || typeof value.thread_spawn.agent_role == "string" || value.thread_spawn.agent_role === null) && Number.isInteger(value.thread_spawn.depth) && (typeof value.thread_spawn.depth != "string" || !0) && check_20(value.thread_spawn.parent_thread_id),
		typeof value == "object" && value !== null && !Array.isArray(value) && "other" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.other == "string",
		typeof value == "string" && (value === "review" || value === "compact" || value === "memory_consolidation")
	].reduce((result, unique_11, _) => unique_11 === !0 ? result + 1 : result, 0) === 1, check_19 = (value) => typeof value == "string", check_20 = (value) => typeof value == "string", check_21 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "notLoaded",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "idle",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "systemError",
		typeof value == "object" && value !== null && !Array.isArray(value) && "activeFlags" in value && "type" in value && Array.isArray(value.activeFlags) && value.activeFlags.every((unique_13, index) => check_22(unique_13)) && typeof value.type == "string" && value.type === "active"
	].reduce((result, unique_12, _) => unique_12 === !0 ? result + 1 : result, 0) === 1, check_22 = (value) => typeof value == "string" && (value === "waitingOnApproval" || value === "waitingOnUserInput"), check_23 = (value) => typeof value == "string", check_24 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "items" in value && "status" in value && (value.completedAt === void 0 || !("completedAt" in value) || Number.isInteger(value.completedAt) && (typeof value.completedAt != "string" || !0) || value.completedAt === null && (typeof value.completedAt != "string" || !0)) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.error === void 0 || !("error" in value) || check_25(value.error) || value.error === null) && typeof value.id == "string" && Array.isArray(value.items) && value.items.every((unique_15, index) => check_30(unique_15)) && (value.itemsView === void 0 || !("itemsView" in value) || check_72(value.itemsView)) && (value.rootTurnId === void 0 || !("rootTurnId" in value) || typeof value.rootTurnId == "string" || value.rootTurnId === null) && (value.startedAt === void 0 || !("startedAt" in value) || Number.isInteger(value.startedAt) && (typeof value.startedAt != "string" || !0) || value.startedAt === null && (typeof value.startedAt != "string" || !0)) && check_73(value.status), check_25 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && (value.additionalDetails === void 0 || !("additionalDetails" in value) || typeof value.additionalDetails == "string" || value.additionalDetails === null) && (value.codexErrorInfo === void 0 || !("codexErrorInfo" in value) || check_26(value.codexErrorInfo) || value.codexErrorInfo === null) && typeof value.message == "string" && (value.misalignment === void 0 || !("misalignment" in value) || check_28(value.misalignment) || value.misalignment === null), check_26 = (value) => (!(typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_27(value.activeTurnNotSteerable.turnKind)) && (typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_27(value.activeTurnNotSteerable.turnKind) || typeof value == "string" && (value === "contextWindowExceeded" || value === "sessionBudgetExceeded" || value === "usageLimitExceeded" || value === "apiKeySpendLimitExceeded" || value === "projectSpendLimitExceeded" || value === "organizationSpendLimitExceeded" || value === "rateLimitExceeded" || value === "flexUnavailable" || value === "serverOverloaded" || value === "modelNotFound" || value === "policyCapacityUnavailable" || value === "cyberPolicy" || value === "bioPolicy" || value === "misalignmentPolicyViolation" || value === "tooManyDenials" || value === "internalServerError" || value === "unauthorized" || value === "badRequest" || value === "threadRollbackFailed" || value === "sandboxError" || value === "other") || typeof value == "string" && value === "inferenceHookDenied" || typeof value == "string" || typeof value == "object" && value !== null && !Array.isArray(value)), check_27 = (value) => typeof value == "string" && (value === "review" || value === "compact"), check_28 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.detailedExplanation === void 0 || !("detailedExplanation" in value) || typeof value.detailedExplanation == "string" || value.detailedExplanation === null) && (value.errorType === void 0 || !("errorType" in value) || typeof value.errorType == "string" || value.errorType === null) && (value.reviewTarget === void 0 || !("reviewTarget" in value) || typeof value.reviewTarget == "string" || value.reviewTarget === null) && (value.steer === void 0 || !("steer" in value) || check_29(value.steer) || value.steer === null), check_29 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_30 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.completedAtMs === void 0 || !("completedAtMs" in value) || Number.isInteger(value.completedAtMs) && (typeof value.completedAtMs != "string" || !0) || value.completedAtMs === null && (typeof value.completedAtMs != "string" || !0)) && (value.startedAtMs === void 0 || !("startedAtMs" in value) || Number.isInteger(value.startedAtMs) && (typeof value.startedAtMs != "string" || !0) || value.startedAtMs === null && (typeof value.startedAtMs != "string" || !0)) && [
		typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && "id" in value && "type" in value && (value.clientId === void 0 || !("clientId" in value) || typeof value.clientId == "string" || value.clientId === null) && Array.isArray(value.content) && value.content.every((unique_17, index) => check_31(unique_17)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "userMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "fragments" in value && "id" in value && "type" in value && Array.isArray(value.fragments) && value.fragments.every((unique_20, index) => check_35(unique_20)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "hookPrompt",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && (value.delivery === void 0 || !("delivery" in value) || check_36(value.delivery) || value.delivery === null) && typeof value.id == "string" && (value.memoryCitation === void 0 || !("memoryCitation" in value) || check_37(value.memoryCitation) || value.memoryCitation === null) && (value.moderation === void 0 || !("moderation" in value) || check_39(value.moderation) || value.moderation === null) && (value.phase === void 0 || !("phase" in value) || check_46(value.phase) || value.phase === null) && (value.questions === void 0 || !("questions" in value) || Array.isArray(value.questions) && value.questions.every((unique_28, index) => check_47(unique_28)) || value.questions === null && (!Array.isArray(value.questions) || value.questions.every((unique_33, index) => check_47(unique_33)))) && typeof value.text == "string" && typeof value.type == "string" && value.type === "agentMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && "output" in value && "type" in value && typeof value.id == "string" && typeof value.name == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_48(value.output) && typeof value.type == "string" && value.type === "functionCallOutput",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && typeof value.id == "string" && typeof value.text == "string" && typeof value.type == "string" && value.type === "plan",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && (value.content === void 0 || !("content" in value) || Array.isArray(value.content) && value.content.every((unique_36, index) => typeof unique_36 == "string")) && typeof value.id == "string" && (value.summary === void 0 || !("summary" in value) || Array.isArray(value.summary) && value.summary.every((unique_37, index) => typeof unique_37 == "string")) && typeof value.type == "string" && value.type === "reasoning",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "commandActions" in value && "cwd" in value && "id" in value && "status" in value && "type" in value && (value.aggregatedOutput === void 0 || !("aggregatedOutput" in value) || typeof value.aggregatedOutput == "string" || value.aggregatedOutput === null) && typeof value.command == "string" && Array.isArray(value.commandActions) && value.commandActions.every((unique_38, index) => check_50(unique_38)) && check_5(value.cwd) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.exitCode === void 0 || !("exitCode" in value) || Number.isInteger(value.exitCode) && (typeof value.exitCode != "string" || !0) || value.exitCode === null && (typeof value.exitCode != "string" || !0)) && typeof value.id == "string" && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.processId === void 0 || !("processId" in value) || typeof value.processId == "string" || value.processId === null) && (value.scriptPath === void 0 || !("scriptPath" in value) || typeof value.scriptPath == "string" || value.scriptPath === null) && (value.source === void 0 || !("source" in value) || check_51(value.source)) && check_52(value.status) && typeof value.type == "string" && value.type === "commandExecution",
		typeof value == "object" && value !== null && !Array.isArray(value) && "changes" in value && "id" in value && "status" in value && "type" in value && Array.isArray(value.changes) && value.changes.every((unique_40, index) => check_53(unique_40)) && typeof value.id == "string" && check_55(value.status) && typeof value.type == "string" && value.type === "fileChange",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "server" in value && "status" in value && "tool" in value && "type" in value && (value.appContext === void 0 || !("appContext" in value) || check_56(value.appContext) || value.appContext === null) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.environmentId === void 0 || !("environmentId" in value) || typeof value.environmentId == "string" || value.environmentId === null) && (value.error === void 0 || !("error" in value) || check_57(value.error) || value.error === null) && typeof value.id == "string" && (value.mcpAppResourceUri === void 0 || !("mcpAppResourceUri" in value) || typeof value.mcpAppResourceUri == "string" || value.mcpAppResourceUri === null) && (value.mcpAppUi === void 0 || !("mcpAppUi" in value) || check_58(value.mcpAppUi) || value.mcpAppUi === null) && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.readOnlyHint === void 0 || !("readOnlyHint" in value) || typeof value.readOnlyHint == "boolean" || value.readOnlyHint === null) && (value.result === void 0 || !("result" in value) || check_60(value.result) || value.result === null) && typeof value.server == "string" && check_61(value.status) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "mcpToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "status" in value && "tool" in value && "type" in value && (value.contentItems === void 0 || !("contentItems" in value) || Array.isArray(value.contentItems) && value.contentItems.every((unique_43, index) => check_62(unique_43)) || value.contentItems === null && (!Array.isArray(value.contentItems) || value.contentItems.every((unique_45, index) => check_62(unique_45)))) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && typeof value.id == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_63(value.status) && (value.success === void 0 || !("success" in value) || typeof value.success == "boolean" || value.success === null) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "dynamicToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentsStates" in value && "id" in value && "receiverThreadIds" in value && "senderThreadId" in value && "status" in value && "tool" in value && "type" in value && typeof value.agentsStates == "object" && value.agentsStates !== null && !Array.isArray(value.agentsStates) && Object.getOwnPropertyNames(value.agentsStates).every((unique_46, unique_47) => External[1].test(unique_46) || !1) && Object.entries(value.agentsStates).every(([unique_48, unique_49], _) => !External[2].test(unique_48) || check_64(unique_49)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.prompt === void 0 || !("prompt" in value) || typeof value.prompt == "string" || value.prompt === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && Array.isArray(value.receiverThreadIds) && value.receiverThreadIds.every((unique_50, index) => typeof unique_50 == "string") && typeof value.senderThreadId == "string" && check_66(value.status) && check_67(value.tool) && typeof value.type == "string" && value.type === "collabAgentToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentPath" in value && "agentThreadId" in value && "id" in value && "kind" in value && "type" in value && typeof value.agentPath == "string" && typeof value.agentThreadId == "string" && typeof value.id == "string" && check_68(value.kind) && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_7(value.reasoningEffort) || value.reasoningEffort === null) && typeof value.type == "string" && value.type === "subAgentActivity",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "query" in value && "type" in value && (value.action === void 0 || !("action" in value) || check_69(value.action) || value.action === null) && typeof value.id == "string" && typeof value.query == "string" && (value.results === void 0 || !("results" in value) || Array.isArray(value.results) && value.results.every((unique_54, index) => !0) || value.results === null && (!Array.isArray(value.results) || value.results.every((unique_55, index) => !0))) && typeof value.type == "string" && value.type === "webSearch",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "path" in value && "type" in value && typeof value.id == "string" && check_5(value.path) && typeof value.type == "string" && value.type === "imageView",
		typeof value == "object" && value !== null && !Array.isArray(value) && "durationMs" in value && "id" in value && "type" in value && Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) && (!(Number.isFinite(value.durationMs) || typeof value.durationMs == "bigint") || value.durationMs >= 0) && typeof value.id == "string" && typeof value.type == "string" && value.type === "sleep",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "status" in value && "type" in value && (value.failure === void 0 || !("failure" in value) || check_70(value.failure) || value.failure === null) && (value.generationId === void 0 || !("generationId" in value) || typeof value.generationId == "string" || value.generationId === null) && typeof value.id == "string" && (value.inputImages === void 0 || !("inputImages" in value) || Array.isArray(value.inputImages) && value.inputImages.every((unique_57, index) => check_71(unique_57))) && (value.revisedPrompt === void 0 || !("revisedPrompt" in value) || typeof value.revisedPrompt == "string" || value.revisedPrompt === null) && (value.savedPath === void 0 || !("savedPath" in value) || check_4(value.savedPath) || value.savedPath === null) && typeof value.status == "string" && (value.transparentBackground === void 0 || !("transparentBackground" in value) || typeof value.transparentBackground == "boolean" || value.transparentBackground === null) && typeof value.type == "string" && value.type === "imageGeneration" && (typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "result" in value && typeof value.result == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "enteredReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "exitedReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && typeof value.id == "string" && typeof value.type == "string" && value.type === "contextCompaction"
	].reduce((result, unique_16, _) => unique_16 === !0 ? result + 1 : result, 0) === 1, check_31 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && (value.text_elements === void 0 || !("text_elements" in value) || Array.isArray(value.text_elements) && value.text_elements.every((unique_19, index) => check_32(unique_19))) && typeof value.type == "string" && value.type === "text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_34(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && (value.detail === void 0 || !("detail" in value) || check_34(value.detail) || value.detail === null) && typeof value.path == "string" && typeof value.type == "string" && value.type === "localImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && typeof value.path == "string" && typeof value.type == "string" && value.type === "localAudio",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "skill",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "mention"
	].reduce((result, unique_18, _) => unique_18 === !0 ? result + 1 : result, 0) === 1, check_32 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "byteRange" in value && check_33(value.byteRange) && (value.placeholder === void 0 || !("placeholder" in value) || typeof value.placeholder == "string" || value.placeholder === null), check_33 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "end" in value && "start" in value && Number.isInteger(value.end) && (typeof value.end != "string" || !0) && (!(Number.isFinite(value.end) || typeof value.end == "bigint") || value.end >= 0) && Number.isInteger(value.start) && (typeof value.start != "string" || !0) && (!(Number.isFinite(value.start) || typeof value.start == "bigint") || value.start >= 0), check_34 = (value) => typeof value == "string" && (value === "auto" || value === "low" || value === "high" || value === "original"), check_35 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "hookRunId" in value && "text" in value && typeof value.hookRunId == "string" && typeof value.text == "string", check_36 = (value) => typeof value == "string" && value === "async", check_37 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "entries" in value && "threadIds" in value && Array.isArray(value.entries) && value.entries.every((unique_21, index) => check_38(unique_21)) && Array.isArray(value.threadIds) && value.threadIds.every((unique_22, index) => typeof unique_22 == "string"), check_38 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "lineEnd" in value && "lineStart" in value && "note" in value && "path" in value && Number.isInteger(value.lineEnd) && (typeof value.lineEnd != "string" || !0) && (!(Number.isFinite(value.lineEnd) || typeof value.lineEnd == "bigint") || value.lineEnd >= 0) && Number.isInteger(value.lineStart) && (typeof value.lineStart != "string" || !0) && (!(Number.isFinite(value.lineStart) || typeof value.lineStart == "bigint") || value.lineStart >= 0) && typeof value.note == "string" && typeof value.path == "string", check_39 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "moderated" in value && (value.display === void 0 || !("display" in value) || check_40(value.display) || value.display === null) && typeof value.moderated == "boolean", check_40 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "trustedContacts" in value && "version" in value && (value.annotation === void 0 || !("annotation" in value) || check_41(value.annotation) || value.annotation === null) && typeof value.mode == "string" && value.mode === "show" && check_43(value.trustedContacts) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "replacement" in value && "version" in value && typeof value.mode == "string" && value.mode === "hide" && check_44(value.replacement) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "reason" in value && "version" in value && typeof value.mode == "string" && value.mode === "block" && check_45(value.reason) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1
	].reduce((result, unique_23, _) => unique_23 === !0 ? result + 1 : result, 0) === 1, check_41 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "subject" in value && typeof value.kind == "string" && value.kind === "wellbeingHelpline" && check_42(value.subject)].reduce((result, unique_24, _) => unique_24 === !0 ? result + 1 : result, 0) === 1, check_42 = (value) => typeof value == "string" && (value === "answer" || value === "prompt"), check_43 = (value) => typeof value == "string" && (value === "check" || value === "skip"), check_44 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "wellbeingPromptHelpline"].reduce((result, unique_25, _) => unique_25 === !0 ? result + 1 : result, 0) === 1, check_45 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "protectionType" in value && typeof value.kind == "string" && value.kind === "protection" && typeof value.protectionType == "string", typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "cyber" && (value.trustedAccess === void 0 || !("trustedAccess" in value) || typeof value.trustedAccess == "boolean" || value.trustedAccess === null)].reduce((result, unique_26, _) => unique_26 === !0 ? result + 1 : result, 0) === 1, check_46 = (value) => [
		typeof value == "string" && value === "commentary",
		typeof value == "string" && value === "partial_answer",
		typeof value == "string" && value === "final_answer"
	].reduce((result, unique_27, _) => unique_27 === !0 ? result + 1 : result, 0) === 1, check_47 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "title" in value && Object.getOwnPropertyNames(value).every((unique_29, unique_30) => External[0].test(unique_29) || !1) && (value.options === void 0 || !("options" in value) || Array.isArray(value.options) && value.options.every((unique_31, index) => typeof unique_31 == "string") || value.options === null && (!Array.isArray(value.options) || value.options.every((unique_32, index) => typeof unique_32 == "string"))) && typeof value.title == "string", check_48 = (value) => Array.isArray(value) && value.every((unique_34, index) => check_49(unique_34)) || typeof value == "string", check_49 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "input_text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_34(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "input_image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "image_url" in value && typeof value.image_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "input_audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "audio_url" in value && typeof value.audio_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "encrypted_content" in value && "type" in value && typeof value.encrypted_content == "string" && typeof value.type == "string" && value.type === "encrypted_content"
	].reduce((result, unique_35, _) => unique_35 === !0 ? result + 1 : result, 0) === 1, check_50 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "name" in value && "path" in value && "type" in value && typeof value.command == "string" && typeof value.name == "string" && check_5(value.path) && typeof value.type == "string" && value.type === "read",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.type == "string" && value.type === "listFiles",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && typeof value.type == "string" && value.type === "unknown"
	].reduce((result, unique_39, _) => unique_39 === !0 ? result + 1 : result, 0) === 1, check_51 = (value) => typeof value == "string" && (value === "agent" || value === "userShell" || value === "unifiedExecStartup" || value === "unifiedExecInteraction"), check_52 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_53 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "diff" in value && "kind" in value && "path" in value && typeof value.diff == "string" && check_54(value.kind) && typeof value.path == "string", check_54 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "add",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "delete",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.move_path === void 0 || !("move_path" in value) || typeof value.move_path == "string" || value.move_path === null) && typeof value.type == "string" && value.type === "update"
	].reduce((result, unique_41, _) => unique_41 === !0 ? result + 1 : result, 0) === 1, check_55 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_56 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "connectorId" in value && (value.actionName === void 0 || !("actionName" in value) || typeof value.actionName == "string" || value.actionName === null) && (value.appName === void 0 || !("appName" in value) || typeof value.appName == "string" || value.appName === null) && typeof value.connectorId == "string" && (value.linkId === void 0 || !("linkId" in value) || typeof value.linkId == "string" || value.linkId === null) && (value.resourceUri === void 0 || !("resourceUri" in value) || typeof value.resourceUri == "string" || value.resourceUri === null), check_57 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_58 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "preferredModelDisplayMode" in value && "resourceUri" in value && check_59(value.preferredModelDisplayMode) && typeof value.resourceUri == "string", check_59 = (value) => typeof value == "string" && (value === "inline" || value === "fullscreen"), check_60 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && (value._meta === void 0 || !("_meta" in value) || !0) && Array.isArray(value.content) && value.content.every((unique_42, index) => !0) && (value.structuredContent === void 0 || !("structuredContent" in value) || !0), check_61 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_62 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "inputText",
		typeof value == "object" && value !== null && !Array.isArray(value) && "imageUrl" in value && "type" in value && typeof value.imageUrl == "string" && typeof value.type == "string" && value.type === "inputImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "audioUrl" in value && "type" in value && typeof value.audioUrl == "string" && typeof value.type == "string" && value.type === "inputAudio"
	].reduce((result, unique_44, _) => unique_44 === !0 ? result + 1 : result, 0) === 1, check_63 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_64 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "status" in value && (value.message === void 0 || !("message" in value) || typeof value.message == "string" || value.message === null) && check_65(value.status), check_65 = (value) => typeof value == "string" && (value === "pendingInit" || value === "running" || value === "interrupted" || value === "completed" || value === "errored" || value === "shutdown" || value === "notFound"), check_66 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "interrupted"), check_67 = (value) => typeof value == "string" && (value === "spawnAgent" || value === "sendInput" || value === "resumeAgent" || value === "wait" || value === "closeAgent" || value === "sendMessage" || value === "followupTask" || value === "interruptAgent" || value === "listAgents"), check_68 = (value) => typeof value == "string" && (value === "started" || value === "interacted" || value === "interrupted" || value === "completed"), check_69 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.queries === void 0 || !("queries" in value) || Array.isArray(value.queries) && value.queries.every((unique_52, index) => typeof unique_52 == "string") || value.queries === null && (!Array.isArray(value.queries) || value.queries.every((unique_53, index) => typeof unique_53 == "string"))) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "openPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.pattern === void 0 || !("pattern" in value) || typeof value.pattern == "string" || value.pattern === null) && typeof value.type == "string" && value.type === "findInPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "other"
	].reduce((result, unique_51, _) => unique_51 === !0 ? result + 1 : result, 0) === 1, check_70 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "limitId" in value && "type" in value && typeof value.limitId == "string" && (value.resetsAt === void 0 || !("resetsAt" in value) || Number.isInteger(value.resetsAt) && (typeof value.resetsAt != "string" || !0) || value.resetsAt === null && (typeof value.resetsAt != "string" || !0)) && typeof value.type == "string" && value.type === "usageLimitExceeded"].reduce((result, unique_56, _) => unique_56 === !0 ? result + 1 : result, 0) === 1, check_71 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "sha256" in value && check_4(value.path) && typeof value.sha256 == "string", check_72 = (value) => [
		typeof value == "string" && value === "notLoaded",
		typeof value == "string" && value === "summary",
		typeof value == "string" && value === "full"
	].reduce((result, unique_58, _) => unique_58 === !0 ? result + 1 : result, 0) === 1, check_73 = (value) => typeof value == "string" && (value === "completed" || value === "interrupted" || value === "failed" || value === "inProgress");
	return (value) => check_0(value);
})();
var isCodexTurnCompletedNotification = (() => {
	let External = [
		/(^options$|^title$)/u,
		/(.*)/u,
		/.*/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "threadId" in value && "turn" in value && typeof value.threadId == "string" && check_1(value.turn), check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "items" in value && "status" in value && (value.completedAt === void 0 || !("completedAt" in value) || Number.isInteger(value.completedAt) && (typeof value.completedAt != "string" || !0) || value.completedAt === null && (typeof value.completedAt != "string" || !0)) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.error === void 0 || !("error" in value) || check_2(value.error) || value.error === null) && typeof value.id == "string" && Array.isArray(value.items) && value.items.every((unique_0, index) => check_7(unique_0)) && (value.itemsView === void 0 || !("itemsView" in value) || check_52(value.itemsView)) && (value.rootTurnId === void 0 || !("rootTurnId" in value) || typeof value.rootTurnId == "string" || value.rootTurnId === null) && (value.startedAt === void 0 || !("startedAt" in value) || Number.isInteger(value.startedAt) && (typeof value.startedAt != "string" || !0) || value.startedAt === null && (typeof value.startedAt != "string" || !0)) && check_53(value.status), check_2 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && (value.additionalDetails === void 0 || !("additionalDetails" in value) || typeof value.additionalDetails == "string" || value.additionalDetails === null) && (value.codexErrorInfo === void 0 || !("codexErrorInfo" in value) || check_3(value.codexErrorInfo) || value.codexErrorInfo === null) && typeof value.message == "string" && (value.misalignment === void 0 || !("misalignment" in value) || check_5(value.misalignment) || value.misalignment === null), check_3 = (value) => (!(typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_4(value.activeTurnNotSteerable.turnKind)) && (typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_4(value.activeTurnNotSteerable.turnKind) || typeof value == "string" && (value === "contextWindowExceeded" || value === "sessionBudgetExceeded" || value === "usageLimitExceeded" || value === "apiKeySpendLimitExceeded" || value === "projectSpendLimitExceeded" || value === "organizationSpendLimitExceeded" || value === "rateLimitExceeded" || value === "flexUnavailable" || value === "serverOverloaded" || value === "modelNotFound" || value === "policyCapacityUnavailable" || value === "cyberPolicy" || value === "bioPolicy" || value === "misalignmentPolicyViolation" || value === "tooManyDenials" || value === "internalServerError" || value === "unauthorized" || value === "badRequest" || value === "threadRollbackFailed" || value === "sandboxError" || value === "other") || typeof value == "string" && value === "inferenceHookDenied" || typeof value == "string" || typeof value == "object" && value !== null && !Array.isArray(value)), check_4 = (value) => typeof value == "string" && (value === "review" || value === "compact"), check_5 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.detailedExplanation === void 0 || !("detailedExplanation" in value) || typeof value.detailedExplanation == "string" || value.detailedExplanation === null) && (value.errorType === void 0 || !("errorType" in value) || typeof value.errorType == "string" || value.errorType === null) && (value.reviewTarget === void 0 || !("reviewTarget" in value) || typeof value.reviewTarget == "string" || value.reviewTarget === null) && (value.steer === void 0 || !("steer" in value) || check_6(value.steer) || value.steer === null), check_6 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_7 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.completedAtMs === void 0 || !("completedAtMs" in value) || Number.isInteger(value.completedAtMs) && (typeof value.completedAtMs != "string" || !0) || value.completedAtMs === null && (typeof value.completedAtMs != "string" || !0)) && (value.startedAtMs === void 0 || !("startedAtMs" in value) || Number.isInteger(value.startedAtMs) && (typeof value.startedAtMs != "string" || !0) || value.startedAtMs === null && (typeof value.startedAtMs != "string" || !0)) && [
		typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && "id" in value && "type" in value && (value.clientId === void 0 || !("clientId" in value) || typeof value.clientId == "string" || value.clientId === null) && Array.isArray(value.content) && value.content.every((unique_2, index) => check_8(unique_2)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "userMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "fragments" in value && "id" in value && "type" in value && Array.isArray(value.fragments) && value.fragments.every((unique_5, index) => check_12(unique_5)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "hookPrompt",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && (value.delivery === void 0 || !("delivery" in value) || check_13(value.delivery) || value.delivery === null) && typeof value.id == "string" && (value.memoryCitation === void 0 || !("memoryCitation" in value) || check_14(value.memoryCitation) || value.memoryCitation === null) && (value.moderation === void 0 || !("moderation" in value) || check_16(value.moderation) || value.moderation === null) && (value.phase === void 0 || !("phase" in value) || check_23(value.phase) || value.phase === null) && (value.questions === void 0 || !("questions" in value) || Array.isArray(value.questions) && value.questions.every((unique_13, index) => check_24(unique_13)) || value.questions === null && (!Array.isArray(value.questions) || value.questions.every((unique_18, index) => check_24(unique_18)))) && typeof value.text == "string" && typeof value.type == "string" && value.type === "agentMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && "output" in value && "type" in value && typeof value.id == "string" && typeof value.name == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_25(value.output) && typeof value.type == "string" && value.type === "functionCallOutput",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && typeof value.id == "string" && typeof value.text == "string" && typeof value.type == "string" && value.type === "plan",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && (value.content === void 0 || !("content" in value) || Array.isArray(value.content) && value.content.every((unique_21, index) => typeof unique_21 == "string")) && typeof value.id == "string" && (value.summary === void 0 || !("summary" in value) || Array.isArray(value.summary) && value.summary.every((unique_22, index) => typeof unique_22 == "string")) && typeof value.type == "string" && value.type === "reasoning",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "commandActions" in value && "cwd" in value && "id" in value && "status" in value && "type" in value && (value.aggregatedOutput === void 0 || !("aggregatedOutput" in value) || typeof value.aggregatedOutput == "string" || value.aggregatedOutput === null) && typeof value.command == "string" && Array.isArray(value.commandActions) && value.commandActions.every((unique_23, index) => check_27(unique_23)) && check_28(value.cwd) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.exitCode === void 0 || !("exitCode" in value) || Number.isInteger(value.exitCode) && (typeof value.exitCode != "string" || !0) || value.exitCode === null && (typeof value.exitCode != "string" || !0)) && typeof value.id == "string" && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.processId === void 0 || !("processId" in value) || typeof value.processId == "string" || value.processId === null) && (value.scriptPath === void 0 || !("scriptPath" in value) || typeof value.scriptPath == "string" || value.scriptPath === null) && (value.source === void 0 || !("source" in value) || check_29(value.source)) && check_30(value.status) && typeof value.type == "string" && value.type === "commandExecution",
		typeof value == "object" && value !== null && !Array.isArray(value) && "changes" in value && "id" in value && "status" in value && "type" in value && Array.isArray(value.changes) && value.changes.every((unique_25, index) => check_31(unique_25)) && typeof value.id == "string" && check_33(value.status) && typeof value.type == "string" && value.type === "fileChange",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "server" in value && "status" in value && "tool" in value && "type" in value && (value.appContext === void 0 || !("appContext" in value) || check_34(value.appContext) || value.appContext === null) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.environmentId === void 0 || !("environmentId" in value) || typeof value.environmentId == "string" || value.environmentId === null) && (value.error === void 0 || !("error" in value) || check_35(value.error) || value.error === null) && typeof value.id == "string" && (value.mcpAppResourceUri === void 0 || !("mcpAppResourceUri" in value) || typeof value.mcpAppResourceUri == "string" || value.mcpAppResourceUri === null) && (value.mcpAppUi === void 0 || !("mcpAppUi" in value) || check_36(value.mcpAppUi) || value.mcpAppUi === null) && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.readOnlyHint === void 0 || !("readOnlyHint" in value) || typeof value.readOnlyHint == "boolean" || value.readOnlyHint === null) && (value.result === void 0 || !("result" in value) || check_38(value.result) || value.result === null) && typeof value.server == "string" && check_39(value.status) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "mcpToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "status" in value && "tool" in value && "type" in value && (value.contentItems === void 0 || !("contentItems" in value) || Array.isArray(value.contentItems) && value.contentItems.every((unique_28, index) => check_40(unique_28)) || value.contentItems === null && (!Array.isArray(value.contentItems) || value.contentItems.every((unique_30, index) => check_40(unique_30)))) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && typeof value.id == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_41(value.status) && (value.success === void 0 || !("success" in value) || typeof value.success == "boolean" || value.success === null) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "dynamicToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentsStates" in value && "id" in value && "receiverThreadIds" in value && "senderThreadId" in value && "status" in value && "tool" in value && "type" in value && typeof value.agentsStates == "object" && value.agentsStates !== null && !Array.isArray(value.agentsStates) && Object.getOwnPropertyNames(value.agentsStates).every((unique_31, unique_32) => External[1].test(unique_31) || !1) && Object.entries(value.agentsStates).every(([unique_33, unique_34], _) => !External[2].test(unique_33) || check_42(unique_34)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.prompt === void 0 || !("prompt" in value) || typeof value.prompt == "string" || value.prompt === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_44(value.reasoningEffort) || value.reasoningEffort === null) && Array.isArray(value.receiverThreadIds) && value.receiverThreadIds.every((unique_35, index) => typeof unique_35 == "string") && typeof value.senderThreadId == "string" && check_45(value.status) && check_46(value.tool) && typeof value.type == "string" && value.type === "collabAgentToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentPath" in value && "agentThreadId" in value && "id" in value && "kind" in value && "type" in value && typeof value.agentPath == "string" && typeof value.agentThreadId == "string" && typeof value.id == "string" && check_47(value.kind) && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_44(value.reasoningEffort) || value.reasoningEffort === null) && typeof value.type == "string" && value.type === "subAgentActivity",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "query" in value && "type" in value && (value.action === void 0 || !("action" in value) || check_48(value.action) || value.action === null) && typeof value.id == "string" && typeof value.query == "string" && (value.results === void 0 || !("results" in value) || Array.isArray(value.results) && value.results.every((unique_39, index) => !0) || value.results === null && (!Array.isArray(value.results) || value.results.every((unique_40, index) => !0))) && typeof value.type == "string" && value.type === "webSearch",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "path" in value && "type" in value && typeof value.id == "string" && check_28(value.path) && typeof value.type == "string" && value.type === "imageView",
		typeof value == "object" && value !== null && !Array.isArray(value) && "durationMs" in value && "id" in value && "type" in value && Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) && (!(Number.isFinite(value.durationMs) || typeof value.durationMs == "bigint") || value.durationMs >= 0) && typeof value.id == "string" && typeof value.type == "string" && value.type === "sleep",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "status" in value && "type" in value && (value.failure === void 0 || !("failure" in value) || check_49(value.failure) || value.failure === null) && (value.generationId === void 0 || !("generationId" in value) || typeof value.generationId == "string" || value.generationId === null) && typeof value.id == "string" && (value.inputImages === void 0 || !("inputImages" in value) || Array.isArray(value.inputImages) && value.inputImages.every((unique_42, index) => check_50(unique_42))) && (value.revisedPrompt === void 0 || !("revisedPrompt" in value) || typeof value.revisedPrompt == "string" || value.revisedPrompt === null) && (value.savedPath === void 0 || !("savedPath" in value) || check_51(value.savedPath) || value.savedPath === null) && typeof value.status == "string" && (value.transparentBackground === void 0 || !("transparentBackground" in value) || typeof value.transparentBackground == "boolean" || value.transparentBackground === null) && typeof value.type == "string" && value.type === "imageGeneration" && (typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "result" in value && typeof value.result == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "enteredReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "exitedReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && typeof value.id == "string" && typeof value.type == "string" && value.type === "contextCompaction"
	].reduce((result, unique_1, _) => unique_1 === !0 ? result + 1 : result, 0) === 1, check_8 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && (value.text_elements === void 0 || !("text_elements" in value) || Array.isArray(value.text_elements) && value.text_elements.every((unique_4, index) => check_9(unique_4))) && typeof value.type == "string" && value.type === "text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.path == "string" && typeof value.type == "string" && value.type === "localImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && typeof value.path == "string" && typeof value.type == "string" && value.type === "localAudio",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "skill",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "mention"
	].reduce((result, unique_3, _) => unique_3 === !0 ? result + 1 : result, 0) === 1, check_9 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "byteRange" in value && check_10(value.byteRange) && (value.placeholder === void 0 || !("placeholder" in value) || typeof value.placeholder == "string" || value.placeholder === null), check_10 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "end" in value && "start" in value && Number.isInteger(value.end) && (typeof value.end != "string" || !0) && (!(Number.isFinite(value.end) || typeof value.end == "bigint") || value.end >= 0) && Number.isInteger(value.start) && (typeof value.start != "string" || !0) && (!(Number.isFinite(value.start) || typeof value.start == "bigint") || value.start >= 0), check_11 = (value) => typeof value == "string" && (value === "auto" || value === "low" || value === "high" || value === "original"), check_12 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "hookRunId" in value && "text" in value && typeof value.hookRunId == "string" && typeof value.text == "string", check_13 = (value) => typeof value == "string" && value === "async", check_14 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "entries" in value && "threadIds" in value && Array.isArray(value.entries) && value.entries.every((unique_6, index) => check_15(unique_6)) && Array.isArray(value.threadIds) && value.threadIds.every((unique_7, index) => typeof unique_7 == "string"), check_15 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "lineEnd" in value && "lineStart" in value && "note" in value && "path" in value && Number.isInteger(value.lineEnd) && (typeof value.lineEnd != "string" || !0) && (!(Number.isFinite(value.lineEnd) || typeof value.lineEnd == "bigint") || value.lineEnd >= 0) && Number.isInteger(value.lineStart) && (typeof value.lineStart != "string" || !0) && (!(Number.isFinite(value.lineStart) || typeof value.lineStart == "bigint") || value.lineStart >= 0) && typeof value.note == "string" && typeof value.path == "string", check_16 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "moderated" in value && (value.display === void 0 || !("display" in value) || check_17(value.display) || value.display === null) && typeof value.moderated == "boolean", check_17 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "trustedContacts" in value && "version" in value && (value.annotation === void 0 || !("annotation" in value) || check_18(value.annotation) || value.annotation === null) && typeof value.mode == "string" && value.mode === "show" && check_20(value.trustedContacts) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "replacement" in value && "version" in value && typeof value.mode == "string" && value.mode === "hide" && check_21(value.replacement) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "reason" in value && "version" in value && typeof value.mode == "string" && value.mode === "block" && check_22(value.reason) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1
	].reduce((result, unique_8, _) => unique_8 === !0 ? result + 1 : result, 0) === 1, check_18 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "subject" in value && typeof value.kind == "string" && value.kind === "wellbeingHelpline" && check_19(value.subject)].reduce((result, unique_9, _) => unique_9 === !0 ? result + 1 : result, 0) === 1, check_19 = (value) => typeof value == "string" && (value === "answer" || value === "prompt"), check_20 = (value) => typeof value == "string" && (value === "check" || value === "skip"), check_21 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "wellbeingPromptHelpline"].reduce((result, unique_10, _) => unique_10 === !0 ? result + 1 : result, 0) === 1, check_22 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "protectionType" in value && typeof value.kind == "string" && value.kind === "protection" && typeof value.protectionType == "string", typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "cyber" && (value.trustedAccess === void 0 || !("trustedAccess" in value) || typeof value.trustedAccess == "boolean" || value.trustedAccess === null)].reduce((result, unique_11, _) => unique_11 === !0 ? result + 1 : result, 0) === 1, check_23 = (value) => [
		typeof value == "string" && value === "commentary",
		typeof value == "string" && value === "partial_answer",
		typeof value == "string" && value === "final_answer"
	].reduce((result, unique_12, _) => unique_12 === !0 ? result + 1 : result, 0) === 1, check_24 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "title" in value && Object.getOwnPropertyNames(value).every((unique_14, unique_15) => External[0].test(unique_14) || !1) && (value.options === void 0 || !("options" in value) || Array.isArray(value.options) && value.options.every((unique_16, index) => typeof unique_16 == "string") || value.options === null && (!Array.isArray(value.options) || value.options.every((unique_17, index) => typeof unique_17 == "string"))) && typeof value.title == "string", check_25 = (value) => Array.isArray(value) && value.every((unique_19, index) => check_26(unique_19)) || typeof value == "string", check_26 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "input_text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "input_image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "image_url" in value && typeof value.image_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "input_audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "audio_url" in value && typeof value.audio_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "encrypted_content" in value && "type" in value && typeof value.encrypted_content == "string" && typeof value.type == "string" && value.type === "encrypted_content"
	].reduce((result, unique_20, _) => unique_20 === !0 ? result + 1 : result, 0) === 1, check_27 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "name" in value && "path" in value && "type" in value && typeof value.command == "string" && typeof value.name == "string" && check_28(value.path) && typeof value.type == "string" && value.type === "read",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.type == "string" && value.type === "listFiles",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && typeof value.type == "string" && value.type === "unknown"
	].reduce((result, unique_24, _) => unique_24 === !0 ? result + 1 : result, 0) === 1, check_28 = (value) => typeof value == "string", check_29 = (value) => typeof value == "string" && (value === "agent" || value === "userShell" || value === "unifiedExecStartup" || value === "unifiedExecInteraction"), check_30 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_31 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "diff" in value && "kind" in value && "path" in value && typeof value.diff == "string" && check_32(value.kind) && typeof value.path == "string", check_32 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "add",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "delete",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.move_path === void 0 || !("move_path" in value) || typeof value.move_path == "string" || value.move_path === null) && typeof value.type == "string" && value.type === "update"
	].reduce((result, unique_26, _) => unique_26 === !0 ? result + 1 : result, 0) === 1, check_33 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_34 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "connectorId" in value && (value.actionName === void 0 || !("actionName" in value) || typeof value.actionName == "string" || value.actionName === null) && (value.appName === void 0 || !("appName" in value) || typeof value.appName == "string" || value.appName === null) && typeof value.connectorId == "string" && (value.linkId === void 0 || !("linkId" in value) || typeof value.linkId == "string" || value.linkId === null) && (value.resourceUri === void 0 || !("resourceUri" in value) || typeof value.resourceUri == "string" || value.resourceUri === null), check_35 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_36 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "preferredModelDisplayMode" in value && "resourceUri" in value && check_37(value.preferredModelDisplayMode) && typeof value.resourceUri == "string", check_37 = (value) => typeof value == "string" && (value === "inline" || value === "fullscreen"), check_38 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && (value._meta === void 0 || !("_meta" in value) || !0) && Array.isArray(value.content) && value.content.every((unique_27, index) => !0) && (value.structuredContent === void 0 || !("structuredContent" in value) || !0), check_39 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_40 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "inputText",
		typeof value == "object" && value !== null && !Array.isArray(value) && "imageUrl" in value && "type" in value && typeof value.imageUrl == "string" && typeof value.type == "string" && value.type === "inputImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "audioUrl" in value && "type" in value && typeof value.audioUrl == "string" && typeof value.type == "string" && value.type === "inputAudio"
	].reduce((result, unique_29, _) => unique_29 === !0 ? result + 1 : result, 0) === 1, check_41 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_42 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "status" in value && (value.message === void 0 || !("message" in value) || typeof value.message == "string" || value.message === null) && check_43(value.status), check_43 = (value) => typeof value == "string" && (value === "pendingInit" || value === "running" || value === "interrupted" || value === "completed" || value === "errored" || value === "shutdown" || value === "notFound"), check_44 = (value) => typeof value == "string" && (value.length >= 2 || value.length >= 1 && CodePointCount(value) >= 1), check_45 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "interrupted"), check_46 = (value) => typeof value == "string" && (value === "spawnAgent" || value === "sendInput" || value === "resumeAgent" || value === "wait" || value === "closeAgent" || value === "sendMessage" || value === "followupTask" || value === "interruptAgent" || value === "listAgents"), check_47 = (value) => typeof value == "string" && (value === "started" || value === "interacted" || value === "interrupted" || value === "completed"), check_48 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.queries === void 0 || !("queries" in value) || Array.isArray(value.queries) && value.queries.every((unique_37, index) => typeof unique_37 == "string") || value.queries === null && (!Array.isArray(value.queries) || value.queries.every((unique_38, index) => typeof unique_38 == "string"))) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "openPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.pattern === void 0 || !("pattern" in value) || typeof value.pattern == "string" || value.pattern === null) && typeof value.type == "string" && value.type === "findInPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "other"
	].reduce((result, unique_36, _) => unique_36 === !0 ? result + 1 : result, 0) === 1, check_49 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "limitId" in value && "type" in value && typeof value.limitId == "string" && (value.resetsAt === void 0 || !("resetsAt" in value) || Number.isInteger(value.resetsAt) && (typeof value.resetsAt != "string" || !0) || value.resetsAt === null && (typeof value.resetsAt != "string" || !0)) && typeof value.type == "string" && value.type === "usageLimitExceeded"].reduce((result, unique_41, _) => unique_41 === !0 ? result + 1 : result, 0) === 1, check_50 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "sha256" in value && check_51(value.path) && typeof value.sha256 == "string", check_51 = (value) => typeof value == "string", check_52 = (value) => [
		typeof value == "string" && value === "notLoaded",
		typeof value == "string" && value === "summary",
		typeof value == "string" && value === "full"
	].reduce((result, unique_43, _) => unique_43 === !0 ? result + 1 : result, 0) === 1, check_53 = (value) => typeof value == "string" && (value === "completed" || value === "interrupted" || value === "failed" || value === "inProgress");
	return (value) => check_0(value);
})();
var isCodexTurnStartResponse = (() => {
	let External = [
		/(^options$|^title$)/u,
		/(.*)/u,
		/.*/u
	], check_0 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "turn" in value && check_1(value.turn), check_1 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "items" in value && "status" in value && (value.completedAt === void 0 || !("completedAt" in value) || Number.isInteger(value.completedAt) && (typeof value.completedAt != "string" || !0) || value.completedAt === null && (typeof value.completedAt != "string" || !0)) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.error === void 0 || !("error" in value) || check_2(value.error) || value.error === null) && typeof value.id == "string" && Array.isArray(value.items) && value.items.every((unique_0, index) => check_7(unique_0)) && (value.itemsView === void 0 || !("itemsView" in value) || check_52(value.itemsView)) && (value.rootTurnId === void 0 || !("rootTurnId" in value) || typeof value.rootTurnId == "string" || value.rootTurnId === null) && (value.startedAt === void 0 || !("startedAt" in value) || Number.isInteger(value.startedAt) && (typeof value.startedAt != "string" || !0) || value.startedAt === null && (typeof value.startedAt != "string" || !0)) && check_53(value.status), check_2 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && (value.additionalDetails === void 0 || !("additionalDetails" in value) || typeof value.additionalDetails == "string" || value.additionalDetails === null) && (value.codexErrorInfo === void 0 || !("codexErrorInfo" in value) || check_3(value.codexErrorInfo) || value.codexErrorInfo === null) && typeof value.message == "string" && (value.misalignment === void 0 || !("misalignment" in value) || check_5(value.misalignment) || value.misalignment === null), check_3 = (value) => (!(typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0))) && (!(typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_4(value.activeTurnNotSteerable.turnKind)) && (typeof value == "object" && value !== null && !Array.isArray(value) && "httpConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.httpConnectionFailed == "object" && value.httpConnectionFailed !== null && !Array.isArray(value.httpConnectionFailed) && (value.httpConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.httpConnectionFailed) || Number.isInteger(value.httpConnectionFailed.httpStatusCode) && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0) || value.httpConnectionFailed.httpStatusCode === null && (typeof value.httpConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.httpConnectionFailed.httpStatusCode) || typeof value.httpConnectionFailed.httpStatusCode == "bigint") || value.httpConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamConnectionFailed" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamConnectionFailed == "object" && value.responseStreamConnectionFailed !== null && !Array.isArray(value.responseStreamConnectionFailed) && (value.responseStreamConnectionFailed.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamConnectionFailed) || Number.isInteger(value.responseStreamConnectionFailed.httpStatusCode) && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0) || value.responseStreamConnectionFailed.httpStatusCode === null && (typeof value.responseStreamConnectionFailed.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamConnectionFailed.httpStatusCode) || typeof value.responseStreamConnectionFailed.httpStatusCode == "bigint") || value.responseStreamConnectionFailed.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseStreamDisconnected" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseStreamDisconnected == "object" && value.responseStreamDisconnected !== null && !Array.isArray(value.responseStreamDisconnected) && (value.responseStreamDisconnected.httpStatusCode === void 0 || !("httpStatusCode" in value.responseStreamDisconnected) || Number.isInteger(value.responseStreamDisconnected.httpStatusCode) && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0) || value.responseStreamDisconnected.httpStatusCode === null && (typeof value.responseStreamDisconnected.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseStreamDisconnected.httpStatusCode) || typeof value.responseStreamDisconnected.httpStatusCode == "bigint") || value.responseStreamDisconnected.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "responseTooManyFailedAttempts" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.responseTooManyFailedAttempts == "object" && value.responseTooManyFailedAttempts !== null && !Array.isArray(value.responseTooManyFailedAttempts) && (value.responseTooManyFailedAttempts.httpStatusCode === void 0 || !("httpStatusCode" in value.responseTooManyFailedAttempts) || Number.isInteger(value.responseTooManyFailedAttempts.httpStatusCode) && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0) || value.responseTooManyFailedAttempts.httpStatusCode === null && (typeof value.responseTooManyFailedAttempts.httpStatusCode != "string" || !0) && (!(Number.isFinite(value.responseTooManyFailedAttempts.httpStatusCode) || typeof value.responseTooManyFailedAttempts.httpStatusCode == "bigint") || value.responseTooManyFailedAttempts.httpStatusCode >= 0)) || typeof value == "object" && value !== null && !Array.isArray(value) && "activeTurnNotSteerable" in value && Object.getOwnPropertyNames(value).length === 1 && typeof value.activeTurnNotSteerable == "object" && value.activeTurnNotSteerable !== null && !Array.isArray(value.activeTurnNotSteerable) && "turnKind" in value.activeTurnNotSteerable && check_4(value.activeTurnNotSteerable.turnKind) || typeof value == "string" && (value === "contextWindowExceeded" || value === "sessionBudgetExceeded" || value === "usageLimitExceeded" || value === "apiKeySpendLimitExceeded" || value === "projectSpendLimitExceeded" || value === "organizationSpendLimitExceeded" || value === "rateLimitExceeded" || value === "flexUnavailable" || value === "serverOverloaded" || value === "modelNotFound" || value === "policyCapacityUnavailable" || value === "cyberPolicy" || value === "bioPolicy" || value === "misalignmentPolicyViolation" || value === "tooManyDenials" || value === "internalServerError" || value === "unauthorized" || value === "badRequest" || value === "threadRollbackFailed" || value === "sandboxError" || value === "other") || typeof value == "string" && value === "inferenceHookDenied" || typeof value == "string" || typeof value == "object" && value !== null && !Array.isArray(value)), check_4 = (value) => typeof value == "string" && (value === "review" || value === "compact"), check_5 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.detailedExplanation === void 0 || !("detailedExplanation" in value) || typeof value.detailedExplanation == "string" || value.detailedExplanation === null) && (value.errorType === void 0 || !("errorType" in value) || typeof value.errorType == "string" || value.errorType === null) && (value.reviewTarget === void 0 || !("reviewTarget" in value) || typeof value.reviewTarget == "string" || value.reviewTarget === null) && (value.steer === void 0 || !("steer" in value) || check_6(value.steer) || value.steer === null), check_6 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_7 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && (value.completedAtMs === void 0 || !("completedAtMs" in value) || Number.isInteger(value.completedAtMs) && (typeof value.completedAtMs != "string" || !0) || value.completedAtMs === null && (typeof value.completedAtMs != "string" || !0)) && (value.startedAtMs === void 0 || !("startedAtMs" in value) || Number.isInteger(value.startedAtMs) && (typeof value.startedAtMs != "string" || !0) || value.startedAtMs === null && (typeof value.startedAtMs != "string" || !0)) && [
		typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && "id" in value && "type" in value && (value.clientId === void 0 || !("clientId" in value) || typeof value.clientId == "string" || value.clientId === null) && Array.isArray(value.content) && value.content.every((unique_2, index) => check_8(unique_2)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "userMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "fragments" in value && "id" in value && "type" in value && Array.isArray(value.fragments) && value.fragments.every((unique_5, index) => check_12(unique_5)) && typeof value.id == "string" && typeof value.type == "string" && value.type === "hookPrompt",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && (value.delivery === void 0 || !("delivery" in value) || check_13(value.delivery) || value.delivery === null) && typeof value.id == "string" && (value.memoryCitation === void 0 || !("memoryCitation" in value) || check_14(value.memoryCitation) || value.memoryCitation === null) && (value.moderation === void 0 || !("moderation" in value) || check_16(value.moderation) || value.moderation === null) && (value.phase === void 0 || !("phase" in value) || check_23(value.phase) || value.phase === null) && (value.questions === void 0 || !("questions" in value) || Array.isArray(value.questions) && value.questions.every((unique_13, index) => check_24(unique_13)) || value.questions === null && (!Array.isArray(value.questions) || value.questions.every((unique_18, index) => check_24(unique_18)))) && typeof value.text == "string" && typeof value.type == "string" && value.type === "agentMessage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "name" in value && "output" in value && "type" in value && typeof value.id == "string" && typeof value.name == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_25(value.output) && typeof value.type == "string" && value.type === "functionCallOutput",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "text" in value && "type" in value && typeof value.id == "string" && typeof value.text == "string" && typeof value.type == "string" && value.type === "plan",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && (value.content === void 0 || !("content" in value) || Array.isArray(value.content) && value.content.every((unique_21, index) => typeof unique_21 == "string")) && typeof value.id == "string" && (value.summary === void 0 || !("summary" in value) || Array.isArray(value.summary) && value.summary.every((unique_22, index) => typeof unique_22 == "string")) && typeof value.type == "string" && value.type === "reasoning",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "commandActions" in value && "cwd" in value && "id" in value && "status" in value && "type" in value && (value.aggregatedOutput === void 0 || !("aggregatedOutput" in value) || typeof value.aggregatedOutput == "string" || value.aggregatedOutput === null) && typeof value.command == "string" && Array.isArray(value.commandActions) && value.commandActions.every((unique_23, index) => check_27(unique_23)) && check_28(value.cwd) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.exitCode === void 0 || !("exitCode" in value) || Number.isInteger(value.exitCode) && (typeof value.exitCode != "string" || !0) || value.exitCode === null && (typeof value.exitCode != "string" || !0)) && typeof value.id == "string" && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.processId === void 0 || !("processId" in value) || typeof value.processId == "string" || value.processId === null) && (value.scriptPath === void 0 || !("scriptPath" in value) || typeof value.scriptPath == "string" || value.scriptPath === null) && (value.source === void 0 || !("source" in value) || check_29(value.source)) && check_30(value.status) && typeof value.type == "string" && value.type === "commandExecution",
		typeof value == "object" && value !== null && !Array.isArray(value) && "changes" in value && "id" in value && "status" in value && "type" in value && Array.isArray(value.changes) && value.changes.every((unique_25, index) => check_31(unique_25)) && typeof value.id == "string" && check_33(value.status) && typeof value.type == "string" && value.type === "fileChange",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "server" in value && "status" in value && "tool" in value && "type" in value && (value.appContext === void 0 || !("appContext" in value) || check_34(value.appContext) || value.appContext === null) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && (value.environmentId === void 0 || !("environmentId" in value) || typeof value.environmentId == "string" || value.environmentId === null) && (value.error === void 0 || !("error" in value) || check_35(value.error) || value.error === null) && typeof value.id == "string" && (value.mcpAppResourceUri === void 0 || !("mcpAppResourceUri" in value) || typeof value.mcpAppResourceUri == "string" || value.mcpAppResourceUri === null) && (value.mcpAppUi === void 0 || !("mcpAppUi" in value) || check_36(value.mcpAppUi) || value.mcpAppUi === null) && (value.pluginId === void 0 || !("pluginId" in value) || typeof value.pluginId == "string" || value.pluginId === null) && (value.readOnlyHint === void 0 || !("readOnlyHint" in value) || typeof value.readOnlyHint == "boolean" || value.readOnlyHint === null) && (value.result === void 0 || !("result" in value) || check_38(value.result) || value.result === null) && typeof value.server == "string" && check_39(value.status) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "mcpToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "arguments" in value && "id" in value && "status" in value && "tool" in value && "type" in value && (value.contentItems === void 0 || !("contentItems" in value) || Array.isArray(value.contentItems) && value.contentItems.every((unique_28, index) => check_40(unique_28)) || value.contentItems === null && (!Array.isArray(value.contentItems) || value.contentItems.every((unique_30, index) => check_40(unique_30)))) && (value.durationMs === void 0 || !("durationMs" in value) || Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) || value.durationMs === null && (typeof value.durationMs != "string" || !0)) && typeof value.id == "string" && (value.namespace === void 0 || !("namespace" in value) || typeof value.namespace == "string" || value.namespace === null) && check_41(value.status) && (value.success === void 0 || !("success" in value) || typeof value.success == "boolean" || value.success === null) && typeof value.tool == "string" && typeof value.type == "string" && value.type === "dynamicToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentsStates" in value && "id" in value && "receiverThreadIds" in value && "senderThreadId" in value && "status" in value && "tool" in value && "type" in value && typeof value.agentsStates == "object" && value.agentsStates !== null && !Array.isArray(value.agentsStates) && Object.getOwnPropertyNames(value.agentsStates).every((unique_31, unique_32) => External[1].test(unique_31) || !1) && Object.entries(value.agentsStates).every(([unique_33, unique_34], _) => !External[2].test(unique_33) || check_42(unique_34)) && typeof value.id == "string" && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.prompt === void 0 || !("prompt" in value) || typeof value.prompt == "string" || value.prompt === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_44(value.reasoningEffort) || value.reasoningEffort === null) && Array.isArray(value.receiverThreadIds) && value.receiverThreadIds.every((unique_35, index) => typeof unique_35 == "string") && typeof value.senderThreadId == "string" && check_45(value.status) && check_46(value.tool) && typeof value.type == "string" && value.type === "collabAgentToolCall",
		typeof value == "object" && value !== null && !Array.isArray(value) && "agentPath" in value && "agentThreadId" in value && "id" in value && "kind" in value && "type" in value && typeof value.agentPath == "string" && typeof value.agentThreadId == "string" && typeof value.id == "string" && check_47(value.kind) && (value.model === void 0 || !("model" in value) || typeof value.model == "string" || value.model === null) && (value.reasoningEffort === void 0 || !("reasoningEffort" in value) || check_44(value.reasoningEffort) || value.reasoningEffort === null) && typeof value.type == "string" && value.type === "subAgentActivity",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "query" in value && "type" in value && (value.action === void 0 || !("action" in value) || check_48(value.action) || value.action === null) && typeof value.id == "string" && typeof value.query == "string" && (value.results === void 0 || !("results" in value) || Array.isArray(value.results) && value.results.every((unique_39, index) => !0) || value.results === null && (!Array.isArray(value.results) || value.results.every((unique_40, index) => !0))) && typeof value.type == "string" && value.type === "webSearch",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "path" in value && "type" in value && typeof value.id == "string" && check_28(value.path) && typeof value.type == "string" && value.type === "imageView",
		typeof value == "object" && value !== null && !Array.isArray(value) && "durationMs" in value && "id" in value && "type" in value && Number.isInteger(value.durationMs) && (typeof value.durationMs != "string" || !0) && (!(Number.isFinite(value.durationMs) || typeof value.durationMs == "bigint") || value.durationMs >= 0) && typeof value.id == "string" && typeof value.type == "string" && value.type === "sleep",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "status" in value && "type" in value && (value.failure === void 0 || !("failure" in value) || check_49(value.failure) || value.failure === null) && (value.generationId === void 0 || !("generationId" in value) || typeof value.generationId == "string" || value.generationId === null) && typeof value.id == "string" && (value.inputImages === void 0 || !("inputImages" in value) || Array.isArray(value.inputImages) && value.inputImages.every((unique_42, index) => check_50(unique_42))) && (value.revisedPrompt === void 0 || !("revisedPrompt" in value) || typeof value.revisedPrompt == "string" || value.revisedPrompt === null) && (value.savedPath === void 0 || !("savedPath" in value) || check_51(value.savedPath) || value.savedPath === null) && typeof value.status == "string" && (value.transparentBackground === void 0 || !("transparentBackground" in value) || typeof value.transparentBackground == "boolean" || value.transparentBackground === null) && typeof value.type == "string" && value.type === "imageGeneration" && (typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "result" in value && typeof value.result == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "enteredReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "review" in value && "type" in value && typeof value.id == "string" && typeof value.review == "string" && typeof value.type == "string" && value.type === "exitedReviewMode",
		typeof value == "object" && value !== null && !Array.isArray(value) && "id" in value && "type" in value && typeof value.id == "string" && typeof value.type == "string" && value.type === "contextCompaction"
	].reduce((result, unique_1, _) => unique_1 === !0 ? result + 1 : result, 0) === 1, check_8 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && (value.text_elements === void 0 || !("text_elements" in value) || Array.isArray(value.text_elements) && value.text_elements.every((unique_4, index) => check_9(unique_4))) && typeof value.type == "string" && value.type === "text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.path == "string" && typeof value.type == "string" && value.type === "localImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "url" in value && typeof value.url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "fileId" in value && typeof value.fileId == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "type" in value && typeof value.path == "string" && typeof value.type == "string" && value.type === "localAudio",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "skill",
		typeof value == "object" && value !== null && !Array.isArray(value) && "name" in value && "path" in value && "type" in value && typeof value.name == "string" && typeof value.path == "string" && typeof value.type == "string" && value.type === "mention"
	].reduce((result, unique_3, _) => unique_3 === !0 ? result + 1 : result, 0) === 1, check_9 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "byteRange" in value && check_10(value.byteRange) && (value.placeholder === void 0 || !("placeholder" in value) || typeof value.placeholder == "string" || value.placeholder === null), check_10 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "end" in value && "start" in value && Number.isInteger(value.end) && (typeof value.end != "string" || !0) && (!(Number.isFinite(value.end) || typeof value.end == "bigint") || value.end >= 0) && Number.isInteger(value.start) && (typeof value.start != "string" || !0) && (!(Number.isFinite(value.start) || typeof value.start == "bigint") || value.start >= 0), check_11 = (value) => typeof value == "string" && (value === "auto" || value === "low" || value === "high" || value === "original"), check_12 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "hookRunId" in value && "text" in value && typeof value.hookRunId == "string" && typeof value.text == "string", check_13 = (value) => typeof value == "string" && value === "async", check_14 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "entries" in value && "threadIds" in value && Array.isArray(value.entries) && value.entries.every((unique_6, index) => check_15(unique_6)) && Array.isArray(value.threadIds) && value.threadIds.every((unique_7, index) => typeof unique_7 == "string"), check_15 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "lineEnd" in value && "lineStart" in value && "note" in value && "path" in value && Number.isInteger(value.lineEnd) && (typeof value.lineEnd != "string" || !0) && (!(Number.isFinite(value.lineEnd) || typeof value.lineEnd == "bigint") || value.lineEnd >= 0) && Number.isInteger(value.lineStart) && (typeof value.lineStart != "string" || !0) && (!(Number.isFinite(value.lineStart) || typeof value.lineStart == "bigint") || value.lineStart >= 0) && typeof value.note == "string" && typeof value.path == "string", check_16 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "moderated" in value && (value.display === void 0 || !("display" in value) || check_17(value.display) || value.display === null) && typeof value.moderated == "boolean", check_17 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "trustedContacts" in value && "version" in value && (value.annotation === void 0 || !("annotation" in value) || check_18(value.annotation) || value.annotation === null) && typeof value.mode == "string" && value.mode === "show" && check_20(value.trustedContacts) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "replacement" in value && "version" in value && typeof value.mode == "string" && value.mode === "hide" && check_21(value.replacement) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1,
		typeof value == "object" && value !== null && !Array.isArray(value) && "mode" in value && "reason" in value && "version" in value && typeof value.mode == "string" && value.mode === "block" && check_22(value.reason) && Number.isInteger(value.version) && (typeof value.version != "string" || !0) && (!(Number.isFinite(value.version) || typeof value.version == "bigint") || value.version >= 0) && value.version === 1
	].reduce((result, unique_8, _) => unique_8 === !0 ? result + 1 : result, 0) === 1, check_18 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "subject" in value && typeof value.kind == "string" && value.kind === "wellbeingHelpline" && check_19(value.subject)].reduce((result, unique_9, _) => unique_9 === !0 ? result + 1 : result, 0) === 1, check_19 = (value) => typeof value == "string" && (value === "answer" || value === "prompt"), check_20 = (value) => typeof value == "string" && (value === "check" || value === "skip"), check_21 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "wellbeingPromptHelpline"].reduce((result, unique_10, _) => unique_10 === !0 ? result + 1 : result, 0) === 1, check_22 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && "protectionType" in value && typeof value.kind == "string" && value.kind === "protection" && typeof value.protectionType == "string", typeof value == "object" && value !== null && !Array.isArray(value) && "kind" in value && typeof value.kind == "string" && value.kind === "cyber" && (value.trustedAccess === void 0 || !("trustedAccess" in value) || typeof value.trustedAccess == "boolean" || value.trustedAccess === null)].reduce((result, unique_11, _) => unique_11 === !0 ? result + 1 : result, 0) === 1, check_23 = (value) => [
		typeof value == "string" && value === "commentary",
		typeof value == "string" && value === "partial_answer",
		typeof value == "string" && value === "final_answer"
	].reduce((result, unique_12, _) => unique_12 === !0 ? result + 1 : result, 0) === 1, check_24 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "title" in value && Object.getOwnPropertyNames(value).every((unique_14, unique_15) => External[0].test(unique_14) || !1) && (value.options === void 0 || !("options" in value) || Array.isArray(value.options) && value.options.every((unique_16, index) => typeof unique_16 == "string") || value.options === null && (!Array.isArray(value.options) || value.options.every((unique_17, index) => typeof unique_17 == "string"))) && typeof value.title == "string", check_25 = (value) => Array.isArray(value) && value.every((unique_19, index) => check_26(unique_19)) || typeof value == "string", check_26 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "input_text",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.detail === void 0 || !("detail" in value) || check_11(value.detail) || value.detail === null) && typeof value.type == "string" && value.type === "input_image" && (typeof value == "object" && value !== null && !Array.isArray(value) && "image_url" in value && typeof value.image_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "input_audio" && (typeof value == "object" && value !== null && !Array.isArray(value) && "audio_url" in value && typeof value.audio_url == "string" || typeof value == "object" && value !== null && !Array.isArray(value) && "file_id" in value && typeof value.file_id == "string"),
		typeof value == "object" && value !== null && !Array.isArray(value) && "encrypted_content" in value && "type" in value && typeof value.encrypted_content == "string" && typeof value.type == "string" && value.type === "encrypted_content"
	].reduce((result, unique_20, _) => unique_20 === !0 ? result + 1 : result, 0) === 1, check_27 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "name" in value && "path" in value && "type" in value && typeof value.command == "string" && typeof value.name == "string" && check_28(value.path) && typeof value.type == "string" && value.type === "read",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && typeof value.type == "string" && value.type === "listFiles",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && (value.path === void 0 || !("path" in value) || typeof value.path == "string" || value.path === null) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "command" in value && "type" in value && typeof value.command == "string" && typeof value.type == "string" && value.type === "unknown"
	].reduce((result, unique_24, _) => unique_24 === !0 ? result + 1 : result, 0) === 1, check_28 = (value) => typeof value == "string", check_29 = (value) => typeof value == "string" && (value === "agent" || value === "userShell" || value === "unifiedExecStartup" || value === "unifiedExecInteraction"), check_30 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_31 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "diff" in value && "kind" in value && "path" in value && typeof value.diff == "string" && check_32(value.kind) && typeof value.path == "string", check_32 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "add",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "delete",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.move_path === void 0 || !("move_path" in value) || typeof value.move_path == "string" || value.move_path === null) && typeof value.type == "string" && value.type === "update"
	].reduce((result, unique_26, _) => unique_26 === !0 ? result + 1 : result, 0) === 1, check_33 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "declined"), check_34 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "connectorId" in value && (value.actionName === void 0 || !("actionName" in value) || typeof value.actionName == "string" || value.actionName === null) && (value.appName === void 0 || !("appName" in value) || typeof value.appName == "string" || value.appName === null) && typeof value.connectorId == "string" && (value.linkId === void 0 || !("linkId" in value) || typeof value.linkId == "string" || value.linkId === null) && (value.resourceUri === void 0 || !("resourceUri" in value) || typeof value.resourceUri == "string" || value.resourceUri === null), check_35 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "message" in value && typeof value.message == "string", check_36 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "preferredModelDisplayMode" in value && "resourceUri" in value && check_37(value.preferredModelDisplayMode) && typeof value.resourceUri == "string", check_37 = (value) => typeof value == "string" && (value === "inline" || value === "fullscreen"), check_38 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "content" in value && (value._meta === void 0 || !("_meta" in value) || !0) && Array.isArray(value.content) && value.content.every((unique_27, index) => !0) && (value.structuredContent === void 0 || !("structuredContent" in value) || !0), check_39 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_40 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "text" in value && "type" in value && typeof value.text == "string" && typeof value.type == "string" && value.type === "inputText",
		typeof value == "object" && value !== null && !Array.isArray(value) && "imageUrl" in value && "type" in value && typeof value.imageUrl == "string" && typeof value.type == "string" && value.type === "inputImage",
		typeof value == "object" && value !== null && !Array.isArray(value) && "audioUrl" in value && "type" in value && typeof value.audioUrl == "string" && typeof value.type == "string" && value.type === "inputAudio"
	].reduce((result, unique_29, _) => unique_29 === !0 ? result + 1 : result, 0) === 1, check_41 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed"), check_42 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "status" in value && (value.message === void 0 || !("message" in value) || typeof value.message == "string" || value.message === null) && check_43(value.status), check_43 = (value) => typeof value == "string" && (value === "pendingInit" || value === "running" || value === "interrupted" || value === "completed" || value === "errored" || value === "shutdown" || value === "notFound"), check_44 = (value) => typeof value == "string" && (value.length >= 2 || value.length >= 1 && CodePointCount(value) >= 1), check_45 = (value) => typeof value == "string" && (value === "inProgress" || value === "completed" || value === "failed" || value === "interrupted"), check_46 = (value) => typeof value == "string" && (value === "spawnAgent" || value === "sendInput" || value === "resumeAgent" || value === "wait" || value === "closeAgent" || value === "sendMessage" || value === "followupTask" || value === "interruptAgent" || value === "listAgents"), check_47 = (value) => typeof value == "string" && (value === "started" || value === "interacted" || value === "interrupted" || value === "completed"), check_48 = (value) => [
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.queries === void 0 || !("queries" in value) || Array.isArray(value.queries) && value.queries.every((unique_37, index) => typeof unique_37 == "string") || value.queries === null && (!Array.isArray(value.queries) || value.queries.every((unique_38, index) => typeof unique_38 == "string"))) && (value.query === void 0 || !("query" in value) || typeof value.query == "string" || value.query === null) && typeof value.type == "string" && value.type === "search",
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "openPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && (value.pattern === void 0 || !("pattern" in value) || typeof value.pattern == "string" || value.pattern === null) && typeof value.type == "string" && value.type === "findInPage" && (value.url === void 0 || !("url" in value) || typeof value.url == "string" || value.url === null),
		typeof value == "object" && value !== null && !Array.isArray(value) && "type" in value && typeof value.type == "string" && value.type === "other"
	].reduce((result, unique_36, _) => unique_36 === !0 ? result + 1 : result, 0) === 1, check_49 = (value) => [typeof value == "object" && value !== null && !Array.isArray(value) && "limitId" in value && "type" in value && typeof value.limitId == "string" && (value.resetsAt === void 0 || !("resetsAt" in value) || Number.isInteger(value.resetsAt) && (typeof value.resetsAt != "string" || !0) || value.resetsAt === null && (typeof value.resetsAt != "string" || !0)) && typeof value.type == "string" && value.type === "usageLimitExceeded"].reduce((result, unique_41, _) => unique_41 === !0 ? result + 1 : result, 0) === 1, check_50 = (value) => typeof value == "object" && value !== null && !Array.isArray(value) && "path" in value && "sha256" in value && check_51(value.path) && typeof value.sha256 == "string", check_51 = (value) => typeof value == "string", check_52 = (value) => [
		typeof value == "string" && value === "notLoaded",
		typeof value == "string" && value === "summary",
		typeof value == "string" && value === "full"
	].reduce((result, unique_43, _) => unique_43 === !0 ? result + 1 : result, 0) === 1, check_53 = (value) => typeof value == "string" && (value === "completed" || value === "interrupted" || value === "failed" || value === "inProgress");
	return (value) => check_0(value);
})();
// extensions/codex/src/app-server/protocol-validators.generated.json
var context = { "https://openclaw.invalid/codex/v2/CodexAppServerProtocolDefinitions.json": {
	"$schema": "http://json-schema.org/draft-07/schema#",
	"definitions": {
		"AbsolutePathBuf": {
			"description": "A path that is guaranteed to be absolute and normalized (though it is not guaranteed to be canonicalized or exist on the filesystem).\n\nIMPORTANT: When deserializing an `AbsolutePathBuf`, a base path must be set using [AbsolutePathBufGuard::new]. If no base path is set, the deserialization will fail unless the path being deserialized is already absolute.",
			"type": "string"
		},
		"Account": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["apiKey"],
					"title": "ApiKeyAccountType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "ApiKeyAccount",
				"type": "object"
			},
			{
				"properties": {
					"email": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"planType": { "$ref": "#/definitions/PlanType" },
					"type": {
						"enum": ["chatgpt"],
						"title": "ChatgptAccountType",
						"type": "string"
					},
					"workspaceName": { "anyOf": [{
						"description": "Display name of the selected ChatGPT workspace, when available.",
						"type": "string"
					}, {
						"description": "Display name of the selected ChatGPT workspace, when available.",
						"type": "null"
					}] }
				},
				"required": [
					"email",
					"planType",
					"type"
				],
				"title": "ChatgptAccount",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["amazonBedrock"],
						"title": "AmazonBedrockAccountType",
						"type": "string"
					},
					"usesCodexManagedCredentials": {
						"default": false,
						"type": "boolean"
					}
				},
				"required": ["type"],
				"title": "AmazonBedrockAccount",
				"type": "object"
			},
			{
				"description": "Google Cloud Vertex AI with externally managed credentials.",
				"properties": { "type": {
					"enum": ["gcp"],
					"title": "GcpAccountType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "GcpAccount",
				"type": "object"
			}
		] },
		"AccountRoutingOverride": {
			"description": "Backend routing policy. Wire values match the accounts/check contract.",
			"enum": [
				"NO_CONSTRAINT",
				"us",
				"us_cr"
			],
			"type": "string"
		},
		"ActivePermissionProfile": {
			"properties": {
				"extends": { "anyOf": [{
					"default": null,
					"description": "Parent profile identifier from the selected permissions profile's `extends` setting, when present.",
					"type": "string"
				}, {
					"default": null,
					"description": "Parent profile identifier from the selected permissions profile's `extends` setting, when present.",
					"type": "null"
				}] },
				"id": {
					"description": "Identifier from `default_permissions` or the implicit built-in default, such as `:workspace` or a user-defined `[permissions.<id>]` profile.",
					"type": "string"
				}
			},
			"required": ["id"],
			"type": "object"
		},
		"AgentMessageDelivery": {
			"enum": ["async"],
			"type": "string"
		},
		"AgentMessageDisplay": {
			"description": "How Chat should present a recovered answer.",
			"oneOf": [
				{
					"properties": {
						"annotation": { "anyOf": [{ "$ref": "#/definitions/AnswerAnnotation" }, { "type": "null" }] },
						"mode": {
							"enum": ["show"],
							"type": "string"
						},
						"trustedContacts": { "$ref": "#/definitions/TrustedContacts" },
						"version": {
							"enum": [1],
							"format": "uint8",
							"minimum": 0,
							"type": "integer"
						}
					},
					"required": [
						"mode",
						"trustedContacts",
						"version"
					],
					"type": "object"
				},
				{
					"properties": {
						"mode": {
							"enum": ["hide"],
							"type": "string"
						},
						"replacement": { "$ref": "#/definitions/AnswerReplacement" },
						"version": {
							"enum": [1],
							"format": "uint8",
							"minimum": 0,
							"type": "integer"
						}
					},
					"required": [
						"mode",
						"replacement",
						"version"
					],
					"type": "object"
				},
				{
					"properties": {
						"mode": {
							"enum": ["block"],
							"type": "string"
						},
						"reason": { "$ref": "#/definitions/BlockReason" },
						"version": {
							"enum": [1],
							"format": "uint8",
							"minimum": 0,
							"type": "integer"
						}
					},
					"required": [
						"mode",
						"reason",
						"version"
					],
					"type": "object"
				}
			]
		},
		"AgentMessageModeration": {
			"properties": {
				"display": { "anyOf": [{ "$ref": "#/definitions/AgentMessageDisplay" }, { "type": "null" }] },
				"moderated": { "type": "boolean" }
			},
			"required": ["moderated"],
			"type": "object"
		},
		"AgentPath": { "type": "string" },
		"AnswerAnnotation": { "oneOf": [{
			"properties": {
				"kind": {
					"enum": ["wellbeingHelpline"],
					"type": "string"
				},
				"subject": { "$ref": "#/definitions/HelplineSubject" }
			},
			"required": ["kind", "subject"],
			"type": "object"
		}] },
		"AnswerReplacement": { "oneOf": [{
			"properties": { "kind": {
				"enum": ["wellbeingPromptHelpline"],
				"type": "string"
			} },
			"required": ["kind"],
			"title": "WellbeingPromptHelplineAnswerReplacement",
			"type": "object"
		}] },
		"ApprovalsReviewer": {
			"description": "Configures who approval requests are routed to for review. Examples include sandbox escapes, blocked network access, MCP approval prompts, and ARC escalations. Defaults to `user`. `auto_review` uses a carefully prompted subagent to gather relevant context and apply a risk-based decision framework before approving or denying the request. The legacy value `guardian_subagent` is accepted for compatibility.",
			"enum": [
				"user",
				"auto_review",
				"guardian_subagent"
			],
			"type": "string"
		},
		"AskForApproval": { "oneOf": [{
			"additionalProperties": false,
			"properties": { "granular": {
				"properties": {
					"mcp_elicitations": { "type": "boolean" },
					"request_permissions": {
						"default": false,
						"type": "boolean"
					},
					"rules": { "type": "boolean" },
					"sandbox_approval": { "type": "boolean" },
					"skill_approval": {
						"default": false,
						"type": "boolean"
					}
				},
				"required": [
					"mcp_elicitations",
					"rules",
					"sandbox_approval"
				],
				"type": "object"
			} },
			"required": ["granular"],
			"title": "GranularAskForApproval",
			"type": "object"
		}, {
			"enum": [
				"untrusted",
				"on-request",
				"never"
			],
			"type": "string"
		}] },
		"AsyncUserInputQuestion": {
			"additionalProperties": false,
			"properties": {
				"options": { "anyOf": [{
					"items": { "type": "string" },
					"type": "array"
				}, {
					"items": { "type": "string" },
					"type": "null"
				}] },
				"title": { "type": "string" }
			},
			"required": ["title"],
			"type": "object"
		},
		"BlockReason": { "oneOf": [{
			"properties": {
				"kind": {
					"enum": ["protection"],
					"type": "string"
				},
				"protectionType": {
					"description": "Identifies the same moderation row that Chat writes on the live path.",
					"type": "string"
				}
			},
			"required": ["kind", "protectionType"],
			"type": "object"
		}, {
			"properties": {
				"kind": {
					"enum": ["cyber"],
					"type": "string"
				},
				"trustedAccess": { "anyOf": [{ "type": "boolean" }, { "type": "null" }] }
			},
			"required": ["kind"],
			"title": "KindBlockReason",
			"type": "object"
		}] },
		"ByteRange": {
			"properties": {
				"end": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				},
				"start": {
					"format": "uint",
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": ["end", "start"],
			"type": "object"
		},
		"CodexErrorInfo": {
			"anyOf": [
				{
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				},
				{
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				},
				{
					"enum": [
						"contextWindowExceeded",
						"sessionBudgetExceeded",
						"usageLimitExceeded",
						"apiKeySpendLimitExceeded",
						"projectSpendLimitExceeded",
						"organizationSpendLimitExceeded",
						"rateLimitExceeded",
						"flexUnavailable",
						"serverOverloaded",
						"modelNotFound",
						"policyCapacityUnavailable",
						"cyberPolicy",
						"bioPolicy",
						"misalignmentPolicyViolation",
						"tooManyDenials",
						"internalServerError",
						"unauthorized",
						"badRequest",
						"threadRollbackFailed",
						"sandboxError",
						"other"
					],
					"type": "string"
				},
				{
					"description": "The workspace's inference hook explicitly denied this request.",
					"enum": ["inferenceHookDenied"],
					"type": "string"
				},
				{ "anyOf": [{ "type": "string" }, { "type": "object" }] }
			],
			"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
			"allOf": [
				{ "anyOf": [{ "not": {
					"type": "object",
					"required": ["httpConnectionFailed"]
				} }, {
					"additionalProperties": false,
					"properties": { "httpConnectionFailed": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["httpConnectionFailed"],
					"title": "HttpConnectionFailedCodexErrorInfo",
					"type": "object"
				}] },
				{ "anyOf": [{ "not": {
					"type": "object",
					"required": ["responseStreamConnectionFailed"]
				} }, {
					"additionalProperties": false,
					"description": "Failed to connect to the response SSE stream.",
					"properties": { "responseStreamConnectionFailed": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseStreamConnectionFailed"],
					"title": "ResponseStreamConnectionFailedCodexErrorInfo",
					"type": "object"
				}] },
				{ "anyOf": [{ "not": {
					"type": "object",
					"required": ["responseStreamDisconnected"]
				} }, {
					"additionalProperties": false,
					"description": "The response SSE stream disconnected in the middle of a turn before completion.",
					"properties": { "responseStreamDisconnected": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseStreamDisconnected"],
					"title": "ResponseStreamDisconnectedCodexErrorInfo",
					"type": "object"
				}] },
				{ "anyOf": [{ "not": {
					"type": "object",
					"required": ["responseTooManyFailedAttempts"]
				} }, {
					"additionalProperties": false,
					"description": "Reached the retry limit for responses.",
					"properties": { "responseTooManyFailedAttempts": {
						"properties": { "httpStatusCode": { "anyOf": [{
							"format": "uint16",
							"minimum": 0,
							"type": "integer"
						}, {
							"format": "uint16",
							"minimum": 0,
							"type": "null"
						}] } },
						"type": "object"
					} },
					"required": ["responseTooManyFailedAttempts"],
					"title": "ResponseTooManyFailedAttemptsCodexErrorInfo",
					"type": "object"
				}] },
				{ "anyOf": [{ "not": {
					"type": "object",
					"required": ["activeTurnNotSteerable"]
				} }, {
					"additionalProperties": false,
					"description": "Returned when `turn/start` or `turn/steer` is submitted while the current active turn cannot accept same-turn steering, for example `/review` or manual `/compact`.",
					"properties": { "activeTurnNotSteerable": {
						"properties": { "turnKind": { "$ref": "#/definitions/NonSteerableTurnKind" } },
						"required": ["turnKind"],
						"type": "object"
					} },
					"required": ["activeTurnNotSteerable"],
					"title": "ActiveTurnNotSteerableCodexErrorInfo",
					"type": "object"
				}] }
			]
		},
		"CollabAgentState": {
			"properties": {
				"message": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"status": { "$ref": "#/definitions/CollabAgentStatus" }
			},
			"required": ["status"],
			"type": "object"
		},
		"CollabAgentStatus": {
			"enum": [
				"pendingInit",
				"running",
				"interrupted",
				"completed",
				"errored",
				"shutdown",
				"notFound"
			],
			"type": "string"
		},
		"CollabAgentTool": {
			"enum": [
				"spawnAgent",
				"sendInput",
				"resumeAgent",
				"wait",
				"closeAgent",
				"sendMessage",
				"followupTask",
				"interruptAgent",
				"listAgents"
			],
			"type": "string"
		},
		"CollabAgentToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"interrupted"
			],
			"type": "string"
		},
		"CollaborationMode": {
			"description": "Collaboration mode for a Codex session.",
			"properties": {
				"mode": { "$ref": "#/definitions/ModeKind" },
				"settings": { "$ref": "#/definitions/Settings" }
			},
			"required": ["mode", "settings"],
			"type": "object"
		},
		"CommandAction": { "oneOf": [
			{
				"properties": {
					"command": { "type": "string" },
					"name": { "type": "string" },
					"path": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": {
						"enum": ["read"],
						"title": "ReadCommandActionType",
						"type": "string"
					}
				},
				"required": [
					"command",
					"name",
					"path",
					"type"
				],
				"title": "ReadCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"type": {
						"enum": ["listFiles"],
						"title": "ListFilesCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "ListFilesCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"path": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"query": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"type": {
						"enum": ["search"],
						"title": "SearchCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "SearchCommandAction",
				"type": "object"
			},
			{
				"properties": {
					"command": { "type": "string" },
					"type": {
						"enum": ["unknown"],
						"title": "UnknownCommandActionType",
						"type": "string"
					}
				},
				"required": ["command", "type"],
				"title": "UnknownCommandAction",
				"type": "object"
			}
		] },
		"CommandExecutionSource": {
			"enum": [
				"agent",
				"userShell",
				"unifiedExecStartup",
				"unifiedExecInteraction"
			],
			"type": "string"
		},
		"CommandExecutionStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"CyberAccessProgram": {
			"description": "Requested cyber treatment for an OpenAI model turn. Authorization and model-tier restrictions remain server-owned.",
			"enum": [
				"standard",
				"daybreakBlue",
				"daybreakRed"
			],
			"type": "string"
		},
		"DaybreakAvailability": {
			"description": "Server-resolved Daybreak availability for this caller and model.",
			"enum": [
				"available",
				"enrollmentRequired",
				"unavailableForModel",
				"default"
			],
			"type": "string"
		},
		"DynamicToolCallOutputContentItem": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"type": {
						"enum": ["inputText"],
						"title": "InputTextDynamicToolCallOutputContentItemType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "InputTextDynamicToolCallOutputContentItem",
				"type": "object"
			},
			{
				"properties": {
					"imageUrl": { "type": "string" },
					"type": {
						"enum": ["inputImage"],
						"title": "InputImageDynamicToolCallOutputContentItemType",
						"type": "string"
					}
				},
				"required": ["imageUrl", "type"],
				"title": "InputImageDynamicToolCallOutputContentItem",
				"type": "object"
			},
			{
				"properties": {
					"audioUrl": { "type": "string" },
					"type": {
						"enum": ["inputAudio"],
						"title": "InputAudioDynamicToolCallOutputContentItemType",
						"type": "string"
					}
				},
				"required": ["audioUrl", "type"],
				"title": "InputAudioDynamicToolCallOutputContentItem",
				"type": "object"
			}
		] },
		"DynamicToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"FileUpdateChange": {
			"properties": {
				"diff": { "type": "string" },
				"kind": { "$ref": "#/definitions/PatchChangeKind" },
				"path": { "type": "string" }
			},
			"required": [
				"diff",
				"kind",
				"path"
			],
			"type": "object"
		},
		"FunctionCallOutputBody": { "anyOf": [{
			"items": { "$ref": "#/definitions/FunctionCallOutputContentItem" },
			"type": "array"
		}, { "type": "string" }] },
		"FunctionCallOutputContentItem": {
			"description": "Responses API compatible content items that can be returned by a tool call. This is a subset of ContentItem with the types we support as function call outputs.",
			"oneOf": [
				{
					"properties": {
						"text": { "type": "string" },
						"type": {
							"enum": ["input_text"],
							"title": "InputTextFunctionCallOutputContentItemType",
							"type": "string"
						}
					},
					"required": ["text", "type"],
					"title": "InputTextFunctionCallOutputContentItem",
					"type": "object"
				},
				{
					"anyOf": [{
						"properties": { "image_url": { "type": "string" } },
						"required": ["image_url"],
						"title": "ImageUrlFunctionCallOutputContentItem",
						"type": "object"
					}, {
						"properties": { "file_id": { "type": "string" } },
						"required": ["file_id"],
						"title": "FileIdFunctionCallOutputContentItem",
						"type": "object"
					}],
					"properties": {
						"detail": { "anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }] },
						"type": {
							"enum": ["input_image"],
							"title": "InputImageFunctionCallOutputContentItemType",
							"type": "string"
						}
					},
					"required": ["type"],
					"title": "InputImageFunctionCallOutputContentItem",
					"type": "object"
				},
				{
					"anyOf": [{
						"properties": { "audio_url": { "type": "string" } },
						"required": ["audio_url"],
						"title": "AudioUrlFunctionCallOutputContentItem",
						"type": "object"
					}, {
						"properties": { "file_id": { "type": "string" } },
						"required": ["file_id"],
						"title": "FileIdFunctionCallOutputContentItem",
						"type": "object"
					}],
					"description": "Inline audio data or an uploaded file loaded by the Responses API.",
					"properties": { "type": {
						"enum": ["input_audio"],
						"title": "InputAudioFunctionCallOutputContentItemType",
						"type": "string"
					} },
					"required": ["type"],
					"title": "InputAudioFunctionCallOutputContentItem",
					"type": "object"
				},
				{
					"properties": {
						"encrypted_content": { "type": "string" },
						"type": {
							"enum": ["encrypted_content"],
							"title": "EncryptedContentFunctionCallOutputContentItemType",
							"type": "string"
						}
					},
					"required": ["encrypted_content", "type"],
					"title": "EncryptedContentFunctionCallOutputContentItem",
					"type": "object"
				}
			]
		},
		"GitInfo": {
			"properties": {
				"branch": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"originUrl": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"sha": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
			},
			"type": "object"
		},
		"HelplineSubject": {
			"enum": ["answer", "prompt"],
			"type": "string"
		},
		"HookPromptFragment": {
			"properties": {
				"hookRunId": { "type": "string" },
				"text": { "type": "string" }
			},
			"required": ["hookRunId", "text"],
			"type": "object"
		},
		"ImageDetail": {
			"enum": [
				"auto",
				"low",
				"high",
				"original"
			],
			"type": "string"
		},
		"ImageGenerationFailure": { "oneOf": [{
			"properties": {
				"limitId": { "type": "string" },
				"resetsAt": { "anyOf": [{
					"format": "int64",
					"type": "integer"
				}, {
					"format": "int64",
					"type": "null"
				}] },
				"type": {
					"enum": ["usageLimitExceeded"],
					"title": "UsageLimitExceededImageGenerationFailureType",
					"type": "string"
				}
			},
			"required": ["limitId", "type"],
			"title": "UsageLimitExceededImageGenerationFailure",
			"type": "object"
		}] },
		"ImageGenerationInputImage": {
			"description": "A local image file successfully read for this exact image-generation request.",
			"properties": {
				"path": { "$ref": "#/definitions/AbsolutePathBuf" },
				"sha256": {
					"description": "Lowercase SHA-256 of the file bytes read before image normalization.",
					"type": "string"
				}
			},
			"required": ["path", "sha256"],
			"type": "object"
		},
		"InputModality": {
			"description": "Canonical user-input modality tags advertised by a model.",
			"oneOf": [
				{
					"description": "Plain text turns and tool payloads.",
					"enum": ["text"],
					"type": "string"
				},
				{
					"description": "Image attachments included in user turns.",
					"enum": ["image"],
					"type": "string"
				},
				{
					"description": "Audio attachments included in user turns.",
					"enum": ["audio"],
					"type": "string"
				}
			]
		},
		"LegacyAppPathString": { "type": "string" },
		"McpAppDisplayMode": {
			"enum": ["inline", "fullscreen"],
			"type": "string"
		},
		"McpAppUi": {
			"description": "UI resource and display preference for model invocations, captured from the tool descriptor.",
			"properties": {
				"preferredModelDisplayMode": { "$ref": "#/definitions/McpAppDisplayMode" },
				"resourceUri": { "type": "string" }
			},
			"required": ["preferredModelDisplayMode", "resourceUri"],
			"type": "object"
		},
		"McpToolCallAppContext": {
			"properties": {
				"actionName": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"appName": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"connectorId": { "type": "string" },
				"linkId": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"resourceUri": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
			},
			"required": ["connectorId"],
			"type": "object"
		},
		"McpToolCallError": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"McpToolCallResult": {
			"properties": {
				"_meta": true,
				"content": {
					"items": true,
					"type": "array"
				},
				"structuredContent": true
			},
			"required": ["content"],
			"type": "object"
		},
		"McpToolCallStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed"
			],
			"type": "string"
		},
		"MemoryCitation": {
			"properties": {
				"entries": {
					"items": { "$ref": "#/definitions/MemoryCitationEntry" },
					"type": "array"
				},
				"threadIds": {
					"items": { "type": "string" },
					"type": "array"
				}
			},
			"required": ["entries", "threadIds"],
			"type": "object"
		},
		"MemoryCitationEntry": {
			"properties": {
				"lineEnd": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"lineStart": {
					"format": "uint32",
					"minimum": 0,
					"type": "integer"
				},
				"note": { "type": "string" },
				"path": { "type": "string" }
			},
			"required": [
				"lineEnd",
				"lineStart",
				"note",
				"path"
			],
			"type": "object"
		},
		"MessagePhase": {
			"description": "Classifies assistant text as commentary, a partial answer, or a terminal answer.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
			"oneOf": [
				{
					"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
					"enum": ["commentary"],
					"type": "string"
				},
				{
					"description": "Stable answer text that may be followed by more assistant output or tools.",
					"enum": ["partial_answer"],
					"type": "string"
				},
				{
					"description": "The assistant's declared terminal answer text for the current turn.",
					"enum": ["final_answer"],
					"type": "string"
				}
			]
		},
		"MisalignmentErrorDetails": {
			"properties": {
				"detailedExplanation": { "anyOf": [{
					"description": "A substantive localized explanation is required before offering continuation.",
					"type": "string"
				}, {
					"description": "A substantive localized explanation is required before offering continuation.",
					"type": "null"
				}] },
				"errorType": { "anyOf": [{
					"description": "Open-ended classification; clients must accept categories added by Responses.",
					"type": "string"
				}, {
					"description": "Open-ended classification; clients must accept categories added by Responses.",
					"type": "null"
				}] },
				"reviewTarget": { "anyOf": [{
					"description": "Opaque server-issued block target. Presence alone does not enable target-based continuation.",
					"type": "string"
				}, {
					"description": "Opaque server-issued block target. Presence alone does not enable target-based continuation.",
					"type": "null"
				}] },
				"steer": {
					"anyOf": [{ "$ref": "#/definitions/MisalignmentSteer" }, { "type": "null" }],
					"description": "Instruction to submit as the next turn's user input if continuation is confirmed."
				}
			},
			"type": "object"
		},
		"MisalignmentSteer": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"ModeKind": {
			"description": "Initial collaboration mode to use when the TUI starts.",
			"enum": ["plan", "default"],
			"type": "string"
		},
		"Model": {
			"properties": {
				"additionalSpeedTiers": {
					"default": [],
					"description": "Deprecated: use `serviceTiers` instead.",
					"items": { "type": "string" },
					"type": "array"
				},
				"availabilityNux": { "anyOf": [{ "$ref": "#/definitions/ModelAvailabilityNux" }, { "type": "null" }] },
				"availableAccessPrograms": {
					"anyOf": [{ "$ref": "#/definitions/ModelAccessPrograms" }, { "type": "null" }],
					"default": null,
					"description": "Null when the catalog does not provide access-program metadata."
				},
				"defaultReasoningEffort": { "$ref": "#/definitions/ReasoningEffort" },
				"defaultServiceTier": { "anyOf": [{
					"default": null,
					"description": "Catalog default service tier id for this model, when one is configured.",
					"type": "string"
				}, {
					"default": null,
					"description": "Catalog default service tier id for this model, when one is configured.",
					"type": "null"
				}] },
				"description": { "type": "string" },
				"displayName": { "type": "string" },
				"hidden": { "type": "boolean" },
				"id": { "type": "string" },
				"inputModalities": {
					"default": ["text", "image"],
					"items": { "$ref": "#/definitions/InputModality" },
					"type": "array"
				},
				"isDefault": { "type": "boolean" },
				"model": { "type": "string" },
				"modelSpecialty": { "anyOf": [{
					"default": null,
					"type": "string"
				}, {
					"default": null,
					"type": "null"
				}] },
				"multiAgentVersion": {
					"anyOf": [{ "$ref": "#/definitions/MultiAgentVersion" }, { "type": "null" }],
					"description": "Multi-agent runtime declared by this model, when available."
				},
				"serviceTiers": {
					"default": [],
					"items": { "$ref": "#/definitions/ModelServiceTier" },
					"type": "array"
				},
				"supportedReasoningEfforts": {
					"items": { "$ref": "#/definitions/ReasoningEffortOption" },
					"type": "array"
				},
				"supportsPersonality": {
					"default": false,
					"description": "@deprecated Always false; models no longer support personality selection.",
					"type": "boolean"
				},
				"upgrade": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"upgradeInfo": { "anyOf": [{ "$ref": "#/definitions/ModelUpgradeInfo" }, { "type": "null" }] }
			},
			"required": [
				"defaultReasoningEffort",
				"description",
				"displayName",
				"hidden",
				"id",
				"isDefault",
				"model",
				"supportedReasoningEfforts"
			],
			"type": "object"
		},
		"ModelAccessPrograms": {
			"description": "Caller-specific access programs and Daybreak availability from model discovery.",
			"properties": {
				"cyber": {
					"description": "Accepted explicit selections.",
					"items": { "$ref": "#/definitions/CyberAccessProgram" },
					"type": "array"
				},
				"daybreakAvailability": {
					"allOf": [{ "$ref": "#/definitions/DaybreakAvailability" }],
					"default": "default",
					"description": "Server-resolved Daybreak availability for this caller and model."
				}
			},
			"required": ["cyber"],
			"type": "object"
		},
		"ModelAvailabilityNux": {
			"properties": { "message": { "type": "string" } },
			"required": ["message"],
			"type": "object"
		},
		"ModelServiceTier": {
			"properties": {
				"description": { "type": "string" },
				"id": { "type": "string" },
				"name": { "type": "string" }
			},
			"required": [
				"description",
				"id",
				"name"
			],
			"type": "object"
		},
		"ModelUpgradeInfo": {
			"properties": {
				"migrationMarkdown": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"model": { "type": "string" },
				"modelLink": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"retirementAt": { "anyOf": [{
					"description": "Informational Unix timestamp for this upgrade's scheduled retirement, if known.",
					"format": "int64",
					"type": "integer"
				}, {
					"description": "Informational Unix timestamp for this upgrade's scheduled retirement, if known.",
					"format": "int64",
					"type": "null"
				}] },
				"upgradeCopy": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
			},
			"required": ["model"],
			"type": "object"
		},
		"MultiAgentMode": {
			"description": "Controls the effective multi-agent delegation instructions for a turn. `custom` means the configured mode hint defines the policy instead of a built-in policy.",
			"oneOf": [{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomMultiAgentMode",
				"type": "object"
			}, {
				"enum": ["explicitRequestOnly", "proactive"],
				"type": "string"
			}]
		},
		"MultiAgentVersion": {
			"description": "Multi-agent runtime supported by a model.",
			"enum": [
				"disabled",
				"v1",
				"v2"
			],
			"type": "string"
		},
		"NetworkAccess": {
			"enum": ["restricted", "enabled"],
			"type": "string"
		},
		"NonSteerableTurnKind": {
			"enum": ["review", "compact"],
			"type": "string"
		},
		"PatchApplyStatus": {
			"enum": [
				"inProgress",
				"completed",
				"failed",
				"declined"
			],
			"type": "string"
		},
		"PatchChangeKind": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["add"],
					"title": "AddPatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AddPatchChangeKind",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["delete"],
					"title": "DeletePatchChangeKindType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DeletePatchChangeKind",
				"type": "object"
			},
			{
				"properties": {
					"move_path": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"type": {
						"enum": ["update"],
						"title": "UpdatePatchChangeKindType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "UpdatePatchChangeKind",
				"type": "object"
			}
		] },
		"PlanType": {
			"enum": [
				"free",
				"go",
				"plus",
				"pro",
				"prolite",
				"promax",
				"team",
				"self_serve_business_prolite",
				"self_serve_business_usage_based",
				"business",
				"ent26",
				"enterprise_cbp_automation",
				"enterprise_cbp_usage_based",
				"enterprise",
				"edu",
				"edu_plus",
				"edu_pro",
				"sci",
				"sci_plus",
				"unknown"
			],
			"type": "string"
		},
		"ReasoningEffort": {
			"description": "A non-empty reasoning effort value advertised by the model.",
			"minLength": 1,
			"type": "string"
		},
		"ReasoningEffortOption": {
			"properties": {
				"description": { "type": "string" },
				"reasoningEffort": { "$ref": "#/definitions/ReasoningEffort" }
			},
			"required": ["description", "reasoningEffort"],
			"type": "object"
		},
		"SandboxPolicy": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["dangerFullAccess"],
					"title": "DangerFullAccessSandboxPolicyType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "DangerFullAccessSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["readOnly"],
						"title": "ReadOnlySandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ReadOnlySandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"networkAccess": {
						"allOf": [{ "$ref": "#/definitions/NetworkAccess" }],
						"default": "restricted"
					},
					"type": {
						"enum": ["externalSandbox"],
						"title": "ExternalSandboxSandboxPolicyType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ExternalSandboxSandboxPolicy",
				"type": "object"
			},
			{
				"properties": {
					"excludeSlashTmp": {
						"default": false,
						"type": "boolean"
					},
					"excludeTmpdirEnvVar": {
						"default": false,
						"type": "boolean"
					},
					"networkAccess": {
						"default": false,
						"type": "boolean"
					},
					"type": {
						"enum": ["workspaceWrite"],
						"title": "WorkspaceWriteSandboxPolicyType",
						"type": "string"
					},
					"writableRoots": {
						"default": [],
						"items": { "$ref": "#/definitions/AbsolutePathBuf" },
						"type": "array"
					}
				},
				"required": ["type"],
				"title": "WorkspaceWriteSandboxPolicy",
				"type": "object"
			}
		] },
		"SessionSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "custom": { "type": "string" } },
				"required": ["custom"],
				"title": "CustomSessionSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "subAgent": { "$ref": "#/definitions/SubAgentSource" } },
				"required": ["subAgent"],
				"title": "SubAgentSessionSource",
				"type": "object"
			},
			{
				"enum": [
					"cli",
					"vscode",
					"exec",
					"appServer",
					"unknown"
				],
				"type": "string"
			}
		] },
		"Settings": {
			"description": "Settings for a collaboration mode.",
			"properties": {
				"developer_instructions": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"model": { "type": "string" },
				"reasoning_effort": { "anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }] }
			},
			"required": ["model"],
			"type": "object"
		},
		"SubAgentActivityKind": {
			"enum": [
				"started",
				"interacted",
				"interrupted",
				"completed"
			],
			"type": "string"
		},
		"SubAgentSource": { "oneOf": [
			{
				"additionalProperties": false,
				"properties": { "thread_spawn": {
					"properties": {
						"agent_nickname": { "anyOf": [{
							"default": null,
							"type": "string"
						}, {
							"default": null,
							"type": "null"
						}] },
						"agent_path": {
							"anyOf": [{ "$ref": "#/definitions/AgentPath" }, { "type": "null" }],
							"default": null
						},
						"agent_role": { "anyOf": [{
							"default": null,
							"type": "string"
						}, {
							"default": null,
							"type": "null"
						}] },
						"depth": {
							"format": "int32",
							"type": "integer"
						},
						"parent_thread_id": { "$ref": "#/definitions/ThreadId" }
					},
					"required": ["depth", "parent_thread_id"],
					"type": "object"
				} },
				"required": ["thread_spawn"],
				"title": "ThreadSpawnSubAgentSource",
				"type": "object"
			},
			{
				"additionalProperties": false,
				"properties": { "other": { "type": "string" } },
				"required": ["other"],
				"title": "OtherSubAgentSource",
				"type": "object"
			},
			{
				"enum": [
					"review",
					"compact",
					"memory_consolidation"
				],
				"type": "string"
			}
		] },
		"TextElement": {
			"properties": {
				"byteRange": {
					"allOf": [{ "$ref": "#/definitions/ByteRange" }],
					"description": "Byte range in the parent `text` buffer that this element occupies."
				},
				"placeholder": { "anyOf": [{
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": "string"
				}, {
					"description": "Optional human-readable placeholder for the element, displayed in the UI.",
					"type": "null"
				}] }
			},
			"required": ["byteRange"],
			"type": "object"
		},
		"Thread": {
			"properties": {
				"agentNickname": { "anyOf": [{
					"description": "Optional random unique nickname assigned to an AgentControl-spawned sub-agent.",
					"type": "string"
				}, {
					"description": "Optional random unique nickname assigned to an AgentControl-spawned sub-agent.",
					"type": "null"
				}] },
				"agentRole": { "anyOf": [{
					"description": "Optional role (agent_role) assigned to an AgentControl-spawned sub-agent.",
					"type": "string"
				}, {
					"description": "Optional role (agent_role) assigned to an AgentControl-spawned sub-agent.",
					"type": "null"
				}] },
				"attachedToThreadId": { "anyOf": [{
					"description": "Parent that owns this persisted attached thread, independent of fork or spawn lineage.",
					"type": "string"
				}, {
					"description": "Parent that owns this persisted attached thread, independent of fork or spawn lineage.",
					"type": "null"
				}] },
				"canAcceptDirectInput": { "anyOf": [{
					"description": "Whether the app server accepts direct turn input for this loaded thread. `None` means the capability is unavailable, such as for an unloaded stored thread.",
					"type": "boolean"
				}, {
					"description": "Whether the app server accepts direct turn input for this loaded thread. `None` means the capability is unavailable, such as for an unloaded stored thread.",
					"type": "null"
				}] },
				"cliVersion": {
					"description": "Version of the CLI that created the thread.",
					"type": "string"
				},
				"createdAt": {
					"description": "Unix timestamp (in seconds) when the thread was created.",
					"format": "int64",
					"type": "integer"
				},
				"cwd": {
					"allOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }],
					"description": "Working directory captured for the thread."
				},
				"daybreakEnabled": { "anyOf": [{
					"description": "Saved Daybreak choice, independent of turn execution. Null if unset.",
					"type": "boolean"
				}, {
					"description": "Saved Daybreak choice, independent of turn execution. Null if unset.",
					"type": "null"
				}] },
				"daybreakProgramPropagationEnrolled": { "anyOf": [{
					"description": "Whether the live thread joined the Daybreak propagation experiment at startup. Null when only stored metadata is available. Older servers can omit this field.",
					"type": "boolean"
				}, {
					"description": "Whether the live thread joined the Daybreak propagation experiment at startup. Null when only stored metadata is available. Older servers can omit this field.",
					"type": "null"
				}] },
				"environments": { "anyOf": [{
					"default": null,
					"description": "Current environments for a loaded thread, in priority order, primary first. `null` means the thread is not loaded or the server does not expose its selection. An empty list means no environments are selected. This does not report connection status.",
					"items": { "$ref": "#/definitions/ThreadEnvironment" },
					"type": "array"
				}, {
					"default": null,
					"description": "Current environments for a loaded thread, in priority order, primary first. `null` means the thread is not loaded or the server does not expose its selection. An empty list means no environments are selected. This does not report connection status.",
					"items": { "$ref": "#/definitions/ThreadEnvironment" },
					"type": "null"
				}] },
				"ephemeral": {
					"description": "Whether the thread is ephemeral and should not be materialized on disk.",
					"type": "boolean"
				},
				"extra": {
					"anyOf": [{ "$ref": "#/definitions/ThreadExtra" }, { "type": "null" }],
					"description": "Optional implementation-specific thread data."
				},
				"forkedFromId": { "anyOf": [{
					"description": "Source thread id when this thread was created by forking another thread.",
					"type": "string"
				}, {
					"description": "Source thread id when this thread was created by forking another thread.",
					"type": "null"
				}] },
				"gitInfo": {
					"anyOf": [{ "$ref": "#/definitions/GitInfo" }, { "type": "null" }],
					"description": "Optional Git metadata captured when the thread was created."
				},
				"historyMode": {
					"allOf": [{ "$ref": "#/definitions/ThreadHistoryMode" }],
					"default": "legacy",
					"description": "Persisted thread history contract selected when this thread was created."
				},
				"id": {
					"description": "Identifier for this thread. Codex-generated thread IDs are UUIDv7.",
					"type": "string"
				},
				"model": { "anyOf": [{
					"description": "Current configured model when loaded, otherwise the latest persisted model. Null when unavailable. This is not per-turn execution telemetry.",
					"type": "string"
				}, {
					"description": "Current configured model when loaded, otherwise the latest persisted model. Null when unavailable. This is not per-turn execution telemetry.",
					"type": "null"
				}] },
				"modelProvider": {
					"description": "Model provider used for this thread (for example, 'openai').",
					"type": "string"
				},
				"name": { "anyOf": [{
					"description": "Optional user-facing thread title.",
					"type": "string"
				}, {
					"description": "Optional user-facing thread title.",
					"type": "null"
				}] },
				"originator": { "anyOf": [{
					"description": "Originator recorded when the thread was created, independent of its current client or executor. Null when the recorded originator is unavailable.",
					"type": "string"
				}, {
					"description": "Originator recorded when the thread was created, independent of its current client or executor. Null when the recorded originator is unavailable.",
					"type": "null"
				}] },
				"parentThreadId": { "anyOf": [{
					"description": "The ID of the parent thread. This will only be set if this thread is a subagent.",
					"type": "string"
				}, {
					"description": "The ID of the parent thread. This will only be set if this thread is a subagent.",
					"type": "null"
				}] },
				"path": { "anyOf": [{
					"description": "[UNSTABLE] Path to the thread on disk.",
					"type": "string"
				}, {
					"description": "[UNSTABLE] Path to the thread on disk.",
					"type": "null"
				}] },
				"preview": {
					"description": "Usually the first user message in the thread, if available.",
					"type": "string"
				},
				"projectId": { "anyOf": [{
					"description": "Canonical project assignment owned by app-server, if any.",
					"type": "string"
				}, {
					"description": "Canonical project assignment owned by app-server, if any.",
					"type": "null"
				}] },
				"reasoningEffort": {
					"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
					"description": "Current configured reasoning effort when loaded, otherwise the latest persisted effort. Null when unset or unavailable. This is not per-turn execution telemetry."
				},
				"recencyAt": { "anyOf": [{
					"description": "Unix timestamp (in seconds) used for thread recency ordering.",
					"format": "int64",
					"type": "integer"
				}, {
					"description": "Unix timestamp (in seconds) used for thread recency ordering.",
					"format": "int64",
					"type": "null"
				}] },
				"section": {
					"anyOf": [{ "$ref": "#/definitions/ThreadSection" }, { "type": "null" }],
					"default": null,
					"description": "The independently persisted section selected for this thread, if any."
				},
				"sectionEnteredAt": { "anyOf": [{
					"default": null,
					"description": "Unix timestamp in seconds when the thread entered its current section.",
					"format": "int64",
					"type": "integer"
				}, {
					"default": null,
					"description": "Unix timestamp in seconds when the thread entered its current section.",
					"format": "int64",
					"type": "null"
				}] },
				"sessionId": {
					"description": "Session id shared by threads that belong to the same session tree.",
					"type": "string"
				},
				"source": {
					"allOf": [{ "$ref": "#/definitions/SessionSource" }],
					"description": "Origin of the thread (CLI, VSCode, codex exec, codex app-server, etc.)."
				},
				"status": {
					"allOf": [{ "$ref": "#/definitions/ThreadStatus" }],
					"description": "Current runtime status for the thread."
				},
				"threadSource": {
					"anyOf": [{ "$ref": "#/definitions/ThreadSource" }, { "type": "null" }],
					"description": "Optional analytics source classification for this thread."
				},
				"turns": {
					"description": "Only populated on `thread/resume`, `thread/fork`, and `thread/read` (when `includeTurns` is true) responses. For all other responses and notifications returning a Thread, the turns field will be an empty list.",
					"items": { "$ref": "#/definitions/Turn" },
					"type": "array"
				},
				"updatedAt": {
					"description": "Unix timestamp (in seconds) when the thread was last updated.",
					"format": "int64",
					"type": "integer"
				}
			},
			"required": [
				"cliVersion",
				"createdAt",
				"cwd",
				"ephemeral",
				"id",
				"modelProvider",
				"preview",
				"projectId",
				"sessionId",
				"source",
				"status",
				"turns",
				"updatedAt"
			],
			"type": "object"
		},
		"ThreadActiveFlag": {
			"enum": ["waitingOnApproval", "waitingOnUserInput"],
			"type": "string"
		},
		"ThreadEnvironment": {
			"description": "An environment selected by a loaded thread, independent of connection status.",
			"properties": {
				"cwd": { "$ref": "#/definitions/LegacyAppPathString" },
				"environmentId": { "type": "string" },
				"runtimeWorkspaceRoots": {
					"items": { "$ref": "#/definitions/LegacyAppPathString" },
					"type": "array"
				}
			},
			"required": [
				"cwd",
				"environmentId",
				"runtimeWorkspaceRoots"
			],
			"type": "object"
		},
		"ThreadExtra": {
			"description": "Extra app-server data for a thread.",
			"type": "object"
		},
		"ThreadHistoryMode": {
			"enum": ["legacy", "paginated"],
			"type": "string"
		},
		"ThreadId": { "type": "string" },
		"ThreadItem": {
			"description": "A thread item and its recorded lifecycle times. The payload stays flat on the wire.",
			"oneOf": [
				{
					"properties": {
						"clientId": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
						"content": {
							"items": { "$ref": "#/definitions/UserInput" },
							"type": "array"
						},
						"id": { "type": "string" },
						"type": {
							"enum": ["userMessage"],
							"title": "UserMessageThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"content",
						"id",
						"type"
					],
					"title": "UserMessageThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"fragments": {
							"items": { "$ref": "#/definitions/HookPromptFragment" },
							"type": "array"
						},
						"id": { "type": "string" },
						"type": {
							"enum": ["hookPrompt"],
							"title": "HookPromptThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"fragments",
						"id",
						"type"
					],
					"title": "HookPromptThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"delivery": {
							"anyOf": [{ "$ref": "#/definitions/AgentMessageDelivery" }, { "type": "null" }],
							"default": null
						},
						"id": { "type": "string" },
						"memoryCitation": {
							"anyOf": [{ "$ref": "#/definitions/MemoryCitation" }, { "type": "null" }],
							"default": null
						},
						"moderation": {
							"anyOf": [{ "$ref": "#/definitions/AgentMessageModeration" }, { "type": "null" }],
							"default": null
						},
						"phase": {
							"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
							"default": null
						},
						"questions": { "anyOf": [{
							"default": null,
							"items": { "$ref": "#/definitions/AsyncUserInputQuestion" },
							"type": "array"
						}, {
							"default": null,
							"items": { "$ref": "#/definitions/AsyncUserInputQuestion" },
							"type": "null"
						}] },
						"text": { "type": "string" },
						"type": {
							"enum": ["agentMessage"],
							"title": "AgentMessageThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"text",
						"type"
					],
					"title": "AgentMessageThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"id": { "type": "string" },
						"name": { "type": "string" },
						"namespace": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
						"output": { "$ref": "#/definitions/FunctionCallOutputBody" },
						"type": {
							"enum": ["functionCallOutput"],
							"title": "FunctionCallOutputThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"name",
						"output",
						"type"
					],
					"title": "FunctionCallOutputThreadItem",
					"type": "object"
				},
				{
					"description": "EXPERIMENTAL - proposed plan item content. The completed plan item is authoritative and may not match the concatenation of `PlanDelta` text.",
					"properties": {
						"id": { "type": "string" },
						"text": { "type": "string" },
						"type": {
							"enum": ["plan"],
							"title": "PlanThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"text",
						"type"
					],
					"title": "PlanThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"content": {
							"default": [],
							"items": { "type": "string" },
							"type": "array"
						},
						"id": { "type": "string" },
						"summary": {
							"default": [],
							"items": { "type": "string" },
							"type": "array"
						},
						"type": {
							"enum": ["reasoning"],
							"title": "ReasoningThreadItemType",
							"type": "string"
						}
					},
					"required": ["id", "type"],
					"title": "ReasoningThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"aggregatedOutput": { "anyOf": [{
							"description": "The command's output, aggregated from stdout and stderr.",
							"type": "string"
						}, {
							"description": "The command's output, aggregated from stdout and stderr.",
							"type": "null"
						}] },
						"command": {
							"description": "The command to be executed.",
							"type": "string"
						},
						"commandActions": {
							"description": "A best-effort parsing of the command to understand the action(s) it will perform. This returns a list of CommandAction objects because a single shell command may be composed of many commands piped together.",
							"items": { "$ref": "#/definitions/CommandAction" },
							"type": "array"
						},
						"cwd": {
							"allOf": [{ "$ref": "#/definitions/LegacyAppPathString" }],
							"description": "The command's working directory."
						},
						"durationMs": { "anyOf": [{
							"description": "The duration of the command execution in milliseconds.",
							"format": "int64",
							"type": "integer"
						}, {
							"description": "The duration of the command execution in milliseconds.",
							"format": "int64",
							"type": "null"
						}] },
						"exitCode": { "anyOf": [{
							"description": "The command's exit code.",
							"format": "int32",
							"type": "integer"
						}, {
							"description": "The command's exit code.",
							"format": "int32",
							"type": "null"
						}] },
						"id": { "type": "string" },
						"pluginId": { "anyOf": [{
							"default": null,
							"description": "Trusted first-party plugin id when this command resolves to one plugin script.",
							"type": "string"
						}, {
							"default": null,
							"description": "Trusted first-party plugin id when this command resolves to one plugin script.",
							"type": "null"
						}] },
						"processId": { "anyOf": [{
							"description": "Identifier for the underlying PTY process (when available).",
							"type": "string"
						}, {
							"description": "Identifier for the underlying PTY process (when available).",
							"type": "null"
						}] },
						"scriptPath": { "anyOf": [{
							"default": null,
							"description": "Safe plugin-relative path when this command resolves to one plugin script.",
							"type": "string"
						}, {
							"default": null,
							"description": "Safe plugin-relative path when this command resolves to one plugin script.",
							"type": "null"
						}] },
						"source": {
							"allOf": [{ "$ref": "#/definitions/CommandExecutionSource" }],
							"default": "agent"
						},
						"status": { "$ref": "#/definitions/CommandExecutionStatus" },
						"type": {
							"enum": ["commandExecution"],
							"title": "CommandExecutionThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"command",
						"commandActions",
						"cwd",
						"id",
						"status",
						"type"
					],
					"title": "CommandExecutionThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"changes": {
							"items": { "$ref": "#/definitions/FileUpdateChange" },
							"type": "array"
						},
						"id": { "type": "string" },
						"status": { "$ref": "#/definitions/PatchApplyStatus" },
						"type": {
							"enum": ["fileChange"],
							"title": "FileChangeThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"changes",
						"id",
						"status",
						"type"
					],
					"title": "FileChangeThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"appContext": { "anyOf": [{ "$ref": "#/definitions/McpToolCallAppContext" }, { "type": "null" }] },
						"arguments": true,
						"durationMs": { "anyOf": [{
							"description": "The duration of the MCP tool call in milliseconds.",
							"format": "int64",
							"type": "integer"
						}, {
							"description": "The duration of the MCP tool call in milliseconds.",
							"format": "int64",
							"type": "null"
						}] },
						"environmentId": { "anyOf": [{
							"description": "Registration scope, not necessarily the server's execution environment.",
							"type": "string"
						}, {
							"description": "Registration scope, not necessarily the server's execution environment.",
							"type": "null"
						}] },
						"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
						"id": { "type": "string" },
						"mcpAppResourceUri": { "anyOf": [{
							"description": "Legacy compatibility field; prefer `mcpAppUi.resourceUri` when available.",
							"type": "string"
						}, {
							"description": "Legacy compatibility field; prefer `mcpAppUi.resourceUri` when available.",
							"type": "null"
						}] },
						"mcpAppUi": {
							"anyOf": [{ "$ref": "#/definitions/McpAppUi" }, { "type": "null" }],
							"description": "Presentation captured from the invoked descriptor; absent in older history."
						},
						"pluginId": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
						"readOnlyHint": { "anyOf": [{ "type": "boolean" }, { "type": "null" }] },
						"result": { "anyOf": [{ "$ref": "#/definitions/McpToolCallResult" }, { "type": "null" }] },
						"server": { "type": "string" },
						"status": { "$ref": "#/definitions/McpToolCallStatus" },
						"tool": { "type": "string" },
						"type": {
							"enum": ["mcpToolCall"],
							"title": "McpToolCallThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"arguments",
						"id",
						"server",
						"status",
						"tool",
						"type"
					],
					"title": "McpToolCallThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"arguments": true,
						"contentItems": { "anyOf": [{
							"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
							"type": "array"
						}, {
							"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
							"type": "null"
						}] },
						"durationMs": { "anyOf": [{
							"description": "The duration of the dynamic tool call in milliseconds.",
							"format": "int64",
							"type": "integer"
						}, {
							"description": "The duration of the dynamic tool call in milliseconds.",
							"format": "int64",
							"type": "null"
						}] },
						"id": { "type": "string" },
						"namespace": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
						"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
						"success": { "anyOf": [{ "type": "boolean" }, { "type": "null" }] },
						"tool": { "type": "string" },
						"type": {
							"enum": ["dynamicToolCall"],
							"title": "DynamicToolCallThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"arguments",
						"id",
						"status",
						"tool",
						"type"
					],
					"title": "DynamicToolCallThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"agentsStates": {
							"description": "Last known status of the target agents, when available.",
							"type": "object",
							"patternProperties": { ".*": { "$ref": "#/definitions/CollabAgentState" } },
							"additionalProperties": false
						},
						"id": {
							"description": "Unique identifier for this collab tool call.",
							"type": "string"
						},
						"model": { "anyOf": [{
							"description": "Model requested for the spawned agent, when applicable.",
							"type": "string"
						}, {
							"description": "Model requested for the spawned agent, when applicable.",
							"type": "null"
						}] },
						"prompt": { "anyOf": [{
							"description": "Prompt text sent as part of the collab tool call, when available.",
							"type": "string"
						}, {
							"description": "Prompt text sent as part of the collab tool call, when available.",
							"type": "null"
						}] },
						"reasoningEffort": {
							"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
							"description": "Reasoning effort requested for the spawned agent, when applicable."
						},
						"receiverThreadIds": {
							"description": "Thread ID of the receiving agent, when applicable. In case of spawn operation, this corresponds to the newly spawned agent.",
							"items": { "type": "string" },
							"type": "array"
						},
						"senderThreadId": {
							"description": "Thread ID of the agent issuing the collab request.",
							"type": "string"
						},
						"status": {
							"allOf": [{ "$ref": "#/definitions/CollabAgentToolCallStatus" }],
							"description": "Current status of the collab tool call."
						},
						"tool": {
							"allOf": [{ "$ref": "#/definitions/CollabAgentTool" }],
							"description": "Name of the collab tool that was invoked."
						},
						"type": {
							"enum": ["collabAgentToolCall"],
							"title": "CollabAgentToolCallThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"agentsStates",
						"id",
						"receiverThreadIds",
						"senderThreadId",
						"status",
						"tool",
						"type"
					],
					"title": "CollabAgentToolCallThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"agentPath": { "type": "string" },
						"agentThreadId": { "type": "string" },
						"id": { "type": "string" },
						"kind": { "$ref": "#/definitions/SubAgentActivityKind" },
						"model": { "anyOf": [{
							"description": "Resolved model at sub-agent creation; absent from older records and other activities.",
							"type": "string"
						}, {
							"description": "Resolved model at sub-agent creation; absent from older records and other activities.",
							"type": "null"
						}] },
						"reasoningEffort": {
							"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
							"description": "Resolved reasoning effort at sub-agent creation, when known."
						},
						"type": {
							"enum": ["subAgentActivity"],
							"title": "SubAgentActivityThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"agentPath",
						"agentThreadId",
						"id",
						"kind",
						"type"
					],
					"title": "SubAgentActivityThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"action": { "anyOf": [{ "$ref": "#/definitions/WebSearchAction" }, { "type": "null" }] },
						"id": { "type": "string" },
						"query": { "type": "string" },
						"results": { "anyOf": [{
							"default": null,
							"description": "Structured search results returned out-of-band by standalone web search.\n\nThese stay as opaque JSON at the extension/app-server boundary so new result fields and result types can pass through without a Codex release.",
							"items": true,
							"type": "array"
						}, {
							"default": null,
							"description": "Structured search results returned out-of-band by standalone web search.\n\nThese stay as opaque JSON at the extension/app-server boundary so new result fields and result types can pass through without a Codex release.",
							"items": true,
							"type": "null"
						}] },
						"type": {
							"enum": ["webSearch"],
							"title": "WebSearchThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"query",
						"type"
					],
					"title": "WebSearchThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"id": { "type": "string" },
						"path": { "$ref": "#/definitions/LegacyAppPathString" },
						"type": {
							"enum": ["imageView"],
							"title": "ImageViewThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"path",
						"type"
					],
					"title": "ImageViewThreadItem",
					"type": "object"
				},
				{
					"description": "Display item emitted by the interruptible `clock.sleep` tool.",
					"properties": {
						"durationMs": {
							"format": "uint64",
							"minimum": 0,
							"type": "integer"
						},
						"id": { "type": "string" },
						"type": {
							"enum": ["sleep"],
							"title": "SleepThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"durationMs",
						"id",
						"type"
					],
					"title": "SleepThreadItem",
					"type": "object"
				},
				{
					"anyOf": [{
						"properties": { "fileId": { "type": "string" } },
						"required": ["fileId"],
						"title": "FileIdThreadItem",
						"type": "object"
					}, {
						"properties": { "result": { "type": "string" } },
						"required": ["result"],
						"title": "ResultThreadItem",
						"type": "object"
					}],
					"description": "Either inline generated-image data or its durable attachment-store identity.\n\n`File` must remain first so rollouts written during the migration, which contain both an empty `result` and a `fileId`, retain the file reference when deserialized.",
					"properties": {
						"failure": {
							"anyOf": [{ "$ref": "#/definitions/ImageGenerationFailure" }, { "type": "null" }],
							"default": null
						},
						"generationId": { "anyOf": [{
							"default": null,
							"description": "Image generation identifier for the generated image, when provided by the image backend.",
							"type": "string"
						}, {
							"default": null,
							"description": "Image generation identifier for the generated image, when provided by the image backend.",
							"type": "null"
						}] },
						"id": { "type": "string" },
						"inputImages": {
							"description": "Observed local inputs for a completed generation, absent on older items.",
							"items": { "$ref": "#/definitions/ImageGenerationInputImage" },
							"type": "array"
						},
						"revisedPrompt": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
						"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
						"status": { "type": "string" },
						"transparentBackground": { "anyOf": [{
							"default": null,
							"type": "boolean"
						}, {
							"default": null,
							"type": "null"
						}] },
						"type": {
							"enum": ["imageGeneration"],
							"title": "ImageGenerationThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"status",
						"type"
					],
					"title": "ImageGenerationThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"id": { "type": "string" },
						"review": { "type": "string" },
						"type": {
							"enum": ["enteredReviewMode"],
							"title": "EnteredReviewModeThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"review",
						"type"
					],
					"title": "EnteredReviewModeThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"id": { "type": "string" },
						"review": { "type": "string" },
						"type": {
							"enum": ["exitedReviewMode"],
							"title": "ExitedReviewModeThreadItemType",
							"type": "string"
						}
					},
					"required": [
						"id",
						"review",
						"type"
					],
					"title": "ExitedReviewModeThreadItem",
					"type": "object"
				},
				{
					"properties": {
						"id": { "type": "string" },
						"type": {
							"enum": ["contextCompaction"],
							"title": "ContextCompactionThreadItemType",
							"type": "string"
						}
					},
					"required": ["id", "type"],
					"title": "ContextCompactionThreadItem",
					"type": "object"
				}
			],
			"properties": {
				"completedAtMs": { "anyOf": [{
					"default": null,
					"description": "Unix timestamp in milliseconds when the item completed, if recorded.",
					"format": "int64",
					"type": "integer"
				}, {
					"default": null,
					"description": "Unix timestamp in milliseconds when the item completed, if recorded.",
					"format": "int64",
					"type": "null"
				}] },
				"startedAtMs": { "anyOf": [{
					"default": null,
					"description": "Unix timestamp in milliseconds when the item started, if recorded.",
					"format": "int64",
					"type": "integer"
				}, {
					"default": null,
					"description": "Unix timestamp in milliseconds when the item started, if recorded.",
					"format": "int64",
					"type": "null"
				}] }
			},
			"type": "object"
		},
		"ThreadSection": {
			"description": "An independently persisted, user-visible thread section.",
			"properties": {
				"appearance": {
					"anyOf": [{ "$ref": "#/definitions/ThreadSectionAppearance" }, { "type": "null" }],
					"default": null,
					"description": "Optional appearance synchronized across clients."
				},
				"id": {
					"description": "Opaque UUIDv7 identity that remains stable when the section is renamed.",
					"type": "string"
				},
				"name": {
					"description": "The current user-visible section name.",
					"type": "string"
				}
			},
			"required": ["id", "name"],
			"type": "object"
		},
		"ThreadSectionAppearance": {
			"description": "Extensible visual presentation for a custom thread section.",
			"properties": {
				"color": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"icon": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
			},
			"type": "object"
		},
		"ThreadSource": { "type": "string" },
		"ThreadStatus": { "oneOf": [
			{
				"properties": { "type": {
					"enum": ["notLoaded"],
					"title": "NotLoadedThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "NotLoadedThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["idle"],
					"title": "IdleThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "IdleThreadStatus",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["systemError"],
					"title": "SystemErrorThreadStatusType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "SystemErrorThreadStatus",
				"type": "object"
			},
			{
				"properties": {
					"activeFlags": {
						"items": { "$ref": "#/definitions/ThreadActiveFlag" },
						"type": "array"
					},
					"type": {
						"enum": ["active"],
						"title": "ActiveThreadStatusType",
						"type": "string"
					}
				},
				"required": ["activeFlags", "type"],
				"title": "ActiveThreadStatus",
				"type": "object"
			}
		] },
		"TrustedContacts": {
			"enum": ["check", "skip"],
			"type": "string"
		},
		"Turn": {
			"properties": {
				"completedAt": { "anyOf": [{
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": "integer"
				}, {
					"description": "Unix timestamp (in seconds) when the turn completed.",
					"format": "int64",
					"type": "null"
				}] },
				"durationMs": { "anyOf": [{
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": "integer"
				}, {
					"description": "Duration between turn start and completion in milliseconds, if known.",
					"format": "int64",
					"type": "null"
				}] },
				"error": {
					"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
					"description": "Error associated with a failed or interrupted turn."
				},
				"id": {
					"description": "Identifier for this turn. Codex-generated turn IDs are UUIDv7.",
					"type": "string"
				},
				"items": {
					"description": "Thread items currently included in this turn payload.",
					"items": { "$ref": "#/definitions/ThreadItem" },
					"type": "array"
				},
				"itemsView": {
					"allOf": [{ "$ref": "#/definitions/TurnItemsView" }],
					"default": "full",
					"description": "Describes how much of `items` has been loaded for this turn."
				},
				"rootTurnId": { "anyOf": [{
					"description": "ID of the first turn in the chain of work that led to this turn. Pass this as `rootTurnId` when starting work on behalf of this turn. May be null in older history or a `review/start` response.",
					"type": "string"
				}, {
					"description": "ID of the first turn in the chain of work that led to this turn. Pass this as `rootTurnId` when starting work on behalf of this turn. May be null in older history or a `review/start` response.",
					"type": "null"
				}] },
				"startedAt": { "anyOf": [{
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": "integer"
				}, {
					"description": "Unix timestamp (in seconds) when the turn started.",
					"format": "int64",
					"type": "null"
				}] },
				"status": { "$ref": "#/definitions/TurnStatus" }
			},
			"required": [
				"id",
				"items",
				"status"
			],
			"type": "object"
		},
		"TurnError": {
			"properties": {
				"additionalDetails": { "anyOf": [{
					"default": null,
					"type": "string"
				}, {
					"default": null,
					"type": "null"
				}] },
				"codexErrorInfo": { "anyOf": [{ "$ref": "#/definitions/CodexErrorInfo" }, { "type": "null" }] },
				"message": { "type": "string" },
				"misalignment": {
					"anyOf": [{ "$ref": "#/definitions/MisalignmentErrorDetails" }, { "type": "null" }],
					"default": null,
					"description": "Optional public explanation and continuation instruction for a misalignment block."
				}
			},
			"required": ["message"],
			"type": "object"
		},
		"TurnItemsView": { "oneOf": [
			{
				"description": "`items` was not loaded for this turn. The field is intentionally empty.",
				"enum": ["notLoaded"],
				"type": "string"
			},
			{
				"description": "`items` contains only a display summary for this turn.",
				"enum": ["summary"],
				"type": "string"
			},
			{
				"description": "`items` contains every ThreadItem available from persisted app-server history for this turn.",
				"enum": ["full"],
				"type": "string"
			}
		] },
		"TurnStatus": {
			"enum": [
				"completed",
				"interrupted",
				"failed",
				"inProgress"
			],
			"type": "string"
		},
		"TurnsPage": {
			"properties": {
				"backwardsCursor": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
				"data": {
					"items": { "$ref": "#/definitions/Turn" },
					"type": "array"
				},
				"nextCursor": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
			},
			"required": ["data"],
			"type": "object"
		},
		"UserInput": { "oneOf": [
			{
				"properties": {
					"text": { "type": "string" },
					"text_elements": {
						"default": [],
						"description": "UI-defined spans within `text` used to render or persist special elements.",
						"items": { "$ref": "#/definitions/TextElement" },
						"type": "array"
					},
					"type": {
						"enum": ["text"],
						"title": "TextUserInputType",
						"type": "string"
					}
				},
				"required": ["text", "type"],
				"title": "TextUserInput",
				"type": "object"
			},
			{
				"anyOf": [{
					"properties": { "url": { "type": "string" } },
					"required": ["url"],
					"title": "UrlUserInput",
					"type": "object"
				}, {
					"properties": { "fileId": { "type": "string" } },
					"required": ["fileId"],
					"title": "FileIdUserInput",
					"type": "object"
				}],
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"type": {
						"enum": ["image"],
						"title": "ImageUserInputType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "ImageUserInput",
				"type": "object"
			},
			{
				"properties": {
					"detail": {
						"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
						"default": null
					},
					"path": { "type": "string" },
					"type": {
						"enum": ["localImage"],
						"title": "LocalImageUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalImageUserInput",
				"type": "object"
			},
			{
				"anyOf": [{
					"properties": { "url": { "type": "string" } },
					"required": ["url"],
					"title": "UrlUserInput",
					"type": "object"
				}, {
					"properties": { "fileId": { "type": "string" } },
					"required": ["fileId"],
					"title": "FileIdUserInput",
					"type": "object"
				}],
				"properties": { "type": {
					"enum": ["audio"],
					"title": "AudioUserInputType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "AudioUserInput",
				"type": "object"
			},
			{
				"properties": {
					"path": { "type": "string" },
					"type": {
						"enum": ["localAudio"],
						"title": "LocalAudioUserInputType",
						"type": "string"
					}
				},
				"required": ["path", "type"],
				"title": "LocalAudioUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["skill"],
						"title": "SkillUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "SkillUserInput",
				"type": "object"
			},
			{
				"properties": {
					"name": { "type": "string" },
					"path": { "type": "string" },
					"type": {
						"enum": ["mention"],
						"title": "MentionUserInputType",
						"type": "string"
					}
				},
				"required": [
					"name",
					"path",
					"type"
				],
				"title": "MentionUserInput",
				"type": "object"
			}
		] },
		"WebSearchAction": { "oneOf": [
			{
				"properties": {
					"queries": { "anyOf": [{
						"items": { "type": "string" },
						"type": "array"
					}, {
						"items": { "type": "string" },
						"type": "null"
					}] },
					"query": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"type": {
						"enum": ["search"],
						"title": "SearchWebSearchActionType",
						"type": "string"
					}
				},
				"required": ["type"],
				"title": "SearchWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"type": {
						"enum": ["openPage"],
						"title": "OpenPageWebSearchActionType",
						"type": "string"
					},
					"url": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
				},
				"required": ["type"],
				"title": "OpenPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": {
					"pattern": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
					"type": {
						"enum": ["findInPage"],
						"title": "FindInPageWebSearchActionType",
						"type": "string"
					},
					"url": { "anyOf": [{ "type": "string" }, { "type": "null" }] }
				},
				"required": ["type"],
				"title": "FindInPageWebSearchAction",
				"type": "object"
			},
			{
				"properties": { "type": {
					"enum": ["other"],
					"title": "OtherWebSearchActionType",
					"type": "string"
				} },
				"required": ["type"],
				"title": "OtherWebSearchAction",
				"type": "object"
			}
		] },
		"WorkspaceRouting": {
			"properties": {
				"accountRoutingOverride": { "$ref": "#/definitions/AccountRoutingOverride" },
				"backendOrigin": { "type": "string" },
				"chatgptAccountId": { "type": "string" }
			},
			"required": [
				"accountRoutingOverride",
				"backendOrigin",
				"chatgptAccountId"
			],
			"type": "object"
		}
	},
	"title": "CodexAppServerProtocolDefinitions",
	"type": "object",
	"$id": "https://openclaw.invalid/codex/v2/CodexAppServerProtocolDefinitions.json"
} };
var schemas = {
	"CodexDynamicToolCallParams": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"arguments": true,
			"callId": { "type": "string" },
			"namespace": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
			"threadId": { "type": "string" },
			"tool": { "type": "string" },
			"turnId": { "type": "string" }
		},
		"required": [
			"arguments",
			"callId",
			"threadId",
			"tool",
			"turnId"
		],
		"title": "DynamicToolCallParams",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/DynamicToolCallParams.json"
	},
	"CodexErrorNotification": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"error": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/TurnError" },
			"threadId": { "type": "string" },
			"turnId": { "type": "string" },
			"willRetry": { "type": "boolean" }
		},
		"required": [
			"error",
			"threadId",
			"turnId",
			"willRetry"
		],
		"title": "ErrorNotification",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/ErrorNotification.json"
	},
	"CodexModelListResponse": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"data": {
				"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Model" },
				"type": "array"
			},
			"nextCursor": { "anyOf": [{
				"description": "Opaque cursor to pass to the next call to continue after the last item. If None, there are no more items to return.",
				"type": "string"
			}, {
				"description": "Opaque cursor to pass to the next call to continue after the last item. If None, there are no more items to return.",
				"type": "null"
			}] }
		},
		"required": ["data"],
		"title": "ModelListResponse",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/ModelListResponse.json"
	},
	"CodexThreadResumeResponse": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"activePermissionProfile": {
				"anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ActivePermissionProfile" }, { "type": "null" }],
				"default": null,
				"description": "Named or implicit built-in profile that produced the active permissions, when known."
			},
			"approvalPolicy": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AskForApproval" },
			"approvalsReviewer": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ApprovalsReviewer" }],
				"description": "Reviewer currently used for approval requests on this thread."
			},
			"collaborationMode": {
				"anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/CollaborationMode" }, { "type": "null" }],
				"description": "Effective collaboration mode. Absent when resuming from an older server."
			},
			"cwd": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AbsolutePathBuf" },
			"disabledPluginIds": {
				"default": [],
				"description": "Saved list of disabled plugin IDs. Does not yet filter plugin capabilities.",
				"items": { "type": "string" },
				"type": "array"
			},
			"initialTurnsPage": {
				"anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/TurnsPage" }, { "type": "null" }],
				"default": null,
				"description": "`thread/turns/list` page returned when requested by `initialTurnsPage`."
			},
			"instructionSources": {
				"default": [],
				"description": "Environment-native paths to instruction source files currently loaded for this thread.",
				"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/LegacyAppPathString" },
				"type": "array"
			},
			"itemsBackwardsCursor": { "anyOf": [{
				"default": null,
				"description": "Opaque cursor for hydrating paginated items backwards.\n\nPass this as `cursor` to `thread/items/list` with `sortDirection: \"desc\"`. The first page includes the item identified by the cursor.",
				"type": "string"
			}, {
				"default": null,
				"description": "Opaque cursor for hydrating paginated items backwards.\n\nPass this as `cursor` to `thread/items/list` with `sortDirection: \"desc\"`. The first page includes the item identified by the cursor.",
				"type": "null"
			}] },
			"model": { "type": "string" },
			"modelProvider": { "type": "string" },
			"multiAgentMode": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/MultiAgentMode" }],
				"default": "explicitRequestOnly",
				"description": "@deprecated Always `explicitRequestOnly`. Use `reasoningEffort` for Ultra behavior."
			},
			"reasoningEffort": { "anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ReasoningEffort" }, { "type": "null" }] },
			"runtimeWorkspaceRoots": {
				"default": [],
				"description": "Thread-scoped runtime workspace roots used to materialize `:workspace_roots`.",
				"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AbsolutePathBuf" },
				"type": "array"
			},
			"sandbox": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/SandboxPolicy" }],
				"description": "Legacy sandbox policy retained for compatibility. Experimental clients should prefer `activePermissionProfile` for profile provenance."
			},
			"serviceTier": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
			"thread": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Thread" },
			"turnsBackwardsCursor": { "anyOf": [{
				"default": null,
				"description": "Opaque cursor for hydrating paginated turns backwards.\n\nPass this as `cursor` to `thread/turns/list` with `sortDirection: \"desc\"`. The first page includes the turn identified by the cursor.",
				"type": "string"
			}, {
				"default": null,
				"description": "Opaque cursor for hydrating paginated turns backwards.\n\nPass this as `cursor` to `thread/turns/list` with `sortDirection: \"desc\"`. The first page includes the turn identified by the cursor.",
				"type": "null"
			}] }
		},
		"required": [
			"approvalPolicy",
			"approvalsReviewer",
			"cwd",
			"model",
			"modelProvider",
			"sandbox",
			"thread"
		],
		"title": "ThreadResumeResponse",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/ThreadResumeResponse.json"
	},
	"CodexThreadStartResponse": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"activePermissionProfile": {
				"anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ActivePermissionProfile" }, { "type": "null" }],
				"default": null,
				"description": "Named or implicit built-in profile that produced the active permissions, when known."
			},
			"approvalPolicy": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AskForApproval" },
			"approvalsReviewer": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ApprovalsReviewer" }],
				"description": "Reviewer currently used for approval requests on this thread."
			},
			"cwd": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AbsolutePathBuf" },
			"disabledPluginIds": {
				"default": [],
				"description": "Saved list of disabled plugin IDs. Does not yet filter plugin capabilities.",
				"items": { "type": "string" },
				"type": "array"
			},
			"instructionSources": {
				"default": [],
				"description": "Environment-native paths to instruction source files currently loaded for this thread.",
				"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/LegacyAppPathString" },
				"type": "array"
			},
			"model": { "type": "string" },
			"modelProvider": { "type": "string" },
			"multiAgentMode": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/MultiAgentMode" }],
				"default": "explicitRequestOnly",
				"description": "@deprecated Always `explicitRequestOnly`. Use `reasoningEffort` for Ultra behavior."
			},
			"reasoningEffort": { "anyOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/ReasoningEffort" }, { "type": "null" }] },
			"runtimeWorkspaceRoots": {
				"default": [],
				"description": "Thread-scoped runtime workspace roots used to materialize `:workspace_roots`.",
				"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/AbsolutePathBuf" },
				"type": "array"
			},
			"sandbox": {
				"allOf": [{ "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/SandboxPolicy" }],
				"description": "Legacy sandbox policy retained for compatibility. Experimental clients should prefer `activePermissionProfile` for profile provenance."
			},
			"serviceTier": { "anyOf": [{ "type": "string" }, { "type": "null" }] },
			"thread": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Thread" }
		},
		"required": [
			"approvalPolicy",
			"approvalsReviewer",
			"cwd",
			"model",
			"modelProvider",
			"sandbox",
			"thread"
		],
		"title": "ThreadStartResponse",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/ThreadStartResponse.json"
	},
	"CodexTurnCompletedNotification": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"threadId": { "type": "string" },
			"turn": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Turn" }
		},
		"required": ["threadId", "turn"],
		"title": "TurnCompletedNotification",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/TurnCompletedNotification.json"
	},
	"CodexTurnStartResponse": {
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": { "turn": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Turn" } },
		"required": ["turn"],
		"title": "TurnStartResponse",
		"type": "object",
		"$id": "https://openclaw.invalid/codex/v2/TurnStartResponse.json"
	}
};
// extensions/codex/src/app-server/protocol-validators.ts
function readSupervisionResponseThreadId(value) {
	const thread = isRecord(value) ? value.thread : void 0;
	return isRecord(thread) ? thread.id : void 0;
}
function resolveCodexThreadRolloutPath(thread) {
	const rolloutPath = thread.path?.trim();
	if (!rolloutPath || !path.isAbsolute(rolloutPath) || path.extname(rolloutPath) !== ".jsonl" || !path.basename(rolloutPath).includes(thread.id)) return;
	return rolloutPath;
}
function createCodexValidator(check, name) {
	return {
		check,
		errors: (value) => Errors(context, schemas[name], value)[1]
	};
}
const validateDynamicToolCallParams = createCodexValidator(isCodexDynamicToolCallParams, "CodexDynamicToolCallParams");
const validateErrorNotification = createCodexValidator(isCodexErrorNotification, "CodexErrorNotification");
const validateModelListResponse = createCodexValidator(isCodexModelListResponse, "CodexModelListResponse");
const validateThreadResumeResponse = createCodexValidator(isCodexThreadResumeResponse, "CodexThreadResumeResponse");
const validateThreadStartResponse = createCodexValidator(isCodexThreadStartResponse, "CodexThreadStartResponse");
const validateTurnCompletedNotification = createCodexValidator(isCodexTurnCompletedNotification, "CodexTurnCompletedNotification");
const validateTurnStartResponse = createCodexValidator(isCodexTurnStartResponse, "CodexTurnStartResponse");
function assertCodexThreadStartResponse(value) {
	return assertCodexShape(validateThreadStartResponse, value, "thread/start response");
}
function assertCodexThreadForkResponse(value) {
	return assertCodexShape(validateThreadStartResponse, value, "thread/fork response");
}
function assertCodexThreadResumeResponse(value) {
	return assertCodexShape(validateThreadResumeResponse, value, "thread/resume response");
}
var CodexThreadDirectInputError = class extends Error {
	constructor(threadId) {
		super(`Codex thread ${threadId} is controlled by its parent and cannot accept direct input. Continue its parent thread, or use /new for a separate OpenClaw session.`);
		this.name = "CodexThreadDirectInputError";
	}
};
/** Native V2 children allow observation, but only their parent may supply turn input. */
function assertCodexThreadAcceptsDirectInput(thread) {
	if (thread.canAcceptDirectInput === false) throw new CodexThreadDirectInputError(thread.id);
}
function assertCodexTurnStartResponse(value) {
	return assertCodexShape(validateTurnStartResponse, value, "turn/start response");
}
/** Exact input echoes and attested managed-hook continuations cannot admit native capabilities. */
function assertCodexPassiveTurnItems(items, submittedInput, taskLabel, options = {}) {
	let promptEchoSeen = false;
	for (const item of items) {
		if (item.type === "agentMessage" || item.type === "reasoning") continue;
		if (item.type === "hookPrompt" && options.allowManagedHookPrompts === true && Array.isArray(item.fragments) && item.fragments.length > 0 && item.fragments.every((fragment) => isJsonObject(fragment) && typeof fragment.text === "string" && typeof fragment.hookRunId === "string" && fragment.hookRunId.trim().length > 0)) continue;
		if (item.type === "userMessage" && !promptEchoSeen) {
			const content = Array.isArray(item.content) ? item.content : [];
			if (submittedInput.length > 0 && content.length === submittedInput.length && submittedInput.every((expected, index) => {
				const echoed = content[index];
				return expected.type === "text" && isJsonObject(echoed) && echoed.type === "text" && echoed.text === expected.text;
			})) {
				promptEchoSeen = true;
				continue;
			}
		}
		throw new Error(`Codex ${taskLabel} returned unexpected native item: ${item.type}`);
	}
}
function readCodexDynamicToolCallParams(value) {
	return readCodexShape(validateDynamicToolCallParams, value);
}
function readCodexErrorNotification(value) {
	return readCodexShape(validateErrorNotification, value);
}
function assertCodexModelListResponse(value) {
	return assertCodexShape(validateModelListResponse, value, "model/list response");
}
function readCodexTurnCompletedNotification(value) {
	const notification = readCodexShape(validateTurnCompletedNotification, value);
	return notification?.turn.status === "inProgress" ? void 0 : notification;
}
/** Normalize the native terminal snapshot once before receipt and queued projection fan-out. */
function prepareCodexServerNotification(notification, scope = readCodexNotificationScope(notification.params)) {
	return {
		...notification,
		...scope,
		completedTurn: notification.method === "turn/completed" ? readCodexTurnCompletedNotification(notification.params)?.turn : void 0
	};
}
function assertExactSupervisionModelSelection(value, expected) {
	if (value.model !== expected.model || value.modelProvider !== expected.modelProvider) throw new Error(`Codex supervision ${expected.operation} changed native model selection: ${value.modelProvider ?? "unknown"}/${value.model ?? "unknown"}`);
}
function assertCodexShape(validate, value, label) {
	if (validate.check(value)) return value;
	throw new Error(`Invalid Codex app-server ${label}: ${formatValidationErrors(validate, value)}`);
}
function readCodexShape(validate, value) {
	return validate.check(value) ? value : void 0;
}
function formatValidationErrors(validate, value) {
	const errors = validate.errors(value);
	if (!errors || errors.length === 0) return "schema validation failed";
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join("; ");
}
// extensions/codex/src/app-server/server-requests.ts
var CodexServerRequestResolvedError = class extends Error {
	constructor() {
		super("Codex server request resolved by another client");
		this.name = "CodexServerRequestResolvedError";
	}
};
/** Physical-client owner for inbound requests, cancellation, and response deadlines. */
var CodexServerRequests = class {
	constructor(respond) {
		this.respond = respond;
		this.handlers = /* @__PURE__ */ new Set();
		this.refreshWork = new AsyncWorkScope();
		this.closed = false;
		this.active = /* @__PURE__ */ new Map();
	}
	resolve(params) {
		if (!isJsonObject(params) || typeof params.threadId !== "string") return;
		const id = params.requestId;
		if (typeof id !== "string" && typeof id !== "number") return;
		const request = this.active.get(id);
		if (request?.threadId === params.threadId) {
			this.active.delete(id);
			request.controller.abort(new CodexServerRequestResolvedError());
		}
	}
	close(error) {
		this.closed = true;
		this.closing ??= this.refreshWork.drain();
		const requests = [...this.active.values()];
		this.active.clear();
		for (const request of requests) request.controller.abort(error);
		return this.closing;
	}
	async handle(request) {
		if (this.closed) return;
		const controller = new AbortController();
		const entry = {
			threadId: isJsonObject(request.params) ? request.params.threadId : void 0,
			controller
		};
		this.active.set(request.id, entry);
		const deadline = createDeferred();
		const onAbort = () => deadline.resolve(void 0);
		controller.signal.addEventListener("abort", onAbort, { once: true });
		let timeout;
		let timeoutMs = resolveDynamicToolServerRequestTimeoutMs(readCodexDynamicToolCallParams(request.params));
		let settled = false;
		let executionTimeoutResolved = false;
		const armTimeout = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				embeddedAgentLog$1.warn("codex app-server server request timed out", {
					id: request.id,
					method: request.method,
					timeoutMs
				});
				deadline.resolve(failedToolResponse(`OpenClaw dynamic tool call timed out after ${timeoutMs}ms before sending a response to Codex.`));
				controller.abort(/* @__PURE__ */ new Error("codex app-server server request timed out"));
			}, timeoutMs);
			timeout.unref?.();
		};
		const setExecutionTimeoutMs = (executionTimeoutMs) => {
			if (settled || controller.signal.aborted || executionTimeoutResolved || executionTimeoutMs !== null && (!Number.isFinite(executionTimeoutMs) || executionTimeoutMs <= 0)) return;
			executionTimeoutResolved = true;
			if (executionTimeoutMs === null) {
				clearTimeout(timeout);
				return;
			}
			timeoutMs = addSafeTimeoutDelayGraceMs(executionTimeoutMs, 3e4);
			armTimeout();
		};
		const dynamicTool = request.method === "item/tool/call";
		if (dynamicTool) armTimeout();
		const run = async () => {
			for (const handler of this.handlers) {
				if (controller.signal.aborted) return;
				const result = await handler(request, controller.signal, dynamicTool ? setExecutionTimeoutMs : void 0);
				if (result !== void 0) return result;
			}
		};
		try {
			const work = request.method === "account/chatgptAuthTokens/refresh" ? this.refreshWork.track(run) : run();
			const result = await Promise.race([work, deadline.promise]);
			if (this.active.get(request.id) === entry) this.respond({
				id: request.id,
				result: result === void 0 ? defaultServerRequestResponse(request) : result
			});
		} catch (error) {
			if (this.active.get(request.id) === entry) {
				embeddedAgentLog$1.warn("codex app-server server request handler failed", {
					id: request.id,
					method: request.method,
					error
				});
				this.respond({
					id: request.id,
					error: {
						code: -32603,
						message: coerceErrorMessage(error)
					}
				});
			}
		} finally {
			settled = true;
			clearTimeout(timeout);
			controller.signal.removeEventListener("abort", onAbort);
			if (this.active.get(request.id) === entry) this.active.delete(request.id);
		}
	}
};
function defaultServerRequestResponse(request) {
	if (request.method === "item/tool/call") return failedToolResponse("OpenClaw did not register a handler for this app-server tool call.");
	if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return { decision: "decline" };
	if (request.method === "item/permissions/requestApproval") return {
		permissions: {},
		scope: "turn"
	};
	if (request.method === "item/tool/requestUserInput") return { answers: {} };
	if (request.method === "mcpServer/elicitation/request") return createCodexElicitationResponse("decline", null, { message: "OpenClaw has no interactive handler for this elicitation." });
	return {};
}
function failedToolResponse(text) {
	return {
		contentItems: [{
			type: "inputText",
			text
		}],
		success: false
	};
}
// extensions/codex/src/app-server/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	CodexAppServerClient: () => CodexAppServerClient,
	CodexAppServerRpcError: () => CodexAppServerRpcError,
	isCodexAppServerApprovalRequest: () => isCodexAppServerApprovalRequest,
	isCodexAppServerBrokenPipeError: () => isCodexAppServerBrokenPipeError,
	isCodexAppServerIndeterminateRequestCancellationError: () => isCodexAppServerIndeterminateRequestCancellationError,
	isCodexAppServerIndeterminateTransportError: () => isCodexAppServerIndeterminateTransportError,
	isCodexAppServerOverloadError: () => isCodexAppServerOverloadError,
	isCodexAppServerPrewriteRequestCancellationError: () => isCodexAppServerPrewriteRequestCancellationError,
	isCodexAppServerRequestTimeoutError: () => isCodexAppServerRequestTimeoutError,
	isUnsupportedCodexAppServerVersionError: () => isUnsupportedCodexAppServerVersionError
});
const CODEX_APP_SERVER_STDERR_TAIL_MAX = 2e3;
const CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES = 3;
const CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS = 50;
function isCodexAppServerRequestTimeoutError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "reason" in error && error.reason === "timed out";
}
var CodexAppServerIndeterminateTransportError = class extends Error {
	constructor(method, cause) {
		super(`${method} transport failed after request write: ${cause.message}`, { cause });
		this.code = "CODEX_APP_SERVER_REQUEST_TRANSPORT_INDETERMINATE";
		this.mayHaveWritten = true;
		this.name = "CodexAppServerIndeterminateTransportError";
	}
};
/** True when a local cancellation can leave an app-server request in flight. */
function isCodexAppServerIndeterminateRequestCancellationError(error) {
	return hasRequestWriteState(error, "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED", true);
}
/** True when local cancellation happened before a request write was attempted. */
function isCodexAppServerPrewriteRequestCancellationError(error) {
	return hasRequestWriteState(error, "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED", false);
}
/** True when transport failure cannot prove a written request stopped running. */
function isCodexAppServerIndeterminateTransportError(error) {
	return hasRequestWriteState(error, "CODEX_APP_SERVER_REQUEST_TRANSPORT_INDETERMINATE", true);
}
function hasRequestWriteState(error, code, written) {
	return error instanceof Error && "code" in error && error.code === code && "mayHaveWritten" in error && error.mayHaveWritten === written;
}
var CodexAppServerClient = class CodexAppServerClient {
	constructor(child) {
		this.instanceId = randomUUID();
		this.catalogWorker = new CodexCatalogWorker();
		this.pending = /* @__PURE__ */ new Map();
		this.serverRequests = new CodexServerRequests((response) => this.writeMessage(response));
		this.notificationDispatch = new CodexAppServerNotifications();
		this.closeHandlers = /* @__PURE__ */ new Set();
		this.nextId = 1;
		this.initialized = false;
		this.modelCatalogRevision = 0;
		this.closed = false;
		this.transportExited = false;
		this.nativeExecutionObserved = false;
		this.stderrTail = "";
		this.privateTransportSecrets = /* @__PURE__ */ new Set();
		this.privateStderrPending = "";
		this.writeMessage = createCodexAppServerMessageWriter({
			getTransport: () => this.child,
			isClosed: () => this.closed,
			onNativeExecution: () => {
				this.nativeExecutionObserved = true;
			}
		});
		this.child = child;
		this.closeMessageReader = listenCodexAppServerLines(child.stdout, (line) => {
			const route = readCodexCatalogDecodeRoute(line);
			if (route) return this.decodeCatalogLine(line, route);
			return this.handleParsedMessage(parseCodexAppServerMessage(line.toString("utf8"), logCodexAppServerParseFailure));
		}, (error) => this.closeWithError(toStringifiedError(error)));
		child.stdout.on("error", (error) => this.closeWithError(toStringifiedError(error)));
		observeCodexAppServerStderr(child.stderr, (chunk) => {
			const text = this.redactPrivateStderr(chunk);
			this.stderrTail = appendBoundedTail(this.stderrTail, text, CODEX_APP_SERVER_STDERR_TAIL_MAX);
		});
		child.once("error", (error) => this.closeWithError(toStringifiedError(error)));
		child.once("exit", (code, signal) => {
			this.transportExited = true;
			this.closeWithError(child.startupFailure?.error ?? child.exitError ?? buildCodexAppServerExitError(code, signal, this.stderrTail));
		});
		child.stdin.on?.("error", (error) => this.closeWithError(toStringifiedError(error)));
	}
	static async start(options, assertCurrent) {
		const defaults = resolveCodexAppServerRuntimeOptions().start;
		const startOptions = {
			...defaults,
			...options,
			headers: options?.headers ?? defaults.headers
		};
		if (startOptions.transport === "stdio" && startOptions.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
		if (startOptions.transport === "websocket" || startOptions.transport === "unix") {
			await assertCurrent?.();
			return new CodexAppServerClient(createWebSocketTransport(startOptions));
		}
		let client;
		try {
			await createStdioTransport(startOptions, process.env, assertCurrent, (child) => {
				client = new CodexAppServerClient(child);
			});
			return client;
		} catch (error) {
			await assertCurrent?.();
			if (client?.transportExited && hasCodexAppServerNaturalExit(client.child)) throw client.child.startupFailure?.error ?? buildCodexAppServerExitError(client.child.exitCode, client.child.signalCode, client.stderrTail);
			const stderr = client?.getStderrDiagnostic();
			throw stderr ? new Error(`${coerceErrorMessage(error)}; stderr=${JSON.stringify(stderr)}`, { cause: error }) : error;
		}
	}
	/** Wraps an externally owned transport, including worker duplex connections. */
	static fromTransport(child) {
		return new CodexAppServerClient(child);
	}
	async initialize() {
		if (this.initialized) return;
		const response = await this.request("initialize", buildCodexAppServerInitializeParams()).catch(async (error) => {
			if (this.closed && this.child.startupFailure) {
				await closeCodexAppServerTransportAndWait(this.child, { drainStdio: true });
				throw this.child.startupFailure.error ?? error;
			}
			throw error;
		});
		this.child.startupFailure?.complete();
		const serverVersion = assertSupportedCodexAppServerVersion(response);
		this.runtimeIdentity = buildCodexAppServerRuntimeIdentity(response, serverVersion);
		this.notify("initialized");
		this.initialized = true;
	}
	/** Outstanding methods across this physical client, including peer turns; never arguments. */
	getPendingRequestMethods() {
		return [...new Set([...this.pending.values()].map(({ method }) => method))].toSorted();
	}
	getServerVersion() {
		return this.runtimeIdentity?.serverVersion;
	}
	getRuntimeIdentity() {
		return this.runtimeIdentity ? { ...this.runtimeIdentity } : void 0;
	}
	/** Returns a bounded, redacted stderr diagnostic from the app-server process. */
	getStderrDiagnostic() {
		return redactCodexAppServerLinePreview(this.stderrTail) || void 0;
	}
	/** Returns the terminal transport error that closed this physical client. */
	getCloseError() {
		return this.closeError;
	}
	/** Stable generation id for this exact physical client instance. */
	getInstanceId() {
		return this.instanceId;
	}
	/** Account/config observations become stale before a mutation can enter the wire. */
	getModelCatalogRevision() {
		return this.modelCatalogRevision;
	}
	/** Returns the local transport PID for scoped child-process cleanup, when available. */
	getTransportPid() {
		return this.child.pid;
	}
	request(method, params, optionsInput) {
		const options = optionsInput ?? {};
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false, options.signal?.reason));
		return this.requestWithOverloadRetry(method, params, options);
	}
	async requestWithOverloadRetry(method, params, options) {
		const deadline = options.timeoutMs !== void 0 && Number.isFinite(options.timeoutMs) ? performance.now() + options.timeoutMs : void 0;
		for (let retry = 0;; retry += 1) {
			const remainingTimeoutMs = remainingCodexRequestTime(method, options.signal, deadline);
			try {
				return await this.requestOnce(method, params, {
					...options,
					...remainingTimeoutMs !== void 0 ? { timeoutMs: remainingTimeoutMs } : {}
				}, retry + 1, deadline);
			} catch (error) {
				if (!isCodexAppServerOverloadError(error) || retry >= CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES) throw error;
				const backoffMs = Math.round(CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS * 2 ** retry * (.75 + Math.random() * .5));
				await this.waitForOverloadRetry(method, backoffMs, deadline, options.signal);
			}
		}
	}
	async waitForOverloadRetry(method, backoffMs, deadline, signal) {
		const remainingMs = remainingCodexRequestTime(method, signal, deadline);
		const delayMs = remainingMs === void 0 ? backoffMs : Math.min(backoffMs, remainingMs);
		try {
			await sleepWithAbort(delayMs, signal, { ref: false });
		} catch (error) {
			remainingCodexRequestTime(method, signal);
			throw error;
		}
	}
	requestOnce(method, params, options, overloadAttemptOrdinal, deadline) {
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		const id = codexCatalogRequestId(method, params, this.nextId++, options.catalogPreview);
		if (method === "account/login/start" || method === "account/logout" || method === "config/value/write" || method === "config/batchWrite") this.modelCatalogRevision += 1;
		const message = {
			id,
			method,
			params
		};
		const attempt = createCodexRequestAttempt({
			method,
			...method === "thread/list" ? { diagnosticIdentity: {
				clientInstanceId: this.instanceId,
				rpcId: id
			} } : {},
			onIngressRejected: options.onIngressRejected,
			onSettled: () => {
				if (this.pending.get(id) === attempt) this.pending.delete(id);
			},
			cancellationError: (reason, written, cause) => new CodexAppServerLocalRequestCancellationError(method, reason, written, cause),
			localError: (error, written) => written && !isCodexAppServerIndeterminateRequestCancellationError(error) && !isCodexAppServerIndeterminateTransportError(error) ? new CodexAppServerIndeterminateTransportError(method, error) : error
		});
		this.pending.set(id, attempt);
		if (options.catalogPreview) attempt.catalogProjection = {
			preview: options.catalogPreviewCache,
			remainingRows: options.catalogRows,
			singleThread: method === "thread/list" && isJsonObject(params) && params.limit === 1
		};
		const result = attempt.wait({
			...options,
			overloadAttemptOrdinal
		});
		dispatchCodexRequestAttempt(attempt, options, () => {
			if (this.closed) throw this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed");
			remainingCodexRequestTime(method, options.signal, deadline);
		}, () => {
			this.writeMessage(message, (error) => attempt.failLocal(error), () => attempt.markWritten());
		});
		return result;
	}
	notify(method, params) {
		this.writeMessage({
			method,
			params
		});
	}
	addRequestHandler(handler) {
		this.serverRequests.handlers.add(handler);
		return () => this.serverRequests.handlers.delete(handler);
	}
	addNotificationHandler(handler) {
		return this.notificationDispatch.addHandler(handler);
	}
	addCloseHandler(handler) {
		this.closeHandlers.add(handler);
		return () => this.closeHandlers.delete(handler);
	}
	/** Registers a handler for physical transport exit and returns its disposer. */
	addTransportExitHandler(handler) {
		if (this.transportExited) {
			handler(this);
			return () => void 0;
		}
		const onExit = () => handler(this);
		this.child.once("exit", onExit);
		return () => this.child.off?.("exit", onExit);
	}
	close(options) {
		this.closeWithError(/* @__PURE__ */ new Error("codex app-server client is closed"), options);
	}
	async closeAndWait(options) {
		this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"));
		const [result] = await Promise.all([closeCodexAppServerTransportAndWait(this.child, {
			...options,
			gracefulExit: Boolean(this.child.pid) && !this.nativeExecutionObserved
		}), this.waitForCloseWork()]);
		if (this.nativeExecutionObserved) return {
			...result,
			cleanup: "uncertain"
		};
		if (result.cleanup === "terminated") embeddedAgentLog$1.warn("Codex app-server required forced shutdown; process cleanup confirmed");
		return result;
	}
	/** Joins local settlement already started by close without changing transport policy. */
	async waitForCloseWork() {
		await this.serverRequestsClosed;
		await this.catalogWorkerClosed;
	}
	/** Protect private loopback route capabilities before native diagnostics can mention them. */
	protectPrivateTransportSecret(secret) {
		if (!/^[A-Za-z0-9_-]{43}$/.test(secret) || this.privateTransportSecrets.size >= 8) {
			if (!this.privateTransportSecrets.has(secret)) throw new Error("Invalid private Codex transport capability");
		}
		this.privateTransportSecrets.add(secret);
	}
	redactPrivateStderr(chunk) {
		let text = this.privateStderrPending + chunk;
		for (const secret of this.privateTransportSecrets) text = text.replaceAll(secret, "[REDACTED]");
		let held = 0;
		for (const secret of this.privateTransportSecrets) for (let length = 1; length < secret.length; length++) if (text.endsWith(secret.slice(0, length))) held = Math.max(held, length);
		this.privateStderrPending = held ? text.slice(-held) : "";
		return held ? text.slice(0, -held) : text;
	}
	handleParsedMessage(parsed, preview) {
		if (this.closed || !parsed || typeof parsed !== "object") return;
		const message = parsed;
		if (isRpcResponse(message)) {
			this.nativeExecutionObserved = dispatchCodexAppServerResponse(message, this.pending, codexCatalogSourceForClient(this), preview) || this.nativeExecutionObserved;
			return;
		}
		if (!("method" in message)) return;
		if ("id" in message && message.id !== void 0) {
			this.serverRequests.handle({
				id: message.id,
				method: message.method,
				params: message.params
			});
			return;
		}
		this.handleNotification({
			method: message.method,
			params: message.params
		});
	}
	async decodeCatalogLine(line, route) {
		const decoded = await this.catalogWorker.decode(line, route, this.pending);
		if (!decoded || this.closed) return;
		for (const failure of decoded.failures) logCodexAppServerParseFailure(failure);
		if (decoded.projectionError) this.pending.get(decoded.projectionError.id)?.reject(decoded.projectionError.error, false);
		else if (decoded.message) this.handleParsedMessage(decoded.message, decoded.preview);
	}
	handleNotification(notification) {
		const params = notification.params;
		if (notification.method === "serverRequest/resolved") this.serverRequests.resolve(params);
		if (notification.method === "item/commandExecution/outputDelta" || notification.method === "item/commandExecution/terminalInteraction" || isJsonObject(params) && (isJsonObject(params.item) && params.item.type === "commandExecution" || isJsonObject(params.turn) && Array.isArray(params.turn.items) && params.turn.items.some((item) => isJsonObject(item) && item.type === "commandExecution"))) this.nativeExecutionObserved = true;
		if (notification.method === "account/updated") this.modelCatalogRevision += 1;
		this.notificationDispatch.dispatch(notification);
	}
	closeWithError(error, options) {
		if (this.markClosed(error)) closeCodexAppServerTransport(this.child, {
			...options,
			drainStdio: !this.initialized && this.child.startupFailure !== void 0,
			gracefulExit: Boolean(this.child.pid) && !this.nativeExecutionObserved
		});
	}
	markClosed(error) {
		if (this.closed) return false;
		this.closed = true;
		closeCodexCatalogClientSource(this);
		materializeErrorStack(error);
		this.closeError = error;
		this.closeMessageReader();
		this.catalogWorkerClosed = this.catalogWorker.close(error);
		this.catalogWorkerClosed?.catch((closeError) => {
			embeddedAgentLog$1.warn("codex catalog worker shutdown failed", { error: closeError });
		});
		this.serverRequestsClosed = this.serverRequests.close(error);
		for (const pending of this.pending.values()) pending.close(error);
		this.pending.clear();
		for (const handler of this.closeHandlers) try {
			handler(this);
		} catch (closeError) {
			embeddedAgentLog$1.warn("codex app-server close handler failed", { error: closeError });
		}
		return true;
	}
};
const CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS = /* @__PURE__ */ new Set([
	"item/commandExecution/requestApproval",
	"item/fileChange/requestApproval",
	"item/permissions/requestApproval"
]);
function isCodexAppServerApprovalRequest(method) {
	return CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS.has(method);
}
export { toCodexDynamicToolProgressResponse as A, isCodexNotificationForTurn as C, createCodexElicitationResponse as D, readCodexNotificationTurnId as E, readCodexAppServerWarningMessage as F, isCodexAppServerBrokenPipeError as I, resolveCodexToolAbortTerminalReason as M, createFailedDynamicToolResponse as N, handleDynamicToolCallWithTimeout as O, failedToolResult as P, resolveCodexThreadRolloutPath as S, readCodexNotificationThreadId as T, assertExactSupervisionModelSelection as _, isCodexAppServerIndeterminateTransportError as a, readCodexErrorNotification as b, CodexServerRequestResolvedError as c, assertCodexPassiveTurnItems as d, assertCodexThreadAcceptsDirectInput as f, assertCodexTurnStartResponse as g, assertCodexThreadStartResponse as h, isCodexAppServerIndeterminateRequestCancellationError as i, toCodexDynamicToolProtocolResponse as j, resolveDynamicToolCallTimeoutMs as k, CodexThreadDirectInputError as l, assertCodexThreadResumeResponse as m, client_exports as n, isCodexAppServerPrewriteRequestCancellationError as o, assertCodexThreadForkResponse as p, isCodexAppServerApprovalRequest as r, isCodexAppServerRequestTimeoutError as s, CodexAppServerClient as t, assertCodexModelListResponse as u, prepareCodexServerNotification as v, readCodexNotificationScope as w, readSupervisionResponseThreadId as x, readCodexDynamicToolCallParams as y };
