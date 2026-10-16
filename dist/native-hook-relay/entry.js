#!/usr/bin/env node
import { t as disableExitUnsafeCompilers } from "./node-exit-safe-compilers-B7V3uapp.mjs";
import { s as toErrorObject } from "./error-coercion-DKQY4wyF.mjs";
import { u as parseStrictPositiveInteger } from "./number-coercion-CmpLVzZ6.mjs";
import { R as isSqliteLockError, t as SqliteSchemaVersionError } from "./sqlite-user-version-C7PVO8Wf.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-Cnn-Mjdg.mjs";
import { p as sleep } from "./utils-BfTq4rUg.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1QtF7Ci.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-C844xNSs.mjs";
import { o as resolveSafeTimeoutDelayMs } from "./timeouts-B9zvH0xD.mjs";
import process$1 from "node:process";
import { request } from "node:http";
import path from "node:path";
//#region src/process/output-drain.ts
const OUTPUT_DRAIN_TIMEOUT_MS = 5e3;
/** Drain both output pipes before a bounded owner termination. */
function drainProcessOutput(exit) {
	let pendingStreams = 2;
	const fallback = setTimeout(exit, OUTPUT_DRAIN_TIMEOUT_MS);
	fallback.unref();
	const drain = (stream) => {
		stream.write("", () => {
			pendingStreams -= 1;
			if (pendingStreams === 0) {
				clearTimeout(fallback);
				setImmediate(exit);
			}
		});
	};
	drain(process.stdout);
	drain(process.stderr);
}
//#endregion
//#region src/infra/native-error-response.ts
function restoreNativeErrorResponse(value) {
	const cause = value.cause ? Object.assign(new Error(value.cause.message), value.cause) : void 0;
	return Object.assign(new Error(value.message, cause ? { cause } : void 0), {
		name: value.name,
		code: value.code,
		errcode: value.errcode
	});
}
//#endregion
//#region src/agents/harness/native-hook-relay-client-store.ts
/** Read one native relay locator without loading the shared-state writer lifecycle. */
async function readNativeHookRelayClientBridgeRecord(params) {
	const pathname = path.resolve(params.stateDbPath ?? resolveOpenClawStateSqlitePath());
	const input = {
		relayId: params.relayId,
		stateDbPath: pathname
	};
	if (!process.versions.bun) {
		const { readNativeHookRelayClientRecord } = await import("./native-hook-relay-client-read-DK-BUAQf.mjs");
		return readNativeHookRelayClientRecord(input, 0);
	}
	const [{ WorkerTaskPool }, { resolveRuntimeProcessEntrypointUrl }] = await Promise.all([import("./worker-task-pool-DfrJ8Ldw.mjs"), import("./runtime-process-url-CeWXfw6H.mjs")]);
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("nativeHookRelayClient"),
		maxWorkers: 1
	});
	try {
		const result = await pool.run(input, { inputBytes: 2 * (params.relayId.length + pathname.length) });
		if (!result.ok) throw result.newerSchema ? new SqliteSchemaVersionError(result.error.message) : restoreNativeErrorResponse(result.error);
		return result.record;
	} finally {
		await pool.close();
	}
}
//#endregion
//#region src/agents/harness/native-hook-relay-constants.ts
const DEFAULT_RELAY_TIMEOUT_MS = 5e3;
//#endregion
//#region src/agents/harness/native-hook-relay-response-codec.ts
function renderJsonResponse(payload) {
	return {
		stdout: `${JSON.stringify(payload)}\n`,
		stderr: "",
		exitCode: 0
	};
}
/** Render the native Codex hook responses shared by server and cold client paths. */
const codexNativeHookRelayResponseCodec = {
	renderNoopResponse() {
		return {
			stdout: "",
			stderr: "",
			exitCode: 0
		};
	},
	renderPreToolUseBlockResponse(reason, failureDisposition) {
		return {
			...renderJsonResponse({ hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: reason
			} }),
			...failureDisposition ? { failureDisposition } : {}
		};
	},
	renderPermissionDecisionResponse(decision, message) {
		return renderJsonResponse({ hookSpecificOutput: {
			hookEventName: "PermissionRequest",
			decision: decision === "allow" ? { behavior: "allow" } : {
				behavior: "deny",
				message: message?.trim() || "Denied by OpenClaw"
			}
		} });
	},
	renderBeforeAgentFinalizeReviseResponse: (reason) => renderJsonResponse({
		decision: "block",
		reason
	}),
	renderBeforeAgentFinalizeStopResponse: (reason) => renderJsonResponse({
		continue: false,
		...reason?.trim() ? { stopReason: reason.trim() } : {}
	})
};
//#endregion
//#region src/agents/harness/native-hook-relay-utils.ts
function normalizePositiveInteger(value, fallback) {
	return normalizeOptionalPositiveInteger(value) ?? fallback;
}
function normalizeOptionalPositiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readNativeHookRelayProvider(value) {
	if (value === "codex") return value;
	throw new Error("unsupported native hook relay provider");
}
function readNativeHookRelayEvent(value) {
	if (value === "pre_tool_use" || value === "post_tool_use" || value === "permission_request" || value === "before_agent_finalize") return value;
	throw new Error("unsupported native hook relay event");
}
function readNonEmptyString(value, name) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new Error(`native hook relay ${name} is required`);
}
//#endregion
//#region src/agents/harness/native-hook-relay-client.ts
const MAX_NATIVE_HOOK_BRIDGE_RESPONSE_BYTES = 5e6;
const NATIVE_HOOK_BRIDGE_RETRY_INTERVAL_MS = 25;
/** Invoke a registered native relay through its read-only SQLite locator. */
async function invokeNativeHookRelayBridge(params) {
	const provider = readNativeHookRelayProvider(params.provider);
	const relayId = readNonEmptyString(params.relayId, "relayId");
	const event = readNativeHookRelayEvent(params.event);
	const timeoutMs = normalizePositiveInteger(params.timeoutMs, DEFAULT_RELAY_TIMEOUT_MS);
	const registrationTimeoutMs = normalizePositiveInteger(params.registrationTimeoutMs, timeoutMs);
	const startedAt = Date.now();
	let lastError = /* @__PURE__ */ new Error("native hook relay bridge not found");
	while (Date.now() - startedAt < timeoutMs) try {
		const record = await readNativeHookRelayClientBridgeRecord({
			relayId,
			stateDbPath: params.stateDbPath
		});
		if (!record) throw new Error("native hook relay bridge not found");
		if (isPidDefinitelyDead(record.pid)) throw new Error("native hook relay bridge not found");
		if (Date.now() > record.expiresAtMs) throw new Error("native hook relay bridge expired");
		const remainingMs = timeoutMs - (Date.now() - startedAt);
		if (remainingMs <= 0) throw new Error("native hook relay bridge timed out");
		return await postNativeHookRelayBridgeRecord({
			record,
			timeoutMs: remainingMs,
			payload: {
				provider,
				relayId,
				event,
				generation: params.generation,
				rawPayload: params.rawPayload
			}
		});
	} catch (error) {
		lastError = error;
		const elapsedMs = Date.now() - startedAt;
		if (error instanceof Error && error.message === "native hook relay bridge not found" && elapsedMs >= registrationTimeoutMs) break;
		if (!isRetryableNativeHookRelayBridgeLookupError({
			error,
			elapsedMs
		})) break;
		await sleep(Math.min(NATIVE_HOOK_BRIDGE_RETRY_INTERVAL_MS, timeoutMs - elapsedMs));
	}
	throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
function postNativeHookRelayBridgeRecord(params) {
	const body = JSON.stringify(params.payload);
	return new Promise((resolve, reject) => {
		let settled = false;
		const resolveOnce = (value) => {
			if (!settled) {
				settled = true;
				resolve(value);
			}
		};
		const rejectOnce = (error) => {
			if (!settled) {
				settled = true;
				reject(toErrorObject(error, "Non-Error rejection"));
			}
		};
		const req = request({
			hostname: params.record.hostname,
			method: "POST",
			path: "/invoke",
			port: params.record.port,
			timeout: params.timeoutMs,
			headers: {
				authorization: `Bearer ${params.record.token}`,
				"content-type": "application/json",
				"content-length": Buffer.byteLength(body)
			}
		}, (res) => {
			let responseText = "";
			let responseBytes = 0;
			res.setEncoding("utf8");
			res.on("data", (chunk) => {
				const chunkText = typeof chunk === "string" ? chunk : String(chunk);
				responseBytes += Buffer.byteLength(chunkText);
				if (responseBytes > MAX_NATIVE_HOOK_BRIDGE_RESPONSE_BYTES) {
					rejectOnce(/* @__PURE__ */ new Error("native hook relay bridge response too large"));
					res.destroy();
					return;
				}
				responseText += chunkText;
			});
			res.on("error", rejectOnce);
			res.on("end", () => {
				if (settled) return;
				try {
					const parsed = JSON.parse(responseText);
					if (parsed.ok) {
						resolveOnce(parsed.result);
						return;
					}
					rejectOnce(new Error(parsed.error || "native hook relay bridge failed"));
				} catch (error) {
					rejectOnce(error);
				}
			});
		});
		req.on("timeout", () => {
			req.destroy(/* @__PURE__ */ new Error("native hook relay bridge timed out"));
		});
		req.on("error", rejectOnce);
		req.end(body);
	});
}
function isRetryableNativeHookRelayBridgeError(error) {
	const code = error.code;
	return code === "ENOENT" || code === "ECONNREFUSED" || code === "EAGAIN" || isSqliteLockError(error) || error instanceof Error && error.message === "native hook relay bridge not found";
}
function isRetryableNativeHookRelayBridgeLookupError(params) {
	return isRetryableNativeHookRelayBridgeError(params.error) || params.elapsedMs < 250 && isNativeHookRelayBridgeStaleRegistrationError(params.error);
}
/** Detect a stale locator response that must not fall back to the Gateway. */
function isNativeHookRelayBridgeStaleRegistrationError(error) {
	return error instanceof Error && error.message === "native hook relay bridge stale registration";
}
/** Render the provider response used when both relay transports are unavailable. */
function renderNativeHookRelayUnavailableResponse(params) {
	readNativeHookRelayProvider(params.provider);
	const event = readNativeHookRelayEvent(params.event);
	const message = params.message?.trim() || "Native hook relay unavailable";
	if (event === "pre_tool_use") {
		if (params.preToolUseUnavailable === "noop") return codexNativeHookRelayResponseCodec.renderNoopResponse();
		return codexNativeHookRelayResponseCodec.renderPreToolUseBlockResponse(message);
	}
	if (event === "permission_request") return codexNativeHookRelayResponseCodec.renderPermissionDecisionResponse("deny", message);
	return codexNativeHookRelayResponseCodec.renderNoopResponse();
}
//#endregion
//#region src/utils/timer-delay.ts
/** Wrapper around setTimeout that clamps unsafe or invalid delays before arming the timer. */
function setSafeTimeout(callback, delayMs, opts) {
	return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
}
//#endregion
//#region src/cli/parse-timeout.ts
function invalidTimeout(flagName, value) {
	const suffix = value ? ` Received: "${value}".` : "";
	return /* @__PURE__ */ new Error(`Invalid ${flagName}. Use a positive millisecond value, e.g. ${flagName} 30000.${suffix}`);
}
/** Parse a positive timeout or return the supplied fallback for missing values. */
function parseTimeoutMsWithFallback(raw, fallbackMs, options = {}) {
	const flagName = options.flagName ?? "--timeout";
	if (raw === void 0 || raw === null) return fallbackMs;
	const value = typeof raw === "string" ? raw.trim() : typeof raw === "number" || typeof raw === "bigint" ? String(raw) : null;
	if (!value) {
		if (options.invalidType === "error") throw invalidTimeout(flagName);
		return fallbackMs;
	}
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw invalidTimeout(flagName, value);
	return parsed;
}
//#endregion
//#region src/cli/native-hook-relay-cli.ts
const MAX_NATIVE_HOOK_STDIN_BYTES = 1048576;
const NATIVE_HOOK_RELAY_VALUE_FLAGS = {
	"--provider": "provider",
	"--relay-id": "relayId",
	"--state-db": "stateDb",
	"--generation": "generation",
	"--event": "event",
	"--pre-tool-use-unavailable": "preToolUseUnavailable",
	"--timeout": "timeout"
};
var NativeHookRelayDeadlineError = class extends Error {
	constructor(timeoutMs) {
		super(`native hook relay timed out after ${timeoutMs}ms`);
		this.name = "NativeHookRelayDeadlineError";
	}
};
/** Parse and run the internal native relay directly from the process argument vector. */
async function runNativeHookRelayCliFromArgv(argv, deps = {}) {
	return await runNativeHookRelayCli(parseNativeHookRelayCliOptions(argv), deps);
}
function parseNativeHookRelayCliOptions(argv) {
	const relayIndex = argv.findIndex((arg, index) => arg === "relay" && argv[index - 1] === "hooks");
	if (relayIndex < 0) throw new Error("native hook relay command path is required");
	const opts = {};
	for (let index = relayIndex + 1; index < argv.length; index += 1) {
		const rawFlag = argv[index] ?? "";
		const equalsIndex = rawFlag.indexOf("=");
		const flag = equalsIndex > 0 ? rawFlag.slice(0, equalsIndex) : rawFlag;
		const key = NATIVE_HOOK_RELAY_VALUE_FLAGS[flag];
		if (!key) throw new Error(`unknown native hook relay option: ${rawFlag}`);
		const value = equalsIndex > 0 ? rawFlag.slice(equalsIndex + 1) : argv[++index];
		if (!value) throw new Error(`native hook relay option ${flag} requires a value`);
		opts[key] = value;
	}
	return opts;
}
/** Run one native hook relay invocation from stdin JSON to stdout/stderr response streams. */
async function runNativeHookRelayCli(opts, deps = {}) {
	const stdin = deps.stdin ?? process.stdin;
	const stdout = deps.stdout ?? process.stdout;
	const stderr = deps.stderr ?? process.stderr;
	const invokeBridge = deps.invokeBridge ?? invokeNativeHookRelayBridge;
	const callGatewayFn = deps.callGateway ?? callGatewayLazy;
	const provider = readRequiredOption(opts.provider, "provider");
	const relayId = readRequiredOption(opts.relayId, "relay-id");
	const generation = opts.generation?.trim() || void 0;
	const event = readRequiredOption(opts.event, "event");
	let timeoutMs;
	try {
		timeoutMs = parseTimeoutMsWithFallback(opts.timeout, 5e3, { invalidType: "error" });
	} catch (error) {
		writeText(stderr, formatRelayCliError("invalid native hook timeout", error));
		return 1;
	}
	const deadline = createNativeHookRelayDeadline(timeoutMs);
	const writeResponse = (response) => {
		writeText(stdout, response.stdout);
		writeText(stderr, response.stderr);
		return response.exitCode;
	};
	const unavailable = (message = "Native hook relay unavailable") => writeResponse(renderNativeHookRelayUnavailableResponse({
		provider,
		event,
		preToolUseUnavailable: opts.preToolUseUnavailable,
		message
	}));
	const timedOut = (error) => {
		writeText(stderr, formatRelayCliError("native hook relay timed out", error));
		return unavailable("Native hook relay timed out");
	};
	try {
		let rawPayload;
		try {
			const rawInput = await readStreamText(stdin, MAX_NATIVE_HOOK_STDIN_BYTES, deadline);
			rawPayload = rawInput.trim() ? JSON.parse(rawInput) : null;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return timedOut(error);
			writeText(stderr, formatRelayCliError("failed to read native hook input", error));
			return 1;
		}
		try {
			const remainingMs = remainingNativeHookRelayDeadlineMs(deadline);
			return writeResponse(await withNativeHookRelayDeadline(deadline, invokeBridge({
				provider,
				relayId,
				stateDbPath: opts.stateDb?.trim() || void 0,
				generation,
				event,
				rawPayload,
				registrationTimeoutMs: Math.min(100, remainingMs),
				timeoutMs: remainingMs
			})));
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return timedOut(error);
			if (isNativeHookRelayBridgeStaleRegistrationError(error)) {
				writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
				return unavailable();
			}
		}
		try {
			return writeResponse(await withNativeHookRelayDeadline(deadline, callGatewayFn({
				method: "nativeHook.invoke",
				params: {
					provider,
					relayId,
					generation,
					event,
					rawPayload
				},
				timeoutMs: remainingNativeHookRelayDeadlineMs(deadline),
				signal: deadline.signal,
				scopes: [ADMIN_SCOPE]
			})));
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return timedOut(error);
			writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
			return unavailable();
		}
	} finally {
		deadline.dispose();
	}
}
async function callGatewayLazy(opts) {
	const { callGateway } = await import("./call-CdrhF-Le.mjs");
	return await callGateway(opts);
}
function readRequiredOption(value, name) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new Error(`Missing required option --${name}`);
}
async function readStreamText(stream, maxBytes, deadline) {
	const chunks = [];
	let total = 0;
	const abortRead = () => {
		destroyReadableStream(stream, new NativeHookRelayDeadlineError(deadline.timeoutMs));
	};
	deadline.signal.addEventListener("abort", abortRead, { once: true });
	try {
		remainingNativeHookRelayDeadlineMs(deadline);
		for await (const chunk of stream) {
			remainingNativeHookRelayDeadlineMs(deadline);
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			total += buffer.byteLength;
			if (total > maxBytes) throw new Error(`native hook input exceeds ${maxBytes} bytes`);
			chunks.push(buffer);
		}
		remainingNativeHookRelayDeadlineMs(deadline);
		return Buffer.concat(chunks, total).toString("utf8");
	} catch (error) {
		if (isNativeHookRelayDeadlineError(error) || deadline.signal.aborted) throw new NativeHookRelayDeadlineError(deadline.timeoutMs);
		throw error;
	} finally {
		deadline.signal.removeEventListener("abort", abortRead);
	}
}
function writeText(stream, value) {
	if (value) stream.write(value);
}
function formatRelayCliError(prefix, error) {
	return `${prefix}: ${error instanceof Error ? error.message : String(error)}\n`;
}
function createNativeHookRelayDeadline(timeoutMs) {
	const controller = new AbortController();
	const timer = setSafeTimeout(() => controller.abort(), timeoutMs);
	timer.unref?.();
	return {
		expiresAtMs: performance.now() + timeoutMs,
		signal: controller.signal,
		timeoutMs,
		dispose: () => clearTimeout(timer)
	};
}
function isNativeHookRelayDeadlineError(error) {
	return error instanceof Error && error.name === "NativeHookRelayDeadlineError";
}
function remainingNativeHookRelayDeadlineMs(deadline) {
	const remainingMs = deadline.expiresAtMs - performance.now();
	if (remainingMs <= 0 || deadline.signal.aborted) throw new NativeHookRelayDeadlineError(deadline.timeoutMs);
	return Math.max(1, remainingMs);
}
function destroyReadableStream(stream, error) {
	const destroy = stream.destroy;
	if (typeof destroy === "function") {
		destroy.call(stream, error);
		return;
	}
	stream.pause();
}
async function withNativeHookRelayDeadline(deadline, promise) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		const cleanup = () => deadline.signal.removeEventListener("abort", abort);
		const abort = () => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(new NativeHookRelayDeadlineError(deadline.timeoutMs));
		};
		deadline.signal.addEventListener("abort", abort, { once: true });
		promise.then((value) => {
			if (settled) return;
			if (deadline.signal.aborted || deadline.expiresAtMs <= performance.now()) {
				abort();
				return;
			}
			settled = true;
			cleanup();
			resolve(value);
		}, (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(error instanceof Error ? error : new Error(String(error)));
		});
		if (deadline.signal.aborted || deadline.expiresAtMs <= performance.now()) abort();
	});
}
//#endregion
//#region src/cli/native-hook-relay-entry.ts
disableExitUnsafeCompilers();
process$1.title = "openclaw-hooks";
let exitCode = 1;
try {
	exitCode = await runNativeHookRelayCliFromArgv(process$1.argv);
} catch (error) {
	process$1.stderr.write(`native hook relay failed: ${error instanceof Error ? error.message : String(error)}\n`);
}
process$1.exitCode = exitCode;
drainProcessOutput(() => process$1.exit(exitCode));
//#endregion
export {};
