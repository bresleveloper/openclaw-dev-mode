import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { o as safeRealpathSync } from "./path-safety-0BfxAYBQ.mjs";
import "./path-safety-Cc0rrc_m.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { E as resolvePluginCandidateInstallOwner, n as discoverOpenClawPlugins, s as tracePluginLifecyclePhaseAsync, w as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-D_5mAUI7.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DnOgVB7K.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, T as installWithSourceFallback, i as getOfficialExternalPluginCatalogEntryForPackage, k as resolveNpmInstallSpecsForUpdateChannel } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as isPluginManifestInstallOwnerAmbiguous, s as resolvePluginManifestInstallOwner } from "./manifest-registry-build-BbQTPsvD.mjs";
import { o as clearLoadInstalledPluginIndexInstallRecordsCache, r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { n as isUnavailableClawHubTarget } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget, t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { i as prepareConfigForDisabledInstall, n as enablePluginInConfig } from "./enable-35XtW1Wg.mjs";
import { t as buildNpmResolutionFields } from "./install-source-utils-CeCvRCDR.mjs";
import { a as withoutPluginInstallRecords, l as reconcileNpmPluginLoadPath, n as recordPluginInstallInRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { R as requestDeferredPluginInstall, W as takePluginInstallTransaction } from "./npm-managed-root-BdsMGiX0.mjs";
import { i as installPluginFromNpmPackArchive, n as installPluginFromPath, r as installPluginFromNpmSpec } from "./install-Bt8Oq4jr.mjs";
import { r as prepareManagedPluginArtifactConsentHandler } from "./capability-consent-Fw4XtIv4.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as installPluginFromClawHub } from "./clawhub-DyY8io5y.mjs";
import { t as installPluginFromGitSpec } from "./git-install-DOI9Y3PV.mjs";
import { t as installPluginFromMarketplace } from "./marketplace-BOw8f66-.mjs";
import { o as recordPluginPackageUninstallPlan, r as planPluginUninstall, t as applyPluginUninstallDirectoryRemoval } from "./uninstall-Bz4RjU1V.mjs";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-DDMKSyro.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-B0PJDNFd.mjs";
import { o as buildPluginSnapshotReport } from "./status-tJQ_0mMd.mjs";
import { t as PluginInstallPersistedError } from "./lifecycle-D58-fLcH.mjs";
import { i as refreshManagedPluginMetadata, l as resolvePluginConfigEnablement } from "./management-service-BPiOYlEh.mjs";
import { t as applySlotSelectionForPlugin } from "./slot-selection-Dn6f6w2I.mjs";
import { t as inspectPluginGenerationSources } from "./plugin-generation-source-inspection-BYmIVGn4.mjs";
import path from "node:path";
//#region src/plugins/install-persistence.ts
function addInstalledPluginToAllowlist(cfg, pluginId) {
	const allow = cfg.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0 || allow.includes(pluginId)) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			allow: [...allow, pluginId]
		}
	};
}
function removeInstalledPluginFromDenylist(cfg, pluginId) {
	const deny = cfg.plugins?.deny;
	if (!Array.isArray(deny) || !deny.includes(pluginId)) return cfg;
	const nextDeny = deny.filter((id) => id !== pluginId);
	const plugins = {
		...cfg.plugins,
		...nextDeny.length > 0 ? { deny: nextDeny } : {}
	};
	if (nextDeny.length === 0) delete plugins.deny;
	return {
		...cfg,
		plugins
	};
}
function logShadowedNpmInstallWarning(params) {
	if (params.install.source !== "npm") return;
	const installedSource = params.install.installPath ?? params.install.sourcePath;
	if (!installedSource) return;
	const active = buildPluginSnapshotReport({
		config: params.config,
		effectiveOnly: true,
		onlyPluginIds: [params.pluginId]
	}).plugins.find((plugin) => plugin.id === params.pluginId);
	if (!active || active.origin !== "config") return;
	const activeSource = resolveUserPath(active.source);
	const installedPath = resolveUserPath(installedSource);
	if (activeSource === installedPath || isPathInside(installedPath, activeSource)) return;
	params.warn([
		`Warning: installed plugin "${params.pluginId}" is not the active source because a config-selected plugin with the same id is currently selected:`,
		`  active config source: ${shortenHomePath(active.source)}`,
		`  installed npm source: ${shortenHomePath(installedSource)}`,
		"Run `openclaw plugins doctor` for repair options."
	].join("\n"), `Installed plugin "${params.pluginId}" is shadowed by a configured plugin source. Run \`openclaw plugins doctor\`.`);
}
function shouldPreserveReplacedInstallPath(params) {
	const removalTarget = resolveUserPath(params.removalTarget);
	const nextInstallPath = resolveUserPath(params.nextInstallPath);
	return isPathInside(removalTarget, nextInstallPath) || isPathInside(nextInstallPath, removalTarget);
}
function resolveReplacedManagedInstallRemoval(params) {
	if (!params.previousInstall) return null;
	const previousInstallPath = params.previousInstall.installPath ?? params.previousInstall.sourcePath;
	const nextInstallPath = params.nextInstall.installPath ?? params.nextInstall.sourcePath;
	if (!previousInstallPath || !nextInstallPath) return null;
	if (params.previousInstall.source === "npm" && params.nextInstall.source === "npm") return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: previousInstallPath,
		nextInstallPath
	})) return null;
	const plan = planPluginUninstall(recordPluginPackageUninstallPlan({
		config: { plugins: { installs: { [params.pluginId]: params.previousInstall } } },
		pluginId: params.pluginId,
		deleteFiles: true
	}, { runtimePluginIds: [] }));
	if (!plan.ok || !plan.directoryRemoval) return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: plan.directoryRemoval.target,
		nextInstallPath
	})) return null;
	return plan.directoryRemoval;
}
async function persistPluginInstall(params) {
	let committed = false;
	try {
		const installRecords = await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords(), { command: "install" });
		return await withPluginCache(createPluginCache(), async () => {
			const runtime = params.runtime ?? defaultRuntime;
			const warn = (message, managementMessage) => {
				params.persistenceLogger?.warn?.(managementMessage);
				runtime.log(theme.warn(message));
			};
			const previousInstall = installRecords[params.pluginId];
			const replacedInstallRemoval = resolveReplacedManagedInstallRemoval({
				pluginId: params.pluginId,
				previousInstall,
				nextInstall: params.install
			});
			const nextInstallRecords = recordPluginInstallInRecords(installRecords, {
				pluginId: params.pluginId,
				...params.install
			});
			const reconciledConfig = reconcileNpmPluginLoadPath({
				config: params.snapshot.config,
				previousInstall,
				nextInstall: params.install
			});
			const installedDiscovery = discoverOpenClawPlugins({ installRecords: nextInstallRecords });
			const realpathCache = /* @__PURE__ */ new Map();
			const targetPathKeys = new Set([params.install.installPath, params.install.sourcePath].filter((candidate) => Boolean(candidate?.trim())).map((candidate) => {
				const resolved = resolveUserPath(candidate, process.env);
				return safeRealpathSync(resolved, realpathCache) ?? path.resolve(resolved);
			}));
			const installedCandidates = installedDiscovery.candidates.filter((candidate) => {
				if (resolvePluginCandidateInstallOwner(candidate) === params.pluginId) return true;
				const candidatePath = candidate.packageDir ?? candidate.rootDir;
				const resolved = resolveUserPath(candidatePath, process.env);
				const pathKey = safeRealpathSync(resolved, realpathCache) ?? path.resolve(resolved);
				return targetPathKeys.has(pathKey);
			});
			if (installedCandidates.some(isPluginCandidateInstallOwnerAmbiguous)) throw new Error(`Plugin package "${params.pluginId}" has ambiguous install ownership. Refresh the plugin registry or reinstall the package before retrying.`);
			const installedRegistry = loadPluginManifestRegistryCore({
				config: reconciledConfig,
				candidates: installedCandidates,
				diagnostics: installedDiscovery.diagnostics,
				installRecords: nextInstallRecords
			});
			if (installedRegistry.plugins.some(isPluginManifestInstallOwnerAmbiguous)) throw new Error(`Plugin package "${params.pluginId}" has ambiguous install ownership. Refresh the plugin registry or reinstall the package before retrying.`);
			const manifests = installedRegistry.plugins.filter((plugin) => resolvePluginManifestInstallOwner(plugin) === params.pluginId);
			if (manifests.length === 0) throw new Error(`Plugin package "${params.pluginId}" has no authoritative runtime child list. Refresh the plugin registry, then reinstall the package or run openclaw doctor before retrying.`);
			const ownedPluginIds = manifests.map((plugin) => plugin.id).toSorted();
			const manifestByPluginId = new Map(manifests.map((plugin) => [plugin.id, plugin]));
			const enablementByPluginId = new Map(ownedPluginIds.map((pluginId) => [pluginId, resolvePluginConfigEnablement({
				config: reconciledConfig,
				pluginId,
				manifest: manifestByPluginId.get(pluginId)
			})]));
			for (const [pluginId, configEnablement] of enablementByPluginId) if (configEnablement.mode === "invalid") throw new Error(`Plugin "${pluginId}" has invalid configured settings: ${configEnablement.error}. Fix plugins.entries.${pluginId}.config, then rerun the install.`);
			let next = reconciledConfig;
			const enabledPluginIds = [];
			for (const pluginId of ownedPluginIds) {
				const configEnablement = enablementByPluginId.get(pluginId) ?? { mode: "ready" };
				const explicitlyDisabled = reconciledConfig.plugins?.entries?.[pluginId]?.enabled === false;
				if (configEnablement.mode === "missing") next = prepareConfigForDisabledInstall(next, pluginId);
				if (params.enable === false) continue;
				next = removeInstalledPluginFromDenylist(addInstalledPluginToAllowlist(next, pluginId), pluginId);
				if (configEnablement.mode !== "ready" || explicitlyDisabled) continue;
				const enabled = enablePluginInConfig(next, pluginId, { updateChannelConfig: false });
				next = enabled.config;
				if (enabled.enabled) enabledPluginIds.push(pluginId);
			}
			const slotWarnings = [];
			const slotMetadata = enabledPluginIds.length ? loadPluginMetadataSnapshot({
				allowCurrent: false,
				config: next,
				index: loadInstalledPluginIndex({
					config: next,
					candidates: installedCandidates,
					diagnostics: installedDiscovery.diagnostics,
					installRecords: nextInstallRecords
				})
			}) : void 0;
			for (const pluginId of enabledPluginIds) {
				const slotResult = await tracePluginLifecyclePhaseAsync("slot selection", async () => {
					params.beforePersistentApply?.();
					return applySlotSelectionForPlugin(next, pluginId, slotMetadata, params.beforePersistentApply);
				}, {
					command: "install",
					pluginId
				});
				next = slotResult.config;
				slotWarnings.push(...slotResult.warnings);
			}
			next = withoutPluginInstallRecords(next);
			const enabled = new Set(enabledPluginIds);
			const source = params.deferRuntime ? inspectPluginGenerationSources(manifests.filter((manifest) => enabled.has(manifest.id) && manifest.origin !== "bundled").map((manifest) => ({
				pluginId: manifest.id,
				rootDir: manifest.rootDir,
				entryFile: manifest.manifestPath === manifest.source ? manifest.source : void 0
			}))) : void 0;
			const receipt = await tracePluginLifecyclePhaseAsync("config mutation", () => commitPluginInstallRecordsWithConfig({
				previousInstallRecords: installRecords,
				nextInstallRecords,
				nextConfig: next,
				baseHash: params.snapshot.baseHash,
				beforePersistentEffect: params.beforePersistentEffect,
				writeOptions: {
					...params.snapshot.writeOptions,
					afterWrite: params.applyRuntime || params.deferRuntime ? {
						mode: "none",
						reason: "plugin lifecycle applies runtime"
					} : {
						mode: "restart",
						reason: "plugin source changed"
					},
					...params.beforePersistentApply ? { assertConfigPathForWrite: () => {
						params.snapshot.writeOptions.assertConfigPathForWrite?.();
						params.beforePersistentApply?.();
					} } : {}
				}
			}), { command: "install" });
			committed = true;
			params.deferRuntime?.record({
				operation: "install",
				pluginId: params.pluginId,
				sourceDigests: source?.sourceDigests ?? {},
				write: receipt
			}, source?.assertSourceCurrent);
			refreshManagedPluginMetadata({ config: next });
			await params.applyRuntime?.({
				config: next,
				write: receipt.configWrite,
				pluginIds: ownedPluginIds,
				reason: "install",
				assertInvokerOwned: params.beforePersistentApply
			});
			if (replacedInstallRemoval) {
				const cleanup = async (assertOwned, reportWarning = (message) => warn(message, "A previous plugin installation could not be fully cleaned up. Run `openclaw plugins doctor`.")) => {
					const removalResult = await tracePluginLifecyclePhaseAsync("replaced install cleanup", () => applyPluginUninstallDirectoryRemoval(replacedInstallRemoval, assertOwned), {
						command: "install",
						pluginId: params.pluginId
					});
					for (const warning of removalResult.warnings) reportWarning(warning);
					if (removalResult.directoryRemoved) runtime.log(theme.muted(`Removed previous plugin install directory: ${shortenHomePath(replacedInstallRemoval.target)}`));
				};
				if (params.deferRuntime) params.deferRuntime.deferCleanup(cleanup, replacedInstallRemoval.target);
				else await cleanup(params.beforePersistentApply);
			}
			await refreshPluginRegistryAfterConfigMutation({
				configPath: receipt.configWrite.path,
				reason: "source-changed",
				installRecords: nextInstallRecords,
				invalidateRuntimeCache: params.invalidateRuntimeCache,
				traceCommand: "install",
				logger: { warn: (message) => warn(message, "Plugin registry refresh or runtime cache invalidation failed. Restart the gateway.") }
			});
			for (const warning of slotWarnings) warn(warning, warning);
			const configurationRequiredPluginIds = [...enablementByPluginId].filter(([, state]) => state.mode === "missing").map(([pluginId]) => pluginId);
			const configWarning = params.enable !== false && configurationRequiredPluginIds.length > 0 ? configurationRequiredPluginIds.length === 1 ? `Installed plugin "${configurationRequiredPluginIds[0]}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${configurationRequiredPluginIds[0]}\`.` : `Installed plugin entries ${configurationRequiredPluginIds.join(", ")} without enabling them because they require configuration first. Configure each entry, then run \`openclaw plugins enable <plugin-id>\`.` : void 0;
			const warningMessage = [params.warningMessage, configWarning].filter(Boolean).join("\n");
			if (warningMessage) warn(warningMessage, configWarning ?? "Plugin installation reported a warning. Run `openclaw plugins doctor`.");
			runtime.log(params.successMessage ?? (ownedPluginIds.length > 1 ? `Installed plugin package ${params.pluginId}: ${ownedPluginIds.join(", ")}` : `Installed plugin: ${params.pluginId}`));
			logShadowedNpmInstallWarning({
				config: next,
				pluginId: params.pluginId,
				install: params.install,
				warn
			});
			return next;
		});
	} catch (error) {
		if (committed) throw new PluginInstallPersistedError(params.pluginId, error);
		try {
			await params.transaction?.rollback();
		} catch (rollbackError) {
			const failure = new AggregateError([error, rollbackError], "Plugin install failed and payload rollback failed");
			failure.cause = error;
			throw failure;
		}
		throw error;
	} finally {
		if (committed) await params.transaction?.commit().catch(() => {
			const warning = "Plugin install committed, but backup cleanup failed.";
			params.persistenceLogger?.warn?.(warning);
			params.runtime?.log(warning);
		});
		clearLoadInstalledPluginIndexInstallRecordsCache();
	}
}
//#endregion
//#region src/plugins/bundled-install.ts
function resolveBundledPluginConfigEnablement(params) {
	if (!params.bundledSource.requiresConfig) return { mode: "ready" };
	const entry = isRecord(params.existingEntry) ? params.existingEntry : void 0;
	if (!entry || !Object.hasOwn(entry, "config")) return { mode: "missing" };
	const config = entry.config;
	if (!params.bundledSource.configSchema) return isRecord(config) && Object.keys(config).length > 0 ? { mode: "ready" } : {
		mode: "invalid",
		error: "config must be a non-empty object"
	};
	const result = validateJsonSchemaValue({
		schema: params.bundledSource.configSchema,
		cacheKey: `bundled-install:${params.bundledSource.pluginId}`,
		value: config,
		applyDefaults: true
	});
	return result.ok ? { mode: "ready" } : {
		mode: "invalid",
		error: result.errors[0]?.text ?? "invalid plugin config"
	};
}
async function installBundledPluginSource(params) {
	const existingEntry = params.snapshot.config.plugins?.entries?.[params.bundledSource.pluginId];
	const configEnablement = resolveBundledPluginConfigEnablement({
		bundledSource: params.bundledSource,
		existingEntry
	});
	if (configEnablement.mode === "invalid") throw new Error(`Plugin "${params.bundledSource.pluginId}" has invalid configured settings: ${configEnablement.error}. Fix plugins.entries.${params.bundledSource.pluginId}.config, then rerun the install.`);
	const shouldEnable = configEnablement.mode === "ready";
	const configBase = shouldEnable ? params.snapshot.config : prepareConfigForDisabledInstall(params.snapshot.config, params.bundledSource.pluginId);
	const configWarning = shouldEnable ? void 0 : `Installed bundled plugin "${params.bundledSource.pluginId}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${params.bundledSource.pluginId}\`.`;
	const warnings = [params.warning, configWarning].filter((warning) => Boolean(warning));
	const config = await persistPluginInstall({
		...params,
		snapshot: {
			...params.snapshot,
			config: configBase
		},
		pluginId: params.bundledSource.pluginId,
		install: {
			source: "path",
			spec: params.rawSpec,
			sourcePath: params.bundledSource.localPath,
			installPath: params.bundledSource.localPath
		},
		enable: shouldEnable,
		...warnings.length > 0 ? { warningMessage: warnings.join("\n") } : {}
	});
	return {
		pluginId: params.bundledSource.pluginId,
		warnings,
		config
	};
}
//#endregion
//#region src/plugins/management-install.ts
/**
* Official plugin installs target the release stream the gateway is running,
* the same target `openclaw doctor --fix` and `openclaw plugins update`
* already resolve. Resolving here keeps every managed install path — CLI,
* chat command, and any future caller — on one answer instead of letting the
* registry default land a plugin the gateway then reports as drifted.
*
* Beta and extended-stable resolve here. Version-bound stable tracks key off a
* per-plugin `versionBoundToOpenClaw` descriptor that a managed install request
* does not carry, and answering for them from this boundary would pin plugins
* the policy never opted in.
*/
async function resolveOfficialManagedInstallSpec(params) {
	const { request } = params;
	const trustedSourceLinkedOfficialInstall = request.trustedSourceLinkedOfficialInstall === true;
	if (request.source === "npm" && !trustedSourceLinkedOfficialInstall) return null;
	if (request.expectedIntegrity) return null;
	const packageName = request.source === "clawhub" ? parseClawHubPluginSpec(request.spec)?.name : parseRegistryNpmSpec(request.spec)?.name;
	if (!packageName || !trustedSourceLinkedOfficialInstall && !getOfficialExternalPluginCatalogEntryForPackage(packageName)) return null;
	const updateChannel = resolveRegistryUpdateChannel({
		configChannel: normalizeUpdateChannel(params.config.update?.channel),
		currentVersion: VERSION
	});
	if (updateChannel !== "beta" && updateChannel !== "extended-stable") return null;
	const specs = request.source === "clawhub" ? resolveClawHubInstallSpecsForUpdateChannel({
		spec: request.spec,
		updateChannel,
		officialPackageName: packageName,
		coreVersion: VERSION
	}) : await resolveNpmInstallSpecsForUpdateChannel({
		spec: request.spec,
		updateChannel,
		officialPackageName: packageName,
		coreVersion: VERSION
	});
	return specs.installSpec === request.spec ? null : specs.installSpec;
}
/**
* Installs official plugins from the release stream the gateway runs. When that
* stream has no published artifact the install reports it instead of widening
* back to the registry default: widening would resolve `latest` and land exactly
* the cross-release plugin this boundary exists to prevent, and a fresh install
* has nothing to preserve, so failing with the reason costs the operator only a
* retry with an explicit version.
*/
async function installManagedPluginSource(input) {
	return await withPluginLifecycleLease({ env: input.env }, async (lease) => {
		const assertOwned = lease.assertOwned.bind(lease);
		const params = {
			...input,
			beforePersistentApply: () => {
				input.beforePersistentApply?.();
				assertOwned();
			}
		};
		const { request } = params;
		if (request.source === "official") {
			const { attempt: installAttempt, source: installedSource } = await installWithSourceFallback({
				sources: request.pin ? request.installSources.filter((source) => source.source === "npm") : request.installSources,
				install: async (source) => await installManagedPluginSource({
					...params,
					request: {
						source: source.source,
						spec: source.spec,
						mode: request.mode,
						expectedPluginId: request.expectedPluginId,
						trustedSourceLinkedOfficialInstall: true,
						...source.expectedIntegrity ? { expectedIntegrity: source.expectedIntegrity } : {},
						...source.source === "npm" && request.pin ? { pin: true } : {}
					}
				}),
				result: (attempt) => attempt,
				onFallback: (message) => params.logger?.warn?.(message)
			});
			return installAttempt.ok ? installAttempt : {
				...installAttempt,
				installSource: installedSource
			};
		}
		if (request.source !== "npm" && request.source !== "clawhub") return await installResolvedManagedPluginSource({
			...params,
			request
		}, assertOwned);
		let installSpec;
		try {
			installSpec = await resolveOfficialManagedInstallSpec({
				request,
				config: params.snapshot.config
			});
		} catch (error) {
			if (!(error instanceof NpmChannelResolutionError)) throw error;
			return {
				ok: false,
				error: error.message,
				code: error.code
			};
		}
		if (!installSpec) return await installResolvedManagedPluginSource({
			...params,
			request
		}, assertOwned);
		const result = await installResolvedManagedPluginSource({
			...params,
			request: {
				...request,
				spec: installSpec,
				recordSpec: request.recordSpec ?? request.spec
			}
		}, assertOwned);
		if (result.ok) return result;
		if (!(request.source === "clawhub" ? isUnavailableClawHubTarget(result) : isUnavailableNpmTarget(result))) return result;
		return {
			...result,
			code: PLUGIN_INSTALL_ERROR_CODE.RELEASE_COHORT_UNAVAILABLE,
			error: `No ${installSpec} release is published for this gateway. Installing ${request.spec} would resolve a build from another release; pass an explicit version to install one anyway.`
		};
	});
}
/** Execute one resolved plugin source through the shared install-and-persist pipeline. */
async function installResolvedManagedPluginSource(params, assertOwned) {
	const { request } = params;
	const env = params.env ?? process.env;
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	if (request.source === "bundled") return {
		ok: true,
		...await installBundledPluginSource({
			...params,
			rawSpec: request.rawSpec,
			bundledSource: request.bundledSource,
			warning: request.warning
		})
	};
	const consentExemptSource = request.source === "local" && request.bundledOrigin === true;
	const source = request.source === "local" ? request.recordSource : request.source === "npm-pack" ? "npm" : request.source;
	const capabilityConsent = consentExemptSource ? void 0 : await prepareManagedPluginArtifactConsentHandler({
		config: params.snapshot.config,
		env,
		source,
		...request.source === "marketplace" ? { spec: `${request.plugin}@${request.marketplace}` } : "spec" in request ? { spec: request.spec } : {},
		..."expectedIntegrity" in request && request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {},
		acknowledgeCapabilities: params.acknowledgeCapabilities,
		onCapabilityConsent: params.onCapabilityConsent
	});
	const common = requestDeferredPluginInstall({
		...params.safetyOverrides,
		config: params.snapshot.config,
		extensionsDir,
		logger: params.logger,
		beforePersistentApply: params.beforePersistentApply,
		...capabilityConsent || params.beforePersistentEffect ? { onBeforePluginArtifactCommit: async (artifact) => {
			await capabilityConsent?.onBeforePluginArtifactCommit(artifact);
			await params.beforePersistentEffect?.();
		} } : {}
	}, void 0, assertOwned);
	const complete = async (installResult, completed) => {
		const result = await installResult;
		if (!result.ok) return result;
		const installed = result;
		if (request.source === "local" && request.link) await capabilityConsent?.onBeforePluginArtifactCommit({
			pluginId: installed.pluginId,
			stagedArtifactDir: request.path,
			mode: request.mode ?? "install"
		});
		const transaction = takePluginInstallTransaction(installed);
		if (completed.expectedPluginId && installed.pluginId !== completed.expectedPluginId) {
			await transaction?.rollback();
			return {
				ok: false,
				error: `official catalog plugin id mismatch: expected ${completed.expectedPluginId}, got ${installed.pluginId}`
			};
		}
		const warnings = [];
		const config = await persistPluginInstall({
			persistenceLogger: { warn: (message) => warnings.push(message) },
			...params,
			snapshot: completed.snapshot ?? params.snapshot,
			pluginId: installed.pluginId,
			install: capabilityConsent ? capabilityConsent.applyAcceptedSurface(installed.pluginId, completed.install(installed)) : completed.install(installed),
			transaction,
			successMessage: completed.successMessage,
			beforePersistentApply: params.beforePersistentApply
		});
		return {
			...installed,
			config,
			...warnings.length > 0 ? { warnings: [...new Set(warnings)] } : {}
		};
	};
	if (request.source === "local") {
		const installPath = request.link ? request.path : void 0;
		const linkedSnapshot = request.link ? {
			...params.snapshot,
			config: {
				...params.snapshot.config,
				plugins: {
					...params.snapshot.config.plugins,
					load: {
						...params.snapshot.config.plugins?.load,
						paths: uniqueStrings([...params.snapshot.config.plugins?.load?.paths ?? [], request.path])
					}
				}
			}
		} : params.snapshot;
		return await complete(installPluginFromPath({
			...common,
			path: request.path,
			mode: request.mode,
			...request.link ? {
				dryRun: true,
				allowSourceTypeScriptEntries: true
			} : {}
		}), {
			snapshot: linkedSnapshot,
			successMessage: request.successMessage,
			install: (result) => ({
				source: request.recordSource,
				sourcePath: request.recordPath ?? request.path,
				installPath: installPath ?? result.targetDir,
				version: result.version
			})
		});
	}
	if (request.source === "marketplace") return await complete(installPluginFromMarketplace({
		...common,
		marketplace: request.marketplace,
		plugin: request.plugin,
		mode: request.mode
	}), { install: (result) => ({
		source: "marketplace",
		installPath: result.targetDir,
		version: result.version,
		marketplaceName: result.marketplaceName,
		marketplaceSource: result.marketplaceSource,
		marketplacePlugin: result.marketplacePlugin
	}) });
	if (request.source === "npm-pack") return await complete(installPluginFromNpmPackArchive({
		...common,
		archivePath: request.archivePath,
		mode: request.mode
	}), { install: (result) => ({
		source: "npm",
		spec: result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId,
		sourcePath: request.archivePath,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionFields(result.npmResolution),
		artifactKind: "npm-pack",
		artifactFormat: "tgz",
		...result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {},
		...result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {},
		...result.npmTarballName ? { npmTarballName: result.npmTarballName } : {}
	}) });
	if (request.source === "git") return await complete(installPluginFromGitSpec({
		...common,
		spec: request.spec,
		mode: request.mode
	}), { install: (result) => ({
		source: "git",
		spec: request.spec,
		installPath: result.targetDir,
		version: result.version,
		resolvedAt: result.git.resolvedAt,
		gitUrl: result.git.url,
		gitRef: result.git.ref,
		gitCommit: result.git.commit
	}) });
	if (request.source === "clawhub") return await complete(installPluginFromClawHub({
		...common,
		spec: request.spec,
		mode: request.mode,
		...request.expectedPluginId ? { expectedPluginId: request.expectedPluginId } : {},
		...request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {},
		...request.confirmInstall ? { confirmInstall: request.confirmInstall } : {}
	}), {
		expectedPluginId: request.expectedPluginId,
		install: (result) => ({
			...buildClawHubPluginInstallRecordFields(result.clawhub),
			spec: request.recordSpec ?? request.spec,
			installPath: result.targetDir
		})
	});
	const expectedPluginId = request.expectedPluginId;
	return await complete(installPluginFromNpmSpec({
		...common,
		spec: request.spec,
		mode: request.mode,
		...request.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
		...expectedPluginId ? { expectedPluginId } : {},
		...request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {}
	}), {
		expectedPluginId,
		install: (result) => ({
			source: "npm",
			spec: request.pin ? result.npmResolution?.resolvedSpec ?? request.spec : request.recordSpec ?? request.spec,
			installPath: result.targetDir,
			...result.version ? { version: result.version } : {},
			...buildNpmResolutionFields(result.npmResolution)
		})
	});
}
//#endregion
export { installManagedPluginSource };
