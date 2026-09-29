import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, O as normalizeSessionKeyPreservingOpaquePeerIds, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-DBafeUlR.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-CAUcdkW5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { p as projectSqliteSessionParticipantsBatch } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { h as canonicalSessionKeyMigrationRequiredError, i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { T as resolveSessionStorePathForScope, a as listSessionEntryRows, d as patchSessionEntryCore, f as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { a as loadExactSessionEntryReadOnly, n as loadExactSessionEntryCandidates, s as resolveSessionEntry, t as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import "./session-accessor.sqlite-canonical-repair-DXPvg1eL.mjs";
//#region src/config/sessions/plugin-host-cleanup.ts
function collectStoredSessionEntrySlotKeys(entry, pluginId) {
	const slotKeys = /* @__PURE__ */ new Set();
	const storedSlotKeys = entry.pluginExtensionSlotKeys;
	if (!storedSlotKeys) return slotKeys;
	const records = pluginId === void 0 ? Object.values(storedSlotKeys) : storedSlotKeys[pluginId] ? [storedSlotKeys[pluginId]] : [];
	for (const record of records) for (const slotKey of Object.values(record)) {
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	return slotKeys;
}
function collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectStoredSessionEntrySlotKeys(entry, pluginId);
	for (const slotKey of sessionEntrySlotKeys ?? []) slotKeys.add(slotKey);
	return slotKeys;
}
function clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys, options = {}) {
	const slotKeys = options.includeStoredSlotKeys === false && sessionEntrySlotKeys ? new Set(sessionEntrySlotKeys) : collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	for (const slotKey of slotKeys) Reflect.deleteProperty(entry, slotKey);
	if (!options.pruneSlotOwnership || !entry.pluginExtensionSlotKeys) return;
	const pruneRecord = (record) => {
		for (const [namespace, slotKey] of Object.entries(record)) {
			const normalized = normalizeSessionEntrySlotKey(slotKey);
			if (normalized.ok && slotKeys.has(normalized.key)) delete record[namespace];
		}
	};
	if (pluginId) {
		const record = entry.pluginExtensionSlotKeys[pluginId];
		if (record) {
			pruneRecord(record);
			if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[pluginId];
		}
	} else {
		for (const record of Object.values(entry.pluginExtensionSlotKeys)) pruneRecord(record);
		for (const [ownerPluginId, record] of Object.entries(entry.pluginExtensionSlotKeys)) if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[ownerPluginId];
	}
	if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
}
/** Clears plugin-owned extension state from one session entry. */
function clearPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys);
	if (!pluginId) {
		delete entry.pluginExtensions;
		delete entry.pluginExtensionSlotKeys;
		delete entry.pluginNextTurnInjections;
		return;
	}
	if (entry.pluginExtensions) {
		delete entry.pluginExtensions[pluginId];
		if (Object.keys(entry.pluginExtensions).length === 0) delete entry.pluginExtensions;
	}
	if (entry.pluginExtensionSlotKeys) {
		delete entry.pluginExtensionSlotKeys[pluginId];
		if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
	}
	if (entry.pluginNextTurnInjections) {
		delete entry.pluginNextTurnInjections[pluginId];
		if (Object.keys(entry.pluginNextTurnInjections).length === 0) delete entry.pluginNextTurnInjections;
	}
}
function hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	if (slotKeys.size === 0) return false;
	for (const slotKey of slotKeys) if (Object.hasOwn(entry, slotKey)) return true;
	return false;
}
function hasPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	if (hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys)) return true;
	if (!pluginId) return Boolean(entry.pluginExtensions || entry.pluginExtensionSlotKeys || entry.pluginNextTurnInjections);
	return Boolean(entry.pluginExtensions?.[pluginId] || entry.pluginExtensionSlotKeys?.[pluginId] || entry.pluginNextTurnInjections?.[pluginId]);
}
function matchesPluginHostCleanupSession(entryKey, entry, sessionKey) {
	const normalizedSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
	if (!normalizedSessionKey) return true;
	return normalizeSessionKeyPreservingOpaquePeerIds(entryKey) === normalizedSessionKey || entry.sessionId.trim().toLowerCase() === sessionKey?.trim().toLowerCase();
}
function shouldSkipPluginHostCleanupStore(params) {
	if (!params.pluginId && !params.sessionKey) return true;
	return params.mode === "promoted-slots" && (params.sessionEntrySlotKeys?.size ?? 0) === 0;
}
function hasPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") return hasPromotedSessionEntrySlot(entry, params.pluginId, params.sessionEntrySlotKeys);
	return hasPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
