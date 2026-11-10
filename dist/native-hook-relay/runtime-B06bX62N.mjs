import { _ as resolveStateDir, a as hasRegisteredSecretValuesForRedaction, ct as collectNestedErrorCandidates, o as redactRegisteredSecretValues, s as registerSecretValueForRedaction } from "./redact-tYkqLD33.mjs";
import { B as resolveGlobalSingleton, M as normalizeLowercaseStringOrEmpty, N as normalizeNullableString, R as resolveGlobalMap } from "./utils-c2rFzEZe.mjs";
import { c as executeWithCachedStatement } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { et as getOpenClawDatabaseMaintenanceScope, q as applyPrivateModeSync } from "./sqlite-snapshot-staging-owner-ctWsxzq7.mjs";
import { n as runOpenClawStateWriteTransaction, r as migrateSqliteSchemaToStrict, t as openOpenClawStateDatabase } from "./openclaw-state-db-BJHqVGjU.mjs";
import { l as normalizeUniqueStringEntries } from "./string-normalization-Djlq3kPB.mjs";
import { o as registerSignalExitBarrier } from "./subsystem-Y9GXTYwe.mjs";
import { n as createDeferredCore } from "./promise-like-ByIJ_1fR.mjs";
import { i as getPluginExecutionFrame, n as registerListener } from "./listeners-D1WzHpsK.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { c as getSqliteDatabaseAdmission, v as publishSqliteDatabaseAdmission } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { C as compileSqliteQueryBindings, D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, T as executeSqliteQuerySync, l as openNodeSqliteDatabase } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { r as sha256Hex } from "./crypto-digest-DqNCiRzt.mjs";
import { B as resolveSqliteDatabaseFilePaths, G as registerSqliteCacheExitClose, U as configureSqliteConnectionPragmas, X as runSqliteImmediateTransactionSync, g as registerOpenClawStateDatabaseLifecycleListener, h as registerOpenClawStateDatabaseAsyncResource, v as retainOpenClawStateDatabaseForIdle } from "./openclaw-state-db-cache-CRSDAqPM.mjs";
import { J as discriminatedUnion, K as boolean, Q as object, U as _enum, W as _undefined, Y as literal, Z as number, et as string, p as SqliteWorkerError } from "./worker-task-pool-Cn7mBBG4.mjs";
import { n as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DQIyBJNl.mjs";
import { r as reserveSqliteWorkerInputPreparation, t as createOpenClawStateWorkerLease } from "./openclaw-state-worker-store-DmmHJeXQ.mjs";
import { t as getPluginRegistryState } from "./runtime-state-wvrNT8EC.mjs";
import { t as isHeadersLike } from "./fetch-headers-DD03wtQj.mjs";
import { n as withResponseBodyTimeout } from "./http-response-body-timeout-Bx7Z682m.mjs";
import process$1 from "node:process";
import { request } from "node:http";
import fsSync, { writeSync } from "node:fs";
import path from "node:path";
import { URL as URL$1 } from "node:url";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { isUtf8 } from "node:buffer";
import { serialize } from "node:v8";
import { StringDecoder } from "node:string_decoder";
import "@openclaw/proxyline";
import { gunzipSync, gzipSync } from "node:zlib";
//#region src/plugins/sdk-deprecation-usage.ts
const usage = resolveGlobalMap(Symbol.for("openclaw.pluginSdkDeprecationUsage"));
function recordPluginSdkDeprecationUsage(pluginId, id, displayName, replacement, removeAfter) {
	let recorded = usage.get(pluginId);
	if (!recorded) {
		recorded = /* @__PURE__ */ new Map();
		usage.set(pluginId, recorded);
	}
	if (!recorded.has(id)) recorded.set(id, {
		id,
		displayName,
		replacement,
		...removeAfter ? { removeAfter } : {}
	});
}
//#endregion
//#region src/plugins/sdk-deprecation.ts
const warned = resolveGlobalSingleton(Symbol.for("openclaw.pluginSdkDeprecations"), () => /* @__PURE__ */ new Set());
const sqliteRemovalFamilies = /* @__PURE__ */ new Set([
	"acp-session",
	"agent-end-side-effects",
	"agent-harness-host",
	"agent-harness-session-runtime-ownership",
	"agent-harness-tool-surface",
	"approval-event-publication",
	"approval-session-routing",
	"auth-profile-sync-operations",
	"auth-profiles",
	"channel-conversation-bindings",
	"channel-inbound-envelope",
	"channel-pairing-sync-allowlist",
	"codex-session-context",
	"command-authorization-sync",
	"conversation-bindings",
	"cron-store-path",
	"exec-approvals-sync-read",
	"github-publication",
	"memory-session",
	"memory-session-sync-inventory",
	"model-account-connect",
	"model-registry-native-read",
	"native-command-menu",
	"native-session-binding",
	"native-session-deletion",
	"node-host-sync-workspace",
	"openrouter-model-capabilities",
	"plugin-state-keyed-store",
	"provider-auth",
	"provider-selection",
	"provider-sync-configuration",
	"proxy-capture-reader",
	"proxy-capture-runtime",
	"proxy-capture-store",
	"reply-run-start",
	"reply-tool-authority-sync-preparation",
	"reply-visibility",
	"runtime-config",
	"session-catalog-identity",
	"session-catalog-title",
	"session-conversation",
	"session-deletion-transaction-callback",
	"session-entry-freshness",
	"session-input-completion",
	"session-model-override",
	"session-observer",
	"session-persistence",
	"session-store",
	"session-transcript",
	"session-transcript-key",
	"session-transcript-store",
	"session-upstream-links",
	"skill-command-discovery",
	"sqlite-runtime-native-access",
	"tool-surface",
	"tts",
	"watched-sessions-prompt",
	"watched-sessions-sync-harness-context",
	"web-search-providers"
]);
/** Call only at a legacy operation, with static capability and migration descriptions. */
function warnPluginSdkDeprecation(params) {
	const frame = getPluginExecutionFrame();
	const candidate = params.pluginId ?? frame?.invocation?.instance.pluginId ?? getPluginRegistryState()?.registrationContext?.pluginId ?? frame?.runtimePluginId;
	const pluginId = candidate && candidate.length <= 128 && /^(?:@[a-z0-9._-]+\/)?[a-z0-9][a-z0-9._-]*$/iu.test(candidate) ? candidate : void 0;
	const key = JSON.stringify([pluginId ?? null, params.family]);
	const removeAfter = sqliteRemovalFamilies.has(params.family) ? "2026-12-31" : void 0;
	if (pluginId) recordPluginSdkDeprecationUsage(pluginId, `${params.family}:${params.method}`, params.method, params.replacement, removeAfter);
	if (warned.has(key)) return;
	warned.add(key);
	const removal = removeAfter ? "Final compatibility day: 2026-12-31. Removal ships in the first January 2027 stable release; no SDK major is required." : "Removal requires an announced ordinary stable release window.";
	process.emitWarning(`${pluginId ? `Plugin ${pluginId}` : "Plugin SDK"}: ${params.method} is deprecated; use ${params.replacement} instead. ${params.compatibility ?? "The legacy contract remains supported during its deprecation period."} ${removal}`, {
		code: params.code ?? "DEP_PLUGIN_SDK",
		type: "DeprecationWarning"
	});
}
//#endregion
//#region src/proxy-capture/paths.ts
function resolveDebugProxyRootDir(env = process.env) {
	return path.join(resolveStateDir(env), "debug-proxy");
}
/** @deprecated Capture storage now lives in the shared state database. */
function resolveDebugProxyDbPath(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}
/** @deprecated Capture payloads now live in the shared state database. */
function resolveDebugProxyBlobDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "blobs");
}
function resolveDebugProxyCertDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "certs");
}
//#endregion
//#region src/proxy-capture/env.ts
const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
const OPENCLAW_DEBUG_PROXY_URL = "OPENCLAW_DEBUG_PROXY_URL";
const OPENCLAW_DEBUG_PROXY_CERT_DIR = "OPENCLAW_DEBUG_PROXY_CERT_DIR";
const OPENCLAW_DEBUG_PROXY_SESSION_ID = "OPENCLAW_DEBUG_PROXY_SESSION_ID";
const OPENCLAW_DEBUG_PROXY_REQUIRE = "OPENCLAW_DEBUG_PROXY_REQUIRE";
function readDebugProxyChildEndpoint(env = process$1.env) {
	const endpoint = URL.parse(env[OPENCLAW_DEBUG_PROXY_URL]?.trim() ?? "");
	return endpoint?.username === "openclaw-capture" ? endpoint : void 0;
}
let cachedImplicitSessionId;
function isTruthy(value) {
	return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveDebugProxySettings(env = process$1.env) {
	const enabled = isTruthy(env[OPENCLAW_DEBUG_PROXY_ENABLED]);
	const explicitSessionId = env[OPENCLAW_DEBUG_PROXY_SESSION_ID]?.trim() || void 0;
	const childEndpoint = readDebugProxyChildEndpoint(env);
	const sessionId = explicitSessionId ?? (cachedImplicitSessionId ??= randomUUID());
	return {
		enabled,
		required: isTruthy(env[OPENCLAW_DEBUG_PROXY_REQUIRE]),
		proxyUrl: childEndpoint?.origin ?? (env[OPENCLAW_DEBUG_PROXY_URL]?.trim() || void 0),
		dbPath: resolveDebugProxyDbPath(env),
		blobDir: resolveDebugProxyBlobDir(env),
		certDir: env[OPENCLAW_DEBUG_PROXY_CERT_DIR]?.trim() || resolveDebugProxyCertDir(env),
		sessionId,
		sourceProcess: "openclaw"
	};
}
function resolveEnabledDebugProxySettings(resolved) {
	if (!(resolved?.enabled ?? isTruthy(process$1.env[OPENCLAW_DEBUG_PROXY_ENABLED]))) return;
	return resolved ?? resolveDebugProxySettings();
}
//#endregion
//#region src/secrets/model-provider-header-policy.ts
/** Classifies model-provider request headers that should be treated as credential material. */
const SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS = [
	"api-key",
	"apikey",
	"token",
	"secret",
	"password",
	"credential"
];
/**
* Returns whether a model-provider header name should be treated as secret-bearing.
* This is intentionally conservative: false positives are audit noise, false negatives leak keys.
*/
function isLikelySensitiveModelProviderHeaderName(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized === "authorization" || normalized === "proxy-authorization" || SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}
//#endregion
//#region src/proxy-capture/header-redaction.ts
const REDACTED_CAPTURE_HEADER_VALUE = "[REDACTED]";
function isSensitiveCaptureHeaderName(name) {
	const normalized = name.trim().toLowerCase();
	return isLikelySensitiveModelProviderHeaderName(normalized) || normalized === "cookie" || normalized === "set-cookie" || normalized.includes("session");
}
function redactedCaptureHeaders(headers, additionalSensitiveNames) {
	if (!headers) return;
	const additionalSensitive = new Set([...additionalSensitiveNames ?? []].map((name) => name.trim().toLowerCase()));
	const entries = isHeadersLike(headers) ? Array.from(headers.entries()) : Object.entries(headers);
	const redacted = {};
	for (const [name, value] of entries) {
		if (additionalSensitive.has(name.trim().toLowerCase()) || isSensitiveCaptureHeaderName(name)) {
			redacted[name] = REDACTED_CAPTURE_HEADER_VALUE;
			continue;
		}
		const flattened = Array.isArray(value) ? value.join(", ") : value ?? "";
		redacted[name] = redactRegisteredSecretValues(flattened, () => REDACTED_CAPTURE_HEADER_VALUE);
	}
	return redacted;
}
//#endregion
//#region src/proxy-capture/runtime-deferral.ts
const captureDeferral = new AsyncLocalStorage();
function isDebugProxyCaptureDeferred() {
	const scope = captureDeferral.getStore();
	return scope !== void 0 && scope.phase !== "released";
}
//#endregion
//#region src/proxy-capture/cli-contract.ts
const text = string();
const event = object({
	sessionId: text.min(1),
	ts: number().finite(),
	sourceScope: literal("openclaw"),
	sourceProcess: text,
	protocol: _enum([
		"http",
		"https",
		"sse",
		"ws",
		"wss",
		"connect"
	]),
	direction: _enum([
		"outbound",
		"inbound",
		"local"
	]),
	kind: _enum([
		"connect",
		"tls-handshake",
		"request",
		"response",
		"ws-open",
		"ws-frame",
		"ws-close",
		"error",
		"retry-link"
	]),
	flowId: text,
	method: text.optional(),
	host: text.optional(),
	path: text.optional(),
	status: number().optional(),
	closeCode: number().optional(),
	contentType: text.optional(),
	headersJson: text.optional(),
	dataText: text.optional(),
	dataBlobId: text.optional(),
	dataSha256: text.optional(),
	errorText: text.optional(),
	metaJson: text.optional()
}).strict();
const debugProxyCaptureWriteCommandSchema = discriminatedUnion("type", [
	object({
		type: literal("capture.upsertSession"),
		input: object({
			id: text.min(1),
			startedAt: number().finite(),
			endedAt: number().finite().optional(),
			mode: text,
			sourceScope: literal("openclaw"),
			sourceProcess: text,
			proxyUrl: text.optional()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.endSession"),
		input: object({
			sessionId: text.min(1),
			endedAt: number().finite()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.recordEvent"),
		input: event
	}).strict(),
	object({
		type: literal("capture.recordEventWithPayload"),
		input: object({
			event,
			payload: object({
				data: text.nullable().optional(),
				base64: boolean().optional(),
				contentType: text.optional(),
				previewLimit: number().int().nonnegative().optional()
			}).strict().transform(({ data, base64, ...rest }) => ({
				...rest,
				data: base64 && data != null ? Buffer.from(data, "base64") : data
			}))
		}).strict()
	}).strict()
]);
discriminatedUnion("type", [
	...debugProxyCaptureWriteCommandSchema.options,
	object({
		type: literal("capture.listSessions"),
		input: object({ limit: number().int().positive().optional() }).strict()
	}).strict(),
	object({
		type: literal("capture.readBlob"),
		input: object({ blobId: text.min(1) }).strict()
	}).strict(),
	object({
		type: literal("capture.queryPreset"),
		input: object({
			preset: _enum([
				"double-sends",
				"retry-storms",
				"cache-busting",
				"ws-duplicate-frames",
				"missing-ack",
				"error-bursts"
			]),
			sessionId: text.optional()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.purgeAll"),
		input: _undefined().optional()
	}).strict()
]);
function encodeDebugProxyPayload(payload) {
	return {
		...payload,
		...Buffer.isBuffer(payload.data) ? {
			data: payload.data.toString("base64"),
			base64: true
		} : {}
	};
}
//#endregion
//#region src/proxy-capture/store-lifecycle.ts
const finalizers$1 = /* @__PURE__ */ new WeakMap();
const closed = /* @__PURE__ */ new WeakSet();
function registerCaptureStoreFinalizer(store, finalize) {
	if (closed.has(store)) throw new Error("Capture store is already finalized.");
	let callbacks = finalizers$1.get(store);
	if (!callbacks) {
		callbacks = /* @__PURE__ */ new Set();
		finalizers$1.set(store, callbacks);
	}
	return registerListener(callbacks, finalize);
}
function finalizeCaptureStore(store) {
	if (closed.has(store)) return;
	closed.add(store);
	const callbacks = finalizers$1.get(store);
	finalizers$1.delete(store);
	const errors = [];
	for (const finalize of callbacks ?? []) try {
		finalize();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture store finalization failed.");
}
const asyncFinalizers = /* @__PURE__ */ new WeakMap();
const asyncFinalizations = /* @__PURE__ */ new WeakMap();
function registerAsyncCaptureStoreFinalizer(store, finalize) {
	if (closed.has(store)) throw new Error("Capture store is already finalized.");
	let callbacks = asyncFinalizers.get(store);
	if (!callbacks) {
		callbacks = /* @__PURE__ */ new Set();
		asyncFinalizers.set(store, callbacks);
	}
	callbacks.add(finalize);
	return () => callbacks.delete(finalize);
}
function finalizeCaptureStoreAsync(store, finalizingStore) {
	const existing = asyncFinalizations.get(store);
	if (existing) return existing;
	if (closed.has(store)) return Promise.resolve();
	const completion = createDeferredCore();
	asyncFinalizations.set(store, completion.promise);
	closed.add(store);
	const callbacks = [...finalizers$1.get(store) ?? [], ...asyncFinalizers.get(store) ?? []];
	finalizers$1.delete(store);
	asyncFinalizers.delete(store);
	const pending = [];
	const errors = [];
	for (const finalize of callbacks) try {
		pending.push(Promise.resolve(finalize(finalizingStore)));
	} catch (error) {
		errors.push(error);
	}
	Promise.allSettled(pending).then((results) => {
		for (const result of results) if (result.status === "rejected") errors.push(result.reason);
		if (errors.length) completion.reject(new AggregateError(errors, "Capture store finalization failed."));
		else completion.resolve();
	});
	completion.promise.catch(() => void 0);
	return completion.promise;
}
//#endregion
//#region src/proxy-capture/child-transport.ts
const DEBUG_PROXY_CHILD_CAPTURE_PATH = "/.openclaw/debug-proxy-capture";
/** A child forwards only its capture writes to the parent's already-selected state owner. */
function createDebugProxyChildCaptureStore(settings) {
	const credentials = readDebugProxyChildEndpoint();
	if (!credentials) return;
	const token = decodeURIComponent(credentials.password);
	if (!token) throw new Error("Parent debug proxy capture credentials are missing or invalid; no local fallback was attempted");
	if (!settings.proxyUrl) throw new Error("Debug proxy child capture requires its parent proxy URL");
	const endpoint = new URL(DEBUG_PROXY_CHILD_CAPTURE_PATH, settings.proxyUrl);
	if (endpoint.protocol !== "http:") throw new Error("Debug proxy child capture requires an HTTP parent listener");
	registerSecretValueForRedaction(token);
	let closed = false;
	let closing = false;
	let completion;
	let queue = Promise.resolve();
	const send = (command) => {
		const body = JSON.stringify(command);
		const operation = queue.then(() => new Promise((resolve, reject) => {
			const req = request(endpoint, {
				method: "POST",
				agent: false,
				headers: {
					authorization: `Bearer ${token}`,
					"content-type": "application/json",
					"content-length": Buffer.byteLength(body)
				}
			}, (res) => {
				res.resume();
				res.once("error", reject);
				res.once("end", () => res.statusCode === 204 ? resolve() : reject(/* @__PURE__ */ new Error(`Parent debug proxy refused capture (HTTP ${res.statusCode})`)));
			});
			req.once("error", reject);
			req.setTimeout(6e5, () => req.destroy(/* @__PURE__ */ new Error("Parent debug proxy capture outcome is unknown; no retry was attempted")));
			req.end(body);
		}));
		queue = operation.catch(() => void 0);
		return operation;
	};
	const writer = (assertCurrent) => {
		const execute = (command) => {
			assertCurrent();
			return send(command);
		};
		return {
			get isClosed() {
				return closed;
			},
			upsertSession: (input) => execute({
				type: "capture.upsertSession",
				input
			}),
			endSession: (sessionId, endedAt = Date.now()) => execute({
				type: "capture.endSession",
				input: {
					sessionId,
					endedAt
				}
			}),
			recordEvent: (input) => execute({
				type: "capture.recordEvent",
				input
			}),
			recordEventWithPayload: (event, payload) => execute({
				type: "capture.recordEventWithPayload",
				input: {
					event,
					payload: encodeDebugProxyPayload(payload)
				}
			}),
			close: () => {
				closing = true;
				completion ??= (async () => {
					try {
						await finalizeCaptureStoreAsync(store, writer(() => {
							if (closed) throw new Error("Debug proxy child capture is closed");
						}));
					} finally {
						await queue;
						closed = true;
					}
				})();
				return completion;
			}
		};
	};
	const assertOpen = () => {
		if (closed || closing) throw new Error("Debug proxy child capture is closed");
	};
	const store = writer(assertOpen);
	return {
		store,
		ready: Promise.resolve(),
		release: () => store.close(),
		async runOperation(operation) {
			assertOpen();
			let active = true;
			try {
				return await operation(writer(() => {
					if (!active || closed) throw new Error("Debug proxy child capture operation has settled");
				}));
			} finally {
				active = false;
			}
		}
	};
}
//#endregion
//#region src/proxy-capture/runtime-cleanup.ts
const finalizers = /* @__PURE__ */ new Set();
function registerActiveDebugProxyCapture(finalize) {
	finalizers.add(finalize);
	const unregisterSignalBarrier = registerSignalExitBarrier(finalize);
	return () => {
		finalizers.delete(finalize);
		unregisterSignalBarrier();
	};
}
//#endregion
//#region src/proxy-capture/store.async.ts
function createDebugProxyCaptureStoreForContext(context) {
	let closed = false;
	let closing = false;
	let completion;
	let worker;
	const retire = async () => {
		closed = true;
		try {
			await worker.retire();
		} finally {
			unregisterResource();
			unregisterLifecycle();
		}
	};
	const unregisterResource = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
		if (identity !== void 0 && identity.key !== context.admission.identity.key) return;
		await retire();
	} });
	const unregisterLifecycle = registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened" && event.identity?.key === context.admission.identity.key) retire().catch(() => void 0);
	});
	const executePublic = (command) => {
		const result = closed || closing ? Promise.reject(new SqliteWorkerError("Capture store is closed", "closed")) : worker.execute(command);
		result.catch(() => void 0);
		return result;
	};
	const createStore = (execute) => ({
		dbPath: context.admission.databasePath,
		get isClosed() {
			if (closed) return true;
			try {
				context.admission.assertCurrent();
				return false;
			} catch {
				return true;
			}
		},
		upsertSession: (session) => execute({
			type: "capture.upsertSession",
			input: { ...session }
		}),
		endSession: (sessionId, endedAt = Date.now()) => execute({
			type: "capture.endSession",
			input: {
				sessionId,
				endedAt
			}
		}),
		persistPayload: (data, contentType) => execute({
			type: "capture.persistPayload",
			input: {
				data: Buffer.from(data),
				contentType
			}
		}),
		recordEvent: (event) => execute({
			type: "capture.recordEvent",
			input: { ...event }
		}),
		recordEventWithPayload: (event, payload) => execute({
			type: "capture.recordEventWithPayload",
			input: {
				event: { ...event },
				payload: {
					...payload,
					data: Buffer.isBuffer(payload.data) ? Buffer.from(payload.data) : payload.data
				}
			}
		}),
		listSessions: (limit) => execute({
			type: "capture.listSessions",
			input: { limit }
		}),
		getSessionEvents: (sessionId, limit) => execute({
			type: "capture.getSessionEvents",
			input: {
				sessionId,
				limit
			}
		}),
		summarizeSessionCoverage: (sessionId) => execute({
			type: "capture.summarizeSessionCoverage",
			input: { sessionId }
		}),
		readBlob: (blobId) => execute({
			type: "capture.readBlob",
			input: { blobId }
		}),
		queryPreset: (preset, sessionId) => execute({
			type: "capture.queryPreset",
			input: {
				preset,
				sessionId
			}
		}),
		deleteSessions: (sessionIds) => execute({
			type: "capture.deleteSessions",
			input: { sessionIds: [...sessionIds] }
		}),
		purgeAll: () => execute({
			type: "capture.purgeAll",
			input: void 0
		}),
		close: () => {
			closing = true;
			return completion ??= worker.release();
		}
	});
	const store = createStore(executePublic);
	try {
		worker = createOpenClawStateWorkerLease(context, async (scope) => {
			closing = true;
			try {
				await finalizeCaptureStoreAsync(store, createStore(scope.execute));
			} finally {
				closed = true;
				unregisterResource();
				unregisterLifecycle();
			}
		});
	} catch (error) {
		unregisterResource();
		unregisterLifecycle();
		throw error;
	}
	const ready = worker.ready.then(() => {
		context.admission.assertCurrent();
		if (closed) throw new SqliteWorkerError("Capture store is closed", "closed");
	});
	ready.catch(() => {
		unregisterResource();
		unregisterLifecycle();
	});
	return {
		store,
		ready,
		runOperation: (operation) => worker.runOperation((scope) => operation(createStore(scope.execute))),
		release: () => store.close()
	};
}
//#endregion
//#region src/proxy-capture/store-readonly.ts
function listDebugProxyCaptureSessions(db, limit = 50) {
	const kysely = getNodeSqliteKysely(db);
	const sessions = kysely.selectFrom("capture_sessions").select([
		"id",
		"started_at",
		"ended_at",
		"mode",
		"source_process",
		"proxy_url"
	]).groupBy("id").orderBy("started_at", "desc").limit(limit).as("s");
	const query = kysely.selectFrom(sessions).select([
		"s.id",
		"s.started_at as startedAt",
		"s.ended_at as endedAt",
		"s.mode",
		"s.source_process as sourceProcess",
		"s.proxy_url as proxyUrl"
	]).select((eb) => eb.selectFrom("capture_events as e").select((event) => event.fn.count("e.id").as("count")).whereRef("e.session_id", "=", "s.id").as("eventCount")).orderBy("s.started_at", "desc");
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).all(...bind(void 0));
}
function findDebugProxyCaptureBlobReference(db, blobId) {
	const query = getNodeSqliteKysely(db).selectFrom("capture_events").select("data_blob_id as blobId").where("data_blob_id", "=", blobId).limit(1);
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).get(...bind(void 0))?.blobId || null;
}
function queryDebugProxyCapturePreset(db, preset, sessionId) {
	const kysely = getNodeSqliteKysely(db);
	let events = kysely.selectFrom("capture_events");
	if (sessionId) events = events.where("session_id", "=", sessionId);
	const locations = events.select(["host", "path"]);
	const count = kysely.fn.countAll();
	let query;
	switch (preset) {
		case "double-sends":
			query = locations.select(["method", count.as("duplicateCount")]).where("kind", "=", "request").groupBy([
				"host",
				"path",
				"method",
				"data_sha256"
			]).having(count, ">", 1).orderBy("duplicateCount", "desc").orderBy("host", "asc");
			break;
		case "retry-storms":
			query = locations.select(count.as("errorCount")).where("kind", "=", "response").where("status", ">=", 429).groupBy(["host", "path"]).having(count, ">", 1).orderBy("errorCount", "desc").orderBy("host", "asc");
			break;
		case "cache-busting":
			query = locations.select(count.as("variantCount")).where("kind", "=", "request").where((eb) => eb.or([
				eb("path", "like", "%?%"),
				eb("headers_json", "like", "%cache-control%"),
				eb("headers_json", "like", "%pragma%")
			])).groupBy(["host", "path"]).orderBy("variantCount", "desc").orderBy("host", "asc");
			break;
		case "ws-duplicate-frames":
			query = locations.select(count.as("duplicateFrames")).where("kind", "=", "ws-frame").where("direction", "=", "outbound").groupBy([
				"host",
				"path",
				"data_sha256"
			]).having(count, ">", 1).orderBy("duplicateFrames", "desc").orderBy("host", "asc");
			break;
		case "missing-ack":
			query = events.select([
				"flow_id as flowId",
				"host",
				"path",
				count.as("outboundFrames")
			]).where("kind", "=", "ws-frame").where("direction", "=", "outbound").where("flow_id", "not in", events.select("flow_id").where("kind", "=", "ws-frame").where("direction", "=", "inbound")).groupBy([
				"flow_id",
				"host",
				"path"
			]).orderBy("outboundFrames", "desc");
			break;
		case "error-bursts":
			query = locations.select(count.as("errorCount")).where("kind", "=", "error").groupBy(["host", "path"]).orderBy("errorCount", "desc").orderBy("host", "asc");
			break;
		default: return [];
	}
	const { compiled, bind } = compileSqliteQueryBindings(() => query);
	return db.prepare(compiled.sql).all(...bind(void 0));
}
function readDebugProxyCaptureSessionEvents(db, sessionId, limit = 500) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("capture_events").select([
		"id",
		"session_id as sessionId",
		"ts",
		"source_scope as sourceScope",
		"source_process as sourceProcess",
		"protocol",
		"direction",
		"kind",
		"flow_id as flowId",
		"method",
		"host",
		"path",
		"status",
		"close_code as closeCode",
		"content_type as contentType",
		"headers_json as headersJson",
		"data_text as dataText",
		"data_blob_id as dataBlobId",
		"data_sha256 as dataSha256",
		"error_text as errorText",
		"meta_json as metaJson"
	]).where("session_id", "=", sessionId).orderBy("ts", "desc").orderBy("id", "desc").limit(limit)).rows;
}
function parseMetaJson(metaJson) {
	if (typeof metaJson !== "string" || metaJson.trim().length === 0) return null;
	try {
		const parsed = JSON.parse(metaJson);
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function sortObservedCounts(counts) {
	return [...counts.entries()].map(([value, count]) => ({
		value,
		count
	})).toSorted((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}
function summarizeDebugProxyCaptureSessionCoverage(db, sessionId) {
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(db).selectFrom("capture_events").select(["host", "meta_json as metaJson"]).where("session_id", "=", parameter((value) => value)));
	const rows = db.prepare(compiled.sql).iterate(...bind(sessionId));
	const providers = /* @__PURE__ */ new Map();
	const apis = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const hosts = /* @__PURE__ */ new Map();
	const localPeers = /* @__PURE__ */ new Map();
	let totalEvents = 0;
	let unlabeledEventCount = 0;
	try {
		for (const row of rows) {
			totalEvents += 1;
			const meta = parseMetaJson(row.metaJson);
			const provider = normalizeNullableString(meta?.provider);
			const api = normalizeNullableString(meta?.api);
			const model = normalizeNullableString(meta?.model);
			const host = normalizeNullableString(row.host);
			if (!provider && !api && !model) unlabeledEventCount += 1;
			if (provider) providers.set(provider, (providers.get(provider) ?? 0) + 1);
			if (api) apis.set(api, (apis.get(api) ?? 0) + 1);
			if (model) models.set(model, (models.get(model) ?? 0) + 1);
			if (host) {
				hosts.set(host, (hosts.get(host) ?? 0) + 1);
				if (host.startsWith("127.0.0.1:") || host.startsWith("localhost:")) localPeers.set(host, (localPeers.get(host) ?? 0) + 1);
			}
		}
	} catch (error) {
		try {
			rows.return?.();
		} catch {}
		throw error;
	}
	return {
		sessionId,
		totalEvents,
		unlabeledEventCount,
		providers: sortObservedCounts(providers),
		apis: sortObservedCounts(apis),
		models: sortObservedCounts(models),
		hosts: sortObservedCounts(hosts),
		localPeers: sortObservedCounts(localPeers)
	};
}
function readDebugProxyCaptureBlob(db, blobId) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("capture_blobs").select(["encoding", "data"]).where("blob_id", "=", blobId));
	if (!row?.data) return null;
	const data = Buffer.from(row.data);
	return (row.encoding === "gzip" ? gunzipSync(data) : data).toString("utf8");
}
var DebugProxyCaptureKernel = class {
	constructor(options) {
		this.db = options.db;
		this.dbPath = options.dbPath;
		this.blobDir = options.blobDir;
		this.capturePathBased = options.pathBased;
		this.runWrite = options.runWrite;
	}
	upsertSession(session) {
		const pathBased = this.capturePathBased;
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => {
			const values = {
				id: parameter((value) => value.id),
				started_at: parameter((value) => value.startedAt),
				ended_at: parameter((value) => value.endedAt ?? null),
				mode: parameter((value) => value.mode),
				source_scope: parameter((value) => value.sourceScope),
				source_process: parameter((value) => value.sourceProcess),
				proxy_url: parameter((value) => value.proxyUrl ?? null)
			};
			if (pathBased) return getNodeSqliteKysely(this.db).insertInto("capture_sessions").values({
				...values,
				db_path: parameter((value) => value.dbPath ?? this.dbPath),
				blob_dir: parameter((value) => value.blobDir ?? pathBased.blobDir)
			}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
				ended_at: eb.ref("excluded.ended_at"),
				proxy_url: eb.ref("excluded.proxy_url"),
				source_process: eb.ref("excluded.source_process")
			})));
			return getNodeSqliteKysely(this.db).insertInto("capture_sessions").values(values).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
				started_at: eb.fn("min", ["capture_sessions.started_at", "excluded.started_at"]),
				ended_at: eb.ref("excluded.ended_at"),
				mode: eb.case().when("capture_sessions.mode", "=", "implicit").then(eb.ref("excluded.mode")).else(eb.ref("capture_sessions.mode")).end(),
				proxy_url: eb.ref("excluded.proxy_url"),
				source_process: eb.ref("excluded.source_process")
			})));
		});
		const upsert = () => {
			const parameters = bind(session);
			return executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
		};
		if (pathBased) {
			upsert();
			return;
		}
		this.runWrite(upsert);
	}
	endSession(sessionId, endedAt = Date.now()) {
		const { compiled, bind } = compileSqliteQueryBindings(() => getNodeSqliteKysely(this.db).updateTable("capture_sessions").set({ ended_at: endedAt }).where("id", "=", sessionId));
		const update = () => {
			const parameters = bind();
			return executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
		};
		if (this.capturePathBased) {
			update();
			return;
		}
		this.runWrite(update);
	}
	persistPayload(data, contentType) {
		const sha256 = sha256Hex(data);
		const blobId = sha256.slice(0, 24);
		if (this.capturePathBased) {
			fsSync.mkdirSync(this.capturePathBased.blobDir, {
				recursive: true,
				mode: 448
			});
			const outputPath = path.join(this.capturePathBased.blobDir, `${blobId}.bin.gz`);
			if (!fsSync.existsSync(outputPath)) fsSync.writeFileSync(outputPath, gzipSync(data), { mode: 384 });
			applyPrivateModeSync(outputPath, 384);
			return {
				blobId,
				path: outputPath,
				encoding: "gzip",
				sizeBytes: data.byteLength,
				sha256,
				...contentType ? { contentType } : {}
			};
		}
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_blobs").values({
			blob_id: blobId,
			content_type: contentType ?? null,
			encoding: "gzip",
			size_bytes: parameter((value) => value.byteLength),
			sha256,
			data: parameter((value) => gzipSync(value)),
			created_at: parameter(() => Date.now())
		}).onConflict((conflict) => conflict.column("blob_id").doNothing()));
		this.runWrite(() => executeWithCachedStatement(this.db, compiled.sql, [
			data,
			contentType ?? null,
			blobId,
			sha256
		], (statement) => statement.run(...bind(data))));
		return {
			blobId,
			encoding: "gzip",
			sizeBytes: data.byteLength,
			sha256,
			...contentType ? { contentType } : {}
		};
	}
	recordEvent(event) {
		if (this.capturePathBased) {
			this.insertEvent(event, event.dataBlobId ?? null);
			return;
		}
		this.runWrite(() => {
			const implicitSession = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_sessions").values({
				id: parameter((value) => value.sessionId),
				started_at: parameter((value) => value.ts),
				mode: "implicit",
				source_scope: parameter((value) => value.sourceScope),
				source_process: parameter((value) => value.sourceProcess)
			}).onConflict((conflict) => conflict.column("id").doNothing()));
			const sessionParameters = implicitSession.bind(event);
			executeWithCachedStatement(this.db, implicitSession.compiled.sql, sessionParameters, (statement) => statement.run(...sessionParameters));
			let dataBlobId = null;
			if (event.dataBlobId) {
				const blob = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).selectFrom("capture_blobs").select((eb) => eb.lit(1).as("present")).where("blob_id", "=", parameter((value) => value)));
				const blobParameters = blob.bind(event.dataBlobId);
				dataBlobId = executeWithCachedStatement(this.db, blob.compiled.sql, blobParameters, (statement) => statement.get(...blobParameters)) ? event.dataBlobId : null;
			}
			this.insertEvent(event, dataBlobId);
		});
	}
	insertEvent(event, dataBlobId) {
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("capture_events").values({
			session_id: parameter((value) => value.sessionId),
			ts: parameter((value) => value.ts),
			source_scope: parameter((value) => value.sourceScope),
			source_process: parameter((value) => value.sourceProcess),
			protocol: parameter((value) => value.protocol),
			direction: parameter((value) => value.direction),
			kind: parameter((value) => value.kind),
			flow_id: parameter((value) => value.flowId),
			method: parameter((value) => value.method ?? null),
			host: parameter((value) => value.host ?? null),
			path: parameter((value) => value.path ?? null),
			status: parameter((value) => value.status ?? null),
			close_code: parameter((value) => value.closeCode ?? null),
			content_type: parameter((value) => value.contentType ?? null),
			headers_json: parameter((value) => value.headersJson ?? null),
			data_text: parameter((value) => value.dataText ?? null),
			data_blob_id: dataBlobId,
			data_sha256: parameter((value) => value.dataSha256 ?? null),
			error_text: parameter((value) => value.errorText ?? null),
			meta_json: parameter((value) => value.metaJson ?? null)
		}));
		const parameters = bind(event);
		executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.run(...parameters));
	}
	listSessions(limit = 50) {
		return listDebugProxyCaptureSessions(this.db, limit);
	}
	getSessionEvents(sessionId, limit = 500) {
		return readDebugProxyCaptureSessionEvents(this.db, sessionId, limit);
	}
	summarizeSessionCoverage(sessionId) {
		return summarizeDebugProxyCaptureSessionCoverage(this.db, sessionId);
	}
	readBlob(blobId) {
		if (this.capturePathBased) {
			const legacyBlobId = findDebugProxyCaptureBlobReference(this.db, blobId);
			if (!legacyBlobId) return null;
			const blobPath = path.join(this.capturePathBased.blobDir, `${legacyBlobId}.bin.gz`);
			return fsSync.existsSync(blobPath) ? gunzipSync(fsSync.readFileSync(blobPath)).toString("utf8") : null;
		}
		return readDebugProxyCaptureBlob(this.db, blobId);
	}
	queryPreset(preset, sessionId) {
		return queryDebugProxyCapturePreset(this.db, preset, sessionId);
	}
	purgeAll() {
		const kysely = getNodeSqliteKysely(this.db);
		const metadataDeletes = [kysely.deleteFrom("capture_events").compile().sql, kysely.deleteFrom("capture_sessions").compile().sql];
		if (this.capturePathBased) {
			const sessionCount = this.countCaptureRows("capture_sessions");
			const eventCount = this.countCaptureRows("capture_events");
			runSqliteImmediateTransactionSync(this.db, () => {
				for (const sql of metadataDeletes) executeWithCachedStatement(this.db, sql, [], (statement) => statement.run());
			});
			let blobs = 0;
			if (fsSync.existsSync(this.capturePathBased.blobDir)) for (const entry of fsSync.readdirSync(this.capturePathBased.blobDir)) {
				fsSync.rmSync(path.join(this.capturePathBased.blobDir, entry), { force: true });
				blobs += 1;
			}
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs
			};
		}
		return this.runWrite(() => {
			const sessionCount = this.countCaptureRows("capture_sessions");
			const eventCount = this.countCaptureRows("capture_events");
			const blobCount = this.countCaptureRows("capture_blobs");
			for (const sql of [...metadataDeletes, kysely.deleteFrom("capture_blobs").compile().sql]) executeWithCachedStatement(this.db, sql, [], (statement) => statement.run());
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs: blobCount
			};
		});
	}
	deleteSessions(sessionIds) {
		const uniqueSessionIds = normalizeUniqueStringEntries(sessionIds);
		if (uniqueSessionIds.length === 0) return {
			sessions: 0,
			events: 0,
			blobs: 0
		};
		if (this.capturePathBased) return this.deletePathBasedSessions(uniqueSessionIds);
		return this.runWrite(() => {
			const { blobRows, eventCount, sessionCount } = this.readSessionDeletionRows(uniqueSessionIds);
			this.deleteSessionMetadata(uniqueSessionIds);
			const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
			const remainingBlobRefs = this.findRemainingBlobReferences(candidateBlobIds);
			const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).deleteFrom("capture_blobs").where("blob_id", "=", parameter((blobId) => blobId)));
			return {
				sessions: sessionCount,
				events: eventCount,
				blobs: executeWithCachedStatement(this.db, compiled.sql, candidateBlobIds, (statement) => {
					let deleted = 0;
					for (const blobId of candidateBlobIds) {
						if (remainingBlobRefs.has(blobId)) continue;
						const result = statement.run(...bind(blobId));
						if (Number(result.changes) > 0) deleted += 1;
					}
					return deleted;
				})
			};
		});
	}
	deletePathBasedSessions(sessionIds) {
		const pathBased = this.capturePathBased;
		if (!pathBased) throw new Error("path-based debug proxy capture store is unavailable");
		const { blobRows, eventCount, sessionCount } = this.readSessionDeletionRows(sessionIds);
		runSqliteImmediateTransactionSync(this.db, () => this.deleteSessionMetadata(sessionIds));
		const candidateBlobIds = blobRows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId));
		const remainingBlobRefs = this.findRemainingBlobReferences(candidateBlobIds);
		let blobs = 0;
		for (const blobId of candidateBlobIds) {
			if (remainingBlobRefs.has(blobId)) continue;
			const blobPath = path.join(pathBased.blobDir, `${blobId}.bin.gz`);
			if (fsSync.existsSync(blobPath)) {
				fsSync.rmSync(blobPath, { force: true });
				blobs += 1;
			}
		}
		return {
			sessions: sessionCount,
			events: eventCount,
			blobs
		};
	}
	countCaptureRows(table) {
		const query = getNodeSqliteKysely(this.db).selectFrom(table).select((eb) => eb.fn.countAll().as("count"));
		return executeWithCachedStatement(this.db, query.compile().sql, [], (statement) => statement.get()).count ?? 0;
	}
	readSessionDeletionRows(sessionIds) {
		const kysely = getNodeSqliteKysely(this.db);
		const events = kysely.selectFrom("capture_events").where("session_id", "in", sessionIds);
		const blobs = compileSqliteQueryBindings(() => events.select("data_blob_id as blobId").distinct().where("data_blob_id", "is not", null));
		const blobParameters = blobs.bind(void 0);
		const blobRows = executeWithCachedStatement(this.db, blobs.compiled.sql, blobParameters, (statement) => statement.all(...blobParameters));
		const eventQuery = compileSqliteQueryBindings(() => events.select((eb) => eb.fn.countAll().as("count")));
		const eventParameters = eventQuery.bind(void 0);
		const eventRow = executeWithCachedStatement(this.db, eventQuery.compiled.sql, eventParameters, (statement) => statement.get(...eventParameters));
		const sessionQuery = compileSqliteQueryBindings(() => kysely.selectFrom("capture_sessions").select((eb) => eb.fn.countAll().as("count")).where("id", "in", sessionIds));
		const sessionParameters = sessionQuery.bind(void 0);
		const sessionRow = executeWithCachedStatement(this.db, sessionQuery.compiled.sql, sessionParameters, (statement) => statement.get(...sessionParameters));
		return {
			blobRows,
			eventCount: eventRow.count ?? 0,
			sessionCount: sessionRow.count ?? 0
		};
	}
	deleteSessionMetadata(sessionIds) {
		const kysely = getNodeSqliteKysely(this.db);
		const events = compileSqliteQueryBindings(() => kysely.deleteFrom("capture_events").where("session_id", "in", sessionIds));
		const eventParameters = events.bind(void 0);
		executeWithCachedStatement(this.db, events.compiled.sql, eventParameters, (statement) => statement.run(...eventParameters));
		const sessions = compileSqliteQueryBindings(() => kysely.deleteFrom("capture_sessions").where("id", "in", sessionIds));
		const sessionParameters = sessions.bind(void 0);
		executeWithCachedStatement(this.db, sessions.compiled.sql, sessionParameters, (statement) => statement.run(...sessionParameters));
	}
	findRemainingBlobReferences(candidateBlobIds) {
		if (candidateBlobIds.length === 0) return /* @__PURE__ */ new Set();
		const { compiled, bind } = compileSqliteQueryBindings(() => getNodeSqliteKysely(this.db).selectFrom("capture_events").select("data_blob_id as blobId").distinct().where("data_blob_id", "in", candidateBlobIds).where("data_blob_id", "is not", null));
		const parameters = bind(void 0);
		const rows = executeWithCachedStatement(this.db, compiled.sql, parameters, (statement) => statement.all(...parameters));
		return new Set(rows.map((row) => row.blobId?.trim()).filter((blobId) => Boolean(blobId)));
	}
};
function persistEventPayload(store, params) {
	if (params.data == null) return {};
	const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data);
	const previewLimit = params.previewLimit ?? 8192;
	const blob = store.persistPayload(buffer, params.contentType);
	return {
		dataText: new StringDecoder("utf8").write(buffer.subarray(0, previewLimit)),
		dataBlobId: blob.blobId,
		dataSha256: blob.sha256
	};
}
//#endregion
//#region src/proxy-capture/store.sqlite.ts
const DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION = 1;
const legacySchemaAdmission = {
	name: "openclaw.proxyCapture.legacySchema",
	schemaDependent: true,
	read: (value) => value === true ? true : void 0
};
const DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS capture_sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    mode TEXT NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    proxy_url TEXT,
    db_path TEXT NOT NULL,
    blob_dir TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS capture_events (
    id INTEGER PRIMARY KEY,
    session_id TEXT NOT NULL,
    ts INTEGER NOT NULL,
    source_scope TEXT NOT NULL,
    source_process TEXT NOT NULL,
    protocol TEXT NOT NULL,
    direction TEXT NOT NULL,
    kind TEXT NOT NULL,
    flow_id TEXT NOT NULL,
    method TEXT,
    host TEXT,
    path TEXT,
    status INTEGER,
    close_code INTEGER,
    content_type TEXT,
    headers_json TEXT,
    data_text TEXT,
    data_blob_id TEXT,
    data_sha256 TEXT,
    error_text TEXT,
    meta_json TEXT
  ) STRICT;
  CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx ON capture_events(session_id, ts);
  CREATE INDEX IF NOT EXISTS capture_events_flow_idx ON capture_events(flow_id, ts);
