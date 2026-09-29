import { o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { v as sortUniqueStrings, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { x as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { i as preparePluginModule } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-D8dZgG2d.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as resolveDiscoverableScopedChannelPluginIds, n as hasExplicitChannelConfig, o as listConfiguredChannelIdsForReadOnlyScope } from "./channel-presence-policy-C83ks5im.mjs";
import { a as resolveSetupChannelRegistration, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-gIbhbeVR.mjs";
import "./channel-plugin-ids-DiMsgxMa.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import { o as resolveListedDefaultAccountId } from "./account-helpers-DX67sux4.mjs";
import { n as normalizeChannelCommandDefaults, r as readOwnRecordValue, t as isSafeManifestChannelId } from "./read-only-command-defaults-CX1LEENG.mjs";
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
/**
* Read-only channel plugin discovery.
*
* Builds lightweight channel plugin views from config, manifests, and setup metadata.
*/
function addChannelPlugins(byId, plugins, options) {
	for (const plugin of plugins) {
		if (!plugin) continue;
		if (options?.onlyIds && !options.onlyIds.has(plugin.id)) continue;
		if (options?.allowOverwrite === false && byId.has(plugin.id)) continue;
		byId.set(plugin.id, plugin);
	}
}
function rebindChannelScopedString(value, sourceChannelId, targetChannelId) {
	const sourcePrefix = `channels.${sourceChannelId}`;
	if (value === sourcePrefix) return `channels.${targetChannelId}`;
	if (value.startsWith(`${sourcePrefix}.`)) return `channels.${targetChannelId}${value.slice(sourcePrefix.length)}`;
	return value;
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
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return {};
	const entry = readOwnRecordValue(channels, channelId);
	return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
}
function normalizeManifestAccountConfigKey(accountId) {
	return normalizeOptionalAccountId(accountId) ?? "";
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
	const config = asOptionalRecord(accounts ? resolveNormalizedAccountEntry(accounts, accountId, normalizeManifestAccountConfigKey, params.accountKeyPolicy) : void 0) ?? channelConfig;
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
	const channelConfigValue = params.record.channelConfigs ? readOwnRecordValue(params.record.channelConfigs, params.channelId) : void 0;
	if (!catalogMeta && (!channelConfigValue || typeof channelConfigValue !== "object" || Array.isArray(channelConfigValue)) && !params.record.channels.includes(params.channelId)) return;
	const channelConfig = channelConfigValue && typeof channelConfigValue === "object" && !Array.isArray(channelConfigValue) ? channelConfigValue : void 0;
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
	return {
		...config,
		listAccountIds: (cfg) => config.listAccountIds(rebind(cfg)),
		resolveAccount: (cfg, accountId) => config.resolveAccount(rebind(cfg), accountId),
		inspectAccount: config.inspectAccount ? (cfg, accountId) => config.inspectAccount?.(rebind(cfg), accountId) : void 0,
		defaultAccountId: config.defaultAccountId ? (cfg) => config.defaultAccountId?.(rebind(cfg)) ?? "" : void 0,
		setAccountEnabled: config.setAccountEnabled ? (params) => restoreReboundChannelConfig({
			original: params.cfg,
			updated: config.setAccountEnabled?.({
				...params,
				cfg: rebind(params.cfg)
			}) ?? params.cfg,
			sourceChannelId,
			targetChannelId
		}) : void 0,
		deleteAccount: config.deleteAccount ? (params) => restoreReboundChannelConfig({
			original: params.cfg,
			updated: config.deleteAccount?.({
				...params,
				cfg: rebind(params.cfg)
			}) ?? params.cfg,
			sourceChannelId,
			targetChannelId
		}) : void 0,
		isEnabled: config.isEnabled ? (account, cfg) => config.isEnabled?.(account, rebind(cfg)) ?? false : void 0,
		disabledReason: config.disabledReason ? (account, cfg) => config.disabledReason?.(account, rebind(cfg)) ?? "" : void 0,
		isConfigured: config.isConfigured ? (account, cfg) => config.isConfigured?.(account, rebind(cfg)) ?? false : void 0,
		isLinked: config.isLinked ? (account, cfg) => config.isLinked?.(account, rebind(cfg)) ?? "unknown" : void 0,
		unconfiguredReason: config.unconfiguredReason ? (account, cfg) => config.unconfiguredReason?.(account, rebind(cfg)) ?? "" : void 0,
		unlinkedReason: config.unlinkedReason ? (account, cfg) => config.unlinkedReason?.(account, rebind(cfg)) ?? "" : void 0,
		describeAccount: config.describeAccount ? (account, cfg) => config.describeAccount(account, rebind(cfg)) : void 0,
		resolveAllowFrom: config.resolveAllowFrom ? (params) => config.resolveAllowFrom?.({
			...params,
			cfg: rebind(params.cfg)
		}) : void 0,
		formatAllowFrom: config.formatAllowFrom ? (params) => config.formatAllowFrom?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? [] : void 0,
		hasConfiguredState: config.hasConfiguredState ? (params) => config.hasConfiguredState?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? false : void 0,
		hasPersistedAuthState: config.hasPersistedAuthState ? (params) => config.hasPersistedAuthState?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? false : void 0,
		resolveDefaultTo: config.resolveDefaultTo ? (params) => config.resolveDefaultTo?.({
			...params,
			cfg: rebind(params.cfg)
		}) : void 0
	};
}
function rebindChannelPluginSecrets(secrets, sourceChannelId, targetChannelId) {
	if (!secrets) return;
	return {
		...secrets,
		secretTargetRegistryEntries: secrets.secretTargetRegistryEntries?.map((entry) => ({
			...entry,
			id: rebindChannelScopedString(entry.id, sourceChannelId, targetChannelId),
			pathPattern: rebindChannelScopedString(entry.pathPattern, sourceChannelId, targetChannelId),
			...entry.refPathPattern ? { refPathPattern: rebindChannelScopedString(entry.refPathPattern, sourceChannelId, targetChannelId) } : {}
		})),
		unsupportedSecretRefSurfacePatterns: secrets.unsupportedSecretRefSurfacePatterns?.map((pattern) => rebindChannelScopedString(pattern, sourceChannelId, targetChannelId)),
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
			})], {
				onlyIds: channelIds,
				allowOverwrite: false
			});
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
	const env = options.env ?? process.env;
	const workspaceDir = options.workspaceDir ?? tryResolveConfiguredAgentWorkspaceDir(cfg, options.env);
	const includeSetupFallbackPlugins = options.includeSetupFallbackPlugins === true;
	const loadedChannelPlugins = listChannelPlugins();
	const manifestRecords = options.metadataSnapshot?.plugins ?? (options.workspaceDir !== void 0 ? resolvePluginMetadataSnapshot({
		config: cfg,
		stateDir: options.stateDir,
		workspaceDir: options.workspaceDir,
		env,
		allowWorkspaceScopedCurrent: true
	}).plugins : resolveConfigWidePluginManifestRegistry({
		config: cfg,
		stateDir: options.stateDir,
		env
	}).plugins);
	const bundledManifestRecords = manifestRecords.filter((plugin) => plugin.origin === "bundled" && plugin.channels.length > 0);
	const externalManifestRecords = manifestRecords.filter((plugin) => plugin.origin !== "bundled" && plugin.channels.length > 0);
	const activationSourceConfig = options.activationSourceConfig ?? cfg;
	const configuredChannelIds = uniqueStrings([...listConfiguredChannelIdsForReadOnlyScope({
		config: cfg,
		activationSourceConfig,
		workspaceDir,
		env,
		includePersistedAuthState: options.includePersistedAuthState,
		manifestRecords
	}), ...activationSourceConfig === cfg ? [] : listConfiguredChannelIdsForReadOnlyScope({
		config: activationSourceConfig,
		activationSourceConfig,
		workspaceDir,
		env,
		includePersistedAuthState: options.includePersistedAuthState,
		manifestRecords
	})]).filter(isSafeManifestChannelId);
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
	const bundledManifestMissingChannelIdSet = new Set(bundledManifestMissingChannelIds);
	addManifestChannelPlugins(byId, bundledManifestRecords, {
		pluginIds: new Set(bundledManifestRecords.flatMap((record) => record.channels.some((channelId) => bundledManifestMissingChannelIdSet.has(channelId)) ? [record.id] : [])),
		channelIds: bundledManifestMissingChannelIds,
		includeSetupFallbackPlugins
	});
	const missingConfiguredChannelIds = configuredChannelIds.filter((channelId) => !byId.has(channelId));
	const externalPluginIds = resolveExternalReadOnlyChannelPluginIds({
		cfg,
		activationSourceConfig: options.activationSourceConfig ?? cfg,
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
export { resolveReadOnlyChannelPluginsForConfig as n, loadSetupChannelPluginFromManifestRecord as r, listReadOnlyChannelPluginsForConfig as t };
