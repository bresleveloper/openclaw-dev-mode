import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as setSafeTimeout } from "./timer-delay-DjFOGnXg.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-G1LpD3Dj.mjs";
import { a as renderNativeHookRelayUnavailableResponse, n as invokeNativeHookRelayBridge, r as isNativeHookRelayBridgeStaleRegistrationError } from "./native-hook-relay-client-MJaE4R92.mjs";
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
		timeoutMs = parseTimeoutMsWithFallback(opts.timeout, 5e3);
	} catch (error) {
		writeText(stderr, formatRelayCliError("invalid native hook timeout", error));
		return 1;
	}
	const deadline = createNativeHookRelayDeadline(timeoutMs);
	try {
		let rawPayload;
		try {
			const rawInput = await readStreamText(stdin, MAX_NATIVE_HOOK_STDIN_BYTES, deadline);
			rawPayload = rawInput.trim() ? JSON.parse(rawInput) : null;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			writeText(stderr, formatRelayCliError("failed to read native hook input", error));
			return 1;
		}
		try {
			const remainingMs = remainingNativeHookRelayDeadlineMs(deadline);
			const response = await withNativeHookRelayDeadline(deadline, invokeBridge({
				provider,
				relayId,
				stateDbPath: opts.stateDb?.trim() || void 0,
				generation,
				event,
				rawPayload,
				registrationTimeoutMs: Math.min(100, remainingMs),
				timeoutMs: remainingMs
			}));
			writeText(stdout, response.stdout);
			writeText(stderr, response.stderr);
			return response.exitCode;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			if (isNativeHookRelayBridgeStaleRegistrationError(error)) {
				writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
				return writeNativeHookRelayUnavailableResponse({
					stdout,
					stderr,
					opts,
					provider,
					event
				});
			}
		}
		try {
			const response = await withNativeHookRelayDeadline(deadline, callGatewayFn({
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
			}));
			writeText(stdout, response.stdout);
			writeText(stderr, response.stderr);
			return response.exitCode;
		} catch (error) {
			if (isNativeHookRelayDeadlineError(error)) return writeNativeHookRelayDeadlineResponse({
				stdout,
				stderr,
				opts,
				provider,
				event,
				error
			});
			writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
			return writeNativeHookRelayUnavailableResponse({
				stdout,
				stderr,
				opts,
				provider,
				event
			});
		}
	} finally {
		deadline.dispose();
	}
}
async function callGatewayLazy(opts) {
	const { callGateway } = await import("./call-bfuNQIMk.mjs");
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
		destroyReadableStream(stream, createNativeHookRelayDeadlineError(deadline));
	};
	deadline.signal.addEventListener("abort", abortRead, { once: true });
	try {
		throwIfNativeHookRelayDeadlineExpired(deadline);
		for await (const chunk of stream) {
			throwIfNativeHookRelayDeadlineExpired(deadline);
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			total += buffer.byteLength;
			if (total > maxBytes) throw new Error(`native hook input exceeds ${maxBytes} bytes`);
			chunks.push(buffer);
		}
		throwIfNativeHookRelayDeadlineExpired(deadline);
		return Buffer.concat(chunks, total).toString("utf8");
	} catch (error) {
		if (isNativeHookRelayDeadlineError(error) || deadline.signal.aborted) throw createNativeHookRelayDeadlineError(deadline);
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
function createNativeHookRelayDeadlineError(deadline) {
	return new NativeHookRelayDeadlineError(deadline.timeoutMs);
}
function isNativeHookRelayDeadlineError(error) {
	return error instanceof Error && error.name === "NativeHookRelayDeadlineError";
}
function remainingNativeHookRelayDeadlineMs(deadline) {
	const remainingMs = deadline.expiresAtMs - performance.now();
	if (remainingMs <= 0 || deadline.signal.aborted) throw createNativeHookRelayDeadlineError(deadline);
	return Math.max(1, remainingMs);
}
function throwIfNativeHookRelayDeadlineExpired(deadline) {
	remainingNativeHookRelayDeadlineMs(deadline);
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
			reject(createNativeHookRelayDeadlineError(deadline));
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
function writeNativeHookRelayUnavailableResponse(params) {
	const response = renderNativeHookRelayUnavailableResponse({
		provider: params.provider,
		event: params.event,
		preToolUseUnavailable: params.opts.preToolUseUnavailable,
		message: params.message ?? "Native hook relay unavailable"
	});
	writeText(params.stdout, response.stdout);
	writeText(params.stderr, response.stderr);
	return response.exitCode;
}
function writeNativeHookRelayDeadlineResponse(params) {
	writeText(params.stderr, formatRelayCliError("native hook relay timed out", params.error));
	return writeNativeHookRelayUnavailableResponse({
		stdout: params.stdout,
		stderr: params.stderr,
		opts: params.opts,
		provider: params.provider,
		event: params.event,
		message: "Native hook relay timed out"
	});
}
//#endregion
export { runNativeHookRelayCliFromArgv as n, runNativeHookRelayCli as t };
