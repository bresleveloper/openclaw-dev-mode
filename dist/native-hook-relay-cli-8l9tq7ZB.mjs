import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as setSafeTimeout } from "./timer-delay-CaN6-bja.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DRdbYkg7.mjs";
import { a as renderNativeHookRelayUnavailableResponse, n as invokeNativeHookRelayBridge, r as isNativeHookRelayBridgeStaleRegistrationError } from "./native-hook-relay-client-D0rZEfdq.mjs";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { request } from "node:https";
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
		const req = request(url, {
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
	const { callGateway } = await import("./call-BvbeEASg.mjs");
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
export { runNativeHookRelayCliFromArgv as n, runNativeHookRelayCli as t };
