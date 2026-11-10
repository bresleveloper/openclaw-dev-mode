import { A as isMissingPathError, ft as toErrorObject, j as resolveIdentityPathViaExistingAncestorSync } from "./redact-tYkqLD33.mjs";
import { B as resolveGlobalSingleton } from "./utils-c2rFzEZe.mjs";
import { b as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { o as sleepWithAbort, r as racePromiseWithAbortSignal } from "./src-Dpfm4nnc.mjs";
import { J as StateDatabaseReadAdmissionInvalidatedError, L as resolveNodeCompileCacheEnv, Q as captureOpenClawDatabaseMaintenanceResource, V as acquireStateDatabaseSchemaLease, W as captureStateDatabaseAccess, X as isStateDatabaseReadAdmissionInvalidatedError, et as getOpenClawDatabaseMaintenanceScope, n as hydrateOpenClawStateWorkerError, o as findOpenClawStateDatabaseFailure, r as retainOpenClawStateWorkerErrorPayload, v as createSqliteWorkerTransferOwner, y as createSqliteWorkerTransferReceiver } from "./sqlite-snapshot-staging-owner-ctWsxzq7.mjs";
import { r as getChildLogger, t as createSubsystemLogger } from "./subsystem-Y9GXTYwe.mjs";
import { c as readDatabasePathIdentity, k as runInDetachedAsyncContext, r as inspectDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-BvirgyPs.mjs";
import { n as createDeferredCore } from "./promise-like-ByIJ_1fR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-D1WzHpsK.mjs";
import { c as resolveQuarantineStorePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { V as throwSqliteLifecycleErrors, f as hasSqliteDatabaseSchemaAdmissionForPath, i as captureSqliteDatabaseAdmissions, k as trackSqliteDatabaseAdmissionWorker, lt as ensureSqliteLibrarySelected, r as canShareSqliteDatabaseAdmissions, rt as createSqliteDatabaseAdmissionCursor, st as captureSqliteWorkerClosePolicy, z as createSqliteLifecycleAggregateError } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { c as installSqliteNativeRuntimeAdmission } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { J as retainSqliteWriteAdmissionService, M as SQLITE_IDLE_HANDLE_TTL_MS, O as getExistingOpenClawStateSchemaPath, f as openClawStateDatabaseCache, g as registerOpenClawStateDatabaseLifecycleListener, h as registerOpenClawStateDatabaseAsyncResource, k as isExistingOpenClawStateSchema, m as recordOpenClawStateDatabaseOpenFailure, p as publishOpenClawStateDatabaseWorkerAdmission, r as captureOpenClawStateDatabaseReadAdmission, t as assertPublishedOpenClawStateDatabaseLifecycle, u as getOpenClawStateDatabaseTerminalFailureAsync } from "./openclaw-state-db-cache-CRSDAqPM.mjs";
import { A as StateDatabaseAdmissionPendingError, I as createCpuTrackedWorker, R as runWithMainThreadTask, S as trackWorkerRequest, c as SqliteWorkerSlotCustody, d as SQLITE_WORKER_MAX_MESSAGE_BYTES, f as SqliteWorkerAdmissionTimeoutError, g as resolveSqliteBrokerWorkerCount, i as createSqliteWorkerOperationAdmission, l as readSqliteWorkerRequestCustody, m as retainSqliteWorkerErrorCode, o as readSqliteWorkerExecutionAuthority, p as SqliteWorkerError, r as runQueuedStoreWrite, x as classifyWorkerRequest, z as captureRuntimeWorkerSource } from "./worker-task-pool-Cn7mBBG4.mjs";
import { a as runtimeNeedsTypeScriptLoader, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-BOuHXXbo.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C6BkyDvx.mjs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { isMainThread, isMarkedAsUntransferable } from "node:worker_threads";
import { realpath, stat } from "node:fs/promises";
import { isPromise } from "node:util/types";
import { deserialize, serialize } from "node:v8";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/infra/sqlite-worker-state-context.ts
function captureSqliteWorkerStateContext(context) {
	return {
		environment: { ...context.environment },
		...context.initializationEnvironment ? { initializationEnvironment: { ...context.initializationEnvironment } } : {},
		...context.initializationAgentPaths ? { initializationAgentPaths: [...context.initializationAgentPaths] } : {},
		existingSchemaPath: context.existingSchemaPath,
		stateIntegrity: context.stateIntegrity,
		artifactPreservingReads: context.artifactPreservingReads,
		scheduledMaintenanceSuspension: context.scheduledMaintenanceSuspension
	};
}
/** Charge captured initialization facts together with the request bytes retained by admission. */
function sqliteWorkerRequestBytes(input, context, preparation) {
	const agentPathBytes = context?.initializationAgentPaths?.reduce((bytes, agentPath) => bytes + Buffer.byteLength(agentPath, "utf8"), 0) ?? 0;
	return [context?.environment, context?.initializationEnvironment].reduce((bytes, environment) => Object.entries(environment ?? {}).reduce((total, [key, value]) => total + Buffer.byteLength(key, "utf8") + Buffer.byteLength(value ?? "", "utf8"), bytes), input.byteLength + (preparation?.byteLength ?? 0) + agentPathBytes + (context?.scheduledMaintenanceSuspension?.byteLength ?? 0));
}
const stateContexts = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerStateContext"), () => new AsyncLocalStorage());
/** Keep the actor's live maintenance holds after the opening command returns. */
function captureSqliteWorkerWalMaintenanceSuspension() {
	const buffer = stateContexts.getStore()?.scheduledMaintenanceSuspension;
	if (!buffer) return;
	const holds = new Int32Array(buffer);
	return () => Atomics.load(holds, 0) > 0;
}
/** Only cold writable opens need this factory's prior-existence constraint. */
function getSqliteWorkerExistingDatabaseIdentity(databasePath) {
	const existing = stateContexts.getStore()?.existingDatabase;
	return existing?.databasePath === databasePath ? existing.identity : void 0;
}
function getSqliteWorkerStateIntegrityAdmission() {
	return stateContexts.getStore()?.stateIntegrity;
}
//#endregion
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
//#region src/infra/acquire-with-wait.ts
/** Retry only acquisition, keeping the deadline independent of wall-clock changes. */
async function acquireWithWait(params) {
	const now = params.now ?? performance.now.bind(performance);
	let delayMs = params.pollIntervalMs;
	for (;;) try {
		return await params.acquire();
	} catch (error) {
		const retry = params.shouldRetry(error);
		if (!retry) throw error;
		const remainingMs = params.deadlineMs - now();
		if (remainingMs <= 0) throw error;
		await (params.sleep ?? setTimeout$1)(Math.min(retry === true ? delayMs : retry.delayMs, remainingMs));
		delayMs = Math.min(delayMs * 2, params.maxPollIntervalMs ?? params.pollIntervalMs);
	}
}
//#endregion
//#region src/infra/worker-transfer-bytes.ts
/** Only uniquely owned buffers can be transferred; pooled Buffers share unrelated bytes. */
function ownedWorkerBytes(bytes) {
	if (bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength && !isMarkedAsUntransferable(bytes.buffer)) return new Uint8Array(bytes.buffer);
	return Uint8Array.from(bytes);
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
//#region src/infra/sqlite-database-admission-turn.ts
const pending = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionTurns"), () => /* @__PURE__ */ new Map());
const current = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionTurnContext"), () => new AsyncLocalStorage());
function reserveAdmissionTurn(locations, families) {
	if (current.getStore()?.active || !canShareSqliteDatabaseAdmissions()) return;
	const keys = new Set(families.map((directory) => `family:${resolveIdentityPathViaExistingAncestorSync(directory)}`));
	for (const location of typeof locations === "string" ? [locations] : locations) {
		let identity;
		try {
			if (hasSqliteDatabaseSchemaAdmissionForPath(location)) continue;
			identity = inspectDatabasePathIdentitySync(location);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
		const canonicalPath = identity?.canonicalPath ?? resolveIdentityPathViaExistingAncestorSync(location);
		keys.add(`path:${canonicalPath}`);
		if (identity) keys.add(`${identity.key}:${identity.birthtime ?? ""}`);
		keys.add(`family:${path.dirname(canonicalPath)}`);
	}
	if (keys.size === 0) return;
	const predecessors = new Set([...keys].flatMap((key) => pending.get(key) ?? []));
	const completion = createDeferredCore();
	const turn = {
		keys,
		completion: completion.promise
	};
	for (const key of keys) pending.set(key, turn);
	const release = () => {
		for (const key of turn.keys) if (pending.get(key) === turn) pending.delete(key);
		completion.resolve();
	};
	return {
		ready: Promise.all([...predecessors].map((predecessor) => predecessor.completion)),
		release
	};
}
/** Only cold dispatch waits here; native getters never block the host on a worker's publication. */
function acquireSqliteDatabaseAdmissionTurn(locations, families = []) {
	const turn = reserveAdmissionTurn(locations, families);
	return turn?.ready.then(() => turn.release);
}
/** Known database locators are captured by their task owner before dispatch, never inferred from IPC. */
function runWithSqliteDatabaseAdmissionTurn(locations, operation, families = [], signal) {
	const turn = reserveAdmissionTurn(locations, families);
	if (!turn) return operation();
	return racePromiseWithAbortSignal(turn.ready, signal, (aborted) => aborted.reason).then(() => {
		const scope = { active: true };
		return current.run(scope, async () => {
			try {
				return await operation();
			} finally {
				scope.active = false;
				turn.release();
			}
		});
	}, (error) => {
		turn.ready.then(turn.release);
		throw error;
	});
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
		const { closeOpenClawStateDatabaseAsync } = await import("./openclaw-state-db-cache-DCj8VQHn.mjs");
		await closeOpenClawStateDatabaseAsync();
	})), "shared-state");
}
/** Charge captured input before actor preparation can yield, then hand it to normal dispatch. */
function reserveSqliteWorkerInputPreparation(bytes, retention = "stream") {
	return resolveSqliteWorkerBroker().reserveInputPreparation(bytes, retention);
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
//#region src/state/openclaw-state-worker-operation.ts
/** A live alias cannot authorize a worker still bound to a vanished opening path. */
function assertOpenClawStateWorkerActorPath(actor) {
	if (openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(actor.databasePath)?.key !== actor.key) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state worker opening path changed");
}
function runWithCapturedWorkerContext(context, operation) {
	const maintenance = context.maintenanceScope;
	const run = () => maintenance ? maintenance.run(() => maintenance.track(operation())) : operation();
	return context.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(run) : run();
}
function runWithOpenClawStateWorkerStore(store, context, operation, assertCurrent, createAdmission, signal) {
	const { admission } = context;
	const actor = getSqliteWorkerActorIdentity(store);
	return runSqliteWorkerStoreOperation(store, (scope) => operation(signal ? { execute: (command, options) => scope.execute(command, { signal: options?.signal ? AbortSignal.any([signal, options.signal]) : signal }) } : scope), context, (commandType) => {
		admission.assertCurrent();
		assertOpenClawStateWorkerActorPath(actor);
		assertCurrent?.(commandType);
	}, createAdmission);
}
function assertOpenClawStateWorkerSchemaContext(context) {
	isExistingOpenClawStateSchema(context.admission.databasePath);
	if (getExistingOpenClawStateSchemaPath() !== context.existingSchemaPath) throw new Error("Shared-state worker schema context does not match its caller");
}
/** Only native opening owns the caller scope; a cached actor must not retain it. */
function captureOpenClawStateWorkerOpeningGuard(context, assertCurrent, signal) {
	const databaseAdmission = context.admission;
	const admission = {
		assertCurrent,
		signal
	};
	let captured = AsyncLocalStorage.bind(() => {
		databaseAdmission.assertCurrent();
		try {
			admission.assertCurrent?.();
		} catch (error) {
			admission.refusal = { error };
			throw error;
		}
	});
	return {
		admission,
		assertCurrent: () => {
			if (!captured) throw new Error("Shared-state worker opening admission is closed");
			captured();
		},
		async run(open) {
			try {
				return await open();
			} catch (error) {
				if (admission.signal?.aborted) admission.refusal = { error };
				throw error;
			} finally {
				captured = void 0;
				admission.signal = void 0;
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-worker-lease.ts
/** Retain a logical actor resource while tracking only acquisition and individual commands. */
function retainOpenClawStateWorkerLease(context, owner, finalize) {
	const maintenance = context.maintenanceScope;
	context.admission.assertCurrent();
	maintenance?.assertAdmission();
	const ready = createDeferredCore();
	const admitted = createDeferredCore();
	const released = createDeferredCore();
	const invocations = /* @__PURE__ */ new Set();
	const operations = /* @__PURE__ */ new Set();
	let retained;
	let releaseOperation;
	let retirement;
	let closing;
	let sealed = false;
	let invalidated = false;
	let store;
	let scope;
	let acquisitionReady = false;
	ready.promise.catch(() => void 0);
	const assertResourceCurrent = () => resource?.assertCurrent();
	const assertInvocation = (invocation) => {
		if (invocation.phase === "closed" || invalidated) throw new SqliteWorkerError("Shared-state worker operation is closed", "closed");
		context.admission.assertCurrent();
		assertResourceCurrent();
	};
	const assertCommandAdmission = (invocation) => {
		assertInvocation(invocation);
		if (invocation.phase !== "accepting") throw new SqliteWorkerError("Shared-state worker operation is closed", "closed");
	};
	const assertNewOperation = () => {
		if (sealed) throw new SqliteWorkerError("Shared-state worker lease is closed", "closed");
		context.admission.assertCurrent();
		maintenance?.assertAdmission();
	};
	const retireNative = () => {
		retirement ??= (async () => {
			await admitted.promise.catch(() => void 0);
			released.resolve();
			const errors = [];
			try {
				await retained;
			} catch (error) {
				errors.push(error);
			}
			try {
				await releaseOperation?.();
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Shared-state worker lease retirement failed");
		})();
		retirement.catch(() => void 0);
		return retirement;
	};
	const retire = () => {
		sealed = true;
		invalidated = true;
		for (const invocation of invocations) invocation.phase = "closed";
		return retireNative();
	};
	const createOperationScope = (invocation) => ({ execute: (command, options) => {
		try {
			assertCommandAdmission(invocation);
		} catch (error) {
			const rejected = createDeferredCore();
			rejected.reject(error);
			rejected.promise.catch(() => void 0);
			return rejected.promise;
		}
		const run = async () => {
			if (!acquisitionReady) await racePromiseWithAbortSignal(ready.promise, options?.signal);
			assertInvocation(invocation);
			if (!scope) throw new SqliteWorkerError("Shared-state worker lease is not ready", "closed");
			return scope.execute(command, options);
		};
		const result = (resource ? resource.run(run) : run()).catch(async (error) => {
			if (store && !sealed && !isSqliteWorkerStoreAvailable(store)) try {
				await retire();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Shared-state operation and retirement failed", { cause: cleanupError });
			}
			throw error;
		});
		invocation.pending.add(result);
		const settled = () => invocation.pending.delete(result);
		result.then(settled, settled);
		return maintenance ? maintenance.track(result) : result;
	} });
	const runOperation = (operation) => {
		try {
			assertNewOperation();
		} catch (error) {
			const rejected = createDeferredCore();
			rejected.reject(error);
			rejected.promise.catch(() => void 0);
			return rejected.promise;
		}
		const invocation = {
			phase: "accepting",
			pending: /* @__PURE__ */ new Set()
		};
		invocations.add(invocation);
		const completion = createDeferredCore();
		operations.add(completion.promise);
		completion.promise.catch(() => void 0);
		const run = async () => {
			try {
				return await operation(createOperationScope(invocation));
			} finally {
				if (invocation.phase === "accepting") invocation.phase = "draining";
				await Promise.allSettled(invocation.pending);
				invocation.phase = "closed";
				invocations.delete(invocation);
			}
		};
		run().then((value) => {
			operations.delete(completion.promise);
			completion.resolve(value);
		}, (error) => {
			operations.delete(completion.promise);
			completion.reject(error);
		});
		return completion.promise;
	};
	const release = () => {
		if (invalidated) return retireNative();
		if (closing) return closing;
		sealed = true;
		closing = (async () => {
			const errors = [];
			const terminal = {
				phase: "accepting",
				pending: /* @__PURE__ */ new Set()
			};
			invocations.add(terminal);
			try {
				await ready.promise;
				await finalize?.(createOperationScope(terminal));
			} catch (error) {
				errors.push(error);
			} finally {
				if (terminal.phase === "accepting") terminal.phase = "draining";
				await Promise.allSettled(terminal.pending);
				terminal.phase = "closed";
				invocations.delete(terminal);
			}
			const results = await Promise.allSettled(operations);
			errors.push(...results.flatMap((result) => result.status === "rejected" ? [result.reason] : []));
			try {
				await retireNative();
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Shared-state worker lease cleanup failed");
		})();
		closing.catch(() => void 0);
		return closing;
	};
	const lease = {
		ready: ready.promise,
		execute: (command, options) => runOperation((operationScope) => operationScope.execute(command, options)),
		runOperation,
		release,
		retire
	};
	maintenance?.own(lease, "shared-resources", release);
	const resource = maintenance ? captureOpenClawDatabaseMaintenanceResource(lease, maintenance) : void 0;
	const acquire = async () => {
		try {
			const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context);
			if (failure) throw failure;
			context.admission.assertCurrent();
			store = await owner.open(context);
			context.admission.assertCurrent();
			if (!store) throw new Error("Canonical shared-state worker did not open its database");
			releaseOperation = owner.retainOperation(store, () => {
				retire();
			});
			retained = runWithOpenClawStateWorkerStore(store, context, async (operationScope) => {
				scope = operationScope;
				admitted.resolve();
				await released.promise;
			}, assertResourceCurrent);
			retained.catch(admitted.reject);
			await admitted.promise;
			context.admission.assertCurrent();
			if (invalidated) throw new SqliteWorkerError("Shared-state worker lease is closed", "closed");
		} catch (error) {
			const failure = error instanceof Error ? hydrateOpenClawStateWorkerError(error) : error;
			admitted.reject(failure);
			try {
				await retire();
			} catch (cleanupError) {
				if (cleanupError !== failure) throw new AggregateError([failure, cleanupError], "Shared-state lease acquisition failed", { cause: cleanupError });
			}
			throw failure;
		}
	};
	runWithCapturedWorkerContext(context, acquire).then(() => {
		acquisitionReady = true;
		ready.resolve();
	}, ready.reject);
	return lease;
}
//#endregion
//#region src/state/openclaw-state-worker-memory-pressure.ts
/** Subscribe only while the worker owner retains resources that pressure can reclaim. */
function createStateWorkerMemoryPressureSubscription(hasCustody, retireIdleWorkers) {
	const memoryPressure = channel("openclaw.memory.critical");
	let subscribed = false;
	return () => {
		const required = hasCustody();
		if (required === subscribed) return;
		subscribed = required;
		if (required) memoryPressure.subscribe(retireIdleWorkers);
		else memoryPressure.unsubscribe(retireIdleWorkers);
	};
}
//#endregion
//#region src/state/openclaw-state-worker-native-loss.ts
function createNotifier(listeners) {
	return notifyListeners.bind(void 0, listeners, void 0);
}
function retainListener(entry, onNativeLost) {
	if (!onNativeLost) return;
	const release = registerListener(entry.nativeLostListeners, onNativeLost);
	if (!entry.store || !isSqliteWorkerStoreAvailable(entry.store)) onNativeLost();
	return release;
}
//#endregion
//#region src/state/openclaw-state-worker-owner.ts
const log = createSubsystemLogger("state/worker");
const SHARED_STATE_WORKER_IDLE_INSPECT_MS = 6e4;
function createSharedStateWorkerOwner() {
	const moduleUrl = resolveRuntimeProcessEntrypointUrl("sharedStateStore");
	const stores = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const retiring = /* @__PURE__ */ new Map();
	const retiringActors = /* @__PURE__ */ new Map();
	const refreshPressureSubscription = createStateWorkerMemoryPressureSubscription(() => stores.size > 0 || retiring.size > 0 || retiringActors.size > 0 || activeEntries.size > 0, retireIdleWorkers);
	const matches = (entry, identity) => identity === void 0 || entry.context.admission.identity.key === identity.key;
	const hasActiveActorOperations = (entry) => [...activeEntries].some((active) => entry.actor ? active.actor === entry.actor : active === entry);
	const clearIdleRetirement = (entry) => {
		if (entry.idleTimer) {
			clearTimeout(entry.idleTimer);
			entry.idleTimer = void 0;
		}
	};
	const hasPendingCleanup = (entry) => entry.cleanup?.pending ?? (!entry.context.maintenanceScope && hasUnclaimedSharedStateSqliteCleanup(entry.context.admission.databasePath));
	const retire = (entry) => {
		clearIdleRetirement(entry);
		stores.delete(entry);
		let attempt = retiring.get(entry);
		if (!attempt) {
			attempt = {};
			retiring.set(entry, attempt);
		}
		refreshPressureSubscription();
		if (attempt.pending) return attempt.pending;
		if (entry.actor && retiringActors.has(entry.actor)) return retireActor(entry.actor, entry.context.admission.identity);
		const pending = (entry.store ? entry.store.close() : entry.opening.then((store) => store?.close(), () => entry.cleanup ? entry.cleanup.close() : entry.context.maintenanceScope ? void 0 : closeUnclaimedSharedStateSqliteWorkers(entry.context.admission.databasePath))).catch(async (error) => {
			if (!attempt.actorSettlement) throw error;
			await attempt.actorSettlement;
		});
		attempt.pending = pending;
		const settled = () => {
			attempt.pending = void 0;
			if (!hasPendingCleanup(entry)) retiring.delete(entry);
			refreshPressureSubscription();
		};
		pending.then(settled, settled);
		return pending;
	};
	const scheduleIdleRetirement = (entry) => {
		if (entry.activeOperations !== 0 || entry.idleTimer || entry.context.maintenanceScope || !entry.store || !stores.has(entry)) return;
		const store = entry.store;
		const deadline = performance$1.now() + SQLITE_IDLE_HANDLE_TTL_MS;
		const arm = (delay, inspect) => {
			const isCurrentIdle = () => entry.idleTimer === timer && entry.activeOperations === 0 && stores.has(entry);
			const settle = async () => {
				if (!isCurrentIdle()) return;
				let healthy = false;
				if (inspect) try {
					healthy = await runWithCapturedWorkerContext(entry.context, () => runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "database.inspectIdle",
						input: void 0
					}), entry.context, () => {
						entry.context.admission.assertCurrent();
						if (!isCurrentIdle()) throw new Error("Shared-state worker resumed before idle inspection");
					})) === "healthy" && isSqliteWorkerStoreAvailable(store);
					entry.context.admission.assertCurrent();
				} catch {
					healthy = false;
				}
				if (!isCurrentIdle()) return;
				entry.idleTimer = void 0;
				const remaining = deadline - performance$1.now();
				if (healthy && remaining > 0) arm(remaining, false);
				else await retire(entry);
			};
			const timer = runInDetachedAsyncContext(() => setTimeout(() => {
				settle().catch((error) => {
					log.warn("Idle shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
			}, delay));
			entry.idleTimer = timer;
			timer.unref?.();
		};
		arm(SHARED_STATE_WORKER_IDLE_INSPECT_MS, true);
	};
	const retireAfterFailure = async (entry, error, stage) => {
		try {
			await retire(entry);
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], `Shared-state worker ${stage} and cleanup failed`, { cause: cleanupError });
		}
		throw error;
	};
	const retainOperation = (store, onNativeLost) => {
		const entry = [...stores].find((candidate) => candidate.store === store);
		if (!entry) throw new Error("Shared-state worker operation lost its actor owner");
		clearIdleRetirement(entry);
		entry.activeOperations += 1;
		activeEntries.add(entry);
		const releaseNativeLost = retainListener(entry, onNativeLost);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			releaseNativeLost?.();
			entry.activeOperations -= 1;
			if (entry.activeOperations === 0) activeEntries.delete(entry);
			refreshPressureSubscription();
			if (stores.has(entry) && !isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				const pending = entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry);
				pending.catch((error) => {
					log.warn("Shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
				return pending;
			}
			scheduleIdleRetirement(entry);
		};
	};
	const retainActorSettlement = (attempt, pending) => {
		for (const entry of attempt.entries) {
			const closing = retiring.get(entry);
			if (closing) closing.actorSettlement = pending;
		}
		return pending;
	};
	const retireActor = (actor, identity) => {
		let attempt = retiringActors.get(actor);
		if (!attempt) {
			attempt = {
				identity,
				entries: /* @__PURE__ */ new Set()
			};
			retiringActors.set(actor, attempt);
		}
		for (const entry of [...stores, ...retiring.keys()]) if (entry.actor === actor) {
			attempt.entries.add(entry);
			clearIdleRetirement(entry);
			stores.delete(entry);
		}
		refreshPressureSubscription();
		if (attempt.pending) return retainActorSettlement(attempt, attempt.pending);
		const current = attempt;
		const complete = () => {
			for (const entry of current.entries) {
				clearIdleRetirement(entry);
				stores.delete(entry);
				retiring.delete(entry);
			}
			retiringActors.delete(actor);
			refreshPressureSubscription();
		};
		const pending = retireSqliteWorkerActor(actor).then(complete, (error) => {
			current.pending = void 0;
			if (current.entries.size > 0 && [...current.entries].every((entry) => entry.cleanup?.pending === false)) {
				complete();
				return;
			}
			throw error;
		});
		current.pending = pending;
		return retainActorSettlement(current, pending);
	};
	const joinActorRetirement = async (attempt) => {
		if (!attempt.pending) throw new Error("Shared-state actor cleanup is pending; close the database before reopening");
		await attempt.pending;
	};
	const inspectInvalidEntry = (entry) => {
		const actor = entry.actor;
		let kind = "actor";
		try {
			if (entry.bound && actor) {
				assertOpenClawStateWorkerActorPath(actor);
				if (entry.store && isSqliteWorkerStoreAvailable(entry.store)) kind = "client";
			}
			entry.databaseAdmission.assertCurrent();
		} catch (error) {
			if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
			if (kind === "client" && openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(entry.context.admission.databasePath)?.key === actor?.key) kind = "actor";
			return {
				kind,
				error
			};
		}
	};
	const retireInvalidEntry = (entry) => {
		const invalid = inspectInvalidEntry(entry);
		if (!invalid) return;
		if (invalid.kind === "actor") {
			if (hasActiveActorOperations(entry)) throw invalid.error;
			return { pending: entry.opening.then(() => {
				if (hasActiveActorOperations(entry)) throw invalid.error;
				return entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry);
			}, () => retire(entry)) };
		}
		if (!stores.has(entry)) return;
		const closing = retire(entry);
		return { pending: entry.activeOperations === 0 ? closing : void 0 };
	};
	async function close(identity) {
		for (const entry of stores.values()) if (matches(entry, identity)) retire(entry);
		const errors = (await Promise.allSettled([...[...retiring.keys()].filter((entry) => matches(entry, identity)).map(retire), ...[...retiringActors].filter(([, attempt]) => !identity || attempt.identity.key === identity.key).map(([actor, attempt]) => retireActor(actor, attempt.identity))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		refreshPressureSubscription();
		if (errors.length) throw new AggregateError(errors, "Failed to close shared-state SQLite workers");
	}
	registerOpenClawStateDatabaseAsyncResource({
		phase: "after-resources",
		close
	});
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened") {
			if (!event.identity) return;
			close(event.identity).catch((error) => {
				log.warn("Shared-state worker retirement failed", {
					path: event.path,
					error
				});
			});
		}
	});
	function retireIdleWorkers() {
		for (const entry of stores) if (entry.idleTimer && entry.store && !entry.context.maintenanceScope && !hasActiveActorOperations(entry)) runInDetachedAsyncContext(() => retire(entry)).catch((error) => {
			log.warn("Idle shared-state worker retirement failed", {
				path: entry.context.admission.databasePath,
				error
			});
		});
	}
	return {
		close,
		retainOperation,
		async openCleanup(databasePath, context, assertOwned, identity, maintenanceScope) {
			const expectedIdentity = { ...identity };
			assertOwned();
			if (!expectedIdentity.key.startsWith("file:")) return;
			const assertCurrent = () => {
				assertOwned();
				assertExistingDatabaseIdentity(databasePath, expectedIdentity.key, expectedIdentity.birthtime);
				for (const entry of activeEntries) if (matches(entry, expectedIdentity) && entry.store && !isSqliteWorkerStoreAvailable(entry.store)) throw new SqliteWorkerError("Shared-state cleanup is waiting for accepted operations to settle", "unavailable");
			};
			assertCurrent();
			for (const attempt of retiringActors.values()) if (attempt.identity.key === expectedIdentity.key) {
				assertCurrent();
				await joinActorRetirement(attempt);
				assertCurrent();
			}
			for (const entry of /* @__PURE__ */ new Set([...stores, ...retiring.keys()])) if ((stores.has(entry) || retiring.has(entry)) && matches(entry, expectedIdentity) && entry.store && !isSqliteWorkerStoreAvailable(entry.store)) {
				assertCurrent();
				await (entry.actor ? retireActor(entry.actor, expectedIdentity) : retire(entry));
				assertCurrent();
			}
			return openSharedStateSqliteWorkerStore({
				...captureRuntimeWorkerSource(moduleUrl),
				databasePath,
				existingOnly: true
			}, context, assertCurrent, { cleanupAccess: maintenanceScope && { assertDatabaseAccess: maintenanceScope.assertCleanupDatabaseAccess } });
		},
		async open(context, options = {}) {
			const { existingOnly = false, assertCurrent, preparation, signal } = options;
			const { admission } = context;
			const wait = (pending) => racePromiseWithAbortSignal(pending, signal);
			const source = captureRuntimeWorkerSource(moduleUrl);
			const assertAdmission = () => {
				signal?.throwIfAborted();
				admission.assertCurrent();
				assertCurrent?.();
			};
			assertAdmission();
			assertOpenClawStateWorkerSchemaContext(context);
			let entry;
			let ownsOpening = false;
			for (;;) {
				for (const candidate of /* @__PURE__ */ new Set([...stores, ...retiring.keys()])) {
					if (!matches(candidate, admission.identity)) continue;
					const retirement = retireInvalidEntry(candidate);
					if (retirement) {
						if (retirement.pending) await wait(retirement.pending);
						return this.open(context, options);
					}
					if (stores.has(candidate) && (candidate.context.existingSchemaPath !== context.existingSchemaPath || candidate.source.moduleUrl.href !== source.moduleUrl.href)) {
						await wait(retire(candidate));
						assertAdmission();
					}
				}
				for (const attempt of retiringActors.values()) if (attempt.identity.key === admission.identity.key) {
					await wait(joinActorRetirement(attempt));
					assertAdmission();
				}
				for (const [retiringEntry, attempt] of retiring) if (matches(retiringEntry, admission.identity) && retiringEntry.context.maintenanceScope === context.maintenanceScope) {
					if (inspectInvalidEntry(retiringEntry)?.kind === "client") continue;
					if (!attempt.pending) {
						if (!hasPendingCleanup(retiringEntry)) {
							retiring.delete(retiringEntry);
							refreshPressureSubscription();
							continue;
						}
						throw new Error("Shared-state SQLite cleanup is pending; close the database before reopening");
					}
					try {
						await wait(attempt.pending);
					} catch (error) {
						if (retiring.get(retiringEntry) === attempt) throw error;
					}
					assertAdmission();
				}
				assertAdmission();
				entry = [...stores].find((candidate) => matches(candidate, admission.identity) && candidate.context.maintenanceScope === context.maintenanceScope && candidate.context.existingSchemaPath === context.existingSchemaPath);
				if (!entry || entry.store || entry.openingAdmission.assertCurrent === assertCurrent && entry.openingAdmission.signal === signal) break;
				let rejected;
				try {
					await wait(entry.opening);
				} catch (error) {
					rejected = { error };
				}
				assertAdmission();
				if (rejected && (!entry.openingAdmission.refusal || !Object.is(rejected.error, entry.openingAdmission.refusal.error))) throw rejected.error;
			}
			if (!entry) {
				ownsOpening = true;
				assertAdmission();
				const databaseAdmission = captureOpenClawStateDatabaseReadAdmission(admission.databasePath);
				assertAdmission();
				const openingGuard = captureOpenClawStateWorkerOpeningGuard(context, assertCurrent, signal);
				const nativeLostListeners = /* @__PURE__ */ new Set();
				const open = () => openingGuard.run(() => openSharedStateSqliteWorkerStore({
					...source,
					databasePath: admission.databasePath,
					existingOnly
				}, context, openingGuard.assertCurrent, {
					maintenanceScope: context.maintenanceScope,
					preparation,
					signal,
					retainCleanup: (cleanup) => {
						admitted.cleanup = cleanup;
					},
					onNativeLost: createNotifier(nativeLostListeners)
				}));
				const admitted = {
					source,
					context,
					databaseAdmission,
					openingAdmission: openingGuard.admission,
					existingOnly,
					nativeLostListeners,
					activeOperations: 0,
					opening: context.maintenanceScope ? open() : runInDetachedAsyncContext(open)
				};
				entry = admitted;
				admitted.opening = admitted.opening.then((store) => {
					if (store) {
						admitted.store = store;
						admitted.actor = getSqliteWorkerActorIdentity(store);
					} else {
						stores.delete(admitted);
						refreshPressureSubscription();
					}
					admitted.openingAdmission.assertCurrent = void 0;
					return store;
				});
				stores.add(entry);
				refreshPressureSubscription();
				context.maintenanceScope?.own(entry, "shared-resources", () => retire(admitted));
				entry.opening.catch(() => {
					stores.delete(admitted);
					admitted.openingAdmission.assertCurrent = void 0;
					if (hasPendingCleanup(admitted) && !retiring.has(admitted)) retiring.set(admitted, {});
					refreshPressureSubscription();
				});
			}
			const store = await (ownsOpening ? entry.opening : wait(entry.opening));
			try {
				admission.assertCurrent();
			} catch (error) {
				return retireAfterFailure(entry, error, "admission");
			}
			assertCurrent?.();
			if (!store) return !existingOnly && entry.existingOnly ? this.open(context, {
				...options,
				existingOnly: false
			}) : void 0;
			if (!stores.has(entry)) return this.open(context, options);
			clearIdleRetirement(entry);
			const actorRetirement = entry.actor ? retiringActors.get(entry.actor) : void 0;
			if (entry.actor && actorRetirement) {
				actorRetirement.entries.add(entry);
				stores.delete(entry);
				refreshPressureSubscription();
				await wait(joinActorRetirement(actorRetirement));
				return this.open(context, options);
			}
			if (!isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				await wait(entry.actor ? retireActor(entry.actor, admission.identity) : retire(entry));
				return this.open(context, options);
			}
			try {
				if (!entry.bound) {
					publishOpenClawStateDatabaseWorkerAdmission(entry.context.admission);
					entry.bound = true;
				}
			} catch (error) {
				return retireAfterFailure(entry, error, "binding");
			}
			const retirement = retireInvalidEntry(entry);
			if (retirement) {
				if (retirement.pending) await wait(retirement.pending);
				return this.open(context, options);
			}
			stores.delete(entry);
			stores.add(entry);
			return store;
		}
	};
}
function getOpenClawStateWorkerOwner() {
	assertPublishedOpenClawStateDatabaseLifecycle();
	return resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerOwner"), createSharedStateWorkerOwner);
}
//#endregion
//#region src/state/openclaw-state-worker-store.ts
/** Retain the canonical actor for capture callbacks and their terminal writes. */
function createOpenClawStateWorkerLease(context, finalize) {
	return retainOpenClawStateWorkerLease(context, {
		open: (captured) => getOpenClawStateWorkerOwner().open(captured),
		retainOperation: (store, onNativeLost) => getOpenClawStateWorkerOwner().retainOperation(store, onNativeLost)
	}, finalize);
}
async function runOpenClawStateWorkerOperation(context, operation, options) {
	return runWithCapturedWorkerContext(context, async () => {
		try {
			options?.signal?.throwIfAborted();
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context, options?.signal);
			if (failure) throw failure;
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			const store = await getOpenClawStateWorkerOwner().open(context, options);
			if (!store) {
				options?.signal?.throwIfAborted();
				context.admission.assertCurrent();
				if (options?.existingOnly) return;
				throw new Error("Canonical shared-state worker did not open its database");
			}
			const releaseOperation = getOpenClawStateWorkerOwner().retainOperation(store);
			try {
				options?.signal?.throwIfAborted();
				context.admission.assertCurrent();
				options?.assertCurrent?.();
				return await runWithOpenClawStateWorkerStore(store, context, operation, options?.assertCurrent, options?.createAdmission, options?.signal);
			} finally {
				releaseOperation();
			}
		} catch (error) {
			const hydrated = hydrateOpenClawStateWorkerError(error);
			const failure = findOpenClawStateDatabaseFailure(hydrated, context.admission.databasePath);
			if (failure && !openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(context.admission.databasePath)) {
				try {
					context.admission.assertCurrent();
				} catch {
					throw hydrated;
				}
				recordOpenClawStateDatabaseOpenFailure(context.admission.databasePath, failure);
			}
			throw hydrated;
		}
	});
}
//#endregion
export { captureSqliteWorkerWalMaintenanceSuspension as a, acquireSqliteDatabaseAdmissionTurn as i, runOpenClawStateWorkerOperation as n, getSqliteWorkerExistingDatabaseIdentity as o, reserveSqliteWorkerInputPreparation as r, getSqliteWorkerStateIntegrityAdmission as s, createOpenClawStateWorkerLease as t };
