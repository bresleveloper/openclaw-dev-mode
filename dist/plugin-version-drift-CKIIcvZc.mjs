import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { c as resolveOpenClawReleaseCohortVersion, o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { n as satisfiesPluginApiRange } from "./package-compat-CurpuyOg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { l as resolveTrustedSourceLinkedOfficialNpmSpec, o as resolveTrustedSourceLinkedOfficialClawHubInstall } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DRd0HJBG.mjs";
import { n as fetchClawHubPackageDetail, s as resolveLatestVersionFromPackage } from "./clawhub-packages-DqSmfyli.mjs";
import { r as isPackageVersionDowngrade } from "./package-update-utils-Ds9d2bwt.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-wgYVxidq.mjs";
import { u as resolveClawHubUpdateSpecs } from "./update-source-Vnd12AXL.mjs";
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
async function resolveClawHubEntryTarget(entry) {
	const packageName = entry.clawhubPackage;
	if (!packageName) return entry;
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
			...entry,
			targetResolution: {
				status: "unresolved",
				packageName,
				requestedTarget,
				error: `ClawHub latest metadata cannot confirm the selected target ${selectedSpec}`
			}
		};
	} catch (err) {
		return {
			...entry,
			targetResolution: {
				status: "unresolved",
				packageName,
				requestedTarget,
				error: String(err)
			}
		};
	}
	const { version: latestVersion, error } = await fetchClawHubLatestVersion(packageName, entry.gatewayVersion, entry.clawhubUrl);
	if (!latestVersion) return {
		...entry,
		targetResolution: {
			status: "unresolved",
			packageName,
			requestedTarget,
			error: error ?? `ClawHub reported no latest version for ${packageName}`
		}
	};
	if (latestVersion === entry.installedVersion) return {
		...entry,
		targetResolution: {
			status: "registry-current",
			packageName,
			requestedTarget,
			version: latestVersion
		}
	};
	if (isPackageVersionDowngrade(entry.installedVersion, latestVersion)) return {
		...entry,
		targetResolution: {
			status: "unresolved",
			packageName,
			requestedTarget,
			error: `ClawHub latest ${latestVersion} is older than installed ${entry.installedVersion}`
		}
	};
	return {
		...entry,
		targetResolution: {
			status: "resolved",
			packageName,
			requestedTarget,
			version: latestVersion
		}
	};
}
async function resolveEntryTarget(entry) {
	if (entry.source === "clawhub") return await resolveClawHubEntryTarget(entry);
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
	const officialNpmSpec = resolveTrustedSourceLinkedOfficialNpmSpec(params);
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
		const official = resolveTrustedSourceLinkedOfficialNpmSpec({
			pluginId,
			record
		});
		const packageName = official ? parseRegistryNpmSpec(official)?.name : void 0;
		if (packageName && parseRegistryNpmSpec(`${packageName}@${version}`)?.selectorKind === "exact-version") specs[pluginId] = `${packageName}@${version}`;
	}
	return specs;
}
/**
* Compare active official external plugin installs against an OpenClaw host
* version and return any mismatches.
*
* @param params.gatewayVersion The host version the plugins must match.
* @param params.installRecords The full set of recorded plugin installs (as
*   produced by `loadInstalledPluginIndexInstallRecords`).
* @param params.config The merged daemon-side OpenClawConfig (optional).
*   Plugins inactive under the effective activation policy are skipped.
*
* The returned `drifts` list is sorted by `pluginId` for stable output.
*/
function detectPluginVersionDrift(params) {
	const { gatewayVersion, installRecords, config } = params;
	const normalizedGateway = resolveOpenClawReleaseCohortVersion(gatewayVersion);
	const drifts = [];
	for (const [pluginId, record] of Object.entries(installRecords)) {
		if (!record) continue;
		if (!isPluginEnabled(config, pluginId)) continue;
		if (!shouldCompareOfficialInstallToGateway({
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
export { resolvePluginVersionDriftTargets as a, resolvePluginVersionDriftRegistryLag as i, hasOfficialPluginVersionCandidates as n, resolvePluginVersionDriftUpdateCommand as o, resolveOfficialPluginCohortNpmSpecs as r, detectPluginVersionDrift as t };
