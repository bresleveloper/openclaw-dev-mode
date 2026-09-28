import { l as getPluginCacheRoot } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { n as formatConcreteConfigPath, t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { n as getOfficialExternalChannelSecretContract, s as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
import { i as parseDotPath } from "./shared-BUXrUFz5.mjs";
import { c as isEnabledFlag, r as collectSecretInputAssignment, s as isChannelAccountEffectivelyEnabled } from "./runtime-shared-Bpp2PLaL.mjs";
import { a as createChannelSecretTargetRegistryEntries, i as createChannelAccountSecretOwner, s as getChannelRecord } from "./channel-secret-basic-runtime-Bi__ggHZ.mjs";
import { n as getPath } from "./path-utils-C3EgzLrx.mjs";
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
				collectSecretInputAssignment({
					value: channel[field.field],
					path: `channels.${contract.channelId}.${field.field}`,
					expected: "string",
					defaults,
					context,
					active: isEnabledFlag(channel) && hasActivationValue({
						record: channel,
						activationField: field.activationField,
						activationEnv: field.activationEnv,
						env: context.env,
						allowEnv: true
					}),
					inactiveReason: `external channel is disabled or ${field.activationField ?? "its credential surface"} is not configured.`,
					owner: createChannelAccountSecretOwner(contract.channelId, "default", channel, defaultAccount, defaultAccount),
					apply: (value) => {
						channel[field.field] = value;
					}
				});
				const accounts = isRecord(channel.accounts) ? channel.accounts : void 0;
				if (!accounts) continue;
				for (const [accountId, accountValue] of Object.entries(accounts)) {
					const account = isRecord(accountValue) ? accountValue : void 0;
					if (!account || !Object.hasOwn(account, field.field)) continue;
					collectSecretInputAssignment({
						value: account[field.field],
						path: `${appendConfigPathSegment(`channels.${contract.channelId}.accounts`, accountId)}.${field.field}`,
						expected: "string",
						defaults,
						context,
						active: isChannelAccountEffectivelyEnabled(channel, account) && hasActivationValue({
							record: account,
							activationField: field.activationField,
							activationEnv: field.activationEnv,
							env: context.env,
							allowEnv: false
						}),
						inactiveReason: `external channel account is disabled or ${field.activationField ?? "its credential surface"} is not configured.`,
						owner: createChannelAccountSecretOwner(contract.channelId, accountId, channel, account, {
							channel: sharedChannel,
							account
						}),
						apply: (value) => {
							account[field.field] = value;
						}
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
/** Loads a bundled channel secret contract from its public artifact bundle. */
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
function loadPluginContractModule(modulePath) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url
	})(modulePath);
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
		const mod = loadPluginContractModule(validated.modulePath);
		if (mod.collectRuntimeConfigAssignments || mod.secretTargetRegistryEntries) return mod;
	} catch (error) {
		if (throwOnLoadError) throw error;
		if (process.env.OPENCLAW_DEBUG_CHANNEL_CONTRACT_API === "1") {
			const detail = error instanceof Error ? error.message : String(error);
			console.warn(`[channel-contract-api] failed to load ${record.id} contract ${validated.modulePath}: ${detail}`);
		}
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
/** Loads the first channel secret contract for a channel, preferring bundled metadata. */
/** Loads a channel secret contract API for a channel id and current plugin origin policy. */
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
/** Loads a channel secret contract directly from a manifest record. */
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
function createPluginOpenClawConfigSecretTargetEntry(pluginId, configPath) {
	const pluginConfigPath = [
		"plugins",
		"entries",
		pluginId,
		"config"
	];
	const pathPatternSegments = [...pluginConfigPath, ...parseDotPath(configPath)];
	const pathPattern = `${formatConcreteConfigPath(pluginConfigPath)}.${configPath}`;
	return {
		id: pathPattern,
		targetType: pathPattern,
		configFile: "openclaw.json",
		pathPattern,
		pathPatternSegments,
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	};
}
function hasSensitiveConfigHint(plugin, configPath) {
	return plugin.configUiHints?.[configPath]?.sensitive === true;
}
function hasWebProviderContract(plugin, contract) {
	return (plugin.contracts?.[contract]?.length ?? 0) > 0;
}
function listPluginWebProviderSecretTargetRegistryEntries(plugins) {
	const entries = [];
	for (const record of plugins) for (const config of WEB_PROVIDER_SECRET_CONFIGS) if (hasWebProviderContract(record, config.contract) && hasSensitiveConfigHint(record, config.configPath)) entries.push(createPluginOpenClawConfigSecretTargetEntry(record.id, config.configPath));
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
	{
		id: "auth-profiles.api_key.key",
		targetType: "auth-profiles.api_key.key",
		configFile: "auth-profile-store",
		pathPattern: "profiles.*.key",
		refPathPattern: "profiles.*.keyRef",
		secretShape: SIBLING_REF_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		authProfileType: "api_key"
	},
	{
		id: "auth-profiles.token.token",
		targetType: "auth-profiles.token.token",
		configFile: "auth-profile-store",
		pathPattern: "profiles.*.token",
		refPathPattern: "profiles.*.tokenRef",
		secretShape: SIBLING_REF_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		authProfileType: "token"
	},
	{
		id: "memory.search.remote.apiKey",
		targetType: "memory.search.remote.apiKey",
		configFile: "openclaw.json",
		pathPattern: "memory.search.remote.apiKey",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "agents.entries.*.memory.search.remote.apiKey",
		targetType: "agents.entries.*.memory.search.remote.apiKey",
		configFile: "openclaw.json",
		pathPattern: "agents.entries.*.memory.search.remote.apiKey",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "cron.webhookToken",
		targetType: "cron.webhookToken",
		configFile: "openclaw.json",
		pathPattern: "cron.webhookToken",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "gateway.auth.token",
		targetType: "gateway.auth.token",
		configFile: "openclaw.json",
		pathPattern: "gateway.auth.token",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "gateway.auth.password",
		targetType: "gateway.auth.password",
		configFile: "openclaw.json",
		pathPattern: "gateway.auth.password",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "gateway.remote.password",
		targetType: "gateway.remote.password",
		configFile: "openclaw.json",
		pathPattern: "gateway.remote.password",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "gateway.remote.token",
		targetType: "gateway.remote.token",
		configFile: "openclaw.json",
		pathPattern: "gateway.remote.token",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	...["tts", "agents.entries.*.tts"].flatMap((prefix) => ["providers.*", "personas.*.providers.*"].map((providerPath) => {
		const path = `${prefix}.${providerPath}.apiKey`;
		return {
			id: path,
			targetType: path,
			configFile: "openclaw.json",
			pathPattern: path,
			secretShape: SECRET_INPUT_SHAPE,
			expectedResolvedValue: "string",
			includeInPlan: true,
			includeInConfigure: prefix === "tts",
			includeInAudit: true,
			providerIdPathSegmentIndex: path.split(".").length - 2
		};
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
		const entry = {
			id: pathPattern,
			targetType: pathPattern.split(".").filter((segment) => segment !== "*").join("."),
			targetTypeAliases: [pathPattern],
			configFile: "openclaw.json",
			pathPattern,
			secretShape: SECRET_INPUT_SHAPE,
			expectedResolvedValue: "string",
			includeInPlan: true,
			includeInConfigure: true,
			includeInAudit: true,
			providerIdPathSegmentIndex: 2
		};
		if (suffix === "apiKey") entry.trackProviderShadowing = true;
		return entry;
	}),
	{
		id: "skills.entries.*.apiKey",
		targetType: "skills.entries.apiKey",
		targetTypeAliases: ["skills.entries.*.apiKey"],
		configFile: "openclaw.json",
		pathPattern: "skills.entries.*.apiKey",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "talk.providers.*.apiKey",
		targetType: "talk.providers.*.apiKey",
		configFile: "openclaw.json",
		pathPattern: "talk.providers.*.apiKey",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		providerIdPathSegmentIndex: 2
	},
	{
		id: "talk.realtime.providers.*.apiKey",
		targetType: "talk.realtime.providers.*.apiKey",
		configFile: "openclaw.json",
		pathPattern: "talk.realtime.providers.*.apiKey",
		secretShape: SECRET_INPUT_SHAPE,
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		providerIdPathSegmentIndex: 3
	}
];
let cachedSecretTargetRegistry = null;
function loadSecretTargetRegistryFromPluginMetadata(params) {
	const plugins = resolvePluginMetadataSnapshot({
		...params.config !== void 0 ? { config: params.config } : {},
		env: params.env,
		allowWorkspaceScopedCurrent: true,
		...params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {}
	}).plugins;
	return buildSecretTargetRegistryFromPlugins(plugins, params);
}
/** Builds secret targets from one exact manifest-registry plugin set. */
function buildSecretTargetRegistryFromPlugins(plugins, options) {
	const channelPlugins = plugins.filter((record) => record.channels.length > 0 || Object.keys(record.channelConfigs ?? {}).length > 0 || Boolean(record.channelCatalogMeta?.id) || Boolean(record.packageChannel?.id));
	const entries = [
		...CORE_SECRET_TARGET_REGISTRY,
		...listPluginWebProviderSecretTargetRegistryEntries(plugins),
		...listPluginConfigSecretTargetRegistryEntries(plugins),
		...listChannelSecretTargetRegistryEntries(channelPlugins, options?.throwOnLoadError),
		...listOfficialExternalChannelSecretTargetRegistryEntries()
	];
	const seen = /* @__PURE__ */ new Set();
	return entries.filter((entry) => {
		const key = `${entry.configFile}:${entry.pathPattern}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
/** Returns only core-owned secret target registry entries. */
/** Returns static core secret target registry entries without plugin-derived targets. */
function getCoreSecretTargetRegistry() {
	return CORE_SECRET_TARGET_REGISTRY;
}
/** Returns the process-cached registry including bundled plugin/channel metadata. */
/** Returns core plus plugin/channel secret target registry entries for the current metadata view. */
function getSecretTargetRegistry(params) {
	if (params?.sourceTree) return loadSecretTargetRegistryFromPluginMetadata({
		env: {
			...process.env,
			OPENCLAW_BUNDLED_PLUGINS_DIR: process.env.OPENCLAW_BUNDLED_PLUGINS_DIR ?? "extensions"
		},
		preferPersisted: false,
		throwOnLoadError: true
	});
	if (params?.config) return loadSecretTargetRegistryFromPluginMetadata({
		config: params.config,
		env: params.env ?? process.env
	});
	if (cachedSecretTargetRegistry) return cachedSecretTargetRegistry;
	cachedSecretTargetRegistry = loadSecretTargetRegistryFromPluginMetadata({ env: process.env });
	return cachedSecretTargetRegistry;
}
//#endregion
//#region src/secrets/target-registry-pattern.ts
function countDynamicPatternTokens(tokens) {
	return tokens.filter((token) => token.kind === "wildcard" || token.kind === "array").length;
}
/**
* Parses a dotted target pattern into literal, wildcard, and array traversal tokens.
*/
function parsePathPattern(pathPattern, pathSegments) {
	return (pathSegments ?? parseDotPath(pathPattern)).map((segment) => {
		if (segment === "*") return { kind: "wildcard" };
		if (segment.endsWith("[]")) {
			const field = segment.slice(0, -2).trim();
			if (!field) throw new Error(`Invalid target path pattern: ${pathPattern}`);
			return {
				kind: "array",
				field
			};
		}
		return {
			kind: "literal",
			value: segment
		};
	});
}
/**
* Compiles a registry entry and verifies its value path/ref path wildcard shape matches.
*/
function compileTargetRegistryEntry(entry) {
	const pathTokens = parsePathPattern(entry.pathPattern, entry.pathPatternSegments);
	const pathDynamicTokenCount = countDynamicPatternTokens(pathTokens);
	const refPathTokens = entry.refPathPattern ? parsePathPattern(entry.refPathPattern) : void 0;
	const refPathDynamicTokenCount = refPathTokens ? countDynamicPatternTokens(refPathTokens) : 0;
	if (entry.secretShape === "sibling_ref" && !refPathTokens) throw new Error(`Missing refPathPattern for sibling_ref target: ${entry.id}`);
	if (refPathTokens && refPathDynamicTokenCount !== pathDynamicTokenCount) throw new Error(`Mismatched wildcard shape for target ref path: ${entry.id}`);
	return {
		...entry,
		pathTokens,
		pathDynamicTokenCount,
		refPathTokens,
		refPathDynamicTokenCount
	};
}
/**
* Matches concrete path segments against compiled pattern tokens and returns dynamic captures.
*/
function matchPathTokens(segments, tokens, options) {
	const captures = [];
	let index = 0;
	for (const token of tokens) {
		if (token.kind === "literal") {
			if (typeof segments[index] !== "string" || segments[index] !== token.value) return null;
			index += 1;
			continue;
		}
		if (token.kind === "wildcard") {
			const value = segments[index];
			if (value === void 0 || value === "") return null;
			captures.push(value);
			index += 1;
			continue;
		}
		if (segments[index] !== token.field) return null;
		const next = segments[index + 1];
		const arrayIndex = typeof next === "number" ? next : options?.allowLegacyArrayString && typeof next === "string" ? parseConfigPathArrayIndex(next) : void 0;
		if (arrayIndex === void 0 || parseConfigPathArrayIndex(String(arrayIndex)) !== arrayIndex) return null;
		captures.push(arrayIndex);
		index += 2;
	}
	return index === segments.length ? { captures } : null;
}
/**
* Rebuilds a concrete path from tokens and captures produced by matchPathTokens/expandPathTokens.
*/
function materializePathTokens(tokens, captures) {
	const out = [];
	let captureIndex = 0;
	for (const token of tokens) {
		if (token.kind === "literal") {
			out.push(token.value);
			continue;
		}
		if (token.kind === "wildcard") {
			const value = captures[captureIndex];
			if (value === void 0 || value === "") return null;
			out.push(value);
			captureIndex += 1;
			continue;
		}
		const arrayIndex = captures[captureIndex];
		if (typeof arrayIndex !== "number" || parseConfigPathArrayIndex(String(arrayIndex)) !== arrayIndex) return null;
		out.push(token.field, arrayIndex);
		captureIndex += 1;
	}
	return captureIndex === captures.length ? out : null;
}
/**
* Expands a pattern across a config object and returns every matching value with captures.
*/
function expandPathTokens(root, tokens) {
	const out = [];
	const walk = (node, tokenIndex, segments, captures) => {
		const token = tokens[tokenIndex];
		if (!token) {
			out.push({
				segments,
				captures,
				value: node
			});
			return;
		}
		const isLeaf = tokenIndex === tokens.length - 1;
		if (token.kind === "literal") {
			if (!isRecord(node)) return;
			if (isLeaf) {
				out.push({
					segments: [...segments, token.value],
					captures,
					value: node[token.value]
				});
				return;
			}
			if (!Object.hasOwn(node, token.value)) return;
			walk(node[token.value], tokenIndex + 1, [...segments, token.value], captures);
			return;
		}
		if (token.kind === "wildcard") {
			if (!Array.isArray(node) && !isRecord(node)) return;
			const entries = Array.isArray(node) ? node.entries() : Object.entries(node);
			for (const [key, value] of entries) {
				if (isLeaf) {
					out.push({
						segments: [...segments, key],
						captures: [...captures, key],
						value
					});
					continue;
				}
				walk(value, tokenIndex + 1, [...segments, key], [...captures, key]);
			}
			return;
		}
		if (!isRecord(node)) return;
		const items = node[token.field];
		if (!Array.isArray(items)) return;
		for (let index = 0; index < items.length; index += 1) {
			const item = items[index];
			if (isLeaf) {
				out.push({
					segments: [
						...segments,
						token.field,
						index
					],
					captures: [...captures, index],
					value: item
				});
				continue;
			}
			walk(item, tokenIndex + 1, [
				...segments,
				token.field,
				index
			], [...captures, index]);
		}
	};
	walk(root, 0, [], []);
	return out;
}
//#endregion
//#region src/secrets/target-registry-query.ts
let compiledSecretTargetRegistryState = null;
let compiledCoreOpenClawTargetState = null;
let compiledCoreAuthProfileTargetState = null;
const compiledChannelOpenClawTargets = /* @__PURE__ */ new Map();
function buildTargetTypeIndex(compiledSecretTargetRegistry) {
	const byType = /* @__PURE__ */ new Map();
	const append = (type, entry) => {
		const existing = byType.get(type);
		if (existing) {
			existing.push(entry);
			return;
		}
		byType.set(type, [entry]);
	};
	for (const entry of compiledSecretTargetRegistry) {
		append(entry.targetType, entry);
		for (const alias of entry.targetTypeAliases ?? []) append(alias, entry);
	}
	return byType;
}
function buildConfigTargetIdIndex(entries) {
	const byId = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const existing = byId.get(entry.id);
		if (existing) {
			existing.push(entry);
			continue;
		}
		byId.set(entry.id, [entry]);
	}
	return byId;
}
function compileSecretTargetRegistryState(registry) {
	const compiledSecretTargetRegistry = registry.map(compileTargetRegistryEntry);
	const openClawCompiledSecretTargets = compiledSecretTargetRegistry.filter((entry) => entry.configFile === "openclaw.json");
	const authProfilesCompiledSecretTargets = compiledSecretTargetRegistry.filter((entry) => entry.configFile === "auth-profile-store");
	return {
		authProfilesCompiledSecretTargets,
		authProfilesTargetsById: buildConfigTargetIdIndex(authProfilesCompiledSecretTargets),
		compiledSecretTargetRegistry,
		knownTargetIds: new Set(compiledSecretTargetRegistry.map((entry) => entry.id)),
		openClawCompiledSecretTargets,
		openClawTargetsById: buildConfigTargetIdIndex(openClawCompiledSecretTargets),
		targetsByType: buildTargetTypeIndex(compiledSecretTargetRegistry)
	};
}
function getCompiledSecretTargetRegistryState() {
	if (compiledSecretTargetRegistryState) return compiledSecretTargetRegistryState;
	compiledSecretTargetRegistryState = compileSecretTargetRegistryState(getSecretTargetRegistry());
	return compiledSecretTargetRegistryState;
}
function getConfiguredSecretTargetRegistryState(config, env, manifestRegistry) {
	return compileSecretTargetRegistryState(manifestRegistry ? buildSecretTargetRegistryFromPlugins(manifestRegistry.plugins) : getSecretTargetRegistry({
		config,
		env
	}));
}
function getCompiledCoreOpenClawTargetState() {
	if (compiledCoreOpenClawTargetState) return compiledCoreOpenClawTargetState;
	const compiledCoreSecretTargets = getCoreSecretTargetRegistry().map(compileTargetRegistryEntry);
	const openClawCompiledSecretTargets = compiledCoreSecretTargets.filter((entry) => entry.configFile === "openclaw.json");
	compiledCoreOpenClawTargetState = {
		knownTargetIds: new Set(compiledCoreSecretTargets.map((entry) => entry.id)),
		openClawCompiledSecretTargets,
		openClawTargetsById: buildConfigTargetIdIndex(openClawCompiledSecretTargets),
		planTargetsByType: buildTargetTypeIndex(compiledCoreSecretTargets)
	};
	return compiledCoreOpenClawTargetState;
}
function getCompiledCoreAuthProfileTargetState() {
	if (compiledCoreAuthProfileTargetState) return compiledCoreAuthProfileTargetState;
	const entries = getCoreSecretTargetRegistry().filter((entry) => entry.configFile === "auth-profile-store").map(compileTargetRegistryEntry);
	compiledCoreAuthProfileTargetState = {
		entries,
		entriesById: buildConfigTargetIdIndex(entries)
	};
	return compiledCoreAuthProfileTargetState;
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
/**
* Lists the full secrets target registry in public, serializable form.
*/
/** Lists all configured secret target registry entries. */
function listSecretTargetRegistryEntries() {
	return getCompiledSecretTargetRegistryState().compiledSecretTargetRegistry.map((entry) => Object.assign({
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
/**
* Narrows unknown input to a target id currently present in the compiled registry.
*/
function isKnownSecretTargetId(value) {
	return typeof value === "string" && getCompiledSecretTargetRegistryState().knownTargetIds.has(value);
}
/** Checks the static core registry without materializing plugin/channel contracts. */
function isKnownCoreSecretTargetId(value) {
	return typeof value === "string" && getCompiledCoreOpenClawTargetState().knownTargetIds.has(value);
}
/**
* Resolves a secrets apply-plan target against registered target type and path patterns.
*/
function resolvePlanTargetAgainstRegistry(candidate) {
	const coreEntries = getCompiledCoreOpenClawTargetState().planTargetsByType.get(candidate.type);
	if (coreEntries) return resolvePlanTargetAgainstEntries(candidate, coreEntries);
	const explicitChannelId = candidate.pathSegments[0] === "channels" ? candidate.pathSegments[1]?.trim() ?? "" : "";
	if (explicitChannelId) {
		if (/[\\/:]/.test(explicitChannelId)) return null;
		const channelTypeEntries = buildTargetTypeIndex(getCompiledChannelOpenClawTargets(explicitChannelId) ?? []).get(candidate.type);
		if (channelTypeEntries) return resolvePlanTargetAgainstEntries(candidate, channelTypeEntries);
	}
	return resolvePlanTargetAgainstEntries(candidate, getCompiledSecretTargetRegistryState().targetsByType.get(candidate.type));
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
	}, getCompiledSecretTargetRegistryState().authProfilesCompiledSecretTargets);
}
/**
* Resolves an openclaw.json config path to the matching plan-capable secrets target.
*/
function resolveConfigSecretTargetByPath(pathSegments, pathTokens = pathSegments) {
	const candidate = {
		pathSegments,
		pathTokens
	};
	const coreTarget = resolvePlanTargetAgainstEntries(candidate, getCompiledCoreOpenClawTargetState().openClawCompiledSecretTargets);
	if (coreTarget) return coreTarget;
	const explicitChannelId = pathSegments[0] === "channels" ? pathSegments[1]?.trim() ?? "" : "";
	return resolvePlanTargetAgainstEntries(candidate, (explicitChannelId ? getCompiledChannelOpenClawTargets(explicitChannelId) : null) ?? []) ?? resolvePlanTargetAgainstEntries(candidate, getCompiledSecretTargetRegistryState().openClawCompiledSecretTargets);
}
/** Discovers configured secret-bearing values in openclaw.json. */
function discoverConfigSecretTargets(config, options = {}) {
	return discoverConfigSecretTargetsByIds(config, void 0, options);
}
/**
* Discovers configured openclaw.json targets, optionally limited to selected registry ids.
*/
function discoverConfigSecretTargetsByIds(config, targetIds, options = {}) {
	const env = options.env ?? process.env;
	const allowedTargetIds = normalizeAllowedTargetIds(targetIds);
	const coreState = getCompiledCoreOpenClawTargetState();
	const hasOnlyCoreTargetIds = allowedTargetIds !== null && Array.from(allowedTargetIds).every((targetId) => coreState.knownTargetIds.has(targetId));
	const configuredChannelEntries = !options.manifestRegistry && !hasOnlyCoreTargetIds && !configHasPluginEntries(config) ? getConfiguredChannelOpenClawTargets(config, env) : null;
	const configuredEntries = hasOnlyCoreTargetIds ? coreState.openClawCompiledSecretTargets : configuredChannelEntries ? [...coreState.openClawCompiledSecretTargets, ...configuredChannelEntries] : null;
	const configuredEntriesById = configuredEntries ? buildConfigTargetIdIndex(configuredEntries) : null;
	const registryState = configuredEntries !== null && (allowedTargetIds === null || Array.from(allowedTargetIds).every((targetId) => configuredEntriesById?.has(targetId))) ? null : getConfiguredSecretTargetRegistryState(config, env, options.manifestRegistry);
	return discoverSecretTargetsFromEntries(config, resolveDiscoveryEntries({
		allowedTargetIds,
		defaultEntries: configuredEntries ?? registryState?.openClawCompiledSecretTargets ?? [],
		entriesById: configuredEntriesById ?? registryState?.openClawTargetsById ?? /* @__PURE__ */ new Map()
	}));
}
/**
* Discovers secret-bearing values in auth-profiles.json store objects.
*/
function discoverAuthProfileSecretTargets(store, targetIds) {
	const allowedTargetIds = normalizeAllowedTargetIds(targetIds);
	const registryState = getCompiledCoreAuthProfileTargetState();
	return discoverSecretTargetsFromEntries(store, resolveDiscoveryEntries({
		allowedTargetIds,
		defaultEntries: registryState.entries,
		entriesById: registryState.entriesById
	}));
}
/**
* Lists auth-profile target entries that participate in plaintext/unresolved-ref audit.
*/
function listAuthProfileSecretTargetEntries() {
	return getCoreSecretTargetRegistry().filter((entry) => entry.configFile === "auth-profile-store" && entry.includeInAudit);
}
//#endregion
export { isKnownSecretTargetId as a, resolveConfigSecretTargetByPath as c, compileTargetRegistryEntry as d, matchPathTokens as f, isKnownCoreSecretTargetId as i, resolvePlanTargetAgainstRegistry as l, loadChannelSecretContractApi as m, discoverConfigSecretTargets as n, listAuthProfileSecretTargetEntries as o, PROVIDER_REQUEST_SECRET_FIELD_GROUPS as p, discoverConfigSecretTargetsByIds as r, listSecretTargetRegistryEntries as s, discoverAuthProfileSecretTargets as t, resolveSecretPlanTargetByPathCore as u };
