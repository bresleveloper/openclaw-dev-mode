import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { p as resolveCodexAppServerUserHomeDir } from "./config-security-BEReZ6go.mjs";
import { d as recordCodexCatalogResponseSource, i as reuseCodexCatalogPreview, o as closeCodexCatalogClientSource, s as codexCatalogSourceForClient } from "./session-catalog-native-projection-DowriLid.mjs";
import { a as stringifyCodexAppServerMessage, c as isRpcResponse, i as readCodexCatalogDecodeRoute, n as projectCodexCatalogMessage, o as CodexAppServerMessageDecoder, r as listenCodexAppServerLines, s as redactCodexAppServerLinePreview } from "./client-catalog-response-BMgt_4q4.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { c as MIN_SUPPORTED_CODEX_APP_SERVER_VERSION, s as CODEX_APP_SERVER_VERSION } from "./managed-binary-BnshlFag.mjs";
import { a as closeCodexAppServerTransportAndWait, i as closeCodexAppServerTransport, o as hasCodexAppServerNaturalExit, t as createStdioTransport } from "./transport-stdio-h2VHOskC.mjs";
import { a as CODEX_APP_SERVER_OVERLOADED_ERROR_CODE, o as CodexAppServerRpcError } from "./timeout-C910MdAB.mjs";
import "./config-BoTP_mrL.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { codexCatalogPageWorkerEntrypoint } from "../catalog-page-worker-entrypoint.js";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { addSafeTimeoutDelayGraceMs, addTimerTimeoutGraceMs, parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { normalizeJsonSchemaForTypeBox } from "openclaw/plugin-sdk/json-schema-runtime";
import path from "node:path";
import { EventEmitter } from "node:events";
import { coerceErrorMessage, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { hasPendingInternalDiagnosticEvent } from "openclaw/plugin-sdk/diagnostic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { OPENCLAW_VERSION, embeddedAgentLog, formatToolExecutionErrorMessage, normalizeQuestionTimeoutSeconds, resolveToolExecutionErrorKind } from "openclaw/plugin-sdk/agent-harness-runtime";
import { parse } from "semver";
import { copyInternalToolResultState, runWithAsyncWorkResources } from "openclaw/plugin-sdk/agent-harness-tool-runtime";
import { Compile } from "typebox/compile";
import net from "node:net";
import { PassThrough, Writable } from "node:stream";
import { StringDecoder } from "node:string_decoder";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
//#region extensions/codex/src/app-server/client-catalog-worker.ts
const INLINE_CATALOG_MAX_BYTES = 65536;
/** Late responses retain their decode route after cancellation removes the waiter. */
function codexCatalogRequestId(method, params, sequence, catalogPreview) {
	const kind = catalogPreview ? method === "thread/list" ? "list" : method === "thread/read" && isJsonObject(params) && params.includeTurns !== true ? "thread" : void 0 : void 0;
	return kind ? Number.MAX_SAFE_INTEGER - 2 * sequence - (kind === "thread" ? 1 : 0) : sequence;
}
/** Each physical client owns one decoder, including incomplete-line recovery state. */
var CodexCatalogWorker = class {
	constructor() {
		this.closed = false;
	}
	get continuation() {
		return this.continuationRoute;
	}
	async decode(line, route, attempts, projections) {
		if (this.closed) return;
		if (!this.continuationRoute && route !== "unresolved" && line.byteLength <= INLINE_CATALOG_MAX_BYTES) {
			let parsed;
			try {
				parsed = JSON.parse(line.toString("utf8"));
			} catch {}
			if (parsed !== void 0) {
				await Promise.resolve();
				if (this.closed) return;
				const attempt = attempts.get(route.id);
				const projection = attempt ? projections.get(attempt) : void 0;
				return projectCodexCatalogMessage(parsed, {
					route,
					remainingRows: attempt ? projection?.remainingRows : 0
				}, projection?.preview);
			}
		}
		if (!this.pool) {
			const { resolveRuntimeWorkerUrl, WorkerTaskPool } = await import("openclaw/plugin-sdk/process-runtime");
			if (this.closed) return;
			this.pool = new WorkerTaskPool({
				workerUrl: resolveRuntimeWorkerUrl(codexCatalogPageWorkerEntrypoint),
				maxWorkers: 1,
				maxPendingTasks: 1,
				maxPendingBytes: Number.MAX_SAFE_INTEGER,
				idleTimeoutMs: 0,
				restartOnError: false
			});
		}
		const attempt = route === "unresolved" ? void 0 : attempts.get(route.id);
		const remainingRows = attempt ? projections.get(attempt)?.remainingRows : 0;
		let catalogRows;
		if (route === "unresolved") {
			catalogRows = /* @__PURE__ */ new Map();
			for (const [id, pending] of attempts) {
				const projection = projections.get(pending);
				if (typeof id === "number" && projection) catalogRows.set(id, projection.remainingRows);
			}
		}
		const bytes = line.byteOffset === 0 && line.byteLength === line.buffer.byteLength && line.buffer instanceof ArrayBuffer ? new Uint8Array(line.buffer) : Uint8Array.from(line);
		const decoded = await this.pool.run({
			bytes,
			route,
			remainingRows,
			catalogRows
		}, {
			inputBytes: bytes.byteLength,
			transferList: (input) => [input.bytes.buffer]
		});
		if (this.closed) return;
		this.continuationRoute = decoded.pending ? route : void 0;
		return decoded;
	}
	close(error) {
		this.closed = true;
		this.continuationRoute = void 0;
		return this.pool?.close(error) ?? Promise.resolve();
	}
};
//#endregion
//#region extensions/codex/src/app-server/client-diagnostics.ts
function observeCodexAppServerStderr(stderr, consume) {
	stderr.setEncoding("utf8");
	stderr.on("data", (chunk) => {
		const text = consume(chunk).trim();
		if (text) embeddedAgentLog.debug(`codex app-server stderr: ${text}`);
	});
	stderr.on("error", (error) => embeddedAgentLog.warn("codex app-server stderr stream failed", { error }));
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
function logCodexAppServerParseFailure(value, error, fragmentCount) {
	const linePreview = redactCodexAppServerLinePreview(value);
	const suffix = fragmentCount > 1 ? ` fragments=${fragmentCount}` : "";
	embeddedAgentLog.warn("failed to parse codex app-server message", {
		error,
		errorMessage: coerceErrorMessage(error),
		fragmentCount,
		linePreview,
		consoleMessage: `failed to parse codex app-server message${suffix}: preview=${JSON.stringify(linePreview)}`
	});
}
function formatExitValue(value) {
	if (value === null || value === void 0) return "null";
	if (typeof value === "string" || typeof value === "number") return String(value);
	return "unknown";
}
//#endregion
//#region extensions/codex/src/app-server/notification-policy.ts
const CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS = [
	"account/login/completed",
	"app/list/updated",
	"command/exec/outputDelta",
	"deprecationNotice",
	"externalAgentConfig/import/completed",
	"externalAgentConfig/import/progress",
	"fs/changed",
	"fuzzyFileSearch/sessionCompleted",
	"fuzzyFileSearch/sessionUpdated",
	"mcpServer/event/stream/notification",
	"mcpServer/oauthLogin/completed",
	"mcpServer/startupStatus/updated",
	"process/exited",
	"process/outputDelta",
	"project/changed",
	"remoteControl/status/changed",
	"thread/environment/connected",
	"thread/environment/disconnected",
	"thread/goal/cleared",
	"thread/project/updated",
	"thread/queue/changed",
	"thread/realtime/closed",
	"thread/realtime/error",
	"thread/realtime/item/completed",
	"thread/realtime/item/started",
	"thread/realtime/item/transcript/delta",
	"thread/realtime/itemAdded",
	"thread/realtime/outputAudio/delta",
	"thread/realtime/sdp",
	"thread/realtime/started",
	"thread/realtime/transcript/delta",
	"thread/realtime/transcript/done",
	"windows/worldWritableWarning",
	"windowsSandbox/setupCompleted",
	"turn/diff/updated",
	"item/fileChange/outputDelta",
	"thread/compacted"
];
//#endregion
//#region extensions/codex/src/app-server/client-initialize.ts
function buildCodexAppServerInitializeParams() {
	return {
		clientInfo: {
			name: "openclaw",
			title: "OpenClaw",
			version: OPENCLAW_VERSION
		},
		capabilities: {
			experimentalApi: true,
			optOutNotificationMethods: [...CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS],
			extensions: {
				"openai/standard-form-input": {},
				"openai/form": {},
				"io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] }
			}
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/client-response.ts
/** Settles one wire attempt and reports newly observed native execution. */
function dispatchCodexAppServerResponse(response, attempts, catalogResponses, source, previewStates) {
	const pending = attempts.get(response.id);
	if (!pending) return false;
	attempts.delete(response.id);
	if (response.error) {
		const error = new CodexAppServerRpcError(response.error, pending.method);
		pending.reject(error, error.code === CODEX_APP_SERVER_OVERLOADED_ERROR_CODE);
		return false;
	}
	const nativeExecution = pending.method === "thread/backgroundTerminals/list" && isJsonObject(response.result) && Array.isArray(response.result.data) && response.result.data.length > 0;
	const cache = catalogResponses.get(pending)?.preview;
	if (cache && previewStates && isJsonObject(response.result) && Array.isArray(response.result.data)) try {
		for (const [index, row] of response.result.data.entries()) if (isJsonObject(row) && typeof row.id === "string" && row.ephemeral !== true) {
			const preview = reuseCodexCatalogPreview({
				id: row.id,
				path: typeof row.path === "string" ? row.path : null,
				updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : null,
				recencyAt: typeof row.recencyAt === "number" ? row.recencyAt : null
			}, previewStates[index], cache);
			if (preview !== void 0) row.preview = preview;
		}
	} catch (error) {
		pending.reject(error instanceof Error ? error : new Error("Codex catalog projection failed", { cause: error }), false);
		return false;
	}
	recordCodexCatalogResponseSource(pending.method, response.result, source);
	pending.resolve(response.result);
	return nativeExecution;
}
//#endregion
//#region extensions/codex/src/app-server/request-attempt.ts
/** One wire attempt; local waiter expiry need not imply a native response. */
function createCodexRequestAttempt(params) {
	let pending = true;
	let mayHaveWritten = false;
	const waiters = /* @__PURE__ */ new Set();
	const diagnostics = params.diagnosticIdentity ? {
		...params.diagnosticIdentity,
		waiterOrdinal: 0,
		attemptCreatedAtMs: performance.now(),
		firstPossibleWriteAtMs: null,
		wireOutcomeAtWaiterSettlement: "retained-pending",
		wireObservedAtMs: null
	} : void 0;
	const finish = (outcome) => {
		if (!pending) return false;
		pending = false;
		if (diagnostics) {
			diagnostics.wireOutcomeAtWaiterSettlement = outcome;
			diagnostics.wireObservedAtMs = performance.now();
		}
		params.onSettled();
		return true;
	};
	const rejectWaiters = (error, outcome) => {
		for (const waiter of waiters) waiter.reject(error, outcome);
	};
	const currentWaiterError = (waiter) => {
		if (!params.retainWritten) return;
		if (waiter.signal?.aborted) return {
			error: params.cancellationError("aborted", mayHaveWritten, waiter.signal.reason),
			outcome: "aborted"
		};
		if (waiter.deadline !== void 0 && performance.now() >= waiter.deadline) return {
			error: params.cancellationError("timed out", mayHaveWritten),
			outcome: "timed-out"
		};
		try {
			waiter.assertCurrent?.();
		} catch (error) {
			return {
				error: toStringifiedError(error),
				outcome: "authority-rejected"
			};
		}
		if (waiter.signal?.aborted) return {
			error: params.cancellationError("aborted", mayHaveWritten, waiter.signal.reason),
			outcome: "aborted"
		};
		if (waiter.deadline !== void 0 && performance.now() >= waiter.deadline) return {
			error: params.cancellationError("timed out", mayHaveWritten),
			outcome: "timed-out"
		};
	};
	return {
		method: params.method,
		get pending() {
			return pending;
		},
		wait(options, deadline) {
			const { timeoutMs, signal, assertCurrent, disposition, overloadAttemptOrdinal } = options;
			let observe = options.attemptWaiterFinished;
			return new Promise((resolve, reject) => {
				if (!pending) {
					reject(/* @__PURE__ */ new Error("Codex request attempt is already settled"));
					return;
				}
				let timer;
				let removeAbort;
				const waiterOrdinal = diagnostics ? ++diagnostics.waiterOrdinal : 0;
				const waiterAttachedAtMs = diagnostics && observe ? performance.now() : 0;
				const cleanup = () => {
					clearTimeout(timer);
					timer = void 0;
					removeAbort?.();
					removeAbort = void 0;
				};
				const detach = (waiterOutcome) => {
					if (!waiters.delete(waiter)) return false;
					cleanup();
					if (waiters.size === 0 && (!params.retainWritten || !mayHaveWritten)) finish(mayHaveWritten ? "correlation-closed" : "not-written");
					const callback = observe;
					observe = void 0;
					if (diagnostics && callback) try {
						callback({
							...diagnostics,
							waiterOrdinal,
							disposition,
							overloadAttemptOrdinal,
							waiterAttachedAtMs,
							waiterSettledAtMs: performance.now(),
							waiterOutcome
						});
					} catch {}
					return true;
				};
				const waiter = {
					resolve: (value) => {
						if (!detach("resolved")) return;
						resolve(value);
					},
					reject: (error, outcome) => {
						if (detach(outcome)) reject(error);
					},
					cleanup,
					signal,
					...params.retainWritten ? {
						deadline,
						assertCurrent
					} : {}
				};
				waiters.add(waiter);
				if (params.retainWritten && deadline !== void 0 && performance.now() >= deadline) {
					waiter.reject(params.cancellationError("timed out", mayHaveWritten), "timed-out");
					return;
				}
				if (timeoutMs && Number.isFinite(timeoutMs) && timeoutMs > 0) {
					const remaining = params.retainWritten && deadline !== void 0 ? deadline - performance.now() : timeoutMs;
					timer = setTimeout(() => waiter.reject(params.cancellationError("timed out", mayHaveWritten), "timed-out"), Math.max(params.retainWritten ? 1 : 100, remaining));
					timer.unref?.();
				}
				if (signal) {
					const abort = () => waiter.reject(params.cancellationError("aborted", mayHaveWritten, signal.reason), "aborted");
					signal.addEventListener("abort", abort, { once: true });
					removeAbort = () => signal.removeEventListener("abort", abort);
					if (signal.aborted) abort();
				}
			});
		},
		resolve(value) {
			if (!finish("native-ok")) return;
			params.onResponse?.(mayHaveWritten);
			for (const waiter of waiters) {
				const error = currentWaiterError(waiter);
				if (error) waiter.reject(error.error, error.outcome);
				else waiter.resolve(value);
			}
		},
		reject(error, definitelyNotEnqueued = false) {
			if (finish(definitelyNotEnqueued ? "ingress-rejected" : "native-error")) {
				if (definitelyNotEnqueued) mayHaveWritten = false;
				params.onResponse?.(mayHaveWritten);
				for (const waiter of waiters) {
					const current = currentWaiterError(waiter);
					waiter.reject(current?.error ?? params.localError(error, mayHaveWritten), current?.outcome ?? "native-error");
				}
			}
		},
		close(error) {
			if (finish("correlation-closed")) rejectWaiters(params.localError(error, mayHaveWritten), "client-closed");
		},
		failLocal(error) {
			if (!pending) return;
			if (!params.retainWritten || !mayHaveWritten) finish(mayHaveWritten ? "correlation-closed" : "not-written");
			rejectWaiters(params.localError(error, mayHaveWritten), "local-failed");
		},
		markWritten() {
			mayHaveWritten = true;
			if (diagnostics && diagnostics.firstPossibleWriteAtMs === null) diagnostics.firstPossibleWriteAtMs = performance.now();
		},
		cleanup() {
			for (const waiter of waiters) waiter.cleanup();
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-response-state.ts
function createFailedDynamicToolResponse(message, options) {
	return {
		contentItems: [{
			type: "inputText",
			text: message
		}],
		success: false,
		diagnosticTerminalReason: options?.terminalReason ?? "failed",
		diagnosticTerminalType: "error",
		executionStarted: options?.executionStarted,
		executedArguments: options?.executedArguments,
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
//#endregion
//#region extensions/codex/src/app-server/tool-abort-terminal-reason.ts
/** Leaf helper shared by native and dynamic tool diagnostics. */
const CODEX_TIMEOUT_ABORT_REASONS = /* @__PURE__ */ new Set([
	"codex_startup_timeout",
	"turn_completion_idle_timeout",
	"turn_progress_idle_timeout",
	"turn_terminal_idle_timeout"
]);
/** Preserves timeout provenance when an enclosing run aborts an active tool. */
function resolveCodexToolAbortTerminalReason(signal) {
	try {
		const reason = signal.reason;
		if (typeof reason === "string") {
			if (CODEX_TIMEOUT_ABORT_REASONS.has(reason)) return "timed_out";
			return reason === "client_closed" ? "failed" : "cancelled";
		}
		if (reason && typeof reason === "object") {
			const record = reason;
			if (record.name === "TimeoutError" || record.reason === "timeout") return "timed_out";
		}
	} catch {
		return "cancelled";
	}
	return "cancelled";
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-execution.ts
/**
* Timeout, terminal-release, and diagnostic helpers for Codex dynamic tool
* calls.
*/
/** Default timeout for Codex dynamic tool calls. */
const CODEX_DYNAMIC_TOOL_TIMEOUT_MS = 9e4;
/** Hard cap for ordinary per-call Codex dynamic tool timeout overrides. */
const CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS = 6e5;
const CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS = 3e4;
const CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS = 12e4;
const CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS = 3e4;
const CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS = 3e4;
/** Timeout for image-understanding style dynamic tool calls. */
const CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS = 6e4;
/** Timeout for message-delivery dynamic tool calls. */
const CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS = 6e5;
/** Outer default for collector waits: full swarm budget plus completion grace. */
const CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS = 63e4;
const LOG_FIELD_MAX_LENGTH = 160;
function normalizeLogField(value) {
	if (typeof value !== "string") return;
	const normalized = value.replaceAll(String.fromCharCode(27), " ").replaceAll("\r", " ").replaceAll("\n", " ").replaceAll("	", " ").trim();
	if (!normalized) return;
	return normalized.length > LOG_FIELD_MAX_LENGTH ? `${truncateUtf16Safe(normalized, 157)}...` : normalized;
}
function readNumericTimeoutMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
	if (typeof value === "string") {
		const parsed = parseStrictNonNegativeInteger(value);
		if (parsed !== void 0) return Math.max(0, Math.floor(parsed));
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
	return await runWithAsyncWorkResources((onAcquired) => executeDynamicToolCallWithTimeout(params, (release) => onAcquired({
		release,
		releaseBeforeResultWhenIdle: true
	})));
}
async function executeDynamicToolCallWithTimeout(params, retainCleanup) {
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
			...!response.success ? { failure: { error: readDynamicToolResponseText(response) } } : {}
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
			embeddedAgentLog.warn(`onAgentToolResult handler failed: tool=${params.call.tool} error=${message}`);
		}
	};
	const notifyFailedToolResult = (message, terminalReason = "failed") => {
		notifyAgentToolResult({
			toolName: params.call.tool,
			result: {
				content: [{
					type: "text",
					text: message
				}],
				details: {
					status: terminalReason,
					error: message
				}
			},
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
	let resolveAbort;
	const abortFromRun = () => {
		const message = "OpenClaw dynamic tool call aborted.";
		const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
		controller.abort(params.signal.reason ?? /* @__PURE__ */ new Error(message));
		if (toolCallSettled) return;
		params.onFallbackSelected?.();
		notifyFailedToolResult(message, terminalReason);
		resolveAbort?.(createFailedAfterPossibleDispatch(message, terminalReason));
	};
	const releaseOperation = () => {
		if (operationReleased) return;
		operationReleased = true;
		params.signal.removeEventListener("abort", abortFromRun);
		if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("OpenClaw dynamic tool call finished."));
	};
	retainCleanup(releaseOperation);
	const abortPromise = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const timeoutPromise = new Promise((resolve) => {
		const { timeoutMs } = params;
		timeout = setTimeout(() => {
			timedOut = true;
			const timeoutDetails = formatDynamicToolTimeoutDetails({
				call: params.call,
				timeoutMs
			});
			params.onFallbackSelected?.();
			controller.abort(new Error(timeoutDetails.responseMessage));
			params.onTimeout?.();
			embeddedAgentLog.warn("codex dynamic tool call timed out", {
				...timeoutDetails.meta,
				consoleMessage: timeoutDetails.consoleMessage
			});
			notifyFailedToolResult(timeoutDetails.responseMessage, "timed_out");
			resolve(createFailedAfterPossibleDispatch(timeoutDetails.responseMessage, "timed_out"));
		}, timeoutMs);
		timeout.unref?.();
	});
	try {
		params.signal.addEventListener("abort", abortFromRun, { once: true });
		if (params.signal.aborted) abortFromRun();
		const response = await Promise.race([
			params.toolBridge.handleToolCall(params.call, {
				signal: controller.signal,
				onAgentToolResult: notifyAgentToolResult,
				toolCallOrdinal: params.toolCallOrdinal,
				retainExecutionSnapshot: true
			}),
			abortPromise,
			timeoutPromise
		]);
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
		if (timeout) clearTimeout(timeout);
		toolCallSettled = true;
		resolveAbort = void 0;
		if (!completedSuccessfully || timedOut || controller.signal.aborted) releaseOperation();
	}
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
/** Adds async-started progress details when a tool result continues out of band. */
function toCodexDynamicToolProgressResponse(response, protocolResponse) {
	const transcriptDetails = isJsonObject(response.transcriptDetails) ? response.transcriptDetails : void 0;
	const mcpAppPreview = isJsonObject(transcriptDetails?.mcpAppPreview) ? transcriptDetails.mcpAppPreview : void 0;
	const progressDetails = mcpAppPreview ? { mcpAppPreview } : void 0;
	if (response.asyncStarted !== true && progressDetails === void 0) return protocolResponse;
	return {
		...protocolResponse,
		...progressDetails ? { details: progressDetails } : {},
		...response.asyncStarted === true ? { details: {
			...progressDetails,
			async: true,
			status: "started"
		} } : {}
	};
}
/** Decides whether a terminal dynamic tool response can release the Codex turn. */
function shouldReleaseTurnAfterTerminalDynamicTool(state) {
	return !state.completed && !state.aborted && state.responseSuccess && !state.currentTurnHadNonTerminalDynamicToolResult && state.activeAppServerTurnRequests === 0 && state.activeTurnItemIdsCount === 0 && state.pendingOpenClawDynamicToolCompletionIdsCount === 0;
}
/** Returns true when a non-async result should block terminal-release shortcuts. */
function shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response) {
	return response.asyncStarted !== true;
}
/** Resolves whether terminal diagnostic state should release, wait, or stay idle. */
function resolveTerminalDynamicToolBatchAction(state) {
	if (state.activeAppServerTurnRequests > 0 || state.activeTurnItemIdsCount > 0 || state.pendingOpenClawDynamicToolCompletionIdsCount > 0) return "wait";
	if (state.currentTurnHadNonTerminalDynamicToolResult) return "clear-nonterminal-batch";
	if (state.hasPendingTerminalDynamicToolRelease) return "release-pending-terminal";
	return "idle";
}
/** Returns true for diagnostic events that terminate a dynamic tool call. */
function isDynamicToolTerminalDiagnosticEvent(event) {
	return event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
/** Matches terminal diagnostics to a specific dynamic tool call id/name. */
function isMatchingDynamicToolTerminalDiagnostic(params) {
	if (params.event.toolCallId !== params.call.callId || params.event.toolName !== params.call.tool) return false;
	if (params.runId !== void 0) return params.event.runId === params.runId;
	if (params.sessionId !== void 0) return params.event.sessionId === params.sessionId;
	if (params.sessionKey !== void 0) return params.event.sessionKey === params.sessionKey;
	return params.event.runId === void 0 && params.event.sessionId === void 0 && params.event.sessionKey === void 0;
}
/** Checks pending diagnostics for a terminal event matching a tool call. */
function hasPendingDynamicToolTerminalDiagnostic(params) {
	return hasPendingInternalDiagnosticEvent((event) => {
		if (!isDynamicToolTerminalDiagnosticEvent(event)) return false;
		return isMatchingDynamicToolTerminalDiagnostic({
			event,
			call: params.call,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
	});
}
/** Resolves per-tool timeout, applying media/message defaults and hard caps. */
function resolveDynamicToolCallTimeoutMs(params) {
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
	if (params.call.tool === "agents_wait") {
		const requestedMs = readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS;
		return Math.max(1, Math.min(63e4, Math.floor(requestedMs)));
	}
	return clampDynamicToolTimeoutMs(readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? CODEX_DYNAMIC_TOOL_TIMEOUT_MS);
}
/** Transport guard stays outside the handler's bounded tool wait and completion grace. */
function resolveDynamicToolServerRequestTimeoutMs(call) {
	return Math.max(63e4, call ? resolveDynamicToolCallTimeoutMs({
		call,
		config: void 0
	}) : 0) + CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS;
}
function readComputerToolTimeoutMs(value) {
	const args = isJsonObject(value) ? value : void 0;
	const action = typeof args?.action === "string" ? args.action : void 0;
	const gatewayTimeoutMs = readPositiveFiniteTimeoutMs(args?.timeoutMs) ?? CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS;
	const gatewayCallCount = action === "screenshot" || action === "wait" ? 3 : 4;
	return (action === "wait" || action === "hold_key" ? Math.max(0, Number(args?.duration) || 0) * 1e3 : 0) + gatewayCallCount * gatewayTimeoutMs + CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS;
}
function readDynamicToolCallTimeoutMs(value) {
	if (!isJsonObject(value)) return;
	const timeoutMs = readPositiveFiniteTimeoutMs(value.timeoutMs);
	if (timeoutMs !== void 0) return timeoutMs;
	const timeoutSecondsMs = readDynamicToolTimeoutSecondsAsMs(value.timeoutSeconds);
	return timeoutSecondsMs === void 0 ? void 0 : addTimerTimeoutGraceMs(timeoutSecondsMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
}
function readConfiguredDynamicToolTimeoutMs(toolName, config) {
	if (toolName === "image_generate") {
		const imageModel = config?.agents?.defaults?.mediaModels?.image;
		if (!imageModel || typeof imageModel !== "object") return CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
		return readPositiveFiniteTimeoutMs(imageModel.timeoutMs) ?? CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
	}
	if (toolName === "view_image") {
		const candidates = (config?.tools?.media?.models ?? []).filter((entry) => !entry.capabilities || entry.capabilities.includes("image"));
		const capabilityTimeoutMs = readTimeoutSecondsAsMs(config?.tools?.media?.image?.timeoutSeconds);
		return Math.max(capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS, ...candidates.map((entry) => readTimeoutSecondsAsMs(entry.timeoutSeconds) ?? capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS));
	}
}
function readTimeoutSecondsAsMs(value) {
	const seconds = readPositiveFiniteTimeoutMs(value);
	return seconds === void 0 ? void 0 : seconds * 1e3;
}
function readDynamicToolTimeoutSecondsAsMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value <= 0) return;
	return value * 1e3;
}
function readPositiveFiniteTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function clampDynamicToolTimeoutMs(timeoutMs) {
	return Math.max(1, Math.min(CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS, Math.floor(timeoutMs)));
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-response.ts
function createCodexElicitationResponse(action, content = null, meta = null) {
	return {
		action,
		content,
		_meta: meta
	};
}
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/DynamicToolCallParams.json
var DynamicToolCallParams_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
		"arguments": true,
		"callId": { "type": "string" },
		"namespace": { "type": ["string", "null"] },
		"threadId": { "type": "string" },
		"tool": { "type": "string" },
		"turnId": { "type": "string" }
	},
	required: [
		"arguments",
		"callId",
		"threadId",
		"tool",
		"turnId"
	],
	title: "DynamicToolCallParams",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/CodexAppServerProtocolDefinitions.json
var definitions = {
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
				"email": { "type": ["string", "null"] },
				"planType": { "$ref": "#/definitions/PlanType" },
				"type": {
					"enum": ["chatgpt"],
					"title": "ChatgptAccountType",
					"type": "string"
				}
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
		}
	] },
	"ActivePermissionProfile": {
		"properties": {
			"extends": {
				"default": null,
				"description": "Parent profile identifier from the selected permissions profile's `extends` setting, when present.",
				"type": ["string", "null"]
			},
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
	"AgentPath": { "type": "string" },
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
			"options": {
				"items": { "type": "string" },
				"type": ["array", "null"]
			},
			"title": { "type": "string" }
		},
		"required": ["title"],
		"type": "object"
	},
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
		"description": "This translation layer make sure that we expose codex error code in camel case.\n\nWhen an upstream HTTP status is available (for example, from the Responses API or a provider), it is forwarded in `httpStatusCode` on the relevant `codexErrorInfo` variant.",
		"oneOf": [
			{
				"additionalProperties": false,
				"properties": { "httpConnectionFailed": {
					"properties": { "httpStatusCode": {
						"format": "uint16",
						"minimum": 0,
						"type": ["integer", "null"]
					} },
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
					"properties": { "httpStatusCode": {
						"format": "uint16",
						"minimum": 0,
						"type": ["integer", "null"]
					} },
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
					"properties": { "httpStatusCode": {
						"format": "uint16",
						"minimum": 0,
						"type": ["integer", "null"]
					} },
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
					"properties": { "httpStatusCode": {
						"format": "uint16",
						"minimum": 0,
						"type": ["integer", "null"]
					} },
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
					"rateLimitExceeded",
					"serverOverloaded",
					"cyberPolicy",
					"misalignmentPolicyViolation",
					"internalServerError",
					"unauthorized",
					"badRequest",
					"threadRollbackFailed",
					"sandboxError",
					"other"
				],
				"type": "string"
			}
		]
	},
	"CollabAgentState": {
		"properties": {
			"message": { "type": ["string", "null"] },
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
				"path": { "type": ["string", "null"] },
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
				"path": { "type": ["string", "null"] },
				"query": { "type": ["string", "null"] },
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
				"properties": {
					"detail": { "anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }] },
					"image_url": { "type": "string" },
					"type": {
						"enum": ["input_image"],
						"title": "InputImageFunctionCallOutputContentItemType",
						"type": "string"
					}
				},
				"required": ["image_url", "type"],
				"title": "InputImageFunctionCallOutputContentItem",
				"type": "object"
			},
			{
				"properties": {
					"audio_url": { "type": "string" },
					"type": {
						"enum": ["input_audio"],
						"title": "InputAudioFunctionCallOutputContentItemType",
						"type": "string"
					}
				},
				"required": ["audio_url", "type"],
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
			"branch": { "type": ["string", "null"] },
			"originUrl": { "type": ["string", "null"] },
			"sha": { "type": ["string", "null"] }
		},
		"type": "object"
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
			"resetsAt": {
				"format": "int64",
				"type": ["integer", "null"]
			},
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
	"McpToolCallAppContext": {
		"properties": {
			"actionName": { "type": ["string", "null"] },
			"appName": { "type": ["string", "null"] },
			"connectorId": { "type": "string" },
			"linkId": { "type": ["string", "null"] },
			"resourceUri": { "type": ["string", "null"] }
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
		"description": "Classifies an assistant message as interim commentary or final answer text.\n\nProviders do not emit this consistently, so callers must treat `None` as \"phase unknown\" and keep compatibility behavior for legacy models.",
		"oneOf": [{
			"description": "Mid-turn assistant text (for example preamble/progress narration).\n\nAdditional tool calls or assistant output may follow before turn completion.",
			"enum": ["commentary"],
			"type": "string"
		}, {
			"description": "The assistant's terminal answer text for the current turn.",
			"enum": ["final_answer"],
			"type": "string"
		}]
	},
	"MisalignmentErrorDetails": {
		"properties": {
			"detailedExplanation": {
				"description": "A substantive localized explanation is required before offering continuation.",
				"type": ["string", "null"]
			},
			"errorType": {
				"description": "Open-ended classification; clients must accept categories added by Responses.",
				"type": ["string", "null"]
			},
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
	"Model": {
		"properties": {
			"additionalSpeedTiers": {
				"default": [],
				"description": "Deprecated: use `serviceTiers` instead.",
				"items": { "type": "string" },
				"type": "array"
			},
			"availabilityNux": { "anyOf": [{ "$ref": "#/definitions/ModelAvailabilityNux" }, { "type": "null" }] },
			"defaultReasoningEffort": { "$ref": "#/definitions/ReasoningEffort" },
			"defaultServiceTier": {
				"default": null,
				"description": "Catalog default service tier id for this model, when one is configured.",
				"type": ["string", "null"]
			},
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
			"modelSpecialty": {
				"default": null,
				"type": ["string", "null"]
			},
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
				"type": "boolean"
			},
			"upgrade": { "type": ["string", "null"] },
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
			"migrationMarkdown": { "type": ["string", "null"] },
			"model": { "type": "string" },
			"modelLink": { "type": ["string", "null"] },
			"retirementAt": {
				"description": "Informational Unix timestamp for this upgrade's scheduled retirement, if known.",
				"format": "int64",
				"type": ["integer", "null"]
			},
			"upgradeCopy": { "type": ["string", "null"] }
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
				"move_path": { "type": ["string", "null"] },
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
					"agent_nickname": {
						"default": null,
						"type": ["string", "null"]
					},
					"agent_path": {
						"anyOf": [{ "$ref": "#/definitions/AgentPath" }, { "type": "null" }],
						"default": null
					},
					"agent_role": {
						"default": null,
						"type": ["string", "null"]
					},
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
			"placeholder": {
				"description": "Optional human-readable placeholder for the element, displayed in the UI.",
				"type": ["string", "null"]
			}
		},
		"required": ["byteRange"],
		"type": "object"
	},
	"Thread": {
		"properties": {
			"agentNickname": {
				"description": "Optional random unique nickname assigned to an AgentControl-spawned sub-agent.",
				"type": ["string", "null"]
			},
			"agentRole": {
				"description": "Optional role (agent_role) assigned to an AgentControl-spawned sub-agent.",
				"type": ["string", "null"]
			},
			"canAcceptDirectInput": {
				"description": "Whether the app server accepts direct turn input for this loaded thread. `None` means the capability is unavailable, such as for an unloaded stored thread.",
				"type": ["boolean", "null"]
			},
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
			"ephemeral": {
				"description": "Whether the thread is ephemeral and should not be materialized on disk.",
				"type": "boolean"
			},
			"extra": {
				"anyOf": [{ "$ref": "#/definitions/ThreadExtra" }, { "type": "null" }],
				"description": "Optional implementation-specific thread data."
			},
			"forkedFromId": {
				"description": "Source thread id when this thread was created by forking another thread.",
				"type": ["string", "null"]
			},
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
			"model": {
				"description": "Current configured model when loaded, otherwise the latest persisted model. Null when unavailable. This is not per-turn execution telemetry.",
				"type": ["string", "null"]
			},
			"modelProvider": {
				"description": "Model provider used for this thread (for example, 'openai').",
				"type": "string"
			},
			"name": {
				"description": "Optional user-facing thread title.",
				"type": ["string", "null"]
			},
			"parentThreadId": {
				"description": "The ID of the parent thread. This will only be set if this thread is a subagent.",
				"type": ["string", "null"]
			},
			"path": {
				"description": "[UNSTABLE] Path to the thread on disk.",
				"type": ["string", "null"]
			},
			"preview": {
				"description": "Usually the first user message in the thread, if available.",
				"type": "string"
			},
			"projectId": {
				"description": "Canonical project assignment owned by app-server, if any.",
				"type": ["string", "null"]
			},
			"reasoningEffort": {
				"anyOf": [{ "$ref": "#/definitions/ReasoningEffort" }, { "type": "null" }],
				"description": "Current configured reasoning effort when loaded, otherwise the latest persisted effort. Null when unset or unavailable. This is not per-turn execution telemetry."
			},
			"recencyAt": {
				"description": "Unix timestamp (in seconds) used for thread recency ordering.",
				"format": "int64",
				"type": ["integer", "null"]
			},
			"section": {
				"anyOf": [{ "$ref": "#/definitions/ThreadSection" }, { "type": "null" }],
				"default": null,
				"description": "The independently persisted section selected for this thread, if any."
			},
			"sectionEnteredAt": {
				"default": null,
				"description": "Unix timestamp in seconds when the thread entered its current section.",
				"format": "int64",
				"type": ["integer", "null"]
			},
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
				"description": "Only populated on `thread/resume`, `thread/rollback`, `thread/fork`, and `thread/read` (when `includeTurns` is true) responses. For all other responses and notifications returning a Thread, the turns field will be an empty list.",
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
	"ThreadExtra": {
		"description": "Extra app-server data for a thread.",
		"type": "object"
	},
	"ThreadHistoryMode": {
		"enum": ["legacy", "paginated"],
		"type": "string"
	},
	"ThreadId": { "type": "string" },
	"ThreadItem": { "oneOf": [
		{
			"properties": {
				"clientId": { "type": ["string", "null"] },
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
				"phase": {
					"anyOf": [{ "$ref": "#/definitions/MessagePhase" }, { "type": "null" }],
					"default": null
				},
				"questions": {
					"default": null,
					"items": { "$ref": "#/definitions/AsyncUserInputQuestion" },
					"type": ["array", "null"]
				},
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
				"namespace": { "type": ["string", "null"] },
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
				"aggregatedOutput": {
					"description": "The command's output, aggregated from stdout and stderr.",
					"type": ["string", "null"]
				},
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
				"durationMs": {
					"description": "The duration of the command execution in milliseconds.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"exitCode": {
					"description": "The command's exit code.",
					"format": "int32",
					"type": ["integer", "null"]
				},
				"id": { "type": "string" },
				"pluginId": {
					"default": null,
					"description": "Trusted first-party plugin id when this command resolves to one plugin script.",
					"type": ["string", "null"]
				},
				"processId": {
					"description": "Identifier for the underlying PTY process (when available).",
					"type": ["string", "null"]
				},
				"scriptPath": {
					"default": null,
					"description": "Safe plugin-relative path when this command resolves to one plugin script.",
					"type": ["string", "null"]
				},
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
				"durationMs": {
					"description": "The duration of the MCP tool call in milliseconds.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"error": { "anyOf": [{ "$ref": "#/definitions/McpToolCallError" }, { "type": "null" }] },
				"id": { "type": "string" },
				"mcpAppResourceUri": {
					"description": "Deprecated: use `appContext.resourceUri` instead.",
					"type": ["string", "null"]
				},
				"pluginId": { "type": ["string", "null"] },
				"readOnlyHint": { "type": ["boolean", "null"] },
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
				"contentItems": {
					"items": { "$ref": "#/definitions/DynamicToolCallOutputContentItem" },
					"type": ["array", "null"]
				},
				"durationMs": {
					"description": "The duration of the dynamic tool call in milliseconds.",
					"format": "int64",
					"type": ["integer", "null"]
				},
				"id": { "type": "string" },
				"namespace": { "type": ["string", "null"] },
				"status": { "$ref": "#/definitions/DynamicToolCallStatus" },
				"success": { "type": ["boolean", "null"] },
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
					"additionalProperties": { "$ref": "#/definitions/CollabAgentState" },
					"description": "Last known status of the target agents, when available.",
					"type": "object"
				},
				"id": {
					"description": "Unique identifier for this collab tool call.",
					"type": "string"
				},
				"model": {
					"description": "Model requested for the spawned agent, when applicable.",
					"type": ["string", "null"]
				},
				"prompt": {
					"description": "Prompt text sent as part of the collab tool call, when available.",
					"type": ["string", "null"]
				},
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
				"results": {
					"default": null,
					"description": "Structured search results returned out-of-band by standalone web search.\n\nThese stay as opaque JSON at the extension/app-server boundary so new result fields and result types can pass through without a Codex release.",
					"items": true,
					"type": ["array", "null"]
				},
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
			"properties": {
				"failure": {
					"anyOf": [{ "$ref": "#/definitions/ImageGenerationFailure" }, { "type": "null" }],
					"default": null
				},
				"id": { "type": "string" },
				"result": { "type": "string" },
				"revisedPrompt": { "type": ["string", "null"] },
				"savedPath": { "anyOf": [{ "$ref": "#/definitions/AbsolutePathBuf" }, { "type": "null" }] },
				"status": { "type": "string" },
				"transparentBackground": {
					"default": null,
					"type": ["boolean", "null"]
				},
				"type": {
					"enum": ["imageGeneration"],
					"title": "ImageGenerationThreadItemType",
					"type": "string"
				}
			},
			"required": [
				"id",
				"result",
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
	] },
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
			"color": { "type": ["string", "null"] },
			"icon": { "type": ["string", "null"] }
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
	"Turn": {
		"properties": {
			"completedAt": {
				"description": "Unix timestamp (in seconds) when the turn completed.",
				"format": "int64",
				"type": ["integer", "null"]
			},
			"durationMs": {
				"description": "Duration between turn start and completion in milliseconds, if known.",
				"format": "int64",
				"type": ["integer", "null"]
			},
			"error": {
				"anyOf": [{ "$ref": "#/definitions/TurnError" }, { "type": "null" }],
				"description": "Only populated when the Turn's status is failed."
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
			"startedAt": {
				"description": "Unix timestamp (in seconds) when the turn started.",
				"format": "int64",
				"type": ["integer", "null"]
			},
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
			"additionalDetails": {
				"default": null,
				"type": ["string", "null"]
			},
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
			"backwardsCursor": { "type": ["string", "null"] },
			"data": {
				"items": { "$ref": "#/definitions/Turn" },
				"type": "array"
			},
			"nextCursor": { "type": ["string", "null"] }
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
			"properties": {
				"detail": {
					"anyOf": [{ "$ref": "#/definitions/ImageDetail" }, { "type": "null" }],
					"default": null
				},
				"type": {
					"enum": ["image"],
					"title": "ImageUserInputType",
					"type": "string"
				},
				"url": { "type": "string" }
			},
			"required": ["type", "url"],
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
			"properties": {
				"type": {
					"enum": ["audio"],
					"title": "AudioUserInputType",
					"type": "string"
				},
				"url": { "type": "string" }
			},
			"required": ["type", "url"],
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
				"queries": {
					"items": { "type": "string" },
					"type": ["array", "null"]
				},
				"query": { "type": ["string", "null"] },
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
				"url": { "type": ["string", "null"] }
			},
			"required": ["type"],
			"title": "OpenPageWebSearchAction",
			"type": "object"
		},
		{
			"properties": {
				"pattern": { "type": ["string", "null"] },
				"type": {
					"enum": ["findInPage"],
					"title": "FindInPageWebSearchActionType",
					"type": "string"
				},
				"url": { "type": ["string", "null"] }
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
	] }
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ErrorNotification.json
var ErrorNotification_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
		"error": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/TurnError" },
		"threadId": { "type": "string" },
		"turnId": { "type": "string" },
		"willRetry": { "type": "boolean" }
	},
	required: [
		"error",
		"threadId",
		"turnId",
		"willRetry"
	],
	title: "ErrorNotification",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ModelListResponse.json
var ModelListResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
		"data": {
			"items": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Model" },
			"type": "array"
		},
		"nextCursor": {
			"description": "Opaque cursor to pass to the next call to continue after the last item. If None, there are no more items to return.",
			"type": ["string", "null"]
		}
	},
	required: ["data"],
	title: "ModelListResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ThreadResumeResponse.json
var ThreadResumeResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
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
		"itemsBackwardsCursor": {
			"default": null,
			"description": "Opaque cursor for hydrating paginated items backwards.\n\nPass this as `cursor` to `thread/items/list` with `sortDirection: \"desc\"`. The first page includes the item identified by the cursor.",
			"type": ["string", "null"]
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
		"serviceTier": { "type": ["string", "null"] },
		"thread": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Thread" },
		"turnsBackwardsCursor": {
			"default": null,
			"description": "Opaque cursor for hydrating paginated turns backwards.\n\nPass this as `cursor` to `thread/turns/list` with `sortDirection: \"desc\"`. The first page includes the turn identified by the cursor.",
			"type": ["string", "null"]
		}
	},
	required: [
		"approvalPolicy",
		"approvalsReviewer",
		"cwd",
		"model",
		"modelProvider",
		"sandbox",
		"thread"
	],
	title: "ThreadResumeResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/ThreadStartResponse.json
var ThreadStartResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
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
		"serviceTier": { "type": ["string", "null"] },
		"thread": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Thread" }
	},
	required: [
		"approvalPolicy",
		"approvalsReviewer",
		"cwd",
		"model",
		"modelProvider",
		"sandbox",
		"thread"
	],
	title: "ThreadStartResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/TurnCompletedNotification.json
var TurnCompletedNotification_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: {
		"threadId": { "type": "string" },
		"turn": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Turn" }
	},
	required: ["threadId", "turn"],
	title: "TurnCompletedNotification",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-generated/json/v2/TurnStartResponse.json
var TurnStartResponse_default = {
	$schema: "http://json-schema.org/draft-07/schema#",
	properties: { "turn": { "$ref": "./CodexAppServerProtocolDefinitions.json#/definitions/Turn" } },
	required: ["turn"],
	title: "TurnStartResponse",
	type: "object"
};
//#endregion
//#region extensions/codex/src/app-server/protocol-validators.ts
/**
* Runtime validators for Codex app-server protocol payloads, including schema
* normalization for generated JSON Schema before TypeBox compilation.
*/
const externalDefinitionRefPrefix = "./CodexAppServerProtocolDefinitions.json#/definitions/";
const rootExternalDefinitionRefPrefix = "./v2/CodexAppServerProtocolDefinitions.json#/definitions/";
const localDefinitionRefPrefix = "#/definitions/";
function materializeCodexSchema(schema, externalRefPrefix = externalDefinitionRefPrefix) {
	const sharedDefinitions = definitions;
	if (!isRecord(schema) || !isRecord(sharedDefinitions)) return schema;
	const reachable = collectDefinitionRefs(schema, externalRefPrefix);
	const pending = [...reachable];
	while (pending.length > 0) {
		const name = pending.pop();
		if (name === void 0) continue;
		const definition = sharedDefinitions[name];
		if (definition === void 0) throw new Error(`Missing generated Codex schema definition: ${name}`);
		for (const dependency of collectDefinitionRefs(definition, localDefinitionRefPrefix)) if (!reachable.has(dependency)) {
			reachable.add(dependency);
			pending.push(dependency);
		}
	}
	if (reachable.size === 0) return schema;
	const definitions$1 = Object.fromEntries(Object.entries(sharedDefinitions).filter(([name]) => reachable.has(name)));
	return rewriteDefinitionRefs({
		...schema,
		definitions: definitions$1
	}, externalRefPrefix);
}
function collectDefinitionRefs(value, prefix, names = /* @__PURE__ */ new Set()) {
	if (Array.isArray(value)) for (const entry of value) collectDefinitionRefs(entry, prefix, names);
	else if (isRecord(value)) {
		if (typeof value.$ref === "string" && value.$ref.startsWith(prefix)) {
			const name = value.$ref.slice(prefix.length).split("/", 1)[0];
			if (name) names.add(name.replaceAll("~1", "/").replaceAll("~0", "~"));
		}
		for (const entry of Object.values(value)) collectDefinitionRefs(entry, prefix, names);
	}
	return names;
}
function rewriteDefinitionRefs(value, externalRefPrefix) {
	if (Array.isArray(value)) return value.map((entry) => rewriteDefinitionRefs(entry, externalRefPrefix));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, key === "$ref" && typeof entry === "string" && entry.startsWith(externalRefPrefix) ? `${localDefinitionRefPrefix}${entry.slice(externalRefPrefix.length)}` : rewriteDefinitionRefs(entry, externalRefPrefix)]));
}
const dynamicToolCallParamsSchema = materializeCodexSchema(DynamicToolCallParams_default, rootExternalDefinitionRefPrefix);
const errorNotificationSchema = materializeCodexSchema(ErrorNotification_default);
const modelListResponseSchema = materializeCodexSchema(ModelListResponse_default);
const threadResumeResponseSchema = materializeCodexSchema(ThreadResumeResponse_default);
const threadStartResponseSchema = materializeCodexSchema(ThreadStartResponse_default);
const turnCompletedNotificationSchema = materializeCodexSchema(TurnCompletedNotification_default);
const turnStartResponseSchema = materializeCodexSchema(TurnStartResponse_default);
function compileCodexSchema(schema) {
	if (typeof schema !== "boolean" && !isRecord(schema)) throw new TypeError("Generated Codex schema must be an object or boolean");
	const validator = Compile(normalizeJsonSchemaForTypeBox(schema));
	return {
		check: (value) => validator.Check(value),
		errors: (value) => [...validator.Errors(value)]
	};
}
function schemaTypeIncludes(schema, type) {
	return schema.type === type || Array.isArray(schema.type) && schema.type.includes(type);
}
function readDefault(schema) {
	if (!isRecord(schema) || !Object.hasOwn(schema, "default")) return;
	return structuredClone(schema.default);
}
function decodePointerSegment(segment) {
	return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}
function resolveLocalRef(root, ref) {
	if (ref === "#") return root;
	if (!ref.startsWith("#/")) return;
	let current = root;
	for (const segment of ref.slice(2).split("/").map(decodePointerSegment)) {
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function applySchemaDefaults(schema, value, root = schema, resolvingRefs = /* @__PURE__ */ new Set()) {
	if (value === void 0) {
		const defaultValue = readDefault(schema);
		if (defaultValue !== void 0) return defaultValue;
	}
	if (!isRecord(schema)) return value;
	let nextValue = value;
	if (typeof schema.$ref === "string" && !resolvingRefs.has(schema.$ref)) {
		const target = resolveLocalRef(root, schema.$ref);
		if (target !== void 0) {
			resolvingRefs.add(schema.$ref);
			nextValue = applySchemaDefaults(target, nextValue, root, resolvingRefs);
			resolvingRefs.delete(schema.$ref);
		}
	}
	for (const key of ["allOf"]) {
		const branches = schema[key];
		if (Array.isArray(branches)) for (const branch of branches) nextValue = applySchemaDefaults(branch, nextValue, root, resolvingRefs);
	}
	if (schemaTypeIncludes(schema, "object") && isRecord(nextValue) && isRecord(schema.properties)) {
		for (const [key, propertySchema] of Object.entries(schema.properties)) {
			const currentValue = nextValue[key];
			const defaultedValue = applySchemaDefaults(propertySchema, currentValue, root, resolvingRefs);
			if (defaultedValue !== void 0 && defaultedValue !== currentValue) nextValue[key] = defaultedValue;
		}
		if (isRecord(schema.additionalProperties)) for (const key of Object.keys(nextValue)) {
			if (Object.hasOwn(schema.properties, key)) continue;
			nextValue[key] = applySchemaDefaults(schema.additionalProperties, nextValue[key], root, resolvingRefs);
		}
	}
	if (schemaTypeIncludes(schema, "array") && Array.isArray(nextValue) && isRecord(schema.items)) return nextValue.map((entry) => applySchemaDefaults(schema.items, entry, root, resolvingRefs));
	return nextValue;
}
function normalizeWithDefaults(schema, value) {
	if (value === void 0 || value === null) return value;
	return applySchemaDefaults(schema, structuredClone(value));
}
const validateDynamicToolCallParams = compileCodexSchema(dynamicToolCallParamsSchema);
const validateErrorNotification = compileCodexSchema(errorNotificationSchema);
const validateModelListResponse = compileCodexSchema(modelListResponseSchema);
const validateThreadResumeResponse = compileCodexSchema(threadResumeResponseSchema);
const validateThreadStartResponse = compileCodexSchema(threadStartResponseSchema);
const validateTurnCompletedNotification = compileCodexSchema(turnCompletedNotificationSchema);
const validateTurnStartResponse = compileCodexSchema(turnStartResponseSchema);
/** Asserts and normalizes a Codex thread/start response. */
function assertCodexThreadStartResponse(value) {
	const normalized = normalizeWithDefaults(threadStartResponseSchema, value);
	return assertCodexShape(validateThreadStartResponse, normalized, "thread/start response");
}
/** Asserts and normalizes a Codex thread/fork response. */
function assertCodexThreadForkResponse(value) {
	const normalized = normalizeWithDefaults(threadStartResponseSchema, value);
	return assertCodexShape(validateThreadStartResponse, normalized, "thread/fork response");
}
/** Asserts and normalizes a Codex thread/resume response. */
function assertCodexThreadResumeResponse(value) {
	const normalized = normalizeWithDefaults(threadResumeResponseSchema, value);
	return assertCodexShape(validateThreadResumeResponse, normalized, "thread/resume response");
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
/** Asserts and normalizes a Codex turn/start response. */
function assertCodexTurnStartResponse(value) {
	const normalized = normalizeWithDefaults(turnStartResponseSchema, value);
	return assertCodexShape(validateTurnStartResponse, normalized, "turn/start response");
}
/** Prompt echoes and attested managed-hook continuations cannot admit native capabilities. */
function assertCodexPassiveTurnItems(items, prompt, taskLabel, options = {}) {
	let promptEchoSeen = false;
	for (const item of items) {
		if (item.type === "agentMessage" || item.type === "reasoning") continue;
		if (item.type === "hookPrompt" && options.allowManagedHookPrompts === true && Array.isArray(item.fragments) && item.fragments.length > 0 && item.fragments.every((fragment) => isJsonObject(fragment) && typeof fragment.text === "string" && typeof fragment.hookRunId === "string" && fragment.hookRunId.trim().length > 0)) continue;
		if (item.type === "userMessage" && !promptEchoSeen) {
			const content = Array.isArray(item.content) ? item.content : [];
			const input = content[0];
			if (content.length === 1 && isJsonObject(input) && input.type === "text" && input.text === prompt) {
				promptEchoSeen = true;
				continue;
			}
		}
		throw new Error(`Codex ${taskLabel} returned unexpected native item: ${item.type}`);
	}
}
/** Reads Codex dynamic-tool call params, returning undefined for invalid payloads. */
function readCodexDynamicToolCallParams(value) {
	return readCodexShape(validateDynamicToolCallParams, normalizeWithDefaults(dynamicToolCallParamsSchema, value));
}
/** Reads a Codex error notification payload if it matches the protocol schema. */
function readCodexErrorNotification(value) {
	return readCodexShape(validateErrorNotification, normalizeWithDefaults(errorNotificationSchema, value));
}
/** Asserts and normalizes a Codex model/list response. */
function assertCodexModelListResponse(value) {
	return assertCodexShape(validateModelListResponse, normalizeWithDefaults(modelListResponseSchema, value), "model/list response");
}
/** Reads a Codex turn/completed notification payload if it matches the protocol schema. */
function readCodexTurnCompletedNotification(value) {
	const notification = readCodexShape(validateTurnCompletedNotification, normalizeWithDefaults(turnCompletedNotificationSchema, value));
	return notification?.turn.status === "inProgress" ? void 0 : notification;
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
//#endregion
//#region extensions/codex/src/app-server/server-requests.ts
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
		const requests = [...this.active.values()];
		this.active.clear();
		for (const request of requests) request.controller.abort(error);
	}
	async handle(request) {
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
				embeddedAgentLog.warn("codex app-server server request timed out", {
					id: request.id,
					method: request.method,
					timeoutMs
				});
				deadline.resolve(timeoutServerRequestResponse(timeoutMs));
				controller.abort(/* @__PURE__ */ new Error("codex app-server server request timed out"));
			}, timeoutMs);
			timeout.unref?.();
		};
		const setExecutionTimeoutMs = (executionTimeoutMs) => {
			if (settled || controller.signal.aborted || executionTimeoutResolved || !Number.isFinite(executionTimeoutMs) || executionTimeoutMs <= 0) return;
			executionTimeoutResolved = true;
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
			const result = await Promise.race([run(), deadline.promise]);
			if (this.active.get(request.id) === entry) this.respond({
				id: request.id,
				result: result === void 0 ? defaultServerRequestResponse(request) : result
			});
		} catch (error) {
			if (this.active.get(request.id) === entry) {
				embeddedAgentLog.warn("codex app-server server request handler failed", {
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
	if (request.method === "item/tool/call") return {
		contentItems: [{
			type: "inputText",
			text: "OpenClaw did not register a handler for this app-server tool call."
		}],
		success: false
	};
	if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return { decision: "decline" };
	if (request.method === "item/permissions/requestApproval") return {
		permissions: {},
		scope: "turn"
	};
	if (request.method === "item/tool/requestUserInput") return { answers: {} };
	if (request.method === "mcpServer/elicitation/request") return createCodexElicitationResponse("decline", null, { message: "OpenClaw has no interactive handler for this elicitation." });
	return {};
}
function timeoutServerRequestResponse(timeoutMs) {
	return {
		contentItems: [{
			type: "inputText",
			text: `OpenClaw dynamic tool call timed out after ${timeoutMs}ms before sending a response to Codex.`
		}],
		success: false
	};
}
//#endregion
//#region extensions/codex/src/app-server/transport-websocket.ts
/**
* Adapts a remote Codex app-server WebSocket endpoint to the shared stdio-like
* transport interface.
*/
const WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 1e4;
const WEBSOCKET_PING_INTERVAL_MS = 2e4;
const WEBSOCKET_PONG_TIMEOUT_MS = 2e4;
const MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS = 5;
/** Opens a WebSocket app-server transport and maps newline-delimited frames to stdout/stdin. */
function createWebSocketTransport(options) {
	if (!options.url) throw new Error("codex app-server websocket transport requires plugins.entries.codex.config.appServer.url");
	const events = new EventEmitter();
	const stdout = new PassThrough();
	const stderr = new PassThrough();
	const websocketOptions = {
		headers: {
			...options.headers,
			...options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}
		},
		perMessageDeflate: false,
		...options.transport === "websocket" ? { handshakeTimeout: WEBSOCKET_HANDSHAKE_TIMEOUT_MS } : {}
	};
	const unixSocketPath = resolveCodexAppServerUnixSocketPath(options);
	const socket = unixSocketPath ? new WebSocket("ws://localhost/", {
		...websocketOptions,
		createConnection: () => connectCodexAppServerUnixSocket(unixSocketPath)
	}) : new WebSocket(options.url, websocketOptions);
	const pendingFrames = [];
	const stdinDecoder = new StringDecoder("utf8");
	let pendingLine = "";
	let killed = false;
	let exitCode = null;
	let pingTimeout;
	let pongTimeout;
	let expectedPong;
	let consecutiveMissedPongs = 0;
	let heartbeatSequence = 0;
	const clearConnectionHealthTimers = () => {
		if (pingTimeout) {
			clearTimeout(pingTimeout);
			pingTimeout = void 0;
		}
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
	};
	const sendHeartbeatPing = () => {
		if (socket.readyState !== WebSocket.OPEN || pongTimeout) return;
		const payload = Buffer.from(`openclaw-codex-${++heartbeatSequence}`);
		expectedPong = payload;
		pongTimeout = setTimeout(() => {
			pongTimeout = void 0;
			expectedPong = void 0;
			consecutiveMissedPongs += 1;
			if (consecutiveMissedPongs >= MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS) {
				socket.terminate();
				return;
			}
			sendHeartbeatPing();
		}, WEBSOCKET_PONG_TIMEOUT_MS);
		pongTimeout.unref();
		socket.ping(payload, void 0, (error) => {
			if (error) socket.terminate();
		});
	};
	const scheduleHeartbeatPing = () => {
		if (options.transport !== "websocket" || socket.readyState !== WebSocket.OPEN || pingTimeout || pongTimeout) return;
		pingTimeout = setTimeout(() => {
			pingTimeout = void 0;
			sendHeartbeatPing();
		}, WEBSOCKET_PING_INTERVAL_MS);
		pingTimeout.unref();
	};
	const recordConnectionActivity = () => {
		consecutiveMissedPongs = 0;
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
		scheduleHeartbeatPing();
	};
	const sendFrame = (frame) => {
		const trimmed = frame.trim();
		if (!trimmed) return;
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(trimmed);
			return;
		}
		pendingFrames.push(trimmed);
	};
	socket.once("open", () => {
		for (const frame of pendingFrames.splice(0)) socket.send(frame);
		scheduleHeartbeatPing();
	});
	socket.on("pong", (payload) => {
		if (expectedPong?.equals(payload)) recordConnectionActivity();
	});
	socket.once("error", (error) => {
		clearConnectionHealthTimers();
		events.emit("error", error);
	});
	socket.once("close", (code, reason) => {
		clearConnectionHealthTimers();
		killed = true;
		exitCode = code;
		events.emit("exit", code, reason.toString("utf8"));
	});
	socket.on("message", (data) => {
		if (options.transport === "websocket") recordConnectionActivity();
		const frame = websocketFrameToBuffer(data);
		const writable = stdout.write(frame);
		const delimited = frame.at(-1) === 10 || stdout.write(Buffer.from("\n"));
		if (!writable || !delimited) socket.pause();
	});
	stdout.on("drain", () => {
		if (socket.readyState === WebSocket.OPEN) socket.resume();
	});
	const stdin = new Writable({
		write(chunk, _encoding, callback) {
			pendingLine += stdinDecoder.write(chunk);
			const lines = pendingLine.split("\n");
			pendingLine = lines.pop() ?? "";
			for (const frame of lines) sendFrame(frame);
			callback();
		},
		final(callback) {
			pendingLine += stdinDecoder.end();
			if (pendingLine) sendFrame(pendingLine);
			pendingLine = "";
			callback();
		}
	});
	const closeSocket = () => {
		if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) return;
		socket.close();
	};
	stdin.once("finish", closeSocket);
	stdin.once("close", closeSocket);
	return {
		maxFrameBytes: 16777216,
		stdin,
		stdout,
		stderr,
		get killed() {
			return killed;
		},
		get exitCode() {
			return exitCode;
		},
		kill: (signal) => {
			killed = true;
			clearConnectionHealthTimers();
			if (signal === "SIGKILL") socket.terminate();
			else socket.close();
		},
		once: (event, listener) => events.once(event, listener),
		off: (event, listener) => events.off(event, listener)
	};
}
/** Opens the owner-scoped Codex control socket used by the WebSocket upgrade. */
function connectCodexAppServerUnixSocket(socketPath) {
	return net.createConnection(socketPath);
}
/** Resolves the canonical or explicitly configured Codex control socket. */
function resolveCodexAppServerUnixSocketPath(options) {
	if (options.transport !== "unix") {
		if (options.url?.startsWith("unix://")) throw new Error("codex app-server unix URL requires unix transport");
		return;
	}
	const url = options.url ?? "unix://";
	if (!url.startsWith("unix://")) throw new Error("codex app-server unix transport requires a unix:// URL");
	return url.slice(7) || path.join(resolveCodexAppServerUserHomeDir(options.env ?? process.env), "app-server-control", "app-server-control.sock");
}
function websocketFrameToBuffer(data) {
	if (typeof data === "string") return Buffer.from(data);
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
//#endregion
//#region extensions/codex/src/app-server/client.ts
/**
* JSON-RPC client for Codex app-server transports, including request/response
* routing, notification fanout, server request handlers, and version checks.
*/
var client_exports = /* @__PURE__ */ __exportAll({
	CodexAppServerClient: () => CodexAppServerClient,
	getCodexAppServerClientInstanceId: () => getCodexAppServerClientInstanceId,
	isCodexAppServerApprovalRequest: () => isCodexAppServerApprovalRequest,
	isCodexAppServerBrokenPipeError: () => isCodexAppServerBrokenPipeError,
	isCodexAppServerConnectionClosedError: () => isCodexAppServerConnectionClosedError,
	isCodexAppServerIndeterminateRequestCancellationError: () => isCodexAppServerIndeterminateRequestCancellationError,
	isCodexAppServerIndeterminateTransportError: () => isCodexAppServerIndeterminateTransportError,
	isCodexAppServerOverloadError: () => isCodexAppServerOverloadError,
	isCodexAppServerPrewriteRequestCancellationError: () => isCodexAppServerPrewriteRequestCancellationError,
	isCodexAppServerRequestTimeoutError: () => isCodexAppServerRequestTimeoutError,
	isUnsupportedCodexAppServerVersionError: () => isUnsupportedCodexAppServerVersionError,
	resolveCodexAppServerClientInstanceId: () => resolveCodexAppServerClientInstanceId
});
const CODEX_APP_SERVER_STDERR_TAIL_MAX = 2e3;
const CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES = 3;
const CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS = 50;
const CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX = 32;
const CODEX_APP_SERVER_CLIENT_INSTANCE_IDS = /* @__PURE__ */ new WeakMap();
/** Process-local generation fence for bindings tied to one app-server client instance. */
function getCodexAppServerClientInstanceId(client) {
	const current = CODEX_APP_SERVER_CLIENT_INSTANCE_IDS.get(client);
	if (current) return current;
	const created = randomUUID();
	CODEX_APP_SERVER_CLIENT_INSTANCE_IDS.set(client, created);
	return created;
}
function resolveCodexAppServerClientInstanceId(client) {
	return client.getInstanceId?.call(client) ?? getCodexAppServerClientInstanceId(client);
}
/** Codex rejects this exact code before enqueueing, including mutating requests. */
function isCodexAppServerOverloadError(error) {
	return error instanceof CodexAppServerRpcError && error.code === -32001;
}
var CodexAppServerLocalRequestCancellationError = class extends Error {
	constructor(method, reason, mayHaveWritten, cause) {
		const detail = cause instanceof Error || typeof cause === "string" ? coerceErrorMessage(cause) : void 0;
		super(`${method} ${reason}${detail ? `: ${detail}` : ""}`, { cause });
		this.reason = reason;
		this.mayHaveWritten = mayHaveWritten;
		this.code = "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED";
		this.name = "CodexAppServerLocalRequestCancellationError";
	}
};
function isCodexAppServerRequestTimeoutError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "reason" in error && error.reason === "timed out";
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
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "mayHaveWritten" in error && error.mayHaveWritten === true;
}
/** True when local cancellation happened before a request write was attempted. */
function isCodexAppServerPrewriteRequestCancellationError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "mayHaveWritten" in error && error.mayHaveWritten === false;
}
/** True when transport failure cannot prove a written request stopped running. */
function isCodexAppServerIndeterminateTransportError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_REQUEST_TRANSPORT_INDETERMINATE" && "mayHaveWritten" in error && error.mayHaveWritten === true;
}
/** Returns true for errors that mean the app-server transport is closed. */
function isCodexAppServerConnectionClosedError(error) {
	if (!(error instanceof Error)) return false;
	if (isCodexAppServerIndeterminateTransportError(error)) return true;
	return error.message === "codex app-server client is closed" || error.message.startsWith("codex app-server exited:");
}
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
var CodexAppServerClient = class CodexAppServerClient {
	constructor(child) {
		this.instanceId = randomUUID();
		this.decoder = new CodexAppServerMessageDecoder(logCodexAppServerParseFailure);
		this.catalogWorker = new CodexCatalogWorker();
		this.pending = /* @__PURE__ */ new Map();
		this.catalogResponses = /* @__PURE__ */ new WeakMap();
		this.serverRequests = new CodexServerRequests((response) => this.writeMessage(response));
		this.notificationHandlers = /* @__PURE__ */ new Set();
		this.pendingStartupWarnings = [];
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
		this.child = child;
		this.closeMessageReader = listenCodexAppServerLines(child.stdout, (line) => {
			const route = this.catalogWorker.continuation ?? (this.decoder.hasPending ? void 0 : readCodexCatalogDecodeRoute(line));
			if (route) return this.decodeCatalogLine(line, route);
			return this.handleParsedMessage(this.decoder.parse(line.toString("utf8")));
		}, (error) => this.closeWithError(toStringifiedError(error)));
		child.stdout.on("error", (error) => this.closeWithError(toStringifiedError(error)));
		observeCodexAppServerStderr(child.stderr, (chunk) => {
			const text = this.redactPrivateStderr(chunk);
			this.stderrTail = appendBoundedTail(this.stderrTail, text, CODEX_APP_SERVER_STDERR_TAIL_MAX);
			return text;
		});
		child.once("error", (error) => this.closeWithError(toStringifiedError(error)));
		child.once("exit", (code, signal) => {
			this.transportExited = true;
			this.closeWithError(child.startupFailure?.error ?? buildCodexAppServerExitError(code, signal, this.stderrTail));
		});
		child.stdin.on?.("error", (error) => this.closeWithError(toStringifiedError(error)));
	}
	/** Starts a new app-server client using resolved runtime start options. */
	static async start(options, assertCurrent) {
		const defaults = resolveCodexAppServerRuntimeOptions().start;
		const startOptions = {
			...defaults,
			...options,
			headers: options?.headers ?? defaults.headers
		};
		if (startOptions.transport === "stdio" && startOptions.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
		if (startOptions.transport === "websocket" || startOptions.transport === "unix") return new CodexAppServerClient(createWebSocketTransport(startOptions));
		let client;
		try {
			await createStdioTransport(startOptions, process.env, assertCurrent, (child) => {
				client = new CodexAppServerClient(child);
			});
			return client;
		} catch (error) {
			assertCurrent?.();
			if (client?.transportExited && hasCodexAppServerNaturalExit(client.child)) throw client.child.startupFailure?.error ?? buildCodexAppServerExitError(client.child.exitCode, client.child.signalCode, client.stderrTail);
			const stderr = client?.getStderrDiagnostic();
			throw stderr ? new Error(`${coerceErrorMessage(error)}; stderr=${JSON.stringify(stderr)}`, { cause: error }) : error;
		}
	}
	/** Builds a client around a fake transport for tests. */
	static fromTransportForTests(child) {
		return new CodexAppServerClient(child);
	}
	/** Performs the app-server initialize handshake and validates protocol version. */
	async initialize() {
		if (this.initialized) return;
		const response = await this.request("initialize", buildCodexAppServerInitializeParams());
		this.child.startupFailure?.complete();
		this.serverVersion = assertSupportedCodexAppServerVersion(response);
		this.runtimeIdentity = buildCodexAppServerRuntimeIdentity(response, this.serverVersion);
		this.notify("initialized");
		this.initialized = true;
	}
	/** Returns the version detected during initialize. */
	getServerVersion() {
		return this.serverVersion;
	}
	/** Returns runtime metadata detected during initialize. */
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
	/** Installs the spawn-owner guard and retirement for config-loading thread requests. */
	setThreadSessionRequestGuard(guard, retireAfterIndeterminateRequest) {
		this.threadSessionRequestGuard = guard;
		this.retireAfterIndeterminateThreadRequest = retireAfterIndeterminateRequest;
	}
	/** Returns the local transport PID for scoped child-process cleanup, when available. */
	getTransportPid() {
		return this.child.pid;
	}
	request(method, params, optionsInput) {
		const options = optionsInput ?? {};
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false, options.signal?.reason));
		const guard = method === "thread/start" || method === "thread/resume" || method === "thread/fork" ? this.threadSessionRequestGuard : void 0;
		if (guard) {
			const retire = this.retireAfterIndeterminateThreadRequest;
			if (!options.signal && !(options.timeoutMs !== void 0 && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0)) return Promise.reject(/* @__PURE__ */ new TypeError(`${method} requires a positive finite timeout or abort signal`));
			return (async () => {
				const guardStartedAt = performance.now();
				const timeoutMessage = `${method} timed out`;
				const abortMessage = `${method} aborted`;
				let releaseGuard;
				try {
					releaseGuard = await guard({
						signal: options.signal,
						timeoutMs: options.timeoutMs,
						timeoutMessage,
						abortMessage
					});
				} catch (error) {
					if (error instanceof Error && error.message === timeoutMessage) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
					if (error instanceof Error && error.message === abortMessage) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false, options.signal?.reason);
					throw error;
				}
				let released = false;
				let removeExitHandler;
				const release = () => {
					if (released) return;
					released = true;
					removeExitHandler?.();
					releaseGuard();
				};
				let releaseWhenRequestSettles = true;
				let requestMayHaveWritten = false;
				let nativeResponded = false;
				try {
					const elapsedMs = performance.now() - guardStartedAt;
					const remainingTimeoutMs = options.timeoutMs === void 0 ? void 0 : options.timeoutMs - elapsedMs;
					if (remainingTimeoutMs !== void 0 && remainingTimeoutMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
					return await this.requestWithOverloadRetry(method, params, {
						...options,
						...remainingTimeoutMs !== void 0 ? { timeoutMs: remainingTimeoutMs } : {}
					}, (mayHaveWritten) => {
						requestMayHaveWritten = mayHaveWritten;
						nativeResponded = !mayHaveWritten;
					}, () => {
						nativeResponded = true;
						if (!releaseWhenRequestSettles) release();
					});
				} catch (error) {
					if (requestMayHaveWritten && !(error instanceof CodexAppServerRpcError)) {
						releaseWhenRequestSettles = false;
						if (nativeResponded) release();
						else removeExitHandler = this.addTransportExitHandler(release);
						if (!retire?.()) await this.closeAndRunAfterExit(release, method);
					}
					throw error;
				} finally {
					if (releaseWhenRequestSettles) release();
				}
			})();
		}
		return this.requestWithOverloadRetry(method, params, options);
	}
	async requestWithOverloadRetry(method, params, options, onWriteStateChange, onResponse) {
		const deadline = options.timeoutMs !== void 0 && Number.isFinite(options.timeoutMs) ? performance.now() + options.timeoutMs : void 0;
		for (let retry = 0;; retry += 1) {
			if (options.signal?.aborted) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false, options.signal?.reason);
			const remainingTimeoutMs = deadline === void 0 ? void 0 : deadline - performance.now();
			if (remainingTimeoutMs !== void 0 && remainingTimeoutMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
			try {
				return await this.requestOnce(method, params, {
					...options,
					...remainingTimeoutMs !== void 0 ? { timeoutMs: remainingTimeoutMs } : {}
				}, retry + 1, onWriteStateChange, deadline, onResponse);
			} catch (error) {
				if (!isCodexAppServerOverloadError(error) || retry >= CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES) throw error;
				onWriteStateChange?.(false);
				const backoffMs = Math.round(CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS * 2 ** retry * (.75 + Math.random() * .5));
				await this.waitForOverloadRetry(method, backoffMs, deadline, options.signal);
			}
		}
	}
	async waitForOverloadRetry(method, backoffMs, deadline, signal) {
		if (signal?.aborted) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false, signal?.reason);
		const remainingMs = deadline === void 0 ? void 0 : deadline - performance.now();
		if (remainingMs !== void 0 && remainingMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
		const delayMs = remainingMs === void 0 ? backoffMs : Math.min(backoffMs, remainingMs);
		await new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				cleanup();
				resolve();
			}, delayMs);
			timer.unref?.();
			const abortListener = () => {
				cleanup();
				reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false, signal?.reason));
			};
			const cleanup = () => {
				clearTimeout(timer);
				signal?.removeEventListener("abort", abortListener);
			};
			signal?.addEventListener("abort", abortListener, { once: true });
			if (signal?.aborted) abortListener();
		});
	}
	requestOnce(method, params, options, overloadAttemptOrdinal, onWriteStateChange, deadline, onResponse) {
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false, options.signal?.reason));
		const id = codexCatalogRequestId(method, params, this.nextId++, options.catalogPreview);
		if (method === "account/login/start" || method === "account/logout" || method === "config/value/write" || method === "config/batchWrite") this.modelCatalogRevision += 1;
		const message = {
			id,
			method,
			params
		};
		const attempt = createCodexRequestAttempt({
			method,
			retainWritten: onResponse !== void 0,
			...method === "thread/list" ? { diagnosticIdentity: {
				clientInstanceId: this.instanceId,
				rpcId: id
			} } : {},
			onResponse: onResponse ? (mayHaveWritten) => {
				onWriteStateChange?.(mayHaveWritten);
				onResponse();
			} : void 0,
			onSettled: () => {
				if (this.pending.get(id) === attempt) this.pending.delete(id);
			},
			cancellationError: (reason, written, cause) => new CodexAppServerLocalRequestCancellationError(method, reason, written, cause),
			localError: (error, written) => written && !(error instanceof CodexAppServerRpcError) && !isCodexAppServerIndeterminateRequestCancellationError(error) && !isCodexAppServerIndeterminateTransportError(error) ? new CodexAppServerIndeterminateTransportError(method, error) : error
		});
		this.pending.set(id, attempt);
		if (options.catalogPreview) this.catalogResponses.set(attempt, {
			preview: options.catalogPreviewCache,
			remainingRows: options.catalogRows
		});
		const result = attempt.wait({
			...options,
			assertCurrent: void 0,
			disposition: "new",
			overloadAttemptOrdinal
		}, deadline);
		if (!attempt.pending) return result;
		try {
			options.assertCurrent?.();
			if (attempt.pending) this.writeMessage(message, (error) => attempt.failLocal(error), () => {
				attempt.markWritten();
				onWriteStateChange?.(true);
			});
		} catch (error) {
			attempt.failLocal(toStringifiedError(error));
		}
		return result;
	}
	/** Sends a fire-and-forget JSON-RPC notification to the app-server. */
	notify(method, params) {
		this.writeMessage({
			method,
			params
		});
	}
	/** Registers a handler for app-server requests sent back to OpenClaw. */
	addRequestHandler(handler) {
		this.serverRequests.handlers.add(handler);
		return () => this.serverRequests.handlers.delete(handler);
	}
	/** Registers a notification handler and returns its disposer. */
	addNotificationHandler(handler) {
		this.notificationHandlers.add(handler);
		for (const notification of this.pendingStartupWarnings.splice(0)) this.handleNotification(notification);
		return () => this.notificationHandlers.delete(handler);
	}
	/** Registers a close handler and returns its disposer. */
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
	/** Closes the transport without waiting for process/socket shutdown. */
	close() {
		if (!this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"))) return;
		closeCodexAppServerTransport(this.child);
	}
	/** Closes the transport and waits for shutdown according to transport policy. */
	async closeAndWait(options) {
		this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"));
		const [result] = await Promise.all([closeCodexAppServerTransportAndWait(this.child, options), this.catalogWorkerClosed]);
		return this.nativeExecutionObserved ? {
			...result,
			cleanup: "uncertain"
		} : result;
	}
	/** Closes this transport and runs cleanup only after physical process exit. */
	async closeAndRunAfterExit(onExit, operation) {
		let settled = false;
		const runOnExit = () => {
			if (settled) return;
			settled = true;
			onExit();
		};
		if (this.transportExited) {
			runOnExit();
			return;
		}
		this.child.once("exit", runOnExit);
		try {
			await this.closeAndWait();
		} catch (closeError) {
			embeddedAgentLog.warn("codex app-server shutdown after indeterminate request failed", {
				closeError,
				operation
			});
		}
	}
	writeMessage(message, onError, beforeWrite) {
		if (this.closed) return;
		const id = "id" in message ? message.id : void 0;
		const method = "method" in message ? message.method : void 0;
		const frame = stringifyCodexAppServerMessage(message);
		if (this.child.maxFrameBytes && Buffer.byteLength(frame) > this.child.maxFrameBytes) throw new Error("Codex request exceeds the transport frame limit; reduce attached images or context.");
		beforeWrite?.();
		if (method === "command/exec") this.nativeExecutionObserved = true;
		this.child.stdin.write(`${frame}\n`, (error) => {
			if (error) {
				embeddedAgentLog.warn("codex app-server write failed", {
					error,
					id,
					method
				});
				onError?.(error);
			}
		});
	}
	/** Protect private loopback route capabilities before native diagnostics can mention them. */
	protectPrivateTransportSecret(secret) {
		if (!/^[A-Za-z0-9_-]{43}$/.test(secret) || this.privateTransportSecrets.size >= 8) {
			if (!this.privateTransportSecrets.has(secret)) throw new Error("Invalid private Codex transport capability");
		}
		this.privateTransportSecrets.add(secret);
	}
	redactPrivateText(text) {
		let redacted = text;
		for (const secret of this.privateTransportSecrets) redacted = redacted.replaceAll(secret, "[REDACTED]");
		return redacted;
	}
	redactPrivateStderr(chunk) {
		const text = this.redactPrivateText(this.privateStderrPending + chunk);
		let held = 0;
		for (const secret of this.privateTransportSecrets) for (let length = 1; length < secret.length; length++) if (text.endsWith(secret.slice(0, length))) held = Math.max(held, length);
		this.privateStderrPending = held ? text.slice(-held) : "";
		return held ? text.slice(0, -held) : text;
	}
	handleParsedMessage(parsed, previewStates) {
		if (this.closed || !parsed || typeof parsed !== "object") return;
		const message = parsed;
		if (isRpcResponse(message)) {
			this.handleResponse(message, previewStates);
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
		const decoded = await this.catalogWorker.decode(line, route, this.pending, this.catalogResponses);
		if (!decoded || this.closed) return;
		for (const failure of decoded.failures) logCodexAppServerParseFailure(failure.value, failure.error, failure.fragmentCount);
		if (decoded.projectionError) this.pending.get(decoded.projectionError.id)?.reject(decoded.projectionError.error, false);
		else if (decoded.message) this.handleParsedMessage(decoded.message, decoded.previewStates);
	}
	handleResponse(response, previewStates) {
		this.nativeExecutionObserved = dispatchCodexAppServerResponse(response, this.pending, this.catalogResponses, codexCatalogSourceForClient(this), previewStates) || this.nativeExecutionObserved;
	}
	handleNotification(notification) {
		const params = notification.params;
		if (notification.method === "serverRequest/resolved") this.serverRequests.resolve(params);
		if (notification.method === "item/commandExecution/outputDelta" || notification.method === "item/commandExecution/terminalInteraction" || isJsonObject(params) && (isJsonObject(params.item) && params.item.type === "commandExecution" || isJsonObject(params.turn) && Array.isArray(params.turn.items) && params.turn.items.some((item) => isJsonObject(item) && item.type === "commandExecution"))) this.nativeExecutionObserved = true;
		if (notification.method === "account/updated") this.modelCatalogRevision += 1;
		if (this.notificationHandlers.size === 0 && notification.method === "configWarning") {
			if (this.pendingStartupWarnings.length === CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX) this.pendingStartupWarnings.shift();
			this.pendingStartupWarnings.push(notification);
			return;
		}
		for (const handler of this.notificationHandlers) try {
			Promise.resolve(handler(notification)).catch((error) => {
				embeddedAgentLog.warn("codex app-server notification handler failed", { error });
			});
		} catch (error) {
			embeddedAgentLog.warn("codex app-server notification handler failed", { error });
		}
	}
	closeWithError(error) {
		if (this.markClosed(error)) closeCodexAppServerTransport(this.child);
	}
	markClosed(error) {
		if (this.closed) return false;
		this.closed = true;
		closeCodexCatalogClientSource(this);
		this.closeError = error;
		this.closeMessageReader();
		this.decoder.clear();
		this.catalogWorkerClosed = this.catalogWorker.close(error);
		this.catalogWorkerClosed?.catch((closeError) => {
			embeddedAgentLog.warn("codex catalog worker shutdown failed", { error: closeError });
		});
		this.serverRequests.close(error);
		this.rejectPendingRequests(error);
		return true;
	}
	rejectPendingRequests(error) {
		for (const pending of this.pending.values()) {
			pending.cleanup();
			pending.close(error);
		}
		this.pending.clear();
		for (const handler of this.closeHandlers) try {
			handler(this);
		} catch (closeError) {
			embeddedAgentLog.warn("codex app-server close handler failed", { error: closeError });
		}
	}
};
/** Raised when the initialize handshake detects an unsupported app-server version. */
var CodexAppServerVersionError = class extends Error {
	constructor(detectedVersion) {
		const detected = detectedVersion ? `detected ${detectedVersion}` : "OpenClaw could not determine the running Codex version";
		super(`Codex app-server ${MIN_SUPPORTED_CODEX_APP_SERVER_VERSION} or newer is required, but ${detected}. Update the configured Codex app-server binary, or remove custom command overrides to use the managed binary.`);
		this.name = "CodexAppServerVersionError";
		this.detectedVersion = detectedVersion;
	}
};
function assertSupportedCodexAppServerVersion(response) {
	const detectedVersion = readCodexVersionFromUserAgent(response.userAgent);
	if (!detectedVersion) throw new CodexAppServerVersionError(detectedVersion);
	const detected = parse(detectedVersion);
	if (!detected || detected.compare("0.149.0") < 0) throw new CodexAppServerVersionError(detectedVersion);
	if (detected.compare("0.155.1") > 0) embeddedAgentLog.warn("codex app-server is newer than OpenClaw's managed runtime; continuing with normal startup validation", {
		detectedVersion,
		validatedVersion: CODEX_APP_SERVER_VERSION
	});
	return detectedVersion;
}
function isUnsupportedCodexAppServerVersionError(error) {
	return error instanceof CodexAppServerVersionError;
}
function buildCodexAppServerRuntimeIdentity(response, serverVersion) {
	const userAgent = normalizeOptionalString(response.userAgent);
	const codexHome = normalizeOptionalString(response.codexHome);
	const platformFamily = normalizeOptionalString(response.platformFamily);
	const platformOs = normalizeOptionalString(response.platformOs);
	return {
		serverVersion,
		...userAgent ? { userAgent } : {},
		...codexHome ? { codexHome } : {},
		...platformFamily ? { platformFamily } : {},
		...platformOs ? { platformOs } : {}
	};
}
/** Extracts the Codex version from the app-server initialize user-agent field. */
function readCodexVersionFromUserAgent(userAgent) {
	return (userAgent?.match(/^[^/]+\/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:[\s(]|$)/))?.[1];
}
const CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS = /* @__PURE__ */ new Set([
	"item/commandExecution/requestApproval",
	"item/fileChange/requestApproval",
	"item/permissions/requestApproval"
]);
/** Returns true for app-server approval request methods OpenClaw can answer. */
function isCodexAppServerApprovalRequest(method) {
	return CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS.has(method);
}
//#endregion
export { isMatchingDynamicToolTerminalDiagnostic as A, CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS as B, readCodexDynamicToolCallParams as C, handleDynamicToolCallWithTimeout as D, createCodexElicitationResponse as E, toCodexDynamicToolProgressResponse as F, toCodexDynamicToolProtocolResponse as I, resolveCodexToolAbortTerminalReason as L, resolveTerminalDynamicToolBatchAction as M, shouldBlockTerminalReleaseForNonTerminalDynamicToolResult as N, hasPendingDynamicToolTerminalDiagnostic as O, shouldReleaseTurnAfterTerminalDynamicTool as P, createFailedDynamicToolResponse as R, assertCodexTurnStartResponse as S, readCodexTurnCompletedNotification as T, assertCodexPassiveTurnItems as _, isCodexAppServerBrokenPipeError as a, assertCodexThreadResumeResponse as b, isCodexAppServerIndeterminateTransportError as c, isCodexAppServerRequestTimeoutError as d, isUnsupportedCodexAppServerVersionError as f, assertCodexModelListResponse as g, CodexThreadDirectInputError as h, isCodexAppServerApprovalRequest as i, resolveDynamicToolCallTimeoutMs as j, isDynamicToolTerminalDiagnosticEvent as k, isCodexAppServerOverloadError as l, CodexServerRequestResolvedError as m, client_exports as n, isCodexAppServerConnectionClosedError as o, resolveCodexAppServerClientInstanceId as p, getCodexAppServerClientInstanceId as r, isCodexAppServerIndeterminateRequestCancellationError as s, CodexAppServerClient as t, isCodexAppServerPrewriteRequestCancellationError as u, assertCodexThreadAcceptsDirectInput as v, readCodexErrorNotification as w, assertCodexThreadStartResponse as x, assertCodexThreadForkResponse as y, failedToolResult as z };