function isLockedHarnessSessionOwnedByPlugin(entry, preserveLockedHarnessIds) {
	if (entry.modelSelectionLocked !== true || !preserveLockedHarnessIds?.size) return false;
	const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
	return harnessId !== void 0 && preserveLockedHarnessIds.has(harnessId);
}
function clearPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") {
		clearPromotedSessionEntrySlots(entry, params.pluginId, params.sessionEntrySlotKeys, {
			includeStoredSlotKeys: false,
			pruneSlotOwnership: true
		});
		return;
	}
	clearPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-summary.ts
/** Reads counts and bounded recent session payloads without warming the store cache. */
function readSessionStoreSummaryReadOnly(scope, options) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const summary = {
		count: 0,
		recent: [],
		byAgent: new Map(options.agentIds.map((agentId) => [agentId, {
			count: 0,
			recent: []
		}]))
	};
	const result = withOpenClawAgentDatabaseReadOnly((database) => withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const db = getSessionKysely(database.db);
		const batchSize = Math.min(128, Math.max(1, Math.ceil(options.recentLimit) || 1) * Math.max(1, summary.byAgent.size));
		let candidates = [];
		const readCandidates = () => {
			if (candidates.length === 0) return;
			const rows = candidates;
			candidates = [];
			const storedRows = new Map(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "in", sqliteStringSet(rows.map((row) => row.sessionKey)))).rows.map((row) => [row.session_key, row]));
			const selectedEntries = [];
			for (const { sessionKey, entryValid, agent } of rows) {
				const needsRecent = summary.recent.length < options.recentLimit || agent !== void 0 && agent.recent.length < options.recentLimit;
				if (entryValid === 1 && !needsRecent) {
					summary.count += 1;
					if (agent) agent.count += 1;
					continue;
				}
				const stored = storedRows.get(sessionKey);
				if (!stored) continue;
				const { current_session_id: _currentSessionId, ...listRow } = stored;
				const entry = parseSessionEntryJson(listRow);
				if (!entry) continue;
				summary.count += 1;
				const selected = {
					sessionKey,
					entry
				};
				selectedEntries.push(selected);
				if (summary.recent.length < options.recentLimit) summary.recent.push(selected);
				if (agent) {
					agent.count += 1;
					if (agent.recent.length < options.recentLimit) agent.recent.push(selected);
				}
			}
			if (selectedEntries.length === 0) return;
			const projected = projectSqliteSessionParticipantsBatch(database.db, new Map(selectedEntries.map(({ sessionKey, entry }) => [sessionKey, entry])));
			for (const { sessionKey, entry } of selectedEntries) {
				Object.assign(entry, projected.get(sessionKey));
				const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
				if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
			}
		};
		for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "entry_valid"]).orderBy("updated_at", "desc").orderBy("session_key", "asc"))) {
			const owner = parseAgentSessionKey(row.session_key)?.agentId;
			if (!owner || isInternalSessionEffectsKey(row.session_key)) continue;
			const agent = summary.byAgent.get(owner);
			if (row.entry_valid === 1 && summary.recent.length >= options.recentLimit && (!agent || agent.recent.length >= options.recentLimit)) {
				summary.count += 1;
				if (agent) agent.count += 1;
				continue;
			}
			candidates.push({
				sessionKey: row.session_key,
				entryValid: row.entry_valid,
				agent
			});
			if (candidates.length >= batchSize) readCandidates();
		}
		readCandidates();
		return summary;
	})), toDatabaseOptions(resolved));
	return result.found ? result.value : summary;
}
//#endregion
//#region src/config/sessions/session-accessor.entry.ts
/** Resolves a session directly through canonical SQLite row and alias ownership. */
function resolveSessionEntrySelection(scope, options = {}) {
	return resolveSessionEntry(scope, options);
}
function resolveAccessStorePath(scope) {
	return resolveSessionStorePathForScope(scope);
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveLogicalSessionStoreCandidates(params) {
	const storeConfig = params.cfg.session?.store;
	const defaultTarget = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: params.agentId,
			env: params.env
		})
	};
	if (!isStorePathTemplate(storeConfig)) return [defaultTarget];
	const targets = /* @__PURE__ */ new Map();
	targets.set(defaultTarget.storePath, defaultTarget);
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) if (target.agentId === params.agentId) targets.set(target.storePath, target);
	return [...targets.values()];
}
function buildLogicalSessionEntryCandidateKeys(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.requestedKey && params.requestedKey !== params.canonicalKey) targets.add(params.requestedKey);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function findCanonicalSessionEntryMatch(scope, canonicalKey, candidateKeys, options = {}) {
	let selected;
	let readSource;
	for (const match of loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: candidateKeys,
		readOnly: options.readOnly !== false,
		onReadSource: (source, physical) => {
			readSource = physical ? {
				...source,
				databaseIdentity: physical.identity,
				databaseBirthtime: physical.birthtime
			} : void 0;
		}
	})) {
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match.sessionKey !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
		selected = match;
	}
	return selected ? {
		...selected,
		readSource
	} : void 0;
}
function resolveSessionEntryAccessTarget(scope, options) {
	const target = resolveSessionEntryStoreTarget(scope);
	if (options?.keyFormat === "agent-qualified") return projectQualifiedSessionEntryTarget(scope, target);
	return {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: target.entry,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey
	};
}
/** Resolves ordered candidate keys inside one agent-owned session store. */
function resolveSessionEntryCandidateTarget(scope) {
	const candidateKeys = uniqueStrings(scope.candidateKeys.map((key) => key.trim()));
	const incognitoKey = candidateKeys.find(isIncognitoSessionKey);
	const incognitoAgentId = incognitoKey ? resolveAgentIdFromSessionKey(incognitoKey) : void 0;
	const storePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : resolveSessionStorePathCore(scope.cfg.session?.store, {
		agentId: scope.agentId,
		env: scope.env
	});
	const resolvedAgentId = incognitoAgentId ?? scope.agentId;
	for (const candidateKey of candidateKeys) {
		if (!candidateKey) continue;
		const resolved = resolveSessionEntrySelection({
			agentId: resolvedAgentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: candidateKey,
			storePath
		}, { readOnly: !incognitoAgentId });
		if (!resolved.existing) continue;
		return {
			agentId: resolvedAgentId,
			candidateKey,
			entry: resolved.existing,
			persisted: true,
			sessionKey: resolved.normalizedKey
		};
	}
	const fallbackKey = scope.fallback?.sessionKey.trim();
	if (!fallbackKey || !scope.fallback) return null;
	return {
		agentId: resolvedAgentId,
		candidateKey: fallbackKey,
		entry: structuredClone(scope.fallback.entry),
		persisted: false,
		sessionKey: fallbackKey
	};
}
function resolveSessionEntryStoreTarget(scope) {
	const requestedKey = scope.sessionKey.trim();
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg: scope.cfg,
		sessionKey: requestedKey,
		agentId: scope.agentId
	});
	const scanTargets = buildLogicalSessionEntryCandidateKeys({
		agentId,
		canonicalKey,
		cfg: scope.cfg,
		requestedKey
	});
	if (isIncognitoSessionKey(canonicalKey)) {
		const incognitoAgentId = resolveAgentIdFromSessionKey(canonicalKey);
		const storePath = resolveIncognitoOpenClawAgentSqlitePath({
			agentId: incognitoAgentId,
			env: scope.env
		});
		const selectedMatch = findCanonicalSessionEntryMatch({
			agentId: incognitoAgentId,
			...scope.env ? { env: scope.env } : {},
			storePath
		}, canonicalKey, scanTargets, { readOnly: false });
		return {
			agentId: incognitoAgentId,
			canonicalKey,
			entry: selectedMatch?.entry,
			requestedKey,
			storeKey: selectedMatch?.sessionKey ?? canonicalKey,
			storePath,
			readSource: selectedMatch?.readSource
		};
	}
	const candidates = resolveLogicalSessionStoreCandidates({
		agentId,
		cfg: scope.cfg,
		env: scope.env
	});
	const fallback = candidates[0] ?? {
		agentId,
		storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
			agentId,
			env: scope.env
		})
	};
	let selectedStorePath = fallback.storePath;
	let selectedMatch = findCanonicalSessionEntryMatch({
		agentId,
		...scope.env ? { env: scope.env } : {},
		storePath: fallback.storePath
	}, canonicalKey, scanTargets);
	for (let index = 1; index < candidates.length; index += 1) {
		const candidate = candidates[index];
		if (!candidate) continue;
		const match = findCanonicalSessionEntryMatch({
			agentId,
			...scope.env ? { env: scope.env } : {},
			storePath: candidate.storePath
		}, canonicalKey, scanTargets);
		if (match && selectedMatch) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match) {
			selectedStorePath = candidate.storePath;
			selectedMatch = match;
		}
	}
	return {
		agentId,
		canonicalKey,
		entry: selectedMatch?.entry,
		requestedKey,
		storeKey: selectedMatch?.sessionKey ?? canonicalKey,
		storePath: selectedStorePath,
		readSource: selectedMatch?.readSource
	};
}
function projectQualifiedSessionEntryTarget(scope, target) {
	if (target.entry && !target.readSource) throw new Error("Qualified session projection requires its captured physical source");
	const canonicalKey = toAgentStoreSessionKey({
		agentId: target.agentId,
		requestKey: target.storeKey
	});
	const storeKeys = [target.storeKey];
	const parsed = parseAgentSessionKey(canonicalKey);
	if (parsed?.rest === "global" || parsed?.rest === "unknown") {
		const legacyOwner = resolvePersistedSessionStoreOwnerForTarget({
			config: scope.cfg,
			sessionKey: parsed.rest,
			storePath: target.storePath,
			env: scope.env
		});
		if (legacyOwner.kind === "none" || legacyOwner.agentId === target.agentId) storeKeys.push(parsed.rest, canonicalKey);
	}
	const keys = uniqueStrings(storeKeys);
	if (keys.length > 1 && target.entry && target.readSource) {
		if (loadExactSessionEntryCandidates({
			readSource: target.readSource,
			expectedSource: target.readSource,
			env: scope.env,
			readOnly: true,
			sessionKeys: keys.filter((key) => key !== target.storeKey)
		}).length > 0) throw canonicalSessionKeyMigrationRequiredError(`ambiguous stored identity for qualified session key ${canonicalKey}`);
	}
	return {
		keyFormat: "agent-qualified",
		agentId: target.agentId,
		canonicalKey,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey,
		storeKeys: keys,
		storePath: target.readSource?.path ?? target.storePath,
		entry: target.entry,
		readSource: target.readSource
	};
}
/**
* Mutates the canonical logical session entry without exposing the
* backing store map to callers.
*/
async function updateResolvedSessionEntry(scope, update, options) {
	const captured = options?.target;
	const target = captured ?? resolveSessionEntryStoreTarget(scope);
	const source = captured?.readSource;
	if (!target.entry || captured && !source) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	if (captured) {
		const current = resolveSessionStoreIdentity({
			cfg: scope.cfg,
			sessionKey: scope.sessionKey,
			agentId: scope.agentId
		});
		if (scope.sessionKey.trim() !== captured.requestedKey || current.agentId !== captured.agentId || current.canonicalKey !== captured.storeKey) throw new Error("Captured session selector changed before update");
	}
	const expectedSessionId = target.entry.sessionId;
	const expectedLifecycleRevision = target.entry.lifecycleRevision;
	let updateResult;
	const apply = async (entry) => {
		if (captured && (entry.sessionId !== expectedSessionId || entry.lifecycleRevision !== expectedLifecycleRevision)) throw new Error("Captured session generation changed before update");
		updateResult = await update(entry, {
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			entry,
			requestedKey: target.requestedKey,
			storeKey: target.storeKey
		});
		return entry;
	};
	const patchOptions = {
		replaceEntry: true,
		skipMaintenance: true
	};
	const updated = captured && source ? await patchSessionEntryTarget({
		agentId: captured.agentId,
		env: scope.env,
		storePath: source.path,
		readSource: source,
		target: {
			canonicalKey: captured.storeKey,
			storeKeys: [...captured.storeKeys]
		}
	}, apply, patchOptions) : await patchSessionEntryCore({
		agentId: target.agentId,
		sessionKey: target.storeKey,
		storePath: target.storePath
	}, apply, patchOptions);
	if (!updated) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	return {
		canonicalKey: target.canonicalKey,
		entry: structuredClone(updated),
		found: true,
		result: updateResult,
		storeKey: target.storeKey
	};
}
/** Lists entries from the resolved store, preserving the persisted key for each row. */
function listSessionEntriesCore(scope = {}) {
	if (scope.clone === false) return openSessionEntryReadView(scope).entries();
	return listSessionEntryRows(scope);
}
/**
* Synchronous read view: `get` queries one exact persisted key without alias resolution;
* `entries` caches listing metadata or loads complete entries. Rows and nested values are
* borrowed: callers must not mutate them and must drop the view before any await.
*/
function openSessionEntryReadView(scope = {}) {
	return {
		get: (sessionKey) => (isIncognitoSessionKey(sessionKey) ? loadExactSessionEntry : loadExactSessionEntryReadOnly)({
			...scope,
			clone: false,
			sessionKey
		})?.entry,
		entries: () => listSessionEntriesReadOnly({
			...scope,
			clone: false
		})
	};
}
/**
* Applies an atomic patch and returns the persisted key selected by the backing
* store. Use when a caller must keep sidecar state keyed to the final row.
*/
async function patchSessionEntryWithKey(scope, update, options = {}) {
	const entry = await patchSessionEntryCore(scope, update, options);
	return entry ? {
		sessionKey: normalizeStoreSessionKey(scope.sessionKey),
		entry
	} : null;
}
//#endregion
export { resolveSessionEntryAccessTarget as a, updateResolvedSessionEntry as c, clearPluginOwnedSessionState as d, hasPluginHostCleanupTarget as f, shouldSkipPluginHostCleanupStore as h, resolveAccessStorePath as i, readSessionStoreSummaryReadOnly as l, matchesPluginHostCleanupSession as m, openSessionEntryReadView as n, resolveSessionEntryCandidateTarget as o, isLockedHarnessSessionOwnedByPlugin as p, patchSessionEntryWithKey as r, resolveSessionEntrySelection as s, listSessionEntriesCore as t, clearPluginHostCleanupTarget as u };
