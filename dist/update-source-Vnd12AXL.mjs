import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { a as isPrereleaseSemverVersion, i as isPrereleaseResolutionAllowed, o as parseRegistryNpmSpec, r as isExactSemverVersion, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { o as unscopedPackageName } from "./install-safe-path-Nbwl6YSJ.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-CurpuyOg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { D as resolveClawHubInstallSpecsForUpdateChannel, O as resolveDefaultNpmSpec, k as resolveNpmInstallSpecsForUpdateChannel, p as resolveOfficialExternalPluginInstall, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { n as isUnavailableClawHubTarget } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { l as resolveTrustedSourceLinkedOfficialNpmSpec, t as hasOfficialNpmIdReplacement } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DRd0HJBG.mjs";
import { n as fetchClawHubPackageDetail, s as resolveLatestVersionFromPackage } from "./clawhub-packages-DqSmfyli.mjs";
import { n as expectedIntegrityForUpdate, t as comparePackageUpdateVersions } from "./package-update-utils-Ds9d2bwt.mjs";
import { r as loadNpmPackageVersions, s as resolveNpmSpecMetadata } from "./install-source-utils-CeCvRCDR.mjs";
//#region src/plugins/update-source.ts
function isPluginInstallRecordUpdateSource(record) {
	return record?.source === "npm" || record?.source === "marketplace" || record?.source === "clawhub" || record?.source === "git";
}
/** Return whether update identity compatibility can migrate an unscoped install key. */
function pluginInstallRecordMayMigrateConfigId(params) {
	if (!isPluginInstallRecordUpdateSource(params.record)) return false;
	if (params.record?.source !== "npm") return !params.pluginId.includes("/");
	const packageName = resolveNpmSpecPackageName(params.specOverride ?? params.record.spec) ?? params.record.resolvedName ?? resolveNpmSpecPackageName(params.record.resolvedSpec);
	return packageName !== void 0 && packageName !== params.pluginId && unscopedPackageName(packageName) === params.pluginId || hasOfficialNpmIdReplacement(params);
}
function shouldSkipUnchangedNpmInstall(params) {
	if (!params.currentVersion || !params.metadata.version) return false;
	if (params.currentVersion !== params.metadata.version) return false;
	if (!params.record.resolvedName || !params.record.resolvedSpec || !params.record.resolvedVersion) return false;
	if (!params.metadata.name || !params.metadata.resolvedSpec) return false;
	if (params.metadata.integrity && !params.record.integrity) return false;
	if (params.metadata.shasum && !params.record.shasum) return false;
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
async function resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate(params) {
	const parsedSpec = parseRegistryNpmSpec(params.spec);
	if (!parsedSpec || !parsedSpec.name.startsWith("@openclaw/") || !params.metadata.version || isPrereleaseResolutionAllowed({
		spec: parsedSpec,
		resolvedVersion: params.metadata.version
	})) return;
	const versions = await loadNpmPackageVersions({
		packageName: parsedSpec.name,
		timeoutMs: params.timeoutMs
	});
	const stableVersion = versions?.filter((value) => !isPrereleaseSemverVersion(value)).toSorted(comparePackageUpdateVersions).at(-1);
	if (stableVersion) {
		const stableMetadata = await resolveNpmSpecMetadata({
			spec: `${parsedSpec.name}@${stableVersion}`,
			timeoutMs: params.timeoutMs
		});
		return stableMetadata.ok ? {
			kind: "stable",
			metadata: stableMetadata.metadata
		} : void 0;
	}
	const prereleaseVersion = versions?.filter(isPrereleaseSemverVersion).toSorted(comparePackageUpdateVersions).at(-1);
	if (!prereleaseVersion || !versions?.every(isPrereleaseSemverVersion)) return;
	if (prereleaseVersion === params.metadata.version) return {
		kind: "prerelease-only",
		metadata: params.metadata
	};
	const prereleaseMetadata = await resolveNpmSpecMetadata({
		spec: `${parsedSpec.name}@${prereleaseVersion}`,
		timeoutMs: params.timeoutMs
	});
	return prereleaseMetadata.ok ? {
		kind: "prerelease-only",
		metadata: prereleaseMetadata.metadata
	} : void 0;
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
function isBundledVersionNewer(bundledVersion, installedVersion) {
	return comparePackageUpdateVersions(bundledVersion, installedVersion) > 0;
}
function shouldFallbackBetaClawHubUpdate(result) {
	return isUnavailableClawHubTarget(result);
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
function resolveNpmResultVersion(result) {
	return result.npmResolution?.version;
}
function isTrustedSourceLinkedOfficialNpmUpdate(params) {
	const officialPackageName = resolveNpmSpecPackageName(resolveTrustedSourceLinkedOfficialNpmSpec(params));
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
export { resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate as _, isNpmMetadataCompatibleWithCurrentHost as a, shouldSkipUnchangedNpmInstall as b, isTrustedSourceLinkedOfficialNpmUpdate as c, resolveExactNpmSpecVersion as d, resolveNewerExactPinnedClawHubDefaultLine as f, resolveNpmUpdateTarget as g, resolveNpmSpecPackageName as h, isBundledVersionNewer as i, pluginInstallRecordMayMigrateConfigId as l, resolveNpmResultVersion as m, formatBetaChannelFallbackOutcomeSuffix as n, isPluginInstallRecordUpdateSource as o, resolveNewerExactPinnedNpmDefaultLine as p, isBridgeRegistryInstall as r, isTrustedSourceLinkedOfficialBridgeNpmInstall as s, expectedIntegrityForNpmUpdate as t, resolveClawHubUpdateSpecs as u, shouldBypassTrustedOfficialUnchangedNpmCheck as v, shouldFallbackBetaClawHubUpdate as y };