`;
function isInMemoryDatabasePath(dbPath) {
	if (dbPath === ":memory:") return true;
	if (!dbPath.startsWith("file:")) return false;
	const fragmentIndex = dbPath.indexOf("#");
	const uriWithoutFragment = fragmentIndex === -1 ? dbPath : dbPath.slice(0, fragmentIndex);
	const queryIndex = uriWithoutFragment.indexOf("?");
	const uriPath = queryIndex === -1 ? uriWithoutFragment : uriWithoutFragment.slice(0, queryIndex);
	try {
		if (decodeURIComponent(uriPath.slice(5)) === ":memory:") return true;
	} catch {}
	return queryIndex !== -1 && new URLSearchParams(uriWithoutFragment.slice(queryIndex + 1)).get("mode") === "memory";
}
function hardenLegacyDatabaseFiles(dbPath) {
	for (const candidate of resolveSqliteDatabaseFilePaths(dbPath)) if (fsSync.existsSync(candidate)) applyPrivateModeSync(candidate, 384);
}
function openPathBasedDebugProxyCaptureStore(dbPath, blobDir) {
	const fileBackedPath = isInMemoryDatabasePath(dbPath) ? void 0 : dbPath;
	if (fileBackedPath) {
		fsSync.mkdirSync(path.dirname(fileBackedPath), {
			recursive: true,
			mode: 448
		});
		if (!fsSync.existsSync(fileBackedPath)) fsSync.closeSync(fsSync.openSync(fileBackedPath, "a", 384));
	}
	const db = openNodeSqliteDatabase(dbPath);
	let walMaintenance;
	try {
		if (fileBackedPath) applyPrivateModeSync(fileBackedPath, 384);
		walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: 5e3,
			databaseLabel: "debug-proxy-capture-sdk",
			...fileBackedPath ? { databasePath: fileBackedPath } : {},
			foreignKeys: true
		});
		if (!getSqliteDatabaseAdmission(db, legacySchemaAdmission)) {
			const versionRow = db.prepare("PRAGMA user_version").get();
			const schemaVersion = Number(versionRow?.user_version ?? 0);
			if (schemaVersion > DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) throw new Error(`Legacy debug proxy capture database uses newer schema version ${schemaVersion}; this build supports ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION}`);
			db.exec(DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL);
			if (schemaVersion < DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) {
				migrateSqliteSchemaToStrict(db, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL, { databaseLabel: fileBackedPath ?? dbPath });
				db.exec(`PRAGMA user_version = ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION};`);
			}
			publishSqliteDatabaseAdmission(db, legacySchemaAdmission, true);
		}
		if (fileBackedPath) hardenLegacyDatabaseFiles(fileBackedPath);
		return {
			db,
			pathBased: {
				blobDir,
				walMaintenance
			}
		};
	} catch (err) {
		walMaintenance?.close();
		db.close();
		throw err;
	}
}
var DebugProxyCaptureStoreImpl = class extends DebugProxyCaptureKernel {
	constructor(optionsOrDbPath = {}, legacyBlobDir) {
		warnPluginSdkDeprecation({
			family: "proxy-capture-store",
			method: "DebugProxyCaptureStore",
			replacement: "await acquireDebugProxyCaptureStoreAsync()"
		});
		if (typeof optionsOrDbPath === "string") {
			if (!legacyBlobDir) throw new TypeError("legacy debug proxy capture store requires a blob directory");
			const opened = openPathBasedDebugProxyCaptureStore(optionsOrDbPath, legacyBlobDir);
			super({
				db: opened.db,
				dbPath: optionsOrDbPath,
				blobDir: legacyBlobDir,
				pathBased: opened.pathBased,
				runWrite: () => {
					throw new Error("shared debug proxy capture state is unavailable");
				}
			});
			this.pathBased = opened.pathBased;
			this.closed = false;
			this.closing = false;
			return;
		}
		const env = optionsOrDbPath.env;
		const database = openOpenClawStateDatabase({ env });
		super({
			db: database.db,
			dbPath: database.path,
			blobDir: database.path,
			runWrite: (operation) => runOpenClawStateWriteTransaction(operation, {
				database,
				env: env ?? process.env
			})
		});
		this.closed = false;
		this.closing = false;
		this.releaseIdleReference = retainOpenClawStateDatabaseForIdle(database);
	}
	close() {
		if (this.closed || this.closing) return;
		this.closing = true;
		const errors = [];
		for (const close of [
			() => finalizeCaptureStore(this),
			() => this.releaseIdleReference?.(),
			() => this.pathBased?.walMaintenance.close(),
			() => {
				if (this.pathBased && this.db.isOpen) this.db.close();
			}
		]) try {
			close();
		} catch (error) {
			errors.push(error);
		}
		this.closed = true;
		this.closing = false;
		if (errors.length) throw new AggregateError(errors, "Capture store close failed.");
	}
	get isClosed() {
		return this.closed || !this.db.isOpen;
	}
};
const cachedStores = /* @__PURE__ */ new Map();
let unregisterExitClose = null;
function resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir) {
	return typeof optionsOrDbPath === "string" ? `legacy:${optionsOrDbPath}:${legacyBlobDir ?? ""}` : `shared:${resolveOpenClawStateSqlitePath(optionsOrDbPath.env ?? process.env)}`;
}
function getDebugProxyCaptureStoreImpl(optionsOrDbPath = {}, legacyBlobDir) {
	const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
	const cached = cachedStores.get(key);
	if (cached && !cached.store.isClosed) return cached.store;
	const store = new DebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
	cachedStores.set(key, {
		store,
		leases: 0
	});
	unregisterExitClose ??= registerSqliteCacheExitClose(closeDebugProxyCaptureStore);
	return store;
}
function getDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-store",
		method: "getDebugProxyCaptureStore",
		replacement: "await acquireDebugProxyCaptureStoreAsync() and await lease.release() in finally"
	});
	return getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
}
/** @deprecated Await each async capture lease's release instead. Final compatibility day: 2026-12-31. */
function closeDebugProxyCaptureStore() {
	warnPluginSdkDeprecation({
		family: "proxy-capture-store",
		method: "closeDebugProxyCaptureStore",
		replacement: "await each async capture lease.release() in finally"
	});
	unregisterExitClose?.();
	unregisterExitClose = null;
	const stores = [...cachedStores.values()];
	cachedStores.clear();
	const errors = [];
	for (const cached of stores) try {
		cached.store.close();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture stores failed to close.");
}
function safeJsonString(value) {
	return value == null ? void 0 : JSON.stringify(value);
}
//#endregion
//#region src/proxy-capture/runtime-owner.ts
const DEBUG_PROXY_FETCH_PATCH_KEY = Symbol.for("openclaw.debugProxy.fetchPatch");
function captureStateContext() {
	try {
		return { context: captureOpenClawStateWorkerContext() };
	} catch (error) {
		return { error };
	}
}
function currentStateContext(owner) {
	if ("error" in owner.state) throw owner.state.error;
	owner.state.context.admission.assertCurrent();
	return owner.state.context;
}
function resolveRuntimeDeps(deps = {}) {
	return {
		getStore: deps.getStore ?? getDebugProxyCaptureStore,
		closeStore: deps.closeStore,
		persistEventPayload: deps.persistEventPayload ?? ((store, payload) => persistEventPayload(store, payload)),
		safeJsonString: deps.safeJsonString ?? safeJsonString,
		fetchTarget: deps.fetchTarget ?? globalThis
	};
}
const captureOwners = /* @__PURE__ */ new WeakMap();
const globalFetchPatches = /* @__PURE__ */ new WeakMap();
/** Guarded requests own capture admission, including when given a saved patch. */
function resolveDebugProxyFetchTransport(fetchImpl) {
	return globalFetchPatches.get(fetchImpl)?.originalFetch ?? fetchImpl;
}
function uninstallDebugProxyGlobalFetchPatch(deps = {}, admission) {
	const fetchTarget = resolveRuntimeDeps(deps).fetchTarget;
	const state = fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
	if (!state || admission && state.admission !== admission) return;
	fetchTarget.fetch = state.originalFetch;
	delete fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
}
function captureOwnerKey(settings) {
	return JSON.stringify([settings.dbPath, settings.sessionId]);
}
function reportCapturePersistenceFailure(owner, error) {
	owner.errors.push(error);
	reportCaptureError(error);
}
function reportCaptureError(error) {
	try {
		const message = redactRegisteredSecretValues(error instanceof Error ? error.message : String(error), () => REDACTED_CAPTURE_HEADER_VALUE);
		writeSync(2, `[proxy-capture] Capture persistence failed: ${message}\n`);
	} catch {}
}
function finishCaptureOwner(owner) {
	if (!owner.active) return;
	sealCaptureOwner(owner);
	const lastClaim = releaseCaptureClaim(owner);
	try {
		if (lastClaim && !owner.store.isClosed) owner.store.endSession(owner.settings.sessionId);
	} catch (error) {
		reportCapturePersistenceFailure(owner, error);
	}
	forgetCaptureOwner(owner);
	if (owner.errors.length) throw new AggregateError(owner.errors.splice(0), "Capture session finalization failed.");
}
function resolveCaptureOwner(settings, runtime, options = {}) {
	if (isDebugProxyCaptureDeferred()) return;
	let registry = captureOwners.get(runtime.getStore);
	const key = captureOwnerKey(settings);
	let session = registry?.owners.get(key);
	if (!session) {
		const prior = options.explicit ? registry?.resolved.get(settings) : registry?.ambient?.sessionId === settings.sessionId && registry.ambient.dbPath === settings.dbPath ? registry.ambient.admission : void 0;
		if (!options.initialize && prior) {
			session = prior.current;
			if (!session) return;
		}
	}
	if (session?.closing) return;
	const maintenanceScope = getOpenClawDatabaseMaintenanceScope();
	maintenanceScope?.assertAdmission();
	if (!registry) {
		registry = {
			owners: /* @__PURE__ */ new Map(),
			resolved: /* @__PURE__ */ new WeakMap()
		};
		captureOwners.set(runtime.getStore, registry);
	}
	if (!session) {
		session = {
			settings: { ...settings },
			runtime,
			state: captureStateContext(),
			errors: [],
			claims: /* @__PURE__ */ new Set(),
			admission: {},
			closing: false,
			syncClosed: false,
			usedAsync: false,
			writes: Promise.resolve()
		};
		session.admission.current = session;
	}
	const asynchronous = options.asynchronous === true;
	if (!asynchronous) {
		if (options.initialize) session.syncClosed = false;
		else if (session.syncClosed) return;
	}
	let owner = [...session.claims].find((claim) => claim.maintenanceScope === maintenanceScope && claim.asynchronous === asynchronous);
	if (!owner) {
		const unregister = [];
		const state = "context" in session.state ? { context: {
			...session.state.context,
			maintenanceScope
		} } : session.state;
		const getStore = () => {
			if (session.runtime.getStore !== getDebugProxyCaptureStore) return session.runtime.getStore();
			if ("error" in state) throw state.error;
			state.context.admission.assertCurrent();
			return getDebugProxyCaptureStore({ env: state.context.environment });
		};
		const store = options.asynchronous ? void 0 : getStore();
		if (store?.isClosed) return;
		owner = {
			session,
			maintenanceScope,
			settings: session.settings,
			runtime: session.runtime,
			syncStore: store,
			get store() {
				if (!this.syncStore) {
					if (this.asyncStore?.isClosed) throw new Error("Capture store is closed.");
					this.syncStore = getStore();
					unregister.push(registerCaptureStoreFinalizer(this.syncStore, () => finishCaptureOwner(this)));
				}
				return this.syncStore;
			},
			state,
			asynchronous,
			writes: /* @__PURE__ */ new Set(),
			active: true,
			pending: /* @__PURE__ */ new Set(),
			errors: [],
			unregister: () => {
				for (const remove of unregister.splice(0)) remove();
			},
			admission: {}
		};
		owner.admission.current = owner;
		const retainedOwner = owner;
		if (store) unregister.push(registerCaptureStoreFinalizer(store, () => finishCaptureOwner(retainedOwner)));
		unregister.push(registerActiveDebugProxyCapture(() => closeCaptureOwnerAsync(retainedOwner)));
		session.claims.add(owner);
		registry.owners.set(key, session);
		maintenanceScope?.own(retainedOwner, "shared-resources", () => closeCaptureOwnerAsync(retainedOwner));
	}
	if (!owner.active) return;
	if (options.asynchronous) session.usedAsync = true;
	if (options.explicit) registry.resolved.set(settings, session.admission);
	else registry.ambient = {
		sessionId: settings.sessionId,
		dbPath: settings.dbPath,
		admission: session.admission
	};
	return owner;
}
function resolveCaptureOwnerForTransport(resolved, deps = {}, options = {}) {
	let settings;
	let runtime;
	try {
		settings = resolveEnabledDebugProxySettings(resolved);
		if (!settings) return;
		runtime = resolveRuntimeDeps(deps);
		return resolveCaptureOwner(settings, runtime, {
			explicit: resolved !== void 0,
			...options
		});
	} catch (error) {
		const session = settings && runtime ? captureOwners.get(runtime.getStore)?.owners.get(captureOwnerKey(settings)) : void 0;
		if (session) reportCapturePersistenceFailure(session, error);
		else reportCaptureError(error);
		return;
	}
}
function sealCaptureOwner(owner) {
	revokeCaptureOwner(owner);
	for (const finish of owner.pending) finish();
}
function revokeCaptureOwner(owner) {
	owner.active = false;
	owner.admission.current = void 0;
}
function forgetCaptureOwner(owner) {
	const registry = captureOwners.get(owner.runtime.getStore);
	if (owner.session.claims.size === 0 && registry?.owners.get(captureOwnerKey(owner.settings)) === owner.session) registry.owners.delete(captureOwnerKey(owner.settings));
	owner.unregister();
}
function releaseCaptureClaim(owner) {
	const session = owner.session;
	if (!session.claims.delete(owner)) return false;
	if (session.claims.size > 0) return false;
	session.closing = true;
	session.admission.current = void 0;
	owner.errors.push(...session.errors.splice(0));
	uninstallDebugProxyGlobalFetchPatch(session.runtime, session.admission);
	return true;
}
/** Observe callback-owned work without converting its rejection into success. */
function observeCaptureWrite(owner, operation) {
	owner.writes.add(operation);
	operation.then(() => owner.writes.delete(operation), (error) => {
		owner.writes.delete(operation);
		reportCapturePersistenceFailure(owner, error);
	});
	return operation;
}
function ensureAsyncCaptureLease(owner) {
	const context = currentStateContext(owner);
	if (!owner.asyncLease) {
		const lease = createDebugProxyChildCaptureStore(owner.settings) ?? createDebugProxyCaptureStoreForContext(context);
		owner.asyncLease = lease;
		owner.asyncStore = lease.store;
		const unregister = registerAsyncCaptureStoreFinalizer(lease.store, (finalizingStore) => {
			owner.asyncStore = finalizingStore;
			const finishing = finishCaptureOwnerAsync(owner);
			const forgetAfterStoreClose = () => {
				if (!owner.closing) forgetCaptureOwner(owner);
			};
			lease.store.close().then(forgetAfterStoreClose, forgetAfterStoreClose);
			return finishing;
		});
		const previous = owner.unregister;
		owner.unregister = () => {
			unregister();
			previous();
		};
	}
	return owner.asyncLease;
}
async function getAsyncCaptureStore(owner) {
	const lease = ensureAsyncCaptureLease(owner);
	await lease.ready;
	return lease.store;
}
function runCaptureOperation(owner, operation) {
	return ensureAsyncCaptureLease(owner).runOperation(operation);
}
/** Reserve retained input before copying facts or waiting for FIFO admission. */
async function recordCaptureEventAsync(owner, event, payload, store) {
	const data = payload?.data;
	const inputBytes = serialize(payload === void 0 ? {
		type: "capture.recordEvent",
		input: event
	} : {
		type: "capture.recordEventWithPayload",
		input: {
			event,
			payload: {
				...payload,
				data: Buffer.isBuffer(data) ? Buffer.alloc(0) : data
			}
		}
	}).byteLength + (Buffer.isBuffer(data) ? data.byteLength : 0);
	const preparation = reserveSqliteWorkerInputPreparation(inputBytes);
	try {
		const preparedEvent = { ...event };
		const preparedPayload = payload === void 0 ? void 0 : {
			...payload,
			data: Buffer.isBuffer(data) ? Buffer.from(data) : data
		};
		const ready = ensureAsyncCaptureLease(owner).ready;
		return await sequenceCaptureWrite(owner, store, async (execution) => {
			await ready;
			return preparation.handoff(() => preparedPayload === void 0 ? execution.recordEvent(preparedEvent) : execution.recordEventWithPayload(preparedEvent, preparedPayload));
		});
	} finally {
		preparation.release();
	}
}
function sequenceCaptureWrite(owner, store, write) {
	const operation = owner.session.writes.then(() => write(store));
	owner.session.writes = operation.then(() => void 0, () => void 0);
	return owner.maintenanceScope ? owner.maintenanceScope.track(operation) : operation;
}
function finishCaptureOwnerAsync(owner) {
	if (owner.finishing) return owner.finishing;
	const completion = createDeferredCore();
	owner.finishing = completion.promise;
	sealCaptureOwner(owner);
	const finish = async () => {
		while (owner.writes.size) await Promise.allSettled(owner.writes);
		try {
			const lastClaim = releaseCaptureClaim(owner);
			if (lastClaim && owner.asyncLease) {
				const lease = owner.asyncLease;
				await lease.ready;
				const store = owner.asyncStore ?? lease.store;
				if (store.isClosed) throw new SqliteWorkerError("Capture store is closed", "closed");
				await store.endSession(owner.settings.sessionId);
			} else if (lastClaim && owner.syncStore && !owner.syncStore.isClosed) owner.syncStore.endSession(owner.settings.sessionId);
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		}
		if (owner.errors.length) throw new AggregateError(owner.errors.splice(0), "Capture session finalization failed.");
	};
	finish().then(completion.resolve, completion.reject);
	completion.promise.catch(() => void 0);
	return completion.promise;
}
function closeCaptureOwnerAsync(owner) {
	if (owner.closing) return owner.closing;
	const completion = createDeferredCore();
	owner.closing = completion.promise;
	revokeCaptureOwner(owner);
	const close = async () => {
		const errors = [];
		try {
			if (owner.asyncLease) await owner.asyncLease.release();
		} catch (error) {
			errors.push(error);
		}
		try {
			await finishCaptureOwnerAsync(owner);
		} catch (error) {
			if (!errors.some((previous) => collectNestedErrorCandidates(previous).includes(error))) errors.push(error);
		}
		try {
			const store = owner.syncStore;
			if (store && ![...owner.session.claims].some((claim) => claim.syncStore === store)) {
				if (owner.runtime.closeStore) owner.runtime.closeStore();
				else store.close?.();
			}
		} catch (error) {
			errors.push(error);
		}
		forgetCaptureOwner(owner);
		if (errors.length) throw new AggregateError(errors, "Capture finalization failed.");
	};
	close().then(completion.resolve, completion.reject);
	completion.promise.catch(() => void 0);
	return completion.promise;
}
//#endregion
//#region src/proxy-capture/runtime-response-body.ts
const MAX_CAPTURED_RESPONSE_BODY_BYTES = 16777216;
const CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS = 1e4;
/** Distinguishes the capture deadline from a genuine response-stream failure. */
var CaptureReadIdleTimeoutError = class extends Error {};
function readCapturedResponseBodyBounded(response, owner, record, signal, asynchronous = false) {
	const recordMetadata = (status) => {
		try {
			record({ status });
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		}
	};
	if (typeof response.clone !== "function") {
		recordMetadata("unavailable");
		return;
	}
	const declaredLength = parseDeclaredCaptureContentLength(typeof response.headers?.get === "function" ? response.headers.get("content-length") : void 0);
	if (declaredLength !== void 0 && declaredLength > BigInt(MAX_CAPTURED_RESPONSE_BODY_BYTES)) {
		recordMetadata("too-large");
		return;
	}
	let reader;
	let chunks = [];
	let total = 0;
	let finished = false;
	let canceled = false;
	let detachAbort = () => {};
	const cancel = (reason) => {
		if (!reader || canceled) return;
		canceled = true;
		try {
			reader.cancel(reason).catch(() => void 0);
		} catch (error) {
			owner.errors.push(error);
		}
	};
	const release = () => {
		try {
			reader?.releaseLock();
		} catch {}
	};
	const finish = (result) => {
		if (finished) return;
		finished = true;
		detachAbort();
		owner.pending.delete(finalize);
		try {
			if (!asynchronous && owner.store.isClosed) throw new Error("Capture store closed before its response could be finalized.");
			record(result);
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		} finally {
			chunks = [];
			cancel();
			release();
		}
	};
	const finalize = () => finish({
		status: "finalized",
		buffer: Buffer.concat(chunks, total)
	});
	owner.pending.add(finalize);
	if (signal) {
		const onAbort = () => {
			setTimeout(() => {
				if (finished) return;
				finish({
					status: "failed",
					buffer: Buffer.concat(chunks, total),
					error: signal.reason instanceof Error ? signal.reason : new Error("Response capture aborted", { cause: signal.reason })
				});
			}, 0);
		};
		if (signal.aborted) onAbort();
		else {
			signal.addEventListener("abort", onAbort, { once: true });
			detachAbort = () => signal.removeEventListener("abort", onAbort);
		}
	}
	if (finished) return;
	(async () => {
		try {
			const clone = response.clone();
			const body = clone.body;
			if (!body || typeof body.getReader !== "function") {
				finish(clone instanceof Response && clone.body === null ? {
					status: "captured",
					buffer: Buffer.alloc(0)
				} : { status: "unavailable" });
				return;
			}
			reader = body.getReader();
			for (;;) {
				if (finished || !owner.active) return;
				const { done, value } = await withResponseBodyTimeout({
					timeoutMs: CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS,
					onTimeout: ({ timeoutMs }) => new CaptureReadIdleTimeoutError(`capture read stalled: no data for ${timeoutMs}ms`),
					cancel: async (error) => cancel(error),
					read: () => reader.read()
				});
				if (finished || !owner.active) return;
				if (done) {
					finish({
						status: "captured",
						buffer: Buffer.concat(chunks, total)
					});
					return;
				}
				if (!value?.length) continue;
				if (total + value.length > MAX_CAPTURED_RESPONSE_BODY_BYTES) {
					finish({ status: "too-large" });
					return;
				}
				chunks.push(Buffer.from(value));
				total += value.length;
			}
		} catch (error) {
			if (!finished && owner.active) finish(error instanceof CaptureReadIdleTimeoutError ? {
				status: "stalled",
				buffer: Buffer.concat(chunks, total)
			} : {
				status: "failed",
				buffer: Buffer.concat(chunks, total),
				error
			});
		} finally {
			release();
		}
	})();
}
function parseDeclaredCaptureContentLength(raw) {
	if (raw === null || raw === void 0) return;
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) return;
	return BigInt(trimmed);
}
//#endregion
//#region src/proxy-capture/runtime.ts
const REDACTED_CAPTURE_BINARY_PAYLOAD = Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
function protocolFromUrl(url) {
	switch (url.protocol) {
		case "https:": return "https";
		case "wss:": return "wss";
		case "ws:": return "ws";
		default: return "http";
	}
}
function redactCaptureUrl(rawUrl) {
	let url;
	try {
		url = new URL$1(rawUrl);
	} catch {
		return "https://redacted.invalid/%5BREDACTED%5D";
	}
	const decodeComponent = (value) => {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	};
	if (redactCaptureText(url.hostname) !== url.hostname) url.hostname = "redacted.invalid";
	for (const key of ["username", "password"]) {
		const decoded = decodeComponent(url[key]);
		const redacted = redactCaptureText(decoded);
		if (redacted !== decoded) url[key] = redacted;
	}
	url.pathname = url.pathname.split("/").map((segment) => {
		try {
			const decoded = decodeURIComponent(segment);
			const redacted = redactCaptureText(decoded);
			return redacted === decoded ? segment : encodeURIComponent(redacted);
		} catch {
			return segment;
		}
	}).join("/");
	const searchParams = new URLSearchParams();
	let searchChanged = false;
	for (const [name, value] of url.searchParams.entries()) {
		const redactedName = redactCaptureText(name);
		const redactedValue = redactCaptureText(value);
		searchParams.append(redactedName, redactedValue);
		if (redactedName !== name || redactedValue !== value) searchChanged = true;
	}
	if (searchChanged) url.search = searchParams.toString();
	const decodedHash = decodeComponent(url.hash.slice(1));
	const redactedHash = redactCaptureText(decodedHash);
	if (redactedHash !== decodedHash) url.hash = redactedHash;
	const serialized = url.toString();
	return redactCaptureText(serialized) === serialized ? serialized : `${url.protocol}//redacted.invalid/%5BREDACTED%5D`;
}
function redactCaptureText(value) {
	return redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
}
function redactCapturePayload(value) {
	if (typeof value === "string") return redactCaptureText(value);
	if (!Buffer.isBuffer(value)) return value ?? null;
	if (!isUtf8(value)) return hasRegisteredSecretValuesForRedaction() ? REDACTED_CAPTURE_BINARY_PAYLOAD : value;
	const text = value.toString("utf8");
	const redacted = redactCaptureText(text);
	return redacted === text ? value : Buffer.from(redacted, "utf8");
}
function redactedCaptureJson(value, stringify = safeJsonString) {
	const serialized = stringify(value);
	return serialized === void 0 ? void 0 : redactCaptureText(serialized);
}
function createHttpCaptureEventBase(params) {
	return {
		sessionId: params.settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: params.settings.sourceProcess,
		protocol: params.transport ?? protocolFromUrl(params.url),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		method: params.method,
		host: params.url.host,
		path: `${params.url.pathname}${params.url.search}`
	};
}
function captureInstalledFetch(owner, params) {
	return runOwnedCapture(owner, owner.asynchronous, (execution) => "response" in params ? captureOwnedHttpExchange(params, owner, execution) : captureOwnedHttpError(params, owner, execution));
}
function runOwnedCapture(owner, asynchronous, capture) {
	if (isDebugProxyCaptureDeferred()) return;
	if (!asynchronous) {
		try {
			owner.maintenanceScope?.assertAdmission();
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
			return;
		}
		return capture({ asynchronous: false });
	}
	try {
		owner.maintenanceScope?.assertAdmission();
		return observeCaptureWrite(owner, runCaptureOperation(owner, async (store) => {
			await capture({
				asynchronous: true,
				store
			});
		}));
	} catch (error) {
		const failed = createDeferredCore();
		failed.reject(error);
		return observeCaptureWrite(owner, failed.promise);
	}
}
function writeCaptureEvent(owner, event, payload, execution) {
	if (execution.asynchronous) return recordCaptureEventAsync(owner, event, payload, execution.store);
	const store = owner.store;
	const fields = payload === void 0 ? {} : owner.runtime.persistEventPayload(store, payload);
	store.recordEvent({
		...event,
		...fields
	});
}
function captureOwnedHttpError(params, owner, execution = { asynchronous: false }) {
	const asynchronous = execution.asynchronous;
	try {
		const captureUrl = redactCaptureUrl(params.url);
		return writeCaptureEvent(owner, {
			...createHttpCaptureEventBase({
				settings: owner.settings,
				url: new URL$1(captureUrl),
				transport: params.transport,
				direction: "local",
				kind: "error",
				flowId: params.flowId ?? randomUUID(),
				method: params.method
			}),
			errorText: redactCaptureText(params.error instanceof Error ? params.error.message : String(params.error)),
			metaJson: redactedCaptureJson(params.meta, owner.runtime.safeJsonString)
		}, void 0, execution);
	} catch (error) {
		if (asynchronous) throw error;
		reportCapturePersistenceFailure(owner, error);
	}
}
function captureOwnedHttpExchange(params, owner, execution = { asynchronous: false }) {
	const asynchronous = execution.asynchronous;
	const { settings, runtime } = owner;
	const flowId = params.flowId ?? randomUUID();
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL$1(captureUrl);
	const method = params.method;
	const transport = params.transport;
	const responseStatus = params.response.status;
	const requestBody = typeof params.requestBody === "string" || Buffer.isBuffer(params.requestBody) ? params.requestBody : null;
	const rawRequestContentType = params.requestHeaders ? isHeadersLike(params.requestHeaders) ? params.requestHeaders.get("content-type") ?? void 0 : params.requestHeaders["content-type"] : void 0;
	const requestContentType = rawRequestContentType === void 0 ? void 0 : redactCaptureText(rawRequestContentType);
	const rawResponseContentType = typeof params.response.headers?.get === "function" ? params.response.headers.get("content-type") ?? void 0 : void 0;
	const responseContentType = rawResponseContentType === void 0 ? void 0 : redactCaptureText(rawResponseContentType);
	let responseHeadersJson;
	let metaJson;
	let meta;
	let requestWrite;
	try {
		responseHeadersJson = params.response.headers && typeof params.response.headers.entries === "function" ? runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)) : void 0;
		metaJson = redactedCaptureJson(params.meta, runtime.safeJsonString);
		meta = metaJson === void 0 ? void 0 : JSON.parse(metaJson);
		requestWrite = writeCaptureEvent(owner, {
			...createHttpCaptureEventBase({
				settings,
				url,
				transport,
				direction: "outbound",
				kind: "request",
				flowId,
				method
			}),
			contentType: requestContentType,
			headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.requestHeaders, Array.isArray(params.meta?.sensitiveRequestHeaderNames) ? params.meta.sensitiveRequestHeaderNames.filter((name) => typeof name === "string") : void 0)),
			metaJson
		}, {
			data: redactCapturePayload(requestBody),
			contentType: requestContentType
		}, execution);
	} catch (error) {
		if (asynchronous) throw error;
		reportCapturePersistenceFailure(owner, error);
		return;
	}
	const completion = asynchronous ? createDeferredCore() : void 0;
	const requestSettled = asynchronous ? Promise.resolve(requestWrite) : void 0;
	if (completion && requestSettled) requestSettled.catch(completion.reject);
	const recordTerminal = (result) => {
		try {
			const failed = result.status === "failed";
			const event = {
				...createHttpCaptureEventBase({
					settings,
					url,
					transport,
					direction: failed ? "local" : "inbound",
					kind: failed ? "error" : "response",
					flowId,
					method
				}),
				status: responseStatus,
				contentType: responseContentType,
				headersJson: responseHeadersJson,
				errorText: failed ? redactCaptureText(result.error instanceof Error ? result.error.message : String(result.error)) : void 0,
				metaJson: result.status === "captured" ? metaJson : redactedCaptureJson(Object.assign({}, meta, {
					bodyCapture: result.status,
					...failed ? { stage: "response-body" } : {}
				}), runtime.safeJsonString)
			};
			const payload = "buffer" in result ? {
				data: redactCapturePayload(result.buffer),
				contentType: responseContentType
			} : void 0;
			if (completion && requestSettled) requestSettled.then(() => writeCaptureEvent(owner, event, payload, execution)).then(completion.resolve, completion.reject);
			else writeCaptureEvent(owner, event, payload, execution);
		} catch (error) {
			if (completion) completion.reject(error);
			else throw error;
		}
	};
	readCapturedResponseBodyBounded(params.response, owner, recordTerminal, params.signal, asynchronous);
	return completion?.promise;
}
function prepareHttpCaptureForTransport() {
	const owner = resolveCaptureOwnerForTransport(void 0, {}, { asynchronous: true });
	if (!owner) return;
	const admission = owner.admission;
	const ready = observeCaptureWrite(owner, getAsyncCaptureStore(owner).then(() => void 0));
	const reserved = owner.asyncLease !== void 0;
	return (params) => {
		const current = admission.current;
		if (!current) return Promise.resolve();
		if (!reserved) return ready;
		return Promise.resolve(captureInstalledFetch(current, params));
	};
}
//#endregion
export { prepareHttpCaptureForTransport, resolveDebugProxyFetchTransport };
