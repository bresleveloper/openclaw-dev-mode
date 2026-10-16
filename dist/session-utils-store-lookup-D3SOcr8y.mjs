import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { t as collectCanonicalSessionLookupKeys } from "./main-session-key-DrfSAS1s.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { t as listSessionChildEntriesReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as selectStoredSessionLineage, i as resolveSessionStoreIdentity, o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { u as listSubagentSessionListRunsForControllers } from "./subagent-registry-read-BE_xWkJl.mjs";
import { n as resolveGatewaySessionStoreLookupCandidates, t as resolveGatewaySessionStoreCandidates } from "./session-utils-store-candidates-Dcn6yumd.mjs";
import { n as readGatewaySessionStore, t as loadGatewaySessionStoreReads } from "./session-utils-store-read-BsYAS0KM.mjs";
import { n as resolveGatewaySessionStoreReadResults } from "./session-utils-store-selection-DW7mpK3L.mjs";
//#region src/gateway/session-utils-store-lookup.ts
function storeReadOptions(params, keys, readOnly) {
	return {
		env: params.env,
		readOnly,
		...params.exactRead || params.preserveQualifiedAddress ? { exactKeys: keys } : {},
		...params.projection ? { projection: params.projection } : {},
		...params.readConsistency ? { readConsistency: params.readConsistency } : {},
		...params.storeCache ? { cache: params.storeCache } : {}
	};
}
function prepareGatewaySessionStoreLookup(params, scanTargets) {
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
		options: storeReadOptions(params, scanTargets, configured ? params.readOnly : true),
		result: index === 0 && target.storePath === fallback.storePath && params.store !== void 0 ? ok(params.store) : void 0
	}));
	return {
		reads,
		resolve: () => resolveGatewaySessionStoreReadResults({
			...params,
			reads,
			readStore: params.readStore ?? readGatewaySessionStore,
			scanTargets
		})
	};
}
function prepareExplicitDeletedLegacyMainStoreTarget(params) {
	const parsed = parseAgentSessionKey(params.key);
	const legacyAgentId = normalizeAgentId(parsed?.agentId);
	if (params.preserveQualifiedAddress || !parsed || isIncognitoSessionKey(params.key) || legacyAgentId !== "main" || listAgentIds(params.cfg).includes(legacyAgentId)) return null;
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
		options: storeReadOptions(params, lookupSeeds, true)
	}));
	return {
		reads,
		resolve: () => {
			if (reads.length === 0) return null;
			const best = resolveGatewaySessionStoreReadResults({
				reads,
				readStore: params.readStore ?? readGatewaySessionStore,
				scanTargets: lookupSeeds,
				canonicalKey
			});
			if (!best.match) return null;
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
				...best.capturedReadSource ? { capturedReadSource: best.capturedReadSource } : {},
				capturedReadSources: best.capturedReadSources
			};
		}
	};
}
function prepareGatewaySessionStoreTarget(params) {
	const key = params.key;
	const { canonicalKey, agentId } = resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: key,
		agentId: params.agentId,
		preserveQualifiedAddress: params.preserveQualifiedAddress
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
			options: storeReadOptions(params, [canonicalKey], true)
		};
		return {
			reads: [read],
			resolve: () => ({
				agentId,
				storePath,
				canonicalKey,
				storeKeys: [canonicalKey],
				store: (params.readStore ?? readGatewaySessionStore)(read),
				...read.readSource ? { readSource: read.readSource } : {},
				...read.capturedReadSource ? {
					capturedReadSource: read.capturedReadSource,
					capturedReadSources: [read.capturedReadSource]
				} : {}
			})
		};
	}
	const storeKeys = params.preserveQualifiedAddress ? [canonicalKey] : collectCanonicalSessionLookupKeys({
		agentId,
		canonicalKey,
		mainKey: params.cfg.session?.mainKey,
		requestedKey: key
	});
	const lookup = prepareGatewaySessionStoreLookup({
		...params,
		canonicalKey,
		agentId
	}, storeKeys);
	return {
		reads: lookup.reads,
		resolve: () => {
			const { storePath, store, readSource, capturedReadSource, capturedReadSources } = lookup.resolve();
			return {
				agentId,
				storePath,
				canonicalKey,
				storeKeys: [...storeKeys],
				store,
				...readSource ? { readSource } : {},
				...capturedReadSource ? { capturedReadSource } : {},
				...capturedReadSources ? { capturedReadSources } : {}
			};
		}
	};
}
/** Prepare discovery before a writer uses transaction-local rows in the same routing selection. */
function prepareGatewaySessionStoreTargetLookup(params) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? ""
	};
	const deletedMain = prepareExplicitDeletedLegacyMainStoreTarget(normalized);
	let current;
	try {
		current = ok(prepareGatewaySessionStoreTarget(normalized));
	} catch (error) {
		current = err(error);
	}
	return {
		reads: [...deletedMain?.reads ?? [], ...current.ok ? current.value.reads : []],
		resolve() {
			const legacy = deletedMain?.resolve();
			if (legacy) return legacy;
			if (!current.ok) throw current.error;
			return current.value.resolve();
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
		return await prepareReads(plan.reads, () => {
			if (plan.reads.some((read) => read.result === void 0)) throw new Error("Session lookup facts were not prepared");
			return plan.resolve();
		});
	};
	const deletedMain = prepareExplicitDeletedLegacyMainStoreTarget(normalized);
	if (deletedMain) {
		const target = await resolve(deletedMain);
		if (target) return target;
	}
	return await resolve(prepareGatewaySessionStoreTarget(normalized));
}
/** Stored-address joins share discovery without passing selected keys through request aliases. */
function createGatewaySessionLineageReader(cfg) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	function readAlias(key, agentId) {
		const target = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key,
			...parseAgentSessionKey(key) ? {} : { agentId },
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		});
		return target.store[target.canonicalKey];
	}
	const readStored = (agentId, key) => {
		if (isIncognitoSessionKey(key)) return readAlias(key, agentId);
		return prepareGatewaySessionStoreTarget({
			cfg,
			agentId,
			key,
			preserveQualifiedAddress: true,
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		}).resolve().store[key];
	};
	return {
		readStored,
		readAlias
	};
}
/** Exact row owners supply missing parent facts without expanding their selected store. */
function createGatewaySessionEntryReader(params) {
	const reader = createGatewaySessionLineageReader(params.cfg);
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
		return selectStoredSessionLineage({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: key,
			read: reader.readStored,
			readAlias: () => reader.readAlias(key, params.agentId)
		}).value;
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
	const { store: _store, readSource: _readSource, capturedReadSource: _capturedReadSource, capturedReadSources: _capturedReadSources, ...target } = resolveGatewaySessionStoreTargetWithStore({
		...params,
		projection: "list",
		exactRead: true,
		readOnly: false
	});
	return target;
}
//#endregion
export { prepareGatewaySessionStoreTargetsReadOnly as a, prepareGatewaySessionStoreTargetReadOnly as i, createGatewaySessionLineageReader as n, resolveGatewaySessionStoreTarget as o, prepareGatewaySessionStoreTargetLookup as r, resolveGatewaySessionStoreTargetWithStore as s, createGatewaySessionEntryReader as t };
