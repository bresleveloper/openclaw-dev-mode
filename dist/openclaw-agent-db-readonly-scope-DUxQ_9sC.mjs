import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { o as registerSqliteCacheExitClose } from "./sqlite-wal-D2XTertL.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { i as isOpenClawAgentDatabasePathCurrent, n as createOpenClawAgentDatabaseClaim, r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { n as adoptOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly, i as readOpenClawAgentDatabaseSnapshot, n as openOpenClawAgentDatabaseReadOnly, o as assertAgentDatabaseTerminalOpenAllowed, r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-agent-db-readonly-scope.ts
const readOnlyScope = new AsyncLocalStorage();
const log = createSubsystemLogger("state/agent-db");
const retainedScopes = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReadOnlyScopes"), () => ({
	paths: /* @__PURE__ */ new Map(),
	active: /* @__PURE__ */ new Set()
}));
/** One retained connection, revoked by its caller, database lifecycle, or idle expiry. */
var OpenClawAgentDatabaseReadOnlyScope = class {
	constructor(cached = false) {
		this.cached = cached;
		this.borrowers = 0;
	}
	get hasRetainedConnection() {
		return this.database !== void 0;
	}
	invalidateProjection(databaseIdentity, invalidate) {
		if (this.database && findOpenClawAgentDatabaseIdentity(this.database)?.identity === databaseIdentity) invalidate(this.database.db);
	}
	closeIfIdle() {
		if (this.borrowers === 0 && (!this.database?.db.isOpen || !this.database.db.isTransaction)) this.discardConnection();
	}
	close() {
		clearTimeout(this.idleTimer);
		this.idleTimer = void 0;
		this.database?.close();
		this.database = void 0;
		this.borrowers = 0;
		if (this.target && retainedScopes.paths.get(this.target.path) === this) retainedScopes.paths.delete(this.target.path);
		this.target = void 0;
		this.unregisterResource?.();
		this.unregisterResource = void 0;
		retainedScopes.active.delete(this);
		if (retainedScopes.active.size === 0) {
			retainedScopes.unregisterExit?.();
			retainedScopes.unregisterExit = void 0;
		}
	}
	discardConnection() {
		const target = this.target;
		this.close();
		if (!this.cached) this.target = target;
	}
	touch() {
		if (!this.database) return;
		if (this.idleTimer) {
			this.idleTimer.refresh();
			return;
		}
		this.idleTimer = runInDetachedAsyncContext(() => setTimeout(() => {
			this.idleTimer = void 0;
			try {
				this.closeIfIdle();
			} catch (error) {
				log.warn("Idle agent read-only database cleanup failed", {
					path: this.database?.path,
					error
				});
			} finally {
				this.touch();
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		this.idleTimer.unref();
	}
	run(target, operation) {
		if (this.target?.agentId !== target.agentId || this.target.path !== target.path) this.close();
		this.target = target;
		return readOnlyScope.run(this, operation);
	}
	matches(agentId, pathname) {
		return this.target?.agentId === agentId && this.target.path === pathname;
	}
	acquire(options) {
		const finish = (database) => {
			const requestedAgentId = normalizeAgentId(options.agentId);
			if (database.agentId !== requestedAgentId) throw new Error(`OpenClaw agent database ${database.path} belongs to agent ${database.agentId}; requested agent ${requestedAgentId}.`);
			observeOpenClawDatabaseMaintenanceResource(this.unregisterResource);
			this.touch();
			return {
				found: true,
				database
			};
		};
		if (this.database && !isOpenClawAgentDatabasePathCurrent(this.database)) this.discardConnection();
		if (this.database) assertAgentDatabaseTerminalOpenAllowed(this.database.path);
		if (!this.database) {
			const opened = openOpenClawAgentDatabaseReadOnly(options);
			if (!opened.found) {
				this.discardConnection();
				return opened;
			}
			this.database = opened.database;
			this.target = {
				...this.target,
				agentId: this.database.agentId,
				path: this.database.path
			};
			try {
				this.unregisterResource = registerOpenClawAgentDatabaseSyncResource({
					agentId: this.target.agentId,
					path: this.target.path,
					revoke: () => this.close(),
					close: () => this.close()
				});
				retainedScopes.active.add(this);
				if (this.cached) retainedScopes.paths.set(this.database.path, this);
				retainedScopes.unregisterExit ??= registerSqliteCacheExitClose(() => {
					for (const scope of retainedScopes.active) scope.close();
				});
			} catch (error) {
				this.discardConnection();
				throw error;
			}
		}
		const database = this.database;
		const validation = this.target?.validation;
		if (validation && !adoptOpenClawAgentDatabaseValidation(database, validation)) throw new Error("Session reader validation does not match its current physical owner");
		return finish(database);
	}
	releaseBorrow(database) {
		if (this.database !== database) return;
		this.borrowers--;
		if (this.cached && this.borrowers === 0 && this.database && (!this.database.db.isOpen || this.database.db.isTransaction)) this.discardConnection();
		else this.touch();
	}
	retain(options) {
		const opened = this.database?.db.isOpen && this.database.db.isTransaction ? openOpenClawAgentDatabaseReadOnly(options) : this.acquire(options);
		if (!opened.found) return opened;
		const { database } = opened;
		const shared = database === this.database;
		if (shared) this.borrowers++;
		return {
			found: true,
			database,
			claim: createOpenClawAgentDatabaseClaim(database, () => {
				if (shared) this.releaseBorrow(database);
				else database.close();
			})
		};
	}
	read(operation, options, behavior = {}) {
		if (this.database?.db.isOpen && this.database.db.isTransaction) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
		const opened = this.acquire(options);
		if (!opened.found) return opened;
		const { database } = opened;
		this.borrowers++;
		try {
			return behavior.snapshot ? readOpenClawAgentDatabaseSnapshot(database, operation) : runSqliteReadOperationSync(database.db, () => readOpenClawAgentDatabase(database, operation));
		} catch (error) {
			if (this.cached && this.borrowers === 1) this.discardConnection();
			throw error;
		} finally {
			this.releaseBorrow(database);
		}
	}
};
function cachedScope(options) {
	let scope = retainedScopes.paths.get(options.path);
	if (!scope) {
		scope = new OpenClawAgentDatabaseReadOnlyScope(true);
		scope.run(options, () => {});
		retainedScopes.paths.set(options.path, scope);
	}
	return scope;
}
/** Committed worker receipts invalidate projections on retained readers without running SQL. */
function invalidateOpenClawAgentReadOnlyProjections(databaseIdentity, invalidate) {
	for (const scope of retainedScopes.active) scope.invalidateProjection(databaseIdentity, invalidate);
}
/** Writable admission retires an idle reader before opening the same physical file. */
function closeIdleOpenClawAgentDatabaseReadOnly(pathname) {
	retainedScopes.paths.get(pathname)?.closeIfIdle();
}
function retainCachedOpenClawAgentDatabaseReadOnly(options) {
	return cachedScope(options).retain(options);
}
/** Reuse the caller's matching read scope, or this thread's idle-expiring reader. */
function withScopedOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	if (behavior.allowExtension) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
	const scope = readOnlyScope.getStore();
	return (scope?.matches(options.agentId, options.path) ? scope : cachedScope(options)).read(operation, options, behavior);
}
//#endregion
export { withScopedOpenClawAgentDatabaseReadOnly as a, retainCachedOpenClawAgentDatabaseReadOnly as i, closeIdleOpenClawAgentDatabaseReadOnly as n, invalidateOpenClawAgentReadOnlyProjections as r, OpenClawAgentDatabaseReadOnlyScope as t };
