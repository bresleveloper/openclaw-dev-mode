import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { i as getOpenClawDatabaseMaintenanceScope, s as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, m as publishOpenClawStateDatabaseWorkerAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { o as retainSqliteWorkerErrorCode } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { a as isSqliteWorkerStoreAvailable, d as runSqliteWorkerStoreOperation, o as openAgentDatabaseSqliteWorkerStore, t as closeUnclaimedSharedStateSqliteWorkers } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-BFwcs62N.mjs";
import { C as getAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { l as hasAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { n as cache } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { t as captureOpenClawAgentDatabaseRegistration } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { a as getOpenClawAgentDatabaseValidationForTransfer, n as captureOpenClawAgentDatabaseValidationTransfer } from "./openclaw-agent-db-validation-cache-BQ1Mko2o.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-Ju-BQfY7.mjs";
import { t as cleanupRetiredAgentDatabaseLease } from "./openclaw-agent-execution-cleanup-DuuxK9TG.mjs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { MessagePort } from "node:worker_threads";
//#region src/state/openclaw-agent-execution-native.ts
async function settleAgentRegistration(registration, operation) {
	let result;
	try {
		result = {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		registration.finish();
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Agent open and registration publication failed", result.error);
		throw error;
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** A logical execution owner can replace this generation only after its native close settles. */
function createAgentDatabaseNativeGeneration(agentId, pathname, context, assertLogicalCurrent, assertCleanupOwned, expectedIdentity, acceptFileIdentity) {
	const input = {
		leaseId: randomUUID(),
		agentId,
		databasePath: pathname,
		stateDatabasePath: context.admission.databasePath,
		environment: context.environment,
		...expectedIdentity ? { expectedIdentity } : {}
	};
	let retiring = false;
	let opening;
	let openedStore;
	let openingFailed = false;
	let closing;
	let nativeIdentity;
	let nativeStopped;
	let lease;
	let quickCheckPending = false;
	let receiveValidation;
	const assertCurrent = () => {
		assertLogicalCurrent();
		if (retiring) throw new Error("Agent native generation is retiring");
		if (openedStore && !isSqliteWorkerStoreAvailable(openedStore)) throw new Error("Agent database execution lost its native owner");
	};
	const admission = (source, registration, assertCallerCurrent) => (operation) => {
		const nativeLocations = [
			pathname,
			...nativeIdentity ? [nativeIdentity.nativeLocation] : [],
			context.admission.databasePath,
			context.admission.identity.canonicalPath
		];
		const authorizeNative = (request) => {
			const facts = request.facts;
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-committed") {
				const received = facts.registration;
				if (!registration || !lease || !isRecord(received) || received.agentId !== input.agentId || received.agentPath !== pathname || received.stateDatabasePath !== lease.sharedStatePath || received.stateDatabaseIdentity !== lease.sharedStateIdentity) throw new Error("Agent registration commit differs from its admitted native owner");
				registration.recordCommitted({
					agentId: input.agentId,
					agentPath: pathname,
					stateDatabasePath: lease.sharedStatePath,
					stateDatabaseIdentity: lease.sharedStateIdentity
				});
				return true;
			}
			assertCurrent();
			assertCallerCurrent?.();
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "shared-owner") {
				if (!(facts.validationPort instanceof MessagePort)) throw new Error("Agent worker lost its validation handoff port");
				try {
					source.assertCurrent();
					publishOpenClawStateDatabaseWorkerAdmission(context.admission);
					const received = facts.lease;
					if (!isDeepStrictEqual(facts.identity, context.admission.identity) || !isRecord(received) || received.leaseId !== input.leaseId || received.agentId !== input.agentId || received.path !== pathname || received.ownerPid !== process.pid || received.ownerStartTime !== null && typeof received.ownerStartTime !== "number" || received.sharedStatePath !== context.admission.databasePath || received.sharedStateIdentity !== context.admission.identity.key) throw new Error("Agent worker lease differs from its captured native owner");
					lease = {
						leaseId: input.leaseId,
						agentId: input.agentId,
						path: pathname,
						ownerPid: process.pid,
						ownerStartTime: received.ownerStartTime,
						sharedStatePath: context.admission.databasePath,
						sharedStateIdentity: context.admission.identity.key
					};
					receiveValidation = captureOpenClawAgentDatabaseValidationTransfer({
						agentId,
						path: pathname
					});
					facts.validationPort.postMessage(getOpenClawAgentDatabaseValidationForTransfer({
						agentId,
						path: pathname
					}), []);
				} finally {
					facts.validationPort.close();
				}
				return true;
			}
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-integrity-cached") {
				source.assertCurrent();
				if (!lease || !isDeepStrictEqual(facts.lease, lease)) throw new Error("Agent integrity notice differs from its captured native lease");
				quickCheckPending = true;
				return true;
			}
			if (request.stage === "open") {
				if (!isDeepStrictEqual(facts, input)) throw new Error("Agent database open differs from its captured owner");
			} else {
				const received = isRecord(facts) ? facts.identity : void 0;
				if (!isRecord(received) || received.kind !== "file" || typeof received.physicalIdentity !== "string" || typeof received.incarnation !== "string" || typeof received.nativeLocation !== "string" || nativeIdentity && !isDeepStrictEqual(received, nativeIdentity)) throw new Error("Agent database operation belongs to another native owner");
				const receivedIdentity = {
					kind: "file",
					physicalIdentity: received.physicalIdentity,
					incarnation: received.incarnation,
					nativeLocation: received.nativeLocation
				};
				assertExistingDatabaseIdentity(pathname, `file:${receivedIdentity.physicalIdentity}`);
				if (expectedIdentity && receivedIdentity.physicalIdentity !== expectedIdentity.physicalIdentity) throw new Error("Agent database operation differs from its expected physical file");
				acceptFileIdentity({
					kind: "file",
					physicalIdentity: receivedIdentity.physicalIdentity,
					nativeLocation: receivedIdentity.nativeLocation
				});
				assertCallerCurrent?.();
				nativeIdentity ??= receivedIdentity;
			}
			return false;
		};
		const prepareGrant = (request) => {
			assertCurrent();
			assertCallerCurrent?.();
			if (request.stage === "open") registration?.begin();
		};
		return source.createAdmission({
			nativeLocations,
			assertCurrent,
			authorize(request) {
				if (authorizeNative(request)) return;
				source.assertCurrent();
				prepareGrant(request);
				if (request.stage === "prepare" && nativeIdentity && isRecord(request.facts)) {
					receiveValidation?.(nativeIdentity.physicalIdentity, request.facts.validation);
					receiveValidation = void 0;
				}
			}
		})(operation);
	};
	const open = (source, assertCallerCurrent) => {
		assertCurrent();
		source.assertCurrent();
		assertCallerCurrent?.();
		opening ??= (async () => {
			const store = await openAgentDatabaseSqliteWorkerStore({
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.agentDatabaseExecution),
				databasePath: pathname,
				input,
				existingOnly: true
			}, {
				stateContext: context,
				stateDatabasePath: context.admission.databasePath,
				assertCurrent,
				createAdmission: admission(source, void 0, assertCallerCurrent),
				onNativeStopped: (stopped) => {
					nativeStopped = stopped;
				}
			});
			if (!store) return;
			openedStore = store;
			try {
				assertCurrent();
				return store;
			} catch (error) {
				try {
					await store.close();
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Agent open and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
		})().catch((error) => {
			openingFailed = true;
			throw error;
		});
		const attempt = opening;
		return attempt.then((store) => {
			if (!store && opening === attempt) opening = void 0;
			return store;
		});
	};
	async function runExisting(source, operation, assertCallerCurrent) {
		const store = await open(source, assertCallerCurrent);
		assertCurrent();
		assertCallerCurrent?.();
		source.assertCurrent();
		if (!store) return;
		if (!nativeIdentity) {
			const registration = captureOpenClawAgentDatabaseRegistration({
				agentId,
				agentPath: pathname,
				admission: context.admission
			});
			await settleAgentRegistration(registration, async () => {
				await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
					type: "database.prepareWrite",
					input: void 0
				}), context, assertCurrent, admission(source, registration, assertCallerCurrent));
				assertCurrent();
				source.assertCurrent();
			});
			if (quickCheckPending) {
				quickCheckPending = false;
				requestOpenClawAgentDatabaseQuickCheck({
					path: pathname,
					env: input.environment
				});
			}
		}
		return runSqliteWorkerStoreOperation(store, operation, context, assertCurrent, admission(source, void 0, assertCallerCurrent));
	}
	return {
		failed: () => openingFailed || Boolean(openedStore && !isSqliteWorkerStoreAvailable(openedStore)),
		runExisting: (source, operation, assertCallerCurrent) => runExisting(source, operation, assertCallerCurrent),
		close() {
			retiring = true;
			closing ??= (async () => {
				const errors = [];
				if (opening) try {
					await opening.then((store) => store?.close(), () => closeUnclaimedSharedStateSqliteWorkers(pathname));
				} catch (error) {
					errors.push(error);
				}
				if (nativeStopped && lease) try {
					await cleanupRetiredAgentDatabaseLease({
						context,
						stopped: nativeStopped,
						assertOwned: assertCleanupOwned,
						lease
					});
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw new AggregateError(errors, "Agent native close and lease cleanup failed", { cause: errors[0] });
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution.ts
const log = createSubsystemLogger("state/agent-db");
const executionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionOwners"), () => ({ owners: /* @__PURE__ */ new Map() }));
const executions = executionState.owners;
const IDLE_EXECUTION_MS = 6e4;
const runInExecutionOwnerContext = AsyncLocalStorage.snapshot();
/** These native-only scopes still need their complete owning caller cutover. */
function supportsOpenClawAgentDatabaseExecution(options) {
	return !isIncognitoOpenClawAgentSqlitePath(resolveOpenClawAgentSqlitePath(options), options) && getOpenClawDatabaseMaintenanceScope()?.ownsSchemaMaintenance !== true && !hasAgentDatabaseMaintenanceAuthority() && !getAgentDeletionDatabaseCleanup(options);
}
/** Borrow before callers yield; native opening stays lazy and release joins owned work. */
function captureOpenClawAgentDatabaseExecution(options, constraints = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	if (!supportsOpenClawAgentDatabaseExecution(options)) throw new Error("This agent database scope still requires its existing native owner");
	const context = captureOpenClawStateWorkerContext({ env: options.env });
	const existing = executions.get(pathname);
	if (existing) {
		if (existing.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${existing.agentId}; requested agent ${agentId}.`);
		if (existing.sharedDatabaseKey !== context.admission.identity.key) throw new Error("Agent database execution belongs to another shared-state database; drain its existing resources before changing the state directory.");
		return existing.borrow(constraints.expectedIdentity);
	}
	const executionOptions = {
		agentId,
		path: pathname,
		env: context.environment
	};
	let retired = false;
	let borrowers = 0;
	let generation;
	let fileIdentity;
	let nativeClosing;
	let cleanupFailure;
	let closing;
	let unregisterShared;
	let idleTimer;
	const clearIdleTimer = () => {
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const reportCleanupFailure = (error) => {
		try {
			log.warn(`Agent database idle cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	};
	const finishRetirement = () => {
		retired = true;
		if (executions.get(pathname) !== owner) return;
		executions.delete(pathname);
		unregisterAgent();
		unregisterShared?.();
	};
	const assertCurrent = () => {
		if (retired || executions.get(pathname) !== owner || !supportsOpenClawAgentDatabaseExecution(executionOptions)) throw new Error("Agent database execution admission is closed");
		context.admission.assertCurrent();
		assertAgentDatabaseAdmitted(agentId, { env: context.environment });
	};
	const closeNative = (expected) => {
		if (expected && generation !== expected) return Promise.resolve();
		clearIdleTimer();
		if (nativeClosing) return nativeClosing;
		const captured = generation;
		if (!captured) return Promise.resolve();
		const result = captured.close().then(() => {
			if (generation === captured) {
				generation = void 0;
				cleanupFailure = void 0;
				if (executionState.idle === owner) executionState.idle = void 0;
			}
		}, (error) => {
			cleanupFailure = { error };
			throw error;
		});
		nativeClosing = result;
		result.finally(() => {
			if (nativeClosing === result) nativeClosing = void 0;
		}).catch(() => void 0);
		return result;
	};
	async function run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure = false) {
		assertCurrent();
		assertCallerCurrent?.();
		const pending = cache.pending.get(pathname);
		if (pending) {
			if (pending.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${pending.agentId}`);
			await pending.promise;
			pending.controller.signal.throwIfAborted();
			assertCurrent();
		}
		if (nativeClosing) {
			await nativeClosing;
			assertCurrent();
		}
		if (cleanupFailure) throw cleanupFailure.error;
		if (!generation) {
			for (let idle = executionState.idle; idle && idle !== owner; idle = executionState.idle) {
				await idle.closeIdle();
				assertCurrent();
				source.assertCurrent();
				assertCallerCurrent?.();
			}
			if (!generation) {
				const created = createAgentDatabaseNativeGeneration(agentId, pathname, context, assertCurrent, () => {
					if (executions.get(pathname) !== owner || generation !== created || !nativeClosing) throw new Error("Agent cleanup no longer owns its original execution reference");
				}, expectedIdentity ?? fileIdentity, (received) => {
					if (fileIdentity && fileIdentity.physicalIdentity !== received.physicalIdentity) throw new Error("Agent database execution belongs to another physical file");
					fileIdentity ??= Object.freeze({ ...received });
				});
				generation = created;
			}
		}
		const current = generation;
		try {
			return await current.runExisting(source, operation, assertCallerCurrent);
		} catch (error) {
			const nativeFailed = current.failed();
			if (generation === current && (nativeFailed || retireNativeOnFailure)) try {
				if (nativeFailed) await owner.close();
				else await closeNative(current);
			} catch (cleanupError) {
				throw retainSqliteWorkerErrorCode(new AggregateError([error, cleanupError], "Agent operation and cleanup failed", { cause: error }), error);
			}
			throw error;
		}
	}
	const owner = {
		agentId,
		get sharedDatabaseKey() {
			return context.admission.identity.key;
		},
		assertCurrent,
		borrow(expected) {
			const expectedIdentity = expected ? Object.freeze({ ...expected }) : void 0;
			assertCurrent();
			if (expectedIdentity) {
				if (fileIdentity && fileIdentity.physicalIdentity !== expectedIdentity.physicalIdentity) throw new Error("Agent database borrower belongs to another physical file");
				assertExistingDatabaseIdentity(pathname, `file:${expectedIdentity.physicalIdentity}`);
			}
			observeOpenClawDatabaseMaintenanceResource(unregisterAgent);
			borrowers += 1;
			clearIdleTimer();
			if (executionState.idle === owner && !nativeClosing && !cleanupFailure) executionState.idle = void 0;
			let released = false;
			let release;
			const pending = /* @__PURE__ */ new Set();
			const assertReferenceCurrent = () => {
				assertCurrent();
				if (expectedIdentity) {
					if (fileIdentity && fileIdentity.physicalIdentity !== expectedIdentity.physicalIdentity) throw new Error("Agent database borrower belongs to another physical file");
					assertExistingDatabaseIdentity(pathname, `file:${expectedIdentity.physicalIdentity}`);
				}
			};
			const assertBorrowed = () => {
				if (released) throw new Error("Agent database execution reference is released");
				assertReferenceCurrent();
			};
			return {
				agentId,
				path: pathname,
				assertCurrent: assertBorrowed,
				async runExisting(source, operation, runOptions) {
					assertBorrowed();
					const result = run(source, operation, assertReferenceCurrent, expectedIdentity, runOptions?.retireNativeOnFailure);
					pending.add(result);
					result.finally(() => pending.delete(result)).catch(() => void 0);
					return result;
				},
				release() {
					released = true;
					release ??= (async () => {
						await Promise.allSettled(pending);
						borrowers -= 1;
						if (borrowers !== 0 || retired || cleanupFailure) return;
						if (generation && !nativeClosing && !executionState.idle) {
							executionState.idle = owner;
							const timer = runInExecutionOwnerContext(() => setTimeout(() => {
								if (idleTimer !== timer || executionState.idle !== owner) return;
								owner.closeIdle().catch(reportCleanupFailure);
							}, IDLE_EXECUTION_MS));
							idleTimer = timer;
							timer.unref();
							return;
						}
						try {
							await owner.closeIdle();
						} catch (error) {
							reportCleanupFailure(error);
						}
					})();
					return release;
				}
			};
		},
		async closeIdle() {
			if (cleanupFailure) throw cleanupFailure.error;
			await closeNative();
			if (borrowers === 0 && !generation) finishRetirement();
		},
		close() {
			retired = true;
			closing ??= (async () => {
				await closeNative();
				finishRetirement();
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
	const unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
		agentId,
		path: pathname,
		revoke() {
			retired = true;
			clearIdleTimer();
		},
		close: () => owner.close()
	});
	try {
		unregisterShared = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
			if (!identity || identity.key === context.admission.identity.key) await owner.close();
		} });
	} catch (error) {
		unregisterAgent();
		throw error;
	}
	executions.set(pathname, owner);
	try {
		return owner.borrow(constraints.expectedIdentity);
	} catch (error) {
		executions.delete(pathname);
		unregisterAgent();
		unregisterShared?.();
		throw error;
	}
}
//#endregion
export { captureOpenClawAgentDatabaseExecution as t };
