import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { v as writeTextAtomic } from "./json-files-C0HSMh2Z.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, i as isCanonicalSessionDeliveryState, o as normalizeDeliveryChannelRoute, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-CW8dxG7X.mjs";
import { O as migrateLegacySessionCreator } from "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-CAUcdkW5.mjs";
import { c as isValidAgentHarnessSessionStoreEntry, f as resolveAgentHarnessSessionStoreError, p as resolveAgentHarnessSessionStoreTransitionError } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { r as stripRuntimeOnlySessionSkillsFields, t as normalizePersistedSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
import { i as projectSessionStoreForPersistence, n as ensureSessionStorePromptBlobsForPersistence, r as hydrateSessionStoreSkillPromptRefs } from "./skill-prompt-blobs-CrmXzNVn.mjs";
import { S as runExclusiveSessionStoreWrite } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { c as normalizeResolvedMaintenanceConfigInput, h as shouldRunSessionEntryMaintenance, i as getActiveSessionMaintenanceWarning, r as countUnarchivedSessionEntries } from "./store-maintenance-C5xEVYop.mjs";
import { a as normalizeSessionRuntimeModelFields } from "./types-ByCc34Vn.mjs";
import { r as planSessionEntryMaintenance } from "./store-maintenance-preserve-snapshot-BwwMxezL.mjs";
import { i as collectSessionMaintenancePreserveKeysForStore, t as resolveMaintenanceConfig } from "./store-maintenance-runtime-CSHOf5vV.mjs";
import { t as enforceSessionDiskBudget } from "./disk-budget-CH7vIk-L.mjs";
import { c as normalizeRestartRecoveryEntryFields } from "./restart-recovery-state-CVOwSXMV.mjs";
import { a as readSessionStoreJson5 } from "./state-migrations.fs-BCymriz5.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/store-maintenance-operations.ts
function resolveMaintenanceForOperation(params) {
	return params.maintenanceConfig ? {
		...normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig),
		...params.maintenanceOverride
	} : {
		...resolveMaintenanceConfig(),
		...params.maintenanceOverride
	};
}
function collectReferencedSessionIds(store) {
	return new Set(Object.values(store).map((entry) => entry?.sessionId).filter((id) => Boolean(id)));
}
function rememberRemovedSessionFile(removedSessionFiles, entry) {
	if (!removedSessionFiles.has(entry.sessionId)) removedSessionFiles.set(entry.sessionId, void 0);
}
async function applyWarnOnlyMaintenance(params) {
	const activeSessionKey = params.operation.activeSessionKey?.trim();
	if (activeSessionKey && params.shouldRunEntryMaintenance) {
		const warning = getActiveSessionMaintenanceWarning({
			store: params.operation.store,
			activeSessionKey,
			pruneAfterMs: params.maintenance.pruneAfterMs,
			maxEntries: params.maintenance.maxEntries,
			preserveKeys: params.preserveSessionKeys,
			preserveRecentMs: params.maintenance.preserveRecentMs
		});
		if (warning) {
			const outcome = warning.pruneOutcome === "remove" || warning.capOutcome === "remove" ? "remove" : "archive";
			params.operation.log.warn(`session maintenance would ${outcome} active session; skipping enforcement`, {
				activeSessionKey: warning.activeSessionKey,
				wouldPrune: warning.wouldPrune,
				wouldCap: warning.wouldCap,
				capOutcome: warning.capOutcome,
				pruneAfterMs: warning.pruneAfterMs,
				maxEntries: warning.maxEntries
			});
			await params.operation.onWarn?.(warning);
		}
	}
	const diskBudget = await enforceSessionDiskBudget({
		store: params.operation.store,
		storePath: params.operation.storePath,
		activeSessionKey: params.operation.activeSessionKey,
		maintenance: params.maintenance,
		warnOnly: true,
		log: params.operation.log
	});
	await params.operation.onMaintenanceApplied?.({
		mode: params.maintenance.mode,
		beforeCount: params.beforeCount,
		afterCount: Object.keys(params.operation.store).length,
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0,
		diskBudget
	});
}
async function cleanupRemovedSessionArtifacts(params) {
	const archivedDirs = await params.operation.artifacts.archiveRemovedSessionTranscripts({
		removedSessionFiles: params.removedSessionFiles,
		referencedSessionIds: params.referencedSessionIds,
		storePath: params.operation.storePath,
		reason: "deleted",
		restrictToStoreDir: true
	});
	if (params.removedSessionFiles.size > 0) await params.operation.artifacts.removeRemovedSessionTrajectoryArtifacts({
		removedSessionFiles: params.removedSessionFiles,
		referencedSessionIds: params.referencedSessionIds,
		storePath: params.operation.storePath,
		restrictToStoreDir: true
	});
	if (params.maintenance.resetArchiveRetentionMs == null) return;
	const targetDirs = archivedDirs.size > 0 ? [...archivedDirs] : [path.dirname(path.resolve(params.operation.storePath))];
	await params.operation.artifacts.cleanupArchivedSessionTranscripts({
		directories: targetDirs,
		rules: [{
			reason: "deleted",
			olderThanMs: params.maintenance.resetArchiveRetentionMs
		}, {
			reason: "reset",
			olderThanMs: params.maintenance.resetArchiveRetentionMs
		}]
	}).catch((error) => {
		params.operation.log.warn("session transcript archive retention cleanup failed", { error: String(error) });
	});
}
async function applyEnforcedMaintenance(params) {
	const removedSessionFiles = /* @__PURE__ */ new Map();
	const { modelRunPruned, archived, capArchived, pruned, capped } = planSessionEntryMaintenance({
		profile: "write",
		maintenance: params.maintenance,
		initialUnarchivedCount: countUnarchivedSessionEntries(params.operation.store),
		forceMaintenance: params.forceMaintenance,
		readPreserveKeys: () => params.preserveSessionKeys,
		readAgeCandidates: () => params.operation.store,
		readCapCandidates: () => ({
			store: params.operation.store,
			maxEntries: params.maintenance.maxEntries
		}),
		onRemoved: ({ entry }) => rememberRemovedSessionFile(removedSessionFiles, entry)
	});
	const referencedSessionIds = collectReferencedSessionIds(params.operation.store);
	await cleanupRemovedSessionArtifacts({
		operation: params.operation,
		maintenance: params.maintenance,
		removedSessionFiles,
		referencedSessionIds
	});
	const diskBudget = await enforceSessionDiskBudget({
		store: params.operation.store,
		storePath: params.operation.storePath,
		activeSessionKey: params.operation.activeSessionKey,
		preserveKeys: params.preserveSessionKeys,
		maintenance: params.maintenance,
		warnOnly: false,
		log: params.operation.log,
		commitEvictedIndex: params.operation.commitReducedStore
	});
	await params.operation.onMaintenanceApplied?.({
		mode: params.maintenance.mode,
		beforeCount: params.beforeCount,
		afterCount: Object.keys(params.operation.store).length,
		archived,
		capArchived,
		modelRunPruned,
		pruned,
		capped,
		diskBudget
	});
	return { changedStore: archived > 0 || modelRunPruned > 0 || pruned > 0 || capped > 0 || (diskBudget?.removedEntries ?? 0) > 0 };
}
/**
* Applies automatic session-store maintenance to the in-memory file-store image.
*
* Future SQLite adapters should map this into named boundaries: entry retention,
* removed-session artifact cleanup, disk-budget eviction, and archive retention cleanup.
*/
async function applyFileBackedSessionStoreMaintenance(params) {
	const maintenance = resolveMaintenanceForOperation(params);
	const beforeCount = Object.keys(params.store).length;
	const beforeUnarchivedCount = countUnarchivedSessionEntries(params.store);
	const forceMaintenance = params.maintenanceOverride !== void 0;
	const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.storePath,
		store: params.store,
		baseKeys: [params.activeSessionKey]
	});
	const shouldRunEntryMaintenance = shouldRunSessionEntryMaintenance({
		entryCount: beforeUnarchivedCount,
		maxEntries: maintenance.maxEntries,
		force: forceMaintenance
	});
	if (maintenance.mode === "warn") {
		await applyWarnOnlyMaintenance({
			operation: params,
			maintenance,
			beforeCount,
			shouldRunEntryMaintenance,
			preserveSessionKeys
		});
		return { changedStore: false };
	}
	return await applyEnforcedMaintenance({
		operation: params,
		maintenance,
		beforeCount,
		forceMaintenance,
		preserveSessionKeys
	});
}
//#endregion
//#region src/config/sessions/store-migrations.ts
/** Applies best-effort in-place migrations for legacy session store entry fields. */
function applySessionStoreMigrations(store) {
	let changed = false;
	for (const entry of Object.values(store)) {
		if (!entry || typeof entry !== "object") continue;
		const rec = asOptionalRecord(entry);
		if (!rec) continue;
		if (typeof rec["channel"] !== "string" && typeof rec["provider"] === "string") {
			rec["channel"] = rec["provider"];
			delete rec["provider"];
			changed = true;
		}
		if (typeof rec["lastChannel"] !== "string" && typeof rec["lastProvider"] === "string") {
			rec["lastChannel"] = rec["lastProvider"];
			delete rec["lastProvider"];
			changed = true;
		}
		if (typeof rec.groupChannel !== "string" && typeof rec["room"] === "string") {
			rec.groupChannel = rec["room"];
			delete rec["room"];
			changed = true;
		} else if ("room" in rec) {
			delete rec["room"];
			changed = true;
		}
	}
	return changed;
}
//#endregion
//#region src/infra/state-migrations.legacy-session-store.ts
const log = createSubsystemLogger("sessions/legacy-importer");
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime.js"));
const loadTrajectoryCleanupRuntime = createLazyRuntimeModule(() => import("./cleanup-BPr-YJtn.mjs"));
function normalizeRecordKey(value) {
	const key = value.trim();
	return key.length > 0 ? key : void 0;
}
function normalizeOptionalDeliveryContext(value) {
	if (!isRecord(value)) return;
	const normalized = normalizeDeliveryContext({
		channel: typeof value.channel === "string" ? value.channel : void 0,
		to: typeof value.to === "string" ? value.to : void 0,
		accountId: typeof value.accountId === "string" ? value.accountId : void 0,
		threadId: typeof value.threadId === "string" || typeof value.threadId === "number" ? value.threadId : void 0
	});
	return normalized?.channel && normalized.to ? normalized : void 0;
}
function sameDeliveryContext(left, right) {
	return (left?.channel ?? void 0) === (right?.channel ?? void 0) && (left?.to ?? void 0) === (right?.to ?? void 0) && (left?.accountId ?? void 0) === (right?.accountId ?? void 0) && (left?.threadId ?? void 0) === (right?.threadId ?? void 0);
}
function normalizeRestartRecoveryFields(entry) {
	let next = entry;
	const assign = (key, value) => {
		if (entry[key] === value) return;
		if (next === entry) next = { ...entry };
		if (value === void 0) delete next[key];
		else next[key] = value;
	};
	const restartContext = normalizeOptionalDeliveryContext(entry.restartRecoveryDeliveryContext);
	if (!sameDeliveryContext(entry.restartRecoveryDeliveryContext, restartContext)) assign("restartRecoveryDeliveryContext", restartContext);
	normalizeRestartRecoveryEntryFields(entry, assign);
	return next;
}
function normalizeLegacyPluginState(entry, key, normalizeValue) {
	const state = entry[key];
	if (state === void 0) return entry;
	if (!isRecord(state)) {
		const next = { ...entry };
		delete next[key];
		return next;
	}
	let changed = false;
	const normalizedState = {};
	for (const [rawPluginId, rawPluginState] of Object.entries(state)) {
		const pluginId = normalizeRecordKey(rawPluginId);
		if (!pluginId || !isRecord(rawPluginState)) {
			changed = true;
			continue;
		}
		changed ||= pluginId !== rawPluginId;
		const normalizedPluginState = {};
		for (const [rawNamespace, rawValue] of Object.entries(rawPluginState)) {
			const namespace = normalizeRecordKey(rawNamespace);
			const value = normalizeValue(rawValue);
			if (!namespace || value === void 0) {
				changed = true;
				continue;
			}
			changed ||= namespace !== rawNamespace || value !== rawValue;
			normalizedPluginState[namespace] = value;
		}
		if (Object.keys(normalizedPluginState).length === 0) {
			changed = true;
			continue;
		}
		normalizedState[pluginId] = normalizedPluginState;
	}
	if (!changed) return entry;
	const next = { ...entry };
	if (Object.keys(normalizedState).length > 0) Object.assign(next, { [key]: normalizedState });
	else delete next[key];
	return next;
}
function normalizePluginExtensions(entry) {
	return normalizeLegacyPluginState(entry, "pluginExtensions", (value) => isPluginJsonValue(value) ? value : void 0);
}
function normalizePluginExtensionSlotKeys(entry) {
	return normalizeLegacyPluginState(entry, "pluginExtensionSlotKeys", (value) => {
		const slotKey = normalizeSessionEntrySlotKey(value);
		return slotKey.ok ? slotKey.key : void 0;
	});
}
function normalizeLegacySessionStore(store) {
	applySessionStoreMigrations(store);
	for (const [key, entry] of Object.entries(store)) {
		const modelSelectionLocked = isRecord(entry) && entry.modelSelectionLocked === true;
		const shaped = normalizePersistedSessionEntryShape(entry, { sessionKey: key });
		if (!shaped) {
			if (modelSelectionLocked) throw new Error(`Invalid model-selection-locked session entry: ${key}`);
			delete store[key];
			continue;
		}
		const runtimeFields = normalizeSessionRuntimeModelFields(shaped);
		if (modelSelectionLocked && runtimeFields !== shaped) throw new Error(`Invalid model-selection-locked session entry: ${key}`);
		store[key] = stripRuntimeOnlySessionSkillsFields(normalizePluginExtensionSlotKeys(normalizePluginExtensions(normalizeRestartRecoveryFields(normalizeLegacySessionEntryDelivery(migrateLegacySessionCreator(modelSelectionLocked ? shaped : runtimeFields))))));
	}
	const harnessError = resolveAgentHarnessSessionStoreError(store);
	if (harnessError) throw new Error(harnessError);
}
function loadLegacySessionStore(storePath, options = {}) {
	const { store } = readSessionStoreJson5(storePath);
	if (options.hydrateSkillPromptRefs !== false) hydrateSessionStoreSkillPromptRefs({
		storePath,
		store
	});
	const sessionStore = store;
	normalizeLegacySessionStore(sessionStore);
	if (options.runMaintenance) {
		const maintenance = options.maintenanceConfig ?? resolveMaintenanceConfig();
		const beforeCount = countUnarchivedSessionEntries(sessionStore);
		if (maintenance.mode === "enforce") {
			const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
				storePath,
				store: sessionStore
			});
			planSessionEntryMaintenance({
				profile: "legacy-read",
				maintenance,
				initialUnarchivedCount: beforeCount,
				readPreserveKeys: () => preserveSessionKeys,
				log: false,
				readAgeCandidates: () => sessionStore,
				readCapCandidates: () => ({
					store: sessionStore,
					maxEntries: maintenance.maxEntries
				})
			});
		}
	}
	return sessionStore;
}
function snapshotLockedEntries(store) {
	return new Map(Object.entries(store).flatMap(([sessionKey, entry]) => isValidAgentHarnessSessionStoreEntry(sessionKey, entry) ? [[sessionKey, structuredClone(entry)]] : []));
}
function assertLegacySessionStoreWriteIsValid(params) {
	const transitionError = resolveAgentHarnessSessionStoreTransitionError({
		before: params.lockedEntriesBefore,
		store: params.store
	});
	if (transitionError) throw new Error(transitionError);
	const storeError = resolveAgentHarnessSessionStoreError(params.store);
	if (storeError) throw new Error(storeError);
}
async function archiveRemovedSessionTranscripts(params) {
	const { archiveSessionTranscripts } = await loadSessionArchiveRuntime();
	const archivedDirs = /* @__PURE__ */ new Set();
	for (const [sessionId, sessionFile] of params.removedSessionFiles) {
		if (params.referencedSessionIds.has(sessionId)) continue;
		const archived = archiveSessionTranscripts({
			sessionId,
			storePath: params.storePath,
			sessionFile,
			reason: params.reason,
			restrictToStoreDir: params.restrictToStoreDir
		});
		for (const archivedPath of archived) archivedDirs.add(path.dirname(archivedPath));
	}
	return archivedDirs;
}
async function persistLegacySessionStore(storePath, store) {
	const persisted = projectSessionStoreForPersistence({
		storePath,
		store
	});
	await fs.promises.mkdir(path.dirname(storePath), { recursive: true });
	await writeTextAtomic(storePath, JSON.stringify(persisted.store, null, 2), {
		beforeRename: async () => {
			await ensureSessionStorePromptBlobsForPersistence({
				storePath,
				promptBlobs: persisted.promptBlobs.values()
			});
		},
		durable: true,
		mode: 384,
		tempPrefix: path.basename(storePath),
		trailingNewline: true
	});
}
async function writeLegacySessionStoreUnlocked(storePath, store, lockedEntriesBefore, options) {
	normalizeLegacySessionStore(store);
	assertLegacySessionStoreWriteIsValid({
		lockedEntriesBefore,
		store
	});
	if (!options.skipMaintenance) await applyFileBackedSessionStoreMaintenance({
		storePath,
		store,
		activeSessionKey: options.activeSessionKey,
		onWarn: options.onWarn,
		onMaintenanceApplied: options.onMaintenanceApplied,
		maintenanceOverride: options.maintenanceOverride,
		maintenanceConfig: options.maintenanceConfig,
		log,
		commitReducedStore: () => persistLegacySessionStore(storePath, store),
		artifacts: {
			archiveRemovedSessionTranscripts,
			removeRemovedSessionTrajectoryArtifacts: async (params) => {
				const { removeRemovedSessionTrajectoryArtifacts } = await loadTrajectoryCleanupRuntime();
				await removeRemovedSessionTrajectoryArtifacts(params);
			},
			cleanupArchivedSessionTranscripts: async (params) => {
				const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime();
				await cleanupArchivedSessionTranscripts(params);
			}
		}
	});
	assertLegacySessionStoreWriteIsValid({
		lockedEntriesBefore,
		store
	});
	await persistLegacySessionStore(storePath, store);
}
async function saveLegacySessionStore(storePath, store, options = {}) {
	await runExclusiveSessionStoreWrite(storePath, async () => {
		await writeLegacySessionStoreUnlocked(storePath, store, snapshotLockedEntries(loadLegacySessionStore(storePath)), options);
	});
}
async function updateLegacySessionStore(storePath, mutator, options = {}) {
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadLegacySessionStore(storePath);
		const lockedEntriesBefore = snapshotLockedEntries(store);
		const result = await mutator(store);
		if (!options.skipSaveWhenResult?.(result)) await writeLegacySessionStoreUnlocked(storePath, store, lockedEntriesBefore, options);
		return result;
	}, { reentrant: options.reentrant });
}
const LEGACY_SESSION_DELIVERY_KEYS = [
	"route",
	"deliveryContext",
	"origin",
	"channel",
	"lastChannel",
	"lastTo",
	"lastAccountId",
	"lastThreadId"
];
function isInternalContext(context) {
	return Boolean(context?.channel && (context.channel === "webchat" || isInternalNonDeliveryChannel(context.channel)));
}
function hasExternalTarget(context) {
	return Boolean(context?.channel && context.channel !== "webchat" && !isInternalNonDeliveryChannel(context.channel) && context.to);
}
function mergeExternalOverInternal(external, internal) {
	return normalizeDeliveryContext({
		channel: external?.channel,
		to: external?.to,
		accountId: external?.accountId ?? internal?.accountId,
		threadId: external?.threadId ?? internal?.threadId
	});
}
/** Canonicalizes file-era delivery fields before doctor imports a row into SQLite. */
function normalizeLegacySessionEntryDelivery(entry) {
	const legacy = entry;
	const hasLegacyFields = LEGACY_SESSION_DELIVERY_KEYS.some((key) => key in legacy);
	if (isCanonicalSessionDeliveryState(entry.delivery) && !hasLegacyFields) return entry;
	const route = normalizeDeliveryChannelRoute(legacy.route);
	const routeContext = deliveryContextFromChannelRoute(route);
	const explicitContext = normalizeDeliveryContext(legacy.deliveryContext);
	const lastChannel = normalizeDeliveryContext({ channel: legacy.lastChannel })?.channel;
	const storedChannel = normalizeDeliveryContext({ channel: legacy.channel })?.channel;
	const originChannel = normalizeDeliveryContext({ channel: legacy.origin?.provider })?.channel;
	const normalizedLastFields = normalizeDeliveryContext({
		to: legacy.lastTo,
		accountId: legacy.lastAccountId,
		threadId: legacy.lastThreadId
	});
	const hasNormalizedLastFields = Boolean(normalizedLastFields?.to || normalizedLastFields?.accountId || normalizedLastFields?.threadId != null);
	const lastCandidate = normalizeDeliveryContext({
		channel: lastChannel ?? (hasNormalizedLastFields ? storedChannel ?? originChannel : void 0),
		to: normalizedLastFields?.to,
		accountId: normalizedLastFields?.accountId,
		threadId: normalizedLastFields?.threadId
	});
	const lastContext = isInternalContext(lastCandidate) || hasExternalTarget(lastCandidate) || lastChannel != null && lastCandidate?.channel != null || lastCandidate?.channel && lastCandidate.channel === explicitContext?.channel ? lastCandidate : void 0;
	const channelContext = normalizeDeliveryContext({ channel: legacy.channel });
	const originContext = normalizeDeliveryContext({
		channel: legacy.origin?.provider,
		to: legacy.origin?.to,
		accountId: legacy.origin?.accountId,
		threadId: legacy.origin?.threadId
	});
	const fallbackContext = mergeDeliveryContext(lastContext, mergeDeliveryContext(explicitContext, mergeDeliveryContext(channelContext, originContext)));
	const internalFallbackContext = isInternalContext(routeContext) ? mergeDeliveryContext(routeContext, lastContext) : isInternalContext(lastContext) ? lastContext : isInternalContext(channelContext) ? mergeDeliveryContext(channelContext, lastContext) : void 0;
	const hasInternalFallback = internalFallbackContext !== void 0 && hasExternalTarget(explicitContext);
	const context = hasInternalFallback ? mergeExternalOverInternal(explicitContext, internalFallbackContext) : mergeDeliveryContext(routeContext, fallbackContext);
	const migratedDelivery = normalizeSessionDeliveryState({
		route: hasInternalFallback ? void 0 : route,
		context,
		origin: legacy.origin
	});
	const recoverLegacyDelivery = isCanonicalSessionDeliveryState(entry.delivery) && (entry.delivery.kind === "none" && migratedDelivery.kind !== "none" || entry.delivery.kind === "internal" && migratedDelivery.kind === "external");
	const delivery = isCanonicalSessionDeliveryState(entry.delivery) && !recoverLegacyDelivery ? entry.delivery : migratedDelivery;
	const next = {
		...entry,
		delivery
	};
	const legacyChatType = legacy.origin?.chatType;
	if (next.chatType == null && (legacyChatType === "direct" || legacyChatType === "group" || legacyChatType === "channel")) next.chatType = legacyChatType;
	for (const key of LEGACY_SESSION_DELIVERY_KEYS) delete next[key];
	return next;
}
//#endregion
export { updateLegacySessionStore as i, normalizeLegacySessionEntryDelivery as n, saveLegacySessionStore as r, loadLegacySessionStore as t };
