import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as tryResolveDefaultAgentId, E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as isSameSessionStoreConfig, t as isPerAgentSessionStoreConfig } from "./session-store-config-caBszKSJ.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { t as coerceConfig } from "./io.read-helpers-N26RjV2V.mjs";
import { i as materializeLegacyAgentOwnershipForActiveChannelsResult } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { i as unsetConfigValueAtPath, r as setConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-BKljx7kX.mjs";
import { o as restoreEnvVarRefsFromResolved } from "./io.types-zuIBxyy5.mjs";
import { n as prepareConfigWriteValues } from "./io.write-prepare-xbITFBQs.mjs";
import { n as pinLegacyInheritedAuthOwnerForRosterTransition, t as assertSafeLegacyInheritedAuthDirTransition } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { t as pinSurvivorWorkspaceForRosterCollapse } from "./agent-workspace-roster-transition-BwpAREwf.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/io.auth-inheritance-owner.ts
const AUTH_INHERITANCE_PATH = "agents.defaults.authInheritance";
function explicitlySetsAuthInheritance(explicitSetPaths) {
	return Boolean(explicitSetPaths?.some((writePath) => {
		const path = writePath.join(".");
		return path === AUTH_INHERITANCE_PATH || path.startsWith(`${AUTH_INHERITANCE_PATH}.`);
	}));
}
function prepareAuthInheritanceOwnerForWrite(params) {
	if (!params.writesOwnershipTopology || explicitlySetsAuthInheritance(params.explicitSetPaths)) return {
		config: params.targetConfig,
		insertedPaths: []
	};
	assertSafeLegacyInheritedAuthDirTransition(params.currentConfig, params.targetConfig, params.env);
	const config = pinLegacyInheritedAuthOwnerForRosterTransition(params.currentConfig, params.targetConfig);
	return {
		config,
		insertedPaths: config === params.targetConfig ? [] : [[
			"agents",
			"defaults",
			"authInheritance",
			"agentId"
		]]
	};
}
//#endregion
//#region src/config/io.ownership-write-guard.ts
function assertAutomaticBindingsWriteAllowed(params) {
	if (params.bindingsIncludeOwned && params.ownershipPaths.some((ownershipPath) => ownershipPath[0] === "bindings")) throw Object.assign(/* @__PURE__ */ new Error("Automatic agent ownership materialization cannot append to $include-owned bindings. Add the required channel-wide binding to the include, then retry."), { code: "CONFIG_WRITE_REJECTED" });
}
//#endregion
//#region src/config/io.session-store-owner.ts
const SESSION_STORE_OWNER_PATH = [
	"agents",
	"defaults",
	"sessionStore",
	"agentId"
];
const SESSION_STORE_CONFIG_PATH = SESSION_STORE_OWNER_PATH.slice(0, -1);
function prepareSessionStoreOwnershipForWrite(params) {
	const sameSessionStore = isSameSessionStoreConfig(params.currentStore, params.targetConfig.session?.store, params.env);
	const sameFixedSessionStore = sameSessionStore && !isPerAgentSessionStoreConfig(params.currentStore);
	const previousOwner = params.currentConfig.agents?.defaults?.sessionStore?.agentId;
	const explicitSessionStore = getConfigValueAtPath(params.explicitSetValueSource ?? params.targetConfig, SESSION_STORE_CONFIG_PATH);
	const suppliesDestinationOwner = Boolean(isRecord(explicitSessionStore) && typeof explicitSessionStore.agentId === "string" && params.explicitSetPaths?.some((entry) => isDeepStrictEqual(entry, SESSION_STORE_CONFIG_PATH) || isDeepStrictEqual(entry, SESSION_STORE_OWNER_PATH)));
	if (sameSessionStore || !previousOwner || suppliesDestinationOwner) return {
		config: params.targetConfig,
		sameFixedSessionStore,
		ownershipPaths: []
	};
	const agents = structuredClone(params.targetConfig.agents ?? {});
	unsetConfigValueAtPath(agents, SESSION_STORE_OWNER_PATH.slice(1));
	return {
		config: {
			...params.targetConfig,
			agents
		},
		sameFixedSessionStore,
		ownershipPaths: [[...SESSION_STORE_OWNER_PATH]]
	};
}
//#endregion
//#region src/config/io.write-topology.ts
function cloneConfigPathParents(source, target, path) {
	let sourceCursor = source;
	let targetCursor = target;
	for (const key of path.slice(0, -1)) {
		const sourceChild = isRecord(sourceCursor) ? sourceCursor[key] : void 0;
		const targetChild = targetCursor[key];
		if (targetChild === sourceChild) {
			const clone = isRecord(sourceChild) ? { ...sourceChild } : {};
			targetCursor[key] = clone;
			targetCursor = clone;
		} else if (isRecord(targetChild)) targetCursor = targetChild;
		else {
			const clone = {};
			targetCursor[key] = clone;
			targetCursor = clone;
		}
		sourceCursor = sourceChild;
	}
}
function prepareConfigWriteTopology(params) {
	const { snapshot, options, unsetPaths, env, homedir, pluginMetadataSnapshot } = params;
	const values = prepareConfigWriteValues({
		snapshot,
		nextConfig: params.nextConfig,
		writeOptions: options,
		env,
		lowerPrecedenceEnv: params.lowerPrecedenceEnv,
		explicitSetPaths: options.explicitSetPaths,
		explicitSetValueSource: options.explicitSetValueSource
	});
	let nextConfig = values.resolvedConfig;
	const sourceRosterMigration = migratePersistedImplicitMainRoster(snapshot.sourceConfigBeforeMigrations ?? snapshot.parsed, {
		env,
		homedir
	});
	const retainedLegacyDefaultAgentId = sourceRosterMigration.retainedLegacyDefaultAgentId;
	const previousEntries = listAgentEntries(snapshot.config);
	const nextEntries = listAgentEntries(nextConfig);
	const nextAgentIds = new Set(nextEntries.map((entry) => normalizeAgentId(entry.id)));
	const previousSoleAgentId = tryResolveDefaultAgentId(snapshot.config);
	const entersMultiAgent = previousEntries.length <= 1 && nextEntries.length > 1;
	const previousSoleRemains = Boolean(previousSoleAgentId && nextAgentIds.has(normalizeAgentId(previousSoleAgentId)));
	const writesOwnershipTopology = options.persistCanonicalAgentRoster === true || !isDeepStrictEqual(previousEntries, nextEntries) || [...options.explicitSetPaths ?? [], ...unsetPaths].some((writePath) => writePath[0] === "agents" && (writePath.length === 1 || writePath[1] === "entries" || writePath[1] === "list" || writePath[1] === "ownership"));
	const persistOwnership = entersMultiAgent || retainedLegacyDefaultAgentId !== void 0 && writesOwnershipTopology;
	const keepOwnership = nextEntries.length > 1 && snapshot.config.agents?.ownership === "explicit";
	const stampOwnership = (persistOwnership || keepOwnership) && nextConfig.agents?.ownership === void 0;
	if (stampOwnership) {
		if (nextEntries.some((entry) => entry.default === true)) nextConfig = coerceConfig(migratePersistedImplicitMainRoster(nextConfig, {
			materializeRoles: false,
			env,
			homedir
		}).config);
		nextConfig = {
			...nextConfig,
			agents: {
				...nextConfig.agents,
				ownership: "explicit"
			}
		};
	}
	const workspaceCollapse = pinSurvivorWorkspaceForRosterCollapse(snapshot.config, nextConfig, env);
	nextConfig = workspaceCollapse.config;
	const authInheritanceOwnership = prepareAuthInheritanceOwnerForWrite({
		currentConfig: snapshot.config,
		targetConfig: nextConfig,
		writesOwnershipTopology,
		explicitSetPaths: options.explicitSetPaths,
		env
	});
	nextConfig = authInheritanceOwnership.config;
	const sessionStoreOwnership = prepareSessionStoreOwnershipForWrite({
		currentConfig: snapshot.config,
		currentStore: (snapshot.sourceConfigBeforeMigrations ?? snapshot.config).session?.store,
		targetConfig: nextConfig,
		env,
		explicitSetPaths: options.explicitSetPaths,
		explicitSetValueSource: options.explicitSetValueSource
	});
	nextConfig = sessionStoreOwnership.config;
	const { sameFixedSessionStore } = sessionStoreOwnership;
	const retainedFleetOwner = retainedLegacyDefaultAgentId && writesOwnershipTopology && nextAgentIds.has(normalizeAgentId(retainedLegacyDefaultAgentId)) ? retainedLegacyDefaultAgentId : void 0;
	const ownerAgentId = (entersMultiAgent && previousSoleRemains ? previousSoleAgentId : void 0) ?? retainedFleetOwner;
	const ownershipMaterialization = ownerAgentId ? materializeLegacyAgentOwnershipForActiveChannelsResult(nextConfig, ownerAgentId, env, pluginMetadataSnapshot?.manifestRegistry.plugins, {
		materializeSessionStore: sameFixedSessionStore,
		materializeWorkspace: true,
		homedir
	}) : {
		config: nextConfig,
		insertedPaths: []
	};
	nextConfig = ownershipMaterialization.config;
	const insertedPaths = [
		...persistOwnership || keepOwnership ? (sourceRosterMigration.insertedPaths ?? []).filter((entry) => sameFixedSessionStore || entry.join(".") !== "agents.defaults.sessionStore.agentId") : [],
		...(persistOwnership || keepOwnership) && retainedLegacyDefaultAgentId && Array.isArray(snapshot.config.bindings) && !isDeepStrictEqual(snapshot.sourceConfigBeforeMigrations?.bindings, snapshot.config.bindings) ? [["bindings"]] : [],
		...ownershipMaterialization.insertedPaths.concat(workspaceCollapse.insertedPaths),
		...authInheritanceOwnership.insertedPaths,
		...sessionStoreOwnership.ownershipPaths,
		...stampOwnership ? [["agents", "ownership"]] : []
	];
	const nextSessionStoreConfig = nextConfig.agents?.defaults?.sessionStore;
	if (!ownerAgentId && writesOwnershipTopology && previousEntries.length === 1 && previousSoleAgentId && !previousSoleRemains && sameFixedSessionStore && (nextSessionStoreConfig === void 0 || isRecord(nextSessionStoreConfig) && !Object.hasOwn(nextSessionStoreConfig, "agentId"))) {
		nextConfig = {
			...nextConfig,
			agents: {
				...nextConfig.agents,
				defaults: {
					...nextConfig.agents?.defaults,
					sessionStore: {
						...isRecord(nextSessionStoreConfig) ? nextSessionStoreConfig : {},
						agentId: normalizeAgentId(previousSoleAgentId)
					}
				}
			}
		};
		insertedPaths.push([
			"agents",
			"defaults",
			"sessionStore",
			"agentId"
		]);
	}
	const topologyPaths = [...new Map(insertedPaths.map((entry) => [entry.join("\0"), entry])).values()];
	assertAutomaticBindingsWriteAllowed({
		bindingsIncludeOwned: snapshot.bindingsIncludeOwned === true,
		ownershipPaths: topologyPaths
	});
	const explicitSetPaths = [...options.explicitSetPaths ?? [], ...topologyPaths];
	const explicitSource = values.explicitSetValueSource;
	const explicitSetValueSource = { ...explicitSource };
	for (const ownershipPath of topologyPaths) {
		cloneConfigPathParents(explicitSource, explicitSetValueSource, ownershipPath);
		setConfigValueAtPath(explicitSetValueSource, ownershipPath, getConfigValueAtPath(nextConfig, ownershipPath));
	}
	return {
		nextConfig,
		clearedSessionStoreOwner: sessionStoreOwnership.ownershipPaths.length > 0,
		resolutionEnv: values.resolutionEnv,
		authoredConfig: nextConfig === values.resolvedConfig ? values.authoredConfig : coerceConfig(restoreEnvVarRefsFromResolved(nextConfig, values.authoredConfig, values.resolvedConfig)),
		authoredSourceConfig: values.authoredSourceConfig,
		authoredRuntimeConfig: values.authoredRuntimeConfig,
		explicitSetPaths,
		explicitSetValueSource,
		persistCanonicalAgentRoster: options.persistCanonicalAgentRoster === true || persistOwnership || stampOwnership,
		preserveLegacyAgentRoster: Boolean(retainedLegacyDefaultAgentId) && !writesOwnershipTopology,
		cronOwner: persistOwnership ? retainedFleetOwner ? { provenOwnerAgentId: retainedFleetOwner } : {} : void 0
	};
}
//#endregion
export { prepareConfigWriteTopology as t };
