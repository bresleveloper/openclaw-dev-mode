import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore, n as resolveAgentsDirFromSessionStorePath } from "./paths-dpReqUI8.mjs";
import { C as listSqliteTargetCandidatePathsForSessionStorePath, S as listConfiguredSessionStoreAgentIds, w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-dGf2LeNv.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CnfJSmam.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { c as captureSessionStoreReadCandidate, o as resolveSqliteTargetFromSessionStorePath, s as assertSessionStoreReadCandidate, t as SessionStoreRegistryReadRequired, u as resolveCapturedSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { n as resolveSqliteAgentId } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-SATsXf4g.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, c as resolveConfiguredSessionStoreTargets, d as shouldSkipDiscoveryError, f as toDiscoveredSessionStoreTarget, l as resolveExistingAgentSessionStoreTargetsSync, p as dedupeSessionStoreTargetsBySqliteTarget } from "./targets-BbcRkdUC.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/targets-read-availability.ts
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
	} catch {
		snapshot = {
			available: false,
			reason: "read-failed"
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
			reason: "read-failed"
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
		}, (database) => [...iterateSessionEntryKeys(database, { limit: 1 })]);
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
/** Resolve a single configured store without inspecting or listing its session rows. */
function readSessionStoreTarget(request, onReadError) {
	try {
		const target = resolveSqliteTargetFromSessionStorePath(request.storePath, {
			agentId: request.agentId,
			defaultAgentId: request.defaultAgentId,
			env: request.env,
			registeredDatabases: request.registeredDatabases,
			readCandidates: request.candidates,
			onReadError
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
			onReadError?.(error);
			throw error;
		}
		return {
			kind: "session-store-target",
			sourcePath: target.path,
			logicalAgentId: agentId,
			database: {
				agentId: target.shared ? target.agentId ?? agentId : agentId,
				path: assertSessionStoreReadCandidate(target.path, request.candidates)
			}
		};
	} catch (error) {
		if (error instanceof SessionStoreRegistryReadRequired) return { kind: "session-target-registry-required" };
		throw error;
	}
}
var SessionStoreTargetDataReadError = class extends Error {
	constructor(readError) {
		super("Session store target data read failed", { cause: readError });
		this.readError = readError;
	}
};
/** Preserve positive locator failures without catching native close or candidate revocation. */
function readSessionStoreTargetResult(request) {
	try {
		return ok(readSessionStoreTarget(request, (error) => {
			throw new SessionStoreTargetDataReadError(error);
		}));
	} catch (error) {
		if (error instanceof SessionStoreTargetDataReadError) return err(error.readError);
		throw error;
	}
}
function captureSessionStoreReadCandidates(storePath) {
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const candidates = /* @__PURE__ */ new Map();
	const add = (candidate) => candidates.set(JSON.stringify(candidate), candidate);
	if (!target.agentId && !target.shared) add(captureSessionStoreReadCandidate(target.path, "sibling-family"));
	add(captureSessionStoreReadCandidate(target.path));
	try {
		for (const candidate of listSqliteTargetCandidatePathsForSessionStorePath(storePath)) add(captureSessionStoreReadCandidate(candidate));
	} catch {}
	return [...candidates.values()];
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
		if (mutation.kind === "upsert" && source.schemaVersion === 24 && (sameCapturedRegistration || params.preparedSources.some((prepared) => prepared.agentId === source.agentId && prepared.identity === source.identity && isCurrentRegistrySourceGeneration(prepared, source)))) return true;
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
	const config = structuredClone(cfg);
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
	const add = (candidate) => candidates.set(JSON.stringify(candidate), candidate);
	for (const storePath of logicalPaths) {
		const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
		if (selection === void 0 && agentIds.some((agentId) => isIncognitoOpenClawAgentSqlitePath(target.path, {
			agentId,
			env
		}))) throw new Error("Incognito session discovery requires its process-held owner");
		for (const candidate of captureSessionStoreReadCandidates(storePath)) add(candidate);
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
					agents.push({
						agentId: target.agentId,
						result: {
							available: true,
							targets: [target]
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
			if (request.selection === "recovery") resolveAllAgentSessionStoreTargetsSync(config, options);
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
export { readSessionStoreTargetResult as a, readSessionStoreTargetInventory as i, createSessionStoreRegistryMutationFilter as n, resolveExistingAgentSessionStoreTargetsReadOnlyResult as o, prepareSessionStoreTargetInventory as r, captureSessionStoreReadCandidates as t };
