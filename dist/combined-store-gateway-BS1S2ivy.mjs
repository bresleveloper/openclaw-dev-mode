import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { S as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-D1jWDzK3.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CnfJSmam.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { g as readAgentDatabaseAdmissionRefusal, n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { l as readOpenClawAgentDatabaseRegistryToken, s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { g as readOpenIncognitoAgentDatabaseGeneration, m as listOpenIncognitoAgentDatabases } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-00MgEWj5.mjs";
import { c as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { g as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-D1TSJMmX.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, n as listKnownSessionStoreAgentIds, p as dedupeSessionStoreTargetsBySqliteTarget, r as resolveAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-BbcRkdUC.mjs";
import { n as createRetainedAgentDatabaseMatcher, r as createRetainedAgentDatabaseMatcherFromSnapshot } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as selectStoredSessionLineage, o as resolveStoredSessionKeyForAgentStore, r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import { n as createGatewaySessionLineageReader } from "./session-utils-store-lookup-CuE1uM7x.mjs";
//#region src/config/sessions/combined-store-paths.ts
function storeTargetKey(target) {
	return `${target.agentId}\0${target.storePath}`;
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveCombinedStorePath(paths, storeConfig) {
	return paths.length === 1 ? expectDefined(paths[0], "store path at 0") : typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)";
}
function resolveCombinedDatabasePath(targets, physicalTargets) {
	const paths = [...new Set(targets.map((target) => expectDefined(physicalTargets.get(storeTargetKey(target)), "physical store").storePath))];
	return paths.length === 1 ? expectDefined(paths[0], "database path at 0") : "(multiple)";
}
function discoveryReadOptions(discovery) {
	return discovery ? {
		env: discovery.env,
		registeredDatabases: (discovery.snapshot?.registeredAgentDatabases ?? []).filter((entry) => entry.schemaVersion === 24)
	} : {};
}
function resolveSharedStoreRowOwner(cfg, selected, sharedStorePaths, env) {
	const configuredPath = resolveSessionStorePathCore(cfg.session?.store, {
		agentId: resolveSessionStoreCompatibilityAgentId(cfg),
		env
	});
	if (!sharedStorePaths.has(configuredPath)) return;
	const persistedOwner = resolvePersistedSessionStoreOwner(cfg);
	return persistedOwner.kind === "configured" ? {
		agentId: persistedOwner.agentId,
		target: selected
	} : void 0;
}
function createGatewayRetainedStoreMatcher(cfg, discovery) {
	const readOptions = discoveryReadOptions(discovery);
	const env = readOptions.env ?? process.env;
	const readConfiguredTargets = () => resolveConfiguredAgentDatabaseTargets(cfg, {
		env,
		...readOptions
	});
	return discovery ? createRetainedAgentDatabaseMatcherFromSnapshot(env, readConfiguredTargets, discovery.snapshot, "database", "runtime") : createRetainedAgentDatabaseMatcher(env, readConfiguredTargets, "database", "runtime");
}
//#endregion
//#region src/config/sessions/combined-store-model-sources.ts
function createSessionModelSources(cfg, diagnostics, preparedAgentIds) {
	const physicalStores = /* @__PURE__ */ new Map();
	const logicalEntries = /* @__PURE__ */ new Map();
	const logicalKey = (agentId, key) => `${normalizeAgentId(agentId)}\0${key}`;
	return {
		prepareStore(target) {
			const physicalKey = storeTargetKey(target);
			let physical = physicalStores.get(physicalKey);
			if (!physical) {
				physical = {
					entries: {},
					readers: /* @__PURE__ */ new Map()
				};
				physicalStores.set(physicalKey, physical);
			}
			const { entries: store, readers } = physical;
			return (logicalAgentId, storedKey, entry) => {
				store[storedKey] = entry;
				const identity = logicalKey(logicalAgentId, storedKey);
				if (!logicalEntries.has(identity)) logicalEntries.set(identity, entry);
				let read = readers.get(logicalAgentId);
				if (!read) {
					const readQualifiedParent = createGatewaySessionLineageReader(cfg);
					const selectedParents = /* @__PURE__ */ new Map();
					const select = (parentKey) => {
						if (parentKey === "global" || parentKey === "unknown") return {
							key: parentKey,
							value: store[parentKey]
						};
						const parsed = parseAgentSessionKey(parentKey);
						const agentId = normalizeAgentId(parsed?.agentId ?? logicalAgentId);
						const refusal = readAgentDatabaseAdmissionRefusal(agentId);
						if (refusal) {
							const message = `${refusal.reason}\n${refusal.repairHint}`;
							if (!diagnostics.includes(message)) diagnostics.push(message);
							return {
								key: parentKey,
								value: void 0
							};
						}
						const captured = selectedParents.get(parentKey);
						if (captured) return captured;
						const selected = selectStoredSessionLineage({
							cfg,
							agentId,
							sessionKey: parentKey,
							read(owner, key) {
								const parentIdentity = logicalKey(owner, key);
								if (parsed && preparedAgentIds && !preparedAgentIds.has(owner) && !logicalEntries.has(parentIdentity)) logicalEntries.set(parentIdentity, readQualifiedParent.readStored(owner, key));
								return logicalEntries.get(parentIdentity);
							},
							readAlias(owner, key) {
								return parsed && preparedAgentIds && !preparedAgentIds.has(owner) ? readQualifiedParent.readAlias(parentKey, logicalAgentId) : logicalEntries.get(logicalKey(owner, key));
							}
						});
						selectedParents.set(parentKey, selected);
						return selected;
					};
					read = {
						readSourceEntry: (key) => select(key).value,
						resolveSourceKey: (key) => select(key).key
					};
					readers.set(logicalAgentId, read);
				}
				return read;
			};
		},
		remove(target, key) {
			const store = physicalStores.get(storeTargetKey(target.storeTarget));
			if (store) delete store.entries[key];
			logicalEntries.delete(logicalKey(target.agentId, key));
		}
	};
}
//#endregion
//#region src/config/sessions/combined-store-gateway.ts
function capturePhysicalStoreTargets() {
	const physicalTargets = /* @__PURE__ */ new Map();
	return {
		physicalTargets,
		onResolvedTarget: (selected, physical) => {
			physicalTargets.set(storeTargetKey(selected), physical);
		}
	};
}
let preparedConfiguredSessionStoreTargets;
function loadGatewayStoreEntries(params) {
	return (params.includeOpenDatabases ? listSessionEntriesCore : listSessionEntriesReadOnly)({
		agentId: params.agentId,
		clone: false,
		projection: params.projection,
		storePath: params.storePath
	});
}
function mergeSessionEntryIntoCombined(params) {
	const { combined, entry, target, canonicalKey } = params;
	const projectedKey = params.projectedKey ?? canonicalKey;
	const existing = combined[projectedKey];
	if (existing && (canonicalKey === "global" || canonicalKey === "unknown")) return;
	if (existing) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
	combined[projectedKey] = entry;
	params.targetsBySessionKey.set(projectedKey, target);
}
function projectGatewaySessionEntry(cfg, entry, resolveSourceKey) {
	const projected = { ...entry };
	if (cfg.session?.scope === "global") for (const field of ["parentSessionKey", "spawnedBy"]) {
		const sessionKey = projected[field];
		const parsed = sessionKey ? parseAgentSessionKey(sessionKey) : null;
		if (sessionKey && parsed) projected[field] = resolveSourceKey?.(sessionKey) ?? canonicalizeMainSessionAlias({
			cfg,
			agentId: parsed.agentId,
			sessionKey
		});
	}
	return projected;
}
function mergeOpenIncognitoStores(params) {
	const storePaths = [];
	for (const target of params.targets) {
		const store = loadGatewayStoreEntries({
			agentId: target.agentId,
			includeOpenDatabases: true,
			projection: params.projection,
			storePath: target.storePath
		});
		let merged = false;
		const addModelEntry = params.modelSources.prepareStore(target);
		const modelTarget = {
			agentId: target.agentId,
			storeTarget: target
		};
		for (const { sessionKey, entry } of store) {
			if (!isIncognitoSessionKey(sessionKey) || entry.incognito !== true) continue;
			mergeSessionEntryIntoCombined({
				combined: params.combined,
				targetsBySessionKey: params.targetsBySessionKey,
				entry,
				target: {
					...modelTarget,
					entry,
					...addModelEntry(target.agentId, sessionKey, entry)
				},
				canonicalKey: sessionKey
			});
			merged = true;
		}
		if (merged) storePaths.push(target.storePath);
	}
	return storePaths;
}
function isConfiguredGatewaySessionEntry(cfg, configuredAgentIds, key, entry) {
	const isConfiguredSessionKey = (candidate) => {
		const normalizedKey = normalizeOptionalString(candidate);
		return Boolean(normalizedKey && configuredAgentIds.has(normalizeAgentId(resolveSessionStoreAgentId(cfg, normalizedKey))));
	};
	return key === "global" || key === "unknown" || isConfiguredSessionKey(key) || isConfiguredSessionKey(entry.spawnedBy) || isConfiguredSessionKey(entry.parentSessionKey);
}
function filterCombinedStoreToConfiguredAgents(params) {
	for (const [key, entry] of Object.entries(params.store)) {
		const storeKey = params.targetsBySessionKey.get(key)?.storeKey ?? key;
		if (!isConfiguredGatewaySessionEntry(params.cfg, params.configuredAgentIds, storeKey, entry)) {
			params.modelSources.remove(expectDefined(params.targetsBySessionKey.get(key), "filtered row target"), storeKey);
			delete params.store[key];
			params.targetsBySessionKey.delete(key);
		}
	}
}
function resolvePreparedConfiguredSessionStoreTargets(cfg, includeIncognito, discovery) {
	const readOptions = discoveryReadOptions(discovery);
	const registryToken = discovery ? void 0 : readOpenClawAgentDatabaseRegistryToken();
	const incognitoGeneration = readOpenIncognitoAgentDatabaseGeneration();
	const cached = discovery ? void 0 : preparedConfiguredSessionStoreTargets;
	if (cached?.cfg === cfg && cached.registryToken === registryToken && cached.incognitoGeneration === incognitoGeneration && cached.includeIncognito === includeIncognito) return cached.resolved;
	const storeConfig = cfg.session?.store;
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const configuredIds = listConfiguredSessionStoreAgentIds(cfg);
	const configuredAgentIds = new Set(configuredIds);
	const incognitoTargets = includeIncognito ? listOpenIncognitoAgentDatabases() : [];
	const incognitoTargetKeys = new Set(incognitoTargets.map(storeTargetKey));
	const diagnostics = [];
	const { physicalTargets, onResolvedTarget } = capturePhysicalStoreTargets();
	let sharedStoreRowOwner;
	const candidates = dedupeSessionStoreTargetsBySqliteTarget([
		...(readOptions.registeredDatabases ?? listOpenClawRegisteredAgentDatabases()).map(({ agentId, path }) => ({
			agentId,
			storePath: path
		})),
		...configuredIds.map((agentId) => ({
			agentId,
			storePath: resolveSessionStorePathCore(storeConfig, {
				agentId,
				env: readOptions.env
			})
		})),
		...incognitoTargets
	], {
		defaultAgentId,
		...readOptions,
		onResolvedTarget,
		onDiagnostic: (diagnostic) => diagnostics.push(diagnostic.message),
		onSharedTarget: (selected, paths) => {
			sharedStoreRowOwner ??= resolveSharedStoreRowOwner(cfg, selected, paths, readOptions.env);
		}
	});
	const durableTargets = candidates.filter((target) => !incognitoTargetKeys.has(storeTargetKey(target)));
	const resolved = Object.freeze({
		configuredAgentIds,
		defaultAgentId,
		diagnostics: Object.freeze(diagnostics),
		durableStorePath: resolveCombinedDatabasePath(durableTargets, physicalTargets),
		durableTargets: Object.freeze(durableTargets.map((target) => Object.freeze({ ...target }))),
		incognitoTargets: Object.freeze(candidates.filter((target) => incognitoTargetKeys.has(storeTargetKey(target))).map((target) => Object.freeze({ ...target }))),
		sharedStoreRowOwner,
		physicalTargets,
		storeConfig
	});
	if (registryToken) preparedConfiguredSessionStoreTargets = {
		cfg,
		includeIncognito,
		incognitoGeneration,
		registryToken,
		resolved
	};
	return resolved;
}
function resolveGatewaySessionStoreTopology(cfg, opts) {
	const readOptions = discoveryReadOptions(opts.discovery);
	const storeConfig = cfg.session?.store;
	const diagnostics = [];
	const requestedAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
	if (opts.configuredAgentsOnly === true && !requestedAgentId) return resolvePreparedConfiguredSessionStoreTargets(cfg, opts.includeIncognito !== false, opts.discovery);
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const { physicalTargets, onResolvedTarget } = capturePhysicalStoreTargets();
	const incognitoTargets = opts.includeIncognito === false ? [] : listOpenIncognitoAgentDatabases().filter((target) => !requestedAgentId || target.agentId === requestedAgentId);
	if (storeConfig && !isStorePathTemplate(storeConfig)) {
		const ownerIds = [.../* @__PURE__ */ new Set([
			...listAgentEntries(cfg).map((entry) => normalizeAgentId(entry.id)),
			...listKnownSessionStoreAgentIds(cfg, readOptions),
			defaultAgentId,
			...requestedAgentId ? [requestedAgentId] : []
		])];
		let sharedStoreRowOwner;
		return {
			defaultAgentId,
			diagnostics,
			durableTargets: dedupeSessionStoreTargetsBySqliteTarget(ownerIds.map((agentId) => ({
				agentId,
				storePath: resolveSessionStorePathCore(storeConfig, {
					agentId,
					env: readOptions.env
				})
			})), {
				defaultAgentId,
				...readOptions,
				onResolvedTarget,
				onDiagnostic: (diagnostic) => diagnostics.push(diagnostic.message),
				onSharedTarget: (selected, paths) => {
					sharedStoreRowOwner ??= resolveSharedStoreRowOwner(cfg, selected, paths, readOptions.env);
				}
			}),
			incognitoTargets,
			requestedAgentId,
			preparedAgentIds: requestedAgentId ? new Set(ownerIds) : void 0,
			sharedStoreRowOwner,
			physicalTargets,
			storeConfig
		};
	}
	return {
		defaultAgentId,
		diagnostics,
		durableTargets: requestedAgentId ? dedupeSessionStoreTargetsBySqliteTarget(resolveAgentSessionStoreTargetsSync(cfg, requestedAgentId, readOptions), {
			defaultAgentId,
			onResolvedTarget,
			...readOptions
		}) : resolveAllAgentSessionStoreTargetsSync(cfg, {
			onResolvedTarget,
			...readOptions
		}),
		incognitoTargets,
		physicalTargets,
		requestedAgentId,
		preparedAgentIds: requestedAgentId ? /* @__PURE__ */ new Set([requestedAgentId]) : void 0,
		storeConfig
	};
}
function resolveGatewaySessionStoreTargets(cfg, opts = {}) {
	const readOptions = discoveryReadOptions(opts.discovery);
	if (opts.agentId?.trim()) assertAgentDatabaseAdmitted(opts.agentId, { env: readOptions.env });
	let resolved = resolveGatewaySessionStoreTopology(cfg, opts);
	if (opts.preserveSentinelOwners === "physical") {
		const { physicalTargets, onResolvedTarget } = capturePhysicalStoreTargets();
		const groupDiscovery = /* @__PURE__ */ new Map();
		const discoveredTargets = resolveAllAgentSessionStoreTargetsSync(cfg, {
			...readOptions,
			onResolvedTarget: ({ agentId }, physical) => groupDiscovery.set(physical.storePath, {
				agentId,
				order: groupDiscovery.size
			})
		});
		const durableTargets = dedupeSessionStoreTargetsBySqliteTarget([
			...resolved.durableTargets,
			...discoveredTargets,
			...(readOptions.registeredDatabases ?? listOpenClawRegisteredAgentDatabases()).filter(({ path }) => ![...resolved.physicalTargets.values()].some((target) => target.storePath === path)).map(({ agentId, path }) => ({
				agentId,
				storePath: path
			}))
		], {
			defaultAgentId: resolved.defaultAgentId,
			onResolvedTarget,
			...readOptions
		});
		resolved = {
			...resolved,
			durableTargets,
			physicalTargets,
			groupDiscovery
		};
	}
	const diagnostics = [...resolved.diagnostics];
	const env = readOptions.env ?? process.env;
	const deleted = createGatewayRetainedStoreMatcher(cfg, opts.discovery);
	const admitted = (target, durable = false) => {
		const physical = resolved.physicalTargets.get(storeTargetKey(target));
		if (durable && deleted(physical?.storePath ?? target.storePath, target.agentId)) return false;
		const refusal = readAgentDatabaseAdmissionRefusal(target.agentId, { env }) ?? (physical && readAgentDatabaseAdmissionRefusal(physical.agentId, { env }));
		if (!refusal) return true;
		const message = `${refusal.reason}\n${refusal.repairHint}`;
		if (!diagnostics.includes(message)) diagnostics.push(message);
		return false;
	};
	const durableTargets = resolved.durableTargets.filter((target) => admitted(target, true));
	const incognitoTargets = resolved.incognitoTargets.filter((target) => admitted(target));
	if (durableTargets.length === resolved.durableTargets.length && incognitoTargets.length === resolved.incognitoTargets.length) return resolved;
	return {
		...resolved,
		diagnostics,
		durableTargets,
		incognitoTargets,
		...resolved.durableStorePath === void 0 ? {} : { durableStorePath: resolveCombinedDatabasePath(durableTargets, resolved.physicalTargets) }
	};
}
function prepareCombinedSessionStore(cfg, opts) {
	const targets = resolveGatewaySessionStoreTargets(cfg, opts);
	return {
		projection: opts.projection ?? "list",
		targets,
		reads: targets.durableTargets.map((target) => ({
			target,
			storeTarget: expectDefined(targets.physicalTargets.get(storeTargetKey(target)), "physical store")
		}))
	};
}
function mergeCombinedSessionStore(cfg, opts, prepared, readEntries) {
	const env = opts.discovery?.env;
	const { projection } = prepared;
	const { configuredAgentIds, diagnostics, durableStorePath: preparedDurableStorePath, durableTargets, incognitoTargets, physicalTargets, requestedAgentId, preparedAgentIds, sharedStoreRowOwner, storeConfig } = prepared.targets;
	const combined = {};
	const targetsBySessionKey = /* @__PURE__ */ new Map();
	const projectionDiagnostics = [...diagnostics];
	const modelSources = createSessionModelSources(cfg, projectionDiagnostics, preparedAgentIds);
	for (const { target, storeTarget } of prepared.reads) {
		const agentId = target.agentId;
		const storePath = target.storePath;
		const store = readEntries(storeTarget);
		assertAgentDatabaseAdmitted(agentId, { env });
		assertAgentDatabaseAdmitted(storeTarget.agentId, { env });
		const rowAgentId = sharedStoreRowOwner?.target.storePath === storePath && sharedStoreRowOwner.target.agentId === agentId ? sharedStoreRowOwner.agentId : agentId;
		opts.onStoreLoaded?.(storeTarget, rowAgentId, prepared.targets.groupDiscovery?.get(storeTarget.storePath) ?? null);
		preparedAgentIds?.add(agentId);
		preparedAgentIds?.add(storeTarget.agentId);
		preparedAgentIds?.add(rowAgentId);
		const addModelEntry = modelSources.prepareStore(storeTarget);
		for (const { sessionKey: key, entry } of store) {
			const parsed = parseAgentSessionKey(key);
			const canonicalKey = resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId: parsed ? storeTarget.agentId : rowAgentId,
				sessionKey: key,
				preserveQualifiedAddress: true
			});
			if (key !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
			const canonicalAgentId = normalizeAgentId(parsed?.agentId ?? rowAgentId);
			preparedAgentIds?.add(canonicalAgentId);
			const source = addModelEntry(canonicalAgentId, canonicalKey, entry);
			if (requestedAgentId && canonicalAgentId !== requestedAgentId) continue;
			const projectedKey = opts.preserveSentinelOwners && (canonicalKey === "global" || canonicalKey === "unknown") ? JSON.stringify([canonicalKey, opts.preserveSentinelOwners === "physical" ? `${canonicalAgentId}\0${storeTarget.storePath}` : canonicalAgentId]) : canonicalKey;
			mergeSessionEntryIntoCombined({
				combined,
				targetsBySessionKey,
				entry,
				target: {
					agentId: canonicalAgentId,
					storeTarget,
					entry,
					...source,
					...projectedKey !== canonicalKey ? { storeKey: canonicalKey } : {}
				},
				canonicalKey,
				projectedKey
			});
		}
	}
	const incognitoStorePaths = mergeOpenIncognitoStores({
		combined,
		targetsBySessionKey,
		modelSources,
		projection,
		targets: incognitoTargets
	});
	if (configuredAgentIds) filterCombinedStoreToConfiguredAgents({
		cfg,
		configuredAgentIds,
		store: combined,
		targetsBySessionKey,
		modelSources
	});
	for (const [key, target] of targetsBySessionKey) combined[key] = projectGatewaySessionEntry(cfg, combined[key], target.resolveSourceKey);
	const durableStorePaths = durableTargets.map((target) => target.storePath);
	const durableStorePath = preparedDurableStorePath ?? resolveCombinedDatabasePath(durableTargets, physicalTargets);
	return {
		diagnostics: projectionDiagnostics,
		durableStorePath,
		durableTargets,
		storePath: storeConfig && !isStorePathTemplate(storeConfig) ? incognitoStorePaths.length > 0 ? "(multiple)" : durableStorePath : resolveCombinedStorePath([...durableStorePaths, ...incognitoStorePaths], storeConfig),
		store: combined,
		targetsBySessionKey
	};
}
function loadCombinedSessionStoreForGatewayCore(cfg, opts = {}) {
	const prepared = prepareCombinedSessionStore(cfg, opts);
	return mergeCombinedSessionStore(cfg, opts, prepared, (target) => opts.loadEntries ? opts.loadEntries(target, prepared.projection) : loadGatewayStoreEntries({
		...target,
		projection: prepared.projection
	}));
}
/** Descriptive listings retain federation policy while durable rows are read by its worker. */
async function loadCombinedSessionStoreForGatewayCoreAsync(cfg, opts = {}) {
	const options = { ...opts };
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const prepared = prepareCombinedSessionStore(cfg, options);
	const registryToken = readOpenClawAgentDatabaseRegistryToken();
	const incognitoGeneration = readOpenIncognitoAgentDatabaseGeneration();
	const transferEnv = {
		...env,
		OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR
	};
	return await withSessionHistoryWorkerDatabases(prepared.reads.map(({ storeTarget }) => ({
		agentId: storeTarget.agentId,
		path: storeTarget.storePath,
		env
	})), async (owners) => {
		const entries = /* @__PURE__ */ new Map();
		for (const [index, { storeTarget }] of prepared.reads.entries()) {
			const rows = await expectDefined(owners[index], "retained session store").readEntries({
				...storeTarget,
				env: transferEnv,
				projection: prepared.projection,
				clone: false
			});
			entries.set(storeTargetKey(storeTarget), rows);
		}
		for (const owner of owners) owner.assertCurrent();
		if (registryToken !== readOpenClawAgentDatabaseRegistryToken() || incognitoGeneration !== readOpenIncognitoAgentDatabaseGeneration()) throw new Error("Session stores changed while preparing the listing. Retry the request.");
		return mergeCombinedSessionStore(cfg, options, prepared, (target) => expectDefined(entries.get(storeTargetKey(target)), "prepared session entries"));
	});
}
//#endregion
export { resolveGatewaySessionStoreTargets as a, projectGatewaySessionEntry as i, loadCombinedSessionStoreForGatewayCore as n, loadCombinedSessionStoreForGatewayCoreAsync as r, isConfiguredGatewaySessionEntry as t };
