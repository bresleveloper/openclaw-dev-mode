import { m as isPathInsideWithRealpath, p as isPathInside } from "./includes-rygJQufe.mjs";
import { i as readJson } from "./json-files-DYmSFHoN.mjs";
import { d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { i as isPrereleaseResolutionAllowed, n as formatPrereleaseResolutionError, s as parseRegistryNpmSpecResult } from "./npm-registry-spec-B_IER0ZB.mjs";
import { d as resolveArchiveKind } from "./archive-R2ClviiB.mjs";
import { r as resolveTimedInstallModeOptions, t as resolveInstallModeOptions } from "./install-mode-options-C9VDc932.mjs";
import { a as packNpmSpecToArchive, l as withInstallWorkspace, o as resolveArchiveSourcePath } from "./install-source-utils-DCME3COX.mjs";
import { r as installPackageDir } from "./install-package-dir-CWKW8ewy.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-C9ZL9MoY.mjs";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-BW-XNoSb.mjs";
import { n as resolveCanonicalInstallTarget, t as ensureInstallTargetAvailable } from "./install-target-DX2qedXN.mjs";
//#region src/infra/install-from-npm-spec.ts
function isSuccessfulInstallResult(result) {
	return result.ok;
}
async function installFromValidatedNpmSpecArchive(params) {
	const spec = params.spec.trim();
	const parsedSpec = parseRegistryNpmSpecResult(spec);
	if (!parsedSpec.ok) return parsedSpec;
	const flowResult = await withInstallWorkspace(params.tempDirPrefix, async (tmpDir) => {
		const packedResult = await packNpmSpecToArchive({
			spec,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			cwd: tmpDir
		});
		if (!packedResult.ok) return packedResult;
		const npmResolution = {
			...packedResult.metadata,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (npmResolution.version && !isPrereleaseResolutionAllowed({
			spec: parsedSpec.parsed,
			resolvedVersion: npmResolution.version
		})) return {
			ok: false,
			error: formatPrereleaseResolutionError({
				spec: parsedSpec.parsed,
				resolvedVersion: npmResolution.version
			})
		};
		const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
			spec,
			expectedIntegrity: params.expectedIntegrity,
			resolution: npmResolution,
			onIntegrityDrift: params.onIntegrityDrift,
			warn: params.warn
		});
		if (driftResult.error) return {
			ok: false,
			error: driftResult.error
		};
		return {
			ok: true,
			installResult: await params.installFromArchive({
				archivePath: packedResult.archivePath,
				...params.archiveInstallParams
			}),
			npmResolution,
			integrityDrift: driftResult.integrityDrift
		};
	});
	if (!flowResult.ok) return flowResult;
	const installResult = flowResult.installResult;
	if (!isSuccessfulInstallResult(installResult)) return installResult;
	return {
		...installResult,
		npmResolution: flowResult.npmResolution,
		...flowResult.integrityDrift ? { integrityDrift: flowResult.integrityDrift } : {}
	};
}
//#endregion
export { ensureInstallTargetAvailable, pathExists as fileExists, installFromValidatedNpmSpecArchive, installPackageDir, isPathInside, isPathInsideWithRealpath, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveExistingInstallPath, resolveInstallModeOptions, resolveTimedInstallModeOptions, withExtractedArchiveRoot };
