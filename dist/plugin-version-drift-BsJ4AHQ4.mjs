import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BJGPJZu6.mjs";
import { c as resolveOpenClawReleaseCohortVersion, i as isPrereleaseResolutionAllowed, o as parseRegistryNpmSpec, r as isExactSemverVersion, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BquD107I.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-BYX-I5ww.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-_DIjXzI0.mjs";
import { o as unscopedPackageName } from "./install-safe-path-CvmSx2MJ.mjs";
import { D as resolveClawHubInstallSpecsForUpdateChannel, O as resolveDefaultNpmSpec, k as resolveNpmInstallSpecsForUpdateChannel, p as resolveOfficialExternalPluginInstall, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { a as resolveTrustedSourceLinkedOfficialClawHubInstall, o as resolveTrustedSourceLinkedOfficialNpmInstall } from "./official-external-install-records-DRa6WG1g.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DhjoqTWe.mjs";
import { c as resolveNpmSpecMetadata } from "./install-source-utils-CQUKARYZ.mjs";
import { n as expectedIntegrityForUpdate, r as isPackageVersionDowngrade, t as comparePackageUpdateVersions } from "./package-update-utils-CEpDQ5XC.mjs";
import { n as fetchClawHubPackageDetail, s as resolveLatestVersionFromPackage } from "./clawhub-packages-U1mzSSOu.mjs";
//#region src/plugins/update-source.ts
function isPluginInstallRecordUpdateSource(record) {
	return record?.source === "npm" || record?.source === "marketplace" || record?.source === "clawhub" || record?.source === "git";
}
/** Return whether update identity compatibility can migrate an unscoped install key. */
function pluginInstallRecordMayMigrateConfigId(params) {
	if (!isPluginInstallRecordUpdateSource(params.record)) return false;
	if (params.record?.source !== "npm") return !params.pluginId.includes("/");
	const packageName = resolveNpmSpecPackageName(params.specOverride ?? params.record.spec) ?? params.record.resolvedName ?? resolveNpmSpecPackageName(params.record.resolvedSpec);
	return packageName !== void 0 && packageName !== params.pluginId && unscopedPackageName(packageName) === params.pluginId || resolveTrustedSourceLinkedOfficialNpmInstall({
		pluginId: params.pluginId,
		record: params.record
	})?.replacementPluginId !== void 0;
}
function shouldSkipUnchangedNpmInstall(params) {
	if (!params.currentVersion || params.currentVersion !== params.metadata.version) return false;
	if (!params.record.resolvedName || !params.record.resolvedSpec || !params.record.resolvedVersion) return false;
	return (!params.metadata.integrity || params.record.integrity === params.metadata.integrity) && (!params.metadata.shasum || params.record.shasum === params.metadata.shasum) && params.record.resolvedName === params.metadata.name && params.record.resolvedSpec === params.metadata.resolvedSpec && params.record.resolvedVersion === params.metadata.version;
}
function shouldBypassTrustedOfficialUnchangedNpmCheck(params) {
	if (!params.trustedSourceLinkedOfficialInstall || !params.metadata.version) return false;
	const parsedSpec = parseRegistryNpmSpec(params.spec);
	return Boolean(parsedSpec && !isPrereleaseResolutionAllowed({
		spec: parsedSpec,
		resolvedVersion: params.metadata.version
	}));
}
function expectedIntegrityForNpmUpdate(params) {
	if (params.record.source !== "npm") return;
	if (params.effectiveSpec === params.record.spec) return expectedIntegrityForUpdate(params.record.spec, params.record.integrity);
	if (!params.trustedSourceLinkedOfficialInstall || !params.metadata) return;
	const metadataName = params.metadata.name ?? resolveNpmSpecPackageName(params.effectiveSpec);
	const recordName = params.record.resolvedName ?? resolveNpmSpecPackageName(params.record.resolvedSpec) ?? resolveNpmSpecPackageName(params.record.spec);
	if (!metadataName || metadataName !== recordName) return;
	if (!params.metadata.version || params.metadata.version !== params.record.resolvedVersion) return;
	return expectedIntegrityForUpdate(params.record.resolvedSpec ?? params.record.spec, params.record.integrity);
}
async function resolveNewerExactPinnedNpmDefaultLine(params) {
	if (!params.currentVersion || !params.probeNpmVersion || !params.recordedSpec) return;
	const packageName = resolveNpmSpecPackageName(params.recordedSpec);
	const exactVersion = resolveExactNpmSpecVersion(params.recordedSpec);
	const probeNpmVersion = normalizeExactSemverVersion(params.probeNpmVersion);
	if (!packageName || !exactVersion || probeNpmVersion !== exactVersion) return;
	const specs = await resolveNpmInstallSpecsForUpdateChannel({
		spec: packageName,
		updateChannel: params.updateChannel,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	if (!specs) return;
	const registryLine = specs.channelTag ?? "latest";
	const metadataResult = specs.npmResolution ? {
		ok: true,
		metadata: specs.npmResolution
	} : await resolveNpmSpecMetadata({
		spec: specs.installSpec,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	if (!metadataResult?.ok || metadataResult.metadata.name !== packageName || !metadataResult.metadata.version) return;
	return comparePackageUpdateVersions(metadataResult.metadata.version, params.currentVersion) > 0 ? {
		packageName,
		registryLine,
		version: metadataResult.metadata.version
	} : void 0;
}
async function resolveNewerExactPinnedClawHubDefaultLine(params) {
	if (!params.currentVersion || !params.probeClawHubVersion || !params.recordedSpec) return;
	const parsed = parseClawHubPluginSpec(params.recordedSpec);
	const exactVersion = normalizeExactSemverVersion(parsed?.version);
	const probeClawHubVersion = normalizeExactSemverVersion(params.probeClawHubVersion);
	if (!parsed?.name || !parsed.version || !exactVersion || !probeClawHubVersion || probeClawHubVersion !== exactVersion) return;
	const detail = await fetchClawHubPackageDetail({
		name: parsed.name,
		baseUrl: params.baseUrl,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	if (!detail?.package || detail.package.name !== parsed.name) return;
	if (detail.package.tags?.[parsed.version] != null) return;
	const betaVersion = detail.package.tags?.beta;
	const registryLine = params.updateChannel === "beta" && betaVersion ? "beta" : "latest";
	const version = registryLine === "beta" ? betaVersion : resolveLatestVersionFromPackage(detail);
	if (!version || comparePackageUpdateVersions(version, params.currentVersion) <= 0) return;
	return {
		packageName: parsed.name,
		registryLine,
		version
	};
}
function isNpmMetadataCompatibleWithCurrentHost(metadata, options = {}) {
	const hostVersion = options.hostVersion ?? resolveCompatibilityHostVersion();
	const installMetadata = metadata.packageOpenClaw?.install;
	if (!checkMinHostVersion({
		currentVersion: hostVersion,
		minHostVersion: isRecord(installMetadata) ? installMetadata.minHostVersion : void 0,
		allowLegacyBareSemver: options.allowLegacyBareSemver
	}).ok) return false;
	const pluginApiRangeCheck = resolvePackagePluginApiRange(metadata.packageOpenClaw);
	if (!pluginApiRangeCheck.ok) return false;
	const pluginApiRange = pluginApiRangeCheck.range;
	if (!pluginApiRange) return true;
	return satisfiesPluginApiRange(hostVersion, pluginApiRange);
}
function formatBetaChannelFallbackOutcomeSuffix(params) {
	if (!params.fallbackSpec) return "";
	const betaTarget = params.fallbackLabel ?? "beta target";
	return ` (warning: beta channel fallback ${params.verb} ${params.fallbackSpec} because ${betaTarget} could not be used).`;
}
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveExactNpmSpecVersion(spec) {
	const parsed = spec ? parseRegistryNpmSpec(spec) : null;
	return parsed?.selectorKind === "exact-version" ? normalizeExactSemverVersion(parsed.selector) : void 0;
}
function normalizeExactSemverVersion(value) {
	if (!value) return;
	const trimmed = value.trim();
	if (!isExactSemverVersion(trimmed)) return;
	return trimmed.startsWith("v") ? trimmed.slice(1) : trimmed;
}
function isTrustedSourceLinkedOfficialNpmUpdate(params) {
	const officialSpec = resolveTrustedSourceLinkedOfficialNpmInstall(params)?.npmSpec;
	const officialPackageName = resolveNpmSpecPackageName(officialSpec);
	const requestedPackageName = resolveNpmSpecPackageName(params.spec);
	return Boolean(officialPackageName && requestedPackageName === officialPackageName);
}
function isTrustedSourceLinkedOfficialBridgeNpmInstall(params) {
	const entry = getOfficialExternalPluginCatalogEntry(params.targetPluginId);
	if (!entry) return false;
	const officialPackageName = resolveNpmSpecPackageName(resolveOfficialExternalPluginInstall(entry)?.npmSpec);
	const requestedPackageName = resolveNpmSpecPackageName(params.npmSpec);
	return Boolean(officialPackageName && requestedPackageName === officialPackageName);
}
/** Older managed releases resume the catalog's update policy after a successful update. */
function resolveUnpinnedOfficialReleaseSpec(params) {
	const recorded = params.spec ? parseRegistryNpmSpec(params.spec) : null;
	const official = params.officialSpec ? resolveDefaultNpmSpec(params.officialSpec) : null;
	const pinnedVersion = normalizeExactSemverVersion(recorded?.selector);
	const coreVersion = normalizeExactSemverVersion(params.coreVersion);
	if (recorded?.selectorKind !== "exact-version" || !pinnedVersion || !official?.name.startsWith("@openclaw/") || recorded.name !== official.name || !coreVersion) return;
	const order = compareOpenClawReleaseVersions(pinnedVersion, coreVersion);
	return order !== null && order <= 0 ? official.raw : void 0;
}
/** Apply selector and release-pin policy before automatic cohort targets. */
function resolveNpmUpdateTarget(params) {
	const official = params.trustedOfficialInstall;
	const specOverride = params.specOverride ?? (official?.replacementPluginId || official?.replaceNpmPackage ? official.npmSpec : void 0) ?? resolveUnpinnedOfficialReleaseSpec({
		spec: params.record.spec,
		officialSpec: official?.npmSpec,
		coreVersion: resolveExactNpmSpecVersion(params.installSpecOverride) ?? params.coreVersion
	});
	const spec = specOverride ?? params.record.spec ?? (params.syncOfficialPluginInstalls ? official?.npmSpec : void 0);
	return {
		specOverride,
		target: spec ? {
			spec,
			installSpecOverride: !params.specOverride && resolveDefaultNpmSpec(spec) ? params.installSpecOverride : void 0,
			updateChannel: params.updateChannel,
			officialPackageName: resolveNpmSpecPackageName(official?.npmSpec),
			coreVersion: params.coreVersion,
			versionBoundToCore: params.versionBoundToCore,
			timeoutMs: params.timeoutMs
		} : void 0
	};
}
function resolveClawHubUpdateSpecs(params) {
	const clawhubPackage = params.record.clawhubPackage ?? parseClawHubPluginSpec(params.record.spec ?? "")?.name ?? parseClawHubPluginSpec(params.record.resolvedSpec ?? "")?.name;
	if (!params.officialSpecOverride && !clawhubPackage) return {};
	const recordSpec = params.record.spec ?? params.officialSpecOverride ?? params.record.resolvedSpec ?? `clawhub:${clawhubPackage}`;
	const recorded = parseClawHubPluginSpec(recordSpec);
	const official = params.officialSpec ? parseClawHubPluginSpec(params.officialSpec) : null;
	const unpinnedSpec = recorded && official ? resolveUnpinnedOfficialReleaseSpec({
		spec: `${recorded.name}${recorded.version ? `@${recorded.version}` : ""}`,
		officialSpec: `${official.name}${official.version ? `@${official.version}` : ""}`,
		coreVersion: params.coreVersion
	}) : void 0;
	return resolveClawHubInstallSpecsForUpdateChannel({
		spec: unpinnedSpec ? `clawhub:${unpinnedSpec}` : recordSpec,
		updateChannel: params.updateChannel,
		officialPackageName: params.officialPackageName,
		coreVersion: params.coreVersion,
		versionBoundToCore: params.versionBoundToCore
	});
}
/** Only a catalog-declared alternate may satisfy an implicit exact ClawHub target. */
function resolveClawHubNpmUpdateFallback(officialInstall, clawhubSpecs) {
	const { npmSpec, expectedIntegrity } = officialInstall ?? {};
	const target = parseClawHubPluginSpec(clawhubSpecs?.installSpec ?? "");
	if (!npmSpec || clawhubSpecs?.installSpec === clawhubSpecs?.recordSpec || !target?.version || !isExactSemverVersion(target.version)) return;
	const installSpec = resolveDefaultNpmSpec(npmSpec) ? `${resolveNpmSpecPackageName(npmSpec)}@${target.version}` : npmSpec;
	if (resolveExactNpmSpecVersion(installSpec) !== target.version) return;
	return {
		installSpec,
		recordSpec: npmSpec,
		expectedIntegrity: installSpec === npmSpec ? expectedIntegrity : void 0
	};
}
/** Identity matching permits id/path cleanup, never an implicit registry-source switch. */
function isBridgeRegistryInstall(bridge, record) {
	if (record.source === "npm") {
		const packageName = resolveNpmSpecPackageName(bridge.npmSpec);
		const recordedName = record.resolvedName ?? resolveNpmSpecPackageName(record.spec) ?? resolveNpmSpecPackageName(record.resolvedSpec);
		return Boolean(packageName && packageName === recordedName);
	}
	const packageName = parseClawHubPluginSpec(bridge.clawhubSpec ?? "")?.name;
	const recordedName = record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name;
	return record.source === "clawhub" && Boolean(packageName && packageName === recordedName);
}
//#endregion
//#region src/plugins/plugin-version-drift.ts
function resolveExactNpmPinPackageName(entry) {
	if (entry.source !== "npm" || !entry.spec) return;
	const parsed = parseRegistryNpmSpec(entry.spec);
	if (parsed?.selectorKind !== "exact-version") return;
	return parsed.name;
}
/** Exact npm pins need a registry-confirmed package@version target; id-only updates preserve pins. */
function resolvePluginVersionDriftUpdateCommand(entry) {
	if (entry.source === "clawhub" && (entry.targetResolution?.status === "unresolved" || entry.targetResolution?.status === "registry-current")) return;
	const exactNpmPackageName = resolveExactNpmPinPackageName(entry);
	if (exactNpmPackageName) {
		if (entry.targetResolution?.status !== "resolved" || entry.targetResolution.packageName !== exactNpmPackageName || entry.targetResolution.requestedTarget !== resolveOpenClawReleaseCohortVersion(entry.gatewayVersion)) return;
		const exactNpmTarget = `${exactNpmPackageName}@${entry.targetResolution.version}`;
		if (parseRegistryNpmSpec(exactNpmTarget)?.selectorKind === "exact-version") return `openclaw plugins update ${exactNpmTarget}`;
		return;
	}
	return `openclaw plugins update ${entry.pluginId}`;
}
/**
* Reports the registry version an install already holds when ClawHub publishes nothing
* newer, together with the Gateway version the diagnostic asked for.
*/
function resolvePluginVersionDriftRegistryLag(entry) {
	const targetResolution = entry.targetResolution;
	return targetResolution?.status === "registry-current" ? {
		registryVersion: targetResolution.version,
		expectedVersion: targetResolution.requestedTarget
	} : void 0;
}
/**
* ClawHub publishes plugins on its own release train, so its latest version can sit
* below the running OpenClaw version. Resolve the upgrade target from ClawHub instead
* of assuming the host version is available there.
*/
async function fetchClawHubLatestVersion(packageName, gatewayVersion, baseUrl) {
	try {
		const detail = await fetchClawHubPackageDetail({
			name: packageName,
			baseUrl
		});
		const compatibility = detail.package?.compatibility;
		if (!satisfiesPluginApiRange(gatewayVersion, compatibility?.pluginApiRange)) return {
			version: null,
			error: `ClawHub ${packageName} requires plugin API ${compatibility?.pluginApiRange}, but the target Gateway is ${gatewayVersion}`
		};
		if (compatibility?.minGatewayVersion && !checkMinHostVersion({
			currentVersion: gatewayVersion,
			minHostVersion: compatibility.minGatewayVersion,
			allowLegacyBareSemver: true
		}).ok) return {
			version: null,
			error: `ClawHub ${packageName} declares minGatewayVersion ${compatibility.minGatewayVersion}, which the target Gateway ${gatewayVersion} does not satisfy`
		};
		return { version: resolveLatestVersionFromPackage(detail) };
	} catch (err) {
		return {
			version: null,
			error: `ClawHub did not resolve ${packageName}: ${String(err)}`
		};
	}
}
async function resolveClawHubTarget(entry) {
	const packageName = entry.clawhubPackage;
	if (!packageName) return;
	const requestedTarget = resolveOpenClawReleaseCohortVersion(entry.gatewayVersion);
	try {
		const { installSpec } = resolveClawHubUpdateSpecs({
			record: {
				source: "clawhub",
				spec: entry.spec,
				clawhubPackage: packageName
			},
			officialSpec: entry.clawhubOfficialSpec,
			updateChannel: entry.clawhubUpdateChannel,
			officialPackageName: packageName,
			coreVersion: entry.gatewayVersion
		});
		const selectedSpec = installSpec ?? entry.spec ?? `clawhub:${packageName}`;
		const parsed = parseClawHubPluginSpec(selectedSpec);
		if (!parsed || parsed.version && parsed.version.toLowerCase() !== "latest") return {
			status: "unresolved",
			packageName,
			requestedTarget,
			error: `ClawHub latest metadata cannot confirm the selected target ${selectedSpec}`
		};
	} catch (err) {
		return {
			status: "unresolved",
			packageName,
			requestedTarget,
			error: String(err)
		};
	}
	const { version: latestVersion, error } = await fetchClawHubLatestVersion(packageName, entry.gatewayVersion, entry.clawhubUrl);
	if (!latestVersion) return {
		status: "unresolved",
		packageName,
		requestedTarget,
		error: error ?? `ClawHub reported no latest version for ${packageName}`
	};
	if (latestVersion === entry.installedVersion) return {
		status: "registry-current",
		packageName,
		requestedTarget,
		version: latestVersion
	};
	if (isPackageVersionDowngrade(entry.installedVersion, latestVersion)) return {
		status: "unresolved",
		packageName,
		requestedTarget,
		error: `ClawHub latest ${latestVersion} is older than installed ${entry.installedVersion}`
	};
	return {
		status: "resolved",
		packageName,
		requestedTarget,
		version: latestVersion
	};
}
async function resolveEntryTarget(entry) {
	if (entry.source === "clawhub") {
		const targetResolution = await resolveClawHubTarget(entry);
		return targetResolution ? {
			...entry,
			targetResolution
		} : entry;
	}
	const packageName = resolveExactNpmPinPackageName(entry);
	if (!packageName) return entry;
	const requestedTarget = resolveOpenClawReleaseCohortVersion(entry.gatewayVersion);
	const requestedSpec = `${packageName}@${requestedTarget}`;
	const result = parseRegistryNpmSpec(requestedSpec)?.selectorKind === "exact-version" ? await fetchNpmPackageTargetStatus({
		packageName,
		target: requestedTarget
	}) : {
		version: null,
		error: "gateway release cohort is not an exact npm version"
	};
	const targetResolution = result.version === requestedTarget ? {
		status: "resolved",
		packageName,
		requestedTarget,
		version: requestedTarget
	} : {
		status: "unresolved",
		packageName,
		requestedTarget,
		error: `npm registry did not resolve ${requestedSpec}: ${result.error ?? `returned ${JSON.stringify(result.version)}`}`
	};
	return {
		...entry,
		targetResolution
	};
}
/** Resolve registry repair targets only for diagnostics that display repair guidance. */
async function resolvePluginVersionDriftTargets(report) {
	return {
		...report,
		drifts: await Promise.all(report.drifts.map(resolveEntryTarget))
	};
}
function isPluginEnabled(config, pluginId) {
	const normalizedPluginConfig = normalizePluginsConfig(config?.plugins);
	return resolveEffectiveEnableState({
		id: pluginId,
		origin: "global",
		config: normalizedPluginConfig,
		rootConfig: config
	}).enabled;
}
function shouldCompareOfficialInstallToGateway(params) {
	const officialNpmSpec = resolveTrustedSourceLinkedOfficialNpmInstall(params)?.npmSpec;
	if (officialNpmSpec) return parseRegistryNpmSpec(officialNpmSpec)?.selectorKind !== "exact-version";
	const officialClawHubInstall = resolveTrustedSourceLinkedOfficialClawHubInstall(params);
	if (officialClawHubInstall) {
		if (officialClawHubInstall.clawhubSpec) return !parseClawHubPluginSpec(officialClawHubInstall.clawhubSpec)?.version;
		return parseRegistryNpmSpec(officialClawHubInstall.npmSpec ?? "")?.selectorKind !== "exact-version";
	}
	return false;
}
function hasOfficialPluginVersionCandidates(params) {
	return Object.entries(params.installRecords).some(([pluginId, record]) => Boolean(record) && isPluginEnabled(params.config, pluginId) && shouldCompareOfficialInstallToGateway({
		pluginId,
		record
	}));
}
/** Exact cohort targets shared by automatic updates and Doctor's drift repair. */
function resolveOfficialPluginCohortNpmSpecs(params) {
	const version = resolveOpenClawReleaseCohortVersion(params.gatewayVersion);
	const specs = {};
	for (const [pluginId, record] of Object.entries(params.installRecords)) {
		if (record.source !== "npm" || !isPluginEnabled(params.config, pluginId) || !shouldCompareOfficialInstallToGateway({
			pluginId,
			record
		})) continue;
		const official = resolveTrustedSourceLinkedOfficialNpmInstall({
			pluginId,
			record
		})?.npmSpec;
		const packageName = official ? parseRegistryNpmSpec(official)?.name : void 0;
		if (packageName && parseRegistryNpmSpec(`${packageName}@${version}`)?.selectorKind === "exact-version") specs[pluginId] = `${packageName}@${version}`;
	}
	return specs;
}
/** Compare active official installs to the host cohort, sorted by plugin id for diagnostics. */
function detectPluginVersionDrift(params) {
	const { gatewayVersion, installRecords, config } = params;
	const normalizedGateway = resolveOpenClawReleaseCohortVersion(gatewayVersion);
	const drifts = [];
	for (const [pluginId, record] of Object.entries(installRecords)) {
		if (!record || !isPluginEnabled(config, pluginId) || !shouldCompareOfficialInstallToGateway({
			pluginId,
			record
		})) continue;
		const installedVersion = record.resolvedVersion ?? record.version;
		if (!installedVersion) continue;
		if (resolveOpenClawReleaseCohortVersion(installedVersion) === normalizedGateway) continue;
		const clawhubPackage = record.source === "clawhub" ? record.clawhubPackage?.trim() ?? parseClawHubPluginSpec(record.spec ?? "")?.name : void 0;
		const clawhubOfficialSpec = clawhubPackage ? resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		})?.clawhubSpec : void 0;
		drifts.push({
			pluginId,
			installedVersion,
			gatewayVersion,
			source: record.source,
			...record.resolvedName ? { packageName: record.resolvedName } : {},
			...record.spec ? { spec: record.spec } : {},
			...clawhubPackage ? {
				clawhubPackage,
				...clawhubOfficialSpec ? { clawhubOfficialSpec } : {},
				spec: record.spec ?? record.resolvedSpec ?? `clawhub:${clawhubPackage}`,
				clawhubUrl: record.clawhubUrl ?? "https://clawhub.ai",
				clawhubUpdateChannel: normalizeUpdateChannel(config?.update?.channel) ?? resolveRegistryUpdateChannel({ currentVersion: gatewayVersion })
			} : {}
		});
	}
	drifts.sort((a, b) => a.pluginId.localeCompare(b.pluginId));
	return {
		gatewayVersion,
		drifts
	};
}
//#endregion
export { shouldSkipUnchangedNpmInstall as C, shouldBypassTrustedOfficialUnchangedNpmCheck as S, resolveExactNpmSpecVersion as _, resolvePluginVersionDriftTargets as a, resolveNpmSpecPackageName as b, formatBetaChannelFallbackOutcomeSuffix as c, isPluginInstallRecordUpdateSource as d, isTrustedSourceLinkedOfficialBridgeNpmInstall as f, resolveClawHubUpdateSpecs as g, resolveClawHubNpmUpdateFallback as h, resolvePluginVersionDriftRegistryLag as i, isBridgeRegistryInstall as l, pluginInstallRecordMayMigrateConfigId as m, hasOfficialPluginVersionCandidates as n, resolvePluginVersionDriftUpdateCommand as o, isTrustedSourceLinkedOfficialNpmUpdate as p, resolveOfficialPluginCohortNpmSpecs as r, expectedIntegrityForNpmUpdate as s, detectPluginVersionDrift as t, isNpmMetadataCompatibleWithCurrentHost as u, resolveNewerExactPinnedClawHubDefaultLine as v, resolveNpmUpdateTarget as x, resolveNewerExactPinnedNpmDefaultLine as y };
