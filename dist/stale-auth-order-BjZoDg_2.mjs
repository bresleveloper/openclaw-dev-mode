import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { u as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { i as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { h as resolveAuthProfileDatabasePath, m as resolveAuthProfileDatabaseOwnerId } from "./sqlite-BIg_k8qE.mjs";
import { c as mergeAuthProfileStores } from "./persisted-B486xwB_.mjs";
import { a as resolveAuthProfileOrder, i as resolveAuthProfileEligibility } from "./order-BQhYF772.mjs";
import { t as listRuntimeExternalAuthProfiles } from "./external-auth-runtime-C-hR-a2W.mjs";
import { n as inspectUnmigratedAuthStoreSources, r as loadCompletePersistedStore, t as inspectAuthDatabaseFiles } from "./stale-auth-order-store-B7V_xrMd.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/stale-auth-order.ts
const AUTH_PROFILE_MODES = /* @__PURE__ */ new Set([
	"api_key",
	"aws-sdk",
	"oauth",
	"token"
]);
const INVALID_SQLITE_STORE_WARNING = "- Skipped auth.order repair because a SQLite auth profile store is unreadable, unavailable, or contains invalid credentials; repair or re-import that agent's auth store, then rerun doctor.";
function isProfileIdList(value) {
	return Array.isArray(value) && value.every((profileId) => typeof profileId === "string");
}
function readValidConfiguredAuthOrder(cfg) {
	const order = cfg.auth?.order;
	if (!isRecord(order)) return;
	const result = {};
	for (const [provider, profileIds] of Object.entries(order)) {
		if (!isProfileIdList(profileIds)) return;
		result[provider] = profileIds;
	}
	return result;
}
function hasValidConfiguredAuthProfiles(cfg) {
	const profiles = cfg.auth?.profiles;
	if (profiles === void 0) return true;
	return isRecord(profiles) && Object.values(profiles).every((profile) => isRecord(profile) && typeof profile.provider === "string" && typeof profile.mode === "string" && AUTH_PROFILE_MODES.has(profile.mode));
}
function hasNonemptyConfiguredAuthOrder(cfg) {
	const order = readValidConfiguredAuthOrder(cfg);
	return Boolean(order && Object.values(order).some((profileIds) => profileIds.length > 0));
}
function listRetainedStateAgentDirs(env) {
	const agentsRoot = path.join(resolveStateDir(env), "agents");
	let entries;
	try {
		entries = fs.readdirSync(agentsRoot, { withFileTypes: true });
	} catch (error) {
		const code = error.code;
		return code === "ENOENT" || code === "ENOTDIR" ? [] : null;
	}
	const agentDirs = [];
	for (const entry of entries) {
		if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
		const agentDir = path.join(agentsRoot, entry.name, "agent");
		try {
			if (fs.statSync(agentDir).isDirectory()) agentDirs.push(path.resolve(agentDir));
			else return null;
		} catch (error) {
			const code = error.code;
			if (entry.isSymbolicLink() || code !== "ENOENT" && code !== "ENOTDIR") return null;
			try {
				fs.lstatSync(agentDir);
				return null;
			} catch (lstatError) {
				const lstatCode = lstatError.code;
				if (lstatCode !== "ENOENT" && lstatCode !== "ENOTDIR") return null;
			}
		}
	}
	return agentDirs;
}
function loadConfiguredAgentAuthStores(cfg, env) {
	const order = readValidConfiguredAuthOrder(cfg);
	if (!order || !hasValidConfiguredAuthProfiles(cfg)) return;
	const mainAgentDir = resolveSharedMainAuthAgentDir(env);
	const sharedDatabasePath = path.resolve(resolveSharedAuthStorePath(env));
	const sharedOwnership = resolveSharedAuthStoreOwnership(env);
	const activeAgentDirs = /* @__PURE__ */ new Set();
	const expectedAgentIdsByDir = /* @__PURE__ */ new Map();
	const addExpectedAgentDir = (agentDir, agentId) => {
		const owners = expectedAgentIdsByDir.get(agentDir) ?? /* @__PURE__ */ new Set();
		owners.add(normalizeAgentId(agentId));
		expectedAgentIdsByDir.set(agentDir, owners);
	};
	if (sharedOwnership.location === "legacy-main") addExpectedAgentDir(mainAgentDir, resolveAuthProfileDatabaseOwnerId(mainAgentDir));
	for (const agentId of listAgentIds(cfg)) {
		const agentDir = path.resolve(resolveAgentDir(cfg, agentId, env));
		activeAgentDirs.add(agentDir);
		addExpectedAgentDir(agentDir, agentId);
	}
	const envAgentDir = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim() || void 0;
	if (envAgentDir) {
		const agentDir = path.resolve(resolveUserPath(envAgentDir, env));
		activeAgentDirs.add(agentDir);
		addExpectedAgentDir(agentDir, resolveAuthProfileDatabaseOwnerId(agentDir));
	}
	const retainedAgentDirs = listRetainedStateAgentDirs(env);
	if (!retainedAgentDirs) return {
		status: "blocked",
		warnings: [INVALID_SQLITE_STORE_WARNING]
	};
	const agentDirs = /* @__PURE__ */ new Set([
		mainAgentDir,
		...activeAgentDirs,
		...retainedAgentDirs
	]);
	const entries = [];
	const sharedLegacyAvailability = inspectUnmigratedAuthStoreSources(mainAgentDir);
	if (sharedLegacyAvailability === "unreadable") return {
		status: "blocked",
		warnings: [INVALID_SQLITE_STORE_WARNING]
	};
	if (sharedLegacyAvailability === "present") return;
	const sharedLoaded = loadCompletePersistedStore(void 0, env);
	if (sharedLoaded.status === "invalid") return {
		status: "blocked",
		warnings: [INVALID_SQLITE_STORE_WARNING]
	};
	if (sharedOwnership.location === "legacy-main") {
		const availability = inspectAuthDatabaseFiles(mainAgentDir);
		const expectedAgentIds = expectedAgentIdsByDir.get(mainAgentDir);
		const owner = availability === "present" ? inspectOpenClawAgentDatabaseOwner(sharedDatabasePath) : void 0;
		if (availability === "unreadable" || owner?.status === "unreadable" || expectedAgentIds && owner?.status === "owned" && !expectedAgentIds.has(owner.agentId) || owner?.status === "unowned" && sharedLoaded.hasAuthTables) return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
	}
	entries.push({
		databasePath: sharedDatabasePath,
		store: sharedLoaded.store,
		isShared: true
	});
	for (const agentDir of agentDirs) {
		const expectedAgentIds = expectedAgentIdsByDir.get(agentDir);
		if (expectedAgentIds && expectedAgentIds.size !== 1) return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		const legacyAvailability = inspectUnmigratedAuthStoreSources(agentDir);
		if (legacyAvailability === "unreadable") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		if (legacyAvailability === "present") return;
		const databasePath = path.resolve(resolveAuthProfileDatabasePath(agentDir));
		if (databasePath === sharedDatabasePath) continue;
		const availability = inspectAuthDatabaseFiles(agentDir);
		if (availability === "unreadable") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		const owner = availability === "present" ? inspectOpenClawAgentDatabaseOwner(databasePath) : void 0;
		if (owner) {
			if (owner.status === "unreadable" || expectedAgentIds && owner.status === "owned" && !expectedAgentIds.has(owner.agentId)) return {
				status: "blocked",
				warnings: [INVALID_SQLITE_STORE_WARNING]
			};
		}
		const loaded = loadCompletePersistedStore(agentDir);
		if (loaded.status === "invalid") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		if (owner?.status === "unowned" && loaded.hasAuthTables) return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		entries.push({
			agentDir,
			databasePath,
			store: loaded.store,
			isShared: false
		});
	}
	let registeredDatabases;
	try {
		const registryEntries = listOpenClawRegisteredAgentDatabases({ env });
		if (registryEntries.some((entry) => !entry.path.trim() || !path.isAbsolute(entry.path))) return;
		const authDatabaseBasename = path.basename(resolveAuthProfileDatabasePath(mainAgentDir));
		registeredDatabases = registryEntries.flatMap((entry) => path.basename(entry.path) === authDatabaseBasename ? [{
			agentId: entry.agentId,
			path: path.resolve(entry.path)
		}] : []);
	} catch {
		return;
	}
	const entriesByDatabasePath = new Map(entries.map((entry) => [entry.databasePath, entry]));
	const registeredEntries = [];
	const registeredOwnersByPath = /* @__PURE__ */ new Map();
	for (const entry of registeredDatabases) {
		const owners = registeredOwnersByPath.get(entry.path) ?? /* @__PURE__ */ new Set();
		owners.add(entry.agentId);
		registeredOwnersByPath.set(entry.path, owners);
	}
	for (const [databasePath, owners] of registeredOwnersByPath) {
		const agentDir = path.dirname(databasePath);
		if (path.resolve(resolveAuthProfileDatabasePath(agentDir)) !== databasePath) continue;
		const legacyAvailability = inspectUnmigratedAuthStoreSources(agentDir);
		if (legacyAvailability === "unreadable") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		if (legacyAvailability === "present") return;
		const availability = inspectAuthDatabaseFiles(agentDir);
		if (availability === "missing") continue;
		if (availability === "unreadable") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		const owner = inspectOpenClawAgentDatabaseOwner(databasePath);
		if (owner.status !== "owned" || !owners.has(owner.agentId)) return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		const loaded = loadCompletePersistedStore(agentDir);
		if (loaded.status === "invalid") return {
			status: "blocked",
			warnings: [INVALID_SQLITE_STORE_WARNING]
		};
		const knownEntry = entriesByDatabasePath.get(databasePath);
		if (knownEntry) {
			knownEntry.store = loaded.store;
			continue;
		}
		registeredEntries.push({
			agentDir,
			store: loaded.store
		});
	}
	const emptyStore = {
		version: 1,
		profiles: {}
	};
	const mainStore = entries.find((entry) => entry.isShared)?.store ?? emptyStore;
	const agentStores = entries.map((entry) => {
		const localStore = entry.store ?? emptyStore;
		return entry.isShared ? mainStore : mergeAuthProfileStores(mainStore, localStore, { preserveBaseRuntimeExternalProfiles: true });
	});
	const activeStores = entries.flatMap((entry, index) => entry.isShared && activeAgentDirs.has(mainAgentDir) || entry.agentDir !== void 0 && activeAgentDirs.has(entry.agentDir) ? [agentStores[index] ?? emptyStore] : []);
	const stores = [...agentStores, ...registeredEntries.flatMap((entry) => entry.store ? [entry.store] : [])];
	const providerIds = Object.keys(order);
	const profileIds = Object.values(order).flat();
	const runtimeProfileIds = /* @__PURE__ */ new Set();
	const runtimeEntries = [...entries.map((entry, index) => ({
		agentDir: entry.agentDir,
		store: agentStores[index] ?? emptyStore
	})), ...registeredEntries.map((entry) => ({
		agentDir: entry.agentDir,
		store: mergeAuthProfileStores(mainStore, entry.store ?? emptyStore, { preserveBaseRuntimeExternalProfiles: true })
	}))];
	try {
		for (const entry of runtimeEntries) {
			const externalProfiles = listRuntimeExternalAuthProfiles({
				store: entry.store,
				agentDir: entry.agentDir,
				env,
				externalCli: {
					allowKeychainPrompt: false,
					config: cfg,
					externalCliProviderIds: providerIds,
					externalCliProfileIds: profileIds
				}
			});
			for (const profile of externalProfiles) runtimeProfileIds.add(profile.profileId);
		}
	} catch {
		return;
	}
	return {
		status: "ready",
		stores,
		activeStores,
		runtimeProfileIds
	};
}
function removeAuthOrderKeys(cfg, providers) {
	const order = Object.fromEntries(Object.entries(readValidConfiguredAuthOrder(cfg) ?? {}).filter(([provider]) => !providers.has(provider)));
	return {
		...cfg,
		auth: {
			...cfg.auth,
			order
		}
	};
}
function scanUndeclaredConfiguredAuthOrders(cfg, loaded) {
	const order = readValidConfiguredAuthOrder(cfg);
	if (!order || !hasValidConfiguredAuthProfiles(cfg) || !cfg.auth?.profiles) return [];
	const configuredProfileIds = new Set(Object.keys(cfg.auth.profiles));
	return Object.entries(order).flatMap(([provider, profileIds]) => {
		const undeclaredProfileIds = profileIds.filter((profileId) => {
			if (configuredProfileIds.has(profileId) || loaded?.runtimeProfileIds.has(profileId)) return false;
			return !loaded?.stores.some((store) => resolveAuthProfileEligibility({
				cfg,
				store,
				provider,
				profileId
			}).eligible);
		});
		if (undeclaredProfileIds.length === 0) return [];
		const canonicalProvider = resolveProviderIdForAuth(provider, { config: cfg });
		return [{
			provider,
			undeclaredProfileIds,
			declaredProviderProfileIds: Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => resolveProviderIdForAuth(profile.provider, {
				config: cfg,
				storedCredential: true
			}) === canonicalProvider).map(([profileId]) => profileId)
		}];
	});
}
function repairUndeclaredConfiguredAuthOrders(cfg, loaded) {
	const hits = scanUndeclaredConfiguredAuthOrders(cfg, loaded);
	const order = readValidConfiguredAuthOrder(cfg) ?? {};
	const changes = [];
	const warnings = [];
	for (const hit of hits) {
		if (hit.declaredProviderProfileIds.length !== 1) {
			const candidates = hit.declaredProviderProfileIds.join(", ") || "none";
			warnings.push(`- auth.order.${hit.provider} references undeclared ${hit.undeclaredProfileIds.join(", ")}; declared profiles for this provider are ambiguous (${candidates}). Set auth.order.${hit.provider} explicitly.`);
			continue;
		}
		const replacement = hit.declaredProviderProfileIds[0];
		if (!replacement) continue;
		const undeclared = new Set(hit.undeclaredProfileIds);
		order[hit.provider] = [...new Set((order[hit.provider] ?? []).map((profileId) => undeclared.has(profileId) ? replacement : profileId))];
		changes.push(`auth.order.${hit.provider}: replaced undeclared ${hit.undeclaredProfileIds.join(", ")} with ${replacement}.`);
	}
	return {
		config: changes.length === 0 ? cfg : {
			...cfg,
			auth: {
				...cfg.auth,
				order
			}
		},
		changes,
		warnings
	};
}
/** Find nonempty config orders that only reference removed profiles. */
function scanStaleConfiguredAuthOrders(params) {
	const order = readValidConfiguredAuthOrder(params.cfg);
	if (!order || !hasValidConfiguredAuthProfiles(params.cfg)) return [];
	const configuredProfileIds = new Set(Object.keys(params.cfg.auth?.profiles ?? {}));
	const storedProfileIds = new Set(params.stores.flatMap((store) => Object.keys(store.profiles)));
	const staleByCanonicalProvider = /* @__PURE__ */ new Map();
	for (const [provider, profileIds] of Object.entries(order)) {
		if (profileIds.length === 0 || profileIds.some((profileId) => configuredProfileIds.has(profileId) || storedProfileIds.has(profileId) || params.runtimeProfileIds?.has(profileId))) continue;
		const canonicalProvider = resolveProviderIdForAuth(provider, { config: params.cfg });
		const entries = staleByCanonicalProvider.get(canonicalProvider) ?? [];
		entries.push({
			provider,
			staleProfileCount: profileIds.length
		});
		staleByCanonicalProvider.set(canonicalProvider, entries);
	}
	const hits = [];
	for (const [canonicalProvider, staleEntries] of staleByCanonicalProvider) {
		const staleProviders = new Set(staleEntries.map((entry) => entry.provider));
		const cfgWithoutStaleOrder = removeAuthOrderKeys(params.cfg, staleProviders);
		const fallbackStores = params.activeStores ?? params.stores;
		if (fallbackStores.length > 0 && fallbackStores.every((store) => {
			const selectionStore = structuredClone(store);
			return resolveAuthProfileOrder({
				cfg: cfgWithoutStaleOrder,
				store: selectionStore,
				provider: canonicalProvider
			}).length > 0;
		})) hits.push(...staleEntries);
	}
	return hits;
}
/** Remove provably stale config orders and restore per-agent automatic selection. */
function repairStaleConfiguredAuthOrders(params) {
	const hits = scanStaleConfiguredAuthOrders(params);
	if (hits.length === 0) return {
		config: params.cfg,
		changes: []
	};
	return {
		config: removeAuthOrderKeys(params.cfg, new Set(hits.map((hit) => hit.provider))),
		changes: hits.map((hit) => `auth.order.${hit.provider}: removed ${hit.staleProfileCount} missing profile reference${hit.staleProfileCount === 1 ? "" : "s"} to restore automatic per-agent auth selection.`)
	};
}
/** Load configured agent stores and repair their stale config auth orders. */
function maybeRepairStaleConfiguredAuthOrders(params) {
	if (!hasNonemptyConfiguredAuthOrder(params.cfg)) return {
		config: params.cfg,
		changes: []
	};
	const initialLoaded = loadConfiguredAgentAuthStores(params.cfg, params.env ?? process.env);
	if (!initialLoaded) return {
		config: params.cfg,
		changes: []
	};
	if (initialLoaded.status === "blocked") return {
		config: params.cfg,
		changes: [],
		warnings: initialLoaded.warnings
	};
	const declaredRepair = repairUndeclaredConfiguredAuthOrders(params.cfg, initialLoaded);
	const cfg = declaredRepair.config;
	const staleRepair = repairStaleConfiguredAuthOrders({
		cfg,
		...initialLoaded
	});
	const remainingDeclaredWarnings = repairUndeclaredConfiguredAuthOrders(staleRepair.config, initialLoaded).warnings;
	return {
		config: staleRepair.config,
		changes: [...declaredRepair.changes, ...staleRepair.changes],
		...remainingDeclaredWarnings.length > 0 ? { warnings: remainingDeclaredWarnings } : {}
	};
}
/** Build preview warnings for stale config auth orders. */
function collectStaleConfiguredAuthOrderWarnings(params) {
	if (!hasNonemptyConfiguredAuthOrder(params.cfg)) return [];
	const loaded = loadConfiguredAgentAuthStores(params.cfg, params.env ?? process.env);
	if (!loaded) return [];
	if (loaded.status === "blocked") return loaded.warnings;
	return [...scanUndeclaredConfiguredAuthOrders(params.cfg, loaded).map((hit) => {
		if (hit.declaredProviderProfileIds.length === 1) return `- auth.order.${hit.provider} references undeclared ${hit.undeclaredProfileIds.join(", ")}; run ${params.doctorFixCommand} to replace it with ${hit.declaredProviderProfileIds[0]}.`;
		const candidates = hit.declaredProviderProfileIds.join(", ") || "none";
		return `- auth.order.${hit.provider} references undeclared ${hit.undeclaredProfileIds.join(", ")}; declared profiles for this provider are ambiguous (${candidates}). Set auth.order.${hit.provider} explicitly.`;
	}), ...scanStaleConfiguredAuthOrders({
		cfg: params.cfg,
		...loaded
	}).map((hit) => `- auth.order.${hit.provider} references only missing profiles while compatible stored credentials exist; run ${params.doctorFixCommand} to remove the stale override and restore automatic selection.`)];
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.staleAuthOrderTestApi")] = { repairStaleConfiguredAuthOrders };
//#endregion
export { maybeRepairStaleConfiguredAuthOrders as n, collectStaleConfiguredAuthOrderWarnings as t };
