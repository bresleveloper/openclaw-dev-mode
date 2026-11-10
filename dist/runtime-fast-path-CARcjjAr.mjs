import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { h as copyCanonicalAuthProfileCredentialObservations } from "./oauth-shared-CiaJlx_D.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { o as readAuthProfileDatabaseIdentity } from "./file-state-CTXmtyL_.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath } from "./path-resolve-21Orzn6B.mjs";
import { S as recordRuntimeAuthProfilePersistedStore, U as prepareRuntimeAuthProfileStoreSnapshots, c as getRuntimeAuthProfileStoreCredentialsRevision, m as getRuntimeAuthProfileStoreSnapshotsRevision } from "./runtime-snapshots-HRosak4u.mjs";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { n as hasSecretRefCandidate, t as hasCredentialBearingObjectValue } from "./runtime-secret-scan-DAb5IwUR.mjs";
//#region src/secrets/runtime-fast-path.ts
const RUNTIME_PATH_ENV_KEYS = [
	"HOME",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_HOME",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_AGENT_DIR"
];
/**
* Merges caller env with process path env needed for config and agent-dir resolution.
*/
function mergeSecretsRuntimeEnv(env) {
	const merged = { ...env ?? process.env };
	for (const key of RUNTIME_PATH_ENV_KEYS) {
		if (merged[key] !== void 0) continue;
		const processValue = process.env[key];
		if (processValue !== void 0) merged[key] = processValue;
	}
	return merged;
}
function collectCandidateAgentDirs(config, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	dirs.add(resolveUserPath(resolveAgentDir(config, "main", env), env));
	dirs.add(resolveUserPath(resolveLegacyInheritedAuthAgentDir(config, env), env));
	for (const agentId of listAgentIds(config)) dirs.add(resolveUserPath(resolveAgentDir(config, agentId, env), env));
	return [...dirs];
}
function resolveRefreshAgentDirs(config, context) {
	const configDerived = collectCandidateAgentDirs(config, context.env);
	if (!context.explicitAgentDirs || context.explicitAgentDirs.length === 0) return configDerived;
	return uniqueStrings([...context.explicitAgentDirs, ...configDerived]);
}
function createEmptyRuntimeWebToolsMetadata() {
	return {
		search: {
			providerSource: "none",
			diagnostics: []
		},
		fetch: {
			providerSource: "none",
			diagnostics: []
		},
		diagnostics: []
	};
}
function hasActiveRuntimeWebFetchProviderSurface(fetch, defaults) {
	if (!isRecord(fetch)) return false;
	if (fetch.enabled === false) return false;
	if (typeof fetch.provider === "string" && fetch.provider.trim()) return true;
	return hasCredentialBearingObjectValue(fetch, defaults);
}
function hasRuntimeWebToolConfigSurface(config) {
	const web = config.tools?.web;
	const defaults = config.secrets?.defaults;
	const fetchExplicitlyDisabled = isRecord(web) && typeof web.fetch === "object" && web.fetch?.enabled === false;
	if (isRecord(web)) {
		if ("search" in web) return true;
		if ("fetch" in web && hasActiveRuntimeWebFetchProviderSurface(web.fetch, defaults)) return true;
	}
	const entries = config.plugins?.entries;
	if (!isRecord(entries)) return false;
	return Object.values(entries).some((entry) => {
		if (!isRecord(entry)) return false;
		const pluginConfig = entry.config;
		return isRecord(pluginConfig) && ("webSearch" in pluginConfig || !fetchExplicitlyDisabled && "webFetch" in pluginConfig);
	});
}
function canUseSecretsRuntimeFastPath(params) {
	if (hasRuntimeWebToolConfigSurface(params.sourceConfig)) return false;
	const defaults = params.sourceConfig.secrets?.defaults;
	if (hasSecretRefCandidate(params.sourceConfig, defaults)) return false;
	return !params.authStores.some((entry) => hasSecretRefCandidate(entry.store, defaults));
}
/**
* Prepares a runtime snapshot without resolving refs when config and auth stores contain none.
*/
function prepareSecretsRuntimeFastPathSnapshot(params) {
	const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
	const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	const authStoreSnapshotsRevision = getRuntimeAuthProfileStoreSnapshotsRevision();
	const sourceConfig = cloneConfigWithResolutionFacts(params.config);
	const resolvedConfig = cloneConfigWithResolutionFacts(params.config);
	const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
	const candidateDirs = params.agentDirs?.length ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv))) : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
	let authStores = [];
	if (includeAuthStoreRefs) {
		if (!params.loadAuthStore) {
			const databasePaths = uniqueStrings([...candidateDirs.map(resolveAuthProfileDatabasePath), resolveSharedAuthStorePath(runtimeEnv)]);
			if (databasePaths.some((pathname) => !readAuthProfileDatabaseIdentity(pathname)?.key.startsWith("path:"))) return null;
			for (const pathname of databasePaths) recordRuntimeAuthProfilePersistedStore(pathname, null);
			authStores = candidateDirs.map((agentDir) => ({
				agentDir,
				store: {
					version: 1,
					profiles: {}
				}
			}));
		} else {
			const loadAuthStore = params.loadAuthStore;
			authStores = candidateDirs.map((agentDir) => {
				const source = loadAuthStore(agentDir);
				const store = structuredClone(source);
				copyCanonicalAuthProfileCredentialObservations(source.profiles, store.profiles);
				return {
					agentDir,
					store
				};
			});
		}
	}
	if (!canUseSecretsRuntimeFastPath({
		sourceConfig,
		authStores
	})) return null;
	return {
		snapshot: {
			sourceConfig,
			config: resolvedConfig,
			authStores: prepareRuntimeAuthProfileStoreSnapshots(authStores, runtimeEnv),
			authStoreCredentialsRevision,
			authStoreSnapshotsRevision,
			warnings: [],
			degradedOwners: [],
			secretOwners: [],
			webTools: createEmptyRuntimeWebToolsMetadata()
		},
		usesAuthStoreFallback: !params.loadAuthStore,
		refreshContext: {
			env: runtimeEnv,
			explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
			includeAuthStoreRefs,
			loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
			...params.loadAuthStore ? { loadAuthStore: params.loadAuthStore } : {}
		}
	};
}
//#endregion
export { prepareSecretsRuntimeFastPathSnapshot as a, mergeSecretsRuntimeEnv as i, collectCandidateAgentDirs as n, resolveRefreshAgentDirs as o, createEmptyRuntimeWebToolsMetadata as r, canUseSecretsRuntimeFastPath as t };
