import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as hasRegisteredSecretValuesForRedaction, o as redactRegisteredSecretValues } from "./secret-redaction-registry-DorVHn0l.mjs";
import { n as registerActiveDebugProxyCapture } from "./runtime-cleanup-CDxMLsqE.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { a as registerSqliteCacheExitClose, t as configureSqliteConnectionPragmas } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { r as withResponseBodyTimeout } from "./http-response-body-timeout-DMIhnjTT.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener, x as retainOpenClawStateDatabaseForIdle } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as migrateSqliteSchemaToStrict } from "./sqlite-strict-CYeSH78z.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { u as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { t as createOpenClawStateWorkerLease } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { r as normalizeRequestInitHeadersForFetch, t as isHeadersLike } from "./fetch-headers-DD03wtQj.mjs";
import { a as resolveEnabledDebugProxySettings } from "./env-BULAE3Xo.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-BJFhktBT.mjs";
import { t as isDebugProxyCaptureDeferred } from "./runtime-deferral-Bdhp4T3g.mjs";
import { n as persistEventPayload, t as DebugProxyCaptureKernel } from "./store.kernel-CNZ9yqI0.mjs";
import fs, { writeSync } from "node:fs";
import { URL as URL$1 } from "node:url";
import { serialize } from "node:v8";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isUtf8 } from "node:buffer";
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
		const versionRow = db.prepare("PRAGMA user_version").get();
		const schemaVersion = Number(versionRow?.user_version ?? 0);
		if (schemaVersion > DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) throw new Error(`Legacy debug proxy capture database uses newer schema version ${schemaVersion}; this build supports ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION}`);
		db.exec(DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL);
		if (schemaVersion < DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION) {
			migrateSqliteSchemaToStrict(db, DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_SQL, { databaseLabel: fileBackedPath ?? dbPath });
			db.exec(`PRAGMA user_version = ${DEBUG_PROXY_CAPTURE_LEGACY_SCHEMA_VERSION};`);
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
/** @deprecated Acquire shared-state storage with acquireDebugProxyCaptureStoreAsync. */
const DebugProxyCaptureStore = DebugProxyCaptureStoreImpl;
const cachedStores = /* @__PURE__ */ new Map();
let unregisterExitClose = null;
function resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir) {
	return typeof optionsOrDbPath === "string" ? `legacy:${optionsOrDbPath}:${legacyBlobDir ?? ""}` : `shared:${openOpenClawStateDatabase({ env: optionsOrDbPath.env }).path}`;
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
	return getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
}
/** @deprecated Await each async capture lease's release instead. */
function closeDebugProxyCaptureStore() {
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
/** @deprecated Use finalizeDebugProxyCaptureAsync to drain asynchronous capture work. */
function finalizeDebugProxyCapture(resolved, deps = {}) {
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
		const lease = createDebugProxyCaptureStoreForContext(context);
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
//#region src/proxy-capture/runtime-fetch-patch.ts
function resolveUrlString(input) {
	if (input instanceof URL) return input.toString();
	if (typeof input === "string") return input;
	if (typeof Request !== "undefined" && input instanceof Request) return input.url;
	return null;
}
function installDebugProxyGlobalFetchPatch(owner, capture, deps = {}) {
	const runtime = resolveRuntimeDeps(deps);
	const sessionAdmission = owner.session.admission;
	const fetchTarget = runtime.fetchTarget;
	if (typeof fetchTarget.fetch !== "function") return;
	if (hasDebugProxyFetchPatch(fetchTarget, sessionAdmission)) return;
	uninstallDebugProxyGlobalFetchPatch(deps);
	const fetchImpl = fetchTarget.fetch;
	const originalFetch = resolveDebugProxyFetchTransport(fetchImpl).bind(fetchTarget);
	const patchedFetch = async (input, init) => {
		const url = resolveUrlString(input);
		const normalizedInit = normalizeRequestInitHeadersForFetch(init);
		const admission = resolveSessionCaptureOwner(sessionAdmission)?.admission;
		const admitted = Boolean(admission?.current);
		const request = typeof Request !== "undefined" && input instanceof Request ? input : void 0;
		const method = normalizedInit?.method ?? request?.method ?? "GET";
		const headers = normalizedInit?.headers ?? request?.headers;
		const body = normalizedInit?.body ?? request?.body ?? null;
		const requestHeaders = admitted && headers ? new Headers(headers) : void 0;
		const requestBody = admitted && Buffer.isBuffer(body) ? Buffer.from(body) : body;
		let response;
		try {
			response = await originalFetch(input, normalizedInit);
		} catch (error) {
			const current = admission?.current;
			if (admitted && current && url && /^https?:/i.test(url)) capture(current, {
				url,
				method,
				error,
				meta: { captureOrigin: "global-fetch" }
			});
			throw error;
		}
		const current = admission?.current;
		if (admitted && current && url && /^https?:/i.test(url)) capture(current, {
			url,
			method,
			requestHeaders,
			requestBody,
			response,
			transport: "http",
			meta: {
				captureOrigin: "global-fetch",
				source: current.settings.sourceProcess
			}
		});
		return response;
	};
	const mockState = fetchImpl.mock;
	if (typeof mockState === "object" && mockState !== null) patchedFetch.mock = mockState;
	registerDebugProxyFetchPatch(fetchTarget, originalFetch, patchedFetch, sessionAdmission);
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
/** @deprecated Use initializeDebugProxyCaptureAsync for worker-backed capture. */
function initializeDebugProxyCapture(mode, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
		initialize: true,
		explicit: resolved !== void 0
	});
	if (!owner) return;
	owner.store.upsertSession({
		id: settings.sessionId,
		startedAt: Date.now(),
		mode,
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		proxyUrl: settings.proxyUrl
	});
	installDebugProxyGlobalFetchPatch(owner, captureInstalledFetch, deps);
}
/** @deprecated Use captureHttpExchangeAsync and await capture finalization at shutdown. */
function captureHttpExchange(params, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 });
	if (owner) captureInstalledFetch(owner, params);
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
function captureOwnedWsEvent(params, owner, execution) {
	const { settings, runtime } = owner;
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL$1(captureUrl);
	return writeCaptureEvent(owner, {
		sessionId: settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		protocol: protocolFromUrl(url),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		host: url.host,
		path: `${url.pathname}${url.search}`,
		closeCode: params.closeCode,
		errorText: params.errorText === void 0 ? void 0 : redactCaptureText(params.errorText),
		metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString)
	}, {
		data: redactCapturePayload(params.payload),
		contentType: "application/json"
	}, execution);
}
/** @deprecated Use captureWsEventAsync and await capture finalization at shutdown. */
function captureWsEvent(params, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 });
	if (owner) captureOwnedWsEvent(params, owner, { asynchronous: false });
}
function runAsyncCapture(resolved, deps, capture) {
	try {
		const settings = resolveEnabledDebugProxySettings(resolved);
		if (!settings) return Promise.resolve();
		const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
			explicit: resolved !== void 0,
			asynchronous: true
		});
		return owner ? Promise.resolve(runOwnedCapture(owner, true, (execution) => capture(owner, execution))) : Promise.resolve();
	} catch (error) {
		const failure = createDeferredCore();
		failure.reject(error);
		failure.promise.catch(() => void 0);
		return failure.promise;
	}
}
function captureWsEventAsync(params, resolved, deps = {}) {
	return runAsyncCapture(resolved, deps, (owner, execution) => captureOwnedWsEvent(params, owner, execution));
}
function captureHttpExchangeAsync(params, resolved, deps = {}) {
	return runAsyncCapture(resolved, deps, (owner, execution) => captureOwnedHttpExchange(params, owner, execution));
}
async function initializeDebugProxyCaptureAsync(mode, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
		initialize: true,
		explicit: resolved !== void 0,
		asynchronous: true
	});
	if (!owner) return;
	owner.maintenanceScope?.assertAdmission();
	const session = {
		id: settings.sessionId,
		startedAt: Date.now(),
		mode,
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		proxyUrl: settings.proxyUrl
	};
	await observeCaptureWrite(owner, runCaptureOperation(owner, (store) => sequenceCaptureWrite(owner, store, () => store.upsertSession(session))));
	if (owner.active) installDebugProxyGlobalFetchPatch(owner, captureInstalledFetch, deps);
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
export { acquireDebugProxyCaptureStoreAsync as _, initializeDebugProxyCapture as a, finalizeDebugProxyCapture as c, reportCapturePersistenceFailure as d, resolveDebugProxyFetchTransport as f, getDebugProxyCaptureStore as g, closeDebugProxyCaptureStore as h, captureWsEventAsync as i, finalizeDebugProxyCaptureAsync as l, acquireDebugProxyCaptureStore as m, captureHttpExchangeAsync as n, initializeDebugProxyCaptureAsync as o, DebugProxyCaptureStore as p, captureWsEvent as r, prepareHttpCaptureForTransport as s, captureHttpExchange as t, isDebugProxyGlobalFetchPatchInstalled as u, redactedCaptureHeaders as v };
