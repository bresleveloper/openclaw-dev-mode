import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as SqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as restoreNativeErrorResponse } from "./native-error-response-DCdCOZuh.mjs";
import { a as readNativeHookRelayEvent, i as normalizePositiveInteger, o as readNativeHookRelayProvider, s as readNonEmptyString } from "./native-hook-relay-utils-CG_lxxVt.mjs";
import path from "node:path";
import { request } from "node:http";
//#region src/agents/harness/native-hook-relay-client-store.ts
/** Read one native relay locator without loading the shared-state writer lifecycle. */
async function readNativeHookRelayClientBridgeRecord(params) {
	const pathname = path.resolve(params.stateDbPath ?? resolveOpenClawStateSqlitePath());
	const input = {
		relayId: params.relayId,
		stateDbPath: pathname
	};
	if (!process.versions.bun) {
		const { readNativeHookRelayClientRecord } = await import("./native-hook-relay-client-read-B9L8bv0v.mjs");
		return readNativeHookRelayClientRecord(input, 0);
	}
	const [{ WorkerTaskPool }, { resolveRuntimeProcessEntrypointUrl }] = await Promise.all([import("./worker-task-pool-CvSUZLDa.mjs"), import("./runtime-process-url-Dq8082ri.mjs")]);
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
export { renderNativeHookRelayUnavailableResponse as a, isRetryableNativeHookRelayBridgeLookupError as i, invokeNativeHookRelayBridge as n, codexNativeHookRelayResponseCodec as o, isNativeHookRelayBridgeStaleRegistrationError as r, DEFAULT_RELAY_TIMEOUT_MS as s, NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR as t };
