import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, p as resolveDatabasePathKey, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { C as readSqliteDatabaseIntegrityVerification, l as getSqliteDatabaseAdmissionIdentityForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as resolveExistingSqliteFileUri, l as supportsNodeSqliteExtensionLoading, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { a as isSameOpenClawAgentDatabasePath, c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { C as assertAgentCreationClaimAccess, D as registerAgentCreationClaimHandle, E as captureAgentCreationClaim, T as assertAgentCreationClaimCurrent, d as assertAgentDeletionCleanupAliases, f as assertAgentDeletionDatabaseCleanupAccess, g as registerAgentDeletionDatabaseCleanup, h as getAgentDeletionDatabaseCleanup, k as reserveAgentCreationClaimAdmission, o as registerOpenClawAgentDatabaseAsyncResource, t as assertAgentDatabaseResourceAdmission, w as assertAgentCreationClaimAliases } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as readOpenClawDatabaseQuarantineFailure, t as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { l as runSqliteIntegrityCheckSync, s as isTerminalSqliteIntegrityError, u as runSqliteIntegrityOperationSync } from "./sqlite-integrity-06TCB-az.mjs";
import { n as configureSqlitePreSchemaPragmas, o as registerSqliteCacheExitClose, s as createSqliteWalReclamationResult, t as configureSqliteConnectionPragmas, u as prepareSqliteDatabaseDirectory } from "./sqlite-wal-D2XTertL.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as registerSqliteWalWorkerMaintenance, i as registerDeferredSqliteWalWriteAdmission } from "./sqlite-wal-write-admission-Civ4GaI3.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { l as SqliteWorkerOpenRefusedError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { f as requestSqliteWorkerOperationAdmission, i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as quarantineOrphanedSqliteSidecars } from "./sqlite-files-N5UzY_DG.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity, o as registerOpenClawAgentDatabaseIdentity, t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { r as hasRegisteredOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { c as claimOpenClawAgentDatabaseLease, g as releaseOpenClawAgentDatabaseLease, l as hasAgentDatabaseMaintenanceAuthority, m as recordOpenClawAgentDatabaseAdmission, s as assertOpenClawAgentDatabaseLease, y as agentDatabaseAdmissionProvenanceRefusal } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { _ as publishOpenClawAgentDatabaseSchema, c as getOpenClawAgentDatabaseValidation, i as captureOpenClawAgentDatabaseAliasPublication, l as getOpenClawAgentDatabaseValidationForTransfer, m as invalidateOpenClawAgentDatabaseValidation, n as adoptOpenClawAgentDatabaseValidation, t as adoptOpenClawAgentDatabaseSchema, w as assertCanonicalSessionValidationSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { _ as retainAgentDatabase, a as closeOpenClawAgentDatabaseByPathAsync, g as registerAgentDatabaseHandle, h as refreshAgentDatabaseIdleTimer, l as createAgentDatabaseScopeOwnedClose, m as recordOpenClawAgentDatabaseOpenFailure, n as closeCachedOpenClawAgentDatabase, o as closeOpenClawAgentDatabases, r as closeMaintenanceAgentDatabase, t as cache, v as retainFailedAgentDatabaseClose, x as startAgentDatabaseOpenTiming, y as revokePendingAgentDatabaseOpen } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { i as assertSupportedAgentSchemaVersion, n as assertCurrentAgentSchemaMetadata, r as assertExistingAgentSchemaOwner, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as assertSqliteIntegrityInWorker } from "./sqlite-integrity-worker-DyRlMgGE.mjs";
import { c as revalidateAgentDatabaseTerminalOpenAsync, s as revalidateAgentDatabaseTerminalOpen } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { n as ensureAgentSchema, o as resolveAgentDatabaseIntegrityGateReason, s as ensureOpenClawAgentDatabasePermissions, t as agentDatabaseIntegrityBeforeMutationSteps } from "./openclaw-agent-db-schema-BUhCxlqc.mjs";
import { n as closeIdleOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { t as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/state/openclaw-agent-db-worker-admission.ts
/** The existing executor owns cold admission; the native callback retains the SDK handle contract. */
async function withWorkerAdmission(options, assertCurrent, signal, run, borrowedExecution) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	assertAgentCreationClaimCurrent(options);
	assertAgentCreationClaimAliases(options);
	const creationClaim = captureAgentCreationClaim(options);
	const admittedIdentity = borrowedExecution ? getSqliteDatabaseAdmissionIdentityForPath(pathname) : void 0;
	const identity = admittedIdentity ? {
		...admittedIdentity,
		canonicalPath: resolveDatabasePathKey(pathname)
	} : readDatabasePathIdentitySync(pathname);
	const agentId = normalizeAgentId(options.agentId);
	if (borrowedExecution) {
		borrowedExecution.assertCurrent();
		if (borrowedExecution.agentId !== agentId || borrowedExecution.path !== pathname) throw new Error("Agent worker admission differs from its captured execution");
	}
	let publishAlias = identity.canonicalPath !== pathname ? captureOpenClawAgentDatabaseAliasPublication({
		agentId,
		path: pathname
	}) : void 0;
	const completion = createDeferredCore();
	let revoked = false;
	let releaseExecution;
	const assertAdmission = () => {
		if (revoked) throw new Error("Agent database admission closed during worker preparation");
		assertCurrent?.();
		borrowedExecution?.assertCurrent();
		creationClaim?.assertCurrent();
		signal?.throwIfAborted();
	};
	const unregister = registerOpenClawAgentDatabaseAsyncResource({
		agentId,
		path: pathname,
		revoke: () => {
			revoked = true;
		},
		close: () => completion.promise
	}, options);
	try {
		const owner = await import("./openclaw-agent-execution-lyxyLljQ.mjs");
		assertAdmission();
		if (!owner.supportsOpenClawAgentDatabaseExecution(options)) return await run("native");
		let execution;
		if (borrowedExecution) execution = borrowedExecution;
		else {
			const captured = owner.captureOpenClawAgentDatabaseExecution(options, identity.key.startsWith("file:") ? { expectedIdentity: {
				kind: "file",
				physicalIdentity: identity.key.slice(5),
				nativeLocation: identity.canonicalPath,
				birthtime: identity.birthtime
			} } : {});
			execution = captured;
			releaseExecution = () => captured.release();
		}
		const source = {
			assertCurrent: assertAdmission,
			createAdmission: (binding) => () => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertAdmission();
					if (publishAlias && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "agent-validation-start") publishAlias = captureOpenClawAgentDatabaseAliasPublication({
						agentId,
						path: pathname
					});
					if (!grant()) throw new Error("Agent database preparation lost its admission");
				}, binding.attachment)
			})
		};
		await runOpenClawAgentWorkerWrite(options, () => execution.prepare(source, signal));
		assertAdmission();
		publishAlias?.(execution.captureGenerationClaim().identity, getOpenClawAgentDatabaseValidationForTransfer({
			agentId,
			path: identity.canonicalPath
		}));
		return await run("worker");
	} finally {
		try {
			await releaseExecution?.();
		} finally {
			unregister();
			completion.resolve();
		}
	}
}
//#endregion
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
function assertAgentDatabaseWriteAllowed(pathname) {
	if (path.basename(pathname) === "incognito-openclaw-agent.sqlite") throw new Error("Incognito sessions use the memory session actor, not a SQLite database.");
	if (isArtifactPreservingStateRead("agent", pathname)) throw new Error("Programming error: writable agent database open during read-only inspection.");
}
/** Bind admission drivers to the canonical private database-open generator. */
function createOpenClawAgentDatabaseAdmissionOwner(openSteps) {
	/** Open or return a cached per-agent database after schema and owner validation. */
	function openOpenClawAgentDatabase(options, preparedLease, registrationObserver) {
		return openAgentDatabase(options, preparedLease, registrationObserver);
	}
	function openAgentDatabase(options, preparedLease, registrationObserver, repairAdmission) {
		assertAgentDatabaseWriteAllowed(resolveOpenClawAgentSqlitePath(options));
		const run = () => {
			const steps = openSteps(options, void 0, preparedLease, registrationObserver, repairAdmission);
			const assertCurrent = () => {
				repairAdmission?.assertCurrent?.();
				if (preparedLease && !isMainThread) requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-open-resume",
						lease: preparedLease.receipt
					}
				});
			};
			const repair = preparedLease?.startupRepair;
			return runSqliteIntegrityOperationSync(steps, () => assertAgentDatabaseOpenAuthority(steps, assertCurrent), repair && !isMainThread ? (check, error) => repair(check, error, assertCurrent) : void 0);
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
		return withSqlitePostCommitPublications(database.db, () => runSqliteImmediateTransactionSync(database.db, () => {
			assertAgentDeletionDatabaseCleanupAccess(database, options);
			assertAgentCreationClaimAccess(database, options);
			return operation(database);
		}, {
			busyTimeoutMs: writeOptions.busyTimeoutMs ?? 5e3,
			databaseLabel: database.path,
			...writeOptions,
			operationLabel: writeOptions.operationLabel ?? "agent.write",
			withCommit
		}));
	}
	/** Released SDK guards may read SQLite; preserve their native open and integrity-resume checkpoints. */
	function withOpenClawAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal, "native");
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	/** Runtime authority runs in worker grants: same-owner row predicates belong in the worker. */
	function withOpenClawAgentDatabaseRuntime(inputOptions, operation, assertCurrent, signal) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	/** Core callers retain their original creating reference through native handle admission. */
	function withOpenClawAgentDatabaseRuntimeFromExecution(inputOptions, execution, operation, assertCurrent, signal) {
		const agentId = normalizeAgentId(inputOptions.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...inputOptions,
			agentId
		});
		const assertExecutionCurrent = () => {
			execution.assertCurrent();
			if (execution.agentId !== agentId || execution.path !== pathname) throw new Error("Agent runtime admission differs from its captured execution");
			assertCurrent?.();
		};
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertExecutionCurrent, signal, void 0, execution);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	async function runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal, prepared, execution) {
		signal?.throwIfAborted();
		assertCurrent?.();
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...options,
			agentId
		});
		assertAgentDatabaseWriteAllowed(pathname);
		options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
		options.path = pathname;
		if (cache.terminal.peek(pathname)) await revalidateAgentDatabaseTerminalOpenAsync(pathname, assertCurrent, signal);
		const cached = cache.databases.get(pathname);
		const schema = getOpenClawAgentDatabaseValidationForTransfer({
			agentId,
			path: pathname
		})?.schema;
		if (!prepared && isMainThread && (!cached?.db.isOpen || !schema || Atomics.load(new Int32Array(schema.valid), 0) !== 1) && !cache.pending.has(pathname)) return withWorkerAdmission(options, assertCurrent, signal, (preparation) => runAgentDatabaseAsync(options, operation, assertCurrent, signal, preparation, execution), execution);
		const existing = cache.pending.get(pathname);
		if (existing?.agentId !== void 0 && existing.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${existing.agentId}`);
		if (existing?.controller.signal.aborted) return existing.promise.then(() => runAgentDatabaseAsync(options, operation, assertCurrent, signal, prepared, execution), () => runAgentDatabaseAsync(options, operation, assertCurrent, signal, prepared, execution));
		const pending = existing ?? startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent, prepared === "worker");
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
		assertAgentDatabaseWriteAllowed(pathname);
		if (cache.terminal.peek(pathname)) await revalidateAgentDatabaseTerminalOpenAsync(pathname);
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
				const outcome = await withAdmission(async (assertCurrent, validation, integrityRevoked) => {
					suspended = false;
					assertAgentDatabaseOpenAuthority(steps, () => {
						assertCurrent();
						assertOpenClawAgentDatabaseAdmissionCurrent(options, pending);
					});
					pending.validation = validation;
					pending.integrityRevoked = integrityRevoked;
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
		assertAgentDatabaseResourceAdmission({
			agentId,
			path: pathname
		});
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
	function assertOpenClawAgentDatabaseAdmissionCurrent(options, pending) {
		const pathname = pending.path;
		pending.controller.signal.throwIfAborted();
		assertAgentDatabaseAdmitted(pending.agentId, { env: options.env });
		if (cache.pending.get(pathname) !== pending) throw new Error(`Agent database open was replaced: ${pathname}`);
		assertAgentCreationClaimCurrent(options);
		getAgentDeletionDatabaseCleanup(options)?.assertCurrent();
		pending.assertHeld?.();
	}
	function startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent, workerPrepared = false) {
		const admission = createOpenClawAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		pending.workerPrepared = workerPrepared;
		const operation = openSteps(options, pending);
		(async () => {
			assertAgentDatabaseOpenAuthority(operation, assertCurrent);
			let step = operation.next();
			while (!step.done) {
				let failure;
				let failed = false;
				try {
					await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, pending.controller.signal, void 0, step.value.timing);
				} catch (error) {
					failure = error;
					failed = true;
				}
				assertAgentDatabaseOpenAuthority(operation, () => {
					assertOpenClawAgentDatabaseAdmissionCurrent(options, pending);
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
		withOpenClawAgentDatabaseRuntime,
		withOpenClawAgentDatabaseRuntimeFromExecution,
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
			const { captureOpenClawAgentDatabaseExecution } = await import("./openclaw-agent-execution-lyxyLljQ.mjs");
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
/** Drain the live owner before reconfirming an advisory failure in a native child. */
async function confirmOpenClawAgentDatabaseIntegrity(pathname, lifetime) {
	const resolvedPath = path.resolve(pathname);
	await closeOpenClawAgentDatabaseByPathAsync(resolvedPath);
	invalidateOpenClawAgentDatabaseValidation(resolvedPath);
	const { confirmDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-xgUyMJc2.mjs");
	return confirmDatabaseVerifyWorker({
		path: resolvedPath,
		kind: "agent",
		label: resolvedPath
	}, lifetime);
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
const { openOpenClawAgentDatabase, runOpenClawAgentWriteTransaction, withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseRuntime, withOpenClawAgentDatabaseRuntimeFromExecution, withOpenClawAgentDatabaseAdmission } = createOpenClawAgentDatabaseAdmissionOwner(openOpenClawAgentDatabaseSteps);
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
	const opened = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (opened) {
		assertCurrent(opened);
		if (preparedLease) throw new Error("A prepared Worker lease cannot adopt an existing agent database handle");
		if (pending?.workerPrepared) adoptOpenClawAgentDatabaseSchema(opened, true, true);
		return opened;
	}
	assertAgentDatabaseResourceAdmission({
		agentId,
		path: pathname
	});
	if (!pending) revokePendingAgentDatabaseOpen(pathname);
	const cached = cache.databases.get(pathname);
	const allowExtension = !process.permission && supportsNodeSqliteExtensionLoading();
	if (!repairAdmission?.expectedIdentity) quarantineOrphanedSqliteSidecars(pathname);
	revalidateAgentDatabaseTerminalOpen(pathname);
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
	let reuseIntegrity = false;
	let integrityRevoked = false;
	const diagnostics = {};
	const validation = pending?.validation ?? preparedLease?.validation;
	const captureVerification = (runtimeIntegrityAllowed, invalidated, because) => {
		reuseIntegrity = runtimeIntegrityAllowed;
		integrityRevoked = invalidated || preparedLease?.integrityRevoked === true || pending?.integrityRevoked === true;
		diagnostics.because = invalidated ? because : void 0;
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
		registerOpenClawAgentDatabaseIdentity(db, resolveOpenClawStateSqlitePath(leaseEnvironment));
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
		const reuseAdmittedIntegrity = isValidatedReopen || reuseIntegrity || pending?.workerPrepared === true && !integrityRevoked;
		let reusedSchema = false;
		let walMaintenance;
		try {
			setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			reusedSchema = adoptOpenClawAgentDatabaseSchema(validationDatabase, reuseAdmittedIntegrity, pending?.workerPrepared);
			if (!reusedSchema) admitSqliteSchema(db, (userVersion) => {
				assertSupportedAgentSchemaVersion(db, pathname, userVersion);
			});
			const existingSchema = readExistingAgentSchemaMeta(db);
			assertExistingAgentSchemaOwner(existingSchema, agentId, pathname);
			if (reusedSchema) assertCurrentAgentSchemaMetadata(existingSchema, agentId, pathname);
			if (pending) releaseCreationAdmission = reserveAgentCreationClaimAdmission(pending, databaseOptions, async () => {
				await closeOpenClawAgentDatabaseByPathAsync(pathname, agentId);
			});
			if (preparedLease && !isMainThread) requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "agent-validation-start",
					lease: preparedLease.receipt
				}
			});
			diagnostics.integrityGateReason = resolveAgentDatabaseIntegrityGateReason(validationDatabase, {
				validation,
				integrityRevoked,
				reuseIntegrity
			});
			diagnostics.because ??= integrityRevoked ? agentDatabaseAdmissionProvenanceRefusal(preparedLease?.provenance, pathname) : void 0;
			let verification;
			if (diagnostics.integrityGateReason === "revoked" || diagnostics.integrityGateReason === "stale-lease-full") {
				isValidatedReopen = false;
				reusedSchema = false;
			} else if (reuseIntegrity) verification = readSqliteDatabaseIntegrityVerification(db);
			const requiresCurrentVersionConvergence = yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, diagnostics, verification, isValidatedReopen && reuseAdmittedIntegrity, reusedSchema);
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
				autoCheckpointPages: 0,
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
		if (!reusedSchema) {
			admitSqliteSchema(db);
			assertCanonicalSessionValidationSchema(db);
		}
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (hasAgentDatabaseMaintenanceAuthority()) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
		registerAgentDeletionDatabaseCleanup(database, databaseOptions)?.registerClose(createAgentDatabaseScopeOwnedClose(database, "Agent deletion cleanup"));
		registerAgentCreationClaimHandle(database, databaseOptions)?.registerClose(createAgentDatabaseScopeOwnedClose(database, "Agent creation claim"));
		if (!isValidatedReopen || !hasRegisteredOpenClawAgentDatabasePath(database, { env: options.env })) {
			assertCurrent(database);
			registerOpenClawAgentDatabase({
				agentId,
				path: pathname,
				env: options.env,
				admittedDb: db
			}, registrationObserver);
		} else if (!reusedSchema) publishOpenClawAgentDatabaseSchema(database);
		cache.terminal.clear(pathname);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		finishPhase("registration");
		registerAgentDatabaseHandle(database, leaseId, leaseEnvironment);
		assertCurrent(database);
		recordOpenClawAgentDatabaseAdmission(leaseId, {
			agentId,
			path: pathname,
			env: leaseEnvironment
		});
		refreshAgentDatabaseIdleTimer(database);
		if (isMainThread) registerOpenClawAgentWalMaintenance(database, leaseEnvironment);
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		releaseCreationAdmission?.();
		return database;
	} catch (error) {
		const deferLeaseRelease = preparedLease !== void 0 && !isMainThread && error instanceof SqliteWorkerOpenRefusedError;
		let closeError;
		if (openedDatabase) try {
			closeCachedOpenClawAgentDatabase(openedDatabase);
		} catch (caught) {
			closeError = caught;
		}
		if (openedDb?.isOpen) {
			const successor = cache.databases.get(pathname);
			if (pending && successor && successor.db !== openedDb) {
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
		} else if (!deferLeaseRelease) {
			const closeOutcome = error instanceof SqliteWorkerOpenRefusedError ? "read-only" : void 0;
			try {
				releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions, closeOutcome);
			} catch (releaseError) {
				retainFailedAgentDatabaseClose(agentId, pathname, () => releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions, closeOutcome));
				throw releaseError;
			}
		}
		throw closeError ?? error;
	}
}
/** Retain the exact verified connection across awaits; explicit disposal still revokes it. */
function borrowOpenClawAgentDatabase(options) {
	const { db } = openOpenClawAgentDatabase(options);
	return {
		db,
		release: retainAgentDatabase(db)
	};
}
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
	const database = cache.databases.get(pathname);
	if (!database?.db.isOpen) {
		assertAgentDeletionCleanupAliases(options, isSameOpenClawAgentDatabasePath);
		assertAgentCreationClaimAliases(options);
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
			if (!database.db.isOpen || database.db.isTransaction || !candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, database.path))) continue;
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
//#endregion
export { isOpenClawAgentDatabaseOpen as a, runOpenClawAgentWriteTransaction as c, withOpenClawAgentDatabaseRuntime as d, withOpenClawAgentDatabaseRuntimeFromExecution as f, getOpenClawAgentDatabaseIfOpen as i, withOpenClawAgentDatabaseAdmission as l, clearOpenClawAgentDatabaseOpenFailure as n, openOpenClawAgentDatabase as o, confirmOpenClawAgentDatabaseIntegrity as r, retainOpenClawAgentDatabaseReadCandidates as s, borrowOpenClawAgentDatabase as t, withOpenClawAgentDatabaseAsync as u };
