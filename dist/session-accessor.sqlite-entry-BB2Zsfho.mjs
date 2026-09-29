import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { a as resolveExplicitSessionStorePathForScope, l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent, t as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase, m as withOpenClawAgentDatabaseAsync, s as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { t as OpenClawAgentDatabaseReadOnlyScope } from "./openclaw-agent-db-readonly-scope-BIEwBWBt.mjs";
import { r as publishSystemEventStoreResolver, t as getSystemEventStorePath } from "./system-event-ownership-CHVGbaAW.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, l as resolveSqliteReadScope, n as cloneSessionEntry, p as resolveSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as readSessionEntryRow, n as parseReadableSqliteSessionEntryRows, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { a as selectSessionEntryRows, i as readSessionEntriesByStatus, t as hasSessionEntriesByStatus } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { i as assertCanonicalSqliteSessionKeysCurrent, n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-BBylVEaq.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { r as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { B as isSessionEntryMaintenanceAgeCaptureCurrent, H as readSessionEntryMaintenanceNextAgeAt, I as SESSION_ENTRY_MAINTENANCE_INTERVAL_MS, L as adoptSessionEntryMaintenanceAgeFact, R as captureSessionEntryMaintenanceAgeFact, at as deriveLastRoutePatch, c as readSessionIdentitySnapshot, f as writeSessionEntry, h as createFallbackSessionEntry, l as readUnchangedLifecycleTargetSnapshot, o as readLifecycleTargetSnapshot, ot as deriveSessionMetaPatch, s as readSessionEntrySelectionSnapshot, vt as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-moohSd1t.mjs";
import { c as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-C5xEVYop.mjs";
import { r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-Can_jxkB.mjs";
import "./session-accessor.sqlite-initial-entry-DTpzTl-3.mjs";
import { i as mergeSessionEntryPreserveActivity, r as mergeSessionEntry } from "./types-ByCc34Vn.mjs";
import { s as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { t as listTranscriptArchivesFromDatabase } from "./session-accessor.sqlite-archive-read-CCmxEvBb.mjs";
import { a as runSqliteTranscriptArchiveReadWorker, l as withSqliteTranscriptArchiveSession } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import { n as canSkipSessionEntryMaintenanceInDatabase, r as emptySessionEntryMaintenancePlan } from "./session-accessor.sqlite-maintenance-store-c0MylNwB.mjs";
import { o as createSessionMaintenancePlanningOperation, p as runSqliteSessionReclamation } from "./session-accessor.sqlite-reclamation-COI-npzt.mjs";
import { n as captureSessionMaintenancePreservation, t as resolveMaintenanceConfig } from "./store-maintenance-runtime-C9xB-eDV.mjs";
import { i as kickSessionHistoryDiskBudgetMaintenance, o as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort } from "./session-history-eviction-BMyfpOCd.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-mutation.ts
/** The caller owns transaction admission and publication after the durable commit. */
function replaceSessionEntryInDatabase(database, sessionKey, entry) {
	const identityKeys = collectSessionEntryLookupKeys(database, sessionKey);
	const previous = readSessionIdentitySnapshot(database, identityKeys);
	writeSessionEntry(database, sessionKey, entry);
	return {
		previous,
		current: readSessionIdentitySnapshot(database, identityKeys)
	};
}
/** Revalidate prepared rows and apply the patch on the already-admitted connection. */
function applySessionEntryPatchInDatabase(database, params) {
	if (params.validateCanonicalKeys) assertCanonicalSqliteSessionKeysCurrent(database);
	let fresh = readUnchangedLifecycleTargetSnapshot(database, params.prepared);
	if (!fresh) {
		fresh = params.readSnapshot(database);
		assertLifecycleTargetSnapshotUnchanged(params.prepared, fresh, params.operationLabel);
	}
	params.options.assertCommitAllowed?.();
	if (!params.next) return { entry: cloneSessionEntry(params.writeBase) };
	const previous = new Map(fresh.map((row) => [row.sessionKey, row.entry]));
	const selectedPreviousEntry = fresh[0]?.entry ?? params.writeBase;
	const persisted = writeSessionEntry(database, params.sessionKey, params.next, {
		...params.options.consumePendingReset ? { consumePendingReset: true } : {},
		...params.options.providerReviewMutation ? { providerReviewMutation: true } : {},
		previousEntry: selectedPreviousEntry,
		...fresh[0]?.sessionKey === params.sessionKey ? { canonicalPreviousEntry: fresh[0].entry } : {}
	});
	const current = /* @__PURE__ */ new Map([[params.sessionKey, persisted]]);
	return {
		entry: cloneSessionEntry(persisted),
		identity: {
			previous,
			current
		}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history.ts
function listTranscriptInstancesFromDatabase(params) {
	let query = getSessionKysely(params.database.db).selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"created_at",
		"updated_at",
		"channel",
		"account_id",
		"transcript_updated_at",
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source",
		"parent_session_key",
		"spawned_by",
		"chat_type"
	]);
	if (!params.options.includeAllWindows) query = query.where("transcript_updated_at", "is not", null);
	if (params.options.sessionId !== void 0) query = query.where("session_id", "=", params.options.sessionId);
	return executeSqliteQuerySync(params.database.db, query.orderBy("transcript_updated_at", "desc").orderBy("session_id", "asc")).rows.map((row) => {
		if (!params.options.includeAllWindows && isInternalSessionEffectsKey(row.session_key)) return;
		const updatedAtMs = row.transcript_updated_at ?? row.updated_at;
		const current = params.currentEntries.get(row.session_key);
		const currentIsExact = current?.sessionId === row.session_id;
		const provenanceKnown = row.session_entry_provenance === 1;
		const hookExternalContentSource = row.hook_external_content_source === "gmail" || row.hook_external_content_source === "webhook" ? row.hook_external_content_source : void 0;
		const chatType = row.chat_type === "direct" || row.chat_type === "group" || row.chat_type === "channel" ? row.chat_type : void 0;
		const exactHookSource = (currentIsExact ? current?.hookExternalContentSource : void 0) ?? (provenanceKnown && hookExternalContentSource === "gmail" ? "gmail" : null);
		const entry = {
			...currentIsExact && current ? structuredClone(current) : {},
			sessionId: row.session_id,
			updatedAt: updatedAtMs,
			...row.parent_session_key ? { parentSessionKey: row.parent_session_key } : {},
			...row.spawned_by ? {
				spawnedBy: row.spawned_by,
				spawnDepth: 1
			} : {},
			...chatType ? { chatType } : {},
			...provenanceKnown && row.plugin_owner_id ? { pluginOwnerId: row.plugin_owner_id } : {},
			...provenanceKnown && hookExternalContentSource ? { hookExternalContentSource } : {}
		};
		return {
			agentId: resolveAgentIdFromSessionKey(row.session_key, params.database.agentId),
			acpOwned: row.acp_owned === 1 || Boolean(currentIsExact && current?.acp),
			entry,
			provenanceKnown,
			sessionId: row.session_id,
			sessionKey: row.session_key,
			updatedAtMs,
			sourceMetadata: {
				createdAt: row.created_at,
				channel: row.channel,
				accountId: row.account_id,
				chatType: chatType ?? null,
				hookExternalContentSource: exactHookSource
			}
		};
	}).filter((entry) => entry !== void 0);
}
/** Read retained archive identities through the same physical and logical session owner. */
function listSessionTranscriptArchivesReadOnly(scope) {
	const selectors = [...new Set(scope.sessionIds ?? [])];
	const archiveNames = [...new Set(scope.archiveNames ?? [])];
	if (selectors.length === 0 && archiveNames.length === 0) return [];
	const resolved = resolveSqliteReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => listTranscriptArchivesFromDatabase(database, scope.includeAllAgents ? void 0 : resolved.agentId, selectors, archiveNames), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Reads committed archive content before its optional filesystem export is published. */
async function findSessionTranscriptArchiveEventReadOnly(scope, runId) {
	const resolved = resolveSqliteReadScope(scope);
	const options = toDatabaseOptions(resolved);
	return withSqliteTranscriptArchiveSession(options, async () => {
		const registered = withOpenClawAgentDatabaseReadOnly((database) => listTranscriptArchivesFromDatabase(database, resolved.agentId, [scope.sessionId ?? scope.sessionKey], []).some((archive) => scope.sessionId ? archive.sessionId === scope.sessionId : archive.sessionKey === scope.sessionKey), options);
		if (!registered.found || !registered.value) return;
		const [result] = await runSqliteTranscriptArchiveReadWorker([{
			agentId: options.agentId,
			databasePath: resolveOpenClawAgentSqlitePath(options),
			logicalAgentId: resolved.agentId,
			sessionId: scope.sessionId,
			sessionKey: scope.sessionKey,
			runId
		}]);
		return result?.event === void 0 ? void 0 : { event: result.event };
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-kick.ts
const maintenanceByStore = /* @__PURE__ */ new Map();
/** Coalesce automatic logical maintenance outside ordinary entry-write latency. */
function kickSessionEntryMaintenanceAfterWrite(params) {
	if (params.skipMaintenance) return;
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(params.scope));
	const database = getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(params.scope));
	if (!database) return;
	const owner = maintenanceByStore.get(databasePath);
	if (owner?.database === database) {
		owner.activeSessionKeys.add(params.activeSessionKey);
		Object.assign(owner, params, { generation: owner.generation + 1 });
		if (!owner.running) scheduleImmediateMaintenance(databasePath, owner);
		return;
	}
	if (owner) retireMaintenanceOwner(databasePath, owner);
	const created = {
		...params,
		activeSessionKeys: /* @__PURE__ */ new Set([params.activeSessionKey]),
		database,
		generation: 1,
		running: false
	};
	maintenanceByStore.set(databasePath, created);
	created.unregisterClose = registerNodeSqliteDisposeCallback(database.db, () => retireMaintenanceOwner(databasePath, created));
	scheduleImmediateMaintenance(databasePath, created);
}
function retireMaintenanceOwner(databasePath, owner) {
	clearImmediate(owner.immediate);
	clearTimeout(owner.timer);
	owner.unregisterClose?.();
	if (maintenanceByStore.get(databasePath) === owner) maintenanceByStore.delete(databasePath);
}
function scheduleImmediateMaintenance(databasePath, owner) {
	clearTimeout(owner.timer);
	owner.timer = void 0;
	owner.running = true;
	owner.immediate = setImmediate(() => {
		owner.immediate = void 0;
		runPendingMaintenance(databasePath, owner);
	});
}
async function runPendingMaintenance(databasePath, owner) {
	const isCurrent = () => maintenanceByStore.get(databasePath) === owner && owner.database.db.isOpen && getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(owner.scope)) === owner.database;
	while (isCurrent()) {
		const generation = owner.generation;
		const activeSessionKeys = [...owner.activeSessionKeys];
		owner.activeSessionKeys.clear();
		let nextMaintenanceAt = Infinity;
		let planningChanged = false;
		try {
			const prepared = await runExclusiveSqliteSessionWrite(owner.scope, async () => {
				if (!isCurrent()) return;
				const maintenance = owner.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(owner.maintenanceConfig) : resolveMaintenanceConfig();
				const ageCapture = captureSessionEntryMaintenanceAgeFact(owner.database.db, maintenance);
				if (ageCapture.fact && maintenance.mode === "enforce" && isOpenClawAgentDatabasePathCurrent(owner.database) && canSkipSessionEntryMaintenanceInDatabase(owner.database, { maintenance })) return {
					maintenance,
					ageCapture,
					operation: void 0
				};
				return {
					maintenance,
					operation: createSessionMaintenancePlanningOperation({
						databaseOptions: toDatabaseOptions(owner.scope),
						input: {
							ageFact: ageCapture.fact,
							activeSessionKeys,
							archiveDirectory: owner.archiveDirectory,
							maintenance,
							preservation: null,
							storePath: owner.storePath
						}
					}),
					ageCapture
				};
			}, "session.maintenance.plan");
			if (!prepared) break;
			const { maintenance, operation } = prepared;
			let { ageCapture } = prepared;
			const assertInputsCurrent = () => {
				if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
				if (owner.generation !== generation || operation && operation.input.preservation !== null && !isDeepStrictEqual(operation.input.preservation, captureSessionMaintenancePreservation(operation.input.storePath))) {
					planningChanged = true;
					throw new Error("SQLite automatic maintenance inputs changed before commit");
				}
			};
			const assertCurrent = () => {
				assertInputsCurrent();
				if (!isSessionEntryMaintenanceAgeCaptureCurrent(owner.database.db, ageCapture)) {
					planningChanged = true;
					throw new Error("SQLite automatic maintenance age fact changed before commit");
				}
				if (!operation && !isOpenClawAgentDatabasePathCurrent(owner.database)) {
					planningChanged = true;
					throw new Error("SQLite automatic maintenance database path changed");
				}
			};
			const runPlanning = () => {
				if (!operation) {
					assertCurrent();
					return Promise.resolve({
						kind: "maintenance-plan",
						value: emptySessionEntryMaintenancePlan()
					});
				}
				return runSqliteSessionReclamation({
					diagnostics: { kind: "maintenance-plan" },
					assertCommitAllowed: assertCurrent,
					onWorkerResult: (result) => {
						if (result.kind === "maintenance-plan" && isCurrent()) adoptSessionEntryMaintenanceAgeFact(owner.database.db, ageCapture, result.ageFact);
					},
					forceInProcess: false,
					plan: operation
				});
			};
			let result = maintenance.mode === "warn" ? {
				kind: "maintenance-plan",
				value: emptySessionEntryMaintenancePlan()
			} : await runPlanning();
			if (!operation) assertCurrent();
			if (operation && result.kind === "maintenance-preservation-required") {
				await runExclusiveSqliteSessionWrite(owner.scope, async () => {
					assertInputsCurrent();
					ageCapture = captureSessionEntryMaintenanceAgeFact(owner.database.db, operation.input.maintenance);
					operation.input.ageFact = ageCapture.fact;
					operation.input.preservation = captureSessionMaintenancePreservation(operation.input.storePath);
				}, "session.maintenance.plan");
				result = await runPlanning();
			}
			if (result.kind !== "maintenance-plan") throw new Error("SQLite automatic maintenance returned another operation's result");
			const plan = result.value;
			await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(owner.scope, [plan], { isCurrent });
			if (isCurrent() && owner.generation === generation) nextMaintenanceAt = readSessionEntryMaintenanceNextAgeAt(owner.database, maintenance);
		} catch (error) {
			if (planningChanged && isCurrent()) {
				owner.generation += 1;
				activeSessionKeys.forEach((key) => owner.activeSessionKeys.add(key));
			} else getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic session maintenance failed", {
				error,
				path: databasePath
			});
		}
		if (!isCurrent()) break;
		if (owner.generation === generation) {
			if (nextMaintenanceAt === void 0) break;
			owner.running = false;
			owner.timer = setTimeout(() => {
				owner.timer = void 0;
				owner.running = true;
				runPendingMaintenance(databasePath, owner);
			}, Math.max(1, Math.min(SESSION_ENTRY_MAINTENANCE_INTERVAL_MS, nextMaintenanceAt - Date.now())));
			owner.timer.unref();
			return;
		}
	}
	retireMaintenanceOwner(databasePath, owner);
}
//#endregion
//#region src/config/sessions/session-entry-lineage.ts
/** True when this entry's transcript began as a copy of a parent (actual forkSource ancestry or the legacy/thread-settled marker). */
function sessionEntryForkedFromParent(entry) {
	return entry?.forkSource !== void 0 || entry?.forkedFromParent === true;
}
function preserveSqliteSameKeySessionRolloverLineage(params) {
	const previousSessionId = params.previous.sessionId.trim();
	const nextSessionId = params.next.sessionId.trim();
	if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) return params.next;
	return {
		...params.next,
		previousSessionId,
		usageFamilyKey: params.next.usageFamilyKey ?? params.previous.usageFamilyKey ?? params.sessionKey,
		usageFamilySessionIds: uniqueStrings([
			...params.previous.usageFamilySessionIds ?? [],
			previousSessionId,
			...params.next.usageFamilySessionIds ?? [],
			nextSessionId
		])
	};
}
//#endregion
//#region src/config/sessions/session-store-path.ts
function resolvePhysicalSessionStorePath(scope, cfg) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveIdentityPathViaExistingAncestorSync(resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathForScope(scope, cfg), {
		...scope,
		agentId
	}).path);
}
function publishSystemEventStoreConfig(cfg) {
	const env = { ...process.env };
	const paths = /* @__PURE__ */ new Map();
	publishSystemEventStoreResolver((sessionKey, owner) => {
		const agentId = resolveAgentIdFromSessionKey(sessionKey, owner);
		const scope = {
			sessionKey,
			agentId,
			env
		};
		const key = JSON.stringify([agentId, resolveSessionStorePathForScope(scope, cfg)]);
		if (!paths.has(key)) paths.set(key, resolvePhysicalSessionStorePath(scope, cfg));
		return paths.get(key);
	});
}
function captureSessionWatcherStorePaths(keys = [], env) {
	return Object.fromEntries(keys.filter((key) => parseAgentSessionKey(key) != null).map((sessionKey) => [sessionKey, getSystemEventStorePath(sessionKey) ?? resolvePhysicalSessionStorePath({
		sessionKey,
		env
	})]));
}
function resolveSessionStorePathForScope(scope, config) {
	const explicitStorePath = resolveExplicitSessionStorePathForScope(scope);
	if (explicitStorePath) return explicitStorePath;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveSessionStorePathCore((config ?? getRuntimeConfig()).session?.store, {
		agentId,
		env: scope.env
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry.ts
function assertCanonicalSessionWriteScope(scope) {
	assertCanonicalSessionKeyWrite(scope.sessionKey, scope.agentId);
}
/** Loads one session entry from the additive SQLite session store. */
function loadSessionEntry(scope) {
	return resolveSessionEntry(scope).existing;
}
/** Admission retains the exact owner that supplied its row across asynchronous policy work. */
function loadSessionEntryForAdmission(scope) {
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const database = openOpenClawAgentDatabase(options);
	const borrowed = borrowOpenClawAgentDatabase(options);
	const databaseClaim = createOpenClawAgentDatabaseClaim(database, borrowed.release);
	try {
		return {
			entry: readSessionEntryRow(database, resolved.sessionKey)?.entry,
			databaseClaim
		};
	} catch (error) {
		databaseClaim.release();
		throw error;
	}
}
/** Loads one session entry without opening its agent database writable. */
function loadSessionEntryReadOnly(scope) {
	return resolveSessionEntry(scope, {
		readOnly: true,
		projection: scope.projection
	}).existing;
}
/** Private prepared reads must reject a different physical owner at the captured path. */
function loadSessionEntryReadOnlyInScope(scope) {
	return resolveSessionEntry(scope, {
		readOnly: true,
		databaseAgentId: scope.databaseAgentId,
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
		const query = scope.projection === "list" ? selectSessionEntryRows(database, scope.projection).select(["current_session_id", "updated_at"]) : db.selectFrom("session_nodes").selectAll();
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
/**
* Proves whether a durable store has a row in one of the requested lifecycle states.
* Unknown existing schemas stay eligible so the writable owner can surface or repair them.
*/
function hasSessionEntriesByStatusReadOnly(scope, statuses) {
	const selectedStatuses = [...new Set(statuses)];
	if (selectedStatuses.length === 0) return false;
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => hasSessionEntriesByStatus(database, selectedStatuses), toDatabaseOptions(resolved));
	return result.found ? result.value : result.reason !== "database-missing";
}
/** Lists only entries whose normalized session row has one of the requested statuses. */
function listSessionEntriesByStatus(scope, statuses) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readSessionEntriesByStatus(database, statuses).filter(({ sessionKey }) => !isInternalSessionEffectsKey(sessionKey));
}
/** Lists transcript-bearing SQLite sessions, including retained rows from session-id rotation. */
function listSessionTranscriptInstances(scope = {}, options = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		return listTranscriptInstancesFromDatabase({
			currentEntries: options.sessionId !== void 0 ? { get: (sessionKey) => readExactSessionEntryRowValidated(database, sessionKey, scope.projection)?.entry } : new Map(listSqliteSessionEntriesFromDatabase(database, resolved, {
				...scope,
				clone: false
			}).map(({ sessionKey, entry }) => [sessionKey, entry])),
			database,
			options
		});
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Reads a session activity timestamp from the additive SQLite session store. */
function readSessionUpdatedAtCore(scope) {
	const resolved = resolveSqliteScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const row = readSessionEntryRow(database, resolved.sessionKey)?.row;
	return row ? coerceRequiredSqliteNumber(row.updated_at) : void 0;
}
/** Applies a partial entry update to the additive SQLite session store. */
async function upsertSessionEntryCore(scope, patch, options = {}) {
	return await patchSessionEntryCore(scope, () => patch, {
		...options,
		fallbackEntry: createFallbackSessionEntry(patch)
	});
}
/** Replaces one entry in the additive SQLite session store. */
async function replaceSessionEntry(scope, entry) {
	return await patchSessionEntryCore(scope, () => entry, {
		fallbackEntry: entry,
		replaceEntry: true
	});
}
/** Replaces one entry synchronously for sync session runtimes. */
function replaceSessionEntrySync(scope, entry) {
	const resolved = resolveSqliteScope(scope);
	assertCanonicalSessionWriteScope(resolved);
	runOpenClawAgentWriteTransaction((database) => {
		const { previous, current } = replaceSessionEntryInDatabase(database, resolved.sessionKey, entry);
		return prepareSessionIdentityPublication(database, resolved.agentId, previous, current);
	}, toDatabaseOptions(resolved))();
}
/** Patches one entry in the additive SQLite session store. */
async function patchSessionEntryCore(scope, update, options = {}) {
	return await patchSessionEntryInScope(scope, update, options);
}
async function patchSessionEntryInScope(scope, update, options, databaseAgentId) {
	const resolved = resolveSqliteScope(scope);
	if (databaseAgentId) resolved.databaseAgentId = databaseAgentId;
	assertCanonicalSessionWriteScope(resolved);
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry.patch",
		validateCanonicalKeys: options.replaceEntry !== true,
		options,
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
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry-target.patch",
		capturedSource: source,
		validateCanonicalKeys: true,
		options,
		readSnapshot: (database) => readLifecycleTargetSnapshot(database, scope.target),
		resolved: source ? {
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
		}),
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
		if (typeof captured.databaseIdentity === "string") assertExistingDatabaseIdentity(databasePath, `file:${captured.databaseIdentity}`);
		const current = database ?? getOpenClawAgentDatabaseIfOpen(databaseOptions);
		if (!current) {
			if (typeof captured.databaseIdentity === "symbol") throw new Error("Captured session database is no longer open");
			return;
		}
		const physical = readOpenClawAgentDatabaseIdentity(current);
		if (current.agentId !== captured.agentId || physical.identity !== captured.databaseIdentity || physical.birthtime !== captured.databaseBirthtime || !isOpenClawAgentDatabasePathCurrent(current)) throw new Error("Captured session database changed before update");
	};
	const assertCurrent = captured ? () => assertCapturedSource() : void 0;
	const withDatabase = (operation) => {
		assertCurrent?.();
		return !incognito && !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseAsync(databaseOptions, operation, assertCurrent) : operation();
	};
	let wrote = false;
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => withDatabase(async () => {
		const database = openOpenClawAgentDatabase(databaseOptions);
		assertCapturedSource(database);
		const prepared = params.readSnapshot(database);
		const existing = prepared[0]?.entry;
		const writeBase = existing ?? options.fallbackEntry;
		if (!writeBase) return null;
		const patch = await params.update(cloneSessionEntry(writeBase), { existingEntry: existing ? cloneSessionEntry(existing) : void 0 });
		const mergeBase = existing ? writeBase : void 0;
		const creationPatch = !existing && patch ? {
			...writeBase,
			...patch
		} : patch;
		const merged = !creationPatch ? void 0 : options.replaceEntry ? cloneSessionEntry(patch) : options.preserveActivity ? mergeSessionEntryPreserveActivity(mergeBase, creationPatch) : mergeSessionEntry(mergeBase, creationPatch);
		const next = !merged ? void 0 : options.replaceEntry ? merged : preserveSqliteSameKeySessionRolloverLineage({
			next: merged,
			previous: writeBase,
			sessionKey
		});
		return withDatabase(() => {
			let result = null;
			const publish = runOpenClawAgentWriteTransaction((writeDatabase) => {
				assertCapturedSource(writeDatabase);
				if (options.shouldCommit?.() === false) return;
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
			}, databaseOptions);
			try {
				if (next && result) options.onCommitted?.(cloneSessionEntry(result));
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
		const senderId = params.ctx.SenderId?.trim();
		return {
			...buildSessionCreationStamp(params.ctx.SessionCreation ?? {
				via: "channel",
				...senderId ? { actor: {
					type: "human",
					source: "channel",
					id: senderId
				} } : {}
			}),
			...metadataPatch
		};
	}, {
		preserveActivity: true,
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
		const senderId = params.ctx?.SenderId?.trim();
		return {
			...buildSessionCreationStamp(params.ctx?.SessionCreation ?? {
				via: "channel",
				...senderId ? { actor: {
					type: "human",
					source: "channel",
					id: senderId
				} } : {}
			}),
			...routePatch
		};
	}, {
		preserveActivity: true,
		...params.assertCommitAllowed ? { assertCommitAllowed: params.assertCommitAllowed } : {},
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	}, scope.databaseAgentId);
}
//#endregion
export { publishSystemEventStoreConfig as C, sessionEntryForkedFromParent as D, preserveSqliteSameKeySessionRolloverLineage as E, findSessionTranscriptArchiveEventReadOnly as O, captureSessionWatcherStorePaths as S, resolveSessionStorePathForScope as T, resolveSessionKeyBySessionId as _, listSessionEntryRows as a, upsertSessionEntryCore as b, loadSessionEntryForAdmission as c, patchSessionEntryCore as d, patchSessionEntryTarget as f, replaceSessionEntrySync as g, replaceSessionEntry as h, listSessionEntryKeysReadOnly as i, listSessionTranscriptArchivesReadOnly as k, loadSessionEntryReadOnly as l, recordInboundSessionMeta as m, listSessionChildEntriesReadOnly as n, listSessionTranscriptInstances as o, readSessionUpdatedAtCore as p, listSessionEntriesByStatus as r, loadSessionEntry as s, hasSessionEntriesByStatusReadOnly as t, loadSessionEntryReadOnlyInScope as u, updateSessionLastRoute as v, resolvePhysicalSessionStorePath as w, withSessionEntryReadOnlyScope as x, updateSessionLastRouteInScope as y };
