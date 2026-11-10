import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { t as collectCanonicalSessionLookupKeys } from "./main-session-key-BNNxukz6.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { g as sessionChangeAffectsStoredRow, h as prepareSessionRowPublicationScope } from "./session-actor-replica-D_j2y4I5.mjs";
import { t as SessionEntryChangedDuringReadError } from "./session-entry-read-errors-Cn4uY9H4.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveSessionStoreIdentity, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import "./sessions-CnzPI1yx.mjs";
import { u as listSubagentSessionListRunsForControllers } from "./subagent-registry-read-DY0g8fGW.mjs";
import { n as resolveGatewaySessionStoreLookupCandidates, t as resolveGatewaySessionStoreCandidates } from "./session-utils-store-candidates-DoVKUG44.mjs";
import { n as loadGatewaySessionStoreReads, r as readGatewaySessionStore, t as gatewaySessionStoreReadOptions } from "./session-utils-store-read-DSR3nBrH.mjs";
import { i as resolveGatewaySessionStoreReadResults, r as prepareGatewaySessionStoreReadPlan } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-utils-store-errors.ts
var GatewaySessionFactsChangedDuringReadError = class extends Error {
	constructor() {
		super("Session sharing facts changed during read");
		this.name = "GatewaySessionFactsChangedDuringReadError";
	}
};
//#endregion
//#region src/gateway/session-utils-store-incognito.ts
function prepareIncognitoGatewaySessionStoreTarget(params) {
	const { agentId, canonicalKey } = params;
	const memory = captureMemoryExactSessionReader({
		agentId,
		sessionKey: canonicalKey,
		env: params.env
	});
	if (!memory) throw new Error("Incognito session lookup requires a memory target");
	return {
		reads: [],
		resolve() {
			const entry = memory.read(canonicalKey, params.projection);
			return {
				agentId,
				canonicalKey,
				storePath: memory.path,
				storeKeys: [canonicalKey],
				store: entry ? { [canonicalKey]: entry } : {},
				readSource: {
					agentId,
					path: memory.path
				},
				...memory.source ? { capturedReadSource: memory.source } : {},
				capturedReadSources: memory.source ? [memory.source] : []
			};
		}
	};
}
//#endregion
//#region src/gateway/session-utils-store-retained.ts
function captureGatewaySessionReadSource(database, identity) {
	return identity ? {
		agentId: database.agentId,
		path: database.path,
		databaseIdentity: identity.identity,
		...identity.birthtime ? { databaseBirthtime: identity.birthtime } : {}
	} : void 0;
}
/** Only a complete direct selection can outlive discovery without absence queries. */
function captureGatewaySessionStoreSelection(inventory, target, requestedKey) {
	const source = target.capturedReadSource;
	const databaseIdentity = source?.databaseIdentity;
	const paths = inventory.paths.get(target.agentId);
	const key = parseAgentSessionKey(target.canonicalKey);
	return source && typeof databaseIdentity === "string" && source.agentId === target.agentId && target.store[target.canonicalKey]?.incognito !== true && target.store[target.canonicalKey] && key && key.rest !== "global" && key.rest !== "unknown" && target.storeKeys.length === 1 && target.storeKeys[0] === target.canonicalKey && listAgentIds(inventory.config).includes(target.agentId) && !inventory.registryDiscovery && paths && paths.configured === paths.default && resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).agentId === target.agentId && inventory.candidates.every((candidate) => !candidate.scope && candidate.physicalPath === source.path) ? {
		logicalStorePath: target.storePath,
		env: inventory.env,
		target: {
			keyFormat: "agent-qualified",
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			requestedKey,
			storeKey: target.canonicalKey,
			storeKeys: [...target.storeKeys],
			storePath: source.path,
			readSource: { ...source }
		},
		source: {
			...source,
			databaseIdentity,
			assertCurrent() {
				assertExistingDatabaseIdentity(source.path, `file:${databaseIdentity}`, source.databaseBirthtime);
				for (const candidate of inventory.candidates) assertSessionStoreReadCandidate(candidate.path, inventory.candidates);
			}
		}
	} : void 0;
}
/** Re-read one already-qualified durable target without repeating logical discovery. */
async function withQualifiedGatewaySessionStoreTarget(params) {
	const publication = prepareSessionRowPublicationScope([
		params.logicalStorePath,
		params.target.storePath,
		...params.target.readSource ? [params.target.readSource.path] : []
	], params.target.readSource?.databaseIdentity);
	let changed = false;
	const stop = sessionChanges.subscribeFacts((change) => {
		if (sessionChangeAffectsStoredRow(change, {
			...publication,
			agentId: params.target.agentId,
			sessionKeys: params.target.storeKeys
		})) changed = true;
	});
	try {
		return await withSessionEntriesFromStoresInWorker([{
			agentId: params.target.readSource?.agentId ?? params.target.agentId,
			storePath: params.logicalStorePath,
			preparedSource: params.preparedSource,
			sessionKeys: params.target.storeKeys,
			projection: "full",
			includeMembers: params.includeMembership,
			includeAuthorization: true,
			...params.readOptions,
			env: params.env
		}], ([owner]) => {
			const selected = owner;
			const capturedReadSource = selected.result.source ?? captureGatewaySessionReadSource(selected.database, selected.result.databaseIdentity);
			const assertCurrent = () => {
				if (changed) throw new GatewaySessionFactsChangedDuringReadError();
				selected.assertCurrent();
				if (params.target.readSource && !isDeepStrictEqual(capturedReadSource, params.target.readSource)) throw new Error("Qualified session source changed during consumption");
			};
			assertCurrent();
			return params.consume({
				agentId: params.target.agentId,
				canonicalKey: params.target.canonicalKey,
				storePath: params.logicalStorePath,
				storeKeys: [...params.target.storeKeys],
				store: Object.fromEntries(selected.result.entries.map(({ sessionKey, entry }) => [sessionKey, entry])),
				readSource: selected.database,
				lifecycleTimestamps: selected.result.lifecycleTimestamps,
				...selected.result.transcript ? { transcript: selected.result.transcript } : {},
				...capturedReadSource ? { capturedReadSource } : {},
				capturedReadSources: capturedReadSource ? [capturedReadSource] : []
			}, new Map(Object.entries(selected.result.members ?? {})), assertCurrent);
		}, {
			ordered: true,
			onReadAdmitted: () => {
				changed = false;
			},
			prepareSource: (_input, ...source) => publication.prepareSource(...source)
		});
	} finally {
		stop();
	}
}
/** Current memory facts are consumed synchronously without opening a store. */
function withIncognitoGatewaySessionStoreTarget(params) {
	const { agentId, canonicalKey: sessionKey } = params.identity;
	const captured = captureSessionActorStorageOwner({
		agentId,
		sessionKey,
		env: params.env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (!captured) throw new Error("Incognito session read requires an incognito target");
	const { binding, authority, owner } = captured;
	let snapshot;
	if (binding?.actor.target.sessionKey === sessionKey) snapshot = binding.actor.snapshot(authority);
	else {
		binding?.actor.assertReadable();
		snapshot = owner?.readSession(sessionKey, authority);
	}
	const identity = owner?.identity ?? snapshot?.target.database;
	const capturedReadSource = captureGatewaySessionReadSource(captured, identity?.kind === "memory" ? { identity: identity.incarnation } : void 0);
	let consuming = true;
	const assertCurrent = () => {
		if (!consuming) throw new Error("Incognito session source is no longer retained");
		if (binding) binding.actor.assertReadable();
		else owner?.assertCurrent();
		authority.assertCurrent();
	};
	try {
		const result = params.consume({
			agentId,
			canonicalKey: sessionKey,
			storePath: captured.path,
			storeKeys: [sessionKey],
			store: snapshot?.entry ? { [sessionKey]: snapshot.entry } : {},
			readSource: {
				agentId,
				path: captured.path
			},
			...capturedReadSource ? { capturedReadSource } : {},
			capturedReadSources: capturedReadSource ? [capturedReadSource] : []
		}, params.includeMembership ? /* @__PURE__ */ new Map([[sessionKey, snapshot?.members ?? []]]) : /* @__PURE__ */ new Map(), assertCurrent);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => void 0);
			throw new Error("Session entry consumers must remain synchronous");
		}
		return result;
	} finally {
		consuming = false;
	}
}
//#endregion
//#region src/gateway/session-utils-store-lookup.ts
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
		options: gatewaySessionStoreReadOptions(params, scanTargets, configured ? params.readOnly : true),
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
	const { existing } = resolveGatewaySessionStoreCandidates(params.cfg, legacyAgentId, params.targetDiscoveryCache, false, params.env, params.resolveExistingTargets);
	const reads = existing.filter((target) => target.agentId === legacyAgentId).map((target) => ({
		storePath: target.storePath,
		clone: params.clone,
		agentId: target.agentId,
		options: gatewaySessionStoreReadOptions(params, lookupSeeds, true)
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
	if (isIncognitoSessionKey(canonicalKey)) return prepareIncognitoGatewaySessionStoreTarget({
		...params,
		agentId,
		canonicalKey
	});
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
/** Synchronous worker/SDK selection; incognito uses its memory owner. */
function resolveNativeGatewaySessionStoreTargetWithStore(params) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? ""
	};
	const target = prepareExplicitDeletedLegacyMainStoreTarget(normalized)?.resolve() ?? prepareGatewaySessionStoreTarget(normalized).resolve();
	return isIncognitoSessionKey(target.canonicalKey) ? includeIncognitoDirectChildEntries(target, params.includeStoreChildEntries, params.cfg, params.env) : target;
}
/** Durable discovery and rows are acquired by the existing session read worker. */
async function resolveGatewaySessionStoreTargetWithStoreAsync(params) {
	const { resolveGatewaySessionStoreTargetInWorker } = await import("./session-utils-store-worker-CmMErbaH.mjs");
	return resolveGatewaySessionStoreTargetInWorker({
		...params,
		projection: params.projection ?? "full",
		exactRead: params.exactRead ?? false,
		readOnly: params.readOnly ?? false
	});
}
/** Retain discovery and exact worker rows through one synchronous authority consumer. */
async function withGatewaySessionStoreTarget(params, consume) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? "",
		exactRead: true,
		readOnly: true
	};
	const identity = resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: normalized.key,
		agentId: params.agentId,
		preserveQualifiedAddress: params.preserveQualifiedAddress
	});
	if (isIncognitoSessionKey(identity.canonicalKey)) {
		if (params.relatedKeys?.length) throw new Error("Related incognito rows require their captured actor");
		return withIncognitoGatewaySessionStoreTarget({
			env: params.env,
			includeMembership: params.includeMembership,
			identity,
			consume: (target, membership, assertCurrent) => consume(target, membership, assertCurrent, [])
		});
	}
	const related = (params.relatedKeys ?? []).map((selection) => Object.assign({}, normalized, selection, { key: normalizeOptionalString(selection.key) ?? "" }));
	const identities = [identity, ...related.map((selection) => resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: selection.key,
		agentId: selection.agentId,
		preserveQualifiedAddress: selection.preserveQualifiedAddress
	}))];
	if (identities.some((selected) => isIncognitoSessionKey(selected.canonicalKey))) throw new Error("Related incognito rows require their captured actor");
	const inventory = prepareSessionStoreTargetInventory(params.cfg, [...identities.map((selected) => selected.agentId), ...[normalized, ...related].flatMap((selection) => parseAgentSessionKey(selection.key)?.agentId ?? [])], params.env);
	return prepareSessionStoreTargetInventoryRead(inventory).withRead(async (sources, assertDiscoveryCurrent) => {
		const targetDiscoveryCache = /* @__PURE__ */ new Map();
		for (const source of sources.agents) {
			if (!source.result.available && source.result.reason !== "database-missing") throw new Error(`Session store discovery failed (${source.result.reason}); retry after storage is available.`);
			targetDiscoveryCache.set(source.agentId, {
				existing: source.result.available ? source.result.targets : [],
				fallback: {
					agentId: source.agentId,
					storePath: inventory.paths.get(source.agentId).configured
				}
			});
		}
		const plans = [normalized, ...related].map((selection) => prepareGatewaySessionStoreTargetLookup({
			...selection,
			cfg: inventory.config,
			env: inventory.env,
			targetDiscoveryCache
		}));
		const reads = plans.flatMap((plan) => plan.reads);
		const publications = reads.map((read) => ({
			read,
			scope: prepareSessionRowPublicationScope([read.storePath])
		}));
		let changed = false;
		const stop = sessionChanges.subscribeFacts((change) => {
			if (publications.some(({ read, scope }) => sessionChangeAffectsStoredRow(change, {
				...scope,
				agentId: read.agentId,
				sessionKeys: read.options.exactKeys ?? []
			}))) changed = true;
		});
		let consumed = false;
		try {
			for (let attempt = 0;; attempt += 1) {
				const ordered = params.ordered || params.includeMembership || attempt > 0;
				changed = false;
				assertDiscoveryCurrent();
				try {
					return await withSessionEntriesFromStoresInWorker(reads.map((read) => ({
						agentId: read.agentId ?? identity.agentId,
						storePath: read.storePath,
						sessionKeys: read.options.exactKeys ?? [],
						projection: typeof params.projection === "object" && !params.includeMembership ? "exact" : params.projection === "list" && !params.includeMembership ? "sharing" : "full",
						snapshotFields: typeof params.projection === "object" ? params.projection : params.projection === "list" ? [] : void 0,
						includeMembers: params.includeMembership,
						includeAuthorization: true,
						env: inventory.env
					})), (prepared) => {
						const assertCurrent = () => {
							assertDiscoveryCurrent();
							if (changed) throw new GatewaySessionFactsChangedDuringReadError();
							for (const owner of prepared) owner.assertCurrent();
						};
						for (const [index, read] of reads.entries()) {
							const owner = prepared[index];
							read.result = ok(Object.fromEntries(owner.result.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
							read.readSource = {
								agentId: owner.database.agentId,
								path: owner.database.path
							};
							read.capturedReadSource = captureGatewaySessionReadSource(read.readSource, owner.result.databaseIdentity) ?? read.capturedReadSource;
						}
						assertCurrent();
						const target = plans[0].resolve();
						const selection = related.length === 0 && reads.length === 1 ? captureGatewaySessionStoreSelection(inventory, target, normalized.key) : void 0;
						const memberships = /* @__PURE__ */ new Map();
						for (const owner of prepared) if (owner.database.path === target.readSource?.path) for (const [key, members] of Object.entries(owner.result.members ?? {})) memberships.set(key, members);
						consumed = true;
						return consume(target, memberships, assertCurrent, plans.slice(1).map((plan) => plan.resolve()), selection);
					}, {
						ordered,
						onReadAdmitted: ordered ? () => {
							assertDiscoveryCurrent();
							changed = false;
						} : void 0,
						prepareSource(input, database, source) {
							for (const { read, scope } of publications) if (read.storePath === input.storePath && (read.agentId ?? identity.agentId) === input.agentId) {
								scope.prepareSource(database, source);
								read.capturedReadSource = captureGatewaySessionReadSource(database, source.key.startsWith("file:") ? {
									identity: source.key.slice(5),
									birthtime: source.birthtime
								} : void 0);
							}
						}
					});
				} catch (error) {
					if (consumed || attempt >= 1 || !(error instanceof GatewaySessionFactsChangedDuringReadError) && (!params.includeMembership || !(error instanceof SessionEntryChangedDuringReadError))) throw error;
				}
			}
		} finally {
			stop();
		}
	});
}
/** Worker readers fill the same ordered lookup plan before its synchronous selection. */
async function prepareGatewaySessionStoreTargetReadOnly(params, prepareReads) {
	return (await prepareGatewaySessionStoreTargetReadPlan(params, prepareReads)).target;
}
/** Keep every scanned stage so final admission can repeat selection without discovery. */
async function prepareGatewaySessionStoreTargetReadPlan(params, prepareReads, onSelected) {
	const normalized = {
		...params,
		key: normalizeOptionalString(params.key) ?? "",
		exactRead: params.exactRead ?? true,
		readOnly: true,
		projection: params.projection ?? "list"
	};
	return prepareGatewaySessionStoreReadPlan({
		legacy: prepareExplicitDeletedLegacyMainStoreTarget(normalized),
		prepareCurrent: () => prepareGatewaySessionStoreTarget(normalized),
		prepareReads,
		onSelected
	});
}
/** Resolve one synchronous set of logical metadata targets using exact grouped reads. */
function resolveGatewaySessionStoreTargetsReadOnly(params) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const requests = params.targets.map((target) => {
		const lookup = {
			...target,
			key: normalizeOptionalString(target.key) ?? "",
			cfg: params.cfg,
			env: params.env,
			clone: false,
			readOnly: true,
			exactRead: true,
			projection: params.projection ?? "list",
			targetDiscoveryCache
		};
		return {
			lookup,
			legacy: prepareExplicitDeletedLegacyMainStoreTarget(lookup)
		};
	});
	loadGatewaySessionStoreReads(requests.flatMap((request) => request.legacy?.reads ?? []));
	const selected = requests.map(({ lookup, legacy }) => {
		const target = legacy?.resolve();
		return target ? {
			reads: [],
			resolve: () => target
		} : prepareGatewaySessionStoreTarget(lookup);
	});
	loadGatewaySessionStoreReads(selected.flatMap((selection) => selection.reads));
	return selected.map((selection) => selection.resolve());
}
function includeIncognitoDirectChildEntries(target, include, cfg, env) {
	if (!include) return target;
	try {
		const parentKeys = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
		const childKeys = /* @__PURE__ */ new Set();
		const memory = captureMemoryExactSessionReader({
			agentId: target.agentId,
			env,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		});
		for (const { sessionKey, entry } of memory?.children([...parentKeys], "list") ?? []) target.store[sessionKey] = entry;
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
//#endregion
export { resolveNativeGatewaySessionStoreTargetWithStore as a, resolveGatewaySessionStoreTargetWithStoreAsync as i, prepareGatewaySessionStoreTargetReadOnly as n, withGatewaySessionStoreTarget as o, prepareGatewaySessionStoreTargetReadPlan as r, withQualifiedGatewaySessionStoreTarget as s, prepareGatewaySessionStoreTargetLookup as t };
