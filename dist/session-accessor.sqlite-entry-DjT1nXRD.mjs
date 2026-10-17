import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as readSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { i as runSqliteImmediateTransaction } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, s as captureOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { h as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { b as getAgentDeletionDatabaseCleanup, v as assertAgentDeletionDatabaseCleanupAccess } from "./agent-deletion-journal-CDljXcnp.mjs";
import { i as captureAgentDatabaseAdmission } from "./agent-database-admission-dWNS6Rcs.mjs";
import { o as ensureOpenClawAgentDatabasePermissions } from "./openclaw-agent-db-schema-kFBuwbLx.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead, t as AgentDatabaseRegistryChangedError } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { m as listOpenIncognitoAgentDatabases, t as cache, y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync, s as openOpenClawAgentDatabase, t as borrowOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as OpenClawAgentDatabaseReadOnlyScope } from "./openclaw-agent-db-readonly-scope-CLlkTUQB.mjs";
import { n as sessionEntrySnapshotColumns } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { l as isGatewayRestartDrainError, s as getGatewayRestartDrainSignal, t as GatewayDrainingError } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { l as resolveSqliteTranscriptArchiveDirectory, p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as resolveSessionStorePathForScope, d as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { a as selectSessionEntryRows } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { O as observeSessionEntryMaintenanceAgeChanges, S as SESSION_ENTRY_MAINTENANCE_INTERVAL_MS } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { d as readWithCanonicalSessionReaderContinuation, n as assertCanonicalSessionKeyWrite, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { l as readSessionEntryRow, n as parseReadableSqliteSessionEntryRows, o as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import { t as assertCapturedSessionEntryReadSource, u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { n as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-BUiNIWiw.mjs";
import { B as deriveLastRoutePatch, V as deriveSessionMetaPatch, a as readLifecycleTargetSnapshot, m as createFallbackSessionEntry, o as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { n as replaceSessionEntryInDatabase, t as applySessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-CUpzFtYy.mjs";
import { n as createSessionStoreRegistryMutationFilter, t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { r as listTranscriptInstancesFromDatabase } from "./session-accessor.sqlite-history-De4L8VNW.mjs";
import { r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { d as runSqliteSessionReclamation, i as kickSessionHistoryDiskBudgetMaintenance, o as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort } from "./session-history-eviction-D6jaTF6N.mjs";
import { o as createSessionMaintenancePlanningOperation } from "./session-accessor.sqlite-reclamation-CiWnC9OH.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-hJYsjFvr.mjs";
import { n as resolveMaintenanceConfig, r as captureSessionMaintenancePreservation } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { i as preserveSqliteSameKeySessionRolloverLineage } from "./session-entry-lineage-Dms9xZt1.mjs";
import { t as sessionEntryPatchPredicateMatches } from "./session-entry-patch-guard-CzuoMBAF.mjs";
import { t as patchSessionEntryInWorker } from "./session-entry-patch-geetJjjX.mjs";
import { i as mergeSessionEntryPreserveActivity, r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import "./session-accessor.sqlite-initial-entry--t0jv1JX.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { isMainThread } from "node:worker_threads";
//#region src/state/openclaw-agent-db-transaction.ts
/** Yield only for BEGIN admission; admitted writes and publications are never replayed. */
async function runOpenClawAgentWriteWithYieldingAdmission(operation, options, transactionOptions = {}) {
	const captured = {
		...options,
		env: cloneEnvWithPlatformSemantics(options.env ?? process.env)
	};
	const database = openOpenClawAgentDatabase(captured);
	captured.path = database.path;
	const release = retainAgentDatabase(database.db);
	try {
		return await runSqliteImmediateTransaction(database.db, async () => () => {
			assertAgentDeletionDatabaseCleanupAccess(database, captured);
			const result = operation(database);
			if (!cache.incognito.has(database)) ensureOpenClawAgentDatabasePermissions(database.path, captured);
			return result;
		}, {
			...transactionOptions,
			busyTimeoutMs: readSqliteBusyTimeout(database.db),
			databaseLabel: database.path,
			operationLabel: transactionOptions.operationLabel ?? "agent.write",
			withCommit: getAgentDeletionDatabaseCleanup(captured)?.withCommit
		}, (write) => {
			if (getOpenClawAgentDatabaseIfOpen(captured) !== database) throw new Error(`Agent database closed or replaced before write: ${database.path}`);
			return withSqlitePostCommitPublications(database.db, write);
		});
	} finally {
		release();
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-kick.ts
const maintenanceByStore = /* @__PURE__ */ new Map();
const MAINTENANCE_WRITE_QUIET_MS = 1e3;
const MAX_MAINTENANCE_REJECTIONS = 3;
/** Coalesce automatic logical maintenance outside ordinary entry-write latency. */
function kickSessionEntryMaintenanceAfterWrite(params) {
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(params.scope));
	const owner = maintenanceByStore.get(databasePath);
	if (getGatewayRestartDrainSignal().aborted) {
		if (owner) retireMaintenanceOwner(databasePath, owner);
		return;
	}
	if (params.skipMaintenance) return;
	if (owner && isMaintenanceOwnerCurrent(databasePath, owner)) {
		owner.activeSessionKeys.add(params.activeSessionKey);
		Object.assign(owner, params, {
			scope: owner.scope,
			generation: owner.generation + 1
		});
		if (!owner.running) {
			if (owner.retryDelayMs !== void 0) {
				if (owner.rejections >= MAX_MAINTENANCE_REJECTIONS) owner.rejections = 0;
				scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			} else scheduleImmediateMaintenance(databasePath, owner);
		}
		return;
	}
	if (owner) retireMaintenanceOwner(databasePath, owner);
	const env = cloneEnvWithPlatformSemantics(params.scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...params.scope,
		env,
		path: databasePath
	};
	const options = toDatabaseOptions(scope);
	const assertAdmitted = captureAgentDatabaseAdmission(options.agentId, { env });
	const identity = isIncognitoOpenClawAgentSqlitePath(databasePath, options) ? void 0 : readDatabasePathIdentitySync(databasePath);
	if (identity && !identity.key.startsWith("file:")) return;
	const captureExecution = () => supportsOpenClawAgentDatabaseExecution(options) && identity ? captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		birthtime: identity.birthtime,
		nativeLocation: identity.canonicalPath
	} }) : void 0;
	const created = {
		...params,
		scope,
		activeSessionKeys: /* @__PURE__ */ new Set([params.activeSessionKey]),
		ageOwner: randomUUID(),
		ageChanges: /* @__PURE__ */ new Map(),
		captureExecution,
		execution: captureExecution(),
		assertCurrent: () => {
			assertAdmitted();
			created.execution?.assertCurrent();
			if (identity) assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
		},
		generation: 1,
		running: false,
		rejections: 0
	};
	maintenanceByStore.set(databasePath, created);
	const maintenanceScope = getOpenClawDatabaseMaintenanceScope();
	const unregister = [];
	created.unregisterClose = () => unregister.forEach((release) => release());
	try {
		if (identity) unregister.push(observeSessionEntryMaintenanceAgeChanges(identity.key.slice(5), (change) => {
			const previous = created.ageChanges.get(change.sessionKey);
			created.ageChanges.set(change.sessionKey, {
				...change,
				previousEntry: previous ? previous.previousEntry : change.previousEntry
			});
		}));
		for (const resourcePath of /* @__PURE__ */ new Set([databasePath, identity?.canonicalPath ?? databasePath])) {
			const unregisterResource = registerOpenClawAgentDatabaseAsyncResource({
				agentId: options.agentId,
				path: resourcePath,
				revoke: () => retireMaintenanceOwner(databasePath, created),
				close: async () => {
					retireMaintenanceOwner(databasePath, created);
					await created.retirement;
				}
			});
			unregister.push(unregisterResource);
			if (maintenanceScope) created.maintenanceResource ??= captureOpenClawDatabaseMaintenanceResource(unregisterResource, maintenanceScope);
		}
	} catch (error) {
		retireMaintenanceOwner(databasePath, created);
		throw error;
	}
	scheduleImmediateMaintenance(databasePath, created);
}
function isMaintenanceOwnerCurrent(databasePath, owner) {
	if (getGatewayRestartDrainSignal().aborted || maintenanceByStore.get(databasePath) !== owner) return false;
	try {
		owner.maintenanceResource?.assertCurrent();
		owner.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
function retireMaintenanceOwner(databasePath, owner) {
	if (owner.retirement) return;
	clearImmediate(owner.immediate);
	clearTimeout(owner.timer);
	if (maintenanceByStore.get(databasePath) === owner) maintenanceByStore.delete(databasePath);
	releaseMaintenanceExecution(databasePath, owner);
	owner.retirement = (async () => {
		await owner.active;
		await owner.release;
		owner.unregisterClose?.();
	})();
	owner.retirement.catch((error) => getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic maintenance could not retire", {
		error,
		path: databasePath
	}));
}
function releaseMaintenanceExecution(databasePath, owner) {
	if (!owner.execution) return;
	const released = owner.execution.release();
	owner.release = owner.release ? Promise.all([owner.release, released]).then(() => void 0) : released;
	owner.execution = void 0;
	owner.release.catch((error) => getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic maintenance could not release its executor", {
		error,
		path: databasePath
	}));
}
function capturePendingAgeChanges(owner) {
	const changes = [...owner.ageChanges.values()];
	return {
		changes,
		acknowledge() {
			for (const change of changes) if (owner.ageChanges.get(change.sessionKey) === change) owner.ageChanges.delete(change.sessionKey);
		}
	};
}
function scheduleImmediateMaintenance(databasePath, owner) {
	clearTimeout(owner.timer);
	owner.timer = void 0;
	owner.running = true;
	owner.immediate = runInDetachedAsyncContext(() => setImmediate(() => {
		owner.immediate = void 0;
		startPendingMaintenance(databasePath, owner);
	}));
}
function scheduleMaintenanceAfterWriteQuiet(databasePath, owner) {
	owner.running = false;
	owner.retryDelayMs = MAINTENANCE_WRITE_QUIET_MS * 2 ** Math.max(0, owner.rejections - 1);
	if (owner.timer) {
		owner.timer.refresh();
		return;
	}
	owner.timer = runInDetachedAsyncContext(() => setTimeout(() => {
		owner.timer = void 0;
		owner.retryDelayMs = void 0;
		owner.running = true;
		startPendingMaintenance(databasePath, owner);
	}, owner.retryDelayMs));
	owner.timer.unref();
}
function startPendingMaintenance(databasePath, owner) {
	owner.active = Promise.resolve().then(async () => {
		if (!isMaintenanceOwnerCurrent(databasePath, owner)) {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		const run = () => runPendingMaintenance(databasePath, owner);
		await (owner.maintenanceResource ? owner.maintenanceResource.run(run) : run());
	});
}
async function runPendingMaintenance(databasePath, owner) {
	const isCurrent = () => isMaintenanceOwnerCurrent(databasePath, owner);
	if (!isCurrent()) {
		retireMaintenanceOwner(databasePath, owner);
		return;
	}
	const generation = owner.generation;
	let activeSessionKeys = [...owner.activeSessionKeys];
	owner.activeSessionKeys.clear();
	let nextMaintenanceAt = Infinity;
	let planningChanged = false;
	let finalized = false;
	try {
		owner.execution ??= owner.captureExecution();
		const prepared = await runExclusiveSqliteSessionWrite(owner.scope, async () => {
			if (!isCurrent()) return;
			const maintenance = owner.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(owner.maintenanceConfig) : resolveMaintenanceConfig();
			return {
				maintenance,
				operation: maintenance.mode === "warn" ? null : createSessionMaintenancePlanningOperation({
					databaseOptions: toDatabaseOptions(owner.scope),
					ageOwner: owner.ageOwner,
					input: {
						activeSessionKeys,
						archiveDirectory: owner.archiveDirectory,
						maintenance,
						preservation: null,
						storePath: owner.storePath
					}
				})
			};
		}, "session.maintenance.plan");
		if (!prepared) {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		const { maintenance, operation } = prepared;
		if (operation === null) {
			if (isCurrent() && owner.generation !== generation) scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			else retireMaintenanceOwner(databasePath, owner);
			return;
		}
		let admitted = false;
		const assertInputsCurrent = () => {
			if (!isCurrent()) {
				if (getGatewayRestartDrainSignal().aborted) throw new GatewayDrainingError();
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance owner retired");
			}
			if (admitted && [...owner.activeSessionKeys].some((key) => !activeSessionKeys.includes(key)) || !isDeepStrictEqual(maintenance, owner.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(owner.maintenanceConfig) : resolveMaintenanceConfig()) || admitted && operation.input.preservation !== null && !isDeepStrictEqual(operation.input.preservation, captureSessionMaintenancePreservation(operation.input.storePath))) {
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance inputs changed before commit");
			}
		};
		const runPlanning = async () => {
			const pending = capturePendingAgeChanges(owner);
			operation.ageChanges = pending.changes;
			const result = await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-plan" },
				assertCommitAllowed: assertInputsCurrent,
				refreshMaintenanceProtection: () => {
					admitted = false;
					assertInputsCurrent();
					activeSessionKeys = [.../* @__PURE__ */ new Set([...activeSessionKeys, ...owner.activeSessionKeys])];
					operation.input.activeSessionKeys = activeSessionKeys;
					if (operation.input.preservation !== null) operation.input.preservation = captureSessionMaintenancePreservation(operation.input.storePath);
					admitted = true;
					return {
						activeSessionKeys,
						preservation: operation.input.preservation
					};
				},
				forceInProcess: false,
				plan: operation
			});
			if (result.kind === "maintenance-plan") pending.acknowledge();
			return result;
		};
		let result = await runPlanning();
		if (result.kind === "maintenance-preservation-required") {
			await runExclusiveSqliteSessionWrite(owner.scope, async () => {
				assertInputsCurrent();
				operation.input.preservation = captureSessionMaintenancePreservation(operation.input.storePath);
			}, "session.maintenance.plan");
			result = await runPlanning();
		}
		if (result.kind === "maintenance-plan-stale") {
			planningChanged = true;
			throw new SqliteReclamationInputsChangedError("SQLite maintenance snapshot changed before commit");
		}
		if (result.kind !== "maintenance-plan") throw new Error("SQLite automatic maintenance returned another operation's result");
		const plan = result.value;
		const readAge = async (verify) => {
			assertInputsCurrent();
			const pending = capturePendingAgeChanges(owner);
			const age = await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-age" },
				assertCommitAllowed: assertInputsCurrent,
				forceInProcess: false,
				plan: {
					kind: "maintenance-age",
					databaseOptions: operation.databaseOptions,
					materializedPlans: [],
					maintenance,
					ageChanges: pending.changes,
					expected: verify ? result.ageSnapshot : void 0
				}
			});
			if (age.kind === "maintenance-age" || age.kind === "maintenance-plan-stale") pending.acknowledge();
			if (age.kind === "maintenance-plan-stale") {
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance age fact changed after no-op planning");
			}
			if (age.kind !== "maintenance-age") throw new Error("SQLite automatic maintenance returned another age result");
			return age.nextAt;
		};
		if (plan.archived === 0 && plan.entryRemovals.length === 0) await readAge(true);
		await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(owner.scope, [plan], { isCurrent });
		finalized = true;
		activeSessionKeys = [];
		if (isCurrent() && owner.generation === generation) {
			nextMaintenanceAt = await readAge(false);
			if (owner.ageChanges.size > 0) {
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance activity changed during age publication");
			}
		}
		owner.rejections = 0;
	} catch (error) {
		if (planningChanged && isCurrent()) {
			if (finalized && owner.generation !== generation) {
				owner.rejections = 0;
				scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
				return;
			}
			activeSessionKeys.forEach((key) => owner.activeSessionKeys.add(key));
			owner.rejections += 1;
			owner.running = false;
			owner.retryDelayMs = MAINTENANCE_WRITE_QUIET_MS;
			if (owner.rejections >= MAX_MAINTENANCE_REJECTIONS) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic session maintenance paused after repeated input changes", {
				error,
				path: databasePath,
				rejections: owner.rejections
			});
			else {
				owner.running = true;
				owner.retryDelayMs = void 0;
				await runPendingMaintenance(databasePath, owner);
			}
			return;
		}
		if (!isGatewayRestartDrainError(error) && !(planningChanged && getGatewayRestartDrainSignal().aborted)) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic session maintenance failed", {
			error,
			path: databasePath
		});
	} finally {
		releaseMaintenanceExecution(databasePath, owner);
	}
	if (!isCurrent()) {
		retireMaintenanceOwner(databasePath, owner);
		return;
	}
	if (owner.generation === generation) {
		if (nextMaintenanceAt === void 0) {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		owner.running = false;
		owner.timer = setTimeout(() => {
			owner.timer = void 0;
			owner.running = true;
			startPendingMaintenance(databasePath, owner);
		}, Math.max(1, Math.min(SESSION_ENTRY_MAINTENANCE_INTERVAL_MS, nextMaintenanceAt - Date.now())));
		owner.timer.unref();
		return;
	}
	scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
}
//#endregion
//#region src/config/sessions/session-store-target-runtime.ts
function prepareSessionStoreRegistryRead(request) {
	return prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: request.env }, createSessionStoreRegistryMutationFilter({
		captured: request.candidates.map((candidate) => {
			try {
				const identity = readDatabasePathIdentitySync(candidate.path);
				return {
					candidate,
					identity: identity.key,
					birthtime: identity.birthtime
				};
			} catch {
				return {
					candidate,
					identity: "unavailable"
				};
			}
		}),
		preparedSources: [],
		registryDiscovery: request.registryDiscovery
	}));
}
/** Capture registry admission now; retain its witness independently of discovery custody. */
function prepareSessionStoreTargetInventoryRead(request, unchangedBy) {
	const { candidates, ...prepared } = request;
	const captureRegistry = () => prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: request.env }, unchangedBy);
	let registry = captureRegistry();
	let registryStarted = false;
	const assertRegistryCurrent = () => {
		if (registryStarted || unchangedBy) registry.assertCurrent();
	};
	return {
		assertRegistryCurrent,
		withRead(operation, assertCallerCurrent) {
			return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
				const assertCurrent = () => {
					assertCallerCurrent?.();
					discovery.assertCurrent();
					assertRegistryCurrent();
				};
				let inventory = await discovery.readTargetInventory({
					...prepared,
					registeredDatabases: { status: "deferred" }
				});
				assertCurrent();
				if (inventory.kind === "session-target-registry-required") {
					registryStarted = true;
					let current;
					try {
						current = await registry.read();
					} catch (error) {
						if (!(error instanceof AgentDatabaseRegistryChangedError)) throw error;
						registry = captureRegistry();
						current = await registry.read();
					}
					assertCurrent();
					registry = unchangedBy ? registry : prepareSessionStoreRegistryRead(request);
					inventory = await discovery.readTargetInventory({
						...prepared,
						registeredDatabases: current.result.status === "available" ? current.result.entries : { status: "unavailable" }
					});
					assertCurrent();
				}
				if (inventory.kind !== "session-target-inventory") throw new Error("Session store inventory requested registry rows twice");
				return operation(inventory, assertCurrent);
			});
		}
	};
}
async function withSessionStoreTarget(request, operation, assertCallerCurrent, onReadError, { lane } = {}) {
	assertCallerCurrent?.();
	const { candidates, ...targetRequest } = request;
	let registryRead = prepareSessionStoreRegistryRead(request);
	return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const assertDiscoveryCurrent = () => {
			assertCallerCurrent?.();
			discovery.assertCurrent();
			registryRead.assertCurrent();
		};
		const failedRead = async (error) => {
			assertDiscoveryCurrent();
			if (!onReadError) throw error;
			return await onReadError(error, assertDiscoveryCurrent);
		};
		let read = await discovery.readStoreTargetResult({
			...targetRequest,
			registeredDatabases: { status: "deferred" }
		});
		if (!read.ok) return await failedRead(read.error);
		let resolved = read.value;
		let registry;
		if (resolved.kind === "session-target-registry-required") {
			registryRead.assertCurrent();
			registry = await registryRead.read();
			assertDiscoveryCurrent();
			read = await discovery.readStoreTargetResult({
				...targetRequest,
				registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
			});
			if (!read.ok) return await failedRead(read.error);
			resolved = read.value;
			if (resolved.kind === "session-target-registry-required") throw new Error("Session store target requested registry rows twice");
		}
		const target = resolved;
		const assertSourceCurrent = () => {
			assertCallerCurrent?.();
			discovery.assertCurrent();
			assertSessionStoreReadCandidate(target.sourcePath, candidates);
		};
		const assertCurrent = () => {
			assertSourceCurrent();
			registryRead.assertCurrent();
		};
		let registrationChanged = false;
		const verifyCurrentTarget = async (assertRetainedCurrent) => {
			assertRetainedCurrent();
			const currentRead = prepareSessionStoreRegistryRead(request);
			const currentRegistry = await currentRead.read();
			assertRetainedCurrent();
			currentRegistry.assertCurrent();
			const current = await discovery.readStoreTargetResult({
				...targetRequest,
				registeredDatabases: currentRegistry.result.status === "available" ? currentRegistry.result.entries : { status: "unavailable" }
			});
			if (!current.ok) throw current.error;
			assertRetainedCurrent();
			currentRegistry.assertCurrent();
			if (!isDeepStrictEqual(current.value, target)) throw new Error("Session store registration changed its selected target");
			registryRead = currentRead;
			registry = currentRegistry;
			registrationChanged = false;
		};
		assertCurrent();
		const result = await operation(target, {
			assertCurrent,
			onRegistryChange(change) {
				if (registry) {
					registry.followRegistration(change);
					registrationChanged = true;
				}
			},
			async refreshBeforeDispatch(assertRetainedTarget) {
				try {
					assertCurrent();
				} catch (error) {
					if (!(error instanceof AgentDatabaseRegistryChangedError)) throw error;
					await verifyCurrentTarget(() => {
						assertSourceCurrent();
						assertRetainedTarget();
					});
				}
			},
			async revalidateTarget() {
				assertCurrent();
				if (registrationChanged) await verifyCurrentTarget(assertCurrent);
			}
		});
		if (registrationChanged) throw new Error("Session read released its owner before confirming registration");
		return result;
	}, lane);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-admission.ts
