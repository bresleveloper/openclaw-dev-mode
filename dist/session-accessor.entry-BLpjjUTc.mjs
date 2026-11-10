import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as collectCanonicalSessionLookupKeys } from "./main-session-key-BNNxukz6.mjs";
import "./plugin-host-cleanup-DPJxrJDM.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureMemoryExactSessionReader, t as assertMemoryExactReadSource } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as captureSessionEntryReadScope } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-DJGC6v85.mjs";
import { n as readSessionEntriesFromStoreInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { i as selectCanonicalSessionEntryMatch, r as readResolvedSessionStoreTargetsInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { o as patchSessionEntryCore, r as listSessionEntryRows, s as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { a as loadExactSessionEntryReadOnly, l as resolveSessionEntry, n as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import "./session-accessor.sqlite-summary-_7FvNyNg.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-children-read.ts
/** Lists direct child rows without cloning or rebuilding the complete session store. */
async function listSessionChildEntriesReadOnly(scope, parentSessionKeys = [scope.sessionKey]) {
	const memory = captureMemoryExactSessionReader(scope);
	if (memory) return memory.children(parentSessionKeys, scope.projection);
	const captured = captureSessionEntryReadScope(scope);
	const storePath = captured.scope.storePath ?? (captured.agentId && resolveOpenClawAgentSqlitePath({
		agentId: captured.agentId,
		env: captured.env
	}));
	if (!storePath) throw new Error("Cannot resolve SQLite session scope without an agent id");
	return withSessionStoreReaderInWorker({
		agentId: captured.agentId,
		storePath,
		env: captured.env
	}, async ({ reader, database, continuation, logicalAgentId }) => {
		return (await reader.readExactEntries({
			selection: {
				kind: "children",
				parentSessionKeys: parentSessionKeys.map((key) => resolveSqliteSessionKey(key, logicalAgentId))
			},
			projection: scope.projection === "list" ? "list" : "full",
			snapshotFields: typeof scope.projection === "object" ? scope.projection : void 0,
			env: database.env,
			continuation
		})).entries;
	}, {
		backing: true,
		dataOnly: true
	});
}
//#endregion
//#region src/config/sessions/session-entry-candidate-runtime.ts
/** Resolve ordered candidates through the session owner without synchronous discovery. */
async function resolveSessionEntryCandidateTargetForRuntime(scope) {
	const candidates = uniqueStrings(scope.candidateKeys.map((key) => key.trim()).filter(Boolean));
	const sessionKey = candidates.find(isIncognitoSessionKey);
	const memory = sessionKey ? captureMemoryExactSessionReader({
		...scope,
		sessionKey,
		agentId: resolveAgentIdFromSessionKey(sessionKey)
	}) : void 0;
	const agentId = memory?.agentId ?? scope.agentId;
	const keys = candidates.map((candidateKey) => ({
		candidateKey,
		sessionKey: resolveSqliteSessionKey(candidateKey, agentId)
	}));
	const fallback = () => {
		const entry = scope.fallback;
		const fallbackKey = entry?.sessionKey.trim();
		return entry && fallbackKey ? {
			agentId,
			candidateKey: fallbackKey,
			entry: structuredClone(entry.entry),
			persisted: false,
			sessionKey: fallbackKey
		} : null;
	};
	if (memory) {
		for (const key of keys) {
			if (!isIncognitoSessionKey(key.sessionKey)) continue;
			const entry = memory.read(key.sessionKey);
			if (entry) return {
				agentId,
				...key,
				entry,
				persisted: true
			};
		}
		return fallback();
	}
	if (keys.length === 0) return fallback();
	const read = await readSessionEntriesFromStoreInWorker({
		agentId,
		env: scope.env,
		storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
			agentId,
			env: scope.env
		}),
		sessionKeys: keys.map((key) => key.sessionKey),
		projection: "exact"
	});
	for (const key of keys) {
		const entry = read.entries.find((row) => row.sessionKey === key.sessionKey)?.entry;
		if (entry) return {
			agentId,
			...key,
			entry,
			persisted: true
		};
	}
	return fallback();
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
	let readSource;
	const entries = loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: candidateKeys,
		readOnly: options.readOnly !== false,
		onReadSource: (source) => {
			readSource = source;
		}
	});
	const selected = selectCanonicalSessionEntryMatch(entries, canonicalKey);
	return selected ? {
		...selected,
		readSource
	} : void 0;
}
function resolveSessionEntryAccessTarget(scope, options) {
	const target = resolveSessionEntryStoreTarget(scope);
	if (options?.keyFormat === "agent-qualified") return prepareQualifiedSessionEntryTarget(target, void 0, scope.env);
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
	const memory = incognitoKey ? captureMemoryExactSessionReader({
		...scope,
		sessionKey: incognitoKey,
		agentId: incognitoAgentId
	}) : void 0;
	const storePath = memory?.path ?? resolveSessionStorePathCore(scope.cfg.session?.store, {
		agentId: scope.agentId,
		env: scope.env
	});
	const resolvedAgentId = memory?.agentId ?? scope.agentId;
	for (const candidateKey of candidateKeys) {
		if (!candidateKey) continue;
		if (memory) {
			const sessionKey = resolveSqliteSessionKey(candidateKey, memory.agentId);
			if (!isIncognitoSessionKey(sessionKey)) continue;
			const entry = memory.read(sessionKey);
			if (entry) return {
				agentId: memory.agentId,
				candidateKey,
				entry,
				persisted: true,
				sessionKey
			};
			continue;
		}
		const resolved = resolveSessionEntry({
			agentId: resolvedAgentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: candidateKey,
			storePath
		}, { readOnly: true });
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
	const memory = captureMemoryExactSessionReader({
		...scope,
		agentId,
		sessionKey: canonicalKey
	});
	if (memory) return {
		agentId: memory.agentId,
		canonicalKey,
		entry: memory.read(canonicalKey),
		requestedKey,
		storeKey: canonicalKey,
		storePath: memory.path,
		readSource: memory.source
	};
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
	let selectedMatch;
	for (const candidate of [fallback, ...candidates.slice(1)]) {
		const match = findCanonicalSessionEntryMatch({
			agentId,
			...scope.env ? { env: scope.env } : {},
			storePath: candidate.storePath
		}, canonicalKey, scanTargets, { readOnly: true });
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
async function prepareQualifiedSessionEntryTarget(target, readSources = [], env) {
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
	const capturedSources = target.readSource ? [target.readSource, ...readSources.filter((source) => !isDeepStrictEqual(source, target.readSource))] : readSources;
	await Promise.all(capturedSources.map(async (readSource) => {
		const selectedSource = readSource.agentId === target.readSource?.agentId && readSource.databaseIdentity === target.readSource.databaseIdentity && readSource.databaseBirthtime === target.readSource.databaseBirthtime;
		const sessionKeys = physicalKeys(readSource.agentId).filter((key) => !selectedSource || key !== target.storeKey);
		if (!sessionKeys.length) return;
		const memory = captureMemoryExactSessionReader({
			agentId: readSource.agentId,
			storePath: readSource.path
		});
		let occupied;
		if (memory) {
			assertMemoryExactReadSource(readSource, memory.source);
			occupied = sessionKeys.some((key) => memory.read(key, "list"));
		} else {
			const result = await readSessionEntriesFromStoreInWorker({
				agentId: readSource.agentId,
				storePath: readSource.path,
				sessionKeys,
				projection: "sharing",
				includeAuthorization: true,
				env
			});
			if (result.sharing?.source.agentId !== readSource.agentId || result.databaseIdentity?.identity !== readSource.databaseIdentity || result.databaseIdentity?.birthtime !== readSource.databaseBirthtime) throw new Error("Captured session database changed before read");
			occupied = result.entries.length > 0 || result.sharing.placeholders.length > 0;
		}
		if (occupied) throw new Error(`Session "${canonicalKey}" has ambiguous stored identity. Select an unambiguous session; stored rows and history were not changed.`);
	}));
	return qualified;
}
/**
* Mutates the canonical logical session entry without exposing the
* backing store map to callers.
*/
async function updateResolvedSessionEntry(scope, update, options) {
	const captured = options?.target;
	const requestedKey = scope.sessionKey.trim();
	const identity = resolveSessionStoreIdentity({
		...scope,
		sessionKey: requestedKey
	});
	const target = captured ?? (isIncognitoSessionKey(identity.canonicalKey) ? resolveSessionEntryStoreTarget(scope) : scope.cfg.session?.store?.includes("{agentId}") ? expectDefined((await readResolvedSessionStoreTargetsInWorker({
		...scope,
		sessionKeys: [scope.sessionKey]
	})).get(scope.sessionKey), "session update target") : {
		...identity,
		requestedKey,
		storeKey: identity.canonicalKey,
		storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
			agentId: identity.agentId,
			env: scope.env
		})
	});
	const source = captured?.readSource;
	if (captured && (!captured.entry || !source)) return {
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
	const expectedSessionId = captured?.entry?.sessionId;
	const expectedLifecycleRevision = captured?.entry?.lifecycleRevision;
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
		get: (sessionKey) => loadExactSessionEntryReadOnly({
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
export { resolveSessionEntryAccessTarget as a, resolveSessionEntryCandidateTargetForRuntime as c, prepareQualifiedSessionEntryTarget as i, listSessionChildEntriesReadOnly as l, openSessionEntryReadView as n, resolveSessionEntryCandidateTarget as o, patchSessionEntryWithKey as r, updateResolvedSessionEntry as s, listSessionEntriesCore as t };
