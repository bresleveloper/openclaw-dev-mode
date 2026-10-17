import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, d as sql, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as normalizeMainKey, r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, t as DEFAULT_AGENT_ID } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { a as normalizeExecTarget, c as resolveExecModeFromPolicy, i as normalizeExecSecurity, n as normalizeExecAsk } from "./exec-approvals-core-s7tTQC_a.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync, i as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { o as isOpenClawAgentDatabaseOpen, s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as sessionEntrySnapshotColumns, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { l as resolveSqliteTranscriptArchiveDirectory, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { p as setCanonicalSqliteSessionMainKey } from "./session-canonical-key-D1TSJMmX.mjs";
import { t as parseReadableSqliteSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-DDPEdabr.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { o as preserveCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { t as resolveAgentSessionDirs } from "./session-dirs-SATsXf4g.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { _ as deleteSessionMembersForRepair, h as copySessionNodeArtifactsForRepair } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { o as writeTranscriptArchive } from "./session-accessor.sqlite-archive-artifact-kIblIqSS.mjs";
import { a as loadSessionEntry, n as listSessionEntryKeysReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { a as rehomeSqliteSessionDeliveryReferencesForCanonicalRepair, n as ensureSqliteTranscriptGenerationsForCanonicalRepair, o as rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch, r as listSqliteSessionGenerationIdsForCanonicalRepair, t as copySqliteSessionOwnedStateForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-C-uEV7oa.mjs";
import { c as readSessionTranscriptMessageEventPage, s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { d as loadTranscriptEvents, v as listCanonicalSessionRepairFacts, x as scanDoctorSessionEntriesTolerant, y as loadCanonicalSessionRepairEntries } from "./session-accessor-CQ-g9yb2.mjs";
import { o as resolveStoredSessionKeyForAgentStore, r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import { g as applySessionEntryLifecycleMutation } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { m as resolveExecTarget } from "./bash-tools.exec-runtime-BETUcUuq.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-Dlr8j1Wl.mjs";
import { t as deriveGoalSessionTitle } from "./derive-goal-session-title-BLauWn3J.mjs";
import { r as sessionTitleRequests, t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { _ as listRegistryWorktreesForMigration } from "./registry-Bm5FVBwN.mjs";
import { o as resolveProjectRegistry } from "./project-registry-B7e5lNuh.mjs";
import { a as normalizeLegacyOpenAICodexTranscriptMetadata, i as hasBrokenPromptRewriteBranch, o as selectActivePath } from "./session-sqlite-transcript-verification-DB6gTRqH.mjs";
import { d as resolveTargetSqlitePath, i as projectExistingAgentDatabaseTargets, r as listExistingAgentDatabaseTargets, u as resolveTargetSqliteOptions } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import { i as withDoctorSqliteMaintenanceLock, t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-B-Ck8335.mjs";
import { t as formatSessionSqliteMigrationWarnings } from "./doctor-session-sqlite-warnings-C0LhVsyY.mjs";
import { n as createLegacyStateMigrationStepReceipt } from "./state-migrations.messages-CXxBVY0a.mjs";
import { a as repairAcpSessionMetaKeysForDoctor, i as runPostSessionPluginDoctorStateRepairs } from "./state-migrations.plugin-doctor-tedrDG_0.mjs";
import { n as runDoctorAgentDatabaseOperationAsync, t as runDoctorAgentDatabaseOperation } from "./doctor-agent-database-operation-BRnq84C6.mjs";
import { n as rewriteDoctorSessionEntries } from "./session-entry-rewrite-DKAVD8-B.mjs";
import { i as repairLegacySessionEntryStates, n as repairCanonicalSessionEntries, r as repairCanonicalSessionResolvedSkills, t as repairCanonicalSessionDeliveryStates } from "./doctor-session-delivery-state-CgusyV-z.mjs";
import { r as isInformationalMissingSessionIndex } from "./doctor-session-sqlite-types-CchNvmQZ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region src/config/sessions/transcript-jsonl.ts
function serializeJsonlLines(lines) {
	return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}
//#endregion
//#region src/commands/doctor-session-canonical-owner-evidence.ts
/** Projects transcript-owner evidence through aliases and indexes every proven source key. */
function applyCanonicalOwnerEvidence(inventory) {
	const bySessionKey = new Map(inventory.map((item) => [`${item.target.sqlitePath}\0${item.sessionKey}`, item]));
	const resolved = /* @__PURE__ */ new Map();
	const resolveCanonicalKey = (item) => {
		const seen = /* @__PURE__ */ new Set();
		let current = item;
		let canonicalKey;
		for (;;) {
			const cached = resolved.get(current);
			if (cached !== void 0) {
				canonicalKey = cached;
				break;
			}
			if (seen.has(current)) return current.canonicalKey;
			seen.add(current);
			const owner = current.canonicalOwnerSessionKey ? bySessionKey.get(`${current.target.sqlitePath}\0${current.canonicalOwnerSessionKey}`) : void 0;
			if (!owner) {
				canonicalKey = current.canonicalKey;
				break;
			}
			current = owner;
		}
		for (const visited of seen) resolved.set(visited, canonicalKey);
		return canonicalKey;
	};
	const canonicalKeysByStoredKey = /* @__PURE__ */ new Map();
	for (const item of inventory) {
		item.canonicalKey = resolveCanonicalKey(item);
		const ownerAgentId = parseAgentSessionKey(item.storedKey)?.agentId ?? item.target.agentId;
		for (const key of [item.sessionKey, item.storedKey]) for (const sqlitePath of [item.target.sqlitePath, "*"]) {
			const mappingKey = `${sqlitePath}\0${ownerAgentId}\0${key}`;
			const mapped = canonicalKeysByStoredKey.get(mappingKey) ?? /* @__PURE__ */ new Set();
			mapped.add(item.canonicalKey);
			canonicalKeysByStoredKey.set(mappingKey, mapped);
		}
	}
	return canonicalKeysByStoredKey;
}
//#endregion
//#region src/commands/doctor-session-canonical-candidates.ts
function listCanonicalSessionStores(params) {
	return projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env }), params.env, params.cfg);
}
function collectCanonicalSessionCandidateFacts(params, stores) {
	const defaultAgentRemoved = !listAgentIds(params.cfg).includes(DEFAULT_AGENT_ID);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const resolveStoredKey = (agentId, sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		const rest = normalizeLowercaseStringOrEmpty(parsed?.rest);
		const repairLegacyMainHead = defaultAgentRemoved && parsed?.agentId === "main" && normalizeAgentId(agentId) !== "main" && (rest === "main" || rest === mainKey);
		return resolveStoredSessionKeyForAgentStore({
			cfg: params.cfg,
			agentId,
			sessionKey,
			preserveQualifiedAddress: !repairLegacyMainHead
		});
	};
	const inventory = stores.flatMap((target) => listCanonicalSessionRepairFacts({
		agentId: target.agentId,
		storePath: target.storePath
	}).map((inventoryFact) => {
		const { canonicalOwnerSessionKey, sessionKey } = inventoryFact;
		const storedKey = resolveStoredKey(target.agentId, sessionKey);
		return {
			canonicalKey: storedKey ? resolveDeliveryProvenCanonicalSessionKey(storedKey, inventoryFact) : resolveAgentMainSessionKey({
				cfg: params.cfg,
				agentId: target.agentId
			}),
			canonicalOwnerSessionKey,
			inventoryFact,
			sessionKey,
			storedKey,
			target
		};
	}));
	const canonicalKeysByStoredKey = applyCanonicalOwnerEvidence(inventory);
	return inventory.map(({ canonicalKey, canonicalOwnerSessionKey, inventoryFact, sessionKey, target }) => {
		const canonicalAgentId = canonicalKey === "global" || canonicalKey === "unknown" ? target.agentId : resolveSessionStoreAgentId(params.cfg, canonicalKey);
		const canonicalizeLineageKey = (value) => {
			if (!value) return;
			const storedKey = resolveStoredKey(canonicalAgentId, value);
			const ownerAgentId = parseAgentSessionKey(storedKey)?.agentId ?? canonicalAgentId;
			for (const sqlitePath of [target.sqlitePath, "*"]) for (const key of [value, storedKey]) {
				const mapped = canonicalKeysByStoredKey.get(`${sqlitePath}\0${ownerAgentId}\0${key}`);
				if (mapped?.size === 1) return [...mapped][0];
			}
			return storedKey;
		};
		const parentSessionKey = canonicalizeLineageKey(inventoryFact.parentSessionKey);
		const spawnedBy = canonicalizeLineageKey(inventoryFact.spawnedBy);
		const forkSourceSessionKey = canonicalizeLineageKey(inventoryFact.forkSourceSessionKey);
		return Object.assign({
			agentId: target.agentId,
			canonicalKey,
			inventoryFact,
			lineageRepairRequired: parentSessionKey !== inventoryFact.parentSessionKey || spawnedBy !== inventoryFact.spawnedBy || forkSourceSessionKey !== inventoryFact.forkSourceSessionKey,
			ownerEvidenceOnly: canonicalOwnerSessionKey !== void 0,
			sessionKey,
			sqlitePath: target.sqlitePath,
			storePath: target.storePath
		}, forkSourceSessionKey ? { normalizedForkSourceSessionKey: forkSourceSessionKey } : {}, parentSessionKey ? { normalizedParentSessionKey: parentSessionKey } : {}, spawnedBy ? { normalizedSpawnedBy: spawnedBy } : {});
	});
}
function resolveCanonicalSessionDestination(params) {
	const agentId = params.canonicalKey === "global" || params.canonicalKey === "unknown" ? normalizeAgentId(params.sourceAgentId ?? resolveSessionStoreAgentId(params.cfg, params.canonicalKey)) : resolveSessionStoreAgentId(params.cfg, params.canonicalKey);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId,
		env: params.env
	});
	return {
		agentId,
		storePath,
		sqlitePath: resolveTargetSqlitePath({
			agentId,
			storePath
		})
	};
}
function groupRepairCandidates(candidates, params) {
	const byCanonicalKey = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const sentinelOwner = candidate.canonicalKey === "global" || candidate.canonicalKey === "unknown" ? candidate.agentId : "";
		const groupKey = `${candidate.canonicalKey}\0${sentinelOwner}`;
		const group = byCanonicalKey.get(groupKey) ?? [];
		group.push(candidate);
		byCanonicalKey.set(groupKey, group);
	}
	return [...byCanonicalKey.values()].flatMap((group) => {
		const first = group[0];
		const destination = resolveCanonicalSessionDestination({
			canonicalKey: first.canonicalKey,
			cfg: params.cfg,
			env: params.env,
			sourceAgentId: first.agentId
		});
		if (!(group.length > 1 || group.some((candidate) => candidate.inventoryFact.rawCompareRequired || candidate.lineageRepairRequired || candidate.sessionKey !== candidate.canonicalKey || candidate.sqlitePath !== destination.sqlitePath))) return [];
		const canonicalRowSurvives = group.some((candidate) => candidate.sqlitePath === destination.sqlitePath && candidate.sessionKey === candidate.canonicalKey);
		return [{
			candidates: group,
			removedRows: group.length - (canonicalRowSurvives ? 1 : 0)
		}];
	});
}
function collectCanonicalSessionRepairGroups(params, stores) {
	return groupRepairCandidates(collectCanonicalSessionCandidateFacts(params, stores), params);
}
//#endregion
//#region src/commands/doctor-session-canonical-keys.ts
function createCanonicalRepairRemoval(candidate, params) {
	const removal = {
		archiveRemovedTranscript: params.archiveRemovedTranscript,
		deleteOwnedWindows: params.deleteOwnedWindows,
		...params.deliveryCleanupKeys ? { deliveryCleanupKeys: params.deliveryCleanupKeys } : {},
		exactStoredKey: true,
		expectedEntry: candidate.expectedEntry,
		sessionKey: candidate.sessionKey
	};
	return candidate.rawEntryJson === void 0 ? removal : Object.assign(removal, {
		expectedRawEntryJson: candidate.rawEntryJson,
		expectedSnapshotRevision: candidate.rawSnapshotRevision
	});
}
const CANONICAL_SESSION_REPAIR_BATCH_GROUP_LIMIT = 64;
function hydrateCanonicalSessionCandidate(fact, loaded) {
	const entry = { ...loaded.entry };
	if (fact.normalizedParentSessionKey) entry.parentSessionKey = fact.normalizedParentSessionKey;
	else delete entry.parentSessionKey;
	if (fact.normalizedSpawnedBy) entry.spawnedBy = fact.normalizedSpawnedBy;
	else delete entry.spawnedBy;
	if (entry.forkSource && fact.normalizedForkSourceSessionKey) entry.forkSource = {
		...entry.forkSource,
		sessionKey: fact.normalizedForkSourceSessionKey
	};
	else if (entry.forkSource?.sessionKey !== void 0) {
		const { sessionKey: _invalidSessionKey, ...forkProvenance } = entry.forkSource;
		entry.forkSource = forkProvenance;
	}
	const candidate = {
		agentId: fact.agentId,
		canonicalKey: fact.canonicalKey,
		entry,
		expectedEntry: loaded.entry,
		ownerEvidenceOnly: fact.ownerEvidenceOnly,
		sessionKey: fact.sessionKey,
		sqlitePath: fact.sqlitePath,
		storePath: fact.storePath
	};
	return loaded.rawEntryJson !== void 0 ? {
		...candidate,
		rawEntryJson: loaded.rawEntryJson,
		rawSnapshotRevision: loaded.rawSnapshotRevision
	} : candidate;
}
function hydrateCanonicalSessionCandidates(facts) {
	const loaded = /* @__PURE__ */ new Map();
	const byStore = /* @__PURE__ */ new Map();
	for (const fact of facts) {
		const key = `${fact.agentId}\0${fact.storePath}`;
		byStore.set(key, [...byStore.get(key) ?? [], fact]);
	}
	for (const group of byStore.values()) {
		const first = group[0];
		const entries = loadCanonicalSessionRepairEntries({
			agentId: first.agentId,
			storePath: first.storePath
		}, group.map((fact) => fact.inventoryFact));
		group.forEach((fact, index) => loaded.set(fact, entries[index]));
	}
	return facts.map((fact) => hydrateCanonicalSessionCandidate(fact, loaded.get(fact)));
}
function mergeCanonicalSessionEntryCandidates(candidates) {
	let selected;
	for (const candidate of candidates) {
		const incomingUpdatedAt = typeof candidate.entry.updatedAt === "number" && Number.isFinite(candidate.entry.updatedAt) ? candidate.entry.updatedAt : 0;
		const selectedUpdatedAt = typeof selected?.entry.updatedAt === "number" && Number.isFinite(selected.entry.updatedAt) ? selected.entry.updatedAt : 0;
		if (!selected || incomingUpdatedAt > selectedUpdatedAt || incomingUpdatedAt === selectedUpdatedAt && (candidate.preferred === true ? !selected.preferred : !selected.preferred && Buffer.compare(Buffer.from(JSON.stringify(candidate.entry), "utf8"), Buffer.from(JSON.stringify(selected.entry), "utf8")) > 0)) selected = {
			entry: structuredClone(candidate.entry),
			preferred: candidate.preferred === true,
			winner: candidate.value
		};
	}
	return selected;
}
function selectCanonicalSessionCandidate(candidates, params) {
	const first = candidates[0];
	if (!first) return;
	const destination = resolveCanonicalSessionDestination({
		canonicalKey: first.canonicalKey,
		cfg: params.cfg,
		env: params.env,
		sourceAgentId: first.agentId
	});
	const rankedCandidates = candidates.toSorted((left, right) => Buffer.compare(Buffer.from(`${left.sqlitePath}\0${left.sessionKey}`, "utf8"), Buffer.from(`${right.sqlitePath}\0${right.sessionKey}`, "utf8"))).map((candidate) => ({
		entry: candidate.entry,
		preferred: candidate.sqlitePath === destination.sqlitePath && candidate.sessionKey === candidate.canonicalKey,
		value: candidate
	}));
	const metadataCandidates = rankedCandidates.filter(({ value }) => !value.ownerEvidenceOnly);
	const selected = mergeCanonicalSessionEntryCandidates(metadataCandidates.length > 0 ? metadataCandidates : rankedCandidates);
	if (!selected) return;
	const requiredCandidates = rankedCandidates.filter(({ entry }) => entry.sandbox === "required");
	const authoritativeStamp = requiredCandidates.find(({ preferred }) => preferred)?.entry ?? mergeCanonicalSessionEntryCandidates(requiredCandidates)?.entry;
	return {
		...selected,
		entry: preserveCreationStamp(selected.entry, authoritativeStamp),
		destination
	};
}
function resolveSingleDatabaseCanonicalRepairGroup(candidates, params) {
	const selected = selectCanonicalSessionCandidate(candidates, params);
	if (!selected || selected.winner.sqlitePath !== selected.destination.sqlitePath || candidates.some((candidate) => candidate.sqlitePath !== selected.destination.sqlitePath)) return;
	return {
		candidates,
		selected
	};
}
function createCanonicalDestinationRemovals(candidates, selected) {
	const relatedSessionIds = new Set([selected.entry.sessionId, selected.entry.previousSessionId].filter((value) => typeof value === "string" && value.length > 0));
	return candidates.filter((candidate) => candidate.sessionKey !== selected.winner.canonicalKey || candidate.rawEntryJson !== void 0).map((candidate) => createCanonicalRepairRemoval(candidate, {
		archiveRemovedTranscript: !relatedSessionIds.has(candidate.entry.sessionId),
		deleteOwnedWindows: false
	}));
}
function listCanonicalDestinationAliasKeys(destinationStore, winner) {
	return destinationStore.map((candidate) => candidate.sessionKey).filter((sessionKey) => sessionKey !== winner.canonicalKey);
}
function applyCanonicalDestinationArtifacts(params) {
	replaceSessionOwnerInTransaction(params.database, params.winner.canonicalKey, params.winner.entry.owner);
	const destinationAliasKeys = listCanonicalDestinationAliasKeys(params.destinationStore, params.winner);
	if (destinationAliasKeys.length > 0) {
		if (params.rehomeDeliveries) rehomeSqliteSessionDeliveryReferencesForCanonicalRepair(params.database, params.winner.canonicalKey, destinationAliasKeys);
		copySessionNodeArtifactsForRepair(params.database, params.database, destinationAliasKeys, params.winner.canonicalKey, { includeMembers: false });
	}
	if (!params.copyWinnerAlias || params.winner.sessionKey === params.winner.canonicalKey) return;
	deleteSessionMembersForRepair(params.database, params.winner.canonicalKey);
	copySessionNodeArtifactsForRepair(params.database, params.database, [params.winner.sessionKey], params.winner.canonicalKey, { includeParticipants: false });
}
async function repairCanonicalSessionGroupsInSingleDatabase(groups) {
	const first = groups[0];
	if (!first) return [];
	await ensureSqliteTranscriptGenerationsForCanonicalRepair(groups.flatMap((group) => group.candidates));
	const destination = first.selected.destination;
	return (await applySessionEntryLifecycleMutation({
		agentId: destination.agentId,
		allowCanonicalRepair: true,
		afterUpsertsInTransaction: (database) => {
			rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, groups.map((group) => ({
				canonicalKey: group.selected.winner.canonicalKey,
				previousKeys: listCanonicalDestinationAliasKeys(group.candidates, group.selected.winner)
			})));
			for (const group of groups) applyCanonicalDestinationArtifacts({
				copyWinnerAlias: true,
				database,
				destinationStore: group.candidates,
				rehomeDeliveries: false,
				winner: group.selected.winner
			});
		},
		removals: groups.flatMap((group) => createCanonicalDestinationRemovals(group.candidates, group.selected)),
		skipMaintenance: true,
		storePath: destination.storePath,
		upserts: groups.map((group) => ({
			entry: group.selected.entry,
			sessionKey: group.selected.winner.canonicalKey
		}))
	})).archivedTranscriptDirectories;
}
async function repairCanonicalSessionGroup(candidates, params) {
	const selected = selectCanonicalSessionCandidate(candidates, params);
	if (!selected) return [];
	await ensureSqliteTranscriptGenerationsForCanonicalRepair(candidates);
	const winner = selected.winner;
	const destination = selected.destination;
	const byDatabase = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const group = byDatabase.get(candidate.sqlitePath) ?? [];
		group.push(candidate);
		byDatabase.set(candidate.sqlitePath, group);
	}
	const destinationStore = byDatabase.get(destination.sqlitePath) ?? [];
	const preArchivedDirectories = [];
	if (winner.sqlitePath !== destination.sqlitePath) {
		const generationIds = /* @__PURE__ */ new Set([...listSqliteSessionGenerationIdsForCanonicalRepair({
			agentId: winner.agentId,
			canonicalKey: winner.canonicalKey,
			sourceKeys: [winner.sessionKey],
			storePath: winner.storePath
		}), ...collectSessionStateIdsForEntry(winner.entry)]);
		for (const sessionId of generationIds) {
			if (!sessionId) continue;
			const destinationCollision = destinationStore.find((candidate) => candidate.entry.sessionId === sessionId);
			const [destinationEvents, sourceEvents] = await Promise.all([loadTranscriptEvents({
				agentId: destinationCollision?.agentId ?? destination.agentId,
				sessionId,
				sessionKey: destinationCollision?.sessionKey ?? winner.canonicalKey,
				storePath: destinationCollision?.storePath ?? destination.storePath
			}), loadTranscriptEvents({
				agentId: winner.agentId,
				sessionId,
				sessionKey: winner.sessionKey,
				storePath: winner.storePath
			})]);
			const destinationContent = serializeJsonlLines(destinationEvents.map((event) => JSON.stringify(event)));
			const sourceContent = serializeJsonlLines(sourceEvents.map((event) => JSON.stringify(event)));
			if (!destinationContent || destinationContent === sourceContent) continue;
			const archiveDirectory = resolveSqliteTranscriptArchiveDirectory({
				agentId: destination.agentId,
				env: params.env,
				path: destination.sqlitePath
			});
			writeTranscriptArchive({
				archiveDirectory,
				content: destinationContent,
				reason: "deleted",
				sessionId
			});
			if (!preArchivedDirectories.includes(archiveDirectory)) preArchivedDirectories.push(archiveDirectory);
		}
	}
	setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase(resolveTargetSqliteOptions(destination, params.env)), params.cfg.session?.mainKey);
	const winnerResult = await applySessionEntryLifecycleMutation({
		agentId: destination.agentId,
		allowCanonicalRepair: true,
		afterUpsertsInTransaction: (destinationDatabase) => {
			applyCanonicalDestinationArtifacts({
				copyWinnerAlias: winner.sqlitePath === destination.sqlitePath,
				database: destinationDatabase,
				destinationStore,
				rehomeDeliveries: true,
				winner
			});
			if (winner.sqlitePath !== destination.sqlitePath) copySqliteSessionOwnedStateForCanonicalRepair({
				canonicalKey: winner.canonicalKey,
				destinationDatabase,
				preferredEntry: selected.entry,
				preferredSessionKey: winner.sessionKey,
				source: winner,
				sourceEntries: [winner.entry],
				sourceKeys: [winner.sessionKey]
			});
		},
		removals: createCanonicalDestinationRemovals(destinationStore, selected),
		skipMaintenance: true,
		storePath: destination.storePath,
		upserts: [{
			entry: selected.entry,
			sessionKey: winner.canonicalKey
		}]
	});
	const archivedDirectories = /* @__PURE__ */ new Set([...preArchivedDirectories, ...winnerResult.archivedTranscriptDirectories]);
	for (const [sqlitePath, storeCandidates] of byDatabase) {
		if (sqlitePath === destination.sqlitePath) continue;
		const storeCandidate = storeCandidates[0];
		const result = await applySessionEntryLifecycleMutation({
			agentId: storeCandidate.agentId,
			allowCanonicalRepair: true,
			removals: storeCandidates.map((candidate) => createCanonicalRepairRemoval(candidate, {
				archiveRemovedTranscript: true,
				deleteOwnedWindows: true,
				deliveryCleanupKeys: [winner.canonicalKey]
			})),
			skipMaintenance: true,
			storePath: storeCandidate.storePath
		});
		for (const directory of result.archivedTranscriptDirectories) archivedDirectories.add(directory);
	}
	return [...archivedDirectories];
}
/** Doctor-owned durable repair; process-held incognito databases are intentionally excluded. */
async function repairCanonicalSessionKeys(params) {
	const env = params.env ?? process.env;
	const stores = listCanonicalSessionStores({
		cfg: params.cfg,
		env
	});
	const archivedTranscriptDirectories = /* @__PURE__ */ new Set();
	let repairBatches = 0;
	let repairedGroups = 0;
	if (params.apply) for (const store of stores) setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase(resolveTargetSqliteOptions(store, env)), params.cfg.session?.mainKey);
	let repairGroups = collectCanonicalSessionRepairGroups({
		cfg: params.cfg,
		env
	}, stores);
	const foundGroups = repairGroups.length;
	const removedRows = repairGroups.reduce((total, group) => total + group.removedRows, 0);
	if (params.apply) while (repairGroups.length > 0) {
		const candidateGroups = repairGroups.slice(0, CANONICAL_SESSION_REPAIR_BATCH_GROUP_LIMIT);
		const hydrated = hydrateCanonicalSessionCandidates(candidateGroups.flatMap((candidateGroup) => candidateGroup.candidates));
		let hydratedOffset = 0;
		const hydratedGroups = candidateGroups.map((candidateGroup) => {
			const candidates = hydrated.slice(hydratedOffset, hydratedOffset + candidateGroup.candidates.length);
			hydratedOffset += candidateGroup.candidates.length;
			return candidates;
		});
		const candidates = hydratedGroups[0];
		const singleDatabaseGroup = resolveSingleDatabaseCanonicalRepairGroup(candidates, {
			cfg: params.cfg,
			env
		});
		if (!singleDatabaseGroup) {
			for (const directory of await repairCanonicalSessionGroup(candidates, {
				cfg: params.cfg,
				env
			})) archivedTranscriptDirectories.add(directory);
			repairBatches += 1;
			repairedGroups += 1;
			repairGroups = collectCanonicalSessionRepairGroups({
				cfg: params.cfg,
				env
			}, stores);
			continue;
		}
		const batch = [singleDatabaseGroup];
		for (const nextCandidates of hydratedGroups.slice(1)) {
			const nextSingleDatabaseGroup = resolveSingleDatabaseCanonicalRepairGroup(nextCandidates, {
				cfg: params.cfg,
				env
			});
			if (!nextSingleDatabaseGroup || nextSingleDatabaseGroup.selected.destination.sqlitePath !== singleDatabaseGroup.selected.destination.sqlitePath) break;
			batch.push(nextSingleDatabaseGroup);
		}
		for (const directory of await repairCanonicalSessionGroupsInSingleDatabase(batch)) archivedTranscriptDirectories.add(directory);
		repairBatches += 1;
		repairedGroups += batch.length;
		repairGroups = collectCanonicalSessionRepairGroups({
			cfg: params.cfg,
			env
		}, stores);
	}
	return {
		archivedTranscriptDirectories: [...archivedTranscriptDirectories].toSorted(),
		foundGroups,
		repairBatches,
		removedRows,
		repairedGroups,
		scannedStores: stores.length
	};
}
//#endregion
//#region src/commands/doctor-session-exec-policy.ts
/** Retires session exec overrides without granting the full-mode approval-floor bypass. */
function repairLegacySessionExecPolicy(params) {
	const messages = [];
	repairCanonicalSessionEntries({
		...params,
		updateDeliveryProjection: false,
		transform(entry, sessionKey, phase) {
			const { execSecurity, execAsk, ...next } = entry;
			if (execSecurity === void 0 && execAsk === void 0) return entry;
			let ask = normalizeExecAsk(execAsk);
			if (!next.permissionMode) {
				const agentId = resolveSessionAgentId({
					sessionKey,
					config: params.cfg
				});
				const globalExec = params.cfg.tools?.exec;
				const agentExec = resolveAgentConfig(params.cfg, agentId)?.tools?.exec;
				const { effectiveHost } = resolveExecTarget({
					configuredTarget: normalizeExecTarget(entry.execHost) ?? agentExec?.host ?? globalExec?.host,
					elevatedRequested: false,
					sandboxRequired: entry.sandbox === "required",
					sandboxAvailable: true
				});
				const base = applyExecPolicyLayer(applyExecPolicyLayer({
					security: effectiveHost === "sandbox" ? "deny" : "full",
					ask: "off"
				}, globalExec), agentExec);
				ask ??= base.ask;
				const mode = resolveExecModeFromPolicy({
					security: normalizeExecSecurity(execSecurity) ?? base.security,
					ask
				});
				next.permissionMode = ask === "always" ? "read-only" : mode === "full" ? void 0 : SESSION_PERMISSION_BY_EXEC_MODE[mode];
			}
			if (phase === (params.apply ? "repair" : "scan")) {
				const outcome = next.permissionMode ? `${entry.permissionMode ? "kept" : "set"} permissionMode=${next.permissionMode}${ask === "always" && !entry.permissionMode ? " (ask=always has no mode equivalent; choose guarded or workspace to allow commands again)" : ""}` : "config default applies; full permission mode was not granted";
				messages.push(`- ${sessionKey}: ${params.apply ? "removed" : "would remove"} legacy exec policy; ${outcome}.`);
			}
			return next;
		}
	});
	if (messages.length > 0) {
		if (!params.apply) messages.push("- Run \"openclaw doctor --fix\" to migrate legacy session exec policy.");
		note(messages.join("\n"), "Session exec policy");
	}
}
//#endregion
//#region src/commands/doctor-session-incognito-key-repair-state.ts
const REPAIR_JOURNAL_SCOPE = "doctor-session-key-migration";
const REPAIR_JOURNAL_KEY = "reserved-incognito-v1";
function listTuiLastSessionStateRows(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "like", "tui.lastSession.%")).rows;
}
function sqliteSchemaIdentifier(value) {
	return sql.id(value);
}
function listSharedStateSessionKeyColumns(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "not like", "sqlite_%")).rows.flatMap(({ name: table }) => {
		return executeSqliteQuerySync(database, db.selectFrom(sql`pragma_table_info(${table})`.as("pragma_columns")).select(sql`name`.as("name"))).rows.flatMap(({ name: column }) => {
			if (column === "session_key" || column.endsWith("_session_key")) return [{
				table,
				column,
				json: false
			}];
			return column.endsWith("_session_keys_json") ? [{
				table,
				column,
				json: true
			}] : [];
		});
	});
}
function collectSharedStateSessionKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	for (const { table, column, json } of listSharedStateSessionKeyColumns(database)) {
		const columnId = sqliteSchemaIdentifier(column);
		const rows = executeSqliteQuerySync(database, db.selectFrom(sql`${sqliteSchemaIdentifier(table)}`.as("session_key_table")).select(columnId.as("value")).where(columnId, "is not", null)).rows;
		for (const { value } of rows) if (!json && typeof value === "string") keys.add(value);
		else if (json && typeof value === "string") try {
			collectJsonStringValues(JSON.parse(value), keys);
		} catch {}
	}
	for (const row of listTuiLastSessionStateRows(database)) {
		const sessionKey = JSON.parse(row.value_json);
		if (typeof sessionKey === "string") keys.add(sessionKey);
	}
	return keys;
}
function rewriteSharedStateSessionKeys(database, renames) {
	const db = getNodeSqliteKysely(database);
	const rowId = sql`rowid`;
	for (const { table, column, json } of listSharedStateSessionKeyColumns(database)) {
		const tableId = sqliteSchemaIdentifier(table);
		const columnId = sqliteSchemaIdentifier(column);
		if (!json) {
			for (const [from, to] of renames) executeSqliteQuerySync(database, db.updateTable(sql`${tableId}`.as("session_key_table")).set(columnId, to).where(columnId, "=", from));
			continue;
		}
		const rows = executeSqliteQuerySync(database, db.selectFrom(sql`${tableId}`.as("session_key_table")).select([rowId.as("rowid"), columnId.as("value")])).rows;
		for (const row of rows) {
			if (typeof row.value !== "string") continue;
			let parsed;
			try {
				parsed = JSON.parse(row.value);
			} catch {
				continue;
			}
			const rewritten = JSON.stringify(replaceSessionKeyReferences(parsed, renames));
			if (rewritten !== row.value) executeSqliteQuerySync(database, db.updateTable(sql`${tableId}`.as("session_key_table")).set(columnId, rewritten).where(rowId, "=", row.rowid));
		}
	}
	const stateDb = getNodeSqliteKysely(database);
	for (const row of listTuiLastSessionStateRows(database)) {
		const sessionKey = JSON.parse(row.value_json);
		const renamedKey = typeof sessionKey === "string" ? renames.get(sessionKey) : void 0;
		if (renamedKey) executeSqliteQuerySync(database, stateDb.updateTable("config_machine_state").set({ value_json: JSON.stringify(renamedKey) }).where("state_key", "=", row.state_key));
	}
}
function collectJsonStringValues(value, values) {
	if (typeof value === "string") {
		values.add(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectJsonStringValues(item, values);
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const item of Object.values(value)) collectJsonStringValues(item, values);
}
function readRepairJournal(database) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("state_leases").select("payload_json").where("scope", "=", REPAIR_JOURNAL_SCOPE).where("lease_key", "=", REPAIR_JOURNAL_KEY));
	if (!row?.payload_json) return [];
	const parsed = JSON.parse(row.payload_json);
	if (parsed.version !== 1 || !Array.isArray(parsed.renames)) throw new Error("Invalid reserved incognito session key repair journal");
	return parsed.renames.map((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.from !== "string" || typeof item.to !== "string") throw new Error("Invalid reserved incognito session key repair journal entry");
		return {
			from: item.from,
			to: item.to
		};
	});
}
function readRepairJournalReadOnly(env) {
	return withExistingOpenClawStateDatabaseReadOnly((database) => readRepairJournal(database.db), { env }) ?? [];
}
function writeRepairJournal(database, renames) {
	const now = Date.now();
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.insertInto("state_leases").values({
		scope: REPAIR_JOURNAL_SCOPE,
		lease_key: REPAIR_JOURNAL_KEY,
		owner: "openclaw-doctor",
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			version: 1,
			renames
		}),
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doUpdateSet({
		owner: "openclaw-doctor",
		payload_json: JSON.stringify({
			version: 1,
			renames
		}),
		updated_at: now
	})));
}
function deleteRepairJournal(database) {
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.deleteFrom("state_leases").where("scope", "=", REPAIR_JOURNAL_SCOPE).where("lease_key", "=", REPAIR_JOURNAL_KEY));
}
function replaceSessionKeyReferences(value, renames) {
	if (typeof value === "string") return renames.get(value) ?? value;
	if (Array.isArray(value)) return value.map((item) => replaceSessionKeyReferences(item, renames));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceSessionKeyReferences(item, renames)]));
}
//#endregion
//#region src/commands/doctor-session-incognito-key-repair.ts
async function repairReservedIncognitoSessionKeys(params) {
	const targets = (params.targets ?? listExistingAgentDatabaseTargets(params.cfg, params.env)).map((target) => ({
		target,
		databaseOptions: resolveTargetSqliteOptions(target, params.env)
	}));
	const reservedKeys = /* @__PURE__ */ new Set();
	const sharedDatabase = params.apply ? openOpenClawStateDatabase({ env: params.env }) : void 0;
	const journalRenames = sharedDatabase ? readRepairJournal(sharedDatabase.db) : readRepairJournalReadOnly(params.env);
	const collectAgentKeys = (keys, read) => {
		for (const { target, databaseOptions } of targets) {
			const operation = runDoctorAgentDatabaseOperation({
				agentId: target.agentId,
				path: target.sqlitePath,
				run: () => withOpenClawAgentDatabaseReadOnly((database) => read(database.db), databaseOptions)
			});
			if (operation.ok && operation.value.found) for (const key of operation.value.value) keys.add(key);
		}
	};
	collectAgentKeys(reservedKeys, listReservedIncognitoKeys);
	const pendingKeys = new Set(reservedKeys);
	for (const rename of journalRenames) pendingKeys.add(rename.from);
	if (!params.apply) return {
		found: pendingKeys.size,
		repaired: 0
	};
	if (reservedKeys.size === 0 && journalRenames.length === 0) return {
		found: 0,
		repaired: 0
	};
	const occupiedKeys = sharedDatabase ? collectSharedStateSessionKeys(sharedDatabase.db) : /* @__PURE__ */ new Set();
	collectAgentKeys(occupiedKeys, collectOccupiedSessionKeys);
	for (const rename of journalRenames) occupiedKeys.add(rename.to);
	const journalSources = new Set(journalRenames.map((rename) => rename.from));
	const newRenames = planReservedIncognitoKeyRenames([...reservedKeys].filter((key) => !journalSources.has(key)).toSorted(), occupiedKeys);
	const renames = [...journalRenames, ...newRenames];
	const renameMap = new Map(renames.map((item) => [item.from, item.to]));
	runOpenClawStateWriteTransaction((database) => writeRepairJournal(database.db, renames), { env: params.env }, { operationLabel: "doctor.journal-reserved-incognito-session-keys" });
	runOpenClawStateWriteTransaction((database) => rewriteSharedStateSessionKeys(database.db, renameMap), { env: params.env }, { operationLabel: "doctor.rename-reserved-incognito-shared-state-keys" });
	for (const { target, databaseOptions } of targets) {
		const wasOpen = isOpenClawAgentDatabaseOpen(target.sqlitePath);
		try {
			runOpenClawAgentWriteTransaction((database) => applyReservedIncognitoKeyRenameColumns(database, renames), databaseOptions, { operationLabel: "doctor.rename-reserved-incognito-session-keys" });
			rewriteDoctorSessionEntries({
				scope: {
					agentId: target.agentId,
					env: params.env,
					storePath: target.storePath
				},
				sessionKeys: await listSessionEntryKeysReadOnly({
					agentId: target.agentId,
					env: params.env,
					storePath: target.storePath
				}),
				transform: (entry) => rewriteSessionEntryKeyFields(entry, renameMap)
			});
		} finally {
			if (!wasOpen) closeOpenClawAgentDatabaseByPath(target.sqlitePath);
		}
	}
	runOpenClawStateWriteTransaction((database) => deleteRepairJournal(database.db), { env: params.env }, { operationLabel: "doctor.complete-reserved-incognito-session-keys" });
	return {
		found: pendingKeys.size,
		repaired: renames.length
	};
}
function planReservedIncognitoKeyRenames(keys, occupied) {
	return keys.map((key) => {
		const base = legacyIncognitoSessionKey(key);
		if (parseAgentSessionKey(key)?.rest.startsWith("internal-session-effects:") && occupied.has(base)) throw new Error(`Cannot repair internal session key because ${base} already exists`);
		let candidate = base;
		let suffix = 1;
		while (occupied.has(candidate)) {
			candidate = `${base}-${suffix}`;
			suffix += 1;
		}
		occupied.add(candidate);
		return {
			from: key,
			to: candidate
		};
	});
}
function applyReservedIncognitoKeyRenameColumns(database, renames) {
	if (renames.length === 0) return;
	database.db.exec("PRAGMA defer_foreign_keys = ON;");
	for (const rename of renames) {
		const affected = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").where((eb) => eb.or([
			eb("session_key", "=", rename.from),
			eb("parent_session_key", "=", rename.from),
			eb("spawned_by", "=", rename.from),
			eb("fork_source_session_key", "=", rename.from)
		]))).rows;
		updateSessionKeyColumns(database.db, rename);
		for (const sessionKey of /* @__PURE__ */ new Set([rename.to, ...affected.map((row) => row.session_key)])) publishSessionEntryCacheInvalidation(database, { sessionKey });
	}
}
function legacyIncognitoSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || !isIncognitoSessionKey(sessionKey)) throw new Error(`Cannot rename non-incognito session key: ${sessionKey}`);
	return `agent:${parsed.agentId}:${parsed.rest.replace(":incognito-", ":legacy-incognito-")}`;
}
function listReservedIncognitoKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	for (const table of ["session_nodes", "session_windows"]) for (const row of executeSqliteQuerySync(database, db.selectFrom(table).select("session_key")).rows) keys.add(row.session_key);
	return [...keys].filter(isIncognitoSessionKey).toSorted();
}
function collectOccupiedSessionKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	const collectColumns = (query) => {
		for (const row of executeSqliteQuerySync(database, query).rows) for (const value of Object.values(row)) if (value) keys.add(value);
	};
	collectColumns(db.selectFrom("session_windows").select([
		"session_key",
		"parent_session_key",
		"spawned_by"
	]));
	collectColumns(db.selectFrom("session_nodes").select([
		"session_key",
		"parent_session_key",
		"spawned_by",
		"fork_source_session_key"
	]));
	collectColumns(db.selectFrom("conversation_deliveries").select("source_session_key"));
	for (const row of iterateSqliteQuerySync(database, db.selectFrom("session_nodes").select("entry_json").select(sessionEntrySnapshotColumns))) try {
		const entry = JSON.parse(row.entry_json);
		if (isRecord(entry)) collectSessionEntryKeyFields(attachSessionEntrySnapshots(entry, row), keys);
	} catch {}
	collectColumns(db.selectFrom("board_tabs").select("session_key"));
	collectColumns(db.selectFrom("board_widgets").select("session_key"));
	collectColumns(db.selectFrom("heartbeat_outcomes").select(["session_key", "run_session_key"]));
	return keys;
}
function updateSessionKeyColumns(database, rename) {
	const db = getNodeSqliteKysely(database);
	for (const [table, column] of [
		["session_windows", "session_key"],
		["session_windows", "parent_session_key"],
		["session_windows", "spawned_by"],
		["session_nodes", "session_key"],
		["session_entry_snapshots", "session_key"],
		["session_nodes", "parent_session_key"],
		["session_nodes", "spawned_by"],
		["session_nodes", "fork_source_session_key"],
		["conversation_deliveries", "source_session_key"],
		["session_members", "session_key"],
		["board_tabs", "session_key"],
		["board_widgets", "session_key"],
		["heartbeat_outcomes", "session_key"],
		["heartbeat_outcomes", "run_session_key"]
	]) executeSqliteQuerySync(database, db.updateTable(table).set(column, rename.to).where(column, "=", rename.from));
}
function rewriteSessionEntryKeyFields(value, renames) {
	visitSessionEntryKeyFields(value, (record, key) => {
		const current = record[key];
		if (typeof current === "string") record[key] = renames.get(current) ?? current;
	});
	return value;
}
function collectSessionEntryKeyFields(value, keys) {
	visitSessionEntryKeyFields(value, (record, key) => {
		const current = record[key];
		if (typeof current === "string") keys.add(current);
	});
}
function visitSessionEntryKeyFields(value, visit) {
	if (!isRecord(value)) return;
	for (const key of [
		"heartbeatIsolatedBaseSessionKey",
		"spawnedBy",
		"completionOwnerSessionKey",
		"parentSessionKey"
	]) visit(value, key);
	if (isRecord(value.forkSource)) visit(value.forkSource, "sessionKey");
	if (Array.isArray(value.compactionCheckpoints)) {
		for (const checkpoint of value.compactionCheckpoints) if (isRecord(checkpoint)) visit(checkpoint, "sessionKey");
	}
	if (isRecord(value.systemPromptReport)) visit(value.systemPromptReport, "sessionKey");
}
//#endregion
//#region src/commands/doctor-session-title-repair.ts
function readLegacySessionTitle(scope) {
	try {
		const { totalMessages } = readSessionTranscriptMessageEventPage(scope, {
			maxMessages: 0,
			offset: 0
		});
		if (!totalMessages) return;
		const head = readSessionTranscriptBoundedMessageTailPage(scope, {
			maxMessages: 100,
			maxBytes: 65536,
			offset: Math.max(0, totalMessages - 100)
		});
		if (head.totalMessages !== totalMessages || head.events.length !== head.scannedMessages) return;
		for (const event of head.events) {
			const message = asOptionalRecord(sqliteMessageEventWithSeq(event));
			const projected = projectSessionDisplayMessage(message);
			if (projected?.role === "user" && !hasInterSessionUserProvenance(message)) {
				const displayName = deriveGoalSessionTitle(projected.text);
				return displayName ? {
					displayName,
					generation: head.snapshot.generation ?? null
				} : void 0;
			}
		}
		return;
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error) || error instanceof SessionTranscriptColdError) return;
		throw error;
	}
}
/** Derive missing historical titles while Doctor owns session maintenance. */
async function repairLegacySessionTitles(params) {
	const authority = params.authority;
	const assertRepairAuthority = () => {
		if (!authority) throw new Error("Session title repair requires Doctor maintenance ownership.");
		authority.assertCurrent();
	};
	if (params.apply) assertRepairAuthority();
	const report = {
		found: 0,
		repaired: 0,
		scannedStores: 0,
		warnings: []
	};
	for (const target of params.targets ?? listExistingAgentDatabaseTargets(params.cfg, params.env)) {
		if (params.apply) assertRepairAuthority();
		report.scannedStores++;
		const scope = {
			agentId: target.agentId,
			storePath: target.storePath,
			env: params.env
		};
		const scan = runDoctorAgentDatabaseOperation({
			agentId: target.agentId,
			path: target.sqlitePath,
			run: () => {
				const keys = [];
				scanDoctorSessionEntriesTolerant(scope, ({ entry, sessionKey, recoveredFromProjections }) => {
					if (!recoveredFromProjections && !entry.incognito && !isIncognitoSessionKey(sessionKey) && entry.status !== "running" && !hasExplicitSessionName(entry)) keys.push(sessionKey);
				});
				return keys;
			}
		});
		if (!scan.ok) continue;
		for (const sessionKey of scan.value) {
			if (params.apply) assertRepairAuthority();
			try {
				const entry = loadSessionEntry({
					...scope,
					sessionKey
				});
				if (!entry || entry.incognito || entry.status === "running" || hasExplicitSessionName(entry)) continue;
				const session = {
					...scope,
					sessionKey,
					sessionId: entry.sessionId,
					sessionEntry: entry
				};
				if (sessionTitleRequests.get(session)) continue;
				const title = readLegacySessionTitle(session);
				if (!title) continue;
				report.found++;
				if (!params.apply) continue;
				await patchSessionEntryCore(session, (current) => current.sessionId === entry.sessionId && current.lifecycleRevision === entry.lifecycleRevision && current.status !== "running" && !current.incognito && !hasExplicitSessionName(current) ? { displayName: Buffer.from(title.displayName, "utf16le").toString("utf16le") } : null, {
					preserveActivity: true,
					skipMaintenance: true,
					assertCommitAllowed: assertRepairAuthority,
					shouldCommit: () => !sessionTitleRequests.get(session) && readSessionTranscriptWatermark(session).generation === title.generation,
					onCommitted: () => {
						report.repaired++;
					}
				});
				assertRepairAuthority();
			} catch (error) {
				if (params.apply) assertRepairAuthority();
				report.warnings.push(`Could not repair the title for ${sessionKey}: ${String(error)}`);
			}
		}
	}
	return report;
}
//#endregion
//#region src/config/sessions/worktree-workspace-migration.ts
function isInside(root, target) {
	const relative = path.relative(root, target);
	return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
}
async function resolveLegacyCanonicalWorkspace(params) {
	const worktree = params.entry.worktree;
	if (!worktree || worktree.canonicalWorkspaceDir) return;
	const recordedRepoRoot = path.resolve(worktree.repoRoot);
	if (params.entry.projectId) {
		const project = await resolveProjectRegistry(params.cfg, params.entry.projectId, { env: params.env });
		const projectRoot = project ? path.resolve(project.repoRoot) : void 0;
		return projectRoot && isInside(recordedRepoRoot, projectRoot) ? projectRoot : void 0;
	}
	const record = params.worktrees.find((candidate) => candidate.id === worktree.id);
	const spawnedCwd = params.entry.spawnedCwd;
	if (record?.ownerKind === "session" && record.ownerId === params.sessionKey && spawnedCwd && path.resolve(record.repoRoot) === path.resolve(worktree.repoRoot)) {
		const relative = path.relative(path.resolve(record.path), path.resolve(spawnedCwd));
		if (relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative)) return path.resolve(recordedRepoRoot, relative);
	}
	const agentWorkspace = path.resolve(resolveAgentWorkspaceDir(params.cfg, params.agentId, params.env));
	return agentWorkspace && agentWorkspace === recordedRepoRoot ? agentWorkspace : void 0;
}
function listLegacyWorktreeSessionEntries(params) {
	const resolved = resolveSqliteScope({
		...params,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where(sql`session_nodes.entry_valid != 1 OR (
            json_valid(session_nodes.entry_json)
            AND json_type(session_nodes.entry_json, '$.worktree') = 'object'
            AND (
              json_type(session_nodes.entry_json, '$.worktree.canonicalWorkspaceDir') IS NULL
              OR json_extract(session_nodes.entry_json, '$.worktree.canonicalWorkspaceDir') = ''
            )
          )`).orderBy("session_key", "asc")).rows.flatMap((row) => {
			const entry = parseReadableSqliteSessionEntryRow(database, row);
			return entry ? [{
				databasePath: database.path,
				entry,
				sessionKey: row.session_key
			}] : [];
		});
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
async function migrateManagedWorktreeCanonicalWorkspaces(params) {
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const entries = listLegacyWorktreeSessionEntries({
		agentId: params.agentId,
		env,
		storePath: params.storePath
	});
	if (params.mode !== "doctor-fix") return {
		found: entries.length,
		repaired: 0
	};
	const worktrees = listRegistryWorktreesForMigration(env);
	let repaired = 0;
	for (const { databasePath, entry, sessionKey } of entries) {
		const agentId = resolveAgentIdFromSessionKey(sessionKey, params.agentId);
		const canonicalWorkspaceDir = await resolveLegacyCanonicalWorkspace({
			agentId,
			cfg: params.cfg,
			entry,
			env,
			sessionKey,
			worktrees
		});
		if (!canonicalWorkspaceDir) continue;
		if ((await patchSessionEntryCore({
			agentId,
			env,
			sessionKey,
			storePath: databasePath
		}, (current) => {
			if (!current.worktree || current.worktree.id !== entry.worktree?.id || current.worktree.repoRoot !== entry.worktree.repoRoot || current.projectId !== entry.projectId || current.spawnedCwd !== entry.spawnedCwd || current.worktree.canonicalWorkspaceDir) return null;
			return { worktree: {
				...current.worktree,
				canonicalWorkspaceDir
			} };
		}, {
			preserveActivity: true,
			skipMaintenance: true
		}))?.worktree?.canonicalWorkspaceDir === canonicalWorkspaceDir) repaired += 1;
	}
	return {
		found: entries.length,
		repaired
	};
}
//#endregion
//#region src/commands/doctor-session-worktree-workspace.ts
/** Run after key repairs, whose source claims include workspace metadata. */
async function repairLegacySessionWorktreeWorkspaces(params) {
	const targets = params.targets ?? listExistingAgentDatabaseTargets(params.cfg, params.env);
	let found = 0;
	let repaired = 0;
	for (const target of targets) {
		const wasOpen = isOpenClawAgentDatabaseOpen(target.sqlitePath);
		try {
			const operation = await runDoctorAgentDatabaseOperationAsync({
				agentId: target.agentId,
				path: target.sqlitePath,
				run: () => migrateManagedWorktreeCanonicalWorkspaces({
					agentId: target.agentId,
					cfg: params.cfg,
					env: params.env,
					storePath: target.sqlitePath,
					mode: params.apply ? "doctor-fix" : "detect"
				})
			});
			if (operation.ok) {
				found += operation.value.found;
				repaired += operation.value.repaired;
			}
		} finally {
			if (!wasOpen) await closeOpenClawAgentDatabaseByPathAsync(target.sqlitePath);
		}
	}
	return {
		found,
		repaired,
		scannedStores: targets.length
	};
}
//#endregion
//#region src/commands/doctor-session-transcripts.ts
const SESSION_TRANSCRIPTS_CHECK_ID = "core/doctor/session-transcripts";
function parseTranscriptEntries(raw) {
	const entries = [];
	for (const line of raw.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const parsed = JSON.parse(line);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) entries.push(parsed);
		} catch {
			return [];
		}
	}
	return entries;
}
/** Classifies one legacy transcript without changing its contents. */
async function inspectSessionTranscriptFile(params) {
	const result = {
		filePath: params.filePath,
		broken: false,
		repaired: false,
		originalEntries: 0,
		activeEntries: 0,
		legacyOpenAICodexEntries: 0
	};
	try {
		if ((await fs.stat(params.filePath)).size > 1048576) {
			result.deferred = true;
			result.reason = "Detailed branch/provider classification deferred to offline staged import.";
			return result;
		}
		const entries = parseTranscriptEntries(await fs.readFile(params.filePath, "utf-8"));
		result.originalEntries = entries.length;
		result.legacyOpenAICodexEntries = normalizeLegacyOpenAICodexTranscriptMetadata(entries);
		const activePath = selectActivePath(entries);
		result.activeEntries = activePath?.entries.length ?? 0;
		result.broken = (activePath ? hasBrokenPromptRewriteBranch(entries, activePath.entries) : false) || result.legacyOpenAICodexEntries > 0;
		if (!activePath) result.reason = "no active branch";
	} catch (err) {
		result.reason = String(err);
	}
	return result;
}
async function listSessionTranscriptFiles(sessionDirs) {
	const files = [];
	for (const sessionsDir of sessionDirs) {
		const { entries } = await walkDirectory(sessionsDir, {
			maxDepth: 1,
			include: (entry) => entry.kind === "file" && entry.name.endsWith(".jsonl")
		});
		for (const entry of entries) files.push(path.join(sessionsDir, entry.name));
	}
	return files.toSorted((a, b) => a.localeCompare(b));
}
async function detectSessionTranscriptHealthIssues(params) {
	let sessionDirs = params?.sessionDirs;
	try {
		sessionDirs ??= await resolveAgentSessionDirs(resolveStateDir(process.env));
	} catch {
		return [];
	}
	const files = await listSessionTranscriptFiles(sessionDirs);
	const issues = [];
	for (const filePath of files) {
		const result = await inspectSessionTranscriptFile({ filePath });
		if (result.broken || result.deferred) issues.push(result);
	}
	return issues;
}
function sessionTranscriptIssueToHealthFinding(issue) {
	const metadata = issue.legacyOpenAICodexEntries > 0 ? ` ${issue.legacyOpenAICodexEntries} legacy OpenAI Codex metadata entr${issue.legacyOpenAICodexEntries === 1 ? "y" : "ies"}` : "";
	return {
		checkId: SESSION_TRANSCRIPTS_CHECK_ID,
		severity: "info",
		message: issue.deferred ? issue.reason : `Session transcript has legacy branch or provider metadata that can be cleaned up.${metadata}`,
		path: issue.filePath,
		fixHint: "Run `openclaw doctor --fix` to repair legacy transcripts during their staged import into SQLite."
	};
}
function sessionTranscriptIssueToRepairEffect(issue) {
	return {
		kind: "file",
		action: "would-rewrite-session-transcript",
		target: issue.filePath,
		dryRunSafe: false
	};
}
/** Reports or repairs session state through the canonical SQLite migration owner. */
async function noteSessionTranscriptHealth(options) {
	const params = {
		...options,
		env: options?.env ?? process.env,
		shouldRepair: options?.shouldRepair === true
	};
	const { hasRetainedDoctorSessionSources, runDoctorSessionSqlite } = await import("./doctor-session-sqlite-64MAySHc.mjs");
	let reservedKeyReport = {
		found: 0,
		repaired: 0
	};
	let deliveryReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0
	};
	let resolvedSkillsReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0
	};
	let entryStateReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0
	};
	let canonicalKeyReport = {
		archivedTranscriptDirectories: [],
		foundGroups: 0,
		repairBatches: 0,
		removedRows: 0,
		repairedGroups: 0,
		scannedStores: 0
	};
	let worktreeWorkspaceReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0
	};
	let acpKeyReport = {
		found: 0,
		repaired: 0,
		scannedRows: 0,
		warnings: []
	};
	let titleReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0,
		warnings: []
	};
	let legacyMainSessionResult;
	let postSessionPluginReceipt;
	const recordPostSessionRefusal = (refusal) => {
		if (!params.postSessionPluginMigration || postSessionPluginReceipt) return postSessionPluginReceipt;
		postSessionPluginReceipt = createLegacyStateMigrationStepReceipt({
			...params.postSessionPluginMigration.step,
			refusal
		}, {
			changes: [],
			warnings: [refusal.message]
		});
		params.onStepReceipt?.(postSessionPluginReceipt);
		return postSessionPluginReceipt;
	};
	const runSessionSqlite = async (maintenanceAuthority) => {
		const previewTargets = params.shouldRepair ? void 0 : listExistingAgentDatabaseTargets(params.cfg ?? {}, params.env);
		if (!params.shouldRepair) {
			entryStateReport = await repairLegacySessionEntryStates({
				apply: false,
				cfg: params.cfg ?? {},
				env: params.env,
				targets: previewTargets
			});
			if (entryStateReport.found > 0) return;
		}
		const report = await runDoctorSessionSqlite({
			allAgents: true,
			...params.cfg ? { cfg: params.cfg } : {},
			env: params.env,
			mode: params.shouldRepair ? "import" : "dry-run"
		}, maintenanceAuthority);
		const { migrateLegacyMainSessionKeys } = await import("./legacy-main-session-migration-Dpu-rRKh.mjs");
		legacyMainSessionResult = await migrateLegacyMainSessionKeys({
			cfg: params.cfg ?? {},
			env: params.env,
			mode: params.shouldRepair ? "doctor-fix" : "detect"
		});
		const repairParams = {
			apply: params.shouldRepair,
			cfg: params.cfg ?? {},
			env: params.env
		};
		canonicalKeyReport = await repairCanonicalSessionKeys(repairParams);
		const rowRepairParams = {
			...repairParams,
			targets: previewTargets ?? listExistingAgentDatabaseTargets(repairParams.cfg, params.env)
		};
		resolvedSkillsReport = repairCanonicalSessionResolvedSkills(rowRepairParams);
		reservedKeyReport = await repairReservedIncognitoSessionKeys(rowRepairParams);
		deliveryReport = repairCanonicalSessionDeliveryStates(rowRepairParams);
		repairLegacySessionExecPolicy(rowRepairParams);
		acpKeyReport = await repairAcpSessionMetaKeysForDoctor({
			...repairParams,
			authority: maintenanceAuthority
		});
		titleReport = await repairLegacySessionTitles({
			...rowRepairParams,
			authority: maintenanceAuthority
		});
		worktreeWorkspaceReport = await repairLegacySessionWorktreeWorkspaces({
			...rowRepairParams,
			apply: params.shouldRepair && (!legacyMainSessionResult.armed || legacyMainSessionResult.complete)
		});
		if (params.postSessionPluginMigrationPlanBound && !params.postSessionPluginMigration) return report;
		if (params.postSessionPluginMigration?.step.requiredness === "not-required") {
			postSessionPluginReceipt = createLegacyStateMigrationStepReceipt(params.postSessionPluginMigration.step, {
				changes: [],
				warnings: []
			});
			params.onStepReceipt?.(postSessionPluginReceipt);
			return report;
		}
		if (!params.shouldRepair && params.postSessionPluginMigration) {
			recordPostSessionRefusal({
				code: "repair-not-authorized",
				message: "Post-session plugin repair was planned but Doctor repair was not authorized."
			});
			return report;
		}
		let pluginRepair;
		let receiptStep = params.postSessionPluginMigration?.step;
		try {
			pluginRepair = await runPostSessionPluginDoctorStateRepairs({
				config: params.cfg ?? {},
				env: params.env,
				maintenanceAuthority,
				...maintenanceAuthority && hasRetainedDoctorSessionSources(report) ? { beforeCompletion: async (completedPluginIds, assertCurrent) => {
					const { settleRetainedDoctorSessionSources } = await import("./doctor-session-sqlite-64MAySHc.mjs");
					await settleRetainedDoctorSessionSources(report, completedPluginIds, maintenanceAuthority, assertCurrent);
				} } : {},
				...params.postSessionPluginMigration ? {
					plannedActions: params.postSessionPluginMigration.plannedActions,
					inventory: params.postSessionPluginMigration.inventory
				} : {}
			});
		} catch (error) {
			const message = `Plugin session repair failed before the planned step completed: ${String(error)}`;
			pluginRepair = {
				changes: [],
				warnings: [message]
			};
			if (receiptStep) receiptStep = {
				...receiptStep,
				refusal: {
					code: "step-threw",
					message
				}
			};
		}
		if (receiptStep) {
			postSessionPluginReceipt = createLegacyStateMigrationStepReceipt(receiptStep, pluginRepair);
			params.onStepReceipt?.(postSessionPluginReceipt);
		}
		const pluginMessages = [...pluginRepair.changes, ...pluginRepair.warnings];
		if (pluginMessages.length > 0) note(pluginMessages.join("\n"), "Plugin session repair");
		return report;
	};
	let report;
	try {
		report = params.shouldRepair ? await withDoctorSqliteMaintenanceLock({
			env: params.env,
			operation: "session SQLite import",
			run: runSessionSqlite
		}) : await runSessionSqlite();
	} catch (error) {
		if (!(error instanceof DoctorSqliteMaintenanceLockUnavailableError)) {
			recordPostSessionRefusal({
				code: "blocked-by-session-repair-failure",
				message: `Post-session plugin repair was blocked because prerequisite session repair failed: ${String(error)}`
			});
			throw error;
		}
		const failure = formatErrorMessage(error);
		note(`- Skipped: ${failure} Then run "${formatCliCommand("openclaw doctor --fix", params.env)}" for session-store maintenance.`, "Session SQLite");
		recordPostSessionRefusal({
			code: "sqlite-maintenance-unavailable",
			message: failure
		});
		return postSessionPluginReceipt;
	}
	if (entryStateReport.found > 0) note(`- Found ${entryStateReport.found} durable session row(s) with legacy pending-delivery, fallback, or memory-flush state. Run "openclaw doctor --fix" before further session inspection.`, "Session SQLite");
	if (!report) return postSessionPluginReceipt;
	if (worktreeWorkspaceReport.found > 0) note(params.shouldRepair ? `- Repaired canonical workspace metadata for ${worktreeWorkspaceReport.repaired} of ${worktreeWorkspaceReport.found} managed-worktree session(s). Check project/worktree ownership for any remaining entries.` : `- Found ${worktreeWorkspaceReport.found} managed-worktree session(s) missing canonical workspace metadata. Run "openclaw doctor --fix" to repair them.`, "Session worktrees");
	if (acpKeyReport.found > 0 || acpKeyReport.warnings.length > 0) note([params.shouldRepair ? `- Repaired ${acpKeyReport.repaired} of ${acpKeyReport.found} legacy ACP metadata key(s).` : `- Found ${acpKeyReport.found} legacy ACP metadata key(s). Run "openclaw doctor --fix" to repair them.`, ...acpKeyReport.warnings].join("\n"), "ACP session keys");
	if (titleReport.found > 0 || titleReport.warnings.length > 0) note([params.shouldRepair ? `- Repaired ${titleReport.repaired} of ${titleReport.found} missing session title(s) without changing activity.` : `- Found ${titleReport.found} missing session title(s). Run "openclaw doctor --fix" to repair them.`, ...titleReport.warnings].join("\n"), "Session titles");
	if (reservedKeyReport.found > 0) note(params.shouldRepair ? `- Renamed ${reservedKeyReport.repaired} durable session key(s) that collided with the reserved incognito namespace.` : `- Found ${reservedKeyReport.found} durable session key(s) that collide with the reserved incognito namespace. Run "openclaw doctor --fix" to rename them.`, "Session SQLite");
	if (canonicalKeyReport.foundGroups > 0) note(params.shouldRepair ? `- Canonicalized ${canonicalKeyReport.repairedGroups} session-key group(s) in ${canonicalKeyReport.repairBatches} transaction batch(es), removed ${canonicalKeyReport.removedRows} duplicate or alias row(s), and preserved cross-store history in ${canonicalKeyReport.archivedTranscriptDirectories.length} archive director${canonicalKeyReport.archivedTranscriptDirectories.length === 1 ? "y" : "ies"}.` : `- Found ${canonicalKeyReport.foundGroups} non-canonical or duplicate session-key group(s). Run "openclaw doctor --fix" to preserve their history and canonicalize the rows.`, "Session SQLite");
	if (deliveryReport.found > 0) note(params.shouldRepair ? `- Canonicalized delivery state for ${deliveryReport.repaired} durable session row(s).` : `- Found ${deliveryReport.found} durable session row(s) with legacy delivery fields. Run "openclaw doctor --fix" to canonicalize them.`, "Session SQLite");
	if (resolvedSkillsReport.found > 0) note(params.shouldRepair ? `- Stripped the runtime-only skills catalog from ${resolvedSkillsReport.repaired} durable session row(s). Logical SQLite pages are freed; shrinking the on-disk database requires "openclaw doctor --session-sqlite compact --session-sqlite-all-agents".` : `- Found ${resolvedSkillsReport.found} durable session row(s) carrying a runtime-only skills catalog. Run "openclaw doctor --fix" to strip it.`, "Session SQLite");
	if (legacyMainSessionResult && (legacyMainSessionResult.changes.length > 0 || legacyMainSessionResult.warnings.length > 0)) note([...legacyMainSessionResult.changes.map((change) => `- ${change}`), ...legacyMainSessionResult.warnings.map((warning) => `- ${warning}`)].join("\n"), "Legacy main sessions");
	if (report.totals.legacyEntries === 0 && report.totals.unreferencedJsonlFiles === 0 && report.totals.issues === 0) return postSessionPluginReceipt;
	const informationalIndexes = report.targets.filter(isInformationalMissingSessionIndex);
	const actionableTargets = report.targets.filter((target) => !isInformationalMissingSessionIndex(target));
	const actionableIssues = actionableTargets.reduce((count, target) => count + target.issues.length, 0);
	const lines = [`- Legacy entries: ${report.totals.legacyEntries}; SQLite entries: ${report.totals.sqliteEntries}.`, `- Transcript events: imported=${report.totals.importedTranscriptEvents}; validated=${report.totals.validatedTranscriptEvents}.`];
	for (const target of informationalIndexes) lines.push(...target.issues.map((issue) => `- ${issue.message}`));
	if (report.totals.archivedTranscriptFiles > 0) lines.push(`- Archived ${report.totals.archivedTranscriptFiles} legacy transcript artifact(s).`);
	if (report.totals.archivedUnreferencedJsonlFiles > 0) lines.push(`- Archived ${report.totals.archivedUnreferencedJsonlFiles} unreferenced JSONL artifact(s).`);
	if (actionableIssues > 0) {
		const warnings = formatSessionSqliteMigrationWarnings(actionableTargets, params.env);
		params.onWarnings?.(warnings);
		lines.push(...warnings.map((warning) => `- ${warning}`));
		lines.push(`- Found ${actionableIssues} session SQLite issue(s). Inspect with "${formatCliCommand("openclaw doctor --session-sqlite dry-run --session-sqlite-all-agents", params.env)}".`);
	}
	if (!params.shouldRepair && actionableTargets.length > 0) lines.push("- Run \"openclaw doctor --fix\" to migrate legacy session metadata/transcripts to SQLite.");
	if (params.shouldRepair && report.migrationRun && report.totals.archivedTranscriptFiles > 0) lines.push(`- After verifying the upgrade, preview rollback retirement with "${formatCliCommand("openclaw update cleanup --dry-run", params.env)}" for state ${resolveStateDir(params.env)}. Keep the same OPENCLAW_STATE_DIR and OPENCLAW_CONFIG_PATH overrides.`);
	note(lines.join("\n"), "Session SQLite");
	return postSessionPluginReceipt;
}
//#endregion
export { detectSessionTranscriptHealthIssues, noteSessionTranscriptHealth, sessionTranscriptIssueToHealthFinding, sessionTranscriptIssueToRepairEffect };
