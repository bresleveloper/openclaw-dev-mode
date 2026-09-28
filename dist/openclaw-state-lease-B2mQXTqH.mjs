import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { a as isSqliteLockError, o as isSqliteNativeOpenFailure, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { T as StateDatabaseCoordinatorContentionError, s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration } from "./sqlite-file-generation-bF3ZcoQs.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, t as acquireOpenClawStateDatabaseFileExclusion } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { i as createOpenClawStateLeaseError, n as OpenClawStateLeaseError, r as createOpenClawStateLeaseAbortError, t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { a as isSqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as startOpenClawStateLeaseHeartbeat } from "./openclaw-state-lease-heartbeat-Bx8MXIzo.mjs";
import { r as leaseHeartbeatState } from "./openclaw-state-lease-heartbeat-shared-D-D6j71P.mjs";
import { a as prepareLeaseDatabase, c as releaseOpenClawStateLeaseBestEffort, d as verifyOpenClawStateLeaseOwnership, i as isOpenClawStateLeaseWriteContention, l as renewOpenClawStateLease, n as acquireLease, o as readLeaseDatabase, r as assertOpenClawStateLeaseOwnedInDatabase, s as releaseOpenClawStateLease, t as STATE_LEASE_WRITE_BACKOFF, u as resolveLeaseDatabasePath } from "./openclaw-state-lease-storage-BuA5j6zN.mjs";
import { t as createOpenClawStateLeaseWorkerOwner } from "./openclaw-state-lease-worker-owner-BTTWFunC.mjs";
import { t as createOpenClawStateLeaseWorkerStorage } from "./openclaw-state-lease-worker-storage-B5FJo3te.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-state-lease-acquisition.ts
/** Wait for recorded holders; each storage owner admits and settles its own write. */
async function acquireOpenClawStateLease(params) {
	const startedAt = performance.now();
	let deadline = startedAt + params.waitMs;
	let preparation = params.prepare;
	let attempt = 0;
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
			try {
				if (preparation) {
					const prepare = preparation;
					preparation = void 0;
					prepare();
					deadline = performance.now() + params.waitMs;
				}
				outcome = await params.acquire(assertCurrent, cancellation?.signal);
			} catch (error) {
				if (!(error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_STORAGE_FAILED") && !isOpenClawStateLeaseWriteContention(error) && !isSqliteNativeOpenFailure(error) && sqliteExtendedResultCode(error) === void 0 && !isSqliteWorkerError(error, "unavailable") && !isSqliteWorkerError(error, "overloaded") && !isSqliteWorkerError(error, "closed")) throw error;
				const failure = error instanceof OpenClawStateLeaseError ? error.cause : error;
				if (isOpenClawStateLeaseWriteContention(failure)) assertCurrent();
				throw new OpenClawStateLeaseAcquisitionError(params.label, {
					kind: "store-unavailable",
					reason: isSqliteLockError(failure) ? "sqlite-busy" : failure instanceof StateDatabaseCoordinatorContentionError ? "lifecycle-busy" : "storage-error"
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
//#region src/state/openclaw-state-lease-exclusion.ts
const activeOwners = new AsyncLocalStorage();
/** Independent work must acquire its own lease instead of inheriting a prior file owner. */
function runOutsideOpenClawStateLeaseScope(run) {
	return activeOwners.exit(run);
}
function fail(errors) {
	if (errors.length === 1) throw errors[0];
	throw createSqliteLifecycleAggregateError(errors, "state lease exclusion failed", errors[0]);
}
async function perform(owners, databasePath, operation, bindCaptured) {
	const errors = [];
	const participants = owners.map((owner) => ({
		owner,
		paused: false
	}));
	const assertActive = () => {
		for (const { owner } of participants) owner.params.assertActive();
	};
	const onLost = (error) => {
		for (const { owner } of participants) owner.params.onLost(error);
	};
	const distrustCanonical = (error) => {
		for (const { owner } of participants) owner.cleanupAllowed = false;
		onLost(error);
	};
	let result;
	let lifecycle;
	let exclusion;
	let timer;
	let generation;
	let active = true;
	try {
		for (const participant of participants) {
			await participant.owner.params.pause();
			participant.paused = true;
			assertActive();
		}
		lifecycle = acquireStateDatabaseCoordinator({
			databasePath,
			busyTimeoutMs: 0
		});
		for (const participant of participants) participant.expiresAt = participant.owner.params.readExpiry(databasePath);
		exclusion = await acquireOpenClawStateDatabaseFileExclusion(databasePath);
		generation = readStableSqliteFileGeneration(databasePath);
		const held = exclusion;
		const deadline = Math.min(...participants.map((participant) => participant.expiresAt ?? 0));
		const assertCurrent = () => {
			if (!active) throw new Error("state lease file exclusion is no longer current");
			assertActive();
			held.assertCurrent();
			if (Date.now() >= deadline) {
				const error = /* @__PURE__ */ new Error("state lease expired during file exclusion");
				onLost(error);
				throw error;
			}
		};
		for (const { owner } of participants) owner.assertion = assertCurrent;
		timer = setTimeout(() => onLost(/* @__PURE__ */ new Error("state lease expired during file exclusion")), Math.max(1, deadline - Date.now()));
		timer.unref();
		assertCurrent();
		const captured = await held.runWithSourceReads(() => operation(assertCurrent));
		result = captured;
		assertCurrent();
		if (bindCaptured) {
			if (!sameSqliteFileGeneration(generation, readStableSqliteFileGeneration(databasePath))) throw new Error("state lease source generation changed before binding");
			const bindingErrors = [];
			try {
				await held.bindCaptured(assertCurrent, () => {
					const completion = bindCaptured(captured, assertCurrent);
					if (completion === void 0) {
						assertCurrent();
						for (const participant of participants) if (participant.owner.params.readExpiry(databasePath) !== participant.expiresAt) throw new Error("state lease changed during checkpoint binding");
					}
					return completion;
				});
			} catch (error) {
				bindingErrors.push(error);
			}
			try {
				const afterBinding = readStableSqliteFileGeneration(databasePath);
				const before = generation.database;
				const after = afterBinding.database;
				if (before.dev !== after.dev || before.ino !== after.ino || before.birthtimeNs !== after.birthtimeNs) throw new Error("state lease source identity changed during checkpoint binding");
				generation = afterBinding;
			} catch (error) {
				bindingErrors.push(error);
			}
			if (bindingErrors.length > 0) fail(bindingErrors);
			assertCurrent();
		}
	} catch (error) {
		errors.push(error);
	}
	active = false;
	for (const { owner } of participants) owner.assertion = void 0;
	clearTimeout(timer);
	if (exclusion) try {
		exclusion.assertCurrent();
		if (!generation || !sameSqliteFileGeneration(generation, readStableSqliteFileGeneration(databasePath))) throw new Error("state lease source generation changed during capture");
	} catch (error) {
		errors.push(error);
		distrustCanonical(new Error("state lease source binding refused", { cause: error }));
	}
	try {
		exclusion?.release();
	} catch (error) {
		errors.push(error);
		distrustCanonical(new Error("state lease file exclusion release failed", { cause: error }));
	}
	try {
		assertActive();
		for (const participant of participants) {
			const reopenedExpiry = participant.owner.params.readExpiry(databasePath);
			if (participant.expiresAt !== void 0 && reopenedExpiry !== participant.expiresAt) throw new Error("state lease changed during file exclusion");
			participant.expiresAt = reopenedExpiry;
		}
	} catch (error) {
		errors.push(error);
		distrustCanonical(new Error("state lease reopen refused", { cause: error }));
	} finally {
		try {
			lifecycle?.release();
		} catch (error) {
			errors.push(error);
			distrustCanonical(new Error("state lease exclusion release failed", { cause: error }));
		}
	}
	for (const participant of participants) try {
		assertActive();
		if (participant.expiresAt === void 0) throw new Error("state lease has no current durable expiry");
		if (participant.paused) await participant.owner.params.resume(participant.expiresAt);
		assertActive();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) fail(errors);
	return result;
}
function createOpenClawStateLeaseExclusion(params) {
	const ancestors = activeOwners.getStore() ?? [];
	const owner = {
		params,
		busy: false,
		cleanupAllowed: true,
		admissionClosed: false,
		admitted: []
	};
	const admit = (operation) => {
		const databasePath = owner.databasePath;
		if (!databasePath) throw new Error("state lease has not entered its owner scope");
		const participants = [...ancestors, owner].filter((candidate) => candidate.databasePath === databasePath);
		for (const candidate of participants) {
			candidate.params.assertActive();
			if (candidate.admissionClosed) throw new Error("state lease no longer accepts file exclusion");
			if (candidate.busy) throw new Error("state lease file exclusion is already in progress");
			if (candidate.params.databasePath() !== databasePath) throw new Error("state lease database path changed during exclusion");
		}
		for (const candidate of participants) candidate.busy = true;
		const task = operation(participants, databasePath).finally(() => {
			for (const candidate of participants) candidate.busy = false;
		});
		for (const candidate of participants) candidate.admitted.push(task);
		task.catch(() => void 0);
		return task;
	};
	return {
		canRelease: () => owner.cleanupAllowed,
		runWithOwnerScope(operation) {
			params.assertActive();
			owner.databasePath = params.databasePath();
			return activeOwners.run([...ancestors, owner], operation);
		},
		assertIfExcluded() {
			if (!owner.assertion) {
				if (owner.busy) throw new Error("state lease file exclusion is transitioning");
				return false;
			}
			owner.assertion();
			return true;
		},
		run(operation, bindCaptured) {
			return admit((participants, databasePath) => perform(participants, databasePath, operation, bindCaptured));
		},
		async drain() {
			const errors = [];
			let drained = 0;
			while (drained < owner.admitted.length) {
				const batch = owner.admitted.slice(drained);
				drained += batch.length;
				const results = await Promise.allSettled(batch);
				for (const result of results) if (result.status === "rejected") errors.push(result.reason);
			}
			owner.admissionClosed = true;
			if (errors.length > 0) fail(errors);
		}
	};
}
//#endregion
//#region src/state/openclaw-state-lease-options.ts
const MIN_LEASE_MS = 1e3;
function invalidInput$1(message) {
	return new OpenClawStateLeaseError(message, { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
}
function validateDuration(value, label, minimum, maximum) {
	if (!Number.isInteger(value) || value < minimum || value > maximum) throw invalidInput$1(`${label} must be an integer between ${minimum} and ${maximum}`);
	return value;
}
function validateNonEmptyString(value, label) {
	if (typeof value !== "string" || !value.trim() || value.includes("\0")) throw invalidInput$1(`${label} must be a non-empty string without NUL bytes`);
	return value;
}
function validateOpenClawStateLeaseOptions(options) {
	if (typeof options !== "object" || options === null || Array.isArray(options)) throw invalidInput$1("state lease options must be an object");
	if (options.signal !== void 0 && !(options.signal instanceof AbortSignal)) throw invalidInput$1("state lease signal must be an AbortSignal");
	const database = options.database;
	if (typeof database !== "object" || database === null || Array.isArray(database)) throw invalidInput$1("state lease database must be an object");
	if (database.scope !== "shared") throw invalidInput$1("state lease database scope must be shared");
	if (database.schemaPolicy !== void 0 && database.schemaPolicy !== "existing") throw invalidInput$1("state lease schema policy is invalid");
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
function invalidInput(message) {
	return createOpenClawStateLeaseError("OPENCLAW_STATE_LEASE_INVALID_INPUT", message);
}
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
	let fileExclusion;
	const heartbeatCleanups = /* @__PURE__ */ new Set();
	let workerHeartbeat;
	let startingHeartbeat;
	let timerHeartbeat;
	let asyncOwnership;
	const expiryObservation = invocation.kind === "worker" ? new BigInt64Array(new SharedArrayBuffer((leaseHeartbeatState.startupPhase + 1) * BigInt64Array.BYTES_PER_ELEMENT)) : void 0;
	const workerStorage = invocation.kind === "worker" ? createOpenClawStateLeaseWorkerStorage(invocation.context) : void 0;
	let workerOperations;
	let assertAcquisitionCurrent;
	let confirmedExpiresAt;
	const leaseLost = new AbortController();
	const operationSignal = validated.signal ? AbortSignal.any([validated.signal, leaseLost.signal]) : leaseLost.signal;
	const heartbeatMs = Math.max(250, Math.min(3e4, Math.floor(validated.leaseMs / 3)));
	let expiryTimer;
	let heartbeat;
	const abortLost = (cause) => {
		if (!leaseLost.signal.aborted) leaseLost.abort(cause instanceof OpenClawStateLeaseError ? cause : createOpenClawStateLeaseError("OPENCLAW_STATE_LEASE_LOST", `${validated.leaseLabel} ${validated.scope}/${validated.key} was lost`, cause));
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
			if (confirmedExpiresAt !== void 0 && (fileExclusion?.canRelease() ?? true) && (!workerOperations || workerOperations.canRelease())) await releaseOwned();
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
						leaseMs: validated.leaseMs
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
			if (workerStorage || !fileExclusion?.canRelease() || workerOperations && !workerOperations.canRelease()) return;
			releaseOpenClawStateLease({
				...identity,
				database: validated.database,
				operationLabel: validated.operationLabel
			});
		});
		const scheduleExpiry = () => {
			if (expiryTimer) clearTimeout(expiryTimer);
			expiryTimer = setTimeout(() => abortLost(), Math.max(1, (confirmedExpiresAt ?? Date.now()) - Date.now()));
			expiryTimer.unref?.();
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
			if (startingHeartbeat) throw new Error("state lease heartbeat is restarting");
			if (fileExclusion?.assertIfExcluded()) return;
			if (workerHeartbeat) assertOperationOwned();
			else renewAndSchedule();
		};
		const renewFromTimer = () => {
			try {
				renewAndSchedule();
			} catch (error) {
				if (error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_LOST") abortLost(error);
				else if (confirmedExpiresAt !== void 0 && Date.now() >= confirmedExpiresAt) abortLost(error);
			}
		};
		const assertOperationOwned = (transaction) => {
			assertActive();
			if (startingHeartbeat) throw new Error("state lease heartbeat is restarting");
			if (fileExclusion?.assertIfExcluded()) {
				if (transaction) throw new Error("a file-excluded lease cannot authorize a write transaction");
				return;
			}
			assertDatabaseOwner(transaction);
		};
		const assertDatabaseOwner = (transaction) => {
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
				if (!isOpenClawStateLeaseWriteContention(error)) throw error;
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
						existingOnly: !workerStorage && validated.database.schemaPolicy === "existing",
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
								if (!isOpenClawStateLeaseWriteContention(error)) throw error;
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
		fileExclusion = workerStorage ? void 0 : createOpenClawStateLeaseExclusion({
			databasePath: () => resolveLeaseDatabasePath(validated.database),
			assertActive,
			readExpiry: (databasePath) => {
				if (resolveLeaseDatabasePath(validated.database) !== databasePath) throw invalidInput("state lease database path changed during exclusion");
				return readLeaseDatabase(validated.database, (db) => assertOpenClawStateLeaseOwnedInDatabase(db, identity));
			},
			pause: async () => {
				confirmedExpiresAt = renewForHandoff();
				clearInterval(heartbeat);
				clearTimeout(expiryTimer);
				heartbeat = void 0;
				expiryTimer = void 0;
				await workerHeartbeat?.stop();
				workerHeartbeat = void 0;
			},
			resume: async (expiresAt) => {
				confirmedExpiresAt = expiresAt;
				if (validated.heartbeat === "worker") await startWorker(expiresAt);
				else {
					renewAndSchedule();
					heartbeat = setInterval(renewFromTimer, heartbeatMs);
					heartbeat.unref?.();
				}
				assertDatabaseOwner();
			},
			onLost: (error) => {
				if (!validated.signal?.aborted) abortLost(error);
			}
		});
		const drain = async () => {
			await timerHeartbeat?.stopRenewal();
			const errors = [];
			for (const finish of [() => workerOperations?.drain(), () => fileExclusion?.drain()]) try {
				await finish();
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "state lease drainage failed", errors[0]);
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
				if (!fileExclusion) throw new Error("Native state lease exclusion owner is unavailable");
				const exclusion = fileExclusion;
				result = await exclusion.runWithOwnerScope(() => {
					const lease = {
						withDatabaseFileExclusion: (operation, bindCaptured) => exclusion.run(operation, bindCaptured),
						signal: operationSignal,
						renew: renewOperation,
						assertOwned: assertOperationOwned,
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
							if (validated.heartbeat === "worker" || validated.database.schemaPolicy === "existing" || exclusion.assertIfExcluded()) throw new Error("This lease mode does not support worker writes");
							if (confirmedExpiresAt === void 0 || Date.now() >= confirmedExpiresAt) {
								abortLost();
								assertActive();
							}
						}
					});
					return invocation.run(lease);
				});
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
		clearTimeout(expiryTimer);
		heartbeat = void 0;
		expiryTimer = void 0;
	});
}
//#endregion
export { withOpenClawStateLeaseAsync as n, runOutsideOpenClawStateLeaseScope as r, withOpenClawStateLease as t };
