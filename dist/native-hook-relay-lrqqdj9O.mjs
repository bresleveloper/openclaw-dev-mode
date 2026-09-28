import { D as resolveExpiresAtMsFromDurationMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-CXdZEzr_.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as createHttpRequestAbortSignal } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode, t as formatMcpCodexApprovalRemedy } from "./mcp-codex-tool-approval-u1CcvKx0.mjs";
import { O as mergePluginToolMatcherScopes, n as getToolHookMatcherScope } from "./hooks-DuXrq03h.mjs";
import { i as listAgentToolResultMiddlewares, r as getAgentToolResultMiddlewareMatcherScope } from "./agent-tool-result-middleware-CfincE3c.mjs";
import { r as hasGlobalHooks, s as getGlobalHookRunnerRegistry } from "./hook-runner-global-tOGjxVvH.mjs";
import { J as requestDeferredPluginToolApproval, K as getTrustedToolPolicyMatcherScope, b as hasBeforeToolCallPolicy, ot as PluginApprovalResolutions, q as cancelDeferredPluginToolApproval, x as runBeforeToolCallHook } from "./agent-tools.before-tool-call-Ub1aezaD.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-BPkaCbRr.mjs";
import { s as payloadTextResult } from "./common-XfKigJno.mjs";
import { t as callGatewayTool } from "./gateway-DVDJurQC.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-Ce7FXvzS.mjs";
import { u as retainBeforeToolCallForNativeHookRelay } from "./host-private-capabilities-D8EEgJHq.mjs";
import { i as runAgentHarnessBeforeAgentFinalizeHook } from "./lifecycle-hook-helpers-vaKDnieD.mjs";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-DrLA80If.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { c as prepareSystemRunMutableFileBinding, u as revalidateSystemRunMutableFileBinding } from "./system-run-approval-binding-BDEolZhR.mjs";
import { a as readNativeHookRelayEvent, c as readOptionalBoolean, d as truncateRelayText, i as normalizePositiveInteger, l as shellQuoteArgs, n as isJsonValue, o as readNativeHookRelayProvider, r as normalizeOptionalPositiveInteger, s as readNonEmptyString, t as isJsonObject, u as snapshotNativeHookRelayPayload } from "./native-hook-relay-utils-CJDlPOtO.mjs";
import { n as formatNativeHookRelayApprovalPresentation, r as formatPermissionApprovalDescription } from "./native-hook-relay-approval-presentation-DMLDwkX3.mjs";
import { t as loadMcpToolGrants } from "./exec-approvals-mcp-B_umLODz.mjs";
import { i as isRetryableNativeHookRelayBridgeLookupError, o as codexNativeHookRelayResponseCodec, r as isNativeHookRelayBridgeStaleRegistrationError, s as DEFAULT_RELAY_TIMEOUT_MS, t as NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR } from "./native-hook-relay-client-MJaE4R92.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
//#region src/agents/harness/native-hook-relay-state.ts
const NATIVE_HOOK_RELAY_STATE_SYMBOL = Symbol.for("openclaw.nativeHookRelay.state");
function getNativeHookRelaySharedState() {
	const globalRecord = globalThis;
	globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL] ??= {
		relays: /* @__PURE__ */ new Map(),
		relayBridges: /* @__PURE__ */ new Map(),
		pendingOperations: /* @__PURE__ */ new Set(),
		invocations: [],
		pendingPermissionApprovals: /* @__PURE__ */ new Map(),
		pendingPreToolUseApprovals: /* @__PURE__ */ new Map(),
		permissionApprovalWindows: /* @__PURE__ */ new Map(),
		permissionAllowAlwaysApprovals: /* @__PURE__ */ new Map()
	};
	return globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL];
}
const nativeHookRelayState = getNativeHookRelaySharedState();
//#endregion
//#region src/agents/harness/native-hook-relay-store.ts
async function readNativeHookRelayBridgeRecord(params) {
	const context = captureOpenClawStateWorkerContext({ path: params.stateDbPath });
	const input = { relayId: params.relayId };
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "nativeHookRelay.read",
		input
	}), { existingOnly: true });
}
function persistNativeHookRelayBridgeRecord(type, params) {
	const context = captureOpenClawStateWorkerContext({ path: params.stateDbPath });
	const input = {
		record: { ...params.record },
		updatedAtMs: params.updatedAtMs ?? Date.now()
	};
	const assertCurrent = params.assertCurrent;
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type,
		input
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction") throw new Error("Native hook relay persistence requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				grant();
			})
		})
	});
}
async function writeNativeHookRelayBridgeRecord(params) {
	await persistNativeHookRelayBridgeRecord("nativeHookRelay.write", params);
}
async function renewOrRestoreNativeHookRelayBridgeRecord(params) {
	return persistNativeHookRelayBridgeRecord("nativeHookRelay.renew", params);
}
async function deleteNativeHookRelayBridgeRecordIfOwned(params) {
	const context = captureOpenClawStateWorkerContext({ path: params.stateDbPath });
	const input = {
		relayId: params.relayId,
		pid: params.pid,
		token: params.token
	};
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "nativeHookRelay.deleteOwned",
		input
	}));
}
async function pruneNativeHookRelayBridgeRecords(params) {
	const context = captureOpenClawStateWorkerContext({ path: params.stateDbPath });
	const nowMs = params.nowMs ?? Date.now();
	const { currentPid, isPidDead } = params;
	return runOpenClawStateWorkerOperation(context, async (scope) => {
		const snapshots = await scope.execute({
			type: "nativeHookRelay.listSnapshots",
			input: void 0
		});
		const candidates = [];
		for (const snapshot of snapshots) {
			if (nowMs > snapshot.record.expiresAtMs) {
				candidates.push({
					snapshot,
					reason: "expired"
				});
				continue;
			}
			if (snapshot.record.pid !== currentPid && await isPidDead(snapshot.record.pid)) candidates.push({
				snapshot,
				reason: "dead-pid"
			});
		}
		return candidates.length === 0 ? [] : scope.execute({
			type: "nativeHookRelay.prune",
			input: {
				candidates,
				nowMs
			}
		});
	});
}
async function clearNativeHookRelayBridgeRecordsForTests(options = {}) {
	const [{ runOpenClawStateWriteTransaction }, { clearNativeHookRelayBridgeRecordsInDatabase }] = await Promise.all([import("./openclaw-state-db-quM4UOZq.mjs"), import("./native-hook-relay-store.kernel-X5U9bv6B.mjs")]);
	runOpenClawStateWriteTransaction(clearNativeHookRelayBridgeRecordsInDatabase, { path: options.stateDbPath });
}
//#endregion
//#region src/agents/harness/native-hook-relay-bridge.ts
const MAX_NATIVE_HOOK_BRIDGE_BODY_BYTES = 5e6;
const log$2 = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays: relays$2, relayBridges: relayBridges$1, pendingOperations } = nativeHookRelayState;
function registerNativeHookRelayBridge(registration, stateDbPath, invokeRelay) {
	const token = randomUUID();
	const server = createServer();
	const listening = createDeferredCore();
	server.once("listening", listening.resolve);
	server.once("error", listening.reject);
	const bridge = {
		relayId: registration.relayId,
		stateDbPath,
		token,
		server,
		ready: listening.promise,
		pending: listening.promise,
		cancelStartup: () => listening.reject(new Error(NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR))
	};
	server.on("request", (req, res) => {
		handleNativeHookRelayBridgeRequest(req, res, {
			provider: registration.provider,
			relayId: registration.relayId,
			token,
			registration,
			bridge,
			invokeRelay
		});
	});
	relayBridges$1.set(registration.relayId, bridge);
	server.on("error", (error) => {
		log$2.debug("native hook relay bridge server error", {
			error,
			relayId: registration.relayId
		});
	});
	bridge.ready = listening.promise.then(async () => {
		assertNativeHookRelayBridgeCurrent(registration, bridge);
		await pruneNativeHookRelayBridges(stateDbPath);
		assertNativeHookRelayBridgeCurrent(registration, bridge);
		const record = resolveNativeHookRelayBridgeRecord(registration, bridge);
		if (!record) throw new Error("native hook relay bridge server address unavailable");
		await writeNativeHookRelayBridgeRecord({
			record,
			stateDbPath,
			assertCurrent: () => assertNativeHookRelayBridgeCurrent(registration, bridge)
		});
	});
	bridge.pending = bridge.ready;
	retainNativeHookRelayOperation(bridge.relayId, bridge.ready);
	server.listen(0, "127.0.0.1");
	server.unref();
	return bridge;
}
function retainNativeHookRelayOperation(relayId, operation) {
	pendingOperations.add(operation);
	operation.then(() => pendingOperations.delete(operation), (error) => {
		pendingOperations.delete(operation);
		log$2.debug("native hook relay operation failed", {
			error,
			relayId
		});
	});
}
async function drainNativeHookRelayBridge(bridge) {
	let pending;
	let failure;
	do {
		pending = bridge.pending;
		try {
			await pending;
		} catch (error) {
			failure ??= { error };
		}
	} while (pending !== bridge.pending);
	if (failure) throw failure.error;
}
function assertNativeHookRelayBridgeCurrent(registration, bridge) {
	if (relays$2.get(registration.relayId) !== registration || relayBridges$1.get(registration.relayId) !== bridge || bridge.closing) throw new Error(NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR);
}
async function pruneNativeHookRelayBridges(stateDbPath) {
	try {
		const pruned = await pruneNativeHookRelayBridgeRecords({
			currentPid: process.pid,
			isPidDead: isPidDefinitelyDead,
			stateDbPath
		});
		for (const row of pruned) log$2.debug("pruned stale native hook relay bridge record", {
			relayId: row.relayId,
			stalePid: row.pid,
			currentPid: process.pid,
			reason: row.reason
		});
	} catch (error) {
		log$2.debug("native hook relay bridge record prune skipped", { error });
	}
}
function resolveNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs = registration.expiresAtMs) {
	const address = bridge.server.address();
	if (!address || typeof address === "string") {
		log$2.debug("native hook relay bridge server address unavailable", { relayId: registration.relayId });
		return;
	}
	return {
		relayId: registration.relayId,
		pid: process.pid,
		hostname: "127.0.0.1",
		port: address.port,
		token: bridge.token,
		expiresAtMs
	};
}
async function renewNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs) {
	const renewal = bridge.pending.catch(() => void 0).then(async () => {
		assertNativeHookRelayBridgeCurrent(registration, bridge);
		const record = resolveNativeHookRelayBridgeRecord(registration, bridge, expiresAtMs);
		if (!record) return "unavailable";
		return await renewOrRestoreNativeHookRelayBridgeRecord({
			record,
			stateDbPath: bridge.stateDbPath,
			assertCurrent: () => assertNativeHookRelayBridgeCurrent(registration, bridge)
		}) ? "renewed" : "ownership-changed";
	});
	bridge.pending = renewal.then(() => void 0);
	retainNativeHookRelayOperation(bridge.relayId, bridge.pending);
	return await renewal;
}
function unregisterNativeHookRelayBridge(relayId, options) {
	const bridge = options?.expectedBridge ?? relayBridges$1.get(relayId);
	if (!bridge) return;
	if (bridge.closing) return bridge.closing;
	if (relayBridges$1.get(relayId) === bridge) relayBridges$1.delete(relayId);
	if (!bridge.server.listening) bridge.cancelStartup();
	bridge.closing = bridge.pending.catch(() => void 0).then(async () => {
		try {
			await deleteNativeHookRelayBridgeRecordIfOwned({
				...bridge,
				pid: process.pid
			});
		} finally {
			const deferListenerCloseMs = normalizePositiveInteger(options?.deferListenerCloseMs, 0);
			if (deferListenerCloseMs > 0) await new Promise((resolve) => {
				setTimeout(resolve, deferListenerCloseMs).unref();
			});
			await new Promise((resolve, reject) => {
				bridge.server.close((error) => {
					if (error && !hasErrnoCode(error, "ERR_SERVER_NOT_RUNNING")) reject(error);
					else resolve();
				});
			});
		}
	});
	bridge.pending = bridge.closing;
	retainNativeHookRelayOperation(bridge.relayId, bridge.closing);
	return bridge.closing;
}
async function handleNativeHookRelayBridgeRequest(req, res, auth) {
	const requestAbort = createHttpRequestAbortSignal(req, res);
	try {
		if (req.method !== "POST" || req.url !== "/invoke") {
			writeNativeHookRelayBridgeJson(res, 404, {
				ok: false,
				error: "not found"
			});
			return;
		}
		if (req.headers.authorization !== `Bearer ${auth.token}`) {
			writeNativeHookRelayBridgeJson(res, 403, {
				ok: false,
				error: "forbidden"
			});
			return;
		}
		if (!isCurrentNativeHookRelayBridgeRequest(auth)) {
			writeNativeHookRelayBridgeJson(res, 410, {
				ok: false,
				error: NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR
			});
			return;
		}
		const body = await readNativeHookRelayBridgeBody(req);
		const payload = readNativeHookRelayBridgePayload(JSON.parse(body));
		if (payload.provider !== auth.provider || payload.relayId !== auth.relayId) {
			writeNativeHookRelayBridgeJson(res, 403, {
				ok: false,
				error: "native hook relay bridge target mismatch"
			});
			return;
		}
		if (!isCurrentNativeHookRelayBridgeRequest(auth)) {
			writeNativeHookRelayBridgeJson(res, 410, {
				ok: false,
				error: NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR
			});
			return;
		}
		writeNativeHookRelayBridgeJson(res, 200, {
			ok: true,
			result: await auth.invokeRelay({
				...payload,
				requireGeneration: true
			}, requestAbort.signal)
		});
	} catch (error) {
		if (requestAbort.signal.aborted) return;
		writeNativeHookRelayBridgeJson(res, isNativeHookRelayBridgeStaleRegistrationError(error) ? 410 : 500, {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		});
	} finally {
		requestAbort.cleanup();
	}
}
function isCurrentNativeHookRelayBridgeRequest(auth) {
	return relays$2.get(auth.relayId) === auth.registration && relayBridges$1.get(auth.relayId) === auth.bridge;
}
async function readNativeHookRelayBridgeBody(req) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.byteLength;
		if (total > MAX_NATIVE_HOOK_BRIDGE_BODY_BYTES) throw new Error("native hook relay bridge payload too large");
		chunks.push(buffer);
	}
	return Buffer.concat(chunks, total).toString("utf8");
}
function readNativeHookRelayBridgePayload(value) {
	if (!isJsonObject(value)) throw new Error("native hook relay bridge payload must be an object");
	return {
		provider: value.provider,
		relayId: value.relayId,
		generation: readNonEmptyString(value.generation, "generation"),
		event: value.event,
		rawPayload: value.rawPayload
	};
}
function writeNativeHookRelayBridgeJson(res, statusCode, payload) {
	const body = JSON.stringify(payload);
	res.writeHead(statusCode, {
		"content-type": "application/json",
		"content-length": Buffer.byteLength(body)
	});
	res.end(body);
}
async function readNativeHookRelayBridgeRecordIfExists(relayId, stateDbPath) {
	try {
		return await readNativeHookRelayBridgeRecord({
			relayId,
			stateDbPath
		});
	} catch (error) {
		log$2.debug("failed to read native hook relay bridge record", {
			error,
			relayId
		});
	}
}
async function clearNativeHookRelayBridgesForTests() {
	for (const relayId of relayBridges$1.keys()) unregisterNativeHookRelayBridge(relayId);
	while (pendingOperations.size > 0) await Promise.allSettled(pendingOperations);
	await clearNativeHookRelayBridgeRecordsForTests();
}
//#endregion
//#region src/agents/harness/native-hook-relay-codec.ts
const CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES = {
	exec_command: "exec",
	write: "apply_patch",
	edit: "apply_patch",
	agent: "spawn_agent"
};
const nativeHookRelayProviderAdapters = { codex: {
	normalizeMetadata: normalizeCodexHookMetadata,
	readToolInput: readCodexToolInput,
	readToolResponse: readCodexToolResponse,
	...codexNativeHookRelayResponseCodec,
	renderBeforeAgentFinalizeReviseResponse: (reason) => ({
		stdout: `${JSON.stringify({
			decision: "block",
			reason
		})}\n`,
		stderr: "",
		exitCode: 0
	}),
	renderBeforeAgentFinalizeStopResponse: (reason) => ({
		stdout: `${JSON.stringify({
			continue: false,
			...reason?.trim() ? { stopReason: reason.trim() } : {}
		})}\n`,
		stderr: "",
		exitCode: 0
	})
} };
function getNativeHookRelayProviderAdapter(provider) {
	return nativeHookRelayProviderAdapters[provider];
}
function normalizeNativeHookInvocation(params) {
	const metadata = getNativeHookRelayProviderAdapter(params.registration.provider).normalizeMetadata(params.rawPayload);
	return {
		provider: params.registration.provider,
		relayId: params.registration.relayId,
		event: params.event,
		...metadata,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		rawPayload: params.rawPayload,
		receivedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function normalizeCodexHookMetadata(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const metadata = {};
	const nativeEventName = readNonEmptyStringPreservingWhitespace(payload.hook_event_name);
	if (nativeEventName) metadata.nativeEventName = nativeEventName;
	const cwd = readNonEmptyStringPreservingWhitespace(payload.cwd);
	if (cwd) metadata.cwd = cwd;
	const model = readNonEmptyStringPreservingWhitespace(payload.model);
	if (model) metadata.model = model;
	const turnId = readNonEmptyStringPreservingWhitespace(payload.turn_id);
	if (turnId) metadata.turnId = turnId;
	const transcriptPath = readNonEmptyStringPreservingWhitespace(payload.transcript_path);
	if (transcriptPath) metadata.transcriptPath = transcriptPath;
	const permissionMode = readNonEmptyStringPreservingWhitespace(payload.permission_mode);
	if (permissionMode) metadata.permissionMode = permissionMode;
	const stopHookActive = readOptionalBoolean(payload.stop_hook_active);
	if (stopHookActive !== void 0) metadata.stopHookActive = stopHookActive;
	const lastAssistantMessage = readNonEmptyStringPreservingWhitespace(payload.last_assistant_message);
	if (lastAssistantMessage) metadata.lastAssistantMessage = lastAssistantMessage;
	const toolName = readNonEmptyStringPreservingWhitespace(payload.tool_name);
	if (toolName) metadata.toolName = toolName;
	const toolUseId = readNonEmptyStringPreservingWhitespace(payload.tool_use_id);
	if (toolUseId) metadata.toolUseId = toolUseId;
	return metadata;
}
function readCodexToolInput(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const toolInput = payload.tool_input;
	if (isJsonObject(toolInput)) return normalizeCodexToolInput(normalizeNativeHookToolName(readNonEmptyStringPreservingWhitespace(payload.tool_name)), toolInput);
	if (toolInput === void 0) return {};
	return { value: toolInput };
}
function normalizeCodexToolInput(toolName, toolInput) {
	const command = normalizeCodexCommand(toolInput.cmd);
	if (toolName !== "exec" || command === void 0) return toolInput;
	return {
		...toolInput,
		command
	};
}
function normalizeCodexCommand(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value) && value.every((part) => typeof part === "string")) return shellQuoteArgs(value);
}
function nativeHookRelayParamsWereRewritten(originalFingerprint, candidate) {
	if (candidate === void 0) return false;
	return stableStringify(candidate) !== originalFingerprint;
}
function readCodexToolResponse(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).tool_response;
}
function readNativeHookRelayApprovalMode(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).openclaw_approval_mode === "report" ? "report" : void 0;
}
function normalizeNativeHookToolName(toolName) {
	const normalized = normalizeToolPolicyName(toolName ?? "tool");
	return CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES[normalized] ?? normalized;
}
//#endregion
//#region src/agents/harness/native-hook-relay-permissions.ts
const DEFAULT_PERMISSION_TIMEOUT_MS = 12e4;
const PERMISSION_ALLOW_ALWAYS_TTL_MS = 18e5;
const MAX_PERMISSION_FALLBACK_KEYS = 200;
const MAX_PERMISSION_FALLBACK_KEY_CHARS = 240;
const MAX_PERMISSION_FINGERPRINT_SORT_KEYS = 200;
const MAX_PERMISSION_APPROVALS_PER_WINDOW = 12;
const PERMISSION_APPROVAL_WINDOW_MS = 6e4;
const MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES = 512;
const log$1 = createSubsystemLogger("agents/harness/native-hook-relay");
const NATIVE_SHELL_APPROVAL_TOOLS = /* @__PURE__ */ new Set([
	"bash",
	"exec",
	"exec_command",
	"shell",
	"shell_command"
]);
const { pendingPermissionApprovals, pendingPreToolUseApprovals, permissionApprovalWindows, permissionAllowAlwaysApprovals } = nativeHookRelayState;
let nativeHookRelayPermissionApprovalRequester = requestNativeHookRelayPermissionApproval;
let nativeHookRelayDeferredToolApprovalRequester = requestDeferredPluginToolApproval;
function nativeHookRelayPreToolUseApprovalKey(params) {
	const toolUseId = params.toolUseId?.trim();
	return toolUseId ? JSON.stringify([params.relayId, toolUseId]) : void 0;
}
function setNativeHookRelayPreToolUseApproval(params) {
	const key = nativeHookRelayPreToolUseApprovalKey(params);
	if (!key) return false;
	const previousApproval = pendingPreToolUseApprovals.get(key);
	pendingPreToolUseApprovals.set(key, {
		relayId: params.relayId,
		deferredApproval: params.deferredApproval,
		originalParamsFingerprint: params.originalParamsFingerprint
	});
	let evictedApproval;
	if (pendingPreToolUseApprovals.size > 200) {
		const oldestKey = pendingPreToolUseApprovals.keys().next().value;
		if (oldestKey) {
			evictedApproval = pendingPreToolUseApprovals.get(oldestKey);
			pendingPreToolUseApprovals.delete(oldestKey);
		}
	}
	if (previousApproval) cancelDeferredPluginToolApproval(previousApproval.deferredApproval);
	if (evictedApproval) cancelDeferredPluginToolApproval(evictedApproval.deferredApproval);
	return true;
}
function detachNativeHookRelayApprovalState(relayId) {
	const preToolUseApprovals = [];
	for (const [key, approval] of pendingPreToolUseApprovals) if (approval.relayId === relayId) {
		pendingPreToolUseApprovals.delete(key);
		preToolUseApprovals.push(approval);
	}
	const permissionApprovals = detachNativeHookRelayPermissionState(relayId);
	return () => {
		for (const approval of preToolUseApprovals) cancelDeferredPluginToolApproval(approval.deferredApproval);
		for (const approval of permissionApprovals) approval.controller.abort();
	};
}
async function resolveNativeHookRelayDeferredToolApproval(params) {
	const pendingApprovalKey = nativeHookRelayPreToolUseApprovalKey(params);
	if (!pendingApprovalKey) return;
	const pendingApproval = pendingPreToolUseApprovals.get(pendingApprovalKey);
	if (!pendingApproval) return;
	pendingApproval.resolutionPromise ??= resolveNativeHookRelayPreToolUseApproval(pendingApproval, params.signal).finally(() => {
		if (pendingPreToolUseApprovals.get(pendingApprovalKey) === pendingApproval) pendingPreToolUseApprovals.delete(pendingApprovalKey);
	});
	return pendingApproval.resolutionPromise;
}
async function resolveNativeHookRelayPreToolUseApproval(pendingApproval, signal) {
	const outcome = await nativeHookRelayDeferredToolApprovalRequester({
		deferredApproval: pendingApproval.deferredApproval,
		signal
	});
	if (outcome.blocked) return {
		handled: true,
		outcome: "denied",
		reason: outcome.reason,
		...outcome.kind === "failure" && outcome.disposition !== "blocked" ? { failureDisposition: outcome.disposition } : {}
	};
	if (nativeHookRelayParamsWereRewritten(pendingApproval.originalParamsFingerprint, outcome.params)) return {
		handled: true,
		outcome: "denied",
		reason: "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request."
	};
	return {
		handled: true,
		outcome: "approved-once"
	};
}
async function runNativeHookRelayPermissionRequest(params) {
	const mcpToolName = params.invocation.toolName?.startsWith("mcp__") ? params.invocation.toolName : void 0;
	if (mcpToolName && params.registration.deferMcpToolApprovals) return params.adapter.renderNoopResponse(params.invocation.event);
	const request = {
		provider: params.registration.provider,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		toolName: mcpToolName ?? normalizeNativeHookToolName(params.invocation.toolName),
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		...params.invocation.model ? { model: params.invocation.model } : {},
		toolInput: params.adapter.readToolInput(params.invocation.rawPayload),
		...params.registration.signal ? { signal: params.registration.signal } : {}
	};
	const mcpServerName = /^mcp__(.+?)__/.exec(request.toolName)?.[1];
	const mutableFileBinding = await prepareNativeHookMutableFileBinding(request);
	params.registration.assertActive?.();
	if (!mutableFileBinding.ok) return params.adapter.renderPermissionDecisionResponse("deny", mutableFileBinding.message);
	const approvalKey = nativeHookRelayPermissionApprovalKey({
		registration: params.registration,
		request,
		binding: mutableFileBinding.binding
	});
	const allowAlwaysKey = nativeHookRelayPermissionAllowAlwaysKey({
		registration: params.registration,
		request,
		binding: mutableFileBinding.binding
	});
	if (hasNativeHookRelayPermissionAllowAlways(allowAlwaysKey)) {
		params.registration.assertActive?.();
		if (mutableFileBinding.binding) {
			const current = await revalidateSystemRunMutableFileBinding({
				binding: mutableFileBinding.binding,
				cwd: request.cwd
			});
			params.registration.assertActive?.();
			if (!current.ok) return params.adapter.renderPermissionDecisionResponse("deny", current.message);
		}
		return params.adapter.renderPermissionDecisionResponse("allow");
	}
	try {
		const decision = await waitForNativeHookRelayPermissionApproval({
			registration: params.registration,
			approvalKey,
			request
		});
		params.registration.assertActive?.();
		if ((decision === "allow" || decision === "allow-always") && mutableFileBinding.binding) {
			const current = await revalidateSystemRunMutableFileBinding({
				binding: mutableFileBinding.binding,
				cwd: request.cwd
			});
			params.registration.assertActive?.();
			if (!current.ok) return params.adapter.renderPermissionDecisionResponse("deny", current.message);
		}
		if (decision === "allow") return params.adapter.renderPermissionDecisionResponse("allow");
		if (decision === "allow-always") {
			rememberNativeHookRelayPermissionAllowAlways({
				key: allowAlwaysKey,
				relayId: params.registration.relayId,
				mcpTool: mcpToolName !== void 0
			});
			return params.adapter.renderPermissionDecisionResponse("allow");
		}
		if (decision === "deny" || decision === "timed-out" && mcpToolName) {
			const reason = decision === "deny" ? "Denied by user" : "MCP tool approval timed out";
			return params.adapter.renderPermissionDecisionResponse("deny", mcpToolName ? `${reason}. ${formatMcpCodexApprovalRemedy(mcpServerName)}` : reason);
		}
	} catch (error) {
		params.registration.assertActive?.();
		log$1.warn(`native hook permission approval failed; deferring to provider approval path: ${String(error)}`);
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function waitForNativeHookRelayPermissionApproval(params) {
	let approval = pendingPermissionApprovals.get(params.approvalKey);
	if (!approval) {
		if (!consumeNativeHookRelayPermissionBudget(params.registration.relayId)) {
			log$1.warn(`native hook permission approval rate limit exceeded; deferring to provider approval path: relay=${params.registration.relayId} run=${params.registration.runId}`);
			return "defer";
		}
		const controller = new AbortController();
		const pending = {
			relayId: params.registration.relayId,
			controller,
			waiters: 0,
			cancelWhenUnobserved: params.registration.approvalHost !== void 0,
			promise: racePromiseWithAbortSignal(Promise.resolve().then(() => {
				controller.signal.throwIfAborted();
				const request = {
					...params.request,
					signal: controller.signal
				};
				return params.registration.approvalHost ? requestNativeHookRelayPermissionApproval(request, params.registration.approvalHost) : nativeHookRelayPermissionApprovalRequester(request);
			}), controller.signal).finally(() => {
				if (pendingPermissionApprovals.get(params.approvalKey) === pending) pendingPermissionApprovals.delete(params.approvalKey);
			})
		};
		pendingPermissionApprovals.set(params.approvalKey, pending);
		approval = pending;
	}
	approval.waiters++;
	try {
		return await racePromiseWithAbortSignal(approval.promise, params.registration.signal);
	} finally {
		approval.waiters--;
		if (approval.cancelWhenUnobserved && approval.waiters === 0 && pendingPermissionApprovals.get(params.approvalKey) === approval) {
			pendingPermissionApprovals.delete(params.approvalKey);
			approval.controller.abort();
		}
	}
}
function nativeHookRelayPermissionApprovalKey(params) {
	return JSON.stringify([
		params.registration.relayId,
		params.registration.runId,
		params.request.toolCallId ? ["call", params.request.toolCallId] : ["fallback", permissionRequestFallbackKey(params.request)],
		permissionRequestContentFingerprint(params.request),
		params.binding ? permissionRequestBindingFingerprint(params.binding) : "no-file-binding"
	]);
}
async function prepareNativeHookMutableFileBinding(request) {
	if (!NATIVE_SHELL_APPROVAL_TOOLS.has(request.toolName.trim().toLowerCase())) return { ok: true };
	const command = readNonEmptyStringPreservingWhitespace(request.toolInput.command);
	const prepared = await prepareSystemRunMutableFileBinding({
		command: {
			kind: "shell",
			text: command ?? ""
		},
		cwd: request.cwd
	});
	if (!prepared.ok) return {
		ok: false,
		message: prepared.message
	};
	return prepared.binding.operands.length > 0 ? {
		ok: true,
		binding: prepared.binding
	} : { ok: true };
}
function permissionRequestBindingFingerprint(binding) {
	const hash = createHash("sha256");
	for (const { argv, snapshot } of binding.operands) {
		hash.update(JSON.stringify([
			argv,
			snapshot.argvIndex,
			snapshot.path,
			snapshot.sha256
		]));
		hash.update("\0");
	}
	return hash.digest("hex");
}
function nativeHookRelayPermissionAllowAlwaysKey(params) {
	return createHash("sha256").update(JSON.stringify([
		params.registration.relayId,
		params.request.provider,
		params.request.agentId,
		params.request.sessionKey ?? params.request.sessionId,
		params.request.toolName.startsWith("mcp__") ? params.request.toolName : permissionRequestContentFingerprint(params.request),
		params.binding ? permissionRequestBindingFingerprint(params.binding) : void 0
	])).digest("hex");
}
function permissionRequestFallbackKey(request) {
	const command = readNonEmptyStringPreservingWhitespace(request.toolInput.command);
	if (command) return `${request.toolName}:command:${truncateRelayText(command, 240)}`;
	return `${request.toolName}:keys:${permissionRequestToolInputKeyFingerprint(request.toolInput)}`;
}
function permissionRequestToolInputKeyFingerprintForTests(toolInput) {
	return permissionRequestToolInputKeyFingerprint(toolInput);
}
function permissionRequestToolInputKeyFingerprint(toolInput) {
	let fingerprint = "";
	const { keys, truncated } = readBoundedOwnKeys(toolInput, MAX_PERMISSION_FALLBACK_KEYS);
	for (const key of keys) {
		const separator = fingerprint ? "," : "";
		const remaining = MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length - separator.length;
		if (remaining <= 0) break;
		fingerprint += `${separator}${key.slice(0, remaining)}`;
	}
	if (truncated && fingerprint.length < MAX_PERMISSION_FALLBACK_KEY_CHARS) fingerprint += `${fingerprint ? "," : ""}...`.slice(0, MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length);
	return fingerprint || "none";
}
function permissionRequestContentFingerprintForTests(request) {
	return permissionRequestContentFingerprint(request);
}
function permissionRequestContentFingerprint(request) {
	const hash = createHash("sha256");
	hash.update(request.toolName);
	hash.update("\0");
	hash.update(request.cwd ?? "");
	hash.update("\0");
	updateJsonHash(hash, request.toolInput);
	return hash.digest("hex");
}
function updateJsonHash(hash, value) {
	if (value === null) {
		hash.update("null");
		return;
	}
	if (typeof value === "string") {
		hash.update("string:");
		hash.update(JSON.stringify(value));
		return;
	}
	if (typeof value === "number") {
		hash.update(`number:${String(value)}`);
		return;
	}
	if (typeof value === "boolean") {
		hash.update(`boolean:${String(value)}`);
		return;
	}
	if (Array.isArray(value)) {
		hash.update("[");
		for (const item of value) {
			updateJsonHash(hash, item);
			hash.update(",");
		}
		hash.update("]");
		return;
	}
	hash.update("{");
	const { keys, truncated } = readBoundedOwnKeys(value, MAX_PERMISSION_FINGERPRINT_SORT_KEYS);
	for (const key of keys) {
		hash.update(JSON.stringify(key));
		hash.update(":");
		const item = value[key];
		if (item !== void 0) updateJsonHash(hash, item);
		hash.update(",");
	}
	if (truncated) {
		const sortedKeySet = new Set(keys);
		hash.update("#object-tail:");
		for (const key in value) {
			if (!Object.hasOwn(value, key) || sortedKeySet.has(key)) continue;
			hash.update(JSON.stringify(key));
			hash.update(":");
			const item = value[key];
			if (item !== void 0) updateJsonHash(hash, item);
			hash.update(",");
		}
	}
	hash.update("}");
}
function readBoundedOwnKeys(value, maxKeys) {
	const keys = [];
	let truncated = false;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (keys.length >= maxKeys) {
			truncated = true;
			break;
		}
		keys.push(key);
	}
	keys.sort();
	return {
		keys,
		truncated
	};
}
function consumeNativeHookRelayPermissionBudget(relayId, now = Date.now()) {
	const windowStart = now - PERMISSION_APPROVAL_WINDOW_MS;
	const timestamps = (permissionApprovalWindows.get(relayId) ?? []).filter((timestamp) => timestamp >= windowStart);
	if (timestamps.length >= MAX_PERMISSION_APPROVALS_PER_WINDOW) {
		permissionApprovalWindows.set(relayId, timestamps);
		return false;
	}
	timestamps.push(now);
	permissionApprovalWindows.set(relayId, timestamps);
	return true;
}
function hasNativeHookRelayPermissionAllowAlways(key, now = Date.now()) {
	const entry = permissionAllowAlwaysApprovals.get(key);
	if (!entry) return false;
	if (entry.expiresAtMs !== void 0 && entry.expiresAtMs <= now) {
		permissionAllowAlwaysApprovals.delete(key);
		return false;
	}
	return true;
}
function rememberNativeHookRelayPermissionAllowAlways(params, now = Date.now()) {
	pruneNativeHookRelayPermissionAllowAlways(now);
	const expiresAtMs = params.mcpTool ? void 0 : resolveExpiresAtMsFromDurationMs(PERMISSION_ALLOW_ALWAYS_TTL_MS, { nowMs: now });
	if (!params.mcpTool && expiresAtMs === void 0) return;
	permissionAllowAlwaysApprovals.set(params.key, {
		relayId: params.relayId,
		expiresAtMs
	});
	pruneMapToMaxSize(permissionAllowAlwaysApprovals, MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES);
}
function pruneNativeHookRelayPermissionAllowAlways(now = Date.now()) {
	for (const [key, entry] of permissionAllowAlwaysApprovals) if (entry.expiresAtMs !== void 0 && entry.expiresAtMs <= now) permissionAllowAlwaysApprovals.delete(key);
}
function detachNativeHookRelayPermissionState(relayId) {
	const approvals = [];
	permissionApprovalWindows.delete(relayId);
	for (const [key, entry] of permissionAllowAlwaysApprovals) if (entry.relayId === relayId) permissionAllowAlwaysApprovals.delete(key);
	for (const [key, approval] of pendingPermissionApprovals) if (approval.relayId === relayId) {
		pendingPermissionApprovals.delete(key);
		approvals.push(approval);
	}
	return approvals;
}
function removeNativeHookRelayPermissionState(relayId) {
	for (const approval of detachNativeHookRelayPermissionState(relayId)) approval.controller.abort();
}
async function requestNativeHookRelayPermissionApproval(request, approvalHost) {
	const timeoutMs = DEFAULT_PERMISSION_TIMEOUT_MS;
	const approvalRequest = {
		...formatNativeHookRelayApprovalPresentation(request),
		severity: "warning",
		toolName: request.toolName,
		toolCallId: request.toolCallId,
		allowedDecisions: [
			PluginApprovalResolutions.ALLOW_ONCE,
			PluginApprovalResolutions.ALLOW_ALWAYS,
			PluginApprovalResolutions.DENY
		],
		timeoutMs
	};
	const requestResult = approvalHost ? await approvalHost.requestApproval({
		...approvalRequest,
		transportTimeoutMs: 13e4,
		signal: request.signal
	}) : await callGatewayTool("plugin.approval.request", { timeoutMs: 13e4 }, {
		...approvalRequest,
		pluginId: `openclaw-native-hook-relay-${request.provider}`,
		agentId: request.agentId,
		sessionKey: request.sessionKey,
		twoPhase: true
	}, {
		expectFinal: false,
		signal: request.signal
	});
	request.signal?.throwIfAborted();
	const approvalId = requestResult?.id;
	if (!approvalId) return "defer";
	let decision;
	if (Object.hasOwn(requestResult ?? {}, "decision")) decision = requestResult.decision;
	else {
		const waitResult = await waitForNativeHookRelayApprovalDecision({
			approvalId,
			signal: request.signal,
			timeoutMs,
			approvalHost
		});
		if (!waitResult || waitResult.id !== approvalId) return "defer";
		decision = waitResult.decision;
	}
	if (decision === PluginApprovalResolutions.ALLOW_ONCE) return "allow";
	if (decision === PluginApprovalResolutions.ALLOW_ALWAYS) return "allow-always";
	if (decision === PluginApprovalResolutions.DENY) return "deny";
	return decision == null ? "timed-out" : "defer";
}
async function waitForNativeHookRelayApprovalDecision(params) {
	return (params.approvalHost ? params.approvalHost.waitForApproval({
		approvalId: params.approvalId,
		timeoutMs: params.timeoutMs,
		transportTimeoutMs: params.timeoutMs + 1e4,
		signal: params.signal
	}).then((result) => result ? {
		id: params.approvalId,
		decision: result.decision
	} : void 0) : callGatewayTool("plugin.approval.waitDecision", { timeoutMs: params.timeoutMs + 1e4 }, { id: params.approvalId }, { signal: params.signal })).catch((error) => {
		if (isApprovalNotFoundError(error)) return;
		throw error;
	});
}
function setNativeHookRelayPermissionApprovalRequesterForTests(requester) {
	nativeHookRelayPermissionApprovalRequester = requester;
}
function setNativeHookRelayDeferredToolApprovalRequesterForTests(requester) {
	nativeHookRelayDeferredToolApprovalRequester = requester;
}
function clearNativeHookRelayPermissionsForTests() {
	for (const approval of pendingPermissionApprovals.values()) approval.controller.abort();
	pendingPermissionApprovals.clear();
	for (const pendingApproval of pendingPreToolUseApprovals.values()) cancelDeferredPluginToolApproval(pendingApproval.deferredApproval);
	pendingPreToolUseApprovals.clear();
	permissionApprovalWindows.clear();
	permissionAllowAlwaysApprovals.clear();
	nativeHookRelayPermissionApprovalRequester = requestNativeHookRelayPermissionApproval;
	nativeHookRelayDeferredToolApprovalRequester = requestDeferredPluginToolApproval;
}
//#endregion
//#region src/agents/harness/native-hook-relay-events.ts
function getGlobalToolHookMatcherScope(hookName) {
	const registry = getGlobalHookRunnerRegistry();
	return registry ? getToolHookMatcherScope(registry, hookName) : void 0;
}
/** Snapshot the same canonical native tool family for planning and receipt admission. */
function snapshotNativeHookRelayExecutionAdmission(admission) {
	return admission ? {
		toolNames: [...new Set(admission.toolNames.map(normalizeNativeHookToolName))],
		admit: admission.admit
	} : void 0;
}
function nativePreToolUseMayRunLoopDetection(registration) {
	if (!registration.preToolUseLoopDetection || !registration.sessionKey) return false;
	return resolveToolLoopDetectionConfig({
		cfg: registration.config,
		agentId: registration.agentId
	})?.enabled === true;
}
function nativeHookRelayEventHasLocalWork(registration, event) {
	if (event === "pre_tool_use") return Boolean(registration.executionAdmissionToolNames?.length) || hasBeforeToolCallPolicy() || nativePreToolUseMayRunLoopDetection(registration);
	if (event === "post_tool_use") return hasGlobalHooks("after_tool_call") || listAgentToolResultMiddlewares("codex").length > 0;
	if (event === "before_agent_finalize") return hasGlobalHooks("before_agent_finalize");
	return true;
}
function nativeHookRelayEventToolMatcher(registration, event) {
	if (event === "pre_tool_use") {
		if (nativePreToolUseMayRunLoopDetection(registration)) return;
		const policyRegistry = getGlobalHookRunnerRegistry();
		const scope = mergePluginToolMatcherScopes([
			getGlobalToolHookMatcherScope("before_tool_call"),
			getTrustedToolPolicyMatcherScope(policyRegistry),
			registration.executionAdmissionToolNames?.length ? {
				matchAll: false,
				toolNames: registration.executionAdmissionToolNames
			} : void 0
		]);
		return scope?.matchAll ? void 0 : scope?.toolNames;
	}
	if (event === "post_tool_use") {
		const scope = mergePluginToolMatcherScopes([getGlobalToolHookMatcherScope("after_tool_call"), getAgentToolResultMiddlewareMatcherScope("codex")]);
		return scope?.matchAll ? void 0 : scope?.toolNames;
	}
}
async function processNativeHookRelayInvocation(params) {
	if (params.invocation.event === "pre_tool_use") return runNativeHookRelayPreToolUse(params);
	if (params.invocation.event === "post_tool_use") return runNativeHookRelayPostToolUse(params);
	if (params.invocation.event === "before_agent_finalize") return runNativeHookRelayBeforeAgentFinalize(params);
	return runNativeHookRelayPermissionRequest(params);
}
async function runNativeHookRelayPreToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolInput = params.adapter.readToolInput(params.invocation.rawPayload);
	const originalToolInputFingerprint = stableStringify(toolInput);
	const approvalMode = readNativeHookRelayApprovalMode(params.invocation.rawPayload);
	const policyRequest = {
		toolName,
		params: toolInput,
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		signal: params.registration.signal
	};
	const outcome = params.registration.runBeforeToolCall ? await params.registration.runBeforeToolCall({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		...params.invocation.cwd ? { nativeOperation: { cwd: params.invocation.cwd } } : {}
	}) : await runBeforeToolCallHook({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.registration.config ? { config: params.registration.config } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.registration.requester ? { requester: params.registration.requester } : {},
			...params.registration.approvalContext,
			...params.invocation.cwd ? {
				cwd: params.invocation.cwd,
				workspaceDir: params.invocation.cwd
			} : {}
		}
	});
	try {
		params.registration.signal?.throwIfAborted();
		params.registration.assertActive?.();
	} catch (error) {
		if (!outcome.blocked && outcome.deferredApproval) cancelDeferredPluginToolApproval(outcome.deferredApproval);
		throw error;
	}
	if (outcome.blocked) return params.adapter.renderPreToolUseBlockResponse(outcome.reason, outcome.kind === "failure" && outcome.disposition !== "blocked" ? outcome.disposition : void 0);
	if (!outcome.deferredApproval && nativeHookRelayParamsWereRewritten(originalToolInputFingerprint, outcome.params)) return params.adapter.renderPreToolUseBlockResponse("OpenClaw tool policy rewrote Codex app-server approval params; refusing original request.");
	try {
		if (params.executionAdmission?.toolNames.includes(toolName)) {
			params.executionAdmission.admit(params.invocation, params.assertExecutionAdmissionCurrent);
			params.registration.signal?.throwIfAborted();
			params.registration.assertActive?.();
		}
	} catch (error) {
		if (outcome.deferredApproval) cancelDeferredPluginToolApproval(outcome.deferredApproval);
		throw error;
	}
	if (outcome.deferredApproval) {
		if (!setNativeHookRelayPreToolUseApproval({
			relayId: params.registration.relayId,
			toolUseId: params.invocation.toolUseId,
			deferredApproval: outcome.deferredApproval,
			originalParamsFingerprint: originalToolInputFingerprint
		})) {
			cancelDeferredPluginToolApproval(outcome.deferredApproval);
			return params.adapter.renderPreToolUseBlockResponse("Plugin approval required but Codex tool id unavailable.");
		}
		return params.adapter.renderNoopResponse(params.invocation.event);
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayPostToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolCallId = params.invocation.toolUseId ?? `${params.invocation.event}:${params.invocation.receivedAt}`;
	const startArgs = params.adapter.readToolInput(params.invocation.rawPayload);
	const rawResult = params.adapter.readToolResponse(params.invocation.rawPayload);
	const result = !(listAgentToolResultMiddlewares("codex").length > 0) ? rawResult : await createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId
	}).applyToolResultMiddleware({
		turnId: params.invocation.turnId,
		toolCallId,
		toolName,
		args: startArgs,
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		result: payloadTextResult(rawResult)
	});
	await runAgentHarnessAfterToolCallHook({
		toolName,
		toolCallId,
		runId: params.registration.runId,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		...params.registration.channelId ? { channelId: params.registration.channelId } : {},
		startArgs,
		result
	});
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayBeforeAgentFinalize(params) {
	const outcome = await runAgentHarnessBeforeAgentFinalizeHook({
		event: {
			runId: params.registration.runId,
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.invocation.turnId ? { turnId: params.invocation.turnId } : {},
			provider: params.registration.provider,
			...params.invocation.model ? { model: params.invocation.model } : {},
			...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
			...params.invocation.transcriptPath ? { transcriptPath: params.invocation.transcriptPath } : {},
			stopHookActive: params.invocation.stopHookActive === true,
			...params.invocation.lastAssistantMessage ? { lastAssistantMessage: params.invocation.lastAssistantMessage } : {}
		},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.invocation.cwd ? { workspaceDir: params.invocation.cwd } : {},
			...params.invocation.model ? { modelId: params.invocation.model } : {}
		}
	});
	if (outcome.action === "revise") return params.adapter.renderBeforeAgentFinalizeReviseResponse(outcome.reason);
	if (outcome.action === "finalize") return params.adapter.renderBeforeAgentFinalizeStopResponse(outcome.reason);
	return params.adapter.renderNoopResponse(params.invocation.event);
}
//#endregion
//#region src/agents/harness/native-hook-relay-command.ts
function resolveNativeHookRelayNicePrefix(value) {
	if (process.platform === "win32" || value === false || value === void 0) return [];
	const nice = normalizePositiveInteger(value, 0);
	if (nice <= 0) return [];
	return [
		"nice",
		"-n",
		String(nice)
	];
}
function resolveNativeHookRelayCommandTimeoutMs(configuredTimeoutMs, overrideTimeoutMs) {
	const configured = normalizeOptionalPositiveInteger(configuredTimeoutMs);
	const override = normalizeOptionalPositiveInteger(overrideTimeoutMs);
	if (configured === void 0) return override;
	if (override === void 0) return configured;
	return Math.min(configured, override);
}
function buildNativeHookRelayCommand(params) {
	return buildNativeHookRelayCommandWithStateDatabase(params);
}
function buildNativeHookRelayCommandWithStateDatabase(params) {
	const timeoutMs = normalizePositiveInteger(params.timeoutMs, DEFAULT_RELAY_TIMEOUT_MS);
	const executable = params.executable ?? resolveNativeHookRelayExecutable();
	const argv = executable === "openclaw" ? ["openclaw"] : [params.nodeExecutable ?? process.execPath, executable];
	const nicePrefix = resolveNativeHookRelayNicePrefix(params.nice);
	const command = shellQuoteArgs([
		...nicePrefix,
		...argv,
		"hooks",
		"relay",
		"--provider",
		params.provider,
		"--relay-id",
		params.relayId,
		...params.stateDbPath ? ["--state-db", params.stateDbPath] : [],
		...params.generation ? ["--generation", params.generation] : [],
		"--event",
		params.event,
		...params.event === "pre_tool_use" && params.preToolUseUnavailable ? ["--pre-tool-use-unavailable", params.preToolUseUnavailable] : [],
		"--timeout",
		String(timeoutMs)
	]);
	return process.platform === "win32" ? command : `exec ${command}`;
}
function resolveNativeHookRelayExecutable() {
	const envPath = process.env.OPENCLAW_CLI_PATH?.trim();
	if (envPath && existsSync(envPath)) return envPath;
	const packageRoot = resolveOpenClawPackageRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (packageRoot) {
		for (const candidate of [
			path.join(packageRoot, "dist", "native-hook-relay", "entry.js"),
			path.join(packageRoot, "openclaw.mjs"),
			path.join(packageRoot, "dist", "entry.js"),
			path.join(packageRoot, "scripts", "run-node.mjs")
		]) if (existsSync(candidate)) return candidate;
	}
	const argvEntry = process.argv[1];
	if (argvEntry) {
		const resolved = path.resolve(argvEntry);
		if (existsSync(resolved)) return resolved;
	}
	throw new Error("Cannot resolve OpenClaw CLI executable path for native hook relay");
}
//#endregion
//#region src/agents/harness/native-hook-relay-types.ts
const NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
//#endregion
//#region src/agents/harness/native-hook-relay-plan.ts
/** Snapshot static policy and commands without registering a bridge, TTL, or live callbacks. */
function buildNativeHookRelayCommandPlan(params) {
	const stateDbPath = resolveOpenClawStateSqlitePath();
	const policy = {
		...params,
		preToolUseLoopDetection: params.preToolUseLoopDetection !== false
	};
	const facts = new Map(NATIVE_HOOK_RELAY_EVENTS.map((event) => [event, {
		enabled: nativeHookRelayEventHasLocalWork(policy, event),
		matcher: nativeHookRelayEventToolMatcher(policy, event)?.slice()
	}]));
	return {
		shouldRelayEvent: (event) => facts.get(event)?.enabled === true,
		toolMatcherForEvent: (event) => facts.get(event)?.matcher?.slice(),
		commandForEvent: (event, options) => buildNativeHookRelayCommandWithStateDatabase({
			provider: params.provider,
			relayId: params.relayId,
			generation: params.generation,
			stateDbPath,
			event,
			nice: params.command?.nice,
			timeoutMs: resolveNativeHookRelayCommandTimeoutMs(params.command?.timeoutMs, options?.timeoutMs),
			executable: params.command?.executable,
			nodeExecutable: params.command?.nodeExecutable
		})
	};
}
//#endregion
//#region src/agents/harness/native-hook-relay-work.ts
const { relays: relays$1 } = nativeHookRelayState;
/** Capture synchronous inputs before the relay owner admits its deferred policy read. */
function prepareNativeHookRelayMcpPolicy(params, stateDbPath, isCurrent) {
	const agentId = params.agentId;
	const autoApproveMcpTools = params.autoApproveMcpTools === true;
	const configuredMcpToolApprovals = Object.keys({
		...params.projectedMcpServers,
		...params.config?.mcp?.servers
	}).some((serverName) => resolveProjectedMcpCodexToolApprovalMode(serverName, params.config?.mcp?.servers?.[serverName] ?? {}, params.projectedMcpServers?.[serverName]) !== void 0);
	return Promise.resolve().then(async () => {
		if (!isCurrent()) return;
		return autoApproveMcpTools || (agentId ? (await loadMcpToolGrants(agentId, { path: stateDbPath })).length > 0 : false) || configuredMcpToolApprovals;
	});
}
/** Preserve the first failure while joining work admitted during a pending drain. */
async function drainNativeHookRelayWork(params) {
	let renewal;
	let failure;
	await params.policyReady.catch((error) => {
		failure = { error };
	});
	do {
		renewal = params.readRenewal();
		try {
			await renewal;
		} catch (error) {
			failure ??= { error };
		}
		try {
			await drainNativeHookRelayBridge(params.bridge);
		} catch (error) {
			failure ??= { error };
		}
	} while (renewal !== params.readRenewal());
	if (failure) throw failure.error;
}
function assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken) {
	if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
	registration.signal?.throwIfAborted();
	registration.assertActive?.();
	if (!lifetime.foregroundOpen || lifetime.foregroundToken !== foregroundToken) throw new Error("native hook relay foreground invocation not allowed");
}
async function resolveNativeHookRelayInvocationBinding(registration, lifetime, event, rawPayload, signal) {
	if (!lifetime) throw new Error("native hook relay registration is inactive");
	await racePromiseWithAbortSignal(lifetime.policyReady, signal);
	signal?.throwIfAborted();
	if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
	const claim = lifetime.retention?.readClaim(rawPayload);
	if (claim && event === "pre_tool_use" && lifetime.retained && lifetime.retention) {
		const retained = lifetime.retained;
		const retention = lifetime.retention;
		let assertAdmission;
		const assertRetainedAuthority = () => {
			if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
			registration.signal?.throwIfAborted();
			retained.assertActive();
			if (assertAdmission && !assertAdmission()) throw new Error("native hook relay retained invocation not allowed");
			if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		};
		const assertActive = () => {
			signal?.throwIfAborted();
			assertRetainedAuthority();
		};
		if (!lifetime.foregroundOpen && !retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		if (retention.awaitForegroundAdmission) {
			assertAdmission = await racePromiseWithAbortSignal(retention.awaitForegroundAdmission(claim, signal), signal);
			if (!assertAdmission) throw new Error("native hook relay retained invocation not allowed");
			assertActive();
		} else if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		return {
			registration: {
				...registration,
				assertActive,
				runBeforeToolCall: retained.runBeforeToolCall,
				signal
			},
			assertExecutionAdmissionCurrent: assertRetainedAuthority
		};
	}
	if (!lifetime.foregroundOpen) throw new Error("native hook relay foreground invocation not allowed");
	const foregroundToken = lifetime.foregroundToken;
	const assertExecutionAdmissionCurrent = () => assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken);
	const assertActive = () => {
		signal?.throwIfAborted();
		assertExecutionAdmissionCurrent();
	};
	return {
		registration: {
			...registration,
			assertActive,
			signal
		},
		assertExecutionAdmissionCurrent
	};
}
//#endregion
//#region src/agents/harness/native-hook-relay.ts
/** Native harness hook event relay and public Plugin SDK facade. */
const DEFAULT_RELAY_TTL_MS = 18e5;
const log = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays, relayBridges, invocations } = nativeHookRelayState;
const RELAY_LIFETIME = "__openclawNativeHookRelayLifetimeV1";
function readRelayLifetime(registration) {
	return registration[RELAY_LIFETIME];
}
function setRelayLifetime(registration, lifetime) {
	Object.defineProperty(registration, RELAY_LIFETIME, {
		configurable: true,
		value: lifetime
	});
}
function scheduleNativeHookRelayExpiry(relayId, registration) {
	const lifetime = readRelayLifetime(registration);
	if (!lifetime) return;
	if (lifetime.expiryTimer) clearTimeout(lifetime.expiryTimer);
	const rearm = () => {
		if (relays.get(relayId) !== registration) return;
		const remainingMs = registration.expiresAtMs - Date.now();
		if (remainingMs < 0) {
			unregisterNativeHookRelay(relayId, registration);
			return;
		}
		lifetime.expiryTimer = setTimeout(rearm, Math.min(remainingMs + 1, MAX_TIMER_TIMEOUT_MS));
		lifetime.expiryTimer.unref();
	};
	rearm();
}
function resolveNativeHookRelayExpiresAtMs(ttlMs) {
	return resolveExpiresAtMsFromDurationMs(normalizePositiveInteger(ttlMs, DEFAULT_RELAY_TTL_MS));
}
function registerNativeHookRelay(params) {
	return registerNativeHookRelayInternal(params);
}
/** Private-local bundled runtime entrypoint; not exported through the public SDK. */
function registerOwnedNativeHookRelay(params) {
	const { retention, approvalHost, executionAdmission, ...registrationParams } = params;
	return registerNativeHookRelayInternal(registrationParams, {
		retention,
		approvalHost,
		executionAdmission
	});
}
function registerNativeHookRelayInternal(params, owner) {
	const { retention, approvalHost } = owner ?? {};
	const executionAdmission = snapshotNativeHookRelayExecutionAdmission(owner?.executionAdmission);
	pruneExpiredNativeHookRelays();
	pruneNativeHookRelayPermissionAllowAlways();
	const relayId = normalizeRelayKey(params.relayId, "id") ?? randomUUID();
	const generation = normalizeRelayKey(params.generation, "generation") ?? randomUUID();
	const generationMismatchGraceMs = normalizePositiveInteger(params.generationMismatchGraceMs, 0);
	const now = Date.now();
	const expiresAtMs = resolveNativeHookRelayExpiresAtMs(params.ttlMs);
	if (expiresAtMs === void 0) throw new Error("Native hook relay expiry is outside the supported Date range");
	const allowedEvents = params.allowedEvents?.length ? [...new Set(params.allowedEvents)] : NATIVE_HOOK_RELAY_EVENTS;
	const stateDbPath = resolveOpenClawStateSqlitePath();
	let partialRegistration;
	const policy = prepareNativeHookRelayMcpPolicy(params, stateDbPath, () => partialRegistration !== void 0 && relays.get(relayId) === partialRegistration);
	const deliverReplacedRegistrationUnregister = unregisterNativeHookRelay(relayId, void 0, {
		deferListenerCloseMs: 250,
		deferOnUnregister: true
	});
	try {
		const retained = params.runBeforeToolCall && retention ? retainBeforeToolCallForNativeHookRelay(params.runBeforeToolCall) : void 0;
		let deferMcpToolApprovals;
		const registration = {
			relayId,
			provider: params.provider,
			generation,
			...generationMismatchGraceMs > 0 ? { generationMismatchGraceExpiresAtMs: now + generationMismatchGraceMs } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			sessionId: params.sessionId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.config ? { config: params.config } : {},
			get deferMcpToolApprovals() {
				return deferMcpToolApprovals;
			},
			runId: params.runId,
			...params.channelId ? { channelId: params.channelId } : {},
			...params.requester ? { requester: params.requester } : {},
			...params.approvalContext ? { approvalContext: params.approvalContext } : {},
			allowedEvents,
			preToolUseLoopDetection: params.preToolUseLoopDetection !== false,
			expiresAtMs,
			preToolUseFailureProjections: /* @__PURE__ */ new Map(),
			...params.signal ? { signal: params.signal } : {},
			...params.runBeforeToolCall ? { runBeforeToolCall: params.runBeforeToolCall } : {},
			...approvalHost ? { approvalHost } : {},
			...params.assertActive ? { assertActive: params.assertActive } : {},
			...params.onPreToolUseFailure ? { onPreToolUseFailure: params.onPreToolUseFailure } : {}
		};
		partialRegistration = registration;
		relays.set(relayId, registration);
		const policyReady = policy.then((prepared) => {
			deferMcpToolApprovals = prepared;
		});
		retainNativeHookRelayOperation(relayId, policyReady);
		setRelayLifetime(registration, {
			foregroundOpen: true,
			foregroundToken: Symbol("native-hook-relay-foreground"),
			policyReady,
			...retained ? { retained } : {},
			...retention ? { retention } : {},
			...executionAdmission ? { executionAdmission } : {}
		});
		if (params.signal) {
			const abort = () => unregisterNativeHookRelay(relayId, registration);
			params.signal.addEventListener("abort", abort, { once: true });
			readRelayLifetime(registration).removeAbortListener = () => params.signal?.removeEventListener("abort", abort);
			if (params.signal.aborted) {
				unregisterNativeHookRelay(relayId, registration);
				throw new Error("native hook relay registration aborted");
			}
		}
		const bridge = registerNativeHookRelayBridge(registration, stateDbPath, invokeNativeHookRelay);
		scheduleNativeHookRelayExpiry(relayId, registration);
		let pendingRenewal = Promise.resolve();
		const ready = Promise.all([bridge.ready, policyReady]).then(() => void 0);
		ready.catch(() => void 0);
		const handle = {
			...registration,
			...buildNativeHookRelayCommandPlan({
				...params,
				relayId,
				generation,
				executionAdmissionToolNames: executionAdmission?.toolNames
			}),
			get deferMcpToolApprovals() {
				return deferMcpToolApprovals;
			},
			ready,
			prepareInvocation: async () => {
				const lifetime = readRelayLifetime(registration);
				if (!lifetime) throw new Error("native hook relay registration is inactive");
				const foregroundToken = lifetime.foregroundToken;
				assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken);
				await policyReady;
				await bridge.ready.catch(() => void 0);
				assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken);
			},
			drain: () => drainNativeHookRelayWork({
				policyReady,
				bridge,
				readRenewal: () => pendingRenewal
			}),
			renew: (ttlMs) => {
				const current = relays.get(relayId);
				if (current !== registration) return;
				const renewedExpiresAtMs = resolveNativeHookRelayExpiresAtMs(ttlMs);
				if (renewedExpiresAtMs === void 0) return;
				pendingRenewal = pendingRenewal.then(async () => {
					if (relays.get(relayId) !== current) return;
					if (bridge.server.listening) try {
						const renewal = await renewNativeHookRelayBridgeRecord(current, bridge, renewedExpiresAtMs);
						if (renewal === "unavailable") return;
						if (renewal === "ownership-changed") {
							log.debug("native hook relay bridge record ownership changed", { relayId });
							unregisterNativeHookRelay(relayId, current);
							return;
						}
					} catch (error) {
						log.debug("failed to renew native hook relay bridge record", {
							error,
							relayId
						});
						return;
					}
					if (relays.get(relayId) !== current) return;
					current.expiresAtMs = renewedExpiresAtMs;
					handle.expiresAtMs = renewedExpiresAtMs;
					scheduleNativeHookRelayExpiry(relayId, current);
				});
			},
			unregister: () => deactivateNativeHookRelayForeground(relayId, registration)
		};
		return handle;
	} catch (error) {
		if (partialRegistration) unregisterNativeHookRelay(relayId, partialRegistration);
		throw error;
	} finally {
		deliverReplacedRegistrationUnregister?.();
	}
}
function unregisterNativeHookRelay(relayId, expectedRegistration, options) {
	if (expectedRegistration && relays.get(relayId) !== expectedRegistration) return;
	const registration = expectedRegistration ?? relays.get(relayId);
	if (!registration) return;
	const lifetime = readRelayLifetime(registration);
	const bridge = relayBridges.get(relayId);
	if (relays.get(relayId) === registration) relays.delete(relayId);
	if (lifetime?.expiryTimer) clearTimeout(lifetime.expiryTimer);
	lifetime?.removeAbortListener?.();
	lifetime?.retained?.release();
	delete registration[RELAY_LIFETIME];
	unregisterNativeHookRelayBridge(relayId, {
		...options,
		...bridge ? { expectedBridge: bridge } : {}
	});
	removeNativeHookRelayInvocations(relayId);
	detachNativeHookRelayApprovalState(relayId)();
	const deliverOnUnregister = () => {
		try {
			lifetime?.retention?.onDispose();
		} catch (error) {
			try {
				log.warn("native hook relay unregister callback failed", {
					error,
					relayId
				});
			} catch {}
		}
	};
	if (options?.deferOnUnregister) return deliverOnUnregister;
	deliverOnUnregister();
}
function deactivateNativeHookRelayForeground(relayId, registration) {
	if (relays.get(relayId) !== registration) return;
	const lifetime = readRelayLifetime(registration);
	if (!lifetime) return;
	lifetime.foregroundOpen = false;
	let shouldRetain = false;
	if (lifetime.retained && lifetime.retention) try {
		shouldRetain = lifetime.retention.shouldRetainAfterForegroundClose();
	} catch (error) {
		try {
			log.warn("native hook relay retention predicate failed", {
				error,
				relayId
			});
		} catch {}
	}
	if (shouldRetain) {
		removeNativeHookRelayPermissionState(relayId);
		return;
	}
	unregisterNativeHookRelay(relayId, registration);
}
function normalizeRelayKey(value, kind) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (trimmed.length > 160 || !/^[A-Za-z0-9._:-]+$/u.test(trimmed)) throw new Error(`native hook relay ${kind} must be non-empty, compact, and URL-safe`);
	return trimmed;
}
async function invokeNativeHookRelay(params, invocationSignal) {
	const provider = readNativeHookRelayProvider(params.provider);
	const relayId = readNonEmptyString(params.relayId, "relayId");
	const event = readNativeHookRelayEvent(params.event);
	const registration = relays.get(relayId);
	if (!registration) {
		pruneExpiredNativeHookRelays();
		throw new Error("native hook relay not found");
	}
	const signal = invocationSignal && registration.signal ? AbortSignal.any([invocationSignal, registration.signal]) : invocationSignal ?? registration.signal;
	signal?.throwIfAborted();
	if (Date.now() > registration.expiresAtMs) {
		unregisterNativeHookRelay(relayId, registration);
		throw new Error("native hook relay expired");
	}
	if (registration.provider !== provider) throw new Error("native hook relay provider mismatch");
	if (params.requireGeneration) {
		const generation = readNonEmptyString(params.generation, "generation");
		if (generation !== registration.generation) {
			if (!canAcceptNativeHookRelayGenerationMismatch(registration, generation)) throw new Error(NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR);
			log.debug("native hook relay accepted bootstrap generation mismatch", {
				relayId,
				event,
				runId: registration.runId
			});
		}
	}
	if (!registration.allowedEvents.includes(event)) throw new Error("native hook relay event not allowed");
	if (!isJsonValue(params.rawPayload)) throw new Error("native hook relay payload must be JSON-compatible");
	const normalized = normalizeNativeHookInvocation({
		registration,
		event,
		rawPayload: params.rawPayload
	});
	const { registration: effectiveRegistration, assertExecutionAdmissionCurrent } = await resolveNativeHookRelayInvocationBinding(registration, readRelayLifetime(registration), event, params.rawPayload, signal);
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	recordNativeHookRelayInvocation(normalized);
	const startedAt = Date.now();
	const response = await racePromiseWithAbortSignal(processNativeHookRelayInvocation({
		registration: effectiveRegistration,
		invocation: normalized,
		adapter: getNativeHookRelayProviderAdapter(provider),
		executionAdmission: readRelayLifetime(registration)?.executionAdmission,
		assertExecutionAdmissionCurrent
	}), signal);
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	if (normalized.toolUseId && response.failureDisposition && readNativeHookRelayApprovalMode(normalized.rawPayload) !== "report") projectNativeHookRelayPreToolUseFailure(registration, {
		toolName: normalizeNativeHookToolName(normalized.toolName),
		toolCallId: normalized.toolUseId,
		disposition: response.failureDisposition,
		durationMs: Date.now() - startedAt
	});
	return response;
}
function projectNativeHookRelayPreToolUseFailure(registration, failure) {
	const callback = registration.onPreToolUseFailure;
	if (!callback || registration.preToolUseFailureProjections.has(failure.toolCallId)) return;
	const record = {
		promise: Promise.resolve().then(() => callback(failure)),
		settled: false
	};
	registration.preToolUseFailureProjections.set(failure.toolCallId, record);
	record.promise.then(() => {
		record.settled = true;
	}, (error) => {
		record.settled = true;
		if (registration.preToolUseFailureProjections.get(failure.toolCallId) === record) registration.preToolUseFailureProjections.delete(failure.toolCallId);
		log.debug("native pre-tool failure projection failed", {
			error,
			relayId: registration.relayId,
			toolCallId: failure.toolCallId
		});
	});
	if (registration.preToolUseFailureProjections.size > 200) {
		let oldestToolCallId;
		for (const [toolCallId, candidate] of registration.preToolUseFailureProjections) {
			oldestToolCallId ??= toolCallId;
			if (candidate.settled) {
				registration.preToolUseFailureProjections.delete(toolCallId);
				return;
			}
		}
		if (oldestToolCallId) registration.preToolUseFailureProjections.delete(oldestToolCallId);
	}
}
function hasNativeHookRelayInvocation(params) {
	const toolUseId = params.toolUseId?.trim();
	if (!toolUseId) return false;
	return invocations.some((invocation) => invocation.relayId === params.relayId && invocation.event === params.event && invocation.toolUseId === toolUseId);
}
function recordNativeHookRelayInvocation(invocation) {
	invocations.push({
		...invocation,
		rawPayload: snapshotNativeHookRelayPayload(invocation.rawPayload)
	});
	if (invocations.length > 200) invocations.splice(0, invocations.length - 200);
}
function removeNativeHookRelayInvocations(relayId) {
	for (let index = invocations.length - 1; index >= 0; index -= 1) if (invocations[index]?.relayId === relayId) invocations.splice(index, 1);
}
function canAcceptNativeHookRelayGenerationMismatch(registration, generation) {
	const expiresAtMs = registration.generationMismatchGraceExpiresAtMs;
	if (typeof expiresAtMs !== "number" || Date.now() > expiresAtMs) return false;
	if (registration.generationMismatchGraceAcceptedGeneration) return registration.generationMismatchGraceAcceptedGeneration === generation;
	registration.generationMismatchGraceAcceptedGeneration = generation;
	return true;
}
function pruneExpiredNativeHookRelays(now = Date.now()) {
	for (const [relayId, registration] of relays) if (now > registration.expiresAtMs) unregisterNativeHookRelay(relayId, registration);
}
const testing = {
	async clearNativeHookRelaysForTests() {
		for (const [relayId, registration] of relays) unregisterNativeHookRelay(relayId, registration);
		await clearNativeHookRelayBridgesForTests();
		invocations.length = 0;
		clearNativeHookRelayPermissionsForTests();
	},
	getNativeHookRelayInvocationsForTests() {
		return [...invocations];
	},
	getNativeHookRelayRegistrationForTests(relayId) {
		return relays.get(relayId);
	},
	getNativeHookRelayBridgeDirForTests() {
		throw new Error("native hook relay bridge files were retired");
	},
	getNativeHookRelayBridgeRegistryPathForTests(relayId) {
		throw new Error("native hook relay bridge files were retired");
	},
	async getNativeHookRelayBridgeRecordForTests(relayId) {
		const record = await readNativeHookRelayBridgeRecordIfExists(relayId);
		return record ? { ...record } : void 0;
	},
	isNativeHookRelayBridgeLookupRetryableForTests(error, elapsedMs = 0) {
		return isRetryableNativeHookRelayBridgeLookupError({
			error,
			elapsedMs
		});
	},
	formatPermissionApprovalDescriptionForTests: formatPermissionApprovalDescription,
	permissionRequestContentFingerprintForTests,
	permissionRequestToolInputKeyFingerprintForTests,
	setNativeHookRelayPermissionApprovalRequesterForTests(requester) {
		setNativeHookRelayPermissionApprovalRequesterForTests(requester);
	},
	setNativeHookRelayDeferredToolApprovalRequesterForTests(requester) {
		setNativeHookRelayDeferredToolApprovalRequesterForTests(requester);
	}
};
//#endregion
export { testing as a, resolveNativeHookRelayDeferredToolApproval as c, registerOwnedNativeHookRelay as i, invokeNativeHookRelay as n, buildNativeHookRelayCommandPlan as o, registerNativeHookRelay as r, buildNativeHookRelayCommand as s, hasNativeHookRelayInvocation as t };
