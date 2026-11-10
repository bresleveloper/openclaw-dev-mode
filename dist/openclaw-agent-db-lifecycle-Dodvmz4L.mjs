import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as disposeNodeSqliteDependents } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { y as prepareSqliteDatabaseCleanClose, z as revokeSqliteDatabaseAdmissionsForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as hasSqlitePostCommitScope, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { l as invalidateSqliteSchemaFacts, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { O as releaseAgentCreationClaimHandle, a as matchesAgentDatabaseClose, l as revokeAgentDatabaseResources, r as drainAgentDatabaseResources, u as withAgentDatabaseCloseFence, v as releaseAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { O as createSqliteTerminalOpenLatch } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { o as registerSqliteCacheExitClose } from "./sqlite-wal-D2XTertL.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { t as openSqliteReadOnlyDatabase } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import "./session-key-CSDERtm3.mjs";
import { u as getGatewayShutdownCleanupSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent, r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./openclaw-state-db-BtDOU_3j.mjs";
import { g as releaseOpenClawAgentDatabaseLease, l as hasAgentDatabaseMaintenanceAuthority, p as readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim, r as assertAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { m as invalidateOpenClawAgentDatabaseValidation, s as clearOpenClawAgentDatabaseValidationCache } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { i as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { statSync } from "node:fs";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import { addAbortListener } from "node:events";
//#region src/state/openclaw-agent-db-close.ts
/** Native handle close uses the lifecycle owner's existing leases and validation. */
function createAgentDatabaseHandleCloser(cache) {
	return function closeCachedOpenClawAgentDatabase(database) {
		try {
			var _usingCtx$1 = _usingCtx();
			const lease = cache.leases.get(database.path);
			const alreadyClosed = !database.db.isOpen;
			const priorCheckpointError = database.walMaintenance.health?.state === "error";
			const seal = _usingCtx$1.u(!alreadyClosed ? prepareSqliteDatabaseCleanClose(database.db) : void 0);
			let clean;
			let retainRuntimeProof;
			try {
				if (!alreadyClosed) setSqliteBusyTimeout(database.db, 0);
				disposeNodeSqliteDependents(database.db);
				database.walMaintenance.close({ checkpointMode: "TRUNCATE" });
				const healthy = !cache.failures.has(database.path) && !priorCheckpointError && database.walMaintenance.health?.state !== "error";
				const pathCurrent = !alreadyClosed && healthy && isOpenClawAgentDatabasePathCurrent(database);
				retainRuntimeProof = healthy && (alreadyClosed || pathCurrent);
				if (database.db.isOpen) database.db.close();
				if (pathCurrent) {
					const { canonicalPath } = readOpenClawAgentDatabaseIdentity(database);
					const closedWithEmptyWal = (statSync(`${canonicalPath}-wal`, { throwIfNoEntry: false })?.size ?? 0) === 0;
					if (seal && closedWithEmptyWal) clean = {
						path: database.path,
						publishSeal: seal.publish
					};
				}
			} catch (error) {
				if (lease) {
					invalidateOpenClawAgentDatabaseValidation(database.path);
					revokeSqliteDatabaseAdmissionsForPath(database.path);
				}
				throw error;
			}
			if (lease) {
				releaseOpenClawAgentDatabaseLease(lease.leaseId, {
					env: lease.env,
					initializationAgentPaths: [database.path]
				}, clean ?? (retainRuntimeProof ? "uncheckpointed" : void 0));
				cache.leases.delete(database.path);
			}
			releaseAgentDeletionDatabaseCleanup(database);
			releaseAgentCreationClaimHandle(database);
			cache.idleTimers.get(database.db)?.[Symbol.dispose]();
			cache.idleTimers.delete(database.db);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-db-lifecycle.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
const OPENCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
const cache = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"), () => ({
	databases: /* @__PURE__ */ new Map(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	failures: /* @__PURE__ */ new Map(),
	leases: /* @__PURE__ */ new Map(),
	terminal: createSqliteTerminalOpenLatch({ closeByPath: (pathname) => closeOpenClawAgentDatabaseByPath(pathname) }),
	unregisterExitClose: null,
	pending: /* @__PURE__ */ new Map(),
	activePending: /* @__PURE__ */ new Set(),
	retainedCloses: /* @__PURE__ */ new Set()
}));
const closeCachedOpenClawAgentDatabase = createAgentDatabaseHandleCloser(cache);
function registerAgentDatabaseHandle(database, leaseId, env) {
	cache.leases.set(database.path, {
		leaseId,
		env
	});
	cache.databases.set(database.path, database);
}
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferOpenClawAgentPostCommitPublication(database, publish) {
	if (!hasSqlitePostCommitScope(database.db)) return false;
	if (hasAgentDatabaseMaintenanceAuthority()) {
		assertAgentDatabaseMaintenanceAuthority();
		return false;
	}
	const lease = cache.leases.get(database.path);
	if (cache.databases.get(database.path) !== database || !lease) throw new Error("Agent post-commit publication requires its admitted database owner");
	const options = {
		agentId: database.agentId,
		path: database.path,
		env: { ...lease.env }
	};
	return deferSqlitePostCommitPublication(database.db, () => publish(options));
}
function logResourceCloseFailure(pathname, error) {
	agentDbLog.warn("Agent database resource close failed", {
		path: pathname,
		error
	});
}
function unregisterUnusedAgentDatabaseExitClose() {
	if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
		cache.unregisterExitClose?.();
		cache.unregisterExitClose = null;
	}
}
/** Each physical-open generator owns these checkpoints across any integrity await. */
function startAgentDatabaseOpenTiming(agentId, pathname, admissionMode, diagnostics) {
	const startedAt = performance.now();
	let elapsedMs = 0;
	const phaseDurationsMs = {
		open: 0,
		validation: 0,
		configuration: 0,
		schema: 0,
		registration: 0
	};
	return (phase) => {
		const completedMs = Math.floor(performance.now() - startedAt);
		phaseDurationsMs[phase] = completedMs - elapsedMs;
		elapsedMs = completedMs;
		if (phase === "validation" && diagnostics.integrityGateReason) agentDbLog.info("agent database integrity gate", {
			agentId,
			path: pathname,
			pid: process.pid,
			threadId,
			isMainThread,
			admissionMode,
			...diagnostics
		});
		if (phase === "registration" && elapsedMs >= OPENCLAW_AGENT_DB_SLOW_OPEN_MS) agentDbLog.warn("slow OpenClaw agent database open", {
			agentId,
			elapsedMs,
			path: pathname,
			pid: process.pid,
			threadId,
			isMainThread,
			admissionMode,
			phaseDurationsMs,
			...diagnostics,
			thresholdMs: OPENCLAW_AGENT_DB_SLOW_OPEN_MS
		});
	};
}
function retainFailedAgentDatabaseClose(agentId, pathname, close) {
	const retained = {
		agentId,
		path: pathname,
		close: () => {
			close();
			cache.retainedCloses.delete(retained);
		}
	};
	cache.retainedCloses.add(retained);
	getOpenClawDatabaseMaintenanceScope()?.own(retained, "agent-handles", retained.close);
	cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
}
function revokePendingAgentDatabaseOpen(pathname, expectedAgentId) {
	for (const pending of cache.activePending) if (pending.path === pathname && (expectedAgentId === void 0 || pending.agentId === expectedAgentId)) pending.controller.abort(/* @__PURE__ */ new Error(`Agent database open was revoked: ${pathname}`));
}
function retainAgentDatabase(db) {
	observeOpenClawDatabaseMaintenanceResource(db);
	const borrowers = cache.borrowers.get(db) ?? /* @__PURE__ */ new Set();
	const borrower = {};
	borrowers.add(borrower);
	cache.borrowers.set(db, borrowers);
	return () => {
		if (borrowers.delete(borrower) && borrowers.size === 0) cache.idleTimers.get(db)?.refresh();
	};
}
/** Activity and final borrower release use the same idle or post-grace eviction. */
function refreshAgentDatabaseIdleTimer(database) {
	const existing = cache.idleTimers.get(database.db);
	if (existing) {
		existing.refresh();
		return;
	}
	const cleanupSignal = getGatewayShutdownCleanupSignal();
	const closeIdle = () => {
		if (cache.databases.get(database.path) !== database) {
			cache.idleTimers.get(database.db)?.[Symbol.dispose]();
			cache.idleTimers.delete(database.db);
			return;
		}
		if (database.db.isOpen && cache.borrowers.get(database.db)?.size) return;
		if (database.db.isOpen && database.db.isTransaction) {
			timer.refresh();
			return;
		}
		try {
			closeCachedOpenClawAgentDatabase(database);
			cache.databases.delete(database.path);
			cache.failures.delete(database.path);
			unregisterUnusedAgentDatabaseExitClose();
		} catch (error) {
			logResourceCloseFailure(database.path, error);
			timer.refresh();
		}
	};
	const refresh = () => {
		if (cleanupSignal.aborted) runInDetachedAsyncContext(() => queueMicrotask(closeIdle));
		else timer.refresh();
	};
	const timer = runInDetachedAsyncContext(() => setTimeout(closeIdle, SQLITE_IDLE_HANDLE_TTL_MS));
	const cleanupListener = addAbortListener(cleanupSignal, refresh);
	timer.unref();
	cache.idleTimers.set(database.db, {
		refresh,
		[Symbol.dispose]() {
			clearTimeout(timer);
			cleanupListener[Symbol.dispose]();
		}
	});
}
/** Dispose only this publication; a later admission at the same path is independent. */
async function closeMaintenanceAgentDatabase(database) {
	await database.walMaintenance.stop();
	if (cache.databases.get(database.path) !== database) return;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(database.path);
	cache.failures.delete(database.path);
}
/** A lifecycle scope closes its exact connection and retains its borrow until disposal succeeds. */
function createAgentDatabaseScopeOwnedClose(database, owner) {
	const release = retainAgentDatabase(database.db);
	return async () => {
		if (cache.databases.get(database.path) === database) await closeOpenClawAgentDatabaseByPathAsync(database.path, database.agentId);
		else if (database.db.isOpen) throw new Error(`${owner} lost its database close owner.`);
		release();
	};
}
/** Close one cached agent database identified by its exact resolved pathname. */
function closeOpenClawAgentDatabaseByPath(pathname, expectedAgentId) {
	const resolvedPath = path.resolve(pathname);
	revokeAgentDatabaseResources({
		path: resolvedPath,
		agentId: expectedAgentId
	}, logResourceCloseFailure);
	revokePendingAgentDatabaseOpen(resolvedPath, expectedAgentId);
	for (const retained of cache.retainedCloses) if (retained.path === resolvedPath && (expectedAgentId === void 0 || retained.agentId === expectedAgentId)) retained.close();
	const database = cache.databases.get(resolvedPath);
	if (!database || expectedAgentId !== void 0 && database.agentId !== expectedAgentId) return false;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(resolvedPath);
	cache.failures.delete(resolvedPath);
	unregisterUnusedAgentDatabaseExitClose();
	return true;
}
/** Capture only the exact claim belonging to this admitted Worker connection. */
function readOpenClawAgentDatabaseWorkerLeaseReceipt(pathname) {
	const resolvedPath = path.resolve(pathname);
	const database = cache.databases.get(resolvedPath);
	const lease = cache.leases.get(resolvedPath);
	if (!database?.db.isOpen || !lease || cache.failures.has(resolvedPath)) throw new Error(`Agent database Worker has no admitted lease: ${resolvedPath}`);
	return readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim(lease.leaseId, {
		agentId: database.agentId,
		path: database.path,
		env: lease.env
	});
}
/**
* Converge a terminating worker's cached handle and durable lease without
* turning an already committed worker result into an operation failure.
* Callers own a bounded retry policy and must surface an unsettled result.
*/
function settleOpenClawAgentDatabaseWorkerClose(pathname) {
	const resolvedPath = path.resolve(pathname);
	const errors = [];
	const database = cache.databases.get(resolvedPath);
	if (database) {
		try {
			closeCachedOpenClawAgentDatabase(database);
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
		if (database.db.isOpen) try {
			database.db.close();
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
		if (!database.db.isOpen) {
			cache.idleTimers.get(database.db)?.[Symbol.dispose]();
			cache.idleTimers.delete(database.db);
			cache.databases.delete(resolvedPath);
			cache.failures.delete(resolvedPath);
			unregisterUnusedAgentDatabaseExitClose();
		}
	}
	if (!cache.databases.get(resolvedPath)?.db.isOpen) {
		const lease = cache.leases.get(resolvedPath);
		if (lease) try {
			releaseOpenClawAgentDatabaseLease(lease.leaseId, {
				env: lease.env,
				initializationAgentPaths: [resolvedPath]
			});
			cache.leases.delete(resolvedPath);
		} catch (error) {
			errors.push(error instanceof Error ? error : new Error(String(error)));
		}
	}
	return {
		errors,
		settled: !cache.databases.get(resolvedPath)?.db.isOpen && !cache.leases.has(resolvedPath)
	};
}
/** Commit receipts invalidate every current handle of the captured physical database. */
function invalidateOpenClawAgentWritableProjections(databaseIdentity, invalidate) {
	for (const database of cache.databases.values()) if (findOpenClawAgentDatabaseIdentity(database)?.identity === databaseIdentity) invalidate(database.db);
}
function closeOpenClawAgentDatabases(rootPath) {
	revokeAgentDatabaseResources({ rootPath }, logResourceCloseFailure);
	for (const pathname of cache.pending.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) revokePendingAgentDatabaseOpen(pathname);
	for (const retained of cache.retainedCloses) if (rootPath === void 0 || isPathInside(rootPath, retained.path)) retained.close();
	for (const pathname of cache.databases.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) closeOpenClawAgentDatabaseByPath(pathname);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawAgentDatabaseOpenFailure(pathname, error, generation) {
	const recorded = cache.terminal.record(pathname, error, generation);
	if (recorded) invalidateOpenClawAgentDatabaseValidation(pathname);
	return recorded;
}
/** Release fixture handles and pathname trust before a test root is recreated. */
function closeOpenClawAgentDatabasesForTest(rootPath) {
	closeOpenClawAgentDatabases(rootPath);
	clearOpenClawAgentDatabaseValidationCache(rootPath);
	cache.terminal.clearAll(rootPath);
}
async function drainPendingAgentDatabaseOpens(selection) {
	while (true) {
		const pending = [...cache.activePending].filter((owner) => matchesAgentDatabaseClose(selection, owner));
		if (pending.length === 0) return;
		for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path, selection.agentId);
		await Promise.allSettled(pending.map((owner) => owner.promise));
	}
}
/** Drain native opens before a lifecycle owner releases shared state or removes its root. */
async function closeOpenClawAgentDatabasesAsync(rootPath) {
	const selection = { rootPath };
	await withAgentDatabaseCloseFence(selection, async (resourcePaths) => {
		const nativePaths = new Set([
			...cache.databases.values(),
			...cache.activePending,
			...cache.retainedCloses
		].filter((owner) => matchesAgentDatabaseClose(selection, owner)).map((owner) => owner.path));
		const paths = /* @__PURE__ */ new Set([...nativePaths, ...resourcePaths]);
		const errors = (await Promise.allSettled([...paths].map((pathname) => nativePaths.has(pathname) ? closeOpenClawAgentDatabaseByPathAsync(pathname) : drainAgentDatabaseResources({
			...selection,
			path: pathname
		}, async () => {})))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length > 0) throw new AggregateError(errors, "Agent database close failed");
	});
}
/** Drain the exact retained owner before deletion, quarantine, or file replacement. */
async function closeOpenClawAgentDatabaseByPathAsync(pathname, expectedAgentId) {
	const selection = {
		path: path.resolve(pathname),
		agentId: expectedAgentId
	};
	revokePendingAgentDatabaseOpen(selection.path, expectedAgentId);
	return drainAgentDatabaseResources(selection, async () => {
		await drainPendingAgentDatabaseOpens(selection);
		const database = cache.databases.get(selection.path);
		if (database && (expectedAgentId === void 0 || database.agentId === expectedAgentId)) await database.walMaintenance.stop();
		return closeOpenClawAgentDatabaseByPath(selection.path, expectedAgentId);
	});
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectOpenClawAgentDatabaseOwner(pathname, options) {
	let db;
	try {
		const resolvedPath = path.resolve(pathname);
		const opened = cache.databases.get(resolvedPath);
		if (!options?.revalidateSchema && opened?.db.isOpen && !cache.failures.has(resolvedPath)) {
			runSqliteReadOperationSync(opened.db, () => assertSupportedAgentSchemaVersion(opened.db, pathname));
			refreshAgentDatabaseIdleTimer(opened);
			return {
				status: "owned",
				agentId: opened.agentId
			};
		}
		db = openSqliteReadOnlyDatabase(pathname, { readOnly: true });
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		if (options?.revalidateSchema) invalidateSqliteSchemaFacts(db);
		assertSupportedAgentSchemaVersion(db, pathname);
		const existing = readExistingAgentSchemaMeta(db);
		if (!existing) return { status: "unowned" };
		if (existing.role !== "agent" || !existing.agentId) return { status: "unreadable" };
		return {
			status: "owned",
			agentId: normalizeAgentId(existing.agentId)
		};
	} catch {
		return { status: "unreadable" };
	} finally {
		db?.close();
	}
}
//#endregion
export { retainAgentDatabase as _, closeOpenClawAgentDatabaseByPathAsync as a, settleOpenClawAgentDatabaseWorkerClose as b, closeOpenClawAgentDatabasesForTest as c, inspectOpenClawAgentDatabaseOwner as d, invalidateOpenClawAgentWritableProjections as f, registerAgentDatabaseHandle as g, refreshAgentDatabaseIdleTimer as h, closeOpenClawAgentDatabaseByPath as i, createAgentDatabaseScopeOwnedClose as l, recordOpenClawAgentDatabaseOpenFailure as m, closeCachedOpenClawAgentDatabase as n, closeOpenClawAgentDatabases as o, readOpenClawAgentDatabaseWorkerLeaseReceipt as p, closeMaintenanceAgentDatabase as r, closeOpenClawAgentDatabasesAsync as s, cache as t, deferOpenClawAgentPostCommitPublication as u, retainFailedAgentDatabaseClose as v, startAgentDatabaseOpenTiming as x, revokePendingAgentDatabaseOpen as y };
