import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveRequiredHomeDir, o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { d as readOpenClawAgentDatabaseRegistryToken, s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as getAgentDatabaseStartupAdmission } from "./agent-database-startup-DQZqWc4z.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-iJNKNMuJ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, f as dedupeSessionStoreTargetsBySqliteTarget, o as resolveConfiguredAgentDatabaseCandidatePaths, r as resolveAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import { n as listKnownSessionStoreAgentIds, t as createExistingAgentSessionStoreTargetResolver } from "./targets-discovery.native-C3KQIMj6.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { a as resolveSessionStoreIdentity, i as resolveSessionStoreAgentId, l as selectStoredSessionLineage, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { t as resolveGatewaySessionStoreCandidates } from "./session-utils-store-candidates-DoVKUG44.mjs";
import { a as resolveNativeGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { n as createRetainedAgentDatabaseMatcher, r as createRetainedAgentDatabaseMatcherFromSnapshot } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/session-utils-store-lineage.native.ts
/** Stored-address joins share discovery without passing selected keys through request aliases. */
function createGatewaySessionLineageReader(cfg) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const resolveExistingTargets = createExistingAgentSessionStoreTargetResolver(cfg, { isSameDatabasePath: createOpenClawAgentDatabasePathMatcher() });
	function prepareDiscovery(params) {
		const identity = resolveSessionStoreIdentity({
			cfg,
			sessionKey: params.key,
			agentId: params.agentId,
			preserveQualifiedAddress: params.preserveQualifiedAddress
		});
		if (isIncognitoSessionKey(identity.canonicalKey)) return;
		const agentIds = /* @__PURE__ */ new Set([identity.agentId]);
		const parsed = parseAgentSessionKey(params.key);
		if (!params.preserveQualifiedAddress && parsed) agentIds.add(normalizeAgentId(parsed.agentId));
		for (const agentId of agentIds) resolveGatewaySessionStoreCandidates(cfg, agentId, targetDiscoveryCache, false, params.env, resolveExistingTargets);
	}
	function readAlias(key, agentId) {
		const metadata = captureSessionEntryMetadataRead({
			sessionKey: key,
			agentId
		}, () => {});
		if (metadata) return metadata.readCurrent();
		const params = {
			cfg,
			key,
			...parseAgentSessionKey(key) ? {} : { agentId },
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		};
		prepareDiscovery(params);
		const target = resolveNativeGatewaySessionStoreTargetWithStore(params);
		return target.store[target.canonicalKey];
	}
	const readStored = (agentId, key) => {
		if (isIncognitoSessionKey(key)) return readAlias(key, agentId);
		const params = {
			cfg,
			agentId,
			key,
			preserveQualifiedAddress: true,
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		};
		prepareDiscovery(params);
		return resolveNativeGatewaySessionStoreTargetWithStore(params).store[key];
	};
	return {
		readStored,
		readAlias
	};
}
//#endregion
//#region src/config/sessions/combined-store-paths.ts
const configuredAdmissionPaths = /* @__PURE__ */ new WeakMap();
function createGatewayConfiguredDatabaseMatcher(cfg, env) {
	const admission = getAgentDatabaseStartupAdmission();
	const registryToken = readOpenClawAgentDatabaseRegistryToken({ env });
	const context = JSON.stringify([
		resolveStateDir(env),
		resolveRequiredHomeDir(env),
		resolveUserPath(".")
	]);
	const cached = isDeeplyFrozenPlainData(cfg) ? configuredAdmissionPaths.get(cfg) : void 0;
	const paths = cached && cached.admission === admission && cached.registryToken === registryToken && cached.context === context ? cached.paths : new Set(resolveConfiguredAgentDatabaseCandidatePaths(cfg, { env }));
	if (paths !== cached?.paths && isDeeplyFrozenPlainData(cfg)) configuredAdmissionPaths.set(cfg, {
		admission,
		registryToken,
		context,
		paths
	});
	let physical;
	const candidates = paths.values();
	return (pathname) => {
		if (paths.has(pathname)) return true;
		if (!fs.statSync(pathname, { throwIfNoEntry: false })) return false;
		physical ??= {
			key: createOpenClawAgentDatabasePathMatcher().createIndex(),
			paths: /* @__PURE__ */ new Set()
		};
		const requestedKey = physical.key(pathname);
		if (physical.paths.has(requestedKey)) return true;
		for (const candidate of candidates) try {
			if (!fs.statSync(candidate, { throwIfNoEntry: false })) continue;
			const candidateKey = physical.key(candidate);
			physical.paths.add(candidateKey);
			if (candidateKey === requestedKey) return true;
		} catch {}
		return false;
	};
}
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
		readCandidates: discovery.readCandidates,
		registeredDatabases: (discovery.snapshot?.registeredAgentDatabases ?? []).filter((entry) => entry.schemaVersion === 27)
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
function createSessionModelSources(cfg, diagnostics, preparedAgentIds, readQualifiedParent) {
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
				const readerKey = logicalAgentId;
				let read = readers.get(readerKey);
				if (!read) {
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
					readers.set(readerKey, read);
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
	return listSessionEntriesReadOnly({
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
	let projected = entry;
	if (cfg.session?.scope === "global") for (const field of ["parentSessionKey", "spawnedBy"]) {
		const sessionKey = projected[field];
		const parsed = sessionKey ? parseAgentSessionKey(sessionKey) : null;
		if (sessionKey && parsed) {
			const sourceKey = resolveSourceKey?.(sessionKey) ?? canonicalizeMainSessionAlias({
				cfg,
				agentId: parsed.agentId,
				sessionKey
			});
			if (sourceKey !== sessionKey) {
				if (projected === entry) projected = { ...entry };
				projected[field] = sourceKey;
			}
		}
	}
	return projected;
}
function mergeOpenIncognitoStores(params) {
	const storePaths = [];
	for (const target of params.targets) {
		const store = params.readEntries ? params.readEntries(target) : captureMemoryExactSessionReader(target)?.entries(params.projection) ?? [];
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
function resolvePreparedConfiguredSessionStoreTargets(cfg, discovery) {
	const readOptions = discoveryReadOptions(discovery);
	const registryToken = discovery ? void 0 : readOpenClawAgentDatabaseRegistryToken();
	const cached = discovery ? void 0 : preparedConfiguredSessionStoreTargets;
	if (cached?.cfg === cfg && cached.registryToken === registryToken) return cached.resolved;
	const storeConfig = cfg.session?.store;
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const configuredIds = listConfiguredSessionStoreAgentIds(cfg);
	const configuredAgentIds = new Set(configuredIds);
	const diagnostics = [];
	const { physicalTargets, onResolvedTarget } = capturePhysicalStoreTargets();
	let sharedStoreRowOwner;
	const durableTargets = dedupeSessionStoreTargetsBySqliteTarget([...(readOptions.registeredDatabases ?? listOpenClawRegisteredAgentDatabases()).map(({ agentId, path }) => ({
		agentId,
		storePath: path
	})), ...configuredIds.map((agentId) => ({
		agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId,
			env: readOptions.env
		})
	}))], {
		defaultAgentId,
		...readOptions,
		onResolvedTarget,
		onDiagnostic: (diagnostic) => diagnostics.push(diagnostic.message),
		onSharedTarget: (selected, paths) => {
			sharedStoreRowOwner ??= resolveSharedStoreRowOwner(cfg, selected, paths, readOptions.env);
		}
	});
	const resolved = Object.freeze({
		configuredAgentIds,
		defaultAgentId,
		diagnostics: Object.freeze(diagnostics),
		durableStorePath: resolveCombinedDatabasePath(durableTargets, physicalTargets),
		durableTargets: Object.freeze(durableTargets.map((target) => Object.freeze({ ...target }))),
		incognitoTargets: [],
		sharedStoreRowOwner,
		physicalTargets,
		storeConfig
	});
	if (registryToken) preparedConfiguredSessionStoreTargets = {
		cfg,
		registryToken,
		resolved
	};
	return resolved;
}
function listMemorySessionStoreTargets(env) {
	const selected = captureSessionActorStorageOwner({ env });
	const stateDir = selected ? path.resolve(selected.path, "../../../..") : resolveStateDir(env);
	const targets = memorySessionActorOwners.list().filter((owner) => path.resolve(owner.path, "../../../..") === stateDir).map((owner) => ({
		agentId: owner.agentId,
		storePath: owner.path
	}));
	if (selected && !targets.some((target) => target.storePath === selected.path)) targets.push({
		agentId: selected.agentId,
		storePath: selected.path
	});
	return targets;
}
function resolveGatewaySessionStoreTopology(cfg, opts) {
	const readOptions = discoveryReadOptions(opts.discovery);
	const storeConfig = cfg.session?.store;
	const diagnostics = [];
	const requestedAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const incognitoTargets = opts.includeIncognito === false ? [] : listMemorySessionStoreTargets(readOptions.env).filter((target) => !requestedAgentId || target.agentId === requestedAgentId);
	if (opts.configuredAgentsOnly === true && !requestedAgentId) return {
		...resolvePreparedConfiguredSessionStoreTargets(cfg, opts.discovery),
		incognitoTargets
	};
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const { physicalTargets, onResolvedTarget } = capturePhysicalStoreTargets();
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
	const deleted = createGatewayRetainedStoreMatcher(cfg, opts.discovery);
	const durableTargets = resolved.durableTargets.filter((target) => {
		const physical = resolved.physicalTargets.get(storeTargetKey(target));
		return !deleted(physical?.storePath ?? target.storePath, target.agentId);
	});
	resolved = {
		...resolved,
		durableTargets,
		...resolved.durableStorePath === void 0 ? {} : { durableStorePath: resolveCombinedDatabasePath(durableTargets, resolved.physicalTargets) }
	};
	return applyGatewaySessionStoreAdmission(cfg, opts, resolved);
}
/** Admission remains with the Gateway that owns the startup refusal state. */
function applyGatewaySessionStoreAdmission(cfg, opts, resolved) {
	const diagnostics = [...resolved.diagnostics];
	const env = opts.discovery?.env ?? process.env;
	if (opts.agentId?.trim()) assertAgentDatabaseAdmitted(opts.agentId, { env });
	const isConfiguredDatabase = opts.preserveSentinelOwners === "physical" && getAgentDatabaseStartupAdmission() ? createGatewayConfiguredDatabaseMatcher(cfg, env) : void 0;
	const admitted = (target) => {
		const physical = resolved.physicalTargets.get(storeTargetKey(target));
		if (isConfiguredDatabase && physical && !isConfiguredDatabase(physical.storePath)) return false;
		const refusal = readAgentDatabaseAdmissionRefusal(target.agentId, { env }) ?? (physical && readAgentDatabaseAdmissionRefusal(physical.agentId, { env }));
		if (!refusal) return true;
		const message = `${refusal.reason}\n${refusal.repairHint}`;
		if (!diagnostics.includes(message)) diagnostics.push(message);
		return false;
	};
	const durableTargets = resolved.durableTargets.filter(admitted);
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
function mergeCombinedSessionStore(cfg, opts, prepared, readEntries, readQualifiedParent, incognitoEntries) {
	const env = opts.discovery?.env;
	const { projection } = prepared;
	const { configuredAgentIds, diagnostics, durableStorePath: preparedDurableStorePath, durableTargets, incognitoTargets, physicalTargets, requestedAgentId, preparedAgentIds, sharedStoreRowOwner, storeConfig } = prepared.targets;
	const combined = {};
	const targetsBySessionKey = /* @__PURE__ */ new Map();
	const projectionDiagnostics = [...diagnostics];
	const modelSources = createSessionModelSources(cfg, projectionDiagnostics, preparedAgentIds, readQualifiedParent);
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
		targets: incognitoTargets,
		readEntries: incognitoEntries
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
	}), createGatewaySessionLineageReader(cfg));
}
//#endregion
export { mergeCombinedSessionStore as a, resolveGatewaySessionStoreTargets as c, loadCombinedSessionStoreForGatewayCore as i, storeTargetKey as l, isConfiguredGatewaySessionEntry as n, prepareCombinedSessionStore as o, listMemorySessionStoreTargets as r, projectGatewaySessionEntry as s, applyGatewaySessionStoreAdmission as t };
