import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getLogger } from "./logger--ALOusOG.mjs";
import { l as resolveSessionStorePathCore, o as resolveSessionArtifactDirectory } from "./paths-CcMbq5NY.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { l as resolveSessionStoreTargets } from "./targets-Dmb8-YXN.mjs";
import { p as shouldPreserveMaintenanceEntry, r as countUnarchivedSessionEntries } from "./store-maintenance-C5xEVYop.mjs";
import { a as inspectTranscriptEventsSync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { r as planSessionEntryMaintenance } from "./store-maintenance-preserve-snapshot-BwwMxezL.mjs";
import { i as collectSessionMaintenancePreserveKeysForStore, t as resolveMaintenanceConfig } from "./store-maintenance-runtime-C9xB-eDV.mjs";
import { n as enforceSqliteSessionHistoryDiskBudget, r as inspectSqliteSessionHistoryDiskBudget } from "./session-history-eviction-BMyfpOCd.mjs";
import { a as resolveSessionArtifactCanonicalPathsForEntry, i as pruneUnreferencedSessionArtifacts } from "./disk-budget-CH7vIk-L.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-CwzWysXO.mjs";
import { v as applySessionEntryLifecycleMutation, x as purgeDeletedAgentSessionEntries } from "./session-accessor.reset-0gTJAhVB.mjs";
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
//#region src/config/sessions/cleanup-service.ts
function resolveCleanupSqlitePath(target) {
	return resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
}
function loadCleanupSessionStore(target, options = {}) {
	if (options.createIfMissing !== true && !fs.existsSync(resolveCleanupSqlitePath(target))) return {};
	return Object.fromEntries(listSessionEntriesCore({
		agentId: target.agentId,
		storePath: target.storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
}
function isTranscriptMessageRole(role) {
	return role === "user" || role === "assistant" || role === "tool" || role === "toolResult" || role === "system";
}
function isTranscriptMessageRecord(entry) {
	if (!entry || typeof entry !== "object") return false;
	const record = entry;
	if (record.type === "message") return true;
	if (record.type === void 0 && record.message && typeof record.message === "object" && isTranscriptMessageRole(record.message.role)) return true;
	return record.type === void 0 && isTranscriptMessageRole(record.role);
}
function inspectConfirmedMessageFreeTranscript(params) {
	try {
		const inspection = inspectTranscriptEventsSync(params);
		return inspection.events.some(isTranscriptMessageRecord) ? void 0 : inspection;
	} catch {
		return;
	}
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
function pruneMissingTranscriptEntries(params) {
	let removed = 0;
	for (const [key, entry] of Object.entries(params.store)) {
		if ((entry?.modelSelectionLocked === true || entry?.archivedAt !== void 0) && shouldPreserveMaintenanceEntry({
			key,
			entry
		})) continue;
		const legacySessionFile = entry.sessionFile;
		if (parseAgentSessionKey(key) && (entry.initializationPending === true || entry.sessionId === key && (typeof legacySessionFile !== "string" || !legacySessionFile.trim()))) continue;
		if (!entry?.sessionId) {
			if (parseAgentSessionKey(key)) continue;
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry);
			continue;
		}
		const inspection = inspectConfirmedMessageFreeTranscript({
			...params.target,
			sessionId: entry.sessionId,
			sessionKey: key
		});
		if (inspection) {
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry, inspection);
		}
	}
	return removed;
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
	const beforeStore = loadCleanupSessionStore(params.target, { createIfMissing: !params.dryRun });
	const previewStore = structuredClone(beforeStore);
	const staleKeys = /* @__PURE__ */ new Set();
	const cappedKeys = /* @__PURE__ */ new Set();
	const missingKeys = /* @__PURE__ */ new Set();
	const modelRunPrunedKeys = /* @__PURE__ */ new Set();
	const archivedKeys = /* @__PURE__ */ new Set();
	const capArchivedKeys = /* @__PURE__ */ new Set();
	const ageArchivedKeys = /* @__PURE__ */ new Set();
	const dmScopeRetiredKeys = /* @__PURE__ */ new Set();
	const missing = params.fixMissing === true ? pruneMissingTranscriptEntries({
		store: previewStore,
		target: params.target,
		onPruned: (key) => {
			missingKeys.add(key);
		}
	}) : 0;
	const dmScopeRetired = params.fixDmScope === true ? retireMainScopeDirectSessionEntries({
		cfg: params.cfg,
		store: previewStore,
		targetAgentId: params.target.agentId,
		activeKey: params.activeKey,
		onRetired: (key) => {
			dmScopeRetiredKeys.add(key);
		}
	}) : 0;
	const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.target.storePath,
		store: previewStore,
		baseKeys: [params.activeKey]
	});
	const { modelRunPruned, archived: totalArchived, capArchived, pruned, capped } = planSessionEntryMaintenance({
		profile: "write",
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
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: modelRunPrunedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: staleKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: cappedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: dmScopeRetiredKeys
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
	const maintenance = resolveMaintenanceConfig();
	const mode = opts.enforce ? "enforce" : maintenance.mode;
	const targets = params.targets ?? resolveSessionStoreTargets(cfg, {
		store: opts.store,
		agent: opts.agent,
		allAgents: opts.allAgents
	});
	const previewResults = [];
	for (const target of targets) {
		const result = await previewStoreCleanup({
			cfg,
			target,
			maintenance,
			mode,
			dryRun: Boolean(opts.dryRun),
			activeKey: opts.activeKey,
			fixMissing: Boolean(opts.fixMissing),
			fixDmScope: Boolean(opts.fixDmScope)
		});
		previewResults.push(result);
	}
	const appliedSummaries = [];
	let failingTarget;
	let failingTargetLifecycleCommitted = false;
	try {
		if (!opts.dryRun) for (const target of targets) {
			failingTarget = target;
			failingTargetLifecycleCommitted = false;
			const missingRemovals = [];
			const dmScopeRetiredRemovals = [];
			if (opts.fixMissing || opts.fixDmScope) {
				const applyStore = loadCleanupSessionStore(target, { createIfMissing: true });
				if (opts.fixMissing) pruneMissingTranscriptEntries({
					store: applyStore,
					target,
					onPruned: (sessionKey, entry, inspection) => {
						missingRemovals.push({
							sessionKey,
							expectedEntry: structuredClone(entry),
							archiveRemovedTranscript: true,
							...inspection ? { expectedTranscriptSnapshot: inspection.snapshot } : {}
						});
					}
				});
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
			const lifecycleResult = await applySessionEntryLifecycleMutation({
				agentId: target.agentId,
				storePath: target.storePath,
				removals,
				activeSessionKey: opts.activeKey,
				maintenanceOverride: {
					...maintenance,
					mode
				},
				onLifecycleCommitted: () => {
					failingTargetLifecycleCommitted = true;
				}
			});
			await setImmediate();
			const postApplyStore = loadCleanupSessionStore(target, { createIfMissing: true });
			const appliedUnreferencedArtifacts = mode === "warn" ? null : await pruneUnreferencedSessionArtifacts({
				store: postApplyStore,
				storePath: target.storePath,
				olderThanMs: maintenance.pruneAfterMs,
				dryRun: false
			});
			const removedSessionKeys = new Set(lifecycleResult.removedSessionKeys);
			const unreferencedArtifacts = mode === "warn" ? {
				scannedFiles: 0,
				removedFiles: 0,
				freedBytes: 0,
				olderThanMs: maintenance.pruneAfterMs
			} : appliedUnreferencedArtifacts ?? {
				scannedFiles: 0,
				removedFiles: 0,
				freedBytes: 0,
				olderThanMs: maintenance.pruneAfterMs
			};
			const appliedDiskBudget = await enforceSqliteSessionHistoryDiskBudget({
				agentId: target.agentId,
				storePath: target.storePath,
				mode,
				maintenance,
				reclamationMode: params.reclamationMode
			});
			const finalStore = (appliedDiskBudget?.removedEntries ?? 0) > 0 ? loadCleanupSessionStore(target, { createIfMissing: true }) : postApplyStore;
			const finalCount = Object.keys(finalStore).length;
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
		if (!fs.existsSync(sqliteTarget.path)) return false;
		const storeAgentId = sqliteTarget.agentId ?? normalizedAgentId;
		const purge = () => purgeDeletedAgentSessionEntries({
			cfg,
			agentId: normalizedAgentId,
			storeAgentId,
			storePath,
			env: options.env
		});
		if (options.runDatabaseCleanup) await options.runDatabaseCleanup({
			agentId: storeAgentId,
			path: sqliteTarget.path
		}, purge);
		else await purge();
		return false;
	} catch (error) {
		getLogger().warn("session store purge failed during agent deletion", {
			agentId: normalizedAgentId,
			error,
			storePath
		});
		return true;
	}
}
//#endregion
export { isSessionsCleanupPartialResult as a, createSessionsCleanupFailure as i, runSessionsCleanup as n, serializeSessionCleanupResult as o, SessionsCleanupFailureError as r, purgeAgentSessionStoreEntries as t };
