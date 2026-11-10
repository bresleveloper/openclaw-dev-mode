import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { c as extractArchive, f as resolvePackedRootDir } from "./archive-R2ClviiB.mjs";
import { n as resolveInstallWorkTimeoutMs } from "./install-mode-options-C9VDc932.mjs";
import { l as withInstallWorkspace } from "./install-source-utils-DCME3COX.mjs";
import { c as withInstallActivity } from "./install-package-dir-CWKW8ewy.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/install-flow.ts
async function resolveExistingInstallPath(inputPath) {
	const resolvedPath = resolveUserPath(inputPath);
	if (!await pathExists(resolvedPath)) return {
		ok: false,
		error: `path not found: ${resolvedPath}`
	};
	return {
		ok: true,
		resolvedPath,
		stat: await fs.stat(resolvedPath)
	};
}
async function withExtractedArchiveRoot(params) {
	return await withInstallWorkspace(params.tempDirPrefix, async (tmpDir) => {
		const extractDir = path.join(tmpDir, "extract");
		await fs.mkdir(extractDir, { recursive: true });
		params.logger?.info?.(`Extracting ${params.archivePath}…`);
		try {
			await withInstallActivity(params.logger, "extract", () => extractArchive({
				archivePath: params.archivePath,
				destDir: extractDir,
				stripComponents: 0,
				timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs) ?? 0,
				logger: params.logger,
				limits: params.verification?.limits ?? params.limits,
				entryFilter: params.verification?.entryFilter,
				durable: false
			}));
		} catch (err) {
			if (params.verification) return params.verification.onExtractionError(err);
			return {
				ok: false,
				error: `failed to extract archive: ${String(err)}`
			};
		}
		const verificationFailure = await params.verification?.verify(extractDir);
		if (verificationFailure) return verificationFailure;
		let rootDir;
		try {
			rootDir = await resolvePackedRootDir(extractDir, { rootMarkers: params.rootMarkers ? [...params.rootMarkers] : void 0 });
		} catch (err) {
			return {
				ok: false,
				error: String(err)
			};
		}
		return await params.onExtracted(rootDir);
	});
}
//#endregion
export { withExtractedArchiveRoot as n, resolveExistingInstallPath as t };
