import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as getPluginCacheRoot } from "./plugin-cache-BbahpD-b.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConcreteConfigPath, t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { o as openRootFileSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as pluginCacheExistsSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { n as getOfficialExternalChannelSecretContract, s as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Dmwzhxit.mjs";
import { n as parseDotPath } from "./shared-BVDjoVcf.mjs";
import { i as materializePathTokens, n as expandPathTokens, r as matchPathTokens, t as compileTargetRegistryEntry } from "./target-registry-pattern-0uo8DuOR.mjs";
import { c as isChannelAccountEffectivelyEnabled, l as isEnabledFlag, r as collectSecretInputAssignment } from "./runtime-shared-DqMZ_k3n.mjs";
import { c as getChannelRecord, i as createChannelAccountSecretOwner, o as createChannelSecretTargetRegistryEntries } from "./channel-secret-basic-runtime-BEYtUzPu.mjs";
import { n as getPath } from "./path-utils-aDSU1mEq.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/secrets/official-external-channel-secret-contract.ts
/** Host fallback secret contracts for external channels without contract artifacts. */
function hasActivationValue(params) {
	if (!params.activationField) return true;
	if (normalizeOptionalString(params.record[params.activationField])) return true;
	return Boolean(params.allowEnv && params.activationEnv && normalizeOptionalString(params.env[params.activationEnv]));
}
function loadOfficialExternalChannelSecretContractApi(channelId) {
	const contract = getOfficialExternalChannelSecretContract(channelId);
	if (!contract) return;
	const fieldNames = contract.fields.map((field) => field.field);
	return {
		secretTargetRegistryEntries: createChannelSecretTargetRegistryEntries({
			channelKey: contract.channelId,
			channel: fieldNames,
			account: fieldNames
		}),
		collectRuntimeConfigAssignments({ config, defaults, context }) {
			const channel = getChannelRecord(config, contract.channelId);
			if (!channel) return;
			for (const field of contract.fields) {
				const activationEnvValue = field.activationEnv ? normalizeOptionalString(context.env[field.activationEnv]) : void 0;
				if (isEnabledFlag(channel) && field.activationField && !normalizeOptionalString(channel[field.activationField]) && activationEnvValue) channel[field.activationField] = activationEnvValue;
				const { accounts: _accounts, ...defaultAccount } = channel;
				const sharedChannel = Object.fromEntries(Object.entries(defaultAccount).filter(([key]) => !contract.fields.some((credential) => key === credential.field || key === credential.activationField)));
				const collectAccount = (accountId, account, root, ownerContract) => {
					const accountPath = root ? `channels.${contract.channelId}` : appendConfigPathSegment(`channels.${contract.channelId}.accounts`, accountId);
					collectSecretInputAssignment({
						value: account[field.field],
						path: `${accountPath}.${field.field}`,
						expected: "string",
						defaults,
						context,
						active: (root ? isEnabledFlag(channel) : isChannelAccountEffectivelyEnabled(channel, account)) && hasActivationValue({
							record: account,
							activationField: field.activationField,
							activationEnv: field.activationEnv,
							env: context.env,
							allowEnv: root
						}),
						inactiveReason: `external channel${root ? "" : " account"} is disabled or ${field.activationField ?? "its credential surface"} is not configured.`,
						owner: createChannelAccountSecretOwner(contract.channelId, accountId, channel, root ? defaultAccount : account, ownerContract),
						apply: (value) => {
							account[field.field] = value;
						}
					});
				};
				collectAccount("default", channel, true, defaultAccount);
				const accounts = isRecord(channel.accounts) ? channel.accounts : void 0;
				if (!accounts) continue;
				for (const [accountId, accountValue] of Object.entries(accounts)) {
					const account = isRecord(accountValue) ? accountValue : void 0;
					if (!account || !Object.hasOwn(account, field.field)) continue;
					collectAccount(accountId, account, false, {
						channel: sharedChannel,
						account
					});
				}
			}
		}
	};
}
function listOfficialExternalChannelSecretTargetRegistryEntries() {
	return listOfficialExternalChannelCatalogEntries().flatMap((entry) => {
		const channelId = normalizeOptionalString(getOfficialExternalPluginCatalogManifest(entry)?.channel?.id);
		return channelId ? loadOfficialExternalChannelSecretContractApi(channelId)?.secretTargetRegistryEntries ?? [] : [];
	});
}
//#endregion
//#region src/secrets/channel-contract-api.ts
/** Loads channel secret contract APIs from bundled and external plugin artifacts. */
const CONTRACT_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
function loadBundledChannelSecretContractApi(channelId) {
	return loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: channelId,
		artifactCandidates: ["secret-contract-api.js"]
	}) ?? void 0;
}
function orderedContractApiExtensions() {
	return RUNNING_FROM_BUILT_ARTIFACT ? CONTRACT_API_EXTENSIONS : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
}
function resolvePluginContractApiPath(rootDir) {
	const artifacts = getPluginCacheRoot(rootDir).artifacts;
	const key = "channel-secret-contract";
	const cached = artifacts.get(key);
	if (cached !== void 0) return cached?.modulePath ?? null;
	const searchDirs = RUNNING_FROM_BUILT_ARTIFACT ? [path.join(rootDir, "dist"), rootDir] : [rootDir, path.join(rootDir, "dist")];
	for (const basename of ["secret-contract-api", "contract-api"]) for (const dir of searchDirs) for (const extension of orderedContractApiExtensions()) {
		const candidate = path.join(dir, `${basename}${extension}`);
		if (pluginCacheExistsSync(candidate)) {
			artifacts.set(key, {
				modulePath: candidate,
				boundaryRoot: rootDir
			});
			return candidate;
		}
	}
	artifacts.set(key, null);
	return null;
}
function loadExternalChannelSecretContractFromRecord(record, env = process.env, throwOnLoadError = false) {
	const contractPath = resolvePluginContractApiPath(record.rootDir);
	if (!contractPath) return;
	const artifacts = getPluginCacheRoot(record.rootDir).artifacts;
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: record.origin,
		rootDir: record.rootDir,
		env
	});
	const boundary = `channel-secret-contract:validated:${rejectHardlinks}`;
	let validated = artifacts.get(boundary);
	if (validated === void 0) {
		const opened = openRootFileSync({
			absolutePath: contractPath,
			rootPath: record.rootDir,
			boundaryLabel: "plugin root",
			rejectHardlinks,
			skipLexicalRootCheck: true
		});
		if (opened.ok) {
			fs.closeSync(opened.fd);
			validated = {
				modulePath: opened.path,
				boundaryRoot: record.rootDir
			};
		} else validated = null;
		artifacts.set(boundary, validated);
	}
	if (!validated) {
		if (throwOnLoadError) throw new Error(`Unable to open channel secret contract for ${record.id}`);
		return;
	}
	try {
		const mod = getCachedPluginModuleLoader({
			modulePath: validated.modulePath,
			importerUrl: import.meta.url
		})(validated.modulePath);
		if (mod.collectRuntimeConfigAssignments || mod.secretTargetRegistryEntries) return mod;
	} catch (error) {
		if (throwOnLoadError) throw error;
	}
}
function recordOwnsChannel(record, channelId) {
	return record.channels.includes(channelId) || Object.hasOwn(record.channelConfigs ?? {}, channelId) || record.channelCatalogMeta?.id === channelId || record.packageChannel?.id === channelId;
}
function listChannelSecretContractRecords(params) {
	return resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.env
	}).plugins.filter((record) => record.origin !== "bundled").filter((record) => recordOwnsChannel(record, params.channelId)).filter((record) => !params.loadablePluginOrigins || params.loadablePluginOrigins.has(record.id)).toSorted((left, right) => {
		if (left.id === params.channelId && right.id !== params.channelId) return -1;
		if (right.id === params.channelId && left.id !== params.channelId) return 1;
		return left.id.localeCompare(right.id);
	});
}
function loadChannelSecretContractApi(params) {
	const bundled = loadBundledChannelSecretContractApi(params.channelId);
	if (bundled || params.bundledOnly) return bundled;
	const env = params.env ?? process.env;
	const officialFallback = loadOfficialExternalChannelSecretContractApi(params.channelId);
	let records;
	try {
		records = listChannelSecretContractRecords({
			channelId: params.channelId,
			config: params.config,
			env,
			loadablePluginOrigins: params.loadablePluginOrigins
		});
	} catch (error) {
		if (officialFallback) return officialFallback;
		throw error;
	}
	for (const record of records) {
		const contract = loadExternalChannelSecretContractFromRecord(record, env);
		if (contract) return contract;
	}
	return officialFallback;
}
function loadChannelSecretContractApiForRecord(record, options) {
	if (record.origin === "bundled") return loadBundledChannelSecretContractApi(record.id);
	return loadExternalChannelSecretContractFromRecord(record, process.env, options?.throwOnLoadError);
}
//#endregion
//#region src/secrets/provider-request-secret-fields.ts
const TLS_SECRET_FIELDS = [
	"ca",
	"cert",
	"key",
	"passphrase"
];
const PROVIDER_REQUEST_SECRET_FIELD_GROUPS = [
	{
		path: ["headers"],
		fields: "*",
		registryOrder: 0
	},
	{
		path: ["auth"],
		fields: ["token", "value"],
		registryOrder: 1
	},
	{
		path: ["tls"],
		fields: TLS_SECRET_FIELDS,
		registryOrder: 3
	},
	{
		path: ["proxy", "tls"],
		fields: TLS_SECRET_FIELDS,
		registryOrder: 2
	}
];
//#endregion
//#region src/secrets/target-registry-data.ts
const SECRET_INPUT_SHAPE = "secret_input";
const SIBLING_REF_SHAPE = "sibling_ref";
const WEB_PROVIDER_SECRET_CONFIGS = [{
	contract: "webSearchProviders",
	configPath: "webSearch.apiKey"
}, {
	contract: "webFetchProviders",
	configPath: "webFetch.apiKey"
}];
function createOpenClawConfigSecretTargetEntry(pathPattern, options = {}) {
	return {
		id: pathPattern,
		targetType: pathPattern,
		configFile: "openclaw.json",
		pathPattern,
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		...options
	};
}
function createPluginOpenClawConfigSecretTargetEntry(pluginId, configPath) {
	const pluginConfigPath = [
		"plugins",
		"entries",
		pluginId,
		"config"
	];
	const pathPatternSegments = [...pluginConfigPath, ...parseDotPath(configPath)];
	return createOpenClawConfigSecretTargetEntry(`${formatConcreteConfigPath(pluginConfigPath)}.${configPath}`, { pathPatternSegments });
}
function listPluginWebProviderSecretTargetRegistryEntries(plugins) {
	const entries = [];
	for (const record of plugins) for (const config of WEB_PROVIDER_SECRET_CONFIGS) if ((record.contracts?.[config.contract]?.length ?? 0) > 0 && record.configUiHints?.[config.configPath]?.sensitive === true) entries.push(createPluginOpenClawConfigSecretTargetEntry(record.id, config.configPath));
	return entries.toSorted((left, right) => left.id.localeCompare(right.id));
}
function listPluginConfigSecretTargetRegistryEntries(plugins) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const record of plugins) {
		const secretInputs = record.configContracts?.secretInputs?.paths ?? [];
		for (const secretInput of secretInputs) {
			const entry = createPluginOpenClawConfigSecretTargetEntry(record.id, secretInput.path);
			const key = `${entry.configFile}:${entry.pathPattern}`;
			if (seen.has(key)) continue;
			seen.add(key);
			entries.push(entry);
		}
	}
	return entries.toSorted((left, right) => left.id.localeCompare(right.id));
}
function listChannelSecretTargetRegistryEntries(channelPlugins, throwOnLoadError = false) {
	const entries = [];
	for (const record of channelPlugins) try {
		const contractApi = loadChannelSecretContractApiForRecord(record, { throwOnLoadError });
		entries.push(...contractApi?.secretTargetRegistryEntries ?? []);
	} catch (error) {
		if (throwOnLoadError) throw error;
	}
	return entries;
}
const CORE_SECRET_TARGET_REGISTRY = [
	...[["api_key", "key"], ["token", "token"]].map(([authProfileType, field]) => ({
		id: `auth-profiles.${authProfileType}.${field}`,
		targetType: `auth-profiles.${authProfileType}.${field}`,
		configFile: "auth-profile-store",
		pathPattern: `profiles.*.${field}`,
		refPathPattern: `profiles.*.${field}Ref`,
		secretShape: SIBLING_REF_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		authProfileType
	})),
	...[
		"memory.search.remote.apiKey",
		"agents.entries.*.memory.search.remote.apiKey",
		"cron.webhookToken",
		"database.postgres.connection",
		"gateway.auth.token",
		"gateway.auth.password",
		"gateway.remote.password",
		"gateway.remote.token"
	].map((pathPattern) => createOpenClawConfigSecretTargetEntry(pathPattern)),
	...["memory.search.remote.headers.*", "agents.entries.*.memory.search.remote.headers.*"].map((pathPattern) => Object.assign(createOpenClawConfigSecretTargetEntry(pathPattern), {
		includeInPlan: false,
		includeInConfigure: false,
		includeInAudit: false
	})),
	...["tts", "agents.entries.*.tts"].flatMap((prefix) => ["providers.*", "personas.*.providers.*"].map((providerPath) => {
		const path = `${prefix}.${providerPath}.apiKey`;
		return createOpenClawConfigSecretTargetEntry(path, {
			includeInConfigure: prefix === "tts",
			providerIdPathSegmentIndex: path.split(".").length - 2
		});
	})),
	...[
		"apiKey",
		"headers.*",
		...PROVIDER_REQUEST_SECRET_FIELD_GROUPS.toSorted((left, right) => left.registryOrder - right.registryOrder).flatMap(({ path, fields }) => (fields === "*" ? ["*"] : fields).map((field) => [
			"request",
			...path,
			field
		].join(".")))
	].map((suffix) => {
		const pathPattern = `models.providers.*.${suffix}`;
		return createOpenClawConfigSecretTargetEntry(pathPattern, {
			targetType: pathPattern.split(".").filter((segment) => segment !== "*").join("."),
			targetTypeAliases: [pathPattern],
			providerIdPathSegmentIndex: 2,
			...suffix === "apiKey" ? { trackProviderShadowing: true } : {}
		});
	}),
	createOpenClawConfigSecretTargetEntry("skills.entries.*.apiKey", {
		targetType: "skills.entries.apiKey",
		targetTypeAliases: ["skills.entries.*.apiKey"]
	}),
	createOpenClawConfigSecretTargetEntry("talk.providers.*.apiKey", { providerIdPathSegmentIndex: 2 }),
	createOpenClawConfigSecretTargetEntry("talk.realtime.providers.*.apiKey", { providerIdPathSegmentIndex: 3 })
];
let cachedSecretTargetRegistry = null;
function loadSecretTargetRegistryFromPluginMetadata(params) {
	const plugins = resolvePluginMetadataSnapshot({
		...params.config !== void 0 ? { config: params.config } : {},
		env: params.env,
		allowWorkspaceScopedCurrent: true,
		...params.pluginConfig?.pluginIds ? { pluginIds: params.pluginConfig.pluginIds } : {},
		...params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {}
	}).plugins;
	return buildSecretTargetRegistryFromPlugins(plugins, {
		throwOnLoadError: params.throwOnLoadError,
		pluginConfig: params.pluginConfig,
		...params.configuredOnly ? { config: params.config ?? {} } : {}
	});
}
/** Builds secret targets from one exact manifest-registry plugin set. */
function buildSecretTargetRegistryFromPlugins(plugins, options) {
	const pluginConfigIds = options?.pluginConfig?.pluginIds ? new Set(options.pluginConfig.pluginIds) : options?.config ? new Set(Object.keys(options.config.plugins?.entries ?? {})) : null;
	const configPlugins = pluginConfigIds ? plugins.filter((record) => pluginConfigIds.has(record.id)) : plugins;
	const channelIds = options?.config ? new Set(Object.keys(options.config.channels ?? {})) : null;
	const channelPlugins = (options?.pluginConfig ? options.pluginConfig.includeChannelContracts ? configPlugins : [] : plugins).filter((record) => (!channelIds || pluginConfigIds?.has(record.id) || channelIds.size > 0 && (record.origin !== "bundled" || record.channels.some((id) => channelIds.has(id)) || Object.keys(record.channelConfigs ?? {}).some((id) => channelIds.has(id)) || channelIds.has(record.channelCatalogMeta?.id ?? "") || channelIds.has(record.packageChannel?.id ?? ""))) && (record.channels.length > 0 || Object.keys(record.channelConfigs ?? {}).length > 0 || Boolean(record.channelCatalogMeta?.id) || Boolean(record.packageChannel?.id)));
	const entries = [
		...options?.pluginConfig ? [] : CORE_SECRET_TARGET_REGISTRY,
		...listPluginWebProviderSecretTargetRegistryEntries(configPlugins),
		...listPluginConfigSecretTargetRegistryEntries(configPlugins),
		...listChannelSecretTargetRegistryEntries(channelPlugins, options?.throwOnLoadError),
		...options?.pluginConfig || channelIds?.size === 0 ? [] : listOfficialExternalChannelSecretTargetRegistryEntries()
	];
	const seen = /* @__PURE__ */ new Set();
	return entries.filter((entry) => {
		const key = `${entry.configFile}:${entry.pathPattern}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
/** Returns static core secret target registry entries without plugin-derived targets. */
function getCoreSecretTargetRegistry() {
	return CORE_SECRET_TARGET_REGISTRY;
}
/** Returns the full registry, configured subtrees, or selected plugin owners' targets. */
function getSecretTargetRegistry(params) {
	if (params?.sourceTree) return loadSecretTargetRegistryFromPluginMetadata({
		env: {
			...process.env,
			OPENCLAW_BUNDLED_PLUGINS_DIR: process.env.OPENCLAW_BUNDLED_PLUGINS_DIR ?? "extensions"
		},
		preferPersisted: false,
		throwOnLoadError: true
	});
	if (params?.config || params?.pluginConfig) return loadSecretTargetRegistryFromPluginMetadata({
		config: params.config,
		env: params.env ?? process.env,
		pluginConfig: params.pluginConfig,
		configuredOnly: params.configuredOnly
	});
	cachedSecretTargetRegistry ??= loadSecretTargetRegistryFromPluginMetadata({ env: process.env });
	return cachedSecretTargetRegistry;
}
//#endregion
//#region src/secrets/target-registry-query.ts
let compiledSecretTargetRegistryState = null;
let compiledCoreSecretTargetRegistryState = null;
const compiledChannelOpenClawTargets = /* @__PURE__ */ new Map();
const compiledPluginConfigTargets = /* @__PURE__ */ new Map();
const compiledPluginConfigTargetsWithChannels = /* @__PURE__ */ new Map();
function indexSecretTargets(entries, key) {
	const index = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const keys = [entry[key], ...key === "targetType" ? entry.targetTypeAliases ?? [] : []];
		for (const value of keys) {
			const existing = index.get(value);
			if (existing) existing.push(entry);
			else index.set(value, [entry]);
		}
	}
	return index;
}
function compileSecretTargetRegistryState(registry) {
	const compiledSecretTargetRegistry = registry.map(compileTargetRegistryEntry);
	const openClawCompiledSecretTargets = compiledSecretTargetRegistry.filter((entry) => entry.configFile === "openclaw.json");
	const authProfilesCompiledSecretTargets = compiledSecretTargetRegistry.filter((entry) => entry.configFile === "auth-profile-store");
	return {
		authProfilesCompiledSecretTargets,
		authProfilesTargetsById: indexSecretTargets(authProfilesCompiledSecretTargets, "id"),
		compiledSecretTargetRegistry,
		knownTargetIds: new Set(compiledSecretTargetRegistry.map((entry) => entry.id)),
		openClawCompiledSecretTargets,
		openClawTargetsById: indexSecretTargets(openClawCompiledSecretTargets, "id"),
		targetsByType: indexSecretTargets(compiledSecretTargetRegistry, "targetType")
	};
}
function getCompiledSecretTargetRegistryState() {
	if (compiledSecretTargetRegistryState) return compiledSecretTargetRegistryState;
	compiledSecretTargetRegistryState = compileSecretTargetRegistryState(getSecretTargetRegistry());
	return compiledSecretTargetRegistryState;
}
function getConfiguredSecretTargetRegistryState(config, env, manifestRegistry) {
	return compileSecretTargetRegistryState(manifestRegistry ? buildSecretTargetRegistryFromPlugins(manifestRegistry.plugins, { config }) : getSecretTargetRegistry({
		config,
		env,
		configuredOnly: true
	}));
}
function getCompiledCoreSecretTargetRegistryState() {
	compiledCoreSecretTargetRegistryState ??= compileSecretTargetRegistryState(getCoreSecretTargetRegistry());
	return compiledCoreSecretTargetRegistryState;
}
function getCompiledChannelOpenClawTargets(channelId) {
	const normalizedChannelId = channelId.trim();
	if (!normalizedChannelId || normalizedChannelId === "." || normalizedChannelId === ".." || /[\\/:]/.test(normalizedChannelId)) return null;
	if (compiledChannelOpenClawTargets.has(normalizedChannelId)) return compiledChannelOpenClawTargets.get(normalizedChannelId) ?? null;
	const compiledEntries = loadChannelSecretContractApi({
		channelId: normalizedChannelId,
		config: {},
		env: process.env
	})?.secretTargetRegistryEntries?.filter((entry) => entry.configFile === "openclaw.json").map(compileTargetRegistryEntry) ?? null;
	compiledChannelOpenClawTargets.set(normalizedChannelId, compiledEntries);
	return compiledEntries;
}
function getPluginOwnedConfigPathEntries(pathTokens, broaderDiscovery = false) {
	if (pathTokens[0] === "plugins") {
		const pluginId = pathTokens[2];
		if (pathTokens[1] !== "entries" || typeof pluginId !== "string" || !pluginId || pathTokens[3] !== "config") return [];
		const cache = broaderDiscovery ? compiledPluginConfigTargetsWithChannels : compiledPluginConfigTargets;
		let entries = cache.get(pluginId);
		if (!entries) {
			entries = getSecretTargetRegistry({ pluginConfig: {
				pluginIds: [pluginId],
				includeChannelContracts: broaderDiscovery
			} }).map(compileTargetRegistryEntry);
			cache.set(pluginId, entries);
		}
		return entries;
	}
	const channelId = pathTokens[0] === "channels" ? pathTokens[1] : void 0;
	if (typeof channelId !== "string" || !channelId) return [];
	return broaderDiscovery ? getCompiledSecretTargetRegistryState().openClawCompiledSecretTargets.filter((entry) => entry.pathTokens[0]?.kind === "literal" && entry.pathTokens[0].value === "channels") : getCompiledChannelOpenClawTargets(channelId) ?? [];
}
function normalizeAllowedTargetIds(targetIds) {
	if (targetIds === void 0) return null;
	return new Set(Array.from(targetIds).map((entry) => entry.trim()).filter((entry) => entry.length > 0));
}
function configHasPluginEntries(config) {
	return Boolean(config.plugins?.entries && Object.keys(config.plugins.entries).length > 0);
}
function getConfiguredChannelOpenClawTargets(config, env) {
	const entries = [];
	for (const channelId of Object.keys(config.channels ?? {})) {
		if (channelId === "defaults" || channelId === "modelByChannel" || channelId === "tools") continue;
		const contract = loadChannelSecretContractApi({
			channelId,
			config,
			env,
			bundledOnly: true
		});
		if (!contract) return null;
		entries.push(...contract.secretTargetRegistryEntries?.filter((entry) => entry.configFile === "openclaw.json").map(compileTargetRegistryEntry) ?? []);
	}
	return entries;
}
function resolveDiscoveryEntries(params) {
	if (params.allowedTargetIds === null) return params.defaultEntries;
	return Array.from(params.allowedTargetIds).flatMap((targetId) => params.entriesById.get(targetId) ?? []);
}
function discoverSecretTargetsFromEntries(source, discoveryEntries) {
	const formatDiscoveredPath = (segments) => formatConcreteConfigPath(segments, source);
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of discoveryEntries) {
		const expanded = expandPathTokens(source, entry.pathTokens);
		for (const match of expanded) {
			const resolved = toResolvedPlanTarget(entry, match.captures);
			if (!resolved) continue;
			const key = JSON.stringify([entry.id, ...resolved.pathTokens]);
			if (seen.has(key)) continue;
			seen.add(key);
			const refValue = resolved.refPathSegments ? getPath(source, resolved.refPathSegments) : void 0;
			out.push({
				entry,
				path: formatDiscoveredPath(match.segments),
				pathSegments: resolved.pathSegments,
				...resolved.refPathSegments ? {
					refPathSegments: resolved.refPathSegments,
					refPath: formatDiscoveredPath(resolved.refPathTokens ?? resolved.refPathSegments)
				} : {},
				value: match.value,
				...resolved.providerId ? { providerId: resolved.providerId } : {},
				...resolved.accountId ? { accountId: resolved.accountId } : {},
				...resolved.refPathSegments ? { refValue } : {}
			});
		}
	}
	return out;
}
function toResolvedPlanTarget(entry, captures) {
	const pathTokens = materializePathTokens(entry.pathTokens, captures);
	if (!pathTokens) return null;
	const pathSegments = pathTokens.map(String);
	const providerId = entry.providerIdPathSegmentIndex !== void 0 ? pathSegments[entry.providerIdPathSegmentIndex] : void 0;
	const accountId = entry.accountIdPathSegmentIndex !== void 0 ? pathSegments[entry.accountIdPathSegmentIndex] : void 0;
	const refPathTokens = entry.refPathTokens ? materializePathTokens(entry.refPathTokens, captures) : void 0;
	if (entry.refPathTokens && !refPathTokens) return null;
	return {
		entry,
		pathSegments,
		pathTokens,
		...refPathTokens ? {
			refPathTokens,
			refPathSegments: refPathTokens.map(String)
		} : {},
		...providerId ? { providerId } : {},
		...accountId ? { accountId } : {}
	};
}
/** Lists all entries or a config path's candidate owners. */
function listSecretTargetRegistryEntries(options) {
	const configPath = options?.configPath;
	return (configPath ? [...getCompiledCoreSecretTargetRegistryState().openClawCompiledSecretTargets, ...getPluginOwnedConfigPathEntries(configPath, true)] : getCompiledSecretTargetRegistryState().compiledSecretTargetRegistry).map((entry) => Object.assign({
		id: entry.id,
		targetType: entry.targetType
	}, entry.targetTypeAliases ? { targetTypeAliases: [...entry.targetTypeAliases] } : {}, {
		configFile: entry.configFile,
		pathPattern: entry.pathPattern
	}, entry.pathPatternSegments ? { pathPatternSegments: [...entry.pathPatternSegments] } : {}, entry.refPathPattern ? { refPathPattern: entry.refPathPattern } : {}, {
		secretShape: entry.secretShape,
		expectedResolvedValue: entry.expectedResolvedValue,
		includeInPlan: entry.includeInPlan,
		includeInConfigure: entry.includeInConfigure,
		includeInAudit: entry.includeInAudit
	}, entry.providerIdPathSegmentIndex !== void 0 ? { providerIdPathSegmentIndex: entry.providerIdPathSegmentIndex } : {}, entry.accountIdPathSegmentIndex !== void 0 ? { accountIdPathSegmentIndex: entry.accountIdPathSegmentIndex } : {}, entry.authProfileType ? { authProfileType: entry.authProfileType } : {}, entry.trackProviderShadowing ? { trackProviderShadowing: true } : {}));
}
function isKnownSecretTargetId(value) {
	if (typeof value !== "string") return false;
	if (getCompiledCoreSecretTargetRegistryState().knownTargetIds.has(value)) return true;
	for (const entries of [...compiledPluginConfigTargets.values(), ...compiledPluginConfigTargetsWithChannels.values()]) if (entries.some((entry) => entry.id === value)) return true;
	return getCompiledSecretTargetRegistryState().knownTargetIds.has(value);
}
/** Checks the static core registry without materializing plugin/channel contracts. */
function isKnownCoreSecretTargetId(value) {
	return typeof value === "string" && getCompiledCoreSecretTargetRegistryState().knownTargetIds.has(value);
}
function resolvePlanTargetAgainstRegistry(candidate) {
	const coreEntries = getCompiledCoreSecretTargetRegistryState().targetsByType.get(candidate.type);
	if (coreEntries) return resolvePlanTargetAgainstEntries(candidate, coreEntries);
	const explicitChannelId = candidate.pathSegments[0] === "channels" ? candidate.pathSegments[1]?.trim() ?? "" : "";
	if (explicitChannelId && /[\\/:]/.test(explicitChannelId)) return null;
	const pathTokens = candidate.pathTokens ?? candidate.pathSegments;
	const directTarget = resolvePlanTargetAgainstEntries(candidate, indexSecretTargets(getPluginOwnedConfigPathEntries(pathTokens), "targetType").get(candidate.type));
	if (directTarget) return directTarget;
	return resolvePlanTargetAgainstEntries(candidate, indexSecretTargets(getPluginOwnedConfigPathEntries(pathTokens, true), "targetType").get(candidate.type));
}
function resolvePlanTargetAgainstEntries(candidate, entries) {
	if (!entries || entries.length === 0) return null;
	const pathTokens = candidate.pathTokens ?? candidate.pathSegments;
	for (const entry of entries) {
		if (!entry.includeInPlan) continue;
		const matched = matchPathTokens(pathTokens, entry.pathTokens, { allowLegacyArrayString: candidate.allowLegacyArrayString });
		if (!matched) continue;
		const resolved = toResolvedPlanTarget(entry, matched.captures);
		if (!resolved) continue;
		if (candidate.providerId && candidate.providerId.trim().length > 0) {
			if (!resolved.providerId || resolved.providerId !== candidate.providerId) continue;
		}
		if (candidate.accountId && candidate.accountId.trim().length > 0) {
			if (!resolved.accountId || resolved.accountId !== candidate.accountId) continue;
		}
		return resolved;
	}
	return null;
}
/**
* Resolves a plan-capable secret target by owning config document and concrete path.
*/
function resolveSecretPlanTargetByPathCore(params) {
	if (params.configFile === "openclaw.json") return resolveConfigSecretTargetByPath(params.pathSegments, params.pathTokens);
	return resolvePlanTargetAgainstEntries({
		pathSegments: params.pathSegments,
		pathTokens: params.pathTokens
	}, getCompiledCoreSecretTargetRegistryState().authProfilesCompiledSecretTargets);
}
function resolveConfigSecretTargetByPath(pathSegments, pathTokens = pathSegments) {
	const candidate = {
		pathSegments,
		pathTokens
	};
	const coreTarget = resolvePlanTargetAgainstEntries(candidate, getCompiledCoreSecretTargetRegistryState().openClawCompiledSecretTargets);
	if (coreTarget) return coreTarget;
	return resolvePlanTargetAgainstEntries(candidate, getPluginOwnedConfigPathEntries(pathTokens)) ?? resolvePlanTargetAgainstEntries(candidate, getPluginOwnedConfigPathEntries(pathTokens, true));
}
function discoverConfigSecretTargets(config, options = {}) {
	return discoverConfigSecretTargetsByIds(config, void 0, options);
}
function discoverConfigSecretTargetsByIds(config, targetIds, options = {}) {
	const env = options.env ?? process.env;
	const allowedTargetIds = normalizeAllowedTargetIds(targetIds);
	const coreState = getCompiledCoreSecretTargetRegistryState();
	const hasPluginEntries = configHasPluginEntries(config);
	const canUseCoreTargets = !hasPluginEntries && Object.keys(config.channels ?? {}).length === 0 || allowedTargetIds !== null && Array.from(allowedTargetIds).every((targetId) => coreState.knownTargetIds.has(targetId));
	const configuredChannelEntries = !options.manifestRegistry && !canUseCoreTargets && !hasPluginEntries ? getConfiguredChannelOpenClawTargets(config, env) : null;
	const configuredEntries = canUseCoreTargets ? coreState.openClawCompiledSecretTargets : configuredChannelEntries ? [...coreState.openClawCompiledSecretTargets, ...configuredChannelEntries] : null;
	const configuredEntriesById = configuredEntries ? indexSecretTargets(configuredEntries, "id") : null;
	const registryState = configuredEntries !== null && (canUseCoreTargets || allowedTargetIds === null || Array.from(allowedTargetIds).every((targetId) => configuredEntriesById?.has(targetId))) ? null : getConfiguredSecretTargetRegistryState(config, env, options.manifestRegistry);
	return discoverSecretTargetsFromEntries(config, resolveDiscoveryEntries({
		allowedTargetIds,
		defaultEntries: registryState?.openClawCompiledSecretTargets ?? configuredEntries ?? [],
		entriesById: registryState?.openClawTargetsById ?? configuredEntriesById ?? /* @__PURE__ */ new Map()
	}));
}
function discoverAuthProfileSecretTargets(store, targetIds) {
	const allowedTargetIds = normalizeAllowedTargetIds(targetIds);
	const registryState = getCompiledCoreSecretTargetRegistryState();
	return discoverSecretTargetsFromEntries(store, resolveDiscoveryEntries({
		allowedTargetIds,
		defaultEntries: registryState.authProfilesCompiledSecretTargets,
		entriesById: registryState.authProfilesTargetsById
	}));
}
function listAuthProfileSecretTargetEntries() {
	return getCoreSecretTargetRegistry().filter((entry) => entry.configFile === "auth-profile-store" && entry.includeInAudit);
}
//#endregion
export { isKnownSecretTargetId as a, resolveConfigSecretTargetByPath as c, PROVIDER_REQUEST_SECRET_FIELD_GROUPS as d, loadChannelSecretContractApi as f, isKnownCoreSecretTargetId as i, resolvePlanTargetAgainstRegistry as l, discoverConfigSecretTargets as n, listAuthProfileSecretTargetEntries as o, discoverConfigSecretTargetsByIds as r, listSecretTargetRegistryEntries as s, discoverAuthProfileSecretTargets as t, resolveSecretPlanTargetByPathCore as u };
