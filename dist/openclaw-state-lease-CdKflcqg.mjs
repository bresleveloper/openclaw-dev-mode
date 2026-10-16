import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { d as sleepWithAbort, n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { a as isSqliteLockError, o as isSqliteNativeOpenFailure, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { a as createOpenClawStateLeaseLostError, i as createOpenClawStateLeaseError, n as OpenClawStateLeaseError, r as createOpenClawStateLeaseAbortError, t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DoGHpXtD.mjs";
import "./backoff-BrzXG7iD.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { u as isSqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { t as startOpenClawStateLeaseHeartbeat } from "./openclaw-state-lease-heartbeat-C_t8XxLa.mjs";
import { i as leaseHeartbeatState } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { a as renewOpenClawStateLease, i as releaseOpenClawStateLeaseBestEffort, n as prepareLeaseDatabase, o as resolveLeaseDatabasePath, r as releaseOpenClawStateLease, s as verifyOpenClawStateLeaseOwnership, t as STATE_LEASE_WRITE_BACKOFF } from "./openclaw-state-lease-storage-CWBFhswN.mjs";
import { t as createOpenClawStateLeaseWorkerOwner } from "./openclaw-state-lease-worker-owner-CVocgZbX.mjs";
import { n as createOpenClawStateLeaseWorkerStorage, t as acquireLease } from "./openclaw-state-lease-worker-storage-aVIu1a8V.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-state-lease-acquisition.ts
const log = createSubsystemLogger("state/lease");
/** Wait for recorded holders; each storage owner admits and settles its own write. */
async function acquireOpenClawStateLease(params) {
	const startedAt = performance.now();
	let deadline = startedAt + params.waitMs;
	let preparation = params.prepare;
	let attempt = 0;
	let lastReportedHolder;
	let contentionReported = false;
	const cancellation = params.signal ? new AbortController() : void 0;
	let aborted;
	const abort = () => {
		aborted ??= new OpenClawStateLeaseAcquisitionError(params.label, {
			kind: "aborted",
			reason: "caller-signal",
			elapsedMs: Math.max(0, Math.round(performance.now() - startedAt))
		}, params.signal?.reason);
		cancellation?.abort(aborted);
		return aborted;
	};
	const assertCurrent = () => {
		params.assertCurrent();
		if (params.signal?.aborted) throw abort();
	};
	params.signal?.addEventListener("abort", abort, { once: true });
	try {
		while (true) {
			assertCurrent();
			let outcome;
			let acquiring = false;
			try {
				if (preparation) {
					const prepare = preparation;
					preparation = void 0;
					prepare();
					deadline = performance.now() + params.waitMs;
				}
				acquiring = true;
				outcome = await params.acquire(assertCurrent, cancellation?.signal);
			} catch (error) {
				if (!(error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_STORAGE_FAILED") && !isSqliteLockError(error) && !isSqliteNativeOpenFailure(error) && sqliteExtendedResultCode(error) === void 0 && !isSqliteWorkerError(error, "unavailable") && !isSqliteWorkerError(error, "overloaded") && !isSqliteWorkerError(error, "closed")) throw error;
				const failure = error instanceof OpenClawStateLeaseError ? error.cause : error;
				if (isSqliteLockError(failure)) {
					assertCurrent();
					const remainingMs = deadline - performance.now();
					if (acquiring && remainingMs > 0) {
						if (!contentionReported) {
							log.warn(`Waiting for ${params.label} after SQLite lock contention.`);
							contentionReported = true;
						}
						try {
							await sleepWithAbort(Math.min(remainingMs, 25), params.signal);
						} catch (sleepError) {
							assertCurrent();
							throw sleepError;
						}
						assertCurrent();
						if (performance.now() < deadline) continue;
					}
				}
				throw new OpenClawStateLeaseAcquisitionError(params.label, {
					kind: "store-unavailable",
					reason: isSqliteLockError(failure) ? "sqlite-busy" : "storage-error"
				}, error);
			}
			if (outcome.kind === "acquired") {
				params.acquired(outcome.expiresAt);
				assertCurrent();
				return;
			}
			assertCurrent();
			const now = performance.now();
			if (now >= deadline) throw new OpenClawStateLeaseAcquisitionError(params.label, outcome);
			const holderIdentity = `${outcome.holder.owner}:${outcome.holder.epoch}`;
			if (lastReportedHolder !== holderIdentity) {
				lastReportedHolder = holderIdentity;
				const expiry = outcome.holder.expiresAt === null ? "has no recorded expiry" : `expires at ${new Date(outcome.holder.expiresAt).toISOString()}`;
				log.warn(`Waiting for ${params.label} held by ${outcome.holder.owner}; current lease ${expiry}.`);
			}
			attempt += 1;
			try {
				await sleepWithAbort(Math.min(deadline - now, computeBackoff(STATE_LEASE_WRITE_BACKOFF, attempt)), params.signal);
			} catch (error) {
				assertCurrent();
				throw error;
			}
		}
	} finally {
		params.signal?.removeEventListener("abort", abort);
	}
}
//#endregion
//#region src/state/openclaw-state-lease-cleanup.ts
/** Keep unfinished lease disposal with its original resource owner. */
function createOpenClawStateLeaseCleanup(params) {
	const operationSettled = createDeferredCore();
	let complete = false;
	let attempt;
	let unregister;
	const databaseIdentity = params.context?.admission.identity;
	const finish = () => {
		if (complete) return Promise.resolve();
		return attempt ??= Promise.resolve().then(() => params.finish()).then(() => {
			complete = true;
			unregister?.();
		}).catch((error) => {
			attempt = void 0;
			throw error;
		});
	};
	const resource = { async close(identity) {
		if (complete || identity && databaseIdentity?.key !== identity.key && databaseIdentity?.canonicalPath !== identity.canonicalPath) return;
		params.revoke();
		await operationSettled.promise;
		await finish();
	} };
	params.maintenanceScope?.own(resource, "shared-leases", () => resource.close());
	if (params.context) unregister = registerOpenClawStateDatabaseAsyncResource(resource);
	return { async run(operation, prepareCleanup) {
		let outcome;
		try {
			outcome = {
				ok: true,
				value: await operation()
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		}
		try {
			const workerOwner = params.workerOwner();
			prepareCleanup();
			try {
				await finish();
			} catch (cleanupError) {
				const combined = !outcome.ok && outcome.error !== cleanupError ? createSqliteLifecycleAggregateError([outcome.error, cleanupError], "State lease operation and cleanup failed", outcome.error) : cleanupError;
				workerOwner?.rethrowIfUncertain(combined, void 0);
				throw combined;
			}
			if (outcome.ok) await workerOwner?.drain();
			else workerOwner?.rethrowIfUncertain(outcome.error, void 0);
		} finally {
			operationSettled.resolve();
		}
		if (!outcome.ok) throw outcome.error;
		return outcome.value;
	} };
}
//#endregion
//#region src/state/openclaw-state-lease-options.ts
const MIN_LEASE_MS = 1e3;
function invalidInput(message) {
	return new OpenClawStateLeaseError(message, { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
}
function validateDuration(value, label, minimum, maximum) {
	if (!Number.isInteger(value) || value < minimum || value > maximum) throw invalidInput(`${label} must be an integer between ${minimum} and ${maximum}`);
	return value;
}
function validateNonEmptyString(value, label) {
	if (typeof value !== "string" || !value.trim() || value.includes("\0")) throw invalidInput(`${label} must be a non-empty string without NUL bytes`);
	return value;
}
function validateOpenClawStateLeaseOptions(options) {
	if (typeof options !== "object" || options === null || Array.isArray(options)) throw invalidInput("state lease options must be an object");
	if (options.signal !== void 0 && !(options.signal instanceof AbortSignal)) throw invalidInput("state lease signal must be an AbortSignal");
	const database = options.database;
	if (typeof database !== "object" || database === null || Array.isArray(database)) throw invalidInput("state lease database must be an object");
	if (database.scope !== "shared") throw invalidInput("state lease database scope must be shared");
	if (database.schemaPolicy !== void 0 && database.schemaPolicy !== "existing") throw invalidInput("state lease schema policy is invalid");
	const leaseLabel = options.leaseLabel === void 0 ? "state lease" : validateNonEmptyString(options.leaseLabel, "state lease label");
	const operationLabel = options.operationLabel === void 0 ? "state.lease" : validateNonEmptyString(options.operationLabel, "state lease operationLabel");
	return {
		scope: validateNonEmptyString(options.scope, `${leaseLabel} scope`),
		key: validateNonEmptyString(options.key, `${leaseLabel} key`),
		database,
		leaseMs: validateDuration(options.leaseMs, `${leaseLabel} leaseMs`, MIN_LEASE_MS, MAX_TIMER_TIMEOUT_MS),
		waitMs: validateDuration(options.waitMs, `${leaseLabel} waitMs`, 0, MAX_TIMER_TIMEOUT_MS),
		signal: options.signal,
		prepareDatabase: options.prepareDatabase === true,
		heartbeat: options.heartbeat,
		processBound: options.processBound === true,
		leaseLabel,
		operationLabel
	};
}
//#endregion
//#region src/state/openclaw-state-lease-process-exit.ts
const processExitLeaseCleanups = /* @__PURE__ */ new Set();
let processExitListenerInstalled = false;
function runProcessExitLeaseCleanups() {
	processExitListenerInstalled = false;
	const previousForceConsoleToStderr = loggingState.forceConsoleToStderr;
	loggingState.forceConsoleToStderr = true;
	try {
		for (const cleanup of processExitLeaseCleanups) try {
			cleanup();
		} catch {}
		processExitLeaseCleanups.clear();
	} finally {
		loggingState.forceConsoleToStderr = previousForceConsoleToStderr;
	}
}
function registerProcessExitLeaseCleanup(cleanup) {
	processExitLeaseCleanups.add(cleanup);
	if (!processExitListenerInstalled) {
		process.once("exit", runProcessExitLeaseCleanups);
		processExitListenerInstalled = true;
	}
	return () => {
		processExitLeaseCleanups.delete(cleanup);
		if (processExitLeaseCleanups.size === 0 && processExitListenerInstalled) {
			process.removeListener("exit", runProcessExitLeaseCleanups);
			processExitListenerInstalled = false;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-lease.ts
/** Run one trusted operation under a host-owned SQLite lease. */
async function withOpenClawStateLease(options, run) {
	return runStateLeaseOwner({
		kind: "native",
		options,
		run
	});
}
/**
* Keep SQLite work in owned workers. The callback must not await closing its
* own state database: canonical close waits for this complete lease operation.
* Renewal uses the parent timer unless an independent worker is requested.
*/
async function withOpenClawStateLeaseAsync(options, context, run) {
	return runStateLeaseOwner({
		kind: "worker",
		options: {
			...options,
			database: {
				scope: "shared",
				options: {
					path: context.admission.databasePath,
					env: context.environment
				}
			}
		},
		context,
		run
	});
}
function runStateLeaseOwner(invocation) {
	const maintenance = invocation.kind === "worker" ? invocation.context.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
	const run = () => runStateLeaseOwnerInScope(invocation, maintenance);
	return maintenance ? maintenance.run(() => maintenance.track(run())) : run();
}
async function runStateLeaseOwnerInScope(invocation, maintenance) {
	const validated = validateOpenClawStateLeaseOptions(invocation.options);
	const owner = randomUUID();
	const identity = {
		scope: validated.scope,
		key: validated.key,
		owner,
		leaseLabel: validated.leaseLabel
	};
	let closed = false;
	let disposed = false;
	let phase = "acquiring";
	let heartbeatStopped = true;
	const heartbeatCleanups = /* @__PURE__ */ new Set();
	let workerHeartbeat;
	let startingHeartbeat;
	let timerHeartbeat;
	let asyncOwnership;
	const expiryObservation = invocation.kind === "worker" ? new BigInt64Array(new SharedArrayBuffer((leaseHeartbeatState.startupPhase + 1) * BigInt64Array.BYTES_PER_ELEMENT)) : void 0;
	const workerStorage = invocation.kind === "worker" ? createOpenClawStateLeaseWorkerStorage(invocation.context, validated.processBound) : void 0;
	let workerOperations;
	let assertAcquisitionCurrent;
	let confirmedExpiresAt;
	const leaseLost = new AbortController();
	const operationSignal = validated.signal ? AbortSignal.any([validated.signal, leaseLost.signal]) : leaseLost.signal;
	const heartbeatMs = Math.max(250, Math.min(3e4, Math.floor(validated.leaseMs / 3)));
	let cancelExpiry;
	let heartbeat;
	let runTimerRenewal;
	const abortLost = (cause) => {
		if (!leaseLost.signal.aborted) leaseLost.abort(cause instanceof OpenClawStateLeaseError ? cause : createOpenClawStateLeaseLostError(validated, cause));
	};
	const assertActive = () => {
		if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
		if (validated.signal?.aborted) throw createOpenClawStateLeaseAbortError(validated.signal, "operation", validated.leaseLabel);
		if (closed || timerHeartbeat?.isExpired()) {
			abortLost();
			throw leaseLost.signal.reason;
		}
	};
	function stopWorker() {
		workerHeartbeat?.stop().catch(abortLost);
		startingHeartbeat?.stop().catch(abortLost);
	}
	function stopTimer() {
		timerHeartbeat?.stopRenewal();
	}
	let unregisterProcessExitCleanup;
	if (workerStorage) workerOperations = createOpenClawStateLeaseWorkerOwner({
		identity: {
			scope: identity.scope,
			key: identity.key,
			owner: identity.owner
		},
		databasePath: workerStorage.path,
		sourceContext: invocation.kind === "worker" ? invocation.context : void 0,
		expiryObservation: expiryObservation?.buffer,
		assertCurrent(purpose) {
			if (disposed) throw createOpenClawStateLeaseError("OPENCLAW_STATE_LEASE_LOST", "State lease owner is closed");
			if (purpose === "release") {
				if (phase !== "draining" || !heartbeatStopped) throw new Error("State lease cleanup has not joined its heartbeat");
				return;
			}
			workerStorage.assertCurrent();
			if (purpose === "acquire") {
				if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
				if (phase !== "acquiring") throw new Error("State lease acquisition has already settled");
				assertAcquisitionCurrent?.();
				return;
			}
			assertActive();
			if (phase !== "owned") throw new Error("State lease no longer admits operations");
			workerHeartbeat?.assertRunning();
		}
	});
	const releaseOwned = async () => {
		phase = "draining";
		const params = {
			...identity,
			database: validated.database,
			operationLabel: validated.operationLabel
		};
		const execution = workerOperations;
		await releaseOpenClawStateLeaseBestEffort(params, workerStorage && execution ? () => workerStorage.release(execution, validated.operationLabel) : void 0);
		await execution?.settle();
	};
	workerStorage?.assertCurrent();
	const cleanup = createOpenClawStateLeaseCleanup({
		maintenanceScope: maintenance,
		context: invocation.kind === "worker" ? invocation.context : void 0,
		workerOwner: () => workerOperations,
		revoke() {
			closed = true;
			abortLost(/* @__PURE__ */ new Error("State lease resource owner is closing"));
			stopWorker();
		},
		async finish() {
			phase = "draining";
			closed = true;
			await timerHeartbeat?.close();
			await workerOperations?.settle();
			const failures = [];
			for (const heartbeatCleanup of heartbeatCleanups) try {
				await heartbeatCleanup.close();
				heartbeatCleanups.delete(heartbeatCleanup);
			} catch (error) {
				failures.push(error);
			}
			if (failures.length) throw createSqliteLifecycleAggregateError(failures, "State lease heartbeat cleanup failed", failures[0]);
			workerHeartbeat = void 0;
			heartbeatStopped = true;
			if (confirmedExpiresAt !== void 0 && (!workerOperations || workerOperations.canRelease())) await releaseOwned();
			await workerOperations?.settle();
			disposed = true;
			workerOperations?.close();
		}
	});
	const run = async () => {
		try {
			await acquireOpenClawStateLease({
				label: `${validated.leaseLabel} ${validated.scope}/${validated.key}`,
				waitMs: validated.waitMs,
				signal: validated.signal,
				assertCurrent() {
					if (leaseLost.signal.aborted) throw leaseLost.signal.reason;
				},
				prepare: invocation.kind === "native" && validated.prepareDatabase && validated.waitMs > 0 && validated.database.schemaPolicy !== "existing" ? () => prepareLeaseDatabase(validated.database) : void 0,
				acquire(assertCurrent, signal) {
					assertAcquisitionCurrent = assertCurrent;
					return workerStorage && workerOperations ? workerStorage.acquire(workerOperations, validated.leaseMs, validated.operationLabel, signal, expiryObservation !== void 0) : acquireLease(validated.database, {
						identity,
						operationLabel: validated.operationLabel,
						leaseMs: validated.leaseMs,
						processBound: validated.processBound
					}, assertCurrent, signal);
				},
				acquired(expiresAt) {
					confirmedExpiresAt = expiresAt;
					if (validated.signal?.aborted) throw createOpenClawStateLeaseAbortError(validated.signal, "operation", validated.leaseLabel);
				}
			});
		} catch (error) {
			workerOperations?.rethrowIfUncertain(error, void 0);
			throw error;
		}
		if (confirmedExpiresAt === void 0) throw new Error("State lease acquisition did not record its owner");
		const acquiredAt = confirmedExpiresAt - validated.leaseMs;
		phase = "owned";
		unregisterProcessExitCleanup = registerProcessExitLeaseCleanup(() => {
			closed = true;
			workerOperations?.close();
			workerHeartbeat?.close();
			startingHeartbeat?.close();
			if (workerStorage || workerOperations && !workerOperations.canRelease()) return;
			releaseOpenClawStateLease({
				...identity,
				database: validated.database,
				operationLabel: validated.operationLabel
			});
		});
		const scheduleExpiry = () => {
			cancelExpiry?.();
			cancelExpiry = scheduleAbsoluteDeadline(confirmedExpiresAt ?? Date.now(), () => abortLost(), void 0, { unref: true });
		};
		const renewAndSchedule = () => {
			confirmedExpiresAt = renewOpenClawStateLease({
				...identity,
				database: validated.database,
				operationLabel: validated.operationLabel,
				leaseMs: validated.leaseMs
			});
			scheduleExpiry();
		};
		const renewOperation = () => {
			assertActive();
			if (workerHeartbeat) assertOperationOwned();
			else {
				renewAndSchedule();
				runTimerRenewal = AsyncLocalStorage.snapshot();
			}
		};
		const renewFromTimer = () => {
			if (!runTimerRenewal) return;
			try {
				runTimerRenewal(renewAndSchedule);
			} catch (error) {
				if (error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_LOST" || confirmedExpiresAt !== void 0 && Date.now() >= confirmedExpiresAt) abortLost(error);
			}
		};
		const assertOperationOwned = (transaction) => {
			assertActive();
			const params = {
				...identity,
				database: validated.database,
				transaction
			};
			const expiresAt = verifyOpenClawStateLeaseOwnership(params);
			if (workerHeartbeat) {
				try {
					workerHeartbeat.assertResponsive(expiresAt);
				} catch (error) {
					abortLost(error);
					throw leaseLost.signal.reason;
				}
				assertActive();
				verifyOpenClawStateLeaseOwnership(params);
			}
		};
		const renewForHandoff = () => {
			const params = {
				...identity,
				database: validated.database
			};
			try {
				return renewOpenClawStateLease({
					...params,
					operationLabel: validated.operationLabel,
					leaseMs: validated.leaseMs
				});
			} catch (error) {
				if (!isSqliteLockError(error)) throw error;
				return verifyOpenClawStateLeaseOwnership(params);
			}
		};
		const startWorker = async (expiresAt) => {
			const start = async (startupContext) => {
				let started;
				let startupCleanup;
				try {
					started = startOpenClawStateLeaseHeartbeat({
						path: workerStorage?.path ?? resolveLeaseDatabasePath(validated.database),
						startupContext,
						identity,
						leaseMs: validated.leaseMs,
						acquiredAt,
						heartbeatMs,
						expiresAt,
						onLost: abortLost,
						expiryObservation,
						renewDuringStartup: () => {
							assertActive();
							if (!workerStorage || !workerOperations) return renewForHandoff();
							const execution = workerOperations;
							return workerStorage.renew(execution, validated.leaseMs, validated.operationLabel, operationSignal).catch((error) => {
								execution.rethrowIfUncertain(error, void 0);
								if (!isSqliteLockError(error)) throw error;
								return workerStorage.verify(execution, operationSignal);
							});
						},
						retainCleanup(heartbeatCleanup) {
							startupCleanup = heartbeatCleanup;
							heartbeatCleanups.add(heartbeatCleanup);
							heartbeatStopped = false;
						}
					});
					startingHeartbeat = started;
					if (validated.signal?.aborted || leaseLost.signal.aborted) stopWorker();
					await started.ready;
					assertActive();
					startupContext?.admission.assertCurrent();
					workerHeartbeat = started;
				} catch (error) {
					try {
						await startupCleanup?.close();
						heartbeatStopped = [...heartbeatCleanups].every((entry) => !entry.pending);
					} catch (stopError) {
						throw createSqliteLifecycleAggregateError([error, stopError], "state lease heartbeat startup and stop failed", error);
					}
					throw error;
				} finally {
					if (heartbeatStopped || workerHeartbeat === started) startingHeartbeat = void 0;
				}
			};
			if (workerStorage) await workerStorage.withRetainedStartup(start, assertActive);
			else await start();
		};
		const drain = async () => {
			await timerHeartbeat?.stopRenewal();
			await workerOperations?.drain();
		};
		let result;
		try {
			const execution = workerOperations;
			if (validated.heartbeat === "worker") {
				validated.signal?.addEventListener("abort", stopWorker, { once: true });
				await startWorker(confirmedExpiresAt);
				asyncOwnership = workerStorage ? workerHeartbeat : void 0;
			} else if (workerStorage) {
				if (!execution || !expiryObservation) throw new Error("Async state lease timer owner is unavailable");
				const timer = workerStorage.startTimer(execution, {
					observation: expiryObservation,
					heartbeatMs,
					leaseMs: validated.leaseMs,
					operationLabel: validated.operationLabel,
					signal: operationSignal,
					onLost: abortLost
				});
				timerHeartbeat = timer;
				asyncOwnership = timer;
				heartbeatStopped = false;
				operationSignal.addEventListener("abort", stopTimer, { once: true });
				if (operationSignal.aborted) stopTimer();
			} else {
				scheduleExpiry();
				runTimerRenewal = AsyncLocalStorage.snapshot();
				heartbeat = setInterval(renewFromTimer, heartbeatMs);
				heartbeat.unref?.();
			}
			if (invocation.kind === "worker") {
				const verification = asyncOwnership;
				if (!execution || !verification) throw new Error("Async state lease heartbeat did not start");
				const verify = async (renewLease = false) => {
					assertActive();
					const expiresAt = await (renewLease ? verification.renew() : verification.verify());
					assertActive();
					workerHeartbeat?.assertRunning();
					confirmedExpiresAt = expiresAt;
				};
				await verify();
				const lease = {
					signal: operationSignal,
					assertOwned: async () => execution.run(() => verify()),
					renew: async () => execution.run(() => verify(true))
				};
				execution.bind(lease);
				result = await invocation.run(lease);
			} else {
				assertOperationOwned();
				const lease = {
					signal: operationSignal,
					renew: renewOperation,
					assertOwned: assertOperationOwned,
					...workerHeartbeat ? { assertOwnedAsync: async () => {
						assertActive();
						const nativeHeartbeat = workerHeartbeat;
						if (!nativeHeartbeat) {
							abortLost();
							throw leaseLost.signal.reason;
						}
						const expiresAt = await nativeHeartbeat.verify();
						assertActive();
						nativeHeartbeat.assertRunning();
						if (expiresAt <= Date.now()) {
							abortLost();
							assertActive();
						}
					} } : {},
					assertOwnedInTransaction: assertOperationOwned
				};
				workerOperations = createOpenClawStateLeaseWorkerOwner({
					lease,
					identity: {
						scope: identity.scope,
						key: identity.key,
						owner: identity.owner
					},
					databasePath: resolveLeaseDatabasePath(validated.database),
					assertCurrent: () => {
						assertActive();
						if (validated.heartbeat === "worker" || validated.database.schemaPolicy === "existing") throw new Error("This lease mode does not support worker writes");
						if (confirmedExpiresAt === void 0 || Date.now() >= confirmedExpiresAt) {
							abortLost();
							assertActive();
						}
					}
				});
				result = await invocation.run(lease);
			}
			await drain();
		} catch (error) {
			let failure = error;
			try {
				await drain();
			} catch (drainError) {
				if (drainError !== error) failure = createSqliteLifecycleAggregateError([error, drainError], "state lease operation and drainage failed", error);
			}
			const authorityError = leaseLost.signal.aborted ? leaseLost.signal.reason : validated.signal?.aborted ? createOpenClawStateLeaseAbortError(validated.signal, "operation", validated.leaseLabel) : void 0;
			workerOperations?.rethrowIfUncertain(failure, authorityError);
			if (authorityError instanceof Error) {
				if (failure !== error && authorityError instanceof OpenClawStateLeaseError) throw createOpenClawStateLeaseError(authorityError.code, authorityError.message, failure);
				throw authorityError;
			}
			throw failure;
		}
		if (workerStorage) {
			assertActive();
			await asyncOwnership?.verify();
			assertActive();
		} else assertOperationOwned();
		return result;
	};
	return cleanup.run(run, () => {
		phase = "draining";
		closed = true;
		unregisterProcessExitCleanup?.();
		validated.signal?.removeEventListener("abort", stopWorker);
		operationSignal.removeEventListener("abort", stopTimer);
		clearInterval(heartbeat);
		cancelExpiry?.();
		heartbeat = void 0;
		cancelExpiry = void 0;
		runTimerRenewal = void 0;
	});
}
//#endregion
export { withOpenClawStateLeaseAsync as n, createOpenClawStateLeaseCleanup as r, withOpenClawStateLease as t };
