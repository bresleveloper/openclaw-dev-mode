import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as registerSecretValueForRedaction, i as redactRegisteredSecretValues } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { m as applyPrivateModeSync } from "./gateway-state-owner-X3EqhtYx.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { C as retainOpenClawStateDatabaseForIdle, b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { o as registerSqliteCacheExitClose, t as configureSqliteConnectionPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as migrateSqliteSchemaToStrict } from "./sqlite-strict-CTENSqnV.mjs";
import { l as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { t as createOpenClawStateWorkerLease } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as isHeadersLike } from "./fetch-headers-DD03wtQj.mjs";
import { i as readDebugProxyChildEndpoint, s as resolveEnabledDebugProxySettings } from "./env-ZuG6CRvK.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-Bf6iJgjr.mjs";
import { t as isDebugProxyCaptureDeferred } from "./runtime-deferral-Bdhp4T3g.mjs";
import { r as encodeDebugProxyPayload } from "./cli-contract-Di9ABGhz.mjs";
import { n as registerActiveDebugProxyCapture } from "./runtime-cleanup-D0hlfpym.mjs";
import { n as persistEventPayload, t as DebugProxyCaptureKernel } from "./store.kernel-CAvEIXov.mjs";
import fs, { writeSync } from "node:fs";
import path from "node:path";
import { serialize } from "node:v8";
import { request } from "node:http";
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
//#region src/proxy-capture/store-lifecycle.ts
const finalizers = /* @__PURE__ */ new WeakMap();
const closed = /* @__PURE__ */ new WeakSet();
function registerCaptureStoreFinalizer(store, finalize) {
	if (closed.has(store)) throw new Error("Capture store is already finalized.");
	let callbacks = finalizers.get(store);
	if (!callbacks) {
		callbacks = /* @__PURE__ */ new Set();
		finalizers.set(store, callbacks);
	}
	return registerListener(callbacks, finalize);
}
function finalizeCaptureStore(store) {
	if (closed.has(store)) return;
	closed.add(store);
	const callbacks = finalizers.get(store);
	finalizers.delete(store);
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
	const callbacks = [...finalizers.get(store) ?? [], ...asyncFinalizers.get(store) ?? []];
	finalizers.delete(store);
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
//#region src/proxy-capture/store.async.ts
async function acquireDebugProxyCaptureStoreAsync(options = {}) {
	const lease = createDebugProxyCaptureStoreForContext(captureOpenClawStateWorkerContext(options));
	await lease.ready;
	return {
		store: lease.store,
		release: lease.release
	};
}
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
	for (const candidate of resolveSqliteDatabaseFilePaths(dbPath)) if (fs.existsSync(candidate)) applyPrivateModeSync(candidate, 384);
}
function openPathBasedDebugProxyCaptureStore(dbPath, blobDir) {
	const fileBackedPath = isInMemoryDatabasePath(dbPath) ? void 0 : dbPath;
	if (fileBackedPath) {
		fs.mkdirSync(path.dirname(fileBackedPath), {
			recursive: true,
			mode: 448
		});
		if (!fs.existsSync(fileBackedPath)) fs.closeSync(fs.openSync(fileBackedPath, "a", 384));
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
/** @deprecated Acquire shared-state storage with acquireDebugProxyCaptureStoreAsync. Final compatibility day: 2026-12-31. */
const DebugProxyCaptureStore = DebugProxyCaptureStoreImpl;
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
function acquireDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-store",
		method: "acquireDebugProxyCaptureStore",
		replacement: "await acquireDebugProxyCaptureStoreAsync() and await lease.release() in finally"
	});
	const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
	const store = getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
	const cached = cachedStores.get(key);
	if (!cached || cached.store !== store) throw new Error("debug proxy capture store cache changed while acquiring a lease");
	cached.leases += 1;
	let released = false;
	return {
		store,
		release: () => {
			if (released) return;
			released = true;
			const current = cachedStores.get(key);
			if (!current || current.store !== store) return;
			current.leases = Math.max(0, current.leases - 1);
			if (current.leases === 0) {
				cachedStores.delete(key);
				current.store.close();
			}
		}
	};
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
function hasDebugProxyFetchPatch(fetchTarget, admission) {
	return fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY]?.admission === admission;
}
/** Keep wrapper identity and its admission together for matching-owner teardown. */
function registerDebugProxyFetchPatch(fetchTarget, originalFetch, patchedFetch, admission) {
	const patch = {
		originalFetch,
		admission
	};
	fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY] = patch;
	globalFetchPatches.set(patchedFetch, patch);
	fetchTarget.fetch = patchedFetch;
}
function uninstallDebugProxyGlobalFetchPatch(deps = {}, admission) {
	const fetchTarget = resolveRuntimeDeps(deps).fetchTarget;
	const state = fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
	if (!state || admission && state.admission !== admission) return;
	fetchTarget.fetch = state.originalFetch;
	delete fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
}
function isDebugProxyGlobalFetchPatchInstalled() {
	return Boolean(globalThis[DEBUG_PROXY_FETCH_PATCH_KEY]);
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
/** A session-wide fetch patch admits the original caller before awaiting transport. */
function resolveSessionCaptureOwner(admission) {
	const session = admission.current;
	if (!session || session.closing) return;
	const owner = resolveCaptureOwnerForTransport(session.settings, session.runtime, {
		explicit: true,
		asynchronous: session.usedAsync
	});
	if (owner && session.usedAsync && !owner.asyncLease) observeCaptureWrite(owner, getAsyncCaptureStore(owner).then(() => void 0));
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
/** @deprecated Use finalizeDebugProxyCaptureAsync to drain asynchronous capture work. Final compatibility day: 2026-12-31. */
function finalizeDebugProxyCapture(resolved, deps = {}) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-runtime",
		method: "finalizeDebugProxyCapture",
		replacement: "await finalizeDebugProxyCaptureAsync()"
	});
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const runtime = resolveRuntimeDeps(deps);
	const session = captureOwners.get(runtime.getStore)?.owners.get(captureOwnerKey(settings));
	if (!session) return;
	const owners = [...session.claims].filter((owner) => !owner.asynchronous);
	session.syncClosed = true;
	if (owners.length === session.claims.size) {
		session.closing = true;
		uninstallDebugProxyGlobalFetchPatch(session.runtime, session.admission);
	}
	const errors = [];
	for (const owner of owners) try {
		finishCaptureOwner(owner);
	} catch (error) {
		errors.push(error);
	}
	try {
		if (owners.length > 0 && runtime.closeStore) runtime.closeStore();
		else for (const store of new Set(owners.map((owner) => owner.syncStore))) store?.close?.();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) throw new AggregateError(errors, "Capture finalization failed.");
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
function finalizeDebugProxyCaptureAsync(resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return Promise.resolve();
	const runtime = resolveRuntimeDeps(deps);
	const session = captureOwners.get(runtime.getStore)?.owners.get(captureOwnerKey(settings));
	if (!session) return Promise.resolve();
	if (session.finishing) return session.finishing;
	session.closing = true;
	uninstallDebugProxyGlobalFetchPatch(session.runtime, session.admission);
	const owners = [...session.claims.values()];
	if (owners.length === 1) return session.finishing = closeCaptureOwnerAsync(owners[0]);
	return session.finishing = Promise.allSettled(owners.map(closeCaptureOwnerAsync)).then((results) => {
		const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length) throw new AggregateError(errors, "Capture finalization failed.");
	});
}
//#endregion
export { acquireDebugProxyCaptureStoreAsync as C, redactedCaptureHeaders as E, safeJsonString as S, REDACTED_CAPTURE_HEADER_VALUE as T, uninstallDebugProxyGlobalFetchPatch as _, isDebugProxyGlobalFetchPatchInstalled as a, closeDebugProxyCaptureStore as b, registerDebugProxyFetchPatch as c, resolveCaptureOwnerForTransport as d, resolveDebugProxyFetchTransport as f, sequenceCaptureWrite as g, runCaptureOperation as h, hasDebugProxyFetchPatch as i, reportCapturePersistenceFailure as l, resolveSessionCaptureOwner as m, finalizeDebugProxyCaptureAsync as n, observeCaptureWrite as o, resolveRuntimeDeps as p, getAsyncCaptureStore as r, recordCaptureEventAsync as s, finalizeDebugProxyCapture as t, resolveCaptureOwner as u, DebugProxyCaptureStore as v, DEBUG_PROXY_CHILD_CAPTURE_PATH as w, getDebugProxyCaptureStore as x, acquireDebugProxyCaptureStore as y };
