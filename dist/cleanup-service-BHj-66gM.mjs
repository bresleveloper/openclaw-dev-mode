import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as getLogger } from "./logger-DR3u4tgD.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { a as resolveSessionArtifactDirectory, c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionStoreCandidateIdentities } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { r as countUnarchivedSessionEntries } from "./store-maintenance-BqMt1Twc.mjs";
import { t as shouldPreserveSessionCleanupEntry } from "./cleanup-service-read.policy-Bh5cybQV.mjs";
import { o as planSessionEntryMaintenance } from "./transcript-event-media-C4aKs47S.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { l as resolveSessionStoreTargets } from "./targets-DJGC6v85.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as enforceSqliteSessionHistoryDiskBudget, r as inspectSqliteSessionHistoryDiskBudget } from "./session-history-eviction-DcKJmUSb.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { n as collectSessionMaintenancePreserveKeysForStore } from "./store-maintenance-preserve-BGAXgKIR.mjs";
import { a as resolveSessionArtifactCanonicalPathsForEntry, i as pruneUnreferencedSessionArtifacts } from "./disk-budget-3DpjwM_1.mjs";
import { _ as applySessionEntryLifecycleMutation, v as purgeDeletedAgentSessionEntries } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import fs from "node:fs";
import { setImmediate } from "node:timers/promises";
//#region src/config/sessions/cleanup-result.ts
function createSessionsCleanupFailure(target, cause, lifecycleCommitted) {
	return {
		target,
		message: `Session cleanup failed for agent '${target.agentId}': ${formatErrorMessage(cause)}`,
		lifecycleCommitted
	};
}
var SessionsCleanupFailureError = class extends Error {
	constructor(failure, cause) {
		super(failure.message, { cause });
		this.failure = failure;
		this.name = "SessionsCleanupFailureError";
	}
};
function serializeSessionCleanupResult(params) {
	const summaries = params.summaries.map((summary) => ({
		...summary,
		storePath: resolveSqliteTargetFromSessionStorePath(summary.storePath, { agentId: summary.agentId }).path
	}));
	const [summary] = summaries;
	if (summary && summaries.length === 1 && !params.failure) return summary;
	return {
		allAgents: true,
		mode: params.mode,
		dryRun: params.dryRun,
		stores: summaries,
		...params.failure ? { partialError: {
			failingAgentId: params.failure.target.agentId,
			failingStorePath: resolveSqliteTargetFromSessionStorePath(params.failure.target.storePath, { agentId: params.failure.target.agentId }).path,
			message: params.failure.message,
			lifecycleCommitted: params.failure.lifecycleCommitted
		} } : {}
	};
}
function isSessionCleanupSummary(value) {
	if (!isRecord(value) || !isRecord(value.unreferencedArtifacts)) return false;
	return typeof value.agentId === "string" && typeof value.storePath === "string" && (value.mode === "enforce" || value.mode === "warn") && typeof value.dryRun === "boolean" && typeof value.beforeCount === "number" && typeof value.afterCount === "number" && typeof value.missing === "number" && typeof value.dmScopeRetired === "number" && typeof value.modelRunPruned === "number" && (value.archived === void 0 || typeof value.archived === "number") && (value.capArchived === void 0 || typeof value.capArchived === "number") && typeof value.pruned === "number" && typeof value.capped === "number" && typeof value.unreferencedArtifacts.removedFiles === "number" && (value.diskBudget === null || isRecord(value.diskBudget)) && typeof value.wouldMutate === "boolean" && (value.applied === void 0 || value.applied === true) && (value.appliedCount === void 0 || typeof value.appliedCount === "number");
}
function isSessionsCleanupPartialResult(value) {
	if (!isRecord(value) || !isRecord(value.partialError)) return false;
	return value.allAgents === true && (value.mode === "enforce" || value.mode === "warn") && typeof value.dryRun === "boolean" && Array.isArray(value.stores) && value.stores.every(isSessionCleanupSummary) && typeof value.partialError.failingAgentId === "string" && typeof value.partialError.failingStorePath === "string" && typeof value.partialError.message === "string" && typeof value.partialError.lifecycleCommitted === "boolean";
}
//#endregion
//#region src/config/sessions/cleanup-service-read.ts
/** Retain one physical owner through classification and lifecycle settlement. */
function withSessionCleanupStore(target, consume, options = {}) {
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const path = resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path;
	if (isIncognitoOpenClawAgentSqlitePath(path, {
		agentId: target.agentId,
		env
	})) return withMemorySessionCleanupStore(target, {
		agentId: target.agentId,
		path,
		env
	}, consume, options);
	const identities = captureSessionStoreCandidateIdentities(captureSessionStoreReadCandidates(target.storePath));
	let identity;
	return withSessionStoreReaderInWorker({
		...target,
		env
	}, async ({ reader, database, logicalAgentId, continuation, assertCurrent: assertReader }) => {
		const assertCurrent = () => {
			assertReader();
			options.assertCurrent?.();
			if (identity) assertExistingDatabaseIdentity(database.path, identity.key, identity.birthtime);
		};
		assertCurrent();
		const result = await consume({
			resolved: {
				agentId: logicalAgentId,
				databaseAgentId: database.agentId,
				path: database.path,
				env: database.env,
				sessionKey: "",
				ownerStorePath: target.storePath
			},
			assertCurrent,
			read: async (fixMissing = false) => {
				assertCurrent();
				const snapshot = await reader.readCleanup({
					env: database.env,
					expectedIdentity: identity && {
						...identity,
						canonicalPath: database.path
					},
					continuation,
					fixMissing
				});
				if (!identity && snapshot.source) identity = {
					key: `file:${snapshot.source.databaseIdentity}`,
					birthtime: snapshot.source.databaseBirthtime
				};
				assertCurrent();
				return snapshot;
			}
		});
		assertCurrent();
		return result;
	}, {
		lane: maintenanceLane,
		logical: { assertCurrent: options.assertCurrent },
		prepareSource: (database, captured) => {
			const original = identities.get(captured.canonicalPath);
			if (captured.key.startsWith("file:")) {
				if (!original || original.key.startsWith("file:") && (original.key !== captured.key || original.birthtime !== captured.birthtime)) throw new Error("Session cleanup changed its physical owner during discovery");
				assertExistingDatabaseIdentity(database.path, captured.key, captured.birthtime);
				identity = captured;
			}
		}
	});
}
/** A memory preview retains the same actor namespace through classification and consumption. */
async function withMemorySessionCleanupStore(target, database, consume, options) {
	const assertCaller = () => options.assertCurrent?.();
	const authority = {
		assertCurrent: assertCaller,
		authorize: assertCaller
	};
	const captured = captureSessionActorStorageOwner({
		...database,
		storePath: database.path
	}, authority);
	if (!captured) throw new Error("Session cleanup lost its memory owner selector");
	const memory = captured.owner;
	const assertCurrent = () => {
		captured.authority.assertCurrent();
		memory?.assertCurrent();
	};
	return consume({
		resolved: {
			...database,
			sessionKey: "",
			ownerStorePath: target.storePath
		},
		assertCurrent,
		read: async (fixMissing = false) => {
			assertCurrent();
			const entries = memory?.listSessionEntries(captured.authority) ?? [];
			const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			const missing = [];
			if (fixMissing && memory) for (const { sessionKey, entry } of entries) {
				if (shouldPreserveSessionCleanupEntry(sessionKey, entry)) continue;
				if (memory.readStorage(sessionKey, {
					type: "session.history.message-presence",
					input: { sessionId: entry.sessionId }
				}, captured.authority) === false) missing.push({
					sessionKey,
					expectedEntry: entry,
					archiveRemovedTranscript: true,
					requiresMissingTranscript: true
				});
			}
			return {
				kind: "session-cleanup",
				store,
				missing
			};
		}
	});
}
//#endregion
//#region src/config/sessions/cleanup-service.ts
function resolveCleanupSqlitePath(target) {
	return resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
}
function isMainScopeStaleDirectSessionKey(params) {
	if ((params.cfg.session?.dmScope ?? "main") !== "main") return false;
	if (params.activeKey && params.key === params.activeKey) return false;
	const parsed = parseAgentSessionKey(params.key);
	if (!parsed || normalizeAgentId(parsed.agentId) !== normalizeAgentId(params.targetAgentId)) return false;
	const parts = parsed.rest.split(":");
	if (parts[0] === "agent") return false;
	return parts.length === 2 && parts[0] === "direct" && Boolean(parts[1]) || parts.length === 3 && Boolean(parts[0]) && parts[1] === "direct" && Boolean(parts[2]) || parts.length === 4 && Boolean(parts[0]) && Boolean(parts[1]) && parts[2] === "direct" && Boolean(parts[3]);
}
function retireMainScopeDirectSessionEntries(params) {
	let retired = 0;
	for (const [key, entry] of Object.entries(params.store)) {
		if (entry.archivedAt !== void 0) continue;
		if (isMainScopeStaleDirectSessionKey({
			cfg: params.cfg,
			targetAgentId: params.targetAgentId,
			key,
			activeKey: params.activeKey
		})) {
			params.onRetired?.(key, entry);
			delete params.store[key];
			retired += 1;
		}
	}
	return retired;
}
function addEntryArtifactPathsToSet(params) {
	const sessionsDir = resolveSessionArtifactDirectory(params.storePath);
	for (const key of params.keys) {
		const entry = params.store[key];
		if (!entry) continue;
		for (const artifactPath of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir,
			entry
		})) params.paths.add(artifactPath);
	}
}
async function previewStoreCleanup(params) {
	const beforeStore = params.snapshot.store;
	const previewStore = structuredClone(beforeStore);
	const staleKeys = /* @__PURE__ */ new Set();
	const cappedKeys = /* @__PURE__ */ new Set();
	const missingKeys = /* @__PURE__ */ new Set();
	const modelRunPrunedKeys = /* @__PURE__ */ new Set();
	const archivedKeys = /* @__PURE__ */ new Set();
	const capArchivedKeys = /* @__PURE__ */ new Set();
	const ageArchivedKeys = /* @__PURE__ */ new Set();
	const dmScopeRetiredKeys = /* @__PURE__ */ new Set();
	for (const { sessionKey } of params.snapshot.missing) {
		missingKeys.add(sessionKey);
		delete previewStore[sessionKey];
	}
	const missing = missingKeys.size;
	const dmScopeRetired = params.fixDmScope === true ? retireMainScopeDirectSessionEntries({
		cfg: params.cfg,
		store: previewStore,
		targetAgentId: params.target.agentId,
		activeKey: params.activeKey,
		onRetired: (key) => {
			dmScopeRetiredKeys.add(key);
		}
	}) : 0;
	const preserveSessionKeys = await collectSessionMaintenancePreserveKeysForStore({
		storePath: params.target.storePath,
		store: previewStore,
		baseKeys: [params.activeKey]
	});
	const { modelRunPruned, archived: totalArchived, capArchived, pruned, capped } = planSessionEntryMaintenance({
		maintenance: params.maintenance,
		initialUnarchivedCount: countUnarchivedSessionEntries(previewStore),
		forceMaintenance: true,
		readPreserveKeys: () => preserveSessionKeys,
		log: false,
		readAgeCandidates: () => previewStore,
		readCapCandidates: () => ({
			store: previewStore,
			maxEntries: params.maintenance.maxEntries
		}),
		onRemoved: ({ key }, reason) => {
			(reason === "model-run-pruned" ? modelRunPrunedKeys : reason === "pruned" ? staleKeys : cappedKeys).add(key);
		},
		onArchived: ({ key }, phase) => {
			(phase === "dashboard" ? archivedKeys : phase === "age" ? ageArchivedKeys : capArchivedKeys).add(key);
		}
	});
	const archived = totalArchived - capArchived;
	const entryCleanupArtifactPaths = /* @__PURE__ */ new Set();
	for (const keys of [
		modelRunPrunedKeys,
		staleKeys,
		cappedKeys,
		dmScopeRetiredKeys
	]) addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys
	});
	const diskBudgetPreview = fs.existsSync(resolveCleanupSqlitePath(params.target)) ? await inspectSqliteSessionHistoryDiskBudget({
		agentId: params.target.agentId,
		storePath: params.target.storePath,
		mode: params.mode,
		maintenance: params.maintenance
	}) : {
		diskBudget: null,
		wouldMutate: false
	};
	const diskBudget = diskBudgetPreview.diskBudget;
	const unreferencedArtifacts = await pruneUnreferencedSessionArtifacts({
		store: previewStore,
		storePath: params.target.storePath,
		olderThanMs: params.maintenance.pruneAfterMs,
		dryRun: true,
		excludeCanonicalPaths: entryCleanupArtifactPaths
	});
	const beforeCount = Object.keys(beforeStore).length;
	const afterPreviewCount = Object.keys(previewStore).length;
	const wouldMutate = missing > 0 || dmScopeRetired > 0 || modelRunPruned > 0 || archived > 0 || capArchived > 0 || pruned > 0 || capped > 0 || unreferencedArtifacts.removedFiles > 0 || (diskBudget?.removedEntries ?? 0) > 0 || (diskBudget?.removedFiles ?? 0) > 0 || diskBudgetPreview.wouldMutate;
	return {
		summary: {
			agentId: params.target.agentId,
			storePath: params.target.storePath,
			mode: params.mode,
			dryRun: params.dryRun,
			beforeCount,
			afterCount: afterPreviewCount,
			missing,
			dmScopeRetired,
			modelRunPruned,
			archived,
			capArchived,
			pruned,
			capped,
			unreferencedArtifacts,
			diskBudget,
			wouldMutate
		},
		beforeStore,
		missingKeys,
		modelRunPrunedKeys,
		archivedKeys,
		capArchivedKeys,
		ageArchivedKeys,
		staleKeys,
		cappedKeys,
		dmScopeRetiredKeys
	};
}
/** Runs session cleanup preview/apply for the selected store targets. */
async function runSessionsCleanup(params) {
	const { cfg, opts } = params;
	params.assertCurrent?.();
	const maintenance = resolveMaintenanceConfig();
	const mode = opts.enforce ? "enforce" : maintenance.mode;
	const targets = params.targets ?? resolveSessionStoreTargets(cfg, {
		store: opts.store,
		agent: opts.agent,
		allAgents: opts.allAgents
	});
	const previewResults = [];
	for (const target of opts.dryRun ? targets : []) {
		const result = await withSessionCleanupStore(target, async (owner) => {
			const snapshot = await owner.read(Boolean(opts.fixMissing));
			return previewStoreCleanup({
				cfg,
				target,
				maintenance,
				mode,
				dryRun: Boolean(opts.dryRun),
				activeKey: opts.activeKey,
				fixDmScope: Boolean(opts.fixDmScope),
				snapshot
			});
		}, { assertCurrent: params.assertCurrent });
		previewResults.push(result);
	}
	const appliedSummaries = [];
	let failingTarget;
	let failingTargetLifecycleCommitted = false;
	try {
		if (!opts.dryRun) for (const target of targets) {
			failingTarget = target;
			failingTargetLifecycleCommitted = false;
			await withSessionCleanupStore(target, async (owner) => {
				let missingRemovals = [];
				const dmScopeRetiredRemovals = [];
				if (opts.fixMissing || opts.fixDmScope) {
					const snapshot = await owner.read(Boolean(opts.fixMissing));
					const applyStore = snapshot.store;
					if (opts.fixMissing) {
						missingRemovals = snapshot.missing;
						for (const { sessionKey } of missingRemovals) delete applyStore[sessionKey];
					}
					if (opts.fixDmScope) retireMainScopeDirectSessionEntries({
						cfg,
						store: applyStore,
						targetAgentId: target.agentId,
						activeKey: opts.activeKey,
						onRetired: (sessionKey, entry) => {
							dmScopeRetiredRemovals.push({
								sessionKey,
								expectedEntry: structuredClone(entry),
								archiveRemovedTranscript: true
							});
						}
					});
				}
				const removals = [...missingRemovals, ...dmScopeRetiredRemovals];
				await setImmediate();
				owner.assertCurrent();
				const lifecycleResult = await applySessionEntryLifecycleMutation({
					agentId: target.agentId,
					storePath: target.storePath,
					removals,
					commitGuard: () => {
						owner.assertCurrent();
						params.commitGuard?.();
					},
					activeSessionKey: opts.activeKey,
					maintenanceOverride: {
						...maintenance,
						mode
					},
					onLifecycleCommitted: () => {
						failingTargetLifecycleCommitted = true;
					}
				}, owner.resolved);
				await setImmediate();
				owner.assertCurrent();
				const unreferencedArtifacts = mode === "warn" ? {
					scannedFiles: 0,
					removedFiles: 0,
					freedBytes: 0,
					olderThanMs: maintenance.pruneAfterMs
				} : await pruneUnreferencedSessionArtifacts({
					store: async () => (await owner.read()).store,
					storePath: target.storePath,
					olderThanMs: maintenance.pruneAfterMs,
					dryRun: false
				});
				owner.assertCurrent();
				const removedSessionKeys = new Set(lifecycleResult.removedSessionKeys);
				const appliedDiskBudget = await enforceSqliteSessionHistoryDiskBudget({
					agentId: target.agentId,
					storePath: target.storePath,
					mode,
					maintenance,
					reclamationMode: params.reclamationMode
				});
				owner.assertCurrent();
				const finalCount = (appliedDiskBudget?.removedEntries ?? 0) > 0 ? Object.keys((await owner.read()).store).length : lifecycleResult.afterCount;
				const missing = missingRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
				const dmScopeRetired = dmScopeRetiredRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
				const maintenanceRemovedEntries = lifecycleResult.modelRunPruned + lifecycleResult.pruned + lifecycleResult.capped;
				const summary = {
					agentId: target.agentId,
					storePath: target.storePath,
					mode,
					dryRun: false,
					beforeCount: lifecycleResult.beforeCount,
					afterCount: finalCount,
					missing,
					dmScopeRetired,
					modelRunPruned: lifecycleResult.modelRunPruned,
					archived: lifecycleResult.archived - (lifecycleResult.capArchived ?? 0),
					capArchived: lifecycleResult.capArchived ?? 0,
					pruned: lifecycleResult.pruned,
					capped: lifecycleResult.capped,
					unreferencedArtifacts,
					diskBudget: appliedDiskBudget,
					wouldMutate: lifecycleResult.removedEntries > 0 || lifecycleResult.archived > 0 || maintenanceRemovedEntries > 0 || unreferencedArtifacts.removedFiles > 0 || (appliedDiskBudget?.removedEntries ?? 0) > 0 || (appliedDiskBudget?.removedFiles ?? 0) > 0 || appliedDiskBudget != null && appliedDiskBudget.totalBytesAfter < appliedDiskBudget.totalBytesBefore,
					applied: true,
					appliedCount: finalCount
				};
				appliedSummaries.push(summary);
			}, { assertCurrent: params.assertCurrent });
		}
	} catch (cause) {
		if (!failingTarget) throw cause;
		const failure = createSessionsCleanupFailure(failingTarget, cause, failingTargetLifecycleCommitted);
		if (appliedSummaries.length === 0) throw new SessionsCleanupFailureError(failure, cause);
		return {
			mode,
			previewResults,
			appliedSummaries,
			failure
		};
	}
	return {
		mode,
		previewResults,
		appliedSummaries
	};
}
/** Purge session store entries for a deleted agent (#65524). Best-effort. */
async function purgeAgentSessionStoreEntries(cfg, agentId, options = {}) {
	const normalizedAgentId = normalizeAgentId(agentId);
	let storePath = typeof cfg.session?.store === "string" ? cfg.session.store : "<default>";
	let failurePath = storePath;
	let step = "resolve session store";
	try {
		storePath = resolveSessionStorePathCore(cfg.session?.store, {
			agentId: normalizedAgentId,
			env: options.env
		});
		const sqliteTarget = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: normalizedAgentId,
			defaultAgentId: resolveSessionStoreCompatibilityAgentId(cfg),
			env: options.env
		});
		failurePath = sqliteTarget.path;
		if (!fs.existsSync(sqliteTarget.path)) return false;
		const storeAgentId = sqliteTarget.agentId ?? normalizedAgentId;
		const purge = async () => {
			step = "purge session entries";
			await purgeDeletedAgentSessionEntries({
				cfg,
				agentId: normalizedAgentId,
				storeAgentId,
				storePath,
				env: options.env
			});
			step = "close session-store cleanup";
		};
		if (options.runDatabaseCleanup) {
			step = "admit session-store cleanup";
			await options.runDatabaseCleanup({
				agentId: storeAgentId,
				path: sqliteTarget.path
			}, purge);
		} else await purge();
		return false;
	} catch (error) {
		const failure = {
			path: failurePath,
			reason: `${step}: ${formatErrorMessageWithCode(error)}`
		};
		getLogger().warn("session store purge failed during agent deletion", {
			agentId: normalizedAgentId,
			error,
			storePath,
			...failure
		});
		options.onFailure?.(failure);
		return true;
	}
}
//#endregion
export { isSessionsCleanupPartialResult as a, createSessionsCleanupFailure as i, runSessionsCleanup as n, serializeSessionCleanupResult as o, SessionsCleanupFailureError as r, purgeAgentSessionStoreEntries as t };
