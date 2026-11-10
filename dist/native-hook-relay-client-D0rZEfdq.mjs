import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as isPidDefinitelyDead } from "./pid-alive-dd7OR8F6.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { t as SqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { t as restoreNativeErrorResponse } from "./native-error-response-6ofCMHxA.mjs";
import { t as setSafeTimeout } from "./timer-delay-CaN6-bja.mjs";
import { a as readNativeHookRelayEvent, i as normalizePositiveInteger, o as readNativeHookRelayProvider, s as readNonEmptyString } from "./native-hook-relay-utils-CG_lxxVt.mjs";
import path from "node:path";
import { request } from "node:http";
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
		const { readNativeHookRelayClientRecord } = await import("./native-hook-relay-client-read-Dke-5feN.mjs");
		params.signal?.throwIfAborted();
		return readNativeHookRelayClientRecord(input, 0);
	}
	const [{ WorkerTaskPool }, { resolveRuntimeProcessEntrypointUrl }] = await Promise.all([import("./worker-task-pool-CvM7d10Q.mjs"), import("./runtime-process-url-BXPNA_Cz.mjs")]);
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
//#region src/agents/harness/native-hook-relay-client.ts
const MAX_NATIVE_HOOK_BRIDGE_RESPONSE_BYTES = 5e6;
const NATIVE_HOOK_BRIDGE_RETRY_INTERVAL_MS = 25;
const NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR = "native hook relay bridge stale registration";
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
export { renderNativeHookRelayUnavailableResponse as a, isRetryableNativeHookRelayBridgeLookupError as i, invokeNativeHookRelayBridge as n, codexNativeHookRelayResponseCodec as o, isNativeHookRelayBridgeStaleRegistrationError as r, DEFAULT_RELAY_TIMEOUT_MS as s, NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR as t };
