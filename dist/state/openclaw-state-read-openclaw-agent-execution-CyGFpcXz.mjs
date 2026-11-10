import { s as resolveGlobalSingleton, t as notifyListeners } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { L as resolveOpenClawStateSqlitePath, _ as retainSqliteWorkerErrorCode, s as recordWorkerMessage } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { Dt as assertExistingDatabaseIdentity, J as throwSqliteLifecycleErrors, Nt as readDatabasePathIdentity, Pt as readDatabasePathIdentitySync, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { $ as AgentDatabaseSchemaAdmissionChangedError, B as drainAgentDatabaseResources, G as assertAgentDeletionCleanupAliases, H as registerOpenClawAgentDatabaseAsyncResource, J as getAgentDeletionDatabaseCleanup, Q as AgentDatabaseExecutionAdmissionClosedError, X as registerAgentDeletionExecutionCleanup, dt as isIncognitoOpenClawAgentSqlitePath, gt as resolveOpenClawAgentSqlitePath, it as captureAgentCreationClaim, nt as assertAgentCreationClaimAliases, pt as isSameOpenClawAgentDatabasePath, q as assertAgentDeletionExecutionCleanupAccess } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { o as sleepWithAbort } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { C as cloneEnvWithPlatformSemantics, T as SQLITE_IDLE_HANDLE_TTL_MS, ct as publishSqliteWalCheckpointObservation, d as registerOpenClawStateDatabaseAsyncResource, l as publishOpenClawStateDatabaseWorkerAdmission } from "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { t as formatErrorMessage } from "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { E as runOutsideOpenClawDatabaseMaintenanceScope, S as getOpenClawDatabaseMaintenanceScope, T as observeOpenClawDatabaseMaintenanceResource, w as isOpenClawDatabaseMaintenanceWorkerAccess } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { T as schemaAdmission, r as isSqliteLockError } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { r as createSqliteWorkerOperationAdmission, t as bindSqliteWorkerExecutionAuthority, u as AgentDatabaseExecutionLifetime } from "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { a as runtimeProcessEntrypoints } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import { r as resolveRuntimeWorkerUrl } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { Ct as getOpenClawAgentDatabaseValidationForTransfer, Et as invalidateOpenClawAgentDatabaseValidation, Tt as hasRevokedOpenClawAgentDatabaseValidation, _t as recordAgentDatabaseStartupFtsRepair, at as hasAgentDatabaseMaintenanceAuthority, bt as captureOpenClawAgentDatabaseAdmissionPublication, kt as retireReplacedAgentValidation, mt as captureAgentDatabasePreparationJournal, n as cache, pt as captureAgentDatabaseAdmission, ut as getGatewayRestartDrainSignal } from "./openclaw-state-read-openclaw-agent-write-admission-D5Qp4bnz.mjs";
import { C as captureOpenClawStateReadContext, w as captureOpenClawStateWorkerContext } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import { C as readOpenClawAgentDatabaseIdentity, S as isOpenClawAgentDatabasePathCurrent, d as captureOpenClawAgentDatabaseRegistration, g as settleAgentRegistration } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
import { a as openAgentDatabaseSqliteWorkerStore, c as runSqliteWorkerStoreOperation, i as isSqliteWorkerStoreAvailable, t as closeUnclaimedSharedStateSqliteWorkers } from "./openclaw-state-read-sqlite-worker-store-BDES2IEB.mjs";
import "./openclaw-state-read-backoff-CNu4LCc8.mjs";
import { t as openOpenClawStateWorkerCleanupStore } from "./openclaw-state-read-openclaw-state-worker-store-CiPw7-m3.mjs";
import { n as assertAgentSessionWriteAdmission } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
import path from "node:path";
import { MessagePort } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { addAbortListener } from "node:events";
//#endregion
//#region src/state/agent-deletion-cleanup-admission.ts
/** Bind the request's cleanup owner, including accepted native work, before transferring a grant. */
function captureAgentDeletionCleanupAdmission(options, operation, assertSourceCurrent) {
	const cleanup = getAgentDeletionDatabaseCleanup(options);
	if (!cleanup?.worker) return;
	const worker = cleanup.worker;
	cleanup.assertCurrentHost();
	return {
		guard: worker.guard,
		assertCurrent: cleanup.assertCurrentHost,
		authorize(request) {
			const facts = request.facts;
			if (request.stage !== "prepare" || !isRecord(facts) || facts.kind !== "agent-deletion-current" && facts.kind !== "agent-deletion-lease") return false;
			assertSourceCurrent();
			cleanup.assertCurrentHost();
			if (!isDeepStrictEqual(facts.guard, worker.guard)) throw new Error("Agent deletion request differs from its live cleanup owner");
			if (facts.kind === "agent-deletion-lease") {
				if (!(facts.port instanceof MessagePort)) throw new Error("Agent deletion lost its lease admission handoff port");
				const leased = worker.lease.createAdmission(operation);
				try {
					facts.port.postMessage(leased.admission.port, [leased.admission.port]);
					recordWorkerMessage("admission", "to_worker");
					operation.settled.then(() => leased.admission.finish());
				} catch (error) {
					leased.admission.finish();
					throw error;
				} finally {
					facts.port.close();
				}
			}
			return true;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-cleanup.ts
/** Release only this owner's prepared lease after the broker certifies native retirement. */
async function cleanupRetiredAgentDatabaseLease(params) {
	params.assertOwned();
	await params.stopped;
	params.assertOwned();
	const refusedBeforeAgentOpen = params.readOpenRefused?.() === true;
	if (params.closed?.()) return;
	const observed = await readDatabasePathIdentity(params.lease.sharedStatePath);
	if (observed.key !== params.lease.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
	params.assertOwned();
	if (!refusedBeforeAgentOpen) invalidateOpenClawAgentDatabaseValidation(params.lease.path);
	const context = {
		environment: params.context.environment,
		existingSchemaPath: params.context.existingSchemaPath,
		stateIntegrity: params.context.stateIntegrity
	};
	const store = await openOpenClawStateWorkerCleanupStore(params.lease.sharedStatePath, context, () => params.assertOwned(), observed, params.context.maintenanceScope).catch((error) => {
		if (error instanceof Error) {
			error.message += ` (leaseId=${params.lease.leaseId}, path=${params.lease.path})`;
			error.stack = `${error.name}: ${error.message}\n${error.stack ?? ""}`;
		}
		throw error;
	});
	if (!store) throw new Error("Retired agent cleanup lost its original shared database");
	const errors = [];
	try {
		await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type: "agentDatabases.releaseExitedLease",
			input: {
				...params.lease,
				outcome: refusedBeforeAgentOpen ? "refused-before-open" : "unknown"
			}
		}), context, () => params.assertOwned(), () => ({
			nativeLocations: [params.lease.sharedStatePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				params.assertOwned();
				if (request.stage === "prepare" && request.facts === "agent-integrity-invalidated") invalidateOpenClawAgentDatabaseValidation(params.lease.path);
				grant();
			})
		}));
	} catch (error) {
		errors.push(error);
	}
	try {
		await store.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retired agent lease cleanup and Worker close failed");
}
/** Native closure is reusable only for the exact incarnation and original worker lease. */
function readAgentDatabaseClosedReceipt(receipt, identity, lease) {
	if (!receipt || !identity || !lease || receipt.incarnation !== identity.incarnation || receipt.identity.key !== `file:${identity.physicalIdentity}` || receipt.identity.canonicalPath !== identity.nativeLocation) return;
	return {
		receipt,
		identity,
		lease
	};
}
function publishAgentDatabaseCloseCheckpoint(pathname, closed, assertCleanupOwned) {
	if (!closed) return;
	const { receipt, identity, lease } = closed;
	try {
		assertCleanupOwned();
		assertExistingDatabaseIdentity(pathname, receipt.identity.key);
		assertExistingDatabaseIdentity(identity.nativeLocation, receipt.identity.key);
		assertExistingDatabaseIdentity(lease.sharedStatePath, lease.sharedStateIdentity);
		publishSqliteWalCheckpointObservation(pathname, receipt.checkpoint);
	} catch {}
}
//#endregion
//#region src/state/openclaw-agent-execution-native.ts
/** A logical execution owner can replace this generation only after its native close settles. */
function createAgentDatabaseNativeGeneration(agentId, pathname, context, logicalLifetime, assertLogicalCurrent, assertCleanupOwned, expectedIdentity, acceptFileIdentity, onTerminal, creatingIdentity, creationClaim) {
	const input = {
		leaseId: randomUUID(),
		agentId,
		databasePath: pathname,
		stateDatabasePath: context.admission.databasePath,
		environment: context.environment,
		...expectedIdentity ? { expectedIdentity } : {},
		...creatingIdentity ? { creatingIdentity } : {},
		...creationClaim ? { creationClaim } : {}
	};
	const lifetime = new AgentDatabaseExecutionLifetime();
	let opening;
	let openedStore;
	let openingFailure;
	let closedOpeningRefusal;
	let openingAdmission;
	let closing;
	let nativeIdentity;
	let nativeStopped;
	let readCloseReceipt;
	let readOpenRefused;
	let lease;
	let preparationPublished = false;
	const pendingPreparations = /* @__PURE__ */ new Set();
	const onNativeLost = (reason) => {
		lifetime.retire();
		if (lease) invalidateOpenClawAgentDatabaseValidation(pathname);
		if (preparationPublished) onTerminal(reason);
	};
	const assertCurrent = () => {
		assertLogicalCurrent();
		if (openedStore && !isSqliteWorkerStoreAvailable(openedStore)) throw new Error("Agent database execution lost its native owner");
		if (!lifetime.open) throw new Error("Agent native generation is retiring");
	};
	const admission = (source, registration, assertCallerCurrent) => (operation) => {
		let receiveValidation = registration ? captureOpenClawAgentDatabaseAdmissionPublication({
			agentId,
			path: pathname
		}) : void 0;
		if (registration) registration.nativeSettlement = operation.settled;
		const assertPreparationJournal = captureAgentDatabasePreparationJournal(agentId, { env: context.environment });
		const nativeLocations = [
			pathname,
			...nativeIdentity ? [nativeIdentity.nativeLocation] : [],
			context.admission.databasePath,
			context.admission.identity.canonicalPath
		];
		const assertSourceCurrent = (identity) => {
			source.assertCurrent();
			assertCurrent();
			assertCallerCurrent?.(identity);
		};
		const cleanup = captureAgentDeletionCleanupAdmission({
			agentId,
			path: pathname,
			env: context.environment
		}, operation, assertSourceCurrent);
		const observeNative = (request) => {
			const facts = request.facts;
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-committed") {
				const received = facts.registration;
				if (!registration || !lease || !isRecord(received)) throw new Error("Agent registration commit differs from its admitted native owner");
				registration.recordCommitted({
					agentId: input.agentId,
					agentPath: pathname,
					stateDatabasePath: lease.sharedStatePath,
					stateDatabaseIdentity: lease.sharedStateIdentity
				});
			}
		};
		const authorizeNative = (request) => {
			const facts = request.facts;
			if (cleanup?.authorize(request)) return;
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-committed") return;
			assertCurrent();
			cleanup?.assertCurrent();
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-startup-fts") {
				assertSourceCurrent();
				if (!assertPreparationJournal || !lease || facts.message !== void 0 && typeof facts.message !== "string") throw new Error("FTS repair requires live Gateway startup admission");
				recordAgentDatabaseStartupFtsRepair([expectedIdentity?.physicalIdentity ?? pathname, expectedIdentity?.birthtime].join(":"), context.admission.databasePath, facts.message);
				return;
			}
			if (!nativeIdentity || creatingIdentity) assertCallerCurrent?.();
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-start") {
				assertSourceCurrent();
				if (!registration || !lease) throw new Error("Agent registration start differs from its admitted native owner");
				registration.begin();
				return;
			}
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "shared-owner") {
				if (!(facts.validationPort instanceof MessagePort)) throw new Error("Agent worker lost its validation handoff port");
				try {
					assertSourceCurrent();
					publishOpenClawStateDatabaseWorkerAdmission(context.admission);
					const received = facts.lease;
					if (!isRecord(received) || received.ownerStartTime !== null && typeof received.ownerStartTime !== "number") throw new Error("Agent worker lease differs from its captured native owner");
					lease = {
						leaseId: input.leaseId,
						agentId: input.agentId,
						path: pathname,
						ownerPid: process.pid,
						ownerStartTime: received.ownerStartTime,
						sharedStatePath: context.admission.databasePath,
						sharedStateIdentity: context.admission.identity.key
					};
					receiveValidation = captureOpenClawAgentDatabaseAdmissionPublication({
						agentId,
						path: pathname
					});
					const preparation = {
						integrityRevoked: hasRevokedOpenClawAgentDatabaseValidation(pathname),
						validation: getOpenClawAgentDatabaseValidationForTransfer({
							agentId,
							path: pathname
						})
					};
					facts.validationPort.postMessage(preparation, []);
					recordWorkerMessage("admission", "to_worker");
				} finally {
					facts.validationPort.close();
				}
				return;
			}
			if (request.stage === "prepare" && isRecord(facts) && (facts.kind === "agent-open-resume" || facts.kind === "agent-validation-start")) {
				assertSourceCurrent();
				if (!lease) throw new Error("Agent open notice differs from its captured native lease");
				if (facts.kind === "agent-validation-start") receiveValidation = captureOpenClawAgentDatabaseAdmissionPublication({
					agentId,
					path: pathname
				});
				return;
			}
			if (request.stage !== "open") {
				const received = isRecord(facts) ? facts.identity : void 0;
				if (!isRecord(received) || received.kind !== "file" || typeof received.physicalIdentity !== "string" || typeof received.birthtime !== "string" || typeof received.incarnation !== "string" || typeof received.nativeLocation !== "string" || nativeIdentity && !isDeepStrictEqual(received, nativeIdentity)) throw new Error("Agent database operation belongs to another native owner");
				const receivedIdentity = nativeIdentity ?? Object.freeze({
					kind: "file",
					physicalIdentity: received.physicalIdentity,
					birthtime: received.birthtime,
					incarnation: received.incarnation,
					nativeLocation: received.nativeLocation
				});
				if (expectedIdentity && (receivedIdentity.physicalIdentity !== expectedIdentity.physicalIdentity || expectedIdentity.birthtime !== void 0 && receivedIdentity.birthtime !== expectedIdentity.birthtime)) throw new Error("Agent database operation differs from its expected physical file");
				if (!nativeIdentity) assertExistingDatabaseIdentity(pathname, `file:${receivedIdentity.physicalIdentity}`, receivedIdentity.birthtime);
				acceptFileIdentity({
					kind: "file",
					physicalIdentity: receivedIdentity.physicalIdentity,
					birthtime: receivedIdentity.birthtime,
					nativeLocation: receivedIdentity.nativeLocation
				});
				assertPreparationJournal?.(isRecord(facts) ? facts.agentDeletionJournalPresent : void 0);
				nativeIdentity ??= receivedIdentity;
				return nativeIdentity;
			}
		};
		const captured = source.createAdmission({
			attachment: {
				kind: "agent-execution",
				startupJournal: assertPreparationJournal !== void 0,
				...cleanup ? { deletion: cleanup.guard } : {}
			},
			nativeLocations,
			assertCurrent,
			authorize(request) {
				const identity = authorizeNative(request);
				if (request.stage === "open" && registration) {
					assertSourceCurrent();
					if (!nativeIdentity && !expectedIdentity && readDatabasePathIdentitySync(pathname).key.startsWith("path:")) {
						if (!lease && getOpenClawAgentDatabaseValidationForTransfer({
							agentId,
							path: pathname
						})) invalidateOpenClawAgentDatabaseValidation(pathname);
						registration.begin();
					}
				}
				if (request.stage === "prepare" && identity && receiveValidation && isRecord(request.facts) && request.facts.validation !== void 0) {
					assertSourceCurrent(identity);
					receiveValidation(identity.physicalIdentity, request.facts.validation);
					receiveValidation = void 0;
				}
				assertSourceCurrent(identity);
			}
		})(operation);
		if (preparationPublished && nativeIdentity && !creatingIdentity && !registration) bindSqliteWorkerExecutionAuthority(captured.admission, {
			logical: logicalLifetime,
			native: lifetime.state,
			physicalIdentity: nativeIdentity.physicalIdentity,
			incarnation: nativeIdentity.incarnation,
			...nativeIdentity.birthtime !== void 0 ? { birthtime: nativeIdentity.birthtime } : {}
		});
		captured.admission.observeRequests(observeNative);
		return captured;
	};
	const open = (source, assertCallerCurrent, createIfMissing = false, signal) => {
		assertCurrent();
		source.assertCurrent();
		assertCallerCurrent?.();
		opening ??= (async () => {
			retireReplacedAgentValidation(agentId, pathname, expectedIdentity);
			const registration = createIfMissing ? captureOpenClawAgentDatabaseRegistration({
				agentId,
				agentPath: pathname,
				admission: context.admission,
				assertPublicationCurrent: context.assertPublicationCurrent,
				onRegistryChange: source.onRegistryChange
			}) : void 0;
			const openStore = async () => {
				const assertOpening = () => {
					assertCurrent();
					source.assertCurrent();
					assertCallerCurrent?.();
					signal?.throwIfAborted();
				};
				openedStore = await openAgentDatabaseSqliteWorkerStore({
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.agentDatabaseExecution),
					databasePath: pathname,
					input,
					existingOnly: !createIfMissing
				}, {
					stateContext: context,
					stateDatabasePath: context.admission.databasePath,
					assertCurrent: assertOpening,
					signal,
					createAdmission: (operation) => {
						const captured = admission(source, registration, assertCallerCurrent)(operation);
						openingAdmission = {
							admission: captured.admission,
							settled: operation.settled
						};
						return captured;
					},
					onNativeStopped: (stopped, readReceipt, readRefused) => {
						nativeStopped = stopped;
						readCloseReceipt = readReceipt;
						readOpenRefused = readRefused;
					},
					onNativeLost
				});
				return openedStore;
			};
			const store = registration ? await settleAgentRegistration(registration, openStore) : await openStore();
			if (!store) return;
			try {
				assertCurrent();
				if (nativeIdentity) preparationPublished = true;
				return store;
			} catch (error) {
				try {
					await store.close();
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Agent open and cleanup failed", { cause: cleanupError });
				}
				if (error instanceof AgentDatabaseExecutionAdmissionClosedError) closedOpeningRefusal = error;
				throw error;
			}
		})().catch(async (error) => {
			openingFailure = closedOpeningRefusal !== void 0 && error === closedOpeningRefusal ? "open-refused" : "native";
			if (openingAdmission) {
				const { admission: captured, settled } = openingAdmission;
				const outcome = await settled;
				if (captured.failure !== void 0 && captured.failureSource !== "protocol" && error === captured.failure && outcome.kind !== "unknown" && !captured.committed && captured.cleanupFailures.length === 0) openingFailure = "open-refused";
			}
			throw error;
		}).finally(() => {
			openingAdmission = void 0;
			closedOpeningRefusal = void 0;
		});
		const attempt = opening;
		return attempt.then((store) => {
			if (!store && opening === attempt) opening = void 0;
			if (!store && createIfMissing) return open(source, assertCallerCurrent, true, signal);
			return store;
		});
	};
	async function run(source, operation, assertCallerCurrent, createIfMissing = false, signal) {
		const assertOperationCurrent = () => {
			assertCurrent();
			source.assertCurrent();
			assertCallerCurrent?.();
			signal?.throwIfAborted();
		};
		const wasPrepared = preparationPublished;
		const preparing = wasPrepared ? void 0 : createDeferredCore();
		if (preparing) pendingPreparations.add(preparing.promise);
		let preparedStore;
		try {
			const store = preparationPublished ? openedStore : await open(source, assertCallerCurrent, createIfMissing, signal);
			assertOperationCurrent();
			if (!store) return;
			const schema = createIfMissing ? getOpenClawAgentDatabaseValidationForTransfer({
				agentId,
				path: pathname
			})?.schema : void 0;
			const admittedSchema = createIfMissing && wasPrepared ? getOrLoadSqliteDatabaseAdmissionForPath(pathname, schemaAdmission, () => void 0) : void 0;
			const requiresReadmission = createIfMissing && wasPrepared && (!schema || Atomics.load(new Int32Array(schema.valid), 0) !== 1 || !admittedSchema || admittedSchema.schemaVersion !== schema.facts.schemaVersion || admittedSchema.userVersion !== schema.facts.userVersion || captureAgentDatabasePreparationJournal(agentId, { env: input.environment }) !== void 0);
			if (!nativeIdentity || requiresReadmission) {
				const registration = captureOpenClawAgentDatabaseRegistration({
					agentId,
					agentPath: pathname,
					admission: context.admission,
					assertPublicationCurrent: context.assertPublicationCurrent,
					onRegistryChange: source.onRegistryChange
				});
				await settleAgentRegistration(registration, async () => {
					await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "database.prepareWrite",
						input: void 0
					}, { signal }), void 0, assertOperationCurrent, admission(source, registration, assertCallerCurrent));
					assertCurrent();
					source.assertCurrent();
				});
				preparationPublished = true;
			}
			preparedStore = store;
		} finally {
			if (preparing) {
				pendingPreparations.delete(preparing.promise);
				preparing.resolve();
			}
		}
		return runSqliteWorkerStoreOperation(preparedStore, operation, void 0, assertOperationCurrent, admission(source, void 0, assertCallerCurrent));
	}
	return {
		failure: () => openingFailure ?? (openedStore && !isSqliteWorkerStoreAvailable(openedStore) ? "native" : void 0),
		isPrepared() {
			assertCurrent();
			return preparationPublished;
		},
		getPendingPreparation() {
			if (pendingPreparations.size === 0) return;
			return (async () => {
				while (pendingPreparations.size > 0) await Promise.all(pendingPreparations);
			})();
		},
		captureClaim() {
			assertCurrent();
			const captured = nativeIdentity;
			if (!captured) throw new Error("Agent database generation has not been admitted");
			return {
				identity: captured.physicalIdentity,
				incarnation: captured.incarnation,
				assertCurrent() {
					assertCurrent();
				}
			};
		},
		run,
		close() {
			lifetime.retire();
			closing ??= (async () => {
				const errors = [];
				let storeClosed = false;
				if (opening) try {
					await opening.then(async (store) => {
						await store?.close();
						storeClosed = store !== void 0;
					}, () => openedStore ? openedStore.close() : closeUnclaimedSharedStateSqliteWorkers(pathname));
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 0 && nativeStopped && lease) try {
					await cleanupRetiredAgentDatabaseLease({
						context,
						stopped: nativeStopped,
						assertOwned: assertCleanupOwned,
						lease,
						readOpenRefused,
						closed: () => storeClosed ? readAgentDatabaseClosedReceipt(readCloseReceipt?.(), nativeIdentity, lease) : void 0
					});
				} catch (error) {
					errors.push(error);
				}
				throwSqliteLifecycleErrors(errors, "Agent native close and lease cleanup failed");
				publishAgentDatabaseCloseCheckpoint(pathname, readAgentDatabaseClosedReceipt(readCloseReceipt?.(), nativeIdentity, lease), assertCleanupOwned);
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-scope.ts
function assertAgentDatabaseExecutionSharedState(options, sharedDatabaseKey) {
	const env = process.platform === "win32" ? cloneEnvWithPlatformSemantics(options.env ?? process.env) : options.env;
	if (sharedDatabaseKey !== captureOpenClawStateReadContext(resolveOpenClawStateSqlitePath(env)).admission.identity.key) throw new Error("Agent database execution belongs to another shared-state database; drain its existing resources before changing the state directory.");
}
function supportsAgentDatabaseExecutionScope(options) {
	const cleanup = getAgentDeletionDatabaseCleanup(options);
	return (isOpenClawDatabaseMaintenanceWorkerAccess() || getOpenClawDatabaseMaintenanceScope()?.ownsSchemaMaintenance !== true && !hasAgentDatabaseMaintenanceAuthority()) && (!cleanup || cleanup.worker !== void 0);
}
/** Memory sessions have no database; maintenance scopes retain their local durable owner. */
function supportsOpenClawAgentDatabaseExecution(options) {
	return !isIncognitoOpenClawAgentSqlitePath(resolveOpenClawAgentSqlitePath(options), options) && supportsAgentDatabaseExecutionScope(options);
}
/** Bind native handoff to the admitted connection and recheck it after cleanup waits. */
function captureNativeAgentDatabaseExecutionIdentity(database, agentId, canonicalPath, assertBorrowed) {
	assertBorrowed();
	const native = readOpenClawAgentDatabaseIdentity(database);
	const assertCurrent = () => {
		assertBorrowed();
		if (database.agentId !== agentId || cache.databases.get(database.path) !== database || readOpenClawAgentDatabaseIdentity(database) !== native || native.canonicalPath !== canonicalPath || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Agent execution cannot adopt a different native database owner");
	};
	assertCurrent();
	return {
		fileIdentity: {
			kind: "file",
			physicalIdentity: native.identity,
			birthtime: native.birthtime,
			nativeLocation: native.canonicalPath
		},
		assertCurrent
	};
}
function assertAgentDatabaseExecutionCreationIdentity(pathname, expected, observed, expectedFile) {
	const capturesAbsence = expected.key.startsWith("path:");
	if (expectedFile || capturesAbsence && (cache.databases.has(pathname) || cache.pending.has(pathname)) || !capturesAbsence && (!expected.key.startsWith("file:") || typeof expected.birthtime !== "string") || observed?.key !== expected.key || observed.canonicalPath !== expected.canonicalPath || observed.birthtime !== expected.birthtime) throw new Error("Agent creation no longer owns its originally observed target");
}
/** Keep the borrower's captured file constraints bound to its native owner. */
function assertBorrowedAgentDatabaseFileIdentity({ borrowedPath, identity, creatingTarget, fileIdentity, expectedIdentity, nativeIdentity }) {
	if (!fileIdentity) {
		const current = readDatabasePathIdentitySync(borrowedPath);
		if (current.canonicalPath !== identity.canonicalPath || creatingTarget?.key.startsWith("file:") && (current.key !== creatingTarget.key || current.birthtime !== creatingTarget.birthtime)) throw new Error("Agent database borrower changed its originally observed target");
	}
	if (fileIdentity && expectedIdentity && (fileIdentity.physicalIdentity !== expectedIdentity.physicalIdentity || fileIdentity.birthtime !== void 0 && expectedIdentity.birthtime !== void 0 && fileIdentity.birthtime !== expectedIdentity.birthtime)) throw new Error("Agent database borrower belongs to another physical file");
	const file = fileIdentity ?? expectedIdentity;
	const birthtime = fileIdentity?.birthtime ?? expectedIdentity?.birthtime;
	if (file) {
		if (nativeIdentity && (nativeIdentity.physicalIdentity !== file.physicalIdentity || birthtime !== void 0 && nativeIdentity.birthtime !== birthtime)) throw new Error("Agent database borrower belongs to another physical file");
	}
}
/** Bind a native claim to the same borrower and logical generation that captured it. */
function captureBorrowedAgentDatabaseGenerationClaim(assertBorrowed, readGeneration) {
	assertBorrowed();
	const captured = readGeneration();
	if (!captured) throw new Error("Agent database execution has no admitted generation");
	const claim = captured.captureClaim();
	return {
		identity: claim.identity,
		incarnation: claim.incarnation,
		assertCurrent() {
			assertBorrowed();
			if (readGeneration() !== captured) throw new Error("Agent database execution generation was replaced");
			claim.assertCurrent();
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-work.ts
/** The executor keeps accepted work until its borrower or resource close joins settlement. */
function createAgentDatabaseAcceptedWork() {
	const pending = /* @__PURE__ */ new Map();
	return {
		pending,
		settleBorrower: (borrower) => Promise.allSettled([...pending].flatMap(([work, owner]) => owner.borrower === borrower ? [work] : [])),
		cancelReadAdmissions: (borrower) => {
			for (const work of pending.values()) if (borrower === void 0 || work.borrower === borrower) work.queuedReadAbort?.abort(new AgentDatabaseExecutionAdmissionClosedError("Agent database read admission is closed"));
		},
		closeAccepted: async (close) => {
			const reads = [...pending].flatMap(([work, owner]) => owner.queuedReadAbort ? [work] : []);
			const nativeClose = close();
			await Promise.allSettled([nativeClose, ...reads]);
			await nativeClose;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-owner.ts
const log = createSubsystemLogger("state/agent-db");
const MAX_IDLE_EXECUTORS = 4;
const runInExecutionOwnerContext = AsyncLocalStorage.snapshot();
function createAgentDatabaseExecution(options, prepared, executionState) {
	const executions = executionState.owners;
	const { agentId, pathname, identity, initialIdentity, expectedCreationIdentity } = prepared;
	const context = captureOpenClawStateWorkerContext({ env: options.env });
	const executionOptions = {
		agentId,
		path: pathname,
		env: context.environment
	};
	const deletionCleanup = getAgentDeletionDatabaseCleanup(executionOptions);
	const cleanupOwner = deletionCleanup?.ownsDatabase ? deletionCleanup : void 0;
	const creationClaim = captureAgentCreationClaim(options);
	const aliases = /* @__PURE__ */ new Map();
	const assertAgentAdmitted = captureAgentDatabaseAdmission(agentId, { env: context.environment });
	const lifetime = new AgentDatabaseExecutionLifetime();
	let borrowers = 0;
	const acceptedWork = createAgentDatabaseAcceptedWork();
	const terminalListeners = /* @__PURE__ */ new Set();
	let creationIdentity = expectedCreationIdentity;
	let creationBorrowers = 0;
	let generation;
	let fileIdentity;
	let nativeClosing;
	let cleanupFailure;
	let closing;
	let unregisterShared;
	let idleTimer;
	let idleDrainListener;
	const acceptFileIdentity = (received) => {
		if (fileIdentity && (fileIdentity.physicalIdentity !== received.physicalIdentity || fileIdentity.birthtime !== received.birthtime)) throw new Error("Agent database execution belongs to another physical file");
		fileIdentity ??= Object.freeze({ ...received });
	};
	const clearIdleTimer = () => {
		idleDrainListener?.[Symbol.dispose]();
		idleDrainListener = void 0;
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const reportCleanupFailure = (error) => {
		try {
			log.warn(`Agent database idle cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	};
	const reportTerminal = (error) => {
		if (terminalListeners.size === 0) return;
		const reason = error instanceof Error ? error : new Error(formatErrorMessage(error));
		const listeners = [...terminalListeners];
		terminalListeners.clear();
		Promise.resolve().then(async () => {
			await Promise.allSettled(acceptedWork.pending.keys());
			notifyListeners(listeners, reason);
		});
	};
	const finishRetirement = () => {
		lifetime.retire();
		if (executions.get(pathname) !== owner) return;
		unregisterAgent();
		unregisterShared?.();
	};
	const assertCurrent = () => {
		if (!lifetime.open || executions.get(pathname) !== owner || !supportsAgentDatabaseExecutionScope(executionOptions)) throw new AgentDatabaseExecutionAdmissionClosedError("Agent database execution admission is closed");
		assertAgentDeletionExecutionCleanupAccess(owner, executionOptions);
		context.admission.assertCurrent();
		assertAgentAdmitted();
		creationClaim?.assertCurrent();
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
				executionState.idle.delete(owner);
			}
		}, (error) => {
			cleanupFailure = { error };
			throw error;
		}).finally(() => {
			if (nativeClosing === result) nativeClosing = void 0;
		});
		nativeClosing = result;
		return result;
	};
	async function run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure = false, createIfMissing = false, creatingTarget, signal, contentionDeadline, schemaReadmitted = false) {
		const pending = cache.pending.get(pathname);
		if (pending) {
			if (creatingTarget && !fileIdentity) throw new Error("Agent creation cannot adopt another pending opener");
			if (pending.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${pending.agentId}`);
			await pending.promise;
			pending.controller.signal.throwIfAborted();
			assertCallerCurrent();
		}
		if (nativeClosing) {
			await nativeClosing;
			assertCallerCurrent();
		}
		if (cleanupFailure || generation?.failure()) {
			await closeNative();
			assertCurrent();
			source.assertCurrent();
			assertCallerCurrent();
			signal?.throwIfAborted();
		}
		if (!generation) {
			const created = createAgentDatabaseNativeGeneration(agentId, identity.canonicalPath, context, lifetime.state, assertCurrent, () => {
				if (executions.get(pathname) !== owner || generation !== created || !nativeClosing) throw new Error("Agent cleanup no longer owns its original execution reference");
			}, expectedIdentity ?? fileIdentity, acceptFileIdentity, reportTerminal, fileIdentity ? void 0 : creationIdentity ?? creatingTarget, creationClaim?.witness);
			generation = created;
		}
		const current = generation;
		let entered = false;
		try {
			const result = await current.run(source, (scope) => {
				entered = true;
				return operation(scope);
			}, assertCallerCurrent, createIfMissing, signal);
			if (generation === current && !nativeClosing && current.failure()) await owner.close().catch(reportCleanupFailure);
			return result;
		} catch (error) {
			const nativeFailure = current.failure();
			const contended = !entered && isSqliteLockError(error);
			const schemaChanged = !entered && !schemaReadmitted && nativeFailure !== "native" && error instanceof AgentDatabaseSchemaAdmissionChangedError;
			if (generation === current && (nativeFailure || retireNativeOnFailure || schemaChanged)) try {
				if (nativeFailure === "native" && !contended && !nativeClosing) {
					reportTerminal(error);
					await owner.close();
				} else await closeNative(current);
			} catch (cleanupError) {
				throw retainSqliteWorkerErrorCode(new AggregateError([error, cleanupError], "Agent operation and cleanup failed", { cause: error }), error);
			}
			if (schemaChanged) {
				assertCurrent();
				source.assertCurrent();
				assertCallerCurrent();
				signal?.throwIfAborted();
				return run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure, createIfMissing, creatingTarget, signal, contentionDeadline, true);
			}
			if (contended) {
				const deadline = contentionDeadline ?? performance.now() + 2e3;
				if (contentionDeadline === void 0) log.warn("Agent database execution admission delayed by SQLite lock contention; retrying before execution.");
				const remaining = deadline - performance.now();
				if (remaining > 0) {
					await sleepWithAbort(Math.min(25, remaining), signal);
					assertCurrent();
					source.assertCurrent();
					assertCallerCurrent();
					if (performance.now() >= deadline) throw error;
					return run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure, createIfMissing, creatingTarget, signal, deadline, schemaReadmitted);
				}
			}
			throw error;
		}
	}
	const owner = {
		kind: "file",
		agentId,
		get sharedDatabaseKey() {
			return context.admission.identity.key;
		},
		get creationIdentity() {
			return creationIdentity;
		},
		getPendingPreparation() {
			return generation?.getPendingPreparation();
		},
		borrow(borrowedPath, expected, creating, requestedPath) {
			const cleanup = getAgentDeletionDatabaseCleanup({
				...executionOptions,
				path: borrowedPath
			});
			const expectedIdentity = expected ? Object.freeze({ ...expected }) : void 0;
			const creatingTarget = creating ? Object.freeze({ ...creating }) : void 0;
			if (fileIdentity) assertExistingDatabaseIdentity(borrowedPath, `file:${fileIdentity.physicalIdentity}`, fileIdentity.birthtime);
			const assertReferenceCurrent = (nativeIdentity) => {
				assertCurrent();
				assertBorrowedAgentDatabaseFileIdentity({
					borrowedPath,
					identity,
					creatingTarget,
					fileIdentity,
					expectedIdentity,
					nativeIdentity
				});
			};
			assertReferenceCurrent();
			if (creatingTarget && !creationIdentity && !fileIdentity && generation) throw new Error("Agent creation cannot capture another pending native opener");
			retainAlias(borrowedPath);
			if (requestedPath !== void 0) retainAlias(path.resolve(requestedPath));
			observeOpenClawDatabaseMaintenanceResource(aliases.get(pathname));
			borrowers += 1;
			clearIdleTimer();
			if (!nativeClosing && !cleanupFailure) executionState.idle.delete(owner);
			if (creatingTarget) {
				creationIdentity ??= creatingTarget;
				creationBorrowers += 1;
			}
			const assertCreationReference = (create) => {
				if (creatingTarget && !fileIdentity && !create) throw new Error("Originally observed agent target requires creating admission first");
				if (creationBorrowers && !fileIdentity && (!create || !creatingTarget)) throw new Error("Originally observed agent target requires its captured creating reference");
			};
			const borrowerLifetime = new AgentDatabaseExecutionLifetime();
			let release;
			const borrower = Symbol("agent database borrower");
			const assertBorrowed = () => {
				if (!borrowerLifetime.open) throw new Error("Agent database execution reference is released");
				cleanup?.assertCurrentHost();
				assertReferenceCurrent();
			};
			const captureGenerationClaim = () => captureBorrowedAgentDatabaseGenerationClaim(assertBorrowed, () => generation);
			const borrowed = {
				agentId,
				path: borrowedPath,
				onTerminal(listener) {
					terminalListeners.add(listener);
					return () => terminalListeners.delete(listener);
				},
				get fileIdentity() {
					assertBorrowed();
					return fileIdentity;
				},
				async adoptNativeDatabase(database) {
					const adoption = (async () => {
						const native = captureNativeAgentDatabaseExecutionIdentity(database, agentId, identity.canonicalPath, assertBorrowed);
						if (generation && !fileIdentity) {
							await closeNative(generation);
							native.assertCurrent();
						}
						assertReferenceCurrent(native.fileIdentity);
						acceptFileIdentity(native.fileIdentity);
					})();
					acceptedWork.pending.set(adoption, { borrower });
					try {
						await adoption;
					} finally {
						acceptedWork.pending.delete(adoption);
					}
				},
				assertCurrent: assertBorrowed,
				captureGenerationClaim,
				capturePreparedGenerationClaim() {
					if (cache.pending.has(pathname) || nativeClosing || cleanupFailure || generation?.failure() || !generation?.isPrepared()) {
						assertBorrowed();
						return;
					}
					return captureGenerationClaim();
				},
				async prepare(source, signal) {
					assertBorrowed();
					assertCreationReference(true);
					const result = run(source, async () => void 0, (nativeIdentity) => {
						assertReferenceCurrent(nativeIdentity);
						assertCreationReference(true);
					}, expectedIdentity, false, true, creatingTarget, signal);
					acceptedWork.pending.set(result, { borrower });
					result.finally(() => acceptedWork.pending.delete(result)).catch(() => void 0);
					await result;
				},
				async runExisting(source, operation, runOptions) {
					const capturedGeneration = borrowerLifetime.open ? generation : void 0;
					const completion = createDeferredCore();
					acceptedWork.pending.set(completion.promise, { borrower });
					try {
						assertBorrowed();
						assertCreationReference(false);
						const execute = () => run(source, operation, (nativeIdentity) => {
							assertReferenceCurrent(nativeIdentity);
							assertCreationReference(false);
						}, expectedIdentity, runOptions?.retireNativeOnFailure);
						if (runOptions?.withAdmission) {
							const queuedReadAbort = new AbortController();
							acceptedWork.pending.set(completion.promise, {
								borrower,
								queuedReadAbort
							});
							return await runOptions.withAdmission(execute, queuedReadAbort.signal);
						}
						return await execute();
					} catch (error) {
						let retireNative = runOptions?.retireNativeOnFailure === true;
						if (capturedGeneration && generation === capturedGeneration && fileIdentity) try {
							assertExistingDatabaseIdentity(fileIdentity.nativeLocation, `file:${fileIdentity.physicalIdentity}`, fileIdentity.birthtime);
						} catch {
							retireNative = true;
						}
						if (retireNative && capturedGeneration) try {
							await closeNative(capturedGeneration);
						} catch (cleanupError) {
							throw retainSqliteWorkerErrorCode(new AggregateError([error, cleanupError], "Agent execution refusal and native cleanup failed", { cause: error }), error);
						}
						throw error;
					} finally {
						acceptedWork.pending.delete(completion.promise);
						completion.resolve();
					}
				},
				release() {
					borrowerLifetime.retire();
					acceptedWork.cancelReadAdmissions(borrower);
					return release ??= (async () => {
						await acceptedWork.settleBorrower(borrower);
						if (creatingTarget && --creationBorrowers === 0 && !fileIdentity && !nativeClosing && !cleanupFailure) {
							if (generation) await closeNative(generation).catch(reportCleanupFailure);
							if (!creationBorrowers && !generation && !nativeClosing && !cleanupFailure) creationIdentity = void 0;
						}
						borrowers -= 1;
						if (borrowers !== 0 || !lifetime.open || cleanupFailure || cleanupOwner) return;
						const drainSignal = getGatewayRestartDrainSignal();
						const canRetain = () => generation && !nativeClosing && !drainSignal.aborted;
						try {
							for (const idle of executionState.idle) {
								if (!canRetain() || executionState.idle.size < MAX_IDLE_EXECUTORS) break;
								if (borrowers !== 0 || !lifetime.open || executionState.idle.has(owner)) return;
								await idle.closeIdle();
							}
						} catch (error) {
							reportCleanupFailure(error);
						}
						if (borrowers !== 0 || !lifetime.open || executionState.idle.has(owner)) return;
						if (canRetain() && executionState.idle.size < MAX_IDLE_EXECUTORS) {
							executionState.idle.add(owner);
							const timer = runInExecutionOwnerContext(() => setTimeout(() => {
								if (idleTimer !== timer || !executionState.idle.has(owner)) return;
								owner.closeIdle().catch(reportCleanupFailure);
							}, SQLITE_IDLE_HANDLE_TTL_MS));
							idleTimer = timer;
							timer.unref();
							idleDrainListener = addAbortListener(drainSignal, () => {
								runInExecutionOwnerContext(() => {
									owner.closeIdle().catch(reportCleanupFailure);
								});
							});
							return;
						}
						await owner.closeIdle().catch(reportCleanupFailure);
					})();
				}
			};
			cleanup?.registerClose(() => borrowed.release());
			return borrowed;
		},
		async closeIdle() {
			await closeNative();
			if (borrowers === 0 && !generation) finishRetirement();
		},
		async retireForCleanup() {
			if (!cleanupOwner) {
				while (acceptedWork.pending.size > 0) await Promise.allSettled(acceptedWork.pending.keys());
				await owner.close();
			}
		},
		close() {
			lifetime.close();
			acceptedWork.cancelReadAdmissions();
			closing ??= (async () => {
				await closeNative();
				finishRetirement();
			})().catch((error) => {
				closing = void 0;
				lifetime.reopen();
				throw error;
			});
			return closing;
		}
	};
	const revoke = () => {
		lifetime.revoke();
		acceptedWork.cancelReadAdmissions();
		clearIdleTimer();
		reportTerminal(new AgentDatabaseExecutionAdmissionClosedError("Agent database execution admission revoked"));
	};
	const unregisterAgent = () => {
		for (const [alias, unregister] of aliases) {
			if (executions.get(alias) === owner) executions.delete(alias);
			unregister();
		}
		aliases.clear();
	};
	const retainAlias = (alias) => {
		if (aliases.has(alias)) return;
		const register = () => registerOpenClawAgentDatabaseAsyncResource({
			agentId,
			path: alias,
			revoke,
			close: () => acceptedWork.closeAccepted(() => owner.close()),
			retireAfterResources: true
		}, options);
		const unregister = aliases.size === 0 ? register() : runOutsideOpenClawDatabaseMaintenanceScope(register);
		aliases.set(alias, unregister);
		executions.set(alias, owner);
	};
	try {
		retainAlias(pathname);
		retainAlias(identity.canonicalPath);
		registerAgentDeletionExecutionCleanup(owner, executionOptions, () => drainAgentDatabaseResources({
			path: pathname,
			agentId
		}, async () => {}, cleanupOwner));
		unregisterShared = registerOpenClawStateDatabaseAsyncResource({ close: async (sharedIdentity) => {
			if (!sharedIdentity || sharedIdentity.key === context.admission.identity.key) {
				reportTerminal(new AgentDatabaseExecutionAdmissionClosedError("Agent database state admission closed"));
				await acceptedWork.closeAccepted(() => owner.close());
			}
		} });
		return owner.borrow(pathname, initialIdentity, expectedCreationIdentity, prepared.requestedPath);
	} catch (error) {
		lifetime.retire();
		unregisterAgent();
		unregisterShared?.();
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-agent-execution.ts
const executionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionOwners"), () => ({
	owners: /* @__PURE__ */ new Map(),
	idle: /* @__PURE__ */ new Set()
}));
const executions = executionState.owners;
/** Borrow before callers yield; native opening stays lazy and release joins owned work. */
function captureOpenClawAgentDatabaseExecution(options, constraints = {}, inheritCreationIdentity = false) {
	assertAgentSessionWriteAdmission(options);
	assertAgentDeletionCleanupAliases(options, isSameOpenClawAgentDatabasePath);
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	assertAgentCreationClaimAliases(options);
	if (!supportsOpenClawAgentDatabaseExecution(options)) throw new Error("This agent database scope still requires its existing native owner");
	let existing = executions.get(pathname);
	const expectedCreationIdentity = constraints.expectedCreationIdentity ? Object.freeze({ ...constraints.expectedCreationIdentity }) : void 0;
	if (!existing || expectedCreationIdentity) {
		const identity = readDatabasePathIdentitySync(pathname);
		existing ??= executions.get(identity.canonicalPath);
		if (expectedCreationIdentity) assertAgentDatabaseExecutionCreationIdentity(pathname, expectedCreationIdentity, expectedCreationIdentity.key.startsWith("path:") && existing ? existing.creationIdentity ?? identity : identity, constraints.expectedIdentity);
		if (!existing) return createAgentDatabaseExecution(options, {
			agentId,
			pathname,
			identity,
			initialIdentity: constraints.expectedIdentity,
			expectedCreationIdentity: expectedCreationIdentity ?? (inheritCreationIdentity && identity.key.startsWith("path:") ? identity : void 0),
			requestedPath: constraints.requestedPath
		}, executionState);
	}
	if (existing.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${existing.agentId}; requested agent ${agentId}.`);
	assertAgentDatabaseExecutionSharedState(options, existing.sharedDatabaseKey);
	assertAgentDeletionExecutionCleanupAccess(existing, options);
	return existing.borrow(pathname, constraints.expectedIdentity, expectedCreationIdentity ?? (inheritCreationIdentity ? existing.creationIdentity : void 0), constraints.requestedPath);
}
//#endregion
export { captureOpenClawAgentDatabaseExecution, supportsOpenClawAgentDatabaseExecution };
