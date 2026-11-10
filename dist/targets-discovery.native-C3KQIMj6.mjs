import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds, S as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { s as resolveCapturedSessionStorePath, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as readSessionStoreRegistryRows, n as listDurableSqliteTargetOwnersForSessionStorePath, o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { c as resolveConfiguredSessionStoreTargets, f as dedupeSessionStoreTargetsBySqliteTarget, l as resolveSessionStoreTargets, n as resolveAgentSessionStoreTargets } from "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import fs from "node:fs";
//#region src/config/sessions/targets-discovery.native.ts
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
//#endregion
export { listKnownSessionStoreAgentIds as n, resolveExistingAgentSessionStoreTargetsSync as r, createExistingAgentSessionStoreTargetResolver as t };
