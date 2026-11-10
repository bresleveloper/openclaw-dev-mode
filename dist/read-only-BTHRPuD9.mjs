import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { v as sortUniqueStrings, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { T as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { i as preparePluginModule } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { c as listConfiguredChannelIdsForReadOnlyScope, h as resolveDiscoverableScopedChannelPluginIds, l as listConfiguredChannelIdsForReadOnlyScopeAsync, r as hasExplicitChannelConfig } from "./channel-presence-policy-hdzky3AO.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-B4MiOXOl.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-CEh6W_x7.mjs";
import { r as listChannelPlugins } from "./registry-B91r5qN6.mjs";
import { a as resolveSetupChannelRegistration, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-_ipy9Zx8.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { o as resolveListedDefaultAccountId } from "./account-helpers-Bj9HVUkM.mjs";
import { n as normalizeChannelCommandDefaults, r as readOwnRecordValue, t as isSafeManifestChannelId } from "./read-only-command-defaults-DTTH9glF.mjs";
//#region src/channels/plugins/setup-entry-loader.ts
const log = createSubsystemLogger("channels");
function loadSetupChannelPluginFromManifestRecord(params) {
	if (!params.record.setupSource || !params.record.channels.includes(params.channelId)) return {};
	try {
		const { modulePath } = preparePluginModule({
			modulePath: params.record.setupSource,
			boundaryRoot: params.record.rootDir,
			boundaryLabel: "plugin root",
			surfaceLabel: `channel setup entry ${params.record.id}`,
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: params.record.origin,
				rootDir: params.record.rootDir,
				env: params.env
			})
		});
		const moduleLoader = getPluginSetupModuleLoader(params.record, modulePath, params.record.rootDir);
		return moduleLoader.initialize(() => {
			const registration = resolveSetupChannelRegistration(moduleLoader(modulePath));
			if ("loadError" in registration) throw registration.loadError;
			if (!registration.plugin || !channelPluginIdBelongsToManifest({
				channelId: registration.plugin.id,
				pluginId: params.record.id,
				manifestChannels: params.record.channels
			})) return {};
			return { plugin: registration.plugin };
		});
	} catch (error) {
		const detail = formatErrorMessage(error);
		log.warn(`[channels] failed to load channel setup ${params.record.id}: ${detail}`);
		return { failure: {
			channelId: params.channelId,
			pluginId: params.record.id,
			source: params.record.setupSource,
			message: `failed to load setup entry: ${detail}`
		} };
	}
}
//#endregion
//#region src/channels/plugins/read-only.ts
function addChannelPlugins(byId, plugins, options) {
	for (const plugin of plugins) {
		if (!plugin) continue;
		if (options?.allowOverwrite === false && byId.has(plugin.id)) continue;
		byId.set(plugin.id, plugin);
	}
}
function normalizeManifestText(value, fallback) {
	return sanitizeForLog(value?.trim() || fallback).trim();
}
function rebindChannelConfig(cfg, sourceChannelId, targetChannelId) {
	if (sourceChannelId === targetChannelId || !cfg.channels) return cfg;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[sourceChannelId]: cfg.channels[targetChannelId]
		}
	};
}
function restoreReboundChannelConfig(params) {
	if (params.sourceChannelId === params.targetChannelId || !params.updated.channels) return params.updated;
	const nextChannels = { ...params.updated.channels };
	if (Object.hasOwn(nextChannels, params.sourceChannelId)) nextChannels[params.targetChannelId] = nextChannels[params.sourceChannelId];
	else delete nextChannels[params.targetChannelId];
	if (params.original.channels && Object.hasOwn(params.original.channels, params.sourceChannelId)) nextChannels[params.sourceChannelId] = params.original.channels[params.sourceChannelId];
	else delete nextChannels[params.sourceChannelId];
	return {
		...params.updated,
		channels: nextChannels
	};
}
function getChannelConfigRecord(cfg, channelId) {
	if (!isSafeManifestChannelId(channelId)) return {};
	const channels = asOptionalRecord(cfg.channels);
	return (channels && asOptionalRecord(readOwnRecordValue(channels, channelId))) ?? {};
}
function listManifestChannelAccountIds(cfg, channelId) {
	const accounts = getChannelConfigRecord(cfg, channelId).accounts;
	if (accounts && typeof accounts === "object" && !Array.isArray(accounts)) return sortUniqueStrings(Object.keys(accounts).filter((accountId) => !isBlockedObjectKey(accountId)).map((accountId) => normalizeOptionalAccountId(accountId)).filter((accountId) => Boolean(accountId)));
	return hasExplicitChannelConfig({
		config: cfg,
		channelId
	}) ? [DEFAULT_ACCOUNT_ID] : [];
}
function resolveManifestChannelDefaultAccountId(cfg, channelId) {
	const channelConfig = getChannelConfigRecord(cfg, channelId);
	const configuredDefaultAccountId = normalizeOptionalAccountId(typeof channelConfig.defaultAccount === "string" ? channelConfig.defaultAccount : void 0);
	return resolveListedDefaultAccountId({
		accountIds: listManifestChannelAccountIds(cfg, channelId),
		configuredDefaultAccountId
	});
}
function resolveManifestChannelAccount(params) {
	const channelConfig = getChannelConfigRecord(params.cfg, params.channelId);
	const accountId = normalizeAccountId(params.accountId);
	const accounts = asOptionalRecord(channelConfig.accounts);
	const config = asOptionalRecord(accounts ? resolveNormalizedAccountEntry(accounts, accountId, (candidateId) => normalizeOptionalAccountId(candidateId) ?? "", params.accountKeyPolicy) : void 0) ?? channelConfig;
	return {
		accountId,
		name: normalizeOptionalString(readOwnRecordValue(config, "name")),
		config
	};
}
function buildManifestChannelPlugin(params) {
	const adapters = getPluginCache().metadata.channelAdapters;
	let channels = adapters.get(params.record);
	if (!channels) {
		channels = /* @__PURE__ */ new Map();
		adapters.set(params.record, channels);
	}
	if (!channels.has(params.channelId)) channels.set(params.channelId, createManifestChannelPlugin(params));
	return channels.get(params.channelId);
}
function createManifestChannelPlugin(params) {
	if (!isSafeManifestChannelId(params.channelId)) return;
	const packageChannel = params.record.packageChannel?.id === params.channelId ? params.record.packageChannel : void 0;
	const catalogMeta = params.record.channelCatalogMeta?.id === params.channelId ? params.record.channelCatalogMeta : void 0;
	const channelConfig = asOptionalRecord(params.record.channelConfigs ? readOwnRecordValue(params.record.channelConfigs, params.channelId) : void 0);
	if (!catalogMeta && !channelConfig && !params.record.channels.includes(params.channelId)) return;
	const label = normalizeManifestText(channelConfig?.label ?? catalogMeta?.label, params.record.name || params.channelId) || params.channelId;
	const blurb = normalizeManifestText(channelConfig?.description ?? catalogMeta?.blurb, params.record.description || "");
	const detailLabel = normalizeManifestText(packageChannel?.detailLabel, "");
	const systemImage = normalizeManifestText(packageChannel?.systemImage, "");
	const commands = normalizeChannelCommandDefaults(channelConfig?.commands ?? catalogMeta?.commands);
	return {
		id: params.channelId,
		meta: {
			id: params.channelId,
			label,
			selectionLabel: normalizeManifestText(packageChannel?.selectionLabel, label) || label,
			...detailLabel ? { detailLabel } : {},
			...systemImage ? { systemImage } : {},
			docsPath: `/channels/${encodeURIComponent(params.channelId)}`,
			blurb,
			...channelConfig?.preferOver?.length ? { preferOver: channelConfig.preferOver } : catalogMeta?.preferOver?.length ? { preferOver: catalogMeta.preferOver } : {}
		},
		capabilities: { chatTypes: ["direct"] },
		...commands ? { commands } : {},
		...channelConfig ? { configSchema: {
			schema: channelConfig.schema,
			...channelConfig.uiHints ? { uiHints: channelConfig.uiHints } : {},
			...channelConfig.runtime ? { runtime: channelConfig.runtime } : {}
		} } : {},
		config: {
			listAccountIds: (cfg) => listManifestChannelAccountIds(cfg, params.channelId),
			defaultAccountId: (cfg) => resolveManifestChannelDefaultAccountId(cfg, params.channelId),
			resolveAccount: (cfg, accountId) => resolveManifestChannelAccount({
				cfg,
				channelId: params.channelId,
				accountId,
				accountKeyPolicy: params.record.channelAccountKeyPolicies?.[params.channelId]
			}),
			isEnabled: (account, cfg) => getChannelConfigRecord(cfg, params.channelId).enabled !== false && account.config.enabled !== false,
			isConfigured: (_account, cfg) => hasExplicitChannelConfig({
				config: cfg,
				channelId: params.channelId
			}),
			hasConfiguredState: ({ cfg }) => hasExplicitChannelConfig({
				config: cfg,
				channelId: params.channelId
			})
		}
	};
}
function canUseManifestChannelPlugin(record, channelId) {
	if (Boolean(record.channelConfigs && Object.hasOwn(record.channelConfigs, channelId))) return record.setup?.requiresRuntime === false || !record.setupSource;
	return record.channelCatalogMeta?.id === channelId || !record.setupSource;
}
function rebindChannelPluginConfig(config, sourceChannelId, targetChannelId) {
	const rebind = (cfg) => rebindChannelConfig(cfg, sourceChannelId, targetChannelId);
	function withConfig(method) {
		return method && ((cfg, ...args) => method.call(config, rebind(cfg), ...args));
	}
	const withAccount = (method) => method && ((account, cfg) => method.call(config, account, rebind(cfg)));
	const withParams = (method) => method && ((params) => method.call(config, {
		...params,
		cfg: rebind(params.cfg)
	}));
	const rebindWriter = (method) => method ? (params) => restoreReboundChannelConfig({
		original: params.cfg,
		updated: method.call(config, {
			...params,
			cfg: rebind(params.cfg)
		}),
		sourceChannelId,
		targetChannelId
	}) : void 0;
	return {
		...config,
		listAccountIds: withConfig(config.listAccountIds),
		resolveAccount: withConfig(config.resolveAccount),
		resolveAccountAsync: withConfig(config.resolveAccountAsync),
		inspectAccount: withConfig(config.inspectAccount),
		defaultAccountId: withConfig(config.defaultAccountId),
		setAccountEnabled: rebindWriter(config.setAccountEnabled),
		deleteAccount: rebindWriter(config.deleteAccount),
		isEnabled: withAccount(config.isEnabled),
		disabledReason: withAccount(config.disabledReason),
		isConfigured: withAccount(config.isConfigured),
		isLinked: withAccount(config.isLinked),
		unconfiguredReason: withAccount(config.unconfiguredReason),
		unlinkedReason: withAccount(config.unlinkedReason),
		describeAccount: withAccount(config.describeAccount),
		describeAccountAsync: withAccount(config.describeAccountAsync),
		resolveAllowFrom: withParams(config.resolveAllowFrom),
		resolveAllowFromAsync: withParams(config.resolveAllowFromAsync),
		formatAllowFrom: withParams(config.formatAllowFrom),
		hasConfiguredState: withParams(config.hasConfiguredState),
		hasConfiguredStateAsync: withParams(config.hasConfiguredStateAsync),
		hasPersistedAuthState: withParams(config.hasPersistedAuthState),
		resolveDefaultTo: withParams(config.resolveDefaultTo)
	};
}
function rebindChannelPluginSecrets(secrets, sourceChannelId, targetChannelId) {
	if (!secrets) return;
	const sourcePrefix = `channels.${sourceChannelId}`;
	const rebind = (value) => value === sourcePrefix || value.startsWith(`${sourcePrefix}.`) ? `channels.${targetChannelId}${value.slice(sourcePrefix.length)}` : value;
	return {
		...secrets,
		secretTargetRegistryEntries: secrets.secretTargetRegistryEntries?.map((entry) => ({
			...entry,
			id: rebind(entry.id),
			pathPattern: rebind(entry.pathPattern),
			...entry.refPathPattern ? { refPathPattern: rebind(entry.refPathPattern) } : {}
		})),
		unsupportedSecretRefSurfacePatterns: secrets.unsupportedSecretRefSurfacePatterns?.map(rebind),
		collectRuntimeConfigAssignments: secrets.collectRuntimeConfigAssignments ? (params) => secrets.collectRuntimeConfigAssignments?.({
			...params,
			config: rebindChannelConfig(params.config, sourceChannelId, targetChannelId)
		}) : void 0
	};
}
function cloneChannelPluginForChannelId(plugin, channelId) {
	if (plugin.id === channelId && plugin.meta.id === channelId) return plugin;
	const sourceChannelId = plugin.id;
	return {
		...plugin,
		id: channelId,
		meta: {
			...plugin.meta,
			id: channelId
		},
		config: rebindChannelPluginConfig(plugin.config, sourceChannelId, channelId),
		secrets: rebindChannelPluginSecrets(plugin.secrets, sourceChannelId, channelId)
	};
}
function addManifestChannelPlugins(byId, records, options) {
	const channelIds = new Set(options.channelIds);
	for (const record of records) {
		if (!options.pluginIds.has(record.id)) continue;
		for (const channelId of record.channels) {
			if (!isSafeManifestChannelId(channelId)) continue;
			if (!channelIds.has(channelId)) continue;
			if (options.includeSetupFallbackPlugins && !canUseManifestChannelPlugin(record, channelId)) continue;
			addChannelPlugins(byId, [buildManifestChannelPlugin({
				record,
				channelId
			})], { allowOverwrite: false });
		}
	}
}
function resolveExternalReadOnlyChannelPluginIds(params) {
	if (params.channelIds.length === 0) return [];
	const candidatePluginIds = resolveDiscoverableScopedChannelPluginIds({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		channelIds: params.channelIds,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.records
	});
	if (candidatePluginIds.length === 0) return [];
	const requestedChannelIds = new Set(params.channelIds);
	const candidatePluginIdSet = new Set(candidatePluginIds);
	return params.records.filter((plugin) => candidatePluginIdSet.has(plugin.id) && plugin.channels.some((channelId) => requestedChannelIds.has(channelId))).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function listReadOnlyChannelPluginsForConfig(cfg, options) {
	return resolveReadOnlyChannelPluginsForConfig(cfg, options).plugins;
}
function resolveReadOnlyChannelPluginsForConfig(cfg, options = {}) {
	const context = resolveReadOnlyChannelContext(cfg, options);
	return resolveReadOnlyChannelPluginsFromIds(cfg, options, context, listReadOnlyChannelConfiguredIds(cfg, options, context));
}
async function listReadOnlyChannelPluginsForConfigAsync(cfg, options) {
	return (await resolveReadOnlyChannelPluginsForConfigAsync(cfg, options)).plugins;
}
async function resolveReadOnlyChannelPluginsForConfigAsync(cfg, options = {}) {
	const context = resolveReadOnlyChannelContext(cfg, options);
	const listConfiguredIds = (config) => listConfiguredChannelIdsForReadOnlyScopeAsync({
		config,
		...context,
		includePersistedAuthState: options.includePersistedAuthState
	});
	return resolveReadOnlyChannelPluginsFromIds(cfg, options, context, uniqueStrings([...await listConfiguredIds(cfg), ...context.activationSourceConfig === cfg ? [] : await listConfiguredIds(context.activationSourceConfig)]).filter(isSafeManifestChannelId));
}
function resolveReadOnlyChannelContext(cfg, options) {
	const env = options.env ?? process.env;
	return {
		env,
		workspaceDir: options.workspaceDir ?? tryResolveConfiguredAgentWorkspaceDir(cfg, options.env),
		manifestRecords: options.metadataSnapshot?.plugins ?? (options.workspaceDir !== void 0 ? resolvePluginMetadataSnapshot({
			config: cfg,
			stateDir: options.stateDir,
			workspaceDir: options.workspaceDir,
			env,
			allowWorkspaceScopedCurrent: true
		}).plugins : resolveConfigWidePluginManifestRegistry({
			config: cfg,
			stateDir: options.stateDir,
			env
		}).plugins),
		activationSourceConfig: options.activationSourceConfig ?? cfg
	};
}
function listReadOnlyChannelConfiguredIds(cfg, options, context) {
	const { activationSourceConfig, workspaceDir, env, manifestRecords } = context;
	const listConfiguredIds = (config) => listConfiguredChannelIdsForReadOnlyScope({
		config,
		activationSourceConfig,
		workspaceDir,
		env,
		includePersistedAuthState: options.includePersistedAuthState,
		manifestRecords
	});
	return uniqueStrings([...listConfiguredIds(cfg), ...activationSourceConfig === cfg ? [] : listConfiguredIds(activationSourceConfig)]).filter(isSafeManifestChannelId);
}
function resolveReadOnlyChannelPluginsFromIds(cfg, options, context, configuredChannelIds) {
	const { activationSourceConfig, workspaceDir, env, manifestRecords } = context;
	const includeSetupFallbackPlugins = options.includeSetupFallbackPlugins === true;
	const loadedChannelPlugins = listChannelPlugins();
	const bundledManifestRecords = manifestRecords.filter((plugin) => plugin.origin === "bundled" && plugin.channels.length > 0);
	const externalManifestRecords = manifestRecords.filter((plugin) => plugin.origin !== "bundled" && plugin.channels.length > 0);
	const byId = /* @__PURE__ */ new Map();
	const loadFailures = [];
	addChannelPlugins(byId, loadedChannelPlugins);
	if (includeSetupFallbackPlugins) for (const channelId of configuredChannelIds) {
		if (byId.has(channelId)) continue;
		const setupResults = bundledManifestRecords.filter((record) => record.channels.includes(channelId)).map((record) => loadSetupChannelPluginFromManifestRecord({
			record,
			channelId,
			env
		}));
		loadFailures.push(...setupResults.map((result) => result.failure).filter((failure) => Boolean(failure)));
		const bundledSetupPlugin = setupResults.map((result) => result.plugin).find((plugin) => plugin) ?? getBundledChannelSetupPlugin(channelId, env);
		addChannelPlugins(byId, [bundledSetupPlugin && cloneChannelPluginForChannelId(bundledSetupPlugin, channelId)]);
	}
	const bundledManifestMissingChannelIds = configuredChannelIds.filter((channelId) => !byId.has(channelId));
	addManifestChannelPlugins(byId, bundledManifestRecords, {
		pluginIds: new Set(bundledManifestRecords.map((record) => record.id)),
		channelIds: bundledManifestMissingChannelIds,
		includeSetupFallbackPlugins
	});
	const missingConfiguredChannelIds = configuredChannelIds.filter((channelId) => !byId.has(channelId));
	const externalPluginIds = resolveExternalReadOnlyChannelPluginIds({
		cfg,
		activationSourceConfig,
		channelIds: missingConfiguredChannelIds,
		records: externalManifestRecords,
		workspaceDir,
		env
	});
	if (externalPluginIds.length > 0) {
		const externalPluginIdSet = new Set(externalPluginIds);
		if (includeSetupFallbackPlugins) {
			const missingChannelIdSet = new Set(missingConfiguredChannelIds);
			for (const record of externalManifestRecords) {
				if (!externalPluginIdSet.has(record.id) || !record.setupSource) continue;
				const ownedMissingChannelIds = record.channels.filter((channelId) => missingChannelIdSet.has(channelId) && !byId.has(channelId));
				const firstChannelId = ownedMissingChannelIds[0];
				if (!firstChannelId) continue;
				const setupResult = loadSetupChannelPluginFromManifestRecord({
					record,
					channelId: firstChannelId,
					env
				});
				const failure = setupResult.failure;
				if (failure) {
					loadFailures.push(...ownedMissingChannelIds.map((channelId) => ({
						...failure,
						channelId
					})));
					continue;
				}
				const plugin = setupResult.plugin;
				if (plugin) addChannelPlugins(byId, ownedMissingChannelIds.map((channelId) => cloneChannelPluginForChannelId(plugin, channelId)), { allowOverwrite: false });
			}
		}
		addManifestChannelPlugins(byId, externalManifestRecords, {
			pluginIds: externalPluginIdSet,
			channelIds: missingConfiguredChannelIds.filter((channelId) => !byId.has(channelId)),
			includeSetupFallbackPlugins
		});
	}
	return {
		plugins: [...byId.values()],
		manifestRecords: [...manifestRecords],
		configuredChannelIds,
		missingConfiguredChannelIds: configuredChannelIds.filter((channelId) => !byId.has(channelId)),
		loadFailures
	};
}
//#endregion
export { loadSetupChannelPluginFromManifestRecord as i, listReadOnlyChannelPluginsForConfigAsync as n, resolveReadOnlyChannelPluginsForConfig as r, listReadOnlyChannelPluginsForConfig as t };
