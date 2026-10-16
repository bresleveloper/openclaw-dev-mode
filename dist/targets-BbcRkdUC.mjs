import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, a as resolveAgentDir, g as resolveDefaultAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore, n as resolveAgentsDirFromSessionStorePath } from "./paths-dpReqUI8.mjs";
import { C as listSqliteTargetCandidatePathsForSessionStorePath, S as listConfiguredSessionStoreAgentIds, w as resolveUnsuffixedSqliteTargetFromSessionStorePath, x as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-dGf2LeNv.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget, t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CnfJSmam.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as readSessionStoreRegistryRows, n as listDurableSqliteTargetOwnersForSessionStorePath, o as resolveSqliteTargetFromSessionStorePath, s as assertSessionStoreReadCandidate, u as resolveCapturedSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-SATsXf4g.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/targets-collision.ts
const log = createSubsystemLogger("sessions/targets");
function dedupeSessionStoreTargetsBySqliteTarget(targets, options) {
	const reportDiagnostic = (diagnostic) => {
		if (options.onDiagnostic) options.onDiagnostic(diagnostic);
		else log.warn(diagnostic.message);
	};
	const registeredDatabases = readSessionStoreRegistryRows(options.registeredDatabases, options.env);
	const grouped = /* @__PURE__ */ new Map();
	const logicalGroups = /* @__PURE__ */ new Map();
	const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
	const resolvePhysicalGroupKey = (groups, pathname) => [...groups.keys()].find((candidate) => isSameDatabasePath(candidate, pathname)) ?? path.resolve(pathname);
	for (const target of targets) {
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId: options.defaultAgentId,
			env: options.env,
			registeredDatabases,
			isSameDatabasePath,
			readCandidates: options.readCandidates
		});
		const sqlitePath = resolvePhysicalGroupKey(grouped, resolved.path);
		const group = grouped.get(sqlitePath) ?? [];
		group.push({
			target,
			shared: resolved.shared === true,
			...resolved.agentId ? { databaseOwnerAgentId: normalizeAgentId(resolved.agentId) } : {}
		});
		grouped.set(sqlitePath, group);
		if (resolved.shared) continue;
		const unsuffixedPath = resolvePhysicalGroupKey(logicalGroups, path.resolve(resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path));
		const logicalGroup = logicalGroups.get(unsuffixedPath) ?? [];
		logicalGroup.push({
			target,
			...resolved.ownerSource ? { ownerSource: resolved.ownerSource } : {},
			...resolved.unsuffixedOwnerAgentId ? { unsuffixedOwnerAgentId: resolved.unsuffixedOwnerAgentId } : {}
		});
		logicalGroups.set(unsuffixedPath, logicalGroup);
	}
	for (const [sqlitePath, group] of logicalGroups) {
		const agentIds = [...new Set(group.map(({ target }) => normalizeAgentId(target.agentId)))];
		if (agentIds.length <= 1 || group.some((entry) => !entry.ownerSource)) continue;
		const ownerAgentId = group[0]?.unsuffixedOwnerAgentId;
		const ownerSource = group[0]?.ownerSource ?? "configured-default";
		const ignoredAgentIds = ownerAgentId ? agentIds.filter((agentId) => agentId !== ownerAgentId) : agentIds;
		reportDiagnostic({
			message: ownerAgentId ? `Session store target collision at ${sqlitePath}: owner "${ownerAgentId}" selected by ${ownerSource}; suffixed owner(s): ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : ownerSource === "registered-suffixed" ? `Session store target collision at ${sqlitePath}: configured default retains its registered suffixed target; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : ownerSource === "occupied-unsuffixed" ? `Session store target collision at ${sqlitePath}: unsuffixed target is occupied without a durable owner; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : `Session store target collision at ${sqlitePath}: registry ownership is ambiguous; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.`,
			sqlitePath,
			...ownerAgentId ? { ownerAgentId } : {},
			ignoredAgentIds,
			ownerSource
		});
	}
	const deduped = [];
	for (const [sqlitePath, group] of grouped) {
		const byAgentId = new Map(group.map(({ target }) => [normalizeAgentId(target.agentId), target]));
		const pathOwners = [...new Set(group.flatMap((entry) => entry.databaseOwnerAgentId ?? []))];
		const registeredOwners = pathOwners.length === 1 ? [] : [...new Set(registeredDatabases.filter((entry) => isSameDatabasePath(entry.path, sqlitePath)).map((entry) => normalizeAgentId(entry.agentId)))];
		const collision = byAgentId.size > 1;
		if (pathOwners.length !== 1 && registeredOwners.length > 1) {
			reportDiagnostic({
				message: `Session store target collision at ${sqlitePath}: registry ownership is ambiguous across ${registeredOwners.map((id) => `"${id}"`).join(", ")}; no owner selected.`,
				sqlitePath,
				ignoredAgentIds: [...byAgentId.keys()],
				ownerSource: "ambiguous-registry"
			});
			continue;
		}
		const ownerSource = pathOwners.length === 1 ? "database-path" : registeredOwners.length === 1 ? "database-registry" : "configured-default";
		const ownerAgentId = normalizeAgentId(pathOwners[0] ?? registeredOwners[0] ?? (collision ? options.defaultAgentId : group[0].target.agentId));
		const selected = byAgentId.get(ownerAgentId) ?? (group.some((entry) => entry.shared) ? byAgentId.get(normalizeAgentId(options.defaultAgentId)) ?? group[0]?.target : void 0);
		if (selected) {
			deduped.push(selected);
			options.onResolvedTarget?.(selected, {
				agentId: ownerAgentId,
				storePath: sqlitePath
			});
			if (options.onSharedTarget) {
				const sharedStorePaths = new Set(group.filter((entry) => entry.shared).map((entry) => entry.target.storePath));
				if (sharedStorePaths.size > 0) options.onSharedTarget(selected, sharedStorePaths);
			}
		}
		const selectedAgentId = selected ? normalizeAgentId(selected.agentId) : ownerAgentId;
		const ignoredAgentIds = [...byAgentId.keys()].filter((agentId) => agentId !== selectedAgentId);
		if (!selected || ignoredAgentIds.length > 0) {
			const effectiveIgnoredAgentIds = selected ? ignoredAgentIds : [...byAgentId.keys()];
			reportDiagnostic({
				message: `Session store target collision at ${sqlitePath}: owner "${ownerAgentId}" selected by ${ownerSource}; ignored owner(s): ${effectiveIgnoredAgentIds.map((id) => `"${id}"`).join(", ")}.`,
				sqlitePath,
				ownerAgentId,
				ignoredAgentIds: effectiveIgnoredAgentIds,
				ownerSource
			});
		}
	}
	return deduped;
}
//#endregion
//#region src/config/sessions/targets-path-validation.ts
const NON_FATAL_DISCOVERY_ERROR_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"ELOOP",
	"ENOENT",
	"ENOTDIR",
	"EPERM",
	"ESTALE"
]);
function dedupeTargetsByStorePath(targets) {
	return dedupeByKey(targets, (target) => target.storePath);
}
function shouldSkipDiscoveryError(err) {
	const code = isErrno(err) ? err.code : void 0;
	return typeof code === "string" && NON_FATAL_DISCOVERY_ERROR_CODES.has(code);
}
function createRealAgentsRootResolver() {
	const realAgentsRoots = /* @__PURE__ */ new Map();
	return (agentsRoot) => {
		if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) {
				realAgentsRoots.set(agentsRoot, void 0);
				return;
			}
			throw err;
		}
	};
}
function isWithinRoot(realPath, realRoot) {
	return realPath === realRoot || realPath.startsWith(`${realRoot}${path.sep}`);
}
function shouldSkipDiscoveredAgentDirName(dirName, agentId) {
	return !/[a-z0-9]/i.test(dirName) || !isValidAgentId(agentId) || agentId === "main" && dirName.toLowerCase() !== "main";
}
function resolveValidatedManagedFilePathSync(params) {
	try {
		const stat = fs.lstatSync(params.filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return;
		return isWithinRoot(fs.realpathSync.native(params.filePath), params.realAgentsRoot ?? fs.realpathSync.native(params.agentsRoot)) ? params.filePath : void 0;
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) return;
		throw err;
	}
}
function resolveValidatedDiscoveredStorePathSync(params) {
	const storePath = path.join(params.sessionsDir, "sessions.json");
	if (!params.sqliteOnly) {
		const validatedStorePath = resolveValidatedManagedFilePathSync({
			agentsRoot: params.agentsRoot,
			filePath: storePath,
			realAgentsRoot: params.realAgentsRoot
		});
		if (validatedStorePath) return validatedStorePath;
	}
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath).path;
	return resolveValidatedManagedFilePathSync({
		agentsRoot: params.agentsRoot,
		filePath: sqlitePath,
		realAgentsRoot: params.realAgentsRoot
	}) ? storePath : void 0;
}
function isValidatedRecoveryCandidateSessionsDir(params) {
	const agentDir = path.dirname(params.sessionsDir);
	try {
		const agentStat = fs.lstatSync(agentDir);
		if (agentStat.isSymbolicLink() || !agentStat.isDirectory()) return false;
		if (!isWithinRoot(fs.realpathSync.native(agentDir), params.realAgentsRoot)) return false;
		try {
			const sessionsStat = fs.lstatSync(params.sessionsDir);
			return !sessionsStat.isSymbolicLink() && sessionsStat.isDirectory() && isWithinRoot(fs.realpathSync.native(params.sessionsDir), params.realAgentsRoot);
		} catch (err) {
			return hasErrnoCode(err, "ENOENT");
		}
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return params.allowMissingAgentDir === true;
		if (shouldSkipDiscoveryError(err)) return false;
		throw err;
	}
}
function toDiscoveredSessionStoreTarget(sessionsDir, storePath) {
	const dirName = path.basename(path.dirname(sessionsDir));
	const agentId = normalizeAgentId(dirName);
	if (shouldSkipDiscoveredAgentDirName(dirName, agentId)) return;
	return {
		agentId,
		storePath
	};
}
function resolveExplicitSessionStoreTarget(params) {
	const storePath = resolveSessionStorePathCore(params.store, {
		agentId: params.defaultAgentId,
		env: params.env
	});
	return (resolveAgentsDirFromSessionStorePath(storePath) ? toDiscoveredSessionStoreTarget(path.dirname(storePath), storePath) : void 0) ?? {
		agentId: params.defaultAgentId,
		storePath
	};
}
//#endregion
//#region src/config/sessions/targets.ts
function resolveConfiguredSessionStoreTargets(cfg, env, readPaths) {
	return listConfiguredSessionStoreAgentIds(cfg).map((agentId) => ({
		agentId,
		storePath: resolveCapturedSessionStorePath(cfg.session?.store, agentId, env, readPaths)
	}));
}
/** Lists configured owners plus persisted owners whose registered DB still matches this store. */
function listKnownSessionStoreAgentIds(cfg, params = {}) {
	const env = params.env ?? process.env;
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
	const ids = new Set(listConfiguredSessionStoreAgentIds(cfg));
	if (!isPerAgentSessionStoreConfig(cfg.session?.store)) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, {
			agentId: defaultAgentId,
			env
		});
		const durableTarget = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: defaultAgentId,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			isSameDatabasePath
		});
		if (durableTarget.unsuffixedOwnerAgentId) ids.add(normalizeAgentId(durableTarget.unsuffixedOwnerAgentId));
		else if (durableTarget.ownerSource === "database-path" && durableTarget.agentId) ids.add(normalizeAgentId(durableTarget.agentId));
		for (const durableOwner of listDurableSqliteTargetOwnersForSessionStorePath(storePath)) ids.add(normalizeAgentId(durableOwner));
		if (durableTarget.shared && durableTarget.agentId && fs.existsSync(durableTarget.path)) try {
			const logicalOwners = withOpenClawAgentDatabaseReadOnly((database) => Array.from(iterateSessionEntryKeys(database)).flatMap((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				return parsed ? [normalizeAgentId(parsed.agentId)] : [];
			}), {
				agentId: durableTarget.agentId,
				env,
				path: durableTarget.path
			});
			if (logicalOwners.found) for (const logicalOwner of logicalOwners.value) ids.add(logicalOwner);
		} catch {}
	}
	for (const registered of readSessionStoreRegistryRows(params.registeredDatabases, env)) {
		const agentId = normalizeAgentId(registered.agentId);
		const storePath = resolveSessionStorePathCore(cfg.session?.store, {
			agentId,
			env
		});
		const expectedPath = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			isSameDatabasePath
		}).path;
		if (isSameDatabasePath(registered.path, expectedPath)) ids.add(agentId);
	}
	return [...ids];
}
function resolveSessionStoreDiscoveryState(cfg, env, registeredDatabases, readCandidates, readPaths) {
	const configuredTargets = resolveSessionStoreTargets(cfg, { allAgents: true }, {
		env,
		registeredDatabases,
		readCandidates,
		readPaths
	});
	const agentsRoots = /* @__PURE__ */ new Set();
	for (const target of configuredTargets) {
		const agentsDir = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (agentsDir) agentsRoots.add(agentsDir);
	}
	agentsRoots.add(path.join(resolveStateDir(env), "agents"));
	return {
		configuredTargets,
		agentsRoots: [...agentsRoots]
	};
}
/** Resolves all configured and discoverable agent session stores synchronously. */
function resolveAllAgentSessionStoreTargetsSync(cfg, params = {}) {
	return resolveAllAgentSessionStoreTargets(cfg, params, false);
}
/**
* Resolves recovery candidates without requiring either the legacy store or SQLite file.
* Callers must validate the selected artifact before performing filesystem mutations.
*/
function resolveAllAgentSessionStoreCandidateTargetsSync(cfg, params = {}) {
	return resolveAllAgentSessionStoreTargets(cfg, {
		env: params.env,
		registeredDatabases: params.registeredDatabases
	}, true);
}
function resolveAllAgentSessionStoreTargets(cfg, params, recoveryCandidates) {
	const env = params.env ?? process.env;
	const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env, params.registeredDatabases, params.readCandidates, params.readPaths);
	const getRealAgentsRoot = createRealAgentsRootResolver();
	const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (!agentsRoot || recoveryCandidates && !fs.existsSync(agentsRoot)) return [target];
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) return [];
		if (recoveryCandidates) return isValidatedRecoveryCandidateSessionsDir({
			allowMissingAgentDir: true,
			realAgentsRoot,
			sessionsDir: path.dirname(target.storePath)
		}) ? [target] : [];
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(target.storePath),
			agentsRoot,
			realAgentsRoot
		});
		return validatedStorePath ? [{
			...target,
			storePath: validatedStorePath
		}] : [];
	});
	const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
		try {
			const realAgentsRoot = getRealAgentsRoot(agentsDir);
			if (!realAgentsRoot) return [];
			return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
				const validatedStorePath = recoveryCandidates ? isValidatedRecoveryCandidateSessionsDir({
					realAgentsRoot,
					sessionsDir
				}) ? path.join(sessionsDir, "sessions.json") : void 0 : resolveValidatedDiscoveredStorePathSync({
					sessionsDir,
					agentsRoot: agentsDir,
					realAgentsRoot
				});
				const target = validatedStorePath ? toDiscoveredSessionStoreTarget(sessionsDir, validatedStorePath) : void 0;
				return target ? [target] : [];
			});
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return [];
			throw err;
		}
	});
	return dedupeSessionStoreTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets], {
		defaultAgentId: resolveSessionStoreCompatibilityAgentId(cfg),
		env,
		onResolvedTarget: params.onResolvedTarget,
		registeredDatabases: params.registeredDatabases,
		readCandidates: params.readCandidates
	});
}
/** Reuse configured fixed-store ownership only within one synchronous discovery operation. */
function createExistingAgentSessionStoreTargetResolver(cfg, params) {
	let configuredOwners;
	const isConfiguredTarget = (agentId) => {
		configuredOwners ??= new Set(resolveSessionStoreTargets(cfg, { allAgents: true }, params).map((target) => normalizeAgentId(target.agentId)));
		return configuredOwners.has(agentId);
	};
	return (agentId, excludeStorePath) => resolveExistingAgentSessionStoreTargets(cfg, agentId, {
		...params,
		excludeStorePath
	}, isConfiguredTarget);
}
/** Resolves only already-existing stores for one configured, retired, or manual agent. */
function resolveExistingAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	return resolveExistingAgentSessionStoreTargets(cfg, agentId, params);
}
function resolveExistingAgentSessionStoreTargets(cfg, agentId, params, isConfiguredTarget) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storeConfig = cfg.session?.store;
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	if (!isPerAgentSessionStoreConfig(storeConfig)) {
		const fixedTarget = {
			agentId: requested,
			storePath: resolveCapturedSessionStorePath(storeConfig, requested, env, params.readPaths)
		};
		const isSelectedTarget = () => {
			if (isConfiguredTarget && isConfiguredSessionStoreAgentId(cfg, requested)) return isConfiguredTarget(requested);
			const configuredTargets = resolveConfiguredSessionStoreTargets(cfg, env, params.readPaths);
			if (!configuredTargets.some((target) => normalizeAgentId(target.agentId) === requested)) configuredTargets.push(fixedTarget);
			return dedupeSessionStoreTargetsBySqliteTarget(configuredTargets, {
				defaultAgentId,
				env,
				registeredDatabases: params.registeredDatabases,
				readCandidates: params.readCandidates
			}).some((target) => normalizeAgentId(target.agentId) === requested);
		};
		const resolvedTarget = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, {
			agentId: requested,
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates,
			isSameDatabasePath: params.isSameDatabasePath
		});
		if (!resolvedTarget.shared && !isSelectedTarget()) return [];
		if (fixedTarget.storePath === params.excludeStorePath) return [];
		const sqlitePath = resolvedTarget.path;
		if (fs.existsSync(sqlitePath)) try {
			const databasePath = params.readCandidates ? assertSessionStoreReadCandidate(sqlitePath, params.readCandidates) : sqlitePath;
			const databaseAgentId = resolvedTarget.shared ? normalizeAgentId(resolvedTarget.agentId ?? defaultAgentId) : requested;
			const result = withOpenClawAgentDatabaseReadOnly((database) => {
				for (const sessionKey of iterateSessionEntryKeys(database)) {
					const parsed = parseAgentSessionKey(sessionKey);
					if ((parsed ? normalizeAgentId(parsed.agentId) : databaseAgentId) === requested) return true;
				}
				return false;
			}, {
				agentId: databaseAgentId,
				env,
				path: databasePath
			});
			return result.found && result.value ? [fixedTarget] : [];
		} catch {
			return [];
		}
		return [];
	}
	let targets = resolveAgentSessionStoreTargets(cfg, requested, {
		env,
		sqliteOnly: true,
		registeredDatabases: params.registeredDatabases,
		readCandidates: params.readCandidates,
		readPaths: params.readPaths
	});
	if (!isConfiguredSessionStoreAgentId(cfg, requested)) targets = dedupeSessionStoreTargetsBySqliteTarget(targets, {
		defaultAgentId,
		env,
		registeredDatabases: params.registeredDatabases,
		readCandidates: params.readCandidates
	});
	return params.excludeStorePath === void 0 ? targets : targets.filter((target) => target.storePath !== params.excludeStorePath);
}
/** Resolves session store targets for one agent, including retired/manual stores. */
function resolveAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	return resolveAgentSessionStoreTargets(cfg, agentId, params);
}
function resolveAgentSessionStoreTargets(cfg, agentId, params) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storePaths = /* @__PURE__ */ new Set([resolveCapturedSessionStorePath(cfg.session?.store, requested, env, params.readPaths), resolveCapturedSessionStorePath(cfg.session?.store, requested, env, params.readPaths, "default")]);
	const targets = [];
	const getRealAgentsRoot = createRealAgentsRootResolver();
	for (const storePath of storePaths) {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(storePath);
		if (!agentsRoot) {
			if (params.sqliteOnly) {
				const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath, {
					agentId: requested,
					env,
					registeredDatabases: params.registeredDatabases,
					readCandidates: params.readCandidates
				}).path;
				if (!fs.existsSync(sqlitePath)) continue;
			}
			targets.push({
				agentId: requested,
				storePath
			});
			continue;
		}
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) continue;
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(storePath),
			agentsRoot,
			realAgentsRoot,
			sqliteOnly: params.sqliteOnly
		});
		if (validatedStorePath) targets.push({
			agentId: requested,
			storePath: validatedStorePath
		});
	}
	if (isConfiguredSessionStoreAgentId(cfg, requested)) return dedupeTargetsByStorePath(targets);
	const { agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env, params.registeredDatabases, params.readCandidates, params.readPaths);
	for (const agentsDir of agentsRoots) try {
		const realAgentsRoot = getRealAgentsRoot(agentsDir);
		if (!realAgentsRoot) continue;
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir, (dirName) => normalizeAgentId(dirName) === requested)) {
			const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
			if (!target) continue;
			const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
				sessionsDir,
				agentsRoot: agentsDir,
				realAgentsRoot,
				sqliteOnly: params.sqliteOnly
			});
			if (validatedStorePath) targets.push({
				...target,
				storePath: validatedStorePath
			});
		}
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) continue;
		throw err;
	}
	return dedupeTargetsByStorePath(targets);
}
/** Candidate files for version inspection only; this does not assign migration ownership. */
function resolveConfiguredAgentDatabaseCandidatePaths(cfg, params) {
	return [...new Set(listConfiguredSessionStoreAgentIds(cfg).flatMap((agentId) => listSqliteTargetCandidatePathsForSessionStorePath(resolveSessionStorePathCore(cfg.session?.store, {
		agentId,
		env: params.env
	}))))];
}
/** Include configured agent roots and session stores with their exact database owners. */
function resolveConfiguredAgentDatabaseTargets(cfg, params) {
	const targets = resolveSessionStoreTargets(cfg, { allAgents: true }, params).map((target) => {
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId: isPerAgentSessionStoreConfig(cfg.session?.store) ? target.agentId : resolveSessionStoreCompatibilityAgentId(cfg),
			env: params.env,
			registeredDatabases: params.registeredDatabases
		});
		return {
			agentId: resolved.agentId ?? target.agentId,
			path: resolved.path
		};
	});
	const seen = new Set(targets.map((target) => `${target.agentId}\0${target.path}`));
	for (const agentId of listAgentIds(cfg)) {
		const databasePath = path.join(resolveAgentDir(cfg, agentId, params.env), "openclaw-agent.sqlite");
		if (!seen.has(`${agentId}\0${databasePath}`)) targets.push({
			agentId,
			path: databasePath
		});
	}
	return targets;
}
/** Resolves session store targets from explicit CLI-style selection options. */
function resolveSessionStoreTargets(cfg, opts, params = {}) {
	const env = params.env ?? process.env;
	const requestedAgent = opts.agent?.trim();
	if (opts.agent !== void 0 && !requestedAgent) throw new Error("--agent must not be blank");
	if (opts.store !== void 0 && !opts.store.trim()) throw new Error("--store must not be blank");
	const hasAgent = requestedAgent !== void 0;
	const allAgents = opts.allAgents === true;
	if (hasAgent && allAgents) throw new Error("--agent and --all-agents cannot be used together");
	if (opts.store && allAgents) throw new Error("--store cannot be combined with --all-agents");
	if (opts.store) {
		const persistedStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
			config: cfg,
			sessionKey: "main",
			storePath: opts.store,
			env
		});
		if (persistedStoreOwner.kind === "retired") throw new Error(`Session store owner is retired: ${persistedStoreOwner.agentId}`);
		const requestedAgentId = requestedAgent ? normalizeAgentId(requestedAgent) : void 0;
		if (requestedAgentId && persistedStoreOwner.kind === "configured" && persistedStoreOwner.agentId !== requestedAgentId) throw new Error(`Session store belongs to agent "${persistedStoreOwner.agentId}", not requested agent "${requestedAgentId}".`);
		const defaultAgentId = requestedAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg);
		if (hasAgent) resolveConfiguredAgentId(cfg, defaultAgentId);
		const target = resolveExplicitSessionStoreTarget({
			defaultAgentId,
			env,
			store: opts.store
		});
		if ((hasAgent || persistedStoreOwner.kind === "configured") && target.agentId !== defaultAgentId) throw new Error(`Session store belongs to agent "${target.agentId}", not requested agent "${defaultAgentId}".`);
		return [target];
	}
	if (allAgents) {
		const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
		return dedupeSessionStoreTargetsBySqliteTarget(resolveConfiguredSessionStoreTargets(cfg, env, params.readPaths), {
			defaultAgentId,
			env,
			registeredDatabases: params.registeredDatabases,
			readCandidates: params.readCandidates,
			...params.diagnostics ? { onDiagnostic: (diagnostic) => params.diagnostics?.push(diagnostic.message) } : {}
		});
	}
	if (hasAgent) {
		const requested = normalizeAgentId(requestedAgent);
		resolveConfiguredAgentId(cfg, requested);
		return [{
			agentId: requested,
			storePath: resolveSessionStorePathCore(cfg.session?.store, {
				agentId: requested,
				env
			})
		}];
	}
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(cfg);
	if (persistedStoreOwner.kind === "retired") throw new Error(`Session store owner is retired: ${persistedStoreOwner.agentId}`);
	const defaultAgentId = (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg);
	return [{
		agentId: defaultAgentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId: defaultAgentId,
			env
		})
	}];
}
//#endregion
export { resolveAllAgentSessionStoreTargetsSync as a, resolveConfiguredSessionStoreTargets as c, shouldSkipDiscoveryError as d, toDiscoveredSessionStoreTarget as f, resolveAllAgentSessionStoreCandidateTargetsSync as i, resolveExistingAgentSessionStoreTargetsSync as l, listKnownSessionStoreAgentIds as n, resolveConfiguredAgentDatabaseCandidatePaths as o, dedupeSessionStoreTargetsBySqliteTarget as p, resolveAgentSessionStoreTargetsSync as r, resolveConfiguredAgentDatabaseTargets as s, createExistingAgentSessionStoreTargetResolver as t, resolveSessionStoreTargets as u };
