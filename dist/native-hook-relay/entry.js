#!/usr/bin/env node
import { ft as toErrorObject } from "./redact-tYkqLD33.mjs";
import { T as parseStrictPositiveInteger, m as sleep } from "./utils-c2rFzEZe.mjs";
import { S as isSqliteLockError, t as SqliteSchemaVersionError } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-B0Qv4xHQ.mjs";
import { o as resolveSafeTimeoutDelayMs } from "./timeouts-CCaZBaGI.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-C844xNSs.mjs";
import process$1 from "node:process";
import { request } from "node:http";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { request as request$1 } from "node:https";
//#region src/utils/timer-delay.ts
function setSafeTimeout(callback, delayMs, opts) {
	return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
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
	params.signal?.throwIfAborted();
	const pathname = path.resolve(params.stateDbPath ?? resolveOpenClawStateSqlitePath());
	const input = {
		relayId: params.relayId,
		stateDbPath: pathname
	};
	if (!process.versions.bun) {
		const { readNativeHookRelayClientRecord } = await import("./native-hook-relay-client-read-B7F1BScX.mjs");
		params.signal?.throwIfAborted();
		return readNativeHookRelayClientRecord(input, 0);
	}
	const [{ WorkerTaskPool }, { resolveRuntimeProcessEntrypointUrl }] = await Promise.all([import("./worker-task-pool-CGo0D80W.mjs"), import("./runtime-process-url-CWxv2Qdu.mjs")]);
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("nativeHookRelayClient"),
		workerClass: "singleton"
	});
	try {
		const result = await pool.run(input, {
			inputBytes: 2 * (params.relayId.length + pathname.length),
			signal: params.signal
		});
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
	const startedAt = performance.now();
	const deadline = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, deadline.signal]) : deadline.signal;
	const timer = setSafeTimeout(() => deadline.abort(/* @__PURE__ */ new Error("native hook relay bridge timed out")), timeoutMs);
	timer.unref();
	let lastError = /* @__PURE__ */ new Error("native hook relay bridge not found");
	try {
		while (performance.now() - startedAt < timeoutMs) {
			signal.throwIfAborted();
			try {
				const record = await readNativeHookRelayClientBridgeRecord({
					relayId,
					stateDbPath: params.stateDbPath,
					signal
				});
				signal.throwIfAborted();
				if (!record || isPidDefinitelyDead(record.pid)) throw new Error("native hook relay bridge not found");
				if (Date.now() > record.expiresAtMs) throw new Error("native hook relay bridge expired");
				if (performance.now() - startedAt >= timeoutMs) throw new Error("native hook relay bridge timed out");
				const response = await postNativeHookRelayBridgeRecord({
					record,
					signal,
					payload: {
						provider,
						relayId,
						event,
						generation: params.generation,
						rawPayload: params.rawPayload
					}
				});
				signal.throwIfAborted();
				if (performance.now() - startedAt >= timeoutMs) throw new Error("native hook relay bridge timed out");
				return response;
			} catch (error) {
				signal.throwIfAborted();
				lastError = error;
				const elapsedMs = performance.now() - startedAt;
				if (error instanceof Error && error.message === "native hook relay bridge not found" && elapsedMs >= registrationTimeoutMs) break;
				if (!isRetryableNativeHookRelayBridgeLookupError({
					error,
					elapsedMs
				})) break;
				await sleep(Math.min(NATIVE_HOOK_BRIDGE_RETRY_INTERVAL_MS, timeoutMs - elapsedMs), signal);
			}
		}
		signal.throwIfAborted();
		throw lastError instanceof Error ? lastError : new Error(String(lastError));
	} finally {
		clearTimeout(timer);
	}
}
function postNativeHookRelayBridgeRecord(params) {
	params.signal.throwIfAborted();
	const body = JSON.stringify(params.payload);
	return new Promise((resolve, reject) => {
		let outcome;
		const fail = (error) => {
			outcome ??= {
				ok: false,
				error: toErrorObject(error, "Non-Error rejection")
			};
			req.destroy();
		};
		const req = request({
			hostname: params.record.hostname,
			method: "POST",
			path: "/invoke",
			port: params.record.port,
			agent: false,
			signal: params.signal,
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
					fail(/* @__PURE__ */ new Error("native hook relay bridge response too large"));
					return;
				}
				responseText += chunkText;
			});
			res.on("error", fail);
			res.on("end", () => {
				if (outcome) return;
				try {
					const parsed = JSON.parse(responseText);
					if (parsed.ok) outcome = {
						ok: true,
						value: parsed.result
					};
					else fail(new Error(parsed.error || "native hook relay bridge failed"));
				} catch (error) {
					fail(error);
				}
			});
		});
		req.on("error", fail);
		req.once("close", () => {
			if (outcome?.ok) resolve(outcome.value);
			else reject(outcome?.error ?? /* @__PURE__ */ new Error("native hook relay bridge closed before its response"));
		});
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
//#region src/agents/harness/native-hook-relay-remote-client.ts
const MAX_CREDENTIAL_BYTES = 16384;
const MAX_RESPONSE_BYTES = 1048576;
/** Read a dedicated credential, never a Gateway config or shared state database. */
async function invokeRemoteNativeHookRelay(credentialPath, params, signal) {
	let credential;
	try {
		const { buffer } = await readRegularFile({
			filePath: credentialPath,
			maxBytes: MAX_CREDENTIAL_BYTES
		});
		credential = JSON.parse(buffer.toString("utf8"));
	} catch {
		throw new Error("Invalid native hook callback credential");
	}
	if (!credential || typeof credential.url !== "string" || typeof credential.token !== "string" || !credential.token) throw new Error("Invalid native hook callback credential");
	let url;
	try {
		url = new URL(credential.url);
	} catch {
		throw new Error("Invalid native hook callback URL");
	}
	if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("Native hook callback requires an HTTPS URL without credentials or query");
	signal.throwIfAborted();
	const body = JSON.stringify(params);
	return await new Promise((resolve, reject) => {
		let outcome;
		const fail = (message) => {
			outcome ??= {
				ok: false,
				error: new Error(message)
			};
			req.destroy();
		};
		const req = request$1(url, {
			method: "POST",
			agent: false,
			signal,
			headers: {
				authorization: `Bearer ${credential.token}`,
				"content-type": "application/json",
				"content-length": Buffer.byteLength(body)
			}
		}, (res) => {
			res.on("error", () => fail("Native hook callback response failed"));
			if (res.statusCode !== 200) {
				fail(`Native hook callback rejected (${res.statusCode ?? 0})`);
				return;
			}
			const chunks = [];
			let size = 0;
			res.on("data", (chunk) => {
				size += chunk.length;
				if (size > MAX_RESPONSE_BYTES) {
					fail("Native hook callback response too large");
					return;
				}
				chunks.push(chunk);
			});
			res.on("end", () => {
				try {
					const decoded = JSON.parse(Buffer.concat(chunks).toString("utf8"));
					const result = decoded?.result;
					if (decoded?.ok !== true || !result || typeof result.stdout !== "string" || typeof result.stderr !== "string" || !Number.isInteger(result.exitCode)) throw new Error("Invalid response");
					outcome ??= {
						ok: true,
						value: result
					};
				} catch {
					fail("Invalid native hook callback response");
				}
			});
		});
		req.on("error", () => fail("Native hook callback connection failed"));
		req.once("close", () => {
			if (outcome?.ok) resolve(outcome.value);
			else reject(outcome?.error ?? /* @__PURE__ */ new Error("Native hook callback connection failed"));
		});
		req.end(body);
	});
}
//#endregion
//#region src/cli/parse-timeout.ts
function invalidTimeout(flagName, value) {
	const suffix = value ? ` Received: "${value}".` : "";
	return /* @__PURE__ */ new Error(`Invalid ${flagName}. Use a positive millisecond value, e.g. ${flagName} 30000.${suffix}`);
}
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
	"--remote-credential": "remoteCredential",
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
async function runNativeHookRelayCliFromArgv(argv) {
	return await runNativeHookRelayCli(parseNativeHookRelayCliOptions(argv));
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
async function runNativeHookRelayCli(opts) {
	const { stdin, stdout, stderr } = process;
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
			const remoteCredential = opts.remoteCredential;
			if (remoteCredential) return writeResponse(await withNativeHookRelayDeadline(deadline, () => invokeRemoteNativeHookRelay(remoteCredential, {
				provider,
				relayId,
				generation,
				event,
				rawPayload
			}, deadline.signal)));
			try {
				const remainingMs = remainingNativeHookRelayDeadlineMs(deadline);
				return writeResponse(await withNativeHookRelayDeadline(deadline, () => invokeNativeHookRelayBridge({
					signal: deadline.signal,
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
				if (isNativeHookRelayDeadlineError(error) || isNativeHookRelayBridgeStaleRegistrationError(error)) throw error;
			}
			return writeResponse(await withNativeHookRelayDeadline(deadline, () => callGatewayLazy({
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
	const { callGateway } = await import("./call-CJQ0ehO0.mjs");
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
		stream.destroy(new NativeHookRelayDeadlineError(deadline.timeoutMs));
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
	const timer = setSafeTimeout(() => controller.abort(new NativeHookRelayDeadlineError(timeoutMs)), timeoutMs);
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
async function withNativeHookRelayDeadline(deadline, run) {
	remainingNativeHookRelayDeadlineMs(deadline);
	try {
		const result = await run();
		remainingNativeHookRelayDeadlineMs(deadline);
		return result;
	} catch (error) {
		remainingNativeHookRelayDeadlineMs(deadline);
		throw error;
	}
}
//#endregion
//#region src/cli/native-hook-relay-entry.ts
process$1.title = "openclaw-hooks";
let exitCode = 1;
try {
	exitCode = await runNativeHookRelayCliFromArgv(process$1.argv);
} catch (error) {
	process$1.stderr.write(`native hook relay failed: ${error instanceof Error ? error.message : String(error)}\n`);
}
process$1.exitCode = exitCode;
//#endregion
export {};
