import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import "./kysely-sync-K7ftY-g4.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as admitSqliteSchema } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as resolveExistingSqliteFileUri, s as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { a as registerSqliteCacheExitClose, c as registerDeferredSqliteWalWriteAdmission, f as prepareSqliteDatabaseDirectory, l as registerSqliteWalWorkerMaintenance, n as configureSqlitePreSchemaPragmas, t as configureSqliteConnectionPragmas, u as createSqliteWalReclamationResult } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, p as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { i as quarantineOrphanedSqliteSidecars } from "./sqlite-files-BEC3zbaw.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { a as isTerminalSqliteIntegrityError, i as confirmSqliteFileIntegrity, o as runSqliteIntegrityCheckSync, s as runSqliteIntegrityOperationSync } from "./sqlite-integrity-GtqcmwG3.mjs";
import { c as invalidateOpenClawAgentDatabaseValidation, f as setOpenClawAgentDatabaseValidation, i as getOpenClawAgentDatabaseValidation, m as assertOpenClawAgentDatabaseIdentity, r as clearOpenClawAgentDatabaseValidationCache, t as adoptOpenClawAgentDatabaseValidation, v as readOpenClawAgentDatabaseIdentity, y as registerOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { o as readOpenClawDatabaseQuarantineFailure, r as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import { i as requestSqliteWorkerOperationAdmission, n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath, n as assertIncognitoAgentDatabasePathAvailable, o as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { C as assertAgentCreationClaimAccess, E as registerAgentCreationClaimHandle, O as reserveAgentCreationClaimAdmission, T as assertAgentCreationClaimCurrent, _ as assertAgentDeletionCleanupAliases, b as getAgentDeletionDatabaseCleanup, c as readAgentDeletionJournal, v as assertAgentDeletionDatabaseCleanupAccess, w as assertAgentCreationClaimAliases, x as registerAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CDljXcnp.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { n as ensureAgentSchema, o as ensureOpenClawAgentDatabasePermissions, s as assertSqliteIntegrityInWorker, t as agentDatabaseIntegrityBeforeMutationSteps } from "./openclaw-agent-db-schema-kFBuwbLx.mjs";
import { c as claimOpenClawAgentDatabaseLease, g as releaseOpenClawAgentDatabaseLease, l as hasAgentDatabaseMaintenanceAuthority, m as recordOpenClawAgentDatabaseIntegrityVerified, s as assertOpenClawAgentDatabaseLease } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { t as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-BJf044De.mjs";
import { S as revokePendingAgentDatabaseOpen, _ as refreshAgentDatabaseIdleTimer, a as closeOpenClawAgentDatabaseByPathAsync, b as retainFailedAgentDatabaseClose, n as closeCachedOpenClawAgentDatabase, o as closeOpenClawAgentDatabases, r as closeMaintenanceAgentDatabase, t as cache, v as resolveAgentDatabaseIntegrityGateReason, w as startAgentDatabaseOpenTiming, x as retainIncognitoSharedState, y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as assertAgentDatabaseTerminalOpenAllowed } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { n as closeIdleOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-CLlkTUQB.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-C7BZMETe.mjs";
import path from "node:path";
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
	assertAgentCreationClaimAccess(database, options);
	assertCurrent?.();
}
/** Bind admission drivers to the canonical private database-open generator. */
function createOpenClawAgentDatabaseAdmissionOwner(openSteps) {
	/** Open or return a cached per-agent database after schema and owner validation. */
	function openOpenClawAgentDatabase(options, preparedLease, registrationObserver) {
		return openAgentDatabase(options, preparedLease, registrationObserver);
	}
	function openAgentDatabase(options, preparedLease, registrationObserver, repairAdmission) {
		const run = () => {
			const steps = openSteps(options, void 0, preparedLease, registrationObserver, repairAdmission);
			return runSqliteIntegrityOperationSync(steps, preparedLease && !isMainThread || repairAdmission?.assertCurrent ? () => assertAgentDatabaseOpenAuthority(steps, () => {
				repairAdmission?.assertCurrent?.();
				if (preparedLease && !isMainThread) requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-open-resume",
						lease: preparedLease.receipt
					}
				});
			}) : void 0);
		};
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	function runOpenClawAgentWriteTransaction(operation, options, transactionOptions = {}) {
		const { repairAdmission, ...writeOptions } = transactionOptions;
		const database = openAgentDatabase(options, void 0, void 0, repairAdmission);
		const deletionCommit = getAgentDeletionDatabaseCleanup(options)?.withCommit;
		const withCommit = repairAdmission ? (commit) => {
			repairAdmission.assertCurrent?.();
			if (repairAdmission.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, repairAdmission.expectedIdentity);
			if (deletionCommit) deletionCommit(commit);
			else commit();
		} : deletionCommit;
		const enteredNestedTransaction = database.db.isTransaction;
		return withSqlitePostCommitPublications(database.db, () => runSqliteImmediateTransactionSync(database.db, () => {
			assertAgentDeletionDatabaseCleanupAccess(database, options);
			assertAgentCreationClaimAccess(database, options);
			const operationResult = operation(database);
			if (!enteredNestedTransaction && !cache.incognito.has(database)) ensureOpenClawAgentDatabasePermissions(database.path, options);
			return operationResult;
		}, {
			busyTimeoutMs: writeOptions.busyTimeoutMs ?? 5e3,
			databaseLabel: database.path,
			...writeOptions,
			operationLabel: writeOptions.operationLabel ?? "agent.write",
			withCommit
		}));
	}
	/** The initiating caller guards its physical open; each coalesced caller guards its own operation. */
	function withOpenClawAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	function runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal) {
		try {
			signal?.throwIfAborted();
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
		if (existing?.controller.signal.aborted) return existing.promise.then(() => withOpenClawAgentDatabaseAsync(options, operation, assertCurrent, signal), () => withOpenClawAgentDatabaseAsync(options, operation, assertCurrent, signal));
		const pending = existing ?? startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent);
		pending.operations += 1;
		return racePromiseWithAbortSignal(pending.promise, signal).then((database) => {
			signal?.throwIfAborted();
			assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent);
			observeOpenClawDatabaseMaintenanceResource(database.db);
			return operation(database);
		}).finally(() => {
			pending.operations -= 1;
			if (!pending.operations) {
				if (!pending.releaseBorrow) pending.controller.abort(/* @__PURE__ */ new Error("Agent database admission has no waiting callers"));
				pending.releaseBorrow?.();
			}
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
					suspended = false;
					assertAgentDatabaseOpenAuthority(steps, () => {
						assertCurrent();
						assertOpenClawAgentDatabaseAdmissionCurrent(options, pending, check?.database);
					});
					pending.validation = validation;
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
		assertAgentCreationClaimCurrent(options);
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
					await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, pending.controller.signal, void 0, step.value.timing, step.value.tables);
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
		openOpenClawAgentDatabase,
		runOpenClawAgentWriteTransaction,
		withOpenClawAgentDatabaseAsync,
		withOpenClawAgentDatabaseAdmission
	};
}
//#endregion
//#region src/state/openclaw-agent-db.wal.ts
/** Keep the published timer's exact native owner pinned through worker settlement. */
function registerOpenClawAgentWalMaintenance(database, env) {
	const options = {
		agentId: database.agentId,
		path: database.path,
		env
	};
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity.identity !== "string") return;
	const expectedIdentity = {
		kind: "file",
		physicalIdentity: identity.identity,
		birthtime: identity.birthtime,
		nativeLocation: identity.filename
	};
	const controller = new AbortController();
	let pending;
	let unregister;
	const cancel = () => {
		controller.abort();
	};
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		if (cache.databases.get(database.path) !== database || !database.db.isOpen) throw new Error("Agent WAL maintenance owner changed");
	};
	registerSqliteWalWorkerMaintenance(database.db, async (request) => {
		if (controller.signal.aborted) return;
		const release = retainAgentDatabase(database.db);
		const active = runOpenClawAgentWorkerWrite(options, async () => {
			assertCurrent();
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				...options,
				revoke: cancel,
				async close() {
					cancel();
					await pending?.catch(() => {});
				}
			});
			const { captureOpenClawAgentDatabaseExecution } = await import("./openclaw-agent-execution-CbtlfrTi.mjs");
			assertCurrent();
			const execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
			try {
				const result = await execution.runExisting({
					assertCurrent,
					createAdmission: (binding) => () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((authority, grant) => {
							binding.authorize(authority);
							assertCurrent();
							if (!grant()) throw new Error("Agent WAL maintenance authority expired");
						}, binding.attachment)
					})
				}, (worker) => worker.execute({
					type: "database.walMaintenance",
					input: request
				}));
				assertCurrent();
				execution.assertCurrent();
				return result;
			} finally {
				await execution.release();
			}
		}, void 0, controller.signal);
		pending = active;
		try {
			return await active;
		} finally {
			release();
			pending = void 0;
			unregister?.();
			unregister = void 0;
		}
	}, cancel);
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
const { openOpenClawAgentDatabase, runOpenClawAgentWriteTransaction, withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseAdmission } = createOpenClawAgentDatabaseAdmissionOwner(openOpenClawAgentDatabaseSteps);
function* openOpenClawAgentDatabaseSteps(options, pending, preparedLease, registrationObserver, repairAdmission) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	const assertCurrent = (database) => {
		repairAdmission?.assertCurrent?.();
		if (repairAdmission?.expectedIdentity) {
			if (database) assertOpenClawAgentDatabaseIdentity(database, repairAdmission.expectedIdentity);
			else assertExistingDatabaseIdentity(pathname, repairAdmission.expectedIdentity.key, repairAdmission.expectedIdentity.birthtime);
		}
	};
	assertCurrent();
	assertAgentCreationClaimCurrent(databaseOptions);
	getAgentDeletionDatabaseCleanup(databaseOptions)?.assertCurrent();
	const incognito = isIncognitoOpenClawAgentSqlitePath(pathname, databaseOptions);
	const opened = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (opened) {
		assertCurrent(opened);
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
		if (!isMainThread) {
			db.exec("PRAGMA temp_store=MEMORY");
			if (db.prepare("PRAGMA temp_store").get()?.temp_store !== 2) throw new Error("Incognito actor requires memory-only SQLite temporary storage");
		}
		configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
		const walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: `openclaw-agent-incognito:${agentId}`,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		ensureAgentSchema(db, agentId, pathname);
		admitSqliteSchema(db);
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
		retainIncognitoSharedState(db, options.env);
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		return database;
	}
	if (!repairAdmission?.expectedIdentity) quarantineOrphanedSqliteSidecars(pathname);
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
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: resolveStateDir(options.env ?? process.env),
		...isGatewayExternallySupervised(options.env ?? process.env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	if (preparedLease && (preparedLease.receipt.agentId !== agentId || preparedLease.receipt.path !== pathname)) throw new Error("Prepared agent database lease belongs to another store");
	let verification;
	let reuseIntegrity = false;
	let integrityRevoked = false;
	const validation = pending?.validation ?? preparedLease?.validation;
	const captureVerification = (record, runtimeIntegrityAllowed, invalidated) => {
		verification = record;
		reuseIntegrity = runtimeIntegrityAllowed;
		integrityRevoked = invalidated;
		if (invalidated && validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
	};
	const releaseOptions = {
		env: leaseEnvironment,
		initializationAgentPaths: [pathname]
	};
	assertCurrent();
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
	let releaseCreationAdmission;
	try {
		assertCurrent();
		if (!repairAdmission?.expectedIdentity) {
			ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
			prepareSqliteDatabaseDirectory(pathname);
		}
		closeIdleOpenClawAgentDatabaseReadOnly(pathname);
		const db = openNodeSqliteDatabase(repairAdmission?.expectedIdentity ? resolveExistingSqliteFileUri(pathname) : pathname, { allowExtension });
		openedDb = db;
		registerOpenClawAgentDatabaseIdentity(db);
		assertCurrent({
			db,
			path: pathname
		});
		if (repairAdmission?.expectedIdentity) ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		db.enableLoadExtension(false);
		enableNodeSqliteKyselyStatementCache(db);
		if (preparedLease) db.exec("PRAGMA temp_store = FILE");
		finishPhase("open");
		const validationDatabase = {
			db,
			path: pathname,
			agentId
		};
		if (validation) adoptOpenClawAgentDatabaseValidation(validationDatabase, validation);
		let isValidatedReopen = Boolean(getOpenClawAgentDatabaseValidation(validationDatabase));
		let walMaintenance;
		try {
			db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSupportedAgentSchemaVersion(db, pathname);
			const existingSchema = readExistingAgentSchemaMeta(db);
			assertExistingAgentSchemaOwner(existingSchema, agentId, pathname);
			if (pending) releaseCreationAdmission = reserveAgentCreationClaimAdmission(pending, databaseOptions, async () => {
				await closeOpenClawAgentDatabaseByPathAsync(pathname, agentId);
			});
			diagnostics.integrityGateReason = resolveAgentDatabaseIntegrityGateReason(validationDatabase, {
				verification,
				validation,
				integrityRevoked,
				reuseIntegrity
			});
			const requiresCurrentVersionConvergence = yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, diagnostics, verification, isValidatedReopen && reuseIntegrity, true);
			assertCurrent(validationDatabase);
			if (!diagnostics.integrityGateOutcome || diagnostics.integrityGateOutcome === "cached") delete diagnostics.integrityGateReason;
			if (isValidatedReopen && (!existingSchema || requiresCurrentVersionConvergence)) {
				invalidateOpenClawAgentDatabaseValidation(pathname);
				isValidatedReopen = false;
			}
			assertCanonicalAgentPersistenceVersion(db, pathname);
			finishPhase("validation");
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			walMaintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: `openclaw-agent:${agentId}`,
				databasePath: pathname,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			openedWalMaintenance = walMaintenance;
			finishPhase("configuration");
			assertCurrent(validationDatabase);
			if (!isValidatedReopen) ensureAgentSchema(db, agentId, pathname);
			finishPhase("schema");
		} catch (err) {
			if (diagnostics.integrityGateOutcome === "failed") finishPhase("validation");
			openedWalMaintenance?.close();
			if (db.isOpen) db.close();
			const current = cache.databases.get(pathname);
			if (!current || current.db === db) invalidateOpenClawAgentDatabaseValidation(pathname);
			if (err instanceof Error && (isSqliteSchemaVersionError(err) || isTerminalSqliteIntegrityError(err))) recordOpenClawAgentDatabaseOpenFailure(pathname, err);
			throw err;
		}
		assertCurrent({
			db,
			path: pathname
		});
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		admitSqliteSchema(db);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (hasAgentDatabaseMaintenanceAuthority()) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
		registerAgentDeletionDatabaseCleanup(database, databaseOptions)?.registerClose(createScopeOwnedClose(database, "Agent deletion cleanup"));
		registerAgentCreationClaimHandle(database, databaseOptions)?.registerClose(createScopeOwnedClose(database, "Agent creation claim"));
		if (!isValidatedReopen) {
			assertCurrent(database);
			registerOpenClawAgentDatabase({
				agentId,
				path: pathname,
				env: options.env
			}, registrationObserver);
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
		assertCurrent(database);
		if (diagnostics.integrityGateOutcome === "cached" && !(isValidatedReopen && reuseIntegrity)) {
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
		} else if (diagnostics.integrityGateOutcome !== "cached" && typeof identity === "string") recordOpenClawAgentDatabaseIntegrityVerified(leaseId, {
			agentId,
			path: pathname,
			env: leaseEnvironment
		}, identity);
		refreshAgentDatabaseIdleTimer(database);
		if (isMainThread) registerOpenClawAgentWalMaintenance(database, leaseEnvironment);
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		releaseCreationAdmission?.();
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
					releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions);
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
					stop: async () => {},
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
			releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions);
		} catch (releaseError) {
			retainFailedAgentDatabaseClose(agentId, pathname, () => releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions));
			throw releaseError;
		}
		throw closeError ?? error;
	}
}
/** A lifecycle scope closes its exact connection and retains its borrow until disposal succeeds. */
function createScopeOwnedClose(database, owner) {
	const release = retainAgentDatabase(database.db);
	return async () => {
		if (cache.databases.get(database.path) === database) await closeOpenClawAgentDatabaseByPathAsync(database.path, database.agentId);
		else if (database.db.isOpen) throw new Error(`${owner} lost its database close owner.`);
		release();
	};
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
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoOpenClawAgentSqlitePath(pathname, options) && readAgentDeletionJournal(agentId, { env: options.env }, "runtime")) throw new Error(`OpenClaw agent database is unavailable while agent ${agentId} is deleted.`);
	const database = cache.databases.get(pathname);
	if (!database?.db.isOpen) {
		assertAgentDeletionCleanupAliases(options, isSameOpenClawAgentDatabasePath);
		assertAgentCreationClaimAliases(options, isSameOpenClawAgentDatabasePath);
		return;
	}
	if (cache.failures.has(pathname)) throw cache.failures.get(pathname);
	if (database.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${database.agentId}; requested agent ${agentId}.`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	assertAgentCreationClaimAccess(database, options);
	observeOpenClawDatabaseMaintenanceResource(database.db);
	refreshAgentDatabaseIdleTimer(database);
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
/** Release fixture handles and pathname trust before a test root is recreated. */
function closeOpenClawAgentDatabasesForTest(rootPath) {
	closeOpenClawAgentDatabases(rootPath);
	clearOpenClawAgentDatabaseValidationCache(rootPath);
	cache.terminal.clearAll(rootPath);
}
//#endregion
export { getOpenClawAgentDatabaseIfOpen as a, recordOpenClawAgentDatabaseOpenFailure as c, withOpenClawAgentDatabaseAdmission as d, withOpenClawAgentDatabaseAsync as f, confirmOpenClawAgentDatabaseIntegrity as i, retainOpenClawAgentDatabaseReadCandidates as l, clearOpenClawAgentDatabaseOpenFailure as n, isOpenClawAgentDatabaseOpen as o, closeOpenClawAgentDatabasesForTest as r, openOpenClawAgentDatabase as s, borrowOpenClawAgentDatabase as t, runOpenClawAgentWriteTransaction as u };
