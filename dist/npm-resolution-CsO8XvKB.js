import { t as buildNpmResolutionFields } from "./install-source-utils-3l_kmjSm.js";
//#region src/cli/npm-resolution.ts
/** Choose the install-record spec for an npm package, optionally pinning to the resolved version. */
function resolvePinnedNpmSpec(params) {
	const recordSpec = params.pin && params.resolvedSpec ? params.resolvedSpec : params.rawSpec;
	if (!params.pin) return { recordSpec };
	if (!params.resolvedSpec) return {
		recordSpec,
		pinWarning: "Could not resolve exact npm version for --pin; storing original npm spec."
	};
	return {
		recordSpec,
		pinNotice: `Pinned npm install record to ${params.resolvedSpec}.`
	};
}
/** Build the npm section of a plugin install record. */
function buildNpmInstallRecordFields(params) {
	return {
		source: "npm",
		spec: params.spec,
		installPath: params.installPath,
		version: params.version,
		...buildNpmResolutionFields(params.resolution)
	};
}
/** Resolve and log npm pinning decisions before constructing the persisted install record. */
function resolvePinnedNpmInstallRecord(params) {
	const pinInfo = resolvePinnedNpmSpec({
		rawSpec: params.rawSpec,
		pin: params.pin,
		resolvedSpec: params.resolution?.resolvedSpec
	});
	logPinnedNpmSpecMessages(pinInfo, params.log, params.warn);
	return buildNpmInstallRecordFields({
		spec: pinInfo.recordSpec,
		installPath: params.installPath,
		version: params.version,
		resolution: params.resolution
	});
}
/** CLI adapter for npm install-record pinning with styled warning output. */
function resolvePinnedNpmInstallRecordForCli(rawSpec, pin, installPath, version, resolution, log, warnFormat) {
	return resolvePinnedNpmInstallRecord({
		rawSpec,
		pin,
		installPath,
		version,
		resolution,
		log,
		warn: (message) => log(warnFormat(message))
	});
}
/** Emit any user-facing notice or warning from npm pin resolution. */
function logPinnedNpmSpecMessages(pinInfo, log, logWarn) {
	if (pinInfo.pinWarning) logWarn(pinInfo.pinWarning);
	if (pinInfo.pinNotice) log(pinInfo.pinNotice);
}
//#endregion
export { resolvePinnedNpmInstallRecordForCli as n, buildNpmInstallRecordFields as t };
