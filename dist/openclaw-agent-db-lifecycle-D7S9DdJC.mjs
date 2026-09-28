import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as disposeNodeSqliteDependents } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-BzoPsBh0.mjs";
import { i as getOpenClawDatabaseMaintenanceScope, s as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { E as createSqliteTerminalOpenLatch } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { r as clearOpenClawAgentIntegrityVerification } from "./openclaw-quarantine-store-BBmdpwTz.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { r as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-B7E3mJp3.mjs";
import "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { T as releaseAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { g as releaseOpenClawAgentDatabaseLease, p as readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { c as revokeAgentDatabaseResources, r as matchesAgentDatabaseClose, t as drainAgentDatabaseResources } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/state/openclaw-agent-db-lifecycle.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
const OPENCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
const cache = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"), () => ({
	databases: /* @__PURE__ */ new Map(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	incognito: /* @__PURE__ */ new WeakSet(),
	generation: 0,
	failures: /* @__PURE__ */ new Map(),
	leases: /* @__PURE__ */ new Map(),
	terminal: createSqliteTerminalOpenLatch({ closeByPath: (pathname) => closeOpenClawAgentDatabaseByPath(pathname) }),
	unregisterExitClose: null,
	pending: /* @__PURE__ */ new Map(),
	activePending: /* @__PURE__ */ new Set(),
	retainedCloses: /* @__PURE__ */ new Set()
}));
/** Runtime reads and opens share the generation-aware process-local damage latch. */
function assertAgentDatabaseTerminalOpenAllowed(pathname) {
	const failure = cache.terminal.get(pathname);
	if (failure) throw failure;
}
function logResourceCloseFailure(pathname, error) {
	agentDbLog.warn("Agent database resource close failed", {
		path: pathname,
		error
	});
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
/** Activity and final borrower release start the same idle window. */
function refreshAgentDatabaseIdleTimer(database) {
	if (cache.incognito.has(database)) return;
	const existing = cache.idleTimers.get(database.db);
	if (existing) {
		existing.refresh();
		return;
	}
	const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		if (cache.databases.get(database.path) !== database) {
			cache.idleTimers.delete(database.db);
			return;
		}
		if (database.db.isOpen && cache.borrowers.get(database.db)?.size) return;
		if (database.db.isOpen && database.db.isTransaction) {
			timer.refresh();
			return;
		}
		try {
			closeCachedOpenClawAgentDatabase(database, { eviction: true });
			cache.databases.delete(database.path);
			cache.failures.delete(database.path);
			if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
				cache.unregisterExitClose?.();
				cache.unregisterExitClose = null;
			}
		} catch (error) {
			logResourceCloseFailure(database.path, error);
			timer.refresh();
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	cache.idleTimers.set(database.db, timer);
}
/** Dispose only this publication; a later admission at the same path is independent. */
function closeMaintenanceAgentDatabase(database) {
	if (cache.databases.get(database.path) !== database) return;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(database.path);
	cache.failures.delete(database.path);
	if (cache.incognito.has(database)) cache.generation += 1;
}
function closeCachedOpenClawAgentDatabase(database, options = {}) {
	const lease = cache.leases.get(database.path);
	let clean;
	try {
		disposeNodeSqliteDependents(database.db);
		if (database.walMaintenance.close(options.eviction ? { checkpointMode: "PASSIVE" } : void 0) && !cache.failures.has(database.path) && isOpenClawAgentDatabasePathCurrent(database)) {
			const { identity } = readOpenClawAgentDatabaseIdentity(database);
			if (typeof identity === "string") clean = {
				path: database.path,
				identity
			};
		}
		if (database.db.isOpen) database.db.close();
	} catch (error) {
		if (lease) clearOpenClawAgentIntegrityVerification(database.path, lease.env);
		throw error;
	}
	if (lease) {
		releaseOpenClawAgentDatabaseLease(lease.leaseId, { env: lease.env }, clean);
		cache.leases.delete(database.path);
	}
	releaseAgentDeletionDatabaseCleanup(database);
	clearTimeout(cache.idleTimers.get(database.db));
	cache.idleTimers.delete(database.db);
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
	const incognito = cache.incognito.has(database);
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(resolvedPath);
	cache.failures.delete(resolvedPath);
	if (incognito) cache.generation += 1;
	if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
		cache.unregisterExitClose?.();
		cache.unregisterExitClose = null;
	}
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
			clearTimeout(cache.idleTimers.get(database.db));
			cache.idleTimers.delete(database.db);
			const incognito = cache.incognito.has(database);
			cache.databases.delete(resolvedPath);
			cache.failures.delete(resolvedPath);
			if (incognito) cache.generation += 1;
			if (cache.databases.size === 0 && cache.retainedCloses.size === 0) {
				cache.unregisterExitClose?.();
				cache.unregisterExitClose = null;
			}
		}
	}
	if (!cache.databases.get(resolvedPath)?.db.isOpen) {
		const lease = cache.leases.get(resolvedPath);
		if (lease) try {
			releaseOpenClawAgentDatabaseLease(lease.leaseId, { env: lease.env });
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
/** Close cached agent handles, optionally restricted to one runtime root. */
function closeOpenClawAgentDatabases(rootPath) {
	revokeAgentDatabaseResources({ rootPath }, logResourceCloseFailure);
	for (const pathname of cache.pending.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) revokePendingAgentDatabaseOpen(pathname);
	for (const retained of cache.retainedCloses) if (rootPath === void 0 || isPathInside(rootPath, retained.path)) retained.close();
	for (const pathname of cache.databases.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) closeOpenClawAgentDatabaseByPath(pathname);
}
/** Drain native opens before a lifecycle owner releases shared state or removes its root. */
async function closeOpenClawAgentDatabasesAsync(rootPath) {
	for (const owner of cache.activePending) if (rootPath === void 0 || isPathInside(rootPath, owner.path)) revokePendingAgentDatabaseOpen(owner.path);
	await drainAgentDatabaseResources({ rootPath }, async () => {
		while (true) {
			const pending = [...cache.activePending].filter((owner) => rootPath === void 0 || isPathInside(rootPath, owner.path));
			if (pending.length === 0) break;
			for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path);
			await Promise.allSettled(pending.map((owner) => owner.promise));
		}
		closeOpenClawAgentDatabases(rootPath);
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
		while (true) {
			const pending = [...cache.activePending].filter((owner) => matchesAgentDatabaseClose(selection, owner));
			if (pending.length === 0) break;
			for (const owner of pending) revokePendingAgentDatabaseOpen(owner.path, expectedAgentId);
			await Promise.allSettled(pending.map((owner) => owner.promise));
		}
		return closeOpenClawAgentDatabaseByPath(selection.path, expectedAgentId);
	});
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectOpenClawAgentDatabaseOwner(pathname) {
	let db;
	try {
		const resolvedPath = path.resolve(pathname);
		const opened = cache.databases.get(resolvedPath);
		if (opened?.db.isOpen && !cache.failures.has(resolvedPath)) {
			assertSupportedAgentSchemaVersion(opened.db, pathname);
			refreshAgentDatabaseIdleTimer(opened);
			return {
				status: "owned",
				agentId: opened.agentId
			};
		}
		db = openNodeSqliteDatabase(pathname, { readOnly: true });
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
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
/** Lists process-held incognito databases without opening new sentinel handles. */
function listOpenIncognitoAgentDatabases() {
	return [...cache.databases.values()].filter((database) => database.db.isOpen && cache.incognito.has(database)).map((database) => ({
		agentId: database.agentId,
		storePath: database.path
	})).toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.storePath.localeCompare(right.storePath));
}
/** Borrow committed process-held facts without opening or querying a private store. */
function getOpenIncognitoAgentDatabase(agentId, pathname) {
	const database = cache.databases.get(path.resolve(pathname));
	return database?.db.isOpen && database.agentId === normalizeAgentId(agentId) && cache.incognito.has(database) ? database : void 0;
}
/** Return the generation of process-held incognito database membership. */
function readOpenIncognitoAgentDatabaseGeneration() {
	return cache.generation;
}
/** Returns whether this exact process-held database is incognito/in-memory. */
function isIncognitoOpenClawAgentDatabase(database) {
	return cache.incognito.has(database);
}
//#endregion
export { retainFailedAgentDatabaseClose as _, closeOpenClawAgentDatabaseByPath as a, startAgentDatabaseOpenTiming as b, closeOpenClawAgentDatabasesAsync as c, isIncognitoOpenClawAgentDatabase as d, listOpenIncognitoAgentDatabases as f, retainAgentDatabase as g, refreshAgentDatabaseIdleTimer as h, closeMaintenanceAgentDatabase as i, getOpenIncognitoAgentDatabase as l, readOpenIncognitoAgentDatabaseGeneration as m, cache as n, closeOpenClawAgentDatabaseByPathAsync as o, readOpenClawAgentDatabaseWorkerLeaseReceipt as p, closeCachedOpenClawAgentDatabase as r, closeOpenClawAgentDatabases as s, assertAgentDatabaseTerminalOpenAllowed as t, inspectOpenClawAgentDatabaseOwner as u, revokePendingAgentDatabaseOpen as v, settleOpenClawAgentDatabaseWorkerClose as y };