/** Admission retains the exact owner that supplied its row across asynchronous policy work. */
async function loadSessionEntryForAdmission(input, preparation = {}) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...input,
		env
	};
	const agentId = scope.agentId ? normalizeAgentId(scope.agentId) : parseAgentSessionKey(scope.sessionKey)?.agentId;
	const assertCurrent = () => {
		preparation.signal?.throwIfAborted();
		preparation.assertCurrent?.();
	};
	assertCurrent();
	if (isIncognitoSessionKey(scope.sessionKey) || Boolean(scope.storePath && (isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: agentId ?? scope.defaultAgentId ?? "main",
		env
	}) || listOpenIncognitoAgentDatabases().some((owner) => owner.storePath === scope.storePath)))) {
		const resolved = resolveSqliteScope(scope);
		const options = toDatabaseOptions(resolved);
		const database = openOpenClawAgentDatabase(options);
		const borrowed = borrowOpenClawAgentDatabase(options);
		const databaseClaim = createOpenClawAgentDatabaseClaim(database, borrowed.release);
		try {
			assertCurrent();
			return {
				entry: readSessionEntryRow(database, resolved.sessionKey)?.entry,
				databaseClaim
			};
		} catch (error) {
			databaseClaim.release();
			throw error;
		}
	}
	let storePath;
	if (scope.storePath) storePath = path.resolve(scope.storePath);
	else {
		if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
		storePath = resolveOpenClawAgentSqlitePath({
			agentId,
			env
		});
	}
	const candidates = captureSessionStoreReadCandidates(storePath);
	let claim;
	try {
		const result = await withSessionStoreTarget({
			agentId,
			defaultAgentId: scope.defaultAgentId,
			storePath,
			env,
			candidates
		}, async (target, owner) => {
			const options = {
				...target.database,
				path: target.sourcePath,
				env
			};
			const observed = readDatabasePathIdentitySync(options.path);
			return await runOpenClawAgentWorkerWrite(options, async () => {
				const execution = captureOpenClawAgentDatabaseExecution(options, observed.key.startsWith("file:") ? { expectedIdentity: {
					kind: "file",
					physicalIdentity: observed.key.slice(5),
					nativeLocation: observed.canonicalPath,
					birthtime: observed.birthtime
				} } : { expectedCreationIdentity: observed });
				const assertSourceCurrent = () => {
					assertCurrent();
					execution.assertCurrent();
					owner.assertCurrent();
				};
				const source = {
					assertCurrent: assertSourceCurrent,
					onRegistryChange: owner.onRegistryChange,
					createAdmission(binding) {
						return () => ({
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((request, grant) => {
								binding.authorize(request);
								assertSourceCurrent();
								if (!grant()) throw new Error("Session admission authority expired");
							}, binding.attachment)
						});
					}
				};
				let transferred = false;
				try {
					await owner.refreshBeforeDispatch(() => execution.assertCurrent());
					assertSourceCurrent();
					await execution.prepare(source, preparation.signal);
					const entry = await execution.runExisting(source, (worker) => worker.execute({
						type: "session.entry.read",
						input: { sessionKey: resolveSqliteSessionKey(scope.sessionKey, target.logicalAgentId) }
					}, { signal: preparation.signal }));
					await owner.revalidateTarget();
					assertSourceCurrent();
					const generation = execution.captureGenerationClaim();
					let release;
					claim = {
						kind: "worker",
						identity: generation.identity,
						incarnation: generation.incarnation,
						assertCurrent: () => generation.assertCurrent(),
						isCurrent() {
							try {
								generation.assertCurrent();
								return true;
							} catch {
								return false;
							}
						},
						release: () => release ??= execution.release()
					};
					transferred = true;
					return {
						entry,
						databaseClaim: claim
					};
				} finally {
					if (!transferred) await execution.release();
				}
			}, void 0, preparation.signal);
		}, assertCurrent);
		assertCurrent();
		result.databaseClaim.assertCurrent();
		return result;
	} catch (error) {
		await claim?.release();
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry.ts
/** Loads one session entry from the additive SQLite session store. */
function loadSessionEntry(scope) {
	return resolveSessionEntry(scope).existing;
}
/** Loads one session entry without opening its agent database writable. */
function loadSessionEntryReadOnly(scope) {
	return resolveSessionEntry(scope, {
		readOnly: true,
		projection: scope.projection
	}).existing;
}
/** Lists persisted session keys without materializing their entry JSON. */
async function listSessionEntryKeysReadOnly(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key").orderBy("session_key")).rows.map((row) => row.session_key);
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Lists direct child rows without cloning or rebuilding the complete session store. */
function listSessionChildEntriesReadOnly(scope) {
	const resolved = resolveSqliteScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const db = getSessionKysely(database.db);
		const query = scope.projection === "list" ? selectSessionEntryRows(database, scope.projection).select(["current_session_id", "updated_at"]) : db.selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns);
		const sessionKeys = db.selectFrom("session_nodes").select("session_key");
		const childKeys = sessionKeys.where("parent_session_key", "=", resolved.sessionKey).union(sessionKeys.where("spawned_by", "=", resolved.sessionKey));
		const childRows = executeSqliteQuerySync(database.db, query.where("session_key", "in", childKeys).where("session_key", "!=", resolved.sessionKey).orderBy("session_key", "asc")).rows;
		return parseReadableSqliteSessionEntryRows(database, childRows.filter((row) => !isInternalSessionEffectsKey(row.session_key)), scope.projection);
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Resolves the persisted session key for a SQLite transcript session id. */
function resolveSessionKeyBySessionId(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", resolved.sessionId).limit(1));
	}, toDatabaseOptions(resolved));
	return result.found ? result.value?.session_key : void 0;
}
/** Lists session entries from the additive SQLite session store. */
function listSessionEntryRows(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return listSqliteSessionEntriesFromDatabase(database, resolved, scope);
}
/** Reuse one reader during synchronous entry work; each read keeps its current admission. */
function withSessionEntryReadOnlyScope(scope, operation) {
	const options = toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}));
	const reader = new OpenClawAgentDatabaseReadOnlyScope();
	try {
		return reader.run({
			agentId: options.agentId,
			path: resolveOpenClawAgentSqlitePath(options)
		}, operation);
	} finally {
		reader.close();
	}
}
/** Lists transcript-bearing SQLite sessions, including retained rows from session-id rotation. */
function listSessionTranscriptInstances(scope = {}, options = {}, continuation) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, continuation, () => {
		const currentEntries = options.sessionId !== void 0 ? { get: (sessionKey) => readExactSessionEntryRowValidated(database, sessionKey, scope.projection)?.entry } : new Map(listSqliteSessionEntriesFromDatabase(database, resolved, {
			...scope,
			clone: false
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		return listTranscriptInstancesFromDatabase({
			currentEntries,
			database,
			options
		});
	}), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Reads a session activity timestamp from the additive SQLite session store. */
function readSessionUpdatedAtCore(scope) {
	const resolved = resolveSqliteScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const row = readSessionEntryRow(database, resolved.sessionKey, "list")?.row;
	return row ? coerceRequiredSqliteNumber(row.updated_at) : void 0;
}
/** Applies a partial entry update to the additive SQLite session store. */
async function upsertSessionEntryCore(scope, patch, options = {}) {
	return await patchSessionEntryCore(scope, () => patch, {
		workerGuard: {},
		...options,
		fallbackEntry: createFallbackSessionEntry(patch)
	});
}
/** Replaces one entry in the additive SQLite session store. */
async function replaceSessionEntry(scope, entry) {
	return await patchSessionEntryCore(scope, () => entry, {
		workerGuard: {},
		fallbackEntry: entry,
		replaceEntry: true
	});
}
/** Replaces one entry synchronously for sync session runtimes. */
function replaceSessionEntrySync(scope, entry) {
	const resolved = resolveSqliteScope(scope);
	assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
	runOpenClawAgentWriteTransaction((database) => {
		const { previous, current } = replaceSessionEntryInDatabase(database, resolved.sessionKey, entry);
		return prepareSessionIdentityPublication(database, resolved.agentId, previous, current);
	}, toDatabaseOptions(resolved), { operationLabel: "session-entry.replace" })();
}
/** Patches one entry in the additive SQLite session store. */
async function patchSessionEntryCore(scope, update, options = {}) {
	return await patchSessionEntryInScope(scope, update, options);
}
async function patchSessionEntryInScope(scope, update, options, databaseAgentId) {
	const resolved = resolveSqliteScope(scope);
	if (databaseAgentId) resolved.databaseAgentId = databaseAgentId;
	assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry.patch",
		validateCanonicalKeys: options.replaceEntry !== true,
		options,
		selection: {
			kind: "entry",
			sessionKey: resolved.sessionKey,
			exact: options.replaceEntry === true
		},
		readSnapshot: (database) => readSessionEntrySelectionSnapshot(database, resolved.sessionKey, options.replaceEntry === true),
		resolved,
		sessionKey: resolved.sessionKey,
		storePath: resolveSessionStorePathForScope(scope),
		update
	});
}
/** Patches one logical entry after validating its canonical lifecycle target. */
async function patchSessionEntryTarget(scope, update, options = {}) {
	const source = scope.readSource;
	const resolved = source ? {
		agentId: scope.agentId ?? source.agentId,
		databaseAgentId: source.agentId,
		env: scope.env,
		path: source.path,
		ownerStorePath: source.path,
		sessionKey: ""
	} : resolveSqliteScope({
		agentId: scope.agentId,
		env: scope.env,
		sessionKey: "",
		storePath: scope.storePath
	});
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry-target.patch",
		capturedSource: source,
		validateCanonicalKeys: true,
		options,
		selection: {
			kind: "target",
			target: scope.target
		},
		readSnapshot: (database) => readLifecycleTargetSnapshot(database, scope.target),
		resolved,
		sessionKey: scope.target.canonicalKey,
		storePath: source?.path ?? resolveSessionStorePathForScope({
			agentId: scope.agentId,
			sessionKey: scope.target.canonicalKey,
			storePath: scope.storePath
		}),
		update
	});
}
/** All entry patches prepare asynchronously, then revalidate and publish on one commit edge. */
async function patchSqliteSessionEntrySnapshot(params) {
	const { options, sessionKey } = params;
	const resolved = {
		...params.resolved,
		env: cloneEnvWithPlatformSemantics(params.resolved.env ?? process.env)
	};
	resolved.env.OPENCLAW_STATE_DIR = resolveStateDir(resolved.env);
	const databaseOptions = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	resolved.path = databasePath;
	databaseOptions.path = databasePath;
	const incognito = isIncognitoOpenClawAgentSqlitePath(databasePath, databaseOptions);
	const captured = params.capturedSource;
	const assertCapturedSource = (database) => {
		if (!captured) return;
		if (!database && typeof captured.databaseIdentity === "string") assertExistingDatabaseIdentity(captured.path, `file:${captured.databaseIdentity}`, captured.databaseBirthtime);
		assertCapturedSessionEntryReadSource(captured, database ?? getOpenClawAgentDatabaseIfOpen(databaseOptions));
	};
	const assertCurrent = captured ? () => assertCapturedSource() : void 0;
	const prepare = async (prepared) => {
		const existing = prepared[0]?.entry;
		const writeBase = existing ?? options.fallbackEntry;
		if (!writeBase) return;
		let contextEntry = existing;
		let contextEntryBorrowed = true;
		const patch = await params.update(structuredClone(writeBase), {
			get existingEntry() {
				if (contextEntryBorrowed) {
					contextEntry = contextEntry ? structuredClone(contextEntry) : void 0;
					contextEntryBorrowed = false;
				}
				return contextEntry;
			},
			set existingEntry(entry) {
				contextEntry = entry;
				contextEntryBorrowed = false;
			}
		});
		const mergeBase = existing ? writeBase : void 0;
		const creationPatch = !existing && patch ? {
			...writeBase,
			...patch
		} : patch;
		const merged = !creationPatch ? void 0 : options.replaceEntry ? structuredClone(patch) : options.preserveActivity ? mergeSessionEntryPreserveActivity(mergeBase, creationPatch) : mergeSessionEntry(mergeBase, creationPatch);
		const next = !merged ? void 0 : options.replaceEntry ? merged : preserveSqliteSameKeySessionRolloverLineage({
			next: merged,
			previous: writeBase,
			sessionKey
		});
		return {
			selection: params.selection,
			prepared,
			sessionKey,
			writeBase,
			next,
			operationLabel: params.operationLabel,
			validateCanonicalKeys: params.validateCanonicalKeys,
			consumePendingReset: options.consumePendingReset,
			providerReviewMutation: options.providerReviewMutation,
			shouldCommitIf: options.workerGuard?.shouldCommitIf
		};
	};
	const withDatabase = (operation) => {
		assertCurrent?.();
		return !incognito && !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseAsync(databaseOptions, operation, assertCurrent) : operation();
	};
	let wrote = false;
	const committed = isMainThread && options.workerGuard !== void 0 && !options.shouldCommit && !options.assertCommitAllowed && supportsOpenClawAgentDatabaseExecution(databaseOptions) ? await patchSessionEntryInWorker({
		database: {
			...databaseOptions,
			path: databasePath
		},
		databaseIdentity: typeof captured?.databaseIdentity === "string" ? captured.databaseIdentity : void 0,
		agentId: resolved.agentId,
		selection: params.selection,
		assertCurrent: () => assertCurrent?.(),
		guard: options.workerGuard,
		prepare,
		onCommitted: options.onCommitted
	}).then((result) => {
		wrote = result.wrote;
		return result.entry;
	}) : await runExclusiveSqliteSessionWrite(resolved, async () => withDatabase(async () => {
		const database = openOpenClawAgentDatabase(databaseOptions);
		assertCapturedSource(database);
		const prepared = params.readSnapshot(database);
		const input = await prepare(prepared);
		if (!input) return null;
		const { writeBase, next } = input;
		return withDatabase(async () => {
			let result = null;
			const publish = await runOpenClawAgentWriteWithYieldingAdmission((writeDatabase) => {
				assertCapturedSource(writeDatabase);
				options.workerGuard?.assertCurrent?.();
				if (options.shouldCommit?.() === false) return;
				if (!sessionEntryPatchPredicateMatches(writeDatabase, sessionKey, options.workerGuard?.shouldCommitIf)) return;
				const mutation = applySessionEntryPatchInDatabase(writeDatabase, {
					operationLabel: params.operationLabel,
					validateCanonicalKeys: params.validateCanonicalKeys,
					readSnapshot: params.readSnapshot,
					prepared,
					sessionKey,
					writeBase,
					next,
					options
				});
				result = mutation.entry;
				if (!mutation.identity) return;
				wrote = true;
				return prepareSessionIdentityPublication(writeDatabase, resolved.agentId, mutation.identity.previous, mutation.identity.current);
			}, databaseOptions, { operationLabel: params.operationLabel });
			try {
				if (next && result) options.onCommitted?.(structuredClone(result));
			} finally {
				publish?.();
			}
			return result;
		});
	}), params.operationLabel);
	if (wrote) kickSessionEntryMaintenanceAfterWrite({
		activeSessionKey: sessionKey,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
		maintenanceConfig: options.maintenanceConfig,
		scope: resolved,
		skipMaintenance: options.skipMaintenance,
		storePath: params.storePath
	});
	kickSessionHistoryDiskBudgetMaintenance({
		...resolved.agentId ? { agentId: resolved.agentId } : {},
		env: resolved.env,
		storePath: params.storePath,
		...options.maintenanceConfig ? { maintenanceConfig: options.maintenanceConfig } : {}
	});
	return committed;
}
function buildInboundSessionCreationStamp(ctx) {
	const senderId = ctx?.SenderId?.trim();
	return buildSessionCreationStamp(ctx?.SessionCreation ?? {
		via: "channel",
		...senderId ? { actor: {
			type: "human",
			source: "channel",
			id: senderId,
			label: ctx?.SenderName?.trim() || void 0
		} } : {}
	});
}
async function recordInboundSessionMeta(params) {
	normalizeInternalTurnContext(params.ctx);
	const createIfMissing = params.createIfMissing ?? true;
	return await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => {
		const metadataPatch = deriveSessionMetaPatch({
			ctx: params.ctx,
			sessionKey: params.sessionKey,
			existing: context.existingEntry,
			groupResolution: params.groupResolution
		});
		if (context.existingEntry) return metadataPatch;
		return {
			...buildInboundSessionCreationStamp(params.ctx),
			...metadataPatch
		};
	}, {
		preserveActivity: true,
		workerGuard: {},
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	});
}
/** Updates last-route/delivery metadata without refreshing activity timestamps. */
async function updateSessionLastRoute(params) {
	return await updateSessionLastRouteInScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params);
}
/** Internal callers retain their captured storage owner across route preparation. */
async function updateSessionLastRouteInScope(scope, params) {
	if (params.ctx) normalizeInternalTurnContext(params.ctx);
	const createIfMissing = params.createIfMissing ?? true;
	return await patchSessionEntryInScope(scope, (_entry, context) => {
		const routePatch = deriveLastRoutePatch({
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			threadId: params.threadId,
			route: params.route,
			deliveryContext: params.deliveryContext,
			ctx: params.ctx,
			groupResolution: params.groupResolution,
			existing: context.existingEntry,
			sessionKey: scope.sessionKey
		});
		if (context.existingEntry) return routePatch;
		return {
			...buildInboundSessionCreationStamp(params.ctx),
			...routePatch
		};
	}, {
		preserveActivity: true,
		workerGuard: {},
		...params.assertCommitAllowed ? { assertCommitAllowed: params.assertCommitAllowed } : {},
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	}, scope.databaseAgentId);
}
//#endregion
export { withSessionEntryReadOnlyScope as _, loadSessionEntry as a, withSessionStoreTarget as b, patchSessionEntryTarget as c, replaceSessionEntry as d, replaceSessionEntrySync as f, upsertSessionEntryCore as g, updateSessionLastRouteInScope as h, listSessionTranscriptInstances as i, readSessionUpdatedAtCore as l, updateSessionLastRoute as m, listSessionEntryKeysReadOnly as n, loadSessionEntryReadOnly as o, resolveSessionKeyBySessionId as p, listSessionEntryRows as r, patchSessionEntryCore as s, listSessionChildEntriesReadOnly as t, recordInboundSessionMeta as u, loadSessionEntryForAdmission as v, kickSessionEntryMaintenanceAfterWrite as x, prepareSessionStoreTargetInventoryRead as y };
