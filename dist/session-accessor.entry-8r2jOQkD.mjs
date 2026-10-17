import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as collectCanonicalSessionLookupKeys } from "./main-session-key-DrfSAS1s.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { i as readSessionEntriesByStatus, t as hasSessionEntriesByStatus } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { g as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-D1TSJMmX.mjs";
import { d as retainSessionEntryKeyAbsence, n as loadExactSessionEntry, o as loadExactSessionEntryReadOnly, r as loadExactSessionEntryCandidates, u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { c as patchSessionEntryTarget, r as listSessionEntryRows, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor.sqlite-canonical-repair-C-uEV7oa.mjs";
import "./plugin-host-cleanup-tR73X5Oy.mjs";
import { f as withSessionStoreReaderInWorker, n as isNativeSessionEntryRead, t as captureSessionEntryReadScope } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import "./session-accessor.sqlite-summary-jueQurL0.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-status-read.ts
async function readSessionStatusSelection(input, statuses, presenceOnly) {
	const { scope, agentId } = captureSessionEntryReadScope({
		...input,
		sessionKey: ""
	});
	const selected = [...new Set(statuses)];
	if (selected.length === 0) return {
		entries: [],
		statusFound: false
	};
	if (isNativeSessionEntryRead(scope, agentId)) {
		const options = toDatabaseOptions(resolveSqliteScope(scope));
		if (!presenceOnly) return {
			entries: readSessionEntriesByStatus(openOpenClawAgentDatabase(options), selected),
			statusFound: false
		};
		const read = withOpenClawAgentDatabaseReadOnly((database) => hasSessionEntriesByStatus(database, selected), options);
		return {
			entries: [],
			statusFound: read.found ? read.value : read.reason !== "database-missing"
		};
	}
	const storePath = scope.storePath || agentId && resolveOpenClawAgentSqlitePath({
		agentId,
		env: scope.env
	});
	if (!storePath) throw new Error("Cannot resolve SQLite session scope without an agent id");
	const source = createOpenClawAgentDatabasePathMatcher();
	let assertAdmitted;
	const result = await withSessionStoreReaderInWorker({
		...scope,
		agentId,
		storePath
	}, async ({ reader, database, logicalAgentId, assertCurrent }) => {
		if (!presenceOnly) {
			assertAdmitted = () => {
				assertAgentDatabaseAdmitted(logicalAgentId, { env: database.env });
				assertAgentDatabaseAdmitted(database.agentId, { env: database.env });
			};
			assertAdmitted();
		}
		source(database.path, database.path);
		const read = await reader.readExactEntries({
			env: database.env,
			sessionKeys: [],
			statusSelection: {
				statuses: selected,
				presenceOnly
			}
		});
		assertCurrent();
		assertAdmitted?.();
		return read;
	}, { dataOnly: true });
	if (!source.isCurrent()) throw new Error("Session database changed while reading recovery status; retry the read.");
	assertAdmitted?.();
	return result;
}
/** Unknown existing schemas remain eligible for recovery's writable admission owner. */
async function hasSessionEntriesByStatusReadOnly(scope, statuses) {
	return (await readSessionStatusSelection(scope, statuses, true)).statusFound === true;
}
async function listSessionEntriesByStatus(scope, statuses) {
	return (await readSessionStatusSelection(scope, statuses, false)).entries.filter(({ sessionKey }) => !isInternalSessionEffectsKey(sessionKey));
}
//#endregion
//#region src/config/sessions/session-accessor.entry.ts
function resolveLogicalSessionStoreCandidates(params) {
	const storeConfig = params.cfg.session?.store;
	const defaultTarget = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: params.agentId,
			env: params.env
		})
	};
	if (typeof storeConfig !== "string" || !storeConfig.includes("{agentId}")) return [defaultTarget];
	const targets = /* @__PURE__ */ new Map();
	targets.set(defaultTarget.storePath, defaultTarget);
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) if (target.agentId === params.agentId) targets.set(target.storePath, target);
	return [...targets.values()];
}
function findCanonicalSessionEntryMatch(scope, canonicalKey, candidateKeys, options = {}) {
	let selected;
	let readSource;
	for (const match of loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: candidateKeys,
		readOnly: options.readOnly !== false,
		onReadSource: (source) => {
			readSource = source;
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
		const resolved = resolveSessionEntry({
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
	const scanTargets = collectCanonicalSessionLookupKeys({
		agentId,
		canonicalKey,
		mainKey: scope.cfg.session?.mainKey,
		requestedKey
	});
	const incognito = isIncognitoSessionKey(canonicalKey);
	const targetAgentId = incognito ? resolveAgentIdFromSessionKey(canonicalKey) : agentId;
	const candidates = incognito ? [{
		agentId: targetAgentId,
		storePath: resolveIncognitoOpenClawAgentSqlitePath({
			agentId: targetAgentId,
			env: scope.env
		})
	}] : resolveLogicalSessionStoreCandidates({
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
	let selectedMatch;
	for (const candidate of [fallback, ...candidates.slice(1)]) {
		const match = findCanonicalSessionEntryMatch({
			agentId: targetAgentId,
			...scope.env ? { env: scope.env } : {},
			storePath: candidate.storePath
		}, canonicalKey, scanTargets, { readOnly: !incognito });
		if (match && selectedMatch) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match) {
			selectedStorePath = candidate.storePath;
			selectedMatch = match;
		}
	}
	return {
		agentId: targetAgentId,
		canonicalKey,
		entry: selectedMatch?.entry,
		requestedKey,
		storeKey: selectedMatch?.sessionKey ?? canonicalKey,
		storePath: selectedStorePath,
		readSource: selectedMatch?.readSource
	};
}
function projectQualifiedSessionEntryTarget(scope, target) {
	const prepared = prepareQualifiedSessionEntryTarget(target, void 0, scope.env);
	try {
		return prepared.target;
	} finally {
		prepared.release();
	}
}
function prepareQualifiedSessionEntryTarget(target, readSources = [], env) {
	if (target.entry && !target.readSource) throw new Error("Qualified session projection requires its captured physical source");
	const canonicalKey = toAgentStoreSessionKey({
		agentId: target.agentId,
		requestKey: target.storeKey
	});
	const parsed = parseAgentSessionKey(canonicalKey);
	const physicalKeys = (physicalAgentId) => {
		if (parsed?.rest !== "global" && parsed?.rest !== "unknown") return [canonicalKey];
		return physicalAgentId === target.agentId ? [parsed.rest, canonicalKey] : [canonicalKey];
	};
	const qualified = {
		keyFormat: "agent-qualified",
		agentId: target.agentId,
		canonicalKey,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey,
		storeKeys: uniqueStrings([target.storeKey, ...physicalKeys(target.readSource?.agentId ?? target.agentId)]),
		storePath: target.readSource?.path ?? target.storePath,
		entry: target.entry,
		readSource: target.readSource
	};
	const sources = [];
	let active = true;
	const release = () => {
		active = false;
		const failures = [];
		for (let index = sources.length - 1; index >= 0; index--) try {
			sources[index].release();
			sources.splice(index, 1);
		} catch (error) {
			failures.push(error);
		}
		if (failures.length) throw new AggregateError(failures, "Qualified session sources could not be released");
	};
	try {
		const capturedSources = target.readSource ? [target.readSource, ...readSources.filter((source) => !isDeepStrictEqual(source, target.readSource))] : readSources;
		for (const readSource of capturedSources) {
			const selectedSource = readSource.agentId === target.readSource?.agentId && readSource.databaseIdentity === target.readSource.databaseIdentity && readSource.databaseBirthtime === target.readSource.databaseBirthtime;
			sources.push(retainSessionEntryKeyAbsence({
				source: readSource,
				canonicalKey,
				sessionKeys: physicalKeys(readSource.agentId).filter((key) => !selectedSource || key !== target.storeKey),
				env
			}));
		}
		return {
			target: qualified,
			assertCurrent: () => {
				if (!active) throw new Error("Qualified session target is no longer active");
				for (const source of sources) source.assertCurrent();
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
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
export { resolveSessionEntryAccessTarget as a, hasSessionEntriesByStatusReadOnly as c, prepareQualifiedSessionEntryTarget as i, listSessionEntriesByStatus as l, openSessionEntryReadView as n, resolveSessionEntryCandidateTarget as o, patchSessionEntryWithKey as r, updateResolvedSessionEntry as s, listSessionEntriesCore as t };
