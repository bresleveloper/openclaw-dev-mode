import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-BzoPsBh0.mjs";
import { s as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { r as isOpenClawAgentDatabasePathCurrent, t as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { s as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly, n as openOpenClawAgentDatabaseReadOnly, r as readOpenClawAgentDatabase, t as hasOpenClawAgentReadOnlySchema } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
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
		this.closing = false;
	}
	get hasRetainedConnection() {
		return this.database !== void 0;
	}
	closeIfIdle() {
		if (this.borrowers === 0 && (!this.database?.db.isOpen || !this.database.db.isTransaction)) this.discardConnection();
	}
	close() {
		this.closing = true;
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
		this.closing = false;
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
		this.idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
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
		if (this.database && !isOpenClawAgentDatabasePathCurrent(this.database)) this.discardConnection();
		if (!this.database) {
			let opened;
			try {
				opened = openOpenClawAgentDatabaseReadOnly(options);
			} catch (error) {
				this.discardConnection();
				throw error;
			}
			if (!opened.found) {
				this.discardConnection();
				return opened;
			}
			this.database = opened.database;
			this.target = {
				agentId: this.database.agentId,
				path: this.database.path
			};
			try {
				this.unregisterResource = registerOpenClawAgentDatabaseSyncResource({
					...this.target,
					revoke: () => this.close(),
					close: () => this.close()
				});
				enableNodeSqliteKyselyStatementCache(this.database.db);
				retainedScopes.active.add(this);
				if (this.cached) retainedScopes.paths.set(this.database.path, this);
				retainedScopes.unregisterExit ??= registerSqliteCacheExitClose(() => {
					for (const scope of retainedScopes.active) scope.close();
				});
			} catch (error) {
				this.discardConnection();
				throw error;
			}
		} else if (!hasOpenClawAgentReadOnlySchema(this.database)) {
			this.discardConnection();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		const requestedAgentId = normalizeAgentId(options.agentId);
		if (this.database.agentId !== requestedAgentId) throw new Error(`OpenClaw agent database ${this.database.path} belongs to agent ${this.database.agentId}; requested agent ${requestedAgentId}.`);
		observeOpenClawDatabaseMaintenanceResource(this.unregisterResource);
		this.touch();
		return {
			found: true,
			database: this.database
		};
	}
	releaseBorrow(database) {
		if (this.database !== database) return;
		this.borrowers--;
		if (this.cached && this.borrowers === 0 && this.database && (!this.database.db.isOpen || this.database.db.isTransaction)) this.discardConnection();
		else this.touch();
	}
	assertUsable() {
		if (this.closing) throw new Error("Agent read-only database native cleanup is pending");
	}
	retain(options) {
		this.assertUsable();
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
	read(operation, options) {
		this.assertUsable();
		if (this.database?.db.isOpen && this.database.db.isTransaction) return withFreshOpenClawAgentDatabaseReadOnly(operation, options);
		const opened = this.acquire(options);
		if (!opened.found) return opened;
		this.borrowers++;
		try {
			return readOpenClawAgentDatabase(opened.database, operation);
		} catch (error) {
			if (this.cached && this.borrowers === 1) this.discardConnection();
			throw error;
		} finally {
			this.releaseBorrow(opened.database);
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
	return (scope?.matches(options.agentId, options.path) ? scope : cachedScope(options)).read(operation, options);
}
//#endregion
export { withScopedOpenClawAgentDatabaseReadOnly as i, closeIdleOpenClawAgentDatabaseReadOnly as n, retainCachedOpenClawAgentDatabaseReadOnly as r, OpenClawAgentDatabaseReadOnlyScope as t };
