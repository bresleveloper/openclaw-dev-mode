import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import "./kysely-sync-Bn6Qrpbz.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { c as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { a as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { a as registerSqliteCacheExitClose, c as registerSqliteWalWriteAdmission, l as createSqliteWalReclamationResult, n as configureSqlitePreSchemaPragmas, s as registerDeferredSqliteWalWriteAdmission, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BzoPsBh0.mjs";
import { i as getOpenClawDatabaseMaintenanceScope, s as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { a as isTerminalSqliteIntegrityError, i as confirmSqliteFileIntegrity, o as runSqliteIntegrityCheckSync, s as runSqliteIntegrityOperationSync } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as clearOpenClawDatabaseQuarantine, s as readOpenClawDatabaseQuarantineFailure } from "./openclaw-quarantine-store-BBmdpwTz.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { r as quarantineOrphanedSqliteSidecars } from "./sqlite-files-eRv24eIu.mjs";
import { a as resolveOpenClawAgentSqlitePath, n as assertIncognitoAgentDatabasePathAvailable, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { a as registerOpenClawAgentDatabaseIdentity, i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-B7E3mJp3.mjs";
import "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-BFwcs62N.mjs";
import { C as getAgentDeletionDatabaseCleanup, b as assertAgentDeletionCleanupAliases, o as readAgentDeletionJournal, w as registerAgentDeletionDatabaseCleanup, x as assertAgentDeletionDatabaseCleanupAccess } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { a as ensureAgentSchema, g as withSqliteIntegrityWorkerScope, h as assertSqliteIntegrityInWorker, i as agentDatabaseIntegrityBeforeMutationSteps, m as ensureOpenClawAgentDatabasePermissions } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases, c as claimOpenClawAgentDatabaseLease, g as releaseOpenClawAgentDatabaseLease, l as hasAgentDatabaseMaintenanceAuthority, m as recordOpenClawAgentDatabaseIntegrityVerified, s as assertOpenClawAgentDatabaseLease, t as AGENT_DATABASE_MAINTENANCE_LEASE, v as runWithAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { i as matchesAgentDatabaseReadCandidatePath } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { _ as retainFailedAgentDatabaseClose, a as closeOpenClawAgentDatabaseByPath, b as startAgentDatabaseOpenTiming, c as closeOpenClawAgentDatabasesAsync, g as retainAgentDatabase, h as refreshAgentDatabaseIdleTimer, i as closeMaintenanceAgentDatabase, n as cache, o as closeOpenClawAgentDatabaseByPathAsync, r as closeCachedOpenClawAgentDatabase, s as closeOpenClawAgentDatabases, t as assertAgentDatabaseTerminalOpenAllowed, v as revokePendingAgentDatabaseOpen } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { n as closeIdleOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-BIEwBWBt.mjs";
import { i as getOpenClawAgentDatabaseValidation, r as clearOpenClawAgentDatabaseValidationCache, s as invalidateOpenClawAgentDatabaseValidation, t as adoptOpenClawAgentDatabaseValidation, u as setOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-BQ1Mko2o.mjs";
import { a as unregisterOpenClawAgentDatabase, i as registerOpenClawAgentDatabase, r as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-Ju-BQfY7.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isMainThread } from "node:worker_threads";
//#region src/state/openclaw-agent-db-admission.ts
/** Refusal must unwind ownership without entering corruption repair or changing its caller error. */
function assertAgentDatabaseOpenAuthority(operation, assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		const refusal = new Error("Agent database open authority was refused", { cause: error });
		try {
			operation.throw(refusal);
		} catch (cleanupError) {
			if (cleanupError !== refusal) throw new AggregateError([error, cleanupError], `Agent database authority and cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`, { cause: cleanupError });
		}
		throw error;
	}
}
function assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent) {
	pending.controller.signal.throwIfAborted();
	assertAgentDatabaseAdmitted(database.agentId, { env: options.env });
	if (cache.databases.get(pending.path) !== database || !database.db.isOpen) throw new Error(`Agent database closed before its admitted operation: ${pending.path}`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	assertCurrent?.();
}
/** Bind both admission drivers to the canonical private database-open generator. */
function createOpenClawAgentDatabaseAdmissionOwner(openSteps) {
	/** The initiating caller guards its physical open; each coalesced caller guards its own operation. */
	function withOpenClawAgentDatabaseAsync(inputOptions, operation, assertCurrent) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	function runAgentDatabaseAsync(inputOptions, operation, assertCurrent) {
		try {
			assertCurrent?.();
		} catch (error) {
			return Promise.reject(error);
		}
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...options,
			agentId
		});
		const existing = cache.pending.get(pathname);
		if (existing?.agentId !== void 0 && existing.agentId !== agentId) return Promise.reject(/* @__PURE__ */ new Error(`Agent database ${pathname} is opening for ${existing.agentId}`));
		if (existing?.controller.signal.aborted) return existing.promise.then(() => withOpenClawAgentDatabaseAsync(options, operation, assertCurrent), () => withOpenClawAgentDatabaseAsync(options, operation, assertCurrent));
		const pending = existing ?? startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent);
		pending.operations += 1;
		return pending.promise.then((database) => {
			assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent);
			observeOpenClawDatabaseMaintenanceResource(database.db);
			return operation(database);
		}).finally(() => {
			pending.operations -= 1;
			if (!pending.operations) pending.releaseBorrow?.();
		});
	}
	/** Run on a Worker to keep its same-connection integrity check outside the parent writer. */
	function withOpenClawAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const run = () => runAgentDatabaseAdmission(inputOptions, withAdmission, operation);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(() => scope.track(run())) : run();
	}
	async function runAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...options,
			agentId
		});
		const existing = cache.pending.get(pathname);
		if (existing) {
			if (existing.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${existing.agentId}`);
			try {
				await existing.promise;
			} catch (error) {
				if (!existing.controller.signal.aborted) throw error;
			}
			return withOpenClawAgentDatabaseAdmission(options, withAdmission, operation);
		}
		const admission = createOpenClawAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		pending.promise.catch(() => {});
		pending.operations += 1;
		const steps = openSteps(options, pending);
		let check;
		let failure;
		let suspended = false;
		try {
			while (true) {
				const outcome = await withAdmission(async (assertCurrent, validation) => {
					try {
						assertCurrent();
						assertOpenClawAgentDatabaseAdmissionCurrent(options, pending, check?.database);
					} catch (error) {
						failure = { error: new Error(error instanceof Error ? error.message : String(error), { cause: error }) };
					}
					pending.validation = validation;
					suspended = false;
					const step = failure ? steps.throw(failure.error) : steps.next();
					if (!step.done) {
						suspended = true;
						return {
							done: false,
							check: step.value
						};
					}
					pending.releaseBorrow = retainAgentDatabase(step.value.db);
					admission.complete(step.value);
					const assertOperationCurrent = () => assertAgentDatabaseOperationCurrent(step.value, options, pending, assertCurrent);
					assertOperationCurrent();
					const flushMaintenance = isMainThread ? void 0 : registerDeferredSqliteWalWriteAdmission(step.value.db);
					flushMaintenance?.(assertOperationCurrent);
					const result = await operation(step.value);
					flushMaintenance?.(assertOperationCurrent);
					return {
						done: true,
						result
					};
				});
				if (outcome.done) return outcome.result;
				check = outcome.check;
				failure = void 0;
				try {
					pending.controller.signal.throwIfAborted();
					runSqliteIntegrityCheckSync(check);
				} catch (error) {
					failure = { error };
				}
			}
		} catch (error) {
			const failures = [error];
			if (suspended) {
				const cancellation = new Error(`Agent database admission failed: ${pathname}`, { cause: error });
				try {
					steps.throw(cancellation);
				} catch (cleanupError) {
					if (cleanupError !== cancellation) failures.push(cleanupError);
				}
			}
			const terminalFailure = failures.length === 1 ? error : new AggregateError(failures, "Agent database admission and cleanup failed", { cause: error });
			admission.fail(terminalFailure);
			throw terminalFailure;
		} finally {
			pending.operations -= 1;
			if (!pending.operations) pending.releaseBorrow?.();
		}
	}
	function createOpenClawAgentDatabaseAdmission(agentId, pathname) {
		const completion = createDeferredCore();
		const pending = {
			agentId,
			path: pathname,
			controller: new AbortController(),
			promise: completion.promise,
			operations: 0
		};
		cache.pending.set(pathname, pending);
		cache.activePending.add(pending);
		const retire = () => {
			if (cache.pending.get(pathname) === pending) cache.pending.delete(pathname);
			cache.activePending.delete(pending);
		};
		return {
			pending,
			complete: (database) => {
				retire();
				if (pending.controller.signal.aborted || cache.databases.get(pathname) !== database || !database.db.isOpen) {
					const error = pending.controller.signal.reason ?? /* @__PURE__ */ new Error(`Agent database closed before admission completed: ${pathname}`);
					completion.reject(error);
					throw error;
				}
				completion.resolve(database);
			},
			fail: (error) => {
				retire();
				completion.reject(error);
			}
		};
	}
	function assertOpenClawAgentDatabaseAdmissionCurrent(options, pending, database) {
		const pathname = pending.path;
		pending.controller.signal.throwIfAborted();
		assertAgentDatabaseAdmitted(pending.agentId, { env: options.env });
		if (cache.pending.get(pathname) !== pending) throw new Error(`Agent database open was replaced: ${pathname}`);
		getAgentDeletionDatabaseCleanup(options)?.assertCurrent();
		pending.assertHeld?.();
		if (database) {
			assertSupportedAgentSchemaVersion(database, pathname);
			assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(database), pending.agentId, pathname);
		}
	}
	function startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent) {
		const admission = createOpenClawAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		const operation = openSteps(options, pending);
		(async () => {
			assertAgentDatabaseOpenAuthority(operation, assertCurrent);
			let step = operation.next();
			while (!step.done) {
				const database = step.value.database;
				let failure;
				let failed = false;
				try {
					await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, pending.controller.signal, void 0, step.value.timing);
				} catch (error) {
					failure = error;
					failed = true;
				}
				assertAgentDatabaseOpenAuthority(operation, () => {
					assertOpenClawAgentDatabaseAdmissionCurrent(options, pending, database);
					assertCurrent?.();
				});
				step = failed ? operation.throw(failure) : operation.next();
			}
			pending.releaseBorrow = retainAgentDatabase(step.value.db);
			return step.value;
		})().then(admission.complete, admission.fail).catch(admission.fail);
		return pending;
	}
	return {
		withOpenClawAgentDatabaseAsync,
		withOpenClawAgentDatabaseAdmission
	};
}
//#endregion
//#region src/state/openclaw-agent-db-maintenance-lease.ts
const activeMaintenance = new AsyncLocalStorage();
async function runMaintenanceScope(databasePath, owner, run, ancestors = []) {
	const scope = {
		databasePath,
		owner,
		ancestors,
		active: true,
		accepting: true,
		pending: [],
		ownership: ancestors[0]?.ownership ?? {}
	};
	const assertCurrent = () => {
		if (!scope.active || ancestors.some((parent) => !parent.active)) throw new Error("Agent database maintenance scope is closed");
		if (scope.ownership.failure) throw scope.ownership.failure.error;
		try {
			owner.assertOwned();
		} catch (error) {
			scope.ownership.failure = { error };
			throw error;
		}
	};
	const assertAdmission = () => {
		assertCurrent();
		if (!scope.accepting) throw new Error("Agent database maintenance admission is closed");
	};
	const track = (operation) => {
		scope.pending.push(operation);
		operation.catch(() => void 0);
		return operation;
	};
	const lease = {
		signal: owner.signal,
		assertOwned: assertCurrent,
		assertOwnedInTransaction(database) {
			assertCurrent();
			owner.assertOwnedInTransaction(database);
		},
		...owner.renew ? { renew() {
			assertAdmission();
			owner.renew();
		} } : {},
		...owner.withDatabaseFileExclusion ? { withDatabaseFileExclusion(operation, bind) {
			assertAdmission();
			return track(owner.withDatabaseFileExclusion(operation, bind));
		} } : {}
	};
	try {
		return await withSqliteIntegrityWorkerScope(assertCurrent, () => activeMaintenance.run(scope, () => runWithAgentDatabaseMaintenanceAuthority(lease, databasePath, async () => {
			let outcome;
			try {
				assertCurrent();
				outcome = { value: await run(lease) };
			} catch (error) {
				outcome = { error };
			}
			scope.accepting = false;
			const errors = "error" in outcome ? [outcome.error] : [];
			let joined = 0;
			while (joined < scope.pending.length) {
				const admitted = scope.pending.slice(joined);
				joined += admitted.length;
				for (const result of await Promise.allSettled(admitted)) if (result.status === "rejected" && !errors.includes(result.reason)) errors.push(result.reason);
			}
			try {
				assertCurrent();
			} catch (error) {
				if (!errors.includes(error)) errors.push(error);
			}
			if (errors.length > 1) throw new AggregateError(errors, "Agent maintenance and nested work failed", { cause: errors[0] });
			if (errors.length === 1) throw errors[0];
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		})));
	} finally {
		scope.active = false;
	}
}
/** Retain one real lease through nested Doctor work; serialized selectors grant no authority. */
function withAgentDatabaseMaintenanceLease(options, run) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	const active = activeMaintenance.getStore();
	if (active) {
		if (!active.active || !active.accepting) return Promise.reject(/* @__PURE__ */ new Error("Agent database maintenance admission is closed"));
		if (active.databasePath !== databasePath) return Promise.reject(/* @__PURE__ */ new Error("Nested agent maintenance cannot switch its state database"));
		const admitted = runMaintenanceScope(databasePath, active.owner, run, [...active.ancestors, active]);
		active.pending.push(admitted);
		admitted.catch(() => void 0);
		return admitted;
	}
	return withOpenClawStateLease({
		...AGENT_DATABASE_MAINTENANCE_LEASE,
		database: {
			scope: "shared",
			options,
			schemaPolicy: options.schemaPolicy
		},
		leaseMs: options.leaseMs ?? 6e4,
		waitMs: 5e3,
		prepareDatabase: true,
		heartbeat: "worker",
		leaseLabel: "agent database maintenance lease",
		operationLabel: "agent.database.maintenance.lease"
	}, (maintenance) => runMaintenanceScope(databasePath, maintenance, async (lease) => {
		await closeOpenClawAgentDatabasesAsync();
		assertNoOpenClawAgentDatabaseLeases(lease, options);
		clearOpenClawAgentDatabaseValidationCache();
		return run(lease);
	}));
}
//#endregion
//#region src/state/openclaw-agent-db.ts
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmOpenClawAgentDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	await closeOpenClawAgentDatabaseByPathAsync(resolvedPath);
	invalidateOpenClawAgentDatabaseValidation(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawAgentDatabaseOpenFailure(pathname, error, generation) {
	const recorded = cache.terminal.record(pathname, error, generation);
	if (recorded) invalidateOpenClawAgentDatabaseValidation(pathname);
	return recorded;
}
/**
* Clear a terminal open failure after doctor rewrites the database file.
* Returns false when the persisted quarantine row survived; callers must
* surface that, or the next open re-quarantines the repaired file.
*/
function clearOpenClawAgentDatabaseOpenFailure(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	const cleared = clearOpenClawDatabaseQuarantine(resolvedPath, { env: options.env });
	cache.terminal.clear(resolvedPath);
	return cleared;
}
/** Open or return a cached per-agent database after schema and owner validation. */
function openOpenClawAgentDatabase(options, preparedLease, onRegistrationCommitted) {
	const run = () => runSqliteIntegrityOperationSync(openOpenClawAgentDatabaseSteps(options, void 0, preparedLease, onRegistrationCommitted));
	const scope = getOpenClawDatabaseMaintenanceScope();
	return scope ? scope.run(run) : run();
}
const { withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseAdmission } = createOpenClawAgentDatabaseAdmissionOwner(openOpenClawAgentDatabaseSteps);
function* openOpenClawAgentDatabaseSteps(options, pending, preparedLease, onRegistrationCommitted) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	getAgentDeletionDatabaseCleanup(databaseOptions)?.assertCurrent();
	const incognito = isIncognitoOpenClawAgentSqlitePath(pathname, databaseOptions);
	const opened = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (opened) {
		if (preparedLease) throw new Error("A prepared Worker lease cannot adopt an existing agent database handle");
		return opened;
	}
	if (!pending) revokePendingAgentDatabaseOpen(pathname);
	const cached = cache.databases.get(pathname);
	const allowExtension = !process.permission && supportsNodeSqliteExtensionLoading();
	if (incognito) {
		assertIncognitoAgentDatabasePathAvailable(pathname);
		if (cached) {
			closeCachedOpenClawAgentDatabase(cached);
			cache.databases.delete(pathname);
			cache.failures.delete(pathname);
		}
		const db = openNodeSqliteDatabase(":memory:", { allowExtension });
		db.enableLoadExtension(false);
		configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
		const walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: `openclaw-agent-incognito:${agentId}`,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		ensureAgentSchema(db, agentId, pathname);
		registerOpenClawAgentDatabaseIdentity(db);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		cache.incognito.add(database);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		cache.databases.set(pathname, database);
		cache.generation += 1;
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		return database;
	}
	quarantineOrphanedSqliteSidecars(pathname);
	assertAgentDatabaseTerminalOpenAllowed(pathname);
	const persistedFailure = readOpenClawDatabaseQuarantineFailure("agent", pathname, { env: databaseOptions.env });
	if (persistedFailure) {
		recordOpenClawAgentDatabaseOpenFailure(pathname, persistedFailure);
		throw persistedFailure;
	}
	if (cached) {
		closeCachedOpenClawAgentDatabase(cached);
		cache.databases.delete(pathname);
		cache.failures.delete(pathname);
	}
	const leaseEnvironment = {
		OPENCLAW_STATE_DIR: resolveStateDir(options.env ?? process.env),
		...isGatewayExternallySupervised(options.env ?? process.env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	if (preparedLease && (preparedLease.receipt.agentId !== agentId || preparedLease.receipt.path !== pathname)) throw new Error("Prepared agent database lease belongs to another store");
	let verification;
	let hasLiveLease = false;
	const captureVerification = (record, liveLease) => {
		verification = record;
		hasLiveLease = liveLease;
	};
	const leaseId = preparedLease ? preparedLease.claim(captureVerification) : claimOpenClawAgentDatabaseLease({
		agentId,
		path: pathname,
		env: leaseEnvironment
	}, void 0, captureVerification);
	if (pending) pending.assertHeld = () => assertOpenClawAgentDatabaseLease(leaseId, {
		agentId,
		path: pathname,
		env: leaseEnvironment
	});
	const diagnostics = {};
	const finishPhase = startAgentDatabaseOpenTiming(agentId, pathname, pending ? "async" : "sync", diagnostics);
	let openedDb;
	let openedDatabase;
	let openedWalMaintenance;
	try {
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		closeIdleOpenClawAgentDatabaseReadOnly(pathname);
		const db = openNodeSqliteDatabase(pathname, { allowExtension });
		db.enableLoadExtension(false);
		enableNodeSqliteKyselyStatementCache(db);
		openedDb = db;
		if (preparedLease) db.exec("PRAGMA temp_store = FILE");
		registerOpenClawAgentDatabaseIdentity(db);
		finishPhase("open");
		const validationDatabase = {
			db,
			path: pathname,
			agentId
		};
		const validation = pending?.validation ?? preparedLease?.validation;
		if (validation) adoptOpenClawAgentDatabaseValidation(validationDatabase, validation);
		let isValidatedReopen = Boolean(getOpenClawAgentDatabaseValidation(validationDatabase));
		const walMaintenance = yield* (function* () {
			let maintenance;
			try {
				db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
				assertSupportedAgentSchemaVersion(db, pathname);
				const existingSchema = readExistingAgentSchemaMeta(db);
				assertExistingAgentSchemaOwner(existingSchema, agentId, pathname);
				const requiresCurrentVersionConvergence = yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, diagnostics, verification, isValidatedReopen && hasLiveLease);
				if (isValidatedReopen && (!existingSchema || requiresCurrentVersionConvergence)) {
					invalidateOpenClawAgentDatabaseValidation(pathname);
					isValidatedReopen = false;
				}
				assertCanonicalAgentPersistenceVersion(db, pathname);
				finishPhase("validation");
				configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
				maintenance = configureSqliteConnectionPragmas(db, {
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: `openclaw-agent:${agentId}`,
					databasePath: pathname,
					foreignKeys: true,
					synchronous: "NORMAL"
				});
				openedWalMaintenance = maintenance;
				finishPhase("configuration");
				if (!isValidatedReopen) ensureAgentSchema(db, agentId, pathname);
				finishPhase("schema");
				return maintenance;
			} catch (err) {
				maintenance?.close();
				if (db.isOpen) db.close();
				const current = cache.databases.get(pathname);
				if (!current || current.db === db) invalidateOpenClawAgentDatabaseValidation(pathname);
				if (err instanceof Error && (isSqliteSchemaVersionError(err) || isTerminalSqliteIntegrityError(err))) recordOpenClawAgentDatabaseOpenFailure(pathname, err);
				throw err;
			}
		})();
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (hasAgentDatabaseMaintenanceAuthority()) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
		const cleanup = registerAgentDeletionDatabaseCleanup(database, databaseOptions);
		if (cleanup) {
			const release = retainAgentDatabase(db);
			cleanup.registerClose(() => {
				release();
				if (cache.databases.get(database.path) === database) closeOpenClawAgentDatabaseByPath(database.path, database.agentId);
				else if (database.db.isOpen) throw new Error("Agent deletion cleanup lost its database close owner.");
			});
		}
		if (!isValidatedReopen) {
			registerOpenClawAgentDatabase({
				agentId,
				path: pathname,
				env: options.env
			}, onRegistrationCommitted);
			setOpenClawAgentDatabaseValidation(database);
		}
		cache.terminal.clear(pathname);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		finishPhase("registration");
		cache.leases.set(pathname, {
			leaseId,
			env: leaseEnvironment
		});
		cache.databases.set(pathname, database);
		const identity = readOpenClawAgentDatabaseIdentity(database).identity;
		if (diagnostics.integrityGateOutcome === "cached") {
			if (preparedLease) requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "agent-integrity-cached",
					lease: preparedLease.receipt
				}
			});
			else requestOpenClawAgentDatabaseQuickCheck({
				path: pathname,
				env: leaseEnvironment
			});
		} else if (typeof identity === "string") recordOpenClawAgentDatabaseIntegrityVerified(leaseId, {
			agentId,
			path: pathname,
			env: leaseEnvironment
		}, identity);
		refreshAgentDatabaseIdleTimer(database);
		if (isMainThread) {
			const writeOptions = {
				agentId,
				path: pathname,
				env: leaseEnvironment
			};
			registerSqliteWalWriteAdmission(db, (operation) => runOpenClawAgentWriteAdmission(writeOptions, () => {
				if (findOpenClawAgentDatabaseIfOpen(writeOptions) === database) operation();
			}));
		}
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		return database;
	} catch (error) {
		let closeError;
		if (openedDatabase) try {
			closeCachedOpenClawAgentDatabase(openedDatabase);
		} catch (caught) {
			closeError = caught;
		}
		if (openedDb?.isOpen) {
			if (pending && cache.databases.has(pathname) && cache.databases.get(pathname)?.db !== openedDb) {
				const retainedDb = openedDb;
				retainFailedAgentDatabaseClose(agentId, pathname, () => {
					openedWalMaintenance?.close();
					if (retainedDb.isOpen) retainedDb.close();
					releaseOpenClawAgentDatabaseLease(leaseId, { env: leaseEnvironment });
				});
				throw error;
			}
			invalidateOpenClawAgentDatabaseValidation(pathname);
			const retainedDatabase = openedDatabase ?? {
				agentId,
				db: openedDb,
				path: pathname,
				walMaintenance: openedWalMaintenance ?? {
					checkpoint: () => false,
					reclaimFreePages: createSqliteWalReclamationResult,
					close: () => false
				}
			};
			cache.databases.set(pathname, retainedDatabase);
			refreshAgentDatabaseIdleTimer(retainedDatabase);
			cache.leases.set(pathname, {
				leaseId,
				env: leaseEnvironment
			});
			cache.failures.set(pathname, closeError ?? error);
			getOpenClawDatabaseMaintenanceScope()?.own(retainedDatabase.db, "agent-handles", () => closeMaintenanceAgentDatabase(retainedDatabase));
			cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		} else try {
			releaseOpenClawAgentDatabaseLease(leaseId, { env: leaseEnvironment });
		} catch (releaseError) {
			retainFailedAgentDatabaseClose(agentId, pathname, () => releaseOpenClawAgentDatabaseLease(leaseId, { env: leaseEnvironment }));
			throw releaseError;
		}
		throw closeError ?? error;
	}
}
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferOpenClawAgentPostCommitPublication(database, publish) {
	return deferSqlitePostCommitPublication(database.db, publish);
}
function runOpenClawAgentWriteTransaction(operation, options, transactionOptions = {}) {
	const database = openOpenClawAgentDatabase(options);
	const enteredNestedTransaction = database.db.isTransaction;
	return withSqlitePostCommitPublications(database.db, () => runSqliteImmediateTransactionSync(database.db, () => {
		assertAgentDeletionDatabaseCleanupAccess(database, options);
		const operationResult = operation(database);
		if (!enteredNestedTransaction && !cache.incognito.has(database)) ensureOpenClawAgentDatabasePermissions(database.path, options);
		return operationResult;
	}, {
		busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
		databaseLabel: database.path,
		...transactionOptions,
		operationLabel: transactionOptions.operationLabel ?? "agent.write",
		withCommit: getAgentDeletionDatabaseCleanup(options)?.withCommit
	}));
}
/** Retain the exact verified connection across awaits; explicit disposal still revokes it. */
function borrowOpenClawAgentDatabase(options) {
	const { db } = openOpenClawAgentDatabase(options);
	return {
		db,
		release: retainAgentDatabase(db)
	};
}
/** Return whether the exact cached agent database pathname is still open. */
function isOpenClawAgentDatabaseOpen(pathname) {
	return cache.databases.get(path.resolve(pathname))?.db.isOpen === true;
}
/** Return the matching live cache entry without materializing a database. */
function getOpenClawAgentDatabaseIfOpen(options) {
	const database = findOpenClawAgentDatabaseIfOpen(options);
	if (database) refreshAgentDatabaseIdleTimer(database);
	return database;
}
function findOpenClawAgentDatabaseIfOpen(options) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoOpenClawAgentSqlitePath(pathname, options) && readAgentDeletionJournal(agentId, { env: options.env })) throw new Error(`OpenClaw agent database is unavailable while agent ${agentId} is deleted.`);
	const database = cache.databases.get(pathname);
	if (!database?.db.isOpen) {
		assertAgentDeletionCleanupAliases(options, isSameOpenClawAgentDatabasePath);
		return;
	}
	if (cache.failures.has(pathname)) throw cache.failures.get(pathname);
	if (database.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${database.agentId}; requested agent ${agentId}.`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	observeOpenClawDatabaseMaintenanceResource(database.db);
	return database;
}
/** Pin only admitted native readers already present in captured discovery families. */
function retainOpenClawAgentDatabaseReadCandidates(candidates, env) {
	const retained = [];
	const release = () => {
		for (const reader of retained.toReversed()) reader.release();
	};
	try {
		for (const database of cache.databases.values()) {
			if (!database.db.isOpen || database.db.isTransaction || cache.incognito.has(database) || !candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, database.path))) continue;
			let admitted;
			try {
				admitted = getOpenClawAgentDatabaseIfOpen({
					agentId: database.agentId,
					path: database.path,
					env
				});
			} catch {
				continue;
			}
			if (admitted === database) retained.push({
				database,
				release: retainAgentDatabase(database.db)
			});
		}
		return {
			databases: retained.map(({ database }) => database),
			release
		};
	} catch (error) {
		release();
		throw error;
	}
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
/** Release fixture handles and pathname trust before a test root is recreated. */
function closeOpenClawAgentDatabasesForTest(rootPath) {
	closeOpenClawAgentDatabases(rootPath);
	clearOpenClawAgentDatabaseValidationCache(rootPath);
	cache.terminal.clearAll(rootPath);
}
//#endregion
export { deferOpenClawAgentPostCommitPublication as a, isOpenClawAgentDatabaseOpen as c, retainOpenClawAgentDatabaseReadCandidates as d, runOpenClawAgentWriteTransaction as f, withAgentDatabaseMaintenanceLease as h, confirmOpenClawAgentDatabaseIntegrity as i, openOpenClawAgentDatabase as l, withOpenClawAgentDatabaseAsync as m, clearOpenClawAgentDatabaseOpenFailure as n, disposeOpenClawAgentDatabaseByPath as o, withOpenClawAgentDatabaseAdmission as p, closeOpenClawAgentDatabasesForTest as r, getOpenClawAgentDatabaseIfOpen as s, borrowOpenClawAgentDatabase as t, recordOpenClawAgentDatabaseOpenFailure as u };
