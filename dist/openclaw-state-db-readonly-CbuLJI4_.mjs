import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as throwSqliteLifecycleErrors, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { l as retainSnapshotTempDirectory, t as SqliteSnapshotCleanupError, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { a as prepareSqliteReadOnlyLocationFromOwnedDatabase } from "./sqlite-readonly-location-BpMwSm5l.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, h as hasStateDatabaseSourceExclusion, l as acquireStateDatabaseHandleLease } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as prepareSqliteReadOnlyLocationAsync, r as prepareSqliteReadOnlyLocationSync, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { s as observeOpenClawDatabaseMaintenanceResource, t as StateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { S as retainOpenClawStateDatabaseForIndependentRead, _ as registerOpenClawStateDatabaseAsyncResource, n as borrowOpenClawStateDatabaseForAsyncRead, p as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { n as existingPathOrUndefined, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { a as withOpenClawStateReadOnlyLocation, i as openOpenClawStateReadOnlyLocation, t as assertStateReadSchema } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as createOpenClawStateReadTransport } from "./openclaw-state-read-worker-B9IhoHI7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { lstatSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-read-error.ts
function mapOpenClawStateReadError(mapError, read) {
	const receipt = { phase: "before-read" };
	try {
		const result = read(receipt);
		return mapError ? result.catch((error) => {
			throw mapError(error, receipt.phase);
		}) : result;
	} catch (error) {
		throw mapError ? mapError(error, receipt.phase) : error;
	}
}
function observeReadOutcome(receipt, outcome) {
	if (!outcome) return;
	const admitted = "error" in outcome ? outcome.sourceAdmitted : outcome.value.type === "admit" ? void 0 : outcome.value.sourceAdmitted;
	if (admitted === true) receipt.phase = "read";
	else if (admitted === false && receipt.phase !== "read") receipt.phase = "before-read";
}
//#endregion
//#region src/state/openclaw-state-read-scope.ts
/** Normal drainage and explicit abort retain the selected callback's context. */
function bindRetainedReadScope(scope) {
	const context = scope.work.run(() => AsyncLocalStorage.snapshot());
	return {
		run: (operation) => context(() => runRetainedReadScope(scope, () => scope.work.track(operation))),
		abort: (reason) => context(() => scope.work.beginClose(reason))
	};
}
/** Closing retains custody for accepted readers, but never admits a new reader. */
function assertRetainedReadScopeAdmission(pathname, scopes) {
	if (scopes.some((scope) => scope?.path === pathname && (!scope.active || scope.work.isClosing))) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state read scope is closing or closed; retry the operation in a current scope.");
}
function createRetainedReadScope(pathname, identity, cleanup) {
	let pending;
	let unregister;
	const scope = {
		path: pathname,
		active: true,
		work: new AsyncWorkScope(),
		resources: /* @__PURE__ */ new Set(),
		close() {
			if (!scope.active) return Promise.resolve();
			unregister ??= registerOpenClawStateDatabaseAsyncResource({ async close(current) {
				if (!current || current.key === identity.key || current.canonicalPath === identity.canonicalPath) await scope.close();
			} });
			return pending ??= (async () => {
				await scope.work.drain();
				const settled = await Promise.allSettled([...scope.resources].map((resource) => resource.close()));
				throwSqliteLifecycleErrors(settled.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state read scope drainage failed");
				await cleanup?.();
				scope.active = false;
				unregister?.();
			})().finally(() => {
				pending = void 0;
			});
		}
	};
	return scope;
}
async function runRetainedReadScope(scope, operation) {
	let outcome;
	const errors = [];
	try {
		outcome = { value: await operation() };
	} catch (error) {
		outcome = { error };
		errors.push(error);
	}
	try {
		await scope.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Shared-state read scope and cleanup failed");
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/state/openclaw-state-db-readonly.ts
const artifactPreservingReads = resolveGlobalSingleton(Symbol.for("openclaw.artifactPreservingStateReads"), () => new AsyncLocalStorage());
const disposableStateReads = resolveGlobalSingleton(Symbol.for("openclaw.disposableStateReads"), () => new AsyncLocalStorage());
const stateSnapshotReads = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotReads"), () => new AsyncLocalStorage());
/** Opaque identity for derived facts scoped to these owned private database bytes. */
function getActiveOpenClawStateDatabaseReadSnapshot(options = {}) {
	const current = stateSnapshotReads.getStore();
	return current?.path === resolveReadOnlyPath(options) ? current : void 0;
}
/** Resolve a composite read from one online snapshot without redirecting live writers. */
async function withOpenClawStateDatabaseReadSnapshot(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	const current = stateSnapshotReads.getStore();
	if (current?.active && current.path === pathname || !existingPathOrUndefined(pathname)) return await operation();
	const env = options.env ?? process.env;
	const callerSignal = getAsyncWorkSignal();
	const controller = new AbortController();
	let closeSnapshotWork;
	const run = async () => {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		let admission;
		let prepared;
		try {
			admission = captureOpenClawStateDatabaseReadAdmission(pathname);
			prepared = await prepareSqliteReadOnlyLocation(pathname, {
				preserveSourceArtifacts: isArtifactPreservingStateRead(),
				signal: controller.signal
			});
		} catch (error) {
			throw new Error(`Cannot read shared state for discovery: ${pathname}. Retry after the current state operation completes. ${String(error)}`, { cause: error });
		}
		const releaseSource = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		const snapshot = Object.assign(createRetainedReadScope(pathname, admission.identity, async () => {
			releaseSource();
			let cause;
			try {
				if (await prepared.cleanupAsync()) return;
			} catch (error) {
				cause = error;
			}
			throw new SqliteSnapshotCleanupError(`Shared-state discovery snapshot cleanup failed: ${prepared.cleanupRoot ?? pathname}`, { cause });
		}), {
			location: prepared.location,
			env
		});
		const lifecycle = stateSnapshotReads.run(snapshot, () => bindRetainedReadScope(snapshot));
		closeSnapshotWork = lifecycle.abort;
		const closeFromCaller = () => lifecycle.abort(callerSignal?.reason);
		callerSignal?.addEventListener("abort", closeFromCaller, { once: true });
		if (callerSignal?.aborted) closeFromCaller();
		try {
			return await lifecycle.run(async () => {
				controller.signal.throwIfAborted();
				openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
				admission.assertCurrent();
				return await operation();
			});
		} finally {
			callerSignal?.removeEventListener("abort", closeFromCaller);
		}
	};
	return await retainSnapshotWork(run(), () => {
		controller.abort(/* @__PURE__ */ new Error("Shared-state snapshot admission closed"));
		closeSnapshotWork?.(controller.signal.reason);
	});
}
/** The caller owns this private database and removes its files after the scope closes. */
async function withDisposableOpenClawStateReads(pathname, operation) {
	const resolvedPath = resolveReadOnlyPath({ path: pathname });
	const scope = createRetainedReadScope(resolvedPath, captureOpenClawStateDatabaseReadAdmission(resolvedPath).identity);
	return await runRetainedReadScope(scope, () => disposableStateReads.run([...disposableStateReads.getStore() ?? [], scope], operation));
}
function requiresArtifactPreservingSnapshot(pathname) {
	return isArtifactPreservingStateRead() && !disposableStateReads.getStore()?.some((scope) => scope.active && scope.path === pathname);
}
/** Admission scopes every nested reader without changing normal live-read semantics. */
function withArtifactPreservingStateReads(operation) {
	return artifactPreservingReads.run(true, operation);
}
function isArtifactPreservingStateRead() {
	return artifactPreservingReads.getStore() === true;
}
const synchronousReadSnapshots = resolveGlobalSingleton(Symbol.for("openclaw.synchronousStateReadSnapshots"), () => ({ current: void 0 }));
/** One synchronous metadata operation shares private bytes, never later admission reads. */
function withSynchronousArtifactPreservingStateSnapshot(operation) {
	if (!isArtifactPreservingStateRead() || synchronousReadSnapshots.current) return operation();
	const readers = /* @__PURE__ */ new Map();
	synchronousReadSnapshots.current = readers;
	let result;
	let failed = false;
	let failure;
	const cleanupErrors = [];
	try {
		result = operation();
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot scope must remain synchronous");
	} catch (error) {
		failed = true;
		failure = error;
	} finally {
		synchronousReadSnapshots.current = void 0;
		for (const reader of readers.values()) try {
			if (!reader.close()) cleanupErrors.push(/* @__PURE__ */ new Error("Shared-state metadata snapshot cleanup is incomplete."));
		} catch (error) {
			cleanupErrors.push(error);
		}
		readers.clear();
	}
	if (cleanupErrors.length) throw new AggregateError(failed ? [failure, ...cleanupErrors] : cleanupErrors, "Shared-state metadata snapshot cleanup failed.");
	if (failed) throw failure;
	return result;
}
function resolveReadOnlyPath(options) {
	const pathname = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	assertRetainedReadScopeAdmission(pathname, [stateSnapshotReads.getStore(), ...disposableStateReads.getStore() ?? []]);
	isExistingOpenClawStateSchema(pathname);
	return pathname;
}
function withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname) {
	const snapshot = stateSnapshotReads.getStore();
	if (snapshot?.active && snapshot.path === pathname) {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, snapshot.env);
		return {
			reused: true,
			value: withOpenClawStateReadOnlyLocation(operation, pathname, snapshot.location)
		};
	}
	const opened = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (!opened?.db.isOpen || opened.db.isTransaction) return { reused: false };
	try {
		assertStateReadSchema(opened.db, pathname);
		observeOpenClawDatabaseMaintenanceResource(opened.db);
		return {
			reused: true,
			value: operation(opened)
		};
	} catch (error) {
		openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(opened, error);
		throw error;
	}
}
function withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	const readers = synchronousReadSnapshots.current;
	if (readers && requiresArtifactPreservingSnapshot(pathname)) {
		let opened = readers.get(pathname);
		if (!opened) {
			opened = openOpenClawStateReadOnlyLocation(pathname, prepareSqliteReadOnlyLocationSync(pathname));
			readers.set(pathname, opened);
		}
		assertStateReadSchema(opened.database.db, pathname);
		const result = operation(opened.database);
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot read must remain synchronous");
		return result;
	}
	const prepared = requiresArtifactPreservingSnapshot(pathname) ? prepareSqliteReadOnlyLocationSync(pathname) : void 0;
	return withOpenClawStateReadOnlyLocation(operation, pathname, prepared ?? pathname);
}
/** Read shared state without joining writers; admission inherits artifact preservation. */
function withOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
}
/** A missing pathname is not absence while this read owner can serve retained state. */
function isOpenClawStateDatabaseDefinitelyAbsent(env = process.env) {
	try {
		const pathname = resolveReadOnlyPath({ env });
		const snapshot = stateSnapshotReads.getStore();
		if (synchronousReadSnapshots.current?.has(pathname) || snapshot?.active && snapshot.path === pathname || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname)?.db.isOpen) return false;
		try {
			lstatSync(pathname);
			return false;
		} catch (error) {
			return hasErrnoCode(error, "ENOENT");
		}
	} catch {
		return false;
	}
}
/** Read existing shared state while preserving non-missing filesystem failures. */
function withExistingOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	const existingPath = existingPathOrUndefined(pathname);
	return existingPath === void 0 ? void 0 : withFreshOpenClawStateDatabaseReadOnly(operation, options, existingPath);
}
/** Fixed reads observe committed state unless their owner explicitly selected a snapshot. */
function executeExistingOpenClawStateRead(options, command, { context, current, mapError } = {}) {
	return mapOpenClawStateReadError(mapError, (receipt) => {
		context?.admission.assertCurrent();
		const read = () => {
			const execute = () => executeRetainedOpenClawStateRead(options, command, receipt, context);
			return current ? stateSnapshotReads.exit(execute) : execute();
		};
		const run = () => context ? withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, read) : read();
		return context?.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(run) : run();
	});
}
function executeRetainedOpenClawStateRead(options, command, receipt, capturedContext) {
	const pathname = resolveReadOnlyPath(options);
	const current = stateSnapshotReads.getStore();
	const snapshot = current?.active && current.path === pathname ? current : void 0;
	const scopes = [...snapshot ? [snapshot] : [], ...(disposableStateReads.getStore() ?? []).filter((scope) => scope.active && scope.path === pathname)];
	const env = snapshot?.env ?? options.env;
	const context = capturedContext ?? captureOpenClawStateWorkerContext({
		path: pathname,
		env
	});
	if (capturedContext) {
		if (context.admission.databasePath !== pathname) throw new Error("Shared-state read context does not match its selected source");
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	}
	const excluded = hasStateDatabaseSourceExclusion(pathname);
	const preserveArtifacts = requiresArtifactPreservingSnapshot(pathname);
	const controller = new AbortController();
	const run = async () => {
		const producerSettled = createDeferredCore();
		const transport = createOpenClawStateReadTransport(command);
		let cleanupPending;
		let transportStopped = false;
		let cleaned = false;
		let validated = false;
		const acceptanceErrors = [];
		let borrowed;
		let sourcePin;
		let prepared;
		let expectedIdentity;
		let releasePreparedSource;
		const authority = {
			signal: controller.signal,
			assertCurrent() {
				controller.signal.throwIfAborted();
				context.maintenanceScope?.assertAdmission();
				context.admission.assertCurrent();
				if (excluded && !hasStateDatabaseSourceExclusion(pathname)) throw new Error("Shared-state source read scope is closed");
				borrowed?.assertCurrent();
				if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
				if (scopes.some((scope) => !scope.active)) throw new Error("Shared-state read scope is closed");
				openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
			}
		};
		const cleanup = () => {
			if (cleaned) return Promise.resolve();
			return cleanupPending ??= (async () => {
				if (!transportStopped) {
					await transport.close();
					transportStopped = true;
				}
				await producerSettled.promise;
				if (prepared) {
					releasePreparedSource?.();
					if (!await prepared.cleanupAsync()) throw new Error(`Shared-state read snapshot cleanup failed: ${prepared.cleanupRoot ?? pathname}`);
					prepared = void 0;
				}
				if (!validated) {
					validated = true;
					try {
						authority.assertCurrent();
					} catch (error) {
						acceptanceErrors.push(error);
					}
				}
				const errors = [];
				try {
					sourcePin?.release();
					sourcePin = void 0;
				} catch (error) {
					errors.push(error);
				}
				try {
					borrowed?.release();
					borrowed = void 0;
				} catch (error) {
					errors.push(error);
				}
				throwSqliteLifecycleErrors(errors, "Shared-state read source release failed");
				cleaned = true;
				unregister();
				for (const scope of scopes) scope.resources.delete(resource);
			})().finally(() => {
				cleanupPending = void 0;
			});
		};
		const resource = { async close() {
			controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed"));
			await cleanup();
		} };
		const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === context.admission.identity.key || identity.canonicalPath === context.admission.identity.canonicalPath) await resource.close();
		} });
		context.maintenanceScope?.own(resource, "shared-resources", () => resource.close());
		for (const scope of scopes) scope.resources.add(resource);
		const read = async () => {
			authority.assertCurrent();
			let nativeSource;
			if (!snapshot) {
				if (preserveArtifacts || excluded) {
					const native = borrowOpenClawStateDatabaseForAsyncRead(pathname);
					borrowed = native;
					nativeSource = native?.database;
				} else borrowed = retainOpenClawStateDatabaseForIndependentRead(pathname);
			}
			if (!snapshot && !borrowed && !existingPathOrUndefined(pathname)) return;
			if (excluded) sourcePin = acquireStateDatabaseHandleLease({ databasePath: pathname });
			let location = snapshot?.location ?? pathname;
			if (nativeSource) {
				prepared = excluded ? await prepareSqliteReadOnlyLocationFromOwnedDatabase(nativeSource.db, authority.assertCurrent) : await prepareSqliteReadOnlyLocationFromOwnedDatabase(nativeSource.db, authority.assertCurrent, authority.signal, "async");
				location = prepared.location;
			} else if (!snapshot && (preserveArtifacts || excluded)) {
				await transport.validateFresh(context, authority);
				authority.assertCurrent();
				prepared = await (excluded ? prepareSqliteReadOnlyLocation : prepareSqliteReadOnlyLocationAsync)(pathname, {
					preserveSourceArtifacts: preserveArtifacts,
					signal: authority.signal
				});
				location = prepared.location;
			}
			if (!snapshot && !prepared) expectedIdentity = context.admission.identity.key;
			if (prepared) releasePreparedSource = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
			authority.assertCurrent();
			receipt.phase = "unobserved";
			const outcome = await transport.read({
				context,
				location,
				checkFreshAdmission: !borrowed,
				expectedIdentity,
				snapshotRoot: prepared?.cleanupRoot
			}, authority);
			observeReadOutcome(receipt, outcome);
			const sourceAdmitted = "error" in outcome ? outcome.sourceAdmitted : outcome.value.type !== "admit" && outcome.value.sourceAdmitted;
			try {
				authority.assertCurrent();
				if (sourceAdmitted) borrowed?.observe();
			} catch (error) {
				if (!("error" in outcome)) throw error;
				acceptanceErrors.push(error);
			}
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		};
		const errors = [];
		const cleanupErrors = [];
		let result;
		try {
			result = await read();
		} catch (error) {
			errors.push(error);
		} finally {
			producerSettled.resolve();
		}
		try {
			await cleanup();
		} catch (error) {
			cleanupErrors.push(error);
		}
		errors.push(...[...new Set(acceptanceErrors)].filter((error) => !errors.includes(error)), ...cleanupErrors);
		throwSqliteLifecycleErrors(errors, "Shared-state read and cleanup failed");
		return result;
	};
	const tracked = scopes.reduceRight((operation, scope) => () => scope.work.track(operation), run);
	const maintenance = context.maintenanceScope;
	return retainSnapshotWork(maintenance ? maintenance.run(() => maintenance.track(tracked())) : tracked(), () => controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed")));
}
/** Read existing shared state without creating or updating its SQLite sidecars. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	if (openStateSchemaReadAdmission) return withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options, openStateSchemaReadAdmission);
	return withArtifactPreservingStateReads(() => withExistingOpenClawStateDatabaseReadOnly(operation, options));
}
/** Publication guards need current rows, never an inherited discovery snapshot. */
function withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	const pathname = resolveReadOnlyPath(options);
	return stateSnapshotReads.exit(() => {
		if (!openStateSchemaReadAdmission) {
			const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
			if (reused.reused) return reused.value;
		}
		if (existingPathOrUndefined(pathname) === void 0) return;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
		return withOpenClawStateReadOnlyLocation(operation, pathname, prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	});
}
/** Preserve source artifacts while allowing the caller to progress during snapshot preparation. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(operation, options = {}) {
	return withArtifactPreservingStateReads(async () => {
		const pathname = resolveReadOnlyPath(options);
		const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
		if (reused.reused) return reused.value;
		if (existingPathOrUndefined(pathname) === void 0) return;
		const env = options.env ?? process.env;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		if (!requiresArtifactPreservingSnapshot(pathname)) return withOpenClawStateReadOnlyLocation(operation, pathname, pathname);
		const prepared = await prepareSqliteReadOnlyLocation(pathname, { preserveSourceArtifacts: true });
		try {
			openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		} catch (error) {
			prepared.cleanup();
			throw error;
		}
		return withOpenClawStateReadOnlyLocation(operation, pathname, prepared);
	});
}
//#endregion
export { withArtifactPreservingStateReads as a, withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync as c, withOpenClawStateDatabaseReadOnly as d, withOpenClawStateDatabaseReadSnapshot as f, isOpenClawStateDatabaseDefinitelyAbsent as i, withExistingOpenClawStateDatabaseCurrentReadOnly as l, getActiveOpenClawStateDatabaseReadSnapshot as n, withDisposableOpenClawStateReads as o, withSynchronousArtifactPreservingStateSnapshot as p, isArtifactPreservingStateRead as r, withExistingOpenClawStateDatabaseArtifactPreservingReadOnly as s, executeExistingOpenClawStateRead as t, withExistingOpenClawStateDatabaseReadOnly as u };
