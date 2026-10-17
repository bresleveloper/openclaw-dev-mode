import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { t as coerceConfig } from "./io.read-helpers-Bvdjf9tk.mjs";
import { i as unsetConfigValueAtPath, r as setConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { i as isSameSessionStoreConfig, t as isPerAgentSessionStoreConfig } from "./session-store-config-dGf2LeNv.mjs";
import { g as retireLegacyAgentDefaultMarkers, h as LEGACY_AGENT_ROSTER_RULES, n as findLegacyConfigRuleIssues } from "./legacy-Ccc1pb1u.mjs";
import { r as resolveLegacyAgentRosterOwner } from "./legacy.roster-D0lEOcPT.mjs";
import { t as materializeLegacyAgentOwnershipForActiveChannelsResult } from "./validation-BeAnc62d.mjs";
import { o as restoreEnvVarRefsFromResolved } from "./io.types-E3Nszhk8.mjs";
import { n as prepareConfigWriteValues } from "./io.write-prepare-DWaupA4w.mjs";
import { n as pinLegacyInheritedAuthOwnerForRosterTransition, t as assertSafeLegacyInheritedAuthDirTransition } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { t as pinSurvivorWorkspaceForRosterCollapse } from "./agent-workspace-roster-transition-CXg0pM1K.mjs";
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
	const retiredMarkers = findLegacyConfigRuleIssues(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig, LEGACY_AGENT_ROSTER_RULES).length === 0 ? retireLegacyAgentDefaultMarkers(values.resolvedConfig) : void 0;
	let nextConfig = retiredMarkers?.config ?? values.resolvedConfig;
	const retainedLegacyDefaultAgentId = resolveLegacyAgentRosterOwner(snapshot.sourceConfigBeforeMigrations ?? snapshot.parsed);
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
	if (stampOwnership) nextConfig = {
		...nextConfig,
		agents: {
			...nextConfig.agents,
			ownership: "explicit"
		}
	};
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
		persistCanonicalAgentRoster: options.persistCanonicalAgentRoster === true || persistOwnership || stampOwnership || (retiredMarkers?.changes.length ?? 0) > 0,
		preserveLegacyAgentRoster: Boolean(retainedLegacyDefaultAgentId) && !writesOwnershipTopology,
		cronOwner: persistOwnership ? retainedLegacyDefaultAgentId ? { provenOwnerAgentId: retainedLegacyDefaultAgentId } : {} : void 0
	};
}
//#endregion
export { prepareConfigWriteTopology as t };
