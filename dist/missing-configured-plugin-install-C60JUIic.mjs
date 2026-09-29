import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatSourceBundledPluginNotice } from "./dev-source-root-b-YTkLfc.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { F as hashStableJson } from "./discovery-D_5mAUI7.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as resolveDefaultPluginExtensionsDir, c as resolvePluginInstallDir, s as resolveDefaultPluginNpmDir } from "./install-paths-DnOgVB7K.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { A as resolvePluginInstallSources, C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, T as installWithSourceFallback, k as resolveNpmInstallSpecsForUpdateChannel, w as installWithChannelFallback } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { i as markRetainedManagedNpmInstall, n as clearRetainedManagedNpmInstallMarker, r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-dDTeoxiW.mjs";
import { n as isUnavailableClawHubTarget } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget, t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { c as resolveTrustedSourceLinkedOfficialNpmInstall } from "./official-external-install-records-CwKXyAFm.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { t as PLUGIN_CAPABILITY_CONSENT_REQUIRED } from "./capability-consent-error-details-CF5XfV3G.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { a as readInstalledPackageVersion, t as comparePackageUpdateVersions } from "./package-update-utils-Ds9d2bwt.mjs";
import { r as resolveOfficialPluginCohortNpmSpecs, t as detectPluginVersionDrift } from "./plugin-version-drift-CKIIcvZc.mjs";
import { d as resolveNpmInstallRecordSpec, o as writePersistedInstalledPluginIndexInstallRecordsWithLease, s as buildNpmResolutionInstallFields } from "./installed-plugin-index-records-Clh203og.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { f as shouldDeferConfiguredPluginInstallRepair, o as isLegacyPackageUpdateDoctorPass } from "./update-phase-DiVB4MDN.mjs";
import { G as withPluginInstallTransactions, H as retainPluginInstallTransaction, L as copyPluginInstallTransactionRequest } from "./npm-managed-root-BdsMGiX0.mjs";
import { r as installPluginFromNpmSpec } from "./install-Bt8Oq4jr.mjs";
import { n as isPayloadMissing } from "./payload-verification-DlThdi1u.mjs";
import { a as collectConfiguredChannelIds, i as collectBlockedPluginIds, n as collectUpdateDeferredPluginIds, o as collectConfiguredPluginIds, r as resolveConfiguredPluginInstallContext, t as collectDownloadableInstallCandidates } from "./missing-configured-plugin-install.candidates-OsejpvO_.mjs";
import { r as prepareManagedPluginArtifactConsentHandler, t as capturePluginCapabilityConsentHandlerErrors } from "./capability-consent-Fw4XtIv4.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as installPluginFromClawHub } from "./clawhub-DyY8io5y.mjs";
import { n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome } from "./update-WIZHWMIh.mjs";
import { a as installPathsEqual, c as resolveLegacyNpmPackageInstallPath, i as forceNpmInstallRecordRepair, l as resolveNpmPackageInstallPath, n as resolveConfiguredPluginCandidateRepair, o as isTrustedOfficialInstallRecordForCandidate, r as resolveRecordedInstallCandidate, s as recordMatchesBundledPackage, u as resolveSafeBrokenOfficialInstallRemovalPath } from "./missing-configured-plugin-install.targets-DQUS1iqs.mjs";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
//#region src/commands/doctor/shared/missing-configured-plugin-install.install.ts
function isActionableClawHubSkippedOutcome(outcome) {
	return isClawHubTrustSkippedOutcome(outcome);
}
function isClawHubReviewNotice(message) {
	const audit = stripAnsi(message);
	return audit.includes("ClawHub Security Audit") && audit.includes("Outcome: Review");
}
function formatInstalledConfiguredPluginChange(params) {
	return params.repairReason === "stale-version-bound-runtime" ? `Refreshed stale configured plugin "${params.pluginId}" from ${params.installSpec}.` : `Installed missing configured plugin "${params.pluginId}" from ${params.installSpec}.`;
}
async function installCandidate(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	try {
		const result = await installCandidatePackage({
			...params,
			onCapabilityConsent: consent.onCapabilityConsent
		});
		consent.rethrowCallbackError();
		return result;
	} catch (error) {
		consent.rethrowCallbackError();
		if (error instanceof ManagedPluginLifecycleError) {
			if (error.kind === "invalid-request" && !error.capabilityConsent) throw error;
		} else if (!(error instanceof NpmChannelResolutionError)) throw error;
		return {
			records: params.records,
			changes: [],
			notices: [],
			warnings: [sanitizeTerminalText(error.message)],
			failedPluginId: params.candidate.pluginId,
			...error instanceof NpmChannelResolutionError ? { code: error.code } : error.capabilityConsent ? { code: PLUGIN_CAPABILITY_CONSENT_REQUIRED } : {}
		};
	}
}
async function installCandidatePackage(params) {
	const record = params.records[params.candidate.pluginId];
	const recordedSource = record?.source === "npm" || record?.source === "clawhub" ? record.source : void 0;
	const staleRuntimeRepair = params.repairReason === "stale-version-bound-runtime";
	const candidate = resolveRecordedInstallCandidate({
		candidate: params.candidate,
		record,
		repairReason: params.repairReason
	});
	const extensionsDir = resolveDefaultPluginExtensionsDir(params.env);
	const warnings = [];
	const channelNotices = [];
	const pinResolvedSpecForStaleRepair = staleRuntimeRepair && parseRegistryNpmSpec(params.records[candidate.pluginId]?.spec ?? "")?.selectorKind === "exact-version";
	const clawhubSpecs = candidate.clawhubSpec ? resolveClawHubInstallSpecsForUpdateChannel({
		spec: candidate.clawhubSpec,
		updateChannel: params.updateChannel,
		officialPackageName: candidate.trustedSourceLinkedOfficialInstall ? parseClawHubPluginSpec(candidate.clawhubSpec)?.name : void 0,
		coreVersion: resolveCompatibilityHostVersion(params.env),
		versionBoundToCore: candidate.versionBoundToOpenClaw
	}) : null;
	const npmSpecs = candidate.npmSpec ? await resolveNpmInstallSpecsForUpdateChannel({
		spec: candidate.npmSpec,
		timeoutMs: params.timeoutMs,
		updateChannel: params.updateChannel,
		officialPackageName: candidate.trustedSourceLinkedOfficialInstall ? parseRegistryNpmSpec(candidate.npmSpec)?.name : void 0,
		coreVersion: resolveCompatibilityHostVersion(params.env),
		versionBoundToCore: candidate.versionBoundToOpenClaw
	}) : null;
	const clawhubInstallSpec = clawhubSpecs?.installSpec ?? candidate.clawhubSpec;
	const npmInstallSpec = npmSpecs?.installSpec ?? candidate.npmSpec;
	const prepareConsent = (source, spec, expectedIntegrity) => prepareManagedPluginArtifactConsentHandler({
		config: params.config,
		env: params.env,
		source,
		spec,
		previousRecords: params.records,
		expectedIntegrity,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	const npmDir = resolveDefaultPluginNpmDir(params.env);
	const existingClawHubPackagePath = clawhubInstallSpec ? resolveExistingCandidateClawHubPackagePath({
		candidate,
		extensionsDir
	}) : null;
	const existingNpmPackagePath = npmInstallSpec ? resolveExistingCandidateNpmPackagePath({
		candidate,
		npmDir
	}) : null;
	if (staleRuntimeRepair && npmSpecs?.npmResolution?.version) {
		const installPath = resolveRecordInstallPath(record, params.env) ?? existingNpmPackagePath;
		const installedVersion = installPath ? await readInstalledPackageVersion(installPath) : void 0;
		const selectedVersion = npmSpecs.npmResolution.version;
		if (npmSpecs.channelReason) channelNotices.push(`Plugin "${candidate.pluginId}" refresh: tag-behind-latest; beta follows latest ${selectedVersion}.`);
		if (installedVersion && comparePackageUpdateVersions(selectedVersion, installedVersion) <= 0) return {
			records: params.records,
			changes: [],
			notices: [...channelNotices, `Plugin "${candidate.pluginId}" refresh: already-current (${installedVersion}).`],
			warnings: []
		};
		channelNotices.push(`Plugin "${candidate.pluginId}" refresh: newer-available (${installedVersion ?? "unknown"} -> ${selectedVersion}).`);
	}
	const sources = resolvePluginInstallSources(candidate, recordedSource);
	if (sources.length === 0) return {
		records: params.records,
		changes: [],
		notices: [],
		warnings: [`Failed to install missing configured plugin "${candidate.pluginId}": no declared remote source.`],
		failedPluginId: candidate.pluginId
	};
	const { attempt: { result: installResult, capabilityConsent: acceptedConsent }, source: installedSource } = await installWithSourceFallback({
		sources,
		install: async (source) => {
			const specs = source.source === "npm" ? npmSpecs : clawhubSpecs;
			const installSpec = specs?.installSpec ?? source.spec;
			return await installWithChannelFallback({
				installSpec,
				...source.expectedIntegrity ? {} : { fallbackSpec: specs?.fallbackSpec },
				install: async (spec) => {
					const capabilityConsent = await prepareConsent(source.source, spec, source.expectedIntegrity);
					const options = copyPluginInstallTransactionRequest(params, {
						spec,
						config: params.config,
						timeoutMs: params.timeoutMs,
						workTimeoutMs: params.workTimeoutMs,
						extensionsDir,
						expectedPluginId: candidate.pluginId,
						expectedIntegrity: source.expectedIntegrity,
						onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit
					});
					if (source.source === "clawhub") {
						const result = await installPluginFromClawHub({
							...options,
							env: params.env,
							...recordedSource === "clawhub" ? { baseUrl: record?.clawhubUrl } : {},
							mode: params.mode === "update" || existingClawHubPackagePath ? "update" : "install",
							logger: {
								terminalLinks: false,
								warn: (message) => warnings.push(stripAnsi(message))
							}
						});
						retainPluginInstallTransaction(params, result);
						return {
							result,
							capabilityConsent
						};
					}
					const mode = params.mode === "update" || existingNpmPackagePath ? "update" : "install";
					const install = (installMode) => installPluginFromNpmSpec({
						...options,
						npmDir,
						mode: installMode,
						trustedSourceLinkedOfficialInstall: candidate.trustedSourceLinkedOfficialInstall
					});
					let result = await install(mode);
					if (!result.ok && mode === "install" && isPluginAlreadyExistsError(result.error)) result = await install("update");
					retainPluginInstallTransaction(params, result);
					return {
						result,
						capabilityConsent
					};
				},
				isRetryable: (attempt) => !attempt.result.ok && (source.source === "npm" ? isUnavailableNpmTarget(attempt.result) : isUnavailableClawHubTarget(attempt.result)),
				onFallback: (message) => {
					channelNotices.push(message);
				}
			});
		},
		result: (attempt) => attempt.result,
		onFallback: (message) => {
			channelNotices.push(message);
		}
	});
	if (!installResult.ok) return {
		records: params.records,
		changes: [],
		notices: [],
		warnings: [
			...warnings,
			...channelNotices,
			`Failed to install missing configured plugin "${candidate.pluginId}" from ${installedSource.spec}: ${installResult.error}`
		],
		failedPluginId: candidate.pluginId
	};
	const pluginId = installResult.pluginId;
	const recordSpec = (record?.source === installedSource.source ? record.spec : void 0) ?? (installedSource.source === "npm" ? npmSpecs : clawhubSpecs)?.recordSpec ?? installedSource.spec;
	const installedRecord = "clawhub" in installResult ? {
		...buildClawHubPluginInstallRecordFields(installResult.clawhub),
		spec: recordSpec,
		installPath: installResult.targetDir
	} : {
		source: "npm",
		spec: resolveNpmInstallRecordSpec({
			requestedSpec: recordSpec,
			resolution: installResult.npmResolution,
			pinResolvedRegistrySpec: pinResolvedSpecForStaleRepair
		}),
		installPath: installResult.targetDir,
		version: installResult.version,
		...buildNpmResolutionInstallFields(installResult.npmResolution)
	};
	return {
		records: {
			...params.records,
			[pluginId]: acceptedConsent.applyAcceptedSurface(pluginId, {
				...installedRecord,
				installedAt: (/* @__PURE__ */ new Date()).toISOString()
			})
		},
		changes: [formatInstalledConfiguredPluginChange({
			pluginId,
			installSpec: (installedSource.source === "npm" ? npmSpecs : clawhubSpecs)?.installSpec ?? installedSource.spec,
			repairReason: params.repairReason
		})],
		notices: [...channelNotices, ...warnings],
		warnings: []
	};
}
function isPluginAlreadyExistsError(error) {
	return /\bplugin already exists:/.test(error);
}
function resolveExistingCandidateNpmPackagePath(params) {
	const npmName = params.candidate.npmSpec ? parseRegistryNpmSpec(params.candidate.npmSpec)?.name : void 0;
	if (!npmName) return null;
	const packagePath = resolveNpmPackageInstallPath({
		packageName: npmName,
		npmRoot: params.npmDir
	});
	if (existsSync(packagePath)) return packagePath;
	const legacyPackagePath = resolveLegacyNpmPackageInstallPath({
		packageName: npmName,
		npmRoot: params.npmDir
	});
	return existsSync(legacyPackagePath) ? legacyPackagePath : null;
}
function resolveExistingCandidateClawHubPackagePath(params) {
	try {
		const packagePath = resolvePluginInstallDir(params.candidate.pluginId, params.extensionsDir);
		return existsSync(packagePath) ? packagePath : null;
	} catch {
		return null;
	}
}
function resolveRecordInstallPath(record, env) {
	const installPath = record?.installPath?.trim();
	return installPath ? resolveUserPath(installPath, env) : void 0;
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.health.ts
const CONFIGURED_PLUGIN_INSTALLS_CHECK_ID = "core/doctor/configured-plugin-installs";
function recordedInstallIdentity(record) {
	return {
		installSpec: record?.resolvedSpec ?? record?.spec,
		installSource: record?.source
	};
}
function missingRecordedPluginIssueKind(params) {
	if (params.staleVersionBoundRuntimePluginIds.has(params.pluginId)) return "stale-version-bound-runtime";
	if (params.repairablePackageDiagnosticPluginIds.has(params.pluginId)) return "repairable-installed-plugin";
	if (params.staleDescriptorPluginIds.has(params.pluginId)) return "stale-channel-config-descriptor";
	return "missing-installed-payload";
}
/** Detect configured plugin installs that Doctor can repair without mutating package state. */
async function detectConfiguredPluginInstallHealthIssues(params) {
	const env = params.env ?? process.env;
	const pluginIds = collectConfiguredPluginIds(params.cfg, env);
	const channelIds = collectConfiguredChannelIds(params.cfg, env);
	const blockedPluginIds = collectBlockedPluginIds(params.cfg);
	const { knownIds, configuredChannelOwnerPluginIds, bundledPluginsById, configuredPluginIdsWithStaleDescriptors: staleDescriptorPluginIds, operatorManagedPluginIds, records, installedPluginIdsWithRepairablePackageDiagnostics: repairablePackageDiagnosticPluginIds, installedPluginIdsWithStaleVersionBoundRuntimePackages: staleVersionBoundRuntimePluginIds, installedPluginIdsWithRepairablePackages: repairableInstalledPluginIds, installedPluginMissingRequiredDependencies, officialReplacementPluginIds } = await resolveConfiguredPluginInstallContext({
		cfg: params.cfg,
		env,
		configuredPluginIds: pluginIds,
		configuredChannelIds: channelIds,
		blockedPluginIds,
		baselineRecords: params.baselineRecords
	});
	const deferredPluginIds = /* @__PURE__ */ new Set();
	const reportedPluginIds = /* @__PURE__ */ new Set();
	const issues = [];
	if (shouldDeferConfiguredPluginInstallRepair(env)) for (const pluginId of collectUpdateDeferredPluginIds({
		cfg: params.cfg,
		env,
		configuredPluginIds: pluginIds,
		configuredChannelIds: channelIds,
		configuredChannelOwnerPluginIds,
		blockedPluginIds
	})) {
		if (operatorManagedPluginIds.has(pluginId)) continue;
		deferredPluginIds.add(pluginId);
		const record = records[pluginId];
		if (!record || !isPayloadMissing(env, record.installPath) && !installedPluginMissingRequiredDependencies.has(pluginId)) continue;
		issues.push({
			kind: "deferred-package-manager-repair",
			pluginId,
			...resolveRecordInstallPath(record, env) ? { installPath: resolveRecordInstallPath(record, env) } : {}
		});
		reportedPluginIds.add(pluginId);
	}
	const missingRecordedPluginIds = Object.keys(records).filter((pluginId) => !operatorManagedPluginIds.has(pluginId) && !deferredPluginIds.has(pluginId) && !officialReplacementPluginIds.has(pluginId) && !bundledPluginsById.has(pluginId) && (pluginIds.has(pluginId) && (!knownIds.has(pluginId) || isPayloadMissing(env, records[pluginId]?.installPath)) || staleDescriptorPluginIds.has(pluginId) || repairableInstalledPluginIds.has(pluginId)));
	for (const pluginId of missingRecordedPluginIds) {
		const record = records[pluginId];
		const missingDependencies = installedPluginMissingRequiredDependencies.get(pluginId);
		if (missingDependencies) {
			issues.push({
				kind: "missing-required-dependencies",
				pluginId,
				installPath: resolveRecordInstallPath(record, env),
				...recordedInstallIdentity(record),
				missingRequired: missingDependencies.missingRequired
			});
			reportedPluginIds.add(pluginId);
			continue;
		}
		const kind = missingRecordedPluginIssueKind({
			pluginId,
			staleVersionBoundRuntimePluginIds,
			repairablePackageDiagnosticPluginIds,
			staleDescriptorPluginIds
		});
		const installPath = resolveRecordInstallPath(record, env);
		if (kind === "stale-channel-config-descriptor") {
			issues.push({
				kind,
				pluginId,
				...installPath ? { installPath } : {}
			});
			reportedPluginIds.add(pluginId);
			continue;
		}
		issues.push({
			kind,
			pluginId,
			...installPath ? { installPath } : {},
			...recordedInstallIdentity(record)
		});
		reportedPluginIds.add(pluginId);
	}
	const missingPluginIds = new Set([...pluginIds].filter((pluginId) => {
		if (operatorManagedPluginIds.has(pluginId) || deferredPluginIds.has(pluginId)) return false;
		const hasRecord = Object.hasOwn(records, pluginId);
		return !knownIds.has(pluginId) && !hasRecord && !bundledPluginsById.has(pluginId) || hasRecord && !bundledPluginsById.has(pluginId) && isPayloadMissing(env, records[pluginId]?.installPath);
	}));
	const installCandidatePluginIds = /* @__PURE__ */ new Set([...missingPluginIds, ...officialReplacementPluginIds]);
	for (const candidate of collectDownloadableInstallCandidates({
		cfg: params.cfg,
		env,
		missingPluginIds: installCandidatePluginIds,
		configuredPluginIds: pluginIds,
		configuredChannelIds: channelIds,
		configuredChannelOwnerPluginIds,
		blockedPluginIds: /* @__PURE__ */ new Set([
			...blockedPluginIds,
			...deferredPluginIds,
			...operatorManagedPluginIds
		])
	})) {
		if (bundledPluginsById.has(candidate.pluginId)) continue;
		if (reportedPluginIds.has(candidate.pluginId)) continue;
		const shouldReplaceBrokenOfficialInstall = officialReplacementPluginIds.has(candidate.pluginId);
		if (shouldReplaceBrokenOfficialInstall && !candidate.trustedSourceLinkedOfficialInstall) continue;
		const record = records[candidate.pluginId];
		if (shouldReplaceBrokenOfficialInstall && !isTrustedOfficialInstallRecordForCandidate({
			record,
			candidate
		})) continue;
		const hasRecord = Object.hasOwn(records, candidate.pluginId);
		const hasUsableRecord = hasRecord && !isPayloadMissing(env, records[candidate.pluginId]?.installPath);
		if (!shouldReplaceBrokenOfficialInstall && (hasUsableRecord || knownIds.has(candidate.pluginId) && !hasRecord)) continue;
		const installSpec = resolvePluginInstallSources(candidate)[0]?.spec;
		if (shouldReplaceBrokenOfficialInstall) {
			const installPath = resolveRecordInstallPath(record, env);
			issues.push({
				kind: staleVersionBoundRuntimePluginIds.has(candidate.pluginId) ? "stale-version-bound-runtime" : "repairable-installed-plugin",
				pluginId: candidate.pluginId,
				...installPath ? { installPath } : {},
				...recordedInstallIdentity(record)
			});
			continue;
		}
		if (record) {
			const installPath = resolveRecordInstallPath(record, env);
			issues.push({
				kind: "missing-installed-payload",
				pluginId: candidate.pluginId,
				...installPath ? { installPath } : {},
				...recordedInstallIdentity(record)
			});
		} else if (installSpec) issues.push({
			kind: "missing-install-record",
			pluginId: candidate.pluginId,
			installSpec
		});
	}
	return issues.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
const CONFIGURED_PLUGIN_INSTALL_ISSUE_DETAILS = {
	"missing-install-record": {
		message: (pluginId) => `Configured plugin ${pluginId} is not installed.`,
		fixHint: "",
		action: "would-install-configured-plugin",
		dryRunSafe: false
	},
	"missing-installed-payload": {
		message: (pluginId) => `Configured plugin ${pluginId} has an install record but its package payload is missing.`,
		fixHint: null,
		action: "would-reinstall-configured-plugin",
		dryRunSafe: false
	},
	"missing-required-dependencies": {
		message: (pluginId) => `Configured plugin ${pluginId} is missing required dependencies:`,
		fixHint: null,
		action: "would-repair-configured-plugin-dependencies",
		dryRunSafe: false
	},
	"repairable-installed-plugin": {
		message: (pluginId) => `Configured plugin ${pluginId} has a repairable package install problem.`,
		fixHint: null,
		action: "would-repair-configured-plugin-install",
		dryRunSafe: false
	},
	"stale-version-bound-runtime": {
		message: (pluginId) => `Configured runtime plugin ${pluginId} is older than this OpenClaw version.`,
		fixHint: "Run `openclaw doctor --fix` to refresh the configured runtime plugin.",
		action: "would-refresh-configured-runtime-plugin",
		dryRunSafe: false
	},
	"stale-channel-config-descriptor": {
		message: (pluginId) => `Configured plugin ${pluginId} has stale channel config metadata.`,
		fixHint: "Run `openclaw doctor --fix` to repair the configured plugin install metadata.",
		action: "would-repair-configured-plugin-install",
		dryRunSafe: false
	},
	"deferred-package-manager-repair": {
		message: (pluginId) => `Configured plugin ${pluginId} package repair is deferred until the package update finishes.`,
		fixHint: "Rerun `openclaw doctor --fix` after the package update completes.",
		action: "would-defer-configured-plugin-install-repair",
		dryRunSafe: true
	}
};
function configuredPluginInstallIssueToHealthFinding(issue) {
	const detail = CONFIGURED_PLUGIN_INSTALL_ISSUE_DETAILS[issue.kind];
	const installSpec = "installSpec" in issue ? issue.installSpec : void 0;
	return {
		checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
		severity: "warning",
		message: issue.kind === "missing-required-dependencies" ? `${detail.message(issue.pluginId)} ${issue.missingRequired.join(", ")}.` : detail.message(issue.pluginId),
		target: issue.pluginId,
		..."installSource" in issue ? { source: issue.installSource } : {},
		..."installPath" in issue && issue.installPath ? { path: issue.installPath } : {},
		fixHint: issue.kind === "missing-install-record" ? `Run \`openclaw doctor --fix\` to install ${issue.installSpec}.` : detail.fixHint ?? (installSpec ? `Run \`openclaw plugins install ${installSpec} --force\` to reinstall the configured plugin package.` : "Run `openclaw doctor --fix` to repair the configured plugin install. An exact reinstall command is unavailable because the install record has no package spec.")
	};
}
function configuredPluginInstallIssueToRepairEffect(issue) {
	const detail = CONFIGURED_PLUGIN_INSTALL_ISSUE_DETAILS[issue.kind];
	return {
		kind: "package",
		action: detail.action,
		target: issue.pluginId,
		dryRunSafe: detail.dryRunSafe
	};
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.repair.ts
/** Repair missing installs inferred from the current OpenClaw config. */
async function repairMissingConfiguredPluginInstalls(params) {
	return repairMissingPluginInstalls(copyPluginInstallTransactionRequest(params, {
		cfg: params.cfg,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		env: params.env,
		pluginIds: collectConfiguredPluginIds(params.cfg, params.env),
		channelIds: collectConfiguredChannelIds(params.cfg, params.env),
		blockedPluginIds: collectBlockedPluginIds(params.cfg),
		repairVersionDrift: params.repairVersionDrift,
		onWarning: params.onWarning,
		...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
		beforePersistentEffect: params.beforePersistentEffect,
		...params.baselineRecords ? { baselineRecords: params.baselineRecords } : {}
	}));
}
/** Repair missing installs for an explicit plugin/channel id set. */
async function repairMissingPluginInstallsForIds(params) {
	return repairMissingPluginInstalls(copyPluginInstallTransactionRequest(params, {
		cfg: params.cfg,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		env: params.env,
		pluginIds: new Set([...params.pluginIds].map((pluginId) => pluginId.trim()).filter((pluginId) => pluginId)),
		channelIds: new Set([...params.channelIds ?? []].map((channelId) => channelId.trim()).filter((channelId) => channelId)),
		blockedPluginIds: new Set([...params.blockedPluginIds ?? []].map((pluginId) => pluginId.trim()).filter((pluginId) => pluginId)),
		...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
		onWarning: params.onWarning,
		beforePersistentEffect: params.beforePersistentEffect,
		...params.baselineRecords ? { baselineRecords: params.baselineRecords } : {}
	}));
}
async function repairMissingPluginInstalls(params) {
	return await withPluginLifecycleLease({ env: params.env }, (lease) => withPluginInstallTransactions(params, () => lease.assertOwned(), async (owned, assertCurrent) => {
		const dependencyRepairMarkers = /* @__PURE__ */ new Map();
		let result;
		let failure;
		try {
			result = await repairMissingPluginInstallsWithLease(owned, lease, dependencyRepairMarkers, assertCurrent);
		} catch (error) {
			failure = error;
		}
		const cleanupErrors = [];
		for (const [pluginId, packageDir] of dependencyRepairMarkers) {
			if (result?.repairedPluginIds?.includes(pluginId)) continue;
			try {
				await clearRetainedManagedNpmInstallMarker(packageDir, assertCurrent);
			} catch (error) {
				cleanupErrors.push(error);
			}
		}
		if (!result) {
			if (cleanupErrors.length > 0) throw new AggregateError([failure, ...cleanupErrors], "Plugin dependency repair failed and its retention markers could not be cleared.");
			throw failure;
		}
		result.warnings.push(...cleanupErrors.map((error) => `Failed to clear dependency repair retention marker: ${String(error)}`));
		return result;
	}));
}
async function repairMissingPluginInstallsWithLease(params, lease, dependencyRepairMarkers, assertCurrent) {
	const env = params.env ?? process.env;
	const { knownIds, configuredChannelOwnerPluginIds, bundledPluginsById, configuredPluginIdsWithStaleDescriptors, operatorManagedPluginIds, stalePathInstallPluginIds, records, persistedRecords, updateChannel, installedPluginIdsWithRepairablePackageDiagnostics, installedPluginIdsWithStaleVersionBoundRuntimePackages, installedPluginIdsWithRepairablePackages, installedPluginMissingRequiredDependencies, officialReplacementPluginIds } = await resolveConfiguredPluginInstallContext({
		cfg: params.cfg,
		env,
		configuredPluginIds: params.pluginIds,
		configuredChannelIds: params.channelIds,
		blockedPluginIds: params.blockedPluginIds,
		baselineRecords: params.baselineRecords
	});
	const changes = [];
	const notices = [];
	const warnings = [];
	const warn = (message, pluginId) => {
		warnings.push(message);
		params.onWarning?.({
			message,
			...pluginId ? { pluginId } : {}
		});
	};
	const sourceOutcomes = [];
	const deferredRepairDetails = [];
	const failedPlugins = /* @__PURE__ */ new Map();
	const repairedPluginIds = /* @__PURE__ */ new Set();
	const coreVersion = resolveCompatibilityHostVersion(env);
	const cohortSpecs = resolveOfficialPluginCohortNpmSpecs({
		gatewayVersion: coreVersion,
		installRecords: records,
		config: params.cfg
	});
	const driftedPluginIds = new Set(params.repairVersionDrift && !shouldDeferConfiguredPluginInstallRepair(env) ? detectPluginVersionDrift({
		gatewayVersion: coreVersion,
		installRecords: records,
		config: params.cfg
	}).drifts.flatMap(({ pluginId }) => {
		const record = records[pluginId];
		if (!record || !cohortSpecs[pluginId] || operatorManagedPluginIds.has(pluginId) || bundledPluginsById.has(pluginId) || officialReplacementPluginIds.has(pluginId)) return [];
		if (resolveTrustedSourceLinkedOfficialNpmInstall({
			pluginId,
			record
		})?.replacementPluginId) {
			warn(`Plugin "${pluginId}" needs a package-id migration. Run ${formatCliCommand(`openclaw plugins update ${cohortSpecs[pluginId]}`, env)}.`, pluginId);
			return [];
		}
		return [pluginId];
	}) : []);
	const deferredPluginIds = /* @__PURE__ */ new Set();
	const preferNpmInstalls = isLegacyPackageUpdateDoctorPass(env);
	let nextRecords = records;
	const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
	const recordFailure = (pluginId, messages, code) => {
		let outcome = failedPlugins.get(pluginId);
		if ((code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED" || code === PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE) && knownIds.has(pluginId) && !isPayloadMissing(env, records[pluginId]?.installPath) && !installedPluginIdsWithRepairablePackageDiagnostics.has(pluginId) && !installedPluginMissingRequiredDependencies.has(pluginId) && !configuredPluginIdsWithStaleDescriptors.has(pluginId) && resolveEffectiveEnableState({
			id: pluginId,
			origin: "global",
			config: normalizedPluginConfig,
			rootConfig: params.cfg
		}).enabled) notices.push(`Kept installed plugin "${pluginId}"; replacement deferred. ${messages.join(" ")}`);
		else {
			for (const message of messages) warn(message, pluginId);
			if (code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED") outcome = {
				pluginId,
				status: "error",
				code,
				message: messages.join(" ")
			};
		}
		failedPlugins.set(pluginId, outcome);
	};
	for (const [pluginId, record] of Object.entries(records)) {
		const bundled = bundledPluginsById.get(pluginId);
		if (operatorManagedPluginIds.has(pluginId) || !bundled || !recordMatchesBundledPackage(record, bundled)) continue;
		if (bundled.preserveExternalInstallRecord) {
			const message = formatSourceBundledPluginNotice(pluginId);
			notices.push(message);
			sourceOutcomes.push({
				pluginId,
				status: "unchanged",
				code: "source-bundled-plugin",
				message
			});
			continue;
		}
		if (nextRecords === records) nextRecords = { ...records };
		delete nextRecords[pluginId];
		changes.push(`Removed stale managed install record for bundled plugin "${pluginId}".`);
	}
	for (const pluginId of stalePathInstallPluginIds) changes.push(`Removed stale path-install record for plugin "${pluginId}" (loaded from a configured load path).`);
	if (shouldDeferConfiguredPluginInstallRepair(env)) {
		const updateDeferredPluginIds = collectUpdateDeferredPluginIds({
			cfg: params.cfg,
			env,
			configuredPluginIds: params.pluginIds,
			configuredChannelIds: params.channelIds,
			configuredChannelOwnerPluginIds,
			blockedPluginIds: params.blockedPluginIds
		});
		for (const pluginId of updateDeferredPluginIds) {
			if (operatorManagedPluginIds.has(pluginId)) continue;
			deferredPluginIds.add(pluginId);
			const record = nextRecords[pluginId];
			if (!record || !isPayloadMissing(env, record.installPath) && !installedPluginMissingRequiredDependencies.has(pluginId)) continue;
			const detail = `Skipped package-manager repair for configured plugin "${pluginId}" during package update; rerun "openclaw doctor --fix" after the update completes.`;
			changes.push(detail);
			deferredRepairDetails.push(detail);
		}
	}
	const missingRecordedPlugins = Object.entries(records).filter(([pluginId]) => !operatorManagedPluginIds.has(pluginId) && !deferredPluginIds.has(pluginId) && !officialReplacementPluginIds.has(pluginId) && Object.hasOwn(nextRecords, pluginId) && !bundledPluginsById.has(pluginId) && (params.pluginIds.has(pluginId) && (!knownIds.has(pluginId) || isPayloadMissing(env, nextRecords[pluginId]?.installPath)) || configuredPluginIdsWithStaleDescriptors.has(pluginId) || installedPluginIdsWithRepairablePackages.has(pluginId) || driftedPluginIds.has(pluginId)));
	const missingRecordedPluginIds = missingRecordedPlugins.map(([pluginId]) => pluginId);
	if (missingRecordedPluginIds.length > 0) {
		const repairRecords = { ...nextRecords };
		for (const [pluginId, record] of missingRecordedPlugins) {
			const missingDependencies = installedPluginMissingRequiredDependencies.get(pluginId);
			if (missingDependencies || !installedPluginIdsWithStaleVersionBoundRuntimePackages.has(pluginId) && !driftedPluginIds.has(pluginId) || installedPluginIdsWithRepairablePackageDiagnostics.has(pluginId) || configuredPluginIdsWithStaleDescriptors.has(pluginId) || isPayloadMissing(env, record.installPath)) repairRecords[pluginId] = forceNpmInstallRecordRepair(record);
			if (missingDependencies) {
				await params.beforePersistentEffect?.();
				assertCurrent();
				if (!hasRetainedManagedNpmInstallMarker(missingDependencies.rootDir)) {
					dependencyRepairMarkers.set(pluginId, missingDependencies.rootDir);
					await markRetainedManagedNpmInstall({
						packageDir: missingDependencies.rootDir,
						pluginId,
						reason: "doctor-missing-required-dependencies",
						assertCurrent
					});
				}
			}
		}
		const updateResult = await updateNpmInstalledPlugins(copyPluginInstallTransactionRequest(params, {
			config: {
				...params.cfg,
				plugins: {
					...params.cfg.plugins,
					installs: repairRecords
				}
			},
			pluginIds: missingRecordedPluginIds,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			npmInstallSpecOverrides: Object.fromEntries(Object.entries(cohortSpecs).filter(([pluginId]) => driftedPluginIds.has(pluginId))),
			retainOnUnavailable: true,
			skipDisabledPlugins: true,
			updateChannel,
			coreVersion,
			logger: {
				terminalLinks: false,
				warn: (message) => {
					if (isClawHubReviewNotice(message)) {
						notices.push(stripAnsi(message));
						return;
					}
					warn(message);
				},
				error: (message) => warn(message)
			},
			...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
			beforePersistentEffect: params.beforePersistentEffect
		}));
		for (const outcome of updateResult.outcomes) {
			if (outcome.status === "unchanged" && outcome.code === "plugin-target-unavailable") {
				recordFailure(outcome.pluginId, [outcome.message], outcome.code);
				continue;
			}
			if (outcome.status === "unchanged" && updateResult.config.plugins?.installs?.[outcome.pluginId] === repairRecords[outcome.pluginId]) notices.push(outcome.message);
			else if (outcome.status === "updated" || outcome.status === "unchanged") {
				repairedPluginIds.add(outcome.pluginId);
				failedPlugins.delete(outcome.pluginId);
				changes.push(installedPluginMissingRequiredDependencies.has(outcome.pluginId) ? `Repaired missing dependencies for installed plugin "${outcome.pluginId}".` : driftedPluginIds.has(outcome.pluginId) ? `Updated official plugin "${outcome.pluginId}" from ${outcome.currentVersion ?? records[outcome.pluginId]?.version} to ${outcome.nextVersion ?? coreVersion}.` : installedPluginIdsWithStaleVersionBoundRuntimePackages.has(outcome.pluginId) ? `Refreshed stale configured plugin "${outcome.pluginId}".` : installedPluginIdsWithRepairablePackageDiagnostics.has(outcome.pluginId) ? `Repaired broken installed plugin "${outcome.pluginId}".` : `Repaired missing configured plugin "${outcome.pluginId}".`);
			} else if (outcome.status === "error" || isActionableClawHubSkippedOutcome(outcome) || outcome.status === "skipped" && installedPluginMissingRequiredDependencies.has(outcome.pluginId)) recordFailure(outcome.pluginId, [outcome.message], outcome.code);
		}
		if (repairedPluginIds.size > 0) {
			nextRecords = { ...updateResult.config.plugins?.installs ?? nextRecords };
			for (const [pluginId, record] of missingRecordedPlugins) if (!repairedPluginIds.has(pluginId)) nextRecords[pluginId] = record;
		}
	}
	const missingPluginIds = new Set([...params.pluginIds].filter((pluginId) => {
		if (operatorManagedPluginIds.has(pluginId) || deferredPluginIds.has(pluginId)) return false;
		const hasRecord = Object.hasOwn(nextRecords, pluginId);
		return !knownIds.has(pluginId) && !hasRecord && !bundledPluginsById.has(pluginId) || hasRecord && !bundledPluginsById.has(pluginId) && isPayloadMissing(env, nextRecords[pluginId]?.installPath);
	}));
	const installCandidatePluginIds = /* @__PURE__ */ new Set([...missingPluginIds, ...officialReplacementPluginIds]);
	for (const candidate of collectDownloadableInstallCandidates({
		cfg: params.cfg,
		env,
		missingPluginIds: installCandidatePluginIds,
		configuredPluginIds: params.pluginIds,
		configuredChannelIds: params.channelIds,
		configuredChannelOwnerPluginIds,
		blockedPluginIds: /* @__PURE__ */ new Set([
			...params.blockedPluginIds ?? [],
			...deferredPluginIds,
			...operatorManagedPluginIds
		])
	})) {
		const repair = resolveConfiguredPluginCandidateRepair({
			candidate,
			records: nextRecords,
			env,
			context: {
				bundledPluginsById,
				officialReplacementPluginIds,
				knownIds,
				installedPluginIdsWithStaleVersionBoundRuntimePackages,
				installedPluginIdsWithRepairablePackageDiagnostics,
				configuredPluginIdsWithStaleDescriptors
			}
		});
		if (!repair) continue;
		const { shouldReplaceBrokenOfficialInstall, repairReason } = repair;
		const record = nextRecords[candidate.pluginId];
		const removalPath = shouldReplaceBrokenOfficialInstall ? resolveSafeBrokenOfficialInstallRemovalPath({
			pluginId: candidate.pluginId,
			candidate,
			record,
			env
		}) : null;
		const previousRecords = nextRecords;
		const installed = await installCandidate(copyPluginInstallTransactionRequest(params, {
			candidate,
			config: params.cfg,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			records: nextRecords,
			env,
			updateChannel,
			mode: shouldReplaceBrokenOfficialInstall ? "update" : "install",
			preferNpm: preferNpmInstalls,
			repairReason,
			...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
			beforePersistentEffect: params.beforePersistentEffect
		}));
		if (shouldReplaceBrokenOfficialInstall) {
			const installedRecord = installed.records[candidate.pluginId];
			if (installed.records !== previousRecords && removalPath && (!installedRecord?.installPath || !installPathsEqual(resolveUserPath(installedRecord.installPath, env), removalPath))) {
				await params.beforePersistentEffect?.();
				lease.assertOwned();
				try {
					await rm(removalPath, {
						recursive: true,
						force: true
					});
				} catch (error) {
					await params.beforePersistentEffect?.();
					lease.assertOwned();
					warn(`Failed to remove broken installed plugin "${candidate.pluginId}" at ${removalPath}: ${String(error)}`);
				}
			}
		}
		nextRecords = installed.records;
		changes.push(...installed.changes);
		notices.push(...installed.notices);
		if (!installed.failedPluginId && installed.records !== previousRecords && installed.records[candidate.pluginId]) {
			repairedPluginIds.add(candidate.pluginId);
			failedPlugins.delete(candidate.pluginId);
		}
		if (installed.failedPluginId) recordFailure(installed.failedPluginId, installed.warnings, installed.code);
		else for (const message of installed.warnings) warn(message);
	}
	const persistedIndexOptions = {
		config: params.cfg,
		env,
		filePath: lease.databasePath,
		lease
	};
	if (nextRecords !== persistedRecords || params.baselineRecords) {
		if (params.beforePersistentEffect) {
			const persistedIndex = readPersistedInstalledPluginIndexSync(persistedIndexOptions);
			if (!persistedIndex || hashStableJson(nextRecords) !== hashStableJson(persistedIndex.installRecords) || persistedIndex.policyHash !== resolveInstalledPluginIndexPolicyHash(params.cfg, env)) await params.beforePersistentEffect();
		}
		lease.assertOwned();
		await writePersistedInstalledPluginIndexInstallRecordsWithLease(nextRecords, persistedIndexOptions);
	}
	const pluginInventoryChanged = nextRecords !== persistedRecords || repairedPluginIds.size > 0;
	if ([...driftedPluginIds].some((pluginId) => repairedPluginIds.has(pluginId))) changes.push(`If the Gateway is not restarted by Doctor, run ${formatCliCommand("openclaw gateway restart", env)} to load the updated plugins.`);
	const outcomes = [...sourceOutcomes, ...[...failedPlugins.values()].filter((outcome) => outcome !== void 0)];
	return {
		changes,
		warnings,
		...outcomes.length > 0 ? { outcomes } : {},
		...notices.length > 0 ? { notices } : {},
		...deferredRepairDetails.length > 0 ? { deferredRepairDetails } : {},
		...repairedPluginIds.size > 0 ? { repairedPluginIds: [...repairedPluginIds].toSorted((left, right) => left.localeCompare(right)) } : {},
		...pluginInventoryChanged ? { pluginInventoryChanged: true } : {},
		...failedPlugins.size > 0 ? { failedPluginIds: [...failedPlugins.keys()].toSorted((left, right) => left.localeCompare(right)) } : {},
		records: nextRecords
	};
}
//#endregion
export { detectConfiguredPluginInstallHealthIssues as a, configuredPluginInstallIssueToRepairEffect as i, repairMissingPluginInstallsForIds as n, configuredPluginInstallIssueToHealthFinding as r, repairMissingConfiguredPluginInstalls as t };
