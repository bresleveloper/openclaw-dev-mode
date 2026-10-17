import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { m as writeTextAtomic } from "./json-files-C5mNTScg.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { m as validateSessionId } from "./paths-dpReqUI8.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-B3vfipkP.mjs";
import { k as migrateLegacySessionCreator } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, i as isCanonicalSessionDeliveryState, o as normalizeDeliveryChannelRoute, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-sCRI4mq1.mjs";
import { c as isValidAgentHarnessSessionStoreEntry, f as resolveAgentHarnessSessionStoreError, p as resolveAgentHarnessSessionStoreTransitionError } from "./agent-harness-session-key-D8EQIzja.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, c as LEGACY_SESSION_PROVIDER_FIELDS, i as projectCanonicalSessionEntryShape, n as normalizeMemoryFlush, o as assertSupportedSessionStoreEntry, r as normalizePendingFinalDelivery, s as LEGACY_SESSION_ENTRY_STATE_FIELDS, t as normalizeFallbackNotice, u as hasLegacySessionProviderState } from "./store-entry-shape-BzuAi3ao.mjs";
import { r as countUnarchivedSessionEntries, s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import { x as runExclusiveSessionStoreWrite } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { i as projectSessionStoreForPersistence, n as ensureSessionStorePromptBlobsForPersistence, r as hydrateSessionStoreSkillPromptRefs } from "./skill-prompt-blobs-nw-M-anz.mjs";
import { i as planSessionEntryMaintenance } from "./store-maintenance-preserve-snapshot-Bc3JacvP.mjs";
import { a as collectSessionMaintenancePreserveKeysForStore, n as resolveMaintenanceConfig } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { t as enforceSessionDiskBudget } from "./disk-budget-7sFA2NUn.mjs";
import { a as normalizeSessionRuntimeModelFields } from "./types-BZlUzQZy.mjs";
import { c as normalizeRestartRecoveryEntryFields } from "./restart-recovery-state-IiHiWzPq.mjs";
import { i as readSessionStoreJson5 } from "./state-migrations.fs-BsWaJ_dW.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/session-entry-shape.ts
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : asNonNegativeFiniteNumber(value) ?? 0;
}
function normalizeCount(value) {
	const number = asNonNegativeFiniteNumber(value);
	return number === void 0 ? void 0 : Math.floor(number);
}
/** Doctor preserves July routing and scalar-state contracts before removing their old keys. */
function migrateLegacySessionEntryState(value, updatedAt = value.updatedAt) {
	const next = { ...value };
	if (hasLegacySessionProviderState(value)) {
		for (const [legacy, current] of LEGACY_SESSION_PROVIDER_FIELDS) if (typeof value[current] !== "string" && typeof value[legacy] === "string") {
			next[current] = value[legacy];
			delete next[legacy];
		}
	}
	for (const field of LEGACY_SESSION_ENTRY_STATE_FIELDS) delete next[field];
	if (typeof value.pendingFinalDelivery === "boolean") delete next.pendingFinalDelivery;
	const text = normalizeOptionalString(value.pendingFinalDeliveryText);
	if (!normalizePendingFinalDelivery(value.pendingFinalDelivery) && (text || value.pendingFinalDelivery === true)) {
		const intentId = normalizeOptionalString(value.pendingFinalDeliveryIntentId);
		next.pendingFinalDelivery = {
			...text ? {
				kind: "replayable",
				text
			} : { kind: "transport-only" },
			createdAt: normalizeOptionalTimestamp(value.pendingFinalDeliveryCreatedAt) ?? normalizeOptionalTimestamp(updatedAt) ?? 0,
			...isRecord(value.pendingFinalDeliveryContext) ? { context: value.pendingFinalDeliveryContext } : {},
			...intentId ? { intentId } : {}
		};
	}
	const selectedModel = normalizeOptionalString(value.fallbackNoticeSelectedModel);
	const activeModel = normalizeOptionalString(value.fallbackNoticeActiveModel);
	if (!normalizeFallbackNotice(value.fallbackNotice) && selectedModel && activeModel) {
		const reason = normalizeOptionalString(value.fallbackNoticeReason);
		next.fallbackNotice = {
			kind: "active",
			selectedModel,
			activeModel,
			...reason ? { reason } : {}
		};
	}
	if (!normalizeMemoryFlush(value.memoryFlush)) {
		const compactionCount = normalizeCount(value.memoryFlushCompactionCount);
		const failureCount = normalizeCount(value.memoryFlushFailureCount);
		if (failureCount && failureCount > 0) next.memoryFlush = {
			kind: "failed",
			...compactionCount !== void 0 ? { compactionCount } : {},
			failureCount
		};
		else if (compactionCount !== void 0) next.memoryFlush = {
			kind: "succeeded",
			compactionCount
		};
	}
	return next;
}
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255 || trimmed !== trimmed.normalize("NFC")) return false;
	return /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._:@-]*$/u.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
