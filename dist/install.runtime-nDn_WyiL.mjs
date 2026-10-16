import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import { m as isPathInsideWithRealpath, p as isPathInside } from "./includes-BkzfmxST.mjs";
import { i as readJson } from "./json-files-C5mNTScg.mjs";
import { i as isPrereleaseResolutionAllowed, n as formatPrereleaseResolutionError, s as parseRegistryNpmSpecResult } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { f as resolveArchiveKind } from "./archive-DqZZMnnW.mjs";
import { r as resolveTimedInstallModeOptions, t as resolveInstallModeOptions } from "./install-mode-options-HTpLEgtT.mjs";
import { a as packNpmSpecToArchive, l as withInstallWorkspace, o as resolveArchiveSourcePath } from "./install-source-utils-CQUKARYZ.mjs";
import { r as installPackageDir } from "./install-package-dir-BIZrRqZG.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-C9ZL9MoY.mjs";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-3Ckr_bLy.mjs";
import { n as resolveCanonicalInstallTarget, t as ensureInstallTargetAvailable } from "./install-target-BpkMi5LQ.mjs";
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
