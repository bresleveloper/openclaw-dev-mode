import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-Bm8Ih2d_.mjs";
import { a as loadPersistedAuthProfileStore, b as removeRuntimeExternalProfileReferences, c as mergeAuthProfileStores, s as loadPersistedSharedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { k as resolveProviderConfigSecretInput } from "./loader-runtime-load-XbrcYJWd.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { p as updateAuthProfileStoreWithLock } from "./store-runtime-BcoYkagW.mjs";
import { t as parseModelCatalogJson } from "./model-catalog-json-CxUsDrkg.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, d as isGeneratedPluginModelCatalog } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-Dmb8-YXN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { t as listAgentModelsJsonPaths } from "./storage-scan-CnU2zCr3.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/commands/doctor-model-catalog-credentials.ts
/** Doctor-owned migration of plaintext model-catalog credentials into agent SQLite. */
function emptyStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function credentialMatches(credential, { provider, key }) {
	if (normalizeProviderId(credential?.provider ?? "") !== normalizeProviderId(provider)) return false;
	return credential?.type === "api_key" && credential.key === key || credential?.type === "token" && credential.token === key;
}
function matchesProviderEnvRefMarker(cfg, provider, value) {
	const ref = resolveProviderConfigSecretInput(cfg, provider).ref;
	if (ref?.source !== "env") return false;
	const id = ref.id.trim();
	const candidate = value.trim();
	return candidate === id || candidate === `$${id}` || candidate === `\${${id}}`;
}
function findProviderSecretRefProfiles(store, cfg) {
	return Object.entries(store.profiles).filter(([, credential]) => credential.type === "api_key" && credential.key && matchesProviderEnvRefMarker(cfg, credential.provider, credential.key));
}
function collectCredentials(providers, store, blockedStores = [], cfg) {
	if (!isRecord(providers)) return [];
	return Object.entries(providers).flatMap(([provider, entry]) => {
		if (!isRecord(entry) || typeof entry.apiKey !== "string") return [];
		const key = entry.apiKey;
		const credential = {
			provider,
			key
		};
		if (!key.trim() || cfg && resolveProviderConfigSecretInput(cfg, provider).ref || isNonSecretApiKeyMarker(key) || store.profiles[key] !== void 0 || findMatchingProfileId(store, credential, blockedStores) !== void 0) return [];
		return [credential];
	});
}
function uniqueCredentials(credentials) {
	return [...new Map(credentials.map((credential) => [`${normalizeProviderId(credential.provider)}\0${credential.key}`, credential])).values()];
}
function findMatchingProfileId(store, credential, blockedStores) {
	return Object.entries(store.profiles).find(([profileId, stored]) => credentialMatches(stored, credential) && blockedStores.every((blocked) => blocked.profiles[profileId] === void 0 || credentialMatches(blocked.profiles[profileId], credential)))?.[0];
}
function allocateProfileId(store, credential, blockedStores) {
	const provider = normalizeProviderId(credential.provider);
	for (let suffix = 1;; suffix += 1) {
		const profileId = suffix === 1 ? `${provider}:default` : `${provider}:models-json${suffix === 2 ? "" : `-${suffix}`}`;
		if ((!store.profiles[profileId] || credentialMatches(store.profiles[profileId], credential)) && blockedStores.every((blocked) => !blocked.profiles[profileId] || credentialMatches(blocked.profiles[profileId], credential))) return profileId;
	}
}
async function persistCredentials(params) {
	const credentials = uniqueCredentials(params.credentials);
	const { invalidProfiles } = params;
	if (credentials.length === 0 && invalidProfiles.length === 0) return {
		migrated: 0,
		removed: 0
	};
	const blockedStores = params.blockedStores ?? [];
	const profileIds = /* @__PURE__ */ new Map();
	let added = 0;
	let removedProfiles = [];
	if (!await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		stateDir: params.stateDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (localStore) => {
			removedProfiles = invalidProfiles.filter(([profileId, credential]) => isDeepStrictEqual(localStore.profiles[profileId], credential));
			if (removedProfiles.length > 0) Object.assign(localStore, removeRuntimeExternalProfileReferences({
				store: localStore,
				profileIds: new Set(removedProfiles.map(([profileId]) => profileId))
			}));
			const effectiveStore = params.inheritedStore ? mergeAuthProfileStores(params.inheritedStore, localStore) : localStore;
			for (const credential of credentials) {
				const profileId = findMatchingProfileId(effectiveStore, credential, blockedStores) ?? allocateProfileId(effectiveStore, credential, blockedStores);
				profileIds.set(profileId, credential);
				if (credentialMatches(effectiveStore.profiles[profileId], credential)) continue;
				localStore.profiles[profileId] = {
					type: "api_key",
					provider: normalizeProviderId(credential.provider),
					key: credential.key
				};
				effectiveStore.profiles[profileId] = localStore.profiles[profileId];
				added += 1;
			}
			return added > 0 || removedProfiles.length > 0;
		}
	})) throw new Error("auth profile store could not be updated");
	const persisted = params.agentDir ? loadPersistedAuthProfileStore(params.agentDir) : loadPersistedSharedAuthProfileStore({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	});
	const effectivePersisted = params.inheritedStore ? mergeAuthProfileStores(params.inheritedStore, persisted ?? emptyStore()) : persisted;
	for (const [profileId, credential] of removedProfiles) if (isDeepStrictEqual(persisted?.profiles[profileId], credential)) throw new Error(`credential cleanup verification failed for profile "${profileId}"`);
	for (const [profileId, credential] of profileIds) if (!credentialMatches(effectivePersisted?.profiles[profileId], credential)) throw new Error(`credential verification failed for provider "${credential.provider}"`);
	return {
		migrated: added,
		removed: removedProfiles.length
	};
}
function collectAgentCatalogs(agentDir, warnings) {
	const localStore = loadPersistedAuthProfileStore(agentDir) ?? emptyStore();
	const providers = [];
	const rootPath = path.join(agentDir, "models.json");
	try {
		const root = parseModelCatalogJson(fs.readFileSync(rootPath, "utf8"));
		if (isRecord(root) && isRecord(root.providers)) providers.push(root.providers);
	} catch (error) {
		if (error.code !== "ENOENT") warnings.push(`Could not read model catalog ${shortenHomePath(rootPath)}: ${error instanceof Error ? error.message : String(error)}`);
	}
	try {
		for (const catalog of loadPersistedPluginModelCatalogsReadOnly(agentDir)) try {
			const parsed = JSON.parse(catalog.contents);
			if (isGeneratedPluginModelCatalog(parsed) && isRecord(parsed) && isRecord(parsed.providers)) providers.push(parsed.providers);
		} catch {
			warnings.push(`Could not parse generated model catalog for plugin ${catalog.pluginId}.`);
		}
	} catch (error) {
		warnings.push(`Could not read generated model catalogs for ${shortenHomePath(agentDir)}: ${error instanceof Error ? error.message : String(error)}`);
	}
	return {
		agentDir,
		localStore,
		providers
	};
}
/** Copies and verifies catalog credentials before the runtime retires plaintext catalog auth. */
async function maybeMigrateModelCatalogCredentials(params) {
	const warnings = [];
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const mainAgentDir = resolveSharedMainAuthAgentDir(env);
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => listAgentIds(params.cfg).map((agentId) => ({
		agentId,
		path: resolveAgentDir(params.cfg, agentId, env)
	})), {
		kind: "agent-directory",
		readDatabasePaths: () => resolveConfiguredAgentDatabaseCandidatePaths(params.cfg, { env })
	});
	const agentDirs = listAgentModelsJsonPaths(params.cfg, stateDir, env).map((modelsPath) => path.dirname(modelsPath)).filter((agentDir) => !isRetained(agentDir));
	const mainStore = loadPersistedSharedAuthProfileStore(env) ?? emptyStore();
	const catalogs = agentDirs.map((agentDir) => collectAgentCatalogs(agentDir, warnings));
	const effectiveStores = catalogs.map(({ localStore }) => mergeAuthProfileStores(mainStore, localStore));
	const childStores = catalogs.filter((catalog) => catalog.agentDir !== mainAgentDir).map((catalog) => catalog.localStore);
	const configCredentials = collectCredentials(params.cfg.models?.providers, mainStore, childStores, params.cfg);
	const catalogCredentials = catalogs.map((catalog, index) => uniqueCredentials(catalog.providers.flatMap((providers) => collectCredentials(providers, effectiveStores[index] ?? mainStore, [], params.cfg))));
	const invalidMainProfiles = findProviderSecretRefProfiles(mainStore, params.cfg);
	const invalidCatalogProfiles = catalogs.map((catalog) => catalog.agentDir === mainAgentDir ? [] : findProviderSecretRefProfiles(catalog.localStore, params.cfg));
	const detected = configCredentials.length + catalogCredentials.reduce((sum, entries) => sum + entries.length, 0);
	const removable = invalidMainProfiles.length + invalidCatalogProfiles.reduce((sum, profiles) => sum + profiles.length, 0);
	for (const warning of warnings) params.runtime.error(warning);
	if (detected === 0 && removable === 0) return {
		detected,
		migrated: 0,
		removed: 0,
		warnings
	};
	if (detected > 0) note(`Found ${detected} plaintext model credential${detected === 1 ? "" : "s"}. Run openclaw doctor --fix to copy and verify them in agent SQLite before plaintext catalog authentication is retired.`, "Model catalog credentials");
	if (removable > 0) note(`Found ${removable} stored unresolved model credential marker${removable === 1 ? "" : "s"}. Run openclaw doctor --fix to remove them from agent SQLite.`, "Model catalog credentials");
	if (!(params.prompter.shouldRepair || await params.prompter.confirmAutoFix({
		message: "Repair model credentials in agent SQLite now?",
		initialValue: true
	}))) return {
		detected,
		migrated: 0,
		removed: 0,
		warnings
	};
	let migrated = 0;
	let removed = 0;
	try {
		const result = await persistCredentials({
			blockedStores: childStores,
			credentials: configCredentials,
			invalidProfiles: invalidMainProfiles,
			stateDir
		});
		migrated += result.migrated;
		removed += result.removed;
	} catch (error) {
		const warning = `Could not migrate configured model credentials: ${error instanceof Error ? error.message : String(error)}`;
		warnings.push(warning);
		params.runtime.error(warning);
	}
	const migratedMainStore = loadPersistedSharedAuthProfileStore(env) ?? mainStore;
	for (const [index, catalog] of catalogs.entries()) try {
		const result = await persistCredentials({
			...catalog.agentDir === mainAgentDir ? {} : { agentDir: catalog.agentDir },
			credentials: catalogCredentials[index] ?? [],
			invalidProfiles: invalidCatalogProfiles[index] ?? [],
			...catalog.agentDir === mainAgentDir ? {} : { inheritedStore: migratedMainStore },
			stateDir
		});
		migrated += result.migrated;
		removed += result.removed;
	} catch (error) {
		const warning = `Could not migrate model credentials for ${shortenHomePath(catalog.agentDir)}: ${error instanceof Error ? error.message : String(error)}`;
		warnings.push(warning);
		params.runtime.error(warning);
	}
	if (migrated > 0) note(`Copied and verified ${migrated} model credential${migrated === 1 ? "" : "s"} in agent SQLite. Existing catalog values remain active until the runtime migration lands.`, "Doctor changes");
	if (removed > 0) note(`Removed ${removed} unresolved model credential marker${removed === 1 ? "" : "s"} from agent SQLite.`, "Doctor changes");
	return {
		detected,
		migrated,
		removed,
		warnings
	};
}
//#endregion
export { maybeMigrateModelCatalogCredentials };
