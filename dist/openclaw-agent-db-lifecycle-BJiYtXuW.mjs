import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { c as registerNodeSqliteDisposeCallback, n as disposeNodeSqliteDependents } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { r as hasSqlitePostCommitScope, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, p as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { k as createSqliteTerminalOpenLatch, v as registerOpenClawStateDatabaseLifecycleListener, x as retainOpenClawStateDatabaseForIdle } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, c as invalidateOpenClawAgentDatabaseValidation, g as findOpenClawAgentDatabaseIdentity, s as hasRevokedOpenClawAgentDatabaseValidation, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as revokeAgentDatabaseResources, i as matchesAgentDatabaseClose, n as drainAgentDatabaseResources } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { n as clearOpenClawAgentIntegrityVerification } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import "./session-key-C09ow4h0.mjs";
import { o as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { r as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { D as releaseAgentCreationClaimHandle, S as releaseAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CDljXcnp.mjs";
import { g as releaseOpenClawAgentDatabaseLease, p as readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { n as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-BJf044De.mjs";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
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
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferOpenClawAgentPostCommitPublication(database, publish) {
	if (!hasSqlitePostCommitScope(database.db)) return false;
	const lease = cache.leases.get(database.path);
	if (cache.databases.get(database.path) !== database || !lease && !cache.incognito.has(database)) throw new Error("Agent post-commit publication requires its admitted database owner");
	const options = {
		agentId: database.agentId,
		path: database.path,
		...lease ? { env: { ...lease.env } } : {}
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
function resolveAgentDatabaseIntegrityGateReason(database, proof) {
	const { verification, validation, integrityRevoked, reuseIntegrity } = proof;
	if (integrityRevoked) return "stale-lease";
	if (hasRevokedOpenClawAgentDatabaseValidation(database.path, validation)) return "revoked";
	if (!reuseIntegrity) return "lease-class";
	return verification?.clean_close === 0 && verification.app_version === VERSION && `${verification.dev}:${verification.ino}` === readOpenClawAgentDatabaseIdentity(database).identity ? "dirty-receipt" : "no-proof";
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
/** Keep live deletion-fence reads warm without creating shared state or preventing explicit close. */
function retainIncognitoSharedState(db, env) {
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	let releaseIdle;
	const unsubscribe = registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind === "opened" && event.database.path === statePath) {
			releaseIdle?.();
			releaseIdle = retainOpenClawStateDatabaseForIdle(event.database);
		}
	});
	registerNodeSqliteDisposeCallback(db, () => {
		unsubscribe();
		releaseIdle?.();
		releaseIdle = void 0;
	});
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
			unregisterUnusedAgentDatabaseExitClose();
		} catch (error) {
			logResourceCloseFailure(database.path, error);
			timer.refresh();
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	cache.idleTimers.set(database.db, timer);
}
/** Dispose only this publication; a later admission at the same path is independent. */
async function closeMaintenanceAgentDatabase(database) {
	await database.walMaintenance.stop();
	if (cache.databases.get(database.path) !== database) return;
	closeCachedOpenClawAgentDatabase(database);
	cache.databases.delete(database.path);
	cache.failures.delete(database.path);
	if (cache.incognito.has(database)) cache.generation += 1;
}
function closeCachedOpenClawAgentDatabase(database, options = {}) {
	const lease = cache.leases.get(database.path);
	const alreadyClosed = !database.db.isOpen;
	const priorCheckpointError = database.walMaintenance.health?.state === "error";
	let clean;
	let retainRuntimeProof;
	try {
		disposeNodeSqliteDependents(database.db);
		if (database.walMaintenance.close(options.eviction ? { checkpointMode: "PASSIVE" } : void 0) && !cache.failures.has(database.path) && isOpenClawAgentDatabasePathCurrent(database)) {
			const { identity } = readOpenClawAgentDatabaseIdentity(database);
			if (typeof identity === "string") clean = {
				path: database.path,
				identity
			};
		}
		retainRuntimeProof = !cache.failures.has(database.path) && (alreadyClosed ? !priorCheckpointError : database.walMaintenance.health?.state === "blocked" && isOpenClawAgentDatabasePathCurrent(database));
		if (database.db.isOpen) database.db.close();
	} catch (error) {
		if (lease) clearOpenClawAgentIntegrityVerification(database.path, lease.env);
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
	unregisterUnusedAgentDatabaseExitClose();
	return true;
}
/** Close and unregister one unambiguous transient agent database by filesystem identity. */
function disposeOpenClawAgentDatabaseByPath(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	for (const pendingPath of cache.pending.keys()) if (isSameOpenClawAgentDatabasePath(pendingPath, resolvedPath)) revokePendingAgentDatabaseOpen(pendingPath);
	for (const retained of cache.retainedCloses) if (isSameOpenClawAgentDatabasePath(retained.path, resolvedPath)) retained.close();
	invalidateOpenClawAgentDatabaseValidation(resolvedPath);
	const matchingDatabases = [...cache.databases.values()].filter((candidate) => isSameOpenClawAgentDatabasePath(candidate.path, resolvedPath));
	if (matchingDatabases.length > 1) return false;
	const database = matchingDatabases[0];
	if (database && cache.incognito.has(database)) return closeOpenClawAgentDatabaseByPath(database.path);
	if (!database) return false;
	try {
		unregisterOpenClawAgentDatabase({
			agentId: database.agentId,
			path: database.path,
			...options.env ? { env: options.env } : {}
		});
	} finally {
		closeOpenClawAgentDatabaseByPath(database.path);
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
/** Close cached agent handles, optionally restricted to one runtime root. */
function closeOpenClawAgentDatabases(rootPath) {
	revokeAgentDatabaseResources({ rootPath }, logResourceCloseFailure);
	for (const pathname of cache.pending.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) revokePendingAgentDatabaseOpen(pathname);
	for (const retained of cache.retainedCloses) if (rootPath === void 0 || isPathInside(rootPath, retained.path)) retained.close();
	for (const pathname of cache.databases.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) closeOpenClawAgentDatabaseByPath(pathname);
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
	for (const owner of cache.activePending) if (rootPath === void 0 || isPathInside(rootPath, owner.path)) revokePendingAgentDatabaseOpen(owner.path);
	await drainAgentDatabaseResources({ rootPath }, async () => {
		await drainPendingAgentDatabaseOpens({ rootPath });
		await Promise.all([...cache.databases.values()].filter((database) => rootPath === void 0 || isPathInside(rootPath, database.path)).map((database) => database.walMaintenance.stop()));
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
		await drainPendingAgentDatabaseOpens(selection);
		const database = cache.databases.get(selection.path);
		if (database && (expectedAgentId === void 0 || database.agentId === expectedAgentId)) await database.walMaintenance.stop();
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
export { settleOpenClawAgentDatabaseWorkerClose as C, revokePendingAgentDatabaseOpen as S, refreshAgentDatabaseIdleTimer as _, closeOpenClawAgentDatabaseByPathAsync as a, retainFailedAgentDatabaseClose as b, deferOpenClawAgentPostCommitPublication as c, inspectOpenClawAgentDatabaseOwner as d, invalidateOpenClawAgentWritableProjections as f, readOpenIncognitoAgentDatabaseGeneration as g, readOpenClawAgentDatabaseWorkerLeaseReceipt as h, closeOpenClawAgentDatabaseByPath as i, disposeOpenClawAgentDatabaseByPath as l, listOpenIncognitoAgentDatabases as m, closeCachedOpenClawAgentDatabase as n, closeOpenClawAgentDatabases as o, isIncognitoOpenClawAgentDatabase as p, closeMaintenanceAgentDatabase as r, closeOpenClawAgentDatabasesAsync as s, cache as t, getOpenIncognitoAgentDatabase as u, resolveAgentDatabaseIntegrityGateReason as v, startAgentDatabaseOpenTiming as w, retainIncognitoSharedState as x, retainAgentDatabase as y };
