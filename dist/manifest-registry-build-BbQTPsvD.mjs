import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeOptionalTrimmedStringList, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as isPathInside } from "./path-safety-Cc0rrc_m.mjs";
import { c as pluginCacheLstatSync, d as readPluginCacheDirectory, f as readPluginCacheFile, l as pluginCacheRealpathSync, s as pluginCacheExistsSync, u as pluginCacheStatSync } from "./package-manifest-C8sTeZKW.mjs";
import { r as isForeignBundledPluginRoot } from "./bundled-dir-BGJkK8G5.mjs";
import { n as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-b-YTkLfc.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { a as resolvePluginActivationDecisionShared, n as normalizePluginsConfigWithResolverCore, o as toPluginActivationState, r as resolveChannelConfigEnablement } from "./config-normalization-shared-B7M6gfm-.mjs";
import { E as resolvePluginCandidateInstallOwner, n as discoverOpenClawPlugins, w as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-D_5mAUI7.mjs";
import { a as normalizeManifestChannelCommandDefaults, n as isCoreReservedPluginId, r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { t as PLUGIN_MANIFEST_CONTRACT_KEYS } from "./manifest-contract-keys-BPOZyeOs.mjs";
import { C as isThemeId, g as normalizeThemeDefinition, n as MAX_THEME_DEFINITION_BYTES } from "./theme-_hQKgfH-.mjs";
import { o as loadBundleManifest } from "./bundle-manifest-n8JdxRJp.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-CurpuyOg.mjs";
import { i as resolveInstalledPluginIndexStorePath, n as resolvePluginTrust, t as matchesInstalledPluginRecord } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { i as getOfficialExternalPluginCatalogEntryForPackage } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as isSelfContainedSvg } from "./svg-image-1iOdCRUI.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DRd0HJBG.mjs";
import path from "node:path";
//#region src/plugins/manifest-install-owner.ts
const PLUGIN_MANIFEST_INSTALL_OWNER = Symbol.for("openclaw.pluginManifestInstallOwner");
function recordPluginManifestInstallOwner(record, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return record;
	Object.defineProperty(record, PLUGIN_MANIFEST_INSTALL_OWNER, {
		configurable: false,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return record;
}
function readPluginManifestInstallOwner(record) {
	return record[PLUGIN_MANIFEST_INSTALL_OWNER];
}
function resolvePluginManifestInstallOwner(record) {
	return readPluginManifestInstallOwner(record)?.installOwner;
}
function isPluginManifestInstallOwnerAmbiguous(record) {
	return readPluginManifestInstallOwner(record)?.ambiguous === true;
}
//#endregion
//#region src/plugins/config-policy.ts
function resolvePolicyPluginActivationState(params) {
	return toPluginActivationState(resolvePluginActivationDecisionShared({
		...params,
		activationSource: {
			plugins: params.sourceConfig ?? params.config,
			rootConfig: params.sourceRootConfig ?? params.rootConfig
		},
		resolveChannelConfigEnablement
	}));
}
//#endregion
//#region src/plugins/portable-icon-paths.ts
/** Package-local artwork contracts shared by discovery and package builders. */
const PORTABLE_PLUGIN_ICON_PATH = "assets/icon.png";
const PLUGIN_ACTIVITY_ICON_PATH = "assets/activity.svg";
const PLUGIN_TOOL_ACTIVITY_ICON_DIR = "assets/activity";
const PLUGIN_ACTIVITY_ICON_MAX_BYTES = 32768;
function isPluginActivityToolName(value) {
	return /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/u.test(value);
}
//#endregion
//#region src/plugins/manifest-theme-definitions.ts
/** Capture palettes and artwork so a published generation never reads changed files. */
function loadManifestThemeDefinitions(params) {
	if (!params.themes?.length) return;
	return params.themes.flatMap((theme) => {
		try {
			if (params.pluginId === "user" || !isThemeId(`${params.pluginId}/${theme.id}`)) throw new Error("qualified theme ID must be portable, outside user/, and at most 256 characters");
			const file = readPluginCacheFile({
				rootDir: params.rootDir,
				relativePath: theme.source,
				rejectHardlinks: params.rejectHardlinks,
				maxBytes: MAX_THEME_DEFINITION_BYTES * 4
			});
			if (!file.ok) throw new Error("source must be a readable JSON file inside the plugin root");
			const definition = normalizeThemeDefinition(JSON.parse(file.contents.toString("utf8")), {
				hatIds: Object.keys(theme.hats ?? {}),
				critterIds: Object.keys(theme.critters ?? {})
			});
			if (definition.name !== theme.name || definition.description !== theme.description) throw new Error("name and description must match the manifest declaration");
			const readSvg = (source) => {
				const svgFile = readPluginCacheFile({
					rootDir: params.rootDir,
					relativePath: source,
					rejectHardlinks: params.rejectHardlinks,
					maxBytes: PLUGIN_ACTIVITY_ICON_MAX_BYTES
				});
				if (!svgFile.ok) throw new Error(`artwork ${source} must be a readable SVG inside the plugin root, at most ${PLUGIN_ACTIVITY_ICON_MAX_BYTES} bytes`);
				const svg = svgFile.contents.toString("utf8");
				if (!isSelfContainedSvg(svg)) throw new Error(`artwork ${source} must be a self-contained SVG`);
				return svg;
			};
			const artwork = {
				...theme.hats ? { hats: Object.fromEntries(Object.entries(theme.hats).map(([id, source]) => [id, { svg: readSvg(source) }])) } : {},
				...theme.critters ? { critters: Object.fromEntries(Object.entries(theme.critters).map(([id, { source, ...metadata }]) => [id, {
					svg: readSvg(source),
					...metadata
				}])) } : {}
			};
			return [{
				id: theme.id,
				definition,
				...theme.hats || theme.critters ? { artwork } : {}
			}];
		} catch (error) {
			params.diagnostics.push({
				level: "warn",
				pluginId: params.pluginId,
				message: `theme ${theme.id} is unavailable: ${error instanceof Error ? error.message : "invalid definition"}`
			});
			return [];
		}
	});
}
//#endregion
//#region src/plugins/manifest-record.ts
function resolvePluginSourcePath(sourcePath) {
	if (pluginCacheExistsSync(sourcePath)) return sourcePath;
	if (sourcePath.endsWith(".ts")) {
		const jsPath = sourcePath.slice(0, -3) + ".js";
		if (pluginCacheExistsSync(jsPath)) return jsPath;
	}
	return sourcePath;
}
function isPluginRootPath(params) {
	const resolvedTargetPath = path.resolve(params.targetPath);
	const resolvedRootPath = path.resolve(params.rootPath);
	if (!isPathInside(resolvedRootPath, resolvedTargetPath)) return false;
	const targetRealPath = pluginCacheRealpathSync(resolvedTargetPath);
	if (!targetRealPath) return params.targetMustExist !== true;
	if (!isPathInside(params.rootRealPath, targetRealPath)) return false;
	if (params.rejectHardlinks === true) {
		const targetStat = pluginCacheStatSync(resolvedTargetPath);
		if (!targetStat || targetStat.nlink > 1) return false;
	}
	return true;
}
function resolveManifestPluginSourcePath(params) {
	const pushDiagnostic = () => {
		params.diagnostics.push({
			level: "warn",
			pluginId: sanitizeForLog(params.pluginId),
			source: sanitizeForLog(params.manifestPath),
			message: `plugin manifest ${params.entryName} must resolve inside the plugin root; ignoring entry`
		});
	};
	if (!params.entry || path.isAbsolute(params.entry)) {
		pushDiagnostic();
		return;
	}
	const rootPath = path.resolve(params.rootDir);
	const rootRealPath = pluginCacheRealpathSync(rootPath) ?? rootPath;
	const sourcePath = path.resolve(rootPath, params.entry);
	if (!isPluginRootPath({
		rootPath,
		targetPath: sourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(sourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	const resolvedSourcePath = resolvePluginSourcePath(sourcePath);
	if (!isPluginRootPath({
		rootPath,
		targetPath: resolvedSourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(resolvedSourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	return resolvedSourcePath;
}
function resolvePortablePluginIcons(params) {
	let root;
	const resolveIcon = (relativePath) => {
		const iconPath = path.resolve(params.rootDir, relativePath);
		const iconStat = pluginCacheLstatSync(iconPath);
		if (!iconStat?.isFile() || params.rejectHardlinks && iconStat.nlink > 1) return;
		if (!root) {
			const rootPath = path.resolve(params.rootDir);
			root = {
				path: rootPath,
				realPath: pluginCacheRealpathSync(rootPath) ?? rootPath
			};
		}
		return isPluginRootPath({
			rootPath: root.path,
			targetPath: iconPath,
			rootRealPath: root.realPath,
			rejectHardlinks: params.rejectHardlinks,
			targetMustExist: true
		}) ? iconPath : void 0;
	};
	const iconPath = resolveIcon(PORTABLE_PLUGIN_ICON_PATH);
	const activityIconPath = resolveIcon(PLUGIN_ACTIVITY_ICON_PATH);
	const directory = path.resolve(params.rootDir, PLUGIN_TOOL_ACTIVITY_ICON_DIR);
	if (!isPluginRootPath({
		rootPath: params.rootDir,
		rootRealPath: params.rootDir === root?.path ? root.realPath : pluginCacheRealpathSync(params.rootDir) ?? params.rootDir,
		targetPath: directory,
		targetMustExist: true
	})) return {
		iconPath,
		activityIconPath
	};
	let entries;
	try {
		entries = readPluginCacheDirectory(directory);
	} catch {
		return {
			iconPath,
			activityIconPath
		};
	}
	if (entries.length > 128) return {
		iconPath,
		activityIconPath
	};
	const paths = [];
	for (const name of entries.map((entry) => entry.name).toSorted()) {
		const toolName = name.endsWith(".svg") ? name.slice(0, -4) : "";
		if (!isPluginActivityToolName(toolName)) continue;
		const toolIconPath = resolveIcon(`${PLUGIN_TOOL_ACTIVITY_ICON_DIR}/${name}`);
		if (toolIconPath) paths.push([toolName, toolIconPath]);
	}
	return {
		iconPath,
		activityIconPath,
		...paths.length ? { toolActivityIconPaths: Object.fromEntries(paths) } : {}
	};
}
function normalizePreferredPluginIds(raw) {
	return normalizeOptionalTrimmedStringList(raw);
}
function mergePackageChannelMetaIntoChannelConfigs(params) {
	const channelId = params.packageChannel?.id?.trim();
	if (!channelId || isBlockedObjectKey(channelId) || !params.channelConfigs || !Object.hasOwn(params.channelConfigs, channelId)) return params.channelConfigs;
	const existing = params.channelConfigs[channelId];
	if (!existing) return params.channelConfigs;
	const label = existing.label ?? normalizeOptionalString(params.packageChannel?.label) ?? "";
	const description = existing.description ?? normalizeOptionalString(params.packageChannel?.blurb) ?? "";
	const preferOver = existing.preferOver ?? normalizePreferredPluginIds(params.packageChannel?.preferOver);
	const commands = existing.commands ?? normalizeManifestChannelCommandDefaults(params.packageChannel?.commands);
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.channelConfigs)) if (!isBlockedObjectKey(key)) merged[key] = value;
	merged[channelId] = {
		...existing,
		...label ? { label } : {},
		...description ? { description } : {},
		...preferOver?.length ? { preferOver } : {},
		...commands ? { commands } : {}
	};
	return merged;
}
function mergeContractLists(left, right) {
	const merged = uniqueStrings([...left ?? [], ...right ?? []].map((value) => value.trim()).filter((value) => value.length > 0));
	return merged.length > 0 ? merged : void 0;
}
function mergeManifestContracts(manifestContracts, catalogContracts) {
	if (!catalogContracts) return manifestContracts;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const merged = mergeContractLists(manifestContracts?.[key], catalogContracts[key]);
		if (merged) contracts[key] = merged;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function mergeCatalogChannelConfigs(params) {
	if (!params.catalogChannelConfigs) return params.manifestChannelConfigs;
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.catalogChannelConfigs)) if (!isBlockedObjectKey(key)) merged[key] = value;
	for (const [key, value] of Object.entries(params.manifestChannelConfigs ?? {})) if (!isBlockedObjectKey(key)) {
		const catalogValue = merged[key];
		merged[key] = catalogValue ? {
			...catalogValue,
			...value,
			schema: value.schema ?? catalogValue.schema,
			...catalogValue.uiHints || value.uiHints ? { uiHints: {
				...catalogValue.uiHints,
				...value.uiHints
			} } : {},
			...value.runtime ?? catalogValue.runtime ? { runtime: value.runtime ?? catalogValue.runtime } : {},
			...value.label ?? catalogValue.label ? { label: value.label ?? catalogValue.label } : {},
			...value.description ?? catalogValue.description ? { description: value.description ?? catalogValue.description } : {},
			...value.preferOver ?? catalogValue.preferOver ? { preferOver: value.preferOver ?? catalogValue.preferOver } : {},
			...value.commands ?? catalogValue.commands ? { commands: value.commands ?? catalogValue.commands } : {}
		} : value;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeManifestCatalog(manifestCatalog, officialCatalog) {
	const featuredCandidate = manifestCatalog?.featured ?? officialCatalog?.featured;
	const orderCandidate = manifestCatalog?.order ?? officialCatalog?.order;
	const featured = typeof featuredCandidate === "boolean" ? featuredCandidate : void 0;
	const order = typeof orderCandidate === "number" && Number.isFinite(orderCandidate) ? orderCandidate : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function buildPluginManifestRecord(params) {
	const pluginId = params.candidate.effectivePluginId ?? params.manifest.id;
	const providerSourceEntry = params.manifest.providerCatalogEntry !== void 0 ? {
		entryName: "providerCatalogEntry",
		entry: params.manifest.providerCatalogEntry
	} : void 0;
	const manifestChannelConfigs = params.candidate.origin === "bundled" && params.bundledChannelConfigCollector ? params.bundledChannelConfigCollector({
		pluginDir: params.candidate.packageDir ?? params.candidate.rootDir,
		manifest: params.manifest,
		packageManifest: params.candidate.packageManifest
	}) : params.manifest.channelConfigs;
	const officialCatalogManifest = params.candidate.origin !== "bundled" ? getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntryForPackage(params.candidate.packageName) ?? {}) : void 0;
	const channelConfigs = mergePackageChannelMetaIntoChannelConfigs({
		channelConfigs: mergeCatalogChannelConfigs({
			manifestChannelConfigs,
			catalogChannelConfigs: officialCatalogManifest?.channelConfigs
		}),
		packageChannel: params.candidate.packageManifest?.channel
	});
	const packageChannelCommands = normalizeManifestChannelCommandDefaults(params.candidate.packageManifest?.channel?.commands);
	return {
		id: pluginId,
		categories: params.manifest.categories,
		backupResources: params.manifest.backupResources,
		doctorContract: params.manifest.doctorContract,
		doctorHealthChecks: params.manifest.doctorHealthChecks,
		sessionRouteStateOwners: params.manifest.sessionRouteStateOwners,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.packageName,
		description: normalizeOptionalString(params.manifest.description) ?? params.candidate.packageDescription,
		catalog: mergeManifestCatalog(params.manifest.catalog, officialCatalogManifest?.catalog),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version) ?? params.candidate.packageVersion,
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		enabledByDefault: params.manifest.enabledByDefault === true ? true : void 0,
		enabledByDefaultOnPlatforms: params.manifest.enabledByDefaultOnPlatforms,
		autoEnableWhenConfiguredProviders: params.manifest.autoEnableWhenConfiguredProviders,
		legacyPluginIds: params.manifest.legacyPluginIds,
		format: params.candidate.format ?? "openclaw",
		bundleFormat: params.candidate.bundleFormat,
		kind: params.manifest.kind,
		channels: params.manifest.channels ?? [],
		channelAccountKeyPolicies: params.manifest.channelAccountKeyPolicies,
		providers: params.manifest.providers ?? [],
		providerDiscoverySource: providerSourceEntry ? resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName: providerSourceEntry.entryName,
			entry: providerSourceEntry.entry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}) : void 0,
		capabilityCatalogSource: params.manifest.capabilityCatalogEntry === void 0 ? void 0 : resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName: "capabilityCatalogEntry",
			entry: params.manifest.capabilityCatalogEntry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}) ?? null,
		modelSupport: params.manifest.modelSupport,
		modelCatalog: params.manifest.modelCatalog,
		modelPricing: params.manifest.modelPricing,
		modelIdNormalization: params.manifest.modelIdNormalization,
		providerEndpoints: params.manifest.providerEndpoints,
		providerRequest: params.manifest.providerRequest,
		secretProviderIntegrations: params.manifest.secretProviderIntegrations,
		cliBackends: params.manifest.cliBackends ?? [],
		syntheticAuthRefs: params.manifest.syntheticAuthRefs ?? [],
		nonSecretAuthMarkers: params.manifest.nonSecretAuthMarkers ?? [],
		commandAliases: params.manifest.commandAliases,
		cliCommands: params.manifest.cliCommands,
		providerUsageAuthEnvVars: params.manifest.providerUsageAuthEnvVars,
		providerAuthAliases: params.manifest.providerAuthAliases,
		providerAuthChoices: params.manifest.providerAuthChoices,
		activation: params.manifest.activation,
		setup: params.manifest.setup,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		trustedOfficialInstall: params.trust.reason === "trusted-official" ? true : void 0,
		trust: params.trust,
		qaRunners: params.manifest.qaRunners,
		dashboard: params.manifest.dashboard,
		controlUi: params.manifest.controlUi,
		themes: params.manifest.themes,
		themeDefinitions: loadManifestThemeDefinitions({
			pluginId,
			rootDir: params.candidate.rootDir,
			themes: params.manifest.themes,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}),
		mcpServers: params.manifest.mcpServers,
		skills: params.manifest.skills ?? [],
		settingsFiles: [],
		hooks: [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		setupSource: params.candidate.setupSource,
		manifestPath: params.manifestPath,
		schemaCacheKey: params.schemaCacheKey,
		configSchema: params.configSchema,
		configUiHints: params.manifest.uiHints,
		configGroups: params.manifest.configGroups,
		contracts: mergeManifestContracts(params.manifest.contracts, officialCatalogManifest?.contracts),
		transcriptSources: params.manifest.transcriptSources,
		decisionModels: params.manifest.decisionModels,
		mediaUnderstandingProviderMetadata: params.manifest.mediaUnderstandingProviderMetadata,
		imageGenerationProviderMetadata: params.manifest.imageGenerationProviderMetadata,
		videoGenerationProviderMetadata: params.manifest.videoGenerationProviderMetadata,
		musicGenerationProviderMetadata: params.manifest.musicGenerationProviderMetadata,
		toolMetadata: params.manifest.toolMetadata,
		configContracts: params.manifest.configContracts,
		channelConfigs,
		...params.candidate.packageManifest?.channel?.id ? { channelCatalogMeta: {
			id: params.candidate.packageManifest.channel.id,
			...typeof params.candidate.packageManifest.channel.label === "string" ? { label: params.candidate.packageManifest.channel.label } : {},
			...typeof params.candidate.packageManifest.channel.blurb === "string" ? { blurb: params.candidate.packageManifest.channel.blurb } : {},
			...params.candidate.packageManifest.channel.preferOver ? { preferOver: params.candidate.packageManifest.channel.preferOver } : {},
			...packageChannelCommands ? { commands: packageChannelCommands } : {}
		} } : {}
	};
}
function buildBundleManifestRecord(params) {
	return {
		id: params.manifest.id,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.idHint,
		description: normalizeOptionalString(params.manifest.description),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version),
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		format: "bundle",
		bundleFormat: params.candidate.bundleFormat,
		bundleCapabilities: params.manifest.capabilities,
		activation: params.manifest.activation,
		channels: [],
		providers: [],
		cliBackends: [],
		syntheticAuthRefs: [],
		nonSecretAuthMarkers: [],
		skills: params.manifest.skills ?? [],
		settingsFiles: params.manifest.settingsFiles ?? [],
		hooks: params.manifest.hooks ?? [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		manifestPath: params.manifestPath,
		schemaCacheKey: void 0,
		configSchema: void 0,
		configUiHints: void 0,
		configContracts: void 0,
		channelConfigs: void 0
	};
}
//#endregion
//#region src/plugins/manifest-registry-build.ts
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function rejectCaseFoldedIdCollisions(records, diagnostics) {
	const recordsByPolicyId = /* @__PURE__ */ new Map();
	for (const record of records) {
		const policyId = normalizePluginPolicyId(record.id);
		const matches = recordsByPolicyId.get(policyId) ?? [];
		matches.push(record);
		recordsByPolicyId.set(policyId, matches);
	}
	const rejected = /* @__PURE__ */ new Set();
	for (const [policyId, matches] of recordsByPolicyId) {
		const declaredIds = [...new Set(matches.map((record) => record.id))].toSorted();
		if (declaredIds.length < 2) continue;
		const message = `plugin ids ${declaredIds.map((id) => JSON.stringify(id)).join(", ")} collide as normalized id ${JSON.stringify(policyId)}; refusing all colliding plugins`;
		for (const record of matches) {
			rejected.add(record);
			diagnostics.push({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message
			});
		}
	}
	return records.filter((record) => !rejected.has(record));
}
function pushNonBundledChannelConfigDescriptorDiagnostic(params) {
	if (params.record.origin === "bundled" || params.record.format === "bundle") return;
	const configuredEntry = params.normalized?.entries[params.record.id];
	if (params.normalized?.enabled === false || configuredEntry?.enabled === false || params.normalized?.deny.includes(params.record.id) || params.normalized?.allow.length && !params.normalized.allow.includes(params.record.id)) return;
	const declaredChannels = params.record.channels.map((channelId) => channelId.trim()).filter((channelId) => channelId.length > 0);
	if (declaredChannels.length === 0) return;
	const channelConfigs = params.record.channelConfigs ?? {};
	const missingChannels = declaredChannels.filter((channelId) => !Object.hasOwn(channelConfigs, channelId));
	if (missingChannels.length === 0) return;
	const safeMissingChannels = missingChannels.map(sanitizeForLog);
	params.diagnostics.push({
		level: "warn",
		pluginId: sanitizeForLog(params.record.id),
		source: sanitizeForLog(params.record.manifestPath),
		message: `channel plugin manifest declares ${safeMissingChannels.join(", ")} without channelConfigs metadata; add openclaw.plugin.json#channelConfigs so config schema and setup surfaces work before runtime loads. Channels without channelConfigs still appear in channel listings, but setup UI may be limited.`
	});
}
function dedupePluginDiagnostics(diagnostics, discoveryDiagnostics) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const diagnostic of diagnostics) {
		const key = JSON.stringify([
			diagnostic.level,
			diagnostic.pluginId ?? "",
			diagnostic.message,
			diagnostic.level === "error" || discoveryDiagnostics.has(diagnostic) ? diagnostic.source ?? "" : ""
		]);
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(diagnostic);
	}
	return deduped;
}
function isStaleForeignBundledPin(params) {
	return isForeignBundledPluginRoot(params.candidate.rootDir, params.env) && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	});
}
function resolveDuplicatePrecedenceRank(params) {
	if (params.candidate.origin === "config" || params.candidate.configSelected) return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && !isStaleForeignBundledPin({
		candidate: params.candidate,
		env: params.env
	}) && matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	})) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
function isIntentionalInstalledBundledDuplicate(params) {
	const leftIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.left,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	const rightIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.right,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	return leftIsInstalled && !isStaleForeignBundledPin({
		candidate: params.left,
		env: params.env
	}) && params.right.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.right.rootDir,
		env: params.env
	}) || rightIsInstalled && !isStaleForeignBundledPin({
		candidate: params.right,
		env: params.env
	}) && params.left.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.left.rootDir,
		env: params.env
	});
}
function isSameGlobalPackageDuplicate(left, right) {
	if (left.origin !== "global" || right.origin !== "global") return false;
	const leftPackageName = normalizeOptionalString(left.packageName);
	const rightPackageName = normalizeOptionalString(right.packageName);
	if (!leftPackageName || leftPackageName !== rightPackageName) return false;
	const leftPackageVersion = normalizeOptionalString(left.packageVersion);
	const rightPackageVersion = normalizeOptionalString(right.packageVersion);
	return Boolean(leftPackageVersion && rightPackageVersion && leftPackageVersion === rightPackageVersion);
}
function buildPluginManifestRegistry(params) {
	const config = params.config ?? {};
	const normalized = normalizePluginsConfigWithResolverCore(config.plugins);
	const env = params.env ?? process.env;
	const registryPath = params.registryPath ?? resolveInstalledPluginIndexStorePath({ env });
	const { getInstallRecords } = params;
	const discovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		env,
		installRecords: getInstallRecords()
	});
	const discovered = new Set(discovery.diagnostics);
	const diagnostics = [...discovered];
	const candidates = discovery.candidates;
	const seenIds = /* @__PURE__ */ new Map();
	const currentHostVersion = resolveCompatibilityHostVersion(env);
	const explicitConfiguredFileSources = new Set(normalized.loadPaths.map((loadPath) => resolveUserPath(loadPath, env)).filter((loadPath) => pluginCacheStatSync(loadPath)?.isFile() === true).map((loadPath) => path.resolve(loadPath)));
	for (const candidate of candidates) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: candidate.origin,
			rootDir: candidate.rootDir,
			env
		});
		const isBundleRecord = (candidate.format ?? "openclaw") === "bundle";
		const isManifestlessConfiguredFile = candidate.origin === "config" && explicitConfiguredFileSources.has(path.resolve(candidate.source)) && !pluginCacheExistsSync(path.join(candidate.rootDir, "openclaw.plugin.json"));
		if (isManifestlessConfiguredFile && isCoreReservedPluginId(candidate.idHint)) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.idHint,
				source: candidate.source,
				message: `plugin manifest id "${candidate.idHint}" is reserved by OpenClaw core`
			});
			continue;
		}
		const manifestRes = candidate.origin === "bundled" && candidate.bundledManifest && candidate.bundledManifestPath ? {
			ok: true,
			manifest: candidate.bundledManifest,
			manifestPath: candidate.bundledManifestPath
		} : isBundleRecord && candidate.bundleFormat ? loadBundleManifest({
			rootDir: candidate.rootDir,
			bundleFormat: candidate.bundleFormat,
			rejectHardlinks
		}) : isManifestlessConfiguredFile ? {
			ok: true,
			manifest: {
				id: candidate.idHint,
				configSchema: {
					type: "object",
					additionalProperties: false
				}
			},
			manifestPath: candidate.source
		} : loadPluginManifest(candidate.rootDir, rejectHardlinks);
		if (!manifestRes.ok) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.diagnosticIdHint ?? candidate.idHint,
				message: manifestRes.error,
				source: manifestRes.manifestPath,
				..."diagnosticCode" in manifestRes && manifestRes.diagnosticCode ? { code: manifestRes.diagnosticCode } : {}
			});
			continue;
		}
		const manifest = manifestRes.manifest;
		const effectivePluginId = candidate.effectivePluginId ?? manifest.id;
		if (candidate.origin !== "bundled") {
			const packageManifestSource = path.join(candidate.packageDir ?? candidate.rootDir, "package.json");
			const allowLegacyBareMinHostVersion = candidate.origin === "global" && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const minHostVersionCheck = checkMinHostVersion({
				currentVersion: currentHostVersion,
				minHostVersion: candidate.packageManifest?.install?.minHostVersion,
				allowLegacyBareSemver: allowLegacyBareMinHostVersion
			});
			if (!minHostVersionCheck.ok) {
				diagnostics.push({
					level: minHostVersionCheck.kind === "invalid" ? "error" : "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: minHostVersionCheck.kind === "invalid" ? `plugin manifest invalid | ${minHostVersionCheck.error}` : minHostVersionCheck.kind === "unknown_host_version" ? `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined; skipping load` : `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}; skipping load`
				});
				continue;
			}
			const packagePluginApiRangeCheck = resolvePackagePluginApiRange(candidate.packageManifest);
			if (!packagePluginApiRangeCheck.ok) {
				diagnostics.push({
					level: "error",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin manifest invalid | ${packagePluginApiRangeCheck.error}`
				});
				continue;
			}
			const packagePluginApiRange = packagePluginApiRangeCheck.range;
			if (packagePluginApiRange && !satisfiesPluginApiRange(currentHostVersion, packagePluginApiRange)) {
				diagnostics.push({
					level: "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${currentHostVersion}; skipping load (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`
				});
				continue;
			}
		}
		const configSchema = "configSchema" in manifest ? manifest.configSchema : void 0;
		const schemaCacheKey = (() => {
			if (!configSchema || isManifestlessConfiguredFile) return;
			const file = readPluginCacheFile({
				rootDir: candidate.rootDir,
				relativePath: path.relative(candidate.rootDir, manifestRes.manifestPath),
				rejectHardlinks,
				maxBytes: 262144
			});
			return file.ok ? `${manifestRes.manifestPath}:${file.hash}` : manifestRes.manifestPath;
		})();
		const record = isBundleRecord ? buildBundleManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			rejectHardlinks
		}) : buildPluginManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			diagnostics,
			rejectHardlinks,
			schemaCacheKey,
			configSchema,
			trust: resolvePluginTrust({
				registryPath,
				pluginId: effectivePluginId,
				candidate,
				env,
				installRecords: getInstallRecords()
			}),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
		if (candidate.sourcePreferred || candidate.origin === "bundled" && candidate.configSelected) record.sourcePreferred = true;
		recordPluginManifestInstallOwner(record, resolvePluginCandidateInstallOwner(candidate), isPluginCandidateInstallOwnerAmbiguous(candidate));
		const existing = seenIds.get(effectivePluginId);
		if (existing) {
			const samePath = existing.candidate.rootDir === candidate.rootDir;
			if ((() => {
				if (samePath) return true;
				const existingReal = pluginCacheRealpathSync(existing.candidate.rootDir);
				const candidateReal = pluginCacheRealpathSync(candidate.rootDir);
				return Boolean(existingReal && candidateReal && existingReal === candidateReal);
			})()) {
				if (record.sourcePreferred || existing.record.sourcePreferred) {
					record.sourcePreferred = true;
					existing.record.sourcePreferred = true;
				}
				if (PLUGIN_ORIGIN_RANK[candidate.origin] < PLUGIN_ORIGIN_RANK[existing.candidate.origin]) seenIds.set(effectivePluginId, {
					candidate,
					record
				});
				continue;
			}
			const candidateWins = resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			}) < resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const winnerCandidate = candidateWins ? candidate : existing.candidate;
			const overriddenCandidate = candidateWins ? existing.candidate : candidate;
			if (candidateWins) seenIds.set(effectivePluginId, {
				candidate,
				record
			});
			if (isIntentionalInstalledBundledDuplicate({
				pluginId: effectivePluginId,
				left: candidate,
				right: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			})) continue;
			if (isSameGlobalPackageDuplicate(candidate, existing.candidate)) continue;
			const staleForeignPin = winnerCandidate.origin === "bundled" && isStaleForeignBundledPin({
				candidate: overriddenCandidate,
				env
			}) && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate: overriddenCandidate,
				env,
				installRecords: getInstallRecords()
			});
			diagnostics.push({
				level: "warn",
				pluginId: effectivePluginId,
				source: overriddenCandidate.source,
				message: staleForeignPin ? `stale plugin install record: "${effectivePluginId}" is pinned to ${overriddenCandidate.rootDir}, which belongs to a different OpenClaw installation. This installation's bundled plugin is being used instead. No uninstall is needed to use the bundled plugin. Uninstalling, even with \`--keep-files\`, removes plugin configuration; re-enabling does not restore it.` : winnerCandidate.origin === "config" ? `duplicate plugin id resolved by explicit config-selected plugin; ${overriddenCandidate.origin} plugin will be overridden by config plugin (${winnerCandidate.source})` : `duplicate plugin id detected; ${overriddenCandidate.origin} plugin will be overridden by ${winnerCandidate.origin} plugin (${winnerCandidate.source})`
			});
			continue;
		}
		seenIds.set(effectivePluginId, {
			candidate,
			record
		});
	}
	const plugins = rejectCaseFoldedIdCollisions([...seenIds.values()].map(({ record }) => record), diagnostics);
	for (const record of plugins) pushNonBundledChannelConfigDescriptorDiagnostic({
		record,
		diagnostics,
		normalized
	});
	return {
		plugins,
		diagnostics: dedupePluginDiagnostics(diagnostics, discovered)
	};
}
/** Load manifest metadata from the bundled/source plugin tree without consulting operator state. */
function loadBundledPluginManifestRegistry(params = {}) {
	const env = params.env ?? process.env;
	const installRecords = {};
	return buildPluginManifestRegistry({
		env,
		getInstallRecords: () => installRecords,
		discovery: discoverOpenClawPlugins({
			env,
			installRecords,
			rootScope: "bundled",
			...params.bundledRoot ? { bundledRoot: params.bundledRoot } : {}
		})
	});
}
//#endregion
export { resolvePolicyPluginActivationState as a, isPluginActivityToolName as i, loadBundledPluginManifestRegistry as n, isPluginManifestInstallOwnerAmbiguous as o, PLUGIN_ACTIVITY_ICON_MAX_BYTES as r, resolvePluginManifestInstallOwner as s, buildPluginManifestRegistry as t };