/** Doctor and file import normalize persisted identities before publishing canonical rows. */
function normalizePersistedSessionEntryShape(value, options = {}) {
	if (!isRecord(value)) return;
	const modelSelectionLocked = value.modelSelectionLocked === true;
	let next = projectCanonicalSessionEntryShape(migrateLegacySessionEntryState(value));
	if (value.sessionId !== void 0) {
		if (!isSafeSessionId(value.sessionId)) return;
		const sessionId = value.sessionId.trim();
		const legacySessionFile = value.sessionFile;
		if (!modelSelectionLocked && options.sessionKey !== void 0 && parseAgentSessionKey(options.sessionKey) !== null && sessionId === options.sessionKey && (value.initializationPending === true || typeof legacySessionFile !== "string" || !legacySessionFile.trim())) {
			const { sessionId: _legacyPendingSessionId, ...pendingEntry } = next;
			next = {
				...pendingEntry,
				initializationPending: true
			};
		} else {
			if (modelSelectionLocked && sessionId !== value.sessionId) return;
			if (!normalizeTranscriptSessionId(sessionId)) return;
			if (sessionId !== value.sessionId) next = {
				...next,
				sessionId
			};
		}
	}
	const updatedAt = normalizeOptionalTimestamp(value.updatedAt);
	if (updatedAt !== value.updatedAt) next.updatedAt = updatedAt ?? 0;
	return next;
}
//#endregion
//#region src/config/sessions/store-maintenance-operations.ts
function collectReferencedSessionIds(store) {
	return new Set(Object.values(store).map((entry) => entry?.sessionId).filter((id) => Boolean(id)));
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
/**
* Applies automatic session-store maintenance to the in-memory file-store image.
*
* Future SQLite adapters should map this into named boundaries: entry retention,
* removed-session artifact cleanup, disk-budget eviction, and archive retention cleanup.
*/
async function applyFileBackedSessionStoreMaintenance(params) {
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.storePath,
		store: params.store
	});
	const warnOnly = maintenance.mode === "warn";
	if (!warnOnly) {
		const removedSessionFiles = /* @__PURE__ */ new Map();
		planSessionEntryMaintenance({
			maintenance,
			initialUnarchivedCount: countUnarchivedSessionEntries(params.store),
			readPreserveKeys: () => preserveSessionKeys,
			readAgeCandidates: () => params.store,
			readCapCandidates: () => ({
				store: params.store,
				maxEntries: maintenance.maxEntries
			}),
			onRemoved: ({ entry }) => {
				removedSessionFiles.set(entry.sessionId, void 0);
			}
		});
		await cleanupRemovedSessionArtifacts({
			operation: params,
			maintenance,
			removedSessionFiles,
			referencedSessionIds: collectReferencedSessionIds(params.store)
		});
	}
	await enforceSessionDiskBudget({
		store: params.store,
		storePath: params.storePath,
		maintenance,
		warnOnly,
		log: params.log,
		...!warnOnly ? {
			preserveKeys: preserveSessionKeys,
			commitEvictedIndex: params.commitReducedStore
		} : {}
	});
}
//#endregion
//#region src/infra/state-migrations.legacy-session-store.ts
const log = createSubsystemLogger("sessions/legacy-importer");
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime.js"));
const loadTrajectoryCleanupRuntime = createLazyRuntimeModule(() => import("./cleanup-BVpg2Pzl.mjs"));
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
		const pluginId = normalizeOptionalString(rawPluginId);
		if (!pluginId || !isRecord(rawPluginState)) {
			changed = true;
			continue;
		}
		changed ||= pluginId !== rawPluginId;
		const normalizedPluginState = {};
		for (const [rawNamespace, rawValue] of Object.entries(rawPluginState)) {
			const namespace = normalizeOptionalString(rawNamespace);
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
function normalizeLegacySessionStore(store) {
	for (const [key, entry] of Object.entries(store)) {
		assertSupportedSessionStoreEntry(entry);
		const modelSelectionLocked = isRecord(entry) && entry.modelSelectionLocked === true;
		const shaped = normalizePersistedSessionEntryShape(entry, { sessionKey: key });
		if (!shaped) {
			if (modelSelectionLocked) throw new Error(`Invalid model-selection-locked session entry: ${key}`);
			delete store[key];
			continue;
		}
		const runtimeFields = normalizeSessionRuntimeModelFields(shaped);
		if (modelSelectionLocked && runtimeFields !== shaped) throw new Error(`Invalid model-selection-locked session entry: ${key}`);
		let normalized = normalizeRestartRecoveryFields(normalizeLegacySessionEntryDelivery(migrateLegacySessionCreator(modelSelectionLocked ? shaped : runtimeFields)));
		normalized = normalizeLegacyPluginState(normalized, "pluginExtensions", (value) => isPluginJsonValue(value) ? value : void 0);
		normalized = normalizeLegacyPluginState(normalized, "pluginExtensionSlotKeys", (value) => {
			const slotKey = normalizeSessionEntrySlotKey(value);
			return slotKey.ok ? slotKey.key : void 0;
		});
		store[key] = stripRuntimeOnlySessionSkillsFields(normalized);
	}
	const harnessError = resolveAgentHarnessSessionStoreError(store);
	if (harnessError) throw new Error(harnessError);
}
function loadLegacySessionStore(storePath) {
	const { store } = readSessionStoreJson5(storePath);
	hydrateSessionStoreSkillPromptRefs({
		storePath,
		store
	});
	const sessionStore = store;
	normalizeLegacySessionStore(sessionStore);
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
	const { archiveSessionTranscriptsDetailed } = await loadSessionArchiveRuntime();
	const archivedDirs = /* @__PURE__ */ new Set();
	for (const [sessionId, sessionFile] of params.removedSessionFiles) {
		if (params.referencedSessionIds.has(sessionId)) continue;
		const archived = archiveSessionTranscriptsDetailed({
			sessionId,
			storePath: params.storePath,
			sessionFile,
			reason: params.reason,
			restrictToStoreDir: params.restrictToStoreDir
		});
		for (const { archivedPath } of archived) archivedDirs.add(path.dirname(archivedPath));
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
		await writeLegacySessionStoreUnlocked(storePath, store, lockedEntriesBefore, options);
		return result;
	});
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
function normalizeLegacySessionEntryDelivery(value) {
	assertSupportedSessionStoreEntry(value);
	const entry = isRecord(value) && hasLegacySessionProviderState(value) ? migrateLegacySessionEntryState(value) : value;
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
export { migrateLegacySessionEntryState as a, updateLegacySessionStore as i, normalizeLegacySessionEntryDelivery as n, normalizePersistedSessionEntryShape as o, saveLegacySessionStore as r, loadLegacySessionStore as t };
