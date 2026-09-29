import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatSourceBundledPluginNotice } from "./dev-source-root-b-YTkLfc.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { c as resolvePluginInstallDir } from "./install-paths-DnOgVB7K.mjs";
import { t as auditDeclaredOpenClawHostDependency } from "./plugin-peer-link-C9fwm_tB.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { A as resolvePluginInstallSources, C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, E as isUnavailablePluginSource, T as installWithSourceFallback, k as resolveNpmInstallSpecsForUpdateChannel, w as installWithChannelFallback } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { n as isUnavailableClawHubTarget, t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget, t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { c as resolveTrustedSourceLinkedOfficialNpmInstall, o as resolveTrustedSourceLinkedOfficialClawHubInstall, r as isTrustedOfficialCatalogLookupDuplicate } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as PLUGIN_CAPABILITY_CONSENT_REQUIRED } from "./capability-consent-error-details-CF5XfV3G.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { a as readInstalledPackageVersion, i as readInstalledPackageManifest, r as isPackageVersionDowngrade } from "./package-update-utils-Ds9d2bwt.mjs";
import { s as resolveNpmSpecMetadata } from "./install-source-utils-CeCvRCDR.mjs";
import { _ as resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate, a as isNpmMetadataCompatibleWithCurrentHost, b as shouldSkipUnchangedNpmInstall, c as isTrustedSourceLinkedOfficialNpmUpdate, d as resolveExactNpmSpecVersion, f as resolveNewerExactPinnedClawHubDefaultLine, g as resolveNpmUpdateTarget, h as resolveNpmSpecPackageName, i as isBundledVersionNewer, m as resolveNpmResultVersion, n as formatBetaChannelFallbackOutcomeSuffix, o as isPluginInstallRecordUpdateSource, p as resolveNewerExactPinnedNpmDefaultLine, r as isBridgeRegistryInstall, s as isTrustedSourceLinkedOfficialBridgeNpmInstall, t as expectedIntegrityForNpmUpdate, u as resolveClawHubUpdateSpecs, v as shouldBypassTrustedOfficialUnchangedNpmCheck, y as shouldFallbackBetaClawHubUpdate } from "./update-source-Vnd12AXL.mjs";
import { d as resolveNpmInstallRecordSpec, s as buildNpmResolutionInstallFields, u as recordPluginInstall } from "./installed-plugin-index-records-Clh203og.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { a as isExternalizedBundledPluginEnabled, c as repairOpenClawPeerLinksForNpmInstalls, d as resolveRecordedExtensionsDir, f as userPathsEqual, h as getExternalizedBundledPluginTargetId, i as isBridgeBundledPathRecord, l as repairRegisteredOpenClawHostLink, m as getExternalizedBundledPluginNpmSpec, n as disablePluginAfterUpdateFailure, o as migratePluginConfigId, p as getExternalizedBundledPluginClawHubSpec, r as hasRunnableInstalledNpmPayload, s as removeBridgeBundledLoadPaths, t as buildLoadPathHelpers, u as resolveBridgeInstallRecord } from "./update-config-CmxQI66e.mjs";
import { B as resolvePluginInstallTransaction, F as attachPluginInstallOwnerMigrations, G as withPluginInstallTransactions, H as retainPluginInstallTransaction, L as copyPluginInstallTransactionRequest, U as settlePluginInstallTransactions, V as resolvePluginInstallTransactionRequest } from "./npm-managed-root-BdsMGiX0.mjs";
import { r as installPluginFromNpmSpec } from "./install-Bt8Oq4jr.mjs";
import { a as resolveBundledPluginSources, o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-Bi9l5Ik4.mjs";
import { n as createManagedPluginArtifactConsentHandler, r as prepareManagedPluginArtifactConsentHandler, t as capturePluginCapabilityConsentHandlerErrors } from "./capability-consent-Fw4XtIv4.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as installPluginFromClawHub } from "./clawhub-DyY8io5y.mjs";
import { t as installPluginFromGitSpec } from "./git-install-DOI9Y3PV.mjs";
import { t as installPluginFromMarketplace } from "./marketplace-BOw8f66-.mjs";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-OCtMRgHD.mjs";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-YnpLFoM-.mjs";
//#region src/plugins/update-attempt.ts
function formatNewerExactPinnedNpmDefaultLineMessage(params) {
	return `${params.pluginId} is pinned to ${params.recordedSpec} (installed ${params.currentVersion}); registry ${params.newer.registryLine} resolves to ${params.newer.version}. Pass \`openclaw plugins update ${params.newer.packageName}@${params.newer.registryLine}\` to replace this version pin.`;
}
function formatNewerExactPinnedClawHubDefaultLineMessage(params) {
	const selector = params.newer.registryLine === "beta" ? "@beta" : "";
	return `${params.pluginId} is pinned to ${params.recordedSpec} (installed ${params.currentVersion}); ClawHub ${params.newer.registryLine} resolves to ${params.newer.version}. Pass \`openclaw plugins install clawhub:${params.newer.packageName}${selector} --force\` to replace this version pin.`;
}
function formatNpmInstallFailure(params) {
	if (params.result.code === PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND) return `Failed to ${params.phase} ${params.pluginId}: npm package not found for ${params.spec}.`;
	return `Failed to ${params.phase} ${params.pluginId}: ${params.result.error}`;
}
function formatMarketplaceInstallFailure(params) {
	return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (marketplace plugin ${params.marketplacePlugin} from ${params.marketplaceSource}).`;
}
function formatClawHubInstallFailure(params) {
	return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (ClawHub ${params.spec}).`;
}
function isClawHubDownloadBlocked(result) {
	return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED;
}
function isClawHubSecurityUnavailable(result) {
	return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE;
}
function readClawHubTrustErrorCode(result) {
	if (result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED || result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE) return result.code;
}
function shouldSkipClawHubTrustFailureForExistingInstall(params) {
	if (isClawHubSecurityUnavailable(params.result)) return Boolean(params.currentVersion);
	if (!isClawHubDownloadBlocked(params.result)) return false;
	return Boolean(params.result.version && params.currentVersion && params.result.version !== params.currentVersion);
}
function buildClawHubTrustSkippedOutcome(params) {
	return {
		pluginId: params.pluginId,
		status: "skipped",
		...params.code ? { code: params.code } : {},
		...params.currentVersion ? { currentVersion: params.currentVersion } : {},
		...params.warning ? { warning: params.warning } : {},
		message: `Skipped ${params.pluginId} ClawHub ${params.phase}: ${params.error} Existing installed plugin left unchanged.`
	};
}
function isClawHubTrustSkippedOutcome(outcome) {
	return outcome.status === "skipped" && (outcome.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED || outcome.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE);
}
function formatGitInstallFailure(params) {
	return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (git ${params.spec}).`;
}
function createPluginUpdateIntegrityDriftHandler(params) {
	return async (drift) => {
		const payload = {
			pluginId: params.pluginId,
			spec: drift.spec,
			expectedIntegrity: drift.expectedIntegrity,
			actualIntegrity: drift.actualIntegrity,
			resolvedSpec: drift.resolution.resolvedSpec,
			resolvedVersion: drift.resolution.version,
			dryRun: params.dryRun
		};
		if (params.onIntegrityDrift) return await params.onIntegrityDrift(payload);
		params.logger.warn?.(`Integrity drift for "${params.pluginId}" (${payload.resolvedSpec ?? payload.spec}): expected ${payload.expectedIntegrity}, got ${payload.actualIntegrity}`);
		return false;
	};
}
function isPluginUpdateUnchanged(params) {
	const { record, result, currentVersion, nextVersion } = params;
	const nextCommit = record.source === "git" && "git" in result ? result.git.commit : void 0;
	return record.gitCommit && nextCommit ? record.gitCommit === nextCommit : Boolean(currentVersion && nextVersion && currentVersion === nextVersion);
}
async function buildPluginUpdateVersionOutcome(params) {
	const currentLabel = params.currentVersion ?? "unknown";
	const unchanged = isPluginUpdateUnchanged(params);
	const newerExactPinnedClawHubDefaultLine = unchanged && params.record.source === "clawhub" && params.checkNewerExactPinnedClawHubDefaultLine ? await resolveNewerExactPinnedClawHubDefaultLine({
		currentVersion: params.currentVersion,
		recordedSpec: params.record.spec,
		probeClawHubVersion: params.nextVersion,
		baseUrl: params.record.clawhubUrl,
		updateChannel: params.updateChannel,
		timeoutMs: params.timeoutMs
	}) : void 0;
	const verb = isPackageVersionDowngrade(params.currentVersion, params.nextVersion) ? "Downgraded" : "Updated";
	return {
		pluginId: params.pluginId,
		status: unchanged ? "unchanged" : "updated",
		currentVersion: params.currentVersion,
		nextVersion: newerExactPinnedClawHubDefaultLine?.version ?? params.nextVersion,
		message: unchanged ? newerExactPinnedClawHubDefaultLine && params.record.spec ? formatNewerExactPinnedClawHubDefaultLineMessage({
			pluginId: params.pluginId,
			recordedSpec: params.record.spec,
			currentVersion: currentLabel,
			newer: newerExactPinnedClawHubDefaultLine
		}) + params.channelFallbackSuffix : `${params.pluginId} already at ${currentLabel}.${params.channelFallbackSuffix}` : `${verb} ${params.pluginId}: ${currentLabel} -> ${params.nextVersion ?? "unknown"}.${params.channelFallbackSuffix}`,
		...params.channelFallback ? { channelFallback: params.channelFallback } : {}
	};
}
async function buildDryRunPluginUpdateOutcome(params) {
	const npmProbeVersion = params.record.source === "npm" ? resolveNpmResultVersion(params.result) : void 0;
	const resolvedProbeVersion = params.result.version ?? npmProbeVersion ?? (params.record.source === "npm" ? resolveExactNpmSpecVersion(params.effectiveSpec) : void 0);
	const nextVersion = resolvedProbeVersion ?? "unknown";
	const currentLabel = params.currentVersion ?? "unknown";
	const unchanged = isPluginUpdateUnchanged({
		...params,
		nextVersion: resolvedProbeVersion
	});
	const newerExactPinnedDefaultLine = unchanged && params.record.source === "npm" && !params.hasSpecOverride ? await resolveNewerExactPinnedNpmDefaultLine({
		currentVersion: params.currentVersion,
		recordedSpec: params.record.spec,
		probeNpmVersion: npmProbeVersion,
		updateChannel: params.updateChannel,
		timeoutMs: params.timeoutMs
	}) : void 0;
	const newerExactPinnedClawHubDefaultLine = unchanged && params.record.source === "clawhub" && params.checkNewerExactPinnedClawHubDefaultLine ? await resolveNewerExactPinnedClawHubDefaultLine({
		currentVersion: params.currentVersion,
		recordedSpec: params.record.spec,
		probeClawHubVersion: resolvedProbeVersion,
		baseUrl: params.record.clawhubUrl,
		updateChannel: params.updateChannel,
		timeoutMs: params.timeoutMs
	}) : void 0;
	if (unchanged) {
		const message = newerExactPinnedDefaultLine && params.record.spec ? formatNewerExactPinnedNpmDefaultLineMessage({
			pluginId: params.pluginId,
			recordedSpec: params.record.spec,
			currentVersion: currentLabel,
			newer: newerExactPinnedDefaultLine
		}) + params.channelFallbackSuffix : newerExactPinnedClawHubDefaultLine && params.record.spec ? formatNewerExactPinnedClawHubDefaultLineMessage({
			pluginId: params.pluginId,
			recordedSpec: params.record.spec,
			currentVersion: currentLabel,
			newer: newerExactPinnedClawHubDefaultLine
		}) + params.channelFallbackSuffix : `${params.pluginId} is up to date (${currentLabel}).${params.channelFallbackSuffix}`;
		return {
			pluginId: params.pluginId,
			status: "unchanged",
			currentVersion: params.currentVersion,
			nextVersion: newerExactPinnedDefaultLine?.version ?? newerExactPinnedClawHubDefaultLine?.version ?? resolvedProbeVersion,
			message
		};
	}
	const verb = isPackageVersionDowngrade(params.currentVersion, resolvedProbeVersion) ? "Would downgrade" : "Would update";
	return {
		pluginId: params.pluginId,
		status: "updated",
		currentVersion: params.currentVersion,
		nextVersion: resolvedProbeVersion,
		message: `${verb} ${params.pluginId}: ${currentLabel} -> ${nextVersion}.${params.channelFallbackSuffix}`
	};
}
async function runPluginUpdateAttempt(params) {
	const dryRunOption = params.dryRun ? { dryRun: true } : {};
	const phase = params.dryRun ? "check" : "update";
	const installNpmSpec = params.dryRun ? installPluginFromNpmSpec : params.installNpmSpecForUpdate;
	const installParams = (value) => copyPluginInstallTransactionRequest(params, value);
	let result;
	try {
		result = params.record.source === "npm" ? await installNpmSpec(installParams({
			spec: params.effectiveSpec,
			config: params.config,
			mode: "update",
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			...dryRunOption,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
			expectedPluginId: params.pluginId,
			expectedReplacementPluginId: params.expectedReplacementPluginId,
			expectedIntegrity: params.expectedIntegrity,
			onIntegrityDrift: createPluginUpdateIntegrityDriftHandler({
				pluginId: params.pluginId,
				dryRun: params.dryRun,
				logger: params.logger,
				onIntegrityDrift: params.onIntegrityDrift
			}),
			logger: params.logger
		})) : params.record.source === "clawhub" ? await installPluginFromClawHub(installParams({
			spec: params.effectiveSpec ?? `clawhub:${params.record.clawhubPackage}`,
			config: params.config,
			baseUrl: params.record.clawhubUrl,
			mode: "update",
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			...dryRunOption,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			expectedPluginId: params.pluginId,
			logger: params.logger
		})) : params.record.source === "git" ? await installPluginFromGitSpec(installParams({
			spec: params.effectiveSpec,
			config: params.config,
			mode: "update",
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			...dryRunOption,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			expectedPluginId: params.pluginId,
			logger: params.logger
		})) : await installPluginFromMarketplace(installParams({
			marketplace: params.record.marketplaceSource,
			plugin: params.record.marketplacePlugin,
			config: params.config,
			mode: "update",
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			...dryRunOption,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			expectedPluginId: params.pluginId,
			logger: params.logger
		}));
	} catch (error) {
		return {
			kind: "exception",
			message: `Failed to ${phase} ${params.pluginId}: ${String(error)}`,
			error
		};
	}
	let activeClawHubInstallSpec = params.effectiveSpec;
	let channelFallbackSuffix = "";
	const resultSource = params.record.source;
	if (!result.ok && params.record.source === "clawhub" && params.clawhubSpecs?.fallbackSpec && shouldFallbackBetaClawHubUpdate(result)) {
		channelFallbackSuffix = formatBetaChannelFallbackOutcomeSuffix({
			fallbackLabel: params.clawhubSpecs.fallbackLabel ?? params.effectiveSpec,
			fallbackSpec: params.clawhubSpecs.fallbackSpec,
			verb: params.dryRun ? "would use" : "used"
		});
		params.logger.info?.(`Plugin "${params.pluginId}" has no beta ClawHub release for ${params.clawhubSpecs.fallbackLabel ?? params.effectiveSpec}; using ${params.clawhubSpecs.fallbackSpec} instead. Core update can still complete.`);
		result = await installPluginFromClawHub(installParams({
			spec: params.clawhubSpecs.fallbackSpec,
			config: params.config,
			baseUrl: params.record.clawhubUrl,
			mode: "update",
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			...dryRunOption,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			expectedPluginId: params.pluginId,
			logger: params.logger
		}));
		activeClawHubInstallSpec = params.clawhubSpecs.fallbackSpec;
	}
	return {
		kind: "result",
		result,
		activeClawHubInstallSpec,
		channelFallbackSuffix,
		resultSource
	};
}
//#endregion
//#region src/plugins/update-capability-consent.ts
function preparePluginUpdateCapabilityConsent(params) {
	const consent = createManagedPluginArtifactConsentHandler({
		config: params.config,
		source: params.record.source,
		spec: params.record.spec,
		expectedIntegrity: params.expectedIntegrity,
		previousRecords: { [params.pluginId]: {
			...params.record,
			installPath: params.installPath
		} },
		updatingPluginIds: params.packagePluginIds ?? [],
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	let reviewedPluginId = params.pluginId;
	return {
		onBeforePluginArtifactCommit: async (artifact) => {
			reviewedPluginId = artifact.pluginId;
			await consent.onBeforePluginArtifactCommit({
				...artifact,
				currentArtifactDir: params.installPath,
				mode: "update"
			});
		},
		acceptInstallRecord: (record) => consent.applyAcceptedSurface(reviewedPluginId, record)
	};
}
//#endregion
//#region src/plugins/update-claw-lifecycle.ts
function resolveRecordedClawHubPackage(record) {
	if (record.source !== "clawhub") return;
	return record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name ?? parseClawHubPluginSpec(record.resolvedSpec ?? "")?.name;
}
function createTrackedNpmUpdateInstaller(onRun) {
	return async (params) => {
		onRun();
		return await installPluginFromNpmSpec(params);
	};
}
async function runPluginUpdateWithClawHubLease(params) {
	try {
		if (!params.clawhubPackage || params.dryRun) return await params.run();
		return await withClawPackageLifecycleLease({
			kind: "plugin",
			source: "clawhub",
			ref: params.clawhubPackage
		}, async () => {
			params.beforePersistentEffect?.();
			markClawPackageIndependentlyOwned({
				kind: "plugin",
				source: "clawhub",
				ref: params.clawhubPackage
			});
			return await params.run();
		}, { required: true });
	} catch (error) {
		return {
			kind: "exception",
			message: `Failed to update ${params.pluginId}: ${error instanceof Error ? error.message : String(error)}`,
			error
		};
	}
}
//#endregion
//#region src/plugins/update-duplicate-aliases.ts
function stageDuplicateNpmPluginAlias(params) {
	const replacementPluginId = params.replacementPluginId;
	if (!replacementPluginId || replacementPluginId === params.pluginId || !Object.hasOwn(params.installs, replacementPluginId)) return false;
	if (isTrustedOfficialCatalogLookupDuplicate({
		pluginId: params.pluginId,
		replacementPluginId,
		replacementRecord: params.installs[replacementPluginId]
	})) {
		params.aliases.set(params.pluginId, replacementPluginId);
		if (!params.skipIds?.has(replacementPluginId)) params.targets.add(replacementPluginId);
	} else params.outcomes.push({
		pluginId: params.pluginId,
		status: "error",
		message: `Cannot replace "${params.pluginId}" with "${replacementPluginId}" because both plugin install records exist. Remove one of the conflicting installs, then retry the update.`
	});
	return true;
}
async function hasRunnableRecordedPayload(config, pluginId) {
	const record = config.plugins?.installs?.[pluginId];
	if (!record) return false;
	try {
		const installPath = resolveUserPath(record.installPath?.trim() || resolvePluginInstallDir(pluginId));
		const manifest = readInstalledPackageManifest(installPath);
		return await hasRunnableInstalledNpmPayload({
			installPath,
			manifest
		});
	} catch {
		return false;
	}
}
async function reconcileDuplicateNpmPluginAliases(params) {
	let config = params.config;
	let changed = false;
	for (const [aliasPluginId, canonicalPluginId] of params.aliases) {
		if (!(params.completedCanonicalUpdates.has(canonicalPluginId) || params.skipIds?.has(canonicalPluginId)) || !params.dryRun && !await hasRunnableRecordedPayload(config, canonicalPluginId)) {
			params.outcomes.push({
				pluginId: aliasPluginId,
				status: "skipped",
				message: `Kept duplicate "${aliasPluginId}" install record because "${canonicalPluginId}" did not complete a runnable canonical update.`
			});
			continue;
		}
		if (!params.dryRun) {
			config = migratePluginConfigId(config, aliasPluginId, canonicalPluginId);
			changed = true;
			params.installOwnerMigrations[aliasPluginId] = canonicalPluginId;
		}
		params.outcomes.push({
			pluginId: aliasPluginId,
			status: "skipped",
			message: `${params.dryRun ? "Would remove" : "Removed"} duplicate "${aliasPluginId}" install record; "${canonicalPluginId}" is the canonical plugin id.`
		});
	}
	return {
		config,
		changed
	};
}
//#endregion
//#region src/plugins/update-summary.ts
function recordPluginUpdateFailure(params) {
	const options = params.options ?? {};
	const preserveInstalledPayload = options.code === PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE && options.installedPayloadRunnable === true;
	if (params.disableOnFailure && !params.dryRun && !preserveInstalledPayload) {
		const message = `Disabled "${params.pluginId}" after plugin update failure; OpenClaw will continue without it. ` + params.message;
		params.logger.warn?.(message);
		params.outcomes.push({
			pluginId: params.pluginId,
			status: "skipped",
			message,
			...options.channelFallback ? { channelFallback: options.channelFallback } : {}
		});
		return {
			config: disablePluginAfterUpdateFailure(params.config, params.pluginId),
			changed: true
		};
	}
	params.outcomes.push({
		pluginId: params.pluginId,
		status: "error",
		message: params.message,
		...options.channelFallback ? { channelFallback: options.channelFallback } : {}
	});
	return {
		config: params.config,
		changed: false
	};
}
function createPluginUpdateTransactionState(params) {
	return {
		transactions: [],
		installOwnerMigrations: {},
		transactionSink: resolvePluginInstallTransactionRequest(params)?.transactionSink
	};
}
function recordPluginUpdateTransaction(state, result, pluginId, resolvedPluginId) {
	const transaction = resolvePluginInstallTransaction(result);
	if (transaction) {
		state.transactions.push(transaction);
		state.transactionSink?.push(transaction);
	}
	if (resolvedPluginId !== pluginId) state.installOwnerMigrations[pluginId] = resolvedPluginId;
}
async function finalizePluginUpdateSummary(params) {
	let changed = params.changed;
	if (params.ranNpmInstaller) try {
		changed = await repairOpenClawPeerLinksForNpmInstalls({
			config: params.config,
			logger: params.logger,
			beforePersistentEffect: params.beforePersistentEffect
		}) || changed;
	} catch (error) {
		await settlePluginInstallTransactions(params.transactionState.transactions, "rollback", { error });
		throw error;
	}
	const summary = {
		config: params.config,
		changed,
		outcomes: params.outcomes
	};
	return Object.keys(params.transactionState.installOwnerMigrations).length > 0 ? attachPluginInstallOwnerMigrations(summary, params.transactionState.installOwnerMigrations) : summary;
}
//#endregion
//#region src/plugins/update-unchanged.ts
async function reconcileUnchangedUpdate(params) {
	const newerExactPinnedDefaultLine = !params.hasSpecOverride ? await resolveNewerExactPinnedNpmDefaultLine({
		currentVersion: params.currentVersion,
		recordedSpec: params.record.spec,
		probeNpmVersion: params.resolution.version,
		updateChannel: params.updateChannel,
		timeoutMs: params.timeoutMs
	}) : void 0;
	let config = params.config;
	let changed = false;
	if (params.syncOfficialInstall || params.hasSpecOverride) {
		const nextRecordSpec = params.recordSpec;
		if (nextRecordSpec !== params.record.spec) {
			const resolutionFields = buildNpmResolutionInstallFields(params.resolution);
			config = {
				...config,
				plugins: {
					...config.plugins,
					installs: {
						...config.plugins?.installs,
						[params.pluginId]: {
							...params.record,
							spec: nextRecordSpec,
							resolvedName: resolutionFields.resolvedName ?? params.record.resolvedName,
							resolvedVersion: resolutionFields.resolvedVersion ?? params.record.resolvedVersion,
							resolvedSpec: resolutionFields.resolvedSpec ?? params.record.resolvedSpec,
							integrity: resolutionFields.integrity ?? params.record.integrity,
							shasum: resolutionFields.shasum ?? params.record.shasum,
							resolvedAt: resolutionFields.resolvedAt ?? params.record.resolvedAt
						}
					}
				}
			};
			changed = true;
		}
	}
	return {
		config,
		changed,
		outcome: {
			pluginId: params.pluginId,
			status: "unchanged",
			currentVersion: params.currentVersion,
			nextVersion: newerExactPinnedDefaultLine?.version ?? params.resolution.version,
			message: newerExactPinnedDefaultLine && params.record.spec ? formatNewerExactPinnedNpmDefaultLineMessage({
				pluginId: params.pluginId,
				recordedSpec: params.record.spec,
				currentVersion: params.currentVersion,
				newer: newerExactPinnedDefaultLine
			}) : `${params.pluginId} is up to date (${params.currentVersion}).`
		}
	};
}
//#endregion
//#region src/plugins/update-installed.ts
async function updateNpmInstalledPlugins(params) {
	if (params.dryRun) return await runInstalledPluginUpdate(params);
	return await withPluginLifecycleLease({}, (lease) => withPluginInstallTransactions(params, () => lease.assertOwned(), runInstalledPluginUpdate));
}
async function runInstalledPluginUpdate(params, assertCurrent) {
	const logger = params.logger ?? {};
	const retainOnUnavailable = params.retainOnUnavailable === true;
	const consentCallbacks = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const installs = params.config.plugins?.installs ?? {};
	const targets = new Set(params.pluginIds?.length ? params.pluginIds : Object.keys(installs));
	const normalizedPluginConfig = params.skipDisabledPlugins ? normalizePluginsConfig(params.config.plugins) : void 0;
	const bundled = resolveBundledPluginSources({});
	const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
		config: params.config,
		installRecords: installs,
		bundledSources: bundled
	});
	const outcomes = [];
	const transactionState = createPluginUpdateTransactionState(params);
	let next = params.config;
	let changed = false;
	let ranNpmInstaller = false;
	const installNpmSpecForUpdate = createTrackedNpmUpdateInstaller(() => {
		ranNpmInstaller = true;
	});
	const recordSkippedOutcome = (pluginId, message) => {
		outcomes.push({
			pluginId,
			status: "skipped",
			message
		});
	};
	const recordFailure = (pluginId, message, options = {}) => {
		const failure = recordPluginUpdateFailure({
			config: next,
			disableOnFailure: params.disableOnFailure,
			dryRun: params.dryRun,
			logger,
			outcomes,
			pluginId,
			message,
			options
		});
		next = failure.config;
		changed ||= failure.changed;
	};
	const duplicateAliases = /* @__PURE__ */ new Map();
	const completedCanonicalUpdates = /* @__PURE__ */ new Set();
	for (const pluginId of targets) {
		if (params.skipIds?.has(pluginId)) {
			recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (already updated).`);
			continue;
		}
		const record = Object.hasOwn(installs, pluginId) ? installs[pluginId] : void 0;
		if (!record) {
			recordSkippedOutcome(pluginId, `No install record for "${pluginId}".`);
			continue;
		}
		if (sourceBundledIds.has(pluginId)) {
			const message = formatSourceBundledPluginNotice(pluginId);
			outcomes.push({
				pluginId,
				status: "unchanged",
				code: "source-bundled-plugin",
				message
			});
			logger.warn?.(message);
			continue;
		}
		const trustedOfficialNpmInstall = resolveTrustedSourceLinkedOfficialNpmInstall({
			pluginId,
			record
		});
		const replacementPluginId = trustedOfficialNpmInstall?.replacementPluginId;
		if (stageDuplicateNpmPluginAlias({
			pluginId,
			replacementPluginId,
			installs,
			aliases: duplicateAliases,
			targets,
			skipIds: params.skipIds,
			outcomes
		})) continue;
		const trustedOfficialNpmSpec = trustedOfficialNpmInstall?.npmSpec;
		const trustedOfficialClawHubInstall = resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		});
		const recordClawHubPackage = resolveRecordedClawHubPackage(record);
		const officialNpmSpec = params.syncOfficialPluginInstalls ? trustedOfficialNpmSpec : void 0;
		const officialClawHubSpec = params.syncOfficialPluginInstalls ? trustedOfficialClawHubInstall?.clawhubSpec : void 0;
		const updateChannel = params.updateChannel ?? (trustedOfficialNpmSpec || trustedOfficialClawHubInstall ? params.officialPluginUpdateChannel : void 0);
		const { specOverride: npmSpecOverride, target: npmTarget } = resolveNpmUpdateTarget({
			...params,
			record,
			trustedOfficialInstall: trustedOfficialNpmInstall,
			specOverride: params.specOverrides?.[pluginId],
			installSpecOverride: params.npmInstallSpecOverrides?.[pluginId],
			updateChannel,
			versionBoundToCore: params.versionBoundPluginIds?.has(pluginId)
		});
		if (normalizedPluginConfig) {
			const enableState = resolveEffectiveEnableState({
				id: pluginId,
				origin: "global",
				config: normalizedPluginConfig,
				rootConfig: params.config
			});
			if (!enableState.enabled && !officialNpmSpec && !officialClawHubSpec) {
				recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (${enableState.reason ?? "disabled by plugin config"}).`);
				continue;
			}
		}
		if (!isPluginInstallRecordUpdateSource(record)) {
			recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (source: ${record.source}).`);
			continue;
		}
		let npmSpecs;
		let npmResolutionError;
		try {
			npmSpecs = record.source === "npm" && npmTarget ? await resolveNpmInstallSpecsForUpdateChannel(npmTarget) : void 0;
		} catch (error) {
			if (!(error instanceof NpmChannelResolutionError)) throw error;
			if (!retainOnUnavailable) {
				outcomes.push({
					pluginId,
					status: "error",
					code: error.code,
					message: error.message
				});
				continue;
			}
			npmResolutionError = error;
		}
		const clawhubSpecs = record.source === "clawhub" ? resolveClawHubUpdateSpecs({
			record,
			officialSpec: trustedOfficialClawHubInstall?.clawhubSpec,
			officialSpecOverride: officialClawHubSpec,
			updateChannel,
			officialPackageName: trustedOfficialClawHubInstall ? recordClawHubPackage : void 0,
			coreVersion: params.coreVersion,
			versionBoundToCore: params.versionBoundPluginIds?.has(pluginId)
		}) : void 0;
		const effectiveSpec = record.source === "npm" ? npmSpecs?.installSpec ?? npmTarget?.spec : record.source === "clawhub" ? clawhubSpecs?.installSpec : record.spec;
		const catalogExpectedIntegrity = trustedOfficialNpmInstall && effectiveSpec === trustedOfficialNpmInstall.npmSpec ? trustedOfficialNpmInstall.expectedIntegrity?.trim() : void 0;
		const recordSpec = record.source === "npm" ? npmSpecs?.recordSpec : record.source === "clawhub" ? clawhubSpecs?.recordSpec : record.spec;
		const trustedSourceLinkedOfficialInstall = isTrustedSourceLinkedOfficialNpmUpdate({
			pluginId,
			spec: effectiveSpec,
			record
		});
		let expectedIntegrity = catalogExpectedIntegrity ?? expectedIntegrityForNpmUpdate({
			effectiveSpec,
			record,
			trustedSourceLinkedOfficialInstall
		});
		if ((record.source === "npm" || record.source === "git") && !effectiveSpec) {
			recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (missing ${record.source} spec).`);
			continue;
		}
		if (record.source === "clawhub" && !recordClawHubPackage && !officialClawHubSpec) {
			recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (missing ClawHub package metadata).`);
			continue;
		}
		if (record.source === "clawhub" || record.source === "marketplace") {
			const bundledSource = bundled.get(pluginId);
			if (bundledSource?.version && record.version && isBundledVersionNewer(bundledSource.version, record.version)) {
				logger.warn?.(`Skipping "${pluginId}" update: bundled version ${bundledSource.version} is newer than the installed ${record.source} version ${record.version}. Uninstall the ${record.source} plugin to use the bundled version, or pin a newer version explicitly.`);
				recordSkippedOutcome(pluginId, `Skipping "${pluginId}": bundled version ${bundledSource.version} is newer than ${record.source} version ${record.version}.`);
				continue;
			}
		}
		if (record.source === "marketplace" && (!record.marketplaceSource || !record.marketplacePlugin)) {
			recordSkippedOutcome(pluginId, `Skipping "${pluginId}" (missing marketplace source metadata).`);
			continue;
		}
		let installPath;
		try {
			installPath = resolveUserPath(record.installPath?.trim() || resolvePluginInstallDir(pluginId));
		} catch (err) {
			recordFailure(pluginId, `Invalid install path for "${pluginId}": ${String(err)}`);
			continue;
		}
		let currentVersion;
		let installedManifest;
		try {
			installedManifest = readInstalledPackageManifest(installPath);
			currentVersion = typeof installedManifest?.version === "string" ? installedManifest.version : void 0;
		} catch (err) {
			recordFailure(pluginId, `Failed to inspect installed package for ${pluginId}: ${String(err)}`);
			continue;
		}
		if (!params.dryRun && record.source === "npm" && currentVersion) changed = await repairRegisteredOpenClawHostLink({
			pluginId,
			record,
			logger,
			beforePersistentEffect: assertCurrent
		}) || changed;
		const recordNpmFailure = async (message, code) => {
			let installedPayloadRunnable = false;
			if ((code === PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE || retainOnUnavailable && isUnavailablePluginSource("npm", {
				ok: false,
				code
			})) && (params.disableOnFailure || retainOnUnavailable) && !params.dryRun && currentVersion) {
				const compatible = !retainOnUnavailable || isNpmMetadataCompatibleWithCurrentHost({ packageOpenClaw: installedManifest?.openclaw }, {
					hostVersion: params.coreVersion,
					allowLegacyBareSemver: true
				});
				try {
					installedPayloadRunnable = compatible && await hasRunnableInstalledNpmPayload({
						installPath,
						manifest: installedManifest
					});
				} catch {}
			}
			if (retainOnUnavailable && installedPayloadRunnable) {
				const retainedMessage = `Retained "${pluginId}" at ${currentVersion}: target ${effectiveSpec}${params.coreVersion ? ` for OpenClaw ${params.coreVersion}` : ""} is unavailable. ${message} Retry "${formatCliCommand(`openclaw plugins update ${pluginId}`)}" after the target is published or registry access recovers.`;
				logger.warn?.(retainedMessage);
				outcomes.push({
					pluginId,
					status: "unchanged",
					code: "plugin-target-unavailable",
					currentVersion,
					message: retainedMessage
				});
				return;
			}
			recordFailure(pluginId, message, {
				code,
				installedPayloadRunnable
			});
		};
		if (npmResolutionError) {
			await recordNpmFailure(npmResolutionError.message, npmResolutionError.code);
			continue;
		}
		const extensionsDir = resolveRecordedExtensionsDir({
			pluginId,
			installPath
		});
		if (!params.dryRun && record.source === "npm" && (currentVersion || params.syncOfficialPluginInstalls && trustedSourceLinkedOfficialInstall)) {
			const metadataResult = npmSpecs?.npmResolution ? {
				ok: true,
				metadata: npmSpecs.npmResolution
			} : await resolveNpmSpecMetadata({
				spec: effectiveSpec,
				timeoutMs: params.timeoutMs
			});
			if (metadataResult.ok) {
				const bypassTrustedOfficialUnchangedNpmCheck = shouldBypassTrustedOfficialUnchangedNpmCheck({
					metadata: metadataResult.metadata,
					spec: effectiveSpec,
					trustedSourceLinkedOfficialInstall
				});
				const trustedPrereleaseFallback = trustedSourceLinkedOfficialInstall ? await resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate({
					metadata: metadataResult.metadata,
					spec: effectiveSpec,
					timeoutMs: params.timeoutMs
				}) : void 0;
				const expectedIntegrityMetadata = trustedPrereleaseFallback?.metadata ?? metadataResult.metadata;
				expectedIntegrity = catalogExpectedIntegrity ?? expectedIntegrityForNpmUpdate({
					effectiveSpec,
					metadata: expectedIntegrityMetadata,
					record,
					trustedSourceLinkedOfficialInstall
				});
				if (!catalogExpectedIntegrity && (!isNpmMetadataCompatibleWithCurrentHost(expectedIntegrityMetadata) || bypassTrustedOfficialUnchangedNpmCheck && !trustedPrereleaseFallback)) expectedIntegrity = void 0;
				if (currentVersion && !bypassTrustedOfficialUnchangedNpmCheck && isNpmMetadataCompatibleWithCurrentHost(metadataResult.metadata) && !await auditDeclaredOpenClawHostDependency({
					packageDir: installPath,
					packageName: pluginId
				}) && shouldSkipUnchangedNpmInstall({
					currentVersion,
					record,
					metadata: metadataResult.metadata
				})) {
					const unchanged = await reconcileUnchangedUpdate({
						config: next,
						pluginId,
						record,
						currentVersion,
						recordSpec,
						resolution: metadataResult.metadata,
						updateChannel,
						timeoutMs: params.timeoutMs,
						hasSpecOverride: Boolean(npmSpecOverride),
						syncOfficialInstall: Boolean(params.syncOfficialPluginInstalls && trustedSourceLinkedOfficialInstall)
					});
					next = unchanged.config;
					changed ||= unchanged.changed;
					outcomes.push(unchanged.outcome);
					completedCanonicalUpdates.add(pluginId);
					continue;
				}
			} else {
				if (retainOnUnavailable || !parseRegistryNpmSpec(effectiveSpec)) {
					const code = metadataResult.category === "metadata-env" ? PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE : PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND;
					await recordNpmFailure(`Failed to check ${pluginId}: ${metadataResult.error}`, code);
					continue;
				}
				logger.info?.(`Could not check ${pluginId} before update; falling back to installer path: ${metadataResult.error}`);
			}
		}
		const capabilityConsent = preparePluginUpdateCapabilityConsent({
			config: params.config,
			pluginId,
			record,
			installPath,
			packagePluginIds: params.packagePluginIds?.[pluginId],
			expectedIntegrity,
			onCapabilityConsent: consentCallbacks.onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		const runAttempt = () => runPluginUpdateAttempt(copyPluginInstallTransactionRequest(params, {
			pluginId,
			record,
			config: params.config,
			dryRun: params.dryRun === true,
			effectiveSpec,
			extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit,
			expectedIntegrity,
			clawhubSpecs,
			trustedSourceLinkedOfficialInstall,
			expectedReplacementPluginId: replacementPluginId,
			installNpmSpecForUpdate,
			logger,
			onIntegrityDrift: params.onIntegrityDrift
		}));
		const attempt = await runPluginUpdateWithClawHubLease({
			pluginId,
			clawhubPackage: recordClawHubPackage,
			dryRun: params.dryRun === true,
			run: runAttempt,
			beforePersistentEffect: assertCurrent
		});
		consentCallbacks.rethrowCallbackError();
		if (attempt.kind === "exception") {
			const error = attempt.error;
			if (error instanceof ManagedPluginLifecycleError && error.capabilityConsent) {
				outcomes.push({
					pluginId,
					status: "error",
					code: PLUGIN_CAPABILITY_CONSENT_REQUIRED,
					message: error.message
				});
				continue;
			}
			if (error instanceof ManagedPluginLifecycleError && error.kind === "invalid-request") throw error;
			recordFailure(pluginId, attempt.message);
			continue;
		}
		const { result, activeClawHubInstallSpec, channelFallbackSuffix, resultSource } = attempt;
		if (!result.ok) {
			if (record.source === "clawhub" && shouldSkipClawHubTrustFailureForExistingInstall({
				result,
				currentVersion
			})) {
				const code = readClawHubTrustErrorCode(result);
				if (!code) continue;
				outcomes.push(buildClawHubTrustSkippedOutcome({
					pluginId,
					phase: params.dryRun ? "check" : "update",
					error: result.error,
					code,
					..."warning" in result && result.warning ? { warning: result.warning } : {},
					...currentVersion ? { currentVersion } : {}
				}));
				continue;
			}
			const phase = params.dryRun ? "check" : "update";
			const code = resultSource === "npm" && "code" in result ? result.code : void 0;
			await recordNpmFailure(resultSource === "npm" ? formatNpmInstallFailure({
				pluginId,
				spec: effectiveSpec,
				phase,
				result
			}) : resultSource === "clawhub" ? formatClawHubInstallFailure({
				pluginId,
				spec: activeClawHubInstallSpec ?? `clawhub:${record.clawhubPackage}`,
				phase,
				error: result.error
			}) : record.source === "git" ? formatGitInstallFailure({
				pluginId,
				spec: effectiveSpec,
				phase,
				error: result.error
			}) : formatMarketplaceInstallFailure({
				pluginId,
				marketplaceSource: record.marketplaceSource,
				marketplacePlugin: record.marketplacePlugin,
				phase,
				error: result.error
			}), code);
			continue;
		}
		if (params.dryRun) {
			outcomes.push(await buildDryRunPluginUpdateOutcome({
				pluginId,
				record,
				result,
				currentVersion,
				effectiveSpec,
				hasSpecOverride: Boolean(npmSpecOverride),
				updateChannel,
				timeoutMs: params.timeoutMs,
				channelFallbackSuffix,
				checkNewerExactPinnedClawHubDefaultLine: Boolean(trustedOfficialClawHubInstall) && recordSpec === record.spec
			}));
			completedCanonicalUpdates.add(pluginId);
			continue;
		}
		const resolvedPluginId = result.pluginId;
		recordPluginUpdateTransaction(transactionState, result, pluginId, resolvedPluginId);
		if (resolvedPluginId !== pluginId) next = migratePluginConfigId(next, pluginId, resolvedPluginId);
		const nextVersion = result.version ?? await readInstalledPackageVersion(result.targetDir);
		let installRecord;
		if (resultSource === "npm") installRecord = {
			source: "npm",
			spec: recordSpec,
			...buildNpmResolutionInstallFields(result.npmResolution)
		};
		else if (resultSource === "clawhub") installRecord = {
			...buildClawHubPluginInstallRecordFields(result.clawhub),
			spec: recordSpec ?? record.spec ?? `clawhub:${record.clawhubPackage}`
		};
		else if (record.source === "git") {
			const gitResult = result;
			installRecord = {
				source: "git",
				spec: effectiveSpec ?? record.spec,
				resolvedAt: gitResult.git.resolvedAt,
				gitUrl: gitResult.git.url,
				gitRef: gitResult.git.ref,
				gitCommit: gitResult.git.commit
			};
		} else installRecord = {
			source: "marketplace",
			marketplaceName: result.marketplaceName ?? record.marketplaceName,
			marketplaceSource: record.marketplaceSource,
			marketplacePlugin: record.marketplacePlugin
		};
		next = recordPluginInstall(next, capabilityConsent.acceptInstallRecord({
			pluginId: resolvedPluginId,
			...installRecord,
			installPath: result.targetDir,
			version: nextVersion
		}));
		changed = true;
		completedCanonicalUpdates.add(pluginId);
		outcomes.push(await buildPluginUpdateVersionOutcome({
			pluginId,
			record,
			result,
			currentVersion,
			nextVersion,
			channelFallbackSuffix,
			checkNewerExactPinnedClawHubDefaultLine: Boolean(trustedOfficialClawHubInstall) && recordSpec === record.spec,
			updateChannel,
			timeoutMs: params.timeoutMs
		}));
	}
	const duplicateReconciliation = await reconcileDuplicateNpmPluginAliases({
		config: next,
		aliases: duplicateAliases,
		completedCanonicalUpdates,
		skipIds: params.skipIds,
		dryRun: params.dryRun,
		outcomes,
		installOwnerMigrations: transactionState.installOwnerMigrations
	});
	next = duplicateReconciliation.config;
	changed ||= duplicateReconciliation.changed;
	return await finalizePluginUpdateSummary({
		config: next,
		changed,
		outcomes,
		ranNpmInstaller,
		logger,
		transactionState,
		beforePersistentEffect: assertCurrent
	});
}
//#endregion
//#region src/plugins/update-channel.ts
async function syncPluginsForUpdateChannel(params) {
	return await withPluginLifecycleLease({
		env: params.env,
		assertCurrent: params.beforePersistentEffect
	}, (lease) => withPluginInstallTransactions(params, () => lease.assertOwned(), syncPluginsForUpdateChannelWithLease));
}
async function syncPluginsForUpdateChannelWithLease(params) {
	const env = params.env ?? process.env;
	const logger = params.logger ?? {};
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const summary = {
		switchedToBundled: [],
		switchedToClawHub: [],
		switchedToNpm: [],
		warnings: [],
		errors: []
	};
	const bundled = resolveBundledPluginSources({
		workspaceDir: params.workspaceDir,
		env
	});
	let next = params.config;
	const loadHelpers = buildLoadPathHelpers(next.plugins?.load?.paths ?? [], env);
	let installs = next.plugins?.installs ?? {};
	let changed = false;
	const retainedLinks = /* @__PURE__ */ new Set();
	for (const [pluginId, record] of Object.entries(installs)) {
		const bundledInfo = bundled.get(pluginId);
		if (params.skipIds?.has(pluginId) || record.source !== "path" || !bundledInfo) continue;
		const linkedPath = loadHelpers.paths.find((loadPath) => !userPathsEqual(loadPath, bundledInfo.localPath, env) && (userPathsEqual(loadPath, record.sourcePath, env) || userPathsEqual(loadPath, record.installPath, env)));
		if (!linkedPath) continue;
		retainedLinks.add(pluginId);
		const warning = `Retained linked plugin "${pluginId}" at ${linkedPath}; update this plugin at its source.`;
		summary.warnings.push(warning);
		logger.warn?.(warning);
	}
	if (params.channel === "dev") for (const [pluginId, record] of Object.entries(installs)) {
		const bundledInfo = bundled.get(pluginId);
		if (!bundledInfo || retainedLinks.has(pluginId) || params.skipIds?.has(pluginId)) continue;
		loadHelpers.addPath(bundledInfo.localPath);
		if (record.source === "path" && userPathsEqual(record.sourcePath, bundledInfo.localPath, env)) continue;
		next = recordPluginInstall(next, {
			pluginId,
			source: "path",
			sourcePath: bundledInfo.localPath,
			installPath: bundledInfo.localPath,
			spec: record.spec ?? bundledInfo.npmSpec,
			version: record.version
		});
		summary.switchedToBundled.push(pluginId);
		changed = true;
	}
	else {
		const bridges = params.externalizedBundledPluginBridges ?? [];
		for (const bridge of bridges) {
			const targetPluginId = getExternalizedBundledPluginTargetId(bridge);
			if (bundled.get(bridge.bundledPluginId)) continue;
			const existing = resolveBridgeInstallRecord({
				installs,
				bridge
			});
			if (params.skipIds?.has(bridge.bundledPluginId) || params.skipIds?.has(targetPluginId) || existing && params.skipIds?.has(existing.pluginId)) continue;
			if (!isExternalizedBundledPluginEnabled({
				config: next,
				bridge
			})) continue;
			if (existing && isBridgeRegistryInstall(bridge, existing.record)) {
				if (existing.pluginId !== targetPluginId) {
					next = migratePluginConfigId(next, existing.pluginId, targetPluginId);
					installs = next.plugins?.installs ?? {};
					changed = true;
				}
				removeBridgeBundledLoadPaths({
					bridge,
					loadPaths: loadHelpers,
					env
				});
				continue;
			}
			if (existing && !isBridgeBundledPathRecord({
				bridge,
				record: existing.record,
				env
			})) continue;
			const npmSpec = getExternalizedBundledPluginNpmSpec(bridge);
			const clawhubSpec = getExternalizedBundledPluginClawHubSpec(bridge);
			const trustedSourceLinkedOfficialInstall = isTrustedSourceLinkedOfficialBridgeNpmInstall({
				targetPluginId,
				npmSpec
			});
			let channelNpmSpecs;
			try {
				channelNpmSpecs = npmSpec && trustedSourceLinkedOfficialInstall ? await resolveNpmInstallSpecsForUpdateChannel({
					spec: npmSpec,
					timeoutMs: params.timeoutMs,
					updateChannel: params.channel,
					officialPackageName: resolveNpmSpecPackageName(npmSpec),
					coreVersion: params.coreVersion
				}) : null;
			} catch (error) {
				if (!(error instanceof NpmChannelResolutionError)) throw error;
				summary.errors.push({
					pluginId: targetPluginId,
					message: error.message,
					code: error.code
				});
				logger.warn?.(error.message);
				continue;
			}
			const effectiveNpmSpec = channelNpmSpecs?.installSpec ?? npmSpec;
			const channelClawHubSpecs = clawhubSpec ? resolveClawHubInstallSpecsForUpdateChannel({
				spec: clawhubSpec,
				updateChannel: params.channel,
				officialPackageName: trustedSourceLinkedOfficialInstall ? parseClawHubPluginSpec(clawhubSpec)?.name : void 0,
				coreVersion: params.coreVersion
			}) : void 0;
			const sources = resolvePluginInstallSources({
				npmSpec: effectiveNpmSpec,
				clawhubSpec: channelClawHubSpecs?.installSpec
			});
			if (sources.length === 0) {
				const message = `Failed to update ${targetPluginId}: no declared remote source.`;
				summary.errors.push({
					pluginId: targetPluginId,
					message
				});
				logger.error?.(message);
				continue;
			}
			const onFallback = (warning) => {
				summary.warnings.push(warning);
				logger.warn?.(warning);
			};
			const install = async (source, spec) => {
				const expectedIntegrity = source === "npm" && spec === npmSpec ? bridge.expectedIntegrity?.trim() : void 0;
				const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
					config: next,
					env,
					source,
					spec,
					previousRecords: installs,
					expectedIntegrity,
					onCapabilityConsent: consent.onCapabilityConsent,
					beforePersistentEffect: params.beforePersistentEffect
				});
				const options = copyPluginInstallTransactionRequest(params, {
					spec,
					config: next,
					mode: "update",
					timeoutMs: params.timeoutMs,
					workTimeoutMs: params.workTimeoutMs,
					expectedPluginId: targetPluginId,
					logger,
					onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit
				});
				let result;
				try {
					result = source === "clawhub" ? await installPluginFromClawHub({
						...options,
						baseUrl: bridge.clawhubUrl,
						env
					}) : await installPluginFromNpmSpec({
						...options,
						expectedIntegrity,
						trustedSourceLinkedOfficialInstall
					});
					retainPluginInstallTransaction(params, result);
				} catch (error) {
					params.beforePersistentEffect?.();
					consent.rethrowCallbackError();
					if (!(error instanceof ManagedPluginLifecycleError)) throw error;
					return {
						result: {
							ok: false,
							error: error.message,
							code: error.capabilityConsent ? PLUGIN_CAPABILITY_CONSENT_REQUIRED : void 0
						},
						capabilityConsent,
						installSpec: spec
					};
				}
				consent.rethrowCallbackError();
				params.beforePersistentEffect?.();
				return {
					result,
					capabilityConsent,
					installSpec: spec
				};
			};
			const { attempt: { result, capabilityConsent, installSpec }, source: installedSource } = await installWithSourceFallback({
				sources,
				install: (source) => installWithChannelFallback({
					installSpec: source.spec,
					fallbackSpec: (source.source === "npm" ? channelNpmSpecs : channelClawHubSpecs)?.fallbackSpec,
					install: (spec) => install(source.source, spec),
					isRetryable: (attempt) => !attempt.result.ok && (source.source === "npm" ? isUnavailableNpmTarget(attempt.result) : isUnavailableClawHubTarget(attempt.result)),
					onFallback
				}),
				result: (attempt) => attempt.result,
				onFallback
			});
			const installSource = installedSource.source;
			if (!result.ok) {
				const clawHubTrustWarning = installSource === "clawhub" && "warning" in result && typeof result.warning === "string" && result.warning.trim().length > 0 ? result.warning : null;
				if (clawHubTrustWarning) summary.warnings.push(clawHubTrustWarning);
				const message = `${installSource === "clawhub" ? formatClawHubInstallFailure({
					pluginId: targetPluginId,
					spec: installSpec,
					phase: "update",
					error: result.error
				}) : formatNpmInstallFailure({
					pluginId: targetPluginId,
					spec: installSpec,
					phase: "update",
					result
				})}\nBundled relocation did not install the replacement plugin payload; resolve the error above, then run "openclaw update repair".`;
				summary.errors.push({
					pluginId: targetPluginId,
					message,
					code: result.code
				});
				logger.error?.(message);
				continue;
			}
			const resolvedPluginId = result.pluginId;
			if (existing && existing.pluginId !== resolvedPluginId) next = migratePluginConfigId(next, existing.pluginId, resolvedPluginId);
			const nextVersion = result.version ?? await readInstalledPackageVersion(result.targetDir);
			let record;
			if (installSource === "clawhub") record = {
				...buildClawHubPluginInstallRecordFields(result.clawhub),
				spec: channelClawHubSpecs?.recordSpec ?? installSpec,
				installPath: result.targetDir,
				version: nextVersion
			};
			else {
				const npmResult = result;
				record = {
					source: "npm",
					spec: resolveNpmInstallRecordSpec({
						requestedSpec: channelNpmSpecs?.recordSpec ?? installSpec,
						resolution: npmResult.npmResolution,
						pinResolvedRegistrySpec: false
					}),
					installPath: result.targetDir,
					version: nextVersion,
					...buildNpmResolutionInstallFields(npmResult.npmResolution)
				};
			}
			next = recordPluginInstall(next, {
				pluginId: resolvedPluginId,
				...capabilityConsent.applyAcceptedSurface(resolvedPluginId, record)
			});
			installs = next.plugins?.installs ?? {};
			if (existing?.record.sourcePath) loadHelpers.removePath(existing.record.sourcePath);
			if (existing?.record.installPath) loadHelpers.removePath(existing.record.installPath);
			removeBridgeBundledLoadPaths({
				bridge,
				loadPaths: loadHelpers,
				env
			});
			if (installSource === "clawhub") summary.switchedToClawHub.push(resolvedPluginId);
			else summary.switchedToNpm.push(resolvedPluginId);
			changed = true;
		}
		for (const [pluginId, record] of Object.entries(installs)) {
			const bundledInfo = bundled.get(pluginId);
			if (!bundledInfo || retainedLinks.has(pluginId) || params.skipIds?.has(pluginId)) continue;
			if (record.source === "npm") {
				loadHelpers.removePath(bundledInfo.localPath);
				continue;
			}
			if (record.source !== "path") continue;
			if (!userPathsEqual(record.sourcePath, bundledInfo.localPath, env)) continue;
			loadHelpers.addPath(bundledInfo.localPath);
			if (userPathsEqual(record.installPath, bundledInfo.localPath, env)) continue;
			next = recordPluginInstall(next, {
				pluginId,
				source: "path",
				sourcePath: bundledInfo.localPath,
				installPath: bundledInfo.localPath,
				spec: record.spec ?? bundledInfo.npmSpec,
				version: record.version
			});
			changed = true;
		}
	}
	if (loadHelpers.changed) {
		next = {
			...next,
			plugins: {
				...next.plugins,
				load: {
					...next.plugins?.load,
					paths: loadHelpers.paths
				}
			}
		};
		changed = true;
	}
	return {
		config: next,
		changed,
		summary
	};
}
//#endregion
export { updateNpmInstalledPlugins as n, isClawHubTrustSkippedOutcome as r, syncPluginsForUpdateChannel as t };
