import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { a as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { f as withSqliteInspectionOperation } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError, o as tryAcquireExclusiveSqliteCoordinator, r as ensurePrivateSqliteCoordinatorDirectory, s as tryAcquireSharedSqliteCoordinator, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { realpathSync, statSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/infra/state-database-coordinator-delegate.ts
function createCoordinatorDelegate(identity, live, retained, revoke, label) {
	let channel;
	let revoked = false;
	return {
		get port() {
			if (revoked) throw new SqliteCoordinatorError(`${label} is closed`);
			if (!channel) {
				channel = new MessageChannel();
				channel.port1.postMessage({
					...identity,
					live: live.buffer
				});
				channel.port1.unref();
			}
			return channel.port2;
		},
		get closed() {
			return revoked && retained.closed;
		},
		release() {
			if (!revoked) {
				revoked = true;
				revoke();
				channel?.port1.close();
				channel?.port2.close();
			}
			retained.release();
		}
	};
}
async function attachCoordinatorDelegate(port, identity, label) {
	let closed = false;
	port.once("close", () => {
		closed = true;
	});
	const live = await new Promise((resolve, reject) => {
		const onClose = () => {
			port.off("message", onMessage);
			reject(new SqliteCoordinatorError(`${label} closed before admission`));
		};
		const onMessage = (message) => {
			port.off("message", onMessage);
			port.off("close", onClose);
			if (!isRecord(message) || message.actorId !== identity.actorId || message.coordinatorPath !== identity.coordinatorPath || !(message.live instanceof SharedArrayBuffer) || message.live.byteLength !== Int32Array.BYTES_PER_ELEMENT) {
				port.close();
				reject(new SqliteCoordinatorError(`${label} does not match its actor`));
				return;
			}
			resolve(new Int32Array(message.live));
		};
		port.once("close", onClose);
		port.once("message", onMessage);
		const queued = receiveMessageOnPort(port);
		if (queued) onMessage(queued.message);
	});
	port.unref();
	return {
		assertCurrent() {
			if (closed || Atomics.load(live, 0) !== 1) throw new SqliteCoordinatorError(`${label} is no longer current`);
		},
		close() {
			closed = true;
			port.close();
		}
	};
}
const lifecycleScopes = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseLifecycleDelegateScopes"), () => new AsyncLocalStorage());
function acquireDelegatedLifecycleCoordinator(coordinatorPath) {
	const delegate = lifecycleScopes.getStore()?.get(coordinatorPath);
	if (!delegate) return;
	if (!delegate.active) throw new SqliteCoordinatorError("State lifecycle delegate scope is closed");
	delegate.assertCurrent();
	let closed = false;
	return {
		path: coordinatorPath,
		get closed() {
			return closed;
		},
		release() {
			closed = true;
		}
	};
}
async function attachLifecycleCoordinatorDelegate(port, identity) {
	const delegate = await attachCoordinatorDelegate(port, identity, "State lifecycle delegate");
	return {
		run(operation) {
			const scope = {
				active: true,
				assertCurrent: delegate.assertCurrent
			};
			const scopes = new Map(lifecycleScopes.getStore());
			scopes.set(identity.coordinatorPath, scope);
			const settled = () => {
				scope.active = false;
			};
			try {
				const result = lifecycleScopes.run(scopes, operation);
				if (result instanceof Promise) result.then(settled, settled);
				else settled();
				return result;
			} catch (error) {
				settled();
				throw error;
			}
		},
		close: delegate.close
	};
}
//#endregion
//#region src/infra/state-database-coordinator-errors.ts
const StateDatabaseCoordinatorContentionError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinatorContentionError"), () => class CoordinatorContentionError extends SqliteCoordinatorError {
	constructor(family) {
		super(`another OpenClaw process owns ${family}`);
		this.family = family;
		this.name = "StateDatabaseCoordinatorContentionError";
	}
});
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends SqliteCoordinatorError {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, cause);
		this.name = "StateSchemaMutationConflictError";
	}
});
//#endregion
//#region src/infra/state-database-coordinator-paths.ts
function resolveCoordinatorIdentityPath(pathname) {
	const normalized = path.resolve(pathname);
	try {
		const resolved = path.resolve(realpathSync.native(normalized));
		if (process.platform !== "win32" || resolved === normalized) return resolved;
	} catch {}
	return resolvePathViaExistingAncestorSync(normalized);
}
function resolveLifecycleCoordinatorBase(params) {
	const canonicalDatabasePath = resolveCoordinatorIdentityPath(params.databasePath);
	const canonicalRuntimeDirectory = resolveCoordinatorIdentityPath(params.runtimeDirectory);
	const suffix = params.uid === void 0 ? "openclaw-state-locks" : `openclaw-state-locks-${params.uid}`;
	return {
		directory: path.join(canonicalRuntimeDirectory, suffix),
		databaseHash: sha256HexPrefixCore(canonicalDatabasePath, 8)
	};
}
function buildLifecycleCoordinatorPath(family, base) {
	return path.join(base.directory, `${family}.${base.databaseHash}.lock.sqlite`);
}
function resolveLifecycleCoordinatorPath(family, params) {
	return buildLifecycleCoordinatorPath(family, resolveLifecycleCoordinatorBase(params));
}
//#endregion
//#region src/infra/state-database-coordinator.ts
const { heldCoordinators, sourceReadScopes, canonicalWriteScopes, coordinatorRuntimeDirectories, gatewaySchemaScopes } = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinator"), () => ({
	heldCoordinators: /* @__PURE__ */ new Map(),
	sourceReadScopes: new AsyncLocalStorage(),
	canonicalWriteScopes: new AsyncLocalStorage(),
	coordinatorRuntimeDirectories: new AsyncLocalStorage(),
	gatewaySchemaScopes: new AsyncLocalStorage()
}));
function resolveStateLifecycleRuntimeDirectory() {
	const captured = coordinatorRuntimeDirectories.getStore();
	if (captured !== void 0) return captured.directory;
	return process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks") : "/tmp";
}
/** Capture the directory owner's retention policy before crossing an async or worker boundary. */
function captureStateDatabaseCoordinatorRuntime() {
	const captured = coordinatorRuntimeDirectories.getStore();
	return captured ? { ...captured } : {
		directory: resolveStateLifecycleRuntimeDirectory(),
		keepAlive: true
	};
}
function withStateDatabaseCoordinatorRuntimeDirectory(runtime, operation) {
	const captured = typeof runtime === "string" ? {
		directory: runtime,
		keepAlive: false
	} : { ...runtime };
	return coordinatorRuntimeDirectories.run(captured, operation);
}
function resolveStateDatabaseCoordinatorPath(params) {
	return resolveLifecycleCoordinatorPath("state-lifecycle", params);
}
function acquireLifecycleCoordinator(family, params, { keepAlive = false, gatewayOwner = false } = {}) {
	const coordinatorPath = params.coordinatorPath ?? resolveLifecycleCoordinatorPath(family, {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	if (family === "state-lifecycle") {
		const delegate = acquireDelegatedLifecycleCoordinator(coordinatorPath);
		if (delegate) return delegate;
	}
	let held = heldCoordinators.get(coordinatorPath);
	if (held) {
		if (held.references === 0) throw new SqliteCoordinatorError(`${family} coordinator cleanup is pending; retry its close before reacquiring`);
		held.references += 1;
		held.keepAlive &&= keepAlive;
	} else {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(coordinatorPath), `${family} coordinator`);
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError(family);
		held = {
			coordinator,
			references: 1,
			keepAlive,
			gatewayOwners: 0,
			gatewayDelegates: /* @__PURE__ */ new Set()
		};
		heldCoordinators.set(coordinatorPath, held);
	}
	if (gatewayOwner) held.gatewayOwners += 1;
	const owner = held;
	let relinquished = false;
	let settled = false;
	return {
		path: coordinatorPath,
		get closed() {
			return settled || relinquished && owner.coordinator.closed;
		},
		release: () => {
			if (settled) return;
			if (!relinquished) {
				relinquished = true;
				if (gatewayOwner) {
					owner.gatewayOwners -= 1;
					if (owner.gatewayOwners === 0) for (const delegate of owner.gatewayDelegates) Atomics.store(delegate, 0, 0);
				}
				owner.references -= 1;
			}
			if (owner.references > 0) {
				settled = true;
				return;
			}
			try {
				owner.coordinator.release(owner.keepAlive ? void 0 : { keepAlive: false });
			} catch (error) {
				throw new SqliteCoordinatorError(`failed to release ${family} coordinator`, error);
			} finally {
				if (owner.coordinator.closed) {
					settled = true;
					if (heldCoordinators.get(coordinatorPath) === owner) heldCoordinators.delete(coordinatorPath);
				}
			}
		}
	};
}
function acquireGatewayLifecycleCoordinator(params) {
	return acquireLifecycleCoordinator("gateway-lifecycle", params, { gatewayOwner: true });
}
/** Maintenance lends schema access only to jobs admitted through its lexical resource scope. */
function acquireGatewayMaintenanceCoordinator(params) {
	const lease = acquireLifecycleCoordinator("gateway-lifecycle", params);
	return {
		...lease,
		get closed() {
			return lease.closed;
		},
		createSchemaFenceDelegate(target) {
			if (resolveGatewaySchemaFencePath(target) !== lease.path) return;
			if (lease.closed) throw new SqliteCoordinatorError("Gateway maintenance coordinator is closed");
			const retained = acquireLifecycleCoordinator("gateway-lifecycle", {
				...target,
				coordinatorPath: lease.path
			});
			const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
			Atomics.store(live, 0, 1);
			return createCoordinatorDelegate({
				actorId: target.actorId,
				coordinatorPath: lease.path
			}, live, retained, () => Atomics.store(live, 0, 0), "Gateway maintenance schema delegate");
		}
	};
}
function resolveGatewaySchemaFencePath(params) {
	return resolveLifecycleCoordinatorPath("gateway-lifecycle", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
}
/** Legacy cleanup must exclude new admission without borrowing a process-local owner. */
function tryAcquireGatewayLifecycleCleanupCoordinator(params) {
	const pathname = resolveGatewaySchemaFencePath(params);
	ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "gateway-lifecycle coordinator");
	return tryAcquireExclusiveSqliteCoordinator(pathname, { busyTimeoutMs: 0 });
}
/** True only while this process retains the native Gateway-role coordinator. */
function hasGatewayLifecycleCoordinator(params) {
	return (heldCoordinators.get(resolveGatewaySchemaFencePath(params))?.gatewayOwners ?? 0) > 0;
}
/** The broker owns this pin until backend close acknowledges or worker exit joins. */
function tryCreateGatewaySchemaFenceDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveGatewaySchemaFencePath(params);
	const owner = heldCoordinators.get(coordinatorPath);
	if (!owner || owner.gatewayOwners === 0) return;
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const retained = acquireLifecycleCoordinator("gateway-lifecycle", {
		...params,
		coordinatorPath
	});
	Atomics.store(live, 0, 1);
	owner.gatewayDelegates.add(live);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
		owner.gatewayDelegates.delete(live);
	}, "Gateway schema delegate");
}
/** Install before entering native SQLite; transaction callbacks remain synchronous. */
async function attachGatewaySchemaFenceDelegate(port, params) {
	const coordinatorPath = resolveGatewaySchemaFencePath(params);
	const delegate = await attachCoordinatorDelegate(port, {
		actorId: params.actorId,
		coordinatorPath
	}, "Gateway schema delegate");
	return {
		run(operation) {
			const scope = {
				active: true,
				assertCurrent() {
					try {
						delegate.assertCurrent();
					} catch (error) {
						throw new StateSchemaMutationConflictError(params.databasePath, error);
					}
				}
			};
			const scopes = new Map(gatewaySchemaScopes.getStore());
			scopes.set(coordinatorPath, scope);
			return runWithSqliteCoordinator({ release: () => {
				scope.active = false;
			} }, "Gateway schema delegate scope", () => gatewaySchemaScopes.run(scopes, operation));
		},
		close: delegate.close
	};
}
/** Each broker job retains its parent's physical lifecycle lease through settlement. */
function tryCreateStateLifecycleDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	if (!heldCoordinators.has(coordinatorPath)) return;
	const retained = acquireStateDatabaseCoordinator({ databasePath: params.databasePath });
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	Atomics.store(live, 0, 1);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
	}, "State lifecycle delegate");
}
async function attachStateLifecycleDelegate(port, params) {
	const coordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	return attachLifecycleCoordinatorDelegate(port, {
		actorId: params.actorId,
		coordinatorPath
	});
}
/** Borrow only a coordinator already owned by this process. The returned
* reference must remain held until the participating worker has exited. */
function retainHeldStateDatabaseCoordinator(databasePath) {
	const pathname = resolveStateDatabaseCoordinatorPath({
		databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	return heldCoordinators.has(pathname) ? acquireStateDatabaseCoordinator({
		databasePath,
		busyTimeoutMs: 0
	}) : void 0;
}
const shouldKeepStateCoordinatorAlive = (params) => params.keepAlive !== false && params.coordinatorPath === void 0 && params.runtimeDirectory === void 0 && (coordinatorRuntimeDirectories.getStore()?.keepAlive ?? true);
function acquireStateDatabaseCoordinator(params) {
	const keepAlive = shouldKeepStateCoordinatorAlive(params);
	const base = resolveLifecycleCoordinatorBase({
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const handlesPath = buildLifecycleCoordinatorPath("state-handles", base);
	const writeScope = canonicalWriteScopes.getStore()?.get(handlesPath);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return acquireLifecycleCoordinator("state-lifecycle", params, { keepAlive: shouldKeepStateCoordinatorAlive(params) });
	} else if (heldCoordinators.has(handlesPath)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return acquireLifecycleCoordinator("state-lifecycle", {
		...params,
		coordinatorPath: params.coordinatorPath ?? buildLifecycleCoordinatorPath("state-lifecycle", base)
	}, { keepAlive });
}
/** Fence schema mutation against another process's live Gateway owner. */
function withStateSchemaFence(params, operation) {
	const delegatePath = resolveGatewaySchemaFencePath(params);
	const delegate = gatewaySchemaScopes.getStore()?.get(delegatePath);
	if (delegate) {
		if (!delegate.active) throw new SqliteCoordinatorError("Gateway schema delegate scope is closed");
		delegate.assertCurrent();
		return runWithSqliteCoordinator({ release() {} }, "state schema mutation", operation);
	}
	let coordinator;
	try {
		coordinator = acquireLifecycleCoordinator("gateway-lifecycle", {
			...params,
			coordinatorPath: delegatePath,
			busyTimeoutMs: 0
		});
	} catch (error) {
		if (error instanceof StateDatabaseCoordinatorContentionError) throw new StateSchemaMutationConflictError(params.databasePath, error);
		throw error;
	}
	return runWithSqliteCoordinator(coordinator, "state schema mutation", operation);
}
function resolveStateDatabaseHandleReadContext(params) {
	const pathname = params.coordinatorPath ?? resolveLifecycleCoordinatorPath("state-handles", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const writeScope = canonicalWriteScopes.getStore()?.get(pathname);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return {
			pathname,
			scope: writeScope
		};
	}
	const sourceScope = sourceReadScopes.getStore()?.get(pathname);
	if (sourceScope?.active) {
		sourceScope.assertCurrent();
		return {
			pathname,
			scope: sourceScope
		};
	}
	if (heldCoordinators.has(pathname)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return {
		pathname,
		scope: void 0
	};
}
/** Validate the caller's local authority; the executing copy worker acquires the native lease. */
function assertStateDatabaseSourceReadContext(databasePath) {
	resolveStateDatabaseHandleReadContext({ databasePath });
}
/** A live cached connection excludes file publication, not other cached connections. */
function acquireStateDatabaseHandleLease(params) {
	const { pathname, scope } = resolveStateDatabaseHandleReadContext(params);
	if (scope) return scope.pin();
	return withSqliteInspectionOperation("coordinator", () => {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "state-handles coordinator");
		const coordinator = tryAcquireSharedSqliteCoordinator(pathname, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive: shouldKeepStateCoordinatorAlive(params)
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError("state-handles");
		return coordinator;
	});
}
/** Acquire only after closing local cached owners under the state lifecycle gate. */
function acquireStateDatabaseHandleExclusion(params) {
	const coordinator = acquireLifecycleCoordinator("state-handles", params);
	const owner = heldCoordinators.get(coordinator.path);
	if (!owner || owner.references !== 1) {
		coordinator.release();
		throw new StateDatabaseCoordinatorContentionError("state-handles");
	}
	let released = false;
	const assertCurrent = () => {
		if (released || heldCoordinators.get(coordinator.path) !== owner) throw new SqliteCoordinatorError("SQLite source exclusion is no longer current");
	};
	const pin = () => {
		assertCurrent();
		return acquireLifecycleCoordinator("state-handles", {
			...params,
			coordinatorPath: coordinator.path
		});
	};
	return {
		assertCurrent,
		release() {
			released = true;
			coordinator.release();
		},
		runWithCanonicalWrites(assertAuthority, operation) {
			const retained = pin();
			const scope = {
				active: true,
				assertCurrent: () => {
					assertCurrent();
					assertAuthority();
				},
				pin
			};
			const scopes = new Map(canonicalWriteScopes.getStore());
			scopes.set(coordinator.path, scope);
			try {
				return runWithSqliteCoordinator(retained, "SQLite binding write scope", () => {
					scope.assertCurrent();
					return { result: canonicalWriteScopes.run(scopes, operation) };
				}).result;
			} finally {
				scope.active = false;
			}
		},
		async runWithSourceReads(operation) {
			const retained = pin();
			const scope = {
				active: true,
				assertCurrent,
				pin
			};
			const scopes = new Map(sourceReadScopes.getStore());
			scopes.set(coordinator.path, scope);
			let result;
			try {
				result = await sourceReadScopes.run(scopes, () => operation(assertCurrent));
				assertCurrent();
			} catch (error) {
				scope.active = false;
				try {
					retained.release();
				} catch (releaseError) {
					throw createSqliteLifecycleAggregateError([error, releaseError], "SQLite excluded read and release both failed", error);
				}
				throw error;
			}
			scope.active = false;
			retained.release();
			return result;
		}
	};
}
function resolveSourceScopePath(databasePath) {
	return resolveLifecycleCoordinatorPath("state-handles", {
		databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
}
/** Only a live process-local exclusion owner may copy its already-drained source. */
function hasStateDatabaseSourceExclusion(databasePath) {
	const pathname = resolveSourceScopePath(databasePath);
	const scope = sourceReadScopes.getStore()?.get(pathname);
	if (!scope?.active) return false;
	scope.assertCurrent();
	return true;
}
/** Capture this exact excluded read interval before asynchronous preparation. */
function prepareStateDatabaseSourceExclusion(databasePath) {
	const pathname = resolveSourceScopePath(databasePath);
	const scope = sourceReadScopes.getStore()?.get(pathname);
	if (!scope) return;
	const assertCurrent = () => {
		if (!scope.active || sourceReadScopes.getStore()?.get(pathname) !== scope) throw new SqliteCoordinatorError("SQLite excluded read scope is closed or no longer current");
		scope.assertCurrent();
	};
	assertCurrent();
	return assertCurrent;
}
//#endregion
//#region src/infra/sqlite-source-handle.ts
const unclosedSourceReads = /* @__PURE__ */ new Set();
function withSqliteSourceHandle(pathname, operation) {
	return runWithSqliteCoordinator(acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}), "SQLite source read", operation);
}
function withSqliteSourceReadDatabase(pathname, inspectionOperation, operation, mode) {
	const immutable = mode === "immutable";
	const lease = (immutable ? acquireStateDatabaseHandleExclusion : acquireStateDatabaseHandleLease)({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	let database;
	try {
		const before = immutable ? statSync(pathname, { bigint: true }) : void 0;
		const hasSidecars = () => [
			"-wal",
			"-shm",
			"-journal"
		].some((suffix) => statSync(pathname + suffix, { throwIfNoEntry: false }) !== void 0);
		const unchanged = () => {
			const current = statSync(pathname, { bigint: true });
			return before?.isFile() && current.dev === before.dev && current.ino === before.ino && current.ctimeNs === before.ctimeNs && current.mtimeNs === before.mtimeNs && current.size === before.size && !hasSidecars();
		};
		if (immutable && hasSidecars()) return;
		database = withSqliteInspectionOperation(inspectionOperation, () => openNodeSqliteDatabase(immutable ? resolveImmutableSqliteFileUri(pathname) : pathname, { readOnly: true }));
		if (immutable && !unchanged()) return;
		const result = operation(database);
		return immutable && !unchanged() ? void 0 : result;
	} finally {
		try {
			database?.close();
		} finally {
			if (!database?.isOpen) lease.release();
			else unclosedSourceReads.add({
				database,
				lease
			});
		}
	}
}
/** The executing source-copy child holds its own lease, including after parent loss. */
async function withSqliteSourceHandleAsync(pathname, operation) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	let result;
	try {
		result = await operation();
	} catch (error) {
		try {
			lease.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([error, releaseError], "SQLite source read and handle release both failed", error);
		}
		throw error;
	}
	lease.release();
	return result;
}
/** Revalidate every caller before it can join process-global snapshot work. */
function assertSqliteSourceReadAllowed(pathname) {
	acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}).release();
}
//#endregion
export { withStateDatabaseCoordinatorRuntimeDirectory as C, StateSchemaMutationConflictError as E, tryCreateStateLifecycleDelegate as S, StateDatabaseCoordinatorContentionError as T, resolveStateDatabaseCoordinatorPath as _, acquireGatewayLifecycleCoordinator as a, tryAcquireGatewayLifecycleCleanupCoordinator as b, acquireStateDatabaseHandleExclusion as c, attachGatewaySchemaFenceDelegate as d, attachStateLifecycleDelegate as f, prepareStateDatabaseSourceExclusion as g, hasStateDatabaseSourceExclusion as h, withSqliteSourceReadDatabase as i, acquireStateDatabaseHandleLease as l, hasGatewayLifecycleCoordinator as m, withSqliteSourceHandle as n, acquireGatewayMaintenanceCoordinator as o, captureStateDatabaseCoordinatorRuntime as p, withSqliteSourceHandleAsync as r, acquireStateDatabaseCoordinator as s, assertSqliteSourceReadAllowed as t, assertStateDatabaseSourceReadContext as u, resolveStateLifecycleRuntimeDirectory as v, withStateSchemaFence as w, tryCreateGatewaySchemaFenceDelegate as x, retainHeldStateDatabaseCoordinator as y };
