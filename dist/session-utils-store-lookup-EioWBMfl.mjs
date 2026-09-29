import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-caBszKSJ.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { c as resolveExistingAgentSessionStoreTargetsSync, d as isConfiguredSessionStoreAgentId } from "./targets-Dmb8-YXN.mjs";
import { n as listSessionChildEntriesReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { n as loadExactSessionEntryCandidates, r as loadExactSessionEntryCandidatesReadOnlyBatch } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { a as resolveStoredSessionKeyForAgentStore, r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-CwzWysXO.mjs";
import { m as listSubagentSessionListRunsForControllers } from "./subagent-registry-read-C2SIiLpb.mjs";
import "./sessions-DE4llkPV.mjs";
import { n as resolveGatewaySessionStoreReadResults, t as findCanonicalStoreMatch } from "./session-utils-store-selection-ffLf8R4b.mjs";
//#region src/gateway/session-utils-store-read.ts
/** Single-target resolution keeps its original lazy read and failure order. */
function readGatewaySessionStore(read) {
	if (read.result === void 0) {
		const loaded = loadGatewaySessionLookupStore(read.storePath, read.clone, read.agentId, read.options);
		read.result = ok(loaded.store);
		read.readSource = loaded.readSource;
	}
	if (!read.result.ok) throw read.result.error;
	return read.result.value;
}
/** Populate exact logical lookups without materializing unrelated store entries. */
function loadGatewaySessionStoreReads(reads) {
	const pending = reads.filter((read) => read.result === void 0);
	const results = loadExactSessionEntryCandidatesReadOnlyBatch(pending.map((read) => ({
		agentId: read.agentId,
		storePath: read.storePath,
		projection: read.options.projection,
		clone: false,
		sessionKeys: expectDefined(read.options.exactKeys, "exact batch lookup keys"),
		onReadSource: (source) => {
			read.readSource = source;
		}
	})));
	for (const [index, read] of pending.entries()) {
		const result = expectDefined(results[index], "exact batch lookup result");
		read.result = result.ok ? ok(Object.fromEntries(result.value.map(({ sessionKey, entry }) => [sessionKey, entry]))) : result;
		if (!result.ok) read.readSource = void 0;
	}
}
function loadGatewaySessionLookupStore(storePath, clone, agentId, options = {}) {
	const cache = options.cache;
	const cacheKey = cache ? `${storePath}\u0000${agentId ?? ""}\u0000${clone === false ? "0" : "1"}\u0000${options.readOnly}\u0000${options.projection ?? "full"}\u0000${options.exactKeys?.join("") ?? ""}\u0000${options.listKeys ? JSON.stringify(options.listKeys) : ""}` : "";
	if (cache) {
		const cached = cache.get(cacheKey);
		if (cached) return cached;
	}
	const loaded = loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options);
	cache?.set(cacheKey, loaded);
	return loaded;
}
function loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options = {}) {
	if (options.exactKeys) {
		let readSource;
		const target = options.readSource ? {
			readSource: options.readSource,
			readOnly: true
		} : {
			...agentId ? { agentId } : {},
			storePath,
			readOnly: options.readOnly !== false || clone === false
		};
		const entries = loadExactSessionEntryCandidates({
			...target,
			projection: options.projection,
			sessionKeys: options.exactKeys,
			onReadSource: (source) => {
				readSource = source;
			}
		});
		return {
			store: Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry])),
			...readSource ? { readSource } : {}
		};
	}
	const listEntries = options.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore;
	return { store: Object.fromEntries(listEntries({
		...agentId ? { agentId } : {},
		...clone === false ? { clone: false } : {},
		...options.projection ? { projection: options.projection } : {},
		...options.listKeys ? { sessionKeys: options.listKeys } : {},
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry])) };
}
//#endregion
//#region src/gateway/session-utils-store-lookup.ts
function buildGatewaySessionStoreScanTargets(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.key && params.key !== params.canonicalKey) targets.add(params.key);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function resolveGatewaySessionStoreCandidates(cfg, agentId, cache, excludeConfiguredFallback = false, env = process.env, registeredDatabases, resolveExistingTargets) {
	const cached = cache?.get(agentId);
	if (cached) return cached;
	const storeConfig = cfg.session?.store;
	const fallback = {
		agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId,
			env
		})
	};
	const excludeStorePath = !cache && excludeConfiguredFallback && !isPerAgentSessionStoreConfig(storeConfig) ? fallback.storePath : void 0;
	const discovery = {
		existing: resolveExistingTargets ? resolveExistingTargets(agentId, excludeStorePath) : resolveExistingAgentSessionStoreTargetsSync(cfg, agentId, {
			env,
			registeredDatabases,
			excludeStorePath
		}),
		fallback
	};
	cache?.set(agentId, discovery);
	return discovery;
}
function resolveGatewaySessionStoreLookupCandidates(params) {
	const configured = isConfiguredSessionStoreAgentId(params.cfg, params.agentId);
	if (!configured && params.registeredDatabases) {
		const readSources = params.registeredDatabases.filter((source) => normalizeAgentId(source.agentId) === params.agentId).map((source) => ({
			agentId: source.agentId,
			path: source.path
		}));
		return {
			configured,
			fallback: {
				agentId: params.agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
					agentId: params.agentId,
					env: params.env
				})
			},
			candidates: readSources.map((source) => ({
				agentId: source.agentId,
				storePath: source.path
			})),
			readSources
		};
	}
	const { existing, fallback } = resolveGatewaySessionStoreCandidates(params.cfg, params.agentId, params.targetDiscoveryCache, configured, params.env, params.registeredDatabases, params.resolveExistingTargets);
	return {
		configured,
		fallback,
		candidates: configured ? [fallback, ...existing.filter((target) => target.storePath !== fallback.storePath)] : existing
	};
}
function prepareGatewaySessionStoreLookup(params) {
	const scanTargets = buildGatewaySessionStoreScanTargets(params);
	const { configured, fallback, candidates } = resolveGatewaySessionStoreLookupCandidates(params);
	if (candidates.length === 0) return {
		reads: [],
		resolve: () => ({
			storePath: fallback.storePath,
			store: {},
			match: void 0
		})
	};
	const reads = candidates.map((target, index) => ({
		storePath: target.storePath,
		agentId: target.agentId,
		clone: params.clone,
		options: {
			readOnly: configured ? params.readOnly : true,
			...params.exactRead ? { exactKeys: scanTargets } : {},
			...params.listCandidatesOnly ? { listKeys: scanTargets } : {},
			...params.projection ? { projection: params.projection } : {},
			...params.storeCache ? { cache: params.storeCache } : {}
		},
		result: index === 0 && target.storePath === fallback.storePath && params.store !== void 0 ? ok(params.store) : void 0
	}));
	return {
		reads,
		resolve: () => resolveGatewaySessionStoreReadResults({
			...params,
			reads,
			readStore: readGatewaySessionStore,
			scanTargets
		})
	};
}
function isAgentScopedSentinelSessionKey(canonicalKey) {
	return canonicalKey === "global" || canonicalKey === "unknown";
}
function prepareExplicitDeletedLegacyMainStoreTarget(params) {
	const parsed = parseAgentSessionKey(params.key);
	const legacyAgentId = normalizeAgentId(parsed?.agentId);
	if (!parsed || isIncognitoSessionKey(params.key) || legacyAgentId !== "main" || listAgentIds(params.cfg).includes(legacyAgentId)) return null;
	const canonicalKey = resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: legacyAgentId,
		sessionKey: params.key
	});
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: legacyAgentId
	});
	const lookupSeeds = Array.from(/* @__PURE__ */ new Set([
		params.key,
		canonicalKey,
		agentMainKey,
		`agent:${legacyAgentId}:main`
	]));
	const { existing } = resolveGatewaySessionStoreCandidates(params.cfg, legacyAgentId, params.targetDiscoveryCache, false, params.env);
	const reads = existing.filter((target) => target.agentId === legacyAgentId).map((target) => ({
		storePath: target.storePath,
		clone: params.clone,
		agentId: target.agentId,
		options: {
			readOnly: true,
			...params.exactRead ? { exactKeys: lookupSeeds } : {},
			...params.listCandidatesOnly ? { listKeys: lookupSeeds } : {},
			...params.projection ? { projection: params.projection } : {},
			...params.storeCache ? { cache: params.storeCache } : {}
		}
	}));
	return {
		reads,
		resolve: () => {
			let best;
			let canonicalValidationError;
			const recordCanonicalError = params.deferCanonicalValidation ? (error) => {
				canonicalValidationError ??= error;
			} : void 0;
			for (const target of reads) {
				const store = readGatewaySessionStore(target);
				const match = findCanonicalStoreMatch(store, lookupSeeds, recordCanonicalError);
				if (!match) continue;
				if (best) {
					const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
					if (!recordCanonicalError) throw error;
					recordCanonicalError(error);
				}
				if (!best || (match.entry.updatedAt ?? 0) >= (best.match.entry.updatedAt ?? 0)) best = {
					storePath: target.storePath,
					store,
					match,
					...target.readSource ? { readSource: target.readSource } : {}
				};
			}
			if (!best) return null;
			const storeKeys = /* @__PURE__ */ new Set([canonicalKey]);
			if (params.key !== canonicalKey) storeKeys.add(params.key);
			storeKeys.add(best.match.key);
			for (const seed of lookupSeeds) storeKeys.add(seed);
			return {
				agentId: legacyAgentId,
				storePath: best.storePath,
				canonicalKey,
				storeKeys: Array.from(storeKeys),
				store: best.store,
				...best.readSource ? { readSource: best.readSource } : {},
				...canonicalValidationError ? { canonicalValidationError } : {}
			};
		}
	};
}
function prepareGatewaySessionStoreTarget(params) {
	const key = params.key;
	const { canonicalKey, agentId } = resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: key,
		agentId: params.agentId
	});
	if (isIncognitoSessionKey(canonicalKey)) {
		const storePath = resolveIncognitoOpenClawAgentSqlitePath({
			agentId,
			env: params.env
		});
		const read = {
			storePath,
			agentId,
			clone: params.clone,
			options: {
				readOnly: true,
				...params.exactRead ? { exactKeys: [canonicalKey] } : {},
				...params.listCandidatesOnly ? { listKeys: [canonicalKey] } : {},
				...params.projection ? { projection: params.projection } : {},
				...params.storeCache ? { cache: params.storeCache } : {}
			}
		};
		return {
			reads: [read],
			resolve: () => ({
				agentId,
				storePath,
				canonicalKey,
				storeKeys: [canonicalKey],
				store: readGatewaySessionStore(read),
				...read.readSource ? { readSource: read.readSource } : {}
			})
		};
	}
	const lookup = prepareGatewaySessionStoreLookup({
		...params,
		canonicalKey,
		agentId
	});
	return {
		reads: lookup.reads,
		resolve: () => {
			const { canonicalValidationError, storePath, store, readSource } = lookup.resolve();
			const storeKeys = isAgentScopedSentinelSessionKey(canonicalKey) ? key && key !== canonicalKey ? [canonicalKey, key] : [key] : Array.from(new Set(buildGatewaySessionStoreScanTargets({
				cfg: params.cfg,
				key,
				canonicalKey,
				agentId
			})));
			return {
				agentId,
				storePath,
				canonicalKey,
				storeKeys,
				store,
				...readSource ? { readSource } : {},
				...canonicalValidationError ? { canonicalValidationError } : {}
			};
		}
	};
}
function resolveGatewaySessionStoreTargetWithStore(params) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? ""
	};
	const deletedMain = prepareExplicitDeletedLegacyMainStoreTarget(normalized)?.resolve();
	return includeDirectChildEntries(deletedMain ?? prepareGatewaySessionStoreTarget(normalized).resolve(), params.includeStoreChildEntries, params.cfg, params.env);
}
/** Worker readers fill the same ordered lookup plan before its synchronous selection. */
async function prepareGatewaySessionStoreTargetReadOnly(params, prepareReads) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? "",
		exactRead: true,
		readOnly: true,
		projection: "list"
	};
	const resolve = async (plan) => {
		await prepareReads(plan.reads);
		if (plan.reads.some((read) => read.result === void 0)) throw new Error("Session lookup facts were not prepared");
		return plan.resolve();
	};
	const deletedMain = prepareExplicitDeletedLegacyMainStoreTarget(normalized);
	if (deletedMain) {
		const target = await resolve(deletedMain);
		if (target) return target;
	}
	return await resolve(prepareGatewaySessionStoreTarget(normalized));
}
/** Exact row owners supply missing parent facts without expanding their selected store. */
function createGatewaySessionEntryReader(params) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	return (key) => {
		if (params.store[key]) return params.store[key];
		if (key === "global" || key === "unknown") {
			const readSource = params.readSource;
			if (!readSource) return;
			return readGatewaySessionStore({
				agentId: readSource.agentId,
				storePath: readSource.path,
				options: {
					readSource,
					readOnly: true,
					exactKeys: [key],
					projection: "list"
				}
			})[key];
		}
		const target = resolveGatewaySessionStoreTargetWithStore({
			cfg: params.cfg,
			key,
			...parseAgentSessionKey(key) ? {} : { agentId: params.agentId },
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		});
		return target.store[target.canonicalKey];
	};
}
/** Resolve one synchronous set of logical metadata targets using exact grouped reads. */
function resolveGatewaySessionStoreTargetsReadOnly(params) {
	return readGatewaySessionStoreTargets(params, "eager").map((result) => {
		if (!result.ok) throw result.error;
		return result.value;
	});
}
/** Read exact groups now, retaining logical errors for the caller's ordered visitor. */
function prepareGatewaySessionStoreTargetsReadOnly(params) {
	return readGatewaySessionStoreTargets(params, "prepared");
}
function readGatewaySessionStoreTargets(params, mode) {
	const resolve = (items, read) => items.map((item) => {
		if (!item.ok) return item;
		try {
			return ok(read(item.value));
		} catch (error) {
			if (mode === "eager") throw error;
			return err(error);
		}
	});
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const requests = resolve(params.targets.map(ok), (target) => {
		const lookup = {
			...target,
			key: normalizeOptionalString(target.key) ?? "",
			cfg: params.cfg,
			env: params.env,
			clone: false,
			readOnly: true,
			exactRead: true,
			projection: mode === "eager" ? params.projection ?? "list" : params.projection,
			targetDiscoveryCache
		};
		return {
			lookup,
			legacy: prepareExplicitDeletedLegacyMainStoreTarget(lookup)
		};
	});
	loadGatewaySessionStoreReads(requests.flatMap((request) => request.ok ? request.value.legacy?.reads ?? [] : []));
	const selected = resolve(requests, ({ lookup, legacy }) => {
		const target = legacy?.resolve();
		return target ? {
			reads: [],
			resolve: () => target
		} : prepareGatewaySessionStoreTarget(lookup);
	});
	loadGatewaySessionStoreReads(selected.flatMap((selection) => selection.ok ? selection.value.reads : []));
	return resolve(selected, (selection) => selection.resolve());
}
function includeDirectChildEntries(target, include, cfg, env) {
	if (!include) return target;
	try {
		const parentKeys = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
		const childKeys = /* @__PURE__ */ new Set();
		for (const parentKey of parentKeys) for (const { sessionKey, entry } of listSessionChildEntriesReadOnly({
			agentId: target.agentId,
			env,
			clone: false,
			projection: "list",
			sessionKey: parentKey,
			storePath: target.storePath
		})) if (!parentKeys.has(sessionKey)) target.store[sessionKey] = entry;
		for (const { childSessionKey } of listSubagentSessionListRunsForControllers([...parentKeys])) childKeys.add(childSessionKey);
		const targets = [...childKeys].filter((key) => !target.store[key]).map((key) => ({ key }));
		for (const child of resolveGatewaySessionStoreTargetsReadOnly({
			cfg,
			env,
			targets,
			projection: "list"
		})) {
			const entry = child.store[child.canonicalKey];
			if (entry && !parentKeys.has(child.canonicalKey)) target.store[child.canonicalKey] = entry;
		}
	} catch {}
	return target;
}
function resolveGatewaySessionStoreTarget(params) {
	const { store: _store, readSource: _readSource, ...target } = resolveGatewaySessionStoreTargetWithStore({
		...params,
		projection: "list",
		listCandidatesOnly: true
	});
	return target;
}
//#endregion
export { resolveGatewaySessionStoreTarget as a, resolveGatewaySessionStoreLookupCandidates as i, prepareGatewaySessionStoreTargetReadOnly as n, resolveGatewaySessionStoreTargetWithStore as o, prepareGatewaySessionStoreTargetsReadOnly as r, resolveGatewaySessionStoreTargetsReadOnly as s, createGatewaySessionEntryReader as t };
