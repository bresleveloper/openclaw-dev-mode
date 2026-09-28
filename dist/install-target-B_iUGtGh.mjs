import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as resolveSafeInstallDir, t as assertCanonicalPathWithinBase } from "./install-safe-path-Nbwl6YSJ.mjs";
import fs from "node:fs/promises";
//#region src/infra/install-target.ts
/** Resolves and verifies an install target directory under a canonical base directory. */
async function resolveCanonicalInstallTarget(params) {
	await fs.mkdir(params.baseDir, { recursive: true });
	const targetDirResult = resolveSafeInstallDir({
		baseDir: params.baseDir,
		id: params.id,
		invalidNameMessage: params.invalidNameMessage,
		nameEncoder: params.nameEncoder
	});
	if (!targetDirResult.ok) return {
		ok: false,
		error: targetDirResult.error
	};
	try {
		await assertCanonicalPathWithinBase({
			baseDir: params.baseDir,
			candidatePath: targetDirResult.path,
			boundaryLabel: params.boundaryLabel
		});
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
	return {
		ok: true,
		targetDir: targetDirResult.path
	};
}
/** Ensures install mode does not overwrite an existing target; update mode may reuse it. */
async function ensureInstallTargetAvailable(params) {
	if (params.mode === "install" && await pathExists(params.targetDir)) return {
		ok: false,
		error: params.alreadyExistsError
	};
	return { ok: true };
}
//#endregion
export { resolveCanonicalInstallTarget as n, ensureInstallTargetAvailable as t };
