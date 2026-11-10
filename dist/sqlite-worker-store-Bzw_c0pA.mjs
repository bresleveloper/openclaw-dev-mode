import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { d as sleepWithAbort, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { n as runWithMainThreadTask } from "./main-thread-stall-BJxVH-It.mjs";
import { a as runtimeNeedsTypeScriptLoader, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { d as readDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { l as resolveQuarantineStorePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { n as acquireStateDatabaseSchemaLease, o as captureStateDatabaseAccess } from "./gateway-state-owner-X3EqhtYx.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { a as ensureSqliteLibrarySelected, r as captureSqliteWorkerClosePolicy } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { V as trackSqliteDatabaseAdmissionWorker, i as captureSqliteDatabaseAdmissions, mt as createSqliteDatabaseAdmissionCursor } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as installSqliteNativeRuntimeAdmission } from "./node-sqlite-CYaq-2Hb.mjs";
import { t as resolveNodeCompileCacheEnv } from "./node-compile-cache-env-BKjFxzRG.mjs";
import "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as createSqliteWorkerTransferReceiver, r as createSqliteWorkerTransferOwner } from "./sqlite-worker-transfer-BHUd6Qxu.mjs";
import { n as trackWorkerRequest, t as classifyWorkerRequest } from "./worker-request-diagnostics-BrY1pZl2.mjs";
import { n as retainSqliteWriteAdmissionService } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as resolveSqliteBrokerWorkerCount } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { c as SqliteWorkerError, n as SQLITE_WORKER_MAX_MESSAGE_BYTES, p as retainSqliteWorkerErrorCode, s as SqliteWorkerAdmissionTimeoutError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission, s as readSqliteWorkerExecutionAuthority } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as readSqliteWorkerRequestCustody, t as SqliteWorkerSlotCustody } from "./sqlite-worker-request-custody-Bj59t02j.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { s as sqliteWorkerRequestBytes, t as captureSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { isPromise } from "node:util/types";
import { deserialize, serialize } from "node:v8";
//#region src/infra/sqlite-worker-broker-admission.ts
const SQLITE_WORKER_ADMISSION_TIMEOUT_MS = 1e4;
/** Cleanup-only custody replaces maintenance scope; other jobs bind the caller's scope. */
function captureSqliteWorkerJobCustody(cleanupAccess) {
	return (scope) => cleanupAccess ? { cleanupAccess } : { maintenanceScope: scope ? scope.maintenanceScope : getOpenClawDatabaseMaintenanceScope() };
}
function createSqliteWorkerAdmissionWarning() {
	let nextWarning = 0;
	return (queueDepth, waitMs) => {
		const now = Date.now();
		if (now >= nextWarning) {
			nextWarning = now + SQLITE_WORKER_ADMISSION_TIMEOUT_MS;
			getChildLogger({ subsystem: "infra/sqlite-worker" }).warn("SQLite worker admission delayed", {
				queueDepth,
				waitMs
			});
		}
	};
}
function validateSqliteWorkerDatabaseLocator(databasePath) {
	const basename = path.basename(databasePath);
	if (!databasePath || databasePath.startsWith("file:") || basename === ":memory:" || basename === "incognito-openclaw-agent.sqlite") throw new Error("SQLite worker stores require a file-backed filesystem path; in-memory and incognito databases are not supported");
}
function captureSqliteWorkerOpen(options, stateContext, assertCurrent, custody = {}) {
	const { createAdmission, preparation, ...native } = custody;
	const inCaller = AsyncLocalStorage.snapshot();
	const ownedAdmission = options.admission;
	const checkOpening = ownedAdmission ? () => {
		assertCurrent?.();
		ownedAdmission.assertCurrent();
	} : assertCurrent;
	const assertOpening = checkOpening ? () => inCaller(checkOpening) : void 0;
	const databasePath = path.resolve(options.databasePath);
	if (options.admission && (!options.existingOnly || !options.admission.identity.startsWith("file:"))) throw new Error("Owned SQLite Worker admission requires an existing physical identity");
	assertOpening?.();
	const carrier = resolveRuntimeProcessEntrypointUrl("sqliteStore");
	const carrierUrl = options.runtimeGeneration?.resolve(carrier) ?? carrier;
	return {
		...native,
		maintenanceScope: custody.cleanupAccess ? void 0 : custody.maintenanceScope ?? getOpenClawDatabaseMaintenanceScope(),
		...preparation !== void 0 ? { preparation: serialize(preparation) } : {},
		runtimeGeneration: options.runtimeGeneration,
		carrierUrl,
		createAdmission: createAdmission ? (operation) => inCaller(createAdmission, operation) : void 0,
		assertCurrent: assertOpening,
		...options.admission ? {
			expectedIdentity: options.admission.identity,
			createOpenAdmission: () => {
				let granted = false;
				return {
					nativeLocations: [databasePath],
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						if (granted || request.stage !== "open") throw new Error("SQLite Worker open admission requested out of order");
						assertOpening();
						if (!grant()) throw new Error("SQLite Worker open admission expired");
						granted = true;
					})
				};
			}
		} : {},
		moduleUrl: new URL(options.moduleUrl),
		databasePath,
		input: serialize(options.input),
		existingOnly: options.existingOnly === true,
		...stateContext ? { stateContext: captureSqliteWorkerStateContext(stateContext) } : {}
	};
}
function validateSqliteWorkerModuleUrl(moduleUrl) {
	if (moduleUrl.protocol !== "file:" || moduleUrl.search || moduleUrl.hash) throw new Error("SQLite worker backend must be a static local module URL");
}
async function prepareSqliteWorkerDatabaseAdmission(options) {
	validateSqliteWorkerModuleUrl(options.moduleUrl);
	const databasePath = path.resolve(options.databasePath);
	const inputHash = createHash("sha256").update(options.input).digest("hex");
	const identity = await readDatabasePathIdentity(databasePath);
	options.assertCurrent?.();
	if (options.expectedIdentity && identity.key !== options.expectedIdentity) throw new Error("SQLite Worker path no longer matches its borrowed native owner");
	return {
		databasePath,
		inputHash,
		identity,
		key: identity.key
	};
}
function captureSqliteWorkerAdmissionPaths(databasePath, identity, actors) {
	const admittedPaths = /* @__PURE__ */ new Set([databasePath, identity.canonicalPath]);
	if ([...actors].some((entry) => entry.key !== identity.key && [...admittedPaths].some((pathname) => entry.pathReferences.has(pathname)))) throw new Error("SQLite database pathname changed while its worker owner is active; close the existing store first");
	return admittedPaths;
}
function retainSqliteWorkerAdmissionCleanup(actor, retain, close) {
	retain?.({
		get pending() {
			return actor.references === 0 && actor.cleanupState === "pending";
		},
		close: () => actor.references === 0 ? close() : Promise.resolve()
	});
}
function retainSqliteWorkerAdmissionPathReferences(actor, paths) {
	for (const pathname of paths) actor.pathReferences.set(pathname, (actor.pathReferences.get(pathname) ?? 0) + 1);
	return () => {
		for (const pathname of paths) {
			const references = actor.pathReferences.get(pathname) ?? 0;
			if (references > 1) actor.pathReferences.set(pathname, references - 1);
			else actor.pathReferences.delete(pathname);
		}
	};
}
/** All clients of one shared actor suspend its timer while maintenance retains it. */
function suspendSqliteWorkerScheduledMaintenance(actor, maintenanceScope) {
	if (!actor.stateContext) return;
	const buffer = actor.stateContext.scheduledMaintenanceSuspension ??= new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
	if (!maintenanceScope) return;
	const holds = new Int32Array(buffer);
	Atomics.add(holds, 0, 1);
	return () => {
		Atomics.sub(holds, 0, 1);
	};
}
async function resolveOpenedSqliteWorkerIdentity(databasePath, previous, isOwnedElsewhere) {
	const openedIdentity = await readDatabasePathIdentity(databasePath);
	const physical = openedIdentity.key;
	if (openedIdentity.canonicalPath !== previous.canonicalPath) throw new Error("SQLite database canonical pathname changed during open");
	if (!physical.startsWith("file:")) throw new Error("SQLite worker backend did not establish its database file");
	if (isOwnedElsewhere(physical)) throw new Error("SQLite database identity collided with an existing worker owner during open");
	if (previous.key.startsWith("file:") && physical !== previous.key) throw new Error("SQLite database file identity changed during open");
	return physical;
}
function findUnclaimedSharedStateActors(actors, databasePath) {
	const pathname = path.resolve(databasePath);
	return [...actors].filter((actor) => actor.stateContext !== void 0 && actor.references === 0 && actor.cleanupState === "pending" && actor.databasePath === pathname);
}
async function closeUnclaimedSharedStateActors(actors, databasePath, close) {
	const errors = (await Promise.allSettled(findUnclaimedSharedStateActors(actors, databasePath).map(close))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length) throw new AggregateError(errors, "SQLite worker unclaimed cleanup failed", { cause: errors[0] });
}
async function resolveSqliteWorkerModuleUrl(sourceUrl) {
	const modulePath = await realpath(fileURLToPath(sourceUrl));
	const moduleUrl = pathToFileURL(modulePath).href;
	if (!/\.[cm]?[jt]s$/.test(modulePath) || !(await stat(modulePath)).isFile()) throw new Error("SQLite worker backend must identify a JavaScript or TypeScript file");
	return {
		modulePath,
		moduleUrl
	};
}
function assertSqliteWorkerActorStateContext(actor, stateContext) {
	if (actor.stateContext?.existingSchemaPath !== stateContext?.existingSchemaPath) throw new Error("Shared-state worker schema policy changed; close its actor first");
}
function assertSqliteWorkerActorReusable(actor, moduleUrl, inputHash, stateContext) {
	if (actor.slot.failed) throw actor.slot.failed;
	if (actor.moduleUrl !== moduleUrl || actor.inputHash !== inputHash) throw new Error("SQLite database already belongs to another worker backend");
	assertSqliteWorkerActorStateContext(actor, stateContext);
}
function prepareSqliteWorkerActorContext(actor, job) {
	const { request } = job;
	const stateContext = request.stateContext ?? actor?.stateContext;
	if (actor && stateContext) {
		assertSqliteWorkerActorStateContext(actor, stateContext);
		request.stateDatabasePath = actor.stateDatabasePath ?? actor.databasePath;
		request.stateContext = {
			...stateContext,
			scheduledMaintenanceSuspension: actor.stateContext?.scheduledMaintenanceSuspension
		};
	}
}
//#endregion
//#region src/infra/sqlite-worker-broker-reply.ts
const databaseAdmissionCursors = /* @__PURE__ */ new WeakMap();
async function dispatchSqliteWorkerJob(slot, job, onRejected) {
	const actor = [...slot.actors].find((candidate) => candidate.id === job.request.actor);
	const assertCurrentJob = () => {
		if (!readSqliteWorkerRequestCustody(job.custody.descriptor)) throw slot.failed ?? new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	};
	const assertDispatchable = () => {
		if (!job.custody.dispatched) job.signal?.throwIfAborted();
		job.assertCurrent?.();
		assertCurrentJob();
	};
	try {
		job.signal?.throwIfAborted();
		assertCurrentJob();
		prepareSqliteWorkerActorContext(actor, job);
		const stateAccess = actor?.stateAccess;
		const databasePath = stateAccess?.canonicalPath;
		if (stateAccess && job.request.type !== "close") {
			const assertAccessAllowed = () => {
				job.signal?.throwIfAborted();
				assertCurrentJob();
				stateAccess.assertAccessAllowed({
					maintenanceScope: job.maintenanceScope,
					schemaLease: job.cleanupAccess
				});
			};
			const isPending = (error) => error instanceof StateDatabaseAdmissionPendingError && error.databasePath === databasePath;
			try {
				assertAccessAllowed();
			} catch (error) {
				if (!isPending(error)) throw error;
				await acquireWithWait({
					acquire: assertAccessAllowed,
					shouldRetry: isPending,
					deadlineMs: performance.now() + OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					pollIntervalMs: 10,
					sleep: (ms) => sleepWithAbort(ms, job.signal)
				});
			}
		}
		job.request.operationAdmission = prepareSqliteWorkerOperationAdmission(job, actor, databasePath, assertDispatchable, assertCurrentJob);
		let admissionCursor = databaseAdmissionCursors.get(slot);
		if (!admissionCursor) {
			admissionCursor = createSqliteDatabaseAdmissionCursor();
			databaseAdmissionCursors.set(slot, admissionCursor);
		}
		job.request.databaseAdmissions = captureSqliteDatabaseAdmissions(admissionCursor);
		job.request.timing = job.observation.timing;
		job.request.requestCustody = job.custody.descriptor;
		const request = prepareSqliteWorkerRequest(job);
		assertDispatchable();
		job.custody.accept();
		job.detach();
		if (actor && request.type !== "close") actor.openDispatch.openRefused = false;
		job.custody.post();
		if (request.timing) request.timing.posted = performance.now();
		slot.worker.postMessage(request, [
			...request.operationAdmission ? [request.operationAdmission] : [],
			..."input" in request ? [request.input.buffer] : [],
			...request.type === "open" && request.preparation ? [request.preparation.buffer] : []
		]);
		if (request.timing) request.timing.postFinished = performance.now();
	} catch (error) {
		databaseAdmissionCursors.delete(slot);
		onRejected(error, job.custody.postAttempted);
	}
}
function prepareSqliteWorkerOperationAdmission(job, actor, databasePath, assertDispatchable, assertCurrentJob) {
	if (!job.createAdmission && !databasePath) return;
	const settlement = createDeferredCore();
	job.settleNative = settlement.resolve;
	const retained = job.createAdmission ? job.createAdmission({ settled: settlement.promise }) : {
		admission: createSqliteWorkerOperationAdmission(() => {
			throw new SqliteWorkerError("SQLite domain operation requires its own admission", "closed");
		}),
		nativeLocations: databasePath ? [databasePath] : []
	};
	try {
		if (databasePath) {
			const assertCreate = (location) => {
				const creationPaths = /* @__PURE__ */ new Set();
				if (job.request.type === "open" && !job.request.existingIdentity) {
					creationPaths.add(resolveIdentityPathViaExistingAncestorSync(job.request.databasePath));
					creationPaths.add(resolveIdentityPathViaExistingAncestorSync(databasePath));
				}
				if (actor?.stateContext) {
					const primary = resolveIdentityPathViaExistingAncestorSync(actor.databasePath);
					for (const companion of [actor.stateDatabasePath, resolveQuarantineStorePath(actor.stateContext.environment)]) if (companion) {
						const target = resolveIdentityPathViaExistingAncestorSync(companion);
						if (target !== primary) creationPaths.add(target);
					}
				}
				if (!creationPaths.has(resolveIdentityPathViaExistingAncestorSync(location))) throw new SqliteWorkerError("SQLite creation target differs from its captured database", "closed");
			};
			let schemaLease;
			const assertAccess = () => {
				assertCurrentJob();
				job.maintenanceScope?.assertAdmission();
				actor?.stateAccess.assertReadAllowed({
					maintenanceScope: job.maintenanceScope,
					schemaLease: schemaLease ?? job.cleanupAccess
				});
			};
			retained.admission.bindDatabaseAuthority({
				databasePath,
				...job.request.type === "open" && !job.request.existingIdentity && resolveIdentityPathViaExistingAncestorSync(job.request.databasePath) === resolveIdentityPathViaExistingAncestorSync(databasePath) ? { coldOpenPath: databasePath } : {},
				assertRequest: assertDispatchable,
				assertAccess,
				...job.request.type === "close" ? {} : { assertCreate },
				acquireSchema() {
					assertAccess();
					const acquire = () => acquireStateDatabaseSchemaLease(databasePath);
					const lease = job.maintenanceScope ? job.maintenanceScope.run(acquire) : acquire();
					schemaLease = lease;
					job.maintenanceScope?.own(lease, "shared-resources", () => lease.release());
					return {
						assertCurrent() {
							assertAccess();
							lease.assertCurrent();
						},
						release: () => lease.release()
					};
				}
			});
		}
	} catch (error) {
		retained.admission.finish();
		throw error;
	}
	job.operationAdmission = {
		admission: retained.admission,
		releaseService: retainSqliteWriteAdmissionService([
			...retained.nativeLocations,
			...databasePath ? [databasePath] : [],
			...actor?.pathReferences.keys() ?? []
		], () => retained.admission.service())
	};
	job.request.executionAuthority = readSqliteWorkerExecutionAuthority(retained.admission);
	job.request.operationAttachment = retained.admission.attachment;
	return retained.admission.port;
}
function prepareSqliteWorkerRequest(job) {
	if (job.request.type !== "execute" || job.request.input.byteLength <= 33554432) {
		if ("input" in job.request) job.request.input = ownedWorkerBytes(job.request.input);
		if (job.request.type === "open" && job.request.preparation) job.request.preparation = ownedWorkerBytes(job.request.preparation);
		return job.request;
	}
	const { input, ...request } = job.request;
	const producer = createSqliteWorkerTransferOwner();
	const transfer = producer.start([{
		kind: "command",
		serialized: input
	}].values(), { kinds: ["command"] });
	job.inputTransfer = {
		id: transfer.id,
		producer
	};
	job.request.input = /* @__PURE__ */ new Uint8Array();
	return {
		...request,
		type: "execute-start",
		transfer
	};
}
function decodeSqliteWorkerReplyValue(job, reply) {
	if (reply.input === "next") {
		const transfer = job.inputTransfer;
		if (!transfer || reply.transfer) throw new Error("SQLite worker requested unexpected command input");
		const frame = transfer.producer.next(transfer.id);
		const input = ownedWorkerBytes(serialize(frame));
		if (input.byteLength > 33554432) throw new Error("SQLite worker input frame exceeds the transport byte limit");
		if (frame.done) {
			transfer.producer.end(transfer.id);
			job.inputTransfer = void 0;
		}
		return {
			type: "continue",
			request: {
				type: "execute-frame",
				id: job.request.id,
				actor: job.request.actor,
				input
			}
		};
	}
	if (job.inputTransfer) throw new Error("SQLite worker completed before receiving its command input");
	let value;
	if (reply.transfer === "start") {
		const handle = deserialize(reply.value);
		if (job.request.type !== "execute" || job.transfer || handle.kinds.length !== 1 || handle.kinds[0] !== "result") throw new Error("SQLite worker returned an unexpected result transfer");
		const transfer = {
			id: handle.id,
			value: void 0,
			receiver: createSqliteWorkerTransferReceiver(handle, (record) => {
				transfer.value = record.value;
			})
		};
		job.transfer = transfer;
	} else if (reply.transfer === "frame") {
		const transfer = job.transfer;
		if (!transfer) throw new Error("SQLite worker returned an unexpected result frame");
		const frame = deserialize(reply.value);
		const counts = transfer.receiver.accept(frame);
		if (counts) {
			if (counts.length !== 1 || counts[0]?.[1] !== 1) throw new Error("SQLite worker returned an incomplete result transfer");
			value = transfer.value;
			job.transfer = void 0;
		}
	} else {
		if (job.transfer) throw new Error("SQLite worker ended its result transfer without completion");
		value = deserialize(reply.value);
	}
	return job.transfer ? {
		type: "continue",
		request: {
			type: "result-next",
			id: job.request.id,
			actor: job.request.actor,
			transferId: job.transfer.id
		}
	} : {
		type: "complete",
		value
	};
}
function decodeSqliteWorkerReplyError(error) {
	if (error.name === "SqliteWorkerAdmissionTimeoutError" && error.code === "admission-timeout") return new SqliteWorkerAdmissionTimeoutError();
	const failure = Object.assign(new Error(error.message), {
		name: error.name,
		...error.code === void 0 ? {} : { code: error.code }
	});
	if (error.code !== "outcome-unknown" && error.sharedState) {
		retainOpenClawStateWorkerErrorPayload(failure, error.sharedState);
		return hydrateOpenClawStateWorkerError(failure, { includeOrdinary: true });
	}
	return failure;
}
function decodeSqliteWorkerCleanupError(payload) {
	const failure = /* @__PURE__ */ new Error("SQLite worker native cleanup failed");
	retainOpenClawStateWorkerErrorPayload(failure, payload);
	return hydrateOpenClawStateWorkerError(failure, { includeOrdinary: true });
}
function receiveSqliteWorkerReply(slot, reply, owner) {
	const job = slot.current;
	if (!job || reply.id !== job.request.id) {
		owner.fail(/* @__PURE__ */ new Error("SQLite worker returned an unexpected response"));
		return;
	}
	if (reply.transactionCount !== void 0) job.observation.recordTransactions?.(reply.transactionCount);
	if (job.observation.timing && reply.timing) Object.assign(job.observation.timing, reply.timing, { replyReceived: performance.now() });
	if (!reply.ok) {
		const admission = job.operationAdmission?.admission;
		if (reply.cleanupFailure && job.custody.dispatched && !reply.retire) {
			const original = (admission?.failureSource === "domain" && !reply.admissionRefused ? void 0 : admission?.failure) ?? decodeSqliteWorkerReplyError(reply.error);
			owner.fail(decodeSqliteWorkerCleanupError(reply.cleanupFailure), void 0, void 0, { error: original });
			return;
		}
		if (reply.openNotEntered && job.request.type === "open" && job.dispatchState) job.dispatchState.openNotEntered = true;
		const error = decodeSqliteWorkerReplyError(reply.error);
		const openRefused = reply.openOutcome === "refused-before-agent-open";
		if (!reply.retire && (openRefused || job.request.type === "open" && reply.openNotEntered)) {
			job.custody.retire();
			slot.current = void 0;
			const refusal = admission?.failure ?? error;
			owner.finish(job, refusal, void 0, reply.openNotEntered ? {
				kind: "not-entered",
				error: refusal
			} : { kind: "completed" });
			if (openRefused) {
				const actor = [...slot.actors].find((candidate) => candidate.id === job.request.actor);
				if (actor) actor.openDispatch.openRefused = !admission?.cleanupFailures.length;
			}
			owner.dispatch();
			return;
		}
		if (job.request.type !== "execute" || reply.retire) {
			const refusedFactory = job.request.type === "open" && openRefused;
			const failure = refusedFactory || reply.admissionRefused ? toErrorObject(admission?.failure ?? error, error.message) : error;
			owner.fail(failure, job.request.type !== "execute" || reply.admissionRefused ? failure : void 0, refusedFactory ? "refused-before-agent-open" : void 0);
			return;
		}
		job.custody.retire();
		slot.current = void 0;
		owner.finish(job, admission?.failure ?? error);
		owner.dispatch();
		return;
	}
	let value;
	try {
		const result = runWithMainThreadTask("worker:sqlite:reply-decode", () => decodeSqliteWorkerReplyValue(job, reply));
		if (result.type === "continue") {
			slot.worker.postMessage(result.request, result.request.type === "execute-frame" ? [result.request.input.buffer] : []);
			return;
		}
		value = result.value;
	} catch (error) {
		owner.fail(error);
		return;
	}
	if (reply.cleanupFailure) {
		const admission = job.operationAdmission?.admission;
		const failure = admission?.failureSource === "domain" ? void 0 : admission?.failure;
		owner.fail(decodeSqliteWorkerCleanupError(reply.cleanupFailure), void 0, void 0, failure === void 0 ? { value } : { error: failure });
		return;
	}
	if (reply.nativeRuntimeAdmission !== void 0) installSqliteNativeRuntimeAdmission(reply.nativeRuntimeAdmission);
	job.custody.retire();
	slot.current = void 0;
	if (job.request.type === "close") {
		if (reply.closeReceipt) {
			const actor = [...slot.actors].find((candidate) => candidate.id === job.request.actor);
			if (actor) actor.closeReceipt = reply.closeReceipt;
		}
		owner.finish(job, void 0, value);
	} else {
		const admission = job.operationAdmission?.admission;
		owner.finish(job, admission?.failureSource === "domain" ? void 0 : admission?.failure, value);
	}
	owner.dispatch();
}
/** Keep the original failure and outcome classification when retirement also fails. */
function withSqliteWorkerCleanupFailure(failure, cleanupError) {
	if (cleanupError === void 0) return failure;
	const combined = new AggregateError([failure, cleanupError], "SQLite worker failure and cleanup failed", { cause: failure });
	return retainSqliteWorkerErrorCode(combined, failure);
}
function failSqliteWorkerSlot(slot, reason, owner) {
	if (slot.failed) return;
	const error = toErrorObject(reason, "SQLite worker failed");
	slot.custody.retire();
	slot.failed = new SqliteWorkerError(error.message, "unavailable");
	for (const actor of slot.actors) if (!actor.backendClosed) notifyListeners(actor.nativeLostObservers ?? [], slot.failed);
	for (const resume of owner.waiters ?? []) resume(slot.failed);
	const current = slot.current;
	current?.custody.retire();
	slot.current = void 0;
	if (current) {
		current.inputTransfer?.producer.cancel();
		current.inputTransfer = void 0;
		current.transfer = void 0;
	}
	settleFailedSqliteWorkerJobs({
		...owner,
		queuedError: slot.failed,
		current,
		queued: slot.queue.splice(0),
		error
	});
}
function settleFailedSqliteWorkerJobs({ queuedError, current, queued, error, currentError, completed, openOutcome, retire, finish }) {
	const retirement = retire();
	const finishFailed = (retired, cleanupError) => {
		if (current && completed) {
			process.emitWarning(new Error("SQLite worker operation completed before native cleanup failed", { cause: withSqliteWorkerCleanupFailure(error, cleanupError) }));
			finish(current, "error" in completed ? completed.error : void 0, "value" in completed ? completed.value : void 0, retired ? { kind: "completed" } : {
				kind: "unknown",
				error: cleanupError ?? error
			});
		} else if (current) {
			const failure = currentError ?? new SqliteWorkerError(`SQLite worker stopped before its result was received: ${error.message}`, current.request.type === "execute" && current.custody.dispatched ? "outcome-unknown" : "unavailable");
			if (!currentError) failure.cause = error;
			finish(current, withSqliteWorkerCleanupFailure(failure, cleanupError), void 0, current.custody.dispatched ? retired && openOutcome === "refused-before-agent-open" ? { kind: "completed" } : {
				kind: "unknown",
				error: currentError ?? error,
				...retired ? { nativeStopped: true } : {}
			} : {
				kind: "not-entered",
				error
			});
		}
		for (const job of queued) finish(job, withSqliteWorkerCleanupFailure(queuedError, cleanupError));
	};
	retirement.then(() => finishFailed(!current?.operationAdmission?.admission.cleanupFailures.length), (cleanupError) => finishFailed(false, cleanupError));
}
function settleSqliteWorkerJob(job, error, value, settlement) {
	job.custody.retire();
	job.settleNative?.(settlement ?? (job.custody.dispatched ? { kind: "completed" } : {
		kind: "not-entered",
		error
	}));
	job.operationAdmission?.admission.finish();
	job.operationAdmission?.releaseService();
	const admission = job.operationAdmission?.admission;
	let failure = error ?? (admission?.failureSource === "domain" ? void 0 : admission?.failure);
	const admissionCleanupFailures = job.operationAdmission?.admission.cleanupFailures ?? [];
	if (admissionCleanupFailures.length > 0) {
		if (job.dispatchState) job.dispatchState.openRefused = false;
		const cleanupError = new AggregateError(admissionCleanupFailures, "SQLite worker admission cleanup failed");
		if (failure === void 0 && job.request.type === "execute") process.emitWarning(cleanupError);
		else failure = failure === void 0 ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(failure, "SQLite worker failed"), cleanupError);
	}
	job.inputTransfer?.producer.cancel();
	job.inputTransfer = void 0;
	job.transfer = void 0;
	job.detach();
	if (failure !== void 0) job.reject(failure);
	else job.resolve(value);
}
//#endregion
//#region src/infra/sqlite-worker-broker-lifecycle.ts
function cleanupFailures(results) {
	return results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
}
/** The broker retains these maps; this owner drains clients before native close custody. */
function createSqliteWorkerLifecycle({ explicitSqliteCloseReleasesNativeResources, actors, slots, stores, enqueueClose, fail }) {
	async function closeHost({ inputAdmission, operations, waiters, beforeSharedStateClose }) {
		for (const waiting of waiters) for (const resume of waiting) resume(new SqliteWorkerError("SQLite worker host is closing", "overloaded"));
		for (const client of stores.values()) if (!beforeSharedStateClose || !client.actor.stateContext) client.sealed = true;
		await beforeSharedStateClose?.();
		for (const client of stores.values()) client.sealed = true;
		const errors = [];
		try {
			await inputAdmission.joinOpens();
			await Promise.allSettled(operations);
			const results = await Promise.allSettled([...actors.values()].map((actor) => closeActor(actor)));
			errors.push(...cleanupFailures(results));
			await inputAdmission.joinPreparations();
		} catch (error) {
			errors.push(error);
		}
		errors.push(...cleanupFailures(await Promise.allSettled([...slots].map(retireEmpty))));
		if (errors.length) throw new AggregateError(errors, "SQLite worker host cleanup failed");
	}
	async function acquireSlot(options, limits, createReplyOwner) {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		options.signal?.throwIfAborted();
		const shareWorkers = explicitSqliteCloseReleasesNativeResources;
		const available = [...slots].filter((slot) => !slot.failed && !slot.retiring && slot.runtimeGeneration === options.runtimeGeneration);
		const borrowedGenerationSlot = shareWorkers && options.runtimeGeneration !== void 0 && available.length === 0 && slots.size >= limits.maxWorkers && ![...slots].some((slot) => slot.borrowedGenerationSlot);
		if (!borrowedGenerationSlot && slots.size >= (shareWorkers ? limits.maxWorkers : limits.maxStores)) {
			if (!available.length || !shareWorkers) {
				const retiring = [...slots].filter((slot) => Boolean(slot.failed || slot.retiring));
				if (retiring.length > 0) {
					await racePromiseWithAbortSignal(Promise.race(retiring.map(({ exit }) => exit)), options.signal, (signal) => signal.reason);
					return acquireSlot(options, limits, createReplyOwner);
				}
				throw new SqliteWorkerError(`SQLite worker ${shareWorkers ? "runtime" : "store"} capacity reached`, "overloaded");
			}
			const selected = available.reduce((left, right) => left.actors.size <= right.actors.size ? left : right);
			selected.pendingOpens += 1;
			return selected;
		}
		return createSlot(options, borrowedGenerationSlot, createReplyOwner);
	}
	function createSlot(options, borrowedGenerationSlot, createReplyOwner) {
		options.signal?.throwIfAborted();
		ensureSqliteLibrarySelected();
		options.assertCurrent?.();
		options.signal?.throwIfAborted();
		const { carrierUrl } = options;
		const { worker, exited } = runInDetachedAsyncContext(() => ({
			worker: createCpuTrackedWorker(carrierUrl, {
				resourceLimits: {
					maxOldGenerationSizeMb: 512,
					maxYoungGenerationSizeMb: 32
				},
				env: resolveNodeCompileCacheEnv(),
				execArgv: resolveRuntimeWorkerThreadExecArgv(carrierUrl)
			}),
			exited: createDeferredCore()
		}));
		trackSqliteDatabaseAdmissionWorker(worker);
		const slot = {
			custody: new SqliteWorkerSlotCustody(),
			runtimeGeneration: options.runtimeGeneration,
			...borrowedGenerationSlot ? { borrowedGenerationSlot: true } : {},
			worker,
			receiveReply: (reply) => receiveSqliteWorkerReply(slot, reply, replyOwner),
			actors: /* @__PURE__ */ new Set(),
			queue: [],
			exit: exited.promise,
			exited: false,
			pendingOpens: 1
		};
		const replyOwner = createReplyOwner(slot);
		slots.add(slot);
		worker.on("message", (reply) => slot.receiveReply(reply));
		worker.on("error", (error) => fail(slot, error));
		worker.on("messageerror", (error) => fail(slot, error));
		worker.once("exit", (code) => {
			slot.exited = true;
			fail(slot, /* @__PURE__ */ new Error(`SQLite worker exited with code ${code}`));
			for (const actor of slot.actors) {
				actor.backendClosed = true;
				actor.markNativeStopped();
			}
			slots.delete(slot);
			exited.resolve();
		});
		worker.unref();
		return slot;
	}
	async function settleGeneration(generation) {
		const retained = [...actors.values()].filter((actor) => actor.runtimeGeneration === generation);
		const retirement = Promise.allSettled(retained.map((actor) => retireActor(actor)));
		await Promise.all(retained.map(async (actor) => await actor.settlement));
		return async () => {
			const errors = cleanupFailures(await retirement);
			throwSqliteLifecycleErrors(errors, "Retained SQLite worker cleanup failed");
			await Promise.all([...slots].filter((slot) => slot.runtimeGeneration === generation).map((slot) => retireEmpty(slot)));
		};
	}
	function releaseActorReference(actor) {
		actor.references -= 1;
		if (!actor.references) actor.onReferencesDrained?.();
	}
	async function rejectSlotAdmission(slot, error) {
		slot.pendingOpens -= 1;
		try {
			await retireEmpty(slot);
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite slot admission and cleanup failed", error);
		}
		throw error;
	}
	function retireActor(identity) {
		const actor = [...actors.values()].find((entry) => entry === identity);
		if (!actor) return Promise.resolve();
		if (actor.retirement) return actor.retirement;
		actor.retirementRequested = true;
		const drained = createDeferredCore();
		actor.onReferencesDrained = drained.resolve;
		if (!actor.references) drained.resolve();
		actor.settlement = drained.promise;
		const clients = [...stores.values()].filter((client) => client.actor === actor);
		actor.retirement = (async () => {
			const results = await Promise.allSettled(clients.map((client) => client.close()));
			await actor.settlement;
			const errors = cleanupFailures(results);
			if (!errors.length) try {
				await closeActor(actor);
			} catch (error) {
				errors.push(error);
			}
			if (errors.length) throw new AggregateError(errors, "SQLite actor retirement failed", { cause: errors[0] });
		})().finally(() => {
			actor.retirement = void 0;
			actor.onReferencesDrained = void 0;
		});
		return actor.retirement;
	}
	function closeActor(actor, maintenanceScope) {
		if (actor.cleanupState === "complete") return Promise.resolve();
		if (actor.closing) return actor.closing;
		actor.cleanupState = "pending";
		actor.closing = (async () => {
			const errors = [];
			if (!actor.backendClosed) try {
				await enqueueClose(actor, maintenanceScope);
				actor.backendClosed = true;
				if (explicitSqliteCloseReleasesNativeResources) actor.markNativeStopped();
			} catch (error) {
				if (error !== actor.slot.failed) errors.push(error);
				fail(actor.slot, error instanceof Error ? error : new Error(String(error)));
				await actor.slot.exit;
			}
			try {
				if (!explicitSqliteCloseReleasesNativeResources || actor.slot.failed || !actor.slot.pendingOpens && [...actor.slot.actors].every((entry) => entry.backendClosed)) await retire(actor.slot);
			} catch (error) {
				errors.push(error);
			} finally {
				forget(actor);
			}
			throwSqliteLifecycleErrors(errors, "SQLite worker actor cleanup failed");
		})().finally(() => {
			actor.closing = void 0;
		});
		return actor.closing;
	}
	function forget(actor) {
		if (actors.get(actor.key) === actor) actors.delete(actor.key);
		actor.slot.actors.delete(actor);
		actor.cleanupState = "complete";
	}
	async function retireEmpty(slot) {
		if (!slot.actors.size && !slot.pendingOpens) await retire(slot);
	}
	function retire(slot) {
		slot.custody.retire();
		slot.retiring ??= (async () => {
			const errors = [];
			if (!slot.exited) try {
				await slot.worker.terminate();
			} catch (error) {
				errors.push(error);
			}
			await slot.exit;
			throwSqliteLifecycleErrors(errors, "SQLite worker retirement cleanup failed");
		})().finally(() => {
			slot.retiring = void 0;
		});
		return slot.retiring;
	}
	return {
		closeHost,
		acquireSlot,
		createSlot,
		settleGeneration,
		releaseActorReference,
		rejectSlotAdmission,
		retireActor,
		closeActor,
		forget,
		retireEmpty,
		retire
	};
}
//#endregion
//#region src/infra/sqlite-worker-client.ts
function runSqliteWorkerClientOperation(client, operation, stateContext, track, assertCurrent, createAdmission) {
	if (!client || client.sealed) return Promise.reject(new SqliteWorkerError("SQLite worker store is closed", "closed"));
	const scope = {
		maintenanceScope: getOpenClawDatabaseMaintenanceScope(),
		createAdmission,
		assertCurrent,
		active: true,
		pending: /* @__PURE__ */ new Set(),
		...stateContext ? { stateContext: captureSqliteWorkerStateContext(stateContext) } : {}
	};
	const released = createDeferredCore();
	client.scopes.add(released.promise);
	const untrack = track(released.promise);
	return (async () => {
		try {
			const result = operation({ execute: (command, options = {}) => client.execute(command, options, scope) });
			return isPromise(result) ? await result : result;
		} finally {
			scope.active = false;
			await Promise.allSettled(scope.pending);
			client.scopes.delete(released.promise);
			untrack();
			released.resolve();
		}
	})();
}
function createSqliteWorkerClient(owner) {
	let closed;
	const pending = /* @__PURE__ */ new Set();
	const client = {
		actor: owner.actor,
		close: () => store.close(),
		sealed: owner.isDraining(),
		isAvailable: owner.isAvailable,
		scopes: /* @__PURE__ */ new Set(),
		execute: (command, options, scope) => {
			if (scope ? !scope.active : closed || client.sealed || owner.isDraining()) return Promise.reject(new SqliteWorkerError("SQLite worker store is closed", "closed"));
			if (options.signal?.aborted) return Promise.reject(toErrorObject(options.signal.reason, "SQLite worker operation canceled"));
			let payload;
			let requestClass;
			let assertCurrent;
			const admission = scope?.assertCurrent;
			const createAdmission = scope?.createAdmission;
			const inCaller = admission || createAdmission ? AsyncLocalStorage.snapshot() : void 0;
			try {
				const commandType = command.type;
				requestClass = classifyWorkerRequest(commandType, command.input);
				assertCurrent = admission && inCaller ? () => inCaller(admission, commandType) : void 0;
				assertCurrent?.();
				payload = serialize({
					type: commandType,
					input: command.input
				});
			} catch (error) {
				return Promise.reject(toErrorObject(error, "SQLite worker command could not be serialized"));
			}
			const operation = owner.dispatch(payload, options.signal, scope, assertCurrent, createAdmission && inCaller ? (admissionOperation) => inCaller(createAdmission, admissionOperation) : void 0, requestClass);
			pending.add(operation);
			scope?.pending.add(operation);
			const settled = () => {
				pending.delete(operation);
				scope?.pending.delete(operation);
			};
			operation.then(settled, settled);
			return operation;
		}
	};
	const store = {
		execute: (command, options = {}) => client.execute(command, options),
		close: () => {
			if (!closed) {
				client.sealed = true;
				closed = (async () => {
					await Promise.allSettled(client.scopes);
					await Promise.allSettled(pending);
					await owner.release();
				})().catch((error) => {
					closed = void 0;
					throw error;
				});
			}
			return closed;
		}
	};
	return {
		store,
		client
	};
}
//#endregion
//#region src/infra/sqlite-worker-input-admission.ts
/** Retained inputs share the broker budget before they become queued jobs. */
var SqliteWorkerInputAdmission = class {
	constructor(owner) {
		this.owner = owner;
		this.bytes = 0;
		this.inputPreparations = /* @__PURE__ */ new Set();
		this.openQueue = /* @__PURE__ */ new Map();
		this.opens = /* @__PURE__ */ new Set();
	}
	get retainedBytes() {
		return this.bytes;
	}
	retain(bytes) {
		this.bytes += bytes;
		let released = false;
		return () => {
			if (!released) {
				released = true;
				this.bytes -= bytes;
			}
		};
	}
	open(bytes, databasePath, dispatch, signal) {
		if (bytes > this.owner.maxMessageBytes || this.owner.queuedBytes() + this.bytes + bytes > this.owner.maxQueuedBytes) return Promise.reject(new SqliteWorkerError("SQLite worker open input capacity reached", "overloaded"));
		const release = this.retain(bytes);
		const opened = runWithSqliteDatabaseAdmissionTurn([databasePath], () => runQueuedStoreWrite({
			queues: this.openQueue,
			storePath: "sqlite-open",
			label: "SQLite worker open",
			fn: dispatch,
			signal
		}), [], signal).finally(release);
		this.opens.add(opened);
		const settled = () => this.opens.delete(opened);
		opened.then(settled, settled);
		return opened;
	}
	/** Joins every accepted open, including those still waiting for their turn. */
	async joinOpens() {
		while (this.opens.size) await Promise.allSettled(this.opens);
	}
	async joinPreparations() {
		await Promise.allSettled(this.inputPreparations);
	}
	reserveInputPreparation(inputBytes, retention = "stream") {
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) throw new RangeError("SQLite worker input bytes must be a non-negative safe integer");
		if (this.owner.isClosing()) throw new SqliteWorkerError("SQLite worker host is closing", "closed");
		const bytes = retention === "stream" && inputBytes > this.owner.maxQueuedInputBytes ? this.owner.maxMessageBytes : inputBytes;
		if (this.owner.queuedBytes() + this.bytes + bytes > this.owner.maxQueuedBytes) throw new SqliteWorkerError("SQLite worker input preparation capacity reached", "overloaded");
		this.bytes += bytes;
		const settled = createDeferredCore();
		this.inputPreparations.add(settled.promise);
		let handedOff = false;
		const release = () => {
			if (this.inputPreparations.delete(settled.promise)) {
				this.bytes -= bytes;
				settled.resolve();
			}
		};
		const assertCurrent = () => {
			if (!handedOff && (!this.inputPreparations.has(settled.promise) || this.owner.isClosing())) throw new SqliteWorkerError("SQLite worker input preparation is closed", "closed");
		};
		return {
			assertCurrent,
			handoff: (dispatch) => {
				try {
					if (!this.inputPreparations.has(settled.promise)) throw new SqliteWorkerError("SQLite worker input preparation is closed", "closed");
					assertCurrent();
				} catch (error) {
					release();
					throw error;
				}
				handedOff = true;
				release();
				return dispatch();
			},
			release
		};
	}
};
//#endregion
//#region src/infra/sqlite-worker-broker.ts
const MAX_STORES = 64;
const MAX_QUEUED_COMMAND_BYTES = 67108864;
const SQLITE_WORKER_MAX_QUEUED_BYTES = 268435456;
function waitForSqliteOpen(pending, signal) {
	return racePromiseWithAbortSignal(pending, signal, (aborted) => aborted.reason);
}
var SqliteWorkerBroker = class {
	constructor() {
		this.explicitSqliteCloseReleasesNativeResources = captureSqliteWorkerClosePolicy();
		this.maxWorkers = resolveSqliteBrokerWorkerCount();
		this.waiters = /* @__PURE__ */ new Map();
		this.resuming = /* @__PURE__ */ new Set();
		this.warnAdmission = createSqliteWorkerAdmissionWarning();
		this.actors = /* @__PURE__ */ new Map();
		this.slots = /* @__PURE__ */ new Set();
		this.clients = /* @__PURE__ */ new Set();
		this.stores = /* @__PURE__ */ new Map();
		this.operations = /* @__PURE__ */ new Set();
		this.lifecycle = createSqliteWorkerLifecycle({
			explicitSqliteCloseReleasesNativeResources: this.explicitSqliteCloseReleasesNativeResources,
			actors: this.actors,
			slots: this.slots,
			stores: this.stores,
			enqueueClose: (actor, maintenanceScope) => this.enqueue(actor.slot, {
				type: "close",
				actor: actor.id
			}, 0, { maintenanceScope }),
			fail: (slot, error) => this.fail(slot, error)
		});
		this.nextActor = 0;
		this.nextRequest = 0;
		this.requests = /* @__PURE__ */ new WeakMap();
		this.bytes = 0;
		this.inputAdmission = new SqliteWorkerInputAdmission({
			queuedBytes: () => this.bytes,
			isClosing: () => this.draining !== void 0,
			maxQueuedBytes: SQLITE_WORKER_MAX_QUEUED_BYTES,
			maxQueuedInputBytes: MAX_QUEUED_COMMAND_BYTES,
			maxMessageBytes: SQLITE_WORKER_MAX_MESSAGE_BYTES
		});
	}
	reserveInputPreparation(inputBytes, retention = "stream") {
		return this.inputAdmission.reserveInputPreparation(inputBytes, retention);
	}
	open(options, stateContext, assertCurrent, custody = {}) {
		try {
			validateSqliteWorkerDatabaseLocator(options.databasePath);
		} catch (error) {
			return Promise.reject(toErrorObject(error, "SQLite worker database locator is invalid"));
		}
		if (this.draining) return Promise.reject(new SqliteWorkerError("SQLite worker host is closing", "closed"));
		if (this.clients.size >= MAX_STORES) return Promise.reject(new SqliteWorkerError("SQLite worker store capacity reached", "overloaded"));
		const client = {};
		this.clients.add(client);
		let snapshot;
		try {
			snapshot = captureSqliteWorkerOpen(options, stateContext, assertCurrent, custody);
			const generation = options.runtimeGeneration;
			generation?.retain(this, async () => {
				await this.inputAdmission.joinOpens();
				return await this.lifecycle.settleGeneration(generation);
			});
		} catch (error) {
			this.clients.delete(client);
			return Promise.reject(toErrorObject(error, "SQLite worker input could not be serialized"));
		}
		return this.inputAdmission.open(sqliteWorkerRequestBytes(snapshot.input, snapshot.stateContext, snapshot.preparation), snapshot.databasePath, () => this.openAdmitted(snapshot, client), snapshot.signal).catch((error) => {
			this.clients.delete(client);
			throw error;
		});
	}
	async openAdmitted(options, client) {
		const { maintenanceScope } = options;
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		const { databasePath, inputHash, identity, key } = await prepareSqliteWorkerDatabaseAdmission(options);
		options.assertCurrent?.();
		const stateAccess = captureStateDatabaseAccess(options.stateDatabasePath ?? identity.canonicalPath);
		stateAccess.assertAccessAllowed({
			maintenanceScope: options.maintenanceScope,
			schemaLease: options.cleanupAccess
		});
		const custody = captureSqliteWorkerJobCustody(options.cleanupAccess);
		const input = options.input;
		const admittedPaths = captureSqliteWorkerAdmissionPaths(databasePath, identity, this.actors.values());
		if (options.existingOnly && !key.startsWith("file:")) {
			this.clients.delete(client);
			return;
		}
		const { modulePath, moduleUrl } = await resolveSqliteWorkerModuleUrl(options.moduleUrl);
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		let actor = this.actors.get(key);
		if (actor?.slot.failed) {
			await waitForSqliteOpen(this.lifecycle.retireActor(actor), options.signal);
			return this.openAdmitted(options, client);
		}
		let resumeScheduledMaintenance;
		if (actor?.retirementRequested || actor?.cleanupState === "pending") {
			const pending = actor.retirementRequested ? actor.retirement : actor.closing;
			if (pending) {
				await waitForSqliteOpen(pending, options.signal);
				return this.openAdmitted(options, client);
			}
			throw new SqliteWorkerError(actor.retirementRequested ? "SQLite actor retirement must finish before reopening" : "SQLite worker cleanup is pending; retry close before reopening", "closed");
		}
		if (actor) {
			assertSqliteWorkerActorReusable(actor, moduleUrl, inputHash, options.stateContext);
			if (options.onNativeLost) (actor.nativeLostObservers ??= /* @__PURE__ */ new Set()).add(options.onNativeLost);
			actor.references += 1;
			resumeScheduledMaintenance = suspendSqliteWorkerScheduledMaintenance(actor, maintenanceScope);
		} else {
			const slot = await this.lifecycle.acquireSlot(options, {
				maxWorkers: this.maxWorkers,
				maxStores: MAX_STORES
			}, (replySlot) => this.createReplyOwner(replySlot));
			try {
				options.assertCurrent?.();
				options.signal?.throwIfAborted();
			} catch (error) {
				return this.lifecycle.rejectSlotAdmission(slot, error);
			}
			const nativeStopped = createDeferredCore();
			actor = {
				...options.onNativeLost ? { nativeLostObservers: /* @__PURE__ */ new Set([options.onNativeLost]) } : {},
				runtimeGeneration: options.runtimeGeneration,
				nativeStopped: nativeStopped.promise,
				markNativeStopped: nativeStopped.resolve,
				id: ++this.nextActor,
				key,
				pathReferences: new Map([...admittedPaths].map((pathname) => [pathname, 1])),
				moduleUrl,
				inputHash,
				slot,
				references: 1,
				opened: Promise.resolve(),
				openDispatch: { custody: slot.custody.createRequest() },
				initialized: false,
				backendClosed: false,
				databasePath,
				stateAccess,
				stateContext: options.stateContext,
				stateDatabasePath: options.stateDatabasePath
			};
			this.actors.set(key, actor);
			resumeScheduledMaintenance = suspendSqliteWorkerScheduledMaintenance(actor, maintenanceScope);
			slot.actors.add(actor);
			slot.pendingOpens -= 1;
			const opening = actor;
			opening.opened = this.enqueue(slot, {
				type: "open",
				actor: actor.id,
				moduleUrl,
				databasePath,
				...options.createAdmission ? { openAdmission: "input" } : options.createOpenAdmission ? { openAdmission: "identity" } : {},
				...options.existingOnly ? { existingIdentity: key } : {},
				input,
				...options.preparation ? { preparation: options.preparation } : {},
				...runtimeNeedsTypeScriptLoader(modulePath) ? { sourceLoaderUrl: import.meta.resolve("tsx/esm/api") } : {}
			}, sqliteWorkerRequestBytes(input, options.stateContext, options.preparation), {
				dispatchState: opening.openDispatch,
				signal: options.signal,
				assertCurrent: options.assertCurrent,
				...custody(options),
				createAdmission: options.createAdmission ?? options.createOpenAdmission
			}).then(async () => {
				opening.initialized = true;
				const physical = await resolveOpenedSqliteWorkerIdentity(databasePath, identity, (id) => {
					const existing = this.actors.get(id);
					return existing !== void 0 && existing !== opening;
				});
				if (physical !== key) {
					this.actors.delete(key);
					opening.key = physical;
					this.actors.set(physical, opening);
				}
			});
		}
		const owned = actor;
		try {
			retainSqliteWorkerAdmissionCleanup(owned, options.retainCleanup, this.lifecycle.closeActor.bind(this.lifecycle, owned, maintenanceScope));
			options.onNativeStopped?.(owned.nativeStopped, () => owned.closeReceipt, () => owned.openDispatch.openRefused === true);
			await actor.opened;
			options.assertCurrent?.();
			if (actor.retirementRequested) throw new SqliteWorkerError("SQLite actor retired during client admission", "closed");
			if (actor.slot.failed) throw actor.slot.failed;
		} catch (error) {
			resumeScheduledMaintenance?.();
			this.lifecycle.releaseActorReference(actor);
			if (!actor.references) {
				const errors = [error];
				try {
					if (actor.initialized) await this.lifecycle.closeActor(actor, options.maintenanceScope);
					else {
						const nativeOpenMayHaveEntered = actor.openDispatch.custody.postAttempted && !actor.openDispatch.openNotEntered && !actor.openDispatch.openRefused;
						if (!nativeOpenMayHaveEntered && !actor.slot.failed) {
							actor.backendClosed = true;
							actor.markNativeStopped();
							actor.cleanupState = "pending";
						}
						if (nativeOpenMayHaveEntered) {
							this.fail(actor.slot, error);
							await actor.slot.exit;
						}
						this.lifecycle.forget(actor);
						await this.lifecycle.retireEmpty(actor.slot);
					}
				} catch (cleanupError) {
					errors.push(cleanupError);
				}
				if (errors.length > 1) throw new AggregateError(errors, "SQLite worker admission and cleanup failed", { cause: error });
			}
			throw error;
		}
		const releasePaths = retainSqliteWorkerAdmissionPathReferences(owned, admittedPaths);
		let referenceReleased = false;
		const { store, client: storeClient } = createSqliteWorkerClient({
			actor: owned,
			isDraining: () => this.draining !== void 0,
			isAvailable: () => !owned.slot.failed && !owned.cleanupState && !owned.retirementRequested,
			dispatch: (payload, signal, scope, assertCurrent, createAdmission, requestClass) => this.enqueue(owned.slot, {
				type: "execute",
				actor: owned.id,
				input: payload,
				...scope?.stateContext ? { stateContext: scope.stateContext } : {}
			}, sqliteWorkerRequestBytes(payload, scope?.stateContext), {
				signal,
				requestClass,
				scope,
				assertCurrent,
				createAdmission,
				...custody(scope)
			}),
			release: async () => {
				if (!referenceReleased) {
					referenceReleased = true;
					resumeScheduledMaintenance?.();
					this.lifecycle.releaseActorReference(owned);
					this.stores.delete(store);
					this.clients.delete(client);
					releasePaths();
				}
				if (this.draining && !owned.stateContext) await this.draining;
				else if (owned.slot.failed) await owned.slot.exit;
				if (!owned.references) await this.lifecycle.closeActor(owned, maintenanceScope);
			}
		});
		this.stores.set(store, storeClient);
		return store;
	}
	runOperation(store, operation, stateContext, assertCurrent, createAdmission) {
		return runSqliteWorkerClientOperation(this.draining ? void 0 : this.stores.get(store), operation, stateContext, (pending) => {
			this.operations.add(pending);
			return () => this.operations.delete(pending);
		}, assertCurrent, createAdmission);
	}
	isAvailable(store) {
		return this.stores.get(store)?.isAvailable() ?? false;
	}
	retireActor(identity) {
		return this.lifecycle.retireActor(identity);
	}
	getActorIdentity(store) {
		const client = this.stores.get(store);
		if (!client || client.sealed || !client.actor.stateContext) throw new SqliteWorkerError("SQLite shared actor binding is unavailable", "closed");
		return client.actor;
	}
	hasUnclaimedSharedStateCleanup(databasePath) {
		return findUnclaimedSharedStateActors(this.actors.values(), databasePath).length > 0;
	}
	async closeUnclaimedSharedState(databasePath) {
		await this.inputAdmission.joinOpens();
		await closeUnclaimedSharedStateActors(this.actors.values(), databasePath, (actor) => this.lifecycle.closeActor(actor));
	}
	createReplyOwner(slot) {
		return {
			fail: (reason, currentError, openOutcome, completed) => this.fail(slot, reason, currentError, openOutcome, completed),
			finish: (job, error, value, settlement) => this.finish(slot, job, error, value, settlement),
			dispatch: () => this.dispatch(slot)
		};
	}
	enqueue(slot, body, bytes, options = {}, admitted = false, observation = trackWorkerRequest("sqlite_writer", options.requestClass ?? body.type)) {
		const { signal, dispatchState, scope, assertCurrent, createAdmission } = options;
		const reject = (error) => {
			observation.completed();
			return Promise.reject(error);
		};
		if (this.draining && body.type !== "close" && !scope?.active) return reject(new SqliteWorkerError("SQLite worker host is closing", "closed"));
		if (slot.failed) return reject(slot.failed);
		const activeInput = body.type === "execute" && bytes > MAX_QUEUED_COMMAND_BYTES;
		const reservedBytes = activeInput ? SQLITE_WORKER_MAX_MESSAGE_BYTES : bytes;
		if (body.type !== "close" && (body.type !== "execute" && bytes > 33554432 || activeInput && (slot.current || slot.queue.length > 0 || slot.pendingOpens > 0) || this.bytes + this.inputAdmission.retainedBytes + reservedBytes > SQLITE_WORKER_MAX_QUEUED_BYTES)) return reject(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
		if (body.type !== "close" && ((this.requests.get(slot) ?? 0) >= 128 || !admitted && this.waiters.has(slot))) {
			if (activeInput || this.draining) return reject(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
			return this.waitForCapacity(slot, body, bytes, options, observation);
		}
		const result = createDeferredCore();
		const job = {
			custody: dispatchState?.custody ?? slot.custody.createRequest(),
			observation,
			signal,
			maintenanceScope: options.maintenanceScope,
			cleanupAccess: options.cleanupAccess,
			createAdmission,
			assertCurrent,
			dispatchState,
			request: {
				...body,
				id: ++this.nextRequest
			},
			bytes: reservedBytes,
			resolve: result.resolve,
			reject: result.reject,
			detach: () => signal?.removeEventListener("abort", abort)
		};
		const abort = () => {
			job.custody.cancel();
			const index = slot.queue.indexOf(job);
			if (index >= 0) {
				slot.queue.splice(index, 1);
				this.finish(slot, job, signal?.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			}
		};
		this.requests.set(slot, (this.requests.get(slot) ?? 0) + 1);
		this.bytes += reservedBytes;
		if (activeInput) {
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) this.finish(slot, job, signal.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			else this.dispatchJob(slot, job);
			return result.promise;
		}
		slot.queue.push(job);
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
		this.dispatch(slot);
		return result.promise;
	}
	waitForCapacity(slot, body, bytes, options, observation) {
		return new Promise((resolve, reject) => {
			const started = Date.now();
			const signal = options.signal;
			const waiters = this.waiters.get(slot) ?? /* @__PURE__ */ new Set();
			const resume = (error) => {
				if (!waiters.delete(resume)) return;
				if (!waiters.size) this.waiters.delete(slot);
				clearTimeout(timer);
				signal?.removeEventListener("abort", abort);
				releaseInput();
				let failure = error;
				if (failure === void 0 && Date.now() - started >= 1e4) {
					this.warnAdmission(this.waiters.get(slot)?.size ?? 0, Date.now() - started);
					failure = new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded");
				}
				if (failure !== void 0) {
					observation.completed();
					reject(toErrorObject(failure, "SQLite worker admission failed"));
				} else resolve(this.enqueue(slot, body, bytes, options, true, observation));
			};
			const abort = () => resume(signal?.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			const timer = setTimeout(() => {
				this.warnAdmission(this.waiters.get(slot)?.size ?? 0, Date.now() - started);
				resume(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
			}, SQLITE_WORKER_ADMISSION_TIMEOUT_MS);
			const releaseInput = this.inputAdmission.retain(bytes);
			waiters.add(resume);
			this.waiters.set(slot, waiters);
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) abort();
			else if (waiters.size >= 128) this.warnAdmission(waiters.size, 0);
		});
	}
	dispatch(slot) {
		if (slot.current || slot.failed) return;
		const job = slot.queue.shift();
		if (!job) {
			slot.worker.unref();
			return;
		}
		this.dispatchJob(slot, job);
	}
	dispatchJob(slot, job) {
		job.custody.activate();
		slot.current = job;
		slot.worker.ref();
		job.observation.started();
		dispatchSqliteWorkerJob(slot, job, (error, retire) => {
			if (slot.current !== job) return;
			if (retire) this.fail(slot, error, toErrorObject(error, "SQLite worker transfer failed"));
			else {
				job.custody.retire();
				slot.current = void 0;
				this.finish(slot, job, error);
				this.dispatch(slot);
			}
		});
	}
	finish(slot, job, error, value, settlement) {
		job.observation.completed();
		this.requests.set(slot, (this.requests.get(slot) ?? 0) - 1);
		this.bytes -= job.bytes;
		settleSqliteWorkerJob(job, error, value, settlement);
		if (!this.resuming.has(slot)) {
			this.resuming.add(slot);
			while ((this.requests.get(slot) ?? 0) < 128) {
				const resume = this.waiters.get(slot)?.values().next().value;
				if (!resume) break;
				resume();
			}
			this.resuming.delete(slot);
		}
	}
	fail(slot, reason, currentError, openOutcome, completed) {
		failSqliteWorkerSlot(slot, reason, {
			currentError,
			openOutcome,
			completed,
			waiters: this.waiters.get(slot),
			retire: () => this.lifecycle.retire(slot),
			finish: (job, failure, value, settlement) => this.finish(slot, job, failure, value, settlement)
		});
	}
	close(beforeSharedStateClose) {
		this.draining ??= this.lifecycle.closeHost({
			inputAdmission: this.inputAdmission,
			operations: this.operations,
			waiters: this.waiters.values(),
			beforeSharedStateClose
		}).then(() => {
			this.clients.clear();
			this.stores.clear();
		}).finally(() => {
			this.draining = void 0;
		});
		return this.draining;
	}
};
//#endregion
//#region src/infra/sqlite-worker-store.ts
function withCallerErrors(result) {
	return result.catch((error) => {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	});
}
function bindCallerExecute(scope) {
	return { execute: (command, options) => {
		const result = withCallerErrors(scope.execute(command, options));
		result.catch(() => void 0);
		return result;
	} };
}
/** Retain one actor through local reconciliation; the callback must not await its own close. */
function runSqliteWorkerStoreOperation(store, operation, stateContext, assertCurrent, createAdmission) {
	return withCallerErrors(resolveSqliteWorkerBroker().runOperation(store, (scope) => operation(bindCallerExecute(scope)), stateContext, assertCurrent, createAdmission));
}
function resolveSqliteWorkerBroker() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerBroker"), () => new SqliteWorkerBroker(), (broker) => withCallerErrors(broker.close(async () => {
		const { closeOpenClawStateDatabaseAsync } = await import("./openclaw-state-db-cache-CDpUFjDp.mjs");
		await closeOpenClawStateDatabaseAsync();
	})), "shared-state");
}
/** Charge captured input before actor preparation can yield, then hand it to normal dispatch. */
function reserveSqliteWorkerInputPreparation(bytes, retention = "stream") {
	return resolveSqliteWorkerBroker().reserveInputPreparation(bytes, retention);
}
/**
* Retain an admitted writer through native settlement. Backends request authority
* before BEGIN and again immediately before COMMIT; the host never joins a native
* writer lock. A successful commit grant linearizes against subsequent revocation.
*/
function runSqliteWorkerStoreWrite(store, operation, assertCurrent, nativeLocations) {
	return runSqliteWorkerStoreOperation(store, operation, void 0, assertCurrent, createSqliteWorkerWriteAdmission(assertCurrent, nativeLocations));
}
function createSqliteWorkerWriteAdmission(assertCurrent, nativeLocations, attachment) {
	return () => {
		let phase = "waiting";
		return {
			nativeLocations,
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (!((phase === "waiting" || phase === "transaction") && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error("SQLite worker write authority requested out of order");
				assertCurrent(request);
				if (!grant()) throw new Error("SQLite worker write authority expired");
				phase = request.stage === "transaction" ? "transaction" : "commit";
			}, attachment)
		};
	};
}
/** Read the broker's recorded lifecycle state without probing native storage. */
function isSqliteWorkerStoreAvailable(store) {
	return resolveSqliteWorkerBroker().isAvailable(store);
}
/** Internal identity for the existing canonical actor, never a transferable authority. */
function getSqliteWorkerActorIdentity(store) {
	return resolveSqliteWorkerBroker().getActorIdentity(store);
}
function retireSqliteWorkerActor(identity) {
	return withCallerErrors(resolveSqliteWorkerBroker().retireActor(identity));
}
/** Recorded orphan custody at its original shared-state opening path. */
function hasUnclaimedSharedStateSqliteCleanup(databasePath) {
	return resolveSqliteWorkerBroker().hasUnclaimedSharedStateCleanup(databasePath);
}
/** Explicit cleanup only; referenced actors and other opening scopes are untouched. */
function closeUnclaimedSharedStateSqliteWorkers(databasePath) {
	return withCallerErrors(resolveSqliteWorkerBroker().closeUnclaimedSharedState(databasePath));
}
function openSqliteWorkerStore(options) {
	if (!isMainThread) return Promise.reject(new SqliteWorkerError("SQLite stores in application workers require the host broker connection", "unavailable"));
	return resolveSqliteWorkerBroker().open(options);
}
/** Admit the canonical per-agent execution group through its retained host owner. */
function openAgentDatabaseSqliteWorkerStore(options, custody) {
	if (!isMainThread) return Promise.reject(new SqliteWorkerError("Agent admission requires its host owner", "unavailable"));
	custody.assertCurrent();
	return withCallerErrors(resolveSqliteWorkerBroker().open(options, custody.stateContext, () => custody.assertCurrent(), {
		createAdmission: custody.createAdmission,
		stateDatabasePath: custody.stateDatabasePath,
		onNativeLost: custody.onNativeLost,
		onNativeStopped: custody.onNativeStopped,
		signal: custody.signal
	}));
}
/** Host-internal admission for the canonical shared-state actor. */
function openSharedStateSqliteWorkerStore(options, stateContext, assertCurrent, lifecycle) {
	if (!isMainThread) return Promise.reject(new SqliteWorkerError("Shared-state admission requires the host broker", "unavailable"));
	return withCallerErrors(resolveSqliteWorkerBroker().open({
		...options,
		input: void 0
	}, stateContext, assertCurrent, lifecycle)).then((store) => {
		if (store) {
			const execute = store.execute.bind(store);
			const close = store.close.bind(store);
			store.execute = bindCallerExecute({ execute }).execute;
			store.close = () => withCallerErrors(close());
		}
		return store;
	});
}
//#endregion
export { isSqliteWorkerStoreAvailable as a, openSqliteWorkerStore as c, runSqliteWorkerStoreOperation as d, runSqliteWorkerStoreWrite as f, hasUnclaimedSharedStateSqliteCleanup as i, reserveSqliteWorkerInputPreparation as l, createSqliteWorkerWriteAdmission as n, openAgentDatabaseSqliteWorkerStore as o, withSqliteWorkerCleanupFailure as p, getSqliteWorkerActorIdentity as r, openSharedStateSqliteWorkerStore as s, closeUnclaimedSharedStateSqliteWorkers as t, retireSqliteWorkerActor as u };
