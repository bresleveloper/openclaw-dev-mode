import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as assertDatabasePathIdentity, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath, n as listSqliteTargetCandidatePathsForSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore, n as resolveAgentsDirFromSessionStorePath } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { n as serializeNativeErrorResponse } from "./native-error-response-6ofCMHxA.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-iJNKNMuJ.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { i as isSessionStoreReadCandidateCurrent, n as captureSessionStoreCandidateIdentities, o as qualifyAbsentSessionStoreReadCandidate, r as captureSessionStoreReadCandidate, s as resolveCapturedSessionStorePath, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSqliteTargetFromSessionStorePath, t as SessionStoreRegistryReadRequired } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { n as resolveSqliteAgentId } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-BbI9oEef.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, c as resolveConfiguredSessionStoreTargets, d as toDiscoveredSessionStoreTarget, f as dedupeSessionStoreTargetsBySqliteTarget, u as shouldSkipDiscoveryError } from "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { n as listKnownSessionStoreAgentIds, r as resolveExistingAgentSessionStoreTargetsSync } from "./targets-discovery.native-C3KQIMj6.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/targets-read-availability.worker.ts
function resolveReadDefaultAgentId(cfg, targetAgentId) {
	const persistedOwner = resolvePersistedSessionStoreOwner(cfg);
	return persistedOwner.kind === "none" ? normalizeAgentId(targetAgentId) : persistedOwner.agentId;
}
function dedupeTargetsByStorePath(targets) {
	return [...new Map(targets.map((target) => [target.storePath, target])).values()];
}
function readSessionStoreTargetSnapshot(params, read) {
	const databasePath = params.readCandidates ? assertSessionStoreReadCandidate(params.sqlitePath, params.readCandidates) : params.sqlitePath;
	const cacheKey = path.resolve(params.sqlitePath);
	const cached = params.cache?.get(cacheKey);
	if (cached) return cached;
	let snapshot;
	if (!fs.existsSync(params.sqlitePath)) snapshot = {
		available: false,
		reason: "database-missing"
	};
	else try {
		const result = withOpenClawAgentDatabaseReadOnly(read, {
			agentId: params.databaseAgentId,
			env: params.env,
			path: databasePath
		});
		snapshot = result.found ? {
			available: true,
			databaseAgentId: params.databaseAgentId,
			databasePath,
			value: result.value
		} : {
			available: false,
			reason: result.reason
		};
	} catch (error) {
		snapshot = {
			available: false,
			reason: "read-failed",
			error: serializeNativeErrorResponse(error)
		};
	}
	params.cache?.set(cacheKey, snapshot);
	return snapshot;
}
function resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, params) {
	const storeConfig = cfg.session?.store;
	const defaultAgentId = resolveReadDefaultAgentId(cfg, requested);
	const fixedTarget = {
		agentId: requested,
		storePath: resolveCapturedSessionStorePath(storeConfig, requested, env, params.readPaths)
	};
	try {
		const configuredTargets = resolveConfiguredSessionStoreTargets(cfg, env, params.readPaths);
		if (!configuredTargets.some((target) => normalizeAgentId(target.agentId) === requested)) configuredTargets.push(fixedTarget);
		const resolvedTarget = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, {
			agentId: requested,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		});
		const snapshot = readSessionStoreTargetSnapshot({
			cache: params.cache,
			databaseAgentId: normalizeAgentId(resolvedTarget.agentId ?? defaultAgentId),
			env,
			sqlitePath: resolvedTarget.path,
			readCandidates: params.readCandidates
		}, (database) => {
			const scopedAgentIds = /* @__PURE__ */ new Set();
			let hasUnscopedRow = false;
			for (const sessionKey of iterateSessionEntryKeys(database)) {
				const parsed = parseAgentSessionKey(sessionKey);
				if (parsed) scopedAgentIds.add(normalizeAgentId(parsed.agentId));
				else hasUnscopedRow = true;
			}
			return {
				scopedAgentIds,
				hasUnscopedRow
			};
		});
		if (!snapshot.available) return snapshot;
		if (snapshot.value.scopedAgentIds.has(requested)) {
			params.onResolvedTarget?.(fixedTarget, {
				agentId: snapshot.databaseAgentId,
				path: snapshot.databasePath
			});
			return {
				available: true,
				targets: [fixedTarget]
			};
		}
		if (!(resolvedTarget.shared === true || dedupeSessionStoreTargetsBySqliteTarget(configuredTargets, {
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		}).some((target) => normalizeAgentId(target.agentId) === requested))) return {
			available: false,
			reason: "read-failed"
		};
		const ownsUnscopedRows = snapshot.databaseAgentId === requested && snapshot.value.hasUnscopedRow;
		if (ownsUnscopedRows) params.onResolvedTarget?.(fixedTarget, {
			agentId: snapshot.databaseAgentId,
			path: snapshot.databasePath
		});
		return {
			available: true,
			targets: ownsUnscopedRows ? [fixedTarget] : []
		};
	} catch (error) {
		if (error instanceof SessionStoreRegistryReadRequired) throw error;
		return {
			available: false,
			reason: "read-failed",
			error: serializeNativeErrorResponse(error)
		};
	}
}
/** Resolves every plausible store while preserving read availability and ownership. */
function resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	if (!isPerAgentSessionStoreConfig(cfg.session?.store)) return resolveFixedSessionStoreTargetsReadOnly(cfg, requested, env, params);
	const candidates = dedupeTargetsByStorePath([{
		agentId: requested,
		storePath: resolveCapturedSessionStorePath(cfg.session?.store, requested, env, params.readPaths)
	}, ...resolveExistingAgentSessionStoreTargetsSync(cfg, requested, {
		env,
		registeredDatabases: params.registeredDatabases,
		readCandidates: params.readCandidates,
		readPaths: params.readPaths
	})]);
	const targets = [];
	for (const target of candidates) {
		const defaultAgentId = resolveReadDefaultAgentId(cfg, target.agentId);
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates
		});
		const snapshot = readSessionStoreTargetSnapshot({
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			env,
			sqlitePath: resolved.path,
			readCandidates: params.readCandidates
		}, () => void 0);
		if (!snapshot.available) {
			if (snapshot.reason === "database-missing") continue;
			return snapshot;
		}
		targets.push(target);
		params.onResolvedTarget?.(target, {
			agentId: snapshot.databaseAgentId,
			path: snapshot.databasePath
		});
	}
	if (targets.length === 0) return {
		available: false,
		reason: "database-missing"
	};
	return {
		available: true,
		targets
	};
}
//#endregion
//#region src/config/sessions/session-store-target-inventory.ts
var SessionStoreTargetDataReadError = class extends Error {
	constructor(readError) {
		super("Session store target data read failed", { cause: readError });
		this.readError = readError;
	}
};
/** Preserve positive locator failures without catching native close or candidate revocation. */
function readSessionStoreTargetResult(request) {
	try {
		const target = resolveSqliteTargetFromSessionStorePath(request.storePath, {
			agentId: request.agentId,
			defaultAgentId: request.defaultAgentId,
			env: request.env,
			registeredDatabases: request.registeredDatabases,
			readCandidates: request.candidates,
			onReadError(error) {
				throw new SessionStoreTargetDataReadError(error);
			}
		});
		let agentId;
		try {
			agentId = resolveSqliteAgentId({
				scopedAgentId: request.agentId,
				storeAgentId: target.agentId ?? request.agentId,
				storeShared: target.shared
			});
			if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
		} catch (error) {
			throw new SessionStoreTargetDataReadError(error);
		}
		return ok({
			kind: "session-store-target",
			sourcePath: target.path,
			logicalAgentId: agentId,
			database: {
				agentId: target.shared ? target.agentId ?? agentId : agentId,
				path: assertSessionStoreReadCandidate(target.path, request.candidates)
			}
		});
	} catch (error) {
		if (error instanceof SessionStoreRegistryReadRequired) return ok({ kind: "session-target-registry-required" });
		if (error instanceof SessionStoreTargetDataReadError) return err(error.readError);
		throw error;
	}
}
function captureSessionStoreCandidateInventory(storePath) {
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const candidates = [captureSessionStoreReadCandidate(target.path)];
	if (target.agentId || target.shared) return {
		candidates,
		familyListingComplete: false
	};
	candidates.unshift(captureSessionStoreReadCandidate(target.path, "sibling-family"));
	let familyListingComplete = false;
	try {
		for (const candidate of listSqliteTargetCandidatePathsForSessionStorePath(storePath)) if (candidate !== target.path) candidates.push(captureSessionStoreReadCandidate(candidate));
		familyListingComplete = true;
	} catch {}
	return {
		candidates,
		familyListingComplete
	};
}
function captureSessionStoreReadCandidates(storePath) {
	return captureSessionStoreCandidateInventory(storePath).candidates;
}
/** A complete initial listing proves absence for a later-selected sibling without predicting ownership. */
function captureSessionStoreWriteCandidates(storePath) {
	const captured = captureSessionStoreCandidateInventory(storePath);
	const identities = captureSessionStoreCandidateIdentities(captured.candidates);
	const assertCurrent = () => {
		if (!captured.candidates.every(isSessionStoreReadCandidateCurrent)) throw new Error("Session database selector changed during discovery");
	};
	return {
		assertCurrent,
		resolveIdentity(pathname) {
			assertCurrent();
			const physicalPath = assertSessionStoreReadCandidate(pathname, captured.candidates);
			const identity = identities.get(physicalPath);
			if (identity) {
				assertDatabasePathIdentity(pathname, identity);
				return identity;
			}
			return qualifyAbsentSessionStoreReadCandidate(pathname, captured);
		}
	};
}
/** Scope registry publications to the paths that can change the original selection. */
function createSessionStoreRegistryMutationFilter(params) {
	const registryCandidates = params.captured.filter(({ candidate }) => !resolveUnsuffixedSqliteTargetFromSessionStorePath(candidate.path).agentId);
	return (mutation, entries) => mutation.sources.every((source) => {
		const sameCapturedRegistration = params.captured.some(({ candidate, identity, birthtime }) => identity.startsWith("file:") && identity === source.identity && (source.path === candidate.path || source.path === candidate.physicalPath) && isCurrentRegistrySourceGeneration({
			path: candidate.path,
			identity,
			birthtime
		}, source) && entries?.some((entry) => entry.agentId === source.agentId && entry.schemaVersion === source.schemaVersion && (entry.path === candidate.path || entry.path === candidate.physicalPath)));
		if (mutation.kind === "upsert" && source.schemaVersion === 27 && (sameCapturedRegistration || params.preparedSources.some((prepared) => prepared.agentId === source.agentId && (prepared.identity === source.identity || params.captured.some(({ candidate, identity, birthtime }) => birthtime === void 0 && identity === source.identity && (candidate.path === prepared.path || candidate.physicalPath === prepared.path))) && isCurrentRegistrySourceGeneration(prepared, source)))) return true;
		return !params.preparedSources.some((prepared) => prepared.path === source.path || prepared.path === source.physicalPath || prepared.identity === source.identity) && !isSessionStoreRegistryDiscoveryPath(params.registryDiscovery, source) && !registryCandidates.some(({ candidate, identity }) => identity.startsWith("file:") && source.identity === identity || matchesAgentDatabaseReadCandidatePath(candidate, source.path) || matchesAgentDatabaseReadCandidatePath({
			...candidate,
			path: candidate.physicalPath
		}, source.physicalPath));
	});
}
function isCurrentRegistrySourceGeneration(captured, source) {
	if (captured.birthtime === void 0) return false;
	try {
		for (const pathname of /* @__PURE__ */ new Set([
			captured.path,
			source.path,
			source.physicalPath
		])) assertExistingDatabaseIdentity(pathname, captured.identity, captured.birthtime);
		return true;
	} catch {
		return false;
	}
}
/** Capture locators and bounded families without reading SQLite or assigning an owner. */
function prepareSessionStoreTargetInventory(cfg, inputAgentIds, inputEnv = process.env, selection) {
	const env = cloneEnvWithPlatformSemantics(inputEnv);
	const stateDir = resolveStateDir(env);
	env.OPENCLAW_STATE_DIR = stateDir;
	const config = captureRuntimeConfig(cfg);
	const agentIds = [...new Set(inputAgentIds.map(normalizeAgentId))];
	const configured = listConfiguredSessionStoreAgentIds(config);
	const paths = new Map([.../* @__PURE__ */ new Set([...agentIds, ...configured])].map((agentId) => [agentId, {
		configured: resolveSessionStorePathCore(config.session?.store, {
			agentId,
			env
		}),
		default: resolveSessionStorePathCore(void 0, {
			agentId,
			env
		})
	}]));
	const perAgent = isPerAgentSessionStoreConfig(config.session?.store);
	const retired = new Set(agentIds.filter((agentId) => !configured.includes(agentId)));
	const logicalPaths = new Set(agentIds.flatMap((agentId) => {
		const captured = paths.get(agentId);
		return perAgent ? [captured.configured, captured.default] : [captured.configured];
	}));
	if (perAgent && retired.size > 0) for (const agentId of configured) logicalPaths.add(paths.get(agentId).configured);
	const roots = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
	for (const value of paths.values()) {
		const root = resolveAgentsDirFromSessionStorePath(value.configured);
		if (root) roots.add(root);
	}
	if (selection === "recovery" || perAgent && retired.size > 0) for (const root of roots) try {
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(root, (name) => selection === "recovery" || retired.has(normalizeAgentId(name)))) logicalPaths.add(path.join(sessionsDir, "sessions.json"));
	} catch (error) {
		if (!shouldSkipDiscoveryError(error)) throw error;
	}
	const candidates = /* @__PURE__ */ new Map();
	for (const storePath of logicalPaths) {
		const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
		if (selection === void 0 && agentIds.some((agentId) => isIncognitoOpenClawAgentSqlitePath(target.path, {
			agentId,
			env
		}))) throw new Error("Incognito session discovery requires its process-held owner");
		for (const candidate of captureSessionStoreReadCandidates(storePath)) candidates.set(JSON.stringify(candidate), candidate);
	}
	return {
		selection,
		config,
		agentIds,
		env: {
			...env,
			OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR
		},
		paths,
		candidates: [...candidates.values()],
		...perAgent && retired.size > 0 ? { registryDiscovery: {
			agentIds: [...retired],
			roots: [...roots].map((root) => captureSessionStoreReadCandidate(root))
		} } : {}
	};
}
/** Future retired directories follow the same root and directory-name rules as discovery. */
function isSessionStoreRegistryDiscoveryPath(scope, source) {
	if (!scope) return false;
	return scope.roots.some((root) => [root.path, root.physicalPath].some((rootPath) => [source.path, source.physicalPath].some((sourcePath) => {
		const relative = path.relative(rootPath, sourcePath);
		const directoryName = relative.split(path.sep)[0];
		if (path.isAbsolute(relative) || !directoryName || directoryName === "..") return false;
		const sessionsDir = path.join(rootPath, directoryName, "sessions");
		const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
		return target !== void 0 && scope.agentIds.includes(target.agentId) && resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path === sourcePath;
	})));
}
/** Worker-only native discovery; registry facts come from the canonical host memo. */
function readSessionStoreTargetInventory(request) {
	const env = cloneEnvWithPlatformSemantics(request.env);
	const config = request.config;
	const cache = /* @__PURE__ */ new Map();
	let readFailed = false;
	try {
		if (request.selection === "known-owners") return {
			kind: "session-target-inventory",
			agents: listKnownSessionStoreAgentIds(config, {
				env,
				registeredDatabases: request.registeredDatabases
			}).map((agentId) => ({
				agentId,
				result: {
					available: true,
					targets: []
				},
				reads: []
			}))
		};
		if (request.selection === "configured" || request.selection === "recovery") {
			const agents = [];
			const options = {
				defaultAgentId: resolveSessionStoreCompatibilityAgentId(config),
				env,
				registeredDatabases: request.registeredDatabases,
				readCandidates: request.candidates,
				readPaths: request.paths,
				onResolvedTarget(target, physical) {
					const databasePath = assertSessionStoreReadCandidate(physical.storePath, request.candidates);
					const selected = request.selection === "recovery" ? {
						...target,
						agentId: physical.agentId
					} : target;
					agents.push({
						agentId: selected.agentId,
						result: {
							available: true,
							targets: [selected]
						},
						reads: [{
							target: physical,
							database: {
								agentId: physical.agentId,
								path: isIncognitoOpenClawAgentSqlitePath(physical.storePath, {
									agentId: physical.agentId,
									env
								}) ? physical.storePath : databasePath
							}
						}]
					});
				}
			};
			if (request.selection === "recovery") resolveAllAgentSessionStoreTargetsSync(config, {
				...options,
				fixedStoreAgentIds: new Set(request.agentIds)
			});
			else dedupeSessionStoreTargetsBySqliteTarget(resolveConfiguredSessionStoreTargets(config, env, request.paths), options);
			return {
				kind: "session-target-inventory",
				agents
			};
		}
		return {
			kind: "session-target-inventory",
			agents: request.agentIds.map((agentId) => {
				const reads = [];
				const result = resolveExistingAgentSessionStoreTargetsReadOnlyResult(config, agentId, {
					env,
					cache,
					registeredDatabases: request.registeredDatabases,
					readCandidates: request.candidates,
					readPaths: request.paths,
					onResolvedTarget: (target, database) => reads.push({
						target,
						database
					})
				});
				readFailed ||= !result.available && result.reason !== "database-missing";
				return {
					agentId,
					result,
					reads: result.available ? reads : []
				};
			})
		};
	} catch (error) {
		if (error instanceof SessionStoreRegistryReadRequired) return {
			kind: "session-target-registry-required",
			readFailed
		};
		throw error;
	}
}
//#endregion
export { readSessionStoreTargetInventory as a, prepareSessionStoreTargetInventory as i, captureSessionStoreWriteCandidates as n, readSessionStoreTargetResult as o, createSessionStoreRegistryMutationFilter as r, resolveExistingAgentSessionStoreTargetsReadOnlyResult as s, captureSessionStoreReadCandidates as t };
