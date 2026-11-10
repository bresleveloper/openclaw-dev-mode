import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { i as stripAnsi } from "./ansi-Xy3t0ZdY.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { y as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { t as formatSourceBundledPluginNotice } from "./dev-source-root-TlYYNN5t.mjs";
import { a as resolveDefaultPluginExtensionsDir, c as resolvePluginInstallDir, d as resolvePluginNpmPackageDir, s as resolveDefaultPluginNpmDir } from "./install-paths-CulPgmRu.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-C_XvO17V.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-B_IER0ZB.mjs";
import { A as resolvePluginInstallSources, C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, T as installWithSourceFallback, k as resolveNpmInstallSpecsForUpdateChannel, w as installWithChannelFallback } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { a as markRetainedManagedNpmInstall, i as hasRetainedManagedNpmInstallMarker, n as clearRetainedManagedNpmInstallMarker } from "./managed-npm-retention-DL_TwTTS.mjs";
import { r as isUnavailableClawHubTarget } from "./clawhub-error-codes-0K_3TO5Q.mjs";
import { n as isUnavailableNpmTarget, t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { o as resolveTrustedSourceLinkedOfficialClawHubInstall } from "./official-external-install-records-DU-ANq4S.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-BZAiJgsR.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as PLUGIN_CAPABILITY_CONSENT_REQUIRED } from "./capability-consent-error-details-DqbomXex.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { t as buildNpmResolutionFields } from "./install-source-utils-DCME3COX.mjs";
import { a as writePersistedInstalledPluginIndexInstallRecordsWithLease, u as resolveNpmInstallRecordSpec } from "./installed-plugin-index-records-DTzp62mN.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { n as isRemovalIoError, r as removePathWithinRoot, t as capturePathRemovalGuard } from "./fs-safe-remove-DYWyr3qX.mjs";
import { G as withPluginInstallTransactions, H as retainPluginInstallTransaction, I as attachPluginInstallTransaction, L as copyPluginInstallTransactionRequest } from "./npm-managed-root-BNUNz2jq.mjs";
import { r as installPluginFromNpmSpec } from "./install-yOBcrQp1.mjs";
import { a as readInstalledPackageVersion, t as comparePackageUpdateVersions } from "./package-update-utils-BhTxVhIA.mjs";
import { n as isPayloadMissing } from "./payload-verification-B5DHkUNO.mjs";
import { a as collectConfiguredChannelIds, i as collectBlockedPluginIds, o as collectConfiguredPluginIds, r as resolveConfiguredPluginInstallContext } from "./missing-configured-plugin-install.candidates-DbdIQ2RX.mjs";
import { r as prepareManagedPluginArtifactConsentHandler, t as capturePluginCapabilityConsentHandlerErrors } from "./capability-consent-DUF3nrtk.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as installPluginFromClawHub } from "./clawhub-cX8No04d.mjs";
import { a as forceNpmInstallRecordRepair, c as resolveLegacyNpmPackageInstallPath, i as resolveRecordedInstallCandidate, l as resolveSafeBrokenOfficialInstallRemovalPath, n as resolveConfiguredPluginCandidateRepair, o as installPathsEqual, r as resolveConfiguredPluginRepairVersions, s as recordMatchesBundledPackage } from "./missing-configured-plugin-install.targets-D-qPJ_Gb.mjs";
import { n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome } from "./update-ci227bBY.mjs";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import { assertDirectoryIdentitySync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/commands/doctor/shared/missing-configured-plugin-install.install.ts
function isClawHubReviewNotice(message) {
	const audit = stripAnsi(message);
	return audit.includes("ClawHub Security Audit") && audit.includes("Outcome: Review");
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
					if (!result.ok && mode === "install" && /\bplugin already exists:/.test(result.error)) result = await install("update");
					retainPluginInstallTransaction(params, result);
					return {
						result,
						capabilityConsent
					};
				},
				isRetryable: (attempt) => !attempt.result.ok && (source.source === "npm" ? isUnavailableNpmTarget(attempt.result) : isUnavailableClawHubTarget(attempt.result)),
				onFallback: (message) => void channelNotices.push(message)
			});
		},
		result: (attempt) => attempt.result,
		onFallback: (message) => void channelNotices.push(message)
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
		...buildNpmResolutionFields(installResult.npmResolution)
	};
	const installSpec = (installedSource.source === "npm" ? npmSpecs : clawhubSpecs)?.installSpec ?? installedSource.spec;
	return {
		records: {
			...params.records,
			[pluginId]: acceptedConsent.applyAcceptedSurface(pluginId, {
				...installedRecord,
				installedAt: (/* @__PURE__ */ new Date()).toISOString()
			})
		},
		changes: [staleRuntimeRepair ? `Refreshed stale configured plugin "${pluginId}" from ${installSpec}.` : `Installed missing configured plugin "${pluginId}" from ${installSpec}.`],
		notices: [...channelNotices, ...warnings],
		warnings: []
	};
}
function resolveExistingCandidateNpmPackagePath(params) {
	const npmName = params.candidate.npmSpec ? parseRegistryNpmSpec(params.candidate.npmSpec)?.name : void 0;
	if (!npmName) return null;
	const packagePath = resolvePluginNpmPackageDir({
		packageName: npmName,
		npmDir: params.npmDir
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
/** Detect configured plugin installs that Doctor can repair without mutating package state. */
async function detectConfiguredPluginInstallHealthIssues(params) {
	const env = params.env ?? process.env;
	const pluginIds = collectConfiguredPluginIds(params.cfg, env);
	const channelIds = collectConfiguredChannelIds(params.cfg, env);
	const blockedPluginIds = collectBlockedPluginIds(params.cfg);
	const context = await resolveConfiguredPluginInstallContext({
		cfg: params.cfg,
		env,
		configuredPluginIds: pluginIds,
		configuredChannelIds: channelIds,
		blockedPluginIds,
		baselineRecords: params.baselineRecords
	});
	const { configuredPluginIdsWithStaleDescriptors: staleDescriptorPluginIds, records, installedPluginIdsWithRepairablePackageDiagnostics: repairablePackageDiagnosticPluginIds, installedPluginIdsWithStaleVersionBoundRuntimePackages: staleVersionBoundRuntimePluginIds, installedPluginMissingRequiredDependencies } = context;
	const issues = [];
	const { pluginIds: deferredPluginIds, repairPluginIds } = context.collectDeferredRepairs(records);
	for (const pluginId of repairPluginIds) {
		const installPath = resolveRecordInstallPath(records[pluginId], env);
		issues.push({
			kind: "deferred-package-manager-repair",
			pluginId,
			...installPath ? { installPath } : {}
		});
	}
	for (const [pluginId] of context.collectRecordedRepairs(records, deferredPluginIds)) {
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
			continue;
		}
		const kind = staleVersionBoundRuntimePluginIds.has(pluginId) ? "stale-version-bound-runtime" : repairablePackageDiagnosticPluginIds.has(pluginId) ? "repairable-installed-plugin" : staleDescriptorPluginIds.has(pluginId) ? "stale-channel-config-descriptor" : "missing-installed-payload";
		const installPath = resolveRecordInstallPath(record, env);
		issues.push({
			kind,
			pluginId,
			...installPath ? { installPath } : {},
			...kind === "stale-channel-config-descriptor" ? {} : recordedInstallIdentity(record)
		});
	}
	const reportedPluginIds = new Set(issues.map((issue) => issue.pluginId));
	for (const candidate of context.collectInstallCandidates(records, deferredPluginIds)) {
		if (reportedPluginIds.has(candidate.pluginId)) continue;
		const repair = resolveConfiguredPluginCandidateRepair({
			candidate,
			records,
			env,
			context
		});
		if (!repair) continue;
		const record = records[candidate.pluginId];
		const installSpec = resolvePluginInstallSources(candidate)[0]?.spec;
		if (repair.shouldReplaceBrokenOfficialInstall || record) {
			const installPath = resolveRecordInstallPath(record, env);
			issues.push({
				kind: repair.shouldReplaceBrokenOfficialInstall ? staleVersionBoundRuntimePluginIds.has(candidate.pluginId) ? "stale-version-bound-runtime" : "repairable-installed-plugin" : "missing-installed-payload",
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
		message: "is not installed.",
		fixHint: "",
		action: "would-install-configured-plugin"
	},
	"missing-installed-payload": {
		message: "has an install record but its package payload is missing.",
		fixHint: null,
		action: "would-reinstall-configured-plugin"
	},
	"missing-required-dependencies": {
		message: "is missing required dependencies:",
		fixHint: null,
		action: "would-repair-configured-plugin-dependencies"
	},
	"repairable-installed-plugin": {
		message: "has a repairable package install problem.",
		fixHint: null,
		action: "would-repair-configured-plugin-install"
	},
	"stale-version-bound-runtime": {
		message: "is older than this OpenClaw version.",
		fixHint: "Run `openclaw doctor --fix` to refresh the configured runtime plugin.",
		action: "would-refresh-configured-runtime-plugin"
	},
	"stale-channel-config-descriptor": {
		message: "has stale channel config metadata.",
		fixHint: "Run `openclaw doctor --fix` to repair the configured plugin install metadata.",
		action: "would-repair-configured-plugin-install"
	},
	"deferred-package-manager-repair": {
		message: "package repair is deferred until the package update finishes.",
		fixHint: "Rerun `openclaw doctor --fix` after the package update completes.",
		action: "would-defer-configured-plugin-install-repair"
	}
};
function configuredPluginInstallIssueToHealthFinding(issue) {
	const detail = CONFIGURED_PLUGIN_INSTALL_ISSUE_DETAILS[issue.kind];
	const installSpec = "installSpec" in issue ? issue.installSpec : void 0;
	const message = `Configured ${issue.kind === "stale-version-bound-runtime" ? "runtime plugin" : "plugin"} ${issue.pluginId} ${detail.message}`;
	return {
		checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
		severity: "warning",
		message: issue.kind === "missing-required-dependencies" ? `${message} ${issue.missingRequired.join(", ")}.` : message,
		target: issue.pluginId,
		..."installSource" in issue ? { source: issue.installSource } : {},
		..."installPath" in issue && issue.installPath ? { path: issue.installPath } : {},
		fixHint: issue.kind === "missing-install-record" ? `Run \`openclaw doctor --fix\` to install ${issue.installSpec}.` : detail.fixHint ?? (installSpec ? `Run \`openclaw plugins install ${installSpec} --force\` to reinstall the configured plugin package.` : "Run `openclaw doctor --fix` to repair the configured plugin install. An exact reinstall command is unavailable because the install record has no package spec.")
	};
}
function configuredPluginInstallIssueToRepairEffect(issue) {
	return {
		kind: "package",
		action: CONFIGURED_PLUGIN_INSTALL_ISSUE_DETAILS[issue.kind].action,
		target: issue.pluginId,
		dryRunSafe: issue.kind === "deferred-package-manager-repair"
	};
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.repair.ts
async function repairMissingConfiguredPluginInstalls(params) {
	return repairMissingPluginInstalls(copyPluginInstallTransactionRequest(params, {
		...params,
		pluginIds: collectConfiguredPluginIds(params.cfg, params.env),
		channelIds: collectConfiguredChannelIds(params.cfg, params.env),
		blockedPluginIds: collectBlockedPluginIds(params.cfg)
	}));
}
async function repairMissingPluginInstallsForIds(params) {
	return repairMissingPluginInstalls(copyPluginInstallTransactionRequest(params, {
		...params,
		pluginIds: new Set(normalizeTrimmedStringList([...params.pluginIds])),
		channelIds: new Set(normalizeTrimmedStringList([...params.channelIds ?? []])),
		blockedPluginIds: new Set(normalizeTrimmedStringList([...params.blockedPluginIds ?? []]))
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
	const installContext = await resolveConfiguredPluginInstallContext({
		cfg: params.cfg,
		env,
		configuredPluginIds: params.pluginIds,
		configuredChannelIds: params.channelIds,
		blockedPluginIds: params.blockedPluginIds,
		baselineRecords: params.baselineRecords
	});
	const { knownIds, bundledPluginsById, configuredPluginIdsWithStaleDescriptors, operatorManagedPluginIds, stalePathInstallPluginIds, records, persistedRecords, updateChannel, installedPluginIdsWithRepairablePackageDiagnostics, installedPluginIdsWithStaleVersionBoundRuntimePackages, installedPluginMissingRequiredDependencies } = installContext;
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
	const { coreVersion, cohortSpecs, newerRecordedPluginIds, driftedPluginIds } = resolveConfiguredPluginRepairVersions({
		cfg: params.cfg,
		env,
		context: installContext,
		repairVersionDrift: params.repairVersionDrift,
		onWarning: warn
	});
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
	const { pluginIds: deferredPluginIds, repairPluginIds } = installContext.collectDeferredRepairs(nextRecords);
	for (const pluginId of repairPluginIds) {
		const detail = `Skipped package-manager repair for configured plugin "${pluginId}" during package update; rerun "openclaw doctor --fix" after the update completes.`;
		changes.push(detail);
		deferredRepairDetails.push(detail);
	}
	const missingRecordedPlugins = installContext.collectRecordedRepairs(nextRecords, deferredPluginIds, driftedPluginIds);
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
			npmInstallSpecOverrides: Object.fromEntries(Object.entries(cohortSpecs).filter(([pluginId]) => driftedPluginIds.has(pluginId) && !newerRecordedPluginIds.has(pluginId))),
			versionBoundPluginIds: new Set(missingRecordedPlugins.filter(([pluginId, record]) => (updateChannel === "stable" || updateChannel === "extended-stable") && params.pluginIds.has(pluginId) && VERSION_BOUND_RUNTIME_PLUGIN_IDS.has(pluginId) && (record.source === "npm" && Boolean(cohortSpecs[pluginId]) || Boolean(resolveTrustedSourceLinkedOfficialClawHubInstall({
				pluginId,
				record
			}))) && !newerRecordedPluginIds.has(pluginId) && (installedPluginIdsWithStaleVersionBoundRuntimePackages.has(pluginId) || isPayloadMissing(env, record.installPath))).map(([pluginId]) => pluginId)),
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
			} else if (outcome.status === "error" || isClawHubTrustSkippedOutcome(outcome) || outcome.status === "skipped" && installedPluginMissingRequiredDependencies.has(outcome.pluginId)) recordFailure(outcome.pluginId, [outcome.message], outcome.code);
		}
		if (repairedPluginIds.size > 0) {
			nextRecords = { ...updateResult.config.plugins?.installs ?? nextRecords };
			for (const [pluginId, record] of missingRecordedPlugins) if (!repairedPluginIds.has(pluginId)) nextRecords[pluginId] = record;
		}
	}
	for (const candidate of installContext.collectInstallCandidates(nextRecords, deferredPluginIds)) {
		const repair = resolveConfiguredPluginCandidateRepair({
			candidate,
			records: nextRecords,
			env,
			context: installContext
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
		const assertRemovalPath = removalPath ? capturePathRemovalGuard(removalPath) : void 0;
		const removalParent = removalPath ? path.dirname(removalPath) : void 0;
		const assertRemovalParent = assertRemovalPath && removalParent ? capturePathRemovalGuard(removalParent) : void 0;
		const removalParentReal = assertRemovalParent && removalParent ? realpathSync(removalParent) : void 0;
		const removalParentIdentity = removalParentReal ? lstatSync(removalParentReal, { bigint: true }) : void 0;
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
			repairReason,
			...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
			beforePersistentEffect: params.beforePersistentEffect
		}));
		if (shouldReplaceBrokenOfficialInstall) {
			const installedRecord = installed.records[candidate.pluginId];
			if (installed.records !== previousRecords && removalPath && assertRemovalPath && removalParent && assertRemovalParent && removalParentReal && removalParentIdentity && (!installedRecord?.installPath || !installPathsEqual(resolveUserPath(installedRecord.installPath, env), removalPath))) {
				const assertRetirementOwned = retainMutationAuthority(() => {
					assertCurrent();
					assertRemovalParent();
					if (realpathSync(removalParent) !== removalParentReal) throw new FsSafeError("path-mismatch", "plugin retirement parent changed");
					assertDirectoryIdentitySync(removalParentReal, {
						dev: removalParentIdentity.dev,
						ino: removalParentIdentity.ino,
						realPath: removalParentReal
					});
					assertRemovalPath();
				});
				retainPluginInstallTransaction(params, attachPluginInstallTransaction({}, {
					commit: async () => {
						await params.beforePersistentEffect?.();
						assertRetirementOwned();
						try {
							await removePathWithinRoot({
								rootDir: removalParentReal,
								relativePath: path.basename(removalPath),
								recursive: true,
								force: true,
								symlinks: "unlink",
								assertBeforeMutation: assertRetirementOwned
							});
						} catch (error) {
							assertRetirementOwned();
							if (!isRemovalIoError(error)) throw error;
							warn(`Failed to remove broken installed plugin "${candidate.pluginId}" at ${removalPath}: ${String(error)}`);
						}
					},
					rollback: async () => {}
				}));
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
